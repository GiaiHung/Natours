const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')
const sendEmail = require('../../utils/sendMail')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  })

  const token = signToken(newUser._id)

  res.status(201).json({
    message: 'success',
    token,
    data: {
      user: newUser,
    },
  })
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

  const token = signToken(user._id)

  res.status(200).json({
    status: 'success',
    token,
  })
})

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
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your reset password (valid for 10 minutes)',
      message,
    })
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

const resetPassword = (req, res, next) => {}

module.exports = { signup, login, forgotPassword, resetPassword }
