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

export class CreateAccountReceivableRequestDto {
  @IsUUID()
  clientId: string;

  /** Plain calendar date (yyyy-MM-dd) — stored exactly as received, never re-derived from server time. */
  @IsDateString()
  date: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'El monto debe ser mayor a cero.' })
  amount: number;

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
}
