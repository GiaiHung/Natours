const Review = require('../../models/Review')
const catchAsync = require('../../utils/catchAsync')
const { deleteOne } = require('../handler')

const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {}
  if (req.params.tourId) filter = { tour: req.params.tourId }
  const reviews = await Review.find(filter)
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  })
})

const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  })
})

const createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user
  const review = await Review.create(req.body)
  res.status(201).json({
    status: 'success',
    message: 'Review created successfully',
    data: {
      review,
    },
  })
})

const deleteReview = deleteOne(Review)

module.exports = { getAllReviews, getReview, createReview, deleteReview }
