# Frontend `dashboard-recharges-sim-sales-admin`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [sim-sale-registration-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-components-sim-sale-registration-detail-modal-sim-sale-registration-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Read-only full detail for one SIM sale registration — Ver, reached from "Administrar Ventas de SIM". | 3 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [void-sim-sale-registration-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-components-void-sim-sale-registration-confirm-modal-void-sim-sale-registration-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Anular" — dumb, same pattern as `VoidPurchaseConfirmModalComponent`: the parent owns the actual `RechargeSimsService.voidSaleRegistration` call. | 2 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [recharges-sim-sales-admin-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-recharges-sim-sales-admin-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Administrar Ventas de SIM" — Sistema, admin-only (route-guarded). | 8 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [sim-sale-registration-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/sim-sale-registration-detail-modal/sim-sale-registration-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sim-sale-registration-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-badge`. | — | — | Media |
| [sim-sale-registration-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/sim-sale-registration-detail-modal/sim-sale-registration-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [void-sim-sale-registration-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/void-sim-sale-registration-confirm-modal/void-sim-sale-registration-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `void-sim-sale-registration-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [void-sim-sale-registration-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/void-sim-sale-registration-confirm-modal/void-sim-sale-registration-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharges-sim-sales-admin-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharges-sim-sales-admin-page.component.ts`; usa 7 componentes hijos: `app-page-header`, `app-icon`, `app-button`, `app-badge`, `app-report-pagination`, `app-sim-sale-registration-detail-modal`. | — | — | Media |
| [recharges-sim-sales-admin-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-components-sim-sale-registration-detail-modal-sim-sale-registration-detail-modal-component-ts"></a>

### sim-sale-registration-detail-modal.component.ts

- **Ruta:** [sim-sale-registration-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/sim-sale-registration-detail-modal/sim-sale-registration-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/sim-sale-registration-detail-modal/sim-sale-registration-detail-modal.component.ts`, 86 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges-sim-sales-admin`
- **Responsabilidad:** Read-only full detail for one SIM sale registration — Ver, reached from "Administrar Ventas de SIM".
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [recharge-sims.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-sims-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [recharges-sim-sales-admin-page.component.ts](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-recharges-sim-sales-admin-page-component-ts), [recharges-sim-sales-admin-page.component.ts (plantilla)](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-recharges-sim-sales-admin-page-component-ts) (plantilla)
- **Plantilla:** [sim-sale-registration-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/sim-sale-registration-detail-modal/sim-sale-registration-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`

#### Clase `SimSaleRegistrationDetailModalComponent` (L17–85)

- **Decoradores:** `@Component({ selector: 'app-sim-sale-registration-detail-modal', standalone: true, imports: [DatePipe, IconComponent, BadgeComponent], templateUrl: './sim-sale-r`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Read-only full detail for one SIM sale registration — Ver, reached from "Administrar Ventas de SIM". Closes on backdrop click, same as `PurchaseDetailModalComponent` (viewing has nothing to lose). The DPI photo is fetched as a `Blob` (never a bare `&lt;img [src]&gt;` URL — that endpoint requires a JWT the browser has no way to attach to a plain image request) and turned into a local object URL, revoked on every id change and on destroy so a closed modal never leaks memory.
- **Servicios inyectados con `inject()`:** `simsService = inject(RechargeSimsService)`
- **Datos / estado que administra:** `@Input registrationId = null`, `@Output closed = new EventEmitter<void>()`, `registration = signal<SimSaleRegistration \| null>(null)`, `loading = signal(false)`, `dpiImageUrl = signal<string \| null>(null)`, `imageLoading = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 38–59 | — | `void` |
| `loadImage` | método private | 61–72 | `id: string` | `void` |
| `clearImage` | método private | 74–80 | — | `void` |
| `close` | método public | 82–84 | — | `void` |

##### `SimSaleRegistrationDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [sim-sale-registration-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/sim-sale-registration-detail-modal/sim-sale-registration-detail-modal.component.ts#L38) (L38–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clearImage`, `this.registration.set`, `this.loading.set`, `this.simsService.getSaleRegistrationById(this.registrationId).subscribe`, `this.simsService.getSaleRegistrationById`, `this.loadImage`
- **Efectos secundarios:** Actualiza estado (signals): `this.registration.set`, `this.loading.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SimSaleRegistrationDetailModalComponent.loadImage`

- **Firma:** `loadImage(id: string): void` — [sim-sale-registration-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/sim-sale-registration-detail-modal/sim-sale-registration-detail-modal.component.ts#L61) (L61–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageLoading.set`, `this.simsService.getDpiImage(id).subscribe`, `this.simsService.getDpiImage`, `this.dpiImageUrl.set`, `URL.createObjectURL`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageLoading.set`, `this.dpiImageUrl.set`
- **Consumidores:** (mismo archivo)

##### `SimSaleRegistrationDetailModalComponent.clearImage`

- **Firma:** `clearImage(): void` — [sim-sale-registration-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/sim-sale-registration-detail-modal/sim-sale-registration-detail-modal.component.ts#L74) (L74–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dpiImageUrl`, `URL.revokeObjectURL`, `this.dpiImageUrl.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.dpiImageUrl.set`
- **Consumidores:** (mismo archivo)

##### `SimSaleRegistrationDetailModalComponent.close`

- **Firma:** `close(): void` — [sim-sale-registration-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/sim-sale-registration-detail-modal/sim-sale-registration-detail-modal.component.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `sim-sale-registration-detail-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-components-void-sim-sale-registration-confirm-modal-void-sim-sale-registration-confirm-modal-component-ts"></a>

### void-sim-sale-registration-confirm-modal.component.ts

- **Ruta:** [void-sim-sale-registration-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/void-sim-sale-registration-confirm-modal/void-sim-sale-registration-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/void-sim-sale-registration-confirm-modal/void-sim-sale-registration-confirm-modal.component.ts`, 59 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges-sim-sales-admin`
- **Responsabilidad:** "Anular" — dumb, same pattern as `VoidPurchaseConfirmModalComponent`: the parent owns the actual `RechargeSimsService.voidSaleRegistration` call.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [recharges-sim-sales-admin-page.component.ts](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-recharges-sim-sales-admin-page-component-ts), [recharges-sim-sales-admin-page.component.ts (plantilla)](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-recharges-sim-sales-admin-page-component-ts) (plantilla)
- **Plantilla:** [void-sim-sale-registration-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/void-sim-sale-registration-confirm-modal/void-sim-sale-registration-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="onCancel()"`, `(ngModelChange)="reason.set($event)"`, `(click)="onConfirm()"`

#### Clase `VoidSimSaleRegistrationConfirmModalComponent` (L14–58)

- **Decoradores:** `@Component({ selector: 'app-void-sim-sale-registration-confirm-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Anular" — dumb, same pattern as `VoidPurchaseConfirmModalComponent`: the parent owns the actual `RechargeSimsService.voidSaleRegistration` call. Never closes on a backdrop click.
- **Datos / estado que administra:** `@Input open = false`, `@Input registration = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 34–38 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 40–42 | — | `boolean` |
| `onCancel` | método public | 44–50 | — | `void` |
| `onConfirm` | método public | 52–57 | — | `void` |

##### `VoidSimSaleRegistrationConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [void-sim-sale-registration-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/void-sim-sale-registration-confirm-modal/void-sim-sale-registration-confirm-modal.component.ts#L34) (L34–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `VoidSimSaleRegistrationConfirmModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [void-sim-sale-registration-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/void-sim-sale-registration-confirm-modal/void-sim-sale-registration-confirm-modal.component.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `VoidSimSaleRegistrationConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [void-sim-sale-registration-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/void-sim-sale-registration-confirm-modal/void-sim-sale-registration-confirm-modal.component.ts#L44) (L44–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `void-sim-sale-registration-confirm-modal.component.html` (plantilla)

##### `VoidSimSaleRegistrationConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [void-sim-sale-registration-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/components/void-sim-sale-registration-confirm-modal/void-sim-sale-registration-confirm-modal.component.ts#L52) (L52–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `void-sim-sale-registration-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-recharges-sim-sales-admin-page-component-ts"></a>

### recharges-sim-sales-admin-page.component.ts

- **Ruta:** [recharges-sim-sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.ts`, 192 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharges-sim-sales-admin`
- **Responsabilidad:** "Administrar Ventas de SIM" — Sistema, admin-only (route-guarded).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [recharge-sims.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-sims-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [sim-sale-registration-detail-modal.component.ts](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-components-sim-sale-registration-detail-modal-sim-sale-registration-detail-modal-component-ts), [void-sim-sale-registration-confirm-modal.component.ts](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-components-void-sim-sale-registration-confirm-modal-void-sim-sale-registration-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [recharges-sim-sales-admin-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [sim-sale-registration-detail-modal.component.ts](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-components-sim-sale-registration-detail-modal-sim-sale-registration-detail-modal-component-ts), [void-sim-sale-registration-confirm-modal.component.ts](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-components-void-sim-sale-registration-confirm-modal-void-sim-sale-registration-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(ngModelChange)="draftSimTypeId.set($event)"`, `(ngModelChange)="draftStatus.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(click)="viewDetail(registration)"`, `(click)="requestVoid(registration)"`, `(pageChange)="onPageChange($event)"`, `(closed)="closeDetail()"`, `(confirmed)="confirmVoid($event)"`, `(cancelled)="cancelVoid()"`

#### Clase `RechargesSimSalesAdminPageComponent` (L38–191)

- **Decoradores:** `@Component({ selector: 'app-recharges-sim-sales-admin-page', standalone: true, imports: [ FormsModule, DatePipe, PageHeaderComponent, ButtonComponent, IconCompon`
- **Propósito:** "Administrar Ventas de SIM" — Sistema, admin-only (route-guarded). Localiza una venta de SIM ya registrada, ve su detalle completo (incluida la imagen del DPI), y la anula (nunca la edita ni la elimina físicamente — mismo patrón que "Administrar Facturas de Compras": la corrección siempre es anular + registrar una venta nueva y correcta). Mirrors `PurchasesAdminPageComponent`'s own draft/applied filter-signal split exactly.
- **Servicios inyectados con `inject()`:** `simsService = inject(RechargeSimsService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `simTypes = signal<SimType[]>([])`, `draftStartDate = signal(DEFAULT_FILTERS.startDate)`, `draftEndDate = signal(DEFAULT_FILTERS.endDate)`, `draftSimTypeId = signal(DEFAULT_FILTERS.simTypeId)`, `draftStatus = signal<'' \| 'ACTIVE' \| 'VOIDED'>(DEFAULT_FILTERS.s`, `startDate = signal(DEFAULT_FILTERS.startDate)`, `endDate = signal(DEFAULT_FILTERS.endDate)`, `simTypeId = signal(DEFAULT_FILTERS.simTypeId)`, `status = signal<'' \| 'ACTIVE' \| 'VOIDED'>(DEFAULT_FILTERS.s`, `hasActiveFilters = computed( () => this.startDate() !== DEFAULT_FILTE`, `registrations = signal<SimSaleRegistration[]>([])`, `total = signal(0)`, `page = signal(1)`, `loading = signal(false)`, `detailRegistrationId = signal<string \| null>(null)`, `voidTarget = signal<SimSaleRegistration \| null>(null)`, `isVoiding = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `currentFilters` | método private | 100–109 | — | `ListSimSaleRegistrationsFilters` |
| `fetch` | método public | 111–124 | — | `void` |
| `applyFilters` | método public | 126–133 | — | `void` |
| `clearFilters` | método public | 135–146 | — | `void` |
| `onPageChange` | método public | 148–151 | `page: number` | `void` |
| `viewDetail` | método public | 153–155 | `registration: SimSaleRegistration` | `void` |
| `closeDetail` | método public | 157–159 | — | `void` |
| `requestVoid` | método public | 161–163 | `registration: SimSaleRegistration` | `void` |
| `cancelVoid` | método public | 165–170 | — | `void` |
| `confirmVoid` | método public | 172–190 | `reason: string` | `void` |

##### `RechargesSimSalesAdminPageComponent.currentFilters`

- **Firma:** `currentFilters(): ListSimSaleRegistrationsFilters` — [recharges-sim-sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.ts#L100) (L100–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.startDate`, `this.endDate`, `this.simTypeId`, `this.status`, `this.page`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `RechargesSimSalesAdminPageComponent.fetch`

- **Firma:** `fetch(): void` — [recharges-sim-sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.ts#L111) (L111–124)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.simsService.getSaleRegistrations(this.currentFilters()).subscribe`, `this.simsService.getSaleRegistrations`, `this.currentFilters`, `this.registrations.set`, `this.total.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.registrations.set`, `this.total.set`
- **Consumidores:** (mismo archivo)

##### `RechargesSimSalesAdminPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [recharges-sim-sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.ts#L126) (L126–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.startDate.set`, `this.draftStartDate`, `this.endDate.set`, `this.draftEndDate`, `this.simTypeId.set`, `this.draftSimTypeId`, `this.status.set`, `this.draftStatus`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.startDate.set`, `this.endDate.set`, `this.simTypeId.set`, `this.status.set`, `this.page.set`
- **Consumidores:** `recharges-sim-sales-admin-page.component.html` (plantilla)

##### `RechargesSimSalesAdminPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [recharges-sim-sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.ts#L135) (L135–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftSimTypeId.set`, `this.draftStatus.set`, `this.startDate.set`, `this.endDate.set`, `this.simTypeId.set`, `this.status.set`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftSimTypeId.set`, `this.draftStatus.set`, `this.startDate.set`, `this.endDate.set`
- **Consumidores:** `recharges-sim-sales-admin-page.component.html` (plantilla)

##### `RechargesSimSalesAdminPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [recharges-sim-sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.ts#L148) (L148–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `recharges-sim-sales-admin-page.component.html` (plantilla)

##### `RechargesSimSalesAdminPageComponent.viewDetail`

- **Firma:** `viewDetail(registration: SimSaleRegistration): void` — [recharges-sim-sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.ts#L153) (L153–155)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailRegistrationId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailRegistrationId.set`
- **Consumidores:** `recharges-sim-sales-admin-page.component.html` (plantilla)

##### `RechargesSimSalesAdminPageComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [recharges-sim-sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.ts#L157) (L157–159)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailRegistrationId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailRegistrationId.set`
- **Consumidores:** `recharges-sim-sales-admin-page.component.html` (plantilla)

##### `RechargesSimSalesAdminPageComponent.requestVoid`

- **Firma:** `requestVoid(registration: SimSaleRegistration): void` — [recharges-sim-sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.ts#L161) (L161–163)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `recharges-sim-sales-admin-page.component.html` (plantilla)

##### `RechargesSimSalesAdminPageComponent.cancelVoid`

- **Firma:** `cancelVoid(): void` — [recharges-sim-sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.ts#L165) (L165–170)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isVoiding`, `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `recharges-sim-sales-admin-page.component.html` (plantilla)

##### `RechargesSimSalesAdminPageComponent.confirmVoid`

- **Firma:** `confirmVoid(reason: string): void` — [recharges-sim-sales-admin-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges-sim-sales-admin/recharges-sim-sales-admin-page.component.ts#L172) (L172–190)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget`, `this.isVoiding.set`, `this.simsService.voidSaleRegistration(target.id, reason).subscribe`, `this.simsService.voidSaleRegistration`, `this.voidTarget.set`, `this.notificationService.success`, `this.fetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isVoiding.set`, `this.voidTarget.set`
- **Consumidores:** `recharges-sim-sales-admin-page.component.html` (plantilla)

