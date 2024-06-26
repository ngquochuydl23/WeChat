
import { http } from "./https";

export const checkIsFriend = (toUserId) => http.get("friend/check-friend", {
    params: {
        toUserId
    }
});

export const sendRequest = (toUserId) => http.post("friend/", { toUserId });

export const redeemRequest = (friendId) => http.post("friend/" + friendId + '/redeem');

export const acceptRequest = (friendId) => http.post("friend/" + friendId + '/accept');

export const unfriend = (friendId) => http.delete("friend/" + friendId);


export const getFriends = (searchText, skip, limit) => http.get("friend/", {
    params: {
        searchText,
        skip,
        limit
    }
})