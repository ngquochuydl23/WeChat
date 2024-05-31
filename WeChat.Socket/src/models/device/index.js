const mongoose = require('mongoose');
const schemeConstants = require('./schemeConstant');
const { BaseSchema } = require('../share.model');
const moment = require('moment');

const schema = BaseSchema(schemeConstants.Collection, {
	deviceToken: {
		type: String,
		required: [true, 'deviceToken must not be null'],
	},
	deviceName: {
		type: String,
		required: [true, 'deviceName must not be null'],
	},
	platform: {
		type: String,
		text: true,
		required: [true, 'platform must not be null'],
		enum: {
			values: ['android', 'ios', 'browser', 'window', 'macos'],
			message: '{VALUE} is not supported'
		}
	},
	os: {
		type: String,
		required: [true, 'os must not be null'],
	},
	appVersion: {
		type: String,
		required: [true, 'appVersion must not be null'],
	},
	appName: {
		type: String,
		required: [true, 'appName must not be null'],
	},
	lastAccess: {
		type: Date,
		default: moment(),
	},
	ipAddress: {
		type: String,
		required: false,
	},
	location: {
		type: Object,
		required: false
	},
	isTerminated: {
		type: Boolean,
		default: false
	},
	userId: mongoose.ObjectId,
});

module.exports = mongoose.model(schemeConstants.Model, schema); 