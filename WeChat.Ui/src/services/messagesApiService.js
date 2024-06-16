import { http } from "./https";

export const seenMsg = (roomId) => http.post('messages/by-room/' + roomId + '/seen');

export const sendMsg = (roomId, msg) => http.post('messages/by-room/' + roomId + '/sendMsg', {
    msg
});

export const redeemMsg = (msgId) => http.post('messages/' + msgId + '/redeem');