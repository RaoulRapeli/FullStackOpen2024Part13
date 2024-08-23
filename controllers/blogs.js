const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch {
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

router.get('/', async (req, res) => {

    const where = {}

    if (req.query.search) {
        where[Op.or] = {
            title: {[Op.substring]: req.query.search},
            author: {[Op.substring]: req.query.search}
        }
    }

    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        },
        where,
        order:[
            ['likes','DESC']
        ]
    })
    res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const user = await User.scope('hasActiveSessionAndNotDisabled').findByPk(req.decodedToken.id)
        if(user.active_sessions.length === 0){
            return res.status(401).json({ error: 'User not signed in' })
        }
        const blog = await Blog.create({ ...req.body, userId: user.id })
        res.json(blog)
    } catch (error) {
        return next(error)
    }
})

router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
    const user = await User.scope('hasActiveSessionAndNotDisabled').findByPk(req.decodedToken.id)
    if(user.active_sessions.length === 0){
        return res.status(401).json({ error: 'User not signed in' })
    }
    if (user && req.blog) {
        if (req.blog.userId === user.id) {
            await req.blog.destroy()
        }
        else {
            return res.status(401).json({ error: 'Not own blog' })
        }
    }
    res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

module.exports = router