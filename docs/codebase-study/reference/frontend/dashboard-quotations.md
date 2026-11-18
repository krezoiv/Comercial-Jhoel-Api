# Frontend `dashboard-quotations`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [create-quotation-tab.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts) | .ts | Componente Angular | Feature (pantalla) | A Cotización is explicitly NOT a sale — the cart here is pure local component state (never a server-side draft/reservation), since a cotización never reserves or affects inventory. | 8 internas; ext.: @angular/core, @angular/forms | 3 | Media (3 consumidores) |
| [quotation-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-detail-modal-quotation-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Read-only line-item detail for one cotización — reached from Historial's "Ver detalle" action. | 3 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [quotation-history-tab.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `QuotationHistoryTabComponent`, `StatusFilter`, `PAGE_LIMIT`, `DEFAULT_FILTERS` (sin comentario de documentación en el código). | 12 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [quotation-product-search.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts) | .ts | Componente Angular | Feature (pantalla) | Own small copy of Tickets' `TicketProductSearchComponent` (itself a copy of Ventas' own) — this app's established convention is a per-feature copy over a shared one. | 3 internas; ext.: @angular/core, @angular/forms, rxjs | 6 | Media (6 consumidores) |
| [quotation-sale-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-sale-modal-quotation-sale-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Confirmar venta": shows the quoted products and quantities with the current Vitrina stock, and only then converts the quotation into ONE sale through Ventas (the backend validates stock again under lock, uses the quoted prices and returns the same sale on a retry/double click). | 5 internas; ext.: @angular/common, @angular/core | 3 | Media (3 consumidores) |
| [quotation-void-reason-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-void-reason-modal-quotation-void-reason-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Small, dedicated reason-collection modal — `ConfirmDialogService` only supports a fixed title/message, no free-text input, so anular (which needs a mandatory reason, same as the backend's `VoidQuotationRequestDto`) can't reuse it. | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [quotations-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | `Cotizaciones` — a document that is explicitly NOT a sale: it never decrements/reserves inventory, never appears in Ventas' reports or the dashboard, and needs no confirmation before generating its PDF (unlike Ventas/Compras' own post-save PDF prompt). | 3 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [quotations.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `preview`, `quotation` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/common, @angular/core, rxjs | 0 | Soporte (pruebas) |
| [create-quotation-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `create-quotation-tab.component.ts`; usa 4 componentes hijos: `app-quotation-product-search`, `app-empty-state`, `app-icon`, `app-button`. | — | — | Media |
| [create-quotation-tab.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [quotation-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `quotation-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-badge`. | — | — | Media |
| [quotation-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [quotation-history-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `quotation-history-tab.component.ts`; usa 8 componentes hijos: `app-icon`, `app-button`, `app-empty-state`, `app-badge`, `app-report-pagination`, `app-quotation-detail-modal`. | — | — | Media |
| [quotation-history-tab.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [quotation-product-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `quotation-product-search.component.ts`; usa 2 componentes hijos: `app-icon`, `app-barcode-scanner-modal`. | — | — | Media |
| [quotation-product-search.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-product-search/quotation-product-search.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [quotation-sale-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-sale-modal/quotation-sale-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `quotation-sale-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [quotation-sale-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-sale-modal/quotation-sale-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [quotation-void-reason-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `quotation-void-reason-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [quotation-void-reason-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [quotations-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/quotations-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `quotations-page.component.ts`; usa 3 componentes hijos: `app-page-header`, `app-create-quotation-tab`, `app-quotation-history-tab`. | — | — | Media |
| [quotations-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/quotations-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts"></a>

### create-quotation-tab.component.ts

- **Ruta:** [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts`, 230 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-quotations`
- **Responsabilidad:** A Cotización is explicitly NOT a sale — the cart here is pure local component state (never a server-side draft/reservation), since a cotización never reserves or affects inventory.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [quotations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-quotations-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [quotation-product-search.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [quotations-page.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-page-component-ts), [quotations.spec.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-spec-ts), [quotations-page.component.ts (plantilla)](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-page-component-ts) (plantilla)
- **Plantilla:** [create-quotation-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.html) · **Usa componentes:** [quotation-product-search.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="customerName.set($event)"`, `(ngModelChange)="customerPhone.set($event)"`, `(ngModelChange)="studentName.set($event)"`, `(ngModelChange)="grade.set($event)"`, `(ngModelChange)="onExpirationDateChange($event)"`, `(productSelected)="onProductSelected($event)"`, `(click)="decrement(item)"`, `(click)="increment(item)"`, `(ngModelChange)="updateDiscount(item.productId, $event)"`, `(click)="removeItem(item.productId)"`, `(ngModelChange)="observations.set($event)"`, `(ngModelChange)="commercialTerms.set($event)"`, `(ngModelChange)="asDraft.set($event)"`, `(click)="saveQuotation()"`

#### Clase `CreateQuotationTabComponent` (L39–229)

- **Decoradores:** `@Component({ selector: 'app-create-quotation-tab', standalone: true, imports: [ FormsModule, QuotationProductSearchComponent, EmptyStateComponent, IconComponent,`
- **Propósito:** A Cotización is explicitly NOT a sale — the cart here is pure local component state (never a server-side draft/reservation), since a cotización never reserves or affects inventory. Nothing is sent to the backend until "Guardar Cotización". Unlike Ticket's cart, each line carries an editable discount, and the running totals show three lines (Subtotal/Descuento/Total) computed with the exact same math `create_quotation()` uses server-side.
- **Servicios inyectados con `inject()`:** `quotationsService = inject(QuotationsService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `items = signal<QuotationDraftItem[]>([])`, `customerName = signal('')`, `customerPhone = signal('')`, `studentName = signal('')`, `grade = signal('')`, `asDraft = signal(false)`, `expirationDate = signal(todayIsoDate())`, `observations = signal('')`, `commercialTerms = signal('')`, `isSaving = signal(false)`, `clientError = signal(false)`, `dateError = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `subtotal` | getter public | 77–79 | — | `number` |
| `discountTotal` | getter public | 81–83 | — | `number` |
| `total` | getter public | 85–87 | — | `number` |
| `customerProblem` | método public | 90–100 | — | `string \| null` |
| `onExpirationDateChange` | método public | 102–105 | `value: string` | `void` |
| `onProductSelected` | método public | 107–117 | `product: Product` | `void` |
| `updateQuantity` | método public | 119–124 | `productId: string`, `quantity: number` | `void` |
| `updateDiscount` | método public | 126–131 | `productId: string`, `discount: number` | `void` |
| `increment` | método public | 133–135 | `item: QuotationDraftItem` | `void` |
| `decrement` | método public | 137–139 | `item: QuotationDraftItem` | `void` |
| `removeItem` | método public | 141–143 | `productId: string` | `void` |
| `saveQuotation` | método public async | 145–214 | — | `Promise<void>` |
| `resetForm` | método private | 216–228 | — | `void` |

##### `CreateQuotationTabComponent.subtotal`

- **Firma:** `subtotal(): number` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `calculateQuotationDraftSubtotal`, `this.items`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateQuotationTabComponent.discountTotal`

- **Firma:** `discountTotal(): number` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `calculateQuotationDraftDiscount`, `this.items`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateQuotationTabComponent.total`

- **Firma:** `total(): number` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `calculateQuotationDraftTotal`, `this.items`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateQuotationTabComponent.customerProblem`

- **Firma:** `customerProblem(): string \| null` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L90) (L90–100)
- **Propósito / descripción:** Client-side echo of the backend rule: name 3–150 characters, phone with at least 8 digits.
- **Dependencias (llamadas en su cuerpo):** `this.customerName().trim`, `this.customerName`, `this.customerPhone().trim`, `this.customerPhone`, `/^[+0-9 ()-]{8,20}$/.test`, `phone.replace`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `create-quotation-tab.component.html` (plantilla), (mismo archivo)

##### `CreateQuotationTabComponent.onExpirationDateChange`

- **Firma:** `onExpirationDateChange(value: string): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L102) (L102–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.expirationDate.set`, `this.dateError.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.expirationDate.set`, `this.dateError.set`
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.onProductSelected`

- **Firma:** `onProductSelected(product: Product): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L107) (L107–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items().find`, `this.items`, `this.updateQuantity`, `this.items.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.updateQuantity`

- **Firma:** `updateQuantity(productId: string, quantity: number): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L119) (L119–124)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.max`, `this.items.update`, `items.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** (mismo archivo)

##### `CreateQuotationTabComponent.updateDiscount`

- **Firma:** `updateDiscount(productId: string, discount: number): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L126) (L126–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.max`, `this.items.update`, `items.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.increment`

- **Firma:** `increment(item: QuotationDraftItem): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L133) (L133–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.decrement`

- **Firma:** `decrement(item: QuotationDraftItem): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L137) (L137–139)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.removeItem`

- **Firma:** `removeItem(productId: string): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L141) (L141–143)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.update`, `items.filter`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.saveQuotation`

- **Firma:** `saveQuotation(): Promise<void>` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L145) (L145–214)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items`, `this.isSaving`, `this.customerProblem`, `this.clientError.set`, `this.notificationService.error`, `this.expirationDate`, `this.dateError.set`, `this.confirmDialogService.confirm`, `this.asDraft`, `this.customerName().trim`, `this.customerName`, `formatCurrency`, `this.isSaving.set`, `this.items().map`, `this.quotationsService.createQuotation`, `this.customerPhone().trim`, `this.customerPhone`, `this.studentName().trim`…
- **Efectos secundarios:** Actualiza estado (signals): `this.clientError.set`, `this.dateError.set`, `this.isSaving.set`
- **Consumidores:** `create-quotation-tab.component.html` (plantilla)

##### `CreateQuotationTabComponent.resetForm`

- **Firma:** `resetForm(): void` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L216) (L216–228)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.set`, `this.customerName.set`, `this.customerPhone.set`, `this.studentName.set`, `this.grade.set`, `this.asDraft.set`, `this.expirationDate.set`, `this.observations.set`, `this.commercialTerms.set`, `this.clientError.set`, `this.dateError.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.set`, `this.customerName.set`, `this.customerPhone.set`, `this.studentName.set`, `this.grade.set`, `this.asDraft.set`
- **Consumidores:** (mismo archivo)

#### Función `todayIsoDate` (L22–28)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [create-quotation-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts#L22)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-detail-modal-quotation-detail-modal-component-ts"></a>

### quotation-detail-modal.component.ts

- **Ruta:** [quotation-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.ts`, 51 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-quotations`
- **Responsabilidad:** Read-only line-item detail for one cotización — reached from Historial's "Ver detalle" action.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [quotations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-quotations-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts), [quotation-history-tab.component.ts (plantilla)](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts) (plantilla)
- **Plantilla:** [quotation-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`

#### Clase `QuotationDetailModalComponent` (L9–50)

- **Decoradores:** `@Component({ selector: 'app-quotation-detail-modal', standalone: true, imports: [DatePipe, BadgeComponent, IconComponent], templateUrl: './quotation-detail-modal`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Read-only line-item detail for one cotización — reached from Historial's "Ver detalle" action.
- **Servicios inyectados con `inject()`:** `quotationsService = inject(QuotationsService)`
- **Datos / estado que administra:** `@Input quotationId = null`, `@Output closed = new EventEmitter<void>()`, `quotation = signal<Quotation \| null>(null)`, `loading = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 30–45 | — | `void` |
| `close` | método public | 47–49 | — | `void` |

##### `QuotationDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [quotation-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.ts#L30) (L30–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quotation.set`, `this.loading.set`, `this.quotationsService.getQuotationById(this.quotationId).subscribe`, `this.quotationsService.getQuotationById`
- **Efectos secundarios:** Actualiza estado (signals): `this.quotation.set`, `this.loading.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationDetailModalComponent.close`

- **Firma:** `close(): void` — [quotation-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-detail-modal/quotation-detail-modal.component.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `quotation-detail-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts"></a>

### quotation-history-tab.component.ts

- **Ruta:** [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts`, 259 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-quotations`
- **Responsabilidad:** Componente Angular: declara `QuotationHistoryTabComponent`, `StatusFilter`, `PAGE_LIMIT`, `DEFAULT_FILTERS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [quotations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-quotations-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [quotation-detail-modal.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-detail-modal-quotation-detail-modal-component-ts), [quotation-void-reason-modal.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-void-reason-modal-quotation-void-reason-modal-component-ts), [quotation-sale-modal.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-sale-modal-quotation-sale-modal-component-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [quotations-page.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-page-component-ts), [quotations-page.component.ts (plantilla)](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-page-component-ts) (plantilla)
- **Plantilla:** [quotation-history-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [quotation-detail-modal.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-detail-modal-quotation-detail-modal-component-ts), [quotation-sale-modal.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-sale-modal-quotation-sale-modal-component-ts), [quotation-void-reason-modal.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-void-reason-modal-quotation-void-reason-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="draftSearch.set($event)"`, `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(ngModelChange)="draftStatus.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(click)="viewDetail(quotation)"`, `(click)="regeneratePdf(quotation)"`, `(click)="runAction(quotation, 'CONFIRMAR')"`, `(click)="runAction(quotation, 'ACEPTAR')"`, `(click)="saleQuotationId.set(quotation.id)"`, `(click)="rejectTarget.set(quotation)"`, `(click)="requestVoid(quotation)"`, `(pageChange)="onPageChange($event)"`, `(closed)="closeDetail()"`

**Interfaces, tipos y enums:**

- `type StatusFilter` (L29) = `QuotationStatus \| 'ALL'`

#### Clase `QuotationHistoryTabComponent` (L38–258)

- **Decoradores:** `@Component({ selector: 'app-quotation-history-tab', standalone: true, imports: [ DatePipe, FormsModule, EmptyStateComponent, BadgeComponent, ButtonComponent, Ico`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `quotationsService = inject(QuotationsService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`, `confirmDialog = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `quotations = signal<QuotationSummary[]>([])`, `total = signal(0)`, `page = signal(1)`, `loading = signal(false)`, `draftSearch = signal(DEFAULT_FILTERS.search)`, `draftStartDate = signal(DEFAULT_FILTERS.startDate)`, `draftEndDate = signal(DEFAULT_FILTERS.endDate)`, `draftStatus = signal<StatusFilter>(DEFAULT_FILTERS.status)`, `search = signal(DEFAULT_FILTERS.search)`, `startDate = signal(DEFAULT_FILTERS.startDate)`, `endDate = signal(DEFAULT_FILTERS.endDate)`, `statusFilter = signal<StatusFilter>(DEFAULT_FILTERS.status)`, `hasActiveFilters = computed( () => this.search() !== DEFAULT_FILTERS.`, `detailQuotationId = signal<string \| null>(null)`, `voidTarget = signal<QuotationSummary \| null>(null)`, `generatingPdfId = signal<string \| null>(null)`, `rejectTarget = signal<QuotationSummary \| null>(null)`, `saleQuotationId = signal<string \| null>(null)`, `busyId = signal<string \| null>(null)`, `isEmpty = computed(() => !this.loading() && this.quotations(`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 109–132 | — | `void` |
| `applyFilters` | método public | 134–141 | — | `void` |
| `clearFilters` | método public | 143–154 | — | `void` |
| `onPageChange` | método public | 156–159 | `page: number` | `void` |
| `viewDetail` | método public | 161–163 | `quotation: QuotationSummary` | `void` |
| `closeDetail` | método public | 165–167 | — | `void` |
| `regeneratePdf` | método public | 169–181 | `quotation: QuotationSummary` | `void` |
| `runAction` | método public async | 184–208 | `quotation: QuotationSummary`, `action: Exclude<QuotationStatusAction, 'RECHAZAR'>` | `Promise<void>` |
| `confirmReject` | método public | 210–226 | `reason: string` | `void` |
| `onSold` | método public | 228–231 | — | `void` |
| `requestVoid` | método public | 233–235 | `quotation: QuotationSummary` | `void` |
| `cancelVoid` | método public | 237–239 | — | `void` |
| `confirmVoid` | método public | 241–257 | `reason: string` | `void` |

##### `QuotationHistoryTabComponent.fetch`

- **Firma:** `fetch(): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L109) (L109–132)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.statusFilter`, `this.quotationsService.getQuotations`, `this.page`, `this.search`, `this.startDate`, `this.endDate`, `this.quotations.set`, `this.total.set`, `this.notificationService.error`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.quotations.set`, `this.total.set`
- **Consumidores:** (mismo archivo)

##### `QuotationHistoryTabComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L134) (L134–141)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.search.set`, `this.draftSearch().trim`, `this.draftSearch`, `this.startDate.set`, `this.draftStartDate`, `this.endDate.set`, `this.draftEndDate`, `this.statusFilter.set`, `this.draftStatus`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.search.set`, `this.startDate.set`, `this.endDate.set`, `this.statusFilter.set`, `this.page.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L143) (L143–154)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftSearch.set`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftStatus.set`, `this.search.set`, `this.startDate.set`, `this.endDate.set`, `this.statusFilter.set`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftSearch.set`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftStatus.set`, `this.search.set`, `this.startDate.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L156) (L156–159)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.viewDetail`

- **Firma:** `viewDetail(quotation: QuotationSummary): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L161) (L161–163)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailQuotationId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailQuotationId.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L165) (L165–167)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailQuotationId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailQuotationId.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.regeneratePdf`

- **Firma:** `regeneratePdf(quotation: QuotationSummary): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L169) (L169–181)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.generatingPdfId.set`, `this.quotationsService.exportQuotationPdf(quotation.id).subscribe`, `this.quotationsService.exportQuotationPdf`, `downloadBlob`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.generatingPdfId.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.runAction`

- **Firma:** `runAction(quotation: QuotationSummary, action: Exclude<QuotationStatusAction, 'RECHAZAR'>): Promise<void>` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L184) (L184–208)
- **Propósito / descripción:** Confirmar borrador / Aceptar (no inventory effect).
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialog.confirm`, `this.busyId.set`, `this.quotationsService.changeStatus(quotation.id, action).subscribe`, `this.quotationsService.changeStatus`, `this.notificationService.success`, `this.fetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.busyId.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.confirmReject`

- **Firma:** `confirmReject(reason: string): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L210) (L210–226)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.rejectTarget`, `this.quotationsService.changeStatus(target.id, 'RECHAZAR', reason).subscribe`, `this.quotationsService.changeStatus`, `this.notificationService.success`, `this.rejectTarget.set`, `this.fetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.rejectTarget.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.onSold`

- **Firma:** `onSold(): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L228) (L228–231)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleQuotationId.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.saleQuotationId.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.requestVoid`

- **Firma:** `requestVoid(quotation: QuotationSummary): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L233) (L233–235)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.cancelVoid`

- **Firma:** `cancelVoid(): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L237) (L237–239)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `quotation-history-tab.component.html` (plantilla)

##### `QuotationHistoryTabComponent.confirmVoid`

- **Firma:** `confirmVoid(reason: string): void` — [quotation-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts#L241) (L241–257)
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
- **Consumidores:** [create-quotation-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts), [school-quotation-editor.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotation-editor-school-quotation-editor-component-ts), [school-templates.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-templates-school-templates-component-ts), [create-quotation-tab.component.ts (plantilla)](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts) (plantilla), [school-quotation-editor.component.ts (plantilla)](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotation-editor-school-quotation-editor-component-ts) (plantilla), [school-templates.component.ts (plantilla)](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-templates-school-templates-component-ts) (plantilla)
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

<a id="f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-sale-modal-quotation-sale-modal-component-ts"></a>

### quotation-sale-modal.component.ts

- **Ruta:** [quotation-sale-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-sale-modal/quotation-sale-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-sale-modal/quotation-sale-modal.component.ts`, 94 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-quotations`
- **Responsabilidad:** "Confirmar venta": shows the quoted products and quantities with the current Vitrina stock, and only then converts the quotation into ONE sale through Ventas (the backend validates stock again under lock, uses the quoted prices and returns the same sale on a retry/double click).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [quotations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-quotations-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts), [quotations.spec.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-spec-ts), [quotation-history-tab.component.ts (plantilla)](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts) (plantilla)
- **Plantilla:** [quotation-sale-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-sale-modal/quotation-sale-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closed.emit()"`, `(click)="confirm()"`

#### Clase `QuotationSaleModalComponent` (L26–93)

- **Decoradores:** `@Component({ selector: 'app-quotation-sale-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './quotation-sale-modal.component.ht`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Confirmar venta": shows the quoted products and quantities with the current Vitrina stock, and only then converts the quotation into ONE sale through Ventas (the backend validates stock again under lock, uses the quoted prices and returns the same sale on a retry/double click).
- **Servicios inyectados con `inject()`:** `service = inject(QuotationsService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `@Input quotationId = null`, `@Output closed = new EventEmitter<void>()`, `@Output sold = new EventEmitter<string>()`, `preview = signal<QuotationSalePreview \| null>(null)`, `loading = signal(false)`, `saving = signal(false)`, `error = signal<string \| null>(null)`, `units = computed(() => (this.preview()?.lines ?? []).reduc`, `missing = computed(() => (this.preview()?.lines ?? []).filte`, `missingNames = computed(() => this.missing().map((line) => line.p`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 53–70 | — | `void` |
| `confirm` | método public | 72–92 | — | `void` |

##### `QuotationSaleModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [quotation-sale-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-sale-modal/quotation-sale-modal.component.ts#L53) (L53–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.preview.set`, `this.error.set`, `this.loading.set`, `this.service.getSalePreview(this.quotationId).subscribe`, `this.service.getSalePreview`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.preview.set`, `this.error.set`, `this.loading.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationSaleModalComponent.confirm`

- **Firma:** `confirm(): void` — [quotation-sale-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-sale-modal/quotation-sale-modal.component.ts#L72) (L72–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.preview`, `this.saving`, `this.saving.set`, `this.error.set`, `this.service.confirmSale(preview.quotation.id).subscribe`, `this.service.confirmSale`, `this.notifications.success`, `this.units`, `this.sold.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.saving.set`, `this.error.set`; Emite eventos: `this.sold.emit`
- **Consumidores:** [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts), [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts), `quotation-sale-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-void-reason-modal-quotation-void-reason-modal-component-ts"></a>

### quotation-void-reason-modal.component.ts

- **Ruta:** [quotation-void-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.ts`, 53 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-quotations`
- **Responsabilidad:** Small, dedicated reason-collection modal — `ConfirmDialogService` only supports a fixed title/message, no free-text input, so anular (which needs a mandatory reason, same as the backend's `VoidQuotationRequestDto`) can't reuse it.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts), [quotation-history-tab.component.ts (plantilla)](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts) (plantilla)
- **Plantilla:** [quotation-void-reason-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(ngModelChange)="reason.set($event)"`, `(click)="cancel()"`, `(click)="confirm()"`

#### Clase `QuotationVoidReasonModalComponent` (L15–52)

- **Decoradores:** `@Component({ selector: 'app-quotation-void-reason-modal', standalone: true, imports: [FormsModule, IconComponent, ButtonComponent], templateUrl: './quotation-voi`
- **Propósito:** Small, dedicated reason-collection modal — `ConfirmDialogService` only supports a fixed title/message, no free-text input, so anular (which needs a mandatory reason, same as the backend's `VoidQuotationRequestDto`) can't reuse it. A small, deliberate copy of Tickets' own `VoidReasonModalComponent` (same convention as that component's own doc comment) rather than a shared one, since the label text genuinely differs ("cotización" vs "ticket"). Dumb — the parent owns the actual `voidQuotation()` call.
- **Datos / estado que administra:** `@Input open = false`, `@Input quotationNumber = ''`, `@Input title = 'Anular cotización'`, `@Input description = 'Esta acción no se puede deshacer. La cotización p`, `@Input confirmText = 'Anular cotización'`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isValid` | getter public | 36–38 | — | `boolean` |
| `confirm` | método public | 40–46 | — | `void` |
| `cancel` | método public | 48–51 | — | `void` |

##### `QuotationVoidReasonModalComponent.isValid`

- **Firma:** `isValid(): boolean` — [quotation-void-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuotationVoidReasonModalComponent.confirm`

- **Firma:** `confirm(): void` — [quotation-void-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.ts#L40) (L40–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`, `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.confirmed.emit`
- **Consumidores:** [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts), [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts), `quotation-void-reason-modal.component.html` (plantilla)

##### `QuotationVoidReasonModalComponent.cancel`

- **Firma:** `cancel(): void` — [quotation-void-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-void-reason-modal/quotation-void-reason-modal.component.ts#L48) (L48–51)
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

<a id="f-comercial-jhoel-app-src-app-features-dashboard-quotations-quotations-spec-ts"></a>

### quotations.spec.ts

- **Ruta:** [quotations.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/quotations.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/quotations/quotations.spec.ts`, 77 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-quotations`
- **Responsabilidad:** Prueba unitaria: declara `preview`, `quotation` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [quotations.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-quotations-service-ts), [create-quotation-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts), [quotation-sale-modal.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-sale-modal-quotation-sale-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** —
#### Función `preview` (L14–20)

- **Tipo:** función local del archivo
- **Firma:** `preview(available: number): QuotationSalePreview` — [quotations.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/quotations.spec.ts#L14)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

