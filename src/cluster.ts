/* eslint-disable no-console */
import * as cluster from 'cluster';
import { cpus } from 'os';

const numCPUs = cpus().length;

export function startAsClusterMode(bootstrap: () => void): void {
  if (cluster.isMaster) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      if (signal) {
        console.log(`worker was killed by signal: ${signal}`);
      } else if (code !== 0) {
        console.log(`worker exited with error code: ${code}`);
      } else {
        console.log(`worker ${worker.process.pid} died`);
      }

      // restart worker
      console.log(`tring to restart worker process ${worker.process.pid}`);
      const newWorker = cluster.fork();
      console.log(
        `Worker ${worker.process.pid} started, new worker ${newWorker.process.pid}`,
      );
    });
  } else {
    // Workers can share any TCP connection
    bootstrap();
    console.log(`Worker ${process.pid} started`);
  }
}
