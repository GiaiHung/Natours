const express = require('express')
const {
  getAllUsers,
  editProfile,
  updateUser,
  deleteMe,
  deleteUser,
  getUser,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controllers/users')
const { protect, restrictTo } = require('../controllers/auth/middleware')
const { getMe } = require('../controllers/users/helper')
const bookingRouter = require('./booking')

const router = express.Router()
// Make sure user logins to go to any route below
router.use(protect)

router.use('/:userId/bookings', bookingRouter)

// USERS CRUD
router.get('/me', getMe, getUser)
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, editProfile)
router.delete('/deleteMe', deleteMe)

router.use(restrictTo('admin'))

router.get('/', getAllUsers)
router.get('/:id', getUser)
router.patch('/updateUser/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router
