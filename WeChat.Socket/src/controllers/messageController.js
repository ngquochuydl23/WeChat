const _ = require('lodash');
const app = require('../app');
const { AppException } = require('../exceptions/AppException');
const { getMsgByRoomId, deleteMsgInRoom, sendMsg, redeemMsg, updateManyMsg, findOneMsg } = require('../services/messageService');
const { findRoomByUser, updateRoom } = require('../services/roomService');
const toObjectId = require('../utils/toObjectId');
const { emitToRoomNsp } = require('../utils/socketUtils');


exports.getMsgByRoomId = async (req, res, next) => {
    const loggingUserId = req.loggingUserId;
    const { lastLimitDays, skipDays } = req.query;
    const { roomId } = req.params;

    try {
        const room = await findRoomByUser(roomId, loggingUserId);
        const messages = await getMsgByRoomId(
            room,
            loggingUserId,
            skipDays,
            lastLimitDays);

        return res
            .status(200)
            .json({
                statusCode: 200,
                lastLimitDays,
                skipDays,
                roomId,
                messages
            });
    } catch (error) {
        next(error);
    }
}

exports.deleteMsgByRoomId = async (req, res, next) => {
    const loggingUserId = req.loggingUserId;
    const { roomId } = req.params;

    try {
        const room = await findRoomByUser(roomId, loggingUserId);

        await deleteMsgInRoom(loggingUserId, room);
        return res
            .status(200)
            .json({
                message: "Delete message successfully.",
                statusCode: 200,
            });
    } catch (error) {
        next(error);
    }
}


exports.seenMsgs = async (req, res, next) => {
    const loggingUserId = req.loggingUserId;
    const { roomId } = req.params;
    await updateManyMsg(
        {
            roomId: roomId,
            seenBys: { $nin: [toObjectId(loggingUserId)] }
        },
        {
            $push: { seenBys: toObjectId(loggingUserId) }
        })

    const lastMsg = await findOneMsg({ roomId: roomId }, { createdAt: -1 });

    await updateRoom(roomId, { lastMsg: lastMsg });
    await emitToRoomNsp(roomId, 'seenMsg');

    return res
        .status(200)
        .json({
            statusCode: 200,
            msg: 'All messages have been seen.'
        });
}

exports.sendMsg = async (req, res, next) => {
    const { msg } = req.body;
    const { roomId } = req.params;
    const loggingUserId = req.loggingUserId;

    try {
        io.of('/rooms')
            .emit('chatRoom.sentMsg', roomId, (err, response) => {
                if (err instanceof Error) {
                    console.log(err);
                } else {
                    logger.info(`ChatRoom nsp emitted to Room nsp`);
                    console.log(response);
                }
            });
        return res
            .status(201)
            .json({
                statusCode: 201,
                message
            });

    } catch (error) {
        next(error);
    }
}

exports.redeemMsg = async (req, res, next) => {
    const { msgId } = req.params;
    const loggingUserId = req.loggingUserId;

    try {
        const message = await redeemMsg(loggingUserId, msgId);

        return res
            .status(201)
            .json({
                statusCode: 201,
                message
            });

    } catch (error) {
        next(error);
    }
}

