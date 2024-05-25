import { detect } from "detect-browser";
import { http } from "./https";

export const login = ({ phoneNumber, password }) => {
    const result = detect();
    return http.post("auth/login", {
        phoneNumber: phoneNumber,
        password: password,
        deviceName: result.name,
        deviceToken: '885e2deda21a6c752f05e9c3ac95c90de31bce4b25ce38c330feee389906c83f',
        os: result.os
    });
};