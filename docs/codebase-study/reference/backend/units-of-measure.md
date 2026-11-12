# Módulo backend `units-of-measure`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/units-of-measure` | [units-of-measure.controller.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/controllers/units-of-measure.controller.ts#L44) `UnitsOfMeasureController.create` | [CreateUnitOfMeasureUseCase](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-create-unit-of-measure-use-case-ts) | `UnitOfMeasureRepository`.findByName/findByActiveAbbreviation/create | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `UnitOfMeasureService.createUnitOfMeasure` |
| `GET /api/units-of-measure` | [units-of-measure.controller.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/controllers/units-of-measure.controller.ts#L58) `UnitsOfMeasureController.findAll` | [ListUnitsOfMeasureUseCase](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-list-units-of-measure-use-case-ts) | `UnitOfMeasureRepository`.findAll | UseGuards(JwtAuthGuard) | `UnitOfMeasureService.getUnitsOfMeasure` |
| `GET /api/units-of-measure/:id` | [units-of-measure.controller.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/controllers/units-of-measure.controller.ts#L65) `UnitsOfMeasureController.findOne` | [GetUnitOfMeasureByIdUseCase](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-get-unit-of-measure-by-id-use-case-ts) | `UnitOfMeasureRepository`.findById | UseGuards(JwtAuthGuard) | `UnitOfMeasureService.getUnitOfMeasureById` |
| `PATCH /api/units-of-measure/:id` | [units-of-measure.controller.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/controllers/units-of-measure.controller.ts#L72) `UnitsOfMeasureController.update` | [UpdateUnitOfMeasureUseCase](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-update-unit-of-measure-use-case-ts) | `UnitOfMeasureRepository`.findById/findByName/findByActiveAbbreviation/update | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `UnitOfMeasureService.updateUnitOfMeasure` |
| `DELETE /api/units-of-measure/:id` | [units-of-measure.controller.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/controllers/units-of-measure.controller.ts#L86) `UnitsOfMeasureController.deactivate` | [DeactivateUnitOfMeasureUseCase](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-deactivate-unit-of-measure-use-case-ts) | `UnitOfMeasureRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `UnitOfMeasureService.deleteUnitOfMeasure` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [unit-of-measure-output.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-application-dtos-unit-of-measure-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toUnitOfMeasureOutput`, `toUnitOfMeasureListOutput`, `UnitOfMeasureOutput`, `UnitOfMeasureListOutput` (sin comentario de documentación en el código). | 2 internas | 4 | Media (4 consumidores) |
| [create-unit-of-measure.use-case.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-create-unit-of-measure-use-case-ts) | .ts | Caso de uso | Aplicación | Same "frontend checks for an inactive match first, this rejects on skip" reasoning as `CreatePresentationTypeUseCase` — see that use case's own doc comment. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-unit-of-measure.use-case.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-deactivate-unit-of-measure-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — never a physical `DELETE`. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-unit-of-measure-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-get-unit-of-measure-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetUnitOfMeasureByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-units-of-measure.use-case.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-list-units-of-measure-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListUnitsOfMeasureUseCase`, `ListUnitsOfMeasureInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-unit-of-measure.use-case.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-update-unit-of-measure-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateUnitOfMeasureUseCase`, `UpdateUnitOfMeasureInput` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [unit-of-measure.entity.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-domain-entities-unit-of-measure-entity-ts) | .ts | Entidad de dominio | Dominio | Catálogo maestro de unidades de medida (Unidad, Kilogramo, Litro, ...) — un concepto deliberadamente separado de `PresentationType` (Caja, Paquete...): esto describe la unidad física en la que se mide un producto, no cómo se agrupa/comercializa. | 0 internas | 4 | Media (4 consumidores) |
| [unit-of-measure-abbreviation-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-abbreviation-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `UnitOfMeasureAbbreviationAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [unit-of-measure-name-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-name-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `UnitOfMeasureNameAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [unit-of-measure-not-found.error.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `UnitOfMeasureNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [unit-of-measure.repository.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `FindUnitsOfMeasureOptions`, `CreateUnitOfMeasureData`, `UpdateUnitOfMeasureData`, `UnitOfMeasureListItem`, `UnitOfMeasureRepository` (sin comentario de documentación en el código). | 1 internas | 11 | Alta (11 consumidores) |
| [typeorm-unit-of-measure.repository.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-typeorm-unit-of-measure-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmUnitOfMeasureRepository` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [unit-of-measure.mapper.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-unit-of-measure-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `UnitOfMeasureMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [unit-of-measure.orm-entity.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-unit-of-measure-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Unique among *active* rows on both `name` and `abbreviation`, case-insensitive — same `LOWER(...) WHERE is_active` raw-SQL index `clients`/`presentation_types` use (see either migration's own doc comment); TypeORM's `@Index` decorator can't express a functional index, so both are created via raw SQL in the migration, not here. | 1 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [units-of-measure.controller.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts) | .ts | Controlador | Presentación | CRUD is admin-only (create/update/deactivate) — same policy as Categorías/Negocios/Tipos de Cuenta. | 13 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [create-unit-of-measure.request.dto.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-dtos-create-unit-of-measure-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateUnitOfMeasureRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-units-of-measure.query.dto.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-dtos-list-units-of-measure-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListUnitsOfMeasureQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [unit-of-measure.response.dto.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-dtos-unit-of-measure-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `UnitOfMeasureResponseDto`, `UnitOfMeasureListResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [update-unit-of-measure.request.dto.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-dtos-update-unit-of-measure-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateUnitOfMeasureRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [units-of-measure.module.ts](#f-comercial-jhoel-api-src-modules-units-of-measure-units-of-measure-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `UnitsOfMeasureModule` (sin comentario de documentación en el código). | 9 internas; ext.: @nestjs/common, @nestjs/typeorm | 2 | Baja (2 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-units-of-measure-application-dtos-unit-of-measure-output-ts"></a>

### unit-of-measure-output.ts

- **Ruta:** [unit-of-measure-output.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/application/dtos/unit-of-measure-output.ts) (`comercial-jhoel-api/src/modules/units-of-measure/application/dtos/unit-of-measure-output.ts`, 45 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** DTO de salida (aplicación): declara `toUnitOfMeasureOutput`, `toUnitOfMeasureListOutput`, `UnitOfMeasureOutput`, `UnitOfMeasureListOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [unit-of-measure.entity.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-entities-unit-of-measure-entity-ts), [unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts)
- **Consumidores:** [create-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-create-unit-of-measure-use-case-ts), [get-unit-of-measure-by-id.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-get-unit-of-measure-by-id-use-case-ts), [list-units-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-list-units-of-measure-use-case-ts), [update-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-update-unit-of-measure-use-case-ts)

**Interfaces, tipos y enums:**

- `interface UnitOfMeasureOutput` (L4): sin documentación — miembros: `id`, `name`, `abbreviation`, `description`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface UnitOfMeasureListOutput` (L18) extends UnitOfMeasureOutput: sin documentación — miembros: `usageCount`
#### Función `toUnitOfMeasureOutput` (L22–38)

- **Tipo:** función exportada
- **Firma:** `toUnitOfMeasureOutput(unitOfMeasure: UnitOfMeasure): UnitOfMeasureOutput` — [unit-of-measure-output.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/application/dtos/unit-of-measure-output.ts#L22)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-create-unit-of-measure-use-case-ts), [get-unit-of-measure-by-id.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-get-unit-of-measure-by-id-use-case-ts), [update-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-update-unit-of-measure-use-case-ts)

#### Función `toUnitOfMeasureListOutput` (L40–44)

- **Tipo:** función exportada
- **Firma:** `toUnitOfMeasureListOutput(item: UnitOfMeasureListItem): UnitOfMeasureListOutput` — [unit-of-measure-output.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/application/dtos/unit-of-measure-output.ts#L40)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-create-unit-of-measure-use-case-ts"></a>

### create-unit-of-measure.use-case.ts

- **Ruta:** [create-unit-of-measure.use-case.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/create-unit-of-measure.use-case.ts) (`comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/create-unit-of-measure.use-case.ts`, 60 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Same "frontend checks for an inactive match first, this rejects on skip" reasoning as `CreatePresentationTypeUseCase` — see that use case's own doc comment.
- **Depende de (archivos del proyecto):** [unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts), [unit-of-measure-name-already-exists.error.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-name-already-exists-error-ts), [unit-of-measure-abbreviation-already-exists.error.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-abbreviation-already-exists-error-ts), [unit-of-measure-output.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-dtos-unit-of-measure-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts), [units-of-measure.module.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-units-of-measure-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateUnitOfMeasureInput` (L11): sin documentación — miembros: `name`, `abbreviation`, `description`, `createdBy`

#### Clase `CreateUnitOfMeasureUseCase` (L19–59)

- **Decoradores:** `@Injectable()`
- **Propósito:** Same "frontend checks for an inactive match first, this rejects on skip" reasoning as `CreatePresentationTypeUseCase` — see that use case's own doc comment.
- **Dependencias inyectadas (constructor):** `@Inject(UNIT_OF_MEASURE_REPOSITORY) unitOfMeasureRepository: UnitOfMeasureRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 26–58 | `input: CreateUnitOfMeasureInput` | `Promise<UnitOfMeasureOutput>` |

##### `CreateUnitOfMeasureUseCase.execute`

- **Firma:** `execute(input: CreateUnitOfMeasureInput): Promise<UnitOfMeasureOutput>` — [create-unit-of-measure.use-case.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/create-unit-of-measure.use-case.ts#L26) (L26–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.name.trim().replace`, `input.name.trim`, `input.abbreviation.trim().replace`, `input.abbreviation.trim`, `input.description?.trim().replace`, `input.description?.trim`, `this.unitOfMeasureRepository.findByName`, `new UnitOfMeasureNameAlreadyExistsError`, `this.unitOfMeasureRepository.findByActiveAbbreviation`, `new UnitOfMeasureAbbreviationAlreadyExistsError`, `this.unitOfMeasureRepository.create`, `toUnitOfMeasureOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new UnitOfMeasureNameAlreadyExistsError( name, !existingByName.isActive, )`, `new UnitOfMeasureAbbreviationAlreadyExistsError(abbreviation)`
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-deactivate-unit-of-measure-use-case-ts"></a>

### deactivate-unit-of-measure.use-case.ts

- **Ruta:** [deactivate-unit-of-measure.use-case.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/deactivate-unit-of-measure.use-case.ts) (`comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/deactivate-unit-of-measure.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Soft delete only — never a physical `DELETE`.
- **Depende de (archivos del proyecto):** [unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts), [unit-of-measure-not-found.error.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts), [units-of-measure.module.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-units-of-measure-module-ts)

#### Clase `DeactivateUnitOfMeasureUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — never a physical `DELETE`. Does not block on `usageCount &gt; 0`, same reasoning as `DeactivatePresentationTypeUseCase`.
- **Dependencias inyectadas (constructor):** `@Inject(UNIT_OF_MEASURE_REPOSITORY) unitOfMeasureRepository: UnitOfMeasureRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<void>` |

##### `DeactivateUnitOfMeasureUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-unit-of-measure.use-case.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/deactivate-unit-of-measure.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.unitOfMeasureRepository.findById`, `new UnitOfMeasureNotFoundError`, `this.unitOfMeasureRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new UnitOfMeasureNotFoundError(id)`
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-get-unit-of-measure-by-id-use-case-ts"></a>

### get-unit-of-measure-by-id.use-case.ts

- **Ruta:** [get-unit-of-measure-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/get-unit-of-measure-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/get-unit-of-measure-by-id.use-case.ts`, 25 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Caso de uso: declara `GetUnitOfMeasureByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts), [unit-of-measure-not-found.error.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-not-found-error-ts), [unit-of-measure-output.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-dtos-unit-of-measure-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts), [units-of-measure.module.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-units-of-measure-module-ts)

#### Clase `GetUnitOfMeasureByIdUseCase` (L10–24)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(UNIT_OF_MEASURE_REPOSITORY) unitOfMeasureRepository: UnitOfMeasureRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–23 | `id: string` | `Promise<UnitOfMeasureOutput>` |

##### `GetUnitOfMeasureByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<UnitOfMeasureOutput>` — [get-unit-of-measure-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/get-unit-of-measure-by-id.use-case.ts#L17) (L17–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.unitOfMeasureRepository.findById`, `new UnitOfMeasureNotFoundError`, `toUnitOfMeasureOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new UnitOfMeasureNotFoundError(id)`
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-list-units-of-measure-use-case-ts"></a>

### list-units-of-measure.use-case.ts

- **Ruta:** [list-units-of-measure.use-case.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/list-units-of-measure.use-case.ts) (`comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/list-units-of-measure.use-case.ts`, 31 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Caso de uso: declara `ListUnitsOfMeasureUseCase`, `ListUnitsOfMeasureInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts), [unit-of-measure-output.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-dtos-unit-of-measure-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts), [units-of-measure.module.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-units-of-measure-module-ts)

**Interfaces, tipos y enums:**

- `interface ListUnitsOfMeasureInput` (L9): sin documentación — miembros: `includeInactive`, `search`

#### Clase `ListUnitsOfMeasureUseCase` (L14–30)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(UNIT_OF_MEASURE_REPOSITORY) unitOfMeasureRepository: UnitOfMeasureRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 21–29 | `input?: ListUnitsOfMeasureInput` | `Promise<UnitOfMeasureListOutput[]>` |

##### `ListUnitsOfMeasureUseCase.execute`

- **Firma:** `execute(input?: ListUnitsOfMeasureInput): Promise<UnitOfMeasureListOutput[]>` — [list-units-of-measure.use-case.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/list-units-of-measure.use-case.ts#L21) (L21–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.unitOfMeasureRepository.findAll`, `input.search?.trim`, `items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-update-unit-of-measure-use-case-ts"></a>

### update-unit-of-measure.use-case.ts

- **Ruta:** [update-unit-of-measure.use-case.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/update-unit-of-measure.use-case.ts) (`comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/update-unit-of-measure.use-case.ts`, 77 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Caso de uso: declara `UpdateUnitOfMeasureUseCase`, `UpdateUnitOfMeasureInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts), [unit-of-measure-not-found.error.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-not-found-error-ts), [unit-of-measure-name-already-exists.error.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-name-already-exists-error-ts), [unit-of-measure-abbreviation-already-exists.error.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-abbreviation-already-exists-error-ts), [unit-of-measure-output.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-dtos-unit-of-measure-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts), [units-of-measure.module.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-units-of-measure-module-ts)

**Interfaces, tipos y enums:**

- `interface UpdateUnitOfMeasureInput` (L12): sin documentación — miembros: `name`, `abbreviation`, `description`, `isActive`, `updatedBy`

#### Clase `UpdateUnitOfMeasureUseCase` (L20–76)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(UNIT_OF_MEASURE_REPOSITORY) unitOfMeasureRepository: UnitOfMeasureRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 27–75 | `id: string`, `input: UpdateUnitOfMeasureInput` | `Promise<UnitOfMeasureOutput>` |

##### `UpdateUnitOfMeasureUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateUnitOfMeasureInput): Promise<UnitOfMeasureOutput>` — [update-unit-of-measure.use-case.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/application/use-cases/update-unit-of-measure.use-case.ts#L27) (L27–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.unitOfMeasureRepository.findById`, `new UnitOfMeasureNotFoundError`, `input.name?.trim().replace`, `input.name?.trim`, `name.toLowerCase`, `unitOfMeasure.name.toLowerCase`, `this.unitOfMeasureRepository.findByName`, `new UnitOfMeasureNameAlreadyExistsError`, `input.abbreviation?.trim().replace`, `input.abbreviation?.trim`, `abbreviation.toLowerCase`, `unitOfMeasure.abbreviation.toLowerCase`, `this.unitOfMeasureRepository.findByActiveAbbreviation`, `new UnitOfMeasureAbbreviationAlreadyExistsError`, `input.description?.trim().replace`, `input.description?.trim`, `this.unitOfMeasureRepository.update`, `toUnitOfMeasureOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.unitOfMeasureRepository.update`
- **Errores que lanza:** `new UnitOfMeasureNotFoundError(id)`, `new UnitOfMeasureNameAlreadyExistsError( name, !existing.isActive, )`, `new UnitOfMeasureAbbreviationAlreadyExistsError(abbreviation)`
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-units-of-measure-domain-entities-unit-of-measure-entity-ts"></a>

### unit-of-measure.entity.ts

- **Ruta:** [unit-of-measure.entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts) (`comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts`, 75 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Catálogo maestro de unidades de medida (Unidad, Kilogramo, Litro, ...) — un concepto deliberadamente separado de `PresentationType` (Caja, Paquete...): esto describe la unidad física en la que se mide un producto, no cómo se agrupa/comercializa.
- **Consumidores:** [unit-of-measure-output.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-dtos-unit-of-measure-output-ts), [unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts), [typeorm-unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-typeorm-unit-of-measure-repository-ts), [unit-of-measure.mapper.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-unit-of-measure-mapper-ts)

**Interfaces, tipos y enums:**

- `interface UnitOfMeasureProps` (L1): sin documentación — miembros: `id`, `name`, `abbreviation`, `description`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`

#### Clase `UnitOfMeasure` (L24–74)

- **Propósito:** Catálogo maestro de unidades de medida (Unidad, Kilogramo, Litro, ...) — un concepto deliberadamente separado de `PresentationType` (Caja, Paquete...): esto describe la unidad física en la que se mide un producto, no cómo se agrupa/comercializa. `products.unit_of_measure_id` referencia una fila de este catálogo por FK — un producto tiene exactamente una unidad de medida, a diferencia de sus múltiples presentaciones.
- **Dependencias inyectadas (constructor):** `props: UnitOfMeasureProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 27–29 | `props: UnitOfMeasureProps` | `UnitOfMeasure` |
| `id` | getter public | 31–33 | — | `string` |
| `name` | getter public | 35–37 | — | `string` |
| `abbreviation` | getter public | 39–41 | — | `string` |
| `description` | getter public | 43–45 | — | `string \| null` |
| `isActive` | getter public | 47–49 | — | `boolean` |
| `createdAt` | getter public | 51–53 | — | `Date` |
| `updatedAt` | getter public | 55–57 | — | `Date` |
| `createdBy` | getter public | 59–61 | — | `string` |
| `createdByUsername` | getter public | 63–65 | — | `string` |
| `updatedBy` | getter public | 67–69 | — | `string \| null` |
| `updatedByUsername` | getter public | 71–73 | — | `string \| null` |

##### `UnitOfMeasure.create`

- **Firma:** `create(props: UnitOfMeasureProps): UnitOfMeasure` — [unit-of-measure.entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new UnitOfMeasure`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-typeorm-unit-of-measure-repository-ts), [unit-of-measure.mapper.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-unit-of-measure-mapper-ts)

##### `UnitOfMeasure.id`

- **Firma:** `id(): string` — [unit-of-measure.entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitOfMeasure.name`

- **Firma:** `name(): string` — [unit-of-measure.entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitOfMeasure.abbreviation`

- **Firma:** `abbreviation(): string` — [unit-of-measure.entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitOfMeasure.description`

- **Firma:** `description(): string \| null` — [unit-of-measure.entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitOfMeasure.isActive`

- **Firma:** `isActive(): boolean` — [unit-of-measure.entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitOfMeasure.createdAt`

- **Firma:** `createdAt(): Date` — [unit-of-measure.entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitOfMeasure.updatedAt`

- **Firma:** `updatedAt(): Date` — [unit-of-measure.entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitOfMeasure.createdBy`

- **Firma:** `createdBy(): string` — [unit-of-measure.entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitOfMeasure.createdByUsername`

- **Firma:** `createdByUsername(): string` — [unit-of-measure.entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitOfMeasure.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [unit-of-measure.entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitOfMeasure.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [unit-of-measure.entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/entities/unit-of-measure.entity.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-abbreviation-already-exists-error-ts"></a>

### unit-of-measure-abbreviation-already-exists.error.ts

- **Ruta:** [unit-of-measure-abbreviation-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/errors/unit-of-measure-abbreviation-already-exists.error.ts) (`comercial-jhoel-api/src/modules/units-of-measure/domain/errors/unit-of-measure-abbreviation-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Errores de dominio: declara `UnitOfMeasureAbbreviationAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-create-unit-of-measure-use-case-ts), [update-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-update-unit-of-measure-use-case-ts), [typeorm-unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-typeorm-unit-of-measure-repository-ts)

#### Clase `UnitOfMeasureAbbreviationAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `abbreviation: string`
<a id="f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-name-already-exists-error-ts"></a>

### unit-of-measure-name-already-exists.error.ts

- **Ruta:** [unit-of-measure-name-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/errors/unit-of-measure-name-already-exists.error.ts) (`comercial-jhoel-api/src/modules/units-of-measure/domain/errors/unit-of-measure-name-already-exists.error.ts`, 14 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Errores de dominio: declara `UnitOfMeasureNameAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-create-unit-of-measure-use-case-ts), [update-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-update-unit-of-measure-use-case-ts), [typeorm-unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-typeorm-unit-of-measure-repository-ts)

#### Clase `UnitOfMeasureNameAlreadyExistsError` (L3–13)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `name: string`, `isInactive: `
<a id="f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-not-found-error-ts"></a>

### unit-of-measure-not-found.error.ts

- **Ruta:** [unit-of-measure-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/errors/unit-of-measure-not-found.error.ts) (`comercial-jhoel-api/src/modules/units-of-measure/domain/errors/unit-of-measure-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Errores de dominio: declara `UnitOfMeasureNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-deactivate-unit-of-measure-use-case-ts), [get-unit-of-measure-by-id.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-get-unit-of-measure-by-id-use-case-ts), [update-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-update-unit-of-measure-use-case-ts)

#### Clase `UnitOfMeasureNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts"></a>

### unit-of-measure.repository.ts

- **Ruta:** [unit-of-measure.repository.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/repositories/unit-of-measure.repository.ts) (`comercial-jhoel-api/src/modules/units-of-measure/domain/repositories/unit-of-measure.repository.ts`, 49 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `FindUnitsOfMeasureOptions`, `CreateUnitOfMeasureData`, `UpdateUnitOfMeasureData`, `UnitOfMeasureListItem`, `UnitOfMeasureRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [unit-of-measure.entity.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-entities-unit-of-measure-entity-ts)
- **Consumidores:** [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [import-products-from-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts), [unit-of-measure-output.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-dtos-unit-of-measure-output-ts), [create-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-create-unit-of-measure-use-case-ts), [deactivate-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-deactivate-unit-of-measure-use-case-ts), [get-unit-of-measure-by-id.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-get-unit-of-measure-by-id-use-case-ts), [list-units-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-list-units-of-measure-use-case-ts), [update-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-update-unit-of-measure-use-case-ts), [typeorm-unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-typeorm-unit-of-measure-repository-ts), [units-of-measure.module.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-units-of-measure-module-ts)

**Interfaces, tipos y enums:**

- `interface FindUnitsOfMeasureOptions` (L8): sin documentación — miembros: `activeOnly`, `search`
- `interface CreateUnitOfMeasureData` (L13): sin documentación — miembros: `name`, `abbreviation`, `description`, `createdBy`
- `interface UpdateUnitOfMeasureData` (L20): sin documentación — miembros: `name`, `abbreviation`, `description`, `isActive`, `updatedBy`
- `interface UnitOfMeasureListItem` (L29) extends UnitOfMeasureProps: One list row plus its live usage count — `usageCount` is never persisted, always computed fresh via a correlated subquery against `products`, never a full fetch-and-count in TypeScript. — miembros: `usageCount`
- `interface UnitOfMeasureRepository` (L33): sin documentación — miembros: `findAll`, `findById`, `findByActiveName`, `findByName`, `findByActiveAbbreviation`, `create`, `update`, `deactivate`, `countUsage`

**Constantes exportadas:**

- `UNIT_OF_MEASURE_REPOSITORY` (L6) = `Symbol('UNIT_OF_MEASURE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-typeorm-unit-of-measure-repository-ts"></a>

### typeorm-unit-of-measure.repository.ts

- **Ruta:** [typeorm-unit-of-measure.repository.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/typeorm-unit-of-measure.repository.ts) (`comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/typeorm-unit-of-measure.repository.ts`, 202 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmUnitOfMeasureRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [unit-of-measure.entity.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-entities-unit-of-measure-entity-ts), [unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts), [unit-of-measure-name-already-exists.error.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-name-already-exists-error-ts), [unit-of-measure-abbreviation-already-exists.error.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-errors-unit-of-measure-abbreviation-already-exists-error-ts), [unit-of-measure.orm-entity.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-unit-of-measure-orm-entity-ts), [unit-of-measure.mapper.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-unit-of-measure-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [units-of-measure.module.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-units-of-measure-module-ts)

#### Clase `TypeOrmUnitOfMeasureRepository` (L17–201)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements UnitOfMeasureRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(UnitOfMeasureOrmEntity) repository: Repository<UnitOfMeasureOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 25–93 | `options: FindUnitsOfMeasureOptions` | `Promise<UnitOfMeasureListItem[]>` |
| `findById` | método public async | 95–98 | `id: string` | `Promise<UnitOfMeasure \| null>` |
| `findByActiveName` | método public async | 100–107 | `name: string` | `Promise<UnitOfMeasure \| null>` |
| `findByName` | método public async | 109–115 | `name: string` | `Promise<UnitOfMeasure \| null>` |
| `findByActiveAbbreviation` | método public async | 117–128 | `abbreviation: string` | `Promise<UnitOfMeasure \| null>` |
| `create` | método public async | 130–150 | `data: CreateUnitOfMeasureData` | `Promise<UnitOfMeasure>` |
| `update` | método public async | 152–168 | `id: string`, `data: UpdateUnitOfMeasureData` | `Promise<UnitOfMeasure>` |
| `deactivate` | método public async | 170–172 | `id: string` | `Promise<void>` |
| `countUsage` | método public async | 174–180 | `id: string` | `Promise<number>` |
| `translateUniqueViolation` | método private | 183–200 | `error: unknown`, `name: string`, `abbreviation: string` | `unknown` |

##### `TypeOrmUnitOfMeasureRepository.findAll`

- **Firma:** `findAll(options: FindUnitsOfMeasureOptions): Promise<UnitOfMeasureListItem[]>` — [typeorm-unit-of-measure.repository.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/typeorm-unit-of-measure.repository.ts#L25) (L25–93)
- **Propósito / descripción:** Raw, hand-selected columns + a correlated scalar subquery for `usageCount` against `products` — same pattern as `TypeOrmPresentationTypeRepository.findAll`.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('unitOfMeasure').leftJoin`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.select('unitOfMeasure.id', 'id').addSelect('unitOfMeasure.name', 'name').addSelect`, `qb.select('unitOfMeasure.id', 'id').addSelect`, `qb.select`, `subQb.select('COUNT(*)', 'count').from('products', 'p').where`, `subQb.select('COUNT(*)', 'count').from`, `subQb.select`, `qb.getRawMany`, `rows.map`, `parseInt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUnitOfMeasureRepository.findById`

- **Firma:** `findById(id: string): Promise<UnitOfMeasure \| null>` — [typeorm-unit-of-measure.repository.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/typeorm-unit-of-measure.repository.ts#L95) (L95–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `UnitOfMeasureMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUnitOfMeasureRepository.findByActiveName`

- **Firma:** `findByActiveName(name: string): Promise<UnitOfMeasure \| null>` — [typeorm-unit-of-measure.repository.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/typeorm-unit-of-measure.repository.ts#L100) (L100–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('unitOfMeasure').where`, `this.repository.createQueryBuilder`, `UnitOfMeasureMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUnitOfMeasureRepository.findByName`

- **Firma:** `findByName(name: string): Promise<UnitOfMeasure \| null>` — [typeorm-unit-of-measure.repository.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/typeorm-unit-of-measure.repository.ts#L109) (L109–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('unitOfMeasure').where`, `this.repository.createQueryBuilder`, `UnitOfMeasureMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUnitOfMeasureRepository.findByActiveAbbreviation`

- **Firma:** `findByActiveAbbreviation(abbreviation: string): Promise<UnitOfMeasure \| null>` — [typeorm-unit-of-measure.repository.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/typeorm-unit-of-measure.repository.ts#L117) (L117–128)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('unitOfMeasure').where`, `this.repository.createQueryBuilder`, `UnitOfMeasureMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUnitOfMeasureRepository.create`

- **Firma:** `create(data: CreateUnitOfMeasureData): Promise<UnitOfMeasure>` — [typeorm-unit-of-measure.repository.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/typeorm-unit-of-measure.repository.ts#L130) (L130–150)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `UnitOfMeasureMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation( error, data.name, data.abbreviation, )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUnitOfMeasureRepository.update`

- **Firma:** `update(id: string, data: UpdateUnitOfMeasureData): Promise<UnitOfMeasure>` — [typeorm-unit-of-measure.repository.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/typeorm-unit-of-measure.repository.ts#L152) (L152–168)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `UnitOfMeasureMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation( error, data.name ?? '', data.abbreviation ?? '', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUnitOfMeasureRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-unit-of-measure.repository.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/typeorm-unit-of-measure.repository.ts#L170) (L170–172)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUnitOfMeasureRepository.countUsage`

- **Firma:** `countUsage(id: string): Promise<number>` — [typeorm-unit-of-measure.repository.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/typeorm-unit-of-measure.repository.ts#L174) (L174–180)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `parseInt`
- **Efectos secundarios:** Tablas en su SQL: `products`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmUnitOfMeasureRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, name: string, abbreviation: string): unknown` — [typeorm-unit-of-measure.repository.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/typeorm-unit-of-measure.repository.ts#L183) (L183–200)
- **Propósito / descripción:** Safety net for the create/update race the use case's own pre-check can't close — same pattern as `TypeOrmClientRepository.translateUniqueViolation`.
- **Dependencias (llamadas en su cuerpo):** `new UnitOfMeasureNameAlreadyExistsError`, `new UnitOfMeasureAbbreviationAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-unit-of-measure-mapper-ts"></a>

### unit-of-measure.mapper.ts

- **Ruta:** [unit-of-measure.mapper.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/unit-of-measure.mapper.ts) (`comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/unit-of-measure.mapper.ts`, 21 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Mapper: declara `UnitOfMeasureMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [unit-of-measure.entity.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-entities-unit-of-measure-entity-ts), [unit-of-measure.orm-entity.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-unit-of-measure-orm-entity-ts)
- **Consumidores:** [typeorm-unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-typeorm-unit-of-measure-repository-ts)

#### Clase `UnitOfMeasureMapper` (L4–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–19 | `orm: UnitOfMeasureOrmEntity` | `UnitOfMeasure` |

##### `UnitOfMeasureMapper.toDomain`

- **Firma:** `toDomain(orm: UnitOfMeasureOrmEntity): UnitOfMeasure` — [unit-of-measure.mapper.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/unit-of-measure.mapper.ts#L5) (L5–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `UnitOfMeasure.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-typeorm-unit-of-measure-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-unit-of-measure-orm-entity-ts"></a>

### unit-of-measure.orm-entity.ts

- **Ruta:** [unit-of-measure.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/unit-of-measure.orm-entity.ts) (`comercial-jhoel-api/src/modules/units-of-measure/infrastructure/persistence/unit-of-measure.orm-entity.ts`, 56 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Unique among *active* rows on both `name` and `abbreviation`, case-insensitive — same `LOWER(...) WHERE is_active` raw-SQL index `clients`/`presentation_types` use (see either migration's own doc comment); TypeORM's `@Index` decorator can't express a functional index, so both are created via raw SQL in the migration, not here.
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [product.orm-entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-orm-entity-ts), [typeorm-unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-typeorm-unit-of-measure-repository-ts), [unit-of-measure.mapper.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-unit-of-measure-mapper-ts), [units-of-measure.module.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-units-of-measure-module-ts)

#### Clase `UnitOfMeasureOrmEntity` (L19–55)

- **Decoradores:** `@Entity('units_of_measure')`
- **Propósito:** Unique among *active* rows on both `name` and `abbreviation`, case-insensitive — same `LOWER(...) WHERE is_active` raw-SQL index `clients`/`presentation_types` use (see either migration's own doc comment); TypeORM's `@Index` decorator can't express a functional index, so both are created via raw SQL in the migration, not here.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column abbreviation: string`, `@Column description: string \| null`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts"></a>

### units-of-measure.controller.ts

- **Ruta:** [units-of-measure.controller.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/controllers/units-of-measure.controller.ts) (`comercial-jhoel-api/src/modules/units-of-measure/presentation/controllers/units-of-measure.controller.ts`, 94 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** CRUD is admin-only (create/update/deactivate) — same policy as Categorías/Negocios/Tipos de Cuenta.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-create-unit-of-measure-use-case-ts), [list-units-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-list-units-of-measure-use-case-ts), [get-unit-of-measure-by-id.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-get-unit-of-measure-by-id-use-case-ts), [update-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-update-unit-of-measure-use-case-ts), [deactivate-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-deactivate-unit-of-measure-use-case-ts), [create-unit-of-measure.request.dto.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-dtos-create-unit-of-measure-request-dto-ts), [update-unit-of-measure.request.dto.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-dtos-update-unit-of-measure-request-dto-ts), [list-units-of-measure.query.dto.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-dtos-list-units-of-measure-query-dto-ts), [unit-of-measure.response.dto.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-dtos-unit-of-measure-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [units-of-measure.module.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-units-of-measure-module-ts)

#### Clase `UnitsOfMeasureController` (L33–93)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('units-of-measure')`
- **Propósito:** CRUD is admin-only (create/update/deactivate) — same policy as Categorías/Negocios/Tipos de Cuenta. Any authenticated role can read the list (needed by the product form's dropdown).
- **Dependencias inyectadas (constructor):** `createUnitOfMeasureUseCase: CreateUnitOfMeasureUseCase`, `listUnitsOfMeasureUseCase: ListUnitsOfMeasureUseCase`, `getUnitOfMeasureByIdUseCase: GetUnitOfMeasureByIdUseCase`, `updateUnitOfMeasureUseCase: UpdateUnitOfMeasureUseCase`, `deactivateUnitOfMeasureUseCase: DeactivateUnitOfMeasureUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 44–56 | `dto: CreateUnitOfMeasureRequestDto`, `userId: string` | `Promise<UnitOfMeasureResponseDto>` |
| `findAll` | método public | 58–63 | `query: ListUnitsOfMeasureQueryDto` | `Promise<UnitOfMeasureListResponseDto[]>` |
| `findOne` | método public | 65–70 | `id: string` | `Promise<UnitOfMeasureResponseDto>` |
| `update` | método public | 72–84 | `id: string`, `dto: UpdateUnitOfMeasureRequestDto`, `userId: string` | `Promise<UnitOfMeasureResponseDto>` |
| `deactivate` | método public | 86–92 | `id: string` | `Promise<void>` |

##### `UnitsOfMeasureController.create`

- **Firma:** `create(dto: CreateUnitOfMeasureRequestDto, userId: string): Promise<UnitOfMeasureResponseDto>` — [units-of-measure.controller.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/controllers/units-of-measure.controller.ts#L44) (L44–56)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createUnitOfMeasureUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitsOfMeasureController.findAll`

- **Firma:** `findAll(query: ListUnitsOfMeasureQueryDto): Promise<UnitOfMeasureListResponseDto[]>` — [units-of-measure.controller.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/controllers/units-of-measure.controller.ts#L58) (L58–63)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listUnitsOfMeasureUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitsOfMeasureController.findOne`

- **Firma:** `findOne(id: string): Promise<UnitOfMeasureResponseDto>` — [units-of-measure.controller.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/controllers/units-of-measure.controller.ts#L65) (L65–70)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getUnitOfMeasureByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitsOfMeasureController.update`

- **Firma:** `update(id: string, dto: UpdateUnitOfMeasureRequestDto, userId: string): Promise<UnitOfMeasureResponseDto>` — [units-of-measure.controller.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/controllers/units-of-measure.controller.ts#L72) (L72–84)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateUnitOfMeasureUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitsOfMeasureController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [units-of-measure.controller.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/controllers/units-of-measure.controller.ts#L86) (L86–92)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateUnitOfMeasureUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-units-of-measure-presentation-dtos-create-unit-of-measure-request-dto-ts"></a>

### create-unit-of-measure.request.dto.ts

- **Ruta:** [create-unit-of-measure.request.dto.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/dtos/create-unit-of-measure.request.dto.ts) (`comercial-jhoel-api/src/modules/units-of-measure/presentation/dtos/create-unit-of-measure.request.dto.ts`, 20 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** DTO de entrada: declara `CreateUnitOfMeasureRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts)

#### Clase `CreateUnitOfMeasureRequestDto` (L3–19)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-units-of-measure-presentation-dtos-list-units-of-measure-query-dto-ts"></a>

### list-units-of-measure.query.dto.ts

- **Ruta:** [list-units-of-measure.query.dto.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/dtos/list-units-of-measure.query.dto.ts) (`comercial-jhoel-api/src/modules/units-of-measure/presentation/dtos/list-units-of-measure.query.dto.ts`, 14 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** DTO de consulta: declara `ListUnitsOfMeasureQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts)

#### Clase `ListUnitsOfMeasureQueryDto` (L4–13)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-units-of-measure-presentation-dtos-unit-of-measure-response-dto-ts"></a>

### unit-of-measure.response.dto.ts

- **Ruta:** [unit-of-measure.response.dto.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/dtos/unit-of-measure.response.dto.ts) (`comercial-jhoel-api/src/modules/units-of-measure/presentation/dtos/unit-of-measure.response.dto.ts`, 18 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** DTO de respuesta: declara `UnitOfMeasureResponseDto`, `UnitOfMeasureListResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts)

#### Clase `UnitOfMeasureResponseDto` (L1–13)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `UnitOfMeasureListResponseDto` (L15–17)

- **Herencia / contratos:** extends UnitOfMeasureResponseDto
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-units-of-measure-presentation-dtos-update-unit-of-measure-request-dto-ts"></a>

### update-unit-of-measure.request.dto.ts

- **Ruta:** [update-unit-of-measure.request.dto.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/presentation/dtos/update-unit-of-measure.request.dto.ts) (`comercial-jhoel-api/src/modules/units-of-measure/presentation/dtos/update-unit-of-measure.request.dto.ts`, 33 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** DTO de entrada: declara `UpdateUnitOfMeasureRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts)

#### Clase `UpdateUnitOfMeasureRequestDto` (L10–32)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-units-of-measure-units-of-measure-module-ts"></a>

### units-of-measure.module.ts

- **Ruta:** [units-of-measure.module.ts](../../../../comercial-jhoel-api/src/modules/units-of-measure/units-of-measure.module.ts) (`comercial-jhoel-api/src/modules/units-of-measure/units-of-measure.module.ts`, 31 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `units-of-measure`
- **Responsabilidad:** Módulo: declara `UnitsOfMeasureModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [unit-of-measure.orm-entity.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-unit-of-measure-orm-entity-ts), [typeorm-unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-typeorm-unit-of-measure-repository-ts), [unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts), [create-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-create-unit-of-measure-use-case-ts), [list-units-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-list-units-of-measure-use-case-ts), [get-unit-of-measure-by-id.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-get-unit-of-measure-by-id-use-case-ts), [update-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-update-unit-of-measure-use-case-ts), [deactivate-unit-of-measure.use-case.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-application-use-cases-deactivate-unit-of-measure-use-case-ts), [units-of-measure.controller.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-presentation-controllers-units-of-measure-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts)

#### Clase `UnitsOfMeasureModule` (L13–30)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([UnitOfMeasureOrmEntity])], controllers: [UnitsOfMeasureController], providers: [ { provide: UNIT_OF_MEASURE_REPOSIT`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
