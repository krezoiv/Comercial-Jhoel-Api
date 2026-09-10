import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
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
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  /** Matches against client name OR `quotationNumber`. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

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
