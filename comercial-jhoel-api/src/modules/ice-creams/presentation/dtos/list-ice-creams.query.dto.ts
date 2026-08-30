import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import type {
  IceCreamSortField,
  SortDirection,
} from '../../domain/repositories/ice-cream.repository';

const SORT_FIELDS: IceCreamSortField[] = [
  'product',
  'sku',
  'costPrice',
  'publicPrice',
  'stock',
  'createdAt',
];
const SORT_DIRECTIONS: SortDirection[] = ['asc', 'desc'];

export class ListIceCreamsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sortBy?: IceCreamSortField;

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

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeInactive?: boolean;
}
