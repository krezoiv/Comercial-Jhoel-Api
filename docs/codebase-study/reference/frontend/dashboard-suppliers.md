# Frontend `dashboard-suppliers`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [supplier-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-form-modal-supplier-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `SupplierFormModalComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [supplier-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-summary-supplier-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `SupplierSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [supplier-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-table-supplier-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `SupplierTableComponent`, `SupplierSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [supplier-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-toolbar-supplier-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `SupplierToolbarComponent`, `StatusFilterOption`, `StatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [suppliers-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `SuppliersPageComponent` (sin comentario de documentación en el código). | 11 internas; ext.: @angular/common, @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/delete-confirm-modal/delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [supplier-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-form-modal/supplier-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `supplier-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [supplier-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-form-modal/supplier-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [supplier-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-summary/supplier-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `supplier-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [supplier-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-summary/supplier-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [supplier-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-table/supplier-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `supplier-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [supplier-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-table/supplier-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [supplier-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-toolbar/supplier-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `supplier-toolbar.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [supplier-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-toolbar/supplier-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [suppliers-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `suppliers-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-supplier-summary`, `app-supplier-toolbar`, `app-supplier-table`, `app-supplier-form-modal`, `app-supplier-delete-confirm-modal`. | — | — | Media |
| [suppliers-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/suppliers/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-suppliers`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [suppliers-page.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts), [suppliers-page.component.ts (plantilla)](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-supplier-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm-modal.com`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input supplier = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-form-modal-supplier-form-modal-component-ts"></a>

### supplier-form-modal.component.ts

- **Ruta:** [supplier-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-form-modal/supplier-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-form-modal/supplier-form-modal.component.ts`, 131 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-suppliers`
- **Responsabilidad:** Componente Angular: declara `SupplierFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [supplier.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-supplier-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [suppliers-page.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts), [suppliers-page.component.ts (plantilla)](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts) (plantilla)
- **Plantilla:** [supplier-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-form-modal/supplier-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `SupplierFormModalComponent` (L21–130)

- **Decoradores:** `@Component({ selector: 'app-supplier-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './supplier-form`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `supplierService = inject(SupplierService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input supplier = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<Supplier>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 52–54 | — | `boolean` |
| `ngOnChanges` | método public | 56–75 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 77–116 | — | `Promise<void>` |
| `close` | método public async | 118–129 | — | `Promise<void>` |

##### `SupplierFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [supplier-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-form-modal/supplier-form-modal.component.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SupplierFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [supplier-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-form-modal/supplier-form-modal.component.ts#L56) (L56–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SupplierFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [supplier-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-form-modal/supplier-form-modal.component.ts#L77) (L77–116)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.supplierService.updateSupplier`, `this.supplierService.createSupplier`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `supplier-form-modal.component.html` (plantilla)

##### `SupplierFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [supplier-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-form-modal/supplier-form-modal.component.ts#L118) (L118–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `supplier-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-summary-supplier-summary-component-ts"></a>

### supplier-summary.component.ts

- **Ruta:** [supplier-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-summary/supplier-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-summary/supplier-summary.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-suppliers`
- **Responsabilidad:** Componente Angular: declara `SupplierSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [suppliers-page.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts), [suppliers-page.component.ts (plantilla)](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts) (plantilla)
- **Plantilla:** [supplier-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-summary/supplier-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface SummaryTile` (L6): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `SupplierSummaryComponent` (L14–59)

- **Decoradores:** `@Component({ selector: 'app-supplier-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './supplier-summary.component.html'`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `suppliers = signal<Supplier[]>([])`, `tiles = computed<SummaryTile[]>(() => { const suppliers = `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `data` | setter public | 25–28 | `value: Supplier[]` | (inferido) |

##### `SupplierSummaryComponent.data`

- **Firma:** `data(value: Supplier[])` — [supplier-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-summary/supplier-summary.component.ts#L25) (L25–28)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.suppliers.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.suppliers.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-table-supplier-table-component-ts"></a>

### supplier-table.component.ts

- **Ruta:** [supplier-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-table/supplier-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-table/supplier-table.component.ts`, 73 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-suppliers`
- **Responsabilidad:** Componente Angular: declara `SupplierTableComponent`, `SupplierSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [suppliers-page.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts), [suppliers-page.component.ts (plantilla)](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts) (plantilla)
- **Plantilla:** [supplier-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-table/supplier-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addSupplier.emit()"`, `(click)="toggleSort('name')"`, `(click)="toggleSort('taxId')"`, `(click)="toggleSort('phone')"`, `(click)="toggleSort('email')"`, `(click)="toggleSort('isActive')"`, `(click)="edit.emit(supplier)"`, `(click)="delete.emit(supplier)"`

**Interfaces, tipos y enums:**

- `type SupplierSortColumn` (L6) = `'name' \| 'taxId' \| 'phone' \| 'email' \| 'isActive' \| 'createdAt'`
- `type SortDirection` (L7) = `'asc' \| 'desc'`

#### Clase `SupplierTableComponent` (L12–72)

- **Decoradores:** `@Component({ selector: 'app-supplier-table', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl: './su`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `suppliersInput = signal<Supplier[]>([])`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output edit = new EventEmitter<Supplier>()`, `@Output delete = new EventEmitter<Supplier>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addSupplier = new EventEmitter<void>()`, `sortColumn = signal<SupplierSortColumn>('createdAt')`, `sortDirection = signal<SortDirection>('desc')`, `sortedSuppliers = computed(() => { const column = this.sortColumn();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `suppliers` | setter public | 23–26 | `value: Supplier[]` | (inferido) |
| `toggleSort` | método public | 57–64 | `column: SupplierSortColumn` | `void` |
| `sortIcon` | método public | 66–71 | `column: SupplierSortColumn` | `string` |

##### `SupplierTableComponent.suppliers`

- **Firma:** `suppliers(value: Supplier[])` — [supplier-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-table/supplier-table.component.ts#L23) (L23–26)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.suppliersInput.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.suppliersInput.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SupplierTableComponent.toggleSort`

- **Firma:** `toggleSort(column: SupplierSortColumn): void` — [supplier-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-table/supplier-table.component.ts#L57) (L57–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Consumidores:** `supplier-table.component.html` (plantilla)

##### `SupplierTableComponent.sortIcon`

- **Firma:** `sortIcon(column: SupplierSortColumn): string` — [supplier-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-table/supplier-table.component.ts#L66) (L66–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `supplier-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-toolbar-supplier-toolbar-component-ts"></a>

### supplier-toolbar.component.ts

- **Ruta:** [supplier-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-toolbar/supplier-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-toolbar/supplier-toolbar.component.ts`, 39 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-suppliers`
- **Responsabilidad:** Componente Angular: declara `SupplierToolbarComponent`, `StatusFilterOption`, `StatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [suppliers-page.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts), [suppliers-page.component.ts (plantilla)](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts) (plantilla)
- **Plantilla:** [supplier-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/components/supplier-toolbar/supplier-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="addSupplier.emit()"`, `(click)="statusFilterChange.emit(option.value)"`

**Interfaces, tipos y enums:**

- `interface StatusFilterOption` (L8): sin documentación — miembros: `value`, `label`
- `type StatusFilterValue` (L6) = `'all' \| 'active' \| 'inactive'`

#### Clase `SupplierToolbarComponent` (L19–38)

- **Decoradores:** `@Component({ selector: 'app-supplier-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './supplier-toolbar.compone`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input statusFilter = 'all'`, `@Input canManage = true`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output statusFilterChange = new EventEmitter<StatusFilterValue>()`, `@Output addSupplier = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts"></a>

### suppliers-page.component.ts

- **Ruta:** [suppliers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.ts`, 187 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-suppliers`
- **Responsabilidad:** Componente Angular: declara `SuppliersPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [supplier.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-supplier-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [supplier-summary.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-summary-supplier-summary-component-ts), [supplier-toolbar.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-toolbar-supplier-toolbar-component-ts), [supplier-table.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-table-supplier-table-component-ts), [supplier-form-modal.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-form-modal-supplier-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [suppliers-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [supplier-summary.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-summary-supplier-summary-component-ts), [supplier-toolbar.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-toolbar-supplier-toolbar-component-ts), [supplier-table.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-table-supplier-table-component-ts), [supplier-form-modal.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-form-modal-supplier-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="onSearchTermChange($event)"`, `(statusFilterChange)="statusFilter.set($event)"`, `(addSupplier)="openCreateForm()"`, `(edit)="openEditForm($event)"`, `(delete)="requestDelete($event)"`, `(clearFilters)="clearFilters()"`, `(closed)="closeForm()"`, `(saved)="onSupplierSaved($event)"`, `(confirmed)="confirmDelete()"`, `(cancelled)="cancelDelete()"`

#### Clase `SuppliersPageComponent` (L18–186)

- **Decoradores:** `@Component({ selector: 'app-suppliers-page', standalone: true, imports: [ PageHeaderComponent, SupplierSummaryComponent, SupplierToolbarComponent, SupplierTableC`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `supplierService = inject(SupplierService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `suppliers = signal<Supplier[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<StatusFilterValue>('all')`, `searchResults = signal<Supplier[] \| null>(null)`, `isFormOpen = signal(false)`, `editingSupplier = signal<Supplier \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingSupplier = signal<Supplier \| null>(null)`, `isDeleting = signal(false)`, `filteredSuppliers = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed(() => this.searchTerm().trim().length > 0`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchSuppliers` | método private | 97–110 | — | `void` |
| `onSearchTermChange` | método public | 112–118 | `value: string` | `void` |
| `openCreateForm` | método public | 120–123 | — | `void` |
| `openEditForm` | método public | 125–128 | `supplier: Supplier` | `void` |
| `closeForm` | método public | 130–132 | — | `void` |
| `onSupplierSaved` | método public | 134–145 | `supplier: Supplier` | `void` |
| `requestDelete` | método public | 147–150 | `supplier: Supplier` | `void` |
| `cancelDelete` | método public | 152–155 | — | `void` |
| `confirmDelete` | método public | 157–179 | — | `void` |
| `clearFilters` | método public | 181–185 | — | `void` |

##### `SuppliersPageComponent.fetchSuppliers`

- **Firma:** `fetchSuppliers(): void` — [suppliers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.ts#L97) (L97–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.supplierService.getSuppliers(true).subscribe`, `this.supplierService.getSuppliers`, `this.suppliers.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.suppliers.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SuppliersPageComponent.onSearchTermChange`

- **Firma:** `onSearchTermChange(value: string): void` — [suppliers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.ts#L112) (L112–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `value.trim`, `this.searchResults.set`, `this.searchTerm$.next`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.searchResults.set`
- **Consumidores:** `suppliers-page.component.html` (plantilla)

##### `SuppliersPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [suppliers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.ts#L120) (L120–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingSupplier.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingSupplier.set`, `this.isFormOpen.set`
- **Consumidores:** `suppliers-page.component.html` (plantilla)

##### `SuppliersPageComponent.openEditForm`

- **Firma:** `openEditForm(supplier: Supplier): void` — [suppliers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.ts#L125) (L125–128)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingSupplier.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingSupplier.set`, `this.isFormOpen.set`
- **Consumidores:** `suppliers-page.component.html` (plantilla)

##### `SuppliersPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [suppliers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.ts#L130) (L130–132)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `suppliers-page.component.html` (plantilla)

##### `SuppliersPageComponent.onSupplierSaved`

- **Firma:** `onSupplierSaved(supplier: Supplier): void` — [suppliers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.ts#L134) (L134–145)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingSupplier`, `this.isFormOpen.set`, `this.suppliers.update`, `list.map`, `this.notificationService.success`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.suppliers.update`
- **Consumidores:** `suppliers-page.component.html` (plantilla)

##### `SuppliersPageComponent.requestDelete`

- **Firma:** `requestDelete(supplier: Supplier): void` — [suppliers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.ts#L147) (L147–150)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingSupplier.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingSupplier.set`, `this.isDeleteOpen.set`
- **Consumidores:** `suppliers-page.component.html` (plantilla)

##### `SuppliersPageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [suppliers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.ts#L152) (L152–155)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingSupplier.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingSupplier.set`
- **Consumidores:** `suppliers-page.component.html` (plantilla)

##### `SuppliersPageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [suppliers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.ts#L157) (L157–179)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingSupplier`, `this.isDeleting.set`, `this.supplierService.deleteSupplier(supplier.id).subscribe`, `this.supplierService.deleteSupplier`, `this.isDeleteOpen.set`, `this.deletingSupplier.set`, `this.suppliers.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingSupplier.set`, `this.suppliers.update`
- **Consumidores:** `suppliers-page.component.html` (plantilla)

##### `SuppliersPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [suppliers-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/suppliers/suppliers-page.component.ts#L181) (L181–185)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`, `this.searchResults.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`, `this.searchResults.set`
- **Consumidores:** `suppliers-page.component.html` (plantilla)

