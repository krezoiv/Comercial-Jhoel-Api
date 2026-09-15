import { IsNumber, Min } from 'class-validator';

export class UpdateRechargeTypeBalanceLimitRequestDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  balanceLimit: number;
}
