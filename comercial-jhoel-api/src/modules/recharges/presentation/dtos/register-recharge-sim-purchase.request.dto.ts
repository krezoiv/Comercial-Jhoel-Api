import { IsDateString, IsInt, IsUUID, Min } from 'class-validator';

export class RegisterRechargeSimPurchaseRequestDto {
  @IsUUID()
  simTypeId: string;

  /** SIM units are discrete physical items — an integer, never a decimal amount. */
  @IsInt()
  @Min(1)
  quantity: number;

  /** `yyyy-MM-dd` — the day this purchase is credited to; the use case still rejects anything past `maxAllowedOperationDate()`. */
  @IsDateString()
  operationDate: string;
}
