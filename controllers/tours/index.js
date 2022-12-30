const Tour = require('../../models/Tours')
const APIFeatures = require('../../utils/apiFeatures')

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const tours = await features.query

    // Send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    })
  }
}

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    })
  }
}

const addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    })
  }
}

const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({
      status: 'success',
      data: {
        updatedTour,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    })
  }
}

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(201).json({
      status: 'deleted successfully',
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    })
  }
}

module.exports = {
  getAllTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
}
