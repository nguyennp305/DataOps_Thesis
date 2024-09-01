import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import http from 'http'
// import path from 'path'
// import yaml from 'yamljs'
import * as api from './api'
// import { accessTokenAuth } from './security'
// import { connector, summarise } from 'swagger-routes-express'

const app = express()
const port = 9528

// Create router
const router = express.Router()

// Compression
app.use(compression())
// Logger
app.use(morgan('dev'))
// Enable CORS
app.use(cors())
// POST, PUT, DELETE body parser
app.use(express.json({ limit: '20mb' }))
app.use(
  express.urlencoded({
    limit: '20mb',
    extended: false
  })
)
// No cache
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Pragma', 'no-cache')
  res.header('Expires', '-1')
  next()
})

// Manually define routes using the imported APIs
// users:import { getRoles } from './../src/api/roles';

router.get('/users', api.getUsers)
router.post('/users/info', api.getUserInfo)
router.get('/users/:username', api.getUserByName)
router.put('/users/:username', api.updateUser)
router.delete('/users/:username', api.deleteUser)
router.post('/users/login', api.login)
router.post('/users/logout', api.logout)
router.post('/users/register', api.register)
// transactions:
router.get('/transactions', api.getTransactions)
// articles:
router.get('/articles', api.getArticles)
router.get('/articles/:id', api.getArticle)
router.post('/articles', api.createArticle)
router.put('/articles/:id', api.updateArticle)
router.delete('/articles/:id', api.deleteArticle)
router.get('/pageviews', api.getPageviews)
// getRoles:
router.get('/roles', api.getRoles)
router.post('/roles', api.createRole)
router.put('/roles/:id', api.updateRole)
router.delete('/roles/:id', api.deleteRole)
router.get('/routes', api.getRoutes)
// enterprise:
router.get('/enterprises', api.getEnterprises)
router.delete('/enterprises/:id', api.deleteEnterprise)
router.put('/enterprises/:id', api.updateEnterprise)

// Use the router with the prefix
app.use('/mock-api/v1', router)

// Catch 404 error
app.use((req, res) => {
  const err = new Error('Not Found')
  res.status(404).json({
    message: err.message,
    error: err
  })
})

// Create HTTP server.
const server = http.createServer(app)

// Listen on provided port, on all network interfaces.
server.listen(port)
server.on('error', onError)
console.log('Mock server started on port ' + port + '!')

// Event listener for HTTP server "error" event.
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(
        'Express ERROR (app) : %s requires elevated privileges',
        bind
      )
      process.exit(1)
    case 'EADDRINUSE':
      console.error('Express ERROR (app) : %s is already in use', bind)
      process.exit(1)
    default:
      throw error
  }
}
