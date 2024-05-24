import {
    io
} from "socket.io-client";

const connectSocket = (path) => {
    const socket = io(path);

    // Lắng nghe sự kiện khi kết nối thành công
    socket.on('connect', () => {
        console.log('Connected to server');
    });

    // Lắng nghe sự kiện khi ngắt kết nối
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
}

export default connectSocket;