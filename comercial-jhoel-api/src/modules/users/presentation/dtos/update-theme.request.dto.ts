import { IsIn } from 'class-validator';
import type { ThemePreference } from '../../domain/entities/user.entity';

const ALLOWED_THEMES: ThemePreference[] = ['LIGHT', 'DARK'];

/** Único valor aceptado: `theme`, restringido a `LIGHT`/`DARK` — el `ValidationPipe` global (`whitelist` + `forbidNonWhitelisted`) ya rechaza cualquier otro campo antes de que este DTO se evalúe. */
export class UpdateThemeRequestDto {
  @IsIn(ALLOWED_THEMES, { message: 'theme debe ser LIGHT o DARK' })
  theme: ThemePreference;
}
