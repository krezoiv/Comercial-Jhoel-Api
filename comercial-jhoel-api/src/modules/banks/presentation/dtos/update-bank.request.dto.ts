import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BANK_SPECIAL_ACCOUNTS } from '../../domain/entities/bank-account-movement.entity';

export class UpdateBankRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(34)
  accountNumber?: string;

  @IsOptional()
  @IsUUID()
  accountTypeId?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  previousBalance?: number;

  /** Saldo inicial (alta) — negativo solo para la línea de crédito de Génesis. En edición, cambiarlo se rechaza: el saldo actual solo se corrige con "Ajustar saldo". */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  finalBalance?: number;

  /** Regla especial de saldo; `null` la quita. */
  @IsOptional()
  @IsIn(BANK_SPECIAL_ACCOUNTS)
  specialAccount?: string | null;

  /** Límite máximo configurable del saldo (BI Club Q75,000 / Génesis Q120,000); `null` = sin límite. */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maxBalance?: number | null;
}
