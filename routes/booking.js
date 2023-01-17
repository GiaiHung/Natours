const express = require('express')
const { protect } = require('../controllers/auth/middleware')
const { getCheckourSession } = require('../controllers/booking')

const router = express.Router()

router.get('/checkout-session/:tourId', protect, getCheckourSession)

module.exports = router
