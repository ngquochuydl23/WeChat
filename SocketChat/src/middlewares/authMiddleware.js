const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const requestHeader = req.header('Authorization');
    if (!requestHeader) {
      return res
        .status(400)
        .json({
          statusCode: 400,
          error: "Authorization header is required"
        });
    }

    const token = req.header('Authorization').replace('Bearer ', '');
    if (token.length <= 0) {
      return res
        .status(400)
        .json({
          statusCode: 400,
          error: "Bearer token is empty"
        });
    }

    decodedToken = jwt.verify(token, 'secret');

    if (!decodedToken) {
      return res
        .status(401)
        .json({
          statusCode: 401,
          error: "Not Authenticated."
        })
    }
    req.loggingUserId = decodedToken.userId;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({
        statusCode: 500,
        error: error
      });
  }
}


const socketAuthMiddleware = async function (socket, next) {
  try {

    const token = socket.handshake.headers['audience'] === 'Postman'
      ? socket.handshake.headers['access_token']
      : socket.handshake.auth.token

    decodedToken = jwt.verify(token, 'secret');
    socket.loggingUserId = decodedToken.userId;

    next();
  } catch (error) {
    console.log(error)

  }
}


module.exports = { authMiddleware, socketAuthMiddleware }