import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import type {
  IceCreamPurchaseSortField,
  SortDirection,
} from '../../domain/repositories/ice-cream-purchase.repository';

const SORT_FIELDS: IceCreamPurchaseSortField[] = [
  'purchaseDate',
  'total',
  'createdAt',
];
const SORT_DIRECTIONS: SortDirection[] = ['asc', 'desc'];

export class ListIceCreamPurchasesQueryDto {
  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sortBy?: IceCreamPurchaseSortField;

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
