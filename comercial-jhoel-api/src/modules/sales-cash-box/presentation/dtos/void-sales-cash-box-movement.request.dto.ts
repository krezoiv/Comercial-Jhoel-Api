import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/** Mirrors `VoidCashBoxMovementRequestDto` (Recargas) — same mandatory-reason shape, this module's own copy. Works for either movement type. */
export class VoidSalesCashBoxMovementRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Debe indicar un motivo.' })
  @MinLength(5, { message: 'El motivo debe tener al menos 5 caracteres.' })
  @MaxLength(500)
  reason: string;
}
