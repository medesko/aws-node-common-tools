const Client = require('ftp');
import { log } from './log.utilities';

// {
//   "host": "18x.xxx.xxx.xx",
//   "port": 21,
//   "user": "*********",
//   "password": "********"
// }

export interface FtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  connTimeout?: number;
}

export interface FtpFileDesc {
  name: string;
  type: string;
  size: number;
  date: Date;
}

class FtpClient {
  private config: FtpConfig = {
    host: '',
    port: 21,
    user: '',
    password: '',
  };
  private client;

  configure(jsonConfig: string) {
    try {
      this.config = this.getValidatedConfig(jsonConfig);
      this.config.connTimeout = 300;
    } catch (e) {
      log.debug(e);
      throw Error('FTP Configuration is not valid');
    }
  }

  private getValidatedConfig(config: string): FtpConfig {
    const json = JSON.parse(config);
    const configPrototype: FtpConfig = {
      host: '',
      port: 0,
      user: '',
      password: '',
    };
    for (const key of Object.keys(configPrototype)) {
      if (!json.hasOwnProperty(key)) {
        throw new Error(`JSON Body does not have required property: ${key}`);
      }
    }
    return json;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new Client();
      this.client.on('ready', () => {
        log.debug('FTP Connection successful');
        resolve();
      });
      this.client.on('error', error => {
        log.debug(error);
        reject(error);
      });
      this.client.connect(this.config);
    });
  }

  list(path: string): Promise<FtpFileDesc[]> {
    return new Promise((resolve, reject) => {
      this.client.list(path, (error, list) => {
        if (error) {
          reject(error);
        } else {
          resolve(list);
        }
      });
    });
  }

  get(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.get(path, (error, stream) => {
        if (error) {
          reject(error);
        } else {
          let file = '';
          stream.on('data', chunk => {
            file += chunk;
          });
          stream.on('end', () => {
            resolve(file);
          });
          stream.on('error', error => {
            reject(error);
          });
        }
      });
    });
  }

  delete(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.delete(path, error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  disconnect() {
    this.client.end();
  }
}

export { FtpClient };
