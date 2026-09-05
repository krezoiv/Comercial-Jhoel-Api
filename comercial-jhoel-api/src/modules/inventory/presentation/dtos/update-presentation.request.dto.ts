import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
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

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
