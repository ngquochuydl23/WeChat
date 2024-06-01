import { http } from "./https";

export const getMyProfile = () => http.get("profile/");

export const changeAvatar = (avatarUrl) => http.patch("profile/change-avatar", { avatar: avatarUrl });