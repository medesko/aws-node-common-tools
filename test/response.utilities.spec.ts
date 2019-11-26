import { expect } from 'chai';
import { createResponse } from '../lib/response.utilities';

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
		const result = await createResponse(failedPromise);

		expect(result.statusCode).to.equal(500);
		const parsedBody = JSON.parse(result.body);
		expect(parsedBody).to.deep.equal({ ok: false });
		expect(result.headers).ok;
	});

	testInputs.forEach(({ options, response, expectedCode, expectedBody }) => {
		it(`create response returns a success code when a promise resolves with ${JSON.stringify(
			response
		)} and options is ${JSON.stringify(options)}`, async () => {
			const successPromise = Promise.resolve(response);
			const result = await createResponse(successPromise, options);

			expect(result.statusCode).to.equal(expectedCode);
			const parsedBody = JSON.parse(result.body);
			expect(parsedBody).to.deep.equal(expectedBody);
			expect(result.headers).ok;
		});
	});
});
