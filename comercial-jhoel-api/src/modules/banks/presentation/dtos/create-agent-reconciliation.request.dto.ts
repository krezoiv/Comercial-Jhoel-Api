import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

/**
 * Deliberately just these two fields — `totalBanks`/`totalAssets`/
 * `totalAccountsReceivable`/`result` are never accepted from the client
 * (see `CreateAgentReconciliationUseCase`), and the global `ValidationPipe`'s
 * `forbidNonWhitelisted` rejects a request body that includes them with a
 * 400 before this DTO's own decorators even run, closing off any
 * "send it anyway and hope it's used" manipulation path.
 */
export class CreateAgentReconciliationRequestDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalCash: number;

  /** Plain calendar date (yyyy-MM-dd). Omitted = today, server-computed. */
  @IsOptional()
  @IsDateString()
  date?: string;
}
