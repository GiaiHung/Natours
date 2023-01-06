const Tour = require('../../models/Tours')
const APIFeatures = require('../../utils/apiFeatures')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')
const { deleteOne } = require('../handler')

const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
  const tours = await features.query

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  })
})

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews')
  if (!tour) {
    return next(new AppError('No tour found with this ID', 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  })
})

const addTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  })
})

const updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!updatedTour) {
    return next(new AppError('No tour found with this ID', 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      updatedTour,
    },
  })
})

const deleteTour = deleteOne(Tour)

module.exports = {
  getAllTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
}
