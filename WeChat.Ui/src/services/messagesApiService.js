import { http } from "./https";

export const seenMsg = (roomId) => http.post('messages/by-room/' + roomId + '/seen');