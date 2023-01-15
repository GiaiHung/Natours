const multer = require('multer')
const sharp = require('sharp')
const User = require('../../models/User')
const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')
const { filterObj } = require('./helper')
const { deleteOne, updateOne, getOne, getAll } = require('../handler')

// Save to local storage, use it when not need img processing
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/img/users')
//   },
//   filename: function (req, file, cb) {
//     const extension = file.mimetype.split('/')[1]
//     cb(null, `user-${req.user._id}-${Date.now()}.${extension}`)
//   },
// })
// Save as buffer
const multerStorage = multer.memoryStorage()
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('File is not an image. Please try again', 400), false)
  }
}
const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
const uploadUserPhoto = upload.single('photo')

const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next()

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`

  // sharp can access buffer and modify the user uploaded file
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`)

  next()
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
  if (req.file) filteredBody.photo = req.file.filename
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

// Used for admin, DO NOT UPDATE PASSWORD
const getAllUsers = getAll(User)
const getUser = getOne(User)
const updateUser = updateOne(User)
const deleteUser = deleteOne(User)

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  editProfile,
  deleteUser,
  deleteMe,
  uploadUserPhoto,
  resizeUserPhoto,
}
