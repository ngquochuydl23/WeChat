const mongoose = require('mongoose');
const schemeConstants = require('./schemeConstant');
const { BaseSchema } = require('../share.model');

module.exports = mongoose.model(schemeConstants.Model, BaseSchema(schemeConstants.Collection, {
  fileName: {
    type: String,
    text: true,
    required: [true, 'fileName must not be null']
  },
  buffer: {
    type: Buffer,
    required: [true, 'buffer must not be null']
  },
  mime: {
    type: String,
    text: true,
    required: [true, 'mime must not be null']
  },
  size: {
    type: Number,
    required: [true, 'mime must not be null']
  },
  creatorId: {
    type: mongoose.ObjectId,
    required: [true, 'creatorId  must not be null']
  }
}))
