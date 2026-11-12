# Frontend `dashboard-sales-register`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [business-card.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-business-card-business-card-component-ts) | .ts | Componente Angular | Feature (pantalla) | One negocio's daily card — same `.metric-card` visual language as Resumen's "Indicadores del mes" (see `FinancialIndicatorsComponent`): accent top border, hero amount, Ventas/Productos footer stats. | 7 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [cash-box-movement-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-cash-box-movement-modal-cash-box-movement-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Aportar" / "Retirar" efectivo de la caja de UN negocio — un solo modal parametrizado por `mode`, en vez de dos copias casi idénticas (`CashBoxContributionModalComponent`/`CashBoxWithdrawalModalComponent` de Recargas): ambos flujos son literalmente el mismo formulario (monto + concepto) con solo el | 7 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [sales-register-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-sales-register-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Gestión de Caja de Ventas" — a live, read-only view over the existing Ventas (`sales`/`sale_details`), grouped by negocio. | 9 internas; ext.: @angular/common, @angular/core, @angular/forms, @angular/router | 1 | Baja (1 consumidores) |
| [business-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `business-card.component.ts`; usa 3 componentes hijos: `app-card`, `app-icon`, `app-cash-box-movement-modal`. | — | — | Media |
| [business-card.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cash-box-movement-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/cash-box-movement-modal/cash-box-movement-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cash-box-movement-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [cash-box-movement-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/cash-box-movement-modal/cash-box-movement-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [sales-register-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/sales-register-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sales-register-page.component.ts`; usa 5 componentes hijos: `app-page-header`, `app-icon`, `app-report-summary`, `app-sales-register-business-card`, `app-empty-state`. | — | — | Media |
| [sales-register-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/sales-register-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-business-card-business-card-component-ts"></a>

### business-card.component.ts

- **Ruta:** [business-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.ts`, 140 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-sales-register`
- **Responsabilidad:** One negocio's daily card — same `.metric-card` visual language as Resumen's "Indicadores del mes" (see `FinancialIndicatorsComponent`): accent top border, hero amount, Ventas/Productos footer stats.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [sales-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-cash-box-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-box-movement-modal.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-cash-box-movement-modal-cash-box-movement-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [sales-register-page.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-sales-register-page-component-ts), [sales-register-page.component.ts (plantilla)](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-sales-register-page-component-ts) (plantilla)
- **Plantilla:** [business-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [cash-box-movement-modal.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-cash-box-movement-modal-cash-box-movement-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="toggle()"`, `(click)="openContribute()"`, `(click)="openWithdraw()"`, `(click)="toggleMovements()"`, `(click)="voidMovement(movement)"`, `(closed)="closeModal()"`, `(saved)="onMovementSaved()"`

#### Clase `SalesRegisterBusinessCardComponent` (L31–139)

- **Decoradores:** `@Component({ selector: 'app-sales-register-business-card', standalone: true, imports: [DatePipe, CardComponent, IconComponent, CashBoxMovementModalComponent], te`
- **Propósito:** One negocio's daily card — same `.metric-card` visual language as Resumen's "Indicadores del mes" (see `FinancialIndicatorsComponent`): accent top border, hero amount, Ventas/Productos footer stats. Two additions on top of the daily sales figures: the collapsible product breakdown (ventas de hoy) and the Caja de Ventas block (saldo acumulado + Aportar/Retirar + historial reciente) — a completely independent concept per negocio, not derived from "ventas del día".
- **Servicios inyectados con `inject()`:** `cashBoxService = inject(SalesCashBoxService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input business: SalesRegisterBusiness`, `@Input accentIndex = 0`, `@Input cashBoxBalance = null`, `@Input canManageCashBox = false`, `@Output cashBoxChanged = new EventEmitter<void>()`, `expanded = signal(false)`, `movementsExpanded = signal(false)`, `loadingMovements = signal(false)`, `movements = signal<SalesCashBoxMovement[]>([])`, `modalOpen = signal(false)`, `modalMode = signal<SalesCashBoxMovementType>('CONTRIBUTION')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `accentClass` | getter public | 66–68 | — | `string` |
| `toggle` | método public | 70–72 | — | `void` |
| `openContribute` | método public | 74–77 | — | `void` |
| `openWithdraw` | método public | 79–82 | — | `void` |
| `closeModal` | método public | 84–86 | — | `void` |
| `onMovementSaved` | método public | 88–94 | — | `void` |
| `toggleMovements` | método public | 96–101 | — | `void` |
| `fetchMovements` | método private | 103–115 | — | `void` |
| `voidMovement` | método public async | 117–138 | `movement: SalesCashBoxMovement` | `Promise<void>` |

##### `SalesRegisterBusinessCardComponent.accentClass`

- **Firma:** `accentClass(): string` — [business-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.ts#L66) (L66–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesRegisterBusinessCardComponent.toggle`

- **Firma:** `toggle(): void` — [business-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.ts#L70) (L70–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.expanded.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.expanded.update`
- **Consumidores:** `business-card.component.html` (plantilla)

##### `SalesRegisterBusinessCardComponent.openContribute`

- **Firma:** `openContribute(): void` — [business-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.ts#L74) (L74–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.modalMode.set`, `this.modalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.modalMode.set`, `this.modalOpen.set`
- **Consumidores:** `business-card.component.html` (plantilla)

##### `SalesRegisterBusinessCardComponent.openWithdraw`

- **Firma:** `openWithdraw(): void` — [business-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.ts#L79) (L79–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.modalMode.set`, `this.modalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.modalMode.set`, `this.modalOpen.set`
- **Consumidores:** `business-card.component.html` (plantilla)

##### `SalesRegisterBusinessCardComponent.closeModal`

- **Firma:** `closeModal(): void` — [business-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.ts#L84) (L84–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.modalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.modalOpen.set`
- **Consumidores:** `business-card.component.html` (plantilla)

##### `SalesRegisterBusinessCardComponent.onMovementSaved`

- **Firma:** `onMovementSaved(): void` — [business-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.ts#L88) (L88–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.modalOpen.set`, `this.cashBoxChanged.emit`, `this.movementsExpanded`, `this.fetchMovements`
- **Efectos secundarios:** Actualiza estado (signals): `this.modalOpen.set`; Emite eventos: `this.cashBoxChanged.emit`
- **Consumidores:** `business-card.component.html` (plantilla)

##### `SalesRegisterBusinessCardComponent.toggleMovements`

- **Firma:** `toggleMovements(): void` — [business-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.ts#L96) (L96–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.movementsExpanded.update`, `this.movementsExpanded`, `this.movements`, `this.fetchMovements`
- **Efectos secundarios:** Actualiza estado (signals): `this.movementsExpanded.update`
- **Consumidores:** `business-card.component.html` (plantilla)

##### `SalesRegisterBusinessCardComponent.fetchMovements`

- **Firma:** `fetchMovements(): void` — [business-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.ts#L103) (L103–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingMovements.set`, `this.cashBoxService.getMovements(this.business.businessId).subscribe`, `this.cashBoxService.getMovements`, `this.movements.set`, `this.notificationService.error`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingMovements.set`, `this.movements.set`
- **Consumidores:** (mismo archivo)

##### `SalesRegisterBusinessCardComponent.voidMovement`

- **Firma:** `voidMovement(movement: SalesCashBoxMovement): Promise<void>` — [business-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/business-card/business-card.component.ts#L117) (L117–138)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `formatCurrency`, `this.cashBoxService.voidMovement`, `this.notificationService.success`, `this.cashBoxChanged.emit`, `this.fetchMovements`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Emite eventos: `this.cashBoxChanged.emit`
- **Consumidores:** `business-card.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-cash-box-movement-modal-cash-box-movement-modal-component-ts"></a>

### cash-box-movement-modal.component.ts

- **Ruta:** [cash-box-movement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/cash-box-movement-modal/cash-box-movement-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/sales-register/components/cash-box-movement-modal/cash-box-movement-modal.component.ts`, 136 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-sales-register`
- **Responsabilidad:** "Aportar" / "Retirar" efectivo de la caja de UN negocio — un solo modal parametrizado por `mode`, en vez de dos copias casi idénticas (`CashBoxContributionModalComponent`/`CashBoxWithdrawalModalComponent` de Recargas): ambos flujos son literalmente el mismo formulario (monto + concepto) con solo el
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [sales-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-cash-box-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [business-card.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-business-card-business-card-component-ts), [business-card.component.ts (plantilla)](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-business-card-business-card-component-ts) (plantilla)
- **Plantilla:** [cash-box-movement-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/cash-box-movement-modal/cash-box-movement-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `CashBoxMovementModalComponent` (L34–135)

- **Decoradores:** `@Component({ selector: 'app-cash-box-movement-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective], te`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Aportar" / "Retirar" efectivo de la caja de UN negocio — un solo modal parametrizado por `mode`, en vez de dos copias casi idénticas (`CashBoxContributionModalComponent`/`CashBoxWithdrawalModalComponent` de Recargas): ambos flujos son literalmente el mismo formulario (monto + concepto) con solo el título/copy/validación de saldo distintos, así que duplicarlo aquí habría sido copiar por copiar, no una divergencia real. El backend (`register_sales_cash_box_movement`) es la única fuente de verdad sobre si un retiro excede el saldo — este modal nunca duplica ese chequeo, solo lo refleja en el mensaje de confirmación.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `cashBoxService = inject(SalesCashBoxService)`, `notificationService = inject(NotificationService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input mode = 'CONTRIBUTION'`, `@Input businessId = ''`, `@Input businessName = ''`, `@Input currentBalance = 0`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<SalesCashBoxMovement>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isWithdrawal` | getter public | 67–69 | — | `boolean` |
| `title` | getter public | 71–73 | — | `string` |
| `ngOnChanges` | método public | 75–82 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 84–127 | — | `Promise<void>` |
| `close` | método public | 129–134 | — | `void` |

##### `CashBoxMovementModalComponent.isWithdrawal`

- **Firma:** `isWithdrawal(): boolean` — [cash-box-movement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/cash-box-movement-modal/cash-box-movement-modal.component.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashBoxMovementModalComponent.title`

- **Firma:** `title(): string` — [cash-box-movement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/cash-box-movement-modal/cash-box-movement-modal.component.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashBoxMovementModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [cash-box-movement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/cash-box-movement-modal/cash-box-movement-modal.component.ts#L75) (L75–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashBoxMovementModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [cash-box-movement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/cash-box-movement-modal/cash-box-movement-modal.component.ts#L84) (L84–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.confirmDialogService.confirm`, `formatCurrency`, `concept.trim`, `this.cashBoxService.registerWithdrawal`, `this.cashBoxService.registerContribution`, `this.isSubmitting.set`, `request$.subscribe`, `this.notificationService.success`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `cash-box-movement-modal.component.html` (plantilla)

##### `CashBoxMovementModalComponent.close`

- **Firma:** `close(): void` — [cash-box-movement-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/components/cash-box-movement-modal/cash-box-movement-modal.component.ts#L129) (L129–134)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `cash-box-movement-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-sales-register-sales-register-page-component-ts"></a>

### sales-register-page.component.ts

- **Ruta:** [sales-register-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/sales-register-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/sales-register/sales-register-page.component.ts`, 237 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-sales-register`
- **Responsabilidad:** "Gestión de Caja de Ventas" — a live, read-only view over the existing Ventas (`sales`/`sale_details`), grouped by negocio.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [sales-register.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-register-service-ts), [sales-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-cash-box-service-ts), [business.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-business-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [business-card.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-business-card-business-card-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/router`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [sales-register-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/sales-register-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [report-summary.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-summary-report-summary-component-ts), [business-card.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-business-card-business-card-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts)
- **Eventos enlazados en la plantilla:** `(change)="onDateChange($any($event.target).value)"`, `(click)="onRefresh()"`, `(ngModelChange)="selectedBusinessId.set($event)"`, `(cashBoxChanged)="onCashBoxChanged()"`

#### Clase `SalesRegisterPageComponent` (L44–236)

- **Decoradores:** `@Component({ selector: 'app-sales-register-page', standalone: true, imports: [ FormsModule, PageHeaderComponent, ReportSummaryComponent, SalesRegisterBusinessCar`
- **Propósito:** "Gestión de Caja de Ventas" — a live, read-only view over the existing Ventas (`sales`/`sale_details`), grouped by negocio. Not a second sales system and not a physical cash box (see `GetSalesRegisterSummaryUseCase`'s own doc comment on the backend) — this page only ever reads `GET /sales-register/summary`, it registers nothing. Live-update strategy, deliberately mirrored from `AlertBellComponent` (this app's one existing "feels live without polling aggressively" precedent) rather than invented fresh: fetch on load, refetch every 60s, and refetch on every `NavigationEnd` (returning to this page after registering a sale elsewhere is exactly the moment the numbers are most likely stale) — plus a manual "Actualizar" button for the impatient case, since "no quiero esperar" was explicit in the ticket.
- **Servicios inyectados con `inject()`:** `salesRegisterService = inject(SalesRegisterService)`, `cashBoxService = inject(SalesCashBoxService)`, `businessService = inject(BusinessService)`, `authService = inject(AuthService)`, `router = inject(Router)`
- **Datos / estado que administra:** `businesses = signal<Business[]>([])`, `operationDate = signal(todayIsoDate())`, `summary = signal<SalesRegisterSummary \| null>(null)`, `loading = signal(true)`, `errorMessage = signal<string \| null>(null)`, `cashBoxBalances = signal<Map<string, number>>(new Map())`, `selectedBusinessId = signal('')`, `mergedBusinesses = computed<SalesRegisterBusiness[]>(() => { const da`, `visibleBusinesses = computed(() => { const filterId = this.selectedBus`, `tiles = computed<ReportSummaryTile[]>(() => { const data =`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `cashBoxBalanceFor` | método public | 179–181 | `businessId: string` | `number \| null` |
| `onCashBoxChanged` | método public | 184–186 | — | `void` |
| `fetchCashBoxBalances` | método private | 188–198 | — | `void` |
| `onDateChange` | método public | 200–206 | `value: string` | `void` |
| `onRefresh` | método public | 208–210 | — | `void` |
| `fetchSummary` | método private | 212–235 | `options?: { silent?: boolean }` | `void` |

##### `SalesRegisterPageComponent.cashBoxBalanceFor`

- **Firma:** `cashBoxBalanceFor(businessId: string): number \| null` — [sales-register-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/sales-register-page.component.ts#L179) (L179–181)
- **Propósito / descripción:** Saldo acumulado de Caja de Ventas para una tarjeta — `null` mientras carga (nunca "Q 0.00" engañoso).
- **Dependencias (llamadas en su cuerpo):** `this.cashBoxBalances().has`, `this.cashBoxBalances`, `this.cashBoxBalances().get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-register-page.component.html` (plantilla)

##### `SalesRegisterPageComponent.onCashBoxChanged`

- **Firma:** `onCashBoxChanged(): void` — [sales-register-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/sales-register-page.component.ts#L184) (L184–186)
- **Propósito / descripción:** Tras un aporte/retiro/anulación en cualquier tarjeta — refresca TODOS los saldos en una sola llamada, nunca uno por negocio.
- **Dependencias (llamadas en su cuerpo):** `this.fetchCashBoxBalances`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-register-page.component.html` (plantilla)

##### `SalesRegisterPageComponent.fetchCashBoxBalances`

- **Firma:** `fetchCashBoxBalances(): void` — [sales-register-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/sales-register-page.component.ts#L188) (L188–198)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cashBoxService.getBalances().subscribe`, `this.cashBoxService.getBalances`, `this.cashBoxBalances.set`, `new Map`, `balances.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashBoxBalances.set`
- **Consumidores:** (mismo archivo)

##### `SalesRegisterPageComponent.onDateChange`

- **Firma:** `onDateChange(value: string): void` — [sales-register-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/sales-register-page.component.ts#L200) (L200–206)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.operationDate.set`, `this.selectedBusinessId.set`, `this.fetchSummary`
- **Efectos secundarios:** Actualiza estado (signals): `this.operationDate.set`, `this.selectedBusinessId.set`
- **Consumidores:** `sales-register-page.component.html` (plantilla)

##### `SalesRegisterPageComponent.onRefresh`

- **Firma:** `onRefresh(): void` — [sales-register-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/sales-register-page.component.ts#L208) (L208–210)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.fetchSummary`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `sales-register-page.component.html` (plantilla)

##### `SalesRegisterPageComponent.fetchSummary`

- **Firma:** `fetchSummary(options?: { silent?: boolean }): void` — [sales-register-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/sales-register-page.component.ts#L212) (L212–235)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.errorMessage.set`, `this.salesRegisterService.getSummary(this.operationDate()).subscribe`, `this.salesRegisterService.getSummary`, `this.operationDate`, `this.summary.set`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.errorMessage.set`, `this.summary.set`
- **Consumidores:** (mismo archivo)

#### Función `todayIsoDate` (L18–24)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [sales-register-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-register/sales-register-page.component.ts#L18)
- **Propósito / descripción:** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique as `RechargeCashBoxPageComponent`'s own copy and every other date-driven page in this app.
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

