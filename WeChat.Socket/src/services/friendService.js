const { default: mongoose } = require("mongoose");
const Friend = require("../models/friend");

async function addFriend(loggingUserId, toUserId) {
    const friend = new Friend({
        friends: [loggingUserId, toUserId],
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

async function getCount(loggingUserId, condition) {
    return await Friend
        .find({ friends: { $in: [loggingUserId] }, isDeleted: false, ...condition })
        .count();
}

async function updateOne(id, mergeDoc) {
    await Friend.updateOne({ _id: id }, { $set: { ...mergeDoc } });
}

async function findByFriendId(friendId) {
    return await Friend.findById(friendId);
}

async function findManyAsQueryable(loggingUserId, friendConditionObj, userConditionObj, skip, limit) {
    return await Friend
        .aggregate([
            {
                $match: {
                    friends: { $in: [new mongoose.Types.ObjectId(loggingUserId)] },
                    isDeleted: false,
                    ...friendConditionObj
                }
            },
            { $unwind: '$friends' },
            { $match: { friends: { $ne: new mongoose.Types.ObjectId(loggingUserId) } } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "Users",
                    localField: "friends",
                    foreignField: "_id",
                    pipeline: [{
                        $project: {
                            'hashPassword': 0,
                            'actived': 0,
                            'isDeleted': 0
                        }
                    }],
                    as: "users"
                }
            },
            {
                $project: {
                    accepted: 1,
                    redeemed: 1,
                    redeemedAt: 1,
                    sendingRequestUserId: 1,
                    user: { $first: "$users" }
                }
            },
            { "$match": { ...userConditionObj } }
        ]);
}

module.exports = {
    addFriend,
    checkIsFriend,
    getCount,
    updateOne,
    findByFriendId,
    findManyAsQueryable
}