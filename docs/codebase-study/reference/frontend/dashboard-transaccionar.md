# Frontend `dashboard-transaccionar`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [bank-fly-effect.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-fly-effect-bank-fly-effect-component-ts) | .ts | Componente Angular | Feature (pantalla) | Efecto de selección de banco en Transaccionar: el icono parte de su posición real en la tarjeta, viene al centro, crece hasta rebasar la pantalla y se disuelve con un destello ("la atraviesa"). | 0 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [bank-picker-modal.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-picker-modal-bank-picker-modal-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `agent`, `account`, `AGENTS`, `ACCOUNTS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 0 | Soporte (pruebas) |
| [bank-picker-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-picker-modal-bank-picker-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Paso previo de Depósito / Retiro / Reintegro: elegir el banco por su icono. | 6 internas; ext.: @angular/core | 3 | Media (3 consumidores) |
| [cash-breakdown-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Efectivo" — the fixed 11-row denomination breakdown; quantity per row is the only editable value, subtotal and the running total are always derived, never entered directly. | 4 internas; ext.: @angular/core | 16 | Alta (16 consumidores) |
| [change-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-change-confirm-modal-change-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Confirmar Vuelto" — deliberately does NOT close on a backdrop click (per the ticket's own explicit requirement: giving change to a client is a real-money action, not something to lose by an accidental outside click). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [commission-summary-card.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-commission-summary-card-commission-summary-card-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Comisión Estimada" — sits alongside "Resumen Diario"/"Resumen Mes en Curso" on Transaccionar's own type-picker dashboard. | 2 internas; ext.: @angular/core | 3 | Media (3 consumidores) |
| [cuadre-result-card.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cuadre-result-card-cuadre-result-card-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Resultado del Cuadre" — Total esperado / Total contado / Diferencia / Estado, all derived from the exact same `totalAmount`/`totalCash`/ `cashStatus` signals `CashBreakdownTableComponent` already reads from `BankDepositDraftStore`. | 4 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [recent-transactions-card.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-recent-transactions-card-recent-transactions-card-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `movement` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core, @angular/router | 0 | Soporte (pruebas) |
| [recent-transactions-card.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-recent-transactions-card-recent-transactions-card-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Últimas transacciones" — Transaccionar's recent-activity card, now fed by the official physical-cash Kardex (`GET /cash-control/movements/recent`) instead of only Transaccionar operations. | 2 internas; ext.: @angular/core, @angular/router | 3 | Media (3 consumidores) |
| [save-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-save-confirm-modal-save-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Rich summary-before-save — a bespoke modal (not the generic `ConfirmDialogService`) because it needs to render the full cash breakdown and per-transaction list, which that service's plain string API can't express. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [status-indicator.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-status-indicator-status-indicator-component-ts) | .ts | Componente Angular | Feature (pantalla) | The one red/amarillo/verde semáforo used for both the cash-breakdown total and the transactions total, and again (worst-of-both) for the overall cuadre — colors are never the sole signal, per this app's own accessibility convention (see `SalesSummaryCardComponent`'s doc comment): icon + badge text carry the same information as the color. | 2 internas; ext.: @angular/core | 8 | Media (8 consumidores) |
| [transaction-distribution.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-distribution-transaction-distribution-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core | 0 | Soporte (pruebas) |
| [transaction-distribution.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-distribution-transaction-distribution-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Distribución de Transacciones" — an integer "cantidad de transacciones" (starts at 1, minimum 1) that generates that many amount rows. | 4 internas; ext.: @angular/core | 3 | Media (3 consumidores) |
| [transaction-summary-card.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-summary-card-transaction-summary-card-component-ts) | .ts | Componente Angular | Feature (pantalla) | One "Resumen Diario"/"Resumen del Mes en Curso" card — purely presentational over whatever `GET /bank-deposits/summary` already computed server-side (see `BankDepositService.getTransactionSummary()`); this component performs no aggregation of its own; "transacciones" here is `transactions` (already `SUM(transaction_count)` from the backend), never a client-side count/reduce over raw rows. | 2 internas; ext.: @angular/core | 4 | Media (4 consumidores) |
| [transaccionar-page.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `recent` (sin comentario de documentación en el código). | 9 internas; ext.: @angular/common, @angular/core, @angular/router, rxjs | 0 | Soporte (pruebas) |
| [transaccionar-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Transaccionar" — a two-step flow. | 29 internas; ext.: @angular/common, @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [bank-fly-effect.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-fly-effect/bank-fly-effect.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-picker-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-picker-modal.component.ts`; usa 4 componentes hijos: `app-icon`, `app-bank-balance-amount`, `app-button`, `app-bank-fly-effect`. | — | — | Media |
| [bank-picker-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cash-breakdown-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cash-breakdown-table/cash-breakdown-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cash-breakdown-table.component.ts`; usa 1 componentes hijos: `app-cuadre-status-indicator`. | — | — | Media |
| [cash-breakdown-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cash-breakdown-table/cash-breakdown-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [change-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/change-confirm-modal/change-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `change-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [change-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/change-confirm-modal/change-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [commission-summary-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/commission-summary-card/commission-summary-card.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `commission-summary-card.component.ts`; usa 1 componentes hijos: `app-card`. | — | — | Media |
| [commission-summary-card.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/commission-summary-card/commission-summary-card.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cuadre-result-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cuadre-result-card/cuadre-result-card.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cuadre-result-card.component.ts`; usa 3 componentes hijos: `app-card`, `app-cuadre-status-indicator`, `app-button`. | — | — | Media |
| [cuadre-result-card.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cuadre-result-card/cuadre-result-card.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recent-transactions-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recent-transactions-card.component.ts`; usa 2 componentes hijos: `app-card`, `app-icon`. | — | — | Media |
| [recent-transactions-card.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [save-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/save-confirm-modal/save-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `save-confirm-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-bank-balance-amount`, `app-button`. | — | — | Media |
| [save-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/save-confirm-modal/save-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [status-indicator.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/status-indicator/status-indicator.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `status-indicator.component.ts`; usa 2 componentes hijos: `app-badge`, `app-icon`. | — | — | Media |
| [status-indicator.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/status-indicator/status-indicator.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-distribution.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-distribution/transaction-distribution.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-distribution.component.ts`; usa 1 componentes hijos: `app-cuadre-status-indicator`. | — | — | Media |
| [transaction-distribution.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-distribution/transaction-distribution.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-summary-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-summary-card/transaction-summary-card.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-summary-card.component.ts`; usa 1 componentes hijos: `app-card`. | — | — | Media |
| [transaction-summary-card.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-summary-card/transaction-summary-card.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaccionar-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaccionar-page.component.ts`; usa 17 componentes hijos: `app-page-header`, `app-transaction-monthly-chart`, `app-transaction-summary-card`, `app-commission-summary-card`, `app-recent-transactions-card`, `app-bank-balance-strip`. | — | — | Media |
| [transaccionar-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-fly-effect-bank-fly-effect-component-ts"></a>

### bank-fly-effect.component.ts

- **Ruta:** [bank-fly-effect.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-fly-effect/bank-fly-effect.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-fly-effect/bank-fly-effect.component.ts`, 53 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** Efecto de selección de banco en Transaccionar: el icono parte de su posición real en la tarjeta, viene al centro, crece hasta rebasar la pantalla y se disuelve con un destello ("la atraviesa").
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [bank-picker-modal.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-picker-modal-bank-picker-modal-component-ts), [bank-picker-modal.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-picker-modal-bank-picker-modal-component-ts) (plantilla)

**Interfaces, tipos y enums:**

- `interface FlyingMark` (L4): Copia del icono elegido que vuela al frente (posición fija sobre la pantalla). — miembros: `left`, `top`, `size`, `dx`, `dy`, `scale`, `imageUrl`, `monogram`

#### Clase `BankFlyEffectComponent` (L22–52)

- **Decoradores:** `@Component({ selector: 'app-bank-fly-effect', standalone: true, template: ' <span class="fly-flash"></span> <span class="fly-mark" [class.fly-mark--image]="mark.`
- **Propósito:** Efecto de selección de banco en Transaccionar: el icono parte de su posición real en la tarjeta, viene al centro, crece hasta rebasar la pantalla y se disuelve con un destello ("la atraviesa"). Solo visual.
- **Datos / estado que administra:** `@Input mark: FlyingMark`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-picker-modal-bank-picker-modal-component-spec-ts"></a>

### bank-picker-modal.component.spec.ts

- **Ruta:** [bank-picker-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.spec.ts`, 202 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** Prueba unitaria: declara `agent`, `account`, `AGENTS`, `ACCOUNTS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-picker-modal.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-picker-modal-bank-picker-modal-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** —
#### Función `agent` (L6–17)

- **Tipo:** función local del archivo
- **Firma:** `agent(id: string, name: string, hasImage?): TransactionBank` — [bank-picker-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.spec.ts#L6)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `account` (L19–36)

- **Tipo:** función local del archivo
- **Firma:** `account(id: string, name: string, overrides?: Partial<Bank>): Bank` — [bank-picker-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.spec.ts#L19)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-picker-modal-bank-picker-modal-component-ts"></a>

### bank-picker-modal.component.ts

- **Ruta:** [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts`, 292 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** Paso previo de Depósito / Retiro / Reintegro: elegir el banco por su icono.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [transaction-bank-account.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-transaction-bank-account-util-ts), [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts), [transaction-bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-transaction-bank-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [bank-fly-effect.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-fly-effect-bank-fly-effect-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [bank-picker-modal.component.spec.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-picker-modal-bank-picker-modal-component-spec-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [transaccionar-page.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) (plantilla)
- **Plantilla:** [bank-picker-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [bank-balance-amount.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [bank-fly-effect.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-fly-effect-bank-fly-effect-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="cancel()"`, `(click)="$event.stopPropagation()"`, `(click)="chooseAccount(account, $event)"`, `(click)="choose(option, $event)"`, `(click)="backToBanks()"`

**Interfaces, tipos y enums:**

- `interface BankPickerSelection` (L28): sin documentación — miembros: `transactionBank`, `account`
- `interface BankPickerOption` (L33): sin documentación — miembros: `bank`, `monogram`, `imageUrl`, `balance`, `resolution`

#### Clase `BankPickerModalComponent` (L70–291)

- **Decoradores:** `@Component({ selector: 'app-bank-picker-modal', standalone: true, imports: [BankBalanceAmountComponent, BankFlyEffectComponent, ButtonComponent, IconComponent], `
- **Herencia / contratos:** implements OnChanges, OnDestroy
- **Propósito:** Paso previo de Depósito / Retiro / Reintegro: elegir el banco por su icono. La cuenta afectada la resuelve `resolveTransactionBankAccount()` (mapeo único) — si un banco tiene varias cuentas habilitadas (p. ej. GTC) se elige cuál aquí mismo, nunca se toma una por defecto. Dumb: solo emite la selección; el padre arranca el formulario. Cerrar/cancelar no inicia nada.
- **Datos / estado que administra:** `@Input open = false`, `@Input effect = null`, `@Input operationName = ''`, `@Input transactionBanks = []`, `@Input bankAccounts = []`, `@Input loading = false`, `@Input currentBankId = null`, `@Output picked = new EventEmitter<BankPickerSelection>()`, `@Output cancelled = new EventEmitter<void>()`, `inputs = signal<{ effect: TransactionTypeBalanceEffect \| nu`, `pendingOption = signal<BankPickerOption \| null>(null)`, `closing = signal(false)`, `picking = signal(false)`, `busy = computed(() => this.closing() \|\| this.picking())`, `selectedBankId = signal<string \| null>(null)`, `selectedAccountId = signal<string \| null>(null)`, `flyingMark = signal<FlyingMark \| null>(null)`, `title = computed(() => TITLES[this.inputs().effect ?? 'DEP`, `options = computed<BankPickerOption[]>(() => { const { effec`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 141–158 | `changes: SimpleChanges` | `void` |
| `ngOnDestroy` | método public | 160–164 | — | `void` |
| `onEscape` | método public | 166–176 | — | `void` |
| `choose` | método public | 178–190 | `option: BankPickerOption`, `event?: Event` | `void` |
| `chooseAccount` | método public | 192–200 | `account: Bank`, `event?: Event` | `void` |
| `backToBanks` | método public | 202–204 | — | `void` |
| `cancel` | método public | 206–211 | — | `void` |
| `pendingAccounts` | método public | 213–216 | — | `Bank[]` |
| `launchMark` | método private | 219–247 | `option: BankPickerOption`, `event?: Event` | `void` |
| `finish` | método private | 249–255 | `transactionBank: TransactionBank`, `account: Bank` | `void` |
| `closeThen` | método private | 257–272 | `callback: () => void`, `holdMs?` | `void` |
| `logProblems` | método private | 275–290 | — | `void` |

##### `BankPickerModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L141) (L141–158)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.inputs.set`, `this.closing.set`, `this.picking.set`, `this.pendingOption.set`, `this.selectedBankId.set`, `this.selectedAccountId.set`, `this.flyingMark.set`, `queueMicrotask`, `this.dialog()?.nativeElement.focus`, `this.dialog`, `this.logProblems`
- **Efectos secundarios:** Actualiza estado (signals): `this.inputs.set`, `this.closing.set`, `this.picking.set`, `this.pendingOption.set`, `this.selectedBankId.set`, `this.selectedAccountId.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankPickerModalComponent.ngOnDestroy`

- **Firma:** `ngOnDestroy(): void` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L160) (L160–164)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `clearTimeout`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankPickerModalComponent.onEscape`

- **Firma:** `onEscape(): void` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L166) (L166–176)
- **Decoradores:** `@HostListener('document:keydown.escape')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.busy`, `this.pendingOption`, `this.pendingOption.set`, `this.cancel`
- **Efectos secundarios:** Actualiza estado (signals): `this.pendingOption.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankPickerModalComponent.choose`

- **Firma:** `choose(option: BankPickerOption, event?: Event): void` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L178) (L178–190)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.busy`, `this.selectedBankId.set`, `this.launchMark`, `this.finish`, `this.pendingOption.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedBankId.set`, `this.pendingOption.set`
- **Consumidores:** `bank-picker-modal.component.html` (plantilla)

##### `BankPickerModalComponent.chooseAccount`

- **Firma:** `chooseAccount(account: Bank, event?: Event): void` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L192) (L192–200)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.pendingOption`, `this.busy`, `this.selectedBankId.set`, `this.selectedAccountId.set`, `this.launchMark`, `this.finish`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedBankId.set`, `this.selectedAccountId.set`
- **Consumidores:** `bank-picker-modal.component.html` (plantilla)

##### `BankPickerModalComponent.backToBanks`

- **Firma:** `backToBanks(): void` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L202) (L202–204)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.pendingOption.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.pendingOption.set`
- **Consumidores:** `bank-picker-modal.component.html` (plantilla)

##### `BankPickerModalComponent.cancel`

- **Firma:** `cancel(): void` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L206) (L206–211)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.busy`, `this.closeThen`, `this.cancelled.emit`
- **Efectos secundarios:** Emite eventos: `this.cancelled.emit`
- **Consumidores:** `bank-picker-modal.component.html` (plantilla), (mismo archivo)

##### `BankPickerModalComponent.pendingAccounts`

- **Firma:** `pendingAccounts(): Bank[]` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L213) (L213–216)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.pendingOption`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `bank-picker-modal.component.html` (plantilla)

##### `BankPickerModalComponent.launchMark`

- **Firma:** `launchMark(option: BankPickerOption, event?: Event): void` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L219) (L219–247)
- **Propósito / descripción:** Toma la posición real del icono pulsado y crea su copia voladora, que parte exactamente de ahí.
- **Dependencias (llamadas en su cuerpo):** `prefersReducedMotion`, `console.info`, `(event?.currentTarget as HTMLElement \| null)?.querySelector`, `mark.getBoundingClientRect`, `this.flyingMark.set`, `Math.hypot`
- **Efectos secundarios:** Actualiza estado (signals): `this.flyingMark.set`
- **Consumidores:** (mismo archivo)

##### `BankPickerModalComponent.finish`

- **Firma:** `finish(transactionBank: TransactionBank, account: Bank): void` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L249) (L249–255)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.busy`, `this.closeThen`, `this.picked.emit`, `prefersReducedMotion`
- **Efectos secundarios:** Emite eventos: `this.picked.emit`
- **Consumidores:** (mismo archivo)

##### `BankPickerModalComponent.closeThen`

- **Firma:** `closeThen(callback: () => void, holdMs?): void` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L257) (L257–272)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.picking.set`, `setTimeout`, `this.closeThen`, `this.closing.set`, `callback`
- **Efectos secundarios:** Actualiza estado (signals): `this.picking.set`, `this.closing.set`
- **Consumidores:** (mismo archivo)

##### `BankPickerModalComponent.logProblems`

- **Firma:** `logProblems(): void` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L275) (L275–290)
- **Propósito / descripción:** Diagnóstico: un banco sin cuenta correspondiente queda deshabilitado en pantalla y se reporta aquí.
- **Dependencias (llamadas en su cuerpo):** `this.options().filter`, `this.options`, `console.warn`, `problems.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `round2` (L55–57)

- **Tipo:** función local del archivo
- **Firma:** `round2(value: number): number` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L55)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `prefersReducedMotion` (L59–61)

- **Tipo:** función local del archivo
- **Firma:** `prefersReducedMotion(): boolean` — [bank-picker-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/bank-picker-modal/bank-picker-modal.component.ts#L59)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `matchMedia`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts"></a>

### cash-breakdown-table.component.ts

- **Ruta:** [cash-breakdown-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cash-breakdown-table/cash-breakdown-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cash-breakdown-table/cash-breakdown-table.component.ts`, 67 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** "Efectivo" — the fixed 11-row denomination breakdown; quantity per row is the only editable value, subtotal and the running total are always derived, never entered directly.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [status-indicator.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-status-indicator-status-indicator-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [cash-bank-deposit-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts), [cash-count-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts), [cut-finish-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts), [warehouse-transfer-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-ts), [warehouse-withdrawal-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-ts), [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts), [movement-form-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [cash-bank-deposit-modal.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts) (plantilla), [cash-count-modal.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts) (plantilla), [cut-finish-modal.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts) (plantilla), [warehouse-transfer-modal.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-ts) (plantilla), [warehouse-withdrawal-modal.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-ts) (plantilla), [cash-count-panel.component.ts (plantilla)](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts) (plantilla), [movement-form-modal.component.ts (plantilla)](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts) (plantilla) y 1 más
- **Plantilla:** [cash-breakdown-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cash-breakdown-table/cash-breakdown-table.component.html) · **Usa componentes:** [status-indicator.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-status-indicator-status-indicator-component-ts)
- **Eventos enlazados en la plantilla:** `(change)="onQuantityInput(row.denomination, $any($event.target).value)"`

**Interfaces, tipos y enums:**

- `interface CashRow` (L8): sin documentación — miembros: `denomination`, `quantity`, `subtotal`

#### Clase `CashBreakdownTableComponent` (L15–66)

- **Decoradores:** `@Component({ selector: 'app-cash-breakdown-table', standalone: true, imports: [DecimalInputDirective, StatusIndicatorComponent], templateUrl: './cash-breakdown-t`
- **Propósito:** "Efectivo" — the fixed 11-row denomination breakdown; quantity per row is the only editable value, subtotal and the running total are always derived, never entered directly.
- **Datos / estado que administra:** `@Input cashCounts = {}`, `@Input totalCash = 0`, `@Input totalAmount = 0`, `@Input status: CuadreStatus`, `@Input disabled = false`, `@Input emptyAmountText = 'Ingresa el monto total a depositar'`, `@Output quantityChange = new EventEmitter<{ denomination: number; quantity:`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `rows` | getter public | 37–42 | — | `CashRow[]` |
| `onQuantityInput` | método public | 44–47 | `denomination: number`, `value: string` | `void` |
| `statusText` | getter public | 50–61 | — | `string` |
| `formatDenomination` | método public | 63–65 | `denomination: number` | `string` |

##### `CashBreakdownTableComponent.rows`

- **Firma:** `rows(): CashRow[]` — [cash-breakdown-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cash-breakdown-table/cash-breakdown-table.component.ts#L37) (L37–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.denominations.map`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashBreakdownTableComponent.onQuantityInput`

- **Firma:** `onQuantityInput(denomination: number, value: string): void` — [cash-breakdown-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cash-breakdown-table/cash-breakdown-table.component.ts#L44) (L44–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseInt`, `this.quantityChange.emit`, `Number.isNaN`, `Math.max`
- **Efectos secundarios:** Emite eventos: `this.quantityChange.emit`
- **Consumidores:** `cash-breakdown-table.component.html` (plantilla)

##### `CashBreakdownTableComponent.statusText`

- **Firma:** `statusText(): string` — [cash-breakdown-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cash-breakdown-table/cash-breakdown-table.component.ts#L50) (L50–61)
- **Propósito / descripción:** Dynamic status copy — tells the user exactly how much is missing or in excess, not just that it doesn't match yet.
- **Dependencias (llamadas en su cuerpo):** `formatCurrency`, `Math.abs`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashBreakdownTableComponent.formatDenomination`

- **Firma:** `formatDenomination(denomination: number): string` — [cash-breakdown-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cash-breakdown-table/cash-breakdown-table.component.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `denomination.toLocaleString`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cash-breakdown-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-change-confirm-modal-change-confirm-modal-component-ts"></a>

### change-confirm-modal.component.ts

- **Ruta:** [change-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/change-confirm-modal/change-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/change-confirm-modal/change-confirm-modal.component.ts`, 65 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** "Confirmar Vuelto" — deliberately does NOT close on a backdrop click (per the ticket's own explicit requirement: giving change to a client is a real-money action, not something to lose by an accidental outside click).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [transaccionar-page.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) (plantilla)
- **Plantilla:** [change-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/change-confirm-modal/change-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancel()"`, `(click)="confirm()"`

#### Clase `ChangeConfirmModalComponent` (L25–64)

- **Decoradores:** `@Component({ selector: 'app-change-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './change-confirm-modal.component.ht`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Confirmar Vuelto" — deliberately does NOT close on a backdrop click (per the ticket's own explicit requirement: giving change to a client is a real-money action, not something to lose by an accidental outside click). Dumb, like `SaveConfirmModalComponent` — the parent (`TransaccionarPageComponent`) owns the actual `BankDepositDraftStore.confirmChange()` call; this only emits `confirmed` once, guarded by its own local `confirming` flag so a rapid double-click can never fire it twice.
- **Datos / estado que administra:** `@Input open = false`, `@Input amount = 0`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`, `confirming = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 44–48 | `changes: SimpleChanges` | `void` |
| `confirm` | método public | 50–56 | — | `void` |
| `cancel` | método public | 58–63 | — | `void` |

##### `ChangeConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [change-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/change-confirm-modal/change-confirm-modal.component.ts#L44) (L44–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirming.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.confirming.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ChangeConfirmModalComponent.confirm`

- **Firma:** `confirm(): void` — [change-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/change-confirm-modal/change-confirm-modal.component.ts#L50) (L50–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirming`, `this.confirming.set`, `this.confirmed.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.confirming.set`; Emite eventos: `this.confirmed.emit`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), `change-confirm-modal.component.html` (plantilla)

##### `ChangeConfirmModalComponent.cancel`

- **Firma:** `cancel(): void` — [change-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/change-confirm-modal/change-confirm-modal.component.ts#L58) (L58–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirming`, `this.cancelled.emit`
- **Efectos secundarios:** Emite eventos: `this.cancelled.emit`
- **Consumidores:** `change-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-commission-summary-card-commission-summary-card-component-ts"></a>

### commission-summary-card.component.ts

- **Ruta:** [commission-summary-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/commission-summary-card/commission-summary-card.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/commission-summary-card/commission-summary-card.component.ts`, 46 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** "Comisión Estimada" — sits alongside "Resumen Diario"/"Resumen Mes en Curso" on Transaccionar's own type-picker dashboard.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [financial-indicators.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-components-financial-indicators-financial-indicators-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [transaccionar-page.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) (plantilla)
- **Plantilla:** [commission-summary-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/commission-summary-card/commission-summary-card.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts)

**Constantes exportadas:**

- `COMMISSION_RATE_PER_TRANSACTION` (L7): Q1.50 per subtransacción — a reference/estimation rate only, never registered as a real financial transaction or persisted anywhere; purely a client-side display transformation over an already-fetched count. = `1.5`

#### Clase `CommissionSummaryCardComponent` (L21–45)

- **Decoradores:** `@Component({ selector: 'app-commission-summary-card', standalone: true, imports: [CardComponent], templateUrl: './commission-summary-card.component.html', styleU`
- **Propósito:** "Comisión Estimada" — sits alongside "Resumen Diario"/"Resumen Mes en Curso" on Transaccionar's own type-picker dashboard. Computes no totals of its own: `dailyTransactions`/`monthlyTransactions` are exactly the same `daily.totalTransactions`/`monthly.totalTransactions` the sibling cards already read from `GET /bank-deposits/summary` (see `BankDepositService.getTransactionSummary()`) — this component's only job is the one multiplication the ticket asks for, applied to a count that already excludes anuladas and is already scoped to the correct business day/calendar month server-side (`America/Guatemala`). No new request, no new backend logic.
- **Datos / estado que administra:** `@Input dailyTransactions = 0`, `@Input monthlyTransactions = 0`, `@Input loading = false`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `dailyCommission` | getter public | 38–40 | — | `number` |
| `monthlyCommission` | getter public | 42–44 | — | `number` |

##### `CommissionSummaryCardComponent.dailyCommission`

- **Firma:** `dailyCommission(): number` — [commission-summary-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/commission-summary-card/commission-summary-card.component.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CommissionSummaryCardComponent.monthlyCommission`

- **Firma:** `monthlyCommission(): number` — [commission-summary-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/commission-summary-card/commission-summary-card.component.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cuadre-result-card-cuadre-result-card-component-ts"></a>

### cuadre-result-card.component.ts

- **Ruta:** [cuadre-result-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cuadre-result-card/cuadre-result-card.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cuadre-result-card/cuadre-result-card.component.ts`, 65 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** "Resultado del Cuadre" — Total esperado / Total contado / Diferencia / Estado, all derived from the exact same `totalAmount`/`totalCash`/ `cashStatus` signals `CashBreakdownTableComponent` already reads from `BankDepositDraftStore`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [status-indicator.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-status-indicator-status-indicator-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [transaccionar-page.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) (plantilla)
- **Plantilla:** [cuadre-result-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cuadre-result-card/cuadre-result-card.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [status-indicator.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-status-indicator-status-indicator-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="requestConfirmChange()"`

#### Clase `CuadreResultCardComponent` (L17–64)

- **Decoradores:** `@Component({ selector: 'app-cuadre-result-card', standalone: true, imports: [ButtonComponent, CardComponent, StatusIndicatorComponent], templateUrl: './cuadre-re`
- **Propósito:** "Resultado del Cuadre" — Total esperado / Total contado / Diferencia / Estado, all derived from the exact same `totalAmount`/`totalCash`/ `cashStatus` signals `CashBreakdownTableComponent` already reads from `BankDepositDraftStore`. This component computes NO financial rule of its own — `status` (red/yellow/green) is passed in already decided by the store, this only formats it alongside the two totals so both are visible together, without scrolling, right next to Desglose de Efectivo.
- **Datos / estado que administra:** `@Input totalAmount = 0`, `@Input totalCash = 0`, `@Input netCash = 0`, `@Input status: CuadreStatus`, `@Input hasPendingChange = false`, `@Input excessAmount = 0`, `@Input changeGiven = 0`, `@Input changeConfirmed = false`, `@Output confirmChangeRequested = new EventEmitter<number>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `hasConfirmedChange` | getter public | 42–44 | — | `boolean` |
| `difference` | getter public | 46–48 | — | `number` |
| `statusText` | getter public | 50–59 | — | `string` |
| `requestConfirmChange` | método public | 61–63 | — | `void` |

##### `CuadreResultCardComponent.hasConfirmedChange`

- **Firma:** `hasConfirmedChange(): boolean` — [cuadre-result-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cuadre-result-card/cuadre-result-card.component.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CuadreResultCardComponent.difference`

- **Firma:** `difference(): number` — [cuadre-result-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cuadre-result-card/cuadre-result-card.component.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CuadreResultCardComponent.statusText`

- **Firma:** `statusText(): string` — [cuadre-result-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cuadre-result-card/cuadre-result-card.component.ts#L50) (L50–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.abs`, `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CuadreResultCardComponent.requestConfirmChange`

- **Firma:** `requestConfirmChange(): void` — [cuadre-result-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/cuadre-result-card/cuadre-result-card.component.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmChangeRequested.emit`
- **Efectos secundarios:** Emite eventos: `this.confirmChangeRequested.emit`
- **Consumidores:** `cuadre-result-card.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-recent-transactions-card-recent-transactions-card-component-spec-ts"></a>

### recent-transactions-card.component.spec.ts

- **Ruta:** [recent-transactions-card.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.spec.ts`, 157 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** Prueba unitaria: declara `movement` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [recent-transactions-card.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-recent-transactions-card-recent-transactions-card-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`
- **Consumidores:** —
#### Función `movement` (L7–37)

- **Tipo:** función local del archivo
- **Firma:** `movement(id: string, overrides?: Partial<CashMovement>): CashMovement` — [recent-transactions-card.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.spec.ts#L7)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-recent-transactions-card-recent-transactions-card-component-ts"></a>

### recent-transactions-card.component.ts

- **Ruta:** [recent-transactions-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.ts`, 109 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** "Últimas transacciones" — Transaccionar's recent-activity card, now fed by the official physical-cash Kardex (`GET /cash-control/movements/recent`) instead of only Transaccionar operations.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`
- **Consumidores:** [recent-transactions-card.component.spec.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-recent-transactions-card-recent-transactions-card-component-spec-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [transaccionar-page.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) (plantilla)
- **Plantilla:** [recent-transactions-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="retry.emit()"`

#### Clase `RecentTransactionsCardComponent` (L45–108)

- **Decoradores:** `@Component({ selector: 'app-recent-transactions-card', standalone: true, imports: [CardComponent, IconComponent, RouterLink], templateUrl: './recent-transactions`
- **Propósito:** "Últimas transacciones" — Transaccionar's recent-activity card, now fed by the official physical-cash Kardex (`GET /cash-control/movements/recent`) instead of only Transaccionar operations. It therefore also lists gastos por cobrar, activos, retiros bancarios hacia caja, manual movements and voids, newest first. The right-most "Efectivo disponible" column is each row's `newBalance` exactly as the backend recorded it — never computed here. Green = cash in, red = cash out, grey = no physical cash effect. Presentational: the parent fetches and refreshes.
- **Datos / estado que administra:** `@Input movements = []`, `@Input currentBalance = null`, `@Input loading = false`, `@Input failed = false`, `@Output retry = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `shortDate` | método public | 66–69 | `iso: string` | `string` |
| `shortTime` | método public | 72–75 | `iso: string` | `string` |
| `typeLabel` | método public | 78–83 | `movement: CashMovement` | `string` |
| `tone` | método public | 86–88 | `movement: CashMovement` | `'in' \| 'out' \| 'none'` |
| `signedAmount` | método public | 90–93 | `movement: CashMovement` | `string` |
| `rowTitle` | método public | 95–107 | `movement: CashMovement` | `string` |

##### `RecentTransactionsCardComponent.shortDate`

- **Firma:** `shortDate(iso: string): string` — [recent-transactions-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.ts#L66) (L66–69)
- **Propósito / descripción:** `dd/MM` in Guatemala time.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `guatemalaPart`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recent-transactions-card.component.html` (plantilla)

##### `RecentTransactionsCardComponent.shortTime`

- **Firma:** `shortTime(iso: string): string` — [recent-transactions-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.ts#L72) (L72–75)
- **Propósito / descripción:** `HH:mm` (24 h) in Guatemala time.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `guatemalaPart`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recent-transactions-card.component.html` (plantilla)

##### `RecentTransactionsCardComponent.typeLabel`

- **Firma:** `typeLabel(movement: CashMovement): string` — [recent-transactions-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.ts#L78) (L78–83)
- **Propósito / descripción:** Operation label; a void names what it reverses ("Anulación · Depósito").
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recent-transactions-card.component.html` (plantilla)

##### `RecentTransactionsCardComponent.tone`

- **Firma:** `tone(movement: CashMovement): 'in' \| 'out' \| 'none'` — [recent-transactions-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.ts#L86) (L86–88)
- **Propósito / descripción:** CSS modifier for the cash indicator: in (green), out (red), none (grey).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recent-transactions-card.component.html` (plantilla)

##### `RecentTransactionsCardComponent.signedAmount`

- **Firma:** `signedAmount(movement: CashMovement): string` — [recent-transactions-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.ts#L90) (L90–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recent-transactions-card.component.html` (plantilla)

##### `RecentTransactionsCardComponent.rowTitle`

- **Firma:** `rowTitle(movement: CashMovement): string` — [recent-transactions-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.ts#L95) (L95–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `FULL_DATE_TIME.format`, `new Date`, `formatCurrency`, `parts.push`, `parts.join`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recent-transactions-card.component.html` (plantilla)

#### Función `guatemalaPart` (L24–27)

- **Tipo:** función local del archivo
- **Firma:** `guatemalaPart(date: Date, type: Intl.DateTimeFormatPartTypes): string` — [recent-transactions-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/recent-transactions-card/recent-transactions-card.component.ts#L24)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `GUATEMALA_PARTS.formatToParts(date).find`, `GUATEMALA_PARTS.formatToParts`, `value.padStart`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-save-confirm-modal-save-confirm-modal-component-ts"></a>

### save-confirm-modal.component.ts

- **Ruta:** [save-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/save-confirm-modal/save-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/save-confirm-modal/save-confirm-modal.component.ts`, 72 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** Rich summary-before-save — a bespoke modal (not the generic `ConfirmDialogService`) because it needs to render the full cash breakdown and per-transaction list, which that service's plain string API can't express.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [transaccionar-page.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) (plantilla)
- **Plantilla:** [save-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/save-confirm-modal/save-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [bank-balance-amount.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

**Interfaces, tipos y enums:**

- `interface CashSummaryRow` (L6): sin documentación — miembros: `denomination`, `quantity`, `subtotal`

#### Clase `SaveConfirmModalComponent` (L13–71)

- **Decoradores:** `@Component({ selector: 'app-bank-deposit-save-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent, BankBalanceAmountComponent], templateUr`
- **Propósito:** Rich summary-before-save — a bespoke modal (not the generic `ConfirmDialogService`) because it needs to render the full cash breakdown and per-transaction list, which that service's plain string API can't express.
- **Datos / estado que administra:** `@Input open = false`, `@Input transactionTypeName = ''`, `@Input transactionBankName = ''`, `@Input clientName = ''`, `@Input description = ''`, `@Input registeredClientName = null`, `@Input sendToAccountsReceivable = false`, `@Input sendToAssets = false`, `@Input totalAmount = 0`, `@Input cashBreakdownEnabled = true`, `@Input cashCounts = {}`, `@Input transactionAmounts = []`, `@Input changeGiven = 0`, `@Input affectedAccountLabel = null`, `@Input affectedAccountSpecial = null`, `@Input balanceBefore = null`, `@Input balanceAfter = null`, `@Input genesisAccountLabel = null`, `@Input genesisBalanceBefore = null`, `@Input genesisBalanceAfter = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `totalCashReceived` | getter public | 56–58 | — | `number` |
| `cashRows` | getter public | 60–66 | — | `CashSummaryRow[]` |
| `formatDenomination` | método public | 68–70 | `denomination: number` | `string` |

##### `SaveConfirmModalComponent.totalCashReceived`

- **Firma:** `totalCashReceived(): number` — [save-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/save-confirm-modal/save-confirm-modal.component.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cashRows.reduce`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SaveConfirmModalComponent.cashRows`

- **Firma:** `cashRows(): CashSummaryRow[]` — [save-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/save-confirm-modal/save-confirm-modal.component.ts#L60) (L60–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `BANK_DEPOSIT_CASH_DENOMINATIONS.map`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SaveConfirmModalComponent.formatDenomination`

- **Firma:** `formatDenomination(denomination: number): string` — [save-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/save-confirm-modal/save-confirm-modal.component.ts#L68) (L68–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `denomination.toLocaleString`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `save-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-status-indicator-status-indicator-component-ts"></a>

### status-indicator.component.ts

- **Ruta:** [status-indicator.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/status-indicator/status-indicator.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/status-indicator/status-indicator.component.ts`, 48 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** The one red/amarillo/verde semáforo used for both the cash-breakdown total and the transactions total, and again (worst-of-both) for the overall cuadre — colors are never the sole signal, per this app's own accessibility convention (see `SalesSummaryCardComponent`'s doc comment): icon + badge text carry the same information as the color.
- **Depende de (archivos del proyecto):** [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [cuadre-result-card.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cuadre-result-card-cuadre-result-card-component-ts), [transaction-distribution.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-distribution-transaction-distribution-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [cash-breakdown-table.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts) (plantilla), [cuadre-result-card.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cuadre-result-card-cuadre-result-card-component-ts) (plantilla), [transaction-distribution.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-distribution-transaction-distribution-component-ts) (plantilla), [transaccionar-page.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) (plantilla)
- **Plantilla:** [status-indicator.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/status-indicator/status-indicator.component.html) · **Usa componentes:** [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)

**Interfaces, tipos y enums:**

- `type BadgeTone` (L6) = `'success' \| 'gold' \| 'danger'`

#### Clase `StatusIndicatorComponent` (L27–47)

- **Decoradores:** `@Component({ selector: 'app-cuadre-status-indicator', standalone: true, imports: [BadgeComponent, IconComponent], templateUrl: './status-indicator.component.html`
- **Propósito:** The one red/amarillo/verde semáforo used for both the cash-breakdown total and the transactions total, and again (worst-of-both) for the overall cuadre — colors are never the sole signal, per this app's own accessibility convention (see `SalesSummaryCardComponent`'s doc comment): icon + badge text carry the same information as the color.
- **Datos / estado que administra:** `@Input status: CuadreStatus`, `@Input text = ''`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `tone` | getter public | 40–42 | — | `BadgeTone` |
| `icon` | getter public | 44–46 | — | `string` |

##### `StatusIndicatorComponent.tone`

- **Firma:** `tone(): BadgeTone` — [status-indicator.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/status-indicator/status-indicator.component.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `StatusIndicatorComponent.icon`

- **Firma:** `icon(): string` — [status-indicator.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/status-indicator/status-indicator.component.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-distribution-transaction-distribution-component-spec-ts"></a>

### transaction-distribution.component.spec.ts

- **Ruta:** [transaction-distribution.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-distribution/transaction-distribution.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-distribution/transaction-distribution.component.spec.ts`, 67 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-distribution.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-distribution-transaction-distribution-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-distribution-transaction-distribution-component-ts"></a>

### transaction-distribution.component.ts

- **Ruta:** [transaction-distribution.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-distribution/transaction-distribution.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-distribution/transaction-distribution.component.ts`, 68 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** "Distribución de Transacciones" — an integer "cantidad de transacciones" (starts at 1, minimum 1) that generates that many amount rows.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [status-indicator.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-status-indicator-status-indicator-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [transaction-distribution.component.spec.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-distribution-transaction-distribution-component-spec-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [transaccionar-page.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) (plantilla)
- **Plantilla:** [transaction-distribution.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-distribution/transaction-distribution.component.html) · **Usa componentes:** [status-indicator.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-status-indicator-status-indicator-component-ts)
- **Eventos enlazados en la plantilla:** `(change)="onCountInput($any($event.target))"`, `(change)="onAmountInput($index, $any($event.target).value)"`

#### Clase `TransactionDistributionComponent` (L19–67)

- **Decoradores:** `@Component({ selector: 'app-transaction-distribution', standalone: true, imports: [DecimalInputDirective, StatusIndicatorComponent], templateUrl: './transaction-`
- **Propósito:** "Distribución de Transacciones" — an integer "cantidad de transacciones" (starts at 1, minimum 1) that generates that many amount rows. With one row its amount is locked to the total; with more, each is typed manually. Resizing is delegated to the parent via `transactionCountRequested` rather than applied directly here, because shrinking a count that would discard already-typed amounts needs a confirmation the parent owns (`ConfirmDialogService`), not this dumb component.
- **Datos / estado que administra:** `@Input transactionAmounts = []`, `@Input totalDistributed = 0`, `@Input totalAmount = 0`, `@Input status: CuadreStatus`, `@Input disabled = false`, `@Output transactionCountRequested = new EventEmitter<number>()`, `@Output amountChange = new EventEmitter<{ index: number; amount: number }`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onCountInput` | método public | 40–47 | `input: HTMLInputElement` | `void` |
| `onAmountInput` | método public | 49–52 | `index: number`, `value: string` | `void` |
| `statusText` | getter public | 55–66 | — | `string` |

##### `TransactionDistributionComponent.onCountInput`

- **Firma:** `onCountInput(input: HTMLInputElement): void` — [transaction-distribution.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-distribution/transaction-distribution.component.ts#L40) (L40–47)
- **Propósito / descripción:** Minimum is 1 — an operation always has at least one transaction (which then mirrors the total). An invalid or clamped value is written back so the field never shows a count that isn't real.
- **Dependencias (llamadas en su cuerpo):** `parseInt`, `Number.isNaN`, `Math.min`, `Math.max`, `String`, `this.transactionCountRequested.emit`
- **Efectos secundarios:** Emite eventos: `this.transactionCountRequested.emit`
- **Consumidores:** `transaction-distribution.component.html` (plantilla)

##### `TransactionDistributionComponent.onAmountInput`

- **Firma:** `onAmountInput(index: number, value: string): void` — [transaction-distribution.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-distribution/transaction-distribution.component.ts#L49) (L49–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseFloat`, `this.amountChange.emit`, `Number.isNaN`, `Math.max`
- **Efectos secundarios:** Emite eventos: `this.amountChange.emit`
- **Consumidores:** `transaction-distribution.component.html` (plantilla)

##### `TransactionDistributionComponent.statusText`

- **Firma:** `statusText(): string` — [transaction-distribution.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-distribution/transaction-distribution.component.ts#L55) (L55–66)
- **Propósito / descripción:** Dynamic status copy — tells the user exactly how much is left to distribute or how much they've gone over, not just that it doesn't match yet.
- **Dependencias (llamadas en su cuerpo):** `formatCurrency`, `Math.abs`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-summary-card-transaction-summary-card-component-ts"></a>

### transaction-summary-card.component.ts

- **Ruta:** [transaction-summary-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-summary-card/transaction-summary-card.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-summary-card/transaction-summary-card.component.ts`, 31 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** One "Resumen Diario"/"Resumen del Mes en Curso" card — purely presentational over whatever `GET /bank-deposits/summary` already computed server-side (see `BankDepositService.getTransactionSummary()`); this component performs no aggregation of its own; "transacciones" here is `transactions` (already `SUM(transaction_count)` from the backend), never a client-side count/reduce over raw rows.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [dashboard-home.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [dashboard-home.component.ts (plantilla)](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts) (plantilla), [transaccionar-page.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) (plantilla)
- **Plantilla:** [transaction-summary-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/components/transaction-summary-card/transaction-summary-card.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts)

#### Clase `TransactionSummaryCardComponent` (L14–30)

- **Decoradores:** `@Component({ selector: 'app-transaction-summary-card', standalone: true, imports: [CardComponent], templateUrl: './transaction-summary-card.component.html', styl`
- **Propósito:** One "Resumen Diario"/"Resumen del Mes en Curso" card — purely presentational over whatever `GET /bank-deposits/summary` already computed server-side (see `BankDepositService.getTransactionSummary()`); this component performs no aggregation of its own; "transacciones" here is `transactions` (already `SUM(transaction_count)` from the backend), never a client-side count/reduce over raw rows.
- **Datos / estado que administra:** `@Input title = ''`, `@Input subtitle = null`, `@Input summary: BankDepositPeriodSummary`, `@Input loading = false`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-spec-ts"></a>

### transaccionar-page.component.spec.ts

- **Ruta:** [transaccionar-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.spec.ts`, 324 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** Prueba unitaria: declara `recent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [bank-deposit.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-service-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [guayacan-cash-sync.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-sync-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** —
#### Función `recent` (L17–45)

- **Tipo:** función local del archivo
- **Firma:** `recent(id: string, newBalance?): CashMovement` — [transaccionar-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.spec.ts#L17)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts"></a>

### transaccionar-page.component.ts

- **Ruta:** [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts`, 680 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaccionar`
- **Responsabilidad:** "Transaccionar" — a two-step flow.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [bank-deposit.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [transaction-bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-transaction-bank-service-ts), [transaction-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-transaction-type-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [refetch-on-tab-visible.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-refetch-on-tab-visible-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [cash-control-sync.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-sync-service-ts), [guayacan-cash-sync.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-sync-service-ts) y 14 más
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts), [transaccionar-page.component.spec.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-spec-ts)
- **Plantilla:** [transaccionar-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [transaction-monthly-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-transaction-monthly-chart-transaction-monthly-chart-component-ts), [transaction-summary-card.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-summary-card-transaction-summary-card-component-ts), [commission-summary-card.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-commission-summary-card-commission-summary-card-component-ts), [recent-transactions-card.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-recent-transactions-card-recent-transactions-card-component-ts), [bank-balance-strip.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-strip-bank-balance-strip-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [client-search-select.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts), [bank-balance-amount.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [cuadre-result-card.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cuadre-result-card-cuadre-result-card-component-ts), [transaction-distribution.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-distribution-transaction-distribution-component-ts), [status-indicator.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-status-indicator-status-indicator-component-ts), [save-confirm-modal.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-save-confirm-modal-save-confirm-modal-component-ts) y 2 más
- **Eventos enlazados en la plantilla:** `(retry)="loadRecentOperations()"`, `(click)="selectType(type)"`, `(click)="changeType()"`, `(click)="openBankPicker()"`, `(ngModelChange)="onBankChange($event)"`, `(ngModelChange)="onTotalAmountChange($event)"`, `(ngModelChange)="onDescriptionInput($event)"`, `(click)="onCashBreakdownToggle()"`, `(ngModelChange)="onClientNameInput($event)"`, `(selectionChange)="onRegisteredClientChange($event)"`, `(ngModelChange)="onSendToAccountsReceivableChange($event)"`, `(ngModelChange)="onSendToAssetsChange($event)"`, `(quantityChange)="onCashQuantityChange($event)"`, `(confirmChangeRequested)="onConfirmChangeRequested($event)"`, `(transactionCountRequested)="onTransactionCountRequested($event)"`

**Interfaces, tipos y enums:**

- `type TransaccionarView` (L57) = `'dashboard' \| 'form'`

#### Clase `TransaccionarPageComponent` (L86–679)

- **Decoradores:** `@Component({ selector: 'app-transaccionar-page', standalone: true, imports: [ DatePipe, TitleCasePipe, FormsModule, DecimalInputDirective, ButtonComponent, IconC`
- **Propósito:** "Transaccionar" — a two-step flow. Step one is a dashboard of cards, one per active "Tipo de Transacción" (Depósito, Retiro, Desembolso Préstamo, Pago Cheque, ...), managed under Sistema. Picking one moves to step two: the actual registration form (banco agente, monto, desglose de efectivo — opcional, interruptor NO por defecto — y distribución de transacciones, que arranca en 1 igual al monto). Saving successfully — or explicitly changing the type mid-form — resets the module straight back to the dashboard, never leaving the just-used form sitting on screen. The draft (`BankDepositDraftStore`) survives navigation the same way `PurchaseDraftStore` does for Compras — nothing is sent to the backend until "Confirmar y Guardar", and the currently selected type is itself part of that same persisted draft, so a reload mid-form resumes on the form (not the dashboard) with everything intact.
- **Servicios inyectados con `inject()`:** `transactionBankService = inject(TransactionBankService)`, `transactionTypeService = inject(TransactionTypeService)`, `bankDepositService = inject(BankDepositService)`, `cashControlService = inject(CashControlService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`, `bankService = inject(BankService)`, `cashSync = inject(GuayacanCashSyncService)`, `draft = inject(BankDepositDraftStore)`
- **Datos / estado que administra:** `transactionBanks = signal<TransactionBank[]>([])`, `loadingBanks = signal(true)`, `transactionTypes = signal<TransactionType[]>([])`, `loadingTypes = signal(true)`, `bankAccounts = signal<Bank[]>([])`, `loadingAccounts = signal(true)`, `selectableAccounts = computed(() => { const isReintegro = this.isReinte`, `genesisAccount = computed(() => this.bankAccounts().find((bank) => `, `isReintegro = computed(() => this.draft.transactionTypeBalanceEf`, `affectedAccount = computed<Bank \| null>(() => { if (this.draft.isGen`, `balancePreview = computed(() => { const account = this.affectedAcco`, `genesisReintegroPreview = computed(() => { const genesis = this.genesisAccou`, `balanceError = computed<string \| null>(() => { const effect = thi`, `bankSelectionError = computed<string \| null>(() => { if (!this.draft.ne`, `canSubmit = computed( () => this.draft.canSave() && this.balan`, `formSubtitle = computed(() => { if (this.draft.isGenesisType()) {`, `transactionSummary = signal<BankDepositTransactionSummary \| null>(null)`, `loadingSummary = signal(true)`, `recentMovements = signal<CashMovement[]>([])`, `cashBalance = signal<number \| null>(null)`, `loadingRecent = signal(true)`, `recentFailed = signal(false)`, `view = signal<TransaccionarView>(this.draft.transactionTy`, `isSaving = signal(false)`, `isConfirmOpen = signal(false)`, `isChangeConfirmOpen = signal(false)`, `pendingChangeAmount = signal(0)`, `selectedTransactionBank = computed( () => this.transactionBanks().find((b) =`, `selectedBankName = computed(() => this.selectedTransactionBank()?.nam`, `selectedBankImageUrl = computed(() => { const bank = this.selectedTransac`…

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `loadRecentOperations` | método public | 400–419 | — | `void` |
| `selectType` | método public | 422–435 | `type: TransactionType` | `void` |
| `openBankPicker` | método public | 438–445 | — | `void` |
| `onBankPicked` | método public | 447–459 | `selection: BankPickerSelection` | `void` |
| `onBankPickerCancelled` | método public | 461–463 | — | `void` |
| `loadBankAccounts` | método private | 466–477 | — | `void` |
| `changeType` | método public async | 480–494 | — | `Promise<void>` |
| `onBankChange` | método public | 496–498 | `id: string` | `void` |
| `onClientNameInput` | método public | 500–502 | `value: string` | `void` |
| `onRegisteredClientChange` | método public | 504–506 | `client: Client \| null` | `void` |
| `onSendToAccountsReceivableChange` | método public | 508–510 | `checked: boolean` | `void` |
| `onSendToAssetsChange` | método public | 512–514 | `checked: boolean` | `void` |
| `onTotalAmountChange` | método public | 517–519 | `value: number \| null` | `void` |
| `onCashBreakdownToggle` | método public async | 522–536 | — | `Promise<void>` |
| `onCashQuantityChange` | método public | 538–540 | `event: { denomination: number; quantity: number }` | `void` |
| `onTransactionCountRequested` | método public async | 542–559 | `count: number` | `Promise<void>` |
| `onTransactionAmountChange` | método public | 561–563 | `event: { index: number; amount: number }` | `void` |
| `onConfirmChangeRequested` | método public | 565–568 | `amount: number` | `void` |
| `onChangeConfirmed` | método public | 571–574 | — | `void` |
| `onChangeCancelled` | método public | 576–578 | — | `void` |
| `onDescriptionInput` | método public | 585–588 | `value: string` | `void` |
| `requestSave` | método public | 590–602 | — | `void` |
| `dismissConfirm` | método public | 604–609 | — | `void` |
| `confirmSave` | método public | 611–678 | — | `void` |

##### `TransaccionarPageComponent.loadRecentOperations`

- **Firma:** `loadRecentOperations(): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L400) (L400–419)
- **Propósito / descripción:** Solo muestra el estado de carga la primera vez — un refresco (tras guardar) conserva las filas visibles hasta que llegan las nuevas.
- **Dependencias (llamadas en su cuerpo):** `this.recentMovements`, `this.loadingRecent.set`, `this.recentFailed.set`, `forkJoin`, `this.cashControlService.getRecentMovements`, `this.cashControlService.getBalance`, `this.recentMovements.set`, `this.cashBalance.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingRecent.set`, `this.recentFailed.set`, `this.recentMovements.set`, `this.cashBalance.set`
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.selectType`

- **Firma:** `selectType(type: TransactionType): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L422) (L422–435)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankPicker`, `requiresBankAccount`, `this.bankPicker.set`, `this.loadBankAccounts`, `this.draft.setTransactionType`, `this.view.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.bankPicker.set`, `this.view.set`
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.openBankPicker`

- **Firma:** `openBankPicker(): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L438) (L438–445)
- **Propósito / descripción:** "Cambiar banco" desde el formulario — mismo modal, misma operación.
- **Dependencias (llamadas en su cuerpo):** `this.draft.transactionTypeBalanceEffect`, `this.bankPicker`, `requiresBankAccount`, `this.bankPicker.set`, `this.draft.transactionTypeName`, `this.loadBankAccounts`
- **Efectos secundarios:** Actualiza estado (signals): `this.bankPicker.set`
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onBankPicked`

- **Firma:** `onBankPicked(selection: BankPickerSelection): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L447) (L447–459)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankPicker`, `this.draft.setTransactionType`, `this.draft.setTransactionBank`, `this.draft.setBankAccount`, `this.bankPicker.set`, `this.view.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.bankPicker.set`, `this.view.set`
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onBankPickerCancelled`

- **Firma:** `onBankPickerCancelled(): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L461) (L461–463)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankPicker.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.bankPicker.set`
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.loadBankAccounts`

- **Firma:** `loadBankAccounts(): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L466) (L466–477)
- **Propósito / descripción:** Refresca los saldos actuales desde el backend (fuente de verdad) — al entrar al formulario y después de guardar.
- **Dependencias (llamadas en su cuerpo):** `this.bankService.getBanks().subscribe`, `this.bankService.getBanks`, `this.bankAccounts.set`, `banks.filter`, `this.loadingAccounts.set`, `this.notificationService.error`
- **Efectos secundarios:** Actualiza estado (signals): `this.bankAccounts.set`, `this.loadingAccounts.set`
- **Consumidores:** (mismo archivo)

##### `TransaccionarPageComponent.changeType`

- **Firma:** `changeType(): Promise<void>` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L480) (L480–494)
- **Propósito / descripción:** Going back to the dashboard always starts a fresh operation — changing the tipo mid-flight discards whatever was already entered for the previous one, after confirming if there's anything meaningful to lose.
- **Dependencias (llamadas en su cuerpo):** `this.draft.hasMeaningfulProgress`, `this.confirmDialogService.confirm`, `this.draft.reset`, `this.view.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.view.set`
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onBankChange`

- **Firma:** `onBankChange(id: string): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L496) (L496–498)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setTransactionBank`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onClientNameInput`

- **Firma:** `onClientNameInput(value: string): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L500) (L500–502)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setClientName`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onRegisteredClientChange`

- **Firma:** `onRegisteredClientChange(client: Client \| null): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L504) (L504–506)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setRegisteredClient`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onSendToAccountsReceivableChange`

- **Firma:** `onSendToAccountsReceivableChange(checked: boolean): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L508) (L508–510)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setSendToAccountsReceivable`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onSendToAssetsChange`

- **Firma:** `onSendToAssetsChange(checked: boolean): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L512) (L512–514)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setSendToAssets`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onTotalAmountChange`

- **Firma:** `onTotalAmountChange(value: number \| null): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L517) (L517–519)
- **Propósito / descripción:** Se llama en cada tecla (el directive ya entrega el número limpio, sin comas) — así "Saldo después" se actualiza en vivo.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setTotalAmount`, `Number.isNaN`, `Math.max`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onCashBreakdownToggle`

- **Firma:** `onCashBreakdownToggle(): Promise<void>` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L522) (L522–536)
- **Propósito / descripción:** Interruptor "Desglose de efectivo". Apagarlo descarta las cantidades ya escritas (nunca participan en el guardado) — se confirma solo si había algo contado.
- **Dependencias (llamadas en su cuerpo):** `this.draft.cashBreakdownEnabled`, `this.draft.totalCash`, `this.confirmDialogService.confirm`, `this.draft.setCashBreakdownEnabled`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onCashQuantityChange`

- **Firma:** `onCashQuantityChange(event: { denomination: number; quantity: number }): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L538) (L538–540)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setCashQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onTransactionCountRequested`

- **Firma:** `onTransactionCountRequested(count: number): Promise<void>` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L542) (L542–559)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.transactionAmounts`, `current.slice(count).some`, `current.slice`, `this.confirmDialogService.confirm`, `this.draft.setTransactionCount`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onTransactionAmountChange`

- **Firma:** `onTransactionAmountChange(event: { index: number; amount: number }): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L561) (L561–563)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.setTransactionAmount`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onConfirmChangeRequested`

- **Firma:** `onConfirmChangeRequested(amount: number): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L565) (L565–568)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.pendingChangeAmount.set`, `this.isChangeConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.pendingChangeAmount.set`, `this.isChangeConfirmOpen.set`
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onChangeConfirmed`

- **Firma:** `onChangeConfirmed(): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L571) (L571–574)
- **Propósito / descripción:** The vuelto is NOT applied here — only once the modal's own "Confirmar vuelto" fires this. Cancelling the modal (or the draft changing while it's open) leaves the operation exactly as unconfirmed/uncuadrado as before, per the ticket's own "no debe considerarse confirmado hasta confirmar" rule.
- **Dependencias (llamadas en su cuerpo):** `this.draft.confirmChange`, `this.pendingChangeAmount`, `this.isChangeConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isChangeConfirmOpen.set`
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onChangeCancelled`

- **Firma:** `onChangeCancelled(): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L576) (L576–578)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isChangeConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isChangeConfirmOpen.set`
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.onDescriptionInput`

- **Firma:** `onDescriptionInput(value: string): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L585) (L585–588)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.descriptionTouched.set`, `this.draft.setDescription`
- **Efectos secundarios:** Actualiza estado (signals): `this.descriptionTouched.set`
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.requestSave`

- **Firma:** `requestSave(): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L590) (L590–602)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSubmit`, `this.isSaving`, `this.draft.descriptionError`, `this.descriptionTouched.set`, `this.notificationService.warning`, `document.getElementById('transaction-description')?.focus`, `document.getElementById`, `this.isConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.descriptionTouched.set`, `this.isConfirmOpen.set`
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.dismissConfirm`

- **Firma:** `dismissConfirm(): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L604) (L604–609)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.isConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isConfirmOpen.set`
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

##### `TransaccionarPageComponent.confirmSave`

- **Firma:** `confirmSave(): void` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L611) (L611–678)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.isSaving.set`, `this.selectedTransactionBank`, `this.draft.cashBreakdownEnabled`, `this.bankDepositService.registerOperation`, `this.draft.isGenesisType`, `this.draft.transactionBankId`, `this.draft.needsBankAccount`, `this.draft.bankAccountId`, `this.draft.transactionTypeId`, `this.draft.totalAmount`, `Object.entries(this.draft.cashCounts()).map`, `Object.entries`, `this.draft.cashCounts`, `Number`, `this.draft.transactionAmounts`, `this.draft.clientName().trim`, `this.draft.clientName`…
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.isConfirmOpen.set`, `this.descriptionTouched.set`, `this.view.set`, `this.cashBalance.set`, `this.transactionSummary.set`
- **Consumidores:** `transaccionar-page.component.html` (plantilla)

#### Función `round2` (L59–61)

- **Tipo:** función local del archivo
- **Firma:** `round2(value: number): number` — [transaccionar-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts#L59)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

