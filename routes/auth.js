const express = require('express')
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/auth')
const { protect } = require('../controllers/auth/middleware')

const router = express.Router()

// AUTHENTICATION
router.post('/signup', signup)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:resetToken', resetPassword)

router.patch('/updatePassword', protect, updatePassword)

module.exports = router
