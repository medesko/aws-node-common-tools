export type Headers = { [name: string]: string };

export interface RawMessage {
	headers?: Headers;
	body?: any;
	uuid?: string;
}

export abstract class Message {
	public headers: Headers;
	public body?: any;
	public uuid?: string;

	constructor(raw: RawMessage) {
		this.headers = raw.headers || {};
		this.body = raw.body;
		this.uuid = raw.uuid;
	}

	public SetHeader(name: string, value: string): void {
		this.headers[name] = value;
	}

	public GetHeader(name: string): string | string[] {
		const header = this.headers[name];

		if (header == undefined) return header;

		return header.split(',').map((header: string) => {
			return header.trim();
		});
	}
}
