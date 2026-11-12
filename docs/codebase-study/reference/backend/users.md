# Módulo backend `users`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/users/register` | [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L58) `UsersController.register` | [RegisterUserUseCase](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-register-user-use-case-ts) | `UserRepository`.findByUsername/findByPhone/create<br>`PasswordHasher`.hash<br>`RoleRepository`.findByName | — | — |
| `POST /api/users` | [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L66) `UsersController.create` | [CreateUserUseCase](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-create-user-use-case-ts) | `UserRepository`.findByUsername/findByPhone/create<br>`PasswordHasher`.hash<br>`RoleRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `UserService.createUser` |
| `GET /api/users/me/preferences` | [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L84) `UsersController.getMyPreferences` | [GetUserPreferencesUseCase](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-preferences-use-case-ts) | `UserRepository`.findById | UseGuards(JwtAuthGuard) | — |
| `PATCH /api/users/me/preferences/theme` | [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L92) `UsersController.updateMyTheme` | [UpdateUserThemeUseCase](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-theme-use-case-ts) | `UserRepository`.findById/update | UseGuards(JwtAuthGuard) | — |
| `GET /api/users` | [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L101) `UsersController.findAll` | [ListUsersUseCase](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-list-users-use-case-ts) | `UserRepository`.findAll | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `UserService.getUsers` |
| `GET /api/users/:id` | [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L110) `UsersController.findOne` | [GetUserByIdUseCase](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-by-id-use-case-ts) | `UserRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `UserService.getUserById` |
| `PATCH /api/users/:id` | [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L117) `UsersController.update` | [UpdateUserUseCase](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts) | `UserRepository`.findById/findByUsername/findByPhone/update<br>`PasswordHasher`.hash<br>`RoleRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `UserService.updateUser` |
| `DELETE /api/users/:id` | [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L128) `UsersController.deactivate` | [DeactivateUserUseCase](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-deactivate-user-use-case-ts) | `UserRepository`.findById/deactivate | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `UserService.deleteUser` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [user-output.ts](#f-comercial-jhoel-api-src-modules-users-application-dtos-user-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Plain, serializable shape use cases return — never the domain entity, and never passwordHash. | 1 internas | 4 | Media (4 consumidores) |
| [user-preferences-output.ts](#f-comercial-jhoel-api-src-modules-users-application-dtos-user-preferences-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Deliberately just `theme` — the only preference that exists today; doesn't reuse `UserOutput` so as not to leak administrative fields (role, status, phone) into an endpoint meant for "my own settings". | 1 internas | 2 | Baja (2 consumidores) |
| [create-user.use-case.ts](#f-comercial-jhoel-api-src-modules-users-application-use-cases-create-user-use-case-ts) | .ts | Caso de uso | Aplicación | Admin-only creation (`POST /users`) — lets the caller assign any active role. | 7 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-user.use-case.ts](#f-comercial-jhoel-api-src-modules-users-application-use-cases-deactivate-user-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only (`isActive=false`) — never a physical DELETE. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-user-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetUserByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-user-preferences.use-case.ts](#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-preferences-use-case-ts) | .ts | Caso de uso | Aplicación | `GET /users/me/preferences` — `userId` always comes from `@CurrentUser` (JWT), never from a route parameter or body: there is no way to request another user's preference through this endpoint. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-users.use-case.ts](#f-comercial-jhoel-api-src-modules-users-application-use-cases-list-users-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListUsersUseCase`, `ListUsersInput`, `ListUsersOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-user.use-case.ts](#f-comercial-jhoel-api-src-modules-users-application-use-cases-register-user-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the public `POST /users/register` endpoint — distinct from the admin-only `POST /users` (`CreateUserUseCase`), which lets an ADMIN/ SUPER_ADMIN assign any active role. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-user-theme.use-case.ts](#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-theme-use-case-ts) | .ts | Caso de uso | Aplicación | `PATCH /users/me/preferences/theme` — same pattern as every other simple single-field write in this module (see `UpdateUserUseCase`): a single-column `UPDATE` via `UserRepository.update()`, no stored procedure. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-user.use-case.ts](#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts) | .ts | Caso de uso | Aplicación | The admin-only "edit any user" path (`PATCH /users/:id`) — every field is optional and only re-validated/rewritten when actually present in `input`, so a partial edit (e.g. | 9 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [user.entity.ts](#f-comercial-jhoel-api-src-modules-users-domain-entities-user-entity-ts) | .ts | Entidad de dominio | Dominio | Models two distinct account origins in one table/entity: the originally seeded admin account (`name`+`email`) and every account created since (self-registered or admin-created), identified by `username`+`phone` instead. | 1 internas | 7 | Media (7 consumidores) |
| [cannot-deactivate-self.error.ts](#f-comercial-jhoel-api-src-modules-users-domain-errors-cannot-deactivate-self-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `CannotDeactivateSelfError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [phone-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-users-domain-errors-phone-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PhoneAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [user-not-found.error.ts](#f-comercial-jhoel-api-src-modules-users-domain-errors-user-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `UserNotFoundError` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [username-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-users-domain-errors-username-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `UsernameAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [user.repository.ts](#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `FindUsersOptions`, `PaginatedResult`, `CreateUserData`, `UpdateUserData`, `UserRepository` (sin comentario de documentación en el código). | 1 internas | 20 | Alta (20 consumidores) |
| [typeorm-user.repository.ts](#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-typeorm-user-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmUserRepository`, `SORT_COLUMN` (sin comentario de documentación en el código). | 7 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [user.mapper.ts](#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `UserMapper` (sin comentario de documentación en el código). | 3 internas | 1 | Baja (1 consumidores) |
| [user.orm-entity.ts](#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `UserOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 48 | Alta (48 consumidores) |
| [users.controller.ts](#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts) | .ts | Controlador | Presentación | No class-level guard: `register` is intentionally public (self-registration), while every admin route below opts in to `JwtAuthGuard` + `RolesGuard` individually — same split `AuthController` uses for login vs change-password. | 19 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [create-user.request.dto.ts](#f-comercial-jhoel-api-src-modules-users-presentation-dtos-create-user-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateUserRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-users.query.dto.ts](#f-comercial-jhoel-api-src-modules-users-presentation-dtos-list-users-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListUsersQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [register-user.request.dto.ts](#f-comercial-jhoel-api-src-modules-users-presentation-dtos-register-user-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `RegisterUserRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [update-theme.request.dto.ts](#f-comercial-jhoel-api-src-modules-users-presentation-dtos-update-theme-request-dto-ts) | .ts | DTO de entrada | Presentación | Only one accepted field: `theme`, restricted to `LIGHT`/`DARK` — the global `ValidationPipe` (`whitelist` + `forbidNonWhitelisted`) already rejects any other field before this DTO's own decorators even run. | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [update-user.request.dto.ts](#f-comercial-jhoel-api-src-modules-users-presentation-dtos-update-user-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateUserRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [user-preferences.response.dto.ts](#f-comercial-jhoel-api-src-modules-users-presentation-dtos-user-preferences-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `UserPreferencesResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [user.response.dto.ts](#f-comercial-jhoel-api-src-modules-users-presentation-dtos-user-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `UserResponseDto`, `PaginatedUsersResponseDto`, `RegisterUserResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [users.module.ts](#f-comercial-jhoel-api-src-modules-users-users-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `UsersModule` (sin comentario de documentación en el código). | 14 internas; ext.: @nestjs/common, @nestjs/typeorm | 3 | Media (3 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-users-application-dtos-user-output-ts"></a>

### user-output.ts

- **Ruta:** [user-output.ts](../../../../comercial-jhoel-api/src/modules/users/application/dtos/user-output.ts) (`comercial-jhoel-api/src/modules/users/application/dtos/user-output.ts`, 27 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Plain, serializable shape use cases return — never the domain entity, and never passwordHash.
- **Depende de (archivos del proyecto):** [user.entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-entities-user-entity-ts)
- **Consumidores:** [create-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-create-user-use-case-ts), [get-user-by-id.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-by-id-use-case-ts), [list-users.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-list-users-use-case-ts), [update-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts)

**Interfaces, tipos y enums:**

- `interface UserOutput` (L4): Plain, serializable shape use cases return — never the domain entity, and never passwordHash. — miembros: `id`, `username`, `phone`, `roleId`, `roleName`, `isActive`, `createdAt`, `updatedAt`
#### Función `toUserOutput` (L15–26)

- **Tipo:** función exportada
- **Firma:** `toUserOutput(user: User): UserOutput` — [user-output.ts](../../../../comercial-jhoel-api/src/modules/users/application/dtos/user-output.ts#L15)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-create-user-use-case-ts), [get-user-by-id.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-by-id-use-case-ts), [update-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-users-application-dtos-user-preferences-output-ts"></a>

### user-preferences-output.ts

- **Ruta:** [user-preferences-output.ts](../../../../comercial-jhoel-api/src/modules/users/application/dtos/user-preferences-output.ts) (`comercial-jhoel-api/src/modules/users/application/dtos/user-preferences-output.ts`, 11 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Deliberately just `theme` — the only preference that exists today; doesn't reuse `UserOutput` so as not to leak administrative fields (role, status, phone) into an endpoint meant for "my own settings".
- **Depende de (archivos del proyecto):** [user.entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-entities-user-entity-ts)
- **Consumidores:** [get-user-preferences.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-preferences-use-case-ts), [update-user-theme.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-theme-use-case-ts)

**Interfaces, tipos y enums:**

- `interface UserPreferencesOutput` (L4): Deliberately just `theme` — the only preference that exists today; doesn't reuse `UserOutput` so as not to leak administrative fields (role, status, phone) into an endpoint meant for "my own settings". — miembros: `theme`
#### Función `toUserPreferencesOutput` (L8–10)

- **Tipo:** función exportada
- **Firma:** `toUserPreferencesOutput(user: User): UserPreferencesOutput` — [user-preferences-output.ts](../../../../comercial-jhoel-api/src/modules/users/application/dtos/user-preferences-output.ts#L8)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-user-preferences.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-preferences-use-case-ts), [update-user-theme.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-theme-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-users-application-use-cases-create-user-use-case-ts"></a>

### create-user.use-case.ts

- **Ruta:** [create-user.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/create-user.use-case.ts) (`comercial-jhoel-api/src/modules/users/application/use-cases/create-user.use-case.ts`, 60 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Admin-only creation (`POST /users`) — lets the caller assign any active role.
- **Depende de (archivos del proyecto):** [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [password-hasher.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-password-hasher-port-ts), [role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-repositories-role-repository-ts), [invalid-role.error.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-errors-invalid-role-error-ts), [username-already-exists.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-username-already-exists-error-ts), [phone-already-exists.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-phone-already-exists-error-ts), [user-output.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-dtos-user-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts), [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateUserInput` (L13): sin documentación — miembros: `username`, `phone`, `password`, `roleId`

#### Clase `CreateUserUseCase` (L21–59)

- **Decoradores:** `@Injectable()`
- **Propósito:** Admin-only creation (`POST /users`) — lets the caller assign any active role.
- **Dependencias inyectadas (constructor):** `@Inject(USER_REPOSITORY) userRepository: UserRepository`, `@Inject(PASSWORD_HASHER) passwordHasher: PasswordHasher`, `@Inject(ROLE_REPOSITORY) roleRepository: RoleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 29–58 | `input: CreateUserInput` | `Promise<UserOutput>` |

##### `CreateUserUseCase.execute`

- **Firma:** `execute(input: CreateUserInput): Promise<UserOutput>` — [create-user.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/create-user.use-case.ts#L29) (L29–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.username.trim`, `input.phone.trim`, `this.userRepository.findByUsername`, `new UsernameAlreadyExistsError`, `this.userRepository.findByPhone`, `new PhoneAlreadyExistsError`, `this.roleRepository.findById`, `new InvalidRoleError`, `this.passwordHasher.hash`, `this.userRepository.create`, `toUserOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new UsernameAlreadyExistsError(username)`, `new PhoneAlreadyExistsError(phone)`, `new InvalidRoleError()`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-users-application-use-cases-deactivate-user-use-case-ts"></a>

### deactivate-user.use-case.ts

- **Ruta:** [deactivate-user.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/deactivate-user.use-case.ts) (`comercial-jhoel-api/src/modules/users/application/use-cases/deactivate-user.use-case.ts`, 31 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Soft delete only (`isActive=false`) — never a physical DELETE.
- **Depende de (archivos del proyecto):** [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [user-not-found.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-user-not-found-error-ts), [cannot-deactivate-self.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-cannot-deactivate-self-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts), [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts)

#### Clase `DeactivateUserUseCase` (L12–30)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only (`isActive=false`) — never a physical DELETE. Blocks an admin from deactivating their own account, which would otherwise let them lock themselves out (or, if they're the last admin, lock everyone out).
- **Dependencias inyectadas (constructor):** `@Inject(USER_REPOSITORY) userRepository: UserRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 18–29 | `id: string`, `currentUserId: string` | `Promise<void>` |

##### `DeactivateUserUseCase.execute`

- **Firma:** `execute(id: string, currentUserId: string): Promise<void>` — [deactivate-user.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/deactivate-user.use-case.ts#L18) (L18–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new CannotDeactivateSelfError`, `this.userRepository.findById`, `new UserNotFoundError`, `this.userRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CannotDeactivateSelfError()`, `new UserNotFoundError(id)`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-by-id-use-case-ts"></a>

### get-user-by-id.use-case.ts

- **Ruta:** [get-user-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/get-user-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/users/application/use-cases/get-user-by-id.use-case.ts`, 21 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Caso de uso: declara `GetUserByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [user-not-found.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-user-not-found-error-ts), [user-output.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-dtos-user-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts), [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts)

#### Clase `GetUserByIdUseCase` (L7–20)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(USER_REPOSITORY) userRepository: UserRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 13–19 | `id: string` | `Promise<UserOutput>` |

##### `GetUserByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<UserOutput>` — [get-user-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/get-user-by-id.use-case.ts#L13) (L13–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.userRepository.findById`, `new UserNotFoundError`, `toUserOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new UserNotFoundError(id)`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-preferences-use-case-ts"></a>

### get-user-preferences.use-case.ts

- **Ruta:** [get-user-preferences.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/get-user-preferences.use-case.ts) (`comercial-jhoel-api/src/modules/users/application/use-cases/get-user-preferences.use-case.ts`, 29 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** `GET /users/me/preferences` — `userId` always comes from `@CurrentUser` (JWT), never from a route parameter or body: there is no way to request another user's preference through this endpoint.
- **Depende de (archivos del proyecto):** [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [user-not-found.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-user-not-found-error-ts), [user-preferences-output.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-dtos-user-preferences-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts), [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts)

#### Clase `GetUserPreferencesUseCase` (L15–28)

- **Decoradores:** `@Injectable()`
- **Propósito:** `GET /users/me/preferences` — `userId` always comes from `@CurrentUser` (JWT), never from a route parameter or body: there is no way to request another user's preference through this endpoint.
- **Dependencias inyectadas (constructor):** `@Inject(USER_REPOSITORY) userRepository: UserRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 21–27 | `userId: string` | `Promise<UserPreferencesOutput>` |

##### `GetUserPreferencesUseCase.execute`

- **Firma:** `execute(userId: string): Promise<UserPreferencesOutput>` — [get-user-preferences.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/get-user-preferences.use-case.ts#L21) (L21–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.userRepository.findById`, `new UserNotFoundError`, `toUserPreferencesOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new UserNotFoundError(userId)`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-users-application-use-cases-list-users-use-case-ts"></a>

### list-users.use-case.ts

- **Ruta:** [list-users.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/list-users.use-case.ts) (`comercial-jhoel-api/src/modules/users/application/use-cases/list-users.use-case.ts`, 63 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Caso de uso: declara `ListUsersUseCase`, `ListUsersInput`, `ListUsersOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [user-output.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-dtos-user-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts), [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts)

**Interfaces, tipos y enums:**

- `interface ListUsersInput` (L10): sin documentación — miembros: `search`, `roleId`, `sortBy`, `sortDirection`, `page`, `limit`, `includeInactive`
- `interface ListUsersOutput` (L20): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `ListUsersUseCase` (L32–62)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(USER_REPOSITORY) userRepository: UserRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 38–61 | `input?: ListUsersInput` | `Promise<ListUsersOutput>` |

##### `ListUsersUseCase.execute`

- **Firma:** `execute(input?: ListUsersInput): Promise<ListUsersOutput>` — [list-users.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/list-users.use-case.ts#L38) (L38–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `this.userRepository.findAll`, `input.search?.trim`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-users-application-use-cases-register-user-use-case-ts"></a>

### register-user.use-case.ts

- **Ruta:** [register-user.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/register-user.use-case.ts) (`comercial-jhoel-api/src/modules/users/application/use-cases/register-user.use-case.ts`, 86 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Backs the public `POST /users/register` endpoint — distinct from the admin-only `POST /users` (`CreateUserUseCase`), which lets an ADMIN/ SUPER_ADMIN assign any active role.
- **Depende de (archivos del proyecto):** [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [password-hasher.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-password-hasher-port-ts), [role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-repositories-role-repository-ts), [username-already-exists.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-username-already-exists-error-ts), [phone-already-exists.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-phone-already-exists-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts), [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterUserInput` (L15): sin documentación — miembros: `username`, `phone`, `password`
- `interface RegisterUserOutput` (L21): sin documentación — miembros: `id`, `username`, `phone`, `role`, `createdAt`

#### Clase `RegisterUserUseCase` (L38–85)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the public `POST /users/register` endpoint — distinct from the admin-only `POST /users` (`CreateUserUseCase`), which lets an ADMIN/ SUPER_ADMIN assign any active role. Never let this use case accept a caller-supplied role.
- **Dependencias inyectadas (constructor):** `@Inject(USER_REPOSITORY) userRepository: UserRepository`, `@Inject(PASSWORD_HASHER) passwordHasher: PasswordHasher`, `@Inject(ROLE_REPOSITORY) roleRepository: RoleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 46–84 | `input: RegisterUserInput` | `Promise<RegisterUserOutput>` |

##### `RegisterUserUseCase.execute`

- **Firma:** `execute(input: RegisterUserInput): Promise<RegisterUserOutput>` — [register-user.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/register-user.use-case.ts#L46) (L46–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.username.trim`, `input.phone.trim`, `this.userRepository.findByUsername`, `new UsernameAlreadyExistsError`, `this.userRepository.findByPhone`, `new PhoneAlreadyExistsError`, `this.roleRepository.findByName`, `new InternalServerErrorException`, `this.passwordHasher.hash`, `this.userRepository.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new UsernameAlreadyExistsError(username)`, `new PhoneAlreadyExistsError(phone)`, `new InternalServerErrorException( 'El rol por defecto no está configurado.', )`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-theme-use-case-ts"></a>

### update-user-theme.use-case.ts

- **Ruta:** [update-user-theme.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/update-user-theme.use-case.ts) (`comercial-jhoel-api/src/modules/users/application/use-cases/update-user-theme.use-case.ts`, 45 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** `PATCH /users/me/preferences/theme` — same pattern as every other simple single-field write in this module (see `UpdateUserUseCase`): a single-column `UPDATE` via `UserRepository.update()`, no stored procedure.
- **Depende de (archivos del proyecto):** [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [user.entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-entities-user-entity-ts), [user-not-found.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-user-not-found-error-ts), [user-preferences-output.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-dtos-user-preferences-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts), [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts)

#### Clase `UpdateUserThemeUseCase` (L26–44)

- **Decoradores:** `@Injectable()`
- **Propósito:** `PATCH /users/me/preferences/theme` — same pattern as every other simple single-field write in this module (see `UpdateUserUseCase`): a single-column `UPDATE` via `UserRepository.update()`, no stored procedure. This codebase reserves PL/pgSQL functions for multi-table operations that need real atomicity (day closing, sales, purchases, recharges) — explicitly checked before writing this; `UpdateUserUseCase` (username, phone, role, password, `isActive`) already updates `users` with a plain `UPDATE`, so adding a stored procedure just for `theme` would introduce a parallel pattern for the same kind of operation. `userId` always comes from `@CurrentUser` (JWT) in the controller — never accepted as a parameter, so there is no way for this call to modify another user's preference.
- **Dependencias inyectadas (constructor):** `@Inject(USER_REPOSITORY) userRepository: UserRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 32–43 | `userId: string`, `theme: ThemePreference` | `Promise<UserPreferencesOutput>` |

##### `UpdateUserThemeUseCase.execute`

- **Firma:** `execute(userId: string, theme: ThemePreference): Promise<UserPreferencesOutput>` — [update-user-theme.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/update-user-theme.use-case.ts#L32) (L32–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.userRepository.findById`, `new UserNotFoundError`, `this.userRepository.update`, `toUserPreferencesOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.userRepository.update`
- **Errores que lanza:** `new UserNotFoundError(userId)`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts"></a>

### update-user.use-case.ts

- **Ruta:** [update-user.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/update-user.use-case.ts) (`comercial-jhoel-api/src/modules/users/application/use-cases/update-user.use-case.ts`, 99 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** The admin-only "edit any user" path (`PATCH /users/:id`) — every field is optional and only re-validated/rewritten when actually present in `input`, so a partial edit (e.g.
- **Depende de (archivos del proyecto):** [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [password-hasher.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-password-hasher-port-ts), [role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-repositories-role-repository-ts), [invalid-role.error.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-errors-invalid-role-error-ts), [user-not-found.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-user-not-found-error-ts), [username-already-exists.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-username-already-exists-error-ts), [phone-already-exists.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-phone-already-exists-error-ts), [cannot-deactivate-self.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-cannot-deactivate-self-error-ts), [user-output.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-dtos-user-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts), [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts)

**Interfaces, tipos y enums:**

- `interface UpdateUserInput` (L15): sin documentación — miembros: `username`, `phone`, `roleId`, `isActive`, `password`

#### Clase `UpdateUserUseCase` (L32–98)

- **Decoradores:** `@Injectable()`
- **Propósito:** The admin-only "edit any user" path (`PATCH /users/:id`) — every field is optional and only re-validated/rewritten when actually present in `input`, so a partial edit (e.g. just flipping `isActive`) never re-triggers a username/phone uniqueness check against unrelated, unchanged data. `password` is likewise only rehashed when a new one is supplied — "Nueva contraseña (opcional)" in the admin form maps directly to this optionality.
- **Dependencias inyectadas (constructor):** `@Inject(USER_REPOSITORY) userRepository: UserRepository`, `@Inject(PASSWORD_HASHER) passwordHasher: PasswordHasher`, `@Inject(ROLE_REPOSITORY) roleRepository: RoleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 40–97 | `id: string`, `input: UpdateUserInput`, `currentUserId: string` | `Promise<UserOutput>` |

##### `UpdateUserUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateUserInput, currentUserId: string): Promise<UserOutput>` — [update-user.use-case.ts](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/update-user.use-case.ts#L40) (L40–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.userRepository.findById`, `new UserNotFoundError`, `input.username?.trim`, `this.userRepository.findByUsername`, `new UsernameAlreadyExistsError`, `input.phone?.trim`, `this.userRepository.findByPhone`, `new PhoneAlreadyExistsError`, `this.roleRepository.findById`, `new InvalidRoleError`, `new CannotDeactivateSelfError`, `this.passwordHasher.hash`, `this.userRepository.update`, `toUserOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.userRepository.update`
- **Errores que lanza:** `new UserNotFoundError(id)`, `new UsernameAlreadyExistsError(username)`, `new PhoneAlreadyExistsError(phone)`, `new InvalidRoleError()`, `new CannotDeactivateSelfError()`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-users-domain-entities-user-entity-ts"></a>

### user.entity.ts

- **Ruta:** [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts) (`comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts`, 86 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Models two distinct account origins in one table/entity: the originally seeded admin account (`name`+`email`) and every account created since (self-registered or admin-created), identified by `username`+`phone` instead.
- **Depende de (archivos del proyecto):** [role.entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-entities-role-entity-ts)
- **Consumidores:** [user-output.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-dtos-user-output-ts), [user-preferences-output.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-dtos-user-preferences-output-ts), [update-user-theme.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-theme-use-case-ts), [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [typeorm-user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-typeorm-user-repository-ts), [user.mapper.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-mapper-ts), [update-theme.request.dto.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-dtos-update-theme-request-dto-ts)

**Interfaces, tipos y enums:**

- `interface UserProps` (L16): Models two distinct account origins in one table/entity: the originally seeded admin account (`name`+`email`) and every account created since (self-registered or admin-created), identified by `username`+`phone` instead. — miembros: `id`, `name`, `email`, `username`, `phone`, `passwordHash`, `roleId`, `roleName`, `isActive`, `theme`, `createdAt`, `updatedAt`
- `type ThemePreference` (L4) = `'LIGHT' \| 'DARK'` — "Modo Claro / Modo Oscuro" — preferencia individual del usuario, persistida en `users.theme`.

#### Clase `User` (L31–85)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: UserProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 34–36 | `props: UserProps` | `User` |
| `id` | getter public | 38–40 | — | `string` |
| `name` | getter public | 42–44 | — | `string \| null` |
| `email` | getter public | 46–48 | — | `string \| null` |
| `username` | getter public | 50–52 | — | `string \| null` |
| `phone` | getter public | 54–56 | — | `string \| null` |
| `passwordHash` | getter public | 58–60 | — | `string` |
| `roleId` | getter public | 62–64 | — | `string` |
| `roleName` | getter public | 66–68 | — | `RoleName` |
| `isActive` | getter public | 70–72 | — | `boolean` |
| `theme` | getter public | 74–76 | — | `ThemePreference` |
| `createdAt` | getter public | 78–80 | — | `Date` |
| `updatedAt` | getter public | 82–84 | — | `Date` |

##### `User.create`

- **Firma:** `create(props: UserProps): User` — [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new User`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-typeorm-user-repository-ts), [user.mapper.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-mapper-ts)

##### `User.id`

- **Firma:** `id(): string` — [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `User.name`

- **Firma:** `name(): string \| null` — [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `User.email`

- **Firma:** `email(): string \| null` — [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `User.username`

- **Firma:** `username(): string \| null` — [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `User.phone`

- **Firma:** `phone(): string \| null` — [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `User.passwordHash`

- **Firma:** `passwordHash(): string` — [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `User.roleId`

- **Firma:** `roleId(): string` — [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts#L62) (L62–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `User.roleName`

- **Firma:** `roleName(): RoleName` — [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts#L66) (L66–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `User.isActive`

- **Firma:** `isActive(): boolean` — [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts#L70) (L70–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `User.theme`

- **Firma:** `theme(): ThemePreference` — [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `User.createdAt`

- **Firma:** `createdAt(): Date` — [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `User.updatedAt`

- **Firma:** `updatedAt(): Date` — [user.entity.ts](../../../../comercial-jhoel-api/src/modules/users/domain/entities/user.entity.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-users-domain-errors-cannot-deactivate-self-error-ts"></a>

### cannot-deactivate-self.error.ts

- **Ruta:** [cannot-deactivate-self.error.ts](../../../../comercial-jhoel-api/src/modules/users/domain/errors/cannot-deactivate-self.error.ts) (`comercial-jhoel-api/src/modules/users/domain/errors/cannot-deactivate-self.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Errores de dominio: declara `CannotDeactivateSelfError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-deactivate-user-use-case-ts), [update-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts)

#### Clase `CannotDeactivateSelfError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-users-domain-errors-phone-already-exists-error-ts"></a>

### phone-already-exists.error.ts

- **Ruta:** [phone-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/users/domain/errors/phone-already-exists.error.ts) (`comercial-jhoel-api/src/modules/users/domain/errors/phone-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Errores de dominio: declara `PhoneAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-create-user-use-case-ts), [register-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-register-user-use-case-ts), [update-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts), [typeorm-user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-typeorm-user-repository-ts)

#### Clase `PhoneAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `phone: string`
<a id="f-comercial-jhoel-api-src-modules-users-domain-errors-user-not-found-error-ts"></a>

### user-not-found.error.ts

- **Ruta:** [user-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/users/domain/errors/user-not-found.error.ts) (`comercial-jhoel-api/src/modules/users/domain/errors/user-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Errores de dominio: declara `UserNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [change-password.use-case.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-change-password-use-case-ts), [deactivate-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-deactivate-user-use-case-ts), [get-user-by-id.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-by-id-use-case-ts), [get-user-preferences.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-preferences-use-case-ts), [update-user-theme.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-theme-use-case-ts), [update-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts)

#### Clase `UserNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-users-domain-errors-username-already-exists-error-ts"></a>

### username-already-exists.error.ts

- **Ruta:** [username-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/users/domain/errors/username-already-exists.error.ts) (`comercial-jhoel-api/src/modules/users/domain/errors/username-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Errores de dominio: declara `UsernameAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-create-user-use-case-ts), [register-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-register-user-use-case-ts), [update-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts), [typeorm-user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-typeorm-user-repository-ts)

#### Clase `UsernameAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `username: string`
<a id="f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts"></a>

### user.repository.ts

- **Ruta:** [user.repository.ts](../../../../comercial-jhoel-api/src/modules/users/domain/repositories/user.repository.ts) (`comercial-jhoel-api/src/modules/users/domain/repositories/user.repository.ts`, 54 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `FindUsersOptions`, `PaginatedResult`, `CreateUserData`, `UpdateUserData`, `UserRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-entities-user-entity-ts)
- **Consumidores:** [change-password.use-case.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-change-password-use-case-ts), [login.use-case.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-application-use-cases-login-use-case-ts), [jwt.strategy.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-strategies-jwt-strategy-ts), [export-bank-deposits-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-deposits-report-pdf-use-case-ts), [export-bank-movements-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-movements-report-pdf-use-case-ts), [export-bank-transfers-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts), [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts), [create-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-create-user-use-case-ts), [deactivate-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-deactivate-user-use-case-ts), [get-user-by-id.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-by-id-use-case-ts), [get-user-preferences.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-preferences-use-case-ts), [list-users.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-list-users-use-case-ts), [register-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-register-user-use-case-ts) y 5 más

**Interfaces, tipos y enums:**

- `interface FindUsersOptions` (L8): sin documentación — miembros: `activeOnly`, `search`, `roleId`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface PaginatedResult` (L18): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface CreateUserData` (L25): sin documentación — miembros: `username`, `phone`, `passwordHash`, `roleId`
- `interface UpdateUserData` (L32): sin documentación — miembros: `username`, `phone`, `passwordHash`, `roleId`, `isActive`, `theme`
- `interface UserRepository` (L41): sin documentación — miembros: `findAll`, `findByEmail`, `findById`, `findByUsername`, `findByPhone`, `findByUsernameOrPhone`, `updatePasswordHash`, `create`, `update`, `deactivate`
- `type UserSortField` (L5) = `'username' \| 'phone' \| 'createdAt'`
- `type SortDirection` (L6) = `'asc' \| 'desc'`

**Constantes exportadas:**

- `USER_REPOSITORY` (L3) = `Symbol('USER_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-typeorm-user-repository-ts"></a>

### typeorm-user.repository.ts

- **Ruta:** [typeorm-user.repository.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts) (`comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts`, 155 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmUserRepository`, `SORT_COLUMN` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [user.entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-entities-user-entity-ts), [username-already-exists.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-username-already-exists-error-ts), [phone-already-exists.error.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-errors-phone-already-exists-error-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [user.mapper.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-mapper-ts), [apply-search-terms.util.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-apply-search-terms-util-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts)

#### Clase `TypeOrmUserRepository` (L25–154)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements UserRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(UserOrmEntity) repository: Repository<UserOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 32–64 | `options: FindUsersOptions` | `Promise<PaginatedResult<User>>` |
| `findByEmail` | método public async | 66–71 | `email: string` | `Promise<User \| null>` |
| `findById` | método public async | 73–76 | `id: string` | `Promise<User \| null>` |
| `findByUsername` | método public async | 78–81 | `username: string` | `Promise<User \| null>` |
| `findByPhone` | método public async | 83–86 | `phone: string` | `Promise<User \| null>` |
| `findByUsernameOrPhone` | método public async | 88–93 | `identifier: string` | `Promise<User \| null>` |
| `updatePasswordHash` | método public async | 95–97 | `id: string`, `passwordHash: string` | `Promise<void>` |
| `create` | método public async | 99–118 | `data: CreateUserData` | `Promise<User>` |
| `update` | método public async | 120–128 | `id: string`, `data: UpdateUserData` | `Promise<User>` |
| `deactivate` | método public async | 130–132 | `id: string` | `Promise<void>` |
| `translateUniqueViolation` | método private | 134–153 | `error: unknown`, `username?: string`, `phone?: string` | `unknown` |

##### `TypeOrmUserRepository.findAll`

- **Firma:** `findAll(options: FindUsersOptions): Promise<PaginatedResult<User>>` — [typeorm-user.repository.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts#L32) (L32–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('user').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `applySearchTerms`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `orms.map`, `UserMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUserRepository.findByEmail`

- **Firma:** `findByEmail(email: string): Promise<User \| null>` — [typeorm-user.repository.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts#L66) (L66–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `email.toLowerCase`, `UserMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUserRepository.findById`

- **Firma:** `findById(id: string): Promise<User \| null>` — [typeorm-user.repository.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts#L73) (L73–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `UserMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUserRepository.findByUsername`

- **Firma:** `findByUsername(username: string): Promise<User \| null>` — [typeorm-user.repository.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts#L78) (L78–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `UserMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUserRepository.findByPhone`

- **Firma:** `findByPhone(phone: string): Promise<User \| null>` — [typeorm-user.repository.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts#L83) (L83–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `UserMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUserRepository.findByUsernameOrPhone`

- **Firma:** `findByUsernameOrPhone(identifier: string): Promise<User \| null>` — [typeorm-user.repository.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts#L88) (L88–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `UserMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUserRepository.updatePasswordHash`

- **Firma:** `updatePasswordHash(id: string, passwordHash: string): Promise<void>` — [typeorm-user.repository.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUserRepository.create`

- **Firma:** `create(data: CreateUserData): Promise<User>` — [typeorm-user.repository.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts#L99) (L99–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `UserMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data.username, data.phone)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUserRepository.update`

- **Firma:** `update(id: string, data: UpdateUserData): Promise<User>` — [typeorm-user.repository.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts#L120) (L120–128)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `UserMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation(error, data.username, data.phone)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUserRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-user.repository.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts#L130) (L130–132)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUserRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, username?: string, phone?: string): unknown` — [typeorm-user.repository.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts#L134) (L134–153)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new UsernameAlreadyExistsError`, `new PhoneAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-mapper-ts"></a>

### user.mapper.ts

- **Ruta:** [user.mapper.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/user.mapper.ts) (`comercial-jhoel-api/src/modules/users/infrastructure/persistence/user.mapper.ts`, 23 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Mapper: declara `UserMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [role.entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-entities-role-entity-ts), [user.entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-entities-user-entity-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Consumidores:** [typeorm-user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-typeorm-user-repository-ts)

#### Clase `UserMapper` (L5–22)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 6–21 | `orm: UserOrmEntity` | `User` |

##### `UserMapper.toDomain`

- **Firma:** `toDomain(orm: UserOrmEntity): User` — [user.mapper.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/user.mapper.ts#L6) (L6–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `User.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-typeorm-user-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts"></a>

### user.orm-entity.ts

- **Ruta:** [user.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/user.orm-entity.ts) (`comercial-jhoel-api/src/modules/users/infrastructure/persistence/user.orm-entity.ts`, 54 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `UserOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [role.orm-entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-role-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [admin-user.seed.ts](database.md#f-comercial-jhoel-api-src-database-seeds-admin-user-seed-ts), [account-type.orm-entity.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-account-type-orm-entity-ts), [account-receivable.orm-entity.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-orm-entity-ts), [alert-settings.orm-entity.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-alert-settings-orm-entity-ts), [asset.orm-entity.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-orm-entity-ts), [bank-deposit-operation.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts), [agent-reconciliation.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-orm-entity-ts), [bank-balance.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-balance-orm-entity-ts), [bank.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-orm-entity-ts), [day-audit-log.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-audit-log-orm-entity-ts), [day-opening.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-opening-orm-entity-ts), [catalog-phone.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-orm-entity-ts), [catalog-request.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-orm-entity-ts), [catalog-bank.orm-entity.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-catalog-bank-orm-entity-ts), [client.orm-entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-orm-entity-ts) y 33 más

#### Clase `UserOrmEntity` (L13–53)

- **Decoradores:** `@Entity('users')` `@Unique('UQ_users_username', ['username'])` `@Unique('UQ_users_phone', ['phone'])`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string \| null`, `@Column email: string \| null`, `@Column username: string \| null`, `@Column phone: string \| null`, `@Column passwordHash: string`, `@Column roleId: string`, `@ManyToOne role: RoleOrmEntity`, `@Column isActive: boolean`, `@Column theme: string`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts"></a>

### users.controller.ts

- **Ruta:** [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts) (`comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts`, 139 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** No class-level guard: `register` is intentionally public (self-registration), while every admin route below opts in to `JwtAuthGuard` + `RolesGuard` individually — same split `AuthController` uses for login vs change-password.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [register-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-register-user-use-case-ts), [create-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-create-user-use-case-ts), [list-users.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-list-users-use-case-ts), [get-user-by-id.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-by-id-use-case-ts), [update-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts), [deactivate-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-deactivate-user-use-case-ts), [get-user-preferences.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-preferences-use-case-ts), [update-user-theme.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-theme-use-case-ts), [register-user.request.dto.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-dtos-register-user-request-dto-ts), [create-user.request.dto.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-dtos-create-user-request-dto-ts), [update-user.request.dto.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-dtos-update-user-request-dto-ts) y 4 más
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts)

#### Clase `UsersController` (L44–138)

- **Decoradores:** `@Controller('users')`
- **Propósito:** No class-level guard: `register` is intentionally public (self-registration), while every admin route below opts in to `JwtAuthGuard` + `RolesGuard` individually — same split `AuthController` uses for login vs change-password.
- **Dependencias inyectadas (constructor):** `registerUserUseCase: RegisterUserUseCase`, `createUserUseCase: CreateUserUseCase`, `listUsersUseCase: ListUsersUseCase`, `getUserByIdUseCase: GetUserByIdUseCase`, `updateUserUseCase: UpdateUserUseCase`, `deactivateUserUseCase: DeactivateUserUseCase`, `getUserPreferencesUseCase: GetUserPreferencesUseCase`, `updateUserThemeUseCase: UpdateUserThemeUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `register` | método public | 58–64 | `dto: RegisterUserRequestDto` | `Promise<RegisterUserResponseDto>` |
| `create` | método public | 66–72 | `dto: CreateUserRequestDto` | `Promise<UserResponseDto>` |
| `getMyPreferences` | método public | 84–90 | `userId: string` | `Promise<UserPreferencesResponseDto>` |
| `updateMyTheme` | método public | 92–99 | `userId: string`, `dto: UpdateThemeRequestDto` | `Promise<UserPreferencesResponseDto>` |
| `findAll` | método public | 101–108 | `query: ListUsersQueryDto` | `Promise<PaginatedUsersResponseDto>` |
| `findOne` | método public | 110–115 | `id: string` | `Promise<UserResponseDto>` |
| `update` | método public | 117–126 | `id: string`, `dto: UpdateUserRequestDto`, `currentUserId: string` | `Promise<UserResponseDto>` |
| `deactivate` | método public | 128–137 | `id: string`, `currentUserId: string` | `Promise<void>` |

##### `UsersController.register`

- **Firma:** `register(dto: RegisterUserRequestDto): Promise<RegisterUserResponseDto>` — [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L58) (L58–64)
- **Decoradores:** `@Post('register')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Public self-registration — always assigns the USER role, never a caller-supplied one.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.registerUserUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UsersController.create`

- **Firma:** `create(dto: CreateUserRequestDto): Promise<UserResponseDto>` — [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L66) (L66–72)
- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.createUserUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UsersController.getMyPreferences`

- **Firma:** `getMyPreferences(userId: string): Promise<UserPreferencesResponseDto>` — [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L84) (L84–90)
- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Get('me/preferences')`
- **Propósito / descripción:** "Light Mode / Dark Mode" per user — open to any authenticated account (no `@Roles`, unlike the admin routes below): the theme is a personal preference, not an administrative action. `userId` always comes from `@CurrentUser` (JWT), never from a route parameter, so there is no way to read/write another account's preference through this endpoint. Declared before `:id` (the same reason as everywhere else in this codebase: a literal path segment must be registered before a dynamic one, or Nest would try to match "me" as `:id` and fail `ParseUUIDPipe`).
- **Origen de parámetros:** `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.getUserPreferencesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UsersController.updateMyTheme`

- **Firma:** `updateMyTheme(userId: string, dto: UpdateThemeRequestDto): Promise<UserPreferencesResponseDto>` — [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L92) (L92–99)
- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Patch('me/preferences/theme')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@CurrentUser('userId') userId`, `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.updateUserThemeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UsersController.findAll`

- **Firma:** `findAll(query: ListUsersQueryDto): Promise<PaginatedUsersResponseDto>` — [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L101) (L101–108)
- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listUsersUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UsersController.findOne`

- **Firma:** `findOne(id: string): Promise<UserResponseDto>` — [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L110) (L110–115)
- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getUserByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UsersController.update`

- **Firma:** `update(id: string, dto: UpdateUserRequestDto, currentUserId: string): Promise<UserResponseDto>` — [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L117) (L117–126)
- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') currentUserId`
- **Dependencias (llamadas en su cuerpo):** `this.updateUserUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UsersController.deactivate`

- **Firma:** `deactivate(id: string, currentUserId: string): Promise<void>` — [users.controller.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts#L128) (L128–137)
- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') currentUserId`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateUserUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-users-presentation-dtos-create-user-request-dto-ts"></a>

### create-user.request.dto.ts

- **Ruta:** [create-user.request.dto.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/dtos/create-user.request.dto.ts) (`comercial-jhoel-api/src/modules/users/presentation/dtos/create-user.request.dto.ts`, 38 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** DTO de entrada: declara `CreateUserRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

#### Clase `CreateUserRequestDto` (L10–37)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-users-presentation-dtos-list-users-query-dto-ts"></a>

### list-users.query.dto.ts

- **Ruta:** [list-users.query.dto.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/dtos/list-users.query.dto.ts) (`comercial-jhoel-api/src/modules/users/presentation/dtos/list-users.query.dto.ts`, 55 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** DTO de consulta: declara `ListUsersQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

#### Clase `ListUsersQueryDto` (L20–54)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-users-presentation-dtos-register-user-request-dto-ts"></a>

### register-user.request.dto.ts

- **Ruta:** [register-user.request.dto.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/dtos/register-user.request.dto.ts) (`comercial-jhoel-api/src/modules/users/presentation/dtos/register-user.request.dto.ts`, 34 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** DTO de entrada: declara `RegisterUserRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

#### Clase `RegisterUserRequestDto` (L9–33)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-users-presentation-dtos-update-theme-request-dto-ts"></a>

### update-theme.request.dto.ts

- **Ruta:** [update-theme.request.dto.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/dtos/update-theme.request.dto.ts) (`comercial-jhoel-api/src/modules/users/presentation/dtos/update-theme.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Only one accepted field: `theme`, restricted to `LIGHT`/`DARK` — the global `ValidationPipe` (`whitelist` + `forbidNonWhitelisted`) already rejects any other field before this DTO's own decorators even run.
- **Depende de (archivos del proyecto):** [user.entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-entities-user-entity-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

#### Clase `UpdateThemeRequestDto` (L7–10)

- **Propósito:** Only one accepted field: `theme`, restricted to `LIGHT`/`DARK` — the global `ValidationPipe` (`whitelist` + `forbidNonWhitelisted`) already rejects any other field before this DTO's own decorators even run.
<a id="f-comercial-jhoel-api-src-modules-users-presentation-dtos-update-user-request-dto-ts"></a>

### update-user.request.dto.ts

- **Ruta:** [update-user.request.dto.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/dtos/update-user.request.dto.ts) (`comercial-jhoel-api/src/modules/users/presentation/dtos/update-user.request.dto.ts`, 48 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** DTO de entrada: declara `UpdateUserRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

#### Clase `UpdateUserRequestDto` (L12–47)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-users-presentation-dtos-user-preferences-response-dto-ts"></a>

### user-preferences.response.dto.ts

- **Ruta:** [user-preferences.response.dto.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/dtos/user-preferences.response.dto.ts) (`comercial-jhoel-api/src/modules/users/presentation/dtos/user-preferences.response.dto.ts`, 4 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** DTO de respuesta: declara `UserPreferencesResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

#### Clase `UserPreferencesResponseDto` (L1–3)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-users-presentation-dtos-user-response-dto-ts"></a>

### user.response.dto.ts

- **Ruta:** [user.response.dto.ts](../../../../comercial-jhoel-api/src/modules/users/presentation/dtos/user.response.dto.ts) (`comercial-jhoel-api/src/modules/users/presentation/dtos/user.response.dto.ts`, 27 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `users`
- **Responsabilidad:** DTO de respuesta: declara `UserResponseDto`, `PaginatedUsersResponseDto`, `RegisterUserResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts)

#### Clase `UserResponseDto` (L1–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedUsersResponseDto` (L12–17)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RegisterUserResponseDto` (L20–26)

- **Propósito:** Response shape for POST /users/register — kept minimal, matches the pre-existing self-signup contract.
<a id="f-comercial-jhoel-api-src-modules-users-users-module-ts"></a>

### users.module.ts

- **Ruta:** [users.module.ts](../../../../comercial-jhoel-api/src/modules/users/users.module.ts) (`comercial-jhoel-api/src/modules/users/users.module.ts`, 39 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `users`
- **Responsabilidad:** Módulo: declara `UsersModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [typeorm-user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-typeorm-user-repository-ts), [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [register-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-register-user-use-case-ts), [create-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-create-user-use-case-ts), [list-users.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-list-users-use-case-ts), [get-user-by-id.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-by-id-use-case-ts), [update-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts), [deactivate-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-deactivate-user-use-case-ts), [get-user-preferences.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-get-user-preferences-use-case-ts), [update-user-theme.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-theme-use-case-ts), [users.controller.ts](users.md#f-comercial-jhoel-api-src-modules-users-presentation-controllers-users-controller-ts), [shared.module.ts](shared.md#f-comercial-jhoel-api-src-shared-shared-module-ts), [roles.module.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-roles-module-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [auth.module.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-auth-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `UsersModule` (L18–38)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([UserOrmEntity]), SharedModule, RolesModule, ], controllers: [UsersController], providers: [ { provide: USER_REPOSI`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
