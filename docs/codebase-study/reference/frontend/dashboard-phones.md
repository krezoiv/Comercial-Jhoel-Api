# Frontend `dashboard-phones`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [phone-sale-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-phones-components-phone-sale-detail-modal-phone-sale-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Read-only full detail for one phone sale — shared by both Inventario (a VENDIDO row's "Ver detalle de venta") and Ventas (its own history table), the one deliberate intra-feature shared component in this module (same reasoning `ClientSearchSelectComponent` is reused across Ventas/SIM/this module, rather than copied). | 3 internas; ext.: @angular/common, @angular/core | 4 | Media (4 consumidores) |
| [phone-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-components-phone-table-phone-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Desktop `&lt;table&gt;` + mobile `.card-list`, same established pattern as `ProductTableComponent`/`SimSalesTableComponent`. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [phone-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-components-phone-toolbar-phone-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Client-side filters only — same "no volume yet that justifies server-side filtering" call as Categorías/Negocios/Proveedores. | 2 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [phones-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-components-phones-summary-phones-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | KPI tiles for Inventario de Teléfonos — computed client-side from the already-fetched `phones` list, same "no separate summary endpoint" pattern as `InventorySummaryComponent`. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [phones-inventory-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-phones-inventory-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `PhonesInventoryPageComponent` (sin comentario de documentación en el código). | 8 internas; ext.: @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [phones-purchase-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-phones-purchase-phones-purchase-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Compra/ingreso de teléfonos — self-contained form, same pattern as `RegisterSimPurchaseFormComponent`: calls `PhonesService.createPhone()` directly. | 5 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [phone-sale-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-sale-confirm-modal-phone-sale-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Structured pre-submit summary the user explicitly asked for — dumb, same "parent computes/passes data, shows a summary, emits confirmed/cancelled" pattern as `FinalBalanceConfirmModalComponent`, rather than the generic `ConfirmDialogService` text dialog SIM sale uses for its own equivalent step (a deliberate deviation, see the plan's own "Modal de confirmación de venta dedicado" decision). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [phone-sale-void-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-sale-void-confirm-modal-phone-sale-void-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Anular" — dumb, exact structural copy of `VoidSimSaleRegistrationConfirmModalComponent`: the parent owns the actual `PhonesService.voidSale` call. | 2 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [phone-sales-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-sales-table-phone-sales-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Historial de ventas de teléfonos — desktop `&lt;table&gt;` + mobile `.card-list`, same established pattern as `SimSalesTableComponent`. | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [phone-search-select.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-search-select-phone-search-select-component-ts) | .ts | Componente Angular | Feature (pantalla) | Searchable phone select for Ventas — same search-box-plus-dropdown shape as `ClientSearchSelectComponent` (parent owns the selection via an `input()`, this component only searches/emits), but entirely client-side: filters the already-fetched `phones` list (only `DISPONIBLE` units, passed in by the p | 2 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [phones-sale-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Venta de teléfonos — busca un teléfono DISPONIBLE por modelo/IMEI/SIM, captura el número telefónico que se activa en este momento, cliente/DPI (foto opcional, número obligatorio — same real rule as SIM sale). | 12 internas; ext.: @angular/common, @angular/core, @angular/forms, rxjs | 1 | Baja (1 consumidores) |
| [phone-sale-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/components/phone-sale-detail-modal/phone-sale-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phone-sale-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-badge`. | — | — | Media |
| [phone-sale-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/components/phone-sale-detail-modal/phone-sale-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phone-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phone-table/phone-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phone-table.component.ts`; usa 3 componentes hijos: `app-icon`, `app-empty-state`, `app-badge`. | — | — | Media |
| [phone-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phone-table/phone-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phone-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phone-toolbar/phone-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phone-toolbar.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [phone-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phone-toolbar/phone-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phones-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phones-summary/phones-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phones-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [phones-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phones-summary/phones-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phones-inventory-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/phones-inventory-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phones-inventory-page.component.ts`; usa 5 componentes hijos: `app-page-header`, `app-phones-summary`, `app-phone-toolbar`, `app-phone-table`, `app-phone-sale-detail-modal`. | — | — | Media |
| [phones-inventory-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/phones-inventory-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phones-purchase-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/purchase/phones-purchase-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phones-purchase-page.component.ts`; usa 4 componentes hijos: `app-page-header`, `app-card`, `app-icon`, `app-button`. | — | — | Media |
| [phones-purchase-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/purchase/phones-purchase-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phone-sale-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-confirm-modal/phone-sale-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phone-sale-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [phone-sale-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-confirm-modal/phone-sale-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phone-sale-void-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-void-confirm-modal/phone-sale-void-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phone-sale-void-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [phone-sale-void-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-void-confirm-modal/phone-sale-void-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phone-sales-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sales-table/phone-sales-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phone-sales-table.component.ts`; usa 2 componentes hijos: `app-badge`, `app-icon`. | — | — | Media |
| [phone-sales-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sales-table/phone-sales-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phone-search-select.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-search-select/phone-search-select.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phone-search-select.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [phone-search-select.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-search-select/phone-search-select.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phones-sale-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phones-sale-page.component.ts`; usa 10 componentes hijos: `app-page-header`, `app-card`, `app-phone-search-select`, `app-client-search-select`, `app-button`, `app-icon`. | — | — | Media |
| [phones-sale-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-phones-components-phone-sale-detail-modal-phone-sale-detail-modal-component-ts"></a>

### phone-sale-detail-modal.component.ts

- **Ruta:** [phone-sale-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/components/phone-sale-detail-modal/phone-sale-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/phones/components/phone-sale-detail-modal/phone-sale-detail-modal.component.ts`, 87 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-phones`
- **Responsabilidad:** Read-only full detail for one phone sale — shared by both Inventario (a VENDIDO row's "Ver detalle de venta") and Ventas (its own history table), the one deliberate intra-feature shared component in this module (same reasoning `ClientSearchSelectComponent` is reused across Ventas/SIM/this module, rather than copied).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [phones.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-phones-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [phones-inventory-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-phones-inventory-page-component-ts), [phones-sale-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts), [phones-inventory-page.component.ts (plantilla)](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-phones-inventory-page-component-ts) (plantilla), [phones-sale-page.component.ts (plantilla)](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts) (plantilla)
- **Plantilla:** [phone-sale-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/components/phone-sale-detail-modal/phone-sale-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`

#### Clase `PhoneSaleDetailModalComponent` (L17–86)

- **Decoradores:** `@Component({ selector: 'app-phone-sale-detail-modal', standalone: true, imports: [DatePipe, IconComponent, BadgeComponent], templateUrl: './phone-sale-detail-mod`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Read-only full detail for one phone sale — shared by both Inventario (a VENDIDO row's "Ver detalle de venta") and Ventas (its own history table), the one deliberate intra-feature shared component in this module (same reasoning `ClientSearchSelectComponent` is reused across Ventas/SIM/this module, rather than copied). Closes on backdrop click — viewing has nothing to lose. The DPI photo is fetched as a `Blob` and turned into a local object URL, revoked on every id change and on destroy.
- **Servicios inyectados con `inject()`:** `phonesService = inject(PhonesService)`
- **Datos / estado que administra:** `@Input saleId = null`, `@Output closed = new EventEmitter<void>()`, `sale = signal<PhoneSale \| null>(null)`, `loading = signal(false)`, `dpiImageUrl = signal<string \| null>(null)`, `imageLoading = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 39–60 | — | `void` |
| `loadImage` | método private | 62–73 | `id: string` | `void` |
| `clearImage` | método private | 75–81 | — | `void` |
| `close` | método public | 83–85 | — | `void` |

##### `PhoneSaleDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [phone-sale-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/components/phone-sale-detail-modal/phone-sale-detail-modal.component.ts#L39) (L39–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clearImage`, `this.sale.set`, `this.loading.set`, `this.phonesService.getSaleById(this.saleId).subscribe`, `this.phonesService.getSaleById`, `this.loadImage`
- **Efectos secundarios:** Actualiza estado (signals): `this.sale.set`, `this.loading.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSaleDetailModalComponent.loadImage`

- **Firma:** `loadImage(id: string): void` — [phone-sale-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/components/phone-sale-detail-modal/phone-sale-detail-modal.component.ts#L62) (L62–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageLoading.set`, `this.phonesService.getSaleDpiImage(id).subscribe`, `this.phonesService.getSaleDpiImage`, `this.dpiImageUrl.set`, `URL.createObjectURL`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageLoading.set`, `this.dpiImageUrl.set`
- **Consumidores:** (mismo archivo)

##### `PhoneSaleDetailModalComponent.clearImage`

- **Firma:** `clearImage(): void` — [phone-sale-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/components/phone-sale-detail-modal/phone-sale-detail-modal.component.ts#L75) (L75–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dpiImageUrl`, `URL.revokeObjectURL`, `this.dpiImageUrl.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.dpiImageUrl.set`
- **Consumidores:** (mismo archivo)

##### `PhoneSaleDetailModalComponent.close`

- **Firma:** `close(): void` — [phone-sale-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/components/phone-sale-detail-modal/phone-sale-detail-modal.component.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `phone-sale-detail-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-components-phone-table-phone-table-component-ts"></a>

### phone-table.component.ts

- **Ruta:** [phone-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phone-table/phone-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phone-table/phone-table.component.ts`, 52 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-phones`
- **Responsabilidad:** Desktop `&lt;table&gt;` + mobile `.card-list`, same established pattern as `ProductTableComponent`/`SimSalesTableComponent`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [phones-inventory-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-phones-inventory-page-component-ts), [phones-inventory-page.component.ts (plantilla)](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-phones-inventory-page-component-ts) (plantilla)
- **Plantilla:** [phone-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phone-table/phone-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="viewSale.emit(row)"`

**Interfaces, tipos y enums:**

- `interface PhoneRow` (L7) extends Phone: A `Phone` joined (client-side) with its current active sale, if any — `phones`/`phone-sales` have no server-side join, so the page assembles this itself from the two already-fetched lists. — miembros: `saleId`, `saleDate`, `clientName`

#### Clase `PhoneTableComponent` (L21–51)

- **Decoradores:** `@Component({ selector: 'app-phone-table', standalone: true, imports: [BadgeComponent, IconComponent, EmptyStateComponent], templateUrl: './phone-table.component.`
- **Propósito:** Desktop `&lt;table&gt;` + mobile `.card-list`, same established pattern as `ProductTableComponent`/`SimSalesTableComponent`.
- **Datos / estado que administra:** `@Input rows = []`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Output viewSale = new EventEmitter<PhoneRow>()`, `@Output clearFilters = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `statusTone` | método public | 43–45 | `row: PhoneRow` | `BadgeTone` |
| `compactId` | método public | 48–50 | `value: string` | `string` |

##### `PhoneTableComponent.statusTone`

- **Firma:** `statusTone(row: PhoneRow): BadgeTone` — [phone-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phone-table/phone-table.component.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `phone-table.component.html` (plantilla)

##### `PhoneTableComponent.compactId`

- **Firma:** `compactId(value: string): string` — [phone-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phone-table/phone-table.component.ts#L48) (L48–50)
- **Propósito / descripción:** Compact IMEI/SIM (last 6 digits) — the full value is always available via the native `title` tooltip. SIM numbers run ~19-20 digits, same treatment IMEI already had.
- **Dependencias (llamadas en su cuerpo):** `value.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `phone-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-components-phone-toolbar-phone-toolbar-component-ts"></a>

### phone-toolbar.component.ts

- **Ruta:** [phone-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phone-toolbar/phone-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phone-toolbar/phone-toolbar.component.ts`, 57 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-phones`
- **Responsabilidad:** Client-side filters only — same "no volume yet that justifies server-side filtering" call as Categorías/Negocios/Proveedores.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [phones-inventory-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-phones-inventory-page-component-ts), [phones-inventory-page.component.ts (plantilla)](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-phones-inventory-page-component-ts) (plantilla)
- **Plantilla:** [phone-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phone-toolbar/phone-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="clearFilters.emit()"`, `(click)="operatorFilterChange.emit(option.value)"`, `(click)="statusFilterChange.emit(option.value)"`, `(ngModelChange)="purchaseDateFromChange.emit($event)"`, `(ngModelChange)="purchaseDateToChange.emit($event)"`, `(ngModelChange)="saleDateFromChange.emit($event)"`, `(ngModelChange)="saleDateToChange.emit($event)"`

**Interfaces, tipos y enums:**

- `interface FilterOption` (L10): sin documentación — miembros: `value`, `label`
- `type PhoneOperatorFilter` (L7) = `'all' \| PhoneOperator`
- `type PhoneStatusFilter` (L8) = `'all' \| PhoneStatus`

#### Clase `PhoneToolbarComponent` (L28–56)

- **Decoradores:** `@Component({ selector: 'app-phone-toolbar', standalone: true, imports: [FormsModule, IconComponent], templateUrl: './phone-toolbar.component.html', styleUrl: './`
- **Propósito:** Client-side filters only — same "no volume yet that justifies server-side filtering" call as Categorías/Negocios/Proveedores.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input operatorFilter = 'all'`, `@Input statusFilter = 'all'`, `@Input purchaseDateFrom = ''`, `@Input purchaseDateTo = ''`, `@Input saleDateFrom = ''`, `@Input saleDateTo = ''`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output operatorFilterChange = new EventEmitter<PhoneOperatorFilter>()`, `@Output statusFilterChange = new EventEmitter<PhoneStatusFilter>()`, `@Output purchaseDateFromChange = new EventEmitter<string>()`, `@Output purchaseDateToChange = new EventEmitter<string>()`, `@Output saleDateFromChange = new EventEmitter<string>()`, `@Output saleDateToChange = new EventEmitter<string>()`, `@Output clearFilters = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-components-phones-summary-phones-summary-component-ts"></a>

### phones-summary.component.ts

- **Ruta:** [phones-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phones-summary/phones-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phones-summary/phones-summary.component.ts`, 89 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-phones`
- **Responsabilidad:** KPI tiles for Inventario de Teléfonos — computed client-side from the already-fetched `phones` list, same "no separate summary endpoint" pattern as `InventorySummaryComponent`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [phones-inventory-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-phones-inventory-page-component-ts), [phones-inventory-page.component.ts (plantilla)](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-phones-inventory-page-component-ts) (plantilla)
- **Plantilla:** [phones-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phones-summary/phones-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface SummaryTile` (L6): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `PhonesSummaryComponent` (L20–88)

- **Decoradores:** `@Component({ selector: 'app-phones-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './phones-summary.component.html', st`
- **Propósito:** KPI tiles for Inventario de Teléfonos — computed client-side from the already-fetched `phones` list, same "no separate summary endpoint" pattern as `InventorySummaryComponent`. Costo/Valor público/Margen only ever count `DISPONIBLE` phones, per the plan's own explicit rule.
- **Datos / estado que administra:** `phonesValue = signal<Phone[]>([])`, `tiles = computed<SummaryTile[]>(() => { const phones = thi`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `phones` | setter public | 31–34 | `value: Phone[]` | (inferido) |

##### `PhonesSummaryComponent.phones`

- **Firma:** `phones(value: Phone[])` — [phones-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/components/phones-summary/phones-summary.component.ts#L31) (L31–34)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.phonesValue.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.phonesValue.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-phones-inventory-page-component-ts"></a>

### phones-inventory-page.component.ts

- **Ruta:** [phones-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/phones-inventory-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/phones/inventory/phones-inventory-page.component.ts`, 160 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-phones`
- **Responsabilidad:** Componente Angular: declara `PhonesInventoryPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [phones.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-phones-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [phones-summary.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-components-phones-summary-phones-summary-component-ts), [phone-toolbar.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-components-phone-toolbar-phone-toolbar-component-ts), [phone-table.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-components-phone-table-phone-table-component-ts), [phone-sale-detail-modal.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-components-phone-sale-detail-modal-phone-sale-detail-modal-component-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [phones-inventory-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/phones-inventory-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [phones-summary.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-components-phones-summary-phones-summary-component-ts), [phone-toolbar.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-components-phone-toolbar-phone-toolbar-component-ts), [phone-table.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-components-phone-table-phone-table-component-ts), [phone-sale-detail-modal.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-components-phone-sale-detail-modal-phone-sale-detail-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="searchTerm.set($event)"`, `(operatorFilterChange)="operatorFilter.set($event)"`, `(statusFilterChange)="statusFilter.set($event)"`, `(purchaseDateFromChange)="purchaseDateFrom.set($event)"`, `(purchaseDateToChange)="purchaseDateTo.set($event)"`, `(saleDateFromChange)="saleDateFrom.set($event)"`, `(saleDateToChange)="saleDateTo.set($event)"`, `(clearFilters)="clearFilters()"`, `(viewSale)="onViewSale($event)"`, `(closed)="closeDetail()"`

#### Clase `PhonesInventoryPageComponent` (L17–159)

- **Decoradores:** `@Component({ selector: 'app-phones-inventory-page', standalone: true, imports: [ PageHeaderComponent, PhonesSummaryComponent, PhoneToolbarComponent, PhoneTableCo`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `phonesService = inject(PhonesService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `phones = signal<Phone[]>([])`, `sales = signal<PhoneSale[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `operatorFilter = signal<PhoneOperatorFilter>('all')`, `statusFilter = signal<PhoneStatusFilter>('all')`, `purchaseDateFrom = signal('')`, `purchaseDateTo = signal('')`, `saleDateFrom = signal('')`, `saleDateTo = signal('')`, `detailSaleId = signal<string \| null>(null)`, `hasActiveFilters = computed( () => this.searchTerm().trim().length > `, `rows = computed<PhoneRow[]>(() => { const sales = this.sa`, `filteredRows = computed(() => { const search = this.searchTerm().`, `summaryPhones = computed(() => this.phones())`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchAll` | método private | 122–138 | — | `void` |
| `clearFilters` | método public | 140–148 | — | `void` |
| `onViewSale` | método public | 150–154 | `row: PhoneRow` | `void` |
| `closeDetail` | método public | 156–158 | — | `void` |

##### `PhonesInventoryPageComponent.fetchAll`

- **Firma:** `fetchAll(): void` — [phones-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/phones-inventory-page.component.ts#L122) (L122–138)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `forkJoin`, `this.phonesService.getPhones`, `this.phonesService.getSales`, `catchError`, `of`, `this.notificationService.error`, `this.phones.set`, `this.sales.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.phones.set`, `this.sales.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhonesInventoryPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [phones-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/phones-inventory-page.component.ts#L140) (L140–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.operatorFilter.set`, `this.statusFilter.set`, `this.purchaseDateFrom.set`, `this.purchaseDateTo.set`, `this.saleDateFrom.set`, `this.saleDateTo.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.operatorFilter.set`, `this.statusFilter.set`, `this.purchaseDateFrom.set`, `this.purchaseDateTo.set`, `this.saleDateFrom.set`
- **Consumidores:** `phones-inventory-page.component.html` (plantilla)

##### `PhonesInventoryPageComponent.onViewSale`

- **Firma:** `onViewSale(row: PhoneRow): void` — [phones-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/phones-inventory-page.component.ts#L150) (L150–154)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailSaleId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailSaleId.set`
- **Consumidores:** `phones-inventory-page.component.html` (plantilla)

##### `PhonesInventoryPageComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [phones-inventory-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/phones-inventory-page.component.ts#L156) (L156–158)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailSaleId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailSaleId.set`
- **Consumidores:** `phones-inventory-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-phones-purchase-phones-purchase-page-component-ts"></a>

### phones-purchase-page.component.ts

- **Ruta:** [phones-purchase-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/purchase/phones-purchase-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/phones/purchase/phones-purchase-page.component.ts`, 115 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-phones`
- **Responsabilidad:** Compra/ingreso de teléfonos — self-contained form, same pattern as `RegisterSimPurchaseFormComponent`: calls `PhonesService.createPhone()` directly.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [phones.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-phones-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [phones-purchase-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/purchase/phones-purchase-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngSubmit)="submit()"`

#### Clase `PhonesPurchasePageComponent` (L37–114)

- **Decoradores:** `@Component({ selector: 'app-phones-purchase-page', standalone: true, imports: [ReactiveFormsModule, PageHeaderComponent, CardComponent, ButtonComponent, IconComp`
- **Propósito:** Compra/ingreso de teléfonos — self-contained form, same pattern as `RegisterSimPurchaseFormComponent`: calls `PhonesService.createPhone()` directly. Every teléfono registered here starts `DISPONIBLE`, with no phone number yet — that's only assigned at the moment of sale (see `Phone`'s own doc comment). Immediately visible on Inventario de Teléfonos (a separate route/fetch, not shared state — no client-side cache to keep in sync). Layout is a single centered card, never a 2-column grid with the "recently registered" list beside it — an earlier version used `grid-template-columns: minmax(0, 26rem) 1fr`, which looked off-center on a fresh page load (the list starts empty, so only the first column rendered, leaving the row visually unbalanced). The list now renders BELOW the same centered card instead, so the layout never depends on whether it has 0 or N items.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `phonesService = inject(PhonesService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `isSubmitting = signal(false)`, `recentlyRegistered = signal<Phone[]>([])`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `submit` | método public | 68–101 | — | `void` |
| `resetForm` | método private | 103–113 | — | `void` |

##### `PhonesPurchasePageComponent.submit`

- **Firma:** `submit(): void` — [phones-purchase-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/purchase/phones-purchase-page.component.ts#L68) (L68–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.phonesService.createPhone`, `model.trim`, `imei.trim`, `simNumber.trim`, `this.notificationService.success`, `this.recentlyRegistered.update`, `[phone,...phones].slice`, `this.resetForm`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSubmitting.set`, `this.recentlyRegistered.update`
- **Consumidores:** `phones-purchase-page.component.html` (plantilla)

##### `PhonesPurchasePageComponent.resetForm`

- **Firma:** `resetForm(): void` — [phones-purchase-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/purchase/phones-purchase-page.component.ts#L103) (L103–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.form.reset`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `todayIsoDate` (L12–18)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [phones-purchase-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/purchase/phones-purchase-page.component.ts#L12)
- **Propósito / descripción:** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique already used across this app (Reports, Recargas).
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-sale-confirm-modal-phone-sale-confirm-modal-component-ts"></a>

### phone-sale-confirm-modal.component.ts

- **Ruta:** [phone-sale-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-confirm-modal/phone-sale-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-confirm-modal/phone-sale-confirm-modal.component.ts`, 53 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-phones`
- **Responsabilidad:** Structured pre-submit summary the user explicitly asked for — dumb, same "parent computes/passes data, shows a summary, emits confirmed/cancelled" pattern as `FinalBalanceConfirmModalComponent`, rather than the generic `ConfirmDialogService` text dialog SIM sale uses for its own equivalent step (a deliberate deviation, see the plan's own "Modal de confirmación de venta dedicado" decision).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [phones-sale-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts), [phones-sale-page.component.ts (plantilla)](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts) (plantilla)
- **Plantilla:** [phone-sale-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-confirm-modal/phone-sale-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="onCancel()"`, `(click)="onConfirm()"`

#### Clase `PhoneSaleConfirmModalComponent` (L16–52)

- **Decoradores:** `@Component({ selector: 'app-phone-sale-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './phone-sale-confirm-modal.comp`
- **Propósito:** Structured pre-submit summary the user explicitly asked for — dumb, same "parent computes/passes data, shows a summary, emits confirmed/cancelled" pattern as `FinalBalanceConfirmModalComponent`, rather than the generic `ConfirmDialogService` text dialog SIM sale uses for its own equivalent step (a deliberate deviation, see the plan's own "Modal de confirmación de venta dedicado" decision). The price shown is always `phone.publicPrice` directly — never a separately-passed value — since the backend no longer accepts a caller-supplied sale price at all.
- **Datos / estado que administra:** `@Input open = false`, `@Input phone = null`, `@Input phoneNumber = ''`, `@Input clientName = null`, `@Input saleDate = ''`, `@Input hasDpiImage = false`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onCancel` | método public | 39–44 | — | `void` |
| `onConfirm` | método public | 46–51 | — | `void` |

##### `PhoneSaleConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [phone-sale-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-confirm-modal/phone-sale-confirm-modal.component.ts#L39) (L39–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cancelled.emit`
- **Efectos secundarios:** Emite eventos: `this.cancelled.emit`
- **Consumidores:** `phone-sale-confirm-modal.component.html` (plantilla)

##### `PhoneSaleConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [phone-sale-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-confirm-modal/phone-sale-confirm-modal.component.ts#L46) (L46–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `phone-sale-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-sale-void-confirm-modal-phone-sale-void-confirm-modal-component-ts"></a>

### phone-sale-void-confirm-modal.component.ts

- **Ruta:** [phone-sale-void-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-void-confirm-modal/phone-sale-void-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-void-confirm-modal/phone-sale-void-confirm-modal.component.ts`, 59 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-phones`
- **Responsabilidad:** "Anular" — dumb, exact structural copy of `VoidSimSaleRegistrationConfirmModalComponent`: the parent owns the actual `PhonesService.voidSale` call.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [phones-sale-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts), [phones-sale-page.component.ts (plantilla)](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts) (plantilla)
- **Plantilla:** [phone-sale-void-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-void-confirm-modal/phone-sale-void-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="onCancel()"`, `(ngModelChange)="reason.set($event)"`, `(click)="onConfirm()"`

#### Clase `PhoneSaleVoidConfirmModalComponent` (L14–58)

- **Decoradores:** `@Component({ selector: 'app-phone-sale-void-confirm-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './phone-sale-`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Anular" — dumb, exact structural copy of `VoidSimSaleRegistrationConfirmModalComponent`: the parent owns the actual `PhonesService.voidSale` call. Never closes on a backdrop click.
- **Datos / estado que administra:** `@Input open = false`, `@Input sale = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 34–38 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 40–42 | — | `boolean` |
| `onCancel` | método public | 44–50 | — | `void` |
| `onConfirm` | método public | 52–57 | — | `void` |

##### `PhoneSaleVoidConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [phone-sale-void-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-void-confirm-modal/phone-sale-void-confirm-modal.component.ts#L34) (L34–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSaleVoidConfirmModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [phone-sale-void-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-void-confirm-modal/phone-sale-void-confirm-modal.component.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSaleVoidConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [phone-sale-void-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-void-confirm-modal/phone-sale-void-confirm-modal.component.ts#L44) (L44–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `phone-sale-void-confirm-modal.component.html` (plantilla)

##### `PhoneSaleVoidConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [phone-sale-void-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sale-void-confirm-modal/phone-sale-void-confirm-modal.component.ts#L52) (L52–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `phone-sale-void-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-sales-table-phone-sales-table-component-ts"></a>

### phone-sales-table.component.ts

- **Ruta:** [phone-sales-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sales-table/phone-sales-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sales-table/phone-sales-table.component.ts`, 31 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-phones`
- **Responsabilidad:** Historial de ventas de teléfonos — desktop `&lt;table&gt;` + mobile `.card-list`, same established pattern as `SimSalesTableComponent`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [phones-sale-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts), [phones-sale-page.component.ts (plantilla)](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts) (plantilla)
- **Plantilla:** [phone-sales-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-sales-table/phone-sales-table.component.html) · **Usa componentes:** [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="viewDetail.emit(sale)"`, `(click)="voidSale.emit(sale)"`

#### Clase `PhoneSalesTableComponent` (L9–30)

- **Decoradores:** `@Component({ selector: 'app-phone-sales-table', standalone: true, imports: [BadgeComponent, IconComponent], templateUrl: './phone-sales-table.component.html', st`
- **Propósito:** Historial de ventas de teléfonos — desktop `&lt;table&gt;` + mobile `.card-list`, same established pattern as `SimSalesTableComponent`.
- **Datos / estado que administra:** `@Input sales = []`, `@Input loading = false`, `@Input canVoid = false`, `@Output viewDetail = new EventEmitter<PhoneSale>()`, `@Output voidSale = new EventEmitter<PhoneSale>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-search-select-phone-search-select-component-ts"></a>

### phone-search-select.component.ts

- **Ruta:** [phone-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-search-select/phone-search-select.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-search-select/phone-search-select.component.ts`, 97 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-phones`
- **Responsabilidad:** Searchable phone select for Ventas — same search-box-plus-dropdown shape as `ClientSearchSelectComponent` (parent owns the selection via an `input()`, this component only searches/emits), but entirely client-side: filters the already-fetched `phones` list (only `DISPONIBLE` units, passed in by the p
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [phones-sale-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts), [phones-sale-page.component.ts (plantilla)](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts) (plantilla)
- **Plantilla:** [phone-search-select.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-search-select/phone-search-select.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clear()"`, `(ngModelChange)="onInput($event)"`, `(focus)="onFocus()"`, `(blur)="onBlur()"`, `(click)="select(phone)"`

#### Clase `PhoneSearchSelectComponent` (L20–96)

- **Decoradores:** `@Component({ selector: 'app-phone-search-select', standalone: true, imports: [FormsModule, IconComponent], templateUrl: './phone-search-select.component.html', s`
- **Propósito:** Searchable phone select for Ventas — same search-box-plus-dropdown shape as `ClientSearchSelectComponent` (parent owns the selection via an `input()`, this component only searches/emits), but entirely client-side: filters the already-fetched `phones` list (only `DISPONIBLE` units, passed in by the parent) by a case-insensitive partial match against modelo, IMEI, or SIM — exactly the three ways the user asked to be able to find a phone to sell. No backend search endpoint, no debounce — the list is already in memory, same "client-side filter over a fully-fetched list" convention this app already uses for Inventario/Categorías/etc.
- **Datos / estado que administra:** `phones = input<Phone[]>([])`, `selectedPhoneId = input<string \| null>(null)`, `@Input placeholder = 'Buscar por modelo, IMEI o SIM…'`, `@Output selectionChange = new EventEmitter<Phone \| null>()`, `query = signal('')`, `open = signal(false)`, `selectedPhone = computed<Phone \| null>(() => { const id = this.sel`, `filteredPhones = computed(() => { const term = this.query().trim().`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onInput` | método public | 73–76 | `value: string` | `void` |
| `onFocus` | método public | 78–80 | — | `void` |
| `onBlur` | método public | 82–84 | — | `void` |
| `select` | método public | 86–90 | `phone: Phone` | `void` |
| `clear` | método public | 92–95 | — | `void` |

##### `PhoneSearchSelectComponent.onInput`

- **Firma:** `onInput(value: string): void` — [phone-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-search-select/phone-search-select.component.ts#L73) (L73–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.query.set`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.open.set`
- **Consumidores:** `phone-search-select.component.html` (plantilla)

##### `PhoneSearchSelectComponent.onFocus`

- **Firma:** `onFocus(): void` — [phone-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-search-select/phone-search-select.component.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `phone-search-select.component.html` (plantilla)

##### `PhoneSearchSelectComponent.onBlur`

- **Firma:** `onBlur(): void` — [phone-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-search-select/phone-search-select.component.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `setTimeout`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.open.set`
- **Consumidores:** `phone-search-select.component.html` (plantilla)

##### `PhoneSearchSelectComponent.select`

- **Firma:** `select(phone: Phone): void` — [phone-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-search-select/phone-search-select.component.ts#L86) (L86–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectionChange.emit`, `this.query.set`, `this.open.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`, `this.open.set`; Emite eventos: `this.selectionChange.emit`
- **Consumidores:** `phone-search-select.component.html` (plantilla)

##### `PhoneSearchSelectComponent.clear`

- **Firma:** `clear(): void` — [phone-search-select.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/components/phone-search-select/phone-search-select.component.ts#L92) (L92–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectionChange.emit`, `this.query.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.query.set`; Emite eventos: `this.selectionChange.emit`
- **Consumidores:** `phone-search-select.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts"></a>

### phones-sale-page.component.ts

- **Ruta:** [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts`, 258 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-phones`
- **Responsabilidad:** Venta de teléfonos — busca un teléfono DISPONIBLE por modelo/IMEI/SIM, captura el número telefónico que se activa en este momento, cliente/DPI (foto opcional, número obligatorio — same real rule as SIM sale).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [phones.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-phones-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [client-search-select.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-client-search-select-client-search-select-component-ts), [phone-search-select.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-search-select-phone-search-select-component-ts), [phone-sale-confirm-modal.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-sale-confirm-modal-phone-sale-confirm-modal-component-ts), [phone-sale-void-confirm-modal.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-sale-void-confirm-modal-phone-sale-void-confirm-modal-component-ts), [phone-sales-table.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-sales-table-phone-sales-table-component-ts), [phone-sale-detail-modal.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-components-phone-sale-detail-modal-phone-sale-detail-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [phones-sale-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [phone-search-select.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-search-select-phone-search-select-component-ts), [client-search-select.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [phone-sales-table.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-sales-table-phone-sales-table-component-ts), [phone-sale-confirm-modal.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-sale-confirm-modal-phone-sale-confirm-modal-component-ts), [phone-sale-detail-modal.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-components-phone-sale-detail-modal-phone-sale-detail-modal-component-ts), [phone-sale-void-confirm-modal.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-components-phone-sale-void-confirm-modal-phone-sale-void-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngSubmit)="requestSale()"`, `(selectionChange)="onPhoneChange($event)"`, `(selectionChange)="onClientChange($event)"`, `(click)="removeDpiImage()"`, `(change)="onDpiImageSelected($event)"`, `(viewDetail)="viewDetail($event)"`, `(voidSale)="requestVoid($event)"`, `(confirmed)="confirmSale()"`, `(cancelled)="cancelConfirm()"`, `(closed)="closeDetail()"`, `(confirmed)="confirmVoid($event)"`, `(cancelled)="cancelVoid()"`

#### Clase `PhonesSalePageComponent` (L42–257)

- **Decoradores:** `@Component({ selector: 'app-phones-sale-page', standalone: true, imports: [ ReactiveFormsModule, PageHeaderComponent, CardComponent, ButtonComponent, IconCompone`
- **Propósito:** Venta de teléfonos — busca un teléfono DISPONIBLE por modelo/IMEI/SIM, captura el número telefónico que se activa en este momento, cliente/DPI (foto opcional, número obligatorio — same real rule as SIM sale). El precio de venta es siempre el precio público ya guardado del teléfono — de sólo lectura, nunca editable ni enviado por el frontend (el backend ya no acepta ese campo). Muestra un resumen estructurado antes de confirmar, y debajo, el historial completo con acciones Ver detalle/Anular.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `phonesService = inject(PhonesService)`, `authService = inject(AuthService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `loading = signal(true)`, `availablePhones = signal<Phone[]>([])`, `sales = signal<PhoneSale[]>([])`, `selectedPhone = signal<Phone \| null>(null)`, `selectedClient = signal<Client \| null>(null)`, `dpiImageFile = signal<File \| null>(null)`, `dpiImagePreviewUrl = signal<string \| null>(null)`, `imageError = signal<string \| null>(null)`, `isSubmitting = signal(false)`, `confirmOpen = signal(false)`, `detailSaleId = signal<string \| null>(null)`, `voidTarget = signal<PhoneSale \| null>(null)`, `isVoiding = signal(false)`, `isAdmin = computed(() => this.authService.isAdmin())`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchAll` | método private | 99–115 | — | `void` |
| `onPhoneChange` | método public | 117–120 | `phone: Phone \| null` | `void` |
| `onClientChange` | método public | 122–124 | `client: Client \| null` | `void` |
| `onDpiImageSelected` | método public | 126–147 | `event: Event` | `void` |
| `removeDpiImage` | método public | 149–153 | — | `void` |
| `clearDpiImagePreview` | método private | 155–161 | — | `void` |
| `requestSale` | método public | 163–169 | — | `void` |
| `cancelConfirm` | método public | 171–173 | — | `void` |
| `confirmSale` | método public | 175–210 | — | `void` |
| `resetForm` | método private | 212–219 | — | `void` |
| `viewDetail` | método public | 221–223 | `sale: PhoneSale` | `void` |
| `closeDetail` | método public | 225–227 | — | `void` |
| `requestVoid` | método public | 229–231 | `sale: PhoneSale` | `void` |
| `cancelVoid` | método public | 233–235 | — | `void` |
| `confirmVoid` | método public | 237–256 | `reason: string` | `void` |

##### `PhonesSalePageComponent.fetchAll`

- **Firma:** `fetchAll(): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L99) (L99–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `forkJoin`, `this.phonesService.getPhones`, `this.phonesService.getSales`, `catchError`, `of`, `this.notificationService.error`, `this.availablePhones.set`, `result.phones.filter`, `this.sales.set`, `[...result.sales].sort`, `b.createdAt.localeCompare`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.availablePhones.set`, `this.sales.set`
- **Consumidores:** (mismo archivo)

##### `PhonesSalePageComponent.onPhoneChange`

- **Firma:** `onPhoneChange(phone: Phone \| null): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L117) (L117–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedPhone.set`, `this.form.controls.phoneId.setValue`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedPhone.set`
- **Consumidores:** `phones-sale-page.component.html` (plantilla)

##### `PhonesSalePageComponent.onClientChange`

- **Firma:** `onClientChange(client: Client \| null): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L122) (L122–124)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedClient.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedClient.set`
- **Consumidores:** `phones-sale-page.component.html` (plantilla)

##### `PhonesSalePageComponent.onDpiImageSelected`

- **Firma:** `onDpiImageSelected(event: Event): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L126) (L126–147)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageError.set`, `ALLOWED_IMAGE_TYPES.has`, `this.clearDpiImagePreview`, `this.dpiImageFile.set`, `this.dpiImagePreviewUrl.set`, `URL.createObjectURL`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageError.set`, `this.dpiImageFile.set`, `this.dpiImagePreviewUrl.set`
- **Consumidores:** `phones-sale-page.component.html` (plantilla)

##### `PhonesSalePageComponent.removeDpiImage`

- **Firma:** `removeDpiImage(): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L149) (L149–153)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clearDpiImagePreview`, `this.dpiImageFile.set`, `this.imageError.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.dpiImageFile.set`, `this.imageError.set`
- **Consumidores:** `phones-sale-page.component.html` (plantilla)

##### `PhonesSalePageComponent.clearDpiImagePreview`

- **Firma:** `clearDpiImagePreview(): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L155) (L155–161)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dpiImagePreviewUrl`, `URL.revokeObjectURL`, `this.dpiImagePreviewUrl.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.dpiImagePreviewUrl.set`
- **Consumidores:** (mismo archivo)

##### `PhonesSalePageComponent.requestSale`

- **Firma:** `requestSale(): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L163) (L163–169)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.selectedPhone`, `this.form.markAllAsTouched`, `this.confirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.confirmOpen.set`
- **Consumidores:** `phones-sale-page.component.html` (plantilla)

##### `PhonesSalePageComponent.cancelConfirm`

- **Firma:** `cancelConfirm(): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L171) (L171–173)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.confirmOpen.set`
- **Consumidores:** `phones-sale-page.component.html` (plantilla)

##### `PhonesSalePageComponent.confirmSale`

- **Firma:** `confirmSale(): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L175) (L175–210)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedPhone`, `this.isSubmitting`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.phonesService.registerSale`, `this.selectedClient`, `clientDpi.trim`, `phoneNumber.trim`, `this.dpiImageFile`, `this.confirmOpen.set`, `this.notificationService.success`, `formatCurrency`, `this.sales.update`, `this.availablePhones.update`, `phones.filter`, `this.resetForm`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSubmitting.set`, `this.confirmOpen.set`, `this.sales.update`, `this.availablePhones.update`
- **Consumidores:** `phones-sale-page.component.html` (plantilla)

##### `PhonesSalePageComponent.resetForm`

- **Firma:** `resetForm(): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L212) (L212–219)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.form.reset`, `todayIsoDate`, `this.selectedPhone.set`, `this.selectedClient.set`, `this.clearDpiImagePreview`, `this.dpiImageFile.set`, `this.imageError.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedPhone.set`, `this.selectedClient.set`, `this.dpiImageFile.set`, `this.imageError.set`
- **Consumidores:** (mismo archivo)

##### `PhonesSalePageComponent.viewDetail`

- **Firma:** `viewDetail(sale: PhoneSale): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L221) (L221–223)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailSaleId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailSaleId.set`
- **Consumidores:** `phones-sale-page.component.html` (plantilla)

##### `PhonesSalePageComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L225) (L225–227)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailSaleId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detailSaleId.set`
- **Consumidores:** `phones-sale-page.component.html` (plantilla)

##### `PhonesSalePageComponent.requestVoid`

- **Firma:** `requestVoid(sale: PhoneSale): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L229) (L229–231)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `phones-sale-page.component.html` (plantilla)

##### `PhonesSalePageComponent.cancelVoid`

- **Firma:** `cancelVoid(): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L233) (L233–235)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voidTarget.set`
- **Consumidores:** `phones-sale-page.component.html` (plantilla)

##### `PhonesSalePageComponent.confirmVoid`

- **Firma:** `confirmVoid(reason: string): void` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L237) (L237–256)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget`, `this.isVoiding`, `this.isVoiding.set`, `this.phonesService.voidSale(target.id, reason).subscribe`, `this.phonesService.voidSale`, `this.voidTarget.set`, `this.notificationService.success`, `this.sales.update`, `sales.map`, `this.fetchAll`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isVoiding.set`, `this.voidTarget.set`, `this.sales.update`
- **Consumidores:** `phones-sale-page.component.html` (plantilla)

#### Función `todayIsoDate` (L25–31)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [phones-sale-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts#L25)
- **Propósito / descripción:** Local-time `yyyy-MM-dd`.
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

