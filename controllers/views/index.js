const Tours = require('../../models/Tours')
// const User = require('../../models/User')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')

const getOverview = catchAsync(async (req, res) => {
  // 1) Get all tours data
  const tours = await Tours.find()
  // 2) Build template
  // 3) Render
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  })
})

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tours.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'rating user review',
  })
  if (!tour) {
    return next(new AppError('No tour found. Please try again.', 404))
  }
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  })
})

const login = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Login to your account',
  })
})

const getMe = catchAsync(async (req, res) => {
  res.status(200).render('me', {
    title: 'Your account',
    user: req.user,
  })
})

module.exports = { getOverview, getTour, login, getMe }
