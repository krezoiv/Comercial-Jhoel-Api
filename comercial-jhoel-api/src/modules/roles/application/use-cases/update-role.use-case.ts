import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { ROLE_NAMES } from '../../domain/entities/role.entity';
import { RoleNotFoundError } from '../../domain/errors/role-not-found.error';
import { RoleNameAlreadyExistsError } from '../../domain/errors/role-name-already-exists.error';
import { RoleHasAssignedUsersError } from '../../domain/errors/role-has-assigned-users.error';
import { SystemRoleImmutableError } from '../../domain/errors/system-role-immutable.error';
import { RoleOutput, toRoleOutput } from '../dtos/role-output';
import { normalizeRoleName } from './normalize-role-name';

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}

@Injectable()
export class UpdateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleRepository,
  ) {}

  async execute(id: string, input: UpdateRoleInput): Promise<RoleOutput> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new RoleNotFoundError(id);
    }

    const isSystemRole = (ROLE_NAMES as readonly string[]).includes(role.name);

    // One of the three seeded roles can never be renamed — every
    // `@Roles('ADMIN', 'SUPER_ADMIN')` guard across the app is a literal
    // string match against `ROLE_NAMES` (see that constant's own doc
    // comment), and renaming one here has no way to also update every
    // guard that names it. Description and `isActive` on a system role
    // stay editable; only `name` is locked.
    let name: string | undefined;
    if (input.name !== undefined) {
      name = normalizeRoleName(input.name);
      if (name !== role.name) {
        if (isSystemRole) {
          throw new SystemRoleImmutableError();
        }
        const existing = await this.roleRepository.findByName(name);
        if (existing) {
          throw new RoleNameAlreadyExistsError(name);
        }
      }
    }

    // Deactivating a role that still has active users would leave them
    // holding a role that no longer satisfies any `@Roles(...)` check
    // cleanly (or, worse, silently) — block it until they're moved off
    // first. Users who are themselves already inactive don't count: they
    // have no active access left to lose.
    if (input.isActive === false && role.isActive) {
      const activeUsers = await this.roleRepository.countUsersByRoleId(
        role.id,
        true,
      );
      if (activeUsers > 0) {
        throw new RoleHasAssignedUsersError();
      }
    }

    const updated = await this.roleRepository.update(id, {
      ...(name !== undefined ? { name } : {}),
      ...(input.description !== undefined
        ? { description: input.description?.trim() || null }
        : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    });

    const usersCount = await this.roleRepository.countUsersByRoleId(updated.id);
    return toRoleOutput(updated, usersCount);
  }
}
