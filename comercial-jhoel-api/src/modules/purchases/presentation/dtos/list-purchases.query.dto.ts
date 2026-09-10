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
  PurchaseSortField,
  PurchaseStatusFilter,
  SortDirection,
} from '../../domain/repositories/purchase.repository';

const SORT_FIELDS: PurchaseSortField[] = ['purchaseDate', 'total', 'createdAt'];
const SORT_DIRECTIONS: SortDirection[] = ['asc', 'desc'];
const STATUS_FILTERS: PurchaseStatusFilter[] = ['ACTIVE', 'VOIDED'];

export class ListPurchasesQueryDto {
  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  /** Matches against supplier name OR `invoiceNumber`. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsIn(STATUS_FILTERS)
  status?: PurchaseStatusFilter;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sortBy?: PurchaseSortField;

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
