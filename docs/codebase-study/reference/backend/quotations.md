# Módulo backend `quotations`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/quotations` | [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L56) `QuotationsController.create` | [CreateQuotationUseCase](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts) | `QuotationRepository`.createQuotation → `create_quotation`<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) | `QuotationsService.createQuotation` |
| `GET /api/quotations` | [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L72) `QuotationsController.findAll` | [ListQuotationsUseCase](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-list-quotations-use-case-ts) | `QuotationRepository`.findAll | UseGuards(JwtAuthGuard) | `QuotationsService.getQuotations` |
| `GET /api/quotations/:id/pdf` | [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L90) `QuotationsController.getPdf` | [GetQuotationPdfUseCase](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts) | `QuotationRepository`.findById<br>`CompanySettingsRepository`.get | UseGuards(JwtAuthGuard) | `QuotationsService.exportQuotationPdf` |
| `POST /api/quotations/:id/void` | [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L109) `QuotationsController.voidQuotation` | [VoidQuotationUseCase](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts) | `QuotationRepository`.findById/voidQuotation | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `QuotationsService.voidQuotation` |
| `GET /api/quotations/:id` | [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L124) `QuotationsController.findOne` | [GetQuotationByIdUseCase](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts) | `QuotationRepository`.findById | UseGuards(JwtAuthGuard) | `QuotationsService.getQuotationById` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [quotation-output.ts](#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | `'VENCIDA'` is never stored — a `'PENDIENTE'` row whose `expirationDate` has already passed displays as `'VENCIDA'` here, same "derive, don't store, an overdue/expired state" precedent this codebase already established for `purchases.paymentStatus`. | 2 internas | 5 | Media (5 consumidores) |
| [create-quotation.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makeQuotation`, `makeClient` (sin comentario de documentación en el código). | 10 internas | 0 | Soporte (pruebas) |
| [create-quotation.use-case.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts) | .ts | Caso de uso | Aplicación | A Cotización is explicitly NOT a sale — `create_quotation()` never touches `products.stock`/`inventory_stock`/`inventory_movements`, and every line is historicized at creation time. | 9 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-quotation-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetQuotationByIdUseCase`, `GetQuotationByIdInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-quotation-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | Reconstructs the quotation's PDF purely from already-persisted, historicized data — never re-runs `create_quotation`, never re-reads the product's *current* price, never touches inventory. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-quotations.use-case.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-list-quotations-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListQuotationsUseCase`, `ListQuotationsInput`, `ListQuotationsOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [void-quotation.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makeQuotation` (sin comentario de documentación en el código). | 5 internas | 0 | Soporte (pruebas) |
| [void-quotation.use-case.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts) | .ts | Caso de uso | Aplicación | The correction path for a mistaken Cotización — never an edit, never a physical delete. | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [today-iso-date.ts](#f-comercial-jhoel-api-src-modules-quotations-application-utils-today-iso-date-ts) | .ts | Utilidad | Aplicación | `yyyy-MM-dd` in local server time — this module's own copy, matching the per-module convention already established by `recharges`/`bank-deposits`/ `banks`/`alerts` (each owns a tiny copy rather than sharing one utility). | 0 internas | 4 | Media (4 consumidores) |
| [quotation-detail.entity.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-detail-entity-ts) | .ts | Entidad de dominio | Dominio | A frozen line item — every field is snapshotted at the moment the quotation was created, never recomputed from the live product. | 0 internas | 2 | Baja (2 consumidores) |
| [quotation.entity.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts) | .ts | Entidad de dominio | Dominio | A Cotización is explicitly NOT a sale — created in one shot (like a Ticket/Purchase), never touches `products.stock`/`inventory_stock`/ `inventory_movements` (see `create_quotation()`), never appears in Sales reports/dashboard. | 1 internas | 6 | Media (6 consumidores) |
| [invalid-client.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-client-error-ts) | .ts | Errores de dominio | Dominio | The referenced client doesn't exist or is deactivated — this module's own copy, mirroring `sales`'/`tickets`' `InvalidClientError` (each module owns its error classes, even for a shared concept). | 1 internas | 3 | Media (3 consumidores) |
| [invalid-expiration-date.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-expiration-date-error-ts) | .ts | Errores de dominio | Dominio | `expirationDate` may never be before the quotation's own creation date — checked in TypeScript as a fast pre-check (`CreateQuotationUseCase`) in addition to the SQL function's own `INVALID_EXPIRATION_DATE` guard, same "TypeScript pre-check + SQL is the real guarantee" split used throughout this codebase. | 1 internas | 3 | Media (3 consumidores) |
| [invalid-quotation-discount.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-discount-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidQuotationDiscountError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-quotation-quantity.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-quantity-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidQuotationQuantityError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [quotation-access-denied.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-access-denied-error-ts) | .ts | Errores de dominio | Dominio | A USER account trying to view a quotation that isn't theirs — ADMIN/SUPER_ADMIN can view any quotation. | 1 internas | 2 | Baja (2 consumidores) |
| [quotation-already-voided.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-already-voided-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `QuotationAlreadyVoidedError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [quotation-empty.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-empty-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `QuotationEmptyError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [quotation-not-found.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `QuotationNotFoundError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [quotation-product-inactive.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-product-inactive-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `QuotationProductInactiveError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [quotation-product-not-found.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-product-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `QuotationProductNotFoundError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [quotation.repository.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateQuotationItemData`, `CreateQuotationData`, `FindQuotationsOptions`, `PaginatedResult`, `QuotationRepository` (sin comentario de documentación en el código). | 1 internas | 10 | Alta (10 consumidores) |
| [quotation-pdf.builder.ts](#f-comercial-jhoel-api-src-modules-quotations-infrastructure-pdf-quotation-pdf-builder-ts) | .ts | Builder | Infraestructura | `yyyy-MM-dd` -&gt; `dd/mm/yyyy`, no `Date` round-trip — same reasoning `formatRechargeDate` already established for a plain `DATE` column. | 1 internas; ext.: pdfkit | 1 | Baja (1 consumidores) |
| [quotation-detail.orm-entity.ts](#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-detail-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `QuotationDetailOrmEntity` (sin comentario de documentación en el código). | 2 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [quotation.mapper.ts](#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `QuotationMapper` (sin comentario de documentación en el código). | 3 internas | 1 | Baja (1 consumidores) |
| [quotation.orm-entity.ts](#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `QuotationOrmEntity` (sin comentario de documentación en el código). | 4 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [typeorm-quotation.repository.ts](#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmQuotationRepository` (sin comentario de documentación en el código). | 12 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [quotations.controller.ts](#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts) | .ts | Controlador | Presentación | No class-level `@Roles(...)` — same policy as Sales/Purchases/Tickets: creating a Cotización is an operational action for whoever runs the register, not an admin-only one. | 13 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [create-quotation.request.dto.ts](#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-create-quotation-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateQuotationItemRequestDto`, `CreateQuotationRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [list-quotations.query.dto.ts](#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-list-quotations-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListQuotationsQueryDto`, `STATUS_VALUES` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [quotation.response.dto.ts](#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-quotation-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `QuotationItemResponseDto`, `QuotationResponseDto`, `QuotationSummaryResponseDto`, `PaginatedQuotationsResponseDto` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [void-quotation.request.dto.ts](#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-void-quotation-request-dto-ts) | .ts | DTO de entrada | Presentación | Mirrors `VoidTicketRequestDto`'s own mandatory-reason shape — this module's own copy rather than a cross-module import. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [quotations.module.ts](#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `QuotationsModule` (sin comentario de documentación en el código). | 12 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts"></a>

### quotation-output.ts

- **Ruta:** [quotation-output.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/dtos/quotation-output.ts) (`comercial-jhoel-api/src/modules/quotations/application/dtos/quotation-output.ts`, 128 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** `'VENCIDA'` is never stored — a `'PENDIENTE'` row whose `expirationDate` has already passed displays as `'VENCIDA'` here, same "derive, don't store, an overdue/expired state" precedent this codebase already established for `purchases.paymentStatus`.
- **Depende de (archivos del proyecto):** [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts), [today-iso-date.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-utils-today-iso-date-ts)
- **Consumidores:** [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [list-quotations.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-list-quotations-use-case-ts), [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts), [quotation.response.dto.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-quotation-response-dto-ts)

**Interfaces, tipos y enums:**

- `interface QuotationItemOutput` (L6): sin documentación — miembros: `id`, `productId`, `productName`, `presentationName`, `quantity`, `unitPrice`, `discount`, `subtotal`, `total`
- `interface QuotationOutput` (L19): Full shape — used for `GET /quotations/:id`, the response of `POST /quotations`, and `POST /quotations/:id/void`. — miembros: `id`, `quotationNumber`, `clientId`, `clientName`, `userId`, `username`, `quotationDate`, `expirationDate`, `subtotal`, `discount`, `total`, `observations`, `commercialTerms`, `status`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `convertedToSaleId`, `items`, `createdAt`, `updatedAt`
- `interface QuotationSummaryOutput` (L45): Lighter shape for `GET /quotations` — no line items, so listing quotations never needs to load them. — miembros: `id`, `quotationNumber`, `clientId`, `clientName`, `userId`, `username`, `expirationDate`, `total`, `status`, `createdAt`
- `type QuotationDisplayStatus` (L4) = `'PENDIENTE' \| 'ACEPTADA' \| 'ANULADA' \| 'VENCIDA'`
#### Función `deriveDisplayStatus` (L65–73)

- **Tipo:** función local del archivo
- **Firma:** `deriveDisplayStatus(status: Quotation['status'], expirationDate: string): QuotationDisplayStatus` — [quotation-output.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/dtos/quotation-output.ts#L65)
- **Propósito / descripción:** `'VENCIDA'` is never stored — a `'PENDIENTE'` row whose `expirationDate` has already passed displays as `'VENCIDA'` here, same "derive, don't store, an overdue/expired state" precedent this codebase already established for `purchases.paymentStatus`. `'ACEPTADA'`/`'ANULADA'` are terminal and never get overridden, even past their expiration date.
- **Dependencias:** `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toQuotationOutput` (L75–110)

- **Tipo:** función exportada
- **Firma:** `toQuotationOutput(quotation: Quotation): QuotationOutput` — [quotation-output.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/dtos/quotation-output.ts#L75)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `deriveDisplayStatus`, `quotation.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts)

#### Función `toQuotationSummaryOutput` (L112–127)

- **Tipo:** función exportada
- **Firma:** `toQuotationSummaryOutput(quotation: Quotation): QuotationSummaryOutput` — [quotation-output.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/dtos/quotation-output.ts#L112)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `deriveDisplayStatus`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts"></a>

### create-quotation.use-case.spec.ts

- **Ruta:** [create-quotation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.spec.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.spec.ts`, 188 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Prueba unitaria: declara `makeQuotation`, `makeClient` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [quotation-empty.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-empty-error-ts), [invalid-quotation-quantity.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-quantity-error-ts), [invalid-client.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-client-error-ts), [invalid-expiration-date.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-expiration-date-error-ts), [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts), [client.entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-entities-client-entity-ts), [today-iso-date.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-utils-today-iso-date-ts)
- **Consumidores:** —
#### Función `makeQuotation` (L12–37)

- **Tipo:** función local del archivo
- **Firma:** `makeQuotation(): Quotation` — [create-quotation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.spec.ts#L12)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Quotation.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `makeClient` (L39–51)

- **Tipo:** función local del archivo
- **Firma:** `makeClient(isActive: boolean): Client` — [create-quotation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.spec.ts#L39)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Client.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts"></a>

### create-quotation.use-case.ts

- **Ruta:** [create-quotation.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.ts`, 106 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** A Cotización is explicitly NOT a sale — `create_quotation()` never touches `products.stock`/`inventory_stock`/`inventory_movements`, and every line is historicized at creation time.
- **Depende de (archivos del proyecto):** [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [quotation-empty.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-empty-error-ts), [invalid-quotation-quantity.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-quantity-error-ts), [invalid-quotation-discount.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-discount-error-ts), [invalid-client.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-client-error-ts), [invalid-expiration-date.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-expiration-date-error-ts), [quotation-output.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts), [today-iso-date.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateQuotationItemInput` (L14): sin documentación — miembros: `productId`, `quantity`, `discount`
- `interface CreateQuotationInput` (L20): sin documentación — miembros: `userId`, `clientId`, `expirationDate`, `observations`, `commercialTerms`, `items`

#### Clase `CreateQuotationUseCase` (L37–105)

- **Decoradores:** `@Injectable()`
- **Propósito:** A Cotización is explicitly NOT a sale — `create_quotation()` never touches `products.stock`/`inventory_stock`/`inventory_movements`, and every line is historicized at creation time. Structurally mirrors `CreateTicketUseCase`'s own validation/dedup shape, with the additions this document type requires: a mandatory client, a required expiration date validated against today, and a per-line discount.
- **Dependencias inyectadas (constructor):** `@Inject(QUOTATION_REPOSITORY) quotationRepository: QuotationRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 46–104 | `input: CreateQuotationInput` | `Promise<QuotationOutput>` |

##### `CreateQuotationUseCase.execute`

- **Firma:** `execute(input: CreateQuotationInput): Promise<QuotationOutput>` — [create-quotation.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.ts#L46) (L46–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new QuotationEmptyError`, `this.clientRepository.findById`, `new InvalidClientError`, `todayIsoDate`, `new InvalidExpirationDateError`, `Number.isInteger`, `new InvalidQuotationQuantityError`, `new InvalidQuotationDiscountError`, `new Map`, `mergedByProduct.get`, `mergedByProduct.set`, `[...mergedByProduct.entries()].map`, `mergedByProduct.entries`, `a.productId.localeCompare`, `this.quotationRepository.createQuotation`, `toQuotationOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new QuotationEmptyError()`, `new InvalidClientError()`, `new InvalidExpirationDateError()`, `new InvalidQuotationQuantityError(item.productId)`, `new InvalidQuotationDiscountError(item.productId)`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts"></a>

### get-quotation-by-id.use-case.ts

- **Ruta:** [get-quotation-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/get-quotation-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/get-quotation-by-id.use-case.ts`, 36 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Caso de uso: declara `GetQuotationByIdUseCase`, `GetQuotationByIdInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation-not-found.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-not-found-error-ts), [quotation-access-denied.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-access-denied-error-ts), [quotation-output.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

**Interfaces, tipos y enums:**

- `interface GetQuotationByIdInput` (L8): sin documentación — miembros: `currentUserId`, `isAdmin`

#### Clase `GetQuotationByIdUseCase` (L13–35)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(QUOTATION_REPOSITORY) quotationRepository: QuotationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–34 | `id: string`, `input: GetQuotationByIdInput` | `Promise<QuotationOutput>` |

##### `GetQuotationByIdUseCase.execute`

- **Firma:** `execute(id: string, input: GetQuotationByIdInput): Promise<QuotationOutput>` — [get-quotation-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/get-quotation-by-id.use-case.ts#L20) (L20–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quotationRepository.findById`, `new QuotationNotFoundError`, `new QuotationAccessDeniedError`, `toQuotationOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new QuotationNotFoundError(id)`, `new QuotationAccessDeniedError()`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts"></a>

### get-quotation-pdf.use-case.ts

- **Ruta:** [get-quotation-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/get-quotation-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/get-quotation-pdf.use-case.ts`, 72 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Reconstructs the quotation's PDF purely from already-persisted, historicized data — never re-runs `create_quotation`, never re-reads the product's *current* price, never touches inventory.
- **Depende de (archivos del proyecto):** [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation-not-found.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-not-found-error-ts), [quotation-access-denied.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-access-denied-error-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [quotation-pdf.builder.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-pdf-quotation-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

**Interfaces, tipos y enums:**

- `interface GetQuotationPdfInput` (L10): sin documentación — miembros: `currentUserId`, `isAdmin`

#### Clase `GetQuotationPdfUseCase` (L22–71)

- **Decoradores:** `@Injectable()`
- **Propósito:** Reconstructs the quotation's PDF purely from already-persisted, historicized data — never re-runs `create_quotation`, never re-reads the product's *current* price, never touches inventory. Same ownership rule as `GetQuotationByIdUseCase`. A quotation has no draft concept (created in one shot), so there's no draft-rejection branch.
- **Dependencias inyectadas (constructor):** `@Inject(QUOTATION_REPOSITORY) quotationRepository: QuotationRepository`, `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 31–70 | `id: string`, `input: GetQuotationPdfInput` | `Promise<Buffer>` |

##### `GetQuotationPdfUseCase.execute`

- **Firma:** `execute(id: string, input: GetQuotationPdfInput): Promise<Buffer>` — [get-quotation-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/get-quotation-pdf.use-case.ts#L31) (L31–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quotationRepository.findById`, `new QuotationNotFoundError`, `new QuotationAccessDeniedError`, `this.companySettingsRepository.get`, `buildQuotationPdf`, `quotation.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new QuotationNotFoundError(id)`, `new QuotationAccessDeniedError()`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-quotations-application-use-cases-list-quotations-use-case-ts"></a>

### list-quotations.use-case.ts

- **Ruta:** [list-quotations.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/list-quotations.use-case.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/list-quotations.use-case.ts`, 69 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Caso de uso: declara `ListQuotationsUseCase`, `ListQuotationsInput`, `ListQuotationsOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation-output.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

**Interfaces, tipos y enums:**

- `interface ListQuotationsInput` (L12): sin documentación — miembros: `currentUserId`, `isAdmin`, `status`, `startDate`, `endDate`, `search`, `page`, `limit`
- `interface ListQuotationsOutput` (L24): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `ListQuotationsUseCase` (L35–68)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(QUOTATION_REPOSITORY) quotationRepository: QuotationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 42–67 | `input: ListQuotationsInput` | `Promise<ListQuotationsOutput>` |

##### `ListQuotationsUseCase.execute`

- **Firma:** `execute(input: ListQuotationsInput): Promise<ListQuotationsOutput>` — [list-quotations.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/list-quotations.use-case.ts#L42) (L42–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `this.quotationRepository.findAll`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts"></a>

### void-quotation.use-case.spec.ts

- **Ruta:** [void-quotation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/void-quotation.use-case.spec.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/void-quotation.use-case.spec.ts`, 89 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Prueba unitaria: declara `makeQuotation` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts), [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation-not-found.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-not-found-error-ts), [quotation-already-voided.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-already-voided-error-ts), [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts)
- **Consumidores:** —
#### Función `makeQuotation` (L7–33)

- **Tipo:** función local del archivo
- **Firma:** `makeQuotation(status: QuotationStoredStatus): Quotation` — [void-quotation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/void-quotation.use-case.spec.ts#L7)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Quotation.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts"></a>

### void-quotation.use-case.ts

- **Ruta:** [void-quotation.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/void-quotation.use-case.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/void-quotation.use-case.ts`, 45 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** The correction path for a mistaken Cotización — never an edit, never a physical delete.
- **Depende de (archivos del proyecto):** [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation-not-found.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-not-found-error-ts), [quotation-already-voided.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-already-voided-error-ts), [quotation-output.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [void-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts), [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

**Interfaces, tipos y enums:**

- `interface VoidQuotationInput` (L8): sin documentación — miembros: `id`, `voidedBy`, `reason`

#### Clase `VoidQuotationUseCase` (L21–44)

- **Decoradores:** `@Injectable()`
- **Propósito:** The correction path for a mistaken Cotización — never an edit, never a physical delete. Same shape as `VoidTicketUseCase`/ `VoidBankDepositOperationUseCase`. Admin-only (enforced at the controller via `@Roles`). `'ANULADA'` is terminal — voiding an already-voided quotation is rejected, same as re-voiding a ticket.
- **Dependencias inyectadas (constructor):** `@Inject(QUOTATION_REPOSITORY) quotationRepository: QuotationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 28–43 | `input: VoidQuotationInput` | `Promise<QuotationOutput>` |

##### `VoidQuotationUseCase.execute`

- **Firma:** `execute(input: VoidQuotationInput): Promise<QuotationOutput>` — [void-quotation.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/void-quotation.use-case.ts#L28) (L28–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quotationRepository.findById`, `new QuotationNotFoundError`, `new QuotationAlreadyVoidedError`, `this.quotationRepository.voidQuotation`, `toQuotationOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new QuotationNotFoundError(input.id)`, `new QuotationAlreadyVoidedError(input.id)`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-quotations-application-utils-today-iso-date-ts"></a>

### today-iso-date.ts

- **Ruta:** [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/utils/today-iso-date.ts) (`comercial-jhoel-api/src/modules/quotations/application/utils/today-iso-date.ts`, 19 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** `yyyy-MM-dd` in local server time — this module's own copy, matching the per-module convention already established by `recharges`/`bank-deposits`/ `banks`/`alerts` (each owns a tiny copy rather than sharing one utility).
- **Descripción del autor (comentario del archivo):** `yyyy-MM-dd` in local server time — this module's own copy, matching the per-module convention already established by `recharges`/`bank-deposits`/ `banks`/`alerts` (each owns a tiny copy rather than sharing one utility). Used to derive `'VENCIDA'` at read time — never stored on the row itself, same "never store a computed overdue/expired state" precedent already established for `purchases.paymentStatus`.
- **Consumidores:** [quotation-output.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts), [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)
#### Función `toIsoDate` (L9–14)

- **Tipo:** función local del archivo
- **Firma:** `toIsoDate(date: Date): string` — [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/utils/today-iso-date.ts#L9)
- **Propósito / descripción:** `yyyy-MM-dd` in local server time — this module's own copy, matching the per-module convention already established by `recharges`/`bank-deposits`/ `banks`/`alerts` (each owns a tiny copy rather than sharing one utility). Used to derive `'VENCIDA'` at read time — never stored on the row itself, same "never store a computed overdue/expired state" precedent already established for `purchases.paymentStatus`.
- **Dependencias:** `date.getFullYear`, `String(date.getMonth() + 1).padStart`, `String`, `date.getMonth`, `String(date.getDate()).padStart`, `date.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `todayIsoDate` (L16–18)

- **Tipo:** función exportada
- **Firma:** `todayIsoDate(): string` — [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/utils/today-iso-date.ts#L16)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `toIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [quotation-output.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts), [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-detail-entity-ts"></a>

### quotation-detail.entity.ts

- **Ruta:** [quotation-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation-detail.entity.ts) (`comercial-jhoel-api/src/modules/quotations/domain/entities/quotation-detail.entity.ts`, 57 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** A frozen line item — every field is snapshotted at the moment the quotation was created, never recomputed from the live product.
- **Consumidores:** [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts), [quotation.mapper.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts)

**Interfaces, tipos y enums:**

- `interface QuotationDetailProps` (L1): sin documentación — miembros: `id`, `productId`, `productName`, `presentationName`, `quantity`, `unitPrice`, `discount`, `subtotal`, `total`

#### Clase `QuotationDetail` (L14–56)

- **Propósito:** A frozen line item — every field is snapshotted at the moment the quotation was created, never recomputed from the live product. This is what guarantees a later price change on the product never alters an already-saved quotation.
- **Dependencias inyectadas (constructor):** `props: QuotationDetailProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 17–19 | `props: QuotationDetailProps` | `QuotationDetail` |
| `id` | getter public | 21–23 | — | `string` |
| `productId` | getter public | 25–27 | — | `string` |
| `productName` | getter public | 29–31 | — | `string` |
| `presentationName` | getter public | 33–35 | — | `string \| null` |
| `quantity` | getter public | 37–39 | — | `number` |
| `unitPrice` | getter public | 41–43 | — | `number` |
| `discount` | getter public | 45–47 | — | `number` |
| `subtotal` | getter public | 49–51 | — | `number` |
| `total` | getter public | 53–55 | — | `number` |

##### `QuotationDetail.create`

- **Firma:** `create(props: QuotationDetailProps): QuotationDetail` — [quotation-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation-detail.entity.ts#L17) (L17–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new QuotationDetail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [quotation.mapper.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts)

##### `QuotationDetail.id`

- **Firma:** `id(): string` — [quotation-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation-detail.entity.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationDetail.productId`

- **Firma:** `productId(): string` — [quotation-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation-detail.entity.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationDetail.productName`

- **Firma:** `productName(): string` — [quotation-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation-detail.entity.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationDetail.presentationName`

- **Firma:** `presentationName(): string \| null` — [quotation-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation-detail.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationDetail.quantity`

- **Firma:** `quantity(): number` — [quotation-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation-detail.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationDetail.unitPrice`

- **Firma:** `unitPrice(): number` — [quotation-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation-detail.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationDetail.discount`

- **Firma:** `discount(): number` — [quotation-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation-detail.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationDetail.subtotal`

- **Firma:** `subtotal(): number` — [quotation-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation-detail.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationDetail.total`

- **Firma:** `total(): number` — [quotation-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation-detail.entity.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts"></a>

### quotation.entity.ts

- **Ruta:** [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts) (`comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts`, 136 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** A Cotización is explicitly NOT a sale — created in one shot (like a Ticket/Purchase), never touches `products.stock`/`inventory_stock`/ `inventory_movements` (see `create_quotation()`), never appears in Sales reports/dashboard.
- **Depende de (archivos del proyecto):** [quotation-detail.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-detail-entity-ts)
- **Consumidores:** [quotation-output.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts), [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [void-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts), [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation.mapper.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

**Interfaces, tipos y enums:**

- `interface QuotationProps` (L5): sin documentación — miembros: `id`, `quotationNumber`, `clientId`, `clientName`, `userId`, `username`, `quotationDate`, `expirationDate`, `subtotal`, `discount`, `total`, `observations`, `commercialTerms`, `status`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `convertedToSaleId`, `items`, `createdAt`, `updatedAt`
- `type QuotationStoredStatus` (L3) = `'PENDIENTE' \| 'ACEPTADA' \| 'ANULADA'`

#### Clase `Quotation` (L41–135)

- **Propósito:** A Cotización is explicitly NOT a sale — created in one shot (like a Ticket/Purchase), never touches `products.stock`/`inventory_stock`/ `inventory_movements` (see `create_quotation()`), never appears in Sales reports/dashboard. Every line item is historicized at creation time, so a later product price change never alters an already-saved quotation. Correction is anular-and-recreate, never a silent edit.
- **Dependencias inyectadas (constructor):** `props: QuotationProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 44–46 | `props: QuotationProps` | `Quotation` |
| `id` | getter public | 48–50 | — | `string` |
| `quotationNumber` | getter public | 52–54 | — | `string` |
| `clientId` | getter public | 56–58 | — | `string` |
| `clientName` | getter public | 60–62 | — | `string` |
| `userId` | getter public | 64–66 | — | `string` |
| `username` | getter public | 68–70 | — | `string` |
| `quotationDate` | getter public | 72–74 | — | `Date` |
| `expirationDate` | getter public | 76–78 | — | `string` |
| `subtotal` | getter public | 80–82 | — | `number` |
| `discount` | getter public | 84–86 | — | `number` |
| `total` | getter public | 88–90 | — | `number` |
| `observations` | getter public | 92–94 | — | `string \| null` |
| `commercialTerms` | getter public | 96–98 | — | `string \| null` |
| `status` | getter public | 100–102 | — | `QuotationStoredStatus` |
| `voidedAt` | getter public | 104–106 | — | `Date \| null` |
| `voidedBy` | getter public | 108–110 | — | `string \| null` |
| `voidedByUsername` | getter public | 112–114 | — | `string \| null` |
| `voidReason` | getter public | 116–118 | — | `string \| null` |
| `convertedToSaleId` | getter public | 120–122 | — | `string \| null` |
| `items` | getter public | 124–126 | — | `QuotationDetail[]` |
| `createdAt` | getter public | 128–130 | — | `Date` |
| `updatedAt` | getter public | 132–134 | — | `Date` |

##### `Quotation.create`

- **Firma:** `create(props: QuotationProps): Quotation` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Quotation`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [void-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts), [quotation.mapper.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts)

##### `Quotation.id`

- **Firma:** `id(): string` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.quotationNumber`

- **Firma:** `quotationNumber(): string` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.clientId`

- **Firma:** `clientId(): string` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.clientName`

- **Firma:** `clientName(): string` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.userId`

- **Firma:** `userId(): string` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.username`

- **Firma:** `username(): string` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L68) (L68–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.quotationDate`

- **Firma:** `quotationDate(): Date` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L72) (L72–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.expirationDate`

- **Firma:** `expirationDate(): string` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L76) (L76–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.subtotal`

- **Firma:** `subtotal(): number` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.discount`

- **Firma:** `discount(): number` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L84) (L84–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.total`

- **Firma:** `total(): number` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L88) (L88–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.observations`

- **Firma:** `observations(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L92) (L92–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.commercialTerms`

- **Firma:** `commercialTerms(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L96) (L96–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.status`

- **Firma:** `status(): QuotationStoredStatus` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L100) (L100–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.voidedAt`

- **Firma:** `voidedAt(): Date \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L104) (L104–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.voidedBy`

- **Firma:** `voidedBy(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L108) (L108–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.voidedByUsername`

- **Firma:** `voidedByUsername(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L112) (L112–114)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.voidReason`

- **Firma:** `voidReason(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L116) (L116–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.convertedToSaleId`

- **Firma:** `convertedToSaleId(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L120) (L120–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.items`

- **Firma:** `items(): QuotationDetail[]` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L124) (L124–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.createdAt`

- **Firma:** `createdAt(): Date` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L128) (L128–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.updatedAt`

- **Firma:** `updatedAt(): Date` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L132) (L132–134)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-client-error-ts"></a>

### invalid-client.error.ts

- **Ruta:** [invalid-client.error.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/errors/invalid-client.error.ts) (`comercial-jhoel-api/src/modules/quotations/domain/errors/invalid-client.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** The referenced client doesn't exist or is deactivated — this module's own copy, mirroring `sales`'/`tickets`' `InvalidClientError` (each module owns its error classes, even for a shared concept).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

#### Clase `InvalidClientError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** The referenced client doesn't exist or is deactivated — this module's own copy, mirroring `sales`'/`tickets`' `InvalidClientError` (each module owns its error classes, even for a shared concept). Unlike a Ticket's optional client, a Cotización's client is always required.
<a id="f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-expiration-date-error-ts"></a>

### invalid-expiration-date.error.ts

- **Ruta:** [invalid-expiration-date.error.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/errors/invalid-expiration-date.error.ts) (`comercial-jhoel-api/src/modules/quotations/domain/errors/invalid-expiration-date.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** `expirationDate` may never be before the quotation's own creation date — checked in TypeScript as a fast pre-check (`CreateQuotationUseCase`) in addition to the SQL function's own `INVALID_EXPIRATION_DATE` guard, same "TypeScript pre-check + SQL is the real guarantee" split used throughout this codebase.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

#### Clase `InvalidExpirationDateError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** `expirationDate` may never be before the quotation's own creation date — checked in TypeScript as a fast pre-check (`CreateQuotationUseCase`) in addition to the SQL function's own `INVALID_EXPIRATION_DATE` guard, same "TypeScript pre-check + SQL is the real guarantee" split used throughout this codebase.
<a id="f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-discount-error-ts"></a>

### invalid-quotation-discount.error.ts

- **Ruta:** [invalid-quotation-discount.error.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/errors/invalid-quotation-discount.error.ts) (`comercial-jhoel-api/src/modules/quotations/domain/errors/invalid-quotation-discount.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Errores de dominio: declara `InvalidQuotationDiscountError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

#### Clase `InvalidQuotationDiscountError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-quantity-error-ts"></a>

### invalid-quotation-quantity.error.ts

- **Ruta:** [invalid-quotation-quantity.error.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/errors/invalid-quotation-quantity.error.ts) (`comercial-jhoel-api/src/modules/quotations/domain/errors/invalid-quotation-quantity.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Errores de dominio: declara `InvalidQuotationQuantityError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

#### Clase `InvalidQuotationQuantityError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-access-denied-error-ts"></a>

### quotation-access-denied.error.ts

- **Ruta:** [quotation-access-denied.error.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-access-denied.error.ts) (`comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-access-denied.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** A USER account trying to view a quotation that isn't theirs — ADMIN/SUPER_ADMIN can view any quotation.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts)

#### Clase `QuotationAccessDeniedError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** A USER account trying to view a quotation that isn't theirs — ADMIN/SUPER_ADMIN can view any quotation.
<a id="f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-already-voided-error-ts"></a>

### quotation-already-voided.error.ts

- **Ruta:** [quotation-already-voided.error.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-already-voided.error.ts) (`comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-already-voided.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Errores de dominio: declara `QuotationAlreadyVoidedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts), [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts)

#### Clase `QuotationAlreadyVoidedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-empty-error-ts"></a>

### quotation-empty.error.ts

- **Ruta:** [quotation-empty.error.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-empty.error.ts) (`comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-empty.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Errores de dominio: declara `QuotationEmptyError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

#### Clase `QuotationEmptyError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-not-found-error-ts"></a>

### quotation-not-found.error.ts

- **Ruta:** [quotation-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-not-found.error.ts) (`comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Errores de dominio: declara `QuotationNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts), [void-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts), [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts)

#### Clase `QuotationNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-product-inactive-error-ts"></a>

### quotation-product-inactive.error.ts

- **Ruta:** [quotation-product-inactive.error.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-product-inactive.error.ts) (`comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-product-inactive.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Errores de dominio: declara `QuotationProductInactiveError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

#### Clase `QuotationProductInactiveError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-product-not-found-error-ts"></a>

### quotation-product-not-found.error.ts

- **Ruta:** [quotation-product-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-product-not-found.error.ts) (`comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-product-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Errores de dominio: declara `QuotationProductNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

#### Clase `QuotationProductNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts"></a>

### quotation.repository.ts

- **Ruta:** [quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/repositories/quotation.repository.ts) (`comercial-jhoel-api/src/modules/quotations/domain/repositories/quotation.repository.ts`, 52 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateQuotationItemData`, `CreateQuotationData`, `FindQuotationsOptions`, `PaginatedResult`, `QuotationRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts)
- **Consumidores:** [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts), [list-quotations.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-list-quotations-use-case-ts), [void-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts), [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts), [list-quotations.query.dto.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-list-quotations-query-dto-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateQuotationItemData` (L5): sin documentación — miembros: `productId`, `quantity`, `discount`
- `interface CreateQuotationData` (L11): sin documentación — miembros: `userId`, `clientId`, `expirationDate`, `observations`, `commercialTerms`, `items`
- `interface FindQuotationsOptions` (L23): sin documentación — miembros: `userId`, `status`, `startDate`, `endDate`, `search`, `page`, `limit`
- `interface PaginatedResult` (L36): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface QuotationRepository` (L43): sin documentación — miembros: `createQuotation`, `findAll`, `findById`, `voidQuotation`
- `type QuotationStatusFilter` (L21) = `'PENDIENTE' \| 'ACEPTADA' \| 'ANULADA' \| 'VENCIDA'` — A filter value of `'VENCIDA'` is never a stored status — it resolves to `status = 'PENDIENTE' AND expiration_date &lt; today`, the same derivation `toQuotationOutput` applies per-row.

**Constantes exportadas:**

- `QUOTATION_REPOSITORY` (L3) = `Symbol('QUOTATION_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-quotations-infrastructure-pdf-quotation-pdf-builder-ts"></a>

### quotation-pdf.builder.ts

- **Ruta:** [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts) (`comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts`, 293 líneas)
- **Tipo:** Builder · **Capa:** Infraestructura · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** `yyyy-MM-dd` -&gt; `dd/mm/yyyy`, no `Date` round-trip — same reasoning `formatRechargeDate` already established for a plain `DATE` column.
- **Depende de (archivos del proyecto):** [pdf-helpers.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-ts)
- **Paquetes externos:** `pdfkit`
- **Consumidores:** [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts)

**Interfaces, tipos y enums:**

- `interface QuotationPdfItem` (L10): sin documentación — miembros: `productName`, `presentationName`, `quantity`, `unitPrice`, `discount`, `total`
- `interface QuotationPdfOptions` (L19): sin documentación — miembros: `company`, `quotationNumber`, `quotationDate`, `expirationDate`, `clientName`, `items`, `subtotal`, `discount`, `total`, `observations`, `commercialTerms`
#### Función `formatIsoDate` (L47–50)

- **Tipo:** función local del archivo
- **Firma:** `formatIsoDate(isoDate: string): string` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L47)
- **Propósito / descripción:** `yyyy-MM-dd` -&gt; `dd/mm/yyyy`, no `Date` round-trip — same reasoning `formatRechargeDate` already established for a plain `DATE` column.
- **Dependencias:** `isoDate.split`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildQuotationPdf` (L60–87)

- **Tipo:** función exportada
- **Firma:** `buildQuotationPdf(options: QuotationPdfOptions): Promise<Buffer>` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L60)
- **Propósito / descripción:** Reconstructs a Cotización proposal purely from already-persisted, historicized data (`QuotationOutput` + company settings) — never re-runs `create_quotation` or touches inventory, and never re-reads the product's *current* price. Professional/commercial A4 layout — genuinely distinct from Sale/Purchase's plain document style and Ticket's thermal-receipt style, per the approved plan.
- **Dependencias:** `new PDFDocument`, `doc.on`, `chunks.push`, `new Promise`, `resolve`, `Buffer.concat`, `drawCompanyLetterhead`, `doc.moveDown`, `drawDivider`, `drawDocumentInfo`, `drawTable`, `drawTotals`, `drawNotes`, `numberPages`, `doc.end`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts)

#### Función `drawDocumentInfo` (L89–133)

- **Tipo:** función local del archivo
- **Firma:** `drawDocumentInfo(doc: PDFKit.PDFDocument, options: QuotationPdfOptions): void` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L89)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `doc.fontSize(18).fillColor('#0f172a').text`, `doc.fontSize(18).fillColor`, `doc.fontSize`, `doc.fontSize(9).fillColor`, `doc.text`, `formatDateTime`, `formatIsoDate`, `doc.fontSize(10).fillColor('#0f172a').text`, `doc.fontSize(10).fillColor`, `doc.fontSize(9).fillColor('#334155').text`, `drawDivider`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawTable` (L135–196)

- **Tipo:** función local del archivo
- **Firma:** `drawTable(doc: PDFKit.PDFDocument, items: QuotationPdfItem[]): void` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L135)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `COLUMNS.reduce`, `doc.rect(startX, y, totalWidth, HEADER_ROW_HEIGHT).fill`, `doc.rect`, `doc.fontSize(9).fillColor`, `doc.fontSize`, `doc.text`, `doc.fillColor`, `doc.addPage`, `drawTableHeader`, `doc.moveDown`, `items.forEach`, `ensureSpace`, `doc.rect(startX, y, totalWidth, ROW_HEIGHT).fill`, `String`, `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawTotals` (L198–224)

- **Tipo:** función local del archivo
- **Firma:** `drawTotals(doc: PDFKit.PDFDocument, options: Pick<QuotationPdfOptions, 'subtotal' \| 'discount' \| 'total'>): void` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L198)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `doc.fontSize(10).fillColor`, `doc.fontSize`, `doc.text`, `formatCurrency`, `doc.fontSize(13).fillColor('#0f172a').text`, `doc.fontSize(13).fillColor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawNotes` (L226–266)

- **Tipo:** función local del archivo
- **Firma:** `drawNotes(doc: PDFKit.PDFDocument, options: Pick<QuotationPdfOptions, 'observations' \| 'commercialTerms'>): void` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L226)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `doc.fontSize(9).fillColor('#0f172a').text`, `doc.fontSize(9).fillColor`, `doc.fontSize`, `doc.fontSize(9).fillColor('#334155').text`, `doc.fontSize(9).fillColor('#64748b').text`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `numberPages` (L268–292)

- **Tipo:** función local del archivo
- **Firma:** `numberPages(doc: PDFKit.PDFDocument): void` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L268)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.bufferedPageRange`, `doc.switchToPage`, `doc.fontSize(8).fillColor('#94a3b8').text`, `doc.fontSize(8).fillColor`, `doc.fontSize`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-detail-orm-entity-ts"></a>

### quotation-detail.orm-entity.ts

- **Ruta:** [quotation-detail.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation-detail.orm-entity.ts) (`comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation-detail.orm-entity.ts`, 66 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `QuotationDetailOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [quotation.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [quotation.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

#### Clase `QuotationDetailOrmEntity` (L5–65)

- **Decoradores:** `@Entity('quotation_details')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column quotationId: string`, `@ManyToOne quotation: QuotationOrmEntity`, `@Column productId: string`, `@Column productName: string`, `@Column presentationName: string \| null`, `@Column quantity: number`, `@Column unitPrice: number`, `@Column discount: number`, `@Column subtotal: number`, `@Column total: number`
<a id="f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts"></a>

### quotation.mapper.ts

- **Ruta:** [quotation.mapper.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation.mapper.ts) (`comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation.mapper.ts`, 46 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Mapper: declara `QuotationMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts), [quotation-detail.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-detail-entity-ts), [quotation.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts)
- **Consumidores:** [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

#### Clase `QuotationMapper` (L5–45)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 7–44 | `orm: QuotationOrmEntity` | `Quotation` |

##### `QuotationMapper.toDomain`

- **Firma:** `toDomain(orm: QuotationOrmEntity): Quotation` — [quotation.mapper.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation.mapper.ts#L7) (L7–44)
- **Propósito / descripción:** `orm.items` is `undefined` whenever the query didn't join `quotation_details` (the list view never does) — mapped to `[]`.
- **Dependencias (llamadas en su cuerpo):** `Quotation.create`, `(orm.items ?? []).map`, `QuotationDetail.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts"></a>

### quotation.orm-entity.ts

- **Ruta:** [quotation.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation.orm-entity.ts) (`comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation.orm-entity.ts`, 109 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `QuotationOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [client.orm-entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [quotation-detail.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-detail-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [quotation-detail.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-detail-orm-entity-ts), [quotation.mapper.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

#### Clase `QuotationOrmEntity` (L16–108)

- **Decoradores:** `@Entity('quotations')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column quotationNumber: string`, `@Column clientId: string`, `@ManyToOne client: ClientOrmEntity`, `@Column userId: string`, `@ManyToOne user: UserOrmEntity`, `@Column quotationDate: Date`, `@Column expirationDate: string`, `@Column subtotal: number`, `@Column discount: number`, `@Column total: number`, `@Column observations: string \| null`, `@Column commercialTerms: string \| null`, `@Column status: 'PENDIENTE' \| 'ACEPTADA' \| 'ANULADA'`, `@Column voidedAt: Date \| null`, `@Column voidedBy: string \| null`, `@ManyToOne voidedByUser: UserOrmEntity \| null`, `@Column voidReason: string \| null`, `@Column convertedToSaleId: string \| null`, `@OneToMany items: QuotationDetailOrmEntity[]`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts"></a>

### typeorm-quotation.repository.ts

- **Ruta:** [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts) (`comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts`, 186 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmQuotationRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts), [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation-empty.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-empty-error-ts), [invalid-client.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-client-error-ts), [quotation-product-not-found.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-product-not-found-error-ts), [quotation-product-inactive.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-product-inactive-error-ts), [invalid-quotation-quantity.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-quantity-error-ts), [invalid-quotation-discount.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-discount-error-ts), [invalid-expiration-date.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-expiration-date-error-ts), [quotation.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts), [quotation.mapper.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts), [today-iso-date.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

#### Clase `TypeOrmQuotationRepository` (L22–185)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements QuotationRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(QuotationOrmEntity) repository: Repository<QuotationOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `createQuotation` | método public async | 29–63 | `data: CreateQuotationData` | `Promise<Quotation>` |
| `findAll` | método public async | 65–121 | `options: FindQuotationsOptions` | `Promise<PaginatedResult<Quotation>>` |
| `findById` | método public async | 123–129 | `id: string` | `Promise<Quotation \| null>` |
| `voidQuotation` | método public async | 131–152 | `id: string`, `voidedBy: string`, `reason: string` | `Promise<Quotation>` |
| `translateQuotationError` | método private | 155–184 | `error: unknown` | `unknown` |

##### `TypeOrmQuotationRepository.createQuotation`

- **Firma:** `createQuotation(data: CreateQuotationData): Promise<Quotation>` — [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts#L29) (L29–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `JSON.stringify`, `data.items.map`, `this.repository.manager.query`, `this.translateQuotationError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `create_quotation`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateQuotationError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la cotización recién creada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmQuotationRepository.findAll`

- **Firma:** `findAll(options: FindQuotationsOptions): Promise<PaginatedResult<Quotation>>` — [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts#L65) (L65–121)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('quotation').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `todayIsoDate`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `orms.map`, `QuotationMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmQuotationRepository.findById`

- **Firma:** `findById(id: string): Promise<Quotation \| null>` — [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts#L123) (L123–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `QuotationMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmQuotationRepository.voidQuotation`

- **Firma:** `voidQuotation(id: string, voidedBy: string, reason: string): Promise<Quotation>` — [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts#L131) (L131–152)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `new Date`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `new InternalServerErrorException( 'No se pudo recuperar la cotización recién anulada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmQuotationRepository.translateQuotationError`

- **Firma:** `translateQuotationError(error: unknown): unknown` — [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts#L155) (L155–184)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;id&gt;'` → domain-error translation as `TypeOrmTicketRepository.translateTicketError` — see that method's own doc comment for why this parsing exists.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new QuotationEmptyError`, `new InvalidClientError`, `new InvalidExpirationDateError`, `new QuotationProductNotFoundError`, `new QuotationProductInactiveError`, `new InvalidQuotationQuantityError`, `new InvalidQuotationDiscountError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts"></a>

### quotations.controller.ts

- **Ruta:** [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts) (`comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts`, 135 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** No class-level `@Roles(...)` — same policy as Sales/Purchases/Tickets: creating a Cotización is an operational action for whoever runs the register, not an admin-only one.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [list-quotations.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-list-quotations-use-case-ts), [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts), [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts), [create-quotation.request.dto.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-create-quotation-request-dto-ts), [list-quotations.query.dto.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-list-quotations-query-dto-ts), [void-quotation.request.dto.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-void-quotation-request-dto-ts), [quotation.response.dto.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-quotation-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

#### Clase `QuotationsController` (L45–134)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('quotations')`
- **Propósito:** No class-level `@Roles(...)` — same policy as Sales/Purchases/Tickets: creating a Cotización is an operational action for whoever runs the register, not an admin-only one. `ListQuotationsUseCase`/ `GetQuotationByIdUseCase` still restrict *which* quotations a non-admin can see (only their own), enforced in the use case. `void` is the one admin-gated route — correcting an already-created quotation is a management action, same policy as Tickets'/`BankDepositsController`'s own void route.
- **Dependencias inyectadas (constructor):** `createQuotationUseCase: CreateQuotationUseCase`, `listQuotationsUseCase: ListQuotationsUseCase`, `getQuotationByIdUseCase: GetQuotationByIdUseCase`, `voidQuotationUseCase: VoidQuotationUseCase`, `getQuotationPdfUseCase: GetQuotationPdfUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 56–70 | `dto: CreateQuotationRequestDto`, `userId: string` | `Promise<QuotationResponseDto>` |
| `findAll` | método public | 72–82 | `query: ListQuotationsQueryDto`, `user: RequestUser` | `Promise<PaginatedQuotationsResponseDto>` |
| `getPdf` | método public async | 90–106 | `id: string`, `user: RequestUser`, `res: Response` | `Promise<void>` |
| `voidQuotation` | método public | 109–122 | `id: string`, `dto: VoidQuotationRequestDto`, `userId: string` | `Promise<QuotationResponseDto>` |
| `findOne` | método public | 124–133 | `id: string`, `user: RequestUser` | `Promise<QuotationResponseDto>` |

##### `QuotationsController.create`

- **Firma:** `create(dto: CreateQuotationRequestDto, userId: string): Promise<QuotationResponseDto>` — [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L56) (L56–70)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createQuotationUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationsController.findAll`

- **Firma:** `findAll(query: ListQuotationsQueryDto, user: RequestUser): Promise<PaginatedQuotationsResponseDto>` — [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L72) (L72–82)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listQuotationsUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationsController.getPdf`

- **Firma:** `getPdf(id: string, user: RequestUser, res: Response): Promise<void>` — [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L90) (L90–106)
- **Decoradores:** `@Get(':id/pdf')`
- **Propósito / descripción:** Reconstructs the quotation's PDF purely from already-persisted, historicized data — never re-runs `create_quotation`. Declared before `:id` so it isn't swallowed by that route's `ParseUUIDPipe` matching on `id`, matching Sales'/Purchases'/Tickets' own route-ordering discipline.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.getQuotationPdfUseCase.execute`, `ADMIN_ROLES.includes`, `res.set`, `id.slice`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationsController.voidQuotation`

- **Firma:** `voidQuotation(id: string, dto: VoidQuotationRequestDto, userId: string): Promise<QuotationResponseDto>` — [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L109) (L109–122)
- **Decoradores:** `@Post(':id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** Anular — never a physical delete/edit, see `VoidQuotationUseCase`.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidQuotationUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationsController.findOne`

- **Firma:** `findOne(id: string, user: RequestUser): Promise<QuotationResponseDto>` — [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L124) (L124–133)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getQuotationByIdUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-create-quotation-request-dto-ts"></a>

### create-quotation.request.dto.ts

- **Ruta:** [create-quotation.request.dto.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/dtos/create-quotation.request.dto.ts) (`comercial-jhoel-api/src/modules/quotations/presentation/dtos/create-quotation.request.dto.ts`, 55 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** DTO de entrada: declara `CreateQuotationItemRequestDto`, `CreateQuotationRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

#### Clase `CreateQuotationItemRequestDto` (L15–26)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CreateQuotationRequestDto` (L28–54)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-list-quotations-query-dto-ts"></a>

### list-quotations.query.dto.ts

- **Ruta:** [list-quotations.query.dto.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/dtos/list-quotations.query.dto.ts) (`comercial-jhoel-api/src/modules/quotations/presentation/dtos/list-quotations.query.dto.ts`, 53 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** DTO de consulta: declara `ListQuotationsQueryDto`, `STATUS_VALUES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

#### Clase `ListQuotationsQueryDto` (L21–52)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-quotation-response-dto-ts"></a>

### quotation.response.dto.ts

- **Ruta:** [quotation.response.dto.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/dtos/quotation.response.dto.ts) (`comercial-jhoel-api/src/modules/quotations/presentation/dtos/quotation.response.dto.ts`, 59 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** DTO de respuesta: declara `QuotationItemResponseDto`, `QuotationResponseDto`, `QuotationSummaryResponseDto`, `PaginatedQuotationsResponseDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation-output.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts)
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

#### Clase `QuotationItemResponseDto` (L3–13)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `QuotationResponseDto` (L15–38)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `QuotationSummaryResponseDto` (L40–51)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedQuotationsResponseDto` (L53–58)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-void-quotation-request-dto-ts"></a>

### void-quotation.request.dto.ts

- **Ruta:** [void-quotation.request.dto.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/dtos/void-quotation.request.dto.ts) (`comercial-jhoel-api/src/modules/quotations/presentation/dtos/void-quotation.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Mirrors `VoidTicketRequestDto`'s own mandatory-reason shape — this module's own copy rather than a cross-module import.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

#### Clase `VoidQuotationRequestDto` (L4–10)

- **Propósito:** Mirrors `VoidTicketRequestDto`'s own mandatory-reason shape — this module's own copy rather than a cross-module import.
<a id="f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts"></a>

### quotations.module.ts

- **Ruta:** [quotations.module.ts](../../../../comercial-jhoel-api/src/modules/quotations/quotations.module.ts) (`comercial-jhoel-api/src/modules/quotations/quotations.module.ts`, 33 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Módulo: declara `QuotationsModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts), [quotation-detail.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-detail-orm-entity-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts), [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [list-quotations.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-list-quotations-use-case-ts), [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts), [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts), [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts), [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts), [company-settings.module.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `QuotationsModule` (L16–32)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([QuotationOrmEntity, QuotationDetailOrmEntity]), ClientsModule, CompanySettingsModule, ], controllers: [QuotationsC`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
