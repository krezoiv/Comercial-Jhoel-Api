# Frontend `dashboard-quotations`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [create-quotation-tab.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts) | .ts | Componente Angular | Feature (pantalla) | A Cotización is explicitly NOT a sale — the cart here is pure local component state (never a server-side draft/reservation), since a cotización never reserves or affects inventory. | 9 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [quotation-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-detail-modal-quotation-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Read-only line-item detail for one cotización — reached from Historial's "Ver detalle" action. | 3 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [quotation-history-tab.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `QuotationHistoryTabComponent`, `StatusFilter`, `PAGE_LIMIT`, `DEFAULT_FILTERS` (sin comentario de documentación en el código). | 10 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [quotation-product-search.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts) | .ts | Componente Angular | Feature (pantalla) | Own small copy of Tickets' `TicketProductSearchComponent` (itself a copy of Ventas' own) — this app's established convention is a per-feature copy over a shared one. | 3 internas; ext.: @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [quotation-void-reason-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-void-reason-modal-quotation-void-reason-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Small, dedicated reason-collection modal — `ConfirmDialogService` only supports a fixed title/message, no free-text input, so anular (which needs a mandatory reason, same as the backend's `VoidQuotationRequestDto`) can't reuse it. | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [quotations-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | `Cotizaciones` — a document that is explicitly NOT a sale: it never decrements/reserves inventory, never appears in Ventas' reports or the dashboard, and needs no confirmation before generating its PDF (unlike Ventas/Compras' own post-save PDF prompt). | 3 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [create-quotation-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `create-quotation-tab.component.ts`; usa 5 componentes hijos: `app-client-search-select`, `app-quotation-product-search`, `app-empty-state`, `app-icon`, `app-button`. | — | — | Media |
| [create-quotation-tab.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [quotation-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `quotation-detail-modal.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [quotation-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [quotation-history-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `quotation-history-tab.component.ts`; usa 7 componentes hijos: `app-icon`, `app-button`, `app-empty-state`, `app-badge`, `app-report-pagination`, `app-quotation-detail-modal`. | — | — | Media |
| [quotation-history-tab.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [quotation-product-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `quotation-product-search.component.ts`; usa 2 componentes hijos: `app-icon`, `app-barcode-scanner-modal`. | — | — | Media |
| [quotation-product-search.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [quotation-void-reason-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `quotation-void-reason-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [quotation-void-reason-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [quotations-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/quotations-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `quotations-page.component.ts`; usa 3 componentes hijos: `app-page-header`, `app-create-quotation-tab`, `app-quotation-history-tab`. | — | — | Media |
| [quotations-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/quotations-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts"></a>

### create-quotation-tab.component.ts

- **Ruta:** [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts`, 215 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-quotations`
- **Responsabilidad:** A Cotización is explicitly NOT a sale — the cart here is pure local component state (never a server-side draft/reservation), since a cotización never reserves or affects inventory.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [quotations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-quotations-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [client-search-select.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-client-search-select-client-search-select-component-ts), [quotation-product-search.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [quotations-page.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-page-component-ts), [quotations-page.component.ts (plantilla)](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-page-component-ts) (plantilla)
- **Plantilla:** [create-quotation-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.html) · **Usa componentes:** [client-search-select.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts), [quotation-product-search.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(selectionChange)="onClientSelectionChange($event)"`, `(ngModelChange)="onExpirationDateChange($event)"`, `(productSelected)="onProductSelected($event)"`, `(click)="decrement(item)"`, `(click)="increment(item)"`, `(ngModelChange)="updateDiscount(item.productId, $event)"`, `(click)="removeItem(item.productId)"`, `(ngModelChange)="observations.set($event)"`, `(ngModelChange)="commercialTerms.set($event)"`, `(click)="saveQuotation()"`

#### Clase `CreateQuotationTabComponent` (L41–214)

- **Decoradores:** `@Component({ selector: 'app-create-quotation-tab', standalone: true, imports: [ FormsModule, QuotationProductSearchComponent, ClientSearchSelectComponent, EmptyS`
- **Propósito:** A Cotización is explicitly NOT a sale — the cart here is pure local component state (never a server-side draft/reservation), since a cotización never reserves or affects inventory. Nothing is sent to the backend until "Guardar Cotización". Unlike Ticket's cart, each line carries an editable discount, and the running totals show three lines (Subtotal/Descuento/Total) computed with the exact same math `create_quotation()` uses server-side.
- **Servicios inyectados con `inject()`:** `quotationsService = inject(QuotationsService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `items = signal<QuotationDraftItem[]>([])`, `selectedClientId = signal<string \| null>(null)`, `selectedClientName = signal<string \| null>(null)`, `expirationDate = signal(todayIsoDate())`, `observations = signal('')`, `commercialTerms = signal('')`, `isSaving = signal(false)`, `clientError = signal(false)`, `dateError = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `subtotal` | getter public | 76–78 | — | `number` |
| `discountTotal` | getter public | 80–82 | — | `number` |
| `total` | getter public | 84–86 | — | `number` |
| `onClientSelectionChange` | método public | 88–94 | `client: Client \| null` | `void` |
| `onExpirationDateChange` | método public | 96–99 | `value: string` | `void` |
| `onProductSelected` | método public | 101–111 | `product: Product` | `void` |
| `updateQuantity` | método public | 113–118 | `productId: string`, `quantity: number` | `void` |
| `updateDiscount` | método public | 120–125 | `productId: string`, `discount: number` | `void` |
| `increment` | método public | 127–129 | `item: QuotationDraftItem` | `void` |
| `decrement` | método public | 131–133 | `item: QuotationDraftItem` | `void` |
| `removeItem` | método public | 135–137 | `productId: string` | `void` |
| `saveQuotation` | método public async | 139–202 | — | `Promise<void>` |
| `resetForm` | método private | 204–213 | — | `void` |

##### `CreateQuotationTabComponent.subtotal`

- **Firma:** `subtotal(): number` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L76) (L76–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `calculateQuotationDraftSubtotal`, `this.items`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateQuotationTabComponent.discountTotal`

- **Firma:** `discountTotal(): number` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `calculateQuotationDraftDiscount`, `this.items`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateQuotationTabComponent.total`

- **Firma:** `total(): number` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L84) (L84–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `calculateQuotationDraftTotal`, `this.items`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateQuotationTabComponent.onClientSelectionChange`

- **Firma:** `onClientSelectionChange(client: Client \| null): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L88) (L88–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedClientId.set`, `this.selectedClientName.set`, `this.clientError.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedClientId.set`, `this.selectedClientName.set`, `this.clientError.set`
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.onExpirationDateChange`

- **Firma:** `onExpirationDateChange(value: string): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L96) (L96–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.expirationDate.set`, `this.dateError.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.expirationDate.set`, `this.dateError.set`
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.onProductSelected`

- **Firma:** `onProductSelected(product: Product): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L101) (L101–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items().find`, `this.items`, `this.updateQuantity`, `this.items.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.updateQuantity`

- **Firma:** `updateQuantity(productId: string, quantity: number): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L113) (L113–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.max`, `this.items.update`, `items.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** (mismo archivo)

##### `CreateQuotationTabComponent.updateDiscount`

- **Firma:** `updateDiscount(productId: string, discount: number): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L120) (L120–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.max`, `this.items.update`, `items.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.increment`

- **Firma:** `increment(item: QuotationDraftItem): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L127) (L127–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.decrement`

- **Firma:** `decrement(item: QuotationDraftItem): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L131) (L131–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.removeItem`

- **Firma:** `removeItem(productId: string): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L135) (L135–137)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.update`, `items.filter`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.saveQuotation`

- **Firma:** `saveQuotation(): Promise<void>` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L139) (L139–202)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items`, `this.isSaving`, `this.selectedClientId`, `this.clientError.set`, `this.notificationService.error`, `this.expirationDate`, `this.dateError.set`, `this.confirmDialogService.confirm`, `this.isSaving.set`, `this.items().map`, `this.quotationsService.createQuotation`, `this.observations().trim`, `this.observations`, `this.commercialTerms().trim`, `this.commercialTerms`, `this.notificationService.success`, `this.resetForm`, `this.quotationsService.exportQuotationPdf(quotation.id).subscribe`…
- **Efectos secundarios:** Actualiza estado (signals): `this.clientError.set`, `this.dateError.set`, `this.isSaving.set`
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.resetForm`

- **Firma:** `resetForm(): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L204) (L204–213)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.set`, `this.selectedClientId.set`, `this.selectedClientName.set`, `this.expirationDate.set`, `this.observations.set`, `this.commercialTerms.set`, `this.clientError.set`, `this.dateError.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.set`, `this.selectedClientId.set`, `this.selectedClientName.set`, `this.expirationDate.set`, `this.observations.set`, `this.commercialTerms.set`
- **Consumidores:** (mismo archivo)

#### Función `todayIsoDate` (L24–30)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L24)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-detail-modal-quotation-detail-modal-component-ts"></a>

### quotation-detail-modal.component.ts

- **Ruta:** [quotation-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.ts`, 49 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-quotations`
- **Responsabilidad:** Read-only line-item detail for one cotización — reached from Historial's "Ver detalle" action.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [quotations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-quotations-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts), [quotation-history-tab.component.ts (plantilla)](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts) (plantilla)
- **Plantilla:** [quotation-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`

#### Clase `QuotationDetailModalComponent` (L9–48)

- **Decoradores:** `@Component({ selector: 'app-quotation-detail-modal', standalone: true, imports: [DatePipe, IconComponent], templateUrl: './quotation-detail-modal.component.html'`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Read-only line-item detail for one cotización — reached from Historial's "Ver detalle" action.
- **Servicios inyectados con `inject()`:** `quotationsService = inject(QuotationsService)`
- **Datos / estado que administra:** `@Input quotationId = null`, `@Output closed = new EventEmitter<void>()`, `quotation = signal<Quotation \| null>(null)`, `loading = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 28–43 | — | `void` |
| `close` | método public | 45–47 | — | `void` |

##### `QuotationDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [quotation-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.ts#L28) (L28–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quotation.set`, `this.loading.set`, `this.quotationsService.getQuotationById(this.quotationId).subscribe`, `this.quotationsService.getQuotationById`
- **Efectos secundarios:** Actualiza estado (signals): `this.quotation.set`, `this.loading.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationDetailModalComponent.close`

- **Firma:** `close(): void` — [quotation-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `quotation-detail-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts"></a>

### quotation-history-tab.component.ts

- **Ruta:** [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts`, 197 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-quotations`
- **Responsabilidad:** Componente Angular: declara `QuotationHistoryTabComponent`, `StatusFilter`, `PAGE_LIMIT`, `DEFAULT_FILTERS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [quotations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-quotations-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [quotation-detail-modal.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-detail-modal-quotation-detail-modal-component-ts), [quotation-void-reason-modal.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-void-reason-modal-quotation-void-reason-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [quotations-page.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-page-component-ts), [quotations-page.component.ts (plantilla)](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-page-component-ts) (plantilla)
- **Plantilla:** [quotation-history-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [quotation-detail-modal.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-detail-modal-quotation-detail-modal-component-ts), [quotation-void-reason-modal.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-void-reason-modal-quotation-void-reason-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="draftSearch.set($event)"`, `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(ngModelChange)="draftStatus.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(click)="viewDetail(quotation)"`, `(click)="regeneratePdf(quotation)"`, `(click)="requestVoid(quotation)"`, `(pageChange)="onPageChange($event)"`, `(closed)="closeDetail()"`, `(confirmed)="confirmVoid($event)"`, `(cancelled)="cancelVoid()"`

**Interfaces, tipos y enums:**

- `type StatusFilter` (L24) = `QuotationStatus \| 'ALL'`

#### Clase `QuotationHistoryTabComponent` (L33–196)

- **Decoradores:** `@Component({ selector: 'app-quotation-history-tab', standalone: true, imports: [ DatePipe, FormsModule, EmptyStateComponent, BadgeComponent, ButtonComponent, Ico`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `quotationsService = inject(QuotationsService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `quotations = signal<QuotationSummary[]>([])`, `total = signal(0)`, `page = signal(1)`, `loading = signal(false)`, `draftSearch = signal(DEFAULT_FILTERS.search)`, `draftStartDate = signal(DEFAULT_FILTERS.startDate)`, `draftEndDate = signal(DEFAULT_FILTERS.endDate)`, `draftStatus = signal<StatusFilter>(DEFAULT_FILTERS.status)`, `search = signal(DEFAULT_FILTERS.search)`, `startDate = signal(DEFAULT_FILTERS.startDate)`, `endDate = signal(DEFAULT_FILTERS.endDate)`, `statusFilter = signal<StatusFilter>(DEFAULT_FILTERS.status)`, `hasActiveFilters = computed( () => this.search() !== DEFAULT_FILTERS.`, `detailQuotationId = signal<string \| null>(null)`, `voidTarget = signal<QuotationSummary \| null>(null)`, `generatingPdfId = signal<string \| null>(null)`, `isEmpty = computed(() => !this.loading() && this.quotations(`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 97–120 | — | `void` |
| `applyFilters` | método public | 122–129 | — | `void` |
| `clearFilters` | método public | 131–142 | — | `void` |
| `onPageChange` | método public | 144–147 | `page: number` | `void` |
| `viewDetail` | método public | 149–151 | `quotation: QuotationSummary` | `void` |
| `closeDetail` | método public | 153–155 | — | `void` |
| `regeneratePdf` | método public | 157–169 | `quotation: QuotationSummary` | `void` |
| `requestVoid` | método public | 171–173 | `quotation: QuotationSummary` | `void` |
| `cancelVoid` | método public | 175–177 | — | `void` |
| `confirmVoid` | método public | 179–195 | `reason: string` | `void` |

##### `QuotationHistoryTabComponent.fetch`

- **Firma:** `fetch(): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L97) (L97–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.statusFilter`, `this.quotationsService.getQuotations`, `this.page`, `this.search`, `this.startDate`, `this.endDate`, `this.quotations.set`, `this.total.set`, `this.notificationService.error`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.quotations.set`, `this.total.set`
- **Consumidores:** (mismo archivo)

##### `QuotationHistoryTabComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L122) (L122–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.search.set`, `this.draftSearch().trim`, `this.draftSearch`, `this.startDate.set`, `this.draftStartDate`, `this.endDate.set`, `this.draftEndDate`, `this.statusFilter.set`, `this.draftStatus`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.search.set`, `this.startDate.set`, `this.endDate.set`, `this.statusFilter.set`, `this.page.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L131) (L131–142)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftSearch.set`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftStatus.set`, `this.search.set`, `this.startDate.set`, `this.endDate.set`, `this.statusFilter.set`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftSearch.set`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftStatus.set`, `this.search.set`, `this.startDate.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L144) (L144–147)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.viewDetail`

- **Firma:** `viewDetail(quotation: QuotationSummary): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L149) (L149–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailQuotationId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailQuotationId.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L153) (L153–155)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailQuotationId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailQuotationId.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.regeneratePdf`

- **Firma:** `regeneratePdf(quotation: QuotationSummary): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L157) (L157–169)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.generatingPdfId.set`, `this.quotationsService.exportQuotationPdf(quotation.id).subscribe`, `this.quotationsService.exportQuotationPdf`, `downloadBlob`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.generatingPdfId.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.requestVoid`

- **Firma:** `requestVoid(quotation: QuotationSummary): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L171) (L171–173)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.cancelVoid`

- **Firma:** `cancelVoid(): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L175) (L175–177)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.confirmVoid`

- **Firma:** `confirmVoid(reason: string): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L179) (L179–195)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget`, `this.quotationsService.voidQuotation(target.id, reason).subscribe`, `this.quotationsService.voidQuotation`, `this.notificationService.success`, `this.voidTarget.set`, `this.fetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts"></a>

### quotation-product-search.component.ts

- **Ruta:** [quotation-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.ts`, 119 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-quotations`
- **Responsabilidad:** Own small copy of Tickets' `TicketProductSearchComponent` (itself a copy of Ventas' own) — this app's established convention is a per-feature copy over a shared one.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [inventory.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [create-quotation-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts), [create-quotation-tab.component.ts (plantilla)](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts) (plantilla)
- **Plantilla:** [quotation-product-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [barcode-scanner-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="onInput($event)"`, `(focus)="onFocus()"`, `(blur)="onBlur()"`, `(keydown.enter)="onEnter()"`, `(click)="openScanner()"`, `(scanned)="onBarcodeScanned($event)"`, `(closed)="scannerOpen.set(false)"`, `(click)="select(product)"`

#### Clase `QuotationProductSearchComponent` (L17–118)

- **Decoradores:** `@Component({ selector: 'app-quotation-product-search', standalone: true, imports: [FormsModule, IconComponent, BarcodeScannerModalComponent], templateUrl: './quo`
- **Propósito:** Own small copy of Tickets' `TicketProductSearchComponent` (itself a copy of Ventas' own) — this app's established convention is a per-feature copy over a shared one. A Cotización, like a Ticket, isn't constrained by real inventory availability (it never reserves or decrements stock), so results are never disabled for being out of stock.
- **Servicios inyectados con `inject()`:** `inventoryService = inject(InventoryService)`
- **Datos / estado que administra:** `@Output productSelected = new EventEmitter<Product>()`, `query = signal('')`, `results = signal<Product[]>([])`, `loading = signal(false)`, `open = signal(false)`, `hasSearched = signal(false)`, `scannerOpen = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onInput` | método public | 64–72 | `value: string` | `void` |
| `onFocus` | método public | 74–78 | — | `void` |
| `onBlur` | método public | 80–82 | — | `void` |
| `select` | método public | 84–90 | `product: Product` | `void` |
| `onEnter` | método public | 92–97 | — | `void` |
| `openScanner` | método public | 99–101 | — | `void` |
| `onBarcodeScanned` | método public | 103–117 | `code: string` | `void` |

##### `QuotationProductSearchComponent.onInput`

- **Firma:** `onInput(value: string): void` — [quotation-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.ts#L64) (L64–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.open.set`, `this.query$.next`, `value.trim`, `this.results.set`, `this.hasSearched.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.open.set`, `this.results.set`, `this.hasSearched.set`
- **Consumidores:** `quotation-product-search.component.html` (plantilla)

##### `QuotationProductSearchComponent.onFocus`

- **Firma:** `onFocus(): void` — [quotation-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.ts#L74) (L74–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results`, `this.hasSearched`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `quotation-product-search.component.html` (plantilla)

##### `QuotationProductSearchComponent.onBlur`

- **Firma:** `onBlur(): void` — [quotation-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `setTimeout`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `quotation-product-search.component.html` (plantilla)

##### `QuotationProductSearchComponent.select`

- **Firma:** `select(product: Product): void` — [quotation-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.ts#L84) (L84–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productSelected.emit`, `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`; Emite eventos: `this.productSelected.emit`
- **Consumidores:** `quotation-product-search.component.html` (plantilla), (mismo archivo)

##### `QuotationProductSearchComponent.onEnter`

- **Firma:** `onEnter(): void` — [quotation-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.ts#L92) (L92–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results`, `this.select`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `quotation-product-search.component.html` (plantilla), (mismo archivo)

##### `QuotationProductSearchComponent.openScanner`

- **Firma:** `openScanner(): void` — [quotation-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.ts#L99) (L99–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`
- **Consumidores:** `quotation-product-search.component.html` (plantilla)

##### `QuotationProductSearchComponent.onBarcodeScanned`

- **Firma:** `onBarcodeScanned(code: string): void` — [quotation-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.ts#L103) (L103–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`, `this.query.set`, `this.open.set`, `this.loading.set`, `this.inventoryService.searchProducts(code).pipe`, `this.inventoryService.searchProducts`, `catchError`, `of`, `this.hasSearched.set`, `this.results.set`, `this.onEnter`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`, `this.query.set`, `this.open.set`, `this.loading.set`, `this.hasSearched.set`, `this.results.set`
- **Consumidores:** `quotation-product-search.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-void-reason-modal-quotation-void-reason-modal-component-ts"></a>

### quotation-void-reason-modal.component.ts

- **Ruta:** [quotation-void-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.ts`, 48 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-quotations`
- **Responsabilidad:** Small, dedicated reason-collection modal — `ConfirmDialogService` only supports a fixed title/message, no free-text input, so anular (which needs a mandatory reason, same as the backend's `VoidQuotationRequestDto`) can't reuse it.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts), [quotation-history-tab.component.ts (plantilla)](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts) (plantilla)
- **Plantilla:** [quotation-void-reason-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(ngModelChange)="reason.set($event)"`, `(click)="cancel()"`, `(click)="confirm()"`

#### Clase `QuotationVoidReasonModalComponent` (L15–47)

- **Decoradores:** `@Component({ selector: 'app-quotation-void-reason-modal', standalone: true, imports: [FormsModule, IconComponent, ButtonComponent], templateUrl: './quotation-voi`
- **Propósito:** Small, dedicated reason-collection modal — `ConfirmDialogService` only supports a fixed title/message, no free-text input, so anular (which needs a mandatory reason, same as the backend's `VoidQuotationRequestDto`) can't reuse it. A small, deliberate copy of Tickets' own `VoidReasonModalComponent` (same convention as that component's own doc comment) rather than a shared one, since the label text genuinely differs ("cotización" vs "ticket"). Dumb — the parent owns the actual `voidQuotation()` call.
- **Datos / estado que administra:** `@Input open = false`, `@Input quotationNumber = ''`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isValid` | getter public | 31–33 | — | `boolean` |
| `confirm` | método public | 35–41 | — | `void` |
| `cancel` | método public | 43–46 | — | `void` |

##### `QuotationVoidReasonModalComponent.isValid`

- **Firma:** `isValid(): boolean` — [quotation-void-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationVoidReasonModalComponent.confirm`

- **Firma:** `confirm(): void` — [quotation-void-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.ts#L35) (L35–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`, `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.confirmed.emit`
- **Consumidores:** `quotation-void-reason-modal.component.html` (plantilla)

##### `QuotationVoidReasonModalComponent.cancel`

- **Firma:** `cancel(): void` — [quotation-void-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.ts#L43) (L43–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `quotation-void-reason-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-page-component-ts"></a>

### quotations-page.component.ts

- **Ruta:** [quotations-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/quotations-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/quotations/quotations-page.component.ts`, 32 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-quotations`
- **Responsabilidad:** `Cotizaciones` — a document that is explicitly NOT a sale: it never decrements/reserves inventory, never appears in Ventas' reports or the dashboard, and needs no confirmation before generating its PDF (unlike Ventas/Compras' own post-save PDF prompt).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [create-quotation-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts), [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [quotations-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/quotations-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [create-quotation-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts), [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="selectTab('crear')"`, `(click)="selectTab('historial')"`

**Interfaces, tipos y enums:**

- `type TabValue` (L7) = `'crear' \| 'historial'`

#### Clase `QuotationsPageComponent` (L17–31)

- **Decoradores:** `@Component({ selector: 'app-quotations-page', standalone: true, imports: [PageHeaderComponent, CreateQuotationTabComponent, QuotationHistoryTabComponent], templa`
- **Propósito:** `Cotizaciones` — a document that is explicitly NOT a sale: it never decrements/reserves inventory, never appears in Ventas' reports or the dashboard, and needs no confirmation before generating its PDF (unlike Ventas/Compras' own post-save PDF prompt). Every line's price/discount is historicized at creation time. See the backend's own `create_quotation` function for the structural guarantee.
- **Datos / estado que administra:** `activeTab = signal<TabValue>('crear')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `selectTab` | método public | 28–30 | `tab: TabValue` | `void` |

##### `QuotationsPageComponent.selectTab`

- **Firma:** `selectTab(tab: TabValue): void` — [quotations-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/quotations-page.component.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.activeTab.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.activeTab.set`
- **Consumidores:** `quotations-page.component.html` (plantilla)

