const { AppException } = require('../exceptions/AppException');
const {
    initRoomChat,
    findSingleRoomByUserId,
    updateRoom,
    getRooms,
    getRoomsCount,
    findById,
    findOneRoom,
} = require('../services/roomService');
const { findUsersByIds } = require('../services/userService');
const { sendMsg } = require('../services/messageService');
const { getPaginateQuery, paginate } = require('../utils/paginate');
const { getIo } = require('../socket');
const { emitToRoomNsp } = require('../utils/socketUtils');
const toObjectId = require('../utils/toObjectId');
const moment = require('moment');
const _ = require('lodash');

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
        const rooms = await getRooms(req.loggingUserId, null, null, skip, limit);

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

        const rooms = await getRooms(req.loggingUserId, {
            "users": {
                "$elemMatch": {
                    $or: [
                        { "fullName": { "$regex": name } },
                        { "userName": { "$regex": name } }
                    ]
                }
            }
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
            .map(room.members, memberId => memberId.toHexString())
            .filter(value => otherIds.includes(value));

        if (!_.isEmpty(intersection)) {
            throw new AppException("Someone is already member of this room.");
        }

        otherIds.forEach((otherId) => {
            room.members.push(toObjectId(otherId));
            room.userConfigs.push({
                userId: toObjectId(otherId)
            });
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
