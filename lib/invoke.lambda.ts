import * as AWS from 'aws-sdk';
export const invoke = async (
  { functionName, payload, config },
  invocationType = 'RequestResponse',
) => {
  config.apiVersion ? config.apiVersion : '2015-03-31';

  const params = {
    FunctionName: `${functionName}`,
    Payload: JSON.stringify(payload),
    InvocationType: invocationType,
    LogType: 'Tail',
  };

  try {
    const result: any = await new AWS.Lambda(config).invoke(params).promise();
    const parsed: any = JSON.parse(result.Payload);
    const body: any = JSON.parse(parsed.body);
    return body;
  } catch (err) {
    return err;
  }
};
