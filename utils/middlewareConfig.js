// HPP
const hppWhitelist = {
  whitelist: [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price',
  ],
}

// Helmet config
const scriptSrcUrls = [
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://cdnjs.cloudflare.com/',
]
const styleSrcUrls = [
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
]
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
]
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com']

const contentSecurityPolicy = {
  directives: {
    defaultSrc: [],
    connectSrc: ["'self'", ...connectSrcUrls],
    scriptSrc: ["'self'", ...scriptSrcUrls],
    styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
    workerSrc: ["'self'", 'blob:'],
    objectSrc: [],
    imgSrc: ["'self'", 'blob:', 'data:'],
    fontSrc: ["'self'", ...fontSrcUrls],
  },
}

module.exports = { hppWhitelist, contentSecurityPolicy }
