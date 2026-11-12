# Frontend `dashboard-tickets`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [create-ticket-tab.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-create-ticket-tab-create-ticket-tab-component-ts) | .ts | Componente Angular | Feature (pantalla) | A Ticket is explicitly NOT a real sale — the cart here is pure local component state (never a server-side draft/reservation the way Ventas' receipt is), since a ticket never reserves or affects inventory and has nothing to protect against a race. | 8 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [ticket-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-detail-modal-ticket-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Read-only line-item detail for one ticket — reached from Historial's "Ver detalle" action. | 3 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [ticket-history-tab.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-history-tab-ticket-history-tab-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `TicketHistoryTabComponent`, `PAGE_LIMIT`, `DEFAULT_FILTERS` (sin comentario de documentación en el código). | 10 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [ticket-product-search.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-product-search-ticket-product-search-component-ts) | .ts | Componente Angular | Feature (pantalla) | Own small copy of Ventas' `ProductSearchComponent` — this app's established convention (see that component's own doc note) is a per-feature copy over a shared one once the semantics diverge. | 3 internas; ext.: @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [void-reason-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-void-reason-modal-void-reason-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Small, dedicated reason-collection modal — `ConfirmDialogService` only supports a fixed title/message, no free-text input, so anular (which needs a mandatory reason, same as the backend's `VoidTicketRequestDto`) can't reuse it. | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [tickets-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-tickets-tickets-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | `Tickets` — a receipt that is explicitly NOT a real sale: it never decrements/reserves inventory, never appears in Ventas' reports or the dashboard, and needs no confirmation before generating its PDF (unlike Ventas/Compras' own post-save PDF prompt). | 3 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [create-ticket-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `create-ticket-tab.component.ts`; usa 4 componentes hijos: `app-ticket-product-search`, `app-empty-state`, `app-icon`, `app-button`. | — | — | Media |
| [create-ticket-tab.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ticket-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-detail-modal/ticket-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ticket-detail-modal.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [ticket-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-detail-modal/ticket-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ticket-history-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ticket-history-tab.component.ts`; usa 7 componentes hijos: `app-icon`, `app-button`, `app-empty-state`, `app-badge`, `app-report-pagination`, `app-ticket-detail-modal`. | — | — | Media |
| [ticket-history-tab.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [ticket-product-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-product-search/ticket-product-search.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `ticket-product-search.component.ts`; usa 2 componentes hijos: `app-icon`, `app-barcode-scanner-modal`. | — | — | Media |
| [ticket-product-search.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-product-search/ticket-product-search.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [void-reason-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/void-reason-modal/void-reason-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `void-reason-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [void-reason-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/void-reason-modal/void-reason-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [tickets-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/tickets-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `tickets-page.component.ts`; usa 3 componentes hijos: `app-page-header`, `app-create-ticket-tab`, `app-ticket-history-tab`. | — | — | Media |
| [tickets-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/tickets-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-create-ticket-tab-create-ticket-tab-component-ts"></a>

### create-ticket-tab.component.ts

- **Ruta:** [create-ticket-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.ts`, 162 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-tickets`
- **Responsabilidad:** A Ticket is explicitly NOT a real sale — the cart here is pure local component state (never a server-side draft/reservation the way Ventas' receipt is), since a ticket never reserves or affects inventory and has nothing to protect against a race.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [tickets.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-tickets-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [ticket-product-search.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-product-search-ticket-product-search-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [tickets-page.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-tickets-page-component-ts), [tickets-page.component.ts (plantilla)](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-tickets-page-component-ts) (plantilla)
- **Plantilla:** [create-ticket-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.html) · **Usa componentes:** [ticket-product-search.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-product-search-ticket-product-search-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="clientName.set($event)"`, `(productSelected)="onProductSelected($event)"`, `(click)="decrement(item)"`, `(click)="increment(item)"`, `(input)="updatePrice(item.productId, $any($event.target).valueAsNumber)"`, `(click)="removeItem(item.productId)"`, `(input)="updateObservation(item.productId, $any($event.target).value)"`, `(click)="saveTicket()"`

#### Clase `CreateTicketTabComponent` (L30–161)

- **Decoradores:** `@Component({ selector: 'app-create-ticket-tab', standalone: true, imports: [FormsModule, TicketProductSearchComponent, EmptyStateComponent, IconComponent, Button`
- **Propósito:** A Ticket is explicitly NOT a real sale — the cart here is pure local component state (never a server-side draft/reservation the way Ventas' receipt is), since a ticket never reserves or affects inventory and has nothing to protect against a race. Nothing is sent to the backend until "Guardar Ticket".
- **Servicios inyectados con `inject()`:** `ticketsService = inject(TicketsService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `items = signal<TicketDraftItem[]>([])`, `clientName = signal('')`, `isSaving = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `total` | getter public | 58–60 | — | `number` |
| `onProductSelected` | método public | 62–72 | `product: Product` | `void` |
| `updateQuantity` | método public | 74–79 | `productId: string`, `quantity: number` | `void` |
| `updateObservation` | método public | 81–85 | `productId: string`, `observation: string` | `void` |
| `updatePrice` | método public | 94–99 | `productId: string`, `unitPrice: number` | `void` |
| `increment` | método public | 101–103 | `item: TicketDraftItem` | `void` |
| `decrement` | método public | 105–107 | `item: TicketDraftItem` | `void` |
| `removeItem` | método public | 109–111 | `productId: string` | `void` |
| `saveTicket` | método public async | 113–160 | — | `Promise<void>` |

##### `CreateTicketTabComponent.total`

- **Firma:** `total(): number` — [create-ticket-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `calculateTicketDraftTotal`, `this.items`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateTicketTabComponent.onProductSelected`

- **Firma:** `onProductSelected(product: Product): void` — [create-ticket-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.ts#L62) (L62–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items().find`, `this.items`, `this.updateQuantity`, `this.items.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** `create-ticket-tab.component.html` (plantilla)

##### `CreateTicketTabComponent.updateQuantity`

- **Firma:** `updateQuantity(productId: string, quantity: number): void` — [create-ticket-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.ts#L74) (L74–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.max`, `this.items.update`, `items.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** (mismo archivo)

##### `CreateTicketTabComponent.updateObservation`

- **Firma:** `updateObservation(productId: string, observation: string): void` — [create-ticket-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.ts#L81) (L81–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.update`, `items.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** `create-ticket-tab.component.html` (plantilla)

##### `CreateTicketTabComponent.updatePrice`

- **Firma:** `updatePrice(productId: string, unitPrice: number): void` — [create-ticket-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.ts#L94) (L94–99)
- **Propósito / descripción:** Manual price override for this line, shown pre-filled with the product's real current price. Only ever changes what's saved on this ticket's own `ticket_details.unit_price` snapshot — never the product's real price in the database (the backend never writes to `products` from `create_ticket` regardless of what's sent here).
- **Dependencias (llamadas en su cuerpo):** `Number.isFinite`, `Math.max`, `this.items.update`, `items.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** `create-ticket-tab.component.html` (plantilla)

##### `CreateTicketTabComponent.increment`

- **Firma:** `increment(item: TicketDraftItem): void` — [create-ticket-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.ts#L101) (L101–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `create-ticket-tab.component.html` (plantilla)

##### `CreateTicketTabComponent.decrement`

- **Firma:** `decrement(item: TicketDraftItem): void` — [create-ticket-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.ts#L105) (L105–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `create-ticket-tab.component.html` (plantilla)

##### `CreateTicketTabComponent.removeItem`

- **Firma:** `removeItem(productId: string): void` — [create-ticket-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.ts#L109) (L109–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.update`, `items.filter`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** `create-ticket-tab.component.html` (plantilla)

##### `CreateTicketTabComponent.saveTicket`

- **Firma:** `saveTicket(): Promise<void>` — [create-ticket-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/create-ticket-tab/create-ticket-tab.component.ts#L113) (L113–160)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items`, `this.isSaving`, `this.confirmDialogService.confirm`, `this.isSaving.set`, `this.items().map`, `item.observation.trim`, `this.clientName().trim`, `this.clientName`, `this.ticketsService.createTicket({ clientName, items }).subscribe`, `this.ticketsService.createTicket`, `this.notificationService.success`, `this.items.set`, `this.clientName.set`, `this.ticketsService.exportTicketPdf(ticket.id).subscribe`, `this.ticketsService.exportTicketPdf`, `downloadBlob`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.items.set`, `this.clientName.set`
- **Consumidores:** `create-ticket-tab.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-detail-modal-ticket-detail-modal-component-ts"></a>

### ticket-detail-modal.component.ts

- **Ruta:** [ticket-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-detail-modal/ticket-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-detail-modal/ticket-detail-modal.component.ts`, 49 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-tickets`
- **Responsabilidad:** Read-only line-item detail for one ticket — reached from Historial's "Ver detalle" action.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [tickets.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-tickets-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [ticket-history-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-history-tab-ticket-history-tab-component-ts), [ticket-history-tab.component.ts (plantilla)](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-history-tab-ticket-history-tab-component-ts) (plantilla)
- **Plantilla:** [ticket-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-detail-modal/ticket-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`

#### Clase `TicketDetailModalComponent` (L9–48)

- **Decoradores:** `@Component({ selector: 'app-ticket-detail-modal', standalone: true, imports: [DatePipe, IconComponent], templateUrl: './ticket-detail-modal.component.html', styl`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Read-only line-item detail for one ticket — reached from Historial's "Ver detalle" action.
- **Servicios inyectados con `inject()`:** `ticketsService = inject(TicketsService)`
- **Datos / estado que administra:** `@Input ticketId = null`, `@Output closed = new EventEmitter<void>()`, `ticket = signal<Ticket \| null>(null)`, `loading = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 28–43 | — | `void` |
| `close` | método public | 45–47 | — | `void` |

##### `TicketDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [ticket-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-detail-modal/ticket-detail-modal.component.ts#L28) (L28–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.ticket.set`, `this.loading.set`, `this.ticketsService.getTicketById(this.ticketId).subscribe`, `this.ticketsService.getTicketById`
- **Efectos secundarios:** Actualiza estado (signals): `this.ticket.set`, `this.loading.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TicketDetailModalComponent.close`

- **Firma:** `close(): void` — [ticket-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-detail-modal/ticket-detail-modal.component.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `ticket-detail-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-history-tab-ticket-history-tab-component-ts"></a>

### ticket-history-tab.component.ts

- **Ruta:** [ticket-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.ts`, 186 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-tickets`
- **Responsabilidad:** Componente Angular: declara `TicketHistoryTabComponent`, `PAGE_LIMIT`, `DEFAULT_FILTERS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [tickets.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-tickets-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [ticket-detail-modal.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-detail-modal-ticket-detail-modal-component-ts), [void-reason-modal.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-void-reason-modal-void-reason-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [tickets-page.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-tickets-page-component-ts), [tickets-page.component.ts (plantilla)](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-tickets-page-component-ts) (plantilla)
- **Plantilla:** [ticket-history-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [ticket-detail-modal.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-detail-modal-ticket-detail-modal-component-ts), [void-reason-modal.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-void-reason-modal-void-reason-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="draftSearch.set($event)"`, `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(ngModelChange)="draftStatus.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(click)="viewDetail(ticket)"`, `(click)="regeneratePdf(ticket)"`, `(click)="requestVoid(ticket)"`, `(pageChange)="onPageChange($event)"`, `(closed)="closeDetail()"`, `(confirmed)="confirmVoid($event)"`, `(cancelled)="cancelVoid()"`

#### Clase `TicketHistoryTabComponent` (L25–185)

- **Decoradores:** `@Component({ selector: 'app-ticket-history-tab', standalone: true, imports: [ DatePipe, FormsModule, EmptyStateComponent, BadgeComponent, ButtonComponent, IconCo`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `ticketsService = inject(TicketsService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `tickets = signal<TicketSummary[]>([])`, `total = signal(0)`, `page = signal(1)`, `loading = signal(false)`, `draftSearch = signal(DEFAULT_FILTERS.search)`, `draftStartDate = signal(DEFAULT_FILTERS.startDate)`, `draftEndDate = signal(DEFAULT_FILTERS.endDate)`, `draftStatus = signal<TicketStatusFilter \| ''>(DEFAULT_FILTERS.st`, `search = signal(DEFAULT_FILTERS.search)`, `startDate = signal(DEFAULT_FILTERS.startDate)`, `endDate = signal(DEFAULT_FILTERS.endDate)`, `status = signal<TicketStatusFilter \| ''>(DEFAULT_FILTERS.st`, `hasActiveFilters = computed( () => this.search() !== DEFAULT_FILTERS.`, `detailTicketId = signal<string \| null>(null)`, `voidTarget = signal<TicketSummary \| null>(null)`, `generatingPdfId = signal<string \| null>(null)`, `isEmpty = computed(() => !this.loading() && this.tickets().l`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 87–109 | — | `void` |
| `applyFilters` | método public | 111–118 | — | `void` |
| `clearFilters` | método public | 120–131 | — | `void` |
| `onPageChange` | método public | 133–136 | `page: number` | `void` |
| `viewDetail` | método public | 138–140 | `ticket: TicketSummary` | `void` |
| `closeDetail` | método public | 142–144 | — | `void` |
| `regeneratePdf` | método public | 146–158 | `ticket: TicketSummary` | `void` |
| `requestVoid` | método public | 160–162 | `ticket: TicketSummary` | `void` |
| `cancelVoid` | método public | 164–166 | — | `void` |
| `confirmVoid` | método public | 168–184 | `reason: string` | `void` |

##### `TicketHistoryTabComponent.fetch`

- **Firma:** `fetch(): void` — [ticket-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.ts#L87) (L87–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.ticketsService.getTickets`, `this.page`, `this.search`, `this.startDate`, `this.endDate`, `this.status`, `this.tickets.set`, `this.total.set`, `this.notificationService.error`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.tickets.set`, `this.total.set`
- **Consumidores:** (mismo archivo)

##### `TicketHistoryTabComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [ticket-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.ts#L111) (L111–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.search.set`, `this.draftSearch().trim`, `this.draftSearch`, `this.startDate.set`, `this.draftStartDate`, `this.endDate.set`, `this.draftEndDate`, `this.status.set`, `this.draftStatus`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.search.set`, `this.startDate.set`, `this.endDate.set`, `this.status.set`, `this.page.set`
- **Consumidores:** `ticket-history-tab.component.html` (plantilla)

##### `TicketHistoryTabComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [ticket-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.ts#L120) (L120–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftSearch.set`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftStatus.set`, `this.search.set`, `this.startDate.set`, `this.endDate.set`, `this.status.set`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftSearch.set`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftStatus.set`, `this.search.set`, `this.startDate.set`
- **Consumidores:** `ticket-history-tab.component.html` (plantilla)

##### `TicketHistoryTabComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [ticket-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.ts#L133) (L133–136)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `ticket-history-tab.component.html` (plantilla)

##### `TicketHistoryTabComponent.viewDetail`

- **Firma:** `viewDetail(ticket: TicketSummary): void` — [ticket-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.ts#L138) (L138–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailTicketId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailTicketId.set`
- **Consumidores:** `ticket-history-tab.component.html` (plantilla)

##### `TicketHistoryTabComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [ticket-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.ts#L142) (L142–144)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailTicketId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailTicketId.set`
- **Consumidores:** `ticket-history-tab.component.html` (plantilla)

##### `TicketHistoryTabComponent.regeneratePdf`

- **Firma:** `regeneratePdf(ticket: TicketSummary): void` — [ticket-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.ts#L146) (L146–158)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.generatingPdfId.set`, `this.ticketsService.exportTicketPdf(ticket.id).subscribe`, `this.ticketsService.exportTicketPdf`, `downloadBlob`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.generatingPdfId.set`
- **Consumidores:** `ticket-history-tab.component.html` (plantilla)

##### `TicketHistoryTabComponent.requestVoid`

- **Firma:** `requestVoid(ticket: TicketSummary): void` — [ticket-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.ts#L160) (L160–162)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `ticket-history-tab.component.html` (plantilla)

##### `TicketHistoryTabComponent.cancelVoid`

- **Firma:** `cancelVoid(): void` — [ticket-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.ts#L164) (L164–166)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `ticket-history-tab.component.html` (plantilla)

##### `TicketHistoryTabComponent.confirmVoid`

- **Firma:** `confirmVoid(reason: string): void` — [ticket-history-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-history-tab/ticket-history-tab.component.ts#L168) (L168–184)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget`, `this.ticketsService.voidTicket(target.id, reason).subscribe`, `this.ticketsService.voidTicket`, `this.notificationService.success`, `this.voidTarget.set`, `this.fetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `ticket-history-tab.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-product-search-ticket-product-search-component-ts"></a>

### ticket-product-search.component.ts

- **Ruta:** [ticket-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-product-search/ticket-product-search.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-product-search/ticket-product-search.component.ts`, 120 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-tickets`
- **Responsabilidad:** Own small copy of Ventas' `ProductSearchComponent` — this app's established convention (see that component's own doc note) is a per-feature copy over a shared one once the semantics diverge.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [inventory.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [create-ticket-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-create-ticket-tab-create-ticket-tab-component-ts), [create-ticket-tab.component.ts (plantilla)](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-create-ticket-tab-create-ticket-tab-component-ts) (plantilla)
- **Plantilla:** [ticket-product-search.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-product-search/ticket-product-search.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [barcode-scanner-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="onInput($event)"`, `(focus)="onFocus()"`, `(blur)="onBlur()"`, `(keydown.enter)="onEnter()"`, `(click)="openScanner()"`, `(scanned)="onBarcodeScanned($event)"`, `(closed)="scannerOpen.set(false)"`, `(click)="select(product)"`

#### Clase `TicketProductSearchComponent` (L18–119)

- **Decoradores:** `@Component({ selector: 'app-ticket-product-search', standalone: true, imports: [FormsModule, IconComponent, BarcodeScannerModalComponent], templateUrl: './ticket`
- **Propósito:** Own small copy of Ventas' `ProductSearchComponent` — this app's established convention (see that component's own doc note) is a per-feature copy over a shared one once the semantics diverge. Here they diverge in one way: a Ticket isn't constrained by real inventory availability the way a Sale is (it never reserves or decrements stock), so results are never disabled for being out of stock.
- **Servicios inyectados con `inject()`:** `inventoryService = inject(InventoryService)`
- **Datos / estado que administra:** `@Output productSelected = new EventEmitter<Product>()`, `query = signal('')`, `results = signal<Product[]>([])`, `loading = signal(false)`, `open = signal(false)`, `hasSearched = signal(false)`, `scannerOpen = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onInput` | método public | 65–73 | `value: string` | `void` |
| `onFocus` | método public | 75–79 | — | `void` |
| `onBlur` | método public | 81–83 | — | `void` |
| `select` | método public | 85–91 | `product: Product` | `void` |
| `onEnter` | método public | 93–98 | — | `void` |
| `openScanner` | método public | 100–102 | — | `void` |
| `onBarcodeScanned` | método public | 104–118 | `code: string` | `void` |

##### `TicketProductSearchComponent.onInput`

- **Firma:** `onInput(value: string): void` — [ticket-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-product-search/ticket-product-search.component.ts#L65) (L65–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.open.set`, `this.query$.next`, `value.trim`, `this.results.set`, `this.hasSearched.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.open.set`, `this.results.set`, `this.hasSearched.set`
- **Consumidores:** `ticket-product-search.component.html` (plantilla)

##### `TicketProductSearchComponent.onFocus`

- **Firma:** `onFocus(): void` — [ticket-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-product-search/ticket-product-search.component.ts#L75) (L75–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results`, `this.hasSearched`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `ticket-product-search.component.html` (plantilla)

##### `TicketProductSearchComponent.onBlur`

- **Firma:** `onBlur(): void` — [ticket-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-product-search/ticket-product-search.component.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `setTimeout`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `ticket-product-search.component.html` (plantilla)

##### `TicketProductSearchComponent.select`

- **Firma:** `select(product: Product): void` — [ticket-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-product-search/ticket-product-search.component.ts#L85) (L85–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productSelected.emit`, `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.results.set`, `this.hasSearched.set`, `this.open.set`; Emite eventos: `this.productSelected.emit`
- **Consumidores:** `ticket-product-search.component.html` (plantilla), (mismo archivo)

##### `TicketProductSearchComponent.onEnter`

- **Firma:** `onEnter(): void` — [ticket-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-product-search/ticket-product-search.component.ts#L93) (L93–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.results`, `this.select`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `ticket-product-search.component.html` (plantilla), (mismo archivo)

##### `TicketProductSearchComponent.openScanner`

- **Firma:** `openScanner(): void` — [ticket-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-product-search/ticket-product-search.component.ts#L100) (L100–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`
- **Consumidores:** `ticket-product-search.component.html` (plantilla)

##### `TicketProductSearchComponent.onBarcodeScanned`

- **Firma:** `onBarcodeScanned(code: string): void` — [ticket-product-search.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/ticket-product-search/ticket-product-search.component.ts#L104) (L104–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scannerOpen.set`, `this.query.set`, `this.open.set`, `this.loading.set`, `this.inventoryService.searchProducts(code).pipe`, `this.inventoryService.searchProducts`, `catchError`, `of`, `this.hasSearched.set`, `this.results.set`, `this.onEnter`
- **Efectos secundarios:** Actualiza estado (signals): `this.scannerOpen.set`, `this.query.set`, `this.open.set`, `this.loading.set`, `this.hasSearched.set`, `this.results.set`
- **Consumidores:** `ticket-product-search.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-void-reason-modal-void-reason-modal-component-ts"></a>

### void-reason-modal.component.ts

- **Ruta:** [void-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/void-reason-modal/void-reason-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/tickets/components/void-reason-modal/void-reason-modal.component.ts`, 46 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-tickets`
- **Responsabilidad:** Small, dedicated reason-collection modal — `ConfirmDialogService` only supports a fixed title/message, no free-text input, so anular (which needs a mandatory reason, same as the backend's `VoidTicketRequestDto`) can't reuse it.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [ticket-history-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-history-tab-ticket-history-tab-component-ts), [ticket-history-tab.component.ts (plantilla)](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-history-tab-ticket-history-tab-component-ts) (plantilla)
- **Plantilla:** [void-reason-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/void-reason-modal/void-reason-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(ngModelChange)="reason.set($event)"`, `(click)="cancel()"`, `(click)="confirm()"`

#### Clase `VoidReasonModalComponent` (L13–45)

- **Decoradores:** `@Component({ selector: 'app-void-reason-modal', standalone: true, imports: [FormsModule, IconComponent, ButtonComponent], templateUrl: './void-reason-modal.compo`
- **Propósito:** Small, dedicated reason-collection modal — `ConfirmDialogService` only supports a fixed title/message, no free-text input, so anular (which needs a mandatory reason, same as the backend's `VoidTicketRequestDto`) can't reuse it. Dumb, like `SaveConfirmModalComponent`/`FinalBalanceConfirmModalComponent` elsewhere in this app — the parent owns the actual `voidTicket()` call.
- **Datos / estado que administra:** `@Input open = false`, `@Input ticketNumber = ''`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isValid` | getter public | 29–31 | — | `boolean` |
| `confirm` | método public | 33–39 | — | `void` |
| `cancel` | método public | 41–44 | — | `void` |

##### `VoidReasonModalComponent.isValid`

- **Firma:** `isValid(): boolean` — [void-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/void-reason-modal/void-reason-modal.component.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `VoidReasonModalComponent.confirm`

- **Firma:** `confirm(): void` — [void-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/void-reason-modal/void-reason-modal.component.ts#L33) (L33–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`, `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.confirmed.emit`
- **Consumidores:** `void-reason-modal.component.html` (plantilla)

##### `VoidReasonModalComponent.cancel`

- **Firma:** `cancel(): void` — [void-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/components/void-reason-modal/void-reason-modal.component.ts#L41) (L41–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `void-reason-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-tickets-tickets-page-component-ts"></a>

### tickets-page.component.ts

- **Ruta:** [tickets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/tickets-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/tickets/tickets-page.component.ts`, 31 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-tickets`
- **Responsabilidad:** `Tickets` — a receipt that is explicitly NOT a real sale: it never decrements/reserves inventory, never appears in Ventas' reports or the dashboard, and needs no confirmation before generating its PDF (unlike Ventas/Compras' own post-save PDF prompt).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [create-ticket-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-create-ticket-tab-create-ticket-tab-component-ts), [ticket-history-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-history-tab-ticket-history-tab-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [tickets-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/tickets-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [create-ticket-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-create-ticket-tab-create-ticket-tab-component-ts), [ticket-history-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-history-tab-ticket-history-tab-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="selectTab('crear')"`, `(click)="selectTab('historial')"`

**Interfaces, tipos y enums:**

- `type TabValue` (L7) = `'crear' \| 'historial'`

#### Clase `TicketsPageComponent` (L16–30)

- **Decoradores:** `@Component({ selector: 'app-tickets-page', standalone: true, imports: [PageHeaderComponent, CreateTicketTabComponent, TicketHistoryTabComponent], templateUrl: '.`
- **Propósito:** `Tickets` — a receipt that is explicitly NOT a real sale: it never decrements/reserves inventory, never appears in Ventas' reports or the dashboard, and needs no confirmation before generating its PDF (unlike Ventas/Compras' own post-save PDF prompt). See the backend's own `create_ticket` function for the structural guarantee.
- **Datos / estado que administra:** `activeTab = signal<TabValue>('crear')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `selectTab` | método public | 27–29 | `tab: TabValue` | `void` |

##### `TicketsPageComponent.selectTab`

- **Firma:** `selectTab(tab: TabValue): void` — [tickets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/tickets/tickets-page.component.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.activeTab.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.activeTab.set`
- **Consumidores:** `tickets-page.component.html` (plantilla)

