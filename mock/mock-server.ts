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
// user:
router.get('/users', api.getUsers)
router.post('/users/info', api.getUserInfo)
router.get('/users/:username', api.getUserByName)
router.put('/users/:username', api.updateUser)
router.delete('/users/:username', api.deleteUser)
router.post('/users/login', api.login)
router.post('/users/logout', api.logout)
router.post('/users/register', api.register)
// user-management:
router.get('/user-management/user-list', api.getUserList)
router.delete('/user-management/user-list/:id', api.deleteUserById)
router.post('/user-management/user-list', api.createUser)
router.put('/user-management/user-list/:id', api.updateUserById)
router.get('/user-management/roles', api.getAllRoles)
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
router.put('/enterprises/:id', api.updateEnterpriseById)
router.post('/enterprises', api.createEnterprise)
// project:
router.get('/projects', api.getProjectList)
router.delete('/projects/:id', api.deleteProjectById)
router.post('/projects', api.createProject)
router.put('/projects/:id', api.updateProjectById)
// labeling-management:
// label-data:
router.get('/labels-data', api.getLabelDataList)
router.delete('/labels-data/:id', api.deleteLabelDataById)
router.post('/labels-data', api.createLabelData)
router.put('/labels-data/:id', api.updateLabelDataById)
// label-group:
router.get('/labels-set', api.getLabelGroupList)
router.delete('/labels-set/:id', api.deleteLabelGroupById)
router.post('/labels-set', api.createLabelGroup)
router.put('/labels-set/:id', api.updateLabelGroupById)
// dataset:
router.get('/datasets', api.getDatasetList)
router.delete('/datasets/:id', api.deleteDatasetById)
router.post('/datasets', api.createDataset)
router.put('/datasets/:id', api.updateDatasetById)
// data:
router.get('/datas', api.getDataList)
router.delete('/datas/:id', api.deleteDataById)

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
