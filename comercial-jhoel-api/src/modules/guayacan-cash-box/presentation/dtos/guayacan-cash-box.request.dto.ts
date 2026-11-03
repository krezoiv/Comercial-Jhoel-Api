import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { GUAYACAN_CASH_MOVEMENT_TYPES } from '../../domain/repositories/guayacan-cash-box.repository';
import type { GuayacanCashMovementType } from '../../domain/repositories/guayacan-cash-box.repository';
import { GUAYACAN_CASH_DENOMINATIONS } from '../../application/utils/cash-denominations';

const MAX_AMOUNT = 9_999_999.99;

export class GuayacanCashDenominationRequestDto {
  @IsIn(GUAYACAN_CASH_DENOMINATIONS as readonly number[], {
    message: 'Denominación no válida.',
  })
  denomination: number;

  @IsInt()
  @Min(0)
  @Max(1_000_000)
  quantity: number;
}

class GuayacanCashMovementBaseRequestDto {
  @IsOptional()
  @IsDateString({ strict: true })
  businessDate?: string;

  @IsString()
  @IsNotEmpty({ message: 'Debe indicar el concepto del movimiento.' })
  @MinLength(3)
  @MaxLength(150)
  concept: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  /** Uno por modal abierto: un doble clic o reintento devuelve el mismo movimiento. */
  @IsOptional()
  @IsUUID()
  clientRequestId?: string;
}

export class RegisterGuayacanCashMovementRequestDto extends GuayacanCashMovementBaseRequestDto {
  @IsIn(['INGRESO', 'EGRESO'])
  movementType: 'INGRESO' | 'EGRESO';

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(MAX_AMOUNT)
  amount: number;

  /** Motivo del ingreso/egreso. */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(GUAYACAN_CASH_DENOMINATIONS.length)
  @ValidateNested({ each: true })
  @Type(() => GuayacanCashDenominationRequestDto)
  cashDetails?: GuayacanCashDenominationRequestDto[];
}

export class RegisterGuayacanCashAdjustmentRequestDto extends GuayacanCashMovementBaseRequestDto {
  /** Con signo: positivo = sobrante, negativo = faltante. */
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-MAX_AMOUNT)
  @Max(MAX_AMOUNT)
  amount: number;

  @IsString()
  @MinLength(5, {
    message: 'El motivo del ajuste debe tener al menos 5 caracteres.',
  })
  @MaxLength(255)
  reason: string;
}

export class VoidGuayacanCashMovementRequestDto {
  @IsString()
  @MinLength(5, {
    message: 'El motivo de la anulación debe tener al menos 5 caracteres.',
  })
  @MaxLength(255)
  reason: string;
}

export class RegisterGuayacanCashCountRequestDto {
  @IsArray()
  @ArrayMaxSize(GUAYACAN_CASH_DENOMINATIONS.length)
  @ValidateNested({ each: true })
  @Type(() => GuayacanCashDenominationRequestDto)
  details: GuayacanCashDenominationRequestDto[];

  @IsOptional()
  @IsDateString({ strict: true })
  businessDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsUUID()
  clientRequestId?: string;
}

export class GuayacanCashMovementsQueryDto {
  @IsOptional()
  @IsDateString({ strict: true })
  startDate?: string;

  @IsOptional()
  @IsDateString({ strict: true })
  endDate?: string;

  @IsOptional()
  @IsIn(GUAYACAN_CASH_MOVEMENT_TYPES as readonly string[])
  movementType?: GuayacanCashMovementType;

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

export class GuayacanCashCountsQueryDto {
  @IsOptional()
  @IsDateString({ strict: true })
  startDate?: string;

  @IsOptional()
  @IsDateString({ strict: true })
  endDate?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  /** "ARQ-0007" o "7". */
  @IsOptional()
  @IsString()
  @MaxLength(20)
  number?: string;

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

export class GuayacanCommissionsQueryDto {
  @IsOptional()
  @IsDateString({ strict: true })
  startDate?: string;

  @IsOptional()
  @IsDateString({ strict: true })
  endDate?: string;

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
