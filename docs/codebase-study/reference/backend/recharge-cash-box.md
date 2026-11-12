# Módulo backend `recharge-cash-box`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/recharge-cash-box/balance` | [recharge-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/controllers/recharge-cash-box.controller.ts#L60) `RechargeCashBoxController.getBalance` | [GetCashBoxBalanceUseCase](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-balance-use-case-ts) | `RechargeCashBoxMovementRepository`.getDailyTotals | UseGuards(JwtAuthGuard) | `RechargeCashBoxService.getBalance` |
| `GET /api/recharge-cash-box/movements` | [recharge-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/controllers/recharge-cash-box.controller.ts#L67) `RechargeCashBoxController.getMovements` | [GetCashBoxMovementsUseCase](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-movements-use-case-ts) | `RechargeCashBoxMovementRepository`.findMovements [recharge_sales, recharge_sim_sales, recharge_purchases, recharge_sim_purchases, recharge_cash_box_movements, users] | UseGuards(JwtAuthGuard) | `RechargeCashBoxService.getMovements` |
| `POST /api/recharge-cash-box/withdrawals` | [recharge-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/controllers/recharge-cash-box.controller.ts#L80) `RechargeCashBoxController.registerWithdrawal` | [RegisterCashBoxWithdrawalUseCase](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-withdrawal-use-case-ts) | `RechargeCashBoxMovementRepository`.registerMovement → `register_recharge_cash_box_movement` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `RechargeCashBoxService.registerWithdrawal` |
| `POST /api/recharge-cash-box/contributions` | [recharge-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/controllers/recharge-cash-box.controller.ts#L96) `RechargeCashBoxController.registerContribution` | [RegisterCashBoxContributionUseCase](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-contribution-use-case-ts) | `RechargeCashBoxMovementRepository`.registerMovement → `register_recharge_cash_box_movement` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `RechargeCashBoxService.registerContribution` |
| `POST /api/recharge-cash-box/movements/:id/void` | [recharge-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/controllers/recharge-cash-box.controller.ts#L112) `RechargeCashBoxController.voidMovement` | [VoidCashBoxMovementUseCase](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-void-cash-box-movement-use-case-ts) | `RechargeCashBoxMovementRepository`.findById/voidMovement | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `RechargeCashBoxService.voidMovement` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [cash-box-balance-output.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-dtos-cash-box-balance-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `CashBoxBalanceOutput` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [cash-box-movement-output.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-dtos-cash-box-movement-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `CashBoxMovementRowOutput`, `PaginatedCashBoxMovementsOutput` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [cash-box-movement-record-output.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-dtos-cash-box-movement-record-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toCashBoxMovementOutput`, `CashBoxMovementOutput` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [get-cash-box-balance.use-case.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-balance-use-case-ts) | .ts | Caso de uso | Aplicación | Computes "Saldo Anterior" / "Ingresos Hoy" / "Salidas Hoy" / "Saldo Actual" for one calendar day — never stored, always derived live from the same live source tables `register_recharge_cash_box_movement` itself reads (plus non-voided manual movements — "Aporte a Caja" counts as income, "Salida de Ganancia" as expense). | 4 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [get-cash-box-movements.use-case.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-movements-use-case-ts) | .ts | Caso de uso | Aplicación | Historial de Movimientos — same pagination/date-range shape as `GetRechargeHistoryUseCase`, applied to the Caja Contable's own unified movement stream (see `TypeOrmRechargeCashBoxRepository.findMovements` for how the running "saldo" column is computed correctly regardless of which page/filter is being viewed). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-cash-box-contribution.use-case.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-contribution-use-case-ts) | .ts | Caso de uso | Aplicación | "Aporte a Caja" — a manual cash contribution, the mirror-image income counterpart to "Salida de Ganancia" (see `RegisterCashBoxWithdrawalUseCase`). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-cash-box-withdrawal.use-case.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-withdrawal-use-case-ts) | .ts | Caso de uso | Aplicación | "Salida de Ganancia" — one of the two Caja Contable movements that isn't derived from an existing sale/purchase table (the other is "Aporte a Caja", see `RegisterCashBoxContributionUseCase`). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [void-cash-box-movement.use-case.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-void-cash-box-movement-use-case-ts) | .ts | Caso de uso | Aplicación | The correction path for a mistaken "Aporte a Caja" or "Salida de Ganancia" — never an edit, never a physical delete. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [assert-valid-operation-date.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-assert-valid-operation-date-ts) | .ts | Utilidad | Aplicación | A movement/balance query can legitimately target a past business date — catching up on a day not recorded in time — but never further than one calendar day in the future. | 2 internas | 3 | Media (3 consumidores) |
| [today-iso-date.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-today-iso-date-ts) | .ts | Utilidad | Aplicación | Utilidad: declara `toIsoDate`, `todayIsoDate`, `maxAllowedOperationDate` (sin comentario de documentación en el código). | 0 internas | 4 | Media (4 consumidores) |
| [recharge-cash-box-movement.entity.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-entities-recharge-cash-box-movement-entity-ts) | .ts | Entidad de dominio | Dominio | A manual Caja Contable movement — "Aporte a Caja" (income) or "Salida de Ganancia" (expense), the only two Caja Contable movements that aren't derived live from an existing sale/purchase table (see the migration's own doc comment). | 0 internas | 5 | Media (5 consumidores) |
| [invalid-cash-box-date-range.error.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-invalid-cash-box-date-range-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidCashBoxDateRangeError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-movement-amount.error.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-invalid-movement-amount-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidMovementAmountError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-movement-concept.error.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-invalid-movement-concept-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidMovementConceptError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-movement-date.error.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-invalid-movement-date-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidMovementDateError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [recharge-cash-box-movement-already-voided.error.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-recharge-cash-box-movement-already-voided-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RechargeCashBoxMovementAlreadyVoidedError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [recharge-cash-box-movement-not-found.error.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-recharge-cash-box-movement-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `RechargeCashBoxMovementNotFoundError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [withdrawal-exceeds-balance.error.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-withdrawal-exceeds-balance-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `WithdrawalExceedsBalanceError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [recharge-cash-box-movement.repository.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-repositories-recharge-cash-box-movement-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RegisterCashBoxMovementData`, `CashBoxDailyTotals`, `CashBoxMovementRow`, `FindCashBoxMovementsOptions`, `PaginatedCashBoxMovements` (sin comentario de documentación en el código). | 1 internas | 8 | Media (8 consumidores) |
| [recharge-cash-box-movement.mapper.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-cash-box-movement-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `RechargeCashBoxMovementMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [recharge-cash-box-movement.orm-entity.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-cash-box-movement-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `RechargeCashBoxMovementOrmEntity` (sin comentario de documentación en el código). | 3 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [recharge-purchase.orm-entity.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-purchase-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Read-only mapping of `recharge_purchases` — this table is still written EXCLUSIVELY by the `register_recharge_purchase` stored function (never `.save()`/`.insert()` from TypeScript, see `recharges.module.ts`'s own doc comment on why no ORM entity existed for it before). | 1 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [recharge-sim-purchase.orm-entity.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-sim-purchase-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Read-only mapping of `recharge_sim_purchases` — written exclusively by `register_recharge_sim_purchase`; added here, scoped to reads only, for `TypeOrmRechargeCashBoxRepository`'s "Compras de SIM" aggregation. | 1 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [recharge-sim-sale.orm-entity.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-sim-sale-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Read-only mapping of `recharge_sim_sales` — written exclusively by `register_recharge_sim_sale`; added here, scoped to reads only, for `TypeOrmRechargeCashBoxRepository`'s "Ventas de SIM" aggregation. | 1 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [typeorm-recharge-cash-box.repository.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Reads four already-existing, already-authoritative tables live — never a copy — for every auto-sourced Caja Contable figure (see the migration's own doc comment for why this design makes duplicate movements structurally impossible). | 11 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [recharge-cash-box.controller.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts) | .ts | Controlador | Presentación | "Gestión Caja Recargas" — a fully independent module (own domain/ application/infrastructure/presentation, own controller, no import of `RechargesModule`) backing an accumulated cash balance for Recargas Electrónicas y SIMs. | 17 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [cash-box-balance.query.dto.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-cash-box-balance-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `CashBoxBalanceQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [cash-box-balance.response.dto.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-cash-box-balance-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `CashBoxBalanceDetailResponseDto`, `CashBoxBalanceResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [cash-box-movement-record.response.dto.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-cash-box-movement-record-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `CashBoxMovementRecordResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [cash-box-movement.response.dto.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-cash-box-movement-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `CashBoxMovementResponseDto`, `PaginatedCashBoxMovementsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [cash-box-movements.query.dto.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-cash-box-movements-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `CashBoxMovementsQueryDto`, `CASH_BOX_MOVEMENT_TYPES` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [register-cash-box-contribution.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-register-cash-box-contribution-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `RegisterCashBoxContributionRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [register-cash-box-withdrawal.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-register-cash-box-withdrawal-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `RegisterCashBoxWithdrawalRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [void-cash-box-movement.request.dto.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-void-cash-box-movement-request-dto-ts) | .ts | DTO de entrada | Presentación | Mirrors `VoidBankDepositOperationRequestDto` — same mandatory-reason shape, kept as this module's own copy rather than a cross-module import. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [recharge-cash-box.module.ts](#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts) | .ts | Módulo | Arranque / configuración | "Gestión Caja Recargas" — fully independent from `RechargesModule` (moved out of it per an explicit follow-up request: this used to be a section embedded inside the Recargas Electrónicas page/module; it's now its own Sistema-level module, with its own sidebar entry, route, and backend module boundary). | 13 internas; ext.: @nestjs/common, @nestjs/typeorm | 2 | Baja (2 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-application-dtos-cash-box-balance-output-ts"></a>

### cash-box-balance-output.ts

- **Ruta:** [cash-box-balance-output.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/dtos/cash-box-balance-output.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/application/dtos/cash-box-balance-output.ts`, 16 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** DTO de salida (aplicación): declara `CashBoxBalanceOutput` (sin comentario de documentación en el código).
- **Consumidores:** [get-cash-box-balance.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-balance-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CashBoxBalanceOutput` (L1): sin documentación — miembros: `date`, `previousBalance`, `incomeToday`, `expenseToday`, `currentBalance`, `detail`
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-application-dtos-cash-box-movement-output-ts"></a>

### cash-box-movement-output.ts

- **Ruta:** [cash-box-movement-output.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/dtos/cash-box-movement-output.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/application/dtos/cash-box-movement-output.ts`, 20 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** DTO de salida (aplicación): declara `CashBoxMovementRowOutput`, `PaginatedCashBoxMovementsOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-cash-box-movement.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-repositories-recharge-cash-box-movement-repository-ts)
- **Consumidores:** [get-cash-box-movements.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-movements-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CashBoxMovementRowOutput` (L3): sin documentación — miembros: `date`, `type`, `concept`, `income`, `expense`, `balance`, `username`, `movementId`
- `interface PaginatedCashBoxMovementsOutput` (L14): sin documentación — miembros: `items`, `total`, `page`, `limit`
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-application-dtos-cash-box-movement-record-output-ts"></a>

### cash-box-movement-record-output.ts

- **Ruta:** [cash-box-movement-record-output.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/dtos/cash-box-movement-record-output.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/application/dtos/cash-box-movement-record-output.ts`, 35 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** DTO de salida (aplicación): declara `toCashBoxMovementOutput`, `CashBoxMovementOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-cash-box-movement.entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-entities-recharge-cash-box-movement-entity-ts)
- **Consumidores:** [register-cash-box-contribution.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-contribution-use-case-ts), [register-cash-box-withdrawal.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-withdrawal-use-case-ts), [void-cash-box-movement.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-void-cash-box-movement-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CashBoxMovementOutput` (L4): sin documentación — miembros: `id`, `amount`, `movementType`, `businessDate`, `concept`, `createdByUsername`, `createdAt`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
#### Función `toCashBoxMovementOutput` (L18–34)

- **Tipo:** función exportada
- **Firma:** `toCashBoxMovementOutput(movement: RechargeCashBoxMovement): CashBoxMovementOutput` — [cash-box-movement-record-output.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/dtos/cash-box-movement-record-output.ts#L18)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [register-cash-box-contribution.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-contribution-use-case-ts), [register-cash-box-withdrawal.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-withdrawal-use-case-ts), [void-cash-box-movement.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-void-cash-box-movement-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-balance-use-case-ts"></a>

### get-cash-box-balance.use-case.ts

- **Ruta:** [get-cash-box-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/get-cash-box-balance.use-case.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/get-cash-box-balance.use-case.ts`, 78 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Computes "Saldo Anterior" / "Ingresos Hoy" / "Salidas Hoy" / "Saldo Actual" for one calendar day — never stored, always derived live from the same live source tables `register_recharge_cash_box_movement` itself reads (plus non-voided manual movements — "Aporte a Caja" counts as income, "Salida de Ganancia" as expense).
- **Depende de (archivos del proyecto):** [recharge-cash-box-movement.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-repositories-recharge-cash-box-movement-repository-ts), [assert-valid-operation-date.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-assert-valid-operation-date-ts), [today-iso-date.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-today-iso-date-ts), [cash-box-balance-output.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-dtos-cash-box-balance-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [get-alerts.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts), [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts)

**Interfaces, tipos y enums:**

- `interface GetCashBoxBalanceInput` (L13): sin documentación — miembros: `date`

#### Clase `GetCashBoxBalanceUseCase` (L29–77)

- **Decoradores:** `@Injectable()`
- **Propósito:** Computes "Saldo Anterior" / "Ingresos Hoy" / "Salidas Hoy" / "Saldo Actual" for one calendar day — never stored, always derived live from the same live source tables `register_recharge_cash_box_movement` itself reads (plus non-voided manual movements — "Aporte a Caja" counts as income, "Salida de Ganancia" as expense). Two calls to `getDailyTotals` — one strictly BEFORE `date` (the accumulated balance that becomes "saldo anterior"), one ON `date` (today's own ingresos/salidas breakdown) — are all the arithmetic needs; there is no per-day snapshot row anywhere to keep in sync.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY) cashBoxRepository: RechargeCashBoxMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 36–76 | `input: GetCashBoxBalanceInput` | `Promise<CashBoxBalanceOutput>` |

##### `GetCashBoxBalanceUseCase.execute`

- **Firma:** `execute(input: GetCashBoxBalanceInput): Promise<CashBoxBalanceOutput>` — [get-cash-box-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/get-cash-box-balance.use-case.ts#L36) (L36–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `todayIsoDate`, `assertValidOperationDate`, `Promise.all`, `this.cashBoxRepository.getDailyTotals`, `round2`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)

#### Función `round2` (L9–11)

- **Tipo:** función local del archivo
- **Firma:** `round2(value: number): number` — [get-cash-box-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/get-cash-box-balance.use-case.ts#L9)
- **Propósito / descripción:** Rounds a chained sum/subtraction of already-2-decimal money values back to 2 decimals — plain JS float arithmetic on several such values (e.g. `109.98 + 50`) can otherwise surface a binary-representation artifact like `159.98000000000002` in the response. The underlying columns are all `NUMERIC(12,2)`; only the display-time JS math needs this guard.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-movements-use-case-ts"></a>

### get-cash-box-movements.use-case.ts

- **Ruta:** [get-cash-box-movements.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/get-cash-box-movements.use-case.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/get-cash-box-movements.use-case.ts`, 52 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Historial de Movimientos — same pagination/date-range shape as `GetRechargeHistoryUseCase`, applied to the Caja Contable's own unified movement stream (see `TypeOrmRechargeCashBoxRepository.findMovements` for how the running "saldo" column is computed correctly regardless of which page/filter is being viewed).
- **Depende de (archivos del proyecto):** [recharge-cash-box-movement.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-repositories-recharge-cash-box-movement-repository-ts), [invalid-cash-box-date-range.error.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-invalid-cash-box-date-range-error-ts), [cash-box-movement-output.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-dtos-cash-box-movement-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts), [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts)

**Interfaces, tipos y enums:**

- `interface GetCashBoxMovementsInput` (L10): sin documentación — miembros: `startDate`, `endDate`, `type`, `page`, `limit`

#### Clase `GetCashBoxMovementsUseCase` (L23–51)

- **Decoradores:** `@Injectable()`
- **Propósito:** Historial de Movimientos — same pagination/date-range shape as `GetRechargeHistoryUseCase`, applied to the Caja Contable's own unified movement stream (see `TypeOrmRechargeCashBoxRepository.findMovements` for how the running "saldo" column is computed correctly regardless of which page/filter is being viewed).
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY) cashBoxRepository: RechargeCashBoxMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–50 | `input: GetCashBoxMovementsInput` | `Promise<PaginatedCashBoxMovementsOutput>` |

##### `GetCashBoxMovementsUseCase.execute`

- **Firma:** `execute(input: GetCashBoxMovementsInput): Promise<PaginatedCashBoxMovementsOutput>` — [get-cash-box-movements.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/get-cash-box-movements.use-case.ts#L30) (L30–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidCashBoxDateRangeError`, `Math.min`, `this.cashBoxRepository.findMovements`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidCashBoxDateRangeError()`
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-contribution-use-case-ts"></a>

### register-cash-box-contribution.use-case.ts

- **Ruta:** [register-cash-box-contribution.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/register-cash-box-contribution.use-case.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/register-cash-box-contribution.use-case.ts`, 52 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** "Aporte a Caja" — a manual cash contribution, the mirror-image income counterpart to "Salida de Ganancia" (see `RegisterCashBoxWithdrawalUseCase`).
- **Depende de (archivos del proyecto):** [recharge-cash-box-movement.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-repositories-recharge-cash-box-movement-repository-ts), [assert-valid-operation-date.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-assert-valid-operation-date-ts), [today-iso-date.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-today-iso-date-ts), [cash-box-movement-record-output.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-dtos-cash-box-movement-record-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts), [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterCashBoxContributionInput` (L11): sin documentación — miembros: `amount`, `concept`, `userId`, `businessDate`

#### Clase `RegisterCashBoxContributionUseCase` (L28–51)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Aporte a Caja" — a manual cash contribution, the mirror-image income counterpart to "Salida de Ganancia" (see `RegisterCashBoxWithdrawalUseCase`). Unlike a withdrawal, a contribution never needs a balance check — it only ever adds, so `register_recharge_cash_box_movement` skips the `WITHDRAWAL_EXCEEDS_BALANCE` guard entirely when `movementType === 'CONTRIBUTION'` (see the migration's own doc comment).
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY) cashBoxRepository: RechargeCashBoxMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 35–50 | `input: RegisterCashBoxContributionInput` | `Promise<CashBoxMovementOutput>` |

##### `RegisterCashBoxContributionUseCase.execute`

- **Firma:** `execute(input: RegisterCashBoxContributionInput): Promise<CashBoxMovementOutput>` — [register-cash-box-contribution.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/register-cash-box-contribution.use-case.ts#L35) (L35–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `todayIsoDate`, `assertValidOperationDate`, `this.cashBoxRepository.registerMovement`, `toCashBoxMovementOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-withdrawal-use-case-ts"></a>

### register-cash-box-withdrawal.use-case.ts

- **Ruta:** [register-cash-box-withdrawal.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/register-cash-box-withdrawal.use-case.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/register-cash-box-withdrawal.use-case.ts`, 55 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** "Salida de Ganancia" — one of the two Caja Contable movements that isn't derived from an existing sale/purchase table (the other is "Aporte a Caja", see `RegisterCashBoxContributionUseCase`).
- **Depende de (archivos del proyecto):** [recharge-cash-box-movement.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-repositories-recharge-cash-box-movement-repository-ts), [assert-valid-operation-date.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-assert-valid-operation-date-ts), [today-iso-date.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-today-iso-date-ts), [cash-box-movement-record-output.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-dtos-cash-box-movement-record-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts), [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterCashBoxWithdrawalInput` (L11): sin documentación — miembros: `amount`, `concept`, `userId`, `businessDate`

#### Clase `RegisterCashBoxWithdrawalUseCase` (L31–54)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Salida de Ganancia" — one of the two Caja Contable movements that isn't derived from an existing sale/purchase table (the other is "Aporte a Caja", see `RegisterCashBoxContributionUseCase`). Amount/balance validation is intentionally NOT duplicated here: `register_recharge_cash_box_movement` computes the available balance and rejects an over-limit withdrawal atomically, inside its own advisory lock — a TypeScript-side pre-check would only add a TOCTOU gap, not close one (same reasoning already established for the Kardex financiero payment use cases). A contribution never has this check — it can never "exceed" anything, it only ever adds.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY) cashBoxRepository: RechargeCashBoxMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 38–53 | `input: RegisterCashBoxWithdrawalInput` | `Promise<CashBoxMovementOutput>` |

##### `RegisterCashBoxWithdrawalUseCase.execute`

- **Firma:** `execute(input: RegisterCashBoxWithdrawalInput): Promise<CashBoxMovementOutput>` — [register-cash-box-withdrawal.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/register-cash-box-withdrawal.use-case.ts#L38) (L38–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `todayIsoDate`, `assertValidOperationDate`, `this.cashBoxRepository.registerMovement`, `toCashBoxMovementOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-void-cash-box-movement-use-case-ts"></a>

### void-cash-box-movement.use-case.ts

- **Ruta:** [void-cash-box-movement.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/void-cash-box-movement.use-case.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/void-cash-box-movement.use-case.ts`, 42 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** The correction path for a mistaken "Aporte a Caja" or "Salida de Ganancia" — never an edit, never a physical delete.
- **Depende de (archivos del proyecto):** [recharge-cash-box-movement.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-repositories-recharge-cash-box-movement-repository-ts), [recharge-cash-box-movement-not-found.error.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-recharge-cash-box-movement-not-found-error-ts), [recharge-cash-box-movement-already-voided.error.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-recharge-cash-box-movement-already-voided-error-ts), [cash-box-movement-record-output.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-dtos-cash-box-movement-record-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts), [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts)

**Interfaces, tipos y enums:**

- `interface VoidCashBoxMovementInput` (L11): sin documentación — miembros: `id`, `voidedBy`, `reason`

#### Clase `VoidCashBoxMovementUseCase` (L18–41)

- **Decoradores:** `@Injectable()`
- **Propósito:** The correction path for a mistaken "Aporte a Caja" or "Salida de Ganancia" — never an edit, never a physical delete. Works for either movement type (voiding logic doesn't depend on which one it is). Same shape as `VoidBankDepositOperationUseCase`.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY) cashBoxRepository: RechargeCashBoxMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–40 | `input: VoidCashBoxMovementInput` | `Promise<CashBoxMovementOutput>` |

##### `VoidCashBoxMovementUseCase.execute`

- **Firma:** `execute(input: VoidCashBoxMovementInput): Promise<CashBoxMovementOutput>` — [void-cash-box-movement.use-case.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/use-cases/void-cash-box-movement.use-case.ts#L25) (L25–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cashBoxRepository.findById`, `new RechargeCashBoxMovementNotFoundError`, `new RechargeCashBoxMovementAlreadyVoidedError`, `this.cashBoxRepository.voidMovement`, `toCashBoxMovementOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new RechargeCashBoxMovementNotFoundError()`, `new RechargeCashBoxMovementAlreadyVoidedError()`
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-assert-valid-operation-date-ts"></a>

### assert-valid-operation-date.ts

- **Ruta:** [assert-valid-operation-date.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/assert-valid-operation-date.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/assert-valid-operation-date.ts`, 17 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** A movement/balance query can legitimately target a past business date — catching up on a day not recorded in time — but never further than one calendar day in the future.
- **Depende de (archivos del proyecto):** [invalid-movement-date.error.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-invalid-movement-date-error-ts), [today-iso-date.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-today-iso-date-ts)
- **Consumidores:** [get-cash-box-balance.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-balance-use-case-ts), [register-cash-box-contribution.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-contribution-use-case-ts), [register-cash-box-withdrawal.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-withdrawal-use-case-ts)
#### Función `assertValidOperationDate` (L12–16)

- **Tipo:** función exportada
- **Firma:** `assertValidOperationDate(date: string): void` — [assert-valid-operation-date.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/assert-valid-operation-date.ts#L12)
- **Propósito / descripción:** A movement/balance query can legitimately target a past business date — catching up on a day not recorded in time — but never further than one calendar day in the future. Same reasoning as Recargas' own `assertValidOperationDate`, copied here per this codebase's established "small per-feature copy" convention rather than importing across the module boundary.
- **Dependencias:** `maxAllowedOperationDate`, `new InvalidMovementDateError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidMovementDateError()`
- **Consumidores:** [get-cash-box-balance.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-balance-use-case-ts), [register-cash-box-contribution.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-contribution-use-case-ts), [register-cash-box-withdrawal.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-withdrawal-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-today-iso-date-ts"></a>

### today-iso-date.ts

- **Ruta:** [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/today-iso-date.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/today-iso-date.ts`, 26 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Utilidad: declara `toIsoDate`, `todayIsoDate`, `maxAllowedOperationDate` (sin comentario de documentación en el código).
- **Consumidores:** [get-cash-box-balance.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-balance-use-case-ts), [register-cash-box-contribution.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-contribution-use-case-ts), [register-cash-box-withdrawal.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-withdrawal-use-case-ts), [assert-valid-operation-date.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-assert-valid-operation-date-ts)
#### Función `toIsoDate` (L1–6)

- **Tipo:** función local del archivo
- **Firma:** `toIsoDate(date: Date): string` — [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/today-iso-date.ts#L1)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `date.getFullYear`, `String(date.getMonth() + 1).padStart`, `String`, `date.getMonth`, `String(date.getDate()).padStart`, `date.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `todayIsoDate` (L16–18)

- **Tipo:** función exportada
- **Firma:** `todayIsoDate(): string` — [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/today-iso-date.ts#L16)
- **Propósito / descripción:** `yyyy-MM-dd` in local server time (`TZ=America/Guatemala`, see `docker-compose.yml`) — same technique every date-driven use case in this codebase already uses (e.g. Recargas' own `todayIsoDate()`), kept as this module's own copy per the established "small per-feature copy over cross-feature coupling" convention rather than importing across the module boundary.
- **Dependencias:** `toIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-cash-box-balance.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-balance-use-case-ts), [register-cash-box-contribution.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-contribution-use-case-ts), [register-cash-box-withdrawal.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-withdrawal-use-case-ts)

#### Función `maxAllowedOperationDate` (L21–25)

- **Tipo:** función exportada
- **Firma:** `maxAllowedOperationDate(): string` — [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/today-iso-date.ts#L21)
- **Propósito / descripción:** One calendar day past today, local server time — the furthest `businessDate` a withdrawal may be dated to (see `assertValidOperationDate`).
- **Dependencias:** `new Date`, `date.setDate`, `date.getDate`, `toIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [assert-valid-operation-date.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-assert-valid-operation-date-ts)

<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-entities-recharge-cash-box-movement-entity-ts"></a>

### recharge-cash-box-movement.entity.ts

- **Ruta:** [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts`, 89 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** A manual Caja Contable movement — "Aporte a Caja" (income) or "Salida de Ganancia" (expense), the only two Caja Contable movements that aren't derived live from an existing sale/purchase table (see the migration's own doc comment).
- **Consumidores:** [cash-box-movement-record-output.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-dtos-cash-box-movement-record-output-ts), [recharge-cash-box-movement.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-repositories-recharge-cash-box-movement-repository-ts), [recharge-cash-box-movement.mapper.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-cash-box-movement-mapper-ts), [recharge-cash-box-movement.orm-entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-cash-box-movement-orm-entity-ts), [typeorm-recharge-cash-box.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts)

**Interfaces, tipos y enums:**

- `interface RechargeCashBoxMovementProps` (L3): sin documentación — miembros: `id`, `amount`, `movementType`, `businessDate`, `concept`, `createdByUserId`, `createdByUsername`, `createdAt`, `isVoided`, `voidedAt`, `voidedByUserId`, `voidedByUsername`, `voidReason`
- `type CashBoxMovementType` (L1) = `'CONTRIBUTION' \| 'WITHDRAWAL'`

#### Clase `RechargeCashBoxMovement` (L30–88)

- **Propósito:** A manual Caja Contable movement — "Aporte a Caja" (income) or "Salida de Ganancia" (expense), the only two Caja Contable movements that aren't derived live from an existing sale/purchase table (see the migration's own doc comment). `amount` is always a positive magnitude; the sign is derived from `movementType` at read time, never stored — same convention as Kardex financiero's `AccountReceivable`/`Asset` entities. Never physically deleted; corrected only via `voidMovement`, same as `bank_deposit_operations`.
- **Dependencias inyectadas (constructor):** `props: RechargeCashBoxMovementProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 33–35 | `props: RechargeCashBoxMovementProps` | `RechargeCashBoxMovement` |
| `id` | getter public | 37–39 | — | `string` |
| `amount` | getter public | 41–43 | — | `number` |
| `movementType` | getter public | 45–47 | — | `CashBoxMovementType` |
| `businessDate` | getter public | 49–51 | — | `string` |
| `concept` | getter public | 53–55 | — | `string` |
| `createdByUserId` | getter public | 57–59 | — | `string` |
| `createdByUsername` | getter public | 61–63 | — | `string` |
| `createdAt` | getter public | 65–67 | — | `Date` |
| `isVoided` | getter public | 69–71 | — | `boolean` |
| `voidedAt` | getter public | 73–75 | — | `Date \| null` |
| `voidedByUserId` | getter public | 77–79 | — | `string \| null` |
| `voidedByUsername` | getter public | 81–83 | — | `string \| null` |
| `voidReason` | getter public | 85–87 | — | `string \| null` |

##### `RechargeCashBoxMovement.create`

- **Firma:** `create(props: RechargeCashBoxMovementProps): RechargeCashBoxMovement` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new RechargeCashBoxMovement`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [recharge-cash-box-movement.mapper.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-cash-box-movement-mapper-ts)

##### `RechargeCashBoxMovement.id`

- **Firma:** `id(): string` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxMovement.amount`

- **Firma:** `amount(): number` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxMovement.movementType`

- **Firma:** `movementType(): CashBoxMovementType` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxMovement.businessDate`

- **Firma:** `businessDate(): string` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxMovement.concept`

- **Firma:** `concept(): string` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxMovement.createdByUserId`

- **Firma:** `createdByUserId(): string` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxMovement.createdByUsername`

- **Firma:** `createdByUsername(): string` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxMovement.createdAt`

- **Firma:** `createdAt(): Date` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L65) (L65–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxMovement.isVoided`

- **Firma:** `isVoided(): boolean` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxMovement.voidedAt`

- **Firma:** `voidedAt(): Date \| null` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxMovement.voidedByUserId`

- **Firma:** `voidedByUserId(): string \| null` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxMovement.voidedByUsername`

- **Firma:** `voidedByUsername(): string \| null` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxMovement.voidReason`

- **Firma:** `voidReason(): string \| null` — [recharge-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/entities/recharge-cash-box-movement.entity.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-invalid-cash-box-date-range-error-ts"></a>

### invalid-cash-box-date-range.error.ts

- **Ruta:** [invalid-cash-box-date-range.error.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/invalid-cash-box-date-range.error.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/invalid-cash-box-date-range.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Errores de dominio: declara `InvalidCashBoxDateRangeError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-cash-box-movements.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-movements-use-case-ts)

#### Clase `InvalidCashBoxDateRangeError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-invalid-movement-amount-error-ts"></a>

### invalid-movement-amount.error.ts

- **Ruta:** [invalid-movement-amount.error.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/invalid-movement-amount.error.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/invalid-movement-amount.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Errores de dominio: declara `InvalidMovementAmountError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-cash-box.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts)

#### Clase `InvalidMovementAmountError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-invalid-movement-concept-error-ts"></a>

### invalid-movement-concept.error.ts

- **Ruta:** [invalid-movement-concept.error.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/invalid-movement-concept.error.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/invalid-movement-concept.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Errores de dominio: declara `InvalidMovementConceptError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-cash-box.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts)

#### Clase `InvalidMovementConceptError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-invalid-movement-date-error-ts"></a>

### invalid-movement-date.error.ts

- **Ruta:** [invalid-movement-date.error.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/invalid-movement-date.error.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/invalid-movement-date.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Errores de dominio: declara `InvalidMovementDateError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [assert-valid-operation-date.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-utils-assert-valid-operation-date-ts)

#### Clase `InvalidMovementDateError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-recharge-cash-box-movement-already-voided-error-ts"></a>

### recharge-cash-box-movement-already-voided.error.ts

- **Ruta:** [recharge-cash-box-movement-already-voided.error.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/recharge-cash-box-movement-already-voided.error.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/recharge-cash-box-movement-already-voided.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Errores de dominio: declara `RechargeCashBoxMovementAlreadyVoidedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-cash-box-movement.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-void-cash-box-movement-use-case-ts)

#### Clase `RechargeCashBoxMovementAlreadyVoidedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-recharge-cash-box-movement-not-found-error-ts"></a>

### recharge-cash-box-movement-not-found.error.ts

- **Ruta:** [recharge-cash-box-movement-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/recharge-cash-box-movement-not-found.error.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/recharge-cash-box-movement-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Errores de dominio: declara `RechargeCashBoxMovementNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-cash-box-movement.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-void-cash-box-movement-use-case-ts)

#### Clase `RechargeCashBoxMovementNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-withdrawal-exceeds-balance-error-ts"></a>

### withdrawal-exceeds-balance.error.ts

- **Ruta:** [withdrawal-exceeds-balance.error.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/withdrawal-exceeds-balance.error.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/domain/errors/withdrawal-exceeds-balance.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Errores de dominio: declara `WithdrawalExceedsBalanceError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-recharge-cash-box.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts)

#### Clase `WithdrawalExceedsBalanceError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-repositories-recharge-cash-box-movement-repository-ts"></a>

### recharge-cash-box-movement.repository.ts

- **Ruta:** [recharge-cash-box-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/domain/repositories/recharge-cash-box-movement.repository.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/domain/repositories/recharge-cash-box-movement.repository.ts`, 86 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RegisterCashBoxMovementData`, `CashBoxDailyTotals`, `CashBoxMovementRow`, `FindCashBoxMovementsOptions`, `PaginatedCashBoxMovements` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-cash-box-movement.entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-entities-recharge-cash-box-movement-entity-ts)
- **Consumidores:** [cash-box-movement-output.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-dtos-cash-box-movement-output-ts), [get-cash-box-balance.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-balance-use-case-ts), [get-cash-box-movements.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-movements-use-case-ts), [register-cash-box-contribution.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-contribution-use-case-ts), [register-cash-box-withdrawal.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-withdrawal-use-case-ts), [void-cash-box-movement.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-void-cash-box-movement-use-case-ts), [typeorm-recharge-cash-box.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts), [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterCashBoxMovementData` (L10): sin documentación — miembros: `amount`, `movementType`, `businessDate`, `concept`, `userId`
- `interface CashBoxDailyTotals` (L19): One category's raw sum for a single `yyyy-MM-dd` day — `0` when nothing happened that day, never `null`. — miembros: `salesRecharges`, `salesSim`, `purchasesRecharges`, `purchasesSim`, `contributions`, `withdrawals`
- `interface CashBoxMovementRow` (L36): sin documentación — miembros: `date`, `type`, `concept`, `income`, `expense`, `balance`, `username`, `movementId`
- `interface FindCashBoxMovementsOptions` (L50): sin documentación — miembros: `startDate`, `endDate`, `type`, `page`, `limit`
- `interface PaginatedCashBoxMovements` (L58): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface RechargeCashBoxMovementRepository` (L65): sin documentación — miembros: `registerMovement`, `voidMovement`, `findById`, `getDailyTotals`, `findMovements`
- `type CashBoxHistoryMovementType` (L28) = `\| 'RECHARGE_SALE' \| 'SIM_SALE' \| 'RECHARGE_PURCHASE' \| 'SIM_PURCHASE' \| 'CONTRIBUTION' \| 'PROFIT_WITHDRAWAL'`

**Constantes exportadas:**

- `RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY` (L6) = `Symbol( 'RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-cash-box-movement-mapper-ts"></a>

### recharge-cash-box-movement.mapper.ts

- **Ruta:** [recharge-cash-box-movement.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/recharge-cash-box-movement.mapper.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/recharge-cash-box-movement.mapper.ts`, 25 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Mapper: declara `RechargeCashBoxMovementMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [recharge-cash-box-movement.entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-entities-recharge-cash-box-movement-entity-ts), [recharge-cash-box-movement.orm-entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-cash-box-movement-orm-entity-ts)
- **Consumidores:** [typeorm-recharge-cash-box.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts)

#### Clase `RechargeCashBoxMovementMapper` (L4–24)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–23 | `orm: RechargeCashBoxMovementOrmEntity` | `RechargeCashBoxMovement` |

##### `RechargeCashBoxMovementMapper.toDomain`

- **Firma:** `toDomain(orm: RechargeCashBoxMovementOrmEntity): RechargeCashBoxMovement` — [recharge-cash-box-movement.mapper.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/recharge-cash-box-movement.mapper.ts#L5) (L5–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `RechargeCashBoxMovement.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-recharge-cash-box.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-cash-box-movement-orm-entity-ts"></a>

### recharge-cash-box-movement.orm-entity.ts

- **Ruta:** [recharge-cash-box-movement.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/recharge-cash-box-movement.orm-entity.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/recharge-cash-box-movement.orm-entity.ts`, 70 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `RechargeCashBoxMovementOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [recharge-cash-box-movement.entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-entities-recharge-cash-box-movement-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [recharge-cash-box-movement.mapper.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-cash-box-movement-mapper-ts), [typeorm-recharge-cash-box.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts), [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts)

#### Clase `RechargeCashBoxMovementOrmEntity` (L14–69)

- **Decoradores:** `@Entity('recharge_cash_box_movements')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column amount: number`, `@Column movementType: CashBoxMovementType`, `@Column businessDate: string`, `@Column concept: string`, `@Column createdByUserId: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@CreateDateColumn createdAt: Date`, `@Column isVoided: boolean`, `@Column voidedAt: Date \| null`, `@Column voidedByUserId: string \| null`, `@ManyToOne voidedByUser: UserOrmEntity \| null`, `@Column voidReason: string \| null`
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-purchase-orm-entity-ts"></a>

### recharge-purchase.orm-entity.ts

- **Ruta:** [recharge-purchase.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/recharge-purchase.orm-entity.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/recharge-purchase.orm-entity.ts`, 35 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Read-only mapping of `recharge_purchases` — this table is still written EXCLUSIVELY by the `register_recharge_purchase` stored function (never `.save()`/`.insert()` from TypeScript, see `recharges.module.ts`'s own doc comment on why no ORM entity existed for it before).
- **Depende de (archivos del proyecto):** [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [typeorm-recharge-cash-box.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts), [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts)

#### Clase `RechargePurchaseOrmEntity` (L15–34)

- **Decoradores:** `@Entity('recharge_purchases')`
- **Propósito:** Read-only mapping of `recharge_purchases` — this table is still written EXCLUSIVELY by the `register_recharge_purchase` stored function (never `.save()`/`.insert()` from TypeScript, see `recharges.module.ts`'s own doc comment on why no ORM entity existed for it before). Added here, scoped to reads only, so `TypeOrmRechargeCashBoxRepository` can sum `amount` ("Monto de Compra" — never `credited_amount`, "Monto Acreditado", which only affects `recharge_daily_balances` and is irrelevant to Caja Contable) via TypeORM's query builder instead of raw SQL for this one piece.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column amount: number`, `@Column purchaseDate: string`, `@Column isVoided: boolean`
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-sim-purchase-orm-entity-ts"></a>

### recharge-sim-purchase.orm-entity.ts

- **Ruta:** [recharge-sim-purchase.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/recharge-sim-purchase.orm-entity.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/recharge-sim-purchase.orm-entity.ts`, 22 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Read-only mapping of `recharge_sim_purchases` — written exclusively by `register_recharge_sim_purchase`; added here, scoped to reads only, for `TypeOrmRechargeCashBoxRepository`'s "Compras de SIM" aggregation.
- **Depende de (archivos del proyecto):** [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [typeorm-recharge-cash-box.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts), [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts)

#### Clase `RechargeSimPurchaseOrmEntity` (L5–21)

- **Decoradores:** `@Entity('recharge_sim_purchases')`
- **Propósito:** Read-only mapping of `recharge_sim_purchases` — written exclusively by `register_recharge_sim_purchase`; added here, scoped to reads only, for `TypeOrmRechargeCashBoxRepository`'s "Compras de SIM" aggregation.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column totalCost: number`, `@Column purchaseDate: string`
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-sim-sale-orm-entity-ts"></a>

### recharge-sim-sale.orm-entity.ts

- **Ruta:** [recharge-sim-sale.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/recharge-sim-sale.orm-entity.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/recharge-sim-sale.orm-entity.ts`, 22 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Read-only mapping of `recharge_sim_sales` — written exclusively by `register_recharge_sim_sale`; added here, scoped to reads only, for `TypeOrmRechargeCashBoxRepository`'s "Ventas de SIM" aggregation.
- **Depende de (archivos del proyecto):** [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [typeorm-recharge-cash-box.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts), [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts)

#### Clase `RechargeSimSaleOrmEntity` (L5–21)

- **Decoradores:** `@Entity('recharge_sim_sales')`
- **Propósito:** Read-only mapping of `recharge_sim_sales` — written exclusively by `register_recharge_sim_sale`; added here, scoped to reads only, for `TypeOrmRechargeCashBoxRepository`'s "Ventas de SIM" aggregation.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column totalAmount: number`, `@Column saleDate: string`
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts"></a>

### typeorm-recharge-cash-box.repository.ts

- **Ruta:** [typeorm-recharge-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/typeorm-recharge-cash-box.repository.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/typeorm-recharge-cash-box.repository.ts`, 369 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Reads four already-existing, already-authoritative tables live — never a copy — for every auto-sourced Caja Contable figure (see the migration's own doc comment for why this design makes duplicate movements structurally impossible).
- **Depende de (archivos del proyecto):** [recharge-cash-box-movement.entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-entities-recharge-cash-box-movement-entity-ts), [recharge-cash-box-movement.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-repositories-recharge-cash-box-movement-repository-ts), [invalid-movement-amount.error.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-invalid-movement-amount-error-ts), [invalid-movement-concept.error.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-invalid-movement-concept-error-ts), [withdrawal-exceeds-balance.error.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-errors-withdrawal-exceeds-balance-error-ts), [recharge-sale.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-orm-entity-ts), [recharge-sim-sale.orm-entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-sim-sale-orm-entity-ts), [recharge-purchase.orm-entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-purchase-orm-entity-ts), [recharge-sim-purchase.orm-entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-sim-purchase-orm-entity-ts), [recharge-cash-box-movement.orm-entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-cash-box-movement-orm-entity-ts), [recharge-cash-box-movement.mapper.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-cash-box-movement-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts)

#### Clase `TypeOrmRechargeCashBoxRepository` (L39–368)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements RechargeCashBoxMovementRepository
- **Propósito:** Reads four already-existing, already-authoritative tables live — never a copy — for every auto-sourced Caja Contable figure (see the migration's own doc comment for why this design makes duplicate movements structurally impossible). `recharge_cash_box_movements` is this repository's own table to write to — holds BOTH manual movement types ("Aporte a Caja" / "Salida de Ganancia"), distinguished by `movementType`.
- **Dependencias inyectadas (constructor):** `@InjectRepository(RechargeCashBoxMovementOrmEntity) movementRepository: Repository<RechargeCashBoxMovementOrmEntity>`, `@InjectRepository(RechargeSaleOrmEntity) rechargeSaleRepository: Repository<RechargeSaleOrmEntity>`, `@InjectRepository(RechargeSimSaleOrmEntity) simSaleRepository: Repository<RechargeSimSaleOrmEntity>`, `@InjectRepository(RechargePurchaseOrmEntity) rechargePurchaseRepository: Repository<RechargePurchaseOrmEntity>`, `@InjectRepository(RechargeSimPurchaseOrmEntity) simPurchaseRepository: Repository<RechargeSimPurchaseOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `registerMovement` | método public async | 56–78 | `data: RegisterCashBoxMovementData` | `Promise<RechargeCashBoxMovement>` |
| `voidMovement` | método public async | 80–95 | `id: string`, `voidedBy: string`, `reason: string` | `Promise<RechargeCashBoxMovement>` |
| `findById` | método public async | 97–100 | `id: string` | `Promise<RechargeCashBoxMovement \| null>` |
| `fetchOrThrow` | método private async | 102–110 | `id: string` | `Promise<RechargeCashBoxMovement>` |
| `getDailyTotals` | método public async | 112–196 | `options: { beforeDate?: string; onDate?: string; }` | `Promise<CashBoxDailyTotals>` |
| `findMovements` | método public async | 220–343 | `options: FindCashBoxMovementsOptions` | `Promise<PaginatedCashBoxMovements>` |
| `translateCashBoxError` | método private | 346–367 | `error: unknown` | `unknown` |

##### `TypeOrmRechargeCashBoxRepository.registerMovement`

- **Firma:** `registerMovement(data: RegisterCashBoxMovementData): Promise<RechargeCashBoxMovement>` — [typeorm-recharge-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/typeorm-recharge-cash-box.repository.ts#L56) (L56–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.movementRepository.manager.query`, `this.translateCashBoxError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `register_recharge_cash_box_movement`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateCashBoxError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeCashBoxRepository.voidMovement`

- **Firma:** `voidMovement(id: string, voidedBy: string, reason: string): Promise<RechargeCashBoxMovement>` — [typeorm-recharge-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/typeorm-recharge-cash-box.repository.ts#L80) (L80–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.movementRepository.update`, `new Date`, `this.fetchOrThrow`
- **Efectos secundarios:** Actualiza estado (signals): `this.movementRepository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeCashBoxRepository.findById`

- **Firma:** `findById(id: string): Promise<RechargeCashBoxMovement \| null>` — [typeorm-recharge-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/typeorm-recharge-cash-box.repository.ts#L97) (L97–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.movementRepository.findOne`, `RechargeCashBoxMovementMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeCashBoxRepository.fetchOrThrow`

- **Firma:** `fetchOrThrow(id: string): Promise<RechargeCashBoxMovement>` — [typeorm-recharge-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/typeorm-recharge-cash-box.repository.ts#L102) (L102–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InternalServerErrorException( 'No se pudo recuperar el movimiento de caja recién registrado.', )`
- **Consumidores:** (mismo archivo)

##### `TypeOrmRechargeCashBoxRepository.getDailyTotals`

- **Firma:** `getDailyTotals(options: { beforeDate?: string; onDate?: string; }): Promise<CashBoxDailyTotals>` — [typeorm-recharge-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/typeorm-recharge-cash-box.repository.ts#L112) (L112–196)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `qb.andWhere`, `Promise.all`, `applyDateFilter`, `this.rechargeSaleRepository.createQueryBuilder('sale').select`, `this.rechargeSaleRepository.createQueryBuilder`, `this.simSaleRepository.createQueryBuilder('sale').select`, `this.simSaleRepository.createQueryBuilder`, `this.rechargePurchaseRepository.createQueryBuilder('purchase').select`, `this.rechargePurchaseRepository.createQueryBuilder`, `this.simPurchaseRepository.createQueryBuilder('purchase').select`, `this.simPurchaseRepository.createQueryBuilder`, `this.movementRepository.createQueryBuilder('movement').select`, `this.movementRepository.createQueryBuilder`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeCashBoxRepository.findMovements`

- **Firma:** `findMovements(options: FindCashBoxMovementsOptions): Promise<PaginatedCashBoxMovements>` — [typeorm-recharge-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/typeorm-recharge-cash-box.repository.ts#L220) (L220–343)
- **Propósito / descripción:** Builds the unified movement stream as a `UNION ALL` across the four live source tables plus non-voided manual movements (contributions AND withdrawals, both read from the same `recharge_cash_box_movements` table, split into two branches by `movement_type` so each keeps its own concept/label), grouped by (date, category) for the four auto-sourced ones — a single day's worth of, say, a dozen individual electronic recharges becomes one "Ventas de Recargas" row, matching the ticket's own example table — while each manual movement keeps its own row (already a discrete, deliberate action). The running "saldo" column is computed with a window function over the FULL unfiltered movement history first
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.movementRepository.manager.query`, `rows.map`, `parseFloat`, `parseInt`
- **Efectos secundarios:** Tablas en su SQL: `recharge_sales`, `recharge_sim_sales`, `recharge_purchases`, `recharge_sim_purchases`, `recharge_cash_box_movements`, `users`, `movements`, `running`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmRechargeCashBoxRepository.translateCashBoxError`

- **Firma:** `translateCashBoxError(error: unknown): unknown` — [typeorm-recharge-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/infrastructure/persistence/typeorm-recharge-cash-box.repository.ts#L346) (L346–367)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;'` → domain-error translation pattern as `translateBankDepositError`/`translatePurchaseError` — see those methods' own doc comments.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new InvalidMovementAmountError`, `new InvalidMovementConceptError`, `new WithdrawalExceedsBalanceError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts"></a>

### recharge-cash-box.controller.ts

- **Ruta:** [recharge-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/controllers/recharge-cash-box.controller.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/presentation/controllers/recharge-cash-box.controller.ts`, 127 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** "Gestión Caja Recargas" — a fully independent module (own domain/ application/infrastructure/presentation, own controller, no import of `RechargesModule`) backing an accumulated cash balance for Recargas Electrónicas y SIMs.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-cash-box-balance.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-balance-use-case-ts), [get-cash-box-movements.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-movements-use-case-ts), [register-cash-box-withdrawal.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-withdrawal-use-case-ts), [register-cash-box-contribution.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-contribution-use-case-ts), [void-cash-box-movement.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-void-cash-box-movement-use-case-ts), [cash-box-balance.query.dto.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-cash-box-balance-query-dto-ts), [cash-box-movements.query.dto.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-cash-box-movements-query-dto-ts), [register-cash-box-withdrawal.request.dto.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-register-cash-box-withdrawal-request-dto-ts), [register-cash-box-contribution.request.dto.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-register-cash-box-contribution-request-dto-ts), [void-cash-box-movement.request.dto.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-void-cash-box-movement-request-dto-ts), [cash-box-balance.response.dto.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-cash-box-balance-response-dto-ts) y 2 más
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharge-cash-box.module.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts)

#### Clase `RechargeCashBoxController` (L49–126)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('recharge-cash-box')`
- **Propósito:** "Gestión Caja Recargas" — a fully independent module (own domain/ application/infrastructure/presentation, own controller, no import of `RechargesModule`) backing an accumulated cash balance for Recargas Electrónicas y SIMs. It only ever READS `recharge_sales`/ `recharge_sim_sales`/`recharge_purchases`/`recharge_sim_purchases` (see `TypeOrmRechargeCashBoxRepository`'s own doc comment on why `RechargeSaleOrmEntity` is the one class imported across the module boundary) — never writes to any of them, and never touches `recharge_daily_balances`/cuadre/reconciliación. Reading the balance/historial is open to any authenticated, active account — but registering or anulando a manual movement ("Aporte a Caja" or "Salida de Ganancia") is a management action, gated `@Roles('ADMIN','SUPER_ADMIN')` at the method level, same pattern as `BankDepositsController.voidOperation`/día reopen-cancel elsewhere
- **Dependencias inyectadas (constructor):** `getCashBoxBalanceUseCase: GetCashBoxBalanceUseCase`, `getCashBoxMovementsUseCase: GetCashBoxMovementsUseCase`, `registerCashBoxWithdrawalUseCase: RegisterCashBoxWithdrawalUseCase`, `registerCashBoxContributionUseCase: RegisterCashBoxContributionUseCase`, `voidCashBoxMovementUseCase: VoidCashBoxMovementUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getBalance` | método public | 60–65 | `query: CashBoxBalanceQueryDto` | `Promise<CashBoxBalanceResponseDto>` |
| `getMovements` | método public | 67–78 | `query: CashBoxMovementsQueryDto` | `Promise<PaginatedCashBoxMovementsResponseDto>` |
| `registerWithdrawal` | método public | 80–94 | `dto: RegisterCashBoxWithdrawalRequestDto`, `userId: string` | `Promise<CashBoxMovementRecordResponseDto>` |
| `registerContribution` | método public | 96–110 | `dto: RegisterCashBoxContributionRequestDto`, `userId: string` | `Promise<CashBoxMovementRecordResponseDto>` |
| `voidMovement` | método public | 112–125 | `id: string`, `dto: VoidCashBoxMovementRequestDto`, `userId: string` | `Promise<CashBoxMovementRecordResponseDto>` |

##### `RechargeCashBoxController.getBalance`

- **Firma:** `getBalance(query: CashBoxBalanceQueryDto): Promise<CashBoxBalanceResponseDto>` — [recharge-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/controllers/recharge-cash-box.controller.ts#L60) (L60–65)
- **Decoradores:** `@Get('balance')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getCashBoxBalanceUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxController.getMovements`

- **Firma:** `getMovements(query: CashBoxMovementsQueryDto): Promise<PaginatedCashBoxMovementsResponseDto>` — [recharge-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/controllers/recharge-cash-box.controller.ts#L67) (L67–78)
- **Decoradores:** `@Get('movements')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getCashBoxMovementsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxController.registerWithdrawal`

- **Firma:** `registerWithdrawal(dto: RegisterCashBoxWithdrawalRequestDto, userId: string): Promise<CashBoxMovementRecordResponseDto>` — [recharge-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/controllers/recharge-cash-box.controller.ts#L80) (L80–94)
- **Decoradores:** `@Post('withdrawals')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerCashBoxWithdrawalUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxController.registerContribution`

- **Firma:** `registerContribution(dto: RegisterCashBoxContributionRequestDto, userId: string): Promise<CashBoxMovementRecordResponseDto>` — [recharge-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/controllers/recharge-cash-box.controller.ts#L96) (L96–110)
- **Decoradores:** `@Post('contributions')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerCashBoxContributionUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargeCashBoxController.voidMovement`

- **Firma:** `voidMovement(id: string, dto: VoidCashBoxMovementRequestDto, userId: string): Promise<CashBoxMovementRecordResponseDto>` — [recharge-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/controllers/recharge-cash-box.controller.ts#L112) (L112–125)
- **Decoradores:** `@Post('movements/:id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidCashBoxMovementUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-cash-box-balance-query-dto-ts"></a>

### cash-box-balance.query.dto.ts

- **Ruta:** [cash-box-balance.query.dto.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/cash-box-balance.query.dto.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/cash-box-balance.query.dto.ts`, 9 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** DTO de consulta: declara `CashBoxBalanceQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)

#### Clase `CashBoxBalanceQueryDto` (L3–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-cash-box-balance-response-dto-ts"></a>

### cash-box-balance.response.dto.ts

- **Ruta:** [cash-box-balance.response.dto.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/cash-box-balance.response.dto.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/cash-box-balance.response.dto.ts`, 18 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** DTO de respuesta: declara `CashBoxBalanceDetailResponseDto`, `CashBoxBalanceResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)

#### Clase `CashBoxBalanceDetailResponseDto` (L1–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CashBoxBalanceResponseDto` (L10–17)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-cash-box-movement-record-response-dto-ts"></a>

### cash-box-movement-record.response.dto.ts

- **Ruta:** [cash-box-movement-record.response.dto.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/cash-box-movement-record.response.dto.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/cash-box-movement-record.response.dto.ts`, 14 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** DTO de respuesta: declara `CashBoxMovementRecordResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)

#### Clase `CashBoxMovementRecordResponseDto` (L1–13)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-cash-box-movement-response-dto-ts"></a>

### cash-box-movement.response.dto.ts

- **Ruta:** [cash-box-movement.response.dto.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/cash-box-movement.response.dto.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/cash-box-movement.response.dto.ts`, 18 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** DTO de respuesta: declara `CashBoxMovementResponseDto`, `PaginatedCashBoxMovementsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)

#### Clase `CashBoxMovementResponseDto` (L1–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedCashBoxMovementsResponseDto` (L12–17)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-cash-box-movements-query-dto-ts"></a>

### cash-box-movements.query.dto.ts

- **Ruta:** [cash-box-movements.query.dto.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/cash-box-movements.query.dto.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/cash-box-movements.query.dto.ts`, 46 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** DTO de consulta: declara `CashBoxMovementsQueryDto`, `CASH_BOX_MOVEMENT_TYPES` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)

#### Clase `CashBoxMovementsQueryDto` (L20–45)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-register-cash-box-contribution-request-dto-ts"></a>

### register-cash-box-contribution.request.dto.ts

- **Ruta:** [register-cash-box-contribution.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/register-cash-box-contribution.request.dto.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/register-cash-box-contribution.request.dto.ts`, 28 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** DTO de entrada: declara `RegisterCashBoxContributionRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)

#### Clase `RegisterCashBoxContributionRequestDto` (L12–27)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-register-cash-box-withdrawal-request-dto-ts"></a>

### register-cash-box-withdrawal.request.dto.ts

- **Ruta:** [register-cash-box-withdrawal.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/register-cash-box-withdrawal.request.dto.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/register-cash-box-withdrawal.request.dto.ts`, 28 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** DTO de entrada: declara `RegisterCashBoxWithdrawalRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)

#### Clase `RegisterCashBoxWithdrawalRequestDto` (L12–27)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-dtos-void-cash-box-movement-request-dto-ts"></a>

### void-cash-box-movement.request.dto.ts

- **Ruta:** [void-cash-box-movement.request.dto.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/void-cash-box-movement.request.dto.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/presentation/dtos/void-cash-box-movement.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** Mirrors `VoidBankDepositOperationRequestDto` — same mandatory-reason shape, kept as this module's own copy rather than a cross-module import.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)

#### Clase `VoidCashBoxMovementRequestDto` (L4–10)

- **Propósito:** Mirrors `VoidBankDepositOperationRequestDto` — same mandatory-reason shape, kept as this module's own copy rather than a cross-module import. Works for either movement type.
<a id="f-comercial-jhoel-api-src-modules-recharge-cash-box-recharge-cash-box-module-ts"></a>

### recharge-cash-box.module.ts

- **Ruta:** [recharge-cash-box.module.ts](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/recharge-cash-box.module.ts) (`comercial-jhoel-api/src/modules/recharge-cash-box/recharge-cash-box.module.ts`, 64 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `recharge-cash-box`
- **Responsabilidad:** "Gestión Caja Recargas" — fully independent from `RechargesModule` (moved out of it per an explicit follow-up request: this used to be a section embedded inside the Recargas Electrónicas page/module; it's now its own Sistema-level module, with its own sidebar entry, route, and backend module boundary).
- **Depende de (archivos del proyecto):** [recharge-cash-box-movement.orm-entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-cash-box-movement-orm-entity-ts), [recharge-purchase.orm-entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-purchase-orm-entity-ts), [recharge-sim-sale.orm-entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-sim-sale-orm-entity-ts), [recharge-sim-purchase.orm-entity.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-recharge-sim-purchase-orm-entity-ts), [recharge-sale.orm-entity.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-infrastructure-persistence-recharge-sale-orm-entity-ts), [typeorm-recharge-cash-box.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-infrastructure-persistence-typeorm-recharge-cash-box-repository-ts), [recharge-cash-box-movement.repository.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-domain-repositories-recharge-cash-box-movement-repository-ts), [get-cash-box-balance.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-balance-use-case-ts), [get-cash-box-movements.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-get-cash-box-movements-use-case-ts), [register-cash-box-withdrawal.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-withdrawal-use-case-ts), [register-cash-box-contribution.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-register-cash-box-contribution-use-case-ts), [void-cash-box-movement.use-case.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-application-use-cases-void-cash-box-movement-use-case-ts), [recharge-cash-box.controller.ts](recharge-cash-box.md#f-comercial-jhoel-api-src-modules-recharge-cash-box-presentation-controllers-recharge-cash-box-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [alerts.module.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts)

#### Clase `RechargeCashBoxModule` (L34–63)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([ RechargeCashBoxMovementOrmEntity, RechargePurchaseOrmEntity, RechargeSimSaleOrmEntity, RechargeSimPurchaseOrmEnti`
- **Propósito:** "Gestión Caja Recargas" — fully independent from `RechargesModule` (moved out of it per an explicit follow-up request: this used to be a section embedded inside the Recargas Electrónicas page/module; it's now its own Sistema-level module, with its own sidebar entry, route, and backend module boundary). `RechargeSaleOrmEntity` is registered a SECOND time here, read-only — the exact same pattern `DashboardModule`/ `ReportsModule` already use to read another module's tables without importing that module wholesale (see `TypeOrmRechargeCashBoxRepository`'s own doc comment). No other cross-module import exists in this module. "Aporte a Caja" (income) and "Salida de Ganancia" (expense) — the two manual movement types — share one table (`recharge_cash_box_movements`), one repository, one stored function, and one void use case; only their registration use cases differ, mirroring Kardex financiero
