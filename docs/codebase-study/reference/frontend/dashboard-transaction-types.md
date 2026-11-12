# Frontend `dashboard-transaction-types`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [transaction-type-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-form-modal-transaction-type-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `TransactionTypeFormModalComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [transaction-type-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-summary-transaction-type-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `TransactionTypeSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [transaction-type-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-table-transaction-type-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `TransactionTypeTableComponent`, `TransactionTypeSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [transaction-type-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-toolbar-transaction-type-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `TransactionTypeToolbarComponent`, `StatusFilterOption`, `TransactionTypeStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [transaction-types-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `TransactionTypesPageComponent` (sin comentario de documentación en el código). | 11 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/delete-confirm-modal/delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-type-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-form-modal/transaction-type-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-type-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [transaction-type-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-form-modal/transaction-type-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-type-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-summary/transaction-type-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-type-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [transaction-type-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-summary/transaction-type-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-type-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-table/transaction-type-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-type-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [transaction-type-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-table/transaction-type-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-type-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-toolbar/transaction-type-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-type-toolbar.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [transaction-type-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-toolbar/transaction-type-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-types-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-types-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-transaction-type-summary`, `app-transaction-type-toolbar`, `app-transaction-type-table`, `app-transaction-type-form-modal`, `app-transaction-type-delete-confirm-modal`. | — | — | Media |
| [transaction-types-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-types`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [transaction-types-page.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts), [transaction-types-page.component.ts (plantilla)](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-transaction-type-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm-m`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input transactionType = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-form-modal-transaction-type-form-modal-component-ts"></a>

### transaction-type-form-modal.component.ts

- **Ruta:** [transaction-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-form-modal/transaction-type-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-form-modal/transaction-type-form-modal.component.ts`, 150 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-types`
- **Responsabilidad:** Componente Angular: declara `TransactionTypeFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [transaction-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-transaction-type-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [transaction-types-page.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts), [transaction-types-page.component.ts (plantilla)](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts) (plantilla)
- **Plantilla:** [transaction-type-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-form-modal/transaction-type-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`, `(change)="onBalanceEffectChange()"`

#### Clase `TransactionTypeFormModalComponent` (L29–149)

- **Decoradores:** `@Component({ selector: 'app-transaction-type-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './trans`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `transactionTypeService = inject(TransactionTypeService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input transactionType = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<TransactionType>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `selectedCashEffectHint` | getter public | 56–59 | — | `string` |
| `onBalanceEffectChange` | método public | 62–65 | — | `void` |
| `selectedEffectHint` | getter public | 67–73 | — | `string` |
| `isEditMode` | getter public | 82–84 | — | `boolean` |
| `ngOnChanges` | método public | 86–100 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 102–135 | — | `Promise<void>` |
| `close` | método public async | 137–148 | — | `Promise<void>` |

##### `TransactionTypeFormModalComponent.selectedCashEffectHint`

- **Firma:** `selectedCashEffectHint(): string` — [transaction-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-form-modal/transaction-type-form-modal.component.ts#L56) (L56–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cashEffectOptions.find`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionTypeFormModalComponent.onBalanceEffectChange`

- **Firma:** `onBalanceEffectChange(): void` — [transaction-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-form-modal/transaction-type-form-modal.component.ts#L62) (L62–65)
- **Propósito / descripción:** Changing the bank effect suggests the matching cash effect; the admin can still override it.
- **Dependencias (llamadas en su cuerpo):** `this.form.controls.cashEffect.setValue`, `defaultCashEffect`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaction-type-form-modal.component.html` (plantilla)

##### `TransactionTypeFormModalComponent.selectedEffectHint`

- **Firma:** `selectedEffectHint(): string` — [transaction-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-form-modal/transaction-type-form-modal.component.ts#L67) (L67–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.balanceEffectOptions.find`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionTypeFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [transaction-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-form-modal/transaction-type-form-modal.component.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionTypeFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [transaction-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-form-modal/transaction-type-form-modal.component.ts#L86) (L86–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionTypeFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [transaction-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-form-modal/transaction-type-form-modal.component.ts#L102) (L102–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.transactionTypeService.updateTransactionType`, `this.transactionTypeService.createTransactionType`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `transaction-type-form-modal.component.html` (plantilla)

##### `TransactionTypeFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [transaction-type-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-form-modal/transaction-type-form-modal.component.ts#L137) (L137–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `transaction-type-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-summary-transaction-type-summary-component-ts"></a>

### transaction-type-summary.component.ts

- **Ruta:** [transaction-type-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-summary/transaction-type-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-summary/transaction-type-summary.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-types`
- **Responsabilidad:** Componente Angular: declara `TransactionTypeSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [transaction-types-page.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts), [transaction-types-page.component.ts (plantilla)](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts) (plantilla)
- **Plantilla:** [transaction-type-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-summary/transaction-type-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface SummaryTile` (L6): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `TransactionTypeSummaryComponent` (L14–59)

- **Decoradores:** `@Component({ selector: 'app-transaction-type-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './transaction-type-summary`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `transactionTypes = signal<TransactionType[]>([])`, `tiles = computed<SummaryTile[]>(() => { const transactionT`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `data` | setter public | 25–28 | `value: TransactionType[]` | (inferido) |

##### `TransactionTypeSummaryComponent.data`

- **Firma:** `data(value: TransactionType[])` — [transaction-type-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-summary/transaction-type-summary.component.ts#L25) (L25–28)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionTypes.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionTypes.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-table-transaction-type-table-component-ts"></a>

### transaction-type-table.component.ts

- **Ruta:** [transaction-type-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-table/transaction-type-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-table/transaction-type-table.component.ts`, 73 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-types`
- **Responsabilidad:** Componente Angular: declara `TransactionTypeTableComponent`, `TransactionTypeSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [transaction-types-page.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts), [transaction-types-page.component.ts (plantilla)](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts) (plantilla)
- **Plantilla:** [transaction-type-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-table/transaction-type-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addTransactionType.emit()"`, `(click)="toggleSort('name')"`, `(click)="toggleSort('isActive')"`, `(click)="edit.emit(transactionType)"`, `(click)="delete.emit(transactionType)"`

**Interfaces, tipos y enums:**

- `type TransactionTypeSortColumn` (L6) = `'name' \| 'isActive' \| 'createdAt'`
- `type SortDirection` (L7) = `'asc' \| 'desc'`

#### Clase `TransactionTypeTableComponent` (L12–72)

- **Decoradores:** `@Component({ selector: 'app-transaction-type-table', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUr`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `transactionTypesInput = signal<TransactionType[]>([])`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output edit = new EventEmitter<TransactionType>()`, `@Output delete = new EventEmitter<TransactionType>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addTransactionType = new EventEmitter<void>()`, `sortColumn = signal<TransactionTypeSortColumn>('createdAt')`, `sortDirection = signal<SortDirection>('desc')`, `sortedTransactionTypes = computed(() => { const column = this.sortColumn();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `transactionTypes` | setter public | 23–26 | `value: TransactionType[]` | (inferido) |
| `toggleSort` | método public | 57–64 | `column: TransactionTypeSortColumn` | `void` |
| `sortIcon` | método public | 66–71 | `column: TransactionTypeSortColumn` | `string` |

##### `TransactionTypeTableComponent.transactionTypes`

- **Firma:** `transactionTypes(value: TransactionType[])` — [transaction-type-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-table/transaction-type-table.component.ts#L23) (L23–26)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionTypesInput.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionTypesInput.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionTypeTableComponent.toggleSort`

- **Firma:** `toggleSort(column: TransactionTypeSortColumn): void` — [transaction-type-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-table/transaction-type-table.component.ts#L57) (L57–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Consumidores:** `transaction-type-table.component.html` (plantilla)

##### `TransactionTypeTableComponent.sortIcon`

- **Firma:** `sortIcon(column: TransactionTypeSortColumn): string` — [transaction-type-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-table/transaction-type-table.component.ts#L66) (L66–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaction-type-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-toolbar-transaction-type-toolbar-component-ts"></a>

### transaction-type-toolbar.component.ts

- **Ruta:** [transaction-type-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-toolbar/transaction-type-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-toolbar/transaction-type-toolbar.component.ts`, 39 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-types`
- **Responsabilidad:** Componente Angular: declara `TransactionTypeToolbarComponent`, `StatusFilterOption`, `TransactionTypeStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [transaction-types-page.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts), [transaction-types-page.component.ts (plantilla)](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts) (plantilla)
- **Plantilla:** [transaction-type-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/components/transaction-type-toolbar/transaction-type-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="addTransactionType.emit()"`, `(click)="statusFilterChange.emit(option.value)"`

**Interfaces, tipos y enums:**

- `interface StatusFilterOption` (L8): sin documentación — miembros: `value`, `label`
- `type TransactionTypeStatusFilterValue` (L6) = `'all' \| 'active' \| 'inactive'`

#### Clase `TransactionTypeToolbarComponent` (L19–38)

- **Decoradores:** `@Component({ selector: 'app-transaction-type-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './transaction-type`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input statusFilter = 'all'`, `@Input canManage = true`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output statusFilterChange = new EventEmitter<TransactionTypeStatusFilterValue>`, `@Output addTransactionType = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts"></a>

### transaction-types-page.component.ts

- **Ruta:** [transaction-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.ts`, 158 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-types`
- **Responsabilidad:** Componente Angular: declara `TransactionTypesPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [transaction-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-transaction-type-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [transaction-type-summary.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-summary-transaction-type-summary-component-ts), [transaction-type-toolbar.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-toolbar-transaction-type-toolbar-component-ts), [transaction-type-table.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-table-transaction-type-table-component-ts), [transaction-type-form-modal.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-form-modal-transaction-type-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [transaction-types-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [transaction-type-summary.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-summary-transaction-type-summary-component-ts), [transaction-type-toolbar.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-toolbar-transaction-type-toolbar-component-ts), [transaction-type-table.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-table-transaction-type-table-component-ts), [transaction-type-form-modal.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-form-modal-transaction-type-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="searchTerm.set($event)"`, `(statusFilterChange)="statusFilter.set($event)"`, `(addTransactionType)="openCreateForm()"`, `(edit)="openEditForm($event)"`, `(delete)="requestDelete($event)"`, `(clearFilters)="clearFilters()"`, `(closed)="closeForm()"`, `(saved)="onTransactionTypeSaved($event)"`, `(confirmed)="confirmDelete()"`, `(cancelled)="cancelDelete()"`

#### Clase `TransactionTypesPageComponent` (L16–157)

- **Decoradores:** `@Component({ selector: 'app-transaction-types-page', standalone: true, imports: [ PageHeaderComponent, TransactionTypeSummaryComponent, TransactionTypeToolbarCom`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `transactionTypeService = inject(TransactionTypeService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `transactionTypes = signal<TransactionType[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<TransactionTypeStatusFilterValue>('all')`, `isFormOpen = signal(false)`, `editingTransactionType = signal<TransactionType \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingTransactionType = signal<TransactionType \| null>(null)`, `isDeleting = signal(false)`, `filteredTransactionTypes = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed( () => this.searchTerm().trim().length > `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchTransactionTypes` | método private | 77–90 | — | `void` |
| `openCreateForm` | método public | 92–95 | — | `void` |
| `openEditForm` | método public | 97–100 | `transactionType: TransactionType` | `void` |
| `closeForm` | método public | 102–104 | — | `void` |
| `onTransactionTypeSaved` | método public | 106–117 | `transactionType: TransactionType` | `void` |
| `requestDelete` | método public | 119–122 | `transactionType: TransactionType` | `void` |
| `cancelDelete` | método public | 124–127 | — | `void` |
| `confirmDelete` | método public | 129–151 | — | `void` |
| `clearFilters` | método public | 153–156 | — | `void` |

##### `TransactionTypesPageComponent.fetchTransactionTypes`

- **Firma:** `fetchTransactionTypes(): void` — [transaction-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.ts#L77) (L77–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.transactionTypeService.getTransactionTypes(true).subscribe`, `this.transactionTypeService.getTransactionTypes`, `this.transactionTypes.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.transactionTypes.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionTypesPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [transaction-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.ts#L92) (L92–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingTransactionType.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingTransactionType.set`, `this.isFormOpen.set`
- **Consumidores:** `transaction-types-page.component.html` (plantilla)

##### `TransactionTypesPageComponent.openEditForm`

- **Firma:** `openEditForm(transactionType: TransactionType): void` — [transaction-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.ts#L97) (L97–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingTransactionType.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingTransactionType.set`, `this.isFormOpen.set`
- **Consumidores:** `transaction-types-page.component.html` (plantilla)

##### `TransactionTypesPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [transaction-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.ts#L102) (L102–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `transaction-types-page.component.html` (plantilla)

##### `TransactionTypesPageComponent.onTransactionTypeSaved`

- **Firma:** `onTransactionTypeSaved(transactionType: TransactionType): void` — [transaction-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.ts#L106) (L106–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingTransactionType`, `this.isFormOpen.set`, `this.transactionTypes.update`, `list.map`, `this.notificationService.success`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.transactionTypes.update`
- **Consumidores:** `transaction-types-page.component.html` (plantilla)

##### `TransactionTypesPageComponent.requestDelete`

- **Firma:** `requestDelete(transactionType: TransactionType): void` — [transaction-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.ts#L119) (L119–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingTransactionType.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingTransactionType.set`, `this.isDeleteOpen.set`
- **Consumidores:** `transaction-types-page.component.html` (plantilla)

##### `TransactionTypesPageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [transaction-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.ts#L124) (L124–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingTransactionType.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingTransactionType.set`
- **Consumidores:** `transaction-types-page.component.html` (plantilla)

##### `TransactionTypesPageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [transaction-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.ts#L129) (L129–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingTransactionType`, `this.isDeleting.set`, `this.transactionTypeService.deleteTransactionType(transactionType.id).subscribe`, `this.transactionTypeService.deleteTransactionType`, `this.isDeleteOpen.set`, `this.deletingTransactionType.set`, `this.transactionTypes.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingTransactionType.set`, `this.transactionTypes.update`
- **Consumidores:** `transaction-types-page.component.html` (plantilla)

##### `TransactionTypesPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [transaction-types-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-types/transaction-types-page.component.ts#L153) (L153–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `transaction-types-page.component.html` (plantilla)

