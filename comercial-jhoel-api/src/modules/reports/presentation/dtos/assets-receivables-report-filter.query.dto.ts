import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import type { AssetsReceivablesReportType } from '../../application/dtos/assets-receivables-report-output';
import type { ReportStatusFilter } from '../../application/utils/parse-report-status';

const TYPE_VALUES: AssetsReceivablesReportType[] = [
  'assets',
  'accounts_receivable',
];
const STATUS_VALUES: ReportStatusFilter[] = ['all', 'active', 'inactive'];

/** Shared across every assets-receivables-report route (`GET /reports/assets-receivables`, `/summary`, `/export`). */
export class AssetsReceivablesReportFilterQueryDto {
  /** Comma-separated in the query string (`types=assets,accounts_receivable`) — the use case itself rejects an empty selection with `NoReportTypeSelectedError`, never trusting the frontend to have enforced "at least one". */
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').filter(Boolean) : value,
  )
  @IsArray()
  @IsIn(TYPE_VALUES, { each: true })
  types?: AssetsReceivablesReportType[];

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsIn(STATUS_VALUES)
  status?: ReportStatusFilter;

  @IsOptional()
  @IsString()
  search?: string;

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
