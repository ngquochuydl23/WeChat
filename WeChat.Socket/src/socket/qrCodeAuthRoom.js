const _ = require('lodash');
const { getRooms } = require('../services/roomService');
const { logger } = require('../logger');
const { AppException } = require('../exceptions/AppException');

function qrCodeAuthRoom(io) {
    io.of('QRCodeAuth')
        .on("connection", (socket) => {
            
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

            socket.on('disconnect', function () {
                console.log("disconnect: " + socket.id);
            });
        })
}

module.exports = roomEvent;