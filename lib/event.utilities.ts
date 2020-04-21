import {APIGatewayEvent} from "aws-lambda";
import { get } from 'lodash';
import { log } from './log.utilities';

export const processEvent = (event: any) => {
	const { body, pathParameters, queryStringParameters, requestContext } = event;
	const { httpMethod, resourceId, resourcePath, requestId } = requestContext;
	// The following works for offline mode as well as real
	// lambda-proxy with cognito user pool authorization
	// if the 'cognito:username' is set in a JWT-encoded Authorization token
	const userId = get(requestContext, 'authorizer.claims.cognito:username');
	const email = get(requestContext, 'authorizer.claims.email');
	const clientId = get(requestContext, 'authorizer.claims.client_id');
	log.debug(
		{ resourceId, resourcePath, requestId, httpMethod, userId },
		'Request received'
	);

	return {
		body: typeof body === 'string' ? JSON.parse(body) : body,
		queryStringParameters,
		pathParameters,
		userId,
		email,
		clientId
	};
};
