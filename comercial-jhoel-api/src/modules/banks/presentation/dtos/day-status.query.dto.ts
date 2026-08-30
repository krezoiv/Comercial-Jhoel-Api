import { IsDateString, IsOptional } from 'class-validator';

/** Omitida = hoy, resuelta en el controlador. */
export class DayStatusQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
