const { default: mongoose } = require("mongoose");
const Contact = require("../models/contact");
const toObjectId = require("../utils/toObjectId");

async function addFriend(loggingUserId, toUserId) {
    const contact = new Contact({
        users: [loggingUserId, toUserId],
        sendingRequestUserId: loggingUserId,
        accepted: false
    });

    await contact.save();
    return contact;
}

async function findContactByUserId(loggingUserId, toUserId) {
    return await Contact.findOne({
        '$expr': {
            '$setEquals': ['$users', [toObjectId(loggingUserId), toObjectId(toUserId)]]
        }
    });
}

async function getCount(loggingUserId, condition) {
    return await Contact
        .find({
            users: { $in: [loggingUserId] },
            isDeleted: false,
            ...condition
        })
        .count();
}

async function updateOne(id, mergeDoc) {
    await Contact.updateOne({ _id: id }, { $set: { ...mergeDoc } });
}

async function findByContactId(contactId) {
    return await Contact.findOne({ _id: toObjectId(contactId) });
}

async function findManyAsQueryable(loggingUserId, contactConditionObj, userConditionObj, skip, limit) {
    return await Contact
        .aggregate([
            {
                $match: {
                    users: { $in: [new toObjectId(loggingUserId)] },
                    isDeleted: false,
                    ...contactConditionObj
                }
            },
            { $unwind: '$users' },
            { $match: { users: { $ne: toObjectId(loggingUserId) } } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "Users",
                    localField: "users",
                    foreignField: "_id",
                    pipeline: [{
                        $project: {
                            fullName: 1,
                            userName: 1,
                            avatar: 1,
                            gender: 1
                        }
                    }],
                    as: "users"
                }
            },
            {
                $project: {
                    accepted: 1,
                    redeemed: 1,
                    redeemedAt: 1,
                    sendingRequestUserId: 1,
                    user: { $first: "$users" }
                }
            },
            { "$match": { ...userConditionObj } }
        ]);
}

module.exports = {
    addFriend,
    findContactByUserId,
    getCount,
    updateOne,
    findByContactId,
    findManyAsQueryable
}