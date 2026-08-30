import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { UserPreferencesOutput, toUserPreferencesOutput } from '../dtos/user-preferences-output';

/**
 * `GET /users/me/preferences` — el `userId` viene siempre de `@CurrentUser`
 * (JWT), nunca de un parámetro de ruta o body: no existe forma de pedir la
 * preferencia de otro usuario a través de este endpoint.
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
