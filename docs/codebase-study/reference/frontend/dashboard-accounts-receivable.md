# Frontend `dashboard-accounts-receivable`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [accounts-receivable-page.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `record` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/common, @angular/core, @angular/router | 0 | Soporte (pruebas) |
| [accounts-receivable-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AccountsReceivablePageComponent`, `LIMIT` (sin comentario de documentación en el código). | 15 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [account-receivable-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AccountReceivableFormModalComponent`, `todayIsoDate` (sin comentario de documentación en el código). | 7 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [account-receivable-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-table-account-receivable-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AccountReceivableTableComponent`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [account-receivable-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-toolbar-account-receivable-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AccountReceivableToolbarComponent`, `StatusFilterOption`, `AccountReceivableStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [client-search-select.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-client-search-select-client-search-select-component-ts) | .ts | Componente Angular | Feature (pantalla) | Searchable client select — a near-copy of Reportería's own `ProductFilterSearchComponent` (search box + dropdown + persistent "selected" chip), adapted for clients. | 3 internas; ext.: @angular/core, @angular/forms, rxjs | 7 | Media (7 consumidores) |
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [payment-history-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Payment history of one account (each payment it received, voided ones included) and, on demand, the detail of the consolidated operation a payment belongs to — every account it covered. | 6 internas; ext.: @angular/common, @angular/core, @angular/forms | 3 | Media (3 consumidores) |
| [settlement-modal.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `line`, `fakePreview` (sin comentario de documentación en el código). | 4 internas; ext.: @angular/common, @angular/core, rxjs | 0 | Soporte (pruebas) |
| [settlement-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Cancelar cuenta(s) por cobrar": one modal for a single account (partial amount allowed) or several accounts of the SAME client (each one for its full pending). | 7 internas; ext.: @angular/common, @angular/core, @angular/forms, rxjs | 4 | Media (4 consumidores) |
| [accounts-receivable-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `accounts-receivable-page.component.ts`; usa 13 componentes hijos: `app-page-header`, `app-card`, `app-summary-tile`, `app-account-receivable-toolbar`, `app-button`, `app-icon`. | — | — | Media |
| [accounts-receivable-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [account-receivable-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-form-modal/account-receivable-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `account-receivable-form-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-client-search-select`, `app-button`. | — | — | Media |
| [account-receivable-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-form-modal/account-receivable-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [account-receivable-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-table/account-receivable-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `account-receivable-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [account-receivable-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-table/account-receivable-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [account-receivable-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-toolbar/account-receivable-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `account-receivable-toolbar.component.ts`; usa 3 componentes hijos: `app-icon`, `app-button`, `app-client-search-select`. | — | — | Media |
| [account-receivable-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-toolbar/account-receivable-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [client-search-select.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/client-search-select/client-search-select.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `client-search-select.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [client-search-select.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/client-search-select/client-search-select.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/delete-confirm-modal/delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [payment-history-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `payment-history-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-badge`, `app-button`. | — | — | Media |
| [payment-history-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [settlement-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `settlement-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [settlement-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-spec-ts"></a>

### accounts-receivable-page.component.spec.ts

- **Ruta:** [accounts-receivable-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.spec.ts`, 77 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-accounts-receivable`
- **Responsabilidad:** Prueba unitaria: declara `record` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`
- **Consumidores:** —
#### Función `record` (L10–28)

- **Tipo:** función local del archivo
- **Firma:** `record(id: string, clientId: string, pending: number): AccountReceivable` — [accounts-receivable-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.spec.ts#L10)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts"></a>

### accounts-receivable-page.component.ts

- **Ruta:** [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts`, 380 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-accounts-receivable`
- **Responsabilidad:** Componente Angular: declara `AccountsReceivablePageComponent`, `LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [account-receivable-payment.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-receivable-payment-service-ts), [account-receivable.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-receivable-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [account-receivable-toolbar.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-toolbar-account-receivable-toolbar-component-ts), [account-receivable-table.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-table-account-receivable-table-component-ts), [account-receivable-form-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-delete-confirm-modal-delete-confirm-modal-component-ts), [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts), [payment-history-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts), [accounts-receivable-page.component.spec.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-spec-ts)
- **Plantilla:** [accounts-receivable-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts), [account-receivable-toolbar.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-toolbar-account-receivable-toolbar-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [account-receivable-table.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-table-account-receivable-table-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [account-receivable-form-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-delete-confirm-modal-delete-confirm-modal-component-ts), [account-statement-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-account-statement-modal-account-statement-modal-component-ts), [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts), [payment-history-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="onSearchTermChange($event)"`, `(statusFilterChange)="onStatusFilterChange($event)"`, `(clientFilterChange)="onClientFilterChange($event)"`, `(dateFromChange)="onDateFromChange($event)"`, `(dateToChange)="onDateToChange($event)"`, `(clearFilters)="clearFilters()"`, `(addRecord)="openCreateForm()"`, `(click)="selectAllClientPending()"`, `(click)="clearSelection()"`, `(click)="openSelectionSettlement()"`, `(edit)="openEditForm($event)"`, `(delete)="requestDelete($event)"`, `(viewStatement)="openStatement($event)"`, `(toggleSelect)="toggleSelect($event)"`, `(settle)="openSingleSettlement($event)"`

#### Clase `AccountsReceivablePageComponent` (L25–379)

- **Decoradores:** `@Component({ selector: 'app-accounts-receivable-page', standalone: true, imports: [ PageHeaderComponent, AccountReceivableToolbarComponent, AccountReceivableTabl`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `accountReceivableService = inject(AccountReceivableService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`, `paymentService = inject(AccountReceivablePaymentService)`
- **Datos / estado que administra:** `records = signal<AccountReceivable[]>([])`, `total = signal(0)`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<AccountReceivableStatusFilterValue>('all')`, `clientFilter = signal<Client \| null>(null)`, `dateFrom = signal('')`, `dateTo = signal('')`, `page = signal(1)`, `isFormOpen = signal(false)`, `editingRecord = signal<AccountReceivable \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingRecord = signal<AccountReceivable \| null>(null)`, `isDeleting = signal(false)`, `isStatementOpen = signal(false)`, `statementClient = signal<KardexStatementClient \| null>(null)`, `selection = signal<ReadonlyMap<string, number>>(new Map())`, `selectionClientId = signal<string \| null>(null)`, `selectionClientName = signal('')`, `selectedIds = computed<ReadonlySet<string>>(() => new Set(this.s`, `selectedCount = computed(() => this.selection().size)`, `selectedTotal = computed(() => Math.round([...this.selection().val`, `loadingClientPending = signal(false)`, `isSettlementOpen = signal(false)`, `settlementClientId = signal<string \| null>(null)`, `settlementClientName = signal('')`, `settlementAccountIds = signal<string[]>([])`, `isPaymentsOpen = signal(false)`, `paymentsChargeId = signal<string \| null>(null)`, `paymentsClientName = signal('')`…

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchActiveBalance` | método public | 129–136 | — | `void` |
| `fetchRecords` | método public | 139–163 | — | `void` |
| `onSearchTermChange` | método public | 165–168 | `value: string` | `void` |
| `onStatusFilterChange` | método public | 170–174 | `value: AccountReceivableStatusFilterValue` | `void` |
| `onClientFilterChange` | método public | 176–180 | `client: Client \| null` | `void` |
| `onDateFromChange` | método public | 182–186 | `value: string` | `void` |
| `onDateToChange` | método public | 188–192 | `value: string` | `void` |
| `onPageChange` | método public | 194–197 | `page: number` | `void` |
| `clearFilters` | método public | 199–207 | — | `void` |
| `openCreateForm` | método public | 209–212 | — | `void` |
| `openEditForm` | método public | 214–217 | `record: AccountReceivable` | `void` |
| `closeForm` | método public | 219–221 | — | `void` |
| `onRecordSaved` | método public | 223–231 | `record: AccountReceivable` | `void` |
| `openStatement` | método public | 233–236 | `record: AccountReceivable` | `void` |
| `closeStatement` | método public | 238–240 | — | `void` |
| `requestDelete` | método public | 242–245 | `record: AccountReceivable` | `void` |
| `cancelDelete` | método public | 247–250 | — | `void` |
| `confirmDelete` | método public | 252–273 | — | `void` |
| `toggleSelect` | método public | 276–293 | `record: AccountReceivable` | `void` |
| `selectAllClientPending` | método public | 296–317 | — | `void` |
| `clearSelection` | método public | 319–323 | — | `void` |
| `openSelectionSettlement` | método public | 326–335 | — | `void` |
| `openSingleSettlement` | método public | 338–343 | `record: AccountReceivable` | `void` |
| `closeSettlement` | método public | 345–347 | — | `void` |
| `onSettled` | método public | 349–361 | `result: SettlementResult` | `void` |
| `openPayments` | método public | 363–367 | `record: AccountReceivable` | `void` |
| `closePayments` | método public | 369–371 | — | `void` |
| `onPaymentsChanged` | método public | 374–378 | — | `void` |

##### `AccountsReceivablePageComponent.fetchActiveBalance`

- **Firma:** `fetchActiveBalance(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L129) (L129–136)
- **Propósito / descripción:** Always active-only, unfiltered — refetched whenever the underlying data actually changes (create/edit/deactivate/Kardex movement), never on a plain search/date/page change.
- **Dependencias (llamadas en su cuerpo):** `this.accountReceivableService.getActiveBalance().subscribe`, `this.accountReceivableService.getActiveBalance`, `this.activeBalance.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.activeBalance.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla), (mismo archivo)

##### `AccountsReceivablePageComponent.fetchRecords`

- **Firma:** `fetchRecords(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L139) (L139–163)
- **Propósito / descripción:** Not private — also called from the template as `(changed)="fetchRecords()"` after a Kardex movement is registered.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.statusFilter`, `this.accountReceivableService.getAccountsReceivable`, `this.searchTerm().trim`, `this.searchTerm`, `this.clientFilter`, `this.dateFrom`, `this.dateTo`, `this.page`, `this.records.set`, `this.total.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.records.set`, `this.total.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla), (mismo archivo)

##### `AccountsReceivablePageComponent.onSearchTermChange`

- **Firma:** `onSearchTermChange(value: string): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L165) (L165–168)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.searchTerm$.next`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.onStatusFilterChange`

- **Firma:** `onStatusFilterChange(value: AccountReceivableStatusFilterValue): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L170) (L170–174)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.statusFilter.set`, `this.page.set`, `this.fetchRecords`
- **Efectos secundarios:** Actualiza estado (signals): `this.statusFilter.set`, `this.page.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.onClientFilterChange`

- **Firma:** `onClientFilterChange(client: Client \| null): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L176) (L176–180)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientFilter.set`, `this.page.set`, `this.fetchRecords`
- **Efectos secundarios:** Actualiza estado (signals): `this.clientFilter.set`, `this.page.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.onDateFromChange`

- **Firma:** `onDateFromChange(value: string): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L182) (L182–186)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dateFrom.set`, `this.page.set`, `this.fetchRecords`
- **Efectos secundarios:** Actualiza estado (signals): `this.dateFrom.set`, `this.page.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.onDateToChange`

- **Firma:** `onDateToChange(value: string): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L188) (L188–192)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dateTo.set`, `this.page.set`, `this.fetchRecords`
- **Efectos secundarios:** Actualiza estado (signals): `this.dateTo.set`, `this.page.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L194) (L194–197)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetchRecords`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L199) (L199–207)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`, `this.clientFilter.set`, `this.dateFrom.set`, `this.dateTo.set`, `this.page.set`, `this.fetchRecords`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`, `this.clientFilter.set`, `this.dateFrom.set`, `this.dateTo.set`, `this.page.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L209) (L209–212)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingRecord.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingRecord.set`, `this.isFormOpen.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.openEditForm`

- **Firma:** `openEditForm(record: AccountReceivable): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L214) (L214–217)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingRecord.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingRecord.set`, `this.isFormOpen.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.closeForm`

- **Firma:** `closeForm(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L219) (L219–221)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.onRecordSaved`

- **Firma:** `onRecordSaved(record: AccountReceivable): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L223) (L223–231)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingRecord`, `this.isFormOpen.set`, `this.notificationService.success`, `this.fetchRecords`, `this.fetchActiveBalance`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.openStatement`

- **Firma:** `openStatement(record: AccountReceivable): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L233) (L233–236)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.statementClient.set`, `this.isStatementOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.statementClient.set`, `this.isStatementOpen.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.closeStatement`

- **Firma:** `closeStatement(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L238) (L238–240)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isStatementOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isStatementOpen.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.requestDelete`

- **Firma:** `requestDelete(record: AccountReceivable): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L242) (L242–245)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingRecord.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingRecord.set`, `this.isDeleteOpen.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L247) (L247–250)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingRecord.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingRecord.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L252) (L252–273)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingRecord`, `this.isDeleting.set`, `this.accountReceivableService.deleteAccountReceivable(record.id).subscribe`, `this.accountReceivableService.deleteAccountReceivable`, `this.isDeleteOpen.set`, `this.deletingRecord.set`, `this.notificationService.success`, `this.fetchRecords`, `this.fetchActiveBalance`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingRecord.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.toggleSelect`

- **Firma:** `toggleSelect(record: AccountReceivable): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L276) (L276–293)
- **Propósito / descripción:** Checkbox of one account; accounts of another client are refused until the selection is cleared.
- **Dependencias (llamadas en su cuerpo):** `this.selection`, `this.selectionClientId`, `this.notificationService.warning`, `this.selectionClientName`, `new Map`, `next.has`, `next.delete`, `next.set`, `this.selection.set`, `this.selectionClientId.set`, `this.selectionClientName.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selection.set`, `this.selectionClientId.set`, `this.selectionClientName.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.selectAllClientPending`

- **Firma:** `selectAllClientPending(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L296) (L296–317)
- **Propósito / descripción:** Selects every pending account of the selection's client (all pages, read from the backend).
- **Dependencias (llamadas en su cuerpo):** `this.selectionClientId`, `this.clientFilter`, `this.loadingClientPending.set`, `this.paymentService.getPendingCharges(clientId).subscribe`, `this.paymentService.getPendingCharges`, `this.selection.set`, `new Map`, `result.charges.map`, `this.selectionClientId.set`, `this.selectionClientName.set`, `this.notificationService.info`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingClientPending.set`, `this.selection.set`, `this.selectionClientId.set`, `this.selectionClientName.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.clearSelection`

- **Firma:** `clearSelection(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L319) (L319–323)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selection.set`, `new Map`, `this.selectionClientId.set`, `this.selectionClientName.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selection.set`, `this.selectionClientId.set`, `this.selectionClientName.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla), (mismo archivo)

##### `AccountsReceivablePageComponent.openSelectionSettlement`

- **Firma:** `openSelectionSettlement(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L326) (L326–335)
- **Propósito / descripción:** "Cancelar cuentas seleccionadas".
- **Dependencias (llamadas en su cuerpo):** `this.selectionClientId`, `this.selectedCount`, `this.settlementClientId.set`, `this.settlementClientName.set`, `this.selectionClientName`, `this.settlementAccountIds.set`, `this.selection().keys`, `this.selection`, `this.isSettlementOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.settlementClientId.set`, `this.settlementClientName.set`, `this.settlementAccountIds.set`, `this.isSettlementOpen.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.openSingleSettlement`

- **Firma:** `openSingleSettlement(record: AccountReceivable): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L338) (L338–343)
- **Propósito / descripción:** "Cobrar" one account (allows a partial amount).
- **Dependencias (llamadas en su cuerpo):** `this.settlementClientId.set`, `this.settlementClientName.set`, `this.settlementAccountIds.set`, `this.isSettlementOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.settlementClientId.set`, `this.settlementClientName.set`, `this.settlementAccountIds.set`, `this.isSettlementOpen.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.closeSettlement`

- **Firma:** `closeSettlement(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L345) (L345–347)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSettlementOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSettlementOpen.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.onSettled`

- **Firma:** `onSettled(result: SettlementResult): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L349) (L349–361)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSettlementOpen.set`, `new Set`, `result.operation.details.map`, `new Map`, `[...this.selection()].filter`, `this.selection`, `paid.has`, `this.clearSelection`, `this.selection.set`, `this.fetchRecords`, `this.fetchActiveBalance`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSettlementOpen.set`, `this.selection.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.openPayments`

- **Firma:** `openPayments(record: AccountReceivable): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L363) (L363–367)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.paymentsChargeId.set`, `this.paymentsClientName.set`, `this.isPaymentsOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.paymentsChargeId.set`, `this.paymentsClientName.set`, `this.isPaymentsOpen.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.closePayments`

- **Firma:** `closePayments(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L369) (L369–371)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isPaymentsOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isPaymentsOpen.set`
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

##### `AccountsReceivablePageComponent.onPaymentsChanged`

- **Firma:** `onPaymentsChanged(): void` — [accounts-receivable-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/accounts-receivable-page.component.ts#L374) (L374–378)
- **Propósito / descripción:** A collection was voided from the history modal.
- **Dependencias (llamadas en su cuerpo):** `this.clearSelection`, `this.fetchRecords`, `this.fetchActiveBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `accounts-receivable-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts"></a>

### account-receivable-form-modal.component.ts

- **Ruta:** [account-receivable-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-form-modal/account-receivable-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-form-modal/account-receivable-form-modal.component.ts`, 148 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-accounts-receivable`
- **Responsabilidad:** Componente Angular: declara `AccountReceivableFormModalComponent`, `todayIsoDate` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [account-receivable.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-receivable-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [client-search-select.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-client-search-select-client-search-select-component-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [accounts-receivable-page.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts) (plantilla)
- **Plantilla:** [account-receivable-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-form-modal/account-receivable-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [client-search-select.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`, `(selectionChange)="onClientSelected($event)"`

#### Clase `AccountReceivableFormModalComponent` (L30–147)

- **Decoradores:** `@Component({ selector: 'app-account-receivable-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent, ClientSearchSelectCo`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `accountReceivableService = inject(AccountReceivableService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input record = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<AccountReceivable>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 61–63 | — | `boolean` |
| `ngOnChanges` | método public | 65–80 | `changes: SimpleChanges` | `void` |
| `onClientSelected` | método public | 82–90 | `client: Client \| null` | `void` |
| `submit` | método public async | 92–133 | — | `Promise<void>` |
| `close` | método public async | 135–146 | — | `Promise<void>` |

##### `AccountReceivableFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [account-receivable-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-form-modal/account-receivable-form-modal.component.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivableFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [account-receivable-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-form-modal/account-receivable-form-modal.component.ts#L65) (L65–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`, `todayIsoDate`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivableFormModalComponent.onClientSelected`

- **Firma:** `onClientSelected(client: Client \| null): void` — [account-receivable-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-form-modal/account-receivable-form-modal.component.ts#L82) (L82–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.form.controls.clientId.setValue`, `this.form.controls.clientId.markAsDirty`, `this.form.controls.clientId.markAsTouched`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `account-receivable-form-modal.component.html` (plantilla)

##### `AccountReceivableFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [account-receivable-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-form-modal/account-receivable-form-modal.component.ts#L92) (L92–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.isSubmitting.set`, `description.trim().replace`, `description.trim`, `this.accountReceivableService.updateAccountReceivable`, `this.accountReceivableService.createAccountReceivable`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `account-receivable-form-modal.component.html` (plantilla)

##### `AccountReceivableFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [account-receivable-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-form-modal/account-receivable-form-modal.component.ts#L135) (L135–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `account-receivable-form-modal.component.html` (plantilla)

#### Función `todayIsoDate` (L23–28)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [account-receivable-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-form-modal/account-receivable-form-modal.component.ts#L23)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`, `now.getFullYear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-table-account-receivable-table-component-ts"></a>

### account-receivable-table.component.ts

- **Ruta:** [account-receivable-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-table/account-receivable-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-table/account-receivable-table.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-accounts-receivable`
- **Responsabilidad:** Componente Angular: declara `AccountReceivableTableComponent`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [payment-history-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [accounts-receivable-page.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts) (plantilla)
- **Plantilla:** [account-receivable-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-table/account-receivable-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addRecord.emit()"`, `(change)="toggleSelect.emit(record)"`, `(click)="settle.emit(record)"`, `(click)="viewPayments.emit(record)"`, `(click)="viewStatement.emit(record)"`, `(click)="edit.emit(record)"`, `(click)="delete.emit(record)"`

#### Clase `AccountReceivableTableComponent` (L11–59)

- **Decoradores:** `@Component({ selector: 'app-account-receivable-table', standalone: true, imports: [DatePipe, BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent]`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input records = []`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output edit = new EventEmitter<AccountReceivable>()`, `@Output delete = new EventEmitter<AccountReceivable>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addRecord = new EventEmitter<void>()`, `@Output viewStatement = new EventEmitter<AccountReceivable>()`, `@Input selectedIds = new Set()`, `@Output toggleSelect = new EventEmitter<AccountReceivable>()`, `@Output settle = new EventEmitter<AccountReceivable>()`, `@Output viewPayments = new EventEmitter<AccountReceivable>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isPayable` | método public | 47–49 | `record: AccountReceivable` | `boolean` |
| `hasPaymentState` | método public | 52–54 | `record: AccountReceivable` | `boolean` |
| `formatCurrency` | método public | 56–58 | `amount: number` | `string` |

##### `AccountReceivableTableComponent.isPayable`

- **Firma:** `isPayable(record: AccountReceivable): boolean` — [account-receivable-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-table/account-receivable-table.component.ts#L47) (L47–49)
- **Propósito / descripción:** Active CARGO with something left to collect (pending computed by the backend).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `account-receivable-table.component.html` (plantilla)

##### `AccountReceivableTableComponent.hasPaymentState`

- **Firma:** `hasPaymentState(record: AccountReceivable): boolean` — [account-receivable-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-table/account-receivable-table.component.ts#L52) (L52–54)
- **Propósito / descripción:** A CARGO that has (or had) a collection state to show.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `account-receivable-table.component.html` (plantilla)

##### `AccountReceivableTableComponent.formatCurrency`

- **Firma:** `formatCurrency(amount: number): string` — [account-receivable-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-table/account-receivable-table.component.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `formatAccountReceivableCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `account-receivable-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-toolbar-account-receivable-toolbar-component-ts"></a>

### account-receivable-toolbar.component.ts

- **Ruta:** [account-receivable-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-toolbar/account-receivable-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-toolbar/account-receivable-toolbar.component.ts`, 49 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-accounts-receivable`
- **Responsabilidad:** Componente Angular: declara `AccountReceivableToolbarComponent`, `StatusFilterOption`, `AccountReceivableStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [client-search-select.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-client-search-select-client-search-select-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [accounts-receivable-page.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts) (plantilla)
- **Plantilla:** [account-receivable-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/account-receivable-toolbar/account-receivable-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [client-search-select.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="addRecord.emit()"`, `(selectionChange)="clientFilterChange.emit($event)"`, `(ngModelChange)="dateFromChange.emit($event)"`, `(ngModelChange)="dateToChange.emit($event)"`, `(click)="statusFilterChange.emit(option.value)"`, `(click)="clearFilters.emit()"`

**Interfaces, tipos y enums:**

- `interface StatusFilterOption` (L10): sin documentación — miembros: `value`, `label`
- `type AccountReceivableStatusFilterValue` (L8) = `'all' \| 'active' \| 'inactive'`

#### Clase `AccountReceivableToolbarComponent` (L21–48)

- **Decoradores:** `@Component({ selector: 'app-account-receivable-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, ClientSearchSelectComponent], t`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input statusFilter = 'all'`, `@Input clientFilter = null`, `@Input dateFrom = ''`, `@Input dateTo = ''`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output statusFilterChange = new EventEmitter<AccountReceivableStatusFilterValu`, `@Output clientFilterChange = new EventEmitter<Client \| null>()`, `@Output dateFromChange = new EventEmitter<string>()`, `@Output dateToChange = new EventEmitter<string>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addRecord = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-client-search-select-client-search-select-component-ts"></a>

### client-search-select.component.ts

- **Ruta:** [client-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/client-search-select/client-search-select.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/client-search-select/client-search-select.component.ts`, 148 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-accounts-receivable`
- **Responsabilidad:** Searchable client select — a near-copy of Reportería's own `ProductFilterSearchComponent` (search box + dropdown + persistent "selected" chip), adapted for clients.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [client.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-client-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [account-receivable-form-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts), [account-receivable-toolbar.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-toolbar-account-receivable-toolbar-component-ts), [phones-sale-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts), [create-quotation-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts), [register-sim-sale-registration-form.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-sale-registration-form-register-sim-sale-registration-form-component-ts), [sale-pricing-bar.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-pricing-bar-sale-pricing-bar-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)
- **Plantilla:** [client-search-select.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/client-search-select/client-search-select.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clear()"`, `(ngModelChange)="onInput($event)"`, `(focus)="onFocus()"`, `(blur)="onBlur()"`, `(click)="select(client)"`

#### Clase `ClientSearchSelectComponent` (L33–147)

- **Decoradores:** `@Component({ selector: 'app-client-search-select', standalone: true, imports: [FormsModule, IconComponent], templateUrl: './client-search-select.component.html',`
- **Propósito:** Searchable client select — a near-copy of Reportería's own `ProductFilterSearchComponent` (search box + dropdown + persistent "selected" chip), adapted for clients. The dropdown's base list (shown on focus with an empty query) is the full active-clients list, fetched once; once the user types, matching is delegated to the backend's accent/ case-insensitive `search_normalize()`-based `search` param (debounced), never a `.toLowerCase().includes()` filter in JS — see `ClientService .getClients`.
- **Servicios inyectados con `inject()`:** `clientService = inject(ClientService)`
- **Datos / estado que administra:** `selectedClientId = input<string \| null>(null)`, `selectedClientName = input<string \| null>(null)`, `@Input clearable = true`, `@Input placeholder = 'Buscar cliente…'`, `@Output selectionChange = new EventEmitter<Client \| null>()`, `clients = signal<Client[]>([])`, `clientsLoaded = signal(false)`, `searchResults = signal<Client[] \| null>(null)`, `query = signal('')`, `open = signal(false)`, `loading = computed(() => !this.clientsLoaded())`, `selectedClient = computed<Client \| null>(() => { const id = this.se`, `filteredClients = computed(() => { const term = this.query().trim();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onInput` | método public | 118–125 | `value: string` | `void` |
| `onFocus` | método public | 127–129 | — | `void` |
| `onBlur` | método public | 131–133 | — | `void` |
| `select` | método public | 135–140 | `client: Client` | `void` |
| `clear` | método public | 142–146 | — | `void` |

##### `ClientSearchSelectComponent.onInput`

- **Firma:** `onInput(value: string): void` — [client-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/client-search-select/client-search-select.component.ts#L118) (L118–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.open.set`, `value.trim`, `this.searchResults.set`, `this.query$.next`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.open.set`, `this.searchResults.set`
- **Consumidores:** `client-search-select.component.html` (plantilla)

##### `ClientSearchSelectComponent.onFocus`

- **Firma:** `onFocus(): void` — [client-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/client-search-select/client-search-select.component.ts#L127) (L127–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `client-search-select.component.html` (plantilla)

##### `ClientSearchSelectComponent.onBlur`

- **Firma:** `onBlur(): void` — [client-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/client-search-select/client-search-select.component.ts#L131) (L131–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `setTimeout`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `client-search-select.component.html` (plantilla)

##### `ClientSearchSelectComponent.select`

- **Firma:** `select(client: Client): void` — [client-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/client-search-select/client-search-select.component.ts#L135) (L135–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectionChange.emit`, `this.query.set`, `this.searchResults.set`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.searchResults.set`, `this.open.set`; Emite eventos: `this.selectionChange.emit`
- **Consumidores:** `client-search-select.component.html` (plantilla)

##### `ClientSearchSelectComponent.clear`

- **Firma:** `clear(): void` — [client-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/client-search-select/client-search-select.component.ts#L142) (L142–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectionChange.emit`, `this.query.set`, `this.searchResults.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.searchResults.set`; Emite eventos: `this.selectionChange.emit`
- **Consumidores:** `client-search-select.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-accounts-receivable`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [accounts-receivable-page.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-account-receivable-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input record = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts"></a>

### payment-history-modal.component.ts

- **Ruta:** [payment-history-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.ts`, 162 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-accounts-receivable`
- **Responsabilidad:** Payment history of one account (each payment it received, voided ones included) and, on demand, the detail of the consolidated operation a payment belongs to — every account it covered.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [account-receivable-payment.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-receivable-payment-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [account-receivable-table.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-table-account-receivable-table-component-ts), [accounts-receivable-page.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts) (plantilla)
- **Plantilla:** [payment-history-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(ngModelChange)="voidReason.set($event)"`, `(click)="backToHistory()"`, `(click)="confirmVoid()"`, `(click)="startVoid()"`, `(click)="openOperation(payment.operationId)"`

**Constantes exportadas:**

- `CHARGE_STATUS_TONE` (L20) = `{ PENDIENTE: 'gold', PARCIAL: 'brand', CANCELADA: 'success', }`

#### Clase `PaymentHistoryModalComponent` (L33–161)

- **Decoradores:** `@Component({ selector: 'app-payment-history-modal', standalone: true, imports: [DatePipe, FormsModule, BadgeComponent, ButtonComponent, IconComponent], templateU`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Payment history of one account (each payment it received, voided ones included) and, on demand, the detail of the consolidated operation a payment belongs to — every account it covered. Admins can void an operation from here (mandatory reason): the backend reverses the cash or bank side and the accounts become pending again; nothing is deleted.
- **Servicios inyectados con `inject()`:** `service = inject(AccountReceivablePaymentService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input chargeId = null`, `@Input clientName = ''`, `@Input canManage = false`, `@Output closed = new EventEmitter<void>()`, `@Output changed = new EventEmitter<void>()`, `history = signal<ChargePaymentHistory \| null>(null)`, `loading = signal(false)`, `errorMessage = signal<string \| null>(null)`, `operation = signal<SettlementWithDetails \| null>(null)`, `loadingOperation = signal(false)`, `voiding = signal(false)`, `showVoidForm = signal(false)`, `voidReason = signal('')`, `isVoidSaving = signal(false)`, `voidError = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 73–79 | — | `void` |
| `load` | método public | 81–97 | — | `void` |
| `openOperation` | método public | 99–113 | `id: string` | `void` |
| `backToHistory` | método public | 115–120 | — | `void` |
| `startVoid` | método public | 122–126 | — | `void` |
| `confirmVoid` | método public | 128–154 | — | `void` |
| `close` | método public | 156–160 | — | `void` |

##### `PaymentHistoryModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [payment-history-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.ts#L73) (L73–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.operation.set`, `this.showVoidForm.set`, `this.load`
- **Efectos secundarios:** Actualiza estado (signals): `this.operation.set`, `this.showVoidForm.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PaymentHistoryModalComponent.load`

- **Firma:** `load(): void` — [payment-history-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.ts#L81) (L81–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.errorMessage.set`, `this.service.getChargeHistory(this.chargeId).subscribe`, `this.service.getChargeHistory`, `this.history.set`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.errorMessage.set`, `this.history.set`
- **Consumidores:** (mismo archivo)

##### `PaymentHistoryModalComponent.openOperation`

- **Firma:** `openOperation(id: string): void` — [payment-history-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.ts#L99) (L99–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingOperation.set`, `this.showVoidForm.set`, `this.voidError.set`, `this.service.getSettlement(id).subscribe`, `this.service.getSettlement`, `this.operation.set`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingOperation.set`, `this.showVoidForm.set`, `this.voidError.set`, `this.operation.set`
- **Consumidores:** `payment-history-modal.component.html` (plantilla)

##### `PaymentHistoryModalComponent.backToHistory`

- **Firma:** `backToHistory(): void` — [payment-history-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.ts#L115) (L115–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isVoidSaving`, `this.operation.set`, `this.showVoidForm.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.operation.set`, `this.showVoidForm.set`
- **Consumidores:** `payment-history-modal.component.html` (plantilla)

##### `PaymentHistoryModalComponent.startVoid`

- **Firma:** `startVoid(): void` — [payment-history-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.ts#L122) (L122–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidReason.set`, `this.voidError.set`, `this.showVoidForm.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidReason.set`, `this.voidError.set`, `this.showVoidForm.set`
- **Consumidores:** `payment-history-modal.component.html` (plantilla)

##### `PaymentHistoryModalComponent.confirmVoid`

- **Firma:** `confirmVoid(): void` — [payment-history-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.ts#L128) (L128–154)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.operation`, `this.voidReason().trim`, `this.voidReason`, `this.isVoidSaving`, `this.isVoidSaving.set`, `this.voidError.set`, `this.service.voidSettlement(operation.id, reason).subscribe`, `this.service.voidSettlement`, `this.showVoidForm.set`, `this.operation.set`, `this.notifications.success`, `formatCurrency`, `this.load`, `this.changed.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isVoidSaving.set`, `this.voidError.set`, `this.showVoidForm.set`, `this.operation.set`; Emite eventos: `this.changed.emit`
- **Consumidores:** `payment-history-modal.component.html` (plantilla)

##### `PaymentHistoryModalComponent.close`

- **Firma:** `close(): void` — [payment-history-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.ts#L156) (L156–160)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isVoidSaving`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `payment-history-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-spec-ts"></a>

### settlement-modal.component.spec.ts

- **Ruta:** [settlement-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.spec.ts`, 136 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-accounts-receivable`
- **Responsabilidad:** Prueba unitaria: declara `line`, `fakePreview` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [account-receivable-payment.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-receivable-payment-service-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** —
#### Función `line` (L11–26)

- **Tipo:** función local del archivo
- **Firma:** `line(id: string, pending: number)` — [settlement-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.spec.ts#L11)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `fakePreview` (L29–46)

- **Tipo:** función local del archivo
- **Firma:** `fakePreview(input: SettlementPreviewInput): SettlementPreview` — [settlement-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.spec.ts#L29)
- **Propósito / descripción:** Fake backend preview: totals are whatever the "server" computes, never the component.
- **Dependencias:** `[line('a', 500), line('b', 1000), line('c', 750)].filter`, `line`, `input.items.some`, `lines.reduce`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts"></a>

### settlement-modal.component.ts

- **Ruta:** [settlement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts`, 286 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-accounts-receivable`
- **Responsabilidad:** "Cancelar cuenta(s) por cobrar": one modal for a single account (partial amount allowed) or several accounts of the SAME client (each one for its full pending).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [account-receivable-payment.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-receivable-payment-service-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [payment-history-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts), [settlement-modal.component.spec.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-spec-ts), [accounts-receivable-page.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts) (plantilla)
- **Plantilla:** [settlement-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="cancel()"`, `(ngModelChange)="onPartialChange($event)"`, `(click)="selectMethod('EFECTIVO')"`, `(click)="selectMethod('DEPOSITO_BANCARIO')"`, `(click)="loadBanks()"`, `(ngModelChange)="onBankChange($event)"`, `(ngModelChange)="referenceNumber.set($event)"`, `(ngModelChange)="observations.set($event)"`, `(click)="goToConfirm()"`, `(click)="back()"`, `(click)="confirm()"`

**Interfaces, tipos y enums:**

- `type Step` (L35) = `'form' \| 'confirm'`

#### Clase `SettlementModalComponent` (L53–285)

- **Decoradores:** `@Component({ selector: 'app-settlement-modal', standalone: true, imports: [DatePipe, FormsModule, ButtonComponent, IconComponent, DecimalInputDirective], templat`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Cancelar cuenta(s) por cobrar": one modal for a single account (partial amount allowed) or several accounts of the SAME client (each one for its full pending). Step 1 shows every account with its pending and asks how the money was received (cash or bank deposit + account, reference, notes); step 2 is the explicit final confirmation. Every figure — pendings, total, resulting cash / bank balance — comes from the backend preview; nothing is recomputed here. The backdrop never closes it, the confirm button is disabled while saving, and one `clientRequestId` per opening makes a double click or a retry return the same operation.
- **Servicios inyectados con `inject()`:** `service = inject(AccountReceivablePaymentService)`, `cashService = inject(CashControlService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input clientId = null`, `@Input clientName = ''`, `@Input accountIds = []`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<SettlementResult>()`, `step = signal<Step>('form')`, `method = signal<SettlementPaymentMethod \| null>(null)`, `banks = signal<CashBankBalance[]>([])`, `banksFailed = signal(false)`, `bankId = signal('')`, `referenceNumber = signal('')`, `observations = signal('')`, `partialAmount = signal<number \| null>(null)`, `preview = signal<SettlementPreview \| null>(null)`, `loadingPreview = signal(false)`, `previewError = signal<string \| null>(null)`, `isSaving = signal(false)`, `errorMessage = signal<string \| null>(null)`, `accountIdsSignal = signal<string[]>([])`, `isSingle = computed(() => this.accountIdsSignal().length === `, `selectedBank = computed(() => this.banks().find((bank) => bank.ba`, `singlePending = computed(() => this.preview()?.lines[0]?.pendingAm`, `partialInvalid = computed(() => { const amount = this.partialAmount`, `canContinue = computed( () => !this.loadingPreview() && !!this.p`, `previewReady = computed(() => { const preview = this.preview(); i`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 145–161 | — | `void` |
| `loadBanks` | método public | 163–169 | — | `void` |
| `selectMethod` | método public | 171–174 | `method: SettlementPaymentMethod` | `void` |
| `onBankChange` | método public | 176–179 | `bankId: string` | `void` |
| `onPartialChange` | método public | 181–186 | `value: number \| null` | `void` |
| `refreshPreview` | método public | 189–206 | — | `void` |
| `items` | método private | 208–214 | — | (inferido) |
| `goToConfirm` | método public | 225–230 | — | `void` |
| `back` | método public | 232–236 | — | `void` |
| `cancel` | método public | 238–242 | — | `void` |
| `confirm` | método public | 244–284 | — | `void` |

##### `SettlementModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [settlement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts#L145) (L145–161)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.accountIdsSignal.set`, `this.step.set`, `this.method.set`, `this.bankId.set`, `this.referenceNumber.set`, `this.observations.set`, `this.partialAmount.set`, `this.preview.set`, `this.previewError.set`, `this.errorMessage.set`, `crypto.randomUUID`, `this.loadBanks`, `this.refreshPreview`
- **Efectos secundarios:** Actualiza estado (signals): `this.accountIdsSignal.set`, `this.step.set`, `this.method.set`, `this.bankId.set`, `this.referenceNumber.set`, `this.observations.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SettlementModalComponent.loadBanks`

- **Firma:** `loadBanks(): void` — [settlement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts#L163) (L163–169)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.banksFailed.set`, `this.cashService.getBankBalances().subscribe`, `this.cashService.getBankBalances`, `this.banks.set`, `banks.filter`
- **Efectos secundarios:** Actualiza estado (signals): `this.banksFailed.set`, `this.banks.set`
- **Consumidores:** `settlement-modal.component.html` (plantilla), (mismo archivo)

##### `SettlementModalComponent.selectMethod`

- **Firma:** `selectMethod(method: SettlementPaymentMethod): void` — [settlement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts#L171) (L171–174)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.method.set`, `this.refreshPreview`
- **Efectos secundarios:** Actualiza estado (signals): `this.method.set`
- **Consumidores:** `settlement-modal.component.html` (plantilla)

##### `SettlementModalComponent.onBankChange`

- **Firma:** `onBankChange(bankId: string): void` — [settlement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts#L176) (L176–179)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankId.set`, `this.refreshPreview`
- **Efectos secundarios:** Actualiza estado (signals): `this.bankId.set`
- **Consumidores:** `settlement-modal.component.html` (plantilla)

##### `SettlementModalComponent.onPartialChange`

- **Firma:** `onPartialChange(value: number \| null): void` — [settlement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts#L181) (L181–186)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.partialAmount.set`, `this.partialInvalid`, `this.refreshPreview`
- **Efectos secundarios:** Actualiza estado (signals): `this.partialAmount.set`
- **Consumidores:** `settlement-modal.component.html` (plantilla)

##### `SettlementModalComponent.refreshPreview`

- **Firma:** `refreshPreview(): void` — [settlement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts#L189) (L189–206)
- **Propósito / descripción:** Re-reads pendings / total / resulting balance from the backend.
- **Dependencias (llamadas en su cuerpo):** `this.accountIdsSignal`, `this.previewRequests.next`, `this.method`, `this.bankId`, `this.items`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `SettlementModalComponent.items`

- **Firma:** `items()` — [settlement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts#L208) (L208–214)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.accountIdsSignal`, `this.partialAmount`, `ids.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `SettlementModalComponent.goToConfirm`

- **Firma:** `goToConfirm(): void` — [settlement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts#L225) (L225–230)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canContinue`, `this.previewReady`, `this.errorMessage.set`, `this.step.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.step.set`
- **Consumidores:** `settlement-modal.component.html` (plantilla)

##### `SettlementModalComponent.back`

- **Firma:** `back(): void` — [settlement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts#L232) (L232–236)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.step.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.step.set`
- **Consumidores:** `settlement-modal.component.html` (plantilla)

##### `SettlementModalComponent.cancel`

- **Firma:** `cancel(): void` — [settlement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts#L238) (L238–242)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `settlement-modal.component.html` (plantilla)

##### `SettlementModalComponent.confirm`

- **Firma:** `confirm(): void` — [settlement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts#L244) (L244–284)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.preview`, `this.method`, `this.isSaving`, `this.isSaving.set`, `this.errorMessage.set`, `this.service.settle`, `this.items`, `this.bankId`, `this.referenceNumber().trim`, `this.referenceNumber`, `this.observations().trim`, `this.observations`, `this.notifications.success`, `formatCurrency`, `this.saved.emit`, `extractErrorMessage`, `this.step.set`, `this.refreshPreview`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.errorMessage.set`, `this.step.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `settlement-modal.component.html` (plantilla)

#### Función `accountCode` (L38–40)

- **Tipo:** función exportada
- **Firma:** `accountCode(id: string): string` — [settlement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts#L38)
- **Propósito / descripción:** Short, stable identifier of an account for the summary ("A1B2C3D4").
- **Dependencias:** `id.slice(0, 8).toUpperCase`, `id.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

