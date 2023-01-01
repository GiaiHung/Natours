const toursRouter = require('./tours')
const usersRouter = require('./users')
const AppError = require('../utils/appError')
const errorHandler = require('../controllers/error')

const route = (app) => {
  app.use('/api/v1/tours', toursRouter)
  app.use('/api/v1/users', usersRouter)
  // Handling not found routes
  app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404))
  })
  // Global error handler middleware
  app.use(errorHandler)
}

module.exports = route
