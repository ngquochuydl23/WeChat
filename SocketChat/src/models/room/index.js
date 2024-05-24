const mongoose = require('mongoose');
const schemeConstants = require('./schemeConstant');
const { BaseSchema } = require('../share.model');
const moment = require('moment');

module.exports = mongoose.model(schemeConstants.Model, BaseSchema(schemeConstants.Collection, {
  title: {
    type: String,
    text: true,
    required: [false],
  },
  thumbnail: {
    type: String,
    required: false
  },
  members: [String],
  lastMsg: {
    type: Object,
    require: [false]
  },
  singleRoom: {
    type: Boolean,
    required: [true, 'singleRoom must not be null'],
  },
  creatorId: {
    type: mongoose.ObjectId,
    required: [true, 'creatorId  must not be null']
  },
  userConfigs: {
    type: [{
      userId: mongoose.ObjectId,
      blocked: {
        type: Boolean,
        default: false
      },
      chatDeletedAt: {
        type: Date,
        default: null
      },
      joinedAt: {
        type: Date,
        default: moment()
      }
    }],
    _id: false,
    default: undefined
  },
  dispersed: {
    type: Boolean,
    default: false
  },
  dispersedAt: {
    type: Date,
    default: null
  }
})); 