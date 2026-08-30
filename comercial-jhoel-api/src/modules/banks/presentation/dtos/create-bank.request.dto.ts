import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBankRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  /**
   * Deliberately validated as a plain string, never `@IsNumberString()` /
   * `@Type(() => Number)` — this is an identifier (leading zeros, dashes
   * are significant), not a numeric value. Never parse it as a number
   * anywhere in this pipeline.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(34)
  accountNumber: string;

  @IsUUID()
  accountTypeId: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  previousBalance?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  finalBalance?: number;
}
