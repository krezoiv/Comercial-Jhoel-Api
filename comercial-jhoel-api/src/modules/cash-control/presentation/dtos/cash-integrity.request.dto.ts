import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { INTEGRITY_CLASSIFICATIONS } from '../../domain/cash-integrity';
import type { IntegrityClassification } from '../../domain/cash-integrity';
import { DenominationRequestDto } from './cash-custody.request.dto';

/** Auditoría de efectivo: a bank day (default: current) or a date range. */
export class CashIntegrityQueryDto {
  @IsOptional() @IsDateString({ strict: true }) bankDate?: string;
  @IsOptional() @IsDateString({ strict: true }) dateFrom?: string;
  @IsOptional() @IsDateString({ strict: true }) dateTo?: string;
}

/** "Investigar": the Kardex movements (afterSequence, upToSequence] of one location. */
export class IntegrityMovementsQueryDto {
  @IsOptional() @IsIn(['CAJA', 'BODEGA']) location?: 'CAJA' | 'BODEGA';
  @Type(() => Number) @IsInt() @Min(0) afterSequence: number;
  @Type(() => Number) @IsInt() @Min(0) upToSequence: number;
}

/** Arqueo de apertura: the count plus, when it differs, reason and responsible. */
export class RegisterOpeningCountRequestDto {
  @IsArray()
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => DenominationRequestDto)
  details: DenominationRequestDto[];

  @IsOptional() @IsString() @MaxLength(500) observations?: string;
  /** Mandatory when the count differs from the system (checked in SQL). */
  @IsOptional() @IsString() @MaxLength(255) reason?: string;
  @IsOptional() @IsString() @MaxLength(120) responsible?: string;

  /** One per form opening: a double click or retry returns the same opening. */
  @IsUUID() clientRequestId: string;
}

/** Documented resolution of an arqueo difference (admins). */
export class ResolveDifferenceRequestDto {
  @IsIn(['ARQUEO_CAJA', 'CORTE', 'ARQUEO_BODEGA'])
  source: 'ARQUEO_CAJA' | 'CORTE' | 'ARQUEO_BODEGA';

  @IsUUID() countId: string;

  @IsIn(INTEGRITY_CLASSIFICATIONS) cause: IntegrityClassification;

  @IsString()
  @MinLength(10, {
    message: 'La explicación es obligatoria (mínimo 10 caracteres).',
  })
  @MaxLength(500)
  explanation: string;

  /** Also register the authorized AJUSTE for exactly the counted difference (Caja only). */
  @IsOptional() @IsBoolean() withAdjustment?: boolean;

  @IsUUID() clientRequestId: string;
}
