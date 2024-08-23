const router = require('express').Router()

const User = require('../models/user')
const ActiveSessions = require('../models/activeSession')

router.delete('/', async (request, response, next) => {
  const body = request.body
  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  try {
    await ActiveSessions.destroy({
      where: {
        userId:user.id
      }
    })
  } catch (error) {
    return next(error)
  }
  response
    .status(204)
    .send("token removed")
})

module.exports = router