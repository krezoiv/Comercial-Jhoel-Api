import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { RoleOutput, toRoleOutput } from '../dtos/role-output';

export interface ListRolesInput {
  activeOnly?: boolean;
}

@Injectable()
export class ListRolesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleRepository,
  ) {}

  async execute(input: ListRolesInput = {}): Promise<RoleOutput[]> {
    const roles = await this.roleRepository.findAll({
      activeOnly: input.activeOnly ?? false,
    });

    return Promise.all(
      roles.map(async (role) => {
        const usersCount = await this.roleRepository.countUsersByRoleId(
          role.id,
        );
        return toRoleOutput(role, usersCount);
      }),
    );
  }
}
