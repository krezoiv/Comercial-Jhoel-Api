import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CASH_STATEMENT_LOCATIONS } from '../../domain/cash-statement';
import type { CashStatementLocation } from '../../domain/cash-statement';

/**
 * Estado de Cuenta de Efectivo — period and table filters.
 * Period: `bankDate` (one bank day), `dateFrom`/`dateTo` (calendar range,
 * Guatemala) or nothing (the current bank day).
 */
export class CashStatementQueryDto {
  @IsOptional()
  @IsIn(CASH_STATEMENT_LOCATIONS)
  location?: CashStatementLocation;
  @IsOptional() @IsDateString({ strict: true }) bankDate?: string;
  @IsOptional() @IsDateString({ strict: true }) dateFrom?: string;
  @IsOptional() @IsDateString({ strict: true }) dateTo?: string;
  /** Entries only / exits only. */
  @IsOptional() @IsIn(['IN', 'OUT']) direction?: 'IN' | 'OUT';
  @IsOptional() @IsString() @MaxLength(30) movementType?: string;
  @IsOptional() @IsUUID() userId?: string;
  /** Description, beneficiary, operation number or reference. */
  @IsOptional() @IsString() @MaxLength(120) search?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(200) limit?: number;
}

export class CashStatementExportQueryDto extends CashStatementQueryDto {
  @IsIn(['pdf', 'xlsx']) format: 'pdf' | 'xlsx';
}

export class CashStatementDaysQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(370) limit?: number;
}
