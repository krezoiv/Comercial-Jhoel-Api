# Frontend `dashboard-school-lists`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [school-dashboard.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-dashboard-school-dashboard-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Tablero" of Listas Escolares — figures come straight from the backend. | 3 internas; ext.: @angular/core, @angular/forms | 3 | Media (3 consumidores) |
| [school-payment-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-payment-modal-school-payment-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Registrar abono": amount, method, optional bank/reference and notes, with a live "saldo actual → saldo después" preview. | 7 internas; ext.: @angular/common, @angular/core, @angular/forms | 5 | Media (5 consumidores) |
| [school-quotation-editor.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotation-editor-school-quotation-editor-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Nueva cotización" / "Editar cotización": 1) customer, 2) grade + list customization, 3) financial summary and anticipo. | 8 internas; ext.: @angular/common, @angular/core, @angular/forms | 4 | Media (4 consumidores) |
| [school-quotations-list.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotations-list-school-quotations-list-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Listado general de cotizaciones": filters (customer, phone, number, grade, status, dates) applied on demand, server-side pagination and the actions the role may run on each row. | 9 internas; ext.: @angular/common, @angular/core, @angular/forms, @angular/router | 3 | Media (3 consumidores) |
| [school-reason-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-reason-modal-school-reason-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Mandatory reason (≥ 5 characters) for an audited correction: voiding a payment or cancelling a quotation. | 2 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [school-templates.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-templates-school-templates-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Plantillas de Listas Escolares": the official list of each grade. | 7 internas; ext.: @angular/common, @angular/core, @angular/forms | 3 | Media (3 consumidores) |
| [school-documents.service.ts](#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-documents-service-ts) | .ts | Servicio | Feature (pantalla) | Downloads or prints the documents of Listas Escolares (quotation PDF and payment receipts). | 5 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [school-lists-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Listas Escolares": dashboard, quotation list, new quotation and the official templates per grade. | 7 internas; ext.: @angular/core, @angular/router | 1 | Baja (1 consumidores) |
| [school-lists.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `quotation`, `setup`, `summary`, `template`, `product` (sin comentario de documentación en el código). | 10 internas; ext.: @angular/common, @angular/core, @angular/router, rxjs | 0 | Soporte (pruebas) |
| [school-quotation-detail-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-detail-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Detail of a school quotation: customer, grade, lines, financial cards, account statement (with receipts and audited reversals), observations and the change history. | 10 internas; ext.: @angular/common, @angular/core, @angular/forms, @angular/router | 1 | Baja (1 consumidores) |
| [school-quotation-edit-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-edit-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Editar cotización": the same editor as "Nueva cotización", loaded with the quotation's own lines and its `version` (a concurrent edit is rejected by the backend with a clear message). | 5 internas; ext.: @angular/common, @angular/core, @angular/router | 1 | Baja (1 consumidores) |
| [_school-lists.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/_school-lists.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [school-dashboard.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-dashboard/school-dashboard.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `school-dashboard.component.ts`; usa 4 componentes hijos: `app-button`, `app-summary-tile`, `app-donut-chart`, `app-line-chart`. | — | — | Media |
| [school-dashboard.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-dashboard/school-dashboard.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [school-payment-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-payment-modal/school-payment-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `school-payment-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [school-payment-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-payment-modal/school-payment-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [school-quotation-editor.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `school-quotation-editor.component.ts`; usa 4 componentes hijos: `app-icon`, `app-badge`, `app-quotation-product-search`, `app-button`. | — | — | Media |
| [school-quotation-editor.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [school-quotations-list.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `school-quotations-list.component.ts`; usa 5 componentes hijos: `app-icon`, `app-button`, `app-badge`, `app-report-pagination`, `app-school-payment-modal`. | — | — | Media |
| [school-quotations-list.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [school-reason-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-reason-modal/school-reason-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `school-reason-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [school-reason-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-reason-modal/school-reason-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [school-templates.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `school-templates.component.ts`; usa 4 componentes hijos: `app-icon`, `app-button`, `app-badge`, `app-quotation-product-search`. | — | — | Media |
| [school-templates.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [school-lists-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-lists-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `school-lists-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-icon`, `app-school-dashboard`, `app-school-quotations-list`, `app-school-quotation-editor`, `app-school-templates`. | — | — | Media |
| [school-lists-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-lists-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [school-quotation-detail-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `school-quotation-detail-page.component.ts`; usa 6 componentes hijos: `app-icon`, `app-badge`, `app-button`, `app-summary-tile`, `app-school-payment-modal`, `app-school-reason-modal`. | — | — | Media |
| [school-quotation-detail-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-dashboard-school-dashboard-component-ts"></a>

### school-dashboard.component.ts

- **Ruta:** [school-dashboard.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-dashboard/school-dashboard.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-dashboard/school-dashboard.component.ts`, 114 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-school-lists`
- **Responsabilidad:** "Tablero" of Listas Escolares — figures come straight from the backend.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [school-list.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-school-list-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [school-lists-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-page-component-ts), [school-lists.spec.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-spec-ts), [school-lists-page.component.ts (plantilla)](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-page-component-ts) (plantilla)
- **Plantilla:** [school-dashboard.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-dashboard/school-dashboard.component.html) · **Usa componentes:** [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts), [donut-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-donut-chart-donut-chart-component-ts), [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="dateFrom.set($event)"`, `(ngModelChange)="dateTo.set($event)"`, `(click)="load()"`, `(click)="openList.emit()"`

#### Clase `SchoolDashboardComponent` (L58–113)

- **Decoradores:** `@Component({ selector: 'app-school-dashboard', standalone: true, imports: [FormsModule, ButtonComponent, SummaryTileComponent, DonutChartComponent, LineChartComp`
- **Propósito:** "Tablero" of Listas Escolares — figures come straight from the backend.
- **Servicios inyectados con `inject()`:** `service = inject(SchoolListService)`
- **Datos / estado que administra:** `@Output openList = new EventEmitter<void>()`, `dateFrom = signal('${guatemalaToday().slice(0, 4)}-01-01')`, `dateTo = signal(guatemalaToday())`, `data = signal<SchoolDashboard \| null>(null)`, `loading = signal(false)`, `failed = signal(false)`, `gradeSegments = computed<DonutSegment[]>(() => (this.data()?.byGra`, `incomePoints = computed(() => { const data = this.data(); return `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `load` | método public | 96–109 | — | `void` |
| `formatMoney` | propiedad-función public | 111–111 | `value: number` | (inferido) |
| `formatCount` | propiedad-función public | 112–112 | `value: number` | (inferido) |

##### `SchoolDashboardComponent.load`

- **Firma:** `load(): void` — [school-dashboard.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-dashboard/school-dashboard.component.ts#L96) (L96–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.failed.set`, `this.service.getDashboard`, `this.dateFrom`, `this.dateTo`, `this.data.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.failed.set`, `this.data.set`
- **Consumidores:** `school-dashboard.component.html` (plantilla)

##### `SchoolDashboardComponent.formatMoney`

- **Firma:** `formatMoney(value: number)` — [school-dashboard.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-dashboard/school-dashboard.component.ts#L111) (L111–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolDashboardComponent.formatCount`

- **Firma:** `formatCount(value: number)` — [school-dashboard.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-dashboard/school-dashboard.component.ts#L112) (L112–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `formatQuantity`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

#### Función `eachDay` (L19–28)

- **Tipo:** función exportada
- **Firma:** `eachDay(from: string, to: string): string[]` — [school-dashboard.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-dashboard/school-dashboard.component.ts#L19)
- **Propósito / descripción:** Every `yyyy-MM-dd` between two dates (inclusive), without time-zone drift.
- **Dependencias:** `new Date`, `days.push`, `cursor.toISOString().slice`, `cursor.toISOString`, `cursor.setUTCDate`, `cursor.getUTCDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `buildIncomePoints` (L35–55)

- **Tipo:** función exportada
- **Firma:** `buildIncomePoints(dashboard: SchoolDashboard): LineChartPoint[]` — [school-dashboard.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-dashboard/school-dashboard.component.ts#L35)
- **Propósito / descripción:** Income per period: one point per day for ranges up to two months, one per month otherwise. Days without payments are drawn as zero (net of devoluciones/anulaciones, as the backend reports them).
- **Dependencias:** `new Map`, `dashboard.incomeByDay.map`, `eachDay`, `days.map`, `String`, `Number`, `day.slice`, `byDay.get`, `byMonth.set`, `byMonth.get`, `[...byMonth.entries()].map`, `byMonth.entries`, `month.slice`, `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-payment-modal-school-payment-modal-component-ts"></a>

### school-payment-modal.component.ts

- **Ruta:** [school-payment-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-payment-modal/school-payment-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-payment-modal/school-payment-modal.component.ts`, 148 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-school-lists`
- **Responsabilidad:** "Registrar abono": amount, method, optional bank/reference and notes, with a live "saldo actual → saldo después" preview.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [school-list.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-school-list-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [school-quotations-list.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotations-list-school-quotations-list-component-ts), [school-lists.spec.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-spec-ts), [school-quotation-detail-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-detail-page-component-ts), [school-quotations-list.component.ts (plantilla)](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotations-list-school-quotations-list-component-ts) (plantilla), [school-quotation-detail-page.component.ts (plantilla)](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-detail-page-component-ts) (plantilla)
- **Plantilla:** [school-payment-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-payment-modal/school-payment-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closed.emit()"`, `(ngModelChange)="amount.set($event === '' \|\| $event === null ? null : +$event)"`, `(click)="payAll()"`, `(ngModelChange)="method.set($event)"`, `(ngModelChange)="bankId.set($event)"`, `(ngModelChange)="reference.set($event)"`, `(ngModelChange)="observations.set($event)"`, `(click)="save()"`

#### Clase `SchoolPaymentModalComponent` (L30–147)

- **Decoradores:** `@Component({ selector: 'app-school-payment-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './school-payment-modal`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Registrar abono": amount, method, optional bank/reference and notes, with a live "saldo actual → saldo después" preview. One `clientRequestId` per opening, so a double click or a retry never registers the payment twice (the backend returns the same payment). The backend validates the amount against the real balance under a lock.
- **Servicios inyectados con `inject()`:** `service = inject(SchoolListService)`, `banks = inject(BankService)`, `confirm = inject(ConfirmDialogService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `current = signal<SchoolQuotationSummary \| null>(null)`, `@Output closed = new EventEmitter<void>()`, `@Output paid = new EventEmitter<{ paymentId: string; quotation: S`, `amount = signal<number \| null>(null)`, `method = signal<SchoolPaymentMethod>('EFECTIVO')`, `bankId = signal('')`, `reference = signal('')`, `observations = signal('')`, `saving = signal(false)`, `error = signal<string \| null>(null)`, `bankList = signal<Bank[]>([])`, `balance = computed(() => this.quotation?.balance ?? 0)`, `usesBank = computed(() => SCHOOL_BANK_METHODS.includes(this.m`, `after = computed(() => roundMoney(this.balance() - (this.a`, `amountError = computed(() => { const amount = this.amount(); if `, `canSave = computed(() => !this.saving() && this.amount() !==`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `quotation` | setter public | 40–42 | `value: SchoolQuotationSummary \| null` | (inferido) |
| `quotation` | getter public | 43–45 | — | `SchoolQuotationSummary \| null` |
| `ngOnChanges` | método public | 87–100 | `changes: SimpleChanges` | `void` |
| `payAll` | método public | 102–104 | — | `void` |
| `save` | método public async | 106–146 | — | `Promise<void>` |

##### `SchoolPaymentModalComponent.quotation`

- **Firma:** `quotation(value: SchoolQuotationSummary \| null)` — [school-payment-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-payment-modal/school-payment-modal.component.ts#L40) (L40–42)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Quotation receiving the payment; null keeps the modal closed (signal-backed).
- **Dependencias (llamadas en su cuerpo):** `this.current.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.current.set`
- **Consumidores:** [school-quotation-detail-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-detail-page-component-ts), [school-quotation-detail-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-detail-page-component-ts)

##### `SchoolPaymentModalComponent.quotation`

- **Firma:** `quotation(): SchoolQuotationSummary \| null` — [school-payment-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-payment-modal/school-payment-modal.component.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.current`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-quotation-detail-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-detail-page-component-ts), [school-quotation-detail-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-detail-page-component-ts)

##### `SchoolPaymentModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [school-payment-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-payment-modal/school-payment-modal.component.ts#L87) (L87–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.amount.set`, `this.method.set`, `this.bankId.set`, `this.reference.set`, `this.observations.set`, `this.error.set`, `crypto.randomUUID`, `this.bankList`, `this.banks.getBanks().subscribe`, `this.banks.getBanks`, `this.bankList.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.amount.set`, `this.method.set`, `this.bankId.set`, `this.reference.set`, `this.observations.set`, `this.error.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolPaymentModalComponent.payAll`

- **Firma:** `payAll(): void` — [school-payment-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-payment-modal/school-payment-modal.component.ts#L102) (L102–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.amount.set`, `this.balance`
- **Efectos secundarios:** Actualiza estado (signals): `this.amount.set`
- **Consumidores:** `school-payment-modal.component.html` (plantilla)

##### `SchoolPaymentModalComponent.save`

- **Firma:** `save(): Promise<void>` — [school-payment-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-payment-modal/school-payment-modal.component.ts#L106) (L106–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.amount`, `this.canSave`, `this.confirm.confirm`, `formatCurrency`, `this.method`, `this.after`, `this.saving.set`, `this.error.set`, `this.service.registerPayment`, `this.usesBank`, `this.bankId`, `this.reference().trim`, `this.reference`, `this.observations().trim`, `this.observations`, `this.notifications.success`, `this.paid.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.saving.set`, `this.error.set`; Emite eventos: `this.paid.emit`
- **Consumidores:** `school-payment-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotation-editor-school-quotation-editor-component-ts"></a>

### school-quotation-editor.component.ts

- **Ruta:** [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts`, 439 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-school-lists`
- **Responsabilidad:** "Nueva cotización" / "Editar cotización": 1) customer, 2) grade + list customization, 3) financial summary and anticipo.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [school-list.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-school-list-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [quotation-product-search.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [school-lists-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-page-component-ts), [school-lists.spec.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-spec-ts), [school-quotation-edit-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-edit-page-component-ts), [school-lists-page.component.ts (plantilla)](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-page-component-ts) (plantilla)
- **Plantilla:** [school-quotation-editor.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [quotation-product-search.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="customerName.set($event)"`, `(ngModelChange)="customerPhone.set($event)"`, `(ngModelChange)="studentName.set($event)"`, `(ngModelChange)="quotationDate.set($event)"`, `(ngModelChange)="deliveryDate.set($event)"`, `(click)="selectTemplate(t)"`, `(ngModelChange)="update(line.key, { productName: $event })"`, `(ngModelChange)="update(line.key, { observations: $event })"`, `(productSelected)="replaceWith(line.key, $event)"`, `(click)="makeManual(line.key)"`, `(click)="replacingKey.set(null)"`, `(click)="step(line, -1)"`, `(ngModelChange)="setNumber(line.key, 'quantity', $event)"`, `(click)="step(line, 1)"`, `(ngModelChange)="setNumber(line.key, 'unitPrice', $event)"`

**Interfaces, tipos y enums:**

- `interface EditorLine` (L42): One editable line of the quotation being built. — miembros: `key`, `itemId`, `templateItemId`, `productId`, `productName`, `description`, `quantity`, `unitPrice`, `discount`, `observations`, `source`, `referencePrice`

#### Clase `SchoolQuotationEditorComponent` (L87–438)

- **Decoradores:** `@Component({ selector: 'app-school-quotation-editor', standalone: true, imports: [FormsModule, BadgeComponent, ButtonComponent, IconComponent, QuotationProductSe`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Nueva cotización" / "Editar cotización": 1) customer, 2) grade + list customization, 3) financial summary and anticipo. The template is only read: every change lives in the quotation's own copy of the lines. Live totals are a preview; the backend recomputes and validates them when saving.
- **Servicios inyectados con `inject()`:** `service = inject(SchoolListService)`, `banks = inject(BankService)`, `confirm = inject(ConfirmDialogService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `current = signal<SchoolQuotation \| null>(null)`, `@Output saved = new EventEmitter<SchoolQuotation>()`, `@Output cancelled = new EventEmitter<void>()`, `customerName = signal('')`, `customerPhone = signal('')`, `studentName = signal('')`, `quotationDate = signal(guatemalaToday())`, `deliveryDate = signal('')`, `observations = signal('')`, `templates = signal<SchoolTemplateSummary[]>([])`, `templatesFailed = signal(false)`, `template = signal<SchoolTemplate \| null>(null)`, `loadingTemplate = signal(false)`, `lines = signal<EditorLine[]>([])`, `replacingKey = signal<string \| null>(null)`, `withAdvance = signal(false)`, `advanceAmount = signal<number \| null>(null)`, `advanceMethod = signal<SchoolPaymentMethod>('EFECTIVO')`, `advanceBankId = signal('')`, `advanceReference = signal('')`, `asDraft = signal(false)`, `bankList = signal<Bank[]>([])`, `saving = signal(false)`, `error = signal<string \| null>(null)`, `touched = signal(false)`, `isEdit = computed(() => this.quotation !== null)`, `canOverride = computed(() => this.service.can('school_lists.pric`, `canAdvance = computed(() => !this.isEdit() && this.service.can(`, `gradeLabel = computed(() => this.quotation?.grade ?? this.templ`, `itemCount = computed(() => this.lines().reduce((sum, l) => sum`…

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `quotation` | setter public | 97–99 | `value: SchoolQuotation \| null` | (inferido) |
| `quotation` | getter public | 100–102 | — | `SchoolQuotation \| null` |
| `ngOnChanges` | método public | 197–223 | `changes: SimpleChanges` | `void` |
| `selectTemplate` | método public async | 226–268 | `summary: SchoolTemplateSummary` | `Promise<void>` |
| `priceEditable` | método public | 271–273 | `line: EditorLine` | `boolean` |
| `update` | método public | 275–277 | `key: string`, `patch: Partial<EditorLine>` | `void` |
| `setNumber` | método public | 279–282 | `key: string`, `field: 'quantity' \| 'unitPrice' \| 'discount'`, `value: unknown` | `void` |
| `step` | método public | 284–286 | `line: EditorLine`, `delta: number` | `void` |
| `remove` | método public | 288–290 | `key: string` | `void` |
| `addManual` | método public | 292–310 | — | `void` |
| `addProduct` | método public | 313–320 | `product: Product` | `void` |
| `replaceWith` | método public | 323–328 | `key: string`, `product: Product` | `void` |
| `makeManual` | método public | 331–334 | `key: string` | `void` |
| `fromProduct` | método private | 336–351 | `product: Product` | `EditorLine` |
| `nextKey` | método private | 353–356 | — | `string` |
| `toggleAdvance` | método public | 359–364 | `on: boolean` | `void` |
| `items` | método private | 367–379 | — | `SchoolQuotationItemInput[]` |
| `save` | método public async | 381–437 | — | `Promise<void>` |

##### `SchoolQuotationEditorComponent.quotation`

- **Firma:** `quotation(value: SchoolQuotation \| null)` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L97) (L97–99)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Quotation to edit; null builds a new one (signal-backed so computeds react).
- **Dependencias (llamadas en su cuerpo):** `this.current.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.current.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolQuotationEditorComponent.quotation`

- **Firma:** `quotation(): SchoolQuotation \| null` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L100) (L100–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.current`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolQuotationEditorComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L197) (L197–223)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.customerName.set`, `this.customerPhone.set`, `this.studentName.set`, `this.quotationDate.set`, `this.deliveryDate.set`, `this.observations.set`, `this.lines.set`, `q.items.map`, `this.nextKey`
- **Efectos secundarios:** Actualiza estado (signals): `this.customerName.set`, `this.customerPhone.set`, `this.studentName.set`, `this.quotationDate.set`, `this.deliveryDate.set`, `this.observations.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolQuotationEditorComponent.selectTemplate`

- **Firma:** `selectTemplate(summary: SchoolTemplateSummary): Promise<void>` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L226) (L226–268)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.template`, `this.lines`, `this.confirm.confirm`, `this.loadingTemplate.set`, `this.service.getTemplate(summary.id).subscribe`, `this.service.getTemplate`, `this.template.set`, `this.lines.set`, `template.items.map`, `this.nextKey`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingTemplate.set`, `this.template.set`, `this.lines.set`
- **Consumidores:** `school-quotation-editor.component.html` (plantilla)

##### `SchoolQuotationEditorComponent.priceEditable`

- **Firma:** `priceEditable(line: EditorLine): boolean` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L271) (L271–273)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canOverride`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `school-quotation-editor.component.html` (plantilla)

##### `SchoolQuotationEditorComponent.update`

- **Firma:** `update(key: string, patch: Partial<EditorLine>): void` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L275) (L275–277)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.lines.update`, `lines.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.lines.update`
- **Consumidores:** `school-quotation-editor.component.html` (plantilla), (mismo archivo)

##### `SchoolQuotationEditorComponent.setNumber`

- **Firma:** `setNumber(key: string, field: 'quantity' \| 'unitPrice' \| 'discount', value: unknown): void` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L279) (L279–282)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Number`, `this.update`, `Number.isFinite`
- **Efectos secundarios:** Actualiza estado (signals): `this.update`
- **Consumidores:** `school-quotation-editor.component.html` (plantilla)

##### `SchoolQuotationEditorComponent.step`

- **Firma:** `step(line: EditorLine, delta: number): void` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L284) (L284–286)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.update`, `Math.min`, `Math.max`
- **Efectos secundarios:** Actualiza estado (signals): `this.update`
- **Consumidores:** `school-quotation-editor.component.html` (plantilla), (mismo archivo)

##### `SchoolQuotationEditorComponent.remove`

- **Firma:** `remove(key: string): void` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L288) (L288–290)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.lines.update`, `lines.filter`
- **Efectos secundarios:** Actualiza estado (signals): `this.lines.update`
- **Consumidores:** `school-quotation-editor.component.html` (plantilla)

##### `SchoolQuotationEditorComponent.addManual`

- **Firma:** `addManual(): void` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L292) (L292–310)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.lines.update`, `this.nextKey`
- **Efectos secundarios:** Actualiza estado (signals): `this.lines.update`
- **Consumidores:** `school-quotation-editor.component.html` (plantilla)

##### `SchoolQuotationEditorComponent.addProduct`

- **Firma:** `addProduct(product: Product): void` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L313) (L313–320)
- **Propósito / descripción:** Adds an inventory product (or one more unit if it is already a plain inventory line).
- **Dependencias (llamadas en su cuerpo):** `this.lines().find`, `this.lines`, `this.step`, `this.lines.update`, `this.fromProduct`
- **Efectos secundarios:** Actualiza estado (signals): `this.lines.update`
- **Consumidores:** `school-quotation-editor.component.html` (plantilla)

##### `SchoolQuotationEditorComponent.replaceWith`

- **Firma:** `replaceWith(key: string, product: Product): void` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L323) (L323–328)
- **Propósito / descripción:** "Cambiar producto": the line becomes the chosen inventory product; the template is untouched.
- **Dependencias (llamadas en su cuerpo):** `this.lines.update`, `lines.map`, `this.fromProduct`, `this.replacingKey.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.lines.update`, `this.replacingKey.set`
- **Consumidores:** `school-quotation-editor.component.html` (plantilla)

##### `SchoolQuotationEditorComponent.makeManual`

- **Firma:** `makeManual(key: string): void` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L331) (L331–334)
- **Propósito / descripción:** Turns a line into a free-text product (e.g. "cuaderno grande" instead of the requested one).
- **Dependencias (llamadas en su cuerpo):** `this.update`, `this.replacingKey.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.update`, `this.replacingKey.set`
- **Consumidores:** `school-quotation-editor.component.html` (plantilla)

##### `SchoolQuotationEditorComponent.fromProduct`

- **Firma:** `fromProduct(product: Product): EditorLine` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L336) (L336–351)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.nextKey`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `SchoolQuotationEditorComponent.nextKey`

- **Firma:** `nextKey(): string` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L353) (L353–356)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `SchoolQuotationEditorComponent.toggleAdvance`

- **Firma:** `toggleAdvance(on: boolean): void` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L359) (L359–364)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.withAdvance.set`, `this.bankList`, `this.banks.getBanks().subscribe`, `this.banks.getBanks`, `this.bankList.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.withAdvance.set`, `this.bankList.set`
- **Consumidores:** `school-quotation-editor.component.html` (plantilla)

##### `SchoolQuotationEditorComponent.items`

- **Firma:** `items(): SchoolQuotationItemInput[]` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L367) (L367–379)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.lines().map`, `this.lines`, `line.productName.trim`, `line.description.trim`, `line.observations.trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `SchoolQuotationEditorComponent.save`

- **Firma:** `save(): Promise<void>` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L381) (L381–437)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.touched.set`, `this.problems`, `this.saving`, `this.lines`, `formatCurrency`, `this.total`, `this.advance`, `this.balance`, `this.confirm.confirm`, `this.isEdit`, `this.asDraft`, `this.customerName().trim`, `this.customerName`, `this.gradeLabel`, `this.customerPhone().trim`, `this.customerPhone`, `this.studentName().trim`, `this.studentName`…
- **Efectos secundarios:** Actualiza estado (signals): `this.touched.set`, `this.saving.set`, `this.error.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `school-quotation-editor.component.html` (plantilla)

#### Función `lineSubtotal` (L60–62)

- **Tipo:** función exportada
- **Firma:** `lineSubtotal(line: Pick<EditorLine, 'quantity' \| 'unitPrice' \| 'discount'>): number` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L60)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `roundMoney`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `lineError` (L65–79)

- **Tipo:** función exportada
- **Firma:** `lineError(line: EditorLine): string \| null` — [school-quotation-editor.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotation-editor/school-quotation-editor.component.ts#L65)
- **Propósito / descripción:** Client-side echo of the backend rules (the backend validates again).
- **Dependencias:** `line.productName.trim`, `Number.isInteger`, `roundMoney`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotations-list-school-quotations-list-component-ts"></a>

### school-quotations-list.component.ts

- **Ruta:** [school-quotations-list.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.ts`, 177 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-school-lists`
- **Responsabilidad:** "Listado general de cotizaciones": filters (customer, phone, number, grade, status, dates) applied on demand, server-side pagination and the actions the role may run on each row.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [school-list.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-school-list-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [school-documents.service.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-documents-service-ts), [school-payment-modal.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-payment-modal-school-payment-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/router`
- **Consumidores:** [school-lists-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-page-component-ts), [school-lists.spec.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-spec-ts), [school-lists-page.component.ts (plantilla)](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-page-component-ts) (plantilla)
- **Plantilla:** [school-quotations-list.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [school-payment-modal.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-payment-modal-school-payment-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="createNew.emit()"`, `(ngSubmit)="applyFilters()"`, `(ngModelChange)="search.set($event)"`, `(ngModelChange)="phone.set($event)"`, `(ngModelChange)="number.set($event)"`, `(ngModelChange)="grade.set($event)"`, `(ngModelChange)="status.set($event)"`, `(ngModelChange)="dateFrom.set($event)"`, `(ngModelChange)="dateTo.set($event)"`, `(click)="clearFilters()"`, `(click)="open(q)"`, `(click)="edit(q)"`, `(click)="paying.set(q)"`, `(click)="open(q, 'cuenta')"`, `(click)="documents.quotation(q.id, q.quotationNumber, 'download')"`

#### Clase `SchoolQuotationsListComponent` (L33–176)

- **Decoradores:** `@Component({ selector: 'app-school-quotations-list', standalone: true, imports: [FormsModule, BadgeComponent, ButtonComponent, IconComponent, ReportPaginationCom`
- **Propósito:** "Listado general de cotizaciones": filters (customer, phone, number, grade, status, dates) applied on demand, server-side pagination and the actions the role may run on each row.
- **Servicios inyectados con `inject()`:** `service = inject(SchoolListService)`, `documents = inject(SchoolDocumentsService)`, `router = inject(Router)`, `confirm = inject(ConfirmDialogService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `@Output createNew = new EventEmitter<void>()`, `search = signal('')`, `phone = signal('')`, `number = signal('')`, `grade = signal('')`, `status = signal<SchoolQuotationStatus \| ''>('')`, `dateFrom = signal('')`, `dateTo = signal('')`, `page = signal(1)`, `grades = signal<string[]>([])`, `items = signal<SchoolQuotationSummary[]>([])`, `total = signal(0)`, `loading = signal(false)`, `failed = signal(false)`, `paying = signal<SchoolQuotationSummary \| null>(null)`, `delivering = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `applyFilters` | método public | 85–88 | — | `void` |
| `clearFilters` | método public | 90–99 | — | `void` |
| `onPageChange` | método public | 101–104 | `page: number` | `void` |
| `load` | método public | 106–132 | — | `void` |
| `open` | método public | 134–138 | `q: SchoolQuotationSummary`, `tab?: 'cuenta' \| 'historial'` | `void` |
| `edit` | método public | 140–142 | `q: SchoolQuotationSummary` | `void` |
| `canDeliver` | método public | 144–146 | `q: SchoolQuotationSummary` | `boolean` |
| `onPaid` | método public | 148–151 | — | `void` |
| `deliver` | método public async | 153–175 | `q: SchoolQuotationSummary` | `Promise<void>` |

##### `SchoolQuotationsListComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [school-quotations-list.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.ts#L85) (L85–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.load`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `school-quotations-list.component.html` (plantilla), (mismo archivo)

##### `SchoolQuotationsListComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [school-quotations-list.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.ts#L90) (L90–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.search.set`, `this.phone.set`, `this.number.set`, `this.grade.set`, `this.status.set`, `this.dateFrom.set`, `this.dateTo.set`, `this.applyFilters`
- **Efectos secundarios:** Actualiza estado (signals): `this.search.set`, `this.phone.set`, `this.number.set`, `this.grade.set`, `this.status.set`, `this.dateFrom.set`
- **Consumidores:** `school-quotations-list.component.html` (plantilla)

##### `SchoolQuotationsListComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [school-quotations-list.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.ts#L101) (L101–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.load`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `school-quotations-list.component.html` (plantilla)

##### `SchoolQuotationsListComponent.load`

- **Firma:** `load(): void` — [school-quotations-list.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.ts#L106) (L106–132)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.service.getQuotations`, `this.search().trim`, `this.search`, `this.phone().trim`, `this.phone`, `this.number().trim`, `this.number`, `this.grade`, `this.status`, `this.dateFrom`, `this.dateTo`, `this.page`, `this.items.set`, `this.total.set`, `this.failed.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.items.set`, `this.total.set`, `this.failed.set`
- **Consumidores:** (mismo archivo)

##### `SchoolQuotationsListComponent.open`

- **Firma:** `open(q: SchoolQuotationSummary, tab?: 'cuenta' \| 'historial'): void` — [school-quotations-list.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.ts#L134) (L134–138)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.router.navigate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `school-quotations-list.component.html` (plantilla)

##### `SchoolQuotationsListComponent.edit`

- **Firma:** `edit(q: SchoolQuotationSummary): void` — [school-quotations-list.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.ts#L140) (L140–142)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.router.navigate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `school-quotations-list.component.html` (plantilla)

##### `SchoolQuotationsListComponent.canDeliver`

- **Firma:** `canDeliver(q: SchoolQuotationSummary): boolean` — [school-quotations-list.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.ts#L144) (L144–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `school-quotations-list.component.html` (plantilla)

##### `SchoolQuotationsListComponent.onPaid`

- **Firma:** `onPaid(): void` — [school-quotations-list.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.ts#L148) (L148–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.paying.set`, `this.load`
- **Efectos secundarios:** Actualiza estado (signals): `this.paying.set`
- **Consumidores:** `school-quotations-list.component.html` (plantilla)

##### `SchoolQuotationsListComponent.deliver`

- **Firma:** `deliver(q: SchoolQuotationSummary): Promise<void>` — [school-quotations-list.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-quotations-list/school-quotations-list.component.ts#L153) (L153–175)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirm.confirm`, `this.delivering.set`, `this.service.changeStatus(q.id, 'ENTREGAR', q.version).subscribe`, `this.service.changeStatus`, `this.notifications.success`, `this.load`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.delivering.set`
- **Consumidores:** `school-quotations-list.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-reason-modal-school-reason-modal-component-ts"></a>

### school-reason-modal.component.ts

- **Ruta:** [school-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-reason-modal/school-reason-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-reason-modal/school-reason-modal.component.ts`, 65 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-school-lists`
- **Responsabilidad:** Mandatory reason (≥ 5 characters) for an audited correction: voiding a payment or cancelling a quotation.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [school-quotation-detail-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-detail-page-component-ts), [school-quotation-detail-page.component.ts (plantilla)](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-detail-page-component-ts) (plantilla)
- **Plantilla:** [school-reason-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-reason-modal/school-reason-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closed.emit()"`, `(ngModelChange)="reason.set($event)"`, `(ngModelChange)="refundMethod.set($event)"`, `(ngModelChange)="reference.set($event)"`, `(click)="submit()"`

**Interfaces, tipos y enums:**

- `interface SchoolReasonResult` (L7): sin documentación — miembros: `reason`, `refundMethod`, `reference`

#### Clase `SchoolReasonModalComponent` (L19–64)

- **Decoradores:** `@Component({ selector: 'app-school-reason-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './school-reason-modal.c`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Mandatory reason (≥ 5 characters) for an audited correction: voiding a payment or cancelling a quotation. When money has to go back to the customer (`refundAmount` &gt; 0) it also asks how it is returned. Dumb: the parent performs the request and keeps `busy`/`error`.
- **Datos / estado que administra:** `@Input open = false`, `@Input title = ''`, `@Input message = ''`, `@Input confirmText = 'Confirmar'`, `@Input refundAmount = 0`, `@Input busy = false`, `@Input error = null`, `@Output closed = new EventEmitter<void>()`, `@Output confirmed = new EventEmitter<SchoolReasonResult>()`, `reason = signal('')`, `refundMethod = signal<SchoolPaymentMethod>('EFECTIVO')`, `reference = signal('')`, `valid = computed(() => this.reason().trim().length >= 5)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 47–53 | — | `void` |
| `submit` | método public | 55–63 | — | `void` |

##### `SchoolReasonModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [school-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-reason-modal/school-reason-modal.component.ts#L47) (L47–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`, `this.refundMethod.set`, `this.reference.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`, `this.refundMethod.set`, `this.reference.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolReasonModalComponent.submit`

- **Firma:** `submit(): void` — [school-reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-reason-modal/school-reason-modal.component.ts#L55) (L55–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.valid`, `this.confirmed.emit`, `this.reason().trim`, `this.reason`, `this.refundMethod`, `this.reference().trim`, `this.reference`
- **Efectos secundarios:** Emite eventos: `this.confirmed.emit`
- **Consumidores:** `school-reason-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-templates-school-templates-component-ts"></a>

### school-templates.component.ts

- **Ruta:** [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts`, 296 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-school-lists`
- **Responsabilidad:** "Plantillas de Listas Escolares": the official list of each grade.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [school-list.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-school-list-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [quotation-product-search.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [school-lists-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-page-component-ts), [school-lists.spec.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-spec-ts), [school-lists-page.component.ts (plantilla)](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-page-component-ts) (plantilla)
- **Plantilla:** [school-templates.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [quotation-product-search.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="create()"`, `(click)="toggle(t)"`, `(click)="edit(t)"`, `(click)="startDuplicate(t)"`, `(click)="toggleActive(t)"`, `(click)="draft.set(null)"`, `(ngModelChange)="patch({ name: $event })"`, `(ngModelChange)="patch({ grade: $event })"`, `(ngModelChange)="patch({ description: $event })"`, `(ngModelChange)="patchLine(l.key, { productName: $event })"`, `(ngModelChange)="patchLine(l.key, { description: $event })"`, `(ngModelChange)="patchLine(l.key, { quantity: num($event) })"`, `(ngModelChange)="patchLine(l.key, { unitPrice: num($event) })"`, `(ngModelChange)="patchLine(l.key, { observations: $event })"`, `(click)="moveLine(idx, -1)"`

**Interfaces, tipos y enums:**

- `interface TemplateLine` (L20): sin documentación — miembros: `key`, `productId`, `productName`, `description`, `quantity`, `unitPrice`, `observations`
- `interface TemplateDraft` (L30): sin documentación — miembros: `id`, `version`, `name`, `grade`, `description`, `isActive`, `lines`

#### Clase `SchoolTemplatesComponent` (L46–295)

- **Decoradores:** `@Component({ selector: 'app-school-templates', standalone: true, imports: [FormsModule, BadgeComponent, ButtonComponent, IconComponent, QuotationProductSearchCom`
- **Propósito:** "Plantillas de Listas Escolares": the official list of each grade. Everybody can consult them; only administrators create, edit, duplicate or (de)activate (backend + SQL enforce it). Editing a template never changes a quotation already generated — quotations keep their own copy.
- **Servicios inyectados con `inject()`:** `service = inject(SchoolListService)`, `confirm = inject(ConfirmDialogService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `templates = signal<SchoolTemplateSummary[]>([])`, `failed = signal(false)`, `expanded = signal<SchoolTemplate \| null>(null)`, `draft = signal<TemplateDraft \| null>(null)`, `duplicating = signal<SchoolTemplateSummary \| null>(null)`, `copyName = signal('')`, `copyGrade = signal('')`, `saving = signal(false)`, `error = signal<string \| null>(null)`, `canManage = computed(() => this.service.can('school_lists.temp`, `draftTotal = computed(() => roundMoney((this.draft()?.lines ?? `, `draftProblem = computed(() => { const d = this.draft(); if (!d) r`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `load` | método public | 98–106 | — | `void` |
| `toggle` | método public | 108–117 | `t: SchoolTemplateSummary` | `void` |
| `create` | método public | 120–123 | — | `void` |
| `edit` | método public | 125–148 | `t: SchoolTemplateSummary` | `void` |
| `patch` | método public | 150–152 | `changes: Partial<TemplateDraft>` | `void` |
| `patchLine` | método public | 154–156 | `key: number`, `changes: Partial<TemplateLine>` | `void` |
| `num` | método public | 158–161 | `value: unknown` | `number` |
| `addLine` | método public | 163–183 | `product?: Product` | `void` |
| `removeLine` | método public | 185–187 | `key: number` | `void` |
| `moveLine` | método public | 189–198 | `index: number`, `delta: number` | `void` |
| `saveDraft` | método public async | 200–244 | — | `Promise<void>` |
| `startDuplicate` | método public | 247–252 | `t: SchoolTemplateSummary` | `void` |
| `duplicate` | método public | 254–272 | — | `void` |
| `toggleActive` | método public async | 274–294 | `t: SchoolTemplateSummary` | `Promise<void>` |

##### `SchoolTemplatesComponent.load`

- **Firma:** `load(): void` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L98) (L98–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.service.getTemplates(this.canManage()).subscribe`, `this.service.getTemplates`, `this.canManage`, `this.templates.set`, `this.failed.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.templates.set`, `this.failed.set`
- **Consumidores:** (mismo archivo)

##### `SchoolTemplatesComponent.toggle`

- **Firma:** `toggle(t: SchoolTemplateSummary): void` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L108) (L108–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.expanded`, `this.expanded.set`, `this.service.getTemplate(t.id).subscribe`, `this.service.getTemplate`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.expanded.set`
- **Consumidores:** `school-templates.component.html` (plantilla)

##### `SchoolTemplatesComponent.create`

- **Firma:** `create(): void` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L120) (L120–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.error.set`, `this.draft.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.error.set`, `this.draft.set`
- **Consumidores:** `school-templates.component.html` (plantilla)

##### `SchoolTemplatesComponent.edit`

- **Firma:** `edit(t: SchoolTemplateSummary): void` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L125) (L125–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.error.set`, `this.service.getTemplate(t.id).subscribe`, `this.service.getTemplate`, `this.draft.set`, `template.items.map`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.error.set`, `this.draft.set`
- **Consumidores:** `school-templates.component.html` (plantilla)

##### `SchoolTemplatesComponent.patch`

- **Firma:** `patch(changes: Partial<TemplateDraft>): void` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L150) (L150–152)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.draft.update`
- **Consumidores:** `school-templates.component.html` (plantilla)

##### `SchoolTemplatesComponent.patchLine`

- **Firma:** `patchLine(key: number, changes: Partial<TemplateLine>): void` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L154) (L154–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.update`, `d.lines.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.draft.update`
- **Consumidores:** `school-templates.component.html` (plantilla)

##### `SchoolTemplatesComponent.num`

- **Firma:** `num(value: unknown): number` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L158) (L158–161)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Number`, `Number.isFinite`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `school-templates.component.html` (plantilla)

##### `SchoolTemplatesComponent.addLine`

- **Firma:** `addLine(product?: Product): void` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L163) (L163–183)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.draft.update`
- **Consumidores:** `school-templates.component.html` (plantilla)

##### `SchoolTemplatesComponent.removeLine`

- **Firma:** `removeLine(key: number): void` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L185) (L185–187)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.update`, `d.lines.filter`
- **Efectos secundarios:** Actualiza estado (signals): `this.draft.update`
- **Consumidores:** `school-templates.component.html` (plantilla)

##### `SchoolTemplatesComponent.moveLine`

- **Firma:** `moveLine(index: number, delta: number): void` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L189) (L189–198)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.draft.update`
- **Consumidores:** `school-templates.component.html` (plantilla)

##### `SchoolTemplatesComponent.saveDraft`

- **Firma:** `saveDraft(): Promise<void>` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L200) (L200–244)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft`, `this.draftProblem`, `this.saving`, `this.confirm.confirm`, `d.name.trim`, `formatCurrency`, `this.draftTotal`, `this.saving.set`, `this.error.set`, `this.service.saveTemplate`, `d.grade.trim`, `d.description.trim`, `d.lines.map`, `l.productName.trim`, `l.description.trim`, `l.observations.trim`, `this.draft.set`, `this.notifications.success`…
- **Efectos secundarios:** Actualiza estado (signals): `this.saving.set`, `this.error.set`, `this.draft.set`, `this.expanded.set`
- **Consumidores:** `school-templates.component.html` (plantilla)

##### `SchoolTemplatesComponent.startDuplicate`

- **Firma:** `startDuplicate(t: SchoolTemplateSummary): void` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L247) (L247–252)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.error.set`, `this.copyName.set`, `this.copyGrade.set`, `this.duplicating.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.error.set`, `this.copyName.set`, `this.copyGrade.set`, `this.duplicating.set`
- **Consumidores:** `school-templates.component.html` (plantilla)

##### `SchoolTemplatesComponent.duplicate`

- **Firma:** `duplicate(): void` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L254) (L254–272)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.duplicating`, `this.copyName().trim`, `this.copyName`, `this.saving`, `this.saving.set`, `this.service.duplicateTemplate`, `this.copyGrade().trim`, `this.copyGrade`, `this.duplicating.set`, `this.notifications.success`, `this.load`, `this.error.set`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.saving.set`, `this.duplicating.set`, `this.error.set`
- **Consumidores:** `school-templates.component.html` (plantilla)

##### `SchoolTemplatesComponent.toggleActive`

- **Firma:** `toggleActive(t: SchoolTemplateSummary): Promise<void>` — [school-templates.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-templates/school-templates.component.ts#L274) (L274–294)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirm.confirm`, `this.service.setTemplateActive(t.id, !t.isActive).subscribe`, `this.service.setTemplateActive`, `this.notifications.success`, `this.load`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `school-templates.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-documents-service-ts"></a>

### school-documents.service.ts

- **Ruta:** [school-documents.service.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-documents.service.ts) (`comercial-jhoel-app/src/app/features/dashboard/school-lists/school-documents.service.ts`, 56 líneas)
- **Tipo:** Servicio · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-school-lists`
- **Responsabilidad:** Downloads or prints the documents of Listas Escolares (quotation PDF and payment receipts).
- **Depende de (archivos del proyecto):** [school-list.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-school-list-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-blob-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts), [print-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-print-blob-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [school-quotations-list.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotations-list-school-quotations-list-component-ts), [school-quotation-detail-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-detail-page-component-ts)

#### Clase `SchoolDocumentsService` (L14–55)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Downloads or prints the documents of Listas Escolares (quotation PDF and payment receipts). Both are rebuilt by the backend from saved data only.
- **Servicios inyectados con `inject()`:** `service = inject(SchoolListService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `busy = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `quotation` | método public | 22–24 | `id: string`, `number: string`, `mode: 'download' \| 'print'` | `void` |
| `receipt` | método public | 26–28 | `paymentId: string`, `receiptNumber: string`, `mode?: 'download' \| 'print'` | `void` |
| `run` | método private | 30–54 | `key: string`, `request: ReturnType<SchoolListService['quotationPdf']>`, `filename: string`, `mode: 'download' \| 'print'` | `void` |

##### `SchoolDocumentsService.quotation`

- **Firma:** `quotation(id: string, number: string, mode: 'download' \| 'print'): void` — [school-documents.service.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-documents.service.ts#L22) (L22–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.run`, `this.service.quotationPdf`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-quotation-detail-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-detail-page-component-ts)

##### `SchoolDocumentsService.receipt`

- **Firma:** `receipt(paymentId: string, receiptNumber: string, mode?: 'download' \| 'print'): void` — [school-documents.service.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-documents.service.ts#L26) (L26–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.run`, `this.service.receiptPdf`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-quotation-detail-page.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-detail-page-component-ts)

##### `SchoolDocumentsService.run`

- **Firma:** `run(key: string, request: ReturnType<SchoolListService['quotationPdf']>, filename: string, mode: 'download' \| 'print'): void` — [school-documents.service.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-documents.service.ts#L30) (L30–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.busy`, `this.busy.set`, `request.subscribe`, `printBlob`, `downloadBlob`, `this.notifications.error`, `extractBlobErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.busy.set`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-page-component-ts"></a>

### school-lists-page.component.ts

- **Ruta:** [school-lists-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-lists-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/school-lists/school-lists-page.component.ts`, 70 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-school-lists`
- **Responsabilidad:** "Listas Escolares": dashboard, quotation list, new quotation and the official templates per grade.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [school-list.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-school-list-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [school-dashboard.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-dashboard-school-dashboard-component-ts), [school-quotation-editor.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotation-editor-school-quotation-editor-component-ts), [school-quotations-list.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotations-list-school-quotations-list-component-ts), [school-templates.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-templates-school-templates-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [school-lists-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-lists-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [school-dashboard.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-dashboard-school-dashboard-component-ts), [school-quotations-list.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotations-list-school-quotations-list-component-ts), [school-quotation-editor.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotation-editor-school-quotation-editor-component-ts), [school-templates.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-templates-school-templates-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="selectTab(tab.id)"`, `(openList)="selectTab('cotizaciones')"`, `(createNew)="selectTab('nueva')"`, `(saved)="onCreated($event)"`

**Interfaces, tipos y enums:**

- `type SchoolListsTab` (L12) = `'tablero' \| 'cotizaciones' \| 'nueva' \| 'plantillas'`

#### Clase `SchoolListsPageComponent` (L27–69)

- **Decoradores:** `@Component({ selector: 'app-school-lists-page', standalone: true, imports: [ PageHeaderComponent, IconComponent, SchoolDashboardComponent, SchoolQuotationsListCo`
- **Propósito:** "Listas Escolares": dashboard, quotation list, new quotation and the official templates per grade. The active tab lives in `?tab=` so a reload or a shared link opens the same view. Actions are shown according to the permissions the backend reports for the user's role.
- **Servicios inyectados con `inject()`:** `route = inject(ActivatedRoute)`, `router = inject(Router)`, `service = inject(SchoolListService)`
- **Datos / estado que administra:** `activeTab = signal<SchoolListsTab>('tablero')`, `loadError = signal(false)`, `tabs = computed(() => TABS.filter((tab) => tab.id !== 'nu`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `selectTab` | método public | 61–64 | `tab: SchoolListsTab` | `void` |
| `onCreated` | método public | 66–68 | `quotation: SchoolQuotation` | `void` |

##### `SchoolListsPageComponent.selectTab`

- **Firma:** `selectTab(tab: SchoolListsTab): void` — [school-lists-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-lists-page.component.ts#L61) (L61–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.activeTab.set`, `this.router.navigate`
- **Efectos secundarios:** Actualiza estado (signals): `this.activeTab.set`
- **Consumidores:** `school-lists-page.component.html` (plantilla)

##### `SchoolListsPageComponent.onCreated`

- **Firma:** `onCreated(quotation: SchoolQuotation): void` — [school-lists-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-lists-page.component.ts#L66) (L66–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.router.navigate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `school-lists-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-lists-spec-ts"></a>

### school-lists.spec.ts

- **Ruta:** [school-lists.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-lists.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/school-lists/school-lists.spec.ts`, 352 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-school-lists`
- **Responsabilidad:** Prueba unitaria: declara `quotation`, `setup`, `summary`, `template`, `product` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [school-list.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-school-list-service-ts), [school-dashboard.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-dashboard-school-dashboard-component-ts), [school-payment-modal.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-payment-modal-school-payment-modal-component-ts), [school-quotation-editor.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotation-editor-school-quotation-editor-component-ts), [school-quotations-list.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotations-list-school-quotations-list-component-ts), [school-templates.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-templates-school-templates-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** —
#### Función `quotation` (L55–88)

- **Tipo:** función local del archivo
- **Firma:** `quotation(over?: Partial<SchoolQuotation>): SchoolQuotation` — [school-lists.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-lists.spec.ts#L55)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `setup` (L92–108)

- **Tipo:** función local del archivo
- **Firma:** `setup(permissions: SchoolListPermission[]): SchoolListService` — [school-lists.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-lists.spec.ts#L92)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `TestBed.configureTestingModule`, `provideHttpClient`, `provideHttpClientTesting`, `provideRouter`, `Promise.resolve`, `of`, `TestBed.inject`, `new Set`, `spyOn(service, 'can').and.callFake`, `spyOn`, `granted.has`, `spyOn(service, 'getTemplates').and.returnValue`, `spyOn(service, 'getTemplate').and.returnValue`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-detail-page-component-ts"></a>

### school-quotation-detail-page.component.ts

- **Ruta:** [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts`, 308 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-school-lists`
- **Responsabilidad:** Detail of a school quotation: customer, grade, lines, financial cards, account statement (with receipts and audited reversals), observations and the change history.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [pdf-prompt-modal.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-pdf-prompt-modal-service-ts), [school-list.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-school-list-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [school-payment-modal.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-payment-modal-school-payment-modal-component-ts), [school-reason-modal.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-reason-modal-school-reason-modal-component-ts), [school-documents.service.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-documents-service-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/router`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [school-quotation-detail-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts), [school-payment-modal.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-payment-modal-school-payment-modal-component-ts), [school-reason-modal.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-reason-modal-school-reason-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="paying.set(true)"`, `(click)="runAction(a)"`, `(click)="edit()"`, `(click)="pdf('download')"`, `(click)="pdf('print')"`, `(click)="startCancel()"`, `(click)="setView('detalle')"`, `(click)="setView('cuenta')"`, `(click)="setView('historial')"`, `(click)="editingNotes.set(true)"`, `(ngModelChange)="notes.set($event)"`, `(click)="editingNotes.set(false); notes.set(q.observations ?? '')"`, `(click)="saveNotes()"`, `(click)="receipt(p)"`, `(click)="startVoid(p)"`

**Interfaces, tipos y enums:**

- `type DetailView` (L36) = `'detalle' \| 'cuenta' \| 'historial'`

#### Clase `SchoolQuotationDetailPageComponent` (L61–307)

- **Decoradores:** `@Component({ selector: 'app-school-quotation-detail-page', standalone: true, imports: [ FormsModule, RouterLink, BadgeComponent, ButtonComponent, IconComponent, `
- **Propósito:** Detail of a school quotation: customer, grade, lines, financial cards, account statement (with receipts and audited reversals), observations and the change history. Every figure comes from the backend.
- **Servicios inyectados con `inject()`:** `route = inject(ActivatedRoute)`, `router = inject(Router)`, `service = inject(SchoolListService)`, `documents = inject(SchoolDocumentsService)`, `confirm = inject(ConfirmDialogService)`, `notifications = inject(NotificationService)`, `pdfPrompt = inject(PdfPromptModalService)`
- **Datos / estado que administra:** `quotation = signal<SchoolQuotation \| null>(null)`, `failed = signal<string \| null>(null)`, `view = signal<DetailView>('detalle')`, `busy = signal(false)`, `paying = signal(false)`, `notes = signal('')`, `editingNotes = signal(false)`, `voiding = signal<SchoolPayment \| null>(null)`, `cancelling = signal(false)`, `reasonBusy = signal(false)`, `reasonError = signal<string \| null>(null)`, `editable = computed(() => { const q = this.quotation(); retur`, `canPay = computed(() => { const q = this.quotation(); retur`, `canCancel = computed(() => { const q = this.quotation(); retur`, `nextActions = computed<SchoolStatusAction[]>(() => { const q = t`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `id` | getter private | 146–148 | — | `string` |
| `load` | método public | 150–155 | — | `void` |
| `apply` | método private | 157–163 | `q: SchoolQuotation` | `void` |
| `setView` | método public | 165–168 | `view: DetailView` | `void` |
| `edit` | método public | 170–172 | — | `void` |
| `pdf` | método public | 174–177 | `mode: 'download' \| 'print'` | `void` |
| `receipt` | método public | 179–181 | `p: SchoolPayment` | `void` |
| `onPaid` | método public | 183–195 | `result: { paymentId: string; quotation: SchoolQuotation }` | `void` |
| `runAction` | método public async | 197–216 | `action: SchoolStatusAction` | `Promise<void>` |
| `saveNotes` | método public | 218–234 | — | `void` |
| `startVoid` | método public | 236–240 | `p: SchoolPayment` | `void` |
| `startCancel` | método public | 242–246 | — | `void` |
| `closeReason` | método public | 248–251 | — | `void` |
| `onReason` | método public | 253–274 | `result: SchoolReasonResult` | `void` |
| `canVoid` | método public | 276–285 | `p: SchoolPayment` | `boolean` |
| `historyDetail` | método public | 287–306 | `entry: SchoolHistoryEntry` | `string` |

##### `SchoolQuotationDetailPageComponent.id`

- **Firma:** `id(): string` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L146) (L146–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.route.snapshot.paramMap.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolQuotationDetailPageComponent.load`

- **Firma:** `load(): void` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L150) (L150–155)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.service.getQuotation(this.id).subscribe`, `this.service.getQuotation`, `this.apply`, `this.failed.set`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.failed.set`
- **Consumidores:** (mismo archivo)

##### `SchoolQuotationDetailPageComponent.apply`

- **Firma:** `apply(q: SchoolQuotation): void` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L157) (L157–163)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quotation.set`, `this.failed.set`, `this.editingNotes`, `this.notes.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.quotation.set`, `this.failed.set`, `this.notes.set`
- **Consumidores:** (mismo archivo)

##### `SchoolQuotationDetailPageComponent.setView`

- **Firma:** `setView(view: DetailView): void` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L165) (L165–168)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.view.set`, `this.router.navigate`
- **Efectos secundarios:** Actualiza estado (signals): `this.view.set`
- **Consumidores:** `school-quotation-detail-page.component.html` (plantilla)

##### `SchoolQuotationDetailPageComponent.edit`

- **Firma:** `edit(): void` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L170) (L170–172)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.router.navigate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `school-quotation-detail-page.component.html` (plantilla)

##### `SchoolQuotationDetailPageComponent.pdf`

- **Firma:** `pdf(mode: 'download' \| 'print'): void` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L174) (L174–177)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quotation`, `this.documents.quotation`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `school-quotation-detail-page.component.html` (plantilla)

##### `SchoolQuotationDetailPageComponent.receipt`

- **Firma:** `receipt(p: SchoolPayment): void` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L179) (L179–181)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.documents.receipt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `school-quotation-detail-page.component.html` (plantilla)

##### `SchoolQuotationDetailPageComponent.onPaid`

- **Firma:** `onPaid(result: { paymentId: string; quotation: SchoolQuotation }): void` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L183) (L183–195)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.paying.set`, `this.apply`, `result.quotation.payments.find`, `this.service.can`, `this.pdfPrompt.prompt`, `this.service.receiptPdf`
- **Efectos secundarios:** Actualiza estado (signals): `this.paying.set`
- **Consumidores:** `school-quotation-detail-page.component.html` (plantilla)

##### `SchoolQuotationDetailPageComponent.runAction`

- **Firma:** `runAction(action: SchoolStatusAction): Promise<void>` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L197) (L197–216)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quotation`, `this.busy`, `this.confirm.confirm`, `this.busy.set`, `this.service.changeStatus(q.id, action, q.version).subscribe`, `this.service.changeStatus`, `this.apply`, `this.notifications.success`, `this.notifications.error`, `extractErrorMessage`, `this.load`
- **Efectos secundarios:** Actualiza estado (signals): `this.busy.set`
- **Consumidores:** `school-quotation-detail-page.component.html` (plantilla)

##### `SchoolQuotationDetailPageComponent.saveNotes`

- **Firma:** `saveNotes(): void` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L218) (L218–234)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quotation`, `this.busy`, `this.busy.set`, `this.service.updateObservations(q.id, this.notes().trim(), q.version).subscribe`, `this.service.updateObservations`, `this.notes().trim`, `this.notes`, `this.editingNotes.set`, `this.apply`, `this.notifications.success`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.busy.set`, `this.editingNotes.set`
- **Consumidores:** `school-quotation-detail-page.component.html` (plantilla)

##### `SchoolQuotationDetailPageComponent.startVoid`

- **Firma:** `startVoid(p: SchoolPayment): void` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L236) (L236–240)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reasonError.set`, `crypto.randomUUID`, `this.voiding.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reasonError.set`, `this.voiding.set`
- **Consumidores:** `school-quotation-detail-page.component.html` (plantilla)

##### `SchoolQuotationDetailPageComponent.startCancel`

- **Firma:** `startCancel(): void` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L242) (L242–246)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reasonError.set`, `crypto.randomUUID`, `this.cancelling.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reasonError.set`, `this.cancelling.set`
- **Consumidores:** `school-quotation-detail-page.component.html` (plantilla)

##### `SchoolQuotationDetailPageComponent.closeReason`

- **Firma:** `closeReason(): void` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L248) (L248–251)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voiding.set`, `this.cancelling.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.voiding.set`, `this.cancelling.set`
- **Consumidores:** `school-quotation-detail-page.component.html` (plantilla), (mismo archivo)

##### `SchoolQuotationDetailPageComponent.onReason`

- **Firma:** `onReason(result: SchoolReasonResult): void` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L253) (L253–274)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quotation`, `this.voiding`, `this.reasonBusy.set`, `this.reasonError.set`, `this.service.voidPayment(payment.id, result.reason, this.reasonRequestId).pipe`, `this.service.voidPayment`, `map`, `this.service.cancelQuotation`, `request.subscribe`, `this.apply`, `this.closeReason`, `this.notifications.success`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.reasonBusy.set`, `this.reasonError.set`
- **Consumidores:** `school-quotation-detail-page.component.html` (plantilla)

##### `SchoolQuotationDetailPageComponent.canVoid`

- **Firma:** `canVoid(p: SchoolPayment): boolean` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L276) (L276–285)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.quotation`, `isSchoolQuotationEditable`, `this.service.can`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `school-quotation-detail-page.component.html` (plantilla)

##### `SchoolQuotationDetailPageComponent.historyDetail`

- **Firma:** `historyDetail(entry: SchoolHistoryEntry): string` — [school-quotation-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-detail-page.component.ts#L287) (L287–306)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `formatCurrency`, `Number`, `money`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `school-quotation-detail-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-school-lists-school-quotation-edit-page-component-ts"></a>

### school-quotation-edit-page.component.ts

- **Ruta:** [school-quotation-edit-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-edit-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-edit-page.component.ts`, 78 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-school-lists`
- **Responsabilidad:** "Editar cotización": the same editor as "Nueva cotización", loaded with the quotation's own lines and its `version` (a concurrent edit is rejected by the backend with a clear message).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [school-list.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-school-list-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [school-quotation-editor.component.ts](dashboard-school-lists.md#f-comercial-jhoel-app-src-app-features-dashboard-school-lists-components-school-quotation-editor-school-quotation-editor-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)

#### Clase `SchoolQuotationEditPageComponent` (L17–77)

- **Decoradores:** `@Component({ selector: 'app-school-quotation-edit-page', standalone: true, imports: [RouterLink, IconComponent, PageHeaderComponent, SchoolQuotationEditorCompone`
- **Propósito:** "Editar cotización": the same editor as "Nueva cotización", loaded with the quotation's own lines and its `version` (a concurrent edit is rejected by the backend with a clear message). Delivered or cancelled quotations are read-only.
- **Servicios inyectados con `inject()`:** `route = inject(ActivatedRoute)`, `router = inject(Router)`, `service = inject(SchoolListService)`
- **Datos / estado que administra:** `quotation = signal<SchoolQuotation \| null>(null)`, `failed = signal<string \| null>(null)`, `editable = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `back` | método public | 74–76 | — | `void` |

##### `SchoolQuotationEditPageComponent.back`

- **Firma:** `back(): void` — [school-quotation-edit-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/school-quotation-edit-page.component.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.router.navigate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

