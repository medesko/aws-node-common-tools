"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const response_1 = require("../lib/response");
const testInputs = [
    {
        options: {},
        response: { name: 'yes' },
        expectedCode: 200,
        expectedBody: { name: 'yes' }
    },
    {
        options: { successCode: 201 },
        expectedCode: 201,
        expectedBody: {}
    },
    {
        response: { name: 'yes' },
        expectedCode: 200,
        expectedBody: { name: 'yes' }
    }
];
describe('Service response test', async () => {
    it('create response returns an error code when a promise reject', async () => {
        const failedPromise = Promise.reject(new Error('Promise Rejected'));
        const result = await response_1.createResponse(failedPromise);
        chai_1.expect(result.statusCode).to.equal(500);
        const parsedBody = JSON.parse(result.body);
        chai_1.expect(parsedBody).to.deep.equal({ ok: false });
        chai_1.expect(result.headers).ok;
    });
    testInputs.forEach(({ options, response, expectedCode, expectedBody }) => {
        it(`create response returns a success code when a promise resolves with ${JSON.stringify(response)} and options is ${JSON.stringify(options)}`, async () => {
            const successPromise = Promise.resolve(response);
            const result = await response_1.createResponse(successPromise, options);
            chai_1.expect(result.statusCode).to.equal(expectedCode);
            const parsedBody = JSON.parse(result.body);
            chai_1.expect(parsedBody).to.deep.equal(expectedBody);
            chai_1.expect(result.headers).ok;
        });
    });
});
//# sourceMappingURL=response.spec.js.map