const mongoose = require('mongoose');
const schemeConstants = require('./schemeConstant');
const { BaseSchema } = require('../share.model');

module.exports = mongoose.model(schemeConstants.Model, BaseSchema(schemeConstants.Collection, {
    type: {
        type: String,
        text: true,
        required: [true, 'Message type must not be null'],
        enum: {
            values: ['text', 'image', 'video', 'voice', 'forward-msg', 'emoji', 'file', 'system-notification'],
            message: '{VALUE} is not supported'
        }
    },
    content: {
        type: String,
        required: [false],
    },
    attachment: {
        type: Object,
        require: [false]
    },
    creatorId: mongoose.ObjectId,
    roomId: {
        type: mongoose.ObjectId,
        required: [true, 'Room id must not be null'],
    },
    seenBys: [{ type: mongoose.ObjectId }],
    pinnedBy: {
        userId: mongoose.ObjectId,
        pinnedAt: Date
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
