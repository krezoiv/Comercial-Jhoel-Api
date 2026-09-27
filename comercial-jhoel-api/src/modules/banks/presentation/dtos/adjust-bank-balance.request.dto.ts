import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * `newBalance` puede ser negativo en el DTO a propósito: solo la línea de
 * crédito de Fundación Génesis lo admite, y esa regla vive en
 * `apply_bank_account_movement` (una cuenta normal se rechaza allí).
 */
export class AdjustBankBalanceRequestDto {
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El nuevo saldo debe ser un número con máximo 2 decimales.' },
  )
  newBalance: number;

  @IsString()
  @MinLength(3, { message: 'El motivo es obligatorio.' })
  @MaxLength(255)
  reason: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observation?: string;
}
