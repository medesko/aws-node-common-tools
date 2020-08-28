import * as path from 'path';
import pino = require('pino');
const { name } = require(path.join(process.cwd(), 'package.json'));

export const log = pino({
  name,
  level:
    process.env.DEBUG || process.env.IS_OFFLINE || process.env.STAGE === 'develop'
      ? 'debug'
      : 'info',
});
