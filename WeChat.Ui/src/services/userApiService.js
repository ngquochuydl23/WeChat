import { http } from "./https";

export const findUserByPhone = (phoneNumber) => http.get("user/find-by-phone", { params: { phoneNumber } });
