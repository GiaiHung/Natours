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
  passwordChangedAt: Date,
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

UserSchema.methods.getPasswordChangedAt = function (JWTTimestamps) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return JWTTimestamps < changedTimestamp
  }
  // Default should be false to user has never changed password
  return false
}

module.exports = mongoose.model('User', UserSchema)
