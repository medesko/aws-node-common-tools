const middy = require('middy');
const {
  cors,
  jsonBodyParser,
  httpEventNormalizer,
  httpErrorHandler,
  ssm,
} = require('middy/middlewares');

const loggerMiddleware = require('lambda-logger-middleware');

import { autoProxyResponse } from './middlewares/auto-proxy-response';
import { log } from './log.utilities';

export const middify = (exports: any, options: any = {}) => {
  const result: any = {};
  Object.keys(exports).forEach(key => {
    const handler = middy(exports[key])
      .use(
        loggerMiddleware({
          logger: log,
        }),
      )
      .use(httpEventNormalizer())
      .use(jsonBodyParser())
      .use(cors())
      .use(autoProxyResponse())
      .use(httpErrorHandler());

    if (options.ssmParameters && process.env.STAGE !== 'test') {
      handler.use(
        ssm({
          cache: true,
          names: options.ssmParameters,
          awsSdkOptions: {
            endpoint: process.env.SSM_ENDPOINT_URL,
          },
        }),
      );
    }
    result[key] = handler;
  });
  return result;
};
