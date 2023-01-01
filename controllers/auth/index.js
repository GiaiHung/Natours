const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')

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

module.exports = { signup, login }
