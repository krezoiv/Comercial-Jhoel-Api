# Frontend `dashboard-financial-day-review`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [close-review-modal.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-close-review-modal-close-review-modal-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `summary` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 0 | Soporte (pruebas) |
| [close-review-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-close-review-modal-close-review-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Close summary (corrections per module, difference before/after) and the final confirmation. | 3 internas; ext.: @angular/core, @angular/common, @angular/forms | 3 | Media (3 consumidores) |
| [correction-modal.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-correction-modal-correction-modal-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `snapshot`, `movement` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 0 | Soporte (pruebas) |
| [correction-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-correction-modal-correction-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Correction of one value of the reviewed day, in two steps: (1) original value, corrected value, mandatory reason, observations; (2) a visual original → corrected comparison that must be confirmed. | 3 internas; ext.: @angular/core, @angular/common, @angular/forms | 3 | Media (3 consumidores) |
| [day-review-panel.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-day-review-panel-day-review-panel-component-ts) | .ts | Componente Angular | Feature (pantalla) | Read-only rendering of one day's diagnosis (from the backend) in tabs. | 3 internas; ext.: @angular/core, @angular/common | 2 | Baja (2 consumidores) |
| [open-review-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-open-review-modal-open-review-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "ABRIR DÍA PARA REVISIÓN" confirmation. | 1 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [financial-day-review-page.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `detail`, `session` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/common, @angular/core, @angular/router, rxjs | 0 | Soporte (pruebas) |
| [financial-day-review-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Sistema → Administración financiera → Revisión de días operativos. | 11 internas; ext.: @angular/core, @angular/common, rxjs | 2 | Baja (2 consumidores) |
| [close-review-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/close-review-modal/close-review-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `close-review-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [correction-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `correction-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [day-review-panel.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `day-review-panel.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [day-review-panel.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [open-review-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/open-review-modal/open-review-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `open-review-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [review-modal.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/review-modal.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [financial-day-review-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `financial-day-review-page.component.ts`; usa 9 componentes hijos: `app-page-header`, `app-icon`, `app-card`, `app-empty-state`, `app-button`, `app-day-review-panel`. | — | — | Media |
| [financial-day-review-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-close-review-modal-close-review-modal-component-spec-ts"></a>

### close-review-modal.component.spec.ts

- **Ruta:** [close-review-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/close-review-modal/close-review-modal.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/close-review-modal/close-review-modal.component.spec.ts`, 56 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-financial-day-review`
- **Responsabilidad:** Prueba unitaria: declara `summary` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [close-review-modal.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-close-review-modal-close-review-modal-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** —
#### Función `summary` (L6–24)

- **Tipo:** función local del archivo
- **Firma:** `summary(pending: boolean): CloseReviewSummary` — [close-review-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/close-review-modal/close-review-modal.component.spec.ts#L6)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-close-review-modal-close-review-modal-component-ts"></a>

### close-review-modal.component.ts

- **Ruta:** [close-review-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/close-review-modal/close-review-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/close-review-modal/close-review-modal.component.ts`, 93 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-financial-day-review`
- **Responsabilidad:** Close summary (corrections per module, difference before/after) and the final confirmation.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [close-review-modal.component.spec.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-close-review-modal-close-review-modal-component-spec-ts), [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts), [financial-day-review-page.component.ts (plantilla)](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts) (plantilla)
- **Plantilla:** [close-review-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/close-review-modal/close-review-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="acceptPending.set($event)"`, `(ngModelChange)="observations.set($event)"`, `(click)="onCancel()"`, `(click)="onConfirm()"`

**Interfaces, tipos y enums:**

- `interface CloseReviewSubmission` (L24): Close input chosen by the administrator. — miembros: `observations`, `acceptPendingDifferences`

#### Clase `CloseReviewModalComponent` (L34–92)

- **Decoradores:** `@Component({ selector: 'app-close-review-modal', standalone: true, imports: [FormsModule, DatePipe, ButtonComponent, IconComponent], templateUrl: './close-review`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Close summary (corrections per module, difference before/after) and the final confirmation. If differences remain, closing requires an explicit acknowledgement and the day is NOT marked as squared.
- **Datos / estado que administra:** `@Input open = false`, `@Input summary = null`, `@Input isSaving = false`, `@Input error = null`, `@Output confirmed = new EventEmitter<CloseReviewSubmission>()`, `@Output cancelled = new EventEmitter<void>()`, `observations = signal('')`, `acceptPending = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 57–62 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 64–70 | — | `boolean` |
| `moduleEntries` | método public | 72–76 | — | `Array<[ReviewModule, number]>` |
| `onCancel` | método public | 78–82 | — | `void` |
| `onConfirm` | método public | 84–91 | — | `void` |

##### `CloseReviewModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [close-review-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/close-review-modal/close-review-modal.component.ts#L57) (L57–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.observations.set`, `this.acceptPending.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.observations.set`, `this.acceptPending.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CloseReviewModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [close-review-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/close-review-modal/close-review-modal.component.ts#L64) (L64–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.acceptPending`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CloseReviewModalComponent.moduleEntries`

- **Firma:** `moduleEntries(): Array<[ReviewModule, number]>` — [close-review-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/close-review-modal/close-review-modal.component.ts#L72) (L72–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Object.entries`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `close-review-modal.component.html` (plantilla)

##### `CloseReviewModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [close-review-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/close-review-modal/close-review-modal.component.ts#L78) (L78–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cancelled.emit`
- **Efectos secundarios:** Emite eventos: `this.cancelled.emit`
- **Consumidores:** `close-review-modal.component.html` (plantilla)

##### `CloseReviewModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [close-review-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/close-review-modal/close-review-modal.component.ts#L84) (L84–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.observations().trim`, `this.observations`, `this.acceptPending`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `close-review-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-correction-modal-correction-modal-component-spec-ts"></a>

### correction-modal.component.spec.ts

- **Ruta:** [correction-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.spec.ts`, 115 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-financial-day-review`
- **Responsabilidad:** Prueba unitaria: declara `snapshot`, `movement` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [correction-modal.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-correction-modal-correction-modal-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-correction-modal-correction-modal-component-ts"></a>

### correction-modal.component.ts

- **Ruta:** [correction-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.ts`, 154 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-financial-day-review`
- **Responsabilidad:** Correction of one value of the reviewed day, in two steps: (1) original value, corrected value, mandatory reason, observations; (2) a visual original → corrected comparison that must be confirmed.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [correction-modal.component.spec.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-correction-modal-correction-modal-component-spec-ts), [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts), [financial-day-review-page.component.ts (plantilla)](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts) (plantilla)
- **Plantilla:** [correction-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="onValueChange($event)"`, `(ngModelChange)="reason.set($event)"`, `(ngModelChange)="observations.set($event)"`, `(click)="onCancel()"`, `(click)="goToConfirm()"`, `(click)="back()"`, `(click)="confirm()"`

**Interfaces, tipos y enums:**

- `interface CorrectionSubmission` (L25): What the page sends to the backend once the administrator confirms. — miembros: `request`, `newValue`, `reason`, `observations`, `requestId`

#### Clase `CorrectionModalComponent` (L40–153)

- **Decoradores:** `@Component({ selector: 'app-correction-modal', standalone: true, imports: [FormsModule, DatePipe, ButtonComponent, IconComponent], templateUrl: './correction-mod`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Correction of one value of the reviewed day, in two steps: (1) original value, corrected value, mandatory reason, observations; (2) a visual original → corrected comparison that must be confirmed. Never silent. One `requestId` per opening: a retry after a network error reuses it, so the backend can never store the same correction twice.
- **Datos / estado que administra:** `@Input open = false`, `@Input request = null`, `@Input reviewDate = null`, `@Input username = ''`, `@Input isSaving = false`, `@Input error = null`, `@Output confirmed = new EventEmitter<CorrectionSubmission>()`, `@Output cancelled = new EventEmitter<void>()`, `step = signal<'form' \| 'confirm'>('form')`, `newValue = signal<number \| null>(null)`, `reason = signal('')`, `observations = signal('')`, `difference = computed(() => { const value = this.newValue(); re`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 75–87 | `changes: SimpleChanges` | `void` |
| `onValueChange` | método public | 89–96 | `raw: string \| number \| null` | `void` |
| `valueInvalid` | getter public | 98–107 | — | `boolean` |
| `canContinue` | getter public | 109–115 | — | `boolean` |
| `goToConfirm` | método public | 117–121 | — | `void` |
| `back` | método public | 123–127 | — | `void` |
| `onCancel` | método public | 129–133 | — | `void` |
| `confirm` | método public | 135–152 | — | `void` |

##### `CorrectionModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [correction-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.ts#L75) (L75–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.step.set`, `this.newValue.set`, `this.reason.set`, `this.observations.set`, `crypto.randomUUID`
- **Efectos secundarios:** Actualiza estado (signals): `this.step.set`, `this.newValue.set`, `this.reason.set`, `this.observations.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CorrectionModalComponent.onValueChange`

- **Firma:** `onValueChange(raw: string \| number \| null): void` — [correction-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.ts#L89) (L89–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Number`, `this.newValue.set`, `Number.isNaN`, `Math.round`
- **Efectos secundarios:** Actualiza estado (signals): `this.newValue.set`
- **Consumidores:** `correction-modal.component.html` (plantilla)

##### `CorrectionModalComponent.valueInvalid`

- **Firma:** `valueInvalid(): boolean` — [correction-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.ts#L98) (L98–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newValue`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CorrectionModalComponent.canContinue`

- **Firma:** `canContinue(): boolean` — [correction-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.ts#L109) (L109–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CorrectionModalComponent.goToConfirm`

- **Firma:** `goToConfirm(): void` — [correction-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.ts#L117) (L117–121)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.step.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.step.set`
- **Consumidores:** `correction-modal.component.html` (plantilla)

##### `CorrectionModalComponent.back`

- **Firma:** `back(): void` — [correction-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.ts#L123) (L123–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.step.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.step.set`
- **Consumidores:** `correction-modal.component.html` (plantilla)

##### `CorrectionModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [correction-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.ts#L129) (L129–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cancelled.emit`
- **Efectos secundarios:** Emite eventos: `this.cancelled.emit`
- **Consumidores:** `correction-modal.component.html` (plantilla)

##### `CorrectionModalComponent.confirm`

- **Firma:** `confirm(): void` — [correction-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/correction-modal/correction-modal.component.ts#L135) (L135–152)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newValue`, `this.step`, `this.confirmed.emit`, `this.reason().trim`, `this.reason`, `this.observations().trim`, `this.observations`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `correction-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-day-review-panel-day-review-panel-component-ts"></a>

### day-review-panel.component.ts

- **Ruta:** [day-review-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.ts`, 228 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-financial-day-review`
- **Responsabilidad:** Read-only rendering of one day's diagnosis (from the backend) in tabs.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`
- **Consumidores:** [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts), [financial-day-review-page.component.ts (plantilla)](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts) (plantilla)
- **Plantilla:** [day-review-panel.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="selectTab(item.id)"`, `(click)="toggle(item.key)"`, `(click)="correctDifference(item)"`, `(click)="correctBankBalance(bank, 'previous_balance')"`, `(click)="correctBankBalance(bank, 'final_balance')"`, `(change)="movementFilter.set($any($event.target).value)"`, `(click)="correctMovement(m)"`, `(click)="correctPortfolioRow(row, source)"`

**Interfaces, tipos y enums:**

- `type ReviewTab` (L29) = `\| 'diagnosis' \| 'banks' \| 'cash' \| 'receivables' \| 'assets' \| 'movements' \| 'reconciliation' \| 'audit'`

#### Clase `DayReviewPanelComponent` (L61–227)

- **Decoradores:** `@Component({ selector: 'app-day-review-panel', standalone: true, imports: [DatePipe, NgTemplateOutlet, IconComponent], templateUrl: './day-review-panel.component`
- **Propósito:** Read-only rendering of one day's diagnosis (from the backend) in tabs. When `canEdit` is true each correctable value shows a "Corregir" action that emits a `CorrectionRequest`; the page opens the correction modal.
- **Datos / estado que administra:** `@Input detail: FinancialDayDetail`, `@Input canEdit = false`, `@Output correct = new EventEmitter<CorrectionRequest>()`, `tab = signal<ReviewTab>('diagnosis')`, `movementFilter = signal<'ALL' \| MovementSource>('ALL')`, `expanded = signal<string \| null>(null)`, `filteredMovements = computed(() => { const filter = this.movementFilte`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `selectTab` | método public | 113–115 | `tab: ReviewTab` | `void` |
| `toggle` | método public | 117–119 | `key: string` | `void` |
| `money` | método public | 122–124 | `value: number \| null \| undefined` | `string` |
| `tone` | método public | 126–131 | `value: number \| null \| undefined` | `'positive' \| 'negative' \| 'zero'` |
| `correctSnapshot` | método public | 135–156 | `target: SnapshotTarget`, `targetId: string \| null`, `field: string`, `label: string`, `original: number \| null` | `void` |
| `correctDifference` | método public | 158–175 | `item: DifferenceItem` | `void` |
| `correctBankBalance` | método public | 177–193 | `bank: BankDiagnosis`, `field: 'previous_balance' \| 'final_balance'` | `void` |
| `correctMovement` | método public | 195–208 | `movement: DayMovement` | `void` |
| `correctPortfolioRow` | método public | 210–226 | `row: PortfolioRow`, `source: 'ACCOUNT_RECEIVABLE' \| 'ASSET'` | `void` |

##### `DayReviewPanelComponent.selectTab`

- **Firma:** `selectTab(tab: ReviewTab): void` — [day-review-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.ts#L113) (L113–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.tab.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.tab.set`
- **Consumidores:** `day-review-panel.component.html` (plantilla)

##### `DayReviewPanelComponent.toggle`

- **Firma:** `toggle(key: string): void` — [day-review-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.ts#L117) (L117–119)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.expanded.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.expanded.update`
- **Consumidores:** `day-review-panel.component.html` (plantilla)

##### `DayReviewPanelComponent.money`

- **Firma:** `money(value: number \| null \| undefined): string` — [day-review-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.ts#L122) (L122–124)
- **Propósito / descripción:** Shows "—" for a missing figure and the currency otherwise.
- **Dependencias (llamadas en su cuerpo):** `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `day-review-panel.component.html` (plantilla)

##### `DayReviewPanelComponent.tone`

- **Firma:** `tone(value: number \| null \| undefined): 'positive' \| 'negative' \| 'zero'` — [day-review-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.ts#L126) (L126–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.abs`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `day-review-panel.component.html` (plantilla)

##### `DayReviewPanelComponent.correctSnapshot`

- **Firma:** `correctSnapshot(target: SnapshotTarget, targetId: string \| null, field: string, label: string, original: number \| null): void` — [day-review-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.ts#L135) (L135–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.correct.emit`
- **Efectos secundarios:** Emite eventos: `this.correct.emit`
- **Consumidores:** [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts), [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts), `day-review-panel.component.html` (plantilla), (mismo archivo)

##### `DayReviewPanelComponent.correctDifference`

- **Firma:** `correctDifference(item: DifferenceItem): void` — [day-review-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.ts#L158) (L158–175)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.correctSnapshot`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `day-review-panel.component.html` (plantilla)

##### `DayReviewPanelComponent.correctBankBalance`

- **Firma:** `correctBankBalance(bank: BankDiagnosis, field: 'previous_balance' \| 'final_balance'): void` — [day-review-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.ts#L177) (L177–193)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.correctSnapshot`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `day-review-panel.component.html` (plantilla)

##### `DayReviewPanelComponent.correctMovement`

- **Firma:** `correctMovement(movement: DayMovement): void` — [day-review-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.ts#L195) (L195–208)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.correct.emit`
- **Efectos secundarios:** Emite eventos: `this.correct.emit`
- **Consumidores:** `day-review-panel.component.html` (plantilla)

##### `DayReviewPanelComponent.correctPortfolioRow`

- **Firma:** `correctPortfolioRow(row: PortfolioRow, source: 'ACCOUNT_RECEIVABLE' \| 'ASSET'): void` — [day-review-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/day-review-panel/day-review-panel.component.ts#L210) (L210–226)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.correct.emit`
- **Efectos secundarios:** Emite eventos: `this.correct.emit`
- **Consumidores:** `day-review-panel.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-open-review-modal-open-review-modal-component-ts"></a>

### open-review-modal.component.ts

- **Ruta:** [open-review-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/open-review-modal/open-review-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/open-review-modal/open-review-modal.component.ts`, 72 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-financial-day-review`
- **Responsabilidad:** "ABRIR DÍA PARA REVISIÓN" confirmation.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts), [financial-day-review-page.component.ts (plantilla)](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts) (plantilla)
- **Plantilla:** [open-review-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/open-review-modal/open-review-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="reason.set($event)"`, `(ngModelChange)="acknowledged.set($event)"`, `(click)="onCancel()"`, `(click)="onConfirm()"`

#### Clase `OpenReviewModalComponent` (L24–71)

- **Decoradores:** `@Component({ selector: 'app-open-review-modal', standalone: true, imports: [FormsModule, DatePipe, ButtonComponent, IconComponent], templateUrl: './open-review-m`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "ABRIR DÍA PARA REVISIÓN" confirmation. Dumb: the page performs the call. Requires a reason (≥ 5 chars, same as the backend) and an explicit acknowledgement; the backdrop never closes it and it cannot be submitted twice while saving.
- **Datos / estado que administra:** `@Input open = false`, `@Input date = null`, `@Input username = ''`, `@Input isSaving = false`, `@Input error = null`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`, `acknowledged = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 45–50 | `changes: SimpleChanges` | `void` |
| `canConfirm` | getter public | 52–58 | — | `boolean` |
| `onCancel` | método public | 60–64 | — | `void` |
| `onConfirm` | método public | 66–70 | — | `void` |

##### `OpenReviewModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [open-review-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/open-review-modal/open-review-modal.component.ts#L45) (L45–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.acknowledged.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`, `this.acknowledged.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `OpenReviewModalComponent.canConfirm`

- **Firma:** `canConfirm(): boolean` — [open-review-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/open-review-modal/open-review-modal.component.ts#L52) (L52–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason().trim`, `this.reason`, `this.acknowledged`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `OpenReviewModalComponent.onCancel`

- **Firma:** `onCancel(): void` — [open-review-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/open-review-modal/open-review-modal.component.ts#L60) (L60–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cancelled.emit`
- **Efectos secundarios:** Emite eventos: `this.cancelled.emit`
- **Consumidores:** `open-review-modal.component.html` (plantilla)

##### `OpenReviewModalComponent.onConfirm`

- **Firma:** `onConfirm(): void` — [open-review-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/components/open-review-modal/open-review-modal.component.ts#L66) (L66–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmed.emit`, `this.reason().trim`, `this.reason`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `open-review-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-spec-ts"></a>

### financial-day-review-page.component.spec.ts

- **Ruta:** [financial-day-review-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.spec.ts`, 151 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-financial-day-review`
- **Responsabilidad:** Prueba unitaria: declara `detail`, `session` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [financial-day-review.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-financial-day-review-service-ts), [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** —
#### Función `detail` (L11–26)

- **Tipo:** función local del archivo
- **Firma:** `detail(overrides?: Partial<FinancialDayDetail>): FinancialDayDetail` — [financial-day-review-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.spec.ts#L11)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts"></a>

### financial-day-review-page.component.ts

- **Ruta:** [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts`, 423 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-financial-day-review`
- **Responsabilidad:** Sistema → Administración financiera → Revisión de días operativos.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [financial-day-review.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-financial-day-review-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [day-review-panel.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-day-review-panel-day-review-panel-component-ts), [open-review-modal.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-open-review-modal-open-review-modal-component-ts), [correction-modal.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-correction-modal-correction-modal-component-ts), [close-review-modal.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-close-review-modal-close-review-modal-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts), [financial-day-review-page.component.spec.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-spec-ts)
- **Plantilla:** [financial-day-review-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [day-review-panel.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-day-review-panel-day-review-panel-component-ts), [open-review-modal.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-open-review-modal-open-review-modal-component-ts), [correction-modal.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-correction-modal-correction-modal-component-ts), [close-review-modal.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-close-review-modal-close-review-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="shiftMonth(-1)"`, `(click)="shiftMonth(1)"`, `(change)="goToDate($any($event.target).value)"`, `(click)="selectDay(cell.date)"`, `(input)="search.set($any($event.target).value)"`, `(click)="selectDay(day.date)"`, `(click)="openReviewModal()"`, `(click)="requestClose()"`, `(correct)="onCorrect($event)"`, `(confirmed)="confirmOpen($event)"`, `(cancelled)="cancelModal()"`, `(confirmed)="confirmCorrection($event)"`, `(confirmed)="confirmClose($event)"`

**Interfaces, tipos y enums:**

- `interface CalendarCell` (L58): sin documentación — miembros: `date`, `day`, `item`, `isToday`, `isFuture`

#### Clase `FinancialDayReviewPageComponent` (L73–422)

- **Decoradores:** `@Component({ selector: 'app-financial-day-review-page', standalone: true, imports: [ DatePipe, ButtonComponent, CardComponent, EmptyStateComponent, IconComponent`
- **Herencia / contratos:** implements OnInit
- **Propósito:** Sistema → Administración financiera → Revisión de días operativos. Pick a past day on the calendar/table, see its full diagnosis, open it in an audited review session, correct that day's data and close the review. The page only orchestrates: every figure, recalculation, isolation check and permission lives in the backend.
- **Servicios inyectados con `inject()`:** `service = inject(FinancialDayReviewService)`, `auth = inject(AuthService)`, `notifications = inject(NotificationService)`, `destroyRef = inject(DestroyRef)`
- **Datos / estado que administra:** `month = signal(this.today.slice(0, 7))`, `days = signal<FinancialDayListItem[]>([])`, `loadingDays = signal(false)`, `selectedDate = signal<string \| null>(null)`, `detail = signal<FinancialDayDetail \| null>(null)`, `loadingDetail = signal(false)`, `search = signal('')`, `isOpenModal = signal(false)`, `correctionRequest = signal<CorrectionRequest \| null>(null)`, `closeSummary = signal<CloseReviewSummary \| null>(null)`, `saving = signal(false)`, `modalError = signal<string \| null>(null)`, `username = computed(() => this.auth.currentUser()?.username ?`, `monthLabel = computed(() => { const [year, month] = this.month(`, `calendar = computed<CalendarCell[]>(() => { const [year, mont`, `filteredDays = computed(() => { const term = this.search().trim()`, `session = computed(() => this.detail()?.activeSession ?? nul`, `canEdit = computed(() => { const detail = this.detail(); ret`, `canOpenReview = computed(() => { const detail = this.detail(); con`, `selectedItem = computed( () => this.days().find((d) => d.date ===`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnInit` | método public | 192–194 | — | `void` |
| `loadDays` | método public | 196–217 | — | `void` |
| `shiftMonth` | método public | 219–224 | `delta: number` | `void` |
| `goToDate` | método public | 226–235 | `value: string` | `void` |
| `selectDay` | método public | 237–243 | `date: string \| null` | `void` |
| `reloadDetail` | método public | 245–266 | — | `void` |
| `openReviewModal` | método public | 270–273 | — | `void` |
| `confirmOpen` | método public | 275–300 | `reason: string` | `void` |
| `onCorrect` | método public | 304–310 | `request: CorrectionRequest` | `void` |
| `confirmCorrection` | método public | 312–350 | `submission: CorrectionSubmission` | `void` |
| `requestClose` | método public | 354–374 | — | `void` |
| `confirmClose` | método public | 376–403 | `submission: CloseReviewSubmission` | `void` |
| `cancelModal` | método public | 405–417 | — | `void` |
| `money` | método public | 419–421 | `value: number \| null \| undefined` | `string` |

##### `FinancialDayReviewPageComponent.ngOnInit`

- **Firma:** `ngOnInit(): void` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L192) (L192–194)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadDays`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialDayReviewPageComponent.loadDays`

- **Firma:** `loadDays(): void` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L196) (L196–217)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.month().split('-').map`, `this.month().split`, `this.month`, `pad`, `new Date(year, month, 0).getDate`, `new Date`, `this.loadingDays.set`, `this.service.listDays(from, to).pipe`, `this.service.listDays`, `finalize`, `takeUntilDestroyed`, `this.days.set`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingDays.set`, `this.days.set`
- **Consumidores:** (mismo archivo)

##### `FinancialDayReviewPageComponent.shiftMonth`

- **Firma:** `shiftMonth(delta: number): void` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L219) (L219–224)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.month().split('-').map`, `this.month().split`, `this.month`, `new Date`, `this.month.set`, `next.getFullYear`, `pad`, `next.getMonth`, `this.loadDays`
- **Efectos secundarios:** Actualiza estado (signals): `this.month.set`
- **Consumidores:** `financial-day-review-page.component.html` (plantilla)

##### `FinancialDayReviewPageComponent.goToDate`

- **Firma:** `goToDate(value: string): void` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L226) (L226–235)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `/^\d{4}-\d{2}-\d{2}$/.test`, `value.slice`, `this.month`, `this.month.set`, `this.loadDays`, `this.selectDay`
- **Efectos secundarios:** Actualiza estado (signals): `this.month.set`
- **Consumidores:** `financial-day-review-page.component.html` (plantilla)

##### `FinancialDayReviewPageComponent.selectDay`

- **Firma:** `selectDay(date: string \| null): void` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L237) (L237–243)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate.set`, `this.reloadDetail`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedDate.set`
- **Consumidores:** `financial-day-review-page.component.html` (plantilla), (mismo archivo)

##### `FinancialDayReviewPageComponent.reloadDetail`

- **Firma:** `reloadDetail(): void` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L245) (L245–266)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate`, `this.loadingDetail.set`, `this.service.getDay(date).pipe`, `this.service.getDay`, `finalize`, `takeUntilDestroyed`, `this.detail.set`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingDetail.set`, `this.detail.set`
- **Consumidores:** (mismo archivo)

##### `FinancialDayReviewPageComponent.openReviewModal`

- **Firma:** `openReviewModal(): void` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L270) (L270–273)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.modalError.set`, `this.isOpenModal.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.modalError.set`, `this.isOpenModal.set`
- **Consumidores:** `financial-day-review-page.component.html` (plantilla)

##### `FinancialDayReviewPageComponent.confirmOpen`

- **Firma:** `confirmOpen(reason: string): void` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L275) (L275–300)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedDate`, `this.saving`, `this.saving.set`, `this.modalError.set`, `this.service.openReview(date, reason).pipe`, `this.service.openReview`, `finalize`, `this.isOpenModal.set`, `this.notifications.success`, `this.reloadDetail`, `this.loadDays`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.saving.set`, `this.modalError.set`, `this.isOpenModal.set`
- **Consumidores:** `financial-day-review-page.component.html` (plantilla)

##### `FinancialDayReviewPageComponent.onCorrect`

- **Firma:** `onCorrect(request: CorrectionRequest): void` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L304) (L304–310)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canEdit`, `this.modalError.set`, `this.correctionRequest.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.modalError.set`, `this.correctionRequest.set`
- **Consumidores:** `financial-day-review-page.component.html` (plantilla)

##### `FinancialDayReviewPageComponent.confirmCorrection`

- **Firma:** `confirmCorrection(submission: CorrectionSubmission): void` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L312) (L312–350)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.session`, `this.saving`, `this.service.correctSnapshot`, `this.service.adjustMovement`, `this.saving.set`, `this.modalError.set`, `call.pipe(finalize(() => this.saving.set(false))).subscribe`, `call.pipe`, `finalize`, `this.correctionRequest.set`, `this.notifications.success`, `this.reloadDetail`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.saving.set`, `this.modalError.set`, `this.correctionRequest.set`
- **Consumidores:** `financial-day-review-page.component.html` (plantilla)

##### `FinancialDayReviewPageComponent.requestClose`

- **Firma:** `requestClose(): void` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L354) (L354–374)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.session`, `this.saving`, `this.saving.set`, `this.modalError.set`, `this.service.requestClose(session.id).pipe`, `this.service.requestClose`, `finalize`, `this.closeSummary.set`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.saving.set`, `this.modalError.set`, `this.closeSummary.set`
- **Consumidores:** `financial-day-review-page.component.html` (plantilla)

##### `FinancialDayReviewPageComponent.confirmClose`

- **Firma:** `confirmClose(submission: CloseReviewSubmission): void` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L376) (L376–403)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closeSummary`, `this.saving`, `this.saving.set`, `this.modalError.set`, `this.service.close`, `finalize`, `this.closeSummary.set`, `this.notifications.success`, `this.reloadDetail`, `this.loadDays`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.saving.set`, `this.modalError.set`, `this.closeSummary.set`
- **Consumidores:** `financial-day-review-page.component.html` (plantilla)

##### `FinancialDayReviewPageComponent.cancelModal`

- **Firma:** `cancelModal(): void` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L405) (L405–417)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saving`, `this.isOpenModal.set`, `this.correctionRequest.set`, `this.closeSummary`, `this.closeSummary.set`, `this.reloadDetail`, `this.modalError.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isOpenModal.set`, `this.correctionRequest.set`, `this.closeSummary.set`, `this.modalError.set`
- **Consumidores:** `financial-day-review-page.component.html` (plantilla)

##### `FinancialDayReviewPageComponent.money`

- **Firma:** `money(value: number \| null \| undefined): string` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L419) (L419–421)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `financial-day-review-page.component.html` (plantilla)

#### Función `guatemalaToday` (L48–52)

- **Tipo:** función exportada
- **Firma:** `guatemalaToday(): string` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L48)
- **Propósito / descripción:** Today's date in Guatemala (`yyyy-MM-dd`), the business time zone.
- **Dependencias:** `new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guatemala', }).format`, `new Intl.DateTimeFormat`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `pad` (L54–56)

- **Tipo:** función local del archivo
- **Firma:** `pad(value: number): string` — [financial-day-review-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts#L54)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `String(value).padStart`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

