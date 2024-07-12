const { countMsgs } = require("../services/messageService");
const { findById } = require("../services/roomService");
const { findUsersByIds } = require("../services/userService");
const { getIo } = require("../socket");

async function emitToRoomNsp(roomId, action) {
    const room = await findById(roomId);
    const users = await findUsersByIds(room.members);

    room.userConfigs.forEach(async (userConfig) => {
        if (!userConfig.leaved) {
            const unreadMsgCount = await countMsgs({
                roomId: room._id,
                seenBys: { $nin: [userConfig.userId] }
            });

            const copyRoom = room.toObject();
            delete copyRoom['userConfigs'];

            getIo()
                .of('rooms')
                .to(userConfig.userId.toHexString())
                .emit('rooms.incomingMsg', roomId, action, {
                    room: {
                        ...copyRoom,
                        userConfig,
                        users: users
                        
                    },
                    unreadMsgCount
                })
        }
    });
}

module.exports = { emitToRoomNsp };