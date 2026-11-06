import { User } from '../../domain/user/user';
import { UserRepository } from '../../domain/user/user.repository';

export class InMemoryUserRepository implements UserRepository {
  private readonly byId = new Map<string, User>();
  private readonly byEmail = new Map<string, User>();

  async findById(id: string): Promise<User | null> {
    return this.byId.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.byEmail.get(email) ?? null;
  }

  async list(): Promise<User[]> {
    return [...this.byId.values()].sort(
      (left, right) => left.createdAt.getTime() - right.createdAt.getTime(),
    );
  }

  async save(user: User): Promise<void> {
    const previous = this.byId.get(user.id);
    if (previous && previous.getEmail() !== user.getEmail()) {
      this.byEmail.delete(previous.getEmail());
    }
    this.byId.set(user.id, user);
    this.byEmail.set(user.getEmail(), user);
  }
}
