import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateBy,
} from 'class-validator';

/** Tope de NUMERIC(14,2) — un monto mayor desbordaría la columna. */
const MAX_CREDIT_AMOUNT = 999999999999.99;

/**
 * Solo evalúa el tope cuando el valor ya es un número: un monto ausente o
 * de texto ya lo reportan `@IsNumber`/`@Min`, sin sumar un "excede el
 * máximo" engañoso.
 */
function IsWithinMaxAmount(): PropertyDecorator {
  return ValidateBy({
    name: 'isWithinMaxAmount',
    validator: {
      validate: (value: unknown) => typeof value !== 'number' || value <= MAX_CREDIT_AMOUNT,
      defaultMessage: () => 'El monto excede el máximo permitido.',
    },
  });
}

/** Acreditar saldo: solo la cuenta (del catálogo existente) y un monto positivo con máximo 2 decimales. */
export class CreateBankBalanceCreditRequestDto {
  @IsUUID(undefined, { message: 'Seleccione una cuenta bancaria válida.' })
  bankId: string;

  @IsNumber(
    { maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false },
    { message: 'El monto debe ser un número con máximo 2 decimales.' },
  )
  @Min(0.01, { message: 'El monto a acreditar debe ser mayor que cero.' })
  @IsWithinMaxAmount()
  amount: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  referenceText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observation?: string;
}

export class VoidBankBalanceCreditRequestDto {
  @IsString()
  @MinLength(3, { message: 'El motivo es obligatorio.' })
  @MaxLength(500)
  reason: string;
}

export class BankBalanceCreditsQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  bankId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
