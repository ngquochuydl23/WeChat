import { http } from "./https";

export const getDevices = () => {
    return http.get('/device/');
};