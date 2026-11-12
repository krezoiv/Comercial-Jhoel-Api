# Frontend `dashboard-home`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [financial-indicators.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-home-components-financial-indicators-financial-indicators-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Indicadores del mes" — Ventas de Recargas / Ventas / Compras / Transacciones Bancarias, all sourced from `GET /dashboard/summary` (see the backend `CLAUDE.md`'s "Dashboard" section). | 3 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [recharge-indicators-section.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-home-components-recharge-indicators-section-recharge-indicators-section-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Indicadores de Recargas Electrónicas" — 4 gráficas de anillo en Resumen, justo debajo de `TransactionMonthlyChartComponent` (sin tocarlo). | 4 internas; ext.: @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [dashboard-home.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DashboardHomeComponent`, `BANCOS_CARD_ID` (sin comentario de documentación en el código). | 9 internas; ext.: @angular/common, @angular/core, @angular/router, rxjs | 1 | Baja (1 consumidores) |
| [financial-indicators.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/financial-indicators/financial-indicators.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `financial-indicators.component.ts`; usa 2 componentes hijos: `app-icon`, `app-card`. | — | — | Media |
| [financial-indicators.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/financial-indicators/financial-indicators.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharge-indicators-section.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/recharge-indicators-section/recharge-indicators-section.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharge-indicators-section.component.ts`; usa 2 componentes hijos: `app-donut-chart`, `app-gauge-ring`. | — | — | Media |
| [recharge-indicators-section.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/recharge-indicators-section/recharge-indicators-section.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [dashboard-home.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/home/dashboard-home.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `dashboard-home.component.ts`; usa 8 componentes hijos: `app-icon`, `app-transaction-monthly-chart`, `app-recharge-indicators-section`, `app-transaction-summary-card`, `app-bank-balance-strip`, `app-card`. | — | — | Media |
| [dashboard-home.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/home/dashboard-home.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-home-components-financial-indicators-financial-indicators-component-ts"></a>

### financial-indicators.component.ts

- **Ruta:** [financial-indicators.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/financial-indicators/financial-indicators.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/home/components/financial-indicators/financial-indicators.component.ts`, 80 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-home`
- **Responsabilidad:** "Indicadores del mes" — Ventas de Recargas / Ventas / Compras / Transacciones Bancarias, all sourced from `GET /dashboard/summary` (see the backend `CLAUDE.md`'s "Dashboard" section).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [commission-summary-card.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-commission-summary-card-commission-summary-card-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [dashboard-home.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts), [dashboard-home.component.ts (plantilla)](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts) (plantilla)
- **Plantilla:** [financial-indicators.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/financial-indicators/financial-indicators.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts)

#### Clase `FinancialIndicatorsComponent` (L21–79)

- **Decoradores:** `@Component({ selector: 'app-financial-indicators', standalone: true, imports: [DatePipe, TitleCasePipe, CardComponent, IconComponent], templateUrl: './financial-`
- **Propósito:** "Indicadores del mes" — Ventas de Recargas / Ventas / Compras / Transacciones Bancarias, all sourced from `GET /dashboard/summary` (see the backend `CLAUDE.md`'s "Dashboard" section). Dumb/presentational: the parent (`DashboardHomeComponent`) owns the fetch, the `AuthService.isAdmin` gate, and loading/error state — this component only ever renders whatever `metrics` it's handed, or a loading/empty placeholder. No client-side date-range logic anywhere in this component — `period` (año/mes/rango) is rendered exactly as the backend computed it, never re-derived from the browser's own clock, so there is nothing here that could disagree with the server about which month "now" is.
- **Datos / estado que administra:** `_metrics = signal<DashboardMetrics \| null>(null)`, `@Input loading = false`, `@Input dailyBankTransactionCount = 0`, `periodDate = computed(() => { const period = this._metrics()?.p`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `metrics` | setter public | 30–32 | `value: DashboardMetrics \| null` | (inferido) |
| `metrics` | getter public | 33–35 | — | `DashboardMetrics \| null` |
| `dailyCommission` | getter public | 70–72 | — | `number` |
| `monthlyCommission` | getter public | 74–76 | — | `number` |

##### `FinancialIndicatorsComponent.metrics`

- **Firma:** `metrics(value: DashboardMetrics \| null)` — [financial-indicators.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/financial-indicators/financial-indicators.component.ts#L30) (L30–32)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this._metrics.set`
- **Efectos secundarios:** Actualiza estado (signals): `this._metrics.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialIndicatorsComponent.metrics`

- **Firma:** `metrics(): DashboardMetrics \| null` — [financial-indicators.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/financial-indicators/financial-indicators.component.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this._metrics`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialIndicatorsComponent.dailyCommission`

- **Firma:** `dailyCommission(): number` — [financial-indicators.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/financial-indicators/financial-indicators.component.ts#L70) (L70–72)
- **Propósito / descripción:** "Comisión Estimada" — a pure display transformation, never a real financial transaction: `subtransacciones × Q1.50` (see `COMMISSION_RATE_PER_TRANSACTION`'s own doc comment, reused as-is from Transaccionar's identical card rather than re-declaring the rate here). `monthlyCommission` is derived from `metrics.bankTransactions .totalTransactions` — the exact same count already shown as this card's own hero number — never a second query for the same data.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialIndicatorsComponent.monthlyCommission`

- **Firma:** `monthlyCommission(): number` — [financial-indicators.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/financial-indicators/financial-indicators.component.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-home-components-recharge-indicators-section-recharge-indicators-section-component-ts"></a>

### recharge-indicators-section.component.ts

- **Ruta:** [recharge-indicators-section.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/recharge-indicators-section/recharge-indicators-section.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/home/components/recharge-indicators-section/recharge-indicators-section.component.ts`, 89 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-home`
- **Responsabilidad:** "Indicadores de Recargas Electrónicas" — 4 gráficas de anillo en Resumen, justo debajo de `TransactionMonthlyChartComponent` (sin tocarlo).
- **Depende de (archivos del proyecto):** [recharges.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharges-service-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [dashboard-home.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts), [dashboard-home.component.ts (plantilla)](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts) (plantilla)
- **Plantilla:** [recharge-indicators-section.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/recharge-indicators-section/recharge-indicators-section.component.html) · **Usa componentes:** [donut-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-donut-chart-donut-chart-component-ts), [gauge-ring.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-gauge-ring-gauge-ring-component-ts)
- **Eventos enlazados en la plantilla:** `(retry)="fetch()"`

#### Clase `RechargeIndicatorsSectionComponent` (L32–88)

- **Decoradores:** `@Component({ selector: 'app-recharge-indicators-section', standalone: true, imports: [DonutChartComponent, GaugeRingComponent], templateUrl: './recharge-indicato`
- **Propósito:** "Indicadores de Recargas Electrónicas" — 4 gráficas de anillo en Resumen, justo debajo de `TransactionMonthlyChartComponent` (sin tocarlo). Un solo fetch (`getOperatorsSummary()`) alimenta las 4 tarjetas — nunca 4 llamadas separadas al mismo endpoint. Misma fuente de datos que ya usa el módulo de Recargas Electrónicas (saldo, ventas, compras) — nada se recalcula aquí, solo se separa por operadora y se formatea.
- **Servicios inyectados con `inject()`:** `rechargesService = inject(RechargesService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `operators = signal<RechargeOperatorStat[]>([])`, `claro = computed( () => this.operators().find((op) => op.r`, `tigo = computed( () => this.operators().find((op) => op.r`, `salesSegments = computed<DonutSegment[]>(() => [ { label: CLARO_NA`, `purchaseSegments = computed<DonutSegment[]>(() => [ { label: CLARO_NA`, `claroPercentage = computed(() => calculateBalancePercentage(this.cla`, `tigoPercentage = computed(() => calculateBalancePercentage(this.tig`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 73–87 | — | `void` |

##### `RechargeIndicatorsSectionComponent.fetch`

- **Firma:** `fetch(): void` — [recharge-indicators-section.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/recharge-indicators-section/recharge-indicators-section.component.ts#L73) (L73–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.rechargesService.getOperatorsSummary().pipe(catchError(() => of(null))).subscribe`, `this.rechargesService.getOperatorsSummary().pipe`, `this.rechargesService.getOperatorsSummary`, `catchError`, `of`, `this.operators.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.operators.set`
- **Consumidores:** `recharge-indicators-section.component.html` (plantilla)

#### Función `emptyStat` (L13–22)

- **Tipo:** función local del archivo
- **Firma:** `emptyStat(name: string): RechargeOperatorStat` — [recharge-indicators-section.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/home/components/recharge-indicators-section/recharge-indicators-section.component.ts#L13)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts"></a>

### dashboard-home.component.ts

- **Ruta:** [dashboard-home.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/home/dashboard-home.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/home/dashboard-home.component.ts`, 135 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-home`
- **Responsabilidad:** Componente Angular: declara `DashboardHomeComponent`, `BANCOS_CARD_ID` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [bank-deposit.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-service-ts), [dashboard-metrics.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-dashboard-metrics-service-ts), [dashboard-summary.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-dashboard-summary-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [financial-indicators.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-components-financial-indicators-financial-indicators-component-ts), [recharge-indicators-section.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-components-recharge-indicators-section-recharge-indicators-section-component-ts), [transaction-summary-card.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-summary-card-transaction-summary-card-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [dashboard-home.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/home/dashboard-home.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [transaction-monthly-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-transaction-monthly-chart-transaction-monthly-chart-component-ts), [recharge-indicators-section.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-components-recharge-indicators-section-recharge-indicators-section-component-ts), [transaction-summary-card.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-summary-card-transaction-summary-card-component-ts), [bank-balance-strip.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-strip-bank-balance-strip-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts), [financial-indicators.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-components-financial-indicators-financial-indicators-component-ts)

#### Clase `DashboardHomeComponent` (L26–134)

- **Decoradores:** `@Component({ selector: 'app-dashboard-home', standalone: true, imports: [ AsyncPipe, DatePipe, TitleCasePipe, RouterLink, CardComponent, IconComponent, SummaryTi`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `authService = inject(AuthService)`, `summaryService = inject(DashboardSummaryService)`, `bankDepositService = inject(BankDepositService)`, `dashboardMetricsService = inject(DashboardMetricsService)`
- **Datos / estado que administra:** `today = signal(new Date())`, `financialMetrics = signal<DashboardMetrics \| null>(null)`, `loadingFinancialMetrics = signal(false)`, `dailyTransactionSummary = signal<BankDepositTransactionSummary \| null>(null)`, `loadingDailyTransactionSummary = signal(true)`
