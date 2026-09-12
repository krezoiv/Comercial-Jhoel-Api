import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

/**
 * `multipart/form-data` body (the DPI photo travels alongside as the
 * `dpiImage` file field, read via `@UploadedFile()` — see
 * `RechargeSimsController.registerSaleRegistration`) — every text field
 * arrives as a string regardless of its logical type, hence `@Type(() =>
 * Number)` on `salePrice`, same pattern `ListPurchasesQueryDto` already
 * uses for its own multipart-adjacent numeric query params.
 */
export class RegisterRechargeSimSaleRegistrationRequestDto {
  @IsUUID()
  simTypeId: string;

  @IsString()
  @MinLength(1, { message: 'El número de SIM es obligatorio.' })
  simNumber: string;

  @IsString()
  @MinLength(1, { message: 'El SKU es obligatorio.' })
  sku: string;

  @IsString()
  @MinLength(1, { message: 'El DPI del cliente es obligatorio.' })
  clientDpi: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salePrice: number;

  @IsDateString()
  operationDate: string;
}
