const express = require('express')
const { getAllUsers, editProfile, updateUser } = require('../controllers/users')
const { protect } = require('../controllers/auth/middleware')

const router = express.Router()

// USERS CRUD
router.get('/', getAllUsers)

router.put('/updateUser', updateUser)
router.put('/editProfile', protect, editProfile)

module.exports = router
