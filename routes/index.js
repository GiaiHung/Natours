const toursRouter = require('./tours')

const route = (app) => {
  app.use('/api/v1/tours', toursRouter)
  // Handling not found routes
  app.all('*', (req, res, next) => {
    // res.status(404).json({
    //   status: 'Failed',
    //   message: `Cannot find ${req.originalUrl} on this server`,
    // })
    const err = new Error(`Cannot find ${req.originalUrl} on this server`)
    err.statusCode = 404
    err.status = 'Failed'
    next(err)
  })
  // Global error handler middleware
  app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'Error'

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  })
}

module.exports = route
