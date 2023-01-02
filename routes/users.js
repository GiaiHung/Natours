const express = require('express')
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth')
const { getAllUsers } = require('../controllers/users')

const router = express.Router()

// AUTHENTICATION
router.post('/signup', signup)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)

router.patch('/resetPassword/:resetToken', resetPassword)

// USERS CRUD
router.get('/', getAllUsers)

module.exports = router
