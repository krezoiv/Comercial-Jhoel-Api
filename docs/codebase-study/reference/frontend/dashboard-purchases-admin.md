# Frontend `dashboard-purchases-admin`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [purchase-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-components-purchase-detail-modal-purchase-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Read-only full detail for one purchase invoice — Ver, reached from "Administrar Facturas de Compras". | 3 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [void-purchase-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-components-void-purchase-confirm-modal-void-purchase-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Anular factura" — dumb, same pattern as every other void confirm modal in this app (`VoidPurchaseConfirmModalComponent` in Recargas, tickets' own `VoidReasonModalComponent`): the parent owns the actual `PurchasesService.voidPurchase` call. | 2 internas; ext.: @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [purchases-admin-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-purchases-admin-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Administrar Facturas de Compras" — Sistema, admin-only (route-guarded). | 9 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [purchase-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/purchase-detail-modal/purchase-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `purchase-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-badge`. | — | — | Media |
| [purchase-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/purchase-detail-modal/purchase-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [void-purchase-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `void-purchase-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [void-purchase-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [purchases-admin-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `purchases-admin-page.component.ts`; usa 7 componentes hijos: `app-page-header`, `app-icon`, `app-button`, `app-badge`, `app-report-pagination`, `app-purchase-detail-modal`. | — | — | Media |
| [purchases-admin-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-components-purchase-detail-modal-purchase-detail-modal-component-ts"></a>

### purchase-detail-modal.component.ts

- **Ruta:** [purchase-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/purchase-detail-modal/purchase-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/purchase-detail-modal/purchase-detail-modal.component.ts`, 49 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-purchases-admin`
- **Responsabilidad:** Read-only full detail for one purchase invoice — Ver, reached from "Administrar Facturas de Compras".
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [purchases.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-purchases-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [purchases-admin-page.component.ts](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-purchases-admin-page-component-ts)
- **Plantilla:** [purchase-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/purchase-detail-modal/purchase-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`

#### Clase `PurchaseDetailModalComponent` (L9–48)

- **Decoradores:** `@Component({ selector: 'app-purchase-detail-modal', standalone: true, imports: [DatePipe, IconComponent, BadgeComponent], templateUrl: './purchase-detail-modal.c`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Read-only full detail for one purchase invoice — Ver, reached from "Administrar Facturas de Compras". Closes on backdrop click, unlike the destructive void confirm modal — viewing has nothing to lose.
- **Servicios inyectados con `inject()`:** `purchasesService = inject(PurchasesService)`
- **Datos / estado que administra:** `@Input purchaseId = null`, `@Output closed = new EventEmitter<void>()`, `purchase = signal<Purchase \| null>(null)`, `loading = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 28–43 | — | `void` |
| `close` | método public | 45–47 | — | `void` |

##### `PurchaseDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [purchase-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/purchase-detail-modal/purchase-detail-modal.component.ts#L28) (L28–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.purchase.set`, `this.loading.set`, `this.purchasesService.getPurchaseById(this.purchaseId).subscribe`, `this.purchasesService.getPurchaseById`
- **Efectos secundarios:** Actualiza estado (signals): `this.purchase.set`, `this.loading.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseDetailModalComponent.close`

- **Firma:** `close(): void` — [purchase-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/purchase-detail-modal/purchase-detail-modal.component.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `purchase-detail-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-components-void-purchase-confirm-modal-void-purchase-confirm-modal-component-ts"></a>

### void-purchase-confirm-modal.component.ts

- **Ruta:** [void-purchase-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.ts`, 62 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-purchases-admin`
- **Responsabilidad:** "Anular factura" — dumb, same pattern as every other void confirm modal in this app (`VoidPurchaseConfirmModalComponent` in Recargas, tickets' own `VoidReasonModalComponent`): the parent owns the actual `PurchasesService.voidPurchase` call.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [purchases-admin-page.component.ts](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-purchases-admin-page-component-ts)
- **Plantilla:** [void-purchase-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="onCancel()"`, `(ngModelChange)="reason.set($event)"`, `(click)="onConfirm()"`

#### Clase `VoidPurchaseConfirmModalComponent` (L17–61)

- **Decoradores:** `@Component({ selector: 'app-void-purchase-confirm-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './void-purchase`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Anular factura" — dumb, same pattern as every other void confirm modal in this app (`VoidPurchaseConfirmModalComponent` in Recargas, tickets' own `VoidReasonModalComponent`): the parent owns the actual `PurchasesService.voidPurchase` call. Never closes on a backdrop click — same as every confirm modal in this codebase (none wire a close handler onto `.modal-backdrop`).
- **Datos / estado que administra:** `@Input open = false`, `@Input purchase = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 37–41 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 43–45 | — | `boolean` |
| `onCancel` | método public | 47–53 | — | `void` |
| `onConfirm` | método public | 55–60 | — | `void` |

##### `VoidPurchaseConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [void-purchase-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.ts#L37) (L37–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `VoidPurchaseConfirmModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [void-purchase-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `VoidPurchaseConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [void-purchase-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.ts#L47) (L47–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `void-purchase-confirm-modal.component.html` (plantilla)

##### `VoidPurchaseConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [void-purchase-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/components/void-purchase-confirm-modal/void-purchase-confirm-modal.component.ts#L55) (L55–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `void-purchase-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-purchases-admin-page-component-ts"></a>

### purchases-admin-page.component.ts

- **Ruta:** [purchases-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.ts`, 212 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-purchases-admin`
- **Responsabilidad:** "Administrar Facturas de Compras" — Sistema, admin-only (route-guarded).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [purchases.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-purchases-service-ts), [supplier.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-supplier-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [purchase-detail-modal.component.ts](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-components-purchase-detail-modal-purchase-detail-modal-component-ts), [void-purchase-confirm-modal.component.ts](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-components-void-purchase-confirm-modal-void-purchase-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [purchases-admin-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [purchase-detail-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-components-purchase-detail-modal-purchase-detail-modal-component-ts), [void-purchase-confirm-modal.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-void-purchase-confirm-modal-void-purchase-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="draftSearch.set($event)"`, `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(ngModelChange)="draftSupplierId.set($event)"`, `(ngModelChange)="draftStatus.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(click)="viewDetail(purchase)"`, `(click)="requestVoid(purchase)"`, `(pageChange)="onPageChange($event)"`, `(closed)="closeDetail()"`, `(confirmed)="confirmVoid($event)"`, `(cancelled)="cancelVoid()"`

#### Clase `PurchasesAdminPageComponent` (L48–211)

- **Decoradores:** `@Component({ selector: 'app-purchases-admin-page', standalone: true, imports: [ FormsModule, DatePipe, PageHeaderComponent, ButtonComponent, IconComponent, Badge`
- **Propósito:** "Administrar Facturas de Compras" — Sistema, admin-only (route-guarded). Localiza una factura ya registrada, ve su detalle completo, y la anula (nunca la edita ni la elimina físicamente — ver `VoidPurchaseConfirmModalComponent`'s own doc comment for why "editar factura" fue deliberadamente excluido de este módulo: la corrección siempre es anular + registrar una compra nueva y correcta, el mismo patrón ya usado para Recargas/Transaccionar/ Tickets/Cotizaciones en esta app). Mirrors `PurchasesReportPageComponent`'s own filter-panel pattern (draft/applied signal split — editing a filter field only ever touches `draftX`, `applyFilters()`/`clearFilters()` are the only two places the applied signals the table actually reads can change), but this is a management screen, not a report: no summary tiles, no PDF export, no by-product view — just localizar, ver, anular.
- **Servicios inyectados con `inject()`:** `purchasesService = inject(PurchasesService)`, `supplierService = inject(SupplierService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `suppliers = signal<Supplier[]>([])`, `draftSearch = signal(DEFAULT_FILTERS.search)`, `draftStartDate = signal(DEFAULT_FILTERS.startDate)`, `draftEndDate = signal(DEFAULT_FILTERS.endDate)`, `draftSupplierId = signal(DEFAULT_FILTERS.supplierId)`, `draftStatus = signal<PurchaseStatusFilter \| ''>(DEFAULT_FILTERS.`, `search = signal(DEFAULT_FILTERS.search)`, `startDate = signal(DEFAULT_FILTERS.startDate)`, `endDate = signal(DEFAULT_FILTERS.endDate)`, `supplierId = signal(DEFAULT_FILTERS.supplierId)`, `status = signal<PurchaseStatusFilter \| ''>(DEFAULT_FILTERS.`, `hasActiveFilters = computed( () => this.search() !== DEFAULT_FILTERS.`, `purchases = signal<Purchase[]>([])`, `total = signal(0)`, `page = signal(1)`, `loading = signal(false)`, `detailPurchaseId = signal<string \| null>(null)`, `voidTarget = signal<Purchase \| null>(null)`, `isVoiding = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `currentFilters` | método private | 114–124 | — | `ListPurchasesFilters` |
| `fetch` | método public | 126–139 | — | `void` |
| `applyFilters` | método public | 141–149 | — | `void` |
| `clearFilters` | método public | 151–164 | — | `void` |
| `onPageChange` | método public | 166–169 | `page: number` | `void` |
| `viewDetail` | método public | 171–173 | `purchase: Purchase` | `void` |
| `closeDetail` | método public | 175–177 | — | `void` |
| `requestVoid` | método public | 179–181 | `purchase: Purchase` | `void` |
| `cancelVoid` | método public | 183–188 | — | `void` |
| `confirmVoid` | método public | 190–210 | `reason: string` | `void` |

##### `PurchasesAdminPageComponent.currentFilters`

- **Firma:** `currentFilters(): ListPurchasesFilters` — [purchases-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.ts#L114) (L114–124)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.search`, `this.startDate`, `this.endDate`, `this.supplierId`, `this.status`, `this.page`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `PurchasesAdminPageComponent.fetch`

- **Firma:** `fetch(): void` — [purchases-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.ts#L126) (L126–139)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.purchasesService.getPurchases(this.currentFilters()).subscribe`, `this.purchasesService.getPurchases`, `this.currentFilters`, `this.purchases.set`, `this.total.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.purchases.set`, `this.total.set`
- **Consumidores:** (mismo archivo)

##### `PurchasesAdminPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [purchases-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.ts#L141) (L141–149)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.search.set`, `this.draftSearch().trim`, `this.draftSearch`, `this.startDate.set`, `this.draftStartDate`, `this.endDate.set`, `this.draftEndDate`, `this.supplierId.set`, `this.draftSupplierId`, `this.status.set`, `this.draftStatus`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.search.set`, `this.startDate.set`, `this.endDate.set`, `this.supplierId.set`, `this.status.set`, `this.page.set`
- **Consumidores:** `purchases-admin-page.component.html` (plantilla)

##### `PurchasesAdminPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [purchases-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.ts#L151) (L151–164)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftSearch.set`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftSupplierId.set`, `this.draftStatus.set`, `this.search.set`, `this.startDate.set`, `this.endDate.set`, `this.supplierId.set`, `this.status.set`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftSearch.set`, `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftSupplierId.set`, `this.draftStatus.set`, `this.search.set`
- **Consumidores:** `purchases-admin-page.component.html` (plantilla)

##### `PurchasesAdminPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [purchases-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.ts#L166) (L166–169)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `purchases-admin-page.component.html` (plantilla)

##### `PurchasesAdminPageComponent.viewDetail`

- **Firma:** `viewDetail(purchase: Purchase): void` — [purchases-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.ts#L171) (L171–173)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailPurchaseId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailPurchaseId.set`
- **Consumidores:** `purchases-admin-page.component.html` (plantilla)

##### `PurchasesAdminPageComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [purchases-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.ts#L175) (L175–177)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailPurchaseId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailPurchaseId.set`
- **Consumidores:** `purchases-admin-page.component.html` (plantilla)

##### `PurchasesAdminPageComponent.requestVoid`

- **Firma:** `requestVoid(purchase: Purchase): void` — [purchases-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.ts#L179) (L179–181)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `purchases-admin-page.component.html` (plantilla)

##### `PurchasesAdminPageComponent.cancelVoid`

- **Firma:** `cancelVoid(): void` — [purchases-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.ts#L183) (L183–188)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isVoiding`, `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `purchases-admin-page.component.html` (plantilla)

##### `PurchasesAdminPageComponent.confirmVoid`

- **Firma:** `confirmVoid(reason: string): void` — [purchases-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/purchases-admin/purchases-admin-page.component.ts#L190) (L190–210)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget`, `this.isVoiding.set`, `this.purchasesService.voidPurchase(target.id, reason).subscribe`, `this.purchasesService.voidPurchase`, `this.voidTarget.set`, `this.notificationService.success`, `target.id.slice(0, 8).toUpperCase`, `target.id.slice`, `this.fetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isVoiding.set`, `this.voidTarget.set`
- **Consumidores:** `purchases-admin-page.component.html` (plantilla)

