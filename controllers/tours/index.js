const Tours = require('../../models/Tours')
const Tour = require('../../models/Tours')
const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')
const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require('../handler')

const getAllTours = getAll(Tour)
const getTour = getOne(Tour, { path: 'reviews' })
const addTour = createOne(Tour)
const updateTour = updateOne(Tour)
const deleteTour = deleteOne(Tour)

const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params
  const [lat, lng] = latlng.split(',')
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1 // miles and kilometers

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude with format lat,lng',
        400
      )
    )
  }

  const tours = await Tours.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  })

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  })
})

const getTourDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params
  const [lat, lng] = latlng.split(',')
  // 1m = 0.00062 mile
  const multiplier = unit === 'mi' ? 0.00062 : 0.001

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude with format lat,lng',
        400
      )
    )
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        name: 1,
        distance: 1,
      },
    },
  ])

  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      distances,
    },
  })
})

module.exports = {
  getAllTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
  getToursWithin,
  getTourDistances,
}
