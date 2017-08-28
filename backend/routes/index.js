const fs = require('fs');
const path = require('path');

// Needs to be synchronous or it just kind of funky
function loadAll(filePath, app, config) {
  fs.readdirSync(filePath)
    .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach(file => {
      const full = path.join(filePath, file);
      const stat = fs.statSync(full);

      if(stat && stat.isDirectory()) {
        return loadAll(full, app, config);
      }

      if(full.endsWith('.js')) {
        return require(full)(app, config);
      }
    });
}

module.exports = function(app, config) {
  return loadAll(__dirname, app, config);
};
