# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
docker compose up -d --build     # build + start api (hot-reload) and postgres; api on :3000, postgres on :5432
docker compose logs -f api       # follow the API's logs
docker compose exec api npm run migration:run   # run any npm script inside the running api container
docker compose exec api npm run seed:admin
docker compose down              # stop; add -v to also drop the postgres_data volume

npm run start:dev                # nest start --watch — dev server (default port 3000, from PORT env)
npm run build                    # nest build → dist/
npm run start:prod               # node dist/main (run after build)
npm run lint                     # eslint --fix over src/apps/libs/test
npm run format                   # prettier --write over src/ and test/

npm run test                     # jest unit tests (*.spec.ts, co-located with source in src/)
npm run test -- path/to/x.spec.ts   # run a single unit test file
npm run test:watch
npm run test:cov
npm run test:e2e                 # jest against test/*.e2e-spec.ts — boots the full AppModule,
                                  # so a reachable Postgres (see below) is required or it will hang
                                  # retrying the DB connection

npm run migration:generate -- src/database/migrations/<Name>   # diff entities vs DB, write a migration
npm run migration:run            # apply pending migrations
npm run migration:revert         # revert the last migration
npm run seed:admin               # create the seed admin user (SEED_ADMIN_EMAIL/PASSWORD env, defaults
                                  # to admin@comercialjhoel.com / admin123)
```

There is no `dev`/`start` shortcut other than the scripts above. Copy `.env.example` to `.env` before
running anything that touches the database (`start:dev`, `test:e2e`, `migration:*`, `seed:admin`) —
`DATABASE_*`, `JWT_SECRET`/`JWT_EXPIRES_IN` (seconds, not a duration string), `CORS_ORIGINS`
(comma-separated), and `SEED_ADMIN_*` all come from env vars, loaded via `@nestjs/config` in the app and
via `dotenv/config` directly in the standalone `src/database/data-source.ts` used by the TypeORM CLI and
the seed script.

### Docker

`docker-compose.yml` runs two services: `postgres` (16-alpine, data in the `postgres_data` volume) and
`api` (built from `Dockerfile`'s `development` stage — full source bind-mounted at `/app`, with an
anonymous volume over `/app/node_modules` so the container's own Linux-built `node_modules` — bcrypt has
a native binding — is never shadowed by a host-installed one). Both services read the single root
`.env`: Compose uses it directly for `${VAR}` substitution in `postgres`'s environment, and passes it to
`api` via `env_file`, with `DATABASE_HOST`/`DATABASE_PORT` overridden to `postgres`/`5432` (the in-network
service name) since `.env`'s own `DATABASE_HOST=localhost` is for running the API directly on the host
instead. Running `npm run migration:run`/`seed:admin` from the host (not through `docker compose exec`)
also works whenever `postgres` is up, because its port is published to `localhost:5432` too.

`Dockerfile` has four build targets: `dependencies` (all deps, for `development`), `development` (what
compose builds — runs `nest start --watch`), `build` (compiles to `dist/`), and `production` (copies only
`production-dependencies` + `dist/`, runs as a non-root user). Alpine needs `python3 make g++` to compile
bcrypt's native binding — installed only in the shared `base` stage that `dependencies` and
`production-dependencies` build from, so the final `production` image never carries the toolchain.

**Gotcha:** the anonymous `/app/node_modules` volume persists across `docker compose up --build` (that's
the point — it protects the container's Linux-built `node_modules` from a host bind-mount), but it also
means a `--build` alone does **not** pick up a `package.json` dependency you just added: the running
container still has the old volume contents. After adding a dependency, run
`docker compose exec api npm install` (updates the volume in place) then `docker compose restart api`
(the long-lived `nest start --watch` process resolves modules once at boot and won't notice new
`node_modules` entries on its own, even though it does hot-reload on source-file changes).

## Architecture

NestJS 11 + TypeScript + PostgreSQL (TypeORM), structured as Clean Architecture **per feature module**
rather than as global top-level layers. Each business module under `src/modules/<name>/` owns its own
`domain/`, `application/`, `infrastructure/`, and `presentation/` folders, keeping bounded contexts
independent so a new module never has to reach into another module's internals directly.

- **`domain/`** — plain TypeScript, zero framework/DB imports. Entities are classes with a private
  constructor + static `create()` factory (see `modules/users/domain/entities/user.entity.ts`).
  Repository interfaces live here as `interface X` + a `Symbol()` injection token exported alongside it
  (e.g. `USER_REPOSITORY` in `modules/users/domain/repositories/user.repository.ts`) — infrastructure
  implements the interface, other modules `@Inject(TOKEN)` it. Domain errors extend the shared
  `DomainError` abstract class (`src/shared/domain/domain-error.ts`), which requires a `status: number`
  field; `GlobalExceptionFilter` reads that field directly, so a new domain error only needs to set
  `status` to control its HTTP response — no filter/controller changes needed.
- **`application/`** — one `@Injectable()` use case per action (`LoginUseCase`, `ChangePasswordUseCase`,
  `CreateUserUseCase`), each with a single `execute(input): Promise<output>`. Use cases depend on other
  modules' domain interfaces (never on their infrastructure or presentation), and on ports — abstractions
  the infrastructure layer implements, so swapping bcrypt or the JWT library never touches a use case.
  `TokenService` is auth-specific (`modules/auth/application/ports/`); `PasswordHasher` is used by both
  `auth` and `users`, so it lives in `src/shared/application/ports/` instead (see below) rather than
  having `users` depend on `auth`'s internals or duplicate a second bcrypt wrapper.
- **`infrastructure/`** — TypeORM entities are suffixed `*.orm-entity.ts` and are kept separate from the
  domain entity; a `*.mapper.ts` converts between them (`modules/users/infrastructure/persistence/`).
  Repository implementations are injected via `TypeOrmModule.forFeature` + the domain's injection token,
  never referenced by concrete class elsewhere. Auth's JWT strategy/guard live here. A repository method
  that inserts (`TypeOrmUserRepository.create`) also catches `QueryFailedError` and re-throws the matching
  domain error by reading `error.driverError.constraint` against the migration's named unique constraints
  (`UQ_users_username`, `UQ_users_phone`) — the use case's own pre-check (`findByUsername`/`findByPhone`)
  is the primary guard, this is the race-condition safety net backed by the DB, not the app.
- **`presentation/`** — thin controllers that only call a use case and map DTOs; request validation
  DTOs use `class-validator` decorators (global `ValidationPipe` has `whitelist` +
  `forbidNonWhitelisted` on, so undeclared body fields are rejected, not silently dropped).

Cross-cutting code lives at the top level, outside any module:
- **`src/shared/`** — `DomainError` base class, `GlobalExceptionFilter` (catches everything via
  `@Catch()`, maps `DomainError`/`HttpException`/unknown to one JSON error shape, logs only 5xx),
  `ResponseInterceptor` (wraps every successful response as `{ success: true, data }`), `CurrentUser`
  param decorator (reads `request.user`, set by `JwtStrategy.validate`), and the `PasswordHasher` port +
  `BcryptPasswordHasher` implementation (`shared/application/ports/`, `shared/infrastructure/services/`),
  wired up by `SharedModule` — import it into any module that needs `@Inject(PASSWORD_HASHER)`. The filter
  and interceptor are registered globally via `APP_FILTER`/`APP_INTERCEPTOR` providers in `app.module.ts`,
  not in `main.ts`.
- **`src/config/configuration.ts`** — the single source of typed env config (`app`, `database`, `jwt`
  namespaces), loaded once via `ConfigModule.forRoot({ isGlobal: true, load: [configuration] })`.
- **`src/database/`** — `data-source.ts` is a standalone `DataSource` (not wired into Nest DI) used only
  by the TypeORM CLI and `seeds/admin-user.seed.ts`; it re-derives config from `process.env` directly
  via `dotenv/config` rather than reusing `ConfigService`. `synchronize` is always `false` — schema
  changes go through `migrations/` only.
- **`src/health/`** — a plain controller with no domain/application/infrastructure split; not everything
  needs the four-layer treatment, only actual business logic does.

Adding a new business module: mirror `modules/users` + `modules/auth` — domain entity/interfaces first,
then use cases against those interfaces, then the TypeORM implementation, then controller + DTOs, then
wire providers/exports in the module's own `<name>.module.ts` and import that module in
`app.module.ts`. Cross-module access always goes through the target module's exported domain interface
token, never through a direct infrastructure import.

### Known constraint

`@nestjs/config` (`4.0.4`), `@nestjs/typeorm` (`11.0.3`), `@nestjs/jwt` (`11.0.2`), and `@nestjs/passport`
(`11.0.5`) are all pinned below their npm `latest` (`12.x`) on purpose — each package's `12.x` line ships
ESM-only (`"type": "module"`, no `require` export condition), which fails to load under this project's
CommonJS compile target: `nest build`/`node dist/main.js` dies with `ERR_PACKAGE_PATH_NOT_EXPORTED`, and
Jest (`ts-jest`, CJS) dies with `SyntaxError: Unexpected token 'export'` on the first one it touches —
which is why the app can boot standalone yet `npm run test:e2e` still fails until every one of these is
pinned. The `11.x`/`4.x` versions above are each still peer-compatible with `@nestjs/core@^11` and are the
last CJS releases of their package. Don't bump any `@nestjs/*` dependency past its current major without
also moving the whole project to ESM — and if a fresh `npm install` ever pulls a newer major back in,
suspect this first. (`@nestjs/throttler` and `helmet` are on their real `latest` — both still ship CJS —
so this isn't a blanket "always pin @nestjs/* below latest" rule, check each package's `type` field.)

### The `User` entity has two independent identities

`modules/users/domain/entities/user.entity.ts` models both the seeded admin (originally `name`+`email`)
and self-registered accounts (`username`+`phone`, created via `POST /users`) in the same table/entity —
`name`, `email`, `username`, and `phone` are all `string | null` for that reason (only `passwordHash` is
guaranteed). **`POST /auth/login` now authenticates by `username` or `phone` only** (a single `identifier`
field, resolved via `UserRepository.findByUsernameOrPhone` — `WHERE username = :id OR phone = :id`), not
by `email` — `findByEmail` still exists on the repository (nothing currently calls it, but it's a
reasonable general-purpose query method, not dead code) and the `email`/`name` columns are still there,
just unused by login now. The seed script (`seeds/admin-user.seed.ts`) backfills `username`/`phone` on the
admin row if missing (`SEED_ADMIN_USERNAME`/`SEED_ADMIN_PHONE`, default `admin`/`00000000`) specifically
so the seeded account can still log in through the new endpoint — re-run `npm run seed:admin` after
pulling this change if your local admin predates it. `username`/`phone` are unique when present (DB-level
`UNIQUE` constraints, nullable columns — Postgres allows multiple `NULL`s in a unique column). When adding
a TypeORM `@Column` typed as `X | null`, always set an explicit `type:` — `emitDecoratorMetadata` can't
infer a column type from a union (`design:type` degrades to `Object`), which TypeORM rejects at boot with
`DataTypeNotSupportedError`.

`POST /users` (`UsersController` → `CreateUserUseCase`) registers a `username`+`phone`+`password` account:
409 on a duplicate `username` or `phone`, password hashed via the shared `PasswordHasher` before it ever
reaches the repository, response DTO has no password/hash field.

### Auth error messages are deliberately generic

`InvalidCredentialsError` (`modules/auth/domain/errors/invalid-credentials.error.ts`) says only
`"Credenciales inválidas."` for both "no such user" and "wrong password" — `LoginUseCase` throws the exact
same error in both branches, on purpose, so a client can't enumerate valid usernames/phones by timing or
message differences. Don't give either branch a more specific message without re-checking this.

### API-wide behavior to know before touching `auth`/`users`

- **Global prefix**: `main.ts` calls `app.setGlobalPrefix('api')` — every route is under `/api/*`
  (`/api/auth/login`, `/api/users`, `/api/health`), matching the frontend's `environment.apiUrl`. This
  isn't per-controller; don't re-add `'api'` inside an `@Controller()` path.
- **CORS**: `configuration.ts`'s `cors.origins` (env `CORS_ORIGINS`, comma-separated, default
  `http://localhost:4200`) is passed straight to `app.enableCors({ origin: ... })` in `main.ts` — there is
  no wildcard `*`. Add a deployed frontend origin to `CORS_ORIGINS` rather than loosening this.
- **`helmet()`** is applied as Express middleware in `main.ts` before anything else — standard security
  headers (`X-Frame-Options`, `X-Content-Type-Options`, HSTS, etc.) on every response, no per-route config.
- **Rate limiting**: `ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }])` is registered in
  `app.module.ts` but **not** applied globally (no `APP_GUARD`) — it only takes effect where a controller
  method explicitly has `@UseGuards(ThrottlerGuard)` + `@Throttle(...)`, which today is only
  `POST /auth/login` (5 requests/minute/IP). Storage is in-memory, so limits reset on every restart —
  don't rely on it surviving a redeploy, and don't be surprised if rapid manual testing trips it (429).
- **`AuthTokenPayload`/`RequestUser`** (`modules/auth/application/ports/token-service.port.ts`,
  `shared/decorators/current-user.decorator.ts`) carry `{ sub, username }` / `{ userId, username }` — not
  `email`. `JwtStrategy.validate` and `CurrentUser('userId')` follow from that; keep both in sync if the
  payload shape changes again.

## Frontend contract

The sibling Angular app at `../comercial-jhoel-app` is now fully wired to this API — see its own
`CLAUDE.md` for the frontend side (`AuthService`, `authInterceptor`, route guard). Two things to keep in
sync if you touch the `auth` module:

1. **Response envelope**: every successful response is wrapped by `ResponseInterceptor` as
   `{ success: true, data: T }` (error responses from `GlobalExceptionFilter` are flat, no `data` key —
   see "Manejo de errores" above). The frontend's `AuthService` unwraps `.data` explicitly; if you add a
   new authenticated endpoint the frontend will call, remember the wrapper.
2. **Login contract**: `POST /auth/login` takes `{ identifier, password }` and returns
   `{ accessToken, user: { id, username, phone } }` (wrapped as above). `POST /auth/change-password`
   requires `Authorization: Bearer <token>` and returns `204` with an empty body on success. Both are
   consumed by `comercial-jhoel-app/src/app/core/services/auth.service.ts` — check that file before
   changing either shape.
