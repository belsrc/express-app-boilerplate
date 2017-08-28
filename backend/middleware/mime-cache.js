const onHeaders = require('on-headers');

/**
 * Gets the cache time based on mime type.
 * @private
 * @param  {String}  mimeType  The mime type of the request.
 * @return {String}
 */
function getCacheTime(mimeType) {
  /** cache values */
  const hour = 60 * 60;
  const week = hour * 24 * 7;
  const month = week * 4;
  const year = month * 12;

  /** mime type regexps */
  const dataRegex = /^(?:text\/(?:cache-manifest|html|xml)|application\/(?:(?:rdf\+)?xml|json))/;
  const feedRegex = /^application\/(?:rss|atom)\+xml$/;
  const faviconRegex = /^image\/x-icon$/;
  const mediaRegex = /(image|video|audio|svg|text\/x-component|application\/(?:font-woff|x-font-ttf|vnd\.ms-fontobject)|font\/opentype)/;
  const cssJsRegex = /^(?:text\/(?:css|x-component)|application\/javascript)/;

  if(!mimeType || dataRegex.test(mimeType)) {
    return 'public,max-age=0';
  }

  // Feed
  if(feedRegex.test(mimeType)) {
    return `public,max-age=${ hour }`;
  }

  // Favicon (cannot be renamed)
  if(faviconRegex.test(mimeType)) {
    return `public,max-age=${ week }`;
  }

  // Media: images, video, audio
  // HTC files  (css3pie)
  // Webfonts
  if(mediaRegex.test(mimeType)) {
    return `public,max-age=${ month }`;
  }

  // CSS and JavaScript
  if(cssJsRegex.test(mimeType)) {
    return `public,max-age=${ year }`;
  }

  // Misc
  return `public,max-age=${ month }`;
}

/**
 * Adds caching headers to the reponse.
 * @module
 * @param  {Object}    request   The request object.
 * @param  {Object}    response  The response object.
 * @param  {Function}  next      The next callback.
 */
module.exports = function(request, response, next) {
  const types = require(`${ BASE_DIR }/config/mime-types.json`);

  // Can't use arrow function as it loses context
  onHeaders(response, function() {
    const self = this;
    let type = self.getHeader('Content-Type') || '';
    const splitType = type.split(';')[0];

    // normalize unknown types to empty string
    if(!type || !types[splitType]) {
      type = '';
    }

    let headerValue = getCacheTime(type);

    // Prevent mobile network providers from modifying your site
    headerValue += `${ (headerValue ? ',' : '') }no-transform`;
    self.setHeader('Cache-Control', headerValue);

    // Set Keep-Alive Header
    self.setHeader('Connection', 'keep-alive');
  });

  return next();
};
