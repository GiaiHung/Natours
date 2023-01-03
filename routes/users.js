const express = require('express')
const {
  getAllUsers,
  editProfile,
  updateUser,
  deleteMe,
} = require('../controllers/users')
const { protect } = require('../controllers/auth/middleware')

const router = express.Router()

// USERS CRUD
router.get('/', getAllUsers)

router.put('/updateUser', updateUser)
router.put('/editProfile', protect, editProfile)

router.delete('/deleteMe', protect, deleteMe)

module.exports = router
