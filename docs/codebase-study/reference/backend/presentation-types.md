# Módulo backend `presentation-types`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/presentation-types` | [presentation-types.controller.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts#L44) `PresentationTypesController.create` | [CreatePresentationTypeUseCase](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-create-presentation-type-use-case-ts) | `PresentationTypeRepository`.findByName/findByActiveCode/create | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `PresentationTypeService.createPresentationType` |
| `GET /api/presentation-types` | [presentation-types.controller.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts#L58) `PresentationTypesController.findAll` | [ListPresentationTypesUseCase](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-list-presentation-types-use-case-ts) | `PresentationTypeRepository`.findAll | UseGuards(JwtAuthGuard) | `PresentationTypeService.getPresentationTypes` |
| `GET /api/presentation-types/:id` | [presentation-types.controller.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts#L65) `PresentationTypesController.findOne` | [GetPresentationTypeByIdUseCase](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-get-presentation-type-by-id-use-case-ts) | `PresentationTypeRepository`.findById | UseGuards(JwtAuthGuard) | `PresentationTypeService.getPresentationTypeById` |
| `PATCH /api/presentation-types/:id` | [presentation-types.controller.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts#L72) `PresentationTypesController.update` | [UpdatePresentationTypeUseCase](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-update-presentation-type-use-case-ts) | `PresentationTypeRepository`.findById/findByName/findByActiveCode/update | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `PresentationTypeService.updatePresentationType` |
| `DELETE /api/presentation-types/:id` | [presentation-types.controller.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts#L86) `PresentationTypesController.deactivate` | [DeactivatePresentationTypeUseCase](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-deactivate-presentation-type-use-case-ts) | `PresentationTypeRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `PresentationTypeService.deletePresentationType` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [presentation-type-output.ts](#f-comercial-jhoel-api-src-modules-presentation-types-application-dtos-presentation-type-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toPresentationTypeOutput`, `toPresentationTypeListOutput`, `PresentationTypeOutput`, `PresentationTypeListOutput` (sin comentario de documentación en el código). | 2 internas | 4 | Media (4 consumidores) |
| [create-presentation-type.use-case.ts](#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-create-presentation-type-use-case-ts) | .ts | Caso de uso | Aplicación | The frontend is expected to check `GET /presentation-types?search=&includeInactive=true` before calling this, and offer "Activar" instead of "Crear" when an inactive match already exists (see the plan's own reasoning for why this lives in the frontend rather than a special error shape). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-presentation-type.use-case.ts](#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-deactivate-presentation-type-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — never a physical `DELETE`. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-presentation-type-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-get-presentation-type-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetPresentationTypeByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-presentation-types.use-case.ts](#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-list-presentation-types-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListPresentationTypesUseCase`, `ListPresentationTypesInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-presentation-type.use-case.ts](#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-update-presentation-type-use-case-ts) | .ts | Caso de uso | Aplicación | `isActive` toggling both ways lives here (unlike `account_types`/`categories`, which only ever deactivate via `DELETE`) — this catalog explicitly needs reactivation (ver el plan). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [presentation-type.entity.ts](#f-comercial-jhoel-api-src-modules-presentation-types-domain-entities-presentation-type-entity-ts) | .ts | Entidad de dominio | Dominio | Catálogo maestro de tipos de presentación (Unidad, Caja, Paquete, ...) — el nombre/código se administra aquí, una sola vez, y `product_presentations` (módulo `inventory`) referencia una fila de este catálogo por FK en vez de escribir el nombre como texto libre. | 0 internas | 6 | Media (6 consumidores) |
| [presentation-type-code-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-code-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PresentationTypeCodeAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [presentation-type-name-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-name-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PresentationTypeNameAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [presentation-type-not-found.error.ts](#f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PresentationTypeNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [presentation-type.repository.ts](#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `FindPresentationTypesOptions`, `CreatePresentationTypeData`, `UpdatePresentationTypeData`, `PresentationTypeListItem`, `PresentationTypeRepository` (sin comentario de documentación en el código). | 1 internas | 14 | Alta (14 consumidores) |
| [presentation-type.mapper.ts](#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-presentation-type-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `PresentationTypeMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [presentation-type.orm-entity.ts](#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-presentation-type-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Unique only among *active* rows, and case-insensitive — same `LOWER(name) WHERE is_active` raw-SQL index `clients` uses (see that migration's own doc comment), deliberately stronger than the plain case-sensitive partial index `account_types`/`transaction_types` use, per the explicit "Caja"/"caja"/" CAJA " requirement for this catalog. | 1 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [typeorm-presentation-type.repository.ts](#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-typeorm-presentation-type-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmPresentationTypeRepository` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [presentation-types.module.ts](#f-comercial-jhoel-api-src-modules-presentation-types-presentation-types-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `PresentationTypesModule` (sin comentario de documentación en el código). | 9 internas; ext.: @nestjs/common, @nestjs/typeorm | 3 | Media (3 consumidores) |
| [presentation-types.controller.ts](#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts) | .ts | Controlador | Presentación | CRUD is admin-only (create/update/deactivate) — same policy as Categorías/Negocios/Tipos de Cuenta. | 13 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [create-presentation-type.request.dto.ts](#f-comercial-jhoel-api-src-modules-presentation-types-presentation-dtos-create-presentation-type-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreatePresentationTypeRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-presentation-types.query.dto.ts](#f-comercial-jhoel-api-src-modules-presentation-types-presentation-dtos-list-presentation-types-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListPresentationTypesQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [presentation-type.response.dto.ts](#f-comercial-jhoel-api-src-modules-presentation-types-presentation-dtos-presentation-type-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `PresentationTypeResponseDto`, `PresentationTypeListResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [update-presentation-type.request.dto.ts](#f-comercial-jhoel-api-src-modules-presentation-types-presentation-dtos-update-presentation-type-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdatePresentationTypeRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-presentation-types-application-dtos-presentation-type-output-ts"></a>

### presentation-type-output.ts

- **Ruta:** [presentation-type-output.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/application/dtos/presentation-type-output.ts) (`comercial-jhoel-api/src/modules/presentation-types/application/dtos/presentation-type-output.ts`, 45 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** DTO de salida (aplicación): declara `toPresentationTypeOutput`, `toPresentationTypeListOutput`, `PresentationTypeOutput`, `PresentationTypeListOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [presentation-type.entity.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-entities-presentation-type-entity-ts), [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts)
- **Consumidores:** [create-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-create-presentation-type-use-case-ts), [get-presentation-type-by-id.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-get-presentation-type-by-id-use-case-ts), [list-presentation-types.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-list-presentation-types-use-case-ts), [update-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-update-presentation-type-use-case-ts)

**Interfaces, tipos y enums:**

- `interface PresentationTypeOutput` (L4): sin documentación — miembros: `id`, `name`, `code`, `description`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface PresentationTypeListOutput` (L18) extends PresentationTypeOutput: sin documentación — miembros: `usageCount`
#### Función `toPresentationTypeOutput` (L22–38)

- **Tipo:** función exportada
- **Firma:** `toPresentationTypeOutput(presentationType: PresentationType): PresentationTypeOutput` — [presentation-type-output.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/application/dtos/presentation-type-output.ts#L22)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-create-presentation-type-use-case-ts), [get-presentation-type-by-id.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-get-presentation-type-by-id-use-case-ts), [update-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-update-presentation-type-use-case-ts)

#### Función `toPresentationTypeListOutput` (L40–44)

- **Tipo:** función exportada
- **Firma:** `toPresentationTypeListOutput(item: PresentationTypeListItem): PresentationTypeListOutput` — [presentation-type-output.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/application/dtos/presentation-type-output.ts#L40)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-create-presentation-type-use-case-ts"></a>

### create-presentation-type.use-case.ts

- **Ruta:** [create-presentation-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/application/use-cases/create-presentation-type.use-case.ts) (`comercial-jhoel-api/src/modules/presentation-types/application/use-cases/create-presentation-type.use-case.ts`, 70 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** The frontend is expected to check `GET /presentation-types?search=&includeInactive=true` before calling this, and offer "Activar" instead of "Crear" when an inactive match already exists (see the plan's own reasoning for why this lives in the frontend rather than a special error shape).
- **Depende de (archivos del proyecto):** [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [presentation-type-name-already-exists.error.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-name-already-exists-error-ts), [presentation-type-code-already-exists.error.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-code-already-exists-error-ts), [presentation-type-output.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-dtos-presentation-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts), [presentation-types.module.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-types-module-ts)

**Interfaces, tipos y enums:**

- `interface CreatePresentationTypeInput` (L11): sin documentación — miembros: `name`, `code`, `description`, `createdBy`

#### Clase `CreatePresentationTypeUseCase` (L27–69)

- **Decoradores:** `@Injectable()`
- **Propósito:** The frontend is expected to check `GET /presentation-types?search=&includeInactive=true` before calling this, and offer "Activar" instead of "Crear" when an inactive match already exists (see the plan's own reasoning for why this lives in the frontend rather than a special error shape). This use case still rejects an inactive duplicate rather than silently reactivating it — a direct API call that skips that UX gets a clear, safe error instead of an unexpected side effect.
- **Dependencias inyectadas (constructor):** `@Inject(PRESENTATION_TYPE_REPOSITORY) presentationTypeRepository: PresentationTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 34–68 | `input: CreatePresentationTypeInput` | `Promise<PresentationTypeOutput>` |

##### `CreatePresentationTypeUseCase.execute`

- **Firma:** `execute(input: CreatePresentationTypeInput): Promise<PresentationTypeOutput>` — [create-presentation-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/application/use-cases/create-presentation-type.use-case.ts#L34) (L34–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.name.trim().replace`, `input.name.trim`, `input.code?.trim().replace`, `input.code?.trim`, `input.description?.trim().replace`, `input.description?.trim`, `this.presentationTypeRepository.findByName`, `new PresentationTypeNameAlreadyExistsError`, `this.presentationTypeRepository.findByActiveCode`, `new PresentationTypeCodeAlreadyExistsError`, `this.presentationTypeRepository.create`, `toPresentationTypeOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new PresentationTypeNameAlreadyExistsError( name, !existingByName.isActive, )`, `new PresentationTypeCodeAlreadyExistsError(code)`
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-deactivate-presentation-type-use-case-ts"></a>

### deactivate-presentation-type.use-case.ts

- **Ruta:** [deactivate-presentation-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/application/use-cases/deactivate-presentation-type.use-case.ts) (`comercial-jhoel-api/src/modules/presentation-types/application/use-cases/deactivate-presentation-type.use-case.ts`, 30 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** Soft delete only — never a physical `DELETE`.
- **Depende de (archivos del proyecto):** [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [presentation-type-not-found.error.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts), [presentation-types.module.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-types-module-ts)

#### Clase `DeactivatePresentationTypeUseCase` (L13–29)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — never a physical `DELETE`. Deliberately does NOT block on `usageCount &gt; 0`: a presentation already used by historical products can still be deactivated so it stops appearing for *new* products, per the plan's own reasoning (que siga funcionando para los productos que ya la usan, sin bloquear la desactivación).
- **Dependencias inyectadas (constructor):** `@Inject(PRESENTATION_TYPE_REPOSITORY) presentationTypeRepository: PresentationTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–28 | `id: string` | `Promise<void>` |

##### `DeactivatePresentationTypeUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-presentation-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/application/use-cases/deactivate-presentation-type.use-case.ts#L20) (L20–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.presentationTypeRepository.findById`, `new PresentationTypeNotFoundError`, `this.presentationTypeRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new PresentationTypeNotFoundError(id)`
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-get-presentation-type-by-id-use-case-ts"></a>

### get-presentation-type-by-id.use-case.ts

- **Ruta:** [get-presentation-type-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/application/use-cases/get-presentation-type-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/presentation-types/application/use-cases/get-presentation-type-by-id.use-case.ts`, 27 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** Caso de uso: declara `GetPresentationTypeByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [presentation-type-not-found.error.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-not-found-error-ts), [presentation-type-output.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-dtos-presentation-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts), [presentation-types.module.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-types-module-ts)

#### Clase `GetPresentationTypeByIdUseCase` (L10–26)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PRESENTATION_TYPE_REPOSITORY) presentationTypeRepository: PresentationTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–25 | `id: string` | `Promise<PresentationTypeOutput>` |

##### `GetPresentationTypeByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<PresentationTypeOutput>` — [get-presentation-type-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/application/use-cases/get-presentation-type-by-id.use-case.ts#L17) (L17–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.presentationTypeRepository.findById`, `new PresentationTypeNotFoundError`, `toPresentationTypeOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new PresentationTypeNotFoundError(id)`
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-list-presentation-types-use-case-ts"></a>

### list-presentation-types.use-case.ts

- **Ruta:** [list-presentation-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/application/use-cases/list-presentation-types.use-case.ts) (`comercial-jhoel-api/src/modules/presentation-types/application/use-cases/list-presentation-types.use-case.ts`, 31 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** Caso de uso: declara `ListPresentationTypesUseCase`, `ListPresentationTypesInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [presentation-type-output.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-dtos-presentation-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts), [presentation-types.module.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-types-module-ts)

**Interfaces, tipos y enums:**

- `interface ListPresentationTypesInput` (L9): sin documentación — miembros: `includeInactive`, `search`

#### Clase `ListPresentationTypesUseCase` (L14–30)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PRESENTATION_TYPE_REPOSITORY) presentationTypeRepository: PresentationTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 21–29 | `input?: ListPresentationTypesInput` | `Promise<PresentationTypeListOutput[]>` |

##### `ListPresentationTypesUseCase.execute`

- **Firma:** `execute(input?: ListPresentationTypesInput): Promise<PresentationTypeListOutput[]>` — [list-presentation-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/application/use-cases/list-presentation-types.use-case.ts#L21) (L21–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.presentationTypeRepository.findAll`, `input.search?.trim`, `items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-update-presentation-type-use-case-ts"></a>

### update-presentation-type.use-case.ts

- **Ruta:** [update-presentation-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/application/use-cases/update-presentation-type.use-case.ts) (`comercial-jhoel-api/src/modules/presentation-types/application/use-cases/update-presentation-type.use-case.ts`, 81 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** `isActive` toggling both ways lives here (unlike `account_types`/`categories`, which only ever deactivate via `DELETE`) — this catalog explicitly needs reactivation (ver el plan).
- **Depende de (archivos del proyecto):** [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [presentation-type-not-found.error.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-not-found-error-ts), [presentation-type-name-already-exists.error.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-name-already-exists-error-ts), [presentation-type-code-already-exists.error.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-code-already-exists-error-ts), [presentation-type-output.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-dtos-presentation-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts), [presentation-types.module.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-types-module-ts)

**Interfaces, tipos y enums:**

- `interface UpdatePresentationTypeInput` (L12): sin documentación — miembros: `name`, `code`, `description`, `isActive`, `updatedBy`

#### Clase `UpdatePresentationTypeUseCase` (L21–80)

- **Decoradores:** `@Injectable()`
- **Propósito:** `isActive` toggling both ways lives here (unlike `account_types`/`categories`, which only ever deactivate via `DELETE`) — this catalog explicitly needs reactivation (ver el plan).
- **Dependencias inyectadas (constructor):** `@Inject(PRESENTATION_TYPE_REPOSITORY) presentationTypeRepository: PresentationTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 28–79 | `id: string`, `input: UpdatePresentationTypeInput` | `Promise<PresentationTypeOutput>` |

##### `UpdatePresentationTypeUseCase.execute`

- **Firma:** `execute(id: string, input: UpdatePresentationTypeInput): Promise<PresentationTypeOutput>` — [update-presentation-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/application/use-cases/update-presentation-type.use-case.ts#L28) (L28–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.presentationTypeRepository.findById`, `new PresentationTypeNotFoundError`, `input.name?.trim().replace`, `input.name?.trim`, `name.toLowerCase`, `presentationType.name.toLowerCase`, `this.presentationTypeRepository.findByName`, `new PresentationTypeNameAlreadyExistsError`, `input.code?.trim().replace`, `input.code?.trim`, `code.toLowerCase`, `presentationType.code?.toLowerCase`, `this.presentationTypeRepository.findByActiveCode`, `new PresentationTypeCodeAlreadyExistsError`, `input.description?.trim().replace`, `input.description?.trim`, `this.presentationTypeRepository.update`, `toPresentationTypeOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.presentationTypeRepository.update`
- **Errores que lanza:** `new PresentationTypeNotFoundError(id)`, `new PresentationTypeNameAlreadyExistsError( name, !existing.isActive, )`, `new PresentationTypeCodeAlreadyExistsError(code)`
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-presentation-types-domain-entities-presentation-type-entity-ts"></a>

### presentation-type.entity.ts

- **Ruta:** [presentation-type.entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts) (`comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts`, 74 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** Catálogo maestro de tipos de presentación (Unidad, Caja, Paquete, ...) — el nombre/código se administra aquí, una sola vez, y `product_presentations` (módulo `inventory`) referencia una fila de este catálogo por FK en vez de escribir el nombre como texto libre.
- **Consumidores:** [create-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts), [update-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-spec-ts), [presentation-type-output.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-dtos-presentation-type-output-ts), [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [presentation-type.mapper.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-presentation-type-mapper-ts), [typeorm-presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-typeorm-presentation-type-repository-ts)

**Interfaces, tipos y enums:**

- `interface PresentationTypeProps` (L1): sin documentación — miembros: `id`, `name`, `code`, `description`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`

#### Clase `PresentationType` (L23–73)

- **Propósito:** Catálogo maestro de tipos de presentación (Unidad, Caja, Paquete, ...) — el nombre/código se administra aquí, una sola vez, y `product_presentations` (módulo `inventory`) referencia una fila de este catálogo por FK en vez de escribir el nombre como texto libre. El factor de conversión y los precios de una presentación siguen viviendo en `product_presentations`, por producto — este catálogo nunca los toca.
- **Dependencias inyectadas (constructor):** `props: PresentationTypeProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 26–28 | `props: PresentationTypeProps` | `PresentationType` |
| `id` | getter public | 30–32 | — | `string` |
| `name` | getter public | 34–36 | — | `string` |
| `code` | getter public | 38–40 | — | `string \| null` |
| `description` | getter public | 42–44 | — | `string \| null` |
| `isActive` | getter public | 46–48 | — | `boolean` |
| `createdAt` | getter public | 50–52 | — | `Date` |
| `updatedAt` | getter public | 54–56 | — | `Date` |
| `createdBy` | getter public | 58–60 | — | `string` |
| `createdByUsername` | getter public | 62–64 | — | `string` |
| `updatedBy` | getter public | 66–68 | — | `string \| null` |
| `updatedByUsername` | getter public | 70–72 | — | `string \| null` |

##### `PresentationType.create`

- **Firma:** `create(props: PresentationTypeProps): PresentationType` — [presentation-type.entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts#L26) (L26–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new PresentationType`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts), [update-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-spec-ts), [presentation-type.mapper.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-presentation-type-mapper-ts), [typeorm-presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-typeorm-presentation-type-repository-ts)

##### `PresentationType.id`

- **Firma:** `id(): string` — [presentation-type.entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts#L30) (L30–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationType.name`

- **Firma:** `name(): string` — [presentation-type.entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationType.code`

- **Firma:** `code(): string \| null` — [presentation-type.entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationType.description`

- **Firma:** `description(): string \| null` — [presentation-type.entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationType.isActive`

- **Firma:** `isActive(): boolean` — [presentation-type.entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationType.createdAt`

- **Firma:** `createdAt(): Date` — [presentation-type.entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationType.updatedAt`

- **Firma:** `updatedAt(): Date` — [presentation-type.entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationType.createdBy`

- **Firma:** `createdBy(): string` — [presentation-type.entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationType.createdByUsername`

- **Firma:** `createdByUsername(): string` — [presentation-type.entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts#L62) (L62–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationType.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [presentation-type.entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts#L66) (L66–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationType.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [presentation-type.entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/entities/presentation-type.entity.ts#L70) (L70–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-code-already-exists-error-ts"></a>

### presentation-type-code-already-exists.error.ts

- **Ruta:** [presentation-type-code-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/errors/presentation-type-code-already-exists.error.ts) (`comercial-jhoel-api/src/modules/presentation-types/domain/errors/presentation-type-code-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** Errores de dominio: declara `PresentationTypeCodeAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-create-presentation-type-use-case-ts), [update-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-update-presentation-type-use-case-ts), [typeorm-presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-typeorm-presentation-type-repository-ts)

#### Clase `PresentationTypeCodeAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `code: string`
<a id="f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-name-already-exists-error-ts"></a>

### presentation-type-name-already-exists.error.ts

- **Ruta:** [presentation-type-name-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/errors/presentation-type-name-already-exists.error.ts) (`comercial-jhoel-api/src/modules/presentation-types/domain/errors/presentation-type-name-already-exists.error.ts`, 14 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** Errores de dominio: declara `PresentationTypeNameAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-create-presentation-type-use-case-ts), [update-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-update-presentation-type-use-case-ts), [typeorm-presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-typeorm-presentation-type-repository-ts)

#### Clase `PresentationTypeNameAlreadyExistsError` (L3–13)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `name: string`, `isInactive: `
<a id="f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-not-found-error-ts"></a>

### presentation-type-not-found.error.ts

- **Ruta:** [presentation-type-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/errors/presentation-type-not-found.error.ts) (`comercial-jhoel-api/src/modules/presentation-types/domain/errors/presentation-type-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** Errores de dominio: declara `PresentationTypeNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-deactivate-presentation-type-use-case-ts), [get-presentation-type-by-id.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-get-presentation-type-by-id-use-case-ts), [update-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-update-presentation-type-use-case-ts)

#### Clase `PresentationTypeNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts"></a>

### presentation-type.repository.ts

- **Ruta:** [presentation-type.repository.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/repositories/presentation-type.repository.ts) (`comercial-jhoel-api/src/modules/presentation-types/domain/repositories/presentation-type.repository.ts`, 54 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `FindPresentationTypesOptions`, `CreatePresentationTypeData`, `UpdatePresentationTypeData`, `PresentationTypeListItem`, `PresentationTypeRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [presentation-type.entity.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-entities-presentation-type-entity-ts)
- **Consumidores:** [create-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts), [create-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-ts), [update-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-spec-ts), [update-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-ts), [presentation-type-output.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-dtos-presentation-type-output-ts), [create-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-create-presentation-type-use-case-ts), [deactivate-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-deactivate-presentation-type-use-case-ts), [get-presentation-type-by-id.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-get-presentation-type-by-id-use-case-ts), [list-presentation-types.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-list-presentation-types-use-case-ts), [update-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-update-presentation-type-use-case-ts), [typeorm-presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-typeorm-presentation-type-repository-ts), [presentation-types.module.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-types-module-ts), [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [import-products-from-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts)

**Interfaces, tipos y enums:**

- `interface FindPresentationTypesOptions` (L10): sin documentación — miembros: `activeOnly`, `search`
- `interface CreatePresentationTypeData` (L15): sin documentación — miembros: `name`, `code`, `description`, `createdBy`
- `interface UpdatePresentationTypeData` (L22): sin documentación — miembros: `name`, `code`, `description`, `isActive`, `updatedBy`
- `interface PresentationTypeListItem` (L31) extends PresentationTypeProps: One list row plus its live usage count — `usageCount` is never persisted, always computed fresh via a correlated subquery against `product_presentations`, never a full fetch-and-count in TypeScript. — miembros: `usageCount`
- `interface PresentationTypeRepository` (L35): sin documentación — miembros: `findAll`, `findById`, `findByActiveName`, `findByName`, `findByActiveCode`, `create`, `update`, `deactivate`, `countUsage`

**Constantes exportadas:**

- `PRESENTATION_TYPE_REPOSITORY` (L6) = `Symbol( 'PRESENTATION_TYPE_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-presentation-type-mapper-ts"></a>

### presentation-type.mapper.ts

- **Ruta:** [presentation-type.mapper.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/presentation-type.mapper.ts) (`comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/presentation-type.mapper.ts`, 21 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** Mapper: declara `PresentationTypeMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [presentation-type.entity.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-entities-presentation-type-entity-ts), [presentation-type.orm-entity.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-presentation-type-orm-entity-ts)
- **Consumidores:** [typeorm-presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-typeorm-presentation-type-repository-ts)

#### Clase `PresentationTypeMapper` (L4–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–19 | `orm: PresentationTypeOrmEntity` | `PresentationType` |

##### `PresentationTypeMapper.toDomain`

- **Firma:** `toDomain(orm: PresentationTypeOrmEntity): PresentationType` — [presentation-type.mapper.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/presentation-type.mapper.ts#L5) (L5–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `PresentationType.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-typeorm-presentation-type-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-presentation-type-orm-entity-ts"></a>

### presentation-type.orm-entity.ts

- **Ruta:** [presentation-type.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/presentation-type.orm-entity.ts) (`comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/presentation-type.orm-entity.ts`, 57 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** Unique only among *active* rows, and case-insensitive — same `LOWER(name) WHERE is_active` raw-SQL index `clients` uses (see that migration's own doc comment), deliberately stronger than the plain case-sensitive partial index `account_types`/`transaction_types` use, per the explicit "Caja"/"caja"/" CAJA " requirement for this catalog.
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [product-presentation.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-product-presentation-orm-entity-ts), [presentation-type.mapper.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-presentation-type-mapper-ts), [typeorm-presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-typeorm-presentation-type-repository-ts), [presentation-types.module.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-types-module-ts)

#### Clase `PresentationTypeOrmEntity` (L20–56)

- **Decoradores:** `@Entity('presentation_types')`
- **Propósito:** Unique only among *active* rows, and case-insensitive — same `LOWER(name) WHERE is_active` raw-SQL index `clients` uses (see that migration's own doc comment), deliberately stronger than the plain case-sensitive partial index `account_types`/`transaction_types` use, per the explicit "Caja"/"caja"/" CAJA " requirement for this catalog.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column code: string \| null`, `@Column description: string \| null`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-typeorm-presentation-type-repository-ts"></a>

### typeorm-presentation-type.repository.ts

- **Ruta:** [typeorm-presentation-type.repository.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts) (`comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts`, 202 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmPresentationTypeRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [presentation-type.entity.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-entities-presentation-type-entity-ts), [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [presentation-type-name-already-exists.error.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-name-already-exists-error-ts), [presentation-type-code-already-exists.error.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-errors-presentation-type-code-already-exists-error-ts), [presentation-type.orm-entity.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-presentation-type-orm-entity-ts), [presentation-type.mapper.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-presentation-type-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [presentation-types.module.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-types-module-ts)

#### Clase `TypeOrmPresentationTypeRepository` (L17–201)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements PresentationTypeRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(PresentationTypeOrmEntity) repository: Repository<PresentationTypeOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 33–101 | `options: FindPresentationTypesOptions` | `Promise<PresentationTypeListItem[]>` |
| `findById` | método public async | 103–106 | `id: string` | `Promise<PresentationType \| null>` |
| `findByActiveName` | método public async | 108–115 | `name: string` | `Promise<PresentationType \| null>` |
| `findByName` | método public async | 117–123 | `name: string` | `Promise<PresentationType \| null>` |
| `findByActiveCode` | método public async | 125–132 | `code: string` | `Promise<PresentationType \| null>` |
| `create` | método public async | 134–150 | `data: CreatePresentationTypeData` | `Promise<PresentationType>` |
| `update` | método public async | 152–168 | `id: string`, `data: UpdatePresentationTypeData` | `Promise<PresentationType>` |
| `deactivate` | método public async | 170–172 | `id: string` | `Promise<void>` |
| `countUsage` | método public async | 174–180 | `id: string` | `Promise<number>` |
| `translateUniqueViolation` | método private | 183–200 | `error: unknown`, `name: string`, `code: string \| null` | `unknown` |

##### `TypeOrmPresentationTypeRepository.findAll`

- **Firma:** `findAll(options: FindPresentationTypesOptions): Promise<PresentationTypeListItem[]>` — [typeorm-presentation-type.repository.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts#L33) (L33–101)
- **Propósito / descripción:** Raw, hand-selected columns + a correlated scalar subquery for `usageCount` — the same "no relation-count-and-map helper in this TypeORM version" pattern Reports' own `itemCount` already established (`TypeOrmSalesReportRepository.findAll`). A join here would fan out one row per `product_presentations` match and corrupt the result.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('presentationType').leftJoin`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.select('presentationType.id', 'id').addSelect`, `qb.select`, `subQb.select('COUNT(*)', 'count').from('product_presentations', 'pp').where`, `subQb.select('COUNT(*)', 'count').from`, `subQb.select`, `qb.getRawMany`, `rows.map`, `parseInt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPresentationTypeRepository.findById`

- **Firma:** `findById(id: string): Promise<PresentationType \| null>` — [typeorm-presentation-type.repository.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts#L103) (L103–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `PresentationTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPresentationTypeRepository.findByActiveName`

- **Firma:** `findByActiveName(name: string): Promise<PresentationType \| null>` — [typeorm-presentation-type.repository.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts#L108) (L108–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('presentationType').where`, `this.repository.createQueryBuilder`, `PresentationTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPresentationTypeRepository.findByName`

- **Firma:** `findByName(name: string): Promise<PresentationType \| null>` — [typeorm-presentation-type.repository.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts#L117) (L117–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('presentationType').where`, `this.repository.createQueryBuilder`, `PresentationTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPresentationTypeRepository.findByActiveCode`

- **Firma:** `findByActiveCode(code: string): Promise<PresentationType \| null>` — [typeorm-presentation-type.repository.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts#L125) (L125–132)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('presentationType').where`, `this.repository.createQueryBuilder`, `PresentationTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPresentationTypeRepository.create`

- **Firma:** `create(data: CreatePresentationTypeData): Promise<PresentationType>` — [typeorm-presentation-type.repository.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts#L134) (L134–150)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `PresentationTypeMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name, data.code)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPresentationTypeRepository.update`

- **Firma:** `update(id: string, data: UpdatePresentationTypeData): Promise<PresentationType>` — [typeorm-presentation-type.repository.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts#L152) (L152–168)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `PresentationTypeMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation( error, data.name ?? '', data.code ?? null, )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPresentationTypeRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-presentation-type.repository.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts#L170) (L170–172)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPresentationTypeRepository.countUsage`

- **Firma:** `countUsage(id: string): Promise<number>` — [typeorm-presentation-type.repository.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts#L174) (L174–180)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `parseInt`
- **Efectos secundarios:** Tablas en su SQL: `product_presentations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPresentationTypeRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, name: string, code: string \| null): unknown` — [typeorm-presentation-type.repository.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts#L183) (L183–200)
- **Propósito / descripción:** Safety net for the create/update race the use case's own pre-check can't close — same pattern as `TypeOrmClientRepository.translateUniqueViolation`.
- **Dependencias (llamadas en su cuerpo):** `new PresentationTypeNameAlreadyExistsError`, `new PresentationTypeCodeAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-presentation-types-presentation-types-module-ts"></a>

### presentation-types.module.ts

- **Ruta:** [presentation-types.module.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation-types.module.ts) (`comercial-jhoel-api/src/modules/presentation-types/presentation-types.module.ts`, 31 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** Módulo: declara `PresentationTypesModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [presentation-type.orm-entity.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-presentation-type-orm-entity-ts), [typeorm-presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-typeorm-presentation-type-repository-ts), [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [create-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-create-presentation-type-use-case-ts), [list-presentation-types.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-list-presentation-types-use-case-ts), [get-presentation-type-by-id.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-get-presentation-type-by-id-use-case-ts), [update-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-update-presentation-type-use-case-ts), [deactivate-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-deactivate-presentation-type-use-case-ts), [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts)

#### Clase `PresentationTypesModule` (L13–30)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([PresentationTypeOrmEntity])], controllers: [PresentationTypesController], providers: [ { provide: PRESENTATION_TYPE`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts"></a>

### presentation-types.controller.ts

- **Ruta:** [presentation-types.controller.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts) (`comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts`, 94 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** CRUD is admin-only (create/update/deactivate) — same policy as Categorías/Negocios/Tipos de Cuenta.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-create-presentation-type-use-case-ts), [list-presentation-types.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-list-presentation-types-use-case-ts), [get-presentation-type-by-id.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-get-presentation-type-by-id-use-case-ts), [update-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-update-presentation-type-use-case-ts), [deactivate-presentation-type.use-case.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-application-use-cases-deactivate-presentation-type-use-case-ts), [create-presentation-type.request.dto.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-dtos-create-presentation-type-request-dto-ts), [update-presentation-type.request.dto.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-dtos-update-presentation-type-request-dto-ts), [list-presentation-types.query.dto.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-dtos-list-presentation-types-query-dto-ts), [presentation-type.response.dto.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-dtos-presentation-type-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [presentation-types.module.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-types-module-ts)

#### Clase `PresentationTypesController` (L33–93)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('presentation-types')`
- **Propósito:** CRUD is admin-only (create/update/deactivate) — same policy as Categorías/Negocios/Tipos de Cuenta. Any authenticated role can read the list (needed by the product/presentation forms' dropdowns).
- **Dependencias inyectadas (constructor):** `createPresentationTypeUseCase: CreatePresentationTypeUseCase`, `listPresentationTypesUseCase: ListPresentationTypesUseCase`, `getPresentationTypeByIdUseCase: GetPresentationTypeByIdUseCase`, `updatePresentationTypeUseCase: UpdatePresentationTypeUseCase`, `deactivatePresentationTypeUseCase: DeactivatePresentationTypeUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 44–56 | `dto: CreatePresentationTypeRequestDto`, `userId: string` | `Promise<PresentationTypeResponseDto>` |
| `findAll` | método public | 58–63 | `query: ListPresentationTypesQueryDto` | `Promise<PresentationTypeListResponseDto[]>` |
| `findOne` | método public | 65–70 | `id: string` | `Promise<PresentationTypeResponseDto>` |
| `update` | método public | 72–84 | `id: string`, `dto: UpdatePresentationTypeRequestDto`, `userId: string` | `Promise<PresentationTypeResponseDto>` |
| `deactivate` | método public | 86–92 | `id: string` | `Promise<void>` |

##### `PresentationTypesController.create`

- **Firma:** `create(dto: CreatePresentationTypeRequestDto, userId: string): Promise<PresentationTypeResponseDto>` — [presentation-types.controller.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts#L44) (L44–56)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createPresentationTypeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationTypesController.findAll`

- **Firma:** `findAll(query: ListPresentationTypesQueryDto): Promise<PresentationTypeListResponseDto[]>` — [presentation-types.controller.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts#L58) (L58–63)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listPresentationTypesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationTypesController.findOne`

- **Firma:** `findOne(id: string): Promise<PresentationTypeResponseDto>` — [presentation-types.controller.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts#L65) (L65–70)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getPresentationTypeByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationTypesController.update`

- **Firma:** `update(id: string, dto: UpdatePresentationTypeRequestDto, userId: string): Promise<PresentationTypeResponseDto>` — [presentation-types.controller.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts#L72) (L72–84)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updatePresentationTypeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationTypesController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [presentation-types.controller.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts#L86) (L86–92)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivatePresentationTypeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-presentation-types-presentation-dtos-create-presentation-type-request-dto-ts"></a>

### create-presentation-type.request.dto.ts

- **Ruta:** [create-presentation-type.request.dto.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/dtos/create-presentation-type.request.dto.ts) (`comercial-jhoel-api/src/modules/presentation-types/presentation/dtos/create-presentation-type.request.dto.ts`, 20 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** DTO de entrada: declara `CreatePresentationTypeRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts)

#### Clase `CreatePresentationTypeRequestDto` (L3–19)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-presentation-types-presentation-dtos-list-presentation-types-query-dto-ts"></a>

### list-presentation-types.query.dto.ts

- **Ruta:** [list-presentation-types.query.dto.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/dtos/list-presentation-types.query.dto.ts) (`comercial-jhoel-api/src/modules/presentation-types/presentation/dtos/list-presentation-types.query.dto.ts`, 14 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** DTO de consulta: declara `ListPresentationTypesQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts)

#### Clase `ListPresentationTypesQueryDto` (L4–13)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-presentation-types-presentation-dtos-presentation-type-response-dto-ts"></a>

### presentation-type.response.dto.ts

- **Ruta:** [presentation-type.response.dto.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/dtos/presentation-type.response.dto.ts) (`comercial-jhoel-api/src/modules/presentation-types/presentation/dtos/presentation-type.response.dto.ts`, 18 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** DTO de respuesta: declara `PresentationTypeResponseDto`, `PresentationTypeListResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts)

#### Clase `PresentationTypeResponseDto` (L1–13)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PresentationTypeListResponseDto` (L15–17)

- **Herencia / contratos:** extends PresentationTypeResponseDto
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-presentation-types-presentation-dtos-update-presentation-type-request-dto-ts"></a>

### update-presentation-type.request.dto.ts

- **Ruta:** [update-presentation-type.request.dto.ts](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/dtos/update-presentation-type.request.dto.ts) (`comercial-jhoel-api/src/modules/presentation-types/presentation/dtos/update-presentation-type.request.dto.ts`, 32 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `presentation-types`
- **Responsabilidad:** DTO de entrada: declara `UpdatePresentationTypeRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [presentation-types.controller.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-controllers-presentation-types-controller-ts)

#### Clase `UpdatePresentationTypeRequestDto` (L10–31)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
