import { IsDateString, IsOptional } from 'class-validator';

/** Omitida = hoy, resuelta en el controlador (mismo `todayIsoDate()` que ya usa `AgentReconciliationsController`). */
export class BankBalancesValidationQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
