import { UserRepository } from '../domain/user/user.repository';
import { toUserView, UserView } from './user-view';

export class ListUsers {
  constructor(private readonly users: UserRepository) {}

  async execute(): Promise<UserView[]> {
    const users = await this.users.list();
    return users.map(toUserView);
  }
}
