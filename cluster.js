// http://dealwithjs.io/scaling-clustering-in-node-js/

const cluster = require('cluster');

if(cluster.isMaster) {
  let workers = process.env.WORKERS || require('os').cpus().length;

  console.log(`Master cluster setting up ${ workers } workers...`);

  for(var i = 0; i < workers; i++) {
    cluster.fork();
  }

  // If you need some start up routine for each worker.
  // cluster.on('online', worker => {
  //
  // });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${ worker.process.pid } died with code: ${ code }, and signal: ${ signal }`);
    console.log('Starting a new worker');
    cluster.fork();
  });
}
else {
  require('./server');
}
