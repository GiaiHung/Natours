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

ReviewSchema.index({ tour: 1, user: 1 }, { unique: true })

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

  if (stats.length > 0) {
    await Tours.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    })
  } else {
    await Tours.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    })
  }
}

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  })
  next()
})

// Update tour when new review created
ReviewSchema.post('save', function () {
  // Review model has not been initialized, so we use this.constructor as model. THIS is the current document
  this.constructor.calcAvgRating(this.tour)
})

// Update tour when review updated and deleted
// This time, we don't get the document from query
// So we need to use this.findOne()
ReviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne().clone()
  next()
})

// After query executed, update the tour based on this.review
ReviewSchema.post(/^findOneAnd/, async function () {
  await this.review.constructor.calcAvgRating(this.review.tour)
})

module.exports = mongoose.model('Review', ReviewSchema)
