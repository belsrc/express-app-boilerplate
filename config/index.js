module.exports = {
  appName: 'boilerplate',
  workerName: 'boilerplate_worker',
  port: 3000,
  sslPort: 3043,

  useSsl: false,
  usesMongo: false,
  usesPostgres: false,
  useSockets: false,
  usePassport: false,
  useSession: false,

  ioNamespace: '/',

  userModel: 'User',
  userNameField: 'email',

  sessionSalt: process.env.SESSION_SECRET,

  logPath: __dirname + '/../logs',

  email: require('./email'),

  datastore: {
    mongo: require('./mongo.js'),
    postgres: require('./postgres'),
    redis: require('./redis'),
    crons: require('./crons'),
  },
};
