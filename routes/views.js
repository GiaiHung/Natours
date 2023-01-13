const express = require('express')
const { isLoggedIn } = require('../controllers/auth/middleware')
const { getOverview, getTour, login } = require('../controllers/views')

const router = express.Router()

router.use(isLoggedIn)

router.get('/', getOverview)
router.get('/tour/:slug', getTour)
router.get('/login', login)

module.exports = router
