# Frontend `dashboard-catalog-products`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [catalog-products-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Catálogo → Librería" / "Variedades y Accesorios" — un solo componente reutilizado por ambas rutas, parametrizado por `route.data['section']`. | 9 internas; ext.: @angular/common, @angular/core, @angular/forms, @angular/router | 1 | Baja (1 consumidores) |
| [catalog-product-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-form-modal-catalog-product-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Publicar/editar una fila de "Librería"/"Variedades y Accesorios" — nunca duplica el producto: en modo creación busca un producto YA existente en Inventario (búsqueda con debounce, copia local del patrón de `ProductSearchComponent` de Ventas) y solo referencia su `id`; en modo edición el producto es fijo (solo se edita la descripción de catálogo). | 6 internas; ext.: @angular/common, @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [catalog-product-image-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-image-modal-catalog-product-image-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Gestor de la imagen única de una publicación de catálogo (Librería/Variedades) — subir/reemplazar/eliminar. | 6 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [catalog-product-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-table-catalog-product-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de Teléfonos, sin sorting de columnas. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [catalog-products-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-products-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-catalog-product-table`, `app-catalog-product-form-modal`, `app-catalog-product-image-modal`. | — | — | Media |
| [catalog-products-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-product-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-product-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [catalog-product-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-product-image-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-product-image-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [catalog-product-image-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-product-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-table/catalog-product-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-product-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [catalog-product-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-table/catalog-product-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts"></a>

### catalog-products-page.component.ts

- **Ruta:** [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts`, 232 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-products`
- **Responsabilidad:** "Catálogo → Librería" / "Variedades y Accesorios" — un solo componente reutilizado por ambas rutas, parametrizado por `route.data['section']`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [catalog-product.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-product-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [catalog-product-table.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-table-catalog-product-table-component-ts), [catalog-product-form-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-form-modal-catalog-product-form-modal-component-ts), [catalog-product-image-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-image-modal-catalog-product-image-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/router`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [catalog-products-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [catalog-product-table.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-table-catalog-product-table-component-ts), [catalog-product-form-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-form-modal-catalog-product-form-modal-component-ts), [catalog-product-image-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-image-modal-catalog-product-image-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="openCreateForm()"`, `(ngModelChange)="searchTerm.set($event)"`, `(click)="statusFilter.set(option.value)"`, `(edit)="openEditForm($event)"`, `(manageImage)="openImage($event)"`, `(toggleActive)="toggleActive($event)"`, `(moveUp)="moveUp($event)"`, `(moveDown)="moveDown($event)"`, `(clearFilters)="clearFilters()"`, `(addProduct)="openCreateForm()"`, `(closed)="closeForm()"`, `(saved)="onProductSaved($event)"`, `(closed)="closeImage()"`, `(changed)="onImageChanged($event)"`

**Interfaces, tipos y enums:**

- `type StatusFilter` (L16) = `'all' \| 'active' \| 'inactive'`

#### Clase `CatalogProductsPageComponent` (L47–231)

- **Decoradores:** `@Component({ selector: 'app-catalog-products-page', standalone: true, imports: [ FormsModule, PageHeaderComponent, ButtonComponent, IconComponent, CatalogProduct`
- **Propósito:** "Catálogo → Librería" / "Variedades y Accesorios" — un solo componente reutilizado por ambas rutas, parametrizado por `route.data['section']`. Admin-only (todo `CatalogProductsController` lo es en el backend, incluido el listado, porque expone publicaciones inactivas), ya `adminGuard`-gated en `app.routes.ts`.
- **Servicios inyectados con `inject()`:** `route = inject(ActivatedRoute)`, `catalogProductService = inject(CatalogProductService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `products = signal<CatalogProduct[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<StatusFilter>('all')`, `isFormOpen = signal(false)`, `editingProduct = signal<CatalogProduct \| null>(null)`, `imageProduct = signal<CatalogProduct \| null>(null)`, `filteredProducts = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed(() => this.searchTerm().trim().length > 0`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchProducts` | método public | 108–120 | — | `void` |
| `clearFilters` | método public | 122–125 | — | `void` |
| `openCreateForm` | método public | 127–130 | — | `void` |
| `openEditForm` | método public | 132–135 | `product: CatalogProduct` | `void` |
| `closeForm` | método public | 137–139 | — | `void` |
| `onProductSaved` | método public | 141–157 | `product: CatalogProduct` | `void` |
| `openImage` | método public | 159–161 | `product: CatalogProduct` | `void` |
| `closeImage` | método public | 163–165 | — | `void` |
| `onImageChanged` | método public | 167–170 | `product: CatalogProduct` | `void` |
| `toggleActive` | método public async | 172–197 | `product: CatalogProduct` | `Promise<void>` |
| `moveUp` | método public | 199–206 | `product: CatalogProduct` | `void` |
| `moveDown` | método public | 208–215 | `product: CatalogProduct` | `void` |
| `swapOrder` | método private | 217–230 | `list: CatalogProduct[]`, `indexA: number`, `indexB: number` | `void` |

##### `CatalogProductsPageComponent.fetchProducts`

- **Firma:** `fetchProducts(): void` — [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts#L108) (L108–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.catalogProductService.getProducts(this.section, true).subscribe`, `this.catalogProductService.getProducts`, `this.products.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.products.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductsPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts#L122) (L122–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `catalog-products-page.component.html` (plantilla)

##### `CatalogProductsPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts#L127) (L127–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingProduct.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingProduct.set`, `this.isFormOpen.set`
- **Consumidores:** `catalog-products-page.component.html` (plantilla)

##### `CatalogProductsPageComponent.openEditForm`

- **Firma:** `openEditForm(product: CatalogProduct): void` — [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts#L132) (L132–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingProduct.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingProduct.set`, `this.isFormOpen.set`
- **Consumidores:** `catalog-products-page.component.html` (plantilla)

##### `CatalogProductsPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts#L137) (L137–139)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `catalog-products-page.component.html` (plantilla)

##### `CatalogProductsPageComponent.onProductSaved`

- **Firma:** `onProductSaved(product: CatalogProduct): void` — [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts#L141) (L141–157)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingProduct`, `this.isFormOpen.set`, `this.products.update`, `list.map`, `this.notificationService.success`, `this.imageProduct.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.products.update`, `this.imageProduct.set`
- **Consumidores:** `catalog-products-page.component.html` (plantilla)

##### `CatalogProductsPageComponent.openImage`

- **Firma:** `openImage(product: CatalogProduct): void` — [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts#L159) (L159–161)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageProduct.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageProduct.set`
- **Consumidores:** `catalog-products-page.component.html` (plantilla)

##### `CatalogProductsPageComponent.closeImage`

- **Firma:** `closeImage(): void` — [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts#L163) (L163–165)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageProduct.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageProduct.set`
- **Consumidores:** `catalog-products-page.component.html` (plantilla)

##### `CatalogProductsPageComponent.onImageChanged`

- **Firma:** `onImageChanged(product: CatalogProduct): void` — [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts#L167) (L167–170)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageProduct.set`, `this.products.update`, `list.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageProduct.set`, `this.products.update`
- **Consumidores:** `catalog-products-page.component.html` (plantilla)

##### `CatalogProductsPageComponent.toggleActive`

- **Firma:** `toggleActive(product: CatalogProduct): Promise<void>` — [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts#L172) (L172–197)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.catalogProductService.activateProduct`, `this.catalogProductService.deactivateProduct`, `request$.subscribe`, `this.products.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.products.update`
- **Consumidores:** `catalog-products-page.component.html` (plantilla)

##### `CatalogProductsPageComponent.moveUp`

- **Firma:** `moveUp(product: CatalogProduct): void` — [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts#L199) (L199–206)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.products`, `list.findIndex`, `this.swapOrder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-products-page.component.html` (plantilla)

##### `CatalogProductsPageComponent.moveDown`

- **Firma:** `moveDown(product: CatalogProduct): void` — [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts#L208) (L208–215)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.products`, `list.findIndex`, `this.swapOrder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-products-page.component.html` (plantilla)

##### `CatalogProductsPageComponent.swapOrder`

- **Firma:** `swapOrder(list: CatalogProduct[], indexA: number, indexB: number): void` — [catalog-products-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts#L217) (L217–230)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `reordered.map`, `this.catalogProductService.reorderProducts(items).subscribe`, `this.catalogProductService.reorderProducts`, `this.products.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.products.set`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-form-modal-catalog-product-form-modal-component-ts"></a>

### catalog-product-form-modal.component.ts

- **Ruta:** [catalog-product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.ts`, 183 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-products`
- **Responsabilidad:** Publicar/editar una fila de "Librería"/"Variedades y Accesorios" — nunca duplica el producto: en modo creación busca un producto YA existente en Inventario (búsqueda con debounce, copia local del patrón de `ProductSearchComponent` de Ventas) y solo referencia su `id`; en modo edición el producto es fijo (solo se edita la descripción de catálogo).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [catalog-product.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-product-service-ts), [inventory.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-inventory-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [catalog-products-page.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts), [catalog-products-page.component.ts (plantilla)](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts) (plantilla)
- **Plantilla:** [catalog-product-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`, `(click)="clearSelectedProduct()"`, `(ngModelChange)="onQueryInput($event)"`, `(focus)="dropdownOpen.set(true)"`, `(click)="selectProduct(result)"`

#### Clase `CatalogProductFormModalComponent` (L31–182)

- **Decoradores:** `@Component({ selector: 'app-catalog-product-form-modal', standalone: true, imports: [FormsModule, ReactiveFormsModule, ButtonComponent, IconComponent], templateU`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Publicar/editar una fila de "Librería"/"Variedades y Accesorios" — nunca duplica el producto: en modo creación busca un producto YA existente en Inventario (búsqueda con debounce, copia local del patrón de `ProductSearchComponent` de Ventas) y solo referencia su `id`; en modo edición el producto es fijo (solo se edita la descripción de catálogo).
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `catalogProductService = inject(CatalogProductService)`, `inventoryService = inject(InventoryService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input product = null`, `@Input section: CatalogProductSection`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<CatalogProduct>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`, `selectedProduct = signal<Product \| null>(null)`, `query = signal('')`, `results = signal<Product[]>([])`, `searching = signal(false)`, `dropdownOpen = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 89–91 | — | `boolean` |
| `ngOnChanges` | método public | 93–106 | `changes: SimpleChanges` | `void` |
| `onQueryInput` | método public | 108–115 | `value: string` | `void` |
| `selectProduct` | método public | 117–122 | `product: Product` | `void` |
| `clearSelectedProduct` | método public | 124–127 | — | `void` |
| `submit` | método public async | 129–168 | — | `Promise<void>` |
| `close` | método public async | 170–181 | — | `Promise<void>` |

##### `CatalogProductFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [catalog-product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.ts#L89) (L89–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [catalog-product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.ts#L93) (L93–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.selectedProduct.set`, `this.query.set`, `this.results.set`, `this.dropdownOpen.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`, `this.selectedProduct.set`, `this.query.set`, `this.results.set`, `this.dropdownOpen.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductFormModalComponent.onQueryInput`

- **Firma:** `onQueryInput(value: string): void` — [catalog-product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.ts#L108) (L108–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.dropdownOpen.set`, `this.query$.next`, `value.trim`, `this.results.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.dropdownOpen.set`, `this.results.set`
- **Consumidores:** `catalog-product-form-modal.component.html` (plantilla)

##### `CatalogProductFormModalComponent.selectProduct`

- **Firma:** `selectProduct(product: Product): void` — [catalog-product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.ts#L117) (L117–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedProduct.set`, `this.query.set`, `this.results.set`, `this.dropdownOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedProduct.set`, `this.query.set`, `this.results.set`, `this.dropdownOpen.set`
- **Consumidores:** `catalog-product-form-modal.component.html` (plantilla)

##### `CatalogProductFormModalComponent.clearSelectedProduct`

- **Firma:** `clearSelectedProduct(): void` — [catalog-product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.ts#L124) (L124–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedProduct.set`, `this.query.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedProduct.set`, `this.query.set`
- **Consumidores:** `catalog-product-form-modal.component.html` (plantilla)

##### `CatalogProductFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [catalog-product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.ts#L129) (L129–168)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.selectedProduct`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `raw.catalogDescription.trim`, `this.isSubmitting.set`, `this.catalogProductService.updateProduct`, `this.catalogProductService.createProduct`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `catalog-product-form-modal.component.html` (plantilla)

##### `CatalogProductFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [catalog-product-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.ts#L170) (L170–181)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.selectedProduct`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `catalog-product-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-image-modal-catalog-product-image-modal-component-ts"></a>

### catalog-product-image-modal.component.ts

- **Ruta:** [catalog-product-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.ts`, 111 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-products`
- **Responsabilidad:** Gestor de la imagen única de una publicación de catálogo (Librería/Variedades) — subir/reemplazar/eliminar.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [catalog-product.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-product-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [catalog-products-page.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts), [catalog-products-page.component.ts (plantilla)](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts) (plantilla)
- **Plantilla:** [catalog-product-image-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(change)="onFileSelected($event)"`, `(click)="removeImage()"`

#### Clase `CatalogProductImageModalComponent` (L14–110)

- **Decoradores:** `@Component({ selector: 'app-catalog-product-image-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './catalog-product-image-moda`
- **Propósito:** Gestor de la imagen única de una publicación de catálogo (Librería/Variedades) — subir/reemplazar/eliminar.
- **Servicios inyectados con `inject()`:** `catalogProductService = inject(CatalogProductService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input product = null`, `@Output closed = new EventEmitter<void>()`, `@Output changed = new EventEmitter<CatalogProduct>()`, `isUploading = signal(false)`, `isRemoving = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 35–37 | — | `boolean` |
| `imageUrl` | getter public | 39–41 | — | `string \| null` |
| `onFileSelected` | método public | 43–68 | `event: Event` | `void` |
| `removeImage` | método public async | 70–92 | — | `Promise<void>` |
| `close` | método public | 94–96 | — | `void` |
| `refetch` | método private | 98–109 | `productId: string`, `done?: () => void` | `void` |

##### `CatalogProductImageModalComponent.open`

- **Firma:** `open(): boolean` — [catalog-product-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductImageModalComponent.imageUrl`

- **Firma:** `imageUrl(): string \| null` — [catalog-product-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductService.getImageUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductImageModalComponent.onFileSelected`

- **Firma:** `onFileSelected(event: Event): void` — [catalog-product-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.ts#L43) (L43–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `file.type.startsWith`, `this.notificationService.error`, `this.isUploading.set`, `this.catalogProductService.setImage(product.id, file).subscribe`, `this.catalogProductService.setImage`, `this.refetch`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isUploading.set`
- **Consumidores:** `catalog-product-image-modal.component.html` (plantilla)

##### `CatalogProductImageModalComponent.removeImage`

- **Firma:** `removeImage(): Promise<void>` — [catalog-product-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.ts#L70) (L70–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.isRemoving.set`, `this.catalogProductService.removeImage(product.id).subscribe`, `this.catalogProductService.removeImage`, `this.refetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isRemoving.set`
- **Consumidores:** `catalog-product-image-modal.component.html` (plantilla)

##### `CatalogProductImageModalComponent.close`

- **Firma:** `close(): void` — [catalog-product-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.ts#L94) (L94–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `catalog-product-image-modal.component.html` (plantilla)

##### `CatalogProductImageModalComponent.refetch`

- **Firma:** `refetch(productId: string, done?: () => void): void` — [catalog-product-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.ts#L98) (L98–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductService.getProductById(productId).subscribe`, `this.catalogProductService.getProductById`, `done`, `this.changed.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Emite eventos: `this.changed.emit`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-table-catalog-product-table-component-ts"></a>

### catalog-product-table.component.ts

- **Ruta:** [catalog-product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-table/catalog-product-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-table/catalog-product-table.component.ts`, 38 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-catalog-products`
- **Responsabilidad:** Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de Teléfonos, sin sorting de columnas.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [catalog-products-page.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts), [catalog-products-page.component.ts (plantilla)](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts) (plantilla)
- **Plantilla:** [catalog-product-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-table/catalog-product-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addProduct.emit()"`, `(click)="moveUp.emit(product)"`, `(click)="moveDown.emit(product)"`, `(click)="edit.emit(product)"`, `(click)="manageImage.emit(product)"`, `(click)="toggleActive.emit(product)"`

#### Clase `CatalogProductTableComponent` (L9–37)

- **Decoradores:** `@Component({ selector: 'app-catalog-product-table', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl`
- **Propósito:** Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de Teléfonos, sin sorting de columnas.
- **Datos / estado que administra:** `@Input products = []`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input emptyTitle = 'Aún no hay productos publicados'`, `@Input emptyDescription = 'Publica el primer producto para comenzar.'`, `@Output edit = new EventEmitter<CatalogProduct>()`, `@Output manageImage = new EventEmitter<CatalogProduct>()`, `@Output toggleActive = new EventEmitter<CatalogProduct>()`, `@Output moveUp = new EventEmitter<CatalogProduct>()`, `@Output moveDown = new EventEmitter<CatalogProduct>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addProduct = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `formatPrice` | método public | 34–36 | `price: number` | `string` |

##### `CatalogProductTableComponent.formatPrice`

- **Firma:** `formatPrice(price: number): string` — [catalog-product-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-table/catalog-product-table.component.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `price.toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `catalog-product-table.component.html` (plantilla)

