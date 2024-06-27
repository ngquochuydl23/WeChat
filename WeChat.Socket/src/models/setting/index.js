const mongoose = require('mongoose');
const schemeConstants = require('./schemeConstant');
const { BaseSchema } = require('../share.model');
const moment = require('moment');

module.exports = mongoose.model(schemeConstants.Model, BaseSchema(schemeConstants.Collection, {
    userId: {
        type: mongoose.ObjectId,
        required: [true, 'creatorId must not be null']
    },
    autoTerminateSession: {
        autoTerminate: {
            type: Boolean,
            default: true,
        },
        condition: {
            type: String,
            text: true,
            required: [true, 'autoTerminateSession.condition must not be null'],
            enum: {
                values: ['1-week', '3-months', '6-months', '1-year'],
                message: '{VALUE} is not supported'
            }
        }
    },
    themeMode: {
        type: String,
        text: true,
        required: [true, 'themeMode type must not be null'],
        enum: {
            values: ['dark', 'light', 'system'],
            message: '{VALUE} is not supported'
        },
        default: 'light'
    }
})); 