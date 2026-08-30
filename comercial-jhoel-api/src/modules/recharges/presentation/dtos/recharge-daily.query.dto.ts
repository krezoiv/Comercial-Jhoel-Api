import { IsDateString, IsOptional } from 'class-validator';

export class RechargeDailyQueryDto {
  /** `yyyy-MM-dd` — defaults to today (server-computed) when omitted. */
  @IsOptional()
  @IsDateString()
  date?: string;
}
