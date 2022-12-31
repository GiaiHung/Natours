const mongoose = require('mongoose')

const connect = async () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB'.underline.bold.yellow)
  })
}

module.exports = connect
