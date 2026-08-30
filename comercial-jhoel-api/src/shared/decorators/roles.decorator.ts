import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../../modules/roles/domain/entities/role.entity';

export const ROLES_KEY = 'roles';

/** Marks a route as requiring one of the given roles — enforced by RolesGuard. */
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
