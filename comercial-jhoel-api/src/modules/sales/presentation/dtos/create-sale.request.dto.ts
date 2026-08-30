import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateSaleItemRequestDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateSaleRequestDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'La venta debe contener al menos un producto.' })
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemRequestDto)
  items: CreateSaleItemRequestDto[];
}
