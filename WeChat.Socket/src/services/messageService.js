const Room = require('../models/room');
const Message = require('../models/message');
const moment = require('moment');
const toObjectId = require('../utils/toObjectId');

async function getMsgByRoomId(
    roomId,
    loggingUserId,
    skipDays = 0,
    lastLimitDays = 30,
    msgWhereObj = {},
    limit,
    skip,
) {

    const messages = await Message
        .find({
            roomId: roomId,
            ...msgWhereObj
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
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)

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

async function findMsgById(id) {
    const msg = await Message.findById(id);
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

async function updateOneMsgById(msgId, option) {
    await Message.updateOne({ _id: toObjectId(msgId) }, { ...option });
}

module.exports = {
    getMsgByRoomId,
    deleteMsgInRoom,
    sendMsg,
    updateManyMsg,
    findOneMsg,
    countMsgs,
    findMsgById,
    updateOneMsgById
}