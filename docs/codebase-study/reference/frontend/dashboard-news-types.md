# Frontend `dashboard-news-types`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [news-type-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-news-types-components-news-type-form-modal-news-type-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `NewsTypeFormModalComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [news-type-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-news-types-components-news-type-table-news-type-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de `NewsTableComponent`. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [news-types-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-news-types-news-types-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Sistema → Tipos de Noticias" — catálogo maestro y configurable de clasificaciones (Comercial, Educativa, Promociones, ...). | 8 internas; ext.: @angular/common, @angular/core, @angular/forms, rxjs | 1 | Baja (1 consumidores) |
| [news-type-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-form-modal/news-type-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-type-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [news-type-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-form-modal/news-type-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [news-type-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-table/news-type-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-type-table.component.ts`; usa 4 componentes hijos: `app-empty-state`, `app-button`, `app-icon`, `app-badge`. | — | — | Media |
| [news-type-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-table/news-type-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [news-types-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-types-page.component.ts`; usa 5 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-news-type-table`, `app-news-type-form-modal`. | — | — | Media |
| [news-types-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-news-types-components-news-type-form-modal-news-type-form-modal-component-ts"></a>

### news-type-form-modal.component.ts

- **Ruta:** [news-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-form-modal/news-type-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-form-modal/news-type-form-modal.component.ts`, 117 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-news-types`
- **Responsabilidad:** Componente Angular: declara `NewsTypeFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [news-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-news-type-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [news-types-page.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-news-types-page-component-ts), [news-types-page.component.ts (plantilla)](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-news-types-page-component-ts) (plantilla)
- **Plantilla:** [news-type-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-form-modal/news-type-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `NewsTypeFormModalComponent` (L21–116)

- **Decoradores:** `@Component({ selector: 'app-news-type-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './news-type-fo`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `newsTypeService = inject(NewsTypeService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input type = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<NewsType>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 49–51 | — | `boolean` |
| `ngOnChanges` | método public | 53–66 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 68–102 | — | `Promise<void>` |
| `close` | método public async | 104–115 | — | `Promise<void>` |

##### `NewsTypeFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [news-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-form-modal/news-type-form-modal.component.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsTypeFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [news-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-form-modal/news-type-form-modal.component.ts#L53) (L53–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsTypeFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [news-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-form-modal/news-type-form-modal.component.ts#L68) (L68–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `raw.name.trim`, `raw.description.trim`, `this.isSubmitting.set`, `this.newsTypeService.updateType`, `this.newsTypeService.createType`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `news-type-form-modal.component.html` (plantilla)

##### `NewsTypeFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [news-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-form-modal/news-type-form-modal.component.ts#L104) (L104–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `news-type-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-news-types-components-news-type-table-news-type-table-component-ts"></a>

### news-type-table.component.ts

- **Ruta:** [news-type-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-table/news-type-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-table/news-type-table.component.ts`, 31 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-news-types`
- **Responsabilidad:** Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de `NewsTableComponent`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [news-types-page.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-news-types-page-component-ts), [news-types-page.component.ts (plantilla)](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-news-types-page-component-ts) (plantilla)
- **Plantilla:** [news-type-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-table/news-type-table.component.html) · **Usa componentes:** [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addType.emit()"`, `(click)="moveUp.emit(type)"`, `(click)="moveDown.emit(type)"`, `(click)="edit.emit(type)"`, `(click)="toggleActive.emit(type)"`

#### Clase `NewsTypeTableComponent` (L9–30)

- **Decoradores:** `@Component({ selector: 'app-news-type-table', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl: './n`
- **Propósito:** Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de `NewsTableComponent`.
- **Datos / estado que administra:** `@Input types = []`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Output edit = new EventEmitter<NewsType>()`, `@Output toggleActive = new EventEmitter<NewsType>()`, `@Output moveUp = new EventEmitter<NewsType>()`, `@Output moveDown = new EventEmitter<NewsType>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addType = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-news-types-news-types-page-component-ts"></a>

### news-types-page.component.ts

- **Ruta:** [news-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts`, 178 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-news-types`
- **Responsabilidad:** "Sistema → Tipos de Noticias" — catálogo maestro y configurable de clasificaciones (Comercial, Educativa, Promociones, ...).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [news-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-news-type-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [news-type-table.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-components-news-type-table-news-type-table-component-ts), [news-type-form-modal.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-components-news-type-form-modal-news-type-form-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [news-types-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [news-type-table.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-components-news-type-table-news-type-table-component-ts), [news-type-form-modal.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-components-news-type-form-modal-news-type-form-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="openCreateForm()"`, `(ngModelChange)="searchTerm.set($event)"`, `(click)="statusFilter.set(option.value)"`, `(edit)="openEditForm($event)"`, `(toggleActive)="toggleActive($event)"`, `(moveUp)="moveUp($event)"`, `(moveDown)="moveDown($event)"`, `(clearFilters)="clearFilters()"`, `(addType)="openCreateForm()"`, `(closed)="closeForm()"`, `(saved)="onTypeSaved($event)"`

**Interfaces, tipos y enums:**

- `type StatusFilter` (L15) = `'all' \| 'active' \| 'inactive'`

#### Clase `NewsTypesPageComponent` (L24–177)

- **Decoradores:** `@Component({ selector: 'app-news-types-page', standalone: true, imports: [FormsModule, PageHeaderComponent, ButtonComponent, IconComponent, NewsTypeTableComponen`
- **Propósito:** "Sistema → Tipos de Noticias" — catálogo maestro y configurable de clasificaciones (Comercial, Educativa, Promociones, ...). Extensible sin tocar código: crear un tipo nuevo aquí lo hace aparecer automáticamente en el selector "Tipo de noticia" del formulario de Noticias y en el formulario público de suscripción.
- **Servicios inyectados con `inject()`:** `newsTypeService = inject(NewsTypeService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `types = signal<NewsType[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<StatusFilter>('all')`, `isFormOpen = signal(false)`, `editingType = signal<NewsType \| null>(null)`, `filteredTypes = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed(() => this.searchTerm().trim().length > 0`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchTypes` | método public | 70–82 | — | `void` |
| `clearFilters` | método public | 84–87 | — | `void` |
| `openCreateForm` | método public | 89–92 | — | `void` |
| `openEditForm` | método public | 94–97 | `type: NewsType` | `void` |
| `closeForm` | método public | 99–101 | — | `void` |
| `onTypeSaved` | método public | 103–112 | `type: NewsType` | `void` |
| `toggleActive` | método public async | 114–143 | `type: NewsType` | `Promise<void>` |
| `moveUp` | método public | 145–152 | `type: NewsType` | `void` |
| `moveDown` | método public | 154–161 | `type: NewsType` | `void` |
| `swapOrder` | método private | 163–176 | `list: NewsType[]`, `indexA: number`, `indexB: number` | `void` |

##### `NewsTypesPageComponent.fetchTypes`

- **Firma:** `fetchTypes(): void` — [news-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts#L70) (L70–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.newsTypeService.getTypes(true).subscribe`, `this.newsTypeService.getTypes`, `this.types.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.types.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsTypesPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [news-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts#L84) (L84–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `news-types-page.component.html` (plantilla)

##### `NewsTypesPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [news-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts#L89) (L89–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingType.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingType.set`, `this.isFormOpen.set`
- **Consumidores:** `news-types-page.component.html` (plantilla)

##### `NewsTypesPageComponent.openEditForm`

- **Firma:** `openEditForm(type: NewsType): void` — [news-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts#L94) (L94–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingType.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingType.set`, `this.isFormOpen.set`
- **Consumidores:** `news-types-page.component.html` (plantilla)

##### `NewsTypesPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [news-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts#L99) (L99–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `news-types-page.component.html` (plantilla)

##### `NewsTypesPageComponent.onTypeSaved`

- **Firma:** `onTypeSaved(type: NewsType): void` — [news-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts#L103) (L103–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingType`, `this.isFormOpen.set`, `this.types.update`, `list.map`, `this.notificationService.success`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.types.update`
- **Consumidores:** `news-types-page.component.html` (plantilla)

##### `NewsTypesPageComponent.toggleActive`

- **Firma:** `toggleActive(type: NewsType): Promise<void>` — [news-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts#L114) (L114–143)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.newsTypeService.updateType(type.id, { isActive: true }).pipe`, `this.newsTypeService.updateType`, `map`, `this.newsTypeService.deactivateType`, `request$.subscribe`, `this.types.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.types.update`
- **Consumidores:** `news-types-page.component.html` (plantilla)

##### `NewsTypesPageComponent.moveUp`

- **Firma:** `moveUp(type: NewsType): void` — [news-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts#L145) (L145–152)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.types`, `list.findIndex`, `this.swapOrder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `news-types-page.component.html` (plantilla)

##### `NewsTypesPageComponent.moveDown`

- **Firma:** `moveDown(type: NewsType): void` — [news-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts#L154) (L154–161)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.types`, `list.findIndex`, `this.swapOrder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `news-types-page.component.html` (plantilla)

##### `NewsTypesPageComponent.swapOrder`

- **Firma:** `swapOrder(list: NewsType[], indexA: number, indexB: number): void` — [news-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts#L163) (L163–176)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `reordered.map`, `this.newsTypeService.reorderTypes(items).subscribe`, `this.newsTypeService.reorderTypes`, `this.types.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.types.set`
- **Consumidores:** (mismo archivo)

