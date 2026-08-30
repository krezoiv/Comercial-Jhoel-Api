import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateClientRequestDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
  )
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El nombre del cliente es obligatorio.' })
  @MinLength(2, {
    message: 'El nombre del cliente debe tener al menos 2 caracteres.',
  })
  @MaxLength(150, {
    message: 'El nombre del cliente no puede superar los 150 caracteres.',
  })
  name?: string;
}
