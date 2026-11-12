# Frontend `dashboard-account-types`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [account-types-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AccountTypesPageComponent` (sin comentario de documentación en el código). | 11 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [account-type-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-form-modal-account-type-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AccountTypeFormModalComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [account-type-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-summary-account-type-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AccountTypeSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [account-type-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-table-account-type-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AccountTypeTableComponent`, `AccountTypeSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [account-type-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-toolbar-account-type-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AccountTypeToolbarComponent`, `StatusFilterOption`, `AccountTypeStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [account-types-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `account-types-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-account-type-summary`, `app-account-type-toolbar`, `app-account-type-table`, `app-account-type-form-modal`, `app-account-type-delete-confirm-modal`. | — | — | Media |
| [account-types-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [account-type-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-form-modal/account-type-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `account-type-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [account-type-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-form-modal/account-type-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [account-type-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-summary/account-type-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `account-type-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [account-type-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-summary/account-type-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [account-type-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-table/account-type-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `account-type-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [account-type-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-table/account-type-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [account-type-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-toolbar/account-type-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `account-type-toolbar.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [account-type-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-toolbar/account-type-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/delete-confirm-modal/delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts"></a>

### account-types-page.component.ts

- **Ruta:** [account-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.ts`, 153 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-account-types`
- **Responsabilidad:** Componente Angular: declara `AccountTypesPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [account-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-type-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [account-type-summary.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-summary-account-type-summary-component-ts), [account-type-toolbar.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-toolbar-account-type-toolbar-component-ts), [account-type-table.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-table-account-type-table-component-ts), [account-type-form-modal.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-form-modal-account-type-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [account-types-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [account-type-summary.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-summary-account-type-summary-component-ts), [account-type-toolbar.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-toolbar-account-type-toolbar-component-ts), [account-type-table.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-table-account-type-table-component-ts), [account-type-form-modal.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-form-modal-account-type-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="searchTerm.set($event)"`, `(statusFilterChange)="statusFilter.set($event)"`, `(addAccountType)="openCreateForm()"`, `(edit)="openEditForm($event)"`, `(delete)="requestDelete($event)"`, `(clearFilters)="clearFilters()"`, `(closed)="closeForm()"`, `(saved)="onAccountTypeSaved($event)"`, `(confirmed)="confirmDelete()"`, `(cancelled)="cancelDelete()"`

#### Clase `AccountTypesPageComponent` (L16–152)

- **Decoradores:** `@Component({ selector: 'app-account-types-page', standalone: true, imports: [ PageHeaderComponent, AccountTypeSummaryComponent, AccountTypeToolbarComponent, Acco`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `accountTypeService = inject(AccountTypeService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `accountTypes = signal<AccountType[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<AccountTypeStatusFilterValue>('all')`, `isFormOpen = signal(false)`, `editingAccountType = signal<AccountType \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingAccountType = signal<AccountType \| null>(null)`, `isDeleting = signal(false)`, `filteredAccountTypes = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed( () => this.searchTerm().trim().length > `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchAccountTypes` | método private | 72–85 | — | `void` |
| `openCreateForm` | método public | 87–90 | — | `void` |
| `openEditForm` | método public | 92–95 | `accountType: AccountType` | `void` |
| `closeForm` | método public | 97–99 | — | `void` |
| `onAccountTypeSaved` | método public | 101–112 | `accountType: AccountType` | `void` |
| `requestDelete` | método public | 114–117 | `accountType: AccountType` | `void` |
| `cancelDelete` | método public | 119–122 | — | `void` |
| `confirmDelete` | método public | 124–146 | — | `void` |
| `clearFilters` | método public | 148–151 | — | `void` |

##### `AccountTypesPageComponent.fetchAccountTypes`

- **Firma:** `fetchAccountTypes(): void` — [account-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.ts#L72) (L72–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.accountTypeService.getAccountTypes(true).subscribe`, `this.accountTypeService.getAccountTypes`, `this.accountTypes.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.accountTypes.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountTypesPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [account-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.ts#L87) (L87–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingAccountType.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingAccountType.set`, `this.isFormOpen.set`
- **Consumidores:** `account-types-page.component.html` (plantilla)

##### `AccountTypesPageComponent.openEditForm`

- **Firma:** `openEditForm(accountType: AccountType): void` — [account-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.ts#L92) (L92–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingAccountType.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingAccountType.set`, `this.isFormOpen.set`
- **Consumidores:** `account-types-page.component.html` (plantilla)

##### `AccountTypesPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [account-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.ts#L97) (L97–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `account-types-page.component.html` (plantilla)

##### `AccountTypesPageComponent.onAccountTypeSaved`

- **Firma:** `onAccountTypeSaved(accountType: AccountType): void` — [account-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.ts#L101) (L101–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingAccountType`, `this.isFormOpen.set`, `this.accountTypes.update`, `list.map`, `this.notificationService.success`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.accountTypes.update`
- **Consumidores:** `account-types-page.component.html` (plantilla)

##### `AccountTypesPageComponent.requestDelete`

- **Firma:** `requestDelete(accountType: AccountType): void` — [account-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.ts#L114) (L114–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingAccountType.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingAccountType.set`, `this.isDeleteOpen.set`
- **Consumidores:** `account-types-page.component.html` (plantilla)

##### `AccountTypesPageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [account-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.ts#L119) (L119–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingAccountType.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingAccountType.set`
- **Consumidores:** `account-types-page.component.html` (plantilla)

##### `AccountTypesPageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [account-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.ts#L124) (L124–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingAccountType`, `this.isDeleting.set`, `this.accountTypeService.deleteAccountType(accountType.id).subscribe`, `this.accountTypeService.deleteAccountType`, `this.isDeleteOpen.set`, `this.deletingAccountType.set`, `this.accountTypes.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingAccountType.set`, `this.accountTypes.update`
- **Consumidores:** `account-types-page.component.html` (plantilla)

##### `AccountTypesPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [account-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/account-types-page.component.ts#L148) (L148–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `account-types-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-form-modal-account-type-form-modal-component-ts"></a>

### account-type-form-modal.component.ts

- **Ruta:** [account-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-form-modal/account-type-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-form-modal/account-type-form-modal.component.ts`, 110 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-account-types`
- **Responsabilidad:** Componente Angular: declara `AccountTypeFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [account-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-type-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts), [account-types-page.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts) (plantilla)
- **Plantilla:** [account-type-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-form-modal/account-type-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `AccountTypeFormModalComponent` (L21–109)

- **Decoradores:** `@Component({ selector: 'app-account-type-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './account-t`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `accountTypeService = inject(AccountTypeService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input accountType = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<AccountType>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 48–50 | — | `boolean` |
| `ngOnChanges` | método public | 52–61 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 63–95 | — | `Promise<void>` |
| `close` | método public async | 97–108 | — | `Promise<void>` |

##### `AccountTypeFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [account-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-form-modal/account-type-form-modal.component.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountTypeFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [account-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-form-modal/account-type-form-modal.component.ts#L52) (L52–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountTypeFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [account-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-form-modal/account-type-form-modal.component.ts#L63) (L63–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.accountTypeService.updateAccountType`, `this.accountTypeService.createAccountType`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `account-type-form-modal.component.html` (plantilla)

##### `AccountTypeFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [account-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-form-modal/account-type-form-modal.component.ts#L97) (L97–108)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `account-type-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-summary-account-type-summary-component-ts"></a>

### account-type-summary.component.ts

- **Ruta:** [account-type-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-summary/account-type-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-summary/account-type-summary.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-account-types`
- **Responsabilidad:** Componente Angular: declara `AccountTypeSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts), [account-types-page.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts) (plantilla)
- **Plantilla:** [account-type-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-summary/account-type-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface SummaryTile` (L6): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `AccountTypeSummaryComponent` (L14–59)

- **Decoradores:** `@Component({ selector: 'app-account-type-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './account-type-summary.compone`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `accountTypes = signal<AccountType[]>([])`, `tiles = computed<SummaryTile[]>(() => { const accountTypes`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `data` | setter public | 25–28 | `value: AccountType[]` | (inferido) |

##### `AccountTypeSummaryComponent.data`

- **Firma:** `data(value: AccountType[])` — [account-type-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-summary/account-type-summary.component.ts#L25) (L25–28)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.accountTypes.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.accountTypes.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-table-account-type-table-component-ts"></a>

### account-type-table.component.ts

- **Ruta:** [account-type-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-table/account-type-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-table/account-type-table.component.ts`, 73 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-account-types`
- **Responsabilidad:** Componente Angular: declara `AccountTypeTableComponent`, `AccountTypeSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts), [account-types-page.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts) (plantilla)
- **Plantilla:** [account-type-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-table/account-type-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addAccountType.emit()"`, `(click)="toggleSort('name')"`, `(click)="toggleSort('isActive')"`, `(click)="edit.emit(accountType)"`, `(click)="delete.emit(accountType)"`

**Interfaces, tipos y enums:**

- `type AccountTypeSortColumn` (L6) = `'name' \| 'isActive' \| 'createdAt'`
- `type SortDirection` (L7) = `'asc' \| 'desc'`

#### Clase `AccountTypeTableComponent` (L12–72)

- **Decoradores:** `@Component({ selector: 'app-account-type-table', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl: '`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `accountTypesInput = signal<AccountType[]>([])`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output edit = new EventEmitter<AccountType>()`, `@Output delete = new EventEmitter<AccountType>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addAccountType = new EventEmitter<void>()`, `sortColumn = signal<AccountTypeSortColumn>('createdAt')`, `sortDirection = signal<SortDirection>('desc')`, `sortedAccountTypes = computed(() => { const column = this.sortColumn();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `accountTypes` | setter public | 23–26 | `value: AccountType[]` | (inferido) |
| `toggleSort` | método public | 57–64 | `column: AccountTypeSortColumn` | `void` |
| `sortIcon` | método public | 66–71 | `column: AccountTypeSortColumn` | `string` |

##### `AccountTypeTableComponent.accountTypes`

- **Firma:** `accountTypes(value: AccountType[])` — [account-type-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-table/account-type-table.component.ts#L23) (L23–26)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.accountTypesInput.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.accountTypesInput.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountTypeTableComponent.toggleSort`

- **Firma:** `toggleSort(column: AccountTypeSortColumn): void` — [account-type-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-table/account-type-table.component.ts#L57) (L57–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Consumidores:** `account-type-table.component.html` (plantilla)

##### `AccountTypeTableComponent.sortIcon`

- **Firma:** `sortIcon(column: AccountTypeSortColumn): string` — [account-type-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-table/account-type-table.component.ts#L66) (L66–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `account-type-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-toolbar-account-type-toolbar-component-ts"></a>

### account-type-toolbar.component.ts

- **Ruta:** [account-type-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-toolbar/account-type-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-toolbar/account-type-toolbar.component.ts`, 39 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-account-types`
- **Responsabilidad:** Componente Angular: declara `AccountTypeToolbarComponent`, `StatusFilterOption`, `AccountTypeStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts), [account-types-page.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts) (plantilla)
- **Plantilla:** [account-type-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/account-type-toolbar/account-type-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="addAccountType.emit()"`, `(click)="statusFilterChange.emit(option.value)"`

**Interfaces, tipos y enums:**

- `interface StatusFilterOption` (L8): sin documentación — miembros: `value`, `label`
- `type AccountTypeStatusFilterValue` (L6) = `'all' \| 'active' \| 'inactive'`

#### Clase `AccountTypeToolbarComponent` (L19–38)

- **Decoradores:** `@Component({ selector: 'app-account-type-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './account-type-toolbar`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input statusFilter = 'all'`, `@Input canManage = true`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output statusFilterChange = new EventEmitter<AccountTypeStatusFilterValue>()`, `@Output addAccountType = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/account-types/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-account-types`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts), [account-types-page.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/account-types/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-account-type-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm-modal`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input accountType = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
