const path = require('path');
const winston = require('winston');

const env = process.env.NODE_ENV || 'development';

require('winston-mail').Mail;
require('winston-daily-rotate-file');

/**
 * Setup the error console winston transport.
 * @private
 * @return {Object}
 */
function errorConsoleTransport() {
  return new winston.transports.Console({
    level: 'error',
    colorize: true,
    timestamp: true,
  });
}

/**
 * Setup the error file winston transport.
 * @private
 * @return {Object}
 */
function errorFileTransport(logPath) {
  return new winston.transports.DailyRotateFile({
    name: 'error-logs',
    level: 'error',
    timestamp: true,
    json: false,
    filename: path.join(logPath, 'errors/error.log'),
  });
}

/**
 * Setup the error email winston transport.
 * @private
 * @return {Object}
 */
function errorMailTransport(mailConfig) {
  return new winston.transports.Mail({
    level: 'error',
    json: false,
    host: mailConfig.server,
    port: mailConfig.port,
    username: mailConfig.user,
    password: mailConfig.pass,
    to: mailConfig.mailingList.errors.address,
    from: mailConfig.sendList.error,
    subject: mailConfig.subjectList.error,
  });
}

/**
 * Setup the info log winston transport.
 * @private
 * @return {Object}
 */
function getInfoLogger(logPath) {
  return new winston.Logger({
    transports: [
      new winston.transports.DailyRotateFile({
        name: 'info-logs',
        level: 'info',
        timestamp: true,
        json: false,
        filename: path.join(logPath, 'info/info.log'),
      }),
    ],
  });
}

/**
 * Setup the user log winston transport.
 * @private
 * @return {Object}
 */
function getUserLogger(logPath) {
  return new winston.Logger({
    transports: [
      new winston.transports.DailyRotateFile({
        name: 'user-logs',
        level: 'info',
        timestamp: true,
        json: false,
        filename: path.join(logPath, 'user/user.log'),
      }),
    ],
  });
}

/**
 * Get the needed error transports for the current environment.
 * @private
 * @param  {String}  logPath     The path the log directory.
 * @param  {Object}  mailConfig  The email configuration object.
 * @return {Object}
 */
function getErrorLogger(logPath, mailConfig) {
  const errorTransports = [];

  errorTransports.push(errorConsoleTransport());
  errorTransports.push(errorFileTransport(logPath));

  if(env === 'production') {
    errorTransports.push(errorMailTransport(mailConfig));
  }

  return new winston.Logger({
    transports: errorTransports,
  });
}

/**
 * Setup the Winston loggers.
 * @module
 * @param  {String}  logPath     The path the log directory.
 * @param  {Object}  mailConfig  The email configuration object.
 * @return {Object}
 */
module.exports = function(logPath, mailConfig) {
  const genLogger = getInfoLogger(logPath);
  const userLogger = getUserLogger(logPath);
  const errLogger = getErrorLogger(logPath, mailConfig);

  if(env === 'production') {
    winston.handleExceptions(new winston.transports.DailyRotateFile({
      filename: path.join(logPath, 'exceptions/exception.log'),
    }));
  }

  return {
    general: genLogger,
    error: errLogger,
    user: userLogger,
  };
};
