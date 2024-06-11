const Room = require('../models/room');
const Message = require('../models/message');
const _ = require('lodash');
const moment = require('moment');
const { AppException } = require('../exceptions/AppException');
const { io } = require('../app');
const room = require('../models/room');
const mongoose = require('mongoose');

async function getMsgByRoomId(
    roomId,
    loggingUserId,
    skipDays = 0,
    lastLimitDays = 30
) {

    const messages = await Message
        .find({
            roomId: roomId,
            // createdAt: {
            //   $gte: moment()
            //     .subtract(
            //       _.min([
            //         (+lastLimitDays + +skipDays),
            //         moment(userConfig.chatDeletedAt || userConfig.joinedAt)
            //           .diff(moment(), 'days'),
            //       ]),
            //       'days')
            //     .startOf('day')
            //     .format(),
            //   $lte: moment()
            //     .subtract(skipDays, 'days')
            //     .endOf('day')
            //     .format()
            // }
        })
        .sort({ createdAt: -1 });

    return messages;
}

async function deleteMsgInRoom(loggingUserId, room) {
    await Room.updateOne({
        _id: room._id,
        'userConfigs.userId': loggingUserId
    }, {
        '$set': {
            'userConfigs.$.chatDeletedAt': moment()
        }
    });
}

async function findOneMsg(whereObj = {}, sortObj = {}) {
    const msg = await Message.findOne({ ...whereObj })
        .sort({ ...sortObj });
    return msg;
}

async function countMsgs(whereObj = {}) {
    const count = await Message
        .find({ ...whereObj })
        .count();

    return count;
}

async function updateManyMsg(whereObj = {}, option = {}) {
    await Message.updateMany({ ...whereObj }, { ...option });
}


async function sendMsg(msg) {
    const message = new Message({ ...msg });

    await message.save();
    return message;
}

async function redeemMsg(loggingUserId, msgId) {
    const message = await Message.findById(msgId);
    const room = await Room.findById(message.roomId);

    if (!message) {
        throw new AppException("Message not found.");
    }

    if (message.creatorId.toHexString() !== loggingUserId) {
        throw new AppException("Message is not belong to this account.");
    }

    if ((message.redeem)) {
        throw new AppException("Cannot not redeem this msg. It is redeemed before.");
    }

    message.redeem = true;
    await message.save();


    const notifyMsg = new Message({
        type: 'system-notification',
        content: 'redeemMsg.',
        roomId: room._id,
        createdAt: message.createdAt,
        creatorId: loggingUserId
    });

    await notifyMsg.save();


    room.lastMsg = notifyMsg;
    await room.save();

    return message;
}

module.exports = { getMsgByRoomId, deleteMsgInRoom, sendMsg, redeemMsg, updateManyMsg, findOneMsg, countMsgs }