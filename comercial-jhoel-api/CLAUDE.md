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
  `shared/decorators/current-user.decorator.ts`) carry `{ sub, username, role }` /
  `{ userId, username, role }` — not `email`. `JwtStrategy.validate` and `CurrentUser('userId')` follow
  from that; keep both in sync if the payload shape changes again. `role` is the role **name**
  (`'SUPER_ADMIN' | 'ADMIN' | 'USER'`), not the role's uuid — `RolesGuard`/`@Roles(...)` compare against
  it directly, no DB lookup per request.

### Roles, Categories, and Products

- **`roles`** (`modules/roles/`) is domain/infra only — no controller, nothing external creates or edits a
  role. The three rows (`SUPER_ADMIN`, `ADMIN`, `USER`) are seeded *inside* migration
  `1756500000000-CreateRolesAndUserRoles` via raw `INSERT`, not a separate seed script, so a fresh deploy
  never depends on someone remembering to run one. `users.role_id` is `NOT NULL` with `FK ... RESTRICT`
  (can't drop a role that still has users) — every pre-existing user was backfilled to `ADMIN` in that
  same migration (the only account that predated it was the seeded dashboard admin; `ADMIN` was the
  correct/safe default, not `SUPER_ADMIN` or `USER`). `UserOrmEntity.role` is `{ eager: true }`, so every
  `find`/`findOne` on `UserRepository` already has it — but `.save()` does **not** populate eager relations
  on the object it returns, so `TypeOrmUserRepository.create()` re-fetches by id before mapping (same
  pattern `TypeOrmProductRepository.create()` uses for its `category` relation). `CreateUserUseCase`
  (self-registration, `POST /users`) always assigns `USER` — never trust a client to pick its own role.
- **`categories`** (`modules/categories/`) — flat CRUD, `name` globally unique (plain `UNIQUE`), soft
  delete only (`isActive=false`, no `DELETE` ever hits the row). `GET /categories` defaults to active-only;
  pass `?includeInactive=true` to see everything. Every route requires a JWT; `POST`/`PATCH`/`DELETE`
  additionally require `@Roles('ADMIN', 'SUPER_ADMIN')`.
- **`businesses`** (`modules/businesses/`) — the "Negocio" line-of-business a product belongs to
  (Librería, Tienda, Heladería, ...). Structurally an exact clone of `categories` — same flat CRUD, same
  `UQ_businesses_name` global uniqueness, same soft delete, same guard split (`GET` open to any
  authenticated role, mutations require `@Roles('ADMIN', 'SUPER_ADMIN')`). Migration
  `1757000000000-CreateBusinessesTable` seeds exactly one row, `Librería`, and backfills every
  pre-existing product to it (same reasoning as the `ADMIN`-role backfill in the roles migration) —
  other lines of business are for an admin to add through `POST /businesses`/the frontend screen, not
  seeded. `products.business_id` is `NOT NULL` with `FK ... RESTRICT`, added and populated in that same
  migration.
- **`products`** (`modules/products/`) — same shape, plus: `categoryId` FK and **`businessId` FK**
  (both `RESTRICT`, though neither actually fires since categories/businesses are soft-deleted too —
  `CreateProductUseCase`/`UpdateProductUseCase` inject `BUSINESS_REPOSITORY` the identical way they
  already inject `CATEGORY_REPOSITORY`, validate `businessId` exists **and** `isActive`
  (`InvalidBusinessError`, 400) before assigning it, and `ProductsModule` imports `BusinessesModule`
  alongside `CategoriesModule` for this), and **`name` is unique only among *active*
  products** — a partial unique index (`UQ_products_name_active ... WHERE is_active = true`, both in the
  migration and mirrored on `ProductOrmEntity` via `@Index(..., { where: '"is_active" = true' })`) so a
  deactivated product's name can be reused by a new one. **`sku` (barcode) follows the identical pattern**
  — nullable, optional on create/update, unique only among active products
  (`UQ_products_sku_active`, migration `1756900000000-AddSkuToProducts`) — Postgres never treats two
  `NULL`s as equal under a unique index, so any number of products can have no SKU at all without
  colliding with each other. `ProductSkuAlreadyExistsError` (409) mirrors `ProductNameAlreadyExistsError`
  exactly, both in the use cases (`CreateProductUseCase`/`UpdateProductUseCase` check
  `findByActiveSku`/`findByActiveName` the same way) and in `TypeOrmProductRepository`'s
  `translateUniqueViolation` (now keyed off two possible constraint names). `GET /products`'s `search`
  matches `sku` too (`ILIKE` OR'd with `name`), so scanning/typing a barcode into the inventory search box
  finds the product. `costPrice`/`publicPrice`/`wholesalePrice` are
  Postgres `numeric(12,2)` — never `float`/`double` — mapped through
  `shared/infrastructure/persistence/decimal.transformer.ts` (`DecimalColumnTransformer`) because the pg
  driver returns `numeric` as a string by default; reuse that transformer for any future money column
  instead of re-deriving the float-precision problem. `GET /products` is paginated/searchable/sortable
  (`page`, `limit` default 100/max 200, `search` ILIKE on name/sku, `categoryId`, `businessId`,
  `sortBy`/`sortDirection`, `includeInactive`) — the response is `{ items, total, page, limit }` *inside* the usual
  `{ success, data }` envelope. Both use cases that write a product (`CreateProductUseCase`,
  `UpdateProductUseCase`) re-check the target category exists **and** `isActive` — a category going
  inactive doesn't touch existing products, but blocks assigning it to new/other ones.
- **Every use case in `categories`/`products`/`users` returns a plain object, never the domain entity
  directly.** Domain entities (`Category`, `Product`, `User`) keep their state in a private `props` field
  with only getters exposed — `JSON.stringify`-ing one directly serializes as `{"props": {...}}`, not the
  flat shape a DTO promises. `application/dtos/{category,product}-output.ts` export a `to*Output()` mapper
  for exactly this; call it before returning from any new use case that hands back an entity. (`User`
  doesn't have one yet only because every existing use case already builds its own literal return value —
  add one the same way if a new user use case needs to return a full user.)
- **Role enforcement is two-layered, and the backend layer is the one that matters**: `@UseGuards(JwtAuthGuard, RolesGuard)`
  + `@Roles('ADMIN', 'SUPER_ADMIN')` on the categories/products mutation endpoints
  (`modules/auth/infrastructure/guards/roles.guard.ts`, `shared/decorators/roles.decorator.ts`) reject with
  `403` regardless of what the frontend hides. `RolesGuard` only depends on `Reflector` (a Nest
  core-provided global), so it works via `@UseGuards(RolesGuard)` from any module without that module
  importing `AuthModule` — same as `JwtAuthGuard` already did.

### Users & Roles administration module

Full CRUD for both `users` and `roles`, gated to `SUPER_ADMIN`/`ADMIN` — the admin panel behind
`comercial-jhoel-app`'s "Sistema → Usuarios/Roles" screens. Built directly on top of the
users/roles/categories/products foundation above; nothing here is a separate subsystem.

- **`users.isActive` is new** (migration `1756800000000-AddIsActiveToUsers`, `boolean not null default true`)
  — the `User` domain entity, `UserOrmEntity`, and `UserMapper` all carry it now. Soft delete only, same as
  every other module: `DELETE /users/:id` sets `isActive=false`, never a physical `DELETE`.
- **`POST /users` split into two endpoints with different trust levels** — this is the one deliberate
  behavior change to a pre-existing route:
  - `POST /users/register` — **public**, no guard, unchanged from the original `POST /users`: always
    assigns the `USER` role (`RegisterUserUseCase`), never trusts a caller-supplied role. Nothing in the
    frontend calls this yet (no self-signup page exists), but the capability is preserved rather than
    removed.
  - `POST /users` — **admin-only** (`CreateUserUseCase`), requires `@Roles('ADMIN', 'SUPER_ADMIN')`, accepts
    an explicit `roleId` and validates it exists **and** `isActive` (`InvalidRoleError`, 400) before
    assigning it — mirrors how `CreateProductUseCase` validates `categoryId` against `CategoriesModule`.
  - `UsersController` has **no class-level `@UseGuards`** for this reason (unlike `CategoriesController`/
    `ProductsController`, which are entirely behind auth) — `register` needs to stay reachable
    unauthenticated, so every other route opts in to `@UseGuards(JwtAuthGuard, RolesGuard)` individually.
    Same split `AuthController` already used for `login` (public) vs `change-password` (guarded).
- **Every route on `RolesController` — including the `GET`s — requires `SUPER_ADMIN`/`ADMIN`**, unlike
  categories/products where `GET` is open to any authenticated role. This is intentional per the ticket
  that built this module (not a mistake to "fix" toward the categories pattern): only the admin-only
  Users/Roles screens ever call `/roles`, so nothing else needs it open.
- **`RoleRepository.countUsersByRoleId(roleId, activeOnly?)`** runs a **raw SQL query against the `users`
  table** (`TypeOrmRoleRepository`, via `repository.manager.query(...)`) instead of injecting `UsersModule`'s
  domain repository — `UsersModule` already imports `RolesModule`, so the reverse import would be circular.
  This is the one place in the codebase that deliberately crosses a module boundary via raw SQL rather than
  a domain interface; the trust boundary is the same one migrations already rely on (stable table/column
  names), not a new pattern to reuse casually elsewhere.
- **Role deactivation is blocked while any *active* user still references it**
  (`RoleHasAssignedUsersError`, 409) — checked in both `UpdateRoleUseCase` (when `isActive` flips to
  `false`) and `DeactivateRoleUseCase`. Uses `countUsersByRoleId(id, true)` — inactive users holding a
  since-deactivated role don't block it, since they have no active access to lose.
- **The three seeded role names are immutable** — `UpdateRoleUseCase` throws `SystemRoleImmutableError`
  (400) if `name` is provided and differs from the current value **and** the role's current name is in
  `ROLE_NAMES` (`modules/roles/domain/entities/role.entity.ts`). Renaming would silently break every
  `@Roles('ADMIN', 'SUPER_ADMIN')` string-literal check across the app, which has no other way to notice.
  Description and `isActive` on a system role are still editable.
- **Role names are normalized on create/update** (`application/use-cases/normalize-role-name.ts`):
  trimmed, upper-cased, spaces → underscores — `"Cajero de turno"` becomes `"CAJERO_DE_TURNO"`, matching the
  seeded roles' own style. `RoleRepository.findByName(name: string)` takes a plain string (not the
  `RoleName` union) specifically so this normalized, arbitrary custom name can be looked up for the
  uniqueness check — the union type is still what `@Roles(...)`/guards use elsewhere.
- **A user can never deactivate their own account** — `CannotDeactivateSelfError` (400), enforced in both
  `DeactivateUserUseCase` (`DELETE /users/:id`) and `UpdateUserUseCase` (`PATCH /users/:id` with
  `isActive: false`), comparing the target `id` against `@CurrentUser('userId')`. This is a blanket rule
  (any self-deactivation, not just "if you're the last admin") — simpler to reason about and enforce than
  counting remaining active admins, and the ticket's own goal (don't let an admin accidentally lock
  themselves out) is fully satisfied by it.
- **`JwtStrategy.validate` now hits the database on every authenticated request**, not just at login
  (`modules/auth/infrastructure/strategies/jwt.strategy.ts`) — it re-fetches the user by `payload.sub` and
  rejects with `401` if the user no longer exists or `isActive` is `false`, and uses the **freshly-fetched
  `roleName`** for the request's role rather than trusting `payload.role` from the (possibly stale) JWT.
  This closes a real gap: without it, deactivating a user or changing their role wouldn't take effect until
  their token naturally expired. `AuthModule` already imported `UsersModule` (for `LoginUseCase`), so no new
  module wiring was needed — `JwtStrategy` just injects `USER_REPOSITORY` directly.
- **`LoginUseCase` also rejects an inactive user** with the same generic `InvalidCredentialsError` (401)
  used for "unknown user"/"wrong password" — deliberately not a distinct message, same anti-enumeration
  reasoning as the rest of that use case.
- **No functional difference between `ADMIN` and `SUPER_ADMIN` anywhere in this module** — both satisfy
  every `@Roles('ADMIN', 'SUPER_ADMIN')` check identically. The ticket that built this asked to "respect
  and document" any difference between the two if one exists; none was introduced, since nothing in the
  requirements called for one. If a real ADMIN/SUPER_ADMIN split is needed later (e.g., only SUPER_ADMIN
  can manage other SUPER_ADMIN accounts), add it as a new, explicit rule rather than assuming one is
  already there.

### Sales (`sales`/`sale_details`) — the one module built on a Postgres stored function

`modules/sales/` implements point-of-sale checkout: `POST /sales` (any authenticated, active account —
no `@Roles(...)`, since registering a sale is an operational cashier action, not an admin one; see
"Permissions" below), `GET /sales` (paginated summaries), `GET /sales/:id` (full detail with line items).

- **The actual sale — insert `sales`, insert `sale_details`, decrement `products.stock` — happens inside
  a single Postgres `FUNCTION confirm_sale(p_user_id UUID, p_items JSONB) RETURNS UUID`**, created via raw
  SQL in migration `1757100000000-CreateSalesTables`. `TypeOrmSaleRepository.confirmSale()` calls it with
  one query (`SELECT confirm_sale($1, $2::jsonb)`) and re-fetches the persisted sale by the returned id
  afterward — the write path never touches `sales`/`sale_details`/`products` directly from TypeScript.
- **Why a `FUNCTION` and not a `PROCEDURE`** (this was a deliberate, documented choice, not a default): a
  `PROCEDURE` exists specifically to `COMMIT`/`ROLLBACK` *inside itself*, splitting one call into multiple
  independent transactions — the opposite of what a sale needs. A `FUNCTION` runs entirely inside the
  caller's transaction and can't commit early, so any `RAISE EXCEPTION` inside it — empty items, quantity
  ≤ 0, product missing/inactive, insufficient stock — automatically rolls back every write the function
  made, with no explicit `BEGIN`/`COMMIT` anywhere. It also returns a value directly from a plain `SELECT`,
  simpler to call than a procedure's `CALL`/`OUT`-parameter form. Verified directly: a sale that fails
  partway through (e.g. its second line item has insufficient stock) leaves `products.stock` completely
  untouched, not partially decremented.
- **Concurrency / no overselling**: each product row is locked with `SELECT ... FOR UPDATE` before its
  stock is checked. A second, concurrent `confirm_sale()` call touching the same product blocks on that
  lock until the first transaction commits or rolls back, then re-reads the now-current stock. Verified
  directly: two simultaneous `POST /sales` requests both selling the last unit of a stock-1 product — one
  gets `201` (sale created, stock → 0), the other gets `409 InsufficientStockError`; stock is never
  negative. `CreateSaleUseCase` sorts the (deduplicated) item list by `productId` before calling the
  repository, so any two sales that share two or more products always acquire those row locks in the same
  order — this is what rules out a lock-ordering deadlock between them, not just the stock race itself.
- **Unit price is frozen at the moment of sale**: `confirm_sale` reads `products.public_price` at the
  instant it processes each item and writes that exact value into `sale_details.unit_price`/`total` — a
  later price change on the product never touches historical sales. The use case/DTOs never accept a
  caller-supplied price or total; both are always server-computed.
- **Postgres error → domain error translation** happens in `TypeOrmSaleRepository.translateSaleError()`,
  parsing the `driverError.message` set by each `RAISE EXCEPTION '<CODE>:<productId>'` in the function
  (`SALE_EMPTY`, `PRODUCT_NOT_FOUND`, `PRODUCT_INACTIVE`, `INSUFFICIENT_STOCK`, `INVALID_QUANTITY`) — same
  `QueryFailedError`/`driverError.constraint` pattern the other repositories already use for unique-
  violation translation, just keyed off the exception message instead of a constraint name.
- **`CreateSaleUseCase` defensively merges duplicate `productId` entries** (summing quantities) before
  ever calling the repository — a manipulated payload listing the same product twice becomes one
  `sale_details` row with the combined quantity, never two rows or two stock decrements for one line.
- **No `PRODUCT_REPOSITORY`/`USER_REPOSITORY` injected anywhere in this module** — unlike
  `CreateProductUseCase` (which injects `CATEGORY_REPOSITORY` to validate `categoryId`), `CreateSaleUseCase`
  does none of that: all product-existence/active/stock validation happens *inside* `confirm_sale` itself,
  which is the entire point of moving that logic into the database. `SaleOrmEntity`/`SaleDetailOrmEntity`
  do import `UserOrmEntity`/`ProductOrmEntity` directly (for the `ManyToOne` relations used by the read
  paths, `findAll`/`findById`), but that's a TypeScript type-level import for relation metadata, not a
  NestJS module import — `SalesModule` doesn't import `UsersModule` or `ProductsModule`, avoiding any
  circular-dependency question entirely (same reasoning as `RolesModule`'s raw SQL against `users` in the
  Users & Roles section above, just via a relation instead of `manager.query`).
- **`GET /sales` never loads `items`** (`TypeOrmSaleRepository.findAll` only joins `sale.user`, not
  `sale.items`) — it's a summary listing (`SaleSummaryOutput`: id/user/date/total, no line items) by
  design, both because a sales list doesn't need per-line detail and because paginating a query-builder
  join against a to-many relation is exactly the "row fan-out" pagination bug ORMs are prone to; avoiding
  the join sidesteps it entirely rather than relying on TypeORM's join-then-repaginate handling of it.
  `GET /sales/:id` (`findById`) uses `.findOne({ relations: { items: { product: true } } })` instead — a
  single-row fetch has no pagination concern, so eager-loading the full `items`/`items.product` graph
  there is simple and correct.
- **Permissions** (documented per the ticket's own instruction, since no prior rule covered this): `POST
  /sales` requires only `JwtAuthGuard` (any authenticated, active account — `SUPER_ADMIN`/`ADMIN`/`USER`
  alike) — a cashier is realistically a `USER`-role account, so gating sale creation to admins would make
  the module unusable for its actual purpose. `GET /sales`/`GET /sales/:id` add an ownership rule on top,
  enforced in the use cases (not a guard): a `USER` account only ever sees *their own* sales — `ListSales
  UseCase` silently overrides any `?userId=` query param to the caller's own id for a non-admin, and
  `GetSaleByIdUseCase` throws `SaleAccessDeniedError` (403) if a non-admin requests a sale they don't own.
  `SUPER_ADMIN`/`ADMIN` see and filter across all sales. If a real ADMIN/SUPER_ADMIN capability split is
  ever needed here, add it explicitly — today both satisfy `ADMIN_ROLES` identically, same as every other
  module in this codebase.
- **No new `GET /products/search` endpoint** — the existing `GET /products?search=` (added for the SKU
  feature, see "products" above) already does exactly what was asked (ILIKE match on name/sku, active-only
  by default) and now also gained a `businessId`-style precedent for query filters; the frontend's Ventas
  product picker just calls it with a small `limit`. Adding a second, parallel search endpoint would have
  been pure duplication.

#### Real-time draft sales (`sales.status`, `adjust_sale_item`, `cancel_open_sale`)

Added after the initial Sales module shipped, in response to an explicit follow-up request: stock must be
reserved the moment a product is added to the receipt (not just at final save), and restored if that item
or the whole receipt is removed before saving — visible to any other screen/terminal immediately, not just
after "Guardar venta". This is layered on top of everything in the Sales section above, not a replacement
for it — `POST /sales` (bulk, one-shot, `confirm_sale`) still exists unchanged for any caller that wants to
create a complete, already-decided sale in one call.

- **`sales.status`** (`'OPEN' | 'CONFIRMED'`, migration `1757200000000-AddDraftSalesSupport`) — column
  default is `'CONFIRMED'` (this correctly backfilled every pre-existing row, and is what `confirm_sale()`'s
  inserts still get since that function never sets it); a draft row is always inserted with an *explicit*
  `status='OPEN'` by `adjust_sale_item()`. There is no `'CANCELLED'` status — an abandoned `OPEN` sale is
  hard-deleted by `cancel_open_sale()`, not soft-cancelled, since it never represented a real transaction
  (unlike a `CONFIRMED` sale, which is never deleted).
- **A user can have at most one `OPEN` sale at a time**, enforced at the DB level by a partial unique index
  (`UQ_sales_open_per_user` on `sales(user_id) WHERE status = 'OPEN'`), not just application logic — this is
  what makes the "find or create my open receipt" step inside `adjust_sale_item()` safe under concurrency
  (two near-simultaneous first-adds from the same user, e.g. a double-click on two different search
  results): the second `INSERT` hits the unique violation, which the function catches
  (`EXCEPTION WHEN unique_violation`) and re-selects the row the first call just created, rather than
  erroring. Verified directly: two concurrent "first add" requests for the same user but different products
  both return `201` and both items land in the one sale the first request created — no duplicate `OPEN` row,
  no error surfaced to either caller.
- **`FUNCTION adjust_sale_item(p_user_id, p_product_id, p_quantity_delta) RETURNS UUID`** is the real-time
  counterpart to `confirm_sale()` — one call per cart action (add, +, −, direct quantity edit, "Quitar"),
  not one call at the end. `p_quantity_delta` is the *change* to that line's quantity: positive reserves
  more stock, negative releases it back; **one function handles both directions symmetrically** (the stock
  adjustment is always exactly `-p_quantity_delta`) rather than separate reserve/release endpoints, which
  would let a caller release more than they ever reserved. The delta is always applied against the *actual*
  current `sale_details` row (locked `FOR UPDATE`, same pattern as `confirm_sale`'s product lock) — never a
  client-supplied absolute quantity — so a frontend that's gone stale can at worst have its *next* request
  rejected (`INSUFFICIENT_STOCK`/`INVALID_QUANTITY`), never write an incorrect stock value. Reserving more
  (`delta > 0`) still checks `is_active`/sufficient stock, exactly like `confirm_sale`; releasing (`delta <
  0`) never does — you can always give stock back regardless of whether the product is still active.
  Verified directly end-to-end (curl and the live Ventas screen): adding a product decrements
  `products.stock` immediately, before any save; increasing/decreasing the line quantity adjusts it further
  in real time; confirming afterward makes **no** additional stock change (it was already fully reserved).
- **`FUNCTION cancel_open_sale(p_user_id) RETURNS BOOLEAN`** — the rollback side. Restores every line's
  quantity back to its product's stock (locked `FOR UPDATE`, iterated `ORDER BY product_id` for consistent
  lock ordering against any other multi-row operation), then hard-deletes the `sale_details` and the `sales`
  row itself. Returns `FALSE` (not an error) if the caller had no open receipt — `CancelOpenSaleUseCase`
  turns that into `NoOpenSaleError` (404) at the application layer. Verified directly: cancelling a receipt
  with reserved stock restores it exactly, and cancelling again immediately after correctly reports nothing
  to cancel.
- **Confirming a draft (`ConfirmOpenSaleUseCase`/`TypeOrmSaleRepository.confirmOpenSale`) needs no Postgres
  function at all** — it's a single conditional `UPDATE sales SET status='CONFIRMED', sale_date=now() WHERE
  user_id=:userId AND status='OPEN'`, which is already atomic as one statement (no row-locking gymnastics
  needed, since there's no multi-row stock math left to do — that already happened incrementally). This was
  a deliberate "don't create procedures where a plain statement is already correct and simpler" call, same
  spirit as not building a second product-search endpoint above.
- **New routes, all under the "any authenticated, active account" rule the rest of the Sales controller
  already uses** (no `@Roles(...)`): `POST /sales/items` (adjust), `GET /sales/current` (fetch the caller's
  own open draft — `404` via `NoOpenSaleError` if none, which the frontend treats as "empty cart", not an
  error), `POST /sales/confirm`, `DELETE /sales/current` (cancel). **Route declaration order matters here**:
  `GET /sales/current` is declared *before* `GET /sales/:id` in `SalesController` — Nest/Express match
  routes in declaration order, so if `:id` came first it would swallow `current` as a literal id value
  (which would then fail `ParseUUIDPipe`) instead of ever reaching the intended handler.
- **`GET /sales` (history) now explicitly filters `status = 'CONFIRMED'`** (hardcoded in
  `TypeOrmSaleRepository.findAll`, not client-controlled) — a listing is sales history, and an in-progress
  `OPEN` receipt isn't a completed sale yet, so it must never appear there even though it's the same table.
- **`SaleOutput`/`SaleResponseDto` gained a `status` field** so a consumer can tell a draft from a completed
  sale from the same shape — used today only by the Ventas screen's own draft views, but harmless and
  arguably necessary to expose given both states now flow through the same DTOs.

### Suppliers (`suppliers`) and Purchases (`purchases`/`purchase_details`)

`modules/suppliers/` is a flat CRUD module — structurally identical to `categories`/`businesses` (soft
delete via `isActive=false`, `GET` open to any authenticated role, `POST`/`PATCH`/`DELETE` gated
`@Roles('ADMIN', 'SUPER_ADMIN')`) — with one difference: **`name` is not unique**, only `taxId` is,
and only when present (`UQ_suppliers_tax_id_active`, a partial unique index exactly like `products.sku`
— nullable, unique only among active rows, so any number of suppliers can omit a tax id without
colliding). `SupplierRepository.findActiveByTaxId` is the uniqueness-check method, mirroring
`findActiveByName`/`findActiveBySku` elsewhere. `modules/purchases/` implements the "Compras" module —
a supplier invoice that increases stock and updates product pricing — deliberately built on the
**original, simpler one-shot atomic pattern from Sales' `confirm_sale`**, not the newer real-time
draft/reservation pattern (`adjust_sale_item`/`cancel_open_sale`). This was a considered choice, not an
oversight: reserving stock in real time exists in Sales to prevent overselling while a cashier is still
building the receipt, but increasing stock has no equivalent race to guard against — nothing can go wrong
by waiting until the whole invoice is confirmed, and the ticket that built this module explicitly requires
that cancelling a draft purchase never touch the database at all, which the one-shot model gives for free
(there's nothing to roll back — nothing was ever written).

- **`POST /purchases` (any authenticated, active account — no `@Roles(...)`)** creates the purchase,
  its `purchase_details` rows, increases `products.stock`, and overwrites `products.cost_price`/
  `public_price` with the invoice's values, all inside a single Postgres
  **`FUNCTION confirm_purchase(p_supplier_id UUID, p_user_id UUID, p_purchase_date TIMESTAMPTZ, p_items JSONB) RETURNS UUID`**
  (migration `1757300000000-CreateSuppliersAndPurchases`). Same FUNCTION-not-PROCEDURE reasoning as
  `confirm_sale` (see the Sales section above): a FUNCTION can't commit early, so any `RAISE EXCEPTION` —
  empty items, invalid/inactive supplier, product missing/inactive, non-positive quantity, negative price —
  rolls back every write the call made, with no explicit `BEGIN`/`COMMIT` needed.
  `TypeOrmPurchaseRepository.confirmPurchase()` calls it with one query
  (`SELECT confirm_purchase($1, $2, $3, $4::jsonb)`) and re-fetches the persisted purchase by the returned
  id, identical in shape to `TypeOrmSaleRepository.confirmSale()`.
- **Line total is always `cost_price * quantity`, never `public_price`** — enforced both inside the SQL
  function and in `CreatePurchaseUseCase`/the response DTOs; `publicPrice` is accepted and stored purely so
  the invoice can update the product's retail price in the same transaction, it never participates in any
  total.
- **The registering user always comes from the JWT** (`@CurrentUser('userId')` in `PurchasesController`),
  identical to Sales — the request body has no `userId` field at all, so there is nothing to trust or
  validate on that front.
- **Concurrency**: unlike Sales, increasing stock (`UPDATE products SET stock = stock + quantity ...`) has
  no "insufficient stock" race to protect against — two simultaneous purchases of the same product simply
  both add their quantity, and Postgres's own row-level `UPDATE` atomicity is sufficient on its own, no
  explicit locking required for that particular statement. `SELECT ... FOR UPDATE` is still taken on the
  product row before its `is_active` check (and on the supplier row before its own `is_active` check),
  for the same reason `confirm_sale` locks a product before reading its state — a lock-then-read avoids a
  TOCTOU gap between the validation and the write that follows it, even though nothing here can "oversell".
  Verified directly: two concurrent `POST /purchases` for the same product (deltas of 20 and 15 against a
  starting stock of 51) both succeeded and left stock at exactly 86 — no lost update.
  `CreatePurchaseUseCase` sorts the deduplicated item list by `productId` before calling the repository,
  same deadlock-avoidance reasoning as `CreateSaleUseCase`.
- **`purchase_details` freezes `costPrice`/`publicPrice`/`total` at the moment of purchase**, exactly like
  `sale_details.unitPrice` — a later price change on the product never rewrites purchase history. The
  product's *current* price is a separate, deliberate side effect of confirming the purchase (see above),
  not something `purchase_details` itself tracks going forward.
- **`purchaseDate` is client-supplied** (unlike `sale_date`, which the Sales function always sets to
  `now()`) — a purchase is an invoice for a delivery that may have happened a day or two before it's
  entered into the system, so the ticket requires a date picker rather than an implicit "now". `Create
  PurchaseUseCase` rejects a date more than 24 hours in the future (`FUTURE_DATE_GRACE_MS`,
  `InvalidPurchaseDateError`, 400) — a small grace window absorbs timezone-offset edge cases without
  allowing a genuinely future-dated invoice.
- **No `GET /suppliers/search` or reuse of the Sales product-search endpoint's URL** — `GET /products?search=`
  (see "products" above) already does exactly what Compras' product picker needs (ILIKE on name/sku,
  active-only), so the frontend calls it directly with a small `limit`, same as Ventas' picker does. No new
  backend endpoint was added for this.
- **Suppliers cannot be hard-deleted while purchases reference them** — enforced structurally, not by an
  application-level check: `purchases.supplier_id` is `FK ... RESTRICT`, and `DELETE /suppliers/:id` is a
  soft delete (`isActive=false`) in the first place, same as every other reference table in this codebase,
  so the RESTRICT constraint is really just defense-in-depth against a hypothetical future hard-delete path.
- **`GET /purchases`/`GET /purchases/:id` follow the identical ownership rule as Sales**: a non-admin only
  sees their own purchases (`ListPurchasesUseCase` overrides any `?userId=` for a non-admin,
  `GetPurchaseByIdUseCase` throws `PurchaseAccessDeniedError` (403) on a purchase they don't own),
  `SUPER_ADMIN`/`ADMIN` see everything. Unlike Sales, `purchases` has no `status` column — every row is a
  completed, confirmed purchase, so `findAll` has nothing analogous to Sales' hardcoded
  `status = 'CONFIRMED'` filter to apply.
- **Postgres error → domain error translation** happens in `TypeOrmPurchaseRepository.translatePurchaseError()`,
  parsing `RAISE EXCEPTION` messages the same `'CODE:id'` way `translateSaleError` does:
  `SUPPLIER_NOT_FOUND`/`SUPPLIER_INACTIVE` (both map to the one `InvalidSupplierError`, 400 — the caller
  doesn't need to distinguish "doesn't exist" from "deactivated"), `PRODUCT_NOT_FOUND`, `PRODUCT_INACTIVE`,
  `INVALID_QUANTITY`, `INVALID_PRICE`, `PURCHASE_EMPTY`.

### Reports (`modules/reports/`) — the one module that's pure read-side

`modules/reports/` implements "Reportería": `GET /reports/sales`, `/summary`, `/by-product`, `/export`,
`/:id`, mirrored under `/reports/purchases`. Every route requires
`@Roles('ADMIN', 'SUPER_ADMIN')` — unlike Sales/Purchases' own controllers, which deliberately leave
mutation open to any authenticated account, *reading* a cross-user financial report is a management
concern, not an operational one, so this module is admin-only end to end (`403` for a `USER` token, not
just a hidden sidebar entry).

- **No new tables, no new migration** — this module only ever reads `sales`/`sale_details`/
  `purchases`/`purchase_details`/`products`/`categories`/`suppliers`/`users` via TypeORM
  `QueryBuilder`, registering those ORM entities a second time through its own
  `TypeOrmModule.forFeature([...])` (safe: `autoLoadEntities: true` plus the same entity class registered
  in two modules' `forFeature` is a normal, supported pattern — each module just gets its own
  injection-scoped `Repository<T>`). Every index the report queries filter/sort/join on
  (`sale_date`, `purchase_date`, `user_id`, `product_id`, `category_id`, `supplier_id`) already existed
  from earlier migrations — confirmed before writing a single query, not assumed.
- **No stored function for this module** — every other "critical operation" module in this codebase
  (Sales, Purchases) uses a Postgres function specifically because a multi-step *write* needs
  transactional atomicity. Reports never writes anything; a report is arbitrarily-filtered read-side
  aggregation, which plain TypeORM `QueryBuilder` with `SUM`/`COUNT`/`GROUP BY` already does correctly and
  efficiently — reaching for a stored function here would just be procedure-for-procedure's-sake.
- **The list query (`findAll`) never joins out to `sale_details`/`purchase_details` directly** — same
  "row fan-out" lesson `TypeOrmSaleRepository.findAll` already learned for its own history listing. A
  scalar correlated subquery in the `SELECT` list (`(SELECT COUNT(*) FROM sale_details WHERE
  sale_id = sale.id)`, via `addSelect((qb) => qb.select(...).from(...))`) gives each row its own
  `itemCount` without touching the row count or requiring `getManyAndCount()`. (There's no
  `loadRelationCountAndMap` helper in this project's pinned TypeORM version — the raw-subquery approach is
  the direct replacement, not a workaround.) The category/product filters use the mirror-image
  technique: an `EXISTS` subquery against `sale_details`/`purchase_details` ("this sale has at least one
  matching line"), never a join, so a sale/purchase with 5 lines where only 1 matches the filter still
  shows up exactly once, with `itemCount: 5` (every line in that sale) — not 1 (only the matching line).
- **`getSummary()` runs two separate aggregate queries, not one** — `totalAmount`/`salesCount` (or
  `purchasesCount`) come from a query rooted on `sales`/`purchases` directly (one row per sale, so
  `SUM(total)`/`COUNT(*)` are correct as-is); `unitsSold`/`unitsPurchased` come from a *second* query
  joined out to `sale_details`/`purchase_details` (`SUM(quantity)`), because summing `sale.total` across a
  join fanned out to line items would multiply each sale's total once per matching line — a real bug that
  was caught before it shipped, not after. The two queries share the same date/user/(supplier) filters;
  only the units-sold query additionally filters by category/product against the joined line, since that
  KPI is deliberately scoped to "units matching what I filtered for", unlike a row's `itemCount`.
- **`saleNumber`/`purchaseNumber` (`V-A3CFA14C`, `C-7AF5F14D`) are computed, not stored** — the first 8
  hex characters of the row's own UUID, uppercased, prefixed. This was a deliberate choice over adding a
  real sequential "folio" column: it needed no migration, and — critically — it's stable regardless of
  which filters are active when a report is viewed (a `ROW_NUMBER()`-based sequential folio would change
  depending on what's filtered/sorted, which would be actively misleading for a business document).
- **`GET /reports/sales/:id` and `/reports/purchases/:id` reuse `SalesModule`'s/`PurchasesModule`'s own
  `SALE_REPOSITORY`/`PURCHASE_REPOSITORY.findById`** rather than re-querying the same row a second time —
  each existing use case interface already returns the full entity with every line item, tested and
  correct; `GetSaleReportDetailUseCase`/`GetPurchaseReportDetailUseCase` just add the `saleNumber`/
  `purchaseNumber` folio on top. This is why `SalesModule`, `PurchasesModule`, and `ProductsModule` each
  needed a one-line `exports: [...]` addition (they didn't export their repository token before this
  module needed to reach it) — the only backend changes outside `modules/reports/` itself for this whole
  ticket. `GetSaleReportDetailUseCase` additionally rejects an `OPEN` sale (someone's in-progress draft,
  not a completed transaction) with the same `404` a nonexistent id gets — reports never expose a draft.
- **Date filters are widened, not passed through raw**: `parseReportDateRange()`
  (`application/utils/parse-report-date-range.ts`) turns a plain `yyyy-MM-dd` `startDate` into
  `00:00:00.000` of that day and `endDate` into `23:59:59.999`, so a same-day range still matches
  everything recorded that day — and throws `InvalidDateRangeError` (400) if `startDate > endDate`. Local
  server time throughout, no explicit UTC normalization, consistent with how `CreatePurchaseUseCase`
  already treats `purchaseDate` elsewhere in this codebase.
- **No client/customer filter** — verified there is no customers/clients module or table anywhere in this
  system before writing the filter DTOs, rather than assuming. Nothing was added for it (no dead
  `customerId` query param); if a customers module is ever built, it slots in next to `categoryId`/
  `productId` the same way.
- **PDF export is generated on the backend**, deliberately, not in the frontend: the ticket's own
  "consistencia entre web y PDF" requirement means the PDF must reflect exactly the filters that were
  authorized and applied server-side, not whatever the browser happens to be holding — generating it
  where the filtering already happened is what makes that guarantee automatic rather than something to
  keep in sync by hand. Uses `pdfkit` (added as a new dependency — pure JS, no native compilation, no
  headless-browser/Chromium dependency the way `puppeteer` would need). `infrastructure/pdf/report-pdf.builder.ts`
  is one generic `buildReportPdf()` shared by both `ExportSalesReportPdfUseCase`/
  `ExportPurchasesReportPdfUseCase` — header, period, resolved filter names (never raw UUIDs — each
  export use case injects `CATEGORY_REPOSITORY`/`PRODUCT_REPOSITORY`/`USER_REPOSITORY`/
  `SUPPLIER_REPOSITORY` to resolve an id filter into a display name before handing it to the builder),
  summary tiles, a paginated table with alternating row shading, and numbered pages
  (`doc.bufferedPageRange()` + `switchToPage()`, since page count isn't known until the whole document is
  drawn).
  - **Gotcha already hit and fixed here**: writing the page-number footer at a y-position inside the
    bottom margin (where a footer belongs) made `pdfkit` silently insert a trailing blank page every
    time — it auto-paginates on *any* `.text()` call whose position falls past
    `page.height - page.margins.bottom`, even with an explicit, self-drawn `x`/`y` that has nothing to do
    with its own auto-flowing cursor. The fix is to zero `doc.page.margins.bottom` for just that one write
    (restored immediately after) rather than trying to keep the footer inside the "safe" area — there's no
    y-position for a bottom-margin footer that pdfkit won't flag under its own margin math otherwise.
  - Export is capped at 500 rows (`EXPORT_ROW_LIMIT`) with a note printed in the document when a filtered
    result set exceeds it — the web view still paginates through everything; only the single PDF document
    has a sane ceiling, so a multi-year, unfiltered export can't produce an unbounded file.
  - The controller method takes over the response directly (`@Res() res: Response`, not
    `{ passthrough: true }`) and calls `res.send(buffer)` itself — the only way to get a raw
    `application/pdf` binary body past the global `ResponseInterceptor`, which would otherwise wrap
    anything returned normally as `{ success, data }` JSON and corrupt it.
- **`businessId` filter** (follow-up addition — same shape as `categoryId` everywhere it appears):
  `SalesReportFilters`/`PurchasesReportFilters`, both query DTOs, every use case, and both export use
  cases (which resolve it to a display name via `BUSINESS_REPOSITORY.findById`, same as `categoryId`)
  all carry it. In the query builders it's threaded through exactly where `categoryId` already was — the
  `EXISTS` subquery in `applyProductExistsFilter` (for `findAll`/the totals half of `getSummary`, both
  rooted on `sales`/`purchases`) and the direct `product.businessId = :businessId` equality in
  `applyProductFilters` (for the units-sold half of `getSummary` and `getByProduct`, both already joined
  to `products`) — `ReportsModule` needed one more import, `BusinessesModule` (already exported
  `BUSINESS_REPOSITORY`, so no module-level change there).

### Recargas Electrónicas (`modules/recharges/`) — the module with three stored functions, not one

`modules/recharges/` tracks daily electronic-airtime balances (Claro, Tigo, extensible) per the operator
lookup table `recharge_types` — mirrors `categories`' shape exactly (id/name/isActive, seeded via raw
`INSERT` inside its own migration, no controller for mutating it in v1: adding a third operator today
means a migration `INSERT`, not an admin screen). `GET /recharges/types`, `GET /recharges/daily`,
`POST /recharges/purchases`, `PATCH /recharges/daily/:id/final-balance`, `GET /recharges/history` — no
class-level `@Roles(...)` (`RechargesController`), same "operational, any authenticated active account"
policy as Sales/Purchases: registering a purchase or closing a day's balance the first time is a
register-clerk action. The one elevated rule (see "Permissions" below) lives inside a use case, not a
guard.

- **Three Postgres stored FUNCTIONS, not one** (migration `1757500000000-CreateRechargesModule`) — more
  than any other module in this codebase, because this ticket has three genuinely separate atomic
  operations instead of one:
  - **`ensure_recharge_daily_balance(p_recharge_type_id, p_date, p_user_id) RETURNS UUID`** — finds
    today's `(type, date)` row or lazily creates it, with `previous_balance` copied from the most recent
    **prior** day that has a non-null `final_balance` for that type (`ORDER BY date DESC LIMIT 1`,
    `COALESCE`d to `0` for the legitimate first-ever-day case) — this is the entire mechanism behind
    "Saldo Anterior is automatic": nothing ever writes it directly, it's always derived from the last
    *closed* day, however many days ago that was (a day with no purchases and no close is simply skipped
    over by the `WHERE final_balance IS NOT NULL` filter, not treated as a break in the chain).
    Concurrency: `INSERT ... ON CONFLICT (recharge_type_id, date) DO NOTHING RETURNING id`, then a
    re-`SELECT` if the insert lost the race — deliberately the simpler "conflict + re-select" pattern
    rather than the exception-catching one Sales' `adjust_sale_item` uses for its own analogous race,
    chosen because this table's unique constraint (`UQ_recharge_daily_balances_type_date`) is a plain
    two-column index, not a partial one.
  - **`register_recharge_purchase(p_recharge_type_id, p_date, p_amount, p_user_id) RETURNS UUID`** (the
    daily-balance id) — validates the type exists and is active, validates `p_amount > 0`, calls
    `ensure_recharge_daily_balance` internally, locks the daily-balance row `FOR UPDATE`, **rejects if the
    day is already closed** (`final_balance IS NOT NULL` → `DAY_ALREADY_CLOSED`, a deliberate rule not
    explicitly requested by the ticket but necessary to stop a purchase from silently invalidating an
    already-recorded `sale` figure), inserts a `recharge_purchases` movement row, then
    `UPDATE ... SET daily_balance = daily_balance + p_amount`. Always called against **today only** —
    `POST /recharges/purchases` never accepts a client-supplied date (`todayIsoDate()`,
    `application/utils/today-iso-date.ts`, computed server-side) — closing off backdating entirely.
  - **`register_recharge_final_balance(p_daily_balance_id, p_final_balance, p_user_id) RETURNS VOID`** —
    locks the row, rejects `NULL`/negative (`INVALID_FINAL_BALANCE`), rejects
    `p_final_balance > daily_balance` (`FINAL_BALANCE_EXCEEDS_DAILY` — the ticket's explicit core
    validation), then writes it. Running this again on an already-closed day simply overwrites
    `final_balance` — the function itself doesn't care who's allowed to do that; see "Permissions" below.
  - Same reasoning as every other stored-function module here (Sales/Purchases): a `FUNCTION`, not a
    `PROCEDURE`, runs inside the caller's transaction, so any `RAISE EXCEPTION` — all three functions use
    the identical `'CODE:id'` convention (`RECHARGE_TYPE_NOT_FOUND`, `RECHARGE_TYPE_INACTIVE`,
    `INVALID_AMOUNT`, `DAY_ALREADY_CLOSED`, `DAILY_BALANCE_NOT_FOUND`, `INVALID_FINAL_BALANCE`,
    `FINAL_BALANCE_EXCEEDS_DAILY`) — rolls back every write it made, no explicit `BEGIN`/`COMMIT` needed.
    `TypeOrmRechargeDailyBalanceRepository.translateRechargeError()` parses these into the matching
    domain error the identical way `translateSaleError`/`translatePurchaseError` already do.
- **Derive, don't duplicate, applied twice in this module**: `totalPurchases` and `sale` are never
  columns — `RechargeDailyBalance` (domain entity) exposes them as computed getters
  (`dailyBalance - previousBalance`, and `finalBalance === null ? null : dailyBalance - finalBalance`),
  read fresh off whatever `dailyBalance`/`previousBalance`/`finalBalance` the row currently holds. This is
  also why `recharge_purchases` — the individual-movement audit trail the ticket explicitly required —
  has **no ORM entity or listing endpoint in v1**: nothing in TypeScript needs to read it back yet, only
  the stored functions write to it (documented in `recharges.module.ts` as a deliberate, easily-extended
  scope call, not an oversight); `totalPurchases` for the daily table is already fully answered by the
  aggregate column alone.
- **`recharge_purchases.daily_balance_id` is the one `CASCADE` FK in this module** (the other two —
  `recharge_type_id` on both tables, `created_by`/`updated_by` on `recharge_daily_balances` — are all
  `RESTRICT`) — a purchase movement has no independent existence outside the daily total it fed into; if
  that daily-balance row were ever removed, its movement rows should go with it. In practice nothing
  currently deletes a `recharge_daily_balances` row at all (there's no `DELETE` endpoint), so this is
  forward defense, not a path that's actually exercised today.
- **Permissions, the one place this module's rule differs from a route guard**: the *first* close of a
  day (`final_balance` currently `NULL`) is operational, same "any authenticated active account" policy as
  the rest of the controller. **Re-editing an already-closed day is admin-only** —
  `RegisterRechargeFinalBalanceUseCase` throws `FinalBalanceEditForbiddenError` (403) when
  `existing.finalBalance !== null && !isAdmin`, computed in `RechargesController.registerFinalBalance` from
  the caller's JWT role (`ADMIN_ROLES.includes(user.role)`) and passed into the use case — deliberately an
  application-layer check, not `@Roles(...)`, because it depends on the *target row's current state*, not
  a static permission a guard could decide from the route alone. The stored function itself enforces
  none of this (its own comment says so explicitly) — same "the SQL function does data integrity, the use
  case does authorization" split as everywhere else critical operations exist in this codebase.
- **Date handling is intentionally the tightest in the app**: `GET /recharges/daily` and
  `POST /recharges/purchases` accept **no date parameter at all** — both always operate on
  `todayIsoDate()`, computed server-side, so there is no request field to manipulate for backdating a
  write. `PATCH /recharges/daily/:id/final-balance` targets a specific existing row by id, so it needs no
  date param either. Only `GET /recharges/history` (read-only, paginated, `startDate`/`endDate`/
  `rechargeTypeId`/`userId` filters, `DEFAULT_PAGE`/`DEFAULT_LIMIT`/`MAX_LIMIT` matching Reports' own
  pagination constants) accepts a date range — and even there, `date` being a plain Postgres `DATE`
  column (not `timestamptz`) means a lexicographic `yyyy-MM-dd` string comparison is already correct with
  no start/end-of-day widening needed, unlike Reports' own `sale_date`/`purchase_date` filters.
- **`@Column({ type: 'date' })` hydrates as a plain string, not a JS `Date`** — confirmed directly (not
  assumed) before writing `RechargeDailyBalanceMapper`: this TypeORM version returns a `date`-typed
  column as a `yyyy-MM-dd` string on every entity read, so `orm.date` is used as-is everywhere in this
  module, with none of the UTC-offset conversion Reports' raw-query date handling needs elsewhere.
- **No frontend list/history screen was built** for `GET /recharges/history` — same situation as Sales'
  `GET /sales`/Purchases' `GET /purchases`: the endpoint exists, is paginated and filterable, and is
  ready for a future screen, but the ticket's frontend section only asked for the daily
  register/purchase/close-day screen. `RechargesService.getHistory()` was deliberately not added to the
  frontend service for this reason — add it alongside a future history view, not speculatively now.

#### Resumen de Ventas y Cuadre (follow-up addition — daily cash reconciliation)

Added after the Recargas module first shipped, in response to a follow-up ticket: a daily "cuadre" that
compares the day's real recharge sales against what was actually collected in cash. `GET
/recharges/sales-summary` (any authenticated, read) and `POST /recharges/sales-closure` (any
authenticated for the first save of the day; admin-only to re-save — identical split to
`register_recharge_final_balance`'s own permission rule) are additive to the controller above, no
existing route changed.

- **New table `recharge_sales_closures`** (migration `1757600000000-CreateRechargeSalesClosures`) — one
  row per calendar day (`UQ_recharge_sales_closures_date`), columns `date`/`total_sales`/
  `total_collected`/`result`/`created_by`/`updated_by`/timestamps. **Deliberately has no per-type
  (Claro/Tigo) breakdown columns and no separate detail table** — `recharge_daily_balances` rows are
  never deleted, so a per-type breakdown for *any* date, today or historical, can always be reconstructed
  live via `WHERE date = :date` on that table; storing it a second time here would be exactly the kind of
  redundant duplication the "derive, don't duplicate" rule (Reports, `RechargeDailyBalance.totalPurchases`/
  `.sale`) exists to avoid. `total_sales`/`total_collected`/`result` themselves ARE stored, though,
  unlike a live-derived value — a closure is a frozen historical snapshot the moment it's saved, and must
  stay exactly what it was even if a later admin correction to some type's `finalBalance` would change
  what the *live* sales figures currently compute to.
- **`register_recharge_sales_closure(p_date, p_total_collected, p_user_id) RETURNS UUID`** — the one new
  stored function (same FUNCTION-not-PROCEDURE reasoning as every other critical operation in this
  codebase). It **never trusts a client-supplied sales total** — it recomputes `total_sales` itself by
  summing `daily_balance - final_balance` across every `recharge_daily_balances` row for that date
  (`FOR UPDATE` while summing, so a concurrent purchase/final-balance write can't change a figure
  mid-calculation), then upserts the one row for that date via `INSERT ... ON CONFLICT (date) DO UPDATE`.
  A type with no row at all for that date (never touched) simply contributes `0` — a slow day with zero
  activity on one operator is a valid cuadre, not an error. A type that WAS touched but has no
  `final_balance` yet blocks the whole closure with `PENDING_TYPE_CLOSURE:<recharge_type_id>` — this is a
  deliberate business rule, not explicitly requested but reasoned as necessary: closing the day's cash
  reconciliation before every touched operator's saldo final is registered would silently under-count
  `total_sales`. Verified directly: attempting the closure while Tigo still had no `finalBalance` for the
  day correctly rejected with `400`/`PENDING_TYPE_CLOSURE`; closing Tigo first, then retrying, succeeded.
- **`totalClaro`/`totalTigo` are the one hardcoded-by-name spot in this whole module** —
  `GetRechargeSalesSummaryUseCase` resolves them by matching `rechargeTypeName` against a small
  `KNOWN_RECHARGE_TYPE_NAMES` constant, deliberately, even though `recharge_types` itself stays fully
  normalized/extensible. This was a considered trade-off, not an inconsistency: the ticket's own JSON
  contract explicitly names these two fields, and the summary Card's layout is genuinely two fixed rows
  today; adding a third operator later means adding one more named field to this one DTO (a small,
  contained, non-migration cost), not a schema change — over-generalizing this single response shape into
  a generic per-type array would have been solving a problem nothing asked for yet.
- **`GET /recharges/sales-summary` always live-recomputes `totalClaro`/`totalTigo`/`totalSales`** from
  today's actual `recharge_daily_balances` rows (via the new `RechargeDailyBalanceRepository.
  findAllByDate()` method) — **never** from a saved closure's own frozen `total_sales`, even when one
  exists for today. `totalCollected`/`difference`/`savedClosure` are the only fields sourced from the
  saved closure (`RechargeSalesClosureRepository.findByDate()`), and are `null`/`false` until one exists.
  This means a drift between the live totals and a previously-saved closure's frozen total is a real,
  intentionally-surfaced signal (it means an admin corrected a `finalBalance` after the day was already
  closed) — the endpoint doesn't try to silently reconcile it; re-saving (admin-only) is the explicit fix.
- **`RegisterRechargeSalesClosureUseCase` injects `GetRechargeSalesSummaryUseCase` directly** and delegates
  its own response to it after writing — the one place in this codebase a use case depends on another use
  case rather than only on repository interfaces, done specifically to satisfy the ticket's own "no
  duplicar lógica existente" instruction (both endpoints need the identical
  totalClaro/totalTigo/totalSales/totalCollected/difference/savedClosure shape; POST's response is just
  "the same summary, freshly re-read after the write").
- **Mass-assignment protection is what actually stops `totalClaro`/`totalTigo`/`result` manipulation from
  the frontend** — `RegisterRechargeSalesClosureRequestDto` has exactly one field, `totalCollected`
  (`@IsNumber`, `@Min(0)`); the global `ValidationPipe`'s `forbidNonWhitelisted: true` rejects a request
  body that includes any other property with `400` before the controller method is ever called. Verified
  directly: a request body containing `totalClaro`/`totalTigo`/`result` alongside a valid `totalCollected`
  was rejected with `"property totalClaro should not exist"` (and the same for the other two), not
  silently ignored.
- **No history endpoint was built for closures**, matching the ticket's own "no es necesario crear una
  pantalla... pero dejar el backend y modelo preparados" instruction — `recharge_sales_closures` accumulates
  one row per day going forward, which is already everything a future history view would need
  (`RechargeSalesClosureRepository` only has `findByDate`/`registerClosure` today; a `findAll`/paginated
  listing method is the natural, low-risk addition when that screen is actually requested).

#### Operation-date picker (follow-up — every write now accepts a caller-supplied date)

Added after the module first shipped: the frontend gained a "Fecha de operación" date picker
(default today), and every read/write in this module now accepts that date instead of the server
silently assuming "today". This is a genuine, deliberate reversal of the original "no client-supplied
date, ever" security posture documented earlier in this file — the ticket explicitly asked for it
("catch up on a day I forgot to close"), and the mitigation is the same one already established for
Purchases' own `purchaseDate` (see "Suppliers (Proveedores) and Purchases (Compras)" above): accept a
past date freely, reject anything meaningfully in the future.

- **No migration and no stored-function changes were needed for this** — `ensure_recharge_daily_balance`,
  `register_recharge_purchase`, and `register_recharge_sales_closure` already accepted a `p_date`
  parameter from the very first version of this module; the application layer had simply always called
  them with a hardcoded `todayIsoDate()`. This ticket is almost entirely an application/presentation-layer
  change — a caller-supplied date now flows through where a hardcoded one used to. `register_recharge_
  final_balance` needed no change at all: it already operates on a specific `daily_balance_id`, which
  already uniquely identifies a (type, date) row — there was never a date to hardcode there.
- **`assertValidOperationDate()`** (`application/utils/assert-valid-operation-date.ts`) is the one new
  guard, applied at the top of all four use cases that now take a date
  (`GetRechargeDailySummaryUseCase`, `RegisterRechargePurchaseUseCase`, `GetRechargeSalesSummaryUseCase`,
  `RegisterRechargeSalesClosureUseCase`). It mirrors `CreatePurchaseUseCase`'s `FUTURE_DATE_GRACE_MS`
  reasoning (absorb client/server clock and timezone skew around "today") but expressed in **whole
  calendar days**, not milliseconds — `maxAllowedOperationDate()` (`today-iso-date.ts`) is simply
  tomorrow's date in server-local time; any `date > ` that is rejected with `InvalidRechargeDateError`
  (400). Genuine backdating into the past is unrestricted, by design — that's the entire point of this
  feature, not an oversight.
- **Applied to reads too, not just writes** — `GET /recharges/daily` and `GET /recharges/sales-summary`
  both validate their optional `?date=` the same way, because the daily-summary read is not actually
  side-effect-free: it lazily creates a `recharge_daily_balances` row via `ensure_recharge_daily_balance`
  if one doesn't exist yet for that date. Without this check, browsing to a future date would silently
  create a "phantom" row for a day that hasn't happened, which the frontend's own `[max]` on the date
  input already prevents from the UI, but the API itself must not rely on that alone (this module's
  own standing "no confiar únicamente en el frontend" rule, restated by this ticket).
- **Query param is `date`, body field is `operationDate`** — a deliberate split, not an inconsistency:
  matches the ticket's own two example shapes exactly (`GET /recharges/daily?date=...` vs.
  `{ "operationDate": "...", "totalCollected": ... }`), and reads naturally either way (`?date=` filters
  a query the same way Reports' `startDate`/`endDate` already do; `operationDate` names what a purchase
  or a cuadre *is for* inside a request body, the same way `purchaseDate` already does on
  `CreatePurchaseRequestDto`). `RechargeDailyQueryDto`/`RechargeSalesSummaryQueryDto`
  (`@IsOptional() @IsDateString()`) are new, tiny, and both default to `todayIsoDate()` server-side when
  omitted — the endpoints' pre-existing "always today" behavior for a bare `GET` with no query string is
  fully preserved, this is additive only.
- **Verified directly, end to end**: a purchase and a full cuadre registered against a backdated date
  (`2026-08-20` in this session's test data) left the same day's *actual* today untouched — confirmed by
  re-fetching both dates' `/daily` and `/sales-summary` responses and seeing zero cross-contamination in
  either direction; a future date beyond the one-day grace was rejected with `InvalidRechargeDateError`
  on both a write (`POST /recharges/purchases`) and a read (`GET /recharges/daily?date=...`); omitting
  `operationDate` from either write body was rejected by `@IsDateString()` before the use case ever ran.

#### Cuadre cycles (follow-up — "Guardar cuadre" now also means "empezar de nuevo")

Added right after the operation-date picker: saving a cuadre now also **resets** every recharge type's
row for that same date, so a second (third, fourth, ...) cuadre can be registered on the same calendar
date instead of at most one ever. This turns the model from "one `recharge_daily_balances` row per
(type, date)" into "one row per (type, date, **cycle**)" — migration
`1757700000000-AddRechargeCuadreCycles`.

- **A new `sequence` integer column** was added to both `recharge_daily_balances` (unique index widened
  from `(recharge_type_id, date)` to `(recharge_type_id, date, sequence)`) and `recharge_sales_closures`
  (widened from `(date)` to `(date, sequence)`). Existing rows all defaulted to `sequence = 1` — every
  row that existed before this migration genuinely was a first (and, until now, only possible) cycle, so
  no backfill logic was needed beyond the column default.
- **"The row for (type, date)" now means "the highest-`sequence` row for (type, date)"** everywhere that
  phrase applied before — `ensure_recharge_daily_balance` resolves it via `ORDER BY sequence DESC LIMIT 1`
  instead of a bare lookup; `TypeOrmRechargeDailyBalanceRepository.findAllByDate`/`findByTypeAndDate` do
  the equivalent in TypeScript (fetch every row for the date, keep only the first — i.e. highest-sequence
  — one seen per type, since the query is already ordered `sequence DESC`). This is what keeps
  `GET /recharges/sales-summary` showing only the CURRENT cycle's `totalClaro`/`totalTigo`/`totalSales`
  after one or more resets on the same date, not a running total across every cycle ever closed that day.
- **`register_recharge_sales_closure` gained a fourth parameter, `p_is_admin`, and now does two things
  atomically**: closes the CURRENT cycle (summing `daily_balance - final_balance` across each type's
  latest-sequence row, same `PENDING_TYPE_CLOSURE` guard as before), then — **only on that cycle's
  genuine first close** — inserts a fresh `sequence + 1` row for every type just closed, with
  `previous_balance` set to that type's just-recorded `final_balance`. This single mechanism is what
  makes "Saldo Anterior" of the new cuadre automatically equal "Saldo Final" of the one just closed,
  exactly as requested — no separate carry-forward step, it falls out of `ensure_recharge_daily_balance`'s
  existing "find the latest row, or derive `previous_balance` from the most recent closed cycle" logic
  the moment the very next purchase or page load touches this date again.
- **Gotcha caught and fixed during this session's own testing**: the first version of this function
  combined `FOR UPDATE` with `SELECT DISTINCT ON (recharge_type_id)` in one query to lock only each
  type's current-cycle row — Postgres flatly rejects `FOR UPDATE` combined with `DISTINCT` in the same
  `SELECT` (`FOR UPDATE is not allowed with DISTINCT clause`), which only surfaced as a real `500` once
  a full purchase→close→cuadre flow was exercised end-to-end, not at `tsc`/build time. Fixed by resolving
  the target row ids in a plain (lockable) outer `SELECT ... WHERE id IN (subquery)`, with the `DISTINCT
  ON` confined to the inner subquery instead — the general lesson: `DISTINCT`/`DISTINCT ON` and
  `FOR UPDATE` can never share one `SELECT` level in Postgres, full stop; push whichever one you don't
  need at the lock level into a subquery.
- **The admin-only re-edit rule moved from the use case into the function itself**, a deliberate
  departure from `register_recharge_final_balance`'s equivalent rule (which stays in
  `RegisterRechargeFinalBalanceUseCase`): final balance's target row always already exists, found by its
  own id, before the "is this a re-edit" question is asked, so there's no race to close. Here, "does a
  closure already exist for this cycle" and "insert one" have to happen atomically together, or two
  concurrent first-saves could both observe "no closure yet" and both slip past an application-layer
  check — the exact TOCTOU gap the *original* (pre-cycles) version of this use case actually had, just
  never exercised. Fixed using the same `EXCEPTION WHEN unique_violation` "first write wins, losers
  re-check" idiom `adjust_sale_item` already established elsewhere in this codebase, chosen over a plain
  `ON CONFLICT` specifically because the reset side effect must run exactly once — only for the genuine
  first insert, never for a losing race or a later correction (cycle N+1 may already be mid-flight by the
  time an admin corrects cycle N's recaudado figure).
- **In practice, the admin-lock is now almost unreachable through normal use** — since a successful save
  always immediately advances to a new cycle, and every read/write always resolves "the current cycle"
  fresh from `recharge_daily_balances` rather than accepting a client-supplied cycle number, there is no
  UI path back to an already-reset, historical cycle's closure to "re-edit" anymore. It was deliberately
  **kept**, not removed, for the one real (if rare) case it still protects: a genuine concurrent race
  between two simultaneous first-saves of the same still-open cycle, where the request that loses the
  race would otherwise silently overwrite the winner's just-recorded totals.
- **Full history is preserved, not overwritten** — verified directly: closing a test date's cycle 1
  (`total_sales=550, total_collected=550, result=0`), registering new purchases, closing cycle 2
  (`total_sales=375, total_collected=375, result=0`), then querying `recharge_sales_closures` showed
  **both** rows intact (`sequence 1` and `sequence 2`), and `recharge_daily_balances` showed all three
  cycles per type (1 and 2 closed, 3 freshly open) — nothing from the first cuadre was ever deleted or
  silently replaced by the second.
- **`RechargeDailyBalanceOutput`/`RechargeSalesSummaryOutput` (the JSON the frontend receives) deliberately
  do NOT expose `sequence`** — the frontend has no reason to know or reason about cycle numbers; every
  endpoint already resolves "the current cycle" transparently server-side, so the concept stays purely
  internal to `recharges/domain`/`recharges/infrastructure`. Only the domain entities and ORM entities
  carry it.

#### Reportería de Recargas Electrónicas (follow-up — a third report joins Sales/Purchases')

Added after Reportería (Ventas/Compras) already existed: `GET /reports/recharges`, `/summary`, `/export`,
admin-only (`@Roles('ADMIN', 'SUPER_ADMIN')`, same as every other `/reports/*` route), filterable by
`startDate`/`endDate`/`rechargeTypeId`. Deliberately **simpler** than the Sales/Purchases reports — no
`/:id` detail route, no by-product breakdown, no `businessId`/`categoryId`/`userId` filters — because a
`recharge_daily_balances` row already *is* the full detail (saldo anterior/compra/saldo del día/saldo
final/venta on one row, nothing to drill into), and Recargas has no product/category/business dimension to
group by in the first place.

- **The list endpoint reuses `RechargesModule`'s own `GetRechargeHistoryUseCase` directly** — no new
  read/list code was written for this. `RechargesModule` gained one new `exports: [...]` entry
  (`RECHARGE_TYPE_REPOSITORY`, `RECHARGE_DAILY_BALANCE_REPOSITORY`, `GetRechargeHistoryUseCase`) so
  `ReportsModule` can import it and inject that use case straight into `RechargesReportController`,
  identical in spirit to how Sales'/Purchases' own report `/:id` routes already reuse
  `SALE_REPOSITORY`/`PURCHASE_REPOSITORY.findById` instead of re-querying. `GetRechargeHistoryUseCase` was
  already paginated/filterable/date-range-validated (see "Recargas Electrónicas" above,
  `GET /recharges/history`) — this endpoint is that same use case, just reachable under `/reports/recharges`
  with an `@Roles(...)` guard on top instead of the operational controller's open one.
- **One genuinely new repository method**: `RechargeDailyBalanceRepository.getReportSummary(options):
  Promise<RechargeReportSummary>` (`{ recordCount, closedCount, totalPurchases, totalSales }`) — a true
  SQL-level `SUM`/`COUNT` aggregate via `QueryBuilder`
  (`SUM(balance.dailyBalance - balance.previousBalance)` for purchases,
  `SUM(CASE WHEN balance.finalBalance IS NOT NULL THEN balance.dailyBalance - balance.finalBalance ELSE 0
  END)` for sales, `COUNT(CASE WHEN balance.finalBalance IS NOT NULL THEN 1 END)` for closed cycles), not
  an in-memory sum over a fetched page — matching the correctness bar Sales'/Purchases' own report
  `getSummary()` methods already set (see "Reports" above: summing an aggregate over a page would silently
  undercount whatever didn't fit the page). `GetRechargesReportSummaryUseCase` computes `averageSale =
  closedCount > 0 ? totalSales / closedCount : 0` on top of that raw aggregate — average is a display
  concern of the summary DTO, not something worth a second SQL round-trip for.
- **No `parseReportDateRange()` widening here, unlike Sales/Purchases** — Recargas' `date` column is a
  plain Postgres `DATE` (see "Recargas Electrónicas" above), so `getReportSummary()`'s date filters use the
  same safe lexicographic `yyyy-MM-dd` string comparison (`balance.date >= :startDate`/`balance.date <=
  :endDate`) `GET /recharges/history` already relies on — reaching for the Date-object start/end-of-day
  widening Reports' `sale_date`/`purchase_date` filters need would have been solving a problem this column
  type doesn't have. `GetRechargesReportSummaryUseCase` still throws `InvalidRechargeDateRangeError`
  (reused from the recharges module, not a new error type) when `startDate > endDate`.
- **PDF export reuses the exact same generic `buildReportPdf()`** Sales/Purchases already use, zero
  modification — confirmed generic enough before writing `ExportRechargesReportPdfUseCase`, not assumed.
  Columns: Fecha | Tipo | Saldo Anterior | Compra | Saldo del Día | Saldo Final | Venta | Usuario; summary
  tiles: Total comprado, Total vendido, Registros, Promedio de venta. Same `EXPORT_ROW_LIMIT = 500` ceiling,
  same `@Res()` direct-response bypass of `ResponseInterceptor`, same filter-name resolution before it ever
  reaches the builder (`rechargeTypeId` → type name via `RECHARGE_TYPE_REPOSITORY.findById`, the module's
  own local `formatRechargeDate()`/`formatRechargePeriodLabel()` helpers format the plain `yyyy-MM-dd`
  strings as `dd/mm/yyyy` without ever round-tripping through a JS `Date`, consistent with the no-Date-object
  rule above).
- **Verified directly**: list with a real date range returned 10 records across two dates; summary totals
  cross-checked by hand against those same rows; type-filtered summary recomputed correctly; PDF export via
  curl produced a valid single-page PDF (`file` command); a `USER`-role token got `403` on both the list and
  export routes; the frontend's "Exportar PDF" button was clicked live in the browser with a Tigo filter
  applied and the resulting `GET /api/reports/recharges/export?...&rechargeTypeId=...` request (confirmed
  via the browser's own network panel) returned `200` with exactly the filters shown on screen; a
  Tigo-filtered PDF fetched directly afterward matched the on-screen filtered table row-for-row and
  total-for-total.
- **A real hazard this session surfaced, worth naming explicitly**: this feature's own live-testing (both
  a background research/implementation pass and a follow-up manual verification pass) exercised the actual
  operational Recargas screen against the two dates the seeded admin's real historical data already lived
  on, leaving behind extra test cycles mixed into real records. Because `ensure_recharge_daily_balance`/
  `register_recharge_sales_closure` are the same functions real usage and browser testing both go through,
  there is no structural way to tell "test" cycles apart from real ones after the fact except by
  `created_at` timestamps and manual reasoning about what each cycle's numbers imply — this was caught only
  by comparing summary totals against expectations and cross-referencing `created_at` across
  `recharge_daily_balances`/`recharge_sales_closures`. The general lesson for future work on this module:
  live-verifying Recargas' write endpoints (purchases, final balance, cuadre) should use an untouched test
  date (`2026-0X-XX`, never the current real operating date) whenever the seeded/demo account already has
  real-looking data on today's date, precisely because this module's own design (any authenticated account,
  no confirmation step) makes it trivially easy to blend fabricated test data into what looks like genuine
  history.

### Inventario por ubicación y presentaciones (`modules/inventory/`)

Evolves Inventario from "producto → stock global" to "producto → presentaciones → ubicaciones → stock",
added via migration `1759400000000-CreateInventoryLocationsAndPresentations`. Purely additive:
`products.stock` is **kept** as the running total (`SUM(inventory_stock.quantity)` for that product,
updated in lockstep by every function below), so every existing reader of it keeps working unchanged.

- **Four new tables**: `inventory_locations` (extensible, seeded "Bodega"/"Vitrina" — a third location is
  a plain `INSERT`, never a migration), `product_presentations` (per-product sellable/purchasable unit —
  "Unidad", "Caja", "Paquete", ... — each with its own `conversion_factor` to base units and its own
  cost/public price; every product always has exactly one "Unidad" presentation, factor 1, auto-created),
  `inventory_stock` (the new granular source of truth, base units, one row per `(product, location)`),
  `inventory_movements` (audit trail for **confirmed** operations only — compra, venta confirmada,
  traslado — never for in-flight cart adjustments). `sale_details`/`purchase_details` gained nullable
  `presentation_id`/`location_id`/`conversion_factor`/`quantity_base_units` — historical rows keep these
  `NULL` forever, never backfilled.
- **`ensure_product_presentation(productId, presentationId)`** is the one shared resolver every function
  below calls: an explicit id is validated (belongs to the product, active) or `NULL` resolves to that
  product's own "Unidad" row. **`ensure_inventory_stock_row(productId, locationId)`** guarantees a
  `(product, location)` row exists via `INSERT ... EXCEPTION WHEN unique_violation THEN NULL` — same
  "insert, swallow the race, let the caller's own `FOR UPDATE` lock it" pattern `adjust_sale_item`'s own
  `OPEN`-sale creation already established.
- **Every write path that touches stock now also touches `inventory_stock`, in lockstep with
  `products.stock`, inside the same stored function**: `confirm_purchase` always enters "Bodega";
  `adjust_sale_item`/`confirm_sale` always reserve from "Vitrina" by default (an explicit
  `p_location_id` is accepted but nothing in the frontend sends one yet); `cancel_open_sale` restores each
  line to whichever location it was actually reserved from (`COALESCE`d to Vitrina for any draft that
  predates this migration). This is the one real, ticket-required behavior change: ventas de mostrador
  now draw down Vitrina's stock specifically, not an undifferentiated global number.
- **`register_inventory_transfer(productId, presentationId, fromLocationId, toLocationId, quantity,
  userId, reason?)`** — the new write path, moving stock between two locations. **Never touches
  `products.stock`** (a transfer changes location, not total — the cross-location sum is identical before
  and after, by construction). Locks origin-then-destination in a fixed `id` order (same
  deadlock-avoidance principle as `CreateSaleUseCase`'s productId sort) so two concurrent transfers of the
  same location pair, in either direction, can never deadlock. Writes two `inventory_movements` rows
  (`TRASLADO_SALIDA`/`TRASLADO_ENTRADA`) sharing one `reference_id` so the UI can group them as one
  "Traslado". `RegisterInventoryTransferUseCase` pre-validates quantity-is-a-positive-integer and
  origin≠destination for a fast, clean error — the SQL function's own `FOR UPDATE` locks are the real
  guard against a race, same "TypeScript pre-check + SQL is the real guarantee" split every other critical
  operation in this codebase uses.
- **Presentations are admin-only to create/update** (`InventoryController`, `@Roles('ADMIN',
  'SUPER_ADMIN')` on both), reading is open to any authenticated account (needed by the Compras/Ventas
  product pickers and the Inventario screen). Registering a transfer is operational — same "any
  authenticated active account" policy as Compras/Ventas/Recargas, since moving stock between your own
  two locations is a daily register task. `CreatePresentationUseCase` never lets a second "Unidad" be
  created (it's auto-created once by `CreateProductUseCase`); `UpdatePresentationUseCase` lets "Unidad"
  have its prices updated (purchases already do this automatically) but never its name, factor, or active
  state (`UnidadPresentationImmutableError`) — every purchase/sale that omits a presentation depends on it
  always existing with factor 1. A presentation already used in a movement/purchase/sale is only ever
  deactivated, never deleted — same soft-delete convention as everywhere else in this app.
- **`GET /inventory/products/:productId`** (`GetProductInventoryUseCase`) is what backs the new product
  detail page — per-location stock breakdown, active presentations, and recent movements for one product,
  assembled from three repositories rather than a single query, since nothing else in the app needed that
  join before this feature.
- **No `down()` migration provided** — this migration closes real correctness gaps (a missing
  `stock >= 0` CHECK `products` never had, the global-only stock model) that live rows may already depend
  on by the time a rollback would run. Same "no downgrade for a structural/correctness change" precedent
  as `AddRechargeDayGateToWriteFunctions`.

### Venta por mayor — wholesale pricing (extension to Sales)

Migration `1759500000000-AddWholesalePricingToSales` lets a sale be tagged with an optional `clientId` and
a `priceList` (`'PUBLIC' | 'WHOLESALE'`), chosen once at the start of the sale and **locked once the
receipt has any line item**. Purely additive — historical and in-progress sales default to
`price_list = 'PUBLIC'`, `client_id = NULL`, byte-identical to the prior (implicit) behavior.

- **`products.wholesale_price` already existed** (required at product creation) but until this migration
  was never read by any sale function — `adjust_sale_item`/`confirm_sale` only ever charged
  `public_price`. This is what makes it actually mean something — **and only for the base "Unidad"
  presentation**: a line sold by a presentation (Caja, Paquete...) keeps using that presentation's own
  `public_price` regardless of the sale's price list, a deliberate scope call (presentations are already
  the bulk-discount mechanism; this feature is about which *client tier* buys, not a second discount on
  top of the first).
- **`configure_open_sale(userId, clientId?, priceList?)`** is the new stored function — sets/updates the
  caller's open receipt's client and price list, creating the receipt if it doesn't exist yet (same
  race-safe insert/catch-`unique_violation`/re-select pattern `adjust_sale_item` already uses against the
  same `UQ_sales_open_per_user` partial index). The client can be changed freely at any time (pure
  attribution, no pricing/stock impact); **the price list can only be changed while the receipt has zero
  line items** — once a line exists, its `unit_price` was already fixed under the price list active at
  that moment, and silently changing the list without recomputing every line would leave the receipt
  internally inconsistent. This lock is enforced inside the function itself (has to run atomically against
  the row it locks), not in `ConfigureSalePricingUseCase` — that use case only pre-validates `clientId`
  (exists + active, `InvalidClientError`) before ever reaching SQL, same "validate the FK in TypeScript,
  let SQL own the state-dependent rule" split as everywhere else.
- **`PATCH /sales/current/pricing`** (any authenticated, active account, no `@Roles(...)`) is the new
  route — call once, before or while the cart is empty. `POST /sales` (the bulk, one-shot path) and
  `CreateSaleUseCase` also gained optional `clientId`/`priceList` fields for the same reason the bulk path
  still exists at all: it's a separately-tested public API, kept in sync rather than left to drift.

### Varias ventas a la vez — multiple simultaneous drafts (follow-up, migration `AddDraftKeyToSales`)

Ventas gained the ability for one user to have several open receipts ("pestañas") at once, mirroring
Compras' own multi-draft frontend feature (see the frontend `CLAUDE.md`) — but unlike Compras, a Ventas
draft is a real, server-persisted `OPEN` sale with stock already reserved, gated at the DB level by
`UQ_sales_open_per_user` (see "Real-time draft sales" above: at most one such row per user, the mechanism
behind real-time stock reservation). Supporting several open receipts per user therefore required a real
backend change, not just a frontend one.

- **`sales.draft_key`** (`VARCHAR(64)`, nullable) is an opaque, client-generated id — the frontend uses a
  UUID per open tab, but the column is deliberately **not** validated as a UUID anywhere (DTOs use
  `@IsString() @IsNotEmpty() @MaxLength(64)`, not `@IsUUID()`) — a pre-existing `OPEN` sale from before
  this column existed was backfilled to the literal string `'default'`, which must keep working
  end-to-end (confirmed directly: an un-relaxed `@IsUUID()` on the request DTOs rejected that exact row
  with `400 draftKey must be a UUID` the first time this was tested live, caught before shipping, not
  assumed correct). `NULL` for every `CONFIRMED` row — meaningless once a sale is real.
- **`UQ_sales_open_per_user` → `UQ_sales_open_per_draft`**, a partial unique index on
  `(user_id, draft_key) WHERE status = 'OPEN'` — the exact same "at most one OPEN row" guarantee as
  before, just scoped one level finer. A user can now have many open sales, as long as each has a
  distinct `draft_key`.
- **`adjust_sale_item`/`cancel_open_sale`/`configure_open_sale`/`confirm_open_sale` all gained
  `p_draft_key VARCHAR DEFAULT 'default'`** as a new trailing parameter, with every "find my open sale"
  lookup now filtering on `(user_id, draft_key)` instead of `user_id` alone. **Real gotcha hit and fixed
  here**: `CREATE OR REPLACE FUNCTION` does **not** replace a function in place when the parameter count
  changes — Postgres identifies a function by `(name, argument types)`, so adding a parameter (even a
  `DEFAULT`-valued one) creates a brand-new overload alongside the old one, never a true replacement. This
  was already a live, pre-existing bug before this migration (`AddWholesalePricingToSales` had added
  `p_presentation_id`/`p_location_id` to `adjust_sale_item` the same bare-`CREATE OR REPLACE` way, leaving
  the original 3-parameter version from `AddDraftSalesSupport` orphaned in the database — confirmed
  directly via `pg_proc`, not assumed) — fixed by pairing every parameter-count change with an explicit
  `DROP FUNCTION IF EXISTS <old-signature>` first. **General lesson for this codebase**: never trust a
  bare `CREATE OR REPLACE FUNCTION` to replace a function whose parameter list is changing — always drop
  the old signature explicitly first.
- **A second, genuinely pre-existing bug was found and fixed while touching `cancel_open_sale`**: the
  version being replaced only ever restored `products.stock`, and was never updated when
  `CreateInventoryLocationsAndPresentations` introduced the per-location `inventory_stock` table — unlike
  `adjust_sale_item`/`confirm_open_sale`, which both already handle it correctly. Cancelling a draft
  therefore silently left `inventory_stock`'s per-location row permanently short by whatever was reserved
  (confirmed directly during this feature's own manual testing: a real cancelled draft left
  `products.stock` correct but Vitrina's `inventory_stock` row 1 unit short — a genuine data drift, not
  hypothetical; reconciled by hand afterward, confirmed zero drift remained across every active product
  before moving on). The fixed version restores `inventory_stock` too, using each line's own `location_id`
  (falling back to Vitrina for a historical row that predates that column, same fallback
  `confirm_open_sale` already uses) and `quantity_base_units` (falling back to `quantity` — a presentation
  with `conversion_factor != 1`, e.g. a "Caja", must restore the full base-unit amount that was actually
  reserved, not the presentation-level count, which the un-fixed version would have under-restored too).
- **`GET /sales/current` now returns an array** (`SaleResponseDto[]`, via the renamed
  `GetOpenSalesUseCase`/`findOpenSalesByUserId`) instead of a single sale — every one of the caller's open
  drafts, not just one. An empty array is the normal "no open tabs" state, never an error (the old
  `NoOpenSaleError` 404 on this endpoint is gone). `POST /sales/confirm` and `DELETE /sales/current` both
  now require `draftKey` (body / `?draftKey=` query param respectively) to say which tab they target;
  `POST /sales/items` and `PATCH /sales/current/pricing` gained a required `draftKey` field on their
  existing DTOs. `SaleOutput`/`SaleResponseDto` both gained `draftKey: string | null` so the frontend can
  correlate a response back to the tab that triggered it.
- **`confirm_sale`/`CreateSaleUseCase`** (the bulk, one-shot path) needed **no** changes — it never
  touches the "find my open sale" pattern at all, always creating a brand-new `CONFIRMED` sale directly.

### Transaccionar (`modules/transaction-banks/`, `modules/transaction-types/`, `modules/bank-deposits/`)

Three new modules, added by migrations `1759600000000` through `1759800000000`, implementing a daily bank
deposit register: pick a "Banco Agente" and a "Tipo de Transacción", enter a total amount, break it down
into physical cash denominations, and distribute it across N sub-transactions — the cuadre (cash total AND
transaction total must both equal the entered total, exactly) is validated entirely inside one Postgres
function, never trusted from the client.

- **`transaction_banks`/`transaction_types` are flat catalogs**, structurally identical clones of
  `account_types` (partial-unique-active `name`, soft delete only, `createdBy`/`updatedBy` audit columns)
  — deliberately separate from `banks` (the heavier Agentes Bancarios entity tied to account numbers and
  Cuadre de Agentes balances). `transaction_types` carries one extra column, `icon` — a key into the
  frontend's shared icon registry, rendered on Transaccionar's own type cards. Both modules' use cases
  mirror each other and the categories/businesses pattern exactly: `create` normalizes the name (trim +
  collapse internal whitespace) and checks `findByActiveName` first (409 on a duplicate);
  `update` only re-checks uniqueness when the name actually changed; `deactivate` 404s on a missing id,
  otherwise soft-deletes.
- **`bank_deposit_operations` / `_cash_details` / `_transactions`** — one registration: a total amount,
  its physical cash breakdown (`_cash_details`, one row per denomination), and the N sub-transactions it
  was split into (`_transactions`). `total_cash`/`total_distributed` are server-recomputed columns, always
  equal to `total_amount` by construction — `register_bank_deposit_operation()` rolls back the entire
  operation (`CASH_TOTAL_MISMATCH`/`TRANSACTION_TOTAL_MISMATCH`) otherwise, so these are never trusted
  from the client despite being cached on the row. `operation_date` is a plain `DATE` (a calendar business
  day, not an instant, same reasoning as `bank_balances.operation_date`). `client_name` (added by
  `1759700000000-AddClientNameToBankDepositOperations`) is a **free-text** field, never a `clients` FK —
  Transaccionar's "cliente" is just a label for whose deposit this was, a different concept from the
  accounts-receivable `clients` table entirely.
- **Transaccionar reuses Banks' own día-abierto/cerrado cycle** (`DAY_OPENING_REPOSITORY`, exported by
  `BanksModule`) rather than a parallel one — `RegisterBankDepositOperationUseCase` gates on
  `DayOpeningRepository.findByDate(today)` before ever calling the repository: no opening at all →
  `BankDepositDayNotOpenedError` (400), already closed → `BankDepositDayAlreadyClosedError` (400). Each is
  a module-scoped error class of its own (not a reuse of Banks' own `DayNotOpenedError`), consistent with
  every other module in this codebase owning its own error classes even when the underlying condition is
  conceptually shared. **Operation date is always "today" (server-local) — no backdating in v1**, unlike
  Recargas' own operation-date picker.
- **Every cuadre rule lives inside `register_bank_deposit_operation()` itself**, not the use case: total
  amount must be positive, the target bank must exist and be active, the sum of `cashDetails` (denomination
  × quantity) must equal `totalAmount` exactly, and the sum of `transactionAmounts` must also equal
  `totalAmount` exactly — any mismatch rolls back the whole insert. `RegisterBankDepositOperationUseCase`
  never recomputes or trusts these totals itself; it only gates on the business-day cycle before
  delegating.
- **`POST /bank-deposits` is operational** (any authenticated, active account, no `@Roles(...)`) — same
  policy as Sales/Purchases/Recargas. Reading the full historical list/report is a separate, admin-only
  concern under `/reports/bank-deposits` (see below) — `BankDepositsController` itself only exposes
  `POST /bank-deposits` and `GET /bank-deposits/:id` (fetch-one, e.g. for a receipt/confirmation view).

### Reportería de Transacciones (extension to Reports)

`GET /reports/bank-deposits`, `/summary`, `/export` — a fourth Reportería screen, admin-only
(`@Roles('ADMIN', 'SUPER_ADMIN')`, same as every other `/reports/*` route), filterable by
`startDate`/`endDate`/`transactionBankId`/`transactionTypeId`/`userId`. `ReportsModule` gained
`BankDepositsModule`/`TransactionBanksModule`/`TransactionTypesModule` imports to reach their exported
repository tokens, same reuse pattern as every earlier report (Sales/Purchases' own `/:id` routes reusing
`SALE_REPOSITORY`/`PURCHASE_REPOSITORY.findById`).

- **`operationDate` is a plain `DATE` column**, so `getReportSummary()`'s date filters use safe
  lexicographic `yyyy-MM-dd` string comparison — same reasoning `GetRechargesReportSummaryUseCase`
  already established for its own `date` column, not the `Date`-object start/end-of-day widening
  Sales/Purchases' own `sale_date`/`purchase_date` filters need.
  `GetBankDepositsReportSummaryUseCase` still throws `InvalidBankDepositDateRangeError` (400) when
  `startDate > endDate`.
- **PDF export reuses the same generic `buildReportPdf()`** every other report already uses — no new
  export mechanism, same `EXPORT_ROW_LIMIT = 500` ceiling and `@Res()` direct-response bypass of
  `ResponseInterceptor`.

### Anular una operación de Transaccionar (follow-up — correction path, never edit/delete)

Migration `1759900000000-AddVoidToBankDepositOperations` adds the one correction mechanism this module
had been missing: a registered deposit can be marked **anulada**, but is never edited in place and never
physically deleted — same philosophy as every other financial record in this codebase (a confirmed sale,
a purchase, a closed day). The recommended fix for a mistaken registration is "anular the wrong one (with
a mandatory reason), then register the correct one" — never a silent overwrite, since re-validating the
full cuadre (cash total == transactions total == total amount) in place would be exactly the complexity
this module's original stored-function design already solved once at creation time.

- **Four new nullable columns** on `bank_deposit_operations`: `is_voided` (`NOT NULL DEFAULT false`),
  `voided_at`, `voided_by` (`FK → users, RESTRICT`), `void_reason`. A `CHECK` constraint enforces the two
  valid states — all four null/false together, or all four populated together — so a half-voided row can
  never exist. Purely additive: every pre-existing row defaults to `is_voided = false`, byte-identical to
  today's actual behavior. Unlike most migrations in this file, this one ships a real, safe `down()` — the
  feature adds an optional flag with no existing behavior depending on it yet, so a clean rollback is
  possible (contrast with e.g. `CreateInventoryLocationsAndPresentations`'s deliberately absent `down()`).
- **No stored function for the void action itself** — `VoidBankDepositOperationUseCase` checks
  existence (`BankDepositOperationNotFoundError`, 404) and not-already-voided
  (`BankDepositOperationAlreadyVoidedError`, 400) in TypeScript, then `TypeOrmBankDepositRepository
  .voidOperation()` runs one conditional `UPDATE` — the "don't build a procedure where a plain statement
  is already correct and simpler" call already made for `confirm_open_sale`'s own status transition.
  `totalAmount`/`totalCash`/`totalDistributed`/every cash-detail and transaction row are never touched —
  a voided operation's numbers stay exactly what was (mistakenly) cuadrado at registration time.
- **`POST /bank-deposits/:id/void` is the one route on `BankDepositsController` that IS admin-gated**
  (`@UseGuards(RolesGuard)` + `@Roles('ADMIN', 'SUPER_ADMIN')`, method-level only — `create`/`findOne`
  stay open to any authenticated account under the controller's own class-level `JwtAuthGuard`).
  Correcting an already-registered financial record is a management action, same policy as "Gestión de
  Días Cerrados"' reopen/cancel and Recargas' saldo-final re-edit, even though registering the original
  operation is deliberately operational. No day-gate check (`DAY_OPENING_REPOSITORY`) applies to voiding —
  an admin can anular an operation from any date, open or closed, exactly the same way day reopen/cancel
  already operate on closed days by design.
- **A voided operation is never hidden from the listing, only excluded from aggregate totals** —
  `BankDepositRepository.findAll()` (used by both `GET /bank-deposits` and the report's own list) applies
  no `is_voided` filter at all, so a voided row stays fully visible (with `isVoided`/`voidedAt`/
  `voidedByUsername`/`voidReason` now carried on both `BankDepositOperationOutput` and the lighter
  `BankDepositOperationSummaryOutput`) for audit purposes. `TypeOrmBankDepositRepository.getReportSummary()`
  is the one place that adds `WHERE is_voided = false` — to both the totals query and the by-bank
  breakdown query — the same way a `CANCELLED` day is excluded from Cuadre de Agentes' own totals. The
  distinction is deliberate and load-bearing: don't add the exclusion to `applyFilters()` (shared by both
  `findAll` and `getReportSummary`), or the list would silently start hiding voided rows too.

### Resumen dashboard's "Bancos" tile — monthly transaction count

`GET /bank-deposits/monthly-count` — the one non-admin-gated aggregate this module exposes (`JwtAuthGuard`
only, declared before `:id` on `BankDepositsController` so Express doesn't swallow "monthly-count" as that
param). Added specifically because Resumen (`/dashboard`, no route guard beyond plain auth) is the first
page every account sees on login, `USER`-role included — the full filterable report
(`GetBankDepositsReportSummaryUseCase`) stays `@Roles('ADMIN', 'SUPER_ADMIN')`-gated behind Reportería, so
Resumen needed its own lightweight, non-sensitive number instead of reusing that endpoint directly.

- **`GetBankDepositMonthlyCountUseCase` has no stored counter and no reset job** — `startDate` is simply
  "the 1st of whatever month the server's own clock says it is right now", recomputed on every call. The
  count resets itself automatically the instant the calendar rolls into a new month; there is nothing to
  reset, backfill, or schedule.
- **Reuses `getReportSummary()`'s own `operationCount`** rather than a second, duplicated count query —
  it already excludes voided operations (same `is_voided = false` filter documented above), so an anulada
  transaction correctly never inflates this figure either.
- Response is deliberately just `{ count, month }` — no by-bank breakdown, no amount, nothing a `USER`-role
  account shouldn't see.

## Dashboard (`modules/dashboard/`) — Resumen's Ventas de Recargas / Ventas / Compras / Transacciones Bancarias

`GET /dashboard/summary` — admin-only (`@Roles('ADMIN', 'SUPER_ADMIN')`, class-level), backs the Resumen
dashboard's four financial indicator sections (see the frontend `CLAUDE.md`'s matching section). Pure
read-side, cross-cutting module — same architectural precedent as `ReportsModule` (see that module's own
doc comment): never writes anything, registers `SaleOrmEntity`/`PurchaseOrmEntity`/
`RechargeDailyBalanceOrmEntity`/`BankDepositOperationOrmEntity` a second time via its own
`TypeOrmModule.forFeature(...)` rather than importing `SalesModule`/`PurchasesModule`/`RechargesModule`/
`BankDepositsModule` wholesale. No new table, no new migration — every number is computed live from
tables those four modules already own. Deliberately does NOT import `BanksModule` — this dashboard's
"Transacciones Bancarias" is explicitly Transaccionar's own `bank_deposit_operations`, never Cuadre de
Agentes' `bank_balances`/`agent_reconciliations`/`final_balance`/`previous_balance`.

- **The period is never stored, never a fixed date, and needs no month-rollover job** —
  `GetDashboardSummaryUseCase.buildPeriod()` computes `dayStart`/`isoStartDate` as "the 1st of whatever
  month the server's own clock (`new Date()`, under `TZ=America/Guatemala`, see
  `1759100000000-SetDatabaseTimezone`) says it is right now" on every single call. The instant the
  calendar rolls into a new month, the very next request computes a different `dayStart` and every
  downstream query is scoped to that new range automatically — there is no `if (month === 9)` anywhere,
  and nothing to reset. Same reasoning already established for `GetBankDepositMonthlyCountUseCase`'s own
  "Bancos" Resumen tile, applied here to the fuller set.
- **`TypeOrmDashboardRepository.getSummary()` runs four independent, already period-scoped queries in
  parallel** (`Promise.all`), each bounded to at most one row per calendar day or per bank — never a full
  history fetched into Node to filter/aggregate there:
  - **Recharge sales by day**: `SUM(daily_balance - final_balance)` from `recharge_daily_balances`,
    grouped by `date`, only where `final_balance IS NOT NULL` — an unclosed cuadre cycle has no defined
    "venta" yet, same live-recompute reasoning `GetRechargeSalesSummaryUseCase` already established
    (never the frozen `recharge_sales_closures.total_sales`). Summed across every recharge type AND every
    cuadre cycle for that date, so a date closed more than once in one day correctly contributes every
    cycle's sale to that day's total.
  - **Sales by day**: `SUM(total)` from `sales`, grouped by day, `status = 'CONFIRMED'` only — an `OPEN`
    draft is never a completed sale (same hardcoded filter `TypeOrmSaleRepository.findAll` already uses).
  - **Purchases**: a single `COALESCE(SUM(total), 0)` from `purchases` — no day grouping, the ticket only
    asked for one accumulated total.
  - **Bank transactions by bank**: `SUM(transaction_count)` from `bank_deposit_operations`, grouped by
    `transaction_bank_id`, `is_voided = false` only — the same exclusion `getReportSummary()`'s own report
    totals already apply. **Sums the `transactionCount` column (the "cantidad de transacciones" each
    operation was split into), never `COUNT(*)`/operation count** — the ticket is explicit that this must
    never be confused with the number of Transaccionar registrations.
  - **Gotcha caught and fixed during this session's own live verification, not assumed correct**: the
    recharge-by-day query originally did a raw `.select('balance.date', 'date')` — for an entity-mapped
    `find()`, TypeORM's own column metadata hydrates a `type: 'date'` column as a plain `yyyy-MM-dd`
    string (see `RechargeDailyBalanceOrmEntity`'s own doc comment), but a raw, unmapped `getRawMany()`
    column has none of that metadata to hint the pg driver's type parser, so the `date` OID actually came
    back as a JS `Date` object at a shifted UTC instant (confirmed directly: `2026-09-02T06:00:00.000Z`
    for the calendar day `2026-09-02`, not the plain string every other date in this codebase produces).
    Fixed with `to_char(balance.date, 'YYYY-MM-DD')` — same technique already used for the `sales.saleDate`
    (`timestamptz`) day-grouping, which sidesteps the ambiguity by returning text regardless of driver
    settings. The general lesson: a raw `SELECT` of any `date`/`timestamp` column via `getRawMany()`/
    `getRawOne()` should always go through `to_char(...)`, never the bare column, even when the same
    column reads back correctly via an entity-mapped `find()`.
- **Empates (ties) — two explicit, documented, deterministic rules**, both implemented as small pure
  functions (`summarizeDailySeries`/`summarizeBankTransactions` in `application/dtos/
  dashboard-summary-output.ts`), unit-tested directly against the exact example data sets from the ticket:
  - **Día mayor/menor**: the most recent date wins a tie, for both the highest AND the lowest — resolved
    by comparing `(amount, date)` and preferring the later date on an amount tie, never an
    `Array.prototype.find`/first-match that would depend on array order.
  - **Banco mayor/menor**: the alphabetically-first bank name (A→Z) wins a tie, for both the highest AND
    the lowest — chosen because, unlike a day, a bank has no natural "more recent" concept to break a tie
    with; alphabetical order is simply the smallest deterministic, human-legible rule available.
  - A bank/day with **zero activity never appears as "the lowest"** — it's not in the grouped result set
    at all (the `GROUP BY` only returns rows that exist), so there is no `0`-transactions/`0`-amount row
    for the summarize functions to ever consider; "sin datos" is handled by the empty-array branch
    (`highestDay`/`lowestDay`/`highestBank`/`lowestBank` all `null`, every total `0`) instead.
- **Verified directly against the live dev database, not only unit-tested**: a real 2024-01-15 recharge
  sale (Q900.50, left over from earlier work) exists in `recharge_daily_balances` alongside September's
  real rows — confirmed the endpoint's `rechargeSales.total` correctly excluded it (September's own total
  only), a genuine month-separation proof using real historical data rather than only synthetic test
  fixtures. Every other section's numbers (`sales`, `purchases`, `bankTransactions`) were independently
  cross-checked against direct `psql` queries and matched exactly.
- **Unit tests** (`get-dashboard-summary.use-case.spec.ts`, `dashboard-summary-output.spec.ts`) cover: the
  exact period-boundary computation for a fixed "now" (via `jest.useFakeTimers`), an explicit
  31/08→01/09 month-rollover assertion (two calls, two different system times, two different computed
  periods — proving there's no `if (month === ...)` branch to go stale), the ticket's own worked examples
  for recharge sales/sales/purchases/bank-transaction totals, both tie-break rules, and the
  all-nulls-and-zeros "sin datos" shape.

## Alertas y Notificaciones (`modules/alerts/`, `modules/alert-settings/`)

`GET /alerts`, `POST /alerts/:key/read`, `POST /alerts/read-all` — the centralized bell-icon alert system
backing the Navbar dropdown. Any authenticated, active account (`JwtAuthGuard` only, no `@Roles(...)`) can
call it — inventory/recharge-balance alerts are shared operational state, purchase alerts are
ownership-scoped per-caller inside the use case itself (see below), the same split `PurchasesController`
already uses for its own listing endpoints. **Alerts are never persisted as a historical log** — every
`GET /alerts` call recomputes the full set fresh from current state across three unrelated domains
(purchases, inventory, recharges); the only thing actually stored is which alert *keys* one user has
opened (`alert_read_marks`), layered on top. An alert stops appearing in the very next response the
instant its underlying condition resolves — there is no "dismiss"/"resolve"/manual-reset action anywhere
in this module, on purpose.

- **`Alert` (`domain/entities/alert.entity.ts`) is a plain, non-persisted shape** — `key` (a deterministic,
  namespaced id: `purchase:<id>`, `inventory:<productId>:<locationId>`, `recharge:<rechargeTypeId>`),
  `type` (`PURCHASE_PAYMENT_DUE | PURCHASE_PAYMENT_OVERDUE | LOW_INVENTORY | LOW_RECHARGE_BALANCE` —
  named, extensible union, not a free string), `priority` (`CRITICAL | HIGH | MEDIUM`), `title`,
  `description`, `amount`, `date`, `route` (where the frontend navigates on click), `referenceId`. Adding a
  fifth alert type later means adding one more variant to `AlertType`, one more builder function, and one
  more branch in `GetAlertsUseCase.execute()`'s `Promise.all` — never a restructuring of this shape.
- **Three pure builder functions, one per source** (`application/utils/build-alerts.ts`,
  `buildPurchaseAlert`/`buildInventoryAlert`/`buildRechargeBalanceAlert`), each returning `Alert | null` (or
  `Alert` for inventory, whose caller already filtered to only-qualifying rows) — no side effects, no
  repository access, fully unit-testable in isolation with the exact worked examples this feature's own
  ticket specified (see `build-alerts.spec.ts`):
  - **Purchase**: only ever called with `PENDING`/`CREDITO` purchases (see below) — `daysBetweenIsoDates(today, dueDate)` negative → `CRITICAL`/`PURCHASE_PAYMENT_OVERDUE` ("Pago vencido"); `0` → `HIGH`/`PURCHASE_PAYMENT_DUE` ("Pago vence hoy"); `1..alertDays` → `MEDIUM`/`PURCHASE_PAYMENT_DUE` ("Pago próximo a vencer"); beyond `alertDays` → excluded (`null`), not yet worth surfacing.
  - **Inventory**: `quantity === 0` → `CRITICAL` ("Producto agotado"), else `MEDIUM` ("Inventario bajo") — the caller (`InventoryStockRepository.findLowStock()`) already only returns rows with `minStock > 0 AND quantity <= minStock`, so this function never has to re-check the threshold itself.
  - **Recharge balance**: `minBalance <= 0` or no balance history yet → excluded; `dailyBalance <= 0` → `CRITICAL` ("Saldo de recargas agotado"); `0 < dailyBalance <= minBalance` → `MEDIUM` ("Saldo bajo de recargas"); above the threshold → excluded. Claro and Tigo are evaluated as two fully independent calls — nothing ever compares or sums them.
- **`GetAlertsUseCase`** composes all three sources via `Promise.all` (bounded, parallel, never sequential),
  sorts with `sortAlerts()` (`application/dtos/alerts-output.ts` — `CRITICAL` before `HIGH` before `MEDIUM`,
  a stable tiebreak by `key` within a tier, since the ticket named priority tiers but no required intra-tier
  order), then resolves `isRead` via one bounded `AlertReadMarkRepository.findReadKeys(userId, keys)` call
  (never the whole read-marks table). `count` is the unread total (the bell badge), `total` is every active
  alert regardless of read state (the panel's own list length).
- **Purchase alerts reuse `PurchaseRepository.findPendingCreditPurchases(options?: { userId? })`** — a new
  repository method, bounded by construction to only `CREDITO`+`PENDING` rows (never the full purchase
  history), with `userId` omitted for an admin caller (sees every account's pending credit purchases) and
  set to the caller's own id for a non-admin (mirrors `findAll`'s own ownership rule). This is also the
  *entire* mechanism behind "a paid purchase stops alerting" — once `MarkPurchaseAsPaidUseCase` flips
  `paymentStatus` to `PAID`, the purchase simply no longer appears in this query's result set on the next
  call; nothing marks the alert itself as resolved, because the alert was never a stored thing to resolve.
- **`AlertReadMarkRepository`** (`alert_read_marks`, composite PK `(user_id, alert_key)`, migration
  `1760000400000-CreateAlertReadMarks`) is a pure upsert-only table — `markRead`/`markAllRead` both use
  `.orIgnore()` inserts (marking an already-read alert read again is a no-op, not an error). Its
  `user_id` FK is `CASCADE`, deliberately the *one* exception to this codebase's otherwise-universal
  `RESTRICT` convention on every other FK — a read-mark is disposable bookkeeping with no independent
  meaning once its user is gone, unlike every other referenced row in this app. A read-mark whose alert
  condition has since resolved is simply an inert, harmless leftover row — nothing ever cleans it up, and
  nothing needs to.
- **`alert_settings`** (migration `1760000300000-CreateAlertSettings`) is a genuine singleton — exactly
  one row, seeded by the migration, holding the *one* truly-global threshold this feature has:
  `purchasePaymentAlertDays` (int, default `3`). `GET`/`PATCH /alert-settings` are both
  `@Roles('ADMIN', 'SUPER_ADMIN')`-gated (class-level). Every *other* threshold this ticket asked for —
  stock mínimo, saldo mínimo — lives on its own owning entity instead of a second generic config table (see
  below), a deliberate call per the ticket's own "no crear tablas nuevas si ya existe una columna donde
  vivir" instruction; `AlertSettingsRepository.get()` always returns the one row or throws
  `InternalServerErrorException` (a missing singleton row would mean the migration itself failed, not a
  normal runtime condition to model as a domain error).
- **`inventory_stock.min_stock`** (migration `1760000100000-AddMinStockToInventoryStock`, `int not null
  default 0`, `CHECK (min_stock >= 0)`) and **`recharge_types.min_balance`** (migration
  `1760000200000-AddMinBalanceToRechargeTypes`, `numeric(12,2) not null default 0`, `CHECK (min_balance >=
  0)`) are both per-entity thresholds added directly to their own owning tables — `0` means "no threshold
  configured, never alert for this row" in both cases, so a fresh install/an unconfigured product or
  recharge type is silent by default, never a false positive. `SetMinStockUseCase`
  (`PATCH /inventory/products/:productId/locations/:locationId/min-stock`) and
  `UpdateRechargeTypeMinBalanceUseCase` (`PATCH /recharges/types/:id/min-balance`) are both admin-only,
  plain conditional `UPDATE`s (not hot paths, no stored function needed).
- **Compras a crédito** (migration `1760000000000-AddCreditPaymentToPurchases`) — `purchases` gained
  `payment_type` (`'CONTADO' | 'CREDITO'`), `payment_due_date` (`DATE`, `yyyy-MM-dd`, always `NULL` for
  `CONTADO`), `payment_status` (`'PENDING' | 'PAID'`), `paid_at`, `paid_by` (`FK → users, RESTRICT`).
  `confirm_purchase` gained two new optional trailing params (`p_payment_type DEFAULT 'CONTADO'`,
  `p_payment_due_date DEFAULT NULL`) — backward compatible with any existing caller. **`VENCIDA` is
  deliberately never a stored status** — only `PENDING`/`PAID` are persisted; "overdue" is always derived
  by comparing `paymentDueDate` against today at read time (inside `buildPurchaseAlert`), specifically so
  nothing in this feature depends on a cron/scheduled job to flip a status at midnight. Existing rows were
  backfilled `payment_type='CONTADO'`, `payment_status='PAID'`, `paid_at=created_at`, `paid_by=user_id` — a
  pre-existing purchase was always effectively "paid in full immediately", so this backfill changes no
  observable behavior for historical data.
  - **Gotcha hit and fixed in this migration**: the `CHK_purchases_paid_consistency` CHECK was originally
    added in the same `ALTER TABLE` as the new columns (with `payment_status DEFAULT 'PAID'`), which made
    every pre-existing row instantly non-compliant (`paid_at`/`paid_by` still `NULL`) before the backfill
    `UPDATE` ever ran — Postgres validates a same-statement CHECK against the table's current state, not
    against a later statement's effect. Fixed by splitting into three sequential steps: add columns + every
    check *except* `paid_consistency` → run the backfill `UPDATE` → add `CHK_purchases_paid_consistency` in
    its own final `ALTER TABLE`. General lesson: a CHECK that depends on a column-default-then-backfill
    sequence must be added strictly *after* the backfill, in its own statement — never bundled with the
    column that introduced the inconsistency.
- **`MarkPurchaseAsPaidUseCase`** (`POST /purchases/:id/pay`, no `@Roles(...)` — operational, mirrors the
  policy on registering the purchase itself) is the deliberately minimal "mark as paid" action this
  feature needed — explicitly NOT a full cuentas-por-pagar module, per the ticket's own warning against
  building one without first analyzing the architecture. Throws `PurchaseNotFoundError` (404) or
  `PurchaseAlreadyPaidError` (400, covers both a genuine re-attempt on a CREDITO purchase and any accidental
  call on an already-`PAID` CONTADO one — there's no need to special-case "this was never CREDITO").
  `TypeOrmPurchaseRepository.markAsPaid()` is a plain conditional `UPDATE`, not a stored function — same
  "don't build a procedure where a plain statement is already correct" call as `voidOperation`/
  `confirm_open_sale`'s status transition elsewhere in this codebase.
- **No new "read every alert type" endpoint duplication** — `modules/alerts/` reuses each owning module's
  existing exported repository token directly (`PURCHASE_REPOSITORY`, `INVENTORY_STOCK_REPOSITORY`,
  `RECHARGE_TYPE_REPOSITORY`, `RECHARGE_DAILY_BALANCE_REPOSITORY`, `ALERT_SETTINGS_REPOSITORY`) by importing
  each owning module into `AlertsModule`, rather than the `ReportsModule`/`DashboardModule` pattern of
  registering ORM entities a second time — a deliberate choice, since every value this module needs already
  has a clean, existing single-repository interface to reuse (the "read maps cleanly onto one existing
  repository per source" case, not the "read spans many unrelated tables with no existing interface" case
  those two modules are actually in).
- **Verified live against real, non-fabricated data** (not just unit tests): a recharge type's
  `min_balance` was temporarily raised above its actual live balance — the alert appeared correctly in the
  bell, then the threshold was reset to `0` afterward; a real `CREDITO` purchase was registered with today
  as its due date — the "Pago vence hoy" alert appeared, "Marcar como pagada" was clicked from the panel,
  and the purchase's `payment_status`/`paid_at` were confirmed `PAID`/set via a direct `psql` check
  immediately after; a product's `min_stock` was temporarily raised above its real Bodega quantity — the
  "Inventario bajo" alert appeared, then the threshold was reset to `0`. In every case the panel's
  "No hay alertas activas" empty state was independently confirmed correct beforehand by cross-checking
  zero qualifying rows via direct SQL, not merely assumed from an empty response.

## Kardex financiero — Cuentas por Cobrar y Activos

`accounts_receivable` and `assets` evolved from flat, independently-summed CRUD entries into a real
Kardex/ledger, via migration `1760000600000-CreateFinancialKardexColumns`: every row is now an explicit
`CARGO` or `ABONO` movement, and a client's balance is the signed running sum of their own movements.
Deliberately additive to the **existing** tables — no new `_movements`/`_kardex` table, a movement already
*is* a row here, it just gained a type. Cuentas por Cobrar and Activos use identical mechanics but **never
share balances or movements** — each module's repository only ever queries its own table, scoped by
`client_id`.

- **`amount` stays an always-positive magnitude**, never re-interpreted — the sign comes from
  `movement_type` at query time (`CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END`), never
  from the stored value. A new `sequence BIGSERIAL` column (one per table, not per client — the window
  function below partitions by `client_id`) is the deterministic tie-break for ordering, more reliable
  than `created_at` timestamp precision.
- **No `balance_after` column, on purpose** — a stored running balance would require the history to be
  strictly append-only, but `UpdateAccountReceivableUseCase`/`UpdateAssetUseCase` and their
  `Deactivate*UseCase` siblings (this table's original, still-untouched admin CRUD) already let an admin
  edit or soft-delete any row, and this migration deliberately does not restrict that — a real, already-used
  correction tool. Instead, every read computes the balance fresh with a `SUM(...) OVER (ORDER BY sequence)`
  window function — the Kardex is always correct no matter what the admin screens do to a row later,
  nothing to desync. Same "derive, don't duplicate" precedent as `RechargeDailyBalance.totalPurchases`/
  Reports' own folio numbers.
- **Backfill, not invention**: every pre-existing row became exactly one movement.
  `accounts_receivable` rows were already 100% positive (its own `CHECK (amount > 0)` never lapsed), so
  they all became `CARGO` unchanged. `assets` rows split by sign — `amount >= 0` became `CARGO` as-is;
  `amount < 0` (a real, already-used correction pattern — 5 of 29 live rows at migration time) became
  `ABONO` with `amount` flipped to its absolute value. Verified directly post-migration: the signed running
  total per client, recomputed with the new `CASE`-based sum, was byte-identical to the pre-migration naive
  `SUM(amount)` for every client in both tables (captured a before-snapshot, diffed against an after-
  snapshot, zero discrepancies).
- **The one deliberate asymmetry — decided with the user, backed by real data, not assumed**: Cuentas por
  Cobrar has never allowed a negative balance (its `CHECK (amount > 0)` never lapsed) — an `ABONO` larger
  than the current balance is rejected (`ABONO_EXCEEDS_BALANCE` → `AbonoExceedsBalanceError`, 400).
  Activos' own `CHECK` was already dropped in an earlier migration (`AllowNegativeAssetAmount`) — 5 real,
  live rows already depended on a negative balance at migration time — so `register_asset_movement` applies
  **no** such guard, preserving that existing capability exactly.
- **`register_account_receivable_movement(p_client_id, p_type, p_amount, p_date, p_description,
  p_user_id)`/`register_asset_movement(...)`** — two Postgres `FUNCTION`s (not `PROCEDURE`s, same
  roll-back-on-`RAISE EXCEPTION` reasoning as every other critical-write module in this codebase), each
  opening with `PERFORM pg_advisory_xact_lock(hashtext(p_client_id::text))` — a per-client transaction-scoped
  lock that serializes two concurrent movements for the *same* client without blocking any other client's
  writes, auto-released at commit/rollback. This is the actual mechanism that prevents two simultaneous
  abonos from both succeeding against the same pending balance — verified directly: two parallel `ABONO 80`
  calls against a `CARGO 100` balance correctly left exactly one accepted (final balance `20`) and one
  rejected with `ABONO_EXCEEDS_BALANCE`, never a negative or double-deducted result.
  `TypeOrmAssetRepository`/`TypeOrmAccountReceivableRepository.registerMovement()` call the function via
  `manager.query('SELECT register_*_movement($1, ..., $6)', [...])` and re-fetch the persisted row by the
  returned id — same `SELECT confirm_sale(...)`-then-refetch pattern as Sales/Purchases.
- **`getStatement(clientId, { dateFrom?, dateTo? })`** — one query, not a full-history fetch: an
  `openingBalance` scalar (the signed sum of every active movement strictly before `dateFrom`, `0` when
  `dateFrom` is omitted since the `WHERE` then matches no rows) plus a `WITH movements AS (...) SELECT ...,
  $openingBalance + SUM(CASE ...) OVER (ORDER BY sequence) AS "balanceAfter"` window-function query, so a
  mid-period statement correctly shows the client's true prior balance as its saldo inicial, never
  assuming zero. `getCurrentBalance(clientId)` is the same signed-sum aggregate with no date bound, backing
  the client selector's "Saldo actual" and never iterated client-side.
- **`getReportSummary()` (used by `GetCuadreAgentesSummaryUseCase`'s daily formula) was the one existing
  caller this migration required changing** — its `SUM(record.amount)` became the same signed `CASE`
  expression, since `amount` is no longer always the true signed value. Verified live: naive `SUM(amount)`
  for assets was `Q136,568.78` immediately post-migration (wrong) vs. the corrected signed sum
  `Q124,061.44` (right, byte-identical to the pre-migration total). The combined `assets-receivables` report
  (`GetAssetsReceivablesReportRowOutput`) also gained a `movementType` field and the PDF export now prefixes
  an `ABONO` row's amount with `-` — restoring the same negative-amount visual Activos corrections showed
  before this migration split the sign out of `amount` into `movement_type`.
- **A real regression was caught and fixed before shipping**: the legacy admin CRUD
  (`CreateAssetUseCase`/`UpdateAssetUseCase`, still fully intact and unrestricted — see above) used to let
  an admin enter a negative `amount` directly (Activos' own long-standing correction capability). Once
  `CHK_assets_amount_positive` was re-added (now safe, since the sign lives in `movement_type` instead),
  a plain negative-amount `INSERT`/`UPDATE` through that old path started throwing a raw, untranslated
  `QueryFailedError` — confirmed directly via `psql` before fixing. Fixed by translating that specific
  constraint violation into `InvalidMovementAmountError` in `TypeOrmAssetRepository.create()`/`update()`,
  and by tightening the frontend's `AssetFormModalComponent` amount field from `Validators.min` removed
  (allowing negative) to `Validators.min(0.01)` — the legacy form's own hint now points an admin needing a
  correction toward "Registrar Abono" in the new Estado de Cuenta view instead.
- **New use cases, one set per module**: `Register{AccountReceivable,Asset}ChargeUseCase`,
  `Register{AccountReceivable,Asset}PaymentUseCase`, `Get{AccountReceivable,Asset}StatementUseCase`,
  `Get{AccountReceivable,Asset}CurrentBalanceUseCase` — each thin, validating the referenced client
  exists+active (`ReferencedClientNotFoundError`/`ReferencedClientInactiveError`, the same pattern
  `CreateAccountReceivableUseCase` already used) before delegating to the repository. The payment use
  cases deliberately do **not** pre-check the amount against the balance in TypeScript — the SQL function
  computes the balance fresh inside its own advisory lock, so a TypeScript-side pre-check would only add a
  TOCTOU gap, not close one.
- **New routes on the existing controllers** (same permission split as `create`/`update`/`deactivate`
  already had — admin-only mutation, any-authenticated-role read): `POST /:clientId/charges`,
  `POST /:clientId/payments`, `GET /:clientId/statement?dateFrom=&dateTo=`, `GET /:clientId/balance` — on
  both `AccountsReceivableController` and `AssetsController`. No route ordering conflict with the existing
  `GET /:id`/`PATCH /:id`/`DELETE /:id` (those match exactly one path segment; the new routes are always
  two segments).
- **Verified live, end to end, against the real dev database** (not only via `psql`): registered a real
  `Q500.00` abono on a real client through the actual Estado de Cuenta UI, confirmed the live saldo-anterior/
  monto/saldo-nuevo preview, the global `FINANCIAL_OPERATION` confirmation dialog, the balance update, and
  the movement appearing in the Kardex table; attempted a real over-limit abono and confirmed
  `AbonoExceedsBalanceError`'s exact message surfaced through the UI with no movement written; reversed the
  test abono with a real corrective cargo (never a delete) once confirmed with the user, leaving both
  movements permanently in the history — a live demonstration of the "never edit a historical movement,
  only add a new one" rule the whole feature is built on.

## Catálogos maestros — Tipos de Presentación y Unidades de Medida

`modules/presentation-types/` and `modules/units-of-measure/` — two flat admin catalogs
(`Sistema → Presentaciones y Medidas`) that replace what used to be free text: `product_presentations.name`
(Caja, Paquete...) and a brand-new `products.unit_of_measure_id` (Unidad, Kilogramo, Litro...). Added via
migrations `1760000700000-CreatePresentationTypesTable`/`1760000800000-CreateUnitsOfMeasureTable`. Both
modules are structural clones of `account-types`/`transaction-types` (domain entity, repository interface,
`Create`/`Update`/`List`/`GetById`/`Deactivate` use cases, TypeORM repository/ORM entity/mapper,
controller+DTOs) — confirmed by reading that module first, not assumed; **neither catalog uses a Postgres
stored function** — SPs in this codebase are reserved for multi-step financial writes needing real
atomicity (`confirm_sale`, the Kardex `register_*_movement`...), and a single-row `INSERT`/`UPDATE` has no
such need, so plain TypeORM is "respecting the existing architecture," not skipping it.

- **The two catalogs are deliberately never mixed** — `PresentationType` describes how a product is
  grouped/commercialized (Caja, Paquete, Bolsa...); `UnitOfMeasure` describes the physical unit it's
  measured in (kg, L, unidad). A product has exactly one `unitOfMeasureId` (a normal FK column on
  `products`); a product has *many* presentations (unchanged `product_presentations`, one row per
  Unidad/Caja/Paquete with its own `conversionFactor`/prices), each now pointing at a
  `presentation_type_id` instead of typing the name.
- **Case-insensitive duplicate protection, deliberately stronger than `account_types`' own pattern**: both
  new tables use the `clients`-style raw-SQL partial unique index (`CREATE UNIQUE INDEX ... ON
  presentation_types (LOWER(name)) WHERE is_active = true`, plus one more for `code`/`abbreviation`) rather
  than `account_types`' plain case-sensitive `UQ_..._name_active` — "Caja"/"caja"/" CAJA " are the same row,
  by construction, in the database, not just in application code. Verified directly via `psql`: inserting
  "Prueba" then "prueba" then "PRUEBA" — only the first succeeds, the other two fail with `duplicate key
  value violates unique constraint`.
- **"Ya existe pero está inactiva, ¿desea activarla?" is a frontend-only flow, deliberately** — `GlobalExceptionFilter`
  returns a fixed `{success, statusCode, message, timestamp}` shape with no room for a structured
  "here's the existing id" payload, and widening that shape for one feature would touch every error
  response in the app. Instead, `Create*UseCase` calls a new `findByName()` (any state, not just active —
  unlike `account_types`' `findByActiveName`) and rejects an inactive match exactly like an active one
  (409) — the frontend is expected to check the already-loaded list first and offer "Activar" instead of
  ever calling create in that case; hitting the API directly without that check just gets a safe rejection.
- **Reactivation needed a real behavior addition, not a copy of the precedent**: `account_types`/`categories`
  only ever deactivate (`DELETE`) with no way back — a real, unaddressed gap in those older modules, not
  something to replicate here since this ticket explicitly requires "Activar". `Update*RequestDto` on both
  new modules includes `isActive?: boolean` (mirroring the richer pattern `roles`/`inventory` presentations
  already use), so `PATCH /presentation-types/:id { isActive: true }` reactivates.
- **`usageCount` per row is a single correlated-subquery `SELECT`, never N+1** — `findAll()` on both
  repositories runs one raw query (`getRawMany()`, hand-selected columns, same "no relation-count-and-map
  helper in this TypeORM version" reasoning as Reports' own `itemCount`) with `(SELECT COUNT(*) FROM
  product_presentations WHERE presentation_type_id = presentationType.id)`/`(... FROM products WHERE
  unit_of_measure_id = unitOfMeasure.id)` as a scalar subquery in the `SELECT` list — never a join (which
  would fan out rows) and never a per-row follow-up query.
- **Deactivating never blocks on usage, and never touches historical rows** — `Deactivate*UseCase` doesn't
  check `usageCount` at all; a presentation/unit already used by real products can still be deactivated so
  it stops appearing for *new* ones, while every product/presentation still referencing it (by stable FK,
  `ON DELETE RESTRICT`) keeps working exactly as before. No `DELETE` route exists beyond the soft
  `isActive=false` toggle — physical deletion was deliberately not added, since deactivation already covers
  the real "stop offering this" need without the referential-integrity risk.
- **Migration is additive and non-destructive, verified before and after**: `product_presentations.name`
  (free text, unique only per-product) was grouped case-insensitively (trimmed), one `presentation_types`
  row created per distinct group (using `MIN(name)` for a deterministic original-cased spelling — never an
  invented name), every existing row related by matching normalized name, verified with a `RAISE EXCEPTION`
  guard (`0` unmapped rows) before the column was ever touched, and only then was the now-fully-redundant
  `name` column dropped (not a data loss — its value is preserved, just relocated into the FK). Verified
  directly against live dev data before writing the migration: only two distinct normalized names existed
  (`caja` × 3, `unidad` × 4) — no ambiguous plural/typo variants to reconcile by hand in this real dataset.
  `products.unit_of_measure_id` followed the identical "seed a default row, backfill every existing row,
  then `SET NOT NULL`" shape `CreateBusinessesTable` already used for `business_id` — a proven, safe
  precedent in this exact codebase, not a new pattern.
- **A real regression this migration required fixing**: `CreateProductUseCase`'s auto-created "Unidad"
  presentation used to pass `name: 'Unidad'` as a literal string straight into the repository; it now
  resolves the seeded "Unidad" `PresentationType`'s id via `findByActiveName()` first (throwing
  `InternalServerErrorException` if the migration's own seed is somehow missing — a condition that should
  never occur, not a normal business rule) and passes `presentationTypeId` instead.
  `UnidadPresentationImmutableError`'s own guard in `UpdatePresentationUseCase` still works unchanged
  (`presentation.name === 'Unidad'`, resolved via the join) — no other module needed to know the id ever
  changed shape.
- **`products`/`inventory` modules gained the identical FK-validation pattern already used for
  `categoryId`/`businessId`**: `CreateProductUseCase`/`UpdateProductUseCase` validate `unitOfMeasureId`
  exists+active (`InvalidUnitOfMeasureError`, 400) before writing; `CreatePresentationUseCase`/
  `UpdatePresentationUseCase` do the same for `presentationTypeId`. `ProductOutput`/`ProductPresentationOutput`
  both gained the resolved display fields (`unitOfMeasureName`/`unitOfMeasureAbbreviation`,
  `presentationTypeId`) — `ProductPresentationOutput.name` itself is unchanged in shape (still a plain
  string), so every existing consumer (Purchases/Ventas/Inventory-transfer/product-detail, all of which
  read `presentation.name`/compare it to `'Unidad'`) needed zero changes.
- **Permissions**: `POST`/`PATCH`/`DELETE` on both new controllers are `@Roles('ADMIN', 'SUPER_ADMIN')`,
  identical to every other catalog in this app; `GET` (list/by-id) is open to any authenticated role — the
  product/presentation forms' dropdowns need to read the catalog regardless of who's creating a product.
- **Verified live end-to-end**: created "Docena"/"doc" through the real UI; attempted "DOCENA" and got the
  exact case-insensitive rejection; deactivated a synthetic test presentation and confirmed the
  usage-aware confirmation message; attempted to recreate it with different case/whitespace and got the
  "ya existe pero está inactiva, ¿desea activarla?" prompt, confirmed it reactivated the same row rather
  than creating a duplicate; opened the real product-creation form and confirmed "Unidad de medida" and
  the additional-presentation dropdown both load only real, active catalog entries (never free text); ran
  a real purchase against an existing product with two presentations and confirmed both "Unidad (factor 1)"
  and "Caja (factor 12)" still resolve and work exactly as before the migration. All synthetic test rows
  were removed afterward (`DELETE` by id, verified zero residual rows) — no real catalog entry (Caja,
  Unidad, the 5 seeded units) was ever touched.

## Frontend contract

The sibling Angular app at `../comercial-jhoel-app` is now fully wired to this API — see its own
`CLAUDE.md` for the frontend side (`AuthService`, `authInterceptor`, route guard). Two things to keep in
sync if you touch the `auth` module:

1. **Response envelope**: every successful response is wrapped by `ResponseInterceptor` as
   `{ success: true, data: T }` (error responses from `GlobalExceptionFilter` are flat, no `data` key —
   see "Manejo de errores" above). The frontend's `AuthService` unwraps `.data` explicitly; if you add a
   new authenticated endpoint the frontend will call, remember the wrapper.
2. **Login contract**: `POST /auth/login` takes `{ identifier, password }` and returns
   `{ accessToken, user: { id, username, phone, role } }` (wrapped as above). `POST /auth/change-password`
   requires `Authorization: Bearer <token>` and returns `204` with an empty body on success. Both are
   consumed by `comercial-jhoel-app/src/app/core/services/auth.service.ts` — check that file before
   changing either shape.
3. **Products/Categories**: the frontend's inventory screen
   (`comercial-jhoel-app/src/app/features/dashboard/inventory/`) calls `GET/POST/PATCH/DELETE /products`
   and `GET /categories` for real now — no mock data left. It hides create/edit/delete actions for
   non-admins via `AuthService.isAdmin`, but that's UX only; this API's `RolesGuard` is what actually
   blocks a `USER`-role token, and stays true even if the frontend is bypassed entirely (Postman, a
   modified client, etc.) — never remove or weaken it based on frontend behavior alone.
