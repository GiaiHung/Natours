const Tour = require('../../models/Tours')
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

module.exports = {
  getAllTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
}
