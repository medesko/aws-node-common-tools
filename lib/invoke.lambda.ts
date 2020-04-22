import * as AWS from 'aws-sdk';
export const invoke = async (lambdaName, config) => {

  const lambda: any = new AWS.Lambda({ region: config.region, apiVersion: '2015-03-31' });

  const requestContext = config.clientId ? { authorizer: { claims: {client_id: config.clientId }}} : {}

  const params: any =  {
    FunctionName: `${lambdaName}`,
    Payload: JSON.stringify({ body: config, requestContext}),
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
  }

  return new Promise((resolve, reject) => {
      lambda.invoke(params, (err, data) => {
          if (err) {
              console.log(err, err.stack);
              reject(err);
          }
          else {
              console.log(data);
              resolve(data);
          }
      });     
  });

  // try {

  //   const result: any = await lambda.invoke(params).promise();
  //   const parsed: any = JSON.parse(result.Payload);
  //   const body: any = JSON.parse(parsed.body);
  //   console.log('IIIII', body);
    
  //   return body.data.getZipdata;

  // } catch (err) {
  //   return err;
  // }
}
