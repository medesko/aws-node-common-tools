import * as axios from 'axios';
import * as qs from 'querystring';
import { log } from './log.utilities';
import { NewRandomUuid } from './uuid.utilities';
import * as time from './time.utilities';

export interface InseeConfig {
  enabled: boolean;
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  apiTokens: string[];
  verbose: boolean;
  debug: boolean;
}

const REQUEST_ID_HEADER = 'x-request-id',
  AUTHORIZATION_HEADER = 'Authorization',
  MIN_REQUEST_AGAIN_TIMEOUT = 60000,
  MAX_REQUEST_AGAIN_TIMEOUT = 120000;

export class Insee {
  public config: InseeConfig;
  private instance: axios.AxiosInstance;
  private apiToken: string;
  private interval?: NodeJS.Timeout;

  constructor(config: InseeConfig) {
    this.instance = axios.default.create({ baseURL: config.apiUrl });
    this.apiToken = config.apiTokens[Math.floor(Math.random() * config.apiTokens.length)];
    this.config = config;
  }

  public Start(): Promise<void> {
    const uuid = NewRandomUuid();
    let promise: Promise<string>;

    if (Array.isArray(this.config.apiTokens) && this.config.apiTokens.length > 0)
      promise = this.refreshAccessToken(uuid);
    else promise = Promise.resolve('');

    return promise
      .then(() => {
        [1, 2, 3, 4].forEach(() => {
          this.interval = setInterval(() => {
            this.refreshAccessToken(uuid)
              .then((token: string) => {
                this.config.apiTokens.push(token);
              })
              .catch((err: any) => {
                if (err.response != undefined)
                  log.debug(
                    `[${uuid}] refreshAccessToken failed with status ${
                      err.response.status
                    }: ${JSON.stringify(err.response.data)}`,
                  );
              });
          }, 86400000);
        });
      })
      .catch((err: any) => {
        throw err;
      });
  }

  private refreshAccessToken(uuid: string): Promise<string> {
    return this.generateAccessToken(uuid)
      .then((token: string) => {
        this.apiToken = token;
        return token;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public search(uuid: string, search: string, limit: number) {
    let termsClean = searchCleaner(search);
    let queryBlockExtend = ' AND etatAdministratifUniteLegale:"A" AND etablissementSiege:"true"';

    const postalCodeMatch = (' ' + termsClean + ' ').match(/\s([0-9]{5})\s/);
    if (postalCodeMatch !== null) {
      const postalCode = postalCodeMatch[1];
      queryBlockExtend += ` AND codePostalEtablissement:"${postalCode}"`;
      termsClean = termsClean.replace(postalCode, '');
    }

    const words = termsClean.split(' ').filter(word => {
      return word.length >= 2;
    });
    const queryBlock = [`(denominationUniteLegale:"${termsClean}"${queryBlockExtend})`];
    const wordsLength = Math.min(words.length, 4);
    if (wordsLength >= 2) {
      for (let i = 0; i < wordsLength; i++) {
        for (let j = 0; j < Math.min(wordsLength, 4); j++) {
          if (i === j) {
            continue;
          }
          queryBlock.push(
            `(nomUniteLegale:"${words[i]}" AND prenomUsuelUniteLegale:"${words[j]}"${queryBlockExtend})`,
          );
        }
      }
    } else if (wordsLength === 1) {
      queryBlock.push(
        `((nomUniteLegale:"${termsClean}" OR prenomUsuelUniteLegale:"${termsClean}")${queryBlockExtend})`,
      );
    } else {
      return [];
    }
    const sirenSiretMatch = termsClean.match(/([0-9]{9}|[0-9]{14})/);
    if (sirenSiretMatch !== null) {
      const siren = sirenSiretMatch[1].substr(0, 9);
      queryBlock.push(
        `(siren:${siren} AND etatAdministratifUniteLegale:"A" AND etablissementSiege:"true")`,
      );
    }

    return this.get(uuid, '/entreprises/sirene/V3/siret', {
      params: {
        q: queryBlock.join(' OR '),
        champs: [
          'siren',
          'siret',
          'denominationUniteLegale',
          'sexeUniteLegale',
          'nomUniteLegale',
          'prenomUsuelUniteLegale',
          'codePostalEtablissement',
          'libelleCommuneEtablissement',
          'libellePaysEtrangerEtablissement',
        ].join(','),
        nombre: '' + limit,
      },
    })
      .then((resp: axios.AxiosResponse) => {
        if (resp.status !== 200) throw resp;
        return resp.data.etablissements.map((etablissement: any) => {
          return {
            name: <string>(
              (etablissement.uniteLegale.denominationUniteLegale ||
                (etablissement.uniteLegale.sexeUniteLegale === 'M' ? 'MONSIEUR' : 'MADAME') +
                  ' ' +
                  etablissement.uniteLegale.nomUniteLegale +
                  ' ' +
                  etablissement.uniteLegale.prenomUsuelUniteLegale)
            ),
            location: <string>(
              (
                (etablissement.adresseEtablissement.codePostalEtablissement || '') +
                ' ' +
                (etablissement.adresseEtablissement.libelleCommuneEtablissement || '') +
                ' ' +
                (etablissement.adresseEtablissement.libellePaysEtrangerEtablissement || '')
              ).trim()
            ),
            siren: '' + etablissement.siren,
          };
        });
      })
      .catch((err: any) => {
        throw err;
      });
  }

  private request(uuid: string, config: axios.AxiosRequestConfig, auth = true): axios.AxiosPromise {
    if (config.headers == undefined) config.headers = {};

    config.headers[REQUEST_ID_HEADER] = uuid;

    if (auth) config.headers[AUTHORIZATION_HEADER] = `Bearer ${this.apiToken}`;

    const start = process.hrtime();
    let url = `${this.config.apiUrl}${config.url}`;

    if (config.params != undefined) url += `?${qs.stringify(config.params)}`;

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
          if (err.response.status == 429 || err.response.status == 401) {
            const timeout = randomMinMax(MIN_REQUEST_AGAIN_TIMEOUT, MAX_REQUEST_AGAIN_TIMEOUT);

            log.debug(
              `[${uuid}] INSEE request to ${url} exceeded the API's limit. Retry in ${
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

  private generateAccessToken(uuid: string): Promise<string> {
    return this.post(
      uuid,
      '/token',
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
        if (resp.status != 200) throw resp;

        return resp.data.access_token;
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

  private getTodayDate(): string {
    const today = new Date();
    let month = (today.getUTCMonth() + 1).toString();
    let day = today.getUTCDate().toString();

    if (month.length == 1) month = `0${month}`;
    if (day.length == 1) day = `0${day}`;

    return `${today.getUTCFullYear()}-${month}-${day}`;
  }
}

function randomMinMax(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

function searchCleaner(name: string) {
  return name
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\'\"]/g, ' ')
    .replace(/[^ a-z0-9\-]/gi, '')
    .toUpperCase();
}
