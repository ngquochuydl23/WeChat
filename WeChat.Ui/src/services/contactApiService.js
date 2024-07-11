
import { http } from "./https";

export const checkContact = (toUserId) => http.get("contact/check", {
    params: {
        toUserId
    }
});

export const sendRequest = (toUserId) => http.post("contact/", { toUserId });

export const redeemRequest = (contactId) => http.post("contact/" + contactId + '/redeem');

export const acceptRequest = (contactId) => http.post("contact/" + contactId + '/accept');

export const unfriend = (contactId) => http.delete("contact/" + contactId);

export const getContacts = (searchText, skip, limit) => http.get("contact/", {
    params: {
        searchText,
        skip,
        limit
    }
});
