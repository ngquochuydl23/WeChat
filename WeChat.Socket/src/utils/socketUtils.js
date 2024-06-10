const { findById } = require("../services/roomService");
const { findUsersByIds } = require("../services/userService");
const { getIo } = require("../socket");

async function emitToRoomNsp(roomId, action) {
    const room = await findById(roomId);
    const users = await findUsersByIds(room.members);

    room.members.forEach(member => {
        getIo()
            .of('rooms')
            .to(member.toHexString())
            .emit('rooms.incomingMsg', roomId, action, {
                room: { ...room.toObject(), users: users },
                unreadMsgCount: 0
            })
    });
}

module.exports = { emitToRoomNsp };