module.exports = function(app, redisConfig, gitHead, salt) {
  /*
   | Use the GIT current HEAD and previous commit, if available, plus your OWN salt
   | to get the current session key and the previous session key so that sessions
   | arent immediately invalidated
   | http://stackoverflow.com/questions/5343131/what-is-the-sessions-secret-option#answer-5343261
   */
  const session = require('express-session');
  const redis = require('redis');
  const RedisStore = require('connect-redis')(session);
  const client = redis.createClient(
    redisConfig.port,
    redisConfig.host,
    redisConfig.options
  );

  const sessionStore = new RedisStore({ client });
  const lines = gitHead.trim().split('\n');
  const lastLine = lines[lines.length - 1];
  const parts = lastLine.split(/\s/);
  const oldKey = salt + parts[0];
  const currentKey = salt + parts[1];

  app.use(session({
    name: 'session',
    secret: [ currentKey, oldKey ],
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
  }));
};
