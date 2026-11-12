# Frontend `dashboard-assets`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [assets-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AssetsPageComponent`, `LIMIT` (sin comentario de documentación en el código). | 12 internas; ext.: @angular/common, @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [asset-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-form-modal-asset-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AssetFormModalComponent`, `todayIsoDate` (sin comentario de documentación en el código). | 7 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [asset-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-table-asset-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AssetTableComponent`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [asset-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-toolbar-asset-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AssetToolbarComponent`, `StatusFilterOption`, `AssetStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [client-search-select.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts) | .ts | Componente Angular | Feature (pantalla) | Searchable client select — a near-copy of Reportería's own `ProductFilterSearchComponent` (search box + dropdown + persistent "selected" chip), adapted for clients. | 3 internas; ext.: @angular/core, @angular/forms, rxjs | 11 | Alta (11 consumidores) |
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [assets-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `assets-page.component.ts`; usa 9 componentes hijos: `app-page-header`, `app-card`, `app-summary-tile`, `app-asset-toolbar`, `app-asset-table`, `app-report-pagination`. | — | — | Media |
| [asset-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-form-modal/asset-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `asset-form-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-client-search-select`, `app-button`. | — | — | Media |
| [asset-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-table/asset-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `asset-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [asset-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-toolbar/asset-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `asset-toolbar.component.ts`; usa 3 componentes hijos: `app-icon`, `app-button`, `app-client-search-select`. | — | — | Media |
| [client-search-select.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/client-search-select/client-search-select.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `client-search-select.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts"></a>

### assets-page.component.ts

- **Ruta:** [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts`, 251 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-assets`
- **Responsabilidad:** Componente Angular: declara `AssetsPageComponent`, `LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [asset.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-asset-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [asset-toolbar.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-toolbar-asset-toolbar-component-ts), [asset-table.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-table-asset-table-component-ts), [asset-form-modal.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-form-modal-asset-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-delete-confirm-modal-delete-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [assets-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts), [asset-toolbar.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-toolbar-asset-toolbar-component-ts), [asset-table.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-table-asset-table-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [asset-form-modal.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-form-modal-asset-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-delete-confirm-modal-delete-confirm-modal-component-ts), [account-statement-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-account-statement-modal-account-statement-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="onSearchTermChange($event)"`, `(statusFilterChange)="onStatusFilterChange($event)"`, `(clientFilterChange)="onClientFilterChange($event)"`, `(dateFromChange)="onDateFromChange($event)"`, `(dateToChange)="onDateToChange($event)"`, `(clearFilters)="clearFilters()"`, `(addRecord)="openCreateForm()"`, `(edit)="openEditForm($event)"`, `(delete)="requestDelete($event)"`, `(viewStatement)="openStatement($event)"`, `(pageChange)="onPageChange($event)"`, `(closed)="closeForm()"`, `(saved)="onRecordSaved($event)"`, `(confirmed)="confirmDelete()"`, `(cancelled)="cancelDelete()"`

#### Clase `AssetsPageComponent` (L21–250)

- **Decoradores:** `@Component({ selector: 'app-assets-page', standalone: true, imports: [ PageHeaderComponent, AssetToolbarComponent, AssetTableComponent, AssetFormModalComponent, `
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `assetService = inject(AssetService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `records = signal<Asset[]>([])`, `total = signal(0)`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<AssetStatusFilterValue>('all')`, `clientFilter = signal<Client \| null>(null)`, `dateFrom = signal('')`, `dateTo = signal('')`, `page = signal(1)`, `isFormOpen = signal(false)`, `editingRecord = signal<Asset \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingRecord = signal<Asset \| null>(null)`, `isDeleting = signal(false)`, `isStatementOpen = signal(false)`, `statementClient = signal<KardexStatementClient \| null>(null)`, `activeBalance = signal<ActiveBalanceSummary \| null>(null)`, `hasActiveFilters = computed( () => this.searchTerm().trim().length > `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchActiveBalance` | método public | 105–112 | — | `void` |
| `fetchRecords` | método public | 115–139 | — | `void` |
| `onSearchTermChange` | método public | 141–144 | `value: string` | `void` |
| `onStatusFilterChange` | método public | 146–150 | `value: AssetStatusFilterValue` | `void` |
| `onClientFilterChange` | método public | 152–156 | `client: Client \| null` | `void` |
| `onDateFromChange` | método public | 158–162 | `value: string` | `void` |
| `onDateToChange` | método public | 164–168 | `value: string` | `void` |
| `onPageChange` | método public | 170–173 | `page: number` | `void` |
| `clearFilters` | método public | 175–183 | — | `void` |
| `openCreateForm` | método public | 185–188 | — | `void` |
| `openEditForm` | método public | 190–193 | `record: Asset` | `void` |
| `closeForm` | método public | 195–197 | — | `void` |
| `onRecordSaved` | método public | 199–207 | `record: Asset` | `void` |
| `openStatement` | método public | 209–212 | `record: Asset` | `void` |
| `closeStatement` | método public | 214–216 | — | `void` |
| `requestDelete` | método public | 218–221 | `record: Asset` | `void` |
| `cancelDelete` | método public | 223–226 | — | `void` |
| `confirmDelete` | método public | 228–249 | — | `void` |

##### `AssetsPageComponent.fetchActiveBalance`

- **Firma:** `fetchActiveBalance(): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L105) (L105–112)
- **Propósito / descripción:** Always active-only, unfiltered — refetched whenever the underlying data actually changes (create/edit/deactivate/Kardex movement), never on a plain search/date/page change.
- **Dependencias (llamadas en su cuerpo):** `this.assetService.getActiveBalance().subscribe`, `this.assetService.getActiveBalance`, `this.activeBalance.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.activeBalance.set`
- **Consumidores:** `assets-page.component.html` (plantilla), (mismo archivo)

##### `AssetsPageComponent.fetchRecords`

- **Firma:** `fetchRecords(): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L115) (L115–139)
- **Propósito / descripción:** Not private — also called from the template as `(changed)="fetchRecords()"` after a Kardex movement is registered.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.statusFilter`, `this.assetService.getAssets`, `this.searchTerm().trim`, `this.searchTerm`, `this.clientFilter`, `this.dateFrom`, `this.dateTo`, `this.page`, `this.records.set`, `this.total.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.records.set`, `this.total.set`
- **Consumidores:** `assets-page.component.html` (plantilla), (mismo archivo)

##### `AssetsPageComponent.onSearchTermChange`

- **Firma:** `onSearchTermChange(value: string): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L141) (L141–144)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.searchTerm$.next`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.onStatusFilterChange`

- **Firma:** `onStatusFilterChange(value: AssetStatusFilterValue): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L146) (L146–150)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.statusFilter.set`, `this.page.set`, `this.fetchRecords`
- **Efectos secundarios:** Actualiza estado (signals): `this.statusFilter.set`, `this.page.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.onClientFilterChange`

- **Firma:** `onClientFilterChange(client: Client \| null): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L152) (L152–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientFilter.set`, `this.page.set`, `this.fetchRecords`
- **Efectos secundarios:** Actualiza estado (signals): `this.clientFilter.set`, `this.page.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.onDateFromChange`

- **Firma:** `onDateFromChange(value: string): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L158) (L158–162)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dateFrom.set`, `this.page.set`, `this.fetchRecords`
- **Efectos secundarios:** Actualiza estado (signals): `this.dateFrom.set`, `this.page.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.onDateToChange`

- **Firma:** `onDateToChange(value: string): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L164) (L164–168)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dateTo.set`, `this.page.set`, `this.fetchRecords`
- **Efectos secundarios:** Actualiza estado (signals): `this.dateTo.set`, `this.page.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L170) (L170–173)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.fetchRecords`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L175) (L175–183)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`, `this.clientFilter.set`, `this.dateFrom.set`, `this.dateTo.set`, `this.page.set`, `this.fetchRecords`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`, `this.clientFilter.set`, `this.dateFrom.set`, `this.dateTo.set`, `this.page.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L185) (L185–188)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingRecord.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingRecord.set`, `this.isFormOpen.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.openEditForm`

- **Firma:** `openEditForm(record: Asset): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L190) (L190–193)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingRecord.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingRecord.set`, `this.isFormOpen.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L195) (L195–197)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.onRecordSaved`

- **Firma:** `onRecordSaved(record: Asset): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L199) (L199–207)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingRecord`, `this.isFormOpen.set`, `this.notificationService.success`, `this.fetchRecords`, `this.fetchActiveBalance`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.openStatement`

- **Firma:** `openStatement(record: Asset): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L209) (L209–212)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.statementClient.set`, `this.isStatementOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.statementClient.set`, `this.isStatementOpen.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.closeStatement`

- **Firma:** `closeStatement(): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L214) (L214–216)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isStatementOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isStatementOpen.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.requestDelete`

- **Firma:** `requestDelete(record: Asset): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L218) (L218–221)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingRecord.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingRecord.set`, `this.isDeleteOpen.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L223) (L223–226)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingRecord.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingRecord.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

##### `AssetsPageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [assets-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts#L228) (L228–249)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingRecord`, `this.isDeleting.set`, `this.assetService.deleteAsset(record.id).subscribe`, `this.assetService.deleteAsset`, `this.isDeleteOpen.set`, `this.deletingRecord.set`, `this.notificationService.success`, `this.fetchRecords`, `this.fetchActiveBalance`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingRecord.set`
- **Consumidores:** `assets-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-form-modal-asset-form-modal-component-ts"></a>

### asset-form-modal.component.ts

- **Ruta:** [asset-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-form-modal/asset-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-form-modal/asset-form-modal.component.ts`, 146 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-assets`
- **Responsabilidad:** Componente Angular: declara `AssetFormModalComponent`, `todayIsoDate` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [asset.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-asset-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [client-search-select.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [assets-page.component.ts (plantilla)](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts) (plantilla)
- **Plantilla:** [asset-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-form-modal/asset-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [client-search-select.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`, `(selectionChange)="onClientSelected($event)"`

#### Clase `AssetFormModalComponent` (L30–145)

- **Decoradores:** `@Component({ selector: 'app-asset-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent, ClientSearchSelectComponent, Deci`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `assetService = inject(AssetService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input record = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<Asset>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 61–63 | — | `boolean` |
| `ngOnChanges` | método public | 65–80 | `changes: SimpleChanges` | `void` |
| `onClientSelected` | método public | 82–90 | `client: Client \| null` | `void` |
| `submit` | método public async | 92–131 | — | `Promise<void>` |
| `close` | método public async | 133–144 | — | `Promise<void>` |

##### `AssetFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [asset-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-form-modal/asset-form-modal.component.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [asset-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-form-modal/asset-form-modal.component.ts#L65) (L65–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`, `todayIsoDate`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetFormModalComponent.onClientSelected`

- **Firma:** `onClientSelected(client: Client \| null): void` — [asset-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-form-modal/asset-form-modal.component.ts#L82) (L82–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.form.controls.clientId.setValue`, `this.form.controls.clientId.markAsDirty`, `this.form.controls.clientId.markAsTouched`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `asset-form-modal.component.html` (plantilla)

##### `AssetFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [asset-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-form-modal/asset-form-modal.component.ts#L92) (L92–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.isSubmitting.set`, `description.trim().replace`, `description.trim`, `this.assetService.updateAsset`, `this.assetService.createAsset`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `asset-form-modal.component.html` (plantilla)

##### `AssetFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [asset-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-form-modal/asset-form-modal.component.ts#L133) (L133–144)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `asset-form-modal.component.html` (plantilla)

#### Función `todayIsoDate` (L23–28)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [asset-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-form-modal/asset-form-modal.component.ts#L23)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`, `now.getFullYear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-table-asset-table-component-ts"></a>

### asset-table.component.ts

- **Ruta:** [asset-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-table/asset-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-table/asset-table.component.ts`, 38 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-assets`
- **Responsabilidad:** Componente Angular: declara `AssetTableComponent`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [assets-page.component.ts (plantilla)](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts) (plantilla)
- **Plantilla:** [asset-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-table/asset-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addRecord.emit()"`, `(click)="viewStatement.emit(record)"`, `(click)="edit.emit(record)"`, `(click)="delete.emit(record)"`

#### Clase `AssetTableComponent` (L10–37)

- **Decoradores:** `@Component({ selector: 'app-asset-table', standalone: true, imports: [DatePipe, BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input records = []`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output edit = new EventEmitter<Asset>()`, `@Output delete = new EventEmitter<Asset>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addRecord = new EventEmitter<void>()`, `@Output viewStatement = new EventEmitter<Asset>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `formatCurrency` | método public | 34–36 | `amount: number` | `string` |

##### `AssetTableComponent.formatCurrency`

- **Firma:** `formatCurrency(amount: number): string` — [asset-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-table/asset-table.component.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `formatAssetCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `asset-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-toolbar-asset-toolbar-component-ts"></a>

### asset-toolbar.component.ts

- **Ruta:** [asset-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-toolbar/asset-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-toolbar/asset-toolbar.component.ts`, 49 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-assets`
- **Responsabilidad:** Componente Angular: declara `AssetToolbarComponent`, `StatusFilterOption`, `AssetStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [client-search-select.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [assets-page.component.ts (plantilla)](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts) (plantilla)
- **Plantilla:** [asset-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-toolbar/asset-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [client-search-select.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="addRecord.emit()"`, `(selectionChange)="clientFilterChange.emit($event)"`, `(ngModelChange)="dateFromChange.emit($event)"`, `(ngModelChange)="dateToChange.emit($event)"`, `(click)="statusFilterChange.emit(option.value)"`, `(click)="clearFilters.emit()"`

**Interfaces, tipos y enums:**

- `interface StatusFilterOption` (L10): sin documentación — miembros: `value`, `label`
- `type AssetStatusFilterValue` (L8) = `'all' \| 'active' \| 'inactive'`

#### Clase `AssetToolbarComponent` (L21–48)

- **Decoradores:** `@Component({ selector: 'app-asset-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, ClientSearchSelectComponent], templateUrl: '`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input statusFilter = 'all'`, `@Input clientFilter = null`, `@Input dateFrom = ''`, `@Input dateTo = ''`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output statusFilterChange = new EventEmitter<AssetStatusFilterValue>()`, `@Output clientFilterChange = new EventEmitter<Client \| null>()`, `@Output dateFromChange = new EventEmitter<string>()`, `@Output dateToChange = new EventEmitter<string>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addRecord = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts"></a>

### client-search-select.component.ts

- **Ruta:** [client-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/client-search-select/client-search-select.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/assets/components/client-search-select/client-search-select.component.ts`, 148 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-assets`
- **Responsabilidad:** Searchable client select — a near-copy of Reportería's own `ProductFilterSearchComponent` (search box + dropdown + persistent "selected" chip), adapted for clients.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [client.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-client-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [asset-form-modal.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-form-modal-asset-form-modal-component-ts), [asset-toolbar.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-toolbar-asset-toolbar-component-ts), [account-receivable-form-modal.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts) (plantilla), [account-receivable-toolbar.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-toolbar-account-receivable-toolbar-component-ts) (plantilla), [asset-form-modal.component.ts (plantilla)](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-form-modal-asset-form-modal-component-ts) (plantilla), [asset-toolbar.component.ts (plantilla)](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-toolbar-asset-toolbar-component-ts) (plantilla), [phones-sale-page.component.ts (plantilla)](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts) (plantilla), [create-quotation-tab.component.ts (plantilla)](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts) (plantilla), [register-sim-sale-registration-form.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-sale-registration-form-register-sim-sale-registration-form-component-ts) (plantilla), [sale-pricing-bar.component.ts (plantilla)](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-sale-pricing-bar-sale-pricing-bar-component-ts) (plantilla), [transaccionar-page.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) (plantilla)
- **Plantilla:** [client-search-select.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/client-search-select/client-search-select.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clear()"`, `(ngModelChange)="onInput($event)"`, `(focus)="onFocus()"`, `(blur)="onBlur()"`, `(click)="select(client)"`

#### Clase `ClientSearchSelectComponent` (L35–147)

- **Decoradores:** `@Component({ selector: 'app-client-search-select', standalone: true, imports: [FormsModule, IconComponent], templateUrl: './client-search-select.component.html',`
- **Propósito:** Searchable client select — a near-copy of Reportería's own `ProductFilterSearchComponent` (search box + dropdown + persistent "selected" chip), adapted for clients. The dropdown's base list (shown on focus with an empty query) is the full active-clients list, fetched once; once the user types, matching is delegated to the backend's accent/ case-insensitive `search_normalize()`-based `search` param (debounced), never a `.toLowerCase().includes()` filter in JS — see `ClientService .getClients`. Duplicated per feature folder (same copy lives under accounts-receivable/) rather than shared cross-feature, matching this app's established convention for small per-feature UI.
- **Servicios inyectados con `inject()`:** `clientService = inject(ClientService)`
- **Datos / estado que administra:** `selectedClientId = input<string \| null>(null)`, `selectedClientName = input<string \| null>(null)`, `@Input clearable = true`, `@Input placeholder = 'Buscar cliente…'`, `@Output selectionChange = new EventEmitter<Client \| null>()`, `clients = signal<Client[]>([])`, `clientsLoaded = signal(false)`, `searchResults = signal<Client[] \| null>(null)`, `query = signal('')`, `open = signal(false)`, `loading = computed(() => !this.clientsLoaded())`, `selectedClient = computed<Client \| null>(() => { const id = this.se`, `filteredClients = computed(() => { const term = this.query().trim();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onInput` | método public | 118–125 | `value: string` | `void` |
| `onFocus` | método public | 127–129 | — | `void` |
| `onBlur` | método public | 131–133 | — | `void` |
| `select` | método public | 135–140 | `client: Client` | `void` |
| `clear` | método public | 142–146 | — | `void` |

##### `ClientSearchSelectComponent.onInput`

- **Firma:** `onInput(value: string): void` — [client-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/client-search-select/client-search-select.component.ts#L118) (L118–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.open.set`, `value.trim`, `this.searchResults.set`, `this.query$.next`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.open.set`, `this.searchResults.set`
- **Consumidores:** `client-search-select.component.html` (plantilla)

##### `ClientSearchSelectComponent.onFocus`

- **Firma:** `onFocus(): void` — [client-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/client-search-select/client-search-select.component.ts#L127) (L127–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `client-search-select.component.html` (plantilla)

##### `ClientSearchSelectComponent.onBlur`

- **Firma:** `onBlur(): void` — [client-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/client-search-select/client-search-select.component.ts#L131) (L131–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `setTimeout`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `client-search-select.component.html` (plantilla)

##### `ClientSearchSelectComponent.select`

- **Firma:** `select(client: Client): void` — [client-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/client-search-select/client-search-select.component.ts#L135) (L135–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectionChange.emit`, `this.query.set`, `this.searchResults.set`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.searchResults.set`, `this.open.set`; Emite eventos: `this.selectionChange.emit`
- **Consumidores:** `client-search-select.component.html` (plantilla)

##### `ClientSearchSelectComponent.clear`

- **Firma:** `clear(): void` — [client-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/client-search-select/client-search-select.component.ts#L142) (L142–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectionChange.emit`, `this.query.set`, `this.searchResults.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.searchResults.set`; Emite eventos: `this.selectionChange.emit`
- **Consumidores:** `client-search-select.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-assets-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/assets/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-assets`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [assets-page.component.ts (plantilla)](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-asset-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm-modal.compon`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input record = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
