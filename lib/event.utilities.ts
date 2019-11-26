import { get } from 'lodash';
import { log } from './log.utilities';

export const processEvent = (event: any) => {
	const { body, pathParameters, queryStringParameters, requestContext } = event;
	const { httpMethod, resourceId, resourcePath, requestId } = requestContext;
	// The following works for offline mode as well as real
	// lambda-proxy with cognito user pool authorization
	// if the 'cognito:username' is set in a JWT-encoded Authorization token
	const userId = get(requestContext, 'authorizer.claims.cognito:username');
	log.debug(
		{ resourceId, resourcePath, requestId, httpMethod, userId },
		'Request received'
	);

	return {
		body: typeof body === 'string' ? JSON.parse(body) : body,
		queryStringParameters,
		pathParameters,
		userId
	};
};
