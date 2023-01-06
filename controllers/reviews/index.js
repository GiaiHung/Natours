const Review = require('../../models/Review')
const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require('../handler')

const getAllReviews = getAll(Review)
const getReview = getOne(Review)
const createReview = createOne(Review)
const deleteReview = deleteOne(Review)
const updateReview = updateOne(Review)

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  deleteReview,
  updateReview,
}
