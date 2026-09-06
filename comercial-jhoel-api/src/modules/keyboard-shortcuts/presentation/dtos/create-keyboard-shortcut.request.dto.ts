import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateKeyboardShortcutRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  label: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  key: string;

  @IsOptional()
  @IsBoolean()
  altKey?: boolean;

  @IsOptional()
  @IsBoolean()
  ctrlKey?: boolean;

  @IsOptional()
  @IsBoolean()
  shiftKey?: boolean;

  @IsOptional()
  @IsBoolean()
  metaKey?: boolean;

  /** Must be a real, current dashboard route — the frontend form only ever offers one from `DASHBOARD_NAV_ITEMS`, never free text. */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Matches(/^\/dashboard\//, { message: 'La ruta debe pertenecer al panel (/dashboard/...).' })
  route: string;
}
