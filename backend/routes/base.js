const Promise = require('bluebird');

module.exports = function(app) {
  // Get error types
  const applicationError = app.locals.container.make('error.application');
  const databaseError = app.locals.container.make('error.database');

  // If authentication needed
  // const authenticate = require(`${ BASE_DIR }/backend/middleware/authenticate`);

  // Get the needed controllers
  // const neededController = app.locals.container.make('needed-controller');

  // On caught errors
  // app.locals.errorLog.log('error', `${ error.stack }\n`);

  app.get('/', (request, response, next) => response.render('index'));

  app.get('/health', (request, response) => response.sendStatus(200));
  // app.get('/health', (request, response) => app.locals.repositories.model
  //   .readOne()
  //   .then(() => response.sendStatus(200))
  //   .catch(error => {
  //     app.locals.errorLog.log('error', `${ error.stack }\n`);
  //     return response.sendStatus(500);
  //   })
  // );

  app.get('/favicon.ico', (request, response) => response.sendFile(`${ BASE_DIR }/public/img/favicon.ico`));

  app.get('/403', (request, response) => response.render('errors/403'));

  app.get('/404', (request, response) => response.render('errors/404'));

  app.get('/500', (request, response) => response.render('errors/500'));
};
