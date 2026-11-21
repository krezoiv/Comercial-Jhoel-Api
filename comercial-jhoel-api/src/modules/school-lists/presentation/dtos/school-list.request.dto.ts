import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  QUOTATION_SORT_FIELDS,
  SCHOOL_PAYMENT_METHODS,
  SCHOOL_QUOTATION_STATUSES,
  SCHOOL_STATUS_ACTIONS,
  SCHOOL_SUPPLY_STATUSES,
} from '../../domain/repositories/school-list.repository';
import type {
  QuotationSortField,
  SchoolPaymentMethod,
  SchoolQuotationStatus,
  SchoolStatusAction,
  SchoolSupplyStatus,
} from '../../domain/repositories/school-list.repository';

const MAX_MONEY = 999999.99;
const MAX_LINES = 300;
const PHONE = /^[+0-9 ()-]{8,20}$/;

// ── Templates ─────────────────────────────────────────────────────────────
export class TemplateItemRequestDto {
  @IsOptional() @IsUUID() productId?: string | null;
  @IsString() @MinLength(2) @MaxLength(300) productName: string;
  @IsOptional() @IsString() @MaxLength(255) description?: string | null;
  @IsInt() @Min(1) @Max(9999) quantity: number;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(MAX_MONEY) unitPrice: number;
  @IsOptional() @IsString() @MaxLength(255) observations?: string | null;
}

export class SaveTemplateRequestDto {
  @IsString() @MinLength(3) @MaxLength(120) name: string;
  @IsString() @MinLength(3) @MaxLength(60) grade: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;

  @IsArray()
  @ArrayMaxSize(MAX_LINES)
  @ValidateNested({ each: true })
  @Type(() => TemplateItemRequestDto)
  items: TemplateItemRequestDto[];

  /** Version read before editing (required on update; ignored on create). */
  @IsOptional() @IsInt() @Min(1) version?: number;
}

export class TemplateStatusRequestDto {
  @IsBoolean() isActive: boolean;
}

export class DuplicateTemplateRequestDto {
  @IsString() @MinLength(3) @MaxLength(120) name: string;
  @IsOptional() @IsString() @MinLength(3) @MaxLength(60) grade?: string;
}

export class TemplatesQueryDto {
  @IsOptional()
  @Type(() => String)
  @IsIn(['true', 'false'])
  includeInactive?: 'true' | 'false';
}

// ── Quotations ────────────────────────────────────────────────────────────
export class QuotationItemRequestDto {
  @IsOptional() @IsUUID() itemId?: string | null;
  @IsOptional() @IsUUID() templateItemId?: string | null;
  @IsOptional() @IsUUID() productId?: string | null;
  @IsString() @MinLength(2) @MaxLength(300) productName: string;
  @IsOptional() @IsString() @MaxLength(255) description?: string | null;
  @IsInt() @Min(1) @Max(9999) quantity: number;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(MAX_MONEY) unitPrice: number;
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(MAX_MONEY)
  discount?: number;
  @IsOptional() @IsString() @MaxLength(255) observations?: string | null;
}

export class PaymentRequestDto {
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0.01) @Max(MAX_MONEY) amount: number;
  @IsIn(SCHOOL_PAYMENT_METHODS) paymentMethod: SchoolPaymentMethod;
  @IsOptional() @IsUUID() bankId?: string | null;
  @IsOptional() @IsString() @MaxLength(60) reference?: string | null;
  @IsOptional() @IsString() @MaxLength(500) observations?: string | null;
}

class QuotationBodyDto {
  @IsString() @MinLength(3) @MaxLength(150) customerName: string;
  @IsString()
  @Matches(PHONE, { message: 'customerPhone no es un teléfono válido' })
  customerPhone: string;
  @IsOptional() @IsString() @MaxLength(150) studentName?: string | null;
  @IsOptional() @IsDateString({ strict: true }) quotationDate?: string;
  @IsOptional() @IsDateString({ strict: true }) deliveryDate?: string | null;
  @IsOptional() @IsString() @MaxLength(1000) observations?: string | null;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_LINES)
  @ValidateNested({ each: true })
  @Type(() => QuotationItemRequestDto)
  items: QuotationItemRequestDto[];
}

export class CreateQuotationRequestDto extends QuotationBodyDto {
  @IsOptional() @IsUUID() templateId?: string | null;
  /** Grade of a quotation built without a template. */
  @IsOptional() @IsString() @MinLength(3) @MaxLength(60) grade?: string;
  /** Save as BORRADOR (no payments until confirmed). */
  @IsOptional() @IsBoolean() asDraft?: boolean;

  /** Optional anticipo registered in the same transaction. */
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentRequestDto)
  advance?: PaymentRequestDto | null;

  /** One per form opening: a double click or retry returns the same quotation. */
  @IsUUID() clientRequestId: string;
}

export class UpdateQuotationRequestDto extends QuotationBodyDto {
  @IsInt() @Min(1) version: number;
}

// ── Preparation (requirements → inventory products) ──────────────────────
export class PreparationAssignmentRequestDto {
  @IsUUID() itemId: string;
  @IsUUID() productId: string;
  @IsInt() @Min(1) @Max(9999) quantity: number;
}

export class SavePreparationRequestDto {
  @IsInt() @Min(1) version: number;

  @IsArray()
  @ArrayMaxSize(1000)
  @ValidateNested({ each: true })
  @Type(() => PreparationAssignmentRequestDto)
  assignments: PreparationAssignmentRequestDto[];
}

export class PurgeQuotationsRequestDto {
  @IsString() @MaxLength(20) confirmation: string;
}

export class ObservationsRequestDto {
  @IsOptional() @IsString() @MaxLength(1000) observations?: string | null;
  @IsInt() @Min(1) version: number;
}

export class StatusActionRequestDto {
  @IsIn(SCHOOL_STATUS_ACTIONS) action: SchoolStatusAction;
  @IsOptional() @IsInt() @Min(1) version?: number;
}

/** "Devolver a cotización" (audited correction of a list accepted by mistake). */
export class RevertToQuoteRequestDto {
  @IsString() @MinLength(5) @MaxLength(255) reason: string;
  @IsOptional() @IsInt() @Min(1) version?: number;
}

export class RegisterPaymentRequestDto extends PaymentRequestDto {
  @IsUUID() clientRequestId: string;
}

export class VoidPaymentRequestDto {
  @IsString() @MinLength(5) @MaxLength(500) reason: string;
  @IsUUID() clientRequestId: string;
}

export class CancelQuotationRequestDto {
  @IsString() @MinLength(5) @MaxLength(500) reason: string;
  @IsOptional()
  @IsIn(SCHOOL_PAYMENT_METHODS)
  refundMethod?: SchoolPaymentMethod;
  @IsOptional() @IsUUID() bankId?: string | null;
  @IsOptional() @IsString() @MaxLength(60) reference?: string | null;
  @IsUUID() clientRequestId: string;
}

export class QuotationsQueryDto {
  @IsOptional() @IsString() @MaxLength(100) search?: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
  @IsOptional() @IsString() @MaxLength(20) number?: string;
  @IsOptional() @IsString() @MaxLength(60) grade?: string;
  @IsOptional() @IsIn(SCHOOL_QUOTATION_STATUSES) status?: SchoolQuotationStatus;
  /** "Aceptadas sin pagos" (review of lists accepted before migration 1760009000000). */
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  acceptedWithoutPayments?: boolean;
  @IsOptional() @IsIn(SCHOOL_SUPPLY_STATUSES) supplyStatus?: SchoolSupplyStatus;
  @IsOptional() @IsDateString({ strict: true }) dateFrom?: string;
  @IsOptional() @IsDateString({ strict: true }) dateTo?: string;
  /** Column to order by; only the whitelisted names reach the repository. */
  @IsOptional() @IsIn(QUOTATION_SORT_FIELDS) sortBy?: QuotationSortField;
  @IsOptional() @IsIn(['asc', 'desc']) sortDirection?: 'asc' | 'desc';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}

export class SupplyProductsQueryDto {
  @IsOptional() @IsString() @MaxLength(100) search?: string;
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsDateString({ strict: true }) dateFrom?: string;
  @IsOptional() @IsDateString({ strict: true }) dateTo?: string;
  @IsOptional() @IsString() @MaxLength(20) quotationNumber?: string;
  @IsOptional() @IsIn(['PENDIENTE', 'PARCIAL', 'ABASTECIDO']) status?:
    'PENDIENTE' | 'PARCIAL' | 'ABASTECIDO';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}

export class SupplyPurchasesQueryDto {
  @IsOptional() @IsUUID() purchaseId?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}

export class SupplySettingsRequestDto {
  @IsIn(['FIFO_AUTO', 'MANUAL']) allocationMode: 'FIFO_AUTO' | 'MANUAL';
}

export class SupplyFifoRequestDto {
  /** Omit to hand out free units of every product with pending lists. */
  @IsOptional() @IsUUID() productId?: string;
}

export class ManualAllocationRequestDto {
  @IsUUID() quotationId: string;
  @IsUUID() productId: string;
  @IsInt() @Min(1) @Max(9999) quantity: number;
  /** Take the units from this purchase (traceability); omit for stock on hand. */
  @IsOptional() @IsUUID() purchaseId?: string;
  @IsUUID() clientRequestId: string;
}

export class DispatchRequestDto {
  @IsOptional() @IsString() @MaxLength(500) observations?: string;
  @IsUUID() clientRequestId: string;
}

export class StockQueryDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.split(',').filter(Boolean) : value,
  )
  @IsArray()
  @ArrayMaxSize(300)
  @IsUUID('all', { each: true })
  productIds: string[];
}

export class DashboardQueryDto {
  @IsOptional() @IsDateString({ strict: true }) dateFrom?: string;
  @IsOptional() @IsDateString({ strict: true }) dateTo?: string;
}
