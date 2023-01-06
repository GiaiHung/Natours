const express = require('express')
const { protect, restrictTo } = require('../controllers/auth/middleware')
const {
  getAllReviews,
  createReview,
  getReview,
  deleteReview,
  updateReview,
} = require('../controllers/reviews')
const { sendTourIdAndUser } = require('../controllers/reviews/middleware')

// Make sure we still get params from nested routes
const router = express.Router({ mergeParams: true })
router.get('/', getAllReviews)
router.get('/:id', getReview)

router.post('/', protect, restrictTo('user'), sendTourIdAndUser, createReview)

router.delete('/:id', deleteReview)

router.patch(
  '/:id',
  protect,
  restrictTo('user'),
  sendTourIdAndUser,
  updateReview
)

module.exports = router
