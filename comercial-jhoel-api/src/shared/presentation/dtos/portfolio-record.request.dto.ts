import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';
import {
  MAX_CHANGE_REASON_LENGTH,
  MIN_CHANGE_REASON_LENGTH,
} from '../../domain/portfolio-record';

/** Body of DELETE /accounts-receivable/:id and DELETE /assets/:id: the reason is mandatory. */
export class VoidPortfolioRecordRequestDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
  )
  @IsString()
  @MinLength(MIN_CHANGE_REASON_LENGTH, {
    message: 'Indique el motivo (mínimo 5 caracteres).',
  })
  @MaxLength(MAX_CHANGE_REASON_LENGTH)
  reason: string;
}

/** `?includeVoided=false` hides voided rows of a client statement (they are shown by default). */
export const toOptionalBoolean = ({ value }: { value: unknown }): unknown =>
  value === 'true' ? true : value === 'false' ? false : value;
