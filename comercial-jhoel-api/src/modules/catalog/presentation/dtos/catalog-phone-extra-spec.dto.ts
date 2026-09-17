import { IsString, MaxLength, MinLength } from 'class-validator';

/** One `extraSpecs` row — "otras especificaciones configuradas desde el panel". Validated as a nested object (not a loose `Record`) so `forbidNonWhitelisted` still rejects stray keys inside each entry. */
export class CatalogPhoneExtraSpecDto {
  @IsString()
  @MinLength(1, { message: 'La etiqueta de la especificación es obligatoria.' })
  @MaxLength(80)
  label: string;

  @IsString()
  @MinLength(1, { message: 'El valor de la especificación es obligatorio.' })
  @MaxLength(200)
  value: string;
}
