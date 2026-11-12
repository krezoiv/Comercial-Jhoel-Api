# Frontend `dashboard-sales`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [cancel-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-cancel-confirm-modal-cancel-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `SaleCancelConfirmModalComponent` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [product-search.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-product-search-product-search-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `ProductSearchComponent` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [sale-items-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-items-table-sale-items-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `SaleItemsTableComponent` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [sale-pricing-bar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-pricing-bar-sale-pricing-bar-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Venta por mayor" — lets the cashier pick an optional client and a price list (Público/Mayorista) for the receipt about to be built. | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [sale-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-summary-sale-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `SaleSummaryComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [sales-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | All receipt state (for every open tab) lives in `SalesDraftStore`, a root-provided singleton — this component is purely a thin view over whichever draft is currently active. | 8 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [cancel-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/cancel-confirm-modal/cancel-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cancel-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [cancel-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/cancel-confirm-modal/cancel-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [product-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/product-search/product-search.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `product-search.component.ts`; usa 2 componentes hijos: `app-icon`, `app-barcode-scanner-modal`. | — | — | Media |
| [product-search.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/product-search/product-search.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [sale-items-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-items-table/sale-items-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sale-items-table.component.ts`; usa 2 componentes hijos: `app-empty-state`, `app-icon`. | — | — | Media |
| [sale-items-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-items-table/sale-items-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [sale-pricing-bar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-pricing-bar/sale-pricing-bar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sale-pricing-bar.component.ts`; usa 2 componentes hijos: `app-icon`, `app-client-search-select`. | — | — | Media |
| [sale-pricing-bar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-pricing-bar/sale-pricing-bar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [sale-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-summary/sale-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sale-summary.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [sale-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-summary/sale-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [sales-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sales-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-sale-pricing-bar`, `app-product-search`, `app-sale-items-table`, `app-sale-summary`, `app-sale-cancel-confirm-modal`. | — | — | Media |
| [sales-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-sales-components-cancel-confirm-modal-cancel-confirm-modal-component-ts"></a>

### cancel-confirm-modal.component.ts

- **Ruta:** [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/cancel-confirm-modal/cancel-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/sales/components/cancel-confirm-modal/cancel-confirm-modal.component.ts`, 19 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-sales`
- **Responsabilidad:** Componente Angular: declara `SaleCancelConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts), [sales-page.component.ts (plantilla)](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts) (plantilla)
- **Plantilla:** [cancel-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/cancel-confirm-modal/cancel-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `SaleCancelConfirmModalComponent` (L5–18)

- **Decoradores:** `@Component({ selector: 'app-sale-cancel-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './cancel-confirm-modal.compone`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-sales-components-product-search-product-search-component-ts"></a>

### product-search.component.ts

- **Ruta:** [product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/product-search/product-search.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/sales/components/product-search/product-search.component.ts`, 125 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-sales`
- **Responsabilidad:** Componente Angular: declara `ProductSearchComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [inventory.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts), [sales-page.component.ts (plantilla)](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts) (plantilla)
- **Plantilla:** [product-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/product-search/product-search.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [barcode-scanner-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="onInput($event)"`, `(focus)="onFocus()"`, `(blur)="onBlur()"`, `(keydown.enter)="onEnter()"`, `(click)="openScanner()"`, `(scanned)="onBarcodeScanned($event)"`, `(closed)="scannerOpen.set(false)"`, `(click)="select(product)"`

#### Clase `ProductSearchComponent` (L10–124)

- **Decoradores:** `@Component({ selector: 'app-product-search', standalone: true, imports: [FormsModule, IconComponent, BarcodeScannerModalComponent], templateUrl: './product-searc`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `inventoryService = inject(InventoryService)`
- **Datos / estado que administra:** `@Input priceList = 'PUBLIC'`, `@Output productSelected = new EventEmitter<Product>()`, `query = signal('')`, `results = signal<Product[]>([])`, `loading = signal(false)`, `open = signal(false)`, `hasSearched = signal(false)`, `scannerOpen = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onInput` | método public | 62–70 | `value: string` | `void` |
| `onFocus` | método public | 72–76 | — | `void` |
| `onBlur` | método public | 78–81 | — | `void` |
| `select` | método public | 83–92 | `product: Product` | `void` |
| `onEnter` | método public | 94–99 | — | `void` |
| `openScanner` | método public | 101–103 | — | `void` |
| `onBarcodeScanned` | método public | 105–119 | `code: string` | `void` |
| `priceFor` | método public | 121–123 | `product: Product` | `number` |

##### `ProductSearchComponent.onInput`

- **Firma:** `onInput(value: string): void` — [product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/product-search/product-search.component.ts#L62) (L62–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.open.set`, `this.query$.next`, `value.trim`, `this.results.set`, `this.hasSearched.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.open.set`, `this.results.set`, `this.hasSearched.set`
- **Consumidores:** `product-search.component.html` (plantilla)

##### `ProductSearchComponent.onFocus`

- **Firma:** `onFocus(): void` — [product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/product-search/product-search.component.ts#L72) (L72–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results`, `this.hasSearched`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `product-search.component.html` (plantilla)

##### `ProductSearchComponent.onBlur`

- **Firma:** `onBlur(): void` — [product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/product-search/product-search.component.ts#L78) (L78–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `setTimeout`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `product-search.component.html` (plantilla)

##### `ProductSearchComponent.select`

- **Firma:** `select(product: Product): void` — [product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/product-search/product-search.component.ts#L83) (L83–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productSelected.emit`, `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`; Emite eventos: `this.productSelected.emit`
- **Consumidores:** `product-search.component.html` (plantilla), (mismo archivo)

##### `ProductSearchComponent.onEnter`

- **Firma:** `onEnter(): void` — [product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/product-search/product-search.component.ts#L94) (L94–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results().find`, `this.results`, `this.select`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `product-search.component.html` (plantilla), (mismo archivo)

##### `ProductSearchComponent.openScanner`

- **Firma:** `openScanner(): void` — [product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/product-search/product-search.component.ts#L101) (L101–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`
- **Consumidores:** `product-search.component.html` (plantilla)

##### `ProductSearchComponent.onBarcodeScanned`

- **Firma:** `onBarcodeScanned(code: string): void` — [product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/product-search/product-search.component.ts#L105) (L105–119)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`, `this.query.set`, `this.open.set`, `this.loading.set`, `this.inventoryService.searchProducts(code).pipe`, `this.inventoryService.searchProducts`, `catchError`, `of`, `this.hasSearched.set`, `this.results.set`, `this.onEnter`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`, `this.query.set`, `this.open.set`, `this.loading.set`, `this.hasSearched.set`, `this.results.set`
- **Consumidores:** `product-search.component.html` (plantilla)

##### `ProductSearchComponent.priceFor`

- **Firma:** `priceFor(product: Product): number` — [product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/product-search/product-search.component.ts#L121) (L121–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `product-search.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-items-table-sale-items-table-component-ts"></a>

### sale-items-table.component.ts

- **Ruta:** [sale-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-items-table/sale-items-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-items-table/sale-items-table.component.ts`, 54 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-sales`
- **Responsabilidad:** Componente Angular: declara `SaleItemsTableComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts), [sales-page.component.ts (plantilla)](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts) (plantilla)
- **Plantilla:** [sale-items-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-items-table/sale-items-table.component.html) · **Usa componentes:** [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="decrement(item)"`, `(change)="onQuantityInput(item, $any($event.target).value)"`, `(click)="increment(item)"`, `(click)="removeItem.emit(item.productId)"`

#### Clase `SaleItemsTableComponent` (L7–53)

- **Decoradores:** `@Component({ selector: 'app-sale-items-table', standalone: true, imports: [IconComponent, EmptyStateComponent, DecimalInputDirective], templateUrl: './sale-items`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input items = []`, `@Input pendingProductIds = new Set()`, `@Output quantityChange = new EventEmitter<{ productId: string; quantity: nu`, `@Output removeItem = new EventEmitter<string>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `increment` | método public | 25–27 | `item: SaleItem` | `void` |
| `decrement` | método public | 29–31 | `item: SaleItem` | `void` |
| `onQuantityInput` | método public | 33–39 | `item: SaleItem`, `value: string` | `void` |
| `isPending` | método public | 41–43 | `item: SaleItem` | `boolean` |
| `setQuantity` | método private | 45–52 | `item: SaleItem`, `quantity: number` | `void` |

##### `SaleItemsTableComponent.increment`

- **Firma:** `increment(item: SaleItem): void` — [sale-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-items-table/sale-items-table.component.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.setQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sale-items-table.component.html` (plantilla)

##### `SaleItemsTableComponent.decrement`

- **Firma:** `decrement(item: SaleItem): void` — [sale-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-items-table/sale-items-table.component.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.setQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sale-items-table.component.html` (plantilla)

##### `SaleItemsTableComponent.onQuantityInput`

- **Firma:** `onQuantityInput(item: SaleItem, value: string): void` — [sale-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-items-table/sale-items-table.component.ts#L33) (L33–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseInt`, `Number.isNaN`, `this.setQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sale-items-table.component.html` (plantilla)

##### `SaleItemsTableComponent.isPending`

- **Firma:** `isPending(item: SaleItem): boolean` — [sale-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-items-table/sale-items-table.component.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.pendingProductIds.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sale-items-table.component.html` (plantilla)

##### `SaleItemsTableComponent.setQuantity`

- **Firma:** `setQuantity(item: SaleItem, quantity: number): void` — [sale-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-items-table/sale-items-table.component.ts#L45) (L45–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.max`, `this.quantityChange.emit`
- **Efectos secundarios:** Emite eventos: `this.quantityChange.emit`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-pricing-bar-sale-pricing-bar-component-ts"></a>

### sale-pricing-bar.component.ts

- **Ruta:** [sale-pricing-bar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-pricing-bar/sale-pricing-bar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-pricing-bar/sale-pricing-bar.component.ts`, 44 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-sales`
- **Responsabilidad:** "Venta por mayor" — lets the cashier pick an optional client and a price list (Público/Mayorista) for the receipt about to be built.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [client-search-select.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-client-search-select-client-search-select-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts), [sales-page.component.ts (plantilla)](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts) (plantilla)
- **Plantilla:** [sale-pricing-bar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-pricing-bar/sale-pricing-bar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [client-search-select.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts)
- **Eventos enlazados en la plantilla:** `(selectionChange)="onClientChange($event)"`, `(click)="selectPriceList('PUBLIC')"`, `(click)="selectPriceList('WHOLESALE')"`

#### Clase `SalePricingBarComponent` (L16–43)

- **Decoradores:** `@Component({ selector: 'app-sale-pricing-bar', standalone: true, imports: [IconComponent, ClientSearchSelectComponent], templateUrl: './sale-pricing-bar.componen`
- **Propósito:** "Venta por mayor" — lets the cashier pick an optional client and a price list (Público/Mayorista) for the receipt about to be built. Reuses `ClientSearchSelectComponent` (already built for Cuentas por Cobrar) rather than duplicating a client picker. Both fields are set once, before or while the cart is empty — `locked` (driven by the parent's `items().length &gt; 0`) disables the price-list toggle once that stops being true, mirroring the backend's own `PRICE_LIST_LOCKED` rule.
- **Datos / estado que administra:** `@Input clientId = null`, `@Input clientName = null`, `@Input priceList = 'PUBLIC'`, `@Input locked = false`, `@Input disabled = false`, `@Output configure = new EventEmitter<{ clientId: string \| null; priceL`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onClientChange` | método public | 33–35 | `client: Client \| null` | `void` |
| `selectPriceList` | método public | 37–42 | `priceList: PriceListType` | `void` |

##### `SalePricingBarComponent.onClientChange`

- **Firma:** `onClientChange(client: Client \| null): void` — [sale-pricing-bar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-pricing-bar/sale-pricing-bar.component.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.configure.emit`
- **Efectos secundarios:** Emite eventos: `this.configure.emit`
- **Consumidores:** `sale-pricing-bar.component.html` (plantilla)

##### `SalePricingBarComponent.selectPriceList`

- **Firma:** `selectPriceList(priceList: PriceListType): void` — [sale-pricing-bar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-pricing-bar/sale-pricing-bar.component.ts#L37) (L37–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.configure.emit`
- **Efectos secundarios:** Emite eventos: `this.configure.emit`
- **Consumidores:** `sale-pricing-bar.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-summary-sale-summary-component-ts"></a>

### sale-summary.component.ts

- **Ruta:** [sale-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-summary/sale-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-summary/sale-summary.component.ts`, 41 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-sales`
- **Responsabilidad:** Componente Angular: declara `SaleSummaryComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts), [sales-page.component.ts (plantilla)](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts) (plantilla)
- **Plantilla:** [sale-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-summary/sale-summary.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="invoiceNumberChange.emit($event)"`, `(click)="cancel.emit()"`, `(click)="save.emit()"`

#### Clase `SaleSummaryComponent` (L7–40)

- **Decoradores:** `@Component({ selector: 'app-sale-summary', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './sale-summary.component.html'`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input itemCount = 0`, `@Input total = 0`, `@Input isSaving = false`, `@Input isCancelling = false`, `@Input invoiceNumber = ''`, `@Output save = new EventEmitter<void>()`, `@Output cancel = new EventEmitter<void>()`, `@Output invoiceNumberChange = new EventEmitter<string>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isBusy` | getter public | 29–31 | — | `boolean` |
| `canSave` | getter public | 33–35 | — | `boolean` |
| `canCancel` | getter public | 37–39 | — | `boolean` |

##### `SaleSummaryComponent.isBusy`

- **Firma:** `isBusy(): boolean` — [sale-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-summary/sale-summary.component.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SaleSummaryComponent.canSave`

- **Firma:** `canSave(): boolean` — [sale-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-summary/sale-summary.component.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SaleSummaryComponent.canCancel`

- **Firma:** `canCancel(): boolean` — [sale-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/components/sale-summary/sale-summary.component.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts"></a>

### sales-page.component.ts

- **Ruta:** [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts`, 125 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-sales`
- **Responsabilidad:** All receipt state (for every open tab) lives in `SalesDraftStore`, a root-provided singleton — this component is purely a thin view over whichever draft is currently active.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [product-search.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-product-search-product-search-component-ts), [sale-items-table.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-items-table-sale-items-table-component-ts), [sale-summary.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-summary-sale-summary-component-ts), [cancel-confirm-modal.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-cancel-confirm-modal-cancel-confirm-modal-component-ts), [sale-pricing-bar.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-pricing-bar-sale-pricing-bar-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [sales-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [sale-pricing-bar.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-pricing-bar-sale-pricing-bar-component-ts), [product-search.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-product-search-product-search-component-ts), [sale-items-table.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-items-table-sale-items-table-component-ts), [sale-summary.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-summary-sale-summary-component-ts), [cancel-confirm-modal.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-cancel-confirm-modal-cancel-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="switchDraft(draftItem.draftKey)"`, `(click)="requestCloseTab(draftItem.draftKey); $event.stopPropagation()"`, `(click)="openNewDraft()"`, `(configure)="onConfigurePricing($event)"`, `(productSelected)="onProductSelected($event)"`, `(quantityChange)="onQuantityChange($event)"`, `(removeItem)="onRemoveItem($event)"`, `(save)="saveSale()"`, `(cancel)="requestCancel()"`, `(invoiceNumberChange)="draft.setInvoiceNumberDraft($event)"`, `(confirmed)="confirmCloseTab()"`, `(cancelled)="dismissCancel()"`

#### Clase `SalesPageComponent` (L21–124)

- **Decoradores:** `@Component({ selector: 'app-sales-page', standalone: true, imports: [ DatePipe, PageHeaderComponent, ProductSearchComponent, SaleItemsTableComponent, SaleSummary`
- **Propósito:** All receipt state (for every open tab) lives in `SalesDraftStore`, a root-provided singleton — this component is purely a thin view over whichever draft is currently active. The tab bar (`draft.drafts()`) is what lets a cashier build several unrelated receipts at once — see `SalesDraftStore`'s own doc comment for why closing a tab with reserved stock always goes through a real cancel call first, unlike Compras.
- **Servicios inyectados con `inject()`:** `draft = inject(SalesDraftStore)`
- **Datos / estado que administra:** `today = signal(new Date())`, `closeConfirmDraftId = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onProductSelected` | método public | 45–47 | `product: Product` | `void` |
| `onConfigurePricing` | método public | 49–51 | `event: { clientId: string \| null; priceList: PriceListType }` | `void` |
| `onQuantityChange` | método public | 53–55 | `change: { productId: string; quantity: number }` | `void` |
| `onRemoveItem` | método public | 57–59 | `productId: string` | `void` |
| `saveSale` | método public | 61–63 | — | `void` |
| `draftLabel` | método public | 67–73 | `draftItem: SaleDraftState` | `string` |
| `draftHasItems` | método public | 75–77 | `draftItem: SaleDraftState` | `boolean` |
| `switchDraft` | método public | 79–81 | `draftKey: string` | `void` |
| `openNewDraft` | método public | 83–85 | — | `void` |
| `requestCloseTab` | método public | 95–106 | `draftKey: string` | `void` |
| `requestCancel` | método public | 109–111 | — | `void` |
| `confirmCloseTab` | método public | 113–119 | — | `void` |
| `dismissCancel` | método public | 121–123 | — | `void` |

##### `SalesPageComponent.onProductSelected`

- **Firma:** `onProductSelected(product: Product): void` — [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.onProductSelected`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-page.component.html` (plantilla)

##### `SalesPageComponent.onConfigurePricing`

- **Firma:** `onConfigurePricing(event: { clientId: string \| null; priceList: PriceListType }): void` — [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.configurePricing`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-page.component.html` (plantilla)

##### `SalesPageComponent.onQuantityChange`

- **Firma:** `onQuantityChange(change: { productId: string; quantity: number }): void` — [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.onQuantityChange`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-page.component.html` (plantilla)

##### `SalesPageComponent.onRemoveItem`

- **Firma:** `onRemoveItem(productId: string): void` — [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.onRemoveItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-page.component.html` (plantilla)

##### `SalesPageComponent.saveSale`

- **Firma:** `saveSale(): void` — [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.confirmSale`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-page.component.html` (plantilla)

##### `SalesPageComponent.draftLabel`

- **Firma:** `draftLabel(draftItem: SaleDraftState): string` — [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts#L67) (L67–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.drafts().findIndex`, `this.draft.drafts`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-page.component.html` (plantilla)

##### `SalesPageComponent.draftHasItems`

- **Firma:** `draftHasItems(draftItem: SaleDraftState): boolean` — [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-page.component.html` (plantilla)

##### `SalesPageComponent.switchDraft`

- **Firma:** `switchDraft(draftKey: string): void` — [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setActiveDraft`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-page.component.html` (plantilla)

##### `SalesPageComponent.openNewDraft`

- **Firma:** `openNewDraft(): void` — [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.openNewDraft`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-page.component.html` (plantilla)

##### `SalesPageComponent.requestCloseTab`

- **Firma:** `requestCloseTab(draftKey: string): void` — [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts#L95) (L95–106)
- **Propósito / descripción:** A tab with no server-side row yet closes immediately (nothing to lose). A tab whose receipt is empty but already has a server row closes via a silent cancel (cleans up that empty `OPEN` row, nothing to confirm — the user never sees a data-loss prompt for zero items). A tab with real items requires confirmation before the cancel call, since it both discards the line items and restores real reserved stock.
- **Dependencias (llamadas en su cuerpo):** `this.draft.drafts().find`, `this.draft.drafts`, `this.draft.closeDraftWithoutServerRow`, `this.draft.cancelDraft`, `this.closeConfirmDraftId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.closeConfirmDraftId.set`
- **Consumidores:** `sales-page.component.html` (plantilla), (mismo archivo)

##### `SalesPageComponent.requestCancel`

- **Firma:** `requestCancel(): void` — [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts#L109) (L109–111)
- **Propósito / descripción:** "Cancelar" in the summary panel — always targets whichever tab is currently active.
- **Dependencias (llamadas en su cuerpo):** `this.requestCloseTab`, `this.draft.activeDraftId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-page.component.html` (plantilla)

##### `SalesPageComponent.confirmCloseTab`

- **Firma:** `confirmCloseTab(): void` — [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts#L113) (L113–119)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closeConfirmDraftId`, `this.closeConfirmDraftId.set`, `this.draft.cancelDraft`
- **Efectos secundarios:** Actualiza estado (signals): `this.closeConfirmDraftId.set`
- **Consumidores:** `sales-page.component.html` (plantilla)

##### `SalesPageComponent.dismissCancel`

- **Firma:** `dismissCancel(): void` — [sales-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales/sales-page.component.ts#L121) (L121–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closeConfirmDraftId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.closeConfirmDraftId.set`
- **Consumidores:** `sales-page.component.html` (plantilla)

