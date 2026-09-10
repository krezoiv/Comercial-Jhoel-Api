import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/** Same mandatory-reason shape as `VoidCashBoxMovementRequestDto`/`VoidBankDepositOperationRequestDto` — kept as this module's own copy rather than a cross-module import. */
export class VoidRechargePurchaseRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Debe indicar un motivo.' })
  @MinLength(5, { message: 'El motivo debe tener al menos 5 caracteres.' })
  @MaxLength(500)
  reason: string;
}
