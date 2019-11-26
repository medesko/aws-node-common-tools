import * as path from 'path';
const awsXray = require('aws-xray-sdk');
const AWS = require('aws-sdk');
const cwEvents = awsXray.captureAWSClient(
	new AWS.CloudWatchEvents({ endpoint: process.env.EVENTS_ENDPOINT_URL })
);

const { name: serviceName } = require(path.join(process.cwd(), 'package.json'));

export const dispatchEvent = async (type: any, detail: any) => {
	const params = {
		Entries: [
			{
				Detail: JSON.stringify(detail),
				DetailType: type,
				Source: serviceName
			}
		]
	};

	await cwEvents.putEvents(params).promise();
};
