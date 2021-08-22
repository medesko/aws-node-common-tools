import * as path from 'path';
import * as pino from 'pino';

export const log = pino({
  name: 'application',
  level:
    process.env.DEBUG || process.env.IS_OFFLINE || process.env.STAGE === 'develop'
      ? 'debug'
      : 'info',
});
