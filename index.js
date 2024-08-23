const express = require('express')
require('express-async-errors')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const errorHandler = (error, request, response, next) => {
    console.log(error)
    if (error.name === 'SequelizeValidationError') {
        return response.status(400).send({ error: [`${error.errors[0].message}`] })
    }
    if (error.name === 'SequelizeDatabaseError') {
        return response.status(400).send({ error: [`${error.parent}`] })
    }

    next(error)
}

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const authorsRouter = require('./controllers/authors')
const readingListsRouter = require('./controllers/readinglists')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListsRouter)

app.use(errorHandler)

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()