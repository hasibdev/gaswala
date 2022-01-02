require('dotenv').config()

const http = require('http')
const { app } = require('./app')
const { sequelize } = require('./models')


// Application Configuration
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 5000

// Server Running
const server = http.createServer(app)

server.on('listening', async function () {
   console.log(`Application running on http://${host}:${port}`)
   try {
      await sequelize.authenticate()
      console.log('Connection has been established successfully.')
   } catch (error) {
      console.error('Unable to connec to the Database:', error)
   }
})
server.listen(port)