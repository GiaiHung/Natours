const User = require('../../models/User')
const catchAsync = require('../../utils/catchAsync')

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()
  res.status(200).json({
    status: 'Success',
    data: {
      users,
    },
  })
})

module.exports = { getAllUsers }
