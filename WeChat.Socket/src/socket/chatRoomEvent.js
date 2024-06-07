
const { socketAuthMiddleware } = require('../middlewares/authMiddleware');
const _ = require('lodash');
const moment = require('moment');
const { logger } = require('../logger');
const { findRoomByUser, findById, findOneRoom } = require('../services/roomService');
const { getMsgByRoomId, sendMsg } = require('../services/messageService');
const { default: mongoose } = require("mongoose");
const { findUsersByIds } = require('../services/userService');
const { getIo } = require('.');


function validateMemberOfRoomMiddleware(socket, next) {
	socket.onAny(async (event, ...args) => {
		const room = await findById(args[0]);

		if (!room) {
			return next(new Error('Invalid argument type'));
		}

		if (!room.members.includes(new mongoose.Types.ObjectId(socket.loggingUserId))) {
			return next(new Error('Invalid argument type'));
		}
	});
	next();
}

function chatRoomEvent(io) {
	async function emitToRoomNsp(roomId, action) {
		const room = await findById(roomId);

		room.members.forEach(member => {
			io.of('rooms')
				.to(member.toHexString())
				.emit('rooms.incomingMsg', roomId, action)
		});
	}


	io.of('chatRoom')
		.use(socketAuthMiddleware)
		.use(validateMemberOfRoomMiddleware)
		.on("connection", (socket) => {

			const { loggingUserId } = socket;

			socket.on('join', async (roomId, callback) => {
				try {
					const room = await findById(roomId);
					const users = await findUsersByIds(room.members);

					socket.join(roomId);

					logger.info(`${loggingUserId} join to room ${roomId}`);
					// when user access to the room chat then let them see every messages.
					// await seenAllMessages(loggingUserId, roomId);
					// Get all messages in the room for 30 days from now.
					const messages = await getMsgByRoomId(room, loggingUserId);
					// Get all medias from msgDocs
					// const medias = _.filter(msgDocs, ({ _doc }) => _doc.type === 'media');
					callback({
						room,
						users,
						messages: messages,
						medias: [],
						pinnedMsgs: [],
						links: [],
					});
					emitToRoomNsp(roomId, 'join');
				} catch (error) {
					console.log(error);
				}
			});


			socket.on('user.sendMsg', async function (roomId, msg, callback) {

				const room = await findById(roomId);
				const message = await sendMsg({
					type: msg.type,
					content: msg.content,
					attachment: msg.attachment,
					roomId: room._id,
					creatorId: loggingUserId
				});

				callback({ message });
				logger.info(`${loggingUserId} sent msg to room ${room._id}`);

				socket.broadcast
					.to(roomId)
					.emit('incomingMsg', roomId, message);

				logger.info(`${loggingUserId} sent to client`);

				emitToRoomNsp(roomId, 'newMsg');
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
				socket
					.to(roomId)
					.emit('incomingTyping', roomId, type, loggingUserId);

				emitToRoomNsp(roomId, 'typing');
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