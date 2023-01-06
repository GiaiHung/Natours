const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc)
      return next(AppError(`No document found with id ${req.params.id}`, 404))
    res.status(200).json({
      status: 'success',
      data: null,
    })
  })

module.exports = { deleteOne }
