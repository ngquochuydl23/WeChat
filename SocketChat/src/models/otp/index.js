const mongoose = require('mongoose');
const schemeConstants = require('./schemeConstant');
const { BaseSchema } = require('../share.model');

module.exports = mongoose.model(schemeConstants.Model, BaseSchema(schemeConstants.Collection, {
  email: {
    type: String,
    require: true
  },
  otp: {
    type: String,
    require: true
  },
  userId: mongoose.ObjectId,
  type: {
    type: String,
    text: true,
    required: [true, 'Otp type must not be null'],
    enum: {
      values: ['reset-password', 'register'],
      message: '{VALUE} is not supported'
    }
  },
  otpExpiration: {
    type: Date,
    default: Date.now,
    get: (otpExpiration) => otpExpiration.getTime(),
    set: (otpExpiration) => new Date(otpExpiration),
  }
})); 