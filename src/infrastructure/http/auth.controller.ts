import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { AuthenticateUser } from '../../application/authenticate-user';
import { RegisterUser } from '../../application/register-user';
import { readTokenTtlSeconds } from '../config';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(RegisterUser) private readonly registerUser: RegisterUser,
    @Inject(AuthenticateUser) private readonly authenticateUser: AuthenticateUser,
  ) {}

  @Post('register')
  register(@Body() body: RegisterUserDto) {
    return this.registerUser.execute(body);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    const result = await this.authenticateUser.execute(body);
    return {
      tokenType: 'Bearer',
      accessToken: result.accessToken,
      expiresIn: readTokenTtlSeconds(),
      user: result.user,
    };
  }
}
