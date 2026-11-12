# Frontend `dashboard-catalog-banks`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [catalog-banks-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Sistema → Catálogo de Bancos" — catálogo público informativo (imagen, nombre, descripción, información adicional, orden, estado). | 10 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [bank-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-form-modal-bank-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `BankFormModalComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/common, @angular/core, @angular/forms | 3 | Media (3 consumidores) |
| [bank-image-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-image-modal-bank-image-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Gestor de la imagen principal de un banco — subir/reemplazar/eliminar. | 6 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [bank-preview-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-preview-modal-bank-preview-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Vista previa" — monta la MISMA `BankCardComponent` que se renderiza en la landing pública (nunca una reconstrucción aparte), así la vista previa nunca se desincroniza de cómo se ve en producción. | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [catalog-bank-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-catalog-bank-table-catalog-bank-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de `NewsTableComponent`. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [catalog-banks-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-banks-page.component.ts`; usa 7 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-catalog-bank-table`, `app-bank-form-modal`, `app-bank-image-modal`. | — | — | Media |
| [catalog-banks-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-form-modal/bank-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [bank-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-form-modal/bank-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-image-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-image-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [bank-image-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-preview-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-preview-modal/bank-preview-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-preview-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-bank-card`, `app-button`. | — | — | Media |
| [bank-preview-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-preview-modal/bank-preview-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-bank-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/catalog-bank-table/catalog-bank-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-bank-table.component.ts`; usa 4 componentes hijos: `app-empty-state`, `app-button`, `app-icon`, `app-badge`. | — | — | Media |
| [catalog-bank-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/catalog-bank-table/catalog-bank-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts"></a>

### catalog-banks-page.component.ts

- **Ruta:** [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts`, 207 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-banks`
- **Responsabilidad:** "Sistema → Catálogo de Bancos" — catálogo público informativo (imagen, nombre, descripción, información adicional, orden, estado).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [catalog-bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-bank-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [catalog-bank-table.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-catalog-bank-table-catalog-bank-table-component-ts), [bank-form-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-form-modal-bank-form-modal-component-ts), [bank-image-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-image-modal-bank-image-modal-component-ts), [bank-preview-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-preview-modal-bank-preview-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [catalog-banks-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [catalog-bank-table.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-catalog-bank-table-catalog-bank-table-component-ts), [bank-form-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-form-modal-bank-form-modal-component-ts), [bank-image-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-image-modal-bank-image-modal-component-ts), [bank-preview-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-preview-modal-bank-preview-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="openCreateForm()"`, `(ngModelChange)="searchTerm.set($event)"`, `(click)="statusFilter.set(option.value)"`, `(edit)="openEditForm($event)"`, `(manageImage)="openImage($event)"`, `(preview)="openPreview($event)"`, `(toggleActive)="toggleActive($event)"`, `(moveUp)="moveUp($event)"`, `(moveDown)="moveDown($event)"`, `(clearFilters)="clearFilters()"`, `(addBank)="openCreateForm()"`, `(closed)="closeForm()"`, `(saved)="onBankSaved($event)"`, `(closed)="closeImage()"`, `(changed)="onImageChanged($event)"`

**Interfaces, tipos y enums:**

- `type StatusFilter` (L16) = `'all' \| 'active' \| 'inactive'`

#### Clase `CatalogBanksPageComponent` (L24–206)

- **Decoradores:** `@Component({ selector: 'app-catalog-banks-page', standalone: true, imports: [ FormsModule, PageHeaderComponent, ButtonComponent, IconComponent, CatalogBankTableC`
- **Propósito:** "Sistema → Catálogo de Bancos" — catálogo público informativo (imagen, nombre, descripción, información adicional, orden, estado). Nunca relacionado con el módulo financiero "Bancos" (Agentes Bancarios/Cuadre) — clon estructural de `NewsPageComponent`.
- **Servicios inyectados con `inject()`:** `catalogBankService = inject(CatalogBankService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `banks = signal<CatalogBank[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<StatusFilter>('all')`, `isFormOpen = signal(false)`, `editingBank = signal<CatalogBank \| null>(null)`, `imageBank = signal<CatalogBank \| null>(null)`, `previewBank = signal<CatalogBank \| null>(null)`, `filteredBanks = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed(() => this.searchTerm().trim().length > 0`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchBanks` | método public | 81–93 | — | `void` |
| `clearFilters` | método public | 95–98 | — | `void` |
| `openCreateForm` | método public | 100–103 | — | `void` |
| `openEditForm` | método public | 105–108 | `bank: CatalogBank` | `void` |
| `closeForm` | método public | 110–112 | — | `void` |
| `onBankSaved` | método public | 114–126 | `bank: CatalogBank` | `void` |
| `openImage` | método public | 128–130 | `bank: CatalogBank` | `void` |
| `closeImage` | método public | 132–134 | — | `void` |
| `onImageChanged` | método public | 136–139 | `bank: CatalogBank` | `void` |
| `openPreview` | método public | 141–143 | `bank: CatalogBank` | `void` |
| `closePreview` | método public | 145–147 | — | `void` |
| `toggleActive` | método public async | 149–172 | `bank: CatalogBank` | `Promise<void>` |
| `moveUp` | método public | 174–181 | `bank: CatalogBank` | `void` |
| `moveDown` | método public | 183–190 | `bank: CatalogBank` | `void` |
| `swapOrder` | método private | 192–205 | `list: CatalogBank[]`, `indexA: number`, `indexB: number` | `void` |

##### `CatalogBanksPageComponent.fetchBanks`

- **Firma:** `fetchBanks(): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L81) (L81–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.catalogBankService.getBanks(true).subscribe`, `this.catalogBankService.getBanks`, `this.banks.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.banks.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBanksPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L95) (L95–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `catalog-banks-page.component.html` (plantilla)

##### `CatalogBanksPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L100) (L100–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingBank.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingBank.set`, `this.isFormOpen.set`
- **Consumidores:** `catalog-banks-page.component.html` (plantilla)

##### `CatalogBanksPageComponent.openEditForm`

- **Firma:** `openEditForm(bank: CatalogBank): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L105) (L105–108)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingBank.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingBank.set`, `this.isFormOpen.set`
- **Consumidores:** `catalog-banks-page.component.html` (plantilla)

##### `CatalogBanksPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L110) (L110–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `catalog-banks-page.component.html` (plantilla)

##### `CatalogBanksPageComponent.onBankSaved`

- **Firma:** `onBankSaved(bank: CatalogBank): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L114) (L114–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingBank`, `this.isFormOpen.set`, `this.banks.update`, `list.map`, `this.notificationService.success`, `this.imageBank.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.banks.update`, `this.imageBank.set`
- **Consumidores:** `catalog-banks-page.component.html` (plantilla)

##### `CatalogBanksPageComponent.openImage`

- **Firma:** `openImage(bank: CatalogBank): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L128) (L128–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageBank.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageBank.set`
- **Consumidores:** `catalog-banks-page.component.html` (plantilla)

##### `CatalogBanksPageComponent.closeImage`

- **Firma:** `closeImage(): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L132) (L132–134)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageBank.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageBank.set`
- **Consumidores:** `catalog-banks-page.component.html` (plantilla)

##### `CatalogBanksPageComponent.onImageChanged`

- **Firma:** `onImageChanged(bank: CatalogBank): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L136) (L136–139)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageBank.set`, `this.banks.update`, `list.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageBank.set`, `this.banks.update`
- **Consumidores:** `catalog-banks-page.component.html` (plantilla)

##### `CatalogBanksPageComponent.openPreview`

- **Firma:** `openPreview(bank: CatalogBank): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L141) (L141–143)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.previewBank.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.previewBank.set`
- **Consumidores:** `catalog-banks-page.component.html` (plantilla)

##### `CatalogBanksPageComponent.closePreview`

- **Firma:** `closePreview(): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L145) (L145–147)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.previewBank.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.previewBank.set`
- **Consumidores:** `catalog-banks-page.component.html` (plantilla)

##### `CatalogBanksPageComponent.toggleActive`

- **Firma:** `toggleActive(bank: CatalogBank): Promise<void>` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L149) (L149–172)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.catalogBankService.activateBank`, `this.catalogBankService.deactivateBank`, `request$.subscribe`, `this.banks.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.banks.update`
- **Consumidores:** `catalog-banks-page.component.html` (plantilla)

##### `CatalogBanksPageComponent.moveUp`

- **Firma:** `moveUp(bank: CatalogBank): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L174) (L174–181)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.banks`, `list.findIndex`, `this.swapOrder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-banks-page.component.html` (plantilla)

##### `CatalogBanksPageComponent.moveDown`

- **Firma:** `moveDown(bank: CatalogBank): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L183) (L183–190)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.banks`, `list.findIndex`, `this.swapOrder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-banks-page.component.html` (plantilla)

##### `CatalogBanksPageComponent.swapOrder`

- **Firma:** `swapOrder(list: CatalogBank[], indexA: number, indexB: number): void` — [catalog-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/catalog-banks-page.component.ts#L192) (L192–205)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `reordered.map`, `this.catalogBankService.reorderBanks(items).subscribe`, `this.catalogBankService.reorderBanks`, `this.banks.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.banks.set`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-form-modal-bank-form-modal-component-ts"></a>

### bank-form-modal.component.ts

- **Ruta:** [bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-form-modal/bank-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-form-modal/bank-form-modal.component.ts`, 120 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-banks`
- **Responsabilidad:** Componente Angular: declara `BankFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [catalog-bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-bank-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [catalog-banks-page.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts), [banks-page.component.ts (plantilla)](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts) (plantilla), [catalog-banks-page.component.ts (plantilla)](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts) (plantilla)
- **Plantilla:** [bank-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-form-modal/bank-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `BankFormModalComponent` (L21–119)

- **Decoradores:** `@Component({ selector: 'app-bank-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './bank-form-modal.c`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `catalogBankService = inject(CatalogBankService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input bank = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<CatalogBank>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 50–52 | — | `boolean` |
| `ngOnChanges` | método public | 54–68 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 70–105 | — | `Promise<void>` |
| `close` | método public async | 107–118 | — | `Promise<void>` |

##### `BankFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-form-modal/bank-form-modal.component.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-form-modal/bank-form-modal.component.ts#L54) (L54–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-form-modal/bank-form-modal.component.ts#L70) (L70–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `raw.name.trim`, `raw.description.trim`, `raw.additionalInfo.trim`, `this.isSubmitting.set`, `this.catalogBankService.updateBank`, `this.catalogBankService.createBank`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `bank-form-modal.component.html` (plantilla)

##### `BankFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-form-modal/bank-form-modal.component.ts#L107) (L107–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `bank-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-image-modal-bank-image-modal-component-ts"></a>

### bank-image-modal.component.ts

- **Ruta:** [bank-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.ts`, 111 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-banks`
- **Responsabilidad:** Gestor de la imagen principal de un banco — subir/reemplazar/eliminar.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [catalog-bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-bank-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [catalog-banks-page.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts), [catalog-banks-page.component.ts (plantilla)](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts) (plantilla)
- **Plantilla:** [bank-image-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(change)="onFileSelected($event)"`, `(click)="removeImage()"`

#### Clase `BankImageModalComponent` (L14–110)

- **Decoradores:** `@Component({ selector: 'app-bank-image-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './bank-image-modal.component.html', sty`
- **Propósito:** Gestor de la imagen principal de un banco — subir/reemplazar/eliminar. Clon de `NewsImageModalComponent`.
- **Servicios inyectados con `inject()`:** `catalogBankService = inject(CatalogBankService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input bank = null`, `@Output closed = new EventEmitter<void>()`, `@Output changed = new EventEmitter<CatalogBank>()`, `isUploading = signal(false)`, `isRemoving = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 35–37 | — | `boolean` |
| `imageUrl` | getter public | 39–41 | — | `string \| null` |
| `onFileSelected` | método public | 43–68 | `event: Event` | `void` |
| `removeImage` | método public async | 70–92 | — | `Promise<void>` |
| `close` | método public | 94–96 | — | `void` |
| `refetch` | método private | 98–109 | `bankId: string`, `done?: () => void` | `void` |

##### `BankImageModalComponent.open`

- **Firma:** `open(): boolean` — [bank-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankImageModalComponent.imageUrl`

- **Firma:** `imageUrl(): string \| null` — [bank-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogBankService.getImageUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankImageModalComponent.onFileSelected`

- **Firma:** `onFileSelected(event: Event): void` — [bank-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.ts#L43) (L43–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `file.type.startsWith`, `this.notificationService.error`, `this.isUploading.set`, `this.catalogBankService.setImage(bank.id, file).subscribe`, `this.catalogBankService.setImage`, `this.refetch`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isUploading.set`
- **Consumidores:** `bank-image-modal.component.html` (plantilla)

##### `BankImageModalComponent.removeImage`

- **Firma:** `removeImage(): Promise<void>` — [bank-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.ts#L70) (L70–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.isRemoving.set`, `this.catalogBankService.removeImage(bank.id).subscribe`, `this.catalogBankService.removeImage`, `this.refetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isRemoving.set`
- **Consumidores:** `bank-image-modal.component.html` (plantilla)

##### `BankImageModalComponent.close`

- **Firma:** `close(): void` — [bank-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.ts#L94) (L94–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `bank-image-modal.component.html` (plantilla)

##### `BankImageModalComponent.refetch`

- **Firma:** `refetch(bankId: string, done?: () => void): void` — [bank-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.ts#L98) (L98–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogBankService.getBankById(bankId).subscribe`, `this.catalogBankService.getBankById`, `done`, `this.changed.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Emite eventos: `this.changed.emit`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-preview-modal-bank-preview-modal-component-ts"></a>

### bank-preview-modal.component.ts

- **Ruta:** [bank-preview-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-preview-modal/bank-preview-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-preview-modal/bank-preview-modal.component.ts`, 56 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-banks`
- **Responsabilidad:** "Vista previa" — monta la MISMA `BankCardComponent` que se renderiza en la landing pública (nunca una reconstrucción aparte), así la vista previa nunca se desincroniza de cómo se ve en producción.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-card-bank-card-component-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [catalog-banks-page.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts), [catalog-banks-page.component.ts (plantilla)](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts) (plantilla)
- **Plantilla:** [bank-preview-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-preview-modal/bank-preview-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [bank-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-card-bank-card-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`, `(click)="toggleFace()"`

#### Clase `BankPreviewModalComponent` (L14–55)

- **Decoradores:** `@Component({ selector: 'app-bank-preview-modal', standalone: true, imports: [BankCardComponent, ButtonComponent, IconComponent], templateUrl: './bank-preview-mod`
- **Propósito:** "Vista previa" — monta la MISMA `BankCardComponent` que se renderiza en la landing pública (nunca una reconstrucción aparte), así la vista previa nunca se desincroniza de cómo se ve en producción. `forceFlipped` le permite al admin alternar frente/reverso con un botón, sin depender del clic normal de la card.
- **Datos / estado que administra:** `@Input bank = null`, `@Output closed = new EventEmitter<void>()`, `showBack = signal(false)`, `previewBank = computed<PublicCatalogBank \| null>(() => { const b`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 43–45 | — | `boolean` |
| `toggleFace` | método public | 47–49 | — | `void` |
| `close` | método public | 51–54 | — | `void` |

##### `BankPreviewModalComponent.open`

- **Firma:** `open(): boolean` — [bank-preview-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-preview-modal/bank-preview-modal.component.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankPreviewModalComponent.toggleFace`

- **Firma:** `toggleFace(): void` — [bank-preview-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-preview-modal/bank-preview-modal.component.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.showBack.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.showBack.update`
- **Consumidores:** `bank-preview-modal.component.html` (plantilla)

##### `BankPreviewModalComponent.close`

- **Firma:** `close(): void` — [bank-preview-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-preview-modal/bank-preview-modal.component.ts#L51) (L51–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.showBack.set`, `this.closed.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.showBack.set`; Emite eventos: `this.closed.emit`
- **Consumidores:** `bank-preview-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-catalog-bank-table-catalog-bank-table-component-ts"></a>

### catalog-bank-table.component.ts

- **Ruta:** [catalog-bank-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/catalog-bank-table/catalog-bank-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/catalog-bank-table/catalog-bank-table.component.ts`, 33 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-banks`
- **Responsabilidad:** Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de `NewsTableComponent`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [catalog-banks-page.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts), [catalog-banks-page.component.ts (plantilla)](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts) (plantilla)
- **Plantilla:** [catalog-bank-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/catalog-bank-table/catalog-bank-table.component.html) · **Usa componentes:** [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addBank.emit()"`, `(click)="moveUp.emit(bank)"`, `(click)="moveDown.emit(bank)"`, `(click)="edit.emit(bank)"`, `(click)="manageImage.emit(bank)"`, `(click)="preview.emit(bank)"`, `(click)="toggleActive.emit(bank)"`

#### Clase `CatalogBankTableComponent` (L9–32)

- **Decoradores:** `@Component({ selector: 'app-catalog-bank-table', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl: '`
- **Propósito:** Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de `NewsTableComponent`.
- **Datos / estado que administra:** `@Input banks = []`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Output edit = new EventEmitter<CatalogBank>()`, `@Output manageImage = new EventEmitter<CatalogBank>()`, `@Output preview = new EventEmitter<CatalogBank>()`, `@Output toggleActive = new EventEmitter<CatalogBank>()`, `@Output moveUp = new EventEmitter<CatalogBank>()`, `@Output moveDown = new EventEmitter<CatalogBank>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addBank = new EventEmitter<void>()`
