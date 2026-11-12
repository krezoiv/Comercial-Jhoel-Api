# Frontend `dashboard-roles`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [role-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-form-modal-role-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `RoleFormModalComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [role-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-summary-role-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `RoleSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [role-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-table-role-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `RoleTableComponent`, `RoleSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [role-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-toolbar-role-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `RoleToolbarComponent`, `StatusFilterOption`, `StatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [roles-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `RolesPageComponent` (sin comentario de documentación en el código). | 10 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/delete-confirm-modal/delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [role-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-form-modal/role-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `role-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [role-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-form-modal/role-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [role-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-summary/role-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `role-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [role-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-summary/role-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [role-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-table/role-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `role-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [role-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-table/role-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [role-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-toolbar/role-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `role-toolbar.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [role-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-toolbar/role-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [roles-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `roles-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-role-summary`, `app-role-toolbar`, `app-role-table`, `app-role-form-modal`, `app-role-delete-confirm-modal`. | — | — | Media |
| [roles-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-roles-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/roles/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-roles`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [roles-page.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts), [roles-page.component.ts (plantilla)](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-role-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm-modal.compone`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input role = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-form-modal-role-form-modal-component-ts"></a>

### role-form-modal.component.ts

- **Ruta:** [role-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-form-modal/role-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/roles/components/role-form-modal/role-form-modal.component.ts`, 148 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-roles`
- **Responsabilidad:** Componente Angular: declara `RoleFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [role.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-role-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [roles-page.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts), [roles-page.component.ts (plantilla)](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts) (plantilla)
- **Plantilla:** [role-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-form-modal/role-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `RoleFormModalComponent` (L21–147)

- **Decoradores:** `@Component({ selector: 'app-role-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './role-form-modal.c`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `roleService = inject(RoleService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input role = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<Role>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 50–52 | — | `boolean` |
| `isSystemRole` | getter public | 55–57 | — | `boolean` |
| `canDeactivate` | getter public | 60–62 | — | `boolean` |
| `ngOnChanges` | método public | 64–95 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 97–133 | — | `Promise<void>` |
| `close` | método public async | 135–146 | — | `Promise<void>` |

##### `RoleFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [role-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-form-modal/role-form-modal.component.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RoleFormModalComponent.isSystemRole`

- **Firma:** `isSystemRole(): boolean` — [role-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-form-modal/role-form-modal.component.ts#L55) (L55–57)
- **Propósito / descripción:** SUPER_ADMIN/ADMIN/USER — the backend rejects renaming these, so the field is locked here too.
- **Dependencias (llamadas en su cuerpo):** `SYSTEM_ROLE_NAMES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RoleFormModalComponent.canDeactivate`

- **Firma:** `canDeactivate(): boolean` — [role-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-form-modal/role-form-modal.component.ts#L60) (L60–62)
- **Propósito / descripción:** Turning off a role with active users fails on the backend — block it here with an explanation instead.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RoleFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [role-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-form-modal/role-form-modal.component.ts#L64) (L64–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`, `this.form.controls.name.disable`, `this.form.controls.name.enable`, `this.form.controls.isActive.enable`, `this.form.controls.isActive.disable`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RoleFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [role-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-form-modal/role-form-modal.component.ts#L97) (L97–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.roleService.updateRole`, `this.roleService.createRole`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `role-form-modal.component.html` (plantilla)

##### `RoleFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [role-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-form-modal/role-form-modal.component.ts#L135) (L135–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `role-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-summary-role-summary-component-ts"></a>

### role-summary.component.ts

- **Ruta:** [role-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-summary/role-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/roles/components/role-summary/role-summary.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-roles`
- **Responsabilidad:** Componente Angular: declara `RoleSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [roles-page.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts), [roles-page.component.ts (plantilla)](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts) (plantilla)
- **Plantilla:** [role-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-summary/role-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface SummaryTile` (L6): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `RoleSummaryComponent` (L14–59)

- **Decoradores:** `@Component({ selector: 'app-role-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './role-summary.component.html', styleU`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `roles = signal<Role[]>([])`, `tiles = computed<SummaryTile[]>(() => { const roles = this`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `data` | setter public | 25–28 | `value: Role[]` | (inferido) |

##### `RoleSummaryComponent.data`

- **Firma:** `data(value: Role[])` — [role-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-summary/role-summary.component.ts#L25) (L25–28)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.roles.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.roles.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-table-role-table-component-ts"></a>

### role-table.component.ts

- **Ruta:** [role-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-table/role-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/roles/components/role-table/role-table.component.ts`, 85 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-roles`
- **Responsabilidad:** Componente Angular: declara `RoleTableComponent`, `RoleSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [roles-page.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts), [roles-page.component.ts (plantilla)](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts) (plantilla)
- **Plantilla:** [role-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-table/role-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addRole.emit()"`, `(click)="toggleSort('name')"`, `(click)="toggleSort('description')"`, `(click)="toggleSort('isActive')"`, `(click)="toggleSort('usersCount')"`, `(click)="edit.emit(role)"`, `(click)="delete.emit(role)"`

**Interfaces, tipos y enums:**

- `type RoleSortColumn` (L6) = `'name' \| 'description' \| 'isActive' \| 'usersCount' \| 'createdAt'`
- `type SortDirection` (L7) = `'asc' \| 'desc'`

#### Clase `RoleTableComponent` (L12–84)

- **Decoradores:** `@Component({ selector: 'app-role-table', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl: './role-t`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `rolesInput = signal<Role[]>([])`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Output edit = new EventEmitter<Role>()`, `@Output delete = new EventEmitter<Role>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addRole = new EventEmitter<void>()`, `sortColumn = signal<RoleSortColumn>('createdAt')`, `sortDirection = signal<SortDirection>('desc')`, `sortedRoles = computed(() => { const column = this.sortColumn();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `roles` | setter public | 23–26 | `value: Role[]` | (inferido) |
| `toggleSort` | método public | 58–65 | `column: RoleSortColumn` | `void` |
| `sortIcon` | método public | 67–72 | `column: RoleSortColumn` | `string` |
| `deleteDisabledReason` | método public | 75–83 | `role: Role` | `string` |

##### `RoleTableComponent.roles`

- **Firma:** `roles(value: Role[])` — [role-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-table/role-table.component.ts#L23) (L23–26)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.rolesInput.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.rolesInput.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RoleTableComponent.toggleSort`

- **Firma:** `toggleSort(column: RoleSortColumn): void` — [role-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-table/role-table.component.ts#L58) (L58–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Consumidores:** `role-table.component.html` (plantilla)

##### `RoleTableComponent.sortIcon`

- **Firma:** `sortIcon(column: RoleSortColumn): string` — [role-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-table/role-table.component.ts#L67) (L67–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `role-table.component.html` (plantilla)

##### `RoleTableComponent.deleteDisabledReason`

- **Firma:** `deleteDisabledReason(role: Role): string` — [role-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-table/role-table.component.ts#L75) (L75–83)
- **Propósito / descripción:** Mirrors the backend's guard: a role with active users, or already inactive, can't be deactivated.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `role-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-toolbar-role-toolbar-component-ts"></a>

### role-toolbar.component.ts

- **Ruta:** [role-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-toolbar/role-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/roles/components/role-toolbar/role-toolbar.component.ts`, 37 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-roles`
- **Responsabilidad:** Componente Angular: declara `RoleToolbarComponent`, `StatusFilterOption`, `StatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [roles-page.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts), [roles-page.component.ts (plantilla)](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts) (plantilla)
- **Plantilla:** [role-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/components/role-toolbar/role-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="addRole.emit()"`, `(click)="statusFilterChange.emit(option.value)"`

**Interfaces, tipos y enums:**

- `interface StatusFilterOption` (L8): sin documentación — miembros: `value`, `label`
- `type StatusFilterValue` (L6) = `'all' \| 'active' \| 'inactive'`

#### Clase `RoleToolbarComponent` (L19–36)

- **Decoradores:** `@Component({ selector: 'app-role-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './role-toolbar.component.html'`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input statusFilter = 'all'`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output statusFilterChange = new EventEmitter<StatusFilterValue>()`, `@Output addRole = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts"></a>

### roles-page.component.ts

- **Ruta:** [roles-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts`, 147 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-roles`
- **Responsabilidad:** Componente Angular: declara `RolesPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [role.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-role-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [role-summary.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-summary-role-summary-component-ts), [role-toolbar.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-toolbar-role-toolbar-component-ts), [role-table.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-table-role-table-component-ts), [role-form-modal.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-form-modal-role-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [roles-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [role-summary.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-summary-role-summary-component-ts), [role-toolbar.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-toolbar-role-toolbar-component-ts), [role-table.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-table-role-table-component-ts), [role-form-modal.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-form-modal-role-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="searchTerm.set($event)"`, `(statusFilterChange)="statusFilter.set($event)"`, `(addRole)="openCreateForm()"`, `(edit)="openEditForm($event)"`, `(delete)="requestDelete($event)"`, `(clearFilters)="clearFilters()"`, `(closed)="closeForm()"`, `(saved)="onRoleSaved($event)"`, `(confirmed)="confirmDelete()"`, `(cancelled)="cancelDelete()"`

#### Clase `RolesPageComponent` (L15–146)

- **Decoradores:** `@Component({ selector: 'app-roles-page', standalone: true, imports: [ PageHeaderComponent, RoleSummaryComponent, RoleToolbarComponent, RoleTableComponent, RoleFo`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `roleService = inject(RoleService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `roles = signal<Role[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<StatusFilterValue>('all')`, `isFormOpen = signal(false)`, `editingRole = signal<Role \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingRole = signal<Role \| null>(null)`, `isDeleting = signal(false)`, `filteredRoles = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed(() => this.searchTerm().trim().length > 0`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchRoles` | método private | 70–83 | — | `void` |
| `openCreateForm` | método public | 85–88 | — | `void` |
| `openEditForm` | método public | 90–93 | `role: Role` | `void` |
| `closeForm` | método public | 95–97 | — | `void` |
| `onRoleSaved` | método public | 99–108 | `role: Role` | `void` |
| `requestDelete` | método public | 110–113 | `role: Role` | `void` |
| `cancelDelete` | método public | 115–118 | — | `void` |
| `confirmDelete` | método public | 120–140 | — | `void` |
| `clearFilters` | método public | 142–145 | — | `void` |

##### `RolesPageComponent.fetchRoles`

- **Firma:** `fetchRoles(): void` — [roles-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts#L70) (L70–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.roleService.getRoles(true).subscribe`, `this.roleService.getRoles`, `this.roles.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.roles.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RolesPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [roles-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts#L85) (L85–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingRole.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingRole.set`, `this.isFormOpen.set`
- **Consumidores:** `roles-page.component.html` (plantilla)

##### `RolesPageComponent.openEditForm`

- **Firma:** `openEditForm(role: Role): void` — [roles-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts#L90) (L90–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingRole.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingRole.set`, `this.isFormOpen.set`
- **Consumidores:** `roles-page.component.html` (plantilla)

##### `RolesPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [roles-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `roles-page.component.html` (plantilla)

##### `RolesPageComponent.onRoleSaved`

- **Firma:** `onRoleSaved(role: Role): void` — [roles-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts#L99) (L99–108)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingRole`, `this.isFormOpen.set`, `this.roles.update`, `list.map`, `this.notificationService.success`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.roles.update`
- **Consumidores:** `roles-page.component.html` (plantilla)

##### `RolesPageComponent.requestDelete`

- **Firma:** `requestDelete(role: Role): void` — [roles-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts#L110) (L110–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingRole.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingRole.set`, `this.isDeleteOpen.set`
- **Consumidores:** `roles-page.component.html` (plantilla)

##### `RolesPageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [roles-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts#L115) (L115–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingRole.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingRole.set`
- **Consumidores:** `roles-page.component.html` (plantilla)

##### `RolesPageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [roles-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts#L120) (L120–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingRole`, `this.isDeleting.set`, `this.roleService.deleteRole(role.id).subscribe`, `this.roleService.deleteRole`, `this.isDeleteOpen.set`, `this.deletingRole.set`, `this.roles.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingRole.set`, `this.roles.update`
- **Consumidores:** `roles-page.component.html` (plantilla)

##### `RolesPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [roles-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts#L142) (L142–145)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `roles-page.component.html` (plantilla)

