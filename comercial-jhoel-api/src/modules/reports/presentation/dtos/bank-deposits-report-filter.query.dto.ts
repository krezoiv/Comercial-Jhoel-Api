import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/** Shared across every bank-deposits-report route (`GET /reports/bank-deposits`, `/summary`, `/export`) — each use case only reads the fields it actually needs. */
export class BankDepositsReportFilterQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  transactionBankId?: string;

  @IsOptional()
  @IsUUID()
  transactionTypeId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  /** Search by beneficiary/description, client, transaction type or bank (accent/case-insensitive). */
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
  @Max(200)
  limit?: number;
}
