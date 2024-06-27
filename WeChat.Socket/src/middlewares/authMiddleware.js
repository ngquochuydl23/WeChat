const jwt = require("jsonwebtoken");
const { findById, updateDevice } = require("../services/deviceService");
const moment = require('moment');
const geoip = require('geoip-lite');

const authMiddleware = async (req, res, next) => {
    try {
        var ipAddress = req.ip;
        if (!req.ip) {

            if (process.env.NODE_ENV !== 'LOCAL') {
                return res
                    .status(400)
                    .json({
                        statusCode: 400,
                        error: "x-real-ip header is required"
                    });
            }

            ipAddress = '171.226.34.164';
        } else {
            ipAddress = req.ip;
        }

        const requestHeader = req.header('Authorization');
        if (!requestHeader) {
            return res
                .status(400)
                .json({
                    statusCode: 400,
                    error: "Authorization header is required"
                });
        }

        const token = req.header('Authorization').replace('Bearer ', '');
        if (token.length <= 0) {
            return res
                .status(400)
                .json({
                    statusCode: 400,
                    error: "Bearer token is empty"
                });
        }

        decodedToken = jwt.verify(token, 'secret');
        if (!decodedToken) {
            return res
                .status(401)
                .json({
                    statusCode: 401,
                    error: "Not authenticated."
                })
        }

        const device = await findById(decodedToken.deviceId);
        if (!device) {
            return res
                .status(400)
                .json({
                    statusCode: 400,
                    error: "Device cannot be detected."
                })
        }

        if (device.isTerminated) {
            return res
                .status(400)
                .json({
                    statusCode: 400,
                    error: "Device is terminated."
                })
        }

        const location = geoip.lookup(ipAddress);
        await updateDevice(device._id, {
            lastAccess: moment(),
            location,
            ipAddress
        })

        req.loggingDeviceId = decodedToken.deviceId;
        req.loggingUserId = decodedToken.userId;
        next();
    } catch (error) {
        return res
            .status(500)
            .json({
                statusCode: 500,
                error: error
            });
    }
}

const socketAuthMiddleware = async function (socket, next) {
    try {
        const token = socket.handshake.headers['audience'] === 'Postman'
            ? socket.handshake.headers['access_token']
            : socket.handshake.auth.token

        console.log(token);

        decodedToken = jwt.verify(token, 'secret');
        socket.loggingUserId = decodedToken.userId;

        next();
    } catch (error) {
        console.log(error);
    }
}


module.exports = { authMiddleware, socketAuthMiddleware }