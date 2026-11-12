# Frontend `dashboard-bank-agents`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [bank-agents-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | **Saldos dinámicos**: la columna "Saldo Actual" es `banks.final_balance`, que solo mueven las operaciones (Transaccionar, transferencias) y los ajustes manuales — el backend es la fuente de verdad, esta pantalla nunca lo calcula. | 16 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [adjust-balance-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-adjust-balance-modal-adjust-balance-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Ajustar saldo" — solo se muestra a admin/super_admin (y el backend lo vuelve a exigir). | 4 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [agent-reconciliation-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-agent-reconciliation-confirm-modal-agent-reconciliation-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb — the parent (`CuadreAgentesPageComponent`) owns the actual `registerReconciliation` call, same pattern as `FinalBalanceConfirmModalComponent`. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [cuadre-cash-source.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-cuadre-cash-source-cuadre-cash-source-component-ts) | .ts | Componente Angular | Feature (pantalla) | Cuadre Agentes → Conteo de Efectivo: the "Cargar último arqueo de Caja" / "Limpiar" actions and the origin banner of the breakdown being edited — "Conteo manual", "Último arqueo de Caja" (number, date/time, bank day, user, counted total) or "Modificado manualmente después de cargar arqueo". | 2 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [entry-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-entry-confirm-modal-entry-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Apertura del Día" — dumb, the parent (`BankAgentsPageComponent`) owns the actual `POST /banks/day-status/open` call on confirm. | 1 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [pending-balances-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-pending-balances-modal-pending-balances-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb — the parent (`CuadreAgentesPageComponent`) owns the validation and when to show it. | 2 internas; ext.: @angular/core, @angular/router | 0 | Baja (0 consumidores) |
| [save-balances-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-save-balances-confirm-modal-save-balances-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb — the parent (`BankAgentsPageComponent`) owns the actual save; this modal only confirms the intent. | 1 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [zero-balances-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-zero-balances-confirm-modal-zero-balances-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb — the parent (`BankAgentsPageComponent`) owns applying the zeros to the draft; this modal only confirms the intent. | 1 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [cuadre-agentes-page.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `latest`, `ACCEPTANCE` (sin comentario de documentación en el código). | 9 internas; ext.: @angular/core, rxjs | 0 | Soporte (pruebas) |
| [cuadre-agentes-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Cuadre Agentes" — second stage: adds the Resumen del Cuadre (with the live result, colored by its sign) and "Guardar Cuadre", which persists a historical record to `agent_reconciliations` via `POST /agent-reconciliations`. | 14 internas; ext.: @angular/common, @angular/core, @angular/router | 2 | Baja (2 consumidores) |
| [bank-agents-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-agents-page.component.ts`; usa 9 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-bank-balance-amount`, `app-credit-line-summary`, `app-entry-confirm-modal`. | — | — | Media |
| [bank-agents-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [adjust-balance-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/adjust-balance-modal/adjust-balance-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `adjust-balance-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-bank-balance-amount`, `app-button`. | — | — | Media |
| [adjust-balance-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/adjust-balance-modal/adjust-balance-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [agent-reconciliation-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/agent-reconciliation-confirm-modal/agent-reconciliation-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `agent-reconciliation-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [agent-reconciliation-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/agent-reconciliation-confirm-modal/agent-reconciliation-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cuadre-cash-source.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/cuadre-cash-source/cuadre-cash-source.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cuadre-cash-source.component.ts`; usa 2 componentes hijos: `app-button`, `app-icon`. | — | — | Media |
| [cuadre-cash-source.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/cuadre-cash-source/cuadre-cash-source.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [entry-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/entry-confirm-modal/entry-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `entry-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [entry-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/entry-confirm-modal/entry-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [pending-balances-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/pending-balances-modal/pending-balances-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `pending-balances-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [pending-balances-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/pending-balances-modal/pending-balances-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [save-balances-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/save-balances-confirm-modal/save-balances-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `save-balances-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [save-balances-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/save-balances-confirm-modal/save-balances-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [zero-balances-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/zero-balances-confirm-modal/zero-balances-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `zero-balances-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [zero-balances-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/zero-balances-confirm-modal/zero-balances-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cuadre-agentes-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cuadre-agentes-page.component.ts`; usa 7 componentes hijos: `app-page-header`, `app-icon`, `app-card`, `app-button`, `app-summary-tile`, `app-cuadre-cash-source`. | — | — | Media |
| [cuadre-agentes-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts"></a>

### bank-agents-page.component.ts

- **Ruta:** [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts`, 438 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-bank-agents`
- **Responsabilidad:** **Saldos dinámicos**: la columna "Saldo Actual" es `banks.final_balance`, que solo mueven las operaciones (Transaccionar, transferencias) y los ajustes manuales — el backend es la fuente de verdad, esta pantalla nunca lo calcula.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-balance-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-balance-draft-store-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [bank-balance.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-balance-service-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [cuadre-agentes.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-service-ts), [day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-day-status-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [zero-balances-confirm-modal.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-zero-balances-confirm-modal-zero-balances-confirm-modal-component-ts), [entry-confirm-modal.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-entry-confirm-modal-entry-confirm-modal-component-ts), [save-balances-confirm-modal.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-save-balances-confirm-modal-save-balances-confirm-modal-component-ts) y 1 más
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [bank-agents-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [bank-balance-amount.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts), [credit-line-summary.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-credit-line-summary-credit-line-summary-component-ts), [entry-confirm-modal.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-entry-confirm-modal-entry-confirm-modal-component-ts), [save-balances-confirm-modal.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-save-balances-confirm-modal-save-balances-confirm-modal-component-ts), [adjust-balance-modal.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-adjust-balance-modal-adjust-balance-modal-component-ts), [zero-balances-confirm-modal.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-zero-balances-confirm-modal-zero-balances-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="onDateChange($event)"`, `(click)="refreshBalances()"`, `(click)="reopenEntryModal()"`, `(change)="onFinalBalanceInput(row.bankId, $any($event.target).value)"`, `(click)="openAdjustModal(row)"`, `(click)="openZeroConfirmModal()"`, `(click)="openSaveConfirmModal()"`, `(confirmed)="confirmEntryModal()"`, `(cancelled)="cancelEntryModal()"`, `(confirmed)="confirmSaveChanges()"`, `(cancelled)="cancelSaveConfirm()"`, `(confirmed)="confirmAdjust($event)"`, `(cancelled)="cancelAdjust()"`, `(confirmed)="confirmZeroBalances()"`, `(cancelled)="cancelZeroConfirm()"`

#### Clase `BankAgentsPageComponent` (L64–437)

- **Decoradores:** `@Component({ selector: 'app-bank-agents-page', standalone: true, imports: [ FormsModule, PageHeaderComponent, ButtonComponent, IconComponent, DecimalInputDirecti`
- **Propósito:** **Saldos dinámicos**: la columna "Saldo Actual" es `banks.final_balance`, que solo mueven las operaciones (Transaccionar, transferencias) y los ajustes manuales — el backend es la fuente de verdad, esta pantalla nunca lo calcula. Para HOY, "Registrar saldos del día" guarda la foto diaria (necesaria para el cuadre/cierre) con el saldo actual de cada cuenta — ya no se teclea. Para una fecha pasada se conserva la corrección histórica de la foto tal cual existía (nunca toca el saldo actual). Corregir el saldo actual es "Ajustar saldo": solo admin, con motivo, auditado. All draft state (operation date + entered saldo final values) lives in `BankBalanceDraftStore`, a root-provided singleton persisted to `sessionStorage` — same pattern as `PurchaseDraftStore`/ `IceCreamPurchaseDraftStore`, see that store's own doc comment. Bank name/account number/tipo/saldo anterior are never persisted client-
- **Servicios inyectados con `inject()`:** `bankBalanceService = inject(BankBalanceService)`, `cuadreAgentesService = inject(CuadreAgentesService)`, `notificationService = inject(NotificationService)`, `dayStatusService = inject(DayStatusService)`, `bankService = inject(BankService)`, `draft = inject(BankBalanceDraftStore)`, `isAdmin = inject(AuthService).isAdmin`
- **Datos / estado que administra:** `adjustingRow = signal<BankBalanceView \| null>(null)`, `isAdjusting = signal(false)`, `rows = signal<BankBalanceView[]>([])`, `loading = signal(true)`, `isSaving = signal(false)`, `isRefreshingBalances = signal(false)`, `isZeroConfirmModalOpen = signal(false)`, `isSaveConfirmModalOpen = signal(false)`, `isEntryConfirmModalOpen = signal(false)`, `isOpeningDay = signal(false)`, `isTodayOperationDate = computed(() => this.draft.operationDate() === this`, `pastDateStatus = signal<DayStatus \| null>(null)`, `effectiveDayClosed = computed(() => this.isTodayOperationDate() ? this.`, `isEditingUnlocked = computed( () => (!this.isTodayOperationDate() \|\| t`, `hasExistingRecordsForDate = computed(() => this.rows().some((row) => row.final`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `confirmEntryModal` | método public | 176–191 | — | `void` |
| `cancelEntryModal` | método public | 193–198 | — | `void` |
| `reopenEntryModal` | método public | 201–203 | — | `void` |
| `onDateChange` | método public | 206–213 | `date: string` | `void` |
| `fetchPastDateStatusIfNeeded` | método private | 216–225 | — | `void` |
| `displayFinalBalance` | método public | 228–231 | `row: BankBalanceView` | `number \| null` |
| `onFinalBalanceInput` | método public | 233–246 | `bankId: string`, `value: string` | `void` |
| `canSave` | getter public | 249–256 | — | `boolean` |
| `openAdjustModal` | método public | 258–263 | `row: BankBalanceView` | `void` |
| `cancelAdjust` | método public | 265–270 | — | `void` |
| `confirmAdjust` | método public | 273–299 | `submission: AdjustBalanceSubmission` | `void` |
| `openSaveConfirmModal` | método public | 302–307 | — | `void` |
| `cancelSaveConfirm` | método public | 309–314 | — | `void` |
| `confirmSaveChanges` | método public | 326–364 | — | `void` |
| `openZeroConfirmModal` | método public | 373–378 | — | `void` |
| `cancelZeroConfirm` | método public | 380–382 | — | `void` |
| `confirmZeroBalances` | método public | 384–387 | — | `void` |
| `refreshBalances` | método public | 405–422 | — | `void` |
| `fetchBalances` | método private | 424–436 | — | `void` |

##### `BankAgentsPageComponent.confirmEntryModal`

- **Firma:** `confirmEntryModal(): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L176) (L176–191)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isOpeningDay`, `this.isOpeningDay.set`, `this.dayStatusService.openDay().subscribe`, `this.dayStatusService.openDay`, `this.isEntryConfirmModalOpen.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isOpeningDay.set`, `this.isEntryConfirmModalOpen.set`
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.cancelEntryModal`

- **Firma:** `cancelEntryModal(): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L193) (L193–198)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isOpeningDay`, `this.isEntryConfirmModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isEntryConfirmModalOpen.set`
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.reopenEntryModal`

- **Firma:** `reopenEntryModal(): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L201) (L201–203)
- **Propósito / descripción:** The one re-entry point after cancelling the opening modal — shows it again, without navigating or reloading anything.
- **Dependencias (llamadas en su cuerpo):** `this.isEntryConfirmModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isEntryConfirmModalOpen.set`
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.onDateChange`

- **Firma:** `onDateChange(date: string): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L206) (L206–213)
- **Propósito / descripción:** Picking another date must never mix its data with the previously viewed one — no local merge, just a full refetch scoped to the new date (same rule Recargas' own date picker follows).
- **Dependencias (llamadas en su cuerpo):** `this.draft.operationDate`, `this.draft.setOperationDate`, `this.fetchBalances`, `this.fetchPastDateStatusIfNeeded`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.fetchPastDateStatusIfNeeded`

- **Firma:** `fetchPastDateStatusIfNeeded(): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L216) (L216–225)
- **Propósito / descripción:** Only queries for a past date — today is already covered by the `DayStatusService` singleton.
- **Dependencias (llamadas en su cuerpo):** `this.isTodayOperationDate`, `this.pastDateStatus.set`, `this.cuadreAgentesService.getDayStatus(this.draft.operationDate()).subscribe`, `this.cuadreAgentesService.getDayStatus`, `this.draft.operationDate`
- **Efectos secundarios:** Actualiza estado (signals): `this.pastDateStatus.set`
- **Consumidores:** (mismo archivo)

##### `BankAgentsPageComponent.displayFinalBalance`

- **Firma:** `displayFinalBalance(row: BankBalanceView): number \| null` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L228) (L228–231)
- **Propósito / descripción:** The value to show in the saldo final input: an unsaved draft edit takes priority, otherwise whatever is already saved for this date (or blank for a bank with no entry yet).
- **Dependencias (llamadas en su cuerpo):** `this.draft.draftFinalBalances`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.onFinalBalanceInput`

- **Firma:** `onFinalBalanceInput(bankId: string, value: string): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L233) (L233–246)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `value.trim`, `this.draft.removeFinalBalance`, `parseFloat`, `this.rows().find`, `this.rows`, `isCreditLineAccount`, `Number.isNaN`, `this.draft.setFinalBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.canSave`

- **Firma:** `canSave(): boolean` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L249) (L249–256)
- **Propósito / descripción:** Hoy: la foto se toma del saldo actual (no hay nada que teclear). Fecha pasada: exige una edición pendiente, como siempre.
- **Dependencias (llamadas en su cuerpo):** `this.isEditingUnlocked`, `this.isTodayOperationDate`, `this.rows`, `this.draft.hasActiveDraft`, `this.isSaving`, `this.isRefreshingBalances`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankAgentsPageComponent.openAdjustModal`

- **Firma:** `openAdjustModal(row: BankBalanceView): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L258) (L258–263)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isAdmin`, `this.adjustingRow.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.adjustingRow.set`
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.cancelAdjust`

- **Firma:** `cancelAdjust(): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L265) (L265–270)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isAdjusting`, `this.adjustingRow.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.adjustingRow.set`
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.confirmAdjust`

- **Firma:** `confirmAdjust(submission: AdjustBalanceSubmission): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L273) (L273–299)
- **Propósito / descripción:** El backend valida permisos, saldo negativo y registra el AJUSTE_MANUAL; aquí solo se refresca la tabla con lo que quedó guardado.
- **Dependencias (llamadas en su cuerpo):** `this.adjustingRow`, `this.isAdjusting`, `this.isAdjusting.set`, `this.bankService.adjustBalance`, `this.adjustingRow.set`, `this.notificationService.success`, `formatSignedBankBalance`, `this.refreshBalances`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isAdjusting.set`, `this.adjustingRow.set`
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.openSaveConfirmModal`

- **Firma:** `openSaveConfirmModal(): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L302) (L302–307)
- **Propósito / descripción:** "Guardar Cambios" now opens the confirmation (Step 3) instead of saving directly — the actual save happens in `confirmSaveChanges()`.
- **Dependencias (llamadas en su cuerpo):** `this.isSaveConfirmModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaveConfirmModalOpen.set`
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.cancelSaveConfirm`

- **Firma:** `cancelSaveConfirm(): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L309) (L309–314)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.isSaveConfirmModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaveConfirmModalOpen.set`
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.confirmSaveChanges`

- **Firma:** `confirmSaveChanges(): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L326) (L326–364)
- **Propósito / descripción:** "Confirmar y Guardar": sends exactly what was typed as one atomic batch, then — same reset-after-save rule already used for Recargas Electrónicas — clears the temporary draft and re-fetches the real saldo anterior/saldo final straight from the database instead of trusting any client-side computation. If the saved date is today, it also refreshes `DayStatusService` — this is what enables the Cuadre Agentes link in the Sidebar immediately, without reloading anything manually.
- **Dependencias (llamadas en su cuerpo):** `this.hasExistingRecordsForDate`, `this.isTodayOperationDate`, `this.rows().map`, `this.rows`, `Object.entries(this.draft.draftFinalBalances()).map`, `Object.entries`, `this.draft.draftFinalBalances`, `this.isSaving.set`, `this.bankBalanceService.saveBalances`, `this.draft.operationDate`, `this.isSaveConfirmModalOpen.set`, `this.draft.reset`, `this.notificationService.success`, `this.fetchBalances`, `this.dayStatusService.refresh`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.isSaveConfirmModalOpen.set`
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.openZeroConfirmModal`

- **Firma:** `openZeroConfirmModal(): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L373) (L373–378)
- **Propósito / descripción:** "Poner Saldos en Cero" — only opens if banks are loaded and editing is unlocked; never touches the database on its own (see `ZeroBalancesConfirmModalComponent` and `BankBalanceDraftStore.zeroAll`). The user still needs to press "Guardar Cambios" and confirm for the zeros to be persisted.
- **Dependencias (llamadas en su cuerpo):** `this.loading`, `this.rows`, `this.isEditingUnlocked`, `this.isTodayOperationDate`, `this.isZeroConfirmModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isZeroConfirmModalOpen.set`
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.cancelZeroConfirm`

- **Firma:** `cancelZeroConfirm(): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L380) (L380–382)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isZeroConfirmModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isZeroConfirmModalOpen.set`
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.confirmZeroBalances`

- **Firma:** `confirmZeroBalances(): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L384) (L384–387)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.zeroAll`, `this.rows().map`, `this.rows`, `this.isZeroConfirmModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isZeroConfirmModalOpen.set`
- **Consumidores:** `bank-agents-page.component.html` (plantilla)

##### `BankAgentsPageComponent.refreshBalances`

- **Firma:** `refreshBalances(): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L405) (L405–422)
- **Propósito / descripción:** "Actualizar Saldos" — re-reads `GET /banks/balances` for the selected date without reloading the page, same as the identical button in Cuadre Agentes. Doesn't touch `loading` (that would hide the whole table behind the initial loading skeleton) or `BankBalanceDraftStore`'s draft: `displayFinalBalance()` already prioritizes the unsaved draft over `row.finalBalance`, so refreshing `rows` never overwrites a balance the user hasn't saved yet — "Guardar Cambios" keeps working exactly the same after refreshing. Also blocked while `isSaving()` is in progress — without this, a refresh triggered right before or during a save could respond *after* `confirmSaveChanges()`'s own refetch and leave the pre
- **Dependencias (llamadas en su cuerpo):** `this.isRefreshingBalances`, `this.isSaving`, `this.isRefreshingBalances.set`, `this.bankBalanceService.getBalancesView(this.draft.operationDate()).subscribe`, `this.bankBalanceService.getBalancesView`, `this.draft.operationDate`, `this.rows.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isRefreshingBalances.set`, `this.rows.set`
- **Consumidores:** `bank-agents-page.component.html` (plantilla), (mismo archivo)

##### `BankAgentsPageComponent.fetchBalances`

- **Firma:** `fetchBalances(): void` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L424) (L424–436)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.bankBalanceService.getBalancesView(this.draft.operationDate()).subscribe`, `this.bankBalanceService.getBalancesView`, `this.draft.operationDate`, `this.rows.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.rows.set`
- **Consumidores:** (mismo archivo)

#### Función `todayIsoDate` (L32–38)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [bank-agents-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts#L32)
- **Propósito / descripción:** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique every other date-driven page in this app already uses (Recargas, Reports).
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-adjust-balance-modal-adjust-balance-modal-component-ts"></a>

### adjust-balance-modal.component.ts

- **Ruta:** [adjust-balance-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/adjust-balance-modal/adjust-balance-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/adjust-balance-modal/adjust-balance-modal.component.ts`, 122 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-bank-agents`
- **Responsabilidad:** "Ajustar saldo" — solo se muestra a admin/super_admin (y el backend lo vuelve a exigir).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [bank-agents-page.component.ts (plantilla)](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts) (plantilla)
- **Plantilla:** [adjust-balance-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/adjust-balance-modal/adjust-balance-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [bank-balance-amount.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="onCancel()"`, `(ngModelChange)="onNewBalanceChange($event)"`, `(ngModelChange)="reason.set($event)"`, `(ngModelChange)="observation.set($event)"`, `(click)="onConfirm()"`

**Interfaces, tipos y enums:**

- `interface AdjustBalanceSubmission` (L12): sin documentación — miembros: `newBalance`, `reason`, `observation`

#### Clase `AdjustBalanceModalComponent` (L31–121)

- **Decoradores:** `@Component({ selector: 'app-adjust-balance-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, BankBalanceAmo`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Ajustar saldo" — solo se muestra a admin/super_admin (y el backend lo vuelve a exigir). Nunca sobrescribe: el padre llama al endpoint de ajuste, que registra un movimiento AJUSTE_MANUAL con saldo anterior, nuevo saldo, motivo, observación, usuario y fecha. No se cierra al hacer clic fuera: solo X, Cancelar o Confirmar.
- **Datos / estado que administra:** `@Input open = false`, `@Input row = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<AdjustBalanceSubmission>()`, `@Output cancelled = new EventEmitter<void>()`, `newBalance = signal<number \| null>(null)`, `reason = signal('')`, `observation = signal('')`, `difference = computed(() => { const target = this.newBalance();`, `validationMessage = computed(() => { const target = this.newBalance();`, `canConfirm = computed( () => this.newBalance() !== null && this`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isCreditLine` | método public | 54–56 | — | `boolean` |
| `allowsNegative` | método public | 58–60 | — | `boolean` |
| `ngOnChanges` | método public | 95–101 | `changes: SimpleChanges` | `void` |
| `onNewBalanceChange` | método public | 103–105 | `value: number \| null` | `void` |
| `onCancel` | método public | 107–110 | — | `void` |
| `onConfirm` | método public | 112–120 | — | `void` |

##### `AdjustBalanceModalComponent.isCreditLine`

- **Firma:** `isCreditLine(): boolean` — [adjust-balance-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/adjust-balance-modal/adjust-balance-modal.component.ts#L54) (L54–56)
- **Propósito / descripción:** BI Club Empresarial = línea de crédito: su saldo va de -límite a Q0.00.
- **Dependencias (llamadas en su cuerpo):** `isCreditLineAccount`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `adjust-balance-modal.component.html` (plantilla), (mismo archivo)

##### `AdjustBalanceModalComponent.allowsNegative`

- **Firma:** `allowsNegative(): boolean` — [adjust-balance-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/adjust-balance-modal/adjust-balance-modal.component.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isCreditLine`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `adjust-balance-modal.component.html` (plantilla)

##### `AdjustBalanceModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [adjust-balance-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/adjust-balance-modal/adjust-balance-modal.component.ts#L95) (L95–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newBalance.set`, `this.reason.set`, `this.observation.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.newBalance.set`, `this.reason.set`, `this.observation.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AdjustBalanceModalComponent.onNewBalanceChange`

- **Firma:** `onNewBalanceChange(value: number \| null): void` — [adjust-balance-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/adjust-balance-modal/adjust-balance-modal.component.ts#L103) (L103–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newBalance.set`, `Number.isNaN`, `round2`
- **Efectos secundarios:** Actualiza estado (signals): `this.newBalance.set`
- **Consumidores:** `adjust-balance-modal.component.html` (plantilla)

##### `AdjustBalanceModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [adjust-balance-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/adjust-balance-modal/adjust-balance-modal.component.ts#L107) (L107–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cancelled.emit`
- **Efectos secundarios:** Emite eventos: `this.cancelled.emit`
- **Consumidores:** `adjust-balance-modal.component.html` (plantilla)

##### `AdjustBalanceModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [adjust-balance-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/adjust-balance-modal/adjust-balance-modal.component.ts#L112) (L112–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newBalance`, `this.canConfirm`, `this.confirmed.emit`, `this.reason().trim`, `this.reason`, `this.observation().trim`, `this.observation`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `adjust-balance-modal.component.html` (plantilla)

#### Función `round2` (L20–22)

- **Tipo:** función local del archivo
- **Firma:** `round2(value: number): number` — [adjust-balance-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/adjust-balance-modal/adjust-balance-modal.component.ts#L20)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-agent-reconciliation-confirm-modal-agent-reconciliation-confirm-modal-component-ts"></a>

### agent-reconciliation-confirm-modal.component.ts

- **Ruta:** [agent-reconciliation-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/agent-reconciliation-confirm-modal/agent-reconciliation-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/agent-reconciliation-confirm-modal/agent-reconciliation-confirm-modal.component.ts`, 33 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-bank-agents`
- **Responsabilidad:** Dumb — the parent (`CuadreAgentesPageComponent`) owns the actual `registerReconciliation` call, same pattern as `FinalBalanceConfirmModalComponent`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [cuadre-agentes-page.component.ts (plantilla)](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts) (plantilla)
- **Plantilla:** [agent-reconciliation-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/agent-reconciliation-confirm-modal/agent-reconciliation-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `AgentReconciliationConfirmModalComponent` (L7–32)

- **Decoradores:** `@Component({ selector: 'app-agent-reconciliation-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './agent-reconciliatio`
- **Propósito:** Dumb — the parent (`CuadreAgentesPageComponent`) owns the actual `registerReconciliation` call, same pattern as `FinalBalanceConfirmModalComponent`.
- **Datos / estado que administra:** `@Input open = false`, `@Input totalCash = 0`, `@Input totalBanks = 0`, `@Input totalAssets = 0`, `@Input totalAccountsReceivable = 0`, `@Input result = 0`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `resultStatus` | getter public | 29–31 | — | `CuadreResultStatus` |

##### `AgentReconciliationConfirmModalComponent.resultStatus`

- **Firma:** `resultStatus(): CuadreResultStatus` — [agent-reconciliation-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/agent-reconciliation-confirm-modal/agent-reconciliation-confirm-modal.component.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `getCuadreResultStatus`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-cuadre-cash-source-cuadre-cash-source-component-ts"></a>

### cuadre-cash-source.component.ts

- **Ruta:** [cuadre-cash-source.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/cuadre-cash-source/cuadre-cash-source.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/cuadre-cash-source/cuadre-cash-source.component.ts`, 46 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-bank-agents`
- **Responsabilidad:** Cuadre Agentes → Conteo de Efectivo: the "Cargar último arqueo de Caja" / "Limpiar" actions and the origin banner of the breakdown being edited — "Conteo manual", "Último arqueo de Caja" (number, date/time, bank day, user, counted total) or "Modificado manualmente después de cargar arqueo".
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [cuadre-agentes-page.component.ts (plantilla)](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts) (plantilla)
- **Plantilla:** [cuadre-cash-source.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/cuadre-cash-source/cuadre-cash-source.component.html) · **Usa componentes:** [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="loadLatest.emit()"`, `(click)="clear.emit()"`

#### Clase `CuadreCashSourceComponent` (L16–45)

- **Decoradores:** `@Component({ selector: 'app-cuadre-cash-source', standalone: true, imports: [DatePipe, ButtonComponent, IconComponent], templateUrl: './cuadre-cash-source.compon`
- **Propósito:** Cuadre Agentes → Conteo de Efectivo: the "Cargar último arqueo de Caja" / "Limpiar" actions and the origin banner of the breakdown being edited — "Conteo manual", "Último arqueo de Caja" (number, date/time, bank day, user, counted total) or "Modificado manualmente después de cargar arqueo". An arqueo from an earlier bank day is always flagged as such, never shown as today's count. Presentational only: the page owns the state and the confirmation before replacing quantities.
- **Datos / estado que administra:** `@Input origin: CashBreakdownOrigin`, `@Input hasQuantities = false`, `@Input loading = false`, `@Input disabled = false`, `@Output loadLatest = new EventEmitter<void>()`, `@Output clear = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `cutName` | método public | 36–38 | `cutNumber: 1 \| 2 \| null` | `string` |
| `formatDay` | método public | 41–44 | `value: string` | `string` |

##### `CuadreCashSourceComponent.cutName`

- **Firma:** `cutName(cutNumber: 1 \| 2 \| null): string` — [cuadre-cash-source.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/cuadre-cash-source/cuadre-cash-source.component.ts#L36) (L36–38)
- **Propósito / descripción:** "Primer corte · mediodía" / "Segundo corte · final del día" (same labels as Control de Efectivo).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cuadre-cash-source.component.html` (plantilla)

##### `CuadreCashSourceComponent.formatDay`

- **Firma:** `formatDay(value: string): string` — [cuadre-cash-source.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/cuadre-cash-source/cuadre-cash-source.component.ts#L41) (L41–44)
- **Propósito / descripción:** `yyyy-MM-dd` → `dd/MM/yyyy` without a Date round-trip (a plain date must not shift by time zone).
- **Dependencias (llamadas en su cuerpo):** `value.split`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cuadre-cash-source.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-entry-confirm-modal-entry-confirm-modal-component-ts"></a>

### entry-confirm-modal.component.ts

- **Ruta:** [entry-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/entry-confirm-modal/entry-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/entry-confirm-modal/entry-confirm-modal.component.ts`, 26 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-bank-agents`
- **Responsabilidad:** "Apertura del Día" — dumb, the parent (`BankAgentsPageComponent`) owns the actual `POST /banks/day-status/open` call on confirm.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [bank-agents-page.component.ts (plantilla)](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts) (plantilla)
- **Plantilla:** [entry-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/entry-confirm-modal/entry-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `EntryConfirmModalComponent` (L11–25)

- **Decoradores:** `@Component({ selector: 'app-entry-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './entry-confirm-modal.component.html`
- **Propósito:** "Apertura del Día" — dumb, the parent (`BankAgentsPageComponent`) owns the actual `POST /banks/day-status/open` call on confirm. "Cancelar" only closes this modal; it never navigates or deletes anything, since nothing was opened yet.
- **Datos / estado que administra:** `@Input open = false`, `@Input isOpening = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-pending-balances-modal-pending-balances-modal-component-ts"></a>

### pending-balances-modal.component.ts

- **Ruta:** [pending-balances-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/pending-balances-modal/pending-balances-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/pending-balances-modal/pending-balances-modal.component.ts`, 30 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-bank-agents`
- **Responsabilidad:** Dumb — the parent (`CuadreAgentesPageComponent`) owns the validation and when to show it.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`
- **Consumidores:** —
- **Plantilla:** [pending-balances-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/pending-balances-modal/pending-balances-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="dismissed.emit()"`

#### Clase `PendingBalancesModalComponent` (L15–29)

- **Decoradores:** `@Component({ selector: 'app-pending-balances-modal', standalone: true, imports: [ButtonComponent, IconComponent, RouterLink], templateUrl: './pending-balances-mo`
- **Propósito:** Dumb — the parent (`CuadreAgentesPageComponent`) owns the validation and when to show it. "Permanecer aquí" only closes the modal (the real block lives in the "Guardar Cuadre" button, not here); "Ir a registrar saldos" navigates to Agentes Bancarios → Bancos, which already operates on "today" by default — the same implicit date Cuadre Agentes uses, so the date is never lost across the navigation.
- **Datos / estado que administra:** `@Input open = false`, `@Input date = ''`, `@Input missingBanks = []`, `@Output dismissed = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-save-balances-confirm-modal-save-balances-confirm-modal-component-ts"></a>

### save-balances-confirm-modal.component.ts

- **Ruta:** [save-balances-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/save-balances-confirm-modal/save-balances-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/save-balances-confirm-modal/save-balances-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-bank-agents`
- **Responsabilidad:** Dumb — the parent (`BankAgentsPageComponent`) owns the actual save; this modal only confirms the intent.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [bank-agents-page.component.ts (plantilla)](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts) (plantilla)
- **Plantilla:** [save-balances-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/save-balances-confirm-modal/save-balances-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `SaveBalancesConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-save-balances-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './save-balances-confirm-moda`
- **Propósito:** Dumb — the parent (`BankAgentsPageComponent`) owns the actual save; this modal only confirms the intent.
- **Datos / estado que administra:** `@Input open = false`, `@Input date = ''`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-zero-balances-confirm-modal-zero-balances-confirm-modal-component-ts"></a>

### zero-balances-confirm-modal.component.ts

- **Ruta:** [zero-balances-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/zero-balances-confirm-modal/zero-balances-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/zero-balances-confirm-modal/zero-balances-confirm-modal.component.ts`, 20 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-bank-agents`
- **Responsabilidad:** Dumb — the parent (`BankAgentsPageComponent`) owns applying the zeros to the draft; this modal only confirms the intent.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [bank-agents-page.component.ts (plantilla)](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts) (plantilla)
- **Plantilla:** [zero-balances-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/zero-balances-confirm-modal/zero-balances-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `ZeroBalancesConfirmModalComponent` (L6–19)

- **Decoradores:** `@Component({ selector: 'app-zero-balances-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './zero-balances-confirm-moda`
- **Propósito:** Dumb — the parent (`BankAgentsPageComponent`) owns applying the zeros to the draft; this modal only confirms the intent.
- **Datos / estado que administra:** `@Input open = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-spec-ts"></a>

### cuadre-agentes-page.component.spec.ts

- **Ruta:** [cuadre-agentes-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.spec.ts`, 175 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-bank-agents`
- **Responsabilidad:** Prueba unitaria: declara `latest`, `ACCEPTANCE` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-custody.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-custody-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [cuadre-agentes.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-service-ts), [cuadre-agentes-state.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-state-service-ts), [day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-day-status-service-ts), [bank-balance-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-balance-draft-store-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** —
#### Función `latest` (L24–45)

- **Tipo:** función local del archivo
- **Firma:** `latest(isFromReferenceDay?): LatestCashCountResponse` — [cuadre-agentes-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.spec.ts#L24)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `ACCEPTANCE.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts"></a>

### cuadre-agentes-page.component.ts

- **Ruta:** [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts`, 456 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-bank-agents`
- **Responsabilidad:** "Cuadre Agentes" — second stage: adds the Resumen del Cuadre (with the live result, colored by its sign) and "Guardar Cuadre", which persists a historical record to `agent_reconciliations` via `POST /agent-reconciliations`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cuadre-agentes.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-service-ts), [cuadre-agentes-state.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-state-service-ts), [cash-custody.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-custody-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-day-status-service-ts), [bank-balance-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-balance-draft-store-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [agent-reconciliation-confirm-modal.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-agent-reconciliation-confirm-modal-agent-reconciliation-confirm-modal-component-ts), [cuadre-cash-source.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-cuadre-cash-source-cuadre-cash-source-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts), [cuadre-agentes-page.component.spec.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-spec-ts)
- **Plantilla:** [cuadre-agentes-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts), [cuadre-cash-source.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-cuadre-cash-source-cuadre-cash-source-component-ts), [agent-reconciliation-confirm-modal.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-agent-reconciliation-confirm-modal-agent-reconciliation-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="resetToToday()"`, `(click)="refreshBankSummary()"`, `(loadLatest)="loadLatestCount()"`, `(clear)="clearCount()"`, `(input)="onQuantityInput(denomination, $any($event.target).value)"`, `(click)="openConfirmModal()"`, `(confirmed)="confirmSaveCuadre()"`, `(cancelled)="cancelConfirm()"`

**Constantes exportadas:**

- `NO_SECOND_CUT_MESSAGE` (L36): Shown when no "Segundo corte · final del día" has been finished yet. = `'No hay un Segundo corte (final del día) finalizado en Control de Efectivo. Puede ingresar el conteo manualmen`
- `REPLACE_WITH_COUNT_MESSAGE` (L40): Confirmation copy before an arqueo replaces quantities typed by hand. = `'Ya existen cantidades ingresadas manualmente. ¿Desea reemplazarlas con el desglose del último arqueo de Caja?`

#### Clase `CuadreAgentesPageComponent` (L91–455)

- **Decoradores:** `@Component({ selector: 'app-cuadre-agentes-page', standalone: true, imports: [ DatePipe, PageHeaderComponent, CardComponent, IconComponent, SummaryTileComponent,`
- **Propósito:** "Cuadre Agentes" — second stage: adds the Resumen del Cuadre (with the live result, colored by its sign) and "Guardar Cuadre", which persists a historical record to `agent_reconciliations` via `POST /agent-reconciliations`. The backend recomputes `totalBanks`/`totalAssets`/`totalAccountsReceivable`/`result` independently on save — only `totalCash` actually travels as this frontend's own decision (see `CreateAgentReconciliationUseCase`); the value shown here before saving is just a live preview, the same pattern already established in `SalesSummaryCardComponent`. The cash count is held in `CuadreAgentesStateService` (a `providedIn: 'root'` singleton, the same pattern as `PurchaseDraftStore`/ Reportería's own state services) so it survives navigation within the dashboard without needing `sessionStorage` yet — see that service's own comment. **Operation date**: this screen has no date picke
- **Servicios inyectados con `inject()`:** `cuadreAgentesService = inject(CuadreAgentesService)`, `state = inject(CuadreAgentesStateService)`, `dayStatusService = inject(DayStatusService)`, `draft = inject(BankBalanceDraftStore)`, `notificationService = inject(NotificationService)`, `cashCustodyService = inject(CashCustodyService)`, `confirmDialog = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `isTodayOperationDate = computed(() => this.draft.operationDate() === this`, `cashCounts = this.state.cashCounts`, `cashOrigin = this.state.origin`, `hasQuantities = this.state.hasQuantities`, `isLoadingCount = signal(false)`, `summary = signal<CuadreAgentesSummary \| null>(null)`, `loading = signal(true)`, `isConfirmModalOpen = signal(false)`, `isSaving = signal(false)`, `isRefreshingBanks = signal(false)`, `bankBalancesValidation = signal<BankBalancesValidation \| null>(null)`, `isValidatingBankBalances = signal(true)`, `dayOpened = computed(() => this.dayStatusService.status()?.isO`, `dayClosed = computed(() => this.dayStatusService.status()?.isC`, `totalCash = computed(() => calculateTotalCash(this.cashCounts(`, `resultCuadre = computed(() => { const summary = this.summary(); i`, `resultStatus = computed<CuadreResultStatus>(() => getCuadreResult`, `resultIcon = computed(() => STATUS_ICON[this.resultStatus()])`, `resultText = computed(() => STATUS_TEXT[this.resultStatus()])`, `canSaveCuadre = computed( () => !!this.summary() && !this.isSaving`, `canAccessReconciliation = computed( () => !this.loading() && !this.isValidat`, `isCheckingAccess = computed( () => this.loading() \|\| this.isValidatin`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `validateBankBalances` | método private | 192–206 | — | `void` |
| `fetchSummary` | método private | 208–222 | — | `void` |
| `refreshBankSummary` | método public | 240–257 | — | `void` |
| `rowTotal` | método public | 259–261 | `denomination: CashDenomination` | `number` |
| `loadLatestCount` | método public async | 271–324 | — | `Promise<void>` |
| `clearCount` | método public | 327–329 | — | `void` |
| `onQuantityInput` | método public | 336–348 | `denomination: CashDenomination`, `value: string` | `void` |
| `openConfirmModal` | método public | 351–356 | — | `void` |
| `resetToToday` | método public | 393–397 | — | `void` |
| `cancelConfirm` | método public | 399–404 | — | `void` |
| `buildReconciliationInput` | método public | 410–419 | — | `RegisterAgentReconciliationInput` |
| `confirmSaveCuadre` | método public | 429–454 | — | `void` |

##### `CuadreAgentesPageComponent.validateBankBalances`

- **Firma:** `validateBankBalances(): void` — [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts#L192) (L192–206)
- **Propósito / descripción:** Runs automatically on entering the module (constructor) — Angular destroys and recreates this component on every navigation to this route, so "Ir a registrar saldos" → save in Bancos → come back here already triggers this same call again with no extra code needed ("no manual browser reload required").
- **Dependencias (llamadas en su cuerpo):** `this.isValidatingBankBalances.set`, `this.cuadreAgentesService.validateBankBalances(this.draft.operationDate()).subscribe`, `this.cuadreAgentesService.validateBankBalances`, `this.draft.operationDate`, `this.bankBalancesValidation.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isValidatingBankBalances.set`, `this.bankBalancesValidation.set`
- **Consumidores:** (mismo archivo)

##### `CuadreAgentesPageComponent.fetchSummary`

- **Firma:** `fetchSummary(): void` — [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts#L208) (L208–222)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.cuadreAgentesService.getSummary().subscribe`, `this.cuadreAgentesService.getSummary`, `this.summary.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.summary.set`
- **Consumidores:** (mismo archivo)

##### `CuadreAgentesPageComponent.refreshBankSummary`

- **Firma:** `refreshBankSummary(): void` — [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts#L240) (L240–257)
- **Propósito / descripción:** "Actualizar Saldos" — re-reads the same read-only endpoint (`GET /banks/cuadre-agentes-summary`) `fetchSummary` already uses, without touching the `loading` signal that controls the initial loading skeleton: the previously shown banks/totals stay visible while the request is in flight, and remain intact if it fails. Never reads or writes `CuadreAgentesStateService` — the cash count is a completely separate piece of state this refresh has no reason to touch. Also blocked while `isSaving()` is in progress — without this, a refresh triggered right before or during "Guardar Cuadre" could respond *after* `confirmSaveCuadre()`'s own refetch and leave the previous summary on screen, giving the fals
- **Dependencias (llamadas en su cuerpo):** `this.isRefreshingBanks`, `this.isSaving`, `this.isRefreshingBanks.set`, `this.cuadreAgentesService.getSummary().subscribe`, `this.cuadreAgentesService.getSummary`, `this.summary.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isRefreshingBanks.set`, `this.summary.set`
- **Consumidores:** `cuadre-agentes-page.component.html` (plantilla)

##### `CuadreAgentesPageComponent.rowTotal`

- **Firma:** `rowTotal(denomination: CashDenomination): number` — [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts#L259) (L259–261)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `denominationSubtotal`, `this.cashCounts`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cuadre-agentes-page.component.html` (plantilla)

##### `CuadreAgentesPageComponent.loadLatestCount`

- **Firma:** `loadLatestCount(): Promise<void>` — [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts#L271) (L271–324)
- **Propósito / descripción:** "Cargar último arqueo de Caja": copies the breakdown of the "Segundo corte · final del día" (chosen by the backend; both cuts are never added up) into the form (Q0.01 completed with 0 on older arqueos) — the arqueo itself is only read. Quantities typed by hand are never replaced without confirmation; reloading an untouched arqueo needs none. An arqueo of an earlier bank day loads with a visible warning.
- **Dependencias (llamadas en su cuerpo):** `this.isLoadingCount`, `this.cashOrigin`, `this.hasQuantities`, `this.confirmDialog.confirm`, `this.isLoadingCount.set`, `this.cashCustodyService.getLatestCount(this.draft.operationDate()).subscribe`, `this.cashCustodyService.getLatestCount`, `this.draft.operationDate`, `this.notificationService.info`, `this.state.loadFromCount`, `cashCountFromRows`, `this.notificationService.success`, `this.notificationService.warning`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isLoadingCount.set`
- **Consumidores:** `cuadre-agentes-page.component.html` (plantilla)

##### `CuadreAgentesPageComponent.clearCount`

- **Firma:** `clearCount(): void` — [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts#L327) (L327–329)
- **Propósito / descripción:** "Limpiar": empties every quantity and starts a new manual count.
- **Dependencias (llamadas en su cuerpo):** `this.state.clear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cuadre-agentes-page.component.html` (plantilla)

##### `CuadreAgentesPageComponent.onQuantityInput`

- **Firma:** `onQuantityInput(denomination: CashDenomination, value: string): void` — [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts#L336) (L336–348)
- **Propósito / descripción:** Whole quantities only (the `appDecimalInput` directive already blocks decimals at the keystroke level); empty, negative or invalid → 0. After loading an arqueo, any change marks the breakdown as modified.
- **Dependencias (llamadas en su cuerpo):** `value.trim`, `this.state.setCount`, `Number`, `Number.isFinite`, `Math.trunc`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cuadre-agentes-page.component.html` (plantilla)

##### `CuadreAgentesPageComponent.openConfirmModal`

- **Firma:** `openConfirmModal(): void` — [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts#L351) (L351–356)
- **Propósito / descripción:** Never opens the confirmation modal if the backend's pre-check hasn't yet confirmed this date can be reconciled — see `canSaveCuadre`.
- **Dependencias (llamadas en su cuerpo):** `this.canSaveCuadre`, `this.isConfirmModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isConfirmModalOpen.set`
- **Consumidores:** `cuadre-agentes-page.component.html` (plantilla)

##### `CuadreAgentesPageComponent.resetToToday`

- **Firma:** `resetToToday(): void` — [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts#L393) (L393–397)
- **Propósito / descripción:** Resets the SHARED operation date back to today — also clears Bancos' own in-progress saldo-final drafts (`BankBalanceDraftStore.setOperationDate`'s own rule: switching dates is always a clean slate, never a merge).
- **Dependencias (llamadas en su cuerpo):** `this.draft.setOperationDate`, `this.fetchSummary`, `this.validateBankBalances`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cuadre-agentes-page.component.html` (plantilla)

##### `CuadreAgentesPageComponent.cancelConfirm`

- **Firma:** `cancelConfirm(): void` — [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts#L399) (L399–404)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.isConfirmModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isConfirmModalOpen.set`
- **Consumidores:** `cuadre-agentes-page.component.html` (plantilla)

##### `CuadreAgentesPageComponent.buildReconciliationInput`

- **Firma:** `buildReconciliationInput(): RegisterAgentReconciliationInput` — [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts#L410) (L410–419)
- **Propósito / descripción:** The cuadre request: the total plus the exact breakdown used and its origin (the backend re-checks the sum and stores it as a photograph).
- **Dependencias (llamadas en su cuerpo):** `this.cashOrigin`, `this.totalCash`, `this.draft.operationDate`, `this.state.details`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `CuadreAgentesPageComponent.confirmSaveCuadre`

- **Firma:** `confirmSaveCuadre(): void` — [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts#L429) (L429–454)
- **Propósito / descripción:** "Guardar Cuadre" now also closes the day — a single atomic call on the backend (`CloseAgentDayUseCase`/`close_agent_day`). `dayStatusService.refresh()` is what makes the Sidebar and this same page react immediately: `dayClosed()`'s next `computed` turns `true` with no browser reload, and the page falls into the "Día Cerrado" branch of the template on its own.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.isSaving.set`, `this.cuadreAgentesService.registerReconciliation`, `this.buildReconciliationInput`, `this.isConfirmModalOpen.set`, `this.state.reset`, `this.notificationService.success`, `this.dayStatusService.refresh`, `this.fetchSummary`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.isConfirmModalOpen.set`
- **Consumidores:** `cuadre-agentes-page.component.html` (plantilla)

#### Función `todayIsoDate` (L56–62)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [cuadre-agentes-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts#L56)
- **Propósito / descripción:** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique every other date-driven page in this app already uses (Recargas, Reports, Bancos).
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

