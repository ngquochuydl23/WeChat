const { socketAuthMiddleware } = require('../middlewares/authMiddleware');
const _ = require('lodash');
const { findRoomByUser, getRooms, initRoomChat } = require('../services/roomService');
const { logger } = require('../logger');
const { AppException } = require('../exceptions/AppException');
const User = require('../models/user');

function roomEvent(nsp) {
  nsp
    .use(socketAuthMiddleware)
    .on("connection", (socket) => {

      const { loggingUserId } = socket;

      socket.on('subscribe', async function (args, callback) {
        logger.info(`${loggingUserId} subscribed`);

        try {
          socket.join(loggingUserId);
          const rooms = await getRooms(loggingUserId);
          callback({ rooms });
        } catch (error) {
          console.log(error);
        }
      });

      socket.on('initRoomChat', async function (groupChatData, callback) {
        const { title, members } = groupChatData;
        try {
          if (members.length < 2) {
            throw new AppException("members must be at least two.")
          }

          const room = await initRoomChat(title, members, loggingUserId);
          const memsOfRoom = await User.find({ _id: { $in: room.members } });
          logger.info(`Room ${room._id} is created.`);

          callback({
            msg: 'Created room chat successfully.',
            room: {
              ...(room._doc),
              users: memsOfRoom
            }
          });

          members
            .forEach(member => {
              logger.info(`Broadcast to ${member} `);
              socket.broadcast
                .to(member )
                .emit('rooms.incomingMsg', room._id, {
                  ...(room._doc),
                  users: memsOfRoom
                });
            });

        } catch (error) {
          console.log(error);
        }
      })

      socket.on('chatRoom.sentMsg', async function (roomId, callback) {
        const room = await findRoomByUser(roomId, loggingUserId);

        if (room) {
          socket.broadcast
            .to(loggingUserId)
            .emit('rooms.incomingMsg', roomId, room);

          callback({ msg: 'emitted.', room });
        }
      });

      socket.on('disconnect', function () {
        console.log("disconnect: " + socket.id);
      });
    })
}

module.exports = roomEvent;