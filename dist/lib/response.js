"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./log");
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
};
exports.createResponse = async (promise, options) => {
    const successCode = (options && options.successCode) || 200;
    try {
        const result = await promise;
        log_1.log.info({ result }, 'Result received');
        return {
            statusCode: successCode,
            body: JSON.stringify(result || {}),
            headers
        };
    }
    catch (err) {
        log_1.log.error({ err }, 'Request implementation failed');
        return {
            statusCode: 500,
            body: JSON.stringify({ ok: false }),
            headers
        };
    }
};
//# sourceMappingURL=response.js.map