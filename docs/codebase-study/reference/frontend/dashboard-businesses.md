# Frontend `dashboard-businesses`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [businesses-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `BusinessesPageComponent` (sin comentario de documentación en el código). | 11 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [business-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-form-modal-business-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `BusinessFormModalComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [business-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-summary-business-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `BusinessSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [business-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-table-business-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `BusinessTableComponent`, `BusinessSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [business-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-toolbar-business-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `BusinessToolbarComponent`, `StatusFilterOption`, `StatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [businesses-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `businesses-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-business-summary`, `app-business-toolbar`, `app-business-table`, `app-business-form-modal`, `app-business-delete-confirm-modal`. | — | — | Media |
| [businesses-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [business-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-form-modal/business-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `business-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [business-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-form-modal/business-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [business-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-summary/business-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `business-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [business-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-summary/business-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [business-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-table/business-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `business-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [business-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-table/business-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [business-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-toolbar/business-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `business-toolbar.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [business-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-toolbar/business-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/delete-confirm-modal/delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts"></a>

### businesses-page.component.ts

- **Ruta:** [businesses-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.ts`, 153 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-businesses`
- **Responsabilidad:** Componente Angular: declara `BusinessesPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [business.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-business-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [business-summary.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-summary-business-summary-component-ts), [business-toolbar.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-toolbar-business-toolbar-component-ts), [business-table.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-table-business-table-component-ts), [business-form-modal.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-form-modal-business-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [businesses-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [business-summary.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-summary-business-summary-component-ts), [business-toolbar.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-toolbar-business-toolbar-component-ts), [business-table.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-table-business-table-component-ts), [business-form-modal.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-form-modal-business-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="searchTerm.set($event)"`, `(statusFilterChange)="statusFilter.set($event)"`, `(addBusiness)="openCreateForm()"`, `(edit)="openEditForm($event)"`, `(delete)="requestDelete($event)"`, `(clearFilters)="clearFilters()"`, `(closed)="closeForm()"`, `(saved)="onBusinessSaved($event)"`, `(confirmed)="confirmDelete()"`, `(cancelled)="cancelDelete()"`

#### Clase `BusinessesPageComponent` (L16–152)

- **Decoradores:** `@Component({ selector: 'app-businesses-page', standalone: true, imports: [ PageHeaderComponent, BusinessSummaryComponent, BusinessToolbarComponent, BusinessTable`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `businessService = inject(BusinessService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `businesses = signal<Business[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<StatusFilterValue>('all')`, `isFormOpen = signal(false)`, `editingBusiness = signal<Business \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingBusiness = signal<Business \| null>(null)`, `isDeleting = signal(false)`, `filteredBusinesses = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed(() => this.searchTerm().trim().length > 0`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchBusinesses` | método private | 71–85 | — | `void` |
| `openCreateForm` | método public | 87–90 | — | `void` |
| `openEditForm` | método public | 92–95 | `business: Business` | `void` |
| `closeForm` | método public | 97–99 | — | `void` |
| `onBusinessSaved` | método public | 101–112 | `business: Business` | `void` |
| `requestDelete` | método public | 114–117 | `business: Business` | `void` |
| `cancelDelete` | método public | 119–122 | — | `void` |
| `confirmDelete` | método public | 124–146 | — | `void` |
| `clearFilters` | método public | 148–151 | — | `void` |

##### `BusinessesPageComponent.fetchBusinesses`

- **Firma:** `fetchBusinesses(): void` — [businesses-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.ts#L71) (L71–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.businessService.getBusinesses(true).subscribe`, `this.businessService.getBusinesses`, `this.businesses.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.businesses.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BusinessesPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [businesses-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.ts#L87) (L87–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingBusiness.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingBusiness.set`, `this.isFormOpen.set`
- **Consumidores:** `businesses-page.component.html` (plantilla)

##### `BusinessesPageComponent.openEditForm`

- **Firma:** `openEditForm(business: Business): void` — [businesses-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.ts#L92) (L92–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingBusiness.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingBusiness.set`, `this.isFormOpen.set`
- **Consumidores:** `businesses-page.component.html` (plantilla)

##### `BusinessesPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [businesses-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.ts#L97) (L97–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `businesses-page.component.html` (plantilla)

##### `BusinessesPageComponent.onBusinessSaved`

- **Firma:** `onBusinessSaved(business: Business): void` — [businesses-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.ts#L101) (L101–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingBusiness`, `this.isFormOpen.set`, `this.businesses.update`, `list.map`, `this.notificationService.success`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.businesses.update`
- **Consumidores:** `businesses-page.component.html` (plantilla)

##### `BusinessesPageComponent.requestDelete`

- **Firma:** `requestDelete(business: Business): void` — [businesses-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.ts#L114) (L114–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingBusiness.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingBusiness.set`, `this.isDeleteOpen.set`
- **Consumidores:** `businesses-page.component.html` (plantilla)

##### `BusinessesPageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [businesses-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.ts#L119) (L119–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingBusiness.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingBusiness.set`
- **Consumidores:** `businesses-page.component.html` (plantilla)

##### `BusinessesPageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [businesses-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.ts#L124) (L124–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingBusiness`, `this.isDeleting.set`, `this.businessService.deleteBusiness(business.id).subscribe`, `this.businessService.deleteBusiness`, `this.isDeleteOpen.set`, `this.deletingBusiness.set`, `this.businesses.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingBusiness.set`, `this.businesses.update`
- **Consumidores:** `businesses-page.component.html` (plantilla)

##### `BusinessesPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [businesses-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/businesses-page.component.ts#L148) (L148–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `businesses-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-form-modal-business-form-modal-component-ts"></a>

### business-form-modal.component.ts

- **Ruta:** [business-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-form-modal/business-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-form-modal/business-form-modal.component.ts`, 116 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-businesses`
- **Responsabilidad:** Componente Angular: declara `BusinessFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [business.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-business-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [businesses-page.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts), [businesses-page.component.ts (plantilla)](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts) (plantilla)
- **Plantilla:** [business-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-form-modal/business-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `BusinessFormModalComponent` (L21–115)

- **Decoradores:** `@Component({ selector: 'app-business-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './business-form`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `businessService = inject(BusinessService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input business = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<Business>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 49–51 | — | `boolean` |
| `ngOnChanges` | método public | 53–66 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 68–101 | — | `Promise<void>` |
| `close` | método public async | 103–114 | — | `Promise<void>` |

##### `BusinessFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [business-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-form-modal/business-form-modal.component.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BusinessFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [business-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-form-modal/business-form-modal.component.ts#L53) (L53–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BusinessFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [business-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-form-modal/business-form-modal.component.ts#L68) (L68–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.businessService.updateBusiness`, `this.businessService.createBusiness`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `business-form-modal.component.html` (plantilla)

##### `BusinessFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [business-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-form-modal/business-form-modal.component.ts#L103) (L103–114)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `business-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-summary-business-summary-component-ts"></a>

### business-summary.component.ts

- **Ruta:** [business-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-summary/business-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-summary/business-summary.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-businesses`
- **Responsabilidad:** Componente Angular: declara `BusinessSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [businesses-page.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts), [businesses-page.component.ts (plantilla)](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts) (plantilla)
- **Plantilla:** [business-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-summary/business-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface SummaryTile` (L6): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `BusinessSummaryComponent` (L14–59)

- **Decoradores:** `@Component({ selector: 'app-business-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './business-summary.component.html'`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `businesses = signal<Business[]>([])`, `tiles = computed<SummaryTile[]>(() => { const businesses =`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `data` | setter public | 25–28 | `value: Business[]` | (inferido) |

##### `BusinessSummaryComponent.data`

- **Firma:** `data(value: Business[])` — [business-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-summary/business-summary.component.ts#L25) (L25–28)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.businesses.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.businesses.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-table-business-table-component-ts"></a>

### business-table.component.ts

- **Ruta:** [business-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-table/business-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-table/business-table.component.ts`, 73 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-businesses`
- **Responsabilidad:** Componente Angular: declara `BusinessTableComponent`, `BusinessSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [businesses-page.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts), [businesses-page.component.ts (plantilla)](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts) (plantilla)
- **Plantilla:** [business-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-table/business-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addBusiness.emit()"`, `(click)="toggleSort('name')"`, `(click)="toggleSort('description')"`, `(click)="toggleSort('isActive')"`, `(click)="edit.emit(business)"`, `(click)="delete.emit(business)"`

**Interfaces, tipos y enums:**

- `type BusinessSortColumn` (L6) = `'name' \| 'description' \| 'isActive' \| 'createdAt'`
- `type SortDirection` (L7) = `'asc' \| 'desc'`

#### Clase `BusinessTableComponent` (L12–72)

- **Decoradores:** `@Component({ selector: 'app-business-table', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl: './bu`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `businessesInput = signal<Business[]>([])`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output edit = new EventEmitter<Business>()`, `@Output delete = new EventEmitter<Business>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addBusiness = new EventEmitter<void>()`, `sortColumn = signal<BusinessSortColumn>('createdAt')`, `sortDirection = signal<SortDirection>('desc')`, `sortedBusinesses = computed(() => { const column = this.sortColumn();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `businesses` | setter public | 23–26 | `value: Business[]` | (inferido) |
| `toggleSort` | método public | 57–64 | `column: BusinessSortColumn` | `void` |
| `sortIcon` | método public | 66–71 | `column: BusinessSortColumn` | `string` |

##### `BusinessTableComponent.businesses`

- **Firma:** `businesses(value: Business[])` — [business-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-table/business-table.component.ts#L23) (L23–26)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.businessesInput.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.businessesInput.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BusinessTableComponent.toggleSort`

- **Firma:** `toggleSort(column: BusinessSortColumn): void` — [business-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-table/business-table.component.ts#L57) (L57–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Consumidores:** `business-table.component.html` (plantilla)

##### `BusinessTableComponent.sortIcon`

- **Firma:** `sortIcon(column: BusinessSortColumn): string` — [business-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-table/business-table.component.ts#L66) (L66–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `business-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-toolbar-business-toolbar-component-ts"></a>

### business-toolbar.component.ts

- **Ruta:** [business-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-toolbar/business-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-toolbar/business-toolbar.component.ts`, 39 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-businesses`
- **Responsabilidad:** Componente Angular: declara `BusinessToolbarComponent`, `StatusFilterOption`, `StatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [businesses-page.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts), [businesses-page.component.ts (plantilla)](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts) (plantilla)
- **Plantilla:** [business-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/business-toolbar/business-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="addBusiness.emit()"`, `(click)="statusFilterChange.emit(option.value)"`

**Interfaces, tipos y enums:**

- `interface StatusFilterOption` (L8): sin documentación — miembros: `value`, `label`
- `type StatusFilterValue` (L6) = `'all' \| 'active' \| 'inactive'`

#### Clase `BusinessToolbarComponent` (L19–38)

- **Decoradores:** `@Component({ selector: 'app-business-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './business-toolbar.compone`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input statusFilter = 'all'`, `@Input canManage = true`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output statusFilterChange = new EventEmitter<StatusFilterValue>()`, `@Output addBusiness = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/businesses/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-businesses`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [businesses-page.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts), [businesses-page.component.ts (plantilla)](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/businesses/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-business-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm-modal.com`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input business = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
