import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateQuotationItemRequestDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @Min(0)
  discount?: number;
}

export class CreateQuotationRequestDto {
  /** A quotation's client is always required — unlike a Ticket's optional one. */
  @IsUUID()
  clientId: string;

  /** `yyyy-MM-dd` — validated against today both here (fast pre-check, `InvalidExpirationDateError`) and inside `create_quotation()` itself. */
  @IsDateString({ strict: true })
  expirationDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observations?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  commercialTerms?: string;

  @IsArray()
  @ArrayMinSize(1, {
    message: 'La cotización debe contener al menos un producto.',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationItemRequestDto)
  items: CreateQuotationItemRequestDto[];
}
