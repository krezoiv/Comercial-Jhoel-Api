import { IsInt, Min } from 'class-validator';

export class UpdateAlertSettingsRequestDto {
  @IsInt()
  @Min(0)
  purchasePaymentAlertDays: number;
}
