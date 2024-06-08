let io;

module.exports = {
    getIo: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    },
    configureSocketIo: (server) => {
        const socketIoInstance = require('socket.io')(server, {
            cors: {
                origin: "*",
                allowedHeaders: ["Audience"],
                credentials: false,
                methods: ["GET", "POST"]
            },
            transports: ["polling", "websocket"],
            pingTimeout: 60000,
            pingInterval: 25000
        });


        io = socketIoInstance;
        return io;
    }
};