import {
  IsIn,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { CatalogRequestType } from '../../domain/entities/catalog-request.entity';

/**
 * Public, unauthenticated body — deliberately minimal. No `price`,
 * `creditAvailable`, `brand`, or `model` field exists here at all: the
 * global `ValidationPipe({ forbidNonWhitelisted: true })` rejects the
 * request outright (400) if a caller tries to smuggle any of those in,
 * which is what makes "el backend debe recalcular la disponibilidad según
 * el precio real" actually enforceable rather than just a convention.
 */
export class CreateCatalogRequestRequestDto {
  @IsUUID()
  catalogPhoneId: string;

  @IsIn(['INTERES_COMPRA', 'INTERES_CREDITO'])
  requestType: CatalogRequestType;

  @IsString()
  @MinLength(1, { message: 'El nombre es obligatorio.' })
  @MaxLength(150)
  customerName: string;

  /** Same shape already validated elsewhere in this codebase (suppliers/users/recharges/phone-sales) for a `phone` field. */
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message:
      'El teléfono debe contener entre 7 y 15 dígitos, con un + inicial opcional.',
  })
  customerPhone: string;
}
