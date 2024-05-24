const Room = require('../models/room');
const Message = require('../models/message');
const _ = require('lodash');
const moment = require('moment');
const { AppException } = require('../exceptions/AppException');
const { io } = require('../app');
const room = require('../models/room');
const mongoose = require('mongoose');

async function getMsgByRoomId(
  room,
  loggingUserId,
  skipDays = 0,
  lastLimitDays = 30
) {
  const userConfig = _.find(room.userConfigs,
    x => x.userId.toHexString() === loggingUserId);

  const messages = await Message
    .find({
      roomId: room._id,
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

async function sendMsg(roomId, msg, loggingUserId) {
  var room = await Room.findById(roomId);
  var message = new Message({
    type: msg.type,
    content: msg.content,
    roomId: room._id,
    creatorId: loggingUserId,
    attachment: msg.attachment
  });

  await message.save();
  room.lastMsg = message;
  await room.save();

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

module.exports = { getMsgByRoomId, deleteMsgInRoom, sendMsg, redeemMsg }