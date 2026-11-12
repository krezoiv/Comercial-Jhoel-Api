# Frontend `dashboard-presentation-units`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [presentation-types-tab.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-presentation-types-tab-presentation-types-tab-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Tipos de Presentación" tab — the master catalog Compras/Ventas/Inventory consume via `PresentationFormModalComponent`'s dropdown (see that component's own doc comment). | 7 internas; ext.: @angular/common, @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [units-of-measure-tab.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-units-of-measure-tab-units-of-measure-tab-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Unidades de Medida" tab — the master catalog `ProductFormModalComponent` consumes for its "Unidad de medida" dropdown. | 7 internas; ext.: @angular/common, @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [presentation-units-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-presentation-units-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | `Sistema → Presentaciones y Medidas` — the two master catalogs that replace free-text presentation/unit names across the app (see the backend `CLAUDE.md`'s "Catálogos maestros" section for the full migration/architecture writeup). | 3 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [presentation-types-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `presentation-types-tab.component.ts`; usa 5 componentes hijos: `app-card`, `app-icon`, `app-button`, `app-empty-state`, `app-badge`. | — | — | Media |
| [presentation-types-tab.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [units-of-measure-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `units-of-measure-tab.component.ts`; usa 5 componentes hijos: `app-card`, `app-icon`, `app-button`, `app-empty-state`, `app-badge`. | — | — | Media |
| [units-of-measure-tab.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [presentation-units-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/presentation-units-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `presentation-units-page.component.ts`; usa 3 componentes hijos: `app-page-header`, `app-presentation-types-tab`, `app-units-of-measure-tab`. | — | — | Media |
| [presentation-units-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/presentation-units-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-presentation-types-tab-presentation-types-tab-component-ts"></a>

### presentation-types-tab.component.ts

- **Ruta:** [presentation-types-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts`, 290 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-presentation-units`
- **Responsabilidad:** "Tipos de Presentación" tab — the master catalog Compras/Ventas/Inventory consume via `PresentationFormModalComponent`'s dropdown (see that component's own doc comment).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [presentation-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-presentation-type-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [presentation-units-page.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-presentation-units-page-component-ts), [presentation-units-page.component.ts (plantilla)](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-presentation-units-page-component-ts) (plantilla)
- **Plantilla:** [presentation-types-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(input)="searchTerm.set($any($event.target).value)"`, `(click)="statusFilter.set('all')"`, `(click)="statusFilter.set('active')"`, `(click)="statusFilter.set('inactive')"`, `(click)="openCreateForm()"`, `(click)="clearFilters()"`, `(click)="openEditForm(item)"`, `(click)="toggleActive(item)"`, `(click)="$event.stopPropagation()"`, `(click)="closeForm()"`, `(ngSubmit)="submit()"`

**Interfaces, tipos y enums:**

- `type StatusFilterValue` (L26) = `'all' \| 'active' \| 'inactive'`

#### Clase `PresentationTypesTabComponent` (L39–289)

- **Decoradores:** `@Component({ selector: 'app-presentation-types-tab', standalone: true, imports: [ ReactiveFormsModule, BadgeComponent, ButtonComponent, CardComponent, EmptyState`
- **Propósito:** "Tipos de Presentación" tab — the master catalog Compras/Ventas/Inventory consume via `PresentationFormModalComponent`'s dropdown (see that component's own doc comment). Self-contained, like `RegisterPurchaseFormComponent`/`SalesSummaryCardComponent` elsewhere in this app — fetches and mutates directly, the parent tab container only decides which tab is visible.
- **Servicios inyectados con `inject()`:** `presentationTypeService = inject(PresentationTypeService)`, `notificationService = inject(NotificationService)`, `confirmDialogService = inject(ConfirmDialogService)`, `authService = inject(AuthService)`, `fb = inject(FormBuilder)`
- **Datos / estado que administra:** `items = signal<PresentationTypeListItem[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<StatusFilterValue>('all')`, `isFormOpen = signal(false)`, `editingItem = signal<PresentationTypeListItem \| null>(null)`, `isSubmitting = signal(false)`, `formError = signal<string \| null>(null)`, `filteredItems = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed( () => this.searchTerm().trim().length > `, `totalCount = computed(() => this.items().length)`, `activeCount = computed(() => this.items().filter((i) => i.isActi`, `inactiveCount = computed(() => this.totalCount() - this.activeCoun`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 103–105 | — | `boolean` |
| `fetch` | método private | 111–125 | — | `void` |
| `clearFilters` | método public | 127–130 | — | `void` |
| `openCreateForm` | método public | 132–137 | — | `void` |
| `openEditForm` | método public | 139–148 | `item: PresentationTypeListItem` | `void` |
| `closeForm` | método public async | 150–161 | — | `Promise<void>` |
| `findByNormalizedName` | método private | 164–167 | `name: string` | `PresentationTypeListItem \| undefined` |
| `submit` | método public async | 169–231 | — | `Promise<void>` |
| `reactivate` | método private | 233–247 | `item: PresentationTypeListItem` | `void` |
| `toggleActive` | método public async | 249–288 | `item: PresentationTypeListItem` | `Promise<void>` |

##### `PresentationTypesTabComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [presentation-types-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts#L103) (L103–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationTypesTabComponent.fetch`

- **Firma:** `fetch(): void` — [presentation-types-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts#L111) (L111–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.presentationTypeService.getPresentationTypes({ includeInactive: true }).subscribe`, `this.presentationTypeService.getPresentationTypes`, `this.items.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.items.set`
- **Consumidores:** (mismo archivo)

##### `PresentationTypesTabComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [presentation-types-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts#L127) (L127–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `presentation-types-tab.component.html` (plantilla)

##### `PresentationTypesTabComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [presentation-types-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts#L132) (L132–137)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingItem.set`, `this.formError.set`, `this.form.reset`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingItem.set`, `this.formError.set`, `this.isFormOpen.set`
- **Consumidores:** `presentation-types-tab.component.html` (plantilla)

##### `PresentationTypesTabComponent.openEditForm`

- **Firma:** `openEditForm(item: PresentationTypeListItem): void` — [presentation-types-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts#L139) (L139–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingItem.set`, `this.formError.set`, `this.form.reset`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingItem.set`, `this.formError.set`, `this.isFormOpen.set`
- **Consumidores:** `presentation-types-tab.component.html` (plantilla)

##### `PresentationTypesTabComponent.closeForm`

- **Firma:** `closeForm(): Promise<void>` — [presentation-types-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts#L150) (L150–161)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `presentation-types-tab.component.html` (plantilla)

##### `PresentationTypesTabComponent.findByNormalizedName`

- **Firma:** `findByNormalizedName(name: string): PresentationTypeListItem \| undefined` — [presentation-types-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts#L164) (L164–167)
- **Propósito / descripción:** Finds an existing row (any state) whose name matches case-insensitively, trimmed — mirrors the backend's own normalization exactly, so the "ya existe pero está inactiva" prompt fires under the same rule the database enforces.
- **Dependencias (llamadas en su cuerpo):** `name.trim().toLowerCase`, `name.trim`, `this.items().find`, `this.items`, `item.name.trim().toLowerCase`, `item.name.trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `PresentationTypesTabComponent.submit`

- **Firma:** `submit(): Promise<void>` — [presentation-types-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts#L169) (L169–231)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.formError.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `name.trim`, `this.editingItem`, `this.findByNormalizedName`, `this.confirmDialogService.confirm`, `this.reactivate`, `this.isSubmitting.set`, `code.trim`, `description.trim`, `this.presentationTypeService.updatePresentationType`, `this.presentationTypeService.createPresentationType`, `request$.subscribe`, `this.isFormOpen.set`, `this.notificationService.success`, `this.fetch`…
- **Efectos secundarios:** Actualiza estado (signals): `this.formError.set`, `this.isSubmitting.set`, `this.isFormOpen.set`
- **Consumidores:** `presentation-types-tab.component.html` (plantilla)

##### `PresentationTypesTabComponent.reactivate`

- **Firma:** `reactivate(item: PresentationTypeListItem): void` — [presentation-types-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts#L233) (L233–247)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting.set`, `this.presentationTypeService.updatePresentationType`, `this.isFormOpen.set`, `this.notificationService.success`, `this.fetch`, `this.formError.set`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSubmitting.set`, `this.isFormOpen.set`, `this.formError.set`
- **Consumidores:** (mismo archivo)

##### `PresentationTypesTabComponent.toggleActive`

- **Firma:** `toggleActive(item: PresentationTypeListItem): Promise<void>` — [presentation-types-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts#L249) (L249–288)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.presentationTypeService.updatePresentationType`, `this.presentationTypeService.deletePresentationType`, `request$.subscribe`, `this.notificationService.success`, `this.fetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `presentation-types-tab.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-units-of-measure-tab-units-of-measure-tab-component-ts"></a>

### units-of-measure-tab.component.ts

- **Ruta:** [units-of-measure-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.ts`, 291 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-presentation-units`
- **Responsabilidad:** "Unidades de Medida" tab — the master catalog `ProductFormModalComponent` consumes for its "Unidad de medida" dropdown.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [unit-of-measure.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-unit-of-measure-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [presentation-units-page.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-presentation-units-page-component-ts), [presentation-units-page.component.ts (plantilla)](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-presentation-units-page-component-ts) (plantilla)
- **Plantilla:** [units-of-measure-tab.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(input)="searchTerm.set($any($event.target).value)"`, `(click)="statusFilter.set('all')"`, `(click)="statusFilter.set('active')"`, `(click)="statusFilter.set('inactive')"`, `(click)="openCreateForm()"`, `(click)="clearFilters()"`, `(click)="openEditForm(item)"`, `(click)="toggleActive(item)"`, `(click)="$event.stopPropagation()"`, `(click)="closeForm()"`, `(ngSubmit)="submit()"`

**Interfaces, tipos y enums:**

- `type StatusFilterValue` (L26) = `'all' \| 'active' \| 'inactive'`

#### Clase `UnitsOfMeasureTabComponent` (L40–290)

- **Decoradores:** `@Component({ selector: 'app-units-of-measure-tab', standalone: true, imports: [ ReactiveFormsModule, BadgeComponent, ButtonComponent, CardComponent, EmptyStateCo`
- **Propósito:** "Unidades de Medida" tab — the master catalog `ProductFormModalComponent` consumes for its "Unidad de medida" dropdown. Deliberately structured identically to `PresentationTypesTabComponent` (same fetch/filter/create/ edit/reactivate-prompt/toggle-active shape) but never shares data with it — a unit of measure and a presentation type are different concepts (see both catalogs' own backend doc comments), each with its own table and its own catalog.
- **Servicios inyectados con `inject()`:** `unitOfMeasureService = inject(UnitOfMeasureService)`, `notificationService = inject(NotificationService)`, `confirmDialogService = inject(ConfirmDialogService)`, `authService = inject(AuthService)`, `fb = inject(FormBuilder)`
- **Datos / estado que administra:** `items = signal<UnitOfMeasureListItem[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<StatusFilterValue>('all')`, `isFormOpen = signal(false)`, `editingItem = signal<UnitOfMeasureListItem \| null>(null)`, `isSubmitting = signal(false)`, `formError = signal<string \| null>(null)`, `filteredItems = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed( () => this.searchTerm().trim().length > `, `totalCount = computed(() => this.items().length)`, `activeCount = computed(() => this.items().filter((i) => i.isActi`, `inactiveCount = computed(() => this.totalCount() - this.activeCoun`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 104–106 | — | `boolean` |
| `fetch` | método private | 112–126 | — | `void` |
| `clearFilters` | método public | 128–131 | — | `void` |
| `openCreateForm` | método public | 133–138 | — | `void` |
| `openEditForm` | método public | 140–149 | `item: UnitOfMeasureListItem` | `void` |
| `closeForm` | método public async | 151–162 | — | `Promise<void>` |
| `findByNormalizedName` | método private | 165–168 | `name: string` | `UnitOfMeasureListItem \| undefined` |
| `submit` | método public async | 170–232 | — | `Promise<void>` |
| `reactivate` | método private | 234–248 | `item: UnitOfMeasureListItem` | `void` |
| `toggleActive` | método public async | 250–289 | `item: UnitOfMeasureListItem` | `Promise<void>` |

##### `UnitsOfMeasureTabComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [units-of-measure-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.ts#L104) (L104–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitsOfMeasureTabComponent.fetch`

- **Firma:** `fetch(): void` — [units-of-measure-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.ts#L112) (L112–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.unitOfMeasureService.getUnitsOfMeasure({ includeInactive: true }).subscribe`, `this.unitOfMeasureService.getUnitsOfMeasure`, `this.items.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.items.set`
- **Consumidores:** (mismo archivo)

##### `UnitsOfMeasureTabComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [units-of-measure-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.ts#L128) (L128–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `units-of-measure-tab.component.html` (plantilla)

##### `UnitsOfMeasureTabComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [units-of-measure-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.ts#L133) (L133–138)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingItem.set`, `this.formError.set`, `this.form.reset`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingItem.set`, `this.formError.set`, `this.isFormOpen.set`
- **Consumidores:** `units-of-measure-tab.component.html` (plantilla)

##### `UnitsOfMeasureTabComponent.openEditForm`

- **Firma:** `openEditForm(item: UnitOfMeasureListItem): void` — [units-of-measure-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.ts#L140) (L140–149)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingItem.set`, `this.formError.set`, `this.form.reset`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingItem.set`, `this.formError.set`, `this.isFormOpen.set`
- **Consumidores:** `units-of-measure-tab.component.html` (plantilla)

##### `UnitsOfMeasureTabComponent.closeForm`

- **Firma:** `closeForm(): Promise<void>` — [units-of-measure-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.ts#L151) (L151–162)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `units-of-measure-tab.component.html` (plantilla)

##### `UnitsOfMeasureTabComponent.findByNormalizedName`

- **Firma:** `findByNormalizedName(name: string): UnitOfMeasureListItem \| undefined` — [units-of-measure-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.ts#L165) (L165–168)
- **Propósito / descripción:** Finds an existing row (any state) whose name matches case-insensitively, trimmed — mirrors the backend's own normalization exactly, so the "ya existe pero está inactiva" prompt fires under the same rule the database enforces.
- **Dependencias (llamadas en su cuerpo):** `name.trim().toLowerCase`, `name.trim`, `this.items().find`, `this.items`, `item.name.trim().toLowerCase`, `item.name.trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `UnitsOfMeasureTabComponent.submit`

- **Firma:** `submit(): Promise<void>` — [units-of-measure-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.ts#L170) (L170–232)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.formError.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `name.trim`, `this.editingItem`, `this.findByNormalizedName`, `this.confirmDialogService.confirm`, `this.reactivate`, `this.isSubmitting.set`, `abbreviation.trim`, `description.trim`, `this.unitOfMeasureService.updateUnitOfMeasure`, `this.unitOfMeasureService.createUnitOfMeasure`, `request$.subscribe`, `this.isFormOpen.set`, `this.notificationService.success`, `this.fetch`…
- **Efectos secundarios:** Actualiza estado (signals): `this.formError.set`, `this.isSubmitting.set`, `this.isFormOpen.set`
- **Consumidores:** `units-of-measure-tab.component.html` (plantilla)

##### `UnitsOfMeasureTabComponent.reactivate`

- **Firma:** `reactivate(item: UnitOfMeasureListItem): void` — [units-of-measure-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.ts#L234) (L234–248)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting.set`, `this.unitOfMeasureService.updateUnitOfMeasure(item.id, { isActive: true }).subscribe`, `this.unitOfMeasureService.updateUnitOfMeasure`, `this.isFormOpen.set`, `this.notificationService.success`, `this.fetch`, `this.formError.set`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSubmitting.set`, `this.isFormOpen.set`, `this.formError.set`
- **Consumidores:** (mismo archivo)

##### `UnitsOfMeasureTabComponent.toggleActive`

- **Firma:** `toggleActive(item: UnitOfMeasureListItem): Promise<void>` — [units-of-measure-tab.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/units-of-measure-tab/units-of-measure-tab.component.ts#L250) (L250–289)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.unitOfMeasureService.updateUnitOfMeasure`, `this.unitOfMeasureService.deleteUnitOfMeasure`, `request$.subscribe`, `this.notificationService.success`, `this.fetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `units-of-measure-tab.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-presentation-units-page-component-ts"></a>

### presentation-units-page.component.ts

- **Ruta:** [presentation-units-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/presentation-units-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/presentation-units/presentation-units-page.component.ts`, 31 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-presentation-units`
- **Responsabilidad:** `Sistema → Presentaciones y Medidas` — the two master catalogs that replace free-text presentation/unit names across the app (see the backend `CLAUDE.md`'s "Catálogos maestros" section for the full migration/architecture writeup).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [presentation-types-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-presentation-types-tab-presentation-types-tab-component-ts), [units-of-measure-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-units-of-measure-tab-units-of-measure-tab-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [presentation-units-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/presentation-units-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [presentation-types-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-presentation-types-tab-presentation-types-tab-component-ts), [units-of-measure-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-units-of-measure-tab-units-of-measure-tab-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="selectTab('presentaciones')"`, `(click)="selectTab('unidades')"`

**Interfaces, tipos y enums:**

- `type TabValue` (L7) = `'presentaciones' \| 'unidades'`

#### Clase `PresentationUnitsPageComponent` (L16–30)

- **Decoradores:** `@Component({ selector: 'app-presentation-units-page', standalone: true, imports: [PageHeaderComponent, PresentationTypesTabComponent, UnitsOfMeasureTabComponent]`
- **Propósito:** `Sistema → Presentaciones y Medidas` — the two master catalogs that replace free-text presentation/unit names across the app (see the backend `CLAUDE.md`'s "Catálogos maestros" section for the full migration/architecture writeup). Each tab is a fully self-contained component; this page only decides which one is visible.
- **Datos / estado que administra:** `activeTab = signal<TabValue>('presentaciones')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `selectTab` | método public | 27–29 | `tab: TabValue` | `void` |

##### `PresentationUnitsPageComponent.selectTab`

- **Firma:** `selectTab(tab: TabValue): void` — [presentation-units-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/presentation-units-page.component.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.activeTab.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.activeTab.set`
- **Consumidores:** `presentation-units-page.component.html` (plantilla)

