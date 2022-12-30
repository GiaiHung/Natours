const aliasTopTour = async (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,summary,difficulty,ratingsAverage,price'
  next()
}

module.exports = { aliasTopTour }
