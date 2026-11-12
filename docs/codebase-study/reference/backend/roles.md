# Módulo backend `roles`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/roles` | [roles.controller.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts#L46) `RolesController.create` | [CreateRoleUseCase](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-create-role-use-case-ts) | `RoleRepository`.findByName/create | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') | `RoleService.createRole` |
| `GET /api/roles` | [roles.controller.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts#L52) `RolesController.findAll` | [ListRolesUseCase](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-list-roles-use-case-ts) | `RoleRepository`.findAll/countUsersByRoleId [users] | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') | `RoleService.getRoles` |
| `GET /api/roles/:id` | [roles.controller.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts#L59) `RolesController.findOne` | [GetRoleByIdUseCase](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-get-role-by-id-use-case-ts) | `RoleRepository`.findById/countUsersByRoleId [users] | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') | `RoleService.getRoleById` |
| `PATCH /api/roles/:id` | [roles.controller.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts#L64) `RolesController.update` | [UpdateRoleUseCase](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts) | `RoleRepository`.findById/findByName/countUsersByRoleId/update [users] | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') | `RoleService.updateRole` |
| `DELETE /api/roles/:id` | [roles.controller.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts#L72) `RolesController.deactivate` | [DeactivateRoleUseCase](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-deactivate-role-use-case-ts) | `RoleRepository`.findById/countUsersByRoleId/deactivate [users] | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') | `RoleService.deleteRole` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [role-output.ts](#f-comercial-jhoel-api-src-modules-roles-application-dtos-role-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Plain, serializable shape use cases return — never the domain entity itself. | 1 internas | 4 | Media (4 consumidores) |
| [create-role.use-case.ts](#f-comercial-jhoel-api-src-modules-roles-application-use-cases-create-role-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateRoleUseCase`, `CreateRoleInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-role.use-case.ts](#f-comercial-jhoel-api-src-modules-roles-application-use-cases-deactivate-role-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — a role is never physically removed (the FK from `users` is RESTRICT anyway). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-role-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-roles-application-use-cases-get-role-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetRoleByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-roles.use-case.ts](#f-comercial-jhoel-api-src-modules-roles-application-use-cases-list-roles-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListRolesUseCase`, `ListRolesInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [normalize-role-name.ts](#f-comercial-jhoel-api-src-modules-roles-application-use-cases-normalize-role-name-ts) | .ts | Código TypeScript | Aplicación | `Cajero de turno` → `CAJERO_DE_TURNO` — matches the seeded roles' own naming style (SUPER_ADMIN, ADMIN, USER). | 0 internas | 2 | Baja (2 consumidores) |
| [update-role.use-case.ts](#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateRoleUseCase`, `UpdateRoleInput` (sin comentario de documentación en el código). | 8 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [role.entity.ts](#f-comercial-jhoel-api-src-modules-roles-domain-entities-role-entity-ts) | .ts | Entidad de dominio | Dominio | The three roles seeded by migration (`1756500000000-CreateRolesAndUserRoles`) — every `@Roles('ADMIN', 'SUPER_ADMIN')` check across the entire app is a literal string comparison against these exact names (see `RolesGuard`), not a database lookup per request. | 0 internas | 9 | Media (9 consumidores) |
| [invalid-role.error.ts](#f-comercial-jhoel-api-src-modules-roles-domain-errors-invalid-role-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidRoleError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [role-has-assigned-users.error.ts](#f-comercial-jhoel-api-src-modules-roles-domain-errors-role-has-assigned-users-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RoleHasAssignedUsersError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [role-name-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-roles-domain-errors-role-name-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RoleNameAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [role-not-found.error.ts](#f-comercial-jhoel-api-src-modules-roles-domain-errors-role-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RoleNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [system-role-immutable.error.ts](#f-comercial-jhoel-api-src-modules-roles-domain-errors-system-role-immutable-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SystemRoleImmutableError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [role.repository.ts](#f-comercial-jhoel-api-src-modules-roles-domain-repositories-role-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateRoleData`, `UpdateRoleData`, `RoleRepository`, `ROLE_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 10 | Alta (10 consumidores) |
| [role.mapper.ts](#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-role-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `RoleMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [role.orm-entity.ts](#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-role-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `RoleOrmEntity` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 5 | Media (5 consumidores) |
| [typeorm-role.repository.ts](#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-typeorm-role-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmRoleRepository` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [roles.controller.ts](#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts) | .ts | Controlador | Presentación | Every route here — including reads — is admin-only: unlike categories/products, the module ticket for Users & Roles requires SUPER_ADMIN/ADMIN on the whole surface, not just mutations. | 12 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [create-role.request.dto.ts](#f-comercial-jhoel-api-src-modules-roles-presentation-dtos-create-role-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateRoleRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-roles.query.dto.ts](#f-comercial-jhoel-api-src-modules-roles-presentation-dtos-list-roles-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListRolesQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [role.response.dto.ts](#f-comercial-jhoel-api-src-modules-roles-presentation-dtos-role-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `RoleResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [update-role.request.dto.ts](#f-comercial-jhoel-api-src-modules-roles-presentation-dtos-update-role-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateRoleRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [roles.module.ts](#f-comercial-jhoel-api-src-modules-roles-roles-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `RolesModule` (sin comentario de documentación en el código). | 9 internas; ext.: @nestjs/common, @nestjs/typeorm | 2 | Baja (2 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-roles-application-dtos-role-output-ts"></a>

### role-output.ts

- **Ruta:** [role-output.ts](../../../../comercial-jhoel-api/src/modules/roles/application/dtos/role-output.ts) (`comercial-jhoel-api/src/modules/roles/application/dtos/role-output.ts`, 25 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Plain, serializable shape use cases return — never the domain entity itself.
- **Depende de (archivos del proyecto):** [role.entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-entities-role-entity-ts)
- **Consumidores:** [create-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-create-role-use-case-ts), [get-role-by-id.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-get-role-by-id-use-case-ts), [list-roles.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-list-roles-use-case-ts), [update-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts)

**Interfaces, tipos y enums:**

- `interface RoleOutput` (L4): Plain, serializable shape use cases return — never the domain entity itself. — miembros: `id`, `name`, `description`, `isActive`, `usersCount`, `createdAt`, `updatedAt`
#### Función `toRoleOutput` (L14–24)

- **Tipo:** función exportada
- **Firma:** `toRoleOutput(role: Role, usersCount: number): RoleOutput` — [role-output.ts](../../../../comercial-jhoel-api/src/modules/roles/application/dtos/role-output.ts#L14)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-create-role-use-case-ts), [get-role-by-id.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-get-role-by-id-use-case-ts), [list-roles.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-list-roles-use-case-ts), [update-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-roles-application-use-cases-create-role-use-case-ts"></a>

### create-role.use-case.ts

- **Ruta:** [create-role.use-case.ts](../../../../comercial-jhoel-api/src/modules/roles/application/use-cases/create-role.use-case.ts) (`comercial-jhoel-api/src/modules/roles/application/use-cases/create-role.use-case.ts`, 34 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Caso de uso: declara `CreateRoleUseCase`, `CreateRoleInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-repositories-role-repository-ts), [role-name-already-exists.error.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-errors-role-name-already-exists-error-ts), [role-output.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-dtos-role-output-ts), [normalize-role-name.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-normalize-role-name-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts), [roles.module.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-roles-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateRoleInput` (L8): sin documentación — miembros: `name`, `description`

#### Clase `CreateRoleUseCase` (L13–33)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ROLE_REPOSITORY) roleRepository: RoleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–32 | `input: CreateRoleInput` | `Promise<RoleOutput>` |

##### `CreateRoleUseCase.execute`

- **Firma:** `execute(input: CreateRoleInput): Promise<RoleOutput>` — [create-role.use-case.ts](../../../../comercial-jhoel-api/src/modules/roles/application/use-cases/create-role.use-case.ts#L19) (L19–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `normalizeRoleName`, `this.roleRepository.findByName`, `new RoleNameAlreadyExistsError`, `this.roleRepository.create`, `input.description?.trim`, `toRoleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new RoleNameAlreadyExistsError(name)`
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-roles-application-use-cases-deactivate-role-use-case-ts"></a>

### deactivate-role.use-case.ts

- **Ruta:** [deactivate-role.use-case.ts](../../../../comercial-jhoel-api/src/modules/roles/application/use-cases/deactivate-role.use-case.ts) (`comercial-jhoel-api/src/modules/roles/application/use-cases/deactivate-role.use-case.ts`, 32 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Soft delete only — a role is never physically removed (the FK from `users` is RESTRICT anyway).
- **Depende de (archivos del proyecto):** [role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-repositories-role-repository-ts), [role-not-found.error.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-errors-role-not-found-error-ts), [role-has-assigned-users.error.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-errors-role-has-assigned-users-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts), [roles.module.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-roles-module-ts)

#### Clase `DeactivateRoleUseCase` (L12–31)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — a role is never physically removed (the FK from `users` is RESTRICT anyway). Blocked while any active user still references it, so an admin never silently strands users without a working role.
- **Dependencias inyectadas (constructor):** `@Inject(ROLE_REPOSITORY) roleRepository: RoleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 18–30 | `id: string` | `Promise<void>` |

##### `DeactivateRoleUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-role.use-case.ts](../../../../comercial-jhoel-api/src/modules/roles/application/use-cases/deactivate-role.use-case.ts#L18) (L18–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.roleRepository.findById`, `new RoleNotFoundError`, `this.roleRepository.countUsersByRoleId`, `new RoleHasAssignedUsersError`, `this.roleRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new RoleNotFoundError(id)`, `new RoleHasAssignedUsersError()`
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-roles-application-use-cases-get-role-by-id-use-case-ts"></a>

### get-role-by-id.use-case.ts

- **Ruta:** [get-role-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/roles/application/use-cases/get-role-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/roles/application/use-cases/get-role-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Caso de uso: declara `GetRoleByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-repositories-role-repository-ts), [role-not-found.error.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-errors-role-not-found-error-ts), [role-output.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-dtos-role-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts), [roles.module.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-roles-module-ts)

#### Clase `GetRoleByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ROLE_REPOSITORY) roleRepository: RoleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 13–20 | `id: string` | `Promise<RoleOutput>` |

##### `GetRoleByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<RoleOutput>` — [get-role-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/roles/application/use-cases/get-role-by-id.use-case.ts#L13) (L13–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.roleRepository.findById`, `new RoleNotFoundError`, `this.roleRepository.countUsersByRoleId`, `toRoleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new RoleNotFoundError(id)`
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-roles-application-use-cases-list-roles-use-case-ts"></a>

### list-roles.use-case.ts

- **Ruta:** [list-roles.use-case.ts](../../../../comercial-jhoel-api/src/modules/roles/application/use-cases/list-roles.use-case.ts) (`comercial-jhoel-api/src/modules/roles/application/use-cases/list-roles.use-case.ts`, 31 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Caso de uso: declara `ListRolesUseCase`, `ListRolesInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-repositories-role-repository-ts), [role-output.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-dtos-role-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts), [roles.module.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-roles-module-ts)

**Interfaces, tipos y enums:**

- `interface ListRolesInput` (L6): sin documentación — miembros: `activeOnly`

#### Clase `ListRolesUseCase` (L10–30)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ROLE_REPOSITORY) roleRepository: RoleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 16–29 | `input?: ListRolesInput` | `Promise<RoleOutput[]>` |

##### `ListRolesUseCase.execute`

- **Firma:** `execute(input?: ListRolesInput): Promise<RoleOutput[]>` — [list-roles.use-case.ts](../../../../comercial-jhoel-api/src/modules/roles/application/use-cases/list-roles.use-case.ts#L16) (L16–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.roleRepository.findAll`, `Promise.all`, `roles.map`, `this.roleRepository.countUsersByRoleId`, `toRoleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-roles-application-use-cases-normalize-role-name-ts"></a>

### normalize-role-name.ts

- **Ruta:** [normalize-role-name.ts](../../../../comercial-jhoel-api/src/modules/roles/application/use-cases/normalize-role-name.ts) (`comercial-jhoel-api/src/modules/roles/application/use-cases/normalize-role-name.ts`, 5 líneas)
- **Tipo:** Código TypeScript · **Capa:** Aplicación · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** `Cajero de turno` → `CAJERO_DE_TURNO` — matches the seeded roles' own naming style (SUPER_ADMIN, ADMIN, USER).
- **Consumidores:** [create-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-create-role-use-case-ts), [update-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts)
#### Función `normalizeRoleName` (L2–4)

- **Tipo:** función exportada
- **Firma:** `normalizeRoleName(name: string): string` — [normalize-role-name.ts](../../../../comercial-jhoel-api/src/modules/roles/application/use-cases/normalize-role-name.ts#L2)
- **Propósito / descripción:** `Cajero de turno` → `CAJERO_DE_TURNO` — matches the seeded roles' own naming style (SUPER_ADMIN, ADMIN, USER).
- **Dependencias:** `name.trim().toUpperCase().replace`, `name.trim().toUpperCase`, `name.trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-create-role-use-case-ts), [update-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts"></a>

### update-role.use-case.ts

- **Ruta:** [update-role.use-case.ts](../../../../comercial-jhoel-api/src/modules/roles/application/use-cases/update-role.use-case.ts) (`comercial-jhoel-api/src/modules/roles/application/use-cases/update-role.use-case.ts`, 79 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Caso de uso: declara `UpdateRoleUseCase`, `UpdateRoleInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-repositories-role-repository-ts), [role.entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-entities-role-entity-ts), [role-not-found.error.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-errors-role-not-found-error-ts), [role-name-already-exists.error.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-errors-role-name-already-exists-error-ts), [role-has-assigned-users.error.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-errors-role-has-assigned-users-error-ts), [system-role-immutable.error.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-errors-system-role-immutable-error-ts), [role-output.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-dtos-role-output-ts), [normalize-role-name.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-normalize-role-name-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts), [roles.module.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-roles-module-ts)

**Interfaces, tipos y enums:**

- `interface UpdateRoleInput` (L12): sin documentación — miembros: `name`, `description`, `isActive`

#### Clase `UpdateRoleUseCase` (L18–78)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ROLE_REPOSITORY) roleRepository: RoleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 24–77 | `id: string`, `input: UpdateRoleInput` | `Promise<RoleOutput>` |

##### `UpdateRoleUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateRoleInput): Promise<RoleOutput>` — [update-role.use-case.ts](../../../../comercial-jhoel-api/src/modules/roles/application/use-cases/update-role.use-case.ts#L24) (L24–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.roleRepository.findById`, `new RoleNotFoundError`, `(ROLE_NAMES as readonly string[]).includes`, `normalizeRoleName`, `new SystemRoleImmutableError`, `this.roleRepository.findByName`, `new RoleNameAlreadyExistsError`, `this.roleRepository.countUsersByRoleId`, `new RoleHasAssignedUsersError`, `this.roleRepository.update`, `input.description?.trim`, `toRoleOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.roleRepository.update`
- **Errores que lanza:** `new RoleNotFoundError(id)`, `new SystemRoleImmutableError()`, `new RoleNameAlreadyExistsError(name)`, `new RoleHasAssignedUsersError()`
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-roles-domain-entities-role-entity-ts"></a>

### role.entity.ts

- **Ruta:** [role.entity.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/entities/role.entity.ts) (`comercial-jhoel-api/src/modules/roles/domain/entities/role.entity.ts`, 61 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** The three roles seeded by migration (`1756500000000-CreateRolesAndUserRoles`) — every `@Roles('ADMIN', 'SUPER_ADMIN')` check across the entire app is a literal string comparison against these exact names (see `RolesGuard`), not a database lookup per request.
- **Descripción del autor (comentario del archivo):** The three roles seeded by migration (`1756500000000-CreateRolesAndUserRoles`) — every `@Roles('ADMIN', 'SUPER_ADMIN')` check across the entire app is a literal string comparison against these exact names (see `RolesGuard`), not a database lookup per request. Custom roles beyond these three can still be created (`CreateRoleUseCase` doesn't restrict `name` to this list), they just never satisfy an `@Roles(...)` guard that names one of these three specifically — see `UpdateRoleUseCase`'s immutability rule for why these three, once seeded, can never be renamed.
- **Consumidores:** [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [role-output.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-dtos-role-output-ts), [update-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts), [role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-repositories-role-repository-ts), [role.mapper.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-role-mapper-ts), [typeorm-role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-typeorm-role-repository-ts), [user.entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-entities-user-entity-ts), [user.mapper.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-mapper-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts)

**Interfaces, tipos y enums:**

- `interface RoleProps` (L21): sin documentación — miembros: `id`, `name`, `description`, `isActive`, `createdAt`, `updatedAt`
- `type RoleName` (L12) = `(typeof ROLE_NAMES)[number]`

**Constantes exportadas:**

- `ROLE_NAMES` (L11): The three roles seeded by migration (`1756500000000-CreateRolesAndUserRoles`) — every `@Roles('ADMIN', 'SUPER_ADMIN')` check across the entire app is a literal string comparison against these exact names (see `RolesGuard`), not a database lookup per request. = `['SUPER_ADMIN', 'ADMIN', 'USER'] as const`
- `SHIFT_SUPERVISOR_ROLE` (L19): Custom (admin-created, not seeded) role that Control de Efectivo authorizes to start/finish the cash cuts. = `'SUPERVISOR_DE_TURNO' as const`

#### Clase `Role` (L30–60)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: RoleProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 33–35 | `props: RoleProps` | `Role` |
| `id` | getter public | 37–39 | — | `string` |
| `name` | getter public | 41–43 | — | `RoleName` |
| `description` | getter public | 45–47 | — | `string \| null` |
| `isActive` | getter public | 49–51 | — | `boolean` |
| `createdAt` | getter public | 53–55 | — | `Date` |
| `updatedAt` | getter public | 57–59 | — | `Date` |

##### `Role.create`

- **Firma:** `create(props: RoleProps): Role` — [role.entity.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/entities/role.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Role`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [role.mapper.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-role-mapper-ts), [typeorm-role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-typeorm-role-repository-ts), [user.mapper.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-mapper-ts)

##### `Role.id`

- **Firma:** `id(): string` — [role.entity.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/entities/role.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Role.name`

- **Firma:** `name(): RoleName` — [role.entity.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/entities/role.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Role.description`

- **Firma:** `description(): string \| null` — [role.entity.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/entities/role.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Role.isActive`

- **Firma:** `isActive(): boolean` — [role.entity.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/entities/role.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Role.createdAt`

- **Firma:** `createdAt(): Date` — [role.entity.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/entities/role.entity.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Role.updatedAt`

- **Firma:** `updatedAt(): Date` — [role.entity.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/entities/role.entity.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-roles-domain-errors-invalid-role-error-ts"></a>

### invalid-role.error.ts

- **Ruta:** [invalid-role.error.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/errors/invalid-role.error.ts) (`comercial-jhoel-api/src/modules/roles/domain/errors/invalid-role.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Errores de dominio: declara `InvalidRoleError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-create-user-use-case-ts), [update-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts)

#### Clase `InvalidRoleError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-roles-domain-errors-role-has-assigned-users-error-ts"></a>

### role-has-assigned-users.error.ts

- **Ruta:** [role-has-assigned-users.error.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/errors/role-has-assigned-users.error.ts) (`comercial-jhoel-api/src/modules/roles/domain/errors/role-has-assigned-users.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Errores de dominio: declara `RoleHasAssignedUsersError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-deactivate-role-use-case-ts), [update-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts)

#### Clase `RoleHasAssignedUsersError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-roles-domain-errors-role-name-already-exists-error-ts"></a>

### role-name-already-exists.error.ts

- **Ruta:** [role-name-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/errors/role-name-already-exists.error.ts) (`comercial-jhoel-api/src/modules/roles/domain/errors/role-name-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Errores de dominio: declara `RoleNameAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-create-role-use-case-ts), [update-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts), [typeorm-role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-typeorm-role-repository-ts)

#### Clase `RoleNameAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `name: string`
<a id="f-comercial-jhoel-api-src-modules-roles-domain-errors-role-not-found-error-ts"></a>

### role-not-found.error.ts

- **Ruta:** [role-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/errors/role-not-found.error.ts) (`comercial-jhoel-api/src/modules/roles/domain/errors/role-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Errores de dominio: declara `RoleNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-deactivate-role-use-case-ts), [get-role-by-id.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-get-role-by-id-use-case-ts), [update-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts)

#### Clase `RoleNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-roles-domain-errors-system-role-immutable-error-ts"></a>

### system-role-immutable.error.ts

- **Ruta:** [system-role-immutable.error.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/errors/system-role-immutable.error.ts) (`comercial-jhoel-api/src/modules/roles/domain/errors/system-role-immutable.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Errores de dominio: declara `SystemRoleImmutableError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [update-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts)

#### Clase `SystemRoleImmutableError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-roles-domain-repositories-role-repository-ts"></a>

### role.repository.ts

- **Ruta:** [role.repository.ts](../../../../comercial-jhoel-api/src/modules/roles/domain/repositories/role.repository.ts) (`comercial-jhoel-api/src/modules/roles/domain/repositories/role.repository.ts`, 27 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateRoleData`, `UpdateRoleData`, `RoleRepository`, `ROLE_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [role.entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-entities-role-entity-ts)
- **Consumidores:** [create-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-create-role-use-case-ts), [deactivate-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-deactivate-role-use-case-ts), [get-role-by-id.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-get-role-by-id-use-case-ts), [list-roles.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-list-roles-use-case-ts), [update-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts), [typeorm-role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-typeorm-role-repository-ts), [roles.module.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-roles-module-ts), [create-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-create-user-use-case-ts), [register-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-register-user-use-case-ts), [update-user.use-case.ts](users.md#f-comercial-jhoel-api-src-modules-users-application-use-cases-update-user-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CreateRoleData` (L5): sin documentación — miembros: `name`, `description`
- `interface UpdateRoleData` (L10): sin documentación — miembros: `name`, `description`, `isActive`
- `interface RoleRepository` (L16): sin documentación — miembros: `findAll`, `findById`, `findByName`, `create`, `update`, `deactivate`, `countUsersByRoleId`

**Constantes exportadas:**

- `ROLE_REPOSITORY` (L3) = `Symbol('ROLE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-role-mapper-ts"></a>

### role.mapper.ts

- **Ruta:** [role.mapper.ts](../../../../comercial-jhoel-api/src/modules/roles/infrastructure/persistence/role.mapper.ts) (`comercial-jhoel-api/src/modules/roles/infrastructure/persistence/role.mapper.ts`, 16 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Mapper: declara `RoleMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [role.entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-entities-role-entity-ts), [role.orm-entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-role-orm-entity-ts)
- **Consumidores:** [typeorm-role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-typeorm-role-repository-ts)

#### Clase `RoleMapper` (L4–15)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–14 | `orm: RoleOrmEntity` | `Role` |

##### `RoleMapper.toDomain`

- **Firma:** `toDomain(orm: RoleOrmEntity): Role` — [role.mapper.ts](../../../../comercial-jhoel-api/src/modules/roles/infrastructure/persistence/role.mapper.ts#L5) (L5–14)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Role.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-typeorm-role-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-role-orm-entity-ts"></a>

### role.orm-entity.ts

- **Ruta:** [role.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/roles/infrastructure/persistence/role.orm-entity.ts) (`comercial-jhoel-api/src/modules/roles/infrastructure/persistence/role.orm-entity.ts`, 31 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `RoleOrmEntity` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** [admin-user.seed.ts](database.md#f-comercial-jhoel-api-src-database-seeds-admin-user-seed-ts), [role.mapper.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-role-mapper-ts), [typeorm-role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-typeorm-role-repository-ts), [roles.module.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-roles-module-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)

#### Clase `RoleOrmEntity` (L10–30)

- **Decoradores:** `@Entity('roles')` `@Unique('UQ_roles_name', ['name'])`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column description: string \| null`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-typeorm-role-repository-ts"></a>

### typeorm-role.repository.ts

- **Ruta:** [typeorm-role.repository.ts](../../../../comercial-jhoel-api/src/modules/roles/infrastructure/persistence/typeorm-role.repository.ts) (`comercial-jhoel-api/src/modules/roles/infrastructure/persistence/typeorm-role.repository.ts`, 97 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmRoleRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [role.entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-entities-role-entity-ts), [role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-repositories-role-repository-ts), [role-name-already-exists.error.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-errors-role-name-already-exists-error-ts), [role.orm-entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-role-orm-entity-ts), [role.mapper.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-role-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [roles.module.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-roles-module-ts)

#### Clase `TypeOrmRoleRepository` (L14–96)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements RoleRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(RoleOrmEntity) repository: Repository<RoleOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 21–27 | `options?: { activeOnly?: boolean }` | `Promise<Role[]>` |
| `findById` | método public async | 29–32 | `id: string` | `Promise<Role \| null>` |
| `findByName` | método public async | 34–37 | `name: string` | `Promise<Role \| null>` |
| `create` | método public async | 39–50 | `data: CreateRoleData` | `Promise<Role>` |
| `update` | método public async | 52–60 | `id: string`, `data: UpdateRoleData` | `Promise<Role>` |
| `deactivate` | método public async | 62–64 | `id: string` | `Promise<void>` |
| `countUsersByRoleId` | método public async | 72–83 | `roleId: string`, `activeOnly?` | `Promise<number>` |
| `translateUniqueViolation` | método private | 85–95 | `error: unknown`, `name: string` | `unknown` |

##### `TypeOrmRoleRepository.findAll`

- **Firma:** `findAll(options?: { activeOnly?: boolean }): Promise<Role[]>` — [typeorm-role.repository.ts](../../../../comercial-jhoel-api/src/modules/roles/infrastructure/persistence/typeorm-role.repository.ts#L21) (L21–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `RoleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRoleRepository.findById`

- **Firma:** `findById(id: string): Promise<Role \| null>` — [typeorm-role.repository.ts](../../../../comercial-jhoel-api/src/modules/roles/infrastructure/persistence/typeorm-role.repository.ts#L29) (L29–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `RoleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRoleRepository.findByName`

- **Firma:** `findByName(name: string): Promise<Role \| null>` — [typeorm-role.repository.ts](../../../../comercial-jhoel-api/src/modules/roles/infrastructure/persistence/typeorm-role.repository.ts#L34) (L34–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `RoleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRoleRepository.create`

- **Firma:** `create(data: CreateRoleData): Promise<Role>` — [typeorm-role.repository.ts](../../../../comercial-jhoel-api/src/modules/roles/infrastructure/persistence/typeorm-role.repository.ts#L39) (L39–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `RoleMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRoleRepository.update`

- **Firma:** `update(id: string, data: UpdateRoleData): Promise<Role>` — [typeorm-role.repository.ts](../../../../comercial-jhoel-api/src/modules/roles/infrastructure/persistence/typeorm-role.repository.ts#L52) (L52–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `RoleMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name ?? '')`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRoleRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-role.repository.ts](../../../../comercial-jhoel-api/src/modules/roles/infrastructure/persistence/typeorm-role.repository.ts#L62) (L62–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRoleRepository.countUsersByRoleId`

- **Firma:** `countUsersByRoleId(roleId: string, activeOnly?): Promise<number>` — [typeorm-role.repository.ts](../../../../comercial-jhoel-api/src/modules/roles/infrastructure/persistence/typeorm-role.repository.ts#L72) (L72–83)
- **Propósito / descripción:** Deliberately raw SQL against `users` instead of importing UsersModule's domain — RolesModule is a dependency of UsersModule, so importing back would create a circular module reference. `users`/`role_id` are stable, migration-owned column names, same trust boundary as a migration itself.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`
- **Efectos secundarios:** Tablas en su SQL: `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRoleRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, name: string): unknown` — [typeorm-role.repository.ts](../../../../comercial-jhoel-api/src/modules/roles/infrastructure/persistence/typeorm-role.repository.ts#L85) (L85–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new RoleNameAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts"></a>

### roles.controller.ts

- **Ruta:** [roles.controller.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts) (`comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts`, 78 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Every route here — including reads — is admin-only: unlike categories/products, the module ticket for Users & Roles requires SUPER_ADMIN/ADMIN on the whole surface, not just mutations.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [create-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-create-role-use-case-ts), [list-roles.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-list-roles-use-case-ts), [get-role-by-id.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-get-role-by-id-use-case-ts), [update-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts), [deactivate-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-deactivate-role-use-case-ts), [create-role.request.dto.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-dtos-create-role-request-dto-ts), [update-role.request.dto.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-dtos-update-role-request-dto-ts), [list-roles.query.dto.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-dtos-list-roles-query-dto-ts), [role.response.dto.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-dtos-role-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [roles.module.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-roles-module-ts)

#### Clase `RolesController` (L34–77)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('SUPER_ADMIN', 'ADMIN')` `@Controller('roles')`
- **Propósito:** Every route here — including reads — is admin-only: unlike categories/products, the module ticket for Users & Roles requires SUPER_ADMIN/ADMIN on the whole surface, not just mutations. Only the admin-only Users/Roles screens ever call this controller, so this doesn't block any other feature.
- **Dependencias inyectadas (constructor):** `createRoleUseCase: CreateRoleUseCase`, `listRolesUseCase: ListRolesUseCase`, `getRoleByIdUseCase: GetRoleByIdUseCase`, `updateRoleUseCase: UpdateRoleUseCase`, `deactivateRoleUseCase: DeactivateRoleUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 46–50 | `dto: CreateRoleRequestDto` | `Promise<RoleResponseDto>` |
| `findAll` | método public | 52–57 | `query: ListRolesQueryDto` | `Promise<RoleResponseDto[]>` |
| `findOne` | método public | 59–62 | `id: string` | `Promise<RoleResponseDto>` |
| `update` | método public | 64–70 | `id: string`, `dto: UpdateRoleRequestDto` | `Promise<RoleResponseDto>` |
| `deactivate` | método public | 72–76 | `id: string` | `Promise<void>` |

##### `RolesController.create`

- **Firma:** `create(dto: CreateRoleRequestDto): Promise<RoleResponseDto>` — [roles.controller.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts#L46) (L46–50)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.createRoleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RolesController.findAll`

- **Firma:** `findAll(query: ListRolesQueryDto): Promise<RoleResponseDto[]>` — [roles.controller.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts#L52) (L52–57)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listRolesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RolesController.findOne`

- **Firma:** `findOne(id: string): Promise<RoleResponseDto>` — [roles.controller.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts#L59) (L59–62)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getRoleByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RolesController.update`

- **Firma:** `update(id: string, dto: UpdateRoleRequestDto): Promise<RoleResponseDto>` — [roles.controller.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts#L64) (L64–70)
- **Decoradores:** `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.updateRoleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RolesController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [roles.controller.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts#L72) (L72–76)
- **Decoradores:** `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateRoleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-roles-presentation-dtos-create-role-request-dto-ts"></a>

### create-role.request.dto.ts

- **Ruta:** [create-role.request.dto.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/dtos/create-role.request.dto.ts) (`comercial-jhoel-api/src/modules/roles/presentation/dtos/create-role.request.dto.ts`, 21 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** DTO de entrada: declara `CreateRoleRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts)

#### Clase `CreateRoleRequestDto` (L9–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-roles-presentation-dtos-list-roles-query-dto-ts"></a>

### list-roles.query.dto.ts

- **Ruta:** [list-roles.query.dto.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/dtos/list-roles.query.dto.ts) (`comercial-jhoel-api/src/modules/roles/presentation/dtos/list-roles.query.dto.ts`, 10 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** DTO de consulta: declara `ListRolesQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts)

#### Clase `ListRolesQueryDto` (L4–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-roles-presentation-dtos-role-response-dto-ts"></a>

### role.response.dto.ts

- **Ruta:** [role.response.dto.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/dtos/role.response.dto.ts) (`comercial-jhoel-api/src/modules/roles/presentation/dtos/role.response.dto.ts`, 10 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** DTO de respuesta: declara `RoleResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts)

#### Clase `RoleResponseDto` (L1–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-roles-presentation-dtos-update-role-request-dto-ts"></a>

### update-role.request.dto.ts

- **Ruta:** [update-role.request.dto.ts](../../../../comercial-jhoel-api/src/modules/roles/presentation/dtos/update-role.request.dto.ts) (`comercial-jhoel-api/src/modules/roles/presentation/dtos/update-role.request.dto.ts`, 27 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** DTO de entrada: declara `UpdateRoleRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts)

#### Clase `UpdateRoleRequestDto` (L10–26)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-roles-roles-module-ts"></a>

### roles.module.ts

- **Ruta:** [roles.module.ts](../../../../comercial-jhoel-api/src/modules/roles/roles.module.ts) (`comercial-jhoel-api/src/modules/roles/roles.module.ts`, 27 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `roles`
- **Responsabilidad:** Módulo: declara `RolesModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [role.orm-entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-role-orm-entity-ts), [typeorm-role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-typeorm-role-repository-ts), [role.repository.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-domain-repositories-role-repository-ts), [create-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-create-role-use-case-ts), [list-roles.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-list-roles-use-case-ts), [get-role-by-id.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-get-role-by-id-use-case-ts), [update-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-update-role-use-case-ts), [deactivate-role.use-case.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-application-use-cases-deactivate-role-use-case-ts), [roles.controller.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-presentation-controllers-roles-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts)

#### Clase `RolesModule` (L13–26)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([RoleOrmEntity])], controllers: [RolesController], providers: [ { provide: ROLE_REPOSITORY, useClass: TypeOrmRoleRep`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
