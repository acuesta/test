import { UserNotFound } from '../domain/user/user.errors';
import { UserRepository } from '../domain/user/user.repository';
import { toUserView, UserView } from './user-view';

export class GetUserProfile {
  constructor(private readonly users: UserRepository) {}

  async execute(userId: string): Promise<UserView> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UserNotFound();
    }
    return toUserView(user);
  }
}
