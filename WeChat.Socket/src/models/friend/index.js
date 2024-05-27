const mongoose = require('mongoose');
const schemeConstants = require('./schemeConstant');
const { BaseSchema } = require('../share.model');
const moment = require('moment');

module.exports = mongoose.model(schemeConstants.Model, BaseSchema(schemeConstants.Collection, {
  friends: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    validate: [val.length == 2, '{PATH} exceeds the limit of 2'],
    required: [true, 'friends must not be null'],
  },
  accepted: {
    type: Boolean,
    default: false
  },
  sendingRequestUserId: {
    type: Schema.Types.ObjectId,
    required: [true, 'sendingRequestUser must not be null'],
  },
  destinationUserId: {
    type: Schema.Types.ObjectId,
    required: [true, 'destinationUserId must not be null'],
  },
  redeemed: {
    type: Boolean,
    default: false
  },
  redeemedAt: {
    type: Date,
    default: null
  }
}))
