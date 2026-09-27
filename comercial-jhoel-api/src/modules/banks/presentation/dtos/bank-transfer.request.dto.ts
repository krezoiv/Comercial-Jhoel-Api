import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBankTransferRequestDto {
  @IsUUID()
  sourceBankId: string;

  /** Omitido cuando `cashWithdrawal` es `true`. */
  @IsOptional()
  @IsUUID()
  destinationBankId?: string;

  /** "Retiro de efectivo en banco": solo disminuye el saldo del origen, no acredita a ninguna cuenta. */
  @IsOptional()
  @IsBoolean()
  cashWithdrawal?: boolean;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El monto debe ser un número con máximo 2 decimales.' },
  )
  @Min(0.01, { message: 'El monto debe ser mayor que cero.' })
  amount: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  referenceText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  concept?: string;
}

export class VoidBankTransferRequestDto {
  @IsString()
  @MaxLength(500)
  reason: string;
}
