import { http } from "./https";

export const getMyProfile = () => http.get("user/me");

export const changeAvatar = (avatarUrl) => http.patch("user/me/change-avatar", { avatar: avatarUrl });