const nunjucks = require('nunjucks');
const moment = require('moment');

module.exports = function(dir, options) {
  const env = process.env.NODE_ENV || 'development';
  const isDevelop = env === 'development';

  if(options.noCache == null) {
    if(isDevelop) {
      options.noCache = true;
    }
    else {
      options.noCache = false;
    }
  }

  const templater = nunjucks.configure(dir, options);

  require('useful-nunjucks-filters')(templater);

  /*
  |--------------------------------------------------------------------------
  | Add Any Custom Filters
  |--------------------------------------------------------------------------
  */
  templater.addFilter('prettyDate', value => moment(new Date(value)).format('MMM DD, YYYY'));

  return templater;
};
