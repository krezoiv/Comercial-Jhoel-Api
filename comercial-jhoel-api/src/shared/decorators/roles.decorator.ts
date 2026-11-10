import { SetMetadata } from '@nestjs/common';
import {
  RoleName,
  SHIFT_SUPERVISOR_ROLE,
} from '../../modules/roles/domain/entities/role.entity';

export const ROLES_KEY = 'roles';

/**
 * Marks a route as requiring one of the given roles — enforced by RolesGuard
 * (plain string comparison against the JWT's role). Besides the three seeded
 * roles it accepts the custom shift-supervisor role, which Control de
 * Efectivo authorizes to run the cash cuts.
 */
export const Roles = (
  ...roles: Array<RoleName | typeof SHIFT_SUPERVISOR_ROLE>
) => SetMetadata(ROLES_KEY, roles);
