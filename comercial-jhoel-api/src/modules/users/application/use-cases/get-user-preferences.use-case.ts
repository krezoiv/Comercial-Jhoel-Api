import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import {
  UserPreferencesOutput,
  toUserPreferencesOutput,
} from '../dtos/user-preferences-output';

/**
 * `GET /users/me/preferences` — `userId` always comes from `@CurrentUser`
 * (JWT), never from a route parameter or body: there is no way to request
 * another user's preference through this endpoint.
 */
@Injectable()
export class GetUserPreferencesUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<UserPreferencesOutput> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    return toUserPreferencesOutput(user);
  }
}
