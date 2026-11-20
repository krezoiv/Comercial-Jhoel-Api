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
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  CASH_COUNT_RESULTS,
  WAREHOUSE_WITHDRAWAL_DESTINATIONS,
} from '../../domain/repositories/cash-custody.repository';
import type {
  CashCountResult,
  WarehouseWithdrawalDestination,
} from '../../domain/repositories/cash-custody.repository';

const MAX_AMOUNT = 99_999_999.99;
const DENOMINATIONS = [200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01];

/** One denomination row (quantity: whole number ≥ 0). */
export class DenominationRequestDto {
  @IsIn(DENOMINATIONS)
  denomination: number;

  @IsInt()
  @Min(0)
  @Max(1_000_000)
  quantity: number;
}

/**
 * "Arqueo de Caja" (or its audited correction): ONLY the cash physically in
 * the caja. Bodega is never counted here (migration 1760008800000, owner
 * request): its official balance is photographed by the backend, and
 * `forbidNonWhitelisted` rejects a `warehouseCounted` sent by an old client.
 */
export class RegisterCashCountRequestDto {
  @IsArray()
  @ArrayMaxSize(DENOMINATIONS.length)
  @ValidateNested({ each: true })
  @Type(() => DenominationRequestDto)
  details: DenominationRequestDto[];

  @IsOptional() @IsString() @MaxLength(500) observations?: string;

  /** One per form opening: a double click or retry returns the same count. */
  @IsUUID() clientRequestId: string;
}

export class CorrectCashCountRequestDto extends RegisterCashCountRequestDto {
  @IsString()
  @MinLength(5, { message: 'El motivo es obligatorio (mínimo 5 caracteres).' })
  @MaxLength(255)
  reason: string;
}

export class CashCountsQueryDto {
  @IsOptional() @IsDateString({ strict: true }) dateFrom?: string;
  @IsOptional() @IsDateString({ strict: true }) dateTo?: string;
  @IsOptional() @IsDateString({ strict: true }) businessDate?: string;
  @IsOptional() @IsUUID() userId?: string;
  @IsOptional() @IsIn(CASH_COUNT_RESULTS) result?: CashCountResult;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(200) limit?: number;
}

/** "Entrega de Efectivo a Bodega". */
export class RegisterWarehouseTransferRequestDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(MAX_AMOUNT)
  amount: number;

  /** Bills/coins sent (required by the use case: every caja ↔ Bodega transfer carries its breakdown). */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(DENOMINATIONS.length)
  @ValidateNested({ each: true })
  @Type(() => DenominationRequestDto)
  details?: DenominationRequestDto[];

  @IsString() @MinLength(3) @MaxLength(150) deliveredBy: string;
  @IsString() @MinLength(3) @MaxLength(150) receivedBy: string;
  @IsOptional() @IsString() @MaxLength(100) voucherReference?: string;
  @IsOptional() @IsString() @MaxLength(500) observations?: string;
  @IsUUID() clientRequestId: string;
}

export class WarehouseTransfersQueryDto {
  @IsOptional() @IsDateString({ strict: true }) dateFrom?: string;
  @IsOptional() @IsDateString({ strict: true }) dateTo?: string;
  @IsOptional() @IsIn(['APLICADA', 'ANULADA']) status?: 'APLICADA' | 'ANULADA';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(200) limit?: number;
}

export class WarehouseMovementsQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(200) limit?: number;
}

export class WarehouseInitialBalanceRequestDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(MAX_AMOUNT)
  amount: number;

  @IsString()
  @MinLength(5, { message: 'El motivo es obligatorio (mínimo 5 caracteres).' })
  @MaxLength(255)
  reason: string;

  @IsUUID() clientRequestId: string;
}

/** "Retiro de Bodega" — to the caja or to a bank account. */
export class RegisterWarehouseWithdrawalRequestDto {
  @IsIn(WAREHOUSE_WITHDRAWAL_DESTINATIONS)
  destination: WarehouseWithdrawalDestination;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(MAX_AMOUNT)
  amount: number;

  /** Bills/coins withdrawn (required by the use case: every caja ↔ Bodega transfer carries its breakdown). */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(DENOMINATIONS.length)
  @ValidateNested({ each: true })
  @Type(() => DenominationRequestDto)
  details?: DenominationRequestDto[];

  /** Required when `destination` is BANCO. */
  @IsOptional() @IsUUID() bankId?: string;

  @IsString() @MinLength(3) @MaxLength(150) deliveredBy: string;
  @IsString() @MinLength(3) @MaxLength(150) receivedBy: string;
  @IsOptional() @IsString() @MaxLength(100) voucherReference?: string;
  @IsOptional() @IsString() @MaxLength(500) observations?: string;
  @IsUUID() clientRequestId: string;
}

/** `GET /cash-control/counts/latest?businessDate=yyyy-MM-dd` (optional: default current bank day). */
export class LatestCashCountQueryDto {
  @IsOptional()
  @IsDateString({ strict: true })
  businessDate?: string;
}

/** "Conteo de Bodega por denominación" — sets the reference of the Bodega inventory. */
export class RegisterWarehouseCashCountRequestDto {
  @IsArray()
  @ArrayMaxSize(DENOMINATIONS.length)
  @ValidateNested({ each: true })
  @Type(() => DenominationRequestDto)
  details: DenominationRequestDto[];

  @IsOptional() @IsString() @MaxLength(500) observations?: string;

  /** One per form opening: a double click or retry returns the same count. */
  @IsUUID() clientRequestId: string;
}

export class PageQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(200) limit?: number;
}

/** In-progress Arqueo de Caja (autosave). Quantities may be 0; nothing here is a financial record. */
export class SaveCashCountDraftRequestDto {
  @IsArray()
  @ArrayMaxSize(DENOMINATIONS.length)
  @ValidateNested({ each: true })
  @Type(() => DraftDenominationRequestDto)
  details: DraftDenominationRequestDto[];

  @IsOptional() @IsString() @MaxLength(500) observations?: string;
}

export class DraftDenominationRequestDto {
  @IsIn(DENOMINATIONS)
  denomination: number;

  @IsInt()
  @Min(0)
  @Max(1_000_000)
  quantity: number;
}

export const CUSTODY_TRANSFER_KINDS = [
  'CAJA_A_BODEGA',
  'BODEGA_A_CAJA',
  'BODEGA_A_BANCO',
] as const;
export type CustodyTransferKindDto = (typeof CUSTODY_TRANSFER_KINDS)[number];

/** Unified history of caja ↔ Bodega transfers (and Bodega → bank deposits). */
export class CustodyTransfersQueryDto {
  @IsOptional() @IsIn(CUSTODY_TRANSFER_KINDS) kind?: CustodyTransferKindDto;
  @IsOptional() @IsUUID() userId?: string;
  @IsOptional() @IsDateString({ strict: true }) dateFrom?: string;
  @IsOptional() @IsDateString({ strict: true }) dateTo?: string;
  @IsOptional() @IsIn(['APLICADO', 'ANULADO']) status?: 'APLICADO' | 'ANULADO';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(200) limit?: number;
}
