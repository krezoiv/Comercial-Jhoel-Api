import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  /** Barcode. Optional, unique among active products (checked in the use case). */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  @Matches(/^[a-zA-Z0-9-]+$/, {
    message: 'sku solo puede contener letras, números y guiones',
  })
  sku?: string;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  businessId: string;

  @IsUUID()
  unitOfMeasureId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  costPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  publicPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  wholesalePrice: number;

  @IsInt()
  @Min(0)
  stock: number;
}
