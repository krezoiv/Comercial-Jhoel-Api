import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import type {
  ProductSortField,
  SortDirection,
} from '../../domain/repositories/product.repository';

const SORT_FIELDS: ProductSortField[] = [
  'name',
  'costPrice',
  'publicPrice',
  'wholesalePrice',
  'stock',
  'createdAt',
];
const SORT_DIRECTIONS: SortDirection[] = ['asc', 'desc'];

/**
 * Same filter shape as `ListProductsQueryDto`, minus `page`/`limit` — an
 * export always fetches everything matching the filter (up to its own row
 * cap, see the export use cases), never one paginated slice.
 */
export class ExportProductsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  businessId?: string;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sortBy?: ProductSortField;

  @IsOptional()
  @IsIn(SORT_DIRECTIONS)
  sortDirection?: SortDirection;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeInactive?: boolean;
}
