const express = require('express')
const { getOverview, getTour, login } = require('../controllers/views')

const router = express.Router()

router.get('/', getOverview)
router.get('/tour/:slug', getTour)
router.get('/login', login)

module.exports = router