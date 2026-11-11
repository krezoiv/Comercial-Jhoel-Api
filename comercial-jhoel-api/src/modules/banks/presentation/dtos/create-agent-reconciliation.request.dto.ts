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
  IsUUID,
  Max,
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
 * `cashDetails` + `cashBreakdownSource` (+ `sourceCashCountId` when loaded
 * from an Arqueo de Caja) are optional together: when sent, the backend
 * checks they add up exactly to `totalCash` and stores them as a photograph.
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
}
