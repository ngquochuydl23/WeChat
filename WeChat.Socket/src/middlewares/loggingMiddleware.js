
const { AppException } = require('../exceptions/AppException');
const { logger } = require('../logger');

exports.logRequest = (req, res, next) => {
    logger.info(req.url);
    try {
        next();
    } catch (error) {
        next(error, req, res, next);
    }
}

exports.logError = (err, req, res, next) => {
    if (err) {
        if (process.env.MONGODB_CONNECTION_STRING !== 'PRODUCTION') {
            console.error(err);
        }

        if (err instanceof AppException) {
            // Only log in AppException
            logger.error(err.message, err);
            return res
                .status(400)
                .json({
                    statusCode: 400,
                    error: err.message
                });
        }

        return res
            .status(500)
            .json({
                statusCode: 500,
                // Must not log in PRODUCTION environment due to security with Internal Service
                error: process.env.MONGODB_CONNECTION_STRING !== 'PRODUCTION'
                    ? err.message
                    : 'Somethings went wrong'
            });
    }
    next();
} 
