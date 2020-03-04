const ms = require('ms');

export type Duration = number;

export const Nanosecond: Duration = 1,
	Microisecond: Duration = 1000 * Nanosecond,
	Millisecond: Duration = 1000 * Microisecond,
	Second: Duration = 1000 * Millisecond,
	Minute: Duration = 60 * Second,
	Hour: Duration = 60 * Minute,
	Day: Duration = 24 * Hour;

export function Since(start: [number, number]): Duration {
	const diff = process.hrtime(start);

	return diff[0] * 1e9 + diff[1];
}

export function SinceMs(start: [number, number]): Duration {
	return Since(start) / 1e6;
}

export function PrettySince(
	start: [number, number],
	options: any = { long: true }
): string {
	return ms(Since(start) / 1e6, options);
}

export function PrettyDuration(
	duration: Duration,
	options: any = { long: true }
): string {
	return ms(duration / 1e6, options);
}
