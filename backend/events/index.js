const fs = require('fs');
const path = require('path');

// Needs to be synchronous or it just kind of funky
function loadAll(filePath, io, socket, app, logFactory) {
  fs.readdirSync(filePath)
    .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach(file => {
      const full = path.join(filePath, file);
      const stat = fs.statSync(full);

      if(stat && stat.isDirectory()) {
        return loadAll(full, io, socket, app, logFactory);
      }

      if(full.endsWith('.js')) {
        return require(full)(io, socket, app, logFactory);
      }
    });
}

module.exports = function(server, app, logFactory) {
  const io = require('socket.io')(server);

  const ioObj = io
    .of(app.locals.config.ioNamespace)
    .on('connection', socket => loadAll(__dirname, ioObj, socket, app, logFactory));

  if(app.settings.env === 'development') {
    console.log(`Created socket.io channel ${ app.locals.config.ioNamespace }`);
  }

  app.locals.socket = ioObj;
};
