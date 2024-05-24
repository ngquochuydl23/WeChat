const mongoose = require('mongoose');
const schemeConstants = require('./schemeConstant');
const { BaseSchema } = require('../share.model');

module.exports = mongoose.model(schemeConstants.Model, BaseSchema(schemeConstants.Collection, {
  fullName: {
    type: String,
    text: true,
    required: [true, 'Title must not be null']
  },
  avatar: {
    type: String,
    text: true,
    required: [false]
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)[0-9]{7}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'Phone number must be not null'],
  },
  email: {
    type: String,
    required: [true, 'Email must be not null'],
    validate: {
      validator: function (v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    },
  },
  hashPassword: {
    type: String,
    text: true,
    required: [true, 'Hash password must not be null']
  },
  actived: {
    type: Boolean,
    default: false
  }
})); 
