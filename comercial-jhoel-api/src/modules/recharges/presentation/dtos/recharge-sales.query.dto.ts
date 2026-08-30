import { IsDateString, IsOptional } from 'class-validator';

export class RechargeSalesQueryDto {
  /** `yyyy-MM-dd` — defaults to today (server-computed) when omitted. */
  @IsOptional()
  @IsDateString()
  date?: string;
}
