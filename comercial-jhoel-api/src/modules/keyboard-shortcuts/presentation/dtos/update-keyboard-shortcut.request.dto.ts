import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class UpdateKeyboardShortcutRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  label?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  key?: string;

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

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Matches(/^\/dashboard\//, { message: 'La ruta debe pertenecer al panel (/dashboard/...).' })
  route?: string;

  /** Lets the "Activar" action on an already-deactivated row reuse this same endpoint instead of a separate one — mirrors `UpdatePresentationRequestDto`'s own `isActive?` field. */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
