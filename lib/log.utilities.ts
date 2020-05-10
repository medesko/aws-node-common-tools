import * as path from 'path';
const pino = require('pino');
const { name: serviceName } = require(path.join(process.cwd(), 'package.json'));

export const log = pino({
	prettyPrint: { colorize: true },
	serviceName,
	level:
		process.env.DEBUG ||
		process.env.IS_OFFLINE ||
		process.env.STAGE === 'develop'
			? 'debug'
			: 'info'
});
