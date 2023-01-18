const APIFeatures = require('../../utils/apiFeatures')
const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc)
      return next(AppError(`No document found with id ${req.params.id}`, 404))
    res.status(200).json({
      status: 'success',
      data: null,
    })
  })

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    })
  })

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!doc) {
      return next(new AppError('No document found with this ID', 404))
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    })
  })

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // For nested routes get tour then populate the reviews
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }
    if (req.params.userId) filter = { user: req.params.userId }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const doc = await features.query

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc,
      },
    })
  })

const getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (populateOptions) query = query.populate(populateOptions)
    const doc = await query
    if (!doc) {
      return next(new AppError('No document found with this ID', 404))
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    })
  })

module.exports = { deleteOne, createOne, updateOne, getOne, getAll }
