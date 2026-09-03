import { IsDateString, IsNumber, IsUUID, Min } from 'class-validator';

export class RegisterRechargePurchaseRequestDto {
  @IsUUID()
  rechargeTypeId: string;

  /** "Monto de Compra" — informational only, never affects the running balance. */
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  purchaseAmount: number;

  /** "Monto Acreditado" — the only value that increments `daily_balance`. */
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  creditedAmount: number;

  /** `yyyy-MM-dd` — the day this purchase is credited to; the use case still rejects anything past `maxAllowedOperationDate()`. */
  @IsDateString()
  operationDate: string;
}
