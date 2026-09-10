import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CreatePurchaseItemRequestDto {
  @IsUUID()
  productId: string;

  /** Which presentation `quantity` is expressed in (e.g. "Caja"). Omit to use the product's base "Unidad" — the conversion factor is always resolved server-side, never trusted from the client. */
  @IsOptional()
  @IsUUID()
  presentationId?: string;

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

  @IsIn(['CONTADO', 'CREDITO'])
  paymentType: 'CONTADO' | 'CREDITO';

  /** ISO date string — required only when `paymentType` is `'CREDITO'` (`@ValidateIf` skips this rule entirely for `'CONTADO'`). `CreatePurchaseUseCase` also ignores any value sent alongside `'CONTADO'` rather than trusting it, matching `confirm_purchase`'s own `CHK_purchases_credit_has_due_date` constraint (a CONTADO purchase always has `payment_due_date = NULL`). */
  @ValidateIf((dto: CreatePurchaseRequestDto) => dto.paymentType === 'CREDITO')
  @IsDateString(
    {},
    { message: 'Debe indicar la fecha de pago para una compra a crédito.' },
  )
  paymentDueDate?: string;

  /** Free-text folio from the supplier's own invoice — optional, never enforced as unique. */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  invoiceNumber?: string;
}
