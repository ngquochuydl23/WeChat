const Friend = require("../models/friend");

async function findFriends(loggingUserId) {
    return await Friend.find({
        friends: { $contain: loggingUserId }
    });
}


async function terminateDevice(id) {
    await updateDevice(id, { isTerminated: true });
}

module.exports = {
    
}