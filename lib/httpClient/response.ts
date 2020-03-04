import { RawMessage, Message } from './message';
import { Request } from './request';
import * as time from '../time.utilities';

const ms = require('ms');

export interface RawResponse extends RawMessage {
	status?: number;
	req?: Request;
	duration?: time.Duration;
}

export class Response extends Message {
	public status: number;
	public req: Request;
	public duration: time.Duration;

	constructor(raw: RawResponse) {
		super(raw);

		this.status = raw.status || 0;
		this.req = raw.req || new Request({});
		this.duration = raw.duration || 0;
	}

	public Verbose(): string {
		const path =
			this.req.secure == true
				? this.req.Path()
				: this.req.PathWithRequetsParameters();

		return `[${this.uuid}] ${this.req.method} ${this.req.url}${path} [${
			this.status
		}] (${this.prettyDuration()})`;
	}

	public Debug(): string {
		const path =
			this.req.secure == true
				? this.req.Path()
				: this.req.PathWithRequetsParameters();

		return `[${this.uuid}] ${this.req.method} ${this.req.url}${path} [${
			this.status
		}]${
			this.body == undefined
				? ''
				: ' ' + JSON.stringify(this.body, undefined, 2)
		} (${this.prettyDuration()})`;
	}

	private prettyDuration(): string {
		return ms(this.duration / 1e6, { long: true });
	}
}
