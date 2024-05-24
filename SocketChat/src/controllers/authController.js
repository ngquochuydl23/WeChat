const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const signUpSchemaValidator = require('../validator/signUpSchemaValidator');
const resetPasswordShemaValidator = require('../validator/resetPasswordShemaValidator');
const loginSchemaValidator = require('../validator/loginSchemaValidator');
const { sendOtpViaEmail, verifyOtp } = require('../services/otpService');
const { AppException } = require('../exceptions/AppException');

exports.signup = async (req, res, next) => {
  try {
    const { phoneNumber, email, password } = req.body;
    const { error } = signUpSchemaValidator.schema.validate(req.body);
    if (error) {
      throw new AppException(error.details[0].message);
    }

    var user = await User
      .findOne({ $or: [{ phoneNumber: phoneNumber }, { email: email }] })
      .select('-hashPassword')
      .exec();

    if (user) {
      throw new AppException('This account is exist.');
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hashSync(password, saltRounds);

    user = new User({
      ...req.body,
      hashPassword: hashPassword,
      actived: false
    });

    await user.save();
    await sendOtpViaEmail(user, 'register');

    return res
      .status(201)
      .send({
        statusCode: 201,
        user: {
          id: user._id,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          email: user.email,
          actived: user.actived
        }
      });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      throw new AppException(errors);
    }
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  try {

    const { error } = loginSchemaValidator.schema.validate(req.body);
    if (error) {
      throw new AppException(error.details[0].message);
    }

    var user = await User
      .findOne({ phoneNumber: phoneNumber })
      .exec();
    if (!user) {
      throw new AppException("User not found.");
    }

    if (!(await bcrypt.compare(password, user.hashPassword))) {
      throw new AppException("Password is incorrect.");
    }

    if (!user.actived) {
      throw new AppException("Account has not been verified.");
    }

    const token = jwt.sign({
      userId: user._id
    }, "secret", { expiresIn: "30d" });

    return res
      .status(200)
      .json({
        statusCode: 200,
        token: token,
        userId: user._id
      });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  try {

    const { error } = loginSchemaValidator.schema.validate(req.body);
    if (error) {
      throw new AppException(error.details[0].message);
    }

    var user = await User
      .findOne({ phoneNumber: phoneNumber })
      .exec();
    if (!user) {
      throw new AppException("User not found.");
    }

    if (!(await bcrypt.compare(password, user.hashPassword))) {
      throw new AppException("Password is incorrect.");
    }

    if (!user.actived) {
      throw new AppException("Account has not been verified.");
    }

    const token = jwt.sign({
      userId: user._id
    }, "secret", { expiresIn: "30d" });

    return res
      .status(200)
      .json({
        statusCode: 200,
        token: token,
        userId: user._id
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
        message: "Verify successfully."
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
        message: "Otp has been resent."
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
        message: `Otp has been resent to "${email}"`
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
        message: "Reset password successfully."
      });
  } catch (error) {
    next(error);
  }
};

