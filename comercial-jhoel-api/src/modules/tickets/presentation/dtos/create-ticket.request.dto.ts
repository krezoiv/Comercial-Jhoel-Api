import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateTicketItemRequestDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  /** Optional free-text note for this line (e.g. "sin hielo"), independent of the ticket's own reason/void fields. */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  observation?: string;

  /**
   * Optional manual price override for this line, e.g. a discount negotiated
   * at the counter. Only ever written into this ticket's own frozen
   * `ticket_details.unit_price` snapshot — never back into the product's
   * real `public_price`. Omitted/undefined falls back to the product's
   * current live price, same as before this field existed.
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}

export class CreateTicketRequestDto {
  /** A ticket's client is optional — unlike a Cotización, which always requires one. */
  @IsOptional()
  @IsUUID()
  clientId?: string;

  /**
   * Free-text client name — not a `clients` catalog reference. Never sent
   * together with `clientId` by the frontend (Tickets stopped using the
   * client search/select entirely), but both are independently optional:
   * a ticket may have neither, either, or (if some future caller sends
   * both) `clientId` wins — see `CreateTicketUseCase`.
   */
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(150, {
    message: 'El nombre del cliente no puede exceder 150 caracteres.',
  })
  clientName?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'El ticket debe contener al menos un producto.' })
  @ValidateNested({ each: true })
  @Type(() => CreateTicketItemRequestDto)
  items: CreateTicketItemRequestDto[];
}
