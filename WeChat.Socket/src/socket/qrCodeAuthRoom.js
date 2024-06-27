const _ = require('lodash');
const { getRooms } = require('../services/roomService');
const { logger } = require('../logger');
const { AppException } = require('../exceptions/AppException');
const QR = require("qrcode");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

function qrCodeAuthRoom(io) {
    io.of('QRCodeAuth')
        .on("connection", (socket) => {

            socket.on('generateQRCode', async function (device, callback) {
                //const qrCodeId = uuidv4();
                const qrCodeId = 1234;
                const token = jwt.sign(
                    {
                        qrCodeId,
                        purpose: 'authentication',
                        device
                    },
                    "secret",
                    { expiresIn: "1h" });

                //const qrCode = await QR.toDataURL(token);

                socket.join(qrCodeId);
                callback({ token });
            });

            // fe -> onScanned -> show info
            socket.on('disconnect', function () {
                console.log("disconnect: " + socket.id);
            });

            socket.on("leave", (qrCodeId) => {
                socket.leave(qrCodeId);
            });
        })
}

module.exports = qrCodeAuthRoom;