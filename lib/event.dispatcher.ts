import * as path from 'path';
import * as awsXray from 'aws-xray-sdk';
import * as AWS from 'aws-sdk';
const cwEvents = awsXray.captureAWSClient(
  new AWS.CloudWatchEvents({ endpoint: process.env.EVENTS_ENDPOINT_URL }),
);

const { name } = require(path.join(process.cwd(), 'package.json'));

export const dispatchEvent = async (type: any, detail: any) => {
  const params = {
    Entries: [
      {
        Detail: JSON.stringify(detail),
        DetailType: type,
        Source: name,
      },
    ],
  };

  await cwEvents.putEvents(params).promise();
};
