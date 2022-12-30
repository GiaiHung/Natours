const fs = require('fs')
const Tour = require('../../models/Tours')

const importData = async () => {
  try {
    const data = JSON.parse(
      fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
    )
    await Tour.create(data)
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
