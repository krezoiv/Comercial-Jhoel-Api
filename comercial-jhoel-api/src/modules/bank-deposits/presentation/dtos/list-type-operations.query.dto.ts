import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  OPERATION_MODALITIES,
  TYPE_ENTRY_STATUSES,
  type OperationModality,
  type TypeEntryStatus,
} from '../../domain/operation-modality';

/** Filters of "Operaciones de <tipo>": modality next to the usual date / status / user / text filters. */
export class ListTypeOperationsQueryDto {
  @IsOptional()
  @IsIn(OPERATION_MODALITIES)
  modality?: OperationModality;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsIn(TYPE_ENTRY_STATUSES)
  status?: TypeEntryStatus;

  @IsOptional()
  @IsUUID()
  userId?: string;

  /** Description, beneficiary or group code (PG-000025). */
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

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
