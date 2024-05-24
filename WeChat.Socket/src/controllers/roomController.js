const _ = require('lodash');
const { AppException } = require('../exceptions/AppException');
const {
  findRoomByUser,
  initRoomChat,
  getRooms,
  addMemberToRoom,
  dispersionRoomById
} = require('../services/roomService');
const User = require('../models/user');

exports.findRoom = async (req, res, next) => {
  const loggingUserId = req.loggingUserId;
  const { roomId } = req.params;

  try {
    const room = await findRoomByUser(roomId, loggingUserId);
    return res
      .status(200)
      .json({
        room,
        statusCode: 200,
      });
  } catch (error) {
    next(error);
  }
}

exports.initRoomChat = async (req, res, next) => {
  const loggingUserId = req.loggingUserId;
  const { members, title } = req.body;
  try {
    const room = await initRoomChat(title, members, loggingUserId);
    return res
      .status(200)
      .json({
        room,
        statusCode: 200,
      });
  } catch (error) {
    next(error);
  }
}

exports.getLastRooms = async (req, res, next) => {
  const loggingUserId = req.loggingUserId;
  try {
    const rooms = await getRooms(loggingUserId);

    return res
      .status(200)
      .json({
        rooms,
        statusCode: 200,
      });
  } catch (error) {
    next(error);
  }
}

exports.getRoomsByMemberName = async (req, res, next) => {
  try {
    const loggingUserId = req.loggingUserId;
    const { memberName } = req.query;
    if (!memberName) {
      throw new AppException("No member name provided.");
    }

    const users = await User.find({
      fullName: { $regex: memberName },
      _id: { $ne: loggingUserId }
    }, '-hashPassword -actived');

    const rooms = await getRooms(loggingUserId, {}, {
      "users": {
        "$elemMatch": {
          "fullName": { "$regex": memberName }
        }
      }
    });

    return res
      .status(200)
      .json({
        statusCode: 200,
        users: users,
        rooms: rooms
      });
  } catch (error) {
    next(error);
  }
};

exports.addMemberToRoom = async (req, res, next) => {
  try {
    const loggingUserId = req.loggingUserId;
    const { memberId } = req.body;
    const { roomId } = req.params;

    await addMemberToRoom(loggingUserId, memberId, roomId);
    return res
      .status(200)
      .json({
        statusCode: 200,
        message: "Added member to room."
      });
  } catch (error) {
    next(error);
  }
}

exports.dispersionRoomById = async (req, res, next) => {
  try {
    const loggingUserId = req.loggingUserId;
    const { roomId } = req.params;

    await dispersionRoomById(loggingUserId, roomId);
    return res
      .status(200)
      .json({
        statusCode: 200,
        message: "Room is dispersed successfully."
      });
  } catch (error) {
    next(error);
  }
}