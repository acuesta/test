import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  AccessTokenIssuer,
  AccessTokenPayload,
} from '../../domain/user/access-token-issuer';

interface SignedPayload extends AccessTokenPayload {
  iat: number;
  exp: number;
}

export class HmacAccessTokenIssuer implements AccessTokenIssuer {
  constructor(
    private readonly secret: string,
    private readonly ttlSeconds: number,
  ) {}

  issue(payload: AccessTokenPayload): string {
    const now = Math.floor(Date.now() / 1000);
    const body: SignedPayload = {
      sub: payload.sub,
      email: payload.email,
      iat: now,
      exp: now + this.ttlSeconds,
    };
    const header = encode({ alg: 'HS256', typ: 'JWT' });
    const encodedBody = encode(body);
    const signature = this.sign(`${header}.${encodedBody}`);
    return `${header}.${encodedBody}.${signature}`;
  }

  verify(token: string): AccessTokenPayload {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Malformed access token');
    }
    const [header, body, signature] = parts;
    const expected = this.sign(`${header}.${body}`);
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (
      actualBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(actualBuffer, expectedBuffer)
    ) {
      throw new Error('Invalid access token signature');
    }

    const payload = decode<SignedPayload>(body);
    if (!payload.sub || !payload.email || payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new Error('Expired or incomplete access token');
    }
    return { sub: payload.sub, email: payload.email };
  }

  private sign(value: string): string {
    return createHmac('sha256', this.secret).update(value).digest('base64url');
  }
}

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function decode<T>(value: string): T {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as T;
}
