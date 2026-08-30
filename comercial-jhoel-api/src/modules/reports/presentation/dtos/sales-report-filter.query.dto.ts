import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import type {
  ReportSortField,
  SortDirection,
} from '../../domain/repositories/sales-report.repository';

const SORT_FIELDS: ReportSortField[] = ['date', 'total'];
const SORT_DIRECTIONS: SortDirection[] = ['asc', 'desc'];

/**
 * Shared across every sales-report route (`GET /reports/sales`, `/summary`,
 * `/by-product`, `/export`) — each use case only reads the fields it
 * actually needs (e.g. `/summary` ignores `page`/`sortBy`), so one DTO
 * covers all four without forcing a route-specific shape for no benefit.
 * No `customerId`/client filter: this system has no customers/clients
 * module yet (verified against the current domain model) — adding an unused
 * query param here would be surface area for a feature that doesn't exist.
 */
export class SalesReportFilterQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  businessId?: string;

  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sortBy?: ReportSortField;

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
