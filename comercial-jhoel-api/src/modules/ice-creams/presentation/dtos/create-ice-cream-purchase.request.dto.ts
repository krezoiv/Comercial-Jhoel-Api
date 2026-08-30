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

export class CreateIceCreamPurchaseItemRequestDto {
  @IsUUID()
  iceCreamId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costPrice: number;
}

export class CreateIceCreamPurchaseRequestDto {
  @IsUUID()
  supplierId: string;

  /** ISO date string — the backend stores exactly this, never re-derives "today" from the request time. */
  @IsDateString()
  purchaseDate: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'La compra debe contener al menos un helado.' })
  @ValidateNested({ each: true })
  @Type(() => CreateIceCreamPurchaseItemRequestDto)
  items: CreateIceCreamPurchaseItemRequestDto[];
}
