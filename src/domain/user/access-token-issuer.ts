export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface AccessTokenIssuer {
  issue(payload: AccessTokenPayload): string;
  verify(token: string): AccessTokenPayload;
}

export const ACCESS_TOKEN_ISSUER = Symbol('ACCESS_TOKEN_ISSUER');
