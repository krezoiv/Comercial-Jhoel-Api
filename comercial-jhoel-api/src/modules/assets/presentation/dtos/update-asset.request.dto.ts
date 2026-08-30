import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  NotEquals,
} from 'class-validator';

export class UpdateAssetRequestDto {
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  /** No `@Min(...)` — see `CreateAssetRequestDto.amount`'s own comment; this is the one field in the app that may be negative, by explicit scoped request. */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @NotEquals(0, { message: 'El monto no puede ser cero.' })
  amount?: number;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
