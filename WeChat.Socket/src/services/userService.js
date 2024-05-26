const User = require('../models/user');
const _ = require('lodash');


async function findUsersByIds(ids) {
  return await User.find({ _id: { $in: ids } });
}

async function findById(id) {
  return await User.findById(id);
}

async function updateUser(id, mergeDoc) {
  await Device.updateOne({ _id: id }, { $set: { ...mergeDoc } });
}


module.exports = { findUsersByIds, findById, updateUser }