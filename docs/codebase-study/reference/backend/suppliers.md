# Módulo backend `suppliers`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/suppliers` | [suppliers.controller.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/controllers/suppliers.controller.ts#L46) `SuppliersController.create` | [CreateSupplierUseCase](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-create-supplier-use-case-ts) | `SupplierRepository`.findActiveByTaxId/create | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `SupplierService.createSupplier` |
| `GET /api/suppliers` | [suppliers.controller.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/controllers/suppliers.controller.ts#L54) `SuppliersController.findAll` | [ListSuppliersUseCase](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-list-suppliers-use-case-ts) | `SupplierRepository`.findAll | UseGuards(JwtAuthGuard) | `SupplierService.getSuppliers` |
| `GET /api/suppliers/:id` | [suppliers.controller.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/controllers/suppliers.controller.ts#L64) `SuppliersController.findOne` | [GetSupplierByIdUseCase](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-get-supplier-by-id-use-case-ts) | `SupplierRepository`.findById | UseGuards(JwtAuthGuard) | `SupplierService.getSupplierById` |
| `PATCH /api/suppliers/:id` | [suppliers.controller.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/controllers/suppliers.controller.ts#L71) `SuppliersController.update` | [UpdateSupplierUseCase](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-update-supplier-use-case-ts) | `SupplierRepository`.findById/findActiveByTaxId/update | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `SupplierService.updateSupplier` |
| `DELETE /api/suppliers/:id` | [suppliers.controller.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/controllers/suppliers.controller.ts#L81) `SuppliersController.deactivate` | [DeactivateSupplierUseCase](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-deactivate-supplier-use-case-ts) | `SupplierRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `SupplierService.deleteSupplier` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [supplier-output.ts](#f-comercial-jhoel-api-src-modules-suppliers-application-dtos-supplier-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Plain, serializable shape use cases return — never the domain entity itself. | 1 internas | 4 | Media (4 consumidores) |
| [create-supplier.use-case.ts](#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-create-supplier-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateSupplierUseCase`, `CreateSupplierInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-supplier.use-case.ts](#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-deactivate-supplier-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — a supplier is never physically removed, and a deactivated one still fully backs every purchase that already references it (the FK is RESTRICT, but that never fires since this never deletes the row). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-supplier-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-get-supplier-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetSupplierByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-suppliers.use-case.ts](#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-list-suppliers-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListSuppliersUseCase`, `ListSuppliersInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-supplier.use-case.ts](#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-update-supplier-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateSupplierUseCase`, `UpdateSupplierInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [supplier.entity.ts](#f-comercial-jhoel-api-src-modules-suppliers-domain-entities-supplier-entity-ts) | .ts | Entidad de dominio | Dominio | Entidad de dominio: declara `Supplier`, `SupplierProps` (sin comentario de documentación en el código). | 0 internas | 4 | Media (4 consumidores) |
| [supplier-not-found.error.ts](#f-comercial-jhoel-api-src-modules-suppliers-domain-errors-supplier-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SupplierNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [supplier-tax-id-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-suppliers-domain-errors-supplier-tax-id-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SupplierTaxIdAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [supplier.repository.ts](#f-comercial-jhoel-api-src-modules-suppliers-domain-repositories-supplier-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateSupplierData`, `UpdateSupplierData`, `FindSuppliersOptions`, `SupplierRepository`, `SUPPLIER_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 10 | Alta (10 consumidores) |
| [supplier.mapper.ts](#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-supplier-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `SupplierMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [supplier.orm-entity.ts](#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-supplier-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `SupplierOrmEntity` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 5 | Media (5 consumidores) |
| [typeorm-supplier.repository.ts](#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-typeorm-supplier-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmSupplierRepository` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [suppliers.controller.ts](#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts) | .ts | Controlador | Presentación | Same CRUD/guard shape as `CategoriesController` (see that class's own doc comment), with one deliberate difference: `name` is NOT unique here — only `taxId` is, and only when present, since a real supplier record legitimately may not have one yet. | 12 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [create-supplier.request.dto.ts](#f-comercial-jhoel-api-src-modules-suppliers-presentation-dtos-create-supplier-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateSupplierRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-suppliers.query.dto.ts](#f-comercial-jhoel-api-src-modules-suppliers-presentation-dtos-list-suppliers-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListSuppliersQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [supplier.response.dto.ts](#f-comercial-jhoel-api-src-modules-suppliers-presentation-dtos-supplier-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `SupplierResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [update-supplier.request.dto.ts](#f-comercial-jhoel-api-src-modules-suppliers-presentation-dtos-update-supplier-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateSupplierRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [suppliers.module.ts](#f-comercial-jhoel-api-src-modules-suppliers-suppliers-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `SuppliersModule` (sin comentario de documentación en el código). | 9 internas; ext.: @nestjs/common, @nestjs/typeorm | 3 | Media (3 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-suppliers-application-dtos-supplier-output-ts"></a>

### supplier-output.ts

- **Ruta:** [supplier-output.ts](../../../../comercial-jhoel-api/src/modules/suppliers/application/dtos/supplier-output.ts) (`comercial-jhoel-api/src/modules/suppliers/application/dtos/supplier-output.ts`, 29 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Plain, serializable shape use cases return — never the domain entity itself.
- **Depende de (archivos del proyecto):** [supplier.entity.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-entities-supplier-entity-ts)
- **Consumidores:** [create-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-create-supplier-use-case-ts), [get-supplier-by-id.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-get-supplier-by-id-use-case-ts), [list-suppliers.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-list-suppliers-use-case-ts), [update-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-update-supplier-use-case-ts)

**Interfaces, tipos y enums:**

- `interface SupplierOutput` (L4): Plain, serializable shape use cases return — never the domain entity itself. — miembros: `id`, `name`, `phone`, `email`, `address`, `taxId`, `isActive`, `createdAt`, `updatedAt`
#### Función `toSupplierOutput` (L16–28)

- **Tipo:** función exportada
- **Firma:** `toSupplierOutput(supplier: Supplier): SupplierOutput` — [supplier-output.ts](../../../../comercial-jhoel-api/src/modules/suppliers/application/dtos/supplier-output.ts#L16)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-create-supplier-use-case-ts), [get-supplier-by-id.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-get-supplier-by-id-use-case-ts), [update-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-update-supplier-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-create-supplier-use-case-ts"></a>

### create-supplier.use-case.ts

- **Ruta:** [create-supplier.use-case.ts](../../../../comercial-jhoel-api/src/modules/suppliers/application/use-cases/create-supplier.use-case.ts) (`comercial-jhoel-api/src/modules/suppliers/application/use-cases/create-supplier.use-case.ts`, 43 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Caso de uso: declara `CreateSupplierUseCase`, `CreateSupplierInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-repositories-supplier-repository-ts), [supplier-tax-id-already-exists.error.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-errors-supplier-tax-id-already-exists-error-ts), [supplier-output.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-dtos-supplier-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts), [suppliers.module.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-suppliers-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateSupplierInput` (L7): sin documentación — miembros: `name`, `phone`, `email`, `address`, `taxId`

#### Clase `CreateSupplierUseCase` (L15–42)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SUPPLIER_REPOSITORY) supplierRepository: SupplierRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 22–41 | `input: CreateSupplierInput` | `Promise<SupplierOutput>` |

##### `CreateSupplierUseCase.execute`

- **Firma:** `execute(input: CreateSupplierInput): Promise<SupplierOutput>` — [create-supplier.use-case.ts](../../../../comercial-jhoel-api/src/modules/suppliers/application/use-cases/create-supplier.use-case.ts#L22) (L22–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.name.trim().replace`, `input.name.trim`, `input.taxId?.trim`, `this.supplierRepository.findActiveByTaxId`, `new SupplierTaxIdAlreadyExistsError`, `this.supplierRepository.create`, `input.phone?.trim`, `input.email?.trim().toLowerCase`, `input.email?.trim`, `input.address?.trim`, `toSupplierOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SupplierTaxIdAlreadyExistsError(taxId)`
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-deactivate-supplier-use-case-ts"></a>

### deactivate-supplier.use-case.ts

- **Ruta:** [deactivate-supplier.use-case.ts](../../../../comercial-jhoel-api/src/modules/suppliers/application/use-cases/deactivate-supplier.use-case.ts) (`comercial-jhoel-api/src/modules/suppliers/application/use-cases/deactivate-supplier.use-case.ts`, 29 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Soft delete only — a supplier is never physically removed, and a deactivated one still fully backs every purchase that already references it (the FK is RESTRICT, but that never fires since this never deletes the row).
- **Depende de (archivos del proyecto):** [supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-repositories-supplier-repository-ts), [supplier-not-found.error.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-errors-supplier-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts), [suppliers.module.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-suppliers-module-ts)

#### Clase `DeactivateSupplierUseCase` (L14–28)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — a supplier is never physically removed, and a deactivated one still fully backs every purchase that already references it (the FK is RESTRICT, but that never fires since this never deletes the row). Deactivating it only blocks *new* purchases from selecting it — `CreatePurchaseUseCase`/`confirm_purchase` validate `is_active` the same way product/category/business creation already does.
- **Dependencias inyectadas (constructor):** `@Inject(SUPPLIER_REPOSITORY) supplierRepository: SupplierRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 21–27 | `id: string` | `Promise<void>` |

##### `DeactivateSupplierUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-supplier.use-case.ts](../../../../comercial-jhoel-api/src/modules/suppliers/application/use-cases/deactivate-supplier.use-case.ts#L21) (L21–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.supplierRepository.findById`, `new SupplierNotFoundError`, `this.supplierRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SupplierNotFoundError(id)`
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-get-supplier-by-id-use-case-ts"></a>

### get-supplier-by-id.use-case.ts

- **Ruta:** [get-supplier-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/suppliers/application/use-cases/get-supplier-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/suppliers/application/use-cases/get-supplier-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Caso de uso: declara `GetSupplierByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-repositories-supplier-repository-ts), [supplier-not-found.error.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-errors-supplier-not-found-error-ts), [supplier-output.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-dtos-supplier-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts), [suppliers.module.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-suppliers-module-ts)

#### Clase `GetSupplierByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SUPPLIER_REPOSITORY) supplierRepository: SupplierRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<SupplierOutput>` |

##### `GetSupplierByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<SupplierOutput>` — [get-supplier-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/suppliers/application/use-cases/get-supplier-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.supplierRepository.findById`, `new SupplierNotFoundError`, `toSupplierOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SupplierNotFoundError(id)`
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-list-suppliers-use-case-ts"></a>

### list-suppliers.use-case.ts

- **Ruta:** [list-suppliers.use-case.ts](../../../../comercial-jhoel-api/src/modules/suppliers/application/use-cases/list-suppliers.use-case.ts) (`comercial-jhoel-api/src/modules/suppliers/application/use-cases/list-suppliers.use-case.ts`, 26 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Caso de uso: declara `ListSuppliersUseCase`, `ListSuppliersInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-repositories-supplier-repository-ts), [supplier-output.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-dtos-supplier-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts), [suppliers.module.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-suppliers-module-ts)

**Interfaces, tipos y enums:**

- `interface ListSuppliersInput` (L6): sin documentación — miembros: `activeOnly`, `search`

#### Clase `ListSuppliersUseCase` (L11–25)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SUPPLIER_REPOSITORY) supplierRepository: SupplierRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 18–24 | `input?: ListSuppliersInput` | `Promise<SupplierOutput[]>` |

##### `ListSuppliersUseCase.execute`

- **Firma:** `execute(input?: ListSuppliersInput): Promise<SupplierOutput[]>` — [list-suppliers.use-case.ts](../../../../comercial-jhoel-api/src/modules/suppliers/application/use-cases/list-suppliers.use-case.ts#L18) (L18–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.supplierRepository.findAll`, `input.search?.trim`, `suppliers.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-update-supplier-use-case-ts"></a>

### update-supplier.use-case.ts

- **Ruta:** [update-supplier.use-case.ts](../../../../comercial-jhoel-api/src/modules/suppliers/application/use-cases/update-supplier.use-case.ts) (`comercial-jhoel-api/src/modules/suppliers/application/use-cases/update-supplier.use-case.ts`, 59 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Caso de uso: declara `UpdateSupplierUseCase`, `UpdateSupplierInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-repositories-supplier-repository-ts), [supplier-not-found.error.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-errors-supplier-not-found-error-ts), [supplier-tax-id-already-exists.error.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-errors-supplier-tax-id-already-exists-error-ts), [supplier-output.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-dtos-supplier-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts), [suppliers.module.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-suppliers-module-ts)

**Interfaces, tipos y enums:**

- `interface UpdateSupplierInput` (L8): sin documentación — miembros: `name`, `phone`, `email`, `address`, `taxId`

#### Clase `UpdateSupplierUseCase` (L16–58)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SUPPLIER_REPOSITORY) supplierRepository: SupplierRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 23–57 | `id: string`, `input: UpdateSupplierInput` | `Promise<SupplierOutput>` |

##### `UpdateSupplierUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateSupplierInput): Promise<SupplierOutput>` — [update-supplier.use-case.ts](../../../../comercial-jhoel-api/src/modules/suppliers/application/use-cases/update-supplier.use-case.ts#L23) (L23–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.supplierRepository.findById`, `new SupplierNotFoundError`, `input.name?.trim().replace`, `input.name?.trim`, `input.taxId?.trim`, `this.supplierRepository.findActiveByTaxId`, `new SupplierTaxIdAlreadyExistsError`, `this.supplierRepository.update`, `input.phone?.trim`, `input.email?.trim().toLowerCase`, `input.email?.trim`, `input.address?.trim`, `toSupplierOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.supplierRepository.update`
- **Errores que lanza:** `new SupplierNotFoundError(id)`, `new SupplierTaxIdAlreadyExistsError(taxId)`
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-suppliers-domain-entities-supplier-entity-ts"></a>

### supplier.entity.ts

- **Ruta:** [supplier.entity.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/entities/supplier.entity.ts) (`comercial-jhoel-api/src/modules/suppliers/domain/entities/supplier.entity.ts`, 56 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Entidad de dominio: declara `Supplier`, `SupplierProps` (sin comentario de documentación en el código).
- **Consumidores:** [supplier-output.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-dtos-supplier-output-ts), [supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-repositories-supplier-repository-ts), [supplier.mapper.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-supplier-mapper-ts), [typeorm-supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-typeorm-supplier-repository-ts)

**Interfaces, tipos y enums:**

- `interface SupplierProps` (L1): sin documentación — miembros: `id`, `name`, `phone`, `email`, `address`, `taxId`, `isActive`, `createdAt`, `updatedAt`

#### Clase `Supplier` (L13–55)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: SupplierProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 16–18 | `props: SupplierProps` | `Supplier` |
| `id` | getter public | 20–22 | — | `string` |
| `name` | getter public | 24–26 | — | `string` |
| `phone` | getter public | 28–30 | — | `string \| null` |
| `email` | getter public | 32–34 | — | `string \| null` |
| `address` | getter public | 36–38 | — | `string \| null` |
| `taxId` | getter public | 40–42 | — | `string \| null` |
| `isActive` | getter public | 44–46 | — | `boolean` |
| `createdAt` | getter public | 48–50 | — | `Date` |
| `updatedAt` | getter public | 52–54 | — | `Date` |

##### `Supplier.create`

- **Firma:** `create(props: SupplierProps): Supplier` — [supplier.entity.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/entities/supplier.entity.ts#L16) (L16–18)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Supplier`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [supplier.mapper.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-supplier-mapper-ts), [typeorm-supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-typeorm-supplier-repository-ts)

##### `Supplier.id`

- **Firma:** `id(): string` — [supplier.entity.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/entities/supplier.entity.ts#L20) (L20–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Supplier.name`

- **Firma:** `name(): string` — [supplier.entity.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/entities/supplier.entity.ts#L24) (L24–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Supplier.phone`

- **Firma:** `phone(): string \| null` — [supplier.entity.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/entities/supplier.entity.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Supplier.email`

- **Firma:** `email(): string \| null` — [supplier.entity.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/entities/supplier.entity.ts#L32) (L32–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Supplier.address`

- **Firma:** `address(): string \| null` — [supplier.entity.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/entities/supplier.entity.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Supplier.taxId`

- **Firma:** `taxId(): string \| null` — [supplier.entity.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/entities/supplier.entity.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Supplier.isActive`

- **Firma:** `isActive(): boolean` — [supplier.entity.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/entities/supplier.entity.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Supplier.createdAt`

- **Firma:** `createdAt(): Date` — [supplier.entity.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/entities/supplier.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Supplier.updatedAt`

- **Firma:** `updatedAt(): Date` — [supplier.entity.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/entities/supplier.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-suppliers-domain-errors-supplier-not-found-error-ts"></a>

### supplier-not-found.error.ts

- **Ruta:** [supplier-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/errors/supplier-not-found.error.ts) (`comercial-jhoel-api/src/modules/suppliers/domain/errors/supplier-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Errores de dominio: declara `SupplierNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-deactivate-supplier-use-case-ts), [get-supplier-by-id.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-get-supplier-by-id-use-case-ts), [update-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-update-supplier-use-case-ts)

#### Clase `SupplierNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-suppliers-domain-errors-supplier-tax-id-already-exists-error-ts"></a>

### supplier-tax-id-already-exists.error.ts

- **Ruta:** [supplier-tax-id-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/errors/supplier-tax-id-already-exists.error.ts) (`comercial-jhoel-api/src/modules/suppliers/domain/errors/supplier-tax-id-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Errores de dominio: declara `SupplierTaxIdAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-create-supplier-use-case-ts), [update-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-update-supplier-use-case-ts), [typeorm-supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-typeorm-supplier-repository-ts)

#### Clase `SupplierTaxIdAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `taxId: string`
<a id="f-comercial-jhoel-api-src-modules-suppliers-domain-repositories-supplier-repository-ts"></a>

### supplier.repository.ts

- **Ruta:** [supplier.repository.ts](../../../../comercial-jhoel-api/src/modules/suppliers/domain/repositories/supplier.repository.ts) (`comercial-jhoel-api/src/modules/suppliers/domain/repositories/supplier.repository.ts`, 36 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateSupplierData`, `UpdateSupplierData`, `FindSuppliersOptions`, `SupplierRepository`, `SUPPLIER_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [supplier.entity.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-entities-supplier-entity-ts)
- **Consumidores:** [get-purchase-pdf.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-pdf-use-case-ts), [import-purchase-from-excel.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [create-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-create-supplier-use-case-ts), [deactivate-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-deactivate-supplier-use-case-ts), [get-supplier-by-id.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-get-supplier-by-id-use-case-ts), [list-suppliers.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-list-suppliers-use-case-ts), [update-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-update-supplier-use-case-ts), [typeorm-supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-typeorm-supplier-repository-ts), [suppliers.module.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-suppliers-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateSupplierData` (L5): sin documentación — miembros: `name`, `phone`, `email`, `address`, `taxId`
- `interface UpdateSupplierData` (L13): sin documentación — miembros: `name`, `phone`, `email`, `address`, `taxId`
- `interface FindSuppliersOptions` (L21): sin documentación — miembros: `activeOnly`, `search`
- `interface SupplierRepository` (L27): sin documentación — miembros: `findAll`, `findById`, `findActiveByTaxId`, `create`, `update`, `deactivate`

**Constantes exportadas:**

- `SUPPLIER_REPOSITORY` (L3) = `Symbol('SUPPLIER_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-supplier-mapper-ts"></a>

### supplier.mapper.ts

- **Ruta:** [supplier.mapper.ts](../../../../comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/supplier.mapper.ts) (`comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/supplier.mapper.ts`, 19 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Mapper: declara `SupplierMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [supplier.entity.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-entities-supplier-entity-ts), [supplier.orm-entity.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-supplier-orm-entity-ts)
- **Consumidores:** [typeorm-supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-typeorm-supplier-repository-ts)

#### Clase `SupplierMapper` (L4–18)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–17 | `orm: SupplierOrmEntity` | `Supplier` |

##### `SupplierMapper.toDomain`

- **Firma:** `toDomain(orm: SupplierOrmEntity): Supplier` — [supplier.mapper.ts](../../../../comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/supplier.mapper.ts#L5) (L5–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Supplier.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-typeorm-supplier-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-supplier-orm-entity-ts"></a>

### supplier.orm-entity.ts

- **Ruta:** [supplier.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/supplier.orm-entity.ts) (`comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/supplier.orm-entity.ts`, 45 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `SupplierOrmEntity` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** [ice-cream-purchase.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-orm-entity-ts), [purchase.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-orm-entity-ts), [supplier.mapper.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-supplier-mapper-ts), [typeorm-supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-typeorm-supplier-repository-ts), [suppliers.module.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-suppliers-module-ts)

#### Clase `SupplierOrmEntity` (L12–44)

- **Decoradores:** `@Entity('suppliers')` `@Index('UQ_suppliers_tax_id_active', ['taxId'], { unique: true, where: '"is_active" = true', })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column phone: string \| null`, `@Column email: string \| null`, `@Column address: string \| null`, `@Column taxId: string \| null`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-typeorm-supplier-repository-ts"></a>

### typeorm-supplier.repository.ts

- **Ruta:** [typeorm-supplier.repository.ts](../../../../comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/typeorm-supplier.repository.ts) (`comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/typeorm-supplier.repository.ts`, 99 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmSupplierRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [supplier.entity.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-entities-supplier-entity-ts), [supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-repositories-supplier-repository-ts), [supplier-tax-id-already-exists.error.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-errors-supplier-tax-id-already-exists-error-ts), [supplier.orm-entity.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-supplier-orm-entity-ts), [supplier.mapper.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-supplier-mapper-ts), [apply-search-terms.util.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-apply-search-terms-util-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [suppliers.module.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-suppliers-module-ts)

#### Clase `TypeOrmSupplierRepository` (L16–98)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements SupplierRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(SupplierOrmEntity) repository: Repository<SupplierOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 23–40 | `options?: FindSuppliersOptions` | `Promise<Supplier[]>` |
| `findById` | método public async | 42–45 | `id: string` | `Promise<Supplier \| null>` |
| `findActiveByTaxId` | método public async | 47–52 | `taxId: string` | `Promise<Supplier \| null>` |
| `create` | método public async | 54–62 | `data: CreateSupplierData` | `Promise<Supplier>` |
| `update` | método public async | 64–72 | `id: string`, `data: UpdateSupplierData` | `Promise<Supplier>` |
| `deactivate` | método public async | 74–76 | `id: string` | `Promise<void>` |
| `translateUniqueViolation` | método private | 84–97 | `error: unknown`, `taxId?: string \| null` | `unknown` |

##### `TypeOrmSupplierRepository.findAll`

- **Firma:** `findAll(options?: FindSuppliersOptions): Promise<Supplier[]>` — [typeorm-supplier.repository.ts](../../../../comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/typeorm-supplier.repository.ts#L23) (L23–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder`, `qb.andWhere`, `applySearchTerms`, `qb.orderBy`, `qb.getMany`, `orms.map`, `SupplierMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSupplierRepository.findById`

- **Firma:** `findById(id: string): Promise<Supplier \| null>` — [typeorm-supplier.repository.ts](../../../../comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/typeorm-supplier.repository.ts#L42) (L42–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `SupplierMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSupplierRepository.findActiveByTaxId`

- **Firma:** `findActiveByTaxId(taxId: string): Promise<Supplier \| null>` — [typeorm-supplier.repository.ts](../../../../comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/typeorm-supplier.repository.ts#L47) (L47–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `SupplierMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSupplierRepository.create`

- **Firma:** `create(data: CreateSupplierData): Promise<Supplier>` — [typeorm-supplier.repository.ts](../../../../comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/typeorm-supplier.repository.ts#L54) (L54–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `SupplierMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data.taxId)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSupplierRepository.update`

- **Firma:** `update(id: string, data: UpdateSupplierData): Promise<Supplier>` — [typeorm-supplier.repository.ts](../../../../comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/typeorm-supplier.repository.ts#L64) (L64–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `SupplierMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation(error, data.taxId)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSupplierRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-supplier.repository.ts](../../../../comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/typeorm-supplier.repository.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSupplierRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, taxId?: string \| null): unknown` — [typeorm-supplier.repository.ts](../../../../comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/typeorm-supplier.repository.ts#L84) (L84–97)
- **Propósito / descripción:** Same race-safety-net role as `TypeOrmCategoryRepository`'s own version of this method, keyed off `taxId` instead of `name` — see `SuppliersController`'s doc comment for why suppliers uniqueness works this way.
- **Dependencias (llamadas en su cuerpo):** `new SupplierTaxIdAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts"></a>

### suppliers.controller.ts

- **Ruta:** [suppliers.controller.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/controllers/suppliers.controller.ts) (`comercial-jhoel-api/src/modules/suppliers/presentation/controllers/suppliers.controller.ts`, 89 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Same CRUD/guard shape as `CategoriesController` (see that class's own doc comment), with one deliberate difference: `name` is NOT unique here — only `taxId` is, and only when present, since a real supplier record legitimately may not have one yet.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [create-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-create-supplier-use-case-ts), [list-suppliers.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-list-suppliers-use-case-ts), [get-supplier-by-id.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-get-supplier-by-id-use-case-ts), [update-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-update-supplier-use-case-ts), [deactivate-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-deactivate-supplier-use-case-ts), [create-supplier.request.dto.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-dtos-create-supplier-request-dto-ts), [update-supplier.request.dto.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-dtos-update-supplier-request-dto-ts), [list-suppliers.query.dto.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-dtos-list-suppliers-query-dto-ts), [supplier.response.dto.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-dtos-supplier-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [suppliers.module.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-suppliers-module-ts)

#### Clase `SuppliersController` (L35–88)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('suppliers')`
- **Propósito:** Same CRUD/guard shape as `CategoriesController` (see that class's own doc comment), with one deliberate difference: `name` is NOT unique here — only `taxId` is, and only when present, since a real supplier record legitimately may not have one yet. See `UQ_suppliers_tax_id_active` / `SupplierTaxIdAlreadyExistsError`.
- **Dependencias inyectadas (constructor):** `createSupplierUseCase: CreateSupplierUseCase`, `listSuppliersUseCase: ListSuppliersUseCase`, `getSupplierByIdUseCase: GetSupplierByIdUseCase`, `updateSupplierUseCase: UpdateSupplierUseCase`, `deactivateSupplierUseCase: DeactivateSupplierUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 46–52 | `dto: CreateSupplierRequestDto` | `Promise<SupplierResponseDto>` |
| `findAll` | método public | 54–62 | `query: ListSuppliersQueryDto` | `Promise<SupplierResponseDto[]>` |
| `findOne` | método public | 64–69 | `id: string` | `Promise<SupplierResponseDto>` |
| `update` | método public | 71–79 | `id: string`, `dto: UpdateSupplierRequestDto` | `Promise<SupplierResponseDto>` |
| `deactivate` | método public | 81–87 | `id: string` | `Promise<void>` |

##### `SuppliersController.create`

- **Firma:** `create(dto: CreateSupplierRequestDto): Promise<SupplierResponseDto>` — [suppliers.controller.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/controllers/suppliers.controller.ts#L46) (L46–52)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.createSupplierUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SuppliersController.findAll`

- **Firma:** `findAll(query: ListSuppliersQueryDto): Promise<SupplierResponseDto[]>` — [suppliers.controller.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/controllers/suppliers.controller.ts#L54) (L54–62)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listSuppliersUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SuppliersController.findOne`

- **Firma:** `findOne(id: string): Promise<SupplierResponseDto>` — [suppliers.controller.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/controllers/suppliers.controller.ts#L64) (L64–69)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getSupplierByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SuppliersController.update`

- **Firma:** `update(id: string, dto: UpdateSupplierRequestDto): Promise<SupplierResponseDto>` — [suppliers.controller.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/controllers/suppliers.controller.ts#L71) (L71–79)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.updateSupplierUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SuppliersController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [suppliers.controller.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/controllers/suppliers.controller.ts#L81) (L81–87)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateSupplierUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-suppliers-presentation-dtos-create-supplier-request-dto-ts"></a>

### create-supplier.request.dto.ts

- **Ruta:** [create-supplier.request.dto.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/dtos/create-supplier.request.dto.ts) (`comercial-jhoel-api/src/modules/suppliers/presentation/dtos/create-supplier.request.dto.ts`, 42 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** DTO de entrada: declara `CreateSupplierRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts)

#### Clase `CreateSupplierRequestDto` (L11–41)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-suppliers-presentation-dtos-list-suppliers-query-dto-ts"></a>

### list-suppliers.query.dto.ts

- **Ruta:** [list-suppliers.query.dto.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/dtos/list-suppliers.query.dto.ts) (`comercial-jhoel-api/src/modules/suppliers/presentation/dtos/list-suppliers.query.dto.ts`, 15 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** DTO de consulta: declara `ListSuppliersQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts)

#### Clase `ListSuppliersQueryDto` (L4–14)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-suppliers-presentation-dtos-supplier-response-dto-ts"></a>

### supplier.response.dto.ts

- **Ruta:** [supplier.response.dto.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/dtos/supplier.response.dto.ts) (`comercial-jhoel-api/src/modules/suppliers/presentation/dtos/supplier.response.dto.ts`, 12 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** DTO de respuesta: declara `SupplierResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts)

#### Clase `SupplierResponseDto` (L1–11)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-suppliers-presentation-dtos-update-supplier-request-dto-ts"></a>

### update-supplier.request.dto.ts

- **Ruta:** [update-supplier.request.dto.ts](../../../../comercial-jhoel-api/src/modules/suppliers/presentation/dtos/update-supplier.request.dto.ts) (`comercial-jhoel-api/src/modules/suppliers/presentation/dtos/update-supplier.request.dto.ts`, 42 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** DTO de entrada: declara `UpdateSupplierRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts)

#### Clase `UpdateSupplierRequestDto` (L11–41)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-suppliers-suppliers-module-ts"></a>

### suppliers.module.ts

- **Ruta:** [suppliers.module.ts](../../../../comercial-jhoel-api/src/modules/suppliers/suppliers.module.ts) (`comercial-jhoel-api/src/modules/suppliers/suppliers.module.ts`, 27 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `suppliers`
- **Responsabilidad:** Módulo: declara `SuppliersModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [supplier.orm-entity.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-supplier-orm-entity-ts), [typeorm-supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-typeorm-supplier-repository-ts), [supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-repositories-supplier-repository-ts), [create-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-create-supplier-use-case-ts), [list-suppliers.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-list-suppliers-use-case-ts), [get-supplier-by-id.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-get-supplier-by-id-use-case-ts), [update-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-update-supplier-use-case-ts), [deactivate-supplier.use-case.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-application-use-cases-deactivate-supplier-use-case-ts), [suppliers.controller.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-presentation-controllers-suppliers-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `SuppliersModule` (L13–26)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([SupplierOrmEntity])], controllers: [SuppliersController], providers: [ { provide: SUPPLIER_REPOSITORY, useClass: Ty`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
