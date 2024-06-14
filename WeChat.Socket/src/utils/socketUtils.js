const { countMsgs } = require("../services/messageService");
const { findById } = require("../services/roomService");
const { findUsersByIds } = require("../services/userService");
const { getIo } = require("../socket");
const toObjectId = require("./toObjectId");

async function emitToRoomNsp(roomId, action) {
    const room = await findById(roomId);
    const users = await findUsersByIds(room.members);

    // room.members.forEach(async member => {

    //     const unreadMsgCount = await countMsgs({
    //         roomId: room._id,
    //         seenBys: { $nin: [toObjectId(member)] }
    //     });

    //     getIo()
    //         .of('rooms')
    //         .to(member.toHexString())
    //         .emit('rooms.incomingMsg', roomId, action, {
    //             room: { ...room.toObject(), users: users },
    //             unreadMsgCount
    //         })
    // });

    room.userConfigs.forEach(async ({ userId, leaved }) => {
        if (!leaved) {
            const unreadMsgCount = await countMsgs({
                roomId: room._id,
                seenBys: { $nin: [userId] }
            });

            getIo()
                .of('rooms')
                .to(userId.toHexString())
                .emit('rooms.incomingMsg', roomId, action, {
                    room: { ...room.toObject(), users: users },
                    unreadMsgCount
                })
        }
    });
}

module.exports = { emitToRoomNsp };