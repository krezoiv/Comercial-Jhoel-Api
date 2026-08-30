import { Role } from '../entities/role.entity';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface CreateRoleData {
  name: string;
  description: string | null;
}

export interface UpdateRoleData {
  name?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface RoleRepository {
  findAll(options?: { activeOnly?: boolean }): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  /** `name` is a plain string (not the RoleName union) so custom, admin-created roles can be looked up too. */
  findByName(name: string): Promise<Role | null>;
  create(data: CreateRoleData): Promise<Role>;
  update(id: string, data: UpdateRoleData): Promise<Role>;
  deactivate(id: string): Promise<void>;
  /** Counts users currently referencing this role — `activeOnly` drives the "safe to deactivate" check. */
  countUsersByRoleId(roleId: string, activeOnly?: boolean): Promise<number>;
}
