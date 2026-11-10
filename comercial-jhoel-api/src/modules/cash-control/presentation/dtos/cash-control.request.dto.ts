import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  CASH_DIRECTIONS,
  CASH_MOVEMENT_TYPES,
  MANUAL_CASH_MOVEMENT_TYPES,
} from '../../domain/repositories/cash-control.repository';
import type {
  CashDirection,
  CashMovementType,
  ManualCashMovementType,
} from '../../domain/repositories/cash-control.repository';

const MAX_AMOUNT = 99_999_999.99;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const TIME_MESSAGE = 'La hora debe tener el formato HH:mm (24 h).';

/** Same denominations as Transaccionar/Guayacán (and `cash_valid_denomination` in SQL). */
export const CASH_DENOMINATIONS = [
  200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05,
] as const;

export class CashMovementsQueryDto {
  @IsOptional() @IsDateString({ strict: true }) dateFrom?: string;
  @IsOptional() @IsDateString({ strict: true }) dateTo?: string;
  @IsOptional() @IsIn(CASH_MOVEMENT_TYPES) movementType?: CashMovementType;
  @IsOptional() @IsIn(CASH_DIRECTIONS) direction?: CashDirection;
  @IsOptional() @IsUUID() userId?: string;
  @IsOptional() @IsUUID() cutPeriodId?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(200) limit?: number;
}

export class RecentCashMovementsQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit?: number;
}

export class RegisterCashMovementRequestDto {
  @IsIn(MANUAL_CASH_MOVEMENT_TYPES)
  movementType: ManualCashMovementType;

  /** Positive; AJUSTE may be negative (salida). */
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-MAX_AMOUNT)
  @Max(MAX_AMOUNT)
  amount: number;

  @IsOptional() @IsString() @MaxLength(255) description?: string;

  @IsString()
  @MinLength(5, { message: 'El motivo es obligatorio (mínimo 5 caracteres).' })
  @MaxLength(255)
  reason: string;

  /** One per modal opening: a double click or retry returns the same movement. */
  @IsOptional() @IsUUID() clientRequestId?: string;
}

export class ReasonRequestDto {
  @IsString()
  @MinLength(5, { message: 'El motivo es obligatorio (mínimo 5 caracteres).' })
  @MaxLength(255)
  reason: string;
}

export class OpenCashDayRequestDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(MAX_AMOUNT)
  manualPhysicalCash?: number;
  @IsOptional() @IsString() @MaxLength(255) reason?: string;
  @IsOptional() @Matches(TIME, { message: TIME_MESSAGE }) firstStart?: string;
  @IsOptional() @Matches(TIME, { message: TIME_MESSAGE }) firstEnd?: string;
  @IsOptional() @Matches(TIME, { message: TIME_MESSAGE }) secondStart?: string;
  @IsOptional() @Matches(TIME, { message: TIME_MESSAGE }) secondEnd?: string;
}

export class UpdateCashCutScheduleRequestDto {
  @Matches(TIME, { message: TIME_MESSAGE }) start: string;
  @Matches(TIME, { message: TIME_MESSAGE }) end: string;
  @IsString()
  @MinLength(5, {
    message: 'Indique por qué se modifica el horario (mínimo 5 caracteres).',
  })
  @MaxLength(255)
  reason: string;
}

export class CashDenominationRequestDto {
  @IsIn(CASH_DENOMINATIONS as readonly number[], {
    message: 'Denominación no válida.',
  })
  denomination: number;

  @IsInt()
  @Min(0)
  @Max(1_000_000)
  quantity: number;
}

export class CashBankVerificationRequestDto {
  @IsUUID() bankId: string;
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-MAX_AMOUNT)
  @Max(MAX_AMOUNT)
  verifiedBalance: number;
  @IsOptional() @IsString() @MaxLength(500) observations?: string;
}

export class FinishCashCutRequestDto {
  @IsArray()
  @ArrayMaxSize(11)
  @ValidateNested({ each: true })
  @Type(() => CashDenominationRequestDto)
  details: CashDenominationRequestDto[];

  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => CashBankVerificationRequestDto)
  banks: CashBankVerificationRequestDto[];

  @IsOptional() @IsString() @MaxLength(500) cashObservations?: string;
  @IsOptional() @IsString() @MaxLength(500) observations?: string;
}

export class CloseCashDayRequestDto {
  @IsOptional() @IsString() @MaxLength(500) observations?: string;
}

export class CashDaysQueryDto {
  @IsOptional() @IsDateString({ strict: true }) dateFrom?: string;
  @IsOptional() @IsDateString({ strict: true }) dateTo?: string;
  @IsOptional() @Type(() => Number) @IsIn([1, 2]) periodNumber?: 1 | 2;
  @IsOptional()
  @IsIn(['PROGRAMADO', 'ABIERTO', 'FINALIZADO', 'CERRADO'])
  status?: 'PROGRAMADO' | 'ABIERTO' | 'FINALIZADO' | 'CERRADO';
  @IsOptional() @IsUUID() userId?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}

/** Control de Efectivo → "Depósito bancario" (cash → registered account) with mandatory breakdown. */
export class RegisterCashBankDepositRequestDto {
  @IsUUID()
  bankId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(MAX_AMOUNT)
  amount: number;

  @IsArray()
  @ArrayMaxSize(11)
  @ValidateNested({ each: true })
  @Type(() => CashDenominationRequestDto)
  details: CashDenominationRequestDto[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  /** One per modal opening: a double click or retry returns the same deposit. */
  @IsOptional()
  @IsUUID()
  clientRequestId?: string;
}
