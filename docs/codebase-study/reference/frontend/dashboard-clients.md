# Frontend `dashboard-clients`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [clients-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `ClientsPageComponent` (sin comentario de documentación en el código). | 11 internas; ext.: @angular/common, @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [client-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-form-modal-client-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Rejects a whitespace-only name — `Validators.required` alone treats " " as a non-empty value. | 5 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [client-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-summary-client-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `ClientSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [client-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-table-client-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `ClientTableComponent`, `ClientSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [client-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-toolbar-client-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `ClientToolbarComponent`, `StatusFilterOption`, `ClientStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [clients-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `clients-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-client-summary`, `app-client-toolbar`, `app-client-table`, `app-client-form-modal`, `app-client-delete-confirm-modal`. | — | — | Media |
| [clients-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [client-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `client-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [client-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [client-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-summary/client-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `client-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [client-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-summary/client-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [client-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-table/client-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `client-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [client-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-table/client-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [client-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-toolbar/client-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `client-toolbar.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [client-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-toolbar/client-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/delete-confirm-modal/delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts"></a>

### clients-page.component.ts

- **Ruta:** [clients-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts`, 187 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-clients`
- **Responsabilidad:** Componente Angular: declara `ClientsPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [client.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-client-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [client-summary.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-summary-client-summary-component-ts), [client-toolbar.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-toolbar-client-toolbar-component-ts), [client-table.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-table-client-table-component-ts), [client-form-modal.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-form-modal-client-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [clients-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [client-summary.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-summary-client-summary-component-ts), [client-toolbar.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-toolbar-client-toolbar-component-ts), [client-table.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-table-client-table-component-ts), [client-form-modal.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-form-modal-client-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="onSearchTermChange($event)"`, `(statusFilterChange)="statusFilter.set($event)"`, `(addClient)="openCreateForm()"`, `(edit)="openEditForm($event)"`, `(delete)="requestDelete($event)"`, `(clearFilters)="clearFilters()"`, `(closed)="closeForm()"`, `(saved)="onClientSaved($event)"`, `(confirmed)="confirmDelete()"`, `(cancelled)="cancelDelete()"`

#### Clase `ClientsPageComponent` (L18–186)

- **Decoradores:** `@Component({ selector: 'app-clients-page', standalone: true, imports: [ PageHeaderComponent, ClientSummaryComponent, ClientToolbarComponent, ClientTableComponent`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `clientService = inject(ClientService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `clients = signal<Client[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<ClientStatusFilterValue>('all')`, `searchResults = signal<Client[] \| null>(null)`, `isFormOpen = signal(false)`, `editingClient = signal<Client \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingClient = signal<Client \| null>(null)`, `isDeleting = signal(false)`, `filteredClients = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed( () => this.searchTerm().trim().length > `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchClients` | método private | 97–110 | — | `void` |
| `onSearchTermChange` | método public | 112–118 | `value: string` | `void` |
| `openCreateForm` | método public | 120–123 | — | `void` |
| `openEditForm` | método public | 125–128 | `client: Client` | `void` |
| `closeForm` | método public | 130–132 | — | `void` |
| `onClientSaved` | método public | 134–145 | `client: Client` | `void` |
| `requestDelete` | método public | 147–150 | `client: Client` | `void` |
| `cancelDelete` | método public | 152–155 | — | `void` |
| `confirmDelete` | método public | 157–179 | — | `void` |
| `clearFilters` | método public | 181–185 | — | `void` |

##### `ClientsPageComponent.fetchClients`

- **Firma:** `fetchClients(): void` — [clients-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts#L97) (L97–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.clientService.getClients(true).subscribe`, `this.clientService.getClients`, `this.clients.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.clients.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ClientsPageComponent.onSearchTermChange`

- **Firma:** `onSearchTermChange(value: string): void` — [clients-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts#L112) (L112–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `value.trim`, `this.searchResults.set`, `this.searchTerm$.next`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.searchResults.set`
- **Consumidores:** `clients-page.component.html` (plantilla)

##### `ClientsPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [clients-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts#L120) (L120–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingClient.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingClient.set`, `this.isFormOpen.set`
- **Consumidores:** `clients-page.component.html` (plantilla)

##### `ClientsPageComponent.openEditForm`

- **Firma:** `openEditForm(client: Client): void` — [clients-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts#L125) (L125–128)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingClient.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingClient.set`, `this.isFormOpen.set`
- **Consumidores:** `clients-page.component.html` (plantilla)

##### `ClientsPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [clients-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts#L130) (L130–132)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `clients-page.component.html` (plantilla)

##### `ClientsPageComponent.onClientSaved`

- **Firma:** `onClientSaved(client: Client): void` — [clients-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts#L134) (L134–145)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingClient`, `this.isFormOpen.set`, `this.clients.update`, `list.map`, `this.notificationService.success`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.clients.update`
- **Consumidores:** `clients-page.component.html` (plantilla)

##### `ClientsPageComponent.requestDelete`

- **Firma:** `requestDelete(client: Client): void` — [clients-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts#L147) (L147–150)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingClient.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingClient.set`, `this.isDeleteOpen.set`
- **Consumidores:** `clients-page.component.html` (plantilla)

##### `ClientsPageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [clients-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts#L152) (L152–155)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingClient.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingClient.set`
- **Consumidores:** `clients-page.component.html` (plantilla)

##### `ClientsPageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [clients-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts#L157) (L157–179)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingClient`, `this.isDeleting.set`, `this.clientService.deleteClient(client.id).subscribe`, `this.clientService.deleteClient`, `this.isDeleteOpen.set`, `this.deletingClient.set`, `this.clients.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingClient.set`, `this.clients.update`
- **Consumidores:** `clients-page.component.html` (plantilla)

##### `ClientsPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [clients-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts#L181) (L181–185)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`, `this.searchResults.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`, `this.searchResults.set`
- **Consumidores:** `clients-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-form-modal-client-form-modal-component-ts"></a>

### client-form-modal.component.ts

- **Ruta:** [client-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.ts`, 135 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-clients`
- **Responsabilidad:** Rejects a whitespace-only name — `Validators.required` alone treats " " as a non-empty value.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [client.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-client-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [clients-page.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts), [clients-page.component.ts (plantilla)](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts) (plantilla)
- **Plantilla:** [client-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `ClientFormModalComponent` (L27–134)

- **Decoradores:** `@Component({ selector: 'app-client-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './client-form-mod`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `clientService = inject(ClientService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input client = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<Client>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 54–56 | — | `boolean` |
| `nameErrorMessage` | método public | 58–73 | — | `string` |
| `ngOnChanges` | método public | 75–84 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 86–120 | — | `Promise<void>` |
| `close` | método public async | 122–133 | — | `Promise<void>` |

##### `ClientFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [client-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ClientFormModalComponent.nameErrorMessage`

- **Firma:** `nameErrorMessage(): string` — [client-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.ts#L58) (L58–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `client-form-modal.component.html` (plantilla)

##### `ClientFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [client-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.ts#L75) (L75–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ClientFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [client-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.ts#L86) (L86–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue().name.trim().replace`, `this.form.getRawValue().name.trim`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.clientService.updateClient`, `this.clientService.createClient`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `client-form-modal.component.html` (plantilla)

##### `ClientFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [client-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.ts#L122) (L122–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `client-form-modal.component.html` (plantilla)

#### Función `notBlank` (L22–25)

- **Tipo:** función local del archivo
- **Firma:** `notBlank(control: AbstractControl): ValidationErrors \| null` — [client-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.ts#L22)
- **Propósito / descripción:** Rejects a whitespace-only name — `Validators.required` alone treats " " as a non-empty value.
- **Dependencias:** `control.value.trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-summary-client-summary-component-ts"></a>

### client-summary.component.ts

- **Ruta:** [client-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-summary/client-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/clients/components/client-summary/client-summary.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-clients`
- **Responsabilidad:** Componente Angular: declara `ClientSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [clients-page.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts), [clients-page.component.ts (plantilla)](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts) (plantilla)
- **Plantilla:** [client-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-summary/client-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface SummaryTile` (L6): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `ClientSummaryComponent` (L14–59)

- **Decoradores:** `@Component({ selector: 'app-client-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './client-summary.component.html', st`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `clients = signal<Client[]>([])`, `tiles = computed<SummaryTile[]>(() => { const clients = th`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `data` | setter public | 25–28 | `value: Client[]` | (inferido) |

##### `ClientSummaryComponent.data`

- **Firma:** `data(value: Client[])` — [client-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-summary/client-summary.component.ts#L25) (L25–28)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clients.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.clients.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-table-client-table-component-ts"></a>

### client-table.component.ts

- **Ruta:** [client-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-table/client-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/clients/components/client-table/client-table.component.ts`, 73 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-clients`
- **Responsabilidad:** Componente Angular: declara `ClientTableComponent`, `ClientSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [clients-page.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts), [clients-page.component.ts (plantilla)](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts) (plantilla)
- **Plantilla:** [client-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-table/client-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addClient.emit()"`, `(click)="toggleSort('name')"`, `(click)="toggleSort('isActive')"`, `(click)="edit.emit(client)"`, `(click)="delete.emit(client)"`

**Interfaces, tipos y enums:**

- `type ClientSortColumn` (L6) = `'name' \| 'isActive' \| 'createdAt'`
- `type SortDirection` (L7) = `'asc' \| 'desc'`

#### Clase `ClientTableComponent` (L12–72)

- **Decoradores:** `@Component({ selector: 'app-client-table', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl: './clie`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `clientsInput = signal<Client[]>([])`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output edit = new EventEmitter<Client>()`, `@Output delete = new EventEmitter<Client>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addClient = new EventEmitter<void>()`, `sortColumn = signal<ClientSortColumn>('createdAt')`, `sortDirection = signal<SortDirection>('desc')`, `sortedClients = computed(() => { const column = this.sortColumn();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `clients` | setter public | 23–26 | `value: Client[]` | (inferido) |
| `toggleSort` | método public | 57–64 | `column: ClientSortColumn` | `void` |
| `sortIcon` | método public | 66–71 | `column: ClientSortColumn` | `string` |

##### `ClientTableComponent.clients`

- **Firma:** `clients(value: Client[])` — [client-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-table/client-table.component.ts#L23) (L23–26)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientsInput.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.clientsInput.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ClientTableComponent.toggleSort`

- **Firma:** `toggleSort(column: ClientSortColumn): void` — [client-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-table/client-table.component.ts#L57) (L57–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Consumidores:** `client-table.component.html` (plantilla)

##### `ClientTableComponent.sortIcon`

- **Firma:** `sortIcon(column: ClientSortColumn): string` — [client-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-table/client-table.component.ts#L66) (L66–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `client-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-toolbar-client-toolbar-component-ts"></a>

### client-toolbar.component.ts

- **Ruta:** [client-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-toolbar/client-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/clients/components/client-toolbar/client-toolbar.component.ts`, 39 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-clients`
- **Responsabilidad:** Componente Angular: declara `ClientToolbarComponent`, `StatusFilterOption`, `ClientStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [clients-page.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts), [clients-page.component.ts (plantilla)](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts) (plantilla)
- **Plantilla:** [client-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-toolbar/client-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="addClient.emit()"`, `(click)="statusFilterChange.emit(option.value)"`

**Interfaces, tipos y enums:**

- `interface StatusFilterOption` (L8): sin documentación — miembros: `value`, `label`
- `type ClientStatusFilterValue` (L6) = `'all' \| 'active' \| 'inactive'`

#### Clase `ClientToolbarComponent` (L19–38)

- **Decoradores:** `@Component({ selector: 'app-client-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './client-toolbar.component.h`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input statusFilter = 'all'`, `@Input canManage = true`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output statusFilterChange = new EventEmitter<ClientStatusFilterValue>()`, `@Output addClient = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-clients-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/clients/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-clients`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [clients-page.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts), [clients-page.component.ts (plantilla)](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-client-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm-modal.compo`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input client = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
