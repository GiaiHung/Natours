const User = require('../../models/User')
const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')
const { filterObj } = require('./helper')

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()
  res.status(200).json({
    status: 'Success',
    data: {
      users,
    },
  })
})

// Used for admin
const updateUser = catchAsync(async (req, res, next) => {
  res.status(200).json('Hello world')
})

const editProfile = catchAsync(async (req, res, next) => {
  // 1) Make sure user can't change their password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'You can not update your password on this site. Please try reset password session',
        401
      )
    )
  }

  // 2) Update user
  const filteredBody = filterObj(req.body, 'name', 'email')
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: 'success',
    message: 'Updated user successfully',
    data: {
      updatedUser,
    },
  })
})

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false })
  res.status(204).json({
    status: 'success',
    message: 'User deleted',
  })
})

module.exports = { getAllUsers, updateUser, editProfile, deleteMe }
