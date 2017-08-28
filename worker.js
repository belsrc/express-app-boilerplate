const Agenda = require('agenda');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const env = process.env.NODE_ENV || 'development';
const logger = require('./bootstrap/logging')(config.logPath, config.email);

if(env !== 'production') {
  console.log('Agenda probably shouldn\' be ran on development.');
}

process.on('uncaughtException', error => {
  logger.error.log('error', `${ error.stack }\n`);
});

const jobs = fs
  .readdirSync(`${ __dirname }/jobs`)
  .filter(file => {
    const full = path.join(`${ __dirname }/jobs/${ file }`);
    const stat = fs.statSync(full);

    return file.indexOf('.') !== 0 &&
           ~file.indexOf('.js') &&
           !stat.isDirectory();
  });

if(!jobs.length) {
  console.log('No jobs to process for Agenda.');
  process.exit();
}

const agenda = new Agenda({
  db: { address: config.datastore.crons.url },
});

jobs.forEach(function(file) {
  require(`${ __dirname }/jobs/${ file }`)(agenda, logger);
});

agenda.on('ready', () => {
  // agenda.every('*/1 * * * *', 'cron example');

  console.log('Starting Agenda jobs @ ' + new Date());
  agenda.start();
});
