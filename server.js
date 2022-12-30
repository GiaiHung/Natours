require('dotenv').config()
require('colors')
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const route = require('./routes')
// const { importData, deleteData } = require('./dev-data/data/import-data')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

route(app)

// Make sure values added must be predefined by Schema, otherwise it would not be saved
mongoose.set('strictQuery', true)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB'.underline.bold.yellow)
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`.bold.blue)
      // importData()
      // deleteData()
    })
  })
  .catch((error) => console.log(error.message))
