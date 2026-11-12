# Frontend `dashboard-transaction-banks`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [delete-confirm-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-delete-confirm-modal-delete-confirm-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [transaction-bank-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-form-modal-transaction-bank-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `TransactionBankFormModalComponent` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [transaction-bank-image-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-image-modal-transaction-bank-image-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Logo del banco agente — subir/reemplazar/eliminar. | 7 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [transaction-bank-summary.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-summary-transaction-bank-summary-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `TransactionBankSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [transaction-bank-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-table-transaction-bank-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `TransactionBankTableComponent`, `TransactionBankSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código). | 4 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [transaction-bank-toolbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-toolbar-transaction-bank-toolbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `TransactionBankToolbarComponent`, `StatusFilterOption`, `TransactionBankStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [transaction-banks-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `TransactionBanksPageComponent` (sin comentario de documentación en el código). | 12 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/delete-confirm-modal/delete-confirm-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `delete-confirm-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [delete-confirm-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/delete-confirm-modal/delete-confirm-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-bank-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-form-modal/transaction-bank-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-bank-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [transaction-bank-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-form-modal/transaction-bank-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-bank-image-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-image-modal/transaction-bank-image-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-bank-image-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [transaction-bank-image-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-image-modal/transaction-bank-image-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-bank-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-summary/transaction-bank-summary.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-bank-summary.component.ts`; usa 2 componentes hijos: `app-card`, `app-summary-tile`. | — | — | Media |
| [transaction-bank-summary.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-summary/transaction-bank-summary.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-bank-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-table/transaction-bank-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-bank-table.component.ts`; usa 4 componentes hijos: `app-icon`, `app-empty-state`, `app-button`, `app-badge`. | — | — | Media |
| [transaction-bank-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-table/transaction-bank-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-bank-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-toolbar/transaction-bank-toolbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-bank-toolbar.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [transaction-bank-toolbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-toolbar/transaction-bank-toolbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-banks-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-banks-page.component.ts`; usa 7 componentes hijos: `app-page-header`, `app-transaction-bank-summary`, `app-transaction-bank-toolbar`, `app-transaction-bank-table`, `app-transaction-bank-form-modal`, `app-transaction-bank-delete-confirm-modal`. | — | — | Media |
| [transaction-banks-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-delete-confirm-modal-delete-confirm-modal-component-ts"></a>

### delete-confirm-modal.component.ts

- **Ruta:** [delete-confirm-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/delete-confirm-modal/delete-confirm-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/delete-confirm-modal/delete-confirm-modal.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-banks`
- **Responsabilidad:** Componente Angular: declara `DeleteConfirmModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [transaction-banks-page.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts), [transaction-banks-page.component.ts (plantilla)](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts) (plantilla)
- **Plantilla:** [delete-confirm-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/delete-confirm-modal/delete-confirm-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="cancelled.emit()"`, `(click)="confirmed.emit()"`

#### Clase `DeleteConfirmModalComponent` (L6–21)

- **Decoradores:** `@Component({ selector: 'app-transaction-bank-delete-confirm-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './delete-confirm-m`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input open = false`, `@Input transactionBank = null`, `@Input isDeleting = false`, `@Output confirmed = new EventEmitter<void>()`, `@Output cancelled = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-form-modal-transaction-bank-form-modal-component-ts"></a>

### transaction-bank-form-modal.component.ts

- **Ruta:** [transaction-bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-form-modal/transaction-bank-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-form-modal/transaction-bank-form-modal.component.ts`, 122 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-banks`
- **Responsabilidad:** Componente Angular: declara `TransactionBankFormModalComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [transaction-bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-transaction-bank-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [transaction-banks-page.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts), [transaction-banks-page.component.ts (plantilla)](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts) (plantilla)
- **Plantilla:** [transaction-bank-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-form-modal/transaction-bank-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `TransactionBankFormModalComponent` (L21–121)

- **Decoradores:** `@Component({ selector: 'app-transaction-bank-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './trans`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `transactionBankService = inject(TransactionBankService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input transactionBank = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<TransactionBank>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 50–52 | — | `boolean` |
| `ngOnChanges` | método public | 54–67 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 69–107 | — | `Promise<void>` |
| `close` | método public async | 109–120 | — | `Promise<void>` |

##### `TransactionBankFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [transaction-bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-form-modal/transaction-bank-form-modal.component.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBankFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [transaction-bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-form-modal/transaction-bank-form-modal.component.ts#L54) (L54–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBankFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [transaction-bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-form-modal/transaction-bank-form-modal.component.ts#L69) (L69–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.transactionBankService.updateTransactionBank`, `Number`, `this.transactionBankService.createTransactionBank`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `transaction-bank-form-modal.component.html` (plantilla)

##### `TransactionBankFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [transaction-bank-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-form-modal/transaction-bank-form-modal.component.ts#L109) (L109–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `transaction-bank-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-image-modal-transaction-bank-image-modal-component-ts"></a>

### transaction-bank-image-modal.component.ts

- **Ruta:** [transaction-bank-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-image-modal/transaction-bank-image-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-image-modal/transaction-bank-image-modal.component.ts`, 112 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-banks`
- **Responsabilidad:** Logo del banco agente — subir/reemplazar/eliminar.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [transaction-bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-transaction-bank-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [transaction-bank-account.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-transaction-bank-account-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [transaction-banks-page.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts), [transaction-banks-page.component.ts (plantilla)](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts) (plantilla)
- **Plantilla:** [transaction-bank-image-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-image-modal/transaction-bank-image-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(change)="onFileSelected($event)"`, `(click)="removeImage()"`

#### Clase `TransactionBankImageModalComponent` (L20–111)

- **Decoradores:** `@Component({ selector: 'app-transaction-bank-image-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './transaction-bank-image-mo`
- **Propósito:** Logo del banco agente — subir/reemplazar/eliminar. Clon de `BankImageModalComponent` (Catálogo de Bancos) más una vista previa de cómo se verá el icono en el modal "Selecciona el banco" de Transaccionar.
- **Servicios inyectados con `inject()`:** `transactionBankService = inject(TransactionBankService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input bank = null`, `@Output closed = new EventEmitter<void>()`, `@Output changed = new EventEmitter<TransactionBank>()`, `isUploading = signal(false)`, `isRemoving = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `imageUrl` | getter public | 41–43 | — | `string \| null` |
| `monogram` | getter public | 45–47 | — | `string` |
| `onFileSelected` | método public | 49–78 | `event: Event` | `void` |
| `removeImage` | método public async | 80–106 | — | `Promise<void>` |
| `close` | método public | 108–110 | — | `void` |

##### `TransactionBankImageModalComponent.imageUrl`

- **Firma:** `imageUrl(): string \| null` — [transaction-bank-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-image-modal/transaction-bank-image-modal.component.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `transactionBankImageUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBankImageModalComponent.monogram`

- **Firma:** `monogram(): string` — [transaction-bank-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-image-modal/transaction-bank-image-modal.component.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `transactionBankMonogram`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBankImageModalComponent.onFileSelected`

- **Firma:** `onFileSelected(event: Event): void` — [transaction-bank-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-image-modal/transaction-bank-image-modal.component.ts#L49) (L49–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isUploading`, `ALLOWED_TYPES.includes`, `this.notificationService.error`, `this.isUploading.set`, `this.transactionBankService.setImage(bank.id, file).subscribe`, `this.transactionBankService.setImage`, `this.notificationService.success`, `this.changed.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isUploading.set`; Emite eventos: `this.changed.emit`
- **Consumidores:** `transaction-bank-image-modal.component.html` (plantilla)

##### `TransactionBankImageModalComponent.removeImage`

- **Firma:** `removeImage(): Promise<void>` — [transaction-bank-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-image-modal/transaction-bank-image-modal.component.ts#L80) (L80–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isRemoving`, `this.confirmDialogService.confirm`, `this.isRemoving.set`, `this.transactionBankService.removeImage(bank.id).subscribe`, `this.transactionBankService.removeImage`, `this.notificationService.success`, `this.changed.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isRemoving.set`; Emite eventos: `this.changed.emit`
- **Consumidores:** `transaction-bank-image-modal.component.html` (plantilla)

##### `TransactionBankImageModalComponent.close`

- **Firma:** `close(): void` — [transaction-bank-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-image-modal/transaction-bank-image-modal.component.ts#L108) (L108–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `transaction-bank-image-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-summary-transaction-bank-summary-component-ts"></a>

### transaction-bank-summary.component.ts

- **Ruta:** [transaction-bank-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-summary/transaction-bank-summary.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-summary/transaction-bank-summary.component.ts`, 60 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-banks`
- **Responsabilidad:** Componente Angular: declara `TransactionBankSummaryComponent`, `SummaryTile` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [transaction-banks-page.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts), [transaction-banks-page.component.ts (plantilla)](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts) (plantilla)
- **Plantilla:** [transaction-bank-summary.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-summary/transaction-bank-summary.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts)

**Interfaces, tipos y enums:**

- `interface SummaryTile` (L6): sin documentación — miembros: `icon`, `title`, `value`, `description`, `tone`

#### Clase `TransactionBankSummaryComponent` (L14–59)

- **Decoradores:** `@Component({ selector: 'app-transaction-bank-summary', standalone: true, imports: [CardComponent, SummaryTileComponent], templateUrl: './transaction-bank-summary`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `transactionBanks = signal<TransactionBank[]>([])`, `tiles = computed<SummaryTile[]>(() => { const transactionB`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `data` | setter public | 25–28 | `value: TransactionBank[]` | (inferido) |

##### `TransactionBankSummaryComponent.data`

- **Firma:** `data(value: TransactionBank[])` — [transaction-bank-summary.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-summary/transaction-bank-summary.component.ts#L25) (L25–28)
- **Decoradores:** `@Input({ required: true })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionBanks.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionBanks.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-table-transaction-bank-table-component-ts"></a>

### transaction-bank-table.component.ts

- **Ruta:** [transaction-bank-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-table/transaction-bank-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-table/transaction-bank-table.component.ts`, 83 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-banks`
- **Responsabilidad:** Componente Angular: declara `TransactionBankTableComponent`, `TransactionBankSortColumn`, `SortDirection`, `SKELETON_ROWS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [transaction-bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-transaction-bank-service-ts), [transaction-bank-account.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-transaction-bank-account-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [transaction-banks-page.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts), [transaction-banks-page.component.ts (plantilla)](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts) (plantilla)
- **Plantilla:** [transaction-bank-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-table/transaction-bank-table.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addTransactionBank.emit()"`, `(click)="toggleSort('name')"`, `(click)="toggleSort('isActive')"`, `(click)="image.emit(transactionBank)"`, `(click)="edit.emit(transactionBank)"`, `(click)="delete.emit(transactionBank)"`

**Interfaces, tipos y enums:**

- `type TransactionBankSortColumn` (L9) = `'name' \| 'isActive' \| 'createdAt'`
- `type SortDirection` (L10) = `'asc' \| 'desc'`

#### Clase `TransactionBankTableComponent` (L15–82)

- **Decoradores:** `@Component({ selector: 'app-transaction-bank-table', standalone: true, imports: [NgTemplateOutlet, BadgeComponent, ButtonComponent, IconComponent, EmptyStateComp`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `transactionBanksInput = signal<TransactionBank[]>([])`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Input canManage = true`, `@Output edit = new EventEmitter<TransactionBank>()`, `@Output image = new EventEmitter<TransactionBank>()`, `@Output delete = new EventEmitter<TransactionBank>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addTransactionBank = new EventEmitter<void>()`, `sortColumn = signal<TransactionBankSortColumn>('createdAt')`, `sortDirection = signal<SortDirection>('desc')`, `sortedTransactionBanks = computed(() => { const column = this.sortColumn();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `transactionBanks` | setter public | 28–31 | `value: TransactionBank[]` | (inferido) |
| `toggleSort` | método public | 67–74 | `column: TransactionBankSortColumn` | `void` |
| `sortIcon` | método public | 76–81 | `column: TransactionBankSortColumn` | `string` |

##### `TransactionBankTableComponent.transactionBanks`

- **Firma:** `transactionBanks(value: TransactionBank[])` — [transaction-bank-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-table/transaction-bank-table.component.ts#L28) (L28–31)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionBanksInput.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionBanksInput.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBankTableComponent.toggleSort`

- **Firma:** `toggleSort(column: TransactionBankSortColumn): void` — [transaction-bank-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-table/transaction-bank-table.component.ts#L67) (L67–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.sortDirection.update`, `this.sortColumn.set`, `this.sortDirection.set`
- **Consumidores:** `transaction-bank-table.component.html` (plantilla)

##### `TransactionBankTableComponent.sortIcon`

- **Firma:** `sortIcon(column: TransactionBankSortColumn): string` — [transaction-bank-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-table/transaction-bank-table.component.ts#L76) (L76–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sortColumn`, `this.sortDirection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaction-bank-table.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-toolbar-transaction-bank-toolbar-component-ts"></a>

### transaction-bank-toolbar.component.ts

- **Ruta:** [transaction-bank-toolbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-toolbar/transaction-bank-toolbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-toolbar/transaction-bank-toolbar.component.ts`, 39 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-banks`
- **Responsabilidad:** Componente Angular: declara `TransactionBankToolbarComponent`, `StatusFilterOption`, `TransactionBankStatusFilterValue`, `STATUS_FILTER_OPTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [transaction-banks-page.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts), [transaction-banks-page.component.ts (plantilla)](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts) (plantilla)
- **Plantilla:** [transaction-bank-toolbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/components/transaction-bank-toolbar/transaction-bank-toolbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="searchTermChange.emit($event)"`, `(click)="addTransactionBank.emit()"`, `(click)="statusFilterChange.emit(option.value)"`

**Interfaces, tipos y enums:**

- `interface StatusFilterOption` (L8): sin documentación — miembros: `value`, `label`
- `type TransactionBankStatusFilterValue` (L6) = `'all' \| 'active' \| 'inactive'`

#### Clase `TransactionBankToolbarComponent` (L19–38)

- **Decoradores:** `@Component({ selector: 'app-transaction-bank-toolbar', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './transaction-bank`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input searchTerm = ''`, `@Input statusFilter = 'all'`, `@Input canManage = true`, `@Output searchTermChange = new EventEmitter<string>()`, `@Output statusFilterChange = new EventEmitter<TransactionBankStatusFilterValue>`, `@Output addTransactionBank = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts"></a>

### transaction-banks-page.component.ts

- **Ruta:** [transaction-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts`, 176 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-transaction-banks`
- **Responsabilidad:** Componente Angular: declara `TransactionBanksPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [transaction-bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-transaction-bank-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [transaction-bank-summary.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-summary-transaction-bank-summary-component-ts), [transaction-bank-toolbar.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-toolbar-transaction-bank-toolbar-component-ts), [transaction-bank-table.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-table-transaction-bank-table-component-ts), [transaction-bank-form-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-form-modal-transaction-bank-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-delete-confirm-modal-delete-confirm-modal-component-ts), [transaction-bank-image-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-image-modal-transaction-bank-image-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [transaction-banks-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [transaction-bank-summary.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-summary-transaction-bank-summary-component-ts), [transaction-bank-toolbar.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-toolbar-transaction-bank-toolbar-component-ts), [transaction-bank-table.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-table-transaction-bank-table-component-ts), [transaction-bank-form-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-form-modal-transaction-bank-form-modal-component-ts), [delete-confirm-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-delete-confirm-modal-delete-confirm-modal-component-ts), [transaction-bank-image-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-image-modal-transaction-bank-image-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(searchTermChange)="searchTerm.set($event)"`, `(statusFilterChange)="statusFilter.set($event)"`, `(addTransactionBank)="openCreateForm()"`, `(edit)="openEditForm($event)"`, `(image)="openImageModal($event)"`, `(delete)="requestDelete($event)"`, `(clearFilters)="clearFilters()"`, `(closed)="closeForm()"`, `(saved)="onTransactionBankSaved($event)"`, `(confirmed)="confirmDelete()"`, `(cancelled)="cancelDelete()"`, `(closed)="closeImageModal()"`, `(changed)="onImageChanged($event)"`

#### Clase `TransactionBanksPageComponent` (L17–175)

- **Decoradores:** `@Component({ selector: 'app-transaction-banks-page', standalone: true, imports: [ PageHeaderComponent, TransactionBankSummaryComponent, TransactionBankToolbarCom`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `transactionBankService = inject(TransactionBankService)`, `notificationService = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `transactionBanks = signal<TransactionBank[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<TransactionBankStatusFilterValue>('all')`, `isFormOpen = signal(false)`, `editingTransactionBank = signal<TransactionBank \| null>(null)`, `isDeleteOpen = signal(false)`, `deletingTransactionBank = signal<TransactionBank \| null>(null)`, `isDeleting = signal(false)`, `imageTransactionBank = signal<TransactionBank \| null>(null)`, `filteredTransactionBanks = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed( () => this.searchTerm().trim().length > `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchTransactionBanks` | método private | 82–95 | — | `void` |
| `openCreateForm` | método public | 97–100 | — | `void` |
| `openEditForm` | método public | 102–105 | `transactionBank: TransactionBank` | `void` |
| `closeForm` | método public | 107–109 | — | `void` |
| `onTransactionBankSaved` | método public | 111–122 | `transactionBank: TransactionBank` | `void` |
| `requestDelete` | método public | 124–127 | `transactionBank: TransactionBank` | `void` |
| `cancelDelete` | método public | 129–132 | — | `void` |
| `confirmDelete` | método public | 134–156 | — | `void` |
| `openImageModal` | método public | 158–160 | `transactionBank: TransactionBank` | `void` |
| `closeImageModal` | método public | 162–164 | — | `void` |
| `onImageChanged` | método public | 166–169 | `updated: TransactionBank` | `void` |
| `clearFilters` | método public | 171–174 | — | `void` |

##### `TransactionBanksPageComponent.fetchTransactionBanks`

- **Firma:** `fetchTransactionBanks(): void` — [transaction-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts#L82) (L82–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.transactionBankService.getTransactionBanks(true).subscribe`, `this.transactionBankService.getTransactionBanks`, `this.transactionBanks.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.transactionBanks.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBanksPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [transaction-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts#L97) (L97–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingTransactionBank.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingTransactionBank.set`, `this.isFormOpen.set`
- **Consumidores:** `transaction-banks-page.component.html` (plantilla)

##### `TransactionBanksPageComponent.openEditForm`

- **Firma:** `openEditForm(transactionBank: TransactionBank): void` — [transaction-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts#L102) (L102–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingTransactionBank.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingTransactionBank.set`, `this.isFormOpen.set`
- **Consumidores:** `transaction-banks-page.component.html` (plantilla)

##### `TransactionBanksPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [transaction-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts#L107) (L107–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `transaction-banks-page.component.html` (plantilla)

##### `TransactionBanksPageComponent.onTransactionBankSaved`

- **Firma:** `onTransactionBankSaved(transactionBank: TransactionBank): void` — [transaction-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts#L111) (L111–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingTransactionBank`, `this.isFormOpen.set`, `this.transactionBanks.update`, `list.map`, `this.notificationService.success`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.transactionBanks.update`
- **Consumidores:** `transaction-banks-page.component.html` (plantilla)

##### `TransactionBanksPageComponent.requestDelete`

- **Firma:** `requestDelete(transactionBank: TransactionBank): void` — [transaction-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts#L124) (L124–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingTransactionBank.set`, `this.isDeleteOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.deletingTransactionBank.set`, `this.isDeleteOpen.set`
- **Consumidores:** `transaction-banks-page.component.html` (plantilla)

##### `TransactionBanksPageComponent.cancelDelete`

- **Firma:** `cancelDelete(): void` — [transaction-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts#L129) (L129–132)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isDeleteOpen.set`, `this.deletingTransactionBank.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleteOpen.set`, `this.deletingTransactionBank.set`
- **Consumidores:** `transaction-banks-page.component.html` (plantilla)

##### `TransactionBanksPageComponent.confirmDelete`

- **Firma:** `confirmDelete(): void` — [transaction-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts#L134) (L134–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.deletingTransactionBank`, `this.isDeleting.set`, `this.transactionBankService.deleteTransactionBank(transactionBank.id).subscribe`, `this.transactionBankService.deleteTransactionBank`, `this.isDeleteOpen.set`, `this.deletingTransactionBank.set`, `this.transactionBanks.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isDeleting.set`, `this.isDeleteOpen.set`, `this.deletingTransactionBank.set`, `this.transactionBanks.update`
- **Consumidores:** `transaction-banks-page.component.html` (plantilla)

##### `TransactionBanksPageComponent.openImageModal`

- **Firma:** `openImageModal(transactionBank: TransactionBank): void` — [transaction-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts#L158) (L158–160)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageTransactionBank.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageTransactionBank.set`
- **Consumidores:** `transaction-banks-page.component.html` (plantilla)

##### `TransactionBanksPageComponent.closeImageModal`

- **Firma:** `closeImageModal(): void` — [transaction-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts#L162) (L162–164)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageTransactionBank.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageTransactionBank.set`
- **Consumidores:** `transaction-banks-page.component.html` (plantilla)

##### `TransactionBanksPageComponent.onImageChanged`

- **Firma:** `onImageChanged(updated: TransactionBank): void` — [transaction-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts#L166) (L166–169)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionBanks.update`, `list.map`, `this.imageTransactionBank.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionBanks.update`, `this.imageTransactionBank.set`
- **Consumidores:** `transaction-banks-page.component.html` (plantilla)

##### `TransactionBanksPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [transaction-banks-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-banks/transaction-banks-page.component.ts#L171) (L171–174)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `transaction-banks-page.component.html` (plantilla)

