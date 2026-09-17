import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class ReorderCatalogProductItemDto {
  @IsUUID()
  id: string;

  @IsInt()
  @Min(0)
  sortOrder: number;
}

export class ReorderCatalogProductsRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => ReorderCatalogProductItemDto)
  items: ReorderCatalogProductItemDto[];
}
