const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Tours = require('../../models/Tours')
const Booking = require('../../models/Booking')
// const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')
const { getAll, getOne, updateOne, deleteOne } = require('../handler')
const AppError = require('../../utils/appError')

const getCheckourSession = catchAsync(async (req, res, next) => {
  const tour = await Tours.findById(req.params.tourId)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: ['https://www.natours.dev/img/tours/tour-1-cover.jpg'],
          },
        },
      },
    ],
  })

  res.status(200).json({
    message: 'success',
    session,
  })
})

const createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query

  if (!tour || !user || !price) {
    return next()
  }

  await Booking.create({ tour, user, price })
  // Render homepage then make the url look better
  res.redirect(req.originalUrl.split('?')[0])
})

const addBooking = catchAsync(async (req, res, next) => {
  const existingBooking = await Booking.countDocuments({
    tour: req.body.tour,
    user: req.body.user,
  })

  if (existingBooking > 0) {
    return next(new AppError('User already booked this tour!', 400))
  }

  const doc = await Booking.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  })
})

const getAllBookings = getAll(Booking)
const getBooking = getOne(Booking)
const updateBooking = updateOne(Booking)
const deleteBooking = deleteOne(Booking)

module.exports = {
  getCheckourSession,
  createBookingCheckout,
  getAllBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
}
