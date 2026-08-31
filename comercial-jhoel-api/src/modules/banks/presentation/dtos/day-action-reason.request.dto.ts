import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/** Compartido por "Reabrir Día" y "Anular Día" — ambos exigen un motivo obligatorio, no vacío. */
export class DayActionReasonRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Debe indicar un motivo.' })
  @MinLength(5, { message: 'El motivo debe tener al menos 5 caracteres.' })
  @MaxLength(500)
  reason: string;
}
