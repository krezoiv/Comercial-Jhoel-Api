import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  NotEquals,
} from 'class-validator';

export class CreateAssetRequestDto {
  @IsUUID()
  clientId: string;

  /** Plain calendar date (yyyy-MM-dd) — stored exactly as received, never re-derived from server time. */
  @IsDateString()
  date: string;

  /**
   * Deliberately no `@Min(...)` here — Activos is the one screen in this
   * app whose monto may be negative (e.g. a correcting/reversing entry),
   * per an explicit, scoped request. Every other module's amount field
   * (Cuentas por Cobrar, Compras, Ventas, Recargas, ...) keeps its own
   * positive-only `@Min(...)` untouched; this DTO is the only one that
   * changed. `NotEquals(0)` still rules out the one value that's never a
   * meaningful monto either way.
   */
  @IsNumber({ maxDecimalPlaces: 2 })
  @NotEquals(0, { message: 'El monto no puede ser cero.' })
  amount: number;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
