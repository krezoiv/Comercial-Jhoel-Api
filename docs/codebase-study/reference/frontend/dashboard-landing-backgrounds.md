# Frontend `dashboard-landing-backgrounds`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [background-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-form-modal-background-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `BackgroundFormModalComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [background-image-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-image-modal-background-image-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Gestor de la imagen de un fondo de landing — subir/reemplazar/eliminar. | 6 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [background-preview-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-preview-modal-background-preview-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Vista previa" desde la tabla — monta la MISMA `LandingBackgroundLayerComponent` que se renderiza en la landing pública (nunca una reconstrucción aparte), sobre contenido de ejemplo, con la configuración YA GUARDADA del fondo (a diferencia del panel de vista previa dentro del formulario, que refleja el borrador en edición). | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [background-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-table-background-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | A lo sumo un fondo activo por sección — sin orden entre sí, así que sin subir/bajar (a diferencia de `CatalogBankTableComponent`). | 2 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [landing-backgrounds-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Sistema → Fondos de Landing" — capas visuales de profundidad (imagen + opacidad + overlay + posición/tamaño + efecto 3D + parallax + movimiento) asignadas a una sección real de la landing pública. | 10 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [background-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `background-form-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-landing-background-layer`, `app-button`. | — | — | Media |
| [background-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [background-image-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `background-image-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [background-image-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [background-preview-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-preview-modal/background-preview-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `background-preview-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-landing-background-layer`, `app-button`. | — | — | Media |
| [background-preview-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-preview-modal/background-preview-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [background-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-table/background-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `background-table.component.ts`; usa 4 componentes hijos: `app-empty-state`, `app-button`, `app-icon`, `app-badge`. | — | — | Media |
| [background-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-table/background-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [landing-backgrounds-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `landing-backgrounds-page.component.ts`; usa 7 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-background-table`, `app-background-form-modal`, `app-background-image-modal`. | — | — | Media |
| [landing-backgrounds-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-form-modal-background-form-modal-component-ts"></a>

### background-form-modal.component.ts

- **Ruta:** [background-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.ts`, 192 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-landing-backgrounds`
- **Responsabilidad:** Componente Angular: declara `BackgroundFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [landing-background.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-landing-background-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [landing-backgrounds-page.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts), [landing-backgrounds-page.component.ts (plantilla)](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts) (plantilla)
- **Plantilla:** [background-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [landing-background-layer.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-landing-background-layer-landing-background-layer-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`, `(click)="submit()"`

#### Clase `BackgroundFormModalComponent` (L36–191)

- **Decoradores:** `@Component({ selector: 'app-background-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent, LandingBackgroundLayerCompon`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `landingBackgroundService = inject(LandingBackgroundService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input background = null`, `@Input activeSectionKeys = new Set()`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<LandingBackground>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 81–83 | — | `boolean` |
| `ngOnChanges` | método public | 85–105 | `changes: SimpleChanges` | `void` |
| `previewImageUrl` | método public | 118–120 | — | `string \| null` |
| `isSectionTaken` | método public | 123–129 | `sectionKey: string` | `boolean` |
| `submit` | método public async | 131–177 | — | `Promise<void>` |
| `close` | método public async | 179–190 | — | `Promise<void>` |

##### `BackgroundFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [background-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BackgroundFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [background-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.ts#L85) (L85–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BackgroundFormModalComponent.previewImageUrl`

- **Firma:** `previewImageUrl(): string \| null` — [background-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.ts#L118) (L118–120)
- **Propósito / descripción:** Getters planos, nunca `computed()` — leídos por el panel de vista previa en cada ciclo de detección de cambios. Un `FormControl.value` es una propiedad plana, no una señal: envolverlo en `computed()` nunca se invalidaría con la escritura del usuario (gotcha ya documentado en este proyecto — ver `AccountStatementModalComponent`). Como este componente SÍ dispara CD en cada evento de su propio formulario (todo evento de un binding disparado desde la propia plantilla de un componente OnPush corre CD para ese componente), una lectura directa aquí ya refleja el valor más reciente sin necesidad de una señal.
- **Dependencias (llamadas en su cuerpo):** `this.landingBackgroundService.getImageUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `background-form-modal.component.html` (plantilla)

##### `BackgroundFormModalComponent.isSectionTaken`

- **Firma:** `isSectionTaken(sectionKey: string): boolean` — [background-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.ts#L123) (L123–129)
- **Propósito / descripción:** true si la sección seleccionada ahora mismo ya está tomada por OTRO fondo activo.
- **Dependencias (llamadas en su cuerpo):** `this.activeSectionKeys.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `background-form-modal.component.html` (plantilla), (mismo archivo)

##### `BackgroundFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [background-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.ts#L131) (L131–177)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.isSectionTaken`, `this.confirmDialogService.confirm`, `raw.name.trim`, `this.isSubmitting.set`, `this.landingBackgroundService.updateBackground`, `this.landingBackgroundService.createBackground`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `background-form-modal.component.html` (plantilla)

##### `BackgroundFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [background-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.ts#L179) (L179–190)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `background-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-image-modal-background-image-modal-component-ts"></a>

### background-image-modal.component.ts

- **Ruta:** [background-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.ts`, 111 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-landing-backgrounds`
- **Responsabilidad:** Gestor de la imagen de un fondo de landing — subir/reemplazar/eliminar.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [landing-background.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-landing-background-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [landing-backgrounds-page.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts), [landing-backgrounds-page.component.ts (plantilla)](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts) (plantilla)
- **Plantilla:** [background-image-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(change)="onFileSelected($event)"`, `(click)="removeImage()"`

#### Clase `BackgroundImageModalComponent` (L14–110)

- **Decoradores:** `@Component({ selector: 'app-background-image-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './background-image-modal.componen`
- **Propósito:** Gestor de la imagen de un fondo de landing — subir/reemplazar/eliminar. Clon de `BankImageModalComponent`.
- **Servicios inyectados con `inject()`:** `landingBackgroundService = inject(LandingBackgroundService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input background = null`, `@Output closed = new EventEmitter<void>()`, `@Output changed = new EventEmitter<LandingBackground>()`, `isUploading = signal(false)`, `isRemoving = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 35–37 | — | `boolean` |
| `imageUrl` | getter public | 39–41 | — | `string \| null` |
| `onFileSelected` | método public | 43–68 | `event: Event` | `void` |
| `removeImage` | método public async | 70–92 | — | `Promise<void>` |
| `close` | método public | 94–96 | — | `void` |
| `refetch` | método private | 98–109 | `backgroundId: string`, `done?: () => void` | `void` |

##### `BackgroundImageModalComponent.open`

- **Firma:** `open(): boolean` — [background-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BackgroundImageModalComponent.imageUrl`

- **Firma:** `imageUrl(): string \| null` — [background-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.landingBackgroundService.getImageUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BackgroundImageModalComponent.onFileSelected`

- **Firma:** `onFileSelected(event: Event): void` — [background-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.ts#L43) (L43–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `file.type.startsWith`, `this.notificationService.error`, `this.isUploading.set`, `this.landingBackgroundService.setImage(background.id, file).subscribe`, `this.landingBackgroundService.setImage`, `this.refetch`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isUploading.set`
- **Consumidores:** `background-image-modal.component.html` (plantilla)

##### `BackgroundImageModalComponent.removeImage`

- **Firma:** `removeImage(): Promise<void>` — [background-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.ts#L70) (L70–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.isRemoving.set`, `this.landingBackgroundService.removeImage(background.id).subscribe`, `this.landingBackgroundService.removeImage`, `this.refetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isRemoving.set`
- **Consumidores:** `background-image-modal.component.html` (plantilla)

##### `BackgroundImageModalComponent.close`

- **Firma:** `close(): void` — [background-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.ts#L94) (L94–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `background-image-modal.component.html` (plantilla)

##### `BackgroundImageModalComponent.refetch`

- **Firma:** `refetch(backgroundId: string, done?: () => void): void` — [background-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.ts#L98) (L98–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.landingBackgroundService.getBackgroundById(backgroundId).subscribe`, `this.landingBackgroundService.getBackgroundById`, `done`, `this.changed.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Emite eventos: `this.changed.emit`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-preview-modal-background-preview-modal-component-ts"></a>

### background-preview-modal.component.ts

- **Ruta:** [background-preview-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-preview-modal/background-preview-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-preview-modal/background-preview-modal.component.ts`, 41 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-landing-backgrounds`
- **Responsabilidad:** "Vista previa" desde la tabla — monta la MISMA `LandingBackgroundLayerComponent` que se renderiza en la landing pública (nunca una reconstrucción aparte), sobre contenido de ejemplo, con la configuración YA GUARDADA del fondo (a diferencia del panel de vista previa dentro del formulario, que refleja el borrador en edición).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [landing-background.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-landing-background-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [landing-backgrounds-page.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts), [landing-backgrounds-page.component.ts (plantilla)](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts) (plantilla)
- **Plantilla:** [background-preview-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-preview-modal/background-preview-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [landing-background-layer.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-landing-background-layer-landing-background-layer-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`

#### Clase `BackgroundPreviewModalComponent` (L14–40)

- **Decoradores:** `@Component({ selector: 'app-background-preview-modal', standalone: true, imports: [ButtonComponent, IconComponent, LandingBackgroundLayerComponent], templateUrl:`
- **Propósito:** "Vista previa" desde la tabla — monta la MISMA `LandingBackgroundLayerComponent` que se renderiza en la landing pública (nunca una reconstrucción aparte), sobre contenido de ejemplo, con la configuración YA GUARDADA del fondo (a diferencia del panel de vista previa dentro del formulario, que refleja el borrador en edición).
- **Servicios inyectados con `inject()`:** `landingBackgroundService = inject(LandingBackgroundService)`
- **Datos / estado que administra:** `@Input background = null`, `@Output closed = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 29–31 | — | `boolean` |
| `imageUrl` | getter public | 33–35 | — | `string \| null` |
| `close` | método public | 37–39 | — | `void` |

##### `BackgroundPreviewModalComponent.open`

- **Firma:** `open(): boolean` — [background-preview-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-preview-modal/background-preview-modal.component.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BackgroundPreviewModalComponent.imageUrl`

- **Firma:** `imageUrl(): string \| null` — [background-preview-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-preview-modal/background-preview-modal.component.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.landingBackgroundService.getImageUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BackgroundPreviewModalComponent.close`

- **Firma:** `close(): void` — [background-preview-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-preview-modal/background-preview-modal.component.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `background-preview-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-table-background-table-component-ts"></a>

### background-table.component.ts

- **Ruta:** [background-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-table/background-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-table/background-table.component.ts`, 31 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-landing-backgrounds`
- **Responsabilidad:** A lo sumo un fondo activo por sección — sin orden entre sí, así que sin subir/bajar (a diferencia de `CatalogBankTableComponent`).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [landing-backgrounds-page.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts), [landing-backgrounds-page.component.ts (plantilla)](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts) (plantilla)
- **Plantilla:** [background-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-table/background-table.component.html) · **Usa componentes:** [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="addBackground.emit()"`, `(click)="edit.emit(background)"`, `(click)="manageImage.emit(background)"`, `(click)="preview.emit(background)"`, `(click)="toggleActive.emit(background)"`

#### Clase `BackgroundTableComponent` (L10–30)

- **Decoradores:** `@Component({ selector: 'app-background-table', standalone: true, imports: [DatePipe, BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templa`
- **Propósito:** A lo sumo un fondo activo por sección — sin orden entre sí, así que sin subir/bajar (a diferencia de `CatalogBankTableComponent`).
- **Datos / estado que administra:** `@Input backgrounds = []`, `@Input loading = false`, `@Output edit = new EventEmitter<LandingBackground>()`, `@Output manageImage = new EventEmitter<LandingBackground>()`, `@Output preview = new EventEmitter<LandingBackground>()`, `@Output toggleActive = new EventEmitter<LandingBackground>()`, `@Output addBackground = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `sectionLabel` | propiedad-función public | 21–21 | `key` | (inferido) |

##### `BackgroundTableComponent.sectionLabel`

- **Firma:** `sectionLabel(key)` — [background-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-table/background-table.component.ts#L21) (L21–21)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `background-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts"></a>

### landing-backgrounds-page.component.ts

- **Ruta:** [landing-backgrounds-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts`, 162 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-landing-backgrounds`
- **Responsabilidad:** "Sistema → Fondos de Landing" — capas visuales de profundidad (imagen + opacidad + overlay + posición/tamaño + efecto 3D + parallax + movimiento) asignadas a una sección real de la landing pública.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [landing-background.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-landing-background-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [background-table.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-table-background-table-component-ts), [background-form-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-form-modal-background-form-modal-component-ts), [background-image-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-image-modal-background-image-modal-component-ts), [background-preview-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-preview-modal-background-preview-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [landing-backgrounds-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [background-table.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-table-background-table-component-ts), [background-form-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-form-modal-background-form-modal-component-ts), [background-image-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-image-modal-background-image-modal-component-ts), [background-preview-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-preview-modal-background-preview-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="openCreateForm()"`, `(edit)="openEditForm($event)"`, `(manageImage)="openImage($event)"`, `(preview)="openPreview($event)"`, `(toggleActive)="toggleActive($event)"`, `(addBackground)="openCreateForm()"`, `(closed)="closeForm()"`, `(saved)="onBackgroundSaved($event)"`, `(closed)="closeImage()"`, `(changed)="onImageChanged($event)"`, `(closed)="closePreview()"`

#### Clase `LandingBackgroundsPageComponent` (L23–161)

- **Decoradores:** `@Component({ selector: 'app-landing-backgrounds-page', standalone: true, imports: [ PageHeaderComponent, ButtonComponent, IconComponent, BackgroundTableComponent`
- **Propósito:** "Sistema → Fondos de Landing" — capas visuales de profundidad (imagen + opacidad + overlay + posición/tamaño + efecto 3D + parallax + movimiento) asignadas a una sección real de la landing pública. Clon estructural de `CatalogBanksPageComponent` — sin orden (`sortOrder`), ya que a lo sumo un fondo activo existe por sección, así que no hay nada que reordenar entre sí.
- **Servicios inyectados con `inject()`:** `landingBackgroundService = inject(LandingBackgroundService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `backgrounds = signal<LandingBackground[]>([])`, `loading = signal(true)`, `isFormOpen = signal(false)`, `editingBackground = signal<LandingBackground \| null>(null)`, `imageBackground = signal<LandingBackground \| null>(null)`, `previewBackground = signal<LandingBackground \| null>(null)`, `activeSectionKeys = computed( () => new Set(this.backgrounds().filter(`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `sectionLabel` | propiedad-función public | 58–59 | `sectionKey: string` | `string` |
| `fetchBackgrounds` | método public | 65–77 | — | `void` |
| `openCreateForm` | método public | 79–82 | — | `void` |
| `openEditForm` | método public | 84–87 | `background: LandingBackground` | `void` |
| `closeForm` | método public | 89–91 | — | `void` |
| `onBackgroundSaved` | método public | 93–109 | `background: LandingBackground` | `void` |
| `openImage` | método public | 111–113 | `background: LandingBackground` | `void` |
| `closeImage` | método public | 115–117 | — | `void` |
| `onImageChanged` | método public | 119–122 | `background: LandingBackground` | `void` |
| `openPreview` | método public | 124–126 | `background: LandingBackground` | `void` |
| `closePreview` | método public | 128–130 | — | `void` |
| `toggleActive` | método public async | 132–160 | `background: LandingBackground` | `Promise<void>` |

##### `LandingBackgroundsPageComponent.sectionLabel`

- **Firma:** `sectionLabel(sectionKey: string): string` — [landing-backgrounds-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts#L58) (L58–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `LANDING_SECTION_OPTIONS.find`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackgroundsPageComponent.fetchBackgrounds`

- **Firma:** `fetchBackgrounds(): void` — [landing-backgrounds-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts#L65) (L65–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.landingBackgroundService.getBackgrounds(true).subscribe`, `this.landingBackgroundService.getBackgrounds`, `this.backgrounds.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.backgrounds.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackgroundsPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [landing-backgrounds-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts#L79) (L79–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingBackground.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingBackground.set`, `this.isFormOpen.set`
- **Consumidores:** `landing-backgrounds-page.component.html` (plantilla)

##### `LandingBackgroundsPageComponent.openEditForm`

- **Firma:** `openEditForm(background: LandingBackground): void` — [landing-backgrounds-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts#L84) (L84–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingBackground.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingBackground.set`, `this.isFormOpen.set`
- **Consumidores:** `landing-backgrounds-page.component.html` (plantilla)

##### `LandingBackgroundsPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [landing-backgrounds-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts#L89) (L89–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `landing-backgrounds-page.component.html` (plantilla)

##### `LandingBackgroundsPageComponent.onBackgroundSaved`

- **Firma:** `onBackgroundSaved(background: LandingBackground): void` — [landing-backgrounds-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts#L93) (L93–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingBackground`, `this.isFormOpen.set`, `this.backgrounds.update`, `list.map`, `this.notificationService.success`, `this.imageBackground.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.backgrounds.update`, `this.imageBackground.set`
- **Consumidores:** `landing-backgrounds-page.component.html` (plantilla)

##### `LandingBackgroundsPageComponent.openImage`

- **Firma:** `openImage(background: LandingBackground): void` — [landing-backgrounds-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts#L111) (L111–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageBackground.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageBackground.set`
- **Consumidores:** `landing-backgrounds-page.component.html` (plantilla)

##### `LandingBackgroundsPageComponent.closeImage`

- **Firma:** `closeImage(): void` — [landing-backgrounds-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts#L115) (L115–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageBackground.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageBackground.set`
- **Consumidores:** `landing-backgrounds-page.component.html` (plantilla)

##### `LandingBackgroundsPageComponent.onImageChanged`

- **Firma:** `onImageChanged(background: LandingBackground): void` — [landing-backgrounds-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts#L119) (L119–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageBackground.set`, `this.backgrounds.update`, `list.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageBackground.set`, `this.backgrounds.update`
- **Consumidores:** `landing-backgrounds-page.component.html` (plantilla)

##### `LandingBackgroundsPageComponent.openPreview`

- **Firma:** `openPreview(background: LandingBackground): void` — [landing-backgrounds-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts#L124) (L124–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.previewBackground.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.previewBackground.set`
- **Consumidores:** `landing-backgrounds-page.component.html` (plantilla)

##### `LandingBackgroundsPageComponent.closePreview`

- **Firma:** `closePreview(): void` — [landing-backgrounds-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts#L128) (L128–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.previewBackground.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.previewBackground.set`
- **Consumidores:** `landing-backgrounds-page.component.html` (plantilla)

##### `LandingBackgroundsPageComponent.toggleActive`

- **Firma:** `toggleActive(background: LandingBackground): Promise<void>` — [landing-backgrounds-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts#L132) (L132–160)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.landingBackgroundService.activateBackground`, `this.landingBackgroundService.deactivateBackground`, `request$.subscribe`, `this.backgrounds.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.backgrounds.update`
- **Consumidores:** `landing-backgrounds-page.component.html` (plantilla)

