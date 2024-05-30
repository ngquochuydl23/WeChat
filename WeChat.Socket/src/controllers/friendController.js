const { AppException } = require("../exceptions/AppException");
const { addFriend, checkIsFriend, getFriends, friendCount } = require("../services/friendService");
const { findUserById } = require("../services/userService");

exports.sendRequest = async (req, res, next) => {
    try {

        const destUser = findUserById(req.body.destinationUserId);
        if (!destUser) {
            throw new AppException("Destination user does not exist.");
        }

        if (await checkIsFriend(req.loggingUserId, req.body.destinationUserId)) {
            throw new AppException("This relationship is established.");
        }

        await addFriend(req.loggingUserId, req.body.destinationUserId);
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



exports.getFriends = async (req, res, next) => {
    const searchText = req.query.searchText;

    try {
        const skip = req.skip;
        const limit = req.query.limit;
        const total = await friendCount(req.loggingUserId);

        const friends = await getFriends(
            req.loggingUserId, {
            ...(searchText && {
                $or: [
                    { "user.phoneNumber": { $regex: searchText } },
                    { "user.firstName": { $regex: searchText } },
                    { "user.lastName": { $regex: searchText } },
                    { "user.fullName": { $regex: searchText } },
                ]
            })
        }, skip, limit);



        return res
            .status(200)
            .json({
                statusCode: 200,
                friends,
                skip,
                limit,
                total
            });
    } catch (error) {
        next(error);
    }
}