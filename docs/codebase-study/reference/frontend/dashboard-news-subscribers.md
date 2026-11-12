# Frontend `dashboard-news-subscribers`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [news-subscriber-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-components-news-subscriber-detail-modal-news-subscriber-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Detalle de un suscriptor + su historial de consentimiento/preferencias (punto 13 del pedido). | 2 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [news-subscriber-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-components-news-subscriber-table-news-subscriber-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `NewsSubscriberTableComponent`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [news-subscribers-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-news-subscribers-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Sistema → Suscriptores de Noticias" — admin-only de punta a punta (expone WhatsApp/consentimiento de clientes reales). | 8 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [news-subscriber-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-detail-modal/news-subscriber-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-subscriber-detail-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-badge`, `app-button`. | — | — | Media |
| [news-subscriber-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-detail-modal/news-subscriber-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [news-subscriber-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-table/news-subscriber-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-subscriber-table.component.ts`; usa 4 componentes hijos: `app-empty-state`, `app-button`, `app-badge`, `app-icon`. | — | — | Media |
| [news-subscriber-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-table/news-subscriber-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [news-subscribers-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/news-subscribers-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-subscribers-page.component.ts`; usa 3 componentes hijos: `app-page-header`, `app-news-subscriber-table`, `app-news-subscriber-detail-modal`. | — | — | Media |
| [news-subscribers-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/news-subscribers-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-components-news-subscriber-detail-modal-news-subscriber-detail-modal-component-ts"></a>

### news-subscriber-detail-modal.component.ts

- **Ruta:** [news-subscriber-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-detail-modal/news-subscriber-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-detail-modal/news-subscriber-detail-modal.component.ts`, 68 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-news-subscribers`
- **Responsabilidad:** Detalle de un suscriptor + su historial de consentimiento/preferencias (punto 13 del pedido).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [news-subscribers-page.component.ts](dashboard-news-subscribers.md#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-news-subscribers-page-component-ts), [news-subscribers-page.component.ts (plantilla)](dashboard-news-subscribers.md#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-news-subscribers-page-component-ts) (plantilla)
- **Plantilla:** [news-subscriber-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-detail-modal/news-subscriber-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`

#### Clase `NewsSubscriberDetailModalComponent` (L17–67)

- **Decoradores:** `@Component({ selector: 'app-news-subscriber-detail-modal', standalone: true, imports: [DatePipe, BadgeComponent, ButtonComponent, IconComponent], templateUrl: '.`
- **Propósito:** Detalle de un suscriptor + su historial de consentimiento/preferencias (punto 13 del pedido). Solo lectura — activar/desactivar vive en la tabla.
- **Datos / estado que administra:** `@Input subscriber = null`, `@Output closed = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 30–32 | — | `boolean` |
| `actionLabel` | método public | 34–36 | `action: string` | `string` |
| `deviceLabel` | método public | 39–62 | `userAgent: string \| null` | `string` |
| `close` | método public | 64–66 | — | `void` |

##### `NewsSubscriberDetailModalComponent.open`

- **Firma:** `open(): boolean` — [news-subscriber-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-detail-modal/news-subscriber-detail-modal.component.ts#L30) (L30–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsSubscriberDetailModalComponent.actionLabel`

- **Firma:** `actionLabel(action: string): string` — [news-subscriber-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-detail-modal/news-subscriber-detail-modal.component.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `news-subscriber-detail-modal.component.html` (plantilla)

##### `NewsSubscriberDetailModalComponent.deviceLabel`

- **Firma:** `deviceLabel(userAgent: string \| null): string` — [news-subscriber-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-detail-modal/news-subscriber-detail-modal.component.ts#L39) (L39–62)
- **Propósito / descripción:** Etiqueta legible corta a partir del user-agent crudo — solo para mostrar "qué dispositivo es", nunca para lógica.
- **Dependencias (llamadas en su cuerpo):** `/iPhone\|iPad/.test`, `/Android/.test`, `/Macintosh/.test`, `/Windows/.test`, `/Edg\//.test`, `/Chrome\//.test`, `/Firefox\//.test`, `/Safari\//.test`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `news-subscriber-detail-modal.component.html` (plantilla)

##### `NewsSubscriberDetailModalComponent.close`

- **Firma:** `close(): void` — [news-subscriber-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-detail-modal/news-subscriber-detail-modal.component.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `news-subscriber-detail-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-components-news-subscriber-table-news-subscriber-table-component-ts"></a>

### news-subscriber-table.component.ts

- **Ruta:** [news-subscriber-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-table/news-subscriber-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-table/news-subscriber-table.component.ts`, 33 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-news-subscribers`
- **Responsabilidad:** Componente Angular: declara `NewsSubscriberTableComponent`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [news-subscribers-page.component.ts](dashboard-news-subscribers.md#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-news-subscribers-page-component-ts), [news-subscribers-page.component.ts (plantilla)](dashboard-news-subscribers.md#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-news-subscribers-page-component-ts) (plantilla)
- **Plantilla:** [news-subscriber-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-table/news-subscriber-table.component.html) · **Usa componentes:** [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="view.emit(subscriber)"`, `(click)="toggleActive.emit(subscriber)"`

#### Clase `NewsSubscriberTableComponent` (L9–32)

- **Decoradores:** `@Component({ selector: 'app-news-subscriber-table', standalone: true, imports: [DatePipe, BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], t`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input subscribers = []`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Output view = new EventEmitter<NewsSubscriber>()`, `@Output toggleActive = new EventEmitter<NewsSubscriber>()`, `@Output clearFilters = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `displayName` | método public | 29–31 | `subscriber: NewsSubscriber` | `string` |

##### `NewsSubscriberTableComponent.displayName`

- **Firma:** `displayName(subscriber: NewsSubscriber): string` — [news-subscriber-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/components/news-subscriber-table/news-subscriber-table.component.ts#L29) (L29–31)
- **Propósito / descripción:** Nombre para mostrar/aria-label — `whatsappMasked` es `null` para un suscriptor solo-push.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `news-subscriber-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-news-subscribers-page-component-ts"></a>

### news-subscribers-page.component.ts

- **Ruta:** [news-subscribers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/news-subscribers-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/news-subscribers/news-subscribers-page.component.ts`, 117 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-news-subscribers`
- **Responsabilidad:** "Sistema → Suscriptores de Noticias" — admin-only de punta a punta (expone WhatsApp/consentimiento de clientes reales).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [news-subscriber.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-news-subscriber-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [news-subscriber-table.component.ts](dashboard-news-subscribers.md#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-components-news-subscriber-table-news-subscriber-table-component-ts), [news-subscriber-detail-modal.component.ts](dashboard-news-subscribers.md#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-components-news-subscriber-detail-modal-news-subscriber-detail-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [news-subscribers-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/news-subscribers-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [news-subscriber-table.component.ts](dashboard-news-subscribers.md#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-components-news-subscriber-table-news-subscriber-table-component-ts), [news-subscriber-detail-modal.component.ts](dashboard-news-subscribers.md#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-components-news-subscriber-detail-modal-news-subscriber-detail-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="statusFilter.set(option.value)"`, `(view)="view($event)"`, `(toggleActive)="toggleActive($event)"`, `(clearFilters)="clearFilters()"`, `(closed)="closeView()"`

**Interfaces, tipos y enums:**

- `type StatusFilter` (L13) = `'all' \| 'active' \| 'inactive'`

#### Clase `NewsSubscribersPageComponent` (L21–116)

- **Decoradores:** `@Component({ selector: 'app-news-subscribers-page', standalone: true, imports: [PageHeaderComponent, NewsSubscriberTableComponent, NewsSubscriberDetailModalCompo`
- **Propósito:** "Sistema → Suscriptores de Noticias" — admin-only de punta a punta (expone WhatsApp/consentimiento de clientes reales). El número siempre llega ya enmascarado del backend — nunca se solicita ni se muestra completo aquí (punto 30 del pedido).
- **Servicios inyectados con `inject()`:** `newsSubscriberService = inject(NewsSubscriberService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `subscribers = signal<NewsSubscriber[]>([])`, `loading = signal(true)`, `statusFilter = signal<StatusFilter>('all')`, `viewingSubscriber = signal<NewsSubscriberDetail \| null>(null)`, `filteredSubscribers = computed(() => { const status = this.statusFilter(`, `hasActiveFilters = computed(() => this.statusFilter() !== 'all')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchSubscribers` | método public | 59–71 | — | `void` |
| `clearFilters` | método public | 73–75 | — | `void` |
| `view` | método public | 77–84 | `subscriber: NewsSubscriber` | `void` |
| `closeView` | método public | 86–88 | — | `void` |
| `toggleActive` | método public async | 90–115 | `subscriber: NewsSubscriber` | `Promise<void>` |

##### `NewsSubscribersPageComponent.fetchSubscribers`

- **Firma:** `fetchSubscribers(): void` — [news-subscribers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/news-subscribers-page.component.ts#L59) (L59–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.newsSubscriberService.getSubscribers(true).subscribe`, `this.newsSubscriberService.getSubscribers`, `this.subscribers.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.subscribers.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsSubscribersPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [news-subscribers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/news-subscribers-page.component.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.statusFilter.set`
- **Consumidores:** `news-subscribers-page.component.html` (plantilla)

##### `NewsSubscribersPageComponent.view`

- **Firma:** `view(subscriber: NewsSubscriber): void` — [news-subscribers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/news-subscribers-page.component.ts#L77) (L77–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsSubscriberService.getSubscriberById(subscriber.id).subscribe`, `this.newsSubscriberService.getSubscriberById`, `this.viewingSubscriber.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.viewingSubscriber.set`
- **Consumidores:** `news-subscribers-page.component.html` (plantilla)

##### `NewsSubscribersPageComponent.closeView`

- **Firma:** `closeView(): void` — [news-subscribers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/news-subscribers-page.component.ts#L86) (L86–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.viewingSubscriber.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.viewingSubscriber.set`
- **Consumidores:** `news-subscribers-page.component.html` (plantilla)

##### `NewsSubscribersPageComponent.toggleActive`

- **Firma:** `toggleActive(subscriber: NewsSubscriber): Promise<void>` — [news-subscribers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/news-subscribers-page.component.ts#L90) (L90–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.newsSubscriberService.activateSubscriber`, `this.newsSubscriberService.deactivateSubscriber`, `request$.subscribe`, `this.subscribers.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.subscribers.update`
- **Consumidores:** `news-subscribers-page.component.html` (plantilla)

