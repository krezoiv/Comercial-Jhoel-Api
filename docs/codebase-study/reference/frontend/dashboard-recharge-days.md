# Frontend `dashboard-recharge-days`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [cancel-recharge-day-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-cancel-recharge-day-confirm-modal-cancel-recharge-day-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb — same pattern as `ReopenRechargeDayConfirmModalComponent`. | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [recharge-day-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-recharge-day-detail-modal-recharge-day-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Ver Detalle" of a closed Recargas day — calls `RechargeDaysService.getDayDetail` every time it opens (or the selected date changes), never caches across openings. | 5 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [reopen-recharge-day-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-reopen-recharge-day-confirm-modal-reopen-recharge-day-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dumb — the parent (`RechargeDaysPageComponent`) owns the actual `RechargeDaysService.reopenDay` call, same pattern as Bancos' `ReopenConfirmModalComponent`. | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [recharge-days-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Sistema → Gestión de Días de Recargas" — the Recargas-specific counterpart to Bancos' "Gestión de Días Cerrados" (`ClosedDaysPageComponent`), structurally an exact mirror but fully independent: separate backend table/lifecycle, separate service (`RechargeDaysService`), never shares state with Bancos' own closed-days screen. | 9 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [cancel-recharge-day-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/cancel-recharge-day-confirm-modal/cancel-recharge-day-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cancel-recharge-day-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [cancel-recharge-day-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/cancel-recharge-day-confirm-modal/cancel-recharge-day-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharge-day-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/recharge-day-detail-modal/recharge-day-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharge-day-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [recharge-day-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/recharge-day-detail-modal/recharge-day-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [reopen-recharge-day-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/reopen-recharge-day-confirm-modal/reopen-recharge-day-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `reopen-recharge-day-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [reopen-recharge-day-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/reopen-recharge-day-confirm-modal/reopen-recharge-day-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharge-days-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharge-days-page.component.ts`; usa 8 componentes hijos: `app-page-header`, `app-card`, `app-icon`, `app-button`, `app-empty-state`, `app-recharge-day-detail-modal`. | — | — | Media |
| [recharge-days-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-cancel-recharge-day-confirm-modal-cancel-recharge-day-confirm-modal-component-ts"></a>

### cancel-recharge-day-confirm-modal.component.ts

- **Ruta:** [cancel-recharge-day-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/cancel-recharge-day-confirm-modal/cancel-recharge-day-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/cancel-recharge-day-confirm-modal/cancel-recharge-day-confirm-modal.component.ts`, 58 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharge-days`
- **Responsabilidad:** Dumb — same pattern as `ReopenRechargeDayConfirmModalComponent`.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [recharge-days-page.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts), [recharge-days-page.component.ts (plantilla)](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts) (plantilla)
- **Plantilla:** [cancel-recharge-day-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/cancel-recharge-day-confirm-modal/cancel-recharge-day-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(ngModelChange)="reason.set($event)"`, `(click)="onCancel()"`, `(click)="onConfirm()"`

#### Clase `CancelRechargeDayConfirmModalComponent` (L15–57)

- **Decoradores:** `@Component({ selector: 'app-cancel-recharge-day-confirm-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './cancel-`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Dumb — same pattern as `ReopenRechargeDayConfirmModalComponent`. "Anular" (not "Eliminar"): this is financial information and the backend never does a physical `DELETE` (`cancel_recharge_day` only marks `is_cancelled`, see the backend) — the modal's copy must reflect exactly that.
- **Datos / estado que administra:** `@Input open = false`, `@Input date = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 33–37 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 39–41 | — | `boolean` |
| `onCancel` | método public | 43–49 | — | `void` |
| `onConfirm` | método public | 51–56 | — | `void` |

##### `CancelRechargeDayConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [cancel-recharge-day-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/cancel-recharge-day-confirm-modal/cancel-recharge-day-confirm-modal.component.ts#L33) (L33–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CancelRechargeDayConfirmModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [cancel-recharge-day-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/cancel-recharge-day-confirm-modal/cancel-recharge-day-confirm-modal.component.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CancelRechargeDayConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [cancel-recharge-day-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/cancel-recharge-day-confirm-modal/cancel-recharge-day-confirm-modal.component.ts#L43) (L43–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `cancel-recharge-day-confirm-modal.component.html` (plantilla)

##### `CancelRechargeDayConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [cancel-recharge-day-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/cancel-recharge-day-confirm-modal/cancel-recharge-day-confirm-modal.component.ts#L51) (L51–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `cancel-recharge-day-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-recharge-day-detail-modal-recharge-day-detail-modal-component-ts"></a>

### recharge-day-detail-modal.component.ts

- **Ruta:** [recharge-day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/recharge-day-detail-modal/recharge-day-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/recharge-day-detail-modal/recharge-day-detail-modal.component.ts`, 108 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharge-days`
- **Responsabilidad:** "Ver Detalle" of a closed Recargas day — calls `RechargeDaysService.getDayDetail` every time it opens (or the selected date changes), never caches across openings.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [recharge-days.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-days-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [recharge-days-page.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts), [recharge-days-page.component.ts (plantilla)](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts) (plantilla)
- **Plantilla:** [recharge-day-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/recharge-day-detail-modal/recharge-day-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="onClose()"`

#### Clase `RechargeDayDetailModalComponent` (L49–107)

- **Decoradores:** `@Component({ selector: 'app-recharge-day-detail-modal', standalone: true, imports: [DatePipe, ButtonComponent, IconComponent], templateUrl: './recharge-day-detai`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Ver Detalle" of a closed Recargas day — calls `RechargeDaysService.getDayDetail` every time it opens (or the selected date changes), never caches across openings. Unlike Bancos' own `DayDetailModalComponent`, the main body is a table of EVERY cuadre cycle saved that date (`closures`), not a single reconciliation block — the direct consequence of Recargas' own multi-cycle-per-day feature.
- **Servicios inyectados con `inject()`:** `rechargeDaysService = inject(RechargeDaysService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input date = null`, `@Output closed = new EventEmitter<void>()`, `detail = signal<RechargeDayDetail \| null>(null)`, `loading = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `closureStatus` | método public | 74–76 | `result: number` | `SalesClosureStatus` |
| `closureStatusIcon` | método public | 78–80 | `result: number` | `string` |
| `ngOnChanges` | método public | 82–86 | `changes: SimpleChanges` | `void` |
| `onClose` | método public | 88–90 | — | `void` |
| `fetch` | método private | 92–106 | `date: string` | `void` |

##### `RechargeDayDetailModalComponent.closureStatus`

- **Firma:** `closureStatus(result: number): SalesClosureStatus` — [recharge-day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/recharge-day-detail-modal/recharge-day-detail-modal.component.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `getSalesClosureStatus`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recharge-day-detail-modal.component.html` (plantilla), (mismo archivo)

##### `RechargeDayDetailModalComponent.closureStatusIcon`

- **Firma:** `closureStatusIcon(result: number): string` — [recharge-day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/recharge-day-detail-modal/recharge-day-detail-modal.component.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closureStatus`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recharge-day-detail-modal.component.html` (plantilla)

##### `RechargeDayDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [recharge-day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/recharge-day-detail-modal/recharge-day-detail-modal.component.ts#L82) (L82–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.fetch`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayDetailModalComponent.onClose`

- **Firma:** `onClose(): void` — [recharge-day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/recharge-day-detail-modal/recharge-day-detail-modal.component.ts#L88) (L88–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `recharge-day-detail-modal.component.html` (plantilla)

##### `RechargeDayDetailModalComponent.fetch`

- **Firma:** `fetch(date: string): void` — [recharge-day-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/recharge-day-detail-modal/recharge-day-detail-modal.component.ts#L92) (L92–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.detail.set`, `this.rechargeDaysService.getDayDetail(date).subscribe`, `this.rechargeDaysService.getDayDetail`, `this.notificationService.error`, `extractErrorMessage`, `this.closed.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.detail.set`; Emite eventos: `this.closed.emit`
- **Consumidores:** [recharge-days-page.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts), [recharge-days-page.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts), (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-reopen-recharge-day-confirm-modal-reopen-recharge-day-confirm-modal-component-ts"></a>

### reopen-recharge-day-confirm-modal.component.ts

- **Ruta:** [reopen-recharge-day-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/reopen-recharge-day-confirm-modal/reopen-recharge-day-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/reopen-recharge-day-confirm-modal/reopen-recharge-day-confirm-modal.component.ts`, 58 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharge-days`
- **Responsabilidad:** Dumb — the parent (`RechargeDaysPageComponent`) owns the actual `RechargeDaysService.reopenDay` call, same pattern as Bancos' `ReopenConfirmModalComponent`.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [recharge-days-page.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts), [recharge-days-page.component.ts (plantilla)](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts) (plantilla)
- **Plantilla:** [reopen-recharge-day-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/reopen-recharge-day-confirm-modal/reopen-recharge-day-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(ngModelChange)="reason.set($event)"`, `(click)="onCancel()"`, `(click)="onConfirm()"`

#### Clase `ReopenRechargeDayConfirmModalComponent` (L15–57)

- **Decoradores:** `@Component({ selector: 'app-reopen-recharge-day-confirm-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './reopen-`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Dumb — the parent (`RechargeDaysPageComponent`) owns the actual `RechargeDaysService.reopenDay` call, same pattern as Bancos' `ReopenConfirmModalComponent`. The reason is mandatory (minimum 5 characters, the same minimum the backend enforces) — "Confirmar Reapertura" stays disabled until that's met.
- **Datos / estado que administra:** `@Input open = false`, `@Input date = null`, `@Input isSaving = false`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 33–37 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 39–41 | — | `boolean` |
| `onCancel` | método public | 43–49 | — | `void` |
| `onConfirm` | método public | 51–56 | — | `void` |

##### `ReopenRechargeDayConfirmModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [reopen-recharge-day-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/reopen-recharge-day-confirm-modal/reopen-recharge-day-confirm-modal.component.ts#L33) (L33–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ReopenRechargeDayConfirmModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [reopen-recharge-day-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/reopen-recharge-day-confirm-modal/reopen-recharge-day-confirm-modal.component.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ReopenRechargeDayConfirmModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [reopen-recharge-day-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/reopen-recharge-day-confirm-modal/reopen-recharge-day-confirm-modal.component.ts#L43) (L43–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.cancelled.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`; Emite eventos: `this.cancelled.emit`
- **Consumidores:** `reopen-recharge-day-confirm-modal.component.html` (plantilla)

##### `ReopenRechargeDayConfirmModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [reopen-recharge-day-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/components/reopen-recharge-day-confirm-modal/reopen-recharge-day-confirm-modal.component.ts#L51) (L51–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `reopen-recharge-day-confirm-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts"></a>

### recharge-days-page.component.ts

- **Ruta:** [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts`, 221 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-recharge-days`
- **Responsabilidad:** "Sistema → Gestión de Días de Recargas" — the Recargas-specific counterpart to Bancos' "Gestión de Días Cerrados" (`ClosedDaysPageComponent`), structurally an exact mirror but fully independent: separate backend table/lifecycle, separate service (`RechargeDaysService`), never shares state with Bancos' own closed-days screen.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [recharge-days.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-days-service-ts), [recharge-day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-day-status-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [recharge-day-detail-modal.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-recharge-day-detail-modal-recharge-day-detail-modal-component-ts), [reopen-recharge-day-confirm-modal.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-reopen-recharge-day-confirm-modal-reopen-recharge-day-confirm-modal-component-ts), [cancel-recharge-day-confirm-modal.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-cancel-recharge-day-confirm-modal-cancel-recharge-day-confirm-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [recharge-days-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [recharge-day-detail-modal.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-recharge-day-detail-modal-recharge-day-detail-modal-component-ts), [reopen-recharge-day-confirm-modal.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-reopen-recharge-day-confirm-modal-reopen-recharge-day-confirm-modal-component-ts), [cancel-recharge-day-confirm-modal.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-cancel-recharge-day-confirm-modal-cancel-recharge-day-confirm-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="draftDateFrom.set($event)"`, `(ngModelChange)="draftDateTo.set($event)"`, `(ngModelChange)="draftStatus.set($event)"`, `(ngModelChange)="draftResultSign.set($event)"`, `(click)="clearFilters()"`, `(click)="applyFilters()"`, `(click)="openDetail(row.date)"`, `(click)="openReopenModal(row.date)"`, `(click)="openCancelModal(row.date)"`, `(closed)="closeDetail()"`, `(confirmed)="confirmReopen($event)"`, `(cancelled)="cancelReopenModal()"`, `(confirmed)="confirmCancel($event)"`, `(cancelled)="cancelCancelModal()"`

#### Clase `RechargeDaysPageComponent` (L50–220)

- **Decoradores:** `@Component({ selector: 'app-recharge-days-page', standalone: true, imports: [ FormsModule, DatePipe, PageHeaderComponent, CardComponent, ButtonComponent, IconCom`
- **Propósito:** "Sistema → Gestión de Días de Recargas" — the Recargas-specific counterpart to Bancos' "Gestión de Días Cerrados" (`ClosedDaysPageComponent`), structurally an exact mirror but fully independent: separate backend table/lifecycle, separate service (`RechargeDaysService`), never shares state with Bancos' own closed-days screen. Manages the cycle of a Recargas day that is ALREADY closed (controlled reopening, re-closing, cancellation) — never touches the day-in-progress logic (opening, compras, ventas, cuadre) owned by the operational Recargas page. Route and menu already protected by `adminGuard`/`roles` (the same mechanism Usuarios/Roles/Gestión de Días Cerrados use) — the real protection is on the backend (`RechargeDaysController`, a class-level `@Roles('ADMIN','SUPER_ADMIN')`, including the `GET`s).
- **Servicios inyectados con `inject()`:** `rechargeDaysService = inject(RechargeDaysService)`, `dayStatusService = inject(RechargeDayStatusService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `rows = signal<RechargeClosedDayRow[]>([])`, `loading = signal(true)`, `draftDateFrom = signal('')`, `draftDateTo = signal('')`, `draftStatus = signal<RechargeClosedDayStatus \| ''>('')`, `draftResultSign = signal<RechargeResultSign \| ''>('')`, `hasActiveFilters = signal(false)`, `selectedDate = signal<string \| null>(null)`, `isDetailOpen = signal(false)`, `isReopenModalOpen = signal(false)`, `isCancelModalOpen = signal(false)`, `isSavingAction = signal(false)`, `selectedRow = computed(() => this.rows().find((row) => row.date `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método private | 102–114 | — | `void` |
| `applyFilters` | método public | 116–125 | — | `void` |
| `clearFilters` | método public | 127–135 | — | `void` |
| `openDetail` | método public | 137–140 | `date: string` | `void` |
| `closeDetail` | método public | 142–144 | — | `void` |
| `openReopenModal` | método public | 146–149 | `date: string` | `void` |
| `cancelReopenModal` | método public | 151–156 | — | `void` |
| `confirmReopen` | método public | 158–177 | `reason: string` | `void` |
| `openCancelModal` | método public | 179–182 | `date: string` | `void` |
| `cancelCancelModal` | método public | 184–189 | — | `void` |
| `confirmCancel` | método public | 191–210 | `reason: string` | `void` |
| `canReopen` | método public | 213–215 | `row: RechargeClosedDayRow` | `boolean` |
| `canCancel` | método public | 217–219 | `row: RechargeClosedDayRow` | `boolean` |

##### `RechargeDaysPageComponent.fetch`

- **Firma:** `fetch(): void` — [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts#L102) (L102–114)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.rechargeDaysService.getClosedDays(this.appliedFilters).subscribe`, `this.rechargeDaysService.getClosedDays`, `this.rows.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.rows.set`
- **Consumidores:** (mismo archivo)

##### `RechargeDaysPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts#L116) (L116–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftDateFrom`, `this.draftDateTo`, `this.draftStatus`, `this.draftResultSign`, `this.hasActiveFilters.set`, `Object.values(this.appliedFilters).some`, `Object.values`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.hasActiveFilters.set`
- **Consumidores:** `recharge-days-page.component.html` (plantilla)

##### `RechargeDaysPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts#L127) (L127–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftDateFrom.set`, `this.draftDateTo.set`, `this.draftStatus.set`, `this.draftResultSign.set`, `this.hasActiveFilters.set`, `this.fetch`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftDateFrom.set`, `this.draftDateTo.set`, `this.draftStatus.set`, `this.draftResultSign.set`, `this.hasActiveFilters.set`
- **Consumidores:** `recharge-days-page.component.html` (plantilla)

##### `RechargeDaysPageComponent.openDetail`

- **Firma:** `openDetail(date: string): void` — [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts#L137) (L137–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate.set`, `this.isDetailOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedDate.set`, `this.isDetailOpen.set`
- **Consumidores:** `recharge-days-page.component.html` (plantilla)

##### `RechargeDaysPageComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts#L142) (L142–144)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDetailOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDetailOpen.set`
- **Consumidores:** `recharge-days-page.component.html` (plantilla)

##### `RechargeDaysPageComponent.openReopenModal`

- **Firma:** `openReopenModal(date: string): void` — [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts#L146) (L146–149)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate.set`, `this.isReopenModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedDate.set`, `this.isReopenModalOpen.set`
- **Consumidores:** `recharge-days-page.component.html` (plantilla)

##### `RechargeDaysPageComponent.cancelReopenModal`

- **Firma:** `cancelReopenModal(): void` — [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts#L151) (L151–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSavingAction`, `this.isReopenModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isReopenModalOpen.set`
- **Consumidores:** `recharge-days-page.component.html` (plantilla)

##### `RechargeDaysPageComponent.confirmReopen`

- **Firma:** `confirmReopen(reason: string): void` — [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts#L158) (L158–177)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate`, `this.isSavingAction`, `this.isSavingAction.set`, `this.rechargeDaysService.reopenDay(date, reason).subscribe`, `this.rechargeDaysService.reopenDay`, `this.isReopenModalOpen.set`, `this.notificationService.success`, `this.fetch`, `this.dayStatusService.refresh`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSavingAction.set`, `this.isReopenModalOpen.set`
- **Consumidores:** `recharge-days-page.component.html` (plantilla)

##### `RechargeDaysPageComponent.openCancelModal`

- **Firma:** `openCancelModal(date: string): void` — [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts#L179) (L179–182)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate.set`, `this.isCancelModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedDate.set`, `this.isCancelModalOpen.set`
- **Consumidores:** `recharge-days-page.component.html` (plantilla)

##### `RechargeDaysPageComponent.cancelCancelModal`

- **Firma:** `cancelCancelModal(): void` — [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts#L184) (L184–189)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSavingAction`, `this.isCancelModalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isCancelModalOpen.set`
- **Consumidores:** `recharge-days-page.component.html` (plantilla)

##### `RechargeDaysPageComponent.confirmCancel`

- **Firma:** `confirmCancel(reason: string): void` — [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts#L191) (L191–210)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate`, `this.isSavingAction`, `this.isSavingAction.set`, `this.rechargeDaysService.cancelDay(date, reason).subscribe`, `this.rechargeDaysService.cancelDay`, `this.isCancelModalOpen.set`, `this.notificationService.success`, `this.fetch`, `this.dayStatusService.refresh`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSavingAction.set`, `this.isCancelModalOpen.set`
- **Consumidores:** `recharge-days-page.component.html` (plantilla)

##### `RechargeDaysPageComponent.canReopen`

- **Firma:** `canReopen(row: RechargeClosedDayRow): boolean` — [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts#L213) (L213–215)
- **Propósito / descripción:** Only a CLOSED day accepts reopening/cancellation — one already REOPENED must be re-closed first (from the operational Recargas page's "Cerrar Día"), and a CANCELLED one is terminal.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recharge-days-page.component.html` (plantilla)

##### `RechargeDaysPageComponent.canCancel`

- **Firma:** `canCancel(row: RechargeClosedDayRow): boolean` — [recharge-days-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts#L217) (L217–219)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `recharge-days-page.component.html` (plantilla)

