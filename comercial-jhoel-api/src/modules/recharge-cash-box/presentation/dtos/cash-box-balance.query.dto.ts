import { IsDateString, IsOptional } from 'class-validator';

export class CashBoxBalanceQueryDto {
  /** `yyyy-MM-dd` — defaults to today (business date, America/Guatemala) if omitted. */
  @IsOptional()
  @IsDateString()
  date?: string;
}
