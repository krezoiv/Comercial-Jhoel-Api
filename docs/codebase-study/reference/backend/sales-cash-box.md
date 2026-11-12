# Módulo backend `sales-cash-box`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/sales-cash-box/balances` | [sales-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/controllers/sales-cash-box.controller.ts#L46) `SalesCashBoxController.getBalances` | [GetSalesCashBoxBalancesUseCase](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-get-sales-cash-box-balances-use-case-ts) | `SalesCashBoxMovementRepository`.getBalances [businesses, sale_details, sales, sales_cash_box_movements] | UseGuards(JwtAuthGuard) | `SalesCashBoxService.getBalances` |
| `GET /api/sales-cash-box/movements` | [sales-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/controllers/sales-cash-box.controller.ts#L51) `SalesCashBoxController.getMovements` | [GetSalesCashBoxMovementsUseCase](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-get-sales-cash-box-movements-use-case-ts) | `SalesCashBoxMovementRepository`.findMovements | UseGuards(JwtAuthGuard) | `SalesCashBoxService.getMovements` |
| `POST /api/sales-cash-box/contributions` | [sales-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/controllers/sales-cash-box.controller.ts#L59) `SalesCashBoxController.registerContribution` | [RegisterSalesCashBoxContributionUseCase](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-contribution-use-case-ts) | `SalesCashBoxMovementRepository`.registerMovement → `register_sales_cash_box_movement` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `SalesCashBoxService.registerContribution` |
| `POST /api/sales-cash-box/withdrawals` | [sales-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/controllers/sales-cash-box.controller.ts#L75) `SalesCashBoxController.registerWithdrawal` | [RegisterSalesCashBoxWithdrawalUseCase](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-withdrawal-use-case-ts) | `SalesCashBoxMovementRepository`.registerMovement → `register_sales_cash_box_movement` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `SalesCashBoxService.registerWithdrawal` |
| `POST /api/sales-cash-box/movements/:id/void` | [sales-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/controllers/sales-cash-box.controller.ts#L91) `SalesCashBoxController.voidMovement` | [VoidSalesCashBoxMovementUseCase](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-void-sales-cash-box-movement-use-case-ts) | `SalesCashBoxMovementRepository`.findById/voidMovement | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `SalesCashBoxService.voidMovement` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [sales-cash-box-movement-output.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-application-dtos-sales-cash-box-movement-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toSalesCashBoxMovementOutput`, `SalesCashBoxMovementOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [get-sales-cash-box-balances.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-get-sales-cash-box-balances-use-case-ts) | .ts | Caso de uso | Aplicación | El saldo acumulado de cada negocio, en una sola consulta — nunca una llamada por tarjeta. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-sales-cash-box-movements.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-get-sales-cash-box-movements-use-case-ts) | .ts | Caso de uso | Aplicación | Movimientos manuales (aportes/retiros) más recientes de UN negocio — incluye los anulados, para que el historial nunca oculte una corrección. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-sales-cash-box-contribution.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-contribution-use-case-ts) | .ts | Caso de uso | Aplicación | "Aporte" — nunca necesita validar saldo, solo suma (ver `register_sales_cash_box_movement`, que omite el chequeo de saldo cuando `movementType = 'CONTRIBUTION'`). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-sales-cash-box-withdrawal.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-withdrawal-use-case-ts) | .ts | Caso de uso | Aplicación | "Retiro" — la validación de saldo NO se duplica aquí: `register_sales_cash_box_movement` calcula el saldo disponible y rechaza un retiro que lo exceda de forma atómica, dentro de su propio advisory lock (por negocio) — un chequeo en TypeScript solo agregaría una ventana TOCTOU, no la cerraría (mismo razonamiento ya establecido para Kardex financiero/Recargas). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [void-sales-cash-box-movement.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-void-sales-cash-box-movement-use-case-ts) | .ts | Caso de uso | Aplicación | Corrección de un "Aporte"/"Retiro" equivocado — nunca una edición, nunca un borrado físico. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [sales-cash-box-movement.entity.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-entities-sales-cash-box-movement-entity-ts) | .ts | Entidad de dominio | Dominio | A manual Caja de Ventas movement — "Aporte" (income) or "Retiro" (expense) — for ONE negocio's accumulated cash balance. | 0 internas | 5 | Media (5 consumidores) |
| [invalid-cash-box-business.error.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-invalid-cash-box-business-error-ts) | .ts | Errores de dominio | Dominio | Covers both "no existe" and "está inactivo" — same single-message rule already used by `InvalidBusinessError` (Products) and `InvalidSupplierError` (Purchases) for their own referenced-entity checks. | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-movement-amount.error.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-invalid-movement-amount-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidMovementAmountError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-movement-concept.error.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-invalid-movement-concept-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidMovementConceptError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [sales-cash-box-movement-already-voided.error.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-sales-cash-box-movement-already-voided-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SalesCashBoxMovementAlreadyVoidedError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [sales-cash-box-movement-not-found.error.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-sales-cash-box-movement-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SalesCashBoxMovementNotFoundError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [withdrawal-exceeds-balance.error.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-withdrawal-exceeds-balance-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `WithdrawalExceedsBalanceError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [sales-cash-box-movement.repository.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-repositories-sales-cash-box-movement-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RegisterSalesCashBoxMovementData`, `SalesCashBoxBalance`, `SalesCashBoxMovementRepository`, `SALES_CASH_BOX_MOVEMENT_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 7 | Media (7 consumidores) |
| [sales-cash-box-movement.mapper.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-sales-cash-box-movement-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `SalesCashBoxMovementMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [sales-cash-box-movement.orm-entity.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-sales-cash-box-movement-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `SalesCashBoxMovementOrmEntity` (sin comentario de documentación en el código). | 4 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [typeorm-sales-cash-box.repository.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-typeorm-sales-cash-box-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Lee `sale_details`/`sales` en vivo (nunca una copia) para la parte "ventas" del saldo de cada negocio — mismo patrón ya documentado en `TypeOrmRechargeCashBoxRepository` para sus cuatro tablas fuente. | 8 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [sales-cash-box.controller.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts) | .ts | Controlador | Presentación | "Caja de Ventas" por negocio — saldo acumulado independiente por `business_id`, mismo patrón que `RechargeCashBoxController` (módulo propio, solo LEE `sales`/`sale_details`, nunca escribe en ellas). | 12 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [register-sales-cash-box-movement.request.dto.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-dtos-register-sales-cash-box-movement-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `RegisterSalesCashBoxMovementRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [sales-cash-box-movements.query.dto.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-dtos-sales-cash-box-movements-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `SalesCashBoxMovementsQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [void-sales-cash-box-movement.request.dto.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-dtos-void-sales-cash-box-movement-request-dto-ts) | .ts | DTO de entrada | Presentación | Mirrors `VoidCashBoxMovementRequestDto` (Recargas) — same mandatory-reason shape, this module's own copy. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [sales-cash-box.module.ts](#f-comercial-jhoel-api-src-modules-sales-cash-box-sales-cash-box-module-ts) | .ts | Módulo | Arranque / configuración | "Caja de Ventas" — módulo completamente independiente (propio domain/ application/infrastructure/presentation, sin importar `SalesModule`), mismo patrón que `RechargeCashBoxModule`. | 9 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-application-dtos-sales-cash-box-movement-output-ts"></a>

### sales-cash-box-movement-output.ts

- **Ruta:** [sales-cash-box-movement-output.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/application/dtos/sales-cash-box-movement-output.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/application/dtos/sales-cash-box-movement-output.ts`, 35 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** DTO de salida (aplicación): declara `toSalesCashBoxMovementOutput`, `SalesCashBoxMovementOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sales-cash-box-movement.entity.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-entities-sales-cash-box-movement-entity-ts)
- **Consumidores:** [get-sales-cash-box-movements.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-get-sales-cash-box-movements-use-case-ts), [register-sales-cash-box-contribution.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-contribution-use-case-ts), [register-sales-cash-box-withdrawal.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-withdrawal-use-case-ts), [void-sales-cash-box-movement.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-void-sales-cash-box-movement-use-case-ts)

**Interfaces, tipos y enums:**

- `interface SalesCashBoxMovementOutput` (L4): sin documentación — miembros: `id`, `businessId`, `amount`, `movementType`, `concept`, `createdByUsername`, `createdAt`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
#### Función `toSalesCashBoxMovementOutput` (L18–34)

- **Tipo:** función exportada
- **Firma:** `toSalesCashBoxMovementOutput(movement: SalesCashBoxMovement): SalesCashBoxMovementOutput` — [sales-cash-box-movement-output.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/application/dtos/sales-cash-box-movement-output.ts#L18)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [register-sales-cash-box-contribution.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-contribution-use-case-ts), [register-sales-cash-box-withdrawal.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-withdrawal-use-case-ts), [void-sales-cash-box-movement.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-void-sales-cash-box-movement-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-get-sales-cash-box-balances-use-case-ts"></a>

### get-sales-cash-box-balances.use-case.ts

- **Ruta:** [get-sales-cash-box-balances.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/get-sales-cash-box-balances.use-case.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/get-sales-cash-box-balances.use-case.ts`, 24 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** El saldo acumulado de cada negocio, en una sola consulta — nunca una llamada por tarjeta.
- **Depende de (archivos del proyecto):** [sales-cash-box-movement.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-repositories-sales-cash-box-movement-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts), [sales-cash-box.module.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-sales-cash-box-module-ts)

**Interfaces, tipos y enums:**

- `interface SalesCashBoxBalanceOutput` (L5): sin documentación — miembros: `businessId`, `businessName`, `balance`

#### Clase `GetSalesCashBoxBalancesUseCase` (L13–23)

- **Decoradores:** `@Injectable()`
- **Propósito:** El saldo acumulado de cada negocio, en una sola consulta — nunca una llamada por tarjeta.
- **Dependencias inyectadas (constructor):** `@Inject(SALES_CASH_BOX_MOVEMENT_REPOSITORY) repository: SalesCashBoxMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–22 | — | `Promise<SalesCashBoxBalanceOutput[]>` |

##### `GetSalesCashBoxBalancesUseCase.execute`

- **Firma:** `execute(): Promise<SalesCashBoxBalanceOutput[]>` — [get-sales-cash-box-balances.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/get-sales-cash-box-balances.use-case.ts#L20) (L20–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.getBalances`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-get-sales-cash-box-movements-use-case-ts"></a>

### get-sales-cash-box-movements.use-case.ts

- **Ruta:** [get-sales-cash-box-movements.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/get-sales-cash-box-movements.use-case.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/get-sales-cash-box-movements.use-case.ts`, 40 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** Movimientos manuales (aportes/retiros) más recientes de UN negocio — incluye los anulados, para que el historial nunca oculte una corrección.
- **Depende de (archivos del proyecto):** [sales-cash-box-movement.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-repositories-sales-cash-box-movement-repository-ts), [sales-cash-box-movement-output.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-dtos-sales-cash-box-movement-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts), [sales-cash-box.module.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-sales-cash-box-module-ts)

**Interfaces, tipos y enums:**

- `interface GetSalesCashBoxMovementsInput` (L9): sin documentación — miembros: `businessId`, `limit`

#### Clase `GetSalesCashBoxMovementsUseCase` (L18–39)

- **Decoradores:** `@Injectable()`
- **Propósito:** Movimientos manuales (aportes/retiros) más recientes de UN negocio — incluye los anulados, para que el historial nunca oculte una corrección.
- **Dependencias inyectadas (constructor):** `@Inject(SALES_CASH_BOX_MOVEMENT_REPOSITORY) repository: SalesCashBoxMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–38 | `input: GetSalesCashBoxMovementsInput` | `Promise<SalesCashBoxMovementOutput[]>` |

##### `GetSalesCashBoxMovementsUseCase.execute`

- **Firma:** `execute(input: GetSalesCashBoxMovementsInput): Promise<SalesCashBoxMovementOutput[]>` — [get-sales-cash-box-movements.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/get-sales-cash-box-movements.use-case.ts#L25) (L25–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `this.repository.findMovements`, `movements.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-contribution-use-case-ts"></a>

### register-sales-cash-box-contribution.use-case.ts

- **Ruta:** [register-sales-cash-box-contribution.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/register-sales-cash-box-contribution.use-case.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/register-sales-cash-box-contribution.use-case.ts`, 37 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** "Aporte" — nunca necesita validar saldo, solo suma (ver `register_sales_cash_box_movement`, que omite el chequeo de saldo cuando `movementType = 'CONTRIBUTION'`).
- **Depende de (archivos del proyecto):** [sales-cash-box-movement.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-repositories-sales-cash-box-movement-repository-ts), [sales-cash-box-movement-output.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-dtos-sales-cash-box-movement-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts), [sales-cash-box.module.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-sales-cash-box-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterSalesCashBoxContributionInput` (L9): sin documentación — miembros: `businessId`, `amount`, `concept`, `userId`

#### Clase `RegisterSalesCashBoxContributionUseCase` (L17–36)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Aporte" — nunca necesita validar saldo, solo suma (ver `register_sales_cash_box_movement`, que omite el chequeo de saldo cuando `movementType = 'CONTRIBUTION'`).
- **Dependencias inyectadas (constructor):** `@Inject(SALES_CASH_BOX_MOVEMENT_REPOSITORY) repository: SalesCashBoxMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 24–35 | `input: RegisterSalesCashBoxContributionInput` | `Promise<SalesCashBoxMovementOutput>` |

##### `RegisterSalesCashBoxContributionUseCase.execute`

- **Firma:** `execute(input: RegisterSalesCashBoxContributionInput): Promise<SalesCashBoxMovementOutput>` — [register-sales-cash-box-contribution.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/register-sales-cash-box-contribution.use-case.ts#L24) (L24–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.registerMovement`, `toSalesCashBoxMovementOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-withdrawal-use-case-ts"></a>

### register-sales-cash-box-withdrawal.use-case.ts

- **Ruta:** [register-sales-cash-box-withdrawal.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/register-sales-cash-box-withdrawal.use-case.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/register-sales-cash-box-withdrawal.use-case.ts`, 44 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** "Retiro" — la validación de saldo NO se duplica aquí: `register_sales_cash_box_movement` calcula el saldo disponible y rechaza un retiro que lo exceda de forma atómica, dentro de su propio advisory lock (por negocio) — un chequeo en TypeScript solo agregaría una ventana TOCTOU, no la cerraría (mismo razonamiento ya establecido para Kardex financiero/Recargas).
- **Depende de (archivos del proyecto):** [sales-cash-box-movement.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-repositories-sales-cash-box-movement-repository-ts), [sales-cash-box-movement-output.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-dtos-sales-cash-box-movement-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts), [sales-cash-box.module.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-sales-cash-box-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterSalesCashBoxWithdrawalInput` (L9): sin documentación — miembros: `businessId`, `amount`, `concept`, `userId`

#### Clase `RegisterSalesCashBoxWithdrawalUseCase` (L24–43)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Retiro" — la validación de saldo NO se duplica aquí: `register_sales_cash_box_movement` calcula el saldo disponible y rechaza un retiro que lo exceda de forma atómica, dentro de su propio advisory lock (por negocio) — un chequeo en TypeScript solo agregaría una ventana TOCTOU, no la cerraría (mismo razonamiento ya establecido para Kardex financiero/Recargas).
- **Dependencias inyectadas (constructor):** `@Inject(SALES_CASH_BOX_MOVEMENT_REPOSITORY) repository: SalesCashBoxMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 31–42 | `input: RegisterSalesCashBoxWithdrawalInput` | `Promise<SalesCashBoxMovementOutput>` |

##### `RegisterSalesCashBoxWithdrawalUseCase.execute`

- **Firma:** `execute(input: RegisterSalesCashBoxWithdrawalInput): Promise<SalesCashBoxMovementOutput>` — [register-sales-cash-box-withdrawal.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/register-sales-cash-box-withdrawal.use-case.ts#L31) (L31–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.registerMovement`, `toSalesCashBoxMovementOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-void-sales-cash-box-movement-use-case-ts"></a>

### void-sales-cash-box-movement.use-case.ts

- **Ruta:** [void-sales-cash-box-movement.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/void-sales-cash-box-movement.use-case.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/void-sales-cash-box-movement.use-case.ts`, 44 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** Corrección de un "Aporte"/"Retiro" equivocado — nunca una edición, nunca un borrado físico.
- **Depende de (archivos del proyecto):** [sales-cash-box-movement.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-repositories-sales-cash-box-movement-repository-ts), [sales-cash-box-movement-not-found.error.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-sales-cash-box-movement-not-found-error-ts), [sales-cash-box-movement-already-voided.error.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-sales-cash-box-movement-already-voided-error-ts), [sales-cash-box-movement-output.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-dtos-sales-cash-box-movement-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts), [sales-cash-box.module.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-sales-cash-box-module-ts)

**Interfaces, tipos y enums:**

- `interface VoidSalesCashBoxMovementInput` (L11): sin documentación — miembros: `id`, `voidedBy`, `reason`

#### Clase `VoidSalesCashBoxMovementUseCase` (L18–43)

- **Decoradores:** `@Injectable()`
- **Propósito:** Corrección de un "Aporte"/"Retiro" equivocado — nunca una edición, nunca un borrado físico.
- **Dependencias inyectadas (constructor):** `@Inject(SALES_CASH_BOX_MOVEMENT_REPOSITORY) repository: SalesCashBoxMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–42 | `input: VoidSalesCashBoxMovementInput` | `Promise<SalesCashBoxMovementOutput>` |

##### `VoidSalesCashBoxMovementUseCase.execute`

- **Firma:** `execute(input: VoidSalesCashBoxMovementInput): Promise<SalesCashBoxMovementOutput>` — [void-sales-cash-box-movement.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/application/use-cases/void-sales-cash-box-movement.use-case.ts#L25) (L25–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findById`, `new SalesCashBoxMovementNotFoundError`, `new SalesCashBoxMovementAlreadyVoidedError`, `this.repository.voidMovement`, `toSalesCashBoxMovementOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SalesCashBoxMovementNotFoundError()`, `new SalesCashBoxMovementAlreadyVoidedError()`
- **Consumidores:** [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-domain-entities-sales-cash-box-movement-entity-ts"></a>

### sales-cash-box-movement.entity.ts

- **Ruta:** [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts`, 87 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** A manual Caja de Ventas movement — "Aporte" (income) or "Retiro" (expense) — for ONE negocio's accumulated cash balance.
- **Consumidores:** [sales-cash-box-movement-output.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-dtos-sales-cash-box-movement-output-ts), [sales-cash-box-movement.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-repositories-sales-cash-box-movement-repository-ts), [sales-cash-box-movement.mapper.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-sales-cash-box-movement-mapper-ts), [sales-cash-box-movement.orm-entity.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-sales-cash-box-movement-orm-entity-ts), [typeorm-sales-cash-box.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-typeorm-sales-cash-box-repository-ts)

**Interfaces, tipos y enums:**

- `interface SalesCashBoxMovementProps` (L3): sin documentación — miembros: `id`, `businessId`, `amount`, `movementType`, `concept`, `createdByUserId`, `createdByUsername`, `createdAt`, `isVoided`, `voidedAt`, `voidedByUserId`, `voidedByUsername`, `voidReason`
- `type CashBoxMovementType` (L1) = `'CONTRIBUTION' \| 'WITHDRAWAL'`

#### Clase `SalesCashBoxMovement` (L28–86)

- **Propósito:** A manual Caja de Ventas movement — "Aporte" (income) or "Retiro" (expense) — for ONE negocio's accumulated cash balance. `amount` is always a positive magnitude; the sign is derived from `movementType` at read time, never stored — same convention as Recargas' own `RechargeCashBoxMovement` and Kardex financiero's `AccountReceivable`/`Asset`. Never physically deleted; corrected only via `voidMovement`.
- **Dependencias inyectadas (constructor):** `props: SalesCashBoxMovementProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 31–33 | `props: SalesCashBoxMovementProps` | `SalesCashBoxMovement` |
| `id` | getter public | 35–37 | — | `string` |
| `businessId` | getter public | 39–41 | — | `string` |
| `amount` | getter public | 43–45 | — | `number` |
| `movementType` | getter public | 47–49 | — | `CashBoxMovementType` |
| `concept` | getter public | 51–53 | — | `string` |
| `createdByUserId` | getter public | 55–57 | — | `string` |
| `createdByUsername` | getter public | 59–61 | — | `string` |
| `createdAt` | getter public | 63–65 | — | `Date` |
| `isVoided` | getter public | 67–69 | — | `boolean` |
| `voidedAt` | getter public | 71–73 | — | `Date \| null` |
| `voidedByUserId` | getter public | 75–77 | — | `string \| null` |
| `voidedByUsername` | getter public | 79–81 | — | `string \| null` |
| `voidReason` | getter public | 83–85 | — | `string \| null` |

##### `SalesCashBoxMovement.create`

- **Firma:** `create(props: SalesCashBoxMovementProps): SalesCashBoxMovement` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new SalesCashBoxMovement`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-cash-box-movement.mapper.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-sales-cash-box-movement-mapper-ts)

##### `SalesCashBoxMovement.id`

- **Firma:** `id(): string` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxMovement.businessId`

- **Firma:** `businessId(): string` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxMovement.amount`

- **Firma:** `amount(): number` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxMovement.movementType`

- **Firma:** `movementType(): CashBoxMovementType` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxMovement.concept`

- **Firma:** `concept(): string` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxMovement.createdByUserId`

- **Firma:** `createdByUserId(): string` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxMovement.createdByUsername`

- **Firma:** `createdByUsername(): string` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxMovement.createdAt`

- **Firma:** `createdAt(): Date` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxMovement.isVoided`

- **Firma:** `isVoided(): boolean` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxMovement.voidedAt`

- **Firma:** `voidedAt(): Date \| null` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxMovement.voidedByUserId`

- **Firma:** `voidedByUserId(): string \| null` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxMovement.voidedByUsername`

- **Firma:** `voidedByUsername(): string \| null` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxMovement.voidReason`

- **Firma:** `voidReason(): string \| null` — [sales-cash-box-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/entities/sales-cash-box-movement.entity.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-invalid-cash-box-business-error-ts"></a>

### invalid-cash-box-business.error.ts

- **Ruta:** [invalid-cash-box-business.error.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/errors/invalid-cash-box-business.error.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/domain/errors/invalid-cash-box-business.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** Covers both "no existe" and "está inactivo" — same single-message rule already used by `InvalidBusinessError` (Products) and `InvalidSupplierError` (Purchases) for their own referenced-entity checks.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-sales-cash-box.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-typeorm-sales-cash-box-repository-ts)

#### Clase `InvalidCashBoxBusinessError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Covers both "no existe" and "está inactivo" — same single-message rule already used by `InvalidBusinessError` (Products) and `InvalidSupplierError` (Purchases) for their own referenced-entity checks.
<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-invalid-movement-amount-error-ts"></a>

### invalid-movement-amount.error.ts

- **Ruta:** [invalid-movement-amount.error.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/errors/invalid-movement-amount.error.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/domain/errors/invalid-movement-amount.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** Errores de dominio: declara `InvalidMovementAmountError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-sales-cash-box.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-typeorm-sales-cash-box-repository-ts)

#### Clase `InvalidMovementAmountError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-invalid-movement-concept-error-ts"></a>

### invalid-movement-concept.error.ts

- **Ruta:** [invalid-movement-concept.error.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/errors/invalid-movement-concept.error.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/domain/errors/invalid-movement-concept.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** Errores de dominio: declara `InvalidMovementConceptError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-sales-cash-box.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-typeorm-sales-cash-box-repository-ts)

#### Clase `InvalidMovementConceptError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-sales-cash-box-movement-already-voided-error-ts"></a>

### sales-cash-box-movement-already-voided.error.ts

- **Ruta:** [sales-cash-box-movement-already-voided.error.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/errors/sales-cash-box-movement-already-voided.error.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/domain/errors/sales-cash-box-movement-already-voided.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** Errores de dominio: declara `SalesCashBoxMovementAlreadyVoidedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-sales-cash-box-movement.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-void-sales-cash-box-movement-use-case-ts)

#### Clase `SalesCashBoxMovementAlreadyVoidedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-sales-cash-box-movement-not-found-error-ts"></a>

### sales-cash-box-movement-not-found.error.ts

- **Ruta:** [sales-cash-box-movement-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/errors/sales-cash-box-movement-not-found.error.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/domain/errors/sales-cash-box-movement-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** Errores de dominio: declara `SalesCashBoxMovementNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-sales-cash-box-movement.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-void-sales-cash-box-movement-use-case-ts)

#### Clase `SalesCashBoxMovementNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-withdrawal-exceeds-balance-error-ts"></a>

### withdrawal-exceeds-balance.error.ts

- **Ruta:** [withdrawal-exceeds-balance.error.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/errors/withdrawal-exceeds-balance.error.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/domain/errors/withdrawal-exceeds-balance.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** Errores de dominio: declara `WithdrawalExceedsBalanceError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-sales-cash-box.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-typeorm-sales-cash-box-repository-ts)

#### Clase `WithdrawalExceedsBalanceError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-domain-repositories-sales-cash-box-movement-repository-ts"></a>

### sales-cash-box-movement.repository.ts

- **Ruta:** [sales-cash-box-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/domain/repositories/sales-cash-box-movement.repository.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/domain/repositories/sales-cash-box-movement.repository.ts`, 42 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RegisterSalesCashBoxMovementData`, `SalesCashBoxBalance`, `SalesCashBoxMovementRepository`, `SALES_CASH_BOX_MOVEMENT_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sales-cash-box-movement.entity.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-entities-sales-cash-box-movement-entity-ts)
- **Consumidores:** [get-sales-cash-box-balances.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-get-sales-cash-box-balances-use-case-ts), [get-sales-cash-box-movements.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-get-sales-cash-box-movements-use-case-ts), [register-sales-cash-box-contribution.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-contribution-use-case-ts), [register-sales-cash-box-withdrawal.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-withdrawal-use-case-ts), [void-sales-cash-box-movement.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-void-sales-cash-box-movement-use-case-ts), [typeorm-sales-cash-box.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-typeorm-sales-cash-box-repository-ts), [sales-cash-box.module.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-sales-cash-box-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterSalesCashBoxMovementData` (L10): sin documentación — miembros: `businessId`, `amount`, `movementType`, `concept`, `userId`
- `interface SalesCashBoxBalance` (L19): One negocio's accumulated (all-time, never reset) balance. — miembros: `businessId`, `businessName`, `balance`
- `interface SalesCashBoxMovementRepository` (L25): sin documentación — miembros: `registerMovement`, `voidMovement`, `findById`, `getBalances`, `findMovements`

**Constantes exportadas:**

- `SALES_CASH_BOX_MOVEMENT_REPOSITORY` (L6) = `Symbol( 'SALES_CASH_BOX_MOVEMENT_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-sales-cash-box-movement-mapper-ts"></a>

### sales-cash-box-movement.mapper.ts

- **Ruta:** [sales-cash-box-movement.mapper.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/sales-cash-box-movement.mapper.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/sales-cash-box-movement.mapper.ts`, 23 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** Mapper: declara `SalesCashBoxMovementMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sales-cash-box-movement.entity.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-entities-sales-cash-box-movement-entity-ts), [sales-cash-box-movement.orm-entity.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-sales-cash-box-movement-orm-entity-ts)
- **Consumidores:** [typeorm-sales-cash-box.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-typeorm-sales-cash-box-repository-ts)

#### Clase `SalesCashBoxMovementMapper` (L4–22)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–21 | `orm: SalesCashBoxMovementOrmEntity` | `SalesCashBoxMovement` |

##### `SalesCashBoxMovementMapper.toDomain`

- **Firma:** `toDomain(orm: SalesCashBoxMovementOrmEntity): SalesCashBoxMovement` — [sales-cash-box-movement.mapper.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/sales-cash-box-movement.mapper.ts#L5) (L5–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `SalesCashBoxMovement.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-sales-cash-box.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-typeorm-sales-cash-box-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-sales-cash-box-movement-orm-entity-ts"></a>

### sales-cash-box-movement.orm-entity.ts

- **Ruta:** [sales-cash-box-movement.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/sales-cash-box-movement.orm-entity.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/sales-cash-box-movement.orm-entity.ts`, 73 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `SalesCashBoxMovementOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [business.orm-entity.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [sales-cash-box-movement.entity.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-entities-sales-cash-box-movement-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [sales-cash-box-movement.mapper.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-sales-cash-box-movement-mapper-ts), [typeorm-sales-cash-box.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-typeorm-sales-cash-box-repository-ts), [sales-cash-box.module.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-sales-cash-box-module-ts)

#### Clase `SalesCashBoxMovementOrmEntity` (L15–72)

- **Decoradores:** `@Entity('sales_cash_box_movements')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column businessId: string`, `@ManyToOne business: BusinessOrmEntity`, `@Column amount: number`, `@Column movementType: CashBoxMovementType`, `@Column concept: string`, `@Column createdByUserId: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@CreateDateColumn createdAt: Date`, `@Column isVoided: boolean`, `@Column voidedAt: Date \| null`, `@Column voidedByUserId: string \| null`, `@ManyToOne voidedByUser: UserOrmEntity \| null`, `@Column voidReason: string \| null`
<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-typeorm-sales-cash-box-repository-ts"></a>

### typeorm-sales-cash-box.repository.ts

- **Ruta:** [typeorm-sales-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/typeorm-sales-cash-box.repository.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/typeorm-sales-cash-box.repository.ts`, 167 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** Lee `sale_details`/`sales` en vivo (nunca una copia) para la parte "ventas" del saldo de cada negocio — mismo patrón ya documentado en `TypeOrmRechargeCashBoxRepository` para sus cuatro tablas fuente.
- **Depende de (archivos del proyecto):** [sales-cash-box-movement.entity.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-entities-sales-cash-box-movement-entity-ts), [sales-cash-box-movement.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-repositories-sales-cash-box-movement-repository-ts), [invalid-movement-amount.error.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-invalid-movement-amount-error-ts), [invalid-movement-concept.error.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-invalid-movement-concept-error-ts), [withdrawal-exceeds-balance.error.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-withdrawal-exceeds-balance-error-ts), [invalid-cash-box-business.error.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-errors-invalid-cash-box-business-error-ts), [sales-cash-box-movement.orm-entity.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-sales-cash-box-movement-orm-entity-ts), [sales-cash-box-movement.mapper.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-sales-cash-box-movement-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [sales-cash-box.module.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-sales-cash-box-module-ts)

#### Clase `TypeOrmSalesCashBoxRepository` (L23–166)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements SalesCashBoxMovementRepository
- **Propósito:** Lee `sale_details`/`sales` en vivo (nunca una copia) para la parte "ventas" del saldo de cada negocio — mismo patrón ya documentado en `TypeOrmRechargeCashBoxRepository` para sus cuatro tablas fuente. `sales_cash_box_movements` es la única tabla propia de este repositorio.
- **Dependencias inyectadas (constructor):** `@InjectRepository(SalesCashBoxMovementOrmEntity) movementRepository: Repository<SalesCashBoxMovementOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `registerMovement` | método public async | 32–51 | `data: RegisterSalesCashBoxMovementData` | `Promise<SalesCashBoxMovement>` |
| `voidMovement` | método public async | 53–68 | `id: string`, `voidedBy: string`, `reason: string` | `Promise<SalesCashBoxMovement>` |
| `findById` | método public async | 70–73 | `id: string` | `Promise<SalesCashBoxMovement \| null>` |
| `fetchOrThrow` | método private async | 75–83 | `id: string` | `Promise<SalesCashBoxMovement>` |
| `getBalances` | método public async | 91–128 | — | `Promise<SalesCashBoxBalance[]>` |
| `findMovements` | método public async | 130–140 | `businessId: string`, `limit: number` | `Promise<SalesCashBoxMovement[]>` |
| `translateCashBoxError` | método private | 143–165 | `error: unknown` | `unknown` |

##### `TypeOrmSalesCashBoxRepository.registerMovement`

- **Firma:** `registerMovement(data: RegisterSalesCashBoxMovementData): Promise<SalesCashBoxMovement>` — [typeorm-sales-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/typeorm-sales-cash-box.repository.ts#L32) (L32–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.movementRepository.manager.query`, `this.translateCashBoxError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `register_sales_cash_box_movement`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateCashBoxError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSalesCashBoxRepository.voidMovement`

- **Firma:** `voidMovement(id: string, voidedBy: string, reason: string): Promise<SalesCashBoxMovement>` — [typeorm-sales-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/typeorm-sales-cash-box.repository.ts#L53) (L53–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.movementRepository.update`, `new Date`, `this.fetchOrThrow`
- **Efectos secundarios:** Actualiza estado (signals): `this.movementRepository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSalesCashBoxRepository.findById`

- **Firma:** `findById(id: string): Promise<SalesCashBoxMovement \| null>` — [typeorm-sales-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/typeorm-sales-cash-box.repository.ts#L70) (L70–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.movementRepository.findOne`, `SalesCashBoxMovementMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmSalesCashBoxRepository.fetchOrThrow`

- **Firma:** `fetchOrThrow(id: string): Promise<SalesCashBoxMovement>` — [typeorm-sales-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/typeorm-sales-cash-box.repository.ts#L75) (L75–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InternalServerErrorException( 'No se pudo recuperar el movimiento de caja recién registrado.', )`
- **Consumidores:** (mismo archivo)

##### `TypeOrmSalesCashBoxRepository.getBalances`

- **Firma:** `getBalances(): Promise<SalesCashBoxBalance[]>` — [typeorm-sales-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/typeorm-sales-cash-box.repository.ts#L91) (L91–128)
- **Propósito / descripción:** Un solo query para TODOS los negocios activos — nunca una llamada por negocio. `sales`/`contrib`/`withd` son subconsultas agregadas independientes, unidas por `LEFT JOIN` para que un negocio sin ninguna venta/aporte/retiro todavía aparezca con saldo `0`, no ausente.
- **Dependencias (llamadas en su cuerpo):** `this.movementRepository.manager.query`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Tablas en su SQL: `businesses`, `sale_details`, `sales`, `sales_cash_box_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSalesCashBoxRepository.findMovements`

- **Firma:** `findMovements(businessId: string, limit: number): Promise<SalesCashBoxMovement[]>` — [typeorm-sales-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/typeorm-sales-cash-box.repository.ts#L130) (L130–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.movementRepository.find`, `orms.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSalesCashBoxRepository.translateCashBoxError`

- **Firma:** `translateCashBoxError(error: unknown): unknown` — [typeorm-sales-cash-box.repository.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/infrastructure/persistence/typeorm-sales-cash-box.repository.ts#L143) (L143–165)
- **Propósito / descripción:** Mismo patrón `RAISE EXCEPTION '&lt;CODE&gt;[:extra]'` → error de dominio que `translateCashBoxError` de Recargas.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new InvalidMovementAmountError`, `new InvalidMovementConceptError`, `new WithdrawalExceedsBalanceError`, `new InvalidCashBoxBusinessError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts"></a>

### sales-cash-box.controller.ts

- **Ruta:** [sales-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/controllers/sales-cash-box.controller.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/presentation/controllers/sales-cash-box.controller.ts`, 106 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** "Caja de Ventas" por negocio — saldo acumulado independiente por `business_id`, mismo patrón que `RechargeCashBoxController` (módulo propio, solo LEE `sales`/`sale_details`, nunca escribe en ellas).
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-sales-cash-box-balances.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-get-sales-cash-box-balances-use-case-ts), [get-sales-cash-box-movements.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-get-sales-cash-box-movements-use-case-ts), [register-sales-cash-box-contribution.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-contribution-use-case-ts), [register-sales-cash-box-withdrawal.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-withdrawal-use-case-ts), [void-sales-cash-box-movement.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-void-sales-cash-box-movement-use-case-ts), [register-sales-cash-box-movement.request.dto.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-dtos-register-sales-cash-box-movement-request-dto-ts), [void-sales-cash-box-movement.request.dto.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-dtos-void-sales-cash-box-movement-request-dto-ts), [sales-cash-box-movements.query.dto.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-dtos-sales-cash-box-movements-query-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales-cash-box.module.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-sales-cash-box-module-ts)

#### Clase `SalesCashBoxController` (L35–105)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('sales-cash-box')`
- **Propósito:** "Caja de Ventas" por negocio — saldo acumulado independiente por `business_id`, mismo patrón que `RechargeCashBoxController` (módulo propio, solo LEE `sales`/`sale_details`, nunca escribe en ellas). Leer saldos/movimientos es operativo (cualquier cuenta autenticada activa); registrar o anular un "Aporte"/"Retiro" es una acción de gestión, `@Roles('ADMIN','SUPER_ADMIN')` a nivel de método — mismo criterio exacto que Recargas ya usa para su propia Caja Contable.
- **Dependencias inyectadas (constructor):** `getBalancesUseCase: GetSalesCashBoxBalancesUseCase`, `getMovementsUseCase: GetSalesCashBoxMovementsUseCase`, `registerContributionUseCase: RegisterSalesCashBoxContributionUseCase`, `registerWithdrawalUseCase: RegisterSalesCashBoxWithdrawalUseCase`, `voidMovementUseCase: VoidSalesCashBoxMovementUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getBalances` | método public | 46–49 | — | (inferido) |
| `getMovements` | método public | 51–57 | `query: SalesCashBoxMovementsQueryDto` | (inferido) |
| `registerContribution` | método public | 59–73 | `dto: RegisterSalesCashBoxMovementRequestDto`, `userId: string` | (inferido) |
| `registerWithdrawal` | método public | 75–89 | `dto: RegisterSalesCashBoxMovementRequestDto`, `userId: string` | (inferido) |
| `voidMovement` | método public | 91–104 | `id: string`, `dto: VoidSalesCashBoxMovementRequestDto`, `userId: string` | (inferido) |

##### `SalesCashBoxController.getBalances`

- **Firma:** `getBalances()` — [sales-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/controllers/sales-cash-box.controller.ts#L46) (L46–49)
- **Decoradores:** `@Get('balances')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getBalancesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxController.getMovements`

- **Firma:** `getMovements(query: SalesCashBoxMovementsQueryDto)` — [sales-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/controllers/sales-cash-box.controller.ts#L51) (L51–57)
- **Decoradores:** `@Get('movements')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getMovementsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxController.registerContribution`

- **Firma:** `registerContribution(dto: RegisterSalesCashBoxMovementRequestDto, userId: string)` — [sales-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/controllers/sales-cash-box.controller.ts#L59) (L59–73)
- **Decoradores:** `@Post('contributions')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerContributionUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxController.registerWithdrawal`

- **Firma:** `registerWithdrawal(dto: RegisterSalesCashBoxMovementRequestDto, userId: string)` — [sales-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/controllers/sales-cash-box.controller.ts#L75) (L75–89)
- **Decoradores:** `@Post('withdrawals')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerWithdrawalUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesCashBoxController.voidMovement`

- **Firma:** `voidMovement(id: string, dto: VoidSalesCashBoxMovementRequestDto, userId: string)` — [sales-cash-box.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/controllers/sales-cash-box.controller.ts#L91) (L91–104)
- **Decoradores:** `@Post('movements/:id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidMovementUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-dtos-register-sales-cash-box-movement-request-dto-ts"></a>

### register-sales-cash-box-movement.request.dto.ts

- **Ruta:** [register-sales-cash-box-movement.request.dto.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/dtos/register-sales-cash-box-movement.request.dto.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/presentation/dtos/register-sales-cash-box-movement.request.dto.ts`, 17 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** DTO de entrada: declara `RegisterSalesCashBoxMovementRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts)

#### Clase `RegisterSalesCashBoxMovementRequestDto` (L3–16)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-dtos-sales-cash-box-movements-query-dto-ts"></a>

### sales-cash-box-movements.query.dto.ts

- **Ruta:** [sales-cash-box-movements.query.dto.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/dtos/sales-cash-box-movements.query.dto.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/presentation/dtos/sales-cash-box-movements.query.dto.ts`, 15 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** DTO de consulta: declara `SalesCashBoxMovementsQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts)

#### Clase `SalesCashBoxMovementsQueryDto` (L4–14)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-dtos-void-sales-cash-box-movement-request-dto-ts"></a>

### void-sales-cash-box-movement.request.dto.ts

- **Ruta:** [void-sales-cash-box-movement.request.dto.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/presentation/dtos/void-sales-cash-box-movement.request.dto.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/presentation/dtos/void-sales-cash-box-movement.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** Mirrors `VoidCashBoxMovementRequestDto` (Recargas) — same mandatory-reason shape, this module's own copy.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts)

#### Clase `VoidSalesCashBoxMovementRequestDto` (L4–10)

- **Propósito:** Mirrors `VoidCashBoxMovementRequestDto` (Recargas) — same mandatory-reason shape, this module's own copy. Works for either movement type.
<a id="f-comercial-jhoel-api-src-modules-sales-cash-box-sales-cash-box-module-ts"></a>

### sales-cash-box.module.ts

- **Ruta:** [sales-cash-box.module.ts](../../../../comercial-jhoel-api/src/modules/sales-cash-box/sales-cash-box.module.ts) (`comercial-jhoel-api/src/modules/sales-cash-box/sales-cash-box.module.ts`, 39 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `sales-cash-box`
- **Responsabilidad:** "Caja de Ventas" — módulo completamente independiente (propio domain/ application/infrastructure/presentation, sin importar `SalesModule`), mismo patrón que `RechargeCashBoxModule`.
- **Depende de (archivos del proyecto):** [sales-cash-box-movement.orm-entity.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-sales-cash-box-movement-orm-entity-ts), [sales-cash-box-movement.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-domain-repositories-sales-cash-box-movement-repository-ts), [typeorm-sales-cash-box.repository.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-infrastructure-persistence-typeorm-sales-cash-box-repository-ts), [get-sales-cash-box-balances.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-get-sales-cash-box-balances-use-case-ts), [get-sales-cash-box-movements.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-get-sales-cash-box-movements-use-case-ts), [register-sales-cash-box-contribution.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-contribution-use-case-ts), [register-sales-cash-box-withdrawal.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-register-sales-cash-box-withdrawal-use-case-ts), [void-sales-cash-box-movement.use-case.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-application-use-cases-void-sales-cash-box-movement-use-case-ts), [sales-cash-box.controller.ts](sales-cash-box.md#f-comercial-jhoel-api-src-modules-sales-cash-box-presentation-controllers-sales-cash-box-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `SalesCashBoxModule` (L23–38)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([SalesCashBoxMovementOrmEntity])], controllers: [SalesCashBoxController], providers: [ { provide: SALES_CASH_BOX_MOV`
- **Propósito:** "Caja de Ventas" — módulo completamente independiente (propio domain/ application/infrastructure/presentation, sin importar `SalesModule`), mismo patrón que `RechargeCashBoxModule`. Solo LEE `sale_details`/`sales` (vía SQL crudo en `TypeOrmSalesCashBoxRepository.getBalances`, no registrando esas entidades en `forFeature` — no se necesitan como `Repository&lt;T&gt;` inyectado, solo como texto de tabla en el query) — nunca escribe en ellas. `sales_cash_box_movements` es la única tabla propia de este módulo.
