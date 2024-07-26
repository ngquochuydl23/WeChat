const { AppException } = require('../exceptions/AppException');
const {
    initRoomChat,
    findSingleRoomByUserId,
    updateRoom,
    getMsgRooms,
    getRoomsCount,
    findById,
    findOneRoom,
    findManyRoom,
    updateOneRoom,
    updateMemberCount,
} = require('../services/roomService');
const { findUsersByIds } = require('../services/userService');
const { sendMsg, countMsgs } = require('../services/messageService');
const { getPaginateQuery, paginate } = require('../utils/paginate');
const { getIo } = require('../socket');
const { emitToRoomNsp } = require('../utils/socketUtils');
const toObjectId = require('../utils/toObjectId');
const moment = require('moment');
const _ = require('lodash');
const Room = require('../models/room');

exports.findSingleRoom = async (req, res, next) => {
    try {
        const room = await findSingleRoomByUserId(req.loggingUserId, req.query.toUserId);
        if (!room) {
            throw new AppException("Room not found.");
        }

        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    room
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.initRoomChat = async (req, res, next) => {
    const { otherIds, title, thumbnail } = req.body;
    const loggingUserId = req.loggingUserId;

    try {

        if ((await findUsersByIds(otherIds)).length !== otherIds.length) {
            throw new AppException("Someone is not found to create a room.");
        }

        if (otherIds.length === 1 && await findSingleRoomByUserId(loggingUserId, otherIds[0])) {
            throw new AppException("Room is already created.");
        }

        const room = await initRoomChat(title, thumbnail, otherIds, loggingUserId);

        if (!room.singleRoom) {
            var lastMsg = await sendMsg({
                type: 'system-notification',
                content: 'created this room.',
                roomId: room._id,
                creatorId: loggingUserId
            });

            await updateRoom(room._id, { lastMsg });
            await emitToRoomNsp(room._id, 'newMsg');
        }

        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: 'Room is created.',
                result: {
                    room: { ...(room.toObject()), lastMsg }
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.getLastRooms = async (req, res, next) => {
    const { skip, limit } = getPaginateQuery(req);

    try {
        const total = await getRoomsCount(req.loggingUserId);
        const rooms = await getMsgRooms(req.loggingUserId, null, null, skip, limit);

        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    ...paginate({ rooms }, total, limit, skip)
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.getRoomsByMemberName = async (req, res, next) => {

    const { skip, limit } = getPaginateQuery(req);
    const { name } = req.query;
    try {
        if (!name) {
            throw new AppException("name query is not provided.");
        }
        let regex = new RegExp(`^${name}`);
        const rooms = await getMsgRooms(req.loggingUserId, {
            $or: [
                {
                    title: { "$regex": regex }
                },
                {
                    "users": {
                        "$elemMatch": {
                            $or: [
                                { "fullName": { "$regex": regex } },
                                { "userName": { "$regex": regex } }
                            ]
                        }
                    }
                }
            ]
        }, null, skip, limit);

        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    rooms
                }
            });
    } catch (error) {
        next(error);
    }
};

exports.leaveRoom = async (req, res, next) => {
    const { roomId } = req.params;

    try {
        const room = await findById(roomId);
        if (!room) {
            throw new AppException("Room not found.");
        }

        if (!room.members.includes(toObjectId(req.loggingUserId))) {
            throw new AppException("This account is not a member of this room.");
        }

        const message = await sendMsg({
            type: 'system-notification',
            content: 'leaved this room.',
            roomId: room._id,
            creatorId: toObjectId(req.loggingUserId)
        });
        await updateRoom(roomId, {
            "userConfigs.$[idx].leaved": true,
            "userConfigs.$[idx].leavedAt": moment()
        }, {
            arrayFilters: [{ "idx.userId": toObjectId(req.loggingUserId) }]
        });

        await updateMemberCount(roomId);

        getIo()
            .of('chatRoom')
            .to(roomId)
            .emit('incomingMsg', roomId, message);

        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    msg: "Leaved room."
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.addMember = async (req, res, next) => {
    const { roomId } = req.params;
    const loggingUserId = req.loggingUserId;
    const { otherIds } = req.body;

    try {
        var room = await findOneRoom({ _id: toObjectId(roomId) });

        if (!room) {
            throw new AppException("Room not found.");
        }

        if (room.singleRoom) {
            throw new AppException("Cannot add member to single room.");
        }
        if (!room.members.includes(toObjectId(loggingUserId))) {
            throw new AppException("This account is not a member of this room.");
        }

        if ((await findUsersByIds(otherIds)).length !== otherIds.length) {
            throw new AppException("Someone is not found to create a room.");
        }

        const intersection = _
            .map(room.userConfigs, (user) => user)
            .filter(value => otherIds.includes(value.userId) && value.leaved);

        if (!_.isEmpty(intersection)) {
            throw new AppException("Someone is already member of this room.");
        }


        let nUserConfigs = [];

        otherIds.forEach((otherId) => {
            if (room.members.includes(otherId)) {
                room.userConfigs.map(uConfig => {
                    if (uConfig.userId.toHexString() === otherId) {
                        uConfig.leaved = false;
                        return uConfig;
                    } else {
                        return uConfig;
                    }
                });
            } else {
                room.members.push(toObjectId(otherId));
                room.userConfigs.push({
                    userId: toObjectId(otherId)
                });
            }
        });

        var lastMsg = await sendMsg({
            type: 'system-notification',
            content: `added ['${otherIds}'] into room.`,
            roomId: room._id,
            creatorId: toObjectId(req.loggingUserId)
        });

        await updateRoom(roomId, {
            members: room.members,
            userConfigs: room.userConfigs
        })
        await updateMemberCount(roomId);
        await emitToRoomNsp(room._id, 'addMember');

        const members = await findUsersByIds(room.members);
        getIo()
            .of('chatRoom')
            .to(roomId)
            .emit('addMember', roomId, members, lastMsg);

        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: 'add member successfully.'
            });

    } catch (error) {
        next(error);
    }
}

exports.listGroups = async (req, res, next) => {
    const { skip, limit } = getPaginateQuery(req);

    try {
        const total = await getRoomsCount(req.loggingUserId, { singleRoom: false });
        const rooms = await Room
            .aggregate([
                {
                    $match: {
                        members: { $elemMatch: { $eq: toObjectId(req.loggingUserId) } },
                        lastMsg: { $ne: null },
                        userConfigs: {
                            $elemMatch: {
                                userId: toObjectId(req.loggingUserId),
                                leaved: false
                            }
                        },
                        singleRoom: false
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
                        lastMsg: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        title: 1,
                        thumbnail: 1,
                        userConfig: {
                            $filter: {
                                input: "$userConfigs",
                                as: "item",
                                cond: { $eq: ["$$item.userId", toObjectId(req.loggingUserId)] }
                            }
                        },
                    }
                },
                { $unwind: "$userConfig" },
                { $skip: skip },
                { $limit: limit },
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
                    "$project": {
                        singleRoom: 1,
                        userConfig: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        title: 1,
                        thumbnail: 1,
                        members: 1,
                        users: 1,
                    }
                },
                { $sort: { createdAt: -1 } },
                { "$match": {} }]);
        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    ...paginate({ rooms }, total, limit, skip)
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.uploadThumbnail = async (req, res, next) => {
    const { roomId } = req.params;
    const loggingUserId = req.loggingUserId;
    const { thumbnail } = req.body;

    try {
        const room = await findById(roomId);
        if (!room) {
            throw new AppException("Room not found.");
        }

        if (!room.members.includes(toObjectId(loggingUserId))) {
            throw new AppException("This account is not a member of this room.");
        }

        if (room.singleRoom) {
            throw new AppException("Cannot patch thumbnail to single room.");
        }

        await updateRoom(roomId, { thumbnail });
        await emitToRoomNsp(room._id, 'updateRoom');

        getIo()
            .of('chatRoom')
            .to(roomId)
            .emit('updateRoom', { ...room._doc, thumbnail });

        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    msg: 'Uploaded thumbnail successfully.'
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.renameRoomGroupTitle = async (req, res, next) => {
    const { roomId } = req.params;
    const { title } = req.body;
    const loggingUserId = req.loggingUserId;

    try {
        const room = await findById(roomId);
        if (!room) {
            throw new AppException("Room not found.");
        }

        if (!room.members.includes(toObjectId(loggingUserId))) {
            throw new AppException("This account is not a member of this room.");
        }

        if (room.singleRoom) {
            throw new AppException("Cannot update title to single room.");
        }

        await updateRoom(room._id, { title: title });
        await emitToRoomNsp(room._id, 'updateRoom');

        getIo()
            .of('chatRoom')
            .to(roomId)
            .emit('updateRoom', { ...room._doc, title });

        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    msg: 'Updated title successfully.'
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.pinRoom = async (req, res, next) => {
    const { roomId } = req.params;
    const loggingUserId = req.loggingUserId;

    try {
        const room = await findById(roomId);
        if (!room) {
            throw new AppException("Room not found.");
        }

        const userConfig = room
            .userConfigs
            .find(x => x.userId.toHexString() === loggingUserId);

        if (userConfig.pinned) {
            throw new AppException("Cannot pinned. This room is already be.");
        }

        const pinnedAt = moment();
        await updateOneRoom(
            { _id: room._id, },
            {
                '$set': {
                    'userConfigs.$[elem].pinned': true,
                    'userConfigs.$[elem].pinnedAt': pinnedAt
                }
            },
            {
                multi: true,
                strict: false,
                arrayFilters: [
                    { "elem.userId": toObjectId(loggingUserId) }
                ]
            });

        const copyRoom = room.toObject();
        delete copyRoom['userConfigs'];

        getIo()
            .of('rooms')
            .to(loggingUserId)
            .emit('rooms.incomingPinRoom', roomId, {
                ...copyRoom,
                userConfig: {
                    pinned: true,
                    pinnedAt
                }
            });
        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    msg: 'Pinned successfully.'
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.removePinRoom = async (req, res, next) => {
    const { roomId } = req.params;
    const loggingUserId = req.loggingUserId;

    try {
        const room = await findById(roomId);
        if (!room) {
            throw new AppException("Room not found.");
        }

        const userConfig = room
            .userConfigs
            .find(x => x.userId.toHexString() === loggingUserId);

        if (!userConfig.pinned) {
            throw new AppException("Cannot remove pinned. This room is not pinned before.");
        }

        await updateOneRoom(
            { _id: room._id, },
            {
                '$set': {
                    'userConfigs.$[elem].pinned': false,
                    'userConfigs.$[elem].pinnedAt': null
                }
            },
            {
                multi: true,
                strict: false,
                arrayFilters: [
                    {
                        "elem.userId": toObjectId(loggingUserId),
                        "elem.pinned": true
                    }
                ]
            });

        const copyRoom = room.toObject();
        delete copyRoom['userConfigs'];

        getIo()
            .of('rooms')
            .to(loggingUserId)
            .emit('rooms.incomingRemovePinRoom', roomId, {
                ...copyRoom,
                userConfig: {
                    pinned: false,
                    pinnedAt: null
                }
            });

        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    msg: 'Remove pinned successfully.'
                }
            });
    } catch (error) {
        next(error);
    }
}