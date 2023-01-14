const {
  handleCastErrorDB,
  handleDuplicateErrorDB,
  handleValidatorErrorDB,
  handleJWTInvalidToken,
  handleJWTExpiredToken,
} = require('./handleSpecificError')

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    })
  } else {
    // Rendered website
    res.status(err.statusCode).render('error', {
      title: 'Error',
      msg: err.message,
    })
  }
}

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client.
    // 1) Invalid ID
    // 2) Validation error when updating fields
    // 3) Duplicate fields
    // Otherwise unknown error: don't leak error details
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      })
    } else {
      console.error('ERROR 💥', err)
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      })
    }
  } else {
    // Rendered website
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
      })
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err)
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later.',
    })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }
    error.message = err.message
    // Capture error from mongoose
    if (err.name === 'CastError') error = handleCastErrorDB(err)
    if (err.code === 11000) error = handleDuplicateErrorDB(err)
    if (err.name === 'ValidationError') error = handleValidatorErrorDB(err)
    // Capture error from JWT
    if (err.name === 'JsonWebTokenError') error = handleJWTInvalidToken()
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredToken()
    sendErrorProd(error, req, res)
  }
}
