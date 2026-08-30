import { Role } from '../../domain/entities/role.entity';

/** Plain, serializable shape use cases return — never the domain entity itself. */
export interface RoleOutput {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  usersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export function toRoleOutput(role: Role, usersCount: number): RoleOutput {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    isActive: role.isActive,
    usersCount,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}
