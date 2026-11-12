# Módulo backend `dashboard`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/dashboard/summary` | [dashboard.controller.ts](../../../../comercial-jhoel-api/src/modules/dashboard/presentation/controllers/dashboard.controller.ts#L28) `DashboardController.getSummary` | [GetDashboardSummaryUseCase](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-ts) | `DashboardRepository`.getSummary | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `DashboardMetricsService.getSummary` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [dashboard-summary-output.spec.ts](#f-comercial-jhoel-api-src-modules-dashboard-application-dtos-dashboard-summary-output-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria (sin comentario de documentación en el código). | 1 internas | 0 | Soporte (pruebas) |
| [dashboard-summary-output.ts](#f-comercial-jhoel-api-src-modules-dashboard-application-dtos-dashboard-summary-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Empates — fecha: el día más reciente gana, tanto para el máximo como para el mínimo (regla explícita del ticket). | 1 internas | 2 | Baja (2 consumidores) |
| [get-dashboard-summary.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria (sin comentario de documentación en el código). | 2 internas | 0 | Soporte (pruebas) |
| [get-dashboard-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-ts) | .ts | Caso de uso | Aplicación | "Indicadores del mes" — the entire period is derived fresh on every call from the server's own current date, never a stored value: `dayStart` is always "the 1st of whatever month it is right now, 00:00:00 local", and `dayEnd`/`isoEndDate` are always "right now". | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [dashboard.module.ts](#f-comercial-jhoel-api-src-modules-dashboard-dashboard-module-ts) | .ts | Módulo | Arranque / configuración | Pure read-side, cross-cutting module — mirrors `ReportsModule`'s own "register the existing ORM entities a second time via `forFeature`, import nothing else" shape (see that module's doc comment). | 8 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |
| [dashboard.repository.ts](#f-comercial-jhoel-api-src-modules-dashboard-domain-repositories-dashboard-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `DailyAmountRow`, `BankTransactionRow`, `DashboardPeriodRange`, `DashboardRawSummary`, `DashboardRepository` (sin comentario de documentación en el código). | 0 internas | 5 | Media (5 consumidores) |
| [typeorm-dashboard.repository.ts](#f-comercial-jhoel-api-src-modules-dashboard-infrastructure-persistence-typeorm-dashboard-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Pure read-side, cross-cutting — same architectural precedent as `ReportsModule` (see its own doc comment): never writes to `sales`/`purchases`/`recharge_daily_balances`/`bank_deposit_operations`, only queries them, via its own `TypeOrmModule.forFeature(...)` registration of their existing ORM entiti | 5 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [dashboard.controller.ts](#f-comercial-jhoel-api-src-modules-dashboard-presentation-controllers-dashboard-controller-ts) | .ts | Controlador | Presentación | Backs the Resumen dashboard's financial indicator cards (Ventas de Recargas / Ventas / Compras / Transacciones Bancarias). | 5 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [dashboard-summary.response.dto.ts](#f-comercial-jhoel-api-src-modules-dashboard-presentation-dtos-dashboard-summary-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `DashboardPeriodResponseDto`, `DashboardDayResponseDto`, `DashboardDailySeriesResponseDto`, `DashboardBankResponseDto`, `DashboardBankTransactionsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-dashboard-application-dtos-dashboard-summary-output-spec-ts"></a>

### dashboard-summary-output.spec.ts

- **Ruta:** [dashboard-summary-output.spec.ts](../../../../comercial-jhoel-api/src/modules/dashboard/application/dtos/dashboard-summary-output.spec.ts) (`comercial-jhoel-api/src/modules/dashboard/application/dtos/dashboard-summary-output.spec.ts`, 151 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `dashboard`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [dashboard-summary-output.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-dtos-dashboard-summary-output-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-dashboard-application-dtos-dashboard-summary-output-ts"></a>

### dashboard-summary-output.ts

- **Ruta:** [dashboard-summary-output.ts](../../../../comercial-jhoel-api/src/modules/dashboard/application/dtos/dashboard-summary-output.ts) (`comercial-jhoel-api/src/modules/dashboard/application/dtos/dashboard-summary-output.ts`, 131 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `dashboard`
- **Responsabilidad:** Empates — fecha: el día más reciente gana, tanto para el máximo como para el mínimo (regla explícita del ticket).
- **Depende de (archivos del proyecto):** [dashboard.repository.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-domain-repositories-dashboard-repository-ts)
- **Consumidores:** [dashboard-summary-output.spec.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-dtos-dashboard-summary-output-spec-ts), [get-dashboard-summary.use-case.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-ts)

**Interfaces, tipos y enums:**

- `interface DashboardPeriodOutput` (L6): sin documentación — miembros: `year`, `month`, `startDate`, `endDate`
- `interface DashboardDayOutput` (L13): sin documentación — miembros: `date`, `amount`
- `interface DashboardDailySeriesOutput` (L18): sin documentación — miembros: `highestDay`, `lowestDay`, `total`
- `interface DashboardBankOutput` (L24): sin documentación — miembros: `bankId`, `bankName`, `transactions`
- `interface DashboardBankTransactionsOutput` (L30): sin documentación — miembros: `totalTransactions`, `highestBank`, `lowestBank`
- `interface DashboardSummaryOutput` (L36): sin documentación — miembros: `period`, `rechargeSales`, `sales`, `purchases`, `bankTransactions`
#### Función `summarizeDailySeries` (L50–79)

- **Tipo:** función exportada
- **Firma:** `summarizeDailySeries(rows: DailyAmountRow[]): DashboardDailySeriesOutput` — [dashboard-summary-output.ts](../../../../comercial-jhoel-api/src/modules/dashboard/application/dtos/dashboard-summary-output.ts#L50)
- **Propósito / descripción:** Empates — fecha: el día más reciente gana, tanto para el máximo como para el mínimo (regla explícita del ticket). Se resuelve ordenando por (amount, date) y tomando el primer/último elemento — nunca el primer `Array.prototype.find` con un empate ambiguo.
- **Dependencias:** `[...rows].sort`, `sorted.reduce`, `round2`, `rows.reduce`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-dashboard-summary.use-case.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-ts)

#### Función `summarizeBankTransactions` (L87–125)

- **Tipo:** función exportada
- **Firma:** `summarizeBankTransactions(rows: BankTransactionRow[]): DashboardBankTransactionsOutput` — [dashboard-summary-output.ts](../../../../comercial-jhoel-api/src/modules/dashboard/application/dtos/dashboard-summary-output.ts#L87)
- **Propósito / descripción:** Empates — banco: el nombre alfabéticamente primero gana (A→Z), tanto para el máximo como para el mínimo — la misma regla determinista aplicada de forma consistente en ambos sentidos, ya que un banco no tiene un equivalente natural a "el más reciente" (a diferencia de un día).
- **Dependencias:** `rows.reduce`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-dashboard-summary.use-case.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-ts)

#### Función `round2` (L128–130)

- **Tipo:** función local del archivo
- **Firma:** `round2(value: number): number` — [dashboard-summary-output.ts](../../../../comercial-jhoel-api/src/modules/dashboard/application/dtos/dashboard-summary-output.ts#L128)
- **Propósito / descripción:** Avoids a float artifact (e.g. `6500.000000000001`) when summing `numeric` values that already round-tripped through JS floats via `parseFloat`.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-spec-ts"></a>

### get-dashboard-summary.use-case.spec.ts

- **Ruta:** [get-dashboard-summary.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/dashboard/application/use-cases/get-dashboard-summary.use-case.spec.ts) (`comercial-jhoel-api/src/modules/dashboard/application/use-cases/get-dashboard-summary.use-case.spec.ts`, 152 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `dashboard`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [get-dashboard-summary.use-case.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-ts), [dashboard.repository.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-domain-repositories-dashboard-repository-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-ts"></a>

### get-dashboard-summary.use-case.ts

- **Ruta:** [get-dashboard-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/dashboard/application/use-cases/get-dashboard-summary.use-case.ts) (`comercial-jhoel-api/src/modules/dashboard/application/use-cases/get-dashboard-summary.use-case.ts`, 88 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `dashboard`
- **Responsabilidad:** "Indicadores del mes" — the entire period is derived fresh on every call from the server's own current date, never a stored value: `dayStart` is always "the 1st of whatever month it is right now, 00:00:00 local", and `dayEnd`/`isoEndDate` are always "right now".
- **Depende de (archivos del proyecto):** [dashboard.repository.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-domain-repositories-dashboard-repository-ts), [dashboard-summary-output.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-dtos-dashboard-summary-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [get-dashboard-summary.use-case.spec.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-spec-ts), [dashboard.module.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-dashboard-module-ts), [dashboard.controller.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-presentation-controllers-dashboard-controller-ts)

#### Clase `GetDashboardSummaryUseCase` (L33–87)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Indicadores del mes" — the entire period is derived fresh on every call from the server's own current date, never a stored value: `dayStart` is always "the 1st of whatever month it is right now, 00:00:00 local", and `dayEnd`/`isoEndDate` are always "right now". There is no month-rollover job, counter, or reset to maintain — the moment the calendar turns over to a new month, the very next call to this use case computes a completely different `dayStart`, and every downstream query is scoped to that new range automatically. Same reasoning already established for `GetBankDepositMonthlyCountUseCase`'s own "Bancos" Resumen tile, applied here to the fuller Ventas/Compras/Recargas/Transacciones set.
- **Dependencias inyectadas (constructor):** `@Inject(DASHBOARD_REPOSITORY) dashboardRepository: DashboardRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 40–58 | — | `Promise<DashboardSummaryOutput>` |
| `buildPeriod` | método private | 60–86 | `now: Date` | `DashboardPeriodRange` |

##### `GetDashboardSummaryUseCase.execute`

- **Firma:** `execute(): Promise<DashboardSummaryOutput>` — [get-dashboard-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/dashboard/application/use-cases/get-dashboard-summary.use-case.ts#L40) (L40–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `this.buildPeriod`, `this.dashboardRepository.getSummary`, `now.getFullYear`, `now.getMonth`, `summarizeDailySeries`, `summarizeBankTransactions`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [dashboard.controller.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-presentation-controllers-dashboard-controller-ts)

##### `GetDashboardSummaryUseCase.buildPeriod`

- **Firma:** `buildPeriod(now: Date): DashboardPeriodRange` — [get-dashboard-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/dashboard/application/use-cases/get-dashboard-summary.use-case.ts#L60) (L60–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `now.getMonth`, `now.getDate`, `toIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `toIsoDate` (L14–19)

- **Tipo:** función local del archivo
- **Firma:** `toIsoDate(date: Date): string` — [get-dashboard-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/dashboard/application/use-cases/get-dashboard-summary.use-case.ts#L14)
- **Propósito / descripción:** Local-time `yyyy-MM-dd` — same technique every date-driven use case in this codebase already uses (e.g. `todayIsoDate()` in bank-deposits/recharges). Never UTC: the API process runs with `TZ=America/Guatemala` (see `docker-compose.yml`/migration `1759100000000-SetDatabaseTimezone`), so `Date`'s own local getters already reflect the correct Guatemala calendar day.
- **Dependencias:** `date.getFullYear`, `String(date.getMonth() + 1).padStart`, `String`, `date.getMonth`, `String(date.getDate()).padStart`, `date.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-dashboard-dashboard-module-ts"></a>

### dashboard.module.ts

- **Ruta:** [dashboard.module.ts](../../../../comercial-jhoel-api/src/modules/dashboard/dashboard.module.ts) (`comercial-jhoel-api/src/modules/dashboard/dashboard.module.ts`, 40 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `dashboard`
- **Responsabilidad:** Pure read-side, cross-cutting module — mirrors `ReportsModule`'s own "register the existing ORM entities a second time via `forFeature`, import nothing else" shape (see that module's doc comment).
- **Depende de (archivos del proyecto):** [sale.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts), [purchase.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-orm-entity-ts), [recharge-daily-balance.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-orm-entity-ts), [bank-deposit-operation.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts), [dashboard.repository.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-domain-repositories-dashboard-repository-ts), [typeorm-dashboard.repository.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-infrastructure-persistence-typeorm-dashboard-repository-ts), [get-dashboard-summary.use-case.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-ts), [dashboard.controller.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-presentation-controllers-dashboard-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `DashboardModule` (L24–39)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([ SaleOrmEntity, PurchaseOrmEntity, RechargeDailyBalanceOrmEntity, BankDepositOperationOrmEntity, ]), ], controller`
- **Propósito:** Pure read-side, cross-cutting module — mirrors `ReportsModule`'s own "register the existing ORM entities a second time via `forFeature`, import nothing else" shape (see that module's doc comment). No new tables, no new migration, no changes to `sales`/`purchases`/ `recharges`/`bank-deposits`' own write paths — this module only ever runs `SELECT`/`SUM`/`GROUP BY` against tables those modules already own. Deliberately does NOT import `BanksModule` — Transaccionar's own `bank_deposit_operations` table is independent of Cuadre de Agentes' `bank_balances`/`agent_reconciliations`, and this dashboard's "Transacciones Bancarias" section is explicitly about the former only.
<a id="f-comercial-jhoel-api-src-modules-dashboard-domain-repositories-dashboard-repository-ts"></a>

### dashboard.repository.ts

- **Ruta:** [dashboard.repository.ts](../../../../comercial-jhoel-api/src/modules/dashboard/domain/repositories/dashboard.repository.ts) (`comercial-jhoel-api/src/modules/dashboard/domain/repositories/dashboard.repository.ts`, 48 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `dashboard`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `DailyAmountRow`, `BankTransactionRow`, `DashboardPeriodRange`, `DashboardRawSummary`, `DashboardRepository` (sin comentario de documentación en el código).
- **Consumidores:** [dashboard-summary-output.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-dtos-dashboard-summary-output-ts), [get-dashboard-summary.use-case.spec.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-spec-ts), [get-dashboard-summary.use-case.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-ts), [dashboard.module.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-dashboard-module-ts), [typeorm-dashboard.repository.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-infrastructure-persistence-typeorm-dashboard-repository-ts)

**Interfaces, tipos y enums:**

- `interface DailyAmountRow` (L3): sin documentación — miembros: `date`, `amount`
- `interface BankTransactionRow` (L8): sin documentación — miembros: `bankId`, `bankName`, `transactions`
- `interface DashboardPeriodRange` (L14): sin documentación — miembros: `isoStartDate`, `isoEndDate`, `dayStart`, `dayEnd`
- `interface DashboardRawSummary` (L25): sin documentación — miembros: `rechargeSalesByDay`, `salesByDay`, `purchasesTotal`, `bankTransactionsByBank`
- `interface DashboardRepository` (L35): sin documentación — miembros: `getSummary`

**Constantes exportadas:**

- `DASHBOARD_REPOSITORY` (L1) = `Symbol('DASHBOARD_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-dashboard-infrastructure-persistence-typeorm-dashboard-repository-ts"></a>

### typeorm-dashboard.repository.ts

- **Ruta:** [typeorm-dashboard.repository.ts](../../../../comercial-jhoel-api/src/modules/dashboard/infrastructure/persistence/typeorm-dashboard.repository.ts) (`comercial-jhoel-api/src/modules/dashboard/infrastructure/persistence/typeorm-dashboard.repository.ts`, 189 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `dashboard`
- **Responsabilidad:** Pure read-side, cross-cutting — same architectural precedent as `ReportsModule` (see its own doc comment): never writes to `sales`/`purchases`/`recharge_daily_balances`/`bank_deposit_operations`, only queries them, via its own `TypeOrmModule.forFeature(...)` registration of their existing ORM entiti
- **Depende de (archivos del proyecto):** [sale.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts), [purchase.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-orm-entity-ts), [recharge-daily-balance.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-orm-entity-ts), [bank-deposit-operation.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts), [dashboard.repository.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-domain-repositories-dashboard-repository-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [dashboard.module.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-dashboard-module-ts)

#### Clase `TypeOrmDashboardRepository` (L26–188)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements DashboardRepository
- **Propósito:** Pure read-side, cross-cutting — same architectural precedent as `ReportsModule` (see its own doc comment): never writes to `sales`/`purchases`/`recharge_daily_balances`/`bank_deposit_operations`, only queries them, via its own `TypeOrmModule.forFeature(...)` registration of their existing ORM entities rather than importing `SalesModule`/`PurchasesModule`/`RechargesModule`/`BankDepositsModule` wholesale — no new tables, no changes to any of those modules' own write paths.
- **Dependencias inyectadas (constructor):** `@InjectRepository(SaleOrmEntity) saleRepository: Repository<SaleOrmEntity>`, `@InjectRepository(PurchaseOrmEntity) purchaseRepository: Repository<PurchaseOrmEntity>`, `@InjectRepository(RechargeDailyBalanceOrmEntity) rechargeDailyBalanceRepository: Repository<RechargeDailyBalanceOrmEntity>`, `@InjectRepository(BankDepositOperationOrmEntity) bankDepositOperationRepository: Repository<BankDepositOperationOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getSummary` | método public async | 39–58 | `period: DashboardPeriodRange` | `Promise<DashboardRawSummary>` |
| `getRechargeSalesByDay` | método private async | 72–101 | `period: DashboardPeriodRange` | `Promise<DailyAmountRow[]>` |
| `getSalesByDay` | método private async | 114–132 | `period: DashboardPeriodRange` | `Promise<DailyAmountRow[]>` |
| `getPurchasesTotal` | método private async | 134–147 | `period: DashboardPeriodRange` | `Promise<number>` |
| `getBankTransactionsByBank` | método private async | 157–187 | `period: DashboardPeriodRange` | `Promise<BankTransactionRow[]>` |

##### `TypeOrmDashboardRepository.getSummary`

- **Firma:** `getSummary(period: DashboardPeriodRange): Promise<DashboardRawSummary>` — [typeorm-dashboard.repository.ts](../../../../comercial-jhoel-api/src/modules/dashboard/infrastructure/persistence/typeorm-dashboard.repository.ts#L39) (L39–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.getRechargeSalesByDay`, `this.getSalesByDay`, `this.getPurchasesTotal`, `this.getBankTransactionsByBank`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmDashboardRepository.getRechargeSalesByDay`

- **Firma:** `getRechargeSalesByDay(period: DashboardPeriodRange): Promise<DailyAmountRow[]>` — [typeorm-dashboard.repository.ts](../../../../comercial-jhoel-api/src/modules/dashboard/infrastructure/persistence/typeorm-dashboard.repository.ts#L72) (L72–101)
- **Propósito / descripción:** "Venta" for one (tipo, fecha, ciclo) is `daily_balance - final_balance`, only once `final_balance` is actually set — an unclosed cycle has no defined sale yet, same reasoning `GetRechargeSalesSummaryUseCase` already uses for its own live "today" figure (never the frozen `recharge_sales_closures.total_sales`, which would go stale the moment a `finalBalance` is corrected after the fact). Summed across every recharge type AND every cuadre cycle for that date — a date closed twice in one day (see "Cuadre cycles" in the backend's own module history) correctly contributes both cycles' sale to that one day's total, not just the latest.
- **Dependencias (llamadas en su cuerpo):** `this.rechargeDailyBalanceRepository.createQueryBuilder('balance').select`, `this.rechargeDailyBalanceRepository.createQueryBuilder`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmDashboardRepository.getSalesByDay`

- **Firma:** `getSalesByDay(period: DashboardPeriodRange): Promise<DailyAmountRow[]>` — [typeorm-dashboard.repository.ts](../../../../comercial-jhoel-api/src/modules/dashboard/infrastructure/persistence/typeorm-dashboard.repository.ts#L114) (L114–132)
- **Propósito / descripción:** Only `CONFIRMED` sales — an `OPEN` draft receipt is never a completed sale, same hardcoded filter `TypeOrmSaleRepository.findAll` already applies to its own history listing. Grouped via `to_char(...)` rather than `DATE(...)`: a raw, unmapped query-builder expression has no TypeORM column metadata to hint the driver's type parser, and `to_char` guarantees a plain string back regardless — the DB session's own `America/Guatemala` timezone (see migration `1759100000000-SetDatabaseTimezone`) is what makes the formatted date land on the correct Guatemala calendar day for a `timestamptz` value.
- **Dependencias (llamadas en su cuerpo):** `this.saleRepository.createQueryBuilder('sale').select(dateExpr, 'date').addSelect`, `this.saleRepository.createQueryBuilder('sale').select`, `this.saleRepository.createQueryBuilder`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmDashboardRepository.getPurchasesTotal`

- **Firma:** `getPurchasesTotal(period: DashboardPeriodRange): Promise<number>` — [typeorm-dashboard.repository.ts](../../../../comercial-jhoel-api/src/modules/dashboard/infrastructure/persistence/typeorm-dashboard.repository.ts#L134) (L134–147)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.purchaseRepository.createQueryBuilder('purchase').select`, `this.purchaseRepository.createQueryBuilder`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmDashboardRepository.getBankTransactionsByBank`

- **Firma:** `getBankTransactionsByBank(period: DashboardPeriodRange): Promise<BankTransactionRow[]>` — [typeorm-dashboard.repository.ts](../../../../comercial-jhoel-api/src/modules/dashboard/infrastructure/persistence/typeorm-dashboard.repository.ts#L157) (L157–187)
- **Propósito / descripción:** Excludes anuladas (`isVoided = false`) — the same reasoning `TypeOrmBankDepositRepository.getReportSummary()` already documents: a dashboard total is about real, standing operations, not everything ever registered. `operationDate` is a plain `date` column, so the lexicographic `yyyy-MM-dd` comparison is already correct, no `to_char`/`DATE()` needed here.
- **Dependencias (llamadas en su cuerpo):** `this.bankDepositOperationRepository.createQueryBuilder('operation').leftJoin`, `this.bankDepositOperationRepository.createQueryBuilder`, `rows.map`, `parseInt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-dashboard-presentation-controllers-dashboard-controller-ts"></a>

### dashboard.controller.ts

- **Ruta:** [dashboard.controller.ts](../../../../comercial-jhoel-api/src/modules/dashboard/presentation/controllers/dashboard.controller.ts) (`comercial-jhoel-api/src/modules/dashboard/presentation/controllers/dashboard.controller.ts`, 33 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `dashboard`
- **Responsabilidad:** Backs the Resumen dashboard's financial indicator cards (Ventas de Recargas / Ventas / Compras / Transacciones Bancarias).
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [get-dashboard-summary.use-case.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-application-use-cases-get-dashboard-summary-use-case-ts), [dashboard-summary.response.dto.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-presentation-dtos-dashboard-summary-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [dashboard.module.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-dashboard-module-ts)

#### Clase `DashboardController` (L20–32)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('dashboard')`
- **Propósito:** Backs the Resumen dashboard's financial indicator cards (Ventas de Recargas / Ventas / Compras / Transacciones Bancarias). Admin-only (`@Roles`) — unlike `GET /bank-deposits/monthly-count` (a single, non-sensitive count open to any authenticated account), this endpoint exposes real sales/purchase/recharge amounts, the same class of data that's `@Roles('ADMIN', 'SUPER_ADMIN')`-gated everywhere else in this codebase (Reportería). A `USER`-role account still sees the rest of Resumen unchanged; the frontend simply never requests this endpoint for that role (see the app's own `CLAUDE.md`) — this route is the real enforcement regardless of what the frontend does.
- **Dependencias inyectadas (constructor):** `getDashboardSummaryUseCase: GetDashboardSummaryUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getSummary` | método public | 28–31 | — | `Promise<DashboardSummaryResponseDto>` |

##### `DashboardController.getSummary`

- **Firma:** `getSummary(): Promise<DashboardSummaryResponseDto>` — [dashboard.controller.ts](../../../../comercial-jhoel-api/src/modules/dashboard/presentation/controllers/dashboard.controller.ts#L28) (L28–31)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getDashboardSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-dashboard-presentation-dtos-dashboard-summary-response-dto-ts"></a>

### dashboard-summary.response.dto.ts

- **Ruta:** [dashboard-summary.response.dto.ts](../../../../comercial-jhoel-api/src/modules/dashboard/presentation/dtos/dashboard-summary.response.dto.ts) (`comercial-jhoel-api/src/modules/dashboard/presentation/dtos/dashboard-summary.response.dto.ts`, 38 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `dashboard`
- **Responsabilidad:** DTO de respuesta: declara `DashboardPeriodResponseDto`, `DashboardDayResponseDto`, `DashboardDailySeriesResponseDto`, `DashboardBankResponseDto`, `DashboardBankTransactionsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [dashboard.controller.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-presentation-controllers-dashboard-controller-ts)

#### Clase `DashboardPeriodResponseDto` (L1–6)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `DashboardDayResponseDto` (L8–11)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `DashboardDailySeriesResponseDto` (L13–17)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `DashboardBankResponseDto` (L19–23)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `DashboardBankTransactionsResponseDto` (L25–29)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `DashboardSummaryResponseDto` (L31–37)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
