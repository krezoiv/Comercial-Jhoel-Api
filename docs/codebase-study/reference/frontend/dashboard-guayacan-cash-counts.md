# Frontend `dashboard-guayacan-cash-counts`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [guayacan-cash-counts-page.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `count` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/core, rxjs | 0 | Soporte (pruebas) |
| [guayacan-cash-counts-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Cajas y Cierres → "Arqueos — Guayacán": historial de solo lectura de los arqueos guardados desde Cuadre de Caja Guayacán (más reciente primero, paginado y filtrado en el backend). | 7 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [guayacan-cash-counts-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-counts/guayacan-cash-counts-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `guayacan-cash-counts-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-card`, `app-button`, `app-icon`, `app-report-pagination`, `app-guayacan-count-detail-modal`. | — | — | Media |
| [guayacan-cash-counts-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-counts/guayacan-cash-counts-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-spec-ts"></a>

### guayacan-cash-counts-page.component.spec.ts

- **Ruta:** [guayacan-cash-counts-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-counts/guayacan-cash-counts-page.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-counts/guayacan-cash-counts-page.component.spec.ts`, 96 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-guayacan-cash-counts`
- **Responsabilidad:** Prueba unitaria: declara `count` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [guayacan-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-box-service-ts), [guayacan-cash-counts-page.component.ts](dashboard-guayacan-cash-counts.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** —
#### Función `count` (L8–25)

- **Tipo:** función local del archivo
- **Firma:** `count(sequence: number, difference: number): GuayacanCashCountSummary` — [guayacan-cash-counts-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-counts/guayacan-cash-counts-page.component.spec.ts#L8)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `String(sequence).padStart`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-ts"></a>

### guayacan-cash-counts-page.component.ts

- **Ruta:** [guayacan-cash-counts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-counts/guayacan-cash-counts-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-counts/guayacan-cash-counts-page.component.ts`, 133 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-guayacan-cash-counts`
- **Responsabilidad:** Cajas y Cierres → "Arqueos — Guayacán": historial de solo lectura de los arqueos guardados desde Cuadre de Caja Guayacán (más reciente primero, paginado y filtrado en el backend).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [guayacan-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-box-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [count-detail-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-count-detail-modal-count-detail-modal-component-ts), [guayacan-cash.util.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts), [guayacan-cash-counts-page.component.spec.ts](dashboard-guayacan-cash-counts.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-spec-ts)
- **Plantilla:** [guayacan-cash-counts-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-counts/guayacan-cash-counts-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [count-detail-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-count-detail-modal-count-detail-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="setDraft('startDate', $event)"`, `(ngModelChange)="setDraft('endDate', $event)"`, `(ngModelChange)="setDraft('userId', $event)"`, `(ngModelChange)="setDraft('number', $event)"`, `(keydown.enter)="applyFilters()"`, `(click)="applyFilters()"`, `(click)="clearFilters()"`, `(click)="load()"`, `(click)="detailId.set(c.id)"`, `(pageChange)="onPageChange($event)"`, `(closed)="detailId.set(null)"`

**Interfaces, tipos y enums:**

- `interface CountFilters` (L18): sin documentación — miembros: `startDate`, `endDate`, `userId`, `number`

#### Clase `GuayacanCashCountsPageComponent` (L34–132)

- **Decoradores:** `@Component({ selector: 'app-guayacan-cash-counts-page', standalone: true, imports: [ FormsModule, ButtonComponent, CardComponent, IconComponent, PageHeaderCompon`
- **Propósito:** Cajas y Cierres → "Arqueos — Guayacán": historial de solo lectura de los arqueos guardados desde Cuadre de Caja Guayacán (más reciente primero, paginado y filtrado en el backend). Cada arqueo es una foto inmutable; su detalle muestra las 11 denominaciones tal como se contaron. Mismo patrón borrador/aplicado de filtros que los reportes de Reportería.
- **Servicios inyectados con `inject()`:** `service = inject(GuayacanCashBoxService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `counts = signal<GuayacanCashCountSummary[]>([])`, `total = signal(0)`, `page = signal(1)`, `loading = signal(true)`, `failed = signal(false)`, `users = signal<{ id: string; username: string }[]>([])`, `detailId = signal<string \| null>(null)`, `draft = signal<CountFilters>({ ...EMPTY_FILTERS })`, `applied = signal<CountFilters>({ ...EMPTY_FILTERS })`, `hasFilters = computed(() => Object.values(this.applied()).some(`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `setDraft` | método public | 80–82 | `key: keyof CountFilters`, `value: string` | `void` |
| `load` | método public | 84–110 | — | `void` |
| `applyFilters` | método public | 112–121 | — | `void` |
| `clearFilters` | método public | 123–126 | — | `void` |
| `onPageChange` | método public | 128–131 | `page: number` | `void` |

##### `GuayacanCashCountsPageComponent.setDraft`

- **Firma:** `setDraft(key: keyof CountFilters, value: string): void` — [guayacan-cash-counts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-counts/guayacan-cash-counts-page.component.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.draft.update`
- **Consumidores:** `guayacan-cash-counts-page.component.html` (plantilla)

##### `GuayacanCashCountsPageComponent.load`

- **Firma:** `load(): void` — [guayacan-cash-counts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-counts/guayacan-cash-counts-page.component.ts#L84) (L84–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.applied`, `this.failed.set`, `this.counts`, `this.loading.set`, `this.service.getCounts`, `filters.number.trim`, `this.page`, `this.counts.set`, `this.total.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.failed.set`, `this.loading.set`, `this.counts.set`, `this.total.set`
- **Consumidores:** `guayacan-cash-counts-page.component.html` (plantilla), (mismo archivo)

##### `GuayacanCashCountsPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [guayacan-cash-counts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-counts/guayacan-cash-counts-page.component.ts#L112) (L112–121)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft`, `this.notifications.error`, `this.applied.set`, `this.page.set`, `this.load`
- **Efectos secundarios:** Actualiza estado (signals): `this.applied.set`, `this.page.set`
- **Consumidores:** `guayacan-cash-counts-page.component.html` (plantilla), (mismo archivo)

##### `GuayacanCashCountsPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [guayacan-cash-counts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-counts/guayacan-cash-counts-page.component.ts#L123) (L123–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.set`, `this.applyFilters`
- **Efectos secundarios:** Actualiza estado (signals): `this.draft.set`
- **Consumidores:** `guayacan-cash-counts-page.component.html` (plantilla)

##### `GuayacanCashCountsPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [guayacan-cash-counts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-counts/guayacan-cash-counts-page.component.ts#L128) (L128–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.load`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `guayacan-cash-counts-page.component.html` (plantilla)

