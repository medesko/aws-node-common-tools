const ms = require('ms');

export type Duration = number;

export const nanosecond: Duration = 1,
  microisecond: Duration = 1000 * nanosecond,
  millisecond: Duration = 1000 * microisecond,
  second: Duration = 1000 * millisecond,
  minute: Duration = 60 * second,
  hour: Duration = 60 * minute,
  day: Duration = 24 * hour;

export const measureDuration = (start: [number, number]): Duration => {
  const diff = process.hrtime(start);

  return diff[0] * 1e9 + diff[1];
};

export const since = (start: [number, number]): Duration => {
  const diff = process.hrtime(start);

  return diff[0] * 1e9 + diff[1];
};

export const sinceMs = (start: [number, number]): Duration => {
  return since(start) / 1e6;
};

export const prettySince = (start: [number, number], options: any = { long: true }): string => {
  return ms(since(start) / 1e6, options);
};

export const prettyDuration = (duration: Duration, options: any = { long: true }): string => {
  return ms(duration / 1e6, options);
};
