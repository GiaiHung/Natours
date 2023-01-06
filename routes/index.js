const toursRouter = require('./tours')
const authRouter = require('./auth')
const userRouter = require('./users')
const reviewRouter = require('./reviews')
const AppError = require('../utils/appError')
const errorHandler = require('../controllers/error')

const route = (app) => {
  app.use('/api/v1/tours', toursRouter)
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/users', userRouter)
  app.use('/api/v1/reviews', reviewRouter)

  // Handling not found routes
  app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404))
  })

  // Global error handler middleware
  app.use(errorHandler)
}

module.exports = route
