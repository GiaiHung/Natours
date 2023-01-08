const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      filteredObj[el] = obj[el]
    }
  })
  return filteredObj
}

const getMe = (req, res, next) => {
  req.params.id = req.user._id
  next()
}

module.exports = { filterObj, getMe }
