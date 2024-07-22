const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const signUpSchemaValidator = require('../validator/signUpSchemaValidator');
const resetPasswordShemaValidator = require('../validator/resetPasswordShemaValidator');
const loginSchemaValidator = require('../validator/loginSchemaValidator');
const { sendOtpViaEmail, verifyOtp } = require('../services/otpService');
const { AppException, ValidationMongoException } = require('../exceptions/AppException');
const { addDevice, terminateDevice } = require('../services/deviceService');
const { findOneUser, findUserById } = require('../services/userService');
const { generateFromEmail } = require("unique-username-generator");
const { getIo } = require('../socket');

exports.signup = async (req, res, next) => {
    try {
        const {
            phoneNumber,
            email,
            password
        } = req.body;

        const { error } = signUpSchemaValidator.schema.validate(req.body);
        if (error) {
            throw new AppException(error.details[0].message);
        }

        var user = await findOneUser({ $or: [{ phoneNumber: phoneNumber }, { email: email }] });

        if (user) {
            throw new AppException('This account is already exist.');
        }

        const saltRounds = 10;
        const hashPassword = await bcrypt.hashSync(password, saltRounds);

        user = new User({
            ...req.body,
            fullName: req.body.lastName + ' ' + req.body.firstName,
            hashPassword: hashPassword,
            userName: generateFromEmail(req.body.email),
            actived: false
        });

        await user.save();
        await sendOtpViaEmail(user, 'register');

        return res
            .status(201)
            .send({
                statusCode: 201,
                result: {
                    user: {
                        id: user._id,
                        fullName: user.fullName,
                        phoneNumber: user.phoneNumber,
                        email: user.email,
                        actived: user.actived
                    }
                }
            });
    } catch (error) {
        if (error.name === "ValidationError") {
            throw new ValidationMongoException(error);
        }
        return next(error);
    }
};

exports.login = async (req, res, next) => {

    const { appversion, appname, platform } = req.headers;
    const {
        phoneNumber,
        password,
        deviceToken,
        deviceName,
        os
    } = req.body;

    try {
        const { error } = loginSchemaValidator.schema.validate(req.body);
        if (error) {
            throw new AppException(error.details[0].message);
        }

        var user = await User.findOne({ phoneNumber: phoneNumber });
        if (!user) {
            throw new AppException("User not found.");
        }

        if (!(await bcrypt.compare(password, user.hashPassword))) {
            throw new AppException("Password is incorrect.");
        }

        if (!user.actived) {
            throw new AppException("Account has not been verified.");
        }

        var device = await addDevice({
            deviceToken,
            deviceName,
            platform,
            appVersion: appversion,
            appName: appname,
            os,
            userId: user._id,
        });

        const token = jwt.sign({ userId: user._id, deviceId: device._id, }, "secret", { expiresIn: "30d" });

        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: "Login successfully",
                result: {
                    token: token,
                    userId: user._id,
                    deviceId: device._id
                }
            });
    } catch (error) {
        next(error);
    }
};


exports.loginViaQRCode = async (req, res, next) => {
    const { qrCodeToken } = req.body;
    try {
        const payload = jwt.verify(qrCodeToken, 'secret');
        if (payload.purpose !== 'authentication') {
            throw new AppException("");
        }

        const user = await findUserById(req.loggingUserId);
        getIo()
            .of('QRCodeAuth')
            .to(payload.qrCodeId)
            .emit("mobile.scan", user, payload.device);

        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    payload
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.confirmLoginViaQRCode = async (req, res, next) => {
    const { qrCodeToken } = req.body;
    try {
        const payload = jwt.verify(qrCodeToken, 'secret');
        if (payload.purpose !== 'authentication') {
            throw new AppException("");
        }

        const user = await findUserById(req.loggingUserId);
        var device = await addDevice({
            deviceToken,
            deviceName,
            platform,
            appVersion: appversion,
            appName: appname,
            os,
            userId: user._id,
        });

        const token = jwt.sign({ userId: user._id, deviceId: device._id, }, "secret", { expiresIn: "30d" });
        getIo()
            .of('QRCodeAuth')
            .to(payload.qrCodeId)
            .emit("mobile.scan", user, payload.device);

        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    payload
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.logout = async (req, res, next) => {
    const loggingDeviceId = req.loggingDeviceId;

    try {
        await terminateDevice(loggingDeviceId);
        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: "Logout successfully"
            });
    } catch (error) {
        next(error);
    }
};

exports.verifyOtp = async (req, res, next) => {
    const { otp, email, verificationType } = req.body;
    try {
        var user = await User
            .findOne({ email: email })
            .exec();

        if (!user) {
            throw new AppException("User not found.");
        }

        if (user.actived && verificationType === 'register') {
            throw new AppException("This account has been verified.");
        }

        await verifyOtp(user, verificationType, otp);

        if (verificationType === 'register') {
            user.actived = true;
            await user.save();
        }

        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: "Verify successfully."
            });
    } catch (error) {
        next(error);
    }
};

exports.resendOtp = async (req, res, next) => {
    const { email, verificationType } = req.body;
    try {
        var user = await User
            .findOne({ email: email })
            .exec();

        if (!user) {
            throw new AppException("User not found.");
        }

        if (verificationType === 'register' && user.actived) {
            throw new AppException("This account is already actived.");
        }

        await sendOtpViaEmail(user, verificationType);
        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: "Otp has been resent."
            });
    } catch (error) {
        next(error);
    }
};


exports.requestRequestPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        var user = await User
            .findOne({ email: email })
            .exec();

        if (!user) {
            throw new AppException("User not found.");
        }

        if (!user.actived) {
            throw new AppException("Account has not been verified.");
        }

        await sendOtpViaEmail(user, 'reset-password');
        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: `Otp has been resent to "${email}"`
            });
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    const { email, otp, newPassword } = req.body;
    const { error } = resetPasswordShemaValidator.schema.validate(req.body);
    if (error) {
        throw new AppException(error.details[0].message);
    }
    try {
        var user = await User
            .findOne({ email: email })
            .exec();

        if (!user) {
            throw new AppException("User not found.");
        }

        if (!user.actived) {
            throw new AppException("Account has not been verified.");
        }

        await verifyOtp(user, 'reset-password', otp);
        user.hashPassword = await bcrypt.hashSync(newPassword, 10);

        await user.save();

        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: "Reset password successfully."
            });
    } catch (error) {
        next(error);
    }
};

