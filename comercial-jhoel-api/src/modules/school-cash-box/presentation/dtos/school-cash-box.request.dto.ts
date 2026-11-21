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
  ValidateNested,
} from 'class-validator';
import {
  CUSTOMER_SORTS,
  CUSTOMER_VIEWS,
  SCHOOL_CASH_EXIT_DESTINATIONS,
  SCHOOL_CASH_MOVEMENT_TYPES,
} from '../../domain/repositories/school-cash-box.repository';
import type {
  CustomerAccountStatus,
  CustomerSort,
  CustomerView,
  SchoolCashExitDestination,
  SchoolCashMovementType,
  SummaryGranularity,
} from '../../domain/repositories/school-cash-box.repository';

const MAX_AMOUNT = 9_999_999.99;
const DENOMINATIONS = [200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01];

class PagedQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class SchoolCashRangeQueryDto extends PagedQueryDto {
  @IsOptional()
  @IsDateString({ strict: true })
  dateFrom?: string;

  @IsOptional()
  @IsDateString({ strict: true })
  dateTo?: string;
}

export class SchoolCashMovementsQueryDto extends SchoolCashRangeQueryDto {
  @IsOptional()
  @IsIn(SCHOOL_CASH_MOVEMENT_TYPES)
  movementType?: SchoolCashMovementType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsUUID()
  bankId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class SchoolCashReceiptsQueryDto {
  @IsOptional()
  @IsUUID()
  bankId?: string;

  @IsOptional()
  @IsIn(['OPEN', 'ALL'])
  scope?: 'OPEN' | 'ALL';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}

export class SchoolCashReportQueryDto {
  @IsOptional()
  @IsDateString({ strict: true })
  dateFrom?: string;

  @IsOptional()
  @IsDateString({ strict: true })
  dateTo?: string;
}

export class SchoolCashExportQueryDto extends SchoolCashReportQueryDto {
  @IsIn(['pdf', 'xlsx'])
  format: 'pdf' | 'xlsx';
}

export class SchoolCashTransferItemDto {
  @IsUUID()
  movementId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(MAX_AMOUNT)
  amount: number;
}

export class RegisterSchoolCashTransferDto {
  @IsUUID()
  bankId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => SchoolCashTransferItemDto)
  items: SchoolCashTransferItemDto[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  reference?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observations?: string;

  /** One per opened form: a double click or retry returns the same transfer. */
  @IsUUID()
  clientRequestId: string;
}

export class SchoolCashReasonDto {
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  reason: string;
}

export class RegisterSchoolCashExitDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(MAX_AMOUNT)
  amount: number;

  @IsIn(SCHOOL_CASH_EXIT_DESTINATIONS)
  destination: SchoolCashExitDestination;

  @IsOptional()
  @IsUUID()
  bankId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  recipientName?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(500)
  reason: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  reference?: string;

  @IsUUID()
  clientRequestId: string;
}

export class RegisterSchoolCashAdjustmentDto {
  @IsIn(['IN', 'OUT'])
  direction: 'IN' | 'OUT';

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(MAX_AMOUNT)
  amount: number;

  @IsString()
  @MinLength(5)
  @MaxLength(500)
  reason: string;

  @IsUUID()
  clientRequestId: string;
}

export class SchoolCashDenominationDto {
  @IsIn(DENOMINATIONS, { message: 'Denominación no válida.' })
  denomination: number;

  @IsInt()
  @Min(0)
  @Max(100_000)
  quantity: number;
}

export class RegisterSchoolCashCountDto {
  @IsArray()
  @ArrayMaxSize(DENOMINATIONS.length)
  @ValidateNested({ each: true })
  @Type(() => SchoolCashDenominationDto)
  details: SchoolCashDenominationDto[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observations?: string;

  @IsUUID()
  clientRequestId: string;
}

export class SchoolCashSummaryQueryDto {
  @IsOptional()
  @IsDateString({ strict: true })
  dateFrom?: string;

  @IsOptional()
  @IsDateString({ strict: true })
  dateTo?: string;

  @IsOptional()
  @IsIn(['day', 'week', 'month'])
  granularity?: SummaryGranularity;
}

export class SchoolCustomersQueryDto extends SchoolCashRangeQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsIn(CUSTOMER_VIEWS)
  view?: CustomerView;

  @IsOptional()
  @IsIn(['SOLVENTE', 'ABONANDO', 'PENDIENTE', 'COTIZANDO', 'CANCELADO'])
  status?: CustomerAccountStatus;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  grade?: string;

  @IsOptional()
  @IsIn(CUSTOMER_SORTS)
  sort?: CustomerSort;
}

export class SchoolPaymentsQueryDto extends SchoolCashRangeQueryDto {
  @IsOptional()
  @IsIn(['EFECTIVO', 'TRANSFERENCIA', 'DEPOSITO', 'TARJETA', 'OTRO'])
  method?: string;

  @IsOptional()
  @IsIn(['ANTICIPO', 'ABONO', 'DEVOLUCION', 'ANULACION'])
  kind?: string;

  @IsOptional()
  @IsIn(['APLICADO', 'ANULADO'])
  status?: 'APLICADO' | 'ANULADO';

  @IsOptional()
  @IsUUID()
  bankId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
