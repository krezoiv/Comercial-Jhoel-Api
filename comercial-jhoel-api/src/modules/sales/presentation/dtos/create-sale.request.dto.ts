import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateSaleItemRequestDto {
  @IsUUID()
  productId: string;

  /** Which presentation `quantity` is expressed in (e.g. "Caja"). Omit to use the product's base "Unidad". */
  @IsOptional()
  @IsUUID()
  presentationId?: string;

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

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsIn(['PUBLIC', 'WHOLESALE'])
  priceList?: 'PUBLIC' | 'WHOLESALE';
}
