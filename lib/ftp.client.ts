const Client = require('ftp');
import { log } from './log.utilities';

export interface FtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  connTimeout?: number;
}

class FtpClient {

  private config: FtpConfig;
  private client;

  configure(config: string) {
      try {
          this.config = this.getValidatedConfig(config);
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
        password: ''
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
        this.client.on('error', (error) => {
            log.debug(error);
            reject(error);
        });
        this.client.connect(this.config);
    });
  }
}