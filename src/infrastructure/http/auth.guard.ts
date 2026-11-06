import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ACCESS_TOKEN_ISSUER,
  AccessTokenIssuer,
  AccessTokenPayload,
} from '../../domain/user/access-token-issuer';

export interface AuthenticatedRequest extends Request {
  user: AccessTokenPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(ACCESS_TOKEN_ISSUER) private readonly tokens: AccessTokenIssuer,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.header('authorization') ?? '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      request.user = this.tokens.verify(token);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid bearer token');
    }
  }
}
