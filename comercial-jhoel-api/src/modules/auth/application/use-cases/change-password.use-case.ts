import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import type { UserRepository } from '../../../users/domain/repositories/user.repository';
import { UserNotFoundError } from '../../../users/domain/errors/user-not-found.error';
import { PASSWORD_HASHER } from '../../../../shared/application/ports/password-hasher.port';
import type { PasswordHasher } from '../../../../shared/application/ports/password-hasher.port';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';

export interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new UserNotFoundError(input.userId);
    }

    const isCurrentPasswordValid = await this.passwordHasher.compare(
      input.currentPassword,
      user.passwordHash,
    );
    if (!isCurrentPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const newPasswordHash = await this.passwordHasher.hash(input.newPassword);
    await this.userRepository.updatePasswordHash(user.id, newPasswordHash);
  }
}
