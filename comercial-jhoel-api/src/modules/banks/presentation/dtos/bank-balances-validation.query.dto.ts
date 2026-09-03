import { IsDateString, IsOptional } from 'class-validator';

/** Omitted = today, resolved in the controller (the same `todayIsoDate()` already used by `AgentReconciliationsController`). */
export class BankBalancesValidationQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
