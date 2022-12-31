const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    unique: [true, 'Name already in use'],
  },
  email: {
    type: String,
    required: [true, 'User must have a email'],
    unique: [true, 'Email already in use'],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'https://i.ibb.co/4pDNDk1/avatar.png',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  confirmedPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
})

module.exports = mongoose.model('User', UserSchema)
