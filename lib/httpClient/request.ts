import { RawMessage, Message } from './message';
import { Encoder, Decoder } from './codec';
import * as qs from 'querystring';

export interface RawRequest extends RawMessage {
	uuid?: string;
	url?: string;
	hostname?: string;
	port?: string;
	method?: string;
	path?: string;
	parameters?: any;
	body?: any;
	formData?: any;
	encoder?: Encoder;
	responseDecoder?: Decoder;
	secure?: boolean;
	downloadFilepath?: string;
}

export class Request extends Message {
	public uuid?: string;
	public url?: string;
	public hostname?: string;
	public port?: string;
	public method?: string;
	public path?: string;
	public parameters?: any;
	public body?: any;
	public formData?: any;
	public encoder?: Encoder;
	public responseDecoder?: Decoder;
	public secure?: boolean;
	public downloadFilepath?: string;

	constructor(raw: RawRequest) {
		super(raw);

		this.uuid = raw.uuid;
		this.url = raw.url;
		this.hostname = raw.hostname;
		this.port = raw.port;
		this.method = raw.method;
		this.path = raw.path;
		this.parameters = raw.parameters;
		this.body = raw.body;
		this.formData = raw.formData;
		this.encoder = raw.encoder;
		this.responseDecoder = raw.responseDecoder;
		this.secure = raw.secure || false;
	}

	public Path(): string {
		if (this.path == undefined) return '';

		const index = this.path.indexOf('?');

		if (index == -1) return this.path;

		return this.path.slice(0, index);
	}

	public PathWithRequetsParameters(): string {
		const parameters = qs.stringify(this.parameters);

		return parameters == '' ? this.Path() : `${this.Path()}?${parameters}`;
	}

	public Verbose(): string {
		return `[${this.uuid}] ${this.method} ${this.url}${this.path}`;
	}

	public Debug(): string {
		const body = this.body || this.formData;

		return `[${this.uuid}] ${this.method} ${this.url}${this.path}${
			body == undefined ? '' : ' ' + JSON.stringify(body, undefined, 2)
		}`;
	}
}
