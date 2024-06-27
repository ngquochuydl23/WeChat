const { generateFromEmail } = require('unique-username-generator');
const User = require('../models/user');
const _ = require('lodash');

async function addUser() {
    const user = new User({
        ...req.body,
        fullName: req.body.lastName + ' ' + req.body.firstName,
        hashPassword: hashPassword,
        userName: generateFromEmail(req.body.email),
        actived: false
    });

    await user.save();
}

async function findUsersByIds(ids) {
    return await User.find({ _id: { $in: ids } }).select('-hashPassword -isDeleted');
}

async function findUserById(id) {
    return await User.findById(id).select('-hashPassword -isDeleted');
}

async function updateUser(id, mergeDoc) {
    await User.updateOne({ _id: id }, { $set: { ...mergeDoc } });
}

async function findOneUser(condition) {
    return await User.findOne({ ...condition }).select('-hashPassword -isDeleted');
}

async function findOneUserByPhone(phoneNumber) {
    return findOneUser({ phoneNumber })
}

module.exports = {
    findUsersByIds,
    findUserById,
    updateUser,
    findOneUser,
    findOneUserByPhone,
    addUser
}