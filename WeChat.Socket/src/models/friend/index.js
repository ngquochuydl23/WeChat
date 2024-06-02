const mongoose = require('mongoose');
const schemeConstants = require('./schemeConstant');
const { BaseSchema, whereNotDeleted } = require('../share.model');

const schema = BaseSchema(schemeConstants.Collection, {
    friends: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }],
        //validate: [friends.length == 2, '{PATH} exceeds the limit of 2'],
        required: [true, 'friends must not be null'],
    },
    accepted: {
        type: Boolean,
        default: false
    },
    sendingRequestUserId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'sendingRequestUser must not be null'],
    },
    redeemed: {
        type: Boolean,
        default: false
    },
    redeemedAt: {
        type: Date,
        default: null
    },
    blocked: {
        type: Boolean,
        default: false
    },
    blockedAt: {
        type: Date,
        default: null
    },
    userBlockingId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'sendingRequestUser must not be null'],
    }
})

schema.pre('find', whereNotDeleted);
schema.pre('findOne', whereNotDeleted);
schema.pre('updateOne', whereNotDeleted);

module.exports = mongoose.model(schemeConstants.Model, schema)
