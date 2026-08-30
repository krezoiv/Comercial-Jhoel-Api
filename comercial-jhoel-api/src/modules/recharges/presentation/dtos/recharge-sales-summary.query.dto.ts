import { IsDateString, IsOptional } from 'class-validator';

export class RechargeSalesSummaryQueryDto {
  /** `yyyy-MM-dd` — defaults to today (server-computed) when omitted. */
  @IsOptional()
  @IsDateString()
  date?: string;
}
