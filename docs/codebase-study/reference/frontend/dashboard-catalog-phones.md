# Frontend `dashboard-catalog-phones`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [catalog-phones-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Catálogo → Teléfonos" — administración completa de la vitrina comercial pública. | 9 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [catalog-phone-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-form-modal-catalog-phone-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CatalogPhoneFormModalComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [catalog-phone-images-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-images-modal-catalog-phone-images-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Gestor de fotos de un teléfono del catálogo — subir/eliminar/marcar principal. | 6 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [catalog-phone-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-table-catalog-phone-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Orden fijo por `sortOrder` (subir/bajar) — sin sorting de columnas, a diferencia de Clientes/Categorías, porque el orden en sí es un dato administrable. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [catalog-phones-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-phones-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-catalog-phone-table`, `app-catalog-phone-form-modal`, `app-catalog-phone-images-modal`. | — | — | Media |
| [catalog-phones-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-phone-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-phone-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [catalog-phone-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-phone-images-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-phone-images-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [catalog-phone-images-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-phone-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-table/catalog-phone-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-phone-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [catalog-phone-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-table/catalog-phone-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts"></a>

### catalog-phones-page.component.ts

- **Ruta:** [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts`, 238 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-phones`
- **Responsabilidad:** "Catálogo → Teléfonos" — administración completa de la vitrina comercial pública.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [catalog-phone.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-phone-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [catalog-phone-table.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-table-catalog-phone-table-component-ts), [catalog-phone-form-modal.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-form-modal-catalog-phone-form-modal-component-ts), [catalog-phone-images-modal.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-images-modal-catalog-phone-images-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [catalog-phones-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [catalog-phone-table.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-table-catalog-phone-table-component-ts), [catalog-phone-form-modal.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-form-modal-catalog-phone-form-modal-component-ts), [catalog-phone-images-modal.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-images-modal-catalog-phone-images-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="openCreateForm()"`, `(ngModelChange)="searchTerm.set($event)"`, `(click)="statusFilter.set(option.value)"`, `(edit)="openEditForm($event)"`, `(manageImages)="openImages($event)"`, `(toggleActive)="toggleActive($event)"`, `(togglePublish)="togglePublish($event)"`, `(moveUp)="moveUp($event)"`, `(moveDown)="moveDown($event)"`, `(clearFilters)="clearFilters()"`, `(addPhone)="openCreateForm()"`, `(closed)="closeForm()"`, `(saved)="onPhoneSaved($event)"`, `(closed)="closeImages()"`, `(changed)="onImagesChanged($event)"`

**Interfaces, tipos y enums:**

- `type StatusFilter` (L15) = `'all' \| 'active' \| 'inactive' \| 'published' \| 'unpublished'`

#### Clase `CatalogPhonesPageComponent` (L24–237)

- **Decoradores:** `@Component({ selector: 'app-catalog-phones-page', standalone: true, imports: [ FormsModule, PageHeaderComponent, ButtonComponent, IconComponent, CatalogPhoneTabl`
- **Propósito:** "Catálogo → Teléfonos" — administración completa de la vitrina comercial pública. Ruta ya `adminGuard`-gated en `app.routes.ts` (todo el `CatalogPhonesController` es admin-only en el backend, incluido el listado, porque expone teléfonos no publicados) — sin `canManage`, mismo "ya inalcanzable para un no-admin" que Usuarios/Roles.
- **Servicios inyectados con `inject()`:** `catalogPhoneService = inject(CatalogPhoneService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `phones = signal<CatalogPhone[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<StatusFilter>('all')`, `isFormOpen = signal(false)`, `editingPhone = signal<CatalogPhone \| null>(null)`, `imagesPhone = signal<CatalogPhone \| null>(null)`, `filteredPhones = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed(() => this.searchTerm().trim().length > 0`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchPhones` | método public | 87–99 | — | `void` |
| `clearFilters` | método public | 101–104 | — | `void` |
| `openCreateForm` | método public | 106–109 | — | `void` |
| `openEditForm` | método public | 111–114 | `phone: CatalogPhone` | `void` |
| `closeForm` | método public | 116–118 | — | `void` |
| `onPhoneSaved` | método public | 120–136 | `phone: CatalogPhone` | `void` |
| `openImages` | método public | 138–140 | `phone: CatalogPhone` | `void` |
| `closeImages` | método public | 142–144 | — | `void` |
| `onImagesChanged` | método public | 146–149 | `phone: CatalogPhone` | `void` |
| `toggleActive` | método public async | 151–178 | `phone: CatalogPhone` | `Promise<void>` |
| `togglePublish` | método public async | 180–203 | `phone: CatalogPhone` | `Promise<void>` |
| `moveUp` | método public | 205–212 | `phone: CatalogPhone` | `void` |
| `moveDown` | método public | 214–221 | `phone: CatalogPhone` | `void` |
| `swapOrder` | método private | 223–236 | `list: CatalogPhone[]`, `indexA: number`, `indexB: number` | `void` |

##### `CatalogPhonesPageComponent.fetchPhones`

- **Firma:** `fetchPhones(): void` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L87) (L87–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.catalogPhoneService.getPhones(true).subscribe`, `this.catalogPhoneService.getPhones`, `this.phones.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.phones.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhonesPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L101) (L101–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `catalog-phones-page.component.html` (plantilla)

##### `CatalogPhonesPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L106) (L106–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingPhone.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingPhone.set`, `this.isFormOpen.set`
- **Consumidores:** `catalog-phones-page.component.html` (plantilla)

##### `CatalogPhonesPageComponent.openEditForm`

- **Firma:** `openEditForm(phone: CatalogPhone): void` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L111) (L111–114)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingPhone.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingPhone.set`, `this.isFormOpen.set`
- **Consumidores:** `catalog-phones-page.component.html` (plantilla)

##### `CatalogPhonesPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L116) (L116–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `catalog-phones-page.component.html` (plantilla)

##### `CatalogPhonesPageComponent.onPhoneSaved`

- **Firma:** `onPhoneSaved(phone: CatalogPhone): void` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L120) (L120–136)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingPhone`, `this.isFormOpen.set`, `this.phones.update`, `list.map`, `this.notificationService.success`, `this.imagesPhone.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.phones.update`, `this.imagesPhone.set`
- **Consumidores:** `catalog-phones-page.component.html` (plantilla)

##### `CatalogPhonesPageComponent.openImages`

- **Firma:** `openImages(phone: CatalogPhone): void` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L138) (L138–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imagesPhone.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.imagesPhone.set`
- **Consumidores:** `catalog-phones-page.component.html` (plantilla)

##### `CatalogPhonesPageComponent.closeImages`

- **Firma:** `closeImages(): void` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L142) (L142–144)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imagesPhone.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.imagesPhone.set`
- **Consumidores:** `catalog-phones-page.component.html` (plantilla)

##### `CatalogPhonesPageComponent.onImagesChanged`

- **Firma:** `onImagesChanged(phone: CatalogPhone): void` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L146) (L146–149)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imagesPhone.set`, `this.phones.update`, `list.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.imagesPhone.set`, `this.phones.update`
- **Consumidores:** `catalog-phones-page.component.html` (plantilla)

##### `CatalogPhonesPageComponent.toggleActive`

- **Firma:** `toggleActive(phone: CatalogPhone): Promise<void>` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L151) (L151–178)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.catalogPhoneService.activatePhone`, `this.catalogPhoneService.deactivatePhone`, `request$.subscribe`, `this.phones.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.phones.update`
- **Consumidores:** `catalog-phones-page.component.html` (plantilla)

##### `CatalogPhonesPageComponent.togglePublish`

- **Firma:** `togglePublish(phone: CatalogPhone): Promise<void>` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L180) (L180–203)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.catalogPhoneService.publishPhone`, `this.catalogPhoneService.unpublishPhone`, `request$.subscribe`, `this.phones.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.phones.update`
- **Consumidores:** `catalog-phones-page.component.html` (plantilla)

##### `CatalogPhonesPageComponent.moveUp`

- **Firma:** `moveUp(phone: CatalogPhone): void` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L205) (L205–212)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.phones`, `list.findIndex`, `this.swapOrder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-phones-page.component.html` (plantilla)

##### `CatalogPhonesPageComponent.moveDown`

- **Firma:** `moveDown(phone: CatalogPhone): void` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L214) (L214–221)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.phones`, `list.findIndex`, `this.swapOrder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-phones-page.component.html` (plantilla)

##### `CatalogPhonesPageComponent.swapOrder`

- **Firma:** `swapOrder(list: CatalogPhone[], indexA: number, indexB: number): void` — [catalog-phones-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts#L223) (L223–236)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `reordered.map`, `this.catalogPhoneService.reorderPhones(items).subscribe`, `this.catalogPhoneService.reorderPhones`, `this.phones.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.phones.set`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-form-modal-catalog-phone-form-modal-component-ts"></a>

### catalog-phone-form-modal.component.ts

- **Ruta:** [catalog-phone-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts`, 170 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-phones`
- **Responsabilidad:** Componente Angular: declara `CatalogPhoneFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [catalog-phone.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-phone-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [catalog-phones-page.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts), [catalog-phones-page.component.ts (plantilla)](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts) (plantilla)
- **Plantilla:** [catalog-phone-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`, `(click)="addExtraSpec()"`, `(click)="removeExtraSpec(i)"`

#### Clase `CatalogPhoneFormModalComponent` (L21–169)

- **Decoradores:** `@Component({ selector: 'app-catalog-phone-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './catalog-`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `catalogPhoneService = inject(CatalogPhoneService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input phone = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<CatalogPhone>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 59–61 | — | `boolean` |
| `extraSpecs` | getter public | 63–65 | — | `FormArray` |
| `buildExtraSpecGroup` | método private | 67–72 | `label?`, `value?` | (inferido) |
| `addExtraSpec` | método public | 74–76 | — | `void` |
| `removeExtraSpec` | método public | 78–80 | `index: number` | `void` |
| `ngOnChanges` | método public | 82–109 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 111–155 | — | `Promise<void>` |
| `close` | método public async | 157–168 | — | `Promise<void>` |

##### `CatalogPhoneFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [catalog-phone-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhoneFormModalComponent.extraSpecs`

- **Firma:** `extraSpecs(): FormArray` — [catalog-phone-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhoneFormModalComponent.buildExtraSpecGroup`

- **Firma:** `buildExtraSpecGroup(label?, value?)` — [catalog-phone-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts#L67) (L67–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.fb.nonNullable.group`, `Validators.maxLength`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `CatalogPhoneFormModalComponent.addExtraSpec`

- **Firma:** `addExtraSpec(): void` — [catalog-phone-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.extraSpecs.push`, `this.buildExtraSpecGroup`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-phone-form-modal.component.html` (plantilla)

##### `CatalogPhoneFormModalComponent.removeExtraSpec`

- **Firma:** `removeExtraSpec(index: number): void` — [catalog-phone-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.extraSpecs.removeAt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-phone-form-modal.component.html` (plantilla)

##### `CatalogPhoneFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [catalog-phone-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts#L82) (L82–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.extraSpecs.clear`, `this.form.reset`, `this.extraSpecs.push`, `this.buildExtraSpecGroup`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhoneFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [catalog-phone-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts#L111) (L111–155)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `raw.brand.trim`, `raw.model.trim`, `raw.description.trim`, `raw.screen.trim`, `raw.ram.trim`, `raw.storage.trim`, `raw.camera.trim`, `raw.battery.trim`, `raw.processor.trim`, `raw.operatingSystem.trim`, `raw.extraSpecs.map`, `spec.label.trim`, `spec.value.trim`…
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `catalog-phone-form-modal.component.html` (plantilla)

##### `CatalogPhoneFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [catalog-phone-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts#L157) (L157–168)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `catalog-phone-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-images-modal-catalog-phone-images-modal-component-ts"></a>

### catalog-phone-images-modal.component.ts

- **Ruta:** [catalog-phone-images-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.ts`, 124 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-phones`
- **Responsabilidad:** Gestor de fotos de un teléfono del catálogo — subir/eliminar/marcar principal.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [catalog-phone.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-phone-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [catalog-phones-page.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts), [catalog-phones-page.component.ts (plantilla)](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts) (plantilla)
- **Plantilla:** [catalog-phone-images-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(click)="setPrimary(image.id)"`, `(click)="removeImage(image.id)"`, `(change)="onFileSelected($event)"`

#### Clase `CatalogPhoneImagesModalComponent` (L14–123)

- **Decoradores:** `@Component({ selector: 'app-catalog-phone-images-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './catalog-phone-images-modal.`
- **Propósito:** Gestor de fotos de un teléfono del catálogo — subir/eliminar/marcar principal. Un teléfono solo puede publicarse con al menos una imagen (validado también en el backend).
- **Servicios inyectados con `inject()`:** `catalogPhoneService = inject(CatalogPhoneService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input phone = null`, `@Output closed = new EventEmitter<void>()`, `@Output changed = new EventEmitter<CatalogPhone>()`, `isUploading = signal(false)`, `removingImageId = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 35–37 | — | `boolean` |
| `imageUrl` | método public | 39–41 | `imageId: string` | `string` |
| `onFileSelected` | método public | 43–68 | `event: Event` | `void` |
| `removeImage` | método public async | 70–92 | `imageId: string` | `Promise<void>` |
| `setPrimary` | método public | 94–105 | `imageId: string` | `void` |
| `close` | método public | 107–109 | — | `void` |
| `refetch` | método private | 111–122 | `phoneId: string`, `done?: () => void` | `void` |

##### `CatalogPhoneImagesModalComponent.open`

- **Firma:** `open(): boolean` — [catalog-phone-images-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhoneImagesModalComponent.imageUrl`

- **Firma:** `imageUrl(imageId: string): string` — [catalog-phone-images-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogPhoneService.getImageUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-phone-images-modal.component.html` (plantilla)

##### `CatalogPhoneImagesModalComponent.onFileSelected`

- **Firma:** `onFileSelected(event: Event): void` — [catalog-phone-images-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.ts#L43) (L43–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `file.type.startsWith`, `this.notificationService.error`, `this.isUploading.set`, `this.catalogPhoneService.addImage(phone.id, file).subscribe`, `this.catalogPhoneService.addImage`, `this.refetch`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isUploading.set`
- **Consumidores:** `catalog-phone-images-modal.component.html` (plantilla)

##### `CatalogPhoneImagesModalComponent.removeImage`

- **Firma:** `removeImage(imageId: string): Promise<void>` — [catalog-phone-images-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.ts#L70) (L70–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.removingImageId.set`, `this.catalogPhoneService.removeImage(phone.id, imageId).subscribe`, `this.catalogPhoneService.removeImage`, `this.refetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.removingImageId.set`
- **Consumidores:** `catalog-phone-images-modal.component.html` (plantilla)

##### `CatalogPhoneImagesModalComponent.setPrimary`

- **Firma:** `setPrimary(imageId: string): void` — [catalog-phone-images-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.ts#L94) (L94–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogPhoneService.setPrimaryImage(phone.id, imageId).subscribe`, `this.catalogPhoneService.setPrimaryImage`, `this.refetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-phone-images-modal.component.html` (plantilla)

##### `CatalogPhoneImagesModalComponent.close`

- **Firma:** `close(): void` — [catalog-phone-images-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.ts#L107) (L107–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `catalog-phone-images-modal.component.html` (plantilla)

##### `CatalogPhoneImagesModalComponent.refetch`

- **Firma:** `refetch(phoneId: string, done?: () => void): void` — [catalog-phone-images-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.ts#L111) (L111–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogPhoneService.getPhoneById(phoneId).subscribe`, `this.catalogPhoneService.getPhoneById`, `done`, `this.changed.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Emite eventos: `this.changed.emit`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-table-catalog-phone-table-component-ts"></a>

### catalog-phone-table.component.ts

- **Ruta:** [catalog-phone-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-table/catalog-phone-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-table/catalog-phone-table.component.ts`, 37 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-phones`
- **Responsabilidad:** Orden fijo por `sortOrder` (subir/bajar) — sin sorting de columnas, a diferencia de Clientes/Categorías, porque el orden en sí es un dato administrable.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [catalog-phones-page.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts), [catalog-phones-page.component.ts (plantilla)](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts) (plantilla)
- **Plantilla:** [catalog-phone-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-table/catalog-phone-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addPhone.emit()"`, `(click)="moveUp.emit(phone)"`, `(click)="moveDown.emit(phone)"`, `(click)="edit.emit(phone)"`, `(click)="manageImages.emit(phone)"`, `(click)="togglePublish.emit(phone)"`, `(click)="toggleActive.emit(phone)"`

#### Clase `CatalogPhoneTableComponent` (L9–36)

- **Decoradores:** `@Component({ selector: 'app-catalog-phone-table', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl: `
- **Propósito:** Orden fijo por `sortOrder` (subir/bajar) — sin sorting de columnas, a diferencia de Clientes/Categorías, porque el orden en sí es un dato administrable.
- **Datos / estado que administra:** `@Input phones = []`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Output edit = new EventEmitter<CatalogPhone>()`, `@Output manageImages = new EventEmitter<CatalogPhone>()`, `@Output toggleActive = new EventEmitter<CatalogPhone>()`, `@Output togglePublish = new EventEmitter<CatalogPhone>()`, `@Output moveUp = new EventEmitter<CatalogPhone>()`, `@Output moveDown = new EventEmitter<CatalogPhone>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addPhone = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `formatPrice` | método public | 33–35 | `price: number` | `string` |

##### `CatalogPhoneTableComponent.formatPrice`

- **Firma:** `formatPrice(price: number): string` — [catalog-phone-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-table/catalog-phone-table.component.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `price.toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-phone-table.component.html` (plantilla)

