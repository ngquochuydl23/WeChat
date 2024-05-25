const { logger } = require("../logger");
const { getOneAsQueryable, getManyAsQueryable, terminateDevice } = require("../services/deviceService");
const { AppException } = require("../exceptions/AppException");

exports.findDevices = async (req, res, next) => {
    const loggingUserId = req.loggingUserId;
    var devices = await getManyAsQueryable(
        {
            userId: loggingUserId,
            isTerminated: false
        },
        {
            lastAccess: -1,
            createdAt: -1
        });

    return res
        .status(200)
        .json({
            statusCode: 200,
            result: {
                devices
            }
        });
}

exports.terminateDeviceById = async (req, res, next) => {
    const loggingUserId = req.loggingUserId;
    const { deviceId } = req.params;

    try {
        const device = await getOneAsQueryable({
            _id: deviceId,
            userId: loggingUserId,
            isTerminated: false
        });

        if (!device) {
            throw new AppException('Device not found.');
        }

        await terminateDevice(deviceId);

        logger.info(`${deviceId} has been terminated by user.`);
        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: 'Device is terminated successfully.'
            });
    } catch (err) {
        next(err);
    }
}

