import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { CannotDeactivateSelfError } from '../../domain/errors/cannot-deactivate-self.error';

/**
 * Soft delete only (`isActive=false`) — never a physical DELETE. Blocks an
 * admin from deactivating their own account, which would otherwise let them
 * lock themselves out (or, if they're the last admin, lock everyone out).
 */
@Injectable()
export class DeactivateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, currentUserId: string): Promise<void> {
    if (id === currentUserId) {
      throw new CannotDeactivateSelfError();
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    await this.userRepository.deactivate(id);
  }
}
