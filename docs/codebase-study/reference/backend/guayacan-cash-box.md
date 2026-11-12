# Módulo backend `guayacan-cash-box`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/guayacan-cash-box/commissions` | [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L67) `GuayacanCashBoxController.commissions` | [ListGuayacanCommissionsUseCase](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-commissions-use-case-ts) | `GuayacanCashBoxRepository`.findCommissions [guayacan_commissions, bank_deposit_operations, transaction_types, users] | UseGuards(JwtAuthGuard) | `GuayacanCashBoxService.getCommissions` |
| `GET /api/guayacan-cash-box/counts` | [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L73) `GuayacanCashBoxController.counts` | [ListGuayacanCashCountsUseCase](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-counts-use-case-ts) | `GuayacanCashBoxRepository`.findCounts [guayacan_cash_counts] | UseGuards(JwtAuthGuard) | `GuayacanCashBoxService.getCounts` |
| `GET /api/guayacan-cash-box/counts/users` | [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L78) `GuayacanCashBoxController.countUsers` | [ListGuayacanCashCountUsersUseCase](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-count-users-use-case-ts) | `GuayacanCashBoxRepository`.findCountUsers [guayacan_cash_counts, users] | UseGuards(JwtAuthGuard) | `GuayacanCashBoxService.getCountUsers` |
| `GET /api/guayacan-cash-box/summary` | [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L83) `GuayacanCashBoxController.summary` | [GetGuayacanCashBoxSummaryUseCase](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-box-summary-use-case-ts) | `GuayacanCashBoxRepository`.getSummary [transaction_banks, guayacan_cash_movements] | UseGuards(JwtAuthGuard) | `GuayacanCashBoxService.getSummary` |
| `GET /api/guayacan-cash-box/movements` | [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L88) `GuayacanCashBoxController.movements` | [ListGuayacanCashMovementsUseCase](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-movements-use-case-ts) | `GuayacanCashBoxRepository`.findMovements [guayacan_cash_movements] | UseGuards(JwtAuthGuard) | `GuayacanCashBoxService.getMovements` |
| `GET /api/guayacan-cash-box/movements/:id` | [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L93) `GuayacanCashBoxController.movement` | [GetGuayacanCashMovementUseCase](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-movement-use-case-ts) | `GuayacanCashBoxRepository`.findMovementById [guayacan_cash_movement_details, bank_deposit_operations, transaction_types, transaction_banks, bank_deposit_cash_details] | UseGuards(JwtAuthGuard) | `GuayacanCashBoxService.getMovement` |
| `POST /api/guayacan-cash-box/movements` | [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L98) `GuayacanCashBoxController.registerMovement` | [RegisterGuayacanCashMovementUseCase](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-movement-use-case-ts) | `GuayacanCashBoxRepository`.registerMovement/findMovementById → `register_guayacan_cash_movement` [guayacan_cash_movement_details, bank_deposit_operations, transaction_types, transaction_banks, bank_deposit_cash_details] | UseGuards(JwtAuthGuard) | `GuayacanCashBoxService.registerMovement` |
| `POST /api/guayacan-cash-box/adjustments` | [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L107) `GuayacanCashBoxController.registerAdjustment` | [RegisterGuayacanCashAdjustmentUseCase](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-adjustment-use-case-ts) | `GuayacanCashBoxRepository`.registerMovement/findMovementById → `register_guayacan_cash_movement` [guayacan_cash_movement_details, bank_deposit_operations, transaction_types, transaction_banks, bank_deposit_cash_details] | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `GuayacanCashBoxService.registerAdjustment` |
| `POST /api/guayacan-cash-box/movements/:id/void` | [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L118) `GuayacanCashBoxController.voidMovement` | [VoidGuayacanCashMovementUseCase](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-void-guayacan-cash-movement-use-case-ts) | `GuayacanCashBoxRepository`.voidMovement/findMovementById → `void_guayacan_cash_movement` [guayacan_cash_movement_details, bank_deposit_operations, transaction_types, transaction_banks, bank_deposit_cash_details] | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `GuayacanCashBoxService.voidMovement` |
| `GET /api/guayacan-cash-box/counts/latest` | [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L129) `GuayacanCashBoxController.latestCount` | [GetLatestGuayacanCashCountUseCase](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-latest-guayacan-cash-count-use-case-ts) | `GuayacanCashBoxRepository`.findLatestCount [guayacan_cash_counts] | UseGuards(JwtAuthGuard) | `GuayacanCashBoxService.getLatestCount` |
| `GET /api/guayacan-cash-box/counts/:id` | [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L134) `GuayacanCashBoxController.count` | [GetGuayacanCashCountUseCase](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-count-use-case-ts) | `GuayacanCashBoxRepository`.findCountById [guayacan_cash_count_details] | UseGuards(JwtAuthGuard) | `GuayacanCashBoxService.getCount` |
| `POST /api/guayacan-cash-box/counts` | [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L139) `GuayacanCashBoxController.registerCount` | [RegisterGuayacanCashCountUseCase](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-count-use-case-ts) | `GuayacanCashBoxRepository`.registerCount/findCountById → `pg_advisory_xact_lock` [guayacan_cash_counts, guayacan_cash_movements, guayacan_cash_count_details] | UseGuards(JwtAuthGuard) | `GuayacanCashBoxService.registerCount` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [get-guayacan-cash-box-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-box-summary-use-case-ts) | .ts | Caso de uso | Aplicación | Tarjetas e indicadores: saldo del Kardex + día / semana (lunes–domingo) / mes de Guatemala. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-guayacan-cash-count.use-case.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-count-use-case-ts) | .ts | Caso de uso | Aplicación | Detalle histórico e inmutable de un arqueo — todas las denominaciones tal como se guardaron. | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-guayacan-cash-movement.use-case.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-movement-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetGuayacanCashMovementUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-latest-guayacan-cash-count.use-case.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-latest-guayacan-cash-count-use-case-ts) | .ts | Caso de uso | Aplicación | Último arqueo registrado (`null` si nunca se ha contado) — el desglose "actual" de billetes y monedas. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [guayacan-cash-box.use-cases.spec.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-guayacan-cash-box-use-cases-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `buildRepository`, `MOVEMENT` (sin comentario de documentación en el código). | 11 internas | 0 | Soporte (pruebas) |
| [list-guayacan-cash-count-users.use-case.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-count-users-use-case-ts) | .ts | Caso de uso | Aplicación | Usuarios que han registrado arqueos — opciones del filtro "Usuario". | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-guayacan-cash-counts.use-case.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-counts-use-case-ts) | .ts | Caso de uso | Aplicación | Historial de arqueos (Cajas y Cierres → Arqueos — Guayacán): más reciente primero, paginado en SQL. | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [list-guayacan-cash-movements.use-case.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-movements-use-case-ts) | .ts | Caso de uso | Aplicación | Kardex paginado en SQL, más reciente primero. | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [list-guayacan-commissions.use-case.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-commissions-use-case-ts) | .ts | Caso de uso | Aplicación | Comisiones de Cooperativa Guayacán — concepto propio, fuera del efectivo de caja. | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [register-guayacan-cash-adjustment.use-case.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-adjustment-use-case-ts) | .ts | Caso de uso | Aplicación | Ajuste autorizado (admin, `@Roles` en el controlador) — la única forma de corregir una diferencia entre arqueo y Kardex. | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [register-guayacan-cash-count.use-case.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-count-use-case-ts) | .ts | Caso de uso | Aplicación | "Conteo de efectivo en caja" (arqueo). | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [register-guayacan-cash-movement.use-case.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-movement-use-case-ts) | .ts | Caso de uso | Aplicación | "+ Ingreso a caja" / "− Egreso de caja". | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [void-guayacan-cash-movement.use-case.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-void-guayacan-cash-movement-use-case-ts) | .ts | Caso de uso | Aplicación | Anular (admin) un INGRESO/EGRESO/AJUSTE: el original queda ANULADO y se registra el movimiento inverso hoy. | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [cash-denominations.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-cash-denominations-ts) | .ts | Utilidad | Aplicación | Utilidad: declara `round2`, `normalizeDenominations`, `denominationsTotal`, `assertBreakdownMatches`, `resolveBusinessDate` (sin comentario de documentación en el código). | 3 internas | 4 | Media (4 consumidores) |
| [today-iso-date.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-today-iso-date-ts) | .ts | Utilidad | Aplicación | `yyyy-MM-dd` in local server time (`TZ=America/Guatemala`) — small per-feature copy of the identical helper in `modules/bank-deposits`, following this codebase's "small per-feature copy over cross-feature coupling" convention for a helper this trivial. | 0 internas | 3 | Media (3 consumidores) |
| [guayacan-cash-box.errors.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts) | .ts | Errores de dominio | Dominio | `RAISE EXCEPTION '&lt;CODE&gt;:...'` de las funciones de la caja → error de dominio. | 1 internas | 12 | Alta (12 consumidores) |
| [guayacan-cash-box.repository.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `GuayacanCashDenominationData`, `GuayacanCashDenominationRow`, `GuayacanCashMovementRow`, `GuayacanCashMovementDetail`, `RegisterGuayacanCashMovementData` (sin comentario de documentación en el código). | 0 internas | 17 | Alta (17 consumidores) |
| [guayacan-cash-box.module.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts) | .ts | Módulo | Arranque / configuración | "Cuadre de Caja Guayacán" — módulo independiente (no importa `BankDepositsModule`; solo LEE `bank_deposit_operations` para contar transacciones). | 15 internas; ext.: @nestjs/common | 1 | Baja (1 consumidores) |
| [typeorm-guayacan-cash-box.repository.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-infrastructure-persistence-typeorm-guayacan-cash-box-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Caja Guayacán sobre SQL crudo: TODA escritura del Kardex pasa por las funciones de la migración `CreateGuayacanCashBox` (lock global de la caja, saldo leído bajo lock) — este repositorio nunca inserta movimientos ni calcula saldos por su cuenta. | 2 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [guayacan-cash-box.controller.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts) | .ts | Controlador | Presentación | "Cuadre de Caja Guayacán" — Kardex propio, independiente de Recargas, Caja de Ventas y saldos bancarios. | 17 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [guayacan-cash-box.request.dto.ts](#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-dtos-guayacan-cash-box-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `GuayacanCashDenominationRequestDto`, `GuayacanCashMovementBaseRequestDto`, `RegisterGuayacanCashMovementRequestDto`, `RegisterGuayacanCashAdjustmentRequestDto`, `VoidGuayacanCashMovementRequestDto` (sin comentario de documentación en el código). | 2 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-box-summary-use-case-ts"></a>

### get-guayacan-cash-box-summary.use-case.ts

- **Ruta:** [get-guayacan-cash-box-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/get-guayacan-cash-box-summary.use-case.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/get-guayacan-cash-box-summary.use-case.ts`, 25 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Tarjetas e indicadores: saldo del Kardex + día / semana (lunes–domingo) / mes de Guatemala.
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts), [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

#### Clase `GetGuayacanCashBoxSummaryUseCase` (L14–24)

- **Decoradores:** `@Injectable()`
- **Propósito:** Tarjetas e indicadores: saldo del Kardex + día / semana (lunes–domingo) / mes de Guatemala. Solo cambia el RANGO consultado — nada se reinicia ni se borra al cambiar de período. Transacciones = `SUM(transaction_count)` de operaciones Guayacán no anuladas; comisión = comisiones vigentes.
- **Dependencias inyectadas (constructor):** `@Inject(GUAYACAN_CASH_BOX_REPOSITORY) repository: GuayacanCashBoxRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 21–23 | — | `Promise<GuayacanCashBoxSummary>` |

##### `GetGuayacanCashBoxSummaryUseCase.execute`

- **Firma:** `execute(): Promise<GuayacanCashBoxSummary>` — [get-guayacan-cash-box-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/get-guayacan-cash-box-summary.use-case.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.getSummary`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-count-use-case-ts"></a>

### get-guayacan-cash-count.use-case.ts

- **Ruta:** [get-guayacan-cash-count.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/get-guayacan-cash-count.use-case.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/get-guayacan-cash-count.use-case.ts`, 25 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Detalle histórico e inmutable de un arqueo — todas las denominaciones tal como se guardaron.
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [guayacan-cash-box.errors.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [guayacan-cash-box.use-cases.spec.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-guayacan-cash-box-use-cases-spec-ts), [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts), [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

#### Clase `GetGuayacanCashCountUseCase` (L10–24)

- **Decoradores:** `@Injectable()`
- **Propósito:** Detalle histórico e inmutable de un arqueo — todas las denominaciones tal como se guardaron.
- **Dependencias inyectadas (constructor):** `@Inject(GUAYACAN_CASH_BOX_REPOSITORY) repository: GuayacanCashBoxRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–23 | `id: string` | `Promise<GuayacanCashCountRow>` |

##### `GetGuayacanCashCountUseCase.execute`

- **Firma:** `execute(id: string): Promise<GuayacanCashCountRow>` — [get-guayacan-cash-count.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/get-guayacan-cash-count.use-case.ts#L17) (L17–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findCountById`, `new GuayacanCountNotFoundError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new GuayacanCountNotFoundError()`
- **Consumidores:** [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-movement-use-case-ts"></a>

### get-guayacan-cash-movement.use-case.ts

- **Ruta:** [get-guayacan-cash-movement.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/get-guayacan-cash-movement.use-case.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/get-guayacan-cash-movement.use-case.ts`, 24 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Caso de uso: declara `GetGuayacanCashMovementUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [guayacan-cash-box.errors.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts), [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

#### Clase `GetGuayacanCashMovementUseCase` (L9–23)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(GUAYACAN_CASH_BOX_REPOSITORY) repository: GuayacanCashBoxRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 16–22 | `id: string` | `Promise<GuayacanCashMovementDetail>` |

##### `GetGuayacanCashMovementUseCase.execute`

- **Firma:** `execute(id: string): Promise<GuayacanCashMovementDetail>` — [get-guayacan-cash-movement.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/get-guayacan-cash-movement.use-case.ts#L16) (L16–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findMovementById`, `new GuayacanMovementNotFoundError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new GuayacanMovementNotFoundError(id)`
- **Consumidores:** [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-latest-guayacan-cash-count-use-case-ts"></a>

### get-latest-guayacan-cash-count.use-case.ts

- **Ruta:** [get-latest-guayacan-cash-count.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/get-latest-guayacan-cash-count.use-case.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/get-latest-guayacan-cash-count.use-case.ts`, 20 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Último arqueo registrado (`null` si nunca se ha contado) — el desglose "actual" de billetes y monedas.
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts), [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

#### Clase `GetLatestGuayacanCashCountUseCase` (L9–19)

- **Decoradores:** `@Injectable()`
- **Propósito:** Último arqueo registrado (`null` si nunca se ha contado) — el desglose "actual" de billetes y monedas.
- **Dependencias inyectadas (constructor):** `@Inject(GUAYACAN_CASH_BOX_REPOSITORY) repository: GuayacanCashBoxRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 16–18 | — | `Promise<GuayacanCashCountRow \| null>` |

##### `GetLatestGuayacanCashCountUseCase.execute`

- **Firma:** `execute(): Promise<GuayacanCashCountRow \| null>` — [get-latest-guayacan-cash-count.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/get-latest-guayacan-cash-count.use-case.ts#L16) (L16–18)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findLatestCount`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-guayacan-cash-box-use-cases-spec-ts"></a>

### guayacan-cash-box.use-cases.spec.ts

- **Ruta:** [guayacan-cash-box.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/guayacan-cash-box.use-cases.spec.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/guayacan-cash-box.use-cases.spec.ts`, 354 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Prueba unitaria: declara `buildRepository`, `MOVEMENT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [register-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-movement-use-case-ts), [register-guayacan-cash-adjustment.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-adjustment-use-case-ts), [void-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-void-guayacan-cash-movement-use-case-ts), [list-guayacan-cash-movements.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-movements-use-case-ts), [register-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-count-use-case-ts), [list-guayacan-cash-counts.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-counts-use-case-ts), [get-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-count-use-case-ts), [list-guayacan-commissions.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-commissions-use-case-ts), [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [guayacan-cash-box.errors.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts), [today-iso-date.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-today-iso-date-ts)
- **Consumidores:** —
#### Función `buildRepository` (L28–48)

- **Tipo:** función local del archivo
- **Firma:** `buildRepository(): jest.Mocked<GuayacanCashBoxRepository>` — [guayacan-cash-box.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/guayacan-cash-box.use-cases.spec.ts#L28)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `jest.fn().mockResolvedValue`, `jest.fn`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-count-users-use-case-ts"></a>

### list-guayacan-cash-count-users.use-case.ts

- **Ruta:** [list-guayacan-cash-count-users.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/list-guayacan-cash-count-users.use-case.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/list-guayacan-cash-count-users.use-case.ts`, 17 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Usuarios que han registrado arqueos — opciones del filtro "Usuario".
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts), [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

#### Clase `ListGuayacanCashCountUsersUseCase` (L6–16)

- **Decoradores:** `@Injectable()`
- **Propósito:** Usuarios que han registrado arqueos — opciones del filtro "Usuario".
- **Dependencias inyectadas (constructor):** `@Inject(GUAYACAN_CASH_BOX_REPOSITORY) repository: GuayacanCashBoxRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 13–15 | — | `Promise<{ id: string; username: string }[]>` |

##### `ListGuayacanCashCountUsersUseCase.execute`

- **Firma:** `execute(): Promise<{ id: string; username: string }[]>` — [list-guayacan-cash-count-users.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/list-guayacan-cash-count-users.use-case.ts#L13) (L13–15)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findCountUsers`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-counts-use-case-ts"></a>

### list-guayacan-cash-counts.use-case.ts

- **Ruta:** [list-guayacan-cash-counts.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/list-guayacan-cash-counts.use-case.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/list-guayacan-cash-counts.use-case.ts`, 61 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Historial de arqueos (Cajas y Cierres → Arqueos — Guayacán): más reciente primero, paginado en SQL.
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [guayacan-cash-box.errors.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [guayacan-cash-box.use-cases.spec.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-guayacan-cash-box-use-cases-spec-ts), [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts), [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

#### Clase `ListGuayacanCashCountsUseCase` (L23–60)

- **Decoradores:** `@Injectable()`
- **Propósito:** Historial de arqueos (Cajas y Cierres → Arqueos — Guayacán): más reciente primero, paginado en SQL. Filtros: fecha (Guatemala), usuario y número. Un número que no existe devuelve vacío, nunca "todos".
- **Dependencias inyectadas (constructor):** `@Inject(GUAYACAN_CASH_BOX_REPOSITORY) repository: GuayacanCashBoxRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 30–59 | `input: { startDate?: string; endDate?: string; userId?: string; number?: string; page?: number; limit?: number; }` | `Promise<PaginatedGuayacanCashCounts>` |

##### `ListGuayacanCashCountsUseCase.execute`

- **Firma:** `execute(input: { startDate?: string; endDate?: string; userId?: string; number?: string; page?: number; limit?: number; }): Promise<PaginatedGuayacanCashCounts>` — [list-guayacan-cash-counts.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/list-guayacan-cash-counts.use-case.ts#L30) (L30–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new GuayacanInvalidDateError`, `Math.min`, `input.number?.trim`, `parseCountNumber`, `Promise.resolve`, `this.repository.findCounts`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new GuayacanInvalidDateError()`
- **Consumidores:** [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

#### Función `parseCountNumber` (L13–16)

- **Tipo:** función exportada
- **Firma:** `parseCountNumber(value: string \| undefined): number \| null` — [list-guayacan-cash-counts.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/list-guayacan-cash-counts.use-case.ts#L13)
- **Propósito / descripción:** "ARQ-0007", "arq 7" o "7" → 7; `null` si no trae un número.
- **Dependencias:** `value?.match`, `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-movements-use-case-ts"></a>

### list-guayacan-cash-movements.use-case.ts

- **Ruta:** [list-guayacan-cash-movements.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/list-guayacan-cash-movements.use-case.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/list-guayacan-cash-movements.use-case.ts`, 45 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Kardex paginado en SQL, más reciente primero.
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [guayacan-cash-box.errors.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [guayacan-cash-box.use-cases.spec.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-guayacan-cash-box-use-cases-spec-ts), [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts), [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

#### Clase `ListGuayacanCashMovementsUseCase` (L14–44)

- **Decoradores:** `@Injectable()`
- **Propósito:** Kardex paginado en SQL, más reciente primero.
- **Dependencias inyectadas (constructor):** `@Inject(GUAYACAN_CASH_BOX_REPOSITORY) repository: GuayacanCashBoxRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 21–43 | `input: { startDate?: string; endDate?: string; movementType?: GuayacanCashMovementType; page?: number; limit?: number; }` | `Promise<PaginatedGuayacanCashMovements>` |

##### `ListGuayacanCashMovementsUseCase.execute`

- **Firma:** `execute(input: { startDate?: string; endDate?: string; movementType?: GuayacanCashMovementType; page?: number; limit?: number; }): Promise<PaginatedGuayacanCashMovements>` — [list-guayacan-cash-movements.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/list-guayacan-cash-movements.use-case.ts#L21) (L21–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new GuayacanInvalidDateError`, `Math.min`, `this.repository.findMovements`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new GuayacanInvalidDateError()`
- **Consumidores:** [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-commissions-use-case-ts"></a>

### list-guayacan-commissions.use-case.ts

- **Ruta:** [list-guayacan-commissions.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/list-guayacan-commissions.use-case.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/list-guayacan-commissions.use-case.ts`, 42 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Comisiones de Cooperativa Guayacán — concepto propio, fuera del efectivo de caja.
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [guayacan-cash-box.errors.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [guayacan-cash-box.use-cases.spec.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-guayacan-cash-box-use-cases-spec-ts), [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts), [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

#### Clase `ListGuayacanCommissionsUseCase` (L13–41)

- **Decoradores:** `@Injectable()`
- **Propósito:** Comisiones de Cooperativa Guayacán — concepto propio, fuera del efectivo de caja. Más reciente primero.
- **Dependencias inyectadas (constructor):** `@Inject(GUAYACAN_CASH_BOX_REPOSITORY) repository: GuayacanCashBoxRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 20–40 | `input: { startDate?: string; endDate?: string; page?: number; limit?: number; }` | `Promise<PaginatedGuayacanCommissions>` |

##### `ListGuayacanCommissionsUseCase.execute`

- **Firma:** `execute(input: { startDate?: string; endDate?: string; page?: number; limit?: number; }): Promise<PaginatedGuayacanCommissions>` — [list-guayacan-commissions.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/list-guayacan-commissions.use-case.ts#L20) (L20–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new GuayacanInvalidDateError`, `Math.min`, `this.repository.findCommissions`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new GuayacanInvalidDateError()`
- **Consumidores:** [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-adjustment-use-case-ts"></a>

### register-guayacan-cash-adjustment.use-case.ts

- **Ruta:** [register-guayacan-cash-adjustment.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/register-guayacan-cash-adjustment.use-case.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/register-guayacan-cash-adjustment.use-case.ts`, 63 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Ajuste autorizado (admin, `@Roles` en el controlador) — la única forma de corregir una diferencia entre arqueo y Kardex.
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [guayacan-cash-box.errors.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts), [cash-denominations.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-cash-denominations-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [guayacan-cash-box.use-cases.spec.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-guayacan-cash-box-use-cases-spec-ts), [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts), [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

**Interfaces, tipos y enums:**

- `interface RegisterGuayacanCashAdjustmentInput` (L14): sin documentación — miembros: `amount`, `businessDate`, `concept`, `reason`, `notes`, `clientRequestId`, `userId`

#### Clase `RegisterGuayacanCashAdjustmentUseCase` (L26–62)

- **Decoradores:** `@Injectable()`
- **Propósito:** Ajuste autorizado (admin, `@Roles` en el controlador) — la única forma de corregir una diferencia entre arqueo y Kardex. Motivo obligatorio.
- **Dependencias inyectadas (constructor):** `@Inject(GUAYACAN_CASH_BOX_REPOSITORY) repository: GuayacanCashBoxRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 33–61 | `input: RegisterGuayacanCashAdjustmentInput` | `Promise<GuayacanCashMovementDetail>` |

##### `RegisterGuayacanCashAdjustmentUseCase.execute`

- **Firma:** `execute(input: RegisterGuayacanCashAdjustmentInput): Promise<GuayacanCashMovementDetail>` — [register-guayacan-cash-adjustment.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/register-guayacan-cash-adjustment.use-case.ts#L33) (L33–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Number.isFinite`, `new GuayacanInvalidAmountError`, `input.reason?.trim`, `new GuayacanReasonRequiredError`, `this.repository.registerMovement`, `resolveBusinessDate`, `input.concept.trim`, `input.notes?.trim`, `this.repository.findMovementById`, `new GuayacanMovementNotFoundError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new GuayacanInvalidAmountError()`, `new GuayacanReasonRequiredError()`, `new GuayacanMovementNotFoundError(id)`
- **Consumidores:** [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-count-use-case-ts"></a>

### register-guayacan-cash-count.use-case.ts

- **Ruta:** [register-guayacan-cash-count.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/register-guayacan-cash-count.use-case.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/register-guayacan-cash-count.use-case.ts`, 47 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** "Conteo de efectivo en caja" (arqueo).
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [guayacan-cash-box.errors.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts), [cash-denominations.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-cash-denominations-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [guayacan-cash-box.use-cases.spec.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-guayacan-cash-box-use-cases-spec-ts), [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts), [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

#### Clase `RegisterGuayacanCashCountUseCase` (L19–46)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Conteo de efectivo en caja" (arqueo). Guarda billetes/monedas contados y la diferencia contra el saldo del Kardex en ese instante — NUNCA modifica el saldo. Una diferencia se corrige con un ajuste autorizado.
- **Dependencias inyectadas (constructor):** `@Inject(GUAYACAN_CASH_BOX_REPOSITORY) repository: GuayacanCashBoxRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 26–45 | `input: { details: GuayacanCashDenominationData[]; businessDate?: string; notes?: string \| null; clientRequestId?: string \| null; userId: string; }` | `Promise<GuayacanCashCountRow>` |

##### `RegisterGuayacanCashCountUseCase.execute`

- **Firma:** `execute(input: { details: GuayacanCashDenominationData[]; businessDate?: string; notes?: string \| null; clientRequestId?: string \| null; userId: string; }): Promise<GuayacanCashCountRow>` — [register-guayacan-cash-count.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/register-guayacan-cash-count.use-case.ts#L26) (L26–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.registerCount`, `normalizeDenominations`, `resolveBusinessDate`, `input.notes?.trim`, `this.repository.findCountById`, `new GuayacanCountNotFoundError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new GuayacanCountNotFoundError()`
- **Consumidores:** [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-movement-use-case-ts"></a>

### register-guayacan-cash-movement.use-case.ts

- **Ruta:** [register-guayacan-cash-movement.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/register-guayacan-cash-movement.use-case.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/register-guayacan-cash-movement.use-case.ts`, 75 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** "+ Ingreso a caja" / "− Egreso de caja".
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [guayacan-cash-box.errors.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts), [cash-denominations.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-cash-denominations-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [guayacan-cash-box.use-cases.spec.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-guayacan-cash-box-use-cases-spec-ts), [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts), [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

**Interfaces, tipos y enums:**

- `interface RegisterGuayacanCashMovementInput` (L18): sin documentación — miembros: `movementType`, `amount`, `businessDate`, `concept`, `reason`, `notes`, `cashDetails`, `clientRequestId`, `userId`

#### Clase `RegisterGuayacanCashMovementUseCase` (L38–74)

- **Decoradores:** `@Injectable()`
- **Propósito:** "+ Ingreso a caja" / "− Egreso de caja". Operativo (cualquier cuenta activa, igual que Transaccionar). El saldo anterior/nuevo, el bloqueo y la regla "el egreso no supera el efectivo" viven en `register_guayacan_cash_movement`; aquí solo se normaliza la entrada y se dan mensajes claros. `clientRequestId` (uno por modal abierto) hace idempotente el doble clic / reintento.
- **Dependencias inyectadas (constructor):** `@Inject(GUAYACAN_CASH_BOX_REPOSITORY) repository: GuayacanCashBoxRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 45–73 | `input: RegisterGuayacanCashMovementInput` | `Promise<GuayacanCashMovementDetail>` |

##### `RegisterGuayacanCashMovementUseCase.execute`

- **Firma:** `execute(input: RegisterGuayacanCashMovementInput): Promise<GuayacanCashMovementDetail>` — [register-guayacan-cash-movement.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/register-guayacan-cash-movement.use-case.ts#L45) (L45–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new GuayacanInvalidAmountError`, `normalizeDenominations`, `assertBreakdownMatches`, `this.repository.registerMovement`, `resolveBusinessDate`, `input.concept.trim`, `input.reason?.trim`, `input.notes?.trim`, `this.repository.findMovementById`, `new GuayacanMovementNotFoundError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new GuayacanInvalidAmountError()`, `new GuayacanMovementNotFoundError(id)`
- **Consumidores:** [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-void-guayacan-cash-movement-use-case-ts"></a>

### void-guayacan-cash-movement.use-case.ts

- **Ruta:** [void-guayacan-cash-movement.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/void-guayacan-cash-movement.use-case.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/void-guayacan-cash-movement.use-case.ts`, 44 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Anular (admin) un INGRESO/EGRESO/AJUSTE: el original queda ANULADO y se registra el movimiento inverso hoy.
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [guayacan-cash-box.errors.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts), [today-iso-date.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [guayacan-cash-box.use-cases.spec.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-guayacan-cash-box-use-cases-spec-ts), [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts), [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

#### Clase `VoidGuayacanCashMovementUseCase` (L14–43)

- **Decoradores:** `@Injectable()`
- **Propósito:** Anular (admin) un INGRESO/EGRESO/AJUSTE: el original queda ANULADO y se registra el movimiento inverso hoy. Nunca edita ni borra.
- **Dependencias inyectadas (constructor):** `@Inject(GUAYACAN_CASH_BOX_REPOSITORY) repository: GuayacanCashBoxRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 21–42 | `input: { id: string; reason: string; userId: string; }` | `Promise<GuayacanCashMovementDetail>` |

##### `VoidGuayacanCashMovementUseCase.execute`

- **Firma:** `execute(input: { id: string; reason: string; userId: string; }): Promise<GuayacanCashMovementDetail>` — [void-guayacan-cash-movement.use-case.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/use-cases/void-guayacan-cash-movement.use-case.ts#L21) (L21–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.reason?.trim`, `new GuayacanReasonRequiredError`, `this.repository.voidMovement`, `todayIsoDate`, `this.repository.findMovementById`, `new GuayacanMovementNotFoundError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new GuayacanReasonRequiredError()`, `new GuayacanMovementNotFoundError(input.id)`
- **Consumidores:** [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-cash-denominations-ts"></a>

### cash-denominations.ts

- **Ruta:** [cash-denominations.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/utils/cash-denominations.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/utils/cash-denominations.ts`, 75 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Utilidad: declara `round2`, `normalizeDenominations`, `denominationsTotal`, `assertBreakdownMatches`, `resolveBusinessDate` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [guayacan-cash-box.errors.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts), [today-iso-date.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-today-iso-date-ts)
- **Consumidores:** [register-guayacan-cash-adjustment.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-adjustment-use-case-ts), [register-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-count-use-case-ts), [register-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-movement-use-case-ts), [guayacan-cash-box.request.dto.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-dtos-guayacan-cash-box-request-dto-ts)

**Constantes exportadas:**

- `GUAYACAN_CASH_DENOMINATIONS` (L10): Las mismas denominaciones de Transaccionar (y de `guayacan_valid_denomination` en SQL). = `[ 200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01, ] as const`
#### Función `round2` (L14–16)

- **Tipo:** función local del archivo
- **Firma:** `round2(value: number): number` — [cash-denominations.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/utils/cash-denominations.ts#L14)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `normalizeDenominations` (L19–41)

- **Tipo:** función exportada
- **Firma:** `normalizeDenominations(rows: GuayacanCashDenominationData[], options: { keepZero: boolean }): GuayacanCashDenominationData[]` — [cash-denominations.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/utils/cash-denominations.ts#L19)
- **Propósito / descripción:** Sin filas en cero, denominación válida y una sola fila por denominación.
- **Dependencias:** `new Set`, `rows.filter((row) => options.keepZero \|\| row.quantity > 0).map`, `rows.filter`, `round2`, `(GUAYACAN_CASH_DENOMINATIONS as readonly number[]).includes`, `Number.isInteger`, `seen.has`, `new GuayacanInvalidDenominationError`, `seen.add`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new GuayacanInvalidDenominationError()`
- **Consumidores:** [register-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-count-use-case-ts), [register-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-movement-use-case-ts)

#### Función `denominationsTotal` (L43–49)

- **Tipo:** función exportada
- **Firma:** `denominationsTotal(rows: GuayacanCashDenominationData[]): number` — [cash-denominations.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/utils/cash-denominations.ts#L43)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `round2`, `rows.reduce`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `assertBreakdownMatches` (L52–62)

- **Tipo:** función exportada
- **Firma:** `assertBreakdownMatches(rows: GuayacanCashDenominationData[], amount: number): void` — [cash-denominations.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/utils/cash-denominations.ts#L52)
- **Propósito / descripción:** Mensaje claro antes de llegar a SQL (que lo vuelve a validar).
- **Dependencias:** `denominationsTotal`, `round2`, `Math.abs`, `new GuayacanCashBreakdownMismatchError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new GuayacanCashBreakdownMismatchError()`
- **Consumidores:** [register-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-movement-use-case-ts)

#### Función `resolveBusinessDate` (L65–74)

- **Tipo:** función exportada
- **Firma:** `resolveBusinessDate(date: string \| undefined): string` — [cash-denominations.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/utils/cash-denominations.ts#L65)
- **Propósito / descripción:** Fecha de negocio: hoy por defecto; nunca futura (el pasado se permite para registrar un día atrasado).
- **Dependencias:** `todayIsoDate`, `/^\d{4}-\d{2}-\d{2}$/.test`, `new GuayacanInvalidDateError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new GuayacanInvalidDateError()`
- **Consumidores:** [register-guayacan-cash-adjustment.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-adjustment-use-case-ts), [register-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-count-use-case-ts), [register-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-movement-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-today-iso-date-ts"></a>

### today-iso-date.ts

- **Ruta:** [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/utils/today-iso-date.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/application/utils/today-iso-date.ts`, 13 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** `yyyy-MM-dd` in local server time (`TZ=America/Guatemala`) — small per-feature copy of the identical helper in `modules/bank-deposits`, following this codebase's "small per-feature copy over cross-feature coupling" convention for a helper this trivial.
- **Descripción del autor (comentario del archivo):** `yyyy-MM-dd` in local server time (`TZ=America/Guatemala`) — small per-feature copy of the identical helper in `modules/bank-deposits`, following this codebase's "small per-feature copy over cross-feature coupling" convention for a helper this trivial.
- **Consumidores:** [guayacan-cash-box.use-cases.spec.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-guayacan-cash-box-use-cases-spec-ts), [void-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-void-guayacan-cash-movement-use-case-ts), [cash-denominations.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-cash-denominations-ts)
#### Función `todayIsoDate` (L7–12)

- **Tipo:** función exportada
- **Firma:** `todayIsoDate(): string` — [today-iso-date.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/application/utils/today-iso-date.ts#L7)
- **Propósito / descripción:** `yyyy-MM-dd` in local server time (`TZ=America/Guatemala`) — small per-feature copy of the identical helper in `modules/bank-deposits`, following this codebase's "small per-feature copy over cross-feature coupling" convention for a helper this trivial.
- **Dependencias:** `new Date`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`, `now.getFullYear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [void-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-void-guayacan-cash-movement-use-case-ts), [cash-denominations.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-cash-denominations-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts"></a>

### guayacan-cash-box.errors.ts

- **Ruta:** [guayacan-cash-box.errors.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/domain/errors/guayacan-cash-box.errors.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/domain/errors/guayacan-cash-box.errors.ts`, 115 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** `RAISE EXCEPTION '&lt;CODE&gt;:...'` de las funciones de la caja → error de dominio.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-count-use-case-ts), [get-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-movement-use-case-ts), [guayacan-cash-box.use-cases.spec.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-guayacan-cash-box-use-cases-spec-ts), [list-guayacan-cash-counts.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-counts-use-case-ts), [list-guayacan-cash-movements.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-movements-use-case-ts), [list-guayacan-commissions.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-commissions-use-case-ts), [register-guayacan-cash-adjustment.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-adjustment-use-case-ts), [register-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-count-use-case-ts), [register-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-movement-use-case-ts), [void-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-void-guayacan-cash-movement-use-case-ts), [cash-denominations.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-cash-denominations-ts), [typeorm-guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-infrastructure-persistence-typeorm-guayacan-cash-box-repository-ts)

#### Clase `GuayacanInvalidAmountError` (L3–8)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GuayacanInvalidConceptError` (L10–15)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GuayacanInvalidDateError` (L17–22)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GuayacanInsufficientBalanceError` (L24–29)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GuayacanCashBreakdownMismatchError` (L31–36)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GuayacanInvalidDenominationError` (L38–43)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GuayacanReasonRequiredError` (L45–50)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GuayacanMovementNotFoundError` (L52–57)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`

#### Clase `GuayacanMovementAlreadyVoidedError` (L59–64)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GuayacanMovementNotVoidableError` (L67–74)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Los movimientos de Transaccionar (y su historial) se corrigen anulando la operación en Transaccionar, nunca desde la caja.

#### Clase `GuayacanCountNotFoundError` (L76–81)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
#### Función `guayacanCashBoxErrorFromMessage` (L84–114)

- **Tipo:** función exportada
- **Firma:** `guayacanCashBoxErrorFromMessage(message: string, movementId?: string): DomainError \| null` — [guayacan-cash-box.errors.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/domain/errors/guayacan-cash-box.errors.ts#L84)
- **Propósito / descripción:** `RAISE EXCEPTION '&lt;CODE&gt;:...'` de las funciones de la caja → error de dominio. `null` si no es uno de ellos.
- **Dependencias:** `message.split`, `new GuayacanInvalidAmountError`, `new GuayacanInvalidConceptError`, `new GuayacanInvalidDateError`, `new GuayacanInsufficientBalanceError`, `new GuayacanCashBreakdownMismatchError`, `new GuayacanInvalidDenominationError`, `new GuayacanReasonRequiredError`, `new GuayacanMovementNotFoundError`, `new GuayacanMovementAlreadyVoidedError`, `new GuayacanMovementNotVoidableError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-infrastructure-persistence-typeorm-guayacan-cash-box-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts"></a>

### guayacan-cash-box.repository.ts

- **Ruta:** [guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/domain/repositories/guayacan-cash-box.repository.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/domain/repositories/guayacan-cash-box.repository.ts`, 248 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `GuayacanCashDenominationData`, `GuayacanCashDenominationRow`, `GuayacanCashMovementRow`, `GuayacanCashMovementDetail`, `RegisterGuayacanCashMovementData` (sin comentario de documentación en el código).
- **Consumidores:** [get-guayacan-cash-box-summary.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-box-summary-use-case-ts), [get-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-count-use-case-ts), [get-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-movement-use-case-ts), [get-latest-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-latest-guayacan-cash-count-use-case-ts), [guayacan-cash-box.use-cases.spec.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-guayacan-cash-box-use-cases-spec-ts), [list-guayacan-cash-count-users.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-count-users-use-case-ts), [list-guayacan-cash-counts.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-counts-use-case-ts), [list-guayacan-cash-movements.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-movements-use-case-ts), [list-guayacan-commissions.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-commissions-use-case-ts), [register-guayacan-cash-adjustment.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-adjustment-use-case-ts), [register-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-count-use-case-ts), [register-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-movement-use-case-ts), [void-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-void-guayacan-cash-movement-use-case-ts), [cash-denominations.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-cash-denominations-ts), [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts) y 2 más

**Interfaces, tipos y enums:**

- `interface GuayacanCashDenominationData` (L29): sin documentación — miembros: `denomination`, `quantity`
- `interface GuayacanCashDenominationRow` (L34) extends GuayacanCashDenominationData: sin documentación — miembros: `subtotal`
- `interface GuayacanCashMovementRow` (L39): Una fila del Kardex — `amount` con signo; `balanceBefore + amount = balanceAfter` siempre (CHECK en la tabla). — miembros: `id`, `sequence`, `movementType`, `amount`, `balanceBefore`, `balanceAfter`, `businessDate`, `concept`, `reason`, `notes`, `referenceType`, `referenceId`, `transactionCount`, `commissionRate`, `reversalOfId`, `status`, `voidedAt`, `voidedByUsername`, `voidReason`, `createdBy`, `createdByUsername`, `createdAt`
- `interface GuayacanCashMovementDetail` (L64) extends GuayacanCashMovementRow: sin documentación — miembros: `cashDetails`, `operation`
- `interface RegisterGuayacanCashMovementData` (L80): sin documentación — miembros: `movementType`, `amount`, `businessDate`, `userId`, `concept`, `reason`, `notes`, `cashDetails`, `clientRequestId`
- `interface FindGuayacanCashMovementsOptions` (L94): sin documentación — miembros: `startDate`, `endDate`, `movementType`, `page`, `limit`
- `interface GuayacanPeriodSummary` (L102): sin documentación — miembros: `startDate`, `endDate`, `transactionCount`, `operationCount`, `commissionTotal`, `manualIncomeTotal`, `manualExpenseTotal`, `transactionInTotal`, `transactionOutTotal`, `adjustmentTotal`
- `interface GuayacanCashBoxSummary` (L120): sin documentación — miembros: `agent`, `balance`, `today`, `daily`, `weekly`, `monthly`
- `interface GuayacanCashCountRow` (L137): sin documentación — miembros: `id`, `sequence`, `number`, `status`, `lastMovementId`, `lastMovementSequence`, `businessDate`, `totalCounted`, `systemBalance`, `difference`, `notes`, `createdBy`, `createdByUsername`, `createdAt`, `details`
- `interface FindGuayacanCashCountsOptions` (L158): sin documentación — miembros: `startDate`, `endDate`, `userId`, `sequence`, `page`, `limit`
- `interface PaginatedGuayacanCashCounts` (L168): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface GuayacanCommissionRow` (L176): sin documentación — miembros: `id`, `operationId`, `transactionTypeName`, `businessDate`, `transactionCount`, `commissionRate`, `amount`, `status`, `voidedAt`, `voidReason`, `createdByUsername`, `createdAt`
- `interface PaginatedGuayacanCommissions` (L191): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface RegisterGuayacanCashCountData` (L198): sin documentación — miembros: `businessDate`, `userId`, `notes`, `details`, `clientRequestId`
- `interface PaginatedGuayacanCashMovements` (L206): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface GuayacanCashBoxRepository` (L213): sin documentación — miembros: `registerMovement`, `voidMovement`, `findMovementById`, `findMovements`, `getSummary`, `registerCount`, `findLatestCount`, `findCountById`, `findCounts`, `findCountUsers`, `findCommissions`
- `type GuayacanCashMovementType` (L23) = `(typeof GUAYACAN_CASH_MOVEMENT_TYPES)[number]`
- `type GuayacanManualMovementType` (L27) = `'INGRESO' \| 'EGRESO' \| 'AJUSTE'` — Tipos que un usuario registra a mano — el resto los genera el sistema (Transaccionar, anulaciones).
- `type GuayacanCashCountStatus` (L135) = `'CUADRADO' \| 'SOBRANTE' \| 'FALTANTE'`

**Constantes exportadas:**

- `GUAYACAN_CASH_BOX_REPOSITORY` (L1) = `Symbol( 'GUAYACAN_CASH_BOX_REPOSITORY', )`
- `GUAYACAN_CASH_MOVEMENT_TYPES` (L13): Tipos del Kardex de efectivo. = `[ 'INGRESO', 'EGRESO', 'TRANSACCION_DEPOSITO', 'TRANSACCION_RETIRO', 'AJUSTE', 'ANULACION', 'COMISION_TRANSACC`
<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts"></a>

### guayacan-cash-box.module.ts

- **Ruta:** [guayacan-cash-box.module.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/guayacan-cash-box.module.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/guayacan-cash-box.module.ts`, 48 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** "Cuadre de Caja Guayacán" — módulo independiente (no importa `BankDepositsModule`; solo LEE `bank_deposit_operations` para contar transacciones).
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [typeorm-guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-infrastructure-persistence-typeorm-guayacan-cash-box-repository-ts), [get-guayacan-cash-box-summary.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-box-summary-use-case-ts), [list-guayacan-cash-movements.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-movements-use-case-ts), [get-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-movement-use-case-ts), [register-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-movement-use-case-ts), [register-guayacan-cash-adjustment.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-adjustment-use-case-ts), [void-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-void-guayacan-cash-movement-use-case-ts), [register-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-count-use-case-ts), [get-latest-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-latest-guayacan-cash-count-use-case-ts), [list-guayacan-cash-counts.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-counts-use-case-ts), [get-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-count-use-case-ts), [list-guayacan-cash-count-users.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-count-users-use-case-ts), [list-guayacan-commissions.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-commissions-use-case-ts), [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `GuayacanCashBoxModule` (L26–47)

- **Decoradores:** `@Module({ controllers: [GuayacanCashBoxController], providers: [ { provide: GUAYACAN_CASH_BOX_REPOSITORY, useClass: TypeOrmGuayacanCashBoxRepository, }, GetGuaya`
- **Propósito:** "Cuadre de Caja Guayacán" — módulo independiente (no importa `BankDepositsModule`; solo LEE `bank_deposit_operations` para contar transacciones). Su ledger `guayacan_cash_movements` solo lo escriben las funciones SQL de la migración `CreateGuayacanCashBox` — las comisiones, por el trigger sobre `bank_deposit_operations`, en la misma transacción que la operación.
<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-infrastructure-persistence-typeorm-guayacan-cash-box-repository-ts"></a>

### typeorm-guayacan-cash-box.repository.ts

- **Ruta:** [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts`, 680 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** Caja Guayacán sobre SQL crudo: TODA escritura del Kardex pasa por las funciones de la migración `CreateGuayacanCashBox` (lock global de la caja, saldo leído bajo lock) — este repositorio nunca inserta movimientos ni calcula saldos por su cuenta.
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [guayacan-cash-box.errors.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-errors-guayacan-cash-box-errors-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts)

**Interfaces, tipos y enums:**

- `interface MovementSqlRow` (L23): sin documentación — miembros: `id`, `sequence`, `movement_type`, `amount`, `balance_before`, `balance_after`, `business_date`, `concept`, `reason`, `notes`, `reference_type`, `reference_id`, `transaction_count`, `commission_rate`, `reversal_of_id`, `status`, `voided_at`, `voided_by_username`, `void_reason`, `created_by`, `created_by_username`, `created_at`
- `interface CountSqlRow` (L61): sin documentación — miembros: `id`, `sequence`, `business_date`, `total_counted`, `system_balance`, `difference`, `notes`, `last_movement_id`, `last_movement_sequence`, `created_by`, `created_by_username`, `created_at`

#### Clase `TypeOrmGuayacanCashBoxRepository` (L171–679)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements GuayacanCashBoxRepository
- **Propósito:** Caja Guayacán sobre SQL crudo: TODA escritura del Kardex pasa por las funciones de la migración `CreateGuayacanCashBox` (lock global de la caja, saldo leído bajo lock) — este repositorio nunca inserta movimientos ni calcula saldos por su cuenta. Los períodos (día, semana lunes–domingo, mes) los calcula PostgreSQL en `America/Guatemala`.
- **Dependencias inyectadas (constructor):** `@InjectDataSource() dataSource: DataSource`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `registerMovement` | método public async | 175–197 | `data: RegisterGuayacanCashMovementData` | `Promise<string>` |
| `voidMovement` | método public async | 199–214 | `movementId: string`, `businessDate: string`, `userId: string`, `reason: string` | `Promise<string>` |
| `findMovementById` | método public async | 216–284 | `id: string` | `Promise<GuayacanCashMovementDetail \| null>` |
| `findMovements` | método public async | 286–328 | `options: FindGuayacanCashMovementsOptions` | `Promise<PaginatedGuayacanCashMovements>` |
| `getSummary` | método public async | 330–386 | — | `Promise<GuayacanCashBoxSummary>` |
| `periodSummary` | método private async | 388–443 | `startDate: string`, `endDate: string` | `Promise<GuayacanPeriodSummary>` |
| `registerCount` | método public async | 445–510 | `data: RegisterGuayacanCashCountData` | `Promise<string>` |
| `findLatestCount` | método public async | 512–517 | — | `Promise<GuayacanCashCountRow \| null>` |
| `findCountById` | método public async | 519–535 | `id: string` | `Promise<GuayacanCashCountRow \| null>` |
| `findCounts` | método public async | 537–585 | `options: FindGuayacanCashCountsOptions` | `Promise<PaginatedGuayacanCashCounts>` |
| `findCountUsers` | método public | 587–592 | — | `Promise<{ id: string; username: string }[]>` |
| `findCommissions` | método public async | 594–668 | `options: { startDate?: string; endDate?: string; page: number; limit: number; }` | `Promise<PaginatedGuayacanCommissions>` |
| `translate` | método private | 670–678 | `error: unknown`, `movementId?: string` | `unknown` |

##### `TypeOrmGuayacanCashBoxRepository.registerMovement`

- **Firma:** `registerMovement(data: RegisterGuayacanCashMovementData): Promise<string>` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L175) (L175–197)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `JSON.stringify`, `this.translate`
- **Efectos secundarios:** Llama funciones SQL: `register_guayacan_cash_movement`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translate(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmGuayacanCashBoxRepository.voidMovement`

- **Firma:** `voidMovement(movementId: string, businessDate: string, userId: string, reason: string): Promise<string>` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L199) (L199–214)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `this.translate`
- **Efectos secundarios:** Llama funciones SQL: `void_guayacan_cash_movement`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translate(error, movementId)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmGuayacanCashBoxRepository.findMovementById`

- **Firma:** `findMovementById(id: string): Promise<GuayacanCashMovementDetail \| null>` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L216) (L216–284)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `toMovement`, `toNumber`, `Number`, `toDenominations`
- **Efectos secundarios:** Tablas en su SQL: `guayacan_cash_movement_details`, `bank_deposit_operations`, `transaction_types`, `transaction_banks`, `bank_deposit_cash_details`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmGuayacanCashBoxRepository.findMovements`

- **Firma:** `findMovements(options: FindGuayacanCashMovementsOptions): Promise<PaginatedGuayacanCashMovements>` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L286) (L286–328)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `params.push`, `conditions.push`, `conditions.join`, `this.dataSource.query`, `rows.map`, `Number`
- **Efectos secundarios:** Tablas en su SQL: `guayacan_cash_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmGuayacanCashBoxRepository.getSummary`

- **Firma:** `getSummary(): Promise<GuayacanCashBoxSummary>` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L330) (L330–386)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `toNumber`, `Promise.all`, `this.periodSummary`
- **Efectos secundarios:** Tablas en su SQL: `transaction_banks`, `guayacan_cash_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmGuayacanCashBoxRepository.periodSummary`

- **Firma:** `periodSummary(startDate: string, endDate: string): Promise<GuayacanPeriodSummary>` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L388) (L388–443)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `Number`, `toNumber`
- **Efectos secundarios:** Tablas en su SQL: `bank_deposit_operations`, `transaction_banks`, `guayacan_commissions`, `guayacan_cash_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmGuayacanCashBoxRepository.registerCount`

- **Firma:** `registerCount(data: RegisterGuayacanCashCountData): Promise<string>` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L445) (L445–510)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.transaction`, `manager.query`, `toNumber`, `round2`, `data.details.reduce`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`; Tablas en su SQL: `guayacan_cash_counts`, `guayacan_cash_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmGuayacanCashBoxRepository.findLatestCount`

- **Firma:** `findLatestCount(): Promise<GuayacanCashCountRow \| null>` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L512) (L512–517)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `this.findCountById`
- **Efectos secundarios:** Tablas en su SQL: `guayacan_cash_counts`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmGuayacanCashBoxRepository.findCountById`

- **Firma:** `findCountById(id: string): Promise<GuayacanCashCountRow \| null>` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L519) (L519–535)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `toCount`, `toDenominations`
- **Efectos secundarios:** Tablas en su SQL: `guayacan_cash_count_details`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmGuayacanCashBoxRepository.findCounts`

- **Firma:** `findCounts(options: FindGuayacanCashCountsOptions): Promise<PaginatedGuayacanCashCounts>` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L537) (L537–585)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `params.push`, `conditions.push`, `conditions.join`, `this.dataSource.query`, `rows.map`, `Number`
- **Efectos secundarios:** Tablas en su SQL: `guayacan_cash_counts`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmGuayacanCashBoxRepository.findCountUsers`

- **Firma:** `findCountUsers(): Promise<{ id: string; username: string }[]>` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L587) (L587–592)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`
- **Efectos secundarios:** Tablas en su SQL: `guayacan_cash_counts`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmGuayacanCashBoxRepository.findCommissions`

- **Firma:** `findCommissions(options: { startDate?: string; endDate?: string; page: number; limit: number; }): Promise<PaginatedGuayacanCommissions>` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L594) (L594–668)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `params.push`, `conditions.push`, `conditions.join`, `this.dataSource.query`, `rows.map`, `Number`, `toNumber`
- **Efectos secundarios:** Tablas en su SQL: `guayacan_commissions`, `bank_deposit_operations`, `transaction_types`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmGuayacanCashBoxRepository.translate`

- **Firma:** `translate(error: unknown, movementId?: string): unknown` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L670) (L670–678)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `guayacanCashBoxErrorFromMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `formatCountNumber` (L89–91)

- **Tipo:** función exportada
- **Firma:** `formatCountNumber(sequence: number): string` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L89)
- **Propósito / descripción:** Número visible del arqueo: correlativo con ceros ("ARQ-0007").
- **Dependencias:** `String(sequence).padStart`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `toCount` (L93–116)

- **Tipo:** función local del archivo
- **Firma:** `toCount(row: CountSqlRow): Omit<GuayacanCashCountRow, 'details'>` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L93)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`, `toNumber`, `formatCountNumber`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `round2` (L118–120)

- **Tipo:** función local del archivo
- **Firma:** `round2(value: number): number` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L118)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toNumber` (L122–124)

- **Tipo:** función local del archivo
- **Firma:** `toNumber(value: string \| number \| null): number` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L122)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toMovement` (L126–152)

- **Tipo:** función local del archivo
- **Firma:** `toMovement(row: MovementSqlRow): GuayacanCashMovementRow` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L126)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`, `toNumber`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toDenominations` (L154–162)

- **Tipo:** función local del archivo
- **Firma:** `toDenominations(rows: { denomination: string; quantity: number; subtotal: string }[]): GuayacanCashDenominationRow[]` — [typeorm-guayacan-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/infrastructure/persistence/typeorm-guayacan-cash-box.repository.ts#L154)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `rows.map`, `toNumber`, `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts"></a>

### guayacan-cash-box.controller.ts

- **Ruta:** [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts`, 148 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** "Cuadre de Caja Guayacán" — Kardex propio, independiente de Recargas, Caja de Ventas y saldos bancarios.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-guayacan-cash-box-summary.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-box-summary-use-case-ts), [list-guayacan-cash-movements.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-movements-use-case-ts), [get-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-movement-use-case-ts), [register-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-movement-use-case-ts), [register-guayacan-cash-adjustment.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-adjustment-use-case-ts), [void-guayacan-cash-movement.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-void-guayacan-cash-movement-use-case-ts), [register-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-register-guayacan-cash-count-use-case-ts), [get-latest-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-latest-guayacan-cash-count-use-case-ts), [list-guayacan-cash-counts.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-counts-use-case-ts), [get-guayacan-cash-count.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-get-guayacan-cash-count-use-case-ts), [list-guayacan-cash-count-users.use-case.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-use-cases-list-guayacan-cash-count-users-use-case-ts) y 2 más
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [guayacan-cash-box.module.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-guayacan-cash-box-module-ts)

#### Clase `GuayacanCashBoxController` (L48–147)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('guayacan-cash-box')`
- **Propósito:** "Cuadre de Caja Guayacán" — Kardex propio, independiente de Recargas, Caja de Ventas y saldos bancarios. Política (mismo criterio que Transaccionar, donde nacen las comisiones): leer, registrar ingresos/ egresos y arqueos es operativo (cualquier cuenta autenticada activa); AJUSTES y ANULACIONES son de gestión (`@Roles` admin). Ninguna ruta es pública. Las comisiones nunca se registran por aquí: las genera el trigger de `bank_deposit_operations`.
- **Dependencias inyectadas (constructor):** `getSummaryUseCase: GetGuayacanCashBoxSummaryUseCase`, `listMovementsUseCase: ListGuayacanCashMovementsUseCase`, `getMovementUseCase: GetGuayacanCashMovementUseCase`, `registerMovementUseCase: RegisterGuayacanCashMovementUseCase`, `registerAdjustmentUseCase: RegisterGuayacanCashAdjustmentUseCase`, `voidMovementUseCase: VoidGuayacanCashMovementUseCase`, `registerCountUseCase: RegisterGuayacanCashCountUseCase`, `getLatestCountUseCase: GetLatestGuayacanCashCountUseCase`, `listCountsUseCase: ListGuayacanCashCountsUseCase`, `getCountUseCase: GetGuayacanCashCountUseCase`, `listCountUsersUseCase: ListGuayacanCashCountUsersUseCase`, `listCommissionsUseCase: ListGuayacanCommissionsUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `commissions` | método public | 67–70 | `query: GuayacanCommissionsQueryDto` | (inferido) |
| `counts` | método public | 73–76 | `query: GuayacanCashCountsQueryDto` | (inferido) |
| `countUsers` | método public | 78–81 | — | (inferido) |
| `summary` | método public | 83–86 | — | (inferido) |
| `movements` | método public | 88–91 | `query: GuayacanCashMovementsQueryDto` | (inferido) |
| `movement` | método public | 93–96 | `id: string` | (inferido) |
| `registerMovement` | método public | 98–105 | `dto: RegisterGuayacanCashMovementRequestDto`, `userId: string` | (inferido) |
| `registerAdjustment` | método public | 107–116 | `dto: RegisterGuayacanCashAdjustmentRequestDto`, `userId: string` | (inferido) |
| `voidMovement` | método public | 118–127 | `id: string`, `dto: VoidGuayacanCashMovementRequestDto`, `userId: string` | (inferido) |
| `latestCount` | método public | 129–132 | — | (inferido) |
| `count` | método public | 134–137 | `id: string` | (inferido) |
| `registerCount` | método public | 139–146 | `dto: RegisterGuayacanCashCountRequestDto`, `userId: string` | (inferido) |

##### `GuayacanCashBoxController.commissions`

- **Firma:** `commissions(query: GuayacanCommissionsQueryDto)` — [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L67) (L67–70)
- **Decoradores:** `@Get('commissions')`
- **Propósito / descripción:** Comisiones (concepto propio — nunca efectivo de caja).
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listCommissionsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashBoxController.counts`

- **Firma:** `counts(query: GuayacanCashCountsQueryDto)` — [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L73) (L73–76)
- **Decoradores:** `@Get('counts')`
- **Propósito / descripción:** Historial de arqueos (Cajas y Cierres). `latest`/`users` se declaran antes de `:id`.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listCountsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashBoxController.countUsers`

- **Firma:** `countUsers()` — [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L78) (L78–81)
- **Decoradores:** `@Get('counts/users')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.listCountUsersUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashBoxController.summary`

- **Firma:** `summary()` — [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L83) (L83–86)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashBoxController.movements`

- **Firma:** `movements(query: GuayacanCashMovementsQueryDto)` — [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L88) (L88–91)
- **Decoradores:** `@Get('movements')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listMovementsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashBoxController.movement`

- **Firma:** `movement(id: string)` — [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L93) (L93–96)
- **Decoradores:** `@Get('movements/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getMovementUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashBoxController.registerMovement`

- **Firma:** `registerMovement(dto: RegisterGuayacanCashMovementRequestDto, userId: string)` — [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L98) (L98–105)
- **Decoradores:** `@Post('movements')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerMovementUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashBoxController.registerAdjustment`

- **Firma:** `registerAdjustment(dto: RegisterGuayacanCashAdjustmentRequestDto, userId: string)` — [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L107) (L107–116)
- **Decoradores:** `@Post('adjustments')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerAdjustmentUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashBoxController.voidMovement`

- **Firma:** `voidMovement(id: string, dto: VoidGuayacanCashMovementRequestDto, userId: string)` — [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L118) (L118–127)
- **Decoradores:** `@Post('movements/:id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidMovementUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashBoxController.latestCount`

- **Firma:** `latestCount()` — [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L129) (L129–132)
- **Decoradores:** `@Get('counts/latest')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getLatestCountUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashBoxController.count`

- **Firma:** `count(id: string)` — [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L134) (L134–137)
- **Decoradores:** `@Get('counts/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getCountUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashBoxController.registerCount`

- **Firma:** `registerCount(dto: RegisterGuayacanCashCountRequestDto, userId: string)` — [guayacan-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/controllers/guayacan-cash-box.controller.ts#L139) (L139–146)
- **Decoradores:** `@Post('counts')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerCountUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-dtos-guayacan-cash-box-request-dto-ts"></a>

### guayacan-cash-box.request.dto.ts

- **Ruta:** [guayacan-cash-box.request.dto.ts](../../../../comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/dtos/guayacan-cash-box.request.dto.ts) (`comercial-jhoel-api/src/modules/guayacan-cash-box/presentation/dtos/guayacan-cash-box.request.dto.ts`, 209 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `guayacan-cash-box`
- **Responsabilidad:** DTO de entrada: declara `GuayacanCashDenominationRequestDto`, `GuayacanCashMovementBaseRequestDto`, `RegisterGuayacanCashMovementRequestDto`, `RegisterGuayacanCashAdjustmentRequestDto`, `VoidGuayacanCashMovementRequestDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [guayacan-cash-box.repository.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-domain-repositories-guayacan-cash-box-repository-ts), [cash-denominations.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-application-utils-cash-denominations-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [guayacan-cash-box.controller.ts](guayacan-cash-box.md#f-comercial-jhoel-api-src-modules-guayacan-cash-box-presentation-controllers-guayacan-cash-box-controller-ts)

#### Clase `GuayacanCashDenominationRequestDto` (L25–35)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GuayacanCashMovementBaseRequestDto` (L37–57)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RegisterGuayacanCashMovementRequestDto` (L59–80)

- **Herencia / contratos:** extends GuayacanCashMovementBaseRequestDto
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RegisterGuayacanCashAdjustmentRequestDto` (L82–95)

- **Herencia / contratos:** extends GuayacanCashMovementBaseRequestDto
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `VoidGuayacanCashMovementRequestDto` (L97–104)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RegisterGuayacanCashCountRequestDto` (L106–125)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GuayacanCashMovementsQueryDto` (L127–152)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GuayacanCashCountsQueryDto` (L154–185)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `GuayacanCommissionsQueryDto` (L187–208)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
