/*
 |--------------------------------------------------------------------------
 | Globals Variables
 |--------------------------------------------------------------------------
 */
global.BASE_DIR = __dirname;

/*
 |--------------------------------------------------------------------------
 | Module Dependencies
 |--------------------------------------------------------------------------
 */

const fs = require('fs');
const cluster = require('cluster');
const express = require('express');
const app = express();
const http = require('http');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const headgear = require('headgear');
const headerConfig = require(`${ BASE_DIR }/config/headgear.json`);

/*
 |--------------------------------------------------------------------------
 | Environment
 |--------------------------------------------------------------------------
 */
dotenv.load({ path: '.env' });

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;
const sslPort = process.env.SSL_PORT || 3043;

const isProduction = env === 'production';
const isDevelop = env !== 'production';

/*
 |--------------------------------------------------------------------------
 | Development Dashboard
 |--------------------------------------------------------------------------
 */
if(isDevelop) {
  require('nodejs-dashboard');
}

/*
 |--------------------------------------------------------------------------
 | Get Environment Config
 |--------------------------------------------------------------------------
 */
const config = require(`${ BASE_DIR }/config`);
app.locals.config = config;

/*
 |--------------------------------------------------------------------------
 | Setup HTTP Server
 |--------------------------------------------------------------------------
 */
const server = http.createServer(app);

/*
 |--------------------------------------------------------------------------
 | Setup HTTPS Server (If Needed)
 |--------------------------------------------------------------------------
 | openssl genrsa -out privatekey.pem 1024
 | openssl req -new -key privatekey.pem -out certrequest.csr
 | openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
 |
 */
let sslServer;

if(config.useSsl) {
  if(isDevelop) {
    console.log('Setting up SSL configuration...');
  }

  const https = require('https');
  const sslOptions = {
    key: fs.readFileSync('./ssl/privatekey.pem'),
    cert: fs.readFileSync('./ssl/certificate.pem')
  };

  sslServer = https.createServer(sslOptions, app);
}

/*
 |--------------------------------------------------------------------------
 | Connect to Data Store
 |--------------------------------------------------------------------------
 |
 | Uses the config's usesMongo and usesPostgres values to determine connection.
 | Adds the connection object to app.locals.database
 | Loads models
 |   In the case of Postgres, they are added to app.local.models.[name]
 |   For mongoose, they can be accessed in the normal way, app.locals.database.models([name])
 | Loads the repositories which can be accessed from app.locals.repositories.[name]
 |
 */
if(config.usesMongo || config.usesPostgres) {
  if(isDevelop) {
    console.log('Setting up database...');
  }

  require(`${ BASE_DIR }/bootstrap/database`)(app);
}

/*
 |--------------------------------------------------------------------------
 | Initialize IoC Services Container
 |--------------------------------------------------------------------------
 */
const container = require(`${ BASE_DIR }/bootstrap/services`)(app.locals.config, app.locals.models || app.locals.database || []);
app.locals.container = container;

/*
 |--------------------------------------------------------------------------
 | Initialize Passport
 |--------------------------------------------------------------------------
 */
if(config.usePassport) {
  if(isDevelop) {
    console.log('Setting up Passport...');
  }

  require(`${ BASE_DIR }/bootstrap/passport`)(app, config);
}

/*
 |--------------------------------------------------------------------------
 | View Settings
 |--------------------------------------------------------------------------
 */
if(isDevelop) {
  console.log('Setting up template engine...');
}

const viewDir = `${ BASE_DIR }/frontend/views/`;

app.set('views', viewDir);
app.set('view engine', 'html');

const nunjucksConfig = {
  autoescape: true,
  express: app,
};

const templateEnv = require('./bootstrap/template-engine')(viewDir, nunjucksConfig);

/*
 |--------------------------------------------------------------------------
 | Remote IP Middlware
 |--------------------------------------------------------------------------
 |
 | Needs to be added before the logging middleware
 |
 */
const ipMiddleware = require('connect-remote-ip');

app.use(ipMiddleware);

/*
 |--------------------------------------------------------------------------
 | Cache Max Age Headers
 |--------------------------------------------------------------------------
 |
 | Needs to be added before the static file middleware
 |
 */
if(isProduction) {
  const mimeCache = require(`${ BASE_DIR }/backend/middleware/mime-cache`);

  app.use(mimeCache);
}

/*
 |--------------------------------------------------------------------------
 | Security Headers
 |--------------------------------------------------------------------------
 |
 | Needs to be added before the static file middleware
 |
 */
if(isDevelop) {
  console.log('Setting up security header middleware...');
}

app.use(headgear.removePoweredBy());
app.use(headgear.noSniff());
app.use(headgear.frameOption(headerConfig.frameOption));
app.use(headgear.downloadOption());
app.use(headgear.xssProtect());
// app.use(headgear.all(headerConfig));
// app.use(headgear.contentSecurity(headerConfig.contentSecurity));

/*
 |--------------------------------------------------------------------------
 | Cache Buster
 |--------------------------------------------------------------------------
 |
 | Needs to be added before the static file middleware
 |
 */
if(isProduction) {
  const gitHead = fs.readFileSync(`${ BASE_DIR }/.git/refs/heads/master`).toString();
  const cacheBuster = require(`${ BASE_DIR }/backend/middleware/cache-bust`);

  app.locals.buster = '.' + gitHead;
  app.use(cacheBuster);
}
else {
  app.locals.buster = '';
}

/*
 |--------------------------------------------------------------------------
 | Compression Middleware
 |--------------------------------------------------------------------------
 |
 | Needs to be added before the static file middleware
 |
 */
app.use(compression({ threshold: 512 }));

/*
 |--------------------------------------------------------------------------
 | HTTPS Forwarding
 |--------------------------------------------------------------------------
 */
if(config.useSsl && isProduction) {
  const redirect = require('express-redirect-https');
  const redirectConfig = require(`${ BASE_DIR }/config/redirect.json`);

  redirectConfig.httpsPort = config.sslPort;
  app.use(redirect(redirectConfig));
}

/*
 |--------------------------------------------------------------------------
 | Static File Middleware
 |--------------------------------------------------------------------------
 */
app.use(express.static(`${ BASE_DIR }/public`));

/*
 |--------------------------------------------------------------------------
 | Cookie Middleware
 |--------------------------------------------------------------------------
 |
 | Needs to be added before the session middleware
 |
 */
app.use(cookieParser());

/*
 |--------------------------------------------------------------------------
 | Request Body Parsing Middleware
 |--------------------------------------------------------------------------
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
 |--------------------------------------------------------------------------
 | Session Storage
 |--------------------------------------------------------------------------
 */
if(config.useSession) {
  if(isDevelop) {
    console.log('Setting up session store...');
  }

  const gitLogHead = fs.readFileSync(`${ BASE_DIR }/.git/logs/HEAD`).toString();

  require('./bootstrap/session')(app, config.datastore.redis, gitLogHead, config.sessionSalt);
}

/*
 |--------------------------------------------------------------------------
 | HTTP Logging
 |--------------------------------------------------------------------------
 |
 | Needs to be before the routes are required
 |
 */
require('./bootstrap/request-logging')(app);

if(isDevelop) {
  require('./bootstrap/mem-usage')(app);
}

/*
 |--------------------------------------------------------------------------
 | Add Logger to App Object
 |--------------------------------------------------------------------------
 |
 | Needs to be before the routes are required
 |
 */
const loggers = require('./bootstrap/logging')(config.logPath, config.email);

app.locals.generalLog = loggers.general;
app.locals.errorLog = loggers.error;
app.use((request, response, next) => {
  app.locals.generalLog.log('info', `${ (request.remoteIP || 'IP N/A') } - ${ request.method || 'HTTP Method Unknown' } ${ request.originalUrl }`);
  return next();
});

/*
 |--------------------------------------------------------------------------
 | Add Logging to Mongo connections
 |--------------------------------------------------------------------------
 */
if(config.usesMongo) {
  app.locals.database.on('error', error => {
    app.locals.generalLog.log('error', `${ error.stack || error }\n`);
  });
}

/*
 |--------------------------------------------------------------------------
 | Load Routes
 |--------------------------------------------------------------------------
 */
require(`${ BASE_DIR }/backend/routes`)(app, config);

/*
 |--------------------------------------------------------------------------
 | Load Socket Event Listeners
 |--------------------------------------------------------------------------
 |
 | Needs to be after the controllers
 | Adds the socket object to app.locals.socket
 |
 */
if(config.useSockets) {
  if(isDevelop) {
    console.log('Setting up Socket.io...');
  }

  const ioLogFactory = require('./bootstrap/io-logging')(app.locals.generalLog);

  require(`${ BASE_DIR }/backend/events`)(config.useSsl ? sslServer : server, app, ioLogFactory);
}

/*
 |--------------------------------------------------------------------------
 | Error Handling
 |--------------------------------------------------------------------------
 |
 | Needs to be after the routes are required
 |
 */
const errorMiddleware = require(`${ BASE_DIR }/backend/middleware/error-handling`);

if(isProduction) {
  app.use(errorMiddleware.logAndRender);
  app.use(errorMiddleware.notFound);
}

/*
 |--------------------------------------------------------------------------
 | Run App
 |--------------------------------------------------------------------------
 */
server.listen(port);
if(cluster.isWorker) {
  console.info(`==> \x1b[91m↻\x1b[0m  Running in ${ env.toUpperCase() } [pid: ${ process.pid }]`);
}
else {
  console.info(`==> \x1b[91m↻\x1b[0m  Running in ${ env.toUpperCase() }`);
}

console.info('==> \x1b[32m✔\x1b[0m  Server is listening');
console.info('==> \x1b[34m🌎\x1b[0m  Port %j', port);

if(config.useSsl) {
  sslServer.listen(sslPort);
  console.info('==> \x1b[32m✔\x1b[0m  Secure server is listening');
  console.info('==> \x1b[34m🌎\x1b[0m  Port %j', sslPort);
}

/*
 |--------------------------------------------------------------------------
 | Output registered routes
 |--------------------------------------------------------------------------
 */
if(isDevelop) {
  require('exreg-routes')(app);
}
