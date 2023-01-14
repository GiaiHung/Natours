const express = require('express')
const { isLoggedIn, protect } = require('../controllers/auth/middleware')
const { getOverview, getTour, login, getMe } = require('../controllers/views')

const router = express.Router()

router.get('/me', protect, getMe)

// Route below this route will be checked for logged in or not but not throw any error
router.use(isLoggedIn)

router.get('/', getOverview)
router.get('/tour/:slug', getTour)
router.get('/login', login)

module.exports = router
