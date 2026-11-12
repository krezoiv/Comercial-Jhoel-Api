# Frontend `dashboard-guayacan-cash-box`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [cash-count-panel.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `LAST_COUNT` (sin comentario de documentación en el código). | 6 internas; ext.: @angular/core, rxjs | 0 | Soporte (pruebas) |
| [cash-count-panel.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Conteo de efectivo en caja" (arqueo). | 11 internas; ext.: @angular/core, @angular/common, @angular/forms | 3 | Media (3 consumidores) |
| [count-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-count-detail-modal-count-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Detalle histórico de un arqueo (solo lectura): información general y las 11 denominaciones exactamente como se guardaron. | 5 internas; ext.: @angular/core, @angular/common | 4 | Media (4 consumidores) |
| [movement-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-detail-modal-movement-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Detalle de un movimiento del Kardex (auditoría: usuario, fecha y hora, saldos, desglose, operación de Transaccionar de origen) y, para admin, "Anular" con motivo obligatorio. | 6 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [movement-form-modal.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria (sin comentario de documentación en el código). | 4 internas; ext.: @angular/core, rxjs, @angular/common | 0 | Soporte (pruebas) |
| [movement-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "+ Ingreso a caja" / "− Egreso de caja" / "Ajuste" (admin). | 8 internas; ext.: @angular/core, @angular/common, @angular/forms, rxjs | 3 | Media (3 consumidores) |
| [guayacan-cash-box-page.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `period`, `movement`, `SUMMARY` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/core, rxjs | 0 | Soporte (pruebas) |
| [guayacan-cash-box-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Cuadre de Caja Guayacán" — Kardex propio de Cooperativa Guayacán, independiente de Recargas, Caja de Ventas y saldos bancarios. | 12 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [guayacan-cash.util.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria (sin comentario de documentación en el código). | 1 internas | 0 | Soporte (pruebas) |
| [guayacan-cash.util.ts](#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts) | .ts | Utilidad | Feature (pantalla) | Utilidad: declara `round2`, `emptyCashCounts`, `cashCountsTotal`, `cashCountsToDetails`, `cashStatus` (sin comentario de documentación en el código). | 3 internas | 8 | Media (8 consumidores) |
| [_guayacan-modal.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/_guayacan-modal.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cash-count-panel.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/cash-count-panel/cash-count-panel.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cash-count-panel.component.ts`; usa 5 componentes hijos: `app-card`, `app-cash-breakdown-table`, `app-button`, `app-icon`, `app-guayacan-count-detail-modal`. | — | — | Media |
| [cash-count-panel.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/cash-count-panel/cash-count-panel.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [count-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/count-detail-modal/count-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `count-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [count-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/count-detail-modal/count-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [movement-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-detail-modal/movement-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `movement-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [movement-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-detail-modal/movement-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [movement-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `movement-form-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-cash-breakdown-table`, `app-button`. | — | — | Media |
| [movement-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [guayacan-cash-box-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `guayacan-cash-box-page.component.ts`; usa 8 componentes hijos: `app-page-header`, `app-icon`, `app-button`, `app-card`, `app-guayacan-cash-count-panel`, `app-report-pagination`. | — | — | Media |
| [guayacan-cash-box-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-spec-ts"></a>

### cash-count-panel.component.spec.ts

- **Ruta:** [cash-count-panel.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/cash-count-panel/cash-count-panel.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/cash-count-panel/cash-count-panel.component.spec.ts`, 143 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-guayacan-cash-box`
- **Responsabilidad:** Prueba unitaria: declara `LAST_COUNT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [guayacan-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-box-service-ts), [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts"></a>

### cash-count-panel.component.ts

- **Ruta:** [cash-count-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/cash-count-panel/cash-count-panel.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/cash-count-panel/cash-count-panel.component.ts`, 160 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-guayacan-cash-box`
- **Responsabilidad:** "Conteo de efectivo en caja" (arqueo).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [guayacan-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-box-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [count-detail-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-count-detail-modal-count-detail-modal-component-ts), [guayacan-cash.util.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [cash-count-panel.component.spec.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-spec-ts), [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts), [guayacan-cash-box-page.component.ts (plantilla)](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts) (plantilla)
- **Plantilla:** [cash-count-panel.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/cash-count-panel/cash-count-panel.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [count-detail-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-count-detail-modal-count-detail-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="detailCountId.set(last.id)"`, `(quantityChange)="onQuantityChange($event)"`, `(ngModelChange)="notes.set($event)"`, `(click)="clear()"`, `(click)="adjustRequested.emit(difference())"`, `(click)="save()"`, `(closed)="detailCountId.set(null)"`

#### Clase `GuayacanCashCountPanelComponent` (L31–159)

- **Decoradores:** `@Component({ selector: 'app-guayacan-cash-count-panel', standalone: true, imports: [ FormsModule, ButtonComponent, CardComponent, IconComponent, CashBreakdownTab`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Conteo de efectivo en caja" (arqueo). Muestra el último conteo registrado (billetes y monedas por denominación) y permite registrar uno nuevo, comparado en vivo contra el saldo del Kardex. Guardar un arqueo NUNCA cambia el saldo: si hay diferencia, un admin la corrige con un ajuste autorizado (`adjustRequested`).
- **Servicios inyectados con `inject()`:** `service = inject(GuayacanCashBoxService)`, `confirmDialog = inject(ConfirmDialogService)`, `notifications = inject(NotificationService)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `@Input balance = 0`, `@Input isAdmin = false`, `@Output adjustRequested = new EventEmitter<number>()`, `latest = signal<GuayacanCashCount \| null>(null)`, `loading = signal(true)`, `cashCounts = signal<Record<string, number>>(emptyCashCounts())`, `notes = signal('')`, `isSaving = signal(false)`, `detailCountId = signal<string \| null>(null)`, `balanceSignal = signal(0)`, `totalCounted = computed(() => cashCountsTotal(this.cashCounts()))`, `difference = computed(() => round2(this.totalCounted() - this.b`, `status = computed<CuadreStatus>(() => { const difference = `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 85–87 | — | `void` |
| `loadLatest` | método public | 89–103 | — | `void` |
| `onQuantityChange` | método public | 105–107 | `event: { denomination: number; quantity: number }` | `void` |
| `clear` | método public | 109–111 | — | `void` |
| `save` | método public async | 113–158 | — | `Promise<void>` |

##### `GuayacanCashCountPanelComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [cash-count-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/cash-count-panel/cash-count-panel.component.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.balanceSignal.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.balanceSignal.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashCountPanelComponent.loadLatest`

- **Firma:** `loadLatest(): void` — [cash-count-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/cash-count-panel/cash-count-panel.component.ts#L89) (L89–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.service.getLatestCount().subscribe`, `this.service.getLatestCount`, `this.latest.set`, `emptyCashCounts`, `String`, `this.cashCounts.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.latest.set`, `this.cashCounts.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashCountPanelComponent.onQuantityChange`

- **Firma:** `onQuantityChange(event: { denomination: number; quantity: number }): void` — [cash-count-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/cash-count-panel/cash-count-panel.component.ts#L105) (L105–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cashCounts.update`, `String`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashCounts.update`
- **Consumidores:** `cash-count-panel.component.html` (plantilla)

##### `GuayacanCashCountPanelComponent.clear`

- **Firma:** `clear(): void` — [cash-count-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/cash-count-panel/cash-count-panel.component.ts#L109) (L109–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cashCounts.set`, `emptyCashCounts`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashCounts.set`
- **Consumidores:** `cash-count-panel.component.html` (plantilla)

##### `GuayacanCashCountPanelComponent.save`

- **Firma:** `save(): Promise<void>` — [cash-count-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/cash-count-panel/cash-count-panel.component.ts#L113) (L113–158)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.difference`, `formatDifference`, `this.confirmDialog.confirm`, `formatCurrency`, `this.totalCounted`, `this.balanceSignal`, `this.authService.currentUser`, `formatGuatemalaDateTime`, `new Date().toISOString`, `new Date`, `this.isSaving.set`, `this.service.registerCount`, `cashCountsToDetails`, `this.cashCounts`, `this.notes().trim`, `this.notes`, `this.latest.set`…
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.latest.set`, `this.notes.set`
- **Consumidores:** `cash-count-panel.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-count-detail-modal-count-detail-modal-component-ts"></a>

### count-detail-modal.component.ts

- **Ruta:** [count-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/count-detail-modal/count-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/count-detail-modal/count-detail-modal.component.ts`, 91 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-guayacan-cash-box`
- **Responsabilidad:** Detalle histórico de un arqueo (solo lectura): información general y las 11 denominaciones exactamente como se guardaron.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [guayacan-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-box-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [guayacan-cash.util.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`
- **Consumidores:** [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts), [guayacan-cash-counts-page.component.ts](dashboard-guayacan-cash-counts.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-ts), [cash-count-panel.component.ts (plantilla)](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts) (plantilla), [guayacan-cash-counts-page.component.ts (plantilla)](dashboard-guayacan-cash-counts.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-ts) (plantilla)
- **Plantilla:** [count-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/count-detail-modal/count-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closed.emit()"`

#### Clase `GuayacanCountDetailModalComponent` (L32–90)

- **Decoradores:** `@Component({ selector: 'app-guayacan-count-detail-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './count-detail-modal.compone`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Detalle histórico de un arqueo (solo lectura): información general y las 11 denominaciones exactamente como se guardaron. Lo abren Cajas y Cierres → Arqueos — Guayacán y el propio Cuadre de Caja Guayacán. No se cierra con clic fuera.
- **Servicios inyectados con `inject()`:** `service = inject(GuayacanCashBoxService)`
- **Datos / estado que administra:** `@Input countId = null`, `@Output closed = new EventEmitter<void>()`, `count = signal<GuayacanCashCount \| null>(null)`, `loading = signal(false)`, `errorMessage = signal<string \| null>(null)`, `rows = computed(() => { const details = this.count()?.det`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 65–69 | `changes: SimpleChanges` | `void` |
| `load` | método private | 71–85 | `id: string` | `void` |
| `formatDenomination` | método public | 87–89 | `denomination: number` | `string` |

##### `GuayacanCountDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [count-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/count-detail-modal/count-detail-modal.component.ts#L65) (L65–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.load`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCountDetailModalComponent.load`

- **Firma:** `load(id: string): void` — [count-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/count-detail-modal/count-detail-modal.component.ts#L71) (L71–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.count.set`, `this.errorMessage.set`, `this.service.getCount(id).subscribe`, `this.service.getCount`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.count.set`, `this.errorMessage.set`
- **Consumidores:** [guayacan-cash-counts-page.component.ts](dashboard-guayacan-cash-counts.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-ts), [guayacan-cash-counts-page.component.ts](dashboard-guayacan-cash-counts.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-ts), (mismo archivo)

##### `GuayacanCountDetailModalComponent.formatDenomination`

- **Firma:** `formatDenomination(denomination: number): string` — [count-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/count-detail-modal/count-detail-modal.component.ts#L87) (L87–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `denomination.toLocaleString`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `count-detail-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-detail-modal-movement-detail-modal-component-ts"></a>

### movement-detail-modal.component.ts

- **Ruta:** [movement-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-detail-modal/movement-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-detail-modal/movement-detail-modal.component.ts`, 138 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-guayacan-cash-box`
- **Responsabilidad:** Detalle de un movimiento del Kardex (auditoría: usuario, fecha y hora, saldos, desglose, operación de Transaccionar de origen) y, para admin, "Anular" con motivo obligatorio.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [guayacan-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-box-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [guayacan-cash.util.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts), [guayacan-cash-box-page.component.ts (plantilla)](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts) (plantilla)
- **Plantilla:** [movement-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-detail-modal/movement-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(ngModelChange)="voidReason.set($event)"`, `(click)="voiding.set(false)"`, `(click)="confirmVoid()"`, `(click)="voiding.set(true)"`

#### Clase `GuayacanMovementDetailModalComponent` (L37–137)

- **Decoradores:** `@Component({ selector: 'app-guayacan-movement-detail-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], templateUrl: './movement-d`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Detalle de un movimiento del Kardex (auditoría: usuario, fecha y hora, saldos, desglose, operación de Transaccionar de origen) y, para admin, "Anular" con motivo obligatorio. Anular nunca borra ni edita: el backend marca el original ANULADO y registra el movimiento inverso. Las comisiones no se anulan aquí (se revierten anulando su operación en Transaccionar).
- **Servicios inyectados con `inject()`:** `service = inject(GuayacanCashBoxService)`, `confirmDialog = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input movementId = null`, `@Input isAdmin = false`, `@Output closed = new EventEmitter<void>()`, `@Output changed = new EventEmitter<void>()`, `movement = signal<GuayacanCashMovementDetail \| null>(null)`, `loading = signal(false)`, `errorMessage = signal<string \| null>(null)`, `voiding = signal(false)`, `voidReason = signal('')`, `isSaving = signal(false)`, `canVoid = computed(() => { const movement = this.movement();`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 77–81 | `changes: SimpleChanges` | `void` |
| `load` | método private | 83–99 | `id: string` | `void` |
| `confirmVoid` | método public async | 101–130 | — | `Promise<void>` |
| `close` | método public | 132–136 | — | `void` |

##### `GuayacanMovementDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [movement-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-detail-modal/movement-detail-modal.component.ts#L77) (L77–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.load`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanMovementDetailModalComponent.load`

- **Firma:** `load(id: string): void` — [movement-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-detail-modal/movement-detail-modal.component.ts#L83) (L83–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.movement.set`, `this.errorMessage.set`, `this.voiding.set`, `this.voidReason.set`, `this.service.getMovement(id).subscribe`, `this.service.getMovement`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.movement.set`, `this.errorMessage.set`, `this.voiding.set`, `this.voidReason.set`
- **Consumidores:** (mismo archivo)

##### `GuayacanMovementDetailModalComponent.confirmVoid`

- **Firma:** `confirmVoid(): Promise<void>` — [movement-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-detail-modal/movement-detail-modal.component.ts#L101) (L101–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.movement`, `this.voidReason().trim`, `this.voidReason`, `this.isSaving`, `this.confirmDialog.confirm`, `formatCurrency`, `Math.abs`, `this.isSaving.set`, `this.service.voidMovement(movement.id, reason).subscribe`, `this.service.voidMovement`, `this.voiding.set`, `this.movement.set`, `this.changed.emit`, `this.errorMessage.set`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.voiding.set`, `this.movement.set`, `this.errorMessage.set`; Emite eventos: `this.changed.emit`
- **Consumidores:** `movement-detail-modal.component.html` (plantilla)

##### `GuayacanMovementDetailModalComponent.close`

- **Firma:** `close(): void` — [movement-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-detail-modal/movement-detail-modal.component.ts#L132) (L132–136)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `movement-detail-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-spec-ts"></a>

### movement-form-modal.component.spec.ts

- **Ruta:** [movement-form-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.spec.ts`, 159 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-guayacan-cash-box`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [guayacan-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-box-service-ts), [movement-form-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`, `@angular/common`
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts"></a>

### movement-form-modal.component.ts

- **Ruta:** [movement-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.ts`, 234 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-guayacan-cash-box`
- **Responsabilidad:** "+ Ingreso a caja" / "− Egreso de caja" / "Ajuste" (admin).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [guayacan-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-box-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [guayacan-cash.util.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`, `rxjs`
- **Consumidores:** [movement-form-modal.component.spec.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-spec-ts), [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts), [guayacan-cash-box-page.component.ts (plantilla)](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts) (plantilla)
- **Plantilla:** [movement-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(ngModelChange)="businessDate.set($event)"`, `(click)="adjustmentSign.set(1)"`, `(click)="adjustmentSign.set(-1)"`, `(ngModelChange)="onAmountChange($event)"`, `(ngModelChange)="concept.set($event)"`, `(ngModelChange)="reason.set($event)"`, `(ngModelChange)="notes.set($event)"`, `(change)="toggleBreakdown()"`, `(quantityChange)="onQuantityChange($event)"`, `(click)="submit()"`

**Interfaces, tipos y enums:**

- `type GuayacanMovementFormMode` (L33) = `'INGRESO' \| 'EGRESO' \| 'AJUSTE'`

#### Clase `GuayacanMovementFormModalComponent` (L49–233)

- **Decoradores:** `@Component({ selector: 'app-guayacan-movement-form-modal', standalone: true, imports: [FormsModule, DecimalInputDirective, ButtonComponent, IconComponent, CashBr`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "+ Ingreso a caja" / "− Egreso de caja" / "Ajuste" (admin). Autocontenido (llama al servicio y emite el movimiento guardado). La vista previa "saldo anterior → saldo nuevo" es solo UX: el backend recalcula bajo lock y rechaza un egreso mayor al efectivo. `requestId` se genera al abrir el modal y se reenvía en cada reintento: un doble clic o un error de red nunca registran dos movimientos. No se cierra al hacer clic fuera.
- **Servicios inyectados con `inject()`:** `service = inject(GuayacanCashBoxService)`, `confirmDialog = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input mode = 'INGRESO'`, `@Input currentBalance = 0`, `@Input suggestedAmount = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<GuayacanCashMovementDetail>()`, `amount = signal(0)`, `adjustmentSign = signal<1 \| -1>(1)`, `businessDate = signal(this.today)`, `concept = signal('')`, `reason = signal('')`, `notes = signal('')`, `useBreakdown = signal(false)`, `cashCounts = signal<Record<string, number>>(emptyCashCounts())`, `isSaving = signal(false)`, `errorMessage = signal<string \| null>(null)`, `balance = signal(0)`, `modeSignal = signal<GuayacanMovementFormMode>('INGRESO')`, `title = computed(() => TITLES[this.modeSignal()])`, `isAdjustment = computed(() => this.modeSignal() === 'AJUSTE')`, `signedAmount = computed(() => { const amount = round2(this.amount`, `balanceAfter = computed(() => round2(this.balance() + this.signed`, `breakdownTotal = computed(() => cashCountsTotal(this.cashCounts()))`, `breakdownStatus = computed(() => cashStatus(this.breakdownTotal(), r`, `validationError = computed<string \| null>(() => { if (!(this.amount(`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 130–140 | `changes: SimpleChanges` | `void` |
| `reset` | método private | 142–155 | — | `void` |
| `onAmountChange` | método public | 157–159 | `value: number \| null` | `void` |
| `onQuantityChange` | método public | 161–163 | `event: { denomination: number; quantity: number }` | `void` |
| `toggleBreakdown` | método public | 165–170 | — | `void` |
| `submit` | método public async | 172–218 | — | `Promise<void>` |
| `close` | método public async | 220–232 | — | `Promise<void>` |

##### `GuayacanMovementFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [movement-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.ts#L130) (L130–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.modeSignal.set`, `this.balance.set`, `this.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.modeSignal.set`, `this.balance.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanMovementFormModalComponent.reset`

- **Firma:** `reset(): void` — [movement-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.ts#L142) (L142–155)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `crypto.randomUUID`, `this.amount.set`, `Math.abs`, `round2`, `this.adjustmentSign.set`, `this.businessDate.set`, `this.concept.set`, `this.reason.set`, `this.notes.set`, `this.useBreakdown.set`, `this.cashCounts.set`, `emptyCashCounts`, `this.errorMessage.set`, `this.isSaving.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.amount.set`, `this.adjustmentSign.set`, `this.businessDate.set`, `this.concept.set`, `this.reason.set`, `this.notes.set`
- **Consumidores:** (mismo archivo)

##### `GuayacanMovementFormModalComponent.onAmountChange`

- **Firma:** `onAmountChange(value: number \| null): void` — [movement-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.ts#L157) (L157–159)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.amount.set`, `Number.isNaN`, `Math.max`
- **Efectos secundarios:** Actualiza estado (signals): `this.amount.set`
- **Consumidores:** `movement-form-modal.component.html` (plantilla)

##### `GuayacanMovementFormModalComponent.onQuantityChange`

- **Firma:** `onQuantityChange(event: { denomination: number; quantity: number }): void` — [movement-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.ts#L161) (L161–163)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cashCounts.update`, `String`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashCounts.update`
- **Consumidores:** `movement-form-modal.component.html` (plantilla)

##### `GuayacanMovementFormModalComponent.toggleBreakdown`

- **Firma:** `toggleBreakdown(): void` — [movement-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.ts#L165) (L165–170)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.useBreakdown.update`, `this.useBreakdown`, `this.cashCounts.set`, `emptyCashCounts`
- **Efectos secundarios:** Actualiza estado (signals): `this.useBreakdown.update`, `this.cashCounts.set`
- **Consumidores:** `movement-form-modal.component.html` (plantilla)

##### `GuayacanMovementFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [movement-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.ts#L172) (L172–218)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.validationError`, `this.modeSignal`, `this.confirmDialog.confirm`, `this.title().toLowerCase`, `this.title`, `formatCurrency`, `Math.abs`, `this.signedAmount`, `this.balance`, `this.balanceAfter`, `this.isSaving.set`, `this.errorMessage.set`, `this.businessDate`, `this.concept().trim`, `this.concept`, `this.notes().trim`, `this.notes`…
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.errorMessage.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `movement-form-modal.component.html` (plantilla)

##### `GuayacanMovementFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [movement-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/components/movement-form-modal/movement-form-modal.component.ts#L220) (L220–232)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.amount`, `this.concept().trim`, `this.concept`, `this.breakdownTotal`, `this.confirmDialog.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `movement-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-spec-ts"></a>

### guayacan-cash-box-page.component.spec.ts

- **Ruta:** [guayacan-cash-box-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.spec.ts`, 216 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-guayacan-cash-box`
- **Responsabilidad:** Prueba unitaria: declara `period`, `movement`, `SUMMARY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [guayacan-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-box-service-ts), [guayacan-cash-sync.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-sync-service-ts), [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** —
#### Función `period` (L11–24)

- **Tipo:** función local del archivo
- **Firma:** `period(transactionCount: number, commissionTotal: number)` — [guayacan-cash-box-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.spec.ts#L11)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `movement` (L35–61)

- **Tipo:** función local del archivo
- **Firma:** `movement(id: string, amount: number, overrides?: Partial<GuayacanCashMovement>): GuayacanCashMovement` — [guayacan-cash-box-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.spec.ts#L35)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts"></a>

### guayacan-cash-box-page.component.ts

- **Ruta:** [guayacan-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts`, 258 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-guayacan-cash-box`
- **Responsabilidad:** "Cuadre de Caja Guayacán" — Kardex propio de Cooperativa Guayacán, independiente de Recargas, Caja de Ventas y saldos bancarios.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [guayacan-cash-box.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-box-service-ts), [guayacan-cash-sync.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-sync-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [refetch-on-tab-visible.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-refetch-on-tab-visible-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts), [movement-detail-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-detail-modal-movement-detail-modal-component-ts), [movement-form-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts), [guayacan-cash.util.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts), [guayacan-cash-box-page.component.spec.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-spec-ts)
- **Plantilla:** [guayacan-cash-box-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [movement-form-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts), [movement-detail-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-detail-modal-movement-detail-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="openForm('INGRESO')"`, `(click)="openForm('EGRESO')"`, `(click)="openForm('AJUSTE')"`, `(click)="loadSummary()"`, `(click)="cashPeriod.set(option)"`, `(adjustRequested)="openForm('AJUSTE', $event)"`, `(click)="loadCommissions()"`, `(pageChange)="onCommissionsPageChange($event)"`, `(ngModelChange)="draftStartDate.set($event)"`, `(ngModelChange)="draftEndDate.set($event)"`, `(ngModelChange)="draftType.set($event)"`, `(click)="applyFilters()"`, `(click)="clearFilters()"`, `(click)="loadMovements()"`, `(click)="detailId.set(m.id)"`

**Interfaces, tipos y enums:**

- `type Period` (L31) = `'daily' \| 'weekly' \| 'monthly'`

#### Clase `GuayacanCashBoxPageComponent` (L47–257)

- **Decoradores:** `@Component({ selector: 'app-guayacan-cash-box-page', standalone: true, imports: [ FormsModule, ButtonComponent, CardComponent, IconComponent, PageHeaderComponent`
- **Propósito:** "Cuadre de Caja Guayacán" — Kardex propio de Cooperativa Guayacán, independiente de Recargas, Caja de Ventas y saldos bancarios. Todo número viene del backend (`GET /guayacan-cash-box/*`): saldo, períodos de Guatemala (día / semana lunes–domingo / mes) y comisiones. Las comisiones entran solas al registrar operaciones Guayacán en Transaccionar; aquí solo se registran ingresos/egresos manuales, arqueos y (admin) ajustes y anulaciones.
- **Servicios inyectados con `inject()`:** `service = inject(GuayacanCashBoxService)`, `notifications = inject(NotificationService)`, `cashSync = inject(GuayacanCashSyncService)`, `isAdmin = inject(AuthService).isAdmin`
- **Datos / estado que administra:** `commissions = signal<GuayacanCommission[]>([])`, `totalCommissions = signal(0)`, `commissionsPage = signal(1)`, `loadingCommissions = signal(true)`, `commissionsFailed = signal(false)`, `summary = signal<GuayacanCashBoxSummary \| null>(null)`, `loadingSummary = signal(true)`, `summaryFailed = signal(false)`, `cashPeriod = signal<Period>('daily')`, `movements = signal<GuayacanCashMovement[]>([])`, `totalMovements = signal(0)`, `page = signal(1)`, `loadingMovements = signal(true)`, `movementsFailed = signal(false)`, `draftStartDate = signal('')`, `draftEndDate = signal('')`, `draftType = signal<GuayacanCashMovementType \| ''>('')`, `appliedFilters = signal<{ startDate: string; endDate: string; type:`, `hasFilters = computed(() => { const filters = this.appliedFilte`, `formMode = signal<GuayacanMovementFormMode \| null>(null)`, `suggestedAdjustment = signal<number \| null>(null)`, `detailId = signal<string \| null>(null)`, `balance = computed(() => this.summary()?.balance ?? 0)`, `commissionRate = computed(() => this.summary()?.agent?.commissionPe`, `cashPeriodSummary = computed<GuayacanPeriodSummary \| null>(() => this.`, `periods = computed(() => { const summary = this.summary(); r`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `loadCommissions` | método public | 147–160 | — | `void` |
| `onCommissionsPageChange` | método public | 162–165 | `page: number` | `void` |
| `loadSummary` | método public | 167–179 | — | `void` |
| `loadMovements` | método public | 181–206 | — | `void` |
| `applyFilters` | método public | 208–216 | — | `void` |
| `clearFilters` | método public | 218–223 | — | `void` |
| `onPageChange` | método public | 225–228 | `page: number` | `void` |
| `openForm` | método public | 230–233 | `mode: GuayacanMovementFormMode`, `suggested?: number \| null` | `void` |
| `onSaved` | método public | 235–239 | `movement: GuayacanCashMovementDetail` | `void` |
| `onDetailChanged` | método public | 241–244 | — | `void` |
| `refreshAfterChange` | método private | 247–252 | — | `void` |
| `isIncome` | método public | 254–256 | `movement: GuayacanCashMovement` | `boolean` |

##### `GuayacanCashBoxPageComponent.loadCommissions`

- **Firma:** `loadCommissions(): void` — [guayacan-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts#L147) (L147–160)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.commissionsFailed.set`, `this.service.getCommissions`, `this.commissionsPage`, `this.commissions.set`, `this.totalCommissions.set`, `this.loadingCommissions.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.commissionsFailed.set`, `this.commissions.set`, `this.totalCommissions.set`, `this.loadingCommissions.set`
- **Consumidores:** `guayacan-cash-box-page.component.html` (plantilla), (mismo archivo)

##### `GuayacanCashBoxPageComponent.onCommissionsPageChange`

- **Firma:** `onCommissionsPageChange(page: number): void` — [guayacan-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts#L162) (L162–165)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.commissionsPage.set`, `this.loadCommissions`
- **Efectos secundarios:** Actualiza estado (signals): `this.commissionsPage.set`
- **Consumidores:** `guayacan-cash-box-page.component.html` (plantilla)

##### `GuayacanCashBoxPageComponent.loadSummary`

- **Firma:** `loadSummary(): void` — [guayacan-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts#L167) (L167–179)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.summaryFailed.set`, `this.service.getSummary().subscribe`, `this.service.getSummary`, `this.summary.set`, `this.loadingSummary.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.summaryFailed.set`, `this.summary.set`, `this.loadingSummary.set`
- **Consumidores:** `guayacan-cash-box-page.component.html` (plantilla), (mismo archivo)

##### `GuayacanCashBoxPageComponent.loadMovements`

- **Firma:** `loadMovements(): void` — [guayacan-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts#L181) (L181–206)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.appliedFilters`, `this.movementsFailed.set`, `this.movements`, `this.loadingMovements.set`, `this.service.getMovements`, `this.page`, `this.movements.set`, `this.totalMovements.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.movementsFailed.set`, `this.loadingMovements.set`, `this.movements.set`, `this.totalMovements.set`
- **Consumidores:** `guayacan-cash-box-page.component.html` (plantilla), (mismo archivo)

##### `GuayacanCashBoxPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [guayacan-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts#L208) (L208–216)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStartDate`, `this.draftEndDate`, `this.notifications.error`, `this.appliedFilters.set`, `this.draftType`, `this.page.set`, `this.loadMovements`
- **Efectos secundarios:** Actualiza estado (signals): `this.appliedFilters.set`, `this.page.set`
- **Consumidores:** `guayacan-cash-box-page.component.html` (plantilla), (mismo archivo)

##### `GuayacanCashBoxPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [guayacan-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts#L218) (L218–223)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftType.set`, `this.applyFilters`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftStartDate.set`, `this.draftEndDate.set`, `this.draftType.set`
- **Consumidores:** `guayacan-cash-box-page.component.html` (plantilla)

##### `GuayacanCashBoxPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [guayacan-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts#L225) (L225–228)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.loadMovements`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `guayacan-cash-box-page.component.html` (plantilla)

##### `GuayacanCashBoxPageComponent.openForm`

- **Firma:** `openForm(mode: GuayacanMovementFormMode, suggested?: number \| null): void` — [guayacan-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts#L230) (L230–233)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.suggestedAdjustment.set`, `this.formMode.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.suggestedAdjustment.set`, `this.formMode.set`
- **Consumidores:** `guayacan-cash-box-page.component.html` (plantilla)

##### `GuayacanCashBoxPageComponent.onSaved`

- **Firma:** `onSaved(movement: GuayacanCashMovementDetail): void` — [guayacan-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts#L235) (L235–239)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.formMode.set`, `this.notifications.success`, `formatCurrency`, `this.cashSync.notifyChanged`
- **Efectos secundarios:** Actualiza estado (signals): `this.formMode.set`
- **Consumidores:** `guayacan-cash-box-page.component.html` (plantilla)

##### `GuayacanCashBoxPageComponent.onDetailChanged`

- **Firma:** `onDetailChanged(): void` — [guayacan-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts#L241) (L241–244)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.notifications.success`, `this.cashSync.notifyChanged`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `guayacan-cash-box-page.component.html` (plantilla)

##### `GuayacanCashBoxPageComponent.refreshAfterChange`

- **Firma:** `refreshAfterChange(): void` — [guayacan-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts#L247) (L247–252)
- **Propósito / descripción:** Tras cualquier escritura: saldo e indicadores del backend, y el Kardex desde la primera página.
- **Dependencias (llamadas en su cuerpo):** `this.loadSummary`, `this.page.set`, `this.loadMovements`, `this.loadCommissions`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashBoxPageComponent.isIncome`

- **Firma:** `isIncome(movement: GuayacanCashMovement): boolean` — [guayacan-cash-box-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash-box-page.component.ts#L254) (L254–256)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `guayacan-cash-box-page.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-spec-ts"></a>

### guayacan-cash.util.spec.ts

- **Ruta:** [guayacan-cash.util.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash.util.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash.util.spec.ts`, 48 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-guayacan-cash-box`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [guayacan-cash.util.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts"></a>

### guayacan-cash.util.ts

- **Ruta:** [guayacan-cash.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash.util.ts) (`comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash.util.ts`, 76 líneas)
- **Tipo:** Utilidad · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-guayacan-cash-box`
- **Responsabilidad:** Utilidad: declara `round2`, `emptyCashCounts`, `cashCountsTotal`, `cashCountsToDetails`, `cashStatus` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts)
- **Consumidores:** [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts), [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts), [count-detail-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-count-detail-modal-count-detail-modal-component-ts), [movement-detail-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-detail-modal-movement-detail-modal-component-ts), [movement-form-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts), [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts), [guayacan-cash.util.spec.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-spec-ts), [guayacan-cash-counts-page.component.ts](dashboard-guayacan-cash-counts.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-ts)

**Constantes exportadas:**

- `GUAYACAN_DENOMINATIONS` (L6): Mismas 11 denominaciones de Transaccionar (y de la validación SQL de la caja). = `BANK_DEPOSIT_CASH_DENOMINATIONS`
#### Función `round2` (L8–10)

- **Tipo:** función exportada
- **Firma:** `round2(value: number): number` — [guayacan-cash.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash.util.ts#L8)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [movement-form-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts)

#### Función `emptyCashCounts` (L12–14)

- **Tipo:** función exportada
- **Firma:** `emptyCashCounts(): Record<string, number>` — [guayacan-cash.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash.util.ts#L12)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Object.fromEntries`, `GUAYACAN_DENOMINATIONS.map`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts), [movement-form-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts)

#### Función `cashCountsTotal` (L16–18)

- **Tipo:** función exportada
- **Firma:** `cashCountsTotal(counts: Record<string, number>): number` — [guayacan-cash.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash.util.ts#L16)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `round2`, `GUAYACAN_DENOMINATIONS.reduce`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `cashCountsToDetails` (L21–29)

- **Tipo:** función exportada
- **Firma:** `cashCountsToDetails(counts: Record<string, number>, options: { keepZero: boolean }): GuayacanCashDenomination[]` — [guayacan-cash.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash.util.ts#L21)
- **Propósito / descripción:** Filas con cantidad &gt; 0 (movimiento) o todas (arqueo), en el formato del API.
- **Dependencias:** `GUAYACAN_DENOMINATIONS.map`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts), [movement-form-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts)

#### Función `cashStatus` (L32–37)

- **Tipo:** función exportada
- **Firma:** `cashStatus(total: number, target: number): CuadreStatus` — [guayacan-cash.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash.util.ts#L32)
- **Propósito / descripción:** Verde = cuadra con el objetivo, rojo = excede, amarillo = falta (mismo código de colores de Transaccionar).
- **Dependencias:** `round2`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `guatemalaToday` (L40–49)

- **Tipo:** función exportada
- **Firma:** `guatemalaToday(): string` — [guayacan-cash.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash.util.ts#L40)
- **Propósito / descripción:** `yyyy-MM-dd` de hoy en Guatemala, independientemente de la zona del navegador.
- **Dependencias:** `new Intl.DateTimeFormat`, `new Date`, `parts.find`, `get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `formatIsoDate` (L52–55)

- **Tipo:** función exportada
- **Firma:** `formatIsoDate(iso: string): string` — [guayacan-cash.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash.util.ts#L52)
- **Propósito / descripción:** `dd/MM/yyyy` de una fecha `yyyy-MM-dd` sin pasar por `Date` (sin desfase de zona).
- **Dependencias:** `iso.split`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `formatGuatemalaDateTime` (L58–70)

- **Tipo:** función exportada
- **Firma:** `formatGuatemalaDateTime(iso: string): string` — [guayacan-cash.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash.util.ts#L58)
- **Propósito / descripción:** `dd/MM/yyyy HH:mm` en Guatemala de un instante del servidor (`es-GT` no rellena el día, así que se arma a mano).
- **Dependencias:** `new Intl.DateTimeFormat`, `new Date`, `(parts.find((part) => part.type === type)?.value ?? '').padStart`, `parts.find`, `get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts)

#### Función `formatDifference` (L73–75)

- **Tipo:** función exportada
- **Firma:** `formatDifference(value: number): string` — [guayacan-cash.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/guayacan-cash-box/guayacan-cash.util.ts#L73)
- **Propósito / descripción:** Diferencia de arqueo con signo explícito: "+Q 25.00", "-Q 50.00", "Q 0.00".
- **Dependencias:** `formatSignedBankBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts)

