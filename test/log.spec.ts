import { log } from '../lib/log';
describe('log function test', async () => {
	it('log at debug level', async () => {
		process.env.DEBUG = 'true';
		delete require.cache[log];
		log.debug('debug test');
	});

	it('log at info level', async () => {
		delete process.env.DEBUG;
		delete require.cache[log];
		log.info('info test');
	});
});
