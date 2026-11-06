import { User, UserStatus } from '../domain/user/user';

export interface UserView {
  id: string;
  email: string;
  displayName: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export function toUserView(user: User): UserView {
  return {
    id: user.id,
    email: user.getEmail(),
    displayName: user.getDisplayName(),
    status: user.getStatus(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.getUpdatedAt().toISOString(),
  };
}
