import 'dotenv/config';
import { DataSource } from 'typeorm';

/**
 * `__dirname`-relative, `{ts,js}` globs — NOT hardcoded `src/...` paths —
 * so this same compiled file works correctly in both contexts it actually
 * runs in: via `typeorm-ts-node-commonjs` against the `.ts` sources in dev
 * (`__dirname` = `src/database`), and via plain `node`/`typeorm` against
 * the compiled `.js` output in production (`__dirname` = `dist/database`,
 * no `src/` directory exists at all in the production image — see the
 * `production` Dockerfile stage, which only copies `dist/` +
 * `production-dependencies`). A hardcoded `src/*.ts` glob silently matched
 * zero files in production and made `migration:run` report "no migrations
 * pending" even when several genuinely were — this bit us once, see
 * `migration:run:prod` below for the actual production-safe command.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USERNAME ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'comercial_jhoel',
  entities: [`${__dirname}/../modules/**/infrastructure/persistence/*.orm-entity.{ts,js}`],
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  synchronize: false,
});
