# Módulo backend `bank-deposits`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/bank-deposits` | [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L70) `BankDepositsController.create` | [RegisterBankDepositOperationUseCase](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts) | `BankDepositRepository`.registerOperation → `register_bank_deposit_operation`<br>`DayOpeningRepository`.findByDate<br>`ClientRepository`.findById<br>`TransactionManager`.runInTransaction<br>`RegisterAccountReceivableChargeUseCase`.execute<br>`RegisterAssetChargeUseCase`.execute<br>`TransactionTypeRepository`.findById<br>`BankMovementRepository`.findByReference<br>`CashControlRepository`.findMovementsByReference/getBalance [cash_movements] | UseGuards(JwtAuthGuard) | `BankDepositService.registerOperation` |
| `GET /api/bank-deposits/monthly-count` | [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L96) `BankDepositsController.monthlyCount` | [GetBankDepositMonthlyCountUseCase](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-monthly-count-use-case-ts) | `BankDepositRepository`.getReportSummary | UseGuards(JwtAuthGuard) | `BankDepositService.getMonthlyCount` |
| `GET /api/bank-deposits/summary` | [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L102) `BankDepositsController.transactionSummary` | [GetBankDepositTransactionSummaryUseCase](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-transaction-summary-use-case-ts) | `BankDepositRepository`.getReportSummary | UseGuards(JwtAuthGuard) | `BankDepositService.getTransactionSummary` |
| `GET /api/bank-deposits/daily-stats` | [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L108) `BankDepositsController.dailyStats` | [GetBankDepositDailyStatsUseCase](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-daily-stats-use-case-ts) | `BankDepositRepository`.getDailyTransactionCounts | UseGuards(JwtAuthGuard) | `BankDepositService.getDailyStats` |
| `GET /api/bank-deposits/weekly-stats` | [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L114) `BankDepositsController.weeklyStats` | [GetBankDepositWeeklyStatsUseCase](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-weekly-stats-use-case-ts) | `BankDepositRepository`.getDailyTransactionCounts | UseGuards(JwtAuthGuard) | `BankDepositService.getWeeklyStats` |
| `GET /api/bank-deposits/yearly-stats` | [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L120) `BankDepositsController.yearlyStats` | [GetBankDepositYearlyStatsUseCase](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-yearly-stats-use-case-ts) | `BankDepositRepository`.getMonthlyTransactionCounts | UseGuards(JwtAuthGuard) | `BankDepositService.getYearlyStats` |
| `GET /api/bank-deposits/recent` | [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L126) `BankDepositsController.recent` | [ListRecentBankDepositOperationsUseCase](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-ts) | `BankDepositRepository`.findRecent | UseGuards(JwtAuthGuard) | `BankDepositService.getRecentOperations` |
| `GET /api/bank-deposits/:id` | [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L131) `BankDepositsController.findOne` | [GetBankDepositOperationByIdUseCase](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-operation-by-id-use-case-ts) | `BankDepositRepository`.findById | UseGuards(JwtAuthGuard) | `BankDepositService.getOperationById` |
| `POST /api/bank-deposits/:id/void` | [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L139) `BankDepositsController.voidOperation` | [VoidBankDepositOperationUseCase](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-ts) | `BankDepositRepository`.findById/voidOperation → `void_bank_deposit_operation` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `BankDepositService.voidOperation` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [bank-deposit-output.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-dtos-bank-deposit-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toBankDepositOperationOutput`, `toBankDepositOperationSummaryOutput`, `BankDepositCashDetailOutput`, `BankDepositTransactionOutput`, `BankDepositOperationOutput` (sin comentario de documentación en el código). | 1 internas | 5 | Media (5 consumidores) |
| [get-bank-deposit-daily-stats.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-daily-stats-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria (sin comentario de documentación en el código). | 2 internas | 0 | Soporte (pruebas) |
| [get-bank-deposit-daily-stats.use-case.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-daily-stats-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the "Transacciones del mes" line chart on both Resumen and Reporte de Transacciones — deliberately the one and only place this aggregation is computed, so both charts are structurally guaranteed to agree (see this module's other summary use cases — `GetBankDepositMonthlyCountUseCase`/ `GetBank | 1 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-bank-deposit-monthly-count.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-monthly-count-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria (sin comentario de documentación en el código). | 2 internas | 0 | Soporte (pruebas) |
| [get-bank-deposit-monthly-count.use-case.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-monthly-count-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the "Bancos" tile on the Resumen dashboard — "Total de Transacciones" for the current calendar month, resetting automatically the moment the server's own clock rolls into a new month (no stored counter, no reset job: `startDate` is simply recomputed as "the 1st of whatever month it is right now" on every call). | 1 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-bank-deposit-operation-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-operation-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetBankDepositOperationByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-bank-deposit-transaction-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-transaction-summary-use-case-ts) | .ts | Caso de uso | Aplicación | Backs "Resumen Diario"/"Resumen del Mes en Curso" on Transaccionar, and the "Resumen Diario de Transacciones" section on the Resumen dashboard — both read this exact same endpoint/use case, per the ticket's own "no quiero dos lógicas diferentes calculando lo mismo" requirement. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-bank-deposit-weekly-stats.use-case.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-weekly-stats-use-case-ts) | .ts | Caso de uso | Aplicación | "Transacciones por semana" — buckets the current month's days into fixed 7-day windows starting at day 1 (día 1-7 = Semana 1, 8-14 = Semana 2, ...), deliberately never ISO/calendar weeks — a calendar week can start mid-month and spill into the next one, which would mix days from two different months into one bucket. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-bank-deposit-yearly-stats.use-case.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-yearly-stats-use-case-ts) | .ts | Caso de uso | Aplicación | "Transacciones por mes" — enero hasta el mes actual del año en curso, acumulativo, nunca se reinicia dentro del año (a diferencia de las gráficas diaria/semanal, ver `GetBankDepositDailyStatsUseCase`/ `GetBankDepositWeeklyStatsUseCase`). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-bank-deposit-operations.use-case.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-bank-deposit-operations-use-case-ts) | .ts | Caso de uso | Aplicación | Never restricted by ownership — a shared operational record, same access policy as Bancos/Recargas (see the module's plan). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-recent-bank-deposit-operations.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `buildOperation` (sin comentario de documentación en el código). | 3 internas | 0 | Soporte (pruebas) |
| [list-recent-bank-deposit-operations.use-case.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-ts) | .ts | Caso de uso | Aplicación | "Últimas transacciones" de Transaccionar: las 10 operaciones registradas más recientes (más reciente primero, `id` como desempate estable), limitadas en SQL. | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [register-bank-deposit-operation.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `buildDayOpening`, `buildOperation`, `buildClient`, `buildTransactionType` (sin comentario de documentación en el código). | 22 internas | 0 | Soporte (pruebas) |
| [register-bank-deposit-operation.use-case.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts) | .ts | Caso de uso | Aplicación | Registers one "Transaccionar" deposit. | 20 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [void-bank-deposit-operation.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `buildOperation` (sin comentario de documentación en el código). | 5 internas | 0 | Soporte (pruebas) |
| [void-bank-deposit-operation.use-case.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-ts) | .ts | Caso de uso | Aplicación | The correction path for a mistaken Transaccionar registration — never an edit, never a physical delete. | 5 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [today-iso-date.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-application-utils-today-iso-date-ts) | .ts | Utilidad | Aplicación | `yyyy-MM-dd` in local server time — small per-feature copy of the identical helper in `modules/banks`/`modules/recharges`, following this codebase's established "small per-feature copy over cross-feature coupling" convention for a helper this trivial. | 0 internas | 6 | Media (6 consumidores) |
| [bank-deposits.module.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `BankDepositsModule` (sin comentario de documentación en el código). | 24 internas; ext.: @nestjs/common, @nestjs/typeorm | 2 | Baja (2 consumidores) |
| [bank-deposit-cash-detail.entity.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-cash-detail-entity-ts) | .ts | Entidad de dominio | Dominio | One row of the physical cash breakdown (e.g. | 0 internas | 2 | Baja (2 consumidores) |
| [bank-deposit-operation.entity.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-operation-entity-ts) | .ts | Entidad de dominio | Dominio | A registered "Transaccionar" deposit — `totalCash`/`totalDistributed` are server-recalculated totals cached on the row by `register_bank_deposit_operation()`, always equal to `totalAmount` by construction (the function rolls back the whole operation otherwise, see the "cuadre" rule in the module's plan) — never trust a caller-supplied total for either. | 2 internas | 8 | Media (8 consumidores) |
| [bank-deposit-transaction.entity.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-transaction-entity-ts) | .ts | Entidad de dominio | Dominio | One of the N sub-transactions the total amount is split into for the physical deposit. | 0 internas | 2 | Baja (2 consumidores) |
| [bank-deposit-accounts-receivable.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-accounts-receivable-error-ts) | .ts | Errores de dominio | Dominio | `sendToAccountsReceivable: true` without a `clientId` — the checkbox only ever makes sense alongside a registered client, see `RegisterBankDepositOperationUseCase`. | 1 internas | 2 | Baja (2 consumidores) |
| [bank-deposit-assets.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-assets-error-ts) | .ts | Errores de dominio | Dominio | `sendToAssets: true` en un tipo que no es Retiro ni Desembolso Génesis — el servidor nunca confía en que el frontend solo muestre la casilla donde corresponde. | 1 internas | 2 | Baja (2 consumidores) |
| [bank-deposit-day-already-closed.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-day-already-closed-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `BankDepositDayAlreadyClosedError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [bank-deposit-day-not-opened.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-day-not-opened-error-ts) | .ts | Errores de dominio | Dominio | Transaccionar reuses Banks' own día-abierto/cerrado cycle (`DAY_OPENING_REPOSITORY`, exported by `BanksModule`) rather than a parallel one — see `RegisterBankDepositOperationUseCase`. | 1 internas | 2 | Baja (2 consumidores) |
| [bank-deposit-operation-already-voided.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-operation-already-voided-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `BankDepositOperationAlreadyVoidedError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [bank-deposit-operation-not-found.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-operation-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `BankDepositOperationNotFoundError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [cash-breakdown.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-cash-breakdown-error-ts) | .ts | Errores de dominio | Dominio | Desglose de efectivo activado pero sin ninguna denominación — no hay nada que cuadrar contra el monto. | 1 internas | 3 | Media (3 consumidores) |
| [cash-total-mismatch.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-cash-total-mismatch-error-ts) | .ts | Errores de dominio | Dominio | The heart of the "cuadre" rule: the physical cash breakdown must sum to exactly the total amount, or `register_bank_deposit_operation` rolls back the whole operation. | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-bank-account.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-account-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidBankAccountError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-bank-deposit-client.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-client-error-ts) | .ts | Errores de dominio | Dominio | The `clientId` sent for a deposit doesn't exist, or exists but is inactive — mirrors `ReferencedClientInactiveError`/`ReferencedClientNotFoundError` from the accounts-receivable module, kept module-local per this codebase's per-module error ownership convention. | 1 internas | 3 | Media (3 consumidores) |
| [invalid-bank-deposit-date-range.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-date-range-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidBankDepositDateRangeError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [invalid-bank-deposit-description.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-description-error-ts) | .ts | Errores de dominio | Dominio | "Descripción / Beneficiario" missing or longer than 250 characters (also translated from `BANK_DEPOSIT_DESCRIPTION_TOO_LONG`). | 1 internas | 4 | Media (4 consumidores) |
| [invalid-cash-quantity.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-cash-quantity-error-ts) | .ts | Errores de dominio | Dominio | A cash-denomination row had a negative quantity, or its denomination didn't match one of the fixed Q values the form allows. | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-change-given.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-change-given-error-ts) | .ts | Errores de dominio | Dominio | El vuelto debe ser &gt;= 0 y nunca mayor al efectivo recibido — la función SQL es la fuente de verdad, este error solo traduce su `RAISE EXCEPTION`. | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-deposit-amount.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-deposit-amount-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidDepositAmountError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-transaction-bank.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-transaction-bank-error-ts) | .ts | Errores de dominio | Dominio | The selected banco agente doesn't exist, or exists but is inactive — `register_bank_deposit_operation` rejects both the same way `confirm_purchase` rejects an invalid supplier. | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-transaction-type.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-transaction-type-error-ts) | .ts | Errores de dominio | Dominio | The selected tipo de transacción doesn't exist, or exists but is inactive — `register_bank_deposit_operation` rejects both the same way it rejects an invalid banco agente. | 1 internas | 1 | Baja (1 consumidores) |
| [transaction-total-mismatch.error.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-transaction-total-mismatch-error-ts) | .ts | Errores de dominio | Dominio | The N sub-transaction amounts the total is being split into must also sum to exactly the total amount. | 1 internas | 1 | Baja (1 consumidores) |
| [bank-deposit.repository.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `BankDepositCashDetailData`, `RegisterBankDepositOperationData`, `FindBankDepositOperationsOptions`, `PaginatedResult`, `BankDepositReportFilters` (sin comentario de documentación en el código). | 2 internas | 19 | Alta (19 consumidores) |
| [bank-deposit-cash-detail.orm-entity.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-cash-detail-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `BankDepositCashDetailOrmEntity` (sin comentario de documentación en el código). | 2 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [bank-deposit-operation.mapper.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `BankDepositOperationMapper` (sin comentario de documentación en el código). | 4 internas | 1 | Baja (1 consumidores) |
| [bank-deposit-operation.orm-entity.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `BankDepositOperationOrmEntity` (sin comentario de documentación en el código). | 7 internas; ext.: typeorm | 7 | Media (7 consumidores) |
| [bank-deposit-transaction.orm-entity.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-transaction-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `BankDepositTransactionOrmEntity` (sin comentario de documentación en el código). | 2 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [typeorm-bank-deposit.repository.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmBankDepositRepository` (sin comentario de documentación en el código). | 19 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [bank-deposits.controller.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts) | .ts | Controlador | Presentación | No class-level `@Roles(...)` — registering a Transaccionar deposit is an operational action for whoever runs the register, same policy as Sales/Purchases/Recargas. | 21 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [bank-deposit-daily-stats.response.dto.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-bank-deposit-daily-stats-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `BankDepositDailyStatDto`, `BankDepositDailyStatsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [bank-deposit-monthly-count.response.dto.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-bank-deposit-monthly-count-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `BankDepositMonthlyCountResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [bank-deposit-transaction-summary.response.dto.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-bank-deposit-transaction-summary-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `BankDepositSummaryByBankDto`, `BankDepositPeriodSummaryDto`, `BankDepositTransactionSummaryResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [bank-deposit-weekly-stats.response.dto.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-bank-deposit-weekly-stats-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `BankDepositWeeklyStatDto`, `BankDepositWeeklyStatsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [bank-deposit-yearly-stats.response.dto.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-bank-deposit-yearly-stats-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `BankDepositMonthlyStatDto`, `BankDepositYearlyStatsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [bank-deposit.response.dto.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-bank-deposit-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `BankDepositCashDetailResponseDto`, `BankDepositTransactionResponseDto`, `BankDepositOperationResponseDto`, `BankDepositOperationSummaryResponseDto`, `PaginatedBankDepositOperationsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [create-bank-deposit.request.dto.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-create-bank-deposit-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `BankDepositCashDetailRequestDto`, `CreateBankDepositRequestDto` (sin comentario de documentación en el código). | 2 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [void-bank-deposit-operation.request.dto.ts](#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-void-bank-deposit-operation-request-dto-ts) | .ts | DTO de entrada | Presentación | Mirrors Banks' own `DayActionReasonRequestDto` (reopen/cancel día) — same mandatory-reason shape, kept as this module's own copy rather than a cross-module import. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-dtos-bank-deposit-output-ts"></a>

### bank-deposit-output.ts

- **Ruta:** [bank-deposit-output.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/dtos/bank-deposit-output.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/dtos/bank-deposit-output.ts`, 175 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** DTO de salida (aplicación): declara `toBankDepositOperationOutput`, `toBankDepositOperationSummaryOutput`, `BankDepositCashDetailOutput`, `BankDepositTransactionOutput`, `BankDepositOperationOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-deposit-operation.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-operation-entity-ts)
- **Consumidores:** [get-bank-deposit-operation-by-id.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-operation-by-id-use-case-ts), [list-bank-deposit-operations.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-bank-deposit-operations-use-case-ts), [list-recent-bank-deposit-operations.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [void-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-ts)

**Interfaces, tipos y enums:**

- `interface BankDepositCashDetailOutput` (L3): sin documentación — miembros: `id`, `denomination`, `quantity`, `subtotal`
- `interface BankDepositTransactionOutput` (L10): sin documentación — miembros: `id`, `sequence`, `amount`
- `interface BankDepositOperationOutput` (L17): Full shape — used for `GET /bank-deposits/:id` and the response of `POST /bank-deposits`. — miembros: `id`, `transactionBankId`, `transactionBankName`, `bankAccountId`, `bankAccountName`, `bankAccountNumber`, `totalAmount`, `transactionCount`, `totalCash`, `totalDistributed`, `operationDate`, `changeGiven`, `netCashApplied`, `cashBreakdownEnabled`, `clientName`, `description`, `clientId`, `transactionTypeId`, `transactionTypeName`, `userId`, `username`, `cashDetails`, `transactions`, `createdAt`, `updatedAt`…
- `interface BankDepositCashMovementOutput` (L58): sin documentación — miembros: `movementType`, `direction`, `amount`, `previousBalance`, `newBalance`, `currentBalance`
- `interface BankDepositBalanceMovementOutput` (L67): sin documentación — miembros: `bankId`, `bankName`, `accountNumber`, `amount`, `balanceBefore`, `balanceAfter`
- `interface BankDepositOperationSummaryOutput` (L77): Lighter shape for `GET /bank-deposits`/reportería listings — no cash-detail/transaction rows. — miembros: `id`, `transactionBankId`, `transactionBankName`, `bankAccountId`, `bankAccountName`, `bankAccountNumber`, `totalAmount`, `transactionCount`, `operationDate`, `clientName`, `description`, `clientId`, `transactionTypeId`, `transactionTypeName`, `userId`, `username`, `createdAt`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
#### Función `toBankDepositOperationOutput` (L102–146)

- **Tipo:** función exportada
- **Firma:** `toBankDepositOperationOutput(operation: BankDepositOperation): BankDepositOperationOutput` — [bank-deposit-output.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/dtos/bank-deposit-output.ts#L102)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `operation.cashDetails.map`, `operation.transactions.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-bank-deposit-operation-by-id.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-operation-by-id-use-case-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [void-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-ts)

#### Función `toBankDepositOperationSummaryOutput` (L148–174)

- **Tipo:** función exportada
- **Firma:** `toBankDepositOperationSummaryOutput(operation: BankDepositOperation): BankDepositOperationSummaryOutput` — [bank-deposit-output.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/dtos/bank-deposit-output.ts#L148)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [list-bank-deposit-operations.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-bank-deposit-operations-use-case-ts), [list-recent-bank-deposit-operations.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-daily-stats-use-case-spec-ts"></a>

### get-bank-deposit-daily-stats.use-case.spec.ts

- **Ruta:** [get-bank-deposit-daily-stats.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-daily-stats.use-case.spec.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-daily-stats.use-case.spec.ts`, 50 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [get-bank-deposit-daily-stats.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-daily-stats-use-case-ts), [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-daily-stats-use-case-ts"></a>

### get-bank-deposit-daily-stats.use-case.ts

- **Ruta:** [get-bank-deposit-daily-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-daily-stats.use-case.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-daily-stats.use-case.ts`, 67 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Backs the "Transacciones del mes" line chart on both Resumen and Reporte de Transacciones — deliberately the one and only place this aggregation is computed, so both charts are structurally guaranteed to agree (see this module's other summary use cases — `GetBankDepositMonthlyCountUseCase`/ `GetBank
- **Depende de (archivos del proyecto):** [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [get-bank-deposit-daily-stats.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-daily-stats-use-case-spec-ts), [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

**Interfaces, tipos y enums:**

- `interface BankDepositDailyStatOutput` (L5): sin documentación — miembros: `date`, `transactionCount`
- `interface BankDepositDailyStatsOutput` (L11): sin documentación — miembros: `month`, `days`

#### Clase `GetBankDepositDailyStatsUseCase` (L35–66)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the "Transacciones del mes" line chart on both Resumen and Reporte de Transacciones — deliberately the one and only place this aggregation is computed, so both charts are structurally guaranteed to agree (see this module's other summary use cases — `GetBankDepositMonthlyCountUseCase`/ `GetBankDepositTransactionSummaryUseCase` — for the same "one endpoint, two screens" precedent already established here). Always the server's own current month (`America/Guatemala`, see `1759100000000-SetDatabaseTimezone`) — never a client-supplied date, same "no confiar en el navegador para la fecha de negocio" posture as every other date-driven use case in this module. `transactionCount` is `SUM(transaction_count)` (subtransacciones), not a count of operations — same distinction `GetBankDepositTransactionSummaryUseCase` already documents — and excludes anuladas (`getDailyTransactionCounts` itself fi
- **Dependencias inyectadas (constructor):** `@Inject(BANK_DEPOSIT_REPOSITORY) bankDepositRepository: BankDepositRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 42–65 | — | `Promise<BankDepositDailyStatsOutput>` |

##### `GetBankDepositDailyStatsUseCase.execute`

- **Firma:** `execute(): Promise<BankDepositDailyStatsOutput>` — [get-bank-deposit-daily-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-daily-stats.use-case.ts#L42) (L42–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `now.getMonth`, `new Date(year, month + 1, 0).getDate`, `String(month + 1).padStart`, `String`, `String(daysInMonth).padStart`, `this.bankDepositRepository.getDailyTransactionCounts`, `new Map`, `rows.map`, `String(day).padStart`, `days.push`, `countsByDate.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-monthly-count-use-case-spec-ts"></a>

### get-bank-deposit-monthly-count.use-case.spec.ts

- **Ruta:** [get-bank-deposit-monthly-count.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-monthly-count.use-case.spec.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-monthly-count.use-case.spec.ts`, 35 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [get-bank-deposit-monthly-count.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-monthly-count-use-case-ts), [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-monthly-count-use-case-ts"></a>

### get-bank-deposit-monthly-count.use-case.ts

- **Ruta:** [get-bank-deposit-monthly-count.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-monthly-count.use-case.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-monthly-count.use-case.ts`, 58 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Backs the "Bancos" tile on the Resumen dashboard — "Total de Transacciones" for the current calendar month, resetting automatically the moment the server's own clock rolls into a new month (no stored counter, no reset job: `startDate` is simply recomputed as "the 1st of whatever month it is right now" on every call).
- **Depende de (archivos del proyecto):** [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [get-bank-deposit-monthly-count.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-monthly-count-use-case-spec-ts), [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

**Interfaces, tipos y enums:**

- `interface BankDepositMonthlyCountOutput` (L5): sin documentación — miembros: `count`, `month`

#### Clase `GetBankDepositMonthlyCountUseCase` (L35–57)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the "Bancos" tile on the Resumen dashboard — "Total de Transacciones" for the current calendar month, resetting automatically the moment the server's own clock rolls into a new month (no stored counter, no reset job: `startDate` is simply recomputed as "the 1st of whatever month it is right now" on every call). Reuses `getReportSummary()`'s own `operationCount` — already excludes voided operations, same reasoning as "Reporte de Transacciones"' own summary tiles — rather than a second, duplicated count query. Deliberately NOT admin-gated (no `@Roles` on its controller route) — unlike `GetBankDepositsReportSummaryUseCase`, which powers a full management report. Resumen is the first page every authenticated account sees, `USER`-role included, so this only ever returns one number, never the filterable/by-bank breakdown a `USER` account shouldn't see.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_DEPOSIT_REPOSITORY) bankDepositRepository: BankDepositRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 42–56 | — | `Promise<BankDepositMonthlyCountOutput>` |

##### `GetBankDepositMonthlyCountUseCase.execute`

- **Firma:** `execute(): Promise<BankDepositMonthlyCountOutput>` — [get-bank-deposit-monthly-count.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-monthly-count.use-case.ts#L42) (L42–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `toIsoDate`, `now.getFullYear`, `now.getMonth`, `this.bankDepositRepository.getReportSummary`, `startDate.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

#### Función `toIsoDate` (L11–16)

- **Tipo:** función local del archivo
- **Firma:** `toIsoDate(date: Date): string` — [get-bank-deposit-monthly-count.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-monthly-count.use-case.ts#L11)
- **Propósito / descripción:** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique every other date-driven use case in this codebase already uses.
- **Dependencias:** `date.getFullYear`, `String(date.getMonth() + 1).padStart`, `String`, `date.getMonth`, `String(date.getDate()).padStart`, `date.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-operation-by-id-use-case-ts"></a>

### get-bank-deposit-operation-by-id.use-case.ts

- **Ruta:** [get-bank-deposit-operation-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-operation-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-operation-by-id.use-case.ts`, 25 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Caso de uso: declara `GetBankDepositOperationByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [bank-deposit-operation-not-found.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-operation-not-found-error-ts), [bank-deposit-output.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-dtos-bank-deposit-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

#### Clase `GetBankDepositOperationByIdUseCase` (L10–24)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_DEPOSIT_REPOSITORY) bankDepositRepository: BankDepositRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–23 | `id: string` | `Promise<BankDepositOperationOutput>` |

##### `GetBankDepositOperationByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<BankDepositOperationOutput>` — [get-bank-deposit-operation-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-operation-by-id.use-case.ts#L17) (L17–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankDepositRepository.findById`, `new BankDepositOperationNotFoundError`, `toBankDepositOperationOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BankDepositOperationNotFoundError(id)`
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-transaction-summary-use-case-ts"></a>

### get-bank-deposit-transaction-summary.use-case.ts

- **Ruta:** [get-bank-deposit-transaction-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-transaction-summary.use-case.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-transaction-summary.use-case.ts`, 94 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Backs "Resumen Diario"/"Resumen del Mes en Curso" on Transaccionar, and the "Resumen Diario de Transacciones" section on the Resumen dashboard — both read this exact same endpoint/use case, per the ticket's own "no quiero dos lógicas diferentes calculando lo mismo" requirement.
- **Depende de (archivos del proyecto):** [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [today-iso-date.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

**Interfaces, tipos y enums:**

- `interface BankDepositSummaryByBank` (L6): sin documentación — miembros: `transactionBankId`, `transactionBankName`, `transactions`
- `interface BankDepositPeriodSummary` (L12): sin documentación — miembros: `totalTransactions`, `byBank`
- `interface BankDepositTransactionSummaryOutput` (L17): sin documentación — miembros: `daily`, `monthly`

#### Clase `GetBankDepositTransactionSummaryUseCase` (L52–93)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs "Resumen Diario"/"Resumen del Mes en Curso" on Transaccionar, and the "Resumen Diario de Transacciones" section on the Resumen dashboard — both read this exact same endpoint/use case, per the ticket's own "no quiero dos lógicas diferentes calculando lo mismo" requirement. Reuses `getReportSummary()` (already powers Reportería and the "Bancos" monthly-count tile) rather than a new aggregate query — called twice, once for today only and once for the 1st of the current month through today. Both calls already exclude anuladas (`isVoided = false`, see that method's own doc comment) and use the server's own `todayIsoDate()` (no client-supplied date is ever accepted here), consistent with this module's existing "no client-supplied date for anything but genuine historical filters" posture. "Transacciones" here means `SUM(transaction_count)` — the same "cantidad de transacciones" field the 
- **Dependencias inyectadas (constructor):** `@Inject(BANK_DEPOSIT_REPOSITORY) bankDepositRepository: BankDepositRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 59–92 | — | `Promise<BankDepositTransactionSummaryOutput>` |

##### `GetBankDepositTransactionSummaryUseCase.execute`

- **Firma:** `execute(): Promise<BankDepositTransactionSummaryOutput>` — [get-bank-deposit-transaction-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-transaction-summary.use-case.ts#L59) (L59–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `todayIsoDate`, `firstDayOfMonthIsoDate`, `Promise.all`, `this.bankDepositRepository.getReportSummary`, `dailySummary.byBank.map`, `monthlySummary.byBank.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

#### Función `firstDayOfMonthIsoDate` (L23–27)

- **Tipo:** función local del archivo
- **Firma:** `firstDayOfMonthIsoDate(): string` — [get-bank-deposit-transaction-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-transaction-summary.use-case.ts#L23)
- **Propósito / descripción:** Local-time `yyyy-MM-dd` for the 1st of the current month — same technique `GetBankDepositMonthlyCountUseCase`/every other date-driven use case in this codebase already uses, never a UTC-offset dance.
- **Dependencias:** `new Date`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `now.getFullYear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-weekly-stats-use-case-ts"></a>

### get-bank-deposit-weekly-stats.use-case.ts

- **Ruta:** [get-bank-deposit-weekly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-weekly-stats.use-case.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-weekly-stats.use-case.ts`, 81 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** "Transacciones por semana" — buckets the current month's days into fixed 7-day windows starting at day 1 (día 1-7 = Semana 1, 8-14 = Semana 2, ...), deliberately never ISO/calendar weeks — a calendar week can start mid-month and spill into the next one, which would mix days from two different months into one bucket.
- **Depende de (archivos del proyecto):** [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

**Interfaces, tipos y enums:**

- `interface BankDepositWeeklyStatOutput` (L5): sin documentación — miembros: `weekNumber`, `label`, `startDate`, `endDate`, `transactionCount`
- `interface BankDepositWeeklyStatsOutput` (L16): sin documentación — miembros: `month`, `weeks`

#### Clase `GetBankDepositWeeklyStatsUseCase` (L41–80)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Transacciones por semana" — buckets the current month's days into fixed 7-day windows starting at day 1 (día 1-7 = Semana 1, 8-14 = Semana 2, ...), deliberately never ISO/calendar weeks — a calendar week can start mid-month and spill into the next one, which would mix days from two different months into one bucket. Fixed day-1-anchored windows make that structurally impossible. Reuses the exact same `getDailyTransactionCounts()` call `GetBankDepositDailyStatsUseCase` already makes — no new SQL grouping, the already-aggregated, already-zero-filled day-level data is simply re-bucketed here in memory. Always the server's own current month, same "no confiar en el navegador para la fecha de negocio" posture as every other date-driven use case in this module — resets automatically on the 1st of the next month, no code change needed.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_DEPOSIT_REPOSITORY) bankDepositRepository: BankDepositRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 48–79 | — | `Promise<BankDepositWeeklyStatsOutput>` |

##### `GetBankDepositWeeklyStatsUseCase.execute`

- **Firma:** `execute(): Promise<BankDepositWeeklyStatsOutput>` — [get-bank-deposit-weekly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-weekly-stats.use-case.ts#L48) (L48–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `now.getMonth`, `new Date(year, month + 1, 0).getDate`, `String(month + 1).padStart`, `String`, `String(daysInMonth).padStart`, `this.bankDepositRepository.getDailyTransactionCounts`, `new Map`, `rows.map`, `Math.min`, `String(day).padStart`, `countsByDate.get`, `weeks.push`, `String(startDay).padStart`, `String(endDay).padStart`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-yearly-stats-use-case-ts"></a>

### get-bank-deposit-yearly-stats.use-case.ts

- **Ruta:** [get-bank-deposit-yearly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-yearly-stats.use-case.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-yearly-stats.use-case.ts`, 79 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** "Transacciones por mes" — enero hasta el mes actual del año en curso, acumulativo, nunca se reinicia dentro del año (a diferencia de las gráficas diaria/semanal, ver `GetBankDepositDailyStatsUseCase`/ `GetBankDepositWeeklyStatsUseCase`).
- **Depende de (archivos del proyecto):** [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [today-iso-date.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

**Interfaces, tipos y enums:**

- `interface BankDepositMonthlyStatOutput` (L21): sin documentación — miembros: `month`, `label`, `transactionCount`
- `interface BankDepositYearlyStatsOutput` (L29): sin documentación — miembros: `year`, `months`

#### Clase `GetBankDepositYearlyStatsUseCase` (L48–78)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Transacciones por mes" — enero hasta el mes actual del año en curso, acumulativo, nunca se reinicia dentro del año (a diferencia de las gráficas diaria/semanal, ver `GetBankDepositDailyStatsUseCase`/ `GetBankDepositWeeklyStatsUseCase`). Un mes ya transcurrido permanece en la lista aunque haya tenido 0 transacciones — nunca se oculta. Una sola consulta agregada nueva (`BankDepositRepository.getMonthlyTransactionCounts`, `GROUP BY to_char(operation_date, 'YYYY-MM')`), mismo patrón exacto que `getDailyTransactionCounts` ya establece en este módulo — nunca una consulta por mes.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_DEPOSIT_REPOSITORY) bankDepositRepository: BankDepositRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 55–77 | — | `Promise<BankDepositYearlyStatsOutput>` |

##### `GetBankDepositYearlyStatsUseCase.execute`

- **Firma:** `execute(): Promise<BankDepositYearlyStatsOutput>` — [get-bank-deposit-yearly-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/get-bank-deposit-yearly-stats.use-case.ts#L55) (L55–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date`, `now.getFullYear`, `now.getMonth`, `todayIsoDate`, `this.bankDepositRepository.getMonthlyTransactionCounts`, `new Map`, `rows.map`, `String(m + 1).padStart`, `String`, `months.push`, `countsByMonth.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-bank-deposit-operations-use-case-ts"></a>

### list-bank-deposit-operations.use-case.ts

- **Ruta:** [list-bank-deposit-operations.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/list-bank-deposit-operations.use-case.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/list-bank-deposit-operations.use-case.ts`, 74 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Never restricted by ownership — a shared operational record, same access policy as Bancos/Recargas (see the module's plan).
- **Depende de (archivos del proyecto):** [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [bank-deposit-output.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-dtos-bank-deposit-output-ts), [invalid-bank-deposit-date-range.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-date-range-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [bank-deposits-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-deposits-report-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListBankDepositOperationsInput` (L10): sin documentación — miembros: `transactionBankId`, `transactionTypeId`, `userId`, `startDate`, `endDate`, `search`, `page`, `limit`
- `interface ListBankDepositOperationsOutput` (L22): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `ListBankDepositOperationsUseCase` (L34–73)

- **Decoradores:** `@Injectable()`
- **Propósito:** Never restricted by ownership — a shared operational record, same access policy as Bancos/Recargas (see the module's plan). Reused directly by `BankDepositsReportController` (Reportería), same as `GetRechargeHistoryUseCase` is reused by `RechargesReportController`.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_DEPOSIT_REPOSITORY) bankDepositRepository: BankDepositRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 41–72 | `input: ListBankDepositOperationsInput` | `Promise<ListBankDepositOperationsOutput>` |

##### `ListBankDepositOperationsUseCase.execute`

- **Firma:** `execute(input: ListBankDepositOperationsInput): Promise<ListBankDepositOperationsOutput>` — [list-bank-deposit-operations.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/list-bank-deposit-operations.use-case.ts#L41) (L41–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidBankDepositDateRangeError`, `Math.min`, `this.bankDepositRepository.findAll`, `input.search?.trim`, `result.items.map`, `toBankDepositOperationSummaryOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidBankDepositDateRangeError()`
- **Consumidores:** [bank-deposits-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-deposits-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-spec-ts"></a>

### list-recent-bank-deposit-operations.use-case.spec.ts

- **Ruta:** [list-recent-bank-deposit-operations.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/list-recent-bank-deposit-operations.use-case.spec.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/list-recent-bank-deposit-operations.use-case.spec.ts`, 94 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Prueba unitaria: declara `buildOperation` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [list-recent-bank-deposit-operations.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-ts), [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [bank-deposit-operation.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-operation-entity-ts)
- **Consumidores:** —
#### Función `buildOperation` (L8–43)

- **Tipo:** función local del archivo
- **Firma:** `buildOperation(id: string, overrides?: { isVoided?: boolean; transactionCount?: number }): BankDepositOperation` — [list-recent-bank-deposit-operations.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/list-recent-bank-deposit-operations.use-case.spec.ts#L8)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `BankDepositOperation.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-ts"></a>

### list-recent-bank-deposit-operations.use-case.ts

- **Ruta:** [list-recent-bank-deposit-operations.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/list-recent-bank-deposit-operations.use-case.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/list-recent-bank-deposit-operations.use-case.ts`, 36 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** "Últimas transacciones" de Transaccionar: las 10 operaciones registradas más recientes (más reciente primero, `id` como desempate estable), limitadas en SQL.
- **Depende de (archivos del proyecto):** [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [bank-deposit-output.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-dtos-bank-deposit-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [list-recent-bank-deposit-operations.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-spec-ts), [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

**Constantes exportadas:**

- `RECENT_BANK_DEPOSIT_OPERATIONS_LIMIT` (L10): Fijo — la tarjeta muestra exactamente las últimas 10; el cliente no puede pedir más. = `10`

#### Clase `ListRecentBankDepositOperationsUseCase` (L20–35)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Últimas transacciones" de Transaccionar: las 10 operaciones registradas más recientes (más reciente primero, `id` como desempate estable), limitadas en SQL. Una operación = una fila con su `totalAmount` y su `transactionCount` — nunca se multiplica por las transacciones distribuidas. Las anuladas se incluyen marcadas (`isVoided`), misma convención que el listado del reporte; los totales nunca las suman.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_DEPOSIT_REPOSITORY) bankDepositRepository: BankDepositRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 27–34 | — | `Promise<BankDepositOperationSummaryOutput[]>` |

##### `ListRecentBankDepositOperationsUseCase.execute`

- **Firma:** `execute(): Promise<BankDepositOperationSummaryOutput[]>` — [list-recent-bank-deposit-operations.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/list-recent-bank-deposit-operations.use-case.ts#L27) (L27–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankDepositRepository.findRecent`, `operations.map`, `toBankDepositOperationSummaryOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts"></a>

### register-bank-deposit-operation.use-case.spec.ts

- **Ruta:** [register-bank-deposit-operation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.spec.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.spec.ts`, 641 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Prueba unitaria: declara `buildDayOpening`, `buildOperation`, `buildClient`, `buildTransactionType` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [invalid-bank-deposit-description.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-description-error-ts), [bank-deposit-day-not-opened.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-day-not-opened-error-ts), [bank-deposit-day-already-closed.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-day-already-closed-error-ts), [invalid-bank-deposit-client.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-client-error-ts), [bank-deposit-accounts-receivable.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-accounts-receivable-error-ts), [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [day-opening.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-day-opening-entity-ts), [bank-deposit-operation.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-operation-entity-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [client.entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-entities-client-entity-ts), [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts), [register-account-receivable-charge.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-charge-use-case-ts) y 7 más
- **Consumidores:** —
#### Función `buildDayOpening` (L39–59)

- **Tipo:** función local del archivo
- **Firma:** `buildDayOpening(overrides: { closedAt: Date \| null }): DayOpening` — [register-bank-deposit-operation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.spec.ts#L39)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `DayOpening.create`, `todayIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildOperation` (L61–95)

- **Tipo:** función local del archivo
- **Firma:** `buildOperation(overrides?: { clientId?: string \| null; transactionTypeName?: string }): BankDepositOperation` — [register-bank-deposit-operation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.spec.ts#L61)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `BankDepositOperation.create`, `todayIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildClient` (L97–109)

- **Tipo:** función local del archivo
- **Firma:** `buildClient(overrides?: { isActive?: boolean }): Client` — [register-bank-deposit-operation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.spec.ts#L97)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Client.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildTransactionType` (L111–128)

- **Tipo:** función local del archivo
- **Firma:** `buildTransactionType(balanceEffect: TransactionTypeBalanceEffect \| null): TransactionType` — [register-bank-deposit-operation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.spec.ts#L111)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `TransactionType.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts"></a>

### register-bank-deposit-operation.use-case.ts

- **Ruta:** [register-bank-deposit-operation.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.ts`, 318 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Registers one "Transaccionar" deposit.
- **Depende de (archivos del proyecto):** [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [day-opening.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-day-opening-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [register-account-receivable-charge.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-charge-use-case-ts), [register-asset-charge.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-charge-use-case-ts), [transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-repositories-transaction-type-repository-ts), [transaction-type.entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-entities-transaction-type-entity-ts), [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [bank-deposit-operation.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-operation-entity-ts), [cash-control.repository.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-domain-repositories-cash-control-repository-ts), [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts), [bank-deposit-day-not-opened.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-day-not-opened-error-ts), [bank-deposit-day-already-closed.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-day-already-closed-error-ts), [invalid-bank-deposit-client.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-client-error-ts), [bank-deposit-accounts-receivable.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-accounts-receivable-error-ts) y 5 más
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts), [create-bank-deposit.request.dto.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-create-bank-deposit-request-dto-ts)

**Interfaces, tipos y enums:**

- `interface RegisterBankDepositOperationCashDetailInput` (L71): sin documentación — miembros: `denomination`, `quantity`
- `interface RegisterBankDepositOperationInput` (L76): sin documentación — miembros: `transactionBankId`, `bankAccountId`, `transactionTypeId`, `totalAmount`, `cashDetails`, `transactionAmounts`, `userId`, `clientName`, `description`, `clientId`, `sendToAccountsReceivable`, `sendToAssets`, `isAdmin`, `changeGiven`, `cashBreakdownEnabled`

#### Clase `RegisterBankDepositOperationUseCase` (L131–317)

- **Decoradores:** `@Injectable()`
- **Propósito:** Registers one "Transaccionar" deposit. Reuses Banks' own día-abierto/cerrado cycle (`DAY_OPENING_REPOSITORY`, exported by `BanksModule`) instead of a parallel one — the ticket explicitly asks to reuse the existing mechanism, and a closed day blocks this the same way it blocks Cuadre de Agentes. The actual cuadre validation (cash total / transactions total must both equal the total amount exactly) happens inside `register_bank_deposit_operation` itself — this use case never trusts or recomputes those totals, it only gates on the business-day cycle before delegating. Operation date is always "today" (server-local) — no backdating in v1. **"Enviar a cuentas por cobrar" (follow-up)**: when `sendToAccountsReceivable` is true, this use case also registers a Cuentas por Cobrar CARGO for the same client and amount, reusing `RegisterAccountReceivableChargeUseCase` exactly as-is (client exists+act
- **Dependencias inyectadas (constructor):** `@Inject(BANK_DEPOSIT_REPOSITORY) bankDepositRepository: BankDepositRepository`, `@Inject(DAY_OPENING_REPOSITORY) dayOpeningRepository: DayOpeningRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`, `@Inject(TRANSACTION_MANAGER) transactionManager: TransactionManager`, `registerAccountReceivableChargeUseCase: RegisterAccountReceivableChargeUseCase`, `registerAssetChargeUseCase: RegisterAssetChargeUseCase`, `@Inject(TRANSACTION_TYPE_REPOSITORY) transactionTypeRepository: TransactionTypeRepository`, `@Inject(BANK_MOVEMENT_REPOSITORY) bankMovementRepository: BankMovementRepository`, `@Inject(CASH_CONTROL_REPOSITORY) cashControlRepository: CashControlRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 152–277 | `input: RegisterBankDepositOperationInput` | `Promise<BankDepositOperationOutput>` |
| `withBalanceMovement` | método private async | 280–316 | `operation: BankDepositOperation` | `Promise<BankDepositOperationOutput>` |

##### `RegisterBankDepositOperationUseCase.execute`

- **Firma:** `execute(input: RegisterBankDepositOperationInput): Promise<BankDepositOperationOutput>` — [register-bank-deposit-operation.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.ts#L152) (L152–277)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `todayIsoDate`, `this.dayOpeningRepository.findByDate`, `new BankDepositDayNotOpenedError`, `new BankDepositDayAlreadyClosedError`, `normalizeBankDepositDescription`, `new InvalidBankDepositDescriptionError`, `new CashBreakdownRequiredError`, `new CashBreakdownNotExpectedError`, `this.clientRepository.findById`, `new InvalidBankDepositClientError`, `new BankDepositAssetsAndReceivableConflictError`, `new BankDepositAccountsReceivableRequiresClientError`, `new BankDepositAccountsReceivableForbiddenError`, `this.transactionTypeRepository.findById`, `ASSET_ELIGIBLE_BALANCE_EFFECTS.includes`, `new BankDepositAssetsWrongTypeError`, `this.bankDepositRepository.registerOperation`, `this.withBalanceMovement`…
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BankDepositDayNotOpenedError(operationDate)`, `new BankDepositDayAlreadyClosedError(operationDate)`, `new InvalidBankDepositDescriptionError('REQUIRED')`, `new InvalidBankDepositDescriptionError('TOO_LONG')`, `new CashBreakdownRequiredError()`, `new CashBreakdownNotExpectedError()`, `new InvalidBankDepositClientError()`, `new BankDepositAssetsAndReceivableConflictError()`, `new BankDepositAccountsReceivableRequiresClientError()`, `new BankDepositAccountsReceivableForbiddenError()`, `new BankDepositAssetsWrongTypeError()`
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

##### `RegisterBankDepositOperationUseCase.withBalanceMovement`

- **Firma:** `withBalanceMovement(operation: BankDepositOperation): Promise<BankDepositOperationOutput>` — [register-bank-deposit-operation.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.ts#L280) (L280–316)
- **Propósito / descripción:** Adjunta el saldo anterior → posterior que produjo la operación, leído del ledger (nunca recalculado aquí).
- **Dependencias (llamadas en su cuerpo):** `toBankDepositOperationOutput`, `Promise.all`, `this.bankMovementRepository.findByReference`, `this.cashControlRepository.findMovementsByReference`, `this.cashControlRepository.getBalance`, `cashMovements.find`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `normalizeBankDepositDescription` (L53–65)

- **Tipo:** función exportada
- **Firma:** `normalizeBankDepositDescription(value: string \| null \| undefined): string \| null` — [register-bank-deposit-operation.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.ts#L53)
- **Propósito / descripción:** Normalizes "Descripción / Beneficiario": control characters become spaces, runs of whitespace collapse to one, and the ends are trimmed. Returns `null` when nothing is left. Same rule the SQL function applies.
- **Dependencias:** `value // eslint-disable-next-line no-control-regex.replace`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-spec-ts"></a>

### void-bank-deposit-operation.use-case.spec.ts

- **Ruta:** [void-bank-deposit-operation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/void-bank-deposit-operation.use-case.spec.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/void-bank-deposit-operation.use-case.spec.ts`, 98 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Prueba unitaria: declara `buildOperation` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [void-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-ts), [bank-deposit-operation-not-found.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-operation-not-found-error-ts), [bank-deposit-operation-already-voided.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-operation-already-voided-error-ts), [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [bank-deposit-operation.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-operation-entity-ts)
- **Consumidores:** —
#### Función `buildOperation` (L7–41)

- **Tipo:** función local del archivo
- **Firma:** `buildOperation(overrides?: Partial<{ isVoided: boolean }>): BankDepositOperation` — [void-bank-deposit-operation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/void-bank-deposit-operation.use-case.spec.ts#L7)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `BankDepositOperation.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-ts"></a>

### void-bank-deposit-operation.use-case.ts

- **Ruta:** [void-bank-deposit-operation.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/void-bank-deposit-operation.use-case.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/void-bank-deposit-operation.use-case.ts`, 62 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** The correction path for a mistaken Transaccionar registration — never an edit, never a physical delete.
- **Depende de (archivos del proyecto):** [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [bank-deposit-operation-not-found.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-operation-not-found-error-ts), [bank-deposit-operation-already-voided.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-operation-already-voided-error-ts), [bank-deposit-output.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-dtos-bank-deposit-output-ts), [today-iso-date.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [void-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-spec-ts), [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

**Interfaces, tipos y enums:**

- `interface VoidBankDepositOperationInput` (L12): sin documentación — miembros: `id`, `voidedBy`, `reason`

#### Clase `VoidBankDepositOperationUseCase` (L32–61)

- **Decoradores:** `@Injectable()`
- **Propósito:** The correction path for a mistaken Transaccionar registration — never an edit, never a physical delete. Marks the operation `isVoided`; the row, its cash details, and its transactions are all left exactly as registered, forever, for audit purposes. `totalAmount`/`totalCash`/`totalDistributed` are never touched — a voided operation's own numbers stay whatever was actually cuadrado at the moment it was (mistakenly) registered. Admin-only (enforced at the controller via `@Roles`), same policy as "Gestión de Días Cerrados"' reopen/cancel actions and Recargas' saldo-final re-edit — correcting an already-registered financial record is a management action, not an operational one, even though registering the original operation is open to any authenticated account.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_DEPOSIT_REPOSITORY) bankDepositRepository: BankDepositRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 39–60 | `input: VoidBankDepositOperationInput` | `Promise<BankDepositOperationOutput>` |

##### `VoidBankDepositOperationUseCase.execute`

- **Firma:** `execute(input: VoidBankDepositOperationInput): Promise<BankDepositOperationOutput>` — [void-bank-deposit-operation.use-case.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/void-bank-deposit-operation.use-case.ts#L39) (L39–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankDepositRepository.findById`, `new BankDepositOperationNotFoundError`, `new BankDepositOperationAlreadyVoidedError`, `this.bankDepositRepository.voidOperation`, `todayIsoDate`, `toBankDepositOperationOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BankDepositOperationNotFoundError(input.id)`, `new BankDepositOperationAlreadyVoidedError(input.id)`
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-application-utils-today-iso-date-ts"></a>

### today-iso-date.ts

- **Ruta:** [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/utils/today-iso-date.ts) (`comercial-jhoel-api/src/modules/bank-deposits/application/utils/today-iso-date.ts`, 13 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** `yyyy-MM-dd` in local server time — small per-feature copy of the identical helper in `modules/banks`/`modules/recharges`, following this codebase's established "small per-feature copy over cross-feature coupling" convention for a helper this trivial.
- **Descripción del autor (comentario del archivo):** `yyyy-MM-dd` in local server time — small per-feature copy of the identical helper in `modules/banks`/`modules/recharges`, following this codebase's established "small per-feature copy over cross-feature coupling" convention for a helper this trivial.
- **Consumidores:** [get-bank-deposit-transaction-summary.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-transaction-summary-use-case-ts), [get-bank-deposit-yearly-stats.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-yearly-stats-use-case-ts), [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [void-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-ts), [bank-deposit-description.e2e-spec.ts](e2e.md#f-comercial-jhoel-api-test-bank-deposit-description-e2e-spec-ts)
#### Función `todayIsoDate` (L7–12)

- **Tipo:** función exportada
- **Firma:** `todayIsoDate(): string` — [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/utils/today-iso-date.ts#L7)
- **Propósito / descripción:** `yyyy-MM-dd` in local server time — small per-feature copy of the identical helper in `modules/banks`/`modules/recharges`, following this codebase's established "small per-feature copy over cross-feature coupling" convention for a helper this trivial.
- **Dependencias:** `new Date`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`, `now.getFullYear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-bank-deposit-transaction-summary.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-transaction-summary-use-case-ts), [get-bank-deposit-yearly-stats.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-yearly-stats-use-case-ts), [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [void-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts"></a>

### bank-deposits.module.ts

- **Ruta:** [bank-deposits.module.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/bank-deposits.module.ts) (`comercial-jhoel-api/src/modules/bank-deposits/bank-deposits.module.ts`, 81 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Módulo: declara `BankDepositsModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [cash-control.module.ts](cash-control.md#f-comercial-jhoel-api-src-modules-cash-control-cash-control-module-ts), [bank-deposit-operation.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts), [bank-deposit-cash-detail.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-cash-detail-orm-entity-ts), [bank-deposit-transaction.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-transaction-orm-entity-ts), [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts), [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [list-bank-deposit-operations.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-bank-deposit-operations-use-case-ts), [get-bank-deposit-operation-by-id.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-operation-by-id-use-case-ts), [void-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-ts), [get-bank-deposit-monthly-count.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-monthly-count-use-case-ts), [get-bank-deposit-transaction-summary.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-transaction-summary-use-case-ts), [get-bank-deposit-daily-stats.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-daily-stats-use-case-ts), [get-bank-deposit-weekly-stats.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-weekly-stats-use-case-ts), [get-bank-deposit-yearly-stats.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-yearly-stats-use-case-ts) y 9 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `BankDepositsModule` (L28–80)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([ BankDepositOperationOrmEntity, BankDepositCashDetailOrmEntity, BankDepositTransactionOrmEntity, ]), // Validates `
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-cash-detail-entity-ts"></a>

### bank-deposit-cash-detail.entity.ts

- **Ruta:** [bank-deposit-cash-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-cash-detail.entity.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-cash-detail.entity.ts`, 32 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** One row of the physical cash breakdown (e.g.
- **Consumidores:** [bank-deposit-operation.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-operation-entity-ts), [bank-deposit-operation.mapper.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-mapper-ts)

**Interfaces, tipos y enums:**

- `interface BankDepositCashDetailProps` (L1): sin documentación — miembros: `id`, `denomination`, `quantity`, `subtotal`

#### Clase `BankDepositCashDetail` (L9–31)

- **Propósito:** One row of the physical cash breakdown (e.g. Q100 × 5 = Q500) — frozen once the operation is registered.
- **Dependencias inyectadas (constructor):** `props: BankDepositCashDetailProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 12–14 | `props: BankDepositCashDetailProps` | `BankDepositCashDetail` |
| `id` | getter public | 16–18 | — | `string` |
| `denomination` | getter public | 20–22 | — | `number` |
| `quantity` | getter public | 24–26 | — | `number` |
| `subtotal` | getter public | 28–30 | — | `number` |

##### `BankDepositCashDetail.create`

- **Firma:** `create(props: BankDepositCashDetailProps): BankDepositCashDetail` — [bank-deposit-cash-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-cash-detail.entity.ts#L12) (L12–14)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new BankDepositCashDetail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-deposit-operation.mapper.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-mapper-ts)

##### `BankDepositCashDetail.id`

- **Firma:** `id(): string` — [bank-deposit-cash-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-cash-detail.entity.ts#L16) (L16–18)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositCashDetail.denomination`

- **Firma:** `denomination(): number` — [bank-deposit-cash-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-cash-detail.entity.ts#L20) (L20–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositCashDetail.quantity`

- **Firma:** `quantity(): number` — [bank-deposit-cash-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-cash-detail.entity.ts#L24) (L24–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositCashDetail.subtotal`

- **Firma:** `subtotal(): number` — [bank-deposit-cash-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-cash-detail.entity.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-operation-entity-ts"></a>

### bank-deposit-operation.entity.ts

- **Ruta:** [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts`, 178 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** A registered "Transaccionar" deposit — `totalCash`/`totalDistributed` are server-recalculated totals cached on the row by `register_bank_deposit_operation()`, always equal to `totalAmount` by construction (the function rolls back the whole operation otherwise, see the "cuadre" rule in the module's plan) — never trust a caller-supplied total for either.
- **Depende de (archivos del proyecto):** [bank-deposit-cash-detail.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-cash-detail-entity-ts), [bank-deposit-transaction.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-transaction-entity-ts)
- **Consumidores:** [bank-deposit-output.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-dtos-bank-deposit-output-ts), [list-recent-bank-deposit-operations.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-spec-ts), [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [void-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-spec-ts), [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [bank-deposit-operation.mapper.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-mapper-ts), [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

**Interfaces, tipos y enums:**

- `interface BankDepositOperationProps` (L4): sin documentación — miembros: `id`, `transactionBankId`, `transactionBankName`, `bankAccountId`, `bankAccountName`, `bankAccountNumber`, `totalAmount`, `transactionCount`, `totalCash`, `totalDistributed`, `operationDate`, `changeGiven`, `cashBreakdownEnabled`, `clientName`, `description`, `clientId`, `transactionTypeId`, `transactionTypeName`, `userId`, `username`, `cashDetails`, `transactions`, `createdAt`, `updatedAt`, `isVoided`…

#### Clase `BankDepositOperation` (L49–177)

- **Propósito:** A registered "Transaccionar" deposit — `totalCash`/`totalDistributed` are server-recalculated totals cached on the row by `register_bank_deposit_operation()`, always equal to `totalAmount` by construction (the function rolls back the whole operation otherwise, see the "cuadre" rule in the module's plan) — never trust a caller-supplied total for either.
- **Dependencias inyectadas (constructor):** `props: BankDepositOperationProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 52–54 | `props: BankDepositOperationProps` | `BankDepositOperation` |
| `id` | getter public | 56–58 | — | `string` |
| `bankAccountId` | getter public | 60–62 | — | `string \| null` |
| `bankAccountName` | getter public | 64–66 | — | `string \| null` |
| `bankAccountNumber` | getter public | 68–70 | — | `string \| null` |
| `transactionBankId` | getter public | 72–74 | — | `string \| null` |
| `transactionBankName` | getter public | 76–78 | — | `string` |
| `totalAmount` | getter public | 80–82 | — | `number` |
| `transactionCount` | getter public | 84–86 | — | `number` |
| `totalCash` | getter public | 88–90 | — | `number` |
| `totalDistributed` | getter public | 92–94 | — | `number` |
| `operationDate` | getter public | 96–98 | — | `string` |
| `changeGiven` | getter public | 100–102 | — | `number` |
| `cashBreakdownEnabled` | getter public | 104–106 | — | `boolean` |
| `netCashApplied` | getter public | 109–111 | — | `number` |
| `clientName` | getter public | 113–115 | — | `string \| null` |
| `description` | getter public | 118–120 | — | `string \| null` |
| `clientId` | getter public | 122–124 | — | `string \| null` |
| `transactionTypeId` | getter public | 126–128 | — | `string` |
| `transactionTypeName` | getter public | 130–132 | — | `string` |
| `userId` | getter public | 134–136 | — | `string` |
| `username` | getter public | 138–140 | — | `string` |
| `cashDetails` | getter public | 142–144 | — | `BankDepositCashDetail[]` |
| `transactions` | getter public | 146–148 | — | `BankDepositTransaction[]` |
| `createdAt` | getter public | 150–152 | — | `Date` |
| `updatedAt` | getter public | 154–156 | — | `Date` |
| `isVoided` | getter public | 158–160 | — | `boolean` |
| `voidedAt` | getter public | 162–164 | — | `Date \| null` |
| `voidedBy` | getter public | 166–168 | — | `string \| null` |
| `voidedByUsername` | getter public | 170–172 | — | `string \| null` |
| `voidReason` | getter public | 174–176 | — | `string \| null` |

##### `BankDepositOperation.create`

- **Firma:** `create(props: BankDepositOperationProps): BankDepositOperation` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new BankDepositOperation`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [list-recent-bank-deposit-operations.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-spec-ts), [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [void-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-spec-ts), [bank-deposit-operation.mapper.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-mapper-ts)

##### `BankDepositOperation.id`

- **Firma:** `id(): string` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.bankAccountId`

- **Firma:** `bankAccountId(): string \| null` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.bankAccountName`

- **Firma:** `bankAccountName(): string \| null` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.bankAccountNumber`

- **Firma:** `bankAccountNumber(): string \| null` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L68) (L68–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.transactionBankId`

- **Firma:** `transactionBankId(): string \| null` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L72) (L72–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.transactionBankName`

- **Firma:** `transactionBankName(): string` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L76) (L76–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.totalAmount`

- **Firma:** `totalAmount(): number` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.transactionCount`

- **Firma:** `transactionCount(): number` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L84) (L84–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.totalCash`

- **Firma:** `totalCash(): number` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L88) (L88–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.totalDistributed`

- **Firma:** `totalDistributed(): number` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L92) (L92–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.operationDate`

- **Firma:** `operationDate(): string` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L96) (L96–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.changeGiven`

- **Firma:** `changeGiven(): number` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L100) (L100–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.cashBreakdownEnabled`

- **Firma:** `cashBreakdownEnabled(): boolean` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L104) (L104–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.netCashApplied`

- **Firma:** `netCashApplied(): number` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L109) (L109–111)
- **Propósito / descripción:** The net cash actually applied to the deposit — always equal to `totalAmount` for a saved operation, per `register_bank_deposit_operation`'s own cuadre check. Derived, never stored twice.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.clientName`

- **Firma:** `clientName(): string \| null` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L113) (L113–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.description`

- **Firma:** `description(): string \| null` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L118) (L118–120)
- **Propósito / descripción:** "Descripción / Beneficiario" exactly as stored; `null` for historical operations.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.clientId`

- **Firma:** `clientId(): string \| null` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L122) (L122–124)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.transactionTypeId`

- **Firma:** `transactionTypeId(): string` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L126) (L126–128)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.transactionTypeName`

- **Firma:** `transactionTypeName(): string` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L130) (L130–132)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.userId`

- **Firma:** `userId(): string` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L134) (L134–136)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.username`

- **Firma:** `username(): string` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L138) (L138–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.cashDetails`

- **Firma:** `cashDetails(): BankDepositCashDetail[]` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L142) (L142–144)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.transactions`

- **Firma:** `transactions(): BankDepositTransaction[]` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L146) (L146–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.createdAt`

- **Firma:** `createdAt(): Date` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L150) (L150–152)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.updatedAt`

- **Firma:** `updatedAt(): Date` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L154) (L154–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.isVoided`

- **Firma:** `isVoided(): boolean` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L158) (L158–160)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.voidedAt`

- **Firma:** `voidedAt(): Date \| null` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L162) (L162–164)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.voidedBy`

- **Firma:** `voidedBy(): string \| null` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L166) (L166–168)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.voidedByUsername`

- **Firma:** `voidedByUsername(): string \| null` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L170) (L170–172)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositOperation.voidReason`

- **Firma:** `voidReason(): string \| null` — [bank-deposit-operation.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-operation.entity.ts#L174) (L174–176)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-transaction-entity-ts"></a>

### bank-deposit-transaction.entity.ts

- **Ruta:** [bank-deposit-transaction.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-transaction.entity.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-transaction.entity.ts`, 27 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** One of the N sub-transactions the total amount is split into for the physical deposit.
- **Consumidores:** [bank-deposit-operation.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-operation-entity-ts), [bank-deposit-operation.mapper.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-mapper-ts)

**Interfaces, tipos y enums:**

- `interface BankDepositTransactionProps` (L1): sin documentación — miembros: `id`, `sequence`, `amount`

#### Clase `BankDepositTransaction` (L8–26)

- **Propósito:** One of the N sub-transactions the total amount is split into for the physical deposit.
- **Dependencias inyectadas (constructor):** `props: BankDepositTransactionProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 11–13 | `props: BankDepositTransactionProps` | `BankDepositTransaction` |
| `id` | getter public | 15–17 | — | `string` |
| `sequence` | getter public | 19–21 | — | `number` |
| `amount` | getter public | 23–25 | — | `number` |

##### `BankDepositTransaction.create`

- **Firma:** `create(props: BankDepositTransactionProps): BankDepositTransaction` — [bank-deposit-transaction.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-transaction.entity.ts#L11) (L11–13)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new BankDepositTransaction`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-deposit-operation.mapper.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-mapper-ts)

##### `BankDepositTransaction.id`

- **Firma:** `id(): string` — [bank-deposit-transaction.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-transaction.entity.ts#L15) (L15–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositTransaction.sequence`

- **Firma:** `sequence(): number` — [bank-deposit-transaction.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-transaction.entity.ts#L19) (L19–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositTransaction.amount`

- **Firma:** `amount(): number` — [bank-deposit-transaction.entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/entities/bank-deposit-transaction.entity.ts#L23) (L23–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-accounts-receivable-error-ts"></a>

### bank-deposit-accounts-receivable.error.ts

- **Ruta:** [bank-deposit-accounts-receivable.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/bank-deposit-accounts-receivable.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/bank-deposit-accounts-receivable.error.ts`, 24 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** `sendToAccountsReceivable: true` without a `clientId` — the checkbox only ever makes sense alongside a registered client, see `RegisterBankDepositOperationUseCase`.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts)

#### Clase `BankDepositAccountsReceivableRequiresClientError` (L4–12)

- **Herencia / contratos:** extends DomainError
- **Propósito:** `sendToAccountsReceivable: true` without a `clientId` — the checkbox only ever makes sense alongside a registered client, see `RegisterBankDepositOperationUseCase`.

#### Clase `BankDepositAccountsReceivableForbiddenError` (L15–23)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Registering a Cuentas por Cobrar CARGO is admin-only everywhere else in this app (`POST /accounts-receivable/:clientId/charges`) — sending a deposit to CxC through Transaccionar must respect that same rule, or a non-admin cashier could bypass it entirely.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-assets-error-ts"></a>

### bank-deposit-assets.error.ts

- **Ruta:** [bank-deposit-assets.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/bank-deposit-assets.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/bank-deposit-assets.error.ts`, 20 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** `sendToAssets: true` en un tipo que no es Retiro ni Desembolso Génesis — el servidor nunca confía en que el frontend solo muestre la casilla donde corresponde.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts)

#### Clase `BankDepositAssetsWrongTypeError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** `sendToAssets: true` en un tipo que no es Retiro ni Desembolso Génesis — el servidor nunca confía en que el frontend solo muestre la casilla donde corresponde.

#### Clase `BankDepositAssetsAndReceivableConflictError` (L13–19)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Una misma operación no puede generar cargo en Cuentas por Cobrar y en Activos a la vez.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-day-already-closed-error-ts"></a>

### bank-deposit-day-already-closed.error.ts

- **Ruta:** [bank-deposit-day-already-closed.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/bank-deposit-day-already-closed.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/bank-deposit-day-already-closed.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Errores de dominio: declara `BankDepositDayAlreadyClosedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts)

#### Clase `BankDepositDayAlreadyClosedError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-day-not-opened-error-ts"></a>

### bank-deposit-day-not-opened.error.ts

- **Ruta:** [bank-deposit-day-not-opened.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/bank-deposit-day-not-opened.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/bank-deposit-day-not-opened.error.ts`, 18 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Transaccionar reuses Banks' own día-abierto/cerrado cycle (`DAY_OPENING_REPOSITORY`, exported by `BanksModule`) rather than a parallel one — see `RegisterBankDepositOperationUseCase`.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts)

#### Clase `BankDepositDayNotOpenedError` (L11–17)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Transaccionar reuses Banks' own día-abierto/cerrado cycle (`DAY_OPENING_REPOSITORY`, exported by `BanksModule`) rather than a parallel one — see `RegisterBankDepositOperationUseCase`. This is a module-scoped error class of its own (not a reuse of Banks' `DayNotOpenedError`), consistent with how every other module in this codebase owns its own error classes even when the underlying condition is conceptually shared (e.g. `SaleProductNotFoundError` vs `PurchaseProductNotFoundError`). Never thrown for a past date — only today requires an opening.
- **Dependencias inyectadas (constructor):** `date: string`
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-operation-already-voided-error-ts"></a>

### bank-deposit-operation-already-voided.error.ts

- **Ruta:** [bank-deposit-operation-already-voided.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/bank-deposit-operation-already-voided.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/bank-deposit-operation-already-voided.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Errores de dominio: declara `BankDepositOperationAlreadyVoidedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-spec-ts), [void-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-ts), [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

#### Clase `BankDepositOperationAlreadyVoidedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-operation-not-found-error-ts"></a>

### bank-deposit-operation-not-found.error.ts

- **Ruta:** [bank-deposit-operation-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/bank-deposit-operation-not-found.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/bank-deposit-operation-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Errores de dominio: declara `BankDepositOperationNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-bank-deposit-operation-by-id.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-operation-by-id-use-case-ts), [void-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-spec-ts), [void-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-ts), [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

#### Clase `BankDepositOperationNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-cash-breakdown-error-ts"></a>

### cash-breakdown.error.ts

- **Ruta:** [cash-breakdown.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/cash-breakdown.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/cash-breakdown.error.ts`, 24 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Desglose de efectivo activado pero sin ninguna denominación — no hay nada que cuadrar contra el monto.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

#### Clase `CashBreakdownRequiredError` (L4–12)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Desglose de efectivo activado pero sin ninguna denominación — no hay nada que cuadrar contra el monto.

#### Clase `CashBreakdownNotExpectedError` (L15–23)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Desglose desactivado pero llegaron denominaciones o vuelto — el servidor nunca registra un desglose que el usuario no habilitó.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-cash-total-mismatch-error-ts"></a>

### cash-total-mismatch.error.ts

- **Ruta:** [cash-total-mismatch.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/cash-total-mismatch.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/cash-total-mismatch.error.ts`, 13 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** The heart of the "cuadre" rule: the physical cash breakdown must sum to exactly the total amount, or `register_bank_deposit_operation` rolls back the whole operation.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

#### Clase `CashTotalMismatchError` (L4–12)

- **Herencia / contratos:** extends DomainError
- **Propósito:** The heart of the "cuadre" rule: the physical cash breakdown must sum to exactly the total amount, or `register_bank_deposit_operation` rolls back the whole operation.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-account-error-ts"></a>

### invalid-bank-account.error.ts

- **Ruta:** [invalid-bank-account.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-bank-account.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-bank-account.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Errores de dominio: declara `InvalidBankAccountError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

#### Clase `InvalidBankAccountError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-client-error-ts"></a>

### invalid-bank-deposit-client.error.ts

- **Ruta:** [invalid-bank-deposit-client.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-bank-deposit-client.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-bank-deposit-client.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** The `clientId` sent for a deposit doesn't exist, or exists but is inactive — mirrors `ReferencedClientInactiveError`/`ReferencedClientNotFoundError` from the accounts-receivable module, kept module-local per this codebase's per-module error ownership convention.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

#### Clase `InvalidBankDepositClientError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** The `clientId` sent for a deposit doesn't exist, or exists but is inactive — mirrors `ReferencedClientInactiveError`/`ReferencedClientNotFoundError` from the accounts-receivable module, kept module-local per this codebase's per-module error ownership convention. Enforced both here (TypeScript pre-check) and inside `register_bank_deposit_operation` itself (`BANK_DEPOSIT_CLIENT_INVALID`), so a manipulated request can never slip a bogus client id past the pre-check.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-date-range-error-ts"></a>

### invalid-bank-deposit-date-range.error.ts

- **Ruta:** [invalid-bank-deposit-date-range.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-bank-deposit-date-range.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-bank-deposit-date-range.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Errores de dominio: declara `InvalidBankDepositDateRangeError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [list-bank-deposit-operations.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-bank-deposit-operations-use-case-ts), [export-bank-deposits-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-deposits-report-pdf-use-case-ts), [get-bank-deposits-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-deposits-report-summary-use-case-ts)

#### Clase `InvalidBankDepositDateRangeError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-description-error-ts"></a>

### invalid-bank-deposit-description.error.ts

- **Ruta:** [invalid-bank-deposit-description.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-bank-deposit-description.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-bank-deposit-description.error.ts`, 18 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** "Descripción / Beneficiario" missing or longer than 250 characters (also translated from `BANK_DEPOSIT_DESCRIPTION_TOO_LONG`).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts), [create-bank-deposit.request.dto.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-create-bank-deposit-request-dto-ts)

**Constantes exportadas:**

- `BANK_DEPOSIT_DESCRIPTION_MAX_LENGTH` (L4): Max length of "Descripción / Beneficiario" — the same limit as the column and the SQL check. = `250`

#### Clase `InvalidBankDepositDescriptionError` (L7–17)

- **Herencia / contratos:** extends DomainError
- **Propósito:** "Descripción / Beneficiario" missing or longer than 250 characters (also translated from `BANK_DEPOSIT_DESCRIPTION_TOO_LONG`).
- **Dependencias inyectadas (constructor):** `reason: 'REQUIRED' \| 'TOO_LONG'`
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-cash-quantity-error-ts"></a>

### invalid-cash-quantity.error.ts

- **Ruta:** [invalid-cash-quantity.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-cash-quantity.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-cash-quantity.error.ts`, 13 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** A cash-denomination row had a negative quantity, or its denomination didn't match one of the fixed Q values the form allows.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

#### Clase `InvalidCashQuantityError` (L4–12)

- **Herencia / contratos:** extends DomainError
- **Propósito:** A cash-denomination row had a negative quantity, or its denomination didn't match one of the fixed Q values the form allows.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-change-given-error-ts"></a>

### invalid-change-given.error.ts

- **Ruta:** [invalid-change-given.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-change-given.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-change-given.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** El vuelto debe ser &gt;= 0 y nunca mayor al efectivo recibido — la función SQL es la fuente de verdad, este error solo traduce su `RAISE EXCEPTION`.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

#### Clase `InvalidChangeGivenError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** El vuelto debe ser &gt;= 0 y nunca mayor al efectivo recibido — la función SQL es la fuente de verdad, este error solo traduce su `RAISE EXCEPTION`.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-deposit-amount-error-ts"></a>

### invalid-deposit-amount.error.ts

- **Ruta:** [invalid-deposit-amount.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-deposit-amount.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-deposit-amount.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Errores de dominio: declara `InvalidDepositAmountError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

#### Clase `InvalidDepositAmountError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-transaction-bank-error-ts"></a>

### invalid-transaction-bank.error.ts

- **Ruta:** [invalid-transaction-bank.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-transaction-bank.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-transaction-bank.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** The selected banco agente doesn't exist, or exists but is inactive — `register_bank_deposit_operation` rejects both the same way `confirm_purchase` rejects an invalid supplier.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

#### Clase `InvalidTransactionBankError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** The selected banco agente doesn't exist, or exists but is inactive — `register_bank_deposit_operation` rejects both the same way `confirm_purchase` rejects an invalid supplier.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-transaction-type-error-ts"></a>

### invalid-transaction-type.error.ts

- **Ruta:** [invalid-transaction-type.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-transaction-type.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/invalid-transaction-type.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** The selected tipo de transacción doesn't exist, or exists but is inactive — `register_bank_deposit_operation` rejects both the same way it rejects an invalid banco agente.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

#### Clase `InvalidTransactionTypeError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** The selected tipo de transacción doesn't exist, or exists but is inactive — `register_bank_deposit_operation` rejects both the same way it rejects an invalid banco agente.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-transaction-total-mismatch-error-ts"></a>

### transaction-total-mismatch.error.ts

- **Ruta:** [transaction-total-mismatch.error.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/errors/transaction-total-mismatch.error.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/errors/transaction-total-mismatch.error.ts`, 13 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** The N sub-transaction amounts the total is being split into must also sum to exactly the total amount.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

#### Clase `TransactionTotalMismatchError` (L4–12)

- **Herencia / contratos:** extends DomainError
- **Propósito:** The N sub-transaction amounts the total is being split into must also sum to exactly the total amount.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts"></a>

### bank-deposit.repository.ts

- **Ruta:** [bank-deposit.repository.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/repositories/bank-deposit.repository.ts) (`comercial-jhoel-api/src/modules/bank-deposits/domain/repositories/bank-deposit.repository.ts`, 130 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `BankDepositCashDetailData`, `RegisterBankDepositOperationData`, `FindBankDepositOperationsOptions`, `PaginatedResult`, `BankDepositReportFilters` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-deposit-operation.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-operation-entity-ts), [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts)
- **Consumidores:** [get-bank-deposit-daily-stats.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-daily-stats-use-case-spec-ts), [get-bank-deposit-daily-stats.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-daily-stats-use-case-ts), [get-bank-deposit-monthly-count.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-monthly-count-use-case-spec-ts), [get-bank-deposit-monthly-count.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-monthly-count-use-case-ts), [get-bank-deposit-operation-by-id.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-operation-by-id-use-case-ts), [get-bank-deposit-transaction-summary.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-transaction-summary-use-case-ts), [get-bank-deposit-weekly-stats.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-weekly-stats-use-case-ts), [get-bank-deposit-yearly-stats.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-yearly-stats-use-case-ts), [list-bank-deposit-operations.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-bank-deposit-operations-use-case-ts), [list-recent-bank-deposit-operations.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-spec-ts), [list-recent-bank-deposit-operations.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-ts), [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [void-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-spec-ts), [void-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-ts) y 4 más

**Interfaces, tipos y enums:**

- `interface BankDepositCashDetailData` (L6): sin documentación — miembros: `denomination`, `quantity`
- `interface RegisterBankDepositOperationData` (L11): sin documentación — miembros: `transactionBankId`, `bankAccountId`, `totalAmount`, `operationDate`, `cashDetails`, `transactionAmounts`, `userId`, `clientName`, `description`, `clientId`, `transactionTypeId`, `changeGiven`, `cashBreakdownEnabled`
- `interface FindBankDepositOperationsOptions` (L34): sin documentación — miembros: `transactionBankId`, `transactionTypeId`, `userId`, `startDate`, `endDate`, `search`, `page`, `limit`
- `interface PaginatedResult` (L46): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface BankDepositReportFilters` (L53): sin documentación — miembros: `startDate`, `endDate`, `transactionBankId`, `transactionTypeId`, `userId`, `search`
- `interface BankDepositReportByBank` (L63): sin documentación — miembros: `transactionBankId`, `transactionBankName`, `operationCount`, `transactionCount`, `totalAmount`
- `interface BankDepositReportSummary` (L73): sin documentación — miembros: `operationCount`, `transactionCount`, `totalAmount`, `byBank`
- `interface BankDepositDailyTransactionCount` (L80): sin documentación — miembros: `date`, `transactionCount`
- `interface BankDepositMonthlyTransactionCount` (L86): sin documentación — miembros: `month`, `transactionCount`
- `interface BankDepositRepository` (L92): sin documentación — miembros: `registerOperation`, `findAll`, `findById`, `findRecent`, `getReportSummary`, `getDailyTransactionCounts`, `getMonthlyTransactionCounts`, `voidOperation`

**Constantes exportadas:**

- `BANK_DEPOSIT_REPOSITORY` (L4) = `Symbol('BANK_DEPOSIT_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-cash-detail-orm-entity-ts"></a>

### bank-deposit-cash-detail.orm-entity.ts

- **Ruta:** [bank-deposit-cash-detail.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/bank-deposit-cash-detail.orm-entity.ts) (`comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/bank-deposit-cash-detail.orm-entity.ts`, 46 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `BankDepositCashDetailOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [bank-deposit-operation.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [bank-deposit-operation.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts)

#### Clase `BankDepositCashDetailOrmEntity` (L11–45)

- **Decoradores:** `@Entity('bank_deposit_cash_details')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column operationId: string`, `@ManyToOne operation: BankDepositOperationOrmEntity`, `@Column denomination: number`, `@Column quantity: number`, `@Column subtotal: number`
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-mapper-ts"></a>

### bank-deposit-operation.mapper.ts

- **Ruta:** [bank-deposit-operation.mapper.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/bank-deposit-operation.mapper.ts) (`comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/bank-deposit-operation.mapper.ts`, 60 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Mapper: declara `BankDepositOperationMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-deposit-operation.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-operation-entity-ts), [bank-deposit-cash-detail.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-cash-detail-entity-ts), [bank-deposit-transaction.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-transaction-entity-ts), [bank-deposit-operation.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts)
- **Consumidores:** [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

#### Clase `BankDepositOperationMapper` (L6–59)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 8–58 | `orm: BankDepositOperationOrmEntity` | `BankDepositOperation` |

##### `BankDepositOperationMapper.toDomain`

- **Firma:** `toDomain(orm: BankDepositOperationOrmEntity): BankDepositOperation` — [bank-deposit-operation.mapper.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/bank-deposit-operation.mapper.ts#L8) (L8–58)
- **Propósito / descripción:** `orm.cashDetails`/`orm.transactions` are `undefined` whenever the query didn't join them (the list view never does) — mapped to `[]`.
- **Dependencias (llamadas en su cuerpo):** `BankDepositOperation.create`, `(orm.cashDetails ?? []).map`, `BankDepositCashDetail.create`, `(orm.transactions ?? []).map`, `BankDepositTransaction.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts"></a>

### bank-deposit-operation.orm-entity.ts

- **Ruta:** [bank-deposit-operation.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/bank-deposit-operation.orm-entity.ts) (`comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/bank-deposit-operation.orm-entity.ts`, 155 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `BankDepositOperationOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [transaction-bank.orm-entity.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-transaction-bank-orm-entity-ts), [bank.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-bank-orm-entity-ts), [transaction-type.orm-entity.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-infrastructure-persistence-transaction-type-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [bank-deposit-cash-detail.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-cash-detail-orm-entity-ts), [bank-deposit-transaction.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-transaction-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [bank-deposit-cash-detail.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-cash-detail-orm-entity-ts), [bank-deposit-operation.mapper.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-mapper-ts), [bank-deposit-transaction.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-transaction-orm-entity-ts), [typeorm-bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts), [dashboard.module.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-dashboard-module-ts), [typeorm-dashboard.repository.ts](dashboard.md#f-comercial-jhoel-api-src-modules-dashboard-infrastructure-persistence-typeorm-dashboard-repository-ts)

#### Clase `BankDepositOperationOrmEntity` (L19–154)

- **Decoradores:** `@Entity('bank_deposit_operations')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column transactionBankId: string \| null`, `@ManyToOne transactionBank: TransactionBankOrmEntity \| null`, `@Column bankAccountId: string \| null`, `@ManyToOne bankAccount: BankOrmEntity \| null`, `@Column totalAmount: number`, `@Column transactionCount: number`, `@Column totalCash: number`, `@Column totalDistributed: number`, `@Column operationDate: string`, `@Column changeGiven: number`, `@Column cashBreakdownEnabled: boolean`, `@Column clientName: string \| null`, `@Column description: string \| null`, `@Column clientId: string \| null`, `@Column transactionTypeId: string`, `@ManyToOne transactionType: TransactionTypeOrmEntity`, `@Column userId: string`, `@ManyToOne user: UserOrmEntity`, `@OneToMany cashDetails: BankDepositCashDetailOrmEntity[]`, `@OneToMany transactions: BankDepositTransactionOrmEntity[]`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column isVoided: boolean`, `@Column voidedAt: Date \| null`, `@Column voidedBy: string \| null`, `@ManyToOne voidedByUser: UserOrmEntity \| null`, `@Column voidReason: string \| null`
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-transaction-orm-entity-ts"></a>

### bank-deposit-transaction.orm-entity.ts

- **Ruta:** [bank-deposit-transaction.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/bank-deposit-transaction.orm-entity.ts) (`comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/bank-deposit-transaction.orm-entity.ts`, 38 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `BankDepositTransactionOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [bank-deposit-operation.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [bank-deposit-operation.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts)

#### Clase `BankDepositTransactionOrmEntity` (L11–37)

- **Decoradores:** `@Entity('bank_deposit_transactions')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column operationId: string`, `@ManyToOne operation: BankDepositOperationOrmEntity`, `@Column sequence: number`, `@Column amount: number`
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-typeorm-bank-deposit-repository-ts"></a>

### typeorm-bank-deposit.repository.ts

- **Ruta:** [typeorm-bank-deposit.repository.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts) (`comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts`, 419 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmBankDepositRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-deposit-operation.entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-entities-bank-deposit-operation-entity-ts), [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts), [invalid-transaction-bank.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-transaction-bank-error-ts), [invalid-transaction-type.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-transaction-type-error-ts), [invalid-change-given.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-change-given-error-ts), [invalid-deposit-amount.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-deposit-amount-error-ts), [invalid-cash-quantity.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-cash-quantity-error-ts), [cash-total-mismatch.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-cash-total-mismatch-error-ts), [transaction-total-mismatch.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-transaction-total-mismatch-error-ts), [cash-breakdown.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-cash-breakdown-error-ts), [invalid-bank-deposit-client.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-client-error-ts), [bank-deposit-operation-not-found.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-operation-not-found-error-ts), [bank-deposit-operation-already-voided.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-bank-deposit-operation-already-voided-error-ts), [invalid-bank-account.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-account-error-ts) y 4 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts)

#### Clase `TypeOrmBankDepositRepository` (L41–418)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements BankDepositRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(BankDepositOperationOrmEntity) repository: Repository<BankDepositOperationOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `registerOperation` | método public async | 48–96 | `data: RegisterBankDepositOperationData`, `context?: TransactionContext` | `Promise<BankDepositOperation>` |
| `getManager` | método private | 99–101 | `context?: TransactionContext` | `EntityManager` |
| `findAll` | método public async | 103–129 | `options: FindBankDepositOperationsOptions` | `Promise<PaginatedResult<BankDepositOperation>>` |
| `findRecent` | método public async | 132–145 | `limit: number` | `Promise<BankDepositOperation[]>` |
| `findById` | método public async | 147–159 | `id: string`, `context?: TransactionContext` | `Promise<BankDepositOperation \| null>` |
| `getReportSummary` | método public async | 162–229 | `filters: BankDepositReportFilters` | `Promise<BankDepositReportSummary>` |
| `getDailyTransactionCounts` | método public async | 232–259 | `startDate: string`, `endDate: string` | `Promise<BankDepositDailyTransactionCount[]>` |
| `getMonthlyTransactionCounts` | método public async | 261–285 | `startDate: string`, `endDate: string` | `Promise<BankDepositMonthlyTransactionCount[]>` |
| `voidOperation` | método public async | 288–309 | `id: string`, `voidedBy: string`, `reason: string`, `businessDate: string` | `Promise<BankDepositOperation>` |
| `applyFilters` | método private | 311–363 | `qb: SelectQueryBuilder<BankDepositOperationOrmEntity>`, `filters: { transactionBankId?: string; transactionTypeId?: string; userId?: string; startDate?: string; endDate?: string; search?: string; }` | `void` |
| `translateBankDepositError` | método private | 366–417 | `error: unknown` | `unknown` |

##### `TypeOrmBankDepositRepository.registerOperation`

- **Firma:** `registerOperation(data: RegisterBankDepositOperationData, context?: TransactionContext): Promise<BankDepositOperation>` — [typeorm-bank-deposit.repository.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts#L48) (L48–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getManager`, `JSON.stringify`, `data.cashDetails.map`, `manager.query`, `this.translateBankDepositError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `register_bank_deposit_operation`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateBankDepositError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la transacción recién registrada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankDepositRepository.getManager`

- **Firma:** `getManager(context?: TransactionContext): EntityManager` — [typeorm-bank-deposit.repository.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts#L99) (L99–101)
- **Propósito / descripción:** Resolves the connection to use for a call: the shared transactional `EntityManager` when a `TransactionContext` was passed in, or this repository's own default connection otherwise — every caller that doesn't pass one gets byte-identical behavior to before this parameter existed.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmBankDepositRepository.findAll`

- **Firma:** `findAll(options: FindBankDepositOperationsOptions): Promise<PaginatedResult<BankDepositOperation>>` — [typeorm-bank-deposit.repository.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts#L103) (L103–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('operation').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `this.applyFilters`, `qb.orderBy('operation.operationDate', 'DESC').addOrderBy`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `orms.map`, `BankDepositOperationMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankDepositRepository.findRecent`

- **Firma:** `findRecent(limit: number): Promise<BankDepositOperation[]>` — [typeorm-bank-deposit.repository.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts#L132) (L132–145)
- **Propósito / descripción:** Las `limit` operaciones registradas más recientes (anuladas incluidas, igual que `findAll`) — `ORDER BY created_at DESC, id DESC` + `LIMIT` en SQL, nunca el historial completo. Sin joins a desglose/transacciones: es un resumen.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('operation').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `orms.map`, `BankDepositOperationMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankDepositRepository.findById`

- **Firma:** `findById(id: string, context?: TransactionContext): Promise<BankDepositOperation \| null>` — [typeorm-bank-deposit.repository.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts#L147) (L147–159)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getManager(context).findOne`, `this.getManager`, `BankDepositOperationMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmBankDepositRepository.getReportSummary`

- **Firma:** `getReportSummary(filters: BankDepositReportFilters): Promise<BankDepositReportSummary>` — [typeorm-bank-deposit.repository.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts#L162) (L162–229)
- **Propósito / descripción:** Excludes voided operations from every aggregate — the same way a CANCELLED day is excluded from Cuadre de Agentes' own totals. `findAll` deliberately does NOT apply this filter — voided operations must stay visible in the list (with a badge), only the totals ignore them.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder`, `this.applyFilters`, `totalsQb.andWhere`, `totalsQb.select('COUNT(*)', 'operationCount').addSelect`, `totalsQb.select`, `totalsQb.getRawOne`, `this.repository.createQueryBuilder('operation').leftJoin`, `byBankQb.andWhere`, `byBankQb.select`, `byBankQb.getRawMany`, `parseInt`, `parseFloat`, `byBankRaw.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankDepositRepository.getDailyTransactionCounts`

- **Firma:** `getDailyTransactionCounts(startDate: string, endDate: string): Promise<BankDepositDailyTransactionCount[]>` — [typeorm-bank-deposit.repository.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts#L232) (L232–259)
- **Propósito / descripción:** One row per date with at least one non-voided operation in range — `to_char` avoids the raw-`getRawMany` date/timestamp OID ambiguity `GetDashboardSummaryUseCase` already hit for this exact reason (see that use case's own doc comment); `operation_date` is a plain `DATE` column here too.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder`, `this.applyFilters`, `qb.andWhere`, `qb.select( "to_char(operation.operationDate, 'YYYY-MM-DD')", 'date', ).addSelect`, `qb.select`, `qb.groupBy('operation.operationDate').orderBy`, `qb.groupBy`, `qb.getRawMany`, `rows.map`, `parseInt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankDepositRepository.getMonthlyTransactionCounts`

- **Firma:** `getMonthlyTransactionCounts(startDate: string, endDate: string): Promise<BankDepositMonthlyTransactionCount[]>` — [typeorm-bank-deposit.repository.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts#L261) (L261–285)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder`, `this.applyFilters`, `qb.andWhere`, `qb.select("to_char(operation.operationDate, 'YYYY-MM')", 'month').addSelect`, `qb.select`, `qb.groupBy("to_char(operation.operationDate, 'YYYY-MM')").orderBy`, `qb.groupBy`, `qb.getRawMany`, `rows.map`, `parseInt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankDepositRepository.voidOperation`

- **Firma:** `voidOperation(id: string, voidedBy: string, reason: string, businessDate: string): Promise<BankDepositOperation>` — [typeorm-bank-deposit.repository.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts#L288) (L288–309)
- **Propósito / descripción:** `void_bank_deposit_operation` marca la anulación Y registra el movimiento inverso de saldo en la misma transacción — nunca queda una operación anulada con su saldo aún aplicado (ni al revés).
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `this.translateBankDepositError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `void_bank_deposit_operation`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateBankDepositError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la transacción recién anulada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmBankDepositRepository.applyFilters`

- **Firma:** `applyFilters(qb: SelectQueryBuilder<BankDepositOperationOrmEntity>, filters: { transactionBankId?: string; transactionTypeId?: string; userId?: string; startDate?: string; endDate?: string; search?: string; }): void` — [typeorm-bank-deposit.repository.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts#L311) (L311–363)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `qb.andWhere`, `filters.search?.trim`, `search.replace`
- **Efectos secundarios:** Tablas en su SQL: `transaction_types`, `transaction_banks`, `banks`
- **Consumidores:** (mismo archivo)

##### `TypeOrmBankDepositRepository.translateBankDepositError`

- **Firma:** `translateBankDepositError(error: unknown): unknown` — [typeorm-bank-deposit.repository.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts#L366) (L366–417)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;id&gt;'` → domain-error translation as `TypeOrmPurchaseRepository.translatePurchaseError` — see that method's own doc comment for why this parsing exists.
- **Dependencias (llamadas en su cuerpo):** `bankMovementErrorFromMessage`, `message.split`, `new InvalidBankDepositDescriptionError`, `new InvalidTransactionBankError`, `new InvalidTransactionTypeError`, `new InvalidDepositAmountError`, `new InvalidCashQuantityError`, `new CashTotalMismatchError`, `new CashBreakdownRequiredError`, `new CashBreakdownNotExpectedError`, `new TransactionTotalMismatchError`, `new InvalidChangeGivenError`, `new InvalidBankDepositClientError`, `new InvalidBankAccountError`, `new BankDepositOperationNotFoundError`, `new BankDepositOperationAlreadyVoidedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts"></a>

### bank-deposits.controller.ts

- **Ruta:** [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts) (`comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts`, 154 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** No class-level `@Roles(...)` — registering a Transaccionar deposit is an operational action for whoever runs the register, same policy as Sales/Purchases/Recargas.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [get-bank-deposit-operation-by-id.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-operation-by-id-use-case-ts), [void-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-void-bank-deposit-operation-use-case-ts), [get-bank-deposit-monthly-count.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-monthly-count-use-case-ts), [get-bank-deposit-transaction-summary.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-transaction-summary-use-case-ts), [get-bank-deposit-daily-stats.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-daily-stats-use-case-ts), [get-bank-deposit-weekly-stats.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-weekly-stats-use-case-ts), [get-bank-deposit-yearly-stats.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-get-bank-deposit-yearly-stats-use-case-ts), [list-recent-bank-deposit-operations.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-recent-bank-deposit-operations-use-case-ts), [create-bank-deposit.request.dto.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-create-bank-deposit-request-dto-ts), [void-bank-deposit-operation.request.dto.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-void-bank-deposit-operation-request-dto-ts) y 6 más
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts)

#### Clase `BankDepositsController` (L55–153)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('bank-deposits')`
- **Propósito:** No class-level `@Roles(...)` — registering a Transaccionar deposit is an operational action for whoever runs the register, same policy as Sales/Purchases/Recargas. `JwtAuthGuard` (any authenticated, active account) is the only gate on `create`/`findOne`/`monthlyCount`. Reading the full filterable/by-bank report is a separate, admin-only concern — see `BankDepositsReportController` under `/reports/bank-deposits`; `monthlyCount` deliberately only ever returns one plain number (backs the Resumen dashboard's "Bancos" tile, visible to every authenticated account), never that report's own breakdown. `void` is the one route on this controller that IS admin-gated (`@Roles`) — see `VoidBankDepositOperationUseCase`'s own doc comment for why correcting an already-registered operation is a management action, not an operational one.
- **Dependencias inyectadas (constructor):** `registerBankDepositOperationUseCase: RegisterBankDepositOperationUseCase`, `getBankDepositOperationByIdUseCase: GetBankDepositOperationByIdUseCase`, `voidBankDepositOperationUseCase: VoidBankDepositOperationUseCase`, `getBankDepositMonthlyCountUseCase: GetBankDepositMonthlyCountUseCase`, `getBankDepositTransactionSummaryUseCase: GetBankDepositTransactionSummaryUseCase`, `getBankDepositDailyStatsUseCase: GetBankDepositDailyStatsUseCase`, `getBankDepositWeeklyStatsUseCase: GetBankDepositWeeklyStatsUseCase`, `getBankDepositYearlyStatsUseCase: GetBankDepositYearlyStatsUseCase`, `listRecentBankDepositOperationsUseCase: ListRecentBankDepositOperationsUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 70–93 | `dto: CreateBankDepositRequestDto`, `user: RequestUser` | `Promise<BankDepositOperationResponseDto>` |
| `monthlyCount` | método public | 96–99 | — | `Promise<BankDepositMonthlyCountResponseDto>` |
| `transactionSummary` | método public | 102–105 | — | `Promise<BankDepositTransactionSummaryResponseDto>` |
| `dailyStats` | método public | 108–111 | — | `Promise<BankDepositDailyStatsResponseDto>` |
| `weeklyStats` | método public | 114–117 | — | `Promise<BankDepositWeeklyStatsResponseDto>` |
| `yearlyStats` | método public | 120–123 | — | `Promise<BankDepositYearlyStatsResponseDto>` |
| `recent` | método public | 126–129 | — | `Promise<BankDepositOperationSummaryResponseDto[]>` |
| `findOne` | método public | 131–136 | `id: string` | `Promise<BankDepositOperationResponseDto>` |
| `voidOperation` | método public | 139–152 | `id: string`, `dto: VoidBankDepositOperationRequestDto`, `userId: string` | `Promise<BankDepositOperationResponseDto>` |

##### `BankDepositsController.create`

- **Firma:** `create(dto: CreateBankDepositRequestDto, user: RequestUser): Promise<BankDepositOperationResponseDto>` — [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L70) (L70–93)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.registerBankDepositOperationUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositsController.monthlyCount`

- **Firma:** `monthlyCount(): Promise<BankDepositMonthlyCountResponseDto>` — [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L96) (L96–99)
- **Decoradores:** `@Get('monthly-count')`
- **Propósito / descripción:** Backs the "Bancos" Resumen tile — must be declared before `:id` or Express would swallow "monthly-count" as that param.
- **Dependencias (llamadas en su cuerpo):** `this.getBankDepositMonthlyCountUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositsController.transactionSummary`

- **Firma:** `transactionSummary(): Promise<BankDepositTransactionSummaryResponseDto>` — [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L102) (L102–105)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Backs Transaccionar's "Resumen Diario"/"Resumen del Mes en Curso" cards and the Resumen dashboard's "Resumen Diario de Transacciones" section — same reasoning as `monthly-count` above, must be declared before `:id`. Open to any authenticated account, same policy as the rest of this controller (excluding `void`).
- **Dependencias (llamadas en su cuerpo):** `this.getBankDepositTransactionSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositsController.dailyStats`

- **Firma:** `dailyStats(): Promise<BankDepositDailyStatsResponseDto>` — [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L108) (L108–111)
- **Decoradores:** `@Get('daily-stats')`
- **Propósito / descripción:** Backs the "Transacciones del mes" chart on Resumen and Reporte de Transacciones — same reasoning as `monthly-count`/`summary` above, must be declared before `:id`. Open to any authenticated account.
- **Dependencias (llamadas en su cuerpo):** `this.getBankDepositDailyStatsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositsController.weeklyStats`

- **Firma:** `weeklyStats(): Promise<BankDepositWeeklyStatsResponseDto>` — [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L114) (L114–117)
- **Decoradores:** `@Get('weekly-stats')`
- **Propósito / descripción:** Backs "Transacciones por semana" on Gráficas → Indicadores de Transacciones — same reasoning as `daily-stats` above, must be declared before `:id`. Open to any authenticated account (the "Gráficas" menu itself is admin-only on the frontend; this endpoint carries nothing more sensitive than `daily-stats` already does).
- **Dependencias (llamadas en su cuerpo):** `this.getBankDepositWeeklyStatsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositsController.yearlyStats`

- **Firma:** `yearlyStats(): Promise<BankDepositYearlyStatsResponseDto>` — [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L120) (L120–123)
- **Decoradores:** `@Get('yearly-stats')`
- **Propósito / descripción:** Backs "Transacciones por mes" (anual) on Gráficas → Indicadores de Transacciones — same reasoning as `daily-stats`/`weekly-stats` above, must be declared before `:id`.
- **Dependencias (llamadas en su cuerpo):** `this.getBankDepositYearlyStatsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositsController.recent`

- **Firma:** `recent(): Promise<BankDepositOperationSummaryResponseDto[]>` — [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L126) (L126–129)
- **Decoradores:** `@Get('recent')`
- **Propósito / descripción:** Tarjeta "Últimas transacciones" de Transaccionar — las 10 más recientes (fijo, sin parámetros). Misma política que el resto del controlador: cualquier cuenta autenticada, igual que la propia pantalla Transaccionar. Debe declararse antes de `:id`.
- **Dependencias (llamadas en su cuerpo):** `this.listRecentBankDepositOperationsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositsController.findOne`

- **Firma:** `findOne(id: string): Promise<BankDepositOperationResponseDto>` — [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L131) (L131–136)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getBankDepositOperationByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositsController.voidOperation`

- **Firma:** `voidOperation(id: string, dto: VoidBankDepositOperationRequestDto, userId: string): Promise<BankDepositOperationResponseDto>` — [bank-deposits.controller.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts#L139) (L139–152)
- **Decoradores:** `@Post(':id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** Anular — never a physical delete/edit, see `VoidBankDepositOperationUseCase`.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidBankDepositOperationUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-bank-deposit-daily-stats-response-dto-ts"></a>

### bank-deposit-daily-stats.response.dto.ts

- **Ruta:** [bank-deposit-daily-stats.response.dto.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/bank-deposit-daily-stats.response.dto.ts) (`comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/bank-deposit-daily-stats.response.dto.ts`, 10 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** DTO de respuesta: declara `BankDepositDailyStatDto`, `BankDepositDailyStatsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

#### Clase `BankDepositDailyStatDto` (L1–4)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankDepositDailyStatsResponseDto` (L6–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-bank-deposit-monthly-count-response-dto-ts"></a>

### bank-deposit-monthly-count.response.dto.ts

- **Ruta:** [bank-deposit-monthly-count.response.dto.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/bank-deposit-monthly-count.response.dto.ts) (`comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/bank-deposit-monthly-count.response.dto.ts`, 5 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** DTO de respuesta: declara `BankDepositMonthlyCountResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

#### Clase `BankDepositMonthlyCountResponseDto` (L1–4)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-bank-deposit-transaction-summary-response-dto-ts"></a>

### bank-deposit-transaction-summary.response.dto.ts

- **Ruta:** [bank-deposit-transaction-summary.response.dto.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/bank-deposit-transaction-summary.response.dto.ts) (`comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/bank-deposit-transaction-summary.response.dto.ts`, 16 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** DTO de respuesta: declara `BankDepositSummaryByBankDto`, `BankDepositPeriodSummaryDto`, `BankDepositTransactionSummaryResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

#### Clase `BankDepositSummaryByBankDto` (L1–5)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankDepositPeriodSummaryDto` (L7–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankDepositTransactionSummaryResponseDto` (L12–15)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-bank-deposit-weekly-stats-response-dto-ts"></a>

### bank-deposit-weekly-stats.response.dto.ts

- **Ruta:** [bank-deposit-weekly-stats.response.dto.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/bank-deposit-weekly-stats.response.dto.ts) (`comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/bank-deposit-weekly-stats.response.dto.ts`, 13 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** DTO de respuesta: declara `BankDepositWeeklyStatDto`, `BankDepositWeeklyStatsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

#### Clase `BankDepositWeeklyStatDto` (L1–7)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankDepositWeeklyStatsResponseDto` (L9–12)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-bank-deposit-yearly-stats-response-dto-ts"></a>

### bank-deposit-yearly-stats.response.dto.ts

- **Ruta:** [bank-deposit-yearly-stats.response.dto.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/bank-deposit-yearly-stats.response.dto.ts) (`comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/bank-deposit-yearly-stats.response.dto.ts`, 11 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** DTO de respuesta: declara `BankDepositMonthlyStatDto`, `BankDepositYearlyStatsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

#### Clase `BankDepositMonthlyStatDto` (L1–5)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankDepositYearlyStatsResponseDto` (L7–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-bank-deposit-response-dto-ts"></a>

### bank-deposit.response.dto.ts

- **Ruta:** [bank-deposit.response.dto.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/bank-deposit.response.dto.ts) (`comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/bank-deposit.response.dto.ts`, 93 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** DTO de respuesta: declara `BankDepositCashDetailResponseDto`, `BankDepositTransactionResponseDto`, `BankDepositOperationResponseDto`, `BankDepositOperationSummaryResponseDto`, `PaginatedBankDepositOperationsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

#### Clase `BankDepositCashDetailResponseDto` (L1–6)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankDepositTransactionResponseDto` (L8–12)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankDepositOperationResponseDto` (L14–61)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `BankDepositOperationSummaryResponseDto` (L63–85)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedBankDepositOperationsResponseDto` (L87–92)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-create-bank-deposit-request-dto-ts"></a>

### create-bank-deposit.request.dto.ts

- **Ruta:** [create-bank-deposit.request.dto.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/create-bank-deposit.request.dto.ts) (`comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/create-bank-deposit.request.dto.ts`, 115 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** DTO de entrada: declara `BankDepositCashDetailRequestDto`, `CreateBankDepositRequestDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [invalid-bank-deposit-description.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-description-error-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

#### Clase `BankDepositCashDetailRequestDto` (L19–27)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CreateBankDepositRequestDto` (L29–114)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-bank-deposits-presentation-dtos-void-bank-deposit-operation-request-dto-ts"></a>

### void-bank-deposit-operation.request.dto.ts

- **Ruta:** [void-bank-deposit-operation.request.dto.ts](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/void-bank-deposit-operation.request.dto.ts) (`comercial-jhoel-api/src/modules/bank-deposits/presentation/dtos/void-bank-deposit-operation.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `bank-deposits`
- **Responsabilidad:** Mirrors Banks' own `DayActionReasonRequestDto` (reopen/cancel día) — same mandatory-reason shape, kept as this module's own copy rather than a cross-module import.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [bank-deposits.controller.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-presentation-controllers-bank-deposits-controller-ts)

#### Clase `VoidBankDepositOperationRequestDto` (L4–10)

- **Propósito:** Mirrors Banks' own `DayActionReasonRequestDto` (reopen/cancel día) — same mandatory-reason shape, kept as this module's own copy rather than a cross-module import.
