# Módulo backend `account-types`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/account-types` | [account-types.controller.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/controllers/account-types.controller.ts#L41) `AccountTypesController.create` | [CreateAccountTypeUseCase](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-create-account-type-use-case-ts) | `AccountTypeRepository`.findByActiveName/create | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AccountTypeService.createAccountType` |
| `GET /api/account-types` | [account-types.controller.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/controllers/account-types.controller.ts#L52) `AccountTypesController.findAll` | [ListAccountTypesUseCase](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-list-account-types-use-case-ts) | `AccountTypeRepository`.findAll | UseGuards(JwtAuthGuard) | `AccountTypeService.getAccountTypes` |
| `GET /api/account-types/:id` | [account-types.controller.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/controllers/account-types.controller.ts#L59) `AccountTypesController.findOne` | [GetAccountTypeByIdUseCase](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-get-account-type-by-id-use-case-ts) | `AccountTypeRepository`.findById | UseGuards(JwtAuthGuard) | `AccountTypeService.getAccountTypeById` |
| `PATCH /api/account-types/:id` | [account-types.controller.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/controllers/account-types.controller.ts#L66) `AccountTypesController.update` | [UpdateAccountTypeUseCase](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-update-account-type-use-case-ts) | `AccountTypeRepository`.findById/findByActiveName/update | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AccountTypeService.updateAccountType` |
| `DELETE /api/account-types/:id` | [account-types.controller.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/controllers/account-types.controller.ts#L80) `AccountTypesController.deactivate` | [DeactivateAccountTypeUseCase](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-deactivate-account-type-use-case-ts) | `AccountTypeRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AccountTypeService.deleteAccountType` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [account-types.module.ts](#f-comercial-jhoel-api-src-modules-account-types-account-types-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `AccountTypesModule` (sin comentario de documentación en el código). | 9 internas; ext.: @nestjs/common, @nestjs/typeorm | 2 | Baja (2 consumidores) |
| [account-type-output.ts](#f-comercial-jhoel-api-src-modules-account-types-application-dtos-account-type-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toAccountTypeOutput`, `AccountTypeOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [create-account-type.use-case.ts](#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-create-account-type-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateAccountTypeUseCase`, `CreateAccountTypeInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-account-type.use-case.ts](#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-deactivate-account-type-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — DELETE /account-types/:id never removes the row. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-account-type-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-get-account-type-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetAccountTypeByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-account-types.use-case.ts](#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-list-account-types-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListAccountTypesUseCase`, `ListAccountTypesInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-account-type.use-case.ts](#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-update-account-type-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateAccountTypeUseCase`, `UpdateAccountTypeInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [account-type.entity.ts](#f-comercial-jhoel-api-src-modules-account-types-domain-entities-account-type-entity-ts) | .ts | Entidad de dominio | Dominio | Entidad de dominio: declara `AccountType`, `AccountTypeProps` (sin comentario de documentación en el código). | 0 internas | 4 | Media (4 consumidores) |
| [account-type-name-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-account-types-domain-errors-account-type-name-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `AccountTypeNameAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [account-type-not-found.error.ts](#f-comercial-jhoel-api-src-modules-account-types-domain-errors-account-type-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `AccountTypeNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [account-type.repository.ts](#f-comercial-jhoel-api-src-modules-account-types-domain-repositories-account-type-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateAccountTypeData`, `UpdateAccountTypeData`, `FindAccountTypesOptions`, `AccountTypeRepository`, `ACCOUNT_TYPE_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 9 | Media (9 consumidores) |
| [account-type.mapper.ts](#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-account-type-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `AccountTypeMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [account-type.orm-entity.ts](#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-account-type-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `AccountTypeOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [typeorm-account-type.repository.ts](#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-typeorm-account-type-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmAccountTypeRepository` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [account-types.controller.ts](#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts) | .ts | Controlador | Presentación | CRUD is admin-only (create/update/deactivate) — same policy as CategoriesController. | 13 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [account-type.response.dto.ts](#f-comercial-jhoel-api-src-modules-account-types-presentation-dtos-account-type-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `AccountTypeResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [create-account-type.request.dto.ts](#f-comercial-jhoel-api-src-modules-account-types-presentation-dtos-create-account-type-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateAccountTypeRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-account-types.query.dto.ts](#f-comercial-jhoel-api-src-modules-account-types-presentation-dtos-list-account-types-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListAccountTypesQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [update-account-type.request.dto.ts](#f-comercial-jhoel-api-src-modules-account-types-presentation-dtos-update-account-type-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateAccountTypeRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-account-types-account-types-module-ts"></a>

### account-types.module.ts

- **Ruta:** [account-types.module.ts](../../../../comercial-jhoel-api/src/modules/account-types/account-types.module.ts) (`comercial-jhoel-api/src/modules/account-types/account-types.module.ts`, 32 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** Módulo: declara `AccountTypesModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-type.orm-entity.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-account-type-orm-entity-ts), [typeorm-account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-typeorm-account-type-repository-ts), [account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-repositories-account-type-repository-ts), [create-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-create-account-type-use-case-ts), [list-account-types.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-list-account-types-use-case-ts), [get-account-type-by-id.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-get-account-type-by-id-use-case-ts), [update-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-update-account-type-use-case-ts), [deactivate-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-deactivate-account-type-use-case-ts), [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts)

#### Clase `AccountTypesModule` (L13–31)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([AccountTypeOrmEntity])], controllers: [AccountTypesController], providers: [ { provide: ACCOUNT_TYPE_REPOSITORY, us`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-account-types-application-dtos-account-type-output-ts"></a>

### account-type-output.ts

- **Ruta:** [account-type-output.ts](../../../../comercial-jhoel-api/src/modules/account-types/application/dtos/account-type-output.ts) (`comercial-jhoel-api/src/modules/account-types/application/dtos/account-type-output.ts`, 30 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** DTO de salida (aplicación): declara `toAccountTypeOutput`, `AccountTypeOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-type.entity.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-entities-account-type-entity-ts)
- **Consumidores:** [create-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-create-account-type-use-case-ts), [get-account-type-by-id.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-get-account-type-by-id-use-case-ts), [list-account-types.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-list-account-types-use-case-ts), [update-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-update-account-type-use-case-ts)

**Interfaces, tipos y enums:**

- `interface AccountTypeOutput` (L3): sin documentación — miembros: `id`, `name`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
#### Función `toAccountTypeOutput` (L15–29)

- **Tipo:** función exportada
- **Firma:** `toAccountTypeOutput(accountType: AccountType): AccountTypeOutput` — [account-type-output.ts](../../../../comercial-jhoel-api/src/modules/account-types/application/dtos/account-type-output.ts#L15)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-create-account-type-use-case-ts), [get-account-type-by-id.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-get-account-type-by-id-use-case-ts), [update-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-update-account-type-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-account-types-application-use-cases-create-account-type-use-case-ts"></a>

### create-account-type.use-case.ts

- **Ruta:** [create-account-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/account-types/application/use-cases/create-account-type.use-case.ts) (`comercial-jhoel-api/src/modules/account-types/application/use-cases/create-account-type.use-case.ts`, 37 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** Caso de uso: declara `CreateAccountTypeUseCase`, `CreateAccountTypeInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-repositories-account-type-repository-ts), [account-type-name-already-exists.error.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-errors-account-type-name-already-exists-error-ts), [account-type-output.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-dtos-account-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [account-types.module.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-account-types-module-ts), [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateAccountTypeInput` (L10): sin documentación — miembros: `name`, `createdBy`

#### Clase `CreateAccountTypeUseCase` (L15–36)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_TYPE_REPOSITORY) accountTypeRepository: AccountTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 22–35 | `input: CreateAccountTypeInput` | `Promise<AccountTypeOutput>` |

##### `CreateAccountTypeUseCase.execute`

- **Firma:** `execute(input: CreateAccountTypeInput): Promise<AccountTypeOutput>` — [create-account-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/account-types/application/use-cases/create-account-type.use-case.ts#L22) (L22–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.name.trim().replace`, `input.name.trim`, `this.accountTypeRepository.findByActiveName`, `new AccountTypeNameAlreadyExistsError`, `this.accountTypeRepository.create`, `toAccountTypeOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new AccountTypeNameAlreadyExistsError(name)`
- **Consumidores:** [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-account-types-application-use-cases-deactivate-account-type-use-case-ts"></a>

### deactivate-account-type.use-case.ts

- **Ruta:** [deactivate-account-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/account-types/application/use-cases/deactivate-account-type.use-case.ts) (`comercial-jhoel-api/src/modules/account-types/application/use-cases/deactivate-account-type.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** Soft delete only — DELETE /account-types/:id never removes the row.
- **Depende de (archivos del proyecto):** [account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-repositories-account-type-repository-ts), [account-type-not-found.error.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-errors-account-type-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [account-types.module.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-account-types-module-ts), [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

#### Clase `DeactivateAccountTypeUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — DELETE /account-types/:id never removes the row.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_TYPE_REPOSITORY) accountTypeRepository: AccountTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<void>` |

##### `DeactivateAccountTypeUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-account-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/account-types/application/use-cases/deactivate-account-type.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.accountTypeRepository.findById`, `new AccountTypeNotFoundError`, `this.accountTypeRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new AccountTypeNotFoundError(id)`
- **Consumidores:** [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-account-types-application-use-cases-get-account-type-by-id-use-case-ts"></a>

### get-account-type-by-id.use-case.ts

- **Ruta:** [get-account-type-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/account-types/application/use-cases/get-account-type-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/account-types/application/use-cases/get-account-type-by-id.use-case.ts`, 25 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** Caso de uso: declara `GetAccountTypeByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-repositories-account-type-repository-ts), [account-type-not-found.error.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-errors-account-type-not-found-error-ts), [account-type-output.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-dtos-account-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [account-types.module.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-account-types-module-ts), [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

#### Clase `GetAccountTypeByIdUseCase` (L10–24)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_TYPE_REPOSITORY) accountTypeRepository: AccountTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–23 | `id: string` | `Promise<AccountTypeOutput>` |

##### `GetAccountTypeByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<AccountTypeOutput>` — [get-account-type-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/account-types/application/use-cases/get-account-type-by-id.use-case.ts#L17) (L17–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.accountTypeRepository.findById`, `new AccountTypeNotFoundError`, `toAccountTypeOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new AccountTypeNotFoundError(id)`
- **Consumidores:** [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-account-types-application-use-cases-list-account-types-use-case-ts"></a>

### list-account-types.use-case.ts

- **Ruta:** [list-account-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/account-types/application/use-cases/list-account-types.use-case.ts) (`comercial-jhoel-api/src/modules/account-types/application/use-cases/list-account-types.use-case.ts`, 29 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** Caso de uso: declara `ListAccountTypesUseCase`, `ListAccountTypesInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-repositories-account-type-repository-ts), [account-type-output.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-dtos-account-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [account-types.module.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-account-types-module-ts), [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListAccountTypesInput` (L9): sin documentación — miembros: `includeInactive`

#### Clase `ListAccountTypesUseCase` (L13–28)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_TYPE_REPOSITORY) accountTypeRepository: AccountTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–27 | `input?: ListAccountTypesInput` | `Promise<AccountTypeOutput[]>` |

##### `ListAccountTypesUseCase.execute`

- **Firma:** `execute(input?: ListAccountTypesInput): Promise<AccountTypeOutput[]>` — [list-account-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/account-types/application/use-cases/list-account-types.use-case.ts#L20) (L20–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.accountTypeRepository.findAll`, `accountTypes.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-account-types-application-use-cases-update-account-type-use-case-ts"></a>

### update-account-type.use-case.ts

- **Ruta:** [update-account-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/account-types/application/use-cases/update-account-type.use-case.ts) (`comercial-jhoel-api/src/modules/account-types/application/use-cases/update-account-type.use-case.ts`, 48 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** Caso de uso: declara `UpdateAccountTypeUseCase`, `UpdateAccountTypeInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-repositories-account-type-repository-ts), [account-type-not-found.error.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-errors-account-type-not-found-error-ts), [account-type-name-already-exists.error.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-errors-account-type-name-already-exists-error-ts), [account-type-output.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-dtos-account-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [account-types.module.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-account-types-module-ts), [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateAccountTypeInput` (L11): sin documentación — miembros: `name`, `updatedBy`

#### Clase `UpdateAccountTypeUseCase` (L16–47)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_TYPE_REPOSITORY) accountTypeRepository: AccountTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 23–46 | `id: string`, `input: UpdateAccountTypeInput` | `Promise<AccountTypeOutput>` |

##### `UpdateAccountTypeUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateAccountTypeInput): Promise<AccountTypeOutput>` — [update-account-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/account-types/application/use-cases/update-account-type.use-case.ts#L23) (L23–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.accountTypeRepository.findById`, `new AccountTypeNotFoundError`, `input.name?.trim().replace`, `input.name?.trim`, `this.accountTypeRepository.findByActiveName`, `new AccountTypeNameAlreadyExistsError`, `this.accountTypeRepository.update`, `toAccountTypeOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.accountTypeRepository.update`
- **Errores que lanza:** `new AccountTypeNotFoundError(id)`, `new AccountTypeNameAlreadyExistsError(name)`
- **Consumidores:** [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-account-types-domain-entities-account-type-entity-ts"></a>

### account-type.entity.ts

- **Ruta:** [account-type.entity.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/entities/account-type.entity.ts) (`comercial-jhoel-api/src/modules/account-types/domain/entities/account-type.entity.ts`, 56 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** Entidad de dominio: declara `AccountType`, `AccountTypeProps` (sin comentario de documentación en el código).
- **Consumidores:** [account-type-output.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-dtos-account-type-output-ts), [account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-repositories-account-type-repository-ts), [account-type.mapper.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-account-type-mapper-ts), [typeorm-account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-typeorm-account-type-repository-ts)

**Interfaces, tipos y enums:**

- `interface AccountTypeProps` (L1): sin documentación — miembros: `id`, `name`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`

#### Clase `AccountType` (L13–55)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: AccountTypeProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 16–18 | `props: AccountTypeProps` | `AccountType` |
| `id` | getter public | 20–22 | — | `string` |
| `name` | getter public | 24–26 | — | `string` |
| `isActive` | getter public | 28–30 | — | `boolean` |
| `createdAt` | getter public | 32–34 | — | `Date` |
| `updatedAt` | getter public | 36–38 | — | `Date` |
| `createdBy` | getter public | 40–42 | — | `string` |
| `createdByUsername` | getter public | 44–46 | — | `string` |
| `updatedBy` | getter public | 48–50 | — | `string \| null` |
| `updatedByUsername` | getter public | 52–54 | — | `string \| null` |

##### `AccountType.create`

- **Firma:** `create(props: AccountTypeProps): AccountType` — [account-type.entity.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/entities/account-type.entity.ts#L16) (L16–18)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new AccountType`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [account-type.mapper.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-account-type-mapper-ts), [typeorm-account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-typeorm-account-type-repository-ts)

##### `AccountType.id`

- **Firma:** `id(): string` — [account-type.entity.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/entities/account-type.entity.ts#L20) (L20–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountType.name`

- **Firma:** `name(): string` — [account-type.entity.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/entities/account-type.entity.ts#L24) (L24–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountType.isActive`

- **Firma:** `isActive(): boolean` — [account-type.entity.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/entities/account-type.entity.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountType.createdAt`

- **Firma:** `createdAt(): Date` — [account-type.entity.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/entities/account-type.entity.ts#L32) (L32–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountType.updatedAt`

- **Firma:** `updatedAt(): Date` — [account-type.entity.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/entities/account-type.entity.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountType.createdBy`

- **Firma:** `createdBy(): string` — [account-type.entity.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/entities/account-type.entity.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountType.createdByUsername`

- **Firma:** `createdByUsername(): string` — [account-type.entity.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/entities/account-type.entity.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountType.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [account-type.entity.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/entities/account-type.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountType.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [account-type.entity.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/entities/account-type.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-account-types-domain-errors-account-type-name-already-exists-error-ts"></a>

### account-type-name-already-exists.error.ts

- **Ruta:** [account-type-name-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/errors/account-type-name-already-exists.error.ts) (`comercial-jhoel-api/src/modules/account-types/domain/errors/account-type-name-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** Errores de dominio: declara `AccountTypeNameAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-create-account-type-use-case-ts), [update-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-update-account-type-use-case-ts), [typeorm-account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-typeorm-account-type-repository-ts)

#### Clase `AccountTypeNameAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `name: string`
<a id="f-comercial-jhoel-api-src-modules-account-types-domain-errors-account-type-not-found-error-ts"></a>

### account-type-not-found.error.ts

- **Ruta:** [account-type-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/errors/account-type-not-found.error.ts) (`comercial-jhoel-api/src/modules/account-types/domain/errors/account-type-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** Errores de dominio: declara `AccountTypeNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-deactivate-account-type-use-case-ts), [get-account-type-by-id.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-get-account-type-by-id-use-case-ts), [update-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-update-account-type-use-case-ts)

#### Clase `AccountTypeNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-account-types-domain-repositories-account-type-repository-ts"></a>

### account-type.repository.ts

- **Ruta:** [account-type.repository.ts](../../../../comercial-jhoel-api/src/modules/account-types/domain/repositories/account-type.repository.ts) (`comercial-jhoel-api/src/modules/account-types/domain/repositories/account-type.repository.ts`, 27 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateAccountTypeData`, `UpdateAccountTypeData`, `FindAccountTypesOptions`, `AccountTypeRepository`, `ACCOUNT_TYPE_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-type.entity.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-entities-account-type-entity-ts)
- **Consumidores:** [account-types.module.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-account-types-module-ts), [create-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-create-account-type-use-case-ts), [deactivate-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-deactivate-account-type-use-case-ts), [get-account-type-by-id.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-get-account-type-by-id-use-case-ts), [list-account-types.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-list-account-types-use-case-ts), [update-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-update-account-type-use-case-ts), [typeorm-account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-typeorm-account-type-repository-ts), [create-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-create-bank-use-case-ts), [update-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-update-bank-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CreateAccountTypeData` (L5): sin documentación — miembros: `name`, `createdBy`
- `interface UpdateAccountTypeData` (L10): sin documentación — miembros: `name`, `updatedBy`
- `interface FindAccountTypesOptions` (L15): sin documentación — miembros: `activeOnly`
- `interface AccountTypeRepository` (L19): sin documentación — miembros: `findAll`, `findById`, `findByActiveName`, `create`, `update`, `deactivate`

**Constantes exportadas:**

- `ACCOUNT_TYPE_REPOSITORY` (L3) = `Symbol('ACCOUNT_TYPE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-account-type-mapper-ts"></a>

### account-type.mapper.ts

- **Ruta:** [account-type.mapper.ts](../../../../comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/account-type.mapper.ts) (`comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/account-type.mapper.ts`, 19 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** Mapper: declara `AccountTypeMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-type.entity.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-entities-account-type-entity-ts), [account-type.orm-entity.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-account-type-orm-entity-ts)
- **Consumidores:** [typeorm-account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-typeorm-account-type-repository-ts)

#### Clase `AccountTypeMapper` (L4–18)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–17 | `orm: AccountTypeOrmEntity` | `AccountType` |

##### `AccountTypeMapper.toDomain`

- **Firma:** `toDomain(orm: AccountTypeOrmEntity): AccountType` — [account-type.mapper.ts](../../../../comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/account-type.mapper.ts#L5) (L5–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `AccountType.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-typeorm-account-type-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-account-type-orm-entity-ts"></a>

### account-type.orm-entity.ts

- **Ruta:** [account-type.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/account-type.orm-entity.ts) (`comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/account-type.orm-entity.ts`, 50 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `AccountTypeOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [account-types.module.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-account-types-module-ts), [account-type.mapper.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-account-type-mapper-ts), [typeorm-account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-typeorm-account-type-repository-ts), [bank.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-orm-entity-ts)

#### Clase `AccountTypeOrmEntity` (L15–49)

- **Decoradores:** `@Entity('account_types')` `@Index('UQ_account_types_name_active', ['name'], { unique: true, where: '"is_active" = true', })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-typeorm-account-type-repository-ts"></a>

### typeorm-account-type.repository.ts

- **Ruta:** [typeorm-account-type.repository.ts](../../../../comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/typeorm-account-type.repository.ts) (`comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/typeorm-account-type.repository.ts`, 86 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmAccountTypeRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-type.entity.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-entities-account-type-entity-ts), [account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-repositories-account-type-repository-ts), [account-type-name-already-exists.error.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-errors-account-type-name-already-exists-error-ts), [account-type.orm-entity.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-account-type-orm-entity-ts), [account-type.mapper.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-account-type-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [account-types.module.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-account-types-module-ts)

#### Clase `TypeOrmAccountTypeRepository` (L15–85)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements AccountTypeRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(AccountTypeOrmEntity) repository: Repository<AccountTypeOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 22–28 | `options: FindAccountTypesOptions` | `Promise<AccountType[]>` |
| `findById` | método public async | 30–33 | `id: string` | `Promise<AccountType \| null>` |
| `findByActiveName` | método public async | 35–40 | `name: string` | `Promise<AccountType \| null>` |
| `create` | método public async | 42–56 | `data: CreateAccountTypeData` | `Promise<AccountType>` |
| `update` | método public async | 58–67 | `id: string`, `data: UpdateAccountTypeData` | `Promise<AccountType>` |
| `deactivate` | método public async | 69–71 | `id: string` | `Promise<void>` |
| `translateUniqueViolation` | método private | 74–84 | `error: unknown`, `name: string` | `unknown` |

##### `TypeOrmAccountTypeRepository.findAll`

- **Firma:** `findAll(options: FindAccountTypesOptions): Promise<AccountType[]>` — [typeorm-account-type.repository.ts](../../../../comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/typeorm-account-type.repository.ts#L22) (L22–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `AccountTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountTypeRepository.findById`

- **Firma:** `findById(id: string): Promise<AccountType \| null>` — [typeorm-account-type.repository.ts](../../../../comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/typeorm-account-type.repository.ts#L30) (L30–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `AccountTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountTypeRepository.findByActiveName`

- **Firma:** `findByActiveName(name: string): Promise<AccountType \| null>` — [typeorm-account-type.repository.ts](../../../../comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/typeorm-account-type.repository.ts#L35) (L35–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `AccountTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountTypeRepository.create`

- **Firma:** `create(data: CreateAccountTypeData): Promise<AccountType>` — [typeorm-account-type.repository.ts](../../../../comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/typeorm-account-type.repository.ts#L42) (L42–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `AccountTypeMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountTypeRepository.update`

- **Firma:** `update(id: string, data: UpdateAccountTypeData): Promise<AccountType>` — [typeorm-account-type.repository.ts](../../../../comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/typeorm-account-type.repository.ts#L58) (L58–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `AccountTypeMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name ?? '')`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountTypeRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-account-type.repository.ts](../../../../comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/typeorm-account-type.repository.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountTypeRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, name: string): unknown` — [typeorm-account-type.repository.ts](../../../../comercial-jhoel-api/src/modules/account-types/infrastructure/persistence/typeorm-account-type.repository.ts#L74) (L74–84)
- **Propósito / descripción:** Safety net for the create/update race the use case's own pre-check can't close — see `TypeOrmCategoryRepository.translateUniqueViolation`'s own doc comment.
- **Dependencias (llamadas en su cuerpo):** `new AccountTypeNameAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts"></a>

### account-types.controller.ts

- **Ruta:** [account-types.controller.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/controllers/account-types.controller.ts) (`comercial-jhoel-api/src/modules/account-types/presentation/controllers/account-types.controller.ts`, 88 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** CRUD is admin-only (create/update/deactivate) — same policy as CategoriesController.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-create-account-type-use-case-ts), [list-account-types.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-list-account-types-use-case-ts), [get-account-type-by-id.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-get-account-type-by-id-use-case-ts), [update-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-update-account-type-use-case-ts), [deactivate-account-type.use-case.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-application-use-cases-deactivate-account-type-use-case-ts), [create-account-type.request.dto.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-dtos-create-account-type-request-dto-ts), [update-account-type.request.dto.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-dtos-update-account-type-request-dto-ts), [list-account-types.query.dto.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-dtos-list-account-types-query-dto-ts), [account-type.response.dto.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-dtos-account-type-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [account-types.module.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-account-types-module-ts)

#### Clase `AccountTypesController` (L30–87)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('account-types')`
- **Propósito:** CRUD is admin-only (create/update/deactivate) — same policy as CategoriesController. A USER can still read the list (needed for the Bancos form's dropdown).
- **Dependencias inyectadas (constructor):** `createAccountTypeUseCase: CreateAccountTypeUseCase`, `listAccountTypesUseCase: ListAccountTypesUseCase`, `getAccountTypeByIdUseCase: GetAccountTypeByIdUseCase`, `updateAccountTypeUseCase: UpdateAccountTypeUseCase`, `deactivateAccountTypeUseCase: DeactivateAccountTypeUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 41–50 | `dto: CreateAccountTypeRequestDto`, `userId: string` | `Promise<AccountTypeResponseDto>` |
| `findAll` | método public | 52–57 | `query: ListAccountTypesQueryDto` | `Promise<AccountTypeResponseDto[]>` |
| `findOne` | método public | 59–64 | `id: string` | `Promise<AccountTypeResponseDto>` |
| `update` | método public | 66–78 | `id: string`, `dto: UpdateAccountTypeRequestDto`, `userId: string` | `Promise<AccountTypeResponseDto>` |
| `deactivate` | método public | 80–86 | `id: string` | `Promise<void>` |

##### `AccountTypesController.create`

- **Firma:** `create(dto: CreateAccountTypeRequestDto, userId: string): Promise<AccountTypeResponseDto>` — [account-types.controller.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/controllers/account-types.controller.ts#L41) (L41–50)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createAccountTypeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountTypesController.findAll`

- **Firma:** `findAll(query: ListAccountTypesQueryDto): Promise<AccountTypeResponseDto[]>` — [account-types.controller.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/controllers/account-types.controller.ts#L52) (L52–57)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listAccountTypesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountTypesController.findOne`

- **Firma:** `findOne(id: string): Promise<AccountTypeResponseDto>` — [account-types.controller.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/controllers/account-types.controller.ts#L59) (L59–64)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getAccountTypeByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountTypesController.update`

- **Firma:** `update(id: string, dto: UpdateAccountTypeRequestDto, userId: string): Promise<AccountTypeResponseDto>` — [account-types.controller.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/controllers/account-types.controller.ts#L66) (L66–78)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateAccountTypeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountTypesController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [account-types.controller.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/controllers/account-types.controller.ts#L80) (L80–86)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateAccountTypeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-account-types-presentation-dtos-account-type-response-dto-ts"></a>

### account-type.response.dto.ts

- **Ruta:** [account-type.response.dto.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/dtos/account-type.response.dto.ts) (`comercial-jhoel-api/src/modules/account-types/presentation/dtos/account-type.response.dto.ts`, 12 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** DTO de respuesta: declara `AccountTypeResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

#### Clase `AccountTypeResponseDto` (L1–11)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-account-types-presentation-dtos-create-account-type-request-dto-ts"></a>

### create-account-type.request.dto.ts

- **Ruta:** [create-account-type.request.dto.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/dtos/create-account-type.request.dto.ts) (`comercial-jhoel-api/src/modules/account-types/presentation/dtos/create-account-type.request.dto.ts`, 10 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** DTO de entrada: declara `CreateAccountTypeRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

#### Clase `CreateAccountTypeRequestDto` (L3–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-account-types-presentation-dtos-list-account-types-query-dto-ts"></a>

### list-account-types.query.dto.ts

- **Ruta:** [list-account-types.query.dto.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/dtos/list-account-types.query.dto.ts) (`comercial-jhoel-api/src/modules/account-types/presentation/dtos/list-account-types.query.dto.ts`, 10 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** DTO de consulta: declara `ListAccountTypesQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

#### Clase `ListAccountTypesQueryDto` (L4–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-account-types-presentation-dtos-update-account-type-request-dto-ts"></a>

### update-account-type.request.dto.ts

- **Ruta:** [update-account-type.request.dto.ts](../../../../comercial-jhoel-api/src/modules/account-types/presentation/dtos/update-account-type.request.dto.ts) (`comercial-jhoel-api/src/modules/account-types/presentation/dtos/update-account-type.request.dto.ts`, 17 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `account-types`
- **Responsabilidad:** DTO de entrada: declara `UpdateAccountTypeRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [account-types.controller.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-presentation-controllers-account-types-controller-ts)

#### Clase `UpdateAccountTypeRequestDto` (L9–16)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
