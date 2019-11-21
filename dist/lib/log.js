"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pino = require('pino');
const service_info_1 = require("./service-info");
exports.log = pino({
    name: service_info_1.name,
    level: process.env.DEBUG ||
        process.env.IS_OFFLINE ||
        process.env.SLS_STAGE === 'develop'
        ? 'debug'
        : 'info'
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU3QixpREFBc0M7QUFFekIsUUFBQSxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLElBQUksRUFBSixtQkFBSTtJQUNKLEtBQUssRUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxLQUFLLFNBQVM7UUFDbEMsQ0FBQyxDQUFDLE9BQU87UUFDVCxDQUFDLENBQUMsTUFBTTtDQUNWLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBpbm8gPSByZXF1aXJlKCdwaW5vJyk7XG5cbmltcG9ydCB7IG5hbWUgfSBmcm9tICcuL3NlcnZpY2UtaW5mbyc7XG5cbmV4cG9ydCBjb25zdCBsb2cgPSBwaW5vKHtcblx0bmFtZSxcblx0bGV2ZWw6XG5cdFx0cHJvY2Vzcy5lbnYuREVCVUcgfHxcblx0XHRwcm9jZXNzLmVudi5JU19PRkZMSU5FIHx8XG5cdFx0cHJvY2Vzcy5lbnYuU0xTX1NUQUdFID09PSAnZGV2ZWxvcCdcblx0XHRcdD8gJ2RlYnVnJ1xuXHRcdFx0OiAnaW5mbydcbn0pO1xuIl19