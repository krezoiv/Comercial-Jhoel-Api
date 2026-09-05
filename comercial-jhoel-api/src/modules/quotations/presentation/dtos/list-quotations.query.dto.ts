import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import type { QuotationStatusFilter } from '../../domain/repositories/quotation.repository';

const STATUS_VALUES: QuotationStatusFilter[] = [
  'PENDIENTE',
  'ACEPTADA',
  'ANULADA',
  'VENCIDA',
];

export class ListQuotationsQueryDto {
  @IsOptional()
  @IsIn(STATUS_VALUES)
  status?: QuotationStatusFilter;

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
