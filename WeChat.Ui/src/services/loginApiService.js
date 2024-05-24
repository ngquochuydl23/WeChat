import { http } from "./https";

export const login = (phoneNumber, password) => http.post("auth/login", { phoneNumber, password });