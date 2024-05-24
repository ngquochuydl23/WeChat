const mongoose = require('mongoose');
const { logger } = require('../logger')


module.exports = {
  configureMongoDb() {
    return new Promise((resolve, reject) => {
      mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      mongoose.connection.on('connected', () => {
        logger.info('Mongo has connected succesfully');
        resolve()
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('Mongo has reconnected');
      });

      mongoose.connection.on('error', error => {
        logger.error('Mongo connection has an error', error);
        mongoose.disconnect()
        reject()
      });

      mongoose.connection.on('disconnected', () => {
        logger.info('Mongo connection is disconnected');
      });
    })
  }
}