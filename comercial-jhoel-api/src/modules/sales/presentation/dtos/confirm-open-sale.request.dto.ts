import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ConfirmOpenSaleRequestDto {
  /** Which of the caller's (possibly several) open receipts/tabs to confirm — an opaque, client-generated id, not required to be a UUID (see `AdjustSaleItemRequestDto`'s own doc comment for why). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  draftKey: string;

  /** Free-text folio — optional, never enforced as unique. */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  invoiceNumber?: string;
}
