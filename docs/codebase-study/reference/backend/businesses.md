# Módulo backend `businesses`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/businesses` | [businesses.controller.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/controllers/businesses.controller.ts#L40) `BusinessesController.create` | [CreateBusinessUseCase](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-create-business-use-case-ts) | `BusinessRepository`.findByName/create | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `BusinessService.createBusiness` |
| `GET /api/businesses` | [businesses.controller.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/controllers/businesses.controller.ts#L48) `BusinessesController.findAll` | [ListBusinessesUseCase](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-list-businesses-use-case-ts) | `BusinessRepository`.findAll | UseGuards(JwtAuthGuard) | `BusinessService.getBusinesses` |
| `GET /api/businesses/:id` | [businesses.controller.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/controllers/businesses.controller.ts#L57) `BusinessesController.findOne` | [GetBusinessByIdUseCase](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-get-business-by-id-use-case-ts) | `BusinessRepository`.findById | UseGuards(JwtAuthGuard) | `BusinessService.getBusinessById` |
| `PATCH /api/businesses/:id` | [businesses.controller.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/controllers/businesses.controller.ts#L64) `BusinessesController.update` | [UpdateBusinessUseCase](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-update-business-use-case-ts) | `BusinessRepository`.findById/findByName/update | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `BusinessService.updateBusiness` |
| `DELETE /api/businesses/:id` | [businesses.controller.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/controllers/businesses.controller.ts#L74) `BusinessesController.deactivate` | [DeactivateBusinessUseCase](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-deactivate-business-use-case-ts) | `BusinessRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `BusinessService.deleteBusiness` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [business-output.ts](#f-comercial-jhoel-api-src-modules-businesses-application-dtos-business-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Plain, serializable shape use cases return — never the domain entity itself. | 1 internas | 4 | Media (4 consumidores) |
| [create-business.use-case.ts](#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-create-business-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateBusinessUseCase`, `CreateBusinessInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-business.use-case.ts](#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-deactivate-business-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — a business is never physically removed. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-business-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-get-business-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetBusinessByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-businesses.use-case.ts](#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-list-businesses-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListBusinessesUseCase`, `ListBusinessesInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-business.use-case.ts](#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-update-business-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateBusinessUseCase`, `UpdateBusinessInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [businesses.module.ts](#f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `BusinessesModule` (sin comentario de documentación en el código). | 9 internas; ext.: @nestjs/common, @nestjs/typeorm | 3 | Media (3 consumidores) |
| [business.entity.ts](#f-comercial-jhoel-api-src-modules-businesses-domain-entities-business-entity-ts) | .ts | Entidad de dominio | Dominio | Entidad de dominio: declara `Business`, `BusinessProps` (sin comentario de documentación en el código). | 0 internas | 4 | Media (4 consumidores) |
| [business-name-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-businesses-domain-errors-business-name-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `BusinessNameAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [business-not-found.error.ts](#f-comercial-jhoel-api-src-modules-businesses-domain-errors-business-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `BusinessNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [business.repository.ts](#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateBusinessData`, `UpdateBusinessData`, `BusinessRepository`, `BUSINESS_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 13 | Alta (13 consumidores) |
| [business.mapper.ts](#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `BusinessMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [business.orm-entity.ts](#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `BusinessOrmEntity` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 6 | Media (6 consumidores) |
| [typeorm-business.repository.ts](#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-typeorm-business-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmBusinessRepository` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [businesses.controller.ts](#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts) | .ts | Controlador | Presentación | A structural clone of `CategoriesController` (see that class's own doc comment for the full CRUD/guard-shape rationale) — `name` globally unique, soft delete, `GET` open to any authenticated role, mutations admin-only. | 12 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [business.response.dto.ts](#f-comercial-jhoel-api-src-modules-businesses-presentation-dtos-business-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `BusinessResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [create-business.request.dto.ts](#f-comercial-jhoel-api-src-modules-businesses-presentation-dtos-create-business-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateBusinessRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-businesses.query.dto.ts](#f-comercial-jhoel-api-src-modules-businesses-presentation-dtos-list-businesses-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListBusinessesQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [update-business.request.dto.ts](#f-comercial-jhoel-api-src-modules-businesses-presentation-dtos-update-business-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateBusinessRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-businesses-application-dtos-business-output-ts"></a>

### business-output.ts

- **Ruta:** [business-output.ts](../../../../comercial-jhoel-api/src/modules/businesses/application/dtos/business-output.ts) (`comercial-jhoel-api/src/modules/businesses/application/dtos/business-output.ts`, 23 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Plain, serializable shape use cases return — never the domain entity itself.
- **Depende de (archivos del proyecto):** [business.entity.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-entities-business-entity-ts)
- **Consumidores:** [create-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-create-business-use-case-ts), [get-business-by-id.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-get-business-by-id-use-case-ts), [list-businesses.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-list-businesses-use-case-ts), [update-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-update-business-use-case-ts)

**Interfaces, tipos y enums:**

- `interface BusinessOutput` (L4): Plain, serializable shape use cases return — never the domain entity itself. — miembros: `id`, `name`, `description`, `isActive`, `createdAt`, `updatedAt`
#### Función `toBusinessOutput` (L13–22)

- **Tipo:** función exportada
- **Firma:** `toBusinessOutput(business: Business): BusinessOutput` — [business-output.ts](../../../../comercial-jhoel-api/src/modules/businesses/application/dtos/business-output.ts#L13)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-create-business-use-case-ts), [get-business-by-id.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-get-business-by-id-use-case-ts), [update-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-update-business-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-businesses-application-use-cases-create-business-use-case-ts"></a>

### create-business.use-case.ts

- **Ruta:** [create-business.use-case.ts](../../../../comercial-jhoel-api/src/modules/businesses/application/use-cases/create-business.use-case.ts) (`comercial-jhoel-api/src/modules/businesses/application/use-cases/create-business.use-case.ts`, 34 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Caso de uso: declara `CreateBusinessUseCase`, `CreateBusinessInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [business-name-already-exists.error.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-errors-business-name-already-exists-error-ts), [business-output.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-dtos-business-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [businesses.module.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts), [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateBusinessInput` (L7): sin documentación — miembros: `name`, `description`

#### Clase `CreateBusinessUseCase` (L12–33)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(BUSINESS_REPOSITORY) businessRepository: BusinessRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–32 | `input: CreateBusinessInput` | `Promise<BusinessOutput>` |

##### `CreateBusinessUseCase.execute`

- **Firma:** `execute(input: CreateBusinessInput): Promise<BusinessOutput>` — [create-business.use-case.ts](../../../../comercial-jhoel-api/src/modules/businesses/application/use-cases/create-business.use-case.ts#L19) (L19–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.name.trim().replace`, `input.name.trim`, `this.businessRepository.findByName`, `new BusinessNameAlreadyExistsError`, `this.businessRepository.create`, `input.description?.trim`, `toBusinessOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BusinessNameAlreadyExistsError(name)`
- **Consumidores:** [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-businesses-application-use-cases-deactivate-business-use-case-ts"></a>

### deactivate-business.use-case.ts

- **Ruta:** [deactivate-business.use-case.ts](../../../../comercial-jhoel-api/src/modules/businesses/application/use-cases/deactivate-business.use-case.ts) (`comercial-jhoel-api/src/modules/businesses/application/use-cases/deactivate-business.use-case.ts`, 27 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Soft delete only — a business is never physically removed.
- **Depende de (archivos del proyecto):** [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [business-not-found.error.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-errors-business-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [businesses.module.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts), [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

#### Clase `DeactivateBusinessUseCase` (L12–26)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — a business is never physically removed. Deactivating it doesn't touch products that reference it (referential integrity is never at risk); it just drops out of `findAll({ activeOnly: true })` and blocks new product assignments, the same pattern categories use.
- **Dependencias inyectadas (constructor):** `@Inject(BUSINESS_REPOSITORY) businessRepository: BusinessRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–25 | `id: string` | `Promise<void>` |

##### `DeactivateBusinessUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-business.use-case.ts](../../../../comercial-jhoel-api/src/modules/businesses/application/use-cases/deactivate-business.use-case.ts#L19) (L19–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.businessRepository.findById`, `new BusinessNotFoundError`, `this.businessRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BusinessNotFoundError(id)`
- **Consumidores:** [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-businesses-application-use-cases-get-business-by-id-use-case-ts"></a>

### get-business-by-id.use-case.ts

- **Ruta:** [get-business-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/businesses/application/use-cases/get-business-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/businesses/application/use-cases/get-business-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Caso de uso: declara `GetBusinessByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [business-not-found.error.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-errors-business-not-found-error-ts), [business-output.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-dtos-business-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [businesses.module.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts), [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

#### Clase `GetBusinessByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(BUSINESS_REPOSITORY) businessRepository: BusinessRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<BusinessOutput>` |

##### `GetBusinessByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<BusinessOutput>` — [get-business-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/businesses/application/use-cases/get-business-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.businessRepository.findById`, `new BusinessNotFoundError`, `toBusinessOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BusinessNotFoundError(id)`
- **Consumidores:** [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-businesses-application-use-cases-list-businesses-use-case-ts"></a>

### list-businesses.use-case.ts

- **Ruta:** [list-businesses.use-case.ts](../../../../comercial-jhoel-api/src/modules/businesses/application/use-cases/list-businesses.use-case.ts) (`comercial-jhoel-api/src/modules/businesses/application/use-cases/list-businesses.use-case.ts`, 24 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Caso de uso: declara `ListBusinessesUseCase`, `ListBusinessesInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [business-output.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-dtos-business-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [businesses.module.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts), [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListBusinessesInput` (L6): sin documentación — miembros: `activeOnly`

#### Clase `ListBusinessesUseCase` (L10–23)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(BUSINESS_REPOSITORY) businessRepository: BusinessRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–22 | `input?: ListBusinessesInput` | `Promise<BusinessOutput[]>` |

##### `ListBusinessesUseCase.execute`

- **Firma:** `execute(input?: ListBusinessesInput): Promise<BusinessOutput[]>` — [list-businesses.use-case.ts](../../../../comercial-jhoel-api/src/modules/businesses/application/use-cases/list-businesses.use-case.ts#L17) (L17–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.businessRepository.findAll`, `businesses.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-businesses-application-use-cases-update-business-use-case-ts"></a>

### update-business.use-case.ts

- **Ruta:** [update-business.use-case.ts](../../../../comercial-jhoel-api/src/modules/businesses/application/use-cases/update-business.use-case.ts) (`comercial-jhoel-api/src/modules/businesses/application/use-cases/update-business.use-case.ts`, 46 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Caso de uso: declara `UpdateBusinessUseCase`, `UpdateBusinessInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [business-not-found.error.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-errors-business-not-found-error-ts), [business-name-already-exists.error.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-errors-business-name-already-exists-error-ts), [business-output.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-dtos-business-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [businesses.module.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts), [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateBusinessInput` (L8): sin documentación — miembros: `name`, `description`

#### Clase `UpdateBusinessUseCase` (L13–45)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(BUSINESS_REPOSITORY) businessRepository: BusinessRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–44 | `id: string`, `input: UpdateBusinessInput` | `Promise<BusinessOutput>` |

##### `UpdateBusinessUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateBusinessInput): Promise<BusinessOutput>` — [update-business.use-case.ts](../../../../comercial-jhoel-api/src/modules/businesses/application/use-cases/update-business.use-case.ts#L20) (L20–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.businessRepository.findById`, `new BusinessNotFoundError`, `input.name?.trim().replace`, `input.name?.trim`, `this.businessRepository.findByName`, `new BusinessNameAlreadyExistsError`, `this.businessRepository.update`, `input.description?.trim`, `toBusinessOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.businessRepository.update`
- **Errores que lanza:** `new BusinessNotFoundError(id)`, `new BusinessNameAlreadyExistsError(name)`
- **Consumidores:** [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts"></a>

### businesses.module.ts

- **Ruta:** [businesses.module.ts](../../../../comercial-jhoel-api/src/modules/businesses/businesses.module.ts) (`comercial-jhoel-api/src/modules/businesses/businesses.module.ts`, 27 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Módulo: declara `BusinessesModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [business.orm-entity.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-orm-entity-ts), [typeorm-business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-typeorm-business-repository-ts), [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [create-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-create-business-use-case-ts), [list-businesses.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-list-businesses-use-case-ts), [get-business-by-id.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-get-business-by-id-use-case-ts), [update-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-update-business-use-case-ts), [deactivate-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-deactivate-business-use-case-ts), [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `BusinessesModule` (L13–26)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([BusinessOrmEntity])], controllers: [BusinessesController], providers: [ { provide: BUSINESS_REPOSITORY, useClass: T`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-businesses-domain-entities-business-entity-ts"></a>

### business.entity.ts

- **Ruta:** [business.entity.ts](../../../../comercial-jhoel-api/src/modules/businesses/domain/entities/business.entity.ts) (`comercial-jhoel-api/src/modules/businesses/domain/entities/business.entity.ts`, 41 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Entidad de dominio: declara `Business`, `BusinessProps` (sin comentario de documentación en el código).
- **Consumidores:** [business-output.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-dtos-business-output-ts), [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [business.mapper.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-mapper-ts), [typeorm-business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-typeorm-business-repository-ts)

**Interfaces, tipos y enums:**

- `interface BusinessProps` (L1): sin documentación — miembros: `id`, `name`, `description`, `isActive`, `createdAt`, `updatedAt`

#### Clase `Business` (L10–40)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: BusinessProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 13–15 | `props: BusinessProps` | `Business` |
| `id` | getter public | 17–19 | — | `string` |
| `name` | getter public | 21–23 | — | `string` |
| `description` | getter public | 25–27 | — | `string \| null` |
| `isActive` | getter public | 29–31 | — | `boolean` |
| `createdAt` | getter public | 33–35 | — | `Date` |
| `updatedAt` | getter public | 37–39 | — | `Date` |

##### `Business.create`

- **Firma:** `create(props: BusinessProps): Business` — [business.entity.ts](../../../../comercial-jhoel-api/src/modules/businesses/domain/entities/business.entity.ts#L13) (L13–15)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Business`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [business.mapper.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-mapper-ts), [typeorm-business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-typeorm-business-repository-ts)

##### `Business.id`

- **Firma:** `id(): string` — [business.entity.ts](../../../../comercial-jhoel-api/src/modules/businesses/domain/entities/business.entity.ts#L17) (L17–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Business.name`

- **Firma:** `name(): string` — [business.entity.ts](../../../../comercial-jhoel-api/src/modules/businesses/domain/entities/business.entity.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Business.description`

- **Firma:** `description(): string \| null` — [business.entity.ts](../../../../comercial-jhoel-api/src/modules/businesses/domain/entities/business.entity.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Business.isActive`

- **Firma:** `isActive(): boolean` — [business.entity.ts](../../../../comercial-jhoel-api/src/modules/businesses/domain/entities/business.entity.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Business.createdAt`

- **Firma:** `createdAt(): Date` — [business.entity.ts](../../../../comercial-jhoel-api/src/modules/businesses/domain/entities/business.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Business.updatedAt`

- **Firma:** `updatedAt(): Date` — [business.entity.ts](../../../../comercial-jhoel-api/src/modules/businesses/domain/entities/business.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-businesses-domain-errors-business-name-already-exists-error-ts"></a>

### business-name-already-exists.error.ts

- **Ruta:** [business-name-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/businesses/domain/errors/business-name-already-exists.error.ts) (`comercial-jhoel-api/src/modules/businesses/domain/errors/business-name-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Errores de dominio: declara `BusinessNameAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-create-business-use-case-ts), [update-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-update-business-use-case-ts), [typeorm-business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-typeorm-business-repository-ts)

#### Clase `BusinessNameAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `name: string`
<a id="f-comercial-jhoel-api-src-modules-businesses-domain-errors-business-not-found-error-ts"></a>

### business-not-found.error.ts

- **Ruta:** [business-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/businesses/domain/errors/business-not-found.error.ts) (`comercial-jhoel-api/src/modules/businesses/domain/errors/business-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Errores de dominio: declara `BusinessNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-deactivate-business-use-case-ts), [get-business-by-id.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-get-business-by-id-use-case-ts), [update-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-update-business-use-case-ts)

#### Clase `BusinessNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts"></a>

### business.repository.ts

- **Ruta:** [business.repository.ts](../../../../comercial-jhoel-api/src/modules/businesses/domain/repositories/business.repository.ts) (`comercial-jhoel-api/src/modules/businesses/domain/repositories/business.repository.ts`, 25 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateBusinessData`, `UpdateBusinessData`, `BusinessRepository`, `BUSINESS_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [business.entity.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-entities-business-entity-ts)
- **Consumidores:** [create-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-create-business-use-case-ts), [deactivate-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-deactivate-business-use-case-ts), [get-business-by-id.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-get-business-by-id-use-case-ts), [list-businesses.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-list-businesses-use-case-ts), [update-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-update-business-use-case-ts), [businesses.module.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts), [typeorm-business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-typeorm-business-repository-ts), [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [export-products-pdf.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-pdf-use-case-ts), [import-products-from-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CreateBusinessData` (L5): sin documentación — miembros: `name`, `description`
- `interface UpdateBusinessData` (L10): sin documentación — miembros: `name`, `description`
- `interface BusinessRepository` (L15): sin documentación — miembros: `findAll`, `findById`, `findByName`, `findByActiveName`, `create`, `update`, `deactivate`

**Constantes exportadas:**

- `BUSINESS_REPOSITORY` (L3) = `Symbol('BUSINESS_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-mapper-ts"></a>

### business.mapper.ts

- **Ruta:** [business.mapper.ts](../../../../comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/business.mapper.ts) (`comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/business.mapper.ts`, 16 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Mapper: declara `BusinessMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [business.entity.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-entities-business-entity-ts), [business.orm-entity.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-orm-entity-ts)
- **Consumidores:** [typeorm-business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-typeorm-business-repository-ts)

#### Clase `BusinessMapper` (L4–15)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–14 | `orm: BusinessOrmEntity` | `Business` |

##### `BusinessMapper.toDomain`

- **Firma:** `toDomain(orm: BusinessOrmEntity): Business` — [business.mapper.ts](../../../../comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/business.mapper.ts#L5) (L5–14)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Business.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-typeorm-business-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-orm-entity-ts"></a>

### business.orm-entity.ts

- **Ruta:** [business.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/business.orm-entity.ts) (`comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/business.orm-entity.ts`, 31 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `BusinessOrmEntity` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** [businesses.module.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts), [business.mapper.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-mapper-ts), [typeorm-business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-typeorm-business-repository-ts), [product.orm-entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-orm-entity-ts), [sale-detail.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-detail-orm-entity-ts), [sales-cash-box-movement.orm-entity.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-sales-cash-box-movement-orm-entity-ts)

#### Clase `BusinessOrmEntity` (L10–30)

- **Decoradores:** `@Entity('businesses')` `@Unique('UQ_businesses_name', ['name'])`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column description: string \| null`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-typeorm-business-repository-ts"></a>

### typeorm-business.repository.ts

- **Ruta:** [typeorm-business.repository.ts](../../../../comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/typeorm-business.repository.ts) (`comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/typeorm-business.repository.ts`, 88 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmBusinessRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [business.entity.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-entities-business-entity-ts), [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [business-name-already-exists.error.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-errors-business-name-already-exists-error-ts), [business.orm-entity.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-orm-entity-ts), [business.mapper.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [businesses.module.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts)

#### Clase `TypeOrmBusinessRepository` (L14–87)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements BusinessRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(BusinessOrmEntity) repository: Repository<BusinessOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 21–27 | `options?: { activeOnly?: boolean }` | `Promise<Business[]>` |
| `findById` | método public async | 29–32 | `id: string` | `Promise<Business \| null>` |
| `findByName` | método public async | 34–37 | `name: string` | `Promise<Business \| null>` |
| `findByActiveName` | método public async | 39–46 | `name: string` | `Promise<Business \| null>` |
| `create` | método public async | 48–59 | `data: CreateBusinessData` | `Promise<Business>` |
| `update` | método public async | 61–69 | `id: string`, `data: UpdateBusinessData` | `Promise<Business>` |
| `deactivate` | método public async | 71–73 | `id: string` | `Promise<void>` |
| `translateUniqueViolation` | método private | 76–86 | `error: unknown`, `name: string` | `unknown` |

##### `TypeOrmBusinessRepository.findAll`

- **Firma:** `findAll(options?: { activeOnly?: boolean }): Promise<Business[]>` — [typeorm-business.repository.ts](../../../../comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/typeorm-business.repository.ts#L21) (L21–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `BusinessMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBusinessRepository.findById`

- **Firma:** `findById(id: string): Promise<Business \| null>` — [typeorm-business.repository.ts](../../../../comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/typeorm-business.repository.ts#L29) (L29–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `BusinessMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBusinessRepository.findByName`

- **Firma:** `findByName(name: string): Promise<Business \| null>` — [typeorm-business.repository.ts](../../../../comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/typeorm-business.repository.ts#L34) (L34–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `BusinessMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBusinessRepository.findByActiveName`

- **Firma:** `findByActiveName(name: string): Promise<Business \| null>` — [typeorm-business.repository.ts](../../../../comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/typeorm-business.repository.ts#L39) (L39–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('business').where`, `this.repository.createQueryBuilder`, `BusinessMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBusinessRepository.create`

- **Firma:** `create(data: CreateBusinessData): Promise<Business>` — [typeorm-business.repository.ts](../../../../comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/typeorm-business.repository.ts#L48) (L48–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `BusinessMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBusinessRepository.update`

- **Firma:** `update(id: string, data: UpdateBusinessData): Promise<Business>` — [typeorm-business.repository.ts](../../../../comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/typeorm-business.repository.ts#L61) (L61–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `BusinessMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name ?? '')`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBusinessRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-business.repository.ts](../../../../comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/typeorm-business.repository.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBusinessRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, name: string): unknown` — [typeorm-business.repository.ts](../../../../comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/typeorm-business.repository.ts#L76) (L76–86)
- **Propósito / descripción:** Safety net for the create/update race the use case's own pre-check can't close — see `TypeOrmCategoryRepository.translateUniqueViolation`'s own doc comment.
- **Dependencias (llamadas en su cuerpo):** `new BusinessNameAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts"></a>

### businesses.controller.ts

- **Ruta:** [businesses.controller.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/controllers/businesses.controller.ts) (`comercial-jhoel-api/src/modules/businesses/presentation/controllers/businesses.controller.ts`, 82 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** A structural clone of `CategoriesController` (see that class's own doc comment for the full CRUD/guard-shape rationale) — `name` globally unique, soft delete, `GET` open to any authenticated role, mutations admin-only.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [create-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-create-business-use-case-ts), [list-businesses.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-list-businesses-use-case-ts), [get-business-by-id.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-get-business-by-id-use-case-ts), [update-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-update-business-use-case-ts), [deactivate-business.use-case.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-application-use-cases-deactivate-business-use-case-ts), [create-business.request.dto.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-dtos-create-business-request-dto-ts), [update-business.request.dto.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-dtos-update-business-request-dto-ts), [list-businesses.query.dto.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-dtos-list-businesses-query-dto-ts), [business.response.dto.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-dtos-business-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [businesses.module.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts)

#### Clase `BusinessesController` (L29–81)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('businesses')`
- **Propósito:** A structural clone of `CategoriesController` (see that class's own doc comment for the full CRUD/guard-shape rationale) — `name` globally unique, soft delete, `GET` open to any authenticated role, mutations admin-only.
- **Dependencias inyectadas (constructor):** `createBusinessUseCase: CreateBusinessUseCase`, `listBusinessesUseCase: ListBusinessesUseCase`, `getBusinessByIdUseCase: GetBusinessByIdUseCase`, `updateBusinessUseCase: UpdateBusinessUseCase`, `deactivateBusinessUseCase: DeactivateBusinessUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 40–46 | `dto: CreateBusinessRequestDto` | `Promise<BusinessResponseDto>` |
| `findAll` | método public | 48–55 | `query: ListBusinessesQueryDto` | `Promise<BusinessResponseDto[]>` |
| `findOne` | método public | 57–62 | `id: string` | `Promise<BusinessResponseDto>` |
| `update` | método public | 64–72 | `id: string`, `dto: UpdateBusinessRequestDto` | `Promise<BusinessResponseDto>` |
| `deactivate` | método public | 74–80 | `id: string` | `Promise<void>` |

##### `BusinessesController.create`

- **Firma:** `create(dto: CreateBusinessRequestDto): Promise<BusinessResponseDto>` — [businesses.controller.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/controllers/businesses.controller.ts#L40) (L40–46)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.createBusinessUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BusinessesController.findAll`

- **Firma:** `findAll(query: ListBusinessesQueryDto): Promise<BusinessResponseDto[]>` — [businesses.controller.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/controllers/businesses.controller.ts#L48) (L48–55)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listBusinessesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BusinessesController.findOne`

- **Firma:** `findOne(id: string): Promise<BusinessResponseDto>` — [businesses.controller.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/controllers/businesses.controller.ts#L57) (L57–62)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getBusinessByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BusinessesController.update`

- **Firma:** `update(id: string, dto: UpdateBusinessRequestDto): Promise<BusinessResponseDto>` — [businesses.controller.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/controllers/businesses.controller.ts#L64) (L64–72)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.updateBusinessUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BusinessesController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [businesses.controller.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/controllers/businesses.controller.ts#L74) (L74–80)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateBusinessUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-businesses-presentation-dtos-business-response-dto-ts"></a>

### business.response.dto.ts

- **Ruta:** [business.response.dto.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/dtos/business.response.dto.ts) (`comercial-jhoel-api/src/modules/businesses/presentation/dtos/business.response.dto.ts`, 9 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** DTO de respuesta: declara `BusinessResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

#### Clase `BusinessResponseDto` (L1–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-businesses-presentation-dtos-create-business-request-dto-ts"></a>

### create-business.request.dto.ts

- **Ruta:** [create-business.request.dto.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/dtos/create-business.request.dto.ts) (`comercial-jhoel-api/src/modules/businesses/presentation/dtos/create-business.request.dto.ts`, 21 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** DTO de entrada: declara `CreateBusinessRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

#### Clase `CreateBusinessRequestDto` (L9–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-businesses-presentation-dtos-list-businesses-query-dto-ts"></a>

### list-businesses.query.dto.ts

- **Ruta:** [list-businesses.query.dto.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/dtos/list-businesses.query.dto.ts) (`comercial-jhoel-api/src/modules/businesses/presentation/dtos/list-businesses.query.dto.ts`, 10 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** DTO de consulta: declara `ListBusinessesQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

#### Clase `ListBusinessesQueryDto` (L4–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-businesses-presentation-dtos-update-business-request-dto-ts"></a>

### update-business.request.dto.ts

- **Ruta:** [update-business.request.dto.ts](../../../../comercial-jhoel-api/src/modules/businesses/presentation/dtos/update-business.request.dto.ts) (`comercial-jhoel-api/src/modules/businesses/presentation/dtos/update-business.request.dto.ts`, 22 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `businesses`
- **Responsabilidad:** DTO de entrada: declara `UpdateBusinessRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [businesses.controller.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-presentation-controllers-businesses-controller-ts)

#### Clase `UpdateBusinessRequestDto` (L9–21)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
