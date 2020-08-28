import { log } from '../lib/log.utilities';
describe('log function test', async () => {
  it('log at debug level', async () => {
    process.env.DEBUG = 'true';
    delete require.cache[require.resolve('../lib/log.utilities')];
    log.debug('debug test');
  });

  it('log at info level', async () => {
    delete process.env.DEBUG;
    delete require.cache[require.resolve('../lib/log.utilities')];
    log.info('info test');
  });
});
