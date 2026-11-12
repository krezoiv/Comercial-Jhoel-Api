# Frontend `dashboard-graphs`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [daily-transactions-chart.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-daily-transactions-chart-daily-transactions-chart-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Transacciones del mes" en Gráficas → Indicadores de Transacciones — reutiliza `BankDepositService.getDailyStats()`, el mismo endpoint que ya usa `TransactionMonthlyChartComponent` en Resumen/Transaccionar/Reporte de Transacciones — cero cambios de backend para esta gráfica. | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [purchases-daily-chart.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-daily-chart-purchases-daily-chart-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Compras del mes" en Gráficas → Indicadores de Compras — reutiliza `PurchasesService.getDailyStats()`. | 4 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [purchases-weekly-chart.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-weekly-chart-purchases-weekly-chart-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Compras por semana" en Gráficas → Indicadores de Compras — reutiliza `PurchasesService.getWeeklyStats()`. | 4 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [purchases-yearly-chart.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-yearly-chart-purchases-yearly-chart-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Compras por mes" en Gráficas → Indicadores de Compras — reutiliza `PurchasesService.getYearlyStats()`. | 4 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [recharges-daily-chart.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-daily-chart-recharges-daily-chart-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Recargas del mes" en Gráficas → Indicadores de Recargas — reutiliza `RechargesService.getDailyStats()`. | 4 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [recharges-weekly-chart.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-weekly-chart-recharges-weekly-chart-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Recargas por semana" en Gráficas → Indicadores de Recargas — reutiliza `RechargesService.getWeeklyStats()`. | 4 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [recharges-yearly-chart.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-yearly-chart-recharges-yearly-chart-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Recargas por mes" en Gráficas → Indicadores de Recargas — reutiliza `RechargesService.getYearlyStats()`. | 4 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [sales-daily-chart.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-daily-chart-sales-daily-chart-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Ventas del mes" en Gráficas → Indicadores de Ventas — reutiliza `SalesService.getDailyStats()`. | 4 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [sales-weekly-chart.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-weekly-chart-sales-weekly-chart-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Ventas por semana" en Gráficas → Indicadores de Ventas — reutiliza `SalesService.getWeeklyStats()`. | 4 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [sales-yearly-chart.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-yearly-chart-sales-yearly-chart-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Ventas por mes" en Gráficas → Indicadores de Ventas — reutiliza `SalesService.getYearlyStats()`. | 4 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [weekly-transactions-chart.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-weekly-transactions-chart-weekly-transactions-chart-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Transacciones por semana" en Gráficas → Indicadores de Transacciones — reutiliza `BankDepositService.getWeeklyStats()`. | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [yearly-transactions-chart.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-yearly-transactions-chart-yearly-transactions-chart-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Transacciones por mes" en Gráficas → Indicadores de Transacciones — reutiliza `BankDepositService.getYearlyStats()`. | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [purchases-indicators-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-purchases-indicators-purchases-indicators-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Gráficas → Indicadores de Compras" — puramente visual, mismo esqueleto que "Indicadores de Transacciones"/"Indicadores de Ventas". | 4 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [recharges-indicators-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-recharges-indicators-recharges-indicators-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Gráficas → Indicadores de Recargas" — puramente visual, mismo esqueleto que "Indicadores de Transacciones"/"Indicadores de Ventas"/"Indicadores de Compras". | 4 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [sales-indicators-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-sales-indicators-sales-indicators-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Gráficas → Indicadores de Ventas" — puramente visual, mismo esqueleto que "Indicadores de Transacciones". | 4 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [transaction-indicators-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-graphs-transaction-indicators-transaction-indicators-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Gráficas → Indicadores de Transacciones" — puramente visual, sin filtros/tabla/exportación (eso ya existe en Reportería de Transacciones). | 4 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [daily-transactions-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/daily-transactions-chart/daily-transactions-chart.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `daily-transactions-chart.component.ts`; usa 1 componentes hijos: `app-line-chart`. | — | — | Media |
| [purchases-daily-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-daily-chart/purchases-daily-chart.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `purchases-daily-chart.component.ts`; usa 1 componentes hijos: `app-line-chart`. | — | — | Media |
| [purchases-weekly-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-weekly-chart/purchases-weekly-chart.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `purchases-weekly-chart.component.ts`; usa 1 componentes hijos: `app-line-chart`. | — | — | Media |
| [purchases-yearly-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-yearly-chart/purchases-yearly-chart.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `purchases-yearly-chart.component.ts`; usa 1 componentes hijos: `app-line-chart`. | — | — | Media |
| [recharges-daily-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-daily-chart/recharges-daily-chart.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharges-daily-chart.component.ts`; usa 1 componentes hijos: `app-line-chart`. | — | — | Media |
| [recharges-weekly-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-weekly-chart/recharges-weekly-chart.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharges-weekly-chart.component.ts`; usa 1 componentes hijos: `app-line-chart`. | — | — | Media |
| [recharges-yearly-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-yearly-chart/recharges-yearly-chart.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharges-yearly-chart.component.ts`; usa 1 componentes hijos: `app-line-chart`. | — | — | Media |
| [sales-daily-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-daily-chart/sales-daily-chart.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sales-daily-chart.component.ts`; usa 1 componentes hijos: `app-line-chart`. | — | — | Media |
| [sales-weekly-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-weekly-chart/sales-weekly-chart.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sales-weekly-chart.component.ts`; usa 1 componentes hijos: `app-line-chart`. | — | — | Media |
| [sales-yearly-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-yearly-chart/sales-yearly-chart.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sales-yearly-chart.component.ts`; usa 1 componentes hijos: `app-line-chart`. | — | — | Media |
| [weekly-transactions-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/weekly-transactions-chart/weekly-transactions-chart.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `weekly-transactions-chart.component.ts`; usa 1 componentes hijos: `app-line-chart`. | — | — | Media |
| [yearly-transactions-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/yearly-transactions-chart/yearly-transactions-chart.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `yearly-transactions-chart.component.ts`; usa 1 componentes hijos: `app-line-chart`. | — | — | Media |
| [purchases-indicators-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/purchases-indicators/purchases-indicators-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `purchases-indicators-page.component.ts`; usa 4 componentes hijos: `app-page-header`, `app-purchases-daily-chart`, `app-purchases-weekly-chart`, `app-purchases-yearly-chart`. | — | — | Media |
| [purchases-indicators-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/purchases-indicators/purchases-indicators-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [recharges-indicators-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/recharges-indicators/recharges-indicators-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `recharges-indicators-page.component.ts`; usa 4 componentes hijos: `app-page-header`, `app-recharges-daily-chart`, `app-recharges-weekly-chart`, `app-recharges-yearly-chart`. | — | — | Media |
| [recharges-indicators-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/recharges-indicators/recharges-indicators-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [sales-indicators-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/sales-indicators/sales-indicators-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `sales-indicators-page.component.ts`; usa 4 componentes hijos: `app-page-header`, `app-sales-daily-chart`, `app-sales-weekly-chart`, `app-sales-yearly-chart`. | — | — | Media |
| [sales-indicators-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/sales-indicators/sales-indicators-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-indicators-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/transaction-indicators/transaction-indicators-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `transaction-indicators-page.component.ts`; usa 4 componentes hijos: `app-page-header`, `app-daily-transactions-chart`, `app-weekly-transactions-chart`, `app-yearly-transactions-chart`. | — | — | Media |
| [transaction-indicators-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/transaction-indicators/transaction-indicators-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-daily-transactions-chart-daily-transactions-chart-component-ts"></a>

### daily-transactions-chart.component.ts

- **Ruta:** [daily-transactions-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/daily-transactions-chart/daily-transactions-chart.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/components/daily-transactions-chart/daily-transactions-chart.component.ts`, 85 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Transacciones del mes" en Gráficas → Indicadores de Transacciones — reutiliza `BankDepositService.getDailyStats()`, el mismo endpoint que ya usa `TransactionMonthlyChartComponent` en Resumen/Transaccionar/Reporte de Transacciones — cero cambios de backend para esta gráfica.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [transaction-indicators-page.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-transaction-indicators-transaction-indicators-page-component-ts), [transaction-indicators-page.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-transaction-indicators-transaction-indicators-page-component-ts) (plantilla)
- **Plantilla:** [daily-transactions-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/daily-transactions-chart/daily-transactions-chart.component.html) · **Usa componentes:** [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts)
- **Eventos enlazados en la plantilla:** `(retry)="fetch()"`

#### Clase `DailyTransactionsChartComponent` (L38–84)

- **Decoradores:** `@Component({ selector: 'app-daily-transactions-chart', standalone: true, imports: [LineChartComponent], templateUrl: './daily-transactions-chart.component.html',`
- **Propósito:** "Transacciones del mes" en Gráficas → Indicadores de Transacciones — reutiliza `BankDepositService.getDailyStats()`, el mismo endpoint que ya usa `TransactionMonthlyChartComponent` en Resumen/Transaccionar/Reporte de Transacciones — cero cambios de backend para esta gráfica. Solo traduce esos días a `LineChartPoint[]` y delega todo el dibujo a `app-line-chart`.
- **Servicios inyectados con `inject()`:** `bankDepositService = inject(BankDepositService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `days = signal<BankDepositDailyStat[]>([])`, `points = computed<LineChartPoint[]>(() => { const todayIso `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 70–83 | — | `void` |

##### `DailyTransactionsChartComponent.fetch`

- **Firma:** `fetch(): void` — [daily-transactions-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/daily-transactions-chart/daily-transactions-chart.component.ts#L70) (L70–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.bankDepositService.getDailyStats().subscribe`, `this.bankDepositService.getDailyStats`, `this.days.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.days.set`
- **Consumidores:** `daily-transactions-chart.component.html` (plantilla)

#### Función `todayIsoDate` (L23–28)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [daily-transactions-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/daily-transactions-chart/daily-transactions-chart.component.ts#L23)
- **Propósito / descripción:** Local-time `yyyy-MM-dd` — small per-feature copy of the same helper already duplicated across this codebase (see `TransactionMonthlyChartComponent`'s own copy) rather than a shared util.
- **Dependencias:** `new Date`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`, `now.getFullYear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-daily-chart-purchases-daily-chart-component-ts"></a>

### purchases-daily-chart.component.ts

- **Ruta:** [purchases-daily-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-daily-chart/purchases-daily-chart.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-daily-chart/purchases-daily-chart.component.ts`, 84 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Compras del mes" en Gráficas → Indicadores de Compras — reutiliza `PurchasesService.getDailyStats()`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [purchases.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-purchases-service-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [purchases-indicators-page.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-purchases-indicators-purchases-indicators-page-component-ts), [purchases-indicators-page.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-purchases-indicators-purchases-indicators-page-component-ts) (plantilla)
- **Plantilla:** [purchases-daily-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-daily-chart/purchases-daily-chart.component.html) · **Usa componentes:** [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts)
- **Eventos enlazados en la plantilla:** `(retry)="fetch()"`

#### Clase `PurchasesDailyChartComponent` (L35–83)

- **Decoradores:** `@Component({ selector: 'app-purchases-daily-chart', standalone: true, imports: [LineChartComponent], templateUrl: './purchases-daily-chart.component.html', chang`
- **Propósito:** "Compras del mes" en Gráficas → Indicadores de Compras — reutiliza `PurchasesService.getDailyStats()`. Monto total comprado (Q), no cantidad de compras — confirmado con el usuario.
- **Servicios inyectados con `inject()`:** `purchasesService = inject(PurchasesService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `days = signal<PurchasesDailyStat[]>([])`, `points = computed<LineChartPoint[]>(() => { const todayIso `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 69–82 | — | `void` |

##### `PurchasesDailyChartComponent.fetch`

- **Firma:** `fetch(): void` — [purchases-daily-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-daily-chart/purchases-daily-chart.component.ts#L69) (L69–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.purchasesService.getDailyStats().subscribe`, `this.purchasesService.getDailyStats`, `this.days.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.days.set`
- **Consumidores:** `purchases-daily-chart.component.html` (plantilla)

#### Función `todayIsoDate` (L23–28)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [purchases-daily-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-daily-chart/purchases-daily-chart.component.ts#L23)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`, `now.getFullYear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-weekly-chart-purchases-weekly-chart-component-ts"></a>

### purchases-weekly-chart.component.ts

- **Ruta:** [purchases-weekly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-weekly-chart/purchases-weekly-chart.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-weekly-chart/purchases-weekly-chart.component.ts`, 63 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Compras por semana" en Gráficas → Indicadores de Compras — reutiliza `PurchasesService.getWeeklyStats()`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [purchases.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-purchases-service-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [purchases-indicators-page.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-purchases-indicators-purchases-indicators-page-component-ts), [purchases-indicators-page.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-purchases-indicators-purchases-indicators-page-component-ts) (plantilla)
- **Plantilla:** [purchases-weekly-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-weekly-chart/purchases-weekly-chart.component.html) · **Usa componentes:** [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts)
- **Eventos enlazados en la plantilla:** `(retry)="fetch()"`

#### Clase `PurchasesWeeklyChartComponent` (L20–62)

- **Decoradores:** `@Component({ selector: 'app-purchases-weekly-chart', standalone: true, imports: [LineChartComponent], templateUrl: './purchases-weekly-chart.component.html', cha`
- **Propósito:** "Compras por semana" en Gráficas → Indicadores de Compras — reutiliza `PurchasesService.getWeeklyStats()`. Buckets fijos de 7 días desde el día 1 del mes actual, nunca semana ISO — se reinicia solo cada mes.
- **Servicios inyectados con `inject()`:** `purchasesService = inject(PurchasesService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `weeks = signal<PurchasesWeeklyStat[]>([])`, `points = computed<LineChartPoint[]>(() => this.weeks().map(`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 48–61 | — | `void` |

##### `PurchasesWeeklyChartComponent.fetch`

- **Firma:** `fetch(): void` — [purchases-weekly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-weekly-chart/purchases-weekly-chart.component.ts#L48) (L48–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.purchasesService.getWeeklyStats().subscribe`, `this.purchasesService.getWeeklyStats`, `this.weeks.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.weeks.set`
- **Consumidores:** `purchases-weekly-chart.component.html` (plantilla)

#### Función `shortDayMonth` (L8–13)

- **Tipo:** función local del archivo
- **Firma:** `shortDayMonth(isoDate: string): string` — [purchases-weekly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-weekly-chart/purchases-weekly-chart.component.ts#L8)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`, `isoDate.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-yearly-chart-purchases-yearly-chart-component-ts"></a>

### purchases-yearly-chart.component.ts

- **Ruta:** [purchases-yearly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-yearly-chart/purchases-yearly-chart.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-yearly-chart/purchases-yearly-chart.component.ts`, 59 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Compras por mes" en Gráficas → Indicadores de Compras — reutiliza `PurchasesService.getYearlyStats()`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [purchases.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-purchases-service-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [purchases-indicators-page.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-purchases-indicators-purchases-indicators-page-component-ts), [purchases-indicators-page.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-purchases-indicators-purchases-indicators-page-component-ts) (plantilla)
- **Plantilla:** [purchases-yearly-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-yearly-chart/purchases-yearly-chart.component.html) · **Usa componentes:** [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts)
- **Eventos enlazados en la plantilla:** `(retry)="fetch()"`

#### Clase `PurchasesYearlyChartComponent` (L14–58)

- **Decoradores:** `@Component({ selector: 'app-purchases-yearly-chart', standalone: true, imports: [LineChartComponent], templateUrl: './purchases-yearly-chart.component.html', cha`
- **Propósito:** "Compras por mes" en Gráficas → Indicadores de Compras — reutiliza `PurchasesService.getYearlyStats()`. A diferencia de las otras dos gráficas de este módulo, NO se reinicia cada mes — enero hasta el mes actual del año en curso, acumulativo.
- **Servicios inyectados con `inject()`:** `purchasesService = inject(PurchasesService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `months = signal<PurchasesMonthlyStat[]>([])`, `year = signal<number \| null>(null)`, `points = computed<LineChartPoint[]>(() => this.months().map`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 43–57 | — | `void` |

##### `PurchasesYearlyChartComponent.fetch`

- **Firma:** `fetch(): void` — [purchases-yearly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/purchases-yearly-chart/purchases-yearly-chart.component.ts#L43) (L43–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.purchasesService.getYearlyStats().subscribe`, `this.purchasesService.getYearlyStats`, `this.months.set`, `this.year.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.months.set`, `this.year.set`
- **Consumidores:** `purchases-yearly-chart.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-daily-chart-recharges-daily-chart-component-ts"></a>

### recharges-daily-chart.component.ts

- **Ruta:** [recharges-daily-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-daily-chart/recharges-daily-chart.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-daily-chart/recharges-daily-chart.component.ts`, 84 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Recargas del mes" en Gráficas → Indicadores de Recargas — reutiliza `RechargesService.getDailyStats()`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [recharges.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharges-service-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [recharges-indicators-page.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-recharges-indicators-recharges-indicators-page-component-ts), [recharges-indicators-page.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-recharges-indicators-recharges-indicators-page-component-ts) (plantilla)
- **Plantilla:** [recharges-daily-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-daily-chart/recharges-daily-chart.component.html) · **Usa componentes:** [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts)
- **Eventos enlazados en la plantilla:** `(retry)="fetch()"`

#### Clase `RechargesDailyChartComponent` (L35–83)

- **Decoradores:** `@Component({ selector: 'app-recharges-daily-chart', standalone: true, imports: [LineChartComponent], templateUrl: './recharges-daily-chart.component.html', chang`
- **Propósito:** "Recargas del mes" en Gráficas → Indicadores de Recargas — reutiliza `RechargesService.getDailyStats()`. Venta total combinada Claro + Tigo (nunca separada por operador — confirmado con el usuario).
- **Servicios inyectados con `inject()`:** `rechargesService = inject(RechargesService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `days = signal<RechargesDailyStat[]>([])`, `points = computed<LineChartPoint[]>(() => { const todayIso `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 69–82 | — | `void` |

##### `RechargesDailyChartComponent.fetch`

- **Firma:** `fetch(): void` — [recharges-daily-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-daily-chart/recharges-daily-chart.component.ts#L69) (L69–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.rechargesService.getDailyStats().subscribe`, `this.rechargesService.getDailyStats`, `this.days.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.days.set`
- **Consumidores:** `recharges-daily-chart.component.html` (plantilla)

#### Función `todayIsoDate` (L23–28)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [recharges-daily-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-daily-chart/recharges-daily-chart.component.ts#L23)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`, `now.getFullYear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-weekly-chart-recharges-weekly-chart-component-ts"></a>

### recharges-weekly-chart.component.ts

- **Ruta:** [recharges-weekly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-weekly-chart/recharges-weekly-chart.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-weekly-chart/recharges-weekly-chart.component.ts`, 63 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Recargas por semana" en Gráficas → Indicadores de Recargas — reutiliza `RechargesService.getWeeklyStats()`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [recharges.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharges-service-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [recharges-indicators-page.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-recharges-indicators-recharges-indicators-page-component-ts), [recharges-indicators-page.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-recharges-indicators-recharges-indicators-page-component-ts) (plantilla)
- **Plantilla:** [recharges-weekly-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-weekly-chart/recharges-weekly-chart.component.html) · **Usa componentes:** [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts)
- **Eventos enlazados en la plantilla:** `(retry)="fetch()"`

#### Clase `RechargesWeeklyChartComponent` (L20–62)

- **Decoradores:** `@Component({ selector: 'app-recharges-weekly-chart', standalone: true, imports: [LineChartComponent], templateUrl: './recharges-weekly-chart.component.html', cha`
- **Propósito:** "Recargas por semana" en Gráficas → Indicadores de Recargas — reutiliza `RechargesService.getWeeklyStats()`. Buckets fijos de 7 días desde el día 1 del mes actual, nunca semana ISO — se reinicia solo cada mes.
- **Servicios inyectados con `inject()`:** `rechargesService = inject(RechargesService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `weeks = signal<RechargesWeeklyStat[]>([])`, `points = computed<LineChartPoint[]>(() => this.weeks().map(`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 48–61 | — | `void` |

##### `RechargesWeeklyChartComponent.fetch`

- **Firma:** `fetch(): void` — [recharges-weekly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-weekly-chart/recharges-weekly-chart.component.ts#L48) (L48–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.rechargesService.getWeeklyStats().subscribe`, `this.rechargesService.getWeeklyStats`, `this.weeks.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.weeks.set`
- **Consumidores:** `recharges-weekly-chart.component.html` (plantilla)

#### Función `shortDayMonth` (L8–13)

- **Tipo:** función local del archivo
- **Firma:** `shortDayMonth(isoDate: string): string` — [recharges-weekly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-weekly-chart/recharges-weekly-chart.component.ts#L8)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`, `isoDate.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-yearly-chart-recharges-yearly-chart-component-ts"></a>

### recharges-yearly-chart.component.ts

- **Ruta:** [recharges-yearly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-yearly-chart/recharges-yearly-chart.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-yearly-chart/recharges-yearly-chart.component.ts`, 59 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Recargas por mes" en Gráficas → Indicadores de Recargas — reutiliza `RechargesService.getYearlyStats()`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [recharges.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharges-service-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [recharges-indicators-page.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-recharges-indicators-recharges-indicators-page-component-ts), [recharges-indicators-page.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-recharges-indicators-recharges-indicators-page-component-ts) (plantilla)
- **Plantilla:** [recharges-yearly-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-yearly-chart/recharges-yearly-chart.component.html) · **Usa componentes:** [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts)
- **Eventos enlazados en la plantilla:** `(retry)="fetch()"`

#### Clase `RechargesYearlyChartComponent` (L14–58)

- **Decoradores:** `@Component({ selector: 'app-recharges-yearly-chart', standalone: true, imports: [LineChartComponent], templateUrl: './recharges-yearly-chart.component.html', cha`
- **Propósito:** "Recargas por mes" en Gráficas → Indicadores de Recargas — reutiliza `RechargesService.getYearlyStats()`. A diferencia de las otras dos gráficas de este módulo, NO se reinicia cada mes — enero hasta el mes actual del año en curso, acumulativo.
- **Servicios inyectados con `inject()`:** `rechargesService = inject(RechargesService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `months = signal<RechargesMonthlyStat[]>([])`, `year = signal<number \| null>(null)`, `points = computed<LineChartPoint[]>(() => this.months().map`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 43–57 | — | `void` |

##### `RechargesYearlyChartComponent.fetch`

- **Firma:** `fetch(): void` — [recharges-yearly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/recharges-yearly-chart/recharges-yearly-chart.component.ts#L43) (L43–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.rechargesService.getYearlyStats().subscribe`, `this.rechargesService.getYearlyStats`, `this.months.set`, `this.year.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.months.set`, `this.year.set`
- **Consumidores:** `recharges-yearly-chart.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-daily-chart-sales-daily-chart-component-ts"></a>

### sales-daily-chart.component.ts

- **Ruta:** [sales-daily-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-daily-chart/sales-daily-chart.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-daily-chart/sales-daily-chart.component.ts`, 84 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Ventas del mes" en Gráficas → Indicadores de Ventas — reutiliza `SalesService.getDailyStats()`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [sales.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-service-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [sales-indicators-page.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-sales-indicators-sales-indicators-page-component-ts), [sales-indicators-page.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-sales-indicators-sales-indicators-page-component-ts) (plantilla)
- **Plantilla:** [sales-daily-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-daily-chart/sales-daily-chart.component.html) · **Usa componentes:** [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts)
- **Eventos enlazados en la plantilla:** `(retry)="fetch()"`

#### Clase `SalesDailyChartComponent` (L35–83)

- **Decoradores:** `@Component({ selector: 'app-sales-daily-chart', standalone: true, imports: [LineChartComponent], templateUrl: './sales-daily-chart.component.html', changeDetecti`
- **Propósito:** "Ventas del mes" en Gráficas → Indicadores de Ventas — reutiliza `SalesService.getDailyStats()`. Monto total vendido (Q), no cantidad de ventas — confirmado con el usuario.
- **Servicios inyectados con `inject()`:** `salesService = inject(SalesService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `days = signal<SalesDailyStat[]>([])`, `points = computed<LineChartPoint[]>(() => { const todayIso `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 69–82 | — | `void` |

##### `SalesDailyChartComponent.fetch`

- **Firma:** `fetch(): void` — [sales-daily-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-daily-chart/sales-daily-chart.component.ts#L69) (L69–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.salesService.getDailyStats().subscribe`, `this.salesService.getDailyStats`, `this.days.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.days.set`
- **Consumidores:** `sales-daily-chart.component.html` (plantilla)

#### Función `todayIsoDate` (L23–28)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [sales-daily-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-daily-chart/sales-daily-chart.component.ts#L23)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`, `now.getFullYear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-weekly-chart-sales-weekly-chart-component-ts"></a>

### sales-weekly-chart.component.ts

- **Ruta:** [sales-weekly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-weekly-chart/sales-weekly-chart.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-weekly-chart/sales-weekly-chart.component.ts`, 63 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Ventas por semana" en Gráficas → Indicadores de Ventas — reutiliza `SalesService.getWeeklyStats()`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [sales.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-service-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [sales-indicators-page.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-sales-indicators-sales-indicators-page-component-ts), [sales-indicators-page.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-sales-indicators-sales-indicators-page-component-ts) (plantilla)
- **Plantilla:** [sales-weekly-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-weekly-chart/sales-weekly-chart.component.html) · **Usa componentes:** [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts)
- **Eventos enlazados en la plantilla:** `(retry)="fetch()"`

#### Clase `SalesWeeklyChartComponent` (L20–62)

- **Decoradores:** `@Component({ selector: 'app-sales-weekly-chart', standalone: true, imports: [LineChartComponent], templateUrl: './sales-weekly-chart.component.html', changeDetec`
- **Propósito:** "Ventas por semana" en Gráficas → Indicadores de Ventas — reutiliza `SalesService.getWeeklyStats()`. Buckets fijos de 7 días desde el día 1 del mes actual, nunca semana ISO — se reinicia solo cada mes.
- **Servicios inyectados con `inject()`:** `salesService = inject(SalesService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `weeks = signal<SalesWeeklyStat[]>([])`, `points = computed<LineChartPoint[]>(() => this.weeks().map(`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 48–61 | — | `void` |

##### `SalesWeeklyChartComponent.fetch`

- **Firma:** `fetch(): void` — [sales-weekly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-weekly-chart/sales-weekly-chart.component.ts#L48) (L48–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.salesService.getWeeklyStats().subscribe`, `this.salesService.getWeeklyStats`, `this.weeks.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.weeks.set`
- **Consumidores:** `sales-weekly-chart.component.html` (plantilla)

#### Función `shortDayMonth` (L8–13)

- **Tipo:** función local del archivo
- **Firma:** `shortDayMonth(isoDate: string): string` — [sales-weekly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-weekly-chart/sales-weekly-chart.component.ts#L8)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`, `isoDate.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-yearly-chart-sales-yearly-chart-component-ts"></a>

### sales-yearly-chart.component.ts

- **Ruta:** [sales-yearly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-yearly-chart/sales-yearly-chart.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-yearly-chart/sales-yearly-chart.component.ts`, 59 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Ventas por mes" en Gráficas → Indicadores de Ventas — reutiliza `SalesService.getYearlyStats()`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [sales.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-service-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [sales-indicators-page.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-sales-indicators-sales-indicators-page-component-ts), [sales-indicators-page.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-sales-indicators-sales-indicators-page-component-ts) (plantilla)
- **Plantilla:** [sales-yearly-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-yearly-chart/sales-yearly-chart.component.html) · **Usa componentes:** [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts)
- **Eventos enlazados en la plantilla:** `(retry)="fetch()"`

#### Clase `SalesYearlyChartComponent` (L14–58)

- **Decoradores:** `@Component({ selector: 'app-sales-yearly-chart', standalone: true, imports: [LineChartComponent], templateUrl: './sales-yearly-chart.component.html', changeDetec`
- **Propósito:** "Ventas por mes" en Gráficas → Indicadores de Ventas — reutiliza `SalesService.getYearlyStats()`. A diferencia de las otras dos gráficas de este módulo, NO se reinicia cada mes — enero hasta el mes actual del año en curso, acumulativo.
- **Servicios inyectados con `inject()`:** `salesService = inject(SalesService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `months = signal<SalesMonthlyStat[]>([])`, `year = signal<number \| null>(null)`, `points = computed<LineChartPoint[]>(() => this.months().map`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 43–57 | — | `void` |

##### `SalesYearlyChartComponent.fetch`

- **Firma:** `fetch(): void` — [sales-yearly-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-yearly-chart/sales-yearly-chart.component.ts#L43) (L43–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.salesService.getYearlyStats().subscribe`, `this.salesService.getYearlyStats`, `this.months.set`, `this.year.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.months.set`, `this.year.set`
- **Consumidores:** `sales-yearly-chart.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-weekly-transactions-chart-weekly-transactions-chart-component-ts"></a>

### weekly-transactions-chart.component.ts

- **Ruta:** [weekly-transactions-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/weekly-transactions-chart/weekly-transactions-chart.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/components/weekly-transactions-chart/weekly-transactions-chart.component.ts`, 64 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Transacciones por semana" en Gráficas → Indicadores de Transacciones — reutiliza `BankDepositService.getWeeklyStats()`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [transaction-indicators-page.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-transaction-indicators-transaction-indicators-page-component-ts), [transaction-indicators-page.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-transaction-indicators-transaction-indicators-page-component-ts) (plantilla)
- **Plantilla:** [weekly-transactions-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/weekly-transactions-chart/weekly-transactions-chart.component.html) · **Usa componentes:** [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts)
- **Eventos enlazados en la plantilla:** `(retry)="fetch()"`

#### Clase `WeeklyTransactionsChartComponent` (L23–63)

- **Decoradores:** `@Component({ selector: 'app-weekly-transactions-chart', standalone: true, imports: [LineChartComponent], templateUrl: './weekly-transactions-chart.component.html`
- **Propósito:** "Transacciones por semana" en Gráficas → Indicadores de Transacciones — reutiliza `BankDepositService.getWeeklyStats()`. Las semanas son buckets fijos de 7 días desde el día 1 del mes (ver el use case del backend), así que nunca mezclan días de otro mes; el mes actual se calcula siempre server-side, así que esta gráfica se reinicia sola cada mes sin ningún cambio de código.
- **Servicios inyectados con `inject()`:** `bankDepositService = inject(BankDepositService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `weeks = signal<BankDepositWeeklyStat[]>([])`, `points = computed<LineChartPoint[]>(() => this.weeks().map(`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 49–62 | — | `void` |

##### `WeeklyTransactionsChartComponent.fetch`

- **Firma:** `fetch(): void` — [weekly-transactions-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/weekly-transactions-chart/weekly-transactions-chart.component.ts#L49) (L49–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.bankDepositService.getWeeklyStats().subscribe`, `this.bankDepositService.getWeeklyStats`, `this.weeks.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.weeks.set`
- **Consumidores:** `weekly-transactions-chart.component.html` (plantilla)

#### Función `shortDayMonth` (L8–13)

- **Tipo:** función local del archivo
- **Firma:** `shortDayMonth(isoDate: string): string` — [weekly-transactions-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/weekly-transactions-chart/weekly-transactions-chart.component.ts#L8)
- **Propósito / descripción:** "1 sep" style, sin depender de `DatePipe` para un par de números — mismo estilo simple que el resto de este módulo.
- **Dependencias:** `Number`, `isoDate.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-yearly-transactions-chart-yearly-transactions-chart-component-ts"></a>

### yearly-transactions-chart.component.ts

- **Ruta:** [yearly-transactions-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/yearly-transactions-chart/yearly-transactions-chart.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/components/yearly-transactions-chart/yearly-transactions-chart.component.ts`, 57 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Transacciones por mes" en Gráficas → Indicadores de Transacciones — reutiliza `BankDepositService.getYearlyStats()`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [transaction-indicators-page.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-transaction-indicators-transaction-indicators-page-component-ts), [transaction-indicators-page.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-transaction-indicators-transaction-indicators-page-component-ts) (plantilla)
- **Plantilla:** [yearly-transactions-chart.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/yearly-transactions-chart/yearly-transactions-chart.component.html) · **Usa componentes:** [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts)
- **Eventos enlazados en la plantilla:** `(retry)="fetch()"`

#### Clase `YearlyTransactionsChartComponent` (L14–56)

- **Decoradores:** `@Component({ selector: 'app-yearly-transactions-chart', standalone: true, imports: [LineChartComponent], templateUrl: './yearly-transactions-chart.component.html`
- **Propósito:** "Transacciones por mes" en Gráficas → Indicadores de Transacciones — reutiliza `BankDepositService.getYearlyStats()`. A diferencia de las otras dos gráficas de este módulo, ésta NO se reinicia cada mes — enero hasta el mes actual del año en curso, acumulativo, permitiendo comparar meses y ver tendencias dentro del año.
- **Servicios inyectados con `inject()`:** `bankDepositService = inject(BankDepositService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `months = signal<BankDepositMonthlyStat[]>([])`, `year = signal<number \| null>(null)`, `points = computed<LineChartPoint[]>(() => this.months().map`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método public | 41–55 | — | `void` |

##### `YearlyTransactionsChartComponent.fetch`

- **Firma:** `fetch(): void` — [yearly-transactions-chart.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/yearly-transactions-chart/yearly-transactions-chart.component.ts#L41) (L41–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.bankDepositService.getYearlyStats().subscribe`, `this.bankDepositService.getYearlyStats`, `this.months.set`, `this.year.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.months.set`, `this.year.set`
- **Consumidores:** `yearly-transactions-chart.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-purchases-indicators-purchases-indicators-page-component-ts"></a>

### purchases-indicators-page.component.ts

- **Ruta:** [purchases-indicators-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/purchases-indicators/purchases-indicators-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/purchases-indicators/purchases-indicators-page.component.ts`, 26 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Gráficas → Indicadores de Compras" — puramente visual, mismo esqueleto que "Indicadores de Transacciones"/"Indicadores de Ventas".
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [purchases-daily-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-daily-chart-purchases-daily-chart-component-ts), [purchases-weekly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-weekly-chart-purchases-weekly-chart-component-ts), [purchases-yearly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-yearly-chart-purchases-yearly-chart-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [purchases-indicators-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/purchases-indicators/purchases-indicators-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [purchases-daily-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-daily-chart-purchases-daily-chart-component-ts), [purchases-weekly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-weekly-chart-purchases-weekly-chart-component-ts), [purchases-yearly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-yearly-chart-purchases-yearly-chart-component-ts)

#### Clase `PurchasesIndicatorsPageComponent` (L12–25)

- **Decoradores:** `@Component({ selector: 'app-purchases-indicators-page', standalone: true, imports: [ PageHeaderComponent, PurchasesDailyChartComponent, PurchasesWeeklyChartCompo`
- **Propósito:** "Gráficas → Indicadores de Compras" — puramente visual, mismo esqueleto que "Indicadores de Transacciones"/"Indicadores de Ventas".
<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-recharges-indicators-recharges-indicators-page-component-ts"></a>

### recharges-indicators-page.component.ts

- **Ruta:** [recharges-indicators-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/recharges-indicators/recharges-indicators-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/recharges-indicators/recharges-indicators-page.component.ts`, 27 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Gráficas → Indicadores de Recargas" — puramente visual, mismo esqueleto que "Indicadores de Transacciones"/"Indicadores de Ventas"/"Indicadores de Compras".
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [recharges-daily-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-daily-chart-recharges-daily-chart-component-ts), [recharges-weekly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-weekly-chart-recharges-weekly-chart-component-ts), [recharges-yearly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-yearly-chart-recharges-yearly-chart-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [recharges-indicators-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/recharges-indicators/recharges-indicators-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [recharges-daily-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-daily-chart-recharges-daily-chart-component-ts), [recharges-weekly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-weekly-chart-recharges-weekly-chart-component-ts), [recharges-yearly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-yearly-chart-recharges-yearly-chart-component-ts)

#### Clase `RechargesIndicatorsPageComponent` (L13–26)

- **Decoradores:** `@Component({ selector: 'app-recharges-indicators-page', standalone: true, imports: [ PageHeaderComponent, RechargesDailyChartComponent, RechargesWeeklyChartCompo`
- **Propósito:** "Gráficas → Indicadores de Recargas" — puramente visual, mismo esqueleto que "Indicadores de Transacciones"/"Indicadores de Ventas"/"Indicadores de Compras".
<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-sales-indicators-sales-indicators-page-component-ts"></a>

### sales-indicators-page.component.ts

- **Ruta:** [sales-indicators-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/sales-indicators/sales-indicators-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/sales-indicators/sales-indicators-page.component.ts`, 22 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Gráficas → Indicadores de Ventas" — puramente visual, mismo esqueleto que "Indicadores de Transacciones".
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [sales-daily-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-daily-chart-sales-daily-chart-component-ts), [sales-weekly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-weekly-chart-sales-weekly-chart-component-ts), [sales-yearly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-yearly-chart-sales-yearly-chart-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [sales-indicators-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/sales-indicators/sales-indicators-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [sales-daily-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-daily-chart-sales-daily-chart-component-ts), [sales-weekly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-weekly-chart-sales-weekly-chart-component-ts), [sales-yearly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-yearly-chart-sales-yearly-chart-component-ts)

#### Clase `SalesIndicatorsPageComponent` (L13–21)

- **Decoradores:** `@Component({ selector: 'app-sales-indicators-page', standalone: true, imports: [PageHeaderComponent, SalesDailyChartComponent, SalesWeeklyChartComponent, SalesYe`
- **Propósito:** "Gráficas → Indicadores de Ventas" — puramente visual, mismo esqueleto que "Indicadores de Transacciones". Las 3 gráficas son autocontenidas (cada una hace su propio fetch), esta página solo las apila.
<a id="f-comercial-jhoel-app-src-app-features-dashboard-graphs-transaction-indicators-transaction-indicators-page-component-ts"></a>

### transaction-indicators-page.component.ts

- **Ruta:** [transaction-indicators-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/transaction-indicators/transaction-indicators-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/graphs/transaction-indicators/transaction-indicators-page.component.ts`, 29 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-graphs`
- **Responsabilidad:** "Gráficas → Indicadores de Transacciones" — puramente visual, sin filtros/tabla/exportación (eso ya existe en Reportería de Transacciones).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [daily-transactions-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-daily-transactions-chart-daily-transactions-chart-component-ts), [weekly-transactions-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-weekly-transactions-chart-weekly-transactions-chart-component-ts), [yearly-transactions-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-yearly-transactions-chart-yearly-transactions-chart-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [transaction-indicators-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/transaction-indicators/transaction-indicators-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [daily-transactions-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-daily-transactions-chart-daily-transactions-chart-component-ts), [weekly-transactions-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-weekly-transactions-chart-weekly-transactions-chart-component-ts), [yearly-transactions-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-yearly-transactions-chart-yearly-transactions-chart-component-ts)

#### Clase `TransactionIndicatorsPageComponent` (L15–28)

- **Decoradores:** `@Component({ selector: 'app-transaction-indicators-page', standalone: true, imports: [ PageHeaderComponent, DailyTransactionsChartComponent, WeeklyTransactionsCh`
- **Propósito:** "Gráficas → Indicadores de Transacciones" — puramente visual, sin filtros/tabla/exportación (eso ya existe en Reportería de Transacciones). Las 3 gráficas son autocontenidas (cada una hace su propio fetch, mismo patrón que `TransactionMonthlyChartComponent`), así que esta página solo las apila dentro de un `app-page-header`.
