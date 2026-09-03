import { IsDateString, IsOptional } from 'class-validator';

/** Omitted = today, resolved in the controller. */
export class DayStatusQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
