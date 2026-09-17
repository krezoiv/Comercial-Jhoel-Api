import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CatalogPhoneExtraSpecDto } from './catalog-phone-extra-spec.dto';

/** No `isActive`/`isPublished`/`sortOrder` here — a phone is always created inactive-for-publishing-purposes (`isPublished: false`) and gets those via their own dedicated endpoints (`publish`/`unpublish`/`reorder`), never via create/update. */
export class CreateCatalogPhoneRequestDto {
  @IsString()
  @MinLength(1, { message: 'La marca es obligatoria.' })
  @MaxLength(80)
  brand: string;

  @IsString()
  @MinLength(1, { message: 'El modelo es obligatorio.' })
  @MaxLength(150)
  model: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  screen?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  ram?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  storage?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  camera?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  battery?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  processor?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  operatingSystem?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => CatalogPhoneExtraSpecDto)
  extraSpecs?: CatalogPhoneExtraSpecDto[];
}
