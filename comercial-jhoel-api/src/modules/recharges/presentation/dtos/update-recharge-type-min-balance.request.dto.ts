import { IsNumber, Min } from 'class-validator';

export class UpdateRechargeTypeMinBalanceRequestDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minBalance: number;
}
