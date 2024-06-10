
const { socketAuthMiddleware } = require('../middlewares/authMiddleware');
const _ = require('lodash');
const { logger } = require('../logger');
const { findById, updateRoom } = require('../services/roomService');
const { getMsgByRoomId, sendMsg } = require('../services/messageService');
const { default: mongoose } = require("mongoose");
const { findUsersByIds } = require('../services/userService');



function chatRoomEvent(io) {
	async function emitToRoomNsp(roomId, action) {
		const room = await findById(roomId);
		const users = await findUsersByIds(room.members);

		room.members.forEach(member => {
			io.of('rooms')
				.to(member.toHexString())
				.emit('rooms.incomingMsg', roomId, action, {
					room: { ...room.toObject(), users: users },
					unreadMsgCount: 0
				})
		});
	}

	io.of('chatRoom')
		.use(socketAuthMiddleware)
		.on("connection", (socket) => {

			socket.use(async (packet, next) => {
				const room = await findById(packet[1]);
				if (!room) {
					return next(new Error('Room not found'));
				}

				if (!room.members.includes(new mongoose.Types.ObjectId(socket.loggingUserId))) {
					return next(new Error('Invalid argument type'));
				}

				return next();
			});


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

				await updateRoom(roomId, { lastMsg: message });

				socket.broadcast
					.to(roomId)
					.emit('incomingMsg', roomId, message);

				emitToRoomNsp(roomId, 'newMsg');
				callback({ message });

				logger.info(`${loggingUserId} sent msg to room ${room._id}`);
			});


			socket.on('user.disperseRoom', async (roomId, callback) => {

				const lastMsg = await sendMsg({
					type: 'system-notification',
					content: 'creator dispersed this room.',
					attachment: msg.attachment,
					roomId: roomId,
					creatorId: loggingUserId
				});

				await updateRoom(roomId, {
					lastMsg,
					dispersed: true,
					dispersedAt: moment()
				});

				const messages = await getMsgByRoomId(room, loggingUserId);
				socket
					.to(roomId)
					.emit('roomDispersion', { room, messages });

				callback({
					emitter: loggingUserId,
					msg: "Room is dispersed successfully."
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

				emitToRoomNsp(roomId, 'redeemMsg');

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