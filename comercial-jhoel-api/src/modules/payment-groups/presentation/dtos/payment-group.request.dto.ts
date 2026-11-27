import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  MAX_PAYMENT_GROUP_ITEMS,
  PAYMENT_GROUP_STATUSES,
  type PaymentGroupStatus,
} from '../../domain/payment-group';

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value;

const AMOUNT = { maxDecimalPlaces: 2 } as const;
const AMOUNT_MESSAGE = 'El monto debe ser mayor a cero.';

export class ListPaymentGroupsQueryDto {
  @IsOptional() @IsDateString() dateFrom?: string;
  @IsOptional() @IsDateString() dateTo?: string;
  @IsOptional() @IsUUID() transactionTypeId?: string;
  @IsOptional() @IsIn(PAYMENT_GROUP_STATUSES) status?: PaymentGroupStatus;
  @IsOptional() @IsUUID() createdBy?: string;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(100) search?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) page?: number;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class PaymentGroupItemRequestDto {
  @IsNumber(AMOUNT)
  @Min(0.01, { message: AMOUNT_MESSAGE })
  expectedAmount: number;

  /** Beneficiary or reference of the transaction (optional). */
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(150)
  reference?: string;
}

export class CreatePaymentGroupRequestDto {
  @IsUUID()
  transactionTypeId: string;

  @Transform(trim)
  @IsString()
  @MinLength(3, { message: 'Escriba el nombre o la descripción del grupo.' })
  @MaxLength(200)
  description: string;

  /** Agent bank (not for Génesis types). */
  @IsOptional()
  @IsUUID()
  transactionBankId?: string;

  @IsOptional()
  @IsUUID()
  bankAccountId?: string;

  @IsNumber(AMOUNT)
  @Min(0.01, { message: AMOUNT_MESSAGE })
  authorizedAmount: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Agregue al menos una transacción.' })
  @ArrayMaxSize(MAX_PAYMENT_GROUP_ITEMS)
  @ValidateNested({ each: true })
  @Type(() => PaymentGroupItemRequestDto)
  items: PaymentGroupItemRequestDto[];

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observations?: string;

  /** One per form submission: a retry never creates (or reserves) twice. */
  @IsUUID()
  clientRequestId: string;
}

export class RegisterDeliveryRequestDto {
  /** Amount really handed over (OUT) or received (IN); less than expected = partial. */
  @IsNumber(AMOUNT)
  @Min(0.01, { message: AMOUNT_MESSAGE })
  amount: number;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @IsUUID()
  clientRequestId: string;
}

export class PaymentGroupNoteRequestDto {
  @Transform(trim)
  @IsString()
  @MinLength(3, { message: 'Escriba la observación.' })
  @MaxLength(500)
  note: string;

  /** Omitted for a note about the whole group. */
  @IsOptional()
  @IsUUID()
  itemId?: string;
}

export class NoPaymentRequestDto {
  @Transform(trim)
  @IsString()
  @MinLength(5, {
    message: 'Escriba por qué no se realizó el pago (mínimo 5 caracteres).',
  })
  @MaxLength(500)
  note: string;
}

export class UpdatePaymentGroupItemRequestDto {
  @IsOptional()
  @IsNumber(AMOUNT)
  @Min(0.01, { message: AMOUNT_MESSAGE })
  expectedAmount?: number;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(150)
  reference?: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class ResolveItemRequestDto {
  @Transform(trim)
  @IsString()
  @MinLength(5, { message: 'Documente la resolución (mínimo 5 caracteres).' })
  @MaxLength(255)
  resolution: string;

  /** Give the remaining reservation back to the available cash now (admin). */
  @IsBoolean()
  release: boolean;
}

export class VoidItemRequestDto {
  @Transform(trim)
  @IsString()
  @MinLength(5, { message: 'Indique el motivo (mínimo 5 caracteres).' })
  @MaxLength(255)
  reason: string;

  /** Required true when the transaction was already paid: the money really came back. */
  @IsBoolean()
  moneyReturned: boolean;
}

export class ClosePaymentGroupRequestDto {
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class VoidPaymentGroupRequestDto {
  @Transform(trim)
  @IsString()
  @MinLength(5, { message: 'Indique el motivo (mínimo 5 caracteres).' })
  @MaxLength(255)
  reason: string;
}
