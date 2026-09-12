import { IsDateString, IsOptional } from 'class-validator';

export class RechargeSimSalesQueryDto {
  /** `yyyy-MM-dd` — defaults to today (server-computed) when omitted. */
  @IsOptional()
  @IsDateString()
  date?: string;
}
