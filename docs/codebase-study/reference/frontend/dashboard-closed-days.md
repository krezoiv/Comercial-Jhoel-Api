# Frontend `dashboard-closed-days`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [closed-days-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Sistema → Gestión de Días Cerrados" — manages the cycle of a day that is ALREADY closed (controlled reopening, re-closing, cancellation). | 9 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [cancel-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-components-cancel-confirm-modal-cancel-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb — same pattern as `ReopenConfirmModalComponent`. | 1 internas; ext.: @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [day-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-components-day-detail-modal-day-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Ver Detalle" of a closed day — calls `ClosedDaysService.getDayDetail` every time it opens (or the selected date changes), never caches across openings: always reflects the most recent state, even if the user just reopened/re-closed/cancelled that same day moments earlier. | 5 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [reopen-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-components-reopen-confirm-modal-reopen-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb — the parent (`ClosedDaysPageComponent`) owns the actual `ClosedDaysService.reopenDay` call, same pattern as `EntryConfirmModalComponent`/`SaveBalancesConfirmModalComponent`. | 1 internas; ext.: @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [closed-days-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `closed-days-page.component.ts`; usa 8 componentes hijos: `app-page-header`, `app-card`, `app-icon`, `app-button`, `app-empty-state`, `app-day-detail-modal`. | — | — | Media |
| [closed-days-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cancel-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/cancel-confirm-modal/cancel-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cancel-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [cancel-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/cancel-confirm-modal/cancel-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [day-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/day-detail-modal/day-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `day-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [day-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/day-detail-modal/day-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [reopen-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/reopen-confirm-modal/reopen-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `reopen-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [reopen-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/reopen-confirm-modal/reopen-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts"></a>

### closed-days-page.component.ts

- **Ruta:** [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts`, 223 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-closed-days`
- **Responsabilidad:** "Sistema → Gestión de Días Cerrados" — manages the cycle of a day that is ALREADY closed (controlled reopening, re-closing, cancellation).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [closed-days.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-closed-days-service-ts), [day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-day-status-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [day-detail-modal.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-components-day-detail-modal-day-detail-modal-component-ts), [reopen-confirm-modal.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-components-reopen-confirm-modal-reopen-confirm-modal-component-ts), [cancel-confirm-modal.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-components-cancel-confirm-modal-cancel-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [closed-days-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [day-detail-modal.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-components-day-detail-modal-day-detail-modal-component-ts), [reopen-confirm-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-reopen-confirm-modal-reopen-confirm-modal-component-ts), [cancel-confirm-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-cancel-confirm-modal-cancel-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="draftDateFrom.set($event)"`, `(ngModelChange)="draftDateTo.set($event)"`, `(ngModelChange)="draftStatus.set($event)"`, `(ngModelChange)="draftResultSign.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(click)="openDetail(row.date)"`, `(click)="openReopenModal(row.date)"`, `(click)="openCancelModal(row.date)"`, `(closed)="closeDetail()"`, `(confirmed)="confirmReopen($event)"`, `(cancelled)="cancelReopenModal()"`, `(confirmed)="confirmCancel($event)"`, `(cancelled)="cancelCancelModal()"`

#### Clase `ClosedDaysPageComponent` (L50–222)

- **Decoradores:** `@Component({ selector: 'app-closed-days-page', standalone: true, imports: [ FormsModule, DatePipe, CardComponent, ButtonComponent, IconComponent, PageHeaderCompo`
- **Propósito:** "Sistema → Gestión de Días Cerrados" — manages the cycle of a day that is ALREADY closed (controlled reopening, re-closing, cancellation). Never touches the opening/balance-registration/cuadre logic of the day IN PROGRESS (Agentes Bancarios → Bancos/Cuadre Agentes) — it reuses those same endpoints (`POST /banks/balances`, `POST /agent-reconciliations`) to edit and re-close a reopened day, with no new use case built for that. See `ClosedDaysService`/`ReopenConfirmModalComponent`/ `CancelConfirmModalComponent`. Route and menu already protected by `adminGuard`/`roles` (the same mechanism Usuarios/Roles use) — the real protection is on the backend (`ClosedDaysController`, a class-level `@Roles('ADMIN','SUPER_ADMIN')`, including the `GET`s).
- **Servicios inyectados con `inject()`:** `closedDaysService = inject(ClosedDaysService)`, `dayStatusService = inject(DayStatusService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `rows = signal<ClosedDayRow[]>([])`, `loading = signal(true)`, `draftDateFrom = signal('')`, `draftDateTo = signal('')`, `draftStatus = signal<ClosedDayStatus \| ''>('')`, `draftResultSign = signal<ResultSign \| ''>('')`, `hasActiveFilters = signal(false)`, `selectedDate = signal<string \| null>(null)`, `isDetailOpen = signal(false)`, `isReopenModalOpen = signal(false)`, `isCancelModalOpen = signal(false)`, `isSavingAction = signal(false)`, `selectedRow = computed(() => this.rows().find((row) => row.date `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método private | 102–114 | — | `void` |
| `applyFilters` | método public | 116–127 | — | `void` |
| `clearFilters` | método public | 129–137 | — | `void` |
| `openDetail` | método public | 139–142 | `date: string` | `void` |
| `closeDetail` | método public | 144–146 | — | `void` |
| `openReopenModal` | método public | 148–151 | `date: string` | `void` |
| `cancelReopenModal` | método public | 153–158 | — | `void` |
| `confirmReopen` | método public | 160–179 | `reason: string` | `void` |
| `openCancelModal` | método public | 181–184 | `date: string` | `void` |
| `cancelCancelModal` | método public | 186–191 | — | `void` |
| `confirmCancel` | método public | 193–212 | `reason: string` | `void` |
| `canReopen` | método public | 215–217 | `row: ClosedDayRow` | `boolean` |
| `canCancel` | método public | 219–221 | `row: ClosedDayRow` | `boolean` |

##### `ClosedDaysPageComponent.fetch`

- **Firma:** `fetch(): void` — [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts#L102) (L102–114)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.closedDaysService.getClosedDays(this.appliedFilters).subscribe`, `this.closedDaysService.getClosedDays`, `this.rows.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.rows.set`
- **Consumidores:** (mismo archivo)

##### `ClosedDaysPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts#L116) (L116–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftDateFrom`, `this.draftDateTo`, `this.draftStatus`, `this.draftResultSign`, `this.hasActiveFilters.set`, `Object.values(this.appliedFilters).some`, `Object.values`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.hasActiveFilters.set`
- **Consumidores:** `closed-days-page.component.html` (plantilla)

##### `ClosedDaysPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts#L129) (L129–137)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftDateFrom.set`, `this.draftDateTo.set`, `this.draftStatus.set`, `this.draftResultSign.set`, `this.hasActiveFilters.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftDateFrom.set`, `this.draftDateTo.set`, `this.draftStatus.set`, `this.draftResultSign.set`, `this.hasActiveFilters.set`
- **Consumidores:** `closed-days-page.component.html` (plantilla)

##### `ClosedDaysPageComponent.openDetail`

- **Firma:** `openDetail(date: string): void` — [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts#L139) (L139–142)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate.set`, `this.isDetailOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedDate.set`, `this.isDetailOpen.set`
- **Consumidores:** `closed-days-page.component.html` (plantilla)

##### `ClosedDaysPageComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts#L144) (L144–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDetailOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDetailOpen.set`
- **Consumidores:** `closed-days-page.component.html` (plantilla)

##### `ClosedDaysPageComponent.openReopenModal`

- **Firma:** `openReopenModal(date: string): void` — [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts#L148) (L148–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate.set`, `this.isReopenModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedDate.set`, `this.isReopenModalOpen.set`
- **Consumidores:** `closed-days-page.component.html` (plantilla)

##### `ClosedDaysPageComponent.cancelReopenModal`

- **Firma:** `cancelReopenModal(): void` — [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts#L153) (L153–158)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSavingAction`, `this.isReopenModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isReopenModalOpen.set`
- **Consumidores:** `closed-days-page.component.html` (plantilla)

##### `ClosedDaysPageComponent.confirmReopen`

- **Firma:** `confirmReopen(reason: string): void` — [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts#L160) (L160–179)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate`, `this.isSavingAction`, `this.isSavingAction.set`, `this.closedDaysService.reopenDay(date, reason).subscribe`, `this.closedDaysService.reopenDay`, `this.isReopenModalOpen.set`, `this.notificationService.success`, `this.fetch`, `this.dayStatusService.refresh`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSavingAction.set`, `this.isReopenModalOpen.set`
- **Consumidores:** `closed-days-page.component.html` (plantilla)

##### `ClosedDaysPageComponent.openCancelModal`

- **Firma:** `openCancelModal(date: string): void` — [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts#L181) (L181–184)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate.set`, `this.isCancelModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedDate.set`, `this.isCancelModalOpen.set`
- **Consumidores:** `closed-days-page.component.html` (plantilla)

##### `ClosedDaysPageComponent.cancelCancelModal`

- **Firma:** `cancelCancelModal(): void` — [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts#L186) (L186–191)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSavingAction`, `this.isCancelModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isCancelModalOpen.set`
- **Consumidores:** `closed-days-page.component.html` (plantilla)

##### `ClosedDaysPageComponent.confirmCancel`

- **Firma:** `confirmCancel(reason: string): void` — [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts#L193) (L193–212)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate`, `this.isSavingAction`, `this.isSavingAction.set`, `this.closedDaysService.cancelDay(date, reason).subscribe`, `this.closedDaysService.cancelDay`, `this.isCancelModalOpen.set`, `this.notificationService.success`, `this.fetch`, `this.dayStatusService.refresh`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSavingAction.set`, `this.isCancelModalOpen.set`
- **Consumidores:** `closed-days-page.component.html` (plantilla)

##### `ClosedDaysPageComponent.canReopen`

- **Firma:** `canReopen(row: ClosedDayRow): boolean` — [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts#L215) (L215–217)
- **Propósito / descripción:** Only a CLOSED day accepts reopening/cancellation — one already REOPENED must be re-closed first (from Agentes Bancarios), and a CANCELLED one is terminal.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `closed-days-page.component.html` (plantilla)

##### `ClosedDaysPageComponent.canCancel`

- **Firma:** `canCancel(row: ClosedDayRow): boolean` — [closed-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts#L219) (L219–221)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `closed-days-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-closed-days-components-cancel-confirm-modal-cancel-confirm-modal-component-ts"></a>

### cancel-confirm-modal.component.ts

- **Ruta:** [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/cancel-confirm-modal/cancel-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/closed-days/components/cancel-confirm-modal/cancel-confirm-modal.component.ts`, 57 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-closed-days`
- **Responsabilidad:** Dumb — same pattern as `ReopenConfirmModalComponent`.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [closed-days-page.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts)
- **Plantilla:** [cancel-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/cancel-confirm-modal/cancel-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(ngModelChange)="reason.set($event)"`, `(click)="onCancel()"`, `(click)="onConfirm()"`

#### Clase `CancelConfirmModalComponent` (L14–56)

- **Decoradores:** `@Component({ selector: 'app-cancel-confirm-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './cancel-confirm-modal`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Dumb — same pattern as `ReopenConfirmModalComponent`. "Anular" (not "Eliminar"): this is financial information and the backend never does a physical `DELETE` (`cancel_agent_day` only marks `is_cancelled`, see the backend) — the modal's copy must reflect exactly that.
- **Datos / estado que administra:** `@Input open = false`, `@Input date = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 32–36 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 38–40 | — | `boolean` |
| `onCancel` | método public | 42–48 | — | `void` |
| `onConfirm` | método public | 50–55 | — | `void` |

##### `CancelConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/cancel-confirm-modal/cancel-confirm-modal.component.ts#L32) (L32–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CancelConfirmModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/cancel-confirm-modal/cancel-confirm-modal.component.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CancelConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/cancel-confirm-modal/cancel-confirm-modal.component.ts#L42) (L42–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `cancel-confirm-modal.component.html` (plantilla)

##### `CancelConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/cancel-confirm-modal/cancel-confirm-modal.component.ts#L50) (L50–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `cancel-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-closed-days-components-day-detail-modal-day-detail-modal-component-ts"></a>

### day-detail-modal.component.ts

- **Ruta:** [day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/day-detail-modal/day-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/closed-days/components/day-detail-modal/day-detail-modal.component.ts`, 93 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-closed-days`
- **Responsabilidad:** "Ver Detalle" of a closed day — calls `ClosedDaysService.getDayDetail` every time it opens (or the selected date changes), never caches across openings: always reflects the most recent state, even if the user just reopened/re-closed/cancelled that same day moments earlier.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [closed-days.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-closed-days-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [closed-days-page.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts), [closed-days-page.component.ts (plantilla)](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts) (plantilla)
- **Plantilla:** [day-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/day-detail-modal/day-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="onClose()"`

#### Clase `DayDetailModalComponent` (L42–92)

- **Decoradores:** `@Component({ selector: 'app-day-detail-modal', standalone: true, imports: [DatePipe, ButtonComponent, IconComponent], templateUrl: './day-detail-modal.component.`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Ver Detalle" of a closed day — calls `ClosedDaysService.getDayDetail` every time it opens (or the selected date changes), never caches across openings: always reflects the most recent state, even if the user just reopened/re-closed/cancelled that same day moments earlier. Doesn't show a cash-denomination breakdown — deliberate, see `ClosedDayDetail` (the model): this app never had that table, only the total.
- **Servicios inyectados con `inject()`:** `closedDaysService = inject(ClosedDaysService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input date = null`, `@Output closed = new EventEmitter<void>()`, `detail = signal<ClosedDayDetail \| null>(null)`, `loading = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 67–71 | `changes: SimpleChanges` | `void` |
| `onClose` | método public | 73–75 | — | `void` |
| `fetch` | método private | 77–91 | `date: string` | `void` |

##### `DayDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/day-detail-modal/day-detail-modal.component.ts#L67) (L67–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.fetch`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayDetailModalComponent.onClose`

- **Firma:** `onClose(): void` — [day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/day-detail-modal/day-detail-modal.component.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `day-detail-modal.component.html` (plantilla)

##### `DayDetailModalComponent.fetch`

- **Firma:** `fetch(date: string): void` — [day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/day-detail-modal/day-detail-modal.component.ts#L77) (L77–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.detail.set`, `this.closedDaysService.getDayDetail(date).subscribe`, `this.closedDaysService.getDayDetail`, `this.notificationService.error`, `extractErrorMessage`, `this.closed.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.detail.set`; Emite eventos: `this.closed.emit`
- **Consumidores:** [closed-days-page.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts), [closed-days-page.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts), (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-closed-days-components-reopen-confirm-modal-reopen-confirm-modal-component-ts"></a>

### reopen-confirm-modal.component.ts

- **Ruta:** [reopen-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/reopen-confirm-modal/reopen-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/closed-days/components/reopen-confirm-modal/reopen-confirm-modal.component.ts`, 59 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-closed-days`
- **Responsabilidad:** Dumb — the parent (`ClosedDaysPageComponent`) owns the actual `ClosedDaysService.reopenDay` call, same pattern as `EntryConfirmModalComponent`/`SaveBalancesConfirmModalComponent`.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [closed-days-page.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts)
- **Plantilla:** [reopen-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/reopen-confirm-modal/reopen-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(ngModelChange)="reason.set($event)"`, `(click)="onCancel()"`, `(click)="onConfirm()"`

#### Clase `ReopenConfirmModalComponent` (L16–58)

- **Decoradores:** `@Component({ selector: 'app-reopen-confirm-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './reopen-confirm-modal`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Dumb — the parent (`ClosedDaysPageComponent`) owns the actual `ClosedDaysService.reopenDay` call, same pattern as `EntryConfirmModalComponent`/`SaveBalancesConfirmModalComponent`. The reason is mandatory (minimum 5 characters, the same minimum the backend enforces) — "Confirmar Reapertura" stays disabled until that's met, so it doesn't rely solely on the server's rejection.
- **Datos / estado que administra:** `@Input open = false`, `@Input date = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 34–38 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 40–42 | — | `boolean` |
| `onCancel` | método public | 44–50 | — | `void` |
| `onConfirm` | método public | 52–57 | — | `void` |

##### `ReopenConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [reopen-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/reopen-confirm-modal/reopen-confirm-modal.component.ts#L34) (L34–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ReopenConfirmModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [reopen-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/reopen-confirm-modal/reopen-confirm-modal.component.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ReopenConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [reopen-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/reopen-confirm-modal/reopen-confirm-modal.component.ts#L44) (L44–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `reopen-confirm-modal.component.html` (plantilla)

##### `ReopenConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [reopen-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/components/reopen-confirm-modal/reopen-confirm-modal.component.ts#L52) (L52–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `reopen-confirm-modal.component.html` (plantilla)

