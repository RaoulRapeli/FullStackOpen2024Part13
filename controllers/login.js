const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const ActiveSessions = require('../models/activeSession')

router.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.scope('notDisabled').findOne({
    where: {
      username: body.username
    }
  })

  if(!user){
    return response.status(401).json({
      error: 'user is disabled'
    })
  }

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  try {
    await ActiveSessions.destroy({
      where: {
        userId:user.id
      }
    })
    await ActiveSessions.create({session: token, userId:user.id})
  } catch (error) {
    return next(error)
  }

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router