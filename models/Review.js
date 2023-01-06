const mongoose = require('mongoose')

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

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  })
  next()
})

module.exports = mongoose.model('Review', ReviewSchema)
