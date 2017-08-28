## Express.js Boilerplate
Just another Express.js boilerplate. This is for personal use but if want to use it, go ahead. May change or break without notice.
In production, the application is made to be started using the process.js file (PM2 required).

#### Application Configuration

  All of the application's configuration is in the ```/config``` directory.
  Environment configuration should be added to a  ```.env``` file.


#### PM2 Configuration

  There's not much to configure when using PM2. The application name should be changed in the ```process.js``` file as
  it is 'boilerplate' by default. If you want to change the Node flag values, those can also be found in the ```process.js``` file.


#### App Starting

  When using PM2 you can start the app simply using ```pm2 start process.js```, this would be the same, if you're not using PM2, as
  ```node --optimize_for_size --max_old_space_size=500 --gc_interval=100 server.js```.

  The process.js file is currently set up to use a single process, if clustering is desired, ```"script": "server.js"``` in the process file
  will need to be changed to ```"script": "cluster.js"```. Or you can use PM2's cluster mode by adding ```"instances" : "max"```
  to the process.js file

#### Dev Commands

  ```npm run dev```

  This will run webpack in development mode to build CSS and JS. Which will watch the files for change and build them, unminified.

  ```npm run lint```

  This will run eslint on the files in the ```/backend``` folder.

  ```npm run analyze```

  This will run Plato code analysis on the files in the ```/backend``` folder. The results will be saved in ```/documents/analysis```.

  ```npm run docs```

  This will generate JSDOC documentation for the files in ```/backend```. The results will be saved in ```/documents/documentation```.

  ```npm run test```

  This will run the test cases found in the ```/test``` folder as well as generate a code coverage report in ```/documents/coverage```.


#### To Run Dev Server

  ```npm run dev-server```

  This will start the server in development mode using nodejs-dashboard + nodemon.

  ```npm run nodemon```

  This will start the server in development mode using nodemon.


#### Build Commands

  ```npm run build```

  This will run webpack in production mode to build CSS and JS. Which will optimize and minified the JS and CSS.


#### MAKE

  If you have MAKE installed you can use the following Make commands.

  * make (runs test lint_error analyze docs assets complete)
  * make dev (runs test analyze docs lint)
  * make test
  * make test_watch
  * make analyze
  * make lint_error
  * make lint
  * make docs
  * make assets
  * make help


### License

  Express.js Boilerplate is licensed under the DBAD license.

  Copyright (c) 2017 Bryan Kizer

   Everyone is permitted to copy and distribute verbatim or modified
   copies of this license document.

  > DON'T BE A DICK PUBLIC LICENSE
  > TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

   1. Do whatever you like with the original work, just don't be a dick.

       Being a dick includes - but is not limited to - the following instances:

     1a. Outright copyright infringement - Don't just copy this and change the name.  
     1b. Selling the unmodified original with no work done what-so-ever, that's REALLY being a dick.  
     1c. Modifying the original work to contain hidden harmful content. That would make you a PROPER dick.  

   2. If you become rich through modifications, related works/services, or supporting the original work,
   share the love. Only a dick would make loads off this work and not buy the original work's
   creator(s) a pint.

   3. Code is provided with no warranty. Using somebody else's code and bitching when it goes wrong makes
   you a DONKEY dick. Fix the problem yourself. A non-dick would submit the fix back.
