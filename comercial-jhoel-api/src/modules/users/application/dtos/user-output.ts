import { User } from '../../domain/entities/user.entity';

/** Plain, serializable shape use cases return — never the domain entity, and never passwordHash. */
export interface UserOutput {
  id: string;
  username: string;
  phone: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function toUserOutput(user: User): UserOutput {
  return {
    id: user.id,
    username: user.username ?? '',
    phone: user.phone ?? '',
    roleId: user.roleId,
    roleName: user.roleName,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
