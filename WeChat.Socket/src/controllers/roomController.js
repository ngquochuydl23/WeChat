const _ = require('lodash');
const { AppException } = require('../exceptions/AppException');
const {
    initRoomChat,
    findSingleRoomByUserId,
    updateRoom,
    getRooms,
    getRoomsCount,
} = require('../services/roomService');
const { findUsersByIds } = require('../services/userService');
const { sendMsg } = require('../services/messageService');
const { getPaginateQuery, paginate } = require('../utils/paginate');
const { getIo } = require('../socket');
const { emitToRoomNsp } = require('../utils/socketUtils');


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
    const { otherIds, title } = req.body;
    const loggingUserId = req.loggingUserId;

    try {

        if ((await findUsersByIds(otherIds)).length !== otherIds.length) {
            throw new AppException("Someone is not found to create a room.");
        }

        if (otherIds.length === 1 && await findSingleRoomByUserId(loggingUserId, otherIds[0])) {
            throw new AppException("Room is already created.");
        }

        const room = await initRoomChat(title, otherIds, loggingUserId);

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
