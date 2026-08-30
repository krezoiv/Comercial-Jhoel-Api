import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { ThemePreference } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { UserPreferencesOutput, toUserPreferencesOutput } from '../dtos/user-preferences-output';

/**
 * `PATCH /users/me/preferences/theme` — mismo patrón que el resto de
 * escrituras simples de un único campo en este módulo (ver
 * `UpdateUserUseCase`): un `UPDATE` de una sola columna vía
 * `UserRepository.update()`, sin stored procedure. Esta app reserva las
 * funciones PL/pgSQL para operaciones multi-tabla que necesitan
 * atomicidad real (cierre de día, ventas, compras, recargas) — revisado
 * explícitamente antes de escribir esto; `UpdateUserUseCase` (username,
 * teléfono, rol, contraseña, `isActive`) ya actualiza `users` con un
 * `UPDATE` plano, así que agregar un procedimiento solo para `theme`
 * introduciría un patrón paralelo para el mismo tipo de operación.
 *
 * `userId` viene siempre de `@CurrentUser` (JWT) en el controlador —
 * nunca se acepta como parámetro, así que no hay forma de que esta
 * llamada modifique la preferencia de otro usuario.
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
