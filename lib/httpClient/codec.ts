export type Encoder = (data: any) => Promise<string>;
export type Decoder = (data: string) => Promise<any>;

export const JsonEncoder: Encoder = (data: any): Promise<string> => {
	return new Promise<string>(resolve => {
		resolve(JSON.stringify(data));
	});
};

export const JsonDecoder: Decoder = (data: any): Promise<string> => {
	return new Promise<any>((resolve, reject) => {
		let result: any;

		try {
			result = JSON.parse(data);
		} catch (err) {
			return reject(err);
		}

		resolve(result);
	});
};
