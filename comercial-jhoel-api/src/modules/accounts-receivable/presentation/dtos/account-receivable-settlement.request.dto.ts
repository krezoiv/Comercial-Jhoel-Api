import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { SETTLEMENT_PAYMENT_METHODS } from '../../domain/repositories/account-receivable-settlement.repository';
import type { SettlementPaymentMethod } from '../../domain/repositories/account-receivable-settlement.repository';

const MAX_AMOUNT = 99_999_999.99;

/** One selected account. `amount` omitted = its full pending (computed in PostgreSQL). */
export class SettlementItemRequestDto {
  @IsUUID()
  accountReceivableId: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(MAX_AMOUNT)
  amount?: number;
}

/** "Resumen" before confirming — no write. */
export class PreviewSettlementRequestDto {
  @IsUUID()
  clientId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => SettlementItemRequestDto)
  items: SettlementItemRequestDto[];

  @IsIn(SETTLEMENT_PAYMENT_METHODS)
  paymentMethod: SettlementPaymentMethod;

  @ValidateIf(
    (dto: PreviewSettlementRequestDto) =>
      dto.paymentMethod === 'DEPOSITO_BANCARIO',
  )
  @IsUUID()
  bankId?: string;
}

/** Cancel one or several accounts of the same client (cash or bank deposit). */
export class SettleAccountsReceivableRequestDto extends PreviewSettlementRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observations?: string;

  /** The total shown to the user; PostgreSQL rejects the operation if it computes a different one. */
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(MAX_AMOUNT)
  expectedTotal: number;

  /** One per modal opening: a double click or retry returns the same operation. */
  @IsOptional()
  @IsUUID()
  clientRequestId?: string;
}

export class VoidSettlementRequestDto {
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  reason: string;
}

export class ListSettlementsQueryDto {
  @IsOptional() @IsUUID() clientId?: string;
  @IsOptional() @IsIn(['APLICADO', 'ANULADO']) status?: 'APLICADO' | 'ANULADO';
  @IsOptional()
  @IsIn(SETTLEMENT_PAYMENT_METHODS)
  paymentMethod?: SettlementPaymentMethod;
  @IsOptional() @IsDateString() dateFrom?: string;
  @IsOptional() @IsDateString() dateTo?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}
