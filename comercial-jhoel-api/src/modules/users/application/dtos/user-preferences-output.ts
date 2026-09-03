import { ThemePreference, User } from '../../domain/entities/user.entity';

/** Deliberately just `theme` — the only preference that exists today; doesn't reuse `UserOutput` so as not to leak administrative fields (role, status, phone) into an endpoint meant for "my own settings". */
export interface UserPreferencesOutput {
  theme: ThemePreference;
}

export function toUserPreferencesOutput(user: User): UserPreferencesOutput {
  return { theme: user.theme };
}
