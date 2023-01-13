const express = require('express')
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
} = require('../controllers/auth')
const { protect } = require('../controllers/auth/middleware')

const router = express.Router()

// AUTHENTICATION
router.get('/logout', logout)

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:resetToken', resetPassword)

router.patch('/updatePassword', protect, updatePassword)

module.exports = router
