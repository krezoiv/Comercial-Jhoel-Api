import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { RoleNameAlreadyExistsError } from '../../domain/errors/role-name-already-exists.error';
import { RoleOutput, toRoleOutput } from '../dtos/role-output';
import { normalizeRoleName } from './normalize-role-name';

export interface CreateRoleInput {
  name: string;
  description?: string;
}

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleRepository,
  ) {}

  async execute(input: CreateRoleInput): Promise<RoleOutput> {
    const name = normalizeRoleName(input.name);

    const existing = await this.roleRepository.findByName(name);
    if (existing) {
      throw new RoleNameAlreadyExistsError(name);
    }

    const role = await this.roleRepository.create({
      name,
      description: input.description?.trim() || null,
    });
    return toRoleOutput(role, 0);
  }
}
