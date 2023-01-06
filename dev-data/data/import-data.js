const fs = require('fs')
const Review = require('../../models/Review')
const Tour = require('../../models/Tours')

const importData = async () => {
  try {
    // const tourData = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
    // await Tour.create(tourData)
    const reviewData = JSON.parse(
      fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
    )
    await Review.create(reviewData)
    console.log('Data uploaded successfully')
  } catch (error) {
    console.log(error.message)
  }
}

const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Data deleted successfully')
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = { importData, deleteData }
