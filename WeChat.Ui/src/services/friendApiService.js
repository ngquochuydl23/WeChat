
import { http } from "./https";

export const checkIsFriend = (toUserId) => http.get("friend/check-friend", {
    params: {
        toUserId
    }
});
