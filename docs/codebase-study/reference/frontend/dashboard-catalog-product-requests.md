# Frontend `dashboard-catalog-product-requests`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [catalog-product-requests-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-catalog-product-requests-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Solicitudes de Variedades" — leads de "Lo quiero" capturados en la landing pública (sección Variedades y Accesorios). | 7 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [catalog-product-request-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-components-catalog-product-request-detail-modal-catalog-product-request-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Igual convención que `ContactService`'s propio `digitsOnly` — un enlace `wa.me` necesita un string numérico limpio. | 5 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [catalog-product-request-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-components-catalog-product-request-table-catalog-product-request-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CatalogProductRequestTableComponent`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [catalog-product-requests-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/catalog-product-requests-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-product-requests-page.component.ts`; usa 5 componentes hijos: `app-page-header`, `app-card`, `app-summary-tile`, `app-catalog-product-request-table`, `app-catalog-product-request-detail-modal`. | — | — | Media |
| [catalog-product-requests-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/catalog-product-requests-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-product-request-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-product-request-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [catalog-product-request-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-product-request-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-table/catalog-product-request-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-product-request-table.component.ts`; usa 3 componentes hijos: `app-empty-state`, `app-badge`, `app-icon`. | — | — | Media |
| [catalog-product-request-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-table/catalog-product-request-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-catalog-product-requests-page-component-ts"></a>

### catalog-product-requests-page.component.ts

- **Ruta:** [catalog-product-requests-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/catalog-product-requests-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/catalog-product-requests-page.component.ts`, 88 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-product-requests`
- **Responsabilidad:** "Solicitudes de Variedades" — leads de "Lo quiero" capturados en la landing pública (sección Variedades y Accesorios).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [catalog-product-request.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-product-request-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [catalog-product-request-table.component.ts](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-components-catalog-product-request-table-catalog-product-request-table-component-ts), [catalog-product-request-detail-modal.component.ts](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-components-catalog-product-request-detail-modal-catalog-product-request-detail-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [catalog-product-requests-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/catalog-product-requests-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts), [catalog-product-request-table.component.ts](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-components-catalog-product-request-table-catalog-product-request-table-component-ts), [catalog-product-request-detail-modal.component.ts](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-components-catalog-product-request-detail-modal-catalog-product-request-detail-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="statusFilter.set('all')"`, `(click)="statusFilter.set('NUEVA')"`, `(click)="statusFilter.set('CONTACTADA')"`, `(click)="statusFilter.set('EN_PROCESO')"`, `(click)="statusFilter.set('ATENDIDA')"`, `(click)="statusFilter.set('CANCELADA')"`, `(viewDetail)="openDetail($event)"`, `(closed)="closeDetail()"`, `(updated)="onRequestUpdated($event)"`

**Interfaces, tipos y enums:**

- `type StatusFilterValue` (L12) = `CatalogProductRequestStatus \| 'all'`

#### Clase `CatalogProductRequestsPageComponent` (L22–87)

- **Decoradores:** `@Component({ selector: 'app-catalog-product-requests-page', standalone: true, imports: [ PageHeaderComponent, CardComponent, SummaryTileComponent, CatalogProduct`
- **Propósito:** "Solicitudes de Variedades" — leads de "Lo quiero" capturados en la landing pública (sección Variedades y Accesorios). Librería nunca genera filas aquí (sección puramente informativa). Admin-only, ya `adminGuard`-gated (el backend también restringe todo `CatalogProductRequestsController` a ADMIN/SUPER_ADMIN). Deliberadamente sin nada de Krediya/crédito — exclusivo de Teléfonos.
- **Servicios inyectados con `inject()`:** `catalogProductRequestService = inject(CatalogProductRequestService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `requests = signal<CatalogProductRequest[]>([])`, `loading = signal(true)`, `statusFilter = signal<StatusFilterValue>('all')`, `selectedRequest = signal<CatalogProductRequest \| null>(null)`, `filteredRequests = computed(() => { const status = this.statusFilter(`, `newCount = computed(() => this.requests().filter((r) => r.sta`, `inProgressCount = computed( () => this.requests().filter((r) => r.st`, `attendedCount = computed(() => this.requests().filter((r) => r.sta`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchRequests` | método public | 61–73 | — | `void` |
| `openDetail` | método public | 75–77 | `request: CatalogProductRequest` | `void` |
| `closeDetail` | método public | 79–81 | — | `void` |
| `onRequestUpdated` | método public | 83–86 | `request: CatalogProductRequest` | `void` |

##### `CatalogProductRequestsPageComponent.fetchRequests`

- **Firma:** `fetchRequests(): void` — [catalog-product-requests-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/catalog-product-requests-page.component.ts#L61) (L61–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.catalogProductRequestService.getRequests().subscribe`, `this.catalogProductRequestService.getRequests`, `this.requests.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.requests.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequestsPageComponent.openDetail`

- **Firma:** `openDetail(request: CatalogProductRequest): void` — [catalog-product-requests-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/catalog-product-requests-page.component.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedRequest.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedRequest.set`
- **Consumidores:** `catalog-product-requests-page.component.html` (plantilla)

##### `CatalogProductRequestsPageComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [catalog-product-requests-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/catalog-product-requests-page.component.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedRequest.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedRequest.set`
- **Consumidores:** `catalog-product-requests-page.component.html` (plantilla)

##### `CatalogProductRequestsPageComponent.onRequestUpdated`

- **Firma:** `onRequestUpdated(request: CatalogProductRequest): void` — [catalog-product-requests-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/catalog-product-requests-page.component.ts#L83) (L83–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedRequest.set`, `this.requests.update`, `list.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedRequest.set`, `this.requests.update`
- **Consumidores:** `catalog-product-requests-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-components-catalog-product-request-detail-modal-catalog-product-request-detail-modal-component-ts"></a>

### catalog-product-request-detail-modal.component.ts

- **Ruta:** [catalog-product-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.ts`, 107 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-product-requests`
- **Responsabilidad:** Igual convención que `ContactService`'s propio `digitsOnly` — un enlace `wa.me` necesita un string numérico limpio.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [catalog-product-request.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-product-request-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [catalog-product-requests-page.component.ts](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-catalog-product-requests-page-component-ts), [catalog-product-requests-page.component.ts (plantilla)](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-catalog-product-requests-page-component-ts) (plantilla)
- **Plantilla:** [catalog-product-request-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngModelChange)="draftStatus.set($event)"`, `(ngModelChange)="draftObservation.set($event)"`, `(click)="save()"`

#### Clase `CatalogProductRequestDetailModalComponent` (L33–106)

- **Decoradores:** `@Component({ selector: 'app-catalog-product-request-detail-modal', standalone: true, imports: [DatePipe, FormsModule, ButtonComponent, IconComponent], templateUr`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `catalogProductRequestService = inject(CatalogProductRequestService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input request = null`, `@Output closed = new EventEmitter<void>()`, `@Output updated = new EventEmitter<CatalogProductRequest>()`, `draftStatus = signal<CatalogProductRequestStatus>('NUEVA')`, `draftObservation = signal('')`, `isSaving = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 57–59 | — | `boolean` |
| `whatsappHref` | getter public | 61–68 | — | `string \| null` |
| `ngOnChanges` | método public | 70–76 | `changes: SimpleChanges` | `void` |
| `save` | método public | 78–101 | — | `void` |
| `close` | método public | 103–105 | — | `void` |

##### `CatalogProductRequestDetailModalComponent.open`

- **Firma:** `open(): boolean` — [catalog-product-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequestDetailModalComponent.whatsappHref`

- **Firma:** `whatsappHref(): string \| null` — [catalog-product-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.ts#L61) (L61–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `digitsOnly`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequestDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [catalog-product-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.ts#L70) (L70–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStatus.set`, `this.draftObservation.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftStatus.set`, `this.draftObservation.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequestDetailModalComponent.save`

- **Firma:** `save(): void` — [catalog-product-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.ts#L78) (L78–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.isSaving.set`, `this.catalogProductRequestService.updateStatus`, `this.draftStatus`, `this.draftObservation().trim`, `this.draftObservation`, `this.notificationService.success`, `this.updated.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`; Emite eventos: `this.updated.emit`
- **Consumidores:** `catalog-product-request-detail-modal.component.html` (plantilla)

##### `CatalogProductRequestDetailModalComponent.close`

- **Firma:** `close(): void` — [catalog-product-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.ts#L103) (L103–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `catalog-product-request-detail-modal.component.html` (plantilla)

#### Función `digitsOnly` (L29–31)

- **Tipo:** función local del archivo
- **Firma:** `digitsOnly(value: string): string` — [catalog-product-request-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.ts#L29)
- **Propósito / descripción:** Igual convención que `ContactService`'s propio `digitsOnly` — un enlace `wa.me` necesita un string numérico limpio.
- **Dependencias:** `value.replace`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-components-catalog-product-request-table-catalog-product-request-table-component-ts"></a>

### catalog-product-request-table.component.ts

- **Ruta:** [catalog-product-request-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-table/catalog-product-request-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-table/catalog-product-request-table.component.ts`, 35 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-product-requests`
- **Responsabilidad:** Componente Angular: declara `CatalogProductRequestTableComponent`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [catalog-product-requests-page.component.ts](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-catalog-product-requests-page-component-ts), [catalog-product-requests-page.component.ts (plantilla)](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-catalog-product-requests-page-component-ts) (plantilla)
- **Plantilla:** [catalog-product-request-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-table/catalog-product-request-table.component.html) · **Usa componentes:** [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="viewDetail.emit(request)"`

#### Clase `CatalogProductRequestTableComponent` (L13–34)

- **Decoradores:** `@Component({ selector: 'app-catalog-product-request-table', standalone: true, imports: [DatePipe, BadgeComponent, IconComponent, EmptyStateComponent], templateUr`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input requests = []`, `@Input loading = false`, `@Output viewDetail = new EventEmitter<CatalogProductRequest>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `formatPrice` | método public | 31–33 | `price: number` | `string` |

##### `CatalogProductRequestTableComponent.formatPrice`

- **Firma:** `formatPrice(price: number): string` — [catalog-product-request-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-table/catalog-product-request-table.component.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `price.toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-product-request-table.component.html` (plantilla)

