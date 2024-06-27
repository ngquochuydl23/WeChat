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
                const qrCodeId = uuidv4();
                const token = jwt.sign(
                    {
                        qrCodeId,
                        purpose: 'authentication',
                        device
                    },
                    "secret",
                    { expiresIn: "1h" });


                socket.join(qrCodeId);
                callback({ token });
            });

            socket.on('disconnect', function () {
                console.log("disconnect: " + socket.id);
            });
        })
}

module.exports = qrCodeAuthRoom;