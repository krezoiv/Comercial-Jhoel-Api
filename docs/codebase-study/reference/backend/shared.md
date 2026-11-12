# Código transversal del backend (shared)

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [password-hasher.port.ts](#f-comercial-jhoel-api-src-shared-application-ports-password-hasher-port-ts) | .ts | Puerto (interfaz) | Aplicación | A port, not a direct `bcrypt` import — `auth` and `users` use cases depend on this interface only, so the hashing library can be swapped (or mocked in a test) by changing `SharedModule`'s provider, without touching any use case that hashes or compares a password. | 0 internas | 7 | Media (7 consumidores) |
| [transaction-manager.port.ts](#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts) | .ts | Puerto (interfaz) | Aplicación | A port, not a direct TypeORM `DataSource` import — a use case that needs two independent modules' repository writes to commit or roll back together (e.g. | 0 internas | 17 | Alta (17 consumidores) |
| [current-user.decorator.ts](#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts) | .ts | Decorador | Transversal (shared) | The shape `JwtStrategy.validate()` returns and Passport attaches to `request.user` on every authenticated request — re-fetched from the database each time, not decoded straight from the JWT payload, so a role change or deactivation takes effect immediately (see `JwtStrategy`). | 0 internas; ext.: @nestjs/common | 60 | Alta (60 consumidores) |
| [roles.decorator.ts](#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts) | .ts | Decorador | Transversal (shared) | Marks a route as requiring one of the given roles — enforced by RolesGuard (plain string comparison against the JWT's role). | 1 internas; ext.: @nestjs/common | 57 | Alta (57 consumidores) |
| [domain-error.ts](#f-comercial-jhoel-api-src-shared-domain-domain-error-ts) | .ts | Código TypeScript | Dominio | Base class for every business-rule violation across all modules. | 0 internas | 269 | Alta (269 consumidores) |
| [global-exception.filter.ts](#f-comercial-jhoel-api-src-shared-filters-global-exception-filter-ts) | .ts | Filtro de excepciones | Transversal (shared) | Registered globally in `app.module.ts` via `APP_FILTER` — `@Catch()` with no argument means every exception thrown anywhere in the app (a `DomainError`, a framework `HttpException` such as `ValidationPipe`'s 400, or a genuine unhandled bug) ends up here, always producing the same flat JSON error shape. | 2 internas; ext.: @nestjs/common, express | 1 | Baja (1 consumidores) |
| [pdf-helpers.spec.ts](#f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-spec-ts) | .ts | Prueba unitaria | Infraestructura | Prueba unitaria: declara `buildTestDocument`, `TINY_PNG_BASE64` (sin comentario de documentación en el código). | 1 internas; ext.: pdfkit | 0 | Soporte (pruebas) |
| [pdf-helpers.ts](#f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-ts) | .ts | Código TypeScript | Infraestructura | `Date.prototype.toLocaleString` with no `timeZone` formats using the *server process's* local timezone, not Guatemala's — harmless when the API happens to run on a Guatemala-local host, but this project's Docker setup runs the container on UTC (see this repo's own CLAUDE.md note on the same class of | 0 internas | 7 | Media (7 consumidores) |
| [apply-search-terms.util.ts](#f-comercial-jhoel-api-src-shared-infrastructure-persistence-apply-search-terms-util-ts) | .ts | Utilidad | Infraestructura | Splits a raw search term on whitespace and ANDs one `search_normalize(...)`-based condition per word onto the query builder, so a multi-word term like "garcia lopez" or "juan garcia" matches regardless of word order/adjacency across the target field(s) — each word just has to appear *somewhere* among them. | 0 internas; ext.: typeorm | 6 | Media (6 consumidores) |
| [decimal.transformer.ts](#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts) | .ts | Transformador | Infraestructura | Postgres `numeric` columns are the correct type for money (exact, arbitrary precision — never `float`/`double`, which round). | 0 internas; ext.: typeorm | 40 | Alta (40 consumidores) |
| [bcrypt-password-hasher.service.ts](#f-comercial-jhoel-api-src-shared-infrastructure-services-bcrypt-password-hasher-service-ts) | .ts | Servicio | Infraestructura | The concrete `PasswordHasher` bound in `SharedModule` — see that port's own doc comment for why nothing outside this file imports `bcrypt` directly. | 1 internas; ext.: @nestjs/common, bcrypt | 1 | Baja (1 consumidores) |
| [typeorm-transaction-manager.service.ts](#f-comercial-jhoel-api-src-shared-infrastructure-services-typeorm-transaction-manager-service-ts) | .ts | Servicio | Infraestructura | The concrete `TransactionManager` bound in `SharedModule`. | 1 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Baja (1 consumidores) |
| [response.interceptor.ts](#f-comercial-jhoel-api-src-shared-interceptors-response-interceptor-ts) | .ts | Interceptor | Transversal (shared) | Registered globally via `APP_INTERCEPTOR` — wraps every successful controller return value as `{ success: true, data }`, regardless of the module. | 0 internas; ext.: @nestjs/common, rxjs | 1 | Baja (1 consumidores) |
| [shared.module.ts](#f-comercial-jhoel-api-src-shared-shared-module-ts) | .ts | Módulo | Transversal (shared) | Infrastructure genuinely shared across module boundaries: `auth`/`users` both need to hash/compare passwords, so both import this module rather than each wiring its own `BcryptPasswordHasher` provider. | 4 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-shared-application-ports-password-hasher-port-ts"></a>

### password-hasher.port.ts

- **Ruta:** [password-hasher.port.ts](../../../../comercial-jhoel-api/src/shared/application/ports/password-hasher.port.ts) (`comercial-jhoel-api/src/shared/application/ports/password-hasher.port.ts`, 13 líneas)
- **Tipo:** Puerto (interfaz) · **Capa:** Aplicación · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** A port, not a direct `bcrypt` import — `auth` and `users` use cases depend on this interface only, so the hashing library can be swapped (or mocked in a test) by changing `SharedModule`'s provider, without touching any use case that hashes or compares a password.
- **Consumidores:** [change-password.use-case.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-change-password-use-case-ts), [login.use-case.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-login-use-case-ts), [create-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-create-user-use-case-ts), [register-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-register-user-use-case-ts), [update-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts), [bcrypt-password-hasher.service.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-services-bcrypt-password-hasher-service-ts), [shared.module.ts](shared.md#f-comercial-jhoel-api-src-shared-shared-module-ts)

**Interfaces, tipos y enums:**

- `interface PasswordHasher` (L9): A port, not a direct `bcrypt` import — `auth` and `users` use cases depend on this interface only, so the hashing library can be swapped (or mocked in a test) by changing `SharedModule`'s provider, without touching any use case that hashes or compares a password. — miembros: `hash`, `compare`

**Constantes exportadas:**

- `PASSWORD_HASHER` (L1) = `Symbol('PASSWORD_HASHER')`
<a id="f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts"></a>

### transaction-manager.port.ts

- **Ruta:** [transaction-manager.port.ts](../../../../comercial-jhoel-api/src/shared/application/ports/transaction-manager.port.ts) (`comercial-jhoel-api/src/shared/application/ports/transaction-manager.port.ts`, 24 líneas)
- **Tipo:** Puerto (interfaz) · **Capa:** Aplicación · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** A port, not a direct TypeORM `DataSource` import — a use case that needs two independent modules' repository writes to commit or roll back together (e.g.
- **Consumidores:** [register-account-receivable-charge.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-charge-use-case-ts), [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [typeorm-account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts), [register-asset-charge.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-charge-use-case-ts), [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [typeorm-asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-typeorm-asset-repository-ts), [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts), [register-recharge-sim-sale-with-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts), [recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-daily-stock-repository-ts), [recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-registration-repository-ts), [typeorm-recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-daily-stock-repository-ts), [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts) y 2 más

**Interfaces, tipos y enums:**

- `interface TransactionManager` (L19): A port, not a direct TypeORM `DataSource` import — a use case that needs two independent modules' repository writes to commit or roll back together (e.g. — miembros: `runInTransaction`
- `type TransactionContext` (L4) = `unknown` — Opaque handle threaded through a repository's write methods so several calls share one DB transaction — see `TypeOrmTransactionManager`'s own doc comment for what it concretely is.

**Constantes exportadas:**

- `TRANSACTION_MANAGER` (L1) = `Symbol('TRANSACTION_MANAGER')`
<a id="f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts"></a>

### current-user.decorator.ts

- **Ruta:** [current-user.decorator.ts](../../../../comercial-jhoel-api/src/shared/decorators/current-user.decorator.ts) (`comercial-jhoel-api/src/shared/decorators/current-user.decorator.ts`, 28 líneas)
- **Tipo:** Decorador · **Capa:** Transversal (shared) · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** The shape `JwtStrategy.validate()` returns and Passport attaches to `request.user` on every authenticated request — re-fetched from the database each time, not decoded straight from the JWT payload, so a role change or deactivation takes effect immediately (see `JwtStrategy`).
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts), [account-receivable-payments.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts), [alert-settings.controller.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-presentation-controllers-alert-settings-controller-ts), [alerts.controller.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-presentation-controllers-alerts-controller-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [jwt.strategy.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-strategies-jwt-strategy-ts), [auth.controller.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-presentation-controllers-auth-controller-ts), [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts), [agent-reconciliations.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-agent-reconciliations-controller-ts), [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts), [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts), [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts) y 45 más

**Interfaces, tipos y enums:**

- `interface RequestUser` (L9): The shape `JwtStrategy.validate()` returns and Passport attaches to `request.user` on every authenticated request — re-fetched from the database each time, not decoded straight from the JWT payload, so a role change or deactivation takes effect immediately (see `JwtStrategy`). — miembros: `userId`, `username`, `role`

**Constantes exportadas:**

- `CurrentUser` (L22): `@CurrentUser('userId')` in a controller method reads straight from this already-authenticated `request.user` — never from a client-supplied route parameter or body field. = `createParamDecorator( (field: keyof RequestUser \| undefined, ctx: ExecutionContext) => { const request = ctx.s`
<a id="f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts"></a>

### roles.decorator.ts

- **Ruta:** [roles.decorator.ts](../../../../comercial-jhoel-api/src/shared/decorators/roles.decorator.ts) (`comercial-jhoel-api/src/shared/decorators/roles.decorator.ts`, 18 líneas)
- **Tipo:** Decorador · **Capa:** Transversal (shared) · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** Marks a route as requiring one of the given roles — enforced by RolesGuard (plain string comparison against the JWT's role).
- **Depende de (archivos del proyecto):** [role.entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-entities-role-entity-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts), [account-receivable-payments.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts), [alert-settings.controller.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-presentation-controllers-alert-settings-controller-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts), [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts), [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts), [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts), [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts), [catalog-requests.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-requests-controller-ts), [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts) y 42 más

**Constantes exportadas:**

- `ROLES_KEY` (L7) = `'roles'`
#### Función `Roles` (L15–17)

- **Tipo:** función exportada
- **Firma:** `Roles(roles: Array<RoleName \| typeof SHIFT_SUPERVISOR_ROLE>)` — [roles.decorator.ts](../../../../comercial-jhoel-api/src/shared/decorators/roles.decorator.ts#L15)
- **Propósito / descripción:** Marks a route as requiring one of the given roles — enforced by RolesGuard (plain string comparison against the JWT's role). Besides the three seeded roles it accepts the custom shift-supervisor role, which Control de Efectivo authorizes to run the cash cuts.
- **Dependencias:** `SetMetadata`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-shared-domain-domain-error-ts"></a>

### domain-error.ts

- **Ruta:** [domain-error.ts](../../../../comercial-jhoel-api/src/shared/domain/domain-error.ts) (`comercial-jhoel-api/src/shared/domain/domain-error.ts`, 15 líneas)
- **Tipo:** Código TypeScript · **Capa:** Dominio · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** Base class for every business-rule violation across all modules.
- **Descripción del autor (comentario del archivo):** Base class for every business-rule violation across all modules. `GlobalExceptionFilter` reads `status` directly off any thrown instance — a new domain error only has to set this field to control its HTTP response; no filter or controller wiring is needed per error type.
- **Consumidores:** [account-type-name-already-exists.error.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-errors-account-type-name-already-exists-error-ts), [account-type-not-found.error.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-errors-account-type-not-found-error-ts), [abono-exceeds-balance.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-abono-exceeds-balance-error-ts), [account-receivable-not-found.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-account-receivable-not-found-error-ts), [account-receivable-settlement.errors.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-account-receivable-settlement-errors-ts), [invalid-movement.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-invalid-movement-error-ts), [referenced-client-invalid.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-referenced-client-invalid-error-ts), [invalid-alert-settings.error.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-errors-invalid-alert-settings-error-ts), [asset-not-found.error.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-errors-asset-not-found-error-ts), [invalid-movement.error.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-errors-invalid-movement-error-ts), [referenced-client-invalid.error.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-errors-referenced-client-invalid-error-ts), [invalid-credentials.error.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-domain-errors-invalid-credentials-error-ts), [bank-deposit-accounts-receivable.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-accounts-receivable-error-ts), [bank-deposit-assets.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-assets-error-ts), [bank-deposit-day-already-closed.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-day-already-closed-error-ts) y 254 más

#### Clase `DomainError` (L7–14)

- **Herencia / contratos:** extends Error
- **Propósito:** Base class for every business-rule violation across all modules. `GlobalExceptionFilter` reads `status` directly off any thrown instance — a new domain error only has to set this field to control its HTTP response; no filter or controller wiring is needed per error type.
- **Dependencias inyectadas (constructor):** `message: string`
<a id="f-comercial-jhoel-api-src-shared-filters-global-exception-filter-ts"></a>

### global-exception.filter.ts

- **Ruta:** [global-exception.filter.ts](../../../../comercial-jhoel-api/src/shared/filters/global-exception.filter.ts) (`comercial-jhoel-api/src/shared/filters/global-exception.filter.ts`, 90 líneas)
- **Tipo:** Filtro de excepciones · **Capa:** Transversal (shared) · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** Registered globally in `app.module.ts` via `APP_FILTER` — `@Catch()` with no argument means every exception thrown anywhere in the app (a `DomainError`, a framework `HttpException` such as `ValidationPipe`'s 400, or a genuine unhandled bug) ends up here, always producing the same flat JSON error shape.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts), [financial-day-review.errors.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-errors-financial-day-review-errors-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

**Interfaces, tipos y enums:**

- `interface ErrorBody` (L13): sin documentación — miembros: `status`, `message`

#### Clase `GlobalExceptionFilter` (L30–89)

- **Decoradores:** `@Catch()`
- **Herencia / contratos:** implements ExceptionFilter
- **Propósito:** Registered globally in `app.module.ts` via `APP_FILTER` — `@Catch()` with no argument means every exception thrown anywhere in the app (a `DomainError`, a framework `HttpException` such as `ValidationPipe`'s 400, or a genuine unhandled bug) ends up here, always producing the same flat JSON error shape. This is the error-side counterpart to `ResponseInterceptor`'s success envelope — note the two are deliberately asymmetric: a success body is `{ success, data }`, an error body is `{ success, statusCode, message, timestamp }` with no `data` key at all. Any new client code must branch on this shape difference rather than assuming every response carries `data`.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `catch` | método public | 34–53 | `exception: unknown`, `host: ArgumentsHost` | `void` |
| `resolve` | método private | 56–88 | `exception: unknown` | `ErrorBody` |

##### `GlobalExceptionFilter.catch`

- **Firma:** `catch(exception: unknown, host: ArgumentsHost): void` — [global-exception.filter.ts](../../../../comercial-jhoel-api/src/shared/filters/global-exception.filter.ts#L34) (L34–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `host.switchToHttp().getResponse`, `host.switchToHttp`, `this.resolve`, `this.logger.error`, `response.status(status).json`, `response.status`, `new Date().toISOString`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GlobalExceptionFilter.resolve`

- **Firma:** `resolve(exception: unknown): ErrorBody` — [global-exception.filter.ts](../../../../comercial-jhoel-api/src/shared/filters/global-exception.filter.ts#L56) (L56–88)
- **Propósito / descripción:** `DomainError` is checked first — it is the common case (a use case rejecting on a business rule) and carries its own `status`; anything else falls through to generic HTTP/500 handling.
- **Dependencias (llamadas en su cuerpo):** `exception.message.startsWith`, `financialDayReviewErrorFromMessage`, `exception.getResponse`, `exception.getStatus`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-spec-ts"></a>

### pdf-helpers.spec.ts

- **Ruta:** [pdf-helpers.spec.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/pdf/pdf-helpers.spec.ts) (`comercial-jhoel-api/src/shared/infrastructure/pdf/pdf-helpers.spec.ts`, 76 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Infraestructura · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** Prueba unitaria: declara `buildTestDocument`, `TINY_PNG_BASE64` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [pdf-helpers.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-ts)
- **Paquetes externos:** `pdfkit`
- **Consumidores:** —
#### Función `buildTestDocument` (L7–15)

- **Tipo:** función local del archivo
- **Firma:** `buildTestDocument(): { doc: PDFKit.PDFDocument; finished: Promise<Buffer> }` — [pdf-helpers.spec.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/pdf/pdf-helpers.spec.ts#L7)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new PDFDocument`, `doc.on`, `chunks.push`, `new Promise`, `resolve`, `Buffer.concat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-ts"></a>

### pdf-helpers.ts

- **Ruta:** [pdf-helpers.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/pdf/pdf-helpers.ts) (`comercial-jhoel-api/src/shared/infrastructure/pdf/pdf-helpers.ts`, 122 líneas)
- **Tipo:** Código TypeScript · **Capa:** Infraestructura · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** `Date.prototype.toLocaleString` with no `timeZone` formats using the *server process's* local timezone, not Guatemala's — harmless when the API happens to run on a Guatemala-local host, but this project's Docker setup runs the container on UTC (see this repo's own CLAUDE.md note on the same class of
- **Descripción del autor (comentario del archivo):** `Date.prototype.toLocaleString` with no `timeZone` formats using the *server process's* local timezone, not Guatemala's — harmless when the API happens to run on a Guatemala-local host, but this project's Docker setup runs the container on UTC (see this repo's own CLAUDE.md note on the same class of bug in the Recargas sales-summary card), so a printed "Generado el"/"Fecha" timestamp would otherwise be silently off by the container's UTC offset from `America/Guatemala` (currently 6 hours, no DST). Pinning `timeZone` here makes every PDF correct regardless of what timezone the underlying server
- **Consumidores:** [export-products-pdf.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-pdf-use-case-ts), [purchase-pdf.builder.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-pdf-purchase-pdf-builder-ts), [quotation-pdf.builder.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-pdf-quotation-pdf-builder-ts), [report-pdf.builder.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts), [sale-pdf.builder.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-pdf-sale-pdf-builder-ts), [ticket-pdf.builder.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-pdf-ticket-pdf-builder-ts), [pdf-helpers.spec.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-spec-ts)

**Interfaces, tipos y enums:**

- `interface PdfCompanyLetterhead` (L53): sin documentación — miembros: `businessName`, `address`, `phone`, `email`, `taxId`, `logoBase64`
#### Función `formatDateTime` (L15–24)

- **Tipo:** función exportada
- **Firma:** `formatDateTime(date: Date): string` — [pdf-helpers.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/pdf/pdf-helpers.ts#L15)
- **Propósito / descripción:** `Date.prototype.toLocaleString` with no `timeZone` formats using the *server process's* local timezone, not Guatemala's — harmless when the API happens to run on a Guatemala-local host, but this project's Docker setup runs the container on UTC (see this repo's own CLAUDE.md note on the same class of bug in the Recargas sales-summary card), so a printed "Generado el"/"Fecha" timestamp would otherwise be silently off by the container's UTC offset from `America/Guatemala` (currently 6 hours, no DST). Pinning `timeZone` here makes every PDF correct regardless of what timezone the underlying server/container happens to run in. Originally lived only in `report-pdf.builder.ts`; extracted here so ev
- **Dependencias:** `date.toLocaleString`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchase-pdf.builder.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-pdf-purchase-pdf-builder-ts), [quotation-pdf.builder.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-pdf-quotation-pdf-builder-ts), [report-pdf.builder.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts), [sale-pdf.builder.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-pdf-sale-pdf-builder-ts), [ticket-pdf.builder.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-pdf-ticket-pdf-builder-ts)

#### Función `formatCurrency` (L38–40)

- **Tipo:** función exportada
- **Firma:** `formatCurrency(amount: number): string` — [pdf-helpers.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/pdf/pdf-helpers.ts#L38)
- **Propósito / descripción:** The one money format every document PDF in this app uses — matches the frontend's own `formatCurrency` exactly (`Q 1,234.56`, comma thousands separator, always two decimals) and mirrors `reports/application/utils/ report-format.util.ts`'s own `formatReportCurrency` (kept there unchanged, since that module's own PDF exports already use it and touching it is out of scope here) — duplicated as a tiny, pure one-liner rather than reaching into Reportería's application layer from Sales/ Purchases/Tickets/Cotizaciones, which would be a cross-module dependency this codebase never takes (modules only depend on each other's exported domain interfaces, never another feature's application utils).
- **Dependencias:** `amount.toLocaleString`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-products-pdf.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-pdf-use-case-ts), [purchase-pdf.builder.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-pdf-purchase-pdf-builder-ts), [quotation-pdf.builder.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-pdf-quotation-pdf-builder-ts), [sale-pdf.builder.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-pdf-sale-pdf-builder-ts), [ticket-pdf.builder.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-pdf-ticket-pdf-builder-ts)

#### Función `drawDivider` (L42–51)

- **Tipo:** función exportada
- **Firma:** `drawDivider(doc: PDFKit.PDFDocument): void` — [pdf-helpers.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/pdf/pdf-helpers.ts#L42)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveTo(doc.page.margins.left, y).lineTo`, `doc.moveTo`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchase-pdf.builder.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-pdf-purchase-pdf-builder-ts), [quotation-pdf.builder.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-pdf-quotation-pdf-builder-ts), [report-pdf.builder.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts), [sale-pdf.builder.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-pdf-sale-pdf-builder-ts), [ticket-pdf.builder.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-pdf-ticket-pdf-builder-ts)

#### Función `drawCompanyLetterhead` (L73–121)

- **Tipo:** función exportada
- **Firma:** `drawCompanyLetterhead(doc: PDFKit.PDFDocument, company: PdfCompanyLetterhead): void` — [pdf-helpers.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/pdf/pdf-helpers.ts#L73)
- **Propósito / descripción:** Shared letterhead block reused by every document PDF (Venta, Compra, Ticket, Cotización) — logo (if configured) + business name + whichever of address/phone/email/NIT are actually present. A missing/empty/corrupt logo must never break PDF generation, same defensive try/catch already proven in `report-pdf.builder.ts`'s own `drawHeader` for its file-based logo — this version decodes a base64 string instead of reading a file, since company branding is admin-configurable data, not a bundled asset.
- **Dependencias:** `Buffer.from`, `doc.image`, `doc.fontSize(14).fillColor('#0f172a').text`, `doc.fontSize(14).fillColor`, `doc.fontSize`, `doc.fontSize(9).fillColor`, `doc.text`, `Math.max`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchase-pdf.builder.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-pdf-purchase-pdf-builder-ts), [quotation-pdf.builder.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-pdf-quotation-pdf-builder-ts), [sale-pdf.builder.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-pdf-sale-pdf-builder-ts), [ticket-pdf.builder.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-pdf-ticket-pdf-builder-ts)

<a id="f-comercial-jhoel-api-src-shared-infrastructure-persistence-apply-search-terms-util-ts"></a>

### apply-search-terms.util.ts

- **Ruta:** [apply-search-terms.util.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/persistence/apply-search-terms.util.ts) (`comercial-jhoel-api/src/shared/infrastructure/persistence/apply-search-terms.util.ts`, 27 líneas)
- **Tipo:** Utilidad · **Capa:** Infraestructura · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** Splits a raw search term on whitespace and ANDs one `search_normalize(...)`-based condition per word onto the query builder, so a multi-word term like "garcia lopez" or "juan garcia" matches regardless of word order/adjacency across the target field(s) — each word just has to appear *somewhere* among them.
- **Paquetes externos:** `typeorm`
- **Consumidores:** [typeorm-bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-repository-ts), [typeorm-client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-typeorm-client-repository-ts), [typeorm-news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-typeorm-news-article-repository-ts), [typeorm-product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-typeorm-product-repository-ts), [typeorm-supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-typeorm-supplier-repository-ts), [typeorm-user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-typeorm-user-repository-ts)
#### Función `applySearchTerms` (L16–26)

- **Tipo:** función exportada
- **Firma:** `applySearchTerms(qb: SelectQueryBuilder<T>, rawSearch: string, buildCondition: (paramName: string) => string): void` — [apply-search-terms.util.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/persistence/apply-search-terms.util.ts#L16)
- **Propósito / descripción:** Splits a raw search term on whitespace and ANDs one `search_normalize(...)`-based condition per word onto the query builder, so a multi-word term like "garcia lopez" or "juan garcia" matches regardless of word order/adjacency across the target field(s) — each word just has to appear *somewhere* among them. Centralizes the word-splitting so it's never duplicated per-repository — see `AddSearchNormalizationSupport` and `search_normalize()` for the underlying accent/case-insensitive comparison this builds on. `buildCondition` receives each word's bound parameter name and must return a raw SQL WHERE-clause fragment referencing `:&lt;thatParamName&gt;` (typically an OR across one or more `search_normal
- **Dependencias:** `rawSearch.trim().split(/\s+/).filter`, `rawSearch.trim().split`, `rawSearch.trim`, `words.forEach`, `qb.andWhere`, `buildCondition`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-repository-ts), [typeorm-client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-typeorm-client-repository-ts), [typeorm-news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-typeorm-news-article-repository-ts), [typeorm-product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-typeorm-product-repository-ts), [typeorm-supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-typeorm-supplier-repository-ts), [typeorm-user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-typeorm-user-repository-ts)

<a id="f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts"></a>

### decimal.transformer.ts

- **Ruta:** [decimal.transformer.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/persistence/decimal.transformer.ts) (`comercial-jhoel-api/src/shared/infrastructure/persistence/decimal.transformer.ts`, 20 líneas)
- **Tipo:** Transformador · **Capa:** Infraestructura · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** Postgres `numeric` columns are the correct type for money (exact, arbitrary precision — never `float`/`double`, which round).
- **Paquetes externos:** `typeorm`
- **Consumidores:** [account-receivable.orm-entity.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-orm-entity-ts), [asset.orm-entity.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-orm-entity-ts), [bank-deposit-cash-detail.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-cash-detail-orm-entity-ts), [bank-deposit-operation.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts), [bank-deposit-transaction.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-transaction-orm-entity-ts), [agent-reconciliation.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-orm-entity-ts), [bank-balance.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-balance-orm-entity-ts), [bank.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-orm-entity-ts), [catalog-phone.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-orm-entity-ts), [catalog-request.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-orm-entity-ts), [company-settings.orm-entity.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-company-settings-orm-entity-ts), [ice-cream-purchase-detail.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-detail-orm-entity-ts), [ice-cream-purchase.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-orm-entity-ts), [ice-cream-sale-detail.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-detail-orm-entity-ts), [ice-cream-sale.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-orm-entity-ts) y 25 más

#### Clase `DecimalColumnTransformer` (L11–19)

- **Herencia / contratos:** implements ValueTransformer
- **Propósito:** Postgres `numeric` columns are the correct type for money (exact, arbitrary precision — never `float`/`double`, which round). The pg driver returns `numeric` values as strings by default so callers don't silently lose precision; this transformer converts back to `number` on read (our price/stock ranges never approach JS's float precision limits) while the DB itself still stores and computes on the exact decimal value.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `to` | método public | 12–14 | `value: number \| undefined` | `number \| undefined` |
| `from` | método public | 16–18 | `value: string \| null` | `number \| null` |

##### `DecimalColumnTransformer.to`

- **Firma:** `to(value: number \| undefined): number \| undefined` — [decimal.transformer.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/persistence/decimal.transformer.ts#L12) (L12–14)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DecimalColumnTransformer.from`

- **Firma:** `from(value: string \| null): number \| null` — [decimal.transformer.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/persistence/decimal.transformer.ts#L16) (L16–18)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-shared-infrastructure-services-bcrypt-password-hasher-service-ts"></a>

### bcrypt-password-hasher.service.ts

- **Ruta:** [bcrypt-password-hasher.service.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/services/bcrypt-password-hasher.service.ts) (`comercial-jhoel-api/src/shared/infrastructure/services/bcrypt-password-hasher.service.ts`, 19 líneas)
- **Tipo:** Servicio · **Capa:** Infraestructura · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** The concrete `PasswordHasher` bound in `SharedModule` — see that port's own doc comment for why nothing outside this file imports `bcrypt` directly.
- **Depende de (archivos del proyecto):** [password-hasher.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-password-hasher-port-ts)
- **Paquetes externos:** `@nestjs/common`, `bcrypt`
- **Consumidores:** [shared.module.ts](shared.md#f-comercial-jhoel-api-src-shared-shared-module-ts)

#### Clase `BcryptPasswordHasher` (L9–18)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements PasswordHasher
- **Propósito:** The concrete `PasswordHasher` bound in `SharedModule` — see that port's own doc comment for why nothing outside this file imports `bcrypt` directly.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `hash` | método public | 11–13 | `plain: string` | `Promise<string>` |
| `compare` | método public | 15–17 | `plain: string`, `hash: string` | `Promise<boolean>` |

##### `BcryptPasswordHasher.hash`

- **Firma:** `hash(plain: string): Promise<string>` — [bcrypt-password-hasher.service.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/services/bcrypt-password-hasher.service.ts#L11) (L11–13)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `bcrypt.hash`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BcryptPasswordHasher.compare`

- **Firma:** `compare(plain: string, hash: string): Promise<boolean>` — [bcrypt-password-hasher.service.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/services/bcrypt-password-hasher.service.ts#L15) (L15–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `bcrypt.compare`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-shared-infrastructure-services-typeorm-transaction-manager-service-ts"></a>

### typeorm-transaction-manager.service.ts

- **Ruta:** [typeorm-transaction-manager.service.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/services/typeorm-transaction-manager.service.ts) (`comercial-jhoel-api/src/shared/infrastructure/services/typeorm-transaction-manager.service.ts`, 29 líneas)
- **Tipo:** Servicio · **Capa:** Infraestructura · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** The concrete `TransactionManager` bound in `SharedModule`.
- **Depende de (archivos del proyecto):** [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [shared.module.ts](shared.md#f-comercial-jhoel-api-src-shared-shared-module-ts)

#### Clase `TypeOrmTransactionManager` (L17–28)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements TransactionManager
- **Propósito:** The concrete `TransactionManager` bound in `SharedModule`. The `TransactionContext` handed to `work()` is, concretely, a TypeORM `EntityManager` scoped to one transaction — a repository method that accepts it does `(context as EntityManager \| undefined) ?? this.repository.manager` before calling `.query(...)`, so every existing caller (which passes no context) is byte-identical to before this port existed.
- **Dependencias inyectadas (constructor):** `@InjectDataSource() dataSource: DataSource`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `runInTransaction` | método public | 21–27 | `work: (context: TransactionContext) => Promise<T>` | `Promise<T>` |

##### `TypeOrmTransactionManager.runInTransaction`

- **Firma:** `runInTransaction(work: (context: TransactionContext) => Promise<T>): Promise<T>` — [typeorm-transaction-manager.service.ts](../../../../comercial-jhoel-api/src/shared/infrastructure/services/typeorm-transaction-manager.service.ts#L21) (L21–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.transaction`, `work`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-shared-interceptors-response-interceptor-ts"></a>

### response.interceptor.ts

- **Ruta:** [response.interceptor.ts](../../../../comercial-jhoel-api/src/shared/interceptors/response.interceptor.ts) (`comercial-jhoel-api/src/shared/interceptors/response.interceptor.ts`, 37 líneas)
- **Tipo:** Interceptor · **Capa:** Transversal (shared) · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** Registered globally via `APP_INTERCEPTOR` — wraps every successful controller return value as `{ success: true, data }`, regardless of the module.
- **Paquetes externos:** `@nestjs/common`, `rxjs`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

**Interfaces, tipos y enums:**

- `interface ApiResponse` (L10): sin documentación — miembros: `success`, `data`

#### Clase `ResponseInterceptor` (L23–36)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements NestInterceptor&lt; T, ApiResponse&lt;T&gt; &gt;
- **Propósito:** Registered globally via `APP_INTERCEPTOR` — wraps every successful controller return value as `{ success: true, data }`, regardless of the module. This is why every use case can simply `return` its plain result; the envelope is applied uniformly here rather than by each controller. See `GlobalExceptionFilter` for the (deliberately differently shaped) error side of this contract.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `intercept` | método public | 28–35 | `context: ExecutionContext`, `next: CallHandler<T>` | `Observable<ApiResponse<T>>` |

##### `ResponseInterceptor.intercept`

- **Firma:** `intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>>` — [response.interceptor.ts](../../../../comercial-jhoel-api/src/shared/interceptors/response.interceptor.ts#L28) (L28–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `next.handle().pipe`, `next.handle`, `map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-shared-shared-module-ts"></a>

### shared.module.ts

- **Ruta:** [shared.module.ts](../../../../comercial-jhoel-api/src/shared/shared.module.ts) (`comercial-jhoel-api/src/shared/shared.module.ts`, 23 líneas)
- **Tipo:** Módulo · **Capa:** Transversal (shared) · **Módulo:** Código transversal del backend (shared)
- **Responsabilidad:** Infrastructure genuinely shared across module boundaries: `auth`/`users` both need to hash/compare passwords, so both import this module rather than each wiring its own `BcryptPasswordHasher` provider.
- **Depende de (archivos del proyecto):** [password-hasher.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-password-hasher-port-ts), [bcrypt-password-hasher.service.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-services-bcrypt-password-hasher-service-ts), [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts), [typeorm-transaction-manager.service.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-services-typeorm-transaction-manager-service-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [auth.module.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-auth-module-ts), [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts), [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts)

#### Clase `SharedModule` (L15–22)

- **Decoradores:** `@Module({ providers: [ { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher }, { provide: TRANSACTION_MANAGER, useClass: TypeOrmTransactionManager }, ], ex`
- **Propósito:** Infrastructure genuinely shared across module boundaries: `auth`/`users` both need to hash/compare passwords, so both import this module rather than each wiring its own `BcryptPasswordHasher` provider. `TRANSACTION_MANAGER` is the same idea for the one other cross-cutting need — a use case that must commit two different modules' repository writes atomically (see `bank-deposits`' Cuentas por Cobrar integration for its first real use).
