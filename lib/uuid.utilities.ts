const UUID = require('uuid/v5');

export function NewUuid(str: string): string {
	if (str == '') return NewRandomUuid();

	return UUID(str, UUID.URL);
}

export function NewRandomUuid(range: number = 9951162800000000): string {
	let random = Date.now() + Math.floor(Math.random() * Math.floor(range));

	return NewUuid(`${random}`);
}
