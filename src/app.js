const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const routes = require('./routes/index.route')
const apiRoutes = require('./routes/api/index.route')

// App Instance
const app = express()


// Middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))


// Routes
app.use('/api', apiRoutes)
app.use('/', routes)
app.use('*', (req, res) => {
    res.status(404).json({ status: 404, message: 'Route not exits!' })
})

module.exports = { app }
