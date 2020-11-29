import { get } from 'lodash';
import { log } from './log.utilities';

export const processEvent = (event: any) => {
  const { body, pathParameters, queryStringParameters, requestContext } = event;
  const { httpMethod, resourceId, resourcePath, requestId } = requestContext;
  // The following works for offline mode as well as real
  // lambda-proxy with cognito user pool authorization
  // if the 'cognito:username' is set in a JWT-encoded Authorization token
  log.debug(get(requestContext, 'authorizer.claims'));

  const userId =
    get(requestContext, 'authorizer.claims.cognito:username') ||
    get(requestContext, 'authorizer.claims.sub');
  const email = get(requestContext, 'authorizer.claims.email');
  const clientId = get(requestContext, 'authorizer.claims.client_id');
  const isConfirmed = get(requestContext, 'authorizer.claims.scopeIsConfirmed');
  const scopeRoles = get(requestContext, 'authorizer.claims.scopeRoles');

  log.debug(
    {
      resourceId,
      resourcePath,
      requestId,
      httpMethod,
      userId,
      email,
      clientId,
      isConfirmed,
      scopeRoles,
    },
    'Request received',
  );

  return {
    body: typeof body === 'string' ? JSON.parse(body) : body,
    queryStringParameters,
    pathParameters,
    userId,
    email,
    clientId,
    isConfirmed,
    scopeRoles,
  };
};
