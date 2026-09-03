import { IsDateString, IsIn, IsOptional, IsUUID } from 'class-validator';
import type {
  RechargeClosedDayStatus,
  RechargeResultSign,
} from '../../domain/repositories/recharge-day-opening.repository';

const STATUSES: RechargeClosedDayStatus[] = ['CLOSED', 'REOPENED', 'CANCELLED'];
const RESULT_SIGNS: RechargeResultSign[] = ['positive', 'negative', 'zero'];

export class ListRechargeClosedDaysQueryDto {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsIn(STATUSES)
  status?: RechargeClosedDayStatus;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsIn(RESULT_SIGNS)
  resultSign?: RechargeResultSign;
}
