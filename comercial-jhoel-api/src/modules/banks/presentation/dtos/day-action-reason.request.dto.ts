import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/** Shared by "Reabrir Día" and "Anular Día" — both require a mandatory, non-empty reason. */
export class DayActionReasonRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Debe indicar un motivo.' })
  @MinLength(5, { message: 'El motivo debe tener al menos 5 caracteres.' })
  @MaxLength(500)
  reason: string;
}
