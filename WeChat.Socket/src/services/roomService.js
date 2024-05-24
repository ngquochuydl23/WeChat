const {
  AppException
} = require('../exceptions/AppException');
const Room = require('../models/room');
const User = require('../models/user');
const _ = require('lodash');
const Message = require('../models/message');
const moment = require('moment');
const { logger } = require('../logger');

async function findRoomByUser(roomId, loggingUserId) {
  const room = await Room.findById(roomId);
  const members = await User.find({
    _id: {
      $in: room.members
    }
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

async function initRoomChat(title = undefined, memIds, loggingUserId) {
  const members = [...memIds, loggingUserId]

  const isSingleRoom = members.length === 2;
  const availableMembersCount = await User
    .find({
      _id: {
        $in: members
      }
    })
    .count();

  if (availableMembersCount !== members.length) {
    throw new AppException("Someone not found to create a room");
  }

  const room = new Room({
    title: title,
    members: members,
    creatorId: loggingUserId,
    singleRoom: isSingleRoom,
    userConfigs: _.map(members, member => ({
      userId: member
    }))
  });

  await room.save();

  if (!isSingleRoom) {
    var lastMsg = new Message({
      type: 'system-notification',
      content: 'created this room.',
      roomId: room._id,
      creatorId: loggingUserId
    });

    await lastMsg.save();
  }

  room.lastMsg = lastMsg;
  await room.save();
  return room;
}

async function getRooms(loggingUserId, sortObj = {}, matchObj = {}) {
  const rooms = await Room
    .aggregate([{
      $match: {
        members: {
          $elemMatch: {
            $eq: loggingUserId
          }
        },
        lastMsg: {
          $ne: null
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
        title: 1
      }
    },
    {
      $lookup: {
        from: 'Users',
        let: { member: "$members" },
        pipeline: [{
          $match: {
            $expr: {
              "$in": ["$_id", "$$member"]
            }
          }
        }],
        "as": "users"
      }
    },
    {
      "$match": {
        ...matchObj
      }
    }
    ])
  return rooms;
}

async function addMemberToRoom(loggingUserId, memberId, roomId) {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new AppException("Room not found.");
  }

  if (room.singleRoom) {
    throw new AppException("Cannot add member to single room.");
  }

  if (!room.members.includes(loggingUserId)) {
    throw new AppException("This account is not a member of this room.");
  }

  var members = await User.find({
    _id: {
      $in: room.members
    }
  });

  let isMemberAlreadyInRoom = false;
  for (const member of members) {
    if (member._id.toString() === memberId) {
      isMemberAlreadyInRoom = true;
      break;
    }
  }
  if (isMemberAlreadyInRoom) {
    throw new AppException("This account is already in room.");
  }

  const lastMsg = new Message({
    type: 'system-notification',
    content: `added '${memberId}' into room.`,
    roomId: room._id,
    creatorId: loggingUserId
  });

  lastMsg.save();

  room.lastMsg = lastMsg;
  room.members.push(memberId);
  room.userConfigs.push({
    userId: memberId
  });

  await room.save();
  members = await User.find({
    _id: {
      $in: room.members
    }
  });
  return {
    ...room._doc,
    users: members
  };
}

const dispersionRoomById = async (loggingUserId, roomId) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new AppException("Room not found.");
  }

  if (room.dispersed) {
    throw new AppException("Room is already dispersed before.");
  }

  if (room.singleRoom) {
    throw new AppException("Cannot remove single room.");
  }

  if (room.creatorId.toHexString() !== loggingUserId) {
    throw new AppException("This account is not the creator of this room.");
  }

  var lastMsg = new Message({
    type: 'system-notification',
    content: 'creator dispersed this room.',
    roomId: room._id,
    creatorId: loggingUserId
  });

  await lastMsg.save();

  room.dispersed = true;
  room.dispersedAt = moment();
  room.lastMsg = lastMsg;

  await room.save();

  logger.info(`Room ${roomId} is dispersed by creator`);

  return room;
}

module.exports = { findRoomByUser, initRoomChat, getRooms, addMemberToRoom, dispersionRoomById }
