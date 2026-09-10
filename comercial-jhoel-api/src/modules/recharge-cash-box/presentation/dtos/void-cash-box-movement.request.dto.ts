import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/** Mirrors `VoidBankDepositOperationRequestDto` — same mandatory-reason shape, kept as this module's own copy rather than a cross-module import. Works for either movement type. */
export class VoidCashBoxMovementRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Debe indicar un motivo.' })
  @MinLength(5, { message: 'El motivo debe tener al menos 5 caracteres.' })
  @MaxLength(500)
  reason: string;
}
