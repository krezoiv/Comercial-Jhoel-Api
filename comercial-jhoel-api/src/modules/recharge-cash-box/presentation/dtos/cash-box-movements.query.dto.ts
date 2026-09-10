import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

const CASH_BOX_MOVEMENT_TYPES = [
  'RECHARGE_SALE',
  'SIM_SALE',
  'RECHARGE_PURCHASE',
  'SIM_PURCHASE',
  'CONTRIBUTION',
  'PROFIT_WITHDRAWAL',
] as const;

export class CashBoxMovementsQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsIn(CASH_BOX_MOVEMENT_TYPES)
  type?: (typeof CASH_BOX_MOVEMENT_TYPES)[number];

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
