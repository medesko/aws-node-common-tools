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
//# sourceMappingURL=log.js.map