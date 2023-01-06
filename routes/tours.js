const express = require('express')

const router = express.Router()
const {
  getAllTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
} = require('../controllers/tours')
const {
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tours/aggregates')
const { aliasTopTour } = require('../controllers/tours/middleware')
const { protect, restrictTo } = require('../controllers/auth/middleware')
const reviewRouter = require('./reviews')

// Nested route
router.use('/:tourId/reviews', reviewRouter)

// Make sure to have protect middleware before using restrict to because it needs user coming from request at protect route to authorize user role
router.get('/', protect, getAllTours)
router.get('/top-tour', aliasTopTour, getAllTours)
router.get('/tour-stats', getTourStats)
router.get('/monthly-plan/:year', getMonthlyPlan)
router.get('/:id', getTour)

router.post('/', protect, restrictTo('admin', 'lead-guide'), addTour)

router.patch('/:id', protect, restrictTo('admin', 'lead-guide'), updateTour)

router.delete('/:id', protect, restrictTo('admin'), deleteTour)

module.exports = router
