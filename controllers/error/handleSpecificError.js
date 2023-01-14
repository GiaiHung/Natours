const AppError = require('../../utils/appError')

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

const handleDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
  const message = `Duplicate field: ${value}`
  return new AppError(message, 400)
}

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleJWTInvalidToken = () =>
  new AppError('Please login to access this page!', 401)

const handleJWTExpiredToken = () =>
  new AppError('Your access has timed out', 401)

module.exports = {
  handleCastErrorDB,
  handleDuplicateErrorDB,
  handleValidatorErrorDB,
  handleJWTInvalidToken,
  handleJWTExpiredToken,
}
