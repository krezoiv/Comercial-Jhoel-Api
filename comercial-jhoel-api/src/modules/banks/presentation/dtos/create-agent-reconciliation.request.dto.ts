import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
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
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CASH_DENOMINATIONS } from '../../../cash-control/domain/cash-denominations';
import {
  CUADRE_CASH_BREAKDOWN_SOURCES,
  type CuadreCashBreakdownSource,
} from '../../domain/repositories/agent-reconciliation.repository';

/** One denomination row of the cuadre's cash count (whole quantity ≥ 0). */
export class CuadreCashDetailRequestDto {
  @IsIn(CASH_DENOMINATIONS as readonly number[])
  denomination: number;

  @IsInt()
  @Min(0)
  @Max(1_000_000)
  quantity: number;
}

/**
 * `totalBanks`/`totalAssets`/`totalAccountsReceivable`/`result` are never
 * accepted from the client (see `CloseAgentDayUseCase`), and the global
 * `ValidationPipe`'s `forbidNonWhitelisted` rejects a request body that
 * includes them with a 400 before this DTO's own decorators even run,
 * closing off any "send it anyway and hope it's used" manipulation path.
 *
 * "Arqueo de Caja": `cashDetails` + `cashBreakdownSource` (+
 * `sourceCashCountId` when loaded from a cut) are the caja count and must
 * add up exactly to `totalCash`; `warehouseDetails` is the independent
 * physical Bodega count. `CloseAgentDayUseCase` requires both (a clear
 * business error instead of a generic 400) and stores them as a photograph
 * with the theoretical balances and every difference, computed server side.
 */
export class CreateAgentReconciliationRequestDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalCash: number;

  /** Plain calendar date (yyyy-MM-dd). Omitted = today, server-computed. */
  @IsOptional()
  @IsDateString()
  date?: string;

  @ValidateIf(
    (dto: CreateAgentReconciliationRequestDto) =>
      dto.cashBreakdownSource !== undefined || dto.cashDetails !== undefined,
  )
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(CASH_DENOMINATIONS.length)
  @ValidateNested({ each: true })
  @Type(() => CuadreCashDetailRequestDto)
  cashDetails?: CuadreCashDetailRequestDto[];

  @ValidateIf(
    (dto: CreateAgentReconciliationRequestDto) =>
      dto.cashBreakdownSource !== undefined || dto.cashDetails !== undefined,
  )
  @IsIn(CUADRE_CASH_BREAKDOWN_SOURCES)
  cashBreakdownSource?: CuadreCashBreakdownSource;

  @IsOptional()
  @IsUUID()
  sourceCashCountId?: string;

  /** Physical Bodega count, one row per denomination (zeros allowed). */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(CASH_DENOMINATIONS.length)
  @ValidateNested({ each: true })
  @Type(() => CuadreCashDetailRequestDto)
  warehouseDetails?: CuadreCashDetailRequestDto[];

  /** Observations of the "Arqueo de Caja". */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observations?: string;
}
