# Frontend `dashboard-bank-transfers`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [bank-transfers-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Finanzas → Transferencias Bancarias. | 11 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [balance-credit.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts) | .ts | Componente Angular | Feature (pantalla) | Finanzas → Transferencias Bancarias → "Acreditar saldo" (solo admin; el backend lo exige con `@Roles`). | 9 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [_bank-transfers-ui.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/_bank-transfers-ui.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-transfers-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-transfers-page.component.ts`; usa 7 componentes hijos: `app-page-header`, `app-icon`, `app-balance-credit`, `app-bank-balance-amount`, `app-credit-line-summary`, `app-button`. | — | — | Media |
| [bank-transfers-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [balance-credit.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `balance-credit.component.ts`; usa 4 componentes hijos: `app-icon`, `app-bank-balance-amount`, `app-button`, `app-void-confirm-modal`. | — | — | Media |
| [balance-credit.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts"></a>

### bank-transfers-page.component.ts

- **Ruta:** [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts`, 350 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-bank-transfers`
- **Responsabilidad:** Finanzas → Transferencias Bancarias.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [bank-transfer.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-transfer-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [void-confirm-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-void-confirm-modal-void-confirm-modal-component-ts), [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [bank-transfers-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts), [bank-balance-amount.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts), [credit-line-summary.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-credit-line-summary-credit-line-summary-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [void-confirm-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-void-confirm-modal-void-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="selectTab('transfers')"`, `(click)="selectTab('credit')"`, `(balanceChanged)="onBalanceCredited()"`, `(ngModelChange)="onSourceChange($event)"`, `(ngModelChange)="destinationId.set($event)"`, `(ngModelChange)="onAmountChange($event)"`, `(ngModelChange)="referenceText.set($event)"`, `(ngModelChange)="concept.set($event)"`, `(click)="requestConfirm()"`, `(click)="openVoid(transfer)"`, `(click)="$event.stopPropagation()"`, `(click)="cancelConfirm()"`, `(click)="confirmTransfer()"`, `(confirmed)="confirmVoid($event)"`, `(cancelled)="cancelVoid()"`

**Interfaces, tipos y enums:**

- `type BankTransfersTab` (L30) = `'transfers' \| 'credit'` — Apartados de la página: A.

**Constantes exportadas:**

- `CASH_WITHDRAWAL_VALUE` (L37): Valor del selector "Cuenta destino" para el retiro de efectivo en banco (no es una cuenta). = `'__retiro_efectivo__'`

#### Clase `BankTransfersPageComponent` (L74–349)

- **Decoradores:** `@Component({ selector: 'app-bank-transfers-page', standalone: true, imports: [ DatePipe, FormsModule, DecimalInputDirective, PageHeaderComponent, ButtonComponent`
- **Propósito:** Finanzas → Transferencias Bancarias. Traslada saldo entre dos cuentas propias. La vista previa (saldos antes/después) y las validaciones son solo UX: el backend vuelve a leer ambos saldos bajo lock y es quien acepta o rechaza. Confirmación obligatoria antes de enviar; el modal no se cierra al hacer clic fuera y el botón se bloquea mientras guarda (sin doble envío).
- **Servicios inyectados con `inject()`:** `bankService = inject(BankService)`, `bankTransferService = inject(BankTransferService)`, `notificationService = inject(NotificationService)`, `isAdmin = inject(AuthService).isAdmin`
- **Datos / estado que administra:** `activeTab = signal<BankTransfersTab>('transfers')`, `accounts = signal<Bank[]>([])`, `loadingAccounts = signal(true)`, `transfers = signal<BankTransfer[]>([])`, `loadingTransfers = signal(true)`, `sourceId = signal('')`, `destinationId = signal('')`, `amount = signal<number \| null>(null)`, `referenceText = signal('')`, `concept = signal('')`, `isConfirmOpen = signal(false)`, `isSaving = signal(false)`, `voidingTransferId = signal<string \| null>(null)`, `isVoiding = signal(false)`, `source = computed(() => this.accounts().find((bank) => bank`, `isCashWithdrawal = computed(() => this.destinationId() === CASH_WITHD`, `cashWithdrawalBlockedReason = computed(() => cashWithdrawalRuleError(this.source`, `destination = computed(() => this.accounts().find((bank) => bank`, `destinationOptions = computed(() => this.accounts() .filter((bank) => b`, `creditLineOperation = computed<'USE' \| 'PAYMENT' \| null>(() => { if (isC`, `creditLineAccount = computed<Bank \| null>(() => { const operation = th`, `preview = computed(() => { const source = this.source(); con`, `validationError = computed<string \| null>(() => { const source = thi`, `canSubmit = computed( () => this.preview() !== null && this.va`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `selectTab` | método public | 220–223 | `tab: BankTransfersTab` | `void` |
| `onBalanceCredited` | método public | 226–228 | — | `void` |
| `onSourceChange` | método public | 230–236 | `id: string` | `void` |
| `onAmountChange` | método public | 238–240 | `value: number \| null` | `void` |
| `requestConfirm` | método public | 242–245 | — | `void` |
| `cancelConfirm` | método public | 247–250 | — | `void` |
| `confirmTransfer` | método public | 252–284 | — | `void` |
| `openVoid` | método public | 286–289 | `transfer: BankTransfer` | `void` |
| `cancelVoid` | método public | 291–294 | — | `void` |
| `confirmVoid` | método public | 296–313 | `reason: string` | `void` |
| `resetForm` | método private | 315–321 | — | `void` |
| `loadAccounts` | método public | 323–334 | — | `void` |
| `loadTransfers` | método private | 336–348 | — | `void` |

##### `BankTransfersPageComponent.selectTab`

- **Firma:** `selectTab(tab: BankTransfersTab): void` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L220) (L220–223)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isAdmin`, `this.activeTab.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.activeTab.set`
- **Consumidores:** `bank-transfers-page.component.html` (plantilla)

##### `BankTransfersPageComponent.onBalanceCredited`

- **Firma:** `onBalanceCredited(): void` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L226) (L226–228)
- **Propósito / descripción:** "Acreditar saldo" cambió un saldo: se recargan las cuentas para que el formulario de transferencias no quede con saldos viejos.
- **Dependencias (llamadas en su cuerpo):** `this.loadAccounts`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `bank-transfers-page.component.html` (plantilla)

##### `BankTransfersPageComponent.onSourceChange`

- **Firma:** `onSourceChange(id: string): void` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L230) (L230–236)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sourceId.set`, `this.isCashWithdrawal`, `cashWithdrawalRuleError`, `this.source`, `this.destinationId`, `destinationRuleError`, `this.destination`, `this.destinationId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sourceId.set`, `this.destinationId.set`
- **Consumidores:** `bank-transfers-page.component.html` (plantilla)

##### `BankTransfersPageComponent.onAmountChange`

- **Firma:** `onAmountChange(value: number \| null): void` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L238) (L238–240)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.amount.set`, `Number.isNaN`
- **Efectos secundarios:** Actualiza estado (signals): `this.amount.set`
- **Consumidores:** `bank-transfers-page.component.html` (plantilla)

##### `BankTransfersPageComponent.requestConfirm`

- **Firma:** `requestConfirm(): void` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L242) (L242–245)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSubmit`, `this.isConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isConfirmOpen.set`
- **Consumidores:** `bank-transfers-page.component.html` (plantilla)

##### `BankTransfersPageComponent.cancelConfirm`

- **Firma:** `cancelConfirm(): void` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L247) (L247–250)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.isConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isConfirmOpen.set`
- **Consumidores:** `bank-transfers-page.component.html` (plantilla)

##### `BankTransfersPageComponent.confirmTransfer`

- **Firma:** `confirmTransfer(): void` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L252) (L252–284)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.preview`, `this.isSaving`, `this.isSaving.set`, `this.bankTransferService.registerTransfer`, `this.sourceId`, `this.isCashWithdrawal`, `this.destinationId`, `this.referenceText().trim`, `this.referenceText`, `this.concept().trim`, `this.concept`, `this.isConfirmOpen.set`, `this.notificationService.success`, `formatSignedBankBalance`, `this.resetForm`, `this.loadAccounts`, `this.loadTransfers`, `this.notificationService.error`…
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.isConfirmOpen.set`
- **Consumidores:** `bank-transfers-page.component.html` (plantilla)

##### `BankTransfersPageComponent.openVoid`

- **Firma:** `openVoid(transfer: BankTransfer): void` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L286) (L286–289)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isAdmin`, `this.voidingTransferId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidingTransferId.set`
- **Consumidores:** `bank-transfers-page.component.html` (plantilla)

##### `BankTransfersPageComponent.cancelVoid`

- **Firma:** `cancelVoid(): void` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L291) (L291–294)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isVoiding`, `this.voidingTransferId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidingTransferId.set`
- **Consumidores:** `bank-transfers-page.component.html` (plantilla)

##### `BankTransfersPageComponent.confirmVoid`

- **Firma:** `confirmVoid(reason: string): void` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L296) (L296–313)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidingTransferId`, `this.isVoiding`, `this.isVoiding.set`, `this.bankTransferService.voidTransfer(id, reason).subscribe`, `this.bankTransferService.voidTransfer`, `this.voidingTransferId.set`, `this.notificationService.success`, `this.loadAccounts`, `this.loadTransfers`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isVoiding.set`, `this.voidingTransferId.set`
- **Consumidores:** `bank-transfers-page.component.html` (plantilla)

##### `BankTransfersPageComponent.resetForm`

- **Firma:** `resetForm(): void` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L315) (L315–321)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sourceId.set`, `this.destinationId.set`, `this.amount.set`, `this.referenceText.set`, `this.concept.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sourceId.set`, `this.destinationId.set`, `this.amount.set`, `this.referenceText.set`, `this.concept.set`
- **Consumidores:** (mismo archivo)

##### `BankTransfersPageComponent.loadAccounts`

- **Firma:** `loadAccounts(): void` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L323) (L323–334)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankService.getBanks().subscribe`, `this.bankService.getBanks`, `this.accounts.set`, `banks.filter`, `this.loadingAccounts.set`, `this.notificationService.error`
- **Efectos secundarios:** Actualiza estado (signals): `this.accounts.set`, `this.loadingAccounts.set`
- **Consumidores:** (mismo archivo)

##### `BankTransfersPageComponent.loadTransfers`

- **Firma:** `loadTransfers(): void` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L336) (L336–348)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingTransfers.set`, `this.bankTransferService.getTransfers({ limit: 30 }).subscribe`, `this.bankTransferService.getTransfers`, `this.transfers.set`, `this.notificationService.error`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingTransfers.set`, `this.transfers.set`
- **Consumidores:** (mismo archivo)

#### Función `round2` (L32–34)

- **Tipo:** función local del archivo
- **Firma:** `round2(value: number): number` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L32)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `destinationRuleError` (L47–59)

- **Tipo:** función local del archivo
- **Firma:** `destinationRuleError(source: Bank \| null, destination: Bank \| null): string \| null` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L47)
- **Propósito / descripción:** Reglas de las cuentas especiales — espejo (solo UX) de `register_bank_transfer`: BI Club solo recibe de Banco Industrial y, como origen, solo traslada a Banco Industrial; Districol solo recibe de Banco Agromercantil. El backend lo vuelve a validar.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `cashWithdrawalRuleError` (L62–64)

- **Tipo:** función local del archivo
- **Firma:** `cashWithdrawalRuleError(source: Bank \| null): string \| null` — [bank-transfers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts#L62)
- **Propósito / descripción:** El retiro de efectivo en banco no se permite desde BI Club (solo traslada a Banco Industrial).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts"></a>

### balance-credit.component.ts

- **Ruta:** [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts`, 257 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-bank-transfers`
- **Responsabilidad:** Finanzas → Transferencias Bancarias → "Acreditar saldo" (solo admin; el backend lo exige con `@Roles`).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [bank-transfer.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-transfer-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [void-confirm-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-void-confirm-modal-void-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts), [bank-transfers-page.component.ts (plantilla)](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts) (plantilla)
- **Plantilla:** [balance-credit.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [bank-balance-amount.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [void-confirm-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-void-confirm-modal-void-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="onAccountChange($event)"`, `(ngModelChange)="onAmountChange($event)"`, `(ngModelChange)="referenceText.set($event)"`, `(ngModelChange)="observation.set($event)"`, `(click)="clearForm()"`, `(click)="requestConfirm()"`, `(click)="openVoid(credit)"`, `(click)="$event.stopPropagation()"`, `(click)="cancelConfirm()"`, `(click)="confirmCredit()"`, `(confirmed)="confirmVoid($event)"`, `(cancelled)="cancelVoid()"`

#### Clase `BalanceCreditComponent` (L36–256)

- **Decoradores:** `@Component({ selector: 'app-balance-credit', standalone: true, imports: [ DatePipe, FormsModule, DecimalInputDirective, ButtonComponent, IconComponent, BankBalan`
- **Propósito:** Finanzas → Transferencias Bancarias → "Acreditar saldo" (solo admin; el backend lo exige con `@Roles`). Suma un monto al saldo de UNA cuenta, sin contrapartida — distinto del Depósito de Transaccionar y de una transferencia. - El saldo actual se consulta al backend (`GET /banks/:id`) al elegir la cuenta, nunca se toma del listado en memoria. - "Nuevo saldo" = saldo actual + monto, con signo real (una cuenta en negativo se acerca a cero; nunca `Math.abs`). Es solo una vista previa: el backend recalcula bajo lock y devuelve el saldo definitivo. - Confirmación obligatoria; el modal solo se cierra con Cancelar, la X o Confirmar, y el botón se bloquea mientras guarda (sin doble envío).
- **Servicios inyectados con `inject()`:** `bankService = inject(BankService)`, `bankTransferService = inject(BankTransferService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `accounts = input.required<Bank[]>()`, `loadingAccounts = input(false)`, `balanceChanged = output<void>()`, `bankId = signal('')`, `account = signal<Bank \| null>(null)`, `loadingBalance = signal(false)`, `amount = signal<number \| null>(null)`, `referenceText = signal('')`, `observation = signal('')`, `isConfirmOpen = signal(false)`, `isSaving = signal(false)`, `credits = signal<BankMovement[]>([])`, `loadingCredits = signal(true)`, `voidingOperationId = signal<string \| null>(null)`, `isVoiding = signal(false)`, `preview = computed(() => { const account = this.account(); c`, `validationError = computed<string \| null>(() => { const amount = thi`, `canSubmit = computed( () => this.preview() !== null && this.va`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onAccountChange` | método public | 113–118 | `id: string` | `void` |
| `onAmountChange` | método public | 120–122 | `value: number \| null` | `void` |
| `clearForm` | método public | 124–130 | — | `void` |
| `requestConfirm` | método public | 132–135 | — | `void` |
| `cancelConfirm` | método public | 137–140 | — | `void` |
| `confirmCredit` | método public | 142–177 | — | `void` |
| `openVoid` | método public | 179–182 | `credit: BankMovement` | `void` |
| `cancelVoid` | método public | 184–187 | — | `void` |
| `confirmVoid` | método public | 189–215 | `reason: string` | `void` |
| `friendlyError` | método private | 218–224 | `error: HttpErrorResponse` | `string` |
| `fetchLiveBalance` | método private | 227–241 | `id: string` | `void` |
| `loadCredits` | método private | 243–255 | — | `void` |

##### `BalanceCreditComponent.onAccountChange`

- **Firma:** `onAccountChange(id: string): void` — [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts#L113) (L113–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankId.set`, `this.account.set`, `this.fetchLiveBalance`
- **Efectos secundarios:** Actualiza estado (signals): `this.bankId.set`, `this.account.set`
- **Consumidores:** `balance-credit.component.html` (plantilla)

##### `BalanceCreditComponent.onAmountChange`

- **Firma:** `onAmountChange(value: number \| null): void` — [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts#L120) (L120–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.amount.set`, `Number.isNaN`
- **Efectos secundarios:** Actualiza estado (signals): `this.amount.set`
- **Consumidores:** `balance-credit.component.html` (plantilla)

##### `BalanceCreditComponent.clearForm`

- **Firma:** `clearForm(): void` — [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts#L124) (L124–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankId.set`, `this.account.set`, `this.amount.set`, `this.referenceText.set`, `this.observation.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.bankId.set`, `this.account.set`, `this.amount.set`, `this.referenceText.set`, `this.observation.set`
- **Consumidores:** `balance-credit.component.html` (plantilla)

##### `BalanceCreditComponent.requestConfirm`

- **Firma:** `requestConfirm(): void` — [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts#L132) (L132–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSubmit`, `this.isConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isConfirmOpen.set`
- **Consumidores:** `balance-credit.component.html` (plantilla)

##### `BalanceCreditComponent.cancelConfirm`

- **Firma:** `cancelConfirm(): void` — [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts#L137) (L137–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.isConfirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isConfirmOpen.set`
- **Consumidores:** `balance-credit.component.html` (plantilla)

##### `BalanceCreditComponent.confirmCredit`

- **Firma:** `confirmCredit(): void` — [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts#L142) (L142–177)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.preview`, `this.account`, `this.isSaving`, `this.isSaving.set`, `this.bankTransferService.registerBalanceCredit`, `this.referenceText().trim`, `this.referenceText`, `this.observation().trim`, `this.observation`, `this.isConfirmOpen.set`, `this.notificationService.success`, `formatSignedBankBalance`, `this.amount.set`, `this.referenceText.set`, `this.observation.set`, `this.account.update`, `this.fetchLiveBalance`, `this.loadCredits`…
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.isConfirmOpen.set`, `this.amount.set`, `this.referenceText.set`, `this.observation.set`, `this.account.update`; Emite eventos: `this.balanceChanged.emit`
- **Consumidores:** `balance-credit.component.html` (plantilla)

##### `BalanceCreditComponent.openVoid`

- **Firma:** `openVoid(credit: BankMovement): void` — [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts#L179) (L179–182)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidingOperationId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidingOperationId.set`
- **Consumidores:** `balance-credit.component.html` (plantilla)

##### `BalanceCreditComponent.cancelVoid`

- **Firma:** `cancelVoid(): void` — [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts#L184) (L184–187)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isVoiding`, `this.voidingOperationId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidingOperationId.set`
- **Consumidores:** `balance-credit.component.html` (plantilla)

##### `BalanceCreditComponent.confirmVoid`

- **Firma:** `confirmVoid(reason: string): void` — [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts#L189) (L189–215)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidingOperationId`, `this.isVoiding`, `this.isVoiding.set`, `this.bankTransferService.voidBalanceCredit(operationId, reason).subscribe`, `this.bankTransferService.voidBalanceCredit`, `this.voidingOperationId.set`, `this.notificationService.success`, `formatSignedBankBalance`, `this.bankId`, `this.fetchLiveBalance`, `this.loadCredits`, `this.balanceChanged.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isVoiding.set`, `this.voidingOperationId.set`; Emite eventos: `this.balanceChanged.emit`
- **Consumidores:** `balance-credit.component.html` (plantilla)

##### `BalanceCreditComponent.friendlyError`

- **Firma:** `friendlyError(error: HttpErrorResponse): string` — [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts#L218) (L218–224)
- **Propósito / descripción:** Mensajes de negocio del backend tal cual (ya son amigables); un error técnico nunca se muestra.
- **Dependencias (llamadas en su cuerpo):** `console.error`, `extractErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `BalanceCreditComponent.fetchLiveBalance`

- **Firma:** `fetchLiveBalance(id: string): void` — [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts#L227) (L227–241)
- **Propósito / descripción:** Saldo REAL desde el backend. Si el usuario cambió de cuenta mientras cargaba, la respuesta vieja se descarta.
- **Dependencias (llamadas en su cuerpo):** `this.loadingBalance.set`, `this.bankService.getBankById(id).subscribe`, `this.bankService.getBankById`, `this.bankId`, `this.account.set`, `this.notificationService.error`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingBalance.set`, `this.account.set`
- **Consumidores:** (mismo archivo)

##### `BalanceCreditComponent.loadCredits`

- **Firma:** `loadCredits(): void` — [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts#L243) (L243–255)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingCredits.set`, `this.bankTransferService.getBalanceCredits({ limit: 10 }).subscribe`, `this.bankTransferService.getBalanceCredits`, `this.credits.set`, `this.notificationService.error`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingCredits.set`, `this.credits.set`
- **Consumidores:** (mismo archivo)

#### Función `round2` (L16–18)

- **Tipo:** función local del archivo
- **Firma:** `round2(value: number): number` — [balance-credit.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/components/balance-credit/balance-credit.component.ts#L16)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

