import { IsInt, IsUUID } from 'class-validator';

export class AdjustSaleItemRequestDto {
  @IsUUID()
  productId: string;

  /** Positive to add/increase this line's quantity, negative to decrease/remove it. Never 0. */
  @IsInt()
  quantityDelta: number;
}
