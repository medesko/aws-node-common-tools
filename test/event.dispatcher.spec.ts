import * as path from 'path';
// import { expect } from 'chai';
import awsMock = require('aws-sdk-mock');
// import * as eventDispatcher from '../lib/event.dispatcher';
awsMock.setSDK(path.resolve('./node_modules/aws-sdk'));

const received: { cwEvents: any } = { cwEvents: {} };

awsMock.mock('CloudWatchEvents', 'putEvents', (params: any, callback: any) => {
  received.cwEvents.putEvents = params;
  callback(null, { ...params });
});

// it('dispatchEvent dispatches a CloudWatch custom event', async () => {
// 	const type = 'LIST_CREATED_EVENT';
// 	const testList = {
// 		name: 'Test List',
// 		userId: 'user123'
// 	};

// 	await eventDispatcher.dispatchEvent(type, testList);

// 	const cwEntries = received.cwEvents.putEvents.Entries;
// 	expect(cwEntries[0]).ok;
// 	expect(JSON.parse(cwEntries[0].Detail)).to.deep.equal(testList);
// 	expect(cwEntries[0].DetailType).to.equal('LIST_CREATED_EVENT');
// 	expect(cwEntries[0].Source).to.equal('sls-common-tools');
// });
