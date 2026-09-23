import { IsDateString, IsOptional } from 'class-validator';

export class SalesRegisterSummaryQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
