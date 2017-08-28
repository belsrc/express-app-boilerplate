const moment = require('moment');

/**
 * Gets the socket connection remote IP.
 * @private
 * @param {Object}  socket  The Socket object.
 * @return {String}
 */
function getSocketIp(socket) {
  const checks = [
    socket.handshake.headers['x-client-ip'],
    socket.handshake.headers['x-forwarded-for'],
    socket.handshake.headers['x-real-ip'],
    socket.handshake.headers['cf-connecting-ip'],
    socket.handshake.headers['x-cluster-client-ip'],
    socket.handshake.headers['fastly-ssl'],
    socket.handshake.headers['z-forwarded-for'],
    socket.handshake.headers['x-forwarded'],
    socket.handshake.headers['forwarded-for'],
    socket.handshake.headers.forwarded,
    socket.conn.remoteAddress,
  ];

  let ip = null;

  for(const i in checks) {
    if(checks[i]) {
      ip = checks[i];
      break;
    }
  }

  if(ip) {
    ip = ip.split(',');
    ip = ip[0].trim();
  }

  return ip;
}

/**
 * The IoLogger class.
 */
class IoLogger {
  /**
   * Initializes a new instance of the IoLogger.
   * @param {Object}  socket  The socket object.
   * @param {Object}  logger  The logger object.
   */
  constructor(socket, logger) {
    this.logger = logger;
    this.socket = socket;
  }

  /**
   * Logs the events and time to completion.
   * @param  {String}  eventName  The event name.
   * @param  {Object}  start      The event start Date object.
   * @param  {Object}  stop       The event stop Date object
   */
  logEvent(eventName, start, stop) {
    const dur = stop - start;
    const ip = getSocketIp(this.socket);
    const output = `${ (ip || 'IP N/A') } - EVENT ${ eventName } ${ dur } ms`;

    this.logger.log('info', output);
    console.log(`[${ moment().utc().format() }] ${ output }`);

    return;
  }
}

/**
 * The IoLogFacory class.
 */
class IoLogFacory {
  /**
   * Initializes a new instance of the IoLogFacory.
   * @param {Object}  logger  The logger object.
   */
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Creates a new IoLogger object.
   * @param  {Object}   socket  The socket object.
   * @return {IoLogger}
   */
  createLogger(socket) {
    return new IoLogger(socket, this.logger);
  }
}

/**
 * Gets a new instance of the {@link IoLogFacory} class.
 * @module
 */
module.exports = function(logger) {
  return new IoLogFacory(logger);
};
