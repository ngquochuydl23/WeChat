const { Manager } = require("socket.io-client");


export const socketManager = (namespace, options) => {
    return new Manager(process.env.REACT_APP_SOCKET_ENDPOINT, {
        extraHeaders: {
            "Audience": process.env.REACT_APP_SOCKET_AUDIENCE
        }
    })
        .socket('/' + namespace, {
            auth: { token: localStorage.getItem('social-v2.wechat.accessToken') },
            transports: ["websocket", "polling"],
            ...options
        })
}