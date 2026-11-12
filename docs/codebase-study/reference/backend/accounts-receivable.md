# Módulo backend `accounts-receivable`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/account-receivable-payments` | [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L55) `AccountReceivablePaymentsController.list` | [ListAccountReceivableSettlementsUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts) | `AccountReceivableSettlementRepository`.findAll [account_receivable_payment_operations] | UseGuards(JwtAuthGuard) | `AccountReceivablePaymentService.getSettlements` |
| `GET /api/account-receivable-payments/clients/:clientId/pending` | [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L60) `AccountReceivablePaymentsController.pending` | [GetClientPendingChargesUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts) | `AccountReceivableSettlementRepository`.findClientName/findChargeBalances [clients] | UseGuards(JwtAuthGuard) | `AccountReceivablePaymentService.getPendingCharges` |
| `GET /api/account-receivable-payments/charges/:chargeId` | [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L65) `AccountReceivablePaymentsController.chargeHistory` | [GetChargePaymentHistoryUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts) | `AccountReceivableSettlementRepository`.findChargeBalancesByIds/findChargePayments [accounts_receivable, account_receivable_payment_details, account_receivable_payment_operations, users, banks] | UseGuards(JwtAuthGuard) | `AccountReceivablePaymentService.getChargeHistory` |
| `POST /api/account-receivable-payments/preview` | [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L70) `AccountReceivablePaymentsController.preview` | [PreviewAccountReceivableSettlementUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts) | `AccountReceivableSettlementRepository`.findClientName/findChargeBalancesByIds/getCashBalance/findBank → `cash_balance` [accounts_receivable, banks, clients] | UseGuards(JwtAuthGuard) | `AccountReceivablePaymentService.preview` |
| `POST /api/account-receivable-payments` | [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L76) `AccountReceivablePaymentsController.settle` | [SettleAccountsReceivableUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts) | `AccountReceivableSettlementRepository`.settle/findById/getCashBalance → `settle_accounts_receivable`, `cash_balance` [account_receivable_payment_details, accounts_receivable] | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AccountReceivablePaymentService.settle` |
| `GET /api/account-receivable-payments/:id` | [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L91) `AccountReceivablePaymentsController.findOne` | [GetAccountReceivableSettlementUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts) | `AccountReceivableSettlementRepository`.findById [account_receivable_payment_details, accounts_receivable] | UseGuards(JwtAuthGuard) | `AccountReceivablePaymentService.getSettlement` |
| `POST /api/account-receivable-payments/:id/void` | [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L96) `AccountReceivablePaymentsController.void` | [VoidAccountReceivableSettlementUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts) | `AccountReceivableSettlementRepository`.void/findById/getCashBalance → `void_account_receivable_payment`, `cash_balance` [account_receivable_payment_details, accounts_receivable] | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AccountReceivablePaymentService.voidSettlement` |
| `POST /api/accounts-receivable` | [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L61) `AccountsReceivableController.create` | [CreateAccountReceivableUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-create-account-receivable-use-case-ts) | `AccountReceivableRepository`.create<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AccountReceivableService.createAccountReceivable` |
| `GET /api/accounts-receivable` | [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L75) `AccountsReceivableController.findAll` | [ListAccountsReceivableUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-list-accounts-receivable-use-case-ts) | `AccountReceivableRepository`.findAll<br>`AccountReceivableSettlementRepository`.findChargeBalances | UseGuards(JwtAuthGuard) | `AccountReceivableService.getAccountsReceivable` |
| `GET /api/accounts-receivable/summary` | [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L83) `AccountsReceivableController.getActiveBalanceSummary` | [GetAccountReceivableActiveBalanceUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-active-balance-use-case-ts) | `AccountReceivableRepository`.getReportSummary | UseGuards(JwtAuthGuard) | `AccountReceivableService.getActiveBalance` |
| `GET /api/accounts-receivable/:id` | [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L88) `AccountsReceivableController.findOne` | [GetAccountReceivableByIdUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-by-id-use-case-ts) | `AccountReceivableRepository`.findById | UseGuards(JwtAuthGuard) | `AccountReceivableService.getAccountReceivableById` |
| `PATCH /api/accounts-receivable/:id` | [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L95) `AccountsReceivableController.update` | [UpdateAccountReceivableUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-update-account-receivable-use-case-ts) | `AccountReceivableRepository`.findById/update<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AccountReceivableService.updateAccountReceivable` |
| `DELETE /api/accounts-receivable/:id` | [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L109) `AccountsReceivableController.deactivate` | [DeactivateAccountReceivableUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-deactivate-account-receivable-use-case-ts) | `AccountReceivableRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AccountReceivableService.deleteAccountReceivable` |
| `POST /api/accounts-receivable/:clientId/charges` | [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L118) `AccountsReceivableController.registerCharge` | [RegisterAccountReceivableChargeUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-charge-use-case-ts) | `AccountReceivableRepository`.registerMovement → `register_account_receivable_movement`<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AccountReceivableService.registerCharge` |
| `POST /api/accounts-receivable/:clientId/payments` | [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L135) `AccountsReceivableController.registerPayment` | [RegisterAccountReceivablePaymentUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-payment-use-case-ts) | `AccountReceivableRepository`.registerMovement → `register_account_receivable_movement`<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AccountReceivableService.registerPayment` |
| `GET /api/accounts-receivable/:clientId/statement` | [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L152) `AccountsReceivableController.getStatement` | [GetAccountReceivableStatementUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-statement-use-case-ts) | `AccountReceivableRepository`.getStatement [clients, accounts_receivable, users, movements]<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) | `AccountReceivableService.getStatement` |
| `GET /api/accounts-receivable/:clientId/balance` | [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L164) `AccountsReceivableController.getCurrentBalance` | [GetAccountReceivableCurrentBalanceUseCase](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-current-balance-use-case-ts) | `AccountReceivableRepository`.getCurrentBalance [accounts_receivable]<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) | `AccountReceivableService.getCurrentBalance` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [accounts-receivable.module.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `AccountsReceivableModule` (sin comentario de documentación en el código). | 19 internas; ext.: @nestjs/common, @nestjs/typeorm | 4 | Media (4 consumidores) |
| [account-receivable-output.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toAccountReceivableOutput`, `AccountReceivableOutput` (sin comentario de documentación en el código). | 2 internas | 6 | Media (6 consumidores) |
| [account-receivable-statement-output.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-statement-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toStatementMovementOutput`, `toAccountReceivableStatementOutput`, `StatementMovementOutput`, `AccountReceivableStatementOutput` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [account-receivable-settlement.use-cases.spec.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `charge`, `repository`, `CLIENT`, `OTHER`, `OPERATION` (sin comentario de documentación en el código). | 5 internas | 0 | Soporte (pruebas) |
| [account-receivable-settlement.use-cases.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts) | .ts | Caso de uso | Aplicación | "Consultar cuentas seleccionables de un cliente": active CARGOs with a pending amount &gt; 0. | 2 internas; ext.: crypto, @nestjs/common | 3 | Media (3 consumidores) |
| [create-account-receivable.use-case.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-create-account-receivable-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateAccountReceivableUseCase`, `CreateAccountReceivableInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-account-receivable.use-case.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-deactivate-account-receivable-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — DELETE /accounts-receivable/:id never removes the row, preserving historial integrity. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-account-receivable-active-balance.use-case.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-active-balance-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the plain list screen's "Saldo total" tile — always scoped to `isActive: true` only, independent of whatever search/date/client filters the list itself currently has applied (the user asked for the active-accounts total specifically, not a filtered one). | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-account-receivable-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetAccountReceivableByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-account-receivable-current-balance.use-case.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-current-balance-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the client selector's "Saldo actual" display — a single bounded aggregate, never a full-history fetch. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-account-receivable-statement.use-case.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-statement-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the "Estado de Cuenta" view — saldo inicial del periodo, movimientos con saldo corrido, totales. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-accounts-receivable.use-case.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-list-accounts-receivable-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListAccountsReceivableUseCase`, `ListAccountsReceivableInput`, `ListAccountsReceivableOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 5 | Media (5 consumidores) |
| [register-account-receivable-charge.use-case.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-charge-use-case-ts) | .ts | Caso de uso | Aplicación | "Registrar Cargo" for Cuentas por Cobrar — an independent Kardex movement, never a rewrite of a prior one (see the migration's own doc comment for the full reasoning). | 5 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [register-account-receivable-payment.use-case.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-payment-use-case-ts) | .ts | Caso de uso | Aplicación | "Registrar Abono" for Cuentas por Cobrar. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-account-receivable.use-case.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-update-account-receivable-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateAccountReceivableUseCase`, `UpdateAccountReceivableInput` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [account-receivable.entity.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-entities-account-receivable-entity-ts) | .ts | Entidad de dominio | Dominio | "Cuentas por Cobrar" — a client-linked Kardex/ledger of money the client owes: every row is a `CARGO` (adds to the balance) or `ABONO` (reduces it) movement, `amount` always a positive magnitude (see migration `CreateFinancialKardexColumns`). | 0 internas | 6 | Media (6 consumidores) |
| [abono-exceeds-balance.error.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-abono-exceeds-balance-error-ts) | .ts | Errores de dominio | Dominio | Cuentas por Cobrar has never allowed a negative balance (its own `CHK_accounts_receivable_amount_positive` never lapsed, unlike Activos' — see `register_account_receivable_movement`'s own doc comment) — this preserves that existing rule exactly. | 1 internas | 1 | Baja (1 consumidores) |
| [account-receivable-not-found.error.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-account-receivable-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `AccountReceivableNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [account-receivable-settlement.errors.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-account-receivable-settlement-errors-ts) | .ts | Errores de dominio | Dominio | Business-rule violation of the "Cancelar cuenta(s) por cobrar" feature. | 1 internas | 3 | Media (3 consumidores) |
| [invalid-movement.error.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-invalid-movement-error-ts) | .ts | Errores de dominio | Dominio | Defensive only — `RegisterMovementRequestDto` already validates `movementType`/`amount` before this ever reaches SQL; these translate `register_account_receivable_movement`'s own guard rails should that validation ever be bypassed. | 1 internas | 1 | Baja (1 consumidores) |
| [referenced-client-invalid.error.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-referenced-client-invalid-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `ReferencedClientNotFoundError`, `ReferencedClientInactiveError` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [account-receivable-settlement.repository.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-settlement-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | One CARGO with its pending amount, computed by `ar_charge_balances` in PostgreSQL: amount − payments allocated to it − its FIFO share of the client's general (unallocated) abonos. | 0 internas | 7 | Media (7 consumidores) |
| [account-receivable.repository.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `FindAccountsReceivableOptions`, `PaginatedResult`, `FindAccountsReceivableReportSummaryOptions`, `AccountsReceivableReportSummary`, `CreateAccountReceivableData` (sin comentario de documentación en el código). | 2 internas | 18 | Alta (18 consumidores) |
| [account-receivable.mapper.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `AccountReceivableMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [account-receivable.orm-entity.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `AccountReceivableOrmEntity` (sin comentario de documentación en el código). | 3 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [typeorm-account-receivable-settlement.repository.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-settlement-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Raw-SQL adapter of the settlement port. | 3 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-account-receivable.repository.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmAccountReceivableRepository`, `SORT_COLUMN` (sin comentario de documentación en el código). | 8 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [account-receivable-payments.controller.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts) | .ts | Controlador | Presentación | Cuentas por Cobrar → "Cancelar cuenta(s)" (cash or bank deposit, one or several accounts of the same client) and its payment history. | 6 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [accounts-receivable.controller.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts) | .ts | Controlador | Presentación | Create/update/deactivate are admin-only — same policy as Products/Clients. | 21 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [account-receivable-settlement.request.dto.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-account-receivable-settlement-request-dto-ts) | .ts | DTO de entrada | Presentación | One selected account. | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [account-receivable.response.dto.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-account-receivable-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `AccountReceivableResponseDto`, `PaginatedAccountsReceivableResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [create-account-receivable.request.dto.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-create-account-receivable-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateAccountReceivableRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [get-statement.query.dto.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-get-statement-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `GetStatementQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-accounts-receivable.query.dto.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-list-accounts-receivable-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListAccountsReceivableQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [register-movement.request.dto.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-register-movement-request-dto-ts) | .ts | DTO de entrada | Presentación | Backs both "Registrar Cargo" and "Registrar Abono" — `clientId` comes from the route param, never the body. | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [statement.response.dto.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-statement-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `StatementMovementResponseDto`, `AccountReceivableStatementResponseDto`, `CurrentBalanceResponseDto`, `ActiveBalanceSummaryResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [update-account-receivable.request.dto.ts](#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-update-account-receivable-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateAccountReceivableRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts"></a>

### accounts-receivable.module.ts

- **Ruta:** [accounts-receivable.module.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/accounts-receivable.module.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/accounts-receivable.module.ts`, 81 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Módulo: declara `AccountsReceivableModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts), [account-receivable.orm-entity.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-orm-entity-ts), [typeorm-account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts), [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [create-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-create-account-receivable-use-case-ts), [list-accounts-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-list-accounts-receivable-use-case-ts), [get-account-receivable-by-id.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-by-id-use-case-ts), [update-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-update-account-receivable-use-case-ts), [deactivate-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-deactivate-account-receivable-use-case-ts), [register-account-receivable-charge.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-charge-use-case-ts), [register-account-receivable-payment.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-payment-use-case-ts), [get-account-receivable-statement.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-statement-use-case-ts), [get-account-receivable-current-balance.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-current-balance-use-case-ts), [get-account-receivable-active-balance.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-active-balance-use-case-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts) y 4 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `AccountsReceivableModule` (L31–80)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([AccountReceivableOrmEntity]), ClientsModule, ], controllers: [ AccountsReceivableController, AccountReceivablePaym`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-output-ts"></a>

### account-receivable-output.ts

- **Ruta:** [account-receivable-output.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/dtos/account-receivable-output.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/dtos/account-receivable-output.ts`, 56 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** DTO de salida (aplicación): declara `toAccountReceivableOutput`, `AccountReceivableOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-receivable-settlement.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-settlement-repository-ts), [account-receivable.entity.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-entities-account-receivable-entity-ts)
- **Consumidores:** [create-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-create-account-receivable-use-case-ts), [get-account-receivable-by-id.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-by-id-use-case-ts), [list-accounts-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-list-accounts-receivable-use-case-ts), [register-account-receivable-charge.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-charge-use-case-ts), [register-account-receivable-payment.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-payment-use-case-ts), [update-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-update-account-receivable-use-case-ts)

**Interfaces, tipos y enums:**

- `interface AccountReceivableOutput` (L7): sin documentación — miembros: `id`, `clientId`, `clientName`, `date`, `amount`, `movementType`, `description`, `referenceType`, `referenceId`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`, `pendingAmount`, `paidAmount`, `paymentStatus`
#### Función `toAccountReceivableOutput` (L34–55)

- **Tipo:** función exportada
- **Firma:** `toAccountReceivableOutput(record: AccountReceivable): AccountReceivableOutput` — [account-receivable-output.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/dtos/account-receivable-output.ts#L34)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-create-account-receivable-use-case-ts), [get-account-receivable-by-id.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-by-id-use-case-ts), [list-accounts-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-list-accounts-receivable-use-case-ts), [register-account-receivable-charge.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-charge-use-case-ts), [register-account-receivable-payment.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-payment-use-case-ts), [update-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-update-account-receivable-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-statement-output-ts"></a>

### account-receivable-statement-output.ts

- **Ruta:** [account-receivable-statement-output.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/dtos/account-receivable-statement-output.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/dtos/account-receivable-statement-output.ts`, 56 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** DTO de salida (aplicación): declara `toStatementMovementOutput`, `toAccountReceivableStatementOutput`, `StatementMovementOutput`, `AccountReceivableStatementOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-receivable.entity.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-entities-account-receivable-entity-ts), [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts)
- **Consumidores:** [get-account-receivable-statement.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-statement-use-case-ts)

**Interfaces, tipos y enums:**

- `interface StatementMovementOutput` (L7): sin documentación — miembros: `id`, `date`, `movementType`, `description`, `amount`, `balanceAfter`, `createdByUsername`, `createdAt`
- `interface AccountReceivableStatementOutput` (L18): sin documentación — miembros: `clientId`, `clientName`, `openingBalance`, `movements`, `totalCargos`, `totalAbonos`, `closingBalance`
#### Función `toStatementMovementOutput` (L28–41)

- **Tipo:** función local del archivo
- **Firma:** `toStatementMovementOutput(movement: StatementMovement): StatementMovementOutput` — [account-receivable-statement-output.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/dtos/account-receivable-statement-output.ts#L28)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toAccountReceivableStatementOutput` (L43–55)

- **Tipo:** función exportada
- **Firma:** `toAccountReceivableStatementOutput(statement: AccountReceivableStatement): AccountReceivableStatementOutput` — [account-receivable-statement-output.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/dtos/account-receivable-statement-output.ts#L43)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `statement.movements.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-account-receivable-statement.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-statement-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-spec-ts"></a>

### account-receivable-settlement.use-cases.spec.ts

- **Ruta:** [account-receivable-settlement.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.spec.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.spec.ts`, 370 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Prueba unitaria: declara `charge`, `repository`, `CLIENT`, `OTHER`, `OPERATION` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-receivable-settlement.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-settlement-repository-ts), [account-receivable-settlement.use-cases.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts), [list-accounts-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-list-accounts-receivable-use-case-ts), [account-receivable.entity.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-entities-account-receivable-entity-ts), [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts)
- **Consumidores:** —
#### Función `charge` (L20–43)

- **Tipo:** función local del archivo
- **Firma:** `charge(id: string, pending: number, original?, clientId?): ChargeBalance` — [account-receivable-settlement.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.spec.ts#L20)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `repository` (L51–74)

- **Tipo:** función local del archivo
- **Firma:** `repository(overrides?: Partial<AccountReceivableSettlementRepository>)` — [account-receivable-settlement.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.spec.ts#L51)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `jest.fn().mockResolvedValue`, `jest.fn`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts"></a>

### account-receivable-settlement.use-cases.ts

- **Ruta:** [account-receivable-settlement.use-cases.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts`, 364 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** "Consultar cuentas seleccionables de un cliente": active CARGOs with a pending amount &gt; 0.
- **Depende de (archivos del proyecto):** [account-receivable-settlement.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-settlement-repository-ts), [account-receivable-settlement.errors.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-account-receivable-settlement-errors-ts)
- **Paquetes externos:** `crypto`, `@nestjs/common`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [account-receivable-settlement.use-cases.spec.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-spec-ts), [account-receivable-payments.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts)

**Interfaces, tipos y enums:**

- `interface ClientPendingCharges` (L29): sin documentación — miembros: `clientId`, `clientName`, `charges`, `totalPending`
- `interface SettlementPreviewInput` (L64): sin documentación — miembros: `clientId`, `items`, `paymentMethod`, `bankId`
- `interface SettlementPreviewLine` (L71) extends ChargeBalance: sin documentación — miembros: `amountToPay`, `pendingAfter`
- `interface SettlementPreview` (L76): sin documentación — miembros: `clientId`, `clientName`, `paymentMethod`, `lines`, `total`, `cash`, `bank`
- `interface SettleAccountsReceivableInput` (L194): sin documentación — miembros: `clientId`, `items`, `paymentMethod`, `bankId`, `referenceNumber`, `observations`, `expectedTotal`, `clientRequestId`, `userId`, `role`
- `interface SettlementResult` (L207): sin documentación — miembros: `operation`, `cashBalance`
- `interface ChargePaymentHistory` (L342): sin documentación — miembros: `charge`, `payments`

**Constantes exportadas:**

- `SETTLEMENT_ROLES` (L17): Roles allowed to collect and void — the same ones that may "Registrar Abono" today. = `['SUPER_ADMIN', 'ADMIN'] as const`

#### Clase `GetClientPendingChargesUseCase` (L38–62)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Consultar cuentas seleccionables de un cliente": active CARGOs with a pending amount &gt; 0.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY) repository: AccountReceivableSettlementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 45–61 | `clientId: string` | `Promise<ClientPendingCharges>` |

##### `GetClientPendingChargesUseCase.execute`

- **Firma:** `execute(clientId: string): Promise<ClientPendingCharges>` — [account-receivable-settlement.use-cases.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts#L45) (L45–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findClientName`, `settlementError`, `( await this.repository.findChargeBalances([clientId]) ).filter`, `this.repository.findChargeBalances`, `round2`, `charges.reduce`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `settlementError('AR_SETTLEMENT_CLIENT_NOT_FOUND')`
- **Consumidores:** [account-receivable-payments.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts)


#### Clase `PreviewAccountReceivableSettlementUseCase` (L101–192)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Resumen de cuentas seleccionadas" before confirming: pendings, total and resulting cash / bank balance, all read from PostgreSQL. Applies the same rules as the write (same client, still pending, no partial in a batch) so the modal shows the problem before the user confirms; the write re-checks everything under lock anyway.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY) repository: AccountReceivableSettlementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 108–191 | `input: SettlementPreviewInput` | `Promise<SettlementPreview>` |

##### `PreviewAccountReceivableSettlementUseCase.execute`

- **Firma:** `execute(input: SettlementPreviewInput): Promise<SettlementPreview>` — [account-receivable-settlement.use-cases.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts#L108) (L108–191)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.items.map`, `settlementError`, `new Set`, `this.repository.findClientName`, `this.repository.findChargeBalancesByIds`, `new Map`, `charges.map`, `byId.get`, `round2`, `lines.reduce`, `this.repository.getCashBalance`, `this.repository.findBank`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `settlementError('AR_SETTLEMENT_ITEMS_REQUIRED')`, `settlementError('AR_SETTLEMENT_DUPLICATE_ITEM')`, `settlementError('AR_SETTLEMENT_CLIENT_NOT_FOUND')`, `settlementError('AR_SETTLEMENT_ACCOUNT_NOT_PAYABLE')`, `settlementError('AR_SETTLEMENT_MIXED_CLIENTS')`, `settlementError('AR_SETTLEMENT_ALREADY_SETTLED')`, `settlementError('AR_SETTLEMENT_PARTIAL_NOT_ALLOWED')`, `settlementError('AR_SETTLEMENT_INVALID_AMOUNT')`, `settlementError('AR_SETTLEMENT_AMOUNT_EXCEEDS_PENDING')`, `settlementError('AR_SETTLEMENT_BANK_REQUIRED')`, `settlementError('AR_SETTLEMENT_INVALID_BANK')`, `settlementError('AR_SETTLEMENT_GUAYACAN_NOT_ALLOWED')`
- **Consumidores:** [account-receivable-payments.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts)


#### Clase `SettleAccountsReceivableUseCase` (L221–268)

- **Decoradores:** `@Injectable()`
- **Propósito:** Cancels one or several accounts of ONE client in a single PostgreSQL transaction (`settle_accounts_receivable`): pendings are computed there, never taken from Angular; cash payments enter the cash Kardex (one consolidated movement), bank deposits raise only the selected account. `clientRequestId` (one per modal opening) makes a double click or a retry return the same operation.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY) repository: AccountReceivableSettlementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 228–267 | `input: SettleAccountsReceivableInput` | `Promise<SettlementResult>` |

##### `SettleAccountsReceivableUseCase.execute`

- **Firma:** `execute(input: SettleAccountsReceivableInput): Promise<SettlementResult>` — [account-receivable-settlement.use-cases.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts#L228) (L228–267)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertSettlementRole`, `settlementError`, `this.repository.settle`, `input.items.map`, `round2`, `input.referenceNumber?.trim`, `input.observations?.trim`, `randomUUID`, `Promise.all`, `this.repository.findById`, `this.repository.getCashBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `settlementError('AR_SETTLEMENT_ITEMS_REQUIRED')`, `settlementError('AR_SETTLEMENT_BANK_REQUIRED')`, `settlementError('AR_SETTLEMENT_NOT_FOUND')`
- **Consumidores:** [account-receivable-payments.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts)


#### Clase `VoidAccountReceivableSettlementUseCase` (L276–304)

- **Decoradores:** `@Injectable()`
- **Propósito:** Voids a collection (admin, mandatory reason): the consolidated ABONO is deactivated (the accounts become pending again; a cash payment gets its Kardex ANULACION through the existing trigger) and a bank deposit is reversed with the bank ledger's own ANULACION. Nothing is deleted.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY) repository: AccountReceivableSettlementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 283–303 | `input: { id: string; reason: string; userId: string; role: string; }` | `Promise<SettlementResult>` |

##### `VoidAccountReceivableSettlementUseCase.execute`

- **Firma:** `execute(input: { id: string; reason: string; userId: string; role: string; }): Promise<SettlementResult>` — [account-receivable-settlement.use-cases.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts#L283) (L283–303)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertSettlementRole`, `input.reason?.trim`, `settlementError`, `this.repository.void`, `Promise.all`, `this.repository.findById`, `this.repository.getCashBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `settlementError('AR_SETTLEMENT_REASON_REQUIRED')`, `settlementError('AR_SETTLEMENT_NOT_FOUND')`
- **Consumidores:** [account-receivable-payments.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts)


#### Clase `ListAccountReceivableSettlementsUseCase` (L307–323)

- **Decoradores:** `@Injectable()`
- **Propósito:** History of collection operations (paginated, newest first).
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY) repository: AccountReceivableSettlementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 314–322 | `options: Partial<FindSettlementsOptions>` | `Promise<PaginatedSettlements>` |

##### `ListAccountReceivableSettlementsUseCase.execute`

- **Firma:** `execute(options: Partial<FindSettlementsOptions>): Promise<PaginatedSettlements>` — [account-receivable-settlement.use-cases.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts#L314) (L314–322)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findAll`, `Math.min`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [account-receivable-payments.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts)


#### Clase `GetAccountReceivableSettlementUseCase` (L326–340)

- **Decoradores:** `@Injectable()`
- **Propósito:** Detail of one (possibly multi-account) collection, with every account it covered.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY) repository: AccountReceivableSettlementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 333–339 | `id: string` | `Promise<SettlementWithDetails>` |

##### `GetAccountReceivableSettlementUseCase.execute`

- **Firma:** `execute(id: string): Promise<SettlementWithDetails>` — [account-receivable-settlement.use-cases.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts#L333) (L333–339)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findById`, `settlementError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `settlementError('AR_SETTLEMENT_NOT_FOUND')`
- **Consumidores:** [account-receivable-payments.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts)


#### Clase `GetChargePaymentHistoryUseCase` (L349–363)

- **Decoradores:** `@Injectable()`
- **Propósito:** Payment history of ONE account (each payment it received, voided ones included).
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY) repository: AccountReceivableSettlementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 356–362 | `chargeId: string` | `Promise<ChargePaymentHistory>` |

##### `GetChargePaymentHistoryUseCase.execute`

- **Firma:** `execute(chargeId: string): Promise<ChargePaymentHistory>` — [account-receivable-settlement.use-cases.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts#L356) (L356–362)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.repository.findChargeBalancesByIds`, `this.repository.findChargePayments`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [account-receivable-payments.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts)

#### Función `round2` (L19–21)

- **Tipo:** función local del archivo
- **Firma:** `round2(value: number): number` — [account-receivable-settlement.use-cases.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts#L19)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `assertSettlementRole` (L23–27)

- **Tipo:** función local del archivo
- **Firma:** `assertSettlementRole(role: string): void` — [account-receivable-settlement.use-cases.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts#L23)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `(SETTLEMENT_ROLES as readonly string[]).includes`, `settlementError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `settlementError('AR_SETTLEMENT_FORBIDDEN')`
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-create-account-receivable-use-case-ts"></a>

### create-account-receivable.use-case.ts

- **Ruta:** [create-account-receivable.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/create-account-receivable.use-case.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/create-account-receivable.use-case.ts`, 56 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Caso de uso: declara `CreateAccountReceivableUseCase`, `CreateAccountReceivableInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [referenced-client-invalid.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-referenced-client-invalid-error-ts), [account-receivable-output.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateAccountReceivableInput` (L15): sin documentación — miembros: `clientId`, `date`, `amount`, `description`, `createdBy`

#### Clase `CreateAccountReceivableUseCase` (L23–55)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_REPOSITORY) accountReceivableRepository: AccountReceivableRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 32–54 | `input: CreateAccountReceivableInput` | `Promise<AccountReceivableOutput>` |

##### `CreateAccountReceivableUseCase.execute`

- **Firma:** `execute(input: CreateAccountReceivableInput): Promise<AccountReceivableOutput>` — [create-account-receivable.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/create-account-receivable.use-case.ts#L32) (L32–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new ReferencedClientNotFoundError`, `new ReferencedClientInactiveError`, `input.description?.trim().replace`, `input.description?.trim`, `this.accountReceivableRepository.create`, `toAccountReceivableOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ReferencedClientNotFoundError()`, `new ReferencedClientInactiveError()`
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-deactivate-account-receivable-use-case-ts"></a>

### deactivate-account-receivable.use-case.ts

- **Ruta:** [deactivate-account-receivable.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/deactivate-account-receivable.use-case.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/deactivate-account-receivable.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Soft delete only — DELETE /accounts-receivable/:id never removes the row, preserving historial integrity.
- **Depende de (archivos del proyecto):** [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [account-receivable-not-found.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-account-receivable-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

#### Clase `DeactivateAccountReceivableUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — DELETE /accounts-receivable/:id never removes the row, preserving historial integrity.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_REPOSITORY) accountReceivableRepository: AccountReceivableRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<void>` |

##### `DeactivateAccountReceivableUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-account-receivable.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/deactivate-account-receivable.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.accountReceivableRepository.findById`, `new AccountReceivableNotFoundError`, `this.accountReceivableRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new AccountReceivableNotFoundError()`
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-active-balance-use-case-ts"></a>

### get-account-receivable-active-balance.use-case.ts

- **Ruta:** [get-account-receivable-active-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/get-account-receivable-active-balance.use-case.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/get-account-receivable-active-balance.use-case.ts`, 32 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Backs the plain list screen's "Saldo total" tile — always scoped to `isActive: true` only, independent of whatever search/date/client filters the list itself currently has applied (the user asked for the active-accounts total specifically, not a filtered one).
- **Depende de (archivos del proyecto):** [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

**Interfaces, tipos y enums:**

- `interface AccountReceivableActiveBalanceOutput` (L5): sin documentación — miembros: `totalAmount`, `recordCount`

#### Clase `GetAccountReceivableActiveBalanceUseCase` (L19–31)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the plain list screen's "Saldo total" tile — always scoped to `isActive: true` only, independent of whatever search/date/client filters the list itself currently has applied (the user asked for the active-accounts total specifically, not a filtered one). Reuses the same signed-sum `getReportSummary()` aggregate Cuadre de Agentes and Reportería already depend on — never a client-side sum over one fetched page, which would silently undercount whatever didn't fit the page.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_REPOSITORY) accountReceivableRepository: AccountReceivableRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 26–30 | — | `Promise<AccountReceivableActiveBalanceOutput>` |

##### `GetAccountReceivableActiveBalanceUseCase.execute`

- **Firma:** `execute(): Promise<AccountReceivableActiveBalanceOutput>` — [get-account-receivable-active-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/get-account-receivable-active-balance.use-case.ts#L26) (L26–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.accountReceivableRepository.getReportSummary`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-by-id-use-case-ts"></a>

### get-account-receivable-by-id.use-case.ts

- **Ruta:** [get-account-receivable-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/get-account-receivable-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/get-account-receivable-by-id.use-case.ts`, 25 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Caso de uso: declara `GetAccountReceivableByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [account-receivable-not-found.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-account-receivable-not-found-error-ts), [account-receivable-output.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

#### Clase `GetAccountReceivableByIdUseCase` (L10–24)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_REPOSITORY) accountReceivableRepository: AccountReceivableRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–23 | `id: string` | `Promise<AccountReceivableOutput>` |

##### `GetAccountReceivableByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<AccountReceivableOutput>` — [get-account-receivable-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/get-account-receivable-by-id.use-case.ts#L17) (L17–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.accountReceivableRepository.findById`, `new AccountReceivableNotFoundError`, `toAccountReceivableOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new AccountReceivableNotFoundError()`
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-current-balance-use-case-ts"></a>

### get-account-receivable-current-balance.use-case.ts

- **Ruta:** [get-account-receivable-current-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/get-account-receivable-current-balance.use-case.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/get-account-receivable-current-balance.use-case.ts`, 29 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Backs the client selector's "Saldo actual" display — a single bounded aggregate, never a full-history fetch.
- **Depende de (archivos del proyecto):** [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [referenced-client-invalid.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-referenced-client-invalid-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

#### Clase `GetAccountReceivableCurrentBalanceUseCase` (L9–28)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the client selector's "Saldo actual" display — a single bounded aggregate, never a full-history fetch.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_REPOSITORY) accountReceivableRepository: AccountReceivableRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 18–27 | `clientId: string` | `Promise<{ balance: number }>` |

##### `GetAccountReceivableCurrentBalanceUseCase.execute`

- **Firma:** `execute(clientId: string): Promise<{ balance: number }>` — [get-account-receivable-current-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/get-account-receivable-current-balance.use-case.ts#L18) (L18–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new ReferencedClientNotFoundError`, `this.accountReceivableRepository.getCurrentBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ReferencedClientNotFoundError()`
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-statement-use-case-ts"></a>

### get-account-receivable-statement.use-case.ts

- **Ruta:** [get-account-receivable-statement.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/get-account-receivable-statement.use-case.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/get-account-receivable-statement.use-case.ts`, 44 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Backs the "Estado de Cuenta" view — saldo inicial del periodo, movimientos con saldo corrido, totales.
- **Depende de (archivos del proyecto):** [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [referenced-client-invalid.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-referenced-client-invalid-error-ts), [account-receivable-statement-output.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-statement-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

**Interfaces, tipos y enums:**

- `interface GetAccountReceivableStatementInput` (L12): sin documentación — miembros: `clientId`, `dateFrom`, `dateTo`

#### Clase `GetAccountReceivableStatementUseCase` (L19–43)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the "Estado de Cuenta" view — saldo inicial del periodo, movimientos con saldo corrido, totales. Never iterates full history client-side; the repository derives everything with one bounded, window-function query.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_REPOSITORY) accountReceivableRepository: AccountReceivableRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 28–42 | `input: GetAccountReceivableStatementInput` | `Promise<AccountReceivableStatementOutput>` |

##### `GetAccountReceivableStatementUseCase.execute`

- **Firma:** `execute(input: GetAccountReceivableStatementInput): Promise<AccountReceivableStatementOutput>` — [get-account-receivable-statement.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/get-account-receivable-statement.use-case.ts#L28) (L28–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new ReferencedClientNotFoundError`, `this.accountReceivableRepository.getStatement`, `toAccountReceivableStatementOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ReferencedClientNotFoundError()`
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-list-accounts-receivable-use-case-ts"></a>

### list-accounts-receivable.use-case.ts

- **Ruta:** [list-accounts-receivable.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/list-accounts-receivable.use-case.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/list-accounts-receivable.use-case.ts`, 97 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Caso de uso: declara `ListAccountsReceivableUseCase`, `ListAccountsReceivableInput`, `ListAccountsReceivableOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [account-receivable-output.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-output-ts), [account-receivable-settlement.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-settlement-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [account-receivable-settlement.use-cases.spec.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-spec-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts), [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [get-assets-receivables-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-use-case-ts)

**Interfaces, tipos y enums:**

- `interface ListAccountsReceivableInput` (L15): sin documentación — miembros: `clientId`, `dateFrom`, `dateTo`, `minAmount`, `maxAmount`, `search`, `sortBy`, `sortDirection`, `page`, `limit`, `isActive`
- `interface ListAccountsReceivableOutput` (L30): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `ListAccountsReceivableUseCase` (L41–96)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_REPOSITORY) accountReceivableRepository: AccountReceivableRepository`, `@Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY) settlementRepository: AccountReceivableSettlementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 50–95 | `input?: ListAccountsReceivableInput` | `Promise<ListAccountsReceivableOutput>` |

##### `ListAccountsReceivableUseCase.execute`

- **Firma:** `execute(input?: ListAccountsReceivableInput): Promise<ListAccountsReceivableOutput>` — [list-accounts-receivable.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/list-accounts-receivable.use-case.ts#L50) (L50–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `this.accountReceivableRepository.findAll`, `input.search?.trim`, `new Set`, `result.items.map`, `new Map`, `(await this.settlementRepository.findChargeBalances(clientIds)).map`, `this.settlementRepository.findChargeBalances`, `balances.get`, `toAccountReceivableOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts), [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [get-assets-receivables-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-charge-use-case-ts"></a>

### register-account-receivable-charge.use-case.ts

- **Ruta:** [register-account-receivable-charge.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/register-account-receivable-charge.use-case.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/register-account-receivable-charge.use-case.ts`, 69 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** "Registrar Cargo" for Cuentas por Cobrar — an independent Kardex movement, never a rewrite of a prior one (see the migration's own doc comment for the full reasoning).
- **Depende de (archivos del proyecto):** [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [referenced-client-invalid.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-referenced-client-invalid-error-ts), [account-receivable-output.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-output-ts), [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts), [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts)

**Interfaces, tipos y enums:**

- `interface RegisterAccountReceivableChargeInput` (L16): sin documentación — miembros: `clientId`, `amount`, `date`, `description`, `createdBy`, `referenceType`, `referenceId`, `context`

#### Clase `RegisterAccountReceivableChargeUseCase` (L30–68)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Registrar Cargo" for Cuentas por Cobrar — an independent Kardex movement, never a rewrite of a prior one (see the migration's own doc comment for the full reasoning).
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_REPOSITORY) accountReceivableRepository: AccountReceivableRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 39–67 | `input: RegisterAccountReceivableChargeInput` | `Promise<AccountReceivableOutput>` |

##### `RegisterAccountReceivableChargeUseCase.execute`

- **Firma:** `execute(input: RegisterAccountReceivableChargeInput): Promise<AccountReceivableOutput>` — [register-account-receivable-charge.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/register-account-receivable-charge.use-case.ts#L39) (L39–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new ReferencedClientNotFoundError`, `new ReferencedClientInactiveError`, `input.description?.trim().replace`, `input.description?.trim`, `this.accountReceivableRepository.registerMovement`, `toAccountReceivableOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ReferencedClientNotFoundError()`, `new ReferencedClientInactiveError()`
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-payment-use-case-ts"></a>

### register-account-receivable-payment.use-case.ts

- **Ruta:** [register-account-receivable-payment.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/register-account-receivable-payment.use-case.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/register-account-receivable-payment.use-case.ts`, 66 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** "Registrar Abono" for Cuentas por Cobrar.
- **Depende de (archivos del proyecto):** [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [referenced-client-invalid.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-referenced-client-invalid-error-ts), [account-receivable-output.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

**Interfaces, tipos y enums:**

- `interface RegisterAccountReceivablePaymentInput` (L15): sin documentación — miembros: `clientId`, `amount`, `date`, `description`, `createdBy`

#### Clase `RegisterAccountReceivablePaymentUseCase` (L32–65)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Registrar Abono" for Cuentas por Cobrar. Does NOT pre-check the amount against the current balance here — `register_account_receivable_movement` itself computes the balance fresh inside a per-client advisory lock and rejects an over-payment atomically (`AbonoExceedsBalanceError`), which is what actually prevents two concurrent abonos from both succeeding incorrectly against the same pending balance. A TypeScript-side pre-check here would only create a TOCTOU gap, not close one.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_REPOSITORY) accountReceivableRepository: AccountReceivableRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 41–64 | `input: RegisterAccountReceivablePaymentInput` | `Promise<AccountReceivableOutput>` |

##### `RegisterAccountReceivablePaymentUseCase.execute`

- **Firma:** `execute(input: RegisterAccountReceivablePaymentInput): Promise<AccountReceivableOutput>` — [register-account-receivable-payment.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/register-account-receivable-payment.use-case.ts#L41) (L41–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new ReferencedClientNotFoundError`, `new ReferencedClientInactiveError`, `input.description?.trim().replace`, `input.description?.trim`, `this.accountReceivableRepository.registerMovement`, `toAccountReceivableOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ReferencedClientNotFoundError()`, `new ReferencedClientInactiveError()`
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-update-account-receivable-use-case-ts"></a>

### update-account-receivable.use-case.ts

- **Ruta:** [update-account-receivable.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/update-account-receivable.use-case.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/update-account-receivable.use-case.ts`, 68 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Caso de uso: declara `UpdateAccountReceivableUseCase`, `UpdateAccountReceivableInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [account-receivable-not-found.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-account-receivable-not-found-error-ts), [referenced-client-invalid.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-referenced-client-invalid-error-ts), [account-receivable-output.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateAccountReceivableInput` (L16): sin documentación — miembros: `clientId`, `date`, `amount`, `description`, `updatedBy`

#### Clase `UpdateAccountReceivableUseCase` (L24–67)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_REPOSITORY) accountReceivableRepository: AccountReceivableRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 33–66 | `id: string`, `input: UpdateAccountReceivableInput` | `Promise<AccountReceivableOutput>` |

##### `UpdateAccountReceivableUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateAccountReceivableInput): Promise<AccountReceivableOutput>` — [update-account-receivable.use-case.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/update-account-receivable.use-case.ts#L33) (L33–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.accountReceivableRepository.findById`, `new AccountReceivableNotFoundError`, `this.clientRepository.findById`, `new ReferencedClientNotFoundError`, `new ReferencedClientInactiveError`, `input.description?.trim().replace`, `input.description?.trim`, `this.accountReceivableRepository.update`, `toAccountReceivableOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.accountReceivableRepository.update`
- **Errores que lanza:** `new AccountReceivableNotFoundError()`, `new ReferencedClientNotFoundError()`, `new ReferencedClientInactiveError()`
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-domain-entities-account-receivable-entity-ts"></a>

### account-receivable.entity.ts

- **Ruta:** [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts`, 115 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** "Cuentas por Cobrar" — a client-linked Kardex/ledger of money the client owes: every row is a `CARGO` (adds to the balance) or `ABONO` (reduces it) movement, `amount` always a positive magnitude (see migration `CreateFinancialKardexColumns`).
- **Consumidores:** [account-receivable-output.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-output-ts), [account-receivable-statement-output.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-statement-output-ts), [account-receivable-settlement.use-cases.spec.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-spec-ts), [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [account-receivable.mapper.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-mapper-ts), [typeorm-account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts)

**Interfaces, tipos y enums:**

- `interface AccountReceivableProps` (L18): "Cuentas por Cobrar" — a client-linked Kardex/ledger of money the client owes: every row is a `CARGO` (adds to the balance) or `ABONO` (reduces it) movement, `amount` always a positive magnitude (see migration `CreateFinancialKardexColumns`). — miembros: `id`, `clientId`, `clientName`, `date`, `amount`, `movementType`, `sequence`, `description`, `referenceType`, `referenceId`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `type AccountReceivableMovementType` (L1) = `'CARGO' \| 'ABONO'`

#### Clase `AccountReceivable` (L40–114)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: AccountReceivableProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 43–45 | `props: AccountReceivableProps` | `AccountReceivable` |
| `id` | getter public | 47–49 | — | `string` |
| `clientId` | getter public | 51–53 | — | `string` |
| `clientName` | getter public | 55–57 | — | `string` |
| `date` | getter public | 59–61 | — | `string` |
| `amount` | getter public | 63–65 | — | `number` |
| `movementType` | getter public | 67–69 | — | `AccountReceivableMovementType` |
| `sequence` | getter public | 71–73 | — | `number` |
| `description` | getter public | 75–77 | — | `string \| null` |
| `referenceType` | getter public | 79–81 | — | `string \| null` |
| `referenceId` | getter public | 83–85 | — | `string \| null` |
| `isActive` | getter public | 87–89 | — | `boolean` |
| `createdAt` | getter public | 91–93 | — | `Date` |
| `updatedAt` | getter public | 95–97 | — | `Date` |
| `createdBy` | getter public | 99–101 | — | `string` |
| `createdByUsername` | getter public | 103–105 | — | `string` |
| `updatedBy` | getter public | 107–109 | — | `string \| null` |
| `updatedByUsername` | getter public | 111–113 | — | `string \| null` |

##### `AccountReceivable.create`

- **Firma:** `create(props: AccountReceivableProps): AccountReceivable` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new AccountReceivable`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [account-receivable.mapper.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-mapper-ts), [typeorm-account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts)

##### `AccountReceivable.id`

- **Firma:** `id(): string` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.clientId`

- **Firma:** `clientId(): string` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.clientName`

- **Firma:** `clientName(): string` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.date`

- **Firma:** `date(): string` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.amount`

- **Firma:** `amount(): number` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.movementType`

- **Firma:** `movementType(): AccountReceivableMovementType` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.sequence`

- **Firma:** `sequence(): number` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.description`

- **Firma:** `description(): string \| null` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.referenceType`

- **Firma:** `referenceType(): string \| null` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.referenceId`

- **Firma:** `referenceId(): string \| null` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.isActive`

- **Firma:** `isActive(): boolean` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L87) (L87–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.createdAt`

- **Firma:** `createdAt(): Date` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L91) (L91–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.updatedAt`

- **Firma:** `updatedAt(): Date` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.createdBy`

- **Firma:** `createdBy(): string` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L99) (L99–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.createdByUsername`

- **Firma:** `createdByUsername(): string` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L103) (L103–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L107) (L107–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivable.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [account-receivable.entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/entities/account-receivable.entity.ts#L111) (L111–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-abono-exceeds-balance-error-ts"></a>

### abono-exceeds-balance.error.ts

- **Ruta:** [abono-exceeds-balance.error.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/errors/abono-exceeds-balance.error.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/domain/errors/abono-exceeds-balance.error.ts`, 17 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Cuentas por Cobrar has never allowed a negative balance (its own `CHK_accounts_receivable_amount_positive` never lapsed, unlike Activos' — see `register_account_receivable_movement`'s own doc comment) — this preserves that existing rule exactly.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts)

#### Clase `AbonoExceedsBalanceError` (L10–16)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Cuentas por Cobrar has never allowed a negative balance (its own `CHK_accounts_receivable_amount_positive` never lapsed, unlike Activos' — see `register_account_receivable_movement`'s own doc comment) — this preserves that existing rule exactly. Activos has no equivalent error: its own `register_asset_movement` deliberately allows a negative balance.
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-account-receivable-not-found-error-ts"></a>

### account-receivable-not-found.error.ts

- **Ruta:** [account-receivable-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/errors/account-receivable-not-found.error.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/domain/errors/account-receivable-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Errores de dominio: declara `AccountReceivableNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-deactivate-account-receivable-use-case-ts), [get-account-receivable-by-id.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-by-id-use-case-ts), [update-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-update-account-receivable-use-case-ts)

#### Clase `AccountReceivableNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-account-receivable-settlement-errors-ts"></a>

### account-receivable-settlement.errors.ts

- **Ruta:** [account-receivable-settlement.errors.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/errors/account-receivable-settlement.errors.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/domain/errors/account-receivable-settlement.errors.ts`, 141 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Business-rule violation of the "Cancelar cuenta(s) por cobrar" feature.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [account-receivable-settlement.use-cases.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts), [typeorm-account-receivable-settlement.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-settlement-repository-ts), [typeorm-account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts)

#### Clase `AccountReceivableSettlementError` (L9–17)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Business-rule violation of the "Cancelar cuenta(s) por cobrar" feature. One class with the stable `code` the SQL functions `RAISE` (same pattern as `CashControlRuleError`): the rules live in PostgreSQL, this only carries their user-facing message and HTTP status.
- **Dependencias inyectadas (constructor):** `code: string`, `message: string`, `status: number`
#### Función `settlementError` (L121–132)

- **Tipo:** función exportada
- **Firma:** `settlementError(code: string): AccountReceivableSettlementError` — [account-receivable-settlement.errors.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/errors/account-receivable-settlement.errors.ts#L121)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new AccountReceivableSettlementError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [account-receivable-settlement.use-cases.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts)

#### Función `settlementErrorFromMessage` (L135–140)

- **Tipo:** función exportada
- **Firma:** `settlementErrorFromMessage(message: string): AccountReceivableSettlementError \| null` — [account-receivable-settlement.errors.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/errors/account-receivable-settlement.errors.ts#L135)
- **Propósito / descripción:** `RAISE EXCEPTION '&lt;CODE&gt;'` from the settlement SQL → domain error; `null` if it is not one of them.
- **Dependencias:** `message.split`, `settlementError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-account-receivable-settlement.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-settlement-repository-ts), [typeorm-account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-invalid-movement-error-ts"></a>

### invalid-movement.error.ts

- **Ruta:** [invalid-movement.error.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/errors/invalid-movement.error.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/domain/errors/invalid-movement.error.ts`, 19 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Defensive only — `RegisterMovementRequestDto` already validates `movementType`/`amount` before this ever reaches SQL; these translate `register_account_receivable_movement`'s own guard rails should that validation ever be bypassed.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts)

#### Clase `InvalidMovementTypeError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Defensive only — `RegisterMovementRequestDto` already validates `movementType`/`amount` before this ever reaches SQL; these translate `register_account_receivable_movement`'s own guard rails should that validation ever be bypassed.

#### Clase `InvalidMovementAmountError` (L12–18)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-referenced-client-invalid-error-ts"></a>

### referenced-client-invalid.error.ts

- **Ruta:** [referenced-client-invalid.error.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/errors/referenced-client-invalid.error.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/domain/errors/referenced-client-invalid.error.ts`, 18 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Errores de dominio: declara `ReferencedClientNotFoundError`, `ReferencedClientInactiveError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-create-account-receivable-use-case-ts), [get-account-receivable-current-balance.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-current-balance-use-case-ts), [get-account-receivable-statement.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-statement-use-case-ts), [register-account-receivable-charge.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-charge-use-case-ts), [register-account-receivable-payment.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-payment-use-case-ts), [update-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-update-account-receivable-use-case-ts)

#### Clase `ReferencedClientNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ReferencedClientInactiveError` (L11–17)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-settlement-repository-ts"></a>

### account-receivable-settlement.repository.ts

- **Ruta:** [account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/repositories/account-receivable-settlement.repository.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/domain/repositories/account-receivable-settlement.repository.ts`, 162 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** One CARGO with its pending amount, computed by `ar_charge_balances` in PostgreSQL: amount − payments allocated to it − its FIFO share of the client's general (unallocated) abonos.
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [account-receivable-output.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-output-ts), [account-receivable-settlement.use-cases.spec.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-spec-ts), [account-receivable-settlement.use-cases.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts), [list-accounts-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-list-accounts-receivable-use-case-ts), [typeorm-account-receivable-settlement.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-settlement-repository-ts), [account-receivable-settlement.request.dto.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-account-receivable-settlement-request-dto-ts)

**Interfaces, tipos y enums:**

- `interface ChargeBalance` (L23): One CARGO with its pending amount, computed by `ar_charge_balances` in PostgreSQL: amount − payments allocated to it − its FIFO share of the client's general (unallocated) abonos. — miembros: `id`, `clientId`, `clientName`, `date`, `description`, `originalAmount`, `paidAmount`, `pendingAmount`, `status`, `createdAt`
- `interface SettlementItemData` (L37): sin documentación — miembros: `accountReceivableId`, `amount`
- `interface SettleAccountsReceivableData` (L43): sin documentación — miembros: `clientId`, `items`, `paymentMethod`, `bankId`, `referenceNumber`, `observations`, `expectedTotal`, `userId`, `idempotencyKey`
- `interface SettlementDetailRow` (L56): sin documentación — miembros: `id`, `accountReceivableId`, `accountDate`, `accountDescription`, `accountOriginalAmount`, `amountPaid`, `previousBalance`, `newBalance`
- `interface SettlementRow` (L67): sin documentación — miembros: `id`, `clientId`, `clientName`, `paymentMethod`, `bankId`, `bankName`, `bankAccountNumber`, `referenceNumber`, `totalAmount`, `accountsCount`, `status`, `observations`, `abonoId`, `cashMovementId`, `cashBalanceAfter`, `bankMovementId`, `bankBalanceAfter`, `operationalDate`, `cutPeriodNumber`, `createdBy`, `createdByUsername`, `createdAt`, `voidedAt`, `voidedByUsername`, `voidReason`
- `interface SettlementWithDetails` (L97) extends SettlementRow: sin documentación — miembros: `details`
- `interface ChargePaymentRow` (L102): One payment applied to one account — the account's own payment history. — miembros: `operationId`, `amountPaid`, `previousBalance`, `newBalance`, `paymentMethod`, `bankName`, `referenceNumber`, `status`, `accountsCount`, `createdByUsername`, `createdAt`, `observations`
- `interface FindSettlementsOptions` (L117): sin documentación — miembros: `clientId`, `status`, `paymentMethod`, `dateFrom`, `dateTo`, `page`, `limit`
- `interface PaginatedSettlements` (L127): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface SettlementBankInfo` (L134): sin documentación — miembros: `id`, `name`, `accountNumber`, `isActive`, `specialAccount`, `balance`
- `interface AccountReceivableSettlementRepository` (L149): Persistence port of the "Cancelar cuenta(s) por cobrar" feature. — miembros: `findChargeBalances`, `findChargeBalancesByIds`, `settle`, `void`, `findById`, `findAll`, `findChargePayments`, `getCashBalance`, `findBank`, `findClientName`
- `type SettlementPaymentMethod` (L10) = `(typeof SETTLEMENT_PAYMENT_METHODS)[number]`
- `type SettlementStatus` (L13) = `'APLICADO' \| 'ANULADO'`
- `type ChargePaymentStatus` (L16) = `'PENDIENTE' \| 'PARCIAL' \| 'CANCELADA'` — Collection state of one CARGO, derived from its pending amount (never stored).

**Constantes exportadas:**

- `ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY` (L1) = `Symbol( 'ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY', )`
- `SETTLEMENT_PAYMENT_METHODS` (L6): How the client paid: physical cash (enters the cash Kardex) or a deposit into a registered bank account. = `[ 'EFECTIVO', 'DEPOSITO_BANCARIO', ] as const`
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts"></a>

### account-receivable.repository.ts

- **Ruta:** [account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/repositories/account-receivable.repository.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/domain/repositories/account-receivable.repository.ts`, 136 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `FindAccountsReceivableOptions`, `PaginatedResult`, `FindAccountsReceivableReportSummaryOptions`, `AccountsReceivableReportSummary`, `CreateAccountReceivableData` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-receivable.entity.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-entities-account-receivable-entity-ts), [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts)
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [account-receivable-statement-output.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-dtos-account-receivable-statement-output-ts), [account-receivable-settlement.use-cases.spec.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-spec-ts), [create-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-create-account-receivable-use-case-ts), [deactivate-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-deactivate-account-receivable-use-case-ts), [get-account-receivable-active-balance.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-active-balance-use-case-ts), [get-account-receivable-by-id.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-by-id-use-case-ts), [get-account-receivable-current-balance.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-current-balance-use-case-ts), [get-account-receivable-statement.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-statement-use-case-ts), [list-accounts-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-list-accounts-receivable-use-case-ts), [register-account-receivable-charge.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-charge-use-case-ts), [register-account-receivable-payment.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-payment-use-case-ts), [update-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-update-account-receivable-use-case-ts), [typeorm-account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts), [list-accounts-receivable.query.dto.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-list-accounts-receivable-query-dto-ts) y 3 más

**Interfaces, tipos y enums:**

- `interface FindAccountsReceivableOptions` (L14): sin documentación — miembros: `isActive`, `clientId`, `dateFrom`, `dateTo`, `minAmount`, `maxAmount`, `search`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface PaginatedResult` (L29): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface FindAccountsReceivableReportSummaryOptions` (L36): sin documentación — miembros: `isActive`, `clientId`, `dateFrom`, `dateTo`, `search`
- `interface AccountsReceivableReportSummary` (L44): sin documentación — miembros: `recordCount`, `totalAmount`
- `interface CreateAccountReceivableData` (L49): sin documentación — miembros: `clientId`, `date`, `amount`, `description`, `createdBy`
- `interface UpdateAccountReceivableData` (L57): sin documentación — miembros: `clientId`, `date`, `amount`, `description`, `updatedBy`
- `interface RegisterAccountReceivableMovementData` (L66): One Kardex movement, backing the "Registrar Cargo"/"Registrar Abono" flow — invokes `register_account_receivable_movement`. — miembros: `clientId`, `movementType`, `amount`, `date`, `description`, `createdBy`, `referenceType`, `referenceId`
- `interface StatementMovement` (L78): sin documentación — miembros: `id`, `date`, `movementType`, `description`, `amount`, `balanceAfter`, `createdByUsername`, `createdAt`
- `interface GetAccountReceivableStatementOptions` (L90): sin documentación — miembros: `dateFrom`, `dateTo`
- `interface AccountReceivableStatement` (L96): sin documentación — miembros: `clientId`, `clientName`, `openingBalance`, `movements`, `totalCargos`, `totalAbonos`, `closingBalance`
- `interface AccountReceivableRepository` (L107): sin documentación — miembros: `findAll`, `getReportSummary`, `findById`, `create`, `update`, `deactivate`, `registerMovement`, `getCurrentBalance`, `getStatement`
- `type AccountReceivableSortField` (L11) = `'date' \| 'amount' \| 'createdAt'`
- `type SortDirection` (L12) = `'asc' \| 'desc'`

**Constantes exportadas:**

- `ACCOUNT_RECEIVABLE_REPOSITORY` (L7) = `Symbol( 'ACCOUNT_RECEIVABLE_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-mapper-ts"></a>

### account-receivable.mapper.ts

- **Ruta:** [account-receivable.mapper.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/account-receivable.mapper.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/account-receivable.mapper.ts`, 27 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Mapper: declara `AccountReceivableMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-receivable.entity.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-entities-account-receivable-entity-ts), [account-receivable.orm-entity.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-orm-entity-ts)
- **Consumidores:** [typeorm-account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts)

#### Clase `AccountReceivableMapper` (L4–26)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–25 | `orm: AccountReceivableOrmEntity` | `AccountReceivable` |

##### `AccountReceivableMapper.toDomain`

- **Firma:** `toDomain(orm: AccountReceivableOrmEntity): AccountReceivable` — [account-receivable.mapper.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/account-receivable.mapper.ts#L5) (L5–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `AccountReceivable.create`, `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-orm-entity-ts"></a>

### account-receivable.orm-entity.ts

- **Ruta:** [account-receivable.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/account-receivable.orm-entity.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/account-receivable.orm-entity.ts`, 87 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `AccountReceivableOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [client.orm-entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-orm-entity-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [account-receivable.mapper.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-mapper-ts), [typeorm-account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts)

#### Clase `AccountReceivableOrmEntity` (L14–86)

- **Decoradores:** `@Entity('accounts_receivable')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column clientId: string`, `@ManyToOne client: ClientOrmEntity`, `@Column date: string`, `@Column amount: number`, `@Column description: string \| null`, `@Column referenceType: string \| null`, `@Column referenceId: string \| null`, `@Column isActive: boolean`, `@Column movementType: 'CARGO' \| 'ABONO'`, `@Column sequence: string`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-settlement-repository-ts"></a>

### typeorm-account-receivable-settlement.repository.ts

- **Ruta:** [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts`, 357 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Raw-SQL adapter of the settlement port.
- **Depende de (archivos del proyecto):** [account-receivable-settlement.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-settlement-repository-ts), [account-receivable-settlement.errors.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-account-receivable-settlement-errors-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts)

**Interfaces, tipos y enums:**

- `type SqlRow` (L22) = `Record<string, unknown>`

#### Clase `TypeOrmAccountReceivableSettlementRepository` (L141–356)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements AccountReceivableSettlementRepository
- **Propósito:** Raw-SQL adapter of the settlement port. Every write is a single call to a PostgreSQL function (one transaction, all-or-nothing); their `RAISE EXCEPTION '&lt;CODE&gt;'` messages become domain errors here — settlement rules first, then the bank account's own rules (`apply_bank_account_movement`).
- **Dependencias inyectadas (constructor):** `@InjectDataSource() dataSource: DataSource`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `write` | método private async | 145–159 | `sql: string`, `params: unknown[]` | `Promise<T>` |
| `findChargeBalances` | método public async | 161–170 | `clientIds: string[]` | `Promise<ChargeBalance[]>` |
| `findChargeBalancesByIds` | método public async | 172–185 | `ids: string[]` | `Promise<ChargeBalance[]>` |
| `settle` | método public async | 187–207 | `data: SettleAccountsReceivableData` | `Promise<string>` |
| `void` | método public async | 209–219 | `operationId: string`, `userId: string`, `reason: string` | `Promise<void>` |
| `findById` | método public async | 221–251 | `id: string` | `Promise<SettlementWithDetails \| null>` |
| `findAll` | método public async | 253–293 | `options: FindSettlementsOptions` | `Promise<PaginatedSettlements>` |
| `findChargePayments` | método public async | 295–322 | `chargeId: string` | `Promise<ChargePaymentRow[]>` |
| `getCashBalance` | método public async | 324–329 | — | `Promise<number>` |
| `findBank` | método public async | 331–347 | `id: string` | `Promise<SettlementBankInfo \| null>` |
| `findClientName` | método public async | 349–355 | `id: string` | `Promise<string \| null>` |

##### `TypeOrmAccountReceivableSettlementRepository.write`

- **Firma:** `write(sql: string, params: unknown[]): Promise<T>` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L145) (L145–159)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `settlementErrorFromMessage`, `bankMovementErrorFromMessage`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `mapped`, `error`
- **Consumidores:** (mismo archivo)

##### `TypeOrmAccountReceivableSettlementRepository.findChargeBalances`

- **Firma:** `findChargeBalances(clientIds: string[]): Promise<ChargeBalance[]>` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L161) (L161–170)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `rows.map`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableSettlementRepository.findChargeBalancesByIds`

- **Firma:** `findChargeBalancesByIds(ids: string[]): Promise<ChargeBalance[]>` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L172) (L172–185)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `clients.map`, `str`, `rows.map`
- **Efectos secundarios:** Tablas en su SQL: `accounts_receivable`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableSettlementRepository.settle`

- **Firma:** `settle(data: SettleAccountsReceivableData): Promise<string>` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L187) (L187–207)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `data.items.map`, `this.write`, `JSON.stringify`, `str`
- **Efectos secundarios:** Llama funciones SQL: `settle_accounts_receivable`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableSettlementRepository.void`

- **Firma:** `void(operationId: string, userId: string, reason: string): Promise<void>` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L209) (L209–219)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.write`
- **Efectos secundarios:** Llama funciones SQL: `void_account_receivable_payment`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableSettlementRepository.findById`

- **Firma:** `findById(id: string): Promise<SettlementWithDetails \| null>` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L221) (L221–251)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `toSettlement`, `details.map`, `str`, `strOrNull`, `num`
- **Efectos secundarios:** Tablas en su SQL: `account_receivable_payment_details`, `accounts_receivable`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableSettlementRepository.findAll`

- **Firma:** `findAll(options: FindSettlementsOptions): Promise<PaginatedSettlements>` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L253) (L253–293)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `params.push`, `where.push`, `sql.replace`, `add`, `where.join`, `this.dataSource.query`, `rows.map`, `num`
- **Efectos secundarios:** Tablas en su SQL: `account_receivable_payment_operations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableSettlementRepository.findChargePayments`

- **Firma:** `findChargePayments(chargeId: string): Promise<ChargePaymentRow[]>` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L295) (L295–322)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `rows.map`, `str`, `num`, `strOrNull`
- **Efectos secundarios:** Tablas en su SQL: `account_receivable_payment_details`, `account_receivable_payment_operations`, `users`, `banks`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableSettlementRepository.getCashBalance`

- **Firma:** `getCashBalance(): Promise<number>` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L324) (L324–329)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `num`
- **Efectos secundarios:** Llama funciones SQL: `cash_balance`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableSettlementRepository.findBank`

- **Firma:** `findBank(id: string): Promise<SettlementBankInfo \| null>` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L331) (L331–347)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `str`, `strOrNull`, `num`
- **Efectos secundarios:** Tablas en su SQL: `banks`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableSettlementRepository.findClientName`

- **Firma:** `findClientName(id: string): Promise<string \| null>` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L349) (L349–355)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `str`
- **Efectos secundarios:** Tablas en su SQL: `clients`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

#### Función `str` (L24–38)

- **Tipo:** función local del archivo
- **Firma:** `str(value: unknown): string` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L24)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `value.toString`, `value.toISOString`, `JSON.stringify`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `strOrNull` (L40–42)

- **Tipo:** función local del archivo
- **Firma:** `strOrNull(value: unknown): string \| null` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L40)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `str`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `num` (L44–46)

- **Tipo:** función local del archivo
- **Firma:** `num(value: unknown): number` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L44)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `numOrNull` (L48–50)

- **Tipo:** función local del archivo
- **Firma:** `numOrNull(value: unknown): number \| null` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L48)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `chargeStatus` (L53–61)

- **Tipo:** función exportada
- **Firma:** `chargeStatus(original: number, pending: number): ChargePaymentStatus` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L53)
- **Propósito / descripción:** Pending 0 = cancelled; below the original amount = partially paid.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `toCharge` (L88–103)

- **Tipo:** función local del archivo
- **Firma:** `toCharge(row: SqlRow): ChargeBalance` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L88)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `num`, `str`, `strOrNull`, `chargeStatus`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toSettlement` (L105–133)

- **Tipo:** función local del archivo
- **Firma:** `toSettlement(row: SqlRow): SettlementRow` — [typeorm-account-receivable-settlement.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts#L105)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `str`, `strOrNull`, `num`, `numOrNull`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-typeorm-account-receivable-repository-ts"></a>

### typeorm-account-receivable.repository.ts

- **Ruta:** [typeorm-account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts`, 381 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmAccountReceivableRepository`, `SORT_COLUMN` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-receivable.entity.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-entities-account-receivable-entity-ts), [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts), [abono-exceeds-balance.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-abono-exceeds-balance-error-ts), [invalid-movement.error.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-invalid-movement-error-ts), [account-receivable.orm-entity.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-orm-entity-ts), [account-receivable-settlement.errors.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-errors-account-receivable-settlement-errors-ts), [account-receivable.mapper.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts)

#### Clase `TypeOrmAccountReceivableRepository` (L35–380)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements AccountReceivableRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(AccountReceivableOrmEntity) repository: Repository<AccountReceivableOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 42–99 | `options: FindAccountsReceivableOptions` | `Promise<PaginatedResult<AccountReceivable>>` |
| `getReportSummary` | método public async | 102–152 | `options: FindAccountsReceivableReportSummaryOptions` | `Promise<AccountsReceivableReportSummary>` |
| `findById` | método public async | 154–163 | `id: string`, `context?: TransactionContext` | `Promise<AccountReceivable \| null>` |
| `getManager` | método private | 166–168 | `context?: TransactionContext` | `EntityManager` |
| `create` | método public async | 170–177 | `data: CreateAccountReceivableData` | `Promise<AccountReceivable>` |
| `update` | método public async | 179–186 | `id: string`, `data: UpdateAccountReceivableData` | `Promise<AccountReceivable>` |
| `deactivate` | método public async | 188–192 | `id: string` | `Promise<void>` |
| `guardPaymentRules` | método private async | 199–211 | `write: () => Promise<T>` | `Promise<T>` |
| `registerMovement` | método public async | 214–248 | `data: RegisterAccountReceivableMovementData`, `context?: TransactionContext` | `Promise<AccountReceivable>` |
| `getCurrentBalance` | método public async | 251–259 | `clientId: string` | `Promise<number>` |
| `getStatement` | método public async | 269–356 | `clientId: string`, `options: GetAccountReceivableStatementOptions` | `Promise<AccountReceivableStatement>` |
| `translateMovementError` | método private | 359–379 | `error: unknown` | `unknown` |

##### `TypeOrmAccountReceivableRepository.findAll`

- **Firma:** `findAll(options: FindAccountsReceivableOptions): Promise<PaginatedResult<AccountReceivable>>` — [typeorm-account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts#L42) (L42–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('record').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `orms.map`, `AccountReceivableMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableRepository.getReportSummary`

- **Firma:** `getReportSummary(options: FindAccountsReceivableReportSummaryOptions): Promise<AccountsReceivableReportSummary>` — [typeorm-account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts#L102) (L102–152)
- **Propósito / descripción:** A real SQL aggregate — never an in-memory sum over one fetched page, which would silently undercount whatever didn't fit the page (see Reports' own `getSummary()` lesson for Sales/Purchases).
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('record').leftJoin`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.select('COUNT(*)', 'recordCount').addSelect`, `qb.select`, `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableRepository.findById`

- **Firma:** `findById(id: string, context?: TransactionContext): Promise<AccountReceivable \| null>` — [typeorm-account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts#L154) (L154–163)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getManager(context).findOne`, `this.getManager`, `AccountReceivableMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmAccountReceivableRepository.getManager`

- **Firma:** `getManager(context?: TransactionContext): EntityManager` — [typeorm-account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts#L166) (L166–168)
- **Propósito / descripción:** Resolves the connection to use for a call: the shared transactional `EntityManager` when a `TransactionContext` was passed in, or this repository's own default connection otherwise — every caller that doesn't pass one gets byte-identical behavior to before this parameter existed.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmAccountReceivableRepository.create`

- **Firma:** `create(data: CreateAccountReceivableData): Promise<AccountReceivable>` — [typeorm-account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts#L170) (L170–177)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `AccountReceivableMapper.toDomain`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableRepository.update`

- **Firma:** `update(id: string, data: UpdateAccountReceivableData): Promise<AccountReceivable>` — [typeorm-account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts#L179) (L179–186)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.guardPaymentRules`, `this.repository.update`, `this.repository.findOneOrFail`, `AccountReceivableMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts#L188) (L188–192)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.guardPaymentRules`, `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableRepository.guardPaymentRules`

- **Firma:** `guardPaymentRules(write: () => Promise<T>): Promise<T>` — [typeorm-account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts#L199) (L199–211)
- **Propósito / descripción:** `trg_ar_payment_guard` rejects editing/deactivating the ABONO of a collection operation or a CARGO that already received payments — turned into its 409 domain error here instead of a raw 500.
- **Dependencias (llamadas en su cuerpo):** `write`, `settlementErrorFromMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `mapped`, `error`
- **Consumidores:** (mismo archivo)

##### `TypeOrmAccountReceivableRepository.registerMovement`

- **Firma:** `registerMovement(data: RegisterAccountReceivableMovementData, context?: TransactionContext): Promise<AccountReceivable>` — [typeorm-account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts#L214) (L214–248)
- **Propósito / descripción:** Invokes `register_account_receivable_movement` — see that function's own doc comment (migration `CreateFinancialKardexColumns`) for the `ABONO_EXCEEDS_BALANCE` rule this table enforces, unlike Activos.
- **Dependencias (llamadas en su cuerpo):** `this.getManager`, `manager.query`, `this.translateMovementError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `register_account_receivable_movement`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateMovementError(error)`, `new InternalServerErrorException( 'No se pudo recuperar el movimiento recién registrado.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableRepository.getCurrentBalance`

- **Firma:** `getCurrentBalance(clientId: string): Promise<number>` — [typeorm-account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts#L251) (L251–259)
- **Propósito / descripción:** A single bounded aggregate — never a full-history fetch summed in TypeScript.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `Number`
- **Efectos secundarios:** Tablas en su SQL: `accounts_receivable`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableRepository.getStatement`

- **Firma:** `getStatement(clientId: string, options: GetAccountReceivableStatementOptions): Promise<AccountReceivableStatement>` — [typeorm-account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts#L269) (L269–356)
- **Propósito / descripción:** `openingBalance` is the signed sum of every active movement strictly before `dateFrom` (0 when `dateFrom` is omitted — the WHERE clause then matches no rows). `balanceAfter` per row is computed with a window function over `sequence` seeded with that opening balance — never stored, always derived fresh (see the migration's own doc comment for why), and never summed client-side.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `Number`, `rows.map`, `movements.filter((m) => m.movementType === 'CARGO').reduce`, `movements.filter`, `movements.filter((m) => m.movementType === 'ABONO').reduce`
- **Efectos secundarios:** Tablas en su SQL: `clients`, `accounts_receivable`, `users`, `movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAccountReceivableRepository.translateMovementError`

- **Firma:** `translateMovementError(error: unknown): unknown` — [typeorm-account-receivable.repository.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable.repository.ts#L359) (L359–379)
- **Propósito / descripción:** `register_account_receivable_movement` signals a business-rule failure via `RAISE EXCEPTION '&lt;CODE&gt;:&lt;clientId&gt;'` — same `'CODE:id'` convention as `translateSaleError`/`translatePurchaseError` elsewhere in this codebase.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new InvalidMovementTypeError`, `new InvalidMovementAmountError`, `new AbonoExceedsBalanceError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts"></a>

### account-receivable-payments.controller.ts

- **Ruta:** [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts`, 113 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Cuentas por Cobrar → "Cancelar cuenta(s)" (cash or bank deposit, one or several accounts of the same client) and its payment history.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [account-receivable-settlement.use-cases.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-account-receivable-settlement-use-cases-ts), [account-receivable-settlement.request.dto.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-account-receivable-settlement-request-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts)

#### Clase `AccountReceivablePaymentsController` (L42–112)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('account-receivable-payments')`
- **Propósito:** Cuentas por Cobrar → "Cancelar cuenta(s)" (cash or bank deposit, one or several accounts of the same client) and its payment history. Its own base path so no route can be swallowed by `GET /accounts-receivable/:id`. Reads: any authenticated account (same as the list/statement). Collect and void: ADMIN/SUPER_ADMIN — the same policy as "Registrar Abono"; the use cases re-check the role.
- **Dependencias inyectadas (constructor):** `getPendingUseCase: GetClientPendingChargesUseCase`, `previewUseCase: PreviewAccountReceivableSettlementUseCase`, `settleUseCase: SettleAccountsReceivableUseCase`, `voidUseCase: VoidAccountReceivableSettlementUseCase`, `listUseCase: ListAccountReceivableSettlementsUseCase`, `getUseCase: GetAccountReceivableSettlementUseCase`, `chargeHistoryUseCase: GetChargePaymentHistoryUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `list` | método public | 55–58 | `query: ListSettlementsQueryDto` | (inferido) |
| `pending` | método public | 60–63 | `clientId: string` | (inferido) |
| `chargeHistory` | método public | 65–68 | `chargeId: string` | (inferido) |
| `preview` | método public | 70–74 | `dto: PreviewSettlementRequestDto` | (inferido) |
| `settle` | método public | 76–89 | `dto: SettleAccountsReceivableRequestDto`, `user: RequestUser` | (inferido) |
| `findOne` | método public | 91–94 | `id: string` | (inferido) |
| `void` | método public | 96–111 | `id: string`, `dto: VoidSettlementRequestDto`, `user: RequestUser` | (inferido) |

##### `AccountReceivablePaymentsController.list`

- **Firma:** `list(query: ListSettlementsQueryDto)` — [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L55) (L55–58)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivablePaymentsController.pending`

- **Firma:** `pending(clientId: string)` — [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L60) (L60–63)
- **Decoradores:** `@Get('clients/:clientId/pending')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('clientId', ParseUUIDPipe) clientId`
- **Dependencias (llamadas en su cuerpo):** `this.getPendingUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivablePaymentsController.chargeHistory`

- **Firma:** `chargeHistory(chargeId: string)` — [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L65) (L65–68)
- **Decoradores:** `@Get('charges/:chargeId')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('chargeId', ParseUUIDPipe) chargeId`
- **Dependencias (llamadas en su cuerpo):** `this.chargeHistoryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivablePaymentsController.preview`

- **Firma:** `preview(dto: PreviewSettlementRequestDto)` — [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L70) (L70–74)
- **Decoradores:** `@Post('preview')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.previewUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivablePaymentsController.settle`

- **Firma:** `settle(dto: SettleAccountsReceivableRequestDto, user: RequestUser)` — [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L76) (L76–89)
- **Decoradores:** `@Post()` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.settleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivablePaymentsController.findOne`

- **Firma:** `findOne(id: string)` — [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L91) (L91–94)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivablePaymentsController.void`

- **Firma:** `void(id: string, dto: VoidSettlementRequestDto, user: RequestUser)` — [account-receivable-payments.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts#L96) (L96–111)
- **Decoradores:** `@Post(':id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.voidUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts"></a>

### accounts-receivable.controller.ts

- **Ruta:** [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts`, 171 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Create/update/deactivate are admin-only — same policy as Products/Clients.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-create-account-receivable-use-case-ts), [list-accounts-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-list-accounts-receivable-use-case-ts), [get-account-receivable-by-id.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-by-id-use-case-ts), [update-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-update-account-receivable-use-case-ts), [deactivate-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-deactivate-account-receivable-use-case-ts), [register-account-receivable-charge.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-charge-use-case-ts), [register-account-receivable-payment.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-payment-use-case-ts), [get-account-receivable-statement.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-statement-use-case-ts), [get-account-receivable-current-balance.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-current-balance-use-case-ts), [get-account-receivable-active-balance.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-active-balance-use-case-ts), [create-account-receivable.request.dto.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-create-account-receivable-request-dto-ts) y 6 más
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts)

#### Clase `AccountsReceivableController` (L45–170)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('accounts-receivable')`
- **Propósito:** Create/update/deactivate are admin-only — same policy as Products/Clients. Any authenticated role can list/consult.
- **Dependencias inyectadas (constructor):** `createAccountReceivableUseCase: CreateAccountReceivableUseCase`, `listAccountsReceivableUseCase: ListAccountsReceivableUseCase`, `getAccountReceivableByIdUseCase: GetAccountReceivableByIdUseCase`, `updateAccountReceivableUseCase: UpdateAccountReceivableUseCase`, `deactivateAccountReceivableUseCase: DeactivateAccountReceivableUseCase`, `registerAccountReceivableChargeUseCase: RegisterAccountReceivableChargeUseCase`, `registerAccountReceivablePaymentUseCase: RegisterAccountReceivablePaymentUseCase`, `getAccountReceivableStatementUseCase: GetAccountReceivableStatementUseCase`, `getAccountReceivableCurrentBalanceUseCase: GetAccountReceivableCurrentBalanceUseCase`, `getAccountReceivableActiveBalanceUseCase: GetAccountReceivableActiveBalanceUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 61–73 | `dto: CreateAccountReceivableRequestDto`, `userId: string` | `Promise<AccountReceivableResponseDto>` |
| `findAll` | método public | 75–80 | `query: ListAccountsReceivableQueryDto` | `Promise<PaginatedAccountsReceivableResponseDto>` |
| `getActiveBalanceSummary` | método public | 83–86 | — | `Promise<ActiveBalanceSummaryResponseDto>` |
| `findOne` | método public | 88–93 | `id: string` | `Promise<AccountReceivableResponseDto>` |
| `update` | método public | 95–107 | `id: string`, `dto: UpdateAccountReceivableRequestDto`, `userId: string` | `Promise<AccountReceivableResponseDto>` |
| `deactivate` | método public | 109–115 | `id: string` | `Promise<void>` |
| `registerCharge` | método public | 118–132 | `clientId: string`, `dto: RegisterMovementRequestDto`, `userId: string` | `Promise<AccountReceivableResponseDto>` |
| `registerPayment` | método public | 135–149 | `clientId: string`, `dto: RegisterMovementRequestDto`, `userId: string` | `Promise<AccountReceivableResponseDto>` |
| `getStatement` | método public | 152–161 | `clientId: string`, `query: GetStatementQueryDto` | `Promise<AccountReceivableStatementResponseDto>` |
| `getCurrentBalance` | método public | 164–169 | `clientId: string` | `Promise<CurrentBalanceResponseDto>` |

##### `AccountsReceivableController.create`

- **Firma:** `create(dto: CreateAccountReceivableRequestDto, userId: string): Promise<AccountReceivableResponseDto>` — [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L61) (L61–73)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createAccountReceivableUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountsReceivableController.findAll`

- **Firma:** `findAll(query: ListAccountsReceivableQueryDto): Promise<PaginatedAccountsReceivableResponseDto>` — [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L75) (L75–80)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listAccountsReceivableUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountsReceivableController.getActiveBalanceSummary`

- **Firma:** `getActiveBalanceSummary(): Promise<ActiveBalanceSummaryResponseDto>` — [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L83) (L83–86)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Saldo total de cuentas activas — declared before `:id` so "summary" is never swallowed as a UUID param. Open to any authenticated role, same as `findAll`.
- **Dependencias (llamadas en su cuerpo):** `this.getAccountReceivableActiveBalanceUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountsReceivableController.findOne`

- **Firma:** `findOne(id: string): Promise<AccountReceivableResponseDto>` — [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L88) (L88–93)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getAccountReceivableByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountsReceivableController.update`

- **Firma:** `update(id: string, dto: UpdateAccountReceivableRequestDto, userId: string): Promise<AccountReceivableResponseDto>` — [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L95) (L95–107)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateAccountReceivableUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountsReceivableController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L109) (L109–115)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateAccountReceivableUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountsReceivableController.registerCharge`

- **Firma:** `registerCharge(clientId: string, dto: RegisterMovementRequestDto, userId: string): Promise<AccountReceivableResponseDto>` — [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L118) (L118–132)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post(':clientId/charges')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** "Registrar Cargo" — admin-only, same policy as `create()`.
- **Origen de parámetros:** `@Param('clientId', ParseUUIDPipe) clientId`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerAccountReceivableChargeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountsReceivableController.registerPayment`

- **Firma:** `registerPayment(clientId: string, dto: RegisterMovementRequestDto, userId: string): Promise<AccountReceivableResponseDto>` — [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L135) (L135–149)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post(':clientId/payments')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** "Registrar Abono" — admin-only, same policy as `create()`. Rejects an amount exceeding the client's current balance (`AbonoExceedsBalanceError`, 400).
- **Origen de parámetros:** `@Param('clientId', ParseUUIDPipe) clientId`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerAccountReceivablePaymentUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountsReceivableController.getStatement`

- **Firma:** `getStatement(clientId: string, query: GetStatementQueryDto): Promise<AccountReceivableStatementResponseDto>` — [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L152) (L152–161)
- **Decoradores:** `@Get(':clientId/statement')`
- **Propósito / descripción:** Estado de cuenta — open to any authenticated role, same as `findAll`/`findOne`.
- **Origen de parámetros:** `@Param('clientId', ParseUUIDPipe) clientId`, `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getAccountReceivableStatementUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountsReceivableController.getCurrentBalance`

- **Firma:** `getCurrentBalance(clientId: string): Promise<CurrentBalanceResponseDto>` — [accounts-receivable.controller.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/accounts-receivable.controller.ts#L164) (L164–169)
- **Decoradores:** `@Get(':clientId/balance')`
- **Propósito / descripción:** Saldo actual — backs the client selector, open to any authenticated role.
- **Origen de parámetros:** `@Param('clientId', ParseUUIDPipe) clientId`
- **Dependencias (llamadas en su cuerpo):** `this.getAccountReceivableCurrentBalanceUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-account-receivable-settlement-request-dto-ts"></a>

### account-receivable-settlement.request.dto.ts

- **Ruta:** [account-receivable-settlement.request.dto.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/account-receivable-settlement.request.dto.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/account-receivable-settlement.request.dto.ts`, 102 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** One selected account.
- **Depende de (archivos del proyecto):** [account-receivable-settlement.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-settlement-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [account-receivable-payments.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-account-receivable-payments-controller-ts)

#### Clase `SettlementItemRequestDto` (L26–35)

- **Propósito:** One selected account. `amount` omitted = its full pending (computed in PostgreSQL).

#### Clase `PreviewSettlementRequestDto` (L38–58)

- **Propósito:** "Resumen" before confirming — no write.

#### Clase `SettleAccountsReceivableRequestDto` (L61–82)

- **Herencia / contratos:** extends PreviewSettlementRequestDto
- **Propósito:** Cancel one or several accounts of the same client (cash or bank deposit).

#### Clase `VoidSettlementRequestDto` (L84–89)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ListSettlementsQueryDto` (L91–101)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-account-receivable-response-dto-ts"></a>

### account-receivable.response.dto.ts

- **Ruta:** [account-receivable.response.dto.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/account-receivable.response.dto.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/account-receivable.response.dto.ts`, 30 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** DTO de respuesta: declara `AccountReceivableResponseDto`, `PaginatedAccountsReceivableResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

#### Clase `AccountReceivableResponseDto` (L1–22)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedAccountsReceivableResponseDto` (L24–29)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-create-account-receivable-request-dto-ts"></a>

### create-account-receivable.request.dto.ts

- **Ruta:** [create-account-receivable.request.dto.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/create-account-receivable.request.dto.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/create-account-receivable.request.dto.ts`, 32 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** DTO de entrada: declara `CreateAccountReceivableRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

#### Clase `CreateAccountReceivableRequestDto` (L12–31)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-get-statement-query-dto-ts"></a>

### get-statement.query.dto.ts

- **Ruta:** [get-statement.query.dto.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/get-statement.query.dto.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/get-statement.query.dto.ts`, 12 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** DTO de consulta: declara `GetStatementQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

#### Clase `GetStatementQueryDto` (L3–11)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-list-accounts-receivable-query-dto-ts"></a>

### list-accounts-receivable.query.dto.ts

- **Ruta:** [list-accounts-receivable.query.dto.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/list-accounts-receivable.query.dto.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/list-accounts-receivable.query.dto.ts`, 84 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** DTO de consulta: declara `ListAccountsReceivableQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

#### Clase `ListAccountsReceivableQueryDto` (L26–83)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-register-movement-request-dto-ts"></a>

### register-movement.request.dto.ts

- **Ruta:** [register-movement.request.dto.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/register-movement.request.dto.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/register-movement.request.dto.ts`, 29 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** Backs both "Registrar Cargo" and "Registrar Abono" — `clientId` comes from the route param, never the body.
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

#### Clase `RegisterMovementRequestDto` (L12–28)

- **Propósito:** Backs both "Registrar Cargo" and "Registrar Abono" — `clientId` comes from the route param, never the body.
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-statement-response-dto-ts"></a>

### statement.response.dto.ts

- **Ruta:** [statement.response.dto.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/statement.response.dto.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/statement.response.dto.ts`, 30 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** DTO de respuesta: declara `StatementMovementResponseDto`, `AccountReceivableStatementResponseDto`, `CurrentBalanceResponseDto`, `ActiveBalanceSummaryResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

#### Clase `StatementMovementResponseDto` (L1–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `AccountReceivableStatementResponseDto` (L12–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CurrentBalanceResponseDto` (L22–24)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ActiveBalanceSummaryResponseDto` (L26–29)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-dtos-update-account-receivable-request-dto-ts"></a>

### update-account-receivable.request.dto.ts

- **Ruta:** [update-account-receivable.request.dto.ts](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/update-account-receivable.request.dto.ts) (`comercial-jhoel-api/src/modules/accounts-receivable/presentation/dtos/update-account-receivable.request.dto.ts`, 34 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `accounts-receivable`
- **Responsabilidad:** DTO de entrada: declara `UpdateAccountReceivableRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [accounts-receivable.controller.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-presentation-controllers-accounts-receivable-controller-ts)

#### Clase `UpdateAccountReceivableRequestDto` (L12–33)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
