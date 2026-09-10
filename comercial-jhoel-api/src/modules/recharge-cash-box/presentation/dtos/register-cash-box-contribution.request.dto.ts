import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterCashBoxContributionRequestDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'Debe indicar un concepto u observación.' })
  @MinLength(3, { message: 'El concepto debe tener al menos 3 caracteres.' })
  @MaxLength(255)
  concept: string;

  /** `yyyy-MM-dd` — defaults to today if omitted; the use case still rejects anything past `maxAllowedOperationDate()`. */
  @IsOptional()
  @IsDateString()
  businessDate?: string;
}
