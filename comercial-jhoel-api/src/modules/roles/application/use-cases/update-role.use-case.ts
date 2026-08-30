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
