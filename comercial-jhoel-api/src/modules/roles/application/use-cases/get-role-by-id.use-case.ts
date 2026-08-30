import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { RoleNotFoundError } from '../../domain/errors/role-not-found.error';
import { RoleOutput, toRoleOutput } from '../dtos/role-output';

@Injectable()
export class GetRoleByIdUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleRepository,
  ) {}

  async execute(id: string): Promise<RoleOutput> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new RoleNotFoundError(id);
    }
    const usersCount = await this.roleRepository.countUsersByRoleId(role.id);
    return toRoleOutput(role, usersCount);
  }
}
