const roomMsgMiddleware = async (req, res, next) => {
    try {
        next();
    } catch (error) {
        return res
            .status(400)
            .json({
                statusCode: 400,
                error: error
            });
    }
}