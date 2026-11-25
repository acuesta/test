import { Body, Controller, Get, HttpCode, Inject, Post, UseGuards } from '@nestjs/common';
import { ChangePassword } from '../../application/change-password';
import { GetUserProfile } from '../../application/get-user-profile';
import { ListUsers } from '../../application/list-users';
import { AccessTokenPayload } from '../../domain/user/access-token-issuer';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    @Inject(GetUserProfile) private readonly getUserProfile: GetUserProfile,
    @Inject(ListUsers) private readonly listUsers: ListUsers,
    @Inject(ChangePassword) private readonly changePassword: ChangePassword,
  ) {}

  @Get('me')
  me(@CurrentUser() current: AccessTokenPayload) {
    return this.getUserProfile.execute(current.sub);
  }

  @Get()
  list() {
    return this.listUsers.execute();
  }

  @Post('me/password')
  @HttpCode(204)
  changeMyPassword(
    @CurrentUser() current: AccessTokenPayload,
    @Body() body: ChangePasswordDto,
  ) {
    return this.changePassword.execute({
      userId: current.sub,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });
  }
}
