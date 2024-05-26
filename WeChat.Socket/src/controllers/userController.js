const User = require("../models/user");
const bcrypt = require('bcrypt');
const editProfileSchemaValidator = require('../validator/editProfileSchemaValidator');
const changePasswordShemaValidator = require('../validator/changePasswordShemaValidator');
const { AppException } = require('../exceptions/AppException');
const { updateUser, findById } = require("../services/userService");


exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.loggingUserId, { hashPassword: 0 });
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

exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new AppException("No userId provided.");
    }

    const user = await User.findById(req.params.userId, { hashPassword: 0 });
    if (!user) {
      throw new AppException("User not found.");
    }
    return res
      .status(200)
      .json({
        result: {
          user
        }
      });
  } catch (error) {
    next(error);
  }
};


exports.editProfile = async (req, res, next) => {
  try {
    const { error } = editProfileSchemaValidator.schema.validate(req.body);
    const { email, phoneNumber, fullName } = req.body;
    if (error) {
      throw new AppException(error.details[0].message);
    }

    const user = await User.findById(req.loggingUserId, { hashPassword: 0 });
    if (!user) {
      throw new AppException("User not found.");
    }

    user.email = email;
    user.phoneNumber = phoneNumber;
    user.fullName = fullName;
    await user.save();

    return res
      .status(200)
      .json({
        result: {
          user
        }
      });
  } catch (error) {
    next(error);
  }
};


exports.getUsers = async (req, res, next) => {
  try {
    const { search, notIncludeMe } = req.query;
    const searchCondition = (search && {
      $or: [
        { email: { $regex: search } },
        { fullName: { $regex: search } },
        { phoneNumber: { $regex: search } }
      ]
    })

    const notIncludeMeCondition = (notIncludeMe && {
      _id: { $ne: req.loggingUserId }
    })

    const users = await User.find({
      ...searchCondition,
      ...notIncludeMeCondition
    }, '-hashPassword -actived');

    return res
      .status(200)
      .json({
        statusCode: 200,
        users
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

    const user = await User.findById(req.loggingUserId);
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

exports.changeAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    await updateUser(req.loggingUserId, { avatar: avatar });

    const user = await findById(req.loggingUserId)
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
