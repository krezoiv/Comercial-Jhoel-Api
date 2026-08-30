import { ValueTransformer } from 'typeorm';

/**
 * Postgres `numeric` columns are the correct type for money (exact,
 * arbitrary precision — never `float`/`double`, which round). The pg driver
 * returns `numeric` values as strings by default so callers don't silently
 * lose precision; this transformer converts back to `number` on read (our
 * price/stock ranges never approach JS's float precision limits) while the
 * DB itself still stores and computes on the exact decimal value.
 */
export class DecimalColumnTransformer implements ValueTransformer {
  to(value: number | undefined): number | undefined {
    return value;
  }

  from(value: string | null): number | null {
    return value === null ? null : parseFloat(value);
  }
}
