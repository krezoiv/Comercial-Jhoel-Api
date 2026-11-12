# Módulo backend `assets`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/assets` | [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L61) `AssetsController.create` | [CreateAssetUseCase](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-create-asset-use-case-ts) | `AssetRepository`.create<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AssetService.createAsset` |
| `GET /api/assets` | [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L72) `AssetsController.findAll` | [ListAssetsUseCase](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-list-assets-use-case-ts) | `AssetRepository`.findAll | UseGuards(JwtAuthGuard) | `AssetService.getAssets` |
| `GET /api/assets/summary` | [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L80) `AssetsController.getActiveBalanceSummary` | [GetAssetActiveBalanceUseCase](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-active-balance-use-case-ts) | `AssetRepository`.getReportSummary | UseGuards(JwtAuthGuard) | `AssetService.getActiveBalance` |
| `GET /api/assets/:id` | [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L85) `AssetsController.findOne` | [GetAssetByIdUseCase](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-by-id-use-case-ts) | `AssetRepository`.findById | UseGuards(JwtAuthGuard) | `AssetService.getAssetById` |
| `PATCH /api/assets/:id` | [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L90) `AssetsController.update` | [UpdateAssetUseCase](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-update-asset-use-case-ts) | `AssetRepository`.findById/update<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AssetService.updateAsset` |
| `DELETE /api/assets/:id` | [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L101) `AssetsController.deactivate` | [DeactivateAssetUseCase](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-deactivate-asset-use-case-ts) | `AssetRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AssetService.deleteAsset` |
| `POST /api/assets/:clientId/charges` | [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L110) `AssetsController.registerCharge` | [RegisterAssetChargeUseCase](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-charge-use-case-ts) | `AssetRepository`.registerMovement → `register_asset_movement`<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AssetService.registerCharge` |
| `POST /api/assets/:clientId/payments` | [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L127) `AssetsController.registerPayment` | [RegisterAssetPaymentUseCase](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-payment-use-case-ts) | `AssetRepository`.registerMovement → `register_asset_movement`<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AssetService.registerPayment` |
| `GET /api/assets/:clientId/statement` | [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L144) `AssetsController.getStatement` | [GetAssetStatementUseCase](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-statement-use-case-ts) | `AssetRepository`.getStatement [clients, assets, users, movements]<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) | `AssetService.getStatement` |
| `GET /api/assets/:clientId/balance` | [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L153) `AssetsController.getCurrentBalance` | [GetAssetCurrentBalanceUseCase](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-current-balance-use-case-ts) | `AssetRepository`.getCurrentBalance [assets]<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) | `AssetService.getCurrentBalance` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [asset-output.ts](#f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toAssetOutput`, `AssetOutput` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [asset-statement-output.ts](#f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-statement-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toStatementMovementOutput`, `toAssetStatementOutput`, `StatementMovementOutput`, `AssetStatementOutput` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [create-asset.use-case.ts](#f-comercial-jhoel-api-src-modules-assets-application-use-cases-create-asset-use-case-ts) | .ts | Caso de uso | Aplicación | Validates the referenced client exists and is active, same pattern `CreateProductUseCase` uses for `categoryId`/`businessId`. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-asset.use-case.ts](#f-comercial-jhoel-api-src-modules-assets-application-use-cases-deactivate-asset-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — DELETE /assets/:id never removes the row, preserving historial integrity. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-asset-active-balance.use-case.ts](#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-active-balance-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the plain list screen's "Saldo total" tile — always scoped to `isActive: true` only, independent of whatever search/date/client filters the list itself currently has applied. | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-asset-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetAssetByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-asset-current-balance.use-case.ts](#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-current-balance-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the client selector's "Saldo actual" display — a single bounded aggregate, never a full-history fetch. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-asset-statement.use-case.ts](#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-statement-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the "Estado de Cuenta" view — saldo inicial del periodo, movimientos con saldo corrido, totales. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-assets.use-case.ts](#f-comercial-jhoel-api-src-modules-assets-application-use-cases-list-assets-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListAssetsUseCase`, `ListAssetsInput`, `ListAssetsOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [register-asset-charge.use-case.ts](#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-charge-use-case-ts) | .ts | Caso de uso | Aplicación | "Registrar Cargo" for Activos — an independent Kardex movement, never a rewrite of a prior one (see the migration's own doc comment for the full reasoning). | 5 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [register-asset-payment.use-case.ts](#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-payment-use-case-ts) | .ts | Caso de uso | Aplicación | "Registrar Abono" for Activos. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-asset.use-case.ts](#f-comercial-jhoel-api-src-modules-assets-application-use-cases-update-asset-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateAssetUseCase`, `UpdateAssetInput` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [assets.module.ts](#f-comercial-jhoel-api-src-modules-assets-assets-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `AssetsModule` (sin comentario de documentación en el código). | 15 internas; ext.: @nestjs/common, @nestjs/typeorm | 4 | Media (4 consumidores) |
| [asset.entity.ts](#f-comercial-jhoel-api-src-modules-assets-domain-entities-asset-entity-ts) | .ts | Entidad de dominio | Dominio | "Activos" — a client-linked Kardex/ledger: every row is a `CARGO` (adds to the balance) or `ABONO` (subtracts) movement, `amount` always a positive magnitude (see migration `CreateFinancialKardexColumns` — this replaced the older "amount may be negative" convention from `1758200000000-AllowNegativeA | 0 internas | 5 | Media (5 consumidores) |
| [asset-not-found.error.ts](#f-comercial-jhoel-api-src-modules-assets-domain-errors-asset-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `AssetNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [invalid-movement.error.ts](#f-comercial-jhoel-api-src-modules-assets-domain-errors-invalid-movement-error-ts) | .ts | Errores de dominio | Dominio | Defensive only — `RegisterMovementRequestDto` already validates `movementType`/`amount` before this ever reaches SQL; these translate `register_asset_movement`'s own guard rails should that validation ever be bypassed. | 1 internas | 1 | Baja (1 consumidores) |
| [referenced-client-invalid.error.ts](#f-comercial-jhoel-api-src-modules-assets-domain-errors-referenced-client-invalid-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `ReferencedClientNotFoundError`, `ReferencedClientInactiveError` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [asset.repository.ts](#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `FindAssetsOptions`, `PaginatedResult`, `FindAssetsReportSummaryOptions`, `AssetsReportSummary`, `CreateAssetData` (sin comentario de documentación en el código). | 2 internas | 17 | Alta (17 consumidores) |
| [asset.mapper.ts](#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `AssetMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [asset.orm-entity.ts](#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `AssetOrmEntity` (sin comentario de documentación en el código). | 3 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [typeorm-asset.repository.ts](#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-typeorm-asset-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmAssetRepository`, `SORT_COLUMN` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [assets.controller.ts](#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts) | .ts | Controlador | Presentación | Create/update/deactivate are admin-only — same policy as Products/Clients. | 21 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [asset.response.dto.ts](#f-comercial-jhoel-api-src-modules-assets-presentation-dtos-asset-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `AssetResponseDto`, `PaginatedAssetsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [create-asset.request.dto.ts](#f-comercial-jhoel-api-src-modules-assets-presentation-dtos-create-asset-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateAssetRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [get-statement.query.dto.ts](#f-comercial-jhoel-api-src-modules-assets-presentation-dtos-get-statement-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `GetStatementQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-assets.query.dto.ts](#f-comercial-jhoel-api-src-modules-assets-presentation-dtos-list-assets-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListAssetsQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [register-movement.request.dto.ts](#f-comercial-jhoel-api-src-modules-assets-presentation-dtos-register-movement-request-dto-ts) | .ts | DTO de entrada | Presentación | Backs both "Registrar Cargo" and "Registrar Abono" — `clientId` comes from the route param, never the body. | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [statement.response.dto.ts](#f-comercial-jhoel-api-src-modules-assets-presentation-dtos-statement-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `StatementMovementResponseDto`, `AssetStatementResponseDto`, `CurrentBalanceResponseDto`, `ActiveBalanceSummaryResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [update-asset.request.dto.ts](#f-comercial-jhoel-api-src-modules-assets-presentation-dtos-update-asset-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateAssetRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-output-ts"></a>

### asset-output.ts

- **Ruta:** [asset-output.ts](../../../../comercial-jhoel-api/src/modules/assets/application/dtos/asset-output.ts) (`comercial-jhoel-api/src/modules/assets/application/dtos/asset-output.ts`, 38 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** DTO de salida (aplicación): declara `toAssetOutput`, `AssetOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [asset.entity.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-entities-asset-entity-ts)
- **Consumidores:** [create-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-create-asset-use-case-ts), [get-asset-by-id.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-by-id-use-case-ts), [list-assets.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-list-assets-use-case-ts), [register-asset-charge.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-charge-use-case-ts), [register-asset-payment.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-payment-use-case-ts), [update-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-update-asset-use-case-ts)

**Interfaces, tipos y enums:**

- `interface AssetOutput` (L3): sin documentación — miembros: `id`, `clientId`, `clientName`, `date`, `amount`, `movementType`, `description`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
#### Función `toAssetOutput` (L20–37)

- **Tipo:** función exportada
- **Firma:** `toAssetOutput(asset: Asset): AssetOutput` — [asset-output.ts](../../../../comercial-jhoel-api/src/modules/assets/application/dtos/asset-output.ts#L20)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-create-asset-use-case-ts), [get-asset-by-id.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-by-id-use-case-ts), [register-asset-charge.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-charge-use-case-ts), [register-asset-payment.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-payment-use-case-ts), [update-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-update-asset-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-statement-output-ts"></a>

### asset-statement-output.ts

- **Ruta:** [asset-statement-output.ts](../../../../comercial-jhoel-api/src/modules/assets/application/dtos/asset-statement-output.ts) (`comercial-jhoel-api/src/modules/assets/application/dtos/asset-statement-output.ts`, 56 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** DTO de salida (aplicación): declara `toStatementMovementOutput`, `toAssetStatementOutput`, `StatementMovementOutput`, `AssetStatementOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [asset.entity.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-entities-asset-entity-ts), [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts)
- **Consumidores:** [get-asset-statement.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-statement-use-case-ts)

**Interfaces, tipos y enums:**

- `interface StatementMovementOutput` (L7): sin documentación — miembros: `id`, `date`, `movementType`, `description`, `amount`, `balanceAfter`, `createdByUsername`, `createdAt`
- `interface AssetStatementOutput` (L18): sin documentación — miembros: `clientId`, `clientName`, `openingBalance`, `movements`, `totalCargos`, `totalAbonos`, `closingBalance`
#### Función `toStatementMovementOutput` (L28–41)

- **Tipo:** función local del archivo
- **Firma:** `toStatementMovementOutput(movement: StatementMovement): StatementMovementOutput` — [asset-statement-output.ts](../../../../comercial-jhoel-api/src/modules/assets/application/dtos/asset-statement-output.ts#L28)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toAssetStatementOutput` (L43–55)

- **Tipo:** función exportada
- **Firma:** `toAssetStatementOutput(statement: AssetStatement): AssetStatementOutput` — [asset-statement-output.ts](../../../../comercial-jhoel-api/src/modules/assets/application/dtos/asset-statement-output.ts#L43)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `statement.movements.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-asset-statement.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-statement-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-assets-application-use-cases-create-asset-use-case-ts"></a>

### create-asset.use-case.ts

- **Ruta:** [create-asset.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/create-asset.use-case.ts) (`comercial-jhoel-api/src/modules/assets/application/use-cases/create-asset.use-case.ts`, 52 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Validates the referenced client exists and is active, same pattern `CreateProductUseCase` uses for `categoryId`/`businessId`.
- **Depende de (archivos del proyecto):** [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [referenced-client-invalid.error.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-errors-referenced-client-invalid-error-ts), [asset-output.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateAssetInput` (L12): sin documentación — miembros: `clientId`, `date`, `amount`, `description`, `createdBy`

#### Clase `CreateAssetUseCase` (L21–51)

- **Decoradores:** `@Injectable()`
- **Propósito:** Validates the referenced client exists and is active, same pattern `CreateProductUseCase` uses for `categoryId`/`businessId`. `CreateAccountReceivableUseCase` and both modules' `Update*`/`List*`/`Deactivate*`/`GetById` use cases are the identical clone relationship.
- **Dependencias inyectadas (constructor):** `@Inject(ASSET_REPOSITORY) assetRepository: AssetRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–50 | `input: CreateAssetInput` | `Promise<AssetOutput>` |

##### `CreateAssetUseCase.execute`

- **Firma:** `execute(input: CreateAssetInput): Promise<AssetOutput>` — [create-asset.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/create-asset.use-case.ts#L30) (L30–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new ReferencedClientNotFoundError`, `new ReferencedClientInactiveError`, `input.description?.trim().replace`, `input.description?.trim`, `this.assetRepository.create`, `toAssetOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ReferencedClientNotFoundError()`, `new ReferencedClientInactiveError()`
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-assets-application-use-cases-deactivate-asset-use-case-ts"></a>

### deactivate-asset.use-case.ts

- **Ruta:** [deactivate-asset.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/deactivate-asset.use-case.ts) (`comercial-jhoel-api/src/modules/assets/application/use-cases/deactivate-asset.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Soft delete only — DELETE /assets/:id never removes the row, preserving historial integrity.
- **Depende de (archivos del proyecto):** [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [asset-not-found.error.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-errors-asset-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

#### Clase `DeactivateAssetUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — DELETE /assets/:id never removes the row, preserving historial integrity.
- **Dependencias inyectadas (constructor):** `@Inject(ASSET_REPOSITORY) assetRepository: AssetRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<void>` |

##### `DeactivateAssetUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-asset.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/deactivate-asset.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.assetRepository.findById`, `new AssetNotFoundError`, `this.assetRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new AssetNotFoundError()`
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-active-balance-use-case-ts"></a>

### get-asset-active-balance.use-case.ts

- **Ruta:** [get-asset-active-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-active-balance.use-case.ts) (`comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-active-balance.use-case.ts`, 29 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Backs the plain list screen's "Saldo total" tile — always scoped to `isActive: true` only, independent of whatever search/date/client filters the list itself currently has applied.
- **Depende de (archivos del proyecto):** [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

**Interfaces, tipos y enums:**

- `interface AssetActiveBalanceOutput` (L5): sin documentación — miembros: `totalAmount`, `recordCount`

#### Clase `GetAssetActiveBalanceUseCase` (L18–28)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the plain list screen's "Saldo total" tile — always scoped to `isActive: true` only, independent of whatever search/date/client filters the list itself currently has applied. Reuses the same signed-sum `getReportSummary()` aggregate Cuadre de Agentes and Reportería already depend on — never a client-side sum over one fetched page, which would silently undercount whatever didn't fit the page.
- **Dependencias inyectadas (constructor):** `@Inject(ASSET_REPOSITORY) assetRepository: AssetRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–27 | — | `Promise<AssetActiveBalanceOutput>` |

##### `GetAssetActiveBalanceUseCase.execute`

- **Firma:** `execute(): Promise<AssetActiveBalanceOutput>` — [get-asset-active-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-active-balance.use-case.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.assetRepository.getReportSummary`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-by-id-use-case-ts"></a>

### get-asset-by-id.use-case.ts

- **Ruta:** [get-asset-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Caso de uso: declara `GetAssetByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [asset-not-found.error.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-errors-asset-not-found-error-ts), [asset-output.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

#### Clase `GetAssetByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ASSET_REPOSITORY) assetRepository: AssetRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<AssetOutput>` |

##### `GetAssetByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<AssetOutput>` — [get-asset-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.assetRepository.findById`, `new AssetNotFoundError`, `toAssetOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new AssetNotFoundError()`
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-current-balance-use-case-ts"></a>

### get-asset-current-balance.use-case.ts

- **Ruta:** [get-asset-current-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-current-balance.use-case.ts) (`comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-current-balance.use-case.ts`, 28 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Backs the client selector's "Saldo actual" display — a single bounded aggregate, never a full-history fetch.
- **Depende de (archivos del proyecto):** [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [referenced-client-invalid.error.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-errors-referenced-client-invalid-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

#### Clase `GetAssetCurrentBalanceUseCase` (L9–27)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the client selector's "Saldo actual" display — a single bounded aggregate, never a full-history fetch.
- **Dependencias inyectadas (constructor):** `@Inject(ASSET_REPOSITORY) assetRepository: AssetRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 18–26 | `clientId: string` | `Promise<{ balance: number }>` |

##### `GetAssetCurrentBalanceUseCase.execute`

- **Firma:** `execute(clientId: string): Promise<{ balance: number }>` — [get-asset-current-balance.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-current-balance.use-case.ts#L18) (L18–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new ReferencedClientNotFoundError`, `this.assetRepository.getCurrentBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ReferencedClientNotFoundError()`
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-statement-use-case-ts"></a>

### get-asset-statement.use-case.ts

- **Ruta:** [get-asset-statement.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-statement.use-case.ts) (`comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-statement.use-case.ts`, 42 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Backs the "Estado de Cuenta" view — saldo inicial del periodo, movimientos con saldo corrido, totales.
- **Depende de (archivos del proyecto):** [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [referenced-client-invalid.error.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-errors-referenced-client-invalid-error-ts), [asset-statement-output.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-statement-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

**Interfaces, tipos y enums:**

- `interface GetAssetStatementInput` (L12): sin documentación — miembros: `clientId`, `dateFrom`, `dateTo`

#### Clase `GetAssetStatementUseCase` (L19–41)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the "Estado de Cuenta" view — saldo inicial del periodo, movimientos con saldo corrido, totales. Never iterates full history client-side; the repository derives everything with one bounded, window-function query.
- **Dependencias inyectadas (constructor):** `@Inject(ASSET_REPOSITORY) assetRepository: AssetRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 28–40 | `input: GetAssetStatementInput` | `Promise<AssetStatementOutput>` |

##### `GetAssetStatementUseCase.execute`

- **Firma:** `execute(input: GetAssetStatementInput): Promise<AssetStatementOutput>` — [get-asset-statement.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-statement.use-case.ts#L28) (L28–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new ReferencedClientNotFoundError`, `this.assetRepository.getStatement`, `toAssetStatementOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ReferencedClientNotFoundError()`
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-assets-application-use-cases-list-assets-use-case-ts"></a>

### list-assets.use-case.ts

- **Ruta:** [list-assets.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/list-assets.use-case.ts) (`comercial-jhoel-api/src/modules/assets/application/use-cases/list-assets.use-case.ts`, 72 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Caso de uso: declara `ListAssetsUseCase`, `ListAssetsInput`, `ListAssetsOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [asset-output.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts), [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [get-assets-receivables-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-use-case-ts)

**Interfaces, tipos y enums:**

- `interface ListAssetsInput` (L10): sin documentación — miembros: `clientId`, `dateFrom`, `dateTo`, `minAmount`, `maxAmount`, `search`, `sortBy`, `sortDirection`, `page`, `limit`, `isActive`
- `interface ListAssetsOutput` (L25): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `ListAssetsUseCase` (L36–71)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ASSET_REPOSITORY) assetRepository: AssetRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 43–70 | `input?: ListAssetsInput` | `Promise<ListAssetsOutput>` |

##### `ListAssetsUseCase.execute`

- **Firma:** `execute(input?: ListAssetsInput): Promise<ListAssetsOutput>` — [list-assets.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/list-assets.use-case.ts#L43) (L43–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `this.assetRepository.findAll`, `input.search?.trim`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts), [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [get-assets-receivables-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-charge-use-case-ts"></a>

### register-asset-charge.use-case.ts

- **Ruta:** [register-asset-charge.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/register-asset-charge.use-case.ts) (`comercial-jhoel-api/src/modules/assets/application/use-cases/register-asset-charge.use-case.ts`, 64 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** "Registrar Cargo" for Activos — an independent Kardex movement, never a rewrite of a prior one (see the migration's own doc comment for the full reasoning).
- **Depende de (archivos del proyecto):** [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [referenced-client-invalid.error.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-errors-referenced-client-invalid-error-ts), [asset-output.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-output-ts), [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts), [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts)

**Interfaces, tipos y enums:**

- `interface RegisterAssetChargeInput` (L13): sin documentación — miembros: `clientId`, `amount`, `date`, `description`, `createdBy`, `referenceType`, `referenceId`, `context`

#### Clase `RegisterAssetChargeUseCase` (L27–63)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Registrar Cargo" for Activos — an independent Kardex movement, never a rewrite of a prior one (see the migration's own doc comment for the full reasoning).
- **Dependencias inyectadas (constructor):** `@Inject(ASSET_REPOSITORY) assetRepository: AssetRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 36–62 | `input: RegisterAssetChargeInput` | `Promise<AssetOutput>` |

##### `RegisterAssetChargeUseCase.execute`

- **Firma:** `execute(input: RegisterAssetChargeInput): Promise<AssetOutput>` — [register-asset-charge.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/register-asset-charge.use-case.ts#L36) (L36–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new ReferencedClientNotFoundError`, `new ReferencedClientInactiveError`, `input.description?.trim().replace`, `input.description?.trim`, `this.assetRepository.registerMovement`, `toAssetOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ReferencedClientNotFoundError()`, `new ReferencedClientInactiveError()`
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-payment-use-case-ts"></a>

### register-asset-payment.use-case.ts

- **Ruta:** [register-asset-payment.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/register-asset-payment.use-case.ts) (`comercial-jhoel-api/src/modules/assets/application/use-cases/register-asset-payment.use-case.ts`, 59 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** "Registrar Abono" for Activos.
- **Depende de (archivos del proyecto):** [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [referenced-client-invalid.error.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-errors-referenced-client-invalid-error-ts), [asset-output.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

**Interfaces, tipos y enums:**

- `interface RegisterAssetPaymentInput` (L12): sin documentación — miembros: `clientId`, `amount`, `date`, `description`, `createdBy`

#### Clase `RegisterAssetPaymentUseCase` (L27–58)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Registrar Abono" for Activos. Deliberately does NOT pre-check the amount against the current balance — `register_asset_movement` allows the resulting balance to go negative on purpose (Activos already has 5 real, live rows depending on exactly this capability; see the migration's own doc comment), unlike the equivalent Cuentas por Cobrar use case.
- **Dependencias inyectadas (constructor):** `@Inject(ASSET_REPOSITORY) assetRepository: AssetRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 36–57 | `input: RegisterAssetPaymentInput` | `Promise<AssetOutput>` |

##### `RegisterAssetPaymentUseCase.execute`

- **Firma:** `execute(input: RegisterAssetPaymentInput): Promise<AssetOutput>` — [register-asset-payment.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/register-asset-payment.use-case.ts#L36) (L36–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new ReferencedClientNotFoundError`, `new ReferencedClientInactiveError`, `input.description?.trim().replace`, `input.description?.trim`, `this.assetRepository.registerMovement`, `toAssetOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ReferencedClientNotFoundError()`, `new ReferencedClientInactiveError()`
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-assets-application-use-cases-update-asset-use-case-ts"></a>

### update-asset.use-case.ts

- **Ruta:** [update-asset.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/update-asset.use-case.ts) (`comercial-jhoel-api/src/modules/assets/application/use-cases/update-asset.use-case.ts`, 62 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Caso de uso: declara `UpdateAssetUseCase`, `UpdateAssetInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [asset-not-found.error.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-errors-asset-not-found-error-ts), [referenced-client-invalid.error.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-errors-referenced-client-invalid-error-ts), [asset-output.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateAssetInput` (L13): sin documentación — miembros: `clientId`, `date`, `amount`, `description`, `updatedBy`

#### Clase `UpdateAssetUseCase` (L21–61)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ASSET_REPOSITORY) assetRepository: AssetRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–60 | `id: string`, `input: UpdateAssetInput` | `Promise<AssetOutput>` |

##### `UpdateAssetUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateAssetInput): Promise<AssetOutput>` — [update-asset.use-case.ts](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/update-asset.use-case.ts#L30) (L30–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.assetRepository.findById`, `new AssetNotFoundError`, `this.clientRepository.findById`, `new ReferencedClientNotFoundError`, `new ReferencedClientInactiveError`, `input.description?.trim().replace`, `input.description?.trim`, `this.assetRepository.update`, `toAssetOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.assetRepository.update`
- **Errores que lanza:** `new AssetNotFoundError()`, `new ReferencedClientNotFoundError()`, `new ReferencedClientInactiveError()`
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-assets-assets-module-ts"></a>

### assets.module.ts

- **Ruta:** [assets.module.ts](../../../../comercial-jhoel-api/src/modules/assets/assets.module.ts) (`comercial-jhoel-api/src/modules/assets/assets.module.ts`, 46 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Módulo: declara `AssetsModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts), [asset.orm-entity.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-orm-entity-ts), [typeorm-asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-typeorm-asset-repository-ts), [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [create-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-create-asset-use-case-ts), [list-assets.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-list-assets-use-case-ts), [get-asset-by-id.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-by-id-use-case-ts), [update-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-update-asset-use-case-ts), [deactivate-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-deactivate-asset-use-case-ts), [register-asset-charge.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-charge-use-case-ts), [register-asset-payment.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-payment-use-case-ts), [get-asset-statement.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-statement-use-case-ts), [get-asset-current-balance.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-current-balance-use-case-ts), [get-asset-active-balance.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-active-balance-use-case-ts), [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [banks.module.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-banks-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `AssetsModule` (L19–45)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([AssetOrmEntity]), ClientsModule], controllers: [AssetsController], providers: [ { provide: ASSET_REPOSITORY, useCla`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-assets-domain-entities-asset-entity-ts"></a>

### asset.entity.ts

- **Ruta:** [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts) (`comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts`, 108 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** "Activos" — a client-linked Kardex/ledger: every row is a `CARGO` (adds to the balance) or `ABONO` (subtracts) movement, `amount` always a positive magnitude (see migration `CreateFinancialKardexColumns` — this replaced the older "amount may be negative" convention from `1758200000000-AllowNegativeA
- **Descripción del autor (comentario del archivo):** "Activos" — a client-linked Kardex/ledger: every row is a `CARGO` (adds to the balance) or `ABONO` (subtracts) movement, `amount` always a positive magnitude (see migration `CreateFinancialKardexColumns` — this replaced the older "amount may be negative" convention from `1758200000000-AllowNegativeAssetAmount`; a negative entry is now `movementType: 'ABONO'` with a positive `amount`, not a negative `amount`). The client's current balance subtracts from the daily Cuadre Agentes result (`Cash + Banks + AccountsReceivable − Assets`, see `GetCuadreAgentesSummaryUseCase` in the banks module). Struc
- **Consumidores:** [asset-output.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-output-ts), [asset-statement-output.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-statement-output-ts), [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [asset.mapper.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-mapper-ts), [typeorm-asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-typeorm-asset-repository-ts)

**Interfaces, tipos y enums:**

- `interface AssetProps` (L22): sin documentación — miembros: `id`, `clientId`, `clientName`, `date`, `amount`, `movementType`, `sequence`, `description`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `type AssetMovementType` (L20) = `'CARGO' \| 'ABONO'` — "Activos" — a client-linked Kardex/ledger: every row is a `CARGO` (adds to the balance) or `ABONO` (subtracts) movement, `amount` always a positive magnitude (see migration `CreateFinancialKardexColumns` — this replaced the older "amount may be negative" convention from `1758200000000-AllowNegativeA

#### Clase `Asset` (L41–107)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: AssetProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 44–46 | `props: AssetProps` | `Asset` |
| `id` | getter public | 48–50 | — | `string` |
| `clientId` | getter public | 52–54 | — | `string` |
| `clientName` | getter public | 56–58 | — | `string` |
| `date` | getter public | 60–62 | — | `string` |
| `amount` | getter public | 64–66 | — | `number` |
| `movementType` | getter public | 68–70 | — | `AssetMovementType` |
| `sequence` | getter public | 72–74 | — | `number` |
| `description` | getter public | 76–78 | — | `string \| null` |
| `isActive` | getter public | 80–82 | — | `boolean` |
| `createdAt` | getter public | 84–86 | — | `Date` |
| `updatedAt` | getter public | 88–90 | — | `Date` |
| `createdBy` | getter public | 92–94 | — | `string` |
| `createdByUsername` | getter public | 96–98 | — | `string` |
| `updatedBy` | getter public | 100–102 | — | `string \| null` |
| `updatedByUsername` | getter public | 104–106 | — | `string \| null` |

##### `Asset.create`

- **Firma:** `create(props: AssetProps): Asset` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Asset`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [asset.mapper.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-mapper-ts), [typeorm-asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-typeorm-asset-repository-ts)

##### `Asset.id`

- **Firma:** `id(): string` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.clientId`

- **Firma:** `clientId(): string` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.clientName`

- **Firma:** `clientName(): string` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.date`

- **Firma:** `date(): string` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.amount`

- **Firma:** `amount(): number` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.movementType`

- **Firma:** `movementType(): AssetMovementType` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L68) (L68–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.sequence`

- **Firma:** `sequence(): number` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L72) (L72–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.description`

- **Firma:** `description(): string \| null` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L76) (L76–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.isActive`

- **Firma:** `isActive(): boolean` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.createdAt`

- **Firma:** `createdAt(): Date` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L84) (L84–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.updatedAt`

- **Firma:** `updatedAt(): Date` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L88) (L88–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.createdBy`

- **Firma:** `createdBy(): string` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L92) (L92–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.createdByUsername`

- **Firma:** `createdByUsername(): string` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L96) (L96–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L100) (L100–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Asset.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [asset.entity.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/entities/asset.entity.ts#L104) (L104–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-assets-domain-errors-asset-not-found-error-ts"></a>

### asset-not-found.error.ts

- **Ruta:** [asset-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/errors/asset-not-found.error.ts) (`comercial-jhoel-api/src/modules/assets/domain/errors/asset-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Errores de dominio: declara `AssetNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-deactivate-asset-use-case-ts), [get-asset-by-id.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-by-id-use-case-ts), [update-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-update-asset-use-case-ts)

#### Clase `AssetNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-assets-domain-errors-invalid-movement-error-ts"></a>

### invalid-movement.error.ts

- **Ruta:** [invalid-movement.error.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/errors/invalid-movement.error.ts) (`comercial-jhoel-api/src/modules/assets/domain/errors/invalid-movement.error.ts`, 19 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Defensive only — `RegisterMovementRequestDto` already validates `movementType`/`amount` before this ever reaches SQL; these translate `register_asset_movement`'s own guard rails should that validation ever be bypassed.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-typeorm-asset-repository-ts)

#### Clase `InvalidMovementTypeError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Defensive only — `RegisterMovementRequestDto` already validates `movementType`/`amount` before this ever reaches SQL; these translate `register_asset_movement`'s own guard rails should that validation ever be bypassed.

#### Clase `InvalidMovementAmountError` (L12–18)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-assets-domain-errors-referenced-client-invalid-error-ts"></a>

### referenced-client-invalid.error.ts

- **Ruta:** [referenced-client-invalid.error.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/errors/referenced-client-invalid.error.ts) (`comercial-jhoel-api/src/modules/assets/domain/errors/referenced-client-invalid.error.ts`, 18 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Errores de dominio: declara `ReferencedClientNotFoundError`, `ReferencedClientInactiveError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-create-asset-use-case-ts), [get-asset-current-balance.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-current-balance-use-case-ts), [get-asset-statement.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-statement-use-case-ts), [register-asset-charge.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-charge-use-case-ts), [register-asset-payment.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-payment-use-case-ts), [update-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-update-asset-use-case-ts)

#### Clase `ReferencedClientNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ReferencedClientInactiveError` (L11–17)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts"></a>

### asset.repository.ts

- **Ruta:** [asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/domain/repositories/asset.repository.ts) (`comercial-jhoel-api/src/modules/assets/domain/repositories/asset.repository.ts`, 123 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `FindAssetsOptions`, `PaginatedResult`, `FindAssetsReportSummaryOptions`, `AssetsReportSummary`, `CreateAssetData` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [asset.entity.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-entities-asset-entity-ts), [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts)
- **Consumidores:** [asset-statement-output.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-dtos-asset-statement-output-ts), [create-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-create-asset-use-case-ts), [deactivate-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-deactivate-asset-use-case-ts), [get-asset-active-balance.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-active-balance-use-case-ts), [get-asset-by-id.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-by-id-use-case-ts), [get-asset-current-balance.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-current-balance-use-case-ts), [get-asset-statement.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-statement-use-case-ts), [list-assets.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-list-assets-use-case-ts), [register-asset-charge.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-charge-use-case-ts), [register-asset-payment.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-payment-use-case-ts), [update-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-update-asset-use-case-ts), [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts), [typeorm-asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-typeorm-asset-repository-ts), [list-assets.query.dto.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-dtos-list-assets-query-dto-ts), [get-cuadre-agentes-summary.use-case.spec.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-get-cuadre-agentes-summary-use-case-spec-ts) y 2 más

**Interfaces, tipos y enums:**

- `interface FindAssetsOptions` (L9): sin documentación — miembros: `isActive`, `clientId`, `dateFrom`, `dateTo`, `minAmount`, `maxAmount`, `search`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface PaginatedResult` (L24): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface FindAssetsReportSummaryOptions` (L31): sin documentación — miembros: `isActive`, `clientId`, `dateFrom`, `dateTo`, `search`
- `interface AssetsReportSummary` (L39): sin documentación — miembros: `recordCount`, `totalAmount`
- `interface CreateAssetData` (L44): sin documentación — miembros: `clientId`, `date`, `amount`, `description`, `createdBy`
- `interface UpdateAssetData` (L52): sin documentación — miembros: `clientId`, `date`, `amount`, `description`, `updatedBy`
- `interface RegisterAssetMovementData` (L61): One Kardex movement, backing the "Registrar Cargo"/"Registrar Abono" flow — invokes `register_asset_movement`. — miembros: `clientId`, `movementType`, `amount`, `date`, `description`, `createdBy`, `referenceType`, `referenceId`
- `interface StatementMovement` (L73): sin documentación — miembros: `id`, `date`, `movementType`, `description`, `amount`, `balanceAfter`, `createdByUsername`, `createdAt`
- `interface GetAssetStatementOptions` (L85): sin documentación — miembros: `dateFrom`, `dateTo`
- `interface AssetStatement` (L91): sin documentación — miembros: `clientId`, `clientName`, `openingBalance`, `movements`, `totalCargos`, `totalAbonos`, `closingBalance`
- `interface AssetRepository` (L102): sin documentación — miembros: `findAll`, `getReportSummary`, `findById`, `create`, `update`, `deactivate`, `registerMovement`, `getCurrentBalance`, `getStatement`
- `type AssetSortField` (L6) = `'date' \| 'amount' \| 'createdAt'`
- `type SortDirection` (L7) = `'asc' \| 'desc'`

**Constantes exportadas:**

- `ASSET_REPOSITORY` (L4) = `Symbol('ASSET_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-mapper-ts"></a>

### asset.mapper.ts

- **Ruta:** [asset.mapper.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/asset.mapper.ts) (`comercial-jhoel-api/src/modules/assets/infrastructure/persistence/asset.mapper.ts`, 25 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Mapper: declara `AssetMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [asset.entity.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-entities-asset-entity-ts), [asset.orm-entity.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-orm-entity-ts)
- **Consumidores:** [typeorm-asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-typeorm-asset-repository-ts)

#### Clase `AssetMapper` (L4–24)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–23 | `orm: AssetOrmEntity` | `Asset` |

##### `AssetMapper.toDomain`

- **Firma:** `toDomain(orm: AssetOrmEntity): Asset` — [asset.mapper.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/asset.mapper.ts#L5) (L5–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Asset.create`, `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-typeorm-asset-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-orm-entity-ts"></a>

### asset.orm-entity.ts

- **Ruta:** [asset.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/asset.orm-entity.ts) (`comercial-jhoel-api/src/modules/assets/infrastructure/persistence/asset.orm-entity.ts`, 76 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `AssetOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [client.orm-entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-orm-entity-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts), [asset.mapper.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-mapper-ts), [typeorm-asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-typeorm-asset-repository-ts)

#### Clase `AssetOrmEntity` (L14–75)

- **Decoradores:** `@Entity('assets')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column clientId: string`, `@ManyToOne client: ClientOrmEntity`, `@Column date: string`, `@Column amount: number`, `@Column description: string \| null`, `@Column isActive: boolean`, `@Column movementType: 'CARGO' \| 'ABONO'`, `@Column sequence: string`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-typeorm-asset-repository-ts"></a>

### typeorm-asset.repository.ts

- **Ruta:** [typeorm-asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts) (`comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts`, 376 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmAssetRepository`, `SORT_COLUMN` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-manager.port.ts](shared.md#f-comercial-jhoel-api-src-shared-application-ports-transaction-manager-port-ts), [asset.entity.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-entities-asset-entity-ts), [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [invalid-movement.error.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-errors-invalid-movement-error-ts), [asset.orm-entity.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-orm-entity-ts), [asset.mapper.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts)

#### Clase `TypeOrmAssetRepository` (L33–375)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements AssetRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(AssetOrmEntity) repository: Repository<AssetOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 40–95 | `options: FindAssetsOptions` | `Promise<PaginatedResult<Asset>>` |
| `getReportSummary` | método public async | 98–148 | `options: FindAssetsReportSummaryOptions` | `Promise<AssetsReportSummary>` |
| `findById` | método public async | 150–158 | `id: string`, `context?: TransactionContext` | `Promise<Asset \| null>` |
| `getManager` | método private | 160–162 | `context?: TransactionContext` | `EntityManager` |
| `create` | método public async | 164–176 | `data: CreateAssetData` | `Promise<Asset>` |
| `update` | método public async | 178–186 | `id: string`, `data: UpdateAssetData` | `Promise<Asset>` |
| `translateAmountCheckError` | método private | 199–208 | `error: unknown` | `unknown` |
| `deactivate` | método public async | 210–212 | `id: string` | `Promise<void>` |
| `registerMovement` | método public async | 215–245 | `data: RegisterAssetMovementData`, `context?: TransactionContext` | `Promise<Asset>` |
| `getCurrentBalance` | método public async | 248–256 | `clientId: string` | `Promise<number>` |
| `getStatement` | método public async | 266–353 | `clientId: string`, `options: GetAssetStatementOptions` | `Promise<AssetStatement>` |
| `translateMovementError` | método private | 356–374 | `error: unknown` | `unknown` |

##### `TypeOrmAssetRepository.findAll`

- **Firma:** `findAll(options: FindAssetsOptions): Promise<PaginatedResult<Asset>>` — [typeorm-asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts#L40) (L40–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('record').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `orms.map`, `AssetMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAssetRepository.getReportSummary`

- **Firma:** `getReportSummary(options: FindAssetsReportSummaryOptions): Promise<AssetsReportSummary>` — [typeorm-asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts#L98) (L98–148)
- **Propósito / descripción:** A real SQL aggregate — never an in-memory sum over one fetched page, which would silently undercount whatever didn't fit the page (see Reports' own `getSummary()` lesson for Sales/Purchases).
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('record').leftJoin`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.select('COUNT(*)', 'recordCount').addSelect`, `qb.select`, `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAssetRepository.findById`

- **Firma:** `findById(id: string, context?: TransactionContext): Promise<Asset \| null>` — [typeorm-asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts#L150) (L150–158)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getManager(context).findOne`, `this.getManager`, `AssetMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmAssetRepository.getManager`

- **Firma:** `getManager(context?: TransactionContext): EntityManager` — [typeorm-asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts#L160) (L160–162)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmAssetRepository.create`

- **Firma:** `create(data: CreateAssetData): Promise<Asset>` — [typeorm-asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts#L164) (L164–176)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.translateAmountCheckError`, `this.repository.findOneOrFail`, `AssetMapper.toDomain`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateAmountCheckError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAssetRepository.update`

- **Firma:** `update(id: string, data: UpdateAssetData): Promise<Asset>` — [typeorm-asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts#L178) (L178–186)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateAmountCheckError`, `this.repository.findOneOrFail`, `AssetMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateAmountCheckError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAssetRepository.translateAmountCheckError`

- **Firma:** `translateAmountCheckError(error: unknown): unknown` — [typeorm-asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts#L199) (L199–208)
- **Propósito / descripción:** `create()`/`update()` are this table's original, still-untouched admin CRUD (see the migration's own doc comment for why they were deliberately left alone) — but a plain negative `amount` through them now violates `CHK_assets_amount_positive` (re-added by `CreateFinancialKardexColumns`, since `amount` is a positive magnitude again with the sign living in `movementType`). This translates that constraint violation into a clear message pointing at the real replacement — "Registrar Abono" — rather than letting a raw `QueryFailedError` reach the client.
- **Dependencias (llamadas en su cuerpo):** `new InvalidMovementAmountError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmAssetRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts#L210) (L210–212)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAssetRepository.registerMovement`

- **Firma:** `registerMovement(data: RegisterAssetMovementData, context?: TransactionContext): Promise<Asset>` — [typeorm-asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts#L215) (L215–245)
- **Propósito / descripción:** Invokes `register_asset_movement` — see that function's own doc comment (migration `CreateFinancialKardexColumns`) for why Activos allows a negative balance and why this is the atomic, concurrency-safe replacement for the old plain `create()` INSERT.
- **Dependencias (llamadas en su cuerpo):** `this.getManager(context).query`, `this.getManager`, `this.translateMovementError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `register_asset_movement`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateMovementError(error)`, `new InternalServerErrorException( 'No se pudo recuperar el movimiento recién registrado.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAssetRepository.getCurrentBalance`

- **Firma:** `getCurrentBalance(clientId: string): Promise<number>` — [typeorm-asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts#L248) (L248–256)
- **Propósito / descripción:** A single bounded aggregate — never a full-history fetch summed in TypeScript.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `Number`
- **Efectos secundarios:** Tablas en su SQL: `assets`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAssetRepository.getStatement`

- **Firma:** `getStatement(clientId: string, options: GetAssetStatementOptions): Promise<AssetStatement>` — [typeorm-asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts#L266) (L266–353)
- **Propósito / descripción:** `openingBalance` is the signed sum of every active movement strictly before `dateFrom` (0 when `dateFrom` is omitted — the WHERE clause then matches no rows). `balanceAfter` per row is computed with a window function over `sequence` seeded with that opening balance — never stored, always derived fresh (see the migration's own doc comment for why), and never summed client-side.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `Number`, `rows.map`, `movements.filter((m) => m.movementType === 'CARGO').reduce`, `movements.filter`, `movements.filter((m) => m.movementType === 'ABONO').reduce`
- **Efectos secundarios:** Tablas en su SQL: `clients`, `assets`, `users`, `movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAssetRepository.translateMovementError`

- **Firma:** `translateMovementError(error: unknown): unknown` — [typeorm-asset.repository.ts](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts#L356) (L356–374)
- **Propósito / descripción:** `register_asset_movement` signals a business-rule failure via `RAISE EXCEPTION '&lt;CODE&gt;:&lt;clientId&gt;'` — same `'CODE:id'` convention as `translateSaleError`/`translatePurchaseError` elsewhere in this codebase.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new InvalidMovementTypeError`, `new InvalidMovementAmountError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts"></a>

### assets.controller.ts

- **Ruta:** [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts) (`comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts`, 160 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Create/update/deactivate are admin-only — same policy as Products/Clients.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-create-asset-use-case-ts), [list-assets.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-list-assets-use-case-ts), [get-asset-by-id.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-by-id-use-case-ts), [update-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-update-asset-use-case-ts), [deactivate-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-deactivate-asset-use-case-ts), [register-asset-charge.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-charge-use-case-ts), [register-asset-payment.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-payment-use-case-ts), [get-asset-statement.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-statement-use-case-ts), [get-asset-current-balance.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-current-balance-use-case-ts), [get-asset-active-balance.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-active-balance-use-case-ts), [create-asset.request.dto.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-dtos-create-asset-request-dto-ts) y 6 más
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts)

#### Clase `AssetsController` (L45–159)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('assets')`
- **Propósito:** Create/update/deactivate are admin-only — same policy as Products/Clients. Any authenticated role can list/consult.
- **Dependencias inyectadas (constructor):** `createAssetUseCase: CreateAssetUseCase`, `listAssetsUseCase: ListAssetsUseCase`, `getAssetByIdUseCase: GetAssetByIdUseCase`, `updateAssetUseCase: UpdateAssetUseCase`, `deactivateAssetUseCase: DeactivateAssetUseCase`, `registerAssetChargeUseCase: RegisterAssetChargeUseCase`, `registerAssetPaymentUseCase: RegisterAssetPaymentUseCase`, `getAssetStatementUseCase: GetAssetStatementUseCase`, `getAssetCurrentBalanceUseCase: GetAssetCurrentBalanceUseCase`, `getAssetActiveBalanceUseCase: GetAssetActiveBalanceUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 61–70 | `dto: CreateAssetRequestDto`, `userId: string` | `Promise<AssetResponseDto>` |
| `findAll` | método public | 72–77 | `query: ListAssetsQueryDto` | `Promise<PaginatedAssetsResponseDto>` |
| `getActiveBalanceSummary` | método public | 80–83 | — | `Promise<ActiveBalanceSummaryResponseDto>` |
| `findOne` | método public | 85–88 | `id: string` | `Promise<AssetResponseDto>` |
| `update` | método public | 90–99 | `id: string`, `dto: UpdateAssetRequestDto`, `userId: string` | `Promise<AssetResponseDto>` |
| `deactivate` | método public | 101–107 | `id: string` | `Promise<void>` |
| `registerCharge` | método public | 110–124 | `clientId: string`, `dto: RegisterMovementRequestDto`, `userId: string` | `Promise<AssetResponseDto>` |
| `registerPayment` | método public | 127–141 | `clientId: string`, `dto: RegisterMovementRequestDto`, `userId: string` | `Promise<AssetResponseDto>` |
| `getStatement` | método public | 144–150 | `clientId: string`, `query: GetStatementQueryDto` | `Promise<AssetStatementResponseDto>` |
| `getCurrentBalance` | método public | 153–158 | `clientId: string` | `Promise<CurrentBalanceResponseDto>` |

##### `AssetsController.create`

- **Firma:** `create(dto: CreateAssetRequestDto, userId: string): Promise<AssetResponseDto>` — [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L61) (L61–70)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createAssetUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetsController.findAll`

- **Firma:** `findAll(query: ListAssetsQueryDto): Promise<PaginatedAssetsResponseDto>` — [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L72) (L72–77)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listAssetsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetsController.getActiveBalanceSummary`

- **Firma:** `getActiveBalanceSummary(): Promise<ActiveBalanceSummaryResponseDto>` — [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L80) (L80–83)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Saldo total de cuentas activas — declared before `:id` so "summary" is never swallowed as a UUID param. Open to any authenticated role, same as `findAll`.
- **Dependencias (llamadas en su cuerpo):** `this.getAssetActiveBalanceUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetsController.findOne`

- **Firma:** `findOne(id: string): Promise<AssetResponseDto>` — [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L85) (L85–88)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getAssetByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetsController.update`

- **Firma:** `update(id: string, dto: UpdateAssetRequestDto, userId: string): Promise<AssetResponseDto>` — [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L90) (L90–99)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateAssetUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetsController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L101) (L101–107)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateAssetUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetsController.registerCharge`

- **Firma:** `registerCharge(clientId: string, dto: RegisterMovementRequestDto, userId: string): Promise<AssetResponseDto>` — [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L110) (L110–124)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post(':clientId/charges')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** "Registrar Cargo" — admin-only, same policy as `create()`.
- **Origen de parámetros:** `@Param('clientId', ParseUUIDPipe) clientId`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerAssetChargeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetsController.registerPayment`

- **Firma:** `registerPayment(clientId: string, dto: RegisterMovementRequestDto, userId: string): Promise<AssetResponseDto>` — [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L127) (L127–141)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post(':clientId/payments')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** "Registrar Abono" — admin-only, same policy as `create()`. Unlike Cuentas por Cobrar, an amount exceeding the current balance is allowed (Activos' own long-standing capability — see the migration's own doc comment).
- **Origen de parámetros:** `@Param('clientId', ParseUUIDPipe) clientId`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerAssetPaymentUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetsController.getStatement`

- **Firma:** `getStatement(clientId: string, query: GetStatementQueryDto): Promise<AssetStatementResponseDto>` — [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L144) (L144–150)
- **Decoradores:** `@Get(':clientId/statement')`
- **Propósito / descripción:** Estado de cuenta — open to any authenticated role, same as `findAll`/`findOne`.
- **Origen de parámetros:** `@Param('clientId', ParseUUIDPipe) clientId`, `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getAssetStatementUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetsController.getCurrentBalance`

- **Firma:** `getCurrentBalance(clientId: string): Promise<CurrentBalanceResponseDto>` — [assets.controller.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts#L153) (L153–158)
- **Decoradores:** `@Get(':clientId/balance')`
- **Propósito / descripción:** Saldo actual — backs the client selector, open to any authenticated role.
- **Origen de parámetros:** `@Param('clientId', ParseUUIDPipe) clientId`
- **Dependencias (llamadas en su cuerpo):** `this.getAssetCurrentBalanceUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-assets-presentation-dtos-asset-response-dto-ts"></a>

### asset.response.dto.ts

- **Ruta:** [asset.response.dto.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/dtos/asset.response.dto.ts) (`comercial-jhoel-api/src/modules/assets/presentation/dtos/asset.response.dto.ts`, 24 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** DTO de respuesta: declara `AssetResponseDto`, `PaginatedAssetsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

#### Clase `AssetResponseDto` (L1–16)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedAssetsResponseDto` (L18–23)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-assets-presentation-dtos-create-asset-request-dto-ts"></a>

### create-asset.request.dto.ts

- **Ruta:** [create-asset.request.dto.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/dtos/create-asset.request.dto.ts) (`comercial-jhoel-api/src/modules/assets/presentation/dtos/create-asset.request.dto.ts`, 41 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** DTO de entrada: declara `CreateAssetRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

#### Clase `CreateAssetRequestDto` (L12–40)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-assets-presentation-dtos-get-statement-query-dto-ts"></a>

### get-statement.query.dto.ts

- **Ruta:** [get-statement.query.dto.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/dtos/get-statement.query.dto.ts) (`comercial-jhoel-api/src/modules/assets/presentation/dtos/get-statement.query.dto.ts`, 12 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** DTO de consulta: declara `GetStatementQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

#### Clase `GetStatementQueryDto` (L3–11)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-assets-presentation-dtos-list-assets-query-dto-ts"></a>

### list-assets.query.dto.ts

- **Ruta:** [list-assets.query.dto.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/dtos/list-assets.query.dto.ts) (`comercial-jhoel-api/src/modules/assets/presentation/dtos/list-assets.query.dto.ts`, 80 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** DTO de consulta: declara `ListAssetsQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

#### Clase `ListAssetsQueryDto` (L22–79)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-assets-presentation-dtos-register-movement-request-dto-ts"></a>

### register-movement.request.dto.ts

- **Ruta:** [register-movement.request.dto.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/dtos/register-movement.request.dto.ts) (`comercial-jhoel-api/src/modules/assets/presentation/dtos/register-movement.request.dto.ts`, 29 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** Backs both "Registrar Cargo" and "Registrar Abono" — `clientId` comes from the route param, never the body.
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

#### Clase `RegisterMovementRequestDto` (L12–28)

- **Propósito:** Backs both "Registrar Cargo" and "Registrar Abono" — `clientId` comes from the route param, never the body.
<a id="f-comercial-jhoel-api-src-modules-assets-presentation-dtos-statement-response-dto-ts"></a>

### statement.response.dto.ts

- **Ruta:** [statement.response.dto.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/dtos/statement.response.dto.ts) (`comercial-jhoel-api/src/modules/assets/presentation/dtos/statement.response.dto.ts`, 30 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** DTO de respuesta: declara `StatementMovementResponseDto`, `AssetStatementResponseDto`, `CurrentBalanceResponseDto`, `ActiveBalanceSummaryResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

#### Clase `StatementMovementResponseDto` (L1–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `AssetStatementResponseDto` (L12–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CurrentBalanceResponseDto` (L22–24)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ActiveBalanceSummaryResponseDto` (L26–29)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-assets-presentation-dtos-update-asset-request-dto-ts"></a>

### update-asset.request.dto.ts

- **Ruta:** [update-asset.request.dto.ts](../../../../comercial-jhoel-api/src/modules/assets/presentation/dtos/update-asset.request.dto.ts) (`comercial-jhoel-api/src/modules/assets/presentation/dtos/update-asset.request.dto.ts`, 35 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `assets`
- **Responsabilidad:** DTO de entrada: declara `UpdateAssetRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [assets.controller.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-presentation-controllers-assets-controller-ts)

#### Clase `UpdateAssetRequestDto` (L12–34)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
