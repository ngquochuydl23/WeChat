const { socketAuthMiddleware } = require('../middlewares/authMiddleware');
const _ = require('lodash');
const { getMsgByRoomId, sendMsg, redeemMsg } = require('../services/messageService');
const { findRoomByUser, dispersionRoomById, addMemberToRoom } = require('../services/roomService');
const { logger } = require('../logger');

function chatRoomEvent(nsp) {
  nsp
    .use(socketAuthMiddleware)
    .on("connection", (socket) => {
      const { loggingUserId } = socket;

      socket.on('join', async (roomId, callback) => {
        try {

          const room = await findRoomByUser(roomId, loggingUserId);
          socket.join(roomId);

          logger.info(`${loggingUserId} join to room ${roomId}`);
          // when user access to the room chat then let them see every messages.
          // await seenAllMessages(loggingUserId, roomId);
          // Get all messages in the room for 30 days from now.
          const messages = await getMsgByRoomId(room, loggingUserId);
          // Get all medias from msgDocs
          // const medias = _.filter(msgDocs, ({ _doc }) => _doc.type === 'media');

          callback({
            room: room,
            messages: messages,
            medias: [],
            pinnedMsgs: [],
            links: [],
          });
        } catch (error) {
          console.log(error);
        }
      });

      socket.on('user.sendMsg', async function (roomId, msg, callback) {

        const room = await findRoomByUser(roomId, loggingUserId);
        const message = await sendMsg(roomId, msg, loggingUserId);

        callback({ message });
        logger.info(`${loggingUserId} sent msg to room ${room._id}`);

        socket.broadcast
          .to(roomId)
          .emit('incomingMsg', roomId, message);

        logger.info(`${loggingUserId} sent to client`);


        global.roomNsp

          //  .to(loggingUserId)
          .emit('chatRoom.sentMsg', roomId, (err, response) => {
            if (err instanceof Error) {
              console.log(err);
            } else {
              logger.info(`ChatRoom nsp emitted to Room nsp`);
              console.log(response);
            }
          });
      });

      socket.on('user.disperseRoom', async (roomId, callback) => {
        const room = await dispersionRoomById(loggingUserId, roomId);
        callback({
          emitter: room.creatorId,
          msg: "Room is dispersed successfully."
        });

        logger.info(`${loggingUserId} join to room ${roomId}`);

        const messages = await getMsgByRoomId(room, loggingUserId);
        socket
          .to(roomId)
          .emit('roomDispersion', {
            room,
            messages
          });
      })

      socket.on('user.typing', async (roomId, { type }) => {
        const room = await findRoomByUser(roomId, loggingUserId);
        socket
          .to(roomId)
          .emit('incomingTyping', roomId, type, loggingUserId);
      });

      socket.on('user.redeemMsg', async (msgId, callback) => {
        const message = await redeemMsg(loggingUserId, msgId);
        socket
          .broadcast
          .to(message.roomId.toString())
          .emit('incomingRedeemMsg', message);

        callback({ msg: "Message is redeemed successfully." });
      });

      socket.on('user.addMember', async (roomId, memberId, callback) => {
        const room = await addMemberToRoom(loggingUserId, memberId, roomId);
        logger.info(`Member ${memberId} has been added to room ${roomId}`);
        callback({
          roomId,
          memberId,
          lastMsg: room.lastMsg
        });
        console.log(room);
        socket.broadcast
          .to(roomId)
          .emit('addMember', room, room.lastMsg);
      })

      socket.on("leave", (roomId) => {
        socket.leave(roomId);

        logger.info(roomId + " leaved room.");
      });

      socket.on('disconnect', function () {
        logger.info("disconnect: " + socket.id);
      });
    });

}

module.exports = chatRoomEvent;