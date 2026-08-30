import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import type {
  PurchaseSortField,
  SortDirection,
} from '../../domain/repositories/purchase.repository';

const SORT_FIELDS: PurchaseSortField[] = ['purchaseDate', 'total', 'createdAt'];
const SORT_DIRECTIONS: SortDirection[] = ['asc', 'desc'];

export class ListPurchasesQueryDto {
  @IsOptional()
  @IsUUID()
  supplierId?: string;

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
