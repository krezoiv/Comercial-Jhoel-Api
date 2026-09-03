import { IsDateString, IsOptional } from 'class-validator';

/** Omitted = today, resolved in the controller. */
export class OpenDayRequestDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
