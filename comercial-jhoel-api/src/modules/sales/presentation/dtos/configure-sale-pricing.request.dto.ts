import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class ConfigureSalePricingRequestDto {
  /** Omit or send null to clear the client. */
  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @IsUUID()
  clientId?: string | null;

  @IsIn(['PUBLIC', 'WHOLESALE'])
  priceList: 'PUBLIC' | 'WHOLESALE';

  /** Which of the caller's (possibly several) open receipts/tabs this targets — an opaque, client-generated id, not required to be a UUID (see `AdjustSaleItemRequestDto`'s own doc comment for why). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  draftKey: string;
}
