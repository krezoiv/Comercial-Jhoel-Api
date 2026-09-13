import { IsInt, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreatePresentationRequestDto {
  @IsUUID()
  presentationTypeId: string;

  @IsInt()
  @Min(1)
  conversionFactor: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  publicPrice: number;

  /** Optional — this presentation's own barcode (e.g. a box's code, distinct from the product's own `sku`). */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  barcode?: string;
}
