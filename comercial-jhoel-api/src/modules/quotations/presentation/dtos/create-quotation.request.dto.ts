import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsBoolean,
  IsInt,
  IsOptional,
  Matches,
  MinLength,
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
  /** Optional, legacy: a registered client. The form sends the typed-in customer below. */
  @IsOptional()
  @IsUUID()
  clientId?: string;

  /** Customer typed in on the quotation (no `clients` row is created). */
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  customerName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+0-9 ()-]{8,20}$/, {
    message: 'customerPhone no es un teléfono válido',
  })
  customerPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  studentName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  grade?: string;

  /** Save as BORRADOR. */
  @IsOptional()
  @IsBoolean()
  asDraft?: boolean;

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
