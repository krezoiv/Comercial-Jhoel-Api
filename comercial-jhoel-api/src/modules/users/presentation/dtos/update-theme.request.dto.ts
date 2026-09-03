import { IsIn } from 'class-validator';
import type { ThemePreference } from '../../domain/entities/user.entity';

const ALLOWED_THEMES: ThemePreference[] = ['LIGHT', 'DARK'];

/** Only one accepted field: `theme`, restricted to `LIGHT`/`DARK` — the global `ValidationPipe` (`whitelist` + `forbidNonWhitelisted`) already rejects any other field before this DTO's own decorators even run. */
export class UpdateThemeRequestDto {
  @IsIn(ALLOWED_THEMES, { message: 'theme debe ser LIGHT o DARK' })
  theme: ThemePreference;
}
