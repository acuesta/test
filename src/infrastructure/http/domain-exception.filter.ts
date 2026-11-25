import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../../domain/shared/domain-error';

const STATUS_BY_CODE: Record<string, number> = {
  EMAIL_INVALID: HttpStatus.BAD_REQUEST,
  PASSWORD_TOO_WEAK: HttpStatus.BAD_REQUEST,
  DISPLAY_NAME_INVALID: HttpStatus.BAD_REQUEST,
  EMAIL_ALREADY_USED: HttpStatus.CONFLICT,
  INVALID_CREDENTIALS: HttpStatus.UNAUTHORIZED,
  USER_DISABLED: HttpStatus.FORBIDDEN,
  USER_NOT_FOUND: HttpStatus.NOT_FOUND,
  CASE_NOT_FOUND: HttpStatus.NOT_FOUND,
  INVALID_GUESS: HttpStatus.BAD_REQUEST,
};

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = STATUS_BY_CODE[exception.code] ?? HttpStatus.BAD_REQUEST;
    response.status(status).json({
      code: exception.code,
      message: exception.message,
    });
  }
}
