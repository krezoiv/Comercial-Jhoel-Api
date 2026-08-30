import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { PASSWORD_HASHER } from '../../../../shared/application/ports/password-hasher.port';
import type { PasswordHasher } from '../../../../shared/application/ports/password-hasher.port';
import { ROLE_REPOSITORY } from '../../../roles/domain/repositories/role.repository';
import type { RoleRepository } from '../../../roles/domain/repositories/role.repository';
import { InvalidRoleError } from '../../../roles/domain/errors/invalid-role.error';
import { UsernameAlreadyExistsError } from '../../domain/errors/username-already-exists.error';
import { PhoneAlreadyExistsError } from '../../domain/errors/phone-already-exists.error';
import { UserOutput, toUserOutput } from '../dtos/user-output';

export interface CreateUserInput {
  username: string;
  phone: string;
  password: string;
  roleId: string;
}

/** Admin-only creation (`POST /users`) — lets the caller assign any active role. */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleRepository,
  ) {}

  async execute(input: CreateUserInput): Promise<UserOutput> {
    const username = input.username.trim();
    const phone = input.phone.trim();

    const existingByUsername =
      await this.userRepository.findByUsername(username);
    if (existingByUsername) {
      throw new UsernameAlreadyExistsError(username);
    }

    const existingByPhone = await this.userRepository.findByPhone(phone);
    if (existingByPhone) {
      throw new PhoneAlreadyExistsError(phone);
    }

    const role = await this.roleRepository.findById(input.roleId);
    if (!role || !role.isActive) {
      throw new InvalidRoleError();
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.userRepository.create({
      username,
      phone,
      passwordHash,
      roleId: role.id,
    });

    return toUserOutput(user);
  }
}
