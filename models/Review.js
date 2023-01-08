const mongoose = require('mongoose')
const Tours = require('./Tours')

const ReviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review must not be blank'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

ReviewSchema.statics.calcAvgRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])

  await Tours.findByIdAndUpdate(stats[0]._id, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].nRating,
  })
}

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  })
  next()
})

ReviewSchema.post('save', function () {
  // Review model has not been initialized, so we use this.constructor as model. THIS is the current document
  this.constructor.calcAvgRating(this.tour)
})

module.exports = mongoose.model('Review', ReviewSchema)
