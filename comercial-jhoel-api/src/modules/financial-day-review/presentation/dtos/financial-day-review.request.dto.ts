import {
  Equals,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  MOVEMENT_SOURCES,
  SNAPSHOT_TARGETS,
} from '../../domain/repositories/financial-day-review.repository';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_VALUE = 9_999_999_999.99;

/** Calendar range (inclusive, ISO dates). */
export class ListFinancialDaysQueryDto {
  @Matches(ISO_DATE)
  from: string;

  @Matches(ISO_DATE)
  to: string;
}

/** Audit trail filter: one day and/or one session. */
export class ListCorrectionsQueryDto {
  @IsOptional()
  @Matches(ISO_DATE)
  date?: string;

  @IsOptional()
  @IsUUID()
  sessionId?: string;
}

/** "ABRIR DÍA PARA REVISIÓN": explicit confirmation + mandatory reason. */
export class OpenFinancialDayReviewRequestDto {
  @Matches(ISO_DATE)
  date: string;

  @IsString()
  @MinLength(5)
  @MaxLength(500)
  reason: string;

  @Equals(true, {
    message: 'Debe confirmar la apertura del día para revisión.',
  })
  confirm: boolean;
}

/** Shared fields of every correction (reason, notes, idempotency key). */
class CorrectionBaseDto {
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  reason: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observations?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(80)
  requestId: string;

  @Equals(true, { message: 'Debe confirmar la corrección.' })
  confirm: boolean;
}

/** Correct a day-owned snapshot value (bank day balance, cuadre total, count, …). */
export class CorrectSnapshotRequestDto extends CorrectionBaseDto {
  @IsIn(Object.keys(SNAPSHOT_TARGETS))
  target: string;

  @IsUUID()
  targetId: string;

  @IsString()
  @MaxLength(60)
  field: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-MAX_VALUE)
  @Max(MAX_VALUE)
  newValue: number;
}

/** Correct a movement's amount through a linked adjustment. */
export class AdjustMovementRequestDto extends CorrectionBaseDto {
  @IsIn(MOVEMENT_SOURCES)
  source: string;

  @IsUUID()
  sourceId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(MAX_VALUE)
  correctedAmount: number;
}

/** Final confirmation of the review close. */
export class CloseFinancialDayReviewRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observations?: string;

  @IsBoolean()
  acceptPendingDifferences: boolean;

  @Equals(true, { message: 'Debe confirmar el cierre de la revisión.' })
  confirm: boolean;
}
