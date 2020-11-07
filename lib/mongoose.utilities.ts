import { Mongoose, ConnectionOptions, connect } from 'mongoose';
class Options {
  static get mongoose() {
    return {
      autoIndex: true, // Don't build indexes
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      keepAlive: true,
    };
  }
}

let isConnected = false;
export const connectTodb = (url: string) => {
  console.log('Start connecting db...');

  const options: ConnectionOptions = Options.mongoose;

  if (isConnected) {
    return Promise.resolve();
  }

  const dbUri: string = process.env.MONGO_URL || url;

  return connect(dbUri, options)
    .then((db: Mongoose) => {
      isConnected = db.connection.readyState === 1; // 1 for connected
    })
    .catch(error => {
      console.log('db error:', error);
      return Promise.reject(error);
    });
};
