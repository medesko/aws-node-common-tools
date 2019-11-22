const awsXray = require('aws-xray-sdk');
const AWS = require('aws-sdk');
const cwEvents = awsXray.captureAWSClient(
	new AWS.CloudWatchEvents({ endpoint: process.env.EVENTS_ENDPOINT_URL })
);

const { name: serviceName } = require('./service-info');

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

	console.log(cwEvents);

	await cwEvents.putEvents(params).promise();
};
