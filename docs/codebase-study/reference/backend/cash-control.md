# Módulo backend `cash-control`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/cash-control/position` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L99) `CashControlController.position` | [GetCashPositionUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-get-cash-position-use-case-ts) | `CashControlRepository`.getBalance/hasInitialBalance/findDayByDate/getDateSummary/findOpenPeriod/getBankDaySummary/getWarehouseBalance/findPeriodsByDay/getRangeTotals → `warehouse_cash_balance`, `cash_balance_at` [cash_movements] | UseGuards(JwtAuthGuard) | `CashControlService.getPosition` |
| `GET /api/cash-control/balance` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L104) `CashControlController.balance` | [GetCashBalanceUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts) | `CashControlRepository`.getBalance [cash_movements] | UseGuards(JwtAuthGuard) | `CashControlService.getBalance` |
| `GET /api/cash-control/movements` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L109) `CashControlController.movements` | [ListCashMovementsUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts) | `CashControlRepository`.findMovements [cash_bank_day_ranges, cash_movements] | UseGuards(JwtAuthGuard) | `CashControlService.getMovements` |
| `GET /api/cash-control/bank-days` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L115) `CashControlController.bankDays` | [ListCashBankDaysUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts) | `CashControlRepository`.findBankDays | UseGuards(JwtAuthGuard) | `CashControlService.getBankDays` |
| `GET /api/cash-control/bank-days/:date` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L121) `CashControlController.bankDay` | [GetCashBankDayUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts) | `CashControlRepository`.getBankDaySummary | UseGuards(JwtAuthGuard) | `CashControlService.getBankDay` |
| `GET /api/cash-control/movements/recent` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L126) `CashControlController.recent` | [GetRecentCashMovementsUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts) | `CashControlRepository`.findRecentMovements | UseGuards(JwtAuthGuard) | `CashControlService.getRecentMovements` |
| `GET /api/cash-control/movements/:id` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L131) `CashControlController.movement` | [GetCashMovementUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts) | `CashControlRepository`.findMovementById [cash_movement_details] | UseGuards(JwtAuthGuard) | `CashControlService.getMovement` |
| `GET /api/cash-control/users` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L136) `CashControlController.users` | [ListCashUsersUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts) | `CashControlRepository`.findUsers [users, cash_movements, cash_cut_periods, cash_operational_days] | UseGuards(JwtAuthGuard) | `CashControlService.getUsers` |
| `GET /api/cash-control/bank-balances` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L141) `CashControlController.bankBalances` | [GetCashBankBalancesUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts) | `CashControlRepository`.getBankBalances → `cash_bank_balances_snapshot` | UseGuards(JwtAuthGuard) | `CashControlService.getBankBalances` |
| `POST /api/cash-control/movements` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L146) `CashControlController.registerMovement` | [RegisterCashMovementUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts) | `CashControlRepository`.registerManualMovement/findMovementById/getBalance → `register_manual_cash_movement` [cash_movements, cash_movement_details] | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO') | `CashControlService.registerMovement` |
| `POST /api/cash-control/bank-deposits` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L162) `CashControlController.registerBankDeposit` | [RegisterCashBankDepositUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts) | `CashControlRepository`.registerBankDeposit/findMovementById/getBalance → `register_cash_bank_deposit` [cash_movements, cash_movement_details] | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO') | `CashControlService.registerBankDeposit` |
| `POST /api/cash-control/movements/:id/void` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L177) `CashControlController.voidMovement` | [VoidCashMovementUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts) | `CashControlRepository`.voidManualMovement/findMovementById/getBalance → `void_manual_cash_movement` [cash_movements, cash_movement_details] | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') | `CashControlService.voidMovement` |
| `POST /api/cash-control/days/open` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L193) `CashControlController.openDay` | [OpenCashDayUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts) | `CashControlRepository`.openDay → `open_cash_operational_day`<br>`GetCashPositionUseCase`.execute | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO') | `CashControlService.openDay` |
| `POST /api/cash-control/days/:id/close` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L208) `CashControlController.closeDay` | [CloseCashDayUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts) | `CashControlRepository`.findDayById/closeDay → `close_cash_operational_day`<br>`GetCashPositionUseCase`.execute | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO') | `CashControlService.closeDay` |
| `GET /api/cash-control/days` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L226) `CashControlController.days` | [ListCashDaysUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-queries-use-cases-ts) | `CashControlRepository`.findDays [cash_cut_periods, cash_operational_days] | UseGuards(JwtAuthGuard) | `CashControlService.getDays` |
| `GET /api/cash-control/cuts/:id` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L231) `CashControlController.cut` | [GetCashCutDetailUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-queries-use-cases-ts) | `CashControlRepository`.findCutDetail [cash_cut_counts, users, cash_cut_count_details, cash_cut_bank_reconciliations, cash_cut_events, cash_cut_schedule_changes] | UseGuards(JwtAuthGuard) | `CashControlService.getCutDetail` |
| `PATCH /api/cash-control/cuts/:id/schedule` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L236) `CashControlController.updateSchedule` | [UpdateCashCutScheduleUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts) | `CashControlRepository`.findPeriodById/findPeriodsByDay/updateSchedule → `update_cash_cut_schedule`<br>`GetCashPositionUseCase`.execute | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO') | `CashControlService.updateSchedule` |
| `POST /api/cash-control/cuts/:id/start` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L252) `CashControlController.startCut` | [StartCashCutUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts) | `CashControlRepository`.findPeriodById/startPeriod → `start_cash_cut_period`<br>`GetCashPositionUseCase`.execute | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO') | `CashControlService.startCut` |
| `POST /api/cash-control/cuts/:id/finish` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L267) `CashControlController.finishCut` | [FinishCashCutUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts) | `CashControlRepository`.findPeriodById/finishPeriod → `finish_cash_cut_period`<br>`GetCashPositionUseCase`.execute | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO') | `CashControlService.finishCut` |
| `POST /api/cash-control/cuts/:id/reopen` | [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L284) `CashControlController.reopenCut` | [ReopenCashCutUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts) | `CashControlRepository`.findPeriodById/reopenPeriod → `reopen_cash_cut_period`<br>`GetCashPositionUseCase`.execute | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') | `CashControlService.reopenCut` |
| `GET /api/cash-control/warehouse/withdrawals` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L73) `CashCustodyController.withdrawals` | [ListWarehouseWithdrawalsUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.findWithdrawals [warehouse_cash_withdrawals] | UseGuards(JwtAuthGuard) | `CashCustodyService.getWithdrawals` |
| `GET /api/cash-control/warehouse/withdrawals/:id` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L81) `CashCustodyController.withdrawal` | [GetWarehouseWithdrawalUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.findWithdrawalById | UseGuards(JwtAuthGuard) | — |
| `POST /api/cash-control/warehouse/withdrawals` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L90) `CashCustodyController.createWithdrawal` | [RegisterWarehouseWithdrawalUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.registerWithdrawal/findWithdrawalById/getCustody → `cash_balance`, `cash_current_bank_day`, `register_warehouse_withdrawal` [warehouse_cash_movements, warehouse_cash_withdrawals] | UseGuards(JwtAuthGuard) | `CashCustodyService.registerWithdrawal` |
| `POST /api/cash-control/warehouse/withdrawals/:id/void` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L103) `CashCustodyController.voidWarehouseWithdrawal` | [VoidWarehouseWithdrawalUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.voidWithdrawal/findWithdrawalById/getCustody → `cash_balance`, `cash_current_bank_day`, `void_warehouse_withdrawal` [warehouse_cash_movements, warehouse_cash_withdrawals] | UseGuards(JwtAuthGuard) | `CashCustodyService.voidWithdrawal` |
| `GET /api/cash-control/custody` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L119) `CashCustodyController.custody` | [GetCashCustodyUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.getCustody → `cash_balance`, `cash_current_bank_day` [warehouse_cash_movements, warehouse_cash_withdrawals] | UseGuards(JwtAuthGuard) | `CashCustodyService.getCustody` |
| `GET /api/cash-control/counts` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L124) `CashCustodyController.counts` | [ListCashCountsUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.findCounts [cash_counts] | UseGuards(JwtAuthGuard) | `CashCustodyService.getCounts` |
| `GET /api/cash-control/counts/latest` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L133) `CashCustodyController.latestCount` | [GetLatestCashCountUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.findLatestValidCount → `cash_current_bank_day`, `cash_latest_count_candidate` | UseGuards(JwtAuthGuard) | `CashCustodyService.getLatestCount` |
| `GET /api/cash-control/counts/:id` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L144) `CashCustodyController.count` | [GetCashCountUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.findCountById | UseGuards(JwtAuthGuard) | `CashCustodyService.getCount` |
| `POST /api/cash-control/counts` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L152) `CashCustodyController.createCount` | [RegisterCashCountUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.registerCount/findCountById → `register_cash_count` | UseGuards(JwtAuthGuard) | `CashCustodyService.registerCount` |
| `POST /api/cash-control/counts/:id/corrections` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L166) `CashCustodyController.correctCount` | [RegisterCashCountUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.registerCount/findCountById → `register_cash_count` | UseGuards(JwtAuthGuard) | `CashCustodyService.correctCount` |
| `GET /api/cash-control/warehouse/movements` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L183) `CashCustodyController.warehouseMovements` | [ListWarehouseMovementsUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.findWarehouseMovements [warehouse_cash_movements, users, cash_warehouse_transfers, warehouse_cash_withdrawals] | UseGuards(JwtAuthGuard) | `CashCustodyService.getWarehouseMovements` |
| `POST /api/cash-control/warehouse/initial-balance` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L191) `CashCustodyController.warehouseInitialBalance` | [RegisterWarehouseInitialBalanceUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.registerWarehouseInitialBalance/getCustody → `cash_balance`, `cash_current_bank_day`, `register_warehouse_initial_balance` [warehouse_cash_movements, warehouse_cash_withdrawals] | UseGuards(JwtAuthGuard) | `CashCustodyService.registerWarehouseInitialBalance` |
| `GET /api/cash-control/warehouse/transfers` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L204) `CashCustodyController.transfers` | [ListWarehouseTransfersUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.findTransfers [cash_warehouse_transfers] | UseGuards(JwtAuthGuard) | `CashCustodyService.getTransfers` |
| `GET /api/cash-control/warehouse/transfers/:id` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L212) `CashCustodyController.transfer` | [GetWarehouseTransferUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.findTransferById | UseGuards(JwtAuthGuard) | — |
| `POST /api/cash-control/warehouse/transfers` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L220) `CashCustodyController.createTransfer` | [RegisterWarehouseTransferUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.registerTransfer/findTransferById/getCustody → `cash_balance`, `cash_current_bank_day`, `register_cash_warehouse_transfer` [warehouse_cash_movements, warehouse_cash_withdrawals] | UseGuards(JwtAuthGuard) | `CashCustodyService.registerTransfer` |
| `POST /api/cash-control/warehouse/transfers/:id/void` | [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L233) `CashCustodyController.voidWarehouseTransfer` | [VoidWarehouseTransferUseCase](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | `CashCustodyRepository`.voidTransfer/findTransferById/getCustody → `cash_balance`, `cash_current_bank_day`, `void_cash_warehouse_transfer` [warehouse_cash_movements, warehouse_cash_withdrawals] | UseGuards(JwtAuthGuard) | `CashCustodyService.voidTransfer` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [cash-control.use-cases.spec.ts](#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-control-use-cases-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `movement`, `period`, `repositoryMock`, `expectRule`, `bankDay` (sin comentario de documentación en el código). | 9 internas | 0 | Soporte (pruebas) |
| [cash-custody.use-cases.spec.ts](#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `repository`, `expectCode`, `SUPER`, `SUPERVISOR`, `USER` (sin comentario de documentación en el código). | 2 internas | 0 | Soporte (pruebas) |
| [cash-custody.use-cases.ts](#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts) | .ts | Caso de uso | Aplicación | "Efectivo en caja / en Bodega / total bajo custodia" — official balances from both Kardex. | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [cash-cut-commands.use-cases.ts](#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts) | .ts | Caso de uso | Aplicación | "Apertura del día" — always TODAY in America/Guatemala. | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [cash-cut-queries.use-cases.ts](#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-queries-use-cases-ts) | .ts | Caso de uso | Aplicación | "Historial de Cortes" — one row per operational day with its first and second cut (scheduled/actual times, responsible users, status, opening/ closing cash, differences, bank reconciliation). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [cash-movement-commands.use-cases.ts](#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts) | .ts | Caso de uso | Aplicación | "Registrar entrada/salida de efectivo" (plus AJUSTE and the one-time SALDO_INICIAL). | 3 internas; ext.: crypto, @nestjs/common | 4 | Media (4 consumidores) |
| [cash-movement-queries.use-cases.ts](#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts) | .ts | Caso de uso | Aplicación | "Consultar saldo físico actual" (lightweight) — polled by every screen that shows cash to detect changes made elsewhere. | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-cash-position.use-case.ts](#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-get-cash-position-use-case-ts) | .ts | Caso de uso | Aplicación | The identification part of a bank-day summary (without its totals). | 2 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [register-cash-bank-deposit.use-case.ts](#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts) | .ts | Caso de uso | Aplicación | Control de Efectivo → "Depósito bancario": physical cash leaves the caja (Kardex OUT) and the selected registered account's balance increases, in ONE database transaction (`register_cash_bank_deposit`). | 6 internas; ext.: crypto, @nestjs/common | 3 | Media (3 consumidores) |
| [cash-control.module.ts](#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts) | .ts | Módulo | Arranque / configuración | Finance → Control de Efectivo: the single official physical-cash Kardex (`cash_movements`), the operational-day opening/closing and the two daily cuts. | 14 internas; ext.: @nestjs/common | 2 | Baja (2 consumidores) |
| [cash-denominations.spec.ts](#f-comercial-jhoel-api-src-modules-cash-control-domain-cash-denominations-spec-ts) | .ts | Prueba unitaria | Dominio | Prueba unitaria (sin comentario de documentación en el código). | 1 internas | 0 | Soporte (pruebas) |
| [cash-denominations.ts](#f-comercial-jhoel-api-src-modules-cash-control-domain-cash-denominations-ts) | .ts | Código TypeScript | Dominio | Every bill/coin the business counts, in display order (Q200 … Q0.01). | 0 internas | 4 | Media (4 consumidores) |
| [cash-control.errors.ts](#f-comercial-jhoel-api-src-modules-cash-control-domain-errors-cash-control-errors-ts) | .ts | Errores de dominio | Dominio | Business-rule violation of Control de Efectivo. | 1 internas | 10 | Alta (10 consumidores) |
| [cash-control.policy.ts](#f-comercial-jhoel-api-src-modules-cash-control-domain-policies-cash-control-policy-ts) | .ts | Política de dominio | Dominio | Throws `CASH_CUSTODY_FORBIDDEN` unless the role holds the permission. | 1 internas | 7 | Media (7 consumidores) |
| [cash-control.repository.ts](#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Control de Efectivo — persistence port. | 0 internas | 12 | Alta (12 consumidores) |
| [cash-custody.repository.ts](#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-custody-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Port of "Arqueo de Caja" and "Entrega de Efectivo a Bodega". | 0 internas | 5 | Media (5 consumidores) |
| [typeorm-cash-control.repository.ts](#f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-control-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Raw-SQL adapter over the Control de Efectivo functions/tables. | 3 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-cash-custody.repository.ts](#f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-custody-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Raw-SQL adapter of the custody port: reads are plain SELECTs; writes call `register_cash_warehouse_transfer`, `void_cash_warehouse_transfer`, `register_warehouse_initial_balance` and `register_cash_count`, whose `RAISE EXCEPTION` codes are mapped to the cash-control domain errors. | 3 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [cash-control.controller.ts](#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts) | .ts | Controlador | Presentación | Finance → Control de Efectivo (`/cash-control`). | 11 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [cash-custody.controller.ts](#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts) | .ts | Controlador | Presentación | Control de Efectivo → "Arqueo de Caja" and "Bodega". | 5 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [cash-control.request.dto.ts](#f-comercial-jhoel-api-src-modules-cash-control-presentation-dtos-cash-control-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CashMovementsQueryDto`, `CashBankDaysQueryDto`, `RecentCashMovementsQueryDto`, `RegisterCashMovementRequestDto`, `ReasonRequestDto` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 2 | Baja (2 consumidores) |
| [cash-custody.request.dto.ts](#f-comercial-jhoel-api-src-modules-cash-control-presentation-dtos-cash-custody-request-dto-ts) | .ts | DTO de entrada | Presentación | One denomination row (quantity: whole number ≥ 0). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-control-use-cases-spec-ts"></a>

### cash-control.use-cases.spec.ts

- **Ruta:** [cash-control.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-control.use-cases.spec.ts) (`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-control.use-cases.spec.ts`, 768 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Prueba unitaria: declara `movement`, `period`, `repositoryMock`, `expectRule`, `bankDay` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [register-cash-bank-deposit.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts), [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts), [cash-control.errors.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-errors-cash-control-errors-ts), [cash-control.policy.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-policies-cash-control-policy-ts), [get-cash-position.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-get-cash-position-use-case-ts), [cash-movement-queries.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts), [cash-movement-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts), [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts)
- **Consumidores:** —
#### Función `movement` (L41–70)

- **Tipo:** función local del archivo
- **Firma:** `movement(overrides?: Partial<CashMovementRow>): CashMovementRow` — [cash-control.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-control.use-cases.spec.ts#L41)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `period` (L72–104)

- **Tipo:** función local del archivo
- **Firma:** `period(overrides?: Partial<CashCutPeriodRow>): CashCutPeriodRow` — [cash-control.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-control.use-cases.spec.ts#L72)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `repositoryMock` (L106–153)

- **Tipo:** función local del archivo
- **Firma:** `repositoryMock(): jest.Mocked<CashControlRepository>` — [cash-control.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-control.use-cases.spec.ts#L106)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `jest.fn().mockResolvedValue`, `jest.fn`, `movement`, `period`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `expectRule` (L155–161)

- **Tipo:** función local del archivo, async
- **Firma:** `expectRule(promise: Promise<unknown>, code: string): Promise<void>` — [cash-control.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-control.use-cases.spec.ts#L155)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `expect(promise).rejects.toBeInstanceOf`, `expect`, `expect(promise).rejects.toMatchObject`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `bankDay` (L656–678)

- **Tipo:** función local del archivo
- **Firma:** `bankDay(overrides?: Partial<CashBankDaySummary>): CashBankDaySummary` — [cash-control.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-control.use-cases.spec.ts#L656)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-spec-ts"></a>

### cash-custody.use-cases.spec.ts

- **Ruta:** [cash-custody.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.spec.ts) (`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.spec.ts`, 429 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Prueba unitaria: declara `repository`, `expectCode`, `SUPER`, `SUPERVISOR`, `USER` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [cash-custody.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-custody-repository-ts), [cash-custody.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts)
- **Consumidores:** —
#### Función `repository` (L33–63)

- **Tipo:** función local del archivo
- **Firma:** `repository(): jest.Mocked<CashCustodyRepository>` — [cash-custody.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.spec.ts#L33)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `jest.fn().mockResolvedValue`, `jest.fn`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `expectCode` (L65–67)

- **Tipo:** función local del archivo, async
- **Firma:** `expectCode(promise: Promise<unknown>, code: string)` — [cash-custody.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.spec.ts#L65)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `expect(promise).rejects.toMatchObject`, `expect`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts"></a>

### cash-custody.use-cases.ts

- **Ruta:** [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts) (`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts`, 537 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** "Efectivo en caja / en Bodega / total bajo custodia" — official balances from both Kardex.
- **Depende de (archivos del proyecto):** [cash-custody.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-custody-repository-ts), [cash-control.policy.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-policies-cash-control-policy-ts), [cash-control.errors.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-errors-cash-control-errors-ts), [cash-denominations.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-cash-denominations-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [cash-custody.use-cases.spec.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-spec-ts), [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts), [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)

**Interfaces, tipos y enums:**

- `interface CustodyActor` (L23): The JWT identity every custody use case re-checks. — miembros: `userId`, `role`
- `interface DenominationInput` (L28): sin documentación — miembros: `denomination`, `quantity`
- `interface LatestCashCountOutput` (L351): What "Cargar último arqueo de Caja" receives. — miembros: `count`, `breakdown`, `referenceBusinessDate`, `isFromReferenceDay`

#### Clase `GetCashCustodyUseCase` (L51–62)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Efectivo en caja / en Bodega / total bajo custodia" — official balances from both Kardex.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 58–61 | `actor: { role: string }` | `Promise<CashCustodySnapshot>` |

##### `GetCashCustodyUseCase.execute`

- **Firma:** `execute(actor: { role: string }): Promise<CashCustodySnapshot>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L58) (L58–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `this.repository.getCustody`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `RegisterWarehouseTransferUseCase` (L69–111)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Entrega de Efectivo a Bodega": one atomic SQL call moves the cash from the caja Kardex to the Bodega Kardex (same amount, same reference). Without a breakdown it requires `cash_custody.authorize` (business policy).
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 76–110 | `input: { amount: number; details?: DenominationInput[]; deliveredBy: string; receivedBy: string; voucherReference?: string; observations?: string; clientRequestId: str` | `Promise<{ transfer: WarehouseTransferRow; custody: CashCustodySnapshot }>` |

##### `RegisterWarehouseTransferUseCase.execute`

- **Firma:** `execute(input: { amount: number; details?: DenominationInput[]; deliveredBy: string; receivedBy: string; voucherReference?: string; observations?: string; clientRequestId: str): Promise<{ transfer: WarehouseTransferRow; custody: CashCustodySnapshot }>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L76) (L76–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `nonZero`, `this.repository.registerTransfer`, `input.deliveredBy.trim`, `input.receivedBy.trim`, `input.voucherReference?.trim`, `input.observations?.trim`, `Promise.all`, `this.repository.findTransferById`, `this.repository.getCustody`, `cashControlError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_WAREHOUSE_TRANSFER_NOT_FOUND')`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `VoidWarehouseTransferUseCase` (L114–142)

- **Decoradores:** `@Injectable()`
- **Propósito:** Voids a delivery (both Kardex reversed together). Admin + reason.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 121–141 | `input: { id: string; reason: string } & CustodyActor` | `Promise<{ transfer: WarehouseTransferRow; custody: CashCustodySnapshot }>` |

##### `VoidWarehouseTransferUseCase.execute`

- **Firma:** `execute(input: { id: string; reason: string } & CustodyActor): Promise<{ transfer: WarehouseTransferRow; custody: CashCustodySnapshot }>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L121) (L121–141)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `input.reason.trim`, `cashControlError`, `this.repository.voidTransfer`, `Promise.all`, `this.repository.findTransferById`, `this.repository.getCustody`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_REASON_REQUIRED')`, `cashControlError('CASH_WAREHOUSE_TRANSFER_NOT_FOUND')`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `ListWarehouseTransfersUseCase` (L145–172)

- **Decoradores:** `@Injectable()`
- **Propósito:** History of deliveries to Bodega.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 152–171 | `input: { dateFrom?: string; dateTo?: string; status?: 'APLICADA' \| 'ANULADA'; page?: number; limit?: number; role: string; }` | `Promise<Paginated<WarehouseTransferRow>>` |

##### `ListWarehouseTransfersUseCase.execute`

- **Firma:** `execute(input: { dateFrom?: string; dateTo?: string; status?: 'APLICADA' \| 'ANULADA'; page?: number; limit?: number; role: string; }): Promise<Paginated<WarehouseTransferRow>>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L152) (L152–171)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `cashControlError`, `this.repository.findTransfers`, `page`, `limit`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_INVALID_DATE_RANGE')`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `GetWarehouseTransferUseCase` (L175–193)

- **Decoradores:** `@Injectable()`
- **Propósito:** One delivery with both related Kardex movements and its breakdown.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 182–192 | `input: { id: string; role: string; }` | `Promise<WarehouseTransferRow>` |

##### `GetWarehouseTransferUseCase.execute`

- **Firma:** `execute(input: { id: string; role: string; }): Promise<WarehouseTransferRow>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L182) (L182–192)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `this.repository.findTransferById`, `cashControlError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_WAREHOUSE_TRANSFER_NOT_FOUND')`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `RegisterWarehouseInitialBalanceUseCase` (L196–222)

- **Decoradores:** `@Injectable()`
- **Propósito:** One-time initial balance of Bodega (admin, reason).
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 203–221 | `input: { amount: number; reason: string; clientRequestId: string; } & CustodyActor` | `Promise<CashCustodySnapshot>` |

##### `RegisterWarehouseInitialBalanceUseCase.execute`

- **Firma:** `execute(input: { amount: number; reason: string; clientRequestId: string; } & CustodyActor): Promise<CashCustodySnapshot>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L203) (L203–221)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `input.reason.trim`, `cashControlError`, `this.repository.registerWarehouseInitialBalance`, `this.repository.getCustody`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_REASON_REQUIRED')`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `ListWarehouseMovementsUseCase` (L225–243)

- **Decoradores:** `@Injectable()`
- **Propósito:** Kardex de Bodega (newest first).
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 232–242 | `input: { page?: number; limit?: number; role: string; }` | `Promise<Paginated<WarehouseMovementRow>>` |

##### `ListWarehouseMovementsUseCase.execute`

- **Firma:** `execute(input: { page?: number; limit?: number; role: string; }): Promise<Paginated<WarehouseMovementRow>>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L232) (L232–242)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `this.repository.findWarehouseMovements`, `page`, `limit`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `RegisterCashCountUseCase` (L251–293)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Arqueo de Caja": stores the count as a photograph (theoretical caja and Bodega read under their locks). It never touches the Kardex; a difference stays recorded as FALTANTE/SOBRANTE. With `replacesId` it is an audited correction (admin + reason) that keeps the original photograph.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 258–292 | `input: { details: DenominationInput[]; observations?: string; warehouseCounted?: number \| null; clientRequestId: string; replacesId?: string; correctionReason?: string` | `Promise<CashCountRow>` |

##### `RegisterCashCountUseCase.execute`

- **Firma:** `execute(input: { details: DenominationInput[]; observations?: string; warehouseCounted?: number \| null; clientRequestId: string; replacesId?: string; correctionReason?: string): Promise<CashCountRow>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L258) (L258–292)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `input.correctionReason.trim`, `cashControlError`, `this.repository.registerCount`, `input.observations?.trim`, `input.correctionReason?.trim`, `this.repository.findCountById`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_REASON_REQUIRED')`, `cashControlError('CASH_BREAKDOWN_REQUIRED')`, `cashControlError('CASH_COUNT_NOT_FOUND')`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `ListCashCountsUseCase` (L296–330)

- **Decoradores:** `@Injectable()`
- **Propósito:** Historial de arqueos (filters: date, bank day, user, result).
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 303–329 | `input: { dateFrom?: string; dateTo?: string; businessDate?: string; userId?: string; result?: CashCountResult; page?: number; limit?: number; role: string; }` | `Promise<Paginated<CashCountRow>>` |

##### `ListCashCountsUseCase.execute`

- **Firma:** `execute(input: { dateFrom?: string; dateTo?: string; businessDate?: string; userId?: string; result?: CashCountResult; page?: number; limit?: number; role: string; }): Promise<Paginated<CashCountRow>>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L303) (L303–329)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `cashControlError`, `DATE.test`, `this.repository.findCounts`, `page`, `limit`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_INVALID_DATE_RANGE')`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `GetCashCountUseCase` (L333–348)

- **Decoradores:** `@Injectable()`
- **Propósito:** One count exactly as it was recorded.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 340–347 | `input: { id: string; role: string }` | `Promise<CashCountRow>` |

##### `GetCashCountUseCase.execute`

- **Firma:** `execute(input: { id: string; role: string }): Promise<CashCountRow>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L340) (L340–347)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `this.repository.findCountById`, `cashControlError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_COUNT_NOT_FOUND')`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `GetLatestCashCountUseCase` (L368–393)

- **Decoradores:** `@Injectable()`
- **Propósito:** Breakdown for Cuadre de Agentes: the arqueo of the "Segundo corte · final del día" (reference day first, else the latest earlier one — flagged by `isFromReferenceDay`). Exactly that cut's quantities, Q0.01 completed with 0 on older cuts; the two cuts are never added up. Read-only.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 375–392 | `input: { businessDate?: string; role: string; }` | `Promise<LatestCashCountOutput>` |

##### `GetLatestCashCountUseCase.execute`

- **Firma:** `execute(input: { businessDate?: string; role: string; }): Promise<LatestCashCountOutput>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L375) (L375–392)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `DATE.test`, `cashControlError`, `this.repository.findLatestValidCount`, `completeBreakdown`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_INVALID_DATE_RANGE')`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `RegisterWarehouseWithdrawalUseCase` (L401–453)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Retiro de Bodega": cash leaves Bodega either back to the caja (internal transfer, total custody unchanged) or deposited into a bank account (Bodega down, bank up). One atomic SQL call; without a breakdown it needs `cash_custody.authorize` (same policy as the deliveries).
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 408–452 | `input: { destination: WarehouseWithdrawalDestination; amount: number; details?: DenominationInput[]; bankId?: string; deliveredBy: string; receivedBy: string; voucherR` | `Promise<{ withdrawal: WarehouseWithdrawalRow; custody: CashCustodySnapshot; }>` |

##### `RegisterWarehouseWithdrawalUseCase.execute`

- **Firma:** `execute(input: { destination: WarehouseWithdrawalDestination; amount: number; details?: DenominationInput[]; bankId?: string; deliveredBy: string; receivedBy: string; voucherR): Promise<{ withdrawal: WarehouseWithdrawalRow; custody: CashCustodySnapshot; }>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L408) (L408–452)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `nonZero`, `cashControlError`, `this.repository.registerWithdrawal`, `input.deliveredBy.trim`, `input.receivedBy.trim`, `input.voucherReference?.trim`, `input.observations?.trim`, `Promise.all`, `this.repository.findWithdrawalById`, `this.repository.getCustody`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('WAREHOUSE_WITHDRAWAL_BANK_REQUIRED')`, `cashControlError('WAREHOUSE_WITHDRAWAL_NOT_FOUND')`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `VoidWarehouseWithdrawalUseCase` (L456–485)

- **Decoradores:** `@Injectable()`
- **Propósito:** Voids a withdrawal (both sides reversed together). Admin + reason.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 463–484 | `input: { id: string; reason: string } & CustodyActor` | `Promise<{ withdrawal: WarehouseWithdrawalRow; custody: CashCustodySnapshot; }>` |

##### `VoidWarehouseWithdrawalUseCase.execute`

- **Firma:** `execute(input: { id: string; reason: string } & CustodyActor): Promise<{ withdrawal: WarehouseWithdrawalRow; custody: CashCustodySnapshot; }>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L463) (L463–484)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `input.reason.trim`, `cashControlError`, `this.repository.voidWithdrawal`, `Promise.all`, `this.repository.findWithdrawalById`, `this.repository.getCustody`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_REASON_REQUIRED')`, `cashControlError('WAREHOUSE_WITHDRAWAL_NOT_FOUND')`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `ListWarehouseWithdrawalsUseCase` (L488–515)

- **Decoradores:** `@Injectable()`
- **Propósito:** History of withdrawals from Bodega.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 495–514 | `input: { dateFrom?: string; dateTo?: string; status?: 'APLICADA' \| 'ANULADA'; page?: number; limit?: number; role: string; }` | `Promise<Paginated<WarehouseWithdrawalRow>>` |

##### `ListWarehouseWithdrawalsUseCase.execute`

- **Firma:** `execute(input: { dateFrom?: string; dateTo?: string; status?: 'APLICADA' \| 'ANULADA'; page?: number; limit?: number; role: string; }): Promise<Paginated<WarehouseWithdrawalRow>>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L495) (L495–514)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `cashControlError`, `this.repository.findWithdrawals`, `page`, `limit`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_INVALID_DATE_RANGE')`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)


#### Clase `GetWarehouseWithdrawalUseCase` (L518–536)

- **Decoradores:** `@Injectable()`
- **Propósito:** One withdrawal with its related movements and breakdown.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CUSTODY_REPOSITORY) repository: CashCustodyRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 525–535 | `input: { id: string; role: string; }` | `Promise<WarehouseWithdrawalRow>` |

##### `GetWarehouseWithdrawalUseCase.execute`

- **Firma:** `execute(input: { id: string; role: string; }): Promise<WarehouseWithdrawalRow>` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L525) (L525–535)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCashCustodyPermission`, `this.repository.findWithdrawalById`, `cashControlError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('WAREHOUSE_WITHDRAWAL_NOT_FOUND')`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)

#### Función `page` (L35–37)

- **Tipo:** función local del archivo
- **Firma:** `page(value?: number): number` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L35)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.max`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `limit` (L39–41)

- **Tipo:** función local del archivo
- **Firma:** `limit(value?: number): number` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L39)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.min`, `Math.max`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `nonZero` (L44–48)

- **Tipo:** función local del archivo
- **Firma:** `nonZero(details: DenominationInput[] \| undefined): DenominationInput[]` — [cash-custody.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts#L44)
- **Propósito / descripción:** Only non-zero rows travel to the transfer (a delivery breakdown lists what was handed over).
- **Dependencias:** `(details ?? []).filter`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts"></a>

### cash-cut-commands.use-cases.ts

- **Ruta:** [cash-cut-commands.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts) (`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts`, 297 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** "Apertura del día" — always TODAY in America/Guatemala.
- **Depende de (archivos del proyecto):** [cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts), [cash-control.errors.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-errors-cash-control-errors-ts), [cash-control.policy.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-policies-cash-control-policy-ts), [get-cash-position.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-get-cash-position-use-case-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [cash-control.use-cases.spec.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-control-use-cases-spec-ts), [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts), [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)

**Interfaces, tipos y enums:**

- `interface OpenCashDayInput` (L30): sin documentación — miembros: `userId`, `role`, `manualPhysicalCash`, `reason`, `firstStart`, `firstEnd`, `secondStart`, `secondEnd`
- `interface FinishCashCutInput` (L176): sin documentación — miembros: `periodId`, `userId`, `role`, `details`, `banks`, `cashObservations`, `observations`

#### Clase `OpenCashDayUseCase` (L49–97)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Apertura del día" — always TODAY in America/Guatemala. The opening physical cash is inherited from the last counted cut (never invented, never reset to zero); only an admin may authorize a different amount, with a mandatory reason. Idempotent: opening an already-open date returns it. Both cuts are created PROGRAMADO with their scheduled times.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`, `getPosition: GetCashPositionUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 57–96 | `input: OpenCashDayInput` | `Promise<CashPositionOutput>` |

##### `OpenCashDayUseCase.execute`

- **Firma:** `execute(input: OpenCashDayInput): Promise<CashPositionOutput>` — [cash-cut-commands.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts#L57) (L57–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCutManager`, `isCashAdmin`, `cashControlError`, `Number.isFinite`, `times.every`, `isValidCutTime`, `assertCutSchedule`, `times.some`, `guatemalaIsoDate`, `this.repository.openDay`, `requireReason`, `this.getPosition.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_MANUAL_OPENING_FORBIDDEN')`, `cashControlError('CASH_INVALID_AMOUNT')`, `cashControlError('CASH_CUT_INVALID_SCHEDULE')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)


#### Clase `UpdateCashCutScheduleUseCase` (L100–145)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Programar horarios de corte" — records who changed it and why; finalized cuts are immutable.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`, `getPosition: GetCashPositionUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 108–144 | `input: { periodId: string; start: string; end: string; reason: string; userId: string; role: string; }` | `Promise<CashPositionOutput>` |

##### `UpdateCashCutScheduleUseCase.execute`

- **Firma:** `execute(input: { periodId: string; start: string; end: string; reason: string; userId: string; role: string; }): Promise<CashPositionOutput>` — [cash-cut-commands.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts#L108) (L108–144)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCutManager`, `this.repository.findPeriodById`, `cashControlError`, `this.repository.findPeriodsByDay`, `siblings.find`, `assertCutSchedule`, `guatemalaTime`, `this.repository.updateSchedule`, `requireReason`, `this.getPosition.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_CUT_NOT_FOUND')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)


#### Clase `StartCashCutUseCase` (L153–174)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Iniciar primer/segundo corte". Validated under the lock in SQL: the day is open, no other cut is open, the cut was not started yet and — for the second — the first one is FINALIZADO. Takes the opening snapshot (system cash, inherited physical cash, inherited difference, bank balances).
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`, `getPosition: GetCashPositionUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 161–173 | `input: { periodId: string; userId: string; role: string; }` | `Promise<CashPositionOutput>` |

##### `StartCashCutUseCase.execute`

- **Firma:** `execute(input: { periodId: string; userId: string; role: string; }): Promise<CashPositionOutput>` — [cash-cut-commands.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts#L161) (L161–173)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCutManager`, `this.repository.findPeriodById`, `cashControlError`, `this.repository.startPeriod`, `this.getPosition.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_CUT_NOT_FOUND')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)


#### Clase `FinishCashCutUseCase` (L196–236)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Finalizar primer/segundo corte" — arqueo by denomination (difference = counted − system, computed in SQL) + verification of every active bank account, saved as a permanent snapshot; the cut becomes FINALIZADO and immutable for normal users. No movement is ever created to "fix" a difference.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`, `getPosition: GetCashPositionUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 204–235 | `input: FinishCashCutInput` | `Promise<CashPositionOutput>` |

##### `FinishCashCutUseCase.execute`

- **Firma:** `execute(input: FinishCashCutInput): Promise<CashPositionOutput>` — [cash-cut-commands.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts#L204) (L204–235)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCutManager`, `this.repository.findPeriodById`, `cashControlError`, `new Set`, `Math.round`, `seen.has`, `Number.isInteger`, `seen.add`, `this.repository.finishPeriod`, `input.details.filter`, `input.banks.map`, `bank.observations?.trim`, `input.cashObservations?.trim`, `input.observations?.trim`, `this.getPosition.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_CUT_NOT_FOUND')`, `cashControlError('CASH_INVALID_DENOMINATION')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)


#### Clase `ReopenCashCutUseCase` (L239–267)

- **Decoradores:** `@Injectable()`
- **Propósito:** Admin-only reopening of the LATEST finalized cut (reason mandatory; the previous arqueo stays in history).
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`, `getPosition: GetCashPositionUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 247–266 | `input: { periodId: string; reason: string; userId: string; role: string; }` | `Promise<CashPositionOutput>` |

##### `ReopenCashCutUseCase.execute`

- **Firma:** `execute(input: { periodId: string; reason: string; userId: string; role: string; }): Promise<CashPositionOutput>` — [cash-cut-commands.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts#L247) (L247–266)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `isCashAdmin`, `cashControlError`, `this.repository.findPeriodById`, `this.repository.reopenPeriod`, `requireReason`, `this.getPosition.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_FORBIDDEN')`, `cashControlError('CASH_CUT_NOT_FOUND')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)


#### Clase `CloseCashDayUseCase` (L270–296)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Cerrar día operativo" — only after both cuts are FINALIZADO; consolidates both without double counting.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`, `getPosition: GetCashPositionUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 278–295 | `input: { dayId: string; observations?: string \| null; userId: string; role: string; }` | `Promise<CashPositionOutput>` |

##### `CloseCashDayUseCase.execute`

- **Firma:** `execute(input: { dayId: string; observations?: string \| null; userId: string; role: string; }): Promise<CashPositionOutput>` — [cash-cut-commands.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts#L278) (L278–295)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCutManager`, `this.repository.findDayById`, `cashControlError`, `this.repository.closeDay`, `input.observations?.trim`, `this.getPosition.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_DAY_NOT_FOUND')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)

#### Función `assertCutManager` (L24–28)

- **Tipo:** función local del archivo
- **Firma:** `assertCutManager(role: string): void` — [cash-cut-commands.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts#L24)
- **Propósito / descripción:** Defense in depth: the controller's `@Roles` already restricts these routes.
- **Dependencias:** `(CASH_CUT_MANAGER_ROLES as readonly string[]).includes`, `cashControlError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_FORBIDDEN')`
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-queries-use-cases-ts"></a>

### cash-cut-queries.use-cases.ts

- **Ruta:** [cash-cut-queries.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-queries.use-cases.ts) (`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-queries.use-cases.ts`, 58 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** "Historial de Cortes" — one row per operational day with its first and second cut (scheduled/actual times, responsible users, status, opening/ closing cash, differences, bank reconciliation).
- **Depende de (archivos del proyecto):** [cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts), [cash-control.errors.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-errors-cash-control-errors-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts), [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)

#### Clase `ListCashDaysUseCase` (L17–40)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Historial de Cortes" — one row per operational day with its first and second cut (scheduled/actual times, responsible users, status, opening/ closing cash, differences, bank reconciliation). Values are the stored snapshots: never recomputed, so history stays exactly as it was closed.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 24–39 | `options: Partial<FindCashDaysOptions>` | `Promise<PaginatedCashDays>` |

##### `ListCashDaysUseCase.execute`

- **Firma:** `execute(options: Partial<FindCashDaysOptions>): Promise<PaginatedCashDays>` — [cash-cut-queries.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-queries.use-cases.ts#L24) (L24–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `cashControlError`, `this.repository.findDays`, `Math.max`, `Math.min`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_INVALID_DATE_RANGE')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)


#### Clase `GetCashCutDetailUseCase` (L43–57)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Consultar detalle" of one cut: arqueos (current + superseded), bank reconciliation, audit events, schedule changes and its Kardex range.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 50–56 | `periodId: string` | `Promise<CashCutDetail>` |

##### `GetCashCutDetailUseCase.execute`

- **Firma:** `execute(periodId: string): Promise<CashCutDetail>` — [cash-cut-queries.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-queries.use-cases.ts#L50) (L50–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findCutDetail`, `cashControlError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_CUT_NOT_FOUND')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts"></a>

### cash-movement-commands.use-cases.ts

- **Ruta:** [cash-movement-commands.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-commands.use-cases.ts) (`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-commands.use-cases.ts`, 123 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** "Registrar entrada/salida de efectivo" (plus AJUSTE and the one-time SALDO_INICIAL).
- **Depende de (archivos del proyecto):** [cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts), [cash-control.errors.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-errors-cash-control-errors-ts), [cash-control.policy.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-policies-cash-control-policy-ts)
- **Paquetes externos:** `crypto`, `@nestjs/common`
- **Consumidores:** [cash-control.use-cases.spec.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-control-use-cases-spec-ts), [register-cash-bank-deposit.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts), [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts), [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)

**Interfaces, tipos y enums:**

- `interface CashMovementResult` (L15): sin documentación — miembros: `movement`, `balance`
- `interface RegisterCashMovementInput` (L21): sin documentación — miembros: `movementType`, `amount`, `description`, `reason`, `clientRequestId`, `userId`, `role`

#### Clase `RegisterCashMovementUseCase` (L39–83)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Registrar entrada/salida de efectivo" (plus AJUSTE and the one-time SALDO_INICIAL). Entradas/salidas are for cut managers; AJUSTE and SALDO_INICIAL are admin-only (RBAC re-checked here, not only on the route). A reason is always mandatory. `clientRequestId` (one per modal opening) is the idempotency key: a double click or a retried request returns the movement already written instead of a second one.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 46–71 | `input: RegisterCashMovementInput` | `Promise<CashMovementResult>` |
| `result` | método private async | 73–82 | `id: string` | `Promise<CashMovementResult>` |

##### `RegisterCashMovementUseCase.execute`

- **Firma:** `execute(input: RegisterCashMovementInput): Promise<CashMovementResult>` — [cash-movement-commands.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-commands.use-cases.ts#L46) (L46–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `isCashAdmin`, `cashControlError`, `Math.round`, `Number.isFinite`, `this.repository.registerManualMovement`, `input.description?.trim`, `requireReason`, `randomUUID`, `this.result`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_FORBIDDEN')`, `cashControlError('CASH_INVALID_AMOUNT')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)

##### `RegisterCashMovementUseCase.result`

- **Firma:** `result(id: string): Promise<CashMovementResult>` — [cash-movement-commands.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-commands.use-cases.ts#L73) (L73–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.repository.findMovementById`, `this.repository.getBalance`, `cashControlError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_MOVEMENT_NOT_FOUND')`
- **Consumidores:** (mismo archivo)


#### Clase `VoidCashMovementUseCase` (L92–122)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Anular o revertir un movimiento" — admin only, reason mandatory. Marks the original ANULADO and appends the inverse ANULACION (nothing is deleted). Only manual movements are voided here; operations born in Transaccionar, Cartera or Transferencias are voided at their source and the trigger appends the reversal automatically.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 99–121 | `input: { id: string; reason: string; userId: string; role: string; }` | `Promise<CashMovementResult>` |

##### `VoidCashMovementUseCase.execute`

- **Firma:** `execute(input: { id: string; reason: string; userId: string; role: string; }): Promise<CashMovementResult>` — [cash-movement-commands.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-commands.use-cases.ts#L99) (L99–121)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `isCashAdmin`, `cashControlError`, `this.repository.voidManualMovement`, `requireReason`, `Promise.all`, `this.repository.findMovementById`, `this.repository.getBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_FORBIDDEN')`, `cashControlError('CASH_MOVEMENT_NOT_FOUND')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts"></a>

### cash-movement-queries.use-cases.ts

- **Ruta:** [cash-movement-queries.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-queries.use-cases.ts) (`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-queries.use-cases.ts`, 151 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** "Consultar saldo físico actual" (lightweight) — polled by every screen that shows cash to detect changes made elsewhere.
- **Depende de (archivos del proyecto):** [cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts), [cash-control.errors.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-errors-cash-control-errors-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [cash-control.use-cases.spec.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-control-use-cases-spec-ts), [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts), [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)

#### Clase `GetCashBalanceUseCase` (L16–26)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Consultar saldo físico actual" (lightweight) — polled by every screen that shows cash to detect changes made elsewhere.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 23–25 | — | `Promise<CashBalanceSnapshot>` |

##### `GetCashBalanceUseCase.execute`

- **Firma:** `execute(): Promise<CashBalanceSnapshot>` — [cash-movement-queries.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-queries.use-cases.ts#L23) (L23–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.getBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)


#### Clase `ListCashBankDaysUseCase` (L33–43)

- **Decoradores:** `@Injectable()`
- **Propósito:** Bank-day history for Control de Efectivo's day selector: the latest bank operational days (Agentes Bancarios openings) with their own indicators, each recomputed from its Kardex range. Read only.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 40–42 | `limit?` | `Promise<CashBankDaySummary[]>` |

##### `ListCashBankDaysUseCase.execute`

- **Firma:** `execute(limit?): Promise<CashBankDaySummary[]>` — [cash-movement-queries.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-queries.use-cases.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findBankDays`, `Math.min`, `Math.max`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)


#### Clase `GetCashBankDayUseCase` (L46–63)

- **Decoradores:** `@Injectable()`
- **Propósito:** Indicators of one bank operational day (original values, read only).
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 53–62 | `date: string` | `Promise<CashBankDaySummary>` |

##### `GetCashBankDayUseCase.execute`

- **Firma:** `execute(date: string): Promise<CashBankDaySummary>` — [cash-movement-queries.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-queries.use-cases.ts#L53) (L53–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `/^\d{4}-\d{2}-\d{2}$/.test`, `cashControlError`, `this.repository.getBankDaySummary`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_INVALID_DATE_RANGE')`, `cashControlError('CASH_BANK_DAY_NOT_FOUND')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)


#### Clase `ListCashMovementsUseCase` (L66–89)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Consultar Kardex de efectivo" — newest first, filterable by date range, type, direction, user and cut.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 73–88 | `options: Partial<FindCashMovementsOptions>` | `Promise<PaginatedCashMovements>` |

##### `ListCashMovementsUseCase.execute`

- **Firma:** `execute(options: Partial<FindCashMovementsOptions>): Promise<PaginatedCashMovements>` — [cash-movement-queries.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-queries.use-cases.ts#L73) (L73–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `cashControlError`, `this.repository.findMovements`, `Math.max`, `Math.min`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_INVALID_DATE_RANGE')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)


#### Clase `GetRecentCashMovementsUseCase` (L96–108)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Consultar últimos 10 movimientos" — backs Transaccionar's "Últimas transacciones" card. Includes operations with no cash effect (NONE) so the card can show them grey; `newBalance` is the official balance after each one.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 103–107 | `limit?` | `Promise<CashMovementRow[]>` |

##### `GetRecentCashMovementsUseCase.execute`

- **Firma:** `execute(limit?): Promise<CashMovementRow[]>` — [cash-movement-queries.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-queries.use-cases.ts#L103) (L103–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findRecentMovements`, `Math.min`, `Math.max`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)


#### Clase `GetCashMovementUseCase` (L110–124)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 117–123 | `id: string` | `Promise<CashMovementRow>` |

##### `GetCashMovementUseCase.execute`

- **Firma:** `execute(id: string): Promise<CashMovementRow>` — [cash-movement-queries.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-queries.use-cases.ts#L117) (L117–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findMovementById`, `cashControlError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_MOVEMENT_NOT_FOUND')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)


#### Clase `ListCashUsersUseCase` (L127–137)

- **Decoradores:** `@Injectable()`
- **Propósito:** Users that appear in the Kardex or the cuts — options for the "Usuario" filters.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 134–136 | — | `Promise<CashUserOption[]>` |

##### `ListCashUsersUseCase.execute`

- **Firma:** `execute(): Promise<CashUserOption[]>` — [cash-movement-queries.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-queries.use-cases.ts#L134) (L134–136)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findUsers`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)


#### Clase `GetCashBankBalancesUseCase` (L140–150)

- **Decoradores:** `@Injectable()`
- **Propósito:** Current balance of every active bank account — pre-fills the bank reconciliation of a cut.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 147–149 | — | `Promise<CashBankBalance[]>` |

##### `GetCashBankBalancesUseCase.execute`

- **Firma:** `execute(): Promise<CashBankBalance[]>` — [cash-movement-queries.use-cases.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-queries.use-cases.ts#L147) (L147–149)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.getBankBalances`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-get-cash-position-use-case-ts"></a>

### get-cash-position.use-case.ts

- **Ruta:** [get-cash-position.use-case.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/get-cash-position.use-case.ts) (`comercial-jhoel-api/src/modules/cash-control/application/use-cases/get-cash-position.use-case.ts`, 173 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** The identification part of a bank-day summary (without its totals).
- **Depende de (archivos del proyecto):** [cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts), [cash-control.policy.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-policies-cash-control-policy-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [cash-control.use-cases.spec.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-control-use-cases-spec-ts), [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts), [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts), [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)

**Interfaces, tipos y enums:**

- `interface CashCutPeriodView` (L13) extends CashCutPeriodRow: A cut as shown on screen: an open cut carries its LIVE totals/system cash (read from the Kardex, never computed client-side). — miembros: `liveSystemCash`, `liveTotalIn`, `liveTotalOut`, `liveMovementCount`
- `interface CashPositionOutput` (L23): `GET /cash-control/position` — everything Control de Efectivo's main card and cut controls need, in one call. — miembros: `date`, `balance`, `lastSequence`, `lastMovementAt`, `hasInitialBalance`, `dayState`, `day`, `periods`, `openPeriod`, `summary`, `warehouseBalance`, `custodyTotal`, `bankDay`, `canCloseDay`
- `type CashDayState` (L20) = `'SIN_APERTURA' \| 'ABIERTO' \| 'CERRADO'`

#### Clase `GetCashPositionUseCase` (L76–172)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 83–145 | `date?: string` | `Promise<CashPositionOutput>` |
| `toView` | método private async | 147–171 | `row: CashCutPeriodRow`, `balance: number` | `Promise<CashCutPeriodView>` |

##### `GetCashPositionUseCase.execute`

- **Firma:** `execute(date?: string): Promise<CashPositionOutput>` — [get-cash-position.use-case.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/get-cash-position.use-case.ts#L83) (L83–145)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.repository.getBalance`, `this.repository.hasInitialBalance`, `this.repository.findDayByDate`, `this.repository.getDateSummary`, `this.repository.findOpenPeriod`, `this.repository.getBankDaySummary`, `this.repository.getWarehouseBalance`, `this.repository.findPeriodsByDay`, `periodRows.map`, `this.toView`, `periods.find`, `toBankDayHeader`, `Math.round`, `periods.every`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts), [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)

##### `GetCashPositionUseCase.toView`

- **Firma:** `toView(row: CashCutPeriodRow, balance: number): Promise<CashCutPeriodView>` — [get-cash-position.use-case.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/get-cash-position.use-case.ts#L147) (L147–171)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.getRangeTotals`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `toBankDayHeader` (L58–74)

- **Tipo:** función exportada
- **Firma:** `toBankDayHeader(day: CashBankDaySummary): NonNullable<CashPositionOutput['bankDay']>` — [get-cash-position.use-case.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/get-cash-position.use-case.ts#L58)
- **Propósito / descripción:** The identification part of a bank-day summary (without its totals).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts"></a>

### register-cash-bank-deposit.use-case.ts

- **Ruta:** [register-cash-bank-deposit.use-case.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/register-cash-bank-deposit.use-case.ts) (`comercial-jhoel-api/src/modules/cash-control/application/use-cases/register-cash-bank-deposit.use-case.ts`, 112 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Control de Efectivo → "Depósito bancario": physical cash leaves the caja (Kardex OUT) and the selected registered account's balance increases, in ONE database transaction (`register_cash_bank_deposit`).
- **Depende de (archivos del proyecto):** [cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts), [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [assert-bank-operation-day-open.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-assert-bank-operation-day-open-ts), [cash-control.errors.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-errors-cash-control-errors-ts), [cash-control.policy.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-policies-cash-control-policy-ts), [cash-movement-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts)
- **Paquetes externos:** `crypto`, `@nestjs/common`
- **Consumidores:** [cash-control.use-cases.spec.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-control-use-cases-spec-ts), [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts), [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)

**Interfaces, tipos y enums:**

- `interface RegisterCashBankDepositInput` (L26): sin documentación — miembros: `bankId`, `amount`, `details`, `description`, `clientRequestId`, `userId`, `role`

#### Clase `RegisterCashBankDepositUseCase` (L47–111)

- **Decoradores:** `@Injectable()`
- **Propósito:** Control de Efectivo → "Depósito bancario": physical cash leaves the caja (Kardex OUT) and the selected registered account's balance increases, in ONE database transaction (`register_cash_bank_deposit`). The denomination breakdown is mandatory and must add up to the amount; the deposit is rejected when the official cash is not enough. Like every other balance- moving bank operation, it requires the business day to be open. Cut managers only (re-checked here); `clientRequestId` makes retries idempotent. Voiding goes through `VoidCashMovementUseCase` (admin) and reverses both sides.
- **Dependencias inyectadas (constructor):** `@Inject(CASH_CONTROL_REPOSITORY) repository: CashControlRepository`, `@Inject(DAY_OPENING_REPOSITORY) dayOpeningRepository: DayOpeningRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 56–110 | `input: RegisterCashBankDepositInput` | `Promise<CashMovementResult>` |

##### `RegisterCashBankDepositUseCase.execute`

- **Firma:** `execute(input: RegisterCashBankDepositInput): Promise<CashMovementResult>` — [register-cash-bank-deposit.use-case.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/register-cash-bank-deposit.use-case.ts#L56) (L56–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `(CASH_CUT_MANAGER_ROLES as readonly string[]).includes`, `cashControlError`, `round2`, `Number.isFinite`, `input.details.filter`, `new Set`, `VALID_DENOMINATIONS.includes`, `Number.isInteger`, `seen.has`, `seen.add`, `details.reduce`, `assertBankOperationDayOpen`, `guatemalaIsoDate`, `this.repository.registerBankDeposit`, `input.description?.trim`, `randomUUID`, `Promise.all`, `this.repository.findMovementById`…
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_FORBIDDEN')`, `cashControlError('CASH_INVALID_AMOUNT')`, `cashControlError('CASH_BREAKDOWN_REQUIRED')`, `cashControlError('CASH_INVALID_DENOMINATION')`, `cashControlError('CASH_BREAKDOWN_MISMATCH')`, `cashControlError('CASH_MOVEMENT_NOT_FOUND')`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts)

#### Función `round2` (L22–24)

- **Tipo:** función local del archivo
- **Firma:** `round2(value: number): number` — [register-cash-bank-deposit.use-case.ts](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/register-cash-bank-deposit.use-case.ts#L22)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts"></a>

### cash-control.module.ts

- **Ruta:** [cash-control.module.ts](../../../../comercial-jhoel-api/src/modules/cash-control/cash-control.module.ts) (`comercial-jhoel-api/src/modules/cash-control/cash-control.module.ts`, 117 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Finance → Control de Efectivo: the single official physical-cash Kardex (`cash_movements`), the operational-day opening/closing and the two daily cuts.
- **Depende de (archivos del proyecto):** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [register-cash-bank-deposit.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts), [cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts), [typeorm-cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-control-repository-ts), [get-cash-position.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-get-cash-position-use-case-ts), [cash-movement-queries.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts), [cash-movement-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts), [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts), [cash-cut-queries.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-queries-use-cases-ts), [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts), [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts), [cash-custody.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-custody-repository-ts), [typeorm-cash-custody.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-custody-repository-ts), [cash-custody.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts)

#### Clase `CashControlModule` (L64–116)

- **Decoradores:** `@Module({ // DAY_OPENING_REPOSITORY: a bank deposit, like every balance-moving bank operation, needs the day open. imports: [BanksModule], controllers: [CashCont`
- **Propósito:** Finance → Control de Efectivo: the single official physical-cash Kardex (`cash_movements`), the operational-day opening/closing and the two daily cuts. Transaccionar, Cartera (CxC/Activos) and Transferencias Bancarias feed the Kardex through database triggers in the same transaction as their own write — this module never has to be called by them. It exports the repository token so `BankDepositsModule` can return the cash movement an operation produced.
<a id="f-comercial-jhoel-api-src-modules-cash-control-domain-cash-denominations-spec-ts"></a>

### cash-denominations.spec.ts

- **Ruta:** [cash-denominations.spec.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/cash-denominations.spec.ts) (`comercial-jhoel-api/src/modules/cash-control/domain/cash-denominations.spec.ts`, 62 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Dominio · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [cash-denominations.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-cash-denominations-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-cash-control-domain-cash-denominations-ts"></a>

### cash-denominations.ts

- **Ruta:** [cash-denominations.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/cash-denominations.ts) (`comercial-jhoel-api/src/modules/cash-control/domain/cash-denominations.ts`, 57 líneas)
- **Tipo:** Código TypeScript · **Capa:** Dominio · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Every bill/coin the business counts, in display order (Q200 … Q0.01).
- **Descripción del autor (comentario del archivo):** Every bill/coin the business counts, in display order (Q200 … Q0.01). The SQL mirror is `cash_valid_denomination` (migration 1760007600000).
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [create-agent-reconciliation.request.dto.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-create-agent-reconciliation-request-dto-ts), [cash-custody.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts), [cash-denominations.spec.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-cash-denominations-spec-ts)

**Interfaces, tipos y enums:**

- `interface DenominationQuantity` (L9): sin documentación — miembros: `denomination`, `quantity`
- `interface DenominationLine` (L14) extends DenominationQuantity: sin documentación — miembros: `subtotal`

**Constantes exportadas:**

- `CASH_DENOMINATIONS` (L5): Every bill/coin the business counts, in display order (Q200 … Q0.01). = `[ 200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01, ] as const`
#### Función `toCents` (L19–21)

- **Tipo:** función exportada
- **Firma:** `toCents(value: number): number` — [cash-denominations.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/cash-denominations.ts#L19)
- **Propósito / descripción:** Denomination in whole centavos — all cash arithmetic is done in integers.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts)

#### Función `isValidDenomination` (L23–27)

- **Tipo:** función exportada
- **Firma:** `isValidDenomination(value: number): boolean` — [cash-denominations.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/cash-denominations.ts#L23)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `(CASH_DENOMINATIONS as readonly number[]).some`, `toCents`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts)

#### Función `breakdownTotal` (L30–36)

- **Tipo:** función exportada
- **Firma:** `breakdownTotal(rows: DenominationQuantity[]): number` — [cash-denominations.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/cash-denominations.ts#L30)
- **Propósito / descripción:** Exact total of a breakdown (integer centavo math, never float sums).
- **Dependencias:** `rows.reduce`, `toCents`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts)

#### Función `completeBreakdown` (L43–56)

- **Tipo:** función exportada
- **Firma:** `completeBreakdown(rows: DenominationQuantity[]): DenominationLine[]` — [cash-denominations.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/cash-denominations.ts#L43)
- **Propósito / descripción:** The full 12-row breakdown for a form: every denomination in display order, quantity 0 where the stored rows have none (e.g. Q0.01 in counts saved before it existed). Only builds a new view — the stored rows are untouched.
- **Dependencias:** `CASH_DENOMINATIONS.map`, `rows.find`, `toCents`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-custody.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts)

<a id="f-comercial-jhoel-api-src-modules-cash-control-domain-errors-cash-control-errors-ts"></a>

### cash-control.errors.ts

- **Ruta:** [cash-control.errors.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/errors/cash-control.errors.ts) (`comercial-jhoel-api/src/modules/cash-control/domain/errors/cash-control.errors.ts`, 220 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Business-rule violation of Control de Efectivo.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [cash-control.use-cases.spec.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-control-use-cases-spec-ts), [cash-custody.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts), [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts), [cash-cut-queries.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-queries-use-cases-ts), [cash-movement-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts), [cash-movement-queries.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts), [register-cash-bank-deposit.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts), [cash-control.policy.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-policies-cash-control-policy-ts), [typeorm-cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-control-repository-ts), [typeorm-cash-custody.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-custody-repository-ts)

#### Clase `CashControlRuleError` (L9–17)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Business-rule violation of Control de Efectivo. One class with a stable `code` (the same code the SQL functions `RAISE`) instead of one class per rule: the rules live in SQL, this only carries their user-facing message and HTTP status through `GlobalExceptionFilter`.
- **Dependencias inyectadas (constructor):** `code: string`, `message: string`, `status: number`
#### Función `cashControlError` (L206–211)

- **Tipo:** función exportada
- **Firma:** `cashControlError(code: string): CashControlRuleError` — [cash-control.errors.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/errors/cash-control.errors.ts#L206)
- **Propósito / descripción:** Builds the domain error for a known rule code.
- **Dependencias:** `new CashControlRuleError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-custody.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts), [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts), [cash-cut-queries.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-queries-use-cases-ts), [cash-movement-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts), [cash-movement-queries.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts), [register-cash-bank-deposit.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts), [cash-control.policy.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-policies-cash-control-policy-ts)

#### Función `cashControlErrorFromMessage` (L214–219)

- **Tipo:** función exportada
- **Firma:** `cashControlErrorFromMessage(message: string): CashControlRuleError \| null` — [cash-control.errors.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/errors/cash-control.errors.ts#L214)
- **Propósito / descripción:** `RAISE EXCEPTION '&lt;CODE&gt;'` from the cash SQL functions → domain error; `null` if it is not one of them.
- **Dependencias:** `message.split`, `cashControlError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-control-repository-ts), [typeorm-cash-custody.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-custody-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-cash-control-domain-policies-cash-control-policy-ts"></a>

### cash-control.policy.ts

- **Ruta:** [cash-control.policy.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts) (`comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts`, 122 líneas)
- **Tipo:** Política de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Throws `CASH_CUSTODY_FORBIDDEN` unless the role holds the permission.
- **Depende de (archivos del proyecto):** [cash-control.errors.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-errors-cash-control-errors-ts)
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [cash-control.use-cases.spec.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-control-use-cases-spec-ts), [cash-custody.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts), [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts), [cash-movement-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts), [get-cash-position.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-get-cash-position-use-case-ts), [register-cash-bank-deposit.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts)

**Interfaces, tipos y enums:**

- `type CashCustodyPermission` (L25) = `keyof typeof CASH_CUSTODY_PERMISSION_ROLES`

**Constantes exportadas:**

- `CASH_CUT_MANAGER_ROLES` (L4): Accounts that may open the day and start/finish the cash cuts (decided with the business owner). = `[ 'SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO', ] as const`
- `CASH_ADMIN_ROLES` (L11): Accounts that may authorize a manual opening, adjustments, voids and reopen a cut. = `['SUPER_ADMIN', 'ADMIN'] as const`
- `CASH_CUSTODY_PERMISSION_ROLES` (L17): Permissions of "Arqueo de Caja" and "Bodega" (role-based RBAC; the SQL functions enforce operate/authorize again with `cash_custody_assert_role`). = `{ /** Consultar arqueos, su historial, Bodega y sus entregas. */ 'cash_custody.view': ['SUPER_ADMIN', 'ADMIN',`
- `GUATEMALA_TIME_ZONE` (L41) = `'America/Guatemala'`
#### Función `assertCashCustodyPermission` (L28–39)

- **Tipo:** función exportada
- **Firma:** `assertCashCustodyPermission(role: string \| undefined, permission: CashCustodyPermission): void` — [cash-control.policy.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts#L28)
- **Propósito / descripción:** Throws `CASH_CUSTODY_FORBIDDEN` unless the role holds the permission.
- **Dependencias:** `(CASH_CUSTODY_PERMISSION_ROLES[permission] as readonly string[]).includes`, `cashControlError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_CUSTODY_FORBIDDEN')`
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [cash-custody.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts)

#### Función `isCashAdmin` (L43–45)

- **Tipo:** función exportada
- **Firma:** `isCashAdmin(role: string \| undefined): boolean` — [cash-control.policy.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts#L43)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `(CASH_ADMIN_ROLES as readonly string[]).includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts), [cash-movement-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts)

#### Función `isValidCutTime` (L50–54)

- **Tipo:** función exportada
- **Firma:** `isValidCutTime(value: string \| null \| undefined): value is string` — [cash-control.policy.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts#L50)
- **Propósito / descripción:** `HH:mm`, 24 h.
- **Dependencias:** `TIME_PATTERN.test`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts)

#### Función `minutes` (L56–59)

- **Tipo:** función local del archivo
- **Firma:** `minutes(value: string): number` — [cash-control.policy.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts#L56)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `value.split(':').map`, `value.split`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `assertCutSchedule` (L66–89)

- **Tipo:** función exportada
- **Firma:** `assertCutSchedule(periodNumber: 1 \| 2, start: string, end: string, sibling?: { start: string; end: string } \| null): void` — [cash-control.policy.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts#L66)
- **Propósito / descripción:** Early, friendly validation of a cut's scheduled window — the SQL functions re-validate under the lock (`CASH_CUT_INVALID_SCHEDULE`/`_OVERLAP`). `sibling` is the other cut of the same day, when known.
- **Dependencias:** `isValidCutTime`, `minutes`, `cashControlError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_CUT_INVALID_SCHEDULE')`, `cashControlError('CASH_CUT_SCHEDULE_OVERLAP')`
- **Consumidores:** [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts)

#### Función `requireReason` (L92–98)

- **Tipo:** función exportada
- **Firma:** `requireReason(reason: string \| null \| undefined): string` — [cash-control.policy.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts#L92)
- **Propósito / descripción:** Mandatory reason for manual adjustments, authorized openings, voids and reopenings.
- **Dependencias:** `(reason ?? '').trim`, `cashControlError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `cashControlError('CASH_REASON_REQUIRED')`
- **Consumidores:** [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts), [cash-movement-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts)

#### Función `guatemalaIsoDate` (L101–111)

- **Tipo:** función exportada
- **Firma:** `guatemalaIsoDate(now?: Date): string` — [cash-control.policy.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts#L101)
- **Propósito / descripción:** `yyyy-MM-dd` of `now` in America/Guatemala — never the server's or browser's zone.
- **Dependencias:** `new Intl.DateTimeFormat`, `parts.find`, `get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts), [register-cash-bank-deposit.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts)

#### Función `guatemalaTime` (L114–121)

- **Tipo:** función exportada
- **Firma:** `guatemalaTime(instant: Date): string` — [cash-control.policy.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts#L114)
- **Propósito / descripción:** `HH:mm` of an instant in America/Guatemala.
- **Dependencias:** `new Intl.DateTimeFormat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts)

<a id="f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts"></a>

### cash-control.repository.ts

- **Ruta:** [cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts) (`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts`, 422 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Control de Efectivo — persistence port.
- **Descripción del autor (comentario del archivo):** Control de Efectivo — persistence port. The physical cash balance has ONE official source: the `cash_movements` Kardex (`cash_balance()` in SQL). Every write goes through the SQL functions of migration `CreateCashControlKardexAndCuts` (advisory lock + atomic transaction); nothing in TypeScript computes or stores a balance.
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [cash-control.use-cases.spec.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-control-use-cases-spec-ts), [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts), [cash-cut-queries.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-queries-use-cases-ts), [cash-movement-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts), [cash-movement-queries.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts), [get-cash-position.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-get-cash-position-use-case-ts), [register-cash-bank-deposit.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts), [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts), [typeorm-cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-control-repository-ts), [cash-control.request.dto.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-dtos-cash-control-request-dto-ts)

**Interfaces, tipos y enums:**

- `interface CashMovementRow` (L58): One Kardex row. `previousBalance`/`newBalance` are the official balances before/after it. — miembros: `id`, `sequence`, `operationalDate`, `operationalDayId`, `cutPeriodId`, `cutPeriodNumber`, `movementType`, `originalMovementType`, `direction`, `amount`, `previousBalance`, `newBalance`, `referenceType`, `referenceId`, `description`, `bankName`, `reason`, `reversalOfId`, `status`, `voidedAt`, `voidedByUsername`, `voidReason`, `createdBy`, `createdByUsername`, `createdAt`…
- `interface CashBalanceSnapshot` (L89): sin documentación — miembros: `balance`, `lastSequence`, `lastMovementAt`
- `interface CashMovementBucket` (L95): sin documentación — miembros: `movementType`, `totalIn`, `totalOut`, `count`
- `interface CashRangeTotals` (L102): sin documentación — miembros: `totalIn`, `totalOut`, `movementCount`
- `interface CashDateSummary` (L108) extends CashRangeTotals: sin documentación — miembros: `openingBalance`, `buckets`
- `interface CashBankDaySummary` (L122) extends CashDateSummary: Daily indicators of ONE bank operational day (Agentes Bancarios → "Aperturar día"). — miembros: `businessDate`, `dayOpeningId`, `agentDayStatus`, `startSequence`, `endSequence`, `isCurrent`, `openedAt`, `openedByUsername`, `source`, `closingBalance`, `lastMovementAt`
- `interface CashOperationalDayRow` (L139): sin documentación — miembros: `id`, `operationalDate`, `status`, `openingPolicy`, `previousDayId`, `previousCutId`, `previousClosingPhysicalCash`, `previousClosingSystemCash`, `inheritedDifference`, `openingSequence`, `openingSystemCash`, `openingPhysicalCash`, `openingReason`, `openedBy`, `openedByUsername`, `openedAt`, `closingSystemCash`, `closingPhysicalCash`, `closingDifference`, `totalIn`, `totalOut`, `movementCount`, `closingObservations`, `closedByUsername`, `closedAt`
- `interface CashBankBalance` (L167): sin documentación — miembros: `bankId`, `bankName`, `accountNumber`, `specialAccount`, `balance`
- `interface CashCutPeriodRow` (L175): sin documentación — miembros: `id`, `operationalDayId`, `operationalDate`, `periodNumber`, `status`, `scheduledStartAt`, `scheduledEndAt`, `actualStartedAt`, `actualFinishedAt`, `startSequence`, `closingSequence`, `openingSystemCash`, `openingPhysicalCash`, `inheritedDifference`, `closingSystemCash`, `closingPhysicalCash`, `cashDifference`, `totalIn`, `totalOut`, `movementCount`, `openingBankBalances`, `openedByUsername`, `closedByUsername`, `observations`, `reopenedCount`…
- `interface CashCountDetailRow` (L206): sin documentación — miembros: `denomination`, `quantity`, `subtotal`
- `interface CashCountRow` (L212): sin documentación — miembros: `id`, `totalCounted`, `systemCash`, `difference`, `observations`, `isCurrent`, `createdByUsername`, `createdAt`, `details`
- `interface CashBankReconciliationRow` (L224): sin documentación — miembros: `id`, `countId`, `bankId`, `bankName`, `systemBalance`, `verifiedBalance`, `difference`, `observations`, `createdAt`
- `interface CashCutEventRow` (L236): sin documentación — miembros: `id`, `action`, `reason`, `performedByUsername`, `performedAt`
- `interface CashScheduleChangeRow` (L244): sin documentación — miembros: `id`, `previousStartAt`, `previousEndAt`, `newStartAt`, `newEndAt`, `reason`, `changedByUsername`, `changedAt`
- `interface CashCutDetail` (L255): sin documentación — miembros: `period`, `day`, `counts`, `bankReconciliations`, `events`, `scheduleChanges`, `movements`
- `interface CashDayHistoryRow` (L265): sin documentación — miembros: `day`, `periods`
- `interface FindCashMovementsOptions` (L270): sin documentación — miembros: `dateFrom`, `dateTo`, `movementType`, `direction`, `userId`, `cutPeriodId`, `bankDate`, `page`, `limit`
- `interface PaginatedCashMovements` (L283): sin documentación — miembros: `items`, `total`, `page`, `limit`, `totalIn`, `totalOut`
- `interface FindCashDaysOptions` (L292): sin documentación — miembros: `dateFrom`, `dateTo`, `periodNumber`, `status`, `userId`, `page`, `limit`
- `interface PaginatedCashDays` (L302): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface CashUserOption` (L309): sin documentación — miembros: `id`, `username`
- `interface RegisterManualCashMovementData` (L314): sin documentación — miembros: `movementType`, `amount`, `description`, `reason`, `idempotencyKey`, `userId`
- `interface OpenCashDayData` (L324): sin documentación — miembros: `date`, `userId`, `manualPhysicalCash`, `reason`, `firstStart`, `firstEnd`, `secondStart`, `secondEnd`
- `interface RegisterCashBankDepositData` (L335): sin documentación — miembros: `bankId`, `amount`, `details`, `description`, `idempotencyKey`, `userId`
- `interface CashDenominationData` (L344): sin documentación — miembros: `denomination`, `quantity`
- `interface CashBankVerificationData` (L349): sin documentación — miembros: `bankId`, `verifiedBalance`, `observations`
- `interface FinishCashCutData` (L355): sin documentación — miembros: `periodId`, `userId`, `details`, `banks`, `cashObservations`, `observations`
- `interface CashControlRepository` (L364): sin documentación — miembros: `getBalance`, `getWarehouseBalance`, `getDateSummary`, `getBankDaySummary`, `findBankDays`, `getRangeTotals`, `hasInitialBalance`, `findMovements`, `findRecentMovements`, `findMovementById`, `findMovementsByReference`, `findUsers`, `registerManualMovement`, `voidManualMovement`, `registerBankDeposit`, `findDayByDate`, `findDayById`, `findPeriodsByDay`, `findOpenPeriod`, `findPeriodById`, `getBankBalances`, `openDay`, `updateSchedule`, `startPeriod`, `finishPeriod`…
- `type CashDirection` (L11) = `(typeof CASH_DIRECTIONS)[number]`
- `type CashMovementType` (L37) = `(typeof CASH_MOVEMENT_TYPES)[number]`
- `type ManualCashMovementType` (L46) = `(typeof MANUAL_CASH_MOVEMENT_TYPES)[number]`
- `type CashCutStatus` (L49) = `'PROGRAMADO' \| 'ABIERTO' \| 'FINALIZADO'`
- `type CashDayStatus` (L50) = `'ABIERTO' \| 'CERRADO'`
- `type CashOpeningPolicy` (L51) = `\| 'INHERITED_FROM_CLOSE' \| 'INHERITED_FROM_LAST_CUT' \| 'AUTHORIZED_MANUAL' \| 'SYSTEM_UNVERIFIED'`

**Constantes exportadas:**

- `CASH_CONTROL_REPOSITORY` (L8): Control de Efectivo — persistence port. = `Symbol('CASH_CONTROL_REPOSITORY')`
- `CASH_DIRECTIONS` (L10) = `['IN', 'OUT', 'NONE'] as const`
- `CASH_MOVEMENT_TYPES` (L13) = `[ 'DEPOSITO', 'RETIRO', 'DESEMBOLSO_GENESIS', 'PAGO_GENESIS', 'REINTEGRO', 'OTRA_TRANSACCION', 'GASTO_POR_COBR`
- `MANUAL_CASH_MOVEMENT_TYPES` (L40): Movements registered directly in Control de Efectivo (all others are born in their own module). = `[ 'ENTRADA_MANUAL', 'SALIDA_MANUAL', 'AJUSTE', 'SALDO_INICIAL', ] as const`
<a id="f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-custody-repository-ts"></a>

### cash-custody.repository.ts

- **Ruta:** [cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-custody.repository.ts) (`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-custody.repository.ts`, 272 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Port of "Arqueo de Caja" and "Entrega de Efectivo a Bodega".
- **Descripción del autor (comentario del archivo):** Port of "Arqueo de Caja" and "Entrega de Efectivo a Bodega". Caja balance = the cash Kardex; Bodega balance = its own Kardex; every write is one call to the PostgreSQL functions of migration 1760007400000 (locks, idempotency, RBAC, audit). Nothing here computes a balance.
- **Consumidores:** [cash-custody.use-cases.spec.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-spec-ts), [cash-custody.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts), [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts), [typeorm-cash-custody.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-custody-repository-ts), [cash-custody.request.dto.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-dtos-cash-custody-request-dto-ts)

**Interfaces, tipos y enums:**

- `interface CashCustodySnapshot` (L13): The three custody indicators. — miembros: `cashBalance`, `warehouseBalance`, `custodyTotal`, `warehouseHasInitialBalance`, `warehouseLastMovementAt`, `currentDay`, `deliveredToday`, `returnedToCashToday`, `depositedToBankToday`
- `interface WarehouseWithdrawalRow` (L35): "Retiro de Bodega": back to the caja or deposited into a bank account. — miembros: `id`, `referenceNumber`, `destination`, `amount`, `bankId`, `bankName`, `bankAccountNumber`, `deliveredBy`, `receivedBy`, `voucherReference`, `observations`, `hasBreakdown`, `businessDate`, `warehouseMovementId`, `warehouseMovementSequence`, `cashMovementId`, `cashMovementSequence`, `bankMovementId`, `status`, `voidedAt`, `voidedByUsername`, `voidReason`, `createdByUsername`, `createdAt`, `details`
- `interface RegisterWithdrawalData` (L63): sin documentación — miembros: `destination`, `amount`, `details`, `bankId`, `deliveredBy`, `receivedBy`, `voucherReference`, `observations`, `userId`, `idempotencyKey`
- `interface DenominationRow` (L76): sin documentación — miembros: `denomination`, `quantity`, `subtotal`
- `interface WarehouseTransferRow` (L82): sin documentación — miembros: `id`, `referenceNumber`, `amount`, `deliveredBy`, `receivedBy`, `voucherReference`, `observations`, `hasBreakdown`, `businessDate`, `cashMovementId`, `cashMovementSequence`, `warehouseMovementId`, `warehouseMovementSequence`, `status`, `voidedAt`, `voidedByUsername`, `voidReason`, `createdByUsername`, `createdAt`, `details`
- `interface WarehouseMovementRow` (L105): sin documentación — miembros: `id`, `sequence`, `businessDate`, `movementType`, `direction`, `amount`, `previousBalance`, `newBalance`, `referenceType`, `referenceId`, `transferReference`, `description`, `counterpart`, `reason`, `status`, `createdByUsername`, `createdAt`
- `interface CashCountRow` (L131): sin documentación — miembros: `id`, `number`, `businessDate`, `countedAt`, `systemCash`, `totalCounted`, `difference`, `result`, `warehouseBalance`, `warehouseCounted`, `warehouseDifference`, `custodyTheoretical`, `custodyCounted`, `custodyDifference`, `observations`, `status`, `replacesId`, `replacedById`, `correctionReason`, `createdByUsername`, `createdAt`, `details`
- `interface Paginated` (L158): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface FindCashCountsOptions` (L165): sin documentación — miembros: `dateFrom`, `dateTo`, `businessDate`, `userId`, `result`, `page`, `limit`
- `interface FindTransfersOptions` (L175): sin documentación — miembros: `dateFrom`, `dateTo`, `status`, `page`, `limit`
- `interface RegisterTransferData` (L183): sin documentación — miembros: `amount`, `details`, `deliveredBy`, `receivedBy`, `voucherReference`, `observations`, `userId`, `idempotencyKey`
- `interface RegisterCashCountData` (L194): sin documentación — miembros: `details`, `observations`, `warehouseCounted`, `userId`, `idempotencyKey`, `replacesId`, `correctionReason`
- `interface LatestCashCountCandidate` (L212): One individual cash count record — the arqueo of ONE cut (`cash_cut_counts`) or one standalone Arqueo de Caja (`cash_counts`). — miembros: `source`, `id`, `number`, `cutPeriodId`, `cutNumber`, `businessDate`, `countedAt`, `totalCounted`, `createdByUsername`, `details`
- `interface LatestCashCountLookup` (L229): Result of looking up the most recent valid individual count. — miembros: `count`, `referenceBusinessDate`
- `interface CashCustodyRepository` (L235): sin documentación — miembros: `getCustody`, `registerTransfer`, `voidTransfer`, `findTransfers`, `findTransferById`, `registerWarehouseInitialBalance`, `findWarehouseMovements`, `registerWithdrawal`, `voidWithdrawal`, `findWithdrawals`, `findWithdrawalById`, `registerCount`, `findCounts`, `findCountById`, `findLatestValidCount`
- `type CashCountResult` (L10) = `(typeof CASH_COUNT_RESULTS)[number]`
- `type WarehouseWithdrawalDestination` (L31) = `(typeof WAREHOUSE_WITHDRAWAL_DESTINATIONS)[number]`
- `type LatestCashCountSourceKind` (L205) = `'CORTE_CAJA' \| 'ARQUEO_CAJA'` — Which kind of individual cash count a Cuadre de Agentes breakdown can be loaded from.

**Constantes exportadas:**

- `CASH_CUSTODY_REPOSITORY` (L7): Port of "Arqueo de Caja" and "Entrega de Efectivo a Bodega". = `Symbol('CASH_CUSTODY_REPOSITORY')`
- `CASH_COUNT_RESULTS` (L9) = `['CUADRADO', 'FALTANTE', 'SOBRANTE'] as const`
- `WAREHOUSE_WITHDRAWAL_DESTINATIONS` (L30) = `['CAJA', 'BANCO'] as const`
<a id="f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-control-repository-ts"></a>

### typeorm-cash-control.repository.ts

- **Ruta:** [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts) (`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts`, 869 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Raw-SQL adapter over the Control de Efectivo functions/tables.
- **Depende de (archivos del proyecto):** [cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts), [cash-control.errors.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-errors-cash-control-errors-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts)

**Interfaces, tipos y enums:**

- `type SqlRow` (L33) = `Record<string, unknown>`

#### Clase `TypeOrmCashControlRepository` (L233–868)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements CashControlRepository
- **Propósito:** Raw-SQL adapter over the Control de Efectivo functions/tables. Reads are plain SELECTs; every write is ONE call to a SQL function that takes the `cash_control_main` advisory lock and validates under it, so the balance can never be computed from stale data. SQL `RAISE`s are translated to domain errors via `cashControlErrorFromMessage`.
- **Dependencias inyectadas (constructor):** `@InjectDataSource() dataSource: DataSource`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `write` | método private async | 237–252 | `sql: string`, `params: unknown[]` | `Promise<T>` |
| `getBalance` | método public async | 254–263 | — | `Promise<CashBalanceSnapshot>` |
| `getWarehouseBalance` | método public async | 265–270 | — | `Promise<number>` |
| `getDateSummary` | método public async | 272–299 | `date: string` | `Promise<CashDateSummary>` |
| `getBankDaySummary` | método public async | 301–304 | `date?: string` | `Promise<CashBankDaySummary \| null>` |
| `findBankDays` | método public | 306–308 | `limit: number` | `Promise<CashBankDaySummary[]>` |
| `loadBankDays` | método private async | 315–380 | `date: string \| null`, `limit: number`, `all?` | `Promise<CashBankDaySummary[]>` |
| `getRangeTotals` | método public async | 382–399 | `afterSequence: number`, `upToSequence: number \| null` | `Promise<CashRangeTotals>` |
| `hasInitialBalance` | método public async | 401–406 | — | `Promise<boolean>` |
| `findMovements` | método public async | 408–453 | `options: FindCashMovementsOptions` | `Promise<PaginatedCashMovements>` |
| `findRecentMovements` | método public async | 455–461 | `limit: number` | `Promise<CashMovementRow[]>` |
| `findMovementById` | método public async | 463–484 | `id: string` | `Promise<CashMovementRow \| null>` |
| `registerBankDeposit` | método public async | 486–501 | `data: RegisterCashBankDepositData` | `Promise<string>` |
| `findMovementsByReference` | método public async | 503–513 | `referenceType: string`, `referenceId: string` | `Promise<CashMovementRow[]>` |
| `findUsers` | método public async | 515–530 | — | `Promise<CashUserOption[]>` |
| `registerManualMovement` | método public async | 532–547 | `data: RegisterManualCashMovementData` | `Promise<string>` |
| `voidManualMovement` | método public async | 549–559 | `id: string`, `userId: string`, `reason: string` | `Promise<string>` |
| `findDayByDate` | método public async | 561–567 | `date: string` | `Promise<CashOperationalDayRow \| null>` |
| `findDayById` | método public async | 569–575 | `id: string` | `Promise<CashOperationalDayRow \| null>` |
| `findPeriodsByDay` | método public async | 577–583 | `dayId: string` | `Promise<CashCutPeriodRow[]>` |
| `findOpenPeriod` | método public async | 585–590 | — | `Promise<CashCutPeriodRow \| null>` |
| `findPeriodById` | método public async | 592–598 | `id: string` | `Promise<CashCutPeriodRow \| null>` |
| `getBankBalances` | método public async | 600–605 | — | `Promise<CashBankBalance[]>` |
| `openDay` | método public async | 607–622 | `data: OpenCashDayData` | `Promise<string>` |
| `updateSchedule` | método public async | 624–635 | `periodId: string`, `start: string`, `end: string`, `reason: string`, `userId: string` | `Promise<void>` |
| `startPeriod` | método public async | 637–642 | `periodId: string`, `userId: string` | `Promise<void>` |
| `finishPeriod` | método public async | 644–656 | `data: FinishCashCutData` | `Promise<void>` |
| `reopenPeriod` | método public async | 658–668 | `periodId: string`, `userId: string`, `reason: string` | `Promise<void>` |
| `closeDay` | método public async | 670–680 | `dayId: string`, `userId: string`, `observations: string \| null` | `Promise<void>` |
| `findDays` | método public async | 682–754 | `options: FindCashDaysOptions` | `Promise<PaginatedCashDays>` |
| `findCutDetail` | método public async | 756–867 | `periodId: string` | `Promise<CashCutDetail \| null>` |

##### `TypeOrmCashControlRepository.write`

- **Firma:** `write(sql: string, params: unknown[]): Promise<T>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L237) (L237–252)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `cashControlErrorFromMessage`, `bankMovementErrorFromMessage`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `mapped`, `error`
- **Consumidores:** (mismo archivo)

##### `TypeOrmCashControlRepository.getBalance`

- **Firma:** `getBalance(): Promise<CashBalanceSnapshot>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L254) (L254–263)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `num`
- **Efectos secundarios:** Tablas en su SQL: `cash_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.getWarehouseBalance`

- **Firma:** `getWarehouseBalance(): Promise<number>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L265) (L265–270)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `num`
- **Efectos secundarios:** Llama funciones SQL: `warehouse_cash_balance`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.getDateSummary`

- **Firma:** `getDateSummary(date: string): Promise<CashDateSummary>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L272) (L272–299)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `buckets.map`, `num`, `mapped.reduce`
- **Efectos secundarios:** Llama funciones SQL: `cash_balance_at`; Tablas en su SQL: `cash_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.getBankDaySummary`

- **Firma:** `getBankDaySummary(date?: string): Promise<CashBankDaySummary \| null>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L301) (L301–304)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadBankDays`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.findBankDays`

- **Firma:** `findBankDays(limit: number): Promise<CashBankDaySummary[]>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L306) (L306–308)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadBankDays`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.loadBankDays`

- **Firma:** `loadBankDays(date: string \| null, limit: number, all?): Promise<CashBankDaySummary[]>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L315) (L315–380)
- **Propósito / descripción:** Bank days with their indicators, computed from the Kardex range of each day (`cash_bank_day_ranges`). With `date` = that day; without it = the current day (or the latest `limit` days when `all`).
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `days.map`, `text`, `buckets.filter((bucket) => text(bucket.range_id) === text(day.id)).map`, `buckets.filter`, `num`, `mine.reduce`
- **Efectos secundarios:** Tablas en su SQL: `cash_movements`, `cash_bank_day_ranges`, `day_openings`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmCashControlRepository.getRangeTotals`

- **Firma:** `getRangeTotals(afterSequence: number, upToSequence: number \| null): Promise<CashRangeTotals>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L382) (L382–399)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `num`
- **Efectos secundarios:** Tablas en su SQL: `cash_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.hasInitialBalance`

- **Firma:** `hasInitialBalance(): Promise<boolean>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L401) (L401–406)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `Boolean`
- **Efectos secundarios:** Tablas en su SQL: `cash_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.findMovements`

- **Firma:** `findMovements(options: FindCashMovementsOptions): Promise<PaginatedCashMovements>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L408) (L408–453)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `params.push`, `where.push`, `clause.replace`, `add`, `where.join`, `this.dataSource.query`, `rows.map`, `num`
- **Efectos secundarios:** Tablas en su SQL: `cash_bank_day_ranges`, `cash_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.findRecentMovements`

- **Firma:** `findRecentMovements(limit: number): Promise<CashMovementRow[]>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L455) (L455–461)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `rows.map`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.findMovementById`

- **Firma:** `findMovementById(id: string): Promise<CashMovementRow \| null>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L463) (L463–484)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `toMovement`, `details.map`, `num`
- **Efectos secundarios:** Tablas en su SQL: `cash_movement_details`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.registerBankDeposit`

- **Firma:** `registerBankDeposit(data: RegisterCashBankDepositData): Promise<string>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L486) (L486–501)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`, `JSON.stringify`, `text`
- **Efectos secundarios:** Llama funciones SQL: `register_cash_bank_deposit`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.findMovementsByReference`

- **Firma:** `findMovementsByReference(referenceType: string, referenceId: string): Promise<CashMovementRow[]>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L503) (L503–513)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `rows.map`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.findUsers`

- **Firma:** `findUsers(): Promise<CashUserOption[]>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L515) (L515–530)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `rows.map`, `text`
- **Efectos secundarios:** Tablas en su SQL: `users`, `cash_movements`, `cash_cut_periods`, `cash_operational_days`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.registerManualMovement`

- **Firma:** `registerManualMovement(data: RegisterManualCashMovementData): Promise<string>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L532) (L532–547)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`, `text`
- **Efectos secundarios:** Llama funciones SQL: `register_manual_cash_movement`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.voidManualMovement`

- **Firma:** `voidManualMovement(id: string, userId: string, reason: string): Promise<string>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L549) (L549–559)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`, `text`
- **Efectos secundarios:** Llama funciones SQL: `void_manual_cash_movement`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.findDayByDate`

- **Firma:** `findDayByDate(date: string): Promise<CashOperationalDayRow \| null>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L561) (L561–567)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `toDay`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.findDayById`

- **Firma:** `findDayById(id: string): Promise<CashOperationalDayRow \| null>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L569) (L569–575)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `toDay`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmCashControlRepository.findPeriodsByDay`

- **Firma:** `findPeriodsByDay(dayId: string): Promise<CashCutPeriodRow[]>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L577) (L577–583)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `rows.map`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.findOpenPeriod`

- **Firma:** `findOpenPeriod(): Promise<CashCutPeriodRow \| null>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L585) (L585–590)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `toPeriod`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.findPeriodById`

- **Firma:** `findPeriodById(id: string): Promise<CashCutPeriodRow \| null>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L592) (L592–598)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `toPeriod`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmCashControlRepository.getBankBalances`

- **Firma:** `getBankBalances(): Promise<CashBankBalance[]>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L600) (L600–605)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `toBankBalances`
- **Efectos secundarios:** Llama funciones SQL: `cash_bank_balances_snapshot`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.openDay`

- **Firma:** `openDay(data: OpenCashDayData): Promise<string>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L607) (L607–622)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`, `text`
- **Efectos secundarios:** Llama funciones SQL: `open_cash_operational_day`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.updateSchedule`

- **Firma:** `updateSchedule(periodId: string, start: string, end: string, reason: string, userId: string): Promise<void>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L624) (L624–635)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`
- **Efectos secundarios:** Llama funciones SQL: `update_cash_cut_schedule`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.startPeriod`

- **Firma:** `startPeriod(periodId: string, userId: string): Promise<void>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L637) (L637–642)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`
- **Efectos secundarios:** Llama funciones SQL: `start_cash_cut_period`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.finishPeriod`

- **Firma:** `finishPeriod(data: FinishCashCutData): Promise<void>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L644) (L644–656)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`, `JSON.stringify`
- **Efectos secundarios:** Llama funciones SQL: `finish_cash_cut_period`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.reopenPeriod`

- **Firma:** `reopenPeriod(periodId: string, userId: string, reason: string): Promise<void>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L658) (L658–668)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`
- **Efectos secundarios:** Llama funciones SQL: `reopen_cash_cut_period`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.closeDay`

- **Firma:** `closeDay(dayId: string, userId: string, observations: string \| null): Promise<void>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L670) (L670–680)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`
- **Efectos secundarios:** Llama funciones SQL: `close_cash_operational_day`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.findDays`

- **Firma:** `findDays(options: FindCashDaysOptions): Promise<PaginatedCashDays>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L682) (L682–754)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `params.push`, `where.push`, `clause.replace`, `add`, `clauses.push`, `clauses.join`, `where.join`, `this.dataSource.query`, `dayRows.map`, `days.map`, `periodRows.map`, `periods.filter`, `num`
- **Efectos secundarios:** Tablas en su SQL: `cash_cut_periods`, `cash_operational_days`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashControlRepository.findCutDetail`

- **Firma:** `findCutDetail(periodId: string): Promise<CashCutDetail \| null>` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L756) (L756–867)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.findPeriodById`, `this.findDayById`, `this.dataSource.query`, `countRows.map`, `text`, `num`, `str`, `Boolean`, `detailRows.filter((detail) => detail.count_id === row.id).map`, `detailRows.filter`, `bankRows.map`, `eventRows.map`, `scheduleRows.map`
- **Efectos secundarios:** Tablas en su SQL: `cash_cut_counts`, `users`, `cash_cut_count_details`, `cash_cut_bank_reconciliations`, `cash_cut_events`, `cash_cut_schedule_changes`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

#### Función `text` (L36–54)

- **Tipo:** función local del archivo
- **Firma:** `text(value: unknown): string` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L36)
- **Propósito / descripción:** Text of a SQL scalar (strings, numbers, booleans, dates); '' for null.
- **Dependencias:** `value.toString`, `value.toISOString`, `JSON.stringify`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `num` (L56–58)

- **Tipo:** función local del archivo
- **Firma:** `num(value: unknown): number` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L56)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `numOrNull` (L60–62)

- **Tipo:** función local del archivo
- **Firma:** `numOrNull(value: unknown): number \| null` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L60)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `str` (L64–66)

- **Tipo:** función local del archivo
- **Firma:** `str(value: unknown): string \| null` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L64)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `text`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toMovement` (L84–113)

- **Tipo:** función local del archivo
- **Firma:** `toMovement(row: SqlRow): CashMovementRow` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L84)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `text`, `num`, `str`, `numOrNull`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toDay` (L129–157)

- **Tipo:** función local del archivo
- **Firma:** `toDay(row: SqlRow): CashOperationalDayRow` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L129)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `text`, `str`, `numOrNull`, `num`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toBankBalances` (L181–192)

- **Tipo:** función local del archivo
- **Firma:** `toBankBalances(value: unknown): CashBankBalance[] \| null` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L181)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Array.isArray`, `(value as SqlRow[]).map`, `text`, `str`, `num`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toPeriod` (L194–224)

- **Tipo:** función local del archivo
- **Firma:** `toPeriod(row: SqlRow): CashCutPeriodRow` — [typeorm-cash-control.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts#L194)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `text`, `num`, `numOrNull`, `toBankBalances`, `str`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-custody-repository-ts"></a>

### typeorm-cash-custody.repository.ts

- **Ruta:** [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts) (`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts`, 562 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Raw-SQL adapter of the custody port: reads are plain SELECTs; writes call `register_cash_warehouse_transfer`, `void_cash_warehouse_transfer`, `register_warehouse_initial_balance` and `register_cash_count`, whose `RAISE EXCEPTION` codes are mapped to the cash-control domain errors.
- **Depende de (archivos del proyecto):** [cash-custody.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-custody-repository-ts), [cash-control.errors.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-errors-cash-control-errors-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts)

**Interfaces, tipos y enums:**

- `type SqlRow` (L25) = `Record<string, unknown>`

#### Clase `TypeOrmCashCustodyRepository` (L108–561)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements CashCustodyRepository
- **Propósito:** Raw-SQL adapter of the custody port: reads are plain SELECTs; writes call `register_cash_warehouse_transfer`, `void_cash_warehouse_transfer`, `register_warehouse_initial_balance` and `register_cash_count`, whose `RAISE EXCEPTION` codes are mapped to the cash-control domain errors.
- **Dependencias inyectadas (constructor):** `@InjectDataSource() dataSource: DataSource`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getCustody` | método public async | 112–145 | — | `Promise<CashCustodySnapshot>` |
| `registerTransfer` | método public async | 147–162 | `data: RegisterTransferData` | `Promise<string>` |
| `voidTransfer` | método public async | 164–174 | `id: string`, `userId: string`, `reason: string` | `Promise<string>` |
| `findTransfers` | método public async | 176–209 | `options: FindTransfersOptions` | `Promise<Paginated<WarehouseTransferRow>>` |
| `findTransferById` | método public async | 211–217 | `id: string` | `Promise<WarehouseTransferRow \| null>` |
| `registerWarehouseInitialBalance` | método public async | 219–230 | `amount: number`, `userId: string`, `reason: string`, `idempotencyKey: string` | `Promise<string>` |
| `findWarehouseMovements` | método public async | 232–275 | `page: number`, `limit: number` | `Promise<Paginated<WarehouseMovementRow>>` |
| `registerWithdrawal` | método public async | 277–294 | `data: RegisterWithdrawalData` | `Promise<string>` |
| `voidWithdrawal` | método public async | 296–306 | `id: string`, `userId: string`, `reason: string` | `Promise<string>` |
| `findWithdrawals` | método public async | 308–341 | `options: FindTransfersOptions` | `Promise<Paginated<WarehouseWithdrawalRow>>` |
| `findWithdrawalById` | método public async | 343–349 | `id: string` | `Promise<WarehouseWithdrawalRow \| null>` |
| `toWithdrawal` | método private | 351–381 | `row: SqlRow` | `WarehouseWithdrawalRow` |
| `registerCount` | método public async | 383–397 | `data: RegisterCashCountData` | `Promise<string>` |
| `findCounts` | método public async | 399–438 | `options: FindCashCountsOptions` | `Promise<Paginated<CashCountRow>>` |
| `findCountById` | método public async | 440–446 | `id: string` | `Promise<CashCountRow \| null>` |
| `findLatestValidCount` | método public async | 448–480 | `preferredBusinessDate: string \| null` | `Promise<LatestCashCountLookup>` |
| `toTransfer` | método private | 482–505 | `row: SqlRow` | `WarehouseTransferRow` |
| `toCount` | método private | 507–543 | `row: SqlRow` | `CashCountRow` |
| `write` | método private async | 545–560 | `sql: string`, `params: unknown[]` | `Promise<T>` |

##### `TypeOrmCashCustodyRepository.getCustody`

- **Firma:** `getCustody(): Promise<CashCustodySnapshot>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L112) (L112–145)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `num`, `Math.round`, `text`
- **Efectos secundarios:** Llama funciones SQL: `cash_balance`, `cash_current_bank_day`; Tablas en su SQL: `warehouse_cash_movements`, `warehouse_cash_withdrawals`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.registerTransfer`

- **Firma:** `registerTransfer(data: RegisterTransferData): Promise<string>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L147) (L147–162)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`, `JSON.stringify`, `text`
- **Efectos secundarios:** Llama funciones SQL: `register_cash_warehouse_transfer`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.voidTransfer`

- **Firma:** `voidTransfer(id: string, userId: string, reason: string): Promise<string>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L164) (L164–174)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`, `text`
- **Efectos secundarios:** Llama funciones SQL: `void_cash_warehouse_transfer`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.findTransfers`

- **Firma:** `findTransfers(options: FindTransfersOptions): Promise<Paginated<WarehouseTransferRow>>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L176) (L176–209)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `params.push`, `where.push`, `where.join`, `this.dataSource.query`, `rows.map`, `this.toTransfer`, `num`
- **Efectos secundarios:** Tablas en su SQL: `cash_warehouse_transfers`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.findTransferById`

- **Firma:** `findTransferById(id: string): Promise<WarehouseTransferRow \| null>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L211) (L211–217)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `this.toTransfer`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.registerWarehouseInitialBalance`

- **Firma:** `registerWarehouseInitialBalance(amount: number, userId: string, reason: string, idempotencyKey: string): Promise<string>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L219) (L219–230)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`, `text`
- **Efectos secundarios:** Llama funciones SQL: `register_warehouse_initial_balance`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.findWarehouseMovements`

- **Firma:** `findWarehouseMovements(page: number, limit: number): Promise<Paginated<WarehouseMovementRow>>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L232) (L232–275)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `rows.map`, `text`, `num`, `textOrNull`
- **Efectos secundarios:** Tablas en su SQL: `warehouse_cash_movements`, `users`, `cash_warehouse_transfers`, `warehouse_cash_withdrawals`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.registerWithdrawal`

- **Firma:** `registerWithdrawal(data: RegisterWithdrawalData): Promise<string>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L277) (L277–294)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`, `JSON.stringify`, `text`
- **Efectos secundarios:** Llama funciones SQL: `register_warehouse_withdrawal`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.voidWithdrawal`

- **Firma:** `voidWithdrawal(id: string, userId: string, reason: string): Promise<string>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L296) (L296–306)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`, `text`
- **Efectos secundarios:** Llama funciones SQL: `void_warehouse_withdrawal`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.findWithdrawals`

- **Firma:** `findWithdrawals(options: FindTransfersOptions): Promise<Paginated<WarehouseWithdrawalRow>>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L308) (L308–341)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `params.push`, `where.push`, `where.join`, `this.dataSource.query`, `rows.map`, `this.toWithdrawal`, `num`
- **Efectos secundarios:** Tablas en su SQL: `warehouse_cash_withdrawals`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.findWithdrawalById`

- **Firma:** `findWithdrawalById(id: string): Promise<WarehouseWithdrawalRow \| null>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L343) (L343–349)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `this.toWithdrawal`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.toWithdrawal`

- **Firma:** `toWithdrawal(row: SqlRow): WarehouseWithdrawalRow` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L351) (L351–381)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `text`, `num`, `textOrNull`, `numOrNull`, `toDetails`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmCashCustodyRepository.registerCount`

- **Firma:** `registerCount(data: RegisterCashCountData): Promise<string>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L383) (L383–397)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`, `JSON.stringify`, `text`
- **Efectos secundarios:** Llama funciones SQL: `register_cash_count`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.findCounts`

- **Firma:** `findCounts(options: FindCashCountsOptions): Promise<Paginated<CashCountRow>>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L399) (L399–438)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `params.push`, `where.push`, `clause.replace`, `add`, `where.join`, `this.dataSource.query`, `rows.map`, `this.toCount`, `num`
- **Efectos secundarios:** Tablas en su SQL: `cash_counts`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.findCountById`

- **Firma:** `findCountById(id: string): Promise<CashCountRow \| null>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L440) (L440–446)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `this.toCount`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.findLatestValidCount`

- **Firma:** `findLatestValidCount(preferredBusinessDate: string \| null): Promise<LatestCashCountLookup>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L448) (L448–480)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `textOrNull`, `text`, `numOrNull`, `num`, `toDetails`
- **Efectos secundarios:** Llama funciones SQL: `cash_current_bank_day`, `cash_latest_count_candidate`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCashCustodyRepository.toTransfer`

- **Firma:** `toTransfer(row: SqlRow): WarehouseTransferRow` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L482) (L482–505)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `text`, `num`, `textOrNull`, `toDetails`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmCashCustodyRepository.toCount`

- **Firma:** `toCount(row: SqlRow): CashCountRow` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L507) (L507–543)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `num`, `numOrNull`, `Math.round`, `text`, `textOrNull`, `toDetails`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmCashCustodyRepository.write`

- **Firma:** `write(sql: string, params: unknown[]): Promise<T>` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L545) (L545–560)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `cashControlErrorFromMessage`, `bankMovementErrorFromMessage`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `mapped`, `error`
- **Consumidores:** (mismo archivo)

#### Función `text` (L27–42)

- **Tipo:** función local del archivo
- **Firma:** `text(value: unknown): string` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L27)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `value.toISOString`, `value.toString`, `JSON.stringify`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `textOrNull` (L44–46)

- **Tipo:** función local del archivo
- **Firma:** `textOrNull(value: unknown): string \| null` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L44)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `text`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `num` (L48–50)

- **Tipo:** función local del archivo
- **Firma:** `num(value: unknown): number` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L48)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `numOrNull` (L52–54)

- **Tipo:** función local del archivo
- **Firma:** `numOrNull(value: unknown): number \| null` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L52)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toDetails` (L56–62)

- **Tipo:** función local del archivo
- **Firma:** `toDetails(value: unknown): DenominationRow[]` — [typeorm-cash-custody.repository.ts](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts#L56)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `((value as SqlRow[] \| null) ?? []).map`, `num`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts"></a>

### cash-control.controller.ts

- **Ruta:** [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts) (`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts`, 301 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Finance → Control de Efectivo (`/cash-control`).
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-cash-position.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-get-cash-position-use-case-ts), [register-cash-bank-deposit.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts), [cash-movement-queries.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-queries-use-cases-ts), [cash-movement-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-movement-commands-use-cases-ts), [cash-cut-commands.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-commands-use-cases-ts), [cash-cut-queries.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-cut-queries-use-cases-ts), [cash-control.request.dto.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-dtos-cash-control-request-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts)

#### Clase `CashControlController` (L73–300)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('cash-control')`
- **Propósito:** Finance → Control de Efectivo (`/cash-control`). Every route requires a valid JWT. Policy: - Reading the balance, Kardex, recent movements and cut history: any authenticated account (the cash balance is shown in Transaccionar). - Opening the day, scheduling/starting/finishing cuts, closing the day and manual entradas/salidas: SUPER_ADMIN, ADMIN, SUPERVISOR_DE_TURNO. - Adjustments, initial balance, voids, reopening a cut and authorizing a manual opening amount: SUPER_ADMIN, ADMIN. The use cases re-check the role (defense in depth); the balance itself is never accepted from the client.
- **Dependencias inyectadas (constructor):** `getPositionUseCase: GetCashPositionUseCase`, `getBalanceUseCase: GetCashBalanceUseCase`, `listMovementsUseCase: ListCashMovementsUseCase`, `listBankDaysUseCase: ListCashBankDaysUseCase`, `getBankDayUseCase: GetCashBankDayUseCase`, `getRecentUseCase: GetRecentCashMovementsUseCase`, `getMovementUseCase: GetCashMovementUseCase`, `listUsersUseCase: ListCashUsersUseCase`, `getBankBalancesUseCase: GetCashBankBalancesUseCase`, `registerMovementUseCase: RegisterCashMovementUseCase`, `voidMovementUseCase: VoidCashMovementUseCase`, `openDayUseCase: OpenCashDayUseCase`, `updateScheduleUseCase: UpdateCashCutScheduleUseCase`, `startCutUseCase: StartCashCutUseCase`, `finishCutUseCase: FinishCashCutUseCase`, `reopenCutUseCase: ReopenCashCutUseCase`, `closeDayUseCase: CloseCashDayUseCase`, `listDaysUseCase: ListCashDaysUseCase`, `registerBankDepositUseCase: RegisterCashBankDepositUseCase`, `getCutDetailUseCase: GetCashCutDetailUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `position` | método public | 99–102 | — | (inferido) |
| `balance` | método public | 104–107 | — | (inferido) |
| `movements` | método public | 109–112 | `query: CashMovementsQueryDto` | (inferido) |
| `bankDays` | método public | 115–118 | `query: CashBankDaysQueryDto` | (inferido) |
| `bankDay` | método public | 121–124 | `date: string` | (inferido) |
| `recent` | método public | 126–129 | `query: RecentCashMovementsQueryDto` | (inferido) |
| `movement` | método public | 131–134 | `id: string` | (inferido) |
| `users` | método public | 136–139 | — | (inferido) |
| `bankBalances` | método public | 141–144 | — | (inferido) |
| `registerMovement` | método public | 146–159 | `dto: RegisterCashMovementRequestDto`, `user: RequestUser` | (inferido) |
| `registerBankDeposit` | método public | 162–175 | `dto: RegisterCashBankDepositRequestDto`, `user: RequestUser` | (inferido) |
| `voidMovement` | método public | 177–191 | `id: string`, `dto: ReasonRequestDto`, `user: RequestUser` | (inferido) |
| `openDay` | método public | 193–206 | `dto: OpenCashDayRequestDto`, `user: RequestUser` | (inferido) |
| `closeDay` | método public | 208–223 | `id: string`, `dto: CloseCashDayRequestDto`, `user: RequestUser` | (inferido) |
| `days` | método public | 226–229 | `query: CashDaysQueryDto` | (inferido) |
| `cut` | método public | 231–234 | `id: string` | (inferido) |
| `updateSchedule` | método public | 236–250 | `id: string`, `dto: UpdateCashCutScheduleRequestDto`, `user: RequestUser` | (inferido) |
| `startCut` | método public | 252–265 | `id: string`, `user: RequestUser` | (inferido) |
| `finishCut` | método public | 267–282 | `id: string`, `dto: FinishCashCutRequestDto`, `user: RequestUser` | (inferido) |
| `reopenCut` | método public | 284–299 | `id: string`, `dto: ReasonRequestDto`, `user: RequestUser` | (inferido) |

##### `CashControlController.position`

- **Firma:** `position()` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L99) (L99–102)
- **Decoradores:** `@Get('position')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getPositionUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.balance`

- **Firma:** `balance()` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L104) (L104–107)
- **Decoradores:** `@Get('balance')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getBalanceUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.movements`

- **Firma:** `movements(query: CashMovementsQueryDto)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L109) (L109–112)
- **Decoradores:** `@Get('movements')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listMovementsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.bankDays`

- **Firma:** `bankDays(query: CashBankDaysQueryDto)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L115) (L115–118)
- **Decoradores:** `@Get('bank-days')`
- **Propósito / descripción:** Bank operational days (Agentes Bancarios openings) with their daily indicators — newest first.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listBankDaysUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.bankDay`

- **Firma:** `bankDay(date: string)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L121) (L121–124)
- **Decoradores:** `@Get('bank-days/:date')`
- **Propósito / descripción:** Original indicators of one bank day (read only).
- **Origen de parámetros:** `@Param('date') date`
- **Dependencias (llamadas en su cuerpo):** `this.getBankDayUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.recent`

- **Firma:** `recent(query: RecentCashMovementsQueryDto)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L126) (L126–129)
- **Decoradores:** `@Get('movements/recent')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getRecentUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.movement`

- **Firma:** `movement(id: string)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L131) (L131–134)
- **Decoradores:** `@Get('movements/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getMovementUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.users`

- **Firma:** `users()` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L136) (L136–139)
- **Decoradores:** `@Get('users')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.listUsersUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.bankBalances`

- **Firma:** `bankBalances()` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L141) (L141–144)
- **Decoradores:** `@Get('bank-balances')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getBankBalancesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.registerMovement`

- **Firma:** `registerMovement(dto: RegisterCashMovementRequestDto, user: RequestUser)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L146) (L146–159)
- **Decoradores:** `@Post('movements')` `@UseGuards(RolesGuard)` `@Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.registerMovementUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.registerBankDeposit`

- **Firma:** `registerBankDeposit(dto: RegisterCashBankDepositRequestDto, user: RequestUser)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L162) (L162–175)
- **Decoradores:** `@Post('bank-deposits')` `@UseGuards(RolesGuard)` `@Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** "Depósito bancario": cash leaves the caja and is credited to the selected account (with breakdown).
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.registerBankDepositUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.voidMovement`

- **Firma:** `voidMovement(id: string, dto: ReasonRequestDto, user: RequestUser)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L177) (L177–191)
- **Decoradores:** `@Post('movements/:id/void')` `@UseGuards(RolesGuard)` `@Roles('SUPER_ADMIN', 'ADMIN')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.voidMovementUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.openDay`

- **Firma:** `openDay(dto: OpenCashDayRequestDto, user: RequestUser)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L193) (L193–206)
- **Decoradores:** `@Post('days/open')` `@UseGuards(RolesGuard)` `@Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.openDayUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.closeDay`

- **Firma:** `closeDay(id: string, dto: CloseCashDayRequestDto, user: RequestUser)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L208) (L208–223)
- **Decoradores:** `@Post('days/:id/close')` `@UseGuards(RolesGuard)` `@Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.closeDayUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.days`

- **Firma:** `days(query: CashDaysQueryDto)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L226) (L226–229)
- **Decoradores:** `@Get('days')`
- **Propósito / descripción:** Historial de Cortes (one row per operational day with both cuts).
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listDaysUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.cut`

- **Firma:** `cut(id: string)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L231) (L231–234)
- **Decoradores:** `@Get('cuts/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getCutDetailUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.updateSchedule`

- **Firma:** `updateSchedule(id: string, dto: UpdateCashCutScheduleRequestDto, user: RequestUser)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L236) (L236–250)
- **Decoradores:** `@Patch('cuts/:id/schedule')` `@UseGuards(RolesGuard)` `@Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.updateScheduleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.startCut`

- **Firma:** `startCut(id: string, user: RequestUser)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L252) (L252–265)
- **Decoradores:** `@Post('cuts/:id/start')` `@UseGuards(RolesGuard)` `@Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.startCutUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.finishCut`

- **Firma:** `finishCut(id: string, dto: FinishCashCutRequestDto, user: RequestUser)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L267) (L267–282)
- **Decoradores:** `@Post('cuts/:id/finish')` `@UseGuards(RolesGuard)` `@Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.finishCutUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlController.reopenCut`

- **Firma:** `reopenCut(id: string, dto: ReasonRequestDto, user: RequestUser)` — [cash-control.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts#L284) (L284–299)
- **Decoradores:** `@Post('cuts/:id/reopen')` `@UseGuards(RolesGuard)` `@Roles('SUPER_ADMIN', 'ADMIN')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.reopenCutUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts"></a>

### cash-custody.controller.ts

- **Ruta:** [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts) (`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts`, 248 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** Control de Efectivo → "Arqueo de Caja" and "Bodega".
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [cash-custody.use-cases.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-cash-custody-use-cases-ts), [cash-control.request.dto.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-dtos-cash-control-request-dto-ts), [cash-custody.request.dto.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-dtos-cash-custody-request-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts)

#### Clase `CashCustodyController` (L51–247)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('cash-control')`
- **Propósito:** Control de Efectivo → "Arqueo de Caja" and "Bodega". Every use case checks its permission (cash_custody.view / operate / authorize) and the SQL functions check operate/authorize again.
- **Dependencias inyectadas (constructor):** `getCustody: GetCashCustodyUseCase`, `registerCount: RegisterCashCountUseCase`, `listCounts: ListCashCountsUseCase`, `getCount: GetCashCountUseCase`, `getLatestCount: GetLatestCashCountUseCase`, `registerTransfer: RegisterWarehouseTransferUseCase`, `voidTransfer: VoidWarehouseTransferUseCase`, `listTransfers: ListWarehouseTransfersUseCase`, `getTransfer: GetWarehouseTransferUseCase`, `initialBalance: RegisterWarehouseInitialBalanceUseCase`, `listWarehouseMovements: ListWarehouseMovementsUseCase`, `registerWithdrawal: RegisterWarehouseWithdrawalUseCase`, `voidWithdrawal: VoidWarehouseWithdrawalUseCase`, `listWithdrawals: ListWarehouseWithdrawalsUseCase`, `getWithdrawal: GetWarehouseWithdrawalUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `withdrawals` | método public | 73–79 | `query: WarehouseTransfersQueryDto`, `user: RequestUser` | (inferido) |
| `withdrawal` | método public | 81–87 | `id: string`, `user: RequestUser` | (inferido) |
| `createWithdrawal` | método public | 90–101 | `dto: RegisterWarehouseWithdrawalRequestDto`, `user: RequestUser` | (inferido) |
| `voidWarehouseWithdrawal` | método public | 103–116 | `id: string`, `dto: ReasonRequestDto`, `user: RequestUser` | (inferido) |
| `custody` | método public | 119–122 | `user: RequestUser` | (inferido) |
| `counts` | método public | 124–127 | `query: CashCountsQueryDto`, `user: RequestUser` | (inferido) |
| `latestCount` | método public | 133–142 | `query: LatestCashCountQueryDto`, `user: RequestUser` | (inferido) |
| `count` | método public | 144–150 | `id: string`, `user: RequestUser` | (inferido) |
| `createCount` | método public | 152–163 | `dto: RegisterCashCountRequestDto`, `user: RequestUser` | (inferido) |
| `correctCount` | método public | 166–181 | `id: string`, `dto: CorrectCashCountRequestDto`, `user: RequestUser` | (inferido) |
| `warehouseMovements` | método public | 183–189 | `query: WarehouseMovementsQueryDto`, `user: RequestUser` | (inferido) |
| `warehouseInitialBalance` | método public | 191–202 | `dto: WarehouseInitialBalanceRequestDto`, `user: RequestUser` | (inferido) |
| `transfers` | método public | 204–210 | `query: WarehouseTransfersQueryDto`, `user: RequestUser` | (inferido) |
| `transfer` | método public | 212–218 | `id: string`, `user: RequestUser` | (inferido) |
| `createTransfer` | método public | 220–231 | `dto: RegisterWarehouseTransferRequestDto`, `user: RequestUser` | (inferido) |
| `voidWarehouseTransfer` | método public | 233–246 | `id: string`, `dto: ReasonRequestDto`, `user: RequestUser` | (inferido) |

##### `CashCustodyController.withdrawals`

- **Firma:** `withdrawals(query: WarehouseTransfersQueryDto, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L73) (L73–79)
- **Decoradores:** `@Get('warehouse/withdrawals')`
- **Propósito / descripción:** "Retiro de Bodega" history.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listWithdrawals.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.withdrawal`

- **Firma:** `withdrawal(id: string, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L81) (L81–87)
- **Decoradores:** `@Get('warehouse/withdrawals/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getWithdrawal.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.createWithdrawal`

- **Firma:** `createWithdrawal(dto: RegisterWarehouseWithdrawalRequestDto, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L90) (L90–101)
- **Decoradores:** `@Post('warehouse/withdrawals')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Cash out of Bodega: back to the caja or deposited into a bank account.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.registerWithdrawal.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.voidWarehouseWithdrawal`

- **Firma:** `voidWarehouseWithdrawal(id: string, dto: ReasonRequestDto, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L103) (L103–116)
- **Decoradores:** `@Post('warehouse/withdrawals/:id/void')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.voidWithdrawal.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.custody`

- **Firma:** `custody(user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L119) (L119–122)
- **Decoradores:** `@Get('custody')`
- **Propósito / descripción:** Caja, Bodega and total under custody.
- **Origen de parámetros:** `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getCustody.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.counts`

- **Firma:** `counts(query: CashCountsQueryDto, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L124) (L124–127)
- **Decoradores:** `@Get('counts')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listCounts.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.latestCount`

- **Firma:** `latestCount(query: LatestCashCountQueryDto, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L133) (L133–142)
- **Decoradores:** `@Get('counts/latest')`
- **Propósito / descripción:** Latest valid Arqueo de Caja (+ full 12-denomination breakdown) for Cuadre de Agentes. Declared before `counts/:id` so "latest" is not parsed as an id.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getLatestCount.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.count`

- **Firma:** `count(id: string, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L144) (L144–150)
- **Decoradores:** `@Get('counts/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getCount.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.createCount`

- **Firma:** `createCount(dto: RegisterCashCountRequestDto, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L152) (L152–163)
- **Decoradores:** `@Post('counts')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.registerCount.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.correctCount`

- **Firma:** `correctCount(id: string, dto: CorrectCashCountRequestDto, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L166) (L166–181)
- **Decoradores:** `@Post('counts/:id/corrections')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Audited correction: new count with the original photograph; the original becomes REEMPLAZADO.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.registerCount.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.warehouseMovements`

- **Firma:** `warehouseMovements(query: WarehouseMovementsQueryDto, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L183) (L183–189)
- **Decoradores:** `@Get('warehouse/movements')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listWarehouseMovements.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.warehouseInitialBalance`

- **Firma:** `warehouseInitialBalance(dto: WarehouseInitialBalanceRequestDto, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L191) (L191–202)
- **Decoradores:** `@Post('warehouse/initial-balance')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.initialBalance.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.transfers`

- **Firma:** `transfers(query: WarehouseTransfersQueryDto, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L204) (L204–210)
- **Decoradores:** `@Get('warehouse/transfers')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listTransfers.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.transfer`

- **Firma:** `transfer(id: string, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L212) (L212–218)
- **Decoradores:** `@Get('warehouse/transfers/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getTransfer.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.createTransfer`

- **Firma:** `createTransfer(dto: RegisterWarehouseTransferRequestDto, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L220) (L220–231)
- **Decoradores:** `@Post('warehouse/transfers')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.registerTransfer.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyController.voidWarehouseTransfer`

- **Firma:** `voidWarehouseTransfer(id: string, dto: ReasonRequestDto, user: RequestUser)` — [cash-custody.controller.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts#L233) (L233–246)
- **Decoradores:** `@Post('warehouse/transfers/:id/void')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.voidTransfer.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-cash-control-presentation-dtos-cash-control-request-dto-ts"></a>

### cash-control.request.dto.ts

- **Ruta:** [cash-control.request.dto.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/dtos/cash-control.request.dto.ts) (`comercial-jhoel-api/src/modules/cash-control/presentation/dtos/cash-control.request.dto.ts`, 192 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** DTO de entrada: declara `CashMovementsQueryDto`, `CashBankDaysQueryDto`, `RecentCashMovementsQueryDto`, `RegisterCashMovementRequestDto`, `ReasonRequestDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [cash-control.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-control-controller-ts), [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)

**Constantes exportadas:**

- `CASH_DENOMINATIONS` (L35): Same denominations as Transaccionar/Guayacán (and `cash_valid_denomination` in SQL). = `[ 200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01, ] as const`

#### Clase `CashMovementsQueryDto` (L39–50)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CashBankDaysQueryDto` (L52–54)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RecentCashMovementsQueryDto` (L56–58)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RegisterCashMovementRequestDto` (L60–79)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ReasonRequestDto` (L81–86)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `OpenCashDayRequestDto` (L88–99)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `UpdateCashCutScheduleRequestDto` (L101–110)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CashDenominationRequestDto` (L112–122)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CashBankVerificationRequestDto` (L124–131)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `FinishCashCutRequestDto` (L133–148)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CloseCashDayRequestDto` (L150–152)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CashDaysQueryDto` (L154–164)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RegisterCashBankDepositRequestDto` (L167–191)

- **Propósito:** Control de Efectivo → "Depósito bancario" (cash → registered account) with mandatory breakdown.
<a id="f-comercial-jhoel-api-src-modules-cash-control-presentation-dtos-cash-custody-request-dto-ts"></a>

### cash-custody.request.dto.ts

- **Ruta:** [cash-custody.request.dto.ts](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/dtos/cash-custody.request.dto.ts) (`comercial-jhoel-api/src/modules/cash-control/presentation/dtos/cash-custody.request.dto.ts`, 162 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `cash-control`
- **Responsabilidad:** One denomination row (quantity: whole number ≥ 0).
- **Depende de (archivos del proyecto):** [cash-custody.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-custody-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [cash-custody.controller.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-presentation-controllers-cash-custody-controller-ts)

#### Clase `DenominationRequestDto` (L31–39)

- **Propósito:** One denomination row (quantity: whole number ≥ 0).

#### Clase `RegisterCashCountRequestDto` (L42–60)

- **Propósito:** "Arqueo de Caja" (or its audited correction).

#### Clase `CorrectCashCountRequestDto` (L62–67)

- **Herencia / contratos:** extends RegisterCashCountRequestDto
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CashCountsQueryDto` (L69–77)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RegisterWarehouseTransferRequestDto` (L80–99)

- **Propósito:** "Entrega de Efectivo a Bodega".

#### Clase `WarehouseTransfersQueryDto` (L101–107)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `WarehouseMovementsQueryDto` (L109–112)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `WarehouseInitialBalanceRequestDto` (L114–126)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RegisterWarehouseWithdrawalRequestDto` (L129–154)

- **Propósito:** "Retiro de Bodega" — to the caja or to a bank account.

#### Clase `LatestCashCountQueryDto` (L157–161)

- **Propósito:** `GET /cash-control/counts/latest?businessDate=yyyy-MM-dd` (optional: default current bank day).
