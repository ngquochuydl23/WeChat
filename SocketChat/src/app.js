const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const messageRoute = require('./routes/messageRoute');
const roomRoute = require('./routes/roomRoute');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const storageRoute = require('./routes/storageRoute');
const bodyParser = require('body-parser');
const app = require('express')();
const { logRequest, logError } = require('./middlewares/loggingMiddleware')
const { configureMongoDb } = require('./config/mongodb');
const chatRoomEvent = require('./socket/chatRoomEvent');
const _ = require('lodash');
const roomEvent = require('./socket/roomEvent');



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(logRequest)
app.use('/api/messages', messageRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/room', roomRoute);
app.use('/api/storage', storageRoute);
app.use(logError)

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origins: _.split(process.env.SOCKET_CORS_ORIGINS, ','),
    methods: ["GET", "POST"]
  },
  transports: ["polling", "websocket"]
});

const chatRoomNsp = io.of('/chatRoom');
const roomNsp = io.of('/rooms');



chatRoomEvent(chatRoomNsp);
roomEvent(roomNsp);

global.roomNsp = roomNsp;
app.roomNsp = roomNsp;
app.chatRoomNsp = chatRoomNsp;

module.exports = {
  server,
  configureMongoDb,
}
