import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdatePresentationRequestDto {
  @IsOptional()
  @IsUUID()
  presentationTypeId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  conversionFactor?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costPrice?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  publicPrice?: number;

  /** Send an empty string to clear it. */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  barcode?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
