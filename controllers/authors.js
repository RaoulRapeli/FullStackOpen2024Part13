const router = require('express').Router()
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize');
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')

router.get('/', async (req, res) => {

    const where = {}

    if (req.query.search) {
        where[Op.or] = {
            title: {[Op.substring]: req.query.search},
            author: {[Op.substring]: req.query.search}
        }
    }

    const authors = await Blog.findAll({
        group: 'author',
        attributes: [
            'author',
            [Sequelize.fn('count', Sequelize.col('title')), 'articles'],
            [Sequelize.fn("sum", Sequelize.col("likes")), "likes"]
        ],
        order:[
            ['likes','DESC']
        ]
        // attributes: { exclude: ['userId','id'] },
    })
    res.json(authors)
})

module.exports = router