const express = require('express')
const { protect, restrictTo } = require('../controllers/auth/middleware')
const {
  getAllReviews,
  createReview,
  getReview,
  deleteReview,
} = require('../controllers/reviews')

// Make sure we still get params from nested routes
const router = express.Router({ mergeParams: true })
router.get('/', getAllReviews)
router.get('/:id', getReview)

router.post('/', protect, restrictTo('user'), createReview)

router.delete('/:id', deleteReview)

module.exports = router
