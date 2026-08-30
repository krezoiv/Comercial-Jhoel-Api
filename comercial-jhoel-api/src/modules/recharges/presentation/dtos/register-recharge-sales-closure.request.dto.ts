import { IsDateString, IsNumber, Min } from 'class-validator';

export class RegisterRechargeSalesClosureRequestDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalCollected: number;

  /** `yyyy-MM-dd` — the day this cuadre is for; the use case still rejects anything past `maxAllowedOperationDate()`. */
  @IsDateString()
  operationDate: string;
}
