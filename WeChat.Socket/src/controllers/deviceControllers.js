const { logger } = require("../logger");
const { getOneAsQueryable, getManyAsQueryable, terminateDevice, getCount } = require("../services/deviceService");
const { AppException } = require("../exceptions/AppException");
const { getPaginateQuery, paginate } = require("../utils/paginate");

exports.findDevices = async (req, res, next) => {
    const loggingUserId = req.loggingUserId;
    const { skip, limit } = getPaginateQuery(req);

    try {
        const total = await getCount();
        const devices = await getManyAsQueryable({ userId: loggingUserId }, skip, limit);

        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    ...paginate({ devices }, total, limit, skip)
                }
            });
    } catch (error) {
        next(error);
    }
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

