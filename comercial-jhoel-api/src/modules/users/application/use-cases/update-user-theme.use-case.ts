import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { ThemePreference } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { UserPreferencesOutput, toUserPreferencesOutput } from '../dtos/user-preferences-output';

/**
 * `PATCH /users/me/preferences/theme` — same pattern as every other
 * simple single-field write in this module (see `UpdateUserUseCase`): a
 * single-column `UPDATE` via `UserRepository.update()`, no stored
 * procedure. This codebase reserves PL/pgSQL functions for multi-table
 * operations that need real atomicity (day closing, sales, purchases,
 * recharges) — explicitly checked before writing this; `UpdateUserUseCase`
 * (username, phone, role, password, `isActive`) already updates `users`
 * with a plain `UPDATE`, so adding a stored procedure just for `theme`
 * would introduce a parallel pattern for the same kind of operation.
 *
 * `userId` always comes from `@CurrentUser` (JWT) in the controller —
 * never accepted as a parameter, so there is no way for this call to
 * modify another user's preference.
 */
@Injectable()
export class UpdateUserThemeUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, theme: ThemePreference): Promise<UserPreferencesOutput> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const updated = await this.userRepository.update(userId, { theme });
    return toUserPreferencesOutput(updated);
  }
}
