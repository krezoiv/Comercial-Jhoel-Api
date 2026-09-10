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
import type {
  SaleSortField,
  SaleStatusFilter,
  SortDirection,
} from '../../domain/repositories/sale.repository';

const SORT_FIELDS: SaleSortField[] = ['saleDate', 'total', 'createdAt'];
const SORT_DIRECTIONS: SortDirection[] = ['asc', 'desc'];
const STATUS_FILTERS: SaleStatusFilter[] = ['ACTIVE', 'VOIDED'];

export class ListSalesQueryDto {
  /** ADMIN/SUPER_ADMIN only — the use case ignores this for a non-admin caller. */
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  /** Matches against client name OR `invoiceNumber`. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsIn(STATUS_FILTERS)
  status?: SaleStatusFilter;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sortBy?: SaleSortField;

  @IsOptional()
  @IsIn(SORT_DIRECTIONS)
  sortDirection?: SortDirection;

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
