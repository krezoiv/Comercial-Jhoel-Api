import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateIceCreamRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Matches(/^[a-zA-Z0-9-]+$/, {
    message: 'sku solo puede contener letras, números y guiones',
  })
  sku: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  product: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  publicPrice: number;
}
