import { http } from "./https";
import platform from "platform";

export const login = ({ phoneNumber, password }) => {

    return http.post("auth/login", {
        phoneNumber: phoneNumber,
        password: password,
        deviceName: platform.name + " v" + platform.version,
        deviceToken: '885e2deda21a6c752f05e9c3ac95c90de31bce4b25ce38c330feee389906c83f',
        os: platform.os.family + ' ' + platform.os.version
    });
};