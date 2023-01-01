const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // Only works with SAVE, update the password will not validate
    validate: {
      validator: function (el) {
        return el === this.password
      },
      message: 'Passwords do not match',
    },
  },
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
})

UserSchema.methods.validatePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model('User', UserSchema)
