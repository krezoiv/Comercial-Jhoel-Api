import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePurchaseItemRequestDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  publicPrice: number;
}

export class CreatePurchaseRequestDto {
  @IsUUID()
  supplierId: string;

  /** ISO date string — the backend stores exactly this, never re-derives "today" from the request time. */
  @IsDateString()
  purchaseDate: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'La compra debe contener al menos un producto.' })
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemRequestDto)
  items: CreatePurchaseItemRequestDto[];
}
