import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { RoleNotFoundError } from '../../domain/errors/role-not-found.error';
import { RoleHasAssignedUsersError } from '../../domain/errors/role-has-assigned-users.error';

/**
 * Soft delete only — a role is never physically removed (the FK from `users`
 * is RESTRICT anyway). Blocked while any active user still references it, so
 * an admin never silently strands users without a working role.
 */
@Injectable()
export class DeactivateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new RoleNotFoundError(id);
    }

    const activeUsers = await this.roleRepository.countUsersByRoleId(id, true);
    if (activeUsers > 0) {
      throw new RoleHasAssignedUsersError();
    }

    await this.roleRepository.deactivate(id);
  }
}
