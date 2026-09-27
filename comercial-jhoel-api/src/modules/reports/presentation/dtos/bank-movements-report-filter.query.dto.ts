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
import { BANK_MOVEMENT_TYPES } from '../../../banks/domain/entities/bank-account-movement.entity';
import type { BankMovementType } from '../../../banks/domain/entities/bank-account-movement.entity';

/** Filtros del historial de movimientos de saldo bancario (`GET /reports/bank-movements`, `/export`). */
export class BankMovementsReportFilterQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  bankId?: string;

  @IsOptional()
  @IsIn(BANK_MOVEMENT_TYPES)
  movementType?: BankMovementType;

  @IsOptional()
  @IsUUID()
  userId?: string;

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
