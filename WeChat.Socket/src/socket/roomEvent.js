const { socketAuthMiddleware } = require('../middlewares/authMiddleware');
const _ = require('lodash');
const { getMsgRooms } = require('../services/roomService');
const { logger } = require('../logger');
const { AppException } = require('../exceptions/AppException');
const User = require('../models/user'); 

function roomEvent(io) {
    io.of('rooms')
        .use(socketAuthMiddleware)
        .on("connection", (socket) => {

            const { loggingUserId } = socket;

            socket.on('subscribe', async function (args, callback) {
                logger.info(`${loggingUserId} subscribed`);

                try {
                    socket.join(loggingUserId);
                    const rooms = await getMsgRooms(loggingUserId);

                    callback({ rooms });
                } catch (error) {
                    console.log(error);
                }
            });

            socket.on('disconnect', function () {
                console.log("disconnect: " + socket.id);
            });
        })
}

module.exports = roomEvent;