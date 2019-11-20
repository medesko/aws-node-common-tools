"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../lib/log");
describe('log function test', async () => {
    it('log at debug level', async () => {
        process.env.DEBUG = 'true';
        delete require.cache[log_1.log];
        log_1.log.debug('debug test');
    });
    it('log at info level', async () => {
        delete process.env.DEBUG;
        delete require.cache[log_1.log];
        log_1.log.debug('info test');
    });
});
//# sourceMappingURL=log.spec.js.map