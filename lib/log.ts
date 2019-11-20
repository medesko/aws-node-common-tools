const pino = require('pino');

import { name } from './service-info';

export const log = pino({
	name,
	level:
		process.env.DEBUG ||
		process.env.IS_OFFLINE ||
		process.env.SLS_STAGE === 'develop'
			? 'debug'
			: 'info'
});
