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
    members: [mongoose.ObjectId],
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
        required: [true, 'creatorId must not be null']
    },
    userConfigs: {
        type: [{
            userId: mongoose.ObjectId,
            leaved: {
                type: Boolean,
                default: false
            },
            leavedAt: {
                type: Date,
                default: null
            },
            chatDeletedAt: {
                type: Date,
                default: null
            },
            joinedAt: {
                type: Date,
                default: moment()
            },
            pinned: {
                type: Boolean,
                default: false
            },
            pinnedAt: {
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
    },
    memberCount: {
        type: Number,
        required: [true, 'memberCount must not be null'],
    }
})); 