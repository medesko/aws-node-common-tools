import * as path from 'path';
const pino = require('pino');
const { name: serviceName } = require(path.join(process.cwd(), 'package.json'));

export const log = pino({
	serviceName,
	level:
		process.env.DEBUG ||
		process.env.IS_OFFLINE ||
		process.env.SLS_STAGE === 'develop'
			? 'debug'
			: 'info'
});
