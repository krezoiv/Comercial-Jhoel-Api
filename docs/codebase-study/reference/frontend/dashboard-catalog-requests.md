# Frontend `dashboard-catalog-requests`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [catalog-requests-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-catalog-requests-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Catálogo → Solicitudes" — leads de interés/crédito capturados en la landing pública ("Lo quiero" / "Comprar a crédito con Krediya"). | 7 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [catalog-request-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-components-catalog-request-detail-modal-catalog-request-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Igual convención que `ContactService`'s propio `digitsOnly` — un enlace `wa.me`/`tel:` necesita un string numérico limpio. | 5 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [catalog-request-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-components-catalog-request-table-catalog-request-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CatalogRequestTableComponent`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [catalog-requests-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/catalog-requests-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-requests-page.component.ts`; usa 5 componentes hijos: `app-page-header`, `app-card`, `app-summary-tile`, `app-catalog-request-table`, `app-catalog-request-detail-modal`. | — | — | Media |
| [catalog-requests-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/catalog-requests-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-request-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-detail-modal/catalog-request-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-request-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [catalog-request-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-detail-modal/catalog-request-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-request-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-table/catalog-request-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-request-table.component.ts`; usa 3 componentes hijos: `app-empty-state`, `app-icon`, `app-badge`. | — | — | Media |
| [catalog-request-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-table/catalog-request-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-catalog-requests-page-component-ts"></a>

### catalog-requests-page.component.ts

- **Ruta:** [catalog-requests-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/catalog-requests-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-requests/catalog-requests-page.component.ts`, 86 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-requests`
- **Responsabilidad:** "Catálogo → Solicitudes" — leads de interés/crédito capturados en la landing pública ("Lo quiero" / "Comprar a crédito con Krediya").
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [catalog-request.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-request-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [catalog-request-table.component.ts](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-components-catalog-request-table-catalog-request-table-component-ts), [catalog-request-detail-modal.component.ts](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-components-catalog-request-detail-modal-catalog-request-detail-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [catalog-requests-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/catalog-requests-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts), [catalog-request-table.component.ts](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-components-catalog-request-table-catalog-request-table-component-ts), [catalog-request-detail-modal.component.ts](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-components-catalog-request-detail-modal-catalog-request-detail-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="statusFilter.set('all')"`, `(click)="statusFilter.set('NUEVA')"`, `(click)="statusFilter.set('CONTACTADA')"`, `(click)="statusFilter.set('EN_PROCESO')"`, `(click)="statusFilter.set('ATENDIDA')"`, `(click)="statusFilter.set('CANCELADA')"`, `(viewDetail)="openDetail($event)"`, `(closed)="closeDetail()"`, `(updated)="onRequestUpdated($event)"`

**Interfaces, tipos y enums:**

- `type StatusFilterValue` (L12) = `CatalogRequestStatus \| 'all'`

#### Clase `CatalogRequestsPageComponent` (L20–85)

- **Decoradores:** `@Component({ selector: 'app-catalog-requests-page', standalone: true, imports: [ PageHeaderComponent, CardComponent, SummaryTileComponent, CatalogRequestTableCom`
- **Propósito:** "Catálogo → Solicitudes" — leads de interés/crédito capturados en la landing pública ("Lo quiero" / "Comprar a crédito con Krediya"). Admin-only, ya `adminGuard`-gated en `app.routes.ts` (el backend también restringe todo `CatalogRequestsController` a ADMIN/SUPER_ADMIN).
- **Servicios inyectados con `inject()`:** `catalogRequestService = inject(CatalogRequestService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `requests = signal<CatalogRequest[]>([])`, `loading = signal(true)`, `statusFilter = signal<StatusFilterValue>('all')`, `selectedRequest = signal<CatalogRequest \| null>(null)`, `filteredRequests = computed(() => { const status = this.statusFilter(`, `newCount = computed(() => this.requests().filter((r) => r.sta`, `inProgressCount = computed( () => this.requests().filter((r) => r.st`, `attendedCount = computed(() => this.requests().filter((r) => r.sta`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchRequests` | método public | 59–71 | — | `void` |
| `openDetail` | método public | 73–75 | `request: CatalogRequest` | `void` |
| `closeDetail` | método public | 77–79 | — | `void` |
| `onRequestUpdated` | método public | 81–84 | `request: CatalogRequest` | `void` |

##### `CatalogRequestsPageComponent.fetchRequests`

- **Firma:** `fetchRequests(): void` — [catalog-requests-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/catalog-requests-page.component.ts#L59) (L59–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.catalogRequestService.getRequests().subscribe`, `this.catalogRequestService.getRequests`, `this.requests.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.requests.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequestsPageComponent.openDetail`

- **Firma:** `openDetail(request: CatalogRequest): void` — [catalog-requests-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/catalog-requests-page.component.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedRequest.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedRequest.set`
- **Consumidores:** `catalog-requests-page.component.html` (plantilla)

##### `CatalogRequestsPageComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [catalog-requests-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/catalog-requests-page.component.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedRequest.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedRequest.set`
- **Consumidores:** `catalog-requests-page.component.html` (plantilla)

##### `CatalogRequestsPageComponent.onRequestUpdated`

- **Firma:** `onRequestUpdated(request: CatalogRequest): void` — [catalog-requests-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/catalog-requests-page.component.ts#L81) (L81–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedRequest.set`, `this.requests.update`, `list.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedRequest.set`, `this.requests.update`
- **Consumidores:** `catalog-requests-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-components-catalog-request-detail-modal-catalog-request-detail-modal-component-ts"></a>

### catalog-request-detail-modal.component.ts

- **Ruta:** [catalog-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-detail-modal/catalog-request-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-detail-modal/catalog-request-detail-modal.component.ts`, 99 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-requests`
- **Responsabilidad:** Igual convención que `ContactService`'s propio `digitsOnly` — un enlace `wa.me`/`tel:` necesita un string numérico limpio.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [catalog-request.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-request-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [catalog-requests-page.component.ts](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-catalog-requests-page-component-ts), [catalog-requests-page.component.ts (plantilla)](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-catalog-requests-page-component-ts) (plantilla)
- **Plantilla:** [catalog-request-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-detail-modal/catalog-request-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngModelChange)="draftStatus.set($event)"`, `(ngModelChange)="draftObservation.set($event)"`, `(click)="save()"`

#### Clase `CatalogRequestDetailModalComponent` (L24–98)

- **Decoradores:** `@Component({ selector: 'app-catalog-request-detail-modal', standalone: true, imports: [DatePipe, FormsModule, ButtonComponent, IconComponent], templateUrl: './ca`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `catalogRequestService = inject(CatalogRequestService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input request = null`, `@Output closed = new EventEmitter<void>()`, `@Output updated = new EventEmitter<CatalogRequest>()`, `draftStatus = signal<CatalogRequestStatus>('NUEVA')`, `draftObservation = signal('')`, `isSaving = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 49–51 | — | `boolean` |
| `whatsappHref` | getter public | 53–60 | — | `string \| null` |
| `ngOnChanges` | método public | 62–68 | `changes: SimpleChanges` | `void` |
| `save` | método public | 70–93 | — | `void` |
| `close` | método public | 95–97 | — | `void` |

##### `CatalogRequestDetailModalComponent.open`

- **Firma:** `open(): boolean` — [catalog-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-detail-modal/catalog-request-detail-modal.component.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequestDetailModalComponent.whatsappHref`

- **Firma:** `whatsappHref(): string \| null` — [catalog-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-detail-modal/catalog-request-detail-modal.component.ts#L53) (L53–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `digitsOnly`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequestDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [catalog-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-detail-modal/catalog-request-detail-modal.component.ts#L62) (L62–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStatus.set`, `this.draftObservation.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftStatus.set`, `this.draftObservation.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequestDetailModalComponent.save`

- **Firma:** `save(): void` — [catalog-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-detail-modal/catalog-request-detail-modal.component.ts#L70) (L70–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.isSaving.set`, `this.catalogRequestService.updateStatus`, `this.draftStatus`, `this.draftObservation().trim`, `this.draftObservation`, `this.notificationService.success`, `this.updated.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`; Emite eventos: `this.updated.emit`
- **Consumidores:** `catalog-request-detail-modal.component.html` (plantilla)

##### `CatalogRequestDetailModalComponent.close`

- **Firma:** `close(): void` — [catalog-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-detail-modal/catalog-request-detail-modal.component.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `catalog-request-detail-modal.component.html` (plantilla)

#### Función `digitsOnly` (L20–22)

- **Tipo:** función local del archivo
- **Firma:** `digitsOnly(value: string): string` — [catalog-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-detail-modal/catalog-request-detail-modal.component.ts#L20)
- **Propósito / descripción:** Igual convención que `ContactService`'s propio `digitsOnly` — un enlace `wa.me`/`tel:` necesita un string numérico limpio.
- **Dependencias:** `value.replace`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-components-catalog-request-table-catalog-request-table-component-ts"></a>

### catalog-request-table.component.ts

- **Ruta:** [catalog-request-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-table/catalog-request-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-table/catalog-request-table.component.ts`, 37 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-requests`
- **Responsabilidad:** Componente Angular: declara `CatalogRequestTableComponent`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [catalog-requests-page.component.ts](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-catalog-requests-page-component-ts), [catalog-requests-page.component.ts (plantilla)](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-catalog-requests-page-component-ts) (plantilla)
- **Plantilla:** [catalog-request-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-table/catalog-request-table.component.html) · **Usa componentes:** [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="viewDetail.emit(request)"`

#### Clase `CatalogRequestTableComponent` (L14–36)

- **Decoradores:** `@Component({ selector: 'app-catalog-request-table', standalone: true, imports: [DatePipe, BadgeComponent, IconComponent, EmptyStateComponent], templateUrl: './ca`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input requests = []`, `@Input loading = false`, `@Output viewDetail = new EventEmitter<CatalogRequest>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `formatPrice` | método public | 33–35 | `price: number` | `string` |

##### `CatalogRequestTableComponent.formatPrice`

- **Firma:** `formatPrice(price: number): string` — [catalog-request-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-requests/components/catalog-request-table/catalog-request-table.component.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `price.toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-request-table.component.html` (plantilla)

