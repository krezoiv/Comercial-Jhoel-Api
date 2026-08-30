import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import type {
  IceCreamSaleSortField,
  SortDirection,
} from '../../domain/repositories/ice-cream-sale.repository';

const SORT_FIELDS: IceCreamSaleSortField[] = ['saleDate', 'total', 'createdAt'];
const SORT_DIRECTIONS: SortDirection[] = ['asc', 'desc'];

export class ListIceCreamSalesQueryDto {
  @IsOptional()
  @IsIn(SORT_FIELDS)
  sortBy?: IceCreamSaleSortField;

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
