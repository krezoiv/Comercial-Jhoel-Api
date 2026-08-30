import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateIceCreamSaleItemRequestDto {
  @IsUUID()
  iceCreamId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateIceCreamSaleRequestDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'La venta debe contener al menos un helado.' })
  @ValidateNested({ each: true })
  @Type(() => CreateIceCreamSaleItemRequestDto)
  items: CreateIceCreamSaleItemRequestDto[];
}
