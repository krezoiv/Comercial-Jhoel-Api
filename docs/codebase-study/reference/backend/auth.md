# Módulo backend `auth`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/auth/login` | [auth.controller.ts](../../../../comercial-jhoel-api/src/modules/auth/presentation/controllers/auth.controller.ts#L27) `AuthController.login` | [LoginUseCase](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-login-use-case-ts) | `UserRepository`.findByUsernameOrPhone<br>`PasswordHasher`.compare<br>`TokenService`.sign | UseGuards(ThrottlerGuard) Throttle({ default: { limit: 5, ttl: 60_000 } }) | `AuthService.login` |
| `POST /api/auth/change-password` | [auth.controller.ts](../../../../comercial-jhoel-api/src/modules/auth/presentation/controllers/auth.controller.ts#L35) `AuthController.changePassword` | [ChangePasswordUseCase](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-change-password-use-case-ts) | `UserRepository`.findById/updatePasswordHash<br>`PasswordHasher`.compare/hash | UseGuards(JwtAuthGuard) | `AuthService.changePassword` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [token-service.port.ts](#f-comercial-jhoel-api-src-modules-auth-application-ports-token-service-port-ts) | .ts | Puerto (interfaz) | Aplicación | The claims actually encoded in the JWT. | 0 internas | 4 | Media (4 consumidores) |
| [change-password.use-case.ts](#f-comercial-jhoel-api-src-modules-auth-application-use-cases-change-password-use-case-ts) | .ts | Caso de uso | Aplicación | `userId` always comes from the caller's own JWT (`@CurrentUser` in `AuthController`), never from the request body — there is no way to call this for a different account. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [login.use-case.ts](#f-comercial-jhoel-api-src-modules-auth-application-use-cases-login-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `LoginUseCase`, `LoginInput`, `LoginOutput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [auth.module.ts](#f-comercial-jhoel-api-src-modules-auth-auth-module-ts) | .ts | Módulo | Arranque / configuración | `JwtStrategy` is registered here as a provider (Passport looks it up by being constructed at all, not by an explicit token) but the guards that *use* it — `JwtAuthGuard`, `RolesGuard` — live under `infrastructure/guards/` and are applied per-route in each feature module's own controller, not exported from here. | 8 internas; ext.: @nestjs/common, @nestjs/jwt, @nestjs/passport, @nestjs/config | 1 | Baja (1 consumidores) |
| [invalid-credentials.error.ts](#f-comercial-jhoel-api-src-modules-auth-domain-errors-invalid-credentials-error-ts) | .ts | Errores de dominio | Dominio | Deliberately one generic message for every failure reason it covers: unknown username/phone, wrong password, and a deactivated account in `LoginUseCase`; a wrong current password in `ChangePasswordUseCase`. | 1 internas | 2 | Baja (2 consumidores) |
| [jwt-auth.guard.ts](#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts) | .ts | Guard | Infraestructura | `@UseGuards(JwtAuthGuard)` on a route runs Passport's `'jwt'` strategy — i.e. | 0 internas; ext.: @nestjs/common, @nestjs/passport | 64 | Alta (64 consumidores) |
| [roles.guard.ts](#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts) | .ts | Guard | Infraestructura | Must run after JwtAuthGuard (`@UseGuards(JwtAuthGuard, RolesGuard)`) so `request.user` is already populated. | 3 internas; ext.: @nestjs/common, @nestjs/core | 56 | Alta (56 consumidores) |
| [jwt-token.service.ts](#f-comercial-jhoel-api-src-modules-auth-infrastructure-services-jwt-token-service-ts) | .ts | Servicio | Infraestructura | The concrete `TokenService`, bound in `AuthModule`; a thin wrapper over `@nestjs/jwt`'s own `JwtService`, configured (secret/expiry) in `AuthModule`'s `JwtModule.registerAsync`. | 1 internas; ext.: @nestjs/common, @nestjs/jwt | 1 | Baja (1 consumidores) |
| [jwt.strategy.ts](#f-comercial-jhoel-api-src-modules-auth-infrastructure-strategies-jwt-strategy-ts) | .ts | Estrategia Passport | Infraestructura | Estrategia Passport: declara `JwtStrategy` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common, @nestjs/passport, passport-jwt, @nestjs/config | 1 | Baja (1 consumidores) |
| [auth.controller.ts](#f-comercial-jhoel-api-src-modules-auth-presentation-controllers-auth-controller-ts) | .ts | Controlador | Presentación | Controlador: declara `AuthController` (sin comentario de documentación en el código). | 7 internas; ext.: @nestjs/common, @nestjs/throttler | 1 | Media (controlador) |
| [change-password.request.dto.ts](#f-comercial-jhoel-api-src-modules-auth-presentation-dtos-change-password-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `ChangePasswordRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [login.request.dto.ts](#f-comercial-jhoel-api-src-modules-auth-presentation-dtos-login-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `LoginRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [login.response.dto.ts](#f-comercial-jhoel-api-src-modules-auth-presentation-dtos-login-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `AuthUserResponseDto`, `LoginResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-auth-application-ports-token-service-port-ts"></a>

### token-service.port.ts

- **Ruta:** [token-service.port.ts](../../../../comercial-jhoel-api/src/modules/auth/application/ports/token-service.port.ts) (`comercial-jhoel-api/src/modules/auth/application/ports/token-service.port.ts`, 20 líneas)
- **Tipo:** Puerto (interfaz) · **Capa:** Aplicación · **Módulo:** Módulo backend `auth`
- **Responsabilidad:** The claims actually encoded in the JWT.
- **Consumidores:** [login.use-case.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-login-use-case-ts), [auth.module.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-auth-module-ts), [jwt-token.service.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-services-jwt-token-service-ts), [jwt.strategy.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-strategies-jwt-strategy-ts)

**Interfaces, tipos y enums:**

- `interface AuthTokenPayload` (L10): The claims actually encoded in the JWT. — miembros: `sub`, `username`, `role`
- `interface TokenService` (L17): A port around `@nestjs/jwt`, mirroring `PasswordHasher`'s own reasoning — `LoginUseCase` depends on this interface, not on `JwtService` directly. — miembros: `sign`

**Constantes exportadas:**

- `TOKEN_SERVICE` (L1) = `Symbol('TOKEN_SERVICE')`
<a id="f-comercial-jhoel-api-src-modules-auth-application-use-cases-change-password-use-case-ts"></a>

### change-password.use-case.ts

- **Ruta:** [change-password.use-case.ts](../../../../comercial-jhoel-api/src/modules/auth/application/use-cases/change-password.use-case.ts) (`comercial-jhoel-api/src/modules/auth/application/use-cases/change-password.use-case.ts`, 47 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `auth`
- **Responsabilidad:** `userId` always comes from the caller's own JWT (`@CurrentUser` in `AuthController`), never from the request body — there is no way to call this for a different account.
- **Depende de (archivos del proyecto):** [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [user-not-found.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-user-not-found-error-ts), [password-hasher.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-password-hasher-port-ts), [invalid-credentials.error.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-domain-errors-invalid-credentials-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [auth.module.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-auth-module-ts), [auth.controller.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-presentation-controllers-auth-controller-ts)

**Interfaces, tipos y enums:**

- `interface ChangePasswordInput` (L9): sin documentación — miembros: `userId`, `currentPassword`, `newPassword`

#### Clase `ChangePasswordUseCase` (L22–46)

- **Decoradores:** `@Injectable()`
- **Propósito:** `userId` always comes from the caller's own JWT (`@CurrentUser` in `AuthController`), never from the request body — there is no way to call this for a different account. Requiring `currentPassword` is what stops a hijacked-but-not-yet-expired session (e.g. an unattended, logged-in browser) from silently locking the real owner out.
- **Dependencias inyectadas (constructor):** `@Inject(USER_REPOSITORY) userRepository: UserRepository`, `@Inject(PASSWORD_HASHER) passwordHasher: PasswordHasher`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 29–45 | `input: ChangePasswordInput` | `Promise<void>` |

##### `ChangePasswordUseCase.execute`

- **Firma:** `execute(input: ChangePasswordInput): Promise<void>` — [change-password.use-case.ts](../../../../comercial-jhoel-api/src/modules/auth/application/use-cases/change-password.use-case.ts#L29) (L29–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.userRepository.findById`, `new UserNotFoundError`, `this.passwordHasher.compare`, `new InvalidCredentialsError`, `this.passwordHasher.hash`, `this.userRepository.updatePasswordHash`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new UserNotFoundError(input.userId)`, `new InvalidCredentialsError()`
- **Consumidores:** [auth.controller.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-presentation-controllers-auth-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-auth-application-use-cases-login-use-case-ts"></a>

### login.use-case.ts

- **Ruta:** [login.use-case.ts](../../../../comercial-jhoel-api/src/modules/auth/application/use-cases/login.use-case.ts) (`comercial-jhoel-api/src/modules/auth/application/use-cases/login.use-case.ts`, 73 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `auth`
- **Responsabilidad:** Caso de uso: declara `LoginUseCase`, `LoginInput`, `LoginOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [password-hasher.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-password-hasher-port-ts), [token-service.port.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-ports-token-service-port-ts), [invalid-credentials.error.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-domain-errors-invalid-credentials-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [auth.module.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-auth-module-ts), [auth.controller.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-presentation-controllers-auth-controller-ts)

**Interfaces, tipos y enums:**

- `interface LoginInput` (L10): sin documentación — miembros: `identifier`, `password`
- `interface LoginOutput` (L15): sin documentación — miembros: `accessToken`, `user`

#### Clase `LoginUseCase` (L25–72)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(USER_REPOSITORY) userRepository: UserRepository`, `@Inject(PASSWORD_HASHER) passwordHasher: PasswordHasher`, `@Inject(TOKEN_SERVICE) tokenService: TokenService`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 33–71 | `input: LoginInput` | `Promise<LoginOutput>` |

##### `LoginUseCase.execute`

- **Firma:** `execute(input: LoginInput): Promise<LoginOutput>` — [login.use-case.ts](../../../../comercial-jhoel-api/src/modules/auth/application/use-cases/login.use-case.ts#L33) (L33–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.identifier.trim`, `this.userRepository.findByUsernameOrPhone`, `new InvalidCredentialsError`, `this.passwordHasher.compare`, `this.tokenService.sign`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidCredentialsError()`
- **Consumidores:** [auth.controller.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-presentation-controllers-auth-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-auth-auth-module-ts"></a>

### auth.module.ts

- **Ruta:** [auth.module.ts](../../../../comercial-jhoel-api/src/modules/auth/auth.module.ts) (`comercial-jhoel-api/src/modules/auth/auth.module.ts`, 47 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `auth`
- **Responsabilidad:** `JwtStrategy` is registered here as a provider (Passport looks it up by being constructed at all, not by an explicit token) but the guards that *use* it — `JwtAuthGuard`, `RolesGuard` — live under `infrastructure/guards/` and are applied per-route in each feature module's own controller, not exported from here.
- **Depende de (archivos del proyecto):** [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts), [shared.module.ts](shared.md#f-comercial-jhoel-api-src-shared-shared-module-ts), [auth.controller.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-presentation-controllers-auth-controller-ts), [login.use-case.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-login-use-case-ts), [change-password.use-case.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-change-password-use-case-ts), [token-service.port.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-ports-token-service-port-ts), [jwt-token.service.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-services-jwt-token-service-ts), [jwt.strategy.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-strategies-jwt-strategy-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/jwt`, `@nestjs/passport`, `@nestjs/config`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `AuthModule` (L21–46)

- **Decoradores:** `@Module({ imports: [ UsersModule, SharedModule, PassportModule, // Secret/expiry come from the same typed config namespace every other // module reads via 'Confi`
- **Propósito:** `JwtStrategy` is registered here as a provider (Passport looks it up by being constructed at all, not by an explicit token) but the guards that *use* it — `JwtAuthGuard`, `RolesGuard` — live under `infrastructure/guards/` and are applied per-route in each feature module's own controller, not exported from here.
<a id="f-comercial-jhoel-api-src-modules-auth-domain-errors-invalid-credentials-error-ts"></a>

### invalid-credentials.error.ts

- **Ruta:** [invalid-credentials.error.ts](../../../../comercial-jhoel-api/src/modules/auth/domain/errors/invalid-credentials.error.ts) (`comercial-jhoel-api/src/modules/auth/domain/errors/invalid-credentials.error.ts`, 18 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `auth`
- **Responsabilidad:** Deliberately one generic message for every failure reason it covers: unknown username/phone, wrong password, and a deactivated account in `LoginUseCase`; a wrong current password in `ChangePasswordUseCase`.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [change-password.use-case.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-change-password-use-case-ts), [login.use-case.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-login-use-case-ts)

#### Clase `InvalidCredentialsError` (L11–17)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Deliberately one generic message for every failure reason it covers: unknown username/phone, wrong password, and a deactivated account in `LoginUseCase`; a wrong current password in `ChangePasswordUseCase`. A caller must never be able to distinguish "this account doesn't exist" from "this account exists but something else is wrong" by message or timing — see each use case's own throw sites for the specific branches.
<a id="f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts"></a>

### jwt-auth.guard.ts

- **Ruta:** [jwt-auth.guard.ts](../../../../comercial-jhoel-api/src/modules/auth/infrastructure/guards/jwt-auth.guard.ts) (`comercial-jhoel-api/src/modules/auth/infrastructure/guards/jwt-auth.guard.ts`, 13 líneas)
- **Tipo:** Guard · **Capa:** Infraestructura · **Módulo:** Módulo backend `auth`
- **Responsabilidad:** `@UseGuards(JwtAuthGuard)` on a route runs Passport's `'jwt'` strategy — i.e.
- **Paquetes externos:** `@nestjs/common`, `@nestjs/passport`
- **Consumidores:** [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts), [account-receivable-payments.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts), [alert-settings.controller.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-presentation-controllers-alert-settings-controller-ts), [alerts.controller.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-presentation-controllers-alerts-controller-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts), [auth.controller.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-presentation-controllers-auth-controller-ts), [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts), [agent-reconciliations.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-agent-reconciliations-controller-ts), [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts), [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts), [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts), [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts), [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts) y 49 más

#### Clase `JwtAuthGuard` (L11–12)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends AuthGuard('jwt')
- **Propósito:** `@UseGuards(JwtAuthGuard)` on a route runs Passport's `'jwt'` strategy — i.e. `JwtStrategy.validate()` — before the handler executes, rejecting with 401 on a missing/invalid/expired token and otherwise populating `request.user` (read via the `@CurrentUser` decorator). This class has no logic of its own; it only names which registered strategy to run.
<a id="f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts"></a>

### roles.guard.ts

- **Ruta:** [roles.guard.ts](../../../../comercial-jhoel-api/src/modules/auth/infrastructure/guards/roles.guard.ts) (`comercial-jhoel-api/src/modules/auth/infrastructure/guards/roles.guard.ts`, 42 líneas)
- **Tipo:** Guard · **Capa:** Infraestructura · **Módulo:** Módulo backend `auth`
- **Responsabilidad:** Must run after JwtAuthGuard (`@UseGuards(JwtAuthGuard, RolesGuard)`) so `request.user` is already populated.
- **Depende de (archivos del proyecto):** [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [role.entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-entities-role-entity-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/core`
- **Consumidores:** [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts), [account-receivable-payments.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts), [alert-settings.controller.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-presentation-controllers-alert-settings-controller-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts), [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts), [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts), [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts), [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts), [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts), [catalog-requests.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-requests-controller-ts), [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts), [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts) y 41 más

#### Clase `RolesGuard` (L17–41)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements CanActivate
- **Propósito:** Must run after JwtAuthGuard (`@UseGuards(JwtAuthGuard, RolesGuard)`) so `request.user` is already populated. A route with no `@Roles(...)` passes through untouched — this only restricts routes that opt in.
- **Dependencias inyectadas (constructor):** `reflector: Reflector`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `canActivate` | método public | 21–40 | `context: ExecutionContext` | `boolean` |

##### `RolesGuard.canActivate`

- **Firma:** `canActivate(context: ExecutionContext): boolean` — [roles.guard.ts](../../../../comercial-jhoel-api/src/modules/auth/infrastructure/guards/roles.guard.ts#L21) (L21–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reflector.getAllAndOverride`, `context.getHandler`, `context.getClass`, `context.switchToHttp().getRequest`, `context.switchToHttp`, `requiredRoles.includes`, `new ForbiddenException`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ForbiddenException( 'No tienes permisos para realizar esta acción.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-auth-infrastructure-services-jwt-token-service-ts"></a>

### jwt-token.service.ts

- **Ruta:** [jwt-token.service.ts](../../../../comercial-jhoel-api/src/modules/auth/infrastructure/services/jwt-token.service.ts) (`comercial-jhoel-api/src/modules/auth/infrastructure/services/jwt-token.service.ts`, 17 líneas)
- **Tipo:** Servicio · **Capa:** Infraestructura · **Módulo:** Módulo backend `auth`
- **Responsabilidad:** The concrete `TokenService`, bound in `AuthModule`; a thin wrapper over `@nestjs/jwt`'s own `JwtService`, configured (secret/expiry) in `AuthModule`'s `JwtModule.registerAsync`.
- **Depende de (archivos del proyecto):** [token-service.port.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-ports-token-service-port-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/jwt`
- **Consumidores:** [auth.module.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-auth-module-ts)

#### Clase `NestJwtTokenService` (L9–16)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements TokenService
- **Propósito:** The concrete `TokenService`, bound in `AuthModule`; a thin wrapper over `@nestjs/jwt`'s own `JwtService`, configured (secret/expiry) in `AuthModule`'s `JwtModule.registerAsync`.
- **Dependencias inyectadas (constructor):** `jwtService: JwtService`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `sign` | método public | 13–15 | `payload: AuthTokenPayload` | `string` |

##### `NestJwtTokenService.sign`

- **Firma:** `sign(payload: AuthTokenPayload): string` — [jwt-token.service.ts](../../../../comercial-jhoel-api/src/modules/auth/infrastructure/services/jwt-token.service.ts#L13) (L13–15)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.jwtService.sign`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-auth-infrastructure-strategies-jwt-strategy-ts"></a>

### jwt.strategy.ts

- **Ruta:** [jwt.strategy.ts](../../../../comercial-jhoel-api/src/modules/auth/infrastructure/strategies/jwt.strategy.ts) (`comercial-jhoel-api/src/modules/auth/infrastructure/strategies/jwt.strategy.ts`, 43 líneas)
- **Tipo:** Estrategia Passport · **Capa:** Infraestructura · **Módulo:** Módulo backend `auth`
- **Responsabilidad:** Estrategia Passport: declara `JwtStrategy` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [token-service.port.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-ports-token-service-port-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/passport`, `passport-jwt`, `@nestjs/config`
- **Consumidores:** [auth.module.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-auth-module-ts)

#### Clase `JwtStrategy` (L10–42)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends PassportStrategy(Strategy)
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `configService: ConfigService`, `@Inject(USER_REPOSITORY) userRepository: UserRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `validate` | método public async | 28–41 | `payload: AuthTokenPayload` | `Promise<RequestUser>` |

##### `JwtStrategy.validate`

- **Firma:** `validate(payload: AuthTokenPayload): Promise<RequestUser>` — [jwt.strategy.ts](../../../../comercial-jhoel-api/src/modules/auth/infrastructure/strategies/jwt.strategy.ts#L28) (L28–41)
- **Propósito / descripción:** Hits the DB on every authenticated request (not just at login) so a deactivated account or a since-changed role can't keep acting on a JWT issued before the change — a still-valid token is not enough on its own.
- **Dependencias (llamadas en su cuerpo):** `this.userRepository.findById`, `new UnauthorizedException`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new UnauthorizedException( 'Tu cuenta ha sido desactivada o ya no existe.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-auth-presentation-controllers-auth-controller-ts"></a>

### auth.controller.ts

- **Ruta:** [auth.controller.ts](../../../../comercial-jhoel-api/src/modules/auth/presentation/controllers/auth.controller.ts) (`comercial-jhoel-api/src/modules/auth/presentation/controllers/auth.controller.ts`, 45 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `auth`
- **Responsabilidad:** Controlador: declara `AuthController` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [login.use-case.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-login-use-case-ts), [change-password.use-case.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-change-password-use-case-ts), [login.request.dto.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-presentation-dtos-login-request-dto-ts), [change-password.request.dto.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-presentation-dtos-change-password-request-dto-ts), [login.response.dto.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-presentation-dtos-login-response-dto-ts), [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/throttler`
- **Consumidores:** [auth.module.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-auth-module-ts)

#### Clase `AuthController` (L18–44)

- **Decoradores:** `@Controller('auth')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `loginUseCase: LoginUseCase`, `changePasswordUseCase: ChangePasswordUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `login` | método public | 27–33 | `dto: LoginRequestDto` | `Promise<LoginResponseDto>` |
| `changePassword` | método public | 35–43 | `userId: string`, `dto: ChangePasswordRequestDto` | `Promise<void>` |

##### `AuthController.login`

- **Firma:** `login(dto: LoginRequestDto): Promise<LoginResponseDto>` — [auth.controller.ts](../../../../comercial-jhoel-api/src/modules/auth/presentation/controllers/auth.controller.ts#L27) (L27–33)
- **Decoradores:** `@UseGuards(ThrottlerGuard)` `@Throttle({ default: { limit: 5, ttl: 60_000 } })` `@Post('login')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.loginUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AuthController.changePassword`

- **Firma:** `changePassword(userId: string, dto: ChangePasswordRequestDto): Promise<void>` — [auth.controller.ts](../../../../comercial-jhoel-api/src/modules/auth/presentation/controllers/auth.controller.ts#L35) (L35–43)
- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Post('change-password')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@CurrentUser('userId') userId`, `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.changePasswordUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-auth-presentation-dtos-change-password-request-dto-ts"></a>

### change-password.request.dto.ts

- **Ruta:** [change-password.request.dto.ts](../../../../comercial-jhoel-api/src/modules/auth/presentation/dtos/change-password.request.dto.ts) (`comercial-jhoel-api/src/modules/auth/presentation/dtos/change-password.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `auth`
- **Responsabilidad:** DTO de entrada: declara `ChangePasswordRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [auth.controller.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-presentation-controllers-auth-controller-ts)

#### Clase `ChangePasswordRequestDto` (L3–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-auth-presentation-dtos-login-request-dto-ts"></a>

### login.request.dto.ts

- **Ruta:** [login.request.dto.ts](../../../../comercial-jhoel-api/src/modules/auth/presentation/dtos/login.request.dto.ts) (`comercial-jhoel-api/src/modules/auth/presentation/dtos/login.request.dto.ts`, 15 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `auth`
- **Responsabilidad:** DTO de entrada: declara `LoginRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [auth.controller.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-presentation-controllers-auth-controller-ts)

#### Clase `LoginRequestDto` (L3–14)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-auth-presentation-dtos-login-response-dto-ts"></a>

### login.response.dto.ts

- **Ruta:** [login.response.dto.ts](../../../../comercial-jhoel-api/src/modules/auth/presentation/dtos/login.response.dto.ts) (`comercial-jhoel-api/src/modules/auth/presentation/dtos/login.response.dto.ts`, 12 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `auth`
- **Responsabilidad:** DTO de respuesta: declara `AuthUserResponseDto`, `LoginResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [auth.controller.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-presentation-controllers-auth-controller-ts)

#### Clase `AuthUserResponseDto` (L1–6)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `LoginResponseDto` (L8–11)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
