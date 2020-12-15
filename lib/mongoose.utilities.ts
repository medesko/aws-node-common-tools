import { Mongoose, ConnectionOptions, connect } from 'mongoose';
import { log } from './log.utilities';
class Options {
  static get mongoose() {
    return {
      autoIndex: true, // Don't build indexes
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0, //  MongoDB driver buffering
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      keepAlive: true,
      useFindAndModify: false,
    };
  }
}

let isConnected = false;
export const connectTodb = (url: string) => {
  log.info('Start connecting db...');

  const options: ConnectionOptions = Options.mongoose;

  if (isConnected) {
    log.info('Using from cached database instance');
    return Promise.resolve();
  }

  const dbUri: string = process.env.MONGO_URL || url;

  return connect(dbUri, options)
    .then((db: Mongoose) => {
      isConnected = db.connection.readyState === 1; // 1 for connected
    })
    .catch(error => {
      log.info('db error:' + error);
      return Promise.reject(error);
    });
};
