const { Manager } = require("socket.io-client");


export const socketManager = (namespace, options) => {
  return new Manager(process.env.REACT_APP_SOCKET_ENDPOINT, {})
    .socket('/' + namespace, {
      auth: {
        token: localStorage.getItem('social-v2.wechat.accessToken')
      },
      extraHeaders: {
        "my-custom-header": process.env.REACT_APP_SOCKET_AUDIENCE
      },
      transports: ["websocket", "polling"],
      ...options
    })
}