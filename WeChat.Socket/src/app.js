const createError = require('http-errors');
const path = require('path');
const cors = require('cors')
const messageRoute = require('./routes/messageRoute');
const roomRoute = require('./routes/roomRoute');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const deviceRoute = require('./routes/deviceRoute');
const contactRoute = require('./routes/contactRoute');
const profileRoute = require('./routes/profileRoute');
const pingRoute = require('./routes/pingRoute');
const bodyParser = require('body-parser');
const app = require('express')();
const { logRequest, logError } = require('./middlewares/loggingMiddleware')
const { configureMongoDb } = require('./config/mongodb');
const { configureRedisDb } = require('./config/redis')
const chatRoomEvent = require('./socket/chatRoomEvent');
const _ = require('lodash');
const roomEvent = require('./socket/roomEvent');
const { configureSocketIo } = require('./socket');
const qrCodeAuthRoom = require('./socket/qrCodeAuthRoom');



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(logRequest)
app.use('/api/ping', pingRoute);;
app.use('/api/messages', messageRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/room', roomRoute);
app.use('/api/device', deviceRoute);
app.use('/api/contact', contactRoute);
app.use('/api/profile', profileRoute);

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
const io = configureSocketIo(server);
qrCodeAuthRoom(io);

chatRoomEvent(io);
roomEvent(io);


module.exports = {
  server,
  configureMongoDb,
  configureRedisDb
}
