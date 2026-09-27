import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

/** Filtros del Reporte de Transferencias Bancarias (`GET /reports/bank-transfers`, `/summary`, `/export`). */
export class BankTransfersReportFilterQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  sourceBankId?: string;

  @IsOptional()
  @IsUUID()
  destinationBankId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsIn(['APLICADO', 'ANULADO'])
  status?: 'APLICADO' | 'ANULADO';

  /** `CASH_WITHDRAWAL` = solo retiros de efectivo en banco; `TRANSFER` = solo transferencias entre cuentas. */
  @IsOptional()
  @IsIn(['TRANSFER', 'CASH_WITHDRAWAL'])
  kind?: 'TRANSFER' | 'CASH_WITHDRAWAL';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}
