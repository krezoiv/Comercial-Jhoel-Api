# Módulo backend `purchases`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/purchases` | [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L83) `PurchasesController.create` | [CreatePurchaseUseCase](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts) | `PurchaseRepository`.confirmPurchase → `confirm_purchase` | UseGuards(JwtAuthGuard) | `PurchasesService.createPurchase` |
| `POST /api/purchases/import` | [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L109) `PurchasesController.importExcel` | [ImportPurchaseFromExcelUseCase](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts) | `CreatePurchaseUseCase`.execute<br>`ProductRepository`.findByActiveSku/findByActiveName<br>`ProductPresentationRepository`.findByProductId<br>`InventoryLocationRepository`.findAll<br>`SupplierRepository`.findAll | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `PurchasesService.importInitialStockExcel` |
| `POST /api/purchases/:id/void` | [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L129) `PurchasesController.voidPurchase` | [VoidPurchaseUseCase](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-void-purchase-use-case-ts) | `PurchaseRepository`.findById/voidPurchase → `void_purchase` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `PurchasesService.voidPurchase` |
| `POST /api/purchases/:id/pay` | [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L146) `PurchasesController.markAsPaid` | [MarkPurchaseAsPaidUseCase](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-ts) | `PurchaseRepository`.findById/markAsPaid | UseGuards(JwtAuthGuard) | `PurchasesService.markAsPaid` |
| `GET /api/purchases` | [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L155) `PurchasesController.findAll` | [ListPurchasesUseCase](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-list-purchases-use-case-ts) | `PurchaseRepository`.findAll | UseGuards(JwtAuthGuard) | `PurchasesService.getPurchases` |
| `GET /api/purchases/import/template` | [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L168) `PurchasesController.importTemplate` | — | — | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `PurchasesService.downloadInitialStockTemplate` |
| `GET /api/purchases/daily-stats` | [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L182) `PurchasesController.dailyStats` | [GetPurchasesDailyStatsUseCase](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-daily-stats-use-case-ts) | `PurchaseRepository`.getDailyPurchaseTotals | UseGuards(JwtAuthGuard) | `PurchasesService.getDailyStats` |
| `GET /api/purchases/weekly-stats` | [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L188) `PurchasesController.weeklyStats` | [GetPurchasesWeeklyStatsUseCase](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-weekly-stats-use-case-ts) | `PurchaseRepository`.getDailyPurchaseTotals | UseGuards(JwtAuthGuard) | `PurchasesService.getWeeklyStats` |
| `GET /api/purchases/yearly-stats` | [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L194) `PurchasesController.yearlyStats` | [GetPurchasesYearlyStatsUseCase](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-yearly-stats-use-case-ts) | `PurchaseRepository`.getMonthlyPurchaseTotals | UseGuards(JwtAuthGuard) | `PurchasesService.getYearlyStats` |
| `GET /api/purchases/:id/pdf` | [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L205) `PurchasesController.getPdf` | [GetPurchasePdfUseCase](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-pdf-use-case-ts) | `PurchaseRepository`.findById<br>`SupplierRepository`.findById<br>`CompanySettingsRepository`.get | UseGuards(JwtAuthGuard) | `PurchasesService.exportPurchasePdf` |
| `GET /api/purchases/:id` | [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L223) `PurchasesController.findOne` | [GetPurchaseByIdUseCase](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-by-id-use-case-ts) | `PurchaseRepository`.findById | UseGuards(JwtAuthGuard) | `PurchasesService.getPurchaseById` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [purchase-output.ts](#f-comercial-jhoel-api-src-modules-purchases-application-dtos-purchase-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toPurchaseOutput`, `toPurchaseSummaryOutput`, `PurchaseItemOutput`, `PurchaseOutput`, `PurchaseSummaryOutput` (sin comentario de documentación en el código). | 1 internas | 5 | Media (5 consumidores) |
| [create-purchase.use-case.ts](#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreatePurchaseUseCase`, `CreatePurchaseItemInput`, `CreatePurchaseInput`, `FUTURE_DATE_GRACE_MS` (sin comentario de documentación en el código). | 7 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-purchase-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetPurchaseByIdUseCase`, `GetPurchaseByIdInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-purchase-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | Reconstructs the purchase's invoice PDF purely from already-persisted data — never re-runs `confirm_purchase` or touches inventory. | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-purchases-daily-stats.use-case.ts](#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-daily-stats-use-case-ts) | .ts | Caso de uso | Aplicación | "Compras del mes" — Gráficas → Indicadores de Compras. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-purchases-weekly-stats.use-case.ts](#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-weekly-stats-use-case-ts) | .ts | Caso de uso | Aplicación | "Compras por semana" — buckets de 7 días fijos desde el día 1 del mes actual, nunca semana ISO — mismo criterio exacto que `GetSalesWeeklyStatsUseCase`/`GetBankDepositWeeklyStatsUseCase`, para que un bucket nunca mezcle días de otro mes. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-purchases-yearly-stats.use-case.ts](#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-yearly-stats-use-case-ts) | .ts | Caso de uso | Aplicación | "Compras por mes" — acumulativo, enero hasta el mes actual del año en curso, a diferencia de la gráfica diaria/semanal de este mismo módulo. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [import-purchase-from-excel.use-case.ts](#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts) | .ts | Caso de uso | Aplicación | Reads an `.xlsx` built to `PURCHASE_IMPORT_HEADERS`'s 5-column shape (SKU, Producto, Presentación, Cantidad, Ubicación Destino) and registers the described quantities as one or more real purchases — always by delegating to `CreatePurchaseUseCase.execute()`, the same use case "Registrar compra" already calls, never a parallel copy of its conversion/stock logic. | 9 internas; ext.: @nestjs/common, exceljs | 2 | Media (caso de uso) |
| [list-purchases.use-case.ts](#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-list-purchases-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListPurchasesUseCase`, `ListPurchasesInput`, `ListPurchasesOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [mark-purchase-as-paid.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makePurchase` (sin comentario de documentación en el código). | 5 internas | 0 | Soporte (pruebas) |
| [mark-purchase-as-paid.use-case.ts](#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-ts) | .ts | Caso de uso | Aplicación | "Marcar como pagada" — the minimum viable payment-tracking action this ticket asked for, deliberately NOT a full cuentas-por-pagar module (the ticket's own "PAGO DE COMPRA" section explicitly warns against building one without first analyzing the architecture — none exists yet, so this stays minimal). | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [void-purchase.use-case.ts](#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-void-purchase-use-case-ts) | .ts | Caso de uso | Aplicación | "Anular factura" — the only correction path for a mistaken purchase (per this ticket's explicit decision: no "editar factura" that touches productos/cantidades/costos — the fix is always anular + registrar una compra nueva y correcta). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [purchase-detail.entity.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-detail-entity-ts) | .ts | Entidad de dominio | Dominio | A frozen line item — `costPrice`/`publicPrice`/`total` are the values recorded at the moment of purchase, never recomputed from the live product. | 0 internas | 2 | Baja (2 consumidores) |
| [purchase.entity.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-entity-ts) | .ts | Entidad de dominio | Dominio | Entidad de dominio: declara `Purchase`, `PurchaseProps`, `PurchasePaymentType`, `PurchasePaymentStatus` (sin comentario de documentación en el código). | 1 internas | 9 | Media (9 consumidores) |
| [insufficient-stock-to-revert-purchase.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-insufficient-stock-to-revert-purchase-error-ts) | .ts | Errores de dominio | Dominio | The stock this purchase brought in was already partially or fully consumed elsewhere (a sale, a transfer, another purchase's own correction) — reverting it would take a product negative. | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-payment-data.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-payment-data-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidPaymentDataError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-purchase-date.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-purchase-date-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidPurchaseDateError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-purchase-price.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-purchase-price-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidPurchasePriceError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-purchase-quantity.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-purchase-quantity-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidPurchaseQuantityError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-supplier.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-supplier-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidSupplierError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [purchase-access-denied.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-access-denied-error-ts) | .ts | Errores de dominio | Dominio | A USER account trying to view a purchase that isn't theirs — ADMIN/SUPER_ADMIN can view any purchase. | 1 internas | 2 | Baja (2 consumidores) |
| [purchase-already-paid.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-already-paid-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PurchaseAlreadyPaidError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [purchase-already-voided.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-already-voided-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PurchaseAlreadyVoidedError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [purchase-empty.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-empty-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PurchaseEmptyError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [purchase-not-found.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PurchaseNotFoundError` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [purchase-product-inactive.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-product-inactive-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PurchaseProductInactiveError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [purchase-product-not-found.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-product-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PurchaseProductNotFoundError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [purchase-void-blocked-by-payment.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-void-blocked-by-payment-error-ts) | .ts | Errores de dominio | Dominio | Fires only when a CREDITO purchase was already marked as paid via a separate "Marcar como pagada" action — never for a CONTADO purchase, which is always `PAID` from the moment it's created (see `confirm_purchase`) and is NOT what this guard is protecting against. | 1 internas | 1 | Baja (1 consumidores) |
| [purchase-void-reason-required.error.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-void-reason-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PurchaseVoidReasonRequiredError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [purchase.repository.ts](#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `PurchaseItemData`, `ConfirmPurchaseData`, `FindPurchasesOptions`, `PaginatedResult`, `PurchaseDailyAmount` (sin comentario de documentación en el código). | 1 internas | 16 | Alta (16 consumidores) |
| [purchase-import.builder.ts](#f-comercial-jhoel-api-src-modules-purchases-infrastructure-excel-purchase-import-builder-ts) | .ts | Builder | Infraestructura | Blank import template — `PURCHASE_IMPORT_HEADERS` as the header row, plus two example rows showing the "one product, two presentation lines" case this feature exists for. | 0 internas; ext.: exceljs | 2 | Baja (2 consumidores) |
| [purchase-pdf.builder.ts](#f-comercial-jhoel-api-src-modules-purchases-infrastructure-pdf-purchase-pdf-builder-ts) | .ts | Builder | Infraestructura | Reconstructs a Compra invoice purely from already-persisted data (`PurchaseOutput` + `Supplier` + company settings) — never re-runs `confirm_purchase` or touches inventory. | 1 internas; ext.: pdfkit | 1 | Baja (1 consumidores) |
| [purchase-detail.orm-entity.ts](#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-detail-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `PurchaseDetailOrmEntity` (sin comentario de documentación en el código). | 4 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [purchase.mapper.ts](#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `PurchaseMapper` (sin comentario de documentación en el código). | 3 internas | 1 | Baja (1 consumidores) |
| [purchase.orm-entity.ts](#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `PurchaseOrmEntity` (sin comentario de documentación en el código). | 4 internas; ext.: typeorm | 8 | Media (8 consumidores) |
| [typeorm-purchase.repository.ts](#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmPurchaseRepository`, `SORT_COLUMN` (sin comentario de documentación en el código). | 16 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [purchases.controller.ts](#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts) | .ts | Controlador | Presentación | No `@Roles(...)` restriction — same policy as Sales, applied consistently per this ticket's own instruction: registering a purchase (receiving stock) is an operational action for whoever runs the register, not an admin-only one. | 23 internas; ext.: @nestjs/common, @nestjs/platform-express, express | 1 | Media (controlador) |
| [create-purchase.request.dto.ts](#f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-create-purchase-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreatePurchaseItemRequestDto`, `CreatePurchaseRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [import-purchase-result.response.dto.ts](#f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-import-purchase-result-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `ImportPurchaseSkippedRowDto`, `ImportPurchaseResultResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [list-purchases.query.dto.ts](#f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-list-purchases-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListPurchasesQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS`, `STATUS_FILTERS` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [purchase.response.dto.ts](#f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-purchase-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `PurchaseItemResponseDto`, `PurchaseResponseDto`, `PurchaseSummaryResponseDto`, `PaginatedPurchasesResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [purchases-daily-stats.response.dto.ts](#f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-purchases-daily-stats-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `PurchasesDailyStatDto`, `PurchasesDailyStatsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [purchases-weekly-stats.response.dto.ts](#f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-purchases-weekly-stats-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `PurchasesWeeklyStatDto`, `PurchasesWeeklyStatsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [purchases-yearly-stats.response.dto.ts](#f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-purchases-yearly-stats-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `PurchasesMonthlyStatDto`, `PurchasesYearlyStatsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [void-purchase.request.dto.ts](#f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-void-purchase-request-dto-ts) | .ts | DTO de entrada | Presentación | Same mandatory-reason shape as every other void request DTO in this codebase (`VoidRechargePurchaseRequestDto`, `VoidCashBoxMovementRequestDto`) — kept as this module's own copy rather than a cross-module import. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [purchases.module.ts](#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `PurchasesModule` (sin comentario de documentación en el código). | 19 internas; ext.: @nestjs/common, @nestjs/typeorm | 3 | Media (3 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-purchases-application-dtos-purchase-output-ts"></a>

### purchase-output.ts

- **Ruta:** [purchase-output.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/dtos/purchase-output.ts) (`comercial-jhoel-api/src/modules/purchases/application/dtos/purchase-output.ts`, 118 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** DTO de salida (aplicación): declara `toPurchaseOutput`, `toPurchaseSummaryOutput`, `PurchaseItemOutput`, `PurchaseOutput`, `PurchaseSummaryOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchase.entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-entity-ts)
- **Consumidores:** [create-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts), [get-purchase-by-id.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-by-id-use-case-ts), [list-purchases.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-list-purchases-use-case-ts), [mark-purchase-as-paid.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-ts), [void-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-void-purchase-use-case-ts)

**Interfaces, tipos y enums:**

- `interface PurchaseItemOutput` (L3): sin documentación — miembros: `id`, `productId`, `productName`, `sku`, `quantity`, `costPrice`, `publicPrice`, `total`, `presentationName`
- `interface PurchaseOutput` (L16): Full shape — used for `GET /purchases/:id` and the response of `POST /purchases`. — miembros: `id`, `supplierId`, `supplierName`, `userId`, `username`, `purchaseDate`, `total`, `items`, `createdAt`, `updatedAt`, `paymentType`, `paymentDueDate`, `paymentStatus`, `paidAt`, `paidBy`, `paidByUsername`, `invoiceNumber`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
- `interface PurchaseSummaryOutput` (L41): Lighter shape for `GET /purchases` — no line items, so listing purchases never needs to load them. — miembros: `id`, `supplierId`, `supplierName`, `userId`, `username`, `purchaseDate`, `total`, `createdAt`, `paymentType`, `paymentDueDate`, `paymentStatus`, `invoiceNumber`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
#### Función `toPurchaseOutput` (L60–94)

- **Tipo:** función exportada
- **Firma:** `toPurchaseOutput(purchase: Purchase): PurchaseOutput` — [purchase-output.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/dtos/purchase-output.ts#L60)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `purchase.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts), [get-purchase-by-id.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-by-id-use-case-ts), [mark-purchase-as-paid.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-ts), [void-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-void-purchase-use-case-ts)

#### Función `toPurchaseSummaryOutput` (L96–117)

- **Tipo:** función exportada
- **Firma:** `toPurchaseSummaryOutput(purchase: Purchase): PurchaseSummaryOutput` — [purchase-output.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/dtos/purchase-output.ts#L96)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts"></a>

### create-purchase.use-case.ts

- **Ruta:** [create-purchase.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/create-purchase.use-case.ts) (`comercial-jhoel-api/src/modules/purchases/application/use-cases/create-purchase.use-case.ts`, 128 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Caso de uso: declara `CreatePurchaseUseCase`, `CreatePurchaseItemInput`, `CreatePurchaseInput`, `FUTURE_DATE_GRACE_MS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts), [purchase-empty.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-empty-error-ts), [invalid-purchase-quantity.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-purchase-quantity-error-ts), [invalid-purchase-price.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-purchase-price-error-ts), [invalid-purchase-date.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-purchase-date-error-ts), [invalid-payment-data.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-payment-data-error-ts), [purchase-output.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-dtos-purchase-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [import-purchase-from-excel.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts), [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts)

**Interfaces, tipos y enums:**

- `interface CreatePurchaseItemInput` (L11): sin documentación — miembros: `productId`, `presentationId`, `quantity`, `costPrice`, `publicPrice`
- `interface CreatePurchaseInput` (L20): sin documentación — miembros: `supplierId`, `userId`, `purchaseDate`, `items`, `paymentType`, `paymentDueDate`, `invoiceNumber`

#### Clase `CreatePurchaseUseCase` (L38–127)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASE_REPOSITORY) purchaseRepository: PurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 45–126 | `input: CreatePurchaseInput` | `Promise<PurchaseOutput>` |

##### `CreatePurchaseUseCase.execute`

- **Firma:** `execute(input: CreatePurchaseInput): Promise<PurchaseOutput>` — [create-purchase.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/create-purchase.use-case.ts#L45) (L45–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new PurchaseEmptyError`, `Number.isNaN`, `input.purchaseDate.getTime`, `Date.now`, `new InvalidPurchaseDateError`, `new InvalidPaymentDataError`, `Number.isInteger`, `new InvalidPurchaseQuantityError`, `new InvalidPurchasePriceError`, `new Map`, `mergedByLine.get`, `mergedByLine.set`, `[...mergedByLine.values()].sort`, `mergedByLine.values`, `a.productId.localeCompare`, `this.purchaseRepository.confirmPurchase`, `input.invoiceNumber?.trim`, `toPurchaseOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new PurchaseEmptyError()`, `new InvalidPurchaseDateError()`, `new InvalidPaymentDataError( 'Debe indicar la fecha de pago para una compra a crédito.', )`, `new InvalidPurchaseQuantityError(item.productId)`, `new InvalidPurchasePriceError(item.productId)`
- **Consumidores:** [import-purchase-from-excel.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts), [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-by-id-use-case-ts"></a>

### get-purchase-by-id.use-case.ts

- **Ruta:** [get-purchase-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchase-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchase-by-id.use-case.ts`, 36 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Caso de uso: declara `GetPurchaseByIdUseCase`, `GetPurchaseByIdInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts), [purchase-not-found.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-not-found-error-ts), [purchase-access-denied.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-access-denied-error-ts), [purchase-output.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-dtos-purchase-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts)

**Interfaces, tipos y enums:**

- `interface GetPurchaseByIdInput` (L8): sin documentación — miembros: `currentUserId`, `isAdmin`

#### Clase `GetPurchaseByIdUseCase` (L13–35)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASE_REPOSITORY) purchaseRepository: PurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–34 | `id: string`, `input: GetPurchaseByIdInput` | `Promise<PurchaseOutput>` |

##### `GetPurchaseByIdUseCase.execute`

- **Firma:** `execute(id: string, input: GetPurchaseByIdInput): Promise<PurchaseOutput>` — [get-purchase-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchase-by-id.use-case.ts#L20) (L20–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.purchaseRepository.findById`, `new PurchaseNotFoundError`, `new PurchaseAccessDeniedError`, `toPurchaseOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new PurchaseNotFoundError(id)`, `new PurchaseAccessDeniedError()`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-pdf-use-case-ts"></a>

### get-purchase-pdf.use-case.ts

- **Ruta:** [get-purchase-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchase-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchase-pdf.use-case.ts`, 84 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Reconstructs the purchase's invoice PDF purely from already-persisted data — never re-runs `confirm_purchase` or touches inventory.
- **Depende de (archivos del proyecto):** [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts), [purchase-not-found.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-not-found-error-ts), [purchase-access-denied.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-access-denied-error-ts), [supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-repositories-supplier-repository-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [purchase-pdf.builder.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-pdf-purchase-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts)

**Interfaces, tipos y enums:**

- `interface GetPurchasePdfInput` (L12): sin documentación — miembros: `currentUserId`, `isAdmin`

#### Clase `GetPurchasePdfUseCase` (L24–83)

- **Decoradores:** `@Injectable()`
- **Propósito:** Reconstructs the purchase's invoice PDF purely from already-persisted data — never re-runs `confirm_purchase` or touches inventory. Same ownership rule as `GetPurchaseByIdUseCase`. Unlike Sales, purchases have no `OPEN` draft concept — every row is already a completed, confirmed purchase — so there is no draft-rejection branch here.
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASE_REPOSITORY) purchaseRepository: PurchaseRepository`, `@Inject(SUPPLIER_REPOSITORY) supplierRepository: SupplierRepository`, `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 35–82 | `id: string`, `input: GetPurchasePdfInput` | `Promise<Buffer>` |

##### `GetPurchasePdfUseCase.execute`

- **Firma:** `execute(id: string, input: GetPurchasePdfInput): Promise<Buffer>` — [get-purchase-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchase-pdf.use-case.ts#L35) (L35–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.purchaseRepository.findById`, `new PurchaseNotFoundError`, `new PurchaseAccessDeniedError`, `Promise.all`, `this.supplierRepository.findById`, `this.companySettingsRepository.get`, `buildPurchasePdf`, `purchase.id.slice(0, 8).toUpperCase`, `purchase.id.slice`, `purchase.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new PurchaseNotFoundError(id)`, `new PurchaseAccessDeniedError()`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-daily-stats-use-case-ts"></a>

### get-purchases-daily-stats.use-case.ts

- **Ruta:** [get-purchases-daily-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchases-daily-stats.use-case.ts) (`comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchases-daily-stats.use-case.ts`, 54 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** "Compras del mes" — Gráficas → Indicadores de Compras.
- **Depende de (archivos del proyecto):** [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts)

**Interfaces, tipos y enums:**

- `interface PurchasesDailyStatOutput` (L5): sin documentación — miembros: `date`, `amount`
- `interface PurchasesDailyStatsOutput` (L11): sin documentación — miembros: `month`, `days`

#### Clase `GetPurchasesDailyStatsUseCase` (L25–53)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Compras del mes" — Gráficas → Indicadores de Compras. Monto total comprado (`SUM(total)`), no cantidad de compras — mismo criterio ya confirmado para Ventas/Transacciones. Siempre el mes actual del servidor. Excluye compras anuladas (`getDailyPurchaseTotals` ya filtra `is_voided = false`).
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASE_REPOSITORY) purchaseRepository: PurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 32–52 | — | `Promise<PurchasesDailyStatsOutput>` |

##### `GetPurchasesDailyStatsUseCase.execute`

- **Firma:** `execute(): Promise<PurchasesDailyStatsOutput>` — [get-purchases-daily-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchases-daily-stats.use-case.ts#L32) (L32–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `now.getMonth`, `new Date(year, month + 1, 0).getDate`, `String(month + 1).padStart`, `String`, `this.purchaseRepository.getDailyPurchaseTotals`, `new Map`, `rows.map`, `String(day).padStart`, `days.push`, `amountsByDate.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-weekly-stats-use-case-ts"></a>

### get-purchases-weekly-stats.use-case.ts

- **Ruta:** [get-purchases-weekly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchases-weekly-stats.use-case.ts) (`comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchases-weekly-stats.use-case.ts`, 73 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** "Compras por semana" — buckets de 7 días fijos desde el día 1 del mes actual, nunca semana ISO — mismo criterio exacto que `GetSalesWeeklyStatsUseCase`/`GetBankDepositWeeklyStatsUseCase`, para que un bucket nunca mezcle días de otro mes.
- **Depende de (archivos del proyecto):** [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts)

**Interfaces, tipos y enums:**

- `interface PurchasesWeeklyStatOutput` (L5): sin documentación — miembros: `weekNumber`, `label`, `startDate`, `endDate`, `amount`
- `interface PurchasesWeeklyStatsOutput` (L16): sin documentación — miembros: `month`, `weeks`

#### Clase `GetPurchasesWeeklyStatsUseCase` (L32–72)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Compras por semana" — buckets de 7 días fijos desde el día 1 del mes actual, nunca semana ISO — mismo criterio exacto que `GetSalesWeeklyStatsUseCase`/`GetBankDepositWeeklyStatsUseCase`, para que un bucket nunca mezcle días de otro mes. Reutiliza la misma consulta día-a-día que la gráfica diaria (`getDailyPurchaseTotals`) — ninguna consulta SQL nueva.
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASE_REPOSITORY) purchaseRepository: PurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 39–71 | — | `Promise<PurchasesWeeklyStatsOutput>` |

##### `GetPurchasesWeeklyStatsUseCase.execute`

- **Firma:** `execute(): Promise<PurchasesWeeklyStatsOutput>` — [get-purchases-weekly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchases-weekly-stats.use-case.ts#L39) (L39–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `now.getMonth`, `new Date(year, month + 1, 0).getDate`, `String(month + 1).padStart`, `String`, `this.purchaseRepository.getDailyPurchaseTotals`, `new Map`, `rows.map`, `Math.min`, `String(day).padStart`, `amountsByDate.get`, `weeks.push`, `String(startDay).padStart`, `String(endDay).padStart`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-yearly-stats-use-case-ts"></a>

### get-purchases-yearly-stats.use-case.ts

- **Ruta:** [get-purchases-yearly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchases-yearly-stats.use-case.ts) (`comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchases-yearly-stats.use-case.ts`, 69 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** "Compras por mes" — acumulativo, enero hasta el mes actual del año en curso, a diferencia de la gráfica diaria/semanal de este mismo módulo.
- **Depende de (archivos del proyecto):** [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts)

**Interfaces, tipos y enums:**

- `interface PurchasesMonthlyStatOutput` (L20): sin documentación — miembros: `month`, `label`, `amount`
- `interface PurchasesYearlyStatsOutput` (L27): sin documentación — miembros: `year`, `months`

#### Clase `GetPurchasesYearlyStatsUseCase` (L38–68)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Compras por mes" — acumulativo, enero hasta el mes actual del año en curso, a diferencia de la gráfica diaria/semanal de este mismo módulo. Una sola consulta agregada (`getMonthlyPurchaseTotals`).
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASE_REPOSITORY) purchaseRepository: PurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 45–67 | — | `Promise<PurchasesYearlyStatsOutput>` |

##### `GetPurchasesYearlyStatsUseCase.execute`

- **Firma:** `execute(): Promise<PurchasesYearlyStatsOutput>` — [get-purchases-yearly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/get-purchases-yearly-stats.use-case.ts#L45) (L45–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `now.getMonth`, `now.getDate`, `this.purchaseRepository.getMonthlyPurchaseTotals`, `new Map`, `rows.map`, `String(m + 1).padStart`, `String`, `months.push`, `amountsByMonth.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts"></a>

### import-purchase-from-excel.use-case.ts

- **Ruta:** [import-purchase-from-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/import-purchase-from-excel.use-case.ts) (`comercial-jhoel-api/src/modules/purchases/application/use-cases/import-purchase-from-excel.use-case.ts`, 384 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Reads an `.xlsx` built to `PURCHASE_IMPORT_HEADERS`'s 5-column shape (SKU, Producto, Presentación, Cantidad, Ubicación Destino) and registers the described quantities as one or more real purchases — always by delegating to `CreatePurchaseUseCase.execute()`, the same use case "Registrar compra" already calls, never a parallel copy of its conversion/stock logic.
- **Depende de (archivos del proyecto):** [create-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts), [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts), [product-presentation.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-product-presentation-entity-ts), [inventory-location.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-location-repository-ts), [register-inventory-transfer.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-use-case-ts), [supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-repositories-supplier-repository-ts), [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts), [purchase-import.builder.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-excel-purchase-import-builder-ts)
- **Paquetes externos:** `@nestjs/common`, `exceljs`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts)

**Interfaces, tipos y enums:**

- `interface ImportPurchaseRowResult` (L17): sin documentación — miembros: `row`, `identifier`, `reason`
- `interface ImportPurchaseFromExcelOutput` (L23): sin documentación — miembros: `totalRows`, `productsAffected`, `purchasesCreated`, `transfersToVitrina`, `skipped`, `transferWarnings`
- `interface ResolvedItem` (L36): sin documentación — miembros: `row`, `identifier`, `productId`, `presentationId`, `quantity`, `costPrice`, `publicPrice`, `destination`
- `type DestinationLocationName` (L34) = `'Bodega' \| 'Vitrina'`

#### Clase `ImportPurchaseFromExcelUseCase` (L105–383)

- **Decoradores:** `@Injectable()`
- **Propósito:** Reads an `.xlsx` built to `PURCHASE_IMPORT_HEADERS`'s 5-column shape (SKU, Producto, Presentación, Cantidad, Ubicación Destino) and registers the described quantities as one or more real purchases — always by delegating to `CreatePurchaseUseCase.execute()`, the same use case "Registrar compra" already calls, never a parallel copy of its conversion/stock logic. This is what guarantees the presentation→base- units conversion (`quantity × conversionFactor`) happens exactly the way it already does for a normal purchase — this use case never computes that math itself. A product can span several rows — one per presentation ("2 Cajas" + "5 Unidades" of the same product is two rows) — resolved independently and passed through as separate purchase line items, relying on `CreatePurchaseUseCase`'s own existing `(productId, presentationId)` dedup rather than merging them here. Every price is reused 
- **Dependencias inyectadas (constructor):** `createPurchaseUseCase: CreatePurchaseUseCase`, `registerInventoryTransferUseCase: RegisterInventoryTransferUseCase`, `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`, `@Inject(PRODUCT_PRESENTATION_REPOSITORY) productPresentationRepository: ProductPresentationRepository`, `@Inject(INVENTORY_LOCATION_REPOSITORY) inventoryLocationRepository: InventoryLocationRepository`, `@Inject(SUPPLIER_REPOSITORY) supplierRepository: SupplierRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 120–321 | `fileBuffer: Buffer`, `userId: string` | `Promise<ImportPurchaseFromExcelOutput>` |
| `resolveInitialStockSupplierId` | método private async | 323–333 | — | `Promise<string>` |
| `resolveLocationIds` | método private async | 335–345 | — | `Promise<{ bodegaId: string; vitrinaId: string }>` |
| `resolveDestination` | método private | 347–359 | `raw: string` | `DestinationLocationName \| null` |
| `cellText` | método private | 361–370 | `value: unknown` | `string` |
| `cellNumber` | método private | 372–382 | `value: unknown` | `number \| null` |

##### `ImportPurchaseFromExcelUseCase.execute`

- **Firma:** `execute(fileBuffer: Buffer, userId: string): Promise<ImportPurchaseFromExcelOutput>` — [import-purchase-from-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/import-purchase-from-excel.use-case.ts#L120) (L120–321)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new ExcelJS.Workbook`, `workbook.xlsx.load`, `new BadRequestException`, `sheet.getRow`, `PURCHASE_IMPORT_HEADERS.every`, `String(headerRow.getCell(index + 1).value ?? '').trim`, `String`, `headerRow.getCell`, `actual.toLowerCase`, `expected.toLowerCase`, `PURCHASE_IMPORT_HEADERS.join`, `new Map`, `Array.from`, `row.getCell`, `cellValues.every`, `this.cellText`, `skipped.push`, `this.cellNumber`…
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BadRequestException( 'El archivo no es un Excel (.xlsx) válido. Si tienes un archivo .xls, ábrelo y usa "Guardar com`, `new BadRequestException('El archivo no contiene ninguna hoja con datos.')`, `new BadRequestException( 'Los encabezados del archivo no coinciden con la plantilla esperada. Descarga la plantilla e in`, `new BadRequestException( 'El archivo tiene ${rawDataRowCount} filas de datos — el máximo permitido por importación es ${`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

##### `ImportPurchaseFromExcelUseCase.resolveInitialStockSupplierId`

- **Firma:** `resolveInitialStockSupplierId(): Promise<string>` — [import-purchase-from-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/import-purchase-from-excel.use-case.ts#L323) (L323–333)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.supplierRepository.findAll`, `INITIAL_STOCK_SUPPLIER_NAME.toLowerCase`, `suppliers.find`, `s.name.trim().toLowerCase`, `s.name.trim`, `new InternalServerErrorException`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InternalServerErrorException( 'No se encontró el proveedor "${INITIAL_STOCK_SUPPLIER_NAME}" — verifica que las migra`
- **Consumidores:** (mismo archivo)

##### `ImportPurchaseFromExcelUseCase.resolveLocationIds`

- **Firma:** `resolveLocationIds(): Promise<{ bodegaId: string; vitrinaId: string }>` — [import-purchase-from-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/import-purchase-from-excel.use-case.ts#L335) (L335–345)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.inventoryLocationRepository.findAll`, `locations.find`, `l.name.trim().toLowerCase`, `l.name.trim`, `new InternalServerErrorException`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InternalServerErrorException( 'No se encontraron las ubicaciones "Bodega"/"Vitrina" — verifica que las migraciones s`
- **Consumidores:** (mismo archivo)

##### `ImportPurchaseFromExcelUseCase.resolveDestination`

- **Firma:** `resolveDestination(raw: string): DestinationLocationName \| null` — [import-purchase-from-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/import-purchase-from-excel.use-case.ts#L347) (L347–359)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `raw.trim().toLowerCase`, `raw.trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `ImportPurchaseFromExcelUseCase.cellText`

- **Firma:** `cellText(value: unknown): string` — [import-purchase-from-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/import-purchase-from-excel.use-case.ts#L361) (L361–370)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `String((value as { text: unknown }).text ?? '').trim`, `String`, `String(value).trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `ImportPurchaseFromExcelUseCase.cellNumber`

- **Firma:** `cellNumber(value: unknown): number \| null` — [import-purchase-from-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/import-purchase-from-excel.use-case.ts#L372) (L372–382)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `String(value).replace`, `String`, `Number`, `Number.isFinite`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-purchases-application-use-cases-list-purchases-use-case-ts"></a>

### list-purchases.use-case.ts

- **Ruta:** [list-purchases.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/list-purchases.use-case.ts) (`comercial-jhoel-api/src/modules/purchases/application/use-cases/list-purchases.use-case.ts`, 77 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Caso de uso: declara `ListPurchasesUseCase`, `ListPurchasesInput`, `ListPurchasesOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts), [purchase-output.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-dtos-purchase-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts)

**Interfaces, tipos y enums:**

- `interface ListPurchasesInput` (L14): sin documentación — miembros: `currentUserId`, `isAdmin`, `supplierId`, `startDate`, `endDate`, `search`, `status`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface ListPurchasesOutput` (L29): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `ListPurchasesUseCase` (L40–76)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASE_REPOSITORY) purchaseRepository: PurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 47–75 | `input: ListPurchasesInput` | `Promise<ListPurchasesOutput>` |

##### `ListPurchasesUseCase.execute`

- **Firma:** `execute(input: ListPurchasesInput): Promise<ListPurchasesOutput>` — [list-purchases.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/list-purchases.use-case.ts#L47) (L47–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `this.purchaseRepository.findAll`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-spec-ts"></a>

### mark-purchase-as-paid.use-case.spec.ts

- **Ruta:** [mark-purchase-as-paid.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/mark-purchase-as-paid.use-case.spec.ts) (`comercial-jhoel-api/src/modules/purchases/application/use-cases/mark-purchase-as-paid.use-case.spec.ts`, 71 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Prueba unitaria: declara `makePurchase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [mark-purchase-as-paid.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-ts), [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts), [purchase-not-found.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-not-found-error-ts), [purchase-already-paid.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-already-paid-error-ts), [purchase.entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-entity-ts)
- **Consumidores:** —
#### Función `makePurchase` (L7–26)

- **Tipo:** función local del archivo
- **Firma:** `makePurchase(paymentStatus: 'PENDING' \| 'PAID'): Purchase` — [mark-purchase-as-paid.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/mark-purchase-as-paid.use-case.spec.ts#L7)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Purchase.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-ts"></a>

### mark-purchase-as-paid.use-case.ts

- **Ruta:** [mark-purchase-as-paid.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/mark-purchase-as-paid.use-case.ts) (`comercial-jhoel-api/src/modules/purchases/application/use-cases/mark-purchase-as-paid.use-case.ts`, 52 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** "Marcar como pagada" — the minimum viable payment-tracking action this ticket asked for, deliberately NOT a full cuentas-por-pagar module (the ticket's own "PAGO DE COMPRA" section explicitly warns against building one without first analyzing the architecture — none exists yet, so this stays minimal).
- **Depende de (archivos del proyecto):** [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts), [purchase-not-found.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-not-found-error-ts), [purchase-already-paid.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-already-paid-error-ts), [purchase-output.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-dtos-purchase-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [mark-purchase-as-paid.use-case.spec.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-spec-ts), [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts)

**Interfaces, tipos y enums:**

- `interface MarkPurchaseAsPaidInput` (L8): sin documentación — miembros: `id`, `paidBy`

#### Clase `MarkPurchaseAsPaidUseCase` (L29–51)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Marcar como pagada" — the minimum viable payment-tracking action this ticket asked for, deliberately NOT a full cuentas-por-pagar module (the ticket's own "PAGO DE COMPRA" section explicitly warns against building one without first analyzing the architecture — none exists yet, so this stays minimal). A CONTADO purchase is already `PAID` at creation (see `confirm_purchase`), so attempting to mark one paid again correctly hits the same "already paid" error a second attempt on a CREDITO purchase would — there's no need to special-case "this purchase was never CREDITO in the first place." Operational (no `@Roles` at the controller) — same policy as registering the purchase itself: paying a supplier is routine bookkeeping for whoever manages it, not an exceptional admin correction (unlike e.g. anular-ing a Transaccionar operation, which undoes a mistake).
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASE_REPOSITORY) purchaseRepository: PurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 36–50 | `input: MarkPurchaseAsPaidInput` | `Promise<PurchaseOutput>` |

##### `MarkPurchaseAsPaidUseCase.execute`

- **Firma:** `execute(input: MarkPurchaseAsPaidInput): Promise<PurchaseOutput>` — [mark-purchase-as-paid.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/mark-purchase-as-paid.use-case.ts#L36) (L36–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.purchaseRepository.findById`, `new PurchaseNotFoundError`, `new PurchaseAlreadyPaidError`, `this.purchaseRepository.markAsPaid`, `toPurchaseOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new PurchaseNotFoundError(input.id)`, `new PurchaseAlreadyPaidError(input.id)`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-purchases-application-use-cases-void-purchase-use-case-ts"></a>

### void-purchase.use-case.ts

- **Ruta:** [void-purchase.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/void-purchase.use-case.ts) (`comercial-jhoel-api/src/modules/purchases/application/use-cases/void-purchase.use-case.ts`, 59 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** "Anular factura" — the only correction path for a mistaken purchase (per this ticket's explicit decision: no "editar factura" that touches productos/cantidades/costos — the fix is always anular + registrar una compra nueva y correcta).
- **Depende de (archivos del proyecto):** [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts), [purchase-not-found.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-not-found-error-ts), [purchase-already-voided.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-already-voided-error-ts), [purchase-void-reason-required.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-void-reason-required-error-ts), [purchase-output.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-dtos-purchase-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts)

**Interfaces, tipos y enums:**

- `interface VoidPurchaseInput` (L9): sin documentación — miembros: `id`, `voidedBy`, `reason`

#### Clase `VoidPurchaseUseCase` (L30–58)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Anular factura" — the only correction path for a mistaken purchase (per this ticket's explicit decision: no "editar factura" that touches productos/cantidades/costos — the fix is always anular + registrar una compra nueva y correcta). Never an edit, never a physical delete: the original row stays exactly as registered, marked `ANULADA` forever. The real guard order (reason → not-found → already-voided → has-payment → insufficient-stock-to-revert) runs atomically inside `void_purchase`'s own row locks — this use case only pre-checks existence/already-voided for a clean error message and translates the result; a TypeScript-side pre-check of the payment/stock rules would only add a TOCTOU gap, not close one (same reasoning already established for every other stored-function-backed void in this codebase).
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASE_REPOSITORY) purchaseRepository: PurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 37–57 | `input: VoidPurchaseInput` | `Promise<PurchaseOutput>` |

##### `VoidPurchaseUseCase.execute`

- **Firma:** `execute(input: VoidPurchaseInput): Promise<PurchaseOutput>` — [void-purchase.use-case.ts](../../../../comercial-jhoel-api/src/modules/purchases/application/use-cases/void-purchase.use-case.ts#L37) (L37–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.reason?.trim`, `new PurchaseVoidReasonRequiredError`, `this.purchaseRepository.findById`, `new PurchaseNotFoundError`, `new PurchaseAlreadyVoidedError`, `this.purchaseRepository.voidPurchase`, `toPurchaseOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new PurchaseVoidReasonRequiredError()`, `new PurchaseNotFoundError(input.id)`, `new PurchaseAlreadyVoidedError(input.id)`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-detail-entity-ts"></a>

### purchase-detail.entity.ts

- **Ruta:** [purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase-detail.entity.ts) (`comercial-jhoel-api/src/modules/purchases/domain/entities/purchase-detail.entity.ts`, 58 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** A frozen line item — `costPrice`/`publicPrice`/`total` are the values recorded at the moment of purchase, never recomputed from the live product.
- **Consumidores:** [purchase.entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-entity-ts), [purchase.mapper.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-mapper-ts)

**Interfaces, tipos y enums:**

- `interface PurchaseDetailProps` (L1): sin documentación — miembros: `id`, `productId`, `productName`, `sku`, `quantity`, `costPrice`, `publicPrice`, `total`, `presentationName`

#### Clase `PurchaseDetail` (L15–57)

- **Propósito:** A frozen line item — `costPrice`/`publicPrice`/`total` are the values recorded at the moment of purchase, never recomputed from the live product.
- **Dependencias inyectadas (constructor):** `props: PurchaseDetailProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 18–20 | `props: PurchaseDetailProps` | `PurchaseDetail` |
| `id` | getter public | 22–24 | — | `string` |
| `productId` | getter public | 26–28 | — | `string` |
| `productName` | getter public | 30–32 | — | `string` |
| `sku` | getter public | 34–36 | — | `string \| null` |
| `quantity` | getter public | 38–40 | — | `number` |
| `costPrice` | getter public | 42–44 | — | `number` |
| `publicPrice` | getter public | 46–48 | — | `number` |
| `total` | getter public | 50–52 | — | `number` |
| `presentationName` | getter public | 54–56 | — | `string` |

##### `PurchaseDetail.create`

- **Firma:** `create(props: PurchaseDetailProps): PurchaseDetail` — [purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase-detail.entity.ts#L18) (L18–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new PurchaseDetail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchase.mapper.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-mapper-ts)

##### `PurchaseDetail.id`

- **Firma:** `id(): string` — [purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase-detail.entity.ts#L22) (L22–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseDetail.productId`

- **Firma:** `productId(): string` — [purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase-detail.entity.ts#L26) (L26–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseDetail.productName`

- **Firma:** `productName(): string` — [purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase-detail.entity.ts#L30) (L30–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseDetail.sku`

- **Firma:** `sku(): string \| null` — [purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase-detail.entity.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseDetail.quantity`

- **Firma:** `quantity(): number` — [purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase-detail.entity.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseDetail.costPrice`

- **Firma:** `costPrice(): number` — [purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase-detail.entity.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseDetail.publicPrice`

- **Firma:** `publicPrice(): number` — [purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase-detail.entity.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseDetail.total`

- **Firma:** `total(): number` — [purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase-detail.entity.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseDetail.presentationName`

- **Firma:** `presentationName(): string` — [purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase-detail.entity.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-entity-ts"></a>

### purchase.entity.ts

- **Ruta:** [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts) (`comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts`, 128 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Entidad de dominio: declara `Purchase`, `PurchaseProps`, `PurchasePaymentType`, `PurchasePaymentStatus` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchase-detail.entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-detail-entity-ts)
- **Consumidores:** [get-alerts.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts), [build-alerts.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-spec-ts), [build-alerts.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-ts), [purchase-output.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-dtos-purchase-output-ts), [mark-purchase-as-paid.use-case.spec.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-spec-ts), [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts), [purchase.mapper.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-mapper-ts), [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts), [purchases-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-purchases-report-output-ts)

**Interfaces, tipos y enums:**

- `interface PurchaseProps` (L6): sin documentación — miembros: `id`, `supplierId`, `supplierName`, `userId`, `username`, `purchaseDate`, `total`, `items`, `createdAt`, `updatedAt`, `paymentType`, `paymentDueDate`, `paymentStatus`, `paidAt`, `paidBy`, `paidByUsername`, `invoiceNumber`, `isVoided`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`
- `type PurchasePaymentType` (L3) = `'CONTADO' \| 'CREDITO'`
- `type PurchasePaymentStatus` (L4) = `'PENDING' \| 'PAID'`

#### Clase `Purchase` (L33–127)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: PurchaseProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 36–38 | `props: PurchaseProps` | `Purchase` |
| `id` | getter public | 40–42 | — | `string` |
| `supplierId` | getter public | 44–46 | — | `string` |
| `supplierName` | getter public | 48–50 | — | `string` |
| `userId` | getter public | 52–54 | — | `string` |
| `username` | getter public | 56–58 | — | `string` |
| `purchaseDate` | getter public | 60–62 | — | `Date` |
| `total` | getter public | 64–66 | — | `number` |
| `items` | getter public | 68–70 | — | `PurchaseDetail[]` |
| `createdAt` | getter public | 72–74 | — | `Date` |
| `updatedAt` | getter public | 76–78 | — | `Date` |
| `paymentType` | getter public | 80–82 | — | `PurchasePaymentType` |
| `paymentDueDate` | getter public | 84–86 | — | `string \| null` |
| `paymentStatus` | getter public | 88–90 | — | `PurchasePaymentStatus` |
| `paidAt` | getter public | 92–94 | — | `Date \| null` |
| `paidBy` | getter public | 96–98 | — | `string \| null` |
| `paidByUsername` | getter public | 100–102 | — | `string \| null` |
| `invoiceNumber` | getter public | 104–106 | — | `string \| null` |
| `isVoided` | getter public | 108–110 | — | `boolean` |
| `voidedAt` | getter public | 112–114 | — | `Date \| null` |
| `voidedBy` | getter public | 116–118 | — | `string \| null` |
| `voidedByUsername` | getter public | 120–122 | — | `string \| null` |
| `voidReason` | getter public | 124–126 | — | `string \| null` |

##### `Purchase.create`

- **Firma:** `create(props: PurchaseProps): Purchase` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Purchase`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-alerts.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts), [build-alerts.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-spec-ts), [mark-purchase-as-paid.use-case.spec.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-spec-ts), [purchase.mapper.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-mapper-ts)

##### `Purchase.id`

- **Firma:** `id(): string` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.supplierId`

- **Firma:** `supplierId(): string` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.supplierName`

- **Firma:** `supplierName(): string` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.userId`

- **Firma:** `userId(): string` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.username`

- **Firma:** `username(): string` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.purchaseDate`

- **Firma:** `purchaseDate(): Date` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.total`

- **Firma:** `total(): number` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.items`

- **Firma:** `items(): PurchaseDetail[]` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L68) (L68–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.createdAt`

- **Firma:** `createdAt(): Date` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L72) (L72–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.updatedAt`

- **Firma:** `updatedAt(): Date` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L76) (L76–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.paymentType`

- **Firma:** `paymentType(): PurchasePaymentType` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.paymentDueDate`

- **Firma:** `paymentDueDate(): string \| null` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L84) (L84–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.paymentStatus`

- **Firma:** `paymentStatus(): PurchasePaymentStatus` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L88) (L88–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.paidAt`

- **Firma:** `paidAt(): Date \| null` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L92) (L92–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.paidBy`

- **Firma:** `paidBy(): string \| null` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L96) (L96–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.paidByUsername`

- **Firma:** `paidByUsername(): string \| null` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L100) (L100–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.invoiceNumber`

- **Firma:** `invoiceNumber(): string \| null` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L104) (L104–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.isVoided`

- **Firma:** `isVoided(): boolean` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L108) (L108–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.voidedAt`

- **Firma:** `voidedAt(): Date \| null` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L112) (L112–114)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.voidedBy`

- **Firma:** `voidedBy(): string \| null` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L116) (L116–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.voidedByUsername`

- **Firma:** `voidedByUsername(): string \| null` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L120) (L120–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Purchase.voidReason`

- **Firma:** `voidReason(): string \| null` — [purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/entities/purchase.entity.ts#L124) (L124–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-insufficient-stock-to-revert-purchase-error-ts"></a>

### insufficient-stock-to-revert-purchase.error.ts

- **Ruta:** [insufficient-stock-to-revert-purchase.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/insufficient-stock-to-revert-purchase.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/insufficient-stock-to-revert-purchase.error.ts`, 13 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** The stock this purchase brought in was already partially or fully consumed elsewhere (a sale, a transfer, another purchase's own correction) — reverting it would take a product negative.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

#### Clase `InsufficientStockToRevertPurchaseError` (L4–12)

- **Herencia / contratos:** extends DomainError
- **Propósito:** The stock this purchase brought in was already partially or fully consumed elsewhere (a sale, a transfer, another purchase's own correction) — reverting it would take a product negative.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-payment-data-error-ts"></a>

### invalid-payment-data.error.ts

- **Ruta:** [invalid-payment-data.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/invalid-payment-data.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/invalid-payment-data.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Errores de dominio: declara `InvalidPaymentDataError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts), [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

#### Clase `InvalidPaymentDataError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `message: string`
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-purchase-date-error-ts"></a>

### invalid-purchase-date.error.ts

- **Ruta:** [invalid-purchase-date.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/invalid-purchase-date.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/invalid-purchase-date.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Errores de dominio: declara `InvalidPurchaseDateError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts)

#### Clase `InvalidPurchaseDateError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-purchase-price-error-ts"></a>

### invalid-purchase-price.error.ts

- **Ruta:** [invalid-purchase-price.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/invalid-purchase-price.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/invalid-purchase-price.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Errores de dominio: declara `InvalidPurchasePriceError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts), [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

#### Clase `InvalidPurchasePriceError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-purchase-quantity-error-ts"></a>

### invalid-purchase-quantity.error.ts

- **Ruta:** [invalid-purchase-quantity.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/invalid-purchase-quantity.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/invalid-purchase-quantity.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Errores de dominio: declara `InvalidPurchaseQuantityError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts), [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

#### Clase `InvalidPurchaseQuantityError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-supplier-error-ts"></a>

### invalid-supplier.error.ts

- **Ruta:** [invalid-supplier.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/invalid-supplier.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/invalid-supplier.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Errores de dominio: declara `InvalidSupplierError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

#### Clase `InvalidSupplierError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-access-denied-error-ts"></a>

### purchase-access-denied.error.ts

- **Ruta:** [purchase-access-denied.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-access-denied.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-access-denied.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** A USER account trying to view a purchase that isn't theirs — ADMIN/SUPER_ADMIN can view any purchase.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-purchase-by-id.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-by-id-use-case-ts), [get-purchase-pdf.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-pdf-use-case-ts)

#### Clase `PurchaseAccessDeniedError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** A USER account trying to view a purchase that isn't theirs — ADMIN/SUPER_ADMIN can view any purchase.
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-already-paid-error-ts"></a>

### purchase-already-paid.error.ts

- **Ruta:** [purchase-already-paid.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-already-paid.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-already-paid.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Errores de dominio: declara `PurchaseAlreadyPaidError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [mark-purchase-as-paid.use-case.spec.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-spec-ts), [mark-purchase-as-paid.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-ts)

#### Clase `PurchaseAlreadyPaidError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-already-voided-error-ts"></a>

### purchase-already-voided.error.ts

- **Ruta:** [purchase-already-voided.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-already-voided.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-already-voided.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Errores de dominio: declara `PurchaseAlreadyVoidedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-void-purchase-use-case-ts), [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

#### Clase `PurchaseAlreadyVoidedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-empty-error-ts"></a>

### purchase-empty.error.ts

- **Ruta:** [purchase-empty.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-empty.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-empty.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Errores de dominio: declara `PurchaseEmptyError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts), [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

#### Clase `PurchaseEmptyError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-not-found-error-ts"></a>

### purchase-not-found.error.ts

- **Ruta:** [purchase-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-not-found.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Errores de dominio: declara `PurchaseNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-purchase-by-id.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-by-id-use-case-ts), [get-purchase-pdf.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-pdf-use-case-ts), [mark-purchase-as-paid.use-case.spec.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-spec-ts), [mark-purchase-as-paid.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-ts), [void-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-void-purchase-use-case-ts), [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

#### Clase `PurchaseNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-product-inactive-error-ts"></a>

### purchase-product-inactive.error.ts

- **Ruta:** [purchase-product-inactive.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-product-inactive.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-product-inactive.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Errores de dominio: declara `PurchaseProductInactiveError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

#### Clase `PurchaseProductInactiveError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-product-not-found-error-ts"></a>

### purchase-product-not-found.error.ts

- **Ruta:** [purchase-product-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-product-not-found.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-product-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Errores de dominio: declara `PurchaseProductNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

#### Clase `PurchaseProductNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-void-blocked-by-payment-error-ts"></a>

### purchase-void-blocked-by-payment.error.ts

- **Ruta:** [purchase-void-blocked-by-payment.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-void-blocked-by-payment.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-void-blocked-by-payment.error.ts`, 13 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Fires only when a CREDITO purchase was already marked as paid via a separate "Marcar como pagada" action — never for a CONTADO purchase, which is always `PAID` from the moment it's created (see `confirm_purchase`) and is NOT what this guard is protecting against.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

#### Clase `PurchaseVoidBlockedByPaymentError` (L4–12)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Fires only when a CREDITO purchase was already marked as paid via a separate "Marcar como pagada" action — never for a CONTADO purchase, which is always `PAID` from the moment it's created (see `confirm_purchase`) and is NOT what this guard is protecting against.
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-void-reason-required-error-ts"></a>

### purchase-void-reason-required.error.ts

- **Ruta:** [purchase-void-reason-required.error.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-void-reason-required.error.ts) (`comercial-jhoel-api/src/modules/purchases/domain/errors/purchase-void-reason-required.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Errores de dominio: declara `PurchaseVoidReasonRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-void-purchase-use-case-ts), [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

#### Clase `PurchaseVoidReasonRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts"></a>

### purchase.repository.ts

- **Ruta:** [purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/purchases/domain/repositories/purchase.repository.ts) (`comercial-jhoel-api/src/modules/purchases/domain/repositories/purchase.repository.ts`, 85 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `PurchaseItemData`, `ConfirmPurchaseData`, `FindPurchasesOptions`, `PaginatedResult`, `PurchaseDailyAmount` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchase.entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-entity-ts)
- **Consumidores:** [get-alerts.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [create-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts), [get-purchase-by-id.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-by-id-use-case-ts), [get-purchase-pdf.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-pdf-use-case-ts), [get-purchases-daily-stats.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-daily-stats-use-case-ts), [get-purchases-weekly-stats.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-weekly-stats-use-case-ts), [get-purchases-yearly-stats.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-yearly-stats-use-case-ts), [list-purchases.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-list-purchases-use-case-ts), [mark-purchase-as-paid.use-case.spec.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-spec-ts), [mark-purchase-as-paid.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-ts), [void-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-void-purchase-use-case-ts), [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts), [list-purchases.query.dto.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-list-purchases-query-dto-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts) y 1 más

**Interfaces, tipos y enums:**

- `interface PurchaseItemData` (L5): sin documentación — miembros: `productId`, `presentationId`, `quantity`, `costPrice`, `publicPrice`
- `interface ConfirmPurchaseData` (L14): sin documentación — miembros: `supplierId`, `userId`, `purchaseDate`, `items`, `paymentType`, `paymentDueDate`, `invoiceNumber`
- `interface FindPurchasesOptions` (L30): sin documentación — miembros: `userId`, `supplierId`, `startDate`, `endDate`, `search`, `status`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface PaginatedResult` (L47): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface PurchaseDailyAmount` (L54): sin documentación — miembros: `date`, `amount`
- `interface PurchaseMonthlyAmount` (L60): sin documentación — miembros: `month`, `amount`
- `interface PurchaseRepository` (L66): sin documentación — miembros: `confirmPurchase`, `findAll`, `findById`, `markAsPaid`, `findPendingCreditPurchases`, `voidPurchase`, `getDailyPurchaseTotals`, `getMonthlyPurchaseTotals`
- `type PurchaseSortField` (L26) = `'purchaseDate' \| 'total' \| 'createdAt'`
- `type SortDirection` (L27) = `'asc' \| 'desc'`
- `type PurchaseStatusFilter` (L28) = `'ACTIVE' \| 'VOIDED'`

**Constantes exportadas:**

- `PURCHASE_REPOSITORY` (L3) = `Symbol('PURCHASE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-purchases-infrastructure-excel-purchase-import-builder-ts"></a>

### purchase-import.builder.ts

- **Ruta:** [purchase-import.builder.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/excel/purchase-import.builder.ts) (`comercial-jhoel-api/src/modules/purchases/infrastructure/excel/purchase-import.builder.ts`, 89 líneas)
- **Tipo:** Builder · **Capa:** Infraestructura · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Blank import template — `PURCHASE_IMPORT_HEADERS` as the header row, plus two example rows showing the "one product, two presentation lines" case this feature exists for.
- **Paquetes externos:** `exceljs`
- **Consumidores:** [import-purchase-from-excel.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts), [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

**Constantes exportadas:**

- `PURCHASE_IMPORT_HEADERS` (L30): The exact, ordered header row `ImportPurchaseFromExcelUseCase` expects — defined once here, imported by that use case, so the parser and the template it hands out can never silently drift apart. = `[ 'SKU', 'Producto', 'Presentación', 'Cantidad', 'Ubicación Destino', ] as const`
#### Función `buildPurchaseImportTemplate` (L45–88)

- **Tipo:** función exportada, async
- **Firma:** `buildPurchaseImportTemplate(): Promise<Buffer>` — [purchase-import.builder.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/excel/purchase-import.builder.ts#L45)
- **Propósito / descripción:** Blank import template — `PURCHASE_IMPORT_HEADERS` as the header row, plus two example rows showing the "one product, two presentation lines" case this feature exists for. `ImportPurchaseFromExcelUseCase` reads columns purely by position (1-4, matching this exact order), never by header text matching beyond the one initial "does this look like our template" check.
- **Dependencias:** `new ExcelJS.Workbook`, `new Date`, `workbook.addWorksheet`, `sheet.getRow`, `sheet.addRow`, `sheet.getColumn`, `workbook.xlsx.writeBuffer`, `Buffer.from`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-purchases-infrastructure-pdf-purchase-pdf-builder-ts"></a>

### purchase-pdf.builder.ts

- **Ruta:** [purchase-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/pdf/purchase-pdf.builder.ts) (`comercial-jhoel-api/src/modules/purchases/infrastructure/pdf/purchase-pdf.builder.ts`, 263 líneas)
- **Tipo:** Builder · **Capa:** Infraestructura · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Reconstructs a Compra invoice purely from already-persisted data (`PurchaseOutput` + `Supplier` + company settings) — never re-runs `confirm_purchase` or touches inventory.
- **Depende de (archivos del proyecto):** [pdf-helpers.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-ts)
- **Paquetes externos:** `pdfkit`
- **Consumidores:** [get-purchase-pdf.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-pdf-use-case-ts)

**Interfaces, tipos y enums:**

- `interface PurchasePdfItem` (L10): sin documentación — miembros: `productName`, `presentationName`, `quantity`, `costPrice`, `total`
- `interface PurchasePdfSupplier` (L18): sin documentación — miembros: `name`, `phone`, `address`, `taxId`
- `interface PurchasePdfOptions` (L25): sin documentación — miembros: `company`, `purchaseNumber`, `purchaseDate`, `username`, `supplier`, `paymentType`, `paymentDueDate`, `items`, `total`, `invoiceNumber`, `isVoided`, `voidReason`
#### Función `buildPurchasePdf` (L57–81)

- **Tipo:** función exportada
- **Firma:** `buildPurchasePdf(options: PurchasePdfOptions): Promise<Buffer>` — [purchase-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/pdf/purchase-pdf.builder.ts#L57)
- **Propósito / descripción:** Reconstructs a Compra invoice purely from already-persisted data (`PurchaseOutput` + `Supplier` + company settings) — never re-runs `confirm_purchase` or touches inventory. Normal A4 document layout, structurally mirrors `sale-pdf.builder.ts`.
- **Dependencias:** `new PDFDocument`, `doc.on`, `chunks.push`, `new Promise`, `resolve`, `Buffer.concat`, `drawCompanyLetterhead`, `doc.moveDown`, `drawDivider`, `drawDocumentInfo`, `drawTable`, `drawTotals`, `numberPages`, `doc.end`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-purchase-pdf.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-pdf-use-case-ts)

#### Función `drawDocumentInfo` (L83–162)

- **Tipo:** función local del archivo
- **Firma:** `drawDocumentInfo(doc: PDFKit.PDFDocument, options: PurchasePdfOptions): void` — [purchase-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/pdf/purchase-pdf.builder.ts#L83)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `doc.fontSize(16).fillColor('#0f172a').text`, `doc.fontSize(16).fillColor`, `doc.fontSize`, `doc.fontSize(12).fillColor('#dc2626').text`, `doc.fontSize(12).fillColor`, `doc.fontSize(9).fillColor('#334155').text`, `doc.fontSize(9).fillColor`, `doc.text`, `formatDateTime`, `doc.fontSize(10).fillColor('#0f172a').text`, `doc.fontSize(10).fillColor`, `drawDivider`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawTable` (L164–224)

- **Tipo:** función local del archivo
- **Firma:** `drawTable(doc: PDFKit.PDFDocument, items: PurchasePdfItem[]): void` — [purchase-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/pdf/purchase-pdf.builder.ts#L164)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `COLUMNS.reduce`, `doc.rect(startX, y, totalWidth, HEADER_ROW_HEIGHT).fill`, `doc.rect`, `doc.fontSize(9).fillColor`, `doc.fontSize`, `doc.text`, `doc.fillColor`, `doc.addPage`, `drawTableHeader`, `doc.moveDown`, `items.forEach`, `ensureSpace`, `doc.rect(startX, y, totalWidth, ROW_HEIGHT).fill`, `String`, `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawTotals` (L226–239)

- **Tipo:** función local del archivo
- **Firma:** `drawTotals(doc: PDFKit.PDFDocument, total: number): void` — [purchase-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/pdf/purchase-pdf.builder.ts#L226)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `doc.fontSize(13).fillColor('#0f172a').text`, `doc.fontSize(13).fillColor`, `doc.fontSize`, `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `numberPages` (L241–262)

- **Tipo:** función local del archivo
- **Firma:** `numberPages(doc: PDFKit.PDFDocument): void` — [purchase-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/pdf/purchase-pdf.builder.ts#L241)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.bufferedPageRange`, `doc.switchToPage`, `doc.fontSize(8).fillColor('#94a3b8').text`, `doc.fontSize(8).fillColor`, `doc.fontSize`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-detail-orm-entity-ts"></a>

### purchase-detail.orm-entity.ts

- **Ruta:** [purchase-detail.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/purchase-detail.orm-entity.ts) (`comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/purchase-detail.orm-entity.ts`, 79 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `PurchaseDetailOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product.orm-entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-orm-entity-ts), [product-presentation.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-product-presentation-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [purchase.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [purchase.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-orm-entity-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts), [typeorm-purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-purchases-report-repository-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `PurchaseDetailOrmEntity` (L13–78)

- **Decoradores:** `@Entity('purchase_details')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column purchaseId: string`, `@ManyToOne purchase: PurchaseOrmEntity`, `@Column productId: string`, `@ManyToOne product: ProductOrmEntity`, `@Column quantity: number`, `@Column costPrice: number`, `@Column publicPrice: number`, `@Column total: number`, `@Column presentationId: string \| null`, `@ManyToOne presentation: ProductPresentationOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-mapper-ts"></a>

### purchase.mapper.ts

- **Ruta:** [purchase.mapper.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/purchase.mapper.ts) (`comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/purchase.mapper.ts`, 46 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Mapper: declara `PurchaseMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchase.entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-entity-ts), [purchase-detail.entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-detail-entity-ts), [purchase.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-orm-entity-ts)
- **Consumidores:** [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

#### Clase `PurchaseMapper` (L5–45)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 7–44 | `orm: PurchaseOrmEntity` | `Purchase` |

##### `PurchaseMapper.toDomain`

- **Firma:** `toDomain(orm: PurchaseOrmEntity): Purchase` — [purchase.mapper.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/purchase.mapper.ts#L7) (L7–44)
- **Propósito / descripción:** `orm.items` is `undefined` whenever the query didn't join `purchase_details` (the list view never does) — mapped to `[]`.
- **Dependencias (llamadas en su cuerpo):** `Purchase.create`, `(orm.items ?? []).map`, `PurchaseDetail.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-orm-entity-ts"></a>

### purchase.orm-entity.ts

- **Ruta:** [purchase.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/purchase.orm-entity.ts) (`comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/purchase.orm-entity.ts`, 101 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `PurchaseOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [supplier.orm-entity.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-supplier-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [purchase-detail.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-detail-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [dashboard.module.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-dashboard-module-ts), [typeorm-dashboard.repository.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-infrastructure-persistence-typeorm-dashboard-repository-ts), [purchase-detail.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-detail-orm-entity-ts), [purchase.mapper.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-mapper-ts), [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts), [typeorm-purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-purchases-report-repository-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `PurchaseOrmEntity` (L16–100)

- **Decoradores:** `@Entity('purchases')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column supplierId: string`, `@ManyToOne supplier: SupplierOrmEntity`, `@Column userId: string`, `@ManyToOne user: UserOrmEntity`, `@Column purchaseDate: Date`, `@Column total: number`, `@OneToMany items: PurchaseDetailOrmEntity[]`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column paymentType: 'CONTADO' \| 'CREDITO'`, `@Column paymentDueDate: string \| null`, `@Column paymentStatus: 'PENDING' \| 'PAID'`, `@Column paidAt: Date \| null`, `@Column paidBy: string \| null`, `@ManyToOne paidByUser: UserOrmEntity \| null`, `@Column invoiceNumber: string \| null`, `@Column isVoided: boolean`, `@Column voidedAt: Date \| null`, `@Column voidedBy: string \| null`, `@ManyToOne voidedByUser: UserOrmEntity \| null`, `@Column voidReason: string \| null`
<a id="f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts"></a>

### typeorm-purchase.repository.ts

- **Ruta:** [typeorm-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts) (`comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts`, 312 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmPurchaseRepository`, `SORT_COLUMN` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchase.entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-entity-ts), [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts), [purchase-empty.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-empty-error-ts), [invalid-supplier.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-supplier-error-ts), [purchase-product-not-found.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-product-not-found-error-ts), [purchase-product-inactive.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-product-inactive-error-ts), [invalid-purchase-quantity.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-purchase-quantity-error-ts), [invalid-purchase-price.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-purchase-price-error-ts), [invalid-payment-data.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-invalid-payment-data-error-ts), [purchase-not-found.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-not-found-error-ts), [purchase-already-voided.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-already-voided-error-ts), [purchase-void-reason-required.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-void-reason-required-error-ts), [purchase-void-blocked-by-payment.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-purchase-void-blocked-by-payment-error-ts), [insufficient-stock-to-revert-purchase.error.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-errors-insufficient-stock-to-revert-purchase-error-ts), [purchase.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-orm-entity-ts) y 1 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts)

#### Clase `TypeOrmPurchaseRepository` (L35–311)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements PurchaseRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(PurchaseOrmEntity) repository: Repository<PurchaseOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `confirmPurchase` | método public async | 42–89 | `data: ConfirmPurchaseData` | `Promise<Purchase>` |
| `findAll` | método public async | 91–143 | `options: FindPurchasesOptions` | `Promise<PaginatedResult<Purchase>>` |
| `findById` | método public async | 145–151 | `id: string` | `Promise<Purchase \| null>` |
| `markAsPaid` | método public async | 153–165 | `id: string`, `paidBy: string` | `Promise<Purchase>` |
| `findPendingCreditPurchases` | método public async | 167–188 | `options?: { userId?: string; }` | `Promise<Purchase[]>` |
| `voidPurchase` | método public async | 190–211 | `id: string`, `voidedBy: string`, `reason: string` | `Promise<Purchase>` |
| `translatePurchaseVoidError` | método private | 214–239 | `error: unknown` | `unknown` |
| `translatePurchaseError` | método private | 242–278 | `error: unknown` | `unknown` |
| `getDailyPurchaseTotals` | método public async | 280–294 | `startDate: Date`, `endDate: Date` | `Promise<PurchaseDailyAmount[]>` |
| `getMonthlyPurchaseTotals` | método public async | 296–310 | `startDate: Date`, `endDate: Date` | `Promise<PurchaseMonthlyAmount[]>` |

##### `TypeOrmPurchaseRepository.confirmPurchase`

- **Firma:** `confirmPurchase(data: ConfirmPurchaseData): Promise<Purchase>` — [typeorm-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts#L42) (L42–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `JSON.stringify`, `data.items.map`, `this.repository.manager.query`, `this.translatePurchaseError`, `this.repository.update`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `confirm_purchase`; Actualiza estado (signals): `this.repository.update`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translatePurchaseError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la compra recién creada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPurchaseRepository.findAll`

- **Firma:** `findAll(options: FindPurchasesOptions): Promise<PaginatedResult<Purchase>>` — [typeorm-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts#L91) (L91–143)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('purchase').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `orms.map`, `PurchaseMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPurchaseRepository.findById`

- **Firma:** `findById(id: string): Promise<Purchase \| null>` — [typeorm-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts#L145) (L145–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `PurchaseMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmPurchaseRepository.markAsPaid`

- **Firma:** `markAsPaid(id: string, paidBy: string): Promise<Purchase>` — [typeorm-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts#L153) (L153–165)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `new Date`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `new InternalServerErrorException( 'No se pudo recuperar la compra recién pagada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPurchaseRepository.findPendingCreditPurchases`

- **Firma:** `findPendingCreditPurchases(options?: { userId?: string; }): Promise<Purchase[]>` — [typeorm-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts#L167) (L167–188)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('purchase').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.orderBy`, `qb.getMany`, `orms.map`, `PurchaseMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPurchaseRepository.voidPurchase`

- **Firma:** `voidPurchase(id: string, voidedBy: string, reason: string): Promise<Purchase>` — [typeorm-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts#L190) (L190–211)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translatePurchaseVoidError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `void_purchase`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translatePurchaseVoidError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la factura recién anulada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPurchaseRepository.translatePurchaseVoidError`

- **Firma:** `translatePurchaseVoidError(error: unknown): unknown` — [typeorm-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts#L214) (L214–239)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;id&gt;'` → domain-error translation pattern as `translatePurchaseError` — kept separate since the codes don't overlap.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new PurchaseVoidReasonRequiredError`, `new PurchaseNotFoundError`, `new PurchaseAlreadyVoidedError`, `new PurchaseVoidBlockedByPaymentError`, `new InsufficientStockToRevertPurchaseError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmPurchaseRepository.translatePurchaseError`

- **Firma:** `translatePurchaseError(error: unknown): unknown` — [typeorm-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts#L242) (L242–278)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;productId&gt;'` → domain-error translation as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new PurchaseEmptyError`, `new InvalidSupplierError`, `new PurchaseProductNotFoundError`, `new PurchaseProductInactiveError`, `new InvalidPurchaseQuantityError`, `new InvalidPurchasePriceError`, `new InvalidPaymentDataError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmPurchaseRepository.getDailyPurchaseTotals`

- **Firma:** `getDailyPurchaseTotals(startDate: Date, endDate: Date): Promise<PurchaseDailyAmount[]>` — [typeorm-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts#L280) (L280–294)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('purchase').select(dateExpr, 'date').addSelect`, `this.repository.createQueryBuilder('purchase').select`, `this.repository.createQueryBuilder`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPurchaseRepository.getMonthlyPurchaseTotals`

- **Firma:** `getMonthlyPurchaseTotals(startDate: Date, endDate: Date): Promise<PurchaseMonthlyAmount[]>` — [typeorm-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts#L296) (L296–310)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('purchase').select(monthExpr, 'month').addSelect`, `this.repository.createQueryBuilder('purchase').select`, `this.repository.createQueryBuilder`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts"></a>

### purchases.controller.ts

- **Ruta:** [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts) (`comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts`, 234 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** No `@Roles(...)` restriction — same policy as Sales, applied consistently per this ticket's own instruction: registering a purchase (receiving stock) is an operational action for whoever runs the register, not an admin-only one.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts), [list-purchases.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-list-purchases-use-case-ts), [get-purchase-by-id.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-by-id-use-case-ts), [mark-purchase-as-paid.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-ts), [get-purchase-pdf.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-pdf-use-case-ts), [void-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-void-purchase-use-case-ts), [import-purchase-from-excel.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts), [get-purchases-daily-stats.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-daily-stats-use-case-ts), [get-purchases-weekly-stats.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-weekly-stats-use-case-ts), [get-purchases-yearly-stats.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-yearly-stats-use-case-ts), [purchase-import.builder.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-excel-purchase-import-builder-ts) y 8 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/platform-express`, `express`
- **Consumidores:** [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts)

**Interfaces, tipos y enums:**

- `interface UploadedExcelFile` (L50): The minimal shape actually read off an uploaded file — same as `ProductsController`'s own, avoids a dependency on `@types/multer` for a single-field usage. — miembros: `buffer`, `originalname`, `size`

#### Clase `PurchasesController` (L67–233)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('purchases')`
- **Propósito:** No `@Roles(...)` restriction — same policy as Sales, applied consistently per this ticket's own instruction: registering a purchase (receiving stock) is an operational action for whoever runs the register, not an admin-only one. `JwtAuthGuard` (any authenticated, active account) is the only gate. `ListPurchasesUseCase`/`GetPurchaseByIdUseCase` still restrict *which* purchases a non-admin can see (only their own) — enforced in the use case, not here, identical to how Sales does it.
- **Dependencias inyectadas (constructor):** `createPurchaseUseCase: CreatePurchaseUseCase`, `listPurchasesUseCase: ListPurchasesUseCase`, `getPurchaseByIdUseCase: GetPurchaseByIdUseCase`, `markPurchaseAsPaidUseCase: MarkPurchaseAsPaidUseCase`, `getPurchasePdfUseCase: GetPurchasePdfUseCase`, `voidPurchaseUseCase: VoidPurchaseUseCase`, `importPurchaseFromExcelUseCase: ImportPurchaseFromExcelUseCase`, `getPurchasesDailyStatsUseCase: GetPurchasesDailyStatsUseCase`, `getPurchasesWeeklyStatsUseCase: GetPurchasesWeeklyStatsUseCase`, `getPurchasesYearlyStatsUseCase: GetPurchasesYearlyStatsUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 83–98 | `dto: CreatePurchaseRequestDto`, `userId: string` | `Promise<PurchaseResponseDto>` |
| `importExcel` | método public | 109–121 | `file: UploadedExcelFile`, `userId: string` | `Promise<ImportPurchaseResultResponseDto>` |
| `voidPurchase` | método public | 129–143 | `id: string`, `dto: VoidPurchaseRequestDto`, `userId: string` | `Promise<PurchaseResponseDto>` |
| `markAsPaid` | método public | 146–153 | `id: string`, `userId: string` | `Promise<PurchaseResponseDto>` |
| `findAll` | método public | 155–165 | `query: ListPurchasesQueryDto`, `user: RequestUser` | `Promise<PaginatedPurchasesResponseDto>` |
| `importTemplate` | método public async | 168–179 | `res: Response` | `Promise<void>` |
| `dailyStats` | método public | 182–185 | — | `Promise<PurchasesDailyStatsResponseDto>` |
| `weeklyStats` | método public | 188–191 | — | `Promise<PurchasesWeeklyStatsResponseDto>` |
| `yearlyStats` | método public | 194–197 | — | `Promise<PurchasesYearlyStatsResponseDto>` |
| `getPdf` | método public async | 205–221 | `id: string`, `user: RequestUser`, `res: Response` | `Promise<void>` |
| `findOne` | método public | 223–232 | `id: string`, `user: RequestUser` | `Promise<PurchaseResponseDto>` |

##### `PurchasesController.create`

- **Firma:** `create(dto: CreatePurchaseRequestDto, userId: string): Promise<PurchaseResponseDto>` — [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L83) (L83–98)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createPurchaseUseCase.execute`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesController.importExcel`

- **Firma:** `importExcel(file: UploadedExcelFile, userId: string): Promise<ImportPurchaseResultResponseDto>` — [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L109) (L109–121)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post('import')` `@UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_IMPORT_FILE_SIZE_BYTES } }))`
- **Propósito / descripción:** "Cargar stock inicial (Excel)" — registers one or more real purchases (see `ImportPurchaseFromExcelUseCase`'s own doc comment) attributed to the fixed "Carga Inicial de Inventario" supplier. Admin-only, like Products' own bulk import — registering hundreds of purchases at once is a heavier action than the operational, any-authenticated-account `POST /purchases` above. Declared before `POST /:id/void`/`:id/pay` so "import" is never swallowed as an `:id` value.
- **Origen de parámetros:** `@UploadedFile() file`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `new BadRequestException`, `this.importPurchaseFromExcelUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BadRequestException('Debes adjuntar un archivo Excel (.xlsx).')`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesController.voidPurchase`

- **Firma:** `voidPurchase(id: string, dto: VoidPurchaseRequestDto, userId: string): Promise<PurchaseResponseDto>` — [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L129) (L129–143)
- **Decoradores:** `@Post(':id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** "Anular factura" — admin-only correction path for the "Administrar Facturas de Compras" module. Never an edit, never a physical delete — see `VoidPurchaseUseCase`'s own doc comment for why there is deliberately no "editar factura" that touches productos/cantidades.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidPurchaseUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesController.markAsPaid`

- **Firma:** `markAsPaid(id: string, userId: string): Promise<PurchaseResponseDto>` — [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L146) (L146–153)
- **Decoradores:** `@Post(':id/pay')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** "Marcar como pagada" — see `MarkPurchaseAsPaidUseCase`'s own doc comment for why this is operational, not admin-gated.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.markPurchaseAsPaidUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesController.findAll`

- **Firma:** `findAll(query: ListPurchasesQueryDto, user: RequestUser): Promise<PaginatedPurchasesResponseDto>` — [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L155) (L155–165)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listPurchasesUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesController.importTemplate`

- **Firma:** `importTemplate(res: Response): Promise<void>` — [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L168) (L168–179)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Get('import/template')`
- **Propósito / descripción:** Downloads the blank Excel template for "Cargar stock inicial" — declared before `GET /:id/pdf`/`:id` for the same route-ordering reason as the import route above.
- **Origen de parámetros:** `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `buildPurchaseImportTemplate`, `res.set`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesController.dailyStats`

- **Firma:** `dailyStats(): Promise<PurchasesDailyStatsResponseDto>` — [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L182) (L182–185)
- **Decoradores:** `@Get('daily-stats')`
- **Propósito / descripción:** Backs "Compras del mes" en Gráficas → Indicadores de Compras — must be declared before `:id`. Open to any authenticated account.
- **Dependencias (llamadas en su cuerpo):** `this.getPurchasesDailyStatsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesController.weeklyStats`

- **Firma:** `weeklyStats(): Promise<PurchasesWeeklyStatsResponseDto>` — [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L188) (L188–191)
- **Decoradores:** `@Get('weekly-stats')`
- **Propósito / descripción:** Backs "Compras por semana" en Gráficas → Indicadores de Compras.
- **Dependencias (llamadas en su cuerpo):** `this.getPurchasesWeeklyStatsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesController.yearlyStats`

- **Firma:** `yearlyStats(): Promise<PurchasesYearlyStatsResponseDto>` — [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L194) (L194–197)
- **Decoradores:** `@Get('yearly-stats')`
- **Propósito / descripción:** Backs "Compras por mes" (anual) en Gráficas → Indicadores de Compras.
- **Dependencias (llamadas en su cuerpo):** `this.getPurchasesYearlyStatsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesController.getPdf`

- **Firma:** `getPdf(id: string, user: RequestUser, res: Response): Promise<void>` — [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L205) (L205–221)
- **Decoradores:** `@Get(':id/pdf')`
- **Propósito / descripción:** Reconstructs the purchase's invoice PDF purely from already-persisted data — never re-runs `confirm_purchase`. Declared before `:id` so it isn't swallowed by that route's `ParseUUIDPipe` matching on `id`, matching Sales' own route-ordering discipline.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.getPurchasePdfUseCase.execute`, `ADMIN_ROLES.includes`, `res.set`, `id.slice`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesController.findOne`

- **Firma:** `findOne(id: string, user: RequestUser): Promise<PurchaseResponseDto>` — [purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/controllers/purchases.controller.ts#L223) (L223–232)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getPurchaseByIdUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-create-purchase-request-dto-ts"></a>

### create-purchase.request.dto.ts

- **Ruta:** [create-purchase.request.dto.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/dtos/create-purchase.request.dto.ts) (`comercial-jhoel-api/src/modules/purchases/presentation/dtos/create-purchase.request.dto.ts`, 71 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** DTO de entrada: declara `CreatePurchaseItemRequestDto`, `CreatePurchaseRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

#### Clase `CreatePurchaseItemRequestDto` (L18–38)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CreatePurchaseRequestDto` (L40–70)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-import-purchase-result-response-dto-ts"></a>

### import-purchase-result.response.dto.ts

- **Ruta:** [import-purchase-result.response.dto.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/dtos/import-purchase-result.response.dto.ts) (`comercial-jhoel-api/src/modules/purchases/presentation/dtos/import-purchase-result.response.dto.ts`, 16 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** DTO de respuesta: declara `ImportPurchaseSkippedRowDto`, `ImportPurchaseResultResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

#### Clase `ImportPurchaseSkippedRowDto` (L1–5)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ImportPurchaseResultResponseDto` (L7–15)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-list-purchases-query-dto-ts"></a>

### list-purchases.query.dto.ts

- **Ruta:** [list-purchases.query.dto.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/dtos/list-purchases.query.dto.ts) (`comercial-jhoel-api/src/modules/purchases/presentation/dtos/list-purchases.query.dto.ts`, 67 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** DTO de consulta: declara `ListPurchasesQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS`, `STATUS_FILTERS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

#### Clase `ListPurchasesQueryDto` (L23–66)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-purchase-response-dto-ts"></a>

### purchase.response.dto.ts

- **Ruta:** [purchase.response.dto.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/dtos/purchase.response.dto.ts) (`comercial-jhoel-api/src/modules/purchases/presentation/dtos/purchase.response.dto.ts`, 62 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** DTO de respuesta: declara `PurchaseItemResponseDto`, `PurchaseResponseDto`, `PurchaseSummaryResponseDto`, `PaginatedPurchasesResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

#### Clase `PurchaseItemResponseDto` (L1–11)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PurchaseResponseDto` (L13–35)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PurchaseSummaryResponseDto` (L37–54)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedPurchasesResponseDto` (L56–61)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-purchases-daily-stats-response-dto-ts"></a>

### purchases-daily-stats.response.dto.ts

- **Ruta:** [purchases-daily-stats.response.dto.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/dtos/purchases-daily-stats.response.dto.ts) (`comercial-jhoel-api/src/modules/purchases/presentation/dtos/purchases-daily-stats.response.dto.ts`, 10 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** DTO de respuesta: declara `PurchasesDailyStatDto`, `PurchasesDailyStatsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

#### Clase `PurchasesDailyStatDto` (L1–4)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PurchasesDailyStatsResponseDto` (L6–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-purchases-weekly-stats-response-dto-ts"></a>

### purchases-weekly-stats.response.dto.ts

- **Ruta:** [purchases-weekly-stats.response.dto.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/dtos/purchases-weekly-stats.response.dto.ts) (`comercial-jhoel-api/src/modules/purchases/presentation/dtos/purchases-weekly-stats.response.dto.ts`, 13 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** DTO de respuesta: declara `PurchasesWeeklyStatDto`, `PurchasesWeeklyStatsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

#### Clase `PurchasesWeeklyStatDto` (L1–7)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PurchasesWeeklyStatsResponseDto` (L9–12)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-purchases-yearly-stats-response-dto-ts"></a>

### purchases-yearly-stats.response.dto.ts

- **Ruta:** [purchases-yearly-stats.response.dto.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/dtos/purchases-yearly-stats.response.dto.ts) (`comercial-jhoel-api/src/modules/purchases/presentation/dtos/purchases-yearly-stats.response.dto.ts`, 11 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** DTO de respuesta: declara `PurchasesMonthlyStatDto`, `PurchasesYearlyStatsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

#### Clase `PurchasesMonthlyStatDto` (L1–5)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PurchasesYearlyStatsResponseDto` (L7–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-purchases-presentation-dtos-void-purchase-request-dto-ts"></a>

### void-purchase.request.dto.ts

- **Ruta:** [void-purchase.request.dto.ts](../../../../comercial-jhoel-api/src/modules/purchases/presentation/dtos/void-purchase.request.dto.ts) (`comercial-jhoel-api/src/modules/purchases/presentation/dtos/void-purchase.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Same mandatory-reason shape as every other void request DTO in this codebase (`VoidRechargePurchaseRequestDto`, `VoidCashBoxMovementRequestDto`) — kept as this module's own copy rather than a cross-module import.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts)

#### Clase `VoidPurchaseRequestDto` (L4–10)

- **Propósito:** Same mandatory-reason shape as every other void request DTO in this codebase (`VoidRechargePurchaseRequestDto`, `VoidCashBoxMovementRequestDto`) — kept as this module's own copy rather than a cross-module import.
<a id="f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts"></a>

### purchases.module.ts

- **Ruta:** [purchases.module.ts](../../../../comercial-jhoel-api/src/modules/purchases/purchases.module.ts) (`comercial-jhoel-api/src/modules/purchases/purchases.module.ts`, 53 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `purchases`
- **Responsabilidad:** Módulo: declara `PurchasesModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchase.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-orm-entity-ts), [purchase-detail.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-detail-orm-entity-ts), [typeorm-purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-typeorm-purchase-repository-ts), [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts), [create-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-create-purchase-use-case-ts), [list-purchases.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-list-purchases-use-case-ts), [get-purchase-by-id.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-by-id-use-case-ts), [mark-purchase-as-paid.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-mark-purchase-as-paid-use-case-ts), [get-purchase-pdf.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-pdf-use-case-ts), [void-purchase.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-void-purchase-use-case-ts), [import-purchase-from-excel.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts), [get-purchases-daily-stats.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-daily-stats-use-case-ts), [get-purchases-weekly-stats.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-weekly-stats-use-case-ts), [get-purchases-yearly-stats.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchases-yearly-stats-use-case-ts), [purchases.controller.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-presentation-controllers-purchases-controller-ts) y 4 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [alerts.module.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `PurchasesModule` (L23–52)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([PurchaseOrmEntity, PurchaseDetailOrmEntity]), SuppliersModule, CompanySettingsModule, // Both needed only by 'Impo`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
