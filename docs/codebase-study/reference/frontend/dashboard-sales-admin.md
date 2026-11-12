# Frontend `dashboard-sales-admin`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [sale-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-components-sale-detail-modal-sale-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Read-only full detail for one sale — Ver, reached from "Administrar Facturas de Ventas". | 3 internas; ext.: @angular/common, @angular/core | 3 | Media (3 consumidores) |
| [void-sale-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-components-void-sale-confirm-modal-void-sale-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Anular venta" — dumb, exact mirror of Compras' own `VoidPurchaseConfirmModalComponent`: the parent owns the actual `SalesService.voidSale` call. | 2 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [sales-admin-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-sales-admin-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Administrar Facturas de Ventas" — Sistema, admin-only (route-guarded). | 9 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [sale-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/sale-detail-modal/sale-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sale-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-badge`. | — | — | Media |
| [sale-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/sale-detail-modal/sale-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [void-sale-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/void-sale-confirm-modal/void-sale-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `void-sale-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [void-sale-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/void-sale-confirm-modal/void-sale-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [sales-admin-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sales-admin-page.component.ts`; usa 7 componentes hijos: `app-page-header`, `app-icon`, `app-button`, `app-badge`, `app-report-pagination`, `app-sale-detail-modal`. | — | — | Media |
| [sales-admin-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-components-sale-detail-modal-sale-detail-modal-component-ts"></a>

### sale-detail-modal.component.ts

- **Ruta:** [sale-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/sale-detail-modal/sale-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/sale-detail-modal/sale-detail-modal.component.ts`, 49 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-sales-admin`
- **Responsabilidad:** Read-only full detail for one sale — Ver, reached from "Administrar Facturas de Ventas".
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [sales.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [sales-admin-page.component.ts](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-sales-admin-page-component-ts), [sales-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts) (plantilla), [sales-admin-page.component.ts (plantilla)](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-sales-admin-page-component-ts) (plantilla)
- **Plantilla:** [sale-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/sale-detail-modal/sale-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`

#### Clase `SaleDetailModalComponent` (L9–48)

- **Decoradores:** `@Component({ selector: 'app-sale-detail-modal', standalone: true, imports: [DatePipe, IconComponent, BadgeComponent], templateUrl: './sale-detail-modal.component`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Read-only full detail for one sale — Ver, reached from "Administrar Facturas de Ventas". Closes on backdrop click, unlike the destructive void confirm modal — viewing has nothing to lose.
- **Servicios inyectados con `inject()`:** `salesService = inject(SalesService)`
- **Datos / estado que administra:** `@Input saleId = null`, `@Output closed = new EventEmitter<void>()`, `sale = signal<Sale \| null>(null)`, `loading = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 28–43 | — | `void` |
| `close` | método public | 45–47 | — | `void` |

##### `SaleDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [sale-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/sale-detail-modal/sale-detail-modal.component.ts#L28) (L28–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sale.set`, `this.loading.set`, `this.salesService.getSaleById(this.saleId).subscribe`, `this.salesService.getSaleById`
- **Efectos secundarios:** Actualiza estado (signals): `this.sale.set`, `this.loading.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SaleDetailModalComponent.close`

- **Firma:** `close(): void` — [sale-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/sale-detail-modal/sale-detail-modal.component.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `sale-detail-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-components-void-sale-confirm-modal-void-sale-confirm-modal-component-ts"></a>

### void-sale-confirm-modal.component.ts

- **Ruta:** [void-sale-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/void-sale-confirm-modal/void-sale-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/void-sale-confirm-modal/void-sale-confirm-modal.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-sales-admin`
- **Responsabilidad:** "Anular venta" — dumb, exact mirror of Compras' own `VoidPurchaseConfirmModalComponent`: the parent owns the actual `SalesService.voidSale` call.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [sales-admin-page.component.ts](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-sales-admin-page-component-ts), [sales-admin-page.component.ts (plantilla)](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-sales-admin-page-component-ts) (plantilla)
- **Plantilla:** [void-sale-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/void-sale-confirm-modal/void-sale-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="onCancel()"`, `(ngModelChange)="reason.set($event)"`, `(click)="onConfirm()"`

#### Clase `VoidSaleConfirmModalComponent` (L15–59)

- **Decoradores:** `@Component({ selector: 'app-void-sale-confirm-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './void-sale-confirm`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Anular venta" — dumb, exact mirror of Compras' own `VoidPurchaseConfirmModalComponent`: the parent owns the actual `SalesService.voidSale` call. Never closes on a backdrop click — same as every confirm modal in this codebase.
- **Datos / estado que administra:** `@Input open = false`, `@Input sale = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 35–39 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 41–43 | — | `boolean` |
| `onCancel` | método public | 45–51 | — | `void` |
| `onConfirm` | método public | 53–58 | — | `void` |

##### `VoidSaleConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [void-sale-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/void-sale-confirm-modal/void-sale-confirm-modal.component.ts#L35) (L35–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `VoidSaleConfirmModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [void-sale-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/void-sale-confirm-modal/void-sale-confirm-modal.component.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `VoidSaleConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [void-sale-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/void-sale-confirm-modal/void-sale-confirm-modal.component.ts#L45) (L45–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `void-sale-confirm-modal.component.html` (plantilla)

##### `VoidSaleConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [void-sale-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/void-sale-confirm-modal/void-sale-confirm-modal.component.ts#L53) (L53–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `void-sale-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-sales-admin-page-component-ts"></a>

### sales-admin-page.component.ts

- **Ruta:** [sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts`, 204 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-sales-admin`
- **Responsabilidad:** "Administrar Facturas de Ventas" — Sistema, admin-only (route-guarded).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [client.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-client-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [sales.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [sale-detail-modal.component.ts](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-components-sale-detail-modal-sale-detail-modal-component-ts), [void-sale-confirm-modal.component.ts](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-components-void-sale-confirm-modal-void-sale-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [sales-admin-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [sale-detail-modal.component.ts](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-components-sale-detail-modal-sale-detail-modal-component-ts), [void-sale-confirm-modal.component.ts](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-components-void-sale-confirm-modal-void-sale-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="draftSearch.set($event)"`, `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(ngModelChange)="draftClientId.set($event)"`, `(ngModelChange)="draftStatus.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(click)="viewDetail(sale)"`, `(click)="requestVoid(sale)"`, `(pageChange)="onPageChange($event)"`, `(closed)="closeDetail()"`, `(confirmed)="confirmVoid($event)"`, `(cancelled)="cancelVoid()"`

#### Clase `SalesAdminPageComponent` (L40–203)

- **Decoradores:** `@Component({ selector: 'app-sales-admin-page', standalone: true, imports: [ FormsModule, DatePipe, PageHeaderComponent, ButtonComponent, IconComponent, BadgeComp`
- **Propósito:** "Administrar Facturas de Ventas" — Sistema, admin-only (route-guarded). Exact structural mirror of `PurchasesAdminPageComponent`: localiza una venta ya registrada, ve su detalle completo, y la anula (nunca la edita ni la elimina físicamente — ver `VoidSaleConfirmModalComponent`'s own doc comment). Same draft/applied filter-signal split as the Reportería pages and its own Compras counterpart.
- **Servicios inyectados con `inject()`:** `salesService = inject(SalesService)`, `clientService = inject(ClientService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `clients = signal<Client[]>([])`, `draftSearch = signal(DEFAULT_FILTERS.search)`, `draftStartDate = signal(DEFAULT_FILTERS.startDate)`, `draftEndDate = signal(DEFAULT_FILTERS.endDate)`, `draftClientId = signal(DEFAULT_FILTERS.clientId)`, `draftStatus = signal<SaleStatusFilter \| ''>(DEFAULT_FILTERS.stat`, `search = signal(DEFAULT_FILTERS.search)`, `startDate = signal(DEFAULT_FILTERS.startDate)`, `endDate = signal(DEFAULT_FILTERS.endDate)`, `clientId = signal(DEFAULT_FILTERS.clientId)`, `status = signal<SaleStatusFilter \| ''>(DEFAULT_FILTERS.stat`, `hasActiveFilters = computed( () => this.search() !== DEFAULT_FILTERS.`, `sales = signal<Sale[]>([])`, `total = signal(0)`, `page = signal(1)`, `loading = signal(false)`, `detailSaleId = signal<string \| null>(null)`, `voidTarget = signal<Sale \| null>(null)`, `isVoiding = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `currentFilters` | método private | 106–116 | — | `ListSalesFilters` |
| `fetch` | método public | 118–131 | — | `void` |
| `applyFilters` | método public | 133–141 | — | `void` |
| `clearFilters` | método public | 143–156 | — | `void` |
| `onPageChange` | método public | 158–161 | `page: number` | `void` |
| `viewDetail` | método public | 163–165 | `sale: Sale` | `void` |
| `closeDetail` | método public | 167–169 | — | `void` |
| `requestVoid` | método public | 171–173 | `sale: Sale` | `void` |
| `cancelVoid` | método public | 175–180 | — | `void` |
| `confirmVoid` | método public | 182–202 | `reason: string` | `void` |

##### `SalesAdminPageComponent.currentFilters`

- **Firma:** `currentFilters(): ListSalesFilters` — [sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts#L106) (L106–116)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.search`, `this.startDate`, `this.endDate`, `this.clientId`, `this.status`, `this.page`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `SalesAdminPageComponent.fetch`

- **Firma:** `fetch(): void` — [sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts#L118) (L118–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.salesService.getSales(this.currentFilters()).subscribe`, `this.salesService.getSales`, `this.currentFilters`, `this.sales.set`, `this.total.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.sales.set`, `this.total.set`
- **Consumidores:** (mismo archivo)

##### `SalesAdminPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts#L133) (L133–141)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.search.set`, `this.draftSearch().trim`, `this.draftSearch`, `this.startDate.set`, `this.draftStartDate`, `this.endDate.set`, `this.draftEndDate`, `this.clientId.set`, `this.draftClientId`, `this.status.set`, `this.draftStatus`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.search.set`, `this.startDate.set`, `this.endDate.set`, `this.clientId.set`, `this.status.set`, `this.page.set`
- **Consumidores:** `sales-admin-page.component.html` (plantilla)

##### `SalesAdminPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts#L143) (L143–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftSearch.set`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftClientId.set`, `this.draftStatus.set`, `this.search.set`, `this.startDate.set`, `this.endDate.set`, `this.clientId.set`, `this.status.set`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftSearch.set`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftClientId.set`, `this.draftStatus.set`, `this.search.set`
- **Consumidores:** `sales-admin-page.component.html` (plantilla)

##### `SalesAdminPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts#L158) (L158–161)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `sales-admin-page.component.html` (plantilla)

##### `SalesAdminPageComponent.viewDetail`

- **Firma:** `viewDetail(sale: Sale): void` — [sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts#L163) (L163–165)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailSaleId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailSaleId.set`
- **Consumidores:** `sales-admin-page.component.html` (plantilla)

##### `SalesAdminPageComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts#L167) (L167–169)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailSaleId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailSaleId.set`
- **Consumidores:** `sales-admin-page.component.html` (plantilla)

##### `SalesAdminPageComponent.requestVoid`

- **Firma:** `requestVoid(sale: Sale): void` — [sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts#L171) (L171–173)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `sales-admin-page.component.html` (plantilla)

##### `SalesAdminPageComponent.cancelVoid`

- **Firma:** `cancelVoid(): void` — [sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts#L175) (L175–180)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isVoiding`, `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `sales-admin-page.component.html` (plantilla)

##### `SalesAdminPageComponent.confirmVoid`

- **Firma:** `confirmVoid(reason: string): void` — [sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts#L182) (L182–202)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget`, `this.isVoiding.set`, `this.salesService.voidSale(target.id, reason).subscribe`, `this.salesService.voidSale`, `this.voidTarget.set`, `this.notificationService.success`, `target.id.slice(0, 8).toUpperCase`, `target.id.slice`, `this.fetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isVoiding.set`, `this.voidTarget.set`
- **Consumidores:** `sales-admin-page.component.html` (plantilla)

