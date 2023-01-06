const sendTourIdAndUser = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user
  next()
}

module.exports = { sendTourIdAndUser }
