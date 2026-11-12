# Módulo backend `banks`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/agent-reconciliations` | [agent-reconciliations.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/agent-reconciliations.controller.ts#L29) `AgentReconciliationsController.create` | [CloseAgentDayUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts) | `AgentReconciliationRepository`.closeDayWithReconciliation → `close_agent_day_with_cash_breakdown`, `close_agent_day`<br>`DayOpeningRepository`.findByDate<br>`GetCuadreAgentesSummaryUseCase`.execute<br>`ValidateBankBalancesForDateUseCase`.execute | UseGuards(JwtAuthGuard) | `CuadreAgentesService.registerReconciliation` |
| `POST /api/bank-transfers/balance-credits` | [bank-transfers.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts#L62) `BankTransfersController.createBalanceCredit` | [RegisterBankBalanceCreditUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-balance-credit-use-case-ts) | `BankMovementRepository`.registerBalanceCredit → `register_bank_balance_credit` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `BankTransferService.registerBalanceCredit` |
| `GET /api/bank-transfers/balance-credits` | [bank-transfers.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts#L73) `BankTransfersController.findBalanceCredits` | [ListBankBalanceCreditsUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-balance-credits-use-case-ts) | `BankMovementRepository`.findMovements [bank_account_movements] | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `BankTransferService.getBalanceCredits` |
| `POST /api/bank-transfers/balance-credits/:operationId/void` | [bank-transfers.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts#L82) `BankTransfersController.voidBalanceCredit` | [VoidBankBalanceCreditUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-balance-credit-use-case-ts) | `BankMovementRepository`.voidBalanceCredit/findByReference → `void_bank_balance_credit` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `BankTransferService.voidBalanceCredit` |
| `POST /api/bank-transfers` | [bank-transfers.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts#L97) `BankTransfersController.create` | [RegisterBankTransferUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-transfer-use-case-ts) | `BankMovementRepository`.registerTransfer/findTransferById → `register_bank_transfer` | UseGuards(JwtAuthGuard) | `BankTransferService.registerTransfer` |
| `GET /api/bank-transfers` | [bank-transfers.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts#L106) `BankTransfersController.findAll` | [ListBankTransfersUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-transfers-use-case-ts) | `BankMovementRepository`.findTransfers | UseGuards(JwtAuthGuard) | `BankTransferService.getTransfers` |
| `POST /api/bank-transfers/:id/void` | [bank-transfers.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts#L113) `BankTransfersController.voidTransfer` | [VoidBankTransferUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-transfer-use-case-ts) | `BankMovementRepository`.findTransferById/voidTransfer → `void_bank_transfer` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `BankTransferService.voidTransfer` |
| `GET /api/banks/day-status` | [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L93) `BanksController.getDayStatus` | [GetDayStatusUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-status-use-case-ts) | `DayOpeningRepository`.findByDate<br>`AgentReconciliationRepository`.existsForDate<br>`ValidateBankBalancesForDateUseCase`.execute | UseGuards(JwtAuthGuard) | `CuadreAgentesService.getDayStatus` |
| `POST /api/banks/day-status/open` | [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L104) `BanksController.openDay` | [OpenDayUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-open-day-use-case-ts) | `DayOpeningRepository`.findByDate/open<br>`DayAuditLogRepository`.record<br>`GetDayStatusUseCase`.execute | UseGuards(JwtAuthGuard) | `CuadreAgentesService.openDay` |
| `GET /api/banks/balance-strip` | [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L121) `BanksController.getBalanceStrip` | [GetBankBalanceStripUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-ts) | `BankRepository`.findAll<br>`BankMovementRepository`.getLastMovementByBank [bank_account_movements, banks, guayacan_cash_movements] | UseGuards(JwtAuthGuard) | `BankService.getBalanceStrip` |
| `GET /api/banks/balances` | [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L126) `BanksController.getBalancesView` | [GetBankBalancesViewUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balances-view-use-case-ts) | `BankBalanceRepository`.findBalancesView | UseGuards(JwtAuthGuard) | `BankBalanceService.getBalancesView` |
| `GET /api/banks/cuadre-agentes-summary` | [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L142) `BanksController.getCuadreAgentesSummary` | [GetCuadreAgentesSummaryUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-ts) | `BankRepository`.findAll<br>`AssetRepository`.getReportSummary<br>`AccountReceivableRepository`.getReportSummary<br>`WarehouseCashReader`.getBalance → `warehouse_cash_balance` | UseGuards(JwtAuthGuard) | `CuadreAgentesService.getSummary` |
| `GET /api/banks/balances/validation` | [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L155) `BanksController.validateBankBalances` | [ValidateBankBalancesForDateUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-ts) | `BankBalanceRepository`.findBalancesView | UseGuards(JwtAuthGuard) | `CuadreAgentesService.validateBankBalances` |
| `POST /api/banks/balances` | [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L164) `BanksController.saveBalances` | [SaveBankBalancesUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-save-bank-balances-use-case-ts) | `BankBalanceRepository`.saveBalances → `save_bank_balance`<br>`DayOpeningRepository`.findByDate | UseGuards(JwtAuthGuard) | `BankBalanceService.saveBalances` |
| `POST /api/banks` | [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L173) `BanksController.create` | [CreateBankUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-create-bank-use-case-ts) | `BankRepository`.findByActiveNameAndAccountNumber/create<br>`AccountTypeRepository`.findById | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `BankService.createBank` |
| `GET /api/banks` | [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L184) `BanksController.findAll` | [ListBanksUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-banks-use-case-ts) | `BankRepository`.findAll | UseGuards(JwtAuthGuard) | `BankService.getBanks` |
| `GET /api/banks/:id` | [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L189) `BanksController.findOne` | [GetBankByIdUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-by-id-use-case-ts) | `BankRepository`.findById | UseGuards(JwtAuthGuard) | `BankService.getBankById` |
| `PATCH /api/banks/:id` | [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L194) `BanksController.update` | [UpdateBankUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-update-bank-use-case-ts) | `BankRepository`.findById/findByActiveNameAndAccountNumber/update<br>`AccountTypeRepository`.findById | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `BankService.updateBank`<br>`BankService.setAvailableInTransaccionar` |
| `POST /api/banks/:id/balance-adjustments` | [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L210) `BanksController.adjustBalance` | [AdjustBankBalanceUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-adjust-bank-balance-use-case-ts) | `BankMovementRepository`.adjustBalance → `adjust_bank_balance` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `BankService.adjustBalance` |
| `DELETE /api/banks/:id` | [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L228) `BanksController.deactivate` | [DeactivateBankUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-deactivate-bank-use-case-ts) | `BankRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `BankService.deleteBank` |
| `GET /api/closed-days` | [closed-days.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/closed-days.controller.ts#L41) `ClosedDaysController.findAll` | [ListClosedDaysUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-closed-days-use-case-ts) | `DayOpeningRepository`.findClosedDays [agent_reconciliations] | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ClosedDaysService.getClosedDays` |
| `GET /api/closed-days/:date` | [closed-days.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/closed-days.controller.ts#L46) `ClosedDaysController.findOne` | [GetDayDetailUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts) | `DayOpeningRepository`.findByDate<br>`AgentReconciliationRepository`.findLatestByDate<br>`BankBalanceRepository`.findBalancesView<br>`DayAuditLogRepository`.findByDate | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ClosedDaysService.getDayDetail` |
| `POST /api/closed-days/:date/reopen` | [closed-days.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/closed-days.controller.ts#L51) `ClosedDaysController.reopen` | [ReopenDayUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-reopen-day-use-case-ts) | `DayOpeningRepository`.reopen → `reopen_agent_day`<br>`GetDayDetailUseCase`.execute | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ClosedDaysService.reopenDay` |
| `POST /api/closed-days/:date/cancel` | [closed-days.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/closed-days.controller.ts#L60) `ClosedDaysController.cancel` | [CancelDayUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-cancel-day-use-case-ts) | `DayOpeningRepository`.cancel → `cancel_agent_day`<br>`GetDayDetailUseCase`.execute | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ClosedDaysService.cancelDay` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [agent-reconciliation-output.ts](#f-comercial-jhoel-api-src-modules-banks-application-dtos-agent-reconciliation-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toAgentReconciliationOutput`, `AgentReconciliationOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [bank-balance-view-output.ts](#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-balance-view-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toBankBalanceViewOutput`, `BankBalanceViewOutput` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [bank-balances-validation-output.ts](#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-balances-validation-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `MissingBankInfo`, `BankBalancesValidationOutput` (sin comentario de documentación en el código). | 0 internas | 2 | Baja (2 consumidores) |
| [bank-movement-output.ts](#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-movement-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `PaginatedBankMovementsOutput`, `BankMovementOutput`, `BankTransferOutput` (sin comentario de documentación en el código). | 1 internas | 10 | Alta (10 consumidores) |
| [bank-output.ts](#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toBankOutput`, `BankOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [closed-day-output.ts](#f-comercial-jhoel-api-src-modules-banks-application-dtos-closed-day-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toClosedDayOutput`, `ClosedDayOutput` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [cuadre-agentes-summary-output.ts](#f-comercial-jhoel-api-src-modules-banks-application-dtos-cuadre-agentes-summary-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Whether this bank's `finalBalance` adds to or subtracts from `totalBanks` — see `isCreditLineAccountType` for how it's decided. | 0 internas | 2 | Baja (2 consumidores) |
| [day-detail-output.ts](#f-comercial-jhoel-api-src-modules-banks-application-dtos-day-detail-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `DayAuditLogOutput`, `DayDetailOutput` (sin comentario de documentación en el código). | 4 internas | 4 | Media (4 consumidores) |
| [day-status-output.ts](#f-comercial-jhoel-api-src-modules-banks-application-dtos-day-status-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | The conceptual state of a date's "working cycle" — seven values, always derived from the same three independent facts (`isOpened`/`bankBalancesSaved`/`isClosed`), never stored separately: - `NOT_OPENED`: no `day_openings` row exists for this date. | 0 internas | 3 | Media (3 consumidores) |
| [adjust-bank-balance.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-adjust-bank-balance-use-case-ts) | .ts | Caso de uso | Aplicación | "Ajustar saldo" — la única vía para corregir a mano el saldo actual de una cuenta. | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [assert-bank-operation-day-open.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-assert-bank-operation-day-open-ts) | .ts | Código TypeScript | Aplicación | Las operaciones que mueven saldo (transferencias) respetan el mismo ciclo de día abierto/cerrado que Transaccionar y el cuadre — nunca un ciclo paralelo. | 2 internas | 3 | Media (3 consumidores) |
| [bank-movements.use-cases.spec.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `buildDayOpening`, `buildTransfer`, `mockRepository`, `buildCreditMovement` (sin comentario de documentación en el código). | 13 internas | 0 | Soporte (pruebas) |
| [cancel-day.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-cancel-day-use-case-ts) | .ts | Caso de uso | Aplicación | "Anular Día" — a soft delete of the whole cycle (see `cancel_agent_day`, SQL): never deletes `bank_balances`/`agent_reconciliations`, only marks `day_openings.is_cancelled`. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [close-agent-day.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `breakdown`, `code`, `ACCEPTANCE` (sin comentario de documentación en el código). | 2 internas | 0 | Soporte (pruebas) |
| [close-agent-day.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts) | .ts | Caso de uso | Aplicación | "Guardar Cuadre" is no longer just a historical `INSERT` — since the "Cierre del Día" ticket, it also officially closes that date's working cycle (`day_openings.closed_at`) in the same atomic operation (see `AgentReconciliationRepository.closeDayWithReconciliation` / `close_agent_day` in the database). | 11 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [create-bank.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-create-bank-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateBankUseCase`, `CreateBankInput` (sin comentario de documentación en el código). | 7 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-bank.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-deactivate-bank-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — DELETE /banks/:id never removes the row, and every past bank_balances entry keeps referencing it (RESTRICT FK, never CASCADE). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-bank-balance-strip.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `bank` (sin comentario de documentación en el código). | 5 internas | 0 | Soporte (pruebas) |
| [get-bank-balance-strip.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-ts) | .ts | Caso de uso | Aplicación | La "tira de saldos" de Transaccionar y del Resumen: saldo actual de las cuentas principales (las marcadas "En Transaccionar" en Sistema → Bancos, más Génesis y BI Club) y si su ÚLTIMA transacción subió o bajó el saldo. | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-bank-balances-view.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balances-view-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetBankBalancesViewUseCase`, `GetBankBalancesViewInput`, `DATE_PATTERN` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-bank-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetBankByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-cuadre-agentes-summary.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `bank`, `run` (sin comentario de documentación en el código). | 6 internas | 0 | Soporte (pruebas) |
| [get-cuadre-agentes-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-ts) | .ts | Caso de uso | Aplicación | "Cuadre Agentes" (primera etapa) — a single read-only aggregate spanning three otherwise-independent modules (Bancos, Activos, Cuentas por Cobrar), the same cross-module reuse pattern `GetAssetsReceivablesReportUseCase` already established: inject the other modules' own repositories rather than re-q | 6 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [get-day-detail.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts) | .ts | Caso de uso | Aplicación | "Ver Detalle" — composes reads from four repositories that already exist (day, bank balances, current reconciliation, audit trail), never duplicates them. | 7 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [get-day-status.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-status-use-case-ts) | .ts | Caso de uso | Aplicación | Combines three independent sources into a single response — never duplicates their logic: `DayOpeningRepository` (is it open? | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [list-bank-balance-credits.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-balance-credits-use-case-ts) | .ts | Caso de uso | Aplicación | Historial de acreditaciones — el mismo ledger filtrado por `ACREDITACION_SALDO` (vigentes y anuladas). | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [list-bank-movements.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-movements-use-case-ts) | .ts | Caso de uso | Aplicación | Historial de movimientos de saldo, filtrable por fecha de negocio, cuenta, tipo y usuario. | 4 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [list-bank-transfers.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-transfers-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListBankTransfersUseCase`, `ListBankTransfersInput`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-banks.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-banks-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListBanksUseCase`, `ListBanksInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-closed-days.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-closed-days-use-case-ts) | .ts | Caso de uso | Aplicación | "Sistema → Gestión de Días Cerrados" — administrative listing, ADMIN/SUPER_ADMIN only (see the controller). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [open-day.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-open-day-use-case-ts) | .ts | Caso de uso | Aplicación | "Confirmar Apertura" — idempotent (`DayOpeningRepository.open` never creates a second row for an already-opened date), so a double click or a retry never fails or duplicates anything. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-bank-balance-credit.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-balance-credit-use-case-ts) | .ts | Caso de uso | Aplicación | Finanzas → Transferencias Bancarias → "Acreditar saldo": SUMA `amount` al saldo actual de una cuenta (nuevo saldo = saldo actual + monto, con signo real — una cuenta en negativo simplemente se acerca a cero). | 6 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [register-bank-transfer.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-transfer-use-case-ts) | .ts | Caso de uso | Aplicación | "Transferencias Bancarias" — traslada saldo entre dos cuentas propias. | 6 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [reopen-day.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-reopen-day-use-case-ts) | .ts | Caso de uso | Aplicación | "Reabrir Día" — role validation (ADMIN/SUPER_ADMIN only) already happened in the controller's `RolesGuard`; the real status/cancellation/ later-day validation happens atomically inside `reopen_agent_day` (SQL, under the row lock) — this use case only orchestrates and translates the result into the shape the frontend needs to refresh the row/detail without a second call. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [save-bank-balances.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-save-bank-balances-use-case-ts) | .ts | Caso de uso | Aplicación | Saves every entered bank's cuadre for one operation date as a single atomic batch (see `TypeOrmBankBalanceRepository.saveBalances` — one outer transaction wrapping one `save_bank_balance()` call per entry): either every bank in the batch is recorded, or none are. | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-bank.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-update-bank-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateBankUseCase`, `UpdateBankInput` (sin comentario de documentación en el código). | 8 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [validate-bank-balances-for-date.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `row`, `useCase` (sin comentario de documentación en el código). | 3 internas | 0 | Soporte (pruebas) |
| [validate-bank-balances-for-date.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-ts) | .ts | Caso de uso | Aplicación | Backs both the new `GET /banks/balances/validation` endpoint (the frontend's UX pre-check for Cuadre Agentes) and the hard gate inside `CloseAgentDayUseCase` — one place decides "can this date be reconciled", reused by both the read-only check and the actual write-time enforcement, per this ticket's own "no confiar únicamente en el frontend" requirement. | 4 internas; ext.: @nestjs/common | 5 | Media (5 consumidores) |
| [void-bank-balance-credit.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-balance-credit-use-case-ts) | .ts | Caso de uso | Aplicación | Anular una acreditación de saldo — nunca la borra: `void_bank_balance_credit` reutiliza `reverse_bank_account_movements`, que registra el movimiento inverso (ANULACION, −monto) y marca el original como ANULADO; ambos quedan en el historial. | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [void-bank-transfer.use-case.ts](#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-transfer-use-case-ts) | .ts | Caso de uso | Aplicación | Anular una transferencia — nunca la borra: `void_bank_transfer` registra los dos movimientos inversos y marca los originales como ANULADO, todo en una transacción. | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [today-iso-date.ts](#f-comercial-jhoel-api-src-modules-banks-application-utils-today-iso-date-ts) | .ts | Utilidad | Aplicación | `yyyy-MM-dd` in local server time — small per-feature copy of the identical helper in `modules/recharges/application/utils/today-iso-date.ts`, following this codebase's established "small per-feature copy over cross-feature coupling" convention for a helper this trivial, rather than importing across a module boundary for one function. | 0 internas | 9 | Media (9 consumidores) |
| [banks.module.ts](#f-comercial-jhoel-api-src-modules-banks-banks-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `BanksModule` (sin comentario de documentación en el código). | 51 internas; ext.: @nestjs/common, @nestjs/typeorm | 4 | Media (4 consumidores) |
| [agent-reconciliation.entity.ts](#f-comercial-jhoel-api-src-modules-banks-domain-entities-agent-reconciliation-entity-ts) | .ts | Entidad de dominio | Dominio | A frozen historical snapshot of one "Cuadre Agentes" close — the second stage of the daily sequence, after bank balances are saved. | 0 internas | 4 | Media (4 consumidores) |
| [bank-account-movement.entity.ts](#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts) | .ts | Entidad de dominio | Dominio | Un renglón del ledger `bank_account_movements` — proyección de solo lectura (la escritura siempre pasa por las funciones SQL). | 0 internas | 19 | Alta (19 consumidores) |
| [bank-balance-view.entity.ts](#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-balance-view-entity-ts) | .ts | Entidad de dominio | Dominio | The row shape the Agentes Bancarios → Bancos screen actually needs: one active bank joined with its resolved previous balance for a given date (last bank_balances.finalBalance strictly before that date, falling back to the bank's configured opening previousBalance) and whatever final balance was already saved for that exact date, if any. | 0 internas | 5 | Media (5 consumidores) |
| [bank.entity.ts](#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-entity-ts) | .ts | Entidad de dominio | Dominio | Entidad de dominio: declara `Bank`, `BankProps` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [day-audit-log.entity.ts](#f-comercial-jhoel-api-src-modules-banks-domain-entities-day-audit-log-entity-ts) | .ts | Entidad de dominio | Dominio | One row per CYCLE transition of a day (opening, close/re-close, reopening, cancellation) — not a generic field-change log. | 0 internas | 4 | Media (4 consumidores) |
| [day-opening.entity.ts](#f-comercial-jhoel-api-src-modules-banks-domain-entities-day-opening-entity-ts) | .ts | Entidad de dominio | Dominio | "The user confirmed they want to start working on this date" — independent of whether balances have already been saved. | 0 internas | 5 | Media (5 consumidores) |
| [bank-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `BankAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [bank-balances-not-registered.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-balances-not-registered-error-ts) | .ts | Errores de dominio | Dominio | "No se puede realizar un Cuadre de Agentes si primero no se han registrado y guardado los saldos de los bancos para esa misma fecha" — the one hard backend gate this rule needs. | 1 internas | 2 | Baja (2 consumidores) |
| [bank-inactive.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-inactive-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `BankInactiveError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [bank-movement.errors.spec.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-spec-ts) | .ts | Prueba unitaria | Dominio | Prueba unitaria (sin comentario de documentación en el código). | 1 internas | 0 | Soporte (pruebas) |
| [bank-movement.errors.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InsufficientBankBalanceError`, `BankBalanceLimitExceededError`, `CreditLineLimitExceededError`, `CreditLineNoDebtError`, `CreditLineOverpaymentError` (sin comentario de documentación en el código). | 1 internas | 20 | Alta (20 consumidores) |
| [bank-not-found.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `BankNotFoundError` (sin comentario de documentación en el código). | 1 internas | 5 | Media (5 consumidores) |
| [cuadre-cash-breakdown.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-cuadre-cash-breakdown-error-ts) | .ts | Errores de dominio | Dominio | Rejected cash breakdown of a Cuadre de Agentes (the SQL function `close_agent_day_with_cash_breakdown` raises the same codes). | 1 internas | 2 | Baja (2 consumidores) |
| [day-already-closed.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-already-closed-error-ts) | .ts | Errores de dominio | Dominio | "The day is already closed and can't be modified" — covers the operations that get blocked once `day_openings.closed_at` is no longer null: saving/editing that date's bank balances (`SaveBankBalancesUseCase`) and saving a new cuadre for that same date (`CloseAgentDayUseCase`, which is also what closes it). | 1 internas | 3 | Media (3 consumidores) |
| [day-cancelled.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-cancelled-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `DayCancelledError`, `DayAlreadyCancelledError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [day-not-closed.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-not-closed-error-ts) | .ts | Errores de dominio | Dominio | Reopening or cancelling only makes sense for a day that's actually CLOSED. | 1 internas | 1 | Baja (1 consumidores) |
| [day-not-found.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `DayNotFoundError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [day-not-opened.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-not-opened-error-ts) | .ts | Errores de dominio | Dominio | "The user must NOT be able to freely access... | 1 internas | 3 | Media (3 consumidores) |
| [invalid-account-type.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-invalid-account-type-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidAccountTypeError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-bank-balance.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-invalid-bank-balance-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidBankBalanceDateError`, `InvalidBankFinalBalanceError`, `NoBankBalancesToSaveError` (sin comentario de documentación en el código). | 1 internas | 5 | Media (5 consumidores) |
| [later-day-exists.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-later-day-exists-error-ts) | .ts | Errores de dominio | Dominio | The later-day integrity rule (Option A, the safest of the options evaluated): a date is never reopened/cancelled if a strictly later date has a non-cancelled CLOSED/REOPENED cycle — this avoids inconsistencies in later balances without needing a cascading recalculation. | 1 internas | 1 | Baja (1 consumidores) |
| [reason-required.error.ts](#f-comercial-jhoel-api-src-modules-banks-domain-errors-reason-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `ReopenReasonRequiredError`, `CancelReasonRequiredError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [agent-reconciliation.repository.ts](#f-comercial-jhoel-api-src-modules-banks-domain-repositories-agent-reconciliation-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | The cash breakdown a cuadre is saved with — stored as an independent photograph (`agent_reconciliation_cash_breakdowns`/`_details`). | 1 internas | 7 | Media (7 consumidores) |
| [bank-balance.repository.ts](#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-balance-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `SaveBankBalanceEntryData`, `SaveBankBalancesData`, `BankBalanceRepository`, `BANK_BALANCE_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 7 | Media (7 consumidores) |
| [bank-movement.repository.ts](#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RegisterBankTransferData`, `AdjustBankBalanceData`, `RegisterBankBalanceCreditData`, `BankBalanceCreditResult`, `LastBankMovement` (sin comentario de documentación en el código). | 1 internas | 17 | Alta (17 consumidores) |
| [bank.repository.ts](#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateBankData`, `UpdateBankData`, `FindBanksOptions`, `BankRepository`, `BANK_REPOSITORY` (sin comentario de documentación en el código). | 2 internas | 13 | Alta (13 consumidores) |
| [day-audit-log.repository.ts](#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-audit-log-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateDayAuditLogData`, `DayAuditLogRepository`, `DAY_AUDIT_LOG_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [day-opening.repository.ts](#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `ClosedDaysFilters`, `ClosedDayViewRow`, `DayOpeningRepository`, `ClosedDayStatus`, `ResultSign` (sin comentario de documentación en el código). | 1 internas | 21 | Alta (21 consumidores) |
| [warehouse-cash.reader.ts](#f-comercial-jhoel-api-src-modules-banks-domain-repositories-warehouse-cash-reader-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Read-only view of the Bodega cash balance (its own Kardex, owned by Control de Efectivo) for Cuadre de Agentes, which is the consolidated cash cuadre: caja count + Bodega. | 0 internas | 3 | Media (3 consumidores) |
| [agent-reconciliation.mapper.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `AgentReconciliationMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [agent-reconciliation.orm-entity.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `AgentReconciliationOrmEntity` (sin comentario de documentación en el código). | 2 internas; ext.: typeorm | 5 | Media (5 consumidores) |
| [bank-balance.orm-entity.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-balance-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `BankBalanceOrmEntity` (sin comentario de documentación en el código). | 3 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [bank.mapper.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `BankMapper` (sin comentario de documentación en el código). | 3 internas | 1 | Baja (1 consumidores) |
| [bank.orm-entity.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `BankOrmEntity` (sin comentario de documentación en el código). | 3 internas; ext.: typeorm | 7 | Media (7 consumidores) |
| [day-audit-log.mapper.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-audit-log-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `DayAuditLogMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [day-audit-log.orm-entity.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-audit-log-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `DayAuditLogOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [day-opening.mapper.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-opening-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `DayOpeningMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [day-opening.orm-entity.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-opening-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `DayOpeningOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [typeorm-agent-reconciliation.repository.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-agent-reconciliation-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmAgentReconciliationRepository` (sin comentario de documentación en el código). | 8 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-bank-balance.repository.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-balance-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmBankBalanceRepository` (sin comentario de documentación en el código). | 7 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-bank-movement.repository.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-movement-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmBankMovementRepository`, `MovementRow`, `TransferRow`, `MOVEMENT_SELECT`, `TRANSFER_SELECT` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-bank.repository.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmBankRepository` (sin comentario de documentación en el código). | 7 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-day-audit-log.repository.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-audit-log-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmDayAuditLogRepository` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-day-opening.repository.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-opening-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmDayOpeningRepository` (sin comentario de documentación en el código). | 9 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-warehouse-cash.reader.ts](#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-warehouse-cash-reader-ts) | .ts | Código TypeScript | Infraestructura | `SELECT warehouse_cash_balance()` (migration 1760007400000). | 1 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Baja (1 consumidores) |
| [agent-reconciliations.controller.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-agent-reconciliations-controller-ts) | .ts | Controlador | Presentación | "Guardar Cuadre" (Cuadre Agentes) — any authenticated account, same "operational, not admin-only" policy as `POST /banks/balances`/ `POST /recharges/*`. | 6 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [bank-transfers.controller.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts) | .ts | Controlador | Presentación | Finanzas → Transferencias Bancarias. | 14 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [banks.controller.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts) | .ts | Controlador | Presentación | CRUD (create/update/deactivate) is admin-only, same policy as CategoriesController/ProductsController — Sistema → Bancos is a management screen. | 33 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [closed-days.controller.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts) | .ts | Controlador | Presentación | "Sistema → Gestión de Días Cerrados" — a highly sensitive administrative module (reopens/cancels already-closed financial reconciliations). | 12 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [adjust-bank-balance.request.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-adjust-bank-balance-request-dto-ts) | .ts | DTO de entrada | Presentación | `newBalance` puede ser negativo en el DTO a propósito: solo la línea de crédito de Fundación Génesis lo admite, y esa regla vive en `apply_bank_account_movement` (una cuenta normal se rechaza allí). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [bank-balance-credit.request.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-balance-credit-request-dto-ts) | .ts | DTO de entrada | Presentación | Acreditar saldo: solo la cuenta (del catálogo existente) y un monto positivo con máximo 2 decimales. | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [bank-balance-view.response.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-balance-view-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `BankBalanceViewResponseDto`, `SaveBankBalancesResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [bank-balances-validation.query.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-balances-validation-query-dto-ts) | .ts | DTO de consulta | Presentación | Omitted = today, resolved in the controller (the same `todayIsoDate()` already used by `AgentReconciliationsController`). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [bank-balances-view.query.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-balances-view-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `BankBalancesViewQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [bank-transfer.request.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-transfer-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateBankTransferRequestDto`, `VoidBankTransferRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [bank-transfers.query.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-transfers-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `BankTransfersQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [bank.response.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `BankResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [create-agent-reconciliation.request.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-create-agent-reconciliation-request-dto-ts) | .ts | DTO de entrada | Presentación | One denomination row of the cuadre's cash count (whole quantity ≥ 0). | 2 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [create-bank.request.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-create-bank-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateBankRequestDto` (sin comentario de documentación en el código). | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [day-action-reason.request.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-day-action-reason-request-dto-ts) | .ts | DTO de entrada | Presentación | Shared by "Reabrir Día" and "Anular Día" — both require a mandatory, non-empty reason. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [day-status.query.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-day-status-query-dto-ts) | .ts | DTO de consulta | Presentación | Omitted = today, resolved in the controller. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-banks.query.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-list-banks-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListBanksQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [list-closed-days.query.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-list-closed-days-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListClosedDaysQueryDto`, `STATUSES`, `RESULT_SIGNS` (sin comentario de documentación en el código). | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [open-day.request.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-open-day-request-dto-ts) | .ts | DTO de entrada | Presentación | Omitted = today, resolved in the controller. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [save-bank-balances.request.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-save-bank-balances-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `SaveBankBalanceEntryRequestDto`, `SaveBankBalancesRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [update-bank.request.dto.ts](#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-update-bank-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateBankRequestDto` (sin comentario de documentación en el código). | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-banks-application-dtos-agent-reconciliation-output-ts"></a>

### agent-reconciliation-output.ts

- **Ruta:** [agent-reconciliation-output.ts](../../../../comercial-jhoel-api/src/modules/banks/application/dtos/agent-reconciliation-output.ts) (`comercial-jhoel-api/src/modules/banks/application/dtos/agent-reconciliation-output.ts`, 33 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de salida (aplicación): declara `toAgentReconciliationOutput`, `AgentReconciliationOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [agent-reconciliation.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-agent-reconciliation-entity-ts)
- **Consumidores:** [day-detail-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-day-detail-output-ts), [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [get-day-detail.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts), [agent-reconciliations.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-agent-reconciliations-controller-ts)

**Interfaces, tipos y enums:**

- `interface AgentReconciliationOutput` (L3): sin documentación — miembros: `id`, `date`, `totalCash`, `totalWarehouseCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `result`, `createdAt`, `createdByUsername`
#### Función `toAgentReconciliationOutput` (L17–32)

- **Tipo:** función exportada
- **Firma:** `toAgentReconciliationOutput(reconciliation: AgentReconciliation): AgentReconciliationOutput` — [agent-reconciliation-output.ts](../../../../comercial-jhoel-api/src/modules/banks/application/dtos/agent-reconciliation-output.ts#L17)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [get-day-detail.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-balance-view-output-ts"></a>

### bank-balance-view-output.ts

- **Ruta:** [bank-balance-view-output.ts](../../../../comercial-jhoel-api/src/modules/banks/application/dtos/bank-balance-view-output.ts) (`comercial-jhoel-api/src/modules/banks/application/dtos/bank-balance-view-output.ts`, 20 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de salida (aplicación): declara `toBankBalanceViewOutput`, `BankBalanceViewOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-balance-view.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-balance-view-entity-ts)
- **Consumidores:** [get-bank-balances-view.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balances-view-use-case-ts)

**Interfaces, tipos y enums:**

- `interface BankBalanceViewOutput` (L3): sin documentación — miembros: `bankId`, `bankName`, `accountNumber`, `accountTypeName`, `previousBalance`, `finalBalance`, `currentBalance`, `specialAccount`, `maxBalance`
#### Función `toBankBalanceViewOutput` (L15–19)

- **Tipo:** función exportada
- **Firma:** `toBankBalanceViewOutput(view: BankBalanceView): BankBalanceViewOutput` — [bank-balance-view-output.ts](../../../../comercial-jhoel-api/src/modules/banks/application/dtos/bank-balance-view-output.ts#L15)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-balances-validation-output-ts"></a>

### bank-balances-validation-output.ts

- **Ruta:** [bank-balances-validation-output.ts](../../../../comercial-jhoel-api/src/modules/banks/application/dtos/bank-balances-validation-output.ts) (`comercial-jhoel-api/src/modules/banks/application/dtos/bank-balances-validation-output.ts`, 24 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de salida (aplicación): declara `MissingBankInfo`, `BankBalancesValidationOutput` (sin comentario de documentación en el código).
- **Consumidores:** [validate-bank-balances-for-date.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface MissingBankInfo` (L1): sin documentación — miembros: `id`, `name`
- `interface BankBalancesValidationOutput` (L17): Answers "¿se guardaron los saldos bancarios de ESTA FECHA?" — never "¿el banco tiene un saldo actual?" (that would be reading `banks. — miembros: `date`, `canReconcile`, `totalActiveBanks`, `banksWithBalance`, `missingBanks`
<a id="f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-movement-output-ts"></a>

### bank-movement-output.ts

- **Ruta:** [bank-movement-output.ts](../../../../comercial-jhoel-api/src/modules/banks/application/dtos/bank-movement-output.ts) (`comercial-jhoel-api/src/modules/banks/application/dtos/bank-movement-output.ts`, 16 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de salida (aplicación): declara `PaginatedBankMovementsOutput`, `BankMovementOutput`, `BankTransferOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts)
- **Consumidores:** [adjust-bank-balance.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-adjust-bank-balance-use-case-ts), [list-bank-balance-credits.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-balance-credits-use-case-ts), [list-bank-movements.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-movements-use-case-ts), [list-bank-transfers.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-transfers-use-case-ts), [register-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-balance-credit-use-case-ts), [register-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-transfer-use-case-ts), [void-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-balance-credit-use-case-ts), [void-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-transfer-use-case-ts), [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface PaginatedBankMovementsOutput` (L10): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `type BankMovementOutput` (L7) = `BankAccountMovement` — El ledger ya es una proyección plana de solo lectura — la salida es la misma forma.
- `type BankTransferOutput` (L8) = `BankTransfer`
<a id="f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-output-ts"></a>

### bank-output.ts

- **Ruta:** [bank-output.ts](../../../../comercial-jhoel-api/src/modules/banks/application/dtos/bank-output.ts) (`comercial-jhoel-api/src/modules/banks/application/dtos/bank-output.ts`, 44 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de salida (aplicación): declara `toBankOutput`, `BankOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-entity-ts)
- **Consumidores:** [create-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-create-bank-use-case-ts), [get-bank-by-id.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-by-id-use-case-ts), [list-banks.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-banks-use-case-ts), [update-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-update-bank-use-case-ts)

**Interfaces, tipos y enums:**

- `interface BankOutput` (L3): sin documentación — miembros: `id`, `name`, `accountNumber`, `accountTypeId`, `accountTypeName`, `previousBalance`, `finalBalance`, `specialAccount`, `maxBalance`, `availableInTransaccionar`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
#### Función `toBankOutput` (L23–43)

- **Tipo:** función exportada
- **Firma:** `toBankOutput(bank: Bank): BankOutput` — [bank-output.ts](../../../../comercial-jhoel-api/src/modules/banks/application/dtos/bank-output.ts#L23)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-create-bank-use-case-ts), [get-bank-by-id.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-by-id-use-case-ts), [update-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-update-bank-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-dtos-closed-day-output-ts"></a>

### closed-day-output.ts

- **Ruta:** [closed-day-output.ts](../../../../comercial-jhoel-api/src/modules/banks/application/dtos/closed-day-output.ts) (`comercial-jhoel-api/src/modules/banks/application/dtos/closed-day-output.ts`, 29 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de salida (aplicación): declara `toClosedDayOutput`, `ClosedDayOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts)
- **Consumidores:** [list-closed-days.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-closed-days-use-case-ts), [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts)

**Interfaces, tipos y enums:**

- `interface ClosedDayOutput` (L6): sin documentación — miembros: `date`, `status`, `openedAt`, `openedByUsername`, `closedAt`, `closedByUsername`, `reopenedAt`, `reopenedByUsername`, `reopenReason`, `cancelledAt`, `cancelledByUsername`, `cancelReason`, `totalBanks`, `totalCash`, `totalAccountsReceivable`, `totalAssets`, `result`
#### Función `toClosedDayOutput` (L26–28)

- **Tipo:** función exportada
- **Firma:** `toClosedDayOutput(row: ClosedDayViewRow): ClosedDayOutput` — [closed-day-output.ts](../../../../comercial-jhoel-api/src/modules/banks/application/dtos/closed-day-output.ts#L26)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-banks-application-dtos-cuadre-agentes-summary-output-ts"></a>

### cuadre-agentes-summary-output.ts

- **Ruta:** [cuadre-agentes-summary-output.ts](../../../../comercial-jhoel-api/src/modules/banks/application/dtos/cuadre-agentes-summary-output.ts) (`comercial-jhoel-api/src/modules/banks/application/dtos/cuadre-agentes-summary-output.ts`, 32 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Whether this bank's `finalBalance` adds to or subtracts from `totalBanks` — see `isCreditLineAccountType` for how it's decided.
- **Descripción del autor (comentario del archivo):** Whether this bank's `finalBalance` adds to or subtracts from `totalBanks` — see `isCreditLineAccountType` for how it's decided. Exposed so the frontend never has to re-derive it from `accountTypeName` itself.
- **Consumidores:** [get-cuadre-agentes-summary.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface BankBalanceSummaryItem` (L4): sin documentación — miembros: `id`, `name`, `accountTypeId`, `accountTypeName`, `finalBalance`, `specialAccount`, `calculationType`
- `interface CuadreAgentesSummaryOutput` (L15): sin documentación — miembros: `banks`, `totalBanks`, `totalPositiveAccounts`, `totalCreditLines`, `totalAssets`, `totalAccountsReceivable`, `totalWarehouseCash`
- `type BankBalanceCalculationType` (L2) = `'sum' \| 'subtract'` — Whether this bank's `finalBalance` adds to or subtracts from `totalBanks` — see `isCreditLineAccountType` for how it's decided.
<a id="f-comercial-jhoel-api-src-modules-banks-application-dtos-day-detail-output-ts"></a>

### day-detail-output.ts

- **Ruta:** [day-detail-output.ts](../../../../comercial-jhoel-api/src/modules/banks/application/dtos/day-detail-output.ts) (`comercial-jhoel-api/src/modules/banks/application/dtos/day-detail-output.ts`, 47 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de salida (aplicación): declara `DayAuditLogOutput`, `DayDetailOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [bank-balance-view.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-balance-view-entity-ts), [agent-reconciliation-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-agent-reconciliation-output-ts), [day-audit-log.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-day-audit-log-entity-ts)
- **Consumidores:** [cancel-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-cancel-day-use-case-ts), [get-day-detail.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts), [reopen-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-reopen-day-use-case-ts), [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts)

**Interfaces, tipos y enums:**

- `interface DayAuditLogOutput` (L6): sin documentación — miembros: `id`, `action`, `performedByUsername`, `performedAt`, `reason`, `previousStatus`, `newStatus`
- `interface DayDetailOutput` (L29): "Ver Detalle" of a closed day — composes reads that already exist in other use cases (`BankBalanceRepository.findBalancesView`, `AgentReconciliationRepository.findLatestByDate`), never duplicates them. — miembros: `date`, `status`, `openedAt`, `openedByUsername`, `closedAt`, `closedByUsername`, `reopenedAt`, `reopenedByUsername`, `reopenReason`, `isCancelled`, `cancelledAt`, `cancelledByUsername`, `cancelReason`, `banks`, `reconciliation`, `auditLog`
<a id="f-comercial-jhoel-api-src-modules-banks-application-dtos-day-status-output-ts"></a>

### day-status-output.ts

- **Ruta:** [day-status-output.ts](../../../../comercial-jhoel-api/src/modules/banks/application/dtos/day-status-output.ts) (`comercial-jhoel-api/src/modules/banks/application/dtos/day-status-output.ts`, 45 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** The conceptual state of a date's "working cycle" — seven values, always derived from the same three independent facts (`isOpened`/`bankBalancesSaved`/`isClosed`), never stored separately: - `NOT_OPENED`: no `day_openings` row exists for this date.
- **Descripción del autor (comentario del archivo):** The conceptual state of a date's "working cycle" — seven values, always derived from the same three independent facts (`isOpened`/`bankBalancesSaved`/`isClosed`), never stored separately: - `NOT_OPENED`: no `day_openings` row exists for this date. - `OPENED`: opened, but not every active bank has a balance saved for this date yet. - `BANK_BALANCES_SAVED`: every balance saved, cuadre not done yet — Cuadre Agentes is now enabled. - `RECONCILIATION_COMPLETED`: a cuadre exists for this date but the day was never formally closed — can only happen on data that predates "Cierre del Día" (since that t
- **Consumidores:** [get-day-status.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-status-use-case-ts), [open-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-open-day-use-case-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface DayStatusOutput` (L35): sin documentación — miembros: `date`, `status`, `isOpened`, `bankBalancesSaved`, `canAccessReconciliation`, `reconciliationCompleted`, `isClosed`, `isCancelled`
- `type DayWorkStatus` (L26) = `\| 'NOT_OPENED' \| 'OPENED' \| 'BANK_BALANCES_SAVED' \| 'RECONCILIATION_COMPLETED' \| 'CLOSED' \| 'REOPENED' \| 'CANCELLED'` — The conceptual state of a date's "working cycle" — seven values, always derived from the same three independent facts (`isOpened`/`bankBalancesSaved`/`isClosed`), never stored separately: - `NOT_OPENED`: no `day_openings` row exists for this date.
<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-adjust-bank-balance-use-case-ts"></a>

### adjust-bank-balance.use-case.ts

- **Ruta:** [adjust-bank-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/adjust-bank-balance.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/adjust-bank-balance.use-case.ts`, 46 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "Ajustar saldo" — la única vía para corregir a mano el saldo actual de una cuenta.
- **Depende de (archivos del proyecto):** [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts), [bank-movement-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-movement-output-ts), [today-iso-date.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface AdjustBankBalanceInput` (L8): sin documentación — miembros: `bankId`, `newBalance`, `reason`, `observation`, `userId`

#### Clase `AdjustBankBalanceUseCase` (L23–45)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Ajustar saldo" — la única vía para corregir a mano el saldo actual de una cuenta. Solo admin/super_admin (lo exige el controlador con `@Roles`). Nunca sobrescribe ni borra historial: `adjust_bank_balance` registra la diferencia como un movimiento AJUSTE_MANUAL con saldo anterior, saldo nuevo, motivo, observación, usuario y fecha.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_MOVEMENT_REPOSITORY) bankMovementRepository: BankMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–44 | `input: AdjustBankBalanceInput` | `Promise<BankMovementOutput>` |

##### `AdjustBankBalanceUseCase.execute`

- **Firma:** `execute(input: AdjustBankBalanceInput): Promise<BankMovementOutput>` — [adjust-bank-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/adjust-bank-balance.use-case.ts#L30) (L30–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.reason?.trim`, `new MovementReasonRequiredError`, `this.bankMovementRepository.adjustBalance`, `todayIsoDate`, `input.observation?.trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new MovementReasonRequiredError()`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-assert-bank-operation-day-open-ts"></a>

### assert-bank-operation-day-open.ts

- **Ruta:** [assert-bank-operation-day-open.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/assert-bank-operation-day-open.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/assert-bank-operation-day-open.ts`, 26 líneas)
- **Tipo:** Código TypeScript · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Las operaciones que mueven saldo (transferencias) respetan el mismo ciclo de día abierto/cerrado que Transaccionar y el cuadre — nunca un ciclo paralelo.
- **Depende de (archivos del proyecto):** [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts)
- **Consumidores:** [register-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-balance-credit-use-case-ts), [register-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-transfer-use-case-ts), [register-cash-bank-deposit.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts)
#### Función `assertBankOperationDayOpen` (L14–25)

- **Tipo:** función exportada, async
- **Firma:** `assertBankOperationDayOpen(dayOpeningRepository: DayOpeningRepository, businessDate: string): Promise<void>` — [assert-bank-operation-day-open.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/assert-bank-operation-day-open.ts#L14)
- **Propósito / descripción:** Las operaciones que mueven saldo (transferencias) respetan el mismo ciclo de día abierto/cerrado que Transaccionar y el cuadre — nunca un ciclo paralelo. Los ajustes manuales y las anulaciones (acciones de administración) no pasan por aquí, igual que la anulación de Transaccionar o la reapertura de días.
- **Dependencias:** `dayOpeningRepository.findByDate`, `new BankOperationDayNotOpenedError`, `new BankOperationDayClosedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BankOperationDayNotOpenedError(businessDate)`, `new BankOperationDayClosedError(businessDate)`
- **Consumidores:** [register-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-balance-credit-use-case-ts), [register-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-transfer-use-case-ts), [register-cash-bank-deposit.use-case.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-application-use-cases-register-cash-bank-deposit-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts"></a>

### bank-movements.use-cases.spec.ts

- **Ruta:** [bank-movements.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/bank-movements.use-cases.spec.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/bank-movements.use-cases.spec.ts`, 476 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Prueba unitaria: declara `buildDayOpening`, `buildTransfer`, `mockRepository`, `buildCreditMovement` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [register-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-transfer-use-case-ts), [void-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-transfer-use-case-ts), [adjust-bank-balance.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-adjust-bank-balance-use-case-ts), [list-bank-movements.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-movements-use-case-ts), [register-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-balance-credit-use-case-ts), [void-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-balance-credit-use-case-ts), [list-bank-balance-credits.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-balance-credits-use-case-ts), [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [day-opening.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-day-opening-entity-ts), [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts), [today-iso-date.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-utils-today-iso-date-ts)
- **Consumidores:** —
#### Función `buildDayOpening` (L27–47)

- **Tipo:** función local del archivo
- **Firma:** `buildDayOpening(closedAt: Date \| null): DayOpening` — [bank-movements.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/bank-movements.use-cases.spec.ts#L27)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `DayOpening.create`, `todayIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildTransfer` (L49–78)

- **Tipo:** función local del archivo
- **Firma:** `buildTransfer(status?: 'APLICADO' \| 'ANULADO'): BankTransfer` — [bank-movements.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/bank-movements.use-cases.spec.ts#L49)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `todayIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `mockRepository` (L80–94)

- **Tipo:** función local del archivo
- **Firma:** `mockRepository(): jest.Mocked<BankMovementRepository>` — [bank-movements.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/bank-movements.use-cases.spec.ts#L80)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `jest.fn`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildCreditMovement` (L324–358)

- **Tipo:** función local del archivo
- **Firma:** `buildCreditMovement(balanceBefore: number, amount: number, status?: 'APLICADO' \| 'ANULADO'): BankAccountMovement` — [bank-movements.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/bank-movements.use-cases.spec.ts#L324)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `todayIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-cancel-day-use-case-ts"></a>

### cancel-day.use-case.ts

- **Ruta:** [cancel-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/cancel-day.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/cancel-day.use-case.ts`, 39 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "Anular Día" — a soft delete of the whole cycle (see `cancel_agent_day`, SQL): never deletes `bank_balances`/`agent_reconciliations`, only marks `day_openings.is_cancelled`.
- **Depende de (archivos del proyecto):** [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [reason-required.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-reason-required-error-ts), [get-day-detail.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts), [day-detail-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-day-detail-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts)

**Interfaces, tipos y enums:**

- `interface CancelDayInput` (L8): sin documentación — miembros: `date`, `userId`, `reason`

#### Clase `CancelDayUseCase` (L21–38)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Anular Día" — a soft delete of the whole cycle (see `cancel_agent_day`, SQL): never deletes `bank_balances`/`agent_reconciliations`, only marks `day_openings.is_cancelled`. Same division of responsibility as `ReopenDayUseCase`: role already filtered by the guard, real integrity validated atomically in the SQL function.
- **Dependencias inyectadas (constructor):** `@Inject(DAY_OPENING_REPOSITORY) dayOpeningRepository: DayOpeningRepository`, `getDayDetailUseCase: GetDayDetailUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 29–37 | `input: CancelDayInput` | `Promise<DayDetailOutput>` |

##### `CancelDayUseCase.execute`

- **Firma:** `execute(input: CancelDayInput): Promise<DayDetailOutput>` — [cancel-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/cancel-day.use-case.ts#L29) (L29–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.reason?.trim`, `new CancelReasonRequiredError`, `this.dayOpeningRepository.cancel`, `this.getDayDetailUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CancelReasonRequiredError()`
- **Consumidores:** [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-spec-ts"></a>

### close-agent-day.use-case.spec.ts

- **Ruta:** [close-agent-day.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/close-agent-day.use-case.spec.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/close-agent-day.use-case.spec.ts`, 210 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Prueba unitaria: declara `breakdown`, `code`, `ACCEPTANCE` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-agent-reconciliation-repository-ts)
- **Consumidores:** —
#### Función `breakdown` (L22–34)

- **Tipo:** función local del archivo
- **Firma:** `breakdown(overrides?: Partial<CuadreCashBreakdownData>): CuadreCashBreakdownData` — [close-agent-day.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/close-agent-day.use-case.spec.ts#L22)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `ACCEPTANCE.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `code` (L36–43)

- **Tipo:** función local del archivo
- **Firma:** `code(fn: () => void): string \| undefined` — [close-agent-day.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/close-agent-day.use-case.spec.ts#L36)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `fn`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts"></a>

### close-agent-day.use-case.ts

- **Ruta:** [close-agent-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/close-agent-day.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/close-agent-day.use-case.ts`, 161 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "Guardar Cuadre" is no longer just a historical `INSERT` — since the "Cierre del Día" ticket, it also officially closes that date's working cycle (`day_openings.closed_at`) in the same atomic operation (see `AgentReconciliationRepository.closeDayWithReconciliation` / `close_agent_day` in the database).
- **Depende de (archivos del proyecto):** [agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-agent-reconciliation-repository-ts), [cuadre-cash-breakdown.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-cuadre-cash-breakdown-error-ts), [cash-denominations.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-cash-denominations-ts), [cash-control.policy.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-policies-cash-control-policy-ts), [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [get-cuadre-agentes-summary.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-ts), [validate-bank-balances-for-date.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-ts), [bank-balances-not-registered.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-balances-not-registered-error-ts), [day-not-opened.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-not-opened-error-ts), [day-already-closed.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-already-closed-error-ts), [agent-reconciliation-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-agent-reconciliation-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [close-agent-day.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-spec-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [agent-reconciliations.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-agent-reconciliations-controller-ts)

**Interfaces, tipos y enums:**

- `interface CloseAgentDayInput` (L26): sin documentación — miembros: `totalCash`, `date`, `userId`, `role`, `cashBreakdown`

#### Clase `CloseAgentDayUseCase` (L101–160)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Guardar Cuadre" is no longer just a historical `INSERT` — since the "Cierre del Día" ticket, it also officially closes that date's working cycle (`day_openings.closed_at`) in the same atomic operation (see `AgentReconciliationRepository.closeDayWithReconciliation` / `close_agent_day` in the database). There is no path where the reconciliation ends up saved without the day being closed, or vice versa. The three validations ("is it open?", "are balances saved?", "is it already closed?") are checked here BEFORE touching the database — same as before this ticket — and are checked again inside the SQL function itself under the `day_openings` row lock: this layer is what gives the specific error message and avoids the database round-trip in the common case; the SQL function is the real guarantee against a race between two near-simultaneous saves for the same date. Optional cash breakdown (den
- **Dependencias inyectadas (constructor):** `@Inject(AGENT_RECONCILIATION_REPOSITORY) repository: AgentReconciliationRepository`, `@Inject(DAY_OPENING_REPOSITORY) dayOpeningRepository: DayOpeningRepository`, `getCuadreAgentesSummaryUseCase: GetCuadreAgentesSummaryUseCase`, `validateBankBalancesForDateUseCase: ValidateBankBalancesForDateUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 112–159 | `input: CloseAgentDayInput` | `Promise<AgentReconciliationOutput>` |

##### `CloseAgentDayUseCase.execute`

- **Firma:** `execute(input: CloseAgentDayInput): Promise<AgentReconciliationOutput>` — [close-agent-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/close-agent-day.use-case.ts#L112) (L112–159)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertCuadreCashBreakdown`, `this.dayOpeningRepository.findByDate`, `new DayNotOpenedError`, `new DayAlreadyClosedError`, `this.validateBankBalancesForDateUseCase.execute`, `new BankBalancesNotRegisteredError`, `this.getCuadreAgentesSummaryUseCase.execute`, `this.repository.closeDayWithReconciliation`, `toAgentReconciliationOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new DayNotOpenedError(input.date, 'reconciliation')`, `new DayAlreadyClosedError(input.date)`, `new BankBalancesNotRegisteredError(input.date)`
- **Consumidores:** [agent-reconciliations.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-agent-reconciliations-controller-ts)

#### Función `assertCuadreCashBreakdown` (L43–74)

- **Tipo:** función exportada
- **Firma:** `assertCuadreCashBreakdown(totalCash: number, breakdown: CuadreCashBreakdownData, role: string \| undefined): void` — [close-agent-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/close-agent-day.use-case.ts#L43)
- **Propósito / descripción:** Validates a cuadre's cash breakdown before any database round-trip: known denominations (Q200 … Q0.01), whole quantities ≥ 0, one row per denomination, exact total (integer centavos) equal to `totalCash`, and a consistent origin. The SQL function re-checks all of it, plus the source arqueo's validity, under the same transaction as the close.
- **Dependencias:** `new Set`, `toCents`, `isValidDenomination`, `Number.isInteger`, `seen.has`, `new CuadreCashBreakdownError`, `seen.add`, `breakdownTotal`, `assertCashCustodyPermission`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CuadreCashBreakdownError('CUADRE_CASH_BREAKDOWN_INVALID')`, `new CuadreCashBreakdownError('CUADRE_CASH_BREAKDOWN_MISMATCH')`, `new CuadreCashBreakdownError('CUADRE_SOURCE_COUNT_FORBIDDEN')`
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-create-bank-use-case-ts"></a>

### create-bank.use-case.ts

- **Ruta:** [create-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/create-bank.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/create-bank.use-case.ts`, 89 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Caso de uso: declara `CreateBankUseCase`, `CreateBankInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-repositories-account-type-repository-ts), [bank-already-exists.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-already-exists-error-ts), [invalid-account-type.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-invalid-account-type-error-ts), [bank-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-output-ts), [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateBankInput` (L16): sin documentación — miembros: `name`, `accountNumber`, `accountTypeId`, `previousBalance`, `finalBalance`, `specialAccount`, `maxBalance`, `availableInTransaccionar`, `createdBy`

#### Clase `CreateBankUseCase` (L28–88)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_REPOSITORY) bankRepository: BankRepository`, `@Inject(ACCOUNT_TYPE_REPOSITORY) accountTypeRepository: AccountTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 37–87 | `input: CreateBankInput` | `Promise<BankOutput>` |

##### `CreateBankUseCase.execute`

- **Firma:** `execute(input: CreateBankInput): Promise<BankOutput>` — [create-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/create-bank.use-case.ts#L37) (L37–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.name.trim().replace`, `input.name.trim`, `input.accountNumber.trim`, `this.accountTypeRepository.findById`, `new InvalidAccountTypeError`, `this.bankRepository.findByActiveNameAndAccountNumber`, `new BankAlreadyExistsError`, `new CreditLinePositiveBalanceError`, `new CreditLineLimitExceededError`, `new InsufficientBankBalanceError`, `this.bankRepository.create`, `toBankOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidAccountTypeError()`, `new BankAlreadyExistsError(name, accountNumber)`, `new CreditLinePositiveBalanceError()`, `new CreditLineLimitExceededError('SALDO_INICIAL')`, `new InsufficientBankBalanceError('AJUSTE_MANUAL')`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-deactivate-bank-use-case-ts"></a>

### deactivate-bank.use-case.ts

- **Ruta:** [deactivate-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/deactivate-bank.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/deactivate-bank.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Soft delete only — DELETE /banks/:id never removes the row, and every past bank_balances entry keeps referencing it (RESTRICT FK, never CASCADE).
- **Depende de (archivos del proyecto):** [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [bank-not-found.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `DeactivateBankUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — DELETE /banks/:id never removes the row, and every past bank_balances entry keeps referencing it (RESTRICT FK, never CASCADE).
- **Dependencias inyectadas (constructor):** `@Inject(BANK_REPOSITORY) bankRepository: BankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<void>` |

##### `DeactivateBankUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/deactivate-bank.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankRepository.findById`, `new BankNotFoundError`, `this.bankRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BankNotFoundError(id)`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-spec-ts"></a>

### get-bank-balance-strip.use-case.spec.ts

- **Ruta:** [get-bank-balance-strip.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-bank-balance-strip.use-case.spec.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/get-bank-balance-strip.use-case.spec.ts`, 120 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Prueba unitaria: declara `bank` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [get-bank-balance-strip.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-ts), [bank.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-entity-ts), [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts), [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts)
- **Consumidores:** —
#### Función `bank` (L7–31)

- **Tipo:** función local del archivo
- **Firma:** `bank(id: string, specialAccount: BankSpecialAccount \| null, availableInTransaccionar?): Bank` — [get-bank-balance-strip.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-bank-balance-strip.use-case.spec.ts#L7)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Bank.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-ts"></a>

### get-bank-balance-strip.use-case.ts

- **Ruta:** [get-bank-balance-strip.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-bank-balance-strip.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/get-bank-balance-strip.use-case.ts`, 100 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** La "tira de saldos" de Transaccionar y del Resumen: saldo actual de las cuentas principales (las marcadas "En Transaccionar" en Sistema → Bancos, más Génesis y BI Club) y si su ÚLTIMA transacción subió o bajó el saldo.
- **Depende de (archivos del proyecto):** [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [get-bank-balance-strip.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-spec-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface BankBalanceStripItem` (L11): sin documentación — miembros: `bankId`, `bankName`, `accountNumber`, `accountTypeName`, `specialAccount`, `currentBalance`, `lastChange`, `lastMovementAt`, `trend`, `trendTone`
- `type BankBalanceTrend` (L8) = `'UP' \| 'DOWN' \| 'FLAT'`
- `type BankBalanceTrendTone` (L9) = `'POSITIVE' \| 'NEGATIVE' \| 'NEUTRAL'`

#### Clase `GetBankBalanceStripUseCase` (L52–99)

- **Decoradores:** `@Injectable()`
- **Propósito:** La "tira de saldos" de Transaccionar y del Resumen: saldo actual de las cuentas principales (las marcadas "En Transaccionar" en Sistema → Bancos, más Génesis y BI Club) y si su ÚLTIMA transacción subió o bajó el saldo. Todo se calcula aquí, a partir del ledger — el frontend solo pinta `trend`/`trendTone`.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_REPOSITORY) bankRepository: BankRepository`, `@Inject(BANK_MOVEMENT_REPOSITORY) bankMovementRepository: BankMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 61–98 | — | `Promise<BankBalanceStripItem[]>` |

##### `GetBankBalanceStripUseCase.execute`

- **Firma:** `execute(): Promise<BankBalanceStripItem[]>` — [get-bank-balance-strip.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-bank-balance-strip.use-case.ts#L61) (L61–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.bankRepository.findAll`, `this.bankMovementRepository.getLastMovementByBank`, `banks.filter`, `ALWAYS_VISIBLE_ACCOUNTS.has`, `changes.get`, `INVERSE_TONE_ACCOUNTS.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balances-view-use-case-ts"></a>

### get-bank-balances-view.use-case.ts

- **Ruta:** [get-bank-balances-view.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-bank-balances-view.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/get-bank-balances-view.use-case.ts`, 36 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Caso de uso: declara `GetBankBalancesViewUseCase`, `GetBankBalancesViewInput`, `DATE_PATTERN` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-balance-repository-ts), [invalid-bank-balance.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-invalid-bank-balance-error-ts), [bank-balance-view-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-balance-view-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface GetBankBalancesViewInput` (L10): sin documentación — miembros: `operationDate`

#### Clase `GetBankBalancesViewUseCase` (L16–35)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_BALANCE_REPOSITORY) bankBalanceRepository: BankBalanceRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 23–34 | `input: GetBankBalancesViewInput` | `Promise<BankBalanceViewOutput[]>` |

##### `GetBankBalancesViewUseCase.execute`

- **Firma:** `execute(input: GetBankBalancesViewInput): Promise<BankBalanceViewOutput[]>` — [get-bank-balances-view.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-bank-balances-view.use-case.ts#L23) (L23–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `DATE_PATTERN.test`, `new InvalidBankBalanceDateError`, `this.bankBalanceRepository.findBalancesView`, `views.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidBankBalanceDateError()`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-by-id-use-case-ts"></a>

### get-bank-by-id.use-case.ts

- **Ruta:** [get-bank-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-bank-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/get-bank-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Caso de uso: declara `GetBankByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [bank-not-found.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-not-found-error-ts), [bank-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `GetBankByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_REPOSITORY) bankRepository: BankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<BankOutput>` |

##### `GetBankByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<BankOutput>` — [get-bank-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-bank-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankRepository.findById`, `new BankNotFoundError`, `toBankOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BankNotFoundError(id)`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-spec-ts"></a>

### get-cuadre-agentes-summary.use-case.spec.ts

- **Ruta:** [get-cuadre-agentes-summary.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-cuadre-agentes-summary.use-case.spec.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/get-cuadre-agentes-summary.use-case.spec.ts`, 118 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Prueba unitaria: declara `bank`, `run` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [get-cuadre-agentes-summary.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-ts), [bank.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-entity-ts), [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts), [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts)
- **Consumidores:** —
#### Función `bank` (L8–33)

- **Tipo:** función local del archivo
- **Firma:** `bank(id: string, finalBalance: number, specialAccount: BankSpecialAccount \| null, accountTypeName?): Bank` — [get-cuadre-agentes-summary.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-cuadre-agentes-summary.use-case.spec.ts#L8)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Bank.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `run` (L35–51)

- **Tipo:** función local del archivo, async
- **Firma:** `run(banks: Bank[])` — [get-cuadre-agentes-summary.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-cuadre-agentes-summary.use-case.spec.ts#L35)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `jest.fn().mockResolvedValue`, `jest.fn`, `new GetCuadreAgentesSummaryUseCase`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-ts"></a>

### get-cuadre-agentes-summary.use-case.ts

- **Ruta:** [get-cuadre-agentes-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-cuadre-agentes-summary.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/get-cuadre-agentes-summary.use-case.ts`, 136 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "Cuadre Agentes" (primera etapa) — a single read-only aggregate spanning three otherwise-independent modules (Bancos, Activos, Cuentas por Cobrar), the same cross-module reuse pattern `GetAssetsReceivablesReportUseCase` already established: inject the other modules' own repositories rather than re-q
- **Depende de (archivos del proyecto):** [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [warehouse-cash.reader.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-warehouse-cash-reader-ts), [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts), [cuadre-agentes-summary-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-cuadre-agentes-summary-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [get-cuadre-agentes-summary.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-spec-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `GetCuadreAgentesSummaryUseCase` (L66–135)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Cuadre Agentes" (primera etapa) — a single read-only aggregate spanning three otherwise-independent modules (Bancos, Activos, Cuentas por Cobrar), the same cross-module reuse pattern `GetAssetsReceivablesReportUseCase` already established: inject the other modules' own repositories rather than re-querying their tables directly, so there is exactly one place that knows how to compute each total (`AssetRepository`/`AccountReceivableRepository.getReportSummary` are the exact same real-SQL-aggregate methods Reportería already uses — see that module's own "never sum in memory over one page" note). **Saldos dinámicos (`CreateBankAccountMovements`)**: `banks.final_balance` ahora es el saldo ACTUAL de cada cuenta (movido por Transaccionar, transferencias y ajustes), así que este resumen ya refleja el saldo real sin ningún cálculo adicional. Se usa con su signo real — la línea de crédito de Géne
- **Dependencias inyectadas (constructor):** `@Inject(BANK_REPOSITORY) bankRepository: BankRepository`, `@Inject(ASSET_REPOSITORY) assetRepository: AssetRepository`, `@Inject(ACCOUNT_RECEIVABLE_REPOSITORY) accountReceivableRepository: AccountReceivableRepository`, `@Inject(WAREHOUSE_CASH_READER) warehouseCashReader: WarehouseCashReader`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 79–134 | — | `Promise<CuadreAgentesSummaryOutput>` |

##### `GetCuadreAgentesSummaryUseCase.execute`

- **Firma:** `execute(): Promise<CuadreAgentesSummaryOutput>` — [get-cuadre-agentes-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-cuadre-agentes-summary.use-case.ts#L79) (L79–134)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.bankRepository.findAll`, `this.assetRepository.getReportSummary`, `this.accountReceivableRepository.getReportSummary`, `this.warehouseCashReader.getBalance`, `banks.filter((bank) => !isOutsideAgentReconciliation(bank.specialAccount)).map`, `banks.filter`, `isOutsideAgentReconciliation`, `isCreditLineAccountType`, `bankItems.filter((bank) => bank.calculationType === 'sum').reduce`, `bankItems.filter`, `bankItems.filter((bank) => bank.calculationType === 'subtract').reduce`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Función `isCreditLineAccountType` (L30–37)

- **Tipo:** función local del archivo
- **Firma:** `isCreditLineAccountType(accountTypeName: string): boolean` — [get-cuadre-agentes-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-cuadre-agentes-summary.use-case.ts#L30)
- **Propósito / descripción:** `account_types.name` is admin-editable free text (Sistema → Tipos de Cuenta), not a fixed enum — confirmed directly against this database before writing this, not assumed: the real seeded rows are `"Ahorros"`, `"Monetaria"`, and `"Linea Crédito"` (no "de", a different accent placement than the ticket's own "Línea de Crédito" example — exactly the kind of variation the ticket warned to check for instead of guessing). Matching on a normalized (accent-stripped, lower-cased) substring of "credito" is what makes this robust to that spelling and to "Línea de Crédito"/"Linea de Credito"/a bare "Crédito" alike, without depending on today's specific row IDs — a stable numeric/enum discriminator would
- **Dependencias:** `accountTypeName.normalize('NFD').replace`, `accountTypeName.normalize`, `new RegExp`, `normalized.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts"></a>

### get-day-detail.use-case.ts

- **Ruta:** [get-day-detail.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-day-detail.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/get-day-detail.use-case.ts`, 89 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "Ver Detalle" — composes reads from four repositories that already exist (day, bank balances, current reconciliation, audit trail), never duplicates them.
- **Depende de (archivos del proyecto):** [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-agent-reconciliation-repository-ts), [bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-balance-repository-ts), [day-audit-log.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-audit-log-repository-ts), [day-not-found.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-not-found-error-ts), [agent-reconciliation-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-agent-reconciliation-output-ts), [day-detail-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-day-detail-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [cancel-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-cancel-day-use-case-ts), [reopen-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-reopen-day-use-case-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts)

#### Clase `GetDayDetailUseCase` (L22–88)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Ver Detalle" — composes reads from four repositories that already exist (day, bank balances, current reconciliation, audit trail), never duplicates them. Only applies to a day that was ever closed (`DayNotFoundError` if no `day_openings` row ever existed for that date) — a day still in progress isn't this administrative module's responsibility.
- **Dependencias inyectadas (constructor):** `@Inject(DAY_OPENING_REPOSITORY) dayOpeningRepository: DayOpeningRepository`, `@Inject(AGENT_RECONCILIATION_REPOSITORY) agentReconciliationRepository: AgentReconciliationRepository`, `@Inject(BANK_BALANCE_REPOSITORY) bankBalanceRepository: BankBalanceRepository`, `@Inject(DAY_AUDIT_LOG_REPOSITORY) dayAuditLogRepository: DayAuditLogRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 35–87 | `date: string` | `Promise<DayDetailOutput>` |

##### `GetDayDetailUseCase.execute`

- **Firma:** `execute(date: string): Promise<DayDetailOutput>` — [get-day-detail.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-day-detail.use-case.ts#L35) (L35–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dayOpeningRepository.findByDate`, `new DayNotFoundError`, `Promise.all`, `this.bankBalanceRepository.findBalancesView`, `this.agentReconciliationRepository.findLatestByDate`, `this.dayAuditLogRepository.findByDate`, `toAgentReconciliationOutput`, `auditLog.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new DayNotFoundError(date)`
- **Consumidores:** [cancel-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-cancel-day-use-case-ts), [reopen-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-reopen-day-use-case-ts), [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-status-use-case-ts"></a>

### get-day-status.use-case.ts

- **Ruta:** [get-day-status.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-day-status.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/get-day-status.use-case.ts`, 78 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Combines three independent sources into a single response — never duplicates their logic: `DayOpeningRepository` (is it open?
- **Depende de (archivos del proyecto):** [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-agent-reconciliation-repository-ts), [validate-bank-balances-for-date.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-ts), [day-status-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-day-status-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [open-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-open-day-use-case-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `GetDayStatusUseCase` (L18–77)

- **Decoradores:** `@Injectable()`
- **Propósito:** Combines three independent sources into a single response — never duplicates their logic: `DayOpeningRepository` (is it open? is it closed?), `ValidateBankBalancesForDateUseCase` (are balances saved? — the same use case the Cuadre Agentes endpoint already uses and that `CloseAgentDayUseCase` already enforces on save), and `AgentReconciliationRepository` (was the cuadre already done? — informational, see `DayWorkStatus`).
- **Dependencias inyectadas (constructor):** `@Inject(DAY_OPENING_REPOSITORY) dayOpeningRepository: DayOpeningRepository`, `@Inject(AGENT_RECONCILIATION_REPOSITORY) agentReconciliationRepository: AgentReconciliationRepository`, `validateBankBalancesForDateUseCase: ValidateBankBalancesForDateUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 28–76 | `date: string` | `Promise<DayStatusOutput>` |

##### `GetDayStatusUseCase.execute`

- **Firma:** `execute(date: string): Promise<DayStatusOutput>` — [get-day-status.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-day-status.use-case.ts#L28) (L28–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.dayOpeningRepository.findByDate`, `this.validateBankBalancesForDateUseCase.execute`, `this.agentReconciliationRepository.existsForDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [open-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-open-day-use-case-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-balance-credits-use-case-ts"></a>

### list-bank-balance-credits.use-case.ts

- **Ruta:** [list-bank-balance-credits.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/list-bank-balance-credits.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/list-bank-balance-credits.use-case.ts`, 35 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Historial de acreditaciones — el mismo ledger filtrado por `ACREDITACION_SALDO` (vigentes y anuladas).
- **Depende de (archivos del proyecto):** [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [bank-movement-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-movement-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListBankBalanceCreditsInput` (L6): sin documentación — miembros: `startDate`, `endDate`, `bankId`, `page`, `limit`

#### Clase `ListBankBalanceCreditsUseCase` (L15–34)

- **Decoradores:** `@Injectable()`
- **Propósito:** Historial de acreditaciones — el mismo ledger filtrado por `ACREDITACION_SALDO` (vigentes y anuladas).
- **Dependencias inyectadas (constructor):** `@Inject(BANK_MOVEMENT_REPOSITORY) bankMovementRepository: BankMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 22–33 | `input: ListBankBalanceCreditsInput` | `Promise<PaginatedBankMovementsOutput>` |

##### `ListBankBalanceCreditsUseCase.execute`

- **Firma:** `execute(input: ListBankBalanceCreditsInput): Promise<PaginatedBankMovementsOutput>` — [list-bank-balance-credits.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/list-bank-balance-credits.use-case.ts#L22) (L22–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankMovementRepository.findMovements`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-movements-use-case-ts"></a>

### list-bank-movements.use-case.ts

- **Ruta:** [list-bank-movements.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/list-bank-movements.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/list-bank-movements.use-case.ts`, 47 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Historial de movimientos de saldo, filtrable por fecha de negocio, cuenta, tipo y usuario.
- **Depende de (archivos del proyecto):** [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts), [bank-movement-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-movement-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [export-bank-movements-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-movements-report-pdf-use-case-ts), [bank-movements-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-movements-report-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListBankMovementsInput` (L8): sin documentación — miembros: `startDate`, `endDate`, `bankId`, `movementType`, `userId`, `page`, `limit`

#### Clase `ListBankMovementsUseCase` (L21–46)

- **Decoradores:** `@Injectable()`
- **Propósito:** Historial de movimientos de saldo, filtrable por fecha de negocio, cuenta, tipo y usuario.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_MOVEMENT_REPOSITORY) bankMovementRepository: BankMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 28–45 | `input: ListBankMovementsInput` | `Promise<PaginatedBankMovementsOutput>` |

##### `ListBankMovementsUseCase.execute`

- **Firma:** `execute(input: ListBankMovementsInput): Promise<PaginatedBankMovementsOutput>` — [list-bank-movements.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/list-bank-movements.use-case.ts#L28) (L28–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidBankMovementDateRangeError`, `this.bankMovementRepository.findMovements`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidBankMovementDateRangeError()`
- **Consumidores:** [export-bank-movements-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-movements-report-pdf-use-case-ts), [bank-movements-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-movements-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-transfers-use-case-ts"></a>

### list-bank-transfers.use-case.ts

- **Ruta:** [list-bank-transfers.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/list-bank-transfers.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/list-bank-transfers.use-case.ts`, 39 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Caso de uso: declara `ListBankTransfersUseCase`, `ListBankTransfersInput`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts), [bank-movement-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-movement-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListBankTransfersInput` (L7): sin documentación — miembros: `startDate`, `endDate`, `bankId`, `limit`

#### Clase `ListBankTransfersUseCase` (L16–38)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_MOVEMENT_REPOSITORY) bankMovementRepository: BankMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 23–37 | `input: ListBankTransfersInput` | `Promise<BankTransferOutput[]>` |

##### `ListBankTransfersUseCase.execute`

- **Firma:** `execute(input: ListBankTransfersInput): Promise<BankTransferOutput[]>` — [list-bank-transfers.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/list-bank-transfers.use-case.ts#L23) (L23–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidBankMovementDateRangeError`, `this.bankMovementRepository.findTransfers`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidBankMovementDateRangeError()`
- **Consumidores:** [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-banks-use-case-ts"></a>

### list-banks.use-case.ts

- **Ruta:** [list-banks.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/list-banks.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/list-banks.use-case.ts`, 26 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Caso de uso: declara `ListBanksUseCase`, `ListBanksInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [bank-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListBanksInput` (L6): sin documentación — miembros: `search`, `includeInactive`

#### Clase `ListBanksUseCase` (L11–25)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_REPOSITORY) bankRepository: BankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 18–24 | `input?: ListBanksInput` | `Promise<BankOutput[]>` |

##### `ListBanksUseCase.execute`

- **Firma:** `execute(input?: ListBanksInput): Promise<BankOutput[]>` — [list-banks.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/list-banks.use-case.ts#L18) (L18–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankRepository.findAll`, `input.search?.trim`, `banks.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-closed-days-use-case-ts"></a>

### list-closed-days.use-case.ts

- **Ruta:** [list-closed-days.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/list-closed-days.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/list-closed-days.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "Sistema → Gestión de Días Cerrados" — administrative listing, ADMIN/SUPER_ADMIN only (see the controller).
- **Depende de (archivos del proyecto):** [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [closed-day-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-closed-day-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts)

#### Clase `ListClosedDaysUseCase` (L10–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Sistema → Gestión de Días Cerrados" — administrative listing, ADMIN/SUPER_ADMIN only (see the controller).
- **Dependencias inyectadas (constructor):** `@Inject(DAY_OPENING_REPOSITORY) dayOpeningRepository: DayOpeningRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–20 | `filters: ClosedDaysFilters` | `Promise<ClosedDayOutput[]>` |

##### `ListClosedDaysUseCase.execute`

- **Firma:** `execute(filters: ClosedDaysFilters): Promise<ClosedDayOutput[]>` — [list-closed-days.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/list-closed-days.use-case.ts#L17) (L17–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dayOpeningRepository.findClosedDays`, `rows.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-open-day-use-case-ts"></a>

### open-day.use-case.ts

- **Ruta:** [open-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/open-day.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/open-day.use-case.ts`, 55 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "Confirmar Apertura" — idempotent (`DayOpeningRepository.open` never creates a second row for an already-opened date), so a double click or a retry never fails or duplicates anything.
- **Depende de (archivos del proyecto):** [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [day-audit-log.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-audit-log-repository-ts), [invalid-bank-balance.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-invalid-bank-balance-error-ts), [get-day-status.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-status-use-case-ts), [day-status-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-day-status-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface OpenDayInput` (L12): sin documentación — miembros: `date`, `userId`

#### Clase `OpenDayUseCase` (L24–54)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Confirmar Apertura" — idempotent (`DayOpeningRepository.open` never creates a second row for an already-opened date), so a double click or a retry never fails or duplicates anything. Returns the day's full status (not just "opened: yes"), so the frontend can update its UI in one step without a second call.
- **Dependencias inyectadas (constructor):** `@Inject(DAY_OPENING_REPOSITORY) dayOpeningRepository: DayOpeningRepository`, `@Inject(DAY_AUDIT_LOG_REPOSITORY) dayAuditLogRepository: DayAuditLogRepository`, `getDayStatusUseCase: GetDayStatusUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 34–53 | `input: OpenDayInput` | `Promise<DayStatusOutput>` |

##### `OpenDayUseCase.execute`

- **Firma:** `execute(input: OpenDayInput): Promise<DayStatusOutput>` — [open-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/open-day.use-case.ts#L34) (L34–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `DATE_PATTERN.test`, `new InvalidBankBalanceDateError`, `this.dayOpeningRepository.findByDate`, `this.dayOpeningRepository.open`, `this.dayAuditLogRepository.record`, `this.getDayStatusUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidBankBalanceDateError()`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-balance-credit-use-case-ts"></a>

### register-bank-balance-credit.use-case.ts

- **Ruta:** [register-bank-balance-credit.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/register-bank-balance-credit.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/register-bank-balance-credit.use-case.ts`, 63 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Finanzas → Transferencias Bancarias → "Acreditar saldo": SUMA `amount` al saldo actual de una cuenta (nuevo saldo = saldo actual + monto, con signo real — una cuenta en negativo simplemente se acerca a cero).
- **Depende de (archivos del proyecto):** [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts), [bank-movement-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-movement-output-ts), [today-iso-date.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-utils-today-iso-date-ts), [assert-bank-operation-day-open.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-assert-bank-operation-day-open-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

**Interfaces, tipos y enums:**

- `interface RegisterBankBalanceCreditInput` (L11): sin documentación — miembros: `bankId`, `amount`, `referenceText`, `observation`, `userId`

#### Clase `RegisterBankBalanceCreditUseCase` (L32–62)

- **Decoradores:** `@Injectable()`
- **Propósito:** Finanzas → Transferencias Bancarias → "Acreditar saldo": SUMA `amount` al saldo actual de una cuenta (nuevo saldo = saldo actual + monto, con signo real — una cuenta en negativo simplemente se acerca a cero). Sin contrapartida: no toca otra cuenta, caja ni efectivo. Distinta del Depósito de Transaccionar (tipo de movimiento propio `ACREDITACION_SALDO`). Solo admin/super_admin (lo exige el controlador). El cálculo, el lock de la fila, el ledger y la actualización del saldo viven en `register_bank_balance_credit` → `apply_bank_account_movement`, en una sola transacción: este caso de uso nunca calcula un saldo. Respeta el mismo ciclo de día abierto/cerrado que las transferencias.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_MOVEMENT_REPOSITORY) bankMovementRepository: BankMovementRepository`, `@Inject(DAY_OPENING_REPOSITORY) dayOpeningRepository: DayOpeningRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 41–61 | `input: RegisterBankBalanceCreditInput` | `Promise<BankMovementOutput>` |

##### `RegisterBankBalanceCreditUseCase.execute`

- **Firma:** `execute(input: RegisterBankBalanceCreditInput): Promise<BankMovementOutput>` — [register-bank-balance-credit.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/register-bank-balance-credit.use-case.ts#L41) (L41–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Number.isFinite`, `new InvalidMovementAmountError`, `todayIsoDate`, `assertBankOperationDayOpen`, `this.bankMovementRepository.registerBalanceCredit`, `input.referenceText?.trim`, `input.observation?.trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidMovementAmountError()`
- **Consumidores:** [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-transfer-use-case-ts"></a>

### register-bank-transfer.use-case.ts

- **Ruta:** [register-bank-transfer.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/register-bank-transfer.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/register-bank-transfer.use-case.ts`, 79 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "Transferencias Bancarias" — traslada saldo entre dos cuentas propias.
- **Depende de (archivos del proyecto):** [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [bank-movement-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-movement-output-ts), [today-iso-date.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-utils-today-iso-date-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts), [assert-bank-operation-day-open.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-assert-bank-operation-day-open-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

**Interfaces, tipos y enums:**

- `interface RegisterBankTransferInput` (L15): sin documentación — miembros: `sourceBankId`, `destinationBankId`, `cashWithdrawal`, `amount`, `referenceText`, `concept`, `userId`

#### Clase `RegisterBankTransferUseCase` (L37–78)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Transferencias Bancarias" — traslada saldo entre dos cuentas propias. Toda regla de negocio (monto &gt; 0, saldo suficiente en origen, BI Club solo desde Banco Industrial y con límite configurable, BI Club como origen solo hacia Banco Industrial, Districol solo desde Banco Agromercantil, retiro de efectivo sin destino) vive en `register_bank_transfer`, bajo el lock de ambas filas: este caso de uso no pre-valida saldos en TypeScript, porque eso solo abriría una ventana de carrera (TOCTOU) — mismo criterio que `RegisterAssetPaymentUseCase`. La fecha de negocio es siempre "hoy" en la zona del servidor (America/Guatemala), igual que Transaccionar.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_MOVEMENT_REPOSITORY) bankMovementRepository: BankMovementRepository`, `@Inject(DAY_OPENING_REPOSITORY) dayOpeningRepository: DayOpeningRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 46–77 | `input: RegisterBankTransferInput` | `Promise<BankTransferOutput>` |

##### `RegisterBankTransferUseCase.execute`

- **Firma:** `execute(input: RegisterBankTransferInput): Promise<BankTransferOutput>` — [register-bank-transfer.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/register-bank-transfer.use-case.ts#L46) (L46–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `todayIsoDate`, `assertBankOperationDayOpen`, `new BankTransferDestinationRequiredError`, `this.bankMovementRepository.registerTransfer`, `input.referenceText?.trim`, `input.concept?.trim`, `this.bankMovementRepository.findTransferById`, `new InternalServerErrorException`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BankTransferDestinationRequiredError()`, `new InternalServerErrorException( 'No se pudo recuperar la transferencia recién registrada.', )`
- **Consumidores:** [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-reopen-day-use-case-ts"></a>

### reopen-day.use-case.ts

- **Ruta:** [reopen-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/reopen-day.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/reopen-day.use-case.ts`, 40 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "Reabrir Día" — role validation (ADMIN/SUPER_ADMIN only) already happened in the controller's `RolesGuard`; the real status/cancellation/ later-day validation happens atomically inside `reopen_agent_day` (SQL, under the row lock) — this use case only orchestrates and translates the result into the shape the frontend needs to refresh the row/detail without a second call.
- **Depende de (archivos del proyecto):** [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [reason-required.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-reason-required-error-ts), [get-day-detail.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts), [day-detail-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-day-detail-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts)

**Interfaces, tipos y enums:**

- `interface ReopenDayInput` (L8): sin documentación — miembros: `date`, `userId`, `reason`

#### Clase `ReopenDayUseCase` (L22–39)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Reabrir Día" — role validation (ADMIN/SUPER_ADMIN only) already happened in the controller's `RolesGuard`; the real status/cancellation/ later-day validation happens atomically inside `reopen_agent_day` (SQL, under the row lock) — this use case only orchestrates and translates the result into the shape the frontend needs to refresh the row/detail without a second call.
- **Dependencias inyectadas (constructor):** `@Inject(DAY_OPENING_REPOSITORY) dayOpeningRepository: DayOpeningRepository`, `getDayDetailUseCase: GetDayDetailUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–38 | `input: ReopenDayInput` | `Promise<DayDetailOutput>` |

##### `ReopenDayUseCase.execute`

- **Firma:** `execute(input: ReopenDayInput): Promise<DayDetailOutput>` — [reopen-day.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/reopen-day.use-case.ts#L30) (L30–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.reason?.trim`, `new ReopenReasonRequiredError`, `this.dayOpeningRepository.reopen`, `this.getDayDetailUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ReopenReasonRequiredError()`
- **Consumidores:** [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-save-bank-balances-use-case-ts"></a>

### save-bank-balances.use-case.ts

- **Ruta:** [save-bank-balances.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/save-bank-balances.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/save-bank-balances.use-case.ts`, 92 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Saves every entered bank's cuadre for one operation date as a single atomic batch (see `TypeOrmBankBalanceRepository.saveBalances` — one outer transaction wrapping one `save_bank_balance()` call per entry): either every bank in the batch is recorded, or none are.
- **Depende de (archivos del proyecto):** [bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-balance-repository-ts), [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [invalid-bank-balance.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-invalid-bank-balance-error-ts), [day-not-opened.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-not-opened-error-ts), [day-already-closed.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-already-closed-error-ts), [today-iso-date.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface SaveBankBalancesEntryInput` (L14): sin documentación — miembros: `bankId`, `finalBalance`
- `interface SaveBankBalancesInput` (L19): sin documentación — miembros: `operationDate`, `userId`, `entries`
- `interface SaveBankBalancesOutput` (L25): sin documentación — miembros: `savedCount`

#### Clase `SaveBankBalancesUseCase` (L37–91)

- **Decoradores:** `@Injectable()`
- **Propósito:** Saves every entered bank's cuadre for one operation date as a single atomic batch (see `TypeOrmBankBalanceRepository.saveBalances` — one outer transaction wrapping one `save_bank_balance()` call per entry): either every bank in the batch is recorded, or none are.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_BALANCE_REPOSITORY) bankBalanceRepository: BankBalanceRepository`, `@Inject(DAY_OPENING_REPOSITORY) dayOpeningRepository: DayOpeningRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 46–90 | `input: SaveBankBalancesInput` | `Promise<SaveBankBalancesOutput>` |

##### `SaveBankBalancesUseCase.execute`

- **Firma:** `execute(input: SaveBankBalancesInput): Promise<SaveBankBalancesOutput>` — [save-bank-balances.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/save-bank-balances.use-case.ts#L46) (L46–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `DATE_PATTERN.test`, `new InvalidBankBalanceDateError`, `new NoBankBalancesToSaveError`, `this.dayOpeningRepository.findByDate`, `todayIsoDate`, `new DayNotOpenedError`, `new DayAlreadyClosedError`, `this.bankBalanceRepository.saveBalances`, `input.entries.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidBankBalanceDateError()`, `new NoBankBalancesToSaveError()`, `new DayNotOpenedError(input.operationDate, 'balances')`, `new DayAlreadyClosedError(input.operationDate)`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-update-bank-use-case-ts"></a>

### update-bank.use-case.ts

- **Ruta:** [update-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/update-bank.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/update-bank.use-case.ts`, 104 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Caso de uso: declara `UpdateBankUseCase`, `UpdateBankInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [account-type.repository.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-domain-repositories-account-type-repository-ts), [bank-not-found.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-not-found-error-ts), [bank-already-exists.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-already-exists-error-ts), [invalid-account-type.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-invalid-account-type-error-ts), [bank-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-output-ts), [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateBankInput` (L13): sin documentación — miembros: `name`, `accountNumber`, `accountTypeId`, `previousBalance`, `finalBalance`, `specialAccount`, `maxBalance`, `availableInTransaccionar`, `updatedBy`

#### Clase `UpdateBankUseCase` (L25–103)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_REPOSITORY) bankRepository: BankRepository`, `@Inject(ACCOUNT_TYPE_REPOSITORY) accountTypeRepository: AccountTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 34–102 | `id: string`, `input: UpdateBankInput` | `Promise<BankOutput>` |

##### `UpdateBankUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateBankInput): Promise<BankOutput>` — [update-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/update-bank.use-case.ts#L34) (L34–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankRepository.findById`, `new BankNotFoundError`, `Math.round`, `new BankBalanceRequiresAdjustmentError`, `this.accountTypeRepository.findById`, `new InvalidAccountTypeError`, `input.name?.trim().replace`, `input.name?.trim`, `input.accountNumber?.trim`, `this.bankRepository.findByActiveNameAndAccountNumber`, `new BankAlreadyExistsError`, `this.bankRepository.update`, `toBankOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.bankRepository.update`
- **Errores que lanza:** `new BankNotFoundError(id)`, `new BankBalanceRequiresAdjustmentError()`, `new InvalidAccountTypeError()`, `new BankAlreadyExistsError(nextName, nextAccountNumber)`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-spec-ts"></a>

### validate-bank-balances-for-date.use-case.spec.ts

- **Ruta:** [validate-bank-balances-for-date.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/validate-bank-balances-for-date.use-case.spec.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/validate-bank-balances-for-date.use-case.spec.ts`, 48 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Prueba unitaria: declara `row`, `useCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [validate-bank-balances-for-date.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-ts), [bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-balance-repository-ts), [bank-balance-view.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-balance-view-entity-ts)
- **Consumidores:** —
#### Función `row` (L5–21)

- **Tipo:** función local del archivo
- **Firma:** `row(bankId: string, finalBalance: number \| null, specialAccount?: string \| null): BankBalanceView` — [validate-bank-balances-for-date.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/validate-bank-balances-for-date.use-case.spec.ts#L5)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `useCase` (L23–27)

- **Tipo:** función local del archivo
- **Firma:** `useCase(rows: BankBalanceView[]): ValidateBankBalancesForDateUseCase` — [validate-bank-balances-for-date.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/validate-bank-balances-for-date.use-case.spec.ts#L23)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new ValidateBankBalancesForDateUseCase`, `jest.fn().mockResolvedValue`, `jest.fn`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-ts"></a>

### validate-bank-balances-for-date.use-case.ts

- **Ruta:** [validate-bank-balances-for-date.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/validate-bank-balances-for-date.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/validate-bank-balances-for-date.use-case.ts`, 52 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Backs both the new `GET /banks/balances/validation` endpoint (the frontend's UX pre-check for Cuadre Agentes) and the hard gate inside `CloseAgentDayUseCase` — one place decides "can this date be reconciled", reused by both the read-only check and the actual write-time enforcement, per this ticket's own "no confiar únicamente en el frontend" requirement.
- **Depende de (archivos del proyecto):** [bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-balance-repository-ts), [invalid-bank-balance.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-invalid-bank-balance-error-ts), [bank-balances-validation-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-balances-validation-output-ts), [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [get-day-status.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-status-use-case-ts), [validate-bank-balances-for-date.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-spec-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `ValidateBankBalancesForDateUseCase` (L23–51)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs both the new `GET /banks/balances/validation` endpoint (the frontend's UX pre-check for Cuadre Agentes) and the hard gate inside `CloseAgentDayUseCase` — one place decides "can this date be reconciled", reused by both the read-only check and the actual write-time enforcement, per this ticket's own "no confiar únicamente en el frontend" requirement. Reuses `BankBalanceRepository.findBalancesView` — the exact same active-banks-plus-daily-entry query `GetBankBalancesViewUseCase` already runs for the Bancos screen — rather than a second, parallel "which banks are missing a balance" query.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_BALANCE_REPOSITORY) bankBalanceRepository: BankBalanceRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–50 | `date: string` | `Promise<BankBalancesValidationOutput>` |

##### `ValidateBankBalancesForDateUseCase.execute`

- **Firma:** `execute(date: string): Promise<BankBalancesValidationOutput>` — [validate-bank-balances-for-date.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/validate-bank-balances-for-date.use-case.ts#L30) (L30–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `DATE_PATTERN.test`, `new InvalidBankBalanceDateError`, `( await this.bankBalanceRepository.findBalancesView(date) ).filter`, `this.bankBalanceRepository.findBalancesView`, `isOutsideAgentReconciliation`, `rows.filter((row) => row.finalBalance === null).map`, `rows.filter`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidBankBalanceDateError()`
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [get-day-status.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-status-use-case-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-balance-credit-use-case-ts"></a>

### void-bank-balance-credit.use-case.ts

- **Ruta:** [void-bank-balance-credit.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/void-bank-balance-credit.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/void-bank-balance-credit.use-case.ts`, 56 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Anular una acreditación de saldo — nunca la borra: `void_bank_balance_credit` reutiliza `reverse_bank_account_movements`, que registra el movimiento inverso (ANULACION, −monto) y marca el original como ANULADO; ambos quedan en el historial.
- **Depende de (archivos del proyecto):** [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts), [bank-movement-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-movement-output-ts), [today-iso-date.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

**Interfaces, tipos y enums:**

- `interface VoidBankBalanceCreditInput` (L11): sin documentación — miembros: `operationId`, `reason`, `userId`

#### Clase `VoidBankBalanceCreditUseCase` (L25–55)

- **Decoradores:** `@Injectable()`
- **Propósito:** Anular una acreditación de saldo — nunca la borra: `void_bank_balance_credit` reutiliza `reverse_bank_account_movements`, que registra el movimiento inverso (ANULACION, −monto) y marca el original como ANULADO; ambos quedan en el historial. Solo admin, sin validación de día abierto — mismo criterio que anular una transferencia.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_MOVEMENT_REPOSITORY) bankMovementRepository: BankMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 32–54 | `input: VoidBankBalanceCreditInput` | `Promise<BankMovementOutput>` |

##### `VoidBankBalanceCreditUseCase.execute`

- **Firma:** `execute(input: VoidBankBalanceCreditInput): Promise<BankMovementOutput>` — [void-bank-balance-credit.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/void-bank-balance-credit.use-case.ts#L32) (L32–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.reason?.trim`, `new MovementReasonRequiredError`, `this.bankMovementRepository.voidBalanceCredit`, `todayIsoDate`, `this.bankMovementRepository.findByReference`, `movements.find`, `new BankBalanceCreditNotFoundError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new MovementReasonRequiredError()`, `new BankBalanceCreditNotFoundError(input.operationId)`
- **Consumidores:** [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-transfer-use-case-ts"></a>

### void-bank-transfer.use-case.ts

- **Ruta:** [void-bank-transfer.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/void-bank-transfer.use-case.ts) (`comercial-jhoel-api/src/modules/banks/application/use-cases/void-bank-transfer.use-case.ts`, 60 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Anular una transferencia — nunca la borra: `void_bank_transfer` registra los dos movimientos inversos y marca los originales como ANULADO, todo en una transacción.
- **Depende de (archivos del proyecto):** [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts), [bank-movement-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-movement-output-ts), [today-iso-date.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

**Interfaces, tipos y enums:**

- `interface VoidBankTransferInput` (L12): sin documentación — miembros: `transferId`, `reason`, `userId`

#### Clase `VoidBankTransferUseCase` (L24–59)

- **Decoradores:** `@Injectable()`
- **Propósito:** Anular una transferencia — nunca la borra: `void_bank_transfer` registra los dos movimientos inversos y marca los originales como ANULADO, todo en una transacción. Solo admin (lo exige el controlador), mismo criterio que la anulación de Transaccionar.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_MOVEMENT_REPOSITORY) bankMovementRepository: BankMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 31–58 | `input: VoidBankTransferInput` | `Promise<BankTransferOutput>` |

##### `VoidBankTransferUseCase.execute`

- **Firma:** `execute(input: VoidBankTransferInput): Promise<BankTransferOutput>` — [void-bank-transfer.use-case.ts](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/void-bank-transfer.use-case.ts#L31) (L31–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.reason?.trim`, `new MovementReasonRequiredError`, `this.bankMovementRepository.findTransferById`, `new BankTransferNotFoundError`, `new BankTransferAlreadyVoidedError`, `this.bankMovementRepository.voidTransfer`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new MovementReasonRequiredError()`, `new BankTransferNotFoundError(input.transferId)`, `new BankTransferAlreadyVoidedError()`
- **Consumidores:** [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-application-utils-today-iso-date-ts"></a>

### today-iso-date.ts

- **Ruta:** [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/banks/application/utils/today-iso-date.ts) (`comercial-jhoel-api/src/modules/banks/application/utils/today-iso-date.ts`, 14 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** `yyyy-MM-dd` in local server time — small per-feature copy of the identical helper in `modules/recharges/application/utils/today-iso-date.ts`, following this codebase's established "small per-feature copy over cross-feature coupling" convention for a helper this trivial, rather than importing across a module boundary for one function.
- **Descripción del autor (comentario del archivo):** `yyyy-MM-dd` in local server time — small per-feature copy of the identical helper in `modules/recharges/application/utils/today-iso-date.ts`, following this codebase's established "small per-feature copy over cross-feature coupling" convention for a helper this trivial, rather than importing across a module boundary for one function.
- **Consumidores:** [adjust-bank-balance.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-adjust-bank-balance-use-case-ts), [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [register-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-balance-credit-use-case-ts), [register-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-transfer-use-case-ts), [save-bank-balances.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-save-bank-balances-use-case-ts), [void-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-balance-credit-use-case-ts), [void-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-transfer-use-case-ts), [agent-reconciliations.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-agent-reconciliations-controller-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)
#### Función `todayIsoDate` (L8–13)

- **Tipo:** función exportada
- **Firma:** `todayIsoDate(): string` — [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/banks/application/utils/today-iso-date.ts#L8)
- **Propósito / descripción:** `yyyy-MM-dd` in local server time — small per-feature copy of the identical helper in `modules/recharges/application/utils/today-iso-date.ts`, following this codebase's established "small per-feature copy over cross-feature coupling" convention for a helper this trivial, rather than importing across a module boundary for one function.
- **Dependencias:** `new Date`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`, `now.getFullYear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [adjust-bank-balance.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-adjust-bank-balance-use-case-ts), [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [register-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-balance-credit-use-case-ts), [register-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-transfer-use-case-ts), [save-bank-balances.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-save-bank-balances-use-case-ts), [void-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-balance-credit-use-case-ts), [void-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-transfer-use-case-ts), [agent-reconciliations.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-agent-reconciliations-controller-ts), [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-banks-module-ts"></a>

### banks.module.ts

- **Ruta:** [banks.module.ts](../../../../comercial-jhoel-api/src/modules/banks/banks.module.ts) (`comercial-jhoel-api/src/modules/banks/banks.module.ts`, 141 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Módulo: declara `BanksModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [warehouse-cash.reader.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-warehouse-cash-reader-ts), [typeorm-warehouse-cash.reader.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-warehouse-cash-reader-ts), [bank.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-orm-entity-ts), [bank-balance.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-balance-orm-entity-ts), [agent-reconciliation.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-orm-entity-ts), [day-opening.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-opening-orm-entity-ts), [day-audit-log.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-audit-log-orm-entity-ts), [typeorm-bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-repository-ts), [typeorm-bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-balance-repository-ts), [typeorm-agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-agent-reconciliation-repository-ts), [typeorm-day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-opening-repository-ts), [typeorm-day-audit-log.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-audit-log-repository-ts), [typeorm-bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-movement-repository-ts), [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-balance-repository-ts) y 36 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `BanksModule` (L55–140)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([ BankOrmEntity, BankBalanceOrmEntity, AgentReconciliationOrmEntity, DayOpeningOrmEntity, DayAuditLogOrmEntity, ]),`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-banks-domain-entities-agent-reconciliation-entity-ts"></a>

### agent-reconciliation.entity.ts

- **Ruta:** [agent-reconciliation.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts) (`comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts`, 77 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** A frozen historical snapshot of one "Cuadre Agentes" close — the second stage of the daily sequence, after bank balances are saved.
- **Consumidores:** [agent-reconciliation-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-agent-reconciliation-output-ts), [agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-agent-reconciliation-repository-ts), [agent-reconciliation.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-mapper-ts), [typeorm-agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-agent-reconciliation-repository-ts)

**Interfaces, tipos y enums:**

- `interface AgentReconciliationProps` (L1): sin documentación — miembros: `id`, `date`, `totalCash`, `totalWarehouseCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `result`, `createdAt`, `createdBy`, `createdByUsername`

#### Clase `AgentReconciliation` (L26–76)

- **Propósito:** A frozen historical snapshot of one "Cuadre Agentes" close — the second stage of the daily sequence, after bank balances are saved. `totalBanks`/`totalAssets`/`totalAccountsReceivable` are copied in at save time from `GetCuadreAgentesSummaryUseCase` (never recomputed live from this row later), same "frozen snapshot, not a live view" reasoning `recharge_sales_closures` already established for its own `total_sales`/`total_collected`. Only `totalCash` genuinely originates from the caller — see `CloseAgentDayUseCase`.
- **Dependencias inyectadas (constructor):** `props: AgentReconciliationProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 29–31 | `props: AgentReconciliationProps` | `AgentReconciliation` |
| `id` | getter public | 33–35 | — | `string` |
| `date` | getter public | 37–39 | — | `string` |
| `totalCash` | getter public | 41–43 | — | `number` |
| `totalWarehouseCash` | getter public | 45–47 | — | `number` |
| `totalBanks` | getter public | 49–51 | — | `number` |
| `totalAssets` | getter public | 53–55 | — | `number` |
| `totalAccountsReceivable` | getter public | 57–59 | — | `number` |
| `result` | getter public | 61–63 | — | `number` |
| `createdAt` | getter public | 65–67 | — | `Date` |
| `createdBy` | getter public | 69–71 | — | `string` |
| `createdByUsername` | getter public | 73–75 | — | `string` |

##### `AgentReconciliation.create`

- **Firma:** `create(props: AgentReconciliationProps): AgentReconciliation` — [agent-reconciliation.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new AgentReconciliation`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [agent-reconciliation.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-mapper-ts)

##### `AgentReconciliation.id`

- **Firma:** `id(): string` — [agent-reconciliation.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AgentReconciliation.date`

- **Firma:** `date(): string` — [agent-reconciliation.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AgentReconciliation.totalCash`

- **Firma:** `totalCash(): number` — [agent-reconciliation.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AgentReconciliation.totalWarehouseCash`

- **Firma:** `totalWarehouseCash(): number` — [agent-reconciliation.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AgentReconciliation.totalBanks`

- **Firma:** `totalBanks(): number` — [agent-reconciliation.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AgentReconciliation.totalAssets`

- **Firma:** `totalAssets(): number` — [agent-reconciliation.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AgentReconciliation.totalAccountsReceivable`

- **Firma:** `totalAccountsReceivable(): number` — [agent-reconciliation.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AgentReconciliation.result`

- **Firma:** `result(): number` — [agent-reconciliation.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AgentReconciliation.createdAt`

- **Firma:** `createdAt(): Date` — [agent-reconciliation.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts#L65) (L65–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AgentReconciliation.createdBy`

- **Firma:** `createdBy(): string` — [agent-reconciliation.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AgentReconciliation.createdByUsername`

- **Firma:** `createdByUsername(): string` — [agent-reconciliation.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/agent-reconciliation.entity.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts"></a>

### bank-account-movement.entity.ts

- **Ruta:** [bank-account-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank-account-movement.entity.ts) (`comercial-jhoel-api/src/modules/banks/domain/entities/bank-account-movement.entity.ts`, 139 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Un renglón del ledger `bank_account_movements` — proyección de solo lectura (la escritura siempre pasa por las funciones SQL).
- **Consumidores:** [bank-movement-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-movement-output-ts), [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [create-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-create-bank-use-case-ts), [get-bank-balance-strip.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-spec-ts), [get-bank-balance-strip.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-ts), [get-cuadre-agentes-summary.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-spec-ts), [get-cuadre-agentes-summary.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-ts), [list-bank-movements.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-movements-use-case-ts), [update-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-update-bank-use-case-ts), [validate-bank-balances-for-date.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-ts), [bank.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-entity-ts), [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [bank.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-mapper-ts), [typeorm-bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-movement-repository-ts) y 4 más

**Interfaces, tipos y enums:**

- `interface BankAccountMovement` (L79): Un renglón del ledger `bank_account_movements` — proyección de solo lectura (la escritura siempre pasa por las funciones SQL). — miembros: `id`, `sequence`, `bankId`, `bankName`, `accountNumber`, `accountTypeName`, `movementType`, `origin`, `amount`, `balanceBefore`, `balanceAfter`, `businessDate`, `createdAt`, `userId`, `username`, `referenceType`, `referenceId`, `referenceText`, `concept`, `observation`, `counterpartBankId`, `counterpartBankName`, `counterpartAccountNumber`, `status`, `reversalOfId`…
- `interface BankTransfer` (L113): Vista de una transferencia: su salida (origen) y su entrada (destino) juntas — `destination` es `null` en un retiro de efectivo. — miembros: `id`, `kind`, `businessDate`, `createdAt`, `amount`, `userId`, `username`, `referenceText`, `concept`, `status`, `source`, `destination`
- `type BankMovementType` (L20) = `(typeof BANK_MOVEMENT_TYPES)[number]`
- `type BankMovementOrigin` (L32) = `(typeof BANK_MOVEMENT_ORIGINS)[number]`
- `type BankMovementStatus` (L34) = `'APLICADO' \| 'ANULADO'`
- `type BankSpecialAccount` (L51) = `(typeof BANK_SPECIAL_ACCOUNTS)[number]`
- `type BankTransferKind` (L110) = `'TRANSFER' \| 'CASH_WITHDRAWAL'` — `TRANSFER` = de una cuenta a otra; `CASH_WITHDRAWAL` = retiro de efectivo en banco (solo sale del origen).

**Constantes exportadas:**

- `BANK_MOVEMENT_TYPES` (L1) = `[ 'DEPOSITO', 'RETIRO', 'DESEMBOLSO_GENESIS', 'PAGO_GENESIS', 'REINTEGRO', 'TRANSFERENCIA_SALIDA', 'TRANSFEREN`
- `BANK_MOVEMENT_ORIGINS` (L22) = `[ 'TRANSACCIONAR', 'TRANSFERENCIA', 'AJUSTE_MANUAL', 'SALDO_INICIAL', 'ANULACION', 'ACREDITACION_SALDO', 'CONT`
- `BANK_SPECIAL_ACCOUNTS` (L43): Reglas especiales de una cuenta (`banks.special_account`) — ver la migración `CreateBankAccountMovements`. = `[ 'GENESIS', 'BI_CLUB', 'DISTRICOL', 'BANCO_INDUSTRIAL', 'BANCO_AGROMERCANTIL', 'GUAYACAN', ] as const`
- `ACCOUNTS_OUTSIDE_AGENT_RECONCILIATION` (L59): Cuentas con cuadre propio (Cooperativa Guayacán → Cuadre de Caja Guayacán): fuera del desglose y los totales de Cuadre de Agentes y sin exigir su saldo del día para cerrarlo. = `['GUAYACAN']`
#### Función `isOutsideAgentReconciliation` (L62–71)

- **Tipo:** función exportada
- **Firma:** `isOutsideAgentReconciliation(specialAccount: string \| null \| undefined): boolean` — [bank-account-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank-account-movement.entity.ts#L62)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `(ACCOUNTS_OUTSIDE_AGENT_RECONCILIATION as readonly string[]).includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-cuadre-agentes-summary.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-ts), [validate-bank-balances-for-date.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-balance-view-entity-ts"></a>

### bank-balance-view.entity.ts

- **Ruta:** [bank-balance-view.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank-balance-view.entity.ts) (`comercial-jhoel-api/src/modules/banks/domain/entities/bank-balance-view.entity.ts`, 21 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** The row shape the Agentes Bancarios → Bancos screen actually needs: one active bank joined with its resolved previous balance for a given date (last bank_balances.finalBalance strictly before that date, falling back to the bank's configured opening previousBalance) and whatever final balance was already saved for that exact date, if any.
- **Descripción del autor (comentario del archivo):** The row shape the Agentes Bancarios → Bancos screen actually needs: one active bank joined with its resolved previous balance for a given date (last bank_balances.finalBalance strictly before that date, falling back to the bank's configured opening previousBalance) and whatever final balance was already saved for that exact date, if any. Not a persisted entity — a read-side projection assembled by the repository.
- **Consumidores:** [bank-balance-view-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-balance-view-output-ts), [day-detail-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-day-detail-output-ts), [validate-bank-balances-for-date.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-spec-ts), [bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-balance-repository-ts), [typeorm-bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-balance-repository-ts)

**Interfaces, tipos y enums:**

- `interface BankBalanceView` (L9): The row shape the Agentes Bancarios → Bancos screen actually needs: one active bank joined with its resolved previous balance for a given date (last bank_balances.finalBalance strictly before that date, falling back to the bank's configured opening previousBalance) and whatever final balance was already saved for that exact date, if any. — miembros: `bankId`, `bankName`, `accountNumber`, `accountTypeName`, `previousBalance`, `finalBalance`, `currentBalance`, `specialAccount`, `maxBalance`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-entity-ts"></a>

### bank.entity.ts

- **Ruta:** [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts) (`comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts`, 119 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Entidad de dominio: declara `Bank`, `BankProps` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts)
- **Consumidores:** [bank-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-output-ts), [get-bank-balance-strip.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-spec-ts), [get-cuadre-agentes-summary.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-spec-ts), [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [bank.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-mapper-ts), [typeorm-bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-repository-ts)

**Interfaces, tipos y enums:**

- `interface BankProps` (L3): sin documentación — miembros: `id`, `name`, `accountNumber`, `accountTypeId`, `accountTypeName`, `previousBalance`, `finalBalance`, `specialAccount`, `maxBalance`, `availableInTransaccionar`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`

#### Clase `Bank` (L44–118)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: BankProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 47–49 | `props: BankProps` | `Bank` |
| `id` | getter public | 51–53 | — | `string` |
| `name` | getter public | 55–57 | — | `string` |
| `accountNumber` | getter public | 59–61 | — | `string` |
| `accountTypeId` | getter public | 63–65 | — | `string` |
| `accountTypeName` | getter public | 67–69 | — | `string` |
| `previousBalance` | getter public | 71–73 | — | `number` |
| `finalBalance` | getter public | 75–77 | — | `number` |
| `specialAccount` | getter public | 79–81 | — | `BankSpecialAccount \| null` |
| `maxBalance` | getter public | 83–85 | — | `number \| null` |
| `availableInTransaccionar` | getter public | 87–89 | — | `boolean` |
| `isActive` | getter public | 91–93 | — | `boolean` |
| `createdAt` | getter public | 95–97 | — | `Date` |
| `updatedAt` | getter public | 99–101 | — | `Date` |
| `createdBy` | getter public | 103–105 | — | `string` |
| `createdByUsername` | getter public | 107–109 | — | `string` |
| `updatedBy` | getter public | 111–113 | — | `string \| null` |
| `updatedByUsername` | getter public | 115–117 | — | `string \| null` |

##### `Bank.create`

- **Firma:** `create(props: BankProps): Bank` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Bank`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-bank-balance-strip.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-spec-ts), [get-cuadre-agentes-summary.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-spec-ts), [bank.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-mapper-ts), [typeorm-bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-repository-ts)

##### `Bank.id`

- **Firma:** `id(): string` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.name`

- **Firma:** `name(): string` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.accountNumber`

- **Firma:** `accountNumber(): string` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.accountTypeId`

- **Firma:** `accountTypeId(): string` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.accountTypeName`

- **Firma:** `accountTypeName(): string` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.previousBalance`

- **Firma:** `previousBalance(): number` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.finalBalance`

- **Firma:** `finalBalance(): number` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.specialAccount`

- **Firma:** `specialAccount(): BankSpecialAccount \| null` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.maxBalance`

- **Firma:** `maxBalance(): number \| null` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.availableInTransaccionar`

- **Firma:** `availableInTransaccionar(): boolean` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L87) (L87–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.isActive`

- **Firma:** `isActive(): boolean` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L91) (L91–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.createdAt`

- **Firma:** `createdAt(): Date` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.updatedAt`

- **Firma:** `updatedAt(): Date` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L99) (L99–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.createdBy`

- **Firma:** `createdBy(): string` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L103) (L103–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.createdByUsername`

- **Firma:** `createdByUsername(): string` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L107) (L107–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L111) (L111–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Bank.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [bank.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/bank.entity.ts#L115) (L115–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-banks-domain-entities-day-audit-log-entity-ts"></a>

### day-audit-log.entity.ts

- **Ruta:** [day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-audit-log.entity.ts) (`comercial-jhoel-api/src/modules/banks/domain/entities/day-audit-log.entity.ts`, 64 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** One row per CYCLE transition of a day (opening, close/re-close, reopening, cancellation) — not a generic field-change log.
- **Consumidores:** [day-detail-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-day-detail-output-ts), [day-audit-log.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-audit-log-repository-ts), [day-audit-log.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-audit-log-mapper-ts), [typeorm-day-audit-log.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-audit-log-repository-ts)

**Interfaces, tipos y enums:**

- `interface DayAuditLogProps` (L3): sin documentación — miembros: `id`, `date`, `action`, `performedBy`, `performedByUsername`, `performedAt`, `reason`, `previousStatus`, `newStatus`
- `type DayAuditAction` (L1) = `'OPENED' \| 'CLOSED' \| 'REOPENED' \| 'CANCELLED'`

#### Clase `DayAuditLog` (L21–63)

- **Propósito:** One row per CYCLE transition of a day (opening, close/re-close, reopening, cancellation) — not a generic field-change log. See `ReopenDayUseCase`/`CancelDayUseCase`/`close_agent_day` (SQL) for where each action is written.
- **Dependencias inyectadas (constructor):** `props: DayAuditLogProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 24–26 | `props: DayAuditLogProps` | `DayAuditLog` |
| `id` | getter public | 28–30 | — | `string` |
| `date` | getter public | 32–34 | — | `string` |
| `action` | getter public | 36–38 | — | `DayAuditAction` |
| `performedBy` | getter public | 40–42 | — | `string` |
| `performedByUsername` | getter public | 44–46 | — | `string` |
| `performedAt` | getter public | 48–50 | — | `Date` |
| `reason` | getter public | 52–54 | — | `string \| null` |
| `previousStatus` | getter public | 56–58 | — | `string \| null` |
| `newStatus` | getter public | 60–62 | — | `string \| null` |

##### `DayAuditLog.create`

- **Firma:** `create(props: DayAuditLogProps): DayAuditLog` — [day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-audit-log.entity.ts#L24) (L24–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new DayAuditLog`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [day-audit-log.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-audit-log-mapper-ts), [typeorm-day-audit-log.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-audit-log-repository-ts)

##### `DayAuditLog.id`

- **Firma:** `id(): string` — [day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-audit-log.entity.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayAuditLog.date`

- **Firma:** `date(): string` — [day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-audit-log.entity.ts#L32) (L32–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayAuditLog.action`

- **Firma:** `action(): DayAuditAction` — [day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-audit-log.entity.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayAuditLog.performedBy`

- **Firma:** `performedBy(): string` — [day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-audit-log.entity.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayAuditLog.performedByUsername`

- **Firma:** `performedByUsername(): string` — [day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-audit-log.entity.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayAuditLog.performedAt`

- **Firma:** `performedAt(): Date` — [day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-audit-log.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayAuditLog.reason`

- **Firma:** `reason(): string \| null` — [day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-audit-log.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayAuditLog.previousStatus`

- **Firma:** `previousStatus(): string \| null` — [day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-audit-log.entity.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayAuditLog.newStatus`

- **Firma:** `newStatus(): string \| null` — [day-audit-log.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-audit-log.entity.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-banks-domain-entities-day-opening-entity-ts"></a>

### day-opening.entity.ts

- **Ruta:** [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts) (`comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts`, 107 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "The user confirmed they want to start working on this date" — independent of whether balances have already been saved.
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [day-opening.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-opening-mapper-ts), [typeorm-day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-opening-repository-ts)

**Interfaces, tipos y enums:**

- `interface DayOpeningProps` (L1): sin documentación — miembros: `id`, `date`, `openedBy`, `openedByUsername`, `openedAt`, `closedAt`, `closedBy`, `closedByUsername`, `reopenedAt`, `reopenedBy`, `reopenedByUsername`, `reopenReason`, `isCancelled`, `cancelledAt`, `cancelledBy`, `cancelledByUsername`, `cancelReason`

#### Clase `DayOpening` (L22–106)

- **Propósito:** "The user confirmed they want to start working on this date" — independent of whether balances have already been saved.
- **Dependencias inyectadas (constructor):** `props: DayOpeningProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 25–27 | `props: DayOpeningProps` | `DayOpening` |
| `id` | getter public | 29–31 | — | `string` |
| `date` | getter public | 33–35 | — | `string` |
| `openedBy` | getter public | 37–39 | — | `string` |
| `openedByUsername` | getter public | 41–43 | — | `string` |
| `openedAt` | getter public | 45–47 | — | `Date` |
| `closedAt` | getter public | 49–51 | — | `Date \| null` |
| `closedBy` | getter public | 53–55 | — | `string \| null` |
| `closedByUsername` | getter public | 57–59 | — | `string` |
| `reopenedAt` | getter public | 61–63 | — | `Date \| null` |
| `reopenedBy` | getter public | 65–67 | — | `string \| null` |
| `reopenedByUsername` | getter public | 69–71 | — | `string` |
| `reopenReason` | getter public | 73–75 | — | `string \| null` |
| `isCancelled` | getter public | 77–79 | — | `boolean` |
| `cancelledAt` | getter public | 81–83 | — | `Date \| null` |
| `cancelledBy` | getter public | 85–87 | — | `string \| null` |
| `cancelledByUsername` | getter public | 89–91 | — | `string` |
| `cancelReason` | getter public | 93–95 | — | `string \| null` |
| `isClosed` | getter public | 98–100 | — | `boolean` |
| `isReopened` | getter public | 103–105 | — | `boolean` |

##### `DayOpening.create`

- **Firma:** `create(props: DayOpeningProps): DayOpening` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new DayOpening`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [day-opening.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-opening-mapper-ts), [typeorm-day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-opening-repository-ts)

##### `DayOpening.id`

- **Firma:** `id(): string` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.date`

- **Firma:** `date(): string` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.openedBy`

- **Firma:** `openedBy(): string` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.openedByUsername`

- **Firma:** `openedByUsername(): string` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.openedAt`

- **Firma:** `openedAt(): Date` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.closedAt`

- **Firma:** `closedAt(): Date \| null` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.closedBy`

- **Firma:** `closedBy(): string \| null` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.closedByUsername`

- **Firma:** `closedByUsername(): string` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.reopenedAt`

- **Firma:** `reopenedAt(): Date \| null` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.reopenedBy`

- **Firma:** `reopenedBy(): string \| null` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L65) (L65–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.reopenedByUsername`

- **Firma:** `reopenedByUsername(): string` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.reopenReason`

- **Firma:** `reopenReason(): string \| null` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.isCancelled`

- **Firma:** `isCancelled(): boolean` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.cancelledAt`

- **Firma:** `cancelledAt(): Date \| null` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.cancelledBy`

- **Firma:** `cancelledBy(): string \| null` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.cancelledByUsername`

- **Firma:** `cancelledByUsername(): string` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L89) (L89–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.cancelReason`

- **Firma:** `cancelReason(): string \| null` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L93) (L93–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.isClosed`

- **Firma:** `isClosed(): boolean` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L98) (L98–100)
- **Propósito / descripción:** "The day is already closed and can't be modified" — the only question `SaveBankBalancesUseCase`/`CloseAgentDayUseCase` actually care about. Deliberately still `false` for a REOPENED day (`closed_at` goes back to `NULL`) — that's exactly what reactivates editing without touching either of those use cases.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DayOpening.isReopened`

- **Firma:** `isReopened(): boolean` — [day-opening.entity.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/entities/day-opening.entity.ts#L103) (L103–105)
- **Propósito / descripción:** Was closed, then reopened, and hasn't been closed again yet.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-already-exists-error-ts"></a>

### bank-already-exists.error.ts

- **Ruta:** [bank-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/bank-already-exists.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/bank-already-exists.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Errores de dominio: declara `BankAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-create-bank-use-case-ts), [update-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-update-bank-use-case-ts), [typeorm-bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-repository-ts)

#### Clase `BankAlreadyExistsError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `name: string`, `accountNumber: string`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-balances-not-registered-error-ts"></a>

### bank-balances-not-registered.error.ts

- **Ruta:** [bank-balances-not-registered.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/bank-balances-not-registered.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/bank-balances-not-registered.error.ts`, 21 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "No se puede realizar un Cuadre de Agentes si primero no se han registrado y guardado los saldos de los bancos para esa misma fecha" — the one hard backend gate this rule needs.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [typeorm-agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-agent-reconciliation-repository-ts)

#### Clase `BankBalancesNotRegisteredError` (L12–20)

- **Herencia / contratos:** extends DomainError
- **Propósito:** "No se puede realizar un Cuadre de Agentes si primero no se han registrado y guardado los saldos de los bancos para esa misma fecha" — the one hard backend gate this rule needs. Thrown by `CloseAgentDayUseCase` before it ever computes/persists a reconciliation; the frontend's own pre-check (`ValidateBankBalancesForDateUseCase` surfaced via `GET /banks/balances/validation`) is UX only and can never be the real guarantee.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-inactive-error-ts"></a>

### bank-inactive.error.ts

- **Ruta:** [bank-inactive.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/bank-inactive.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/bank-inactive.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Errores de dominio: declara `BankInactiveError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-balance-repository-ts), [typeorm-bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-movement-repository-ts)

#### Clase `BankInactiveError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `bankId: string`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-spec-ts"></a>

### bank-movement.errors.spec.ts

- **Ruta:** [bank-movement.errors.spec.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/bank-movement.errors.spec.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/bank-movement.errors.spec.ts`, 167 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts"></a>

### bank-movement.errors.ts

- **Ruta:** [bank-movement.errors.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/bank-movement.errors.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/bank-movement.errors.ts`, 410 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Errores de dominio: declara `InsufficientBankBalanceError`, `BankBalanceLimitExceededError`, `CreditLineLimitExceededError`, `CreditLineNoDebtError`, `CreditLineOverpaymentError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-account-receivable-settlement.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-settlement-repository-ts), [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts), [adjust-bank-balance.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-adjust-bank-balance-use-case-ts), [assert-bank-operation-day-open.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-assert-bank-operation-day-open-ts), [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [create-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-create-bank-use-case-ts), [list-bank-movements.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-movements-use-case-ts), [list-bank-transfers.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-transfers-use-case-ts), [register-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-balance-credit-use-case-ts), [register-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-transfer-use-case-ts), [update-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-update-bank-use-case-ts), [void-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-balance-credit-use-case-ts), [void-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-transfer-use-case-ts), [bank-movement.errors.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-spec-ts), [typeorm-bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-movement-repository-ts) y 5 más

#### Clase `InsufficientBankBalanceError` (L26–35)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `movementType: string`

#### Clase `BankBalanceLimitExceededError` (L45–69)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `movementType: string`, `specialAccount: string`, `maxBalance: string`, `bankName: string`

#### Clase `CreditLineLimitExceededError` (L78–92)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Línea de crédito de BI Club Empresarial (regla definitiva, migración `BiClubDebtModel`): el saldo es la DEUDA — Q0.00 = no se debe nada, −Q50,000 = se deben Q50,000 — y va de 0 a `-max_balance`. Una anulación o un ajuste que rompería esos límites se explica aparte, porque el usuario no está "usando" ni "devolviendo" nada.
- **Dependencias inyectadas (constructor):** `movementType: string`, `limit: `

#### Clase `CreditLineNoDebtError` (L94–106)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `movementType: string`

#### Clase `CreditLineOverpaymentError` (L108–120)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `movementType: string`

#### Clase `CreditLinePositiveBalanceError` (L122–130)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `LegacyCreditLineTransferError` (L132–140)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `TransferOriginNotAllowedError` (L142–152)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `destination: string`

#### Clase `TransferDestinationNotAllowedError` (L154–160)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankTransferDestinationRequiredError` (L162–168)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `SameAccountTransferError` (L170–176)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `InvalidMovementAmountError` (L178–184)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankBalanceUnchangedError` (L186–192)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `MovementReasonRequiredError` (L194–200)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankBalanceCreditNotFoundError` (L202–208)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`

#### Clase `BankBalanceCreditAlreadyVoidedError` (L210–216)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankTransferNotFoundError` (L218–224)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`

#### Clase `BankTransferAlreadyVoidedError` (L226–232)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GenesisAccountNotConfiguredError` (L234–242)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankAccountRequiredError` (L244–250)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankBalanceRequiresAdjustmentError` (L252–260)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `SpecialAccountAlreadyAssignedError` (L262–270)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankAccountNotAvailableError` (L272–280)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ReintegroSourceIsGenesisError` (L282–290)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GuayacanBalanceInCashBoxError` (L299–307)

- **Herencia / contratos:** extends DomainError
- **Propósito:** La cuenta GUAYACAN no tiene saldo bancario propio: su saldo es el efectivo del Cuadre de Caja Guayacán (migración `GuayacanSingleBalanceFromCashBox`).

#### Clase `GuayacanCashInsufficientError` (L310–321)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Retiro/Reintegro de Cooperativa Guayacán por más del efectivo disponible en su caja (fuente única de su saldo).
- **Dependencias inyectadas (constructor):** `available: string`

#### Clase `BankOperationDayNotOpenedError` (L383–391)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `date: string`

#### Clase `BankOperationDayClosedError` (L393–401)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `date: string`

#### Clase `InvalidBankMovementDateRangeError` (L403–409)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
#### Función `formatLimit` (L37–43)

- **Tipo:** función local del archivo
- **Firma:** `formatLimit(value: string): string` — [bank-movement.errors.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/bank-movement.errors.ts#L37)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`, `Number.isNaN`, `amount.toLocaleString`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `bankMovementErrorFromMessage` (L323–381)

- **Tipo:** función exportada
- **Firma:** `bankMovementErrorFromMessage(message: string): DomainError \| null` — [bank-movement.errors.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/bank-movement.errors.ts#L323)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `message.split`, `new InsufficientBankBalanceError`, `new GuayacanBalanceInCashBoxError`, `new GuayacanCashInsufficientError`, `new BankBalanceLimitExceededError`, `details.slice(3).join`, `details.slice`, `new CreditLineLimitExceededError`, `new CreditLineNoDebtError`, `new CreditLineOverpaymentError`, `new LegacyCreditLineTransferError`, `new TransferOriginNotAllowedError`, `new TransferDestinationNotAllowedError`, `new SameAccountTransferError`, `new InvalidMovementAmountError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-account-receivable-settlement.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-settlement-repository-ts), [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts), [typeorm-bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-movement-repository-ts), [typeorm-cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-control-repository-ts), [typeorm-cash-custody.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-infrastructure-persistence-typeorm-cash-custody-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-not-found-error-ts"></a>

### bank-not-found.error.ts

- **Ruta:** [bank-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/bank-not-found.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/bank-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Errores de dominio: declara `BankNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-deactivate-bank-use-case-ts), [get-bank-by-id.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-by-id-use-case-ts), [update-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-update-bank-use-case-ts), [typeorm-bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-balance-repository-ts), [typeorm-bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-movement-repository-ts)

#### Clase `BankNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-cuadre-cash-breakdown-error-ts"></a>

### cuadre-cash-breakdown.error.ts

- **Ruta:** [cuadre-cash-breakdown.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/cuadre-cash-breakdown.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/cuadre-cash-breakdown.error.ts`, 53 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Rejected cash breakdown of a Cuadre de Agentes (the SQL function `close_agent_day_with_cash_breakdown` raises the same codes).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [typeorm-agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-agent-reconciliation-repository-ts)

#### Clase `CuadreCashBreakdownError` (L29–52)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Rejected cash breakdown of a Cuadre de Agentes (the SQL function `close_agent_day_with_cash_breakdown` raises the same codes).
- **Dependencias inyectadas (constructor):** `code: keyof typeof MESSAGES \| string`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fromMessage` | método public static | 39–51 | `message: string` | `CuadreCashBreakdownError \| null` |

##### `CuadreCashBreakdownError.fromMessage`

- **Firma:** `fromMessage(message: string): CuadreCashBreakdownError \| null` — [cuadre-cash-breakdown.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/cuadre-cash-breakdown.error.ts#L39) (L39–51)
- **Propósito / descripción:** Maps a `RAISE EXCEPTION 'CUADRE_…:detail'` message, or null if it is not one.
- **Dependencias (llamadas en su cuerpo):** `Object.keys(MESSAGES).find`, `Object.keys`, `message.includes`, `new CuadreCashBreakdownError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-agent-reconciliation-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-day-already-closed-error-ts"></a>

### day-already-closed.error.ts

- **Ruta:** [day-already-closed.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/day-already-closed.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/day-already-closed.error.ts`, 21 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "The day is already closed and can't be modified" — covers the operations that get blocked once `day_openings.closed_at` is no longer null: saving/editing that date's bank balances (`SaveBankBalancesUseCase`) and saving a new cuadre for that same date (`CloseAgentDayUseCase`, which is also what closes it).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [save-bank-balances.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-save-bank-balances-use-case-ts), [typeorm-agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-agent-reconciliation-repository-ts)

#### Clase `DayAlreadyClosedError` (L12–20)

- **Herencia / contratos:** extends DomainError
- **Propósito:** "The day is already closed and can't be modified" — covers the operations that get blocked once `day_openings.closed_at` is no longer null: saving/editing that date's bank balances (`SaveBankBalancesUseCase`) and saving a new cuadre for that same date (`CloseAgentDayUseCase`, which is also what closes it). Never thrown for a date that was never opened — that case is still `DayNotOpenedError`, a distinct state.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-day-cancelled-error-ts"></a>

### day-cancelled.error.ts

- **Ruta:** [day-cancelled.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/day-cancelled.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/day-cancelled.error.ts`, 18 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Errores de dominio: declara `DayCancelledError`, `DayAlreadyCancelledError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-opening-repository-ts)

#### Clase `DayCancelledError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `date: string`

#### Clase `DayAlreadyCancelledError` (L11–17)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-day-not-closed-error-ts"></a>

### day-not-closed.error.ts

- **Ruta:** [day-not-closed.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/day-not-closed.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/day-not-closed.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Reopening or cancelling only makes sense for a day that's actually CLOSED.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-opening-repository-ts)

#### Clase `DayNotClosedError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Reopening or cancelling only makes sense for a day that's actually CLOSED.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-day-not-found-error-ts"></a>

### day-not-found.error.ts

- **Ruta:** [day-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/day-not-found.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/day-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Errores de dominio: declara `DayNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-day-detail.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts), [typeorm-day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-opening-repository-ts)

#### Clase `DayNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-day-not-opened-error-ts"></a>

### day-not-opened.error.ts

- **Ruta:** [day-not-opened.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/day-not-opened.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/day-not-opened.error.ts`, 27 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "The user must NOT be able to freely access...
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [save-bank-balances.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-save-bank-balances-use-case-ts), [typeorm-agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-agent-reconciliation-repository-ts)

#### Clase `DayNotOpenedError` (L13–26)

- **Herencia / contratos:** extends DomainError
- **Propósito:** "The user must NOT be able to freely access... until the sequence is properly completed: open the day → register balances → save → confirm." This error covers the two halves of that sequence that depend on having opened the day first: saving TODAY's bank balances (`SaveBankBalancesUseCase`) and saving an agent reconciliation (`CloseAgentDayUseCase`). Never thrown for a past date — those historical corrections are pre-existing functionality this ticket was required to preserve unchanged.
- **Dependencias inyectadas (constructor):** `date: string`, `action: 'balances' \| 'reconciliation'`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-invalid-account-type-error-ts"></a>

### invalid-account-type.error.ts

- **Ruta:** [invalid-account-type.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/invalid-account-type.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/invalid-account-type.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Errores de dominio: declara `InvalidAccountTypeError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-create-bank-use-case-ts), [update-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-update-bank-use-case-ts)

#### Clase `InvalidAccountTypeError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-invalid-bank-balance-error-ts"></a>

### invalid-bank-balance.error.ts

- **Ruta:** [invalid-bank-balance.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/invalid-bank-balance.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/invalid-bank-balance.error.ts`, 26 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Errores de dominio: declara `InvalidBankBalanceDateError`, `InvalidBankFinalBalanceError`, `NoBankBalancesToSaveError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-bank-balances-view.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balances-view-use-case-ts), [open-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-open-day-use-case-ts), [save-bank-balances.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-save-bank-balances-use-case-ts), [validate-bank-balances-for-date.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-ts), [typeorm-bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-balance-repository-ts)

#### Clase `InvalidBankBalanceDateError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `InvalidBankFinalBalanceError` (L11–17)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `bankId: string`

#### Clase `NoBankBalancesToSaveError` (L19–25)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-later-day-exists-error-ts"></a>

### later-day-exists.error.ts

- **Ruta:** [later-day-exists.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/later-day-exists.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/later-day-exists.error.ts`, 19 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** The later-day integrity rule (Option A, the safest of the options evaluated): a date is never reopened/cancelled if a strictly later date has a non-cancelled CLOSED/REOPENED cycle — this avoids inconsistencies in later balances without needing a cascading recalculation.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-opening-repository-ts)

#### Clase `LaterDayExistsError` (L10–18)

- **Herencia / contratos:** extends DomainError
- **Propósito:** The later-day integrity rule (Option A, the safest of the options evaluated): a date is never reopened/cancelled if a strictly later date has a non-cancelled CLOSED/REOPENED cycle — this avoids inconsistencies in later balances without needing a cascading recalculation. The user must handle the more recent days first.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-errors-reason-required-error-ts"></a>

### reason-required.error.ts

- **Ruta:** [reason-required.error.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/errors/reason-required.error.ts) (`comercial-jhoel-api/src/modules/banks/domain/errors/reason-required.error.ts`, 18 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Errores de dominio: declara `ReopenReasonRequiredError`, `CancelReasonRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [cancel-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-cancel-day-use-case-ts), [reopen-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-reopen-day-use-case-ts), [typeorm-day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-opening-repository-ts)

#### Clase `ReopenReasonRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CancelReasonRequiredError` (L11–17)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-banks-domain-repositories-agent-reconciliation-repository-ts"></a>

### agent-reconciliation.repository.ts

- **Ruta:** [agent-reconciliation.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/agent-reconciliation.repository.ts) (`comercial-jhoel-api/src/modules/banks/domain/repositories/agent-reconciliation.repository.ts`, 60 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** The cash breakdown a cuadre is saved with — stored as an independent photograph (`agent_reconciliation_cash_breakdowns`/`_details`).
- **Depende de (archivos del proyecto):** [agent-reconciliation.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-agent-reconciliation-entity-ts)
- **Consumidores:** [close-agent-day.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-spec-ts), [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [get-day-detail.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts), [get-day-status.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-status-use-case-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [typeorm-agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-agent-reconciliation-repository-ts), [create-agent-reconciliation.request.dto.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-create-agent-reconciliation-request-dto-ts)

**Interfaces, tipos y enums:**

- `interface CuadreCashBreakdownData` (L23): The cash breakdown a cuadre is saved with — stored as an independent photograph (`agent_reconciliation_cash_breakdowns`/`_details`). — miembros: `source`, `sourceCashCountId`, `details`
- `interface CloseAgentDayData` (L30): sin documentación — miembros: `date`, `totalCash`, `totalWarehouseCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `result`, `userId`, `cashBreakdown`
- `interface AgentReconciliationRepository` (L44): sin documentación — miembros: `closeDayWithReconciliation`, `existsForDate`, `findLatestByDate`
- `type CuadreCashBreakdownSource` (L13) = `(typeof CUADRE_CASH_BREAKDOWN_SOURCES)[number]`

**Constantes exportadas:**

- `AGENT_RECONCILIATION_REPOSITORY` (L3) = `Symbol( 'AGENT_RECONCILIATION_REPOSITORY', )`
- `CUADRE_CASH_BREAKDOWN_SOURCES` (L8): MANUAL = typed by hand; ARQUEO_CAJA = a standalone Arqueo de Caja; CORTE_CAJA = the arqueo of one cut. = `[ 'MANUAL', 'ARQUEO_CAJA', 'CORTE_CAJA', ] as const`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-balance-repository-ts"></a>

### bank-balance.repository.ts

- **Ruta:** [bank-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/bank-balance.repository.ts) (`comercial-jhoel-api/src/modules/banks/domain/repositories/bank-balance.repository.ts`, 23 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `SaveBankBalanceEntryData`, `SaveBankBalancesData`, `BankBalanceRepository`, `BANK_BALANCE_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-balance-view.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-balance-view-entity-ts)
- **Consumidores:** [get-bank-balances-view.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balances-view-use-case-ts), [get-day-detail.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts), [save-bank-balances.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-save-bank-balances-use-case-ts), [validate-bank-balances-for-date.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-spec-ts), [validate-bank-balances-for-date.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [typeorm-bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-balance-repository-ts)

**Interfaces, tipos y enums:**

- `interface SaveBankBalanceEntryData` (L5): sin documentación — miembros: `bankId`, `finalBalance`
- `interface SaveBankBalancesData` (L11): sin documentación — miembros: `operationDate`, `userId`, `entries`
- `interface BankBalanceRepository` (L17): sin documentación — miembros: `findBalancesView`, `saveBalances`

**Constantes exportadas:**

- `BANK_BALANCE_REPOSITORY` (L3) = `Symbol('BANK_BALANCE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts"></a>

### bank-movement.repository.ts

- **Ruta:** [bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/bank-movement.repository.ts) (`comercial-jhoel-api/src/modules/banks/domain/repositories/bank-movement.repository.ts`, 154 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RegisterBankTransferData`, `AdjustBankBalanceData`, `RegisterBankBalanceCreditData`, `BankBalanceCreditResult`, `LastBankMovement` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts)
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [adjust-bank-balance.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-adjust-bank-balance-use-case-ts), [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [get-bank-balance-strip.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-spec-ts), [get-bank-balance-strip.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-ts), [list-bank-balance-credits.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-balance-credits-use-case-ts), [list-bank-movements.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-movements-use-case-ts), [list-bank-transfers.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-transfers-use-case-ts), [register-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-balance-credit-use-case-ts), [register-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-transfer-use-case-ts), [void-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-balance-credit-use-case-ts), [void-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-transfer-use-case-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [typeorm-bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-movement-repository-ts) y 2 más

**Interfaces, tipos y enums:**

- `interface RegisterBankTransferData` (L11): sin documentación — miembros: `sourceBankId`, `destinationBankId`, `amount`, `businessDate`, `userId`, `referenceText`, `concept`
- `interface AdjustBankBalanceData` (L22): sin documentación — miembros: `bankId`, `newBalance`, `businessDate`, `userId`, `reason`, `observation`
- `interface RegisterBankBalanceCreditData` (L31): sin documentación — miembros: `bankId`, `amount`, `businessDate`, `userId`, `referenceText`, `observation`
- `interface BankBalanceCreditResult` (L41): Resultado de `register_bank_balance_credit`: la operación y el movimiento del ledger que generó. — miembros: `operationId`, `movement`
- `interface LastBankMovement` (L46): sin documentación — miembros: `amount`, `createdAt`
- `interface BankMovementFilters` (L52): sin documentación — miembros: `startDate`, `endDate`, `bankId`, `movementType`, `userId`
- `interface BankTransferFilters` (L61): Filtros de transferencias (Transferencias Bancarias y su reporte). — miembros: `startDate`, `endDate`, `bankId`, `sourceBankId`, `destinationBankId`, `userId`, `status`, `kind`
- `interface PaginatedBankTransfers` (L73): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface BankTransferRouteSummary` (L80): sin documentación — miembros: `sourceBankId`, `sourceBankName`, `sourceAccountNumber`, `destinationBankId`, `destinationBankName`, `destinationAccountNumber`, `transferCount`, `totalAmount`
- `interface BankTransfersSummary` (L93): Totales del reporte — `transferCount`/`totalAmount` excluyen las anuladas (mismo criterio que el resto de la Reportería). — miembros: `transferCount`, `totalAmount`, `voidedCount`, `voidedAmount`, `byRoute`
- `interface PaginatedBankMovements` (L101): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface BankMovementRepository` (L113): El ledger de saldos bancarios. — miembros: `registerTransfer`, `voidTransfer`, `adjustBalance`, `registerBalanceCredit`, `voidBalanceCredit`, `findMovements`, `findByReference`, `findTransferById`, `getLastMovementByBank`, `findTransfers`, `getTransfersSummary`

**Constantes exportadas:**

- `BANK_MOVEMENT_REPOSITORY` (L9) = `Symbol('BANK_MOVEMENT_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts"></a>

### bank.repository.ts

- **Ruta:** [bank.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/bank.repository.ts) (`comercial-jhoel-api/src/modules/banks/domain/repositories/bank.repository.ts`, 45 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateBankData`, `UpdateBankData`, `FindBanksOptions`, `BankRepository`, `BANK_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-entity-ts), [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts)
- **Consumidores:** [create-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-create-bank-use-case-ts), [deactivate-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-deactivate-bank-use-case-ts), [get-bank-balance-strip.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-spec-ts), [get-bank-balance-strip.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balance-strip-use-case-ts), [get-bank-by-id.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-by-id-use-case-ts), [get-cuadre-agentes-summary.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-spec-ts), [get-cuadre-agentes-summary.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-ts), [list-banks.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-banks-use-case-ts), [update-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-update-bank-use-case-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [typeorm-bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-repository-ts), [export-bank-movements-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-movements-report-pdf-use-case-ts), [export-bank-transfers-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CreateBankData` (L6): sin documentación — miembros: `name`, `accountNumber`, `accountTypeId`, `previousBalance`, `finalBalance`, `specialAccount`, `maxBalance`, `availableInTransaccionar`, `createdBy`
- `interface UpdateBankData` (L18): sin documentación — miembros: `name`, `accountNumber`, `accountTypeId`, `previousBalance`, `specialAccount`, `maxBalance`, `availableInTransaccionar`, `updatedBy`
- `interface FindBanksOptions` (L29): sin documentación — miembros: `activeOnly`, `search`
- `interface BankRepository` (L34): sin documentación — miembros: `findAll`, `findById`, `findByActiveNameAndAccountNumber`, `create`, `update`, `deactivate`

**Constantes exportadas:**

- `BANK_REPOSITORY` (L4) = `Symbol('BANK_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-audit-log-repository-ts"></a>

### day-audit-log.repository.ts

- **Ruta:** [day-audit-log.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/day-audit-log.repository.ts) (`comercial-jhoel-api/src/modules/banks/domain/repositories/day-audit-log.repository.ts`, 20 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateDayAuditLogData`, `DayAuditLogRepository`, `DAY_AUDIT_LOG_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [day-audit-log.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-day-audit-log-entity-ts)
- **Consumidores:** [get-day-detail.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts), [open-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-open-day-use-case-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [typeorm-day-audit-log.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-audit-log-repository-ts)

**Interfaces, tipos y enums:**

- `interface CreateDayAuditLogData` (L5): sin documentación — miembros: `date`, `action`, `performedBy`, `reason`, `previousStatus`, `newStatus`
- `interface DayAuditLogRepository` (L14): sin documentación — miembros: `findByDate`, `record`

**Constantes exportadas:**

- `DAY_AUDIT_LOG_REPOSITORY` (L3) = `Symbol('DAY_AUDIT_LOG_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts"></a>

### day-opening.repository.ts

- **Ruta:** [day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/day-opening.repository.ts) (`comercial-jhoel-api/src/modules/banks/domain/repositories/day-opening.repository.ts`, 55 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `ClosedDaysFilters`, `ClosedDayViewRow`, `DayOpeningRepository`, `ClosedDayStatus`, `ResultSign` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [day-opening.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-day-opening-entity-ts)
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [closed-day-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-closed-day-output-ts), [day-detail-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-day-detail-output-ts), [assert-bank-operation-day-open.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-assert-bank-operation-day-open-ts), [bank-movements.use-cases.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-bank-movements-use-cases-spec-ts), [cancel-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-cancel-day-use-case-ts), [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [get-day-detail.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts), [get-day-status.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-status-use-case-ts), [list-closed-days.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-closed-days-use-case-ts), [open-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-open-day-use-case-ts), [register-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-balance-credit-use-case-ts), [register-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-transfer-use-case-ts), [reopen-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-reopen-day-use-case-ts) y 6 más

**Interfaces, tipos y enums:**

- `interface ClosedDaysFilters` (L8): sin documentación — miembros: `dateFrom`, `dateTo`, `status`, `userId`, `resultSign`
- `interface ClosedDayViewRow` (L24): Row of the "Gestión de Días Cerrados" list — combines `day_openings` with the totals from that date's LATEST `agent_reconciliations` row (there can be more than one historical row if the day was reopened and closed again; the most recent one is what represents the current reconciliation). — miembros: `date`, `status`, `openedAt`, `openedByUsername`, `closedAt`, `closedByUsername`, `reopenedAt`, `reopenedByUsername`, `reopenReason`, `cancelledAt`, `cancelledByUsername`, `cancelReason`, `totalBanks`, `totalCash`, `totalAccountsReceivable`, `totalAssets`, `result`
- `interface DayOpeningRepository` (L44): sin documentación — miembros: `findByDate`, `open`, `findClosedDays`, `reopen`, `cancel`
- `type ClosedDayStatus` (L5) = `'CLOSED' \| 'REOPENED' \| 'CANCELLED'`
- `type ResultSign` (L6) = `'positive' \| 'negative' \| 'zero'`

**Constantes exportadas:**

- `DAY_OPENING_REPOSITORY` (L3) = `Symbol('DAY_OPENING_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-banks-domain-repositories-warehouse-cash-reader-ts"></a>

### warehouse-cash.reader.ts

- **Ruta:** [warehouse-cash.reader.ts](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/warehouse-cash.reader.ts) (`comercial-jhoel-api/src/modules/banks/domain/repositories/warehouse-cash.reader.ts`, 13 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Read-only view of the Bodega cash balance (its own Kardex, owned by Control de Efectivo) for Cuadre de Agentes, which is the consolidated cash cuadre: caja count + Bodega.
- **Descripción del autor (comentario del archivo):** Read-only view of the Bodega cash balance (its own Kardex, owned by Control de Efectivo) for Cuadre de Agentes, which is the consolidated cash cuadre: caja count + Bodega. A port of its own so the banks module does not depend on the cash-control module.
- **Consumidores:** [get-cuadre-agentes-summary.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [typeorm-warehouse-cash.reader.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-warehouse-cash-reader-ts)

**Interfaces, tipos y enums:**

- `interface WarehouseCashReader` (L9): sin documentación — miembros: `getBalance`

**Constantes exportadas:**

- `WAREHOUSE_CASH_READER` (L7): Read-only view of the Bodega cash balance (its own Kardex, owned by Control de Efectivo) for Cuadre de Agentes, which is the consolidated cash cuadre: caja count + Bodega. = `Symbol('WAREHOUSE_CASH_READER')`
<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-mapper-ts"></a>

### agent-reconciliation.mapper.ts

- **Ruta:** [agent-reconciliation.mapper.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/agent-reconciliation.mapper.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/agent-reconciliation.mapper.ts`, 21 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Mapper: declara `AgentReconciliationMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [agent-reconciliation.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-agent-reconciliation-entity-ts), [agent-reconciliation.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-orm-entity-ts)
- **Consumidores:** [typeorm-agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-agent-reconciliation-repository-ts)

#### Clase `AgentReconciliationMapper` (L4–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–19 | `orm: AgentReconciliationOrmEntity` | `AgentReconciliation` |

##### `AgentReconciliationMapper.toDomain`

- **Firma:** `toDomain(orm: AgentReconciliationOrmEntity): AgentReconciliation` — [agent-reconciliation.mapper.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/agent-reconciliation.mapper.ts#L5) (L5–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `AgentReconciliation.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-agent-reconciliation-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-orm-entity-ts"></a>

### agent-reconciliation.orm-entity.ts

- **Ruta:** [agent-reconciliation.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/agent-reconciliation.orm-entity.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/agent-reconciliation.orm-entity.ts`, 88 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `AgentReconciliationOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [agent-reconciliation.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-mapper-ts), [typeorm-agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-agent-reconciliation-repository-ts), [typeorm-agent-reconciliations-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-agent-reconciliations-report-repository-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `AgentReconciliationOrmEntity` (L12–87)

- **Decoradores:** `@Entity('agent_reconciliations')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column date: string`, `@Column totalCash: number`, `@Column totalWarehouseCash: number`, `@Column totalBanks: number`, `@Column totalAssets: number`, `@Column totalAccountsReceivable: number`, `@Column result: number`, `@CreateDateColumn createdAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`
<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-balance-orm-entity-ts"></a>

### bank-balance.orm-entity.ts

- **Ruta:** [bank-balance.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/bank-balance.orm-entity.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/bank-balance.orm-entity.ts`, 62 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `BankBalanceOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-orm-entity-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [typeorm-bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-balance-repository-ts)

#### Clase `BankBalanceOrmEntity` (L14–61)

- **Decoradores:** `@Entity('bank_balances')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column bankId: string`, `@ManyToOne bank: BankOrmEntity`, `@Column operationDate: string`, `@Column previousBalance: number`, `@Column finalBalance: number`, `@Column userId: string`, `@ManyToOne user: UserOrmEntity`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-mapper-ts"></a>

### bank.mapper.ts

- **Ruta:** [bank.mapper.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/bank.mapper.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/bank.mapper.ts`, 28 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Mapper: declara `BankMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-entity-ts), [bank.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-orm-entity-ts), [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts)
- **Consumidores:** [typeorm-bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-repository-ts)

#### Clase `BankMapper` (L5–27)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 6–26 | `orm: BankOrmEntity` | `Bank` |

##### `BankMapper.toDomain`

- **Firma:** `toDomain(orm: BankOrmEntity): Bank` — [bank.mapper.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/bank.mapper.ts#L6) (L6–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Bank.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-orm-entity-ts"></a>

### bank.orm-entity.ts

- **Ruta:** [bank.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/bank.orm-entity.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/bank.orm-entity.ts`, 108 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `BankOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-type.orm-entity.ts](account-types.md#f-comercial-jhoel-api-src-modules-account-types-infrastructure-persistence-account-type-orm-entity-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [bank-deposit-operation.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [bank-balance.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-balance-orm-entity-ts), [bank.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-mapper-ts), [typeorm-bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-balance-repository-ts), [typeorm-bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-movement-repository-ts), [typeorm-bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-repository-ts)

#### Clase `BankOrmEntity` (L17–107)

- **Decoradores:** `@Entity('banks')` `@Index('UQ_banks_name_account_number_active', ['name', 'accountNumber'], { unique: true, where: '"is_active" = true', })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column accountNumber: string`, `@Column accountTypeId: string`, `@ManyToOne accountType: AccountTypeOrmEntity`, `@Column previousBalance: number`, `@Column finalBalance: number`, `@Column specialAccount: string \| null`, `@Column maxBalance: number \| null`, `@Column availableInTransaccionar: boolean`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-audit-log-mapper-ts"></a>

### day-audit-log.mapper.ts

- **Ruta:** [day-audit-log.mapper.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/day-audit-log.mapper.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/day-audit-log.mapper.ts`, 22 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Mapper: declara `DayAuditLogMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [day-audit-log.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-day-audit-log-entity-ts), [day-audit-log.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-audit-log-orm-entity-ts)
- **Consumidores:** [typeorm-day-audit-log.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-audit-log-repository-ts)

#### Clase `DayAuditLogMapper` (L7–21)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 8–20 | `orm: DayAuditLogOrmEntity` | `DayAuditLog` |

##### `DayAuditLogMapper.toDomain`

- **Firma:** `toDomain(orm: DayAuditLogOrmEntity): DayAuditLog` — [day-audit-log.mapper.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/day-audit-log.mapper.ts#L8) (L8–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `DayAuditLog.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-day-audit-log.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-audit-log-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-audit-log-orm-entity-ts"></a>

### day-audit-log.orm-entity.ts

- **Ruta:** [day-audit-log.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/day-audit-log.orm-entity.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/day-audit-log.orm-entity.ts`, 45 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `DayAuditLogOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [day-audit-log.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-audit-log-mapper-ts), [typeorm-day-audit-log.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-audit-log-repository-ts)

#### Clase `DayAuditLogOrmEntity` (L10–44)

- **Decoradores:** `@Entity('day_audit_logs')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column date: string`, `@Column action: string`, `@Column performedBy: string`, `@ManyToOne performedByUser: UserOrmEntity`, `@Column performedAt: Date`, `@Column reason: string \| null`, `@Column previousStatus: string \| null`, `@Column newStatus: string \| null`
<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-opening-mapper-ts"></a>

### day-opening.mapper.ts

- **Ruta:** [day-opening.mapper.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/day-opening.mapper.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/day-opening.mapper.ts`, 27 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Mapper: declara `DayOpeningMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [day-opening.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-day-opening-entity-ts), [day-opening.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-opening-orm-entity-ts)
- **Consumidores:** [typeorm-day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-opening-repository-ts)

#### Clase `DayOpeningMapper` (L4–26)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–25 | `orm: DayOpeningOrmEntity` | `DayOpening` |

##### `DayOpeningMapper.toDomain`

- **Firma:** `toDomain(orm: DayOpeningOrmEntity): DayOpening` — [day-opening.mapper.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/day-opening.mapper.ts#L5) (L5–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `DayOpening.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-opening-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-opening-orm-entity-ts"></a>

### day-opening.orm-entity.ts

- **Ruta:** [day-opening.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/day-opening.orm-entity.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/day-opening.orm-entity.ts`, 79 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `DayOpeningOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [day-opening.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-opening-mapper-ts), [typeorm-day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-opening-repository-ts)

#### Clase `DayOpeningOrmEntity` (L10–78)

- **Decoradores:** `@Entity('day_openings')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column date: string`, `@Column openedBy: string`, `@ManyToOne openedByUser: UserOrmEntity`, `@Column openedAt: Date`, `@Column closedAt: Date \| null`, `@Column closedBy: string \| null`, `@ManyToOne closedByUser: UserOrmEntity \| null`, `@Column reopenedAt: Date \| null`, `@Column reopenedBy: string \| null`, `@ManyToOne reopenedByUser: UserOrmEntity \| null`, `@Column reopenReason: string \| null`, `@Column isCancelled: boolean`, `@Column cancelledAt: Date \| null`, `@Column cancelledBy: string \| null`, `@ManyToOne cancelledByUser: UserOrmEntity \| null`, `@Column cancelReason: string \| null`
<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-agent-reconciliation-repository-ts"></a>

### typeorm-agent-reconciliation.repository.ts

- **Ruta:** [typeorm-agent-reconciliation.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-agent-reconciliation.repository.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-agent-reconciliation.repository.ts`, 115 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmAgentReconciliationRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [agent-reconciliation.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-agent-reconciliation-entity-ts), [agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-agent-reconciliation-repository-ts), [day-not-opened.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-not-opened-error-ts), [day-already-closed.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-already-closed-error-ts), [bank-balances-not-registered.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-balances-not-registered-error-ts), [cuadre-cash-breakdown.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-cuadre-cash-breakdown-error-ts), [agent-reconciliation.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-orm-entity-ts), [agent-reconciliation.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts)

#### Clase `TypeOrmAgentReconciliationRepository` (L16–114)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements AgentReconciliationRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(AgentReconciliationOrmEntity) repository: Repository<AgentReconciliationOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `closeDayWithReconciliation` | método public async | 31–72 | `data: CloseAgentDayData` | `Promise<AgentReconciliation>` |
| `existsForDate` | método public async | 74–77 | `date: string` | `Promise<boolean>` |
| `findLatestByDate` | método public async | 79–85 | `date: string` | `Promise<AgentReconciliation \| null>` |
| `translateCloseError` | método private | 88–113 | `error: unknown` | `unknown` |

##### `TypeOrmAgentReconciliationRepository.closeDayWithReconciliation`

- **Firma:** `closeDayWithReconciliation(data: CloseAgentDayData): Promise<AgentReconciliation>` — [typeorm-agent-reconciliation.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-agent-reconciliation.repository.ts#L31) (L31–72)
- **Propósito / descripción:** A single `SELECT close_agent_day(...)` — the PL/pgSQL function does the `INSERT` into `agent_reconciliations` and the `UPDATE` of `day_openings.closed_at` inside its own implicit transaction (the same pattern `register_recharge_sales_closure`/`save_bank_balance` already use elsewhere in this codebase). A `RAISE EXCEPTION` in there rolls back both writes — one can never be left without the other.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `JSON.stringify`, `this.translateCloseError`, `this.repository.findOneOrFail`, `AgentReconciliationMapper.toDomain`
- **Efectos secundarios:** Llama funciones SQL: `close_agent_day_with_cash_breakdown`, `close_agent_day`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateCloseError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAgentReconciliationRepository.existsForDate`

- **Firma:** `existsForDate(date: string): Promise<boolean>` — [typeorm-agent-reconciliation.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-agent-reconciliation.repository.ts#L74) (L74–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.count`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAgentReconciliationRepository.findLatestByDate`

- **Firma:** `findLatestByDate(date: string): Promise<AgentReconciliation \| null>` — [typeorm-agent-reconciliation.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-agent-reconciliation.repository.ts#L79) (L79–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `AgentReconciliationMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAgentReconciliationRepository.translateCloseError`

- **Firma:** `translateCloseError(error: unknown): unknown` — [typeorm-agent-reconciliation.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-agent-reconciliation.repository.ts#L88) (L88–113)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;extra&gt;'` → domain-error translation pattern as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists.
- **Dependencias (llamadas en su cuerpo):** `CuadreCashBreakdownError.fromMessage`, `message.split`, `new DayNotOpenedError`, `new DayAlreadyClosedError`, `new BankBalancesNotRegisteredError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-balance-repository-ts"></a>

### typeorm-bank-balance.repository.ts

- **Ruta:** [typeorm-bank-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-balance.repository.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-balance.repository.ts`, 160 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmBankBalanceRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-balance-view.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-balance-view-entity-ts), [bank-balance.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-balance-repository-ts), [bank-not-found.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-not-found-error-ts), [bank-inactive.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-inactive-error-ts), [invalid-bank-balance.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-invalid-bank-balance-error-ts), [bank.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-orm-entity-ts), [bank-balance.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-balance-orm-entity-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts)

#### Clase `TypeOrmBankBalanceRepository` (L18–159)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements BankBalanceRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(BankOrmEntity) bankRepository: Repository<BankOrmEntity>`, `@InjectRepository(BankBalanceOrmEntity) bankBalanceRepository: Repository<BankBalanceOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findBalancesView` | método public async | 44–114 | `operationDate: string` | `Promise<BankBalanceView[]>` |
| `saveBalances` | método public async | 117–133 | `data: SaveBankBalancesData` | `Promise<number>` |
| `translateBalanceError` | método private | 136–158 | `error: unknown` | `unknown` |

##### `TypeOrmBankBalanceRepository.findBalancesView`

- **Firma:** `findBalancesView(operationDate: string): Promise<BankBalanceView[]>` — [typeorm-bank-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-balance.repository.ts#L44) (L44–114)
- **Propósito / descripción:** Resolves the same two values `save_bank_balance()` (migration `1757900000000-CreateBankAgentsModule`, refined by `1758500000000-OnlySyncBanksFinalBalanceForLatestDate`) computes on the write side, but as a read-only projection — kept in sync by hand rather than calling the function, since this is a `SELECT`, not a mutation: `previousBalance` is the most recent `bank_balances.finalBalance` strictly before `operationDate`, falling back to the bank's own `banks.previousBalance` (its configured opening balance) when this bank has no `bank_balances` history before that date yet; `finalBalance` is `null` unless a row already exists for *exactly* this date (nothing saved yet for that bank/date pair
- **Dependencias (llamadas en su cuerpo):** `this.bankRepository.createQueryBuilder('bank').innerJoin`, `this.bankRepository.createQueryBuilder`, `qb.select('bank.id', 'bankId').addSelect('bank.name', 'bankName').addSelect`, `qb.select('bank.id', 'bankId').addSelect`, `qb.select`, `subQb.select('previous.finalBalance', 'value').from`, `subQb.select`, `subQb.select('current.finalBalance', 'value').from(BankBalanceOrmEntity, 'current').where`, `subQb.select('current.finalBalance', 'value').from`, `qb.getRawMany`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankBalanceRepository.saveBalances`

- **Firma:** `saveBalances(data: SaveBankBalancesData): Promise<number>` — [typeorm-bank-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-balance.repository.ts#L117) (L117–133)
- **Propósito / descripción:** One outer TypeORM transaction wrapping one `save_bank_balance()` call per entry — the whole "Guardar Cambios" batch commits or rolls back together, per `SaveBankBalancesUseCase`'s own doc comment.
- **Dependencias (llamadas en su cuerpo):** `this.bankBalanceRepository.manager.transaction`, `manager.query`, `this.translateBalanceError`
- **Efectos secundarios:** Llama funciones SQL: `save_bank_balance`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateBalanceError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankBalanceRepository.translateBalanceError`

- **Firma:** `translateBalanceError(error: unknown): unknown` — [typeorm-bank-balance.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-balance.repository.ts#L136) (L136–158)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;bankId&gt;'` → domain-error translation pattern as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new BankNotFoundError`, `new BankInactiveError`, `new InvalidBankBalanceDateError`, `new InvalidBankFinalBalanceError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-movement-repository-ts"></a>

### typeorm-bank-movement.repository.ts

- **Ruta:** [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts`, 584 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmBankMovementRepository`, `MovementRow`, `TransferRow`, `MOVEMENT_SELECT`, `TRANSFER_SELECT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts), [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts), [bank-not-found.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-not-found-error-ts), [bank-inactive.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-inactive-error-ts), [bank.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-orm-entity-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts)

**Interfaces, tipos y enums:**

- `interface MovementRow` (L33): sin documentación — miembros: `id`, `sequence`, `bank_id`, `bank_name`, `account_number`, `account_type_name`, `movement_type`, `origin`, `amount`, `balance_before`, `balance_after`, `business_date`, `created_at`, `user_id`, `username`, `reference_type`, `reference_id`, `reference_text`, `concept`, `observation`, `counterpart_bank_id`, `counterpart_bank_name`, `counterpart_account_number`, `status`, `reversal_of_id`…
- `interface TransferRow` (L63): sin documentación — miembros: `id`, `kind`, `business_date`, `created_at`, `amount`, `user_id`, `username`, `reference_text`, `concept`, `status`, `source_bank_id`, `source_bank_name`, `source_account_number`, `source_balance_before`, `source_balance_after`, `destination_bank_id`, `destination_bank_name`, `destination_account_number`, `destination_balance_before`, `destination_balance_after`

#### Clase `TypeOrmBankMovementRepository` (L136–583)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements BankMovementRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(BankOrmEntity) bankRepository: Repository<BankOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `manager` | getter private | 143–145 | — | (inferido) |
| `registerTransfer` | método public async | 147–164 | `data: RegisterBankTransferData` | `Promise<string>` |
| `voidTransfer` | método public async | 166–182 | `transferId: string`, `businessDate: string`, `userId: string`, `reason: string` | `Promise<void>` |
| `adjustBalance` | método public async | 184–215 | `data: AdjustBankBalanceData` | `Promise<BankAccountMovement>` |
| `registerBalanceCredit` | método public async | 217–252 | `data: RegisterBankBalanceCreditData` | `Promise<BankBalanceCreditResult>` |
| `voidBalanceCredit` | método public async | 254–268 | `operationId: string`, `businessDate: string`, `userId: string`, `reason: string` | `Promise<void>` |
| `findMovements` | método public async | 270–292 | `filters: BankMovementFilters`, `page: number`, `limit: number` | `Promise<PaginatedBankMovements>` |
| `findByReference` | método public async | 294–303 | `referenceType: string`, `referenceId: string` | `Promise<BankAccountMovement[]>` |
| `findTransferById` | método public async | 305–311 | `transferId: string` | `Promise<BankTransfer \| null>` |
| `getLastMovementByBank` | método public async | 313–351 | — | `Promise<Map<string, LastBankMovement>>` |
| `findTransfers` | método public async | 353–375 | `filters: BankTransferFilters`, `page: number`, `limit: number` | `Promise<PaginatedBankTransfers>` |
| `getTransfersSummary` | método public async | 377–437 | `filters: BankTransferFilters` | `Promise<BankTransfersSummary>` |
| `buildTransferFilters` | método private | 440–470 | `filters: BankTransferFilters` | `{ where: string; params: unknown[]; }` |
| `buildFilters` | método private | 472–491 | `filters: BankMovementFilters` | `{ where: string; params: unknown[]; }` |
| `toMovement` | método private | 493–523 | `row: MovementRow` | `BankAccountMovement` |
| `toTransfer` | método private | 525–555 | `row: TransferRow` | `BankTransfer` |
| `translateError` | método private | 558–582 | `error: unknown` | `unknown` |

##### `TypeOrmBankMovementRepository.manager`

- **Firma:** `manager()` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L143) (L143–145)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankMovementRepository.registerTransfer`

- **Firma:** `registerTransfer(data: RegisterBankTransferData): Promise<string>` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L147) (L147–164)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.manager.query`, `this.translateError`
- **Efectos secundarios:** Llama funciones SQL: `register_bank_transfer`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankMovementRepository.voidTransfer`

- **Firma:** `voidTransfer(transferId: string, businessDate: string, userId: string, reason: string): Promise<void>` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L166) (L166–182)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.manager.query`, `this.translateError`
- **Efectos secundarios:** Llama funciones SQL: `void_bank_transfer`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankMovementRepository.adjustBalance`

- **Firma:** `adjustBalance(data: AdjustBankBalanceData): Promise<BankAccountMovement>` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L184) (L184–215)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.manager.query`, `this.translateError`, `new InternalServerErrorException`, `this.toMovement`
- **Efectos secundarios:** Llama funciones SQL: `adjust_bank_balance`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error)`, `new InternalServerErrorException( 'No se pudo recuperar el ajuste recién registrado.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankMovementRepository.registerBalanceCredit`

- **Firma:** `registerBalanceCredit(data: RegisterBankBalanceCreditData): Promise<BankBalanceCreditResult>` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L217) (L217–252)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.manager.query`, `this.translateError`, `new InternalServerErrorException`, `this.toMovement`
- **Efectos secundarios:** Llama funciones SQL: `register_bank_balance_credit`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la acreditación recién registrada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankMovementRepository.voidBalanceCredit`

- **Firma:** `voidBalanceCredit(operationId: string, businessDate: string, userId: string, reason: string): Promise<void>` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L254) (L254–268)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.manager.query`, `this.translateError`
- **Efectos secundarios:** Llama funciones SQL: `void_bank_balance_credit`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankMovementRepository.findMovements`

- **Firma:** `findMovements(filters: BankMovementFilters, page: number, limit: number): Promise<PaginatedBankMovements>` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L270) (L270–292)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.buildFilters`, `this.manager.query`, `rows.map`, `this.toMovement`, `parseInt`
- **Efectos secundarios:** Tablas en su SQL: `bank_account_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankMovementRepository.findByReference`

- **Firma:** `findByReference(referenceType: string, referenceId: string): Promise<BankAccountMovement[]>` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L294) (L294–303)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.manager.query`, `rows.map`, `this.toMovement`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankMovementRepository.findTransferById`

- **Firma:** `findTransferById(transferId: string): Promise<BankTransfer \| null>` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L305) (L305–311)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.manager.query`, `this.toTransfer`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankMovementRepository.getLastMovementByBank`

- **Firma:** `getLastMovementByBank(): Promise<Map<string, LastBankMovement>>` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L313) (L313–351)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.manager.query`, `new Set`, `new Map`, `[...rows.filter((row) => !guayacanIds.has(row.bank_id)),...guayacan].map`, `rows.filter`, `guayacanIds.has`, `parseFloat`
- **Efectos secundarios:** Tablas en su SQL: `bank_account_movements`, `banks`, `guayacan_cash_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankMovementRepository.findTransfers`

- **Firma:** `findTransfers(filters: BankTransferFilters, page: number, limit: number): Promise<PaginatedBankTransfers>` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L353) (L353–375)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.buildTransferFilters`, `this.manager.query`, `rows.map`, `this.toTransfer`, `parseInt`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankMovementRepository.getTransfersSummary`

- **Firma:** `getTransfersSummary(filters: BankTransferFilters): Promise<BankTransfersSummary>` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L377) (L377–437)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.buildTransferFilters`, `this.manager.query`, `parseInt`, `parseFloat`, `routes.map`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankMovementRepository.buildTransferFilters`

- **Firma:** `buildTransferFilters(filters: BankTransferFilters): { where: string; params: unknown[]; }` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L440) (L440–470)
- **Propósito / descripción:** Condiciones sobre el par salida (`s`) / entrada (`e`) de `TRANSFER_SELECT` — se anexan con AND a su WHERE.
- **Dependencias (llamadas en su cuerpo):** `params.push`, `conditions.push`, `condition.replace`, `add`, `conditions.join`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmBankMovementRepository.buildFilters`

- **Firma:** `buildFilters(filters: BankMovementFilters): { where: string; params: unknown[]; }` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L472) (L472–491)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `params.push`, `conditions.push`, `condition.replace`, `add`, `conditions.join`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmBankMovementRepository.toMovement`

- **Firma:** `toMovement(row: MovementRow): BankAccountMovement` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L493) (L493–523)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseInt`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmBankMovementRepository.toTransfer`

- **Firma:** `toTransfer(row: TransferRow): BankTransfer` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L525) (L525–555)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmBankMovementRepository.translateError`

- **Firma:** `translateError(error: unknown): unknown` — [typeorm-bank-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts#L558) (L558–582)
- **Propósito / descripción:** Mismo patrón `RAISE EXCEPTION '&lt;CODE&gt;:&lt;detalle&gt;'` → error de dominio que el resto de repositorios; el detalle técnico nunca llega al usuario.
- **Dependencias (llamadas en su cuerpo):** `bankMovementErrorFromMessage`, `message.split`, `new BankNotFoundError`, `new BankInactiveError`, `new BankTransferNotFoundError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-bank-repository-ts"></a>

### typeorm-bank.repository.ts

- **Ruta:** [typeorm-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank.repository.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank.repository.ts`, 168 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmBankRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-entity-ts), [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [bank-already-exists.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-already-exists-error-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts), [bank.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-orm-entity-ts), [bank.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-mapper-ts), [apply-search-terms.util.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-apply-search-terms-util-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts)

#### Clase `TypeOrmBankRepository` (L17–167)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements BankRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(BankOrmEntity) repository: Repository<BankOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 24–44 | `options: FindBanksOptions` | `Promise<Bank[]>` |
| `findById` | método public async | 46–49 | `id: string` | `Promise<Bank \| null>` |
| `findByActiveNameAndAccountNumber` | método public async | 51–59 | `name: string`, `accountNumber: string` | `Promise<Bank \| null>` |
| `create` | método public async | 61–97 | `data: CreateBankData` | `Promise<Bank>` |
| `update` | método public async | 99–112 | `id: string`, `data: UpdateBankData` | `Promise<Bank>` |
| `deactivate` | método public async | 114–116 | `id: string` | `Promise<void>` |
| `translateUniqueViolation` | método private | 119–136 | `error: unknown`, `name: string`, `accountNumber: string` | `unknown` |
| `toDomainList` | método private async | 144–154 | `orms: BankOrmEntity[]` | `Promise<Bank[]>` |
| `toDomain` | método private async | 156–159 | `orm: BankOrmEntity` | `Promise<Bank>` |
| `guayacanCashBalance` | método private async | 161–166 | — | `Promise<number>` |

##### `TypeOrmBankRepository.findAll`

- **Firma:** `findAll(options: FindBanksOptions): Promise<Bank[]>` — [typeorm-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank.repository.ts#L24) (L24–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('bank').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `applySearchTerms`, `qb.getMany`, `this.toDomainList`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankRepository.findById`

- **Firma:** `findById(id: string): Promise<Bank \| null>` — [typeorm-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank.repository.ts#L46) (L46–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `this.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankRepository.findByActiveNameAndAccountNumber`

- **Firma:** `findByActiveNameAndAccountNumber(name: string, accountNumber: string): Promise<Bank \| null>` — [typeorm-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank.repository.ts#L51) (L51–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `this.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankRepository.create`

- **Firma:** `create(data: CreateBankData): Promise<Bank>` — [typeorm-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank.repository.ts#L61) (L61–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.transaction`, `manager.save`, `manager.create`, `manager.query`, `this.repository.findOneOrFail`, `this.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name, data.accountNumber)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankRepository.update`

- **Firma:** `update(id: string, data: UpdateBankData): Promise<Bank>` — [typeorm-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank.repository.ts#L99) (L99–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `this.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation( error, data.name ?? '', data.accountNumber ?? '', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank.repository.ts#L114) (L114–116)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, name: string, accountNumber: string): unknown` — [typeorm-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank.repository.ts#L119) (L119–136)
- **Propósito / descripción:** Same DB-level-uniqueness-as-race-safety-net pattern as `TypeOrmProductRepository`'s own `translateUniqueViolation` — the use case's pre-check is the primary guard, this is the backstop.
- **Dependencias (llamadas en su cuerpo):** `new BankAlreadyExistsError`, `new SpecialAccountAlreadyAssignedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmBankRepository.toDomainList`

- **Firma:** `toDomainList(orms: BankOrmEntity[]): Promise<Bank[]>` — [typeorm-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank.repository.ts#L144) (L144–154)
- **Propósito / descripción:** Cooperativa Guayacán (`special_account = 'GUAYACAN'`) no tiene un saldo bancario propio: su saldo es el efectivo del Cuadre de Caja Guayacán, leído de la única fuente, `guayacan_cash_balance()` (migración `GuayacanSingleBalanceFromCashBox`). Su `final_balance` histórico no se usa.
- **Dependencias (llamadas en su cuerpo):** `orms.some`, `this.guayacanCashBalance`, `orms.map`, `BankMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmBankRepository.toDomain`

- **Firma:** `toDomain(orm: BankOrmEntity): Promise<Bank>` — [typeorm-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank.repository.ts#L156) (L156–159)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.toDomainList`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmBankRepository.guayacanCashBalance`

- **Firma:** `guayacanCashBalance(): Promise<number>` — [typeorm-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank.repository.ts#L161) (L161–166)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `parseFloat`
- **Efectos secundarios:** Llama funciones SQL: `guayacan_cash_balance`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-audit-log-repository-ts"></a>

### typeorm-day-audit-log.repository.ts

- **Ruta:** [typeorm-day-audit-log.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-audit-log.repository.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-audit-log.repository.ts`, 43 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmDayAuditLogRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [day-audit-log.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-day-audit-log-entity-ts), [day-audit-log.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-audit-log-repository-ts), [day-audit-log.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-audit-log-orm-entity-ts), [day-audit-log.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-audit-log-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts)

#### Clase `TypeOrmDayAuditLogRepository` (L12–42)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements DayAuditLogRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(DayAuditLogOrmEntity) repository: Repository<DayAuditLogOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findByDate` | método public async | 19–25 | `date: string` | `Promise<DayAuditLog[]>` |
| `record` | método public async | 27–41 | `data: CreateDayAuditLogData` | `Promise<DayAuditLog>` |

##### `TypeOrmDayAuditLogRepository.findByDate`

- **Firma:** `findByDate(date: string): Promise<DayAuditLog[]>` — [typeorm-day-audit-log.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-audit-log.repository.ts#L19) (L19–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `DayAuditLogMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmDayAuditLogRepository.record`

- **Firma:** `record(data: CreateDayAuditLogData): Promise<DayAuditLog>` — [typeorm-day-audit-log.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-audit-log.repository.ts#L27) (L27–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `DayAuditLogMapper.toDomain`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-day-opening-repository-ts"></a>

### typeorm-day-opening.repository.ts

- **Ruta:** [typeorm-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts`, 317 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmDayOpeningRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [day-opening.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-day-opening-entity-ts), [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [day-not-found.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-not-found-error-ts), [day-not-closed.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-not-closed-error-ts), [day-cancelled.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-day-cancelled-error-ts), [later-day-exists.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-later-day-exists-error-ts), [reason-required.error.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-reason-required-error-ts), [day-opening.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-opening-orm-entity-ts), [day-opening.mapper.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-day-opening-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts)

#### Clase `TypeOrmDayOpeningRepository` (L24–316)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements DayOpeningRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(DayOpeningOrmEntity) repository: Repository<DayOpeningOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findByDate` | método public async | 31–34 | `date: string` | `Promise<DayOpening \| null>` |
| `open` | método public async | 43–65 | `date: string`, `userId: string` | `Promise<DayOpening>` |
| `findClosedDays` | método public async | 77–240 | `filters: ClosedDaysFilters` | `Promise<ClosedDayViewRow[]>` |
| `reopen` | método public async | 242–257 | `date: string`, `userId: string`, `reason: string` | `Promise<DayOpening>` |
| `cancel` | método public async | 259–274 | `date: string`, `userId: string`, `reason: string` | `Promise<DayOpening>` |
| `formatDateOnly` | método private | 277–285 | `value: string \| Date` | `string` |
| `translateError` | método private | 288–315 | `error: unknown`, `date: string` | `unknown` |

##### `TypeOrmDayOpeningRepository.findByDate`

- **Firma:** `findByDate(date: string): Promise<DayOpening \| null>` — [typeorm-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts#L31) (L31–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `DayOpeningMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmDayOpeningRepository.open`

- **Firma:** `open(date: string, userId: string): Promise<DayOpening>` — [typeorm-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts#L43) (L43–65)
- **Propósito / descripción:** Idempotent: if `date` already has a row, returns it as-is (never creates a second one). The `try/catch` around the `UQ_day_openings_date` violation is the safety net for a double-click race — the same pattern `TypeOrmBankRepository.create` already uses for its own uniqueness — not the primary path.
- **Dependencias (llamadas en su cuerpo):** `this.findByDate`, `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `DayOpeningMapper.toDomain`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `error`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmDayOpeningRepository.findClosedDays`

- **Firma:** `findClosedDays(filters: ClosedDaysFilters): Promise<ClosedDayViewRow[]>` — [typeorm-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts#L77) (L77–240)
- **Propósito / descripción:** Lists only dates that were ever closed — never a day still in progress (`NOT_OPENED`/`OPENED`/`BANK_BALANCES_SAVED`), which isn't this administrative module's concern. Each total comes from a subquery correlated to that date's LATEST `agent_reconciliations` row (the same subquery pattern `findBalancesView` already uses for "the most recent previous balance") — there can be more than one historical row if the day was reopened and closed again more than once.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('day').leftJoin`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.select('day.date', 'date').addSelect('day.isCancelled', 'isCancelled').addSelect`, `qb.select('day.date', 'date').addSelect`, `qb.select`, `subQb.select('r.total_banks', 'value').from('agent_reconciliations', 'r').where`, `subQb.select('r.total_banks', 'value').from`, `subQb.select`, `subQb.select('r.total_cash', 'value').from('agent_reconciliations', 'r').where`, `subQb.select('r.total_cash', 'value').from`, `subQb.select('r.total_accounts_receivable', 'value').from`, `subQb.select('r.total_assets', 'value').from('agent_reconciliations', 'r').where`, `subQb.select('r.total_assets', 'value').from`, `subQb.select('r.result', 'value').from('agent_reconciliations', 'r').where`, `subQb.select('r.result', 'value').from`, `qb.getRawMany`, `rows.map`…
- **Efectos secundarios:** Tablas en su SQL: `agent_reconciliations`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmDayOpeningRepository.reopen`

- **Firma:** `reopen(date: string, userId: string, reason: string): Promise<DayOpening>` — [typeorm-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts#L242) (L242–257)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateError`, `this.repository.findOneOrFail`, `DayOpeningMapper.toDomain`
- **Efectos secundarios:** Llama funciones SQL: `reopen_agent_day`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error, date)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmDayOpeningRepository.cancel`

- **Firma:** `cancel(date: string, userId: string, reason: string): Promise<DayOpening>` — [typeorm-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts#L259) (L259–274)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateError`, `this.repository.findOneOrFail`, `DayOpeningMapper.toDomain`
- **Efectos secundarios:** Llama funciones SQL: `cancel_agent_day`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error, date)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmDayOpeningRepository.formatDateOnly`

- **Firma:** `formatDateOnly(value: string \| Date): string` — [typeorm-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts#L277) (L277–285)
- **Propósito / descripción:** UTC getters on purpose — the pg driver builds this `Date` at UTC midnight for a `date` column; using local getters could shift the date by a day depending on the server's timezone.
- **Dependencias (llamadas en su cuerpo):** `value.getUTCFullYear`, `String(value.getUTCMonth() + 1).padStart`, `String`, `value.getUTCMonth`, `String(value.getUTCDate()).padStart`, `value.getUTCDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmDayOpeningRepository.translateError`

- **Firma:** `translateError(error: unknown, date: string): unknown` — [typeorm-day-opening.repository.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts#L288) (L288–315)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;[:...]'` → domain-error translation pattern as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists. `reopen_agent_day`/`cancel_agent_day` (migration `1758900000000-AddDayReopeningAndAudit`, corrected by `1758900100000-FixLaterDayCheckIncludesReopened`) are the two functions behind `reopen()`/`cancel()` above.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new ReopenReasonRequiredError`, `new CancelReasonRequiredError`, `new DayNotFoundError`, `new DayCancelledError`, `new DayAlreadyCancelledError`, `new DayNotClosedError`, `new LaterDayExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-typeorm-warehouse-cash-reader-ts"></a>

### typeorm-warehouse-cash.reader.ts

- **Ruta:** [typeorm-warehouse-cash.reader.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-warehouse-cash.reader.ts) (`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-warehouse-cash.reader.ts`, 18 líneas)
- **Tipo:** Código TypeScript · **Capa:** Infraestructura · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** `SELECT warehouse_cash_balance()` (migration 1760007400000).
- **Depende de (archivos del proyecto):** [warehouse-cash.reader.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-warehouse-cash-reader-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts)

#### Clase `TypeOrmWarehouseCashReader` (L7–17)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements WarehouseCashReader
- **Propósito:** `SELECT warehouse_cash_balance()` (migration 1760007400000).
- **Dependencias inyectadas (constructor):** `@InjectDataSource() dataSource: DataSource`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getBalance` | método public async | 11–16 | — | `Promise<number>` |

##### `TypeOrmWarehouseCashReader.getBalance`

- **Firma:** `getBalance(): Promise<number>` — [typeorm-warehouse-cash.reader.ts](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-warehouse-cash.reader.ts#L11) (L11–16)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `Number`
- **Efectos secundarios:** Llama funciones SQL: `warehouse_cash_balance`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-banks-presentation-controllers-agent-reconciliations-controller-ts"></a>

### agent-reconciliations.controller.ts

- **Ruta:** [agent-reconciliations.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/agent-reconciliations.controller.ts) (`comercial-jhoel-api/src/modules/banks/presentation/controllers/agent-reconciliations.controller.ts`, 54 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "Guardar Cuadre" (Cuadre Agentes) — any authenticated account, same "operational, not admin-only" policy as `POST /banks/balances`/ `POST /recharges/*`.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [close-agent-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-close-agent-day-use-case-ts), [agent-reconciliation-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-agent-reconciliation-output-ts), [create-agent-reconciliation.request.dto.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-create-agent-reconciliation-request-dto-ts), [today-iso-date.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts)

#### Clase `AgentReconciliationsController` (L24–53)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('agent-reconciliations')`
- **Propósito:** "Guardar Cuadre" (Cuadre Agentes) — any authenticated account, same "operational, not admin-only" policy as `POST /banks/balances`/ `POST /recharges/*`. Since the "Cierre del Día" ticket, this same call also officially closes the day (see `CloseAgentDayUseCase`) — the route and the request DTO didn't change, only what happens server-side on save.
- **Dependencias inyectadas (constructor):** `closeAgentDayUseCase: CloseAgentDayUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 29–52 | `dto: CreateAgentReconciliationRequestDto`, `user: RequestUser` | `Promise<AgentReconciliationOutput>` |

##### `AgentReconciliationsController.create`

- **Firma:** `create(dto: CreateAgentReconciliationRequestDto, user: RequestUser): Promise<AgentReconciliationOutput>` — [agent-reconciliations.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/agent-reconciliations.controller.ts#L29) (L29–52)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.closeAgentDayUseCase.execute`, `todayIsoDate`, `dto.cashDetails.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts"></a>

### bank-transfers.controller.ts

- **Ruta:** [bank-transfers.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts) (`comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts`, 128 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Finanzas → Transferencias Bancarias.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [register-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-transfer-use-case-ts), [void-bank-transfer.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-transfer-use-case-ts), [list-bank-transfers.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-transfers-use-case-ts), [register-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-register-bank-balance-credit-use-case-ts), [void-bank-balance-credit.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-void-bank-balance-credit-use-case-ts), [list-bank-balance-credits.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-balance-credits-use-case-ts), [bank-movement-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-bank-movement-output-ts), [bank-balance-credit.request.dto.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-balance-credit-request-dto-ts), [bank-transfer.request.dto.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-transfer-request-dto-ts), [bank-transfers.query.dto.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-transfers-query-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts)

#### Clase `BankTransfersController` (L50–127)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('bank-transfers')`
- **Propósito:** Finanzas → Transferencias Bancarias. Registrar una transferencia es operativo (cualquier cuenta autenticada, mismo criterio que Transaccionar); anularla es de administración (`@Roles`), igual que anular una operación de Transaccionar. "Acreditar saldo" (`/bank-transfers/balance-credits`) suma saldo a una cuenta SIN contrapartida, así que las tres rutas son de administración: `@Roles('ADMIN', 'SUPER_ADMIN')` en el backend, igual que "Ajustar saldo" — ocultar el botón en Angular no es la protección.
- **Dependencias inyectadas (constructor):** `registerBankTransferUseCase: RegisterBankTransferUseCase`, `voidBankTransferUseCase: VoidBankTransferUseCase`, `listBankTransfersUseCase: ListBankTransfersUseCase`, `registerBankBalanceCreditUseCase: RegisterBankBalanceCreditUseCase`, `voidBankBalanceCreditUseCase: VoidBankBalanceCreditUseCase`, `listBankBalanceCreditsUseCase: ListBankBalanceCreditsUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `createBalanceCredit` | método public | 62–71 | `dto: CreateBankBalanceCreditRequestDto`, `userId: string` | `Promise<BankMovementOutput>` |
| `findBalanceCredits` | método public | 73–80 | `query: BankBalanceCreditsQueryDto` | `Promise<PaginatedBankMovementsOutput>` |
| `voidBalanceCredit` | método public | 82–95 | `operationId: string`, `dto: VoidBankBalanceCreditRequestDto`, `userId: string` | `Promise<BankMovementOutput>` |
| `create` | método public | 97–104 | `dto: CreateBankTransferRequestDto`, `userId: string` | `Promise<BankTransferOutput>` |
| `findAll` | método public | 106–111 | `query: BankTransfersQueryDto` | `Promise<BankTransferOutput[]>` |
| `voidTransfer` | método public | 113–126 | `id: string`, `dto: VoidBankTransferRequestDto`, `userId: string` | `Promise<BankTransferOutput>` |

##### `BankTransfersController.createBalanceCredit`

- **Firma:** `createBalanceCredit(dto: CreateBankBalanceCreditRequestDto, userId: string): Promise<BankMovementOutput>` — [bank-transfers.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts#L62) (L62–71)
- **Decoradores:** `@Post('balance-credits')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerBankBalanceCreditUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankTransfersController.findBalanceCredits`

- **Firma:** `findBalanceCredits(query: BankBalanceCreditsQueryDto): Promise<PaginatedBankMovementsOutput>` — [bank-transfers.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts#L73) (L73–80)
- **Decoradores:** `@Get('balance-credits')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listBankBalanceCreditsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankTransfersController.voidBalanceCredit`

- **Firma:** `voidBalanceCredit(operationId: string, dto: VoidBankBalanceCreditRequestDto, userId: string): Promise<BankMovementOutput>` — [bank-transfers.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts#L82) (L82–95)
- **Decoradores:** `@Post('balance-credits/:operationId/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('operationId', ParseUUIDPipe) operationId`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidBankBalanceCreditUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankTransfersController.create`

- **Firma:** `create(dto: CreateBankTransferRequestDto, userId: string): Promise<BankTransferOutput>` — [bank-transfers.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts#L97) (L97–104)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerBankTransferUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankTransfersController.findAll`

- **Firma:** `findAll(query: BankTransfersQueryDto): Promise<BankTransferOutput[]>` — [bank-transfers.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts#L106) (L106–111)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listBankTransfersUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankTransfersController.voidTransfer`

- **Firma:** `voidTransfer(id: string, dto: VoidBankTransferRequestDto, userId: string): Promise<BankTransferOutput>` — [bank-transfers.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts#L113) (L113–126)
- **Decoradores:** `@Post(':id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidBankTransferUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts"></a>

### banks.controller.ts

- **Ruta:** [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts) (`comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts`, 236 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** CRUD (create/update/deactivate) is admin-only, same policy as CategoriesController/ProductsController — Sistema → Bancos is a management screen.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-create-bank-use-case-ts), [list-banks.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-banks-use-case-ts), [get-bank-by-id.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-by-id-use-case-ts), [update-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-update-bank-use-case-ts), [deactivate-bank.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-deactivate-bank-use-case-ts), [get-bank-balances-view.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-bank-balances-view-use-case-ts), [save-bank-balances.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-save-bank-balances-use-case-ts), [get-cuadre-agentes-summary.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-ts), [validate-bank-balances-for-date.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-validate-bank-balances-for-date-use-case-ts), [get-day-status.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-status-use-case-ts), [open-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-open-day-use-case-ts) y 18 más
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts)

#### Clase `BanksController` (L68–235)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('banks')`
- **Propósito:** CRUD (create/update/deactivate) is admin-only, same policy as CategoriesController/ProductsController — Sistema → Bancos is a management screen. `balances`/`balances/save` are the Agentes Bancarios → Bancos operational routes: any authenticated user can register a day's cuadre, same policy as Purchases/Sales/Recargas (registering an operational figure is not an admin-only action in this app). Route order matters, same lesson as SalesController/ProductsController: `balances`/`balances/save` must be declared before `:id`, or Nest would match them as `GET /banks/:id` with `id="balances"` and fail `ParseUUIDPipe` instead of reaching the intended handler.
- **Dependencias inyectadas (constructor):** `createBankUseCase: CreateBankUseCase`, `listBanksUseCase: ListBanksUseCase`, `getBankByIdUseCase: GetBankByIdUseCase`, `updateBankUseCase: UpdateBankUseCase`, `deactivateBankUseCase: DeactivateBankUseCase`, `getBankBalancesViewUseCase: GetBankBalancesViewUseCase`, `saveBankBalancesUseCase: SaveBankBalancesUseCase`, `getCuadreAgentesSummaryUseCase: GetCuadreAgentesSummaryUseCase`, `validateBankBalancesForDateUseCase: ValidateBankBalancesForDateUseCase`, `getDayStatusUseCase: GetDayStatusUseCase`, `openDayUseCase: OpenDayUseCase`, `adjustBankBalanceUseCase: AdjustBankBalanceUseCase`, `getBankBalanceStripUseCase: GetBankBalanceStripUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getDayStatus` | método public | 93–96 | `query: DayStatusQueryDto` | `Promise<DayStatusOutput>` |
| `openDay` | método public | 104–114 | `dto: OpenDayRequestDto`, `userId: string` | `Promise<DayStatusOutput>` |
| `getBalanceStrip` | método public | 121–124 | — | `Promise<BankBalanceStripItem[]>` |
| `getBalancesView` | método public | 126–131 | `query: BankBalancesViewQueryDto` | `Promise<BankBalanceViewResponseDto[]>` |
| `getCuadreAgentesSummary` | método public | 142–145 | — | `Promise<CuadreAgentesSummaryOutput>` |
| `validateBankBalances` | método public | 155–162 | `query: BankBalancesValidationQueryDto` | `Promise<BankBalancesValidationOutput>` |
| `saveBalances` | método public | 164–171 | `dto: SaveBankBalancesRequestDto`, `userId: string` | `Promise<SaveBankBalancesResponseDto>` |
| `create` | método public | 173–182 | `dto: CreateBankRequestDto`, `userId: string` | `Promise<BankResponseDto>` |
| `findAll` | método public | 184–187 | `query: ListBanksQueryDto` | `Promise<BankResponseDto[]>` |
| `findOne` | método public | 189–192 | `id: string` | `Promise<BankResponseDto>` |
| `update` | método public | 194–203 | `id: string`, `dto: UpdateBankRequestDto`, `userId: string` | `Promise<BankResponseDto>` |
| `adjustBalance` | método public | 210–226 | `id: string`, `dto: AdjustBankBalanceRequestDto`, `userId: string` | `Promise<BankMovementOutput>` |
| `deactivate` | método public | 228–234 | `id: string` | `Promise<void>` |

##### `BanksController.getDayStatus`

- **Firma:** `getDayStatus(query: DayStatusQueryDto): Promise<DayStatusOutput>` — [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L93) (L93–96)
- **Decoradores:** `@Get('day-status')`
- **Propósito / descripción:** "Is the day open? Were balances already saved? Can Cuadre Agentes be entered? Was the cuadre already done?" — one call answers all four questions of the mandatory sequence. Any authenticated user, same policy as `balances`/`cuadre-agentes-summary`.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getDayStatusUseCase.execute`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BanksController.openDay`

- **Firma:** `openDay(dto: OpenDayRequestDto, userId: string): Promise<DayStatusOutput>` — [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L104) (L104–114)
- **Decoradores:** `@Post('day-status/open')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** "Confirmar Apertura" — idempotent (see `DayOpeningRepository.open`), so a double click or a retry never creates a second opening or fails. Any authenticated user can open the day, same operational policy as saving balances or doing the cuadre.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.openDayUseCase.execute`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BanksController.getBalanceStrip`

- **Firma:** `getBalanceStrip(): Promise<BankBalanceStripItem[]>` — [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L121) (L121–124)
- **Decoradores:** `@Get('balance-strip')`
- **Propósito / descripción:** Tira de saldos (Transaccionar y Resumen): cuentas principales, saldo actual y tendencia del día. Cualquier cuenta autenticada, igual que `balances`. Declarada antes de `:id` por el mismo motivo de enrutamiento.
- **Dependencias (llamadas en su cuerpo):** `this.getBankBalanceStripUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BanksController.getBalancesView`

- **Firma:** `getBalancesView(query: BankBalancesViewQueryDto): Promise<BankBalanceViewResponseDto[]>` — [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L126) (L126–131)
- **Decoradores:** `@Get('balances')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getBankBalancesViewUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BanksController.getCuadreAgentesSummary`

- **Firma:** `getCuadreAgentesSummary(): Promise<CuadreAgentesSummaryOutput>` — [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L142) (L142–145)
- **Decoradores:** `@Get('cuadre-agentes-summary')`
- **Propósito / descripción:** Cuadre Agentes (primera etapa) — declared before `:id`, same routing lesson as `balances`/`balances/save` above: a literal segment must be registered ahead of a dynamic `:id` or Nest would try to match it as `GET /banks/:id` and fail `ParseUUIDPipe` instead of reaching this handler. Any authenticated user, same "operational, not admin-only" policy as `balances` — this is a read-only summary, not a management screen.
- **Dependencias (llamadas en su cuerpo):** `this.getCuadreAgentesSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BanksController.validateBankBalances`

- **Firma:** `validateBankBalances(query: BankBalancesValidationQueryDto): Promise<BankBalancesValidationOutput>` — [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L155) (L155–162)
- **Decoradores:** `@Get('balances/validation')`
- **Propósito / descripción:** "Were this date's bank balances already saved?" — the pre-check Cuadre Agentes uses to enable/block "Guardar Cuadre" in the UI. This is UX only: `CloseAgentDayUseCase` re-runs this exact same validation server-side before saving, so a client that skips this call (or lies about its result) gains nothing — the actual save still enforces it. Declared before `:id` for the same routing reason as always.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.validateBankBalancesForDateUseCase.execute`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BanksController.saveBalances`

- **Firma:** `saveBalances(dto: SaveBankBalancesRequestDto, userId: string): Promise<SaveBankBalancesResponseDto>` — [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L164) (L164–171)
- **Decoradores:** `@Post('balances')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.saveBankBalancesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BanksController.create`

- **Firma:** `create(dto: CreateBankRequestDto, userId: string): Promise<BankResponseDto>` — [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L173) (L173–182)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createBankUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BanksController.findAll`

- **Firma:** `findAll(query: ListBanksQueryDto): Promise<BankResponseDto[]>` — [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L184) (L184–187)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listBanksUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BanksController.findOne`

- **Firma:** `findOne(id: string): Promise<BankResponseDto>` — [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L189) (L189–192)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getBankByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BanksController.update`

- **Firma:** `update(id: string, dto: UpdateBankRequestDto, userId: string): Promise<BankResponseDto>` — [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L194) (L194–203)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateBankUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BanksController.adjustBalance`

- **Firma:** `adjustBalance(id: string, dto: AdjustBankBalanceRequestDto, userId: string): Promise<BankMovementOutput>` — [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L210) (L210–226)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post(':id/balance-adjustments')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** "Ajustar saldo" — solo admin/super_admin, validado aquí en el backend (no basta con ocultar el botón). Queda como movimiento AJUSTE_MANUAL auditado, nunca como sobrescritura silenciosa de `final_balance`.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.adjustBankBalanceUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BanksController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [banks.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts#L228) (L228–234)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateBankUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts"></a>

### closed-days.controller.ts

- **Ruta:** [closed-days.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/closed-days.controller.ts) (`comercial-jhoel-api/src/modules/banks/presentation/controllers/closed-days.controller.ts`, 69 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** "Sistema → Gestión de Días Cerrados" — a highly sensitive administrative module (reopens/cancels already-closed financial reconciliations).
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [list-closed-days.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-closed-days-use-case-ts), [get-day-detail.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-day-detail-use-case-ts), [reopen-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-reopen-day-use-case-ts), [cancel-day.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-cancel-day-use-case-ts), [list-closed-days.query.dto.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-list-closed-days-query-dto-ts), [day-action-reason.request.dto.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-dtos-day-action-reason-request-dto-ts), [closed-day-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-closed-day-output-ts), [day-detail-output.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-dtos-day-detail-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts)

#### Clase `ClosedDaysController` (L30–68)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('closed-days')`
- **Propósito:** "Sistema → Gestión de Días Cerrados" — a highly sensitive administrative module (reopens/cancels already-closed financial reconciliations). `@Roles` at the class level, same as `RolesController`: EVERY route, including the `GET`s, requires ADMIN/SUPER_ADMIN — this is the real protection; the frontend's Sidebar/adminGuard are UX only.
- **Dependencias inyectadas (constructor):** `listClosedDaysUseCase: ListClosedDaysUseCase`, `getDayDetailUseCase: GetDayDetailUseCase`, `reopenDayUseCase: ReopenDayUseCase`, `cancelDayUseCase: CancelDayUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 41–44 | `query: ListClosedDaysQueryDto` | `Promise<ClosedDayOutput[]>` |
| `findOne` | método public | 46–49 | `date: string` | `Promise<DayDetailOutput>` |
| `reopen` | método public | 51–58 | `date: string`, `dto: DayActionReasonRequestDto`, `userId: string` | `Promise<DayDetailOutput>` |
| `cancel` | método public | 60–67 | `date: string`, `dto: DayActionReasonRequestDto`, `userId: string` | `Promise<DayDetailOutput>` |

##### `ClosedDaysController.findAll`

- **Firma:** `findAll(query: ListClosedDaysQueryDto): Promise<ClosedDayOutput[]>` — [closed-days.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/closed-days.controller.ts#L41) (L41–44)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listClosedDaysUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ClosedDaysController.findOne`

- **Firma:** `findOne(date: string): Promise<DayDetailOutput>` — [closed-days.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/closed-days.controller.ts#L46) (L46–49)
- **Decoradores:** `@Get(':date')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('date') date`
- **Dependencias (llamadas en su cuerpo):** `this.getDayDetailUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ClosedDaysController.reopen`

- **Firma:** `reopen(date: string, dto: DayActionReasonRequestDto, userId: string): Promise<DayDetailOutput>` — [closed-days.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/closed-days.controller.ts#L51) (L51–58)
- **Decoradores:** `@Post(':date/reopen')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('date') date`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.reopenDayUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ClosedDaysController.cancel`

- **Firma:** `cancel(date: string, dto: DayActionReasonRequestDto, userId: string): Promise<DayDetailOutput>` — [closed-days.controller.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/closed-days.controller.ts#L60) (L60–67)
- **Decoradores:** `@Post(':date/cancel')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('date') date`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.cancelDayUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-adjust-bank-balance-request-dto-ts"></a>

### adjust-bank-balance.request.dto.ts

- **Ruta:** [adjust-bank-balance.request.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/adjust-bank-balance.request.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/adjust-bank-balance.request.dto.ts`, 31 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** `newBalance` puede ser negativo en el DTO a propósito: solo la línea de crédito de Fundación Génesis lo admite, y esa regla vive en `apply_bank_account_movement` (una cuenta normal se rechaza allí).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `AdjustBankBalanceRequestDto` (L14–30)

- **Propósito:** `newBalance` puede ser negativo en el DTO a propósito: solo la línea de crédito de Fundación Génesis lo admite, y esa regla vive en `apply_bank_account_movement` (una cuenta normal se rechaza allí).
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-balance-credit-request-dto-ts"></a>

### bank-balance-credit.request.dto.ts

- **Ruta:** [bank-balance-credit.request.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/bank-balance-credit.request.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/bank-balance-credit.request.dto.ts`, 91 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Acreditar saldo: solo la cuenta (del catálogo existente) y un monto positivo con máximo 2 decimales.
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

#### Clase `CreateBankBalanceCreditRequestDto` (L35–56)

- **Propósito:** Acreditar saldo: solo la cuenta (del catálogo existente) y un monto positivo con máximo 2 decimales.

#### Clase `VoidBankBalanceCreditRequestDto` (L58–63)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankBalanceCreditsQueryDto` (L65–90)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
#### Función `IsWithinMaxAmount` (L24–32)

- **Tipo:** función local del archivo
- **Firma:** `IsWithinMaxAmount(): PropertyDecorator` — [bank-balance-credit.request.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/bank-balance-credit.request.dto.ts#L24)
- **Propósito / descripción:** Solo evalúa el tope cuando el valor ya es un número: un monto ausente o de texto ya lo reportan `@IsNumber`/`@Min`, sin sumar un "excede el máximo" engañoso.
- **Dependencias:** `ValidateBy`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-balance-view-response-dto-ts"></a>

### bank-balance-view.response.dto.ts

- **Ruta:** [bank-balance-view.response.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/bank-balance-view.response.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/bank-balance-view.response.dto.ts`, 16 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de respuesta: declara `BankBalanceViewResponseDto`, `SaveBankBalancesResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `BankBalanceViewResponseDto` (L1–11)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `SaveBankBalancesResponseDto` (L13–15)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-balances-validation-query-dto-ts"></a>

### bank-balances-validation.query.dto.ts

- **Ruta:** [bank-balances-validation.query.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/bank-balances-validation.query.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/bank-balances-validation.query.dto.ts`, 9 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Omitted = today, resolved in the controller (the same `todayIsoDate()` already used by `AgentReconciliationsController`).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `BankBalancesValidationQueryDto` (L4–8)

- **Propósito:** Omitted = today, resolved in the controller (the same `todayIsoDate()` already used by `AgentReconciliationsController`).
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-balances-view-query-dto-ts"></a>

### bank-balances-view.query.dto.ts

- **Ruta:** [bank-balances-view.query.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/bank-balances-view.query.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/bank-balances-view.query.dto.ts`, 7 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de consulta: declara `BankBalancesViewQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `BankBalancesViewQueryDto` (L3–6)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-transfer-request-dto-ts"></a>

### bank-transfer.request.dto.ts

- **Ruta:** [bank-transfer.request.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/bank-transfer.request.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/bank-transfer.request.dto.ts`, 48 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de entrada: declara `CreateBankTransferRequestDto`, `VoidBankTransferRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

#### Clase `CreateBankTransferRequestDto` (L11–41)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `VoidBankTransferRequestDto` (L43–47)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-transfers-query-dto-ts"></a>

### bank-transfers.query.dto.ts

- **Ruta:** [bank-transfers.query.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/bank-transfers.query.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/bank-transfers.query.dto.ts`, 31 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de consulta: declara `BankTransfersQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [bank-transfers.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-bank-transfers-controller-ts)

#### Clase `BankTransfersQueryDto` (L11–30)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-bank-response-dto-ts"></a>

### bank.response.dto.ts

- **Ruta:** [bank.response.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/bank.response.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/bank.response.dto.ts`, 20 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de respuesta: declara `BankResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `BankResponseDto` (L1–19)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-create-agent-reconciliation-request-dto-ts"></a>

### create-agent-reconciliation.request.dto.ts

- **Ruta:** [create-agent-reconciliation.request.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/create-agent-reconciliation.request.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/create-agent-reconciliation.request.dto.ts`, 77 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** One denomination row of the cuadre's cash count (whole quantity ≥ 0).
- **Depende de (archivos del proyecto):** [cash-denominations.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-cash-denominations-ts), [agent-reconciliation.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-agent-reconciliation-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [agent-reconciliations.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-agent-reconciliations-controller-ts)

#### Clase `CuadreCashDetailRequestDto` (L24–32)

- **Propósito:** One denomination row of the cuadre's cash count (whole quantity ≥ 0).

#### Clase `CreateAgentReconciliationRequestDto` (L45–76)

- **Propósito:** `totalBanks`/`totalAssets`/`totalAccountsReceivable`/`result` are never accepted from the client (see `CloseAgentDayUseCase`), and the global `ValidationPipe`'s `forbidNonWhitelisted` rejects a request body that includes them with a 400 before this DTO's own decorators even run, closing off any "send it anyway and hope it's used" manipulation path. `cashDetails` + `cashBreakdownSource` (+ `sourceCashCountId` when loaded from an Arqueo de Caja) are optional together: when sent, the backend checks they add up exactly to `totalCash` and stores them as a photograph.
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-create-bank-request-dto-ts"></a>

### create-bank.request.dto.ts

- **Ruta:** [create-bank.request.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/create-bank.request.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/create-bank.request.dto.ts`, 62 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de entrada: declara `CreateBankRequestDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `CreateBankRequestDto` (L15–61)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-day-action-reason-request-dto-ts"></a>

### day-action-reason.request.dto.ts

- **Ruta:** [day-action-reason.request.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/day-action-reason.request.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/day-action-reason.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Shared by "Reabrir Día" and "Anular Día" — both require a mandatory, non-empty reason.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts)

#### Clase `DayActionReasonRequestDto` (L4–10)

- **Propósito:** Shared by "Reabrir Día" and "Anular Día" — both require a mandatory, non-empty reason.
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-day-status-query-dto-ts"></a>

### day-status.query.dto.ts

- **Ruta:** [day-status.query.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/day-status.query.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/day-status.query.dto.ts`, 9 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Omitted = today, resolved in the controller.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `DayStatusQueryDto` (L4–8)

- **Propósito:** Omitted = today, resolved in the controller.
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-list-banks-query-dto-ts"></a>

### list-banks.query.dto.ts

- **Ruta:** [list-banks.query.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/list-banks.query.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/list-banks.query.dto.ts`, 14 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de consulta: declara `ListBanksQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `ListBanksQueryDto` (L4–13)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-list-closed-days-query-dto-ts"></a>

### list-closed-days.query.dto.ts

- **Ruta:** [list-closed-days.query.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/list-closed-days.query.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/list-closed-days.query.dto.ts`, 31 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de consulta: declara `ListClosedDaysQueryDto`, `STATUSES`, `RESULT_SIGNS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [closed-days.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-closed-days-controller-ts)

#### Clase `ListClosedDaysQueryDto` (L10–30)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-open-day-request-dto-ts"></a>

### open-day.request.dto.ts

- **Ruta:** [open-day.request.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/open-day.request.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/open-day.request.dto.ts`, 9 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** Omitted = today, resolved in the controller.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `OpenDayRequestDto` (L4–8)

- **Propósito:** Omitted = today, resolved in the controller.
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-save-bank-balances-request-dto-ts"></a>

### save-bank-balances.request.dto.ts

- **Ruta:** [save-bank-balances.request.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/save-bank-balances.request.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/save-bank-balances.request.dto.ts`, 33 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de entrada: declara `SaveBankBalanceEntryRequestDto`, `SaveBankBalancesRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `SaveBankBalanceEntryRequestDto` (L11–18)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `SaveBankBalancesRequestDto` (L20–32)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-banks-presentation-dtos-update-bank-request-dto-ts"></a>

### update-bank.request.dto.ts

- **Ruta:** [update-bank.request.dto.ts](../../../../comercial-jhoel-api/src/modules/banks/presentation/dtos/update-bank.request.dto.ts) (`comercial-jhoel-api/src/modules/banks/presentation/dtos/update-bank.request.dto.ts`, 59 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `banks`
- **Responsabilidad:** DTO de entrada: declara `UpdateBankRequestDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [banks.controller.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-presentation-controllers-banks-controller-ts)

#### Clase `UpdateBankRequestDto` (L15–58)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
