const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')
const User = require('../../models/User')

const protect = catchAsync(async (req, res, next) => {
  // 1) Check if the token is in headers and cookies
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.token) {
    // eslint-disable-next-line prefer-destructuring
    token = req.cookies.token
  }
  if (!token)
    return next(
      new AppError(
        'You are not logged in, please login first to get access.',
        401
      )
    )

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // 3) Check whether user stills exist after the token has been sent by that user
  // In case that account has been deleted, then the token would not be valid
  const user = await User.findById(decoded.id)
  if (!user) {
    return next(new AppError('User no longer exists', 401))
  }

  // 4) Check if user has changed their password
  // In case that user recognized strange login, they change their password for security
  // Then the previous token would not be valid
  if (user.getPasswordChangedAt(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again'),
      401
    )
  }

  req.user = user
  next()
})

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    // Roles: ['user', 'guide', 'lead-guide', 'admin']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permissions to take the action', 403)
      )
    }
    next()
  }

const isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.token) {
      // 2) Verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.token,
        process.env.JWT_SECRET
      )

      // 3) Check whether user stills exist after the token has been sent by that user
      // In case that account has been deleted, then the token would not be valid
      const user = await User.findById(decoded.id)
      if (!user) {
        return next()
      }

      // 4) Check if user has changed their password
      // In case that user recognized strange login, they change their password for security
      // Then the previous token would not be valid
      if (user.getPasswordChangedAt(decoded.iat)) {
        return next()
      }

      // Pug templates will be able to access locals
      res.locals.user = user
      req.user = user
      return next()
    }
  } catch (error) {
    return next()
  }
  next()
}

module.exports = { protect, restrictTo, isLoggedIn }
