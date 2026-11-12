# Frontend `dashboard-recharge-cash-box`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [cash-box-card.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-card-cash-box-card-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Caja Contable" — the balance hero + today's ingresos/salidas breakdown. | 9 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [cash-box-contribution-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-contribution-modal-cash-box-contribution-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Aporte a Caja" — self-contained, mirrors `CashBoxWithdrawalModalComponent` exactly, minus the "no puede exceder el saldo" constraint: a contribution is never rejected for exceeding anything, it only ever adds to the Caja (see `register_recharge_cash_box_movement`'s own doc comment). | 7 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [cash-box-history.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-history-cash-box-history-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Historial de Movimientos" — reuses `ReportPaginationComponent` (already fully generic, confirmed before importing it here, same reuse already established for Reportería/Recargas' own report pages) rather than building a fourth pagination control. | 7 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [cash-box-withdrawal-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-withdrawal-modal-cash-box-withdrawal-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Salida de Ganancia" — self-contained, like `RechargeSaleFormModalComponent`. | 7 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [recharge-cash-box-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-recharge-cash-box-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Gestión Caja Recargas" — a standalone Sistema-level page, moved out of the Recargas Electrónicas page per an explicit follow-up request (it used to be a section embedded there). | 3 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [cash-box-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-card/cash-box-card.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cash-box-card.component.ts`; usa 5 componentes hijos: `app-card`, `app-icon`, `app-button`, `app-cash-box-withdrawal-modal`, `app-cash-box-contribution-modal`. | — | — | Media |
| [cash-box-card.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-card/cash-box-card.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cash-box-contribution-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-contribution-modal/cash-box-contribution-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cash-box-contribution-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [cash-box-contribution-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-contribution-modal/cash-box-contribution-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cash-box-history.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-history/cash-box-history.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cash-box-history.component.ts`; usa 4 componentes hijos: `app-card`, `app-icon`, `app-empty-state`, `app-report-pagination`. | — | — | Media |
| [cash-box-history.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-history/cash-box-history.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cash-box-withdrawal-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-withdrawal-modal/cash-box-withdrawal-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cash-box-withdrawal-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [cash-box-withdrawal-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-withdrawal-modal/cash-box-withdrawal-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharge-cash-box-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/recharge-cash-box-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharge-cash-box-page.component.ts`; usa 3 componentes hijos: `app-page-header`, `app-recharge-cash-box-card`, `app-recharge-cash-box-history`. | — | — | Media |
| [recharge-cash-box-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/recharge-cash-box-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-card-cash-box-card-component-ts"></a>

### cash-box-card.component.ts

- **Ruta:** [cash-box-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-card/cash-box-card.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-card/cash-box-card.component.ts`, 113 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharge-cash-box`
- **Responsabilidad:** "Caja Contable" — the balance hero + today's ingresos/salidas breakdown.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [recharge-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-cash-box-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [refetch-on-tab-visible.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-refetch-on-tab-visible-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-box-withdrawal-modal.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-withdrawal-modal-cash-box-withdrawal-modal-component-ts), [cash-box-contribution-modal.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-contribution-modal-cash-box-contribution-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [recharge-cash-box-page.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-recharge-cash-box-page-component-ts), [recharge-cash-box-page.component.ts (plantilla)](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-recharge-cash-box-page-component-ts) (plantilla)
- **Plantilla:** [cash-box-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-card/cash-box-card.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [cash-box-withdrawal-modal.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-withdrawal-modal-cash-box-withdrawal-modal-component-ts), [cash-box-contribution-modal.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-contribution-modal-cash-box-contribution-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="openContributionModal()"`, `(click)="openWithdrawalModal()"`, `(closed)="closeWithdrawalModal()"`, `(saved)="onWithdrawalSaved($event)"`, `(closed)="closeContributionModal()"`, `(saved)="onContributionSaved($event)"`

#### Clase `CashBoxCardComponent` (L33–112)

- **Decoradores:** `@Component({ selector: 'app-recharge-cash-box-card', standalone: true, imports: [CardComponent, ButtonComponent, IconComponent, CashBoxWithdrawalModalComponent, `
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Caja Contable" — the balance hero + today's ingresos/salidas breakdown. Self-contained, like `SalesSummaryCardComponent`: fetches its own balance through `RechargeCashBoxService` and reacts to `operationDate` via `ngOnChanges` (never in the constructor — `@Input()` values aren't set yet there, the exact gotcha that Card's own doc comment already documents for this module). "+ Aporte"/"− Salida de Ganancia" are both admin-only — registering/anulando either kind of manual movement is gated server-side (`@Roles`), this is UX only. Also refetches via `refetchOnTabVisible()` — this card has no cross-page signal at all (unlike `SalesSummaryCardComponent`'s `refreshTrigger`, which only ever reaches within the SAME page tree): a recarga sale or purchase registered on `/dashboard/recargas` never notifies this component, since they're separate routes/component trees. Without this, a tab left open
- **Servicios inyectados con `inject()`:** `cashBoxService = inject(RechargeCashBoxService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `@Input operationDate = ''`, `@Output movementRegistered = new EventEmitter<void>()`, `balance = signal<CashBoxBalance \| null>(null)`, `loading = signal(true)`, `withdrawalModalOpen = signal(false)`, `contributionModalOpen = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 65–69 | `changes: SimpleChanges` | `void` |
| `fetchBalance` | método private | 71–83 | — | `void` |
| `openWithdrawalModal` | método public | 85–87 | — | `void` |
| `closeWithdrawalModal` | método public | 89–91 | — | `void` |
| `openContributionModal` | método public | 93–95 | — | `void` |
| `closeContributionModal` | método public | 97–99 | — | `void` |
| `onWithdrawalSaved` | método public | 101–105 | `_movement: CashBoxMovementRecord` | `void` |
| `onContributionSaved` | método public | 107–111 | `_movement: CashBoxMovementRecord` | `void` |

##### `CashBoxCardComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [cash-box-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-card/cash-box-card.component.ts#L65) (L65–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.fetchBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashBoxCardComponent.fetchBalance`

- **Firma:** `fetchBalance(): void` — [cash-box-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-card/cash-box-card.component.ts#L71) (L71–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.cashBoxService.getBalance(this.operationDate).subscribe`, `this.cashBoxService.getBalance`, `this.balance.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.balance.set`
- **Consumidores:** (mismo archivo)

##### `CashBoxCardComponent.openWithdrawalModal`

- **Firma:** `openWithdrawalModal(): void` — [cash-box-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-card/cash-box-card.component.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.withdrawalModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.withdrawalModalOpen.set`
- **Consumidores:** `cash-box-card.component.html` (plantilla)

##### `CashBoxCardComponent.closeWithdrawalModal`

- **Firma:** `closeWithdrawalModal(): void` — [cash-box-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-card/cash-box-card.component.ts#L89) (L89–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.withdrawalModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.withdrawalModalOpen.set`
- **Consumidores:** `cash-box-card.component.html` (plantilla)

##### `CashBoxCardComponent.openContributionModal`

- **Firma:** `openContributionModal(): void` — [cash-box-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-card/cash-box-card.component.ts#L93) (L93–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.contributionModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.contributionModalOpen.set`
- **Consumidores:** `cash-box-card.component.html` (plantilla)

##### `CashBoxCardComponent.closeContributionModal`

- **Firma:** `closeContributionModal(): void` — [cash-box-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-card/cash-box-card.component.ts#L97) (L97–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.contributionModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.contributionModalOpen.set`
- **Consumidores:** `cash-box-card.component.html` (plantilla)

##### `CashBoxCardComponent.onWithdrawalSaved`

- **Firma:** `onWithdrawalSaved(_movement: CashBoxMovementRecord): void` — [cash-box-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-card/cash-box-card.component.ts#L101) (L101–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.withdrawalModalOpen.set`, `this.fetchBalance`, `this.movementRegistered.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.withdrawalModalOpen.set`; Emite eventos: `this.movementRegistered.emit`
- **Consumidores:** `cash-box-card.component.html` (plantilla)

##### `CashBoxCardComponent.onContributionSaved`

- **Firma:** `onContributionSaved(_movement: CashBoxMovementRecord): void` — [cash-box-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-card/cash-box-card.component.ts#L107) (L107–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.contributionModalOpen.set`, `this.fetchBalance`, `this.movementRegistered.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.contributionModalOpen.set`; Emite eventos: `this.movementRegistered.emit`
- **Consumidores:** `cash-box-card.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-contribution-modal-cash-box-contribution-modal-component-ts"></a>

### cash-box-contribution-modal.component.ts

- **Ruta:** [cash-box-contribution-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-contribution-modal/cash-box-contribution-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-contribution-modal/cash-box-contribution-modal.component.ts`, 104 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharge-cash-box`
- **Responsabilidad:** "Aporte a Caja" — self-contained, mirrors `CashBoxWithdrawalModalComponent` exactly, minus the "no puede exceder el saldo" constraint: a contribution is never rejected for exceeding anything, it only ever adds to the Caja (see `register_recharge_cash_box_movement`'s own doc comment).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [recharge-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-cash-box-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [cash-box-card.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-card-cash-box-card-component-ts), [cash-box-card.component.ts (plantilla)](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-card-cash-box-card-component-ts) (plantilla)
- **Plantilla:** [cash-box-contribution-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-contribution-modal/cash-box-contribution-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `CashBoxContributionModalComponent` (L19–103)

- **Decoradores:** `@Component({ selector: 'app-cash-box-contribution-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective]`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Aporte a Caja" — self-contained, mirrors `CashBoxWithdrawalModalComponent` exactly, minus the "no puede exceder el saldo" constraint: a contribution is never rejected for exceeding anything, it only ever adds to the Caja (see `register_recharge_cash_box_movement`'s own doc comment).
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `cashBoxService = inject(RechargeCashBoxService)`, `notificationService = inject(NotificationService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input businessDate = ''`, `@Input currentBalance = 0`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<CashBoxMovementRecord>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 52–59 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 61–95 | — | `Promise<void>` |
| `close` | método public | 97–102 | — | `void` |

##### `CashBoxContributionModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [cash-box-contribution-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-contribution-modal/cash-box-contribution-modal.component.ts#L52) (L52–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashBoxContributionModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [cash-box-contribution-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-contribution-modal/cash-box-contribution-modal.component.ts#L61) (L61–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.confirmDialogService.confirm`, `formatCurrency`, `this.isSubmitting.set`, `this.cashBoxService.registerContribution`, `concept.trim`, `this.notificationService.success`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `cash-box-contribution-modal.component.html` (plantilla)

##### `CashBoxContributionModalComponent.close`

- **Firma:** `close(): void` — [cash-box-contribution-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-contribution-modal/cash-box-contribution-modal.component.ts#L97) (L97–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `cash-box-contribution-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-history-cash-box-history-component-ts"></a>

### cash-box-history.component.ts

- **Ruta:** [cash-box-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-history/cash-box-history.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-history/cash-box-history.component.ts`, 132 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharge-cash-box`
- **Responsabilidad:** "Historial de Movimientos" — reuses `ReportPaginationComponent` (already fully generic, confirmed before importing it here, same reuse already established for Reportería/Recargas' own report pages) rather than building a fourth pagination control.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [recharge-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-cash-box-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [refetch-on-tab-visible.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-refetch-on-tab-visible-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [recharge-cash-box-page.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-recharge-cash-box-page-component-ts), [recharge-cash-box-page.component.ts (plantilla)](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-recharge-cash-box-page-component-ts) (plantilla)
- **Plantilla:** [cash-box-history.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-history/cash-box-history.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="startDate.set($event)"`, `(ngModelChange)="endDate.set($event)"`, `(ngModelChange)="type.set($event)"`, `(click)="applyFilters()"`, `(click)="clearFilters()"`, `(pageChange)="onPageChange($event)"`

#### Clase `CashBoxHistoryComponent` (L39–131)

- **Decoradores:** `@Component({ selector: 'app-recharge-cash-box-history', standalone: true, imports: [FormsModule, DatePipe, CardComponent, IconComponent, EmptyStateComponent, Rep`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Historial de Movimientos" — reuses `ReportPaginationComponent` (already fully generic, confirmed before importing it here, same reuse already established for Reportería/Recargas' own report pages) rather than building a fourth pagination control. Filters apply immediately on change (no separate "Aplicar"/draft-vs-applied split) — unlike Reportería's own filter panels, there's no PDF export here whose consistency-with-what's-shown guarantee that split exists to protect.
- **Servicios inyectados con `inject()`:** `cashBoxService = inject(RechargeCashBoxService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input maxSelectableDate = ''`, `@Input refreshTrigger = 0`, `startDate = signal('')`, `endDate = signal('')`, `type = signal<CashBoxMovementType \| ''>('')`, `items = signal<CashBoxMovement[]>([])`, `total = signal(0)`, `page = signal(1)`, `loading = signal(true)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 81–89 | `changes: SimpleChanges` | `void` |
| `applyFilters` | método public | 91–94 | — | `void` |
| `clearFilters` | método public | 96–102 | — | `void` |
| `onPageChange` | método public | 104–107 | `page: number` | `void` |
| `fetch` | método private | 109–130 | — | `void` |

##### `CashBoxHistoryComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [cash-box-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-history/cash-box-history.component.ts#L81) (L81–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.fetch`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashBoxHistoryComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [cash-box-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-history/cash-box-history.component.ts#L91) (L91–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `cash-box-history.component.html` (plantilla)

##### `CashBoxHistoryComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [cash-box-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-history/cash-box-history.component.ts#L96) (L96–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.startDate.set`, `this.endDate.set`, `this.type.set`, `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.startDate.set`, `this.endDate.set`, `this.type.set`, `this.page.set`
- **Consumidores:** `cash-box-history.component.html` (plantilla)

##### `CashBoxHistoryComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [cash-box-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-history/cash-box-history.component.ts#L104) (L104–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `cash-box-history.component.html` (plantilla)

##### `CashBoxHistoryComponent.fetch`

- **Firma:** `fetch(): void` — [cash-box-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-history/cash-box-history.component.ts#L109) (L109–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.cashBoxService.getMovements`, `this.startDate`, `this.endDate`, `this.type`, `this.page`, `this.items.set`, `this.total.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.items.set`, `this.total.set`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-withdrawal-modal-cash-box-withdrawal-modal-component-ts"></a>

### cash-box-withdrawal-modal.component.ts

- **Ruta:** [cash-box-withdrawal-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-withdrawal-modal/cash-box-withdrawal-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-withdrawal-modal/cash-box-withdrawal-modal.component.ts`, 108 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharge-cash-box`
- **Responsabilidad:** "Salida de Ganancia" — self-contained, like `RechargeSaleFormModalComponent`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [recharge-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-cash-box-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [cash-box-card.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-card-cash-box-card-component-ts), [cash-box-card.component.ts (plantilla)](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-card-cash-box-card-component-ts) (plantilla)
- **Plantilla:** [cash-box-withdrawal-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-withdrawal-modal/cash-box-withdrawal-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `CashBoxWithdrawalModalComponent` (L23–107)

- **Decoradores:** `@Component({ selector: 'app-cash-box-withdrawal-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective], `
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Salida de Ganancia" — self-contained, like `RechargeSaleFormModalComponent`. The over-limit check ("no puede ser mayor al saldo disponible") is never duplicated here as a hard client-side block — only the backend, inside `register_recharge_cash_box_withdrawal`'s own advisory lock, is the real guarantee (see that function's own doc comment); a stale `currentBalance` snapshot here is just what the confirmation dialog previews, and a genuinely stale attempt still gets rejected server-side with the exact same message the ticket requires.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `cashBoxService = inject(RechargeCashBoxService)`, `notificationService = inject(NotificationService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input businessDate = ''`, `@Input currentBalance = 0`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<CashBoxMovementRecord>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 56–63 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 65–99 | — | `Promise<void>` |
| `close` | método public | 101–106 | — | `void` |

##### `CashBoxWithdrawalModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [cash-box-withdrawal-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-withdrawal-modal/cash-box-withdrawal-modal.component.ts#L56) (L56–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashBoxWithdrawalModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [cash-box-withdrawal-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-withdrawal-modal/cash-box-withdrawal-modal.component.ts#L65) (L65–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.confirmDialogService.confirm`, `formatCurrency`, `this.isSubmitting.set`, `this.cashBoxService.registerWithdrawal`, `concept.trim`, `this.notificationService.success`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `cash-box-withdrawal-modal.component.html` (plantilla)

##### `CashBoxWithdrawalModalComponent.close`

- **Firma:** `close(): void` — [cash-box-withdrawal-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/components/cash-box-withdrawal-modal/cash-box-withdrawal-modal.component.ts#L101) (L101–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `cash-box-withdrawal-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-recharge-cash-box-page-component-ts"></a>

### recharge-cash-box-page.component.ts

- **Ruta:** [recharge-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/recharge-cash-box-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/recharge-cash-box-page.component.ts`, 52 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharge-cash-box`
- **Responsabilidad:** "Gestión Caja Recargas" — a standalone Sistema-level page, moved out of the Recargas Electrónicas page per an explicit follow-up request (it used to be a section embedded there).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-box-card.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-card-cash-box-card-component-ts), [cash-box-history.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-history-cash-box-history-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [recharge-cash-box-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/recharge-cash-box-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [cash-box-card.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-card-cash-box-card-component-ts), [cash-box-history.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-history-cash-box-history-component-ts)
- **Eventos enlazados en la plantilla:** `(change)="onDateChange($any($event.target).value)"`, `(movementRegistered)="onMovementRegistered()"`

#### Clase `RechargeCashBoxPageComponent` (L26–51)

- **Decoradores:** `@Component({ selector: 'app-recharge-cash-box-page', standalone: true, imports: [PageHeaderComponent, CashBoxCardComponent, CashBoxHistoryComponent], templateUrl`
- **Propósito:** "Gestión Caja Recargas" — a standalone Sistema-level page, moved out of the Recargas Electrónicas page per an explicit follow-up request (it used to be a section embedded there). No day-open/close lifecycle here — unlike Recargas' own page, a Caja Contable withdrawal is never gated by whether the Recargas day is open or closed (see the backend's own doc comment on `register_recharge_cash_box_withdrawal`), so this page is intentionally simpler: just a business-date picker driving the balance card and the movement history below it.
- **Datos / estado que administra:** `operationDate = signal(todayIsoDate())`, `historyRefreshTrigger = signal(0)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onDateChange` | método public | 42–46 | `value: string` | `void` |
| `onMovementRegistered` | método public | 48–50 | — | `void` |

##### `RechargeCashBoxPageComponent.onDateChange`

- **Firma:** `onDateChange(value: string): void` — [recharge-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/recharge-cash-box-page.component.ts#L42) (L42–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.operationDate.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.operationDate.set`
- **Consumidores:** `recharge-cash-box-page.component.html` (plantilla)

##### `RechargeCashBoxPageComponent.onMovementRegistered`

- **Firma:** `onMovementRegistered(): void` — [recharge-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/recharge-cash-box-page.component.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.historyRefreshTrigger.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.historyRefreshTrigger.update`
- **Consumidores:** `recharge-cash-box-page.component.html` (plantilla)

#### Función `todayIsoDate` (L8–14)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [recharge-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-cash-box/recharge-cash-box-page.component.ts#L8)
- **Propósito / descripción:** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique as Recargas' own `todayIsoDate()` and every other date-driven page in this app.
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

