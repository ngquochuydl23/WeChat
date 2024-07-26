import { http } from "./https";

export const findSingleRoom = (toUserId) => http.get("room/find-single-room", {
    params: { toUserId }
});

export const initRoomChat = (title, otherIds, thumbnail) => http.post("room", {
    title, otherIds, thumbnail
})

export const searchRoomChatByName = (name, skip = 0, limit = 10) => http.get("/room/search", {
    params: {
        name,
        skip,
        limit
    }
})

export const leaveRoom = (roomId) => http.post("/room/" + roomId + '/leave');

export const addMember = (roomId, otherIds) => http.post("/room/" + roomId + '/addMember', {
    otherIds: otherIds
});

export const getRoomList = (skip, limit) => http.get('/room/groups', {
    params: {
        skip, limit
    }
});

export const patchThumnail = (roomId, thumbnail) => http.patch("/room/" + roomId + '/uploadThumbnail', {
    thumbnail
});

export const patchRoomTitle = (roomId, title) => http.patch("/room/" + roomId + '/renameTitle', {
    title
});

export const pinRoom = (roomId) => http.post("/room/" + roomId + '/pin');

export const removePinRoom = (roomId) => http.post("/room/" + roomId + '/removePinRoom');