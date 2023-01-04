require('dotenv').config()
require('colors')
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const route = require('./routes')
const connect = require('./db/connect')
const handleRejection = require('./utils/handleRejections')
// const { importData, deleteData } = require('./dev-data/data/import-data')

handleRejection()
const app = express()
const PORT = process.env.PORT || 5000
const limiter = rateLimit({
  max: 100,
  message: 'Too many requests from this IP. Please try again in 30 minutes.',
  windowMs: 30 * 60 * 1000,
})
const passwordLimiter = rateLimit({
  max: 5,
  message:
    'You have tried logged in so many times. Please try again in 10 minutes.',
  windowMs: 10 * 60 * 1000,
})

// Set secure HTTP headers
app.use(helmet())
// Set limit on requests
app.use('/api', limiter)
app.use('/api/v1/auth/login', passwordLimiter)
// Parse the body from request into usable req.body, limit the data receive
app.use(express.json({ limit: '20kb' }))
// Data sanitization against NoSQL query injection
app.use(mongoSanitize())
// Data sanitization against XSS, prevent HTML or JS code
app.use(xss())
// Prevent http parameters pollution, duplicate sort,...
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

route(app)

// Make sure values added must be predefined by Schema, otherwise it would not be saved
mongoose.set('strictQuery', true)
connect()
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`.bold.blue)
  // importData()
  // deleteData()
})
