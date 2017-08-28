const fs = require('fs');
const path = require('path');

function makeModelName(fileName) {
  return fileName
    .substr(0, fileName.indexOf('.'))
    .split(/[\s\-_]+/)
    .map(i => i.charAt(0).toUpperCase() + i.slice(1))
    .join('');
}

// Needs to be synchronous or it just kind of funky
module.exports = function(dbAdapter, config) {
  const tmp = {};

  fs.readdirSync(__dirname)
    .filter(file => {
      return file.indexOf('.') !== 0 &&
             file !== 'index.js' &&
             ~file.indexOf('.js');
    })
    .forEach(file => {
      const full = path.join(__dirname, file);
      const stat = fs.statSync(full);

      // Ignore directories since we dont want to included embedded docs (mongo) or relation files (postgres).
      if(stat && !stat.isDirectory()) {
        const mod = require(path.join(__dirname, file))(dbAdapter);

        if(config.usesPostgres) {
          const name = makeModelName(file);

          tmp[name] = mod;
        }

        return;
      }
    });

  if(config.usesPostgres) {
    return require('./embedded/_relations')(tmp);
  }

  return;
};
