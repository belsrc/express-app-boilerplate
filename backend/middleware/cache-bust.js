/**
 * Removes any cache bust strings from resource requests.
 * @module
 * @param  {Object}    request   The request object.
 * @param  {Object}    response  The response object.
 * @param  {Function}  next      The next callback.
 */
module.exports = function(request, response, next) {
  request.url = request.url.replace(/\/([^\/]+)\.[0-9a-f]+\.(css|js|jpg|png|gif|svg)$/, '/$1.$2');
  next();
};
