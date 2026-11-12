# Frontend `dashboard-inventory`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [import-purchase-results-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-import-purchase-results-modal-import-purchase-results-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Shows the outcome of `POST /purchases/import` ("Cargar stock inicial") — dumb, like `ImportResultsModalComponent` (Products' own import result): the parent already made the actual API call by the time this opens, this only ever displays the result it got back. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [import-results-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-import-results-modal-import-results-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Shows the outcome of `POST /products/import` — dumb, like `DeleteConfirmModalComponent`: the parent already made the actual API call by the time this opens, this only ever displays the result it got back. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [inventory-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-inventory-summary-inventory-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | `stats` are real SQL aggregates over the WHOLE active catalog (`GET /products/stats`) — never a `Product[]` summed client-side, which used to silently cap "Total de productos" at whatever page size the list itself fetched. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [inventory-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-inventory-toolbar-inventory-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `InventoryToolbarComponent`, `StockFilterOption`, `StockFilterValue`, `STOCK_FILTER_OPTIONS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [presentation-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-presentation-form-modal-presentation-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Administración de presentaciones" — create/edit a product's presentations (Unidad, Caja, Paquete...). | 7 internas; ext.: @angular/common, @angular/core, @angular/forms | 4 | Media (4 consumidores) |
| [product-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `ProductFormModalComponent`, `PresentationRow` (sin comentario de documentación en el código). | 10 internas; ext.: @angular/core, @angular/common, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [product-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-table-product-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | A saved set must have exactly the columns this table currently has and sum close to 100 — otherwise a stale/corrupted entry (e.g. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [quick-transfer-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-quick-transfer-modal-quick-transfer-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Transferencia rápida" — la misma operación de `POST /inventory/transfers` (una por línea, vía `POST /inventory/transfers/batch`), pero pensada para escanear varios productos seguidos sin soltar el lector: un solo input, Enter (el propio lector lo envía solo) agrega o incrementa la fila, el input vuelve a quedar listo para el siguiente escaneo. | 8 internas; ext.: @angular/common, @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [transfer-inventory-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-transfer-inventory-modal-transfer-inventory-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Trasladar inventario" — Bodega ↔ Vitrina (or any two active locations), by any presentation, with a live conversion preview and an exact-wording confirmation before the real `POST /inventory/transfers` call. | 8 internas; ext.: @angular/common, @angular/core, @angular/forms, rxjs | 4 | Media (4 consumidores) |
| [inventory-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `InventoryPageComponent` (sin comentario de documentación en el código). | 21 internas; ext.: @angular/common, @angular/core, @angular/router, rxjs | 1 | Baja (1 consumidores) |
| [product-detail-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-inventory-product-detail-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Product detail view — General / Presentaciones / Inventario / Movimientos recientes, exactly the four sections the "Inventario por ubicación" ticket asked for. | 10 internas; ext.: @angular/common, @angular/core, @angular/router | 1 | Baja (1 consumidores) |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/delete-confirm-modal/delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [import-purchase-results-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/import-purchase-results-modal/import-purchase-results-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `import-purchase-results-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [import-purchase-results-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/import-purchase-results-modal/import-purchase-results-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [import-results-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/import-results-modal/import-results-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `import-results-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [import-results-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/import-results-modal/import-results-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [inventory-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-summary/inventory-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `inventory-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [inventory-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-summary/inventory-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [inventory-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-toolbar/inventory-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `inventory-toolbar.component.ts`; usa 3 componentes hijos: `app-icon`, `app-barcode-scanner-modal`, `app-button`. | — | — | Media |
| [inventory-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-toolbar/inventory-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [presentation-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `presentation-form-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-button`, `app-barcode-scanner-modal`. | — | — | Media |
| [presentation-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [product-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `product-form-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-button`, `app-barcode-scanner-modal`. | — | — | Media |
| [product-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [product-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `product-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [product-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [quick-transfer-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `quick-transfer-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-barcode-scanner-modal`, `app-button`. | — | — | Media |
| [quick-transfer-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transfer-inventory-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transfer-inventory-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-barcode-scanner-modal`, `app-button`. | — | — | Media |
| [transfer-inventory-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [inventory-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `inventory-page.component.ts`; usa 10 componentes hijos: `app-page-header`, `app-inventory-summary`, `app-inventory-toolbar`, `app-product-table`, `app-transfer-inventory-modal`, `app-quick-transfer-modal`. | — | — | Media |
| [inventory-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [product-detail-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `product-detail-page.component.ts`; usa 8 componentes hijos: `app-icon`, `app-empty-state`, `app-page-header`, `app-button`, `app-card`, `app-badge`. | — | — | Media |
| [product-detail-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/inventory/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-inventory`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [inventory-page.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm-modal.component.ht`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input product = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-import-purchase-results-modal-import-purchase-results-modal-component-ts"></a>

### import-purchase-results-modal.component.ts

- **Ruta:** [import-purchase-results-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/import-purchase-results-modal/import-purchase-results-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/inventory/components/import-purchase-results-modal/import-purchase-results-modal.component.ts`, 28 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-inventory`
- **Responsabilidad:** Shows the outcome of `POST /purchases/import` ("Cargar stock inicial") — dumb, like `ImportResultsModalComponent` (Products' own import result): the parent already made the actual API call by the time this opens, this only ever displays the result it got back.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [inventory-page.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts) (plantilla)
- **Plantilla:** [import-purchase-results-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/import-purchase-results-modal/import-purchase-results-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closed.emit()"`, `(click)="$event.stopPropagation()"`

#### Clase `ImportPurchaseResultsModalComponent` (L14–27)

- **Decoradores:** `@Component({ selector: 'app-import-purchase-results-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './import-purchase-results-`
- **Propósito:** Shows the outcome of `POST /purchases/import` ("Cargar stock inicial") — dumb, like `ImportResultsModalComponent` (Products' own import result): the parent already made the actual API call by the time this opens, this only ever displays the result it got back. Every purchase this created is already real and saved; every row in `result.skipped` never touched the database.
- **Datos / estado que administra:** `@Input open = false`, `@Input result = null`, `@Output closed = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-import-results-modal-import-results-modal-component-ts"></a>

### import-results-modal.component.ts

- **Ruta:** [import-results-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/import-results-modal/import-results-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/inventory/components/import-results-modal/import-results-modal.component.ts`, 27 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-inventory`
- **Responsabilidad:** Shows the outcome of `POST /products/import` — dumb, like `DeleteConfirmModalComponent`: the parent already made the actual API call by the time this opens, this only ever displays the result it got back.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [inventory-page.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts) (plantilla)
- **Plantilla:** [import-results-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/import-results-modal/import-results-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closed.emit()"`, `(click)="$event.stopPropagation()"`

#### Clase `ImportResultsModalComponent` (L13–26)

- **Decoradores:** `@Component({ selector: 'app-import-results-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './import-results-modal.component.ht`
- **Propósito:** Shows the outcome of `POST /products/import` — dumb, like `DeleteConfirmModalComponent`: the parent already made the actual API call by the time this opens, this only ever displays the result it got back. Every row in `result.createdNames` is already a real, saved product; every row in `result.skipped` never touched the database.
- **Datos / estado que administra:** `@Input open = false`, `@Input result = null`, `@Output closed = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-inventory-summary-inventory-summary-component-ts"></a>

### inventory-summary.component.ts

- **Ruta:** [inventory-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-summary/inventory-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-summary/inventory-summary.component.ts`, 76 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-inventory`
- **Responsabilidad:** `stats` are real SQL aggregates over the WHOLE active catalog (`GET /products/stats`) — never a `Product[]` summed client-side, which used to silently cap "Total de productos" at whatever page size the list itself fetched.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [inventory-page.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts) (plantilla)
- **Plantilla:** [inventory-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-summary/inventory-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface SummaryTile` (L6): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `InventorySummaryComponent` (L15–75)

- **Decoradores:** `@Component({ selector: 'app-inventory-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './inventory-summary.component.htm`
- **Propósito:** `stats` are real SQL aggregates over the WHOLE active catalog (`GET /products/stats`) — never a `Product[]` summed client-side, which used to silently cap "Total de productos" at whatever page size the list itself fetched. `null` while the stats call is still loading.
- **Datos / estado que administra:** `statsValue = signal<InventoryStats \| null>(null)`, `tiles = computed<SummaryTile[]>(() => { const stats = this`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `stats` | setter public | 26–29 | `value: InventoryStats \| null` | (inferido) |

##### `InventorySummaryComponent.stats`

- **Firma:** `stats(value: InventoryStats \| null)` — [inventory-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-summary/inventory-summary.component.ts#L26) (L26–29)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.statsValue.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.statsValue.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-inventory-toolbar-inventory-toolbar-component-ts"></a>

### inventory-toolbar.component.ts

- **Ruta:** [inventory-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-toolbar/inventory-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-toolbar/inventory-toolbar.component.ts`, 92 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-inventory`
- **Responsabilidad:** Componente Angular: declara `InventoryToolbarComponent`, `StockFilterOption`, `StockFilterValue`, `STOCK_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [inventory-page.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts) (plantilla)
- **Plantilla:** [inventory-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-toolbar/inventory-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [barcode-scanner-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="openScanner()"`, `(scanned)="onBarcodeScanned($event)"`, `(closed)="scannerOpen.set(false)"`, `(click)="addProduct.emit()"`, `(ngModelChange)="selectedCategoryChange.emit($event)"`, `(ngModelChange)="selectedBusinessChange.emit($event)"`, `(click)="quickTransferInventory.emit()"`, `(click)="transferInventory.emit()"`, `(click)="exportPdf.emit()"`, `(click)="exportExcel.emit()"`, `(change)="onFileSelected($event)"`, `(click)="importFileInput.click()"`, `(change)="onInitialStockFileSelected($event)"`, `(click)="importInitialStockFileInput.click()"`

**Interfaces, tipos y enums:**

- `interface StockFilterOption` (L9): sin documentación — miembros: `value`, `label`
- `type StockFilterValue` (L7) = `'all' \| StockStatus`

#### Clase `InventoryToolbarComponent` (L21–91)

- **Decoradores:** `@Component({ selector: 'app-inventory-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, BarcodeScannerModalComponent], templateU`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input categories = []`, `@Input businesses = []`, `@Input searchTerm = ''`, `@Input selectedCategory = ''`, `@Input selectedBusiness = ''`, `@Input stockFilter = 'all'`, `@Input searching = false`, `@Input canManage = true`, `@Input importing = false`, `@Input importingInitialStock = false`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output selectedCategoryChange = new EventEmitter<string>()`, `@Output selectedBusinessChange = new EventEmitter<string>()`, `@Output stockFilterChange = new EventEmitter<StockFilterValue>()`, `@Output addProduct = new EventEmitter<void>()`, `@Output quickTransferInventory = new EventEmitter<void>()`, `@Output transferInventory = new EventEmitter<void>()`, `@Output exportPdf = new EventEmitter<void>()`, `@Output exportExcel = new EventEmitter<void>()`, `@Output importFile = new EventEmitter<File>()`, `@Output downloadImportTemplate = new EventEmitter<void>()`, `@Output importInitialStockFile = new EventEmitter<File>()`, `@Output downloadInitialStockTemplate = new EventEmitter<void>()`, `scannerOpen = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onFileSelected` | método public | 63–70 | `event: Event` | `void` |
| `onInitialStockFileSelected` | método public | 73–80 | `event: Event` | `void` |
| `openScanner` | método public | 82–84 | — | `void` |
| `onBarcodeScanned` | método public | 87–90 | `code: string` | `void` |

##### `InventoryToolbarComponent.onFileSelected`

- **Firma:** `onFileSelected(event: Event): void` — [inventory-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-toolbar/inventory-toolbar.component.ts#L63) (L63–70)
- **Propósito / descripción:** The hidden `&lt;input type="file"&gt;` is the real picker — this only forwards whatever it resolves, and always clears it after so selecting the exact same file twice in a row still fires a `change` event.
- **Dependencias (llamadas en su cuerpo):** `this.importFile.emit`
- **Efectos secundarios:** Emite eventos: `this.importFile.emit`
- **Consumidores:** `inventory-toolbar.component.html` (plantilla)

##### `InventoryToolbarComponent.onInitialStockFileSelected`

- **Firma:** `onInitialStockFileSelected(event: Event): void` — [inventory-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-toolbar/inventory-toolbar.component.ts#L73) (L73–80)
- **Propósito / descripción:** Same forward-and-clear pattern as `onFileSelected`, for the separate "Cargar stock inicial" upload.
- **Dependencias (llamadas en su cuerpo):** `this.importInitialStockFile.emit`
- **Efectos secundarios:** Emite eventos: `this.importInitialStockFile.emit`
- **Consumidores:** `inventory-toolbar.component.html` (plantilla)

##### `InventoryToolbarComponent.openScanner`

- **Firma:** `openScanner(): void` — [inventory-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-toolbar/inventory-toolbar.component.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`
- **Consumidores:** `inventory-toolbar.component.html` (plantilla)

##### `InventoryToolbarComponent.onBarcodeScanned`

- **Firma:** `onBarcodeScanned(code: string): void` — [inventory-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/inventory-toolbar/inventory-toolbar.component.ts#L87) (L87–90)
- **Propósito / descripción:** Same `searchTerm` the user would get from typing — the existing client-side filter (which already matches `sku`) does the rest, no new search logic here.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`, `this.searchTermChange.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`; Emite eventos: `this.searchTermChange.emit`
- **Consumidores:** `inventory-toolbar.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-presentation-form-modal-presentation-form-modal-component-ts"></a>

### presentation-form-modal.component.ts

- **Ruta:** [presentation-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.ts`, 170 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-inventory`
- **Responsabilidad:** "Administración de presentaciones" — create/edit a product's presentations (Unidad, Caja, Paquete...).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [inventory-locations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-locations-service-ts), [presentation-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-presentation-type-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [product-detail-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-product-detail-page-component-ts), [purchase-items-table.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-items-table-purchase-items-table-component-ts), [product-detail-page.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-product-detail-page-component-ts) (plantilla), [purchase-items-table.component.ts (plantilla)](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-items-table-purchase-items-table-component-ts) (plantilla)
- **Plantilla:** [presentation-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [barcode-scanner-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`, `(click)="openScanner()"`, `(scanned)="onBarcodeScanned($event)"`, `(closed)="scannerOpen.set(false)"`

#### Clase `PresentationFormModalComponent` (L30–169)

- **Decoradores:** `@Component({ selector: 'app-presentation-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective, Bar`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Administración de presentaciones" — create/edit a product's presentations (Unidad, Caja, Paquete...). Never physically deletes one; deactivating is the only "removal" this module offers, and "Unidad" itself can't be renamed/deactivated/have its factor changed (mirrors the backend's `UnidadPresentationImmutableError`).
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `inventoryLocationsService = inject(InventoryLocationsService)`, `presentationTypeService = inject(PresentationTypeService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input productId = null`, `@Input presentation = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<ProductPresentation>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`, `presentationTypes = signal<PresentationTypeListItem[]>([])`, `scannerOpen = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 66–68 | — | `boolean` |
| `isUnidad` | getter public | 71–73 | — | `boolean` |
| `ngOnChanges` | método public | 75–111 | `changes: SimpleChanges` | `void` |
| `openScanner` | método public | 113–115 | — | `void` |
| `onBarcodeScanned` | método public | 117–121 | `code: string` | `void` |
| `submit` | método public async | 123–155 | — | `Promise<void>` |
| `close` | método public async | 157–168 | — | `Promise<void>` |

##### `PresentationFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [presentation-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.ts#L66) (L66–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationFormModalComponent.isUnidad`

- **Firma:** `isUnidad(): boolean` — [presentation-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.ts#L71) (L71–73)
- **Propósito / descripción:** "Unidad" is the immutable base presentation — the backend rejects renaming/re-factoring/deactivating it.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [presentation-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.ts#L75) (L75–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`, `this.form.controls.presentationTypeId.disable`, `this.form.controls.conversionFactor.disable`, `this.form.controls.presentationTypeId.enable`, `this.form.controls.conversionFactor.enable`, `this.presentationTypeService.getPresentationTypes().subscribe`, `this.presentationTypeService.getPresentationTypes`, `this.presentationTypes.set`, `types.filter`, `t.name.trim().toLowerCase`, `t.name.trim`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`, `this.presentationTypes.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationFormModalComponent.openScanner`

- **Firma:** `openScanner(): void` — [presentation-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.ts#L113) (L113–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`
- **Consumidores:** `presentation-form-modal.component.html` (plantilla)

##### `PresentationFormModalComponent.onBarcodeScanned`

- **Firma:** `onBarcodeScanned(code: string): void` — [presentation-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.ts#L117) (L117–121)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`, `this.form.controls.barcode.setValue`, `this.form.controls.barcode.markAsDirty`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`
- **Consumidores:** `presentation-form-modal.component.html` (plantilla)

##### `PresentationFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [presentation-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.ts#L123) (L123–155)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.inventoryLocationsService.updatePresentation`, `this.inventoryLocationsService.createPresentation`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `presentation-form-modal.component.html` (plantilla)

##### `PresentationFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [presentation-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.ts#L157) (L157–168)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `presentation-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts"></a>

### product-form-modal.component.ts

- **Ruta:** [product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts`, 291 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-inventory`
- **Responsabilidad:** Componente Angular: declara `ProductFormModalComponent`, `PresentationRow` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [inventory.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-service-ts), [inventory-locations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-locations-service-ts), [presentation-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-presentation-type-service-ts), [unit-of-measure.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-unit-of-measure-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`, `rxjs`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [inventory-page.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts) (plantilla)
- **Plantilla:** [product-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [barcode-scanner-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`, `(click)="openSkuScanner()"`, `(click)="addPresentationRow()"`, `(click)="openPresentationScanner(i)"`, `(click)="removePresentationRow(i)"`, `(scanned)="onBarcodeScanned($event)"`, `(closed)="scannerTarget.set(null)"`

**Interfaces, tipos y enums:**

- `type PresentationRow` (L40) = `FormGroup<{ presentationTypeId: FormControl<string>; conversionFactor: FormControl<number>; costPrice: FormControl<number>; publicPrice: FormControl<number>; barcode: FormControl<string>; }>`

#### Clase `ProductFormModalComponent` (L48–290)

- **Decoradores:** `@Component({ selector: 'app-product-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective, BarcodeS`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `inventoryService = inject(InventoryService)`, `inventoryLocationsService = inject(InventoryLocationsService)`, `presentationTypeService = inject(PresentationTypeService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input product = null`, `@Input categories = []`, `@Input businesses = []`, `@Input unitsOfMeasure = []`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<Product>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`, `existingPresentationNames = signal<string[]>([])`, `presentationTypeOptions = signal<PresentationTypeListItem[]>([])`, `scannerTarget = signal<'sku' \| number \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 112–114 | — | `boolean` |
| `presentationRows` | getter public | 116–118 | — | (inferido) |
| `ngOnChanges` | método public | 120–175 | `changes: SimpleChanges` | `void` |
| `addPresentationRow` | método public | 177–186 | — | `void` |
| `removePresentationRow` | método public | 188–190 | `index: number` | `void` |
| `openSkuScanner` | método public | 192–194 | — | `void` |
| `openPresentationScanner` | método public | 196–198 | `index: number` | `void` |
| `onBarcodeScanned` | método public | 200–210 | `code: string` | `void` |
| `submit` | método public async | 212–242 | — | `Promise<void>` |
| `createAdditionalPresentations` | método private | 252–276 | `product: Product`, `presentations: CreatePresentationInput[]` | `void` |
| `close` | método public async | 278–289 | — | `Promise<void>` |

##### `ProductFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts#L112) (L112–114)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductFormModalComponent.presentationRows`

- **Firma:** `presentationRows()` — [product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts#L116) (L116–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts#L120) (L120–175)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.existingPresentationNames.set`, `this.presentationRows.clear`, `this.presentationTypeService.getPresentationTypes().subscribe`, `this.presentationTypeService.getPresentationTypes`, `this.presentationTypeOptions.set`, `types.filter`, `t.name.trim().toLowerCase`, `t.name.trim`, `this.form.reset`, `this.inventoryLocationsService.getPresentations(this.product.id).subscribe`, `this.inventoryLocationsService.getPresentations`, `presentations.filter((p) => p.isActive).map`, `presentations.filter`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`, `this.existingPresentationNames.set`, `this.presentationTypeOptions.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductFormModalComponent.addPresentationRow`

- **Firma:** `addPresentationRow(): void` — [product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts#L177) (L177–186)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.fb.nonNullable.group`, `this.fb.nonNullable.control`, `Validators.min`, `Validators.maxLength`, `this.presentationRows.push`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `product-form-modal.component.html` (plantilla)

##### `ProductFormModalComponent.removePresentationRow`

- **Firma:** `removePresentationRow(index: number): void` — [product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts#L188) (L188–190)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.presentationRows.removeAt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `product-form-modal.component.html` (plantilla)

##### `ProductFormModalComponent.openSkuScanner`

- **Firma:** `openSkuScanner(): void` — [product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts#L192) (L192–194)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerTarget.set`
- **Consumidores:** `product-form-modal.component.html` (plantilla)

##### `ProductFormModalComponent.openPresentationScanner`

- **Firma:** `openPresentationScanner(index: number): void` — [product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts#L196) (L196–198)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerTarget.set`
- **Consumidores:** `product-form-modal.component.html` (plantilla)

##### `ProductFormModalComponent.onBarcodeScanned`

- **Firma:** `onBarcodeScanned(code: string): void` — [product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts#L200) (L200–210)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerTarget`, `this.scannerTarget.set`, `this.form.controls.sku.setValue`, `this.form.controls.sku.markAsDirty`, `this.presentationRows.at(target)?.controls.barcode.setValue`, `this.presentationRows.at`, `this.presentationRows.at(target)?.controls.barcode.markAsDirty`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerTarget.set`
- **Consumidores:** `product-form-modal.component.html` (plantilla)

##### `ProductFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts#L212) (L212–242)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `sku.trim`, `this.isSubmitting.set`, `this.inventoryService.updateProduct`, `this.inventoryService.createProduct`, `request$.subscribe`, `this.createAdditionalPresentations`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** `product-form-modal.component.html` (plantilla)

##### `ProductFormModalComponent.createAdditionalPresentations`

- **Firma:** `createAdditionalPresentations(product: Product, presentations: CreatePresentationInput[]): void` — [product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts#L252) (L252–276)
- **Propósito / descripción:** Fires after the product itself is successfully created/updated — the product's own save is never blocked by this. A presentation-creation failure (e.g. a duplicate name) is surfaced as a toast, not a form error, because by this point the modal is already closing on a genuine success; the user can always finish adding the missed presentation from the product's own detail page.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting.set`, `this.saved.emit`, `forkJoin`, `presentations.map`, `this.inventoryLocationsService.createPresentation`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** (mismo archivo)

##### `ProductFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts#L278) (L278–289)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `product-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-table-product-table-component-ts"></a>

### product-table.component.ts

- **Ruta:** [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts`, 328 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-inventory`
- **Responsabilidad:** A saved set must have exactly the columns this table currently has and sum close to 100 — otherwise a stale/corrupted entry (e.g.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [inventory-page.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts) (plantilla)
- **Plantilla:** [product-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addProduct.emit()"`, `(click)="toggleSort('name')"`, `(mousedown)="onResizeStart($event, 'product', 'category')"`, `(click)="toggleSort('category')"`, `(mousedown)="onResizeStart($event, 'category', 'costPrice')"`, `(click)="toggleSort('costPrice')"`, `(mousedown)="onResizeStart($event, 'costPrice', 'publicPrice')"`, `(click)="toggleSort('publicPrice')"`, `(mousedown)="onResizeStart($event, 'publicPrice', 'wholesalePrice')"`, `(click)="toggleSort('wholesalePrice')"`, `(mousedown)="onResizeStart($event, 'wholesalePrice', 'stock')"`, `(click)="toggleSort('stock')"`, `(mousedown)="onResizeStart($event, 'stock', 'actions')"`, `(click)="viewDetail.emit(product)"`

**Interfaces, tipos y enums:**

- `interface ColumnResizeDragState` (L110): sin documentación — miembros: `leftKey`, `rightKey`, `startClientX`, `startLeftPercent`, `startRightPercent`, `tableWidthPx`, `minLeftPercent`, `minRightPercent`
- `type ProductSortColumn` (L38) = `\| 'name' \| 'sku' \| 'category' \| 'business' \| 'costPrice' \| 'publicPrice' \| 'wholesalePrice' \| 'stock' \| 'createdAt'`
- `type SortDirection` (L48) = `'asc' \| 'desc'`
- `type ProductColumnKey` (L59) = `\| 'product' \| 'category' \| 'costPrice' \| 'publicPrice' \| 'wholesalePrice' \| 'stock' \| 'actions'` — One entry per `&lt;col&gt;` in `product-table.component.html`, left to right.

#### Clase `ProductTableComponent` (L160–327)

- **Decoradores:** `@Component({ selector: 'app-product-table', standalone: true, imports: [ BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent, ], templateUrl: './`
- **Herencia / contratos:** implements OnDestroy
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `productsInput = signal<Product[]>([])`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output edit = new EventEmitter<Product>()`, `@Output delete = new EventEmitter<Product>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addProduct = new EventEmitter<void>()`, `@Output viewDetail = new EventEmitter<Product>()`, `sortColumn = signal<ProductSortColumn>('createdAt')`, `sortDirection = signal<SortDirection>('desc')`, `columnWidths = signal<Record<ProductColumnKey, number>>(loadColum`, `isResizing = signal(false)`, `resizingColumnKey = signal<ProductColumnKey \| null>(null)`, `sortedProducts = computed(() => { const column = this.sortColumn();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `products` | setter public | 176–179 | `value: Product[]` | (inferido) |
| `onResizeStart` | método public | 209–231 | `event: MouseEvent`, `leftKey: ProductColumnKey`, `rightKey: ProductColumnKey` | `void` |
| `onResizeMove` | propiedad-función private | 234–252 | `event: MouseEvent` | `void` |
| `onResizeEnd` | propiedad-función private | 254–264 | — | `void` |
| `ngOnDestroy` | método public | 266–272 | — | `void` |
| `toggleSort` | método public | 290–299 | `column: ProductSortColumn` | `void` |
| `sortIcon` | método public | 301–306 | `column: ProductSortColumn` | `string` |
| `statusOf` | método public | 308–310 | `product: Product` | `StockStatus` |
| `statusLabel` | método public | 312–314 | `product: Product` | `string` |
| `statusTone` | método public | 316–318 | `product: Product` | `BadgeTone` |
| `bodegaStock` | método public | 320–322 | `product: Product` | `number` |
| `vitrinaStock` | método public | 324–326 | `product: Product` | `number` |

##### `ProductTableComponent.products`

- **Firma:** `products(value: Product[])` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L176) (L176–179)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productsInput.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.productsInput.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductTableComponent.onResizeStart`

- **Firma:** `onResizeStart(event: MouseEvent, leftKey: ProductColumnKey, rightKey: ProductColumnKey): void` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L209) (L209–231)
- **Propósito / descripción:** Starts a column resize — `leftKey`/`rightKey` are the two columns straddling the dragged border; only that pair's widths ever change, so the table's total width (and therefore "no horizontal scroll") is preserved by construction.
- **Dependencias (llamadas en su cuerpo):** `event.preventDefault`, `(event.currentTarget as HTMLElement).closest`, `table.getBoundingClientRect`, `this.columnWidths`, `this.isResizing.set`, `this.resizingColumnKey.set`, `document.addEventListener`
- **Efectos secundarios:** Actualiza estado (signals): `this.isResizing.set`, `this.resizingColumnKey.set`
- **Consumidores:** `product-table.component.html` (plantilla)

##### `ProductTableComponent.onResizeMove`

- **Firma:** `onResizeMove(event: MouseEvent): void` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L234) (L234–252)
- **Propósito / descripción:** Bound as a class field (not a method) so the exact same function reference can be passed to both `addEventListener` and `removeEventListener`.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `Math.max`, `this.columnWidths.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.columnWidths.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductTableComponent.onResizeEnd`

- **Firma:** `onResizeEnd(): void` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L254) (L254–264)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isResizing.set`, `this.resizingColumnKey.set`, `document.removeEventListener`, `persistColumnWidths`, `this.columnWidths`
- **Efectos secundarios:** Actualiza estado (signals): `this.isResizing.set`, `this.resizingColumnKey.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductTableComponent.ngOnDestroy`

- **Firma:** `ngOnDestroy(): void` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L266) (L266–272)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `document.removeEventListener`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductTableComponent.toggleSort`

- **Firma:** `toggleSort(column: ProductSortColumn): void` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L290) (L290–299)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Consumidores:** `product-table.component.html` (plantilla)

##### `ProductTableComponent.sortIcon`

- **Firma:** `sortIcon(column: ProductSortColumn): string` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L301) (L301–306)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `product-table.component.html` (plantilla)

##### `ProductTableComponent.statusOf`

- **Firma:** `statusOf(product: Product): StockStatus` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L308) (L308–310)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `getStockStatus`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `ProductTableComponent.statusLabel`

- **Firma:** `statusLabel(product: Product): string` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L312) (L312–314)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.statusOf`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `product-table.component.html` (plantilla)

##### `ProductTableComponent.statusTone`

- **Firma:** `statusTone(product: Product): BadgeTone` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L316) (L316–318)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.statusOf`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `product-table.component.html` (plantilla)

##### `ProductTableComponent.bodegaStock`

- **Firma:** `bodegaStock(product: Product): number` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L320) (L320–322)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `stockAt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `product-table.component.html` (plantilla)

##### `ProductTableComponent.vitrinaStock`

- **Firma:** `vitrinaStock(product: Product): number` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L324) (L324–326)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `stockAt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `product-table.component.html` (plantilla)

#### Función `isValidColumnWidths` (L122–133)

- **Tipo:** función local del archivo
- **Firma:** `isValidColumnWidths(value: unknown): value is Record<ProductColumnKey, number>` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L122)
- **Propósito / descripción:** A saved set must have exactly the columns this table currently has and sum close to 100 — otherwise a stale/corrupted entry (e.g. from before a column was added) is discarded in favor of the defaults, rather than rendering a broken table.
- **Dependencias:** `COLUMN_ORDER.every`, `COLUMN_ORDER.reduce`, `Math.abs`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `loadColumnWidths` (L135–148)

- **Tipo:** función local del archivo
- **Firma:** `loadColumnWidths(): Record<ProductColumnKey, number>` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L135)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `localStorage.getItem`, `JSON.parse`, `isValidColumnWidths`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `persistColumnWidths` (L150–158)

- **Tipo:** función local del archivo
- **Firma:** `persistColumnWidths(widths: Record<ProductColumnKey, number>): void` — [product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-table/product-table.component.ts#L150)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `localStorage.setItem`, `JSON.stringify`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-quick-transfer-modal-quick-transfer-modal-component-ts"></a>

### quick-transfer-modal.component.ts

- **Ruta:** [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts`, 374 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-inventory`
- **Responsabilidad:** "Transferencia rápida" — la misma operación de `POST /inventory/transfers` (una por línea, vía `POST /inventory/transfers/batch`), pero pensada para escanear varios productos seguidos sin soltar el lector: un solo input, Enter (el propio lector lo envía solo) agrega o incrementa la fila, el input vuelve a quedar listo para el siguiente escaneo.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [inventory-locations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-locations-service-ts), [inventory.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [inventory-page.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts) (plantilla)
- **Plantilla:** [quick-transfer-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [barcode-scanner-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngModelChange)="fromLocationId.set($event)"`, `(ngModelChange)="toLocationId.set($event)"`, `(ngModelChange)="onQueryInput($event)"`, `(keyup.enter)="onQueryEnter()"`, `(focus)="onFocus()"`, `(blur)="onBlur()"`, `(click)="openScanner()"`, `(click)="selectSuggestion(product)"`, `(scanned)="onBarcodeScanned($event)"`, `(closed)="scannerOpen.set(false)"`, `(ngModelChange)="updateQuantity(item.productId, $event)"`, `(click)="removeItem(item.productId)"`, `(click)="submit()"`

**Interfaces, tipos y enums:**

- `interface QuickTransferItem` (L32): sin documentación — miembros: `productId`, `sku`, `name`, `quantity`, `stockByLocation`

#### Clase `QuickTransferModalComponent` (L53–373)

- **Decoradores:** `@Component({ selector: 'app-quick-transfer-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, BarcodeScanner`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Transferencia rápida" — la misma operación de `POST /inventory/transfers` (una por línea, vía `POST /inventory/transfers/batch`), pero pensada para escanear varios productos seguidos sin soltar el lector: un solo input, Enter (el propio lector lo envía solo) agrega o incrementa la fila, el input vuelve a quedar listo para el siguiente escaneo. Cada línea siempre usa la presentación base del producto (unidad = unidad, sin selector de presentación) — la conversión entre presentaciones sigue disponible en "Trasladar inventario" (`TransferInventoryModalComponent`) para un traslado puntual con esa opción; ambos llaman al mismo backend, nunca a un segundo sistema de inventario.
- **Servicios inyectados con `inject()`:** `inventoryLocationsService = inject(InventoryLocationsService)`, `inventoryService = inject(InventoryService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Output closed = new EventEmitter<void>()`, `@Output completed = new EventEmitter<void>()`, `@ViewChild scanInputRef: ElementRef<HTMLInputElement>`, `locations = signal<InventoryLocation[]>([])`, `fromLocationId = signal('')`, `toLocationId = signal('')`, `query = signal('')`, `dropdownOpen = signal(false)`, `inputFocused = signal(false)`, `scannerOpen = signal(false)`, `searchResults = signal<Product[]>([])`, `searching = signal(false)`, `items = signal<QuickTransferItem[]>([])`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`, `sameLocation = computed( () => !!this.fromLocationId() && this.fr`, `totalUnits = computed(() => this.items().reduce((sum, item) => `, `canSave = computed( () => this.items().length > 0 && !!this.`, `hasInsufficientItem = computed(() => this.items().some((item) => this.in`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 136–153 | `changes: SimpleChanges` | `void` |
| `locationName` | método public | 155–157 | `locationId: string` | `string` |
| `availableFor` | método public | 160–162 | `item: QuickTransferItem` | `number` |
| `insufficientFor` | método public | 164–166 | `item: QuickTransferItem` | `boolean` |
| `filteredProducts` | método public | 173–175 | — | `Product[]` |
| `onQueryInput` | método public | 177–184 | `value: string` | `void` |
| `onFocus` | método public | 186–191 | — | `void` |
| `onBlur` | método public | 193–197 | — | `void` |
| `onQueryEnter` | método public | 216–247 | — | `void` |
| `selectSuggestion` | método public | 249–251 | `product: Product` | `void` |
| `openScanner` | método public | 253–255 | — | `void` |
| `onBarcodeScanned` | método public | 257–261 | `code: string` | `void` |
| `addOrIncrement` | método private | 263–284 | `product: Product` | `void` |
| `clearQueryAndRefocus` | método private | 286–291 | — | `void` |
| `updateQuantity` | método public | 293–298 | `productId: string`, `rawValue: number \| string` | `void` |
| `removeItem` | método public | 300–302 | `productId: string` | `void` |
| `submit` | método public async | 304–353 | — | `Promise<void>` |
| `close` | método public async | 355–372 | — | `Promise<void>` |

##### `QuickTransferModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L136) (L136–153)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.items.set`, `this.query.set`, `this.searchResults.set`, `this.dropdownOpen.set`, `this.fromLocationId.set`, `this.toLocationId.set`, `this.inventoryLocationsService.getLocations().subscribe`, `this.inventoryLocationsService.getLocations`, `this.locations.set`, `locations.filter`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`, `this.items.set`, `this.query.set`, `this.searchResults.set`, `this.dropdownOpen.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuickTransferModalComponent.locationName`

- **Firma:** `locationName(locationId: string): string` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L155) (L155–157)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.locations().find`, `this.locations`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla), (mismo archivo)

##### `QuickTransferModalComponent.availableFor`

- **Firma:** `availableFor(item: QuickTransferItem): number` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L160) (L160–162)
- **Propósito / descripción:** "Disponible" para una línea del carrito — lee del `stockByLocation` capturado en el momento de agregar (ver `QuickTransferItem`), nunca de una lista de productos que podría no incluirlo. Sigue cambios de origen (recalcula por nombre de ubicación) igual que antes; ya no sigue un refetch posterior a guardar porque `items` se vacía en cada envío exitoso.
- **Dependencias (llamadas en su cuerpo):** `item.stockByLocation.find`, `this.locationName`, `this.fromLocationId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla), (mismo archivo)

##### `QuickTransferModalComponent.insufficientFor`

- **Firma:** `insufficientFor(item: QuickTransferItem): boolean` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L164) (L164–166)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.availableFor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla)

##### `QuickTransferModalComponent.filteredProducts`

- **Firma:** `filteredProducts(): Product[]` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L173) (L173–175)
- **Propósito / descripción:** Resultados del backend (ya acotados a `MAX_SUGGESTIONS` para la lista visible).
- **Dependencias (llamadas en su cuerpo):** `this.searchResults().slice`, `this.searchResults`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla)

##### `QuickTransferModalComponent.onQueryInput`

- **Firma:** `onQueryInput(value: string): void` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L177) (L177–184)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.dropdownOpen.set`, `value.trim`, `this.searchResults.set`, `this.query$.next`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.dropdownOpen.set`, `this.searchResults.set`
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla)

##### `QuickTransferModalComponent.onFocus`

- **Firma:** `onFocus(): void` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L186) (L186–191)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.inputFocused.set`, `this.query().trim`, `this.query`, `this.dropdownOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.inputFocused.set`, `this.dropdownOpen.set`; Ejecuta SQL crudo (`query`)
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla)

##### `QuickTransferModalComponent.onBlur`

- **Firma:** `onBlur(): void` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L193) (L193–197)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.inputFocused.set`, `setTimeout`, `this.dropdownOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.inputFocused.set`, `this.dropdownOpen.set`
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla)

##### `QuickTransferModalComponent.onQueryEnter`

- **Firma:** `onQueryEnter(): void` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L216) (L216–247)
- **Propósito / descripción:** The entire "lector de código de barras" mechanism: a USB/Bluetooth scanner in keyboard-wedge mode types the code and then sends its own Enter automatically — the operator never touches Enter/click, this handler is simply what's listening for it. Goes straight to the backend on every Enter (never `this.query$`'s debounced pipeline, never a locally-cached product list) so a scan resolves immediately and correctly regardless of how large the active catalog is — the exact same root cause already fixed once for the main Inventario search (a client-side-only match over a capped `LIST_LIMIT` page silently missing anything outside it). An exact SKU match is always preferred (what a real scan produce
- **Dependencias (llamadas en su cuerpo):** `this.query().trim`, `this.query`, `this.searching.set`, `this.inventoryService.getProducts(term).subscribe`, `this.inventoryService.getProducts`, `results.find`, `(p.sku ?? '').toLowerCase`, `term.toLowerCase`, `this.addOrIncrement`, `this.notificationService.error`, `this.clearQueryAndRefocus`
- **Efectos secundarios:** Actualiza estado (signals): `this.searching.set`; Ejecuta SQL crudo (`query`)
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla), (mismo archivo)

##### `QuickTransferModalComponent.selectSuggestion`

- **Firma:** `selectSuggestion(product: Product): void` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L249) (L249–251)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.addOrIncrement`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla)

##### `QuickTransferModalComponent.openScanner`

- **Firma:** `openScanner(): void` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L253) (L253–255)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla)

##### `QuickTransferModalComponent.onBarcodeScanned`

- **Firma:** `onBarcodeScanned(code: string): void` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L257) (L257–261)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`, `this.query.set`, `this.onQueryEnter`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`, `this.query.set`
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla)

##### `QuickTransferModalComponent.addOrIncrement`

- **Firma:** `addOrIncrement(product: Product): void` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L263) (L263–284)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.update`, `list.findIndex`, `this.notificationService.success`, `this.clearQueryAndRefocus`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** (mismo archivo)

##### `QuickTransferModalComponent.clearQueryAndRefocus`

- **Firma:** `clearQueryAndRefocus(): void` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L286) (L286–291)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.dropdownOpen.set`, `setTimeout`, `this.scanInputRef?.nativeElement.focus`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.dropdownOpen.set`
- **Consumidores:** (mismo archivo)

##### `QuickTransferModalComponent.updateQuantity`

- **Firma:** `updateQuantity(productId: string, rawValue: number \| string): void` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L293) (L293–298)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.max`, `Math.trunc`, `Number`, `this.items.update`, `list.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla)

##### `QuickTransferModalComponent.removeItem`

- **Firma:** `removeItem(productId: string): void` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L300) (L300–302)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.update`, `list.filter`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla)

##### `QuickTransferModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L304) (L304–353)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.canSave`, `this.hasInsufficientItem`, `this.locationName`, `this.fromLocationId`, `this.toLocationId`, `this.confirmDialogService.confirm`, `this.items`, `formatQuantity`, `this.totalUnits`, `this.isSubmitting.set`, `this.inventoryLocationsService.registerTransferBatch`, `this.items().map`, `this.notificationService.success`, `this.items.set`, `this.query.set`, `this.completed.emit`, `setTimeout`…
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`, `this.items.set`, `this.query.set`; Emite eventos: `this.completed.emit`
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla)

##### `QuickTransferModalComponent.close`

- **Firma:** `close(): Promise<void>` — [quick-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/quick-transfer-modal/quick-transfer-modal.component.ts#L355) (L355–372)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.items`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `quick-transfer-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-transfer-inventory-modal-transfer-inventory-modal-component-ts"></a>

### transfer-inventory-modal.component.ts

- **Ruta:** [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts`, 429 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-inventory`
- **Responsabilidad:** "Trasladar inventario" — Bodega ↔ Vitrina (or any two active locations), by any presentation, with a live conversion preview and an exact-wording confirmation before the real `POST /inventory/transfers` call.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [inventory-locations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-locations-service-ts), [inventory.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [product-detail-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-product-detail-page-component-ts), [inventory-page.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts) (plantilla), [product-detail-page.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-product-detail-page-component-ts) (plantilla)
- **Plantilla:** [transfer-inventory-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [barcode-scanner-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`, `(ngModelChange)="onProductQueryInput($event)"`, `(focus)="onProductFocus()"`, `(blur)="onProductBlur()"`, `(click)="openScanner()"`, `(click)="selectProduct(product)"`, `(scanned)="onBarcodeScanned($event)"`, `(closed)="scannerOpen.set(false)"`

**Interfaces, tipos y enums:**

- `type LockedProduct` (L36) = `Pick<Product, 'id' \| 'name'>` — Minimal shape needed to pre-lock the product picker — a caller that already knows exactly which product (e.g.

#### Clase `TransferInventoryModalComponent` (L47–428)

- **Decoradores:** `@Component({ selector: 'app-transfer-inventory-modal', standalone: true, imports: [ ReactiveFormsModule, FormsModule, ButtonComponent, IconComponent, DecimalInpu`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Trasladar inventario" — Bodega ↔ Vitrina (or any two active locations), by any presentation, with a live conversion preview and an exact-wording confirmation before the real `POST /inventory/transfers` call. Mirrors `ProductFormModalComponent`'s self-contained shape (injects the service directly, emits `completed`), not a dumb confirm-then-parent-calls-service pair — there's real form state here (product/presentation/locations/qty) a parent has no reason to own.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `inventoryLocationsService = inject(InventoryLocationsService)`, `inventoryService = inject(InventoryService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input lockedProduct = null`, `@Output closed = new EventEmitter<void>()`, `@Output completed = new EventEmitter<void>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`, `productQuery = signal('')`, `productDropdownOpen = signal(false)`, `scannerOpen = signal(false)`, `searchResults = signal<Product[]>([])`, `searching = signal(false)`, `selectedProductObject = signal<Product \| null>(null)`, `locations = signal<InventoryLocation[]>([])`, `presentations = signal<ProductPresentation[]>([])`, `loadingPresentations = signal(false)`, `productInventory = signal<ProductInventoryDetail \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `selectedProduct` | getter public | 139–145 | — | `Product \| LockedProduct \| null` |
| `filteredProducts` | método public | 148–150 | — | `Product[]` |
| `onProductQueryInput` | método public | 152–163 | `value: string` | `void` |
| `onProductFocus` | método public | 165–169 | — | `void` |
| `onProductBlur` | método public | 171–174 | — | `void` |
| `selectProduct` | método public | 176–181 | `product: Product` | `void` |
| `openScanner` | método public | 183–185 | — | `void` |
| `onBarcodeScanned` | método public | 196–219 | `code: string` | `void` |
| `selectedPresentation` | getter public | 221–224 | — | `ProductPresentation \| null` |
| `conversionFactor` | getter public | 226–228 | — | `number` |
| `totalBaseUnits` | getter public | 230–233 | — | `number` |
| `sameLocation` | getter public | 235–238 | — | `boolean` |
| `stockAt` | método public | 241–246 | `locationId: string` | `number` |
| `locationNameOf` | método public | 248–250 | `locationId: string` | `string` |
| `fromLocationId` | getter public | 252–254 | — | `string` |
| `toLocationId` | getter public | 256–258 | — | `string` |
| `fromStock` | getter public | 260–262 | — | `number` |
| `toStock` | getter public | 264–266 | — | `number` |
| `presentationBreakdown` | método public | 269–275 | `baseUnits: number` | `{ count: number; remainder: number }` |
| `fromBreakdown` | getter public | 277–279 | — | (inferido) |
| `fromAfterBaseUnits` | getter public | 281–283 | — | `number` |
| `toAfterBaseUnits` | getter public | 285–287 | — | `number` |
| `fromAfterBreakdown` | getter public | 289–291 | — | (inferido) |
| `insufficientStock` | getter public | 294–301 | — | `boolean` |
| `canPreviewTransfer` | getter public | 303–305 | — | `boolean` |
| `ngOnChanges` | método public | 307–333 | `changes: SimpleChanges` | `void` |
| `onProductChange` | método public | 335–360 | `productId: string` | `void` |
| `submit` | método public async | 362–414 | — | `Promise<void>` |
| `close` | método public async | 416–427 | — | `Promise<void>` |

##### `TransferInventoryModalComponent.selectedProduct`

- **Firma:** `selectedProduct(): Product \| LockedProduct \| null` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L139) (L139–145)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedProductObject`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.filteredProducts`

- **Firma:** `filteredProducts(): Product[]` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L148) (L148–150)
- **Propósito / descripción:** Resultados del backend (ya acotados a `MAX_PRODUCT_RESULTS` para la lista visible).
- **Dependencias (llamadas en su cuerpo):** `this.searchResults().slice`, `this.searchResults`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transfer-inventory-modal.component.html` (plantilla)

##### `TransferInventoryModalComponent.onProductQueryInput`

- **Firma:** `onProductQueryInput(value: string): void` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L152) (L152–163)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productQuery.set`, `this.productDropdownOpen.set`, `this.form.controls.productId.setValue`, `this.selectedProductObject.set`, `value.trim`, `this.searchResults.set`, `this.productQuery$.next`
- **Efectos secundarios:** Actualiza estado (signals): `this.productQuery.set`, `this.productDropdownOpen.set`, `this.selectedProductObject.set`, `this.searchResults.set`
- **Consumidores:** `transfer-inventory-modal.component.html` (plantilla)

##### `TransferInventoryModalComponent.onProductFocus`

- **Firma:** `onProductFocus(): void` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L165) (L165–169)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productQuery().trim`, `this.productQuery`, `this.productDropdownOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.productDropdownOpen.set`
- **Consumidores:** `transfer-inventory-modal.component.html` (plantilla)

##### `TransferInventoryModalComponent.onProductBlur`

- **Firma:** `onProductBlur(): void` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L171) (L171–174)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `setTimeout`, `this.productDropdownOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.productDropdownOpen.set`
- **Consumidores:** `transfer-inventory-modal.component.html` (plantilla)

##### `TransferInventoryModalComponent.selectProduct`

- **Firma:** `selectProduct(product: Product): void` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L176) (L176–181)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productQuery.set`, `this.productDropdownOpen.set`, `this.selectedProductObject.set`, `this.form.controls.productId.setValue`
- **Efectos secundarios:** Actualiza estado (signals): `this.productQuery.set`, `this.productDropdownOpen.set`, `this.selectedProductObject.set`
- **Consumidores:** `transfer-inventory-modal.component.html` (plantilla), (mismo archivo)

##### `TransferInventoryModalComponent.openScanner`

- **Firma:** `openScanner(): void` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L183) (L183–185)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`
- **Consumidores:** `transfer-inventory-modal.component.html` (plantilla)

##### `TransferInventoryModalComponent.onBarcodeScanned`

- **Firma:** `onBarcodeScanned(code: string): void` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L196) (L196–219)
- **Propósito / descripción:** Va directo al backend (nunca a `this.productQuery$`'s debounced pipeline ni a una lista de productos local) para que un escaneo se resuelva de inmediato y correctamente sin importar el tamaño del catálogo activo — mismo motivo que `QuickTransferModalComponent`'s propio `onQueryEnter()`. Prioriza un match exacto de SKU (lo que produce un escaneo real); si no hay uno pero el backend devolvió exactamente un resultado, también lo elige.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`, `this.productQuery.set`, `this.searching.set`, `this.inventoryService.getProducts(code).subscribe`, `this.inventoryService.getProducts`, `this.searchResults.set`, `results.find`, `(p.sku ?? '').toLowerCase`, `code.trim().toLowerCase`, `code.trim`, `this.selectProduct`, `this.productDropdownOpen.set`, `this.notificationService.error`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`, `this.productQuery.set`, `this.searching.set`, `this.searchResults.set`, `this.productDropdownOpen.set`
- **Consumidores:** `transfer-inventory-modal.component.html` (plantilla)

##### `TransferInventoryModalComponent.selectedPresentation`

- **Firma:** `selectedPresentation(): ProductPresentation \| null` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L221) (L221–224)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.presentations().find`, `this.presentations`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.conversionFactor`

- **Firma:** `conversionFactor(): number` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L226) (L226–228)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.totalBaseUnits`

- **Firma:** `totalBaseUnits(): number` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L230) (L230–233)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.sameLocation`

- **Firma:** `sameLocation(): boolean` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L235) (L235–238)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.form.getRawValue`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.stockAt`

- **Firma:** `stockAt(locationId: string): number` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L241) (L241–246)
- **Propósito / descripción:** Base-units stock currently at `locationId`, straight from `inventory_stock` (never derived from `products.stock`, which is the cross-location total).
- **Dependencias (llamadas en su cuerpo):** `this.productInventory()?.stockByLocation.find`, `this.productInventory`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TransferInventoryModalComponent.locationNameOf`

- **Firma:** `locationNameOf(locationId: string): string` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L248) (L248–250)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.locations().find`, `this.locations`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transfer-inventory-modal.component.html` (plantilla), (mismo archivo)

##### `TransferInventoryModalComponent.fromLocationId`

- **Firma:** `fromLocationId(): string` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L252) (L252–254)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.toLocationId`

- **Firma:** `toLocationId(): string` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L256) (L256–258)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.fromStock`

- **Firma:** `fromStock(): number` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L260) (L260–262)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.stockAt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.toStock`

- **Firma:** `toStock(): number` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L264) (L264–266)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.stockAt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.presentationBreakdown`

- **Firma:** `presentationBreakdown(baseUnits: number): { count: number; remainder: number }` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L269) (L269–275)
- **Propósito / descripción:** Whole presentation units (e.g. "cajas") that fit in a base-unit quantity, plus whatever doesn't evenly divide — factor 1 ("Unidad") always divides exactly, so `remainder` is always 0 in that case.
- **Dependencias (llamadas en su cuerpo):** `Math.floor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TransferInventoryModalComponent.fromBreakdown`

- **Firma:** `fromBreakdown()` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L277) (L277–279)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.presentationBreakdown`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.fromAfterBaseUnits`

- **Firma:** `fromAfterBaseUnits(): number` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L281) (L281–283)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.toAfterBaseUnits`

- **Firma:** `toAfterBaseUnits(): number` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L285) (L285–287)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.fromAfterBreakdown`

- **Firma:** `fromAfterBreakdown()` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L289) (L289–291)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.presentationBreakdown`, `Math.max`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.insufficientStock`

- **Firma:** `insufficientStock(): boolean` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L294) (L294–301)
- **Propósito / descripción:** Client-side echo of the backend's own `INSUFFICIENT_STOCK` check — the real guard is the SQL function's `FOR UPDATE` lock, this only gives fast, clear feedback before ever calling it.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.canPreviewTransfer`

- **Firma:** `canPreviewTransfer(): boolean` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L303) (L303–305)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L307) (L307–333)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.presentations.set`, `this.productInventory.set`, `this.productQuery.set`, `this.productDropdownOpen.set`, `this.searchResults.set`, `this.selectedProductObject.set`, `this.form.reset`, `this.inventoryLocationsService.getLocations().subscribe`, `this.inventoryLocationsService.getLocations`, `this.locations.set`, `locations.filter`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`, `this.presentations.set`, `this.productInventory.set`, `this.productQuery.set`, `this.productDropdownOpen.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.onProductChange`

- **Firma:** `onProductChange(productId: string): void` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L335) (L335–360)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.form.controls.presentationId.setValue`, `this.presentations.set`, `this.productInventory.set`, `this.loadingPresentations.set`, `this.inventoryLocationsService.getProductInventory(productId).subscribe`, `this.inventoryLocationsService.getProductInventory`, `detail.presentations.filter`, `active.find`, `this.errorMessage.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.presentations.set`, `this.productInventory.set`, `this.loadingPresentations.set`, `this.errorMessage.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransferInventoryModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L362) (L362–414)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.locationNameOf`, `formatQuantity`, `this.form.getRawValue`, `this.locations().find`, `this.locations`, `this.confirmDialogService.confirm`, `this.isSubmitting.set`, `this.inventoryLocationsService.registerTransfer`, `reason.trim`, `this.completed.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.completed.emit`
- **Consumidores:** `transfer-inventory-modal.component.html` (plantilla)

##### `TransferInventoryModalComponent.close`

- **Firma:** `close(): Promise<void>` — [transfer-inventory-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/transfer-inventory-modal/transfer-inventory-modal.component.ts#L416) (L416–427)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `transfer-inventory-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts"></a>

### inventory-page.component.ts

- **Ruta:** [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts`, 522 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-inventory`
- **Responsabilidad:** Componente Angular: declara `InventoryPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [category.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-category-service-ts), [business.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-business-service-ts), [unit-of-measure.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-unit-of-measure-service-ts), [inventory.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-service-ts), [purchases.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-purchases-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-blob-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [inventory-summary.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-inventory-summary-inventory-summary-component-ts), [inventory-toolbar.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-inventory-toolbar-inventory-toolbar-component-ts), [product-table.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-table-product-table-component-ts) y 6 más
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [inventory-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [inventory-summary.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-inventory-summary-inventory-summary-component-ts), [inventory-toolbar.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-inventory-toolbar-inventory-toolbar-component-ts), [product-table.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-table-product-table-component-ts), [transfer-inventory-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-transfer-inventory-modal-transfer-inventory-modal-component-ts), [quick-transfer-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-quick-transfer-modal-quick-transfer-modal-component-ts), [product-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-delete-confirm-modal-delete-confirm-modal-component-ts), [import-results-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-import-results-modal-import-results-modal-component-ts), [import-purchase-results-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-import-purchase-results-modal-import-purchase-results-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="onSearchTermChange($event)"`, `(selectedCategoryChange)="selectedCategory.set($event)"`, `(selectedBusinessChange)="selectedBusiness.set($event)"`, `(stockFilterChange)="stockFilter.set($event)"`, `(addProduct)="openCreateForm()"`, `(quickTransferInventory)="openQuickTransferModal()"`, `(transferInventory)="openTransferModal()"`, `(exportPdf)="onExportPdf()"`, `(exportExcel)="onExportExcel()"`, `(importFile)="onImportFile($event)"`, `(downloadImportTemplate)="onDownloadImportTemplate()"`, `(importInitialStockFile)="onImportInitialStockFile($event)"`, `(downloadInitialStockTemplate)="onDownloadInitialStockTemplate()"`, `(edit)="openEditForm($event)"`, `(delete)="requestDelete($event)"`

#### Clase `InventoryPageComponent` (L38–521)

- **Decoradores:** `@Component({ selector: 'app-inventory-page', standalone: true, imports: [ PageHeaderComponent, InventorySummaryComponent, InventoryToolbarComponent, ProductTable`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `inventoryService = inject(InventoryService)`, `purchasesService = inject(PurchasesService)`, `categoryService = inject(CategoryService)`, `businessService = inject(BusinessService)`, `unitOfMeasureService = inject(UnitOfMeasureService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`, `router = inject(Router)`
- **Datos / estado que administra:** `isTransferOpen = signal(false)`, `isQuickTransferOpen = signal(false)`, `isImporting = signal(false)`, `isImportResultsOpen = signal(false)`, `importResult = signal<ImportProductsResult \| null>(null)`, `isImportingInitialStock = signal(false)`, `isImportInitialStockResultsOpen = signal(false)`, `importInitialStockResult = signal<ImportPurchaseResult \| null>(null)`, `products = signal<Product[]>([])`, `loading = signal(true)`, `stats = signal<InventoryStats \| null>(null)`, `categoryOptions = signal<Category[]>([])`, `businessOptions = signal<Business[]>([])`, `unitOfMeasureOptions = signal<UnitOfMeasureListItem[]>([])`, `searchTerm = signal('')`, `selectedCategory = signal('')`, `selectedBusiness = signal('')`, `stockFilter = signal<StockFilterValue>('all')`, `searchResults = signal<Product[] \| null>(null)`, `searching = signal(false)`, `isFormOpen = signal(false)`, `editingProduct = signal<Product \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingProduct = signal<Product \| null>(null)`, `isDeleting = signal(false)`, `categories = computed(() => [...new Set(this.products().map((p)`, `businesses = computed(() => [...new Set(this.products().map((p)`, `filteredProducts = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed( () => this.searchTerm().trim().length > `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onSearchTermChange` | método public | 225–231 | `value: string` | `void` |
| `fetchStats` | método private | 233–243 | — | `void` |
| `refetchProducts` | método private | 253–259 | — | `void` |
| `openCreateForm` | método public | 261–264 | — | `void` |
| `openEditForm` | método public | 266–269 | `product: Product` | `void` |
| `closeForm` | método public | 271–273 | — | `void` |
| `onProductSaved` | método public | 275–293 | `product: Product` | `void` |
| `requestDelete` | método public | 295–298 | `product: Product` | `void` |
| `cancelDelete` | método public | 300–303 | — | `void` |
| `confirmDelete` | método public | 305–329 | — | `void` |
| `clearFilters` | método public | 331–338 | — | `void` |
| `viewDetail` | método public | 340–342 | `product: Product` | `void` |
| `openTransferModal` | método public | 344–346 | — | `void` |
| `closeTransferModal` | método public | 348–350 | — | `void` |
| `openQuickTransferModal` | método public | 352–354 | — | `void` |
| `closeQuickTransferModal` | método public | 356–358 | — | `void` |
| `onQuickTransferSaved` | método public | 366–369 | — | `void` |
| `currentExportFilters` | método private | 383–397 | — | `{ search?: string; categoryId?: string; businessId?: string }` |
| `warnIfStockFilterActive` | método private | 399–405 | — | `void` |
| `onExportPdf` | método public | 407–416 | — | `void` |
| `onExportExcel` | método public | 418–427 | — | `void` |
| `onTransferCompleted` | método public | 429–439 | — | `void` |
| `onDownloadImportTemplate` | método public | 441–449 | — | `void` |
| `onImportFile` | método public | 458–475 | `file: File` | `void` |
| `closeImportResults` | método public | 477–480 | — | `void` |
| `onDownloadInitialStockTemplate` | método public | 482–490 | — | `void` |
| `onImportInitialStockFile` | método public | 498–515 | `file: File` | `void` |
| `closeImportInitialStockResults` | método public | 517–520 | — | `void` |

##### `InventoryPageComponent.onSearchTermChange`

- **Firma:** `onSearchTermChange(value: string): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L225) (L225–231)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `value.trim`, `this.searchResults.set`, `this.searchTerm$.next`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.searchResults.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.fetchStats`

- **Firma:** `fetchStats(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L233) (L233–243)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.inventoryService.getInventoryStats().subscribe`, `this.inventoryService.getInventoryStats`, `this.stats.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.stats.set`
- **Consumidores:** (mismo archivo)

##### `InventoryPageComponent.refetchProducts`

- **Firma:** `refetchProducts(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L253) (L253–259)
- **Propósito / descripción:** Re-fetches the base product list and, if a search is currently active, re-runs it too — so a transfer/import that changed stock or added products doesn't leave a stale search result on screen. Calls `getProducts(term)` directly rather than going through `searchTerm$`: that subject's `distinctUntilChanged()` would silently swallow a forced refresh for the exact same (unchanged) term.
- **Dependencias (llamadas en su cuerpo):** `this.inventoryService.getProducts().subscribe`, `this.inventoryService.getProducts`, `this.products.set`, `this.searchTerm().trim`, `this.searchTerm`, `this.inventoryService.getProducts(term).subscribe`, `this.searchResults.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.products.set`, `this.searchResults.set`
- **Consumidores:** (mismo archivo)

##### `InventoryPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L261) (L261–264)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingProduct.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingProduct.set`, `this.isFormOpen.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.openEditForm`

- **Firma:** `openEditForm(product: Product): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L266) (L266–269)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingProduct.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingProduct.set`, `this.isFormOpen.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L271) (L271–273)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.onProductSaved`

- **Firma:** `onProductSaved(product: Product): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L275) (L275–293)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingProduct`, `this.isFormOpen.set`, `this.products.update`, `list.map`, `this.searchResults`, `this.searchResults.update`, `list!.map`, `this.notificationService.success`, `this.fetchStats`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.products.update`, `this.searchResults.update`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.requestDelete`

- **Firma:** `requestDelete(product: Product): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L295) (L295–298)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingProduct.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingProduct.set`, `this.isDeleteOpen.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L300) (L300–303)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingProduct.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingProduct.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L305) (L305–329)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingProduct`, `this.isDeleting.set`, `this.inventoryService.deleteProduct(product.id).subscribe`, `this.inventoryService.deleteProduct`, `this.isDeleteOpen.set`, `this.deletingProduct.set`, `this.products.update`, `list.filter`, `this.searchResults`, `this.searchResults.update`, `list!.filter`, `this.notificationService.success`, `this.fetchStats`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingProduct.set`, `this.products.update`, `this.searchResults.update`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L331) (L331–338)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.searchResults.set`, `this.searchTerm$.next`, `this.selectedCategory.set`, `this.selectedBusiness.set`, `this.stockFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.searchResults.set`, `this.selectedCategory.set`, `this.selectedBusiness.set`, `this.stockFilter.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.viewDetail`

- **Firma:** `viewDetail(product: Product): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L340) (L340–342)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.router.navigate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.openTransferModal`

- **Firma:** `openTransferModal(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L344) (L344–346)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isTransferOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isTransferOpen.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.closeTransferModal`

- **Firma:** `closeTransferModal(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L348) (L348–350)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isTransferOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isTransferOpen.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.openQuickTransferModal`

- **Firma:** `openQuickTransferModal(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L352) (L352–354)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isQuickTransferOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isQuickTransferOpen.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.closeQuickTransferModal`

- **Firma:** `closeQuickTransferModal(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L356) (L356–358)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isQuickTransferOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isQuickTransferOpen.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.onQuickTransferSaved`

- **Firma:** `onQuickTransferSaved(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L366) (L366–369)
- **Propósito / descripción:** Unlike `onTransferCompleted`, this never closes the modal — "Transferencia rápida" is meant to stay open for a whole run of consecutive transfers (scan → guardar → scan → guardar…), so only the product/stock data refreshes here; the operator closes it explicitly when done.
- **Dependencias (llamadas en su cuerpo):** `this.refetchProducts`, `this.fetchStats`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.currentExportFilters`

- **Firma:** `currentExportFilters(): { search?: string; categoryId?: string; businessId?: string }` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L383) (L383–397)
- **Propósito / descripción:** The toolbar's category/negocio filters store the selected *name* (`categories()`/`businesses()` are distinct names pulled from already- loaded products, not ids) — resolved back to the real id here via the already-fetched `categoryOptions`/`businessOptions`, since the backend export routes filter by id, not by display name. `search` maps directly. The stock-status chip (Con stock/Stock bajo/Sin stock) has no backend equivalent — it's purely a client-side computation over `product.stock` — so it's deliberately never sent; the export always reflects the search/categoría/negocio filters only, and a toast says so when it's active so the export never silently looks "wrong".
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm().trim`, `this.searchTerm`, `this.selectedCategory`, `this.selectedBusiness`, `this.categoryOptions().find`, `this.categoryOptions`, `this.businessOptions().find`, `this.businessOptions`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `InventoryPageComponent.warnIfStockFilterActive`

- **Firma:** `warnIfStockFilterActive(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L399) (L399–405)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.stockFilter`, `this.notificationService.info`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `InventoryPageComponent.onExportPdf`

- **Firma:** `onExportPdf(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L407) (L407–416)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.warnIfStockFilterActive`, `this.inventoryService.exportProductsPdf(this.currentExportFilters()).subscribe`, `this.inventoryService.exportProductsPdf`, `this.currentExportFilters`, `downloadBlob`, `Date.now`, `this.notificationService.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.onExportExcel`

- **Firma:** `onExportExcel(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L418) (L418–427)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.warnIfStockFilterActive`, `this.inventoryService.exportProductsExcel(this.currentExportFilters()).subscribe`, `this.inventoryService.exportProductsExcel`, `this.currentExportFilters`, `downloadBlob`, `Date.now`, `this.notificationService.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.onTransferCompleted`

- **Firma:** `onTransferCompleted(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L429) (L429–439)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isTransferOpen.set`, `this.notificationService.success`, `this.refetchProducts`, `this.fetchStats`
- **Efectos secundarios:** Actualiza estado (signals): `this.isTransferOpen.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.onDownloadImportTemplate`

- **Firma:** `onDownloadImportTemplate(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L441) (L441–449)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.inventoryService.downloadImportTemplate().subscribe`, `this.inventoryService.downloadImportTemplate`, `downloadBlob`, `this.notificationService.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.onImportFile`

- **Firma:** `onImportFile(file: File): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L458) (L458–475)
- **Propósito / descripción:** Every product `POST /products/import` accepted is already saved by the time this resolves — the response is only a summary, never something to "confirm" — so the follow-up is the same as after any create: show the result, then refetch the list once (never per-row) so the table reflects every newly created product in one request.
- **Dependencias (llamadas en su cuerpo):** `this.isImporting.set`, `this.inventoryService.importProductsExcel(file).subscribe`, `this.inventoryService.importProductsExcel`, `this.importResult.set`, `this.isImportResultsOpen.set`, `this.refetchProducts`, `this.fetchStats`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isImporting.set`, `this.importResult.set`, `this.isImportResultsOpen.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.closeImportResults`

- **Firma:** `closeImportResults(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L477) (L477–480)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isImportResultsOpen.set`, `this.importResult.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isImportResultsOpen.set`, `this.importResult.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.onDownloadInitialStockTemplate`

- **Firma:** `onDownloadInitialStockTemplate(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L482) (L482–490)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.purchasesService.downloadInitialStockTemplate().subscribe`, `this.purchasesService.downloadInitialStockTemplate`, `downloadBlob`, `this.notificationService.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.onImportInitialStockFile`

- **Firma:** `onImportInitialStockFile(file: File): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L498) (L498–515)
- **Propósito / descripción:** Every row `POST /purchases/import` accepted already registered a real purchase (stock included) by the time this resolves — same "show the result, then refetch once" follow-up as `onImportFile`, since this mutation changes stock, not just the catalog.
- **Dependencias (llamadas en su cuerpo):** `this.isImportingInitialStock.set`, `this.purchasesService.importInitialStockExcel(file).subscribe`, `this.purchasesService.importInitialStockExcel`, `this.importInitialStockResult.set`, `this.isImportInitialStockResultsOpen.set`, `this.refetchProducts`, `this.fetchStats`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isImportingInitialStock.set`, `this.importInitialStockResult.set`, `this.isImportInitialStockResultsOpen.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

##### `InventoryPageComponent.closeImportInitialStockResults`

- **Firma:** `closeImportInitialStockResults(): void` — [inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts#L517) (L517–520)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isImportInitialStockResultsOpen.set`, `this.importInitialStockResult.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isImportInitialStockResultsOpen.set`, `this.importInitialStockResult.set`
- **Consumidores:** `inventory-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-inventory-product-detail-page-component-ts"></a>

### product-detail-page.component.ts

- **Ruta:** [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts`, 223 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-inventory`
- **Responsabilidad:** Product detail view — General / Presentaciones / Inventario / Movimientos recientes, exactly the four sections the "Inventario por ubicación" ticket asked for.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [inventory-locations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-locations-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [presentation-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-presentation-form-modal-presentation-form-modal-component-ts), [transfer-inventory-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-transfer-inventory-modal-transfer-inventory-modal-component-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [product-detail-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [transfer-inventory-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-transfer-inventory-modal-transfer-inventory-modal-component-ts), [presentation-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-presentation-form-modal-presentation-form-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="goBack()"`, `(click)="openTransferModal()"`, `(input)="onMinStockInput(row.locationId, $any($event.target).value)"`, `(click)="saveMinStock(row.locationId)"`, `(click)="openCreatePresentation()"`, `(click)="openEditPresentation(presentation)"`, `(click)="toggleActive(presentation)"`, `(closed)="closeTransferModal()"`, `(completed)="onTransferCompleted()"`, `(closed)="closePresentationForm()"`, `(saved)="onPresentationSaved()"`

#### Clase `ProductDetailPageComponent` (L32–222)

- **Decoradores:** `@Component({ selector: 'app-product-detail-page', standalone: true, imports: [ DatePipe, PageHeaderComponent, ButtonComponent, BadgeComponent, CardComponent, Ico`
- **Propósito:** Product detail view — General / Presentaciones / Inventario / Movimientos recientes, exactly the four sections the "Inventario por ubicación" ticket asked for. Reached from `ProductTableComponent`'s new "Ver detalle" action (`/dashboard/inventario/:id`). Read-only for everyone except the "Administración de presentaciones" actions, gated the same way every other admin-only mutation in this app already is (`AuthService.isAdmin`, UI-only — the backend's own `@Roles(...)` is the real enforcement).
- **Servicios inyectados con `inject()`:** `route = inject(ActivatedRoute)`, `router = inject(Router)`, `inventoryLocationsService = inject(InventoryLocationsService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `detail = signal<ProductInventoryDetail \| null>(null)`, `loading = signal(true)`, `isPresentationFormOpen = signal(false)`, `editingPresentation = signal<ProductPresentation \| null>(null)`, `isTransferOpen = signal(false)`, `draftMinStock = signal<Record<string, string>>({})`, `savingMinStockLocationId = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `bulkPresentation` | getter public | 73–79 | — | `ProductPresentation \| null` |
| `bulkBreakdown` | método public | 82–88 | `baseUnits: number` | `{ count: number; remainder: number } \| null` |
| `fetchDetail` | método private | 98–121 | — | `void` |
| `goBack` | método public | 123–125 | — | `void` |
| `openCreatePresentation` | método public | 127–130 | — | `void` |
| `openEditPresentation` | método public | 132–135 | `presentation: ProductPresentation` | `void` |
| `closePresentationForm` | método public | 137–139 | — | `void` |
| `onPresentationSaved` | método public | 141–145 | — | `void` |
| `openTransferModal` | método public | 147–149 | — | `void` |
| `closeTransferModal` | método public | 151–153 | — | `void` |
| `onTransferCompleted` | método public | 155–162 | — | `void` |
| `onMinStockInput` | método public | 164–166 | `locationId: string`, `value: string` | `void` |
| `canSaveMinStock` | método public | 169–176 | `locationId: string` | `boolean` |
| `saveMinStock` | método public | 178–195 | `locationId: string` | `void` |
| `toggleActive` | método public async | 197–221 | `presentation: ProductPresentation` | `Promise<void>` |

##### `ProductDetailPageComponent.bulkPresentation`

- **Firma:** `bulkPresentation(): ProductPresentation \| null` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L73) (L73–79)
- **Propósito / descripción:** The active, non-"Unidad" presentation with the largest factor — the natural "bulk" unit (e.g. Caja) to show a per-location equivalence for. `null` when a product only has "Unidad" (factor 1), since showing "X unidades (X unidades)" would be redundant noise.
- **Dependencias (llamadas en su cuerpo):** `(this.detail()?.presentations ?? []).filter`, `this.detail`, `candidates.reduce`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductDetailPageComponent.bulkBreakdown`

- **Firma:** `bulkBreakdown(baseUnits: number): { count: number; remainder: number } \| null` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L82) (L82–88)
- **Propósito / descripción:** Whole bulk-presentation units that fit in `baseUnits`, plus whatever doesn't evenly divide — purely a display equivalence, never a second source of truth (the real stored quantity is always `baseUnits`).
- **Dependencias (llamadas en su cuerpo):** `Math.floor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `product-detail-page.component.html` (plantilla)

##### `ProductDetailPageComponent.fetchDetail`

- **Firma:** `fetchDetail(): void` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L98) (L98–121)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.inventoryLocationsService.getProductInventory(this.productId).subscribe`, `this.inventoryLocationsService.getProductInventory`, `this.detail.set`, `this.draftMinStock.update`, `String`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.detail.set`, `this.draftMinStock.update`
- **Consumidores:** (mismo archivo)

##### `ProductDetailPageComponent.goBack`

- **Firma:** `goBack(): void` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L123) (L123–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.router.navigate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `product-detail-page.component.html` (plantilla)

##### `ProductDetailPageComponent.openCreatePresentation`

- **Firma:** `openCreatePresentation(): void` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L127) (L127–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingPresentation.set`, `this.isPresentationFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingPresentation.set`, `this.isPresentationFormOpen.set`
- **Consumidores:** `product-detail-page.component.html` (plantilla)

##### `ProductDetailPageComponent.openEditPresentation`

- **Firma:** `openEditPresentation(presentation: ProductPresentation): void` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L132) (L132–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingPresentation.set`, `this.isPresentationFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingPresentation.set`, `this.isPresentationFormOpen.set`
- **Consumidores:** `product-detail-page.component.html` (plantilla)

##### `ProductDetailPageComponent.closePresentationForm`

- **Firma:** `closePresentationForm(): void` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L137) (L137–139)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isPresentationFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isPresentationFormOpen.set`
- **Consumidores:** `product-detail-page.component.html` (plantilla)

##### `ProductDetailPageComponent.onPresentationSaved`

- **Firma:** `onPresentationSaved(): void` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L141) (L141–145)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isPresentationFormOpen.set`, `this.notificationService.success`, `this.fetchDetail`
- **Efectos secundarios:** Actualiza estado (signals): `this.isPresentationFormOpen.set`
- **Consumidores:** `product-detail-page.component.html` (plantilla)

##### `ProductDetailPageComponent.openTransferModal`

- **Firma:** `openTransferModal(): void` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L147) (L147–149)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isTransferOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isTransferOpen.set`
- **Consumidores:** `product-detail-page.component.html` (plantilla)

##### `ProductDetailPageComponent.closeTransferModal`

- **Firma:** `closeTransferModal(): void` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L151) (L151–153)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isTransferOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isTransferOpen.set`
- **Consumidores:** `product-detail-page.component.html` (plantilla)

##### `ProductDetailPageComponent.onTransferCompleted`

- **Firma:** `onTransferCompleted(): void` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L155) (L155–162)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isTransferOpen.set`, `this.notificationService.success`, `this.fetchDetail`
- **Efectos secundarios:** Actualiza estado (signals): `this.isTransferOpen.set`
- **Consumidores:** `product-detail-page.component.html` (plantilla)

##### `ProductDetailPageComponent.onMinStockInput`

- **Firma:** `onMinStockInput(locationId: string, value: string): void` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L164) (L164–166)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftMinStock.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftMinStock.update`
- **Consumidores:** `product-detail-page.component.html` (plantilla)

##### `ProductDetailPageComponent.canSaveMinStock`

- **Firma:** `canSaveMinStock(locationId: string): boolean` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L169) (L169–176)
- **Propósito / descripción:** Mirrors `RechargeTableComponent.canSave()`'s proactive UX echo of the backend's own validation — an integer `&gt;= 0`.
- **Dependencias (llamadas en su cuerpo):** `this.draftMinStock`, `Number`, `Number.isInteger`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `product-detail-page.component.html` (plantilla), (mismo archivo)

##### `ProductDetailPageComponent.saveMinStock`

- **Firma:** `saveMinStock(locationId: string): void` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L178) (L178–195)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSaveMinStock`, `this.savingMinStockLocationId`, `Number`, `this.draftMinStock`, `this.savingMinStockLocationId.set`, `this.inventoryLocationsService.setMinStock`, `this.notificationService.success`, `this.fetchDetail`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.savingMinStockLocationId.set`
- **Consumidores:** `product-detail-page.component.html` (plantilla)

##### `ProductDetailPageComponent.toggleActive`

- **Firma:** `toggleActive(presentation: ProductPresentation): Promise<void>` — [product-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/product-detail-page.component.ts#L197) (L197–221)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.inventoryLocationsService.updatePresentation`, `this.notificationService.success`, `this.fetchDetail`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `product-detail-page.component.html` (plantilla)

