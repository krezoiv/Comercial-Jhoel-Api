import { IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * Público, sin autenticación. Deliberadamente sin `price`/`productName` —
 * `forbidNonWhitelisted` global rechaza cualquier intento de mandarlos;
 * el precio/nombre siempre se releen de la publicación real en
 * `CreateCatalogProductRequestUseCase`.
 */
export class CreateCatalogProductRequestRequestDto {
  @IsUUID()
  catalogProductId: string;

  @IsString()
  @MinLength(1, { message: 'El nombre es obligatorio.' })
  @MaxLength(150)
  customerName: string;

  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'El teléfono debe contener entre 7 y 15 dígitos, con un + inicial opcional.',
  })
  customerPhone: string;
}
