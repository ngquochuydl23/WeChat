const User = require('../models/user');
const _ = require('lodash');


async function findUsersByIds(ids) {
  return await User.find({ _id: { $in: ids } });
}

module.exports = { findUsersByIds }