# Frontend `dashboard-transaction-days`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [cancel-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-cancel-confirm-modal-cancel-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb — same pattern as `ReopenConfirmModalComponent`. | 1 internas; ext.: @angular/core, @angular/forms | 3 | Media (3 consumidores) |
| [reopen-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-reopen-confirm-modal-reopen-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb — the parent (`TransactionDaysPageComponent`) owns the actual `ClosedDaysService.reopenDay` call. | 1 internas; ext.: @angular/core, @angular/forms | 3 | Media (3 consumidores) |
| [transaction-day-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-transaction-day-detail-modal-transaction-day-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Ver Detalle" of a Transacciones day — reuses `ClosedDaysService.getDayDetail` for the shared status/audit-log fields (same day-cycle row "Gestión de Días Cerrados" already reads, see `TransactionDaysPageComponent`'s own doc comment), and additionally calls `ReportsService.getBankDepositsReport` (al | 7 internas; ext.: @angular/common, rxjs, @angular/core | 2 | Baja (2 consumidores) |
| [transaction-days-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Sistema → Gestión de Transacciones" — manages the same día-abierto/cerrado cycle "Gestión de Días Cerrados" already manages (`ClosedDaysService`, `DayStatusService`), NOT a parallel one: `RegisterBankDepositOperationUseCase` (backend) gates every Transaccionar write against the exact same `day_open | 9 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [cancel-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/cancel-confirm-modal/cancel-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cancel-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [cancel-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/cancel-confirm-modal/cancel-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [reopen-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/reopen-confirm-modal/reopen-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `reopen-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [reopen-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/reopen-confirm-modal/reopen-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-day-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/transaction-day-detail-modal/transaction-day-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-day-detail-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-button`, `app-bank-deposit-detail-modal`. | — | — | Media |
| [transaction-day-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/transaction-day-detail-modal/transaction-day-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-days-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-days-page.component.ts`; usa 8 componentes hijos: `app-page-header`, `app-card`, `app-icon`, `app-button`, `app-empty-state`, `app-transaction-day-detail-modal`. | — | — | Media |
| [transaction-days-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-cancel-confirm-modal-cancel-confirm-modal-component-ts"></a>

### cancel-confirm-modal.component.ts

- **Ruta:** [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/cancel-confirm-modal/cancel-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/cancel-confirm-modal/cancel-confirm-modal.component.ts`, 59 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-days`
- **Responsabilidad:** Dumb — same pattern as `ReopenConfirmModalComponent`.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [transaction-days-page.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts), [closed-days-page.component.ts (plantilla)](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts) (plantilla), [transaction-days-page.component.ts (plantilla)](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts) (plantilla)
- **Plantilla:** [cancel-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/cancel-confirm-modal/cancel-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(ngModelChange)="reason.set($event)"`, `(click)="onCancel()"`, `(click)="onConfirm()"`

#### Clase `CancelConfirmModalComponent` (L16–58)

- **Decoradores:** `@Component({ selector: 'app-cancel-confirm-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './cancel-confirm-modal`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Dumb — same pattern as `ReopenConfirmModalComponent`. "Anular" (not "Eliminar"): the backend never does a physical `DELETE` (`cancel_agent_day` only marks `is_cancelled` — see the backend `CLAUDE.md`), and `bank_deposit_operations` rows for the date are never touched either way, only the shared day-cycle row — the copy below reflects exactly that.
- **Datos / estado que administra:** `@Input open = false`, `@Input date = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 34–38 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 40–42 | — | `boolean` |
| `onCancel` | método public | 44–50 | — | `void` |
| `onConfirm` | método public | 52–57 | — | `void` |

##### `CancelConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/cancel-confirm-modal/cancel-confirm-modal.component.ts#L34) (L34–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CancelConfirmModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/cancel-confirm-modal/cancel-confirm-modal.component.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CancelConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/cancel-confirm-modal/cancel-confirm-modal.component.ts#L44) (L44–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `cancel-confirm-modal.component.html` (plantilla)

##### `CancelConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [cancel-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/cancel-confirm-modal/cancel-confirm-modal.component.ts#L52) (L52–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `cancel-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-reopen-confirm-modal-reopen-confirm-modal-component-ts"></a>

### reopen-confirm-modal.component.ts

- **Ruta:** [reopen-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/reopen-confirm-modal/reopen-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/reopen-confirm-modal/reopen-confirm-modal.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-days`
- **Responsabilidad:** Dumb — the parent (`TransactionDaysPageComponent`) owns the actual `ClosedDaysService.reopenDay` call.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [transaction-days-page.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts), [closed-days-page.component.ts (plantilla)](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts) (plantilla), [transaction-days-page.component.ts (plantilla)](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts) (plantilla)
- **Plantilla:** [reopen-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/reopen-confirm-modal/reopen-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(ngModelChange)="reason.set($event)"`, `(click)="onCancel()"`, `(click)="onConfirm()"`

#### Clase `ReopenConfirmModalComponent` (L17–59)

- **Decoradores:** `@Component({ selector: 'app-reopen-confirm-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './reopen-confirm-modal`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Dumb — the parent (`TransactionDaysPageComponent`) owns the actual `ClosedDaysService.reopenDay` call. Own small copy (not a reuse of "Gestión de Días Cerrados"' own `ReopenConfirmModalComponent`) because the warning has to name Transaccionar explicitly, per this codebase's established "small per-feature copy over cross-feature coupling" convention for text that genuinely differs between two otherwise-identical components.
- **Datos / estado que administra:** `@Input open = false`, `@Input date = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 35–39 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 41–43 | — | `boolean` |
| `onCancel` | método public | 45–51 | — | `void` |
| `onConfirm` | método public | 53–58 | — | `void` |

##### `ReopenConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [reopen-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/reopen-confirm-modal/reopen-confirm-modal.component.ts#L35) (L35–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ReopenConfirmModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [reopen-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/reopen-confirm-modal/reopen-confirm-modal.component.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ReopenConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [reopen-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/reopen-confirm-modal/reopen-confirm-modal.component.ts#L45) (L45–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `reopen-confirm-modal.component.html` (plantilla)

##### `ReopenConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [reopen-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/reopen-confirm-modal/reopen-confirm-modal.component.ts#L53) (L53–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `reopen-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-transaction-day-detail-modal-transaction-day-detail-modal-component-ts"></a>

### transaction-day-detail-modal.component.ts

- **Ruta:** [transaction-day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/transaction-day-detail-modal/transaction-day-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/transaction-day-detail-modal/transaction-day-detail-modal.component.ts`, 133 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-days`
- **Responsabilidad:** "Ver Detalle" of a Transacciones day — reuses `ClosedDaysService.getDayDetail` for the shared status/audit-log fields (same day-cycle row "Gestión de Días Cerrados" already reads, see `TransactionDaysPageComponent`'s own doc comment), and additionally calls `ReportsService.getBankDepositsReport` (al
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [closed-days.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-closed-days-service-ts), [reports.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-reports-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [bank-deposit-detail-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-bank-deposit-detail-modal-bank-deposit-detail-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `rxjs`, `@angular/core`
- **Consumidores:** [transaction-days-page.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts), [transaction-days-page.component.ts (plantilla)](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts) (plantilla)
- **Plantilla:** [transaction-day-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/transaction-day-detail-modal/transaction-day-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [bank-deposit-detail-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-bank-deposit-detail-modal-bank-deposit-detail-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="onClose()"`, `(click)="openOperationDetail(operation.id)"`, `(closed)="closeOperationDetail()"`

#### Clase `TransactionDayDetailModalComponent` (L49–132)

- **Decoradores:** `@Component({ selector: 'app-transaction-day-detail-modal', standalone: true, imports: [DatePipe, ButtonComponent, IconComponent, BankDepositDetailModalComponent]`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Ver Detalle" of a Transacciones day — reuses `ClosedDaysService.getDayDetail` for the shared status/audit-log fields (same day-cycle row "Gestión de Días Cerrados" already reads, see `TransactionDaysPageComponent`'s own doc comment), and additionally calls `ReportsService.getBankDepositsReport` (already built for "Reporte de Transacciones") filtered to that single date for the actual Transaccionar operations list — never a bank-balance/ reconciliation view, unlike "Gestión de Días Cerrados"' own detail modal.
- **Servicios inyectados con `inject()`:** `closedDaysService = inject(ClosedDaysService)`, `reportsService = inject(ReportsService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input date = null`, `@Output closed = new EventEmitter<void>()`, `detail = signal<ClosedDayDetail \| null>(null)`, `operations = signal<BankDepositOperationSummary[]>([])`, `loading = signal(false)`, `selectedOperationId = signal<string \| null>(null)`, `isOperationDetailOpen = signal(false)`, `activeOperations = computed(() => this.operations().filter((operation`, `operationsTotal = computed(() => this.activeOperations().reduce((sum`, `transactionsTotal = computed(() => this.activeOperations().reduce((sum`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 88–92 | `changes: SimpleChanges` | `void` |
| `onClose` | método public | 94–96 | — | `void` |
| `openOperationDetail` | método public | 98–101 | `id: string` | `void` |
| `closeOperationDetail` | método public | 103–105 | — | `void` |
| `fetch` | método private | 107–131 | `date: string` | `void` |

##### `TransactionDayDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [transaction-day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/transaction-day-detail-modal/transaction-day-detail-modal.component.ts#L88) (L88–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.fetch`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionDayDetailModalComponent.onClose`

- **Firma:** `onClose(): void` — [transaction-day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/transaction-day-detail-modal/transaction-day-detail-modal.component.ts#L94) (L94–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `transaction-day-detail-modal.component.html` (plantilla)

##### `TransactionDayDetailModalComponent.openOperationDetail`

- **Firma:** `openOperationDetail(id: string): void` — [transaction-day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/transaction-day-detail-modal/transaction-day-detail-modal.component.ts#L98) (L98–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedOperationId.set`, `this.isOperationDetailOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedOperationId.set`, `this.isOperationDetailOpen.set`
- **Consumidores:** `transaction-day-detail-modal.component.html` (plantilla)

##### `TransactionDayDetailModalComponent.closeOperationDetail`

- **Firma:** `closeOperationDetail(): void` — [transaction-day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/transaction-day-detail-modal/transaction-day-detail-modal.component.ts#L103) (L103–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isOperationDetailOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isOperationDetailOpen.set`
- **Consumidores:** `transaction-day-detail-modal.component.html` (plantilla)

##### `TransactionDayDetailModalComponent.fetch`

- **Firma:** `fetch(date: string): void` — [transaction-day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/components/transaction-day-detail-modal/transaction-day-detail-modal.component.ts#L107) (L107–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.detail.set`, `this.operations.set`, `forkJoin`, `this.closedDaysService.getDayDetail`, `this.reportsService.getBankDepositsReport`, `this.notificationService.error`, `extractErrorMessage`, `this.closed.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.detail.set`, `this.operations.set`; Emite eventos: `this.closed.emit`
- **Consumidores:** [transaction-days-page.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts), [transaction-days-page.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts), (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts"></a>

### transaction-days-page.component.ts

- **Ruta:** [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts`, 222 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-days`
- **Responsabilidad:** "Sistema → Gestión de Transacciones" — manages the same día-abierto/cerrado cycle "Gestión de Días Cerrados" already manages (`ClosedDaysService`, `DayStatusService`), NOT a parallel one: `RegisterBankDepositOperationUseCase` (backend) gates every Transaccionar write against the exact same `day_open
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [closed-days.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-closed-days-service-ts), [day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-day-status-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [transaction-day-detail-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-transaction-day-detail-modal-transaction-day-detail-modal-component-ts), [reopen-confirm-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-reopen-confirm-modal-reopen-confirm-modal-component-ts), [cancel-confirm-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-cancel-confirm-modal-cancel-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [transaction-days-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [transaction-day-detail-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-transaction-day-detail-modal-transaction-day-detail-modal-component-ts), [reopen-confirm-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-reopen-confirm-modal-reopen-confirm-modal-component-ts), [cancel-confirm-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-cancel-confirm-modal-cancel-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="draftDateFrom.set($event)"`, `(ngModelChange)="draftDateTo.set($event)"`, `(ngModelChange)="draftStatus.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(click)="openDetail(row.date)"`, `(click)="openReopenModal(row.date)"`, `(click)="openCancelModal(row.date)"`, `(closed)="closeDetail()"`, `(confirmed)="confirmReopen($event)"`, `(cancelled)="cancelReopenModal()"`, `(confirmed)="confirmCancel($event)"`, `(cancelled)="cancelCancelModal()"`

#### Clase `TransactionDaysPageComponent` (L53–221)

- **Decoradores:** `@Component({ selector: 'app-transaction-days-page', standalone: true, imports: [ FormsModule, DatePipe, PageHeaderComponent, CardComponent, ButtonComponent, Icon`
- **Propósito:** "Sistema → Gestión de Transacciones" — manages the same día-abierto/cerrado cycle "Gestión de Días Cerrados" already manages (`ClosedDaysService`, `DayStatusService`), NOT a parallel one: `RegisterBankDepositOperationUseCase` (backend) gates every Transaccionar write against the exact same `day_openings` row Cuadre de Agentes uses (see the backend `CLAUDE.md`'s "Transaccionar" section), so there is only one open/close/reopen/cancel cycle per calendar date — reopening or anulando a day here reopens/anula it for Cuadre de Agentes too, and vice versa in "Gestión de Días Cerrados". This is why the list/reopen/cancel plumbing below reuses `ClosedDaysService` directly rather than a second service hitting a second copy of the same `/closed-days` URLs — unlike "Gestión de Días de Recargas", which is a genuinely independent backend cycle and rightly gets its own service. The one real difference f
- **Servicios inyectados con `inject()`:** `closedDaysService = inject(ClosedDaysService)`, `dayStatusService = inject(DayStatusService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `rows = signal<ClosedDayRow[]>([])`, `loading = signal(true)`, `draftDateFrom = signal('')`, `draftDateTo = signal('')`, `draftStatus = signal<ClosedDayStatus \| ''>('')`, `hasActiveFilters = signal(false)`, `selectedDate = signal<string \| null>(null)`, `isDetailOpen = signal(false)`, `isReopenModalOpen = signal(false)`, `isCancelModalOpen = signal(false)`, `isSavingAction = signal(false)`, `selectedRow = computed(() => this.rows().find((row) => row.date `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método private | 103–115 | — | `void` |
| `applyFilters` | método public | 117–127 | — | `void` |
| `clearFilters` | método public | 129–136 | — | `void` |
| `openDetail` | método public | 138–141 | `date: string` | `void` |
| `closeDetail` | método public | 143–145 | — | `void` |
| `openReopenModal` | método public | 147–150 | `date: string` | `void` |
| `cancelReopenModal` | método public | 152–157 | — | `void` |
| `confirmReopen` | método public | 159–178 | `reason: string` | `void` |
| `openCancelModal` | método public | 180–183 | `date: string` | `void` |
| `cancelCancelModal` | método public | 185–190 | — | `void` |
| `confirmCancel` | método public | 192–211 | `reason: string` | `void` |
| `canReopen` | método public | 214–216 | `row: ClosedDayRow` | `boolean` |
| `canCancel` | método public | 218–220 | `row: ClosedDayRow` | `boolean` |

##### `TransactionDaysPageComponent.fetch`

- **Firma:** `fetch(): void` — [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts#L103) (L103–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.closedDaysService.getClosedDays(this.appliedFilters).subscribe`, `this.closedDaysService.getClosedDays`, `this.rows.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.rows.set`
- **Consumidores:** (mismo archivo)

##### `TransactionDaysPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts#L117) (L117–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftDateFrom`, `this.draftDateTo`, `this.draftStatus`, `this.hasActiveFilters.set`, `Object.values(this.appliedFilters).some`, `Object.values`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.hasActiveFilters.set`
- **Consumidores:** `transaction-days-page.component.html` (plantilla)

##### `TransactionDaysPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts#L129) (L129–136)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftDateFrom.set`, `this.draftDateTo.set`, `this.draftStatus.set`, `this.hasActiveFilters.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftDateFrom.set`, `this.draftDateTo.set`, `this.draftStatus.set`, `this.hasActiveFilters.set`
- **Consumidores:** `transaction-days-page.component.html` (plantilla)

##### `TransactionDaysPageComponent.openDetail`

- **Firma:** `openDetail(date: string): void` — [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts#L138) (L138–141)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate.set`, `this.isDetailOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedDate.set`, `this.isDetailOpen.set`
- **Consumidores:** `transaction-days-page.component.html` (plantilla)

##### `TransactionDaysPageComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts#L143) (L143–145)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDetailOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDetailOpen.set`
- **Consumidores:** `transaction-days-page.component.html` (plantilla)

##### `TransactionDaysPageComponent.openReopenModal`

- **Firma:** `openReopenModal(date: string): void` — [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts#L147) (L147–150)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate.set`, `this.isReopenModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedDate.set`, `this.isReopenModalOpen.set`
- **Consumidores:** `transaction-days-page.component.html` (plantilla)

##### `TransactionDaysPageComponent.cancelReopenModal`

- **Firma:** `cancelReopenModal(): void` — [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts#L152) (L152–157)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSavingAction`, `this.isReopenModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isReopenModalOpen.set`
- **Consumidores:** `transaction-days-page.component.html` (plantilla)

##### `TransactionDaysPageComponent.confirmReopen`

- **Firma:** `confirmReopen(reason: string): void` — [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts#L159) (L159–178)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate`, `this.isSavingAction`, `this.isSavingAction.set`, `this.closedDaysService.reopenDay(date, reason).subscribe`, `this.closedDaysService.reopenDay`, `this.isReopenModalOpen.set`, `this.notificationService.success`, `this.fetch`, `this.dayStatusService.refresh`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSavingAction.set`, `this.isReopenModalOpen.set`
- **Consumidores:** `transaction-days-page.component.html` (plantilla)

##### `TransactionDaysPageComponent.openCancelModal`

- **Firma:** `openCancelModal(date: string): void` — [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts#L180) (L180–183)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate.set`, `this.isCancelModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedDate.set`, `this.isCancelModalOpen.set`
- **Consumidores:** `transaction-days-page.component.html` (plantilla)

##### `TransactionDaysPageComponent.cancelCancelModal`

- **Firma:** `cancelCancelModal(): void` — [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts#L185) (L185–190)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSavingAction`, `this.isCancelModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isCancelModalOpen.set`
- **Consumidores:** `transaction-days-page.component.html` (plantilla)

##### `TransactionDaysPageComponent.confirmCancel`

- **Firma:** `confirmCancel(reason: string): void` — [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts#L192) (L192–211)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate`, `this.isSavingAction`, `this.isSavingAction.set`, `this.closedDaysService.cancelDay(date, reason).subscribe`, `this.closedDaysService.cancelDay`, `this.isCancelModalOpen.set`, `this.notificationService.success`, `this.fetch`, `this.dayStatusService.refresh`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSavingAction.set`, `this.isCancelModalOpen.set`
- **Consumidores:** `transaction-days-page.component.html` (plantilla)

##### `TransactionDaysPageComponent.canReopen`

- **Firma:** `canReopen(row: ClosedDayRow): boolean` — [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts#L214) (L214–216)
- **Propósito / descripción:** Only a CLOSED day accepts reopening/cancellation — one already REOPENED must be re-closed first (from Agentes Bancarios), and a CANCELLED one is terminal. Same rule as "Gestión de Días Cerrados", since it's the same underlying row.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaction-days-page.component.html` (plantilla)

##### `TransactionDaysPageComponent.canCancel`

- **Firma:** `canCancel(row: ClosedDayRow): boolean` — [transaction-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts#L218) (L218–220)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaction-days-page.component.html` (plantilla)

