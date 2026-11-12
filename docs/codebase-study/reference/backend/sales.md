# Módulo backend `sales`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/sales` | [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L85) `SalesController.create` | [CreateSaleUseCase](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-create-sale-use-case-ts) | `SaleRepository`.confirmSale → `confirm_sale`<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) | `SalesService.createSale` |
| `GET /api/sales` | [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L100) `SalesController.findAll` | [ListSalesUseCase](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-list-sales-use-case-ts) | `SaleRepository`.findAll | UseGuards(JwtAuthGuard) | `SalesService.getSales` |
| `POST /api/sales/:id/void` | [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L119) `SalesController.voidSale` | [VoidSaleUseCase](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-void-sale-use-case-ts) | `SaleRepository`.findById/voidSale → `void_sale` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `SalesService.voidSale` |
| `POST /api/sales/items` | [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L136) `SalesController.adjustItem` | [AdjustSaleItemUseCase](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-adjust-sale-item-use-case-ts) | `SaleRepository`.adjustItem → `adjust_sale_item` | UseGuards(JwtAuthGuard) | `SalesService.adjustSaleItem` |
| `GET /api/sales/current` | [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L145) `SalesController.getCurrent` | [GetOpenSalesUseCase](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-open-sales-use-case-ts) | `SaleRepository`.findOpenSalesByUserId | UseGuards(JwtAuthGuard) | `SalesService.getCurrentSales` |
| `PATCH /api/sales/current/pricing` | [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L153) `SalesController.configurePricing` | [ConfigureSalePricingUseCase](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-ts) | `SaleRepository`.configureOpenSale → `configure_open_sale`<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) | `SalesService.configurePricing` |
| `POST /api/sales/confirm` | [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L167) `SalesController.confirm` | [ConfirmOpenSaleUseCase](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-confirm-open-sale-use-case-ts) | `SaleRepository`.confirmOpenSale → `confirm_open_sale` | UseGuards(JwtAuthGuard) | `SalesService.confirmSale` |
| `DELETE /api/sales/current` | [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L180) `SalesController.cancelCurrent` | [CancelOpenSaleUseCase](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-cancel-open-sale-use-case-ts) | `SaleRepository`.cancelOpenSale → `cancel_open_sale` | UseGuards(JwtAuthGuard) | `SalesService.cancelSale` |
| `GET /api/sales/daily-stats` | [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L190) `SalesController.dailyStats` | [GetSalesDailyStatsUseCase](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-daily-stats-use-case-ts) | `SaleRepository`.getDailySalesTotals | UseGuards(JwtAuthGuard) | `SalesService.getDailyStats` |
| `GET /api/sales/weekly-stats` | [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L196) `SalesController.weeklyStats` | [GetSalesWeeklyStatsUseCase](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-weekly-stats-use-case-ts) | `SaleRepository`.getDailySalesTotals | UseGuards(JwtAuthGuard) | `SalesService.getWeeklyStats` |
| `GET /api/sales/yearly-stats` | [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L202) `SalesController.yearlyStats` | [GetSalesYearlyStatsUseCase](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-yearly-stats-use-case-ts) | `SaleRepository`.getMonthlySalesTotals | UseGuards(JwtAuthGuard) | `SalesService.getYearlyStats` |
| `GET /api/sales/:id/pdf` | [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L213) `SalesController.getPdf` | [GetSalePdfUseCase](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-pdf-use-case-ts) | `SaleRepository`.findById<br>`CompanySettingsRepository`.get | UseGuards(JwtAuthGuard) | `SalesService.exportSalePdf` |
| `GET /api/sales/:id` | [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L231) `SalesController.findOne` | [GetSaleByIdUseCase](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-by-id-use-case-ts) | `SaleRepository`.findById | UseGuards(JwtAuthGuard) | `SalesService.getSaleById` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [sale-output.ts](#f-comercial-jhoel-api-src-modules-sales-application-dtos-sale-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toSaleOutput`, `toSaleSummaryOutput`, `SaleItemOutput`, `SaleOutput`, `SaleSummaryOutput` (sin comentario de documentación en el código). | 1 internas | 8 | Media (8 consumidores) |
| [adjust-sale-item.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-adjust-sale-item-use-case-ts) | .ts | Caso de uso | Aplicación | Real-time counterpart to `CreateSaleUseCase` — called once per cart action (add, +/-, direct edit, remove) instead of once at the end, so `products.stock` reflects the receipt being built immediately. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [cancel-open-sale.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-cancel-open-sale-use-case-ts) | .ts | Caso de uso | Aplicación | Discards the caller's in-progress receipt — every reserved line's quantity is restored to stock. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [configure-sale-pricing.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `buildClient`, `buildSale` (sin comentario de documentación en el código). | 6 internas | 0 | Soporte (pruebas) |
| [configure-sale-pricing.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-ts) | .ts | Caso de uso | Aplicación | Sets/updates the caller's in-progress receipt's client and price list — called once, at the start of a sale (before or while the cart is still empty). | 5 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [confirm-open-sale.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-confirm-open-sale-use-case-ts) | .ts | Caso de uso | Aplicación | Backs "Guardar venta" once stock is already reserved incrementally (`AdjustSaleItemUseCase`) — this only flips the receipt from OPEN to CONFIRMED and stamps `saleDate`. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [create-sale.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-create-sale-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateSaleUseCase`, `CreateSaleItemInput`, `CreateSaleInput` (sin comentario de documentación en el código). | 7 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-open-sales.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-open-sales-use-case-ts) | .ts | Caso de uso | Aplicación | Backs `GET /sales/current` — lets the frontend restore every in-progress receipt (one per open tab) after a page reload/navigation. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-sale-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetSaleByIdUseCase`, `GetSaleByIdInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-sale-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | Reconstructs the sale's PDF purely from already-persisted data — never re-runs `confirm_open_sale`/`confirm_sale` or touches inventory. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-sales-daily-stats.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-daily-stats-use-case-ts) | .ts | Caso de uso | Aplicación | "Ventas del mes" — Gráficas → Indicadores de Ventas. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-sales-weekly-stats.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-weekly-stats-use-case-ts) | .ts | Caso de uso | Aplicación | "Ventas por semana" — buckets de 7 días fijos desde el día 1 del mes actual (día 1-7 = Semana 1, 8-14 = Semana 2, ...), nunca semana ISO — mismo criterio exacto que `GetBankDepositWeeklyStatsUseCase` ya estableció, para que un bucket nunca mezcle días de otro mes. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-sales-yearly-stats.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-yearly-stats-use-case-ts) | .ts | Caso de uso | Aplicación | "Ventas por mes" — acumulativo, enero hasta el mes actual del año en curso, a diferencia de la gráfica diaria/semanal de este mismo módulo. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-sales.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-list-sales-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListSalesUseCase`, `ListSalesInput`, `ListSalesOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [void-sale.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-application-use-cases-void-sale-use-case-ts) | .ts | Caso de uso | Aplicación | "Anular venta" — the only correction path for a mistaken CONFIRMED sale (mirrors `VoidPurchaseUseCase`: no "editar venta" exists — the fix is always anular + registrar una venta nueva y correcta). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [sale-detail.entity.ts](#f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-detail-entity-ts) | .ts | Entidad de dominio | Dominio | A frozen line item — `unitPrice`/`total` are the values at the moment of sale, never recomputed from the live product. | 0 internas | 2 | Baja (2 consumidores) |
| [sale.entity.ts](#f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-entity-ts) | .ts | Entidad de dominio | Dominio | Entidad de dominio: declara `Sale`, `SaleProps`, `SaleStatus`, `PriceListType` (sin comentario de documentación en el código). | 1 internas | 8 | Media (8 consumidores) |
| [insufficient-stock.error.ts](#f-comercial-jhoel-api-src-modules-sales-domain-errors-insufficient-stock-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InsufficientStockError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-client.error.ts](#f-comercial-jhoel-api-src-modules-sales-domain-errors-invalid-client-error-ts) | .ts | Errores de dominio | Dominio | The referenced client doesn't exist or is deactivated — mirrors InvalidCategoryError/InvalidBusinessError. | 1 internas | 3 | Media (3 consumidores) |
| [invalid-sale-quantity.error.ts](#f-comercial-jhoel-api-src-modules-sales-domain-errors-invalid-sale-quantity-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidSaleQuantityError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [no-open-sale.error.ts](#f-comercial-jhoel-api-src-modules-sales-domain-errors-no-open-sale-error-ts) | .ts | Errores de dominio | Dominio | Confirming/cancelling/fetching a caller's in-progress receipt when they don't have one open. | 1 internas | 2 | Baja (2 consumidores) |
| [price-list-locked.error.ts](#f-comercial-jhoel-api-src-modules-sales-domain-errors-price-list-locked-error-ts) | .ts | Errores de dominio | Dominio | Raised by `configure_open_sale()` when the receipt already has line items priced under a different price list — changing it now would leave those lines' prices inconsistent with the new list. | 1 internas | 1 | Baja (1 consumidores) |
| [sale-access-denied.error.ts](#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-access-denied-error-ts) | .ts | Errores de dominio | Dominio | A USER account trying to view a sale that isn't theirs — ADMIN/SUPER_ADMIN can view any sale. | 1 internas | 2 | Baja (2 consumidores) |
| [sale-already-voided.error.ts](#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-already-voided-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SaleAlreadyVoidedError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [sale-empty.error.ts](#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-empty-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SaleEmptyError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [sale-not-confirmed.error.ts](#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-not-confirmed-error-ts) | .ts | Errores de dominio | Dominio | A borrador (`OPEN`) sale can't be anulada directly — it has its own correction mechanism (`cancel_open_sale`, which discards it entirely since it was never a real transaction). | 1 internas | 1 | Baja (1 consumidores) |
| [sale-not-found.error.ts](#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SaleNotFoundError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [sale-product-inactive.error.ts](#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-product-inactive-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SaleProductInactiveError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [sale-product-not-found.error.ts](#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-product-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SaleProductNotFoundError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [sale-void-reason-required.error.ts](#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-void-reason-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SaleVoidReasonRequiredError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [sale.repository.ts](#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `SaleItemData`, `ConfirmSaleData`, `FindSalesOptions`, `PaginatedResult`, `SaleDailyAmount` (sin comentario de documentación en el código). | 1 internas | 18 | Alta (18 consumidores) |
| [sale-pdf.builder.ts](#f-comercial-jhoel-api-src-modules-sales-infrastructure-pdf-sale-pdf-builder-ts) | .ts | Builder | Infraestructura | Reconstructs a Venta receipt purely from already-persisted data (`SaleOutput` + the company settings singleton) — never re-runs `confirm_open_sale` or touches inventory. | 1 internas; ext.: pdfkit | 1 | Baja (1 consumidores) |
| [sale-detail.orm-entity.ts](#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-detail-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `SaleDetailOrmEntity` (sin comentario de documentación en el código). | 5 internas; ext.: typeorm | 6 | Media (6 consumidores) |
| [sale.mapper.ts](#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `SaleMapper` (sin comentario de documentación en el código). | 3 internas | 1 | Baja (1 consumidores) |
| [sale.orm-entity.ts](#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `SaleOrmEntity` (sin comentario de documentación en el código). | 4 internas; ext.: typeorm | 10 | Alta (10 consumidores) |
| [typeorm-sale.repository.ts](#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmSaleRepository`, `SORT_COLUMN` (sin comentario de documentación en el código). | 15 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [sales.controller.ts](#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts) | .ts | Controlador | Presentación | No `@Roles(...)` restriction on this controller — registering a sale is an operational action for whoever runs the register (typically a USER-role cashier), not an admin-only one. | 28 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [adjust-sale-item.request.dto.ts](#f-comercial-jhoel-api-src-modules-sales-presentation-dtos-adjust-sale-item-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `AdjustSaleItemRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [cancel-open-sale.query.dto.ts](#f-comercial-jhoel-api-src-modules-sales-presentation-dtos-cancel-open-sale-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `CancelOpenSaleQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [configure-sale-pricing.request.dto.ts](#f-comercial-jhoel-api-src-modules-sales-presentation-dtos-configure-sale-pricing-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `ConfigureSalePricingRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [confirm-open-sale.request.dto.ts](#f-comercial-jhoel-api-src-modules-sales-presentation-dtos-confirm-open-sale-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `ConfirmOpenSaleRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [create-sale.request.dto.ts](#f-comercial-jhoel-api-src-modules-sales-presentation-dtos-create-sale-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateSaleItemRequestDto`, `CreateSaleRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [list-sales.query.dto.ts](#f-comercial-jhoel-api-src-modules-sales-presentation-dtos-list-sales-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListSalesQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS`, `STATUS_FILTERS` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [sale.response.dto.ts](#f-comercial-jhoel-api-src-modules-sales-presentation-dtos-sale-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `SaleItemResponseDto`, `SaleResponseDto`, `SaleSummaryResponseDto`, `PaginatedSalesResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [sales-daily-stats.response.dto.ts](#f-comercial-jhoel-api-src-modules-sales-presentation-dtos-sales-daily-stats-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `SalesDailyStatDto`, `SalesDailyStatsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [sales-weekly-stats.response.dto.ts](#f-comercial-jhoel-api-src-modules-sales-presentation-dtos-sales-weekly-stats-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `SalesWeeklyStatDto`, `SalesWeeklyStatsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [sales-yearly-stats.response.dto.ts](#f-comercial-jhoel-api-src-modules-sales-presentation-dtos-sales-yearly-stats-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `SalesMonthlyStatDto`, `SalesYearlyStatsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [void-sale.request.dto.ts](#f-comercial-jhoel-api-src-modules-sales-presentation-dtos-void-sale-request-dto-ts) | .ts | DTO de entrada | Presentación | Same mandatory-reason shape as every other void request DTO in this codebase (`VoidPurchaseRequestDto`, `VoidRechargePurchaseRequestDto`). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [sales.module.ts](#f-comercial-jhoel-api-src-modules-sales-sales-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `SalesModule` (sin comentario de documentación en el código). | 20 internas; ext.: @nestjs/common, @nestjs/typeorm | 2 | Baja (2 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-sales-application-dtos-sale-output-ts"></a>

### sale-output.ts

- **Ruta:** [sale-output.ts](../../../../comercial-jhoel-api/src/modules/sales/application/dtos/sale-output.ts) (`comercial-jhoel-api/src/modules/sales/application/dtos/sale-output.ts`, 109 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** DTO de salida (aplicación): declara `toSaleOutput`, `toSaleSummaryOutput`, `SaleItemOutput`, `SaleOutput`, `SaleSummaryOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sale.entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-entity-ts)
- **Consumidores:** [adjust-sale-item.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-adjust-sale-item-use-case-ts), [configure-sale-pricing.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-ts), [confirm-open-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-confirm-open-sale-use-case-ts), [create-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-create-sale-use-case-ts), [get-open-sales.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-open-sales-use-case-ts), [get-sale-by-id.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-by-id-use-case-ts), [list-sales.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-list-sales-use-case-ts), [void-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-void-sale-use-case-ts)

**Interfaces, tipos y enums:**

- `interface SaleItemOutput` (L7): sin documentación — miembros: `id`, `productId`, `productName`, `sku`, `quantity`, `unitPrice`, `total`, `presentationName`
- `interface SaleOutput` (L19): Full shape — used for `GET /sales/:id` and the response of `POST /sales`. — miembros: `id`, `userId`, `username`, `saleDate`, `total`, `status`, `clientId`, `clientName`, `priceList`, `draftKey`, `items`, `createdAt`, `updatedAt`, `invoiceNumber`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
- `interface SaleSummaryOutput` (L42): Lighter shape for `GET /sales` — no line items, so listing sales never needs to load them. — miembros: `id`, `userId`, `username`, `saleDate`, `total`, `clientId`, `clientName`, `priceList`, `createdAt`, `invoiceNumber`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
#### Función `toSaleOutput` (L59–89)

- **Tipo:** función exportada
- **Firma:** `toSaleOutput(sale: Sale): SaleOutput` — [sale-output.ts](../../../../comercial-jhoel-api/src/modules/sales/application/dtos/sale-output.ts#L59)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `sale.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [adjust-sale-item.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-adjust-sale-item-use-case-ts), [configure-sale-pricing.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-ts), [confirm-open-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-confirm-open-sale-use-case-ts), [create-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-create-sale-use-case-ts), [get-sale-by-id.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-by-id-use-case-ts), [void-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-void-sale-use-case-ts)

#### Función `toSaleSummaryOutput` (L91–108)

- **Tipo:** función exportada
- **Firma:** `toSaleSummaryOutput(sale: Sale): SaleSummaryOutput` — [sale-output.ts](../../../../comercial-jhoel-api/src/modules/sales/application/dtos/sale-output.ts#L91)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-adjust-sale-item-use-case-ts"></a>

### adjust-sale-item.use-case.ts

- **Ruta:** [adjust-sale-item.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/adjust-sale-item.use-case.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/adjust-sale-item.use-case.ts`, 48 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Real-time counterpart to `CreateSaleUseCase` — called once per cart action (add, +/-, direct edit, remove) instead of once at the end, so `products.stock` reflects the receipt being built immediately.
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [invalid-sale-quantity.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-invalid-sale-quantity-error-ts), [sale-output.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-dtos-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

**Interfaces, tipos y enums:**

- `interface AdjustSaleItemInput` (L7): sin documentación — miembros: `userId`, `productId`, `presentationId`, `quantityDelta`, `draftKey`

#### Clase `AdjustSaleItemUseCase` (L26–47)

- **Decoradores:** `@Injectable()`
- **Propósito:** Real-time counterpart to `CreateSaleUseCase` — called once per cart action (add, +/-, direct edit, remove) instead of once at the end, so `products.stock` reflects the receipt being built immediately. All the actual validation (product exists/active, enough stock, row locking) happens inside `adjust_sale_item()` in Postgres; this use case only rejects the one thing that's cheap and meaningless to send to the DB at all — a delta of exactly 0.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 32–46 | `input: AdjustSaleItemInput` | `Promise<SaleOutput>` |

##### `AdjustSaleItemUseCase.execute`

- **Firma:** `execute(input: AdjustSaleItemInput): Promise<SaleOutput>` — [adjust-sale-item.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/adjust-sale-item.use-case.ts#L32) (L32–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Number.isInteger`, `new InvalidSaleQuantityError`, `this.saleRepository.adjustItem`, `toSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidSaleQuantityError(input.productId)`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-cancel-open-sale-use-case-ts"></a>

### cancel-open-sale.use-case.ts

- **Ruta:** [cancel-open-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/cancel-open-sale.use-case.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/cancel-open-sale.use-case.ts`, 23 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Discards the caller's in-progress receipt — every reserved line's quantity is restored to stock.
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [no-open-sale.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-no-open-sale-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

#### Clase `CancelOpenSaleUseCase` (L7–22)

- **Decoradores:** `@Injectable()`
- **Propósito:** Discards the caller's in-progress receipt — every reserved line's quantity is restored to stock.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 13–21 | `userId: string`, `draftKey: string` | `Promise<void>` |

##### `CancelOpenSaleUseCase.execute`

- **Firma:** `execute(userId: string, draftKey: string): Promise<void>` — [cancel-open-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/cancel-open-sale.use-case.ts#L13) (L13–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleRepository.cancelOpenSale`, `new NoOpenSaleError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NoOpenSaleError()`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-spec-ts"></a>

### configure-sale-pricing.use-case.spec.ts

- **Ruta:** [configure-sale-pricing.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/configure-sale-pricing.use-case.spec.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/configure-sale-pricing.use-case.spec.ts`, 116 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Prueba unitaria: declara `buildClient`, `buildSale` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [configure-sale-pricing.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-ts), [invalid-client.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-invalid-client-error-ts), [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [client.entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-entities-client-entity-ts), [sale.entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-entity-ts)
- **Consumidores:** —
#### Función `buildClient` (L8–20)

- **Tipo:** función local del archivo
- **Firma:** `buildClient(isActive?): Client` — [configure-sale-pricing.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/configure-sale-pricing.use-case.spec.ts#L8)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Client.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildSale` (L22–38)

- **Tipo:** función local del archivo
- **Firma:** `buildSale(): Sale` — [configure-sale-pricing.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/configure-sale-pricing.use-case.spec.ts#L22)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Sale.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-ts"></a>

### configure-sale-pricing.use-case.ts

- **Ruta:** [configure-sale-pricing.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/configure-sale-pricing.use-case.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/configure-sale-pricing.use-case.ts`, 52 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Sets/updates the caller's in-progress receipt's client and price list — called once, at the start of a sale (before or while the cart is still empty).
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [sale.entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-entity-ts), [invalid-client.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-invalid-client-error-ts), [sale-output.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-dtos-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [configure-sale-pricing.use-case.spec.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-spec-ts), [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

**Interfaces, tipos y enums:**

- `interface ConfigureSalePricingInput` (L10): sin documentación — miembros: `userId`, `clientId`, `priceList`, `draftKey`

#### Clase `ConfigureSalePricingUseCase` (L26–51)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sets/updates the caller's in-progress receipt's client and price list — called once, at the start of a sale (before or while the cart is still empty). `clientId` is validated here (exists + active) the same way `CreateProductUseCase` validates `categoryId`/`businessId`, so an invalid client never reaches the SQL layer; the price-list lock (once the receipt has line items) is enforced inside `configure_open_sale()` itself, since that check has to run atomically against the same row this function locks.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 34–50 | `input: ConfigureSalePricingInput` | `Promise<SaleOutput>` |

##### `ConfigureSalePricingUseCase.execute`

- **Firma:** `execute(input: ConfigureSalePricingInput): Promise<SaleOutput>` — [configure-sale-pricing.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/configure-sale-pricing.use-case.ts#L34) (L34–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new InvalidClientError`, `this.saleRepository.configureOpenSale`, `toSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidClientError()`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-confirm-open-sale-use-case-ts"></a>

### confirm-open-sale.use-case.ts

- **Ruta:** [confirm-open-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/confirm-open-sale.use-case.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/confirm-open-sale.use-case.ts`, 31 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Backs "Guardar venta" once stock is already reserved incrementally (`AdjustSaleItemUseCase`) — this only flips the receipt from OPEN to CONFIRMED and stamps `saleDate`.
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [sale-output.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-dtos-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

#### Clase `ConfirmOpenSaleUseCase` (L12–30)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs "Guardar venta" once stock is already reserved incrementally (`AdjustSaleItemUseCase`) — this only flips the receipt from OPEN to CONFIRMED and stamps `saleDate`. No stock changes happen here; that already happened on every add/adjust call.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 18–29 | `userId: string`, `draftKey: string`, `invoiceNumber?: string` | `Promise<SaleOutput>` |

##### `ConfirmOpenSaleUseCase.execute`

- **Firma:** `execute(userId: string, draftKey: string, invoiceNumber?: string): Promise<SaleOutput>` — [confirm-open-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/confirm-open-sale.use-case.ts#L18) (L18–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleRepository.confirmOpenSale`, `invoiceNumber?.trim`, `toSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-create-sale-use-case-ts"></a>

### create-sale.use-case.ts

- **Ruta:** [create-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/create-sale.use-case.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/create-sale.use-case.ts`, 92 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Caso de uso: declara `CreateSaleUseCase`, `CreateSaleItemInput`, `CreateSaleInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [sale.entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-entity-ts), [sale-empty.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-empty-error-ts), [invalid-sale-quantity.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-invalid-sale-quantity-error-ts), [invalid-client.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-invalid-client-error-ts), [sale-output.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-dtos-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateSaleItemInput` (L12): sin documentación — miembros: `productId`, `presentationId`, `quantity`
- `interface CreateSaleInput` (L19): sin documentación — miembros: `userId`, `items`, `clientId`, `priceList`, `invoiceNumber`

#### Clase `CreateSaleUseCase` (L28–91)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 36–90 | `input: CreateSaleInput` | `Promise<SaleOutput>` |

##### `CreateSaleUseCase.execute`

- **Firma:** `execute(input: CreateSaleInput): Promise<SaleOutput>` — [create-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/create-sale.use-case.ts#L36) (L36–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new SaleEmptyError`, `this.clientRepository.findById`, `new InvalidClientError`, `Number.isInteger`, `new InvalidSaleQuantityError`, `new Map`, `mergedByLine.get`, `mergedByLine.set`, `[...mergedByLine.values()].sort`, `mergedByLine.values`, `a.productId.localeCompare`, `this.saleRepository.confirmSale`, `input.invoiceNumber?.trim`, `toSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SaleEmptyError()`, `new InvalidClientError()`, `new InvalidSaleQuantityError(item.productId)`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-open-sales-use-case-ts"></a>

### get-open-sales.use-case.ts

- **Ruta:** [get-open-sales.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-open-sales.use-case.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/get-open-sales.use-case.ts`, 18 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Backs `GET /sales/current` — lets the frontend restore every in-progress receipt (one per open tab) after a page reload/navigation.
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [sale-output.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-dtos-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

#### Clase `GetOpenSalesUseCase` (L7–17)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs `GET /sales/current` — lets the frontend restore every in-progress receipt (one per open tab) after a page reload/navigation. An empty array is a normal, valid state (no open tabs), never an error.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 13–16 | `userId: string` | `Promise<SaleOutput[]>` |

##### `GetOpenSalesUseCase.execute`

- **Firma:** `execute(userId: string): Promise<SaleOutput[]>` — [get-open-sales.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-open-sales.use-case.ts#L13) (L13–16)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleRepository.findOpenSalesByUserId`, `sales.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-by-id-use-case-ts"></a>

### get-sale-by-id.use-case.ts

- **Ruta:** [get-sale-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sale-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/get-sale-by-id.use-case.ts`, 32 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Caso de uso: declara `GetSaleByIdUseCase`, `GetSaleByIdInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [sale-not-found.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-not-found-error-ts), [sale-access-denied.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-access-denied-error-ts), [sale-output.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-dtos-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

**Interfaces, tipos y enums:**

- `interface GetSaleByIdInput` (L8): sin documentación — miembros: `currentUserId`, `isAdmin`

#### Clase `GetSaleByIdUseCase` (L13–31)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–30 | `id: string`, `input: GetSaleByIdInput` | `Promise<SaleOutput>` |

##### `GetSaleByIdUseCase.execute`

- **Firma:** `execute(id: string, input: GetSaleByIdInput): Promise<SaleOutput>` — [get-sale-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sale-by-id.use-case.ts#L19) (L19–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleRepository.findById`, `new SaleNotFoundError`, `new SaleAccessDeniedError`, `toSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SaleNotFoundError(id)`, `new SaleAccessDeniedError()`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-pdf-use-case-ts"></a>

### get-sale-pdf.use-case.ts

- **Ruta:** [get-sale-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sale-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/get-sale-pdf.use-case.ts`, 70 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Reconstructs the sale's PDF purely from already-persisted data — never re-runs `confirm_open_sale`/`confirm_sale` or touches inventory.
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [sale-not-found.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-not-found-error-ts), [sale-access-denied.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-access-denied-error-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [sale-pdf.builder.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-pdf-sale-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

**Interfaces, tipos y enums:**

- `interface GetSalePdfInput` (L10): sin documentación — miembros: `currentUserId`, `isAdmin`

#### Clase `GetSalePdfUseCase` (L23–69)

- **Decoradores:** `@Injectable()`
- **Propósito:** Reconstructs the sale's PDF purely from already-persisted data — never re-runs `confirm_open_sale`/`confirm_sale` or touches inventory. Same ownership rule as `GetSaleByIdUseCase` (a non-admin only gets their own sale's PDF); additionally rejects an `OPEN` draft the same way `GetSaleReportDetailUseCase` does — a PDF only makes sense for a completed sale.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`, `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 31–68 | `id: string`, `input: GetSalePdfInput` | `Promise<Buffer>` |

##### `GetSalePdfUseCase.execute`

- **Firma:** `execute(id: string, input: GetSalePdfInput): Promise<Buffer>` — [get-sale-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sale-pdf.use-case.ts#L31) (L31–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleRepository.findById`, `new SaleNotFoundError`, `new SaleAccessDeniedError`, `this.companySettingsRepository.get`, `buildSalePdf`, `sale.id.slice(0, 8).toUpperCase`, `sale.id.slice`, `sale.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SaleNotFoundError(id)`, `new SaleAccessDeniedError()`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-daily-stats-use-case-ts"></a>

### get-sales-daily-stats.use-case.ts

- **Ruta:** [get-sales-daily-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-daily-stats.use-case.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-daily-stats.use-case.ts`, 55 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** "Ventas del mes" — Gráficas → Indicadores de Ventas.
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

**Interfaces, tipos y enums:**

- `interface SalesDailyStatOutput` (L5): sin documentación — miembros: `date`, `amount`
- `interface SalesDailyStatsOutput` (L11): sin documentación — miembros: `month`, `days`

#### Clase `GetSalesDailyStatsUseCase` (L26–54)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Ventas del mes" — Gráficas → Indicadores de Ventas. Monto total vendido (`SUM(total)`), no cantidad de ventas — mismo criterio ya confirmado para el módulo de Transacciones, aplicado aquí a dinero en vez de conteo. Siempre el mes actual del servidor (`America/Guatemala`), nunca una fecha del navegador. Excluye ventas `OPEN` (borradores) y anuladas — `getDailySalesTotals` ya filtra `status = 'CONFIRMED' AND is_voided = false`.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 33–53 | — | `Promise<SalesDailyStatsOutput>` |

##### `GetSalesDailyStatsUseCase.execute`

- **Firma:** `execute(): Promise<SalesDailyStatsOutput>` — [get-sales-daily-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-daily-stats.use-case.ts#L33) (L33–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `now.getMonth`, `new Date(year, month + 1, 0).getDate`, `String(month + 1).padStart`, `String`, `this.saleRepository.getDailySalesTotals`, `new Map`, `rows.map`, `String(day).padStart`, `days.push`, `amountsByDate.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-weekly-stats-use-case-ts"></a>

### get-sales-weekly-stats.use-case.ts

- **Ruta:** [get-sales-weekly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-weekly-stats.use-case.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-weekly-stats.use-case.ts`, 73 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** "Ventas por semana" — buckets de 7 días fijos desde el día 1 del mes actual (día 1-7 = Semana 1, 8-14 = Semana 2, ...), nunca semana ISO — mismo criterio exacto que `GetBankDepositWeeklyStatsUseCase` ya estableció, para que un bucket nunca mezcle días de otro mes.
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

**Interfaces, tipos y enums:**

- `interface SalesWeeklyStatOutput` (L5): sin documentación — miembros: `weekNumber`, `label`, `startDate`, `endDate`, `amount`
- `interface SalesWeeklyStatsOutput` (L16): sin documentación — miembros: `month`, `weeks`

#### Clase `GetSalesWeeklyStatsUseCase` (L32–72)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Ventas por semana" — buckets de 7 días fijos desde el día 1 del mes actual (día 1-7 = Semana 1, 8-14 = Semana 2, ...), nunca semana ISO — mismo criterio exacto que `GetBankDepositWeeklyStatsUseCase` ya estableció, para que un bucket nunca mezcle días de otro mes. Reutiliza la misma consulta día-a-día que la gráfica diaria (`getDailySalesTotals`) y solo la reagrupa en memoria — ninguna consulta SQL nueva.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 39–71 | — | `Promise<SalesWeeklyStatsOutput>` |

##### `GetSalesWeeklyStatsUseCase.execute`

- **Firma:** `execute(): Promise<SalesWeeklyStatsOutput>` — [get-sales-weekly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-weekly-stats.use-case.ts#L39) (L39–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `now.getMonth`, `new Date(year, month + 1, 0).getDate`, `String(month + 1).padStart`, `String`, `this.saleRepository.getDailySalesTotals`, `new Map`, `rows.map`, `Math.min`, `String(day).padStart`, `amountsByDate.get`, `weeks.push`, `String(startDay).padStart`, `String(endDay).padStart`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-yearly-stats-use-case-ts"></a>

### get-sales-yearly-stats.use-case.ts

- **Ruta:** [get-sales-yearly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-yearly-stats.use-case.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-yearly-stats.use-case.ts`, 70 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** "Ventas por mes" — acumulativo, enero hasta el mes actual del año en curso, a diferencia de la gráfica diaria/semanal de este mismo módulo.
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

**Interfaces, tipos y enums:**

- `interface SalesMonthlyStatOutput` (L20): sin documentación — miembros: `month`, `label`, `amount`
- `interface SalesYearlyStatsOutput` (L27): sin documentación — miembros: `year`, `months`

#### Clase `GetSalesYearlyStatsUseCase` (L39–69)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Ventas por mes" — acumulativo, enero hasta el mes actual del año en curso, a diferencia de la gráfica diaria/semanal de este mismo módulo. Una sola consulta agregada (`getMonthlySalesTotals`), mismo patrón que `GetBankDepositYearlyStatsUseCase`.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 46–68 | — | `Promise<SalesYearlyStatsOutput>` |

##### `GetSalesYearlyStatsUseCase.execute`

- **Firma:** `execute(): Promise<SalesYearlyStatsOutput>` — [get-sales-yearly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-yearly-stats.use-case.ts#L46) (L46–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `now.getMonth`, `now.getDate`, `this.saleRepository.getMonthlySalesTotals`, `new Map`, `rows.map`, `String(m + 1).padStart`, `String`, `months.push`, `amountsByMonth.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-list-sales-use-case-ts"></a>

### list-sales.use-case.ts

- **Ruta:** [list-sales.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/list-sales.use-case.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/list-sales.use-case.ts`, 78 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Caso de uso: declara `ListSalesUseCase`, `ListSalesInput`, `ListSalesOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [sale-output.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-dtos-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

**Interfaces, tipos y enums:**

- `interface ListSalesInput` (L11): sin documentación — miembros: `currentUserId`, `isAdmin`, `userId`, `clientId`, `startDate`, `endDate`, `search`, `status`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface ListSalesOutput` (L28): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `ListSalesUseCase` (L39–77)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 45–76 | `input: ListSalesInput` | `Promise<ListSalesOutput>` |

##### `ListSalesUseCase.execute`

- **Firma:** `execute(input: ListSalesInput): Promise<ListSalesOutput>` — [list-sales.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/list-sales.use-case.ts#L45) (L45–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `this.saleRepository.findAll`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-application-use-cases-void-sale-use-case-ts"></a>

### void-sale.use-case.ts

- **Ruta:** [void-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/void-sale.use-case.ts) (`comercial-jhoel-api/src/modules/sales/application/use-cases/void-sale.use-case.ts`, 57 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** "Anular venta" — the only correction path for a mistaken CONFIRMED sale (mirrors `VoidPurchaseUseCase`: no "editar venta" exists — the fix is always anular + registrar una venta nueva y correcta).
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [sale-not-found.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-not-found-error-ts), [sale-already-voided.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-already-voided-error-ts), [sale-void-reason-required.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-void-reason-required-error-ts), [sale-output.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-dtos-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

**Interfaces, tipos y enums:**

- `interface VoidSaleInput` (L9): sin documentación — miembros: `id`, `voidedBy`, `reason`

#### Clase `VoidSaleUseCase` (L29–56)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Anular venta" — the only correction path for a mistaken CONFIRMED sale (mirrors `VoidPurchaseUseCase`: no "editar venta" exists — the fix is always anular + registrar una venta nueva y correcta). Never an edit, never a physical delete: the original row stays exactly as it was, marked `ANULADA` forever. The real guard order (reason → not-found → not-confirmed → already- voided) runs atomically inside `void_sale`'s own row lock — this use case only pre-checks existence/already-voided for a clean error message and translates the result; a TypeScript-side pre-check would only add a TOCTOU gap, not close one, same reasoning as every other stored-function- backed void in this codebase.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 35–55 | `input: VoidSaleInput` | `Promise<SaleOutput>` |

##### `VoidSaleUseCase.execute`

- **Firma:** `execute(input: VoidSaleInput): Promise<SaleOutput>` — [void-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/void-sale.use-case.ts#L35) (L35–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.reason?.trim`, `new SaleVoidReasonRequiredError`, `this.saleRepository.findById`, `new SaleNotFoundError`, `new SaleAlreadyVoidedError`, `this.saleRepository.voidSale`, `toSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SaleVoidReasonRequiredError()`, `new SaleNotFoundError(input.id)`, `new SaleAlreadyVoidedError(input.id)`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-detail-entity-ts"></a>

### sale-detail.entity.ts

- **Ruta:** [sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale-detail.entity.ts) (`comercial-jhoel-api/src/modules/sales/domain/entities/sale-detail.entity.ts`, 53 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** A frozen line item — `unitPrice`/`total` are the values at the moment of sale, never recomputed from the live product.
- **Consumidores:** [sale.entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-entity-ts), [sale.mapper.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-mapper-ts)

**Interfaces, tipos y enums:**

- `interface SaleDetailProps` (L1): sin documentación — miembros: `id`, `productId`, `productName`, `sku`, `quantity`, `unitPrice`, `total`, `presentationName`

#### Clase `SaleDetail` (L14–52)

- **Propósito:** A frozen line item — `unitPrice`/`total` are the values at the moment of sale, never recomputed from the live product.
- **Dependencias inyectadas (constructor):** `props: SaleDetailProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 17–19 | `props: SaleDetailProps` | `SaleDetail` |
| `id` | getter public | 21–23 | — | `string` |
| `productId` | getter public | 25–27 | — | `string` |
| `productName` | getter public | 29–31 | — | `string` |
| `sku` | getter public | 33–35 | — | `string \| null` |
| `quantity` | getter public | 37–39 | — | `number` |
| `unitPrice` | getter public | 41–43 | — | `number` |
| `total` | getter public | 45–47 | — | `number` |
| `presentationName` | getter public | 49–51 | — | `string` |

##### `SaleDetail.create`

- **Firma:** `create(props: SaleDetailProps): SaleDetail` — [sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale-detail.entity.ts#L17) (L17–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new SaleDetail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sale.mapper.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-mapper-ts)

##### `SaleDetail.id`

- **Firma:** `id(): string` — [sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale-detail.entity.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SaleDetail.productId`

- **Firma:** `productId(): string` — [sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale-detail.entity.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SaleDetail.productName`

- **Firma:** `productName(): string` — [sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale-detail.entity.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SaleDetail.sku`

- **Firma:** `sku(): string \| null` — [sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale-detail.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SaleDetail.quantity`

- **Firma:** `quantity(): number` — [sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale-detail.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SaleDetail.unitPrice`

- **Firma:** `unitPrice(): number` — [sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale-detail.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SaleDetail.total`

- **Firma:** `total(): number` — [sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale-detail.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SaleDetail.presentationName`

- **Firma:** `presentationName(): string` — [sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale-detail.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-entity-ts"></a>

### sale.entity.ts

- **Ruta:** [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts) (`comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts`, 113 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Entidad de dominio: declara `Sale`, `SaleProps`, `SaleStatus`, `PriceListType` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sale-detail.entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-detail-entity-ts)
- **Consumidores:** [sales-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-sales-report-output-ts), [sale-output.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-dtos-sale-output-ts), [configure-sale-pricing.use-case.spec.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-spec-ts), [configure-sale-pricing.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-ts), [create-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-create-sale-use-case-ts), [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [sale.mapper.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-mapper-ts), [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

**Interfaces, tipos y enums:**

- `interface SaleProps` (L6): sin documentación — miembros: `id`, `userId`, `username`, `saleDate`, `total`, `status`, `clientId`, `clientName`, `priceList`, `draftKey`, `items`, `createdAt`, `updatedAt`, `invoiceNumber`, `isVoided`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`
- `type SaleStatus` (L3) = `'OPEN' \| 'CONFIRMED'`
- `type PriceListType` (L4) = `'PUBLIC' \| 'WHOLESALE'`

#### Clase `Sale` (L30–112)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: SaleProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 33–35 | `props: SaleProps` | `Sale` |
| `id` | getter public | 37–39 | — | `string` |
| `userId` | getter public | 41–43 | — | `string` |
| `username` | getter public | 45–47 | — | `string` |
| `saleDate` | getter public | 49–51 | — | `Date` |
| `total` | getter public | 53–55 | — | `number` |
| `status` | getter public | 57–59 | — | `SaleStatus` |
| `clientId` | getter public | 61–63 | — | `string \| null` |
| `clientName` | getter public | 65–67 | — | `string \| null` |
| `priceList` | getter public | 69–71 | — | `PriceListType` |
| `draftKey` | getter public | 73–75 | — | `string \| null` |
| `items` | getter public | 77–79 | — | `SaleDetail[]` |
| `createdAt` | getter public | 81–83 | — | `Date` |
| `updatedAt` | getter public | 85–87 | — | `Date` |
| `invoiceNumber` | getter public | 89–91 | — | `string \| null` |
| `isVoided` | getter public | 93–95 | — | `boolean` |
| `voidedAt` | getter public | 97–99 | — | `Date \| null` |
| `voidedBy` | getter public | 101–103 | — | `string \| null` |
| `voidedByUsername` | getter public | 105–107 | — | `string \| null` |
| `voidReason` | getter public | 109–111 | — | `string \| null` |

##### `Sale.create`

- **Firma:** `create(props: SaleProps): Sale` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Sale`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [configure-sale-pricing.use-case.spec.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-spec-ts), [sale.mapper.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-mapper-ts)

##### `Sale.id`

- **Firma:** `id(): string` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.userId`

- **Firma:** `userId(): string` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.username`

- **Firma:** `username(): string` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.saleDate`

- **Firma:** `saleDate(): Date` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.total`

- **Firma:** `total(): number` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.status`

- **Firma:** `status(): SaleStatus` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.clientId`

- **Firma:** `clientId(): string \| null` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.clientName`

- **Firma:** `clientName(): string \| null` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L65) (L65–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.priceList`

- **Firma:** `priceList(): PriceListType` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.draftKey`

- **Firma:** `draftKey(): string \| null` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.items`

- **Firma:** `items(): SaleDetail[]` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.createdAt`

- **Firma:** `createdAt(): Date` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.updatedAt`

- **Firma:** `updatedAt(): Date` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.invoiceNumber`

- **Firma:** `invoiceNumber(): string \| null` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L89) (L89–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.isVoided`

- **Firma:** `isVoided(): boolean` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L93) (L93–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.voidedAt`

- **Firma:** `voidedAt(): Date \| null` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L97) (L97–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.voidedBy`

- **Firma:** `voidedBy(): string \| null` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L101) (L101–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.voidedByUsername`

- **Firma:** `voidedByUsername(): string \| null` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L105) (L105–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Sale.voidReason`

- **Firma:** `voidReason(): string \| null` — [sale.entity.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/entities/sale.entity.ts#L109) (L109–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-sales-domain-errors-insufficient-stock-error-ts"></a>

### insufficient-stock.error.ts

- **Ruta:** [insufficient-stock.error.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/errors/insufficient-stock.error.ts) (`comercial-jhoel-api/src/modules/sales/domain/errors/insufficient-stock.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Errores de dominio: declara `InsufficientStockError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

#### Clase `InsufficientStockError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-sales-domain-errors-invalid-client-error-ts"></a>

### invalid-client.error.ts

- **Ruta:** [invalid-client.error.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/errors/invalid-client.error.ts) (`comercial-jhoel-api/src/modules/sales/domain/errors/invalid-client.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** The referenced client doesn't exist or is deactivated — mirrors InvalidCategoryError/InvalidBusinessError.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [configure-sale-pricing.use-case.spec.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-spec-ts), [configure-sale-pricing.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-ts), [create-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-create-sale-use-case-ts)

#### Clase `InvalidClientError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** The referenced client doesn't exist or is deactivated — mirrors InvalidCategoryError/InvalidBusinessError.
<a id="f-comercial-jhoel-api-src-modules-sales-domain-errors-invalid-sale-quantity-error-ts"></a>

### invalid-sale-quantity.error.ts

- **Ruta:** [invalid-sale-quantity.error.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/errors/invalid-sale-quantity.error.ts) (`comercial-jhoel-api/src/modules/sales/domain/errors/invalid-sale-quantity.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Errores de dominio: declara `InvalidSaleQuantityError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [adjust-sale-item.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-adjust-sale-item-use-case-ts), [create-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-create-sale-use-case-ts), [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

#### Clase `InvalidSaleQuantityError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-sales-domain-errors-no-open-sale-error-ts"></a>

### no-open-sale.error.ts

- **Ruta:** [no-open-sale.error.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/errors/no-open-sale.error.ts) (`comercial-jhoel-api/src/modules/sales/domain/errors/no-open-sale.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Confirming/cancelling/fetching a caller's in-progress receipt when they don't have one open.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [cancel-open-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-cancel-open-sale-use-case-ts), [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

#### Clase `NoOpenSaleError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Confirming/cancelling/fetching a caller's in-progress receipt when they don't have one open.
<a id="f-comercial-jhoel-api-src-modules-sales-domain-errors-price-list-locked-error-ts"></a>

### price-list-locked.error.ts

- **Ruta:** [price-list-locked.error.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/errors/price-list-locked.error.ts) (`comercial-jhoel-api/src/modules/sales/domain/errors/price-list-locked.error.ts`, 13 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Raised by `configure_open_sale()` when the receipt already has line items priced under a different price list — changing it now would leave those lines' prices inconsistent with the new list.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

#### Clase `PriceListLockedError` (L4–12)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Raised by `configure_open_sale()` when the receipt already has line items priced under a different price list — changing it now would leave those lines' prices inconsistent with the new list. Cancel and start over instead.
<a id="f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-access-denied-error-ts"></a>

### sale-access-denied.error.ts

- **Ruta:** [sale-access-denied.error.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/errors/sale-access-denied.error.ts) (`comercial-jhoel-api/src/modules/sales/domain/errors/sale-access-denied.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** A USER account trying to view a sale that isn't theirs — ADMIN/SUPER_ADMIN can view any sale.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-sale-by-id.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-by-id-use-case-ts), [get-sale-pdf.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-pdf-use-case-ts)

#### Clase `SaleAccessDeniedError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** A USER account trying to view a sale that isn't theirs — ADMIN/SUPER_ADMIN can view any sale.
<a id="f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-already-voided-error-ts"></a>

### sale-already-voided.error.ts

- **Ruta:** [sale-already-voided.error.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/errors/sale-already-voided.error.ts) (`comercial-jhoel-api/src/modules/sales/domain/errors/sale-already-voided.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Errores de dominio: declara `SaleAlreadyVoidedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-void-sale-use-case-ts), [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

#### Clase `SaleAlreadyVoidedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-empty-error-ts"></a>

### sale-empty.error.ts

- **Ruta:** [sale-empty.error.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/errors/sale-empty.error.ts) (`comercial-jhoel-api/src/modules/sales/domain/errors/sale-empty.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Errores de dominio: declara `SaleEmptyError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-create-sale-use-case-ts), [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

#### Clase `SaleEmptyError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-not-confirmed-error-ts"></a>

### sale-not-confirmed.error.ts

- **Ruta:** [sale-not-confirmed.error.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/errors/sale-not-confirmed.error.ts) (`comercial-jhoel-api/src/modules/sales/domain/errors/sale-not-confirmed.error.ts`, 13 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** A borrador (`OPEN`) sale can't be anulada directly — it has its own correction mechanism (`cancel_open_sale`, which discards it entirely since it was never a real transaction).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

#### Clase `SaleNotConfirmedError` (L4–12)

- **Herencia / contratos:** extends DomainError
- **Propósito:** A borrador (`OPEN`) sale can't be anulada directly — it has its own correction mechanism (`cancel_open_sale`, which discards it entirely since it was never a real transaction). This should be unreachable through the normal admin UI (which only ever lists `CONFIRMED` sales), and only exists as defense-in-depth against a direct API call.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-not-found-error-ts"></a>

### sale-not-found.error.ts

- **Ruta:** [sale-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/errors/sale-not-found.error.ts) (`comercial-jhoel-api/src/modules/sales/domain/errors/sale-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Errores de dominio: declara `SaleNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-sale-by-id.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-by-id-use-case-ts), [get-sale-pdf.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-pdf-use-case-ts), [void-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-void-sale-use-case-ts), [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

#### Clase `SaleNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-product-inactive-error-ts"></a>

### sale-product-inactive.error.ts

- **Ruta:** [sale-product-inactive.error.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/errors/sale-product-inactive.error.ts) (`comercial-jhoel-api/src/modules/sales/domain/errors/sale-product-inactive.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Errores de dominio: declara `SaleProductInactiveError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

#### Clase `SaleProductInactiveError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-product-not-found-error-ts"></a>

### sale-product-not-found.error.ts

- **Ruta:** [sale-product-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/errors/sale-product-not-found.error.ts) (`comercial-jhoel-api/src/modules/sales/domain/errors/sale-product-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Errores de dominio: declara `SaleProductNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

#### Clase `SaleProductNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-void-reason-required-error-ts"></a>

### sale-void-reason-required.error.ts

- **Ruta:** [sale-void-reason-required.error.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/errors/sale-void-reason-required.error.ts) (`comercial-jhoel-api/src/modules/sales/domain/errors/sale-void-reason-required.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Errores de dominio: declara `SaleVoidReasonRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-void-sale-use-case-ts), [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

#### Clase `SaleVoidReasonRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts"></a>

### sale.repository.ts

- **Ruta:** [sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/domain/repositories/sale.repository.ts) (`comercial-jhoel-api/src/modules/sales/domain/repositories/sale.repository.ts`, 107 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `SaleItemData`, `ConfirmSaleData`, `FindSalesOptions`, `PaginatedResult`, `SaleDailyAmount` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sale.entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-entity-ts)
- **Consumidores:** [get-sale-report-detail.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sale-report-detail-use-case-ts), [adjust-sale-item.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-adjust-sale-item-use-case-ts), [cancel-open-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-cancel-open-sale-use-case-ts), [configure-sale-pricing.use-case.spec.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-spec-ts), [configure-sale-pricing.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-ts), [confirm-open-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-confirm-open-sale-use-case-ts), [create-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-create-sale-use-case-ts), [get-open-sales.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-open-sales-use-case-ts), [get-sale-by-id.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-by-id-use-case-ts), [get-sale-pdf.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-pdf-use-case-ts), [get-sales-daily-stats.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-daily-stats-use-case-ts), [get-sales-weekly-stats.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-weekly-stats-use-case-ts), [get-sales-yearly-stats.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-yearly-stats-use-case-ts), [list-sales.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-list-sales-use-case-ts), [void-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-void-sale-use-case-ts) y 3 más

**Interfaces, tipos y enums:**

- `interface SaleItemData` (L6): sin documentación — miembros: `productId`, `presentationId`, `quantity`
- `interface ConfirmSaleData` (L13): sin documentación — miembros: `userId`, `items`, `clientId`, `priceList`, `invoiceNumber`
- `interface FindSalesOptions` (L26): sin documentación — miembros: `userId`, `clientId`, `startDate`, `endDate`, `search`, `status`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface PaginatedResult` (L43): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface SaleDailyAmount` (L50): sin documentación — miembros: `date`, `amount`
- `interface SaleMonthlyAmount` (L56): sin documentación — miembros: `month`, `amount`
- `interface AdjustSaleItemData` (L62): sin documentación — miembros: `userId`, `productId`, `presentationId`, `quantityDelta`, `draftKey`
- `interface ConfigureSalePricingData` (L73): sin documentación — miembros: `userId`, `clientId`, `priceList`, `draftKey`
- `interface SaleRepository` (L80): sin documentación — miembros: `confirmSale`, `findAll`, `findById`, `adjustItem`, `findOpenSalesByUserId`, `confirmOpenSale`, `cancelOpenSale`, `configureOpenSale`, `voidSale`, `getDailySalesTotals`, `getMonthlySalesTotals`
- `type SaleSortField` (L22) = `'saleDate' \| 'total' \| 'createdAt'`
- `type SortDirection` (L23) = `'asc' \| 'desc'`
- `type SaleStatusFilter` (L24) = `'ACTIVE' \| 'VOIDED'`

**Constantes exportadas:**

- `SALE_REPOSITORY` (L4) = `Symbol('SALE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-sales-infrastructure-pdf-sale-pdf-builder-ts"></a>

### sale-pdf.builder.ts

- **Ruta:** [sale-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/pdf/sale-pdf.builder.ts) (`comercial-jhoel-api/src/modules/sales/infrastructure/pdf/sale-pdf.builder.ts`, 243 líneas)
- **Tipo:** Builder · **Capa:** Infraestructura · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Reconstructs a Venta receipt purely from already-persisted data (`SaleOutput` + the company settings singleton) — never re-runs `confirm_open_sale` or touches inventory.
- **Depende de (archivos del proyecto):** [pdf-helpers.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-ts)
- **Paquetes externos:** `pdfkit`
- **Consumidores:** [get-sale-pdf.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-pdf-use-case-ts)

**Interfaces, tipos y enums:**

- `interface SalePdfItem` (L10): sin documentación — miembros: `productName`, `presentationName`, `quantity`, `unitPrice`, `total`
- `interface SalePdfOptions` (L18): sin documentación — miembros: `company`, `saleNumber`, `saleDate`, `username`, `clientName`, `items`, `total`, `invoiceNumber`, `isVoided`, `voidReason`
#### Función `buildSalePdf` (L49–73)

- **Tipo:** función exportada
- **Firma:** `buildSalePdf(options: SalePdfOptions): Promise<Buffer>` — [sale-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/pdf/sale-pdf.builder.ts#L49)
- **Propósito / descripción:** Reconstructs a Venta receipt purely from already-persisted data (`SaleOutput` + the company settings singleton) — never re-runs `confirm_open_sale` or touches inventory. Normal A4 document layout, distinct from Tickets' compact thermal layout and Cotizaciones' commercial layout (three genuinely different documents, per the approved plan).
- **Dependencias:** `new PDFDocument`, `doc.on`, `chunks.push`, `new Promise`, `resolve`, `Buffer.concat`, `drawCompanyLetterhead`, `doc.moveDown`, `drawDivider`, `drawDocumentInfo`, `drawTable`, `drawTotals`, `numberPages`, `doc.end`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-sale-pdf.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-pdf-use-case-ts)

#### Función `drawDocumentInfo` (L75–139)

- **Tipo:** función local del archivo
- **Firma:** `drawDocumentInfo(doc: PDFKit.PDFDocument, options: SalePdfOptions): void` — [sale-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/pdf/sale-pdf.builder.ts#L75)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `doc.fontSize(16).fillColor('#0f172a').text`, `doc.fontSize(16).fillColor`, `doc.fontSize`, `doc.fontSize(12).fillColor('#dc2626').text`, `doc.fontSize(12).fillColor`, `doc.fontSize(9).fillColor('#334155').text`, `doc.fontSize(9).fillColor`, `doc.text`, `formatDateTime`, `doc.fontSize(10).fillColor('#0f172a').text`, `doc.fontSize(10).fillColor`, `drawDivider`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawTable` (L141–201)

- **Tipo:** función local del archivo
- **Firma:** `drawTable(doc: PDFKit.PDFDocument, items: SalePdfItem[]): void` — [sale-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/pdf/sale-pdf.builder.ts#L141)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `COLUMNS.reduce`, `doc.rect(startX, y, totalWidth, HEADER_ROW_HEIGHT).fill`, `doc.rect`, `doc.fontSize(9).fillColor`, `doc.fontSize`, `doc.text`, `doc.fillColor`, `doc.addPage`, `drawTableHeader`, `doc.moveDown`, `items.forEach`, `ensureSpace`, `doc.rect(startX, y, totalWidth, ROW_HEIGHT).fill`, `String`, `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawTotals` (L203–216)

- **Tipo:** función local del archivo
- **Firma:** `drawTotals(doc: PDFKit.PDFDocument, total: number): void` — [sale-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/pdf/sale-pdf.builder.ts#L203)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `doc.fontSize(13).fillColor('#0f172a').text`, `doc.fontSize(13).fillColor`, `doc.fontSize`, `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `numberPages` (L218–242)

- **Tipo:** función local del archivo
- **Firma:** `numberPages(doc: PDFKit.PDFDocument): void` — [sale-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/pdf/sale-pdf.builder.ts#L218)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.bufferedPageRange`, `doc.switchToPage`, `doc.fontSize(8).fillColor('#94a3b8').text`, `doc.fontSize(8).fillColor`, `doc.fontSize`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-detail-orm-entity-ts"></a>

### sale-detail.orm-entity.ts

- **Ruta:** [sale-detail.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/sale-detail.orm-entity.ts) (`comercial-jhoel-api/src/modules/sales/infrastructure/persistence/sale-detail.orm-entity.ts`, 81 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `SaleDetailOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product.orm-entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-orm-entity-ts), [product-presentation.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-product-presentation-orm-entity-ts), [business.orm-entity.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [sale.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [typeorm-sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-sales-report-repository-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts), [sale.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts), [typeorm-sales-register.repository.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-infrastructure-persistence-typeorm-sales-register-repository-ts), [sales-register.module.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-sales-register-module-ts)

#### Clase `SaleDetailOrmEntity` (L14–80)

- **Decoradores:** `@Entity('sale_details')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column saleId: string`, `@ManyToOne sale: SaleOrmEntity`, `@Column productId: string`, `@ManyToOne product: ProductOrmEntity`, `@Column quantity: number`, `@Column unitPrice: number`, `@Column total: number`, `@Column presentationId: string \| null`, `@ManyToOne presentation: ProductPresentationOrmEntity \| null`, `@Column businessId: string`, `@ManyToOne business: BusinessOrmEntity`
<a id="f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-mapper-ts"></a>

### sale.mapper.ts

- **Ruta:** [sale.mapper.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/sale.mapper.ts) (`comercial-jhoel-api/src/modules/sales/infrastructure/persistence/sale.mapper.ts`, 42 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Mapper: declara `SaleMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sale.entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-entity-ts), [sale-detail.entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-detail-entity-ts), [sale.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts)
- **Consumidores:** [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

#### Clase `SaleMapper` (L5–41)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 7–40 | `orm: SaleOrmEntity` | `Sale` |

##### `SaleMapper.toDomain`

- **Firma:** `toDomain(orm: SaleOrmEntity): Sale` — [sale.mapper.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/sale.mapper.ts#L7) (L7–40)
- **Propósito / descripción:** `orm.items` is `undefined` whenever the query didn't join `sale_details` (the list view never does) — mapped to `[]`.
- **Dependencias (llamadas en su cuerpo):** `Sale.create`, `(orm.items ?? []).map`, `SaleDetail.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts"></a>

### sale.orm-entity.ts

- **Ruta:** [sale.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/sale.orm-entity.ts) (`comercial-jhoel-api/src/modules/sales/infrastructure/persistence/sale.orm-entity.ts`, 105 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `SaleOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [client.orm-entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [sale-detail.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-detail-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [dashboard.module.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-dashboard-module-ts), [typeorm-dashboard.repository.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-infrastructure-persistence-typeorm-dashboard-repository-ts), [typeorm-sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-sales-report-repository-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts), [sale-detail.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-detail-orm-entity-ts), [sale.mapper.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-mapper-ts), [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts), [typeorm-sales-register.repository.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-infrastructure-persistence-typeorm-sales-register-repository-ts), [sales-register.module.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-sales-register-module-ts)

#### Clase `SaleOrmEntity` (L16–104)

- **Decoradores:** `@Entity('sales')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column userId: string`, `@ManyToOne user: UserOrmEntity`, `@Column saleDate: Date`, `@Column total: number`, `@Column status: 'OPEN' \| 'CONFIRMED'`, `@Column clientId: string \| null`, `@ManyToOne client: ClientOrmEntity \| null`, `@Column priceList: 'PUBLIC' \| 'WHOLESALE'`, `@Column draftKey: string \| null`, `@OneToMany items: SaleDetailOrmEntity[]`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column invoiceNumber: string \| null`, `@Column isVoided: boolean`, `@Column voidedAt: Date \| null`, `@Column voidedBy: string \| null`, `@ManyToOne voidedByUser: UserOrmEntity \| null`, `@Column voidReason: string \| null`
<a id="f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts"></a>

### typeorm-sale.repository.ts

- **Ruta:** [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts) (`comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts`, 369 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmSaleRepository`, `SORT_COLUMN` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sale.entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-entity-ts), [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [sale-empty.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-empty-error-ts), [sale-product-not-found.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-product-not-found-error-ts), [sale-product-inactive.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-product-inactive-error-ts), [insufficient-stock.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-insufficient-stock-error-ts), [invalid-sale-quantity.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-invalid-sale-quantity-error-ts), [no-open-sale.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-no-open-sale-error-ts), [price-list-locked.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-price-list-locked-error-ts), [sale-not-found.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-not-found-error-ts), [sale-already-voided.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-already-voided-error-ts), [sale-void-reason-required.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-void-reason-required-error-ts), [sale-not-confirmed.error.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-errors-sale-not-confirmed-error-ts), [sale.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts), [sale.mapper.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

#### Clase `TypeOrmSaleRepository` (L36–368)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements SaleRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(SaleOrmEntity) repository: Repository<SaleOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `confirmSale` | método public async | 43–79 | `data: ConfirmSaleData` | `Promise<Sale>` |
| `findAll` | método public async | 81–129 | `options: FindSalesOptions` | `Promise<PaginatedResult<Sale>>` |
| `findById` | método public async | 131–137 | `id: string` | `Promise<Sale \| null>` |
| `adjustItem` | método public async | 139–164 | `data: AdjustSaleItemData` | `Promise<Sale>` |
| `findOpenSalesByUserId` | método public async | 166–173 | `userId: string` | `Promise<Sale[]>` |
| `confirmOpenSale` | método public async | 182–216 | `userId: string`, `draftKey: string`, `invoiceNumber?: string` | `Promise<Sale>` |
| `cancelOpenSale` | método public async | 218–223 | `userId: string`, `draftKey: string` | `Promise<boolean>` |
| `configureOpenSale` | método public async | 225–248 | `data: ConfigureSalePricingData` | `Promise<Sale>` |
| `voidSale` | método public async | 250–268 | `id: string`, `voidedBy: string`, `reason: string` | `Promise<Sale>` |
| `translateSaleVoidError` | método private | 271–294 | `error: unknown` | `unknown` |
| `translateSaleError` | método private | 306–333 | `error: unknown` | `unknown` |
| `getDailySalesTotals` | método public async | 335–350 | `startDate: Date`, `endDate: Date` | `Promise<SaleDailyAmount[]>` |
| `getMonthlySalesTotals` | método public async | 352–367 | `startDate: Date`, `endDate: Date` | `Promise<SaleMonthlyAmount[]>` |

##### `TypeOrmSaleRepository.confirmSale`

- **Firma:** `confirmSale(data: ConfirmSaleData): Promise<Sale>` — [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts#L43) (L43–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `JSON.stringify`, `data.items.map`, `this.repository.manager.query`, `this.translateSaleError`, `this.repository.update`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `confirm_sale`; Actualiza estado (signals): `this.repository.update`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateSaleError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la venta recién creada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSaleRepository.findAll`

- **Firma:** `findAll(options: FindSalesOptions): Promise<PaginatedResult<Sale>>` — [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts#L81) (L81–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('sale').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `orms.map`, `SaleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSaleRepository.findById`

- **Firma:** `findById(id: string): Promise<Sale \| null>` — [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts#L131) (L131–137)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `SaleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmSaleRepository.adjustItem`

- **Firma:** `adjustItem(data: AdjustSaleItemData): Promise<Sale>` — [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts#L139) (L139–164)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateSaleError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `adjust_sale_item`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateSaleError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la venta en construcción.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSaleRepository.findOpenSalesByUserId`

- **Firma:** `findOpenSalesByUserId(userId: string): Promise<Sale[]>` — [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts#L166) (L166–173)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `SaleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSaleRepository.confirmOpenSale`

- **Firma:** `confirmOpenSale(userId: string, draftKey: string, invoiceNumber?: string): Promise<Sale>` — [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts#L182) (L182–216)
- **Propósito / descripción:** Calls the `confirm_open_sale` Postgres function (see migration `1759400000000-CreateInventoryLocationsAndPresentations`) rather than a plain `UPDATE` — confirming a draft is the one moment a `SALIDA_VENTA` movement row is written per line, and that has to happen atomically alongside the status flip, inside the same function.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `new NoOpenSaleError`, `new SaleEmptyError`, `this.repository.manager.query`, `this.repository.update`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `confirm_open_sale`; Actualiza estado (signals): `this.repository.update`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `new NoOpenSaleError()`, `new SaleEmptyError()`, `new InternalServerErrorException( 'No se pudo recuperar la venta confirmada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSaleRepository.cancelOpenSale`

- **Firma:** `cancelOpenSale(userId: string, draftKey: string): Promise<boolean>` — [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts#L218) (L218–223)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`
- **Efectos secundarios:** Llama funciones SQL: `cancel_open_sale`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSaleRepository.configureOpenSale`

- **Firma:** `configureOpenSale(data: ConfigureSalePricingData): Promise<Sale>` — [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts#L225) (L225–248)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateSaleError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `configure_open_sale`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateSaleError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la venta en construcción.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSaleRepository.voidSale`

- **Firma:** `voidSale(id: string, voidedBy: string, reason: string): Promise<Sale>` — [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts#L250) (L250–268)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateSaleVoidError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `void_sale`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateSaleVoidError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la venta recién anulada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSaleRepository.translateSaleVoidError`

- **Firma:** `translateSaleVoidError(error: unknown): unknown` — [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts#L271) (L271–294)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;id&gt;'` → domain-error translation pattern as `translateSaleError`/`TypeOrmPurchaseRepository.translatePurchaseVoidError` — kept separate since the codes don't overlap.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new SaleVoidReasonRequiredError`, `new SaleNotFoundError`, `new SaleNotConfirmedError`, `new SaleAlreadyVoidedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmSaleRepository.translateSaleError`

- **Firma:** `translateSaleError(error: unknown): unknown` — [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts#L306) (L306–333)
- **Propósito / descripción:** `confirm_sale`/`adjust_sale_item` (both stored Postgres functions — see migrations `1757100000000-CreateSalesTables`/`1757200000000-AddDraftSalesSupport`) signal a business-rule failure via `RAISE EXCEPTION '&lt;CODE&gt;:&lt;productId&gt;'`, which the driver surfaces as a `QueryFailedError` whose message embeds that string. Parsing it back into the matching domain error here is what lets a stock/quantity/product failure raised inside Postgres reach the `GlobalExceptionFilter` as the same typed error a TypeScript-level check would have thrown — the HTTP caller can't tell which layer caught it.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new SaleEmptyError`, `new SaleProductNotFoundError`, `new SaleProductInactiveError`, `new InsufficientStockError`, `new InvalidSaleQuantityError`, `new PriceListLockedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmSaleRepository.getDailySalesTotals`

- **Firma:** `getDailySalesTotals(startDate: Date, endDate: Date): Promise<SaleDailyAmount[]>` — [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts#L335) (L335–350)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('sale').select(dateExpr, 'date').addSelect`, `this.repository.createQueryBuilder('sale').select`, `this.repository.createQueryBuilder`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSaleRepository.getMonthlySalesTotals`

- **Firma:** `getMonthlySalesTotals(startDate: Date, endDate: Date): Promise<SaleMonthlyAmount[]>` — [typeorm-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts#L352) (L352–367)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('sale').select(monthExpr, 'month').addSelect`, `this.repository.createQueryBuilder('sale').select`, `this.repository.createQueryBuilder`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts"></a>

### sales.controller.ts

- **Ruta:** [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts) (`comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts`, 242 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** No `@Roles(...)` restriction on this controller — registering a sale is an operational action for whoever runs the register (typically a USER-role cashier), not an admin-only one.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-create-sale-use-case-ts), [list-sales.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-list-sales-use-case-ts), [get-sale-by-id.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-by-id-use-case-ts), [adjust-sale-item.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-adjust-sale-item-use-case-ts), [get-open-sales.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-open-sales-use-case-ts), [confirm-open-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-confirm-open-sale-use-case-ts), [cancel-open-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-cancel-open-sale-use-case-ts), [configure-sale-pricing.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-ts), [get-sale-pdf.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-pdf-use-case-ts), [void-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-void-sale-use-case-ts), [get-sales-daily-stats.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-daily-stats-use-case-ts) y 13 más
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts)

#### Clase `SalesController` (L65–241)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('sales')`
- **Propósito:** No `@Roles(...)` restriction on this controller — registering a sale is an operational action for whoever runs the register (typically a USER-role cashier), not an admin-only one. This mirrors how the Inventory screen is readable by every authenticated role: `JwtAuthGuard` (any authenticated, active account) is the only gate. `ListSalesUseCase`/`GetSaleByIdUseCase` still restrict *which* sales a non-admin can see (only their own) — that's enforced in the use case, not here. Route order matters: `current` must be declared before `:id`, or Nest would match `GET /sales/current` as `GET /sales/:id` with `id="current"` (which then fails UUID validation instead of hitting the intended handler).
- **Dependencias inyectadas (constructor):** `createSaleUseCase: CreateSaleUseCase`, `listSalesUseCase: ListSalesUseCase`, `getSaleByIdUseCase: GetSaleByIdUseCase`, `adjustSaleItemUseCase: AdjustSaleItemUseCase`, `getOpenSalesUseCase: GetOpenSalesUseCase`, `confirmOpenSaleUseCase: ConfirmOpenSaleUseCase`, `cancelOpenSaleUseCase: CancelOpenSaleUseCase`, `configureSalePricingUseCase: ConfigureSalePricingUseCase`, `getSalePdfUseCase: GetSalePdfUseCase`, `voidSaleUseCase: VoidSaleUseCase`, `getSalesDailyStatsUseCase: GetSalesDailyStatsUseCase`, `getSalesWeeklyStatsUseCase: GetSalesWeeklyStatsUseCase`, `getSalesYearlyStatsUseCase: GetSalesYearlyStatsUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 85–98 | `dto: CreateSaleRequestDto`, `userId: string` | `Promise<SaleResponseDto>` |
| `findAll` | método public | 100–110 | `query: ListSalesQueryDto`, `user: RequestUser` | `Promise<PaginatedSalesResponseDto>` |
| `voidSale` | método public | 119–133 | `id: string`, `dto: VoidSaleRequestDto`, `userId: string` | `Promise<SaleResponseDto>` |
| `adjustItem` | método public | 136–142 | `dto: AdjustSaleItemRequestDto`, `userId: string` | `Promise<SaleResponseDto>` |
| `getCurrent` | método public | 145–150 | `userId: string` | `Promise<SaleResponseDto[]>` |
| `configurePricing` | método public | 153–164 | `dto: ConfigureSalePricingRequestDto`, `userId: string` | `Promise<SaleResponseDto>` |
| `confirm` | método public | 167–177 | `dto: ConfirmOpenSaleRequestDto`, `userId: string` | `Promise<SaleResponseDto>` |
| `cancelCurrent` | método public | 180–187 | `query: CancelOpenSaleQueryDto`, `userId: string` | `Promise<void>` |
| `dailyStats` | método public | 190–193 | — | `Promise<SalesDailyStatsResponseDto>` |
| `weeklyStats` | método public | 196–199 | — | `Promise<SalesWeeklyStatsResponseDto>` |
| `yearlyStats` | método public | 202–205 | — | `Promise<SalesYearlyStatsResponseDto>` |
| `getPdf` | método public async | 213–229 | `id: string`, `user: RequestUser`, `res: Response` | `Promise<void>` |
| `findOne` | método public | 231–240 | `id: string`, `user: RequestUser` | `Promise<SaleResponseDto>` |

##### `SalesController.create`

- **Firma:** `create(dto: CreateSaleRequestDto, userId: string): Promise<SaleResponseDto>` — [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L85) (L85–98)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Bulk, one-shot sale creation — unchanged, still fully atomic via `confirm_sale`. Independent of the incremental draft flow below.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createSaleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesController.findAll`

- **Firma:** `findAll(query: ListSalesQueryDto, user: RequestUser): Promise<PaginatedSalesResponseDto>` — [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L100) (L100–110)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listSalesUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesController.voidSale`

- **Firma:** `voidSale(id: string, dto: VoidSaleRequestDto, userId: string): Promise<SaleResponseDto>` — [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L119) (L119–133)
- **Decoradores:** `@Post(':id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** "Anular venta" — admin-only correction path for the "Administrar Facturas de Ventas" module. Only ever targets a `CONFIRMED` sale — an `OPEN` draft has its own correction mechanism (`DELETE /sales/current`). Never an edit, never a physical delete — see `VoidSaleUseCase`'s own doc comment.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidSaleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesController.adjustItem`

- **Firma:** `adjustItem(dto: AdjustSaleItemRequestDto, userId: string): Promise<SaleResponseDto>` — [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L136) (L136–142)
- **Decoradores:** `@Post('items')`
- **Propósito / descripción:** Reserves/releases stock against the caller's own open receipt in real time — one call per cart action.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.adjustSaleItemUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesController.getCurrent`

- **Firma:** `getCurrent(userId: string): Promise<SaleResponseDto[]>` — [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L145) (L145–150)
- **Decoradores:** `@Get('current')`
- **Propósito / descripción:** Every one of the caller's in-progress receipts (one per open tab) — lets the frontend restore all of them after a reload/navigation. An empty array means no open tabs, not an error.
- **Origen de parámetros:** `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.getOpenSalesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesController.configurePricing`

- **Firma:** `configurePricing(dto: ConfigureSalePricingRequestDto, userId: string): Promise<SaleResponseDto>` — [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L153) (L153–164)
- **Decoradores:** `@Patch('current/pricing')`
- **Propósito / descripción:** Sets/updates one open receipt's client and price list — call once per tab, before or while that tab's cart is empty. Rejects a price-list change once that receipt has line items.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.configureSalePricingUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesController.confirm`

- **Firma:** `confirm(dto: ConfirmOpenSaleRequestDto, userId: string): Promise<SaleResponseDto>` — [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L167) (L167–177)
- **Decoradores:** `@Post('confirm')`
- **Propósito / descripción:** "Guardar venta" — stock is already reserved; this just marks the targeted tab's receipt CONFIRMED.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.confirmOpenSaleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesController.cancelCurrent`

- **Firma:** `cancelCurrent(query: CancelOpenSaleQueryDto, userId: string): Promise<void>` — [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L180) (L180–187)
- **Decoradores:** `@Delete('current')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Discards one tab's receipt and restores every reserved line's stock.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.cancelOpenSaleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesController.dailyStats`

- **Firma:** `dailyStats(): Promise<SalesDailyStatsResponseDto>` — [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L190) (L190–193)
- **Decoradores:** `@Get('daily-stats')`
- **Propósito / descripción:** Backs "Ventas del mes" en Gráficas → Indicadores de Ventas — must be declared before `:id`, same route-ordering discipline as `current`. Open to any authenticated account.
- **Dependencias (llamadas en su cuerpo):** `this.getSalesDailyStatsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesController.weeklyStats`

- **Firma:** `weeklyStats(): Promise<SalesWeeklyStatsResponseDto>` — [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L196) (L196–199)
- **Decoradores:** `@Get('weekly-stats')`
- **Propósito / descripción:** Backs "Ventas por semana" en Gráficas → Indicadores de Ventas.
- **Dependencias (llamadas en su cuerpo):** `this.getSalesWeeklyStatsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesController.yearlyStats`

- **Firma:** `yearlyStats(): Promise<SalesYearlyStatsResponseDto>` — [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L202) (L202–205)
- **Decoradores:** `@Get('yearly-stats')`
- **Propósito / descripción:** Backs "Ventas por mes" (anual) en Gráficas → Indicadores de Ventas.
- **Dependencias (llamadas en su cuerpo):** `this.getSalesYearlyStatsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesController.getPdf`

- **Firma:** `getPdf(id: string, user: RequestUser, res: Response): Promise<void>` — [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L213) (L213–229)
- **Decoradores:** `@Get(':id/pdf')`
- **Propósito / descripción:** Reconstructs the sale's receipt PDF purely from already-persisted data — never re-runs `confirm_open_sale`. Declared before `:id` so it isn't swallowed by that route's `ParseUUIDPipe` matching on `id`, matching this controller's existing route-ordering discipline.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.getSalePdfUseCase.execute`, `ADMIN_ROLES.includes`, `res.set`, `id.slice`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesController.findOne`

- **Firma:** `findOne(id: string, user: RequestUser): Promise<SaleResponseDto>` — [sales.controller.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts#L231) (L231–240)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getSaleByIdUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-sales-presentation-dtos-adjust-sale-item-request-dto-ts"></a>

### adjust-sale-item.request.dto.ts

- **Ruta:** [adjust-sale-item.request.dto.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/dtos/adjust-sale-item.request.dto.ts) (`comercial-jhoel-api/src/modules/sales/presentation/dtos/adjust-sale-item.request.dto.ts`, 29 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** DTO de entrada: declara `AdjustSaleItemRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

#### Clase `AdjustSaleItemRequestDto` (L10–28)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-presentation-dtos-cancel-open-sale-query-dto-ts"></a>

### cancel-open-sale.query.dto.ts

- **Ruta:** [cancel-open-sale.query.dto.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/dtos/cancel-open-sale.query.dto.ts) (`comercial-jhoel-api/src/modules/sales/presentation/dtos/cancel-open-sale.query.dto.ts`, 10 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** DTO de consulta: declara `CancelOpenSaleQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

#### Clase `CancelOpenSaleQueryDto` (L3–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-presentation-dtos-configure-sale-pricing-request-dto-ts"></a>

### configure-sale-pricing.request.dto.ts

- **Ruta:** [configure-sale-pricing.request.dto.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/dtos/configure-sale-pricing.request.dto.ts) (`comercial-jhoel-api/src/modules/sales/presentation/dtos/configure-sale-pricing.request.dto.ts`, 27 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** DTO de entrada: declara `ConfigureSalePricingRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

#### Clase `ConfigureSalePricingRequestDto` (L11–26)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-presentation-dtos-confirm-open-sale-request-dto-ts"></a>

### confirm-open-sale.request.dto.ts

- **Ruta:** [confirm-open-sale.request.dto.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/dtos/confirm-open-sale.request.dto.ts) (`comercial-jhoel-api/src/modules/sales/presentation/dtos/confirm-open-sale.request.dto.ts`, 16 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** DTO de entrada: declara `ConfirmOpenSaleRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

#### Clase `ConfirmOpenSaleRequestDto` (L3–15)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-presentation-dtos-create-sale-request-dto-ts"></a>

### create-sale.request.dto.ts

- **Ruta:** [create-sale.request.dto.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/dtos/create-sale.request.dto.ts) (`comercial-jhoel-api/src/modules/sales/presentation/dtos/create-sale.request.dto.ts`, 50 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** DTO de entrada: declara `CreateSaleItemRequestDto`, `CreateSaleRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

#### Clase `CreateSaleItemRequestDto` (L15–27)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CreateSaleRequestDto` (L29–49)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-presentation-dtos-list-sales-query-dto-ts"></a>

### list-sales.query.dto.ts

- **Ruta:** [list-sales.query.dto.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/dtos/list-sales.query.dto.ts) (`comercial-jhoel-api/src/modules/sales/presentation/dtos/list-sales.query.dto.ts`, 72 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** DTO de consulta: declara `ListSalesQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS`, `STATUS_FILTERS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

#### Clase `ListSalesQueryDto` (L23–71)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-presentation-dtos-sale-response-dto-ts"></a>

### sale.response.dto.ts

- **Ruta:** [sale.response.dto.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/dtos/sale.response.dto.ts) (`comercial-jhoel-api/src/modules/sales/presentation/dtos/sale.response.dto.ts`, 56 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** DTO de respuesta: declara `SaleItemResponseDto`, `SaleResponseDto`, `SaleSummaryResponseDto`, `PaginatedSalesResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

#### Clase `SaleItemResponseDto` (L1–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `SaleResponseDto` (L12–31)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `SaleSummaryResponseDto` (L33–48)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedSalesResponseDto` (L50–55)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-presentation-dtos-sales-daily-stats-response-dto-ts"></a>

### sales-daily-stats.response.dto.ts

- **Ruta:** [sales-daily-stats.response.dto.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/dtos/sales-daily-stats.response.dto.ts) (`comercial-jhoel-api/src/modules/sales/presentation/dtos/sales-daily-stats.response.dto.ts`, 10 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** DTO de respuesta: declara `SalesDailyStatDto`, `SalesDailyStatsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

#### Clase `SalesDailyStatDto` (L1–4)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `SalesDailyStatsResponseDto` (L6–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-presentation-dtos-sales-weekly-stats-response-dto-ts"></a>

### sales-weekly-stats.response.dto.ts

- **Ruta:** [sales-weekly-stats.response.dto.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/dtos/sales-weekly-stats.response.dto.ts) (`comercial-jhoel-api/src/modules/sales/presentation/dtos/sales-weekly-stats.response.dto.ts`, 13 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** DTO de respuesta: declara `SalesWeeklyStatDto`, `SalesWeeklyStatsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

#### Clase `SalesWeeklyStatDto` (L1–7)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `SalesWeeklyStatsResponseDto` (L9–12)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-presentation-dtos-sales-yearly-stats-response-dto-ts"></a>

### sales-yearly-stats.response.dto.ts

- **Ruta:** [sales-yearly-stats.response.dto.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/dtos/sales-yearly-stats.response.dto.ts) (`comercial-jhoel-api/src/modules/sales/presentation/dtos/sales-yearly-stats.response.dto.ts`, 11 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** DTO de respuesta: declara `SalesMonthlyStatDto`, `SalesYearlyStatsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

#### Clase `SalesMonthlyStatDto` (L1–5)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `SalesYearlyStatsResponseDto` (L7–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-presentation-dtos-void-sale-request-dto-ts"></a>

### void-sale.request.dto.ts

- **Ruta:** [void-sale.request.dto.ts](../../../../comercial-jhoel-api/src/modules/sales/presentation/dtos/void-sale.request.dto.ts) (`comercial-jhoel-api/src/modules/sales/presentation/dtos/void-sale.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Same mandatory-reason shape as every other void request DTO in this codebase (`VoidPurchaseRequestDto`, `VoidRechargePurchaseRequestDto`).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [sales.controller.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-presentation-controllers-sales-controller-ts)

#### Clase `VoidSaleRequestDto` (L4–10)

- **Propósito:** Same mandatory-reason shape as every other void request DTO in this codebase (`VoidPurchaseRequestDto`, `VoidRechargePurchaseRequestDto`).
<a id="f-comercial-jhoel-api-src-modules-sales-sales-module-ts"></a>

### sales.module.ts

- **Ruta:** [sales.module.ts](../../../../comercial-jhoel-api/src/modules/sales/sales.module.ts) (`comercial-jhoel-api/src/modules/sales/sales.module.ts`, 52 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `sales`
- **Responsabilidad:** Módulo: declara `SalesModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sale.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts), [sale-detail.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-detail-orm-entity-ts), [typeorm-sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-typeorm-sale-repository-ts), [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [create-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-create-sale-use-case-ts), [list-sales.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-list-sales-use-case-ts), [get-sale-by-id.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-by-id-use-case-ts), [adjust-sale-item.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-adjust-sale-item-use-case-ts), [get-open-sales.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-open-sales-use-case-ts), [confirm-open-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-confirm-open-sale-use-case-ts), [cancel-open-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-cancel-open-sale-use-case-ts), [configure-sale-pricing.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-ts), [get-sale-pdf.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sale-pdf-use-case-ts), [void-sale.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-void-sale-use-case-ts), [get-sales-daily-stats.use-case.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-get-sales-daily-stats-use-case-ts) y 5 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `SalesModule` (L24–51)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([SaleOrmEntity, SaleDetailOrmEntity]), ClientsModule, CompanySettingsModule, ], controllers: [SalesController], pro`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
