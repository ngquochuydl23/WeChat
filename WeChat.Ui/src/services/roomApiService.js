import { http } from "./https";

export const findSingleRoom = (toUserId) => http.get("room/find-single-room", {
    params: { toUserId }
});

export const initRoomChat = (title, otherIds) => http.post("/room", {
    title, otherIds
})

export const searchRoomChatByName = (name, skip = 0, limit = 10) => http.get("/room/search", {
    params: {
        name,
        skip,
        limit
    }
})