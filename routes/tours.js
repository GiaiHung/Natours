const express = require('express')

const router = express.Router()
const {
  getAllTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
} = require('../controllers/tours')
const { getTourStats, getMonthlyPlan } = require('../controllers/tours/aggregates')
const { aliasTopTour } = require('../controllers/tours/middleware')

router.get('/', getAllTours)
router.get('/top-tour', aliasTopTour, getAllTours)
router.get('/tour-stats', getTourStats)
router.get('/monthly-plan/:year', getMonthlyPlan)
router.get('/:id', getTour)

router.post('/', addTour)

router.patch('/:id', updateTour)

router.delete('/:id', deleteTour)

module.exports = router
