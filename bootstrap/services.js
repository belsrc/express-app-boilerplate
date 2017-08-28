/* eslint-disable newline-after-var, no-multiple-empty-lines */

const container = require('di-con');

const errorDir = `${ BASE_DIR }/backend/errors`;
const moduleDir = `${ BASE_DIR }/backend/modules`;
const repoDir = `${ BASE_DIR }/database/repositories`;
const controllerDir = `${ BASE_DIR }/backend/controllers`;

// IoC container using di-con
module.exports = function(config, models) {
  /*
   |--------------------------------------------------------------------------
   | Errors
   |--------------------------------------------------------------------------
   | Bind error class constructor to a container function.
   | const DbError = container.make('error.database');
   | throw DbError('Example');
   */
  const AppError = require(`${ errorDir }/application-error`);
  container.bind('error.application', () => msg => new AppError(msg));

  const DbError = require(`${ errorDir }/database-error`);
  container.bind('error.database', () => msg => new DbError(msg));

  /*
   |--------------------------------------------------------------------------
   | Modules
   |--------------------------------------------------------------------------
   */
  // container.bind('some-module', require(`${ moduleDir }/some-module`)).depends(someDep);

  /*
   |--------------------------------------------------------------------------
   | Repositories
   |--------------------------------------------------------------------------
   */
  // container.bind('some-repo', require(`${ repoDir }/some-repo`)).depends(models.model('SomeModel'));

  /*
   |--------------------------------------------------------------------------
   | Controllers
   |--------------------------------------------------------------------------
   */
  // container.bind('some-controller', require(`${ controllerDir }/some-controller`)).depends('some-repo');

  return container;
};
