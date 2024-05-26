import { http } from "./https";

export const getMyProfile = () => http.get("user/me");