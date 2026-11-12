# Módulo backend `recharges`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/recharge-days` | [recharge-days.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-days.controller.ts#L43) `RechargeDaysController.findAll` | [ListClosedRechargeDaysUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-closed-recharge-days-use-case-ts) | `RechargeDayOpeningRepository`.findClosedDays [recharge_sales_closures] | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `RechargeDaysService.getClosedDays` |
| `GET /api/recharge-days/:date` | [recharge-days.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-days.controller.ts#L50) `RechargeDaysController.findOne` | [GetRechargeDayDetailUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-detail-use-case-ts) | `RechargeDayOpeningRepository`.findByDate<br>`RechargeSalesClosureRepository`.findAllByDate<br>`RechargeDayAuditLogRepository`.findByDate | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `RechargeDaysService.getDayDetail` |
| `POST /api/recharge-days/:date/reopen` | [recharge-days.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-days.controller.ts#L55) `RechargeDaysController.reopen` | [ReopenRechargeDayUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-reopen-recharge-day-use-case-ts) | `RechargeDayOpeningRepository`.reopen → `reopen_recharge_day`<br>`GetRechargeDayDetailUseCase`.execute | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `RechargeDaysService.reopenDay` |
| `POST /api/recharge-days/:date/cancel` | [recharge-days.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-days.controller.ts#L68) `RechargeDaysController.cancel` | [CancelRechargeDayUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-cancel-recharge-day-use-case-ts) | `RechargeDayOpeningRepository`.cancel → `cancel_recharge_day`<br>`GetRechargeDayDetailUseCase`.execute | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `RechargeDaysService.cancelDay` |
| `GET /api/recharges/sims/types` | [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L88) `RechargeSimsController.findTypes` | [ListRechargeSimTypesUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-types-use-case-ts) | `RechargeSimTypeRepository`.findAll | UseGuards(JwtAuthGuard) | `RechargeSimsService.getTypes` |
| `GET /api/recharges/sims/daily` | [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L93) `RechargeSimsController.findDaily` | [GetRechargeSimDailySummaryUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-daily-summary-use-case-ts) | `RechargeSimTypeRepository`.findAll<br>`RechargeSimDailyStockRepository`.ensureDailyStock → `ensure_recharge_sim_daily_stock` | UseGuards(JwtAuthGuard) | `RechargeSimsService.getDailyStock` |
| `POST /api/recharges/sims/purchases` | [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L104) `RechargeSimsController.registerPurchase` | [RegisterRechargeSimPurchaseUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-purchase-use-case-ts) | `RechargeSimDailyStockRepository`.registerPurchase → `register_recharge_sim_purchase` | UseGuards(JwtAuthGuard) | `RechargeSimsService.registerPurchase` |
| `POST /api/recharges/sims/sales` | [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L117) `RechargeSimsController.registerSale` | [RegisterRechargeSimSaleUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-use-case-ts) | `RechargeSimDailyStockRepository`.registerSale → `register_recharge_sim_sale` | UseGuards(JwtAuthGuard) | `RechargeSimsService.registerSale` |
| `GET /api/recharges/sims/sales` | [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L131) `RechargeSimsController.findSales` | [ListRechargeSimSalesUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sales-use-case-ts) | `RechargeSimSaleRepository`.findAllByDate [recharge_sim_sale_registrations]<br>`RechargeDayOpeningRepository`.findByDate | UseGuards(JwtAuthGuard) | `RechargeSimsService.getSales` |
| `POST /api/recharges/sims/sales/:id/void` | [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L147) `RechargeSimsController.voidSale` | [VoidRechargeSimSaleUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-use-case-ts) | `RechargeSimSaleRepository`.findById/voidSale → `void_recharge_sim_sale`<br>`RechargeDayOpeningRepository`.findByDate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `RechargeSimsService.voidSale` |
| `POST /api/recharges/sims/sale-registrations` | [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L174) `RechargeSimsController.registerSaleRegistration` | [RegisterRechargeSimSaleWithRegistrationUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts) | `RechargeSimDailyStockRepository`.registerSingleUnitSale → `register_recharge_sim_sale_unit`<br>`RechargeSimSaleRegistrationRepository`.saveDpiImage/create → `register_recharge_sim_sale_registration`<br>`TransactionManager`.runInTransaction | UseGuards(JwtAuthGuard) | `RechargeSimsService.registerSaleRegistration` |
| `GET /api/recharges/sims/sale-registrations` | [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L198) `RechargeSimsController.findSaleRegistrations` | [ListRechargeSimSaleRegistrationsUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sale-registrations-use-case-ts) | `RechargeSimSaleRegistrationRepository`.findAll | UseGuards(JwtAuthGuard) | `RechargeSimsService.getSaleRegistrations` |
| `GET /api/recharges/sims/sale-registrations/:id` | [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L205) `RechargeSimsController.findSaleRegistrationById` | [GetRechargeSimSaleRegistrationByIdUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-by-id-use-case-ts) | `RechargeSimSaleRegistrationRepository`.findById | UseGuards(JwtAuthGuard) | `RechargeSimsService.getSaleRegistrationById` |
| `GET /api/recharges/sims/sale-registrations/:id/dpi-image` | [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L219) `RechargeSimsController.getSaleRegistrationDpiImage` | [GetRechargeSimSaleRegistrationDpiImageUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-dpi-image-use-case-ts) | `RechargeSimSaleRegistrationRepository`.findById/getDpiImage [recharge_sim_sale_registrations, recharge_sim_dpi_images] | UseGuards(JwtAuthGuard) | `RechargeSimsService.getDpiImage` |
| `POST /api/recharges/sims/sale-registrations/:id/void` | [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L238) `RechargeSimsController.voidSaleRegistration` | [VoidRechargeSimSaleRegistrationUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-registration-use-case-ts) | `RechargeSimSaleRegistrationRepository`.findById/voidRegistration → `void_recharge_sim_sale_registration` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `RechargeSimsService.voidSaleRegistration` |
| `GET /api/recharges/day-status` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L119) `RechargesController.getDayStatus` | [GetRechargeDayStatusUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-status-use-case-ts) | `RechargeDayOpeningRepository`.findByDate<br>`RechargeSalesClosureRepository`.existsForDate | UseGuards(JwtAuthGuard) | `RechargesService.getDayStatus` |
| `POST /api/recharges/day-status/open` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L132) `RechargesController.openDay` | [OpenRechargeDayUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-open-recharge-day-use-case-ts) | `RechargeDayOpeningRepository`.findByDate/open<br>`RechargeDayAuditLogRepository`.record<br>`GetRechargeDayStatusUseCase`.execute | UseGuards(JwtAuthGuard) | `RechargesService.openDay` |
| `POST /api/recharges/day-status/close` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L150) `RechargesController.closeDay` | [CloseRechargeDayUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts) | `RechargeDayOpeningRepository`.findByDate/close → `close_recharge_day`<br>`RechargeSalesClosureRepository`.existsForDate<br>`GetRechargeDayStatusUseCase`.execute | UseGuards(JwtAuthGuard) | `RechargesService.closeDay` |
| `GET /api/recharges/types` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L162) `RechargesController.findTypes` | [ListRechargeTypesUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-types-use-case-ts) | `RechargeTypeRepository`.findAll | UseGuards(JwtAuthGuard) | `RechargesService.getTypes` |
| `PATCH /api/recharges/types/:id/min-balance` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L168) `RechargesController.updateMinBalance` | [UpdateRechargeTypeMinBalanceUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-ts) | `RechargeTypeRepository`.updateMinBalance | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `RechargesService.updateTypeMinBalance` |
| `GET /api/recharges/daily` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L181) `RechargesController.findDaily` | [GetRechargeDailySummaryUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-daily-summary-use-case-ts) | `RechargeTypeRepository`.findAll<br>`RechargeDailyBalanceRepository`.ensureDailyBalance → `ensure_recharge_daily_balance` | UseGuards(JwtAuthGuard) | `RechargesService.getDailySummary` |
| `POST /api/recharges/purchases` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L189) `RechargesController.registerPurchase` | [RegisterRechargePurchaseUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-purchase-use-case-ts) | `RechargeDailyBalanceRepository`.registerPurchase → `register_recharge_purchase` | UseGuards(JwtAuthGuard) | `RechargesService.registerPurchase` |
| `GET /api/recharges/purchases` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L203) `RechargesController.findPurchases` | [GetRechargePurchasesUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-purchases-use-case-ts) | `RechargePurchaseRepository`.findAllByDate | UseGuards(JwtAuthGuard) | `RechargesService.getPurchases` |
| `POST /api/recharges/purchases/:id/void` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L218) `RechargesController.voidPurchase` | [VoidRechargePurchaseUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-purchase-use-case-ts) | `RechargePurchaseRepository`.findById/voidPurchase → `void_recharge_purchase` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `RechargesService.voidPurchase` |
| `PATCH /api/recharges/daily/:id/final-balance` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L234) `RechargesController.registerFinalBalance` | [RegisterRechargeFinalBalanceUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-final-balance-use-case-ts) | `RechargeDailyBalanceRepository`.findById/registerFinalBalance → `register_recharge_final_balance` | UseGuards(JwtAuthGuard) | `RechargesService.registerFinalBalance` |
| `GET /api/recharges/history` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L248) `RechargesController.findHistory` | [GetRechargeHistoryUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-history-use-case-ts) | `RechargeDailyBalanceRepository`.findHistory [recharge_day_openings] | UseGuards(JwtAuthGuard) | — |
| `GET /api/recharges/sales-summary` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L255) `RechargesController.findSalesSummary` | [GetRechargeSalesSummaryUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-summary-use-case-ts) | `RechargeDailyBalanceRepository`.findAllByDate<br>`RechargeSalesClosureRepository`.findByDateAndSequence<br>`RechargeSaleRepository`.getCurrentCycleTotalsByDate [recharge_daily_balances, recharge_types, recharge_sales]<br>`RechargeSimSaleRegistrationRepository`.getTotalByDate [recharge_sim_sales, recharge_sim_sale_registrations] | UseGuards(JwtAuthGuard) | `RechargesService.getSalesSummary` |
| `GET /api/recharges/daily-stats` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L263) `RechargesController.dailyStats` | [GetRechargesDailyStatsUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharges-daily-stats-use-case-ts) | `RechargeDailyBalanceRepository`.getDailySalesTotals | UseGuards(JwtAuthGuard) | `RechargesService.getDailyStats` |
| `GET /api/recharges/weekly-stats` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L269) `RechargesController.weeklyStats` | [GetRechargesWeeklyStatsUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharges-weekly-stats-use-case-ts) | `RechargeDailyBalanceRepository`.getDailySalesTotals | UseGuards(JwtAuthGuard) | `RechargesService.getWeeklyStats` |
| `GET /api/recharges/yearly-stats` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L275) `RechargesController.yearlyStats` | [GetRechargesYearlyStatsUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharges-yearly-stats-use-case-ts) | `RechargeDailyBalanceRepository`.getMonthlySalesTotals | UseGuards(JwtAuthGuard) | `RechargesService.getYearlyStats` |
| `GET /api/recharges/operators-summary` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L281) `RechargesController.operatorsSummary` | [GetRechargeOperatorsSummaryUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-operators-summary-use-case-ts) | `RechargeTypeRepository`.findAll<br>`RechargeDailyBalanceRepository`.getMonthlySalesTotalsByType/getMonthlyPurchaseTotalsByType/findLatestPerType [recharge_daily_balances] | UseGuards(JwtAuthGuard) | `RechargesService.getOperatorsSummary` |
| `PATCH /api/recharges/types/:id/balance-limit` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L287) `RechargesController.updateBalanceLimit` | [UpdateRechargeTypeBalanceLimitUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-balance-limit-use-case-ts) | `RechargeTypeRepository`.updateBalanceLimit | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `RechargesService.updateTypeBalanceLimit` |
| `POST /api/recharges/sales-closure` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L300) `RechargesController.registerSalesClosure` | [RegisterRechargeSalesClosureUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sales-closure-use-case-ts) | `RechargeSalesClosureRepository`.registerClosure → `register_recharge_sales_closure`<br>`GetRechargeSalesSummaryUseCase`.execute | UseGuards(JwtAuthGuard) | `RechargesService.registerSalesClosure` |
| `GET /api/recharges/sales` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L313) `RechargesController.findSales` | [GetRechargeSalesUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-use-case-ts) | `RechargeSaleRepository`.findAllByDate | UseGuards(JwtAuthGuard) | `RechargesService.getSales` |
| `POST /api/recharges/sales` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L320) `RechargesController.createSale` | [CreateRechargeSaleUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-create-recharge-sale-use-case-ts) | `RechargeSaleRepository`.create → `register_recharge_sale` | UseGuards(JwtAuthGuard) | `RechargesService.registerSale` |
| `PATCH /api/recharges/sales/:id` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L334) `RechargesController.updateSale` | [UpdateRechargeSaleUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-sale-use-case-ts) | `RechargeSaleRepository`.update → `update_recharge_sale` | UseGuards(JwtAuthGuard) | `RechargesService.updateSale` |
| `DELETE /api/recharges/sales/:id` | [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L348) `RechargesController.deleteSale` | [DeleteRechargeSaleUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-delete-recharge-sale-use-case-ts) | `RechargeSaleRepository`.delete → `delete_recharge_sale` | UseGuards(JwtAuthGuard) | `RechargesService.deleteSale` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [recharge-closed-day-output.ts](#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-closed-day-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toRechargeClosedDayOutput`, `RechargeClosedDayOutput` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [recharge-daily-balance-output.ts](#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-daily-balance-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toRechargeDailyBalanceOutput`, `RechargeDailyBalanceOutput` (sin comentario de documentación en el código). | 1 internas | 5 | Media (5 consumidores) |
| [recharge-day-detail-output.ts](#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-detail-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `RechargeDayAuditLogOutput`, `RechargeDayDetailOutput` (sin comentario de documentación en el código). | 3 internas | 4 | Media (4 consumidores) |
| [recharge-day-status-output.ts](#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-status-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | The conceptual state of a Recargas date's "working cycle" — five values, always derived from the same independent facts (is there a `recharge_day_openings` row? | 0 internas | 4 | Media (4 consumidores) |
| [recharge-purchase-output.ts](#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-purchase-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toRechargePurchaseOutput`, `RechargePurchaseOutput` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [recharge-sale-output.ts](#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sale-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toRechargeSaleOutput`, `RechargeSaleOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [recharge-sales-closure-output.ts](#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sales-closure-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Individual cuadre-cycle output — never exposed standalone before this ticket (only merged into `RechargeSalesSummaryOutput`'s single "current cycle" shape). | 1 internas | 2 | Baja (2 consumidores) |
| [recharge-sales-summary-output.ts](#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sales-summary-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `RechargeSalesSummaryOutput` (sin comentario de documentación en el código). | 0 internas | 3 | Media (3 consumidores) |
| [recharge-sim-daily-stock-output.ts](#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-daily-stock-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toRechargeSimDailyStockOutput`, `RechargeSimDailyStockOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [recharge-sim-sale-output.ts](#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-sale-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toRechargeSimSaleOutput`, `RechargeSimSaleOutput` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [recharge-sim-sale-registration-output.ts](#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-sale-registration-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toRechargeSimSaleRegistrationOutput`, `RechargeSimSaleRegistrationOutput`, `PaginatedRechargeSimSaleRegistrationsOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [recharge-sim-type-output.ts](#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-type-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toRechargeSimTypeOutput`, `RechargeSimTypeOutput` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [recharge-type-output.ts](#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-type-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toRechargeTypeOutput`, `RechargeTypeOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [cancel-recharge-day.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-cancel-recharge-day-use-case-ts) | .ts | Caso de uso | Aplicación | "Anular Día" — a soft delete of the whole cycle (see `cancel_recharge_day`, SQL): never deletes `recharge_purchases`/ `recharge_sales`/`recharge_sales_closures`, only marks `recharge_day_openings.is_cancelled`. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [close-recharge-day.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts) | .ts | Caso de uso | Aplicación | "Cerrar Día" — the standalone action carrying no cuadre data of its own (see the day-lifecycle migration's own doc comment for why this is deliberately decoupled from "Guardar Cuadre", unlike Banks). | 9 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [create-recharge-sale.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-create-recharge-sale-use-case-ts) | .ts | Caso de uso | Aplicación | Records one customer's recharge against the CURRENT cuadre cycle for `operationDate` — type/amount/phone validation, resolving (or lazily creating) that cycle's row, and rejecting an already-closed day all happen atomically inside `register_recharge_sale()`; this use case only shapes the input/outpu | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [delete-recharge-sale.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-delete-recharge-sale-use-case-ts) | .ts | Caso de uso | Aplicación | Rejects (`RechargeSaleLockedError`) if the sale's cycle has already been closed — enforced atomically inside `delete_recharge_sale()`. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-recharge-daily-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-daily-summary-use-case-ts) | .ts | Caso de uso | Aplicación | "Al abrir el módulo" — defaults to today, computed server-side, but now accepts an explicit `date` so the frontend's operation-date picker can browse/backfill any past day. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-recharge-day-detail.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-detail-use-case-ts) | .ts | Caso de uso | Aplicación | "Ver Detalle" — composes reads from three repositories that already exist (day, cuadre cycles, audit trail), never duplicates them. | 6 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [get-recharge-day-status.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-status-use-case-ts) | .ts | Caso de uso | Aplicación | Combines two independent sources into a single response — never duplicates their logic: `RechargeDayOpeningRepository` (is it open? | 3 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [get-recharge-history.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-history-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetRechargeHistoryUseCase`, `GetRechargeHistoryInput`, `GetRechargeHistoryOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-recharge-operators-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-operators-summary-use-case-ts) | .ts | Caso de uso | Aplicación | Backs "Indicadores de Recargas Electrónicas" en Resumen — 4 gráficas de anillo (Ventas Tigo/Claro, Compras Tigo/Claro, Saldo Claro, Saldo Tigo). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-recharge-purchases.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-purchases-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the "Compras de Recargas" table — every purchase recorded under each type's CURRENT cycle for the given date, newest first, voided included (shown, never hidden). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-recharge-sales-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-summary-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetRechargeSalesSummaryUseCase`, `KNOWN_RECHARGE_TYPE_NAMES` (sin comentario de documentación en el código). | 7 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-recharge-sales.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the "Recargas Vendidas" table — every sale recorded under each type's CURRENT cycle for the given date, newest first. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-recharge-sim-daily-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-daily-summary-use-case-ts) | .ts | Caso de uso | Aplicación | Mirrors `GetRechargeDailySummaryUseCase` exactly, for stock instead of a cash balance: for each active SIM type, the row for the given date is fetched if it already exists, or lazily created (`ensure_recharge_sim_daily_stock`) with `previousStock` copied from the most recent prior day's `currentStock`. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-recharge-sim-sale-registration-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetRechargeSimSaleRegistrationByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-recharge-sim-sale-registration-dpi-image.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-dpi-image-use-case-ts) | .ts | Caso de uso | Aplicación | The ONE place the DPI photo's bytes are ever read — always behind `JwtAuthGuard` (see `RechargeSimsController`), never a public/static URL. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-recharges-daily-stats.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharges-daily-stats-use-case-ts) | .ts | Caso de uso | Aplicación | "Recargas del mes" — Gráficas → Indicadores de Recargas. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-recharges-weekly-stats.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharges-weekly-stats-use-case-ts) | .ts | Caso de uso | Aplicación | "Recargas por semana" — buckets de 7 días fijos desde el día 1 del mes actual, nunca semana ISO — mismo criterio exacto que las gráficas semanales de Ventas/Compras/Transacciones. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-recharges-yearly-stats.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharges-yearly-stats-use-case-ts) | .ts | Caso de uso | Aplicación | "Recargas por mes" — acumulativo, enero hasta el mes actual del año en curso, a diferencia de la gráfica diaria/semanal de este mismo módulo. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-closed-recharge-days.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-closed-recharge-days-use-case-ts) | .ts | Caso de uso | Aplicación | "Sistema → Gestión de Días de Recargas" — administrative listing, ADMIN/SUPER_ADMIN only (see the controller). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-recharge-sim-sale-registrations.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sale-registrations-use-case-ts) | .ts | Caso de uso | Aplicación | "Administrar Ventas de SIM" listing — same pagination shape as `ListPurchasesUseCase`. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-recharge-sim-sales.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sales-use-case-ts) | .ts | Caso de uso | Aplicación | Backs "Administrar Ventas de SIM (por cantidad)" — every by-quantity "Vender SIM" sale for the given date (identity-registration sales are excluded, see the repository's own doc comment), newest first, voided included (shown, never hidden). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-recharge-sim-types.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-types-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListRechargeSimTypesUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-recharge-types.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-types-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListRechargeTypesUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [open-recharge-day.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-open-recharge-day-use-case-ts) | .ts | Caso de uso | Aplicación | "Confirmar Apertura" — idempotent (`RechargeDayOpeningRepository.open` never creates a second row for an already-opened date), so a double click or a retry never fails or duplicates anything. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-recharge-final-balance.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-final-balance-use-case-ts) | .ts | Caso de uso | Aplicación | The negative/exceeds-daily validation lives inside `register_recharge_final_balance()` — this use case only owns one rule that genuinely belongs at the application layer instead: whether the caller is *allowed* to call it again on a day that's already closed. | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-recharge-purchase.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-purchase-use-case-ts) | .ts | Caso de uso | Aplicación | Registers against the caller's chosen operation date (the frontend's date picker, defaulting to today) rather than always assuming today — `assertValidOperationDate` is the only guard against backdating this into the future; genuine backdating into the past is the whole point of this follow-up ("catch up on a day I forgot to close"). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-recharge-sales-closure.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sales-closure-use-case-ts) | .ts | Caso de uso | Aplicación | Closes the CURRENT cuadre cycle for `operationDate` and — on a genuine first close — immediately starts a fresh one, carrying each type's just- closed `finalBalance` forward as the new cycle's `previousBalance` (`register_recharge_sales_closure`'s own job, not this use case's). | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-recharge-sim-purchase.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-purchase-use-case-ts) | .ts | Caso de uso | Aplicación | Registers a physical SIM purchase — stock entry only. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-recharge-sim-sale-with-registration.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts) | .ts | Caso de uso | Aplicación | "Venta de SIM con registro de identidad" — registers exactly ONE physical SIM (always `quantity=1` on the underlying `recharge_sim_sales` row) and its identity-capture record in a single database transaction, via `TransactionManager` (the same port built for Transaccionar's "Enviar a cuentas por cob | 8 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-recharge-sim-sale.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-use-case-ts) | .ts | Caso de uso | Aplicación | Registers a physical SIM sale — stock exit only, never touches the electronic balance side. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [reopen-recharge-day.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-reopen-recharge-day-use-case-ts) | .ts | Caso de uso | Aplicación | "Reabrir Día" — role validation (ADMIN/SUPER_ADMIN only) already happened in the controller's `RolesGuard`; the real status/cancellation/ later-day validation happens atomically inside `reopen_recharge_day` (SQL, under the row lock) — this use case only orchestrates and translates the result into the shape the frontend needs to refresh the row/detail without a second call. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-recharge-sale.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-sale-use-case-ts) | .ts | Caso de uso | Aplicación | Only `phoneNumber`/`amount` are editable — the recharge type is fixed at creation (see the migration's own comment on `update_recharge_sale`). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-recharge-type-balance-limit.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-balance-limit-use-case-ts) | .ts | Caso de uso | Aplicación | "Límite de saldo" per recharge type — the 100% reference point the Resumen dashboard's saldo gauge charts compare the current balance against. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-recharge-type-min-balance.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makeType` (sin comentario de documentación en el código). | 4 internas | 0 | Soporte (pruebas) |
| [update-recharge-type-min-balance.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-ts) | .ts | Caso de uso | Aplicación | "Saldo mínimo" per recharge type — the threshold the Alerts module reads for "saldo bajo de recargas". | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [void-recharge-purchase.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-purchase-use-case-ts) | .ts | Caso de uso | Aplicación | "Revertir compra" — the correction path for a mistaken recharge purchase (wrong operator, duplicate, wrong amount). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [void-recharge-sim-sale-registration.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-registration-use-case-ts) | .ts | Caso de uso | Aplicación | "Anular" — the only correction path for a mistaken SIM sale registration, same "nunca editar" rule as Purchases/Sales/Bank Deposits. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [void-recharge-sim-sale.use-case.ts](#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-use-case-ts) | .ts | Caso de uso | Aplicación | "Revertir" for the by-quantity "Vender SIM" flow — the correction path this flow never had before (see the migration's own doc comment). | 7 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [assert-recharge-day-writable.ts](#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-recharge-day-writable-ts) | .ts | Utilidad | Aplicación | The mandatory "Apertura del Día" sequencing only applies to TODAY's operating date — correcting a past date is pre-existing functionality this ticket was required to preserve unchanged (see Banks' `SaveBankBalancesUseCase`, which established this exact rule first for its own module). | 4 internas | 7 | Media (7 consumidores) |
| [assert-valid-dpi-image.ts](#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-dpi-image-ts) | .ts | Utilidad | Aplicación | Validated before ever opening the registration's transaction — a doomed upload should never take a DB transaction slot. | 1 internas | 1 | Baja (1 consumidores) |
| [assert-valid-operation-date.ts](#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts) | .ts | Utilidad | Aplicación | A recharge operation (purchase, saldo final via its own daily-balance id, sales closure) can legitimately be dated in the past — catching up on a day that wasn't closed out in time — but never further than one calendar day in the future. | 2 internas | 14 | Alta (14 consumidores) |
| [today-iso-date.ts](#f-comercial-jhoel-api-src-modules-recharges-application-utils-today-iso-date-ts) | .ts | Utilidad | Aplicación | Utilidad: declara `toIsoDate`, `todayIsoDate`, `maxAllowedOperationDate` (sin comentario de documentación en el código). | 0 internas | 11 | Alta (11 consumidores) |
| [recharge-daily-balance.entity.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-daily-balance-entity-ts) | .ts | Entidad de dominio | Dominio | One row per (recharge type, calendar day) — the day's running total for that operator. | 0 internas | 6 | Media (6 consumidores) |
| [recharge-day-audit-log.entity.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-day-audit-log-entity-ts) | .ts | Entidad de dominio | Dominio | One row per CYCLE transition of a Recargas day (opening, closing, reopening, cancellation) — not a generic field-change log, same scope as Banks' own `DayAuditLog`. | 0 internas | 4 | Media (4 consumidores) |
| [recharge-day-opening.entity.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-day-opening-entity-ts) | .ts | Entidad de dominio | Dominio | "The user confirmed they want to start registering recharge operations for this date" — a fully independent cycle from Banks' own `DayOpening` (see the migration's own doc comment for why the two modules can never share one table). | 0 internas | 3 | Media (3 consumidores) |
| [recharge-purchase.entity.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-purchase-entity-ts) | .ts | Entidad de dominio | Dominio | One individual recharge purchase — the counterpart to `RechargeSale` on the "bought from the operator" side. | 0 internas | 4 | Media (4 consumidores) |
| [recharge-sale.entity.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sale-entity-ts) | .ts | Entidad de dominio | Dominio | One individually-sold recharge (a customer's top-up) — the counterpart to `RechargeDailyBalance`'s purchase side. | 0 internas | 4 | Media (4 consumidores) |
| [recharge-sales-closure.entity.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sales-closure-entity-ts) | .ts | Entidad de dominio | Dominio | One row per calendar day — the daily cash reconciliation ("cuadre") across every recharge type. | 0 internas | 4 | Media (4 consumidores) |
| [recharge-sim-daily-stock.entity.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-daily-stock-entity-ts) | .ts | Entidad de dominio | Dominio | One row per (SIM type, calendar day) — mirrors `RechargeDailyBalance` but for physical stock instead of a cash balance: no `finalBalance`/`sequence` concept, since stock never "closes and resets" — `currentStock` is always the live, correct stock as of that day, and IS the "stock final" the cuadre shows (no separate confirmation step needed). | 0 internas | 4 | Media (4 consumidores) |
| [recharge-sim-sale-registration.entity.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-sale-registration-entity-ts) | .ts | Entidad de dominio | Dominio | One physical SIM sold with identity capture (número de SIM, SKU, DPI del comprador, foto) — a compliance record layered on top of one `quantity=1` row in the existing `recharge_sim_sales` table (see the migration's own doc comment for why this is additive, not a replacement). | 0 internas | 4 | Media (4 consumidores) |
| [recharge-sim-sale.entity.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-sale-entity-ts) | .ts | Entidad de dominio | Dominio | One by-quantity "Vender SIM" sale (no identity capture) — the original, still-in-use quick-sale flow this module started with. | 0 internas | 4 | Media (4 consumidores) |
| [recharge-sim-type.entity.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-type-entity-ts) | .ts | Entidad de dominio | Dominio | SIM Claro / SIM Tigo — a 2-row lookup, mirrors `RechargeType` exactly. | 0 internas | 4 | Media (4 consumidores) |
| [recharge-type.entity.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-type-entity-ts) | .ts | Entidad de dominio | Dominio | Claro/Tigo today — a normalized lookup row, not a hardcoded string, so a future operator is a new seeded row rather than a code change. | 0 internas | 7 | Media (7 consumidores) |
| [client-dpi-required.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-client-dpi-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `ClientDpiRequiredError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [daily-balance-not-found.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-daily-balance-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `DailyBalanceNotFoundError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [day-already-closed.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-day-already-closed-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `DayAlreadyClosedError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [final-balance-edit-forbidden.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-final-balance-edit-forbidden-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `FinalBalanceEditForbiddenError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [final-balance-exceeds-daily.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-final-balance-exceeds-daily-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `FinalBalanceExceedsDailyError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [insufficient-balance-to-revert.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-insufficient-balance-to-revert-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InsufficientBalanceToRevertError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [insufficient-sim-stock.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-insufficient-sim-stock-error-ts) | .ts | Errores de dominio | Dominio | Enforced in `register_recharge_sim_sale()` under a `FOR UPDATE` row lock — never trusts the frontend's own stock check. | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-balance-limit.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-balance-limit-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidBalanceLimitError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-dpi-image.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-dpi-image-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidDpiImageError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-final-balance.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-final-balance-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidFinalBalanceError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-min-balance.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-min-balance-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidMinBalanceError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-phone-number.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-phone-number-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidPhoneNumberError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-recharge-amount.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-recharge-amount-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidRechargeAmountError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-recharge-date-range.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-recharge-date-range-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidRechargeDateRangeError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [invalid-recharge-date.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-recharge-date-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidRechargeDateError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-sim-quantity.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-sim-quantity-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidSimQuantityError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-sim-sale-client.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-sim-sale-client-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidSimSaleClientError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-sim-sale-price.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-sim-sale-price-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidSimSalePriceError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-total-collected.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-total-collected-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidTotalCollectedError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [pending-type-closure.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-pending-type-closure-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PendingTypeClosureError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [recharge-day-already-closed.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-already-closed-error-ts) | .ts | Errores de dominio | Dominio | "This Recargas day is already closed and can't accept new operations" — covers every write this module's day-lifecycle gates once `recharge_day_openings.closed_at` is no longer null: registering a purchase, a sale (including editing/deleting an existing one), a saldo final, or a new cuadre for that date. | 1 internas | 8 | Media (8 consumidores) |
| [recharge-day-cancelled.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-cancelled-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RechargeDayCancelledError`, `RechargeDayAlreadyCancelledError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [recharge-day-not-closed.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-closed-error-ts) | .ts | Errores de dominio | Dominio | Reopening or cancelling only makes sense for a Recargas day that's actually CLOSED. | 1 internas | 1 | Baja (1 consumidores) |
| [recharge-day-not-found.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RechargeDayNotFoundError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [recharge-day-not-opened.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-opened-error-ts) | .ts | Errores de dominio | Dominio | "The user must not be able to freely register recharge operations until the day has been opened" — mirrors Banks' own `DayNotOpenedError` reasoning. | 1 internas | 3 | Media (3 consumidores) |
| [recharge-day-not-ready-to-close.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-ready-to-close-error-ts) | .ts | Errores de dominio | Dominio | "Cerrar Día" (see `CloseRechargeDayUseCase`/`close_recharge_day`) is a standalone action carrying no cuadre data of its own, deliberately decoupled from "Guardar Cuadre" so this module's existing multi-cycle- per-day cuadre feature keeps working unchanged. | 1 internas | 2 | Baja (2 consumidores) |
| [recharge-day-reason-required.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-reason-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RechargeReopenReasonRequiredError`, `RechargeCancelReasonRequiredError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [recharge-later-day-exists.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-later-day-exists-error-ts) | .ts | Errores de dominio | Dominio | The later-day integrity rule (same Option A already chosen for Banks' own equivalent rule — reject rather than cascade-recalculate): a Recargas date is never reopened/cancelled if a strictly later date has a non-cancelled CLOSED/REOPENED cycle. | 1 internas | 1 | Baja (1 consumidores) |
| [recharge-purchase-already-voided.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-already-voided-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RechargePurchaseAlreadyVoidedError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [recharge-purchase-cycle-closed.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-cycle-closed-error-ts) | .ts | Errores de dominio | Dominio | Thrown when a purchase's own cuadre cycle already has a `final_balance` — no existing mechanism un-closes an already-closed cycle (verified directly: `reopen_recharge_day()` only clears `recharge_day_openings .closed_at`, never a cycle's `final_balance`), so this is a hard, permanent block, never bypassable, not even by an admin. | 1 internas | 1 | Baja (1 consumidores) |
| [recharge-purchase-day-closed.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-day-closed-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RechargePurchaseDayClosedError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [recharge-purchase-not-found.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RechargePurchaseNotFoundError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [recharge-sale-locked.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-sale-locked-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RechargeSaleLockedError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [recharge-sale-not-found.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-sale-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RechargeSaleNotFoundError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [recharge-sim-sale-not-found.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-sim-sale-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RechargeSimSaleNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [recharge-type-inactive.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-type-inactive-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RechargeTypeInactiveError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [recharge-type-not-found.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-type-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RechargeTypeNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [sales-closure-edit-forbidden.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sales-closure-edit-forbidden-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SalesClosureEditForbiddenError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [sim-number-required.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-number-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SimNumberRequiredError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [sim-sale-already-voided.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-already-voided-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SimSaleAlreadyVoidedError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [sim-sale-day-closed.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-day-closed-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SimSaleDayClosedError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [sim-sale-has-registration.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-has-registration-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SimSaleHasRegistrationError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [sim-sale-registration-already-voided.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-already-voided-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SimSaleRegistrationAlreadyVoidedError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [sim-sale-registration-not-found.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SimSaleRegistrationNotFoundError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [sim-sale-registration-void-reason-required.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-void-reason-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SimSaleRegistrationVoidReasonRequiredError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [sim-sale-sku-required.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-sku-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SimSaleSkuRequiredError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [sim-sale-void-reason-required.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-void-reason-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SimSaleVoidReasonRequiredError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [sim-type-inactive.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-type-inactive-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SimTypeInactiveError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [sim-type-not-found.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-type-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SimTypeNotFoundError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [void-reason-required.error.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-errors-void-reason-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `VoidReasonRequiredError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [recharge-daily-balance.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RegisterRechargePurchaseData`, `RegisterRechargeFinalBalanceData`, `FindRechargeHistoryOptions`, `PaginatedResult`, `FindRechargeReportSummaryOptions` (sin comentario de documentación en el código). | 1 internas | 15 | Alta (15 consumidores) |
| [recharge-day-audit-log.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-audit-log-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateRechargeDayAuditLogData`, `RechargeDayAuditLogRepository`, `RECHARGE_DAY_AUDIT_LOG_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [recharge-day-opening.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RechargeClosedDaysFilters`, `RechargeClosedDayViewRow`, `RechargeDayOpeningRepository`, `RechargeClosedDayStatus`, `RechargeResultSign` (sin comentario de documentación en el código). | 1 internas | 22 | Alta (22 consumidores) |
| [recharge-purchase.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-purchase-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RechargePurchaseRepository`, `RECHARGE_PURCHASE_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [recharge-sale.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sale-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateRechargeSaleData`, `UpdateRechargeSaleData`, `RechargeTypeSalesTotal`, `RechargeSaleRepository`, `RECHARGE_SALE_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 7 | Media (7 consumidores) |
| [recharge-sales-closure.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sales-closure-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RegisterRechargeSalesClosureData`, `RechargeSalesClosureRepository`, `RECHARGE_SALES_CLOSURE_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 7 | Media (7 consumidores) |
| [recharge-sim-daily-stock.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-daily-stock-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RegisterRechargeSimSaleUnitData`, `RegisterRechargeSimPurchaseData`, `RegisterRechargeSimSaleData`, `RechargeSimDailyStockRepository`, `RECHARGE_SIM_DAILY_STOCK_REPOSITORY` (sin comentario de documentación en el código). | 2 internas | 6 | Media (6 consumidores) |
| [recharge-sim-sale-registration.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-registration-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RegisterRechargeSimSaleRegistrationData`, `ListRechargeSimSaleRegistrationsFilters`, `ListRechargeSimSaleRegistrationsResult`, `DpiImage`, `RechargeSimSaleRegistrationRepository` (sin comentario de documentación en el código). | 2 internas | 8 | Media (8 consumidores) |
| [recharge-sim-sale.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RechargeSimSaleRepository`, `RECHARGE_SIM_SALE_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [recharge-sim-type.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-type-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RechargeSimTypeRepository`, `RECHARGE_SIM_TYPE_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [recharge-type.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-type-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RechargeTypeRepository`, `RECHARGE_TYPE_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 11 | Alta (11 consumidores) |
| [recharge-daily-balance.mapper.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `RechargeDailyBalanceMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [recharge-daily-balance.orm-entity.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `RechargeDailyBalanceOrmEntity` (sin comentario de documentación en el código). | 3 internas; ext.: typeorm | 7 | Media (7 consumidores) |
| [recharge-day-audit-log.mapper.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-audit-log-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `RechargeDayAuditLogMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [recharge-day-audit-log.orm-entity.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-audit-log-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `RechargeDayAuditLogOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [recharge-day-opening.mapper.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-opening-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `RechargeDayOpeningMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [recharge-day-opening.orm-entity.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-opening-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `RechargeDayOpeningOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [recharge-purchase-full.orm-entity.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-purchase-full-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Full mapping of `recharge_purchases` — used for the "Compras de Recargas" list/revert feature (`RechargePurchaseRepository`). | 4 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [recharge-purchase.mapper.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-purchase-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `RechargePurchaseMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [recharge-sale.mapper.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `RechargeSaleMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [recharge-sale.orm-entity.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `RechargeSaleOrmEntity` (sin comentario de documentación en el código). | 4 internas; ext.: typeorm | 5 | Media (5 consumidores) |
| [recharge-sales-closure.mapper.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sales-closure-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `RechargeSalesClosureMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [recharge-sales-closure.orm-entity.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sales-closure-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `RechargeSalesClosureOrmEntity` (sin comentario de documentación en el código). | 2 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [recharge-sim-daily-stock.mapper.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-daily-stock-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `RechargeSimDailyStockMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [recharge-sim-daily-stock.orm-entity.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-daily-stock-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `RechargeSimDailyStockOrmEntity` (sin comentario de documentación en el código). | 2 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [recharge-sim-sale-registration.mapper.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-sale-registration-mapper-ts) | .ts | Mapper | Infraestructura | Shape of one row from the hand-written JOIN query in `TypeOrmRechargeSimSaleRegistrationRepository` — no TypeORM entity exists for this table (same "raw SQL, no ORM entity" precedent already established for `recharge_sim_sales`/`recharge_sim_purchases` themselves), so this mapper works off a plain joined row instead of an `*.orm-entity.ts`. | 1 internas | 1 | Baja (1 consumidores) |
| [recharge-sim-sale.mapper.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-sale-mapper-ts) | .ts | Mapper | Infraestructura | Shape of one row from `TypeOrmRechargeSimSaleRepository`'s own JOIN query — no TypeORM entity exists for `recharge_sim_sales` (same "raw SQL, no ORM entity" precedent already established for this table's own write functions), so this mapper works off a plain joined row instead of an `*.orm-entity.ts`. | 1 internas | 1 | Baja (1 consumidores) |
| [recharge-sim-type.mapper.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-type-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `RechargeSimTypeMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [recharge-sim-type.orm-entity.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-type-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `RechargeSimTypeOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [recharge-type.mapper.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `RechargeTypeMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [recharge-type.orm-entity.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `RechargeTypeOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 6 | Media (6 consumidores) |
| [typeorm-recharge-daily-balance.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmRechargeDailyBalanceRepository` (sin comentario de documentación en el código). | 12 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-recharge-day-audit-log.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-audit-log-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmRechargeDayAuditLogRepository` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-recharge-day-opening.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmRechargeDayOpeningRepository` (sin comentario de documentación en el código). | 12 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-recharge-purchase.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-purchase-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmRechargePurchaseRepository`, `CURRENT_CYCLE_IDS_SUBQUERY` (sin comentario de documentación en el código). | 10 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-recharge-sale.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmRechargeSaleRepository`, `CURRENT_CYCLE_IDS_SUBQUERY` (sin comentario de documentación en el código). | 12 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-recharge-sales-closure.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sales-closure-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmRechargeSalesClosureRepository` (sin comentario de documentación en el código). | 8 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-recharge-sim-daily-stock.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-daily-stock-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmRechargeSimDailyStockRepository`, `MovementTotals`, `EMPTY_MOVEMENTS` (sin comentario de documentación en el código). | 10 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-recharge-sim-sale-registration.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmRechargeSimSaleRegistrationRepository`, `SELECT_COLUMNS`, `FROM_JOINS` (sin comentario de documentación en el código). | 14 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-recharge-sim-sale.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmRechargeSimSaleRepository`, `SELECT_COLUMNS`, `FROM_JOINS` (sin comentario de documentación en el código). | 8 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-recharge-sim-type.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-type-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmRechargeSimTypeRepository` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-recharge-type.repository.ts](#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-type-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmRechargeTypeRepository` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [recharge-days.controller.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts) | .ts | Controlador | Presentación | "Sistema → Gestión de Días de Recargas" — the Recargas-specific counterpart to Banks' "Gestión de Días Cerrados" (`ClosedDaysController`), fully independent from it: separate table, separate stored functions, separate route. | 12 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [recharge-sims.controller.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts) | .ts | Controlador | Presentación | SIM Claro/SIM Tigo — physical, stock-tracked products administered EXCLUSIVELY from Recargas Electrónicas (see the migration's own doc comment for why they're not part of `modules/products/`). | 28 internas; ext.: @nestjs/common, @nestjs/platform-express, express | 1 | Media (controlador) |
| [recharges.controller.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts) | .ts | Controlador | Presentación | No `@Roles(...)` at the class level — same "operational, any authenticated account" policy as Sales/Purchases: registering a purchase or closing a day's balance for the first time is a daily register task, not an admin-only one. | 53 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [close-recharge-day.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-close-recharge-day-request-dto-ts) | .ts | DTO de entrada | Presentación | Omitted = today, resolved in the controller. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [create-recharge-sale.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-create-recharge-sale-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateRechargeSaleRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-recharge-closed-days.query.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-list-recharge-closed-days-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListRechargeClosedDaysQueryDto`, `STATUSES`, `RESULT_SIGNS` (sin comentario de documentación en el código). | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-recharge-sim-sale-registrations.query.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-list-recharge-sim-sale-registrations-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListRechargeSimSaleRegistrationsQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [open-recharge-day.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-open-recharge-day-request-dto-ts) | .ts | DTO de entrada | Presentación | Omitted = today, resolved in the controller. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [recharge-daily.query.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-daily-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `RechargeDailyQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [recharge-day-action-reason.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-day-action-reason-request-dto-ts) | .ts | DTO de entrada | Presentación | Shared by "Reabrir Día" and "Anular Día" — both require a mandatory, non-empty reason. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [recharge-day-status.query.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-day-status-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `RechargeDayStatusQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [recharge-history.query.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-history-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `RechargeHistoryQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [recharge-operators-summary.response.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-operators-summary-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `RechargeOperatorStatDto`, `RechargeOperatorsSummaryResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [recharge-purchases.query.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-purchases-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `RechargePurchasesQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [recharge-sales-summary.query.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-sales-summary-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `RechargeSalesSummaryQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [recharge-sales.query.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-sales-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `RechargeSalesQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [recharge-sim-daily.query.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-sim-daily-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `RechargeSimDailyQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [recharge-sim-sale-registration.response.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-sim-sale-registration-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `RechargeSimSaleRegistrationResponseDto`, `PaginatedRechargeSimSaleRegistrationsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [recharge-sim-sales.query.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-sim-sales-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `RechargeSimSalesQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [recharges-daily-stats.response.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharges-daily-stats-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `RechargesDailyStatDto`, `RechargesDailyStatsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [recharges-weekly-stats.response.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharges-weekly-stats-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `RechargesWeeklyStatDto`, `RechargesWeeklyStatsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [recharges-yearly-stats.response.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharges-yearly-stats-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `RechargesMonthlyStatDto`, `RechargesYearlyStatsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [register-recharge-final-balance.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-register-recharge-final-balance-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `RegisterRechargeFinalBalanceRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [register-recharge-purchase.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-register-recharge-purchase-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `RegisterRechargePurchaseRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [register-recharge-sales-closure.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-register-recharge-sales-closure-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `RegisterRechargeSalesClosureRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [register-recharge-sim-purchase.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-register-recharge-sim-purchase-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `RegisterRechargeSimPurchaseRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [register-recharge-sim-sale-registration.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-register-recharge-sim-sale-registration-request-dto-ts) | .ts | DTO de entrada | Presentación | `multipart/form-data` body (the DPI photo travels alongside as the `dpiImage` file field, read via `@UploadedFile()` — see `RechargeSimsController.registerSaleRegistration`) — every text field arrives as a string regardless of its logical type, hence `@Type(() =&gt; Number)` on `salePrice`, same pattern `ListPurchasesQueryDto` already uses for its own multipart-adjacent numeric query params. | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [register-recharge-sim-sale.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-register-recharge-sim-sale-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `RegisterRechargeSimSaleRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [update-recharge-sale.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-update-recharge-sale-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateRechargeSaleRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [update-recharge-type-balance-limit.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-update-recharge-type-balance-limit-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateRechargeTypeBalanceLimitRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [update-recharge-type-min-balance.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-update-recharge-type-min-balance-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateRechargeTypeMinBalanceRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [void-recharge-purchase.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-void-recharge-purchase-request-dto-ts) | .ts | DTO de entrada | Presentación | Same mandatory-reason shape as `VoidCashBoxMovementRequestDto`/`VoidBankDepositOperationRequestDto` — kept as this module's own copy rather than a cross-module import. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [void-recharge-sim-sale-registration.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-void-recharge-sim-sale-registration-request-dto-ts) | .ts | DTO de entrada | Presentación | Same mandatory-reason shape as `VoidPurchaseRequestDto`/`VoidRechargePurchaseRequestDto` — kept as this module's own copy rather than a cross-module import. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [void-recharge-sim-sale.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-void-recharge-sim-sale-request-dto-ts) | .ts | DTO de entrada | Presentación | Same mandatory-reason shape as `VoidRechargePurchaseRequestDto`/`VoidRechargeSimSaleRegistrationRequestDto` — kept as this module's own copy rather than a cross-module import. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [recharges.module.ts](#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `RechargesModule` (sin comentario de documentación en el código). | 72 internas; ext.: @nestjs/common, @nestjs/typeorm | 3 | Media (3 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-closed-day-output-ts"></a>

### recharge-closed-day-output.ts

- **Ruta:** [recharge-closed-day-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-closed-day-output.ts) (`comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-closed-day-output.ts`, 30 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de salida (aplicación): declara `toRechargeClosedDayOutput`, `RechargeClosedDayOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts)
- **Consumidores:** [list-closed-recharge-days.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-closed-recharge-days-use-case-ts), [recharge-days.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts)

**Interfaces, tipos y enums:**

- `interface RechargeClosedDayOutput` (L6): sin documentación — miembros: `date`, `status`, `openedAt`, `openedByUsername`, `closedAt`, `closedByUsername`, `reopenedAt`, `reopenedByUsername`, `reopenReason`, `cancelledAt`, `cancelledByUsername`, `cancelReason`, `totalSales`, `totalCollected`, `result`, `cycleCount`
#### Función `toRechargeClosedDayOutput` (L25–29)

- **Tipo:** función exportada
- **Firma:** `toRechargeClosedDayOutput(row: RechargeClosedDayViewRow): RechargeClosedDayOutput` — [recharge-closed-day-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-closed-day-output.ts#L25)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-daily-balance-output-ts"></a>

### recharge-daily-balance-output.ts

- **Ruta:** [recharge-daily-balance-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-daily-balance-output.ts) (`comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-daily-balance-output.ts`, 39 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de salida (aplicación): declara `toRechargeDailyBalanceOutput`, `RechargeDailyBalanceOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-daily-balance.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-daily-balance-entity-ts)
- **Consumidores:** [get-recharge-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-daily-summary-use-case-ts), [get-recharge-history.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-history-use-case-ts), [register-recharge-final-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-final-balance-use-case-ts), [register-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-purchase-use-case-ts), [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

**Interfaces, tipos y enums:**

- `interface RechargeDailyBalanceOutput` (L3): sin documentación — miembros: `id`, `rechargeTypeId`, `rechargeTypeName`, `date`, `previousBalance`, `totalPurchases`, `totalPurchaseAmount`, `dailyBalance`, `finalBalance`, `sale`, `createdByUsername`, `updatedByUsername`
#### Función `toRechargeDailyBalanceOutput` (L21–38)

- **Tipo:** función exportada
- **Firma:** `toRechargeDailyBalanceOutput(balance: RechargeDailyBalance): RechargeDailyBalanceOutput` — [recharge-daily-balance-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-daily-balance-output.ts#L21)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [register-recharge-final-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-final-balance-use-case-ts), [register-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-purchase-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-detail-output-ts"></a>

### recharge-day-detail-output.ts

- **Ruta:** [recharge-day-detail-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-day-detail-output.ts) (`comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-day-detail-output.ts`, 40 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de salida (aplicación): declara `RechargeDayAuditLogOutput`, `RechargeDayDetailOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [recharge-day-audit-log.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-day-audit-log-entity-ts), [recharge-sales-closure-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sales-closure-output-ts)
- **Consumidores:** [cancel-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-cancel-recharge-day-use-case-ts), [get-recharge-day-detail.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-detail-use-case-ts), [reopen-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-reopen-recharge-day-use-case-ts), [recharge-days.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts)

**Interfaces, tipos y enums:**

- `interface RechargeDayAuditLogOutput` (L5): sin documentación — miembros: `id`, `action`, `performedByUsername`, `performedAt`, `reason`, `previousStatus`, `newStatus`
- `interface RechargeDayDetailOutput` (L23): "Ver Detalle" of a closed Recargas day — composes reads that already exist in other use cases/repositories, never duplicates them. — miembros: `date`, `status`, `openedAt`, `openedByUsername`, `closedAt`, `closedByUsername`, `reopenedAt`, `reopenedByUsername`, `reopenReason`, `isCancelled`, `cancelledAt`, `cancelledByUsername`, `cancelReason`, `closures`, `auditLog`
<a id="f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-status-output-ts"></a>

### recharge-day-status-output.ts

- **Ruta:** [recharge-day-status-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-day-status-output.ts) (`comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-day-status-output.ts`, 35 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** The conceptual state of a Recargas date's "working cycle" — five values, always derived from the same independent facts (is there a `recharge_day_openings` row?
- **Descripción del autor (comentario del archivo):** The conceptual state of a Recargas date's "working cycle" — five values, always derived from the same independent facts (is there a `recharge_day_openings` row? is it closed? is it cancelled?), never stored separately. Deliberately simpler than Banks' own seven-state `DayWorkStatus`: Recargas never gates operations/ventas/cuadre behind a nested "balances saved" pre-state the way Banks gates Cuadre Agentes behind bank balances — the only two facts that actually gate anything here are "is it open" and "is it closed". - `NOT_OPENED`: no `recharge_day_openings` row exists for this date. - `OPENED`
- **Consumidores:** [close-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts), [get-recharge-day-status.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-status-use-case-ts), [open-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-open-recharge-day-use-case-ts), [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

**Interfaces, tipos y enums:**

- `interface RechargeDayStatusOutput` (L24): sin documentación — miembros: `date`, `status`, `isOpened`, `isClosed`, `isCancelled`, `hasSavedCuadreToday`, `canCloseDay`
- `type RechargeDayWorkStatus` (L21) = `'NOT_OPENED' \| 'OPENED' \| 'REOPENED' \| 'CLOSED' \| 'CANCELLED'` — The conceptual state of a Recargas date's "working cycle" — five values, always derived from the same independent facts (is there a `recharge_day_openings` row?
<a id="f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-purchase-output-ts"></a>

### recharge-purchase-output.ts

- **Ruta:** [recharge-purchase-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-purchase-output.ts) (`comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-purchase-output.ts`, 39 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de salida (aplicación): declara `toRechargePurchaseOutput`, `RechargePurchaseOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-purchase.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-purchase-entity-ts)
- **Consumidores:** [get-recharge-purchases.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-purchases-use-case-ts), [void-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-purchase-use-case-ts), [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

**Interfaces, tipos y enums:**

- `interface RechargePurchaseOutput` (L3): sin documentación — miembros: `id`, `rechargeTypeId`, `rechargeTypeName`, `amount`, `creditedAmount`, `date`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`, `canRevert`, `createdByUsername`
#### Función `toRechargePurchaseOutput` (L21–38)

- **Tipo:** función exportada
- **Firma:** `toRechargePurchaseOutput(purchase: RechargePurchase): RechargePurchaseOutput` — [recharge-purchase-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-purchase-output.ts#L21)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [void-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-purchase-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sale-output-ts"></a>

### recharge-sale-output.ts

- **Ruta:** [recharge-sale-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sale-output.ts) (`comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sale-output.ts`, 29 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de salida (aplicación): declara `toRechargeSaleOutput`, `RechargeSaleOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sale.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sale-entity-ts)
- **Consumidores:** [create-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-create-recharge-sale-use-case-ts), [get-recharge-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-use-case-ts), [update-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-sale-use-case-ts), [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSaleOutput` (L3): sin documentación — miembros: `id`, `rechargeTypeId`, `rechargeTypeName`, `phoneNumber`, `amount`, `date`, `locked`, `createdByUsername`, `updatedByUsername`
#### Función `toRechargeSaleOutput` (L16–28)

- **Tipo:** función exportada
- **Firma:** `toRechargeSaleOutput(sale: RechargeSale): RechargeSaleOutput` — [recharge-sale-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sale-output.ts#L16)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-create-recharge-sale-use-case-ts), [update-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-sale-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sales-closure-output-ts"></a>

### recharge-sales-closure-output.ts

- **Ruta:** [recharge-sales-closure-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sales-closure-output.ts) (`comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sales-closure-output.ts`, 32 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Individual cuadre-cycle output — never exposed standalone before this ticket (only merged into `RechargeSalesSummaryOutput`'s single "current cycle" shape).
- **Depende de (archivos del proyecto):** [recharge-sales-closure.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sales-closure-entity-ts)
- **Consumidores:** [recharge-day-detail-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-detail-output-ts), [get-recharge-day-detail.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-detail-use-case-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSalesClosureOutput` (L9): Individual cuadre-cycle output — never exposed standalone before this ticket (only merged into `RechargeSalesSummaryOutput`'s single "current cycle" shape). — miembros: `id`, `sequence`, `totalSales`, `totalCollected`, `result`, `createdByUsername`, `createdAt`
#### Función `toRechargeSalesClosureOutput` (L19–31)

- **Tipo:** función exportada
- **Firma:** `toRechargeSalesClosureOutput(closure: RechargeSalesClosure): RechargeSalesClosureOutput` — [recharge-sales-closure-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sales-closure-output.ts#L19)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sales-summary-output-ts"></a>

### recharge-sales-summary-output.ts

- **Ruta:** [recharge-sales-summary-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sales-summary-output.ts) (`comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sales-summary-output.ts`, 17 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de salida (aplicación): declara `RechargeSalesSummaryOutput` (sin comentario de documentación en el código).
- **Consumidores:** [get-recharge-sales-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-summary-use-case-ts), [register-recharge-sales-closure.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sales-closure-use-case-ts), [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSalesSummaryOutput` (L1): sin documentación — miembros: `date`, `totalClaro`, `totalTigo`, `totalSales`, `totalSimSales`, `totalRecaudado`, `totalCollected`, `difference`, `savedClosure`
<a id="f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-daily-stock-output-ts"></a>

### recharge-sim-daily-stock-output.ts

- **Ruta:** [recharge-sim-daily-stock-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sim-daily-stock-output.ts) (`comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sim-daily-stock-output.ts`, 36 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de salida (aplicación): declara `toRechargeSimDailyStockOutput`, `RechargeSimDailyStockOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sim-daily-stock.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-daily-stock-entity-ts)
- **Consumidores:** [get-recharge-sim-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-daily-summary-use-case-ts), [register-recharge-sim-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-purchase-use-case-ts), [register-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-use-case-ts), [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSimDailyStockOutput` (L3): sin documentación — miembros: `id`, `simTypeId`, `simTypeName`, `date`, `previousStock`, `purchasedQuantity`, `purchasedTotal`, `soldQuantity`, `soldTotal`, `currentStock`, `createdByUsername`, `updatedByUsername`
#### Función `toRechargeSimDailyStockOutput` (L18–35)

- **Tipo:** función exportada
- **Firma:** `toRechargeSimDailyStockOutput(stock: RechargeSimDailyStock): RechargeSimDailyStockOutput` — [recharge-sim-daily-stock-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sim-daily-stock-output.ts#L18)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [register-recharge-sim-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-purchase-use-case-ts), [register-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-sale-output-ts"></a>

### recharge-sim-sale-output.ts

- **Ruta:** [recharge-sim-sale-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sim-sale-output.ts) (`comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sim-sale-output.ts`, 42 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de salida (aplicación): declara `toRechargeSimSaleOutput`, `RechargeSimSaleOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sim-sale.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-sale-entity-ts)
- **Consumidores:** [list-recharge-sim-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sales-use-case-ts), [void-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-use-case-ts), [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSimSaleOutput` (L3): sin documentación — miembros: `id`, `simTypeId`, `simTypeName`, `quantity`, `unitPrice`, `totalAmount`, `saleDate`, `hasActiveRegistration`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`, `canRevert`, `createdByUsername`
#### Función `toRechargeSimSaleOutput` (L21–41)

- **Tipo:** función exportada
- **Firma:** `toRechargeSimSaleOutput(sale: RechargeSimSale, dayClosed: boolean): RechargeSimSaleOutput` — [recharge-sim-sale-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sim-sale-output.ts#L21)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [list-recharge-sim-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sales-use-case-ts), [void-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-sale-registration-output-ts"></a>

### recharge-sim-sale-registration-output.ts

- **Ruta:** [recharge-sim-sale-registration-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sim-sale-registration-output.ts) (`comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sim-sale-registration-output.ts`, 59 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de salida (aplicación): declara `toRechargeSimSaleRegistrationOutput`, `RechargeSimSaleRegistrationOutput`, `PaginatedRechargeSimSaleRegistrationsOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sim-sale-registration.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-sale-registration-entity-ts)
- **Consumidores:** [get-recharge-sim-sale-registration-by-id.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-by-id-use-case-ts), [list-recharge-sim-sale-registrations.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sale-registrations-use-case-ts), [register-recharge-sim-sale-with-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts), [void-recharge-sim-sale-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-registration-use-case-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSimSaleRegistrationOutput` (L3): sin documentación — miembros: `id`, `rechargeSimSaleId`, `simTypeId`, `simTypeName`, `simNumber`, `sku`, `clientDpi`, `clientId`, `clientName`, `salePrice`, `saleDate`, `hasDpiImage`, `isVoided`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `createdBy`, `createdByUsername`, `createdAt`
- `interface PaginatedRechargeSimSaleRegistrationsOutput` (L53): sin documentación — miembros: `items`, `total`, `page`, `limit`
#### Función `toRechargeSimSaleRegistrationOutput` (L26–51)

- **Tipo:** función exportada
- **Firma:** `toRechargeSimSaleRegistrationOutput(registration: RechargeSimSaleRegistration): RechargeSimSaleRegistrationOutput` — [recharge-sim-sale-registration-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sim-sale-registration-output.ts#L26)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `registration.voidedAt.toISOString`, `registration.createdAt.toISOString`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-recharge-sim-sale-registration-by-id.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-by-id-use-case-ts), [register-recharge-sim-sale-with-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts), [void-recharge-sim-sale-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-registration-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-type-output-ts"></a>

### recharge-sim-type-output.ts

- **Ruta:** [recharge-sim-type-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sim-type-output.ts) (`comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sim-type-output.ts`, 22 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de salida (aplicación): declara `toRechargeSimTypeOutput`, `RechargeSimTypeOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sim-type.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-type-entity-ts)
- **Consumidores:** [list-recharge-sim-types.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-types-use-case-ts), [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSimTypeOutput` (L3): sin documentación — miembros: `id`, `name`, `costPrice`, `publicPrice`, `isActive`
#### Función `toRechargeSimTypeOutput` (L11–21)

- **Tipo:** función exportada
- **Firma:** `toRechargeSimTypeOutput(type: RechargeSimType): RechargeSimTypeOutput` — [recharge-sim-type-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-sim-type-output.ts#L11)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-type-output-ts"></a>

### recharge-type-output.ts

- **Ruta:** [recharge-type-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-type-output.ts) (`comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-type-output.ts`, 20 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de salida (aplicación): declara `toRechargeTypeOutput`, `RechargeTypeOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-type.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-type-entity-ts)
- **Consumidores:** [list-recharge-types.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-types-use-case-ts), [update-recharge-type-balance-limit.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-balance-limit-use-case-ts), [update-recharge-type-min-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-ts), [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

**Interfaces, tipos y enums:**

- `interface RechargeTypeOutput` (L3): sin documentación — miembros: `id`, `name`, `isActive`, `minBalance`, `balanceLimit`
#### Función `toRechargeTypeOutput` (L11–19)

- **Tipo:** función exportada
- **Firma:** `toRechargeTypeOutput(type: RechargeType): RechargeTypeOutput` — [recharge-type-output.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/dtos/recharge-type-output.ts#L11)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [update-recharge-type-balance-limit.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-balance-limit-use-case-ts), [update-recharge-type-min-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-cancel-recharge-day-use-case-ts"></a>

### cancel-recharge-day.use-case.ts

- **Ruta:** [cancel-recharge-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/cancel-recharge-day.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/cancel-recharge-day.use-case.ts`, 42 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Anular Día" — a soft delete of the whole cycle (see `cancel_recharge_day`, SQL): never deletes `recharge_purchases`/ `recharge_sales`/`recharge_sales_closures`, only marks `recharge_day_openings.is_cancelled`.
- **Depende de (archivos del proyecto):** [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [recharge-day-reason-required.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-reason-required-error-ts), [get-recharge-day-detail.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-detail-use-case-ts), [recharge-day-detail-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-detail-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-days.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface CancelRechargeDayInput` (L8): sin documentación — miembros: `date`, `userId`, `reason`

#### Clase `CancelRechargeDayUseCase` (L22–41)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Anular Día" — a soft delete of the whole cycle (see `cancel_recharge_day`, SQL): never deletes `recharge_purchases`/ `recharge_sales`/`recharge_sales_closures`, only marks `recharge_day_openings.is_cancelled`. Same division of responsibility as `ReopenRechargeDayUseCase`: role already filtered by the guard, real integrity validated atomically in the SQL function.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`, `getRechargeDayDetailUseCase: GetRechargeDayDetailUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–40 | `input: CancelRechargeDayInput` | `Promise<RechargeDayDetailOutput>` |

##### `CancelRechargeDayUseCase.execute`

- **Firma:** `execute(input: CancelRechargeDayInput): Promise<RechargeDayDetailOutput>` — [cancel-recharge-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/cancel-recharge-day.use-case.ts#L30) (L30–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.reason?.trim`, `new RechargeCancelReasonRequiredError`, `this.dayOpeningRepository.cancel`, `this.getRechargeDayDetailUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new RechargeCancelReasonRequiredError()`
- **Consumidores:** [recharge-days.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts"></a>

### close-recharge-day.use-case.ts

- **Ruta:** [close-recharge-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/close-recharge-day.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/close-recharge-day.use-case.ts`, 65 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Cerrar Día" — the standalone action carrying no cuadre data of its own (see the day-lifecycle migration's own doc comment for why this is deliberately decoupled from "Guardar Cuadre", unlike Banks).
- **Depende de (archivos del proyecto):** [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sales-closure-repository-ts), [recharge-day-not-opened.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-opened-error-ts), [recharge-day-cancelled.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-cancelled-error-ts), [recharge-day-already-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-already-closed-error-ts), [recharge-day-not-ready-to-close.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-ready-to-close-error-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [get-recharge-day-status.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-status-use-case-ts), [recharge-day-status-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-status-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface CloseRechargeDayInput` (L14): sin documentación — miembros: `date`, `userId`

#### Clase `CloseRechargeDayUseCase` (L28–64)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Cerrar Día" — the standalone action carrying no cuadre data of its own (see the day-lifecycle migration's own doc comment for why this is deliberately decoupled from "Guardar Cuadre", unlike Banks). Pre-checks here mirror exactly what `close_recharge_day` (SQL) also enforces under its own row lock — this layer gives the specific error message and avoids the round-trip in the common case; the SQL function is the real guarantee against a race between two near-simultaneous close attempts.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`, `@Inject(RECHARGE_SALES_CLOSURE_REPOSITORY) salesClosureRepository: RechargeSalesClosureRepository`, `getRechargeDayStatusUseCase: GetRechargeDayStatusUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 38–63 | `input: CloseRechargeDayInput` | `Promise<RechargeDayStatusOutput>` |

##### `CloseRechargeDayUseCase.execute`

- **Firma:** `execute(input: CloseRechargeDayInput): Promise<RechargeDayStatusOutput>` — [close-recharge-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/close-recharge-day.use-case.ts#L38) (L38–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `this.dayOpeningRepository.findByDate`, `new RechargeDayNotOpenedError`, `new RechargeDayCancelledError`, `new RechargeDayAlreadyClosedError`, `this.salesClosureRepository.existsForDate`, `new RechargeDayNotReadyToCloseError`, `this.dayOpeningRepository.close`, `this.getRechargeDayStatusUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new RechargeDayNotOpenedError(input.date)`, `new RechargeDayCancelledError(input.date)`, `new RechargeDayAlreadyClosedError(input.date)`, `new RechargeDayNotReadyToCloseError(input.date)`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-create-recharge-sale-use-case-ts"></a>

### create-recharge-sale.use-case.ts

- **Ruta:** [create-recharge-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/create-recharge-sale.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/create-recharge-sale.use-case.ts`, 58 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Records one customer's recharge against the CURRENT cuadre cycle for `operationDate` — type/amount/phone validation, resolving (or lazily creating) that cycle's row, and rejecting an already-closed day all happen atomically inside `register_recharge_sale()`; this use case only shapes the input/outpu
- **Depende de (archivos del proyecto):** [recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sale-repository-ts), [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [assert-recharge-day-writable.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-recharge-day-writable-ts), [recharge-sale-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateRechargeSaleInput` (L13): sin documentación — miembros: `rechargeTypeId`, `phoneNumber`, `amount`, `userId`, `operationDate`

#### Clase `CreateRechargeSaleUseCase` (L31–57)

- **Decoradores:** `@Injectable()`
- **Propósito:** Records one customer's recharge against the CURRENT cuadre cycle for `operationDate` — type/amount/phone validation, resolving (or lazily creating) that cycle's row, and rejecting an already-closed day all happen atomically inside `register_recharge_sale()`; this use case only shapes the input/output, validates the date, and checks the Recargas day-lifecycle gate before delegating — same split as `RegisterRechargePurchaseUseCase`.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SALE_REPOSITORY) saleRepository: RechargeSaleRepository`, `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 40–56 | `input: CreateRechargeSaleInput` | `Promise<RechargeSaleOutput>` |

##### `CreateRechargeSaleUseCase.execute`

- **Firma:** `execute(input: CreateRechargeSaleInput): Promise<RechargeSaleOutput>` — [create-recharge-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/create-recharge-sale.use-case.ts#L40) (L40–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `assertRechargeDayWritable`, `this.saleRepository.create`, `toRechargeSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-delete-recharge-sale-use-case-ts"></a>

### delete-recharge-sale.use-case.ts

- **Ruta:** [delete-recharge-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/delete-recharge-sale.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/delete-recharge-sale.use-case.ts`, 17 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Rejects (`RechargeSaleLockedError`) if the sale's cycle has already been closed — enforced atomically inside `delete_recharge_sale()`.
- **Depende de (archivos del proyecto):** [recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sale-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `DeleteRechargeSaleUseCase` (L6–16)

- **Decoradores:** `@Injectable()`
- **Propósito:** Rejects (`RechargeSaleLockedError`) if the sale's cycle has already been closed — enforced atomically inside `delete_recharge_sale()`.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SALE_REPOSITORY) saleRepository: RechargeSaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 13–15 | `id: string` | `Promise<void>` |

##### `DeleteRechargeSaleUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [delete-recharge-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/delete-recharge-sale.use-case.ts#L13) (L13–15)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleRepository.delete`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-daily-summary-use-case-ts"></a>

### get-recharge-daily-summary.use-case.ts

- **Ruta:** [get-recharge-daily-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-daily-summary.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-daily-summary.use-case.ts`, 49 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Al abrir el módulo" — defaults to today, computed server-side, but now accepts an explicit `date` so the frontend's operation-date picker can browse/backfill any past day.
- **Depende de (archivos del proyecto):** [recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-type-repository-ts), [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts), [today-iso-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-today-iso-date-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [recharge-daily-balance-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-daily-balance-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `GetRechargeDailySummaryUseCase` (L22–48)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Al abrir el módulo" — defaults to today, computed server-side, but now accepts an explicit `date` so the frontend's operation-date picker can browse/backfill any past day. This is still what makes "saldo anterior" fully automatic: for each active recharge type, the row for the given date is fetched if it already exists, or lazily created (via `ensure_recharge_daily_balance`) with `previousBalance` copied from the most recent closed day — the user never types it in.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_TYPE_REPOSITORY) rechargeTypeRepository: RechargeTypeRepository`, `@Inject(RECHARGE_DAILY_BALANCE_REPOSITORY) dailyBalanceRepository: RechargeDailyBalanceRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 31–47 | `userId: string`, `date?: string` | `Promise<RechargeDailyBalanceOutput[]>` |

##### `GetRechargeDailySummaryUseCase.execute`

- **Firma:** `execute(userId: string, date?: string): Promise<RechargeDailyBalanceOutput[]>` — [get-recharge-daily-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-daily-summary.use-case.ts#L31) (L31–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `this.rechargeTypeRepository.findAll`, `Promise.all`, `types.map`, `this.dailyBalanceRepository.ensureDailyBalance`, `balances.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-detail-use-case-ts"></a>

### get-recharge-day-detail.use-case.ts

- **Ruta:** [get-recharge-day-detail.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-day-detail.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-day-detail.use-case.ts`, 83 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Ver Detalle" — composes reads from three repositories that already exist (day, cuadre cycles, audit trail), never duplicates them.
- **Depende de (archivos del proyecto):** [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [recharge-day-audit-log.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-audit-log-repository-ts), [recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sales-closure-repository-ts), [recharge-day-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-found-error-ts), [recharge-sales-closure-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sales-closure-output-ts), [recharge-day-detail-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-detail-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [cancel-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-cancel-recharge-day-use-case-ts), [reopen-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-reopen-recharge-day-use-case-ts), [recharge-days.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `GetRechargeDayDetailUseCase` (L22–82)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Ver Detalle" — composes reads from three repositories that already exist (day, cuadre cycles, audit trail), never duplicates them. Only applies to a date that was ever closed (`RechargeDayNotFoundError` if no `recharge_day_openings` row ever existed for it) — a day still in progress isn't this administrative module's responsibility. Returns EVERY cuadre cycle saved that day (`findAllByDate`), not just the latest — the direct consequence of Recargas' own multi-cycle-per-day feature, unlike Banks' single-reconciliation detail.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`, `@Inject(RECHARGE_SALES_CLOSURE_REPOSITORY) salesClosureRepository: RechargeSalesClosureRepository`, `@Inject(RECHARGE_DAY_AUDIT_LOG_REPOSITORY) dayAuditLogRepository: RechargeDayAuditLogRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 33–81 | `date: string` | `Promise<RechargeDayDetailOutput>` |

##### `GetRechargeDayDetailUseCase.execute`

- **Firma:** `execute(date: string): Promise<RechargeDayDetailOutput>` — [get-recharge-day-detail.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-day-detail.use-case.ts#L33) (L33–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dayOpeningRepository.findByDate`, `new RechargeDayNotFoundError`, `Promise.all`, `this.salesClosureRepository.findAllByDate`, `this.dayAuditLogRepository.findByDate`, `closures.map`, `auditLog.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new RechargeDayNotFoundError(date)`
- **Consumidores:** [cancel-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-cancel-recharge-day-use-case-ts), [reopen-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-reopen-recharge-day-use-case-ts), [recharge-days.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-status-use-case-ts"></a>

### get-recharge-day-status.use-case.ts

- **Ruta:** [get-recharge-day-status.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-day-status.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-day-status.use-case.ts`, 61 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Combines two independent sources into a single response — never duplicates their logic: `RechargeDayOpeningRepository` (is it open?
- **Depende de (archivos del proyecto):** [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sales-closure-repository-ts), [recharge-day-status-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-status-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [close-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts), [open-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-open-recharge-day-use-case-ts), [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `GetRechargeDayStatusUseCase` (L17–60)

- **Decoradores:** `@Injectable()`
- **Propósito:** Combines two independent sources into a single response — never duplicates their logic: `RechargeDayOpeningRepository` (is it open? is it closed?) and `RechargeSalesClosureRepository.existsForDate` (has at least one cuadre been saved today? — the "Cerrar Día" precondition).
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`, `@Inject(RECHARGE_SALES_CLOSURE_REPOSITORY) salesClosureRepository: RechargeSalesClosureRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 26–59 | `date: string` | `Promise<RechargeDayStatusOutput>` |

##### `GetRechargeDayStatusUseCase.execute`

- **Firma:** `execute(date: string): Promise<RechargeDayStatusOutput>` — [get-recharge-day-status.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-day-status.use-case.ts#L26) (L26–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.dayOpeningRepository.findByDate`, `this.salesClosureRepository.existsForDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [close-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts), [open-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-open-recharge-day-use-case-ts), [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-history-use-case-ts"></a>

### get-recharge-history.use-case.ts

- **Ruta:** [get-recharge-history.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-history.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-history.use-case.ts`, 74 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Caso de uso: declara `GetRechargeHistoryUseCase`, `GetRechargeHistoryInput`, `GetRechargeHistoryOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts), [invalid-recharge-date-range.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-recharge-date-range-error-ts), [recharge-daily-balance-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-daily-balance-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts), [recharges-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-recharges-report-controller-ts)

**Interfaces, tipos y enums:**

- `interface GetRechargeHistoryInput` (L10): sin documentación — miembros: `startDate`, `endDate`, `rechargeTypeId`, `userId`, `page`, `limit`, `excludeCancelledDays`
- `interface GetRechargeHistoryOutput` (L21): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `GetRechargeHistoryUseCase` (L32–73)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAILY_BALANCE_REPOSITORY) dailyBalanceRepository: RechargeDailyBalanceRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 39–72 | `input: GetRechargeHistoryInput` | `Promise<GetRechargeHistoryOutput>` |

##### `GetRechargeHistoryUseCase.execute`

- **Firma:** `execute(input: GetRechargeHistoryInput): Promise<GetRechargeHistoryOutput>` — [get-recharge-history.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-history.use-case.ts#L39) (L39–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidRechargeDateRangeError`, `Math.min`, `this.dailyBalanceRepository.findHistory`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidRechargeDateRangeError()`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-recharges-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-operators-summary-use-case-ts"></a>

### get-recharge-operators-summary.use-case.ts

- **Ruta:** [get-recharge-operators-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-operators-summary.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-operators-summary.use-case.ts`, 85 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Backs "Indicadores de Recargas Electrónicas" en Resumen — 4 gráficas de anillo (Ventas Tigo/Claro, Compras Tigo/Claro, Saldo Claro, Saldo Tigo).
- **Depende de (archivos del proyecto):** [recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-type-repository-ts), [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts), [today-iso-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RechargeOperatorStatOutput` (L8): sin documentación — miembros: `rechargeTypeId`, `rechargeTypeName`, `salesThisMonth`, `purchasesThisMonth`, `currentBalance`, `balanceLimit`
- `interface RechargeOperatorsSummaryOutput` (L18): sin documentación — miembros: `month`, `operators`

#### Clase `GetRechargeOperatorsSummaryUseCase` (L32–84)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs "Indicadores de Recargas Electrónicas" en Resumen — 4 gráficas de anillo (Ventas Tigo/Claro, Compras Tigo/Claro, Saldo Claro, Saldo Tigo). Un solo endpoint combinado en vez de 4 llamadas separadas: 3 consultas agregadas (ventas por tipo, compras por tipo, saldo actual por tipo, esta última ya existente y reutilizada de `findLatestPerType()` — la misma fuente de verdad que ya usa el módulo de Alertas para "saldo bajo").
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_TYPE_REPOSITORY) rechargeTypeRepository: RechargeTypeRepository`, `@Inject(RECHARGE_DAILY_BALANCE_REPOSITORY) rechargeDailyBalanceRepository: RechargeDailyBalanceRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 41–83 | — | `Promise<RechargeOperatorsSummaryOutput>` |

##### `GetRechargeOperatorsSummaryUseCase.execute`

- **Firma:** `execute(): Promise<RechargeOperatorsSummaryOutput>` — [get-recharge-operators-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-operators-summary.use-case.ts#L41) (L41–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `todayIsoDate`, `Promise.all`, `this.rechargeTypeRepository.findAll`, `this.rechargeDailyBalanceRepository.getMonthlySalesTotalsByType`, `this.rechargeDailyBalanceRepository.getMonthlyPurchaseTotalsByType`, `this.rechargeDailyBalanceRepository.findLatestPerType`, `new Map`, `salesRows.map`, `purchaseRows.map`, `latestBalances.map`, `types.map`, `salesByType.get`, `purchasesByType.get`…
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-purchases-use-case-ts"></a>

### get-recharge-purchases.use-case.ts

- **Ruta:** [get-recharge-purchases.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-purchases.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-purchases.use-case.ts`, 27 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Backs the "Compras de Recargas" table — every purchase recorded under each type's CURRENT cycle for the given date, newest first, voided included (shown, never hidden).
- **Depende de (archivos del proyecto):** [recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-purchase-repository-ts), [today-iso-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-today-iso-date-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [recharge-purchase-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-purchase-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `GetRechargePurchasesUseCase` (L12–26)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the "Compras de Recargas" table — every purchase recorded under each type's CURRENT cycle for the given date, newest first, voided included (shown, never hidden).
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_PURCHASE_REPOSITORY) purchaseRepository: RechargePurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–25 | `date?: string` | `Promise<RechargePurchaseOutput[]>` |

##### `GetRechargePurchasesUseCase.execute`

- **Firma:** `execute(date?: string): Promise<RechargePurchaseOutput[]>` — [get-recharge-purchases.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-purchases.use-case.ts#L19) (L19–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `this.purchaseRepository.findAllByDate`, `purchases.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-summary-use-case-ts"></a>

### get-recharge-sales-summary.use-case.ts

- **Ruta:** [get-recharge-sales-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sales-summary.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sales-summary.use-case.ts`, 103 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Caso de uso: declara `GetRechargeSalesSummaryUseCase`, `KNOWN_RECHARGE_TYPE_NAMES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts), [recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sales-closure-repository-ts), [recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sale-repository-ts), [recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-registration-repository-ts), [today-iso-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-today-iso-date-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [recharge-sales-summary-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sales-summary-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [register-recharge-sales-closure.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sales-closure-use-case-ts), [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `GetRechargeSalesSummaryUseCase` (L28–102)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAILY_BALANCE_REPOSITORY) dailyBalanceRepository: RechargeDailyBalanceRepository`, `@Inject(RECHARGE_SALES_CLOSURE_REPOSITORY) closureRepository: RechargeSalesClosureRepository`, `@Inject(RECHARGE_SALE_REPOSITORY) saleRepository: RechargeSaleRepository`, `@Inject(RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY) simSaleRegistrationRepository: RechargeSimSaleRegistrationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 41–101 | `date?: string` | `Promise<RechargeSalesSummaryOutput>` |

##### `GetRechargeSalesSummaryUseCase.execute`

- **Firma:** `execute(date?: string): Promise<RechargeSalesSummaryOutput>` — [get-recharge-sales-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sales-summary.use-case.ts#L41) (L41–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `this.saleRepository.getCurrentCycleTotalsByDate`, `totals.find`, `totals.reduce`, `this.simSaleRegistrationRepository.getTotalByDate`, `this.dailyBalanceRepository.findAllByDate`, `balances.reduce`, `Math.max`, `this.closureRepository.findByDateAndSequence`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [register-recharge-sales-closure.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sales-closure-use-case-ts), [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-use-case-ts"></a>

### get-recharge-sales.use-case.ts

- **Ruta:** [get-recharge-sales.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sales.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sales.use-case.ts`, 25 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Backs the "Recargas Vendidas" table — every sale recorded under each type's CURRENT cycle for the given date, newest first.
- **Depende de (archivos del proyecto):** [recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sale-repository-ts), [today-iso-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-today-iso-date-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [recharge-sale-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `GetRechargeSalesUseCase` (L12–24)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the "Recargas Vendidas" table — every sale recorded under each type's CURRENT cycle for the given date, newest first.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SALE_REPOSITORY) saleRepository: RechargeSaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–23 | `date?: string` | `Promise<RechargeSaleOutput[]>` |

##### `GetRechargeSalesUseCase.execute`

- **Firma:** `execute(date?: string): Promise<RechargeSaleOutput[]>` — [get-recharge-sales.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sales.use-case.ts#L19) (L19–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `this.saleRepository.findAllByDate`, `sales.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-daily-summary-use-case-ts"></a>

### get-recharge-sim-daily-summary.use-case.ts

- **Ruta:** [get-recharge-sim-daily-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sim-daily-summary.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sim-daily-summary.use-case.ts`, 44 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Mirrors `GetRechargeDailySummaryUseCase` exactly, for stock instead of a cash balance: for each active SIM type, the row for the given date is fetched if it already exists, or lazily created (`ensure_recharge_sim_daily_stock`) with `previousStock` copied from the most recent prior day's `currentStock`.
- **Depende de (archivos del proyecto):** [recharge-sim-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-type-repository-ts), [recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-daily-stock-repository-ts), [today-iso-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-today-iso-date-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [recharge-sim-daily-stock-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-daily-stock-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `GetRechargeSimDailySummaryUseCase` (L19–43)

- **Decoradores:** `@Injectable()`
- **Propósito:** Mirrors `GetRechargeDailySummaryUseCase` exactly, for stock instead of a cash balance: for each active SIM type, the row for the given date is fetched if it already exists, or lazily created (`ensure_recharge_sim_daily_stock`) with `previousStock` copied from the most recent prior day's `currentStock`.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SIM_TYPE_REPOSITORY) simTypeRepository: RechargeSimTypeRepository`, `@Inject(RECHARGE_SIM_DAILY_STOCK_REPOSITORY) dailyStockRepository: RechargeSimDailyStockRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 28–42 | `userId: string`, `date?: string` | `Promise<RechargeSimDailyStockOutput[]>` |

##### `GetRechargeSimDailySummaryUseCase.execute`

- **Firma:** `execute(userId: string, date?: string): Promise<RechargeSimDailyStockOutput[]>` — [get-recharge-sim-daily-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sim-daily-summary.use-case.ts#L28) (L28–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `this.simTypeRepository.findAll`, `Promise.all`, `types.map`, `this.dailyStockRepository.ensureDailyStock`, `stocks.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-by-id-use-case-ts"></a>

### get-recharge-sim-sale-registration-by-id.use-case.ts

- **Ruta:** [get-recharge-sim-sale-registration-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sim-sale-registration-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sim-sale-registration-by-id.use-case.ts`, 25 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Caso de uso: declara `GetRechargeSimSaleRegistrationByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-registration-repository-ts), [sim-sale-registration-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-not-found-error-ts), [recharge-sim-sale-registration-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-sale-registration-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `GetRechargeSimSaleRegistrationByIdUseCase` (L10–24)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY) registrationRepository: RechargeSimSaleRegistrationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–23 | `id: string` | `Promise<RechargeSimSaleRegistrationOutput>` |

##### `GetRechargeSimSaleRegistrationByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<RechargeSimSaleRegistrationOutput>` — [get-recharge-sim-sale-registration-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sim-sale-registration-by-id.use-case.ts#L17) (L17–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.registrationRepository.findById`, `new SimSaleRegistrationNotFoundError`, `toRechargeSimSaleRegistrationOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SimSaleRegistrationNotFoundError(id)`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-dpi-image-use-case-ts"></a>

### get-recharge-sim-sale-registration-dpi-image.use-case.ts

- **Ruta:** [get-recharge-sim-sale-registration-dpi-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sim-sale-registration-dpi-image.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sim-sale-registration-dpi-image.use-case.ts`, 36 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** The ONE place the DPI photo's bytes are ever read — always behind `JwtAuthGuard` (see `RechargeSimsController`), never a public/static URL.
- **Depende de (archivos del proyecto):** [recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-registration-repository-ts), [sim-sale-registration-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSimSaleRegistrationDpiImage` (L6): sin documentación — miembros: `data`, `mimeType`

#### Clase `GetRechargeSimSaleRegistrationDpiImageUseCase` (L17–35)

- **Decoradores:** `@Injectable()`
- **Propósito:** The ONE place the DPI photo's bytes are ever read — always behind `JwtAuthGuard` (see `RechargeSimsController`), never a public/static URL. `NotFoundException` (not a generic 500) when the registration has no image, so the frontend can show "sin imagen" instead of a broken `&lt;img&gt;`.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY) registrationRepository: RechargeSimSaleRegistrationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 24–34 | `registrationId: string` | `Promise<RechargeSimSaleRegistrationDpiImage>` |

##### `GetRechargeSimSaleRegistrationDpiImageUseCase.execute`

- **Firma:** `execute(registrationId: string): Promise<RechargeSimSaleRegistrationDpiImage>` — [get-recharge-sim-sale-registration-dpi-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sim-sale-registration-dpi-image.use-case.ts#L24) (L24–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.registrationRepository.findById`, `new SimSaleRegistrationNotFoundError`, `this.registrationRepository.getDpiImage`, `new NotFoundException`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SimSaleRegistrationNotFoundError(registrationId)`, `new NotFoundException('Este registro de venta de SIM no tiene una imagen de DPI.')`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharges-daily-stats-use-case-ts"></a>

### get-recharges-daily-stats.use-case.ts

- **Ruta:** [get-recharges-daily-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharges-daily-stats.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharges-daily-stats.use-case.ts`, 55 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Recargas del mes" — Gráficas → Indicadores de Recargas.
- **Depende de (archivos del proyecto):** [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RechargesDailyStatOutput` (L5): sin documentación — miembros: `date`, `amount`
- `interface RechargesDailyStatsOutput` (L11): sin documentación — miembros: `month`, `days`

#### Clase `GetRechargesDailyStatsUseCase` (L27–54)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Recargas del mes" — Gráficas → Indicadores de Recargas. Venta total combinada Claro + Tigo (`SUM(daily_balance - final_balance)` de todos los ciclos cerrados ese día, sin separar por operador — ya confirmado con el usuario), mismo criterio exacto que el indicador de Resumen ya usa (`TypeOrmDashboardRepository.getRechargeSalesByDay`), ahora expuesto vía `getDailySalesTotals` para que ambas pantallas nunca puedan disagreer.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAILY_BALANCE_REPOSITORY) rechargeDailyBalanceRepository: RechargeDailyBalanceRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 34–53 | — | `Promise<RechargesDailyStatsOutput>` |

##### `GetRechargesDailyStatsUseCase.execute`

- **Firma:** `execute(): Promise<RechargesDailyStatsOutput>` — [get-recharges-daily-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharges-daily-stats.use-case.ts#L34) (L34–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `now.getMonth`, `new Date(year, month + 1, 0).getDate`, `String(month + 1).padStart`, `String`, `String(daysInMonth).padStart`, `this.rechargeDailyBalanceRepository.getDailySalesTotals`, `new Map`, `rows.map`, `String(day).padStart`, `days.push`, `amountsByDate.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharges-weekly-stats-use-case-ts"></a>

### get-recharges-weekly-stats.use-case.ts

- **Ruta:** [get-recharges-weekly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharges-weekly-stats.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharges-weekly-stats.use-case.ts`, 71 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Recargas por semana" — buckets de 7 días fijos desde el día 1 del mes actual, nunca semana ISO — mismo criterio exacto que las gráficas semanales de Ventas/Compras/Transacciones.
- **Depende de (archivos del proyecto):** [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RechargesWeeklyStatOutput` (L5): sin documentación — miembros: `weekNumber`, `label`, `startDate`, `endDate`, `amount`
- `interface RechargesWeeklyStatsOutput` (L16): sin documentación — miembros: `month`, `weeks`

#### Clase `GetRechargesWeeklyStatsUseCase` (L31–70)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Recargas por semana" — buckets de 7 días fijos desde el día 1 del mes actual, nunca semana ISO — mismo criterio exacto que las gráficas semanales de Ventas/Compras/Transacciones. Reutiliza la misma consulta día-a-día que la gráfica diaria (`getDailySalesTotals`) — ninguna consulta SQL nueva.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAILY_BALANCE_REPOSITORY) rechargeDailyBalanceRepository: RechargeDailyBalanceRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 38–69 | — | `Promise<RechargesWeeklyStatsOutput>` |

##### `GetRechargesWeeklyStatsUseCase.execute`

- **Firma:** `execute(): Promise<RechargesWeeklyStatsOutput>` — [get-recharges-weekly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharges-weekly-stats.use-case.ts#L38) (L38–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `now.getMonth`, `new Date(year, month + 1, 0).getDate`, `String(month + 1).padStart`, `String`, `String(daysInMonth).padStart`, `this.rechargeDailyBalanceRepository.getDailySalesTotals`, `new Map`, `rows.map`, `Math.min`, `String(day).padStart`, `amountsByDate.get`, `weeks.push`, `String(startDay).padStart`, `String(endDay).padStart`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharges-yearly-stats-use-case-ts"></a>

### get-recharges-yearly-stats.use-case.ts

- **Ruta:** [get-recharges-yearly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharges-yearly-stats.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharges-yearly-stats.use-case.ts`, 77 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Recargas por mes" — acumulativo, enero hasta el mes actual del año en curso, a diferencia de la gráfica diaria/semanal de este mismo módulo.
- **Depende de (archivos del proyecto):** [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RechargesMonthlyStatOutput` (L20): sin documentación — miembros: `month`, `label`, `amount`
- `interface RechargesYearlyStatsOutput` (L27): sin documentación — miembros: `year`, `months`

#### Clase `GetRechargesYearlyStatsUseCase` (L46–76)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Recargas por mes" — acumulativo, enero hasta el mes actual del año en curso, a diferencia de la gráfica diaria/semanal de este mismo módulo. Una sola consulta agregada (`getMonthlySalesTotals`).
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAILY_BALANCE_REPOSITORY) rechargeDailyBalanceRepository: RechargeDailyBalanceRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 53–75 | — | `Promise<RechargesYearlyStatsOutput>` |

##### `GetRechargesYearlyStatsUseCase.execute`

- **Firma:** `execute(): Promise<RechargesYearlyStatsOutput>` — [get-recharges-yearly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharges-yearly-stats.use-case.ts#L53) (L53–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `now.getMonth`, `todayIsoDate`, `this.rechargeDailyBalanceRepository.getMonthlySalesTotals`, `new Map`, `rows.map`, `String(m + 1).padStart`, `String`, `months.push`, `amountsByMonth.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Función `todayIsoDate` (L34–39)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [get-recharges-yearly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharges-yearly-stats.use-case.ts#L34)
- **Propósito / descripción:** Local-time `yyyy-MM-dd` — small per-feature copy of the same helper already duplicated across this module.
- **Dependencias:** `new Date`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`, `now.getFullYear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-closed-recharge-days-use-case-ts"></a>

### list-closed-recharge-days.use-case.ts

- **Ruta:** [list-closed-recharge-days.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/list-closed-recharge-days.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/list-closed-recharge-days.use-case.ts`, 27 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Sistema → Gestión de Días de Recargas" — administrative listing, ADMIN/SUPER_ADMIN only (see the controller).
- **Depende de (archivos del proyecto):** [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [recharge-closed-day-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-closed-day-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-days.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `ListClosedRechargeDaysUseCase` (L13–26)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Sistema → Gestión de Días de Recargas" — administrative listing, ADMIN/SUPER_ADMIN only (see the controller).
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–25 | `filters: RechargeClosedDaysFilters` | `Promise<RechargeClosedDayOutput[]>` |

##### `ListClosedRechargeDaysUseCase.execute`

- **Firma:** `execute(filters: RechargeClosedDaysFilters): Promise<RechargeClosedDayOutput[]>` — [list-closed-recharge-days.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/list-closed-recharge-days.use-case.ts#L20) (L20–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dayOpeningRepository.findClosedDays`, `rows.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-days.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sale-registrations-use-case-ts"></a>

### list-recharge-sim-sale-registrations.use-case.ts

- **Ruta:** [list-recharge-sim-sale-registrations.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/list-recharge-sim-sale-registrations.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/list-recharge-sim-sale-registrations.use-case.ts`, 54 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Administrar Ventas de SIM" listing — same pagination shape as `ListPurchasesUseCase`.
- **Depende de (archivos del proyecto):** [recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-registration-repository-ts), [recharge-sim-sale-registration-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-sale-registration-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface ListRechargeSimSaleRegistrationsInput` (L9): sin documentación — miembros: `startDate`, `endDate`, `simTypeId`, `isVoided`, `page`, `limit`

#### Clase `ListRechargeSimSaleRegistrationsUseCase` (L23–53)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Administrar Ventas de SIM" listing — same pagination shape as `ListPurchasesUseCase`.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY) registrationRepository: RechargeSimSaleRegistrationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–52 | `input: ListRechargeSimSaleRegistrationsInput` | `Promise<PaginatedRechargeSimSaleRegistrationsOutput>` |

##### `ListRechargeSimSaleRegistrationsUseCase.execute`

- **Firma:** `execute(input: ListRechargeSimSaleRegistrationsInput): Promise<PaginatedRechargeSimSaleRegistrationsOutput>` — [list-recharge-sim-sale-registrations.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/list-recharge-sim-sale-registrations.use-case.ts#L30) (L30–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `this.registrationRepository.findAll`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sales-use-case-ts"></a>

### list-recharge-sim-sales.use-case.ts

- **Ruta:** [list-recharge-sim-sales.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/list-recharge-sim-sales.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/list-recharge-sim-sales.use-case.ts`, 33 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Backs "Administrar Ventas de SIM (por cantidad)" — every by-quantity "Vender SIM" sale for the given date (identity-registration sales are excluded, see the repository's own doc comment), newest first, voided included (shown, never hidden).
- **Depende de (archivos del proyecto):** [recharge-sim-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-repository-ts), [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [today-iso-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-today-iso-date-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [recharge-sim-sale-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `ListRechargeSimSalesUseCase` (L14–32)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs "Administrar Ventas de SIM (por cantidad)" — every by-quantity "Vender SIM" sale for the given date (identity-registration sales are excluded, see the repository's own doc comment), newest first, voided included (shown, never hidden).
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SIM_SALE_REPOSITORY) simSaleRepository: RechargeSimSaleRepository`, `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 23–31 | `date?: string` | `Promise<RechargeSimSaleOutput[]>` |

##### `ListRechargeSimSalesUseCase.execute`

- **Firma:** `execute(date?: string): Promise<RechargeSimSaleOutput[]>` — [list-recharge-sim-sales.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/list-recharge-sim-sales.use-case.ts#L23) (L23–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `Promise.all`, `this.simSaleRepository.findAllByDate`, `this.dayOpeningRepository.findByDate`, `sales.map`, `toRechargeSimSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-types-use-case-ts"></a>

### list-recharge-sim-types.use-case.ts

- **Ruta:** [list-recharge-sim-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/list-recharge-sim-types.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/list-recharge-sim-types.use-case.ts`, 23 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Caso de uso: declara `ListRechargeSimTypesUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sim-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-type-repository-ts), [recharge-sim-type-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `ListRechargeSimTypesUseCase` (L9–22)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SIM_TYPE_REPOSITORY) rechargeSimTypeRepository: RechargeSimTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 16–21 | — | `Promise<RechargeSimTypeOutput[]>` |

##### `ListRechargeSimTypesUseCase.execute`

- **Firma:** `execute(): Promise<RechargeSimTypeOutput[]>` — [list-recharge-sim-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/list-recharge-sim-types.use-case.ts#L16) (L16–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.rechargeSimTypeRepository.findAll`, `types.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-types-use-case-ts"></a>

### list-recharge-types.use-case.ts

- **Ruta:** [list-recharge-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/list-recharge-types.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/list-recharge-types.use-case.ts`, 23 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Caso de uso: declara `ListRechargeTypesUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-type-repository-ts), [recharge-type-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `ListRechargeTypesUseCase` (L9–22)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_TYPE_REPOSITORY) rechargeTypeRepository: RechargeTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 16–21 | — | `Promise<RechargeTypeOutput[]>` |

##### `ListRechargeTypesUseCase.execute`

- **Firma:** `execute(): Promise<RechargeTypeOutput[]>` — [list-recharge-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/list-recharge-types.use-case.ts#L16) (L16–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.rechargeTypeRepository.findAll`, `types.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-open-recharge-day-use-case-ts"></a>

### open-recharge-day.use-case.ts

- **Ruta:** [open-recharge-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/open-recharge-day.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/open-recharge-day.use-case.ts`, 51 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Confirmar Apertura" — idempotent (`RechargeDayOpeningRepository.open` never creates a second row for an already-opened date), so a double click or a retry never fails or duplicates anything.
- **Depende de (archivos del proyecto):** [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [recharge-day-audit-log.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-audit-log-repository-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [get-recharge-day-status.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-status-use-case-ts), [recharge-day-status-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-status-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface OpenRechargeDayInput` (L10): sin documentación — miembros: `date`, `userId`

#### Clase `OpenRechargeDayUseCase` (L22–50)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Confirmar Apertura" — idempotent (`RechargeDayOpeningRepository.open` never creates a second row for an already-opened date), so a double click or a retry never fails or duplicates anything. Returns the day's full status (not just "opened: yes"), so the frontend can update its UI in one step without a second call.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`, `@Inject(RECHARGE_DAY_AUDIT_LOG_REPOSITORY) dayAuditLogRepository: RechargeDayAuditLogRepository`, `getRechargeDayStatusUseCase: GetRechargeDayStatusUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 32–49 | `input: OpenRechargeDayInput` | `Promise<RechargeDayStatusOutput>` |

##### `OpenRechargeDayUseCase.execute`

- **Firma:** `execute(input: OpenRechargeDayInput): Promise<RechargeDayStatusOutput>` — [open-recharge-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/open-recharge-day.use-case.ts#L32) (L32–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `this.dayOpeningRepository.findByDate`, `this.dayOpeningRepository.open`, `this.dayAuditLogRepository.record`, `this.getRechargeDayStatusUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-final-balance-use-case-ts"></a>

### register-recharge-final-balance.use-case.ts

- **Ruta:** [register-recharge-final-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-final-balance.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-final-balance.use-case.ts`, 72 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** The negative/exceeds-daily validation lives inside `register_recharge_final_balance()` — this use case only owns one rule that genuinely belongs at the application layer instead: whether the caller is *allowed* to call it again on a day that's already closed.
- **Depende de (archivos del proyecto):** [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts), [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [daily-balance-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-daily-balance-not-found-error-ts), [final-balance-edit-forbidden.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-final-balance-edit-forbidden-error-ts), [assert-recharge-day-writable.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-recharge-day-writable-ts), [recharge-daily-balance-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-daily-balance-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterRechargeFinalBalanceInput` (L14): sin documentación — miembros: `dailyBalanceId`, `finalBalance`, `userId`, `isAdmin`

#### Clase `RegisterRechargeFinalBalanceUseCase` (L33–71)

- **Decoradores:** `@Injectable()`
- **Propósito:** The negative/exceeds-daily validation lives inside `register_recharge_final_balance()` — this use case only owns one rule that genuinely belongs at the application layer instead: whether the caller is *allowed* to call it again on a day that's already closed. The first close of a day is an operational action (any authenticated account, mirroring Sales/Purchases' own "any authenticated" policy for their operational writes); *correcting* an already-closed day is elevated to admin-only, the same "sensitive once it's historical" idea `RoleFormModalComponent`'s system-role lock and this app's other once-confirmed-stays-confirmed rules already apply elsewhere.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAILY_BALANCE_REPOSITORY) dailyBalanceRepository: RechargeDailyBalanceRepository`, `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 42–70 | `input: RegisterRechargeFinalBalanceInput` | `Promise<RechargeDailyBalanceOutput>` |

##### `RegisterRechargeFinalBalanceUseCase.execute`

- **Firma:** `execute(input: RegisterRechargeFinalBalanceInput): Promise<RechargeDailyBalanceOutput>` — [register-recharge-final-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-final-balance.use-case.ts#L42) (L42–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dailyBalanceRepository.findById`, `new DailyBalanceNotFoundError`, `assertRechargeDayWritable`, `new FinalBalanceEditForbiddenError`, `this.dailyBalanceRepository.registerFinalBalance`, `toRechargeDailyBalanceOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new DailyBalanceNotFoundError(input.dailyBalanceId)`, `new FinalBalanceEditForbiddenError()`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-purchase-use-case-ts"></a>

### register-recharge-purchase.use-case.ts

- **Ruta:** [register-recharge-purchase.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-purchase.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-purchase.use-case.ts`, 66 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Registers against the caller's chosen operation date (the frontend's date picker, defaulting to today) rather than always assuming today — `assertValidOperationDate` is the only guard against backdating this into the future; genuine backdating into the past is the whole point of this follow-up ("catch up on a day I forgot to close").
- **Depende de (archivos del proyecto):** [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts), [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [assert-recharge-day-writable.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-recharge-day-writable-ts), [recharge-daily-balance-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-daily-balance-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterRechargePurchaseInput` (L13): sin documentación — miembros: `rechargeTypeId`, `purchaseAmount`, `creditedAmount`, `userId`, `operationDate`

#### Clase `RegisterRechargePurchaseUseCase` (L37–65)

- **Decoradores:** `@Injectable()`
- **Propósito:** Registers against the caller's chosen operation date (the frontend's date picker, defaulting to today) rather than always assuming today — `assertValidOperationDate` is the only guard against backdating this into the future; genuine backdating into the past is the whole point of this follow-up ("catch up on a day I forgot to close"). Type/active/amount validation, the movement record, and the running-total increment all happen atomically inside `register_recharge_purchase()` — this use case only shapes the input/output, validates the date, and (via `assertRechargeDayWritable`) checks the Recargas day-lifecycle gate (today must be opened; any date must not already be closed) before delegating.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAILY_BALANCE_REPOSITORY) dailyBalanceRepository: RechargeDailyBalanceRepository`, `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 46–64 | `input: RegisterRechargePurchaseInput` | `Promise<RechargeDailyBalanceOutput>` |

##### `RegisterRechargePurchaseUseCase.execute`

- **Firma:** `execute(input: RegisterRechargePurchaseInput): Promise<RechargeDailyBalanceOutput>` — [register-recharge-purchase.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-purchase.use-case.ts#L46) (L46–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `assertRechargeDayWritable`, `this.dailyBalanceRepository.registerPurchase`, `toRechargeDailyBalanceOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sales-closure-use-case-ts"></a>

### register-recharge-sales-closure.use-case.ts

- **Ruta:** [register-recharge-sales-closure.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sales-closure.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sales-closure.use-case.ts`, 79 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Closes the CURRENT cuadre cycle for `operationDate` and — on a genuine first close — immediately starts a fresh one, carrying each type's just- closed `finalBalance` forward as the new cycle's `previousBalance` (`register_recharge_sales_closure`'s own job, not this use case's).
- **Depende de (archivos del proyecto):** [recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sales-closure-repository-ts), [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [assert-recharge-day-writable.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-recharge-day-writable-ts), [recharge-sales-summary-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sales-summary-output-ts), [get-recharge-sales-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-summary-use-case-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterRechargeSalesClosureInput` (L11): sin documentación — miembros: `totalCollected`, `userId`, `isAdmin`, `operationDate`

#### Clase `RegisterRechargeSalesClosureUseCase` (L50–78)

- **Decoradores:** `@Injectable()`
- **Propósito:** Closes the CURRENT cuadre cycle for `operationDate` and — on a genuine first close — immediately starts a fresh one, carrying each type's just- closed `finalBalance` forward as the new cycle's `previousBalance` (`register_recharge_sales_closure`'s own job, not this use case's). `total_sales`/`result` are always recomputed fresh from real data inside that function — this use case never trusts or forwards a caller-supplied total, only `totalCollected` and the operation date. The FIRST/RE-edit permission split (mirrors `RegisterRechargeFinalBalanceUseCase`'s identical rule: first close is operational, re-closing an already-closed cycle is admin-only) is enforced INSIDE the stored function now, not as a pre-check here — see the migration's own comment for why an app-layer pre-check would leave a race window a concurrent first-save could slip through. `isAdmin` is simply forwarded to the repo
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SALES_CLOSURE_REPOSITORY) closureRepository: RechargeSalesClosureRepository`, `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`, `getRechargeSalesSummaryUseCase: GetRechargeSalesSummaryUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 60–77 | `input: RegisterRechargeSalesClosureInput` | `Promise<RechargeSalesSummaryOutput>` |

##### `RegisterRechargeSalesClosureUseCase.execute`

- **Firma:** `execute(input: RegisterRechargeSalesClosureInput): Promise<RechargeSalesSummaryOutput>` — [register-recharge-sales-closure.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sales-closure.use-case.ts#L60) (L60–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `assertRechargeDayWritable`, `this.closureRepository.registerClosure`, `this.getRechargeSalesSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-purchase-use-case-ts"></a>

### register-recharge-sim-purchase.use-case.ts

- **Ruta:** [register-recharge-sim-purchase.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sim-purchase.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sim-purchase.use-case.ts`, 58 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Registers a physical SIM purchase — stock entry only.
- **Depende de (archivos del proyecto):** [recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-daily-stock-repository-ts), [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [assert-recharge-day-writable.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-recharge-day-writable-ts), [recharge-sim-daily-stock-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-daily-stock-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterRechargeSimPurchaseInput` (L13): sin documentación — miembros: `simTypeId`, `quantity`, `userId`, `operationDate`

#### Clase `RegisterRechargeSimPurchaseUseCase` (L30–57)

- **Decoradores:** `@Injectable()`
- **Propósito:** Registers a physical SIM purchase — stock entry only. Reuses the exact same day-lifecycle gate (`assertRechargeDayWritable`, backed by `recharge_day_openings`) every other Recargas write use case already uses, so "Gestión de Días de Recargas" opens/closes/reopens SIM operations automatically alongside the electronic balance side, with no new day-lifecycle code. Cost is never accepted here — the stored function reads it from `recharge_sim_types` server-side.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SIM_DAILY_STOCK_REPOSITORY) dailyStockRepository: RechargeSimDailyStockRepository`, `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 39–56 | `input: RegisterRechargeSimPurchaseInput` | `Promise<RechargeSimDailyStockOutput>` |

##### `RegisterRechargeSimPurchaseUseCase.execute`

- **Firma:** `execute(input: RegisterRechargeSimPurchaseInput): Promise<RechargeSimDailyStockOutput>` — [register-recharge-sim-purchase.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sim-purchase.use-case.ts#L39) (L39–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `assertRechargeDayWritable`, `this.dailyStockRepository.registerPurchase`, `toRechargeSimDailyStockOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts"></a>

### register-recharge-sim-sale-with-registration.use-case.ts

- **Ruta:** [register-recharge-sim-sale-with-registration.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sim-sale-with-registration.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sim-sale-with-registration.use-case.ts`, 100 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Venta de SIM con registro de identidad" — registers exactly ONE physical SIM (always `quantity=1` on the underlying `recharge_sim_sales` row) and its identity-capture record in a single database transaction, via `TransactionManager` (the same port built for Transaccionar's "Enviar a cuentas por cob
- **Depende de (archivos del proyecto):** [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts), [recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-daily-stock-repository-ts), [recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-registration-repository-ts), [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [assert-recharge-day-writable.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-recharge-day-writable-ts), [assert-valid-dpi-image.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-dpi-image-ts), [recharge-sim-sale-registration-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-sale-registration-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterRechargeSimSaleWithRegistrationInput` (L18): sin documentación — miembros: `simTypeId`, `simNumber`, `sku`, `clientDpi`, `clientId`, `salePrice`, `operationDate`, `userId`, `dpiImage`

#### Clase `RegisterRechargeSimSaleWithRegistrationUseCase` (L42–99)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Venta de SIM con registro de identidad" — registers exactly ONE physical SIM (always `quantity=1` on the underlying `recharge_sim_sales` row) and its identity-capture record in a single database transaction, via `TransactionManager` (the same port built for Transaccionar's "Enviar a cuentas por cobrar"): if the DPI image fails validation or either insert fails, nothing is left half-written — no sale without its registration, no orphaned image. See `AddRechargeSimSaleRegistrations`'s own migration doc comment for why this is additive to, never a replacement for, the existing by-quantity "Vender SIM" flow.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SIM_DAILY_STOCK_REPOSITORY) dailyStockRepository: RechargeSimDailyStockRepository`, `@Inject(RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY) registrationRepository: RechargeSimSaleRegistrationRepository`, `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`, `@Inject(TRANSACTION_MANAGER) transactionManager: TransactionManager`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 55–98 | `input: RegisterRechargeSimSaleWithRegistrationInput` | `Promise<RechargeSimSaleRegistrationOutput>` |

##### `RegisterRechargeSimSaleWithRegistrationUseCase.execute`

- **Firma:** `execute(input: RegisterRechargeSimSaleWithRegistrationInput): Promise<RechargeSimSaleRegistrationOutput>` — [register-recharge-sim-sale-with-registration.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sim-sale-with-registration.use-case.ts#L55) (L55–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `assertRechargeDayWritable`, `assertValidDpiImage`, `this.transactionManager.runInTransaction`, `this.dailyStockRepository.registerSingleUnitSale`, `this.registrationRepository.saveDpiImage`, `this.registrationRepository.create`, `toRechargeSimSaleRegistrationOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-use-case-ts"></a>

### register-recharge-sim-sale.use-case.ts

- **Ruta:** [register-recharge-sim-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sim-sale.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sim-sale.use-case.ts`, 57 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Registers a physical SIM sale — stock exit only, never touches the electronic balance side.
- **Depende de (archivos del proyecto):** [recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-daily-stock-repository-ts), [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [assert-recharge-day-writable.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-recharge-day-writable-ts), [recharge-sim-daily-stock-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-daily-stock-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterRechargeSimSaleInput` (L13): sin documentación — miembros: `simTypeId`, `quantity`, `userId`, `operationDate`

#### Clase `RegisterRechargeSimSaleUseCase` (L29–56)

- **Decoradores:** `@Injectable()`
- **Propósito:** Registers a physical SIM sale — stock exit only, never touches the electronic balance side. Same day-lifecycle gate as the purchase use case. "Stock insuficiente" is enforced inside `register_recharge_sim_sale()` under a row lock — this use case never pre-checks stock itself, the SQL function is the real guarantee (same reasoning as `confirm_ice_cream_sale`). Price is never accepted here — read from `recharge_sim_types` server-side.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SIM_DAILY_STOCK_REPOSITORY) dailyStockRepository: RechargeSimDailyStockRepository`, `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 38–55 | `input: RegisterRechargeSimSaleInput` | `Promise<RechargeSimDailyStockOutput>` |

##### `RegisterRechargeSimSaleUseCase.execute`

- **Firma:** `execute(input: RegisterRechargeSimSaleInput): Promise<RechargeSimDailyStockOutput>` — [register-recharge-sim-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sim-sale.use-case.ts#L38) (L38–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidOperationDate`, `assertRechargeDayWritable`, `this.dailyStockRepository.registerSale`, `toRechargeSimDailyStockOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-reopen-recharge-day-use-case-ts"></a>

### reopen-recharge-day.use-case.ts

- **Ruta:** [reopen-recharge-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/reopen-recharge-day.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/reopen-recharge-day.use-case.ts`, 42 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Reabrir Día" — role validation (ADMIN/SUPER_ADMIN only) already happened in the controller's `RolesGuard`; the real status/cancellation/ later-day validation happens atomically inside `reopen_recharge_day` (SQL, under the row lock) — this use case only orchestrates and translates the result into the shape the frontend needs to refresh the row/detail without a second call.
- **Depende de (archivos del proyecto):** [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [recharge-day-reason-required.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-reason-required-error-ts), [get-recharge-day-detail.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-detail-use-case-ts), [recharge-day-detail-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-detail-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-days.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface ReopenRechargeDayInput` (L8): sin documentación — miembros: `date`, `userId`, `reason`

#### Clase `ReopenRechargeDayUseCase` (L22–41)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Reabrir Día" — role validation (ADMIN/SUPER_ADMIN only) already happened in the controller's `RolesGuard`; the real status/cancellation/ later-day validation happens atomically inside `reopen_recharge_day` (SQL, under the row lock) — this use case only orchestrates and translates the result into the shape the frontend needs to refresh the row/detail without a second call.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`, `getRechargeDayDetailUseCase: GetRechargeDayDetailUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–40 | `input: ReopenRechargeDayInput` | `Promise<RechargeDayDetailOutput>` |

##### `ReopenRechargeDayUseCase.execute`

- **Firma:** `execute(input: ReopenRechargeDayInput): Promise<RechargeDayDetailOutput>` — [reopen-recharge-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/reopen-recharge-day.use-case.ts#L30) (L30–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.reason?.trim`, `new RechargeReopenReasonRequiredError`, `this.dayOpeningRepository.reopen`, `this.getRechargeDayDetailUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new RechargeReopenReasonRequiredError()`
- **Consumidores:** [recharge-days.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-sale-use-case-ts"></a>

### update-recharge-sale.use-case.ts

- **Ruta:** [update-recharge-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-sale.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-sale.use-case.ts`, 43 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Only `phoneNumber`/`amount` are editable — the recharge type is fixed at creation (see the migration's own comment on `update_recharge_sale`).
- **Depende de (archivos del proyecto):** [recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sale-repository-ts), [recharge-sale-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface UpdateRechargeSaleInput` (L9): sin documentación — miembros: `id`, `phoneNumber`, `amount`, `userId`

#### Clase `UpdateRechargeSaleUseCase` (L25–42)

- **Decoradores:** `@Injectable()`
- **Propósito:** Only `phoneNumber`/`amount` are editable — the recharge type is fixed at creation (see the migration's own comment on `update_recharge_sale`). Whether the sale's cycle is still open is re-verified atomically inside that function (locked `FOR UPDATE`), not pre-checked here — a plain `findById` check here would leave the same race window `register_recharge_sales_closure`'s own comment already documents for an analogous case.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SALE_REPOSITORY) saleRepository: RechargeSaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 32–41 | `input: UpdateRechargeSaleInput` | `Promise<RechargeSaleOutput>` |

##### `UpdateRechargeSaleUseCase.execute`

- **Firma:** `execute(input: UpdateRechargeSaleInput): Promise<RechargeSaleOutput>` — [update-recharge-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-sale.use-case.ts#L32) (L32–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleRepository.update`, `toRechargeSaleOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.saleRepository.update`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-balance-limit-use-case-ts"></a>

### update-recharge-type-balance-limit.use-case.ts

- **Ruta:** [update-recharge-type-balance-limit.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-type-balance-limit.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-type-balance-limit.use-case.ts`, 41 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Límite de saldo" per recharge type — the 100% reference point the Resumen dashboard's saldo gauge charts compare the current balance against.
- **Depende de (archivos del proyecto):** [recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-type-repository-ts), [invalid-balance-limit.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-balance-limit-error-ts), [recharge-type-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface UpdateRechargeTypeBalanceLimitInput` (L10): sin documentación — miembros: `id`, `balanceLimit`

#### Clase `UpdateRechargeTypeBalanceLimitUseCase` (L20–40)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Límite de saldo" per recharge type — the 100% reference point the Resumen dashboard's saldo gauge charts compare the current balance against. Admin-only.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_TYPE_REPOSITORY) rechargeTypeRepository: RechargeTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 27–39 | `input: UpdateRechargeTypeBalanceLimitInput` | `Promise<RechargeTypeOutput>` |

##### `UpdateRechargeTypeBalanceLimitUseCase.execute`

- **Firma:** `execute(input: UpdateRechargeTypeBalanceLimitInput): Promise<RechargeTypeOutput>` — [update-recharge-type-balance-limit.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-type-balance-limit.use-case.ts#L27) (L27–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidBalanceLimitError`, `this.rechargeTypeRepository.updateBalanceLimit`, `toRechargeTypeOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidBalanceLimitError()`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-spec-ts"></a>

### update-recharge-type-min-balance.use-case.spec.ts

- **Ruta:** [update-recharge-type-min-balance.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-type-min-balance.use-case.spec.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-type-min-balance.use-case.spec.ts`, 53 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Prueba unitaria: declara `makeType` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [update-recharge-type-min-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-ts), [recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-type-repository-ts), [invalid-min-balance.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-min-balance-error-ts), [recharge-type.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-type-entity-ts)
- **Consumidores:** —
#### Función `makeType` (L6–16)

- **Tipo:** función local del archivo
- **Firma:** `makeType(minBalance: number): RechargeType` — [update-recharge-type-min-balance.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-type-min-balance.use-case.spec.ts#L6)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `RechargeType.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-ts"></a>

### update-recharge-type-min-balance.use-case.ts

- **Ruta:** [update-recharge-type-min-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-type-min-balance.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-type-min-balance.use-case.ts`, 40 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Saldo mínimo" per recharge type — the threshold the Alerts module reads for "saldo bajo de recargas".
- **Depende de (archivos del proyecto):** [recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-type-repository-ts), [invalid-min-balance.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-min-balance-error-ts), [recharge-type-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [update-recharge-type-min-balance.use-case.spec.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-spec-ts), [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface UpdateRechargeTypeMinBalanceInput` (L10): sin documentación — miembros: `id`, `minBalance`

#### Clase `UpdateRechargeTypeMinBalanceUseCase` (L19–39)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Saldo mínimo" per recharge type — the threshold the Alerts module reads for "saldo bajo de recargas". Admin-only.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_TYPE_REPOSITORY) rechargeTypeRepository: RechargeTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 26–38 | `input: UpdateRechargeTypeMinBalanceInput` | `Promise<RechargeTypeOutput>` |

##### `UpdateRechargeTypeMinBalanceUseCase.execute`

- **Firma:** `execute(input: UpdateRechargeTypeMinBalanceInput): Promise<RechargeTypeOutput>` — [update-recharge-type-min-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-type-min-balance.use-case.ts#L26) (L26–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidMinBalanceError`, `this.rechargeTypeRepository.updateMinBalance`, `toRechargeTypeOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidMinBalanceError()`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-purchase-use-case-ts"></a>

### void-recharge-purchase.use-case.ts

- **Ruta:** [void-recharge-purchase.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/void-recharge-purchase.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/void-recharge-purchase.use-case.ts`, 62 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Revertir compra" — the correction path for a mistaken recharge purchase (wrong operator, duplicate, wrong amount).
- **Depende de (archivos del proyecto):** [recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-purchase-repository-ts), [recharge-purchase-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-not-found-error-ts), [recharge-purchase-already-voided.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-already-voided-error-ts), [void-reason-required.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-void-reason-required-error-ts), [recharge-purchase-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-purchase-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface VoidRechargePurchaseInput` (L12): sin documentación — miembros: `id`, `voidedBy`, `reason`

#### Clase `VoidRechargePurchaseUseCase` (L31–61)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Revertir compra" — the correction path for a mistaken recharge purchase (wrong operator, duplicate, wrong amount). Never an edit, never a physical delete — the original row stays exactly as registered, forever, marked `ANULADA`. The real guard order (not-found → already-voided → day-closed → cycle-closed → would-go-negative) runs atomically inside `void_recharge_purchase`'s own advisory row lock — this use case only pre-checks reason/existence for a clean error message and translates the result; a TypeScript-side pre-check of the closed-cycle/negative- balance rules would only add a TOCTOU gap, not close one (same reasoning already established for the Kardex financiero payment use cases and Caja Contable's withdrawal use case).
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_PURCHASE_REPOSITORY) purchaseRepository: RechargePurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 38–60 | `input: VoidRechargePurchaseInput` | `Promise<RechargePurchaseOutput>` |

##### `VoidRechargePurchaseUseCase.execute`

- **Firma:** `execute(input: VoidRechargePurchaseInput): Promise<RechargePurchaseOutput>` — [void-recharge-purchase.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/void-recharge-purchase.use-case.ts#L38) (L38–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.reason?.trim`, `new VoidReasonRequiredError`, `this.purchaseRepository.findById`, `new RechargePurchaseNotFoundError`, `new RechargePurchaseAlreadyVoidedError`, `this.purchaseRepository.voidPurchase`, `toRechargePurchaseOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new VoidReasonRequiredError()`, `new RechargePurchaseNotFoundError()`, `new RechargePurchaseAlreadyVoidedError()`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-registration-use-case-ts"></a>

### void-recharge-sim-sale-registration.use-case.ts

- **Ruta:** [void-recharge-sim-sale-registration.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/void-recharge-sim-sale-registration.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/void-recharge-sim-sale-registration.use-case.ts`, 57 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Anular" — the only correction path for a mistaken SIM sale registration, same "nunca editar" rule as Purchases/Sales/Bank Deposits.
- **Depende de (archivos del proyecto):** [recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-registration-repository-ts), [sim-sale-registration-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-not-found-error-ts), [sim-sale-registration-already-voided.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-already-voided-error-ts), [sim-sale-registration-void-reason-required.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-void-reason-required-error-ts), [recharge-sim-sale-registration-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-sale-registration-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface VoidRechargeSimSaleRegistrationInput` (L12): sin documentación — miembros: `id`, `voidedBy`, `reason`

#### Clase `VoidRechargeSimSaleRegistrationUseCase` (L26–56)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Anular" — the only correction path for a mistaken SIM sale registration, same "nunca editar" rule as Purchases/Sales/Bank Deposits. Restores the parent sale's stock atomically (`void_recharge_sim_sale_registration`), which is also what makes this excluded from Total Recaudado on the very next read (`register_recharge_sales_closure` only sums `is_voided = false` rows).
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY) registrationRepository: RechargeSimSaleRegistrationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 33–55 | `input: VoidRechargeSimSaleRegistrationInput` | `Promise<RechargeSimSaleRegistrationOutput>` |

##### `VoidRechargeSimSaleRegistrationUseCase.execute`

- **Firma:** `execute(input: VoidRechargeSimSaleRegistrationInput): Promise<RechargeSimSaleRegistrationOutput>` — [void-recharge-sim-sale-registration.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/void-recharge-sim-sale-registration.use-case.ts#L33) (L33–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.reason?.trim`, `new SimSaleRegistrationVoidReasonRequiredError`, `this.registrationRepository.findById`, `new SimSaleRegistrationNotFoundError`, `new SimSaleRegistrationAlreadyVoidedError`, `this.registrationRepository.voidRegistration`, `toRechargeSimSaleRegistrationOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SimSaleRegistrationVoidReasonRequiredError()`, `new SimSaleRegistrationNotFoundError(input.id)`, `new SimSaleRegistrationAlreadyVoidedError(input.id)`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-use-case-ts"></a>

### void-recharge-sim-sale.use-case.ts

- **Ruta:** [void-recharge-sim-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/void-recharge-sim-sale.use-case.ts) (`comercial-jhoel-api/src/modules/recharges/application/use-cases/void-recharge-sim-sale.use-case.ts`, 68 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Revertir" for the by-quantity "Vender SIM" flow — the correction path this flow never had before (see the migration's own doc comment).
- **Depende de (archivos del proyecto):** [recharge-sim-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-repository-ts), [recharge-sim-sale-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-sim-sale-not-found-error-ts), [sim-sale-already-voided.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-already-voided-error-ts), [sim-sale-has-registration.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-has-registration-error-ts), [sim-sale-void-reason-required.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-void-reason-required-error-ts), [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [recharge-sim-sale-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface VoidRechargeSimSaleInput` (L15): sin documentación — miembros: `id`, `voidedBy`, `reason`

#### Clase `VoidRechargeSimSaleUseCase` (L33–67)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Revertir" for the by-quantity "Vender SIM" flow — the correction path this flow never had before (see the migration's own doc comment). Never an edit, never a physical delete — the original row stays exactly as sold, forever, marked anulada, and its stock is restored. The real guard order (reason → not-found → already-voided → has-active-registration → day-closed) runs atomically inside `void_recharge_sim_sale`'s own row lock — this use case only pre-checks reason/existence/registration for a clean error message and translates the result; a TypeScript-side pre-check of the day-closed rule would only add a TOCTOU gap, not close one (same reasoning already established for `VoidRechargePurchaseUseCase`).
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_SIM_SALE_REPOSITORY) simSaleRepository: RechargeSimSaleRepository`, `@Inject(RECHARGE_DAY_OPENING_REPOSITORY) dayOpeningRepository: RechargeDayOpeningRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 42–66 | `input: VoidRechargeSimSaleInput` | `Promise<RechargeSimSaleOutput>` |

##### `VoidRechargeSimSaleUseCase.execute`

- **Firma:** `execute(input: VoidRechargeSimSaleInput): Promise<RechargeSimSaleOutput>` — [void-recharge-sim-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/void-recharge-sim-sale.use-case.ts#L42) (L42–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.reason?.trim`, `new SimSaleVoidReasonRequiredError`, `this.simSaleRepository.findById`, `new RechargeSimSaleNotFoundError`, `new SimSaleAlreadyVoidedError`, `new SimSaleHasRegistrationError`, `this.simSaleRepository.voidSale`, `this.dayOpeningRepository.findByDate`, `toRechargeSimSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SimSaleVoidReasonRequiredError()`, `new RechargeSimSaleNotFoundError(input.id)`, `new SimSaleAlreadyVoidedError()`, `new SimSaleHasRegistrationError()`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-recharge-day-writable-ts"></a>

### assert-recharge-day-writable.ts

- **Ruta:** [assert-recharge-day-writable.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/utils/assert-recharge-day-writable.ts) (`comercial-jhoel-api/src/modules/recharges/application/utils/assert-recharge-day-writable.ts`, 28 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** The mandatory "Apertura del Día" sequencing only applies to TODAY's operating date — correcting a past date is pre-existing functionality this ticket was required to preserve unchanged (see Banks' `SaveBankBalancesUseCase`, which established this exact rule first for its own module).
- **Depende de (archivos del proyecto):** [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [recharge-day-not-opened.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-opened-error-ts), [recharge-day-already-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-already-closed-error-ts), [today-iso-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-today-iso-date-ts)
- **Consumidores:** [create-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-create-recharge-sale-use-case-ts), [register-recharge-final-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-final-balance-use-case-ts), [register-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-purchase-use-case-ts), [register-recharge-sales-closure.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sales-closure-use-case-ts), [register-recharge-sim-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-purchase-use-case-ts), [register-recharge-sim-sale-with-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts), [register-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-use-case-ts)
#### Función `assertRechargeDayWritable` (L14–27)

- **Tipo:** función exportada, async
- **Firma:** `assertRechargeDayWritable(repository: RechargeDayOpeningRepository, date: string): Promise<void>` — [assert-recharge-day-writable.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/utils/assert-recharge-day-writable.ts#L14)
- **Propósito / descripción:** The mandatory "Apertura del Día" sequencing only applies to TODAY's operating date — correcting a past date is pre-existing functionality this ticket was required to preserve unchanged (see Banks' `SaveBankBalancesUseCase`, which established this exact rule first for its own module). Shared by every write use case that needs it (purchase, sale, saldo final, cuadre save) rather than duplicated four times.
- **Dependencias:** `repository.findByDate`, `todayIsoDate`, `new RechargeDayNotOpenedError`, `new RechargeDayAlreadyClosedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new RechargeDayNotOpenedError(date)`, `new RechargeDayAlreadyClosedError(date)`
- **Consumidores:** [create-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-create-recharge-sale-use-case-ts), [register-recharge-final-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-final-balance-use-case-ts), [register-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-purchase-use-case-ts), [register-recharge-sales-closure.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sales-closure-use-case-ts), [register-recharge-sim-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-purchase-use-case-ts), [register-recharge-sim-sale-with-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts), [register-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-dpi-image-ts"></a>

### assert-valid-dpi-image.ts

- **Ruta:** [assert-valid-dpi-image.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/utils/assert-valid-dpi-image.ts) (`comercial-jhoel-api/src/modules/recharges/application/utils/assert-valid-dpi-image.ts`, 28 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Validated before ever opening the registration's transaction — a doomed upload should never take a DB transaction slot.
- **Depende de (archivos del proyecto):** [invalid-dpi-image.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-dpi-image-error-ts)
- **Consumidores:** [register-recharge-sim-sale-with-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts)

**Interfaces, tipos y enums:**

- `interface UploadedDpiImage` (L8): sin documentación — miembros: `buffer`, `mimetype`, `size`

**Constantes exportadas:**

- `MAX_DPI_IMAGE_SIZE_BYTES` (L4): Mirrors `MAX_IMPORT_FILE_SIZE_BYTES` on `ProductsController` (this codebase's only other file-upload limit) — no reason for a photo to need a different ceiling. = `5 * 1024 * 1024`
#### Función `assertValidDpiImage` (L15–27)

- **Tipo:** función exportada
- **Firma:** `assertValidDpiImage(file: UploadedDpiImage): void` — [assert-valid-dpi-image.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/utils/assert-valid-dpi-image.ts#L15)
- **Propósito / descripción:** Validated before ever opening the registration's transaction — a doomed upload should never take a DB transaction slot. Never trusts the frontend's own `accept="image/*"` hint alone.
- **Dependencias:** `ALLOWED_MIME_TYPES.has`, `new InvalidDpiImageError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidDpiImageError( 'La imagen del DPI debe ser JPG, PNG o WEBP.', )`, `new InvalidDpiImageError('La imagen del DPI no puede superar los 5 MB.')`, `new InvalidDpiImageError('La imagen del DPI está vacía.')`
- **Consumidores:** [register-recharge-sim-sale-with-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts"></a>

### assert-valid-operation-date.ts

- **Ruta:** [assert-valid-operation-date.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/utils/assert-valid-operation-date.ts) (`comercial-jhoel-api/src/modules/recharges/application/utils/assert-valid-operation-date.ts`, 17 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** A recharge operation (purchase, saldo final via its own daily-balance id, sales closure) can legitimately be dated in the past — catching up on a day that wasn't closed out in time — but never further than one calendar day in the future.
- **Depende de (archivos del proyecto):** [invalid-recharge-date.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-recharge-date-error-ts), [today-iso-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-today-iso-date-ts)
- **Consumidores:** [close-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts), [create-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-create-recharge-sale-use-case-ts), [get-recharge-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-daily-summary-use-case-ts), [get-recharge-purchases.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-purchases-use-case-ts), [get-recharge-sales-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-summary-use-case-ts), [get-recharge-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-use-case-ts), [get-recharge-sim-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-daily-summary-use-case-ts), [list-recharge-sim-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sales-use-case-ts), [open-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-open-recharge-day-use-case-ts), [register-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-purchase-use-case-ts), [register-recharge-sales-closure.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sales-closure-use-case-ts), [register-recharge-sim-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-purchase-use-case-ts), [register-recharge-sim-sale-with-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts), [register-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-use-case-ts)
#### Función `assertValidOperationDate` (L12–16)

- **Tipo:** función exportada
- **Firma:** `assertValidOperationDate(date: string): void` — [assert-valid-operation-date.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/utils/assert-valid-operation-date.ts#L12)
- **Propósito / descripción:** A recharge operation (purchase, saldo final via its own daily-balance id, sales closure) can legitimately be dated in the past — catching up on a day that wasn't closed out in time — but never further than one calendar day in the future. Applied to both reads that lazily create a row (`GET /recharges/daily`, `GET /recharges/sales-summary`) and writes, so a caller can't create a phantom future-dated row just by querying one.
- **Dependencias:** `maxAllowedOperationDate`, `new InvalidRechargeDateError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidRechargeDateError()`
- **Consumidores:** [close-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts), [create-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-create-recharge-sale-use-case-ts), [get-recharge-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-daily-summary-use-case-ts), [get-recharge-purchases.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-purchases-use-case-ts), [get-recharge-sales-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-summary-use-case-ts), [get-recharge-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-use-case-ts), [get-recharge-sim-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-daily-summary-use-case-ts), [list-recharge-sim-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sales-use-case-ts), [open-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-open-recharge-day-use-case-ts), [register-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-purchase-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-application-utils-today-iso-date-ts"></a>

### today-iso-date.ts

- **Ruta:** [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/utils/today-iso-date.ts) (`comercial-jhoel-api/src/modules/recharges/application/utils/today-iso-date.ts`, 32 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Utilidad: declara `toIsoDate`, `todayIsoDate`, `maxAllowedOperationDate` (sin comentario de documentación en el código).
- **Consumidores:** [get-recharge-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-daily-summary-use-case-ts), [get-recharge-operators-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-operators-summary-use-case-ts), [get-recharge-purchases.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-purchases-use-case-ts), [get-recharge-sales-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-summary-use-case-ts), [get-recharge-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-use-case-ts), [get-recharge-sim-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-daily-summary-use-case-ts), [list-recharge-sim-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sales-use-case-ts), [assert-recharge-day-writable.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-recharge-day-writable-ts), [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts), [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts), [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)
#### Función `toIsoDate` (L1–6)

- **Tipo:** función local del archivo
- **Firma:** `toIsoDate(date: Date): string` — [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/utils/today-iso-date.ts#L1)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `date.getFullYear`, `String(date.getMonth() + 1).padStart`, `String`, `date.getMonth`, `String(date.getDate()).padStart`, `date.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `todayIsoDate` (L13–15)

- **Tipo:** función exportada
- **Firma:** `todayIsoDate(): string` — [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/utils/today-iso-date.ts#L13)
- **Propósito / descripción:** `yyyy-MM-dd` in local server time — no explicit UTC normalization, consistent with how the Reports module and `CreatePurchaseUseCase` already treat "today"/date filters elsewhere in this codebase.
- **Dependencias:** `toIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-recharge-operators-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-operators-summary-use-case-ts), [assert-recharge-day-writable.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-recharge-day-writable-ts), [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts), [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Función `maxAllowedOperationDate` (L27–31)

- **Tipo:** función exportada
- **Firma:** `maxAllowedOperationDate(): string` — [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/recharges/application/utils/today-iso-date.ts#L27)
- **Propósito / descripción:** One calendar day past today, local server time — the furthest `operationDate` an authenticated caller may write to (see `assertValidOperationDate`). Expressed in whole days, not milliseconds, since every Recargas date is a plain calendar day, never a timestamp — the day-granularity equivalent of `CreatePurchaseUseCase`'s `FUTURE_DATE_GRACE_MS`, which exists to absorb client/server clock and timezone skew around "today" rather than to permit genuine backdating into the future.
- **Dependencias:** `new Date`, `date.setDate`, `date.getDate`, `toIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-daily-balance-entity-ts"></a>

### recharge-daily-balance.entity.ts

- **Ruta:** [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts) (`comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts`, 117 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** One row per (recharge type, calendar day) — the day's running total for that operator.
- **Consumidores:** [build-alerts.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-spec-ts), [build-alerts.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-ts), [recharge-daily-balance-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-daily-balance-output-ts), [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts), [recharge-daily-balance.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-mapper-ts), [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargeDailyBalanceProps` (L1): sin documentación — miembros: `id`, `rechargeTypeId`, `rechargeTypeName`, `date`, `sequence`, `previousBalance`, `dailyBalance`, `finalBalance`, `totalPurchaseAmount`, `createdByUserId`, `createdByUsername`, `updatedByUserId`, `updatedByUsername`, `createdAt`, `updatedAt`

#### Clase `RechargeDailyBalance` (L31–116)

- **Propósito:** One row per (recharge type, calendar day) — the day's running total for that operator. `totalPurchases` and `sale` are deliberately NOT stored columns: both are always exactly derivable from the three balances this row already holds (`dailyBalance - previousBalance`, `dailyBalance - finalBalance`), so storing them would just be a second copy of the same fact that could drift — same "derive, don't duplicate" choice the Reports module already made for its own KPIs.
- **Dependencias inyectadas (constructor):** `props: RechargeDailyBalanceProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 34–36 | `props: RechargeDailyBalanceProps` | `RechargeDailyBalance` |
| `id` | getter public | 38–40 | — | `string` |
| `rechargeTypeId` | getter public | 42–44 | — | `string` |
| `rechargeTypeName` | getter public | 46–48 | — | `string` |
| `date` | getter public | 50–52 | — | `string` |
| `sequence` | getter public | 54–56 | — | `number` |
| `previousBalance` | getter public | 58–60 | — | `number` |
| `dailyBalance` | getter public | 62–64 | — | `number` |
| `finalBalance` | getter public | 66–68 | — | `number \| null` |
| `totalPurchases` | getter public | 77–79 | — | `number` |
| `totalPurchaseAmount` | getter public | 82–84 | — | `number` |
| `sale` | getter public | 87–91 | — | `number \| null` |
| `createdByUserId` | getter public | 93–95 | — | `string` |
| `createdByUsername` | getter public | 97–99 | — | `string` |
| `updatedByUserId` | getter public | 101–103 | — | `string \| null` |
| `updatedByUsername` | getter public | 105–107 | — | `string \| null` |
| `createdAt` | getter public | 109–111 | — | `Date` |
| `updatedAt` | getter public | 113–115 | — | `Date` |

##### `RechargeDailyBalance.create`

- **Firma:** `create(props: RechargeDailyBalanceProps): RechargeDailyBalance` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new RechargeDailyBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [build-alerts.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-spec-ts), [recharge-daily-balance.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-mapper-ts)

##### `RechargeDailyBalance.id`

- **Firma:** `id(): string` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.rechargeTypeId`

- **Firma:** `rechargeTypeId(): string` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.rechargeTypeName`

- **Firma:** `rechargeTypeName(): string` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.date`

- **Firma:** `date(): string` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.sequence`

- **Firma:** `sequence(): number` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.previousBalance`

- **Firma:** `previousBalance(): number` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.dailyBalance`

- **Firma:** `dailyBalance(): number` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L62) (L62–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.finalBalance`

- **Firma:** `finalBalance(): number \| null` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L66) (L66–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.totalPurchases`

- **Firma:** `totalPurchases(): number` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L77) (L77–79)
- **Propósito / descripción:** "Acreditado" — how much actually fed the running balance today, always `dailyBalance - previousBalance`. Kept as a derived getter (unchanged since before the Monto de Compra/Acreditado split) since `dailyBalance` only ever grows by `creditedAmount`, never `purchaseAmount` — this value and `totalPurchaseAmount` (see prop) can legitimately differ now.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.totalPurchaseAmount`

- **Firma:** `totalPurchaseAmount(): number` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L82) (L82–84)
- **Propósito / descripción:** "Compra" — real sum of every purchase's `purchaseAmount` this cycle, informational only.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.sale`

- **Firma:** `sale(): number \| null` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L87) (L87–91)
- **Propósito / descripción:** `null` until the day is closed (no `finalBalance` yet) — never a premature 0.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.createdByUserId`

- **Firma:** `createdByUserId(): string` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L93) (L93–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.createdByUsername`

- **Firma:** `createdByUsername(): string` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L97) (L97–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.updatedByUserId`

- **Firma:** `updatedByUserId(): string \| null` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L101) (L101–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L105) (L105–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.createdAt`

- **Firma:** `createdAt(): Date` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L109) (L109–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDailyBalance.updatedAt`

- **Firma:** `updatedAt(): Date` — [recharge-daily-balance.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-daily-balance.entity.ts#L113) (L113–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-day-audit-log-entity-ts"></a>

### recharge-day-audit-log.entity.ts

- **Ruta:** [recharge-day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-audit-log.entity.ts) (`comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-audit-log.entity.ts`, 68 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** One row per CYCLE transition of a Recargas day (opening, closing, reopening, cancellation) — not a generic field-change log, same scope as Banks' own `DayAuditLog`.
- **Consumidores:** [recharge-day-detail-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-detail-output-ts), [recharge-day-audit-log.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-audit-log-repository-ts), [recharge-day-audit-log.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-audit-log-mapper-ts), [typeorm-recharge-day-audit-log.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-audit-log-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargeDayAuditLogProps` (L4): sin documentación — miembros: `id`, `date`, `action`, `performedBy`, `performedByUsername`, `performedAt`, `reason`, `previousStatus`, `newStatus`
- `type RechargeDayAuditAction` (L1) = `'OPENED' \| 'CLOSED' \| 'REOPENED' \| 'CANCELLED'`

#### Clase `RechargeDayAuditLog` (L25–67)

- **Propósito:** One row per CYCLE transition of a Recargas day (opening, closing, reopening, cancellation) — not a generic field-change log, same scope as Banks' own `DayAuditLog`. Deliberately does NOT log individual purchase/sale/cuadre operations — those already have their own historical trail (`recharge_purchases`, `recharge_sales`, `recharge_sales_closures`); this table is only the day cycle's own history.
- **Dependencias inyectadas (constructor):** `props: RechargeDayAuditLogProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 28–30 | `props: RechargeDayAuditLogProps` | `RechargeDayAuditLog` |
| `id` | getter public | 32–34 | — | `string` |
| `date` | getter public | 36–38 | — | `string` |
| `action` | getter public | 40–42 | — | `RechargeDayAuditAction` |
| `performedBy` | getter public | 44–46 | — | `string` |
| `performedByUsername` | getter public | 48–50 | — | `string` |
| `performedAt` | getter public | 52–54 | — | `Date` |
| `reason` | getter public | 56–58 | — | `string \| null` |
| `previousStatus` | getter public | 60–62 | — | `string \| null` |
| `newStatus` | getter public | 64–66 | — | `string \| null` |

##### `RechargeDayAuditLog.create`

- **Firma:** `create(props: RechargeDayAuditLogProps): RechargeDayAuditLog` — [recharge-day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-audit-log.entity.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new RechargeDayAuditLog`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-day-audit-log.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-audit-log-mapper-ts), [typeorm-recharge-day-audit-log.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-audit-log-repository-ts)

##### `RechargeDayAuditLog.id`

- **Firma:** `id(): string` — [recharge-day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-audit-log.entity.ts#L32) (L32–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayAuditLog.date`

- **Firma:** `date(): string` — [recharge-day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-audit-log.entity.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayAuditLog.action`

- **Firma:** `action(): RechargeDayAuditAction` — [recharge-day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-audit-log.entity.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayAuditLog.performedBy`

- **Firma:** `performedBy(): string` — [recharge-day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-audit-log.entity.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayAuditLog.performedByUsername`

- **Firma:** `performedByUsername(): string` — [recharge-day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-audit-log.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayAuditLog.performedAt`

- **Firma:** `performedAt(): Date` — [recharge-day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-audit-log.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayAuditLog.reason`

- **Firma:** `reason(): string \| null` — [recharge-day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-audit-log.entity.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayAuditLog.previousStatus`

- **Firma:** `previousStatus(): string \| null` — [recharge-day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-audit-log.entity.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayAuditLog.newStatus`

- **Firma:** `newStatus(): string \| null` — [recharge-day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-audit-log.entity.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-day-opening-entity-ts"></a>

### recharge-day-opening.entity.ts

- **Ruta:** [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts) (`comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts`, 119 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "The user confirmed they want to start registering recharge operations for this date" — a fully independent cycle from Banks' own `DayOpening` (see the migration's own doc comment for why the two modules can never share one table).
- **Consumidores:** [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [recharge-day-opening.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-opening-mapper-ts), [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargeDayOpeningProps` (L1): sin documentación — miembros: `id`, `date`, `openedBy`, `openedByUsername`, `openedAt`, `closedAt`, `closedBy`, `closedByUsername`, `reopenedAt`, `reopenedBy`, `reopenedByUsername`, `reopenReason`, `isCancelled`, `cancelledAt`, `cancelledBy`, `cancelledByUsername`, `cancelReason`

#### Clase `RechargeDayOpening` (L28–118)

- **Propósito:** "The user confirmed they want to start registering recharge operations for this date" — a fully independent cycle from Banks' own `DayOpening` (see the migration's own doc comment for why the two modules can never share one table). Unlike Banks, closing this cycle never carries a business/reconciliation row of its own — see `isClosed`'s own comment.
- **Dependencias inyectadas (constructor):** `props: RechargeDayOpeningProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 31–33 | `props: RechargeDayOpeningProps` | `RechargeDayOpening` |
| `id` | getter public | 35–37 | — | `string` |
| `date` | getter public | 39–41 | — | `string` |
| `openedBy` | getter public | 43–45 | — | `string` |
| `openedByUsername` | getter public | 47–49 | — | `string` |
| `openedAt` | getter public | 51–53 | — | `Date` |
| `closedAt` | getter public | 55–57 | — | `Date \| null` |
| `closedBy` | getter public | 59–61 | — | `string \| null` |
| `closedByUsername` | getter public | 63–65 | — | `string` |
| `reopenedAt` | getter public | 67–69 | — | `Date \| null` |
| `reopenedBy` | getter public | 71–73 | — | `string \| null` |
| `reopenedByUsername` | getter public | 75–77 | — | `string` |
| `reopenReason` | getter public | 79–81 | — | `string \| null` |
| `isCancelled` | getter public | 83–85 | — | `boolean` |
| `cancelledAt` | getter public | 87–89 | — | `Date \| null` |
| `cancelledBy` | getter public | 91–93 | — | `string \| null` |
| `cancelledByUsername` | getter public | 95–97 | — | `string` |
| `cancelReason` | getter public | 99–101 | — | `string \| null` |
| `isClosed` | getter public | 110–112 | — | `boolean` |
| `isReopened` | getter public | 115–117 | — | `boolean` |

##### `RechargeDayOpening.create`

- **Firma:** `create(props: RechargeDayOpeningProps): RechargeDayOpening` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new RechargeDayOpening`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-day-opening.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-opening-mapper-ts), [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts)

##### `RechargeDayOpening.id`

- **Firma:** `id(): string` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.date`

- **Firma:** `date(): string` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.openedBy`

- **Firma:** `openedBy(): string` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.openedByUsername`

- **Firma:** `openedByUsername(): string` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.openedAt`

- **Firma:** `openedAt(): Date` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.closedAt`

- **Firma:** `closedAt(): Date \| null` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.closedBy`

- **Firma:** `closedBy(): string \| null` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.closedByUsername`

- **Firma:** `closedByUsername(): string` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.reopenedAt`

- **Firma:** `reopenedAt(): Date \| null` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.reopenedBy`

- **Firma:** `reopenedBy(): string \| null` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.reopenedByUsername`

- **Firma:** `reopenedByUsername(): string` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.reopenReason`

- **Firma:** `reopenReason(): string \| null` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.isCancelled`

- **Firma:** `isCancelled(): boolean` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.cancelledAt`

- **Firma:** `cancelledAt(): Date \| null` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L87) (L87–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.cancelledBy`

- **Firma:** `cancelledBy(): string \| null` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L91) (L91–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.cancelledByUsername`

- **Firma:** `cancelledByUsername(): string` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.cancelReason`

- **Firma:** `cancelReason(): string \| null` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L99) (L99–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.isClosed`

- **Firma:** `isClosed(): boolean` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L110) (L110–112)
- **Propósito / descripción:** "The day is already closed and can't accept new operations" — the only question every write use case in this module actually cares about (see `assertRechargeDayWritable`). Deliberately still `false` for a REOPENED day (`closedAt` goes back to `null`), same reasoning as Banks' own `DayOpening.isClosed`.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDayOpening.isReopened`

- **Firma:** `isReopened(): boolean` — [recharge-day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-day-opening.entity.ts#L115) (L115–117)
- **Propósito / descripción:** Was closed, then reopened, and hasn't been closed again yet.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-purchase-entity-ts"></a>

### recharge-purchase.entity.ts

- **Ruta:** [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts) (`comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts`, 103 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** One individual recharge purchase — the counterpart to `RechargeSale` on the "bought from the operator" side.
- **Consumidores:** [recharge-purchase-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-purchase-output-ts), [recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-purchase-repository-ts), [recharge-purchase.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-purchase-mapper-ts), [typeorm-recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-purchase-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargePurchaseProps` (L1): sin documentación — miembros: `id`, `rechargeTypeId`, `rechargeTypeName`, `dailyBalanceId`, `amount`, `creditedAmount`, `date`, `locked`, `createdByUserId`, `createdByUsername`, `createdAt`, `isVoided`, `voidedAt`, `voidedByUserId`, `voidedByUsername`, `voidReason`

#### Clase `RechargePurchase` (L32–102)

- **Propósito:** One individual recharge purchase — the counterpart to `RechargeSale` on the "bought from the operator" side. Kept forever for audit/history; `dailyBalanceId` ties it to the exact cuadre cycle it was recorded under. Never physically deleted — corrected only via a "Revertir" action (`voidRechargePurchase`), same convention as `bank_deposit_operations`/`recharge_cash_box_movements`.
- **Dependencias inyectadas (constructor):** `props: RechargePurchaseProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 35–37 | `props: RechargePurchaseProps` | `RechargePurchase` |
| `id` | getter public | 39–41 | — | `string` |
| `rechargeTypeId` | getter public | 43–45 | — | `string` |
| `rechargeTypeName` | getter public | 47–49 | — | `string` |
| `dailyBalanceId` | getter public | 51–53 | — | `string` |
| `amount` | getter public | 55–57 | — | `number` |
| `creditedAmount` | getter public | 59–61 | — | `number` |
| `date` | getter public | 63–65 | — | `string` |
| `locked` | getter public | 67–69 | — | `boolean` |
| `createdByUserId` | getter public | 71–73 | — | `string` |
| `createdByUsername` | getter public | 75–77 | — | `string` |
| `createdAt` | getter public | 79–81 | — | `Date` |
| `isVoided` | getter public | 83–85 | — | `boolean` |
| `voidedAt` | getter public | 87–89 | — | `Date \| null` |
| `voidedByUserId` | getter public | 91–93 | — | `string \| null` |
| `voidedByUsername` | getter public | 95–97 | — | `string \| null` |
| `voidReason` | getter public | 99–101 | — | `string \| null` |

##### `RechargePurchase.create`

- **Firma:** `create(props: RechargePurchaseProps): RechargePurchase` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new RechargePurchase`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-purchase.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-purchase-mapper-ts)

##### `RechargePurchase.id`

- **Firma:** `id(): string` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.rechargeTypeId`

- **Firma:** `rechargeTypeId(): string` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.rechargeTypeName`

- **Firma:** `rechargeTypeName(): string` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.dailyBalanceId`

- **Firma:** `dailyBalanceId(): string` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.amount`

- **Firma:** `amount(): number` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.creditedAmount`

- **Firma:** `creditedAmount(): number` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.date`

- **Firma:** `date(): string` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.locked`

- **Firma:** `locked(): boolean` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.createdByUserId`

- **Firma:** `createdByUserId(): string` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.createdByUsername`

- **Firma:** `createdByUsername(): string` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.createdAt`

- **Firma:** `createdAt(): Date` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.isVoided`

- **Firma:** `isVoided(): boolean` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.voidedAt`

- **Firma:** `voidedAt(): Date \| null` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L87) (L87–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.voidedByUserId`

- **Firma:** `voidedByUserId(): string \| null` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L91) (L91–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.voidedByUsername`

- **Firma:** `voidedByUsername(): string \| null` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargePurchase.voidReason`

- **Firma:** `voidReason(): string \| null` — [recharge-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-purchase.entity.ts#L99) (L99–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sale-entity-ts"></a>

### recharge-sale.entity.ts

- **Ruta:** [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts) (`comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts`, 90 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** One individually-sold recharge (a customer's top-up) — the counterpart to `RechargeDailyBalance`'s purchase side.
- **Consumidores:** [recharge-sale-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sale-output-ts), [recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sale-repository-ts), [recharge-sale.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-mapper-ts), [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSaleProps` (L1): sin documentación — miembros: `id`, `rechargeTypeId`, `rechargeTypeName`, `dailyBalanceId`, `phoneNumber`, `amount`, `date`, `locked`, `createdByUserId`, `createdByUsername`, `updatedByUserId`, `updatedByUsername`, `createdAt`, `updatedAt`

#### Clase `RechargeSale` (L27–89)

- **Propósito:** One individually-sold recharge (a customer's top-up) — the counterpart to `RechargeDailyBalance`'s purchase side. Kept forever for audit/history; `dailyBalanceId` ties it to the exact cuadre cycle it was recorded under, which is also what makes `locked` derivable rather than a separately tracked flag (see the migration's own comment).
- **Dependencias inyectadas (constructor):** `props: RechargeSaleProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 30–32 | `props: RechargeSaleProps` | `RechargeSale` |
| `id` | getter public | 34–36 | — | `string` |
| `rechargeTypeId` | getter public | 38–40 | — | `string` |
| `rechargeTypeName` | getter public | 42–44 | — | `string` |
| `dailyBalanceId` | getter public | 46–48 | — | `string` |
| `phoneNumber` | getter public | 50–52 | — | `string` |
| `amount` | getter public | 54–56 | — | `number` |
| `date` | getter public | 58–60 | — | `string` |
| `locked` | getter public | 62–64 | — | `boolean` |
| `createdByUserId` | getter public | 66–68 | — | `string` |
| `createdByUsername` | getter public | 70–72 | — | `string` |
| `updatedByUserId` | getter public | 74–76 | — | `string \| null` |
| `updatedByUsername` | getter public | 78–80 | — | `string \| null` |
| `createdAt` | getter public | 82–84 | — | `Date` |
| `updatedAt` | getter public | 86–88 | — | `Date` |

##### `RechargeSale.create`

- **Firma:** `create(props: RechargeSaleProps): RechargeSale` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L30) (L30–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new RechargeSale`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-sale.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-mapper-ts)

##### `RechargeSale.id`

- **Firma:** `id(): string` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSale.rechargeTypeId`

- **Firma:** `rechargeTypeId(): string` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSale.rechargeTypeName`

- **Firma:** `rechargeTypeName(): string` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSale.dailyBalanceId`

- **Firma:** `dailyBalanceId(): string` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSale.phoneNumber`

- **Firma:** `phoneNumber(): string` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSale.amount`

- **Firma:** `amount(): number` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSale.date`

- **Firma:** `date(): string` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSale.locked`

- **Firma:** `locked(): boolean` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L62) (L62–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSale.createdByUserId`

- **Firma:** `createdByUserId(): string` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L66) (L66–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSale.createdByUsername`

- **Firma:** `createdByUsername(): string` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L70) (L70–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSale.updatedByUserId`

- **Firma:** `updatedByUserId(): string \| null` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSale.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSale.createdAt`

- **Firma:** `createdAt(): Date` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSale.updatedAt`

- **Firma:** `updatedAt(): Date` — [recharge-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sale.entity.ts#L86) (L86–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sales-closure-entity-ts"></a>

### recharge-sales-closure.entity.ts

- **Ruta:** [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts) (`comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts`, 83 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** One row per calendar day — the daily cash reconciliation ("cuadre") across every recharge type.
- **Consumidores:** [recharge-sales-closure-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sales-closure-output-ts), [recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sales-closure-repository-ts), [recharge-sales-closure.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sales-closure-mapper-ts), [typeorm-recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sales-closure-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSalesClosureProps` (L1): sin documentación — miembros: `id`, `date`, `sequence`, `totalSales`, `totalCollected`, `result`, `createdByUserId`, `createdByUsername`, `updatedByUserId`, `updatedByUsername`, `createdAt`, `updatedAt`

#### Clase `RechargeSalesClosure` (L28–82)

- **Propósito:** One row per calendar day — the daily cash reconciliation ("cuadre") across every recharge type. Unlike `RechargeDailyBalance`'s `totalPurchases`/ `sale`, `totalSales`/`result` here ARE stored, not derived on read: a closure is a frozen historical fact the moment it's saved, and must stay exactly what it was even if a later admin correction to some type's `finalBalance` would change what the *live* sales figures currently compute to. Re-saving (an authorized edit) explicitly recomputes and overwrites both — see `register_recharge_sales_closure`.
- **Dependencias inyectadas (constructor):** `props: RechargeSalesClosureProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 31–33 | `props: RechargeSalesClosureProps` | `RechargeSalesClosure` |
| `id` | getter public | 35–37 | — | `string` |
| `date` | getter public | 39–41 | — | `string` |
| `sequence` | getter public | 43–45 | — | `number` |
| `totalSales` | getter public | 47–49 | — | `number` |
| `totalCollected` | getter public | 51–53 | — | `number` |
| `result` | getter public | 55–57 | — | `number` |
| `createdByUserId` | getter public | 59–61 | — | `string` |
| `createdByUsername` | getter public | 63–65 | — | `string` |
| `updatedByUserId` | getter public | 67–69 | — | `string \| null` |
| `updatedByUsername` | getter public | 71–73 | — | `string \| null` |
| `createdAt` | getter public | 75–77 | — | `Date` |
| `updatedAt` | getter public | 79–81 | — | `Date` |

##### `RechargeSalesClosure.create`

- **Firma:** `create(props: RechargeSalesClosureProps): RechargeSalesClosure` — [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new RechargeSalesClosure`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-sales-closure.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sales-closure-mapper-ts)

##### `RechargeSalesClosure.id`

- **Firma:** `id(): string` — [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSalesClosure.date`

- **Firma:** `date(): string` — [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSalesClosure.sequence`

- **Firma:** `sequence(): number` — [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSalesClosure.totalSales`

- **Firma:** `totalSales(): number` — [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSalesClosure.totalCollected`

- **Firma:** `totalCollected(): number` — [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSalesClosure.result`

- **Firma:** `result(): number` — [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSalesClosure.createdByUserId`

- **Firma:** `createdByUserId(): string` — [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSalesClosure.createdByUsername`

- **Firma:** `createdByUsername(): string` — [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSalesClosure.updatedByUserId`

- **Firma:** `updatedByUserId(): string \| null` — [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSalesClosure.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSalesClosure.createdAt`

- **Firma:** `createdAt(): Date` — [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSalesClosure.updatedAt`

- **Firma:** `updatedAt(): Date` — [recharge-sales-closure.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sales-closure.entity.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-daily-stock-entity-ts"></a>

### recharge-sim-daily-stock.entity.ts

- **Ruta:** [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts) (`comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts`, 101 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** One row per (SIM type, calendar day) — mirrors `RechargeDailyBalance` but for physical stock instead of a cash balance: no `finalBalance`/`sequence` concept, since stock never "closes and resets" — `currentStock` is always the live, correct stock as of that day, and IS the "stock final" the cuadre shows (no separate confirmation step needed).
- **Consumidores:** [recharge-sim-daily-stock-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-daily-stock-output-ts), [recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-daily-stock-repository-ts), [recharge-sim-daily-stock.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-daily-stock-mapper-ts), [typeorm-recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-daily-stock-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSimDailyStockProps` (L1): sin documentación — miembros: `id`, `simTypeId`, `simTypeName`, `date`, `previousStock`, `currentStock`, `purchasedQuantity`, `purchasedTotal`, `soldQuantity`, `soldTotal`, `createdByUserId`, `createdByUsername`, `updatedByUserId`, `updatedByUsername`, `createdAt`, `updatedAt`

#### Clase `RechargeSimDailyStock` (L30–100)

- **Propósito:** One row per (SIM type, calendar day) — mirrors `RechargeDailyBalance` but for physical stock instead of a cash balance: no `finalBalance`/`sequence` concept, since stock never "closes and resets" — `currentStock` is always the live, correct stock as of that day, and IS the "stock final" the cuadre shows (no separate confirmation step needed).
- **Dependencias inyectadas (constructor):** `props: RechargeSimDailyStockProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 33–35 | `props: RechargeSimDailyStockProps` | `RechargeSimDailyStock` |
| `id` | getter public | 37–39 | — | `string` |
| `simTypeId` | getter public | 41–43 | — | `string` |
| `simTypeName` | getter public | 45–47 | — | `string` |
| `date` | getter public | 49–51 | — | `string` |
| `previousStock` | getter public | 53–55 | — | `number` |
| `currentStock` | getter public | 57–59 | — | `number` |
| `purchasedQuantity` | getter public | 61–63 | — | `number` |
| `purchasedTotal` | getter public | 65–67 | — | `number` |
| `soldQuantity` | getter public | 69–71 | — | `number` |
| `soldTotal` | getter public | 73–75 | — | `number` |
| `createdByUserId` | getter public | 77–79 | — | `string` |
| `createdByUsername` | getter public | 81–83 | — | `string` |
| `updatedByUserId` | getter public | 85–87 | — | `string \| null` |
| `updatedByUsername` | getter public | 89–91 | — | `string \| null` |
| `createdAt` | getter public | 93–95 | — | `Date` |
| `updatedAt` | getter public | 97–99 | — | `Date` |

##### `RechargeSimDailyStock.create`

- **Firma:** `create(props: RechargeSimDailyStockProps): RechargeSimDailyStock` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new RechargeSimDailyStock`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-sim-daily-stock.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-daily-stock-mapper-ts)

##### `RechargeSimDailyStock.id`

- **Firma:** `id(): string` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.simTypeId`

- **Firma:** `simTypeId(): string` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.simTypeName`

- **Firma:** `simTypeName(): string` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.date`

- **Firma:** `date(): string` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.previousStock`

- **Firma:** `previousStock(): number` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.currentStock`

- **Firma:** `currentStock(): number` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.purchasedQuantity`

- **Firma:** `purchasedQuantity(): number` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.purchasedTotal`

- **Firma:** `purchasedTotal(): number` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L65) (L65–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.soldQuantity`

- **Firma:** `soldQuantity(): number` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.soldTotal`

- **Firma:** `soldTotal(): number` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.createdByUserId`

- **Firma:** `createdByUserId(): string` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.createdByUsername`

- **Firma:** `createdByUsername(): string` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.updatedByUserId`

- **Firma:** `updatedByUserId(): string \| null` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L89) (L89–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.createdAt`

- **Firma:** `createdAt(): Date` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L93) (L93–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimDailyStock.updatedAt`

- **Firma:** `updatedAt(): Date` — [recharge-sim-daily-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-daily-stock.entity.ts#L97) (L97–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-sale-registration-entity-ts"></a>

### recharge-sim-sale-registration.entity.ts

- **Ruta:** [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts) (`comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts`, 121 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** One physical SIM sold with identity capture (número de SIM, SKU, DPI del comprador, foto) — a compliance record layered on top of one `quantity=1` row in the existing `recharge_sim_sales` table (see the migration's own doc comment for why this is additive, not a replacement).
- **Consumidores:** [recharge-sim-sale-registration-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-sale-registration-output-ts), [recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-registration-repository-ts), [recharge-sim-sale-registration.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-sale-registration-mapper-ts), [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSimSaleRegistrationProps` (L1): sin documentación — miembros: `id`, `rechargeSimSaleId`, `simTypeId`, `simTypeName`, `simNumber`, `sku`, `clientDpi`, `clientId`, `clientName`, `salePrice`, `saleDate`, `hasDpiImage`, `isVoided`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `createdBy`, `createdByUsername`, `createdAt`

#### Clase `RechargeSimSaleRegistration` (L34–120)

- **Propósito:** One physical SIM sold with identity capture (número de SIM, SKU, DPI del comprador, foto) — a compliance record layered on top of one `quantity=1` row in the existing `recharge_sim_sales` table (see the migration's own doc comment for why this is additive, not a replacement). Void-only, same "anular con motivo, nunca editar/borrar" rule as every other financial record in this codebase.
- **Dependencias inyectadas (constructor):** `props: RechargeSimSaleRegistrationProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 37–39 | `props: RechargeSimSaleRegistrationProps` | `RechargeSimSaleRegistration` |
| `id` | getter public | 41–43 | — | `string` |
| `rechargeSimSaleId` | getter public | 45–47 | — | `string` |
| `simTypeId` | getter public | 49–51 | — | `string` |
| `simTypeName` | getter public | 53–55 | — | `string` |
| `simNumber` | getter public | 57–59 | — | `string` |
| `sku` | getter public | 61–63 | — | `string` |
| `clientDpi` | getter public | 65–67 | — | `string` |
| `clientId` | getter public | 69–71 | — | `string \| null` |
| `clientName` | getter public | 73–75 | — | `string \| null` |
| `salePrice` | getter public | 77–79 | — | `number` |
| `saleDate` | getter public | 81–83 | — | `string` |
| `hasDpiImage` | getter public | 85–87 | — | `boolean` |
| `isVoided` | getter public | 89–91 | — | `boolean` |
| `voidedAt` | getter public | 93–95 | — | `Date \| null` |
| `voidedBy` | getter public | 97–99 | — | `string \| null` |
| `voidedByUsername` | getter public | 101–103 | — | `string \| null` |
| `voidReason` | getter public | 105–107 | — | `string \| null` |
| `createdBy` | getter public | 109–111 | — | `string` |
| `createdByUsername` | getter public | 113–115 | — | `string` |
| `createdAt` | getter public | 117–119 | — | `Date` |

##### `RechargeSimSaleRegistration.create`

- **Firma:** `create(props: RechargeSimSaleRegistrationProps): RechargeSimSaleRegistration` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new RechargeSimSaleRegistration`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.id`

- **Firma:** `id(): string` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.rechargeSimSaleId`

- **Firma:** `rechargeSimSaleId(): string` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.simTypeId`

- **Firma:** `simTypeId(): string` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.simTypeName`

- **Firma:** `simTypeName(): string` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.simNumber`

- **Firma:** `simNumber(): string` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.sku`

- **Firma:** `sku(): string` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.clientDpi`

- **Firma:** `clientDpi(): string` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L65) (L65–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.clientId`

- **Firma:** `clientId(): string \| null` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.clientName`

- **Firma:** `clientName(): string \| null` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.salePrice`

- **Firma:** `salePrice(): number` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.saleDate`

- **Firma:** `saleDate(): string` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.hasDpiImage`

- **Firma:** `hasDpiImage(): boolean` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.isVoided`

- **Firma:** `isVoided(): boolean` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L89) (L89–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.voidedAt`

- **Firma:** `voidedAt(): Date \| null` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L93) (L93–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.voidedBy`

- **Firma:** `voidedBy(): string \| null` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L97) (L97–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.voidedByUsername`

- **Firma:** `voidedByUsername(): string \| null` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L101) (L101–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.voidReason`

- **Firma:** `voidReason(): string \| null` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L105) (L105–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.createdBy`

- **Firma:** `createdBy(): string` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L109) (L109–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.createdByUsername`

- **Firma:** `createdByUsername(): string` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L113) (L113–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSaleRegistration.createdAt`

- **Firma:** `createdAt(): Date` — [recharge-sim-sale-registration.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale-registration.entity.ts#L117) (L117–119)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-sale-entity-ts"></a>

### recharge-sim-sale.entity.ts

- **Ruta:** [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts) (`comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts`, 108 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** One by-quantity "Vender SIM" sale (no identity capture) — the original, still-in-use quick-sale flow this module started with.
- **Consumidores:** [recharge-sim-sale-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-sale-output-ts), [recharge-sim-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-repository-ts), [recharge-sim-sale.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-sale-mapper-ts), [typeorm-recharge-sim-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSimSaleProps` (L1): sin documentación — miembros: `id`, `simTypeId`, `simTypeName`, `dailyStockId`, `quantity`, `unitPrice`, `totalAmount`, `saleDate`, `hasActiveRegistration`, `createdBy`, `createdByUsername`, `createdAt`, `isVoided`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`

#### Clase `RechargeSimSale` (L33–107)

- **Propósito:** One by-quantity "Vender SIM" sale (no identity capture) — the original, still-in-use quick-sale flow this module started with. Never physically deleted; corrected only via "Revertir" (`void_recharge_sim_sale`), same convention as `RechargePurchase`/`bank_deposit_operations`. Unlike `RechargePurchase`, this entity has no `locked` concept at all — SIM stock has no cuadre cycle/sequence, so the only thing that can block a revert is the sale's own day being closed or an active identity registration already covering the same physical sale.
- **Dependencias inyectadas (constructor):** `props: RechargeSimSaleProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 36–38 | `props: RechargeSimSaleProps` | `RechargeSimSale` |
| `id` | getter public | 40–42 | — | `string` |
| `simTypeId` | getter public | 44–46 | — | `string` |
| `simTypeName` | getter public | 48–50 | — | `string` |
| `dailyStockId` | getter public | 52–54 | — | `string` |
| `quantity` | getter public | 56–58 | — | `number` |
| `unitPrice` | getter public | 60–62 | — | `number` |
| `totalAmount` | getter public | 64–66 | — | `number` |
| `saleDate` | getter public | 68–70 | — | `string` |
| `hasActiveRegistration` | getter public | 72–74 | — | `boolean` |
| `createdBy` | getter public | 76–78 | — | `string` |
| `createdByUsername` | getter public | 80–82 | — | `string` |
| `createdAt` | getter public | 84–86 | — | `Date` |
| `isVoided` | getter public | 88–90 | — | `boolean` |
| `voidedAt` | getter public | 92–94 | — | `Date \| null` |
| `voidedBy` | getter public | 96–98 | — | `string \| null` |
| `voidedByUsername` | getter public | 100–102 | — | `string \| null` |
| `voidReason` | getter public | 104–106 | — | `string \| null` |

##### `RechargeSimSale.create`

- **Firma:** `create(props: RechargeSimSaleProps): RechargeSimSale` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new RechargeSimSale`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.id`

- **Firma:** `id(): string` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.simTypeId`

- **Firma:** `simTypeId(): string` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.simTypeName`

- **Firma:** `simTypeName(): string` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.dailyStockId`

- **Firma:** `dailyStockId(): string` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.quantity`

- **Firma:** `quantity(): number` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.unitPrice`

- **Firma:** `unitPrice(): number` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.totalAmount`

- **Firma:** `totalAmount(): number` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.saleDate`

- **Firma:** `saleDate(): string` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L68) (L68–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.hasActiveRegistration`

- **Firma:** `hasActiveRegistration(): boolean` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L72) (L72–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.createdBy`

- **Firma:** `createdBy(): string` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L76) (L76–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.createdByUsername`

- **Firma:** `createdByUsername(): string` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.createdAt`

- **Firma:** `createdAt(): Date` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L84) (L84–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.isVoided`

- **Firma:** `isVoided(): boolean` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L88) (L88–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.voidedAt`

- **Firma:** `voidedAt(): Date \| null` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L92) (L92–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.voidedBy`

- **Firma:** `voidedBy(): string \| null` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L96) (L96–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.voidedByUsername`

- **Firma:** `voidedByUsername(): string \| null` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L100) (L100–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimSale.voidReason`

- **Firma:** `voidReason(): string \| null` — [recharge-sim-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-sale.entity.ts#L104) (L104–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-type-entity-ts"></a>

### recharge-sim-type.entity.ts

- **Ruta:** [recharge-sim-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-type.entity.ts) (`comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-type.entity.ts`, 47 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** SIM Claro / SIM Tigo — a 2-row lookup, mirrors `RechargeType` exactly.
- **Consumidores:** [recharge-sim-type-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-sim-type-output-ts), [recharge-sim-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-type-repository-ts), [recharge-sim-type.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-type-mapper-ts), [typeorm-recharge-sim-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-type-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSimTypeProps` (L1): sin documentación — miembros: `id`, `name`, `costPrice`, `publicPrice`, `isActive`, `createdAt`, `updatedAt`

#### Clase `RechargeSimType` (L12–46)

- **Propósito:** SIM Claro / SIM Tigo — a 2-row lookup, mirrors `RechargeType` exactly. Prices are fixed catalog values, never accepted from a purchase/sale request.
- **Dependencias inyectadas (constructor):** `props: RechargeSimTypeProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 15–17 | `props: RechargeSimTypeProps` | `RechargeSimType` |
| `id` | getter public | 19–21 | — | `string` |
| `name` | getter public | 23–25 | — | `string` |
| `costPrice` | getter public | 27–29 | — | `number` |
| `publicPrice` | getter public | 31–33 | — | `number` |
| `isActive` | getter public | 35–37 | — | `boolean` |
| `createdAt` | getter public | 39–41 | — | `Date` |
| `updatedAt` | getter public | 43–45 | — | `Date` |

##### `RechargeSimType.create`

- **Firma:** `create(props: RechargeSimTypeProps): RechargeSimType` — [recharge-sim-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-type.entity.ts#L15) (L15–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new RechargeSimType`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-sim-type.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-type-mapper-ts)

##### `RechargeSimType.id`

- **Firma:** `id(): string` — [recharge-sim-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-type.entity.ts#L19) (L19–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimType.name`

- **Firma:** `name(): string` — [recharge-sim-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-type.entity.ts#L23) (L23–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimType.costPrice`

- **Firma:** `costPrice(): number` — [recharge-sim-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-type.entity.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimType.publicPrice`

- **Firma:** `publicPrice(): number` — [recharge-sim-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-type.entity.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimType.isActive`

- **Firma:** `isActive(): boolean` — [recharge-sim-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-type.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimType.createdAt`

- **Firma:** `createdAt(): Date` — [recharge-sim-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-type.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimType.updatedAt`

- **Firma:** `updatedAt(): Date` — [recharge-sim-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-sim-type.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-type-entity-ts"></a>

### recharge-type.entity.ts

- **Ruta:** [recharge-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-type.entity.ts) (`comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-type.entity.ts`, 49 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Claro/Tigo today — a normalized lookup row, not a hardcoded string, so a future operator is a new seeded row rather than a code change.
- **Consumidores:** [build-alerts.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-spec-ts), [build-alerts.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-ts), [recharge-type-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-type-output-ts), [update-recharge-type-min-balance.use-case.spec.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-spec-ts), [recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-type-repository-ts), [recharge-type.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-mapper-ts), [typeorm-recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-type-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargeTypeProps` (L1): sin documentación — miembros: `id`, `name`, `isActive`, `createdAt`, `updatedAt`, `minBalance`, `balanceLimit`

#### Clase `RechargeType` (L14–48)

- **Propósito:** Claro/Tigo today — a normalized lookup row, not a hardcoded string, so a future operator is a new seeded row rather than a code change.
- **Dependencias inyectadas (constructor):** `props: RechargeTypeProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 17–19 | `props: RechargeTypeProps` | `RechargeType` |
| `id` | getter public | 21–23 | — | `string` |
| `name` | getter public | 25–27 | — | `string` |
| `isActive` | getter public | 29–31 | — | `boolean` |
| `createdAt` | getter public | 33–35 | — | `Date` |
| `updatedAt` | getter public | 37–39 | — | `Date` |
| `minBalance` | getter public | 41–43 | — | `number` |
| `balanceLimit` | getter public | 45–47 | — | `number` |

##### `RechargeType.create`

- **Firma:** `create(props: RechargeTypeProps): RechargeType` — [recharge-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-type.entity.ts#L17) (L17–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new RechargeType`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [build-alerts.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-spec-ts), [update-recharge-type-min-balance.use-case.spec.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-spec-ts), [recharge-type.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-mapper-ts)

##### `RechargeType.id`

- **Firma:** `id(): string` — [recharge-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-type.entity.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeType.name`

- **Firma:** `name(): string` — [recharge-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-type.entity.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeType.isActive`

- **Firma:** `isActive(): boolean` — [recharge-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-type.entity.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeType.createdAt`

- **Firma:** `createdAt(): Date` — [recharge-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-type.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeType.updatedAt`

- **Firma:** `updatedAt(): Date` — [recharge-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-type.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeType.minBalance`

- **Firma:** `minBalance(): number` — [recharge-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-type.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeType.balanceLimit`

- **Firma:** `balanceLimit(): number` — [recharge-type.entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/entities/recharge-type.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-client-dpi-required-error-ts"></a>

### client-dpi-required.error.ts

- **Ruta:** [client-dpi-required.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/client-dpi-required.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/client-dpi-required.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `ClientDpiRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts)

#### Clase `ClientDpiRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-daily-balance-not-found-error-ts"></a>

### daily-balance-not-found.error.ts

- **Ruta:** [daily-balance-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/daily-balance-not-found.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/daily-balance-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `DailyBalanceNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [register-recharge-final-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-final-balance-use-case-ts), [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts)

#### Clase `DailyBalanceNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-day-already-closed-error-ts"></a>

### day-already-closed.error.ts

- **Ruta:** [day-already-closed.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/day-already-closed.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/day-already-closed.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `DayAlreadyClosedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts), [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts)

#### Clase `DayAlreadyClosedError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-final-balance-edit-forbidden-error-ts"></a>

### final-balance-edit-forbidden.error.ts

- **Ruta:** [final-balance-edit-forbidden.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/final-balance-edit-forbidden.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/final-balance-edit-forbidden.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `FinalBalanceEditForbiddenError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [register-recharge-final-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-final-balance-use-case-ts)

#### Clase `FinalBalanceEditForbiddenError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-final-balance-exceeds-daily-error-ts"></a>

### final-balance-exceeds-daily.error.ts

- **Ruta:** [final-balance-exceeds-daily.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/final-balance-exceeds-daily.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/final-balance-exceeds-daily.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `FinalBalanceExceedsDailyError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts)

#### Clase `FinalBalanceExceedsDailyError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-insufficient-balance-to-revert-error-ts"></a>

### insufficient-balance-to-revert.error.ts

- **Ruta:** [insufficient-balance-to-revert.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/insufficient-balance-to-revert.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/insufficient-balance-to-revert.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `InsufficientBalanceToRevertError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-purchase-repository-ts)

#### Clase `InsufficientBalanceToRevertError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-insufficient-sim-stock-error-ts"></a>

### insufficient-sim-stock.error.ts

- **Ruta:** [insufficient-sim-stock.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/insufficient-sim-stock.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/insufficient-sim-stock.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Enforced in `register_recharge_sim_sale()` under a `FOR UPDATE` row lock — never trusts the frontend's own stock check.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-daily-stock-repository-ts)

#### Clase `InsufficientSimStockError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Enforced in `register_recharge_sim_sale()` under a `FOR UPDATE` row lock — never trusts the frontend's own stock check.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-balance-limit-error-ts"></a>

### invalid-balance-limit.error.ts

- **Ruta:** [invalid-balance-limit.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-balance-limit.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-balance-limit.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `InvalidBalanceLimitError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [update-recharge-type-balance-limit.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-balance-limit-use-case-ts)

#### Clase `InvalidBalanceLimitError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-dpi-image-error-ts"></a>

### invalid-dpi-image.error.ts

- **Ruta:** [invalid-dpi-image.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-dpi-image.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-dpi-image.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `InvalidDpiImageError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [assert-valid-dpi-image.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-dpi-image-ts)

#### Clase `InvalidDpiImageError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `message: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-final-balance-error-ts"></a>

### invalid-final-balance.error.ts

- **Ruta:** [invalid-final-balance.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-final-balance.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-final-balance.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `InvalidFinalBalanceError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts)

#### Clase `InvalidFinalBalanceError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-min-balance-error-ts"></a>

### invalid-min-balance.error.ts

- **Ruta:** [invalid-min-balance.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-min-balance.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-min-balance.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `InvalidMinBalanceError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [update-recharge-type-min-balance.use-case.spec.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-spec-ts), [update-recharge-type-min-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-ts)

#### Clase `InvalidMinBalanceError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-phone-number-error-ts"></a>

### invalid-phone-number.error.ts

- **Ruta:** [invalid-phone-number.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-phone-number.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-phone-number.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `InvalidPhoneNumberError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts)

#### Clase `InvalidPhoneNumberError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-recharge-amount-error-ts"></a>

### invalid-recharge-amount.error.ts

- **Ruta:** [invalid-recharge-amount.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-recharge-amount.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-recharge-amount.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `InvalidRechargeAmountError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts), [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts)

#### Clase `InvalidRechargeAmountError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-recharge-date-range-error-ts"></a>

### invalid-recharge-date-range.error.ts

- **Ruta:** [invalid-recharge-date-range.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-recharge-date-range.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-recharge-date-range.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `InvalidRechargeDateRangeError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-recharge-history.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-history-use-case-ts), [export-recharges-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-recharges-report-pdf-use-case-ts), [get-recharges-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-recharges-report-summary-use-case-ts)

#### Clase `InvalidRechargeDateRangeError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-recharge-date-error-ts"></a>

### invalid-recharge-date.error.ts

- **Ruta:** [invalid-recharge-date.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-recharge-date.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-recharge-date.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `InvalidRechargeDateError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [assert-valid-operation-date.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-valid-operation-date-ts)

#### Clase `InvalidRechargeDateError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-sim-quantity-error-ts"></a>

### invalid-sim-quantity.error.ts

- **Ruta:** [invalid-sim-quantity.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-sim-quantity.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-sim-quantity.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `InvalidSimQuantityError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-daily-stock-repository-ts)

#### Clase `InvalidSimQuantityError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-sim-sale-client-error-ts"></a>

### invalid-sim-sale-client.error.ts

- **Ruta:** [invalid-sim-sale-client.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-sim-sale-client.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-sim-sale-client.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `InvalidSimSaleClientError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts)

#### Clase `InvalidSimSaleClientError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-sim-sale-price-error-ts"></a>

### invalid-sim-sale-price.error.ts

- **Ruta:** [invalid-sim-sale-price.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-sim-sale-price.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-sim-sale-price.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `InvalidSimSalePriceError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts)

#### Clase `InvalidSimSalePriceError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-total-collected-error-ts"></a>

### invalid-total-collected.error.ts

- **Ruta:** [invalid-total-collected.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-total-collected.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/invalid-total-collected.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `InvalidTotalCollectedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sales-closure-repository-ts)

#### Clase `InvalidTotalCollectedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-pending-type-closure-error-ts"></a>

### pending-type-closure.error.ts

- **Ruta:** [pending-type-closure.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/pending-type-closure.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/pending-type-closure.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `PendingTypeClosureError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sales-closure-repository-ts)

#### Clase `PendingTypeClosureError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `rechargeTypeId: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-already-closed-error-ts"></a>

### recharge-day-already-closed.error.ts

- **Ruta:** [recharge-day-already-closed.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-already-closed.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-already-closed.error.ts`, 23 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "This Recargas day is already closed and can't accept new operations" — covers every write this module's day-lifecycle gates once `recharge_day_openings.closed_at` is no longer null: registering a purchase, a sale (including editing/deleting an existing one), a saldo final, or a new cuadre for that date.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [close-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts), [assert-recharge-day-writable.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-recharge-day-writable-ts), [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts), [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts), [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts), [typeorm-recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sales-closure-repository-ts), [typeorm-recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-daily-stock-repository-ts), [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts)

#### Clase `RechargeDayAlreadyClosedError` (L14–22)

- **Herencia / contratos:** extends DomainError
- **Propósito:** "This Recargas day is already closed and can't accept new operations" — covers every write this module's day-lifecycle gates once `recharge_day_openings.closed_at` is no longer null: registering a purchase, a sale (including editing/deleting an existing one), a saldo final, or a new cuadre for that date. Distinct from the pre-existing `DayAlreadyClosedError` in `day-already-closed.error.ts`, which means something narrower — one operator/cycle's own `final_balance` already set, independent of whether the whole day has been closed. Never thrown for a date that was never opened — that case is `RechargeDayNotOpenedError`.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-cancelled-error-ts"></a>

### recharge-day-cancelled.error.ts

- **Ruta:** [recharge-day-cancelled.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-cancelled.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-cancelled.error.ts`, 18 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `RechargeDayCancelledError`, `RechargeDayAlreadyCancelledError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [close-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts), [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts)

#### Clase `RechargeDayCancelledError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `date: string`

#### Clase `RechargeDayAlreadyCancelledError` (L11–17)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-closed-error-ts"></a>

### recharge-day-not-closed.error.ts

- **Ruta:** [recharge-day-not-closed.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-not-closed.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-not-closed.error.ts`, 13 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Reopening or cancelling only makes sense for a Recargas day that's actually CLOSED.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts)

#### Clase `RechargeDayNotClosedError` (L4–12)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Reopening or cancelling only makes sense for a Recargas day that's actually CLOSED.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-found-error-ts"></a>

### recharge-day-not-found.error.ts

- **Ruta:** [recharge-day-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-not-found.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-not-found.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `RechargeDayNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-recharge-day-detail.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-detail-use-case-ts), [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts)

#### Clase `RechargeDayNotFoundError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-opened-error-ts"></a>

### recharge-day-not-opened.error.ts

- **Ruta:** [recharge-day-not-opened.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-not-opened.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-not-opened.error.ts`, 20 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "The user must not be able to freely register recharge operations until the day has been opened" — mirrors Banks' own `DayNotOpenedError` reasoning.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [close-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts), [assert-recharge-day-writable.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-utils-assert-recharge-day-writable-ts), [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts)

#### Clase `RechargeDayNotOpenedError` (L11–19)

- **Herencia / contratos:** extends DomainError
- **Propósito:** "The user must not be able to freely register recharge operations until the day has been opened" — mirrors Banks' own `DayNotOpenedError` reasoning. Only enforced for TODAY (`assertRechargeDayWritable`); a past date being corrected never needs a retroactive opening, matching the pre-existing, deliberately preserved rule Banks' own `SaveBankBalancesUseCase` already established for this exact situation.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-ready-to-close-error-ts"></a>

### recharge-day-not-ready-to-close.error.ts

- **Ruta:** [recharge-day-not-ready-to-close.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-not-ready-to-close.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-not-ready-to-close.error.ts`, 20 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Cerrar Día" (see `CloseRechargeDayUseCase`/`close_recharge_day`) is a standalone action carrying no cuadre data of its own, deliberately decoupled from "Guardar Cuadre" so this module's existing multi-cycle- per-day cuadre feature keeps working unchanged.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [close-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts), [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts)

#### Clase `RechargeDayNotReadyToCloseError` (L11–19)

- **Herencia / contratos:** extends DomainError
- **Propósito:** "Cerrar Día" (see `CloseRechargeDayUseCase`/`close_recharge_day`) is a standalone action carrying no cuadre data of its own, deliberately decoupled from "Guardar Cuadre" so this module's existing multi-cycle- per-day cuadre feature keeps working unchanged. Without this precondition, an operator could open a day, sell recargas all day, and close it without ever reconciling cash — this error is what stops that.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-reason-required-error-ts"></a>

### recharge-day-reason-required.error.ts

- **Ruta:** [recharge-day-reason-required.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-reason-required.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-day-reason-required.error.ts`, 18 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `RechargeReopenReasonRequiredError`, `RechargeCancelReasonRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [cancel-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-cancel-recharge-day-use-case-ts), [reopen-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-reopen-recharge-day-use-case-ts), [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts)

#### Clase `RechargeReopenReasonRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RechargeCancelReasonRequiredError` (L11–17)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-later-day-exists-error-ts"></a>

### recharge-later-day-exists.error.ts

- **Ruta:** [recharge-later-day-exists.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-later-day-exists.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-later-day-exists.error.ts`, 19 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** The later-day integrity rule (same Option A already chosen for Banks' own equivalent rule — reject rather than cascade-recalculate): a Recargas date is never reopened/cancelled if a strictly later date has a non-cancelled CLOSED/REOPENED cycle.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts)

#### Clase `RechargeLaterDayExistsError` (L10–18)

- **Herencia / contratos:** extends DomainError
- **Propósito:** The later-day integrity rule (same Option A already chosen for Banks' own equivalent rule — reject rather than cascade-recalculate): a Recargas date is never reopened/cancelled if a strictly later date has a non-cancelled CLOSED/REOPENED cycle. The user must handle the more recent days first.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-already-voided-error-ts"></a>

### recharge-purchase-already-voided.error.ts

- **Ruta:** [recharge-purchase-already-voided.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-purchase-already-voided.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-purchase-already-voided.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `RechargePurchaseAlreadyVoidedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-purchase-use-case-ts), [typeorm-recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-purchase-repository-ts)

#### Clase `RechargePurchaseAlreadyVoidedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-cycle-closed-error-ts"></a>

### recharge-purchase-cycle-closed.error.ts

- **Ruta:** [recharge-purchase-cycle-closed.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-purchase-cycle-closed.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-purchase-cycle-closed.error.ts`, 19 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Thrown when a purchase's own cuadre cycle already has a `final_balance` — no existing mechanism un-closes an already-closed cycle (verified directly: `reopen_recharge_day()` only clears `recharge_day_openings .closed_at`, never a cycle's `final_balance`), so this is a hard, permanent block, never bypassable, not even by an admin.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-purchase-repository-ts)

#### Clase `RechargePurchaseCycleClosedError` (L10–18)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Thrown when a purchase's own cuadre cycle already has a `final_balance` — no existing mechanism un-closes an already-closed cycle (verified directly: `reopen_recharge_day()` only clears `recharge_day_openings .closed_at`, never a cycle's `final_balance`), so this is a hard, permanent block, never bypassable, not even by an admin.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-day-closed-error-ts"></a>

### recharge-purchase-day-closed.error.ts

- **Ruta:** [recharge-purchase-day-closed.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-purchase-day-closed.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-purchase-day-closed.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `RechargePurchaseDayClosedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-purchase-repository-ts)

#### Clase `RechargePurchaseDayClosedError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-not-found-error-ts"></a>

### recharge-purchase-not-found.error.ts

- **Ruta:** [recharge-purchase-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-purchase-not-found.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-purchase-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `RechargePurchaseNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-purchase-use-case-ts), [typeorm-recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-purchase-repository-ts)

#### Clase `RechargePurchaseNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-sale-locked-error-ts"></a>

### recharge-sale-locked.error.ts

- **Ruta:** [recharge-sale-locked.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-sale-locked.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-sale-locked.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `RechargeSaleLockedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts)

#### Clase `RechargeSaleLockedError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-sale-not-found-error-ts"></a>

### recharge-sale-not-found.error.ts

- **Ruta:** [recharge-sale-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-sale-not-found.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-sale-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `RechargeSaleNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts)

#### Clase `RechargeSaleNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-sim-sale-not-found-error-ts"></a>

### recharge-sim-sale-not-found.error.ts

- **Ruta:** [recharge-sim-sale-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-sim-sale-not-found.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-sim-sale-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `RechargeSimSaleNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-use-case-ts), [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts), [typeorm-recharge-sim-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-repository-ts)

#### Clase `RechargeSimSaleNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-type-inactive-error-ts"></a>

### recharge-type-inactive.error.ts

- **Ruta:** [recharge-type-inactive.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-type-inactive.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-type-inactive.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `RechargeTypeInactiveError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts), [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts)

#### Clase `RechargeTypeInactiveError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-type-not-found-error-ts"></a>

### recharge-type-not-found.error.ts

- **Ruta:** [recharge-type-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-type-not-found.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/recharge-type-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `RechargeTypeNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts), [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts), [typeorm-recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-type-repository-ts)

#### Clase `RechargeTypeNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-sales-closure-edit-forbidden-error-ts"></a>

### sales-closure-edit-forbidden.error.ts

- **Ruta:** [sales-closure-edit-forbidden.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/sales-closure-edit-forbidden.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/sales-closure-edit-forbidden.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `SalesClosureEditForbiddenError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sales-closure-repository-ts)

#### Clase `SalesClosureEditForbiddenError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-number-required-error-ts"></a>

### sim-number-required.error.ts

- **Ruta:** [sim-number-required.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/sim-number-required.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/sim-number-required.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `SimNumberRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts)

#### Clase `SimNumberRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-already-voided-error-ts"></a>

### sim-sale-already-voided.error.ts

- **Ruta:** [sim-sale-already-voided.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-already-voided.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-already-voided.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `SimSaleAlreadyVoidedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-use-case-ts), [typeorm-recharge-sim-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-repository-ts)

#### Clase `SimSaleAlreadyVoidedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-day-closed-error-ts"></a>

### sim-sale-day-closed.error.ts

- **Ruta:** [sim-sale-day-closed.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-day-closed.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-day-closed.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `SimSaleDayClosedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sim-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-repository-ts)

#### Clase `SimSaleDayClosedError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-has-registration-error-ts"></a>

### sim-sale-has-registration.error.ts

- **Ruta:** [sim-sale-has-registration.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-has-registration.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-has-registration.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `SimSaleHasRegistrationError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-use-case-ts), [typeorm-recharge-sim-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-repository-ts)

#### Clase `SimSaleHasRegistrationError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-already-voided-error-ts"></a>

### sim-sale-registration-already-voided.error.ts

- **Ruta:** [sim-sale-registration-already-voided.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-registration-already-voided.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-registration-already-voided.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `SimSaleRegistrationAlreadyVoidedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-recharge-sim-sale-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-registration-use-case-ts), [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts)

#### Clase `SimSaleRegistrationAlreadyVoidedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-not-found-error-ts"></a>

### sim-sale-registration-not-found.error.ts

- **Ruta:** [sim-sale-registration-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-registration-not-found.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-registration-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `SimSaleRegistrationNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-recharge-sim-sale-registration-by-id.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-by-id-use-case-ts), [get-recharge-sim-sale-registration-dpi-image.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-dpi-image-use-case-ts), [void-recharge-sim-sale-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-registration-use-case-ts), [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts)

#### Clase `SimSaleRegistrationNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-void-reason-required-error-ts"></a>

### sim-sale-registration-void-reason-required.error.ts

- **Ruta:** [sim-sale-registration-void-reason-required.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-registration-void-reason-required.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-registration-void-reason-required.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `SimSaleRegistrationVoidReasonRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-recharge-sim-sale-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-registration-use-case-ts), [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts)

#### Clase `SimSaleRegistrationVoidReasonRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-sku-required-error-ts"></a>

### sim-sale-sku-required.error.ts

- **Ruta:** [sim-sale-sku-required.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-sku-required.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-sku-required.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `SimSaleSkuRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts)

#### Clase `SimSaleSkuRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-void-reason-required-error-ts"></a>

### sim-sale-void-reason-required.error.ts

- **Ruta:** [sim-sale-void-reason-required.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-void-reason-required.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/sim-sale-void-reason-required.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `SimSaleVoidReasonRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-use-case-ts), [typeorm-recharge-sim-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-repository-ts)

#### Clase `SimSaleVoidReasonRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-type-inactive-error-ts"></a>

### sim-type-inactive.error.ts

- **Ruta:** [sim-type-inactive.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/sim-type-inactive.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/sim-type-inactive.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `SimTypeInactiveError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-daily-stock-repository-ts)

#### Clase `SimTypeInactiveError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-type-not-found-error-ts"></a>

### sim-type-not-found.error.ts

- **Ruta:** [sim-type-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/sim-type-not-found.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/sim-type-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `SimTypeNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-daily-stock-repository-ts)

#### Clase `SimTypeNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-errors-void-reason-required-error-ts"></a>

### void-reason-required.error.ts

- **Ruta:** [void-reason-required.error.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/errors/void-reason-required.error.ts) (`comercial-jhoel-api/src/modules/recharges/domain/errors/void-reason-required.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Errores de dominio: declara `VoidReasonRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-purchase-use-case-ts), [typeorm-recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-purchase-repository-ts)

#### Clase `VoidReasonRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts"></a>

### recharge-daily-balance.repository.ts

- **Ruta:** [recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-daily-balance.repository.ts) (`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-daily-balance.repository.ts`, 151 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RegisterRechargePurchaseData`, `RegisterRechargeFinalBalanceData`, `FindRechargeHistoryOptions`, `PaginatedResult`, `FindRechargeReportSummaryOptions` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-daily-balance.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-daily-balance-entity-ts)
- **Consumidores:** [get-alerts.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [get-recharge-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-daily-summary-use-case-ts), [get-recharge-history.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-history-use-case-ts), [get-recharge-operators-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-operators-summary-use-case-ts), [get-recharge-sales-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-summary-use-case-ts), [get-recharges-daily-stats.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharges-daily-stats-use-case-ts), [get-recharges-weekly-stats.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharges-weekly-stats-use-case-ts), [get-recharges-yearly-stats.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharges-yearly-stats-use-case-ts), [register-recharge-final-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-final-balance-use-case-ts), [register-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-purchase-use-case-ts), [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts), [export-recharges-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-recharges-report-pdf-use-case-ts), [get-recharges-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-recharges-report-summary-use-case-ts)

**Interfaces, tipos y enums:**

- `interface RegisterRechargePurchaseData` (L7): sin documentación — miembros: `rechargeTypeId`, `date`, `purchaseAmount`, `creditedAmount`, `userId`
- `interface RegisterRechargeFinalBalanceData` (L17): sin documentación — miembros: `dailyBalanceId`, `finalBalance`, `userId`
- `interface FindRechargeHistoryOptions` (L23): sin documentación — miembros: `startDate`, `endDate`, `rechargeTypeId`, `userId`, `page`, `limit`, `excludeCancelledDays`
- `interface PaginatedResult` (L34): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface FindRechargeReportSummaryOptions` (L41): sin documentación — miembros: `startDate`, `endDate`, `rechargeTypeId`
- `interface RechargeReportSummary` (L47): sin documentación — miembros: `recordCount`, `closedCount`, `totalPurchases`, `totalSales`
- `interface RechargeDailySalesAmount` (L55): sin documentación — miembros: `date`, `amount`
- `interface RechargeMonthlySalesAmount` (L61): sin documentación — miembros: `month`, `amount`
- `interface RechargeAmountByType` (L67): sin documentación — miembros: `rechargeTypeId`, `rechargeTypeName`, `amount`
- `interface RechargeDailyBalanceRepository` (L73): sin documentación — miembros: `ensureDailyBalance`, `findByTypeAndDate`, `findAllByDate`, `findLatestPerType`, `findById`, `registerPurchase`, `registerFinalBalance`, `findHistory`, `getReportSummary`, `getDailySalesTotals`, `getMonthlySalesTotals`, `getMonthlySalesTotalsByType`, `getMonthlyPurchaseTotalsByType`

**Constantes exportadas:**

- `RECHARGE_DAILY_BALANCE_REPOSITORY` (L3) = `Symbol( 'RECHARGE_DAILY_BALANCE_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-audit-log-repository-ts"></a>

### recharge-day-audit-log.repository.ts

- **Ruta:** [recharge-day-audit-log.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-day-audit-log.repository.ts) (`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-day-audit-log.repository.ts`, 25 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateRechargeDayAuditLogData`, `RechargeDayAuditLogRepository`, `RECHARGE_DAY_AUDIT_LOG_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-day-audit-log.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-day-audit-log-entity-ts)
- **Consumidores:** [get-recharge-day-detail.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-detail-use-case-ts), [open-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-open-recharge-day-use-case-ts), [typeorm-recharge-day-audit-log.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-audit-log-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateRechargeDayAuditLogData` (L10): sin documentación — miembros: `date`, `action`, `performedBy`, `reason`, `previousStatus`, `newStatus`
- `interface RechargeDayAuditLogRepository` (L19): sin documentación — miembros: `findByDate`, `record`

**Constantes exportadas:**

- `RECHARGE_DAY_AUDIT_LOG_REPOSITORY` (L6) = `Symbol( 'RECHARGE_DAY_AUDIT_LOG_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts"></a>

### recharge-day-opening.repository.ts

- **Ruta:** [recharge-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-day-opening.repository.ts) (`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-day-opening.repository.ts`, 71 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RechargeClosedDaysFilters`, `RechargeClosedDayViewRow`, `RechargeDayOpeningRepository`, `RechargeClosedDayStatus`, `RechargeResultSign` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-day-opening.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-day-opening-entity-ts)
- **Consumidores:** [recharge-closed-day-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-closed-day-output-ts), [recharge-day-detail-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-detail-output-ts), [cancel-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-cancel-recharge-day-use-case-ts), [close-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts), [create-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-create-recharge-sale-use-case-ts), [get-recharge-day-detail.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-detail-use-case-ts), [get-recharge-day-status.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-status-use-case-ts), [list-closed-recharge-days.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-closed-recharge-days-use-case-ts), [list-recharge-sim-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sales-use-case-ts), [open-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-open-recharge-day-use-case-ts), [register-recharge-final-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-final-balance-use-case-ts), [register-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-purchase-use-case-ts), [register-recharge-sales-closure.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sales-closure-use-case-ts), [register-recharge-sim-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-purchase-use-case-ts), [register-recharge-sim-sale-with-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts) y 7 más

**Interfaces, tipos y enums:**

- `interface RechargeClosedDaysFilters` (L10): sin documentación — miembros: `dateFrom`, `dateTo`, `status`, `userId`, `resultSign`
- `interface RechargeClosedDayViewRow` (L29): Row of the "Gestión de Días de Recargas" list — combines `recharge_day_openings` with the totals from that date's LATEST `recharge_sales_closures` row (there can be more than one per date, since this module's own cuadre-cycles feature lets several cuadres be saved on the same calendar date; the most — miembros: `date`, `status`, `openedAt`, `openedByUsername`, `closedAt`, `closedByUsername`, `reopenedAt`, `reopenedByUsername`, `reopenReason`, `cancelledAt`, `cancelledByUsername`, `cancelReason`, `totalSales`, `totalCollected`, `result`, `cycleCount`
- `interface RechargeDayOpeningRepository` (L48): sin documentación — miembros: `findByDate`, `open`, `close`, `findClosedDays`, `reopen`, `cancel`
- `type RechargeClosedDayStatus` (L7) = `'CLOSED' \| 'REOPENED' \| 'CANCELLED'`
- `type RechargeResultSign` (L8) = `'positive' \| 'negative' \| 'zero'`

**Constantes exportadas:**

- `RECHARGE_DAY_OPENING_REPOSITORY` (L3) = `Symbol( 'RECHARGE_DAY_OPENING_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-purchase-repository-ts"></a>

### recharge-purchase.repository.ts

- **Ruta:** [recharge-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-purchase.repository.ts) (`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-purchase.repository.ts`, 15 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RechargePurchaseRepository`, `RECHARGE_PURCHASE_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-purchase.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-purchase-entity-ts)
- **Consumidores:** [get-recharge-purchases.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-purchases-use-case-ts), [void-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-purchase-use-case-ts), [typeorm-recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-purchase-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RechargePurchaseRepository` (L5): sin documentación — miembros: `findAllByDate`, `findById`, `voidPurchase`

**Constantes exportadas:**

- `RECHARGE_PURCHASE_REPOSITORY` (L3) = `Symbol('RECHARGE_PURCHASE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sale-repository-ts"></a>

### recharge-sale.repository.ts

- **Ruta:** [recharge-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sale.repository.ts) (`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sale.repository.ts`, 39 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateRechargeSaleData`, `UpdateRechargeSaleData`, `RechargeTypeSalesTotal`, `RechargeSaleRepository`, `RECHARGE_SALE_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sale.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sale-entity-ts)
- **Consumidores:** [create-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-create-recharge-sale-use-case-ts), [delete-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-delete-recharge-sale-use-case-ts), [get-recharge-sales-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-summary-use-case-ts), [get-recharge-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-use-case-ts), [update-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-sale-use-case-ts), [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateRechargeSaleData` (L5): sin documentación — miembros: `rechargeTypeId`, `date`, `phoneNumber`, `amount`, `userId`
- `interface UpdateRechargeSaleData` (L13): sin documentación — miembros: `id`, `phoneNumber`, `amount`, `userId`
- `interface RechargeTypeSalesTotal` (L20): sin documentación — miembros: `rechargeTypeId`, `rechargeTypeName`, `total`
- `interface RechargeSaleRepository` (L26): sin documentación — miembros: `create`, `update`, `delete`, `findById`, `findAllByDate`, `getCurrentCycleTotalsByDate`

**Constantes exportadas:**

- `RECHARGE_SALE_REPOSITORY` (L3) = `Symbol('RECHARGE_SALE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sales-closure-repository-ts"></a>

### recharge-sales-closure.repository.ts

- **Ruta:** [recharge-sales-closure.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sales-closure.repository.ts) (`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sales-closure.repository.ts`, 30 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RegisterRechargeSalesClosureData`, `RechargeSalesClosureRepository`, `RECHARGE_SALES_CLOSURE_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sales-closure.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sales-closure-entity-ts)
- **Consumidores:** [close-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-close-recharge-day-use-case-ts), [get-recharge-day-detail.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-detail-use-case-ts), [get-recharge-day-status.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-status-use-case-ts), [get-recharge-sales-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-summary-use-case-ts), [register-recharge-sales-closure.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sales-closure-use-case-ts), [typeorm-recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sales-closure-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterRechargeSalesClosureData` (L7): sin documentación — miembros: `date`, `totalCollected`, `userId`, `isAdmin`
- `interface RechargeSalesClosureRepository` (L15): sin documentación — miembros: `findByDateAndSequence`, `findAllByDate`, `existsForDate`, `registerClosure`

**Constantes exportadas:**

- `RECHARGE_SALES_CLOSURE_REPOSITORY` (L3) = `Symbol( 'RECHARGE_SALES_CLOSURE_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-daily-stock-repository-ts"></a>

### recharge-sim-daily-stock.repository.ts

- **Ruta:** [recharge-sim-daily-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-daily-stock.repository.ts) (`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-daily-stock.repository.ts`, 52 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RegisterRechargeSimSaleUnitData`, `RegisterRechargeSimPurchaseData`, `RegisterRechargeSimSaleData`, `RechargeSimDailyStockRepository`, `RECHARGE_SIM_DAILY_STOCK_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts), [recharge-sim-daily-stock.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-daily-stock-entity-ts)
- **Consumidores:** [get-recharge-sim-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-daily-summary-use-case-ts), [register-recharge-sim-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-purchase-use-case-ts), [register-recharge-sim-sale-with-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts), [register-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-use-case-ts), [typeorm-recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-daily-stock-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterRechargeSimSaleUnitData` (L4): sin documentación — miembros: `simTypeId`, `date`, `userId`
- `interface RegisterRechargeSimPurchaseData` (L14): sin documentación — miembros: `simTypeId`, `date`, `quantity`, `userId`
- `interface RegisterRechargeSimSaleData` (L21): sin documentación — miembros: `simTypeId`, `date`, `quantity`, `userId`
- `interface RechargeSimDailyStockRepository` (L28): sin documentación — miembros: `ensureDailyStock`, `findAllByDate`, `findById`, `registerPurchase`, `registerSale`, `registerSingleUnitSale`

**Constantes exportadas:**

- `RECHARGE_SIM_DAILY_STOCK_REPOSITORY` (L10) = `Symbol( 'RECHARGE_SIM_DAILY_STOCK_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-registration-repository-ts"></a>

### recharge-sim-sale-registration.repository.ts

- **Ruta:** [recharge-sim-sale-registration.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-sale-registration.repository.ts) (`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-sale-registration.repository.ts`, 69 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RegisterRechargeSimSaleRegistrationData`, `ListRechargeSimSaleRegistrationsFilters`, `ListRechargeSimSaleRegistrationsResult`, `DpiImage`, `RechargeSimSaleRegistrationRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts), [recharge-sim-sale-registration.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-sale-registration-entity-ts)
- **Consumidores:** [get-recharge-sales-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-summary-use-case-ts), [get-recharge-sim-sale-registration-by-id.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-by-id-use-case-ts), [get-recharge-sim-sale-registration-dpi-image.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-dpi-image-use-case-ts), [list-recharge-sim-sale-registrations.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sale-registrations-use-case-ts), [register-recharge-sim-sale-with-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts), [void-recharge-sim-sale-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-registration-use-case-ts), [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterRechargeSimSaleRegistrationData` (L8): sin documentación — miembros: `rechargeSimSaleId`, `simNumber`, `sku`, `clientDpi`, `clientId`, `salePrice`, `dpiImageId`, `saleDate`, `userId`
- `interface ListRechargeSimSaleRegistrationsFilters` (L20): sin documentación — miembros: `startDate`, `endDate`, `simTypeId`, `isVoided`, `page`, `limit`
- `interface ListRechargeSimSaleRegistrationsResult` (L29): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface DpiImage` (L36): sin documentación — miembros: `data`, `mimeType`
- `interface RechargeSimSaleRegistrationRepository` (L41): sin documentación — miembros: `create`, `findById`, `getTotalByDate`, `findAll`, `voidRegistration`, `saveDpiImage`, `getDpiImage`

**Constantes exportadas:**

- `RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY` (L4) = `Symbol( 'RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-repository-ts"></a>

### recharge-sim-sale.repository.ts

- **Ruta:** [recharge-sim-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-sale.repository.ts) (`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-sale.repository.ts`, 11 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RechargeSimSaleRepository`, `RECHARGE_SIM_SALE_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sim-sale.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-sale-entity-ts)
- **Consumidores:** [list-recharge-sim-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sales-use-case-ts), [void-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-use-case-ts), [typeorm-recharge-sim-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSimSaleRepository` (L5): sin documentación — miembros: `findAllByDate`, `findById`, `voidSale`

**Constantes exportadas:**

- `RECHARGE_SIM_SALE_REPOSITORY` (L3) = `Symbol('RECHARGE_SIM_SALE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-type-repository-ts"></a>

### recharge-sim-type.repository.ts

- **Ruta:** [recharge-sim-type.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-type.repository.ts) (`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-type.repository.ts`, 11 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RechargeSimTypeRepository`, `RECHARGE_SIM_TYPE_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sim-type.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-type-entity-ts)
- **Consumidores:** [get-recharge-sim-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-daily-summary-use-case-ts), [list-recharge-sim-types.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-types-use-case-ts), [typeorm-recharge-sim-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-type-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSimTypeRepository` (L7): sin documentación — miembros: `findAll`, `findById`

**Constantes exportadas:**

- `RECHARGE_SIM_TYPE_REPOSITORY` (L3) = `Symbol( 'RECHARGE_SIM_TYPE_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-type-repository-ts"></a>

### recharge-type.repository.ts

- **Ruta:** [recharge-type.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-type.repository.ts) (`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-type.repository.ts`, 13 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RechargeTypeRepository`, `RECHARGE_TYPE_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-type.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-type-entity-ts)
- **Consumidores:** [get-alerts.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [get-recharge-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-daily-summary-use-case-ts), [get-recharge-operators-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-operators-summary-use-case-ts), [list-recharge-types.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-types-use-case-ts), [update-recharge-type-balance-limit.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-balance-limit-use-case-ts), [update-recharge-type-min-balance.use-case.spec.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-spec-ts), [update-recharge-type-min-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-type-min-balance-use-case-ts), [typeorm-recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-type-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts), [export-recharges-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-recharges-report-pdf-use-case-ts)

**Interfaces, tipos y enums:**

- `interface RechargeTypeRepository` (L5): sin documentación — miembros: `findAll`, `findById`, `updateMinBalance`, `updateBalanceLimit`

**Constantes exportadas:**

- `RECHARGE_TYPE_REPOSITORY` (L3) = `Symbol('RECHARGE_TYPE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-mapper-ts"></a>

### recharge-daily-balance.mapper.ts

- **Ruta:** [recharge-daily-balance.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-daily-balance.mapper.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-daily-balance.mapper.ts`, 29 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Mapper: declara `RechargeDailyBalanceMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-daily-balance.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-daily-balance-entity-ts), [recharge-daily-balance.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-orm-entity-ts)
- **Consumidores:** [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts)

#### Clase `RechargeDailyBalanceMapper` (L4–28)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 6–27 | `orm: RechargeDailyBalanceOrmEntity`, `totalPurchaseAmount: number` | `RechargeDailyBalance` |

##### `RechargeDailyBalanceMapper.toDomain`

- **Firma:** `toDomain(orm: RechargeDailyBalanceOrmEntity, totalPurchaseAmount: number): RechargeDailyBalance` — [recharge-daily-balance.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-daily-balance.mapper.ts#L6) (L6–27)
- **Propósito / descripción:** `totalPurchaseAmount` is always supplied explicitly by the repository (a real `SUM(recharge_purchases.amount)` query) — never defaulted here, so a call site can't silently forget it.
- **Dependencias (llamadas en su cuerpo):** `RechargeDailyBalance.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-orm-entity-ts"></a>

### recharge-daily-balance.orm-entity.ts

- **Ruta:** [recharge-daily-balance.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-daily-balance.orm-entity.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-daily-balance.orm-entity.ts`, 90 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `RechargeDailyBalanceOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-type.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-orm-entity-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [dashboard.module.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-dashboard-module-ts), [typeorm-dashboard.repository.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-infrastructure-persistence-typeorm-dashboard-repository-ts), [recharge-daily-balance.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-mapper-ts), [recharge-purchase-full.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-purchase-full-orm-entity-ts), [recharge-sale.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-orm-entity-ts), [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `RechargeDailyBalanceOrmEntity` (L15–89)

- **Decoradores:** `@Entity('recharge_daily_balances')` `@Index( 'UQ_recharge_daily_balances_type_date_sequence', ['rechargeTypeId', 'date', 'sequence'], { unique: true }, )`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column rechargeTypeId: string`, `@ManyToOne rechargeType: RechargeTypeOrmEntity`, `@Column date: string`, `@Column sequence: number`, `@Column previousBalance: number`, `@Column dailyBalance: number`, `@Column finalBalance: number \| null`, `@Column createdByUserId: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedByUserId: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-audit-log-mapper-ts"></a>

### recharge-day-audit-log.mapper.ts

- **Ruta:** [recharge-day-audit-log.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-day-audit-log.mapper.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-day-audit-log.mapper.ts`, 22 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Mapper: declara `RechargeDayAuditLogMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-day-audit-log.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-day-audit-log-entity-ts), [recharge-day-audit-log.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-audit-log-orm-entity-ts)
- **Consumidores:** [typeorm-recharge-day-audit-log.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-audit-log-repository-ts)

#### Clase `RechargeDayAuditLogMapper` (L7–21)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 8–20 | `orm: RechargeDayAuditLogOrmEntity` | `RechargeDayAuditLog` |

##### `RechargeDayAuditLogMapper.toDomain`

- **Firma:** `toDomain(orm: RechargeDayAuditLogOrmEntity): RechargeDayAuditLog` — [recharge-day-audit-log.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-day-audit-log.mapper.ts#L8) (L8–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `RechargeDayAuditLog.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-recharge-day-audit-log.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-audit-log-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-audit-log-orm-entity-ts"></a>

### recharge-day-audit-log.orm-entity.ts

- **Ruta:** [recharge-day-audit-log.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-day-audit-log.orm-entity.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-day-audit-log.orm-entity.ts`, 45 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `RechargeDayAuditLogOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [recharge-day-audit-log.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-audit-log-mapper-ts), [typeorm-recharge-day-audit-log.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-audit-log-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `RechargeDayAuditLogOrmEntity` (L10–44)

- **Decoradores:** `@Entity('recharge_day_audit_logs')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column date: string`, `@Column action: string`, `@Column performedBy: string`, `@ManyToOne performedByUser: UserOrmEntity`, `@Column performedAt: Date`, `@Column reason: string \| null`, `@Column previousStatus: string \| null`, `@Column newStatus: string \| null`
<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-opening-mapper-ts"></a>

### recharge-day-opening.mapper.ts

- **Ruta:** [recharge-day-opening.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-day-opening.mapper.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-day-opening.mapper.ts`, 27 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Mapper: declara `RechargeDayOpeningMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-day-opening.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-day-opening-entity-ts), [recharge-day-opening.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-opening-orm-entity-ts)
- **Consumidores:** [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts)

#### Clase `RechargeDayOpeningMapper` (L4–26)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–25 | `orm: RechargeDayOpeningOrmEntity` | `RechargeDayOpening` |

##### `RechargeDayOpeningMapper.toDomain`

- **Firma:** `toDomain(orm: RechargeDayOpeningOrmEntity): RechargeDayOpening` — [recharge-day-opening.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-day-opening.mapper.ts#L5) (L5–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `RechargeDayOpening.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-opening-orm-entity-ts"></a>

### recharge-day-opening.orm-entity.ts

- **Ruta:** [recharge-day-opening.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-day-opening.orm-entity.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-day-opening.orm-entity.ts`, 79 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `RechargeDayOpeningOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [recharge-day-opening.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-opening-mapper-ts), [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `RechargeDayOpeningOrmEntity` (L10–78)

- **Decoradores:** `@Entity('recharge_day_openings')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column date: string`, `@Column openedBy: string`, `@ManyToOne openedByUser: UserOrmEntity`, `@Column openedAt: Date`, `@Column closedAt: Date \| null`, `@Column closedBy: string \| null`, `@ManyToOne closedByUser: UserOrmEntity \| null`, `@Column reopenedAt: Date \| null`, `@Column reopenedBy: string \| null`, `@ManyToOne reopenedByUser: UserOrmEntity \| null`, `@Column reopenReason: string \| null`, `@Column isCancelled: boolean`, `@Column cancelledAt: Date \| null`, `@Column cancelledBy: string \| null`, `@ManyToOne cancelledByUser: UserOrmEntity \| null`, `@Column cancelReason: string \| null`
<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-purchase-full-orm-entity-ts"></a>

### recharge-purchase-full.orm-entity.ts

- **Ruta:** [recharge-purchase-full.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-purchase-full.orm-entity.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-purchase-full.orm-entity.ts`, 104 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Full mapping of `recharge_purchases` — used for the "Compras de Recargas" list/revert feature (`RechargePurchaseRepository`).
- **Depende de (archivos del proyecto):** [recharge-type.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-orm-entity-ts), [recharge-daily-balance.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-orm-entity-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [recharge-purchase.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-purchase-mapper-ts), [typeorm-recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-purchase-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `RechargePurchaseFullOrmEntity` (L25–103)

- **Decoradores:** `@Entity('recharge_purchases')`
- **Propósito:** Full mapping of `recharge_purchases` — used for the "Compras de Recargas" list/revert feature (`RechargePurchaseRepository`). Named `...Full...` to avoid colliding with the pre-existing, deliberately minimal `RechargePurchaseOrmEntity` in `modules/recharge-cash-box/` (only `id`/`amount`/`purchaseDate`, used exclusively for Caja Contable's own SUM aggregates) — both map the same table, the exact same safe multi-entity pattern already used for `RechargeSaleOrmEntity` elsewhere in this codebase.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column rechargeTypeId: string`, `@ManyToOne rechargeType: RechargeTypeOrmEntity`, `@Column dailyBalanceId: string`, `@ManyToOne dailyBalance: RechargeDailyBalanceOrmEntity`, `@Column amount: number`, `@Column creditedAmount: number`, `@Column date: string`, `@Column createdByUserId: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@CreateDateColumn createdAt: Date`, `@Column isVoided: boolean`, `@Column voidedAt: Date \| null`, `@Column voidedByUserId: string \| null`, `@ManyToOne voidedByUser: UserOrmEntity \| null`, `@Column voidReason: string \| null`
<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-purchase-mapper-ts"></a>

### recharge-purchase.mapper.ts

- **Ruta:** [recharge-purchase.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-purchase.mapper.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-purchase.mapper.ts`, 26 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Mapper: declara `RechargePurchaseMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-purchase.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-purchase-entity-ts), [recharge-purchase-full.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-purchase-full-orm-entity-ts)
- **Consumidores:** [typeorm-recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-purchase-repository-ts)

#### Clase `RechargePurchaseMapper` (L4–25)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–24 | `orm: RechargePurchaseFullOrmEntity` | `RechargePurchase` |

##### `RechargePurchaseMapper.toDomain`

- **Firma:** `toDomain(orm: RechargePurchaseFullOrmEntity): RechargePurchase` — [recharge-purchase.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-purchase.mapper.ts#L5) (L5–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `RechargePurchase.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-purchase-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-mapper-ts"></a>

### recharge-sale.mapper.ts

- **Ruta:** [recharge-sale.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sale.mapper.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sale.mapper.ts`, 24 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Mapper: declara `RechargeSaleMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sale.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sale-entity-ts), [recharge-sale.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-orm-entity-ts)
- **Consumidores:** [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts)

#### Clase `RechargeSaleMapper` (L4–23)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–22 | `orm: RechargeSaleOrmEntity` | `RechargeSale` |

##### `RechargeSaleMapper.toDomain`

- **Firma:** `toDomain(orm: RechargeSaleOrmEntity): RechargeSale` — [recharge-sale.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sale.mapper.ts#L5) (L5–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `RechargeSale.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-orm-entity-ts"></a>

### recharge-sale.orm-entity.ts

- **Ruta:** [recharge-sale.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sale.orm-entity.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sale.orm-entity.ts`, 79 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `RechargeSaleOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-type.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-orm-entity-ts), [recharge-daily-balance.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-orm-entity-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [typeorm-recharge-cash-box.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts), [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts), [recharge-sale.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-mapper-ts), [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `RechargeSaleOrmEntity` (L16–78)

- **Decoradores:** `@Entity('recharge_sales')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column rechargeTypeId: string`, `@ManyToOne rechargeType: RechargeTypeOrmEntity`, `@Column dailyBalanceId: string`, `@ManyToOne dailyBalance: RechargeDailyBalanceOrmEntity`, `@Column phoneNumber: string`, `@Column amount: number`, `@Column date: string`, `@Column createdByUserId: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedByUserId: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sales-closure-mapper-ts"></a>

### recharge-sales-closure.mapper.ts

- **Ruta:** [recharge-sales-closure.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sales-closure.mapper.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sales-closure.mapper.ts`, 22 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Mapper: declara `RechargeSalesClosureMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sales-closure.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sales-closure-entity-ts), [recharge-sales-closure.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sales-closure-orm-entity-ts)
- **Consumidores:** [typeorm-recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sales-closure-repository-ts)

#### Clase `RechargeSalesClosureMapper` (L4–21)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–20 | `orm: RechargeSalesClosureOrmEntity` | `RechargeSalesClosure` |

##### `RechargeSalesClosureMapper.toDomain`

- **Firma:** `toDomain(orm: RechargeSalesClosureOrmEntity): RechargeSalesClosure` — [recharge-sales-closure.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sales-closure.mapper.ts#L5) (L5–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `RechargeSalesClosure.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sales-closure-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sales-closure-orm-entity-ts"></a>

### recharge-sales-closure.orm-entity.ts

- **Ruta:** [recharge-sales-closure.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sales-closure.orm-entity.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sales-closure.orm-entity.ts`, 78 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `RechargeSalesClosureOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [recharge-sales-closure.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sales-closure-mapper-ts), [typeorm-recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sales-closure-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `RechargeSalesClosureOrmEntity` (L14–77)

- **Decoradores:** `@Entity('recharge_sales_closures')` `@Index('UQ_recharge_sales_closures_date_sequence', ['date', 'sequence'], { unique: true, })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column date: string`, `@Column sequence: number`, `@Column totalSales: number`, `@Column totalCollected: number`, `@Column result: number`, `@Column createdByUserId: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedByUserId: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-daily-stock-mapper-ts"></a>

### recharge-sim-daily-stock.mapper.ts

- **Ruta:** [recharge-sim-daily-stock.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-daily-stock.mapper.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-daily-stock.mapper.ts`, 35 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Mapper: declara `RechargeSimDailyStockMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sim-daily-stock.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-daily-stock-entity-ts), [recharge-sim-daily-stock.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-daily-stock-orm-entity-ts)
- **Consumidores:** [typeorm-recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-daily-stock-repository-ts)

#### Clase `RechargeSimDailyStockMapper` (L4–34)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 6–33 | `orm: RechargeSimDailyStockOrmEntity`, `movements: { purchasedQuantity: number; purchasedTotal: number; soldQuantity: number; soldTotal: number; }` | `RechargeSimDailyStock` |

##### `RechargeSimDailyStockMapper.toDomain`

- **Firma:** `toDomain(orm: RechargeSimDailyStockOrmEntity, movements: { purchasedQuantity: number; purchasedTotal: number; soldQuantity: number; soldTotal: number; }): RechargeSimDailyStock` — [recharge-sim-daily-stock.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-daily-stock.mapper.ts#L6) (L6–33)
- **Propósito / descripción:** `purchasedQuantity`/`purchasedTotal`/`soldQuantity`/`soldTotal` are always supplied explicitly by the repository (real `SUM()` queries against `recharge_sim_purchases`/`recharge_sim_sales`) — never defaulted here.
- **Dependencias (llamadas en su cuerpo):** `RechargeSimDailyStock.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-daily-stock-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-daily-stock-orm-entity-ts"></a>

### recharge-sim-daily-stock.orm-entity.ts

- **Ruta:** [recharge-sim-daily-stock.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-daily-stock.orm-entity.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-daily-stock.orm-entity.ts`, 63 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `RechargeSimDailyStockOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sim-type.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-type-orm-entity-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [recharge-sim-daily-stock.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-daily-stock-mapper-ts), [typeorm-recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-daily-stock-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `RechargeSimDailyStockOrmEntity` (L14–62)

- **Decoradores:** `@Entity('recharge_sim_daily_stock')` `@Index('UQ_recharge_sim_daily_stock_type_date', ['simTypeId', 'date'], { unique: true, })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column simTypeId: string`, `@ManyToOne simType: RechargeSimTypeOrmEntity`, `@Column date: string`, `@Column previousStock: number`, `@Column currentStock: number`, `@Column createdByUserId: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedByUserId: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-sale-registration-mapper-ts"></a>

### recharge-sim-sale-registration.mapper.ts

- **Ruta:** [recharge-sim-sale-registration.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-sale-registration.mapper.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-sale-registration.mapper.ts`, 53 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Shape of one row from the hand-written JOIN query in `TypeOrmRechargeSimSaleRegistrationRepository` — no TypeORM entity exists for this table (same "raw SQL, no ORM entity" precedent already established for `recharge_sim_sales`/`recharge_sim_purchases` themselves), so this mapper works off a plain joined row instead of an `*.orm-entity.ts`.
- **Depende de (archivos del proyecto):** [recharge-sim-sale-registration.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-sale-registration-entity-ts)
- **Consumidores:** [typeorm-recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSimSaleRegistrationRow` (L4): Shape of one row from the hand-written JOIN query in `TypeOrmRechargeSimSaleRegistrationRepository` — no TypeORM entity exists for this table (same "raw SQL, no ORM entity" precedent already established for `recharge_sim_sales`/`recharge_sim_purchases` themselves), so this mapper works off a plain joined row instead of an `*.orm-entity.ts`. — miembros: `id`, `recharge_sim_sale_id`, `sim_type_id`, `sim_type_name`, `sim_number`, `sku`, `client_dpi`, `client_id`, `client_name`, `sale_price`, `sale_date`, `has_dpi_image`, `is_voided`, `voided_at`, `voided_by`, `voided_by_username`, `void_reason`, `created_by`, `created_by_username`, `created_at`

**Constantes exportadas:**

- `RechargeSimSaleRegistrationMapper` (L27) = `{ toDomain(row: RechargeSimSaleRegistrationRow): RechargeSimSaleRegistration { return RechargeSimSaleRegistrat`
<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-sale-mapper-ts"></a>

### recharge-sim-sale.mapper.ts

- **Ruta:** [recharge-sim-sale.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-sale.mapper.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-sale.mapper.ts`, 47 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Shape of one row from `TypeOrmRechargeSimSaleRepository`'s own JOIN query — no TypeORM entity exists for `recharge_sim_sales` (same "raw SQL, no ORM entity" precedent already established for this table's own write functions), so this mapper works off a plain joined row instead of an `*.orm-entity.ts`.
- **Depende de (archivos del proyecto):** [recharge-sim-sale.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-sale-entity-ts)
- **Consumidores:** [typeorm-recharge-sim-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargeSimSaleRow` (L4): Shape of one row from `TypeOrmRechargeSimSaleRepository`'s own JOIN query — no TypeORM entity exists for `recharge_sim_sales` (same "raw SQL, no ORM entity" precedent already established for this table's own write functions), so this mapper works off a plain joined row instead of an `*.orm-entity.ts`. — miembros: `id`, `sim_type_id`, `sim_type_name`, `daily_stock_id`, `quantity`, `unit_price`, `total_amount`, `sale_date`, `has_active_registration`, `created_by`, `created_by_username`, `created_at`, `is_voided`, `voided_at`, `voided_by`, `voided_by_username`, `void_reason`

**Constantes exportadas:**

- `RechargeSimSaleMapper` (L24) = `{ toDomain(row: RechargeSimSaleRow): RechargeSimSale { return RechargeSimSale.create({ id: row.id, simTypeId: `
<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-type-mapper-ts"></a>

### recharge-sim-type.mapper.ts

- **Ruta:** [recharge-sim-type.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-type.mapper.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-type.mapper.ts`, 17 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Mapper: declara `RechargeSimTypeMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sim-type.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-type-entity-ts), [recharge-sim-type.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-type-orm-entity-ts)
- **Consumidores:** [typeorm-recharge-sim-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-type-repository-ts)

#### Clase `RechargeSimTypeMapper` (L4–16)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–15 | `orm: RechargeSimTypeOrmEntity` | `RechargeSimType` |

##### `RechargeSimTypeMapper.toDomain`

- **Firma:** `toDomain(orm: RechargeSimTypeOrmEntity): RechargeSimType` — [recharge-sim-type.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-type.mapper.ts#L5) (L5–15)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `RechargeSimType.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-recharge-sim-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-type-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-type-orm-entity-ts"></a>

### recharge-sim-type.orm-entity.ts

- **Ruta:** [recharge-sim-type.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-type.orm-entity.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-sim-type.orm-entity.ts`, 47 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `RechargeSimTypeOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [recharge-sim-daily-stock.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-daily-stock-orm-entity-ts), [recharge-sim-type.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-type-mapper-ts), [typeorm-recharge-sim-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-type-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `RechargeSimTypeOrmEntity` (L11–46)

- **Decoradores:** `@Entity('recharge_sim_types')` `@Unique('UQ_recharge_sim_types_name', ['name'])`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column costPrice: number`, `@Column publicPrice: number`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-mapper-ts"></a>

### recharge-type.mapper.ts

- **Ruta:** [recharge-type.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-type.mapper.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-type.mapper.ts`, 17 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Mapper: declara `RechargeTypeMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-type.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-type-entity-ts), [recharge-type.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-orm-entity-ts)
- **Consumidores:** [typeorm-recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-type-repository-ts)

#### Clase `RechargeTypeMapper` (L4–16)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–15 | `orm: RechargeTypeOrmEntity` | `RechargeType` |

##### `RechargeTypeMapper.toDomain`

- **Firma:** `toDomain(orm: RechargeTypeOrmEntity): RechargeType` — [recharge-type.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-type.mapper.ts#L5) (L5–15)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `RechargeType.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-type-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-orm-entity-ts"></a>

### recharge-type.orm-entity.ts

- **Ruta:** [recharge-type.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-type.orm-entity.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/recharge-type.orm-entity.ts`, 49 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `RechargeTypeOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [recharge-daily-balance.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-orm-entity-ts), [recharge-purchase-full.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-purchase-full-orm-entity-ts), [recharge-sale.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-orm-entity-ts), [recharge-type.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-mapper-ts), [typeorm-recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-type-repository-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `RechargeTypeOrmEntity` (L11–48)

- **Decoradores:** `@Entity('recharge_types')` `@Unique('UQ_recharge_types_name', ['name'])`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column isActive: boolean`, `@Column minBalance: number`, `@Column balanceLimit: number`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts"></a>

### typeorm-recharge-daily-balance.repository.ts

- **Ruta:** [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts`, 441 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmRechargeDailyBalanceRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-daily-balance.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-daily-balance-entity-ts), [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts), [recharge-type-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-type-not-found-error-ts), [recharge-type-inactive.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-type-inactive-error-ts), [invalid-recharge-amount.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-recharge-amount-error-ts), [day-already-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-day-already-closed-error-ts), [daily-balance-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-daily-balance-not-found-error-ts), [invalid-final-balance.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-final-balance-error-ts), [final-balance-exceeds-daily.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-final-balance-exceeds-daily-error-ts), [recharge-day-already-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-already-closed-error-ts), [recharge-daily-balance.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-orm-entity-ts), [recharge-daily-balance.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `TypeOrmRechargeDailyBalanceRepository` (L28–440)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements RechargeDailyBalanceRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(RechargeDailyBalanceOrmEntity) repository: Repository<RechargeDailyBalanceOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ensureDailyBalance` | método public async | 35–54 | `rechargeTypeId: string`, `date: string`, `userId: string` | `Promise<RechargeDailyBalance>` |
| `findByTypeAndDate` | método public async | 56–69 | `rechargeTypeId: string`, `date: string` | `Promise<RechargeDailyBalance \| null>` |
| `findAllByDate` | método public async | 72–88 | `date: string` | `Promise<RechargeDailyBalance[]>` |
| `findLatestPerType` | método public async | 101–118 | — | `Promise<RechargeDailyBalance[]>` |
| `findById` | método public async | 120–127 | `id: string` | `Promise<RechargeDailyBalance \| null>` |
| `registerPurchase` | método public async | 129–148 | `data: RegisterRechargePurchaseData` | `Promise<RechargeDailyBalance>` |
| `sumPurchaseAmounts` | método private async | 151–168 | `dailyBalanceIds: string[]` | `Promise<Map<string, number>>` |
| `registerFinalBalance` | método public async | 170–182 | `data: RegisterRechargeFinalBalanceData` | `Promise<RechargeDailyBalance>` |
| `findHistory` | método public async | 184–230 | `options: FindRechargeHistoryOptions` | `Promise<PaginatedResult<RechargeDailyBalance>>` |
| `getReportSummary` | método public async | 232–284 | `options: FindRechargeReportSummaryOptions` | `Promise<RechargeReportSummary>` |
| `fetchOrThrow` | método private async | 286–295 | `id: string` | `Promise<RechargeDailyBalance>` |
| `translateRechargeError` | método private | 297–328 | `error: unknown` | `unknown` |
| `getDailySalesTotals` | método public async | 330–353 | `startDate: string`, `endDate: string` | `Promise<RechargeDailySalesAmount[]>` |
| `getMonthlySalesTotals` | método public async | 355–378 | `startDate: string`, `endDate: string` | `Promise<RechargeMonthlySalesAmount[]>` |
| `getMonthlySalesTotalsByType` | método public async | 380–409 | `startDate: string`, `endDate: string` | `Promise<RechargeAmountByType[]>` |
| `getMonthlyPurchaseTotalsByType` | método public async | 411–439 | `startDate: string`, `endDate: string` | `Promise<RechargeAmountByType[]>` |

##### `TypeOrmRechargeDailyBalanceRepository.ensureDailyBalance`

- **Firma:** `ensureDailyBalance(rechargeTypeId: string, date: string, userId: string): Promise<RechargeDailyBalance>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L35) (L35–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateRechargeError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `ensure_recharge_daily_balance`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateRechargeError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDailyBalanceRepository.findByTypeAndDate`

- **Firma:** `findByTypeAndDate(rechargeTypeId: string, date: string): Promise<RechargeDailyBalance \| null>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L56) (L56–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `this.sumPurchaseAmounts`, `RechargeDailyBalanceMapper.toDomain`, `totals.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDailyBalanceRepository.findAllByDate`

- **Firma:** `findAllByDate(date: string): Promise<RechargeDailyBalance[]>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L72) (L72–88)
- **Propósito / descripción:** One row per type — the CURRENT (highest-`sequence`) cycle, even if several cycles have accumulated for this date via "Guardar cuadre" resets.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `new Map`, `latestByType.has`, `latestByType.set`, `Array.from`, `latestByType.values`, `this.sumPurchaseAmounts`, `latest.map`, `RechargeDailyBalanceMapper.toDomain`, `totals.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDailyBalanceRepository.findLatestPerType`

- **Firma:** `findLatestPerType(): Promise<RechargeDailyBalance[]>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L101) (L101–118)
- **Propósito / descripción:** `DISTINCT ON` resolves only the target ids (at most one per recharge type — a tiny, bounded result), then a plain `find()` hydrates the full entities with relations — same two-step "resolve ids via DISTINCT ON, then act on hydrated rows" split this codebase already established for `register_recharge_sales_closure`'s own cycle-closing query (see the backend CLAUDE.md's "Cuadre cycles" section: `FOR UPDATE` and `DISTINCT`/`DISTINCT ON` can never share one `SELECT` level in Postgres, and more generally this avoids ever pulling the whole table's history into Node just to keep the top 1-2 rows).
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.repository.find`, `In`, `rows.map`, `this.sumPurchaseAmounts`, `orms.map`, `RechargeDailyBalanceMapper.toDomain`, `totals.get`
- **Efectos secundarios:** Tablas en su SQL: `recharge_daily_balances`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDailyBalanceRepository.findById`

- **Firma:** `findById(id: string): Promise<RechargeDailyBalance \| null>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L120) (L120–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `this.sumPurchaseAmounts`, `RechargeDailyBalanceMapper.toDomain`, `totals.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeDailyBalanceRepository.registerPurchase`

- **Firma:** `registerPurchase(data: RegisterRechargePurchaseData): Promise<RechargeDailyBalance>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L129) (L129–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateRechargeError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `register_recharge_purchase`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateRechargeError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDailyBalanceRepository.sumPurchaseAmounts`

- **Firma:** `sumPurchaseAmounts(dailyBalanceIds: string[]): Promise<Map<string, number>>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L151) (L151–168)
- **Propósito / descripción:** Real `SUM(recharge_purchases.amount)` per `daily_balance_id` — raw SQL (no ORM entity exists for `recharge_purchases`, consistent with this module's "no ORM entity for a write-only movement table" precedent) rather than a QueryBuilder join, to keep every existing `.find`/`.findOne` read path unchanged.
- **Dependencias (llamadas en su cuerpo):** `new Map`, `this.repository.manager.query`, `totals.set`, `parseFloat`
- **Efectos secundarios:** Tablas en su SQL: `recharge_purchases`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeDailyBalanceRepository.registerFinalBalance`

- **Firma:** `registerFinalBalance(data: RegisterRechargeFinalBalanceData): Promise<RechargeDailyBalance>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L170) (L170–182)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateRechargeError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `register_recharge_final_balance`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateRechargeError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDailyBalanceRepository.findHistory`

- **Firma:** `findHistory(options: FindRechargeHistoryOptions): Promise<PaginatedResult<RechargeDailyBalance>>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L184) (L184–230)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('balance').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.orderBy('balance.date', 'DESC').addOrderBy`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `this.sumPurchaseAmounts`, `orms.map`, `RechargeDailyBalanceMapper.toDomain`, `totals.get`
- **Efectos secundarios:** Tablas en su SQL: `recharge_day_openings`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDailyBalanceRepository.getReportSummary`

- **Firma:** `getReportSummary(options: FindRechargeReportSummaryOptions): Promise<RechargeReportSummary>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L232) (L232–284)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.select('COUNT(*)', 'recordCount').addSelect`, `qb.select`, `qb.getRawOne`, `parseInt`, `parseFloat`
- **Efectos secundarios:** Tablas en su SQL: `recharge_day_openings`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDailyBalanceRepository.fetchOrThrow`

- **Firma:** `fetchOrThrow(id: string): Promise<RechargeDailyBalance>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L286) (L286–295)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InternalServerErrorException( 'No se pudo recuperar el saldo diario recién actualizado.', )`
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeDailyBalanceRepository.translateRechargeError`

- **Firma:** `translateRechargeError(error: unknown): unknown` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L297) (L297–328)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new RechargeTypeNotFoundError`, `new RechargeTypeInactiveError`, `new InvalidRechargeAmountError`, `new DayAlreadyClosedError`, `new DailyBalanceNotFoundError`, `new InvalidFinalBalanceError`, `new FinalBalanceExceedsDailyError`, `new RechargeDayAlreadyClosedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeDailyBalanceRepository.getDailySalesTotals`

- **Firma:** `getDailySalesTotals(startDate: string, endDate: string): Promise<RechargeDailySalesAmount[]>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L330) (L330–353)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('balance').select(dateExpr, 'date').addSelect`, `this.repository.createQueryBuilder('balance').select`, `this.repository.createQueryBuilder`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDailyBalanceRepository.getMonthlySalesTotals`

- **Firma:** `getMonthlySalesTotals(startDate: string, endDate: string): Promise<RechargeMonthlySalesAmount[]>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L355) (L355–378)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('balance').select(monthExpr, 'month').addSelect`, `this.repository.createQueryBuilder('balance').select`, `this.repository.createQueryBuilder`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDailyBalanceRepository.getMonthlySalesTotalsByType`

- **Firma:** `getMonthlySalesTotalsByType(startDate: string, endDate: string): Promise<RechargeAmountByType[]>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L380) (L380–409)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('balance').innerJoin`, `this.repository.createQueryBuilder`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDailyBalanceRepository.getMonthlyPurchaseTotalsByType`

- **Firma:** `getMonthlyPurchaseTotalsByType(startDate: string, endDate: string): Promise<RechargeAmountByType[]>` — [typeorm-recharge-daily-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts#L411) (L411–439)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('balance').innerJoin`, `this.repository.createQueryBuilder`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-audit-log-repository-ts"></a>

### typeorm-recharge-day-audit-log.repository.ts

- **Ruta:** [typeorm-recharge-day-audit-log.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-audit-log.repository.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-audit-log.repository.ts`, 45 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmRechargeDayAuditLogRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-day-audit-log.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-day-audit-log-entity-ts), [recharge-day-audit-log.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-audit-log-repository-ts), [recharge-day-audit-log.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-audit-log-orm-entity-ts), [recharge-day-audit-log.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-audit-log-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `TypeOrmRechargeDayAuditLogRepository` (L12–44)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements RechargeDayAuditLogRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(RechargeDayAuditLogOrmEntity) repository: Repository<RechargeDayAuditLogOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findByDate` | método public async | 19–25 | `date: string` | `Promise<RechargeDayAuditLog[]>` |
| `record` | método public async | 27–43 | `data: CreateRechargeDayAuditLogData` | `Promise<RechargeDayAuditLog>` |

##### `TypeOrmRechargeDayAuditLogRepository.findByDate`

- **Firma:** `findByDate(date: string): Promise<RechargeDayAuditLog[]>` — [typeorm-recharge-day-audit-log.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-audit-log.repository.ts#L19) (L19–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `RechargeDayAuditLogMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDayAuditLogRepository.record`

- **Firma:** `record(data: CreateRechargeDayAuditLogData): Promise<RechargeDayAuditLog>` — [typeorm-recharge-day-audit-log.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-audit-log.repository.ts#L27) (L27–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `RechargeDayAuditLogMapper.toDomain`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts"></a>

### typeorm-recharge-day-opening.repository.ts

- **Ruta:** [typeorm-recharge-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts`, 333 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmRechargeDayOpeningRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-day-opening.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-day-opening-entity-ts), [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts), [recharge-day-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-found-error-ts), [recharge-day-not-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-closed-error-ts), [recharge-day-cancelled.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-cancelled-error-ts), [recharge-day-already-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-already-closed-error-ts), [recharge-day-not-opened.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-opened-error-ts), [recharge-day-not-ready-to-close.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-not-ready-to-close-error-ts), [recharge-later-day-exists.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-later-day-exists-error-ts), [recharge-day-reason-required.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-reason-required-error-ts), [recharge-day-opening.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-opening-orm-entity-ts), [recharge-day-opening.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-opening-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `TypeOrmRechargeDayOpeningRepository` (L27–332)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements RechargeDayOpeningRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(RechargeDayOpeningOrmEntity) repository: Repository<RechargeDayOpeningOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findByDate` | método public async | 34–37 | `date: string` | `Promise<RechargeDayOpening \| null>` |
| `open` | método public async | 47–69 | `date: string`, `userId: string` | `Promise<RechargeDayOpening>` |
| `close` | método public async | 71–82 | `date: string`, `userId: string` | `Promise<RechargeDayOpening>` |
| `findClosedDays` | método public async | 97–243 | `filters: RechargeClosedDaysFilters` | `Promise<RechargeClosedDayViewRow[]>` |
| `reopen` | método public async | 245–260 | `date: string`, `userId: string`, `reason: string` | `Promise<RechargeDayOpening>` |
| `cancel` | método public async | 262–277 | `date: string`, `userId: string`, `reason: string` | `Promise<RechargeDayOpening>` |
| `formatDateOnly` | método private | 280–288 | `value: string \| Date` | `string` |
| `translateError` | método private | 298–331 | `error: unknown`, `date: string` | `unknown` |

##### `TypeOrmRechargeDayOpeningRepository.findByDate`

- **Firma:** `findByDate(date: string): Promise<RechargeDayOpening \| null>` — [typeorm-recharge-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts#L34) (L34–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `RechargeDayOpeningMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeDayOpeningRepository.open`

- **Firma:** `open(date: string, userId: string): Promise<RechargeDayOpening>` — [typeorm-recharge-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts#L47) (L47–69)
- **Propósito / descripción:** Idempotent: if `date` already has a row, returns it as-is (never creates a second one). The `try/catch` around the `UQ_recharge_day_openings_date` violation (the table's own `date` `UNIQUE` constraint) is the safety net for a double-click race — the same pattern `TypeOrmDayOpeningRepository.open` already uses for Banks' identical situation — not the primary path.
- **Dependencias (llamadas en su cuerpo):** `this.findByDate`, `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `RechargeDayOpeningMapper.toDomain`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `error`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDayOpeningRepository.close`

- **Firma:** `close(date: string, userId: string): Promise<RechargeDayOpening>` — [typeorm-recharge-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts#L71) (L71–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateError`, `this.repository.findOneOrFail`, `RechargeDayOpeningMapper.toDomain`
- **Efectos secundarios:** Llama funciones SQL: `close_recharge_day`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error, date)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDayOpeningRepository.findClosedDays`

- **Firma:** `findClosedDays(filters: RechargeClosedDaysFilters): Promise<RechargeClosedDayViewRow[]>` — [typeorm-recharge-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts#L97) (L97–243)
- **Propósito / descripción:** Lists only dates that were ever closed — never a day still in progress, which isn't this administrative module's concern. Each total comes from a subquery correlated to that date's LATEST `recharge_sales_closures` row, ordered by `sequence DESC` (not `created_at DESC` the way Banks' equivalent subquery orders — this table's own `sequence` column is the authoritative cycle ordinal, see `RechargeSalesClosure`'s own doc comment) — there can be more than one historical row per date given this module's own multi-cycle-per- day cuadre feature. `cycleCount` is the one field Banks' own `ClosedDayViewRow` has no equivalent of, added specifically because of that same feature.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('day').leftJoin`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.select('day.date', 'date').addSelect('day.isCancelled', 'isCancelled').addSelect`, `qb.select('day.date', 'date').addSelect`, `qb.select`, `subQb.select('c.total_sales', 'value').from('recharge_sales_closures', 'c').where`, `subQb.select('c.total_sales', 'value').from`, `subQb.select`, `subQb.select('c.total_collected', 'value').from('recharge_sales_closures', 'c').where`, `subQb.select('c.total_collected', 'value').from`, `subQb.select('c.result', 'value').from('recharge_sales_closures', 'c').where`, `subQb.select('c.result', 'value').from`, `subQb.select('COUNT(*)', 'value').from('recharge_sales_closures', 'c').where`, `subQb.select('COUNT(*)', 'value').from`, `qb.getRawMany`, `rows.map`, `this.formatDateOnly`…
- **Efectos secundarios:** Tablas en su SQL: `recharge_sales_closures`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDayOpeningRepository.reopen`

- **Firma:** `reopen(date: string, userId: string, reason: string): Promise<RechargeDayOpening>` — [typeorm-recharge-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts#L245) (L245–260)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateError`, `this.repository.findOneOrFail`, `RechargeDayOpeningMapper.toDomain`
- **Efectos secundarios:** Llama funciones SQL: `reopen_recharge_day`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error, date)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDayOpeningRepository.cancel`

- **Firma:** `cancel(date: string, userId: string, reason: string): Promise<RechargeDayOpening>` — [typeorm-recharge-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts#L262) (L262–277)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateError`, `this.repository.findOneOrFail`, `RechargeDayOpeningMapper.toDomain`
- **Efectos secundarios:** Llama funciones SQL: `cancel_recharge_day`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error, date)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeDayOpeningRepository.formatDateOnly`

- **Firma:** `formatDateOnly(value: string \| Date): string` — [typeorm-recharge-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts#L280) (L280–288)
- **Propósito / descripción:** UTC getters on purpose — the pg driver builds this `Date` at UTC midnight for a `date` column; using local getters could shift the date by a day depending on the server's timezone.
- **Dependencias (llamadas en su cuerpo):** `value.getUTCFullYear`, `String(value.getUTCMonth() + 1).padStart`, `String`, `value.getUTCMonth`, `String(value.getUTCDate()).padStart`, `value.getUTCDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeDayOpeningRepository.translateError`

- **Firma:** `translateError(error: unknown, date: string): unknown` — [typeorm-recharge-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts#L298) (L298–331)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;date&gt;'` → domain-error translation pattern as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists. `close_recharge_day`/`reopen_recharge_day`/`cancel_recharge_day` (migration `1759000000000-CreateRechargeDayOpenings`) are the three functions behind `close()`/`reopen()`/`cancel()` above.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new RechargeReopenReasonRequiredError`, `new RechargeCancelReasonRequiredError`, `new RechargeDayNotFoundError`, `new RechargeDayCancelledError`, `new RechargeDayAlreadyCancelledError`, `new RechargeDayNotClosedError`, `new RechargeDayAlreadyClosedError`, `new RechargeDayNotOpenedError`, `new RechargeDayNotReadyToCloseError`, `new RechargeLaterDayExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-purchase-repository-ts"></a>

### typeorm-recharge-purchase.repository.ts

- **Ruta:** [typeorm-recharge-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-purchase.repository.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-purchase.repository.ts`, 105 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmRechargePurchaseRepository`, `CURRENT_CYCLE_IDS_SUBQUERY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-purchase.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-purchase-entity-ts), [recharge-purchase.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-purchase-repository-ts), [recharge-purchase-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-not-found-error-ts), [recharge-purchase-already-voided.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-already-voided-error-ts), [recharge-purchase-cycle-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-cycle-closed-error-ts), [insufficient-balance-to-revert.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-insufficient-balance-to-revert-error-ts), [void-reason-required.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-void-reason-required-error-ts), [recharge-purchase-day-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-purchase-day-closed-error-ts), [recharge-purchase-full.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-purchase-full-orm-entity-ts), [recharge-purchase.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-purchase-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `TypeOrmRechargePurchaseRepository` (L23–104)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements RechargePurchaseRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(RechargePurchaseFullOrmEntity) repository: Repository<RechargePurchaseFullOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAllByDate` | método public async | 32–45 | `date: string` | `Promise<RechargePurchase[]>` |
| `findById` | método public async | 47–50 | `id: string` | `Promise<RechargePurchase \| null>` |
| `voidPurchase` | método public async | 52–73 | `id: string`, `voidedBy: string`, `reason: string` | `Promise<RechargePurchase>` |
| `translatePurchaseVoidError` | método private | 76–103 | `error: unknown` | `unknown` |

##### `TypeOrmRechargePurchaseRepository.findAllByDate`

- **Firma:** `findAllByDate(date: string): Promise<RechargePurchase[]>` — [typeorm-recharge-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-purchase.repository.ts#L32) (L32–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('purchase').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `orms.map`, `RechargePurchaseMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargePurchaseRepository.findById`

- **Firma:** `findById(id: string): Promise<RechargePurchase \| null>` — [typeorm-recharge-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-purchase.repository.ts#L47) (L47–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `RechargePurchaseMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargePurchaseRepository.voidPurchase`

- **Firma:** `voidPurchase(id: string, voidedBy: string, reason: string): Promise<RechargePurchase>` — [typeorm-recharge-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-purchase.repository.ts#L52) (L52–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translatePurchaseVoidError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `void_recharge_purchase`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translatePurchaseVoidError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la compra recién revertida.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargePurchaseRepository.translatePurchaseVoidError`

- **Firma:** `translatePurchaseVoidError(error: unknown): unknown` — [typeorm-recharge-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-purchase.repository.ts#L76) (L76–103)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;id&gt;'` → domain-error translation pattern as every other stored-function module in this codebase — see `translateBankDepositError`'s own doc comment.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new VoidReasonRequiredError`, `new RechargePurchaseNotFoundError`, `new RechargePurchaseAlreadyVoidedError`, `new RechargePurchaseDayClosedError`, `new RechargePurchaseCycleClosedError`, `new InsufficientBalanceToRevertError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts"></a>

### typeorm-recharge-sale.repository.ts

- **Ruta:** [typeorm-recharge-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sale.repository.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sale.repository.ts`, 170 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmRechargeSaleRepository`, `CURRENT_CYCLE_IDS_SUBQUERY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sale.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sale-entity-ts), [recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sale-repository-ts), [recharge-type-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-type-not-found-error-ts), [recharge-type-inactive.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-type-inactive-error-ts), [invalid-recharge-amount.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-recharge-amount-error-ts), [invalid-phone-number.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-phone-number-error-ts), [day-already-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-day-already-closed-error-ts), [recharge-sale-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-sale-not-found-error-ts), [recharge-sale-locked.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-sale-locked-error-ts), [recharge-day-already-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-already-closed-error-ts), [recharge-sale.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-orm-entity-ts), [recharge-sale.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `TypeOrmRechargeSaleRepository` (L30–169)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements RechargeSaleRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(RechargeSaleOrmEntity) repository: Repository<RechargeSaleOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public async | 37–54 | `data: CreateRechargeSaleData` | `Promise<RechargeSale>` |
| `update` | método public async | 56–66 | `data: UpdateRechargeSaleData` | `Promise<RechargeSale>` |
| `delete` | método public async | 68–76 | `id: string` | `Promise<void>` |
| `findById` | método public async | 78–81 | `id: string` | `Promise<RechargeSale \| null>` |
| `findAllByDate` | método public async | 83–96 | `date: string` | `Promise<RechargeSale[]>` |
| `getCurrentCycleTotalsByDate` | método public async | 98–123 | `date: string` | `Promise<RechargeTypeSalesTotal[]>` |
| `fetchOrThrow` | método private async | 125–134 | `id: string` | `Promise<RechargeSale>` |
| `translateError` | método private | 137–168 | `error: unknown` | `unknown` |

##### `TypeOrmRechargeSaleRepository.create`

- **Firma:** `create(data: CreateRechargeSaleData): Promise<RechargeSale>` — [typeorm-recharge-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sale.repository.ts#L37) (L37–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `register_recharge_sale`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSaleRepository.update`

- **Firma:** `update(data: UpdateRechargeSaleData): Promise<RechargeSale>` — [typeorm-recharge-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sale.repository.ts#L56) (L56–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `update_recharge_sale`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSaleRepository.delete`

- **Firma:** `delete(id: string): Promise<void>` — [typeorm-recharge-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sale.repository.ts#L68) (L68–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateError`
- **Efectos secundarios:** Llama funciones SQL: `delete_recharge_sale`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSaleRepository.findById`

- **Firma:** `findById(id: string): Promise<RechargeSale \| null>` — [typeorm-recharge-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sale.repository.ts#L78) (L78–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `RechargeSaleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeSaleRepository.findAllByDate`

- **Firma:** `findAllByDate(date: string): Promise<RechargeSale[]>` — [typeorm-recharge-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sale.repository.ts#L83) (L83–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('sale').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `orms.map`, `RechargeSaleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSaleRepository.getCurrentCycleTotalsByDate`

- **Firma:** `getCurrentCycleTotalsByDate(date: string): Promise<RechargeTypeSalesTotal[]>` — [typeorm-recharge-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sale.repository.ts#L98) (L98–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `raw.map`, `parseFloat`
- **Efectos secundarios:** Tablas en su SQL: `recharge_daily_balances`, `recharge_types`, `recharge_sales`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSaleRepository.fetchOrThrow`

- **Firma:** `fetchOrThrow(id: string): Promise<RechargeSale>` — [typeorm-recharge-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sale.repository.ts#L125) (L125–134)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InternalServerErrorException( 'No se pudo recuperar la recarga recién guardada.', )`
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeSaleRepository.translateError`

- **Firma:** `translateError(error: unknown): unknown` — [typeorm-recharge-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sale.repository.ts#L137) (L137–168)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;id&gt;'` → domain-error translation pattern as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new RechargeTypeNotFoundError`, `new RechargeTypeInactiveError`, `new InvalidRechargeAmountError`, `new InvalidPhoneNumberError`, `new DayAlreadyClosedError`, `new RechargeSaleNotFoundError`, `new RechargeSaleLockedError`, `new RechargeDayAlreadyClosedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sales-closure-repository-ts"></a>

### typeorm-recharge-sales-closure.repository.ts

- **Ruta:** [typeorm-recharge-sales-closure.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sales-closure.repository.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sales-closure.repository.ts`, 99 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmRechargeSalesClosureRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sales-closure.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sales-closure-entity-ts), [recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sales-closure-repository-ts), [invalid-total-collected.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-total-collected-error-ts), [pending-type-closure.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-pending-type-closure-error-ts), [sales-closure-edit-forbidden.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sales-closure-edit-forbidden-error-ts), [recharge-day-already-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-already-closed-error-ts), [recharge-sales-closure.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sales-closure-orm-entity-ts), [recharge-sales-closure.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sales-closure-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `TypeOrmRechargeSalesClosureRepository` (L16–98)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements RechargeSalesClosureRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(RechargeSalesClosureOrmEntity) repository: Repository<RechargeSalesClosureOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findByDateAndSequence` | método public async | 23–29 | `date: string`, `sequence: number` | `Promise<RechargeSalesClosure \| null>` |
| `findAllByDate` | método public async | 31–37 | `date: string` | `Promise<RechargeSalesClosure[]>` |
| `existsForDate` | método public async | 39–42 | `date: string` | `Promise<boolean>` |
| `registerClosure` | método public async | 44–72 | `data: RegisterRechargeSalesClosureData` | `Promise<RechargeSalesClosure>` |
| `translateClosureError` | método private | 74–97 | `error: unknown` | `unknown` |

##### `TypeOrmRechargeSalesClosureRepository.findByDateAndSequence`

- **Firma:** `findByDateAndSequence(date: string, sequence: number): Promise<RechargeSalesClosure \| null>` — [typeorm-recharge-sales-closure.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sales-closure.repository.ts#L23) (L23–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `RechargeSalesClosureMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSalesClosureRepository.findAllByDate`

- **Firma:** `findAllByDate(date: string): Promise<RechargeSalesClosure[]>` — [typeorm-recharge-sales-closure.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sales-closure.repository.ts#L31) (L31–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `RechargeSalesClosureMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSalesClosureRepository.existsForDate`

- **Firma:** `existsForDate(date: string): Promise<boolean>` — [typeorm-recharge-sales-closure.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sales-closure.repository.ts#L39) (L39–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.count`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSalesClosureRepository.registerClosure`

- **Firma:** `registerClosure(data: RegisterRechargeSalesClosureData): Promise<RechargeSalesClosure>` — [typeorm-recharge-sales-closure.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sales-closure.repository.ts#L44) (L44–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateClosureError`, `this.repository.findOne`, `new InternalServerErrorException`, `RechargeSalesClosureMapper.toDomain`
- **Efectos secundarios:** Llama funciones SQL: `register_recharge_sales_closure`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateClosureError(error)`, `new InternalServerErrorException( 'No se pudo recuperar el cuadre recién guardado.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSalesClosureRepository.translateClosureError`

- **Firma:** `translateClosureError(error: unknown): unknown` — [typeorm-recharge-sales-closure.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sales-closure.repository.ts#L74) (L74–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new InvalidTotalCollectedError`, `new PendingTypeClosureError`, `new SalesClosureEditForbiddenError`, `new RechargeDayAlreadyClosedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-daily-stock-repository-ts"></a>

### typeorm-recharge-sim-daily-stock.repository.ts

- **Ruta:** [typeorm-recharge-sim-daily-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts`, 222 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmRechargeSimDailyStockRepository`, `MovementTotals`, `EMPTY_MOVEMENTS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts), [recharge-sim-daily-stock.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-daily-stock-entity-ts), [recharge-sim-daily-stock.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-daily-stock-repository-ts), [sim-type-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-type-not-found-error-ts), [sim-type-inactive.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-type-inactive-error-ts), [invalid-sim-quantity.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-sim-quantity-error-ts), [insufficient-sim-stock.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-insufficient-sim-stock-error-ts), [recharge-day-already-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-already-closed-error-ts), [recharge-sim-daily-stock.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-daily-stock-orm-entity-ts), [recharge-sim-daily-stock.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-daily-stock-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface MovementTotals` (L20): sin documentación — miembros: `purchasedQuantity`, `purchasedTotal`, `soldQuantity`, `soldTotal`

#### Clase `TypeOrmRechargeSimDailyStockRepository` (L34–221)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements RechargeSimDailyStockRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(RechargeSimDailyStockOrmEntity) repository: Repository<RechargeSimDailyStockOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ensureDailyStock` | método public async | 41–60 | `simTypeId: string`, `date: string`, `userId: string` | `Promise<RechargeSimDailyStock>` |
| `findAllByDate` | método public async | 62–74 | `date: string` | `Promise<RechargeSimDailyStock[]>` |
| `findById` | método public async | 76–86 | `id: string` | `Promise<RechargeSimDailyStock \| null>` |
| `registerPurchase` | método public async | 88–106 | `data: RegisterRechargeSimPurchaseData` | `Promise<RechargeSimDailyStock>` |
| `registerSale` | método public async | 108–126 | `data: RegisterRechargeSimSaleData` | `Promise<RechargeSimDailyStock>` |
| `registerSingleUnitSale` | método public async | 128–142 | `data: RegisterRechargeSimSaleUnitData`, `context?: TransactionContext` | `Promise<string>` |
| `sumMovements` | método private async | 145–183 | `dailyStockIds: string[]` | `Promise<Map<string, MovementTotals>>` |
| `fetchOrThrow` | método private async | 185–193 | `id: string` | `Promise<RechargeSimDailyStock>` |
| `translateSimError` | método private | 196–220 | `error: unknown` | `unknown` |

##### `TypeOrmRechargeSimDailyStockRepository.ensureDailyStock`

- **Firma:** `ensureDailyStock(simTypeId: string, date: string, userId: string): Promise<RechargeSimDailyStock>` — [typeorm-recharge-sim-daily-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts#L41) (L41–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateSimError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `ensure_recharge_sim_daily_stock`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateSimError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimDailyStockRepository.findAllByDate`

- **Firma:** `findAllByDate(date: string): Promise<RechargeSimDailyStock[]>` — [typeorm-recharge-sim-daily-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts#L62) (L62–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `this.sumMovements`, `orms.map`, `RechargeSimDailyStockMapper.toDomain`, `movements.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimDailyStockRepository.findById`

- **Firma:** `findById(id: string): Promise<RechargeSimDailyStock \| null>` — [typeorm-recharge-sim-daily-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts#L76) (L76–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `this.sumMovements`, `RechargeSimDailyStockMapper.toDomain`, `movements.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeSimDailyStockRepository.registerPurchase`

- **Firma:** `registerPurchase(data: RegisterRechargeSimPurchaseData): Promise<RechargeSimDailyStock>` — [typeorm-recharge-sim-daily-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts#L88) (L88–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateSimError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `register_recharge_sim_purchase`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateSimError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimDailyStockRepository.registerSale`

- **Firma:** `registerSale(data: RegisterRechargeSimSaleData): Promise<RechargeSimDailyStock>` — [typeorm-recharge-sim-daily-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts#L108) (L108–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateSimError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `register_recharge_sim_sale`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateSimError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimDailyStockRepository.registerSingleUnitSale`

- **Firma:** `registerSingleUnitSale(data: RegisterRechargeSimSaleUnitData, context?: TransactionContext): Promise<string>` — [typeorm-recharge-sim-daily-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts#L128) (L128–142)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`, `this.translateSimError`
- **Efectos secundarios:** Llama funciones SQL: `register_recharge_sim_sale_unit`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateSimError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimDailyStockRepository.sumMovements`

- **Firma:** `sumMovements(dailyStockIds: string[]): Promise<Map<string, MovementTotals>>` — [typeorm-recharge-sim-daily-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts#L145) (L145–183)
- **Propósito / descripción:** Real `SUM(quantity)`/`SUM(total)` per `daily_stock_id`, one bulk query per table — raw SQL (no ORM entity exists for these write-heavy movement tables, same "no ORM entity for a movement audit trail" precedent `recharge_purchases` already established) rather than a QueryBuilder join.
- **Dependencias (llamadas en su cuerpo):** `new Map`, `this.repository.manager.query`, `totals.set`, `totals.get`, `parseInt`, `parseFloat`
- **Efectos secundarios:** Tablas en su SQL: `recharge_sim_purchases`, `recharge_sim_sales`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeSimDailyStockRepository.fetchOrThrow`

- **Firma:** `fetchOrThrow(id: string): Promise<RechargeSimDailyStock>` — [typeorm-recharge-sim-daily-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts#L185) (L185–193)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InternalServerErrorException( 'No se pudo recuperar el stock de SIM recién actualizado.', )`
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeSimDailyStockRepository.translateSimError`

- **Firma:** `translateSimError(error: unknown): unknown` — [typeorm-recharge-sim-daily-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts#L196) (L196–220)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;extra&gt;'` → domain-error translation pattern as `TypeOrmRechargeDailyBalanceRepository.translateRechargeError`.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new SimTypeNotFoundError`, `new SimTypeInactiveError`, `new InvalidSimQuantityError`, `new InsufficientSimStockError`, `new RechargeDayAlreadyClosedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-registration-repository-ts"></a>

### typeorm-recharge-sim-sale-registration.repository.ts

- **Ruta:** [typeorm-recharge-sim-sale-registration.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts`, 272 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmRechargeSimSaleRegistrationRepository`, `SELECT_COLUMNS`, `FROM_JOINS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts), [recharge-sim-sale-registration.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-sale-registration-entity-ts), [recharge-sim-sale-registration.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-registration-repository-ts), [recharge-sim-sale-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-sim-sale-not-found-error-ts), [sim-sale-registration-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-not-found-error-ts), [sim-sale-registration-already-voided.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-already-voided-error-ts), [sim-sale-registration-void-reason-required.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-registration-void-reason-required-error-ts), [invalid-sim-sale-client.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-sim-sale-client-error-ts), [invalid-sim-sale-price.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-sim-sale-price-error-ts), [sim-number-required.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-number-required-error-ts), [sim-sale-sku-required.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-sku-required-error-ts), [client-dpi-required.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-client-dpi-required-error-ts), [recharge-day-already-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-day-already-closed-error-ts), [recharge-sim-sale-registration.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-sale-registration-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `TypeOrmRechargeSimSaleRegistrationRepository` (L52–271)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements RechargeSimSaleRegistrationRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectDataSource() dataSource: DataSource`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getManager` | método private | 58–60 | `context?: TransactionContext` | `EntityManager` |
| `create` | método public async | 62–88 | `data: RegisterRechargeSimSaleRegistrationData`, `context?: TransactionContext` | `Promise<RechargeSimSaleRegistration>` |
| `findById` | método public async | 90–96 | `id: string` | `Promise<RechargeSimSaleRegistration \| null>` |
| `findAll` | método public async | 98–144 | `filters: ListRechargeSimSaleRegistrationsFilters` | `Promise<ListRechargeSimSaleRegistrationsResult>` |
| `getTotalByDate` | método public async | 146–170 | `date: string` | `Promise<number>` |
| `voidRegistration` | método public async | 172–186 | `id: string`, `voidedBy: string`, `reason: string` | `Promise<RechargeSimSaleRegistration>` |
| `saveDpiImage` | método public async | 188–202 | `data: Buffer`, `mimeType: string`, `userId: string`, `context?: TransactionContext` | `Promise<string>` |
| `getDpiImage` | método public async | 204–218 | `registrationId: string` | `Promise<DpiImage \| null>` |
| `fetchOrThrow` | método private async | 220–234 | `id: string`, `manager: EntityManager` | `Promise<RechargeSimSaleRegistration>` |
| `translateError` | método private | 237–270 | `error: unknown` | `unknown` |

##### `TypeOrmRechargeSimSaleRegistrationRepository.getManager`

- **Firma:** `getManager(context?: TransactionContext): EntityManager` — [typeorm-recharge-sim-sale-registration.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeSimSaleRegistrationRepository.create`

- **Firma:** `create(data: RegisterRechargeSimSaleRegistrationData, context?: TransactionContext): Promise<RechargeSimSaleRegistration>` — [typeorm-recharge-sim-sale-registration.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts#L62) (L62–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getManager`, `manager.query`, `this.translateError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `register_recharge_sim_sale_registration`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimSaleRegistrationRepository.findById`

- **Firma:** `findById(id: string): Promise<RechargeSimSaleRegistration \| null>` — [typeorm-recharge-sim-sale-registration.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts#L90) (L90–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.manager.query`, `RechargeSimSaleRegistrationMapper.toDomain`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimSaleRegistrationRepository.findAll`

- **Firma:** `findAll(filters: ListRechargeSimSaleRegistrationsFilters): Promise<ListRechargeSimSaleRegistrationsResult>` — [typeorm-recharge-sim-sale-registration.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts#L98) (L98–144)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `params.push`, `conditions.push`, `conditions.join`, `this.dataSource.manager.query`, `parseInt`, `rows.map`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimSaleRegistrationRepository.getTotalByDate`

- **Firma:** `getTotalByDate(date: string): Promise<number>` — [typeorm-recharge-sim-sale-registration.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts#L146) (L146–170)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.manager.query`, `parseFloat`
- **Efectos secundarios:** Tablas en su SQL: `recharge_sim_sales`, `recharge_sim_sale_registrations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimSaleRegistrationRepository.voidRegistration`

- **Firma:** `voidRegistration(id: string, voidedBy: string, reason: string): Promise<RechargeSimSaleRegistration>` — [typeorm-recharge-sim-sale-registration.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts#L172) (L172–186)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.manager.query`, `this.translateError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `void_recharge_sim_sale_registration`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimSaleRegistrationRepository.saveDpiImage`

- **Firma:** `saveDpiImage(data: Buffer, mimeType: string, userId: string, context?: TransactionContext): Promise<string>` — [typeorm-recharge-sim-sale-registration.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts#L188) (L188–202)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getManager`, `manager.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimSaleRegistrationRepository.getDpiImage`

- **Firma:** `getDpiImage(registrationId: string): Promise<DpiImage \| null>` — [typeorm-recharge-sim-sale-registration.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts#L204) (L204–218)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.manager.query`
- **Efectos secundarios:** Tablas en su SQL: `recharge_sim_sale_registrations`, `recharge_sim_dpi_images`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimSaleRegistrationRepository.fetchOrThrow`

- **Firma:** `fetchOrThrow(id: string, manager: EntityManager): Promise<RechargeSimSaleRegistration>` — [typeorm-recharge-sim-sale-registration.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts#L220) (L220–234)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`, `new InternalServerErrorException`, `RechargeSimSaleRegistrationMapper.toDomain`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `new InternalServerErrorException( 'No se pudo recuperar el registro de venta de SIM recién creado.', )`
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeSimSaleRegistrationRepository.translateError`

- **Firma:** `translateError(error: unknown): unknown` — [typeorm-recharge-sim-sale-registration.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts#L237) (L237–270)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;extra&gt;'` → domain-error translation pattern used throughout this module.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new RechargeSimSaleNotFoundError`, `new SimNumberRequiredError`, `new SimSaleSkuRequiredError`, `new ClientDpiRequiredError`, `new InvalidSimSalePriceError`, `new InvalidSimSaleClientError`, `new RechargeDayAlreadyClosedError`, `new SimSaleRegistrationVoidReasonRequiredError`, `new SimSaleRegistrationNotFoundError`, `new SimSaleRegistrationAlreadyVoidedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-sale-repository-ts"></a>

### typeorm-recharge-sim-sale.repository.ts

- **Ruta:** [typeorm-recharge-sim-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale.repository.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale.repository.ts`, 112 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmRechargeSimSaleRepository`, `SELECT_COLUMNS`, `FROM_JOINS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sim-sale.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-sale-entity-ts), [recharge-sim-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-sale-repository-ts), [recharge-sim-sale-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-sim-sale-not-found-error-ts), [sim-sale-already-voided.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-already-voided-error-ts), [sim-sale-void-reason-required.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-void-reason-required-error-ts), [sim-sale-has-registration.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-has-registration-error-ts), [sim-sale-day-closed.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-sim-sale-day-closed-error-ts), [recharge-sim-sale.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-sale-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `TypeOrmRechargeSimSaleRepository` (L33–111)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements RechargeSimSaleRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectDataSource() dataSource: DataSource`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAllByDate` | método public async | 37–55 | `date: string` | `Promise<RechargeSimSale[]>` |
| `findById` | método public async | 57–63 | `id: string` | `Promise<RechargeSimSale \| null>` |
| `voidSale` | método public async | 65–83 | `id: string`, `voidedBy: string`, `reason: string` | `Promise<RechargeSimSale>` |
| `translateVoidError` | método private | 86–110 | `error: unknown`, `id: string` | `unknown` |

##### `TypeOrmRechargeSimSaleRepository.findAllByDate`

- **Firma:** `findAllByDate(date: string): Promise<RechargeSimSale[]>` — [typeorm-recharge-sim-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale.repository.ts#L37) (L37–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.manager.query`, `rows.map`, `RechargeSimSaleMapper.toDomain`
- **Efectos secundarios:** Tablas en su SQL: `recharge_sim_sale_registrations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimSaleRepository.findById`

- **Firma:** `findById(id: string): Promise<RechargeSimSale \| null>` — [typeorm-recharge-sim-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale.repository.ts#L57) (L57–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.manager.query`, `RechargeSimSaleMapper.toDomain`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeSimSaleRepository.voidSale`

- **Firma:** `voidSale(id: string, voidedBy: string, reason: string): Promise<RechargeSimSale>` — [typeorm-recharge-sim-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale.repository.ts#L65) (L65–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.manager.query`, `this.translateVoidError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `void_recharge_sim_sale`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateVoidError(error, id)`, `new InternalServerErrorException( 'No se pudo recuperar la venta de SIM recién anulada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimSaleRepository.translateVoidError`

- **Firma:** `translateVoidError(error: unknown, id: string): unknown` — [typeorm-recharge-sim-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale.repository.ts#L86) (L86–110)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;id&gt;'` → domain-error translation pattern as `translatePurchaseVoidError`.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new SimSaleVoidReasonRequiredError`, `new RechargeSimSaleNotFoundError`, `new SimSaleAlreadyVoidedError`, `new SimSaleHasRegistrationError`, `new SimSaleDayClosedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sim-type-repository-ts"></a>

### typeorm-recharge-sim-type.repository.ts

- **Ruta:** [typeorm-recharge-sim-type.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-type.repository.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-type.repository.ts`, 31 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmRechargeSimTypeRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-sim-type.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-sim-type-entity-ts), [recharge-sim-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-sim-type-repository-ts), [recharge-sim-type.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-type-orm-entity-ts), [recharge-sim-type.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-type-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `TypeOrmRechargeSimTypeRepository` (L9–30)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements RechargeSimTypeRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(RechargeSimTypeOrmEntity) repository: Repository<RechargeSimTypeOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 16–24 | `options?: { activeOnly?: boolean; }` | `Promise<RechargeSimType[]>` |
| `findById` | método public async | 26–29 | `id: string` | `Promise<RechargeSimType \| null>` |

##### `TypeOrmRechargeSimTypeRepository.findAll`

- **Firma:** `findAll(options?: { activeOnly?: boolean; }): Promise<RechargeSimType[]>` — [typeorm-recharge-sim-type.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-type.repository.ts#L16) (L16–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `RechargeSimTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeSimTypeRepository.findById`

- **Firma:** `findById(id: string): Promise<RechargeSimType \| null>` — [typeorm-recharge-sim-type.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-type.repository.ts#L26) (L26–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `RechargeSimTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-type-repository-ts"></a>

### typeorm-recharge-type.repository.ts

- **Ruta:** [typeorm-recharge-type.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-type.repository.ts) (`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-type.repository.ts`, 64 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmRechargeTypeRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-type.entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-entities-recharge-type-entity-ts), [recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-type-repository-ts), [recharge-type-not-found.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-recharge-type-not-found-error-ts), [recharge-type.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-orm-entity-ts), [recharge-type.mapper.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `TypeOrmRechargeTypeRepository` (L10–63)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements RechargeTypeRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(RechargeTypeOrmEntity) repository: Repository<RechargeTypeOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 17–23 | `options?: { activeOnly?: boolean }` | `Promise<RechargeType[]>` |
| `findById` | método public async | 25–28 | `id: string` | `Promise<RechargeType \| null>` |
| `updateMinBalance` | método public async | 30–45 | `id: string`, `minBalance: number` | `Promise<RechargeType>` |
| `updateBalanceLimit` | método public async | 47–62 | `id: string`, `balanceLimit: number` | `Promise<RechargeType>` |

##### `TypeOrmRechargeTypeRepository.findAll`

- **Firma:** `findAll(options?: { activeOnly?: boolean }): Promise<RechargeType[]>` — [typeorm-recharge-type.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-type.repository.ts#L17) (L17–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `RechargeTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeTypeRepository.findById`

- **Firma:** `findById(id: string): Promise<RechargeType \| null>` — [typeorm-recharge-type.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-type.repository.ts#L25) (L25–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `RechargeTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeTypeRepository.updateMinBalance`

- **Firma:** `updateMinBalance(id: string, minBalance: number): Promise<RechargeType>` — [typeorm-recharge-type.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-type.repository.ts#L30) (L30–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `new RechargeTypeNotFoundError`, `this.repository.findOne`, `new InternalServerErrorException`, `RechargeTypeMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `new RechargeTypeNotFoundError(id)`, `new InternalServerErrorException( 'No se pudo recuperar el tipo de recarga recién actualizado.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeTypeRepository.updateBalanceLimit`

- **Firma:** `updateBalanceLimit(id: string, balanceLimit: number): Promise<RechargeType>` — [typeorm-recharge-type.repository.ts](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-type.repository.ts#L47) (L47–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `new RechargeTypeNotFoundError`, `this.repository.findOne`, `new InternalServerErrorException`, `RechargeTypeMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `new RechargeTypeNotFoundError(id)`, `new InternalServerErrorException( 'No se pudo recuperar el tipo de recarga recién actualizado.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts"></a>

### recharge-days.controller.ts

- **Ruta:** [recharge-days.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-days.controller.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-days.controller.ts`, 81 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** "Sistema → Gestión de Días de Recargas" — the Recargas-specific counterpart to Banks' "Gestión de Días Cerrados" (`ClosedDaysController`), fully independent from it: separate table, separate stored functions, separate route.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [list-closed-recharge-days.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-closed-recharge-days-use-case-ts), [get-recharge-day-detail.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-day-detail-use-case-ts), [reopen-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-reopen-recharge-day-use-case-ts), [cancel-recharge-day.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-cancel-recharge-day-use-case-ts), [list-recharge-closed-days.query.dto.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-list-recharge-closed-days-query-dto-ts), [recharge-day-action-reason.request.dto.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-day-action-reason-request-dto-ts), [recharge-closed-day-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-closed-day-output-ts), [recharge-day-detail-output.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-dtos-recharge-day-detail-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `RechargeDaysController` (L32–80)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('recharge-days')`
- **Propósito:** "Sistema → Gestión de Días de Recargas" — the Recargas-specific counterpart to Banks' "Gestión de Días Cerrados" (`ClosedDaysController`), fully independent from it: separate table, separate stored functions, separate route. `@Roles` at the class level, same reasoning as `ClosedDaysController`: EVERY route, including the `GET`s, requires ADMIN/SUPER_ADMIN — this is the real protection; the frontend's sidebar/adminGuard are UX only.
- **Dependencias inyectadas (constructor):** `listClosedRechargeDaysUseCase: ListClosedRechargeDaysUseCase`, `getRechargeDayDetailUseCase: GetRechargeDayDetailUseCase`, `reopenRechargeDayUseCase: ReopenRechargeDayUseCase`, `cancelRechargeDayUseCase: CancelRechargeDayUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 43–48 | `query: ListRechargeClosedDaysQueryDto` | `Promise<RechargeClosedDayOutput[]>` |
| `findOne` | método public | 50–53 | `date: string` | `Promise<RechargeDayDetailOutput>` |
| `reopen` | método public | 55–66 | `date: string`, `dto: RechargeDayActionReasonRequestDto`, `userId: string` | `Promise<RechargeDayDetailOutput>` |
| `cancel` | método public | 68–79 | `date: string`, `dto: RechargeDayActionReasonRequestDto`, `userId: string` | `Promise<RechargeDayDetailOutput>` |

##### `RechargeDaysController.findAll`

- **Firma:** `findAll(query: ListRechargeClosedDaysQueryDto): Promise<RechargeClosedDayOutput[]>` — [recharge-days.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-days.controller.ts#L43) (L43–48)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listClosedRechargeDaysUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDaysController.findOne`

- **Firma:** `findOne(date: string): Promise<RechargeDayDetailOutput>` — [recharge-days.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-days.controller.ts#L50) (L50–53)
- **Decoradores:** `@Get(':date')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('date') date`
- **Dependencias (llamadas en su cuerpo):** `this.getRechargeDayDetailUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDaysController.reopen`

- **Firma:** `reopen(date: string, dto: RechargeDayActionReasonRequestDto, userId: string): Promise<RechargeDayDetailOutput>` — [recharge-days.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-days.controller.ts#L55) (L55–66)
- **Decoradores:** `@Post(':date/reopen')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('date') date`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.reopenRechargeDayUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeDaysController.cancel`

- **Firma:** `cancel(date: string, dto: RechargeDayActionReasonRequestDto, userId: string): Promise<RechargeDayDetailOutput>` — [recharge-days.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-days.controller.ts#L68) (L68–79)
- **Decoradores:** `@Post(':date/cancel')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('date') date`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.cancelRechargeDayUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts"></a>

### recharge-sims.controller.ts

- **Ruta:** [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts`, 254 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** SIM Claro/SIM Tigo — physical, stock-tracked products administered EXCLUSIVELY from Recargas Electrónicas (see the migration's own doc comment for why they're not part of `modules/products/`).
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [list-recharge-sim-types.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-types-use-case-ts), [get-recharge-sim-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-daily-summary-use-case-ts), [register-recharge-sim-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-purchase-use-case-ts), [register-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-use-case-ts), [register-recharge-sim-sale-with-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sim-sale-with-registration-use-case-ts), [void-recharge-sim-sale-registration.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-registration-use-case-ts), [get-recharge-sim-sale-registration-by-id.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-by-id-use-case-ts), [list-recharge-sim-sale-registrations.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sale-registrations-use-case-ts), [get-recharge-sim-sale-registration-dpi-image.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sim-sale-registration-dpi-image-use-case-ts), [list-recharge-sim-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-sim-sales-use-case-ts), [void-recharge-sim-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-void-recharge-sim-sale-use-case-ts) y 13 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/platform-express`, `express`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

**Interfaces, tipos y enums:**

- `interface UploadedImageFile` (L51): The minimal shape actually read off an uploaded file — same "avoid a `@types/multer` dependency for one field" reasoning as `ProductsController`'s own `UploadedExcelFile`. — miembros: `buffer`, `mimetype`, `size`

#### Clase `RechargeSimsController` (L71–253)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('recharges/sims')`
- **Propósito:** SIM Claro/SIM Tigo — physical, stock-tracked products administered EXCLUSIVELY from Recargas Electrónicas (see the migration's own doc comment for why they're not part of `modules/products/`). A new, separate controller (not added to `RechargesController`) so the existing controller/routes are untouched by this ticket. No `@Roles(...)` — same "any authenticated active account" operational policy as the rest of Recargas (registering a purchase/sale is a daily register task, not admin-only), matching `RechargesController` and Heladería's own purchase/sale controllers.
- **Dependencias inyectadas (constructor):** `listRechargeSimTypesUseCase: ListRechargeSimTypesUseCase`, `getRechargeSimDailySummaryUseCase: GetRechargeSimDailySummaryUseCase`, `registerRechargeSimPurchaseUseCase: RegisterRechargeSimPurchaseUseCase`, `registerRechargeSimSaleUseCase: RegisterRechargeSimSaleUseCase`, `registerRechargeSimSaleWithRegistrationUseCase: RegisterRechargeSimSaleWithRegistrationUseCase`, `voidRechargeSimSaleRegistrationUseCase: VoidRechargeSimSaleRegistrationUseCase`, `getRechargeSimSaleRegistrationByIdUseCase: GetRechargeSimSaleRegistrationByIdUseCase`, `listRechargeSimSaleRegistrationsUseCase: ListRechargeSimSaleRegistrationsUseCase`, `getRechargeSimSaleRegistrationDpiImageUseCase: GetRechargeSimSaleRegistrationDpiImageUseCase`, `listRechargeSimSalesUseCase: ListRechargeSimSalesUseCase`, `voidRechargeSimSaleUseCase: VoidRechargeSimSaleUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findTypes` | método public | 88–91 | — | `Promise<RechargeSimTypeOutput[]>` |
| `findDaily` | método public | 93–102 | `query: RechargeSimDailyQueryDto`, `userId: string` | `Promise<RechargeSimDailyStockOutput[]>` |
| `registerPurchase` | método public | 104–115 | `dto: RegisterRechargeSimPurchaseRequestDto`, `userId: string` | `Promise<RechargeSimDailyStockOutput>` |
| `registerSale` | método public | 117–128 | `dto: RegisterRechargeSimSaleRequestDto`, `userId: string` | `Promise<RechargeSimDailyStockOutput>` |
| `findSales` | método public | 131–136 | `query: RechargeSimSalesQueryDto` | `Promise<RechargeSimSaleOutput[]>` |
| `voidSale` | método public | 147–161 | `id: string`, `dto: VoidRechargeSimSaleRequestDto`, `userId: string` | `Promise<RechargeSimSaleOutput>` |
| `registerSaleRegistration` | método public | 174–195 | `dto: RegisterRechargeSimSaleRegistrationRequestDto`, `dpiImage: UploadedImageFile \| undefined`, `userId: string` | `Promise<RechargeSimSaleRegistrationResponseDto>` |
| `findSaleRegistrations` | método public | 198–203 | `query: ListRechargeSimSaleRegistrationsQueryDto` | `Promise<PaginatedRechargeSimSaleRegistrationsResponseDto>` |
| `findSaleRegistrationById` | método public | 205–210 | `id: string` | `Promise<RechargeSimSaleRegistrationResponseDto>` |
| `getSaleRegistrationDpiImage` | método public async | 219–231 | `id: string`, `res: Response` | `Promise<void>` |
| `voidSaleRegistration` | método public | 238–252 | `id: string`, `dto: VoidRechargeSimSaleRegistrationRequestDto`, `userId: string` | `Promise<RechargeSimSaleRegistrationResponseDto>` |

##### `RechargeSimsController.findTypes`

- **Firma:** `findTypes(): Promise<RechargeSimTypeOutput[]>` — [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L88) (L88–91)
- **Decoradores:** `@Get('types')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.listRechargeSimTypesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimsController.findDaily`

- **Firma:** `findDaily(query: RechargeSimDailyQueryDto, userId: string): Promise<RechargeSimDailyStockOutput[]>` — [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L93) (L93–102)
- **Decoradores:** `@Get('daily')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.getRechargeSimDailySummaryUseCase.execute`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimsController.registerPurchase`

- **Firma:** `registerPurchase(dto: RegisterRechargeSimPurchaseRequestDto, userId: string): Promise<RechargeSimDailyStockOutput>` — [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L104) (L104–115)
- **Decoradores:** `@Post('purchases')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerRechargeSimPurchaseUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimsController.registerSale`

- **Firma:** `registerSale(dto: RegisterRechargeSimSaleRequestDto, userId: string): Promise<RechargeSimDailyStockOutput>` — [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L117) (L117–128)
- **Decoradores:** `@Post('sales')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerRechargeSimSaleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimsController.findSales`

- **Firma:** `findSales(query: RechargeSimSalesQueryDto): Promise<RechargeSimSaleOutput[]>` — [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L131) (L131–136)
- **Decoradores:** `@Get('sales')`
- **Propósito / descripción:** "Administrar Ventas de SIM (por cantidad)" listing — the by-quantity "Vender SIM" flow's own admin screen, separate from `GET sale-registrations` above (see `TypeOrmRechargeSimSaleRepository`'s own doc comment for why the two never overlap).
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listRechargeSimSalesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimsController.voidSale`

- **Firma:** `voidSale(id: string, dto: VoidRechargeSimSaleRequestDto, userId: string): Promise<RechargeSimSaleOutput>` — [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L147) (L147–161)
- **Decoradores:** `@Post('sales/:id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** "Revertir" for the by-quantity "Vender SIM" flow — admin-only, same elevated policy as `POST /purchases/:id/void` and `POST sale-registrations/:id/void`. Never a physical delete/edit: the original row stays exactly as sold, marked anulada by `void_recharge_sim_sale`, which also atomically restores the SIM stock it decremented and enforces every other guard (day-closed, already-voided, has-active-registration, missing reason).
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidRechargeSimSaleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimsController.registerSaleRegistration`

- **Firma:** `registerSaleRegistration(dto: RegisterRechargeSimSaleRegistrationRequestDto, dpiImage: UploadedImageFile \| undefined, userId: string): Promise<RechargeSimSaleRegistrationResponseDto>` — [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L174) (L174–195)
- **Decoradores:** `@Post('sale-registrations')` `@UseInterceptors(FileInterceptor('dpiImage'))` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** "Venta de SIM con registro de identidad" — deliberately separate from `POST sales` above (the pre-existing, still fully-supported by-quantity flow, no DPI capture): this one always registers exactly one physical SIM plus its identity record, in one transaction (see `RegisterRechargeSimSaleWithRegistrationUseCase`'s own doc comment). `multipart/form-data` — `dpiImage` is optional (a sale can be registered without a photo, matching the ticket's own "cuando corresponda" wording for client/identity fields), validated server-side regardless of what the frontend's own `accept="image/*"` hint already filtered.
- **Origen de parámetros:** `@Body() dto`, `@UploadedFile() dpiImage`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerRechargeSimSaleWithRegistrationUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimsController.findSaleRegistrations`

- **Firma:** `findSaleRegistrations(query: ListRechargeSimSaleRegistrationsQueryDto): Promise<PaginatedRechargeSimSaleRegistrationsResponseDto>` — [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L198) (L198–203)
- **Decoradores:** `@Get('sale-registrations')`
- **Propósito / descripción:** "Administrar Ventas de SIM" listing — same pagination/filter shape as `GET /purchases`.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listRechargeSimSaleRegistrationsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimsController.findSaleRegistrationById`

- **Firma:** `findSaleRegistrationById(id: string): Promise<RechargeSimSaleRegistrationResponseDto>` — [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L205) (L205–210)
- **Decoradores:** `@Get('sale-registrations/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getRechargeSimSaleRegistrationByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimsController.getSaleRegistrationDpiImage`

- **Firma:** `getSaleRegistrationDpiImage(id: string, res: Response): Promise<void>` — [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L219) (L219–231)
- **Decoradores:** `@Get('sale-registrations/:id/dpi-image')`
- **Propósito / descripción:** The ONE place the DPI photo's bytes are ever served — still behind the controller's own `JwtAuthGuard`, never a public/static path. `@Res()` direct response, same `ResponseInterceptor`-bypass pattern every PDF export in this codebase already uses, since the body here is raw image bytes, not a `{ success, data }` JSON envelope.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.getRechargeSimSaleRegistrationDpiImageUseCase.execute`, `res.set`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeSimsController.voidSaleRegistration`

- **Firma:** `voidSaleRegistration(id: string, dto: VoidRechargeSimSaleRegistrationRequestDto, userId: string): Promise<RechargeSimSaleRegistrationResponseDto>` — [recharge-sims.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts#L238) (L238–252)
- **Decoradores:** `@Post('sale-registrations/:id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** "Anular" — admin-only, same elevated policy as `POST /purchases/:id/void`. Never an edit, never a physical delete — restores the parent sale's stock atomically inside `void_recharge_sim_sale_registration`.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidRechargeSimSaleRegistrationUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts"></a>

### recharges.controller.ts

- **Ruta:** [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts`, 354 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** No `@Roles(...)` at the class level — same "operational, any authenticated account" policy as Sales/Purchases: registering a purchase or closing a day's balance for the first time is a daily register task, not an admin-only one.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [list-recharge-types.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-list-recharge-types-use-case-ts), [get-recharge-daily-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-daily-summary-use-case-ts), [register-recharge-purchase.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-purchase-use-case-ts), [register-recharge-final-balance.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-final-balance-use-case-ts), [get-recharge-history.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-history-use-case-ts), [get-recharge-sales-summary.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-summary-use-case-ts), [register-recharge-sales-closure.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-register-recharge-sales-closure-use-case-ts), [get-recharge-sales.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-sales-use-case-ts), [create-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-create-recharge-sale-use-case-ts), [update-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-update-recharge-sale-use-case-ts), [delete-recharge-sale.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-delete-recharge-sale-use-case-ts) y 38 más
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts)

#### Clase `RechargesController` (L85–353)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('recharges')`
- **Propósito:** No `@Roles(...)` at the class level — same "operational, any authenticated account" policy as Sales/Purchases: registering a purchase or closing a day's balance for the first time is a daily register task, not an admin-only one. The one elevated rule (re-editing an already-closed day requires an admin) lives inside `RegisterRechargeFinalBalanceUseCase`, computed here from the caller's role and passed in as `isAdmin` — not a route guard, since it depends on the target row's own state.
- **Dependencias inyectadas (constructor):** `listRechargeTypesUseCase: ListRechargeTypesUseCase`, `getRechargeDailySummaryUseCase: GetRechargeDailySummaryUseCase`, `registerRechargePurchaseUseCase: RegisterRechargePurchaseUseCase`, `registerRechargeFinalBalanceUseCase: RegisterRechargeFinalBalanceUseCase`, `getRechargeHistoryUseCase: GetRechargeHistoryUseCase`, `getRechargeSalesSummaryUseCase: GetRechargeSalesSummaryUseCase`, `registerRechargeSalesClosureUseCase: RegisterRechargeSalesClosureUseCase`, `getRechargeSalesUseCase: GetRechargeSalesUseCase`, `createRechargeSaleUseCase: CreateRechargeSaleUseCase`, `updateRechargeSaleUseCase: UpdateRechargeSaleUseCase`, `deleteRechargeSaleUseCase: DeleteRechargeSaleUseCase`, `getRechargeDayStatusUseCase: GetRechargeDayStatusUseCase`, `openRechargeDayUseCase: OpenRechargeDayUseCase`, `closeRechargeDayUseCase: CloseRechargeDayUseCase`, `updateRechargeTypeMinBalanceUseCase: UpdateRechargeTypeMinBalanceUseCase`, `getRechargePurchasesUseCase: GetRechargePurchasesUseCase`, `voidRechargePurchaseUseCase: VoidRechargePurchaseUseCase`, `getRechargesDailyStatsUseCase: GetRechargesDailyStatsUseCase`, `getRechargesWeeklyStatsUseCase: GetRechargesWeeklyStatsUseCase`, `getRechargesYearlyStatsUseCase: GetRechargesYearlyStatsUseCase`, `updateRechargeTypeBalanceLimitUseCase: UpdateRechargeTypeBalanceLimitUseCase`, `getRechargeOperatorsSummaryUseCase: GetRechargeOperatorsSummaryUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getDayStatus` | método public | 119–126 | `query: RechargeDayStatusQueryDto` | `Promise<RechargeDayStatusOutput>` |
| `openDay` | método public | 132–142 | `dto: OpenRechargeDayRequestDto`, `userId: string` | `Promise<RechargeDayStatusOutput>` |
| `closeDay` | método public | 150–160 | `dto: CloseRechargeDayRequestDto`, `userId: string` | `Promise<RechargeDayStatusOutput>` |
| `findTypes` | método public | 162–165 | — | `Promise<RechargeTypeOutput[]>` |
| `updateMinBalance` | método public | 168–179 | `id: string`, `dto: UpdateRechargeTypeMinBalanceRequestDto` | `Promise<RechargeTypeOutput>` |
| `findDaily` | método public | 181–187 | `query: RechargeDailyQueryDto`, `userId: string` | `Promise<RechargeDailyBalanceOutput[]>` |
| `registerPurchase` | método public | 189–201 | `dto: RegisterRechargePurchaseRequestDto`, `userId: string` | `Promise<RechargeDailyBalanceOutput>` |
| `findPurchases` | método public | 203–208 | `query: RechargePurchasesQueryDto` | `Promise<RechargePurchaseOutput[]>` |
| `voidPurchase` | método public | 218–232 | `id: string`, `dto: VoidRechargePurchaseRequestDto`, `userId: string` | `Promise<RechargePurchaseOutput>` |
| `registerFinalBalance` | método public | 234–246 | `id: string`, `dto: RegisterRechargeFinalBalanceRequestDto`, `user: RequestUser` | `Promise<RechargeDailyBalanceOutput>` |
| `findHistory` | método public | 248–253 | `query: RechargeHistoryQueryDto` | `Promise<GetRechargeHistoryOutput>` |
| `findSalesSummary` | método public | 255–260 | `query: RechargeSalesSummaryQueryDto` | `Promise<RechargeSalesSummaryOutput>` |
| `dailyStats` | método public | 263–266 | — | `Promise<RechargesDailyStatsResponseDto>` |
| `weeklyStats` | método public | 269–272 | — | `Promise<RechargesWeeklyStatsResponseDto>` |
| `yearlyStats` | método public | 275–278 | — | `Promise<RechargesYearlyStatsResponseDto>` |
| `operatorsSummary` | método public | 281–284 | — | `Promise<RechargeOperatorsSummaryResponseDto>` |
| `updateBalanceLimit` | método public | 287–298 | `id: string`, `dto: UpdateRechargeTypeBalanceLimitRequestDto` | `Promise<RechargeTypeOutput>` |
| `registerSalesClosure` | método public | 300–311 | `dto: RegisterRechargeSalesClosureRequestDto`, `user: RequestUser` | `Promise<RechargeSalesSummaryOutput>` |
| `findSales` | método public | 313–318 | `query: RechargeSalesQueryDto` | `Promise<RechargeSaleOutput[]>` |
| `createSale` | método public | 320–332 | `dto: CreateRechargeSaleRequestDto`, `userId: string` | `Promise<RechargeSaleOutput>` |
| `updateSale` | método public | 334–346 | `id: string`, `dto: UpdateRechargeSaleRequestDto`, `userId: string` | `Promise<RechargeSaleOutput>` |
| `deleteSale` | método public | 348–352 | `id: string` | `Promise<void>` |

##### `RechargesController.getDayStatus`

- **Firma:** `getDayStatus(query: RechargeDayStatusQueryDto): Promise<RechargeDayStatusOutput>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L119) (L119–126)
- **Decoradores:** `@Get('day-status')`
- **Propósito / descripción:** "Apertura del Día" status for Recargas — fully independent from the Banks/Agentes Bancarios module's own `GET /banks/day-status` (separate table, separate lifecycle). Any authenticated user, same operational policy as the rest of this controller.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getRechargeDayStatusUseCase.execute`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.openDay`

- **Firma:** `openDay(dto: OpenRechargeDayRequestDto, userId: string): Promise<RechargeDayStatusOutput>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L132) (L132–142)
- **Decoradores:** `@Post('day-status/open')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** "Confirmar Apertura" — idempotent, so a double click or a retry never creates a second opening or fails.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.openRechargeDayUseCase.execute`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.closeDay`

- **Firma:** `closeDay(dto: CloseRechargeDayRequestDto, userId: string): Promise<RechargeDayStatusOutput>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L150) (L150–160)
- **Decoradores:** `@Post('day-status/close')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** "Cerrar Día" — the standalone action confirmed with the user: it does NOT save a cuadre (that stays "Guardar Cuadre", unchanged and unlimited-per-day); it only requires at least one cuadre already saved for the date before it will succeed.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.closeRechargeDayUseCase.execute`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.findTypes`

- **Firma:** `findTypes(): Promise<RechargeTypeOutput[]>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L162) (L162–165)
- **Decoradores:** `@Get('types')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.listRechargeTypesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.updateMinBalance`

- **Firma:** `updateMinBalance(id: string, dto: UpdateRechargeTypeMinBalanceRequestDto): Promise<RechargeTypeOutput>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L168) (L168–179)
- **Decoradores:** `@Patch('types/:id/min-balance')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** "Saldo mínimo" — the threshold the Alerts module reads for "saldo bajo de recargas". Admin-only, the one route on this controller that IS `@Roles`-gated.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.updateRechargeTypeMinBalanceUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.findDaily`

- **Firma:** `findDaily(query: RechargeDailyQueryDto, userId: string): Promise<RechargeDailyBalanceOutput[]>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L181) (L181–187)
- **Decoradores:** `@Get('daily')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.getRechargeDailySummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.registerPurchase`

- **Firma:** `registerPurchase(dto: RegisterRechargePurchaseRequestDto, userId: string): Promise<RechargeDailyBalanceOutput>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L189) (L189–201)
- **Decoradores:** `@Post('purchases')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerRechargePurchaseUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.findPurchases`

- **Firma:** `findPurchases(query: RechargePurchasesQueryDto): Promise<RechargePurchaseOutput[]>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L203) (L203–208)
- **Decoradores:** `@Get('purchases')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getRechargePurchasesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.voidPurchase`

- **Firma:** `voidPurchase(id: string, dto: VoidRechargePurchaseRequestDto, userId: string): Promise<RechargePurchaseOutput>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L218) (L218–232)
- **Decoradores:** `@Post('purchases/:id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** "Revertir compra" — admin-only, same elevated-permission policy as re-editing an already-closed day's saldo final. Never a physical delete/edit: the original row stays exactly as registered, marked `ANULADA` by `void_recharge_purchase`, which also atomically decrements the daily balance by the reverted `creditedAmount` and enforces every other guard (day-closed, cycle-closed, already-voided, missing reason).
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidRechargePurchaseUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.registerFinalBalance`

- **Firma:** `registerFinalBalance(id: string, dto: RegisterRechargeFinalBalanceRequestDto, user: RequestUser): Promise<RechargeDailyBalanceOutput>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L234) (L234–246)
- **Decoradores:** `@Patch('daily/:id/final-balance')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.registerRechargeFinalBalanceUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.findHistory`

- **Firma:** `findHistory(query: RechargeHistoryQueryDto): Promise<GetRechargeHistoryOutput>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L248) (L248–253)
- **Decoradores:** `@Get('history')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getRechargeHistoryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.findSalesSummary`

- **Firma:** `findSalesSummary(query: RechargeSalesSummaryQueryDto): Promise<RechargeSalesSummaryOutput>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L255) (L255–260)
- **Decoradores:** `@Get('sales-summary')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getRechargeSalesSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.dailyStats`

- **Firma:** `dailyStats(): Promise<RechargesDailyStatsResponseDto>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L263) (L263–266)
- **Decoradores:** `@Get('daily-stats')`
- **Propósito / descripción:** Backs "Recargas del mes" en Gráficas → Indicadores de Recargas. Sin `:id` en este controlador, no hay conflicto de orden de rutas que cuidar.
- **Dependencias (llamadas en su cuerpo):** `this.getRechargesDailyStatsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.weeklyStats`

- **Firma:** `weeklyStats(): Promise<RechargesWeeklyStatsResponseDto>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L269) (L269–272)
- **Decoradores:** `@Get('weekly-stats')`
- **Propósito / descripción:** Backs "Recargas por semana" en Gráficas → Indicadores de Recargas.
- **Dependencias (llamadas en su cuerpo):** `this.getRechargesWeeklyStatsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.yearlyStats`

- **Firma:** `yearlyStats(): Promise<RechargesYearlyStatsResponseDto>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L275) (L275–278)
- **Decoradores:** `@Get('yearly-stats')`
- **Propósito / descripción:** Backs "Recargas por mes" (anual) en Gráficas → Indicadores de Recargas.
- **Dependencias (llamadas en su cuerpo):** `this.getRechargesYearlyStatsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.operatorsSummary`

- **Firma:** `operatorsSummary(): Promise<RechargeOperatorsSummaryResponseDto>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L281) (L281–284)
- **Decoradores:** `@Get('operators-summary')`
- **Propósito / descripción:** Backs las 4 gráficas de anillo de "Indicadores de Recargas Electrónicas" en Resumen — ventas/compras del mes y saldo actual/límite, separados por operadora.
- **Dependencias (llamadas en su cuerpo):** `this.getRechargeOperatorsSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.updateBalanceLimit`

- **Firma:** `updateBalanceLimit(id: string, dto: UpdateRechargeTypeBalanceLimitRequestDto): Promise<RechargeTypeOutput>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L287) (L287–298)
- **Decoradores:** `@Patch('types/:id/balance-limit')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** "Límite de saldo" — el techo de referencia (100%) de la gráfica de anillo de saldo en Resumen. Admin-only, distinto de `min-balance` (el umbral de alerta).
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.updateRechargeTypeBalanceLimitUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.registerSalesClosure`

- **Firma:** `registerSalesClosure(dto: RegisterRechargeSalesClosureRequestDto, user: RequestUser): Promise<RechargeSalesSummaryOutput>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L300) (L300–311)
- **Decoradores:** `@Post('sales-closure')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.registerRechargeSalesClosureUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.findSales`

- **Firma:** `findSales(query: RechargeSalesQueryDto): Promise<RechargeSaleOutput[]>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L313) (L313–318)
- **Decoradores:** `@Get('sales')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getRechargeSalesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.createSale`

- **Firma:** `createSale(dto: CreateRechargeSaleRequestDto, userId: string): Promise<RechargeSaleOutput>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L320) (L320–332)
- **Decoradores:** `@Post('sales')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createRechargeSaleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.updateSale`

- **Firma:** `updateSale(id: string, dto: UpdateRechargeSaleRequestDto, userId: string): Promise<RechargeSaleOutput>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L334) (L334–346)
- **Decoradores:** `@Patch('sales/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateRechargeSaleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesController.deleteSale`

- **Firma:** `deleteSale(id: string): Promise<void>` — [recharges.controller.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts#L348) (L348–352)
- **Decoradores:** `@Delete('sales/:id')` `@HttpCode(204)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deleteRechargeSaleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-close-recharge-day-request-dto-ts"></a>

### close-recharge-day.request.dto.ts

- **Ruta:** [close-recharge-day.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/close-recharge-day.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/close-recharge-day.request.dto.ts`, 9 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Omitted = today, resolved in the controller.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `CloseRechargeDayRequestDto` (L4–8)

- **Propósito:** Omitted = today, resolved in the controller.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-create-recharge-sale-request-dto-ts"></a>

### create-recharge-sale.request.dto.ts

- **Ruta:** [create-recharge-sale.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/create-recharge-sale.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/create-recharge-sale.request.dto.ts`, 23 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de entrada: declara `CreateRechargeSaleRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `CreateRechargeSaleRequestDto` (L3–22)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-list-recharge-closed-days-query-dto-ts"></a>

### list-recharge-closed-days.query.dto.ts

- **Ruta:** [list-recharge-closed-days.query.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/list-recharge-closed-days.query.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/list-recharge-closed-days.query.dto.ts`, 31 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de consulta: declara `ListRechargeClosedDaysQueryDto`, `STATUSES`, `RESULT_SIGNS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-day-opening-repository-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharge-days.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts)

#### Clase `ListRechargeClosedDaysQueryDto` (L10–30)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-list-recharge-sim-sale-registrations-query-dto-ts"></a>

### list-recharge-sim-sale-registrations.query.dto.ts

- **Ruta:** [list-recharge-sim-sale-registrations.query.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/list-recharge-sim-sale-registrations.query.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/list-recharge-sim-sale-registrations.query.dto.ts`, 43 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de consulta: declara `ListRechargeSimSaleRegistrationsQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

#### Clase `ListRechargeSimSaleRegistrationsQueryDto` (L12–42)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-open-recharge-day-request-dto-ts"></a>

### open-recharge-day.request.dto.ts

- **Ruta:** [open-recharge-day.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/open-recharge-day.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/open-recharge-day.request.dto.ts`, 9 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Omitted = today, resolved in the controller.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `OpenRechargeDayRequestDto` (L4–8)

- **Propósito:** Omitted = today, resolved in the controller.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-daily-query-dto-ts"></a>

### recharge-daily.query.dto.ts

- **Ruta:** [recharge-daily.query.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-daily.query.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-daily.query.dto.ts`, 9 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de consulta: declara `RechargeDailyQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `RechargeDailyQueryDto` (L3–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-day-action-reason-request-dto-ts"></a>

### recharge-day-action-reason.request.dto.ts

- **Ruta:** [recharge-day-action-reason.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-day-action-reason.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-day-action-reason.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Shared by "Reabrir Día" and "Anular Día" — both require a mandatory, non-empty reason.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharge-days.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-days-controller-ts)

#### Clase `RechargeDayActionReasonRequestDto` (L4–10)

- **Propósito:** Shared by "Reabrir Día" and "Anular Día" — both require a mandatory, non-empty reason.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-day-status-query-dto-ts"></a>

### recharge-day-status.query.dto.ts

- **Ruta:** [recharge-day-status.query.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-day-status.query.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-day-status.query.dto.ts`, 8 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de consulta: declara `RechargeDayStatusQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `RechargeDayStatusQueryDto` (L3–7)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-history-query-dto-ts"></a>

### recharge-history.query.dto.ts

- **Ruta:** [recharge-history.query.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-history.query.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-history.query.dto.ts`, 41 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de consulta: declara `RechargeHistoryQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `RechargeHistoryQueryDto` (L11–40)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-operators-summary-response-dto-ts"></a>

### recharge-operators-summary.response.dto.ts

- **Ruta:** [recharge-operators-summary.response.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-operators-summary.response.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-operators-summary.response.dto.ts`, 14 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de respuesta: declara `RechargeOperatorStatDto`, `RechargeOperatorsSummaryResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `RechargeOperatorStatDto` (L1–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RechargeOperatorsSummaryResponseDto` (L10–13)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-purchases-query-dto-ts"></a>

### recharge-purchases.query.dto.ts

- **Ruta:** [recharge-purchases.query.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-purchases.query.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-purchases.query.dto.ts`, 9 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de consulta: declara `RechargePurchasesQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `RechargePurchasesQueryDto` (L3–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-sales-summary-query-dto-ts"></a>

### recharge-sales-summary.query.dto.ts

- **Ruta:** [recharge-sales-summary.query.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-sales-summary.query.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-sales-summary.query.dto.ts`, 9 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de consulta: declara `RechargeSalesSummaryQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `RechargeSalesSummaryQueryDto` (L3–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-sales-query-dto-ts"></a>

### recharge-sales.query.dto.ts

- **Ruta:** [recharge-sales.query.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-sales.query.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-sales.query.dto.ts`, 9 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de consulta: declara `RechargeSalesQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `RechargeSalesQueryDto` (L3–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-sim-daily-query-dto-ts"></a>

### recharge-sim-daily.query.dto.ts

- **Ruta:** [recharge-sim-daily.query.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-sim-daily.query.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-sim-daily.query.dto.ts`, 9 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de consulta: declara `RechargeSimDailyQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

#### Clase `RechargeSimDailyQueryDto` (L3–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-sim-sale-registration-response-dto-ts"></a>

### recharge-sim-sale-registration.response.dto.ts

- **Ruta:** [recharge-sim-sale-registration.response.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-sim-sale-registration.response.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-sim-sale-registration.response.dto.ts`, 30 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de respuesta: declara `RechargeSimSaleRegistrationResponseDto`, `PaginatedRechargeSimSaleRegistrationsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

#### Clase `RechargeSimSaleRegistrationResponseDto` (L1–22)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedRechargeSimSaleRegistrationsResponseDto` (L24–29)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharge-sim-sales-query-dto-ts"></a>

### recharge-sim-sales.query.dto.ts

- **Ruta:** [recharge-sim-sales.query.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-sim-sales.query.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharge-sim-sales.query.dto.ts`, 9 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de consulta: declara `RechargeSimSalesQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

#### Clase `RechargeSimSalesQueryDto` (L3–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharges-daily-stats-response-dto-ts"></a>

### recharges-daily-stats.response.dto.ts

- **Ruta:** [recharges-daily-stats.response.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharges-daily-stats.response.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharges-daily-stats.response.dto.ts`, 10 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de respuesta: declara `RechargesDailyStatDto`, `RechargesDailyStatsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `RechargesDailyStatDto` (L1–4)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RechargesDailyStatsResponseDto` (L6–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharges-weekly-stats-response-dto-ts"></a>

### recharges-weekly-stats.response.dto.ts

- **Ruta:** [recharges-weekly-stats.response.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharges-weekly-stats.response.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharges-weekly-stats.response.dto.ts`, 13 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de respuesta: declara `RechargesWeeklyStatDto`, `RechargesWeeklyStatsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `RechargesWeeklyStatDto` (L1–7)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RechargesWeeklyStatsResponseDto` (L9–12)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-recharges-yearly-stats-response-dto-ts"></a>

### recharges-yearly-stats.response.dto.ts

- **Ruta:** [recharges-yearly-stats.response.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharges-yearly-stats.response.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/recharges-yearly-stats.response.dto.ts`, 11 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de respuesta: declara `RechargesMonthlyStatDto`, `RechargesYearlyStatsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `RechargesMonthlyStatDto` (L1–5)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RechargesYearlyStatsResponseDto` (L7–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-register-recharge-final-balance-request-dto-ts"></a>

### register-recharge-final-balance.request.dto.ts

- **Ruta:** [register-recharge-final-balance.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/register-recharge-final-balance.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/register-recharge-final-balance.request.dto.ts`, 8 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de entrada: declara `RegisterRechargeFinalBalanceRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `RegisterRechargeFinalBalanceRequestDto` (L3–7)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-register-recharge-purchase-request-dto-ts"></a>

### register-recharge-purchase.request.dto.ts

- **Ruta:** [register-recharge-purchase.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/register-recharge-purchase.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/register-recharge-purchase.request.dto.ts`, 21 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de entrada: declara `RegisterRechargePurchaseRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `RegisterRechargePurchaseRequestDto` (L3–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-register-recharge-sales-closure-request-dto-ts"></a>

### register-recharge-sales-closure.request.dto.ts

- **Ruta:** [register-recharge-sales-closure.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/register-recharge-sales-closure.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/register-recharge-sales-closure.request.dto.ts`, 12 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de entrada: declara `RegisterRechargeSalesClosureRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `RegisterRechargeSalesClosureRequestDto` (L3–11)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-register-recharge-sim-purchase-request-dto-ts"></a>

### register-recharge-sim-purchase.request.dto.ts

- **Ruta:** [register-recharge-sim-purchase.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/register-recharge-sim-purchase.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/register-recharge-sim-purchase.request.dto.ts`, 16 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de entrada: declara `RegisterRechargeSimPurchaseRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

#### Clase `RegisterRechargeSimPurchaseRequestDto` (L3–15)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-register-recharge-sim-sale-registration-request-dto-ts"></a>

### register-recharge-sim-sale-registration.request.dto.ts

- **Ruta:** [register-recharge-sim-sale-registration.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/register-recharge-sim-sale-registration.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/register-recharge-sim-sale-registration.request.dto.ts`, 48 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** `multipart/form-data` body (the DPI photo travels alongside as the `dpiImage` file field, read via `@UploadedFile()` — see `RechargeSimsController.registerSaleRegistration`) — every text field arrives as a string regardless of its logical type, hence `@Type(() =&gt; Number)` on `salePrice`, same pattern `ListPurchasesQueryDto` already uses for its own multipart-adjacent numeric query params.
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

#### Clase `RegisterRechargeSimSaleRegistrationRequestDto` (L20–47)

- **Propósito:** `multipart/form-data` body (the DPI photo travels alongside as the `dpiImage` file field, read via `@UploadedFile()` — see `RechargeSimsController.registerSaleRegistration`) — every text field arrives as a string regardless of its logical type, hence `@Type(() =&gt; Number)` on `salePrice`, same pattern `ListPurchasesQueryDto` already uses for its own multipart-adjacent numeric query params.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-register-recharge-sim-sale-request-dto-ts"></a>

### register-recharge-sim-sale.request.dto.ts

- **Ruta:** [register-recharge-sim-sale.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/register-recharge-sim-sale.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/register-recharge-sim-sale.request.dto.ts`, 14 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de entrada: declara `RegisterRechargeSimSaleRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

#### Clase `RegisterRechargeSimSaleRequestDto` (L3–13)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-update-recharge-sale-request-dto-ts"></a>

### update-recharge-sale.request.dto.ts

- **Ruta:** [update-recharge-sale.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/update-recharge-sale.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/update-recharge-sale.request.dto.ts`, 14 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de entrada: declara `UpdateRechargeSaleRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `UpdateRechargeSaleRequestDto` (L3–13)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-update-recharge-type-balance-limit-request-dto-ts"></a>

### update-recharge-type-balance-limit.request.dto.ts

- **Ruta:** [update-recharge-type-balance-limit.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/update-recharge-type-balance-limit.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/update-recharge-type-balance-limit.request.dto.ts`, 8 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de entrada: declara `UpdateRechargeTypeBalanceLimitRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `UpdateRechargeTypeBalanceLimitRequestDto` (L3–7)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-update-recharge-type-min-balance-request-dto-ts"></a>

### update-recharge-type-min-balance.request.dto.ts

- **Ruta:** [update-recharge-type-min-balance.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/update-recharge-type-min-balance.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/update-recharge-type-min-balance.request.dto.ts`, 8 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** DTO de entrada: declara `UpdateRechargeTypeMinBalanceRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `UpdateRechargeTypeMinBalanceRequestDto` (L3–7)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-void-recharge-purchase-request-dto-ts"></a>

### void-recharge-purchase.request.dto.ts

- **Ruta:** [void-recharge-purchase.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/void-recharge-purchase.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/void-recharge-purchase.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Same mandatory-reason shape as `VoidCashBoxMovementRequestDto`/`VoidBankDepositOperationRequestDto` — kept as this module's own copy rather than a cross-module import.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharges.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharges-controller-ts)

#### Clase `VoidRechargePurchaseRequestDto` (L4–10)

- **Propósito:** Same mandatory-reason shape as `VoidCashBoxMovementRequestDto`/`VoidBankDepositOperationRequestDto` — kept as this module's own copy rather than a cross-module import.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-void-recharge-sim-sale-registration-request-dto-ts"></a>

### void-recharge-sim-sale-registration.request.dto.ts

- **Ruta:** [void-recharge-sim-sale-registration.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/void-recharge-sim-sale-registration.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/void-recharge-sim-sale-registration.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Same mandatory-reason shape as `VoidPurchaseRequestDto`/`VoidRechargePurchaseRequestDto` — kept as this module's own copy rather than a cross-module import.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

#### Clase `VoidRechargeSimSaleRegistrationRequestDto` (L4–10)

- **Propósito:** Same mandatory-reason shape as `VoidPurchaseRequestDto`/`VoidRechargePurchaseRequestDto` — kept as this module's own copy rather than a cross-module import.
<a id="f-comercial-jhoel-api-src-modules-recharges-presentation-dtos-void-recharge-sim-sale-request-dto-ts"></a>

### void-recharge-sim-sale.request.dto.ts

- **Ruta:** [void-recharge-sim-sale.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharges/presentation/dtos/void-recharge-sim-sale.request.dto.ts) (`comercial-jhoel-api/src/modules/recharges/presentation/dtos/void-recharge-sim-sale.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Same mandatory-reason shape as `VoidRechargePurchaseRequestDto`/`VoidRechargeSimSaleRegistrationRequestDto` — kept as this module's own copy rather than a cross-module import.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharge-sims.controller.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-presentation-controllers-recharge-sims-controller-ts)

#### Clase `VoidRechargeSimSaleRequestDto` (L4–10)

- **Propósito:** Same mandatory-reason shape as `VoidRechargePurchaseRequestDto`/`VoidRechargeSimSaleRegistrationRequestDto` — kept as this module's own copy rather than a cross-module import.
<a id="f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts"></a>

### recharges.module.ts

- **Ruta:** [recharges.module.ts](../../../../comercial-jhoel-api/src/modules/recharges/recharges.module.ts) (`comercial-jhoel-api/src/modules/recharges/recharges.module.ts`, 193 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `recharges`
- **Responsabilidad:** Módulo: declara `RechargesModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [shared.module.ts](shared.md#f-comercial-jhoel-api-src-shared-shared-module-ts), [recharge-type.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-type-orm-entity-ts), [recharge-daily-balance.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-daily-balance-orm-entity-ts), [recharge-sales-closure.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sales-closure-orm-entity-ts), [recharge-sale.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-orm-entity-ts), [recharge-day-opening.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-opening-orm-entity-ts), [recharge-day-audit-log.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-day-audit-log-orm-entity-ts), [recharge-sim-type.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-type-orm-entity-ts), [recharge-sim-daily-stock.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sim-daily-stock-orm-entity-ts), [recharge-purchase-full.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-purchase-full-orm-entity-ts), [typeorm-recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-type-repository-ts), [typeorm-recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-daily-balance-repository-ts), [typeorm-recharge-sales-closure.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sales-closure-repository-ts), [typeorm-recharge-sale.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-sale-repository-ts), [typeorm-recharge-day-opening.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-typeorm-recharge-day-opening-repository-ts) y 57 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [alerts.module.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `RechargesModule` (L76–192)

- **Decoradores:** `@Module({ imports: [ SharedModule, TypeOrmModule.forFeature([ RechargeTypeOrmEntity, RechargeDailyBalanceOrmEntity, RechargeSalesClosureOrmEntity, RechargeSaleOr`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
