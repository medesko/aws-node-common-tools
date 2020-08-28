import * as qs from 'querystring';

import * as axios from 'axios';

import { log } from './log.utilities';
import { NewRandomUuid } from './uuid.utilities';
import * as time from './time.utilities';

export interface SlsOauthConfig {
  enabled: boolean;
  url: string;
  accessToken?: string;
  refreshToken?: string;
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
  verbose: boolean;
  debug: boolean;
}

const REQUEST_ID_HEADER = 'x-request-id',
  AUTHORIZATION_HEADER = 'Authorization',
  MIN_REQUEST_AGAIN_TIMEOUT = 60000,
  MAX_REQUEST_AGAIN_TIMEOUT = 120000,
  FIRST_REFRESH_TIMEOUT = 3000000,
  REFRESH_INTERVAL = 3600000;

let slsOauth: SlsOauth;

export function InitSlsOauth(config: SlsOauthConfig): Promise<SlsOauth> {
  slsOauth = new SlsOauth(config);

  return slsOauth
    .Start()
    .then(() => {
      return slsOauth;
    })
    .catch((err: any) => {
      throw err;
    });
}

export function GetSlsOauth(): SlsOauth | null {
  return slsOauth;
}

export class SlsOauth {
  public config: SlsOauthConfig;
  private instance: axios.AxiosInstance;
  private accessToken: string;
  private interval?: NodeJS.Timeout;

  constructor(config: SlsOauthConfig) {
    this.instance = axios.default.create({ baseURL: config.url });
    this.accessToken = config.accessToken || '';
    this.config = config;
  }

  public Start(): Promise<void> {
    const uuid = NewRandomUuid();
    let promise: Promise<void>;

    if (this.config.accessToken === undefined || this.config.accessToken === '')
      promise = this.refreshAccessToken(uuid);
    else promise = Promise.resolve();

    return promise
      .then(() => {
        this.interval = setInterval(() => {
          this.refreshAccessToken(uuid)
            .then(() => {
              this.interval = setInterval(() => {
                this.refreshAccessToken(uuid);
              }, REFRESH_INTERVAL);
            })
            .catch((err: any) => {
              if (err.response !== undefined)
                log.error(
                  `[${uuid}] refreshAccessToken failed with status ${
                    err.response.status
                  }: ${JSON.stringify(err.response.data)}`,
                );
            });
        }, FIRST_REFRESH_TIMEOUT);
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public Stop(): void {
    if (this.interval !== undefined) clearInterval(this.interval);
  }

  protected buildHeaders(): { Authorization: string } {
    return {
      Authorization: `Basic ${this.accessToken}`,
    };
  }

  private refreshAccessToken(uuid: string): Promise<void> {
    return this.generateAccessToken(uuid)
      .then((token: string) => {
        this.accessToken = token;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  private generateAccessToken(uuid: string): Promise<string> {
    return this.post(
      uuid,
      '/oauth2/token',
      {
        data: qs.stringify({
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      false,
    )
      .then((resp: axios.AxiosResponse) => {
        if (resp.status !== 200) throw resp;

        return resp.data.access_token;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  private request(uuid: string, config: axios.AxiosRequestConfig, auth = true): axios.AxiosPromise {
    if (config.headers === undefined) config.headers = {};

    config.headers[REQUEST_ID_HEADER] = uuid;

    if (auth) config.headers[AUTHORIZATION_HEADER] = `Bearer ${this.accessToken}`;

    const start = process.hrtime();
    let url = `${this.config.url}${config.url}`;

    if (config.params !== undefined) url += `?${qs.stringify(config.params)}`;

    if (this.config.verbose) log.debug(`[${uuid}] ${config.method} ${url}`);
    else if (this.config.debug)
      log.debug(
        `[${uuid}] ${config.method} ${url} ${
          config.data == undefined ? '' : JSON.stringify(config.data)
        }`,
      );

    return this.instance
      .request(config)
      .then((resp: axios.AxiosResponse) => {
        const duration = time.prettySince(start);
        const str = `[${uuid}] ${resp.request.method} ${url} [${resp.status}]`;

        if (this.config.verbose) log.debug(`${str} (${duration})`);
        else if (this.config.debug)
          log.debug(
            `${str} ${resp.data == undefined ? '' : JSON.stringify(resp.data)} (${duration})`,
          );

        return resp;
      })
      .catch((err: any) => {
        if (err.response != undefined) {
          if (err.response.status === 429 || err.response.status === 401) {
            const timeout = randomMinMax(MIN_REQUEST_AGAIN_TIMEOUT, MAX_REQUEST_AGAIN_TIMEOUT);

            log.warn(
              `[${uuid}] Oauth request to ${url} exceeded the API's limit. Retry in ${
                timeout / 1000
              } seconds...`,
            );

            return this.requestAgainIn(uuid, config, timeout);
          }
        }

        throw err;
      });
  }

  private requestAgainIn(
    uuid: string,
    config: axios.AxiosRequestConfig,
    timeout: number,
  ): axios.AxiosPromise {
    return new Promise<axios.AxiosPromise>(resolve => {
      setTimeout(() => {
        resolve();
      }, timeout);
    })
      .then(() => {
        return this.request(uuid, config);
      })
      .catch((err: any) => {
        throw err;
      });
  }

  private get(
    uuid: string,
    url: string,
    config: axios.AxiosRequestConfig = {},
    auth = true,
  ): axios.AxiosPromise {
    config.url = url;
    config.method = 'GET';

    return this.request(uuid, config, auth);
  }

  private post(
    uuid: string,
    url: string,
    config: axios.AxiosRequestConfig = {},
    auth = true,
  ): axios.AxiosPromise {
    config.url = url;
    config.method = 'POST';

    return this.request(uuid, config, auth);
  }
}

function randomMinMax(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}
