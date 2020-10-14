import { log } from './log.utilities';
import * as awsXray from 'aws-xray-sdk';
import * as AWS from 'aws-sdk';

const eventbridge = awsXray.captureAWSClient(new AWS.EventBridge());
export const sendToEventBridge = async (bridgeName: string, event: any, source: string) => {
  const { id, type } = event;

  log.info(`Sending event ${id} of type ${type} to the ${bridgeName} event bus on AWS EventBridge`);

  const params = {
    Entries: [
      {
        Detail: JSON.stringify(event),
        DetailType: type,
        EventBusName: 'default', //bridgeName,
        Resources: [],
        Source: source,
        Time: new Date(),
      },
    ],
  };
};
