const mongoose = require('mongoose')
const slugify = require('slugify')

const ToursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
      minLength: [10, 'Tour name must be at least 10 characters'],
      maxLength: [60, 'Tour name must not be more than 60 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      require: [true, 'Tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      require: [true, 'Tour must have a max group size'],
    },
    difficulty: {
      type: String,
      require: [true, 'Tour must have difficulty levels'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must not be more than 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // this only points to current document, it will not work with update
        validator: function (value) {
          return value < this.price
        },
        message: 'Price discount ({VALUE}) must be lower than price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'Tour must have an cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secret: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
ToursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// Virtual properties
// ToursSchema.virtual('durationWeeks').get(function () {
//   return Math.round(this.duration / 7)
// })

// Make sure it applies to every query starts with find
ToursSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } })
  this.start = Date.now()
  next()
})

ToursSchema.post(/^find/, function (docs, next) {
  console.log(`Request took ${Date.now() - this.start} ms`)
  next()
})

// Aggregate middleware
ToursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } })
  next()
})

module.exports = mongoose.model('tours', ToursSchema)
