const express = require('express')
const { signup, login } = require('../controllers/auth')
const { getAllUsers } = require('../controllers/users')

const router = express.Router()

// AUTHENTICATION
router.post('/signup', signup)
router.post('/login', login)

// USERS CRUD
router.get('/', getAllUsers)

module.exports = router
