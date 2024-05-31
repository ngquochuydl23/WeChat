const Device = require("../models/device");

async function findById(id) {
    return await Device.findById(id);
}

async function addDevice(device) {
    var doc = new Device({ ...device });
    await doc.save();
    return doc;
}

async function updateDevice(id, mergeDoc) {
    await Device.updateOne({ _id: id, isTerminated: false }, { $set: { ...mergeDoc } });
}

async function getOneAsQueryable(where) {
    return Device.findOne({ ...where, isTerminated: false });
}

async function getManyAsQueryable(where, skip, limit) {
    return Device
        .find({ ...where, isTerminated: false })
        .sort({ lastAccess: -1, createdAt: -1 },)
        .skip(skip)
        .limit(limit);
}

async function getCount(where) {
    return await Device.find({ ...where, isTerminated: false }).count();
}

async function terminateDevice(id) {
    await updateDevice(id, { isTerminated: true });
}

module.exports = {
    findById,
    addDevice,
    updateDevice,
    getManyAsQueryable,
    getOneAsQueryable,
    terminateDevice,
    getCount
}