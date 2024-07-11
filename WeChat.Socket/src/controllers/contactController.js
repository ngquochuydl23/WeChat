const { AppException } = require("../exceptions/AppException");
const { addFriend, findContactByUserId, getCount, findManyAsQueryable, findByContactId, updateOne } = require("../services/contactService");
const { findUserById } = require("../services/userService");
const { paginate, getPaginateQuery } = require("../utils/paginate");
const moment = require('moment');

exports.sendRequest = async (req, res, next) => {
    try {
        const toUser = findUserById(req.body.toUserId);
        if (!toUser) {
            throw new AppException("Destination user does not exist.");
        }

        if (await findContactByUserId(req.loggingUserId, req.body.toUserId)) {
            throw new AppException("This relationship is established.");
        }

        const contact = await addFriend(req.loggingUserId, req.body.toUserId);

        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: 'Send request successfully.',
                result: { contact }
            });
    } catch (error) {
        next(error);
    }
}

exports.redeemRequest = async (req, res, next) => {
    try {
        const contact = await findByContactId(req.params.contactId);

        if (!contact) {
            throw new AppException("This relationship is not established.");
        }

        await updateOne(req.params.contactId, {
            redeemed: true,
            redeemedAt: moment(),
            isDeleted: true
        });

        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: 'Send request successfully.'
            });
    } catch (error) {
        next(error);
    }
}

exports.getReceivedRequests = async (req, res, next) => {
    const { skip, limit } = getPaginateQuery(req);

    try {
        const total = await getCount(req.loggingUserId, {
            accepted: false,
            sendingRequestUserId: { $ne: req.loggingUserId }
        });

        const requests = await findManyAsQueryable(
            req.loggingUserId,
            contactConditionObj = {
                accepted: false,
                sendingRequestUserId: { $ne: req.loggingUserId }
            },
            userConditionObj = {},
            skip,
            limit);

        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    ...paginate({ requests }, total, limit, skip)
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.checkContact = async (req, res, next) => {
    try {
        if (!req.query.toUserId) {
            throw new AppException("`toUserId` query does not provided.")
        }
        const contact = await findContactByUserId(req.loggingUserId, req.query.toUserId);

        if (!contact) {
            throw new AppException("This relationship is not established.")
        }

        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    contact
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.getContacts = async (req, res, next) => {
    const searchText = req.query.searchText;
    const { skip, limit } = getPaginateQuery(req);

    try {
        const total = await getCount(req.loggingUserId, { accepted: true });

        const contacts = await findManyAsQueryable(
            req.loggingUserId,
            contactConditionObj = {
                accepted: true,
                blocked: false
            },
            userConditionObj = {
                ...(searchText && {
                    $or: [
                        { "user.phoneNumber": { $regex: searchText } },
                        { "user.firstName": { $regex: searchText } },
                        { "user.lastName": { $regex: searchText } },
                        { "user.fullName": { $regex: searchText } },
                    ]
                })
            },
            skip,
            limit);


        return res
            .status(200)
            .json({
                statusCode: 200,
                result: {
                    ...paginate({ contacts }, total, limit, skip)
                }
            });
    } catch (error) {
        next(error);
    }
}

exports.acceptRequest = async (req, res, next) => {
    try {
        const contact = await findBycontactId(req.params.contactId);
        if (!contact) {
            throw new AppException("This relationship is not established.")
        }

        if (contact.sendingRequestUserId === req.loggingUserId) {
            throw new AppException("This is not your request.");
        }

        if (contact.accepted) {
            throw new AppException("This relationship is already accepted.");
        }

        await updateOne(req.params.contactId, { accepted: true });
        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: 'Accepted successfully.'
            });
    } catch (error) {
        next(error);
    }
}

exports.unfriend = async (req, res, next) => {
    try {
        await updateOne(req.params.contactId, { isDeleted: true });
        return res
            .status(200)
            .json({
                statusCode: 200,
                msg: 'Remove friend request successfully.'
            });
    } catch (error) {
        next(error);
    }
}