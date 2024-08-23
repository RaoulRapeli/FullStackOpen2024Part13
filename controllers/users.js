const router = require('express').Router()
const { Op } = require('sequelize')
const { sequelize } = require('../util/db')

const { User, Blog, ActiveSessions } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] }
        }
    })
    res.json(users)
})

router.post('/', async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch (error) {
        return next(error)
    }
})

router.put('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id)
    if (user) {
        user.username = req.body.username
        await user.save()
        res.json(user)
    } else {
        res.status(404).end()
    }
})

router.get('/:id', async (req, res) => {

    const where = {}
    console.log('req.query.search',req.query.read)
    if (req.query.read) {
        where.read = {
            [Op.eq]: req.query.read
        }
    }

    const user = await User.scope('hasActiveSessionAndNotDisabled').findByPk(req.params.id, {
        attributes: { exclude: ['id','createdAt','updatedAt'] },
        include: [
            {
                model: Blog,
                as: 'readings',
                attributes: { exclude: ['userId'] },
                through: {
                    as:'readinglists',
                    where,
                    attributes: ['read','id']
                }
            }
        ]
    })
    
    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})

module.exports = router