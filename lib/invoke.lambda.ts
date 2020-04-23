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
    lambda.invoke({
      FunctionName: `${lambdaName}`,
      Payload: JSON.stringify({
        body: params,
        requestContext,
      }),
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
    }, (error, data) => {
      if (error) {
        return reject(error)
      }
      if (data.Payload) {
        if (+JSON.parse(data.Payload).statusCode >= 400) {
          return reject(JSON.parse(data.Payload))
        }
        const response = JSON.parse(data.Payload)

        return resolve(response)
      }
    })
  })
}