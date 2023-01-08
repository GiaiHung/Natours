const fs = require('fs')
const Review = require('../../models/Review')
const User = require('../../models/User')
// const Tour = require('../../models/Tours')

const importData = async () => {
  try {
    // const tourData = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
    // await Tour.create(tourData)
    // const reviewData = JSON.parse(
    //   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
    // )
    // await Review.create(reviewData)
    const userData = JSON.parse(
      fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
    )
    await User.create(userData, { validateBeforeSave: false })
    console.log('Data uploaded successfully')
  } catch (error) {
    console.log(error.message)
  }
}

const deleteData = async () => {
  try {
    // await Tour.deleteMany()
    // await Review.deleteMany()
    await User.deleteMany()
    console.log('Data deleted successfully')
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = { importData, deleteData }
