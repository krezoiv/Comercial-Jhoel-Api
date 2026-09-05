import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/** Mirrors `VoidTicketRequestDto`'s own mandatory-reason shape — this module's own copy rather than a cross-module import. */
export class VoidQuotationRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Debe indicar un motivo.' })
  @MinLength(5, { message: 'El motivo debe tener al menos 5 caracteres.' })
  @MaxLength(255)
  reason: string;
}
