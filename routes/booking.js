const express = require('express')
const { protect, restrictTo } = require('../controllers/auth/middleware')
const {
  getCheckourSession,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  addBooking,
} = require('../controllers/booking')

const router = express.Router({ mergeParams: true })

router.get('/checkout-session/:tourId', protect, getCheckourSession)
// BOOKING CRUD'
router.use(protect)
router.get('/', restrictTo('admin', 'guide', 'lead-guide'), getAllBookings)
router.get('/:id', restrictTo('admin', 'guide', 'lead-guide'), getBooking)
router.post('/', restrictTo('admin', 'lead-guide'), addBooking)
router.patch('/:id', restrictTo('admin', 'lead-guide'), updateBooking)
router.delete('/:id', restrictTo('admin'), deleteBooking)

module.exports = router
