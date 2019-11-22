import { expect } from 'chai';
const UUID = require('uuid/v5');
import { processEvent } from '../lib/event-util';

describe('Service response test', async () => {
	it('userId is extracted from the cognito lambda-proxy-mapped authorizer claims', async () => {
		const testUserId = UUID;
		const event = {
			requestContext: {
				authorizer: {
					claims: {
						'cognito:username': testUserId
					}
				}
			}
		};

		const { userId } = processEvent(event);
		expect(userId).to.equal(testUserId);
	});

	it('body is parsed from the JSON body', async () => {
		const testUserId = UUID;
		const testBody = { a: 1, b: 2 };
		const event = {
			body: JSON.stringify(testBody),
			requestContext: {
				authorizer: {
					claims: {
						'cognito:username': testUserId
					}
				}
			}
		};

		const { body, userId } = processEvent(event);
		expect(userId).to.equal(testUserId);
		expect(body).to.deep.equal(testBody);
	});
});
