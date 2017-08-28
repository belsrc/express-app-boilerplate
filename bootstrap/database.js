/**
 * Connect to the Mongo database.
 * @private
 * @param  {Object}  conObj  Connection configuration object.
 * @return {Object}
 */
function connectMongo(conObj) {
  const mongoose = require('mongoose');
  const connection = mongoose.createConnection(conObj.url, conObj.options);

  console.log('Successfully connected to MongoDb');
  mongoose.set('debug', conObj.debug);

  return connection;
}

/**
 * Connect to the Postgres database.
 * @private
 * @param  {Object}  conObj  Connection configuration object.
 * @return {Object}
 */
function connectPostgres(conObj) {
  const Sequelize = require('sequelize');
  let sequelize;

  const conConfig = { timezone: '+00:00' };

  conConfig.logging = conObj.debug;

  if(!conObj.url) {
    sequelize = new Sequelize(conObj.database, conObj.user, conObj.password, {
      host: conObj.host,
      dialect: 'postgres',
    });
  }
  else {
    sequelize = new Sequelize(conObj.url, conConfig);
  }

  return sequelize.authenticate().then(error => {
    if(error) {
      console.log('Unable to connect to the database:', error);
      throw new Error(error);
    }

    console.log('Connected to Postgres Database');

    return sequelize;
  });
}

/**
 * Connects to the selected database and loads the models and repositories.
 * @module
 * @param  {Object}  app  The appliaction object.
 */
module.exports = function(app) {
  if(app.locals.config.usesMongo) {
    app.locals.database = connectMongo(app.locals.config.datastore.mongo);
    require(`${ BASE_DIR }/database/models`)(app.locals.database, app.locals.config);
  }

  if(app.locals.config.usesPostgres) {
    app.locals.database = connectPostgres(app.locals.config.datastore.postgres);
    app.locals.models = require(`${ BASE_DIR }/database/models`)(app.locals.database, app.locals.config);
  }
};
