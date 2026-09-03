import { IsDateString, IsOptional } from 'class-validator';

/** Omitted = today, resolved in the controller. */
export class CloseRechargeDayRequestDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
