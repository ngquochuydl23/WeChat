const { default: mongoose } = require("mongoose");


function toObjectId(loggingUserId) {
    return new mongoose.Types.ObjectId(loggingUserId);
}

module.exports = toObjectId;    