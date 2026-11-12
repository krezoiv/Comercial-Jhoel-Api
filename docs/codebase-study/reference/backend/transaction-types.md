# Módulo backend `transaction-types`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/transaction-types` | [transaction-types.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/controllers/transaction-types.controller.ts#L41) `TransactionTypesController.create` | [CreateTransactionTypeUseCase](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-create-transaction-type-use-case-ts) | `TransactionTypeRepository`.findByActiveName/create | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `TransactionTypeService.createTransactionType` |
| `GET /api/transaction-types` | [transaction-types.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/controllers/transaction-types.controller.ts#L55) `TransactionTypesController.findAll` | [ListTransactionTypesUseCase](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-list-transaction-types-use-case-ts) | `TransactionTypeRepository`.findAll | UseGuards(JwtAuthGuard) | `TransactionTypeService.getTransactionTypes` |
| `GET /api/transaction-types/:id` | [transaction-types.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/controllers/transaction-types.controller.ts#L62) `TransactionTypesController.findOne` | [GetTransactionTypeByIdUseCase](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-get-transaction-type-by-id-use-case-ts) | `TransactionTypeRepository`.findById | UseGuards(JwtAuthGuard) | `TransactionTypeService.getTransactionTypeById` |
| `PATCH /api/transaction-types/:id` | [transaction-types.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/controllers/transaction-types.controller.ts#L69) `TransactionTypesController.update` | [UpdateTransactionTypeUseCase](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-update-transaction-type-use-case-ts) | `TransactionTypeRepository`.findById/findByActiveName/update | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `TransactionTypeService.updateTransactionType` |
| `DELETE /api/transaction-types/:id` | [transaction-types.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/controllers/transaction-types.controller.ts#L83) `TransactionTypesController.deactivate` | [DeactivateTransactionTypeUseCase](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-deactivate-transaction-type-use-case-ts) | `TransactionTypeRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `TransactionTypeService.deleteTransactionType` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [transaction-type-output.ts](#f-comercial-jhoel-api-src-modules-transaction-types-application-dtos-transaction-type-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toTransactionTypeOutput`, `TransactionTypeOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [create-transaction-type.use-case.ts](#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-create-transaction-type-use-case-ts) | .ts | Caso de uso | Aplicación | Default physical-cash effect derived from the bank effect, used when the admin does not pick one explicitly (same mapping the migration `CreateCashControlKardexAndCuts` used to backfill existing types). | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [deactivate-transaction-type.use-case.ts](#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-deactivate-transaction-type-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — DELETE /transaction-types/:id never removes the row (historical bank-deposit operations keep referencing it). | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-transaction-type-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-get-transaction-type-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetTransactionTypeByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-transaction-types.use-case.ts](#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-list-transaction-types-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListTransactionTypesUseCase`, `ListTransactionTypesInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [transaction-type.use-cases.spec.ts](#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-transaction-type-use-cases-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `buildTransactionType` (sin comentario de documentación en el código). | 7 internas | 0 | Soporte (pruebas) |
| [update-transaction-type.use-case.ts](#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-update-transaction-type-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateTransactionTypeUseCase`, `UpdateTransactionTypeInput` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [transaction-type.entity.ts](#f-comercial-jhoel-api-src-modules-transaction-types-domain-entities-transaction-type-entity-ts) | .ts | Entidad de dominio | Dominio | Curated subset of the frontend's shared icon registry — restricting to a known-good list (rather than accepting any string) means a typo or a since-removed icon name can never leave a type card silently blank. | 0 internas | 11 | Alta (11 consumidores) |
| [transaction-type-inactive.error.ts](#f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-inactive-error-ts) | .ts | Errores de dominio | Dominio | Raised when a deposit operation (Transaccionar) is registered against a deactivated tipo de transacción. | 1 internas | 0 | Baja (0 consumidores) |
| [transaction-type-name-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-name-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `TransactionTypeNameAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [transaction-type-not-found.error.ts](#f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `TransactionTypeNotFoundError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [transaction-type.repository.ts](#f-comercial-jhoel-api-src-modules-transaction-types-domain-repositories-transaction-type-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateTransactionTypeData`, `UpdateTransactionTypeData`, `FindTransactionTypesOptions`, `TransactionTypeRepository`, `TRANSACTION_TYPE_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 11 | Alta (11 consumidores) |
| [transaction-type.mapper.ts](#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-transaction-type-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `TransactionTypeMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [transaction-type.orm-entity.ts](#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-transaction-type-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `TransactionTypeOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [typeorm-transaction-type.repository.ts](#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-typeorm-transaction-type-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmTransactionTypeRepository` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [transaction-types.controller.ts](#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts) | .ts | Controlador | Presentación | CRUD is admin-only (create/update/deactivate) — same policy as AccountTypesController/CategoriesController. | 13 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [create-transaction-type.request.dto.ts](#f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-create-transaction-type-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateTransactionTypeRequestDto` (sin comentario de documentación en el código). | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-transaction-types.query.dto.ts](#f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-list-transaction-types-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListTransactionTypesQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [transaction-type.response.dto.ts](#f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-transaction-type-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `TransactionTypeResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [update-transaction-type.request.dto.ts](#f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-update-transaction-type-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateTransactionTypeRequestDto` (sin comentario de documentación en el código). | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [transaction-types.module.ts](#f-comercial-jhoel-api-src-modules-transaction-types-transaction-types-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `TransactionTypesModule` (sin comentario de documentación en el código). | 9 internas; ext.: @nestjs/common, @nestjs/typeorm | 3 | Media (3 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-transaction-types-application-dtos-transaction-type-output-ts"></a>

### transaction-type-output.ts

- **Ruta:** [transaction-type-output.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/dtos/transaction-type-output.ts) (`comercial-jhoel-api/src/modules/transaction-types/application/dtos/transaction-type-output.ts`, 36 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** DTO de salida (aplicación): declara `toTransactionTypeOutput`, `TransactionTypeOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-type.entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-entities-transaction-type-entity-ts)
- **Consumidores:** [create-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-create-transaction-type-use-case-ts), [get-transaction-type-by-id.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-get-transaction-type-by-id-use-case-ts), [list-transaction-types.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-list-transaction-types-use-case-ts), [update-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-update-transaction-type-use-case-ts)

**Interfaces, tipos y enums:**

- `interface TransactionTypeOutput` (L3): sin documentación — miembros: `id`, `name`, `icon`, `balanceEffect`, `cashEffect`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
#### Función `toTransactionTypeOutput` (L18–35)

- **Tipo:** función exportada
- **Firma:** `toTransactionTypeOutput(transactionType: TransactionType): TransactionTypeOutput` — [transaction-type-output.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/dtos/transaction-type-output.ts#L18)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-create-transaction-type-use-case-ts), [get-transaction-type-by-id.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-get-transaction-type-by-id-use-case-ts), [update-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-update-transaction-type-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-create-transaction-type-use-case-ts"></a>

### create-transaction-type.use-case.ts

- **Ruta:** [create-transaction-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/use-cases/create-transaction-type.use-case.ts) (`comercial-jhoel-api/src/modules/transaction-types/application/use-cases/create-transaction-type.use-case.ts`, 72 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Default physical-cash effect derived from the bank effect, used when the admin does not pick one explicitly (same mapping the migration `CreateCashControlKardexAndCuts` used to backfill existing types).
- **Depende de (archivos del proyecto):** [transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-repositories-transaction-type-repository-ts), [transaction-type.entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-entities-transaction-type-entity-ts), [transaction-type-name-already-exists.error.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-name-already-exists-error-ts), [transaction-type-output.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-dtos-transaction-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-type.use-cases.spec.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-transaction-type-use-cases-spec-ts), [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts), [transaction-types.module.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-transaction-types-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateTransactionTypeInput` (L34): sin documentación — miembros: `name`, `icon`, `balanceEffect`, `cashEffect`, `createdBy`

#### Clase `CreateTransactionTypeUseCase` (L42–71)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(TRANSACTION_TYPE_REPOSITORY) transactionTypeRepository: TransactionTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 49–70 | `input: CreateTransactionTypeInput` | `Promise<TransactionTypeOutput>` |

##### `CreateTransactionTypeUseCase.execute`

- **Firma:** `execute(input: CreateTransactionTypeInput): Promise<TransactionTypeOutput>` — [create-transaction-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/use-cases/create-transaction-type.use-case.ts#L49) (L49–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.name.trim().replace`, `input.name.trim`, `this.transactionTypeRepository.findByActiveName`, `new TransactionTypeNameAlreadyExistsError`, `this.transactionTypeRepository.create`, `defaultCashEffect`, `toTransactionTypeOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new TransactionTypeNameAlreadyExistsError(name)`
- **Consumidores:** [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts)

#### Función `defaultCashEffect` (L14–27)

- **Tipo:** función exportada
- **Firma:** `defaultCashEffect(balanceEffect: string \| null \| undefined): TransactionTypeCashEffect` — [create-transaction-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/use-cases/create-transaction-type.use-case.ts#L14)
- **Propósito / descripción:** Default physical-cash effect derived from the bank effect, used when the admin does not pick one explicitly (same mapping the migration `CreateCashControlKardexAndCuts` used to backfill existing types).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-deactivate-transaction-type-use-case-ts"></a>

### deactivate-transaction-type.use-case.ts

- **Ruta:** [deactivate-transaction-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/use-cases/deactivate-transaction-type.use-case.ts) (`comercial-jhoel-api/src/modules/transaction-types/application/use-cases/deactivate-transaction-type.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Soft delete only — DELETE /transaction-types/:id never removes the row (historical bank-deposit operations keep referencing it).
- **Depende de (archivos del proyecto):** [transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-repositories-transaction-type-repository-ts), [transaction-type-not-found.error.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-type.use-cases.spec.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-transaction-type-use-cases-spec-ts), [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts), [transaction-types.module.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-transaction-types-module-ts)

#### Clase `DeactivateTransactionTypeUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — DELETE /transaction-types/:id never removes the row (historical bank-deposit operations keep referencing it).
- **Dependencias inyectadas (constructor):** `@Inject(TRANSACTION_TYPE_REPOSITORY) transactionTypeRepository: TransactionTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<void>` |

##### `DeactivateTransactionTypeUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-transaction-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/use-cases/deactivate-transaction-type.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionTypeRepository.findById`, `new TransactionTypeNotFoundError`, `this.transactionTypeRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new TransactionTypeNotFoundError(id)`
- **Consumidores:** [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-get-transaction-type-by-id-use-case-ts"></a>

### get-transaction-type-by-id.use-case.ts

- **Ruta:** [get-transaction-type-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/use-cases/get-transaction-type-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/transaction-types/application/use-cases/get-transaction-type-by-id.use-case.ts`, 25 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Caso de uso: declara `GetTransactionTypeByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-repositories-transaction-type-repository-ts), [transaction-type-not-found.error.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-not-found-error-ts), [transaction-type-output.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-dtos-transaction-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts), [transaction-types.module.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-transaction-types-module-ts)

#### Clase `GetTransactionTypeByIdUseCase` (L10–24)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(TRANSACTION_TYPE_REPOSITORY) transactionTypeRepository: TransactionTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–23 | `id: string` | `Promise<TransactionTypeOutput>` |

##### `GetTransactionTypeByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<TransactionTypeOutput>` — [get-transaction-type-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/use-cases/get-transaction-type-by-id.use-case.ts#L17) (L17–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionTypeRepository.findById`, `new TransactionTypeNotFoundError`, `toTransactionTypeOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new TransactionTypeNotFoundError(id)`
- **Consumidores:** [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-list-transaction-types-use-case-ts"></a>

### list-transaction-types.use-case.ts

- **Ruta:** [list-transaction-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/use-cases/list-transaction-types.use-case.ts) (`comercial-jhoel-api/src/modules/transaction-types/application/use-cases/list-transaction-types.use-case.ts`, 29 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Caso de uso: declara `ListTransactionTypesUseCase`, `ListTransactionTypesInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-repositories-transaction-type-repository-ts), [transaction-type-output.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-dtos-transaction-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts), [transaction-types.module.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-transaction-types-module-ts)

**Interfaces, tipos y enums:**

- `interface ListTransactionTypesInput` (L9): sin documentación — miembros: `includeInactive`

#### Clase `ListTransactionTypesUseCase` (L13–28)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(TRANSACTION_TYPE_REPOSITORY) transactionTypeRepository: TransactionTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–27 | `input?: ListTransactionTypesInput` | `Promise<TransactionTypeOutput[]>` |

##### `ListTransactionTypesUseCase.execute`

- **Firma:** `execute(input?: ListTransactionTypesInput): Promise<TransactionTypeOutput[]>` — [list-transaction-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/use-cases/list-transaction-types.use-case.ts#L20) (L20–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionTypeRepository.findAll`, `transactionTypes.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-transaction-type-use-cases-spec-ts"></a>

### transaction-type.use-cases.spec.ts

- **Ruta:** [transaction-type.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/use-cases/transaction-type.use-cases.spec.ts) (`comercial-jhoel-api/src/modules/transaction-types/application/use-cases/transaction-type.use-cases.spec.ts`, 164 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Prueba unitaria: declara `buildTransactionType` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [create-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-create-transaction-type-use-case-ts), [update-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-update-transaction-type-use-case-ts), [deactivate-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-deactivate-transaction-type-use-case-ts), [transaction-type-name-already-exists.error.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-name-already-exists-error-ts), [transaction-type-not-found.error.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-not-found-error-ts), [transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-repositories-transaction-type-repository-ts), [transaction-type.entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-entities-transaction-type-entity-ts)
- **Consumidores:** —
#### Función `buildTransactionType` (L12–29)

- **Tipo:** función local del archivo
- **Firma:** `buildTransactionType(overrides?: Partial<{ name: string; icon: string }>): TransactionType` — [transaction-type.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/use-cases/transaction-type.use-cases.spec.ts#L12)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `TransactionType.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-update-transaction-type-use-case-ts"></a>

### update-transaction-type.use-case.ts

- **Ruta:** [update-transaction-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/use-cases/update-transaction-type.use-case.ts) (`comercial-jhoel-api/src/modules/transaction-types/application/use-cases/update-transaction-type.use-case.ts`, 66 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Caso de uso: declara `UpdateTransactionTypeUseCase`, `UpdateTransactionTypeInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-repositories-transaction-type-repository-ts), [transaction-type.entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-entities-transaction-type-entity-ts), [transaction-type-not-found.error.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-not-found-error-ts), [transaction-type-name-already-exists.error.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-name-already-exists-error-ts), [transaction-type-output.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-dtos-transaction-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-type.use-cases.spec.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-transaction-type-use-cases-spec-ts), [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts), [transaction-types.module.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-transaction-types-module-ts)

**Interfaces, tipos y enums:**

- `interface UpdateTransactionTypeInput` (L15): sin documentación — miembros: `name`, `icon`, `balanceEffect`, `cashEffect`, `updatedBy`

#### Clase `UpdateTransactionTypeUseCase` (L23–65)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(TRANSACTION_TYPE_REPOSITORY) transactionTypeRepository: TransactionTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–64 | `id: string`, `input: UpdateTransactionTypeInput` | `Promise<TransactionTypeOutput>` |

##### `UpdateTransactionTypeUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateTransactionTypeInput): Promise<TransactionTypeOutput>` — [update-transaction-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/application/use-cases/update-transaction-type.use-case.ts#L30) (L30–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionTypeRepository.findById`, `new TransactionTypeNotFoundError`, `input.name?.trim().replace`, `input.name?.trim`, `this.transactionTypeRepository.findByActiveName`, `new TransactionTypeNameAlreadyExistsError`, `this.transactionTypeRepository.update`, `toTransactionTypeOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionTypeRepository.update`
- **Errores que lanza:** `new TransactionTypeNotFoundError(id)`, `new TransactionTypeNameAlreadyExistsError(name)`
- **Consumidores:** [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-types-domain-entities-transaction-type-entity-ts"></a>

### transaction-type.entity.ts

- **Ruta:** [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts) (`comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts`, 130 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Curated subset of the frontend's shared icon registry — restricting to a known-good list (rather than accepting any string) means a typo or a since-removed icon name can never leave a type card silently blank.
- **Descripción del autor (comentario del archivo):** Curated subset of the frontend's shared icon registry — restricting to a known-good list (rather than accepting any string) means a typo or a since-removed icon name can never leave a type card silently blank.
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [transaction-type-output.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-dtos-transaction-type-output-ts), [create-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-create-transaction-type-use-case-ts), [transaction-type.use-cases.spec.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-transaction-type-use-cases-spec-ts), [update-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-update-transaction-type-use-case-ts), [transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-repositories-transaction-type-repository-ts), [transaction-type.mapper.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-transaction-type-mapper-ts), [typeorm-transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-typeorm-transaction-type-repository-ts), [create-transaction-type.request.dto.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-create-transaction-type-request-dto-ts), [update-transaction-type.request.dto.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-update-transaction-type-request-dto-ts)

**Interfaces, tipos y enums:**

- `interface TransactionTypeProps` (L57): sin documentación — miembros: `id`, `name`, `icon`, `balanceEffect`, `cashEffect`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `type TransactionTypeIcon` (L23) = `(typeof TRANSACTION_TYPE_ICONS)[number]`
- `type TransactionTypeBalanceEffect` (L40) = `(typeof TRANSACTION_TYPE_BALANCE_EFFECTS)[number]`
- `type TransactionTypeCashEffect` (L54) = `(typeof TRANSACTION_TYPE_CASH_EFFECTS)[number]`

**Constantes exportadas:**

- `TRANSACTION_TYPE_ICONS` (L6): Curated subset of the frontend's shared icon registry — restricting to a known-good list (rather than accepting any string) means a typo or a since-removed icon name can never leave a type card silently blank. = `[ 'bank', 'arrow-down-circle', 'arrow-up-circle', 'arrow-left-right', 'credit-card', 'wallet', 'receipt', 'fil`
- `TRANSACTION_TYPE_BALANCE_EFFECTS` (L32): Efecto de un tipo de transacción sobre el saldo bancario — ver migración `CreateBankAccountMovements`. = `[ 'DEPOSITO', 'RETIRO', 'DESEMBOLSO_GENESIS', 'PAGO_GENESIS', 'REINTEGRO', ] as const`
- `TRANSACTION_TYPE_CASH_EFFECTS` (L52): Explicit classification of a transaction type's effect on the PHYSICAL cash on hand (Control de Efectivo), independent of `balanceEffect` (the bank-account effect). = `['IN', 'OUT', 'NONE'] as const`

#### Clase `TransactionType` (L74–129)

- **Propósito:** "Tipo de Transacción" — the simple catalog Transaccionar's dropdown reads from. Deliberately separate from `banks` (Sistema→Bancos / Agentes Bancarios→Bancos), which is a heavier entity tied to account numbers and Cuadre de Agentes balances.
- **Dependencias inyectadas (constructor):** `props: TransactionTypeProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 77–79 | `props: TransactionTypeProps` | `TransactionType` |
| `id` | getter public | 81–83 | — | `string` |
| `name` | getter public | 85–87 | — | `string` |
| `icon` | getter public | 89–91 | — | `string` |
| `balanceEffect` | getter public | 93–95 | — | `TransactionTypeBalanceEffect \| null` |
| `cashEffect` | getter public | 98–100 | — | `TransactionTypeCashEffect` |
| `isActive` | getter public | 102–104 | — | `boolean` |
| `createdAt` | getter public | 106–108 | — | `Date` |
| `updatedAt` | getter public | 110–112 | — | `Date` |
| `createdBy` | getter public | 114–116 | — | `string` |
| `createdByUsername` | getter public | 118–120 | — | `string` |
| `updatedBy` | getter public | 122–124 | — | `string \| null` |
| `updatedByUsername` | getter public | 126–128 | — | `string \| null` |

##### `TransactionType.create`

- **Firma:** `create(props: TransactionTypeProps): TransactionType` — [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new TransactionType`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [create-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-create-transaction-type-use-case-ts), [transaction-type.use-cases.spec.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-transaction-type-use-cases-spec-ts), [transaction-type.mapper.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-transaction-type-mapper-ts), [typeorm-transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-typeorm-transaction-type-repository-ts)

##### `TransactionType.id`

- **Firma:** `id(): string` — [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionType.name`

- **Firma:** `name(): string` — [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionType.icon`

- **Firma:** `icon(): string` — [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts#L89) (L89–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionType.balanceEffect`

- **Firma:** `balanceEffect(): TransactionTypeBalanceEffect \| null` — [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts#L93) (L93–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionType.cashEffect`

- **Firma:** `cashEffect(): TransactionTypeCashEffect` — [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts#L98) (L98–100)
- **Propósito / descripción:** Effect on physical cash — see `TRANSACTION_TYPE_CASH_EFFECTS`.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionType.isActive`

- **Firma:** `isActive(): boolean` — [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts#L102) (L102–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionType.createdAt`

- **Firma:** `createdAt(): Date` — [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts#L106) (L106–108)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionType.updatedAt`

- **Firma:** `updatedAt(): Date` — [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts#L110) (L110–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionType.createdBy`

- **Firma:** `createdBy(): string` — [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts#L114) (L114–116)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionType.createdByUsername`

- **Firma:** `createdByUsername(): string` — [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts#L118) (L118–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionType.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts#L122) (L122–124)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionType.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [transaction-type.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/entities/transaction-type.entity.ts#L126) (L126–128)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-inactive-error-ts"></a>

### transaction-type-inactive.error.ts

- **Ruta:** [transaction-type-inactive.error.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/errors/transaction-type-inactive.error.ts) (`comercial-jhoel-api/src/modules/transaction-types/domain/errors/transaction-type-inactive.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Raised when a deposit operation (Transaccionar) is registered against a deactivated tipo de transacción.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** —

#### Clase `TransactionTypeInactiveError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Raised when a deposit operation (Transaccionar) is registered against a deactivated tipo de transacción.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-name-already-exists-error-ts"></a>

### transaction-type-name-already-exists.error.ts

- **Ruta:** [transaction-type-name-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/errors/transaction-type-name-already-exists.error.ts) (`comercial-jhoel-api/src/modules/transaction-types/domain/errors/transaction-type-name-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Errores de dominio: declara `TransactionTypeNameAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-create-transaction-type-use-case-ts), [transaction-type.use-cases.spec.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-transaction-type-use-cases-spec-ts), [update-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-update-transaction-type-use-case-ts), [typeorm-transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-typeorm-transaction-type-repository-ts)

#### Clase `TransactionTypeNameAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `name: string`
<a id="f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-not-found-error-ts"></a>

### transaction-type-not-found.error.ts

- **Ruta:** [transaction-type-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/errors/transaction-type-not-found.error.ts) (`comercial-jhoel-api/src/modules/transaction-types/domain/errors/transaction-type-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Errores de dominio: declara `TransactionTypeNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-deactivate-transaction-type-use-case-ts), [get-transaction-type-by-id.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-get-transaction-type-by-id-use-case-ts), [transaction-type.use-cases.spec.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-transaction-type-use-cases-spec-ts), [update-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-update-transaction-type-use-case-ts)

#### Clase `TransactionTypeNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-transaction-types-domain-repositories-transaction-type-repository-ts"></a>

### transaction-type.repository.ts

- **Ruta:** [transaction-type.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/repositories/transaction-type.repository.ts) (`comercial-jhoel-api/src/modules/transaction-types/domain/repositories/transaction-type.repository.ts`, 39 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateTransactionTypeData`, `UpdateTransactionTypeData`, `FindTransactionTypesOptions`, `TransactionTypeRepository`, `TRANSACTION_TYPE_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-type.entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-entities-transaction-type-entity-ts)
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [export-bank-deposits-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-deposits-report-pdf-use-case-ts), [create-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-create-transaction-type-use-case-ts), [deactivate-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-deactivate-transaction-type-use-case-ts), [get-transaction-type-by-id.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-get-transaction-type-by-id-use-case-ts), [list-transaction-types.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-list-transaction-types-use-case-ts), [transaction-type.use-cases.spec.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-transaction-type-use-cases-spec-ts), [update-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-update-transaction-type-use-case-ts), [typeorm-transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-typeorm-transaction-type-repository-ts), [transaction-types.module.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-transaction-types-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateTransactionTypeData` (L11): sin documentación — miembros: `name`, `icon`, `balanceEffect`, `cashEffect`, `createdBy`
- `interface UpdateTransactionTypeData` (L19): sin documentación — miembros: `name`, `icon`, `balanceEffect`, `cashEffect`, `updatedBy`
- `interface FindTransactionTypesOptions` (L27): sin documentación — miembros: `activeOnly`
- `interface TransactionTypeRepository` (L31): sin documentación — miembros: `findAll`, `findById`, `findByActiveName`, `create`, `update`, `deactivate`

**Constantes exportadas:**

- `TRANSACTION_TYPE_REPOSITORY` (L7) = `Symbol( 'TRANSACTION_TYPE_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-transaction-type-mapper-ts"></a>

### transaction-type.mapper.ts

- **Ruta:** [transaction-type.mapper.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/transaction-type.mapper.ts) (`comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/transaction-type.mapper.ts`, 27 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Mapper: declara `TransactionTypeMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-type.entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-entities-transaction-type-entity-ts), [transaction-type.orm-entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-transaction-type-orm-entity-ts)
- **Consumidores:** [typeorm-transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-typeorm-transaction-type-repository-ts)

#### Clase `TransactionTypeMapper` (L8–26)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 9–25 | `orm: TransactionTypeOrmEntity` | `TransactionType` |

##### `TransactionTypeMapper.toDomain`

- **Firma:** `toDomain(orm: TransactionTypeOrmEntity): TransactionType` — [transaction-type.mapper.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/transaction-type.mapper.ts#L9) (L9–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `TransactionType.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-typeorm-transaction-type-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-transaction-type-orm-entity-ts"></a>

### transaction-type.orm-entity.ts

- **Ruta:** [transaction-type.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/transaction-type.orm-entity.ts) (`comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/transaction-type.orm-entity.ts`, 65 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `TransactionTypeOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [bank-deposit-operation.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts), [transaction-type.mapper.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-transaction-type-mapper-ts), [typeorm-transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-typeorm-transaction-type-repository-ts), [transaction-types.module.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-transaction-types-module-ts)

#### Clase `TransactionTypeOrmEntity` (L15–64)

- **Decoradores:** `@Entity('transaction_types')` `@Index('UQ_transaction_types_name_active', ['name'], { unique: true, where: '"is_active" = true', })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column icon: string`, `@Column balanceEffect: string \| null`, `@Column cashEffect: string`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-typeorm-transaction-type-repository-ts"></a>

### typeorm-transaction-type.repository.ts

- **Ruta:** [typeorm-transaction-type.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/typeorm-transaction-type.repository.ts) (`comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/typeorm-transaction-type.repository.ts`, 94 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmTransactionTypeRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-type.entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-entities-transaction-type-entity-ts), [transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-repositories-transaction-type-repository-ts), [transaction-type-name-already-exists.error.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-errors-transaction-type-name-already-exists-error-ts), [transaction-type.orm-entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-transaction-type-orm-entity-ts), [transaction-type.mapper.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-transaction-type-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [transaction-types.module.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-transaction-types-module-ts)

#### Clase `TypeOrmTransactionTypeRepository` (L15–93)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements TransactionTypeRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(TransactionTypeOrmEntity) repository: Repository<TransactionTypeOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 22–30 | `options: FindTransactionTypesOptions` | `Promise<TransactionType[]>` |
| `findById` | método public async | 32–35 | `id: string` | `Promise<TransactionType \| null>` |
| `findByActiveName` | método public async | 37–42 | `name: string` | `Promise<TransactionType \| null>` |
| `create` | método public async | 44–61 | `data: CreateTransactionTypeData` | `Promise<TransactionType>` |
| `update` | método public async | 63–75 | `id: string`, `data: UpdateTransactionTypeData` | `Promise<TransactionType>` |
| `deactivate` | método public async | 77–79 | `id: string` | `Promise<void>` |
| `translateUniqueViolation` | método private | 82–92 | `error: unknown`, `name: string` | `unknown` |

##### `TypeOrmTransactionTypeRepository.findAll`

- **Firma:** `findAll(options: FindTransactionTypesOptions): Promise<TransactionType[]>` — [typeorm-transaction-type.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/typeorm-transaction-type.repository.ts#L22) (L22–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `TransactionTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionTypeRepository.findById`

- **Firma:** `findById(id: string): Promise<TransactionType \| null>` — [typeorm-transaction-type.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/typeorm-transaction-type.repository.ts#L32) (L32–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `TransactionTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionTypeRepository.findByActiveName`

- **Firma:** `findByActiveName(name: string): Promise<TransactionType \| null>` — [typeorm-transaction-type.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/typeorm-transaction-type.repository.ts#L37) (L37–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `TransactionTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionTypeRepository.create`

- **Firma:** `create(data: CreateTransactionTypeData): Promise<TransactionType>` — [typeorm-transaction-type.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/typeorm-transaction-type.repository.ts#L44) (L44–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `TransactionTypeMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionTypeRepository.update`

- **Firma:** `update(id: string, data: UpdateTransactionTypeData): Promise<TransactionType>` — [typeorm-transaction-type.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/typeorm-transaction-type.repository.ts#L63) (L63–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `TransactionTypeMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name ?? '')`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionTypeRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-transaction-type.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/typeorm-transaction-type.repository.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionTypeRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, name: string): unknown` — [typeorm-transaction-type.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/infrastructure/persistence/typeorm-transaction-type.repository.ts#L82) (L82–92)
- **Propósito / descripción:** Safety net for the create/update race the use case's own pre-check can't close — see `TypeOrmCategoryRepository.translateUniqueViolation`'s own doc comment.
- **Dependencias (llamadas en su cuerpo):** `new TransactionTypeNameAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts"></a>

### transaction-types.controller.ts

- **Ruta:** [transaction-types.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/controllers/transaction-types.controller.ts) (`comercial-jhoel-api/src/modules/transaction-types/presentation/controllers/transaction-types.controller.ts`, 91 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** CRUD is admin-only (create/update/deactivate) — same policy as AccountTypesController/CategoriesController.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-create-transaction-type-use-case-ts), [list-transaction-types.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-list-transaction-types-use-case-ts), [get-transaction-type-by-id.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-get-transaction-type-by-id-use-case-ts), [update-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-update-transaction-type-use-case-ts), [deactivate-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-deactivate-transaction-type-use-case-ts), [create-transaction-type.request.dto.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-create-transaction-type-request-dto-ts), [update-transaction-type.request.dto.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-update-transaction-type-request-dto-ts), [list-transaction-types.query.dto.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-list-transaction-types-query-dto-ts), [transaction-type.response.dto.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-transaction-type-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-types.module.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-transaction-types-module-ts)

#### Clase `TransactionTypesController` (L30–90)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('transaction-types')`
- **Propósito:** CRUD is admin-only (create/update/deactivate) — same policy as AccountTypesController/CategoriesController. A USER can still read the list (needed for the Transaccionar form's tipo de transacción dropdown).
- **Dependencias inyectadas (constructor):** `createTransactionTypeUseCase: CreateTransactionTypeUseCase`, `listTransactionTypesUseCase: ListTransactionTypesUseCase`, `getTransactionTypeByIdUseCase: GetTransactionTypeByIdUseCase`, `updateTransactionTypeUseCase: UpdateTransactionTypeUseCase`, `deactivateTransactionTypeUseCase: DeactivateTransactionTypeUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 41–53 | `dto: CreateTransactionTypeRequestDto`, `userId: string` | `Promise<TransactionTypeResponseDto>` |
| `findAll` | método public | 55–60 | `query: ListTransactionTypesQueryDto` | `Promise<TransactionTypeResponseDto[]>` |
| `findOne` | método public | 62–67 | `id: string` | `Promise<TransactionTypeResponseDto>` |
| `update` | método public | 69–81 | `id: string`, `dto: UpdateTransactionTypeRequestDto`, `userId: string` | `Promise<TransactionTypeResponseDto>` |
| `deactivate` | método public | 83–89 | `id: string` | `Promise<void>` |

##### `TransactionTypesController.create`

- **Firma:** `create(dto: CreateTransactionTypeRequestDto, userId: string): Promise<TransactionTypeResponseDto>` — [transaction-types.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/controllers/transaction-types.controller.ts#L41) (L41–53)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createTransactionTypeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionTypesController.findAll`

- **Firma:** `findAll(query: ListTransactionTypesQueryDto): Promise<TransactionTypeResponseDto[]>` — [transaction-types.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/controllers/transaction-types.controller.ts#L55) (L55–60)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listTransactionTypesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionTypesController.findOne`

- **Firma:** `findOne(id: string): Promise<TransactionTypeResponseDto>` — [transaction-types.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/controllers/transaction-types.controller.ts#L62) (L62–67)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getTransactionTypeByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionTypesController.update`

- **Firma:** `update(id: string, dto: UpdateTransactionTypeRequestDto, userId: string): Promise<TransactionTypeResponseDto>` — [transaction-types.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/controllers/transaction-types.controller.ts#L69) (L69–81)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateTransactionTypeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionTypesController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [transaction-types.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/controllers/transaction-types.controller.ts#L83) (L83–89)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateTransactionTypeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-create-transaction-type-request-dto-ts"></a>

### create-transaction-type.request.dto.ts

- **Ruta:** [create-transaction-type.request.dto.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/dtos/create-transaction-type.request.dto.ts) (`comercial-jhoel-api/src/modules/transaction-types/presentation/dtos/create-transaction-type.request.dto.ts`, 35 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** DTO de entrada: declara `CreateTransactionTypeRequestDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-type.entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-entities-transaction-type-entity-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts)

#### Clase `CreateTransactionTypeRequestDto` (L15–34)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-list-transaction-types-query-dto-ts"></a>

### list-transaction-types.query.dto.ts

- **Ruta:** [list-transaction-types.query.dto.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/dtos/list-transaction-types.query.dto.ts) (`comercial-jhoel-api/src/modules/transaction-types/presentation/dtos/list-transaction-types.query.dto.ts`, 10 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** DTO de consulta: declara `ListTransactionTypesQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts)

#### Clase `ListTransactionTypesQueryDto` (L4–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-transaction-type-response-dto-ts"></a>

### transaction-type.response.dto.ts

- **Ruta:** [transaction-type.response.dto.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/dtos/transaction-type.response.dto.ts) (`comercial-jhoel-api/src/modules/transaction-types/presentation/dtos/transaction-type.response.dto.ts`, 15 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** DTO de respuesta: declara `TransactionTypeResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts)

#### Clase `TransactionTypeResponseDto` (L1–14)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-transaction-types-presentation-dtos-update-transaction-type-request-dto-ts"></a>

### update-transaction-type.request.dto.ts

- **Ruta:** [update-transaction-type.request.dto.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/presentation/dtos/update-transaction-type.request.dto.ts) (`comercial-jhoel-api/src/modules/transaction-types/presentation/dtos/update-transaction-type.request.dto.ts`, 37 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** DTO de entrada: declara `UpdateTransactionTypeRequestDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-type.entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-entities-transaction-type-entity-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts)

#### Clase `UpdateTransactionTypeRequestDto` (L15–36)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-transaction-types-transaction-types-module-ts"></a>

### transaction-types.module.ts

- **Ruta:** [transaction-types.module.ts](../../../../comercial-jhoel-api/src/modules/transaction-types/transaction-types.module.ts) (`comercial-jhoel-api/src/modules/transaction-types/transaction-types.module.ts`, 32 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `transaction-types`
- **Responsabilidad:** Módulo: declara `TransactionTypesModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-type.orm-entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-transaction-type-orm-entity-ts), [typeorm-transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-typeorm-transaction-type-repository-ts), [transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-repositories-transaction-type-repository-ts), [create-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-create-transaction-type-use-case-ts), [list-transaction-types.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-list-transaction-types-use-case-ts), [get-transaction-type-by-id.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-get-transaction-type-by-id-use-case-ts), [update-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-update-transaction-type-use-case-ts), [deactivate-transaction-type.use-case.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-application-use-cases-deactivate-transaction-type-use-case-ts), [transaction-types.controller.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-presentation-controllers-transaction-types-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `TransactionTypesModule` (L13–31)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([TransactionTypeOrmEntity])], controllers: [TransactionTypesController], providers: [ { provide: TRANSACTION_TYPE_RE`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
