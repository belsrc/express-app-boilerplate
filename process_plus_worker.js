/* THIS WILL ONLY WORK WITH NEWER VERSIONS OF PM2 THAT SUPPORT JS PROCESS FILES */

const config = require('./config').production;
const name = config.appName.toLowerCase()
                           .replace(/\s+/g, '_')     // Replace spaces with _
                           .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                           .replace(/\_\_+/g, '_')   // Replace multiple _ with single _
                           .replace(/^_+/, '')       // Trim _ from start of str
                           .replace(/_+$/, '');      // Trim _ from end of str

module.exports = {
  apps: [ {
    name,
    script: 'server.js',
    max_restarts: 10,
    // If you want clustering just uncomment these two lines
    // instances  : 'max',
    // exec_mode  : 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: config.port,
    },
    node_args: [
      '--optimize_for_size',
      '--max_old_space_size=500',
      '--gc_interval=100',
    ],
  }, {
    name: `${ name }_worker`,
    script: 'worker.js',
    max_restarts: 10,
    env: {
      NODE_ENV: 'production',
    },
    node_args: [
      '--optimize_for_size',
      '--max_old_space_size=500',
      '--gc_interval=100',
    ],
  } ],
};
