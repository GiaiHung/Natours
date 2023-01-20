const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Tours = require('../../models/Tours')
const Booking = require('../../models/Booking')
const catchAsync = require('../../utils/catchAsync')
const { getAll, getOne, updateOne, deleteOne } = require('../handler')
const AppError = require('../../utils/appError')
const User = require('../../models/User')

const getCheckourSession = catchAsync(async (req, res, next) => {
  const tour = await Tours.findById(req.params.tourId)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
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
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`,
            ],
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

const createBookingCheckout = catchAsync(async (session) => {
  const tour = session.client_reference_id
  const user = (await User.findOne({ email: session.customer_email }))._id
  const price = session.amount_total / 100
  await Booking.create({ tour, user, price })
})

// Stripe will call this webhook whenever customer paid the invoice
const webhookCheckout = (req, res, next) => {
  // eslint-disable-next-line dot-notation
  const signature = req.headers['stripe-signature']
  // body must be in raw form - stream
  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.log(`⚠️  Webhook signature verification failed.`, error.message)
    return res.sendStatus(400)
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object)

  res.status(200).json({ received: true })
}

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
  webhookCheckout,
  getAllBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
}
