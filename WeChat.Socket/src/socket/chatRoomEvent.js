const { socketAuthMiddleware } = require('../middlewares/authMiddleware');
const _ = require('lodash');
const { logger } = require('../logger');
const { findById, updateRoom } = require('../services/roomService');
const { getMsgByRoomId, sendMsg, updateManyMsg, findOneMsg } = require('../services/messageService');
const { default: mongoose } = require("mongoose");
const { findUsersByIds } = require('../services/userService');

function chatRoomEvent(io) {
	async function emitToRoomNsp(roomId, action, extraData) {
		const room = await findById(roomId);
		const users = await findUsersByIds(room.members);

		room.userConfigs.forEach(async ({ userId, leaved }) => {
			if (!leaved) {

				io.of('rooms')
					.to(userId.toHexString())
					.emit('rooms.incomingMsg', roomId, action, {
						room: { ...room.toObject(), users: users },
						unreadMsgCount: 0,
						...extraData
					})
			}
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

					const userConfig = room.userConfigs.find(x => x.userId.toHexString() === loggingUserId);

					if (userConfig.leaved) {
						return callback({
							status: 'refuse',
							error: 'User is not belong to the room'
						});
					}

					socket.join(roomId);

					logger.info(`${loggingUserId} join to room ${roomId}`);
					// when user access to the room chat then let them see every messages.
					// await seenAllMessages(loggingUserId, roomId);
					// Get all messages in the room for 30 days from now.
					const messages = await getMsgByRoomId(room, loggingUserId);
					const medias = await getMsgByRoomId(room, loggingUserId, undefined, undefined, {
						attachment: { $ne: null },
						'attachment.mime': /^image/
					}, 6, 0);
					// Get all medias from msgDocs
					// const medias = _.filter(msgDocs, ({ _doc }) => _doc.type === 'media');
					callback({
						status: 'ok',
						response: {
							room,
							users,
							messages: messages,
							medias: medias,
							pinnedMsgs: [],
							links: [],
						}
					});
				} catch (error) {
					console.log(error);
				}
			});

			// socket.on('user.disperseRoom', async (roomId, callback) => {

			// 	const lastMsg = await sendMsg({
			// 		type: 'system-notification',
			// 		content: 'creator dispersed this room.',
			// 		attachment: msg.attachment,
			// 		roomId: roomId,
			// 		creatorId: loggingUserId
			// 	});

			// 	await updateRoom(roomId, {
			// 		lastMsg,
			// 		dispersed: true,
			// 		dispersedAt: moment()
			// 	});

			// 	const messages = await getMsgByRoomId(room, loggingUserId);
			// 	socket
			// 		.to(roomId)
			// 		.emit('roomDispersion', { room, messages });

			// 	callback({
			// 		emitter: loggingUserId,
			// 		msg: "Room is dispersed successfully."
			// 	});
			// })

			socket.on('user.typing', async (roomId, { type }) => {
				socket
					.to(roomId)
					.emit('incomingTyping', roomId, type, loggingUserId);

				emitToRoomNsp(roomId, 'typing', {
					typing: /^true$/i.test(type),
					typingUserId: loggingUserId
				});
			});

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