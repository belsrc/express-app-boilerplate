/**
 * Logs the error and serves the error page.
 * @param {Object}    error    The error object.
 * @param {Object}    request  The request object.
 * @param {Object}    response The response object.
 * @param {Function}  next     The next function.
 */
exports.logAndRender = function(error, request, response, next) {
  const status = error.status || 500;

  if(status !== 500) {
    return next();
  }

  const env = process.env.NODE_ENV || 'development';

  // Print out the error so PM2 (or other process manager) can capture it.
  console.error(error.stack);

  response.status(status);

  if(env === 'development') {
    return response.render('errors/500', {
      message: error.message,
      error,
    });
  }

  return response.redirect('/500');
};

/**
 * Redirects to the 404 page
 * @param {Object}    error    The error object.
 * @param {Object}    request  The request object.
 * @param {Object}    response The response object.
 * @param {Function}  next     The next function.
 */
exports.notFound = function(request, response) {
  // Last in line, must be a 404
  response.status(404);

  // Print out the error so PM2 (or other process manager) can capture it.
  console.log(`${ request.ip } requested unknown (${ request.originalUrl })`);

  response.redirect('/404');
};
