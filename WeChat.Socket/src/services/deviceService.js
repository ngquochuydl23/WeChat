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
    await Device.updateOne({ _id: id }, { $set: { ...mergeDoc } });
}

async function getOneAsQueryable(where) {
    return Device.findOne({ ...where });
}

async function getManyAsQueryable(where, sort) {
    return Device
        .find({ ...where })
        .sort({ ...sort });
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
    terminateDevice
}