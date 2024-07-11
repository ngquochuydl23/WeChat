const { AppException } = require('../exceptions/AppException');
const Room = require('../models/room');
const User = require('../models/user');
const _ = require('lodash');
const toObjectId = require('../utils/toObjectId');


async function findSingleRoomByUserId(loggingUserId, toUserId) {
    return await findOneRoom({
        singleRoom: true,
        '$expr': {
            '$setEquals': ['$members', [toObjectId(loggingUserId), toObjectId(toUserId)]]
        }
    });
}

async function findById(roomId) {
    return await Room.findById(roomId)
}

async function findOneRoom(whereObj = {}) {
    return await Room.findOne({ ...whereObj })
}

async function findRoomByUser(roomId, loggingUserId) {
    const room = await Room.findById(roomId);
    const members = await User.find({
        _id: { $in: room.members }
    });
    if (!room) {
        throw new AppException("Room not found.");
    }

    if (!room.members.includes(loggingUserId)) {
        throw new AppException("This account is not a member of this room");
    }

    return {
        ...(room._doc),
        users: members
    };
}

async function initRoomChat(title = undefined, thumbnail = undefined, otherMemberIds, loggingUserId) {
    const memberIds = [...otherMemberIds, loggingUserId];
    const room = new Room({
        title: title,
        members: memberIds,
        thumbnail: thumbnail,
        creatorId: loggingUserId,
        singleRoom: memberIds.length === 2,
        userConfigs: _.map(memberIds, id => ({
            userId: toObjectId(id),
            leaved: false
        }))
    });

    await room.save();
    return room;
}

async function updateRoom(roomId, mergeDoc, options) {
    await Room.updateOne({ _id: roomId, }, { $set: { ...mergeDoc } }, options)
}

async function getRoomsCount(loggingUserId, whereObj = {}) {
    const count = await Room
        .find({
            members: { $elemMatch: { $eq: toObjectId(loggingUserId) } },
            lastMsg: { $ne: null },
            userConfigs: {
                $elemMatch: {
                    userId: toObjectId(loggingUserId),
                    leaved: false
                }
            },
            ...whereObj
        })
        .count();
    return count;
}

async function findManyRoom(loggingUserId, whereObj = {}, sortObj = {}, skip = 0, limit = 10) {
    const rooms = await Room
        .find({
            members: { $elemMatch: { $eq: toObjectId(loggingUserId) } },
            lastMsg: { $ne: null },
            userConfigs: {
                $elemMatch: {
                    userId: toObjectId(loggingUserId),
                    leaved: false
                }
            },
            ...whereObj
        })
        .sort({ ...sortObj })
        .skip(skip)
        .limit(limit);
    return rooms;
}

async function getMsgRooms(loggingUserId, matchObj = {}, sortObj = {}, skip = 0, limit = 10) {
    const rooms = await Room
        .aggregate([
            {
                $match: {
                    members: { $elemMatch: { $eq: toObjectId(loggingUserId) } },
                    lastMsg: { $ne: null },
                    userConfigs: {
                        $elemMatch: {
                            userId: toObjectId(loggingUserId),
                            leaved: false
                        }
                    }
                }
            },
            {
                $sort: {
                    'lastMsg.createdAt': -1,
                    'createdAt': -1,
                    ...sortObj
                }
            },
            {
                $project: {
                    members: {
                        "$map": {
                            "input": "$members",
                            "as": "member",
                            "in": {
                                "$toObjectId": "$$member"
                            }
                        },
                    },
                    singleRoom: 1,
                    userConfigs: 1,
                    lastMsg: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    title: 1,
                    thumbnail: 1
                }
            },
            // { $skip: skip },
            // { $limit: limit },
            {
                $lookup: {
                    from: 'Users',
                    let: { member: "$members" },
                    pipeline: [
                        { $match: { $expr: { "$in": ["$_id", "$$member"] } } },
                        {
                            $project: {
                                fullName: 1,
                                userName: 1,
                                avatar: 1,
                                gender: 1,
                                firstName: 1,
                                lastName: 1
                            }
                        }
                    ],
                    "as": "users"
                }
            },
            {
                $lookup: {
                    from: 'Messages',
                    let: { roomId: "$_id", creatorId: loggingUserId },
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    { $expr: { "$eq": ["$roomId", "$$roomId"] } },
                                    { "creatorId": { $ne: toObjectId("6650bb07d51b54a5c039f3fb") } },
                                    { "seenBys": { $nin: [toObjectId("6650bb07d51b54a5c039f3fb")] } }
                                ]
                            }
                        },
                        {
                            $project: {
                                creatorId: 1,
                                roomId: 1,
                                seenBys: 1,
                            }
                        }
                    ],
                    "as": "msgs"
                }
            },
            {
                "$project": {
                    singleRoom: 1,
                    userConfigs: 1,
                    lastMsg: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    title: 1,
                    thumbnail: 1,
                    members: 1,
                    users: 1,   
                    unreadMsgCount: { $size: "$msgs" }
                }
            },
            { "$match": { ...matchObj } }]);
    return rooms;
}


module.exports = {
    getRoomsCount,
    findById,
    findOneRoom,
    findSingleRoomByUserId,
    findRoomByUser,
    findManyRoom,
    updateRoom,
    initRoomChat,
    getMsgRooms
}
