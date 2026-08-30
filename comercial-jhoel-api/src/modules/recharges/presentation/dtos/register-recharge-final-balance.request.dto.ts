import { IsNumber, Min } from 'class-validator';

export class RegisterRechargeFinalBalanceRequestDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  finalBalance: number;
}
