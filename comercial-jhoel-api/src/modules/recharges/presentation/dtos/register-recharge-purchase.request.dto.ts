import { IsDateString, IsNumber, IsUUID, Min } from 'class-validator';

export class RegisterRechargePurchaseRequestDto {
  @IsUUID()
  rechargeTypeId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  /** `yyyy-MM-dd` — the day this purchase is credited to; the use case still rejects anything past `maxAllowedOperationDate()`. */
  @IsDateString()
  operationDate: string;
}
