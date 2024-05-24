const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}` + (info.splat !== undefined ? `${info.splat}` : " "))
  ),
  transports: [
    new (transports.Console)({ 'timestamp': true })
  ]
});


module.exports = {
  logger
};