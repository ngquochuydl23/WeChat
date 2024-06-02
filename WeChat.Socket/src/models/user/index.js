const mongoose = require('mongoose');
const schemeConstants = require('./schemeConstant');
const { BaseSchema } = require('../share.model');

const schema = BaseSchema(schemeConstants.Collection, {
    firstName: {
        type: String,
        text: true,
        required: [true, 'firstName must not be null']
    },
    lastName: {
        type: String,
        text: true,
        required: [true, 'lastName must not be null']
    },
    fullName: {
        type: String,
        text: true,
        required: [true, 'fullName must not be null']
    },
    avatar: {
        type: String,
        text: true,
        required: [false]
    },
    cover: {
        type: String,
        text: true,
        required: [false]
    },
    gender: {
        type: String,
        text: true,
        required: [true, 'gender must not be null'],
        enum: {
            values: ['male', 'female'],
            message: '{VALUE} is not supported'
        }
    },
    birthday: {
        type: Date,
        default: null
    },
    bio: {
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
        required: [true, 'phoneNumber must be not null'],
        index: { unique: true, dropDups: true }
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
        index: { unique: true, dropDups: true }
    },
    hashPassword: {
        type: String,
        text: true,
        required: [true, 'Hash password must not be null']
    },
    actived: {
        type: Boolean,
        default: false
    },
    userName: {
        type: String,
        required: [true, 'userName must not be null']
    }
})

module.exports = mongoose.model(schemeConstants.Model, schema); 
