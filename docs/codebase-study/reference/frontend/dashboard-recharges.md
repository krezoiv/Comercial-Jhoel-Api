# Frontend `dashboard-recharges`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [close-recharge-day-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-close-recharge-day-confirm-modal-close-recharge-day-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Cerrar Día" para Recargas — dumb, the parent (`RechargesPageComponent`) owns the actual `POST /recharges/day-status/close` call on confirm. | 1 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [final-balance-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-final-balance-confirm-modal-final-balance-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb — the page owns the actual `registerFinalBalance` call, same split as Compras' `SaveConfirmModalComponent`. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [recharge-entry-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-entry-confirm-modal-recharge-entry-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Apertura del Día" para Recargas — dumb, the parent (`RechargesPageComponent`) owns the actual `POST /recharges/day-status/open` call on confirm. | 1 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [recharge-purchases-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-purchases-table-recharge-purchases-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb table over "Compras de Recargas" — every individually-registered purchase for the page's operation date, with its own "Revertir" action (never a physical delete/edit — see `RechargesService.voidPurchase`). | 2 internas; ext.: @angular/core, @angular/common | 2 | Baja (2 consumidores) |
| [recharge-sale-delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-sale-delete-confirm-modal-recharge-sale-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb — the page owns the actual `deleteSale` call, same split as Categories'/Compras' own delete-confirm modals. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [recharge-sale-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-sale-form-modal-recharge-sale-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Self-contained (like `CategoryFormModalComponent`) — calls `RechargesService` directly and emits the saved row. | 6 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [recharge-sales-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-sales-table-recharge-sales-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb table over "Recargas Vendidas" — the individual customer top-ups recorded for the page's operation date. | 2 internas; ext.: @angular/core, @angular/common | 2 | Baja (2 consumidores) |
| [recharge-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-table-recharge-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb table over today's balances — one row per active recharge type. | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [register-purchase-form.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-purchase-form-register-purchase-form-component-ts) | .ts | Componente Angular | Feature (pantalla) | Self-contained, like `CategoryFormModalComponent`/`ProductFormModalComponent` — calls `RechargesService` directly and emits the updated row so the parent only has to merge it into its `balances` list, rather than owning the request itself. | 7 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [register-sim-purchase-form.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-purchase-form-register-sim-purchase-form-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Compra de SIM" — deliberately a separate component from `RegisterPurchaseFormComponent` (never mixed with "Monto de Compra"/"Monto Acreditado" saldo electrónico), same shape (self-contained, `types`/`operationDate`/`lockReason` in, `registered` out, `ConfirmDialogService` before submitting). | 6 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [register-sim-sale-form.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-sale-form-register-sim-sale-form-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Venta de SIM" — deliberately separate from `RechargeSaleFormModalComponent` (venta de recarga electrónica, teléfono + monto): esta vende inventario físico por cantidad, nunca afecta el saldo electrónico. | 6 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [register-sim-sale-registration-form.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-sale-registration-form-register-sim-sale-registration-form-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Venta de SIM con registro de identidad" — deliberately separate from `RegisterSimSaleFormComponent` above it in the same SIM section (that one stays exactly as it was: a quick by-quantity sale, no DPI). | 7 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [sales-summary-card.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-sales-summary-card-sales-summary-card-component-ts) | .ts | Componente Angular | Feature (pantalla) | Self-contained, like `RegisterPurchaseFormComponent` — fetches and saves through `RechargesService` directly rather than routing through the page. | 7 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [sim-sales-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-sim-sales-table-sim-sales-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb table over "Vender SIM" (por cantidad) — every quick sale for the page's operation date, with its own "Revertir" action (never a physical delete/edit — see `RechargeSimsService.voidSale`). | 2 internas; ext.: @angular/core, @angular/common | 2 | Baja (2 consumidores) |
| [sim-stock-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-sim-stock-table-sim-stock-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb, read-only table for the SIM block of the cuadre — Stock Inicial \| Compras \| Ventas \| Stock Final, one row per SIM type. | 1 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [void-purchase-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-void-purchase-confirm-modal-void-purchase-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Revertir compra" — dumb, same pattern as Transaccionar's own `VoidConfirmModalComponent`: the parent (`RechargesPageComponent`) owns the actual `RechargesService.voidPurchase` call. | 2 internas; ext.: @angular/common, @angular/core, @angular/forms | 3 | Media (3 consumidores) |
| [void-sim-sale-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-void-sim-sale-confirm-modal-void-sim-sale-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Revertir venta" for the by-quantity "Vender SIM" flow — dumb, exact structural clone of `VoidPurchaseConfirmModalComponent`: the parent (`RechargesPageComponent`) owns the actual `RechargeSimsService.voidSale` call. | 2 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [recharges-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `RechargesPageComponent`, `emptyOperatorStat`, `todayIsoDate`, `CLARO_NAME`, `TIGO_NAME` (sin comentario de documentación en el código). | 25 internas; ext.: @angular/common, @angular/core, @angular/router, rxjs | 1 | Baja (1 consumidores) |
| [close-recharge-day-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/close-recharge-day-confirm-modal/close-recharge-day-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `close-recharge-day-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [close-recharge-day-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/close-recharge-day-confirm-modal/close-recharge-day-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [final-balance-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/final-balance-confirm-modal/final-balance-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `final-balance-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [final-balance-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/final-balance-confirm-modal/final-balance-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharge-entry-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-entry-confirm-modal/recharge-entry-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharge-entry-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [recharge-entry-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-entry-confirm-modal/recharge-entry-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharge-purchases-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-purchases-table/recharge-purchases-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharge-purchases-table.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [recharge-purchases-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-purchases-table/recharge-purchases-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharge-sale-delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-delete-confirm-modal/recharge-sale-delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharge-sale-delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [recharge-sale-delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-delete-confirm-modal/recharge-sale-delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharge-sale-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-form-modal/recharge-sale-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharge-sale-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [recharge-sale-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-form-modal/recharge-sale-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharge-sales-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sales-table/recharge-sales-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharge-sales-table.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [recharge-sales-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sales-table/recharge-sales-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharge-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-table/recharge-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharge-table.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [recharge-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-table/recharge-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [register-purchase-form.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-purchase-form/register-purchase-form.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `register-purchase-form.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [register-purchase-form.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-purchase-form/register-purchase-form.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [register-sim-purchase-form.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-purchase-form/register-sim-purchase-form.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `register-sim-purchase-form.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [register-sim-purchase-form.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-purchase-form/register-sim-purchase-form.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [register-sim-sale-form.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `register-sim-sale-form.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [register-sim-sale-form.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [register-sim-sale-registration-form.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `register-sim-sale-registration-form.component.ts`; usa 3 componentes hijos: `app-icon`, `app-client-search-select`, `app-button`. | — | — | Media |
| [register-sim-sale-registration-form.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [sales-summary-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sales-summary-card/sales-summary-card.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sales-summary-card.component.ts`; usa 3 componentes hijos: `app-icon`, `app-badge`, `app-button`. | — | — | Media |
| [sales-summary-card.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sales-summary-card/sales-summary-card.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [sim-sales-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sim-sales-table/sim-sales-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sim-sales-table.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [sim-sales-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sim-sales-table/sim-sales-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [sim-stock-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sim-stock-table/sim-stock-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sim-stock-table.component.ts`; usa 0 componentes hijos. | — | — | Media |
| [sim-stock-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sim-stock-table/sim-stock-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [void-purchase-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `void-purchase-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [void-purchase-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [void-sim-sale-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-sim-sale-confirm-modal/void-sim-sale-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `void-sim-sale-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [void-sim-sale-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-sim-sale-confirm-modal/void-sim-sale-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharges-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharges-page.component.ts`; usa 23 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-card`, `app-summary-tile`, `app-gauge-ring`. | — | — | Media |
| [recharges-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-close-recharge-day-confirm-modal-close-recharge-day-confirm-modal-component-ts"></a>

### close-recharge-day-confirm-modal.component.ts

- **Ruta:** [close-recharge-day-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/close-recharge-day-confirm-modal/close-recharge-day-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/close-recharge-day-confirm-modal/close-recharge-day-confirm-modal.component.ts`, 28 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** "Cerrar Día" para Recargas — dumb, the parent (`RechargesPageComponent`) owns the actual `POST /recharges/day-status/close` call on confirm.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [close-recharge-day-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/close-recharge-day-confirm-modal/close-recharge-day-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `CloseRechargeDayConfirmModalComponent` (L13–27)

- **Decoradores:** `@Component({ selector: 'app-close-recharge-day-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './close-recharge-day-co`
- **Propósito:** "Cerrar Día" para Recargas — dumb, the parent (`RechargesPageComponent`) owns the actual `POST /recharges/day-status/close` call on confirm. This is a standalone action: it never saves a cuadre itself (that's still "Guardar cuadre", unlimited-per-day and unchanged) — closing only blocks further writes for the date from this point on, and can later be undone only by an admin via "Reabrir Día" in Gestión de Días de Recargas.
- **Datos / estado que administra:** `@Input open = false`, `@Input isClosing = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-final-balance-confirm-modal-final-balance-confirm-modal-component-ts"></a>

### final-balance-confirm-modal.component.ts

- **Ruta:** [final-balance-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/final-balance-confirm-modal/final-balance-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/final-balance-confirm-modal/final-balance-confirm-modal.component.ts`, 31 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** Dumb — the page owns the actual `registerFinalBalance` call, same split as Compras' `SaveConfirmModalComponent`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [final-balance-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/final-balance-confirm-modal/final-balance-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `FinalBalanceConfirmModalComponent` (L7–30)

- **Decoradores:** `@Component({ selector: 'app-final-balance-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './final-balance-confirm-moda`
- **Propósito:** Dumb — the page owns the actual `registerFinalBalance` call, same split as Compras' `SaveConfirmModalComponent`.
- **Datos / estado que administra:** `@Input open = false`, `@Input rechargeTypeName = ''`, `@Input dailyBalance = 0`, `@Input finalBalance = 0`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `sale` | getter public | 27–29 | — | `number` |

##### `FinalBalanceConfirmModalComponent.sale`

- **Firma:** `sale(): number` — [final-balance-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/final-balance-confirm-modal/final-balance-confirm-modal.component.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-entry-confirm-modal-recharge-entry-confirm-modal-component-ts"></a>

### recharge-entry-confirm-modal.component.ts

- **Ruta:** [recharge-entry-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-entry-confirm-modal/recharge-entry-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-entry-confirm-modal/recharge-entry-confirm-modal.component.ts`, 28 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** "Apertura del Día" para Recargas — dumb, the parent (`RechargesPageComponent`) owns the actual `POST /recharges/day-status/open` call on confirm.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [recharge-entry-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-entry-confirm-modal/recharge-entry-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `RechargeEntryConfirmModalComponent` (L13–27)

- **Decoradores:** `@Component({ selector: 'app-recharge-entry-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './recharge-entry-confirm-mo`
- **Propósito:** "Apertura del Día" para Recargas — dumb, the parent (`RechargesPageComponent`) owns the actual `POST /recharges/day-status/open` call on confirm. "Cancelar" only closes this modal; it never navigates or deletes anything, since nothing was opened yet. Structural copy of Bancos' own `EntryConfirmModalComponent`, feature-scoped per this app's convention.
- **Datos / estado que administra:** `@Input open = false`, `@Input isOpening = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-purchases-table-recharge-purchases-table-component-ts"></a>

### recharge-purchases-table.component.ts

- **Ruta:** [recharge-purchases-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-purchases-table/recharge-purchases-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-purchases-table/recharge-purchases-table.component.ts`, 35 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** Dumb table over "Compras de Recargas" — every individually-registered purchase for the page's operation date, with its own "Revertir" action (never a physical delete/edit — see `RechargesService.voidPurchase`).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [recharge-purchases-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-purchases-table/recharge-purchases-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="revertRequested.emit(purchase)"`

#### Clase `RechargePurchasesTableComponent` (L16–34)

- **Decoradores:** `@Component({ selector: 'app-recharge-purchases-table', standalone: true, imports: [IconComponent, DatePipe], templateUrl: './recharge-purchases-table.component.h`
- **Propósito:** Dumb table over "Compras de Recargas" — every individually-registered purchase for the page's operation date, with its own "Revertir" action (never a physical delete/edit — see `RechargesService.voidPurchase`). "Revertir" only ever renders for an admin (`isAdmin`) AND only when the row's own `canRevert` says so (not already voided, cuadre cycle still open) — mirrors `RechargeTableComponent`'s own admin-gated saldo final re-edit pattern exactly, since this page has no route-level admin guard.
- **Datos / estado que administra:** `@Input purchases = []`, `@Input loading = false`, `@Input isAdmin = false`, `@Output revertRequested = new EventEmitter<RechargePurchase>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-sale-delete-confirm-modal-recharge-sale-delete-confirm-modal-component-ts"></a>

### recharge-sale-delete-confirm-modal.component.ts

- **Ruta:** [recharge-sale-delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-delete-confirm-modal/recharge-sale-delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-delete-confirm-modal/recharge-sale-delete-confirm-modal.component.ts`, 25 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** Dumb — the page owns the actual `deleteSale` call, same split as Categories'/Compras' own delete-confirm modals.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [recharge-sale-delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-delete-confirm-modal/recharge-sale-delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `RechargeSaleDeleteConfirmModalComponent` (L7–24)

- **Decoradores:** `@Component({ selector: 'app-recharge-sale-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './recharge-sale-delet`
- **Propósito:** Dumb — the page owns the actual `deleteSale` call, same split as Categories'/Compras' own delete-confirm modals.
- **Datos / estado que administra:** `@Input open = false`, `@Input sale = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-sale-form-modal-recharge-sale-form-modal-component-ts"></a>

### recharge-sale-form-modal.component.ts

- **Ruta:** [recharge-sale-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-form-modal/recharge-sale-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-form-modal/recharge-sale-form-modal.component.ts`, 137 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** Self-contained (like `CategoryFormModalComponent`) — calls `RechargesService` directly and emits the saved row.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [recharges.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharges-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [recharge-sale-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-form-modal/recharge-sale-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `RechargeSaleFormModalComponent` (L32–136)

- **Decoradores:** `@Component({ selector: 'app-recharge-sale-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective], t`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Self-contained (like `CategoryFormModalComponent`) — calls `RechargesService` directly and emits the saved row. Handles both create (`sale = null`) and edit (`sale` set) the same way that component distinguishes them via one `@Input()`, rather than two separate modals. The recharge type is locked (disabled, not hidden) once editing — see the backend's own `update_recharge_sale`, which never accepts a type change.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `rechargesService = inject(RechargesService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input types = []`, `@Input operationDate = ''`, `@Input sale = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<RechargeSale>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 64–66 | — | `boolean` |
| `ngOnChanges` | método public | 68–91 | `changes: SimpleChanges` | `void` |
| `submit` | método public | 93–128 | — | `void` |
| `close` | método public | 130–135 | — | `void` |

##### `RechargeSaleFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [recharge-sale-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-form-modal/recharge-sale-form-modal.component.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSaleFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [recharge-sale-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-form-modal/recharge-sale-form-modal.component.ts#L68) (L68–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`, `this.form.controls.rechargeTypeId.disable`, `this.form.controls.rechargeTypeId.enable`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSaleFormModalComponent.submit`

- **Firma:** `submit(): void` — [recharge-sale-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-form-modal/recharge-sale-form-modal.component.ts#L93) (L93–128)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.rechargesService.updateSale`, `this.rechargesService.registerSale`, `request$.subscribe`, `this.notificationService.success`, `formatCurrency`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `recharge-sale-form-modal.component.html` (plantilla)

##### `RechargeSaleFormModalComponent.close`

- **Firma:** `close(): void` — [recharge-sale-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-form-modal/recharge-sale-form-modal.component.ts#L130) (L130–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `recharge-sale-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-sales-table-recharge-sales-table-component-ts"></a>

### recharge-sales-table.component.ts

- **Ruta:** [recharge-sales-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sales-table/recharge-sales-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sales-table/recharge-sales-table.component.ts`, 37 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** Dumb table over "Recargas Vendidas" — the individual customer top-ups recorded for the page's operation date.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [recharge-sales-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sales-table/recharge-sales-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="editRequested.emit(sale)"`, `(click)="deleteRequested.emit(sale)"`

#### Clase `RechargeSalesTableComponent` (L16–36)

- **Decoradores:** `@Component({ selector: 'app-recharge-sales-table', standalone: true, imports: [IconComponent, DatePipe], templateUrl: './recharge-sales-table.component.html', st`
- **Propósito:** Dumb table over "Recargas Vendidas" — the individual customer top-ups recorded for the page's operation date. `locked` rows (their operator's saldo final was already registered) hide the edit/delete actions instead of showing them disabled, since a locked row is finished history, not a temporarily-unavailable action — same reasoning `RechargeTableComponent` uses for its own "día cerrado" hint, just without a "solo un administrador" escape hatch (see this feature's own domain error).
- **Datos / estado que administra:** `@Input sales = []`, `@Input loading = false`, `@Input dayLockReason = null`, `@Output editRequested = new EventEmitter<RechargeSale>()`, `@Output deleteRequested = new EventEmitter<RechargeSale>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-table-recharge-table-component-ts"></a>

### recharge-table.component.ts

- **Ruta:** [recharge-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-table/recharge-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-table/recharge-table.component.ts`, 119 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** Dumb table over today's balances — one row per active recharge type.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [recharge-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-table/recharge-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(input)="onFinalBalanceInput(balance, $any($event.target).value)"`, `(click)="save(balance)"`

**Interfaces, tipos y enums:**

- `interface RequestFinalBalanceEvent` (L15): sin documentación — miembros: `balance`, `finalBalance`

#### Clase `RechargeTableComponent` (L27–118)

- **Decoradores:** `@Component({ selector: 'app-recharge-table', standalone: true, imports: [ButtonComponent, IconComponent, DecimalInputDirective], templateUrl: './recharge-table.c`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Dumb table over today's balances — one row per active recharge type. The "Saldo Final" cell is the only editable one; "Compra" is a read-only running total, always computed by the backend (`dailyBalance - previousBalance`), never entered directly here (that's what the separate "Registrar compra" form is for).
- **Datos / estado que administra:** `@Input balances = []`, `@Input loading = false`, `@Input isAdmin = false`, `@Input dayLockReason = null`, `@Output requestFinalBalance = new EventEmitter<RequestFinalBalanceEvent>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 58–67 | `changes: SimpleChanges` | `void` |
| `onFinalBalanceInput` | método public | 69–71 | `balance: RechargeDailyBalance`, `value: string` | `void` |
| `canEditFinalBalance` | método public | 74–76 | `balance: RechargeDailyBalance` | `boolean` |
| `canSave` | método public | 78–80 | `balance: RechargeDailyBalance` | `boolean` |
| `finalBalanceError` | método public | 90–105 | `balance: RechargeDailyBalance` | `string \| null` |
| `draftHasValue` | método private | 107–110 | `balance: RechargeDailyBalance` | `boolean` |
| `save` | método public | 112–117 | `balance: RechargeDailyBalance` | `void` |

##### `RechargeTableComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [recharge-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-table/recharge-table.component.ts#L58) (L58–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeTableComponent.onFinalBalanceInput`

- **Firma:** `onFinalBalanceInput(balance: RechargeDailyBalance, value: string): void` — [recharge-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-table/recharge-table.component.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recharge-table.component.html` (plantilla)

##### `RechargeTableComponent.canEditFinalBalance`

- **Firma:** `canEditFinalBalance(balance: RechargeDailyBalance): boolean` — [recharge-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-table/recharge-table.component.ts#L74) (L74–76)
- **Propósito / descripción:** A day already closed can only be re-edited by an admin — same rule `RegisterRechargeFinalBalanceUseCase` enforces server-side. A day locked via "Cerrar Día" (or not yet opened) blocks everyone, admin included.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recharge-table.component.html` (plantilla), (mismo archivo)

##### `RechargeTableComponent.canSave`

- **Firma:** `canSave(balance: RechargeDailyBalance): boolean` — [recharge-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-table/recharge-table.component.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canEditFinalBalance`, `this.draftHasValue`, `this.finalBalanceError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recharge-table.component.html` (plantilla), (mismo archivo)

##### `RechargeTableComponent.finalBalanceError`

- **Firma:** `finalBalanceError(balance: RechargeDailyBalance): string \| null` — [recharge-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-table/recharge-table.component.ts#L90) (L90–105)
- **Propósito / descripción:** Explains exactly why "Guardar" is disabled instead of leaving the button silently grayed out — a typed value over the daily balance (a real, backend-enforced rule: `FINAL_BALANCE_EXCEEDS_DAILY`) used to look indistinguishable from a broken input once it grew past a few digits, since nothing on screen said why. `null` means either there's nothing to validate yet (empty draft) or the value is valid.
- **Dependencias (llamadas en su cuerpo):** `this.canEditFinalBalance`, `this.draftHasValue`, `Number`, `Number.isFinite`, `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recharge-table.component.html` (plantilla), (mismo archivo)

##### `RechargeTableComponent.draftHasValue`

- **Firma:** `draftHasValue(balance: RechargeDailyBalance): boolean` — [recharge-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-table/recharge-table.component.ts#L107) (L107–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `raw.trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `RechargeTableComponent.save`

- **Firma:** `save(balance: RechargeDailyBalance): void` — [recharge-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-table/recharge-table.component.ts#L112) (L112–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSave`, `this.requestFinalBalance.emit`, `Number`
- **Efectos secundarios:** Emite eventos: `this.requestFinalBalance.emit`
- **Consumidores:** `recharge-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-purchase-form-register-purchase-form-component-ts"></a>

### register-purchase-form.component.ts

- **Ruta:** [register-purchase-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-purchase-form/register-purchase-form.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-purchase-form/register-purchase-form.component.ts`, 112 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** Self-contained, like `CategoryFormModalComponent`/`ProductFormModalComponent` — calls `RechargesService` directly and emits the updated row so the parent only has to merge it into its `balances` list, rather than owning the request itself.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [recharges.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharges-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [register-purchase-form.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-purchase-form/register-purchase-form.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngSubmit)="submit()"`

#### Clase `RegisterPurchaseFormComponent` (L32–111)

- **Decoradores:** `@Component({ selector: 'app-register-purchase-form', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective], tem`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Self-contained, like `CategoryFormModalComponent`/`ProductFormModalComponent` — calls `RechargesService` directly and emits the updated row so the parent only has to merge it into its `balances` list, rather than owning the request itself. Now confirms via the global `ConfirmDialogService` before submitting (this form had no confirmation step before the Monto de Compra/Acreditado ticket) — the promise resolves and closes immediately, the pre-existing `isSubmitting` signal takes over from there, same pattern already used by the 11 CRUD form-modals migrated to this service.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `rechargesService = inject(RechargesService)`, `notificationService = inject(NotificationService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input types = []`, `@Input operationDate = ''`, `@Input lockReason = null`, `@Output registered = new EventEmitter<RechargeDailyBalance>()`, `isSubmitting = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 62–66 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 68–110 | — | `Promise<void>` |

##### `RegisterPurchaseFormComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [register-purchase-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-purchase-form/register-purchase-form.component.ts#L62) (L62–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.form.controls.rechargeTypeId.setValue`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RegisterPurchaseFormComponent.submit`

- **Firma:** `submit(): Promise<void>` — [register-purchase-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-purchase-form/register-purchase-form.component.ts#L68) (L68–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.confirmDialogService.confirm`, `formatCurrency`, `this.isSubmitting.set`, `this.rechargesService.registerPurchase`, `this.form.controls.purchaseAmount.reset`, `this.form.controls.creditedAmount.reset`, `this.notificationService.success`, `this.registered.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSubmitting.set`; Emite eventos: `this.registered.emit`
- **Consumidores:** `register-purchase-form.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-purchase-form-register-sim-purchase-form-component-ts"></a>

### register-sim-purchase-form.component.ts

- **Ruta:** [register-sim-purchase-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-purchase-form/register-sim-purchase-form.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-purchase-form/register-sim-purchase-form.component.ts`, 123 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** "Compra de SIM" — deliberately a separate component from `RegisterPurchaseFormComponent` (never mixed with "Monto de Compra"/"Monto Acreditado" saldo electrónico), same shape (self-contained, `types`/`operationDate`/`lockReason` in, `registered` out, `ConfirmDialogService` before submitting).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [recharge-sims.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-sims-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [register-sim-purchase-form.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-purchase-form/register-sim-purchase-form.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngSubmit)="submit()"`, `(change)="onTypeChange($any($event.target).value)"`

#### Clase `RegisterSimPurchaseFormComponent` (L35–122)

- **Decoradores:** `@Component({ selector: 'app-register-sim-purchase-form', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './regist`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Compra de SIM" — deliberately a separate component from `RegisterPurchaseFormComponent` (never mixed with "Monto de Compra"/"Monto Acreditado" saldo electrónico), same shape (self-contained, `types`/`operationDate`/`lockReason` in, `registered` out, `ConfirmDialogService` before submitting). Only Cantidad is a real input — el costo lo determina siempre el servidor a partir de `recharge_sim_types`, nunca el cliente; el precio/total mostrados aquí son solo una vista previa.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `simsService = inject(RechargeSimsService)`, `notificationService = inject(NotificationService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input types = []`, `@Input operationDate = ''`, `@Input lockReason = null`, `@Output registered = new EventEmitter<SimDailyStock>()`, `isSubmitting = signal(false)`, `selectedType = signal<SimType \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 67–72 | `changes: SimpleChanges` | `void` |
| `onTypeChange` | método public | 74–76 | `id: string` | `void` |
| `previewUnitCost` | getter public | 78–80 | — | `number` |
| `previewTotal` | getter public | 82–84 | — | `number` |
| `submit` | método public async | 86–121 | — | `Promise<void>` |

##### `RegisterSimPurchaseFormComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [register-sim-purchase-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-purchase-form/register-sim-purchase-form.component.ts#L67) (L67–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.form.controls.simTypeId.setValue`, `this.selectedType.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedType.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RegisterSimPurchaseFormComponent.onTypeChange`

- **Firma:** `onTypeChange(id: string): void` — [register-sim-purchase-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-purchase-form/register-sim-purchase-form.component.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedType.set`, `this.types.find`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedType.set`
- **Consumidores:** `register-sim-purchase-form.component.html` (plantilla)

##### `RegisterSimPurchaseFormComponent.previewUnitCost`

- **Firma:** `previewUnitCost(): number` — [register-sim-purchase-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-purchase-form/register-sim-purchase-form.component.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedType`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RegisterSimPurchaseFormComponent.previewTotal`

- **Firma:** `previewTotal(): number` — [register-sim-purchase-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-purchase-form/register-sim-purchase-form.component.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RegisterSimPurchaseFormComponent.submit`

- **Firma:** `submit(): Promise<void>` — [register-sim-purchase-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-purchase-form/register-sim-purchase-form.component.ts#L86) (L86–121)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.selectedType`, `this.confirmDialogService.confirm`, `formatCurrency`, `this.isSubmitting.set`, `this.simsService.registerPurchase`, `this.form.controls.quantity.reset`, `this.notificationService.success`, `this.registered.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSubmitting.set`; Emite eventos: `this.registered.emit`
- **Consumidores:** `register-sim-purchase-form.component.html` (plantilla)

#### Función `integerValidator` (L22–24)

- **Tipo:** función local del archivo
- **Firma:** `integerValidator(control: AbstractControl): ValidationErrors \| null` — [register-sim-purchase-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-purchase-form/register-sim-purchase-form.component.ts#L22)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number.isInteger`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-sale-form-register-sim-sale-form-component-ts"></a>

### register-sim-sale-form.component.ts

- **Ruta:** [register-sim-sale-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts`, 132 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** "Venta de SIM" — deliberately separate from `RechargeSaleFormModalComponent` (venta de recarga electrónica, teléfono + monto): esta vende inventario físico por cantidad, nunca afecta el saldo electrónico.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [recharge-sims.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-sims-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [register-sim-sale-form.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngSubmit)="submit()"`, `(change)="onTypeChange($any($event.target).value)"`

#### Clase `RegisterSimSaleFormComponent` (L34–131)

- **Decoradores:** `@Component({ selector: 'app-register-sim-sale-form', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './register-s`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Venta de SIM" — deliberately separate from `RechargeSaleFormModalComponent` (venta de recarga electrónica, teléfono + monto): esta vende inventario físico por cantidad, nunca afecta el saldo electrónico. El stock disponible ("no vender más de las existentes") se valida aquí como una ayuda de UX — la garantía real es la función SQL `register_recharge_sim_sale`, que rechaza bajo `FOR UPDATE` incluso si este chequeo quedó desactualizado.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `simsService = inject(RechargeSimsService)`, `notificationService = inject(NotificationService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input types = []`, `@Input stockByTypeId = {}`, `@Input operationDate = ''`, `@Input lockReason = null`, `@Output registered = new EventEmitter<SimDailyStock>()`, `isSubmitting = signal(false)`, `selectedType = signal<SimType \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 66–71 | `changes: SimpleChanges` | `void` |
| `onTypeChange` | método public | 73–75 | `id: string` | `void` |
| `previewUnitPrice` | getter public | 77–79 | — | `number` |
| `previewTotal` | getter public | 81–83 | — | `number` |
| `availableStock` | getter public | 85–88 | — | `number` |
| `exceedsStock` | getter public | 90–93 | — | `boolean` |
| `submit` | método public async | 95–130 | — | `Promise<void>` |

##### `RegisterSimSaleFormComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [register-sim-sale-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts#L66) (L66–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.form.controls.simTypeId.setValue`, `this.selectedType.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedType.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RegisterSimSaleFormComponent.onTypeChange`

- **Firma:** `onTypeChange(id: string): void` — [register-sim-sale-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedType.set`, `this.types.find`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedType.set`
- **Consumidores:** `register-sim-sale-form.component.html` (plantilla)

##### `RegisterSimSaleFormComponent.previewUnitPrice`

- **Firma:** `previewUnitPrice(): number` — [register-sim-sale-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedType`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RegisterSimSaleFormComponent.previewTotal`

- **Firma:** `previewTotal(): number` — [register-sim-sale-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RegisterSimSaleFormComponent.availableStock`

- **Firma:** `availableStock(): number` — [register-sim-sale-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts#L85) (L85–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedType`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RegisterSimSaleFormComponent.exceedsStock`

- **Firma:** `exceedsStock(): boolean` — [register-sim-sale-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts#L90) (L90–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RegisterSimSaleFormComponent.submit`

- **Firma:** `submit(): Promise<void>` — [register-sim-sale-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts#L95) (L95–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.selectedType`, `this.confirmDialogService.confirm`, `formatCurrency`, `this.isSubmitting.set`, `this.simsService.registerSale`, `this.form.controls.quantity.reset`, `this.notificationService.success`, `this.registered.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSubmitting.set`; Emite eventos: `this.registered.emit`
- **Consumidores:** `register-sim-sale-form.component.html` (plantilla)

#### Función `integerValidator` (L22–24)

- **Tipo:** función local del archivo
- **Firma:** `integerValidator(control: AbstractControl): ValidationErrors \| null` — [register-sim-sale-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts#L22)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number.isInteger`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-sale-registration-form-register-sim-sale-registration-form-component-ts"></a>

### register-sim-sale-registration-form.component.ts

- **Ruta:** [register-sim-sale-registration-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts`, 199 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** "Venta de SIM con registro de identidad" — deliberately separate from `RegisterSimSaleFormComponent` above it in the same SIM section (that one stays exactly as it was: a quick by-quantity sale, no DPI).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [recharge-sims.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-sims-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [client-search-select.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-client-search-select-client-search-select-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [register-sim-sale-registration-form.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [client-search-select.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngSubmit)="submit()"`, `(change)="onTypeChange($any($event.target).value)"`, `(selectionChange)="onClientChange($event)"`, `(click)="removeDpiImage()"`, `(change)="onDpiImageSelected($event)"`

#### Clase `RegisterSimSaleRegistrationFormComponent` (L42–198)

- **Decoradores:** `@Component({ selector: 'app-register-sim-sale-registration-form', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent, ClientSearchSe`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Venta de SIM con registro de identidad" — deliberately separate from `RegisterSimSaleFormComponent` above it in the same SIM section (that one stays exactly as it was: a quick by-quantity sale, no DPI). This one always sells exactly one physical unit, with número de SIM/SKU/DPI del comprador/cliente opcional/foto — see `RechargeSimsService .registerSaleRegistration`'s own doc comment for why this travels as `FormData`. `salePrice` defaults to the type's catalog price on selection but stays freely editable — a real, independently-entered value (a negotiated/promotional sale is legitimate), not a read-only echo of the catalog.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `simsService = inject(RechargeSimsService)`, `notificationService = inject(NotificationService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input types = []`, `@Input operationDate = ''`, `@Input lockReason = null`, `@Output registered = new EventEmitter<SimSaleRegistration>()`, `isSubmitting = signal(false)`, `selectedType = signal<SimType \| null>(null)`, `selectedClient = signal<Client \| null>(null)`, `dpiImageFile = signal<File \| null>(null)`, `dpiImagePreviewUrl = signal<string \| null>(null)`, `imageError = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 79–83 | `changes: SimpleChanges` | `void` |
| `onTypeChange` | método public | 85–88 | `id: string` | `void` |
| `selectType` | método private | 90–96 | `type: SimType \| null` | `void` |
| `onClientChange` | método public | 98–100 | `client: Client \| null` | `void` |
| `onDpiImageSelected` | método public | 102–123 | `event: Event` | `void` |
| `removeDpiImage` | método public | 125–129 | — | `void` |
| `clearDpiImagePreview` | método private | 131–137 | — | `void` |
| `submit` | método public async | 139–186 | — | `Promise<void>` |
| `resetForm` | método private | 188–197 | — | `void` |

##### `RegisterSimSaleRegistrationFormComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [register-sim-sale-registration-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts#L79) (L79–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectType`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RegisterSimSaleRegistrationFormComponent.onTypeChange`

- **Firma:** `onTypeChange(id: string): void` — [register-sim-sale-registration-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts#L85) (L85–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.types.find`, `this.selectType`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `register-sim-sale-registration-form.component.html` (plantilla)

##### `RegisterSimSaleRegistrationFormComponent.selectType`

- **Firma:** `selectType(type: SimType \| null): void` — [register-sim-sale-registration-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts#L90) (L90–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedType.set`, `this.form.controls.simTypeId.setValue`, `this.form.controls.salePrice.setValue`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedType.set`
- **Consumidores:** (mismo archivo)

##### `RegisterSimSaleRegistrationFormComponent.onClientChange`

- **Firma:** `onClientChange(client: Client \| null): void` — [register-sim-sale-registration-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts#L98) (L98–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedClient.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedClient.set`
- **Consumidores:** `register-sim-sale-registration-form.component.html` (plantilla)

##### `RegisterSimSaleRegistrationFormComponent.onDpiImageSelected`

- **Firma:** `onDpiImageSelected(event: Event): void` — [register-sim-sale-registration-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts#L102) (L102–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageError.set`, `ALLOWED_IMAGE_TYPES.has`, `this.clearDpiImagePreview`, `this.dpiImageFile.set`, `this.dpiImagePreviewUrl.set`, `URL.createObjectURL`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageError.set`, `this.dpiImageFile.set`, `this.dpiImagePreviewUrl.set`
- **Consumidores:** `register-sim-sale-registration-form.component.html` (plantilla)

##### `RegisterSimSaleRegistrationFormComponent.removeDpiImage`

- **Firma:** `removeDpiImage(): void` — [register-sim-sale-registration-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts#L125) (L125–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clearDpiImagePreview`, `this.dpiImageFile.set`, `this.imageError.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.dpiImageFile.set`, `this.imageError.set`
- **Consumidores:** `register-sim-sale-registration-form.component.html` (plantilla)

##### `RegisterSimSaleRegistrationFormComponent.clearDpiImagePreview`

- **Firma:** `clearDpiImagePreview(): void` — [register-sim-sale-registration-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts#L131) (L131–137)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dpiImagePreviewUrl`, `URL.revokeObjectURL`, `this.dpiImagePreviewUrl.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.dpiImagePreviewUrl.set`
- **Consumidores:** (mismo archivo)

##### `RegisterSimSaleRegistrationFormComponent.submit`

- **Firma:** `submit(): Promise<void>` — [register-sim-sale-registration-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts#L139) (L139–186)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.selectedType`, `this.selectedClient`, `this.confirmDialogService.confirm`, `formatCurrency`, `this.isSubmitting.set`, `this.simsService.registerSaleRegistration`, `simNumber.trim`, `sku.trim`, `clientDpi.trim`, `this.dpiImageFile`, `this.notificationService.success`, `this.resetForm`, `this.registered.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSubmitting.set`; Emite eventos: `this.registered.emit`
- **Consumidores:** `register-sim-sale-registration-form.component.html` (plantilla)

##### `RegisterSimSaleRegistrationFormComponent.resetForm`

- **Firma:** `resetForm(): void` — [register-sim-sale-registration-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts#L188) (L188–197)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.form.reset`, `this.selectedClient.set`, `this.clearDpiImagePreview`, `this.dpiImageFile.set`, `this.imageError.set`, `this.selectType`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedClient.set`, `this.dpiImageFile.set`, `this.imageError.set`
- **Consumidores:** (mismo archivo)

#### Función `priceValidator` (L26–28)

- **Tipo:** función local del archivo
- **Firma:** `priceValidator(control: AbstractControl): ValidationErrors \| null` — [register-sim-sale-registration-form.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts#L26)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-sales-summary-card-sales-summary-card-component-ts"></a>

### sales-summary-card.component.ts

- **Ruta:** [sales-summary-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sales-summary-card/sales-summary-card.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/sales-summary-card/sales-summary-card.component.ts`, 228 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** Self-contained, like `RegisterPurchaseFormComponent` — fetches and saves through `RechargesService` directly rather than routing through the page.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [recharges.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharges-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [sales-summary-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sales-summary-card/sales-summary-card.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(input)="onTotalCollectedInput($any($event.target).value)"`, `(click)="save()"`

#### Clase `SalesSummaryCardComponent` (L54–227)

- **Decoradores:** `@Component({ selector: 'app-recharge-sales-summary-card', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, BadgeComponent, DecimalInputDi`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Self-contained, like `RegisterPurchaseFormComponent` — fetches and saves through `RechargesService` directly rather than routing through the page. Unlike the final-balance flow, the ticket for this Card specifies no confirmation modal: the result/color preview updates live as the user types, which already *is* the confirmation before clicking "Guardar".
- **Servicios inyectados con `inject()`:** `rechargesService = inject(RechargesService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `@Input operationDate = ''`, `@Input refreshTrigger = 0`, `@Input lockReason = null`, `@Output closureSaved = new EventEmitter<void>()`, `@Output summaryLoaded = new EventEmitter<RechargeSalesSummary \| null>()`, `summary = signal<RechargeSalesSummary \| null>(null)`, `loading = signal(true)`, `isSaving = signal(false)`, `totalCollectedDraft = signal<number \| null>(null)`, `previewResult = computed(() => { const summary = this.summary(); c`, `previewStatus = computed<SalesClosureStatus \| null>(() => { const `, `statusTone = computed(() => { const status = this.previewStatus`, `statusIcon = computed(() => { const status = this.previewStatus`, `statusText = computed(() => { const status = this.previewStatus`, `savedStatus = computed<SalesClosureStatus \| null>(() => { const `, `savedStatusTone = computed(() => { const status = this.savedStatus()`, `savedStatusIcon = computed(() => { const status = this.savedStatus()`, `savedStatusText = computed(() => { const status = this.savedStatus()`, `canSave = computed(() => { const summary = this.summary(); c`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 163–175 | `changes: SimpleChanges` | `void` |
| `fetchSummary` | método private | 177–192 | — | `void` |
| `onTotalCollectedInput` | método public | 194–201 | `value: string` | `void` |
| `save` | método public | 203–226 | — | `void` |

##### `SalesSummaryCardComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [sales-summary-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sales-summary-card/sales-summary-card.component.ts#L163) (L163–175)
- **Propósito / descripción:** No fetch here — `@Input() operationDate` isn't set by Angular until after the constructor runs, so fetching this early would silently query with the class field's `''` default (the backend would then fall back to ITS OWN "today", which can be a different calendar day than the browser's if the API server's clock is in a different timezone). The initial fetch happens in `ngOnChanges`'s first-change branch below instead, once `operationDate` actually holds the parent's real value.
- **Dependencias (llamadas en su cuerpo):** `this.totalCollectedDraft.set`, `this.fetchSummary`
- **Efectos secundarios:** Actualiza estado (signals): `this.totalCollectedDraft.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesSummaryCardComponent.fetchSummary`

- **Firma:** `fetchSummary(): void` — [sales-summary-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sales-summary-card/sales-summary-card.component.ts#L177) (L177–192)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.rechargesService.getSalesSummary(this.operationDate).subscribe`, `this.rechargesService.getSalesSummary`, `this.summary.set`, `this.summaryLoaded.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.summary.set`; Emite eventos: `this.summaryLoaded.emit`
- **Consumidores:** (mismo archivo)

##### `SalesSummaryCardComponent.onTotalCollectedInput`

- **Firma:** `onTotalCollectedInput(value: string): void` — [sales-summary-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sales-summary-card/sales-summary-card.component.ts#L194) (L194–201)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `value.trim`, `this.totalCollectedDraft.set`, `Number`, `Number.isFinite`
- **Efectos secundarios:** Actualiza estado (signals): `this.totalCollectedDraft.set`
- **Consumidores:** `sales-summary-card.component.html` (plantilla)

##### `SalesSummaryCardComponent.save`

- **Firma:** `save(): void` — [sales-summary-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sales-summary-card/sales-summary-card.component.ts#L203) (L203–226)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSave`, `this.isSaving`, `this.isSaving.set`, `this.rechargesService.registerSalesClosure`, `this.totalCollectedDraft`, `this.summary.set`, `this.summaryLoaded.emit`, `this.totalCollectedDraft.set`, `this.notificationService.success`, `this.closureSaved.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.summary.set`, `this.totalCollectedDraft.set`; Emite eventos: `this.summaryLoaded.emit`, `this.closureSaved.emit`
- **Consumidores:** `sales-summary-card.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-sim-sales-table-sim-sales-table-component-ts"></a>

### sim-sales-table.component.ts

- **Ruta:** [sim-sales-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sim-sales-table/sim-sales-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/sim-sales-table/sim-sales-table.component.ts`, 34 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** Dumb table over "Vender SIM" (por cantidad) — every quick sale for the page's operation date, with its own "Revertir" action (never a physical delete/edit — see `RechargeSimsService.voidSale`).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [sim-sales-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sim-sales-table/sim-sales-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="revertRequested.emit(sale)"`

#### Clase `SimSalesTableComponent` (L15–33)

- **Decoradores:** `@Component({ selector: 'app-sim-sales-table', standalone: true, imports: [IconComponent, DatePipe], templateUrl: './sim-sales-table.component.html', styleUrl: '.`
- **Propósito:** Dumb table over "Vender SIM" (por cantidad) — every quick sale for the page's operation date, with its own "Revertir" action (never a physical delete/edit — see `RechargeSimsService.voidSale`). Exact structural clone of `RechargePurchasesTableComponent`: "Revertir" only ever renders for an admin (`isAdmin`) AND only when the row's own `canRevert` says so (not already voided, recharge day still open).
- **Datos / estado que administra:** `@Input sales = []`, `@Input loading = false`, `@Input isAdmin = false`, `@Output revertRequested = new EventEmitter<SimSale>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-sim-stock-table-sim-stock-table-component-ts"></a>

### sim-stock-table.component.ts

- **Ruta:** [sim-stock-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sim-stock-table/sim-stock-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/sim-stock-table/sim-stock-table.component.ts`, 27 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** Dumb, read-only table for the SIM block of the cuadre — Stock Inicial \| Compras \| Ventas \| Stock Final, one row per SIM type.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [sim-stock-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sim-stock-table/sim-stock-table.component.html)

#### Clase `SimStockTableComponent` (L13–26)

- **Decoradores:** `@Component({ selector: 'app-sim-stock-table', standalone: true, imports: [], templateUrl: './sim-stock-table.component.html', styleUrl: './sim-stock-table.compon`
- **Propósito:** Dumb, read-only table for the SIM block of the cuadre — Stock Inicial \| Compras \| Ventas \| Stock Final, one row per SIM type. Unlike `RechargeTableComponent`, no cell is editable: "Stock Final" is always `currentStock`, the live result of every purchase/sale that day — there is no separate "confirm the close-out figure" step for physical stock the way there is for the electronic balance's `finalBalance`.
- **Datos / estado que administra:** `@Input stocks = []`, `@Input loading = false`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-void-purchase-confirm-modal-void-purchase-confirm-modal-component-ts"></a>

### void-purchase-confirm-modal.component.ts

- **Ruta:** [void-purchase-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.ts`, 63 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** "Revertir compra" — dumb, same pattern as Transaccionar's own `VoidConfirmModalComponent`: the parent (`RechargesPageComponent`) owns the actual `RechargesService.voidPurchase` call.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [purchases-admin-page.component.ts (plantilla)](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-purchases-admin-page-component-ts) (plantilla), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [void-purchase-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="onCancel()"`, `(ngModelChange)="reason.set($event)"`, `(click)="onConfirm()"`

#### Clase `VoidPurchaseConfirmModalComponent` (L18–62)

- **Decoradores:** `@Component({ selector: 'app-void-purchase-confirm-modal', standalone: true, imports: [FormsModule, DatePipe, ButtonComponent, IconComponent], templateUrl: './voi`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Revertir compra" — dumb, same pattern as Transaccionar's own `VoidConfirmModalComponent`: the parent (`RechargesPageComponent`) owns the actual `RechargesService.voidPurchase` call. Never closes on a backdrop click — same as every other confirm modal in this app (none of them wire a close handler onto `.modal-backdrop`), which is exactly the "no debe cerrarse al hacer click afuera" requirement for this one.
- **Datos / estado que administra:** `@Input open = false`, `@Input purchase = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 38–42 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 44–46 | — | `boolean` |
| `onCancel` | método public | 48–54 | — | `void` |
| `onConfirm` | método public | 56–61 | — | `void` |

##### `VoidPurchaseConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [void-purchase-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.ts#L38) (L38–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `VoidPurchaseConfirmModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [void-purchase-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `VoidPurchaseConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [void-purchase-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.ts#L48) (L48–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `void-purchase-confirm-modal.component.html` (plantilla)

##### `VoidPurchaseConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [void-purchase-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.ts#L56) (L56–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `void-purchase-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-void-sim-sale-confirm-modal-void-sim-sale-confirm-modal-component-ts"></a>

### void-sim-sale-confirm-modal.component.ts

- **Ruta:** [void-sim-sale-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-sim-sale-confirm-modal/void-sim-sale-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-sim-sale-confirm-modal/void-sim-sale-confirm-modal.component.ts`, 62 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** "Revertir venta" for the by-quantity "Vender SIM" flow — dumb, exact structural clone of `VoidPurchaseConfirmModalComponent`: the parent (`RechargesPageComponent`) owns the actual `RechargeSimsService.voidSale` call.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [void-sim-sale-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-sim-sale-confirm-modal/void-sim-sale-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="onCancel()"`, `(ngModelChange)="reason.set($event)"`, `(click)="onConfirm()"`

#### Clase `VoidSimSaleConfirmModalComponent` (L17–61)

- **Decoradores:** `@Component({ selector: 'app-void-sim-sale-confirm-modal', standalone: true, imports: [FormsModule, DatePipe, ButtonComponent, IconComponent], templateUrl: './voi`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Revertir venta" for the by-quantity "Vender SIM" flow — dumb, exact structural clone of `VoidPurchaseConfirmModalComponent`: the parent (`RechargesPageComponent`) owns the actual `RechargeSimsService.voidSale` call. Never closes on a backdrop click, same as every other confirm modal in this app.
- **Datos / estado que administra:** `@Input open = false`, `@Input sale = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 37–41 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 43–45 | — | `boolean` |
| `onCancel` | método public | 47–53 | — | `void` |
| `onConfirm` | método public | 55–60 | — | `void` |

##### `VoidSimSaleConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [void-sim-sale-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-sim-sale-confirm-modal/void-sim-sale-confirm-modal.component.ts#L37) (L37–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `VoidSimSaleConfirmModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [void-sim-sale-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-sim-sale-confirm-modal/void-sim-sale-confirm-modal.component.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `VoidSimSaleConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [void-sim-sale-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-sim-sale-confirm-modal/void-sim-sale-confirm-modal.component.ts#L47) (L47–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `void-sim-sale-confirm-modal.component.html` (plantilla)

##### `VoidSimSaleConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [void-sim-sale-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/void-sim-sale-confirm-modal/void-sim-sale-confirm-modal.component.ts#L55) (L55–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `void-sim-sale-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts"></a>

### recharges-page.component.ts

- **Ruta:** [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts`, 725 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges`
- **Responsabilidad:** Componente Angular: declara `RechargesPageComponent`, `emptyOperatorStat`, `todayIsoDate`, `CLARO_NAME`, `TIGO_NAME` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [recharges.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharges-service-ts), [recharge-sims.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-sims-service-ts), [recharge-day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-day-status-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [recharge-table.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-table-recharge-table-component-ts), [register-purchase-form.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-purchase-form-register-purchase-form-component-ts), [final-balance-confirm-modal.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-final-balance-confirm-modal-final-balance-confirm-modal-component-ts), [sales-summary-card.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-sales-summary-card-sales-summary-card-component-ts), [recharge-sales-table.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-sales-table-recharge-sales-table-component-ts), [recharge-purchases-table.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-purchases-table-recharge-purchases-table-component-ts), [void-purchase-confirm-modal.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-void-purchase-confirm-modal-void-purchase-confirm-modal-component-ts), [recharge-sale-form-modal.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-sale-form-modal-recharge-sale-form-modal-component-ts) y 10 más
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [recharges-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts), [gauge-ring.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-gauge-ring-gauge-ring-component-ts), [recharge-sales-table.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-sales-table-recharge-sales-table-component-ts), [recharge-table.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-table-recharge-table-component-ts), [recharge-purchases-table.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-purchases-table-recharge-purchases-table-component-ts), [register-purchase-form.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-purchase-form-register-purchase-form-component-ts), [sales-summary-card.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-sales-summary-card-sales-summary-card-component-ts), [sim-stock-table.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-sim-stock-table-sim-stock-table-component-ts), [sim-sales-table.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-sim-sales-table-sim-sales-table-component-ts), [register-sim-purchase-form.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-purchase-form-register-sim-purchase-form-component-ts), [register-sim-sale-form.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-sale-form-register-sim-sale-form-component-ts) y 8 más
- **Eventos enlazados en la plantilla:** `(change)="onDateChange($any($event.target).value)"`, `(click)="reopenEntryModal()"`, `(click)="openCloseDayModal()"`, `(retry)="fetchOperatorsSummary()"`, `(click)="openAddSaleModal()"`, `(editRequested)="openEditSaleModal($event)"`, `(deleteRequested)="requestDeleteSale($event)"`, `(requestFinalBalance)="onRequestFinalBalance($event)"`, `(revertRequested)="requestVoidPurchase($event)"`, `(registered)="onPurchaseRegistered($event)"`, `(closureSaved)="onClosureSaved()"`, `(summaryLoaded)="salesSummary.set($event)"`, `(revertRequested)="requestVoidSimSale($event)"`, `(registered)="onSimPurchaseRegistered($event)"`, `(registered)="onSimSaleRegistered($event)"`

#### Clase `RechargesPageComponent` (L62–724)

- **Decoradores:** `@Component({ selector: 'app-recharges-page', standalone: true, imports: [ RouterLink, PageHeaderComponent, RechargeTableComponent, RegisterPurchaseFormComponent,`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `rechargesService = inject(RechargesService)`, `simsService = inject(RechargeSimsService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`, `dayStatusService = inject(RechargeDayStatusService)`
- **Datos / estado que administra:** `operationDate = signal(todayIsoDate())`, `isTodayOperationDate = computed(() => this.operationDate() === this.maxSe`, `pastDateStatus = signal<RechargeDayStatus \| null>(null)`, `activeDayStatus = computed<RechargeDayStatus \| null>(() => this.isTo`, `effectiveDayClosed = computed(() => this.activeDayStatus()?.isClosed ==`, `isEditingUnlocked = computed( () => (!this.isTodayOperationDate() \|\| t`, `dayLockReason = computed<'closed' \| 'not_opened' \| null>(() => { i`, `isEntryConfirmModalOpen = signal(false)`, `isOpeningDay = signal(false)`, `isCloseDayConfirmModalOpen = signal(false)`, `isClosingDay = signal(false)`, `types = signal<RechargeType[]>([])`, `balances = signal<RechargeDailyBalance[]>([])`, `loading = signal(true)`, `simTypes = signal<SimType[]>([])`, `simStocks = signal<SimDailyStock[]>([])`, `simLoading = signal(true)`, `simSales = signal<SimSale[]>([])`, `simSalesLoading = signal(true)`, `isVoidSimSaleModalOpen = signal(false)`, `voidSimSaleTarget = signal<SimSale \| null>(null)`, `isVoidingSimSale = signal(false)`, `simStockByTypeId = computed<Record<string, number>>(() => { const map`, `isFinalBalanceModalOpen = signal(false)`, `finalBalanceTarget = signal<RechargeDailyBalance \| null>(null)`, `finalBalanceDraft = signal(0)`, `isSavingFinalBalance = signal(false)`, `salesSummaryRefreshTick = signal(0)`, `salesSummary = signal<RechargeSalesSummary \| null>(null)`, `sales = signal<RechargeSale[]>([])`…

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `confirmEntryModal` | método public | 266–281 | — | `void` |
| `cancelEntryModal` | método public | 283–288 | — | `void` |
| `reopenEntryModal` | método public | 291–293 | — | `void` |
| `openCloseDayModal` | método public | 295–297 | — | `void` |
| `cancelCloseDayModal` | método public | 299–304 | — | `void` |
| `confirmCloseDayModal` | método public | 306–328 | — | `void` |
| `fetchPastDateStatusIfNeeded` | método private | 331–340 | — | `void` |
| `fetchOperatorsSummary` | método public | 342–356 | — | `void` |
| `fetchAll` | método private | 358–396 | — | `void` |
| `fetchBalances` | método private | 398–432 | — | `void` |
| `fetchSimSales` | método private | 434–446 | — | `void` |
| `upsertSimStock` | método private | 448–453 | `stock: SimDailyStock` | `void` |
| `onSimPurchaseRegistered` | método public | 455–457 | `stock: SimDailyStock` | `void` |
| `onSimSaleRegistered` | método public | 459–463 | `stock: SimDailyStock` | `void` |
| `onSimSaleRegistrationCreated` | método public | 474–484 | — | `void` |
| `fetchSales` | método private | 486–498 | — | `void` |
| `fetchPurchases` | método private | 500–512 | — | `void` |
| `upsertBalance` | método private | 514–519 | `balance: RechargeDailyBalance` | `void` |
| `onDateChange` | método public | 522–530 | `date: string` | `void` |
| `onPurchaseRegistered` | método public | 532–535 | `balance: RechargeDailyBalance` | `void` |
| `requestVoidPurchase` | método public | 537–540 | `purchase: RechargePurchase` | `void` |
| `cancelVoidPurchase` | método public | 542–548 | — | `void` |
| `confirmVoidPurchase` | método public | 551–571 | `reason: string` | `void` |
| `onClosureSaved` | método public | 574–581 | — | `void` |
| `onRequestFinalBalance` | método public | 583–587 | `event: RequestFinalBalanceEvent` | `void` |
| `cancelFinalBalance` | método public | 589–595 | — | `void` |
| `confirmFinalBalance` | método public | 597–624 | — | `void` |
| `openAddSaleModal` | método public | 626–629 | — | `void` |
| `openEditSaleModal` | método public | 631–634 | `sale: RechargeSale` | `void` |
| `closeSaleModal` | método public | 636–639 | — | `void` |
| `onSaleSaved` | método public | 642–650 | `sale: RechargeSale` | `void` |
| `requestDeleteSale` | método public | 652–655 | `sale: RechargeSale` | `void` |
| `cancelDeleteSale` | método public | 657–663 | — | `void` |
| `confirmDeleteSale` | método public | 665–686 | — | `void` |
| `requestVoidSimSale` | método public | 688–691 | `sale: SimSale` | `void` |
| `cancelVoidSimSale` | método public | 693–699 | — | `void` |
| `confirmVoidSimSale` | método public | 702–723 | `reason: string` | `void` |

##### `RechargesPageComponent.confirmEntryModal`

- **Firma:** `confirmEntryModal(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L266) (L266–281)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isOpeningDay`, `this.isOpeningDay.set`, `this.dayStatusService.openDay().subscribe`, `this.dayStatusService.openDay`, `this.isEntryConfirmModalOpen.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isOpeningDay.set`, `this.isEntryConfirmModalOpen.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.cancelEntryModal`

- **Firma:** `cancelEntryModal(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L283) (L283–288)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isOpeningDay`, `this.isEntryConfirmModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isEntryConfirmModalOpen.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.reopenEntryModal`

- **Firma:** `reopenEntryModal(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L291) (L291–293)
- **Propósito / descripción:** The one re-entry point after cancelling the opening modal — shows it again, without navigating or reloading anything.
- **Dependencias (llamadas en su cuerpo):** `this.isEntryConfirmModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isEntryConfirmModalOpen.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.openCloseDayModal`

- **Firma:** `openCloseDayModal(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L295) (L295–297)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isCloseDayConfirmModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isCloseDayConfirmModalOpen.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.cancelCloseDayModal`

- **Firma:** `cancelCloseDayModal(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L299) (L299–304)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isClosingDay`, `this.isCloseDayConfirmModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isCloseDayConfirmModalOpen.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.confirmCloseDayModal`

- **Firma:** `confirmCloseDayModal(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L306) (L306–328)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isClosingDay`, `this.isClosingDay.set`, `this.isTodayOperationDate`, `this.dayStatusService.closeDay`, `this.rechargesService.closeDay`, `this.operationDate`, `close$.subscribe`, `this.isCloseDayConfirmModalOpen.set`, `this.pastDateStatus.set`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isClosingDay.set`, `this.isCloseDayConfirmModalOpen.set`, `this.pastDateStatus.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.fetchPastDateStatusIfNeeded`

- **Firma:** `fetchPastDateStatusIfNeeded(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L331) (L331–340)
- **Propósito / descripción:** Only queries for a past date — today is already covered by the `RechargeDayStatusService` singleton.
- **Dependencias (llamadas en su cuerpo):** `this.isTodayOperationDate`, `this.pastDateStatus.set`, `this.rechargesService.getDayStatus(this.operationDate()).subscribe`, `this.rechargesService.getDayStatus`, `this.operationDate`
- **Efectos secundarios:** Actualiza estado (signals): `this.pastDateStatus.set`
- **Consumidores:** (mismo archivo)

##### `RechargesPageComponent.fetchOperatorsSummary`

- **Firma:** `fetchOperatorsSummary(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L342) (L342–356)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.operatorsSummaryLoading.set`, `this.operatorsSummaryError.set`, `this.rechargesService.getOperatorsSummary().pipe(catchError(() => of(null))).subscribe`, `this.rechargesService.getOperatorsSummary().pipe`, `this.rechargesService.getOperatorsSummary`, `catchError`, `of`, `this.operators.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.operatorsSummaryLoading.set`, `this.operatorsSummaryError.set`, `this.operators.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.fetchAll`

- **Firma:** `fetchAll(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L358) (L358–396)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.salesLoading.set`, `this.simLoading.set`, `this.purchasesLoading.set`, `this.simSalesLoading.set`, `forkJoin`, `this.rechargesService.getTypes`, `this.rechargesService.getDailySummary`, `this.operationDate`, `this.rechargesService.getSales`, `this.rechargesService.getPurchases`, `this.simsService.getTypes`, `this.simsService.getDailyStock`, `this.simsService.getSales`, `this.types.set`, `this.balances.set`, `this.sales.set`, `this.purchases.set`…
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.salesLoading.set`, `this.simLoading.set`, `this.purchasesLoading.set`, `this.simSalesLoading.set`, `this.types.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesPageComponent.fetchBalances`

- **Firma:** `fetchBalances(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L398) (L398–432)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.salesLoading.set`, `this.simLoading.set`, `this.purchasesLoading.set`, `this.simSalesLoading.set`, `forkJoin`, `this.rechargesService.getDailySummary`, `this.operationDate`, `this.rechargesService.getSales`, `this.rechargesService.getPurchases`, `this.simsService.getDailyStock`, `this.simsService.getSales`, `this.balances.set`, `this.sales.set`, `this.purchases.set`, `this.simStocks.set`, `this.simSales.set`, `this.notificationService.error`…
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.salesLoading.set`, `this.simLoading.set`, `this.purchasesLoading.set`, `this.simSalesLoading.set`, `this.balances.set`
- **Consumidores:** (mismo archivo)

##### `RechargesPageComponent.fetchSimSales`

- **Firma:** `fetchSimSales(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L434) (L434–446)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.simSalesLoading.set`, `this.simsService.getSales(this.operationDate()).subscribe`, `this.simsService.getSales`, `this.operationDate`, `this.simSales.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.simSalesLoading.set`, `this.simSales.set`
- **Consumidores:** (mismo archivo)

##### `RechargesPageComponent.upsertSimStock`

- **Firma:** `upsertSimStock(stock: SimDailyStock): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L448) (L448–453)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.simStocks.update`, `list.some`, `list.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.simStocks.update`
- **Consumidores:** (mismo archivo)

##### `RechargesPageComponent.onSimPurchaseRegistered`

- **Firma:** `onSimPurchaseRegistered(stock: SimDailyStock): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L455) (L455–457)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.upsertSimStock`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.onSimSaleRegistered`

- **Firma:** `onSimSaleRegistered(stock: SimDailyStock): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L459) (L459–463)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.upsertSimStock`, `this.fetchSimSales`, `this.salesSummaryRefreshTick.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.salesSummaryRefreshTick.update`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.onSimSaleRegistrationCreated`

- **Firma:** `onSimSaleRegistrationCreated(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L474) (L474–484)
- **Propósito / descripción:** A "venta de SIM con registro de identidad" returns the registration itself, not a `SimDailyStock` — unlike `onSimSaleRegistered`'s upsert, there's no single row to merge in locally, so this refetches SIM stock for the current date directly. Also bumps `salesSummaryRefreshTick` — this sale's price now counts toward "Total Recaudado" (`totalSimSales`), the same signal `onClosureSaved`/`onSaleSaved` already use to tell `SalesSummaryCardComponent` to refetch.
- **Dependencias (llamadas en su cuerpo):** `this.simsService.getDailyStock(this.operationDate()).subscribe`, `this.simsService.getDailyStock`, `this.operationDate`, `this.simStocks.set`, `this.salesSummaryRefreshTick.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.simStocks.set`, `this.salesSummaryRefreshTick.update`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.fetchSales`

- **Firma:** `fetchSales(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L486) (L486–498)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.salesLoading.set`, `this.rechargesService.getSales(this.operationDate()).subscribe`, `this.rechargesService.getSales`, `this.operationDate`, `this.sales.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.salesLoading.set`, `this.sales.set`
- **Consumidores:** (mismo archivo)

##### `RechargesPageComponent.fetchPurchases`

- **Firma:** `fetchPurchases(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L500) (L500–512)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.purchasesLoading.set`, `this.rechargesService.getPurchases(this.operationDate()).subscribe`, `this.rechargesService.getPurchases`, `this.operationDate`, `this.purchases.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.purchasesLoading.set`, `this.purchases.set`
- **Consumidores:** (mismo archivo)

##### `RechargesPageComponent.upsertBalance`

- **Firma:** `upsertBalance(balance: RechargeDailyBalance): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L514) (L514–519)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.balances.update`, `list.some`, `list.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.balances.update`
- **Consumidores:** (mismo archivo)

##### `RechargesPageComponent.onDateChange`

- **Firma:** `onDateChange(date: string): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L522) (L522–530)
- **Propósito / descripción:** Picking another date must never mix its data with the previously viewed one — no local merge, just a full refetch scoped to the new date.
- **Dependencias (llamadas en su cuerpo):** `this.operationDate`, `this.operationDate.set`, `this.salesSummary.set`, `this.fetchBalances`, `this.fetchPastDateStatusIfNeeded`
- **Efectos secundarios:** Actualiza estado (signals): `this.operationDate.set`, `this.salesSummary.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.onPurchaseRegistered`

- **Firma:** `onPurchaseRegistered(balance: RechargeDailyBalance): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L532) (L532–535)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.upsertBalance`, `this.fetchPurchases`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.requestVoidPurchase`

- **Firma:** `requestVoidPurchase(purchase: RechargePurchase): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L537) (L537–540)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidPurchaseTarget.set`, `this.isVoidPurchaseModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidPurchaseTarget.set`, `this.isVoidPurchaseModalOpen.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.cancelVoidPurchase`

- **Firma:** `cancelVoidPurchase(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L542) (L542–548)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isVoidingPurchase`, `this.isVoidPurchaseModalOpen.set`, `this.voidPurchaseTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isVoidPurchaseModalOpen.set`, `this.voidPurchaseTarget.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.confirmVoidPurchase`

- **Firma:** `confirmVoidPurchase(reason: string): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L551) (L551–571)
- **Propósito / descripción:** Reverting a purchase changes the operator's running balance (decremented by the reverted `creditedAmount`) — refetch the whole date's data so the main table/summary card reflect the compensation immediately, not just the purchases row.
- **Dependencias (llamadas en su cuerpo):** `this.voidPurchaseTarget`, `this.isVoidingPurchase.set`, `this.rechargesService.voidPurchase(target.id, reason).subscribe`, `this.rechargesService.voidPurchase`, `this.isVoidPurchaseModalOpen.set`, `this.voidPurchaseTarget.set`, `this.fetchBalances`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isVoidingPurchase.set`, `this.isVoidPurchaseModalOpen.set`, `this.voidPurchaseTarget.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.onClosureSaved`

- **Firma:** `onClosureSaved(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L574) (L574–581)
- **Propósito / descripción:** The backend already reset this date to a fresh cuadre cycle when the closure saved — refetch the table so saldo anterior/compra/saldo final all reflect it instead of the just-closed cycle. Also refreshes the day status: saving a cuadre is what makes "Cerrar Día" become available (`hasSavedCuadreToday`/`canCloseDay`).
- **Dependencias (llamadas en su cuerpo):** `this.fetchBalances`, `this.isTodayOperationDate`, `this.dayStatusService.refresh`, `this.fetchPastDateStatusIfNeeded`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.onRequestFinalBalance`

- **Firma:** `onRequestFinalBalance(event: RequestFinalBalanceEvent): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L583) (L583–587)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.finalBalanceTarget.set`, `this.finalBalanceDraft.set`, `this.isFinalBalanceModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.finalBalanceTarget.set`, `this.finalBalanceDraft.set`, `this.isFinalBalanceModalOpen.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.cancelFinalBalance`

- **Firma:** `cancelFinalBalance(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L589) (L589–595)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSavingFinalBalance`, `this.isFinalBalanceModalOpen.set`, `this.finalBalanceTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFinalBalanceModalOpen.set`, `this.finalBalanceTarget.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.confirmFinalBalance`

- **Firma:** `confirmFinalBalance(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L597) (L597–624)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.finalBalanceTarget`, `this.isSavingFinalBalance.set`, `this.rechargesService.registerFinalBalance`, `this.finalBalanceDraft`, `this.isFinalBalanceModalOpen.set`, `this.finalBalanceTarget.set`, `this.upsertBalance`, `this.salesSummaryRefreshTick.update`, `this.fetchSales`, `this.notificationService.success`, `formatCurrency`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSavingFinalBalance.set`, `this.isFinalBalanceModalOpen.set`, `this.finalBalanceTarget.set`, `this.salesSummaryRefreshTick.update`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.openAddSaleModal`

- **Firma:** `openAddSaleModal(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L626) (L626–629)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleModalTarget.set`, `this.isSaleModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.saleModalTarget.set`, `this.isSaleModalOpen.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.openEditSaleModal`

- **Firma:** `openEditSaleModal(sale: RechargeSale): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L631) (L631–634)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleModalTarget.set`, `this.isSaleModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.saleModalTarget.set`, `this.isSaleModalOpen.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.closeSaleModal`

- **Firma:** `closeSaleModal(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L636) (L636–639)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaleModalOpen.set`, `this.saleModalTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaleModalOpen.set`, `this.saleModalTarget.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.onSaleSaved`

- **Firma:** `onSaleSaved(sale: RechargeSale): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L642) (L642–650)
- **Propósito / descripción:** Covers both create and edit — either way the row is upserted and the cuadre cards are refreshed from real data, never computed locally.
- **Dependencias (llamadas en su cuerpo):** `this.sales.update`, `list.some`, `list.map`, `this.salesSummaryRefreshTick.update`, `this.isSaleModalOpen.set`, `this.saleModalTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sales.update`, `this.salesSummaryRefreshTick.update`, `this.isSaleModalOpen.set`, `this.saleModalTarget.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.requestDeleteSale`

- **Firma:** `requestDeleteSale(sale: RechargeSale): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L652) (L652–655)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deleteSaleTarget.set`, `this.isDeleteSaleModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deleteSaleTarget.set`, `this.isDeleteSaleModalOpen.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.cancelDeleteSale`

- **Firma:** `cancelDeleteSale(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L657) (L657–663)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeletingSale`, `this.isDeleteSaleModalOpen.set`, `this.deleteSaleTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteSaleModalOpen.set`, `this.deleteSaleTarget.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.confirmDeleteSale`

- **Firma:** `confirmDeleteSale(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L665) (L665–686)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deleteSaleTarget`, `this.isDeletingSale.set`, `this.rechargesService.deleteSale(target.id).subscribe`, `this.rechargesService.deleteSale`, `this.isDeleteSaleModalOpen.set`, `this.deleteSaleTarget.set`, `this.sales.update`, `list.filter`, `this.salesSummaryRefreshTick.update`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeletingSale.set`, `this.isDeleteSaleModalOpen.set`, `this.deleteSaleTarget.set`, `this.sales.update`, `this.salesSummaryRefreshTick.update`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.requestVoidSimSale`

- **Firma:** `requestVoidSimSale(sale: SimSale): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L688) (L688–691)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidSimSaleTarget.set`, `this.isVoidSimSaleModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidSimSaleTarget.set`, `this.isVoidSimSaleModalOpen.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.cancelVoidSimSale`

- **Firma:** `cancelVoidSimSale(): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L693) (L693–699)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isVoidingSimSale`, `this.isVoidSimSaleModalOpen.set`, `this.voidSimSaleTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isVoidSimSaleModalOpen.set`, `this.voidSimSaleTarget.set`
- **Consumidores:** `recharges-page.component.html` (plantilla)

##### `RechargesPageComponent.confirmVoidSimSale`

- **Firma:** `confirmVoidSimSale(reason: string): void` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L702) (L702–723)
- **Propósito / descripción:** Reverting a quick SIM sale restores its stock and drops its amount out of "Total Recaudado" — refetch the whole date's data (stock, sim sales) and bump `salesSummaryRefreshTick` so the summary card reflects it immediately.
- **Dependencias (llamadas en su cuerpo):** `this.voidSimSaleTarget`, `this.isVoidingSimSale.set`, `this.simsService.voidSale(target.id, reason).subscribe`, `this.simsService.voidSale`, `this.isVoidSimSaleModalOpen.set`, `this.voidSimSaleTarget.set`, `this.fetchBalances`, `this.salesSummaryRefreshTick.update`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isVoidingSimSale.set`, `this.isVoidSimSaleModalOpen.set`, `this.voidSimSaleTarget.set`, `this.salesSummaryRefreshTick.update`
- **Consumidores:** `recharges-page.component.html` (plantilla)

#### Función `emptyOperatorStat` (L49–51)

- **Tipo:** función local del archivo
- **Firma:** `emptyOperatorStat(name: string): RechargeOperatorStat` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L49)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `todayIsoDate` (L54–60)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [recharges-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts#L54)
- **Propósito / descripción:** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique as Reports' own `todayIsoDate()`.
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

