const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../../models/User')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')
const Email = require('../../utils/sendMail')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

const sendToken = (user, message, statusCode, res, showData = false) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expiresIn: Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('token', token, cookieOptions)

  user.password = undefined
  user.active = undefined

  if (!showData) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      token,
    })
  }

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: {
      user,
    },
  })
}

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  })

  const url = `${req.protocol}://${req.get('host')}/me`
  await new Email(newUser, url).sendWelcome()

  sendToken(newUser, 'User created successfully', 201, res, true)
})

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(new AppError('Please provide both email and password', 400))
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return next(new AppError('Incorrect email, user does not exist', 401))
  }
  const validatePassword = await user.validatePassword(password, user.password)
  if (!validatePassword) {
    return next(new AppError('Wrong password', 401))
  }

  sendToken(user, 'Logged in successfully', 200, res)
})

const logout = (req, res) => {
  // The way we log out user is send another cookie same name to overwrite the existing one
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  res.status(200).json({ status: 'success' })
}

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return next(new AppError('Incorrect email, user does not exist', 404))
  }

  // 2) Create reset token
  const resetToken = user.createResetPasswordToken()
  await user.save({ validateBeforeSave: false })

  // 3) Send to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`

  try {
    await new Email(user, resetURL).sendResetPassword()
  } catch (error) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(new AppError("Can't send email, please try again", 500))
  }

  res.status(200).json({
    status: 'success',
    message: 'Reset email sent successfully',
  })
})

const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get the user by reset token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex')
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })
  if (!user) {
    return next(
      new AppError('Token is invalid or expired. Please try again', 400)
    )
  }

  // 2) Set new password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  // 3) Create JWT and log user in
  sendToken(user, 'Password has been updated successfully', 200, res)
})

const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Find user
  const user = await User.findById(req.user._id).select('+password')
  if (!user) {
    return next(new AppError('You are not authenticated. Please login first.'))
  }

  // 2) Check password
  const isPasswordCorrect = await user.validatePassword(
    req.body.oldPassword,
    user.password
  )
  if (!isPasswordCorrect) {
    return next(
      new AppError('Old password is incorrect. Please try again'),
      401
    )
  }

  // 3) Change password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()

  // 4) Send JWT, log user in
  sendToken(user, 'Password has been updated successfully', 200, res)
})

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
}
