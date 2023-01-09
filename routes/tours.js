const express = require('express')

const router = express.Router()
const {
  getAllTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
  getToursWithin,
  getTourDistances,
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
router.get('/', getAllTours)
router.get('/top-tour', aliasTopTour, getAllTours)
router.get('/tour-stats', getTourStats)
router.get(
  '/monthly-plan/:year',
  protect,
  restrictTo('admin', 'lead-guide', 'guide'),
  getMonthlyPlan
)
router.get('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin)
router.get('/distances/:latlng/unit/:unit', getTourDistances)
router.get('/:id', getTour)

router.use(protect)
router.post('/', restrictTo('admin', 'lead-guide'), addTour)

router.patch('/:id', restrictTo('admin', 'lead-guide'), updateTour)

router.delete('/:id', restrictTo('admin'), deleteTour)

module.exports = router
