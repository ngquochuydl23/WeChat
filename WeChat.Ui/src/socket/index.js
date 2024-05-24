const { Manager } = require("socket.io-client");


export const socketManager = (namespace, options) => {
  return new Manager(process.env.REACT_APP_SOCKET_ENDPOINT, {})
  .socket('/' + namespace, {
    auth: {
      token: localStorage.getItem('accessToken')
    },
    transports: ["websocket","polling"],
    ...options
  })
}