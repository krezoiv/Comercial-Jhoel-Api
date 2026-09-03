import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Sets the database's own default session timezone to `America/Guatemala`
 * — until now, nothing anywhere in this stack (this migration, `data-source.ts`,
 * `app.module.ts`'s `TypeOrmModule.forRootAsync`, or `docker-compose.yml`) ever
 * configured a timezone, so both the `postgres:16-alpine` container and the
 * `api` container ran on their bare-image default, UTC. Every date-lifecycle
 * module (Banks, Recargas) computes "today" via a `todayIsoDate()` helper
 * that correctly uses LOCAL `Date` getters (never `getUTC*`) specifically so
 * it would follow the server's real timezone — but with no timezone actually
 * configured, "local" silently meant UTC, six hours ahead of
 * `America/Guatemala`. That created a real, reproducible ~6-hour daily
 * window (18:00–23:59 Guatemala time) where the backend and Postgres had
 * already rolled to the next calendar day while a Guatemala-based user still
 * considered it "today" — verified live against the running dev containers
 * before writing this migration, not assumed.
 *
 * This migration is the Postgres half of the fix; the `api` container's own
 * process timezone is set via `TZ=America/Guatemala` in `docker-compose.yml`
 * and the `Dockerfile` (both `base` and `production` stages install `tzdata`
 * so `Intl`/`Date` resolve the named zone correctly).
 *
 * Non-destructive: `timestamptz` columns (`opened_at`, `closed_at`, etc.) are
 * always stored internally as true UTC instants regardless of session
 * timezone — this only changes how `now()`/`CURRENT_DATE`/date casts are
 * computed going forward, never reinterprets anything already stored. No
 * stored function in this schema reads `CURRENT_DATE` itself (every one
 * takes an explicit `p_date` parameter from the application layer), so this
 * migration alone is sufficient — no stored-function changes needed.
 */
export class SetDatabaseTimezone1759100000000 implements MigrationInterface {
  name = 'SetDatabaseTimezone1759100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const databaseName = process.env.DATABASE_NAME ?? 'comercial_jhoel';
    await queryRunner.query(
      `ALTER DATABASE "${databaseName}" SET timezone TO 'America/Guatemala'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const databaseName = process.env.DATABASE_NAME ?? 'comercial_jhoel';
    await queryRunner.query(
      `ALTER DATABASE "${databaseName}" SET timezone TO 'UTC'`,
    );
  }
}
