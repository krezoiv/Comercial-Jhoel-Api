import { Transform, Type } from 'class-transformer';
import { IsArray, IsDateString, IsIn, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import type { IceCreamReportType } from '../../application/dtos/ice-cream-report-output';

const TYPE_VALUES: IceCreamReportType[] = ['sales', 'purchases'];

/** Shared across every ice-cream-report route (`GET /reports/ice-cream`, `/summary`, `/export`). */
export class IceCreamReportFilterQueryDto {
  /** Comma-separated in the query string (`types=sales,purchases`) — the use case itself rejects an empty selection with `NoIceCreamMovementTypeSelectedError`, never trusting the frontend alone. */
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',').filter(Boolean) : value))
  @IsArray()
  @IsIn(TYPE_VALUES, { each: true })
  types?: IceCreamReportType[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  iceCreamId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

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
