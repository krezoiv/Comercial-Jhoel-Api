import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

/** Commercial actions any operator may run on a quotation they can see. */
export const QUOTATION_OPERATOR_ACTIONS = [
  'CONFIRMAR',
  'ACEPTAR',
  'RECHAZAR',
] as const;

export class QuotationStatusRequestDto {
  @IsIn(QUOTATION_OPERATOR_ACTIONS)
  action: (typeof QUOTATION_OPERATOR_ACTIONS)[number];

  /** Required (≥ 5 characters) to reject; the SQL function validates it. */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
