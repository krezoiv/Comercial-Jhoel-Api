import { IsDateString, IsOptional } from 'class-validator';

/** Omitted = today, resolved in the controller. */
export class OpenRechargeDayRequestDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
