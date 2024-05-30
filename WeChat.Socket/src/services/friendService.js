const { default: mongoose } = require("mongoose");
const Friend = require("../models/friend");

async function getFriends(loggingUserId, matchObj = null, offset, limit) {
    return await Friend
        .aggregate([
            {
                $match: {
                    friends: { $in: [new mongoose.Types.ObjectId(loggingUserId)] }, 
                    isDeleted: false,
                    accepted: true
                }
            },
            { $unwind: '$friends' },
            { $match: { friends: { $ne: new mongoose.Types.ObjectId(loggingUserId) } } },
            { $skip: offset },
            { $limit: limit },
            {
                $lookup: {
                    from: "Users",
                    localField: "friends",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $project: { 'user.hashPassword': 0, 'user.actived': 0 } },
            { "$match": { ...matchObj } }
        ]);
}

async function addFriend(loggingUserId, destinationUserId) {
    const friend = new Friend({
        friends: [loggingUserId, destinationUserId],
        sendingRequestUserId: loggingUserId,
        accepted: false
    });

    await friend.save();
    return friend;
}

async function checkIsFriend(loggingUserId, destinationUserId) {
    return await Friend.findOne({
        '$expr': {
            '$setEquals': ['$friends', [
                new mongoose.Types.ObjectId(loggingUserId),
                new mongoose.Types.ObjectId(destinationUserId)
            ]]
        }
    });
}

async function removeFriend(loggingUserId, destinationUserId) {
    await Friend.updateOne({
        '$expr': {
            '$setEquals': ['$friends', [
                new mongoose.Types.ObjectId(loggingUserId),
                new mongoose.Types.ObjectId(destinationUserId)
            ]]
        }
    }, { $set: { isDeleted: true } })
}

async function friendCount(loggingUserId) {
    return await Friend
        .find({
            friends: { $in: [loggingUserId] },
            accepted: true
        })
        .count();
}
module.exports = {
    addFriend, getFriends, checkIsFriend, removeFriend, friendCount
}