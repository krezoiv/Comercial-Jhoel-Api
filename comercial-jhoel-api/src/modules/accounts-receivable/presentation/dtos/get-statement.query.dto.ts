import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';
import { toOptionalBoolean } from '../../../../shared/presentation/dtos/portfolio-record.request.dto';

export class GetStatementQueryDto {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  /** Voided rows are shown (struck through, with their reason) unless `false`. */
  @Transform(toOptionalBoolean)
  @IsOptional()
  @IsBoolean()
  includeVoided?: boolean;
}
