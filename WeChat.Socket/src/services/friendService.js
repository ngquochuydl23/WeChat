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

async function findFriendByUserId(loggingUserId, toUserId) {
    return await Friend.findOne({
        '$expr': {
            '$setEquals': ['$friends', [
                new mongoose.Types.ObjectId(loggingUserId),
                new mongoose.Types.ObjectId(toUserId)
            ]]
        }
    });
}

async function getCount(loggingUserId, condition) {
    return await Friend
        .find({
            friends: { $in: [loggingUserId] },
            isDeleted: false,
            ...condition
        })
        .count();
}

async function updateOne(id, mergeDoc) {
    await Friend.updateOne({ _id: id }, { $set: { ...mergeDoc } });
}

async function findByFriendId(friendId) {
    return await Friend.findOne({ _id: new mongoose.Types.ObjectId(friendId) });
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
                            fullName: 1,
                            userName: 1,
                            avatar: 1,
                            gender: 1
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
    findFriendByUserId,
    getCount,
    updateOne,
    findByFriendId,
    findManyAsQueryable
}