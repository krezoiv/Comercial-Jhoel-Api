# Frontend `dashboard-categories`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [categories-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CategoriesPageComponent` (sin comentario de documentación en el código). | 11 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [category-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-form-modal-category-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CategoryFormModalComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [category-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-summary-category-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CategorySummaryComponent`, `SummaryTile` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [category-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-table-category-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CategoryTableComponent`, `CategorySortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [category-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-toolbar-category-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CategoryToolbarComponent`, `StatusFilterOption`, `StatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [categories-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `categories-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-category-summary`, `app-category-toolbar`, `app-category-table`, `app-category-form-modal`, `app-category-delete-confirm-modal`. | — | — | Media |
| [categories-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [category-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-form-modal/category-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `category-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [category-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-form-modal/category-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [category-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-summary/category-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `category-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [category-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-summary/category-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [category-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-table/category-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `category-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [category-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-table/category-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [category-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-toolbar/category-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `category-toolbar.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [category-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-toolbar/category-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/delete-confirm-modal/delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts"></a>

### categories-page.component.ts

- **Ruta:** [categories-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts`, 162 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-categories`
- **Responsabilidad:** Componente Angular: declara `CategoriesPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [category.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-category-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [category-summary.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-summary-category-summary-component-ts), [category-toolbar.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-toolbar-category-toolbar-component-ts), [category-table.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-table-category-table-component-ts), [category-form-modal.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-form-modal-category-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [categories-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [category-summary.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-summary-category-summary-component-ts), [category-toolbar.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-toolbar-category-toolbar-component-ts), [category-table.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-table-category-table-component-ts), [category-form-modal.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-form-modal-category-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="searchTerm.set($event)"`, `(statusFilterChange)="statusFilter.set($event)"`, `(addCategory)="openCreateForm()"`, `(edit)="openEditForm($event)"`, `(delete)="requestDelete($event)"`, `(clearFilters)="clearFilters()"`, `(closed)="closeForm()"`, `(saved)="onCategorySaved($event)"`, `(confirmed)="confirmDelete()"`, `(cancelled)="cancelDelete()"`

#### Clase `CategoriesPageComponent` (L16–161)

- **Decoradores:** `@Component({ selector: 'app-categories-page', standalone: true, imports: [ PageHeaderComponent, CategorySummaryComponent, CategoryToolbarComponent, CategoryTable`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `categoryService = inject(CategoryService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `categories = signal<Category[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<StatusFilterValue>('all')`, `isFormOpen = signal(false)`, `editingCategory = signal<Category \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingCategory = signal<Category \| null>(null)`, `isDeleting = signal(false)`, `filteredCategories = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed(() => this.searchTerm().trim().length > 0`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchCategories` | método private | 80–94 | — | `void` |
| `openCreateForm` | método public | 96–99 | — | `void` |
| `openEditForm` | método public | 101–104 | `category: Category` | `void` |
| `closeForm` | método public | 106–108 | — | `void` |
| `onCategorySaved` | método public | 110–121 | `category: Category` | `void` |
| `requestDelete` | método public | 123–126 | `category: Category` | `void` |
| `cancelDelete` | método public | 128–131 | — | `void` |
| `confirmDelete` | método public | 133–155 | — | `void` |
| `clearFilters` | método public | 157–160 | — | `void` |

##### `CategoriesPageComponent.fetchCategories`

- **Firma:** `fetchCategories(): void` — [categories-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts#L80) (L80–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.categoryService.getCategories(true).subscribe`, `this.categoryService.getCategories`, `this.categories.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.categories.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CategoriesPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [categories-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts#L96) (L96–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingCategory.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingCategory.set`, `this.isFormOpen.set`
- **Consumidores:** `categories-page.component.html` (plantilla)

##### `CategoriesPageComponent.openEditForm`

- **Firma:** `openEditForm(category: Category): void` — [categories-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts#L101) (L101–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingCategory.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingCategory.set`, `this.isFormOpen.set`
- **Consumidores:** `categories-page.component.html` (plantilla)

##### `CategoriesPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [categories-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts#L106) (L106–108)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `categories-page.component.html` (plantilla)

##### `CategoriesPageComponent.onCategorySaved`

- **Firma:** `onCategorySaved(category: Category): void` — [categories-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts#L110) (L110–121)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingCategory`, `this.isFormOpen.set`, `this.categories.update`, `list.map`, `this.notificationService.success`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.categories.update`
- **Consumidores:** `categories-page.component.html` (plantilla)

##### `CategoriesPageComponent.requestDelete`

- **Firma:** `requestDelete(category: Category): void` — [categories-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts#L123) (L123–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingCategory.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingCategory.set`, `this.isDeleteOpen.set`
- **Consumidores:** `categories-page.component.html` (plantilla)

##### `CategoriesPageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [categories-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts#L128) (L128–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingCategory.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingCategory.set`
- **Consumidores:** `categories-page.component.html` (plantilla)

##### `CategoriesPageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [categories-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts#L133) (L133–155)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingCategory`, `this.isDeleting.set`, `this.categoryService.deleteCategory(category.id).subscribe`, `this.categoryService.deleteCategory`, `this.isDeleteOpen.set`, `this.deletingCategory.set`, `this.categories.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingCategory.set`, `this.categories.update`
- **Consumidores:** `categories-page.component.html` (plantilla)

##### `CategoriesPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [categories-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts#L157) (L157–160)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `categories-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-form-modal-category-form-modal-component-ts"></a>

### category-form-modal.component.ts

- **Ruta:** [category-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-form-modal/category-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/categories/components/category-form-modal/category-form-modal.component.ts`, 116 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-categories`
- **Responsabilidad:** Componente Angular: declara `CategoryFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [category.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-category-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [categories-page.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts), [categories-page.component.ts (plantilla)](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts) (plantilla)
- **Plantilla:** [category-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-form-modal/category-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `CategoryFormModalComponent` (L21–115)

- **Decoradores:** `@Component({ selector: 'app-category-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './category-form`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `categoryService = inject(CategoryService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input category = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<Category>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 49–51 | — | `boolean` |
| `ngOnChanges` | método public | 53–66 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 68–101 | — | `Promise<void>` |
| `close` | método public async | 103–114 | — | `Promise<void>` |

##### `CategoryFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [category-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-form-modal/category-form-modal.component.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CategoryFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [category-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-form-modal/category-form-modal.component.ts#L53) (L53–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CategoryFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [category-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-form-modal/category-form-modal.component.ts#L68) (L68–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.categoryService.updateCategory`, `this.categoryService.createCategory`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `category-form-modal.component.html` (plantilla)

##### `CategoryFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [category-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-form-modal/category-form-modal.component.ts#L103) (L103–114)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `category-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-summary-category-summary-component-ts"></a>

### category-summary.component.ts

- **Ruta:** [category-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-summary/category-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/categories/components/category-summary/category-summary.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-categories`
- **Responsabilidad:** Componente Angular: declara `CategorySummaryComponent`, `SummaryTile` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [categories-page.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts), [categories-page.component.ts (plantilla)](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts) (plantilla)
- **Plantilla:** [category-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-summary/category-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface SummaryTile` (L6): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `CategorySummaryComponent` (L14–59)

- **Decoradores:** `@Component({ selector: 'app-category-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './category-summary.component.html'`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `categories = signal<Category[]>([])`, `tiles = computed<SummaryTile[]>(() => { const categories =`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `data` | setter public | 25–28 | `value: Category[]` | (inferido) |

##### `CategorySummaryComponent.data`

- **Firma:** `data(value: Category[])` — [category-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-summary/category-summary.component.ts#L25) (L25–28)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.categories.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.categories.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-table-category-table-component-ts"></a>

### category-table.component.ts

- **Ruta:** [category-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-table/category-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/categories/components/category-table/category-table.component.ts`, 73 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-categories`
- **Responsabilidad:** Componente Angular: declara `CategoryTableComponent`, `CategorySortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [categories-page.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts), [categories-page.component.ts (plantilla)](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts) (plantilla)
- **Plantilla:** [category-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-table/category-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addCategory.emit()"`, `(click)="toggleSort('name')"`, `(click)="toggleSort('description')"`, `(click)="toggleSort('isActive')"`, `(click)="edit.emit(category)"`, `(click)="delete.emit(category)"`

**Interfaces, tipos y enums:**

- `type CategorySortColumn` (L6) = `'name' \| 'description' \| 'isActive' \| 'createdAt'`
- `type SortDirection` (L7) = `'asc' \| 'desc'`

#### Clase `CategoryTableComponent` (L12–72)

- **Decoradores:** `@Component({ selector: 'app-category-table', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl: './ca`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `categoriesInput = signal<Category[]>([])`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output edit = new EventEmitter<Category>()`, `@Output delete = new EventEmitter<Category>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addCategory = new EventEmitter<void>()`, `sortColumn = signal<CategorySortColumn>('createdAt')`, `sortDirection = signal<SortDirection>('desc')`, `sortedCategories = computed(() => { const column = this.sortColumn();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `categories` | setter public | 23–26 | `value: Category[]` | (inferido) |
| `toggleSort` | método public | 57–64 | `column: CategorySortColumn` | `void` |
| `sortIcon` | método public | 66–71 | `column: CategorySortColumn` | `string` |

##### `CategoryTableComponent.categories`

- **Firma:** `categories(value: Category[])` — [category-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-table/category-table.component.ts#L23) (L23–26)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.categoriesInput.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.categoriesInput.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CategoryTableComponent.toggleSort`

- **Firma:** `toggleSort(column: CategorySortColumn): void` — [category-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-table/category-table.component.ts#L57) (L57–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Consumidores:** `category-table.component.html` (plantilla)

##### `CategoryTableComponent.sortIcon`

- **Firma:** `sortIcon(column: CategorySortColumn): string` — [category-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-table/category-table.component.ts#L66) (L66–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `category-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-toolbar-category-toolbar-component-ts"></a>

### category-toolbar.component.ts

- **Ruta:** [category-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-toolbar/category-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/categories/components/category-toolbar/category-toolbar.component.ts`, 39 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-categories`
- **Responsabilidad:** Componente Angular: declara `CategoryToolbarComponent`, `StatusFilterOption`, `StatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [categories-page.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts), [categories-page.component.ts (plantilla)](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts) (plantilla)
- **Plantilla:** [category-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/category-toolbar/category-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="addCategory.emit()"`, `(click)="statusFilterChange.emit(option.value)"`

**Interfaces, tipos y enums:**

- `interface StatusFilterOption` (L8): sin documentación — miembros: `value`, `label`
- `type StatusFilterValue` (L6) = `'all' \| 'active' \| 'inactive'`

#### Clase `CategoryToolbarComponent` (L19–38)

- **Decoradores:** `@Component({ selector: 'app-category-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './category-toolbar.compone`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input statusFilter = 'all'`, `@Input canManage = true`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output statusFilterChange = new EventEmitter<StatusFilterValue>()`, `@Output addCategory = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-categories-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/categories/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-categories`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [categories-page.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts), [categories-page.component.ts (plantilla)](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-category-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm-modal.com`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input category = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
