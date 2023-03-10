/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config()
require('colors')
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const cors = require('cors')
const route = require('./routes')
const connect = require('./db/connect')
const handleRejection = require('./utils/handleRejections')
const {
  contentSecurityPolicy,
  hppWhitelist,
} = require('./utils/middlewareConfig')
const { webhookCheckout } = require('./controllers/booking')
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

// Implement CORS, also handle none-simple requests and preflight requests
app.use(cors())
app.options('*', cors())
// Or you can specifically available route for none-simple request by:
// app.option('/api/v1/tours, cors())

// Template engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Used in req.headers['x-forwarded-proto'] === 'https' which is sepcific to Heroku deploy
app.enable('trust proxy')

// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Set secure HTTP headers

app.use(helmet.contentSecurityPolicy(contentSecurityPolicy))
// Set limit on requests
app.use('/api', limiter)
app.use('/api/v1/auth/login', passwordLimiter)
// Stripe webhook, stripe need whole body stream not json. So that this route must come before app.use(express.json({ limit: '20kb' })), but we still need to parse the body as raw format
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
)
// Parse the body from request into usable req.body, limit the data receive
app.use(express.json({ limit: '20kb' }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: '20kb' }))
// Data sanitization against NoSQL query injection
app.use(mongoSanitize())
// Data sanitization against XSS, prevent HTML or JS code
app.use(xss())
// Prevent http parameters pollution, duplicate sort,...
app.use(hpp(hppWhitelist))
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(compression())

route(app)

// Make sure values added must be predefined by Schema, otherwise it would not be saved
mongoose.set('strictQuery', true)
connect()
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`.bold.blue)
  // importData()
  // deleteData()
})

process.on('SIGTERM', () => {
  console.log('???? SIGTERM RECEIVED. Shutting down gracefully')
  server.close(() => {
    console.log('???? Process terminated!')
  })
})
