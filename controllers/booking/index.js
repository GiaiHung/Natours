const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Tours = require('../../models/Tours')
// const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')

const getCheckourSession = catchAsync(async (req, res, next) => {
  const tour = await Tours.findById(req.params.tourId)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/success`,
    cancel_url: `${req.protocol}://${req.get('host')}/cancel/tour/${tour.slug}`,
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
module.exports = { getCheckourSession }
