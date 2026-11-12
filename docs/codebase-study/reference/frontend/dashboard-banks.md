# Frontend `dashboard-banks`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [banks-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `BanksPageComponent` (sin comentario de documentación en el código). | 12 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [bank-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-form-modal-bank-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `BankFormModalComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/core, @angular/common, @angular/forms | 1 | Baja (1 consumidores) |
| [bank-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-summary-bank-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `BankSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [bank-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-table-bank-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `BankTableComponent`, `BankSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [bank-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-toolbar-bank-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `BankToolbarComponent`, `StatusFilterOption`, `BankStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [banks-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `banks-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-bank-summary`, `app-bank-toolbar`, `app-bank-table`, `app-bank-form-modal`, `app-bank-delete-confirm-modal`. | — | — | Media |
| [banks-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-form-modal/bank-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [bank-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-form-modal/bank-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-summary/bank-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [bank-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-summary/bank-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-table/bank-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [bank-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-table/bank-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-toolbar/bank-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-toolbar.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [bank-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-toolbar/bank-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/delete-confirm-modal/delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts"></a>

### banks-page.component.ts

- **Ruta:** [banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.ts`, 176 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-banks`
- **Responsabilidad:** Componente Angular: declara `BanksPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [account-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-type-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [bank-summary.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-summary-bank-summary-component-ts), [bank-toolbar.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-toolbar-bank-toolbar-component-ts), [bank-table.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-table-bank-table-component-ts), [bank-form-modal.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-form-modal-bank-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [banks-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [bank-summary.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-summary-bank-summary-component-ts), [bank-toolbar.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-toolbar-bank-toolbar-component-ts), [bank-table.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-table-bank-table-component-ts), [bank-form-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-form-modal-bank-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="searchTerm.set($event)"`, `(statusFilterChange)="statusFilter.set($event)"`, `(addBank)="openCreateForm()"`, `(edit)="openEditForm($event)"`, `(delete)="requestDelete($event)"`, `(clearFilters)="clearFilters()"`, `(toggleTransaccionar)="toggleTransaccionar($event)"`, `(closed)="closeForm()"`, `(saved)="onBankSaved($event)"`, `(confirmed)="confirmDelete()"`, `(cancelled)="cancelDelete()"`

#### Clase `BanksPageComponent` (L17–175)

- **Decoradores:** `@Component({ selector: 'app-banks-page', standalone: true, imports: [PageHeaderComponent, BankSummaryComponent, BankToolbarComponent, BankTableComponent, BankFor`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `bankService = inject(BankService)`, `accountTypeService = inject(AccountTypeService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `banks = signal<Bank[]>([])`, `loading = signal(true)`, `accountTypeOptions = signal<AccountType[]>([])`, `searchTerm = signal('')`, `statusFilter = signal<BankStatusFilterValue>('all')`, `isFormOpen = signal(false)`, `editingBank = signal<Bank \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingBank = signal<Bank \| null>(null)`, `isDeleting = signal(false)`, `togglingTransaccionarId = signal<string \| null>(null)`, `filteredBanks = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed( () => this.searchTerm().trim().length > `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `openCreateForm` | método public | 88–91 | — | `void` |
| `openEditForm` | método public | 93–96 | `bank: Bank` | `void` |
| `closeForm` | método public | 98–100 | — | `void` |
| `onBankSaved` | método public | 102–111 | `bank: Bank` | `void` |
| `toggleTransaccionar` | método public | 114–137 | `bank: Bank` | `void` |
| `requestDelete` | método public | 139–142 | `bank: Bank` | `void` |
| `cancelDelete` | método public | 144–147 | — | `void` |
| `confirmDelete` | método public | 149–169 | — | `void` |
| `clearFilters` | método public | 171–174 | — | `void` |

##### `BanksPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.ts#L88) (L88–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingBank.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingBank.set`, `this.isFormOpen.set`
- **Consumidores:** `banks-page.component.html` (plantilla)

##### `BanksPageComponent.openEditForm`

- **Firma:** `openEditForm(bank: Bank): void` — [banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.ts#L93) (L93–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingBank.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingBank.set`, `this.isFormOpen.set`
- **Consumidores:** `banks-page.component.html` (plantilla)

##### `BanksPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.ts#L98) (L98–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `banks-page.component.html` (plantilla)

##### `BanksPageComponent.onBankSaved`

- **Firma:** `onBankSaved(bank: Bank): void` — [banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.ts#L102) (L102–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingBank`, `this.isFormOpen.set`, `this.banks.update`, `list.map`, `this.notificationService.success`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.banks.update`
- **Consumidores:** `banks-page.component.html` (plantilla)

##### `BanksPageComponent.toggleTransaccionar`

- **Firma:** `toggleTransaccionar(bank: Bank): void` — [banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.ts#L114) (L114–137)
- **Propósito / descripción:** Muestra/oculta la cuenta en "Cuenta bancaria afectada" de Transaccionar. La tabla refleja lo que el backend guardó, nunca un cambio optimista.
- **Dependencias (llamadas en su cuerpo):** `this.togglingTransaccionarId`, `this.togglingTransaccionarId.set`, `this.bankService.setAvailableInTransaccionar(bank.id, next).subscribe`, `this.bankService.setAvailableInTransaccionar`, `this.banks.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.togglingTransaccionarId.set`, `this.banks.update`
- **Consumidores:** `banks-page.component.html` (plantilla)

##### `BanksPageComponent.requestDelete`

- **Firma:** `requestDelete(bank: Bank): void` — [banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.ts#L139) (L139–142)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingBank.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingBank.set`, `this.isDeleteOpen.set`
- **Consumidores:** `banks-page.component.html` (plantilla)

##### `BanksPageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.ts#L144) (L144–147)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingBank.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingBank.set`
- **Consumidores:** `banks-page.component.html` (plantilla)

##### `BanksPageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.ts#L149) (L149–169)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingBank`, `this.isDeleting.set`, `this.bankService.deleteBank(bank.id).subscribe`, `this.bankService.deleteBank`, `this.isDeleteOpen.set`, `this.deletingBank.set`, `this.banks.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingBank.set`, `this.banks.update`
- **Consumidores:** `banks-page.component.html` (plantilla)

##### `BanksPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/banks-page.component.ts#L171) (L171–174)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `banks-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-form-modal-bank-form-modal-component-ts"></a>

### bank-form-modal.component.ts

- **Ruta:** [bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-form-modal/bank-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-form-modal/bank-form-modal.component.ts`, 150 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-banks`
- **Responsabilidad:** Componente Angular: declara `BankFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [banks-page.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts)
- **Plantilla:** [bank-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-form-modal/bank-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `BankFormModalComponent` (L21–149)

- **Decoradores:** `@Component({ selector: 'app-bank-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective], templateUr`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `bankService = inject(BankService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input bank = null`, `@Input accountTypes = []`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<Bank>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `selectedSpecialHint` | getter public | 59–62 | — | `string \| null` |
| `isEditMode` | getter public | 64–66 | — | `boolean` |
| `ngOnChanges` | método public | 68–103 | `changes: SimpleChanges` | `void` |
| `submit` | método public | 105–141 | — | `void` |
| `close` | método public | 143–148 | — | `void` |

##### `BankFormModalComponent.selectedSpecialHint`

- **Firma:** `selectedSpecialHint(): string \| null` — [bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-form-modal/bank-form-modal.component.ts#L59) (L59–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.specialAccountOptions.find`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-form-modal/bank-form-modal.component.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-form-modal/bank-form-modal.component.ts#L68) (L68–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`, `this.form.controls.finalBalance.disable`, `this.form.controls.finalBalance.enable`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankFormModalComponent.submit`

- **Firma:** `submit(): void` — [bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-form-modal/bank-form-modal.component.ts#L105) (L105–141)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.bankService.updateBank`, `this.bankService.createBank`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `bank-form-modal.component.html` (plantilla)

##### `BankFormModalComponent.close`

- **Firma:** `close(): void` — [bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-form-modal/bank-form-modal.component.ts#L143) (L143–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `bank-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-summary-bank-summary-component-ts"></a>

### bank-summary.component.ts

- **Ruta:** [bank-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-summary/bank-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-summary/bank-summary.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-banks`
- **Responsabilidad:** Componente Angular: declara `BankSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [banks-page.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts), [banks-page.component.ts (plantilla)](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts) (plantilla)
- **Plantilla:** [bank-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-summary/bank-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface SummaryTile` (L6): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `BankSummaryComponent` (L14–59)

- **Decoradores:** `@Component({ selector: 'app-bank-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './bank-summary.component.html', styleU`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `banks = signal<Bank[]>([])`, `tiles = computed<SummaryTile[]>(() => { const banks = this`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `data` | setter public | 25–28 | `value: Bank[]` | (inferido) |

##### `BankSummaryComponent.data`

- **Firma:** `data(value: Bank[])` — [bank-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-summary/bank-summary.component.ts#L25) (L25–28)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.banks.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.banks.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-table-bank-table-component-ts"></a>

### bank-table.component.ts

- **Ruta:** [bank-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-table/bank-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-table/bank-table.component.ts`, 77 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-banks`
- **Responsabilidad:** Componente Angular: declara `BankTableComponent`, `BankSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [banks-page.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts), [banks-page.component.ts (plantilla)](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts) (plantilla)
- **Plantilla:** [bank-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-table/bank-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addBank.emit()"`, `(click)="toggleSort('name')"`, `(click)="toggleSort('accountNumber')"`, `(click)="toggleSort('accountTypeName')"`, `(click)="toggleSort('isActive')"`, `(change)="toggleTransaccionar.emit(bank)"`, `(click)="edit.emit(bank)"`, `(click)="delete.emit(bank)"`

**Interfaces, tipos y enums:**

- `type BankSortColumn` (L6) = `'name' \| 'accountNumber' \| 'accountTypeName' \| 'isActive' \| 'createdAt'`
- `type SortDirection` (L7) = `'asc' \| 'desc'`

#### Clase `BankTableComponent` (L12–76)

- **Decoradores:** `@Component({ selector: 'app-bank-table', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl: './bank-t`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `banksInput = signal<Bank[]>([])`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output edit = new EventEmitter<Bank>()`, `@Output delete = new EventEmitter<Bank>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addBank = new EventEmitter<void>()`, `@Output toggleTransaccionar = new EventEmitter<Bank>()`, `@Input togglingId = null`, `sortColumn = signal<BankSortColumn>('createdAt')`, `sortDirection = signal<SortDirection>('desc')`, `sortedBanks = computed(() => { const column = this.sortColumn();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `banks` | setter public | 23–26 | `value: Bank[]` | (inferido) |
| `toggleSort` | método public | 61–68 | `column: BankSortColumn` | `void` |
| `sortIcon` | método public | 70–75 | `column: BankSortColumn` | `string` |

##### `BankTableComponent.banks`

- **Firma:** `banks(value: Bank[])` — [bank-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-table/bank-table.component.ts#L23) (L23–26)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.banksInput.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.banksInput.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankTableComponent.toggleSort`

- **Firma:** `toggleSort(column: BankSortColumn): void` — [bank-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-table/bank-table.component.ts#L61) (L61–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Consumidores:** `bank-table.component.html` (plantilla)

##### `BankTableComponent.sortIcon`

- **Firma:** `sortIcon(column: BankSortColumn): string` — [bank-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-table/bank-table.component.ts#L70) (L70–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `bank-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-toolbar-bank-toolbar-component-ts"></a>

### bank-toolbar.component.ts

- **Ruta:** [bank-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-toolbar/bank-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-toolbar/bank-toolbar.component.ts`, 39 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-banks`
- **Responsabilidad:** Componente Angular: declara `BankToolbarComponent`, `StatusFilterOption`, `BankStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [banks-page.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts), [banks-page.component.ts (plantilla)](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts) (plantilla)
- **Plantilla:** [bank-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/bank-toolbar/bank-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="addBank.emit()"`, `(click)="statusFilterChange.emit(option.value)"`

**Interfaces, tipos y enums:**

- `interface StatusFilterOption` (L8): sin documentación — miembros: `value`, `label`
- `type BankStatusFilterValue` (L6) = `'all' \| 'active' \| 'inactive'`

#### Clase `BankToolbarComponent` (L19–38)

- **Decoradores:** `@Component({ selector: 'app-bank-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './bank-toolbar.component.html'`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input statusFilter = 'all'`, `@Input canManage = true`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output statusFilterChange = new EventEmitter<BankStatusFilterValue>()`, `@Output addBank = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-banks-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/banks/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-banks`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [banks-page.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts), [banks-page.component.ts (plantilla)](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/banks/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-bank-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm-modal.compone`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input bank = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
