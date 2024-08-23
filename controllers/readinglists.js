const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { ReadingList, User } = require('../models')
const { SECRET } = require('../util/config')

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

router.post('/', async (req, res, next) => {
    try {
        const readinglists = await ReadingList.create(req.body)
        res.json(readinglists)
    } catch (error) {
        return next(error)
    }
})

router.put('/:id',tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    console.log('userID',user.id)
    const readinglists = await ReadingList.findOne({
        where:{
            id: req.params.id,
            userId: user.id
        }
    })
    if (readinglists) {
        readinglists.read = req.body.read
        await readinglists.save()
        res.json(readinglists)
    } else {
        res.status(404).end()
    }
})

module.exports = router