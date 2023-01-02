const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // Only works with SAVE, update the password will not validate
    // As the result, over the project we don't use findByIdAndUpdate,...
    validate: {
      validator: function (el) {
        return el === this.password
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
})

// Middleware for changing passwordChangedAt time, only runs when password changed, not include the first time document created
UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()
  // create new token may take some time so that we make sure the time password is updated a little bit sooner the real time
  this.passwordChangedAt = Date.now() - 5000
  next()
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

UserSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  return resetToken
}

module.exports = mongoose.model('User', UserSchema)
