import { ThemePreference, User } from '../../domain/entities/user.entity';

/** Deliberadamente solo `theme` — la única preferencia que existe hoy; no reutiliza `UserOutput` para no filtrar campos administrativos (rol, estado, teléfono) a un endpoint pensado para "mi propia configuración". */
export interface UserPreferencesOutput {
  theme: ThemePreference;
}

export function toUserPreferencesOutput(user: User): UserPreferencesOutput {
  return { theme: user.theme };
}
