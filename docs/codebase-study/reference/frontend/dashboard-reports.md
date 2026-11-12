# Frontend `dashboard-reports`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [agent-reconciliations-report-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-agent-reconciliations-agent-reconciliations-report-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Structural clone of `RechargesReportPageComponent` — the simplest existing report (no `viewMode` toggle, no detail modal, no product/type filter, plain inline table) since Cuadre de Agentes has the same shape: no line items, no dimension to filter/break down by beyond date. | 9 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [assets-receivables-report-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Unified Reportería de Activos y Cuentas por Cobrar — replaces the former separate standalone reports (both removed). | 11 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [bank-deposits-report-page.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria (sin comentario de documentación en el código). | 3 internas; ext.: @angular/common, @angular/core, @angular/router, rxjs | 0 | Soporte (pruebas) |
| [bank-deposits-report-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Reportería de Transaccionar — simpler than Sales'/Purchases' report pages, same reasoning as `RechargesReportPageComponent`: each row already shows everything (no line items to drill into, no detail modal). | 16 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [bank-deposit-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-bank-deposit-detail-modal-bank-deposit-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Ver detalle" of one Transaccionar operation — the full shape (`GET /bank-deposits/:id`, cash breakdown + transaction rows), not the lighter listing shape both "Reporte de Transacciones" and "Gestión de Transacciones" already show. | 5 internas; ext.: @angular/common, @angular/core | 4 | Media (4 consumidores) |
| [void-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-void-confirm-modal-void-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Anular transacción" — dumb, same pattern as "Gestión de Transacciones"' own reopen/cancel confirm modals: the parent owns the actual `BankDepositService.voidOperation` call. | 1 internas; ext.: @angular/core, @angular/forms | 8 | Media (8 consumidores) |
| [bank-movements-report-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Reportería → Movimientos Bancarios (admin). | 11 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [bank-transfers-report-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Reportería → Reporte de Transferencias (admin). | 14 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [client-filter-search.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-client-filter-search-client-filter-search-component-ts) | .ts | Componente Angular | Feature (pantalla) | A near-copy of this same folder's `ProductFilterSearchComponent`, adapted for clients. | 3 internas; ext.: @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [ice-cream-filter-search.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-ice-cream-filter-search-ice-cream-filter-search-component-ts) | .ts | Componente Angular | Feature (pantalla) | A near-copy of this same folder's `ProductFilterSearchComponent`, adapted for helados: server-side search via `IceCreamService.searchIceCreams()` (the same live-search endpoint the operational Heladería · Compras/Ventas screens already use), with the persistent "selected" chip + clear button pattern a *filter* needs (vs. | 3 internas; ext.: @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [product-filter-search.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-product-filter-search-product-filter-search-component-ts) | .ts | Componente Angular | Feature (pantalla) | A near-copy of Ventas'/Compras' own product-search dropdowns, adapted for a *filter* rather than an "add to receipt" action: no out-of-stock disabling (a report can reasonably filter by a product that's since sold out), and a persistent "selected" chip replaces the search box until cleared, since a filter selection sticks around instead of firing once. | 3 internas; ext.: @angular/core, @angular/forms, rxjs | 4 | Media (4 consumidores) |
| [report-pagination.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts) | .ts | Componente Angular | Feature (pantalla) | Generic page-N-of-M control — no existing pagination component in this app to reuse (checked first), so this is the one place both reports (and any future paginated screen) can share. | 1 internas; ext.: @angular/core | 46 | Alta (46 consumidores) |
| [report-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Generic KPI-tile row shared by both reports — same `app-card` grid shape every other summary in this app already uses (Suppliers, Inventory, Categories...). | 1 internas; ext.: @angular/core | 18 | Alta (18 consumidores) |
| [ice-cream-report-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Unified Reportería de Heladería — replaces the former separate Ventas/ Compras de Heladería reports (both removed). | 12 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [purchase-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-components-purchase-detail-modal-purchase-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `PurchaseDetailModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core | 3 | Media (3 consumidores) |
| [purchases-report-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-components-purchases-report-table-purchases-report-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Desktop table only — same deliberate scope call as `SalesReportTableComponent` (see its own doc comment). | 2 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [purchases-report-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `PurchasesReportPageComponent`, `toIsoDate`, `todayIsoDate`, `firstDayOfMonthIsoDate`, `defaultFilterFields` (sin comentario de documentación en el código). | 16 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [recharges-report-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-recharges-recharges-report-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Simpler than Sales'/Purchases' report pages by design — Recargas has no line items to join, no "por producto" breakdown, and no per-row detail to drill into (each row already shows everything: saldo anterior, compra, saldo del día, saldo final, venta). | 10 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [sale-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-components-sale-detail-modal-sale-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `SaleDetailModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [sales-report-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-components-sales-report-table-sales-report-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Desktop table only (no mobile card-list duplicate, unlike Inventory/ Categories/etc.) — a deliberate scope call for this admin-only report screen: it's wrapped in its own `overflow-x: auto` per this app's rule for wide content, so it's still usable on a narrow viewport, just not reflowed into cards. | 2 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [sales-report-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `SalesReportPageComponent`, `toIsoDate`, `todayIsoDate`, `firstDayOfMonthIsoDate`, `defaultFilterFields` (sin comentario de documentación en el código). | 15 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [agent-reconciliations-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `agent-reconciliations-report-page.component.ts`; usa 5 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-report-summary`, `app-report-pagination`. | — | — | Media |
| [agent-reconciliations-report-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [assets-receivables-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `assets-receivables-report-page.component.ts`; usa 7 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-report-client-filter`, `app-report-summary`, `app-badge`. | — | — | Media |
| [assets-receivables-report-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-deposits-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-deposits-report-page.component.ts`; usa 8 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-transaction-monthly-chart`, `app-report-summary`, `app-report-pagination`. | — | — | Media |
| [bank-deposits-report-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-deposit-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/bank-deposit-detail-modal/bank-deposit-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-deposit-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [bank-deposit-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/bank-deposit-detail-modal/bank-deposit-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [void-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/void-confirm-modal/void-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `void-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [void-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/void-confirm-modal/void-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-movements-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-movements/bank-movements-report-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-movements-report-page.component.ts`; usa 5 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-bank-balance-amount`, `app-report-pagination`. | — | — | Media |
| [bank-movements-report-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-movements/bank-movements-report-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-transfers-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-transfers-report-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-report-summary`, `app-report-pagination`, `app-void-confirm-modal`. | — | — | Media |
| [bank-transfers-report-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [client-filter-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/client-filter-search/client-filter-search.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `client-filter-search.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [client-filter-search.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/client-filter-search/client-filter-search.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-filter-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/ice-cream-filter-search/ice-cream-filter-search.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-filter-search.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [ice-cream-filter-search.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/ice-cream-filter-search/ice-cream-filter-search.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [product-filter-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/product-filter-search/product-filter-search.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `product-filter-search.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [product-filter-search.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/product-filter-search/product-filter-search.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [report-pagination.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/report-pagination/report-pagination.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `report-pagination.component.ts`; usa 1 componentes hijos: `app-button`. | — | — | Media |
| [report-pagination.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/report-pagination/report-pagination.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [report-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/report-summary/report-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `report-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [report-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/report-summary/report-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-report-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-report-ice-cream-filter`, `app-report-summary`, `app-report-pagination`. | — | — | Media |
| [ice-cream-report-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [purchase-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/components/purchase-detail-modal/purchase-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `purchase-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [purchase-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/components/purchase-detail-modal/purchase-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [purchases-report-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/components/purchases-report-table/purchases-report-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `purchases-report-table.component.ts`; usa 2 componentes hijos: `app-icon`, `app-empty-state`. | — | — | Media |
| [purchases-report-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/components/purchases-report-table/purchases-report-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [purchases-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `purchases-report-page.component.ts`; usa 8 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-report-product-filter`, `app-report-summary`, `app-purchases-report-table`. | — | — | Media |
| [purchases-report-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharges-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharges-report-page.component.ts`; usa 5 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-report-summary`, `app-report-pagination`. | — | — | Media |
| [recharges-report-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [sale-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/components/sale-detail-modal/sale-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sale-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [sale-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/components/sale-detail-modal/sale-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [sales-report-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/components/sales-report-table/sales-report-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sales-report-table.component.ts`; usa 2 componentes hijos: `app-icon`, `app-empty-state`. | — | — | Media |
| [sales-report-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/components/sales-report-table/sales-report-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [sales-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sales-report-page.component.ts`; usa 8 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-report-product-filter`, `app-report-summary`, `app-sales-report-table`. | — | — | Media |
| [sales-report-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-agent-reconciliations-agent-reconciliations-report-page-component-ts"></a>

### agent-reconciliations-report-page.component.ts

- **Ruta:** [agent-reconciliations-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.ts`, 221 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Structural clone of `RechargesReportPageComponent` — the simplest existing report (no `viewMode` toggle, no detail modal, no product/type filter, plain inline table) since Cuadre de Agentes has the same shape: no line items, no dimension to filter/break down by beyond date.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [reports.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-reports-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-blob-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [agent-reconciliations-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="exportPdf()"`, `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(pageChange)="onPageChange($event)"`

**Interfaces, tipos y enums:**

- `interface FilterFieldsState` (L22): sin documentación — miembros: `startDate`, `endDate`

#### Clase `AgentReconciliationsReportPageComponent` (L55–220)

- **Decoradores:** `@Component({ selector: 'app-agent-reconciliations-report-page', standalone: true, imports: [ FormsModule, DatePipe, PageHeaderComponent, ButtonComponent, IconCom`
- **Propósito:** Structural clone of `RechargesReportPageComponent` — the simplest existing report (no `viewMode` toggle, no detail modal, no product/type filter, plain inline table) since Cuadre de Agentes has the same shape: no line items, no dimension to filter/break down by beyond date.
- **Servicios inyectados con `inject()`:** `reportsService = inject(ReportsService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `draftStartDate = signal(firstDayOfMonthIsoDate())`, `draftEndDate = signal(todayIsoDate())`, `startDate = signal(firstDayOfMonthIsoDate())`, `endDate = signal(todayIsoDate())`, `page = signal(1)`, `rows = signal<AgentReconciliationsReportRow[]>([])`, `total = signal(0)`, `summary = signal<AgentReconciliationsReportSummary \| null>(n`, `loadingTable = signal(false)`, `loadingSummary = signal(false)`, `exporting = signal(false)`, `hasActiveFilters = computed(() => { const defaults = defaultFilterFie`, `summaryTiles = computed<ReportSummaryTile[]>(() => { const s = th`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `applyFilters` | método public | 135–146 | — | `void` |
| `clearFilters` | método public | 148–159 | — | `void` |
| `onPageChange` | método public | 161–164 | `page: number` | `void` |
| `exportPdf` | método public | 167–180 | — | `void` |
| `currentFilters` | método private | 182–189 | — | `AgentReconciliationsReportFilters` |
| `fetchAll` | método private | 191–204 | — | `void` |
| `fetchTable` | método private | 206–219 | — | `void` |

##### `AgentReconciliationsReportPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [agent-reconciliations-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.ts#L135) (L135–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStartDate`, `this.draftEndDate`, `this.notificationService.error`, `this.startDate.set`, `this.endDate.set`, `this.page.set`, `this.fetchAll`
- **Efectos secundarios:** Actualiza estado (signals): `this.startDate.set`, `this.endDate.set`, `this.page.set`
- **Consumidores:** `agent-reconciliations-report-page.component.html` (plantilla)

##### `AgentReconciliationsReportPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [agent-reconciliations-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.ts#L148) (L148–159)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `defaultFilterFields`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.startDate.set`, `this.endDate.set`, `this.page.set`, `this.fetchAll`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftStartDate.set`, `this.draftEndDate.set`, `this.startDate.set`, `this.endDate.set`, `this.page.set`
- **Consumidores:** `agent-reconciliations-report-page.component.html` (plantilla)

##### `AgentReconciliationsReportPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [agent-reconciliations-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.ts#L161) (L161–164)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `agent-reconciliations-report-page.component.html` (plantilla)

##### `AgentReconciliationsReportPageComponent.exportPdf`

- **Firma:** `exportPdf(): void` — [agent-reconciliations-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.ts#L167) (L167–180)
- **Propósito / descripción:** Always exports exactly the applied filters — never the draft form fields — so the PDF can never show different data than what's currently on screen.
- **Dependencias (llamadas en su cuerpo):** `this.exporting.set`, `this.reportsService.exportAgentReconciliationsReportPdf(this.currentFilters()).subscribe`, `this.reportsService.exportAgentReconciliationsReportPdf`, `this.currentFilters`, `downloadBlob`, `todayIsoDate`, `this.notificationService.success`, `this.notificationService.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.exporting.set`
- **Consumidores:** `agent-reconciliations-report-page.component.html` (plantilla)

##### `AgentReconciliationsReportPageComponent.currentFilters`

- **Firma:** `currentFilters(): AgentReconciliationsReportFilters` — [agent-reconciliations-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.ts#L182) (L182–189)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.startDate`, `this.endDate`, `this.page`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `AgentReconciliationsReportPageComponent.fetchAll`

- **Firma:** `fetchAll(): void` — [agent-reconciliations-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.ts#L191) (L191–204)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingSummary.set`, `this.reportsService.getAgentReconciliationsReportSummary(this.currentFilters()).subscribe`, `this.reportsService.getAgentReconciliationsReportSummary`, `this.currentFilters`, `this.summary.set`, `this.notificationService.error`, `extractErrorMessage`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingSummary.set`, `this.summary.set`
- **Consumidores:** (mismo archivo)

##### `AgentReconciliationsReportPageComponent.fetchTable`

- **Firma:** `fetchTable(): void` — [agent-reconciliations-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.ts#L206) (L206–219)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingTable.set`, `this.reportsService.getAgentReconciliationsReport(this.currentFilters()).subscribe`, `this.reportsService.getAgentReconciliationsReport`, `this.currentFilters`, `this.rows.set`, `this.total.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingTable.set`, `this.rows.set`, `this.total.set`
- **Consumidores:** (mismo archivo)

#### Función `toIsoDate` (L28–33)

- **Tipo:** función local del archivo
- **Firma:** `toIsoDate(date: Date): string` — [agent-reconciliations-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.ts#L28)
- **Propósito / descripción:** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique the Recargas report page already uses.
- **Dependencias:** `date.getFullYear`, `String(date.getMonth() + 1).padStart`, `String`, `date.getMonth`, `String(date.getDate()).padStart`, `date.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `todayIsoDate` (L35–37)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [agent-reconciliations-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.ts#L35)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `toIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `firstDayOfMonthIsoDate` (L40–43)

- **Tipo:** función local del archivo
- **Firma:** `firstDayOfMonthIsoDate(): string` — [agent-reconciliations-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.ts#L40)
- **Propósito / descripción:** Same "current month" default as every other report page in this app.
- **Dependencias:** `new Date`, `toIsoDate`, `now.getFullYear`, `now.getMonth`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `defaultFilterFields` (L45–47)

- **Tipo:** función local del archivo
- **Firma:** `defaultFilterFields(): FilterFieldsState` — [agent-reconciliations-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/agent-reconciliations/agent-reconciliations-report-page.component.ts#L45)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `firstDayOfMonthIsoDate`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts"></a>

### assets-receivables-report-page.component.ts

- **Ruta:** [assets-receivables-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.ts`, 264 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Unified Reportería de Activos y Cuentas por Cobrar — replaces the former separate standalone reports (both removed).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [assets-receivables-report-state.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-assets-receivables-report-state-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [reports.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-reports-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-blob-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [client-filter-search.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-client-filter-search-client-filter-search-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [assets-receivables-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [client-filter-search.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-client-filter-search-client-filter-search-component-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="exportPdf()"`, `(ngModelChange)="state.draftIncludeAssets.set($event)"`, `(ngModelChange)="state.draftIncludeReceivables.set($event)"`, `(selectionChange)="onDraftClientChange($event)"`, `(ngModelChange)="state.draftStartDate.set($event)"`, `(ngModelChange)="state.draftEndDate.set($event)"`, `(ngModelChange)="state.draftStatus.set($event)"`, `(ngModelChange)="state.draftSearch.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(pageChange)="onPageChange($event)"`

#### Clase `AssetsReceivablesReportPageComponent` (L48–263)

- **Decoradores:** `@Component({ selector: 'app-assets-receivables-report-page', standalone: true, imports: [ FormsModule, DatePipe, PageHeaderComponent, ButtonComponent, IconCompon`
- **Propósito:** Unified Reportería de Activos y Cuentas por Cobrar — replaces the former separate standalone reports (both removed). State lives in `AssetsReceivablesReportStateService` (a root-provided singleton), not local signals, so checkboxes/filters/results survive navigating away and back — see that service's own doc comment for why. This component is a thin view over it, same draft/applied filter split every other report page in this app already uses.
- **Servicios inyectados con `inject()`:** `reportsService = inject(ReportsService)`, `notificationService = inject(NotificationService)`, `state = inject(AssetsReceivablesReportStateService)`
- **Datos / estado que administra:** `showTypeColumn = computed(() => this.state.includeAssets() && this.`, `hasActiveFilters = computed( () => !this.state.includeAssets() \|\| !th`, `summaryTiles = computed<ReportSummaryTile[]>(() => { const s = th`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `typeLabel` | método public | 127–129 | `type: AssetsReceivablesReportType` | `string` |
| `onDraftClientChange` | método public | 138–140 | `client: Client \| null` | `void` |
| `applyFilters` | método public | 142–166 | — | `void` |
| `clearFilters` | método public | 168–187 | — | `void` |
| `onPageChange` | método public | 189–192 | `page: number` | `void` |
| `exportPdf` | método public | 194–207 | — | `void` |
| `currentFilters` | método private | 209–224 | — | `AssetsReceivablesReportFilters` |
| `runQuery` | método private | 226–245 | — | `void` |
| `fetchTable` | método private | 247–262 | — | `void` |

##### `AssetsReceivablesReportPageComponent.typeLabel`

- **Firma:** `typeLabel(type: AssetsReceivablesReportType): string` — [assets-receivables-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.ts#L127) (L127–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `assets-receivables-report-page.component.html` (plantilla)

##### `AssetsReceivablesReportPageComponent.onDraftClientChange`

- **Firma:** `onDraftClientChange(client: Client \| null): void` — [assets-receivables-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.ts#L138) (L138–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.draftClient.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.draftClient.set`
- **Consumidores:** `assets-receivables-report-page.component.html` (plantilla)

##### `AssetsReceivablesReportPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [assets-receivables-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.ts#L142) (L142–166)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.draftIncludeAssets`, `this.state.draftIncludeReceivables`, `this.notificationService.error`, `this.state.draftStartDate`, `this.state.draftEndDate`, `this.state.includeAssets.set`, `this.state.includeReceivables.set`, `this.state.client.set`, `this.state.draftClient`, `this.state.startDate.set`, `this.state.endDate.set`, `this.state.status.set`, `this.state.draftStatus`, `this.state.search.set`, `this.state.draftSearch`, `this.state.page.set`, `this.runQuery`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.includeAssets.set`, `this.state.includeReceivables.set`, `this.state.client.set`, `this.state.startDate.set`, `this.state.endDate.set`, `this.state.status.set`
- **Consumidores:** `assets-receivables-report-page.component.html` (plantilla)

##### `AssetsReceivablesReportPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [assets-receivables-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.ts#L168) (L168–187)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.draftIncludeAssets.set`, `this.state.draftIncludeReceivables.set`, `this.state.draftClient.set`, `this.state.draftStartDate.set`, `this.state.draftEndDate.set`, `this.state.draftStatus.set`, `this.state.draftSearch.set`, `this.state.includeAssets.set`, `this.state.includeReceivables.set`, `this.state.client.set`, `this.state.startDate.set`, `this.state.endDate.set`, `this.state.status.set`, `this.state.search.set`, `this.state.page.set`, `this.runQuery`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.draftIncludeAssets.set`, `this.state.draftIncludeReceivables.set`, `this.state.draftClient.set`, `this.state.draftStartDate.set`, `this.state.draftEndDate.set`, `this.state.draftStatus.set`
- **Consumidores:** `assets-receivables-report-page.component.html` (plantilla)

##### `AssetsReceivablesReportPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [assets-receivables-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.ts#L189) (L189–192)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.page.set`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.page.set`
- **Consumidores:** `assets-receivables-report-page.component.html` (plantilla)

##### `AssetsReceivablesReportPageComponent.exportPdf`

- **Firma:** `exportPdf(): void` — [assets-receivables-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.ts#L194) (L194–207)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.exporting.set`, `this.reportsService.exportAssetsReceivablesReportPdf(this.currentFilters()).subscribe`, `this.reportsService.exportAssetsReceivablesReportPdf`, `this.currentFilters`, `downloadBlob`, `buildExportFilename`, `this.state.startDate`, `this.state.endDate`, `this.notificationService.success`, `this.notificationService.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.exporting.set`
- **Consumidores:** `assets-receivables-report-page.component.html` (plantilla)

##### `AssetsReceivablesReportPageComponent.currentFilters`

- **Firma:** `currentFilters(): AssetsReceivablesReportFilters` — [assets-receivables-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.ts#L209) (L209–224)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.includeAssets`, `this.state.includeReceivables`, `this.state.client`, `this.state.startDate`, `this.state.endDate`, `this.state.status`, `this.state.search`, `this.state.page`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `AssetsReceivablesReportPageComponent.runQuery`

- **Firma:** `runQuery(): void` — [assets-receivables-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.ts#L226) (L226–245)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.includeAssets`, `this.state.includeReceivables`, `this.notificationService.error`, `this.state.hasQueried.set`, `this.state.loadingSummary.set`, `this.reportsService.getAssetsReceivablesReportSummary(this.currentFilters()).subscribe`, `this.reportsService.getAssetsReceivablesReportSummary`, `this.currentFilters`, `this.state.summary.set`, `extractErrorMessage`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.hasQueried.set`, `this.state.loadingSummary.set`, `this.state.summary.set`
- **Consumidores:** (mismo archivo)

##### `AssetsReceivablesReportPageComponent.fetchTable`

- **Firma:** `fetchTable(): void` — [assets-receivables-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.ts#L247) (L247–262)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.loadingTable.set`, `this.reportsService.getAssetsReceivablesReport(this.currentFilters()).subscribe`, `this.reportsService.getAssetsReceivablesReport`, `this.currentFilters`, `this.state.rows.set`, `this.state.total.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.loadingTable.set`, `this.state.rows.set`, `this.state.total.set`
- **Consumidores:** (mismo archivo)

#### Función `buildExportFilename` (L31–37)

- **Tipo:** función local del archivo
- **Firma:** `buildExportFilename(startDate: string, endDate: string): string` — [assets-receivables-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/assets-receivables/assets-receivables-report-page.component.ts#L31)
- **Propósito / descripción:** `yyyy-MM-dd` → `dd-al-dd`/plain date, mirrors the backend's own filename logic exactly (`AssetsReceivablesReportController.buildExportFilename`).
- **Dependencias:** `new Date().toISOString().slice`, `new Date().toISOString`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-spec-ts"></a>

### bank-deposits-report-page.component.spec.ts

- **Ruta:** [bank-deposits-report-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.spec.ts`, 87 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [reports.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-reports-service-ts), [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts"></a>

### bank-deposits-report-page.component.ts

- **Ruta:** [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts`, 357 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Reportería de Transaccionar — simpler than Sales'/Purchases' report pages, same reasoning as `RechargesReportPageComponent`: each row already shows everything (no line items to drill into, no detail modal).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-service-ts), [guayacan-cash-sync.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-sync-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [reports.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-reports-service-ts), [transaction-bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-transaction-bank-service-ts), [transaction-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-transaction-type-service-ts), [user.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-user-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-blob-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [bank-deposit-detail-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-bank-deposit-detail-modal-bank-deposit-detail-modal-component-ts) y 1 más
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts), [bank-deposits-report-page.component.spec.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-spec-ts)
- **Plantilla:** [bank-deposits-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [transaction-monthly-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-transaction-monthly-chart-transaction-monthly-chart-component-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [bank-deposit-detail-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-bank-deposit-detail-modal-bank-deposit-detail-modal-component-ts), [void-confirm-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-void-confirm-modal-void-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="exportPdf()"`, `(click)="applyPreset('day')"`, `(click)="applyPreset('month')"`, `(click)="applyPreset('history')"`, `(ngModelChange)="draftSearch.set($event)"`, `(keyup.enter)="applyFilters()"`, `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(ngModelChange)="draftTransactionBankId.set($event)"`, `(ngModelChange)="draftTransactionTypeId.set($event)"`, `(ngModelChange)="draftUserId.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(click)="openDetail(row.id)"`, `(click)="openVoidModal(row.id)"`

**Interfaces, tipos y enums:**

- `interface FilterFieldsState` (L32): sin documentación — miembros: `startDate`, `endDate`, `transactionBankId`, `transactionTypeId`, `userId`, `search`
- `type ReportRangePreset` (L45) = `'day' \| 'month' \| 'history'` — Quick ranges: daily (today), monthly (current month) or historical (no date limit).

**Constantes exportadas:**

- `NO_DESCRIPTION_LABEL` (L42): Shown for operations registered before "Descripción / Beneficiario" existed — never invented. = `'Sin descripción registrada'`

#### Clase `BankDepositsReportPageComponent` (L84–356)

- **Decoradores:** `@Component({ selector: 'app-bank-deposits-report-page', standalone: true, imports: [ FormsModule, DatePipe, PageHeaderComponent, ButtonComponent, IconComponent, `
- **Propósito:** Reportería de Transaccionar — simpler than Sales'/Purchases' report pages, same reasoning as `RechargesReportPageComponent`: each row already shows everything (no line items to drill into, no detail modal). The one addition over the Recargas report's shape is the "por banco" breakdown, always shown below the main table (not behind a toggle) since it's a small, always-relevant summary rather than a genuinely separate view.
- **Servicios inyectados con `inject()`:** `reportsService = inject(ReportsService)`, `transactionBankService = inject(TransactionBankService)`, `transactionTypeService = inject(TransactionTypeService)`, `userService = inject(UserService)`, `bankDepositService = inject(BankDepositService)`, `notificationService = inject(NotificationService)`, `cashSync = inject(GuayacanCashSyncService)`
- **Datos / estado que administra:** `transactionBanks = signal<TransactionBank[]>([])`, `transactionTypes = signal<TransactionType[]>([])`, `users = signal<User[]>([])`, `draftStartDate = signal(firstDayOfMonthIsoDate())`, `draftEndDate = signal(todayIsoDate())`, `draftTransactionBankId = signal('')`, `draftTransactionTypeId = signal('')`, `draftUserId = signal('')`, `draftSearch = signal('')`, `startDate = signal(firstDayOfMonthIsoDate())`, `endDate = signal(todayIsoDate())`, `transactionBankId = signal('')`, `transactionTypeId = signal('')`, `userId = signal('')`, `search = signal('')`, `page = signal(1)`, `rows = signal<BankDepositOperationSummary[]>([])`, `total = signal(0)`, `summary = signal<BankDepositsReportSummary \| null>(null)`, `loadingTable = signal(false)`, `loadingSummary = signal(false)`, `exporting = signal(false)`, `selectedOperationId = signal<string \| null>(null)`, `isDetailOpen = signal(false)`, `isVoidModalOpen = signal(false)`, `isSavingVoid = signal(false)`, `hasActiveFilters = computed(() => { const defaults = defaultFilterFie`, `summaryTiles = computed<ReportSummaryTile[]>(() => { const s = th`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `applyFilters` | método public | 204–219 | — | `void` |
| `applyPreset` | método public | 222–227 | `preset: ReportRangePreset` | `void` |
| `clearFilters` | método public | 229–248 | — | `void` |
| `onPageChange` | método public | 250–253 | `page: number` | `void` |
| `exportPdf` | método public | 256–269 | — | `void` |
| `openDetail` | método public | 271–274 | `id: string` | `void` |
| `closeDetail` | método public | 276–278 | — | `void` |
| `openVoidModal` | método public | 280–283 | `id: string` | `void` |
| `cancelVoidModal` | método public | 285–290 | — | `void` |
| `confirmVoid` | método public | 292–312 | `reason: string` | `void` |
| `currentFilters` | método private | 314–325 | — | `BankDepositsReportFilters` |
| `fetchAll` | método private | 327–340 | — | `void` |
| `fetchTable` | método private | 342–355 | — | `void` |

##### `BankDepositsReportPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L204) (L204–219)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStartDate`, `this.draftEndDate`, `this.notificationService.error`, `this.startDate.set`, `this.endDate.set`, `this.transactionBankId.set`, `this.draftTransactionBankId`, `this.transactionTypeId.set`, `this.draftTransactionTypeId`, `this.userId.set`, `this.draftUserId`, `this.search.set`, `this.draftSearch().trim`, `this.draftSearch`, `this.page.set`, `this.fetchAll`
- **Efectos secundarios:** Actualiza estado (signals): `this.startDate.set`, `this.endDate.set`, `this.transactionBankId.set`, `this.transactionTypeId.set`, `this.userId.set`, `this.search.set`
- **Consumidores:** `bank-deposits-report-page.component.html` (plantilla), (mismo archivo)

##### `BankDepositsReportPageComponent.applyPreset`

- **Firma:** `applyPreset(preset: ReportRangePreset): void` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L222) (L222–227)
- **Propósito / descripción:** Daily / monthly / historical report: sets the date range and applies it with the other filters unchanged.
- **Dependencias (llamadas en su cuerpo):** `todayIsoDate`, `this.draftStartDate.set`, `firstDayOfMonthIsoDate`, `this.draftEndDate.set`, `this.applyFilters`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftStartDate.set`, `this.draftEndDate.set`
- **Consumidores:** `bank-deposits-report-page.component.html` (plantilla)

##### `BankDepositsReportPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L229) (L229–248)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `defaultFilterFields`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftTransactionBankId.set`, `this.draftTransactionTypeId.set`, `this.draftUserId.set`, `this.draftSearch.set`, `this.startDate.set`, `this.endDate.set`, `this.transactionBankId.set`, `this.transactionTypeId.set`, `this.userId.set`, `this.search.set`, `this.page.set`, `this.fetchAll`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftTransactionBankId.set`, `this.draftTransactionTypeId.set`, `this.draftUserId.set`, `this.draftSearch.set`
- **Consumidores:** `bank-deposits-report-page.component.html` (plantilla)

##### `BankDepositsReportPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L250) (L250–253)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `bank-deposits-report-page.component.html` (plantilla)

##### `BankDepositsReportPageComponent.exportPdf`

- **Firma:** `exportPdf(): void` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L256) (L256–269)
- **Propósito / descripción:** Always exports exactly the applied filters — never the draft form fields — so the PDF can never show different data than what's currently on screen.
- **Dependencias (llamadas en su cuerpo):** `this.exporting.set`, `this.reportsService.exportBankDepositsReportPdf(this.currentFilters()).subscribe`, `this.reportsService.exportBankDepositsReportPdf`, `this.currentFilters`, `downloadBlob`, `todayIsoDate`, `this.notificationService.success`, `this.notificationService.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.exporting.set`
- **Consumidores:** `bank-deposits-report-page.component.html` (plantilla)

##### `BankDepositsReportPageComponent.openDetail`

- **Firma:** `openDetail(id: string): void` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L271) (L271–274)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedOperationId.set`, `this.isDetailOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedOperationId.set`, `this.isDetailOpen.set`
- **Consumidores:** `bank-deposits-report-page.component.html` (plantilla)

##### `BankDepositsReportPageComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L276) (L276–278)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDetailOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDetailOpen.set`
- **Consumidores:** `bank-deposits-report-page.component.html` (plantilla)

##### `BankDepositsReportPageComponent.openVoidModal`

- **Firma:** `openVoidModal(id: string): void` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L280) (L280–283)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedOperationId.set`, `this.isVoidModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedOperationId.set`, `this.isVoidModalOpen.set`
- **Consumidores:** `bank-deposits-report-page.component.html` (plantilla)

##### `BankDepositsReportPageComponent.cancelVoidModal`

- **Firma:** `cancelVoidModal(): void` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L285) (L285–290)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSavingVoid`, `this.isVoidModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isVoidModalOpen.set`
- **Consumidores:** `bank-deposits-report-page.component.html` (plantilla)

##### `BankDepositsReportPageComponent.confirmVoid`

- **Firma:** `confirmVoid(reason: string): void` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L292) (L292–312)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedOperationId`, `this.isSavingVoid`, `this.isSavingVoid.set`, `this.bankDepositService.voidOperation(id, reason).subscribe`, `this.bankDepositService.voidOperation`, `this.isVoidModalOpen.set`, `this.notificationService.success`, `this.fetchAll`, `this.cashSync.notifyChanged`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSavingVoid.set`, `this.isVoidModalOpen.set`
- **Consumidores:** `bank-deposits-report-page.component.html` (plantilla)

##### `BankDepositsReportPageComponent.currentFilters`

- **Firma:** `currentFilters(): BankDepositsReportFilters` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L314) (L314–325)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.startDate`, `this.endDate`, `this.transactionBankId`, `this.transactionTypeId`, `this.userId`, `this.search`, `this.page`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `BankDepositsReportPageComponent.fetchAll`

- **Firma:** `fetchAll(): void` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L327) (L327–340)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingSummary.set`, `this.reportsService.getBankDepositsReportSummary(this.currentFilters()).subscribe`, `this.reportsService.getBankDepositsReportSummary`, `this.currentFilters`, `this.summary.set`, `this.notificationService.error`, `extractErrorMessage`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingSummary.set`, `this.summary.set`
- **Consumidores:** (mismo archivo)

##### `BankDepositsReportPageComponent.fetchTable`

- **Firma:** `fetchTable(): void` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L342) (L342–355)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingTable.set`, `this.reportsService.getBankDepositsReport(this.currentFilters()).subscribe`, `this.reportsService.getBankDepositsReport`, `this.currentFilters`, `this.rows.set`, `this.total.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingTable.set`, `this.rows.set`, `this.total.set`
- **Consumidores:** (mismo archivo)

#### Función `toIsoDate` (L48–53)

- **Tipo:** función local del archivo
- **Firma:** `toIsoDate(date: Date): string` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L48)
- **Propósito / descripción:** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique every other date-driven page in this app already uses.
- **Dependencias:** `date.getFullYear`, `String(date.getMonth() + 1).padStart`, `String`, `date.getMonth`, `String(date.getDate()).padStart`, `date.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `todayIsoDate` (L55–57)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L55)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `toIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `firstDayOfMonthIsoDate` (L60–63)

- **Tipo:** función local del archivo
- **Firma:** `firstDayOfMonthIsoDate(): string` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L60)
- **Propósito / descripción:** Same "current month" default as every other report page in this app.
- **Dependencias:** `new Date`, `toIsoDate`, `now.getFullYear`, `now.getMonth`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `defaultFilterFields` (L65–74)

- **Tipo:** función local del archivo
- **Firma:** `defaultFilterFields(): FilterFieldsState` — [bank-deposits-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts#L65)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `firstDayOfMonthIsoDate`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-bank-deposit-detail-modal-bank-deposit-detail-modal-component-ts"></a>

### bank-deposit-detail-modal.component.ts

- **Ruta:** [bank-deposit-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/bank-deposit-detail-modal/bank-deposit-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/bank-deposit-detail-modal/bank-deposit-detail-modal.component.ts`, 79 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** "Ver detalle" of one Transaccionar operation — the full shape (`GET /bank-deposits/:id`, cash breakdown + transaction rows), not the lighter listing shape both "Reporte de Transacciones" and "Gestión de Transacciones" already show.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [transaction-day-detail-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-transaction-day-detail-modal-transaction-day-detail-modal-component-ts), [bank-deposits-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts) (plantilla), [transaction-day-detail-modal.component.ts (plantilla)](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-transaction-day-detail-modal-transaction-day-detail-modal-component-ts) (plantilla)
- **Plantilla:** [bank-deposit-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/bank-deposit-detail-modal/bank-deposit-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="onClose()"`

#### Clase `BankDepositDetailModalComponent` (L31–78)

- **Decoradores:** `@Component({ selector: 'app-bank-deposit-detail-modal', standalone: true, imports: [DatePipe, ButtonComponent, IconComponent], templateUrl: './bank-deposit-detai`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Ver detalle" of one Transaccionar operation — the full shape (`GET /bank-deposits/:id`, cash breakdown + transaction rows), not the lighter listing shape both "Reporte de Transacciones" and "Gestión de Transacciones" already show. Shared by both screens (imported directly, not duplicated) because the need is genuinely identical in both places — same reasoning `SalePricingBarComponent` reuses `ClientSearchSelectComponent` for, unlike the small per-feature copies this codebase otherwise prefers when the content actually diverges.
- **Servicios inyectados con `inject()`:** `bankDepositService = inject(BankDepositService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input operationId = null`, `@Output closed = new EventEmitter<void>()`, `operation = signal<BankDepositOperation \| null>(null)`, `loading = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 53–57 | `changes: SimpleChanges` | `void` |
| `onClose` | método public | 59–61 | — | `void` |
| `fetch` | método private | 63–77 | `id: string` | `void` |

##### `BankDepositDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [bank-deposit-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/bank-deposit-detail-modal/bank-deposit-detail-modal.component.ts#L53) (L53–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.fetch`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositDetailModalComponent.onClose`

- **Firma:** `onClose(): void` — [bank-deposit-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/bank-deposit-detail-modal/bank-deposit-detail-modal.component.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `bank-deposit-detail-modal.component.html` (plantilla)

##### `BankDepositDetailModalComponent.fetch`

- **Firma:** `fetch(id: string): void` — [bank-deposit-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/bank-deposit-detail-modal/bank-deposit-detail-modal.component.ts#L63) (L63–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.operation.set`, `this.bankDepositService.getOperationById(id).subscribe`, `this.bankDepositService.getOperationById`, `this.notificationService.error`, `extractErrorMessage`, `this.closed.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.operation.set`; Emite eventos: `this.closed.emit`
- **Consumidores:** [transaction-day-detail-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-transaction-day-detail-modal-transaction-day-detail-modal-component-ts), [transaction-day-detail-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-transaction-day-detail-modal-transaction-day-detail-modal-component-ts), (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-void-confirm-modal-void-confirm-modal-component-ts"></a>

### void-confirm-modal.component.ts

- **Ruta:** [void-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/void-confirm-modal/void-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/void-confirm-modal/void-confirm-modal.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** "Anular transacción" — dumb, same pattern as "Gestión de Transacciones"' own reopen/cancel confirm modals: the parent owns the actual `BankDepositService.voidOperation` call.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts), [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts), [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts), [bank-transfers-page.component.ts (plantilla)](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts) (plantilla), [balance-credit.component.ts (plantilla)](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts) (plantilla), [bank-deposits-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts) (plantilla), [bank-transfers-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts) (plantilla)
- **Plantilla:** [void-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/void-confirm-modal/void-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(ngModelChange)="reason.set($event)"`, `(click)="onCancel()"`, `(click)="onConfirm()"`

#### Clase `VoidConfirmModalComponent` (L15–59)

- **Decoradores:** `@Component({ selector: 'app-void-confirm-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './void-confirm-modal.com`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Anular transacción" — dumb, same pattern as "Gestión de Transacciones"' own reopen/cancel confirm modals: the parent owns the actual `BankDepositService.voidOperation` call. Copy is explicit that this is never a delete/edit — the operation stays in the historial forever, only marked, and excluded from the report's own totals.
- **Datos / estado que administra:** `@Input open = false`, `@Input isSaving = false`, `@Input title = 'Anular Transacción'`, `@Input description = null`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 35–39 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 41–43 | — | `boolean` |
| `onCancel` | método public | 45–51 | — | `void` |
| `onConfirm` | método public | 53–58 | — | `void` |

##### `VoidConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [void-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/void-confirm-modal/void-confirm-modal.component.ts#L35) (L35–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `VoidConfirmModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [void-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/void-confirm-modal/void-confirm-modal.component.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `VoidConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [void-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/void-confirm-modal/void-confirm-modal.component.ts#L45) (L45–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `void-confirm-modal.component.html` (plantilla)

##### `VoidConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [void-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/components/void-confirm-modal/void-confirm-modal.component.ts#L53) (L53–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `void-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts"></a>

### bank-movements-report-page.component.ts

- **Ruta:** [bank-movements-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-movements/bank-movements-report-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/bank-movements/bank-movements-report-page.component.ts`, 187 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Reportería → Movimientos Bancarios (admin).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [reports.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-reports-service-ts), [user.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-user-service-ts), [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-blob-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [bank-movements-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-movements/bank-movements-report-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [bank-balance-amount.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="exportPdf()"`, `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(ngModelChange)="draftBankId.set($event)"`, `(ngModelChange)="draftMovementType.set($event)"`, `(ngModelChange)="draftUserId.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(pageChange)="onPageChange($event)"`

#### Clase `BankMovementsReportPageComponent` (L48–186)

- **Decoradores:** `@Component({ selector: 'app-bank-movements-report-page', standalone: true, imports: [ FormsModule, DatePipe, PageHeaderComponent, ButtonComponent, IconComponent,`
- **Propósito:** Reportería → Movimientos Bancarios (admin). El historial completo del ledger de saldos: cada depósito, retiro, desembolso/pago Génesis, reintegro, transferencia, ajuste manual y anulación, con saldo anterior y posterior. Nada se calcula aquí — todo viene del backend. Mismo layout (filtros aplicados vs. borrador, paginación, PDF) que el Reporte de Transacciones.
- **Servicios inyectados con `inject()`:** `reportsService = inject(ReportsService)`, `bankService = inject(BankService)`, `userService = inject(UserService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `accounts = signal<Bank[]>([])`, `users = signal<User[]>([])`, `draftStartDate = signal(firstDayOfMonthIsoDate())`, `draftEndDate = signal(todayIsoDate())`, `draftBankId = signal('')`, `draftMovementType = signal('')`, `draftUserId = signal('')`, `applied = signal<BankMovementsFilters>({ startDate: firstDay`, `page = signal(1)`, `rows = signal<BankMovement[]>([])`, `total = signal(0)`, `loading = signal(false)`, `exporting = signal(false)`, `hasActiveFilters = computed(() => { const filters = this.applied(); r`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `signedAmount` | método public | 120–122 | `value: number` | `string` |
| `applyFilters` | método public | 124–138 | — | `void` |
| `clearFilters` | método public | 140–147 | — | `void` |
| `onPageChange` | método public | 149–152 | `page: number` | `void` |
| `exportPdf` | método public | 154–170 | — | `void` |
| `fetch` | método private | 172–185 | — | `void` |

##### `BankMovementsReportPageComponent.signedAmount`

- **Firma:** `signedAmount(value: number): string` — [bank-movements-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-movements/bank-movements-report-page.component.ts#L120) (L120–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `formatSignedBankBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `bank-movements-report-page.component.html` (plantilla)

##### `BankMovementsReportPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [bank-movements-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-movements/bank-movements-report-page.component.ts#L124) (L124–138)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStartDate`, `this.draftEndDate`, `this.notificationService.error`, `this.applied.set`, `this.draftBankId`, `this.draftMovementType`, `this.draftUserId`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.applied.set`, `this.page.set`
- **Consumidores:** `bank-movements-report-page.component.html` (plantilla), (mismo archivo)

##### `BankMovementsReportPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [bank-movements-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-movements/bank-movements-report-page.component.ts#L140) (L140–147)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStartDate.set`, `firstDayOfMonthIsoDate`, `this.draftEndDate.set`, `todayIsoDate`, `this.draftBankId.set`, `this.draftMovementType.set`, `this.draftUserId.set`, `this.applyFilters`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftBankId.set`, `this.draftMovementType.set`, `this.draftUserId.set`
- **Consumidores:** `bank-movements-report-page.component.html` (plantilla)

##### `BankMovementsReportPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [bank-movements-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-movements/bank-movements-report-page.component.ts#L149) (L149–152)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `bank-movements-report-page.component.html` (plantilla)

##### `BankMovementsReportPageComponent.exportPdf`

- **Firma:** `exportPdf(): void` — [bank-movements-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-movements/bank-movements-report-page.component.ts#L154) (L154–170)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.exporting`, `this.exporting.set`, `this.reportsService.exportBankMovementsReportPdf(this.applied()).subscribe`, `this.reportsService.exportBankMovementsReportPdf`, `this.applied`, `downloadBlob`, `todayIsoDate`, `this.notificationService.success`, `this.notificationService.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.exporting.set`
- **Consumidores:** `bank-movements-report-page.component.html` (plantilla)

##### `BankMovementsReportPageComponent.fetch`

- **Firma:** `fetch(): void` — [bank-movements-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-movements/bank-movements-report-page.component.ts#L172) (L172–185)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.reportsService.getBankMovementsReport`, `this.applied`, `this.page`, `this.rows.set`, `this.total.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.rows.set`, `this.total.set`
- **Consumidores:** (mismo archivo)

#### Función `todayIsoDate` (L28–31)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [bank-movements-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-movements/bank-movements-report-page.component.ts#L28)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `firstDayOfMonthIsoDate` (L33–36)

- **Tipo:** función local del archivo
- **Firma:** `firstDayOfMonthIsoDate(): string` — [bank-movements-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-movements/bank-movements-report-page.component.ts#L33)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts"></a>

### bank-transfers-report-page.component.ts

- **Ruta:** [bank-transfers-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts`, 283 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Reportería → Reporte de Transferencias (admin).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [bank-transfer.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-transfer-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [reports.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-reports-service-ts), [user.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-user-service-ts), [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-blob-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [void-confirm-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-void-confirm-modal-void-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [bank-transfers-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [void-confirm-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-void-confirm-modal-void-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="exportPdf()"`, `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(ngModelChange)="draftSourceBankId.set($event)"`, `(ngModelChange)="draftDestinationBankId.set($event)"`, `(ngModelChange)="draftUserId.set($event)"`, `(ngModelChange)="draftStatus.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(click)="openVoid(row)"`, `(pageChange)="onPageChange($event)"`, `(confirmed)="confirmVoid($event)"`, `(cancelled)="cancelVoid()"`

#### Clase `BankTransfersReportPageComponent` (L52–282)

- **Decoradores:** `@Component({ selector: 'app-bank-transfers-report-page', standalone: true, imports: [ FormsModule, DatePipe, PageHeaderComponent, ButtonComponent, IconComponent,`
- **Propósito:** Reportería → Reporte de Transferencias (admin). Mismo patrón que el Reporte de Transacciones: filtros en borrador que solo se aplican con "Aplicar filtros" (así el PDF siempre coincide con lo que se ve), resumen en tarjetas, tabla paginada, desglose por ruta origen → destino y anulación (movimientos inversos, nunca borrado). Todo el cálculo vive en el backend.
- **Servicios inyectados con `inject()`:** `reportsService = inject(ReportsService)`, `bankService = inject(BankService)`, `bankTransferService = inject(BankTransferService)`, `userService = inject(UserService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `accounts = signal<Bank[]>([])`, `users = signal<User[]>([])`, `draftStartDate = signal(firstDayOfMonthIsoDate())`, `draftEndDate = signal(todayIsoDate())`, `draftSourceBankId = signal('')`, `draftDestinationBankId = signal('')`, `draftUserId = signal('')`, `draftStatus = signal('')`, `applied = signal<BankTransfersReportFilters>({ startDate: fi`, `page = signal(1)`, `rows = signal<BankTransfer[]>([])`, `total = signal(0)`, `summary = signal<BankTransfersSummary \| null>(null)`, `loadingTable = signal(false)`, `loadingSummary = signal(false)`, `exporting = signal(false)`, `voidingTransferId = signal<string \| null>(null)`, `isVoiding = signal(false)`, `hasActiveFilters = computed(() => { const f = this.applied(); return `, `summaryTiles = computed<ReportSummaryTile[]>(() => { const s = th`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `applyFilters` | método public | 164–183 | — | `void` |
| `clearFilters` | método public | 185–193 | — | `void` |
| `onPageChange` | método public | 195–198 | `page: number` | `void` |
| `exportPdf` | método public | 201–217 | — | `void` |
| `openVoid` | método public | 219–224 | `transfer: BankTransfer` | `void` |
| `cancelVoid` | método public | 226–231 | — | `void` |
| `confirmVoid` | método public | 233–251 | `reason: string` | `void` |
| `fetchAll` | método private | 253–266 | — | `void` |
| `fetchTable` | método private | 268–281 | — | `void` |

##### `BankTransfersReportPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [bank-transfers-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts#L164) (L164–183)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStartDate`, `this.draftEndDate`, `this.notificationService.error`, `this.applied.set`, `this.draftSourceBankId`, `this.draftDestinationBankId`, `this.draftUserId`, `this.draftStatus`, `this.page.set`, `this.fetchAll`
- **Efectos secundarios:** Actualiza estado (signals): `this.applied.set`, `this.page.set`
- **Consumidores:** `bank-transfers-report-page.component.html` (plantilla), (mismo archivo)

##### `BankTransfersReportPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [bank-transfers-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts#L185) (L185–193)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStartDate.set`, `firstDayOfMonthIsoDate`, `this.draftEndDate.set`, `todayIsoDate`, `this.draftSourceBankId.set`, `this.draftDestinationBankId.set`, `this.draftUserId.set`, `this.draftStatus.set`, `this.applyFilters`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftSourceBankId.set`, `this.draftDestinationBankId.set`, `this.draftUserId.set`, `this.draftStatus.set`
- **Consumidores:** `bank-transfers-report-page.component.html` (plantilla)

##### `BankTransfersReportPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [bank-transfers-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts#L195) (L195–198)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `bank-transfers-report-page.component.html` (plantilla)

##### `BankTransfersReportPageComponent.exportPdf`

- **Firma:** `exportPdf(): void` — [bank-transfers-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts#L201) (L201–217)
- **Propósito / descripción:** Exporta exactamente los filtros aplicados (nunca el borrador), igual que el resto de la Reportería.
- **Dependencias (llamadas en su cuerpo):** `this.exporting`, `this.exporting.set`, `this.reportsService.exportBankTransfersReportPdf(this.applied()).subscribe`, `this.reportsService.exportBankTransfersReportPdf`, `this.applied`, `downloadBlob`, `todayIsoDate`, `this.notificationService.success`, `this.notificationService.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.exporting.set`
- **Consumidores:** `bank-transfers-report-page.component.html` (plantilla)

##### `BankTransfersReportPageComponent.openVoid`

- **Firma:** `openVoid(transfer: BankTransfer): void` — [bank-transfers-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts#L219) (L219–224)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidingTransferId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidingTransferId.set`
- **Consumidores:** `bank-transfers-report-page.component.html` (plantilla)

##### `BankTransfersReportPageComponent.cancelVoid`

- **Firma:** `cancelVoid(): void` — [bank-transfers-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts#L226) (L226–231)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isVoiding`, `this.voidingTransferId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidingTransferId.set`
- **Consumidores:** `bank-transfers-report-page.component.html` (plantilla)

##### `BankTransfersReportPageComponent.confirmVoid`

- **Firma:** `confirmVoid(reason: string): void` — [bank-transfers-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts#L233) (L233–251)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidingTransferId`, `this.isVoiding`, `this.isVoiding.set`, `this.bankTransferService.voidTransfer(id, reason).subscribe`, `this.bankTransferService.voidTransfer`, `this.voidingTransferId.set`, `this.notificationService.success`, `this.fetchAll`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isVoiding.set`, `this.voidingTransferId.set`
- **Consumidores:** `bank-transfers-report-page.component.html` (plantilla)

##### `BankTransfersReportPageComponent.fetchAll`

- **Firma:** `fetchAll(): void` — [bank-transfers-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts#L253) (L253–266)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingSummary.set`, `this.reportsService.getBankTransfersReportSummary(this.applied()).subscribe`, `this.reportsService.getBankTransfersReportSummary`, `this.applied`, `this.summary.set`, `this.notificationService.error`, `extractErrorMessage`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingSummary.set`, `this.summary.set`
- **Consumidores:** (mismo archivo)

##### `BankTransfersReportPageComponent.fetchTable`

- **Firma:** `fetchTable(): void` — [bank-transfers-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts#L268) (L268–281)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingTable.set`, `this.reportsService.getBankTransfersReport`, `this.applied`, `this.page`, `this.rows.set`, `this.total.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingTable.set`, `this.rows.set`, `this.total.set`
- **Consumidores:** (mismo archivo)

#### Función `todayIsoDate` (L29–32)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [bank-transfers-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts#L29)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `firstDayOfMonthIsoDate` (L34–37)

- **Tipo:** función local del archivo
- **Firma:** `firstDayOfMonthIsoDate(): string` — [bank-transfers-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts#L34)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-components-client-filter-search-client-filter-search-component-ts"></a>

### client-filter-search.component.ts

- **Ruta:** [client-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/client-filter-search/client-filter-search.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/components/client-filter-search/client-filter-search.component.ts`, 102 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** A near-copy of this same folder's `ProductFilterSearchComponent`, adapted for clients.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [client.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-client-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [assets-receivables-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts), [assets-receivables-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts) (plantilla)
- **Plantilla:** [client-filter-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/client-filter-search/client-filter-search.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clear()"`, `(ngModelChange)="onInput($event)"`, `(focus)="onFocus()"`, `(blur)="onBlur()"`, `(click)="select(client)"`

#### Clase `ClientFilterSearchComponent` (L22–101)

- **Decoradores:** `@Component({ selector: 'app-report-client-filter', standalone: true, imports: [FormsModule, IconComponent], templateUrl: './client-filter-search.component.html',`
- **Propósito:** A near-copy of this same folder's `ProductFilterSearchComponent`, adapted for clients. The dropdown's base list (empty query) is the full active-clients list, fetched once; once the user types, matching is delegated to the backend's accent/case-insensitive `search_normalize()`- based `search` param (debounced), never a `.toLowerCase().includes()` filter in JS — see `ClientService.getClients`. Shared by both the Cuentas por Cobrar and Activos reports (same reasoning `ProductFilterSearchComponent` is already shared by Sales'/Purchases' own reports), rather than duplicated a third/fourth time — it has no report-specific logic baked in.
- **Servicios inyectados con `inject()`:** `clientService = inject(ClientService)`
- **Datos / estado que administra:** `@Input selectedClient = null`, `@Output selectionChange = new EventEmitter<Client \| null>()`, `clients = signal<Client[]>([])`, `clientsLoaded = signal(false)`, `searchResults = signal<Client[] \| null>(null)`, `query = signal('')`, `open = signal(false)`, `loading = computed(() => !this.clientsLoaded())`, `filteredClients = computed(() => { const term = this.query().trim();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onInput` | método public | 73–80 | `value: string` | `void` |
| `onFocus` | método public | 82–84 | — | `void` |
| `onBlur` | método public | 86–88 | — | `void` |
| `select` | método public | 90–95 | `client: Client` | `void` |
| `clear` | método public | 97–100 | — | `void` |

##### `ClientFilterSearchComponent.onInput`

- **Firma:** `onInput(value: string): void` — [client-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/client-filter-search/client-filter-search.component.ts#L73) (L73–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.open.set`, `value.trim`, `this.searchResults.set`, `this.query$.next`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.open.set`, `this.searchResults.set`
- **Consumidores:** `client-filter-search.component.html` (plantilla)

##### `ClientFilterSearchComponent.onFocus`

- **Firma:** `onFocus(): void` — [client-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/client-filter-search/client-filter-search.component.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `client-filter-search.component.html` (plantilla)

##### `ClientFilterSearchComponent.onBlur`

- **Firma:** `onBlur(): void` — [client-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/client-filter-search/client-filter-search.component.ts#L86) (L86–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `setTimeout`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `client-filter-search.component.html` (plantilla)

##### `ClientFilterSearchComponent.select`

- **Firma:** `select(client: Client): void` — [client-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/client-filter-search/client-filter-search.component.ts#L90) (L90–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectionChange.emit`, `this.query.set`, `this.searchResults.set`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.searchResults.set`, `this.open.set`; Emite eventos: `this.selectionChange.emit`
- **Consumidores:** `client-filter-search.component.html` (plantilla)

##### `ClientFilterSearchComponent.clear`

- **Firma:** `clear(): void` — [client-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/client-filter-search/client-filter-search.component.ts#L97) (L97–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectionChange.emit`, `this.searchResults.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchResults.set`; Emite eventos: `this.selectionChange.emit`
- **Consumidores:** `client-filter-search.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-components-ice-cream-filter-search-ice-cream-filter-search-component-ts"></a>

### ice-cream-filter-search.component.ts

- **Ruta:** [ice-cream-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/ice-cream-filter-search/ice-cream-filter-search.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/components/ice-cream-filter-search/ice-cream-filter-search.component.ts`, 94 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** A near-copy of this same folder's `ProductFilterSearchComponent`, adapted for helados: server-side search via `IceCreamService.searchIceCreams()` (the same live-search endpoint the operational Heladería · Compras/Ventas screens already use), with the persistent "selected" chip + clear button pattern a *filter* needs (vs.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [ice-cream.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [ice-cream-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts), [ice-cream-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts) (plantilla)
- **Plantilla:** [ice-cream-filter-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/ice-cream-filter-search/ice-cream-filter-search.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clear()"`, `(ngModelChange)="onInput($event)"`, `(focus)="onFocus()"`, `(blur)="onBlur()"`, `(click)="select(iceCream)"`

#### Clase `IceCreamFilterSearchComponent` (L17–93)

- **Decoradores:** `@Component({ selector: 'app-report-ice-cream-filter', standalone: true, imports: [FormsModule, IconComponent], templateUrl: './ice-cream-filter-search.component.`
- **Propósito:** A near-copy of this same folder's `ProductFilterSearchComponent`, adapted for helados: server-side search via `IceCreamService.searchIceCreams()` (the same live-search endpoint the operational Heladería · Compras/Ventas screens already use), with the persistent "selected" chip + clear button pattern a *filter* needs (vs. an "add to receipt" action).
- **Servicios inyectados con `inject()`:** `iceCreamService = inject(IceCreamService)`
- **Datos / estado que administra:** `@Input selectedIceCream = null`, `@Output selectionChange = new EventEmitter<IceCream \| null>()`, `query = signal('')`, `results = signal<IceCream[]>([])`, `loading = signal(false)`, `open = signal(false)`, `hasSearched = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onInput` | método public | 62–70 | `value: string` | `void` |
| `onFocus` | método public | 72–76 | — | `void` |
| `onBlur` | método public | 78–80 | — | `void` |
| `select` | método public | 82–88 | `iceCream: IceCream` | `void` |
| `clear` | método public | 90–92 | — | `void` |

##### `IceCreamFilterSearchComponent.onInput`

- **Firma:** `onInput(value: string): void` — [ice-cream-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/ice-cream-filter-search/ice-cream-filter-search.component.ts#L62) (L62–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.open.set`, `this.query$.next`, `value.trim`, `this.results.set`, `this.hasSearched.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.open.set`, `this.results.set`, `this.hasSearched.set`
- **Consumidores:** `ice-cream-filter-search.component.html` (plantilla)

##### `IceCreamFilterSearchComponent.onFocus`

- **Firma:** `onFocus(): void` — [ice-cream-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/ice-cream-filter-search/ice-cream-filter-search.component.ts#L72) (L72–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results`, `this.hasSearched`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `ice-cream-filter-search.component.html` (plantilla)

##### `IceCreamFilterSearchComponent.onBlur`

- **Firma:** `onBlur(): void` — [ice-cream-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/ice-cream-filter-search/ice-cream-filter-search.component.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `setTimeout`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `ice-cream-filter-search.component.html` (plantilla)

##### `IceCreamFilterSearchComponent.select`

- **Firma:** `select(iceCream: IceCream): void` — [ice-cream-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/ice-cream-filter-search/ice-cream-filter-search.component.ts#L82) (L82–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectionChange.emit`, `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`; Emite eventos: `this.selectionChange.emit`
- **Consumidores:** `ice-cream-filter-search.component.html` (plantilla)

##### `IceCreamFilterSearchComponent.clear`

- **Firma:** `clear(): void` — [ice-cream-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/ice-cream-filter-search/ice-cream-filter-search.component.ts#L90) (L90–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectionChange.emit`
- **Efectos secundarios:** Emite eventos: `this.selectionChange.emit`
- **Consumidores:** `ice-cream-filter-search.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-components-product-filter-search-product-filter-search-component-ts"></a>

### product-filter-search.component.ts

- **Ruta:** [product-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/product-filter-search/product-filter-search.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/components/product-filter-search/product-filter-search.component.ts`, 94 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** A near-copy of Ventas'/Compras' own product-search dropdowns, adapted for a *filter* rather than an "add to receipt" action: no out-of-stock disabling (a report can reasonably filter by a product that's since sold out), and a persistent "selected" chip replaces the search box until cleared, since a filter selection sticks around instead of firing once.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [inventory.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts), [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts), [purchases-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts) (plantilla), [sales-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts) (plantilla)
- **Plantilla:** [product-filter-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/product-filter-search/product-filter-search.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clear()"`, `(ngModelChange)="onInput($event)"`, `(focus)="onFocus()"`, `(blur)="onBlur()"`, `(click)="select(product)"`

#### Clase `ProductFilterSearchComponent` (L17–93)

- **Decoradores:** `@Component({ selector: 'app-report-product-filter', standalone: true, imports: [FormsModule, IconComponent], templateUrl: './product-filter-search.component.html`
- **Propósito:** A near-copy of Ventas'/Compras' own product-search dropdowns, adapted for a *filter* rather than an "add to receipt" action: no out-of-stock disabling (a report can reasonably filter by a product that's since sold out), and a persistent "selected" chip replaces the search box until cleared, since a filter selection sticks around instead of firing once.
- **Servicios inyectados con `inject()`:** `inventoryService = inject(InventoryService)`
- **Datos / estado que administra:** `@Input selectedProduct = null`, `@Output selectionChange = new EventEmitter<Product \| null>()`, `query = signal('')`, `results = signal<Product[]>([])`, `loading = signal(false)`, `open = signal(false)`, `hasSearched = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onInput` | método public | 62–70 | `value: string` | `void` |
| `onFocus` | método public | 72–76 | — | `void` |
| `onBlur` | método public | 78–80 | — | `void` |
| `select` | método public | 82–88 | `product: Product` | `void` |
| `clear` | método public | 90–92 | — | `void` |

##### `ProductFilterSearchComponent.onInput`

- **Firma:** `onInput(value: string): void` — [product-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/product-filter-search/product-filter-search.component.ts#L62) (L62–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.open.set`, `this.query$.next`, `value.trim`, `this.results.set`, `this.hasSearched.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.open.set`, `this.results.set`, `this.hasSearched.set`
- **Consumidores:** `product-filter-search.component.html` (plantilla)

##### `ProductFilterSearchComponent.onFocus`

- **Firma:** `onFocus(): void` — [product-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/product-filter-search/product-filter-search.component.ts#L72) (L72–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results`, `this.hasSearched`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `product-filter-search.component.html` (plantilla)

##### `ProductFilterSearchComponent.onBlur`

- **Firma:** `onBlur(): void` — [product-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/product-filter-search/product-filter-search.component.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `setTimeout`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `product-filter-search.component.html` (plantilla)

##### `ProductFilterSearchComponent.select`

- **Firma:** `select(product: Product): void` — [product-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/product-filter-search/product-filter-search.component.ts#L82) (L82–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectionChange.emit`, `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`; Emite eventos: `this.selectionChange.emit`
- **Consumidores:** `product-filter-search.component.html` (plantilla)

##### `ProductFilterSearchComponent.clear`

- **Firma:** `clear(): void` — [product-filter-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/product-filter-search/product-filter-search.component.ts#L90) (L90–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectionChange.emit`
- **Efectos secundarios:** Emite eventos: `this.selectionChange.emit`
- **Consumidores:** `product-filter-search.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts"></a>

### report-pagination.component.ts

- **Ruta:** [report-pagination.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/report-pagination/report-pagination.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/components/report-pagination/report-pagination.component.ts`, 52 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Generic page-N-of-M control — no existing pagination component in this app to reuse (checked first), so this is the one place both reports (and any future paginated screen) can share.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-counts-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-counts-panel-cash-counts-panel-component-ts), [cut-history.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-history-cut-history-component-ts), [warehouse-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts), [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts), [guayacan-cash-counts-page.component.ts](dashboard-guayacan-cash-counts.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-ts), [purchases-admin-page.component.ts](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-purchases-admin-page-component-ts), [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts), [cash-box-history.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-history-cash-box-history-component-ts), [recharges-sim-sales-admin-page.component.ts](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-recharges-sim-sales-admin-page-component-ts), [agent-reconciliations-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-agent-reconciliations-agent-reconciliations-report-page-component-ts), [assets-receivables-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts), [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts) y 31 más
- **Plantilla:** [report-pagination.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/report-pagination/report-pagination.component.html) · **Usa componentes:** [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="previous()"`, `(click)="next()"`

#### Clase `ReportPaginationComponent` (L6–51)

- **Decoradores:** `@Component({ selector: 'app-report-pagination', standalone: true, imports: [ButtonComponent], templateUrl: './report-pagination.component.html', styleUrl: './rep`
- **Propósito:** Generic page-N-of-M control — no existing pagination component in this app to reuse (checked first), so this is the one place both reports (and any future paginated screen) can share.
- **Datos / estado que administra:** `totalSignal = signal(0)`, `pageSignal = signal(1)`, `limitSignal = signal(20)`, `@Output pageChange = new EventEmitter<number>()`, `totalPages = computed(() => Math.max(1, Math.ceil(this.totalSig`, `currentPage = computed(() => this.pageSignal())`, `hasItems = computed(() => this.totalSignal() > 0)`, `canGoPrevious = computed(() => this.currentPage() > 1)`, `canGoNext = computed(() => this.currentPage() < this.totalPage`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `total` | setter public | 19–22 | `value: number` | (inferido) |
| `page` | setter public | 23–26 | `value: number` | (inferido) |
| `limit` | setter public | 27–30 | `value: number` | (inferido) |
| `previous` | método public | 40–44 | — | `void` |
| `next` | método public | 46–50 | — | `void` |

##### `ReportPaginationComponent.total`

- **Firma:** `total(value: number)` — [report-pagination.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/report-pagination/report-pagination.component.ts#L19) (L19–22)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.totalSignal.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.totalSignal.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ReportPaginationComponent.page`

- **Firma:** `page(value: number)` — [report-pagination.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/report-pagination/report-pagination.component.ts#L23) (L23–26)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.pageSignal.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.pageSignal.set`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-counts-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-counts-panel-cash-counts-panel-component-ts), [cut-history.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-history-cut-history-component-ts), [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts), [guayacan-cash-counts-page.component.ts](dashboard-guayacan-cash-counts.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-ts), [purchases-admin-page.component.ts](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-purchases-admin-page-component-ts), [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts), [cash-box-history.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-history-cash-box-history-component-ts)

##### `ReportPaginationComponent.limit`

- **Firma:** `limit(value: number)` — [report-pagination.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/report-pagination/report-pagination.component.ts#L27) (L27–30)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.limitSignal.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.limitSignal.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ReportPaginationComponent.previous`

- **Firma:** `previous(): void` — [report-pagination.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/report-pagination/report-pagination.component.ts#L40) (L40–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canGoPrevious`, `this.pageChange.emit`, `this.currentPage`
- **Efectos secundarios:** Emite eventos: `this.pageChange.emit`
- **Consumidores:** `report-pagination.component.html` (plantilla)

##### `ReportPaginationComponent.next`

- **Firma:** `next(): void` — [report-pagination.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/report-pagination/report-pagination.component.ts#L46) (L46–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canGoNext`, `this.pageChange.emit`, `this.currentPage`
- **Efectos secundarios:** Emite eventos: `this.pageChange.emit`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), `report-pagination.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts"></a>

### report-summary.component.ts

- **Ruta:** [report-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/report-summary/report-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/components/report-summary/report-summary.component.ts`, 26 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Generic KPI-tile row shared by both reports — same `app-card` grid shape every other summary in this app already uses (Suppliers, Inventory, Categories...).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [agent-reconciliations-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-agent-reconciliations-agent-reconciliations-report-page-component-ts), [assets-receivables-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts), [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts), [ice-cream-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts), [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts), [recharges-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-recharges-recharges-report-page-component-ts), [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts), [sales-register-page.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-sales-register-page-component-ts), [agent-reconciliations-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-agent-reconciliations-agent-reconciliations-report-page-component-ts) (plantilla), [assets-receivables-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts) (plantilla), [bank-deposits-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts) (plantilla), [bank-transfers-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts) (plantilla), [ice-cream-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts) (plantilla), [purchases-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts) (plantilla) y 3 más
- **Plantilla:** [report-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/components/report-summary/report-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface ReportSummaryTile` (L5): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `ReportSummaryComponent` (L14–25)

- **Decoradores:** `@Component({ selector: 'app-report-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './report-summary.component.html', st`
- **Propósito:** Generic KPI-tile row shared by both reports — same `app-card` grid shape every other summary in this app already uses (Suppliers, Inventory, Categories...).
- **Datos / estado que administra:** `@Input tiles = []`, `@Input loading = false`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts"></a>

### ice-cream-report-page.component.ts

- **Ruta:** [ice-cream-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts`, 260 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Unified Reportería de Heladería — replaces the former separate Ventas/ Compras de Heladería reports (both removed).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [ice-cream-report-state.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-report-state-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [reports.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-reports-service-ts), [user.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-user-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-blob-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [ice-cream-filter-search.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-ice-cream-filter-search-ice-cream-filter-search-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [ice-cream-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [ice-cream-filter-search.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-ice-cream-filter-search-ice-cream-filter-search-component-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="exportPdf()"`, `(ngModelChange)="state.draftIncludeSales.set($event)"`, `(ngModelChange)="state.draftIncludePurchases.set($event)"`, `(selectionChange)="onDraftIceCreamChange($event)"`, `(ngModelChange)="onDraftUserChange($event)"`, `(ngModelChange)="state.draftStartDate.set($event)"`, `(ngModelChange)="state.draftEndDate.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(pageChange)="onPageChange($event)"`

#### Clase `IceCreamReportPageComponent` (L40–259)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-report-page', standalone: true, imports: [ FormsModule, DatePipe, PageHeaderComponent, ButtonComponent, IconComponent, Repo`
- **Propósito:** Unified Reportería de Heladería — replaces the former separate Ventas/ Compras de Heladería reports (both removed). State lives in `IceCreamReportStateService` (root-provided singleton), same survives-navigation reasoning as `AssetsReceivablesReportPageComponent` (see that page's own doc comment) — this page mirrors it structurally.
- **Servicios inyectados con `inject()`:** `reportsService = inject(ReportsService)`, `userService = inject(UserService)`, `notificationService = inject(NotificationService)`, `state = inject(IceCreamReportStateService)`
- **Datos / estado que administra:** `users = signal<User[]>([])`, `showTypeColumn = computed(() => this.state.includeSales() && this.s`, `hasActiveFilters = computed( () => !this.state.includeSales() \|\| !thi`, `summaryTiles = computed<ReportSummaryTile[]>(() => { const s = th`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `typeLabel` | método public | 121–123 | `type: IceCreamReportType` | `string` |
| `onDraftIceCreamChange` | método public | 136–138 | `iceCream: IceCream \| null` | `void` |
| `onDraftUserChange` | método public | 140–142 | `userId: string` | `void` |
| `applyFilters` | método public | 144–167 | — | `void` |
| `clearFilters` | método public | 169–186 | — | `void` |
| `onPageChange` | método public | 188–191 | `page: number` | `void` |
| `exportPdf` | método public | 193–206 | — | `void` |
| `currentFilters` | método private | 208–222 | — | `IceCreamReportFilters` |
| `runQuery` | método private | 224–243 | — | `void` |
| `fetchTable` | método private | 245–258 | — | `void` |

##### `IceCreamReportPageComponent.typeLabel`

- **Firma:** `typeLabel(type: IceCreamReportType): string` — [ice-cream-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts#L121) (L121–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-report-page.component.html` (plantilla)

##### `IceCreamReportPageComponent.onDraftIceCreamChange`

- **Firma:** `onDraftIceCreamChange(iceCream: IceCream \| null): void` — [ice-cream-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts#L136) (L136–138)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.draftIceCream.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.draftIceCream.set`
- **Consumidores:** `ice-cream-report-page.component.html` (plantilla)

##### `IceCreamReportPageComponent.onDraftUserChange`

- **Firma:** `onDraftUserChange(userId: string): void` — [ice-cream-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts#L140) (L140–142)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.draftUser.set`, `this.users().find`, `this.users`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.draftUser.set`
- **Consumidores:** `ice-cream-report-page.component.html` (plantilla)

##### `IceCreamReportPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [ice-cream-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts#L144) (L144–167)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.draftIncludeSales`, `this.state.draftIncludePurchases`, `this.notificationService.error`, `this.state.draftStartDate`, `this.state.draftEndDate`, `this.state.includeSales.set`, `this.state.includePurchases.set`, `this.state.iceCream.set`, `this.state.draftIceCream`, `this.state.user.set`, `this.state.draftUser`, `this.state.startDate.set`, `this.state.endDate.set`, `this.state.page.set`, `this.runQuery`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.includeSales.set`, `this.state.includePurchases.set`, `this.state.iceCream.set`, `this.state.user.set`, `this.state.startDate.set`, `this.state.endDate.set`
- **Consumidores:** `ice-cream-report-page.component.html` (plantilla)

##### `IceCreamReportPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [ice-cream-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts#L169) (L169–186)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.draftIncludeSales.set`, `this.state.draftIncludePurchases.set`, `this.state.draftIceCream.set`, `this.state.draftUser.set`, `this.state.draftStartDate.set`, `this.state.draftEndDate.set`, `this.state.includeSales.set`, `this.state.includePurchases.set`, `this.state.iceCream.set`, `this.state.user.set`, `this.state.startDate.set`, `this.state.endDate.set`, `this.state.page.set`, `this.runQuery`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.draftIncludeSales.set`, `this.state.draftIncludePurchases.set`, `this.state.draftIceCream.set`, `this.state.draftUser.set`, `this.state.draftStartDate.set`, `this.state.draftEndDate.set`
- **Consumidores:** `ice-cream-report-page.component.html` (plantilla)

##### `IceCreamReportPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [ice-cream-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts#L188) (L188–191)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.page.set`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.page.set`
- **Consumidores:** `ice-cream-report-page.component.html` (plantilla)

##### `IceCreamReportPageComponent.exportPdf`

- **Firma:** `exportPdf(): void` — [ice-cream-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts#L193) (L193–206)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.exporting.set`, `this.reportsService.exportIceCreamReportPdf(this.currentFilters()).subscribe`, `this.reportsService.exportIceCreamReportPdf`, `this.currentFilters`, `downloadBlob`, `buildExportFilename`, `this.state.startDate`, `this.state.endDate`, `this.notificationService.success`, `this.notificationService.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.exporting.set`
- **Consumidores:** `ice-cream-report-page.component.html` (plantilla)

##### `IceCreamReportPageComponent.currentFilters`

- **Firma:** `currentFilters(): IceCreamReportFilters` — [ice-cream-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts#L208) (L208–222)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.includeSales`, `this.state.includePurchases`, `this.state.startDate`, `this.state.endDate`, `this.state.iceCream`, `this.state.user`, `this.state.page`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `IceCreamReportPageComponent.runQuery`

- **Firma:** `runQuery(): void` — [ice-cream-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts#L224) (L224–243)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.includeSales`, `this.state.includePurchases`, `this.notificationService.error`, `this.state.hasQueried.set`, `this.state.loadingSummary.set`, `this.reportsService.getIceCreamReportSummary(this.currentFilters()).subscribe`, `this.reportsService.getIceCreamReportSummary`, `this.currentFilters`, `this.state.summary.set`, `extractErrorMessage`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.hasQueried.set`, `this.state.loadingSummary.set`, `this.state.summary.set`
- **Consumidores:** (mismo archivo)

##### `IceCreamReportPageComponent.fetchTable`

- **Firma:** `fetchTable(): void` — [ice-cream-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts#L245) (L245–258)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.state.loadingTable.set`, `this.reportsService.getIceCreamReport(this.currentFilters()).subscribe`, `this.reportsService.getIceCreamReport`, `this.currentFilters`, `this.state.rows.set`, `this.state.total.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.state.loadingTable.set`, `this.state.rows.set`, `this.state.total.set`
- **Consumidores:** (mismo archivo)

#### Función `buildExportFilename` (L25–31)

- **Tipo:** función local del archivo
- **Firma:** `buildExportFilename(startDate: string, endDate: string): string` — [ice-cream-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts#L25)
- **Propósito / descripción:** `yyyy-MM-dd` → `dd-al-dd`/plain date, mirrors the backend's own filename logic exactly (`IceCreamReportController.buildExportFilename`).
- **Dependencias:** `new Date().toISOString().slice`, `new Date().toISOString`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-components-purchase-detail-modal-purchase-detail-modal-component-ts"></a>

### purchase-detail-modal.component.ts

- **Ruta:** [purchase-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/components/purchase-detail-modal/purchase-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/purchases/components/purchase-detail-modal/purchase-detail-modal.component.ts`, 25 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Componente Angular: declara `PurchaseDetailModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts), [purchases-admin-page.component.ts (plantilla)](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-purchases-admin-page-component-ts) (plantilla), [purchases-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts) (plantilla)
- **Plantilla:** [purchase-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/components/purchase-detail-modal/purchase-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="closed.emit()"`

#### Clase `PurchaseDetailModalComponent` (L7–24)

- **Decoradores:** `@Component({ selector: 'app-purchase-detail-modal', standalone: true, imports: [DatePipe, ButtonComponent, IconComponent], templateUrl: './purchase-detail-modal.`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input loading = false`, `@Input purchase = null`, `@Output closed = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-components-purchases-report-table-purchases-report-table-component-ts"></a>

### purchases-report-table.component.ts

- **Ruta:** [purchases-report-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/components/purchases-report-table/purchases-report-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/purchases/components/purchases-report-table/purchases-report-table.component.ts`, 45 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Desktop table only — same deliberate scope call as `SalesReportTableComponent` (see its own doc comment).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts), [purchases-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts) (plantilla)
- **Plantilla:** [purchases-report-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/components/purchases-report-table/purchases-report-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="toggleSort('date')"`, `(click)="toggleSort('total')"`, `(click)="viewDetail.emit(row.id)"`

#### Clase `PurchasesReportTableComponent` (L13–44)

- **Decoradores:** `@Component({ selector: 'app-purchases-report-table', standalone: true, imports: [DatePipe, IconComponent, EmptyStateComponent], templateUrl: './purchases-report-`
- **Propósito:** Desktop table only — same deliberate scope call as `SalesReportTableComponent` (see its own doc comment).
- **Datos / estado que administra:** `@Input rows = []`, `@Input loading = false`, `@Input sortBy = 'date'`, `@Input sortDirection = 'desc'`, `@Output sortChange = new EventEmitter<{ sortBy: ReportSortField; sortDi`, `@Output viewDetail = new EventEmitter<string>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toggleSort` | método public | 32–36 | `field: ReportSortField` | `void` |
| `sortIcon` | método public | 38–43 | `field: ReportSortField` | `string` |

##### `PurchasesReportTableComponent.toggleSort`

- **Firma:** `toggleSort(field: ReportSortField): void` — [purchases-report-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/components/purchases-report-table/purchases-report-table.component.ts#L32) (L32–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortChange.emit`
- **Efectos secundarios:** Emite eventos: `this.sortChange.emit`
- **Consumidores:** `purchases-report-table.component.html` (plantilla)

##### `PurchasesReportTableComponent.sortIcon`

- **Firma:** `sortIcon(field: ReportSortField): string` — [purchases-report-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/components/purchases-report-table/purchases-report-table.component.ts#L38) (L38–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-report-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts"></a>

### purchases-report-page.component.ts

- **Ruta:** [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts`, 381 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Componente Angular: declara `PurchasesReportPageComponent`, `toIsoDate`, `todayIsoDate`, `firstDayOfMonthIsoDate`, `defaultFilterFields` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [business.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-business-service-ts), [category.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-category-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [reports.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-reports-service-ts), [supplier.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-supplier-service-ts), [user.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-user-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-blob-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [product-filter-search.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-product-filter-search-product-filter-search-component-ts), [purchases-report-table.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-components-purchases-report-table-purchases-report-table-component-ts) y 1 más
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [purchases-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [product-filter-search.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-product-filter-search-product-filter-search-component-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [purchases-report-table.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-components-purchases-report-table-purchases-report-table-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [purchase-detail-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-components-purchase-detail-modal-purchase-detail-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="exportPdf()"`, `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(ngModelChange)="draftSupplierId.set($event)"`, `(ngModelChange)="draftCategoryId.set($event)"`, `(ngModelChange)="draftBusinessId.set($event)"`, `(ngModelChange)="draftUserId.set($event)"`, `(selectionChange)="onProductSelectionChange($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(click)="setViewMode('detail')"`, `(click)="setViewMode('byProduct')"`, `(sortChange)="onSortChange($event)"`, `(viewDetail)="viewDetail($event)"`, `(pageChange)="onPageChange($event)"`

**Interfaces, tipos y enums:**

- `interface FilterFieldsState` (L39): sin documentación — miembros: `startDate`, `endDate`, `supplierId`, `categoryId`, `businessId`, `selectedProduct`, `userId`
- `type ViewMode` (L37) = `'detail' \| 'byProduct'`

#### Clase `PurchasesReportPageComponent` (L78–380)

- **Decoradores:** `@Component({ selector: 'app-purchases-report-page', standalone: true, imports: [ FormsModule, PageHeaderComponent, ButtonComponent, IconComponent, ReportSummaryC`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `reportsService = inject(ReportsService)`, `categoryService = inject(CategoryService)`, `businessService = inject(BusinessService)`, `userService = inject(UserService)`, `supplierService = inject(SupplierService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `categories = signal<Category[]>([])`, `businesses = signal<Business[]>([])`, `users = signal<User[]>([])`, `suppliers = signal<Supplier[]>([])`, `draftStartDate = signal(firstDayOfMonthIsoDate())`, `draftEndDate = signal(todayIsoDate())`, `draftSupplierId = signal('')`, `draftCategoryId = signal('')`, `draftBusinessId = signal('')`, `draftSelectedProduct = signal<Product \| null>(null)`, `draftUserId = signal('')`, `startDate = signal(firstDayOfMonthIsoDate())`, `endDate = signal(todayIsoDate())`, `supplierId = signal('')`, `categoryId = signal('')`, `businessId = signal('')`, `selectedProduct = signal<Product \| null>(null)`, `userId = signal('')`, `viewMode = signal<ViewMode>('detail')`, `sortBy = signal<ReportSortField>('date')`, `sortDirection = signal<ReportSortDirection>('desc')`, `page = signal(1)`, `rows = signal<PurchasesReportRow[]>([])`, `total = signal(0)`, `byProductRows = signal<PurchasesByProductRow[]>([])`, `byProductTotal = signal(0)`, `summary = signal<PurchasesReportSummary \| null>(null)`, `loadingTable = signal(false)`, `loadingSummary = signal(false)`, `exporting = signal(false)`…

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onProductSelectionChange` | método public | 213–215 | `product: Product \| null` | `void` |
| `applyFilters` | método public | 217–233 | — | `void` |
| `clearFilters` | método public | 235–258 | — | `void` |
| `setViewMode` | método public | 260–267 | `mode: ViewMode` | `void` |
| `onSortChange` | método public | 269–274 | `change: { sortBy: ReportSortField; sortDirection: ReportSortDirection }` | `void` |
| `onPageChange` | método public | 276–279 | `page: number` | `void` |
| `viewDetail` | método public | 281–296 | `id: string` | `void` |
| `closeDetail` | método public | 298–301 | — | `void` |
| `exportPdf` | método public | 304–317 | — | `void` |
| `currentFilters` | método private | 319–333 | — | `PurchasesReportFilters` |
| `fetchAll` | método private | 335–348 | — | `void` |
| `fetchTable` | método private | 350–379 | — | `void` |

##### `PurchasesReportPageComponent.onProductSelectionChange`

- **Firma:** `onProductSelectionChange(product: Product \| null): void` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L213) (L213–215)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftSelectedProduct.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftSelectedProduct.set`
- **Consumidores:** `purchases-report-page.component.html` (plantilla)

##### `PurchasesReportPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L217) (L217–233)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStartDate`, `this.draftEndDate`, `this.notificationService.error`, `this.startDate.set`, `this.endDate.set`, `this.supplierId.set`, `this.draftSupplierId`, `this.categoryId.set`, `this.draftCategoryId`, `this.businessId.set`, `this.draftBusinessId`, `this.selectedProduct.set`, `this.draftSelectedProduct`, `this.userId.set`, `this.draftUserId`, `this.page.set`, `this.fetchAll`
- **Efectos secundarios:** Actualiza estado (signals): `this.startDate.set`, `this.endDate.set`, `this.supplierId.set`, `this.categoryId.set`, `this.businessId.set`, `this.selectedProduct.set`
- **Consumidores:** `purchases-report-page.component.html` (plantilla)

##### `PurchasesReportPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L235) (L235–258)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `defaultFilterFields`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftSupplierId.set`, `this.draftCategoryId.set`, `this.draftBusinessId.set`, `this.draftSelectedProduct.set`, `this.draftUserId.set`, `this.startDate.set`, `this.endDate.set`, `this.supplierId.set`, `this.categoryId.set`, `this.businessId.set`, `this.selectedProduct.set`, `this.userId.set`, `this.sortBy.set`, `this.sortDirection.set`, `this.page.set`…
- **Efectos secundarios:** Actualiza estado (signals): `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftSupplierId.set`, `this.draftCategoryId.set`, `this.draftBusinessId.set`, `this.draftSelectedProduct.set`
- **Consumidores:** `purchases-report-page.component.html` (plantilla)

##### `PurchasesReportPageComponent.setViewMode`

- **Firma:** `setViewMode(mode: ViewMode): void` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L260) (L260–267)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.viewMode`, `this.viewMode.set`, `this.page.set`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.viewMode.set`, `this.page.set`
- **Consumidores:** `purchases-report-page.component.html` (plantilla)

##### `PurchasesReportPageComponent.onSortChange`

- **Firma:** `onSortChange(change: { sortBy: ReportSortField; sortDirection: ReportSortDirection }): void` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L269) (L269–274)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortBy.set`, `this.sortDirection.set`, `this.page.set`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortBy.set`, `this.sortDirection.set`, `this.page.set`
- **Consumidores:** `purchases-report-page.component.html` (plantilla)

##### `PurchasesReportPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L276) (L276–279)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `purchases-report-page.component.html` (plantilla)

##### `PurchasesReportPageComponent.viewDetail`

- **Firma:** `viewDetail(id: string): void` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L281) (L281–296)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDetailModalOpen.set`, `this.isDetailLoading.set`, `this.purchaseDetail.set`, `this.reportsService.getPurchaseReportDetail(id).subscribe`, `this.reportsService.getPurchaseReportDetail`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDetailModalOpen.set`, `this.isDetailLoading.set`, `this.purchaseDetail.set`
- **Consumidores:** `purchases-report-page.component.html` (plantilla)

##### `PurchasesReportPageComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L298) (L298–301)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDetailModalOpen.set`, `this.purchaseDetail.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDetailModalOpen.set`, `this.purchaseDetail.set`
- **Consumidores:** `purchases-report-page.component.html` (plantilla)

##### `PurchasesReportPageComponent.exportPdf`

- **Firma:** `exportPdf(): void` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L304) (L304–317)
- **Propósito / descripción:** Always exports exactly the applied filters — never the draft form fields — so the PDF can never show different data than what's currently on screen.
- **Dependencias (llamadas en su cuerpo):** `this.exporting.set`, `this.reportsService.exportPurchasesReportPdf(this.currentFilters()).subscribe`, `this.reportsService.exportPurchasesReportPdf`, `this.currentFilters`, `downloadBlob`, `todayIsoDate`, `this.notificationService.success`, `this.notificationService.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.exporting.set`
- **Consumidores:** `purchases-report-page.component.html` (plantilla)

##### `PurchasesReportPageComponent.currentFilters`

- **Firma:** `currentFilters(): PurchasesReportFilters` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L319) (L319–333)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.startDate`, `this.endDate`, `this.supplierId`, `this.categoryId`, `this.businessId`, `this.selectedProduct`, `this.userId`, `this.sortBy`, `this.sortDirection`, `this.page`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `PurchasesReportPageComponent.fetchAll`

- **Firma:** `fetchAll(): void` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L335) (L335–348)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingSummary.set`, `this.reportsService.getPurchasesReportSummary(this.currentFilters()).subscribe`, `this.reportsService.getPurchasesReportSummary`, `this.currentFilters`, `this.summary.set`, `this.notificationService.error`, `extractErrorMessage`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingSummary.set`, `this.summary.set`
- **Consumidores:** (mismo archivo)

##### `PurchasesReportPageComponent.fetchTable`

- **Firma:** `fetchTable(): void` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L350) (L350–379)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingTable.set`, `this.viewMode`, `this.reportsService.getPurchasesReport(this.currentFilters()).subscribe`, `this.reportsService.getPurchasesReport`, `this.currentFilters`, `this.rows.set`, `this.total.set`, `this.notificationService.error`, `extractErrorMessage`, `this.reportsService.getPurchasesByProductReport(this.currentFilters()).subscribe`, `this.reportsService.getPurchasesByProductReport`, `this.byProductRows.set`, `this.byProductTotal.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingTable.set`, `this.rows.set`, `this.total.set`, `this.byProductRows.set`, `this.byProductTotal.set`
- **Consumidores:** (mismo archivo)

#### Función `toIsoDate` (L49–54)

- **Tipo:** función local del archivo
- **Firma:** `toIsoDate(date: Date): string` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L49)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `date.getFullYear`, `String(date.getMonth() + 1).padStart`, `String`, `date.getMonth`, `String(date.getDate()).padStart`, `date.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `todayIsoDate` (L56–58)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L56)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `toIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `firstDayOfMonthIsoDate` (L61–64)

- **Tipo:** función local del archivo
- **Firma:** `firstDayOfMonthIsoDate(): string` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L61)
- **Propósito / descripción:** Same "current month" default as the Sales report — see that page's doc comment.
- **Dependencias:** `new Date`, `toIsoDate`, `now.getFullYear`, `now.getMonth`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `defaultFilterFields` (L66–76)

- **Tipo:** función local del archivo
- **Firma:** `defaultFilterFields(): FilterFieldsState` — [purchases-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts#L66)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `firstDayOfMonthIsoDate`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-recharges-recharges-report-page-component-ts"></a>

### recharges-report-page.component.ts

- **Ruta:** [recharges-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.ts`, 239 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Simpler than Sales'/Purchases' report pages by design — Recargas has no line items to join, no "por producto" breakdown, and no per-row detail to drill into (each row already shows everything: saldo anterior, compra, saldo del día, saldo final, venta).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [recharges.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharges-service-ts), [reports.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-reports-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-blob-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [recharges-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="exportPdf()"`, `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(ngModelChange)="draftRechargeTypeId.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(pageChange)="onPageChange($event)"`

**Interfaces, tipos y enums:**

- `interface FilterFieldsState` (L17): sin documentación — miembros: `startDate`, `endDate`, `rechargeTypeId`

#### Clase `RechargesReportPageComponent` (L56–238)

- **Decoradores:** `@Component({ selector: 'app-recharges-report-page', standalone: true, imports: [ FormsModule, DatePipe, PageHeaderComponent, ButtonComponent, IconComponent, Repo`
- **Propósito:** Simpler than Sales'/Purchases' report pages by design — Recargas has no line items to join, no "por producto" breakdown, and no per-row detail to drill into (each row already shows everything: saldo anterior, compra, saldo del día, saldo final, venta). No sortable-column table component or detail modal was built for this reason, not an oversight.
- **Servicios inyectados con `inject()`:** `reportsService = inject(ReportsService)`, `rechargesService = inject(RechargesService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `types = signal<RechargeType[]>([])`, `draftStartDate = signal(firstDayOfMonthIsoDate())`, `draftEndDate = signal(todayIsoDate())`, `draftRechargeTypeId = signal('')`, `startDate = signal(firstDayOfMonthIsoDate())`, `endDate = signal(todayIsoDate())`, `rechargeTypeId = signal('')`, `page = signal(1)`, `rows = signal<RechargeDailyBalance[]>([])`, `total = signal(0)`, `summary = signal<RechargesReportSummary \| null>(null)`, `loadingTable = signal(false)`, `loadingSummary = signal(false)`, `exporting = signal(false)`, `hasActiveFilters = computed(() => { const defaults = defaultFilterFie`, `summaryTiles = computed<ReportSummaryTile[]>(() => { const s = th`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `applyFilters` | método public | 149–161 | — | `void` |
| `clearFilters` | método public | 163–176 | — | `void` |
| `onPageChange` | método public | 178–181 | `page: number` | `void` |
| `exportPdf` | método public | 184–197 | — | `void` |
| `currentFilters` | método private | 199–207 | — | `RechargesReportFilters` |
| `fetchAll` | método private | 209–222 | — | `void` |
| `fetchTable` | método private | 224–237 | — | `void` |

##### `RechargesReportPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [recharges-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.ts#L149) (L149–161)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStartDate`, `this.draftEndDate`, `this.notificationService.error`, `this.startDate.set`, `this.endDate.set`, `this.rechargeTypeId.set`, `this.draftRechargeTypeId`, `this.page.set`, `this.fetchAll`
- **Efectos secundarios:** Actualiza estado (signals): `this.startDate.set`, `this.endDate.set`, `this.rechargeTypeId.set`, `this.page.set`
- **Consumidores:** `recharges-report-page.component.html` (plantilla)

##### `RechargesReportPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [recharges-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.ts#L163) (L163–176)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `defaultFilterFields`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftRechargeTypeId.set`, `this.startDate.set`, `this.endDate.set`, `this.rechargeTypeId.set`, `this.page.set`, `this.fetchAll`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftRechargeTypeId.set`, `this.startDate.set`, `this.endDate.set`, `this.rechargeTypeId.set`
- **Consumidores:** `recharges-report-page.component.html` (plantilla)

##### `RechargesReportPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [recharges-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.ts#L178) (L178–181)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `recharges-report-page.component.html` (plantilla)

##### `RechargesReportPageComponent.exportPdf`

- **Firma:** `exportPdf(): void` — [recharges-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.ts#L184) (L184–197)
- **Propósito / descripción:** Always exports exactly the applied filters — never the draft form fields — so the PDF can never show different data than what's currently on screen.
- **Dependencias (llamadas en su cuerpo):** `this.exporting.set`, `this.reportsService.exportRechargesReportPdf(this.currentFilters()).subscribe`, `this.reportsService.exportRechargesReportPdf`, `this.currentFilters`, `downloadBlob`, `todayIsoDate`, `this.notificationService.success`, `this.notificationService.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.exporting.set`
- **Consumidores:** `recharges-report-page.component.html` (plantilla)

##### `RechargesReportPageComponent.currentFilters`

- **Firma:** `currentFilters(): RechargesReportFilters` — [recharges-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.ts#L199) (L199–207)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.startDate`, `this.endDate`, `this.rechargeTypeId`, `this.page`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `RechargesReportPageComponent.fetchAll`

- **Firma:** `fetchAll(): void` — [recharges-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.ts#L209) (L209–222)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingSummary.set`, `this.reportsService.getRechargesReportSummary(this.currentFilters()).subscribe`, `this.reportsService.getRechargesReportSummary`, `this.currentFilters`, `this.summary.set`, `this.notificationService.error`, `extractErrorMessage`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingSummary.set`, `this.summary.set`
- **Consumidores:** (mismo archivo)

##### `RechargesReportPageComponent.fetchTable`

- **Firma:** `fetchTable(): void` — [recharges-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.ts#L224) (L224–237)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingTable.set`, `this.reportsService.getRechargesReport(this.currentFilters()).subscribe`, `this.reportsService.getRechargesReport`, `this.currentFilters`, `this.rows.set`, `this.total.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingTable.set`, `this.rows.set`, `this.total.set`
- **Consumidores:** (mismo archivo)

#### Función `toIsoDate` (L24–29)

- **Tipo:** función local del archivo
- **Firma:** `toIsoDate(date: Date): string` — [recharges-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.ts#L24)
- **Propósito / descripción:** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique every other date-driven page in this app already uses.
- **Dependencias:** `date.getFullYear`, `String(date.getMonth() + 1).padStart`, `String`, `date.getMonth`, `String(date.getDate()).padStart`, `date.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `todayIsoDate` (L31–33)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [recharges-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.ts#L31)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `toIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `firstDayOfMonthIsoDate` (L36–39)

- **Tipo:** función local del archivo
- **Firma:** `firstDayOfMonthIsoDate(): string` — [recharges-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.ts#L36)
- **Propósito / descripción:** Same "current month" default as the Sales/Purchases reports — see those pages' own doc comments.
- **Dependencias:** `new Date`, `toIsoDate`, `now.getFullYear`, `now.getMonth`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `defaultFilterFields` (L41–47)

- **Tipo:** función local del archivo
- **Firma:** `defaultFilterFields(): FilterFieldsState` — [recharges-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/recharges/recharges-report-page.component.ts#L41)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `firstDayOfMonthIsoDate`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-components-sale-detail-modal-sale-detail-modal-component-ts"></a>

### sale-detail-modal.component.ts

- **Ruta:** [sale-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/components/sale-detail-modal/sale-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/sales/components/sale-detail-modal/sale-detail-modal.component.ts`, 25 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Componente Angular: declara `SaleDetailModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts)
- **Plantilla:** [sale-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/components/sale-detail-modal/sale-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="closed.emit()"`

#### Clase `SaleDetailModalComponent` (L7–24)

- **Decoradores:** `@Component({ selector: 'app-sale-detail-modal', standalone: true, imports: [DatePipe, ButtonComponent, IconComponent], templateUrl: './sale-detail-modal.componen`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input loading = false`, `@Input sale = null`, `@Output closed = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-components-sales-report-table-sales-report-table-component-ts"></a>

### sales-report-table.component.ts

- **Ruta:** [sales-report-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/components/sales-report-table/sales-report-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/sales/components/sales-report-table/sales-report-table.component.ts`, 46 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Desktop table only (no mobile card-list duplicate, unlike Inventory/ Categories/etc.) — a deliberate scope call for this admin-only report screen: it's wrapped in its own `overflow-x: auto` per this app's rule for wide content, so it's still usable on a narrow viewport, just not reflowed into cards.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts), [sales-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts) (plantilla)
- **Plantilla:** [sales-report-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/components/sales-report-table/sales-report-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="toggleSort('date')"`, `(click)="toggleSort('total')"`, `(click)="viewDetail.emit(row.id)"`

#### Clase `SalesReportTableComponent` (L14–45)

- **Decoradores:** `@Component({ selector: 'app-sales-report-table', standalone: true, imports: [DatePipe, IconComponent, EmptyStateComponent], templateUrl: './sales-report-table.co`
- **Propósito:** Desktop table only (no mobile card-list duplicate, unlike Inventory/ Categories/etc.) — a deliberate scope call for this admin-only report screen: it's wrapped in its own `overflow-x: auto` per this app's rule for wide content, so it's still usable on a narrow viewport, just not reflowed into cards.
- **Datos / estado que administra:** `@Input rows = []`, `@Input loading = false`, `@Input sortBy = 'date'`, `@Input sortDirection = 'desc'`, `@Output sortChange = new EventEmitter<{ sortBy: ReportSortField; sortDi`, `@Output viewDetail = new EventEmitter<string>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toggleSort` | método public | 33–37 | `field: ReportSortField` | `void` |
| `sortIcon` | método public | 39–44 | `field: ReportSortField` | `string` |

##### `SalesReportTableComponent.toggleSort`

- **Firma:** `toggleSort(field: ReportSortField): void` — [sales-report-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/components/sales-report-table/sales-report-table.component.ts#L33) (L33–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortChange.emit`
- **Efectos secundarios:** Emite eventos: `this.sortChange.emit`
- **Consumidores:** `sales-report-table.component.html` (plantilla)

##### `SalesReportTableComponent.sortIcon`

- **Firma:** `sortIcon(field: ReportSortField): string` — [sales-report-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/components/sales-report-table/sales-report-table.component.ts#L39) (L39–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-report-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts"></a>

### sales-report-page.component.ts

- **Ruta:** [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts`, 376 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-reports`
- **Responsabilidad:** Componente Angular: declara `SalesReportPageComponent`, `toIsoDate`, `todayIsoDate`, `firstDayOfMonthIsoDate`, `defaultFilterFields` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [business.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-business-service-ts), [category.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-category-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [reports.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-reports-service-ts), [user.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-user-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-blob-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [product-filter-search.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-product-filter-search-product-filter-search-component-ts), [sales-report-table.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-components-sales-report-table-sales-report-table-component-ts), [sale-detail-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-components-sale-detail-modal-sale-detail-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [sales-report-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [product-filter-search.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-product-filter-search-product-filter-search-component-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [sales-report-table.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-components-sales-report-table-sales-report-table-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [sale-detail-modal.component.ts](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-components-sale-detail-modal-sale-detail-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="exportPdf()"`, `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(ngModelChange)="draftCategoryId.set($event)"`, `(ngModelChange)="draftBusinessId.set($event)"`, `(ngModelChange)="draftUserId.set($event)"`, `(selectionChange)="onProductSelectionChange($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(click)="setViewMode('detail')"`, `(click)="setViewMode('byProduct')"`, `(sortChange)="onSortChange($event)"`, `(viewDetail)="viewDetail($event)"`, `(pageChange)="onPageChange($event)"`, `(closed)="closeDetail()"`

**Interfaces, tipos y enums:**

- `interface FilterFieldsState` (L37): sin documentación — miembros: `startDate`, `endDate`, `categoryId`, `businessId`, `selectedProduct`, `userId`
- `type ViewMode` (L35) = `'detail' \| 'byProduct'`

#### Clase `SalesReportPageComponent` (L74–375)

- **Decoradores:** `@Component({ selector: 'app-sales-report-page', standalone: true, imports: [ FormsModule, PageHeaderComponent, ButtonComponent, IconComponent, ReportSummaryCompo`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `reportsService = inject(ReportsService)`, `categoryService = inject(CategoryService)`, `businessService = inject(BusinessService)`, `userService = inject(UserService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `categories = signal<Category[]>([])`, `businesses = signal<Business[]>([])`, `users = signal<User[]>([])`, `draftStartDate = signal(firstDayOfMonthIsoDate())`, `draftEndDate = signal(todayIsoDate())`, `draftCategoryId = signal('')`, `draftBusinessId = signal('')`, `draftSelectedProduct = signal<Product \| null>(null)`, `draftUserId = signal('')`, `startDate = signal(firstDayOfMonthIsoDate())`, `endDate = signal(todayIsoDate())`, `categoryId = signal('')`, `businessId = signal('')`, `selectedProduct = signal<Product \| null>(null)`, `userId = signal('')`, `viewMode = signal<ViewMode>('detail')`, `sortBy = signal<ReportSortField>('date')`, `sortDirection = signal<ReportSortDirection>('desc')`, `page = signal(1)`, `rows = signal<SalesReportRow[]>([])`, `total = signal(0)`, `byProductRows = signal<SalesByProductRow[]>([])`, `byProductTotal = signal(0)`, `summary = signal<SalesReportSummary \| null>(null)`, `loadingTable = signal(false)`, `loadingSummary = signal(false)`, `exporting = signal(false)`, `isDetailModalOpen = signal(false)`, `isDetailLoading = signal(false)`, `saleDetail = signal<SaleReportDetail \| null>(null)`…

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onProductSelectionChange` | método public | 212–214 | `product: Product \| null` | `void` |
| `applyFilters` | método public | 216–231 | — | `void` |
| `clearFilters` | método public | 233–254 | — | `void` |
| `setViewMode` | método public | 256–263 | `mode: ViewMode` | `void` |
| `onSortChange` | método public | 265–270 | `change: { sortBy: ReportSortField; sortDirection: ReportSortDirection }` | `void` |
| `onPageChange` | método public | 272–275 | `page: number` | `void` |
| `viewDetail` | método public | 277–292 | `id: string` | `void` |
| `closeDetail` | método public | 294–297 | — | `void` |
| `exportPdf` | método public | 300–313 | — | `void` |
| `currentFilters` | método private | 315–328 | — | `SalesReportFilters` |
| `fetchAll` | método private | 330–343 | — | `void` |
| `fetchTable` | método private | 345–374 | — | `void` |

##### `SalesReportPageComponent.onProductSelectionChange`

- **Firma:** `onProductSelectionChange(product: Product \| null): void` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L212) (L212–214)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftSelectedProduct.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftSelectedProduct.set`
- **Consumidores:** `sales-report-page.component.html` (plantilla)

##### `SalesReportPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L216) (L216–231)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStartDate`, `this.draftEndDate`, `this.notificationService.error`, `this.startDate.set`, `this.endDate.set`, `this.categoryId.set`, `this.draftCategoryId`, `this.businessId.set`, `this.draftBusinessId`, `this.selectedProduct.set`, `this.draftSelectedProduct`, `this.userId.set`, `this.draftUserId`, `this.page.set`, `this.fetchAll`
- **Efectos secundarios:** Actualiza estado (signals): `this.startDate.set`, `this.endDate.set`, `this.categoryId.set`, `this.businessId.set`, `this.selectedProduct.set`, `this.userId.set`
- **Consumidores:** `sales-report-page.component.html` (plantilla)

##### `SalesReportPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L233) (L233–254)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `defaultFilterFields`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftCategoryId.set`, `this.draftBusinessId.set`, `this.draftSelectedProduct.set`, `this.draftUserId.set`, `this.startDate.set`, `this.endDate.set`, `this.categoryId.set`, `this.businessId.set`, `this.selectedProduct.set`, `this.userId.set`, `this.sortBy.set`, `this.sortDirection.set`, `this.page.set`, `this.fetchAll`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftCategoryId.set`, `this.draftBusinessId.set`, `this.draftSelectedProduct.set`, `this.draftUserId.set`
- **Consumidores:** `sales-report-page.component.html` (plantilla)

##### `SalesReportPageComponent.setViewMode`

- **Firma:** `setViewMode(mode: ViewMode): void` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L256) (L256–263)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.viewMode`, `this.viewMode.set`, `this.page.set`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.viewMode.set`, `this.page.set`
- **Consumidores:** `sales-report-page.component.html` (plantilla)

##### `SalesReportPageComponent.onSortChange`

- **Firma:** `onSortChange(change: { sortBy: ReportSortField; sortDirection: ReportSortDirection }): void` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L265) (L265–270)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortBy.set`, `this.sortDirection.set`, `this.page.set`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortBy.set`, `this.sortDirection.set`, `this.page.set`
- **Consumidores:** `sales-report-page.component.html` (plantilla)

##### `SalesReportPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L272) (L272–275)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `sales-report-page.component.html` (plantilla)

##### `SalesReportPageComponent.viewDetail`

- **Firma:** `viewDetail(id: string): void` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L277) (L277–292)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDetailModalOpen.set`, `this.isDetailLoading.set`, `this.saleDetail.set`, `this.reportsService.getSaleReportDetail(id).subscribe`, `this.reportsService.getSaleReportDetail`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDetailModalOpen.set`, `this.isDetailLoading.set`, `this.saleDetail.set`
- **Consumidores:** `sales-report-page.component.html` (plantilla)

##### `SalesReportPageComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L294) (L294–297)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDetailModalOpen.set`, `this.saleDetail.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDetailModalOpen.set`, `this.saleDetail.set`
- **Consumidores:** `sales-report-page.component.html` (plantilla)

##### `SalesReportPageComponent.exportPdf`

- **Firma:** `exportPdf(): void` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L300) (L300–313)
- **Propósito / descripción:** Always exports exactly the applied filters — never the draft form fields — so the PDF can never show different data than what's currently on screen.
- **Dependencias (llamadas en su cuerpo):** `this.exporting.set`, `this.reportsService.exportSalesReportPdf(this.currentFilters()).subscribe`, `this.reportsService.exportSalesReportPdf`, `this.currentFilters`, `downloadBlob`, `todayIsoDate`, `this.notificationService.success`, `this.notificationService.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.exporting.set`
- **Consumidores:** `sales-report-page.component.html` (plantilla)

##### `SalesReportPageComponent.currentFilters`

- **Firma:** `currentFilters(): SalesReportFilters` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L315) (L315–328)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.startDate`, `this.endDate`, `this.categoryId`, `this.businessId`, `this.selectedProduct`, `this.userId`, `this.sortBy`, `this.sortDirection`, `this.page`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `SalesReportPageComponent.fetchAll`

- **Firma:** `fetchAll(): void` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L330) (L330–343)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingSummary.set`, `this.reportsService.getSalesReportSummary(this.currentFilters()).subscribe`, `this.reportsService.getSalesReportSummary`, `this.currentFilters`, `this.summary.set`, `this.notificationService.error`, `extractErrorMessage`, `this.fetchTable`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingSummary.set`, `this.summary.set`
- **Consumidores:** (mismo archivo)

##### `SalesReportPageComponent.fetchTable`

- **Firma:** `fetchTable(): void` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L345) (L345–374)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingTable.set`, `this.viewMode`, `this.reportsService.getSalesReport(this.currentFilters()).subscribe`, `this.reportsService.getSalesReport`, `this.currentFilters`, `this.rows.set`, `this.total.set`, `this.notificationService.error`, `extractErrorMessage`, `this.reportsService.getSalesByProductReport(this.currentFilters()).subscribe`, `this.reportsService.getSalesByProductReport`, `this.byProductRows.set`, `this.byProductTotal.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingTable.set`, `this.rows.set`, `this.total.set`, `this.byProductRows.set`, `this.byProductTotal.set`
- **Consumidores:** (mismo archivo)

#### Función `toIsoDate` (L46–51)

- **Tipo:** función local del archivo
- **Firma:** `toIsoDate(date: Date): string` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L46)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `date.getFullYear`, `String(date.getMonth() + 1).padStart`, `String`, `date.getMonth`, `String(date.getDate()).padStart`, `date.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `todayIsoDate` (L53–55)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L53)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `toIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `firstDayOfMonthIsoDate` (L58–61)

- **Tipo:** función local del archivo
- **Firma:** `firstDayOfMonthIsoDate(): string` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L58)
- **Propósito / descripción:** Default filter window is "current month" — a reasonable, non-empty starting point rather than either "no filters" (every sale ever) or a blank form. Both reports use the same default for consistency.
- **Dependencias:** `new Date`, `toIsoDate`, `now.getFullYear`, `now.getMonth`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `defaultFilterFields` (L63–72)

- **Tipo:** función local del archivo
- **Firma:** `defaultFilterFields(): FilterFieldsState` — [sales-report-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/sales/sales-report-page.component.ts#L63)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `firstDayOfMonthIsoDate`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

