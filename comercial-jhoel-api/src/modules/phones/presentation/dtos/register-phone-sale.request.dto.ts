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
 * `multipart/form-data` body — the DPI photo travels alongside as the
 * `dpiImage` file field (read via `@UploadedFile()`, see
 * `PhoneSalesController.registerSale`), optional (see the plan's own
 * "foto opcional, igual que SIM" decision). Every text field arrives as a
 * string regardless of its logical type, hence `@Type(() => Number)` on
 * `salePrice`, same pattern SIM's own registration DTO uses.
 */
export class RegisterPhoneSaleRequestDto {
  @IsUUID()
  phoneId: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsString()
  @MinLength(1, { message: 'El DPI del cliente es obligatorio.' })
  clientDpi: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salePrice: number;

  @IsDateString()
  saleDate: string;
}
