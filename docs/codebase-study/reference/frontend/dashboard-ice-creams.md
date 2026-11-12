# Frontend `dashboard-ice-creams`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [ice-cream-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-form-modal-ice-cream-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `IceCreamFormModalComponent` (sin comentario de documentación en el código). | 6 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [ice-cream-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-summary-ice-cream-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `IceCreamSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [ice-cream-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-table-ice-cream-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `IceCreamTableComponent`, `IceCreamSortColumn`, `SortDirection`, `STOCK_BADGE_TONE`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [ice-cream-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-toolbar-ice-cream-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `IceCreamToolbarComponent`, `StockFilterOption`, `IceCreamStockFilterValue`, `STOCK_FILTER_OPTIONS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [ice-cream-inventory-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `IceCreamInventoryPageComponent` (sin comentario de documentación en el código). | 11 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [cancel-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-cancel-confirm-modal-cancel-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CancelConfirmModalComponent` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [ice-cream-product-search.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-product-search-ice-cream-product-search-component-ts) | .ts | Componente Angular | Feature (pantalla) | Same live-search pattern as Compras' `PurchaseProductSearchComponent` — its own doc comment explains why this is a feature-local copy, not a shared one. | 3 internas; ext.: @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [ice-cream-purchase-items-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-purchase-items-table-ice-cream-purchase-items-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `IceCreamPurchaseItemsTableComponent` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [ice-cream-purchase-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-purchase-summary-ice-cream-purchase-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `IceCreamPurchaseSummaryComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [save-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-save-confirm-modal-save-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `SaveConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [ice-cream-purchases-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | All invoice state (supplier/date/items/total) lives in `IceCreamPurchaseDraftStore`, a root-provided singleton persisted to `sessionStorage` — same pattern as `PurchasesPageComponent`, see that file's own doc comment. | 12 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [cancel-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-cancel-confirm-modal-cancel-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CancelConfirmModalComponent` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [ice-cream-product-search.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-product-search-ice-cream-product-search-component-ts) | .ts | Componente Angular | Feature (pantalla) | Same live-search pattern as Ventas' `ProductSearchComponent` — disables out-of-stock results, same as that component. | 3 internas; ext.: @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [ice-cream-sale-items-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-sale-items-table-ice-cream-sale-items-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `IceCreamSaleItemsTableComponent` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [ice-cream-sale-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-sale-summary-ice-cream-sale-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `IceCreamSaleSummaryComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [ice-cream-sales-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | All receipt state lives in `IceCreamSaleDraftStore`, a root-provided singleton persisted to `sessionStorage` — same client-only draft pattern as `IceCreamPurchaseDraftStore`. | 10 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/delete-confirm-modal/delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-form-modal/ice-cream-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [ice-cream-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-form-modal/ice-cream-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-summary/ice-cream-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [ice-cream-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-summary/ice-cream-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-table/ice-cream-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [ice-cream-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-table/ice-cream-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-toolbar/ice-cream-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-toolbar.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [ice-cream-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-toolbar/ice-cream-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-inventory-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-inventory-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-ice-cream-summary`, `app-ice-cream-toolbar`, `app-ice-cream-table`, `app-ice-cream-form-modal`, `app-ice-cream-delete-confirm-modal`. | — | — | Media |
| [ice-cream-inventory-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cancel-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/cancel-confirm-modal/cancel-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cancel-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [cancel-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/cancel-confirm-modal/cancel-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-product-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-product-search.component.ts`; usa 2 componentes hijos: `app-icon`, `app-barcode-scanner-modal`. | — | — | Media |
| [ice-cream-product-search.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-purchase-items-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-items-table/ice-cream-purchase-items-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-purchase-items-table.component.ts`; usa 2 componentes hijos: `app-empty-state`, `app-icon`. | — | — | Media |
| [ice-cream-purchase-items-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-items-table/ice-cream-purchase-items-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-purchase-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-summary/ice-cream-purchase-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-purchase-summary.component.ts`; usa 1 componentes hijos: `app-button`. | — | — | Media |
| [ice-cream-purchase-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-summary/ice-cream-purchase-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [save-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/save-confirm-modal/save-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `save-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [save-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/save-confirm-modal/save-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-purchases-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-purchases-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-ice-cream-purchase-product-search`, `app-ice-cream-purchase-items-table`, `app-ice-cream-purchase-summary`, `app-ice-cream-purchase-cancel-confirm-modal`, `app-ice-cream-purchase-save-confirm-modal`. | — | — | Media |
| [ice-cream-purchases-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cancel-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/cancel-confirm-modal/cancel-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cancel-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [cancel-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/cancel-confirm-modal/cancel-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-product-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-product-search.component.ts`; usa 2 componentes hijos: `app-icon`, `app-barcode-scanner-modal`. | — | — | Media |
| [ice-cream-product-search.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-sale-items-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-items-table/ice-cream-sale-items-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-sale-items-table.component.ts`; usa 2 componentes hijos: `app-empty-state`, `app-icon`. | — | — | Media |
| [ice-cream-sale-items-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-items-table/ice-cream-sale-items-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-sale-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-summary/ice-cream-sale-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-sale-summary.component.ts`; usa 1 componentes hijos: `app-button`. | — | — | Media |
| [ice-cream-sale-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-summary/ice-cream-sale-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ice-cream-sales-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ice-cream-sales-page.component.ts`; usa 5 componentes hijos: `app-page-header`, `app-ice-cream-sale-product-search`, `app-ice-cream-sale-items-table`, `app-ice-cream-sale-summary`, `app-ice-cream-sale-cancel-confirm-modal`. | — | — | Media |
| [ice-cream-sales-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [ice-cream-inventory-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts), [ice-cream-inventory-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm-modal.co`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input iceCream = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-form-modal-ice-cream-form-modal-component-ts"></a>

### ice-cream-form-modal.component.ts

- **Ruta:** [ice-cream-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-form-modal/ice-cream-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-form-modal/ice-cream-form-modal.component.ts`, 119 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Componente Angular: declara `IceCreamFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [ice-cream.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [ice-cream-inventory-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts), [ice-cream-inventory-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts) (plantilla)
- **Plantilla:** [ice-cream-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-form-modal/ice-cream-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `IceCreamFormModalComponent` (L22–118)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective], templ`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `iceCreamService = inject(IceCreamService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input iceCream = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<IceCream>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 52–54 | — | `boolean` |
| `ngOnChanges` | método public | 56–70 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 72–104 | — | `Promise<void>` |
| `close` | método public async | 106–117 | — | `Promise<void>` |

##### `IceCreamFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [ice-cream-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-form-modal/ice-cream-form-modal.component.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [ice-cream-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-form-modal/ice-cream-form-modal.component.ts#L56) (L56–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [ice-cream-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-form-modal/ice-cream-form-modal.component.ts#L72) (L72–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.iceCreamService.updateIceCream`, `this.iceCreamService.createIceCream`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `ice-cream-form-modal.component.html` (plantilla)

##### `IceCreamFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [ice-cream-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-form-modal/ice-cream-form-modal.component.ts#L106) (L106–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `ice-cream-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-summary-ice-cream-summary-component-ts"></a>

### ice-cream-summary.component.ts

- **Ruta:** [ice-cream-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-summary/ice-cream-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-summary/ice-cream-summary.component.ts`, 69 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Componente Angular: declara `IceCreamSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [ice-cream-inventory-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts), [ice-cream-inventory-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts) (plantilla)
- **Plantilla:** [ice-cream-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-summary/ice-cream-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface SummaryTile` (L6): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `IceCreamSummaryComponent` (L14–68)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './ice-cream-summary.component.htm`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `iceCreams = signal<IceCream[]>([])`, `tiles = computed<SummaryTile[]>(() => { const iceCreams = `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `data` | setter public | 25–28 | `value: IceCream[]` | (inferido) |

##### `IceCreamSummaryComponent.data`

- **Firma:** `data(value: IceCream[])` — [ice-cream-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-summary/ice-cream-summary.component.ts#L25) (L25–28)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.iceCreams.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.iceCreams.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-table-ice-cream-table-component-ts"></a>

### ice-cream-table.component.ts

- **Ruta:** [ice-cream-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-table/ice-cream-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-table/ice-cream-table.component.ts`, 107 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Componente Angular: declara `IceCreamTableComponent`, `IceCreamSortColumn`, `SortDirection`, `STOCK_BADGE_TONE`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [ice-cream-inventory-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts), [ice-cream-inventory-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts) (plantilla)
- **Plantilla:** [ice-cream-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-table/ice-cream-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addIceCream.emit()"`, `(click)="toggleSort('sku')"`, `(click)="toggleSort('product')"`, `(click)="toggleSort('costPrice')"`, `(click)="toggleSort('publicPrice')"`, `(click)="toggleSort('stock')"`, `(click)="edit.emit(iceCream)"`, `(click)="delete.emit(iceCream)"`

**Interfaces, tipos y enums:**

- `type IceCreamSortColumn` (L28) = `'product' \| 'sku' \| 'costPrice' \| 'publicPrice' \| 'stock' \| 'createdAt'`
- `type SortDirection` (L29) = `'asc' \| 'desc'`

#### Clase `IceCreamTableComponent` (L31–106)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-table', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl: './i`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `iceCreamsInput = signal<IceCream[]>([])`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output edit = new EventEmitter<IceCream>()`, `@Output delete = new EventEmitter<IceCream>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addIceCream = new EventEmitter<void>()`, `sortColumn = signal<IceCreamSortColumn>('createdAt')`, `sortDirection = signal<SortDirection>('desc')`, `sortedIceCreams = computed(() => { const column = this.sortColumn();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `iceCreams` | setter public | 42–45 | `value: IceCream[]` | (inferido) |
| `toggleSort` | método public | 79–86 | `column: IceCreamSortColumn` | `void` |
| `sortIcon` | método public | 88–93 | `column: IceCreamSortColumn` | `string` |
| `statusOf` | método public | 95–97 | `iceCream: IceCream` | `IceCreamStockStatus` |
| `statusLabel` | método public | 99–101 | `iceCream: IceCream` | `string` |
| `statusTone` | método public | 103–105 | `iceCream: IceCream` | `BadgeTone` |

##### `IceCreamTableComponent.iceCreams`

- **Firma:** `iceCreams(value: IceCream[])` — [ice-cream-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-table/ice-cream-table.component.ts#L42) (L42–45)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.iceCreamsInput.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.iceCreamsInput.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamTableComponent.toggleSort`

- **Firma:** `toggleSort(column: IceCreamSortColumn): void` — [ice-cream-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-table/ice-cream-table.component.ts#L79) (L79–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Consumidores:** `ice-cream-table.component.html` (plantilla)

##### `IceCreamTableComponent.sortIcon`

- **Firma:** `sortIcon(column: IceCreamSortColumn): string` — [ice-cream-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-table/ice-cream-table.component.ts#L88) (L88–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-table.component.html` (plantilla)

##### `IceCreamTableComponent.statusOf`

- **Firma:** `statusOf(iceCream: IceCream): IceCreamStockStatus` — [ice-cream-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-table/ice-cream-table.component.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `getIceCreamStockStatus`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `IceCreamTableComponent.statusLabel`

- **Firma:** `statusLabel(iceCream: IceCream): string` — [ice-cream-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-table/ice-cream-table.component.ts#L99) (L99–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.statusOf`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-table.component.html` (plantilla)

##### `IceCreamTableComponent.statusTone`

- **Firma:** `statusTone(iceCream: IceCream): BadgeTone` — [ice-cream-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-table/ice-cream-table.component.ts#L103) (L103–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.statusOf`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-toolbar-ice-cream-toolbar-component-ts"></a>

### ice-cream-toolbar.component.ts

- **Ruta:** [ice-cream-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-toolbar/ice-cream-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-toolbar/ice-cream-toolbar.component.ts`, 41 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Componente Angular: declara `IceCreamToolbarComponent`, `StockFilterOption`, `IceCreamStockFilterValue`, `STOCK_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [ice-cream-inventory-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts), [ice-cream-inventory-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts) (plantilla)
- **Plantilla:** [ice-cream-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-toolbar/ice-cream-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="addIceCream.emit()"`, `(click)="stockFilterChange.emit(option.value)"`

**Interfaces, tipos y enums:**

- `interface StockFilterOption` (L9): sin documentación — miembros: `value`, `label`
- `type IceCreamStockFilterValue` (L7) = `'all' \| IceCreamStockStatus`

#### Clase `IceCreamToolbarComponent` (L21–40)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './ice-cream-toolbar.compo`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input stockFilter = 'all'`, `@Input canManage = true`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output stockFilterChange = new EventEmitter<IceCreamStockFilterValue>()`, `@Output addIceCream = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts"></a>

### ice-cream-inventory-page.component.ts

- **Ruta:** [ice-cream-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.ts`, 155 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Componente Angular: declara `IceCreamInventoryPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [ice-cream.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [ice-cream-summary.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-summary-ice-cream-summary-component-ts), [ice-cream-toolbar.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-toolbar-ice-cream-toolbar-component-ts), [ice-cream-table.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-table-ice-cream-table-component-ts), [ice-cream-form-modal.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-form-modal-ice-cream-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [ice-cream-inventory-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [ice-cream-summary.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-summary-ice-cream-summary-component-ts), [ice-cream-toolbar.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-toolbar-ice-cream-toolbar-component-ts), [ice-cream-table.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-table-ice-cream-table-component-ts), [ice-cream-form-modal.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-form-modal-ice-cream-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="searchTerm.set($event)"`, `(stockFilterChange)="stockFilter.set($event)"`, `(addIceCream)="openCreateForm()"`, `(edit)="openEditForm($event)"`, `(delete)="requestDelete($event)"`, `(clearFilters)="clearFilters()"`, `(closed)="closeForm()"`, `(saved)="onIceCreamSaved($event)"`, `(confirmed)="confirmDelete()"`, `(cancelled)="cancelDelete()"`

#### Clase `IceCreamInventoryPageComponent` (L16–154)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-inventory-page', standalone: true, imports: [ PageHeaderComponent, IceCreamSummaryComponent, IceCreamToolbarComponent, IceC`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `iceCreamService = inject(IceCreamService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `iceCreams = signal<IceCream[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `stockFilter = signal<IceCreamStockFilterValue>('all')`, `isFormOpen = signal(false)`, `editingIceCream = signal<IceCream \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingIceCream = signal<IceCream \| null>(null)`, `isDeleting = signal(false)`, `filteredIceCreams = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed( () => this.searchTerm().trim().length > `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `openCreateForm` | método public | 91–94 | — | `void` |
| `openEditForm` | método public | 96–99 | `iceCream: IceCream` | `void` |
| `closeForm` | método public | 101–103 | — | `void` |
| `onIceCreamSaved` | método public | 105–116 | `iceCream: IceCream` | `void` |
| `requestDelete` | método public | 118–121 | `iceCream: IceCream` | `void` |
| `cancelDelete` | método public | 123–126 | — | `void` |
| `confirmDelete` | método public | 128–148 | — | `void` |
| `clearFilters` | método public | 150–153 | — | `void` |

##### `IceCreamInventoryPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [ice-cream-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.ts#L91) (L91–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingIceCream.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingIceCream.set`, `this.isFormOpen.set`
- **Consumidores:** `ice-cream-inventory-page.component.html` (plantilla)

##### `IceCreamInventoryPageComponent.openEditForm`

- **Firma:** `openEditForm(iceCream: IceCream): void` — [ice-cream-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.ts#L96) (L96–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingIceCream.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingIceCream.set`, `this.isFormOpen.set`
- **Consumidores:** `ice-cream-inventory-page.component.html` (plantilla)

##### `IceCreamInventoryPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [ice-cream-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.ts#L101) (L101–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `ice-cream-inventory-page.component.html` (plantilla)

##### `IceCreamInventoryPageComponent.onIceCreamSaved`

- **Firma:** `onIceCreamSaved(iceCream: IceCream): void` — [ice-cream-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.ts#L105) (L105–116)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingIceCream`, `this.isFormOpen.set`, `this.iceCreams.update`, `list.map`, `this.notificationService.success`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.iceCreams.update`
- **Consumidores:** `ice-cream-inventory-page.component.html` (plantilla)

##### `IceCreamInventoryPageComponent.requestDelete`

- **Firma:** `requestDelete(iceCream: IceCream): void` — [ice-cream-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.ts#L118) (L118–121)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingIceCream.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingIceCream.set`, `this.isDeleteOpen.set`
- **Consumidores:** `ice-cream-inventory-page.component.html` (plantilla)

##### `IceCreamInventoryPageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [ice-cream-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.ts#L123) (L123–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingIceCream.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingIceCream.set`
- **Consumidores:** `ice-cream-inventory-page.component.html` (plantilla)

##### `IceCreamInventoryPageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [ice-cream-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.ts#L128) (L128–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingIceCream`, `this.isDeleting.set`, `this.iceCreamService.deleteIceCream(iceCream.id).subscribe`, `this.iceCreamService.deleteIceCream`, `this.isDeleteOpen.set`, `this.deletingIceCream.set`, `this.iceCreams.update`, `list.filter`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingIceCream.set`, `this.iceCreams.update`
- **Consumidores:** `ice-cream-inventory-page.component.html` (plantilla)

##### `IceCreamInventoryPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [ice-cream-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.ts#L150) (L150–153)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.stockFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.stockFilter.set`
- **Consumidores:** `ice-cream-inventory-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-cancel-confirm-modal-cancel-confirm-modal-component-ts"></a>

### cancel-confirm-modal.component.ts

- **Ruta:** [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/cancel-confirm-modal/cancel-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/cancel-confirm-modal/cancel-confirm-modal.component.ts`, 19 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Componente Angular: declara `CancelConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts), [ice-cream-purchases-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts) (plantilla)
- **Plantilla:** [cancel-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/cancel-confirm-modal/cancel-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `CancelConfirmModalComponent` (L5–18)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-purchase-cancel-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './cancel-confirm`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-product-search-ice-cream-product-search-component-ts"></a>

### ice-cream-product-search.component.ts

- **Ruta:** [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.ts`, 115 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Same live-search pattern as Compras' `PurchaseProductSearchComponent` — its own doc comment explains why this is a feature-local copy, not a shared one.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [ice-cream.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts), [ice-cream-purchases-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts) (plantilla)
- **Plantilla:** [ice-cream-product-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [barcode-scanner-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="onInput($event)"`, `(focus)="onFocus()"`, `(blur)="onBlur()"`, `(keydown.enter)="onEnter()"`, `(click)="openScanner()"`, `(scanned)="onBarcodeScanned($event)"`, `(closed)="scannerOpen.set(false)"`, `(click)="select(iceCream)"`

#### Clase `IceCreamProductSearchComponent` (L11–114)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-purchase-product-search', standalone: true, imports: [FormsModule, IconComponent, BarcodeScannerModalComponent], templateUr`
- **Propósito:** Same live-search pattern as Compras' `PurchaseProductSearchComponent` — its own doc comment explains why this is a feature-local copy, not a shared one.
- **Servicios inyectados con `inject()`:** `iceCreamService = inject(IceCreamService)`
- **Datos / estado que administra:** `@Output iceCreamSelected = new EventEmitter<IceCream>()`, `query = signal('')`, `results = signal<IceCream[]>([])`, `loading = signal(false)`, `open = signal(false)`, `hasSearched = signal(false)`, `scannerOpen = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onInput` | método public | 59–67 | `value: string` | `void` |
| `onFocus` | método public | 69–73 | — | `void` |
| `onBlur` | método public | 75–78 | — | `void` |
| `select` | método public | 80–86 | `iceCream: IceCream` | `void` |
| `onEnter` | método public | 88–93 | — | `void` |
| `openScanner` | método public | 95–97 | — | `void` |
| `onBarcodeScanned` | método public | 99–113 | `code: string` | `void` |

##### `IceCreamProductSearchComponent.onInput`

- **Firma:** `onInput(value: string): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.ts#L59) (L59–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.open.set`, `this.query$.next`, `value.trim`, `this.results.set`, `this.hasSearched.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.open.set`, `this.results.set`, `this.hasSearched.set`
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla)

##### `IceCreamProductSearchComponent.onFocus`

- **Firma:** `onFocus(): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.ts#L69) (L69–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results`, `this.hasSearched`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla)

##### `IceCreamProductSearchComponent.onBlur`

- **Firma:** `onBlur(): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.ts#L75) (L75–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `setTimeout`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla)

##### `IceCreamProductSearchComponent.select`

- **Firma:** `select(iceCream: IceCream): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.ts#L80) (L80–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.iceCreamSelected.emit`, `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`; Emite eventos: `this.iceCreamSelected.emit`
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla), (mismo archivo)

##### `IceCreamProductSearchComponent.onEnter`

- **Firma:** `onEnter(): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.ts#L88) (L88–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results`, `this.select`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla), (mismo archivo)

##### `IceCreamProductSearchComponent.openScanner`

- **Firma:** `openScanner(): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla)

##### `IceCreamProductSearchComponent.onBarcodeScanned`

- **Firma:** `onBarcodeScanned(code: string): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.ts#L99) (L99–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`, `this.query.set`, `this.open.set`, `this.loading.set`, `this.iceCreamService.searchIceCreams(code).pipe`, `this.iceCreamService.searchIceCreams`, `catchError`, `of`, `this.hasSearched.set`, `this.results.set`, `this.onEnter`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`, `this.query.set`, `this.open.set`, `this.loading.set`, `this.hasSearched.set`, `this.results.set`
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-purchase-items-table-ice-cream-purchase-items-table-component-ts"></a>

### ice-cream-purchase-items-table.component.ts

- **Ruta:** [ice-cream-purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-items-table/ice-cream-purchase-items-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-items-table/ice-cream-purchase-items-table.component.ts`, 53 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Componente Angular: declara `IceCreamPurchaseItemsTableComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts), [ice-cream-purchases-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts) (plantilla)
- **Plantilla:** [ice-cream-purchase-items-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-items-table/ice-cream-purchase-items-table.component.html) · **Usa componentes:** [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="decrement(item)"`, `(change)="onQuantityInput(item, $any($event.target).value)"`, `(click)="increment(item)"`, `(change)="onCostPriceInput(item, $any($event.target).value)"`, `(click)="removeItem.emit(item.iceCreamId)"`

#### Clase `IceCreamPurchaseItemsTableComponent` (L11–52)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-purchase-items-table', standalone: true, imports: [IconComponent, EmptyStateComponent, DecimalInputDirective], templateUrl:`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input items = []`, `@Output quantityChange = new EventEmitter<{ iceCreamId: string; quantity: n`, `@Output costPriceChange = new EventEmitter<{ iceCreamId: string; costPrice: `, `@Output removeItem = new EventEmitter<string>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `increment` | método public | 29–31 | `item: IceCreamPurchaseDraftItem` | `void` |
| `decrement` | método public | 33–35 | `item: IceCreamPurchaseDraftItem` | `void` |
| `onQuantityInput` | método public | 37–43 | `item: IceCreamPurchaseDraftItem`, `value: string` | `void` |
| `onCostPriceInput` | método public | 45–51 | `item: IceCreamPurchaseDraftItem`, `value: string` | `void` |

##### `IceCreamPurchaseItemsTableComponent.increment`

- **Firma:** `increment(item: IceCreamPurchaseDraftItem): void` — [ice-cream-purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-items-table/ice-cream-purchase-items-table.component.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quantityChange.emit`
- **Efectos secundarios:** Emite eventos: `this.quantityChange.emit`
- **Consumidores:** `ice-cream-purchase-items-table.component.html` (plantilla)

##### `IceCreamPurchaseItemsTableComponent.decrement`

- **Firma:** `decrement(item: IceCreamPurchaseDraftItem): void` — [ice-cream-purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-items-table/ice-cream-purchase-items-table.component.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quantityChange.emit`, `Math.max`
- **Efectos secundarios:** Emite eventos: `this.quantityChange.emit`
- **Consumidores:** `ice-cream-purchase-items-table.component.html` (plantilla)

##### `IceCreamPurchaseItemsTableComponent.onQuantityInput`

- **Firma:** `onQuantityInput(item: IceCreamPurchaseDraftItem, value: string): void` — [ice-cream-purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-items-table/ice-cream-purchase-items-table.component.ts#L37) (L37–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseInt`, `Number.isNaN`, `this.quantityChange.emit`, `Math.max`
- **Efectos secundarios:** Emite eventos: `this.quantityChange.emit`
- **Consumidores:** `ice-cream-purchase-items-table.component.html` (plantilla)

##### `IceCreamPurchaseItemsTableComponent.onCostPriceInput`

- **Firma:** `onCostPriceInput(item: IceCreamPurchaseDraftItem, value: string): void` — [ice-cream-purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-items-table/ice-cream-purchase-items-table.component.ts#L45) (L45–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseFloat`, `Number.isNaN`, `this.costPriceChange.emit`, `Math.max`
- **Efectos secundarios:** Emite eventos: `this.costPriceChange.emit`
- **Consumidores:** `ice-cream-purchase-items-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-purchase-summary-ice-cream-purchase-summary-component-ts"></a>

### ice-cream-purchase-summary.component.ts

- **Ruta:** [ice-cream-purchase-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-summary/ice-cream-purchase-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-summary/ice-cream-purchase-summary.component.ts`, 34 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Componente Angular: declara `IceCreamPurchaseSummaryComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts), [ice-cream-purchases-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts) (plantilla)
- **Plantilla:** [ice-cream-purchase-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-summary/ice-cream-purchase-summary.component.html) · **Usa componentes:** [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="cancel.emit()"`, `(click)="save.emit()"`

#### Clase `IceCreamPurchaseSummaryComponent` (L6–33)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-purchase-summary', standalone: true, imports: [ButtonComponent], templateUrl: './ice-cream-purchase-summary.component.html'`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input itemCount = 0`, `@Input total = 0`, `@Input isSaving = false`, `@Input supplierSelected = false`, `@Output cancel = new EventEmitter<void>()`, `@Output save = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `canCancel` | getter public | 26–28 | — | `boolean` |
| `canSave` | getter public | 30–32 | — | `boolean` |

##### `IceCreamPurchaseSummaryComponent.canCancel`

- **Firma:** `canCancel(): boolean` — [ice-cream-purchase-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-summary/ice-cream-purchase-summary.component.ts#L26) (L26–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchaseSummaryComponent.canSave`

- **Firma:** `canSave(): boolean` — [ice-cream-purchase-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-purchase-summary/ice-cream-purchase-summary.component.ts#L30) (L30–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-save-confirm-modal-save-confirm-modal-component-ts"></a>

### save-confirm-modal.component.ts

- **Ruta:** [save-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/save-confirm-modal/save-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/save-confirm-modal/save-confirm-modal.component.ts`, 28 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Componente Angular: declara `SaveConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts), [ice-cream-purchases-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts) (plantilla)
- **Plantilla:** [save-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/save-confirm-modal/save-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `SaveConfirmModalComponent` (L7–27)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-purchase-save-confirm-modal', standalone: true, imports: [DatePipe, ButtonComponent, IconComponent], templateUrl: './save-c`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input supplierName = ''`, `@Input purchaseDate = null`, `@Input itemCount = 0`, `@Input total = 0`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts"></a>

### ice-cream-purchases-page.component.ts

- **Ruta:** [ice-cream-purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts`, 152 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** All invoice state (supplier/date/items/total) lives in `IceCreamPurchaseDraftStore`, a root-provided singleton persisted to `sessionStorage` — same pattern as `PurchasesPageComponent`, see that file's own doc comment.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [ice-cream-purchase-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-purchase-draft-store-ts), [ice-cream-purchases.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-purchases-service-ts), [supplier.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-supplier-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [ice-cream-product-search.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-product-search-ice-cream-product-search-component-ts), [ice-cream-purchase-items-table.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-purchase-items-table-ice-cream-purchase-items-table-component-ts), [ice-cream-purchase-summary.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-purchase-summary-ice-cream-purchase-summary-component-ts), [cancel-confirm-modal.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-cancel-confirm-modal-cancel-confirm-modal-component-ts), [save-confirm-modal.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-save-confirm-modal-save-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [ice-cream-purchases-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [ice-cream-product-search.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-product-search-ice-cream-product-search-component-ts), [ice-cream-purchase-items-table.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-purchase-items-table-ice-cream-purchase-items-table-component-ts), [ice-cream-purchase-summary.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-purchase-summary-ice-cream-purchase-summary-component-ts), [cancel-confirm-modal.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-cancel-confirm-modal-cancel-confirm-modal-component-ts), [save-confirm-modal.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-save-confirm-modal-save-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="onSupplierChange($event)"`, `(ngModelChange)="onDateChange($event)"`, `(iceCreamSelected)="onIceCreamSelected($event)"`, `(quantityChange)="onQuantityChange($event)"`, `(costPriceChange)="onCostPriceChange($event)"`, `(removeItem)="onRemoveItem($event)"`, `(cancel)="requestCancel()"`, `(save)="requestSave()"`, `(confirmed)="confirmCancel()"`, `(cancelled)="dismissCancel()"`, `(confirmed)="confirmSave()"`, `(cancelled)="dismissSaveConfirm()"`

#### Clase `IceCreamPurchasesPageComponent` (L24–151)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-purchases-page', standalone: true, imports: [ FormsModule, PageHeaderComponent, IceCreamProductSearchComponent, IceCreamPur`
- **Propósito:** All invoice state (supplier/date/items/total) lives in `IceCreamPurchaseDraftStore`, a root-provided singleton persisted to `sessionStorage` — same pattern as `PurchasesPageComponent`, see that file's own doc comment.
- **Servicios inyectados con `inject()`:** `iceCreamPurchasesService = inject(IceCreamPurchasesService)`, `supplierService = inject(SupplierService)`, `notificationService = inject(NotificationService)`, `draft = inject(IceCreamPurchaseDraftStore)`
- **Datos / estado que administra:** `suppliers = signal<Supplier[]>([])`, `isSaving = signal(false)`, `isCancelConfirmOpen = signal(false)`, `isSaveConfirmOpen = signal(false)`, `selectedSupplierName = computed(() => { const supplier = this.suppliers()`, `purchaseDateAsDate = computed(() => new Date('${this.draft.purchaseDate`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onSupplierChange` | método public | 67–69 | `supplierId: string` | `void` |
| `onDateChange` | método public | 71–73 | `date: string` | `void` |
| `onIceCreamSelected` | método public | 75–77 | `iceCream: IceCream` | `void` |
| `onQuantityChange` | método public | 79–81 | `change: { iceCreamId: string; quantity: number }` | `void` |
| `onCostPriceChange` | método public | 83–85 | `change: { iceCreamId: string; costPrice: number }` | `void` |
| `onRemoveItem` | método public | 87–89 | `iceCreamId: string` | `void` |
| `requestCancel` | método public | 91–96 | — | `void` |
| `confirmCancel` | método public | 98–101 | — | `void` |
| `dismissCancel` | método public | 103–105 | — | `void` |
| `requestSave` | método public | 107–112 | — | `void` |
| `dismissSaveConfirm` | método public | 114–119 | — | `void` |
| `confirmSave` | método public | 121–150 | — | `void` |

##### `IceCreamPurchasesPageComponent.onSupplierChange`

- **Firma:** `onSupplierChange(supplierId: string): void` — [ice-cream-purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setSupplier`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-purchases-page.component.html` (plantilla)

##### `IceCreamPurchasesPageComponent.onDateChange`

- **Firma:** `onDateChange(date: string): void` — [ice-cream-purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setPurchaseDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-purchases-page.component.html` (plantilla)

##### `IceCreamPurchasesPageComponent.onIceCreamSelected`

- **Firma:** `onIceCreamSelected(iceCream: IceCream): void` — [ice-cream-purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.onIceCreamSelected`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-purchases-page.component.html` (plantilla)

##### `IceCreamPurchasesPageComponent.onQuantityChange`

- **Firma:** `onQuantityChange(change: { iceCreamId: string; quantity: number }): void` — [ice-cream-purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.updateQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-purchases-page.component.html` (plantilla)

##### `IceCreamPurchasesPageComponent.onCostPriceChange`

- **Firma:** `onCostPriceChange(change: { iceCreamId: string; costPrice: number }): void` — [ice-cream-purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.updateCostPrice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-purchases-page.component.html` (plantilla)

##### `IceCreamPurchasesPageComponent.onRemoveItem`

- **Firma:** `onRemoveItem(iceCreamId: string): void` — [ice-cream-purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts#L87) (L87–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.removeItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-purchases-page.component.html` (plantilla)

##### `IceCreamPurchasesPageComponent.requestCancel`

- **Firma:** `requestCancel(): void` — [ice-cream-purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts#L91) (L91–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.items`, `this.isCancelConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isCancelConfirmOpen.set`
- **Consumidores:** `ice-cream-purchases-page.component.html` (plantilla)

##### `IceCreamPurchasesPageComponent.confirmCancel`

- **Firma:** `confirmCancel(): void` — [ice-cream-purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts#L98) (L98–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isCancelConfirmOpen.set`, `this.draft.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.isCancelConfirmOpen.set`
- **Consumidores:** `ice-cream-purchases-page.component.html` (plantilla)

##### `IceCreamPurchasesPageComponent.dismissCancel`

- **Firma:** `dismissCancel(): void` — [ice-cream-purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts#L103) (L103–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isCancelConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isCancelConfirmOpen.set`
- **Consumidores:** `ice-cream-purchases-page.component.html` (plantilla)

##### `IceCreamPurchasesPageComponent.requestSave`

- **Firma:** `requestSave(): void` — [ice-cream-purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts#L107) (L107–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.supplierId`, `this.draft.items`, `this.isSaving`, `this.isSaveConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaveConfirmOpen.set`
- **Consumidores:** `ice-cream-purchases-page.component.html` (plantilla)

##### `IceCreamPurchasesPageComponent.dismissSaveConfirm`

- **Firma:** `dismissSaveConfirm(): void` — [ice-cream-purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts#L114) (L114–119)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.isSaveConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaveConfirmOpen.set`
- **Consumidores:** `ice-cream-purchases-page.component.html` (plantilla)

##### `IceCreamPurchasesPageComponent.confirmSave`

- **Firma:** `confirmSave(): void` — [ice-cream-purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts#L121) (L121–150)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.isSaving.set`, `this.iceCreamPurchasesService.createPurchase`, `this.draft.supplierId`, `new Date('${this.draft.purchaseDate()}T00:00:00').toISOString`, `new Date`, `this.draft.purchaseDate`, `this.draft.items().map`, `this.draft.items`, `this.isSaveConfirmOpen.set`, `this.draft.reset`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.isSaveConfirmOpen.set`
- **Consumidores:** `ice-cream-purchases-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-cancel-confirm-modal-cancel-confirm-modal-component-ts"></a>

### cancel-confirm-modal.component.ts

- **Ruta:** [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/cancel-confirm-modal/cancel-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/cancel-confirm-modal/cancel-confirm-modal.component.ts`, 19 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Componente Angular: declara `CancelConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [ice-cream-sales-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts), [ice-cream-sales-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts) (plantilla)
- **Plantilla:** [cancel-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/cancel-confirm-modal/cancel-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `CancelConfirmModalComponent` (L5–18)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-sale-cancel-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './cancel-confirm-mod`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-product-search-ice-cream-product-search-component-ts"></a>

### ice-cream-product-search.component.ts

- **Ruta:** [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.ts`, 117 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Same live-search pattern as Ventas' `ProductSearchComponent` — disables out-of-stock results, same as that component.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [ice-cream.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [ice-cream-sales-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts), [ice-cream-sales-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts) (plantilla)
- **Plantilla:** [ice-cream-product-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [barcode-scanner-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="onInput($event)"`, `(focus)="onFocus()"`, `(blur)="onBlur()"`, `(keydown.enter)="onEnter()"`, `(click)="openScanner()"`, `(scanned)="onBarcodeScanned($event)"`, `(closed)="scannerOpen.set(false)"`, `(click)="select(iceCream)"`

#### Clase `IceCreamProductSearchComponent` (L11–116)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-sale-product-search', standalone: true, imports: [FormsModule, IconComponent, BarcodeScannerModalComponent], templateUrl: '`
- **Propósito:** Same live-search pattern as Ventas' `ProductSearchComponent` — disables out-of-stock results, same as that component. Feature-local copy, not shared — see `PurchaseProductSearchComponent`'s doc comment for why.
- **Servicios inyectados con `inject()`:** `iceCreamService = inject(IceCreamService)`
- **Datos / estado que administra:** `@Output iceCreamSelected = new EventEmitter<IceCream>()`, `query = signal('')`, `results = signal<IceCream[]>([])`, `loading = signal(false)`, `open = signal(false)`, `hasSearched = signal(false)`, `scannerOpen = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onInput` | método public | 58–66 | `value: string` | `void` |
| `onFocus` | método public | 68–72 | — | `void` |
| `onBlur` | método public | 74–77 | — | `void` |
| `select` | método public | 79–88 | `iceCream: IceCream` | `void` |
| `onEnter` | método public | 90–95 | — | `void` |
| `openScanner` | método public | 97–99 | — | `void` |
| `onBarcodeScanned` | método public | 101–115 | `code: string` | `void` |

##### `IceCreamProductSearchComponent.onInput`

- **Firma:** `onInput(value: string): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.ts#L58) (L58–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.open.set`, `this.query$.next`, `value.trim`, `this.results.set`, `this.hasSearched.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.open.set`, `this.results.set`, `this.hasSearched.set`
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla)

##### `IceCreamProductSearchComponent.onFocus`

- **Firma:** `onFocus(): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.ts#L68) (L68–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results`, `this.hasSearched`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla)

##### `IceCreamProductSearchComponent.onBlur`

- **Firma:** `onBlur(): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.ts#L74) (L74–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `setTimeout`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla)

##### `IceCreamProductSearchComponent.select`

- **Firma:** `select(iceCream: IceCream): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.ts#L79) (L79–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.iceCreamSelected.emit`, `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`; Emite eventos: `this.iceCreamSelected.emit`
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla), (mismo archivo)

##### `IceCreamProductSearchComponent.onEnter`

- **Firma:** `onEnter(): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.ts#L90) (L90–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results`, `this.select`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla), (mismo archivo)

##### `IceCreamProductSearchComponent.openScanner`

- **Firma:** `openScanner(): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.ts#L97) (L97–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla)

##### `IceCreamProductSearchComponent.onBarcodeScanned`

- **Firma:** `onBarcodeScanned(code: string): void` — [ice-cream-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.ts#L101) (L101–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`, `this.query.set`, `this.open.set`, `this.loading.set`, `this.iceCreamService.searchIceCreams(code).pipe`, `this.iceCreamService.searchIceCreams`, `catchError`, `of`, `this.hasSearched.set`, `this.results.set`, `this.onEnter`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`, `this.query.set`, `this.open.set`, `this.loading.set`, `this.hasSearched.set`, `this.results.set`
- **Consumidores:** `ice-cream-product-search.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-sale-items-table-ice-cream-sale-items-table-component-ts"></a>

### ice-cream-sale-items-table.component.ts

- **Ruta:** [ice-cream-sale-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-items-table/ice-cream-sale-items-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-items-table/ice-cream-sale-items-table.component.ts`, 53 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Componente Angular: declara `IceCreamSaleItemsTableComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [ice-cream-sales-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts), [ice-cream-sales-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts) (plantilla)
- **Plantilla:** [ice-cream-sale-items-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-items-table/ice-cream-sale-items-table.component.html) · **Usa componentes:** [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="decrement(item)"`, `(change)="onQuantityInput(item, $any($event.target).value)"`, `(click)="increment(item)"`, `(click)="removeItem.emit(item.iceCreamId)"`

#### Clase `IceCreamSaleItemsTableComponent` (L11–52)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-sale-items-table', standalone: true, imports: [IconComponent, EmptyStateComponent, DecimalInputDirective], templateUrl: './`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input items = []`, `@Output quantityChange = new EventEmitter<{ iceCreamId: string; quantity: n`, `@Output removeItem = new EventEmitter<string>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `atStockLimit` | método public | 29–31 | `item: IceCreamSaleDraftItem` | `boolean` |
| `increment` | método public | 33–38 | `item: IceCreamSaleDraftItem` | `void` |
| `decrement` | método public | 40–42 | `item: IceCreamSaleDraftItem` | `void` |
| `onQuantityInput` | método public | 44–51 | `item: IceCreamSaleDraftItem`, `value: string` | `void` |

##### `IceCreamSaleItemsTableComponent.atStockLimit`

- **Firma:** `atStockLimit(item: IceCreamSaleDraftItem): boolean` — [ice-cream-sale-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-items-table/ice-cream-sale-items-table.component.ts#L29) (L29–31)
- **Propósito / descripción:** Client-side hint only — the backend re-validates stock under a row lock at save time regardless.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-sale-items-table.component.html` (plantilla), (mismo archivo)

##### `IceCreamSaleItemsTableComponent.increment`

- **Firma:** `increment(item: IceCreamSaleDraftItem): void` — [ice-cream-sale-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-items-table/ice-cream-sale-items-table.component.ts#L33) (L33–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.atStockLimit`, `this.quantityChange.emit`
- **Efectos secundarios:** Emite eventos: `this.quantityChange.emit`
- **Consumidores:** `ice-cream-sale-items-table.component.html` (plantilla)

##### `IceCreamSaleItemsTableComponent.decrement`

- **Firma:** `decrement(item: IceCreamSaleDraftItem): void` — [ice-cream-sale-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-items-table/ice-cream-sale-items-table.component.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quantityChange.emit`, `Math.max`
- **Efectos secundarios:** Emite eventos: `this.quantityChange.emit`
- **Consumidores:** `ice-cream-sale-items-table.component.html` (plantilla)

##### `IceCreamSaleItemsTableComponent.onQuantityInput`

- **Firma:** `onQuantityInput(item: IceCreamSaleDraftItem, value: string): void` — [ice-cream-sale-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-items-table/ice-cream-sale-items-table.component.ts#L44) (L44–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseInt`, `Number.isNaN`, `Math.min`, `Math.max`, `this.quantityChange.emit`
- **Efectos secundarios:** Emite eventos: `this.quantityChange.emit`
- **Consumidores:** `ice-cream-sale-items-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-sale-summary-ice-cream-sale-summary-component-ts"></a>

### ice-cream-sale-summary.component.ts

- **Ruta:** [ice-cream-sale-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-summary/ice-cream-sale-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-summary/ice-cream-sale-summary.component.ts`, 32 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** Componente Angular: declara `IceCreamSaleSummaryComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [ice-cream-sales-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts), [ice-cream-sales-page.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts) (plantilla)
- **Plantilla:** [ice-cream-sale-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-summary/ice-cream-sale-summary.component.html) · **Usa componentes:** [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="cancel.emit()"`, `(click)="save.emit()"`

#### Clase `IceCreamSaleSummaryComponent` (L6–31)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-sale-summary', standalone: true, imports: [ButtonComponent], templateUrl: './ice-cream-sale-summary.component.html', styleU`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input itemCount = 0`, `@Input total = 0`, `@Input isSaving = false`, `@Output cancel = new EventEmitter<void>()`, `@Output save = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `canCancel` | getter public | 24–26 | — | `boolean` |
| `canSave` | getter public | 28–30 | — | `boolean` |

##### `IceCreamSaleSummaryComponent.canCancel`

- **Firma:** `canCancel(): boolean` — [ice-cream-sale-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-summary/ice-cream-sale-summary.component.ts#L24) (L24–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSaleSummaryComponent.canSave`

- **Firma:** `canSave(): boolean` — [ice-cream-sale-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-sale-summary/ice-cream-sale-summary.component.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts"></a>

### ice-cream-sales-page.component.ts

- **Ruta:** [ice-cream-sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.ts`, 96 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-ice-creams`
- **Responsabilidad:** All receipt state lives in `IceCreamSaleDraftStore`, a root-provided singleton persisted to `sessionStorage` — same client-only draft pattern as `IceCreamPurchaseDraftStore`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [ice-cream-sale-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-sale-draft-store-ts), [ice-cream-sales.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-sales-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [ice-cream-product-search.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-product-search-ice-cream-product-search-component-ts), [ice-cream-sale-items-table.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-sale-items-table-ice-cream-sale-items-table-component-ts), [ice-cream-sale-summary.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-sale-summary-ice-cream-sale-summary-component-ts), [cancel-confirm-modal.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-cancel-confirm-modal-cancel-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [ice-cream-sales-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [ice-cream-product-search.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-product-search-ice-cream-product-search-component-ts), [ice-cream-sale-items-table.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-sale-items-table-ice-cream-sale-items-table-component-ts), [ice-cream-sale-summary.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-sale-summary-ice-cream-sale-summary-component-ts), [cancel-confirm-modal.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-cancel-confirm-modal-cancel-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(iceCreamSelected)="onIceCreamSelected($event)"`, `(quantityChange)="onQuantityChange($event)"`, `(removeItem)="onRemoveItem($event)"`, `(cancel)="requestCancel()"`, `(save)="saveSale()"`, `(confirmed)="confirmCancel()"`, `(cancelled)="dismissCancel()"`

#### Clase `IceCreamSalesPageComponent` (L23–95)

- **Decoradores:** `@Component({ selector: 'app-ice-cream-sales-page', standalone: true, imports: [ PageHeaderComponent, IceCreamProductSearchComponent, IceCreamSaleItemsTableCompon`
- **Propósito:** All receipt state lives in `IceCreamSaleDraftStore`, a root-provided singleton persisted to `sessionStorage` — same client-only draft pattern as `IceCreamPurchaseDraftStore`. Unlike Ventas' own `SalesPageComponent` (which persists an "open sale" server-side, item by item), nothing is sent to the backend here until "Guardar venta", which confirms the whole receipt atomically and validates stock server-side under a row lock.
- **Servicios inyectados con `inject()`:** `iceCreamSalesService = inject(IceCreamSalesService)`, `notificationService = inject(NotificationService)`, `draft = inject(IceCreamSaleDraftStore)`
- **Datos / estado que administra:** `isSaving = signal(false)`, `isCancelConfirmOpen = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onIceCreamSelected` | método public | 45–47 | `iceCream: IceCream` | `void` |
| `onQuantityChange` | método public | 49–51 | `change: { iceCreamId: string; quantity: number }` | `void` |
| `onRemoveItem` | método public | 53–55 | `iceCreamId: string` | `void` |
| `requestCancel` | método public | 57–62 | — | `void` |
| `confirmCancel` | método public | 64–67 | — | `void` |
| `dismissCancel` | método public | 69–71 | — | `void` |
| `saveSale` | método public | 73–94 | — | `void` |

##### `IceCreamSalesPageComponent.onIceCreamSelected`

- **Firma:** `onIceCreamSelected(iceCream: IceCream): void` — [ice-cream-sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.onIceCreamSelected`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-sales-page.component.html` (plantilla)

##### `IceCreamSalesPageComponent.onQuantityChange`

- **Firma:** `onQuantityChange(change: { iceCreamId: string; quantity: number }): void` — [ice-cream-sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.updateQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-sales-page.component.html` (plantilla)

##### `IceCreamSalesPageComponent.onRemoveItem`

- **Firma:** `onRemoveItem(iceCreamId: string): void` — [ice-cream-sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.removeItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ice-cream-sales-page.component.html` (plantilla)

##### `IceCreamSalesPageComponent.requestCancel`

- **Firma:** `requestCancel(): void` — [ice-cream-sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.ts#L57) (L57–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.items`, `this.isCancelConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isCancelConfirmOpen.set`
- **Consumidores:** `ice-cream-sales-page.component.html` (plantilla)

##### `IceCreamSalesPageComponent.confirmCancel`

- **Firma:** `confirmCancel(): void` — [ice-cream-sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.ts#L64) (L64–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isCancelConfirmOpen.set`, `this.draft.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.isCancelConfirmOpen.set`
- **Consumidores:** `ice-cream-sales-page.component.html` (plantilla)

##### `IceCreamSalesPageComponent.dismissCancel`

- **Firma:** `dismissCancel(): void` — [ice-cream-sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isCancelConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isCancelConfirmOpen.set`
- **Consumidores:** `ice-cream-sales-page.component.html` (plantilla)

##### `IceCreamSalesPageComponent.saveSale`

- **Firma:** `saveSale(): void` — [ice-cream-sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.ts#L73) (L73–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.items`, `this.isSaving`, `this.isSaving.set`, `this.iceCreamSalesService.createSale`, `this.draft.items().map`, `this.draft.reset`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`
- **Consumidores:** `ice-cream-sales-page.component.html` (plantilla)

