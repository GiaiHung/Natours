const Tour = require('../../models/Tours')

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          averRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 }, // 1 means ascending
      },
    ])

    res.status(200).json({
      message: 'success',
      data: {
        stats,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    })
  }
}

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-1-1`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursInMonth: { $sum: 1 },
          tours: {
            $push: '$name',
          },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numToursInMonth: -1 },
      },
    ])
    res.status(200).json({
      message: 'success',
      results: plan.length,
      data: { plan },
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    })
  }
}

module.exports = { getTourStats, getMonthlyPlan }
