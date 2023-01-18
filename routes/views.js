const express = require('express')
const { isLoggedIn, protect } = require('../controllers/auth/middleware')
const { createBookingCheckout } = require('../controllers/booking')
const {
  getOverview,
  getTour,
  login,
  getMe,
  getMyTours,
  signup,
} = require('../controllers/views')

const router = express.Router()

router.get('/me', protect, getMe)

// Route below this route will be checked for logged in or not but not throw any error
router.use(isLoggedIn)

router.get('/', createBookingCheckout, getOverview)
router.get('/tour/:slug', getTour)
router.get('/login', login)
router.get('/signup', signup)
router.get('/my-tours', protect, getMyTours)

module.exports = router
