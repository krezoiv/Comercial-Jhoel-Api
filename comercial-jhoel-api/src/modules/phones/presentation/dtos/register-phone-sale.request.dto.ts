import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';

/**
 * `multipart/form-data` body — the DPI photo travels alongside as the
 * `dpiImage` file field (read via `@UploadedFile()`, see
 * `PhoneSalesController.registerSale`), optional (see the plan's own
 * "foto opcional, igual que SIM" decision). No `salePrice` field — the
 * server always computes it from the phone's own `publicPrice`
 * (`register_phone_sale`), never from a caller-supplied value.
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

  /** El número que se activa al vender — mismo patrón de validación ya usado en `suppliers`/`users`/`recharges` para un campo `phone`. */
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message:
      'El número de teléfono asignado debe contener entre 7 y 15 dígitos, con un + inicial opcional',
  })
  phoneNumber: string;

  @IsDateString()
  saleDate: string;
}
