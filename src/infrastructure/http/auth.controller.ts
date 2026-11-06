import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthenticateUser } from '../../application/authenticate-user';
import { RegisterUser } from '../../application/register-user';
import { readTokenTtlSeconds } from '../config';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly authenticateUser: AuthenticateUser,
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
