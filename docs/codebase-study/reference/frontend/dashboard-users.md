# Frontend `dashboard-users`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-users-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [user-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-form-modal-user-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `UserFormModalComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [user-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-summary-user-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `UserSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [user-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-table-user-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `UserTableComponent`, `UserSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [user-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-toolbar-user-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `UserToolbarComponent`, `StatusFilterOption`, `StatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [users-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `UsersPageComponent` (sin comentario de documentación en el código). | 12 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/delete-confirm-modal/delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [user-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-form-modal/user-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `user-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [user-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-form-modal/user-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [user-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-summary/user-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `user-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [user-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-summary/user-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [user-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-table/user-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `user-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [user-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-table/user-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [user-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-toolbar/user-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `user-toolbar.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [user-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-toolbar/user-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [users-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `users-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-user-summary`, `app-user-toolbar`, `app-user-table`, `app-user-form-modal`, `app-user-delete-confirm-modal`. | — | — | Media |
| [users-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-users-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/users/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-users`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [users-page.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts), [users-page.component.ts (plantilla)](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-user-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm-modal.compone`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input user = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-form-modal-user-form-modal-component-ts"></a>

### user-form-modal.component.ts

- **Ruta:** [user-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-form-modal/user-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/users/components/user-form-modal/user-form-modal.component.ts`, 142 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-users`
- **Responsabilidad:** Componente Angular: declara `UserFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [user.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-user-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [users-page.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts), [users-page.component.ts (plantilla)](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts) (plantilla)
- **Plantilla:** [user-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-form-modal/user-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `UserFormModalComponent` (L21–141)

- **Decoradores:** `@Component({ selector: 'app-user-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './user-form-modal.c`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `userService = inject(UserService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input user = null`, `@Input roles = []`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<User>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 54–56 | — | `boolean` |
| `ngOnChanges` | método public | 58–85 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 87–127 | — | `Promise<void>` |
| `close` | método public async | 129–140 | — | `Promise<void>` |

##### `UserFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [user-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-form-modal/user-form-modal.component.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UserFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [user-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-form-modal/user-form-modal.component.ts#L58) (L58–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `passwordControl.clearValidators`, `passwordControl.setValidators`, `Validators.minLength`, `Validators.maxLength`, `this.form.reset`, `passwordControl.updateValueAndValidity`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UserFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [user-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-form-modal/user-form-modal.component.ts#L87) (L87–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.userService.updateUser`, `this.userService.createUser`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `user-form-modal.component.html` (plantilla)

##### `UserFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [user-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-form-modal/user-form-modal.component.ts#L129) (L129–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `user-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-summary-user-summary-component-ts"></a>

### user-summary.component.ts

- **Ruta:** [user-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-summary/user-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/users/components/user-summary/user-summary.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-users`
- **Responsabilidad:** Componente Angular: declara `UserSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [users-page.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts), [users-page.component.ts (plantilla)](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts) (plantilla)
- **Plantilla:** [user-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-summary/user-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface SummaryTile` (L6): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `UserSummaryComponent` (L14–59)

- **Decoradores:** `@Component({ selector: 'app-user-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './user-summary.component.html', styleU`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `users = signal<User[]>([])`, `tiles = computed<SummaryTile[]>(() => { const users = this`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `data` | setter public | 25–28 | `value: User[]` | (inferido) |

##### `UserSummaryComponent.data`

- **Firma:** `data(value: User[])` — [user-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-summary/user-summary.component.ts#L25) (L25–28)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.users.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.users.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-table-user-table-component-ts"></a>

### user-table.component.ts

- **Ruta:** [user-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-table/user-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/users/components/user-table/user-table.component.ts`, 78 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-users`
- **Responsabilidad:** Componente Angular: declara `UserTableComponent`, `UserSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [users-page.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts), [users-page.component.ts (plantilla)](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts) (plantilla)
- **Plantilla:** [user-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-table/user-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addUser.emit()"`, `(click)="toggleSort('username')"`, `(click)="toggleSort('phone')"`, `(click)="toggleSort('roleName')"`, `(click)="toggleSort('isActive')"`, `(click)="toggleSort('createdAt')"`, `(click)="edit.emit(user)"`, `(click)="delete.emit(user)"`

**Interfaces, tipos y enums:**

- `type UserSortColumn` (L7) = `'username' \| 'phone' \| 'roleName' \| 'isActive' \| 'createdAt'`
- `type SortDirection` (L8) = `'asc' \| 'desc'`

#### Clase `UserTableComponent` (L13–77)

- **Decoradores:** `@Component({ selector: 'app-user-table', standalone: true, imports: [DatePipe, BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl:`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `usersInput = signal<User[]>([])`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input currentUserId = null`, `@Output edit = new EventEmitter<User>()`, `@Output delete = new EventEmitter<User>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addUser = new EventEmitter<void>()`, `sortColumn = signal<UserSortColumn>('createdAt')`, `sortDirection = signal<SortDirection>('desc')`, `sortedUsers = computed(() => { const column = this.sortColumn();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `users` | setter public | 24–27 | `value: User[]` | (inferido) |
| `toggleSort` | método public | 58–65 | `column: UserSortColumn` | `void` |
| `sortIcon` | método public | 67–72 | `column: UserSortColumn` | `string` |
| `isSelf` | método public | 74–76 | `user: User` | `boolean` |

##### `UserTableComponent.users`

- **Firma:** `users(value: User[])` — [user-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-table/user-table.component.ts#L24) (L24–27)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.usersInput.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.usersInput.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UserTableComponent.toggleSort`

- **Firma:** `toggleSort(column: UserSortColumn): void` — [user-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-table/user-table.component.ts#L58) (L58–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Consumidores:** `user-table.component.html` (plantilla)

##### `UserTableComponent.sortIcon`

- **Firma:** `sortIcon(column: UserSortColumn): string` — [user-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-table/user-table.component.ts#L67) (L67–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `user-table.component.html` (plantilla)

##### `UserTableComponent.isSelf`

- **Firma:** `isSelf(user: User): boolean` — [user-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-table/user-table.component.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `user-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-toolbar-user-toolbar-component-ts"></a>

### user-toolbar.component.ts

- **Ruta:** [user-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-toolbar/user-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/users/components/user-toolbar/user-toolbar.component.ts`, 41 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-users`
- **Responsabilidad:** Componente Angular: declara `UserToolbarComponent`, `StatusFilterOption`, `StatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [users-page.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts), [users-page.component.ts (plantilla)](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts) (plantilla)
- **Plantilla:** [user-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/users/components/user-toolbar/user-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(ngModelChange)="roleFilterChange.emit($event)"`, `(click)="addUser.emit()"`, `(click)="statusFilterChange.emit(option.value)"`

**Interfaces, tipos y enums:**

- `interface StatusFilterOption` (L9): sin documentación — miembros: `value`, `label`
- `type StatusFilterValue` (L7) = `'all' \| 'active' \| 'inactive'`

#### Clase `UserToolbarComponent` (L20–40)

- **Decoradores:** `@Component({ selector: 'app-user-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './user-toolbar.component.html'`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input statusFilter = 'all'`, `@Input roleFilter = 'all'`, `@Input roles = []`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output statusFilterChange = new EventEmitter<StatusFilterValue>()`, `@Output roleFilterChange = new EventEmitter<string>()`, `@Output addUser = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts"></a>

### users-page.component.ts

- **Ruta:** [users-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts`, 178 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-users`
- **Responsabilidad:** Componente Angular: declara `UsersPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [role.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-role-service-ts), [user.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-user-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [user-summary.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-summary-user-summary-component-ts), [user-toolbar.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-toolbar-user-toolbar-component-ts), [user-table.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-table-user-table-component-ts), [user-form-modal.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-form-modal-user-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [users-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [user-summary.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-summary-user-summary-component-ts), [user-toolbar.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-toolbar-user-toolbar-component-ts), [user-table.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-table-user-table-component-ts), [user-form-modal.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-form-modal-user-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="searchTerm.set($event)"`, `(statusFilterChange)="statusFilter.set($event)"`, `(roleFilterChange)="roleFilter.set($event)"`, `(addUser)="openCreateForm()"`, `(edit)="openEditForm($event)"`, `(delete)="requestDelete($event)"`, `(clearFilters)="clearFilters()"`, `(closed)="closeForm()"`, `(saved)="onUserSaved($event)"`, `(confirmed)="confirmDelete()"`, `(cancelled)="cancelDelete()"`

#### Clase `UsersPageComponent` (L17–177)

- **Decoradores:** `@Component({ selector: 'app-users-page', standalone: true, imports: [ PageHeaderComponent, UserSummaryComponent, UserToolbarComponent, UserTableComponent, UserFo`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `userService = inject(UserService)`, `roleService = inject(RoleService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `currentUserId = computed(() => this.authService.currentUser()?.id `, `users = signal<User[]>([])`, `roles = signal<Role[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<StatusFilterValue>('all')`, `roleFilter = signal<string>('all')`, `isFormOpen = signal(false)`, `editingUser = signal<User \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingUser = signal<User \| null>(null)`, `isDeleting = signal(false)`, `filteredUsers = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed( () => this.searchTerm().trim().length > `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchUsers` | método private | 90–103 | — | `void` |
| `fetchRoles` | método private | 105–113 | — | `void` |
| `openCreateForm` | método public | 115–118 | — | `void` |
| `openEditForm` | método public | 120–123 | `user: User` | `void` |
| `closeForm` | método public | 125–127 | — | `void` |
| `onUserSaved` | método public | 129–138 | `user: User` | `void` |
| `requestDelete` | método public | 140–143 | `user: User` | `void` |
| `cancelDelete` | método public | 145–148 | — | `void` |
| `confirmDelete` | método public | 150–170 | — | `void` |
| `clearFilters` | método public | 172–176 | — | `void` |

##### `UsersPageComponent.fetchUsers`

- **Firma:** `fetchUsers(): void` — [users-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts#L90) (L90–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.userService.getUsers(true).subscribe`, `this.userService.getUsers`, `this.users.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.users.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UsersPageComponent.fetchRoles`

- **Firma:** `fetchRoles(): void` — [users-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts#L105) (L105–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.roleService.getRoles().subscribe`, `this.roleService.getRoles`, `this.roles.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.roles.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UsersPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [users-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts#L115) (L115–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingUser.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingUser.set`, `this.isFormOpen.set`
- **Consumidores:** `users-page.component.html` (plantilla)

##### `UsersPageComponent.openEditForm`

- **Firma:** `openEditForm(user: User): void` — [users-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts#L120) (L120–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingUser.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingUser.set`, `this.isFormOpen.set`
- **Consumidores:** `users-page.component.html` (plantilla)

##### `UsersPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [users-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts#L125) (L125–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `users-page.component.html` (plantilla)

##### `UsersPageComponent.onUserSaved`

- **Firma:** `onUserSaved(user: User): void` — [users-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts#L129) (L129–138)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingUser`, `this.isFormOpen.set`, `this.users.update`, `list.map`, `this.notificationService.success`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.users.update`
- **Consumidores:** `users-page.component.html` (plantilla)

##### `UsersPageComponent.requestDelete`

- **Firma:** `requestDelete(user: User): void` — [users-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts#L140) (L140–143)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingUser.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingUser.set`, `this.isDeleteOpen.set`
- **Consumidores:** `users-page.component.html` (plantilla)

##### `UsersPageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [users-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts#L145) (L145–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingUser.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingUser.set`
- **Consumidores:** `users-page.component.html` (plantilla)

##### `UsersPageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [users-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts#L150) (L150–170)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingUser`, `this.isDeleting.set`, `this.userService.deleteUser(user.id).subscribe`, `this.userService.deleteUser`, `this.isDeleteOpen.set`, `this.deletingUser.set`, `this.users.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingUser.set`, `this.users.update`
- **Consumidores:** `users-page.component.html` (plantilla)

##### `UsersPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [users-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts#L172) (L172–176)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`, `this.roleFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`, `this.roleFilter.set`
- **Consumidores:** `users-page.component.html` (plantilla)

