import { InvalidDisplayName } from './user.errors';

export function normalizeDisplayName(raw: string): string {
  const value = raw.trim();
  if (value.length < 1 || value.length > 80) {
    throw new InvalidDisplayName();
  }
  return value;
}
