export function readPort(): number {
  const raw = process.env.PORT ?? '3000';
  const port = Number(raw);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer');
  }
  return port;
}

export function readTokenSecret(): string {
  const secret = process.env.TOKEN_SECRET;
  if (secret && secret.length >= 16) {
    return secret;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('TOKEN_SECRET must be set to at least 16 characters in production');
  }
  return 'dev-only-token-secret';
}

export function readTokenTtlSeconds(): number {
  const raw = process.env.TOKEN_TTL_SECONDS ?? '3600';
  const ttl = Number(raw);
  if (!Number.isInteger(ttl) || ttl <= 0) {
    throw new Error('TOKEN_TTL_SECONDS must be a positive integer');
  }
  return ttl;
}
