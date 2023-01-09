const Tours = require('../../models/Tours')
const catchAsync = require('../../utils/catchAsync')

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

const getTour = catchAsync(async (req, res) => {
  const tour = await Tours.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'rating user review',
  })
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  })
})

module.exports = { getOverview, getTour }
