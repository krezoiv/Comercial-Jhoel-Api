import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateTransactionBankRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  /** Marca/desmarca este banco agente como Cooperativa Guayacán (caja propia + comisión). Solo uno a la vez. */
  @IsOptional()
  @IsBoolean()
  isGuayacan?: boolean;

  /** Comisión por transacción individual (default Q3.00 al marcarlo). Solo aplica con `isGuayacan`. */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(1000)
  commissionPerTransaction?: number;
}
