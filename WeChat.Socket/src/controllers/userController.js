const { AppException } = require("../exceptions/AppException");
const { findOneUserByPhone } = require("../services/userService");

exports.findByPhoneNumber = async (req, res, next) => {
    try {
        const user = await findOneUserByPhone(req.query.phoneNumber);
        if (!user) {
            throw new AppException("User not found.");
        }

        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    user
                }
            });
    } catch (error) {
        next(error);
    }
}   


