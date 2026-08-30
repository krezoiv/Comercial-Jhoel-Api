import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import type {
  SaleSortField,
  SortDirection,
} from '../../domain/repositories/sale.repository';

const SORT_FIELDS: SaleSortField[] = ['saleDate', 'total', 'createdAt'];
const SORT_DIRECTIONS: SortDirection[] = ['asc', 'desc'];

export class ListSalesQueryDto {
  /** ADMIN/SUPER_ADMIN only — the use case ignores this for a non-admin caller. */
  @IsOptional()
  @IsUUID()
  userId?: string;

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
