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
        log_1.log.info('info test');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2xvZy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQWlDO0FBQ2pDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLElBQUksRUFBRTtJQUN4QyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQzNCLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFHLENBQUMsQ0FBQztRQUMxQixTQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1CQUFtQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2xDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFDekIsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQUcsQ0FBQyxDQUFDO1FBQzFCLFNBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGxvZyB9IGZyb20gJy4uL2xpYi9sb2cnO1xuZGVzY3JpYmUoJ2xvZyBmdW5jdGlvbiB0ZXN0JywgYXN5bmMgKCkgPT4ge1xuXHRpdCgnbG9nIGF0IGRlYnVnIGxldmVsJywgYXN5bmMgKCkgPT4ge1xuXHRcdHByb2Nlc3MuZW52LkRFQlVHID0gJ3RydWUnO1xuXHRcdGRlbGV0ZSByZXF1aXJlLmNhY2hlW2xvZ107XG5cdFx0bG9nLmRlYnVnKCdkZWJ1ZyB0ZXN0Jyk7XG5cdH0pO1xuXG5cdGl0KCdsb2cgYXQgaW5mbyBsZXZlbCcsIGFzeW5jICgpID0+IHtcblx0XHRkZWxldGUgcHJvY2Vzcy5lbnYuREVCVUc7XG5cdFx0ZGVsZXRlIHJlcXVpcmUuY2FjaGVbbG9nXTtcblx0XHRsb2cuaW5mbygnaW5mbyB0ZXN0Jyk7XG5cdH0pO1xufSk7XG4iXX0=