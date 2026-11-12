# Módulo backend `alerts`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/alerts` | [alerts.controller.ts](../../../../comercial-jhoel-api/src/modules/alerts/presentation/controllers/alerts.controller.ts#L35) `AlertsController.findAll` | [GetAlertsUseCase](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts) | `PurchaseRepository`.findPendingCreditPurchases<br>`InventoryStockRepository`.findLowStock<br>`RechargeTypeRepository`.findAll<br>`RechargeDailyBalanceRepository`.findLatestPerType [recharge_daily_balances]<br>`AlertSettingsRepository`.get<br>`AlertReadMarkRepository`.findReadKeys<br>`CatalogRequestRepository`.countByStatus<br>`GetCashBoxBalanceUseCase`.execute | UseGuards(JwtAuthGuard) | `AlertsService.getAlerts` |
| `POST /api/alerts/:key/read` | [alerts.controller.ts](../../../../comercial-jhoel-api/src/modules/alerts/presentation/controllers/alerts.controller.ts#L43) `AlertsController.markRead` | [MarkAlertReadUseCase](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-alert-read-use-case-ts) | `AlertReadMarkRepository`.markRead | UseGuards(JwtAuthGuard) | `AlertsService.markAsRead` |
| `POST /api/alerts/read-all` | [alerts.controller.ts](../../../../comercial-jhoel-api/src/modules/alerts/presentation/controllers/alerts.controller.ts#L52) `AlertsController.markAllRead` | [MarkAllAlertsReadUseCase](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-ts) | `AlertReadMarkRepository`.markAllRead<br>`GetAlertsUseCase`.execute | UseGuards(JwtAuthGuard) | `AlertsService.markAllAsRead` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [alerts.module.ts](#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts) | .ts | Módulo | Arranque / configuración | Reads across five unrelated modules' own domain tokens/use cases (purchases, inventory, recharges, recharge-cash-box, alert-settings) — imports each module for its exported repository token (or, for `RechargeCashBoxModule`, its exported `GetCashBoxBalanceUseCase`) rather than duplicating a `TypeOrmM | 13 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |
| [alerts-output.spec.ts](#f-comercial-jhoel-api-src-modules-alerts-application-dtos-alerts-output-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makeAlert` (sin comentario de documentación en el código). | 2 internas | 0 | Soporte (pruebas) |
| [alerts-output.ts](#f-comercial-jhoel-api-src-modules-alerts-application-dtos-alerts-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `sortAlerts`, `toAlertOutput`, `AlertOutput`, `AlertsOutput`, `PRIORITY_RANK` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [get-alerts.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makePurchase` (sin comentario de documentación en el código). | 11 internas | 0 | Soporte (pruebas) |
| [get-alerts.use-case.ts](#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts) | .ts | Caso de uso | Aplicación | Composes all 3 alert categories fresh on every call — never persisted, never historical (see `Alert`'s own doc comment). | 12 internas; ext.: @nestjs/common | 5 | Media (5 consumidores) |
| [mark-alert-read.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-alert-read-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria (sin comentario de documentación en el código). | 2 internas | 0 | Soporte (pruebas) |
| [mark-alert-read.use-case.ts](#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-alert-read-use-case-ts) | .ts | Caso de uso | Aplicación | A no-op if the alert no longer exists or was already read — read-marks are intentionally decoupled from whether the alert is currently active (see `AlertReadMarkOrmEntity`'s `CASCADE` FK doc comment): opening an alert and then having its condition resolve before the mark is written is harmless, the row just becomes an inert leftover no future `findReadKeys` call will ever match against. | 1 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [mark-all-alerts-read.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria (sin comentario de documentación en el código). | 3 internas | 0 | Soporte (pruebas) |
| [mark-all-alerts-read.use-case.ts](#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-ts) | .ts | Caso de uso | Aplicación | Marks every alert CURRENTLY active for this caller as read — depends on `GetAlertsUseCase` to compute exactly that same set (same ownership scoping) rather than re-deriving it, so "read-all" can never drift from what the panel just showed the user. | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [build-alerts.spec.ts](#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makePurchase`, `makeLowStockRow`, `makeRechargeType`, `makeBalance` (sin comentario de documentación en el código). | 5 internas | 0 | Soporte (pruebas) |
| [build-alerts.ts](#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-ts) | .ts | Utilidad | Aplicación | `PURCHASE_PAYMENT_DUE` (próximo/vence hoy) or `PURCHASE_PAYMENT_OVERDUE` (vencido) — `null` when the due date is still further out than `alertDays`, i.e. | 6 internas | 2 | Baja (2 consumidores) |
| [today-iso-date.ts](#f-comercial-jhoel-api-src-modules-alerts-application-utils-today-iso-date-ts) | .ts | Utilidad | Aplicación | Local-time `yyyy-MM-dd` — same technique every date-driven use case in this codebase already uses. | 0 internas | 2 | Baja (2 consumidores) |
| [alert.entity.ts](#f-comercial-jhoel-api-src-modules-alerts-domain-entities-alert-entity-ts) | .ts | Entidad de dominio | Dominio | Extensible on purpose — a future alert (cuenta por cobrar vencida, banco, stock agotado de SIMs, cierre de día, ...) is a new string here, never a structural change to `Alert`/`GetAlertsUseCase` below. | 0 internas | 5 | Media (5 consumidores) |
| [alert-read-mark.repository.ts](#f-comercial-jhoel-api-src-modules-alerts-domain-repositories-alert-read-mark-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `AlertReadMarkRepository`, `ALERT_READ_MARK_REPOSITORY` (sin comentario de documentación en el código). | 0 internas | 8 | Media (8 consumidores) |
| [alert-read-mark.orm-entity.ts](#f-comercial-jhoel-api-src-modules-alerts-infrastructure-persistence-alert-read-mark-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `AlertReadMarkOrmEntity` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [typeorm-alert-read-mark.repository.ts](#f-comercial-jhoel-api-src-modules-alerts-infrastructure-persistence-typeorm-alert-read-mark-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmAlertReadMarkRepository` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [alerts.controller.ts](#f-comercial-jhoel-api-src-modules-alerts-presentation-controllers-alerts-controller-ts) | .ts | Controlador | Presentación | No `@Roles(...)` — every authenticated, active account sees the Navbar bell (inventory/recharge alerts are shared operational state; purchase alerts are ownership-scoped inside `GetAlertsUseCase` itself for a non-admin, same split `PurchasesController` already uses). | 6 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [alerts.response.dto.ts](#f-comercial-jhoel-api-src-modules-alerts-presentation-dtos-alerts-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `AlertResponseDto`, `AlertsResponseDto` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts"></a>

### alerts.module.ts

- **Ruta:** [alerts.module.ts](../../../../comercial-jhoel-api/src/modules/alerts/alerts.module.ts) (`comercial-jhoel-api/src/modules/alerts/alerts.module.ts`, 51 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** Reads across five unrelated modules' own domain tokens/use cases (purchases, inventory, recharges, recharge-cash-box, alert-settings) — imports each module for its exported repository token (or, for `RechargeCashBoxModule`, its exported `GetCashBoxBalanceUseCase`) rather than duplicating a `TypeOrmM
- **Depende de (archivos del proyecto):** [alert-read-mark.orm-entity.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-infrastructure-persistence-alert-read-mark-orm-entity-ts), [typeorm-alert-read-mark.repository.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-infrastructure-persistence-typeorm-alert-read-mark-repository-ts), [alert-read-mark.repository.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-domain-repositories-alert-read-mark-repository-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [mark-alert-read.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-alert-read-use-case-ts), [mark-all-alerts-read.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-ts), [alerts.controller.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-presentation-controllers-alerts-controller-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts), [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts), [alert-settings.module.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-alert-settings-module-ts), [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `AlertsModule` (L29–50)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([AlertReadMarkOrmEntity]), PurchasesModule, InventoryModule, RechargesModule, RechargeCashBoxModule, AlertSettingsM`
- **Propósito:** Reads across five unrelated modules' own domain tokens/use cases (purchases, inventory, recharges, recharge-cash-box, alert-settings) — imports each module for its exported repository token (or, for `RechargeCashBoxModule`, its exported `GetCashBoxBalanceUseCase`) rather than duplicating a `TypeOrmModule.forFeature` the way `ReportsModule`/`DashboardModule` do, since every value this module needs is already exposed through a clean, existing interface (a single-repository/use-case reuse case, not the "read spans many unrelated tables with no existing interface" case those two modules are actually in).
<a id="f-comercial-jhoel-api-src-modules-alerts-application-dtos-alerts-output-spec-ts"></a>

### alerts-output.spec.ts

- **Ruta:** [alerts-output.spec.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/dtos/alerts-output.spec.ts) (`comercial-jhoel-api/src/modules/alerts/application/dtos/alerts-output.spec.ts`, 64 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** Prueba unitaria: declara `makeAlert` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [alert.entity.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-domain-entities-alert-entity-ts), [alerts-output.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-dtos-alerts-output-ts)
- **Consumidores:** —
#### Función `makeAlert` (L4–17)

- **Tipo:** función local del archivo
- **Firma:** `makeAlert(overrides: Partial<Alert>): Alert` — [alerts-output.spec.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/dtos/alerts-output.spec.ts#L4)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-alerts-application-dtos-alerts-output-ts"></a>

### alerts-output.ts

- **Ruta:** [alerts-output.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/dtos/alerts-output.ts) (`comercial-jhoel-api/src/modules/alerts/application/dtos/alerts-output.ts`, 42 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** DTO de salida (aplicación): declara `sortAlerts`, `toAlertOutput`, `AlertOutput`, `AlertsOutput`, `PRIORITY_RANK` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [alert.entity.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-domain-entities-alert-entity-ts)
- **Consumidores:** [alerts-output.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-dtos-alerts-output-spec-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts)

**Interfaces, tipos y enums:**

- `interface AlertOutput` (L3): sin documentación — miembros: `key`, `type`, `priority`, `title`, `description`, `amount`, `date`, `route`, `referenceId`, `isRead`
- `interface AlertsOutput` (L16): sin documentación — miembros: `count`, `total`, `items`
#### Función `sortAlerts` (L31–37)

- **Tipo:** función exportada
- **Firma:** `sortAlerts(alerts: Alert[]): Alert[]` — [alerts-output.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/dtos/alerts-output.ts#L31)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `[...alerts].sort`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts)

#### Función `toAlertOutput` (L39–41)

- **Tipo:** función exportada
- **Firma:** `toAlertOutput(alert: Alert, isRead: boolean): AlertOutput` — [alerts-output.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/dtos/alerts-output.ts#L39)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts"></a>

### get-alerts.use-case.spec.ts

- **Ruta:** [get-alerts.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/use-cases/get-alerts.use-case.spec.ts) (`comercial-jhoel-api/src/modules/alerts/application/use-cases/get-alerts.use-case.spec.ts`, 210 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** Prueba unitaria: declara `makePurchase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts), [inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts), [recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-type-repository-ts), [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts), [alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-repositories-alert-settings-repository-ts), [alert-read-mark.repository.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-domain-repositories-alert-read-mark-repository-ts), [catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-request-repository-ts), [purchase.entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-entity-ts), [alert-settings.entity.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-entities-alert-settings-entity-ts), [get-cash-box-balance.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-balance-use-case-ts)
- **Consumidores:** —
#### Función `makePurchase` (L13–32)

- **Tipo:** función local del archivo
- **Firma:** `makePurchase(paymentDueDate: string): Purchase` — [get-alerts.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/use-cases/get-alerts.use-case.spec.ts#L13)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Purchase.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts"></a>

### get-alerts.use-case.ts

- **Ruta:** [get-alerts.use-case.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/use-cases/get-alerts.use-case.ts) (`comercial-jhoel-api/src/modules/alerts/application/use-cases/get-alerts.use-case.ts`, 132 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** Composes all 3 alert categories fresh on every call — never persisted, never historical (see `Alert`'s own doc comment).
- **Depende de (archivos del proyecto):** [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts), [inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts), [recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-type-repository-ts), [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts), [alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-repositories-alert-settings-repository-ts), [get-cash-box-balance.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-balance-use-case-ts), [alert-read-mark.repository.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-domain-repositories-alert-read-mark-repository-ts), [catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-request-repository-ts), [alert.entity.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-domain-entities-alert-entity-ts), [alerts-output.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-dtos-alerts-output-ts), [today-iso-date.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-today-iso-date-ts), [build-alerts.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [alerts.module.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts), [get-alerts.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts), [mark-all-alerts-read.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-spec-ts), [mark-all-alerts-read.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-ts), [alerts.controller.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-presentation-controllers-alerts-controller-ts)

**Interfaces, tipos y enums:**

- `interface GetAlertsInput` (L28): sin documentación — miembros: `userId`, `isAdmin`

#### Clase `GetAlertsUseCase` (L47–131)

- **Decoradores:** `@Injectable()`
- **Propósito:** Composes all 3 alert categories fresh on every call — never persisted, never historical (see `Alert`'s own doc comment). An alert simply stops being produced the instant its underlying condition resolves (a purchase gets paid, stock rises above its minimum, a balance recovers) — there is no "close"/"dismiss" mutation anywhere in this module, only read-tracking (`AlertReadMarkRepository`) layered on top of whatever is currently active. Purchase alerts are ownership-scoped exactly like `ListPurchasesUseCase`: a non-admin only ever sees their own pending credit purchases. Inventory and recharge-balance alerts have no owner concept — they're operational state of the business as a whole, so every authenticated account sees the same set.
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASE_REPOSITORY) purchaseRepository: PurchaseRepository`, `@Inject(INVENTORY_STOCK_REPOSITORY) inventoryStockRepository: InventoryStockRepository`, `@Inject(RECHARGE_TYPE_REPOSITORY) rechargeTypeRepository: RechargeTypeRepository`, `@Inject(RECHARGE_DAILY_BALANCE_REPOSITORY) rechargeDailyBalanceRepository: RechargeDailyBalanceRepository`, `@Inject(ALERT_SETTINGS_REPOSITORY) alertSettingsRepository: AlertSettingsRepository`, `@Inject(ALERT_READ_MARK_REPOSITORY) alertReadMarkRepository: AlertReadMarkRepository`, `@Inject(CATALOG_REQUEST_REPOSITORY) catalogRequestRepository: CatalogRequestRepository`, `getCashBoxBalanceUseCase: GetCashBoxBalanceUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 67–130 | `input: GetAlertsInput` | `Promise<AlertsOutput>` |

##### `GetAlertsUseCase.execute`

- **Firma:** `execute(input: GetAlertsInput): Promise<AlertsOutput>` — [get-alerts.use-case.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/use-cases/get-alerts.use-case.ts#L67) (L67–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `todayIsoDate`, `Promise.all`, `this.alertSettingsRepository.get`, `this.purchaseRepository.findPendingCreditPurchases`, `this.inventoryStockRepository.findLowStock`, `this.rechargeTypeRepository.findAll`, `this.rechargeDailyBalanceRepository.findLatestPerType`, `this.getCashBoxBalanceUseCase.execute`, `this.catalogRequestRepository.countByStatus`, `new Map`, `latestBalances.map`, `pendingCreditPurchases.map`, `buildPurchaseAlert`, `lowStockRows.map`, `buildInventoryAlert`, `rechargeTypes.map`, `buildRechargeBalanceAlert`, `latestBalanceByType.get`…
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [mark-all-alerts-read.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-ts), [alerts.controller.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-presentation-controllers-alerts-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-alert-read-use-case-spec-ts"></a>

### mark-alert-read.use-case.spec.ts

- **Ruta:** [mark-alert-read.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/use-cases/mark-alert-read.use-case.spec.ts) (`comercial-jhoel-api/src/modules/alerts/application/use-cases/mark-alert-read.use-case.spec.ts`, 19 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [mark-alert-read.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-alert-read-use-case-ts), [alert-read-mark.repository.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-domain-repositories-alert-read-mark-repository-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-alert-read-use-case-ts"></a>

### mark-alert-read.use-case.ts

- **Ruta:** [mark-alert-read.use-case.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/use-cases/mark-alert-read.use-case.ts) (`comercial-jhoel-api/src/modules/alerts/application/use-cases/mark-alert-read.use-case.ts`, 29 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** A no-op if the alert no longer exists or was already read — read-marks are intentionally decoupled from whether the alert is currently active (see `AlertReadMarkOrmEntity`'s `CASCADE` FK doc comment): opening an alert and then having its condition resolve before the mark is written is harmless, the row just becomes an inert leftover no future `findReadKeys` call will ever match against.
- **Depende de (archivos del proyecto):** [alert-read-mark.repository.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-domain-repositories-alert-read-mark-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [alerts.module.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts), [mark-alert-read.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-alert-read-use-case-spec-ts), [alerts.controller.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-presentation-controllers-alerts-controller-ts)

**Interfaces, tipos y enums:**

- `interface MarkAlertReadInput` (L5): sin documentación — miembros: `userId`, `key`

#### Clase `MarkAlertReadUseCase` (L18–28)

- **Decoradores:** `@Injectable()`
- **Propósito:** A no-op if the alert no longer exists or was already read — read-marks are intentionally decoupled from whether the alert is currently active (see `AlertReadMarkOrmEntity`'s `CASCADE` FK doc comment): opening an alert and then having its condition resolve before the mark is written is harmless, the row just becomes an inert leftover no future `findReadKeys` call will ever match against.
- **Dependencias inyectadas (constructor):** `@Inject(ALERT_READ_MARK_REPOSITORY) alertReadMarkRepository: AlertReadMarkRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–27 | `input: MarkAlertReadInput` | `Promise<void>` |

##### `MarkAlertReadUseCase.execute`

- **Firma:** `execute(input: MarkAlertReadInput): Promise<void>` — [mark-alert-read.use-case.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/use-cases/mark-alert-read.use-case.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.alertReadMarkRepository.markRead`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [alerts.controller.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-presentation-controllers-alerts-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-spec-ts"></a>

### mark-all-alerts-read.use-case.spec.ts

- **Ruta:** [mark-all-alerts-read.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/use-cases/mark-all-alerts-read.use-case.spec.ts) (`comercial-jhoel-api/src/modules/alerts/application/use-cases/mark-all-alerts-read.use-case.spec.ts`, 56 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [mark-all-alerts-read.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-ts), [alert-read-mark.repository.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-domain-repositories-alert-read-mark-repository-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-ts"></a>

### mark-all-alerts-read.use-case.ts

- **Ruta:** [mark-all-alerts-read.use-case.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/use-cases/mark-all-alerts-read.use-case.ts) (`comercial-jhoel-api/src/modules/alerts/application/use-cases/mark-all-alerts-read.use-case.ts`, 33 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** Marks every alert CURRENTLY active for this caller as read — depends on `GetAlertsUseCase` to compute exactly that same set (same ownership scoping) rather than re-deriving it, so "read-all" can never drift from what the panel just showed the user.
- **Depende de (archivos del proyecto):** [alert-read-mark.repository.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-domain-repositories-alert-read-mark-repository-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [alerts.module.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts), [mark-all-alerts-read.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-spec-ts), [alerts.controller.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-presentation-controllers-alerts-controller-ts)

**Interfaces, tipos y enums:**

- `interface MarkAllAlertsReadInput` (L6): sin documentación — miembros: `userId`, `isAdmin`

#### Clase `MarkAllAlertsReadUseCase` (L17–32)

- **Decoradores:** `@Injectable()`
- **Propósito:** Marks every alert CURRENTLY active for this caller as read — depends on `GetAlertsUseCase` to compute exactly that same set (same ownership scoping) rather than re-deriving it, so "read-all" can never drift from what the panel just showed the user.
- **Dependencias inyectadas (constructor):** `@Inject(ALERT_READ_MARK_REPOSITORY) alertReadMarkRepository: AlertReadMarkRepository`, `getAlertsUseCase: GetAlertsUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–31 | `input: MarkAllAlertsReadInput` | `Promise<void>` |

##### `MarkAllAlertsReadUseCase.execute`

- **Firma:** `execute(input: MarkAllAlertsReadInput): Promise<void>` — [mark-all-alerts-read.use-case.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/use-cases/mark-all-alerts-read.use-case.ts#L25) (L25–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getAlertsUseCase.execute`, `this.alertReadMarkRepository.markAllRead`, `alerts.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [alerts.controller.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-presentation-controllers-alerts-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-spec-ts"></a>

### build-alerts.spec.ts

- **Ruta:** [build-alerts.spec.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/build-alerts.spec.ts) (`comercial-jhoel-api/src/modules/alerts/application/utils/build-alerts.spec.ts`, 242 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** Prueba unitaria: declara `makePurchase`, `makeLowStockRow`, `makeRechargeType`, `makeBalance` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchase.entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-entity-ts), [inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts), [recharge-type.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-type-entity-ts), [recharge-daily-balance.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-daily-balance-entity-ts), [build-alerts.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-ts)
- **Consumidores:** —
#### Función `makePurchase` (L12–35)

- **Tipo:** función local del archivo
- **Firma:** `makePurchase(overrides: { id?: string; paymentDueDate: string \| null; total?: number; }): Purchase` — [build-alerts.spec.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/build-alerts.spec.ts#L12)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Purchase.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `makeLowStockRow` (L37–47)

- **Tipo:** función local del archivo
- **Firma:** `makeLowStockRow(overrides: Partial<LowStockRow>): LowStockRow` — [build-alerts.spec.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/build-alerts.spec.ts#L37)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `makeRechargeType` (L49–61)

- **Tipo:** función local del archivo
- **Firma:** `makeRechargeType(overrides: Partial<{ id: string; name: string; minBalance: number }>): RechargeType` — [build-alerts.spec.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/build-alerts.spec.ts#L49)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `RechargeType.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `makeBalance` (L63–83)

- **Tipo:** función local del archivo
- **Firma:** `makeBalance(overrides: Partial<{ rechargeTypeId: string; dailyBalance: number }>): RechargeDailyBalance` — [build-alerts.spec.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/build-alerts.spec.ts#L63)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `RechargeDailyBalance.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-ts"></a>

### build-alerts.ts

- **Ruta:** [build-alerts.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/build-alerts.ts) (`comercial-jhoel-api/src/modules/alerts/application/utils/build-alerts.ts`, 192 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** `PURCHASE_PAYMENT_DUE` (próximo/vence hoy) or `PURCHASE_PAYMENT_OVERDUE` (vencido) — `null` when the due date is still further out than `alertDays`, i.e.
- **Depende de (archivos del proyecto):** [purchase.entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-entity-ts), [inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts), [recharge-type.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-type-entity-ts), [recharge-daily-balance.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-daily-balance-entity-ts), [alert.entity.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-domain-entities-alert-entity-ts), [today-iso-date.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-today-iso-date-ts)
- **Consumidores:** [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [build-alerts.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-spec-ts)
#### Función `buildPurchaseAlert` (L18–76)

- **Tipo:** función exportada
- **Firma:** `buildPurchaseAlert(purchase: Purchase, today: string, alertDays: number): Alert \| null` — [build-alerts.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/build-alerts.ts#L18)
- **Propósito / descripción:** `PURCHASE_PAYMENT_DUE` (próximo/vence hoy) or `PURCHASE_PAYMENT_OVERDUE` (vencido) — `null` when the due date is still further out than `alertDays`, i.e. not yet within the alert window at all. The caller (`GetAlertsUseCase`) already only passes `PENDING` `CREDITO` purchases (see `PurchaseRepository.findPendingCreditPurchases`) — a `PAID` purchase never reaches this function, which is the entire mechanism behind "una compra pagada deja de generar alerta": there's nothing to mark inactive, it simply stops being in the input list the next time alerts are computed.
- **Dependencias:** `daysBetweenIsoDates`, `Math.abs`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts)

#### Función `buildInventoryAlert` (L86–99)

- **Tipo:** función exportada
- **Firma:** `buildInventoryAlert(row: LowStockRow): Alert` — [build-alerts.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/build-alerts.ts#L86)
- **Propósito / descripción:** `LOW_INVENTORY` — priority `CRITICAL` ("Producto agotado") only when `quantity === 0`, otherwise `MEDIUM` ("Inventario bajo"). The caller only ever passes rows `InventoryStockRepository.findLowStock()` already filtered to `minStock &gt; 0 AND quantity &lt;= minStock` — a row with no threshold configured, or with plenty of stock, never reaches this function at all.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts)

#### Función `buildRechargeBalanceAlert` (L109–134)

- **Tipo:** función exportada
- **Firma:** `buildRechargeBalanceAlert(type: RechargeType, latestBalance: RechargeDailyBalance \| undefined): Alert \| null` — [build-alerts.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/build-alerts.ts#L109)
- **Propósito / descripción:** `LOW_RECHARGE_BALANCE` — priority `CRITICAL` ("Saldo agotado") only when the current balance is exactly `0`, otherwise `MEDIUM` ("Saldo bajo"). `null` when the type has no threshold configured (`minBalance = 0`) or no balance history at all yet — never a false alert for an untouched type. Claro/Tigo are never mixed: each type is evaluated independently against its own `minBalance` and its own latest `dailyBalance` row.
- **Dependencias:** `balance.toFixed`, `type.minBalance.toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts)

#### Función `buildCatalogRequestAlert` (L155–173)

- **Tipo:** función exportada
- **Firma:** `buildCatalogRequestAlert(newRequestsCount: number): Alert \| null` — [build-alerts.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/build-alerts.ts#L155)
- **Propósito / descripción:** `CATALOG_REQUEST_NEW` — one summary alert (never one per lead) covering every `catalog_requests` row still in `NUEVA` status. A `key` fixed to the literal string `'catalog-request:new'` (there's only ever one such alert, same shape as `buildCashBoxBalanceAlert`'s own single fixed key) — it simply stops being produced the moment an admin moves every `NUEVA` request to another status, same "no dismiss action, recomputed fresh every call" mechanism as every other alert in this module.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts)

#### Función `buildCashBoxBalanceAlert` (L175–191)

- **Tipo:** función exportada
- **Firma:** `buildCashBoxBalanceAlert(currentBalance: number): Alert \| null` — [build-alerts.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/build-alerts.ts#L175)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `currentBalance.toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-alerts-application-utils-today-iso-date-ts"></a>

### today-iso-date.ts

- **Ruta:** [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/today-iso-date.ts) (`comercial-jhoel-api/src/modules/alerts/application/utils/today-iso-date.ts`, 15 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** Local-time `yyyy-MM-dd` — same technique every date-driven use case in this codebase already uses.
- **Descripción del autor (comentario del archivo):** Local-time `yyyy-MM-dd` — same technique every date-driven use case in this codebase already uses. The API process runs with `TZ=America/Guatemala` (see `docker-compose.yml`/migration `1759100000000-SetDatabaseTimezone`), so `Date`'s own local getters already reflect the correct Guatemala calendar day — never the browser's clock, never UTC.
- **Consumidores:** [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [build-alerts.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-ts)
#### Función `todayIsoDate` (L2–8)

- **Tipo:** función exportada
- **Firma:** `todayIsoDate(): string` — [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/today-iso-date.ts#L2)
- **Propósito / descripción:** Local-time `yyyy-MM-dd` — same technique every date-driven use case in this codebase already uses. The API process runs with `TZ=America/Guatemala` (see `docker-compose.yml`/migration `1759100000000-SetDatabaseTimezone`), so `Date`'s own local getters already reflect the correct Guatemala calendar day — never the browser's clock, never UTC.
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts)

#### Función `daysBetweenIsoDates` (L11–14)

- **Tipo:** función exportada
- **Firma:** `daysBetweenIsoDates(from: string, to: string): number` — [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/alerts/application/utils/today-iso-date.ts#L11)
- **Propósito / descripción:** Whole calendar days between two `yyyy-MM-dd` strings (`to - from`) — positive when `to` is in the future. Both operands are parsed as UTC midnight by `Date.parse`, so the day-difference is correct regardless of the server's own timezone offset; only `todayIsoDate()` above needs to be timezone-aware, this is pure calendar arithmetic on two already-resolved date strings.
- **Dependencias:** `Math.round`, `Date.parse`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [build-alerts.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-ts)

<a id="f-comercial-jhoel-api-src-modules-alerts-domain-entities-alert-entity-ts"></a>

### alert.entity.ts

- **Ruta:** [alert.entity.ts](../../../../comercial-jhoel-api/src/modules/alerts/domain/entities/alert.entity.ts) (`comercial-jhoel-api/src/modules/alerts/domain/entities/alert.entity.ts`, 41 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** Extensible on purpose — a future alert (cuenta por cobrar vencida, banco, stock agotado de SIMs, cierre de día, ...) is a new string here, never a structural change to `Alert`/`GetAlertsUseCase` below.
- **Descripción del autor (comentario del archivo):** Extensible on purpose — a future alert (cuenta por cobrar vencida, banco, stock agotado de SIMs, cierre de día, ...) is a new string here, never a structural change to `Alert`/`GetAlertsUseCase` below.
- **Consumidores:** [alerts-output.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-dtos-alerts-output-spec-ts), [alerts-output.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-dtos-alerts-output-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [build-alerts.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-ts), [alerts.response.dto.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-presentation-dtos-alerts-response-dto-ts)

**Interfaces, tipos y enums:**

- `interface Alert` (L26): Never a persisted row — always computed fresh, every request, from `purchases`/`inventory_stock`/`recharge_types`+`recharge_daily_balances` (see `GetAlertsUseCase`). — miembros: `key`, `type`, `priority`, `title`, `description`, `amount`, `date`, `route`, `referenceId`
- `type AlertType` (L6) = `\| 'PURCHASE_PAYMENT_DUE' \| 'PURCHASE_PAYMENT_OVERDUE' \| 'LOW_INVENTORY' \| 'LOW_RECHARGE_BALANCE' \| 'NEGATIVE_CASH_BOX_BALANCE' \| 'CATALOG_REQUEST_NEW'` — Extensible on purpose — a future alert (cuenta por cobrar vencida, banco, stock agotado de SIMs, cierre de día, ...) is a new string here, never a structural change to `Alert`/`GetAlertsUseCase` below.
- `type AlertPriority` (L14) = `'CRITICAL' \| 'HIGH' \| 'MEDIUM'`
<a id="f-comercial-jhoel-api-src-modules-alerts-domain-repositories-alert-read-mark-repository-ts"></a>

### alert-read-mark.repository.ts

- **Ruta:** [alert-read-mark.repository.ts](../../../../comercial-jhoel-api/src/modules/alerts/domain/repositories/alert-read-mark.repository.ts) (`comercial-jhoel-api/src/modules/alerts/domain/repositories/alert-read-mark.repository.ts`, 10 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `AlertReadMarkRepository`, `ALERT_READ_MARK_REPOSITORY` (sin comentario de documentación en el código).
- **Consumidores:** [alerts.module.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts), [get-alerts.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [mark-alert-read.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-alert-read-use-case-spec-ts), [mark-alert-read.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-alert-read-use-case-ts), [mark-all-alerts-read.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-spec-ts), [mark-all-alerts-read.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-ts), [typeorm-alert-read-mark.repository.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-infrastructure-persistence-typeorm-alert-read-mark-repository-ts)

**Interfaces, tipos y enums:**

- `interface AlertReadMarkRepository` (L3): sin documentación — miembros: `findReadKeys`, `markRead`, `markAllRead`

**Constantes exportadas:**

- `ALERT_READ_MARK_REPOSITORY` (L1) = `Symbol('ALERT_READ_MARK_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-alerts-infrastructure-persistence-alert-read-mark-orm-entity-ts"></a>

### alert-read-mark.orm-entity.ts

- **Ruta:** [alert-read-mark.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/alerts/infrastructure/persistence/alert-read-mark.orm-entity.ts) (`comercial-jhoel-api/src/modules/alerts/infrastructure/persistence/alert-read-mark.orm-entity.ts`, 14 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `AlertReadMarkOrmEntity` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** [alerts.module.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts), [typeorm-alert-read-mark.repository.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-infrastructure-persistence-typeorm-alert-read-mark-repository-ts)

#### Clase `AlertReadMarkOrmEntity` (L3–13)

- **Decoradores:** `@Entity('alert_read_marks')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@CreateDateColumn readAt: Date`
<a id="f-comercial-jhoel-api-src-modules-alerts-infrastructure-persistence-typeorm-alert-read-mark-repository-ts"></a>

### typeorm-alert-read-mark.repository.ts

- **Ruta:** [typeorm-alert-read-mark.repository.ts](../../../../comercial-jhoel-api/src/modules/alerts/infrastructure/persistence/typeorm-alert-read-mark.repository.ts) (`comercial-jhoel-api/src/modules/alerts/infrastructure/persistence/typeorm-alert-read-mark.repository.ts`, 45 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmAlertReadMarkRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [alert-read-mark.repository.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-domain-repositories-alert-read-mark-repository-ts), [alert-read-mark.orm-entity.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-infrastructure-persistence-alert-read-mark-orm-entity-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [alerts.module.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts)

#### Clase `TypeOrmAlertReadMarkRepository` (L7–44)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements AlertReadMarkRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(AlertReadMarkOrmEntity) repository: Repository<AlertReadMarkOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findReadKeys` | método public async | 14–22 | `userId: string`, `keys: string[]` | `Promise<Set<string>>` |
| `markRead` | método public async | 24–31 | `userId: string`, `key: string` | `Promise<void>` |
| `markAllRead` | método public async | 33–43 | `userId: string`, `keys: string[]` | `Promise<void>` |

##### `TypeOrmAlertReadMarkRepository.findReadKeys`

- **Firma:** `findReadKeys(userId: string, keys: string[]): Promise<Set<string>>` — [typeorm-alert-read-mark.repository.ts](../../../../comercial-jhoel-api/src/modules/alerts/infrastructure/persistence/typeorm-alert-read-mark.repository.ts#L14) (L14–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Set`, `this.repository.find`, `In`, `rows.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAlertReadMarkRepository.markRead`

- **Firma:** `markRead(userId: string, key: string): Promise<void>` — [typeorm-alert-read-mark.repository.ts](../../../../comercial-jhoel-api/src/modules/alerts/infrastructure/persistence/typeorm-alert-read-mark.repository.ts#L24) (L24–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder().insert().values({ userId, alertKey: key }).orIgnore`, `this.repository.createQueryBuilder().insert().values`, `this.repository.createQueryBuilder().insert`, `this.repository.createQueryBuilder`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAlertReadMarkRepository.markAllRead`

- **Firma:** `markAllRead(userId: string, keys: string[]): Promise<void>` — [typeorm-alert-read-mark.repository.ts](../../../../comercial-jhoel-api/src/modules/alerts/infrastructure/persistence/typeorm-alert-read-mark.repository.ts#L33) (L33–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder().insert().values`, `this.repository.createQueryBuilder().insert`, `this.repository.createQueryBuilder`, `keys.map`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-alerts-presentation-controllers-alerts-controller-ts"></a>

### alerts.controller.ts

- **Ruta:** [alerts.controller.ts](../../../../comercial-jhoel-api/src/modules/alerts/presentation/controllers/alerts.controller.ts) (`comercial-jhoel-api/src/modules/alerts/presentation/controllers/alerts.controller.ts`, 61 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** No `@Roles(...)` — every authenticated, active account sees the Navbar bell (inventory/recharge alerts are shared operational state; purchase alerts are ownership-scoped inside `GetAlertsUseCase` itself for a non-admin, same split `PurchasesController` already uses).
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [mark-alert-read.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-alert-read-use-case-ts), [mark-all-alerts-read.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-mark-all-alerts-read-use-case-ts), [alerts.response.dto.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-presentation-dtos-alerts-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [alerts.module.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts)

#### Clase `AlertsController` (L26–60)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('alerts')`
- **Propósito:** No `@Roles(...)` — every authenticated, active account sees the Navbar bell (inventory/recharge alerts are shared operational state; purchase alerts are ownership-scoped inside `GetAlertsUseCase` itself for a non-admin, same split `PurchasesController` already uses).
- **Dependencias inyectadas (constructor):** `getAlertsUseCase: GetAlertsUseCase`, `markAlertReadUseCase: MarkAlertReadUseCase`, `markAllAlertsReadUseCase: MarkAllAlertsReadUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 35–41 | `user: RequestUser` | `Promise<AlertsResponseDto>` |
| `markRead` | método public | 43–50 | `key: string`, `userId: string` | `Promise<void>` |
| `markAllRead` | método public | 52–59 | `user: RequestUser` | `Promise<void>` |

##### `AlertsController.findAll`

- **Firma:** `findAll(user: RequestUser): Promise<AlertsResponseDto>` — [alerts.controller.ts](../../../../comercial-jhoel-api/src/modules/alerts/presentation/controllers/alerts.controller.ts#L35) (L35–41)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getAlertsUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AlertsController.markRead`

- **Firma:** `markRead(key: string, userId: string): Promise<void>` — [alerts.controller.ts](../../../../comercial-jhoel-api/src/modules/alerts/presentation/controllers/alerts.controller.ts#L43) (L43–50)
- **Decoradores:** `@Post(':key/read')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('key') key`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.markAlertReadUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AlertsController.markAllRead`

- **Firma:** `markAllRead(user: RequestUser): Promise<void>` — [alerts.controller.ts](../../../../comercial-jhoel-api/src/modules/alerts/presentation/controllers/alerts.controller.ts#L52) (L52–59)
- **Decoradores:** `@Post('read-all')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.markAllAlertsReadUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-alerts-presentation-dtos-alerts-response-dto-ts"></a>

### alerts.response.dto.ts

- **Ruta:** [alerts.response.dto.ts](../../../../comercial-jhoel-api/src/modules/alerts/presentation/dtos/alerts.response.dto.ts) (`comercial-jhoel-api/src/modules/alerts/presentation/dtos/alerts.response.dto.ts`, 21 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `alerts`
- **Responsabilidad:** DTO de respuesta: declara `AlertResponseDto`, `AlertsResponseDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [alert.entity.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-domain-entities-alert-entity-ts)
- **Consumidores:** [alerts.controller.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-presentation-controllers-alerts-controller-ts)

#### Clase `AlertResponseDto` (L3–14)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `AlertsResponseDto` (L16–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
