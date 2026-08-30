import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { PASSWORD_HASHER } from '../../../../shared/application/ports/password-hasher.port';
import type { PasswordHasher } from '../../../../shared/application/ports/password-hasher.port';
import { ROLE_REPOSITORY } from '../../../roles/domain/repositories/role.repository';
import type { RoleRepository } from '../../../roles/domain/repositories/role.repository';
import { InvalidRoleError } from '../../../roles/domain/errors/invalid-role.error';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { UsernameAlreadyExistsError } from '../../domain/errors/username-already-exists.error';
import { PhoneAlreadyExistsError } from '../../domain/errors/phone-already-exists.error';
import { CannotDeactivateSelfError } from '../../domain/errors/cannot-deactivate-self.error';
import { UserOutput, toUserOutput } from '../dtos/user-output';

export interface UpdateUserInput {
  username?: string;
  phone?: string;
  roleId?: string;
  isActive?: boolean;
  password?: string;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateUserInput,
    currentUserId: string,
  ): Promise<UserOutput> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    const username = input.username?.trim();
    if (username && username !== user.username) {
      const existing = await this.userRepository.findByUsername(username);
      if (existing) {
        throw new UsernameAlreadyExistsError(username);
      }
    }

    const phone = input.phone?.trim();
    if (phone && phone !== user.phone) {
      const existing = await this.userRepository.findByPhone(phone);
      if (existing) {
        throw new PhoneAlreadyExistsError(phone);
      }
    }

    if (input.roleId) {
      const role = await this.roleRepository.findById(input.roleId);
      if (!role || !role.isActive) {
        throw new InvalidRoleError();
      }
    }

    if (input.isActive === false && id === currentUserId) {
      throw new CannotDeactivateSelfError();
    }

    const passwordHash = input.password
      ? await this.passwordHasher.hash(input.password)
      : undefined;

    const updated = await this.userRepository.update(id, {
      ...(username ? { username } : {}),
      ...(phone ? { phone } : {}),
      ...(input.roleId ? { roleId: input.roleId } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(passwordHash ? { passwordHash } : {}),
    });

    return toUserOutput(updated);
  }
}
