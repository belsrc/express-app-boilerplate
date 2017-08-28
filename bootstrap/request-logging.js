const moment = require('moment');
const morgan = require('morgan');

/**
 * Get the response MS time.
 * @private
 * @param  {Object}  request   The Request object.
 * @param  {Object}  response  The Response object.
 * @return {String}
 */
function getMs(request, response) {
  // missing request and/or response start time
  if(!request._startAt || !response._startAt) {
    return '--';
  }

  const ms = (response._startAt[0] - request._startAt[0]) * 1e3 +
             (response._startAt[1] - request._startAt[1]) * 1e-6;

  return ms.toFixed(3);
}

module.exports = function(app) {
  app.use(morgan((tokens, request, response) => {
    const status = response._header ? response.statusCode : undefined;
    const urlPath = request.path;
    const method = request.method;
    const ms = getMs(request, response);
    const time = moment().toISOString();

    const statusColor = status >= 500 ? 31 : // Red
                        status >= 400 ? 33 : // Yellow
                        status >= 300 ? 36 : // Cyan
                        status >= 200 ? 32 : // Green
                        0; // no color

    const methodColor = method === 'GET' ? 32 :    // Green
                        method === 'POST' ? 95 :   // Lt Magenta
                        method === 'PUT' ? 34 :    // Blue
                        method === 'DELETE' ? 91 : // Lt Red
                        0; // no color

    return `\x1b[0m[${ time }] ${ (request.remoteIP || 'IP N/A') } - \x1b[${ methodColor }m${ method } \x1b[0m${ urlPath } \x1b[${ statusColor }m${ status } \x1b[0m${ ms } ms\x1b[0m`;
  }));
};
