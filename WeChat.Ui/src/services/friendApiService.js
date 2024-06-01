
import { http } from "./https";

export const checkIsFriend = (toUserId) => http.get("friend/check-friend", {
    params: {
        toUserId
    }
});

export const sendRequest = (toUserId) => http.post("friend/", { toUserId });

export const redeemRequest = (friendId) => http.post("friend/" + friendId + '/redeem');

export const acceptRequest = (friendId) => http.post("friend/" + friendId + '/accept');
