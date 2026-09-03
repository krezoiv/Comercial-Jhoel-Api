import { IsDateString, IsIn, IsOptional, IsUUID } from 'class-validator';
import type {
  ClosedDayStatus,
  ResultSign,
} from '../../domain/repositories/day-opening.repository';

const STATUSES: ClosedDayStatus[] = ['CLOSED', 'REOPENED', 'CANCELLED'];
const RESULT_SIGNS: ResultSign[] = ['positive', 'negative', 'zero'];

export class ListClosedDaysQueryDto {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsIn(STATUSES)
  status?: ClosedDayStatus;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsIn(RESULT_SIGNS)
  resultSign?: ResultSign;
}
