import { RawRequest, Request } from './request';
import { Response } from './response';
import { NewRandomUuid } from '../uuid.utilities';

enum Method {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE'
}

export interface HeadersLimitations {
	Limit: any;
	Remaining: any;
	Reset: any;
}

export interface Requester {
	Request(req: Request): Promise<Response>;
}

export class Client {
	public rates: HeadersLimitations;
	private requester: Requester;
	private url: string;
	private onRequest?: (req: Request) => void;
	private onResponse?: (resp: Response) => void;

	constructor(
		requester: Requester,
		url: string,
		onRequest?: (req: Request) => void,
		onResponse?: (resp: Response) => void
	) {
		this.rates = {
			Limit: undefined,
			Remaining: undefined,
			Reset: undefined
		};

		this.requester = requester;
		this.url = url;
		this.onRequest = onRequest;
		this.onResponse = onResponse;
	}

	private request(raw: RawRequest): Promise<Response> {
		if (raw.url == undefined) raw.url = this.url;

		const req = new Request(raw);
		const path = req.Path();

		if (req.uuid == undefined) req.uuid = NewRandomUuid();

		if (raw.parameters != undefined) req.path = req.PathWithRequetsParameters();

		if (this.onRequest != undefined) this.onRequest(req);

		const promise =
			req.encoder == undefined
				? Promise.resolve(req.body)
				: req.encoder(req.body);

		return promise
			.then((body: string) => {
				req.body = body;

				return this.requester.Request(req);
			})
			.then((resp: Response) => {
				req.path = path;
				resp.uuid = req.uuid;
				resp.req = req;

				if (resp.body != '' && req.responseDecoder != undefined)
					return req
						.responseDecoder(resp.body)
						.then((body: any) => {
							resp.body = body;

							this.rates = {
								Limit: resp.headers['x-ratelimit-limit'],
								Remaining: resp.headers['x-ratelimit-remaining'],
								Reset: resp.headers['x-ratelimit-reset']
							};

							return resp;
						})
						.catch((err: any) => {
							throw err;
						});

				return resp;
			})
			.then((resp: Response) => {
				if (this.onResponse != undefined) this.onResponse(resp);

				return resp;
			})
			.catch((err: any) => {
				throw err;
			});
	}

	public post(raw: RawRequest): Promise<Response> {
		raw.method = Method.POST;

		return this.request(raw);
	}

	public get(raw: RawRequest): Promise<Response> {
		raw.method = Method.GET;

		return this.request(raw);
	}

	public put(raw: RawRequest): Promise<Response> {
		raw.method = Method.PUT;

		return this.request(raw);
	}

	public delete(raw: RawRequest): Promise<Response> {
		raw.method = Method.DELETE;

		return this.request(raw);
	}
}
