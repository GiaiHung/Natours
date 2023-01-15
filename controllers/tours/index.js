const multer = require('multer')
const sharp = require('sharp')
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

const multerStorage = multer.memoryStorage()
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('File is not an image. Please try again', 400), false)
  }
}
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})
const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
])

const resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images)
    return next(new AppError('Please provide both image cover and tour images'))

  // 1) Image cover
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`)

  // 2) Images
  req.body.images = []
  // We have to use Promise.all() because we use await to resize images. If we don't use Promise.all(), then the req.body.images.push(filename) will be empty
  // Unlike map() , forEach() always returns undefined and is not chainable. Also, forEach method does not wait for the asynchronous code inside of it to complete before moving on to the next iteration.
  await Promise.all(
    req.files.images.map(async (file, index) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`)

      req.body.images.push(filename)
    })
  )

  next()
})

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
  uploadTourImages,
  resizeTourImages,
}
