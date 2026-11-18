# Módulo backend `quotations`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/quotations` | [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L66) `QuotationsController.create` | [CreateQuotationUseCase](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts) | `QuotationRepository`.createQuotation → `create_quotation`<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) | `QuotationsService.createQuotation` |
| `GET /api/quotations` | [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L87) `QuotationsController.findAll` | [ListQuotationsUseCase](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-list-quotations-use-case-ts) | `QuotationRepository`.findAll | UseGuards(JwtAuthGuard) | `QuotationsService.getQuotations` |
| `GET /api/quotations/:id/pdf` | [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L105) `QuotationsController.getPdf` | [GetQuotationPdfUseCase](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts) | `QuotationRepository`.findById<br>`CompanySettingsRepository`.get | UseGuards(JwtAuthGuard) | `QuotationsService.exportQuotationPdf` |
| `POST /api/quotations/:id/status` | [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L124) `QuotationsController.changeStatus` | [ChangeQuotationStatusUseCase](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts) | `QuotationRepository`.changeStatus → `change_quotation_status` | UseGuards(JwtAuthGuard) | `QuotationsService.changeStatus` |
| `GET /api/quotations/:id/sale-preview` | [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L143) `QuotationsController.salePreview` | [GetQuotationSalePreviewUseCase](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts) | `QuotationRepository`.salePreview [quotation_details, products, inventory_locations, inventory_stock] | UseGuards(JwtAuthGuard) | `QuotationsService.getSalePreview` |
| `POST /api/quotations/:id/confirm-sale` | [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L158) `QuotationsController.confirmSale` | [ConvertQuotationToSaleUseCase](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts) | `QuotationRepository`.convertToSale/findById → `convert_quotation_to_sale` | UseGuards(JwtAuthGuard) | `QuotationsService.confirmSale` |
| `POST /api/quotations/:id/void` | [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L171) `QuotationsController.voidQuotation` | [VoidQuotationUseCase](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts) | `QuotationRepository`.findById/changeStatus → `change_quotation_status` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `QuotationsService.voidQuotation` |
| `GET /api/quotations/:id` | [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L186) `QuotationsController.findOne` | [GetQuotationByIdUseCase](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts) | `QuotationRepository`.findById | UseGuards(JwtAuthGuard) | `QuotationsService.getQuotationById` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [quotation-output.ts](#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | `'VENCIDA'` is never stored — a `'PENDIENTE'` row whose `expirationDate` has already passed displays as `'VENCIDA'` here, same "derive, don't store, an overdue/expired state" precedent this codebase already established for `purchases.paymentStatus`. | 2 internas | 6 | Media (6 consumidores) |
| [create-quotation.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makeQuotation`, `makeClient` (sin comentario de documentación en el código). | 10 internas | 0 | Soporte (pruebas) |
| [create-quotation.use-case.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts) | .ts | Caso de uso | Aplicación | Creates a Cotización for a customer typed in by hand (no `clients` row is created) or, for backwards compatibility, a registered client. | 10 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-quotation-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetQuotationByIdUseCase`, `GetQuotationByIdInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-quotation-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | Reconstructs the quotation's PDF purely from already-persisted, historicized data — never re-runs `create_quotation`, never re-reads the product's *current* price, never touches inventory. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-quotations.use-case.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-list-quotations-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListQuotationsUseCase`, `ListQuotationsInput`, `ListQuotationsOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [quotation-sale.use-cases.spec.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `quotation`, `repository`, `owner`, `stranger` (sin comentario de documentación en el código). | 5 internas | 0 | Soporte (pruebas) |
| [quotation-sale.use-cases.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts) | .ts | Caso de uso | Aplicación | Confirmar borrador / Aceptar / Rechazar — commercial status only, never inventory. | 5 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [void-quotation.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makeQuotation` (sin comentario de documentación en el código). | 5 internas | 0 | Soporte (pruebas) |
| [void-quotation.use-case.ts](#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts) | .ts | Caso de uso | Aplicación | Anular (status CANCELADA) — never a physical delete/edit. | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [today-iso-date.ts](#f-comercial-jhoel-api-src-modules-quotations-application-utils-today-iso-date-ts) | .ts | Utilidad | Aplicación | `yyyy-MM-dd` in local server time — this module's own copy, matching the per-module convention already established by `recharges`/`bank-deposits`/ `banks`/`alerts` (each owns a tiny copy rather than sharing one utility). | 0 internas | 4 | Media (4 consumidores) |
| [quotation-detail.entity.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-detail-entity-ts) | .ts | Entidad de dominio | Dominio | A frozen line item — every field is snapshotted at the moment the quotation was created, never recomputed from the live product. | 0 internas | 2 | Baja (2 consumidores) |
| [quotation.entity.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts) | .ts | Entidad de dominio | Dominio | A Cotización is explicitly NOT a sale — saving it never touches inventory; only "Confirmar venta" (`convert_quotation_to_sale`) creates a real sale through Ventas. | 1 internas | 9 | Media (9 consumidores) |
| [invalid-client.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-client-error-ts) | .ts | Errores de dominio | Dominio | The referenced client doesn't exist or is deactivated — this module's own copy, mirroring `sales`'/`tickets`' `InvalidClientError` (each module owns its error classes, even for a shared concept). | 1 internas | 3 | Media (3 consumidores) |
| [invalid-expiration-date.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-expiration-date-error-ts) | .ts | Errores de dominio | Dominio | `expirationDate` may never be before the quotation's own creation date — checked in TypeScript as a fast pre-check (`CreateQuotationUseCase`) in addition to the SQL function's own `INVALID_EXPIRATION_DATE` guard, same "TypeScript pre-check + SQL is the real guarantee" split used throughout this codebase. | 1 internas | 3 | Media (3 consumidores) |
| [invalid-quotation-discount.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-discount-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidQuotationDiscountError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-quotation-quantity.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-quantity-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidQuotationQuantityError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [quotation-access-denied.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-access-denied-error-ts) | .ts | Errores de dominio | Dominio | A USER account trying to view a quotation that isn't theirs — ADMIN/SUPER_ADMIN can view any quotation. | 1 internas | 4 | Media (4 consumidores) |
| [quotation-already-voided.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-already-voided-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `QuotationAlreadyVoidedError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [quotation-empty.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-empty-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `QuotationEmptyError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [quotation-not-found.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `QuotationNotFoundError` (sin comentario de documentación en el código). | 1 internas | 5 | Media (5 consumidores) |
| [quotation-product-inactive.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-product-inactive-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `QuotationProductInactiveError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [quotation-product-not-found.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-product-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `QuotationProductNotFoundError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [quotation-rule.error.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-rule-error-ts) | .ts | Errores de dominio | Dominio | Business rules of the commercial life cycle and "Confirmar venta" (migration 1760008200000). | 1 internas | 3 | Media (3 consumidores) |
| [quotation.repository.ts](#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateQuotationItemData`, `QuotationCustomerData`, `CreateQuotationData`, `QuotationSalePreviewLine`, `FindQuotationsOptions` (sin comentario de documentación en el código). | 1 internas | 12 | Alta (12 consumidores) |
| [quotation-pdf.builder.ts](#f-comercial-jhoel-api-src-modules-quotations-infrastructure-pdf-quotation-pdf-builder-ts) | .ts | Builder | Infraestructura | `yyyy-MM-dd` -&gt; `dd/mm/yyyy`, no `Date` round-trip — same reasoning `formatRechargeDate` already established for a plain `DATE` column. | 1 internas; ext.: pdfkit | 1 | Baja (1 consumidores) |
| [quotation-detail.orm-entity.ts](#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-detail-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `QuotationDetailOrmEntity` (sin comentario de documentación en el código). | 2 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [quotation.mapper.ts](#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `QuotationMapper` (sin comentario de documentación en el código). | 3 internas | 1 | Baja (1 consumidores) |
| [quotation.orm-entity.ts](#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `QuotationOrmEntity` (sin comentario de documentación en el código). | 5 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [typeorm-quotation.repository.ts](#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmQuotationRepository` (sin comentario de documentación en el código). | 13 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [quotations.controller.ts](#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts) | .ts | Controlador | Presentación | No class-level `@Roles(...)` — same policy as Sales/Purchases/Tickets: creating a Cotización is an operational action for whoever runs the register, not an admin-only one. | 15 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [create-quotation.request.dto.ts](#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-create-quotation-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateQuotationItemRequestDto`, `CreateQuotationRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [list-quotations.query.dto.ts](#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-list-quotations-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListQuotationsQueryDto`, `STATUS_VALUES` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [quotation-status.request.dto.ts](#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-quotation-status-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `QuotationStatusRequestDto`, `QUOTATION_OPERATOR_ACTIONS` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [quotation.response.dto.ts](#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-quotation-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `QuotationItemResponseDto`, `QuotationResponseDto`, `QuotationSummaryResponseDto`, `PaginatedQuotationsResponseDto`, `QuotationSalePreviewResponseDto` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [void-quotation.request.dto.ts](#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-void-quotation-request-dto-ts) | .ts | DTO de entrada | Presentación | Mirrors `VoidTicketRequestDto`'s own mandatory-reason shape — this module's own copy rather than a cross-module import. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [quotations.module.ts](#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `QuotationsModule` (sin comentario de documentación en el código). | 13 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts"></a>

### quotation-output.ts

- **Ruta:** [quotation-output.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/dtos/quotation-output.ts) (`comercial-jhoel-api/src/modules/quotations/application/dtos/quotation-output.ts`, 151 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** `'VENCIDA'` is never stored — a `'PENDIENTE'` row whose `expirationDate` has already passed displays as `'VENCIDA'` here, same "derive, don't store, an overdue/expired state" precedent this codebase already established for `purchases.paymentStatus`.
- **Depende de (archivos del proyecto):** [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts), [today-iso-date.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-utils-today-iso-date-ts)
- **Consumidores:** [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [list-quotations.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-list-quotations-use-case-ts), [quotation-sale.use-cases.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts), [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts), [quotation.response.dto.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-quotation-response-dto-ts)

**Interfaces, tipos y enums:**

- `interface QuotationItemOutput` (L7): sin documentación — miembros: `id`, `productId`, `productName`, `presentationName`, `quantity`, `unitPrice`, `discount`, `subtotal`, `total`
- `interface QuotationOutput` (L20): Full shape — used for `GET /quotations/:id`, the response of `POST /quotations`, and `POST /quotations/:id/void`. — miembros: `id`, `quotationNumber`, `clientId`, `clientName`, `customerPhone`, `studentName`, `grade`, `userId`, `username`, `quotationDate`, `expirationDate`, `subtotal`, `discount`, `total`, `observations`, `commercialTerms`, `status`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `convertedToSaleId`, `acceptedAt`, `rejectedAt`, `rejectReason`…
- `interface QuotationSummaryOutput` (L54): Lighter shape for `GET /quotations` — no line items, so listing quotations never needs to load them. — miembros: `id`, `quotationNumber`, `clientId`, `clientName`, `customerPhone`, `studentName`, `grade`, `userId`, `username`, `expirationDate`, `total`, `status`, `createdAt`
- `type QuotationDisplayStatus` (L5) = `Quotation['status'] \| 'VENCIDA'` — Stored status, or VENCIDA for a COTIZADA past its expiration date.
#### Función `deriveDisplayStatus` (L77–85)

- **Tipo:** función local del archivo
- **Firma:** `deriveDisplayStatus(status: Quotation['status'], expirationDate: string): QuotationDisplayStatus` — [quotation-output.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/dtos/quotation-output.ts#L77)
- **Propósito / descripción:** `'VENCIDA'` is never stored — a `'PENDIENTE'` row whose `expirationDate` has already passed displays as `'VENCIDA'` here, same "derive, don't store, an overdue/expired state" precedent this codebase already established for `purchases.paymentStatus`. `'ACEPTADA'`/`'ANULADA'` are terminal and never get overridden, even past their expiration date.
- **Dependencias:** `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toQuotationOutput` (L87–130)

- **Tipo:** función exportada
- **Firma:** `toQuotationOutput(quotation: Quotation): QuotationOutput` — [quotation-output.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/dtos/quotation-output.ts#L87)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `deriveDisplayStatus`, `quotation.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [quotation-sale.use-cases.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts), [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts)

#### Función `toQuotationSummaryOutput` (L132–150)

- **Tipo:** función exportada
- **Firma:** `toQuotationSummaryOutput(quotation: Quotation): QuotationSummaryOutput` — [quotation-output.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/dtos/quotation-output.ts#L132)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `deriveDisplayStatus`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts"></a>

### create-quotation.use-case.spec.ts

- **Ruta:** [create-quotation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.spec.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.spec.ts`, 243 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Prueba unitaria: declara `makeQuotation`, `makeClient` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [quotation-empty.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-empty-error-ts), [invalid-quotation-quantity.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-quantity-error-ts), [invalid-client.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-client-error-ts), [invalid-expiration-date.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-expiration-date-error-ts), [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts), [client.entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-entities-client-entity-ts), [today-iso-date.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-utils-today-iso-date-ts)
- **Consumidores:** —
#### Función `makeQuotation` (L12–45)

- **Tipo:** función local del archivo
- **Firma:** `makeQuotation(): Quotation` — [create-quotation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.spec.ts#L12)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Quotation.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `makeClient` (L47–59)

- **Tipo:** función local del archivo
- **Firma:** `makeClient(isActive: boolean): Client` — [create-quotation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.spec.ts#L47)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Client.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts"></a>

### create-quotation.use-case.ts

- **Ruta:** [create-quotation.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.ts`, 129 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Creates a Cotización for a customer typed in by hand (no `clients` row is created) or, for backwards compatibility, a registered client.
- **Depende de (archivos del proyecto):** [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [quotation-empty.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-empty-error-ts), [invalid-quotation-quantity.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-quantity-error-ts), [invalid-quotation-discount.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-discount-error-ts), [invalid-client.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-client-error-ts), [invalid-expiration-date.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-expiration-date-error-ts), [quotation-rule.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-rule-error-ts), [quotation-output.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts), [today-iso-date.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateQuotationItemInput` (L15): sin documentación — miembros: `productId`, `quantity`, `discount`
- `interface CreateQuotationInput` (L21): sin documentación — miembros: `userId`, `clientId`, `customerName`, `customerPhone`, `studentName`, `grade`, `asDraft`, `expirationDate`, `observations`, `commercialTerms`, `items`

#### Clase `CreateQuotationUseCase` (L44–128)

- **Decoradores:** `@Injectable()`
- **Propósito:** Creates a Cotización for a customer typed in by hand (no `clients` row is created) or, for backwards compatibility, a registered client. Saving a quotation NEVER touches inventory — `create_quotation` writes only the quotation and its lines; stock moves only on "Confirmar venta".
- **Dependencias inyectadas (constructor):** `@Inject(QUOTATION_REPOSITORY) quotationRepository: QuotationRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 53–127 | `input: CreateQuotationInput` | `Promise<QuotationOutput>` |

##### `CreateQuotationUseCase.execute`

- **Firma:** `execute(input: CreateQuotationInput): Promise<QuotationOutput>` — [create-quotation.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.ts#L53) (L53–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new QuotationEmptyError`, `this.clientRepository.findById`, `new InvalidClientError`, `input.customerName?.trim`, `input.customerPhone?.trim`, `quotationRuleError`, `PHONE.test`, `phone.replace`, `todayIsoDate`, `new InvalidExpirationDateError`, `Number.isInteger`, `new InvalidQuotationQuantityError`, `new InvalidQuotationDiscountError`, `new Map`, `mergedByProduct.get`, `mergedByProduct.set`, `[...mergedByProduct.entries()].map`, `mergedByProduct.entries`…
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new QuotationEmptyError()`, `new InvalidClientError()`, `quotationRuleError('QUOTATION_INVALID_CUSTOMER_NAME')`, `quotationRuleError('QUOTATION_INVALID_PHONE')`, `new InvalidExpirationDateError()`, `new InvalidQuotationQuantityError(item.productId)`, `new InvalidQuotationDiscountError(item.productId)`
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

- **Ruta:** [get-quotation-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/get-quotation-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/get-quotation-pdf.use-case.ts`, 75 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Reconstructs the quotation's PDF purely from already-persisted, historicized data — never re-runs `create_quotation`, never re-reads the product's *current* price, never touches inventory.
- **Depende de (archivos del proyecto):** [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation-not-found.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-not-found-error-ts), [quotation-access-denied.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-access-denied-error-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [quotation-pdf.builder.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-pdf-quotation-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

**Interfaces, tipos y enums:**

- `interface GetQuotationPdfInput` (L10): sin documentación — miembros: `currentUserId`, `isAdmin`

#### Clase `GetQuotationPdfUseCase` (L22–74)

- **Decoradores:** `@Injectable()`
- **Propósito:** Reconstructs the quotation's PDF purely from already-persisted, historicized data — never re-runs `create_quotation`, never re-reads the product's *current* price, never touches inventory. Same ownership rule as `GetQuotationByIdUseCase`. A quotation has no draft concept (created in one shot), so there's no draft-rejection branch.
- **Dependencias inyectadas (constructor):** `@Inject(QUOTATION_REPOSITORY) quotationRepository: QuotationRepository`, `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 31–73 | `id: string`, `input: GetQuotationPdfInput` | `Promise<Buffer>` |

##### `GetQuotationPdfUseCase.execute`

- **Firma:** `execute(id: string, input: GetQuotationPdfInput): Promise<Buffer>` — [get-quotation-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/get-quotation-pdf.use-case.ts#L31) (L31–73)
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

<a id="f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-spec-ts"></a>

### quotation-sale.use-cases.spec.ts

- **Ruta:** [quotation-sale.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/quotation-sale.use-cases.spec.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/quotation-sale.use-cases.spec.ts`, 150 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Prueba unitaria: declara `quotation`, `repository`, `owner`, `stranger` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts), [quotation-sale.use-cases.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts), [quotation-access-denied.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-access-denied-error-ts), [quotation-rule.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-rule-error-ts)
- **Consumidores:** —
#### Función `quotation` (L11–47)

- **Tipo:** función local del archivo
- **Firma:** `quotation(status: Quotation['status'], overrides?: Partial<{ userId: string; expirationDate: string }>): Quotation` — [quotation-sale.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/quotation-sale.use-cases.spec.ts#L11)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Quotation.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `repository` (L49–69)

- **Tipo:** función local del archivo
- **Firma:** `repository(current: Quotation): jest.Mocked<QuotationRepository>` — [quotation-sale.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/quotation-sale.use-cases.spec.ts#L49)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `jest.fn`, `jest.fn().mockResolvedValue`, `quotation`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts"></a>

### quotation-sale.use-cases.ts

- **Ruta:** [quotation-sale.use-cases.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/quotation-sale.use-cases.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/quotation-sale.use-cases.ts`, 113 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Confirmar borrador / Aceptar / Rechazar — commercial status only, never inventory.
- **Depende de (archivos del proyecto):** [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation-not-found.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-not-found-error-ts), [quotation-access-denied.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-access-denied-error-ts), [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts), [quotation-output.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [quotation-sale.use-cases.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-spec-ts), [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

**Interfaces, tipos y enums:**

- `interface QuotationActor` (L13): sin documentación — miembros: `currentUserId`, `isAdmin`

#### Clase `ChangeQuotationStatusUseCase` (L35–57)

- **Decoradores:** `@Injectable()`
- **Propósito:** Confirmar borrador / Aceptar / Rechazar — commercial status only, never inventory.
- **Dependencias inyectadas (constructor):** `@Inject(QUOTATION_REPOSITORY) repository: QuotationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 42–56 | `id: string`, `action: Exclude<QuotationStatusAction, 'CANCELAR'>`, `reason: string \| null`, `actor: QuotationActor` | `Promise<QuotationOutput>` |

##### `ChangeQuotationStatusUseCase.execute`

- **Firma:** `execute(id: string, action: Exclude<QuotationStatusAction, 'CANCELAR'>, reason: string \| null, actor: QuotationActor): Promise<QuotationOutput>` — [quotation-sale.use-cases.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/quotation-sale.use-cases.ts#L42) (L42–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `loadOwned`, `this.repository.changeStatus`, `toQuotationOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)


#### Clase `GetQuotationSalePreviewUseCase` (L60–88)

- **Decoradores:** `@Injectable()`
- **Propósito:** Summary shown before "Confirmar venta": quoted lines with the current Vitrina stock.
- **Dependencias inyectadas (constructor):** `@Inject(QUOTATION_REPOSITORY) repository: QuotationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 67–87 | `id: string`, `actor: QuotationActor` | `Promise<{ quotation: QuotationOutput; lines: QuotationSalePreviewLine[]; canConfirm: boolean; }>` |

##### `GetQuotationSalePreviewUseCase.execute`

- **Firma:** `execute(id: string, actor: QuotationActor): Promise<{ quotation: QuotationOutput; lines: QuotationSalePreviewLine[]; canConfirm: boolean; }>` — [quotation-sale.use-cases.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/quotation-sale.use-cases.ts#L67) (L67–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `toQuotationOutput`, `loadOwned`, `this.repository.salePreview`, `lines.every`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)


#### Clase `ConvertQuotationToSaleUseCase` (L96–112)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Confirmar venta": converts the quotation into ONE sale through the existing Ventas function (`confirm_sale`, Vitrina stock, movements), with the quoted prices, in one PostgreSQL transaction. Calling it again (double click, retry) returns the same sale without discounting stock twice.
- **Dependencias inyectadas (constructor):** `@Inject(QUOTATION_REPOSITORY) repository: QuotationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 103–111 | `id: string`, `actor: QuotationActor` | `Promise<{ saleId: string; quotation: QuotationOutput }>` |

##### `ConvertQuotationToSaleUseCase.execute`

- **Firma:** `execute(id: string, actor: QuotationActor): Promise<{ saleId: string; quotation: QuotationOutput }>` — [quotation-sale.use-cases.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/quotation-sale.use-cases.ts#L103) (L103–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `loadOwned`, `this.repository.convertToSale`, `this.repository.findById`, `toQuotationOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

#### Función `loadOwned` (L19–32)

- **Tipo:** función local del archivo, async
- **Firma:** `loadOwned(repository: QuotationRepository, id: string, actor: QuotationActor): Promise<Quotation>` — [quotation-sale.use-cases.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/quotation-sale.use-cases.ts#L19)
- **Propósito / descripción:** Same ownership rule as GetQuotationByIdUseCase: a non-admin acts only on their own quotations.
- **Dependencias:** `repository.findById`, `new QuotationNotFoundError`, `new QuotationAccessDeniedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new QuotationNotFoundError(id)`, `new QuotationAccessDeniedError()`
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts"></a>

### void-quotation.use-case.spec.ts

- **Ruta:** [void-quotation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/void-quotation.use-case.spec.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/void-quotation.use-case.spec.ts`, 101 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Prueba unitaria: declara `makeQuotation` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts), [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation-not-found.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-not-found-error-ts), [quotation-already-voided.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-already-voided-error-ts), [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts)
- **Consumidores:** —
#### Función `makeQuotation` (L10–44)

- **Tipo:** función local del archivo
- **Firma:** `makeQuotation(status: QuotationStoredStatus): Quotation` — [void-quotation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/void-quotation.use-case.spec.ts#L10)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Quotation.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts"></a>

### void-quotation.use-case.ts

- **Ruta:** [void-quotation.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/void-quotation.use-case.ts) (`comercial-jhoel-api/src/modules/quotations/application/use-cases/void-quotation.use-case.ts`, 44 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Anular (status CANCELADA) — never a physical delete/edit.
- **Depende de (archivos del proyecto):** [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation-not-found.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-not-found-error-ts), [quotation-already-voided.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-already-voided-error-ts), [quotation-output.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [void-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts), [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

**Interfaces, tipos y enums:**

- `interface VoidQuotationInput` (L8): sin documentación — miembros: `id`, `voidedBy`, `reason`

#### Clase `VoidQuotationUseCase` (L19–43)

- **Decoradores:** `@Injectable()`
- **Propósito:** Anular (status CANCELADA) — never a physical delete/edit. Runs through `change_quotation_status('CANCELAR')`, which locks the row and refuses a VENDIDA quotation (its sale must be voided in Ventas first).
- **Dependencias inyectadas (constructor):** `@Inject(QUOTATION_REPOSITORY) quotationRepository: QuotationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 26–42 | `input: VoidQuotationInput` | `Promise<QuotationOutput>` |

##### `VoidQuotationUseCase.execute`

- **Firma:** `execute(input: VoidQuotationInput): Promise<QuotationOutput>` — [void-quotation.use-case.ts](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/void-quotation.use-case.ts#L26) (L26–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quotationRepository.findById`, `new QuotationNotFoundError`, `new QuotationAlreadyVoidedError`, `this.quotationRepository.changeStatus`, `toQuotationOutput`
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

- **Ruta:** [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts) (`comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts`, 182 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** A Cotización is explicitly NOT a sale — saving it never touches inventory; only "Confirmar venta" (`convert_quotation_to_sale`) creates a real sale through Ventas.
- **Depende de (archivos del proyecto):** [quotation-detail.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-detail-entity-ts)
- **Consumidores:** [quotation-output.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts), [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [quotation-sale.use-cases.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-spec-ts), [quotation-sale.use-cases.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts), [void-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts), [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation.mapper.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts), [quotation.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

**Interfaces, tipos y enums:**

- `interface QuotationProps` (L7): sin documentación — miembros: `id`, `quotationNumber`, `clientId`, `clientName`, `customerPhone`, `studentName`, `grade`, `userId`, `username`, `quotationDate`, `expirationDate`, `subtotal`, `discount`, `total`, `observations`, `commercialTerms`, `status`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `convertedToSaleId`, `acceptedAt`, `rejectedAt`, `rejectReason`…
- `type QuotationStoredStatus` (L4) = `'BORRADOR' \| 'COTIZADA' \| 'ACEPTADA' \| 'VENDIDA' \| 'RECHAZADA' \| 'CANCELADA'` — Commercial life cycle (migration 1760008200000).

#### Clase `Quotation` (L55–181)

- **Propósito:** A Cotización is explicitly NOT a sale — saving it never touches inventory; only "Confirmar venta" (`convert_quotation_to_sale`) creates a real sale through Ventas. Original notes: a Cotización is explicitly NOT a sale — created in one shot (like a Ticket/Purchase), never touches `products.stock`/`inventory_stock`/ `inventory_movements` (see `create_quotation()`), never appears in Sales reports/dashboard. Every line item is historicized at creation time, so a later product price change never alters an already-saved quotation. Correction is anular-and-recreate, never a silent edit.
- **Dependencias inyectadas (constructor):** `props: QuotationProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 58–60 | `props: QuotationProps` | `Quotation` |
| `id` | getter public | 62–64 | — | `string` |
| `quotationNumber` | getter public | 66–68 | — | `string` |
| `clientId` | getter public | 70–72 | — | `string \| null` |
| `clientName` | getter public | 74–76 | — | `string` |
| `customerPhone` | getter public | 78–80 | — | `string \| null` |
| `studentName` | getter public | 82–84 | — | `string \| null` |
| `grade` | getter public | 86–88 | — | `string \| null` |
| `acceptedAt` | getter public | 90–92 | — | `Date \| null` |
| `rejectedAt` | getter public | 94–96 | — | `Date \| null` |
| `rejectReason` | getter public | 98–100 | — | `string \| null` |
| `soldAt` | getter public | 102–104 | — | `Date \| null` |
| `soldByUsername` | getter public | 106–108 | — | `string \| null` |
| `userId` | getter public | 110–112 | — | `string` |
| `username` | getter public | 114–116 | — | `string` |
| `quotationDate` | getter public | 118–120 | — | `Date` |
| `expirationDate` | getter public | 122–124 | — | `string` |
| `subtotal` | getter public | 126–128 | — | `number` |
| `discount` | getter public | 130–132 | — | `number` |
| `total` | getter public | 134–136 | — | `number` |
| `observations` | getter public | 138–140 | — | `string \| null` |
| `commercialTerms` | getter public | 142–144 | — | `string \| null` |
| `status` | getter public | 146–148 | — | `QuotationStoredStatus` |
| `voidedAt` | getter public | 150–152 | — | `Date \| null` |
| `voidedBy` | getter public | 154–156 | — | `string \| null` |
| `voidedByUsername` | getter public | 158–160 | — | `string \| null` |
| `voidReason` | getter public | 162–164 | — | `string \| null` |
| `convertedToSaleId` | getter public | 166–168 | — | `string \| null` |
| `items` | getter public | 170–172 | — | `QuotationDetail[]` |
| `createdAt` | getter public | 174–176 | — | `Date` |
| `updatedAt` | getter public | 178–180 | — | `Date` |

##### `Quotation.create`

- **Firma:** `create(props: QuotationProps): Quotation` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Quotation`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [quotation-sale.use-cases.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-spec-ts), [void-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts), [quotation.mapper.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts)

##### `Quotation.id`

- **Firma:** `id(): string` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L62) (L62–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.quotationNumber`

- **Firma:** `quotationNumber(): string` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L66) (L66–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.clientId`

- **Firma:** `clientId(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L70) (L70–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.clientName`

- **Firma:** `clientName(): string` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.customerPhone`

- **Firma:** `customerPhone(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.studentName`

- **Firma:** `studentName(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.grade`

- **Firma:** `grade(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L86) (L86–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.acceptedAt`

- **Firma:** `acceptedAt(): Date \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L90) (L90–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.rejectedAt`

- **Firma:** `rejectedAt(): Date \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L94) (L94–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.rejectReason`

- **Firma:** `rejectReason(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L98) (L98–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.soldAt`

- **Firma:** `soldAt(): Date \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L102) (L102–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.soldByUsername`

- **Firma:** `soldByUsername(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L106) (L106–108)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.userId`

- **Firma:** `userId(): string` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L110) (L110–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.username`

- **Firma:** `username(): string` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L114) (L114–116)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.quotationDate`

- **Firma:** `quotationDate(): Date` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L118) (L118–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.expirationDate`

- **Firma:** `expirationDate(): string` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L122) (L122–124)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.subtotal`

- **Firma:** `subtotal(): number` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L126) (L126–128)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.discount`

- **Firma:** `discount(): number` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L130) (L130–132)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.total`

- **Firma:** `total(): number` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L134) (L134–136)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.observations`

- **Firma:** `observations(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L138) (L138–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.commercialTerms`

- **Firma:** `commercialTerms(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L142) (L142–144)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.status`

- **Firma:** `status(): QuotationStoredStatus` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L146) (L146–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.voidedAt`

- **Firma:** `voidedAt(): Date \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L150) (L150–152)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.voidedBy`

- **Firma:** `voidedBy(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L154) (L154–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.voidedByUsername`

- **Firma:** `voidedByUsername(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L158) (L158–160)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.voidReason`

- **Firma:** `voidReason(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L162) (L162–164)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.convertedToSaleId`

- **Firma:** `convertedToSaleId(): string \| null` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L166) (L166–168)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.items`

- **Firma:** `items(): QuotationDetail[]` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L170) (L170–172)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.createdAt`

- **Firma:** `createdAt(): Date` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L174) (L174–176)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Quotation.updatedAt`

- **Firma:** `updatedAt(): Date` — [quotation.entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/entities/quotation.entity.ts#L178) (L178–180)
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
- **Consumidores:** [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts), [quotation-sale.use-cases.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-spec-ts), [quotation-sale.use-cases.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts)

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
- **Consumidores:** [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts), [quotation-sale.use-cases.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts), [void-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts), [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts)

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
<a id="f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-rule-error-ts"></a>

### quotation-rule.error.ts

- **Ruta:** [quotation-rule.error.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-rule.error.ts) (`comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-rule.error.ts`, 117 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Business rules of the commercial life cycle and "Confirmar venta" (migration 1760008200000).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [quotation-sale.use-cases.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-spec-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

#### Clase `QuotationRuleError` (L8–16)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Business rules of the commercial life cycle and "Confirmar venta" (migration 1760008200000). One class with the stable `code` the SQL functions RAISE, carrying the user-facing message and HTTP status.
- **Dependencias inyectadas (constructor):** `code: string`, `message: string`, `status: number`
#### Función `quotationRuleError` (L99–102)

- **Tipo:** función exportada
- **Firma:** `quotationRuleError(code: string): QuotationRuleError` — [quotation-rule.error.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-rule.error.ts#L99)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new QuotationRuleError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts)

#### Función `quotationRuleErrorFromMessage` (L105–116)

- **Tipo:** función exportada
- **Firma:** `quotationRuleErrorFromMessage(message: string): QuotationRuleError \| null` — [quotation-rule.error.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/errors/quotation-rule.error.ts#L105)
- **Propósito / descripción:** Maps `RAISE EXCEPTION 'CODE[:detail…]'`; null when the code is not one of these rules.
- **Dependencias:** `message.split`, `DETAILED[code]`, `new QuotationRuleError`, `quotationRuleError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts"></a>

### quotation.repository.ts

- **Ruta:** [quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/domain/repositories/quotation.repository.ts) (`comercial-jhoel-api/src/modules/quotations/domain/repositories/quotation.repository.ts`, 95 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateQuotationItemData`, `QuotationCustomerData`, `CreateQuotationData`, `QuotationSalePreviewLine`, `FindQuotationsOptions` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts)
- **Consumidores:** [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts), [list-quotations.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-list-quotations-use-case-ts), [quotation-sale.use-cases.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-spec-ts), [quotation-sale.use-cases.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts), [void-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-spec-ts), [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts), [list-quotations.query.dto.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-list-quotations-query-dto-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateQuotationItemData` (L5): sin documentación — miembros: `productId`, `quantity`, `discount`
- `interface QuotationCustomerData` (L12): Customer typed in on the quotation (no `clients` row is created). — miembros: `name`, `phone`, `studentName`, `grade`
- `interface CreateQuotationData` (L19): sin documentación — miembros: `userId`, `clientId`, `customer`, `asDraft`, `expirationDate`, `observations`, `commercialTerms`, `items`
- `interface QuotationSalePreviewLine` (L46): One line of the "Confirmar venta" summary with the current Vitrina stock. — miembros: `productId`, `productName`, `quantity`, `unitPrice`, `total`, `available`, `isActive`, `sufficient`
- `interface FindQuotationsOptions` (L57): sin documentación — miembros: `userId`, `status`, `startDate`, `endDate`, `search`, `page`, `limit`
- `interface PaginatedResult` (L70): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface QuotationRepository` (L77): sin documentación — miembros: `createQuotation`, `findAll`, `findById`, `changeStatus`, `convertToSale`, `salePreview`
- `type QuotationStatusFilter` (L32) = `\| 'BORRADOR' \| 'COTIZADA' \| 'ACEPTADA' \| 'VENDIDA' \| 'RECHAZADA' \| 'CANCELADA' \| 'VENCIDA'` — A filter value of `'VENCIDA'` is never a stored status — it resolves to `status = 'PENDIENTE' AND expiration_date &lt; today`, the same derivation `toQuotationOutput` applies per-row.
- `type QuotationStatusAction` (L42) = `'CONFIRMAR' \| 'ACEPTAR' \| 'RECHAZAR' \| 'CANCELAR'` — Commercial actions (`change_quotation_status`).

**Constantes exportadas:**

- `QUOTATION_REPOSITORY` (L3) = `Symbol('QUOTATION_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-quotations-infrastructure-pdf-quotation-pdf-builder-ts"></a>

### quotation-pdf.builder.ts

- **Ruta:** [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts) (`comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts`, 303 líneas)
- **Tipo:** Builder · **Capa:** Infraestructura · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** `yyyy-MM-dd` -&gt; `dd/mm/yyyy`, no `Date` round-trip — same reasoning `formatRechargeDate` already established for a plain `DATE` column.
- **Depende de (archivos del proyecto):** [pdf-helpers.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-ts)
- **Paquetes externos:** `pdfkit`
- **Consumidores:** [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts)

**Interfaces, tipos y enums:**

- `interface QuotationPdfItem` (L10): sin documentación — miembros: `productName`, `presentationName`, `quantity`, `unitPrice`, `discount`, `total`
- `interface QuotationPdfOptions` (L19): sin documentación — miembros: `company`, `quotationNumber`, `quotationDate`, `expirationDate`, `clientName`, `customerPhone`, `studentName`, `grade`, `items`, `subtotal`, `discount`, `total`, `observations`, `commercialTerms`
#### Función `formatIsoDate` (L51–54)

- **Tipo:** función local del archivo
- **Firma:** `formatIsoDate(isoDate: string): string` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L51)
- **Propósito / descripción:** `yyyy-MM-dd` -&gt; `dd/mm/yyyy`, no `Date` round-trip — same reasoning `formatRechargeDate` already established for a plain `DATE` column.
- **Dependencias:** `isoDate.split`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildQuotationPdf` (L64–91)

- **Tipo:** función exportada
- **Firma:** `buildQuotationPdf(options: QuotationPdfOptions): Promise<Buffer>` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L64)
- **Propósito / descripción:** Reconstructs a Cotización proposal purely from already-persisted, historicized data (`QuotationOutput` + company settings) — never re-runs `create_quotation` or touches inventory, and never re-reads the product's *current* price. Professional/commercial A4 layout — genuinely distinct from Sale/Purchase's plain document style and Ticket's thermal-receipt style, per the approved plan.
- **Dependencias:** `new PDFDocument`, `doc.on`, `chunks.push`, `new Promise`, `resolve`, `Buffer.concat`, `drawCompanyLetterhead`, `doc.moveDown`, `drawDivider`, `drawDocumentInfo`, `drawTable`, `drawTotals`, `drawNotes`, `numberPages`, `doc.end`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts)

#### Función `drawDocumentInfo` (L93–143)

- **Tipo:** función local del archivo
- **Firma:** `drawDocumentInfo(doc: PDFKit.PDFDocument, options: QuotationPdfOptions): void` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L93)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `doc.fontSize(18).fillColor('#0f172a').text`, `doc.fontSize(18).fillColor`, `doc.fontSize`, `doc.fontSize(9).fillColor`, `doc.text`, `formatDateTime`, `formatIsoDate`, `doc.fontSize(10).fillColor('#0f172a').text`, `doc.fontSize(10).fillColor`, `doc.fontSize(9).fillColor('#334155').text`, `drawDivider`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawTable` (L145–206)

- **Tipo:** función local del archivo
- **Firma:** `drawTable(doc: PDFKit.PDFDocument, items: QuotationPdfItem[]): void` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L145)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `COLUMNS.reduce`, `doc.rect(startX, y, totalWidth, HEADER_ROW_HEIGHT).fill`, `doc.rect`, `doc.fontSize(9).fillColor`, `doc.fontSize`, `doc.text`, `doc.fillColor`, `doc.addPage`, `drawTableHeader`, `doc.moveDown`, `items.forEach`, `ensureSpace`, `doc.rect(startX, y, totalWidth, ROW_HEIGHT).fill`, `String`, `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawTotals` (L208–234)

- **Tipo:** función local del archivo
- **Firma:** `drawTotals(doc: PDFKit.PDFDocument, options: Pick<QuotationPdfOptions, 'subtotal' \| 'discount' \| 'total'>): void` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L208)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `doc.fontSize(10).fillColor`, `doc.fontSize`, `doc.text`, `formatCurrency`, `doc.fontSize(13).fillColor('#0f172a').text`, `doc.fontSize(13).fillColor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawNotes` (L236–276)

- **Tipo:** función local del archivo
- **Firma:** `drawNotes(doc: PDFKit.PDFDocument, options: Pick<QuotationPdfOptions, 'observations' \| 'commercialTerms'>): void` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L236)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `doc.fontSize(9).fillColor('#0f172a').text`, `doc.fontSize(9).fillColor`, `doc.fontSize`, `doc.fontSize(9).fillColor('#334155').text`, `doc.fontSize(9).fillColor('#64748b').text`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `numberPages` (L278–302)

- **Tipo:** función local del archivo
- **Firma:** `numberPages(doc: PDFKit.PDFDocument): void` — [quotation-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/pdf/quotation-pdf.builder.ts#L278)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.bufferedPageRange`, `doc.switchToPage`, `doc.fontSize(8).fillColor('#94a3b8').text`, `doc.fontSize(8).fillColor`, `doc.fontSize`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-detail-orm-entity-ts"></a>

### quotation-detail.orm-entity.ts

- **Ruta:** [quotation-detail.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation-detail.orm-entity.ts) (`comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation-detail.orm-entity.ts`, 77 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `QuotationDetailOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [quotation.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [quotation.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

#### Clase `QuotationDetailOrmEntity` (L11–76)

- **Decoradores:** `@Entity('quotation_details')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column quotationId: string`, `@ManyToOne quotation: QuotationOrmEntity`, `@Column productId: string`, `@Column productName: string`, `@Column presentationName: string \| null`, `@Column quantity: number`, `@Column unitPrice: number`, `@Column discount: number`, `@Column subtotal: number`, `@Column total: number`
<a id="f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts"></a>

### quotation.mapper.ts

- **Ruta:** [quotation.mapper.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation.mapper.ts) (`comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation.mapper.ts`, 54 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Mapper: declara `QuotationMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts), [quotation-detail.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-detail-entity-ts), [quotation.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts)
- **Consumidores:** [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

#### Clase `QuotationMapper` (L5–53)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 7–52 | `orm: QuotationOrmEntity` | `Quotation` |

##### `QuotationMapper.toDomain`

- **Firma:** `toDomain(orm: QuotationOrmEntity): Quotation` — [quotation.mapper.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation.mapper.ts#L7) (L7–52)
- **Propósito / descripción:** `orm.items` is `undefined` whenever the query didn't join `quotation_details` (the list view never does) — mapped to `[]`.
- **Dependencias (llamadas en su cuerpo):** `Quotation.create`, `(orm.items ?? []).map`, `QuotationDetail.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts"></a>

### quotation.orm-entity.ts

- **Ruta:** [quotation.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation.orm-entity.ts) (`comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/quotation.orm-entity.ts`, 175 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `QuotationOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [client.orm-entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [quotation-detail.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-detail-orm-entity-ts), [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [quotation-detail.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-detail-orm-entity-ts), [quotation.mapper.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

#### Clase `QuotationOrmEntity` (L17–174)

- **Decoradores:** `@Entity('quotations')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column quotationNumber: string`, `@Column clientId: string \| null`, `@ManyToOne client: ClientOrmEntity \| null`, `@Column customerName: string \| null`, `@Column customerPhone: string \| null`, `@Column studentName: string \| null`, `@Column grade: string \| null`, `@Column acceptedAt: Date \| null`, `@Column rejectedAt: Date \| null`, `@Column rejectReason: string \| null`, `@Column soldAt: Date \| null`, `@Column soldBy: string \| null`, `@ManyToOne soldByUser: UserOrmEntity \| null`, `@Column userId: string`, `@ManyToOne user: UserOrmEntity`, `@Column quotationDate: Date`, `@Column expirationDate: string`, `@Column subtotal: number`, `@Column discount: number`, `@Column total: number`, `@Column observations: string \| null`, `@Column commercialTerms: string \| null`, `@Column status: QuotationStoredStatus`, `@Column voidedAt: Date \| null`, `@Column voidedBy: string \| null`, `@ManyToOne voidedByUser: UserOrmEntity \| null`, `@Column voidReason: string \| null`, `@Column convertedToSaleId: string \| null`, `@OneToMany items: QuotationDetailOrmEntity[]`…
<a id="f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts"></a>

### typeorm-quotation.repository.ts

- **Ruta:** [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts) (`comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts`, 237 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmQuotationRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation.entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-entities-quotation-entity-ts), [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [quotation-rule.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-rule-error-ts), [quotation-empty.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-empty-error-ts), [invalid-client.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-client-error-ts), [quotation-product-not-found.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-product-not-found-error-ts), [quotation-product-inactive.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-quotation-product-inactive-error-ts), [invalid-quotation-quantity.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-quantity-error-ts), [invalid-quotation-discount.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-quotation-discount-error-ts), [invalid-expiration-date.error.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-errors-invalid-expiration-date-error-ts), [quotation.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts), [quotation.mapper.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-mapper-ts), [today-iso-date.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

#### Clase `TypeOrmQuotationRepository` (L25–236)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements QuotationRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(QuotationOrmEntity) repository: Repository<QuotationOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `createQuotation` | método public async | 32–72 | `data: CreateQuotationData` | `Promise<Quotation>` |
| `findAll` | método public async | 74–130 | `options: FindQuotationsOptions` | `Promise<PaginatedResult<Quotation>>` |
| `findById` | método public async | 132–138 | `id: string` | `Promise<Quotation \| null>` |
| `changeStatus` | método public async | 140–161 | `id: string`, `action: QuotationStatusAction`, `userId: string`, `reason: string \| null` | `Promise<Quotation>` |
| `convertToSale` | método public async | 163–173 | `id: string`, `userId: string` | `Promise<string>` |
| `salePreview` | método public async | 175–199 | `id: string` | `Promise<QuotationSalePreviewLine[]>` |
| `translateQuotationError` | método private | 202–235 | `error: unknown` | `unknown` |

##### `TypeOrmQuotationRepository.createQuotation`

- **Firma:** `createQuotation(data: CreateQuotationData): Promise<Quotation>` — [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts#L32) (L32–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `JSON.stringify`, `data.items.map`, `this.repository.manager.query`, `this.translateQuotationError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `create_quotation`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateQuotationError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la cotización recién creada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmQuotationRepository.findAll`

- **Firma:** `findAll(options: FindQuotationsOptions): Promise<PaginatedResult<Quotation>>` — [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts#L74) (L74–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('quotation').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `todayIsoDate`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `orms.map`, `QuotationMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmQuotationRepository.findById`

- **Firma:** `findById(id: string): Promise<Quotation \| null>` — [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts#L132) (L132–138)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `QuotationMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmQuotationRepository.changeStatus`

- **Firma:** `changeStatus(id: string, action: QuotationStatusAction, userId: string, reason: string \| null): Promise<Quotation>` — [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts#L140) (L140–161)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateQuotationError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `change_quotation_status`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateQuotationError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la cotización.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmQuotationRepository.convertToSale`

- **Firma:** `convertToSale(id: string, userId: string): Promise<string>` — [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts#L163) (L163–173)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateQuotationError`
- **Efectos secundarios:** Llama funciones SQL: `convert_quotation_to_sale`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateQuotationError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmQuotationRepository.salePreview`

- **Firma:** `salePreview(id: string): Promise<QuotationSalePreviewLine[]>` — [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts#L175) (L175–199)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `rows.map`, `String`, `Number`
- **Efectos secundarios:** Tablas en su SQL: `quotation_details`, `products`, `inventory_locations`, `inventory_stock`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmQuotationRepository.translateQuotationError`

- **Firma:** `translateQuotationError(error: unknown): unknown` — [typeorm-quotation.repository.ts](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts#L202) (L202–235)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;id&gt;'` → domain-error translation as `TypeOrmTicketRepository.translateTicketError` — see that method's own doc comment for why this parsing exists.
- **Dependencias (llamadas en su cuerpo):** `quotationRuleErrorFromMessage`, `message.split`, `new QuotationEmptyError`, `new InvalidClientError`, `new InvalidExpirationDateError`, `new QuotationProductNotFoundError`, `new QuotationProductInactiveError`, `new InvalidQuotationQuantityError`, `new InvalidQuotationDiscountError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts"></a>

### quotations.controller.ts

- **Ruta:** [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts) (`comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts`, 197 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** No class-level `@Roles(...)` — same policy as Sales/Purchases/Tickets: creating a Cotización is an operational action for whoever runs the register, not an admin-only one.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [list-quotations.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-list-quotations-use-case-ts), [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts), [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts), [quotation-sale.use-cases.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts), [quotation-status.request.dto.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-quotation-status-request-dto-ts), [create-quotation.request.dto.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-create-quotation-request-dto-ts), [list-quotations.query.dto.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-list-quotations-query-dto-ts), [void-quotation.request.dto.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-void-quotation-request-dto-ts), [quotation.response.dto.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-quotation-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts)

#### Clase `QuotationsController` (L52–196)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('quotations')`
- **Propósito:** No class-level `@Roles(...)` — same policy as Sales/Purchases/Tickets: creating a Cotización is an operational action for whoever runs the register, not an admin-only one. `ListQuotationsUseCase`/ `GetQuotationByIdUseCase` still restrict *which* quotations a non-admin can see (only their own), enforced in the use case. `void` is the one admin-gated route — correcting an already-created quotation is a management action, same policy as Tickets'/`BankDepositsController`'s own void route.
- **Dependencias inyectadas (constructor):** `createQuotationUseCase: CreateQuotationUseCase`, `listQuotationsUseCase: ListQuotationsUseCase`, `getQuotationByIdUseCase: GetQuotationByIdUseCase`, `voidQuotationUseCase: VoidQuotationUseCase`, `getQuotationPdfUseCase: GetQuotationPdfUseCase`, `changeStatusUseCase: ChangeQuotationStatusUseCase`, `salePreviewUseCase: GetQuotationSalePreviewUseCase`, `convertToSaleUseCase: ConvertQuotationToSaleUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 66–85 | `dto: CreateQuotationRequestDto`, `userId: string` | `Promise<QuotationResponseDto>` |
| `findAll` | método public | 87–97 | `query: ListQuotationsQueryDto`, `user: RequestUser` | `Promise<PaginatedQuotationsResponseDto>` |
| `getPdf` | método public async | 105–121 | `id: string`, `user: RequestUser`, `res: Response` | `Promise<void>` |
| `changeStatus` | método public | 124–140 | `id: string`, `dto: QuotationStatusRequestDto`, `user: RequestUser` | `Promise<QuotationResponseDto>` |
| `salePreview` | método public | 143–152 | `id: string`, `user: RequestUser` | `Promise<QuotationSalePreviewResponseDto>` |
| `confirmSale` | método public | 158–168 | `id: string`, `user: RequestUser` | `Promise<{ saleId: string; quotation: QuotationResponseDto }>` |
| `voidQuotation` | método public | 171–184 | `id: string`, `dto: VoidQuotationRequestDto`, `userId: string` | `Promise<QuotationResponseDto>` |
| `findOne` | método public | 186–195 | `id: string`, `user: RequestUser` | `Promise<QuotationResponseDto>` |

##### `QuotationsController.create`

- **Firma:** `create(dto: CreateQuotationRequestDto, userId: string): Promise<QuotationResponseDto>` — [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L66) (L66–85)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createQuotationUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationsController.findAll`

- **Firma:** `findAll(query: ListQuotationsQueryDto, user: RequestUser): Promise<PaginatedQuotationsResponseDto>` — [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L87) (L87–97)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listQuotationsUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationsController.getPdf`

- **Firma:** `getPdf(id: string, user: RequestUser, res: Response): Promise<void>` — [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L105) (L105–121)
- **Decoradores:** `@Get(':id/pdf')`
- **Propósito / descripción:** Reconstructs the quotation's PDF purely from already-persisted, historicized data — never re-runs `create_quotation`. Declared before `:id` so it isn't swallowed by that route's `ParseUUIDPipe` matching on `id`, matching Sales'/Purchases'/Tickets' own route-ordering discipline.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.getQuotationPdfUseCase.execute`, `ADMIN_ROLES.includes`, `res.set`, `id.slice`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationsController.changeStatus`

- **Firma:** `changeStatus(id: string, dto: QuotationStatusRequestDto, user: RequestUser): Promise<QuotationResponseDto>` — [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L124) (L124–140)
- **Decoradores:** `@Post(':id/status')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Confirmar borrador / Aceptar / Rechazar (commercial status only; never inventory).
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.changeStatusUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationsController.salePreview`

- **Firma:** `salePreview(id: string, user: RequestUser): Promise<QuotationSalePreviewResponseDto>` — [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L143) (L143–152)
- **Decoradores:** `@Get(':id/sale-preview')`
- **Propósito / descripción:** Summary shown before "Confirmar venta" (quoted lines + current Vitrina stock).
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.salePreviewUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationsController.confirmSale`

- **Firma:** `confirmSale(id: string, user: RequestUser): Promise<{ saleId: string; quotation: QuotationResponseDto }>` — [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L158) (L158–168)
- **Decoradores:** `@Post(':id/confirm-sale')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** "Confirmar venta": one sale through Ventas with the quoted prices; a retry returns the same sale (no second stock discount).
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.convertToSaleUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationsController.voidQuotation`

- **Firma:** `voidQuotation(id: string, dto: VoidQuotationRequestDto, userId: string): Promise<QuotationResponseDto>` — [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L171) (L171–184)
- **Decoradores:** `@Post(':id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** Anular — never a physical delete/edit, see `VoidQuotationUseCase`.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidQuotationUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationsController.findOne`

- **Firma:** `findOne(id: string, user: RequestUser): Promise<QuotationResponseDto>` — [quotations.controller.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts#L186) (L186–195)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getQuotationByIdUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-create-quotation-request-dto-ts"></a>

### create-quotation.request.dto.ts

- **Ruta:** [create-quotation.request.dto.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/dtos/create-quotation.request.dto.ts) (`comercial-jhoel-api/src/modules/quotations/presentation/dtos/create-quotation.request.dto.ts`, 88 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** DTO de entrada: declara `CreateQuotationItemRequestDto`, `CreateQuotationRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

#### Clase `CreateQuotationItemRequestDto` (L18–29)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CreateQuotationRequestDto` (L31–87)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-list-quotations-query-dto-ts"></a>

### list-quotations.query.dto.ts

- **Ruta:** [list-quotations.query.dto.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/dtos/list-quotations.query.dto.ts) (`comercial-jhoel-api/src/modules/quotations/presentation/dtos/list-quotations.query.dto.ts`, 56 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** DTO de consulta: declara `ListQuotationsQueryDto`, `STATUS_VALUES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

#### Clase `ListQuotationsQueryDto` (L24–55)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-quotation-status-request-dto-ts"></a>

### quotation-status.request.dto.ts

- **Ruta:** [quotation-status.request.dto.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/dtos/quotation-status.request.dto.ts) (`comercial-jhoel-api/src/modules/quotations/presentation/dtos/quotation-status.request.dto.ts`, 20 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** DTO de entrada: declara `QuotationStatusRequestDto`, `QUOTATION_OPERATOR_ACTIONS` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

**Constantes exportadas:**

- `QUOTATION_OPERATOR_ACTIONS` (L4): Commercial actions any operator may run on a quotation they can see. = `[ 'CONFIRMAR', 'ACEPTAR', 'RECHAZAR', ] as const`

#### Clase `QuotationStatusRequestDto` (L10–19)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-quotations-presentation-dtos-quotation-response-dto-ts"></a>

### quotation.response.dto.ts

- **Ruta:** [quotation.response.dto.ts](../../../../comercial-jhoel-api/src/modules/quotations/presentation/dtos/quotation.response.dto.ts) (`comercial-jhoel-api/src/modules/quotations/presentation/dtos/quotation.response.dto.ts`, 88 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** DTO de respuesta: declara `QuotationItemResponseDto`, `QuotationResponseDto`, `QuotationSummaryResponseDto`, `PaginatedQuotationsResponseDto`, `QuotationSalePreviewResponseDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation-output.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-dtos-quotation-output-ts)
- **Consumidores:** [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts)

#### Clase `QuotationItemResponseDto` (L3–13)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `QuotationResponseDto` (L15–47)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `QuotationSummaryResponseDto` (L49–64)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedQuotationsResponseDto` (L66–71)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `QuotationSalePreviewResponseDto` (L74–87)

- **Propósito:** "Confirmar venta" summary: each line with the current Vitrina stock.
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

- **Ruta:** [quotations.module.ts](../../../../comercial-jhoel-api/src/modules/quotations/quotations.module.ts) (`comercial-jhoel-api/src/modules/quotations/quotations.module.ts`, 41 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `quotations`
- **Responsabilidad:** Módulo: declara `QuotationsModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [quotation.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts), [quotation-detail.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-detail-orm-entity-ts), [typeorm-quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-typeorm-quotation-repository-ts), [quotation.repository.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-domain-repositories-quotation-repository-ts), [create-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-ts), [list-quotations.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-list-quotations-use-case-ts), [get-quotation-by-id.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-by-id-use-case-ts), [void-quotation.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-void-quotation-use-case-ts), [get-quotation-pdf.use-case.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-get-quotation-pdf-use-case-ts), [quotation-sale.use-cases.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-quotation-sale-use-cases-ts), [quotations.controller.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-presentation-controllers-quotations-controller-ts), [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts), [company-settings.module.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `QuotationsModule` (L21–40)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([QuotationOrmEntity, QuotationDetailOrmEntity]), ClientsModule, CompanySettingsModule, ], controllers: [QuotationsC`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
