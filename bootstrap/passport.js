const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const keeper = require('@belsrc/cryptkeeper');

/**
 * Validate the usr credentials.
 * @private
 * @param  {Object}    user      The user database object.
 * @param  {String}    username  The given user name [passed in case of unknown user].
 * @param  {String}    password  The given password.
 * @param  {Function}  done      The callback function.
 */
function validateUser(user, username, password, done) {
  if(!user) {
    console.log(`Unknown user email (${ username })`);

    return done(null, false);
  }

  return keeper
    .compareArgon(password, user.password)
    .then(isMatch => {
      if(isMatch) {
        return done(null, user);
      }

      return done(null, false);
    });
}

/**
 * Gets the email function.
 * @module
 * @param  {Object}  app       The application object.
 * @param  {Object}  passport  The passport object.
 */
module.exports = function(app) {
  passport.use(new LocalStrategy(
    { usernameField: app.locals.config.userNameField, passReqToCallback: true },
    (request, username, password, done) => {
      let User;

      if(app.locals.config.usesMongo) {
        User = app.locals.database.model(app.locals.config.userModel);
      }
      else {
        User = app.locals.models[app.locals.config.userModel];
      }

      const query = {};

      query[app.locals.config.userNameField] = username;

      return User
        .findOne(query)
        .then(user => validateUser(user, username, password, done))
        .catch(error => done(error, false));
    }
  ));

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    let User;

    if(app.locals.config.usesMongo) {
      User = app.locals.database.model(app.locals.config.userModel);
    }
    else {
      User = app.locals.models[app.locals.config.userModel];
    }

    return User
      .findOne({ where: { id }})
      .then(user => {
        if(!user) {
          return done(new Error('unknown user'));
        }

        return done(null, user);
      })
      .catch(error => done(error));
  });

  app.use(passport.initialize());
  app.use(passport.session());
};
