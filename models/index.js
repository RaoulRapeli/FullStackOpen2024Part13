const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading')
const ActiveSessions = require('./activeSession')

User.hasMany(Blog)
Blog.belongsTo(User)


User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'readinglists' })
User.hasMany(ActiveSessions)

// Blog.sync({ alter: true })
// User.sync({ alter: true })

module.exports = {
  Blog, User, ReadingList, ActiveSessions
}