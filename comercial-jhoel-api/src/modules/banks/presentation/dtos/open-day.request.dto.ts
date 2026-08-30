import { IsDateString, IsOptional } from 'class-validator';

/** Omitida = hoy, resuelta en el controlador. */
export class OpenDayRequestDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
