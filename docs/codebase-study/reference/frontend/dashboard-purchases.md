# Frontend `dashboard-purchases`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [cancel-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-cancel-confirm-modal-cancel-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CancelConfirmModalComponent` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [purchase-items-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-items-table-purchase-items-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `PurchaseItemsTableComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [purchase-product-search.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-product-search-purchase-product-search-component-ts) | .ts | Componente Angular | Feature (pantalla) | Purchases' own product picker — structurally the same live-search pattern as Ventas' `ProductSearchComponent` (same debounce/search mechanics, reuses `InventoryService.searchProducts()`), but the dropdown shows cost price alongside public price and stock, since a purchase invoice needs both current prices pre-filled. | 3 internas; ext.: @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [purchase-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-summary-purchase-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `PurchaseSummaryComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [save-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-save-confirm-modal-save-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `SaveConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [purchases-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | All invoice state (supplier/date/items/total, for every open tab) lives in `PurchaseDraftStore`, a root-provided singleton persisted to `sessionStorage` — this component is purely a thin view over whichever draft is currently active. | 13 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [cancel-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/cancel-confirm-modal/cancel-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cancel-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [cancel-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/cancel-confirm-modal/cancel-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [purchase-items-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `purchase-items-table.component.ts`; usa 3 componentes hijos: `app-empty-state`, `app-icon`, `app-presentation-form-modal`. | — | — | Media |
| [purchase-items-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [purchase-product-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-product-search/purchase-product-search.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `purchase-product-search.component.ts`; usa 2 componentes hijos: `app-icon`, `app-barcode-scanner-modal`. | — | — | Media |
| [purchase-product-search.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-product-search/purchase-product-search.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [purchase-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-summary/purchase-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `purchase-summary.component.ts`; usa 1 componentes hijos: `app-button`. | — | — | Media |
| [purchase-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-summary/purchase-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [save-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/save-confirm-modal/save-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `save-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [save-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/save-confirm-modal/save-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [purchases-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `purchases-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-purchase-product-search`, `app-purchase-items-table`, `app-purchase-summary`, `app-purchase-cancel-confirm-modal`, `app-purchase-save-confirm-modal`. | — | — | Media |
| [purchases-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-cancel-confirm-modal-cancel-confirm-modal-component-ts"></a>

### cancel-confirm-modal.component.ts

- **Ruta:** [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/cancel-confirm-modal/cancel-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/purchases/components/cancel-confirm-modal/cancel-confirm-modal.component.ts`, 19 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-purchases`
- **Responsabilidad:** Componente Angular: declara `CancelConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts), [purchases-page.component.ts (plantilla)](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts) (plantilla)
- **Plantilla:** [cancel-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/cancel-confirm-modal/cancel-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `CancelConfirmModalComponent` (L5–18)

- **Decoradores:** `@Component({ selector: 'app-purchase-cancel-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './cancel-confirm-modal.com`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-items-table-purchase-items-table-component-ts"></a>

### purchase-items-table.component.ts

- **Ruta:** [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts`, 161 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-purchases`
- **Responsabilidad:** Componente Angular: declara `PurchaseItemsTableComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [inventory-locations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-locations-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [presentation-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-presentation-form-modal-presentation-form-modal-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts), [purchases-page.component.ts (plantilla)](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts) (plantilla)
- **Plantilla:** [purchase-items-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.html) · **Usa componentes:** [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [presentation-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-presentation-form-modal-presentation-form-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="decrement(item)"`, `(change)="onQuantityInput(item, $any($event.target).value)"`, `(click)="increment(item)"`, `(change)="onPresentationInput(item, $any($event.target).value)"`, `(click)="openPresentationModal(item.productId)"`, `(change)="onCostPriceInput(item, $any($event.target).value)"`, `(change)="onPublicPriceInput(item, $any($event.target).value)"`, `(click)="removeItem.emit(item.productId)"`, `(closed)="closePresentationModal()"`, `(saved)="onPresentationCreated($event)"`

#### Clase `PurchaseItemsTableComponent` (L9–160)

- **Decoradores:** `@Component({ selector: 'app-purchase-items-table', standalone: true, imports: [IconComponent, EmptyStateComponent, DecimalInputDirective, PresentationFormModalCo`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `inventoryLocationsService = inject(InventoryLocationsService)`
- **Datos / estado que administra:** `presentationsCache = signal<Map<string, ProductPresentation[]>>(new Map`, `presentationModalProductId = signal<string \| null>(null)`, `@Output quantityChange = new EventEmitter<{ productId: string; quantity: nu`, `@Output costPriceChange = new EventEmitter<{ productId: string; costPrice: n`, `@Output publicPriceChange = new EventEmitter<{ productId: string; publicPrice:`, `@Output presentationChange = new EventEmitter<{ productId: string; presentation`, `@Output removeItem = new EventEmitter<string>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `items` | setter public | 29–35 | `value: PurchaseDraftItem[]` | (inferido) |
| `items` | getter public | 36–38 | — | `PurchaseDraftItem[]` |
| `ensurePresentationsLoaded` | método private | 49–69 | `productId: string` | `void` |
| `presentationsFor` | método public | 71–73 | `productId: string` | `ProductPresentation[]` |
| `factorFor` | método public | 84–89 | `item: PurchaseDraftItem` | `number` |
| `presentationLabelFor` | método public | 91–93 | `item: PurchaseDraftItem` | `string` |
| `equivalentBaseUnits` | método public | 96–98 | `item: PurchaseDraftItem` | `number` |
| `onPresentationInput` | método public | 100–103 | `item: PurchaseDraftItem`, `presentationId: string` | `void` |
| `openPresentationModal` | método public | 105–107 | `productId: string` | `void` |
| `closePresentationModal` | método public | 109–111 | — | `void` |
| `onPresentationCreated` | método public | 114–127 | `presentation: ProductPresentation` | `void` |
| `increment` | método public | 129–131 | `item: PurchaseDraftItem` | `void` |
| `decrement` | método public | 133–135 | `item: PurchaseDraftItem` | `void` |
| `onQuantityInput` | método public | 137–143 | `item: PurchaseDraftItem`, `value: string` | `void` |
| `onCostPriceInput` | método public | 145–151 | `item: PurchaseDraftItem`, `value: string` | `void` |
| `onPublicPriceInput` | método public | 153–159 | `item: PurchaseDraftItem`, `value: string` | `void` |

##### `PurchaseItemsTableComponent.items`

- **Firma:** `items(value: PurchaseDraftItem[])` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L29) (L29–35)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.ensurePresentationsLoaded`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts), [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseItemsTableComponent.items`

- **Firma:** `items(): PurchaseDraftItem[]` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts), [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseItemsTableComponent.ensurePresentationsLoaded`

- **Firma:** `ensurePresentationsLoaded(productId: string): void` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L49) (L49–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.requestedProductIds.has`, `this.requestedProductIds.add`, `this.inventoryLocationsService.getPresentations(productId).subscribe`, `this.inventoryLocationsService.getPresentations`, `presentations.filter`, `this.presentationsCache.update`, `new Map`, `next.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.presentationsCache.update`
- **Consumidores:** (mismo archivo)

##### `PurchaseItemsTableComponent.presentationsFor`

- **Firma:** `presentationsFor(productId: string): ProductPresentation[]` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.presentationsCache().get`, `this.presentationsCache`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchase-items-table.component.html` (plantilla), (mismo archivo)

##### `PurchaseItemsTableComponent.factorFor`

- **Firma:** `factorFor(item: PurchaseDraftItem): number` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L84) (L84–89)
- **Propósito / descripción:** The conversion factor actually in effect for this line — mirrors `confirm_purchase`'s own `ensure_product_presentation` resolution exactly: an explicit `presentationId` resolves to that presentation's factor, `undefined` (never touched the dropdown) resolves to "Unidad", factor 1. This is display-only — it never feeds back into `quantity` or any submitted value, it only lets the row show the same equivalence the backend is about to compute.
- **Dependencias (llamadas en su cuerpo):** `this.presentationsFor(item.productId).find`, `this.presentationsFor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchase-items-table.component.html` (plantilla), (mismo archivo)

##### `PurchaseItemsTableComponent.presentationLabelFor`

- **Firma:** `presentationLabelFor(item: PurchaseDraftItem): string` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L91) (L91–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchase-items-table.component.html` (plantilla)

##### `PurchaseItemsTableComponent.equivalentBaseUnits`

- **Firma:** `equivalentBaseUnits(item: PurchaseDraftItem): number` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L96) (L96–98)
- **Propósito / descripción:** `quantity` (in the selected presentation) × its factor — the exact `quantity_base_units` Bodega will receive. Never itself sent to the backend; the backend always recomputes this from `presentationId`/`quantity` directly.
- **Dependencias (llamadas en su cuerpo):** `this.factorFor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchase-items-table.component.html` (plantilla)

##### `PurchaseItemsTableComponent.onPresentationInput`

- **Firma:** `onPresentationInput(item: PurchaseDraftItem, presentationId: string): void` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L100) (L100–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.presentationsFor(item.productId).find`, `this.presentationsFor`, `this.presentationChange.emit`
- **Efectos secundarios:** Emite eventos: `this.presentationChange.emit`
- **Consumidores:** `purchase-items-table.component.html` (plantilla)

##### `PurchaseItemsTableComponent.openPresentationModal`

- **Firma:** `openPresentationModal(productId: string): void` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L105) (L105–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.presentationModalProductId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.presentationModalProductId.set`
- **Consumidores:** `purchase-items-table.component.html` (plantilla)

##### `PurchaseItemsTableComponent.closePresentationModal`

- **Firma:** `closePresentationModal(): void` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L109) (L109–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.presentationModalProductId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.presentationModalProductId.set`
- **Consumidores:** `purchase-items-table.component.html` (plantilla)

##### `PurchaseItemsTableComponent.onPresentationCreated`

- **Firma:** `onPresentationCreated(presentation: ProductPresentation): void` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L114) (L114–127)
- **Propósito / descripción:** New presentation created from this row's "+ Nueva unidad de medida" — added to the cache and auto-selected for that line, same as picking an existing one from the dropdown.
- **Dependencias (llamadas en su cuerpo):** `this.presentationModalProductId`, `this.presentationModalProductId.set`, `this.presentationsCache.update`, `new Map`, `next.set`, `next.get`, `this.presentationChange.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.presentationModalProductId.set`, `this.presentationsCache.update`; Emite eventos: `this.presentationChange.emit`
- **Consumidores:** `purchase-items-table.component.html` (plantilla)

##### `PurchaseItemsTableComponent.increment`

- **Firma:** `increment(item: PurchaseDraftItem): void` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L129) (L129–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quantityChange.emit`
- **Efectos secundarios:** Emite eventos: `this.quantityChange.emit`
- **Consumidores:** `purchase-items-table.component.html` (plantilla)

##### `PurchaseItemsTableComponent.decrement`

- **Firma:** `decrement(item: PurchaseDraftItem): void` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L133) (L133–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quantityChange.emit`, `Math.max`
- **Efectos secundarios:** Emite eventos: `this.quantityChange.emit`
- **Consumidores:** `purchase-items-table.component.html` (plantilla)

##### `PurchaseItemsTableComponent.onQuantityInput`

- **Firma:** `onQuantityInput(item: PurchaseDraftItem, value: string): void` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L137) (L137–143)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseInt`, `Number.isNaN`, `this.quantityChange.emit`, `Math.max`
- **Efectos secundarios:** Emite eventos: `this.quantityChange.emit`
- **Consumidores:** `purchase-items-table.component.html` (plantilla)

##### `PurchaseItemsTableComponent.onCostPriceInput`

- **Firma:** `onCostPriceInput(item: PurchaseDraftItem, value: string): void` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L145) (L145–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseFloat`, `Number.isNaN`, `this.costPriceChange.emit`, `Math.max`
- **Efectos secundarios:** Emite eventos: `this.costPriceChange.emit`
- **Consumidores:** `purchase-items-table.component.html` (plantilla)

##### `PurchaseItemsTableComponent.onPublicPriceInput`

- **Firma:** `onPublicPriceInput(item: PurchaseDraftItem, value: string): void` — [purchase-items-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-items-table/purchase-items-table.component.ts#L153) (L153–159)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseFloat`, `Number.isNaN`, `this.publicPriceChange.emit`, `Math.max`
- **Efectos secundarios:** Emite eventos: `this.publicPriceChange.emit`
- **Consumidores:** `purchase-items-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-product-search-purchase-product-search-component-ts"></a>

### purchase-product-search.component.ts

- **Ruta:** [purchase-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-product-search/purchase-product-search.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-product-search/purchase-product-search.component.ts`, 126 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-purchases`
- **Responsabilidad:** Purchases' own product picker — structurally the same live-search pattern as Ventas' `ProductSearchComponent` (same debounce/search mechanics, reuses `InventoryService.searchProducts()`), but the dropdown shows cost price alongside public price and stock, since a purchase invoice needs both current prices pre-filled.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [inventory.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts), [purchases-page.component.ts (plantilla)](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts) (plantilla)
- **Plantilla:** [purchase-product-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-product-search/purchase-product-search.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [barcode-scanner-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="onInput($event)"`, `(focus)="onFocus()"`, `(blur)="onBlur()"`, `(keydown.enter)="onEnter()"`, `(click)="openScanner()"`, `(scanned)="onBarcodeScanned($event)"`, `(closed)="scannerOpen.set(false)"`, `(click)="select(product)"`

#### Clase `PurchaseProductSearchComponent` (L20–125)

- **Decoradores:** `@Component({ selector: 'app-purchase-product-search', standalone: true, imports: [FormsModule, IconComponent, BarcodeScannerModalComponent], templateUrl: './purc`
- **Propósito:** Purchases' own product picker — structurally the same live-search pattern as Ventas' `ProductSearchComponent` (same debounce/search mechanics, reuses `InventoryService.searchProducts()`), but the dropdown shows cost price alongside public price and stock, since a purchase invoice needs both current prices pre-filled. Kept as a separate component rather than importing Ventas' version, matching how every other near-identical component pair in this app (summary/toolbar/table/modal across Categories, Businesses, Suppliers...) is its own feature-local copy, not a shared one.
- **Servicios inyectados con `inject()`:** `inventoryService = inject(InventoryService)`
- **Datos / estado que administra:** `@Output productSelected = new EventEmitter<Product>()`, `query = signal('')`, `results = signal<Product[]>([])`, `loading = signal(false)`, `open = signal(false)`, `hasSearched = signal(false)`, `scannerOpen = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onInput` | método public | 70–78 | `value: string` | `void` |
| `onFocus` | método public | 80–84 | — | `void` |
| `onBlur` | método public | 86–89 | — | `void` |
| `select` | método public | 91–97 | `product: Product` | `void` |
| `onEnter` | método public | 99–104 | — | `void` |
| `openScanner` | método public | 106–108 | — | `void` |
| `onBarcodeScanned` | método public | 110–124 | `code: string` | `void` |

##### `PurchaseProductSearchComponent.onInput`

- **Firma:** `onInput(value: string): void` — [purchase-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-product-search/purchase-product-search.component.ts#L70) (L70–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.open.set`, `this.query$.next`, `value.trim`, `this.results.set`, `this.hasSearched.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.open.set`, `this.results.set`, `this.hasSearched.set`
- **Consumidores:** `purchase-product-search.component.html` (plantilla)

##### `PurchaseProductSearchComponent.onFocus`

- **Firma:** `onFocus(): void` — [purchase-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-product-search/purchase-product-search.component.ts#L80) (L80–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results`, `this.hasSearched`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `purchase-product-search.component.html` (plantilla)

##### `PurchaseProductSearchComponent.onBlur`

- **Firma:** `onBlur(): void` — [purchase-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-product-search/purchase-product-search.component.ts#L86) (L86–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `setTimeout`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `purchase-product-search.component.html` (plantilla)

##### `PurchaseProductSearchComponent.select`

- **Firma:** `select(product: Product): void` — [purchase-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-product-search/purchase-product-search.component.ts#L91) (L91–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productSelected.emit`, `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`; Emite eventos: `this.productSelected.emit`
- **Consumidores:** `purchase-product-search.component.html` (plantilla), (mismo archivo)

##### `PurchaseProductSearchComponent.onEnter`

- **Firma:** `onEnter(): void` — [purchase-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-product-search/purchase-product-search.component.ts#L99) (L99–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results`, `this.select`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchase-product-search.component.html` (plantilla), (mismo archivo)

##### `PurchaseProductSearchComponent.openScanner`

- **Firma:** `openScanner(): void` — [purchase-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-product-search/purchase-product-search.component.ts#L106) (L106–108)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`
- **Consumidores:** `purchase-product-search.component.html` (plantilla)

##### `PurchaseProductSearchComponent.onBarcodeScanned`

- **Firma:** `onBarcodeScanned(code: string): void` — [purchase-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-product-search/purchase-product-search.component.ts#L110) (L110–124)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`, `this.query.set`, `this.open.set`, `this.loading.set`, `this.inventoryService.searchProducts(code).pipe`, `this.inventoryService.searchProducts`, `catchError`, `of`, `this.hasSearched.set`, `this.results.set`, `this.onEnter`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`, `this.query.set`, `this.open.set`, `this.loading.set`, `this.hasSearched.set`, `this.results.set`
- **Consumidores:** `purchase-product-search.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-summary-purchase-summary-component-ts"></a>

### purchase-summary.component.ts

- **Ruta:** [purchase-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-summary/purchase-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-summary/purchase-summary.component.ts`, 34 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-purchases`
- **Responsabilidad:** Componente Angular: declara `PurchaseSummaryComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts), [purchases-page.component.ts (plantilla)](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts) (plantilla)
- **Plantilla:** [purchase-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-summary/purchase-summary.component.html) · **Usa componentes:** [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="cancel.emit()"`, `(click)="save.emit()"`

#### Clase `PurchaseSummaryComponent` (L6–33)

- **Decoradores:** `@Component({ selector: 'app-purchase-summary', standalone: true, imports: [ButtonComponent], templateUrl: './purchase-summary.component.html', styleUrl: './purch`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input itemCount = 0`, `@Input total = 0`, `@Input isSaving = false`, `@Input supplierSelected = false`, `@Output cancel = new EventEmitter<void>()`, `@Output save = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `canCancel` | getter public | 26–28 | — | `boolean` |
| `canSave` | getter public | 30–32 | — | `boolean` |

##### `PurchaseSummaryComponent.canCancel`

- **Firma:** `canCancel(): boolean` — [purchase-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-summary/purchase-summary.component.ts#L26) (L26–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseSummaryComponent.canSave`

- **Firma:** `canSave(): boolean` — [purchase-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/purchase-summary/purchase-summary.component.ts#L30) (L30–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-save-confirm-modal-save-confirm-modal-component-ts"></a>

### save-confirm-modal.component.ts

- **Ruta:** [save-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/save-confirm-modal/save-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/purchases/components/save-confirm-modal/save-confirm-modal.component.ts`, 28 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-purchases`
- **Responsabilidad:** Componente Angular: declara `SaveConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts), [purchases-page.component.ts (plantilla)](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts) (plantilla)
- **Plantilla:** [save-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/components/save-confirm-modal/save-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `SaveConfirmModalComponent` (L7–27)

- **Decoradores:** `@Component({ selector: 'app-purchase-save-confirm-modal', standalone: true, imports: [DatePipe, ButtonComponent, IconComponent], templateUrl: './save-confirm-mod`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input supplierName = ''`, `@Input purchaseDate = null`, `@Input itemCount = 0`, `@Input total = 0`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts"></a>

### purchases-page.component.ts

- **Ruta:** [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts`, 232 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-purchases`
- **Responsabilidad:** All invoice state (supplier/date/items/total, for every open tab) lives in `PurchaseDraftStore`, a root-provided singleton persisted to `sessionStorage` — this component is purely a thin view over whichever draft is currently active.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [pdf-prompt-modal.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-pdf-prompt-modal-service-ts), [purchase-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-purchase-draft-store-ts), [purchases.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-purchases-service-ts), [supplier.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-supplier-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [purchase-product-search.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-product-search-purchase-product-search-component-ts), [purchase-items-table.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-items-table-purchase-items-table-component-ts), [purchase-summary.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-summary-purchase-summary-component-ts), [cancel-confirm-modal.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-cancel-confirm-modal-cancel-confirm-modal-component-ts), [save-confirm-modal.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-save-confirm-modal-save-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [purchases-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [purchase-product-search.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-product-search-purchase-product-search-component-ts), [purchase-items-table.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-items-table-purchase-items-table-component-ts), [purchase-summary.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-summary-purchase-summary-component-ts), [cancel-confirm-modal.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-cancel-confirm-modal-cancel-confirm-modal-component-ts), [save-confirm-modal.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-save-confirm-modal-save-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="switchDraft(draftItem.id)"`, `(click)="requestCloseTab(draftItem.id); $event.stopPropagation()"`, `(click)="openNewDraft()"`, `(ngModelChange)="onSupplierChange($event)"`, `(ngModelChange)="onDateChange($event)"`, `(ngModelChange)="draft.setInvoiceNumber($event)"`, `(ngModelChange)="onPaymentTypeChange($event)"`, `(ngModelChange)="onPaymentDueDateChange($event)"`, `(productSelected)="onProductSelected($event)"`, `(quantityChange)="onQuantityChange($event)"`, `(costPriceChange)="onCostPriceChange($event)"`, `(publicPriceChange)="onPublicPriceChange($event)"`, `(presentationChange)="onPresentationChange($event)"`, `(removeItem)="onRemoveItem($event)"`, `(cancel)="requestCancel()"`

#### Clase `PurchasesPageComponent` (L29–231)

- **Decoradores:** `@Component({ selector: 'app-purchases-page', standalone: true, imports: [ FormsModule, PageHeaderComponent, PurchaseProductSearchComponent, PurchaseItemsTableCom`
- **Propósito:** All invoice state (supplier/date/items/total, for every open tab) lives in `PurchaseDraftStore`, a root-provided singleton persisted to `sessionStorage` — this component is purely a thin view over whichever draft is currently active. That's what makes navigating away (e.g. to Inventario) and back lose nothing, and what makes an accidental reload lose nothing either. The tab bar (`draft.drafts()`) is what lets a cashier work on several unrelated invoices at once — see `PurchaseDraftStore`'s own doc comment for why this is Compras-only and not also on Ventas.
- **Servicios inyectados con `inject()`:** `purchasesService = inject(PurchasesService)`, `supplierService = inject(SupplierService)`, `notificationService = inject(NotificationService)`, `pdfPromptModalService = inject(PdfPromptModalService)`, `draft = inject(PurchaseDraftStore)`
- **Datos / estado que administra:** `suppliers = signal<Supplier[]>([])`, `isSaving = signal(false)`, `closeConfirmDraftId = signal<string \| null>(null)`, `isSaveConfirmOpen = signal(false)`, `selectedSupplierName = computed(() => { const supplier = this.suppliers()`, `purchaseDateAsDate = computed(() => new Date('${this.draft.purchaseDate`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onSupplierChange` | método public | 75–77 | `supplierId: string` | `void` |
| `onDateChange` | método public | 79–81 | `date: string` | `void` |
| `onPaymentTypeChange` | método public | 83–85 | `paymentType: PurchasePaymentType` | `void` |
| `onPaymentDueDateChange` | método public | 87–89 | `date: string` | `void` |
| `onProductSelected` | método public | 91–93 | `product: Product` | `void` |
| `onQuantityChange` | método public | 95–97 | `change: { productId: string; quantity: number }` | `void` |
| `onCostPriceChange` | método public | 99–101 | `change: { productId: string; costPrice: number }` | `void` |
| `onPublicPriceChange` | método public | 103–105 | `change: { productId: string; publicPrice: number }` | `void` |
| `onPresentationChange` | método public | 107–109 | `change: { productId: string; presentation: ProductPresentation \| null }` | `void` |
| `onRemoveItem` | método public | 111–113 | `productId: string` | `void` |
| `draftLabel` | método public | 118–125 | `draftItem: PurchaseDraft` | `string` |
| `draftHasItems` | método public | 127–129 | `draftItem: PurchaseDraft` | `boolean` |
| `switchDraft` | método public | 131–133 | `id: string` | `void` |
| `openNewDraft` | método public | 135–137 | — | `void` |
| `requestCloseTab` | método public | 140–147 | `id: string` | `void` |
| `requestCancel` | método public | 150–152 | — | `void` |
| `confirmCloseTab` | método public | 154–160 | — | `void` |
| `dismissCancel` | método public | 162–164 | — | `void` |
| `requestSave` | método public | 166–175 | — | `void` |
| `dismissSaveConfirm` | método public | 177–182 | — | `void` |
| `confirmSave` | método public | 184–230 | — | `void` |

##### `PurchasesPageComponent.onSupplierChange`

- **Firma:** `onSupplierChange(supplierId: string): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setSupplier`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.onDateChange`

- **Firma:** `onDateChange(date: string): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setPurchaseDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.onPaymentTypeChange`

- **Firma:** `onPaymentTypeChange(paymentType: PurchasePaymentType): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setPaymentType`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.onPaymentDueDateChange`

- **Firma:** `onPaymentDueDateChange(date: string): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L87) (L87–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setPaymentDueDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.onProductSelected`

- **Firma:** `onProductSelected(product: Product): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L91) (L91–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.onProductSelected`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.onQuantityChange`

- **Firma:** `onQuantityChange(change: { productId: string; quantity: number }): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.updateQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.onCostPriceChange`

- **Firma:** `onCostPriceChange(change: { productId: string; costPrice: number }): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L99) (L99–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.updateCostPrice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.onPublicPriceChange`

- **Firma:** `onPublicPriceChange(change: { productId: string; publicPrice: number }): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L103) (L103–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.updatePublicPrice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.onPresentationChange`

- **Firma:** `onPresentationChange(change: { productId: string; presentation: ProductPresentation \| null }): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L107) (L107–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.updatePresentation`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.onRemoveItem`

- **Firma:** `onRemoveItem(productId: string): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L111) (L111–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.removeItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.draftLabel`

- **Firma:** `draftLabel(draftItem: PurchaseDraft): string` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L118) (L118–125)
- **Propósito / descripción:** Supplier name if chosen, else a stable positional label — never blank, so an empty new tab is still identifiable in the bar.
- **Dependencias (llamadas en su cuerpo):** `this.suppliers().find`, `this.suppliers`, `this.draft.drafts().findIndex`, `this.draft.drafts`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.draftHasItems`

- **Firma:** `draftHasItems(draftItem: PurchaseDraft): boolean` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L127) (L127–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.switchDraft`

- **Firma:** `switchDraft(id: string): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L131) (L131–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setActiveDraft`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.openNewDraft`

- **Firma:** `openNewDraft(): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L135) (L135–137)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.openNewDraft`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.requestCloseTab`

- **Firma:** `requestCloseTab(id: string): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L140) (L140–147)
- **Propósito / descripción:** Explicit "×" on a tab — targets that specific draft, whether or not it's the active one.
- **Dependencias (llamadas en su cuerpo):** `this.draft.drafts().find`, `this.draft.drafts`, `this.draft.closeDraft`, `this.closeConfirmDraftId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.closeConfirmDraftId.set`
- **Consumidores:** `purchases-page.component.html` (plantilla), (mismo archivo)

##### `PurchasesPageComponent.requestCancel`

- **Firma:** `requestCancel(): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L150) (L150–152)
- **Propósito / descripción:** "Cancelar" in the summary panel — always targets whichever tab is currently active.
- **Dependencias (llamadas en su cuerpo):** `this.requestCloseTab`, `this.draft.activeDraftId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.confirmCloseTab`

- **Firma:** `confirmCloseTab(): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L154) (L154–160)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closeConfirmDraftId`, `this.closeConfirmDraftId.set`, `this.draft.closeDraft`
- **Efectos secundarios:** Actualiza estado (signals): `this.closeConfirmDraftId.set`
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.dismissCancel`

- **Firma:** `dismissCancel(): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L162) (L162–164)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closeConfirmDraftId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.closeConfirmDraftId.set`
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.requestSave`

- **Firma:** `requestSave(): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L166) (L166–175)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.supplierId`, `this.draft.items`, `this.isSaving`, `this.draft.paymentType`, `this.draft.paymentDueDate`, `this.notificationService.error`, `this.isSaveConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaveConfirmOpen.set`
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.dismissSaveConfirm`

- **Firma:** `dismissSaveConfirm(): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L177) (L177–182)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.isSaveConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaveConfirmOpen.set`
- **Consumidores:** `purchases-page.component.html` (plantilla)

##### `PurchasesPageComponent.confirmSave`

- **Firma:** `confirmSave(): void` — [purchases-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases/purchases-page.component.ts#L184) (L184–230)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.draft.activeDraftId`, `this.isSaving.set`, `this.purchasesService.createPurchase`, `this.draft.supplierId`, `new Date('${this.draft.purchaseDate()}T00:00:00').toISOString`, `new Date`, `this.draft.purchaseDate`, `this.draft.items().map`, `this.draft.items`, `this.draft.paymentType`, `this.draft.paymentDueDate`, `this.draft.invoiceNumber().trim`, `this.draft.invoiceNumber`, `this.isSaveConfirmOpen.set`, `this.draft.closeDraft`, `this.notificationService.success`, `this.pdfPromptModalService.prompt`…
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.isSaveConfirmOpen.set`
- **Consumidores:** `purchases-page.component.html` (plantilla)

