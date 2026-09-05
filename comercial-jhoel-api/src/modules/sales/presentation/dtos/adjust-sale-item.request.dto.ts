import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class AdjustSaleItemRequestDto {
  @IsUUID()
  productId: string;

  /** Which presentation this line sells in (e.g. "Caja"). Omit to use the product's base "Unidad"/"Vitrina" — the live POS UI doesn't send this yet, so every existing caller keeps today's behavior unchanged. */
  @IsOptional()
  @IsUUID()
  presentationId?: string;

  /** Positive to add/increase this line's quantity, negative to decrease/remove it. Never 0. */
  @IsInt()
  quantityDelta: number;

  /** Which of the caller's (possibly several) open receipts/tabs this targets — an opaque, client-generated id, one per tab. Not required to be a UUID: a pre-existing OPEN sale from before this field existed was backfilled with the literal value `'default'`, which must keep working. */
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  draftKey: string;
}
