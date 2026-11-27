import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import {
  PORTFOLIO_PAYMENT_METHODS,
  type PortfolioPaymentMethod,
} from '../../../../shared/domain/portfolio-record';

export class UpdateAccountReceivableRequestDto {
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'El monto debe ser mayor a cero.' })
  amount?: number;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  /** EFECTIVO (default) moves Caja; BANCO never does. */
  @IsOptional()
  @IsIn(PORTFOLIO_PAYMENT_METHODS, {
    message: 'Seleccione si fue en efectivo o por banco.',
  })
  paymentMethod?: PortfolioPaymentMethod;
  /** Mandatory (≥5) when amount or payment method change: goes to the history and the Caja reversal. */
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
