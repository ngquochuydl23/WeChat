const { findUserById, updateUser } = require("../services/userService");
const bcrypt = require('bcrypt');
const changePasswordShemaValidator = require('../validator/changePasswordShemaValidator');
const { AppException } = require("../exceptions/AppException");

exports.changeAvatar = async (req, res, next) => {
    try {
        await updateUser(req.loggingUserId, { avatar: req.body.avatar });

        const user = await findUserById(req.loggingUserId);
        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: "Avatar changed.",
                result: {
                    user
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.changeCover = async (req, res, next) => {
    try {
        await updateUser(req.loggingUserId, { cover: req.body.cover });

        const user = await findUserById(req.loggingUserId);
        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: "Cover changed.",
                result: {
                    user
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.changeBio = async (req, res, next) => {
    try {
        await updateUser(req.loggingUserId, { cover: req.body.bio });

        const user = await findUserById(req.loggingUserId);
        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: "Bio changed.",
                result: {
                    user
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const { error } = changePasswordShemaValidator.schema.validate(req.body);
        const { password, newPassword } = req.body;

        if (error) {
            throw new AppException(error.details[0].message);
        }

        const user = await findUserById(req.loggingUserId);
        if (!user) {
            throw new AppException("User not found.");
        }

        if (!(await bcrypt.compare(password, user.hashPassword))) {
            throw new AppException("Old password is incorrect.");
        }

        const saltRounds = 10;
        const newHashPassword = await bcrypt.hashSync(newPassword, saltRounds);

        user.hashPassword = newHashPassword;
        await user.save();

        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: "Password changed."
            });
    } catch (error) {
        next(error);
    }
};

exports.editProfile = async (req, res, next) => {
    try {
        await updateUser(req.loggingUserId, req.body);

        const user = await findUserById(req.loggingUserId);
        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: 'Update profile successfully.',
                result: {
                    user
                }
            });
    } catch (error) {
        next(error);
    }
};

exports.getMyProfile = async (req, res, next) => {
    try {
        const user = await findUserById(req.loggingUserId);
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
};

exports.getProfile = async (req, res, next) => {
    try {
        const user = await findUserById(req.params.userId);
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
};