const env = process.env.NODE_ENV || 'development';

/**
 * Checks if the user is authenticated and redirects accordingly.
 * @param {Object}    request  The request object.
 * @param {Object}    response The response object.
 * @param {Function}  next     The next function.
 */
exports.route = function(request, response, next) {
  if(env !== 'production') {
    return next();
  }

  if(request.isAuthenticated()) {
    return next();
  }

  if(request.method === 'GET' && request.session) {
    request.session.redirected = request.url;
  }

  return response.redirect('/login');
};

/**
 * Checks if the user is authenticated and Admin and redirects accordingly.
 * @param {Object}    request  The request object.
 * @param {Object}    response The response object.
 * @param {Function}  next     The next function.
 */
exports.role = function(request, response, next) {
  if(request.isAuthenticated() && this.request.user.role !== 'admin') {
    return next();
  }

  if(request.method === 'GET') {
    if(request.session) {
      request.session.redirected = request.url;
    }
  }

  return response.redirect('/login');
};

exports.basic = function(user, pass) {
  return function(request, response, next) {
    if(env !== 'production') {
      return next();
    }

    const header = request.headers['proxy-authorization'] || request.headers.authorization;

    if(!header) {
      return response.sendStatus(403);
    }

    const tokens = header.split(' ');

    if(tokens[0] !== 'Basic') {
      return response.sendStatus(403);
    }

    // Would normally do some sort of look up here

    const userPass = new Buffer(tokens[1], 'base64').toString().split(':');
    const username = userPass[0];
    const password = userPass[1];

    if(username === user && password === pass) {
      return next();
    }

    return response.sendStatus(403);
  };
};
