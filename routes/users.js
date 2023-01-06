const express = require('express')
const {
  getAllUsers,
  editProfile,
  updateUser,
  deleteMe,
  deleteUser,
  getUser,
} = require('../controllers/users')
const { protect } = require('../controllers/auth/middleware')

const router = express.Router()

// USERS CRUD
router.get('/', getAllUsers)
router.get('/:id', getUser)

router.put('/updateUser', updateUser)
router.put('/editProfile', protect, editProfile)

router.delete('/deleteMe', protect, deleteMe)
router.delete('/:id', deleteUser)

module.exports = router
