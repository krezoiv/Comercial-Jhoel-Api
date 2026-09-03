import { IsDateString, IsOptional } from 'class-validator';

export class RechargeDayStatusQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
