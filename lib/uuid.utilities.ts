import { v5 as UUID } from 'uuid';
export function NewUuid(str: string): string {
  if (str == '') return NewRandomUuid();

  return UUID(str, UUID.URL);
}

export function NewRandomUuid(range = 9951162800000000): string {
  const random = Date.now() + Math.floor(Math.random() * Math.floor(range));

  return NewUuid(`${random}`);
}
