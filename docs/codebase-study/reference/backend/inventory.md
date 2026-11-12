# Módulo backend `inventory`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/inventory/locations` | [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L54) `InventoryController.findLocations` | [ListInventoryLocationsUseCase](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-inventory-locations-use-case-ts) | `InventoryLocationRepository`.findAll | UseGuards(JwtAuthGuard) | `InventoryLocationsService.getLocations` |
| `GET /api/inventory/products/:productId/presentations` | [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L59) `InventoryController.findPresentations` | [ListProductPresentationsUseCase](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-product-presentations-use-case-ts) | `ProductPresentationRepository`.findByProductId<br>`ProductRepository`.findById | UseGuards(JwtAuthGuard) | `InventoryLocationsService.getPresentations` |
| `POST /api/inventory/products/:productId/presentations` | [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L64) `InventoryController.createPresentation` | [CreatePresentationUseCase](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-ts) | `ProductPresentationRepository`.create<br>`ProductRepository`.findById<br>`PresentationTypeRepository`.findById | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `InventoryLocationsService.createPresentation` |
| `PATCH /api/inventory/presentations/:id` | [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L74) `InventoryController.updatePresentation` | [UpdatePresentationUseCase](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-ts) | `ProductPresentationRepository`.findById/update<br>`PresentationTypeRepository`.findById | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `InventoryLocationsService.updatePresentation` |
| `GET /api/inventory/products/:productId` | [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L87) `InventoryController.getProductInventory` | [GetProductInventoryUseCase](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-get-product-inventory-use-case-ts) | `ProductRepository`.findById<br>`ProductPresentationRepository`.findByProductId<br>`InventoryStockRepository`.findByProductId<br>`InventoryMovementRepository`.findByProductId | UseGuards(JwtAuthGuard) | `InventoryLocationsService.getProductInventory` |
| `PATCH /api/inventory/products/:productId/locations/:locationId/min-stock` | [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L93) `InventoryController.setMinStock` | [SetMinStockUseCase](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-ts) | `InventoryStockRepository`.setMinStock | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `InventoryLocationsService.setMinStock` |
| `POST /api/inventory/transfers` | [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L108) `InventoryController.registerTransfer` | [RegisterInventoryTransferUseCase](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-use-case-ts) | `InventoryTransferRepository`.registerTransfer | UseGuards(JwtAuthGuard) | `InventoryLocationsService.registerTransfer` |
| `POST /api/inventory/transfers/batch` | [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L125) `InventoryController.registerTransferBatch` | [RegisterInventoryTransferBatchUseCase](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-batch-use-case-ts) | `InventoryTransferRepository`.registerTransferBatch | UseGuards(JwtAuthGuard) | `InventoryLocationsService.registerTransferBatch` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [inventory-output.ts](#f-comercial-jhoel-api-src-modules-inventory-application-dtos-inventory-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toInventoryLocationOutput`, `toProductPresentationOutput`, `toStockByLocationOutput`, `toInventoryMovementOutput`, `InventoryLocationOutput` (sin comentario de documentación en el código). | 4 internas | 6 | Media (6 consumidores) |
| [create-presentation.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `buildProduct`, `buildPresentationType`, `buildPresentation` (sin comentario de documentación en el código). | 9 internas | 0 | Soporte (pruebas) |
| [create-presentation.use-case.ts](#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-ts) | .ts | Caso de uso | Aplicación | Admin-only (enforced at the controller via `@Roles`). | 6 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [get-product-inventory.use-case.ts](#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-get-product-inventory-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the product detail screen — General/Presentaciones/Inventario/Movimientos recientes, all in one call. | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-inventory-locations.use-case.ts](#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-inventory-locations-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListInventoryLocationsUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-product-presentations.use-case.ts](#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-product-presentations-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListProductPresentationsUseCase` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-inventory-transfer-batch.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-batch-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria (sin comentario de documentación en el código). | 3 internas | 0 | Soporte (pruebas) |
| [register-inventory-transfer-batch.use-case.ts](#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-batch-use-case-ts) | .ts | Caso de uso | Aplicación | The "Transferencia rápida" flow — several products, one origin/destination pair, saved as a single all-or-nothing operation. | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [register-inventory-transfer.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria (sin comentario de documentación en el código). | 3 internas | 0 | Soporte (pruebas) |
| [register-inventory-transfer.use-case.ts](#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-use-case-ts) | .ts | Caso de uso | Aplicación | Pre-validates the same rules the SQL function enforces (fast, clean error for the common case) — the stored function's own `FOR UPDATE` locks on both locations are the real guarantee against a race, same "TypeScript pre-check + SQL is the real guard" split every other critical operation in this codebase already uses. | 2 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [set-min-stock.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makeStock` (sin comentario de documentación en el código). | 4 internas | 0 | Soporte (pruebas) |
| [set-min-stock.use-case.ts](#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-ts) | .ts | Caso de uso | Aplicación | "Stock mínimo" per (producto, ubicación) — the threshold the Alerts module reads to decide "inventario bajo". | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [update-presentation.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `buildPresentationType`, `buildPresentation` (sin comentario de documentación en el código). | 7 internas | 0 | Soporte (pruebas) |
| [update-presentation.use-case.ts](#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-ts) | .ts | Caso de uso | Aplicación | Admin-only. "Unidad" can have its prices updated (purchases already do this automatically) but never its presentation type, factor, or active state — every purchase/sale that omits a presentation depends on it always existing with factor 1. | 5 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [inventory-location.entity.ts](#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-location-entity-ts) | .ts | Entidad de dominio | Dominio | Bodega/Vitrina today — a normalized, extensible list (mirrors `RechargeType`'s own lookup-table pattern) so a future location is a seeded row, never a code change. | 0 internas | 4 | Media (4 consumidores) |
| [inventory-movement.entity.ts](#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-movement-entity-ts) | .ts | Entidad de dominio | Dominio | Audit trail row for a CONFIRMED inventory-affecting operation (compra, venta confirmada, traslado) — never written for in-flight cart adjustments, so it always reflects real, final business events. | 0 internas | 4 | Media (4 consumidores) |
| [inventory-stock.entity.ts](#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-stock-entity-ts) | .ts | Entidad de dominio | Dominio | One row per (product, location), always in BASE UNITS — the granular source of truth. | 0 internas | 6 | Media (6 consumidores) |
| [product-presentation.entity.ts](#f-comercial-jhoel-api-src-modules-inventory-domain-entities-product-presentation-entity-ts) | .ts | Entidad de dominio | Dominio | A product's sellable/purchasable unit ("Unidad", "Caja", "Paquete", ...). | 0 internas | 9 | Media (9 consumidores) |
| [invalid-presentation-data.error.ts](#f-comercial-jhoel-api-src-modules-inventory-domain-errors-invalid-presentation-data-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidPresentationDataError` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [location-not-found.error.ts](#f-comercial-jhoel-api-src-modules-inventory-domain-errors-location-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `LocationNotFoundError`, `LocationInactiveError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [presentation.errors.ts](#f-comercial-jhoel-api-src-modules-inventory-domain-errors-presentation-errors-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PresentationNotFoundError`, `PresentationInactiveError`, `UnidadPresentationImmutableError`, `PresentationNameAlreadyExistsError`, `PresentationBarcodeAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [transfer.errors.ts](#f-comercial-jhoel-api-src-modules-inventory-domain-errors-transfer-errors-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidTransferQuantityError`, `SameLocationTransferError`, `InsufficientLocationStockError`, `InventoryProductInactiveError`, `EmptyTransferBatchError` (sin comentario de documentación en el código). | 1 internas | 5 | Media (5 consumidores) |
| [inventory-location.repository.ts](#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-location-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `InventoryLocationRepository`, `INVENTORY_LOCATION_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 5 | Media (5 consumidores) |
| [inventory-movement.repository.ts](#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-movement-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `InventoryMovementRepository`, `INVENTORY_MOVEMENT_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [inventory-stock.repository.ts](#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `InitialStockEntry`, `LowStockRow`, `InventoryStockRepository`, `INVENTORY_STOCK_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 12 | Alta (12 consumidores) |
| [inventory-transfer.repository.ts](#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-transfer-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RegisterTransferData`, `InventoryTransferRepository`, `INVENTORY_TRANSFER_REPOSITORY` (sin comentario de documentación en el código). | 0 internas | 6 | Media (6 consumidores) |
| [product-presentation.repository.ts](#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreatePresentationData`, `UpdatePresentationData`, `ProductPresentationRepository`, `PRODUCT_PRESENTATION_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 12 | Alta (12 consumidores) |
| [inventory-location.orm-entity.ts](#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-location-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `InventoryLocationOrmEntity` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 5 | Media (5 consumidores) |
| [inventory-movement.orm-entity.ts](#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-movement-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `InventoryMovementOrmEntity` (sin comentario de documentación en el código). | 3 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [inventory-stock.orm-entity.ts](#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-stock-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `InventoryStockOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [inventory.mappers.ts](#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts) | .ts | Código TypeScript | Infraestructura | Código TypeScript: declara `locationToDomain`, `presentationToDomain`, `stockToDomain`, `movementToDomain` (sin comentario de documentación en el código). | 8 internas | 4 | Media (4 consumidores) |
| [product-presentation.orm-entity.ts](#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-product-presentation-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `ProductPresentationOrmEntity` (sin comentario de documentación en el código). | 2 internas; ext.: typeorm | 6 | Media (6 consumidores) |
| [typeorm-inventory-location.repository.ts](#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-location-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmInventoryLocationRepository` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-inventory-movement.repository.ts](#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-movement-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmInventoryMovementRepository` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-inventory-stock.repository.ts](#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-stock-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmInventoryStockRepository` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-inventory-transfer.repository.ts](#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-transfer-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmInventoryTransferRepository` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-product-presentation.repository.ts](#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-product-presentation-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmProductPresentationRepository` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [inventory.module.ts](#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `InventoryModule` (sin comentario de documentación en el código). | 25 internas; ext.: @nestjs/common, @nestjs/typeorm | 4 | Media (4 consumidores) |
| [inventory.controller.ts](#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts) | .ts | Controlador | Presentación | Locations/presentations/stock/movements/transfers — everything the "producto → presentaciones → ubicaciones → stock" evolution needed that didn't already live in `modules/products/`. | 17 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [create-presentation.request.dto.ts](#f-comercial-jhoel-api-src-modules-inventory-presentation-dtos-create-presentation-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreatePresentationRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [register-transfer-batch.request.dto.ts](#f-comercial-jhoel-api-src-modules-inventory-presentation-dtos-register-transfer-batch-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `RegisterTransferBatchItemDto`, `RegisterTransferBatchRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [register-transfer.request.dto.ts](#f-comercial-jhoel-api-src-modules-inventory-presentation-dtos-register-transfer-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `RegisterTransferRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [set-min-stock.request.dto.ts](#f-comercial-jhoel-api-src-modules-inventory-presentation-dtos-set-min-stock-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `SetMinStockRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [update-presentation.request.dto.ts](#f-comercial-jhoel-api-src-modules-inventory-presentation-dtos-update-presentation-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdatePresentationRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-inventory-application-dtos-inventory-output-ts"></a>

### inventory-output.ts

- **Ruta:** [inventory-output.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/dtos/inventory-output.ts) (`comercial-jhoel-api/src/modules/inventory/application/dtos/inventory-output.ts`, 110 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** DTO de salida (aplicación): declara `toInventoryLocationOutput`, `toProductPresentationOutput`, `toStockByLocationOutput`, `toInventoryMovementOutput`, `InventoryLocationOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [inventory-location.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-location-entity-ts), [product-presentation.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-product-presentation-entity-ts), [inventory-stock.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-stock-entity-ts), [inventory-movement.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-movement-entity-ts)
- **Consumidores:** [create-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-ts), [get-product-inventory.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-get-product-inventory-use-case-ts), [list-inventory-locations.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-inventory-locations-use-case-ts), [list-product-presentations.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-product-presentations-use-case-ts), [set-min-stock.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-ts), [update-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-ts)

**Interfaces, tipos y enums:**

- `interface InventoryLocationOutput` (L6): sin documentación — miembros: `id`, `name`, `isActive`
- `interface ProductPresentationOutput` (L18): sin documentación — miembros: `id`, `productId`, `presentationTypeId`, `name`, `conversionFactor`, `costPrice`, `publicPrice`, `barcode`, `isActive`
- `interface StockByLocationOutput` (L46): sin documentación — miembros: `locationId`, `locationName`, `quantity`, `minStock`
- `interface InventoryMovementOutput` (L64): sin documentación — miembros: `id`, `presentationName`, `locationFromName`, `locationToName`, `movementType`, `quantityPresentation`, `conversionFactor`, `quantityBaseUnits`, `referenceType`, `referenceId`, `username`, `reason`, `createdAt`
- `interface ProductInventoryDetailOutput` (L100): sin documentación — miembros: `productId`, `productName`, `sku`, `categoryName`, `totalStock`, `stockByLocation`, `presentations`, `recentMovements`
#### Función `toInventoryLocationOutput` (L12–16)

- **Tipo:** función exportada
- **Firma:** `toInventoryLocationOutput(location: InventoryLocation): InventoryLocationOutput` — [inventory-output.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/dtos/inventory-output.ts#L12)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `toProductPresentationOutput` (L30–44)

- **Tipo:** función exportada
- **Firma:** `toProductPresentationOutput(presentation: ProductPresentation): ProductPresentationOutput` — [inventory-output.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/dtos/inventory-output.ts#L30)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-ts), [update-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-ts)

#### Función `toStockByLocationOutput` (L53–62)

- **Tipo:** función exportada
- **Firma:** `toStockByLocationOutput(stock: InventoryStock): StockByLocationOutput` — [inventory-output.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/dtos/inventory-output.ts#L53)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [set-min-stock.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-ts)

#### Función `toInventoryMovementOutput` (L80–98)

- **Tipo:** función exportada
- **Firma:** `toInventoryMovementOutput(movement: InventoryMovement): InventoryMovementOutput` — [inventory-output.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/dtos/inventory-output.ts#L80)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts"></a>

### create-presentation.use-case.spec.ts

- **Ruta:** [create-presentation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/create-presentation.use-case.spec.ts) (`comercial-jhoel-api/src/modules/inventory/application/use-cases/create-presentation.use-case.spec.ts`, 173 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Prueba unitaria: declara `buildProduct`, `buildPresentationType`, `buildPresentation` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [create-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-ts), [product-not-found.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-not-found-error-ts), [invalid-presentation-data.error.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-invalid-presentation-data-error-ts), [product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts), [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [product.entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-entities-product-entity-ts), [product-presentation.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-product-presentation-entity-ts), [presentation-type.entity.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-entities-presentation-type-entity-ts)
- **Consumidores:** —
#### Función `buildProduct` (L11–31)

- **Tipo:** función local del archivo
- **Firma:** `buildProduct(): Product` — [create-presentation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/create-presentation.use-case.spec.ts#L11)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Product.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildPresentationType` (L33–49)

- **Tipo:** función local del archivo
- **Firma:** `buildPresentationType(overrides?: Partial<{ isActive: boolean }>): PresentationType` — [create-presentation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/create-presentation.use-case.spec.ts#L33)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `PresentationType.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildPresentation` (L51–67)

- **Tipo:** función local del archivo
- **Firma:** `buildPresentation(overrides?: Partial<{ name: string; conversionFactor: number }>): ProductPresentation` — [create-presentation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/create-presentation.use-case.spec.ts#L51)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `ProductPresentation.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-ts"></a>

### create-presentation.use-case.ts

- **Ruta:** [create-presentation.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/create-presentation.use-case.ts) (`comercial-jhoel-api/src/modules/inventory/application/use-cases/create-presentation.use-case.ts`, 85 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Admin-only (enforced at the controller via `@Roles`).
- **Depende de (archivos del proyecto):** [product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts), [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [product-not-found.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-not-found-error-ts), [invalid-presentation-data.error.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-invalid-presentation-data-error-ts), [inventory-output.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-dtos-inventory-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [create-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts), [import-products-from-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CreatePresentationInput` (L15): sin documentación — miembros: `productId`, `presentationTypeId`, `conversionFactor`, `costPrice`, `publicPrice`, `barcode`

#### Clase `CreatePresentationUseCase` (L31–84)

- **Decoradores:** `@Injectable()`
- **Propósito:** Admin-only (enforced at the controller via `@Roles`). "Unidad" (factor 1) is never created here — it's auto-created once per product by `CreateProductUseCase`; this use case is for additional presentations (Caja, Paquete, ...), always picked from the master `presentation_types` catalog — never free text (see that module's own doc comment for why).
- **Dependencias inyectadas (constructor):** `@Inject(PRODUCT_PRESENTATION_REPOSITORY) presentationRepository: ProductPresentationRepository`, `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`, `@Inject(PRESENTATION_TYPE_REPOSITORY) presentationTypeRepository: PresentationTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 42–83 | `input: CreatePresentationInput` | `Promise<ProductPresentationOutput>` |

##### `CreatePresentationUseCase.execute`

- **Firma:** `execute(input: CreatePresentationInput): Promise<ProductPresentationOutput>` — [create-presentation.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/create-presentation.use-case.ts#L42) (L42–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productRepository.findById`, `new ProductNotFoundError`, `this.presentationTypeRepository.findById`, `new InvalidPresentationDataError`, `Number.isInteger`, `this.presentationRepository.create`, `toProductPresentationOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ProductNotFoundError(input.productId)`, `new InvalidPresentationDataError( 'El tipo de presentación seleccionado no existe o está inactivo.', )`, `new InvalidPresentationDataError( 'El factor de conversión debe ser un número entero mayor que cero.', )`, `new InvalidPresentationDataError( 'Los precios no pueden ser negativos.', )`
- **Consumidores:** [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts), [import-products-from-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-inventory-application-use-cases-get-product-inventory-use-case-ts"></a>

### get-product-inventory.use-case.ts

- **Ruta:** [get-product-inventory.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/get-product-inventory.use-case.ts) (`comercial-jhoel-api/src/modules/inventory/application/use-cases/get-product-inventory.use-case.ts`, 63 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Backs the product detail screen — General/Presentaciones/Inventario/Movimientos recientes, all in one call.
- **Depende de (archivos del proyecto):** [product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts), [inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts), [inventory-movement.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-movement-repository-ts), [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [product-not-found.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-not-found-error-ts), [inventory-output.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-dtos-inventory-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

#### Clase `GetProductInventoryUseCase` (L21–62)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the product detail screen — General/Presentaciones/Inventario/Movimientos recientes, all in one call.
- **Dependencias inyectadas (constructor):** `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`, `@Inject(PRODUCT_PRESENTATION_REPOSITORY) presentationRepository: ProductPresentationRepository`, `@Inject(INVENTORY_STOCK_REPOSITORY) stockRepository: InventoryStockRepository`, `@Inject(INVENTORY_MOVEMENT_REPOSITORY) movementRepository: InventoryMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 34–61 | `productId: string` | `Promise<ProductInventoryDetailOutput>` |

##### `GetProductInventoryUseCase.execute`

- **Firma:** `execute(productId: string): Promise<ProductInventoryDetailOutput>` — [get-product-inventory.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/get-product-inventory.use-case.ts#L34) (L34–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productRepository.findById`, `new ProductNotFoundError`, `Promise.all`, `this.presentationRepository.findByProductId`, `this.stockRepository.findByProductId`, `this.movementRepository.findByProductId`, `stockByLocation.map`, `presentations.map`, `recentMovements.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ProductNotFoundError(productId)`
- **Consumidores:** [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-inventory-locations-use-case-ts"></a>

### list-inventory-locations.use-case.ts

- **Ruta:** [list-inventory-locations.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/list-inventory-locations.use-case.ts) (`comercial-jhoel-api/src/modules/inventory/application/use-cases/list-inventory-locations.use-case.ts`, 23 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Caso de uso: declara `ListInventoryLocationsUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [inventory-location.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-location-repository-ts), [inventory-output.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-dtos-inventory-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

#### Clase `ListInventoryLocationsUseCase` (L9–22)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(INVENTORY_LOCATION_REPOSITORY) locationRepository: InventoryLocationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 16–21 | — | `Promise<InventoryLocationOutput[]>` |

##### `ListInventoryLocationsUseCase.execute`

- **Firma:** `execute(): Promise<InventoryLocationOutput[]>` — [list-inventory-locations.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/list-inventory-locations.use-case.ts#L16) (L16–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.locationRepository.findAll`, `locations.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-product-presentations-use-case-ts"></a>

### list-product-presentations.use-case.ts

- **Ruta:** [list-product-presentations.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/list-product-presentations.use-case.ts) (`comercial-jhoel-api/src/modules/inventory/application/use-cases/list-product-presentations.use-case.ts`, 31 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Caso de uso: declara `ListProductPresentationsUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts), [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [product-not-found.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-not-found-error-ts), [inventory-output.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-dtos-inventory-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

#### Clase `ListProductPresentationsUseCase` (L12–30)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PRODUCT_PRESENTATION_REPOSITORY) presentationRepository: ProductPresentationRepository`, `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 21–29 | `productId: string` | `Promise<ProductPresentationOutput[]>` |

##### `ListProductPresentationsUseCase.execute`

- **Firma:** `execute(productId: string): Promise<ProductPresentationOutput[]>` — [list-product-presentations.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/list-product-presentations.use-case.ts#L21) (L21–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productRepository.findById`, `new ProductNotFoundError`, `this.presentationRepository.findByProductId`, `presentations.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ProductNotFoundError(productId)`
- **Consumidores:** [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-batch-use-case-spec-ts"></a>

### register-inventory-transfer-batch.use-case.spec.ts

- **Ruta:** [register-inventory-transfer-batch.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/register-inventory-transfer-batch.use-case.spec.ts) (`comercial-jhoel-api/src/modules/inventory/application/use-cases/register-inventory-transfer-batch.use-case.spec.ts`, 86 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [register-inventory-transfer-batch.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-batch-use-case-ts), [transfer.errors.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-transfer-errors-ts), [inventory-transfer.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-transfer-repository-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-batch-use-case-ts"></a>

### register-inventory-transfer-batch.use-case.ts

- **Ruta:** [register-inventory-transfer-batch.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/register-inventory-transfer-batch.use-case.ts) (`comercial-jhoel-api/src/modules/inventory/application/use-cases/register-inventory-transfer-batch.use-case.ts`, 74 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** The "Transferencia rápida" flow — several products, one origin/destination pair, saved as a single all-or-nothing operation.
- **Depende de (archivos del proyecto):** [inventory-transfer.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-transfer-repository-ts), [transfer.errors.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-transfer-errors-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [register-inventory-transfer-batch.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-batch-use-case-spec-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

**Interfaces, tipos y enums:**

- `interface RegisterInventoryTransferBatchItemInput` (L10): sin documentación — miembros: `productId`, `presentationId`, `quantity`
- `interface RegisterInventoryTransferBatchInput` (L16): sin documentación — miembros: `fromLocationId`, `toLocationId`, `reason`, `items`, `userId`
- `interface RegisterInventoryTransferBatchOutput` (L24): sin documentación — miembros: `referenceIds`

#### Clase `RegisterInventoryTransferBatchUseCase` (L37–73)

- **Decoradores:** `@Injectable()`
- **Propósito:** The "Transferencia rápida" flow — several products, one origin/destination pair, saved as a single all-or-nothing operation. Never a second stock- movement system: every line still goes through the exact same `register_inventory_transfer` stored function `RegisterInventoryTransferUseCase` already uses, just batched inside one outer transaction (see `InventoryTransferRepository.registerTransferBatch`) so a failure on any line rolls back every line already applied in this call.
- **Dependencias inyectadas (constructor):** `@Inject(INVENTORY_TRANSFER_REPOSITORY) transferRepository: InventoryTransferRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 44–72 | `input: RegisterInventoryTransferBatchInput` | `Promise<RegisterInventoryTransferBatchOutput>` |

##### `RegisterInventoryTransferBatchUseCase.execute`

- **Firma:** `execute(input: RegisterInventoryTransferBatchInput): Promise<RegisterInventoryTransferBatchOutput>` — [register-inventory-transfer-batch.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/register-inventory-transfer-batch.use-case.ts#L44) (L44–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new EmptyTransferBatchError`, `new SameLocationTransferError`, `Number.isInteger`, `new InvalidTransferQuantityError`, `this.transferRepository.registerTransferBatch`, `input.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new EmptyTransferBatchError()`, `new SameLocationTransferError()`, `new InvalidTransferQuantityError()`
- **Consumidores:** [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-use-case-spec-ts"></a>

### register-inventory-transfer.use-case.spec.ts

- **Ruta:** [register-inventory-transfer.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/register-inventory-transfer.use-case.spec.ts) (`comercial-jhoel-api/src/modules/inventory/application/use-cases/register-inventory-transfer.use-case.spec.ts`, 65 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [register-inventory-transfer.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-use-case-ts), [transfer.errors.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-transfer-errors-ts), [inventory-transfer.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-transfer-repository-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-use-case-ts"></a>

### register-inventory-transfer.use-case.ts

- **Ruta:** [register-inventory-transfer.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/register-inventory-transfer.use-case.ts) (`comercial-jhoel-api/src/modules/inventory/application/use-cases/register-inventory-transfer.use-case.ts`, 60 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Pre-validates the same rules the SQL function enforces (fast, clean error for the common case) — the stored function's own `FOR UPDATE` locks on both locations are the real guarantee against a race, same "TypeScript pre-check + SQL is the real guard" split every other critical operation in this codebase already uses.
- **Depende de (archivos del proyecto):** [inventory-transfer.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-transfer-repository-ts), [transfer.errors.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-transfer-errors-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [register-inventory-transfer.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-use-case-spec-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts), [import-purchase-from-excel.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts)

**Interfaces, tipos y enums:**

- `interface RegisterInventoryTransferInput` (L9): sin documentación — miembros: `productId`, `presentationId`, `fromLocationId`, `toLocationId`, `quantity`, `userId`, `reason`
- `interface RegisterInventoryTransferOutput` (L19): sin documentación — miembros: `referenceId`

#### Clase `RegisterInventoryTransferUseCase` (L30–59)

- **Decoradores:** `@Injectable()`
- **Propósito:** Pre-validates the same rules the SQL function enforces (fast, clean error for the common case) — the stored function's own `FOR UPDATE` locks on both locations are the real guarantee against a race, same "TypeScript pre-check + SQL is the real guard" split every other critical operation in this codebase already uses.
- **Dependencias inyectadas (constructor):** `@Inject(INVENTORY_TRANSFER_REPOSITORY) transferRepository: InventoryTransferRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 37–58 | `input: RegisterInventoryTransferInput` | `Promise<RegisterInventoryTransferOutput>` |

##### `RegisterInventoryTransferUseCase.execute`

- **Firma:** `execute(input: RegisterInventoryTransferInput): Promise<RegisterInventoryTransferOutput>` — [register-inventory-transfer.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/register-inventory-transfer.use-case.ts#L37) (L37–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Number.isInteger`, `new InvalidTransferQuantityError`, `new SameLocationTransferError`, `this.transferRepository.registerTransfer`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidTransferQuantityError()`, `new SameLocationTransferError()`
- **Consumidores:** [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts), [import-purchase-from-excel.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-spec-ts"></a>

### set-min-stock.use-case.spec.ts

- **Ruta:** [set-min-stock.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/set-min-stock.use-case.spec.ts) (`comercial-jhoel-api/src/modules/inventory/application/use-cases/set-min-stock.use-case.spec.ts`, 79 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Prueba unitaria: declara `makeStock` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [set-min-stock.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-ts), [inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts), [invalid-presentation-data.error.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-invalid-presentation-data-error-ts), [inventory-stock.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-stock-entity-ts)
- **Consumidores:** —
#### Función `makeStock` (L6–15)

- **Tipo:** función local del archivo
- **Firma:** `makeStock(minStock: number): InventoryStock` — [set-min-stock.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/set-min-stock.use-case.spec.ts#L6)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `InventoryStock.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-ts"></a>

### set-min-stock.use-case.ts

- **Ruta:** [set-min-stock.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/set-min-stock.use-case.ts) (`comercial-jhoel-api/src/modules/inventory/application/use-cases/set-min-stock.use-case.ts`, 47 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** "Stock mínimo" per (producto, ubicación) — the threshold the Alerts module reads to decide "inventario bajo".
- **Depende de (archivos del proyecto):** [inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts), [invalid-presentation-data.error.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-invalid-presentation-data-error-ts), [inventory-output.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-dtos-inventory-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [set-min-stock.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-spec-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

**Interfaces, tipos y enums:**

- `interface SetMinStockInput` (L10): sin documentación — miembros: `productId`, `locationId`, `minStock`

#### Clase `SetMinStockUseCase` (L25–46)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Stock mínimo" per (producto, ubicación) — the threshold the Alerts module reads to decide "inventario bajo". Admin-only (mirrors this module's own presentation-write split: reading is open to any authenticated account, configuring a threshold is an admin action). Reuses `InvalidPresentationDataError` rather than a new error class — it's already a generic "bad numeric input" domain error with the right 400 status, and this module has no other spot needing the same shape.
- **Dependencias inyectadas (constructor):** `@Inject(INVENTORY_STOCK_REPOSITORY) stockRepository: InventoryStockRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 32–45 | `input: SetMinStockInput` | `Promise<StockByLocationOutput>` |

##### `SetMinStockUseCase.execute`

- **Firma:** `execute(input: SetMinStockInput): Promise<StockByLocationOutput>` — [set-min-stock.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/set-min-stock.use-case.ts#L32) (L32–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Number.isInteger`, `new InvalidPresentationDataError`, `this.stockRepository.setMinStock`, `toStockByLocationOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidPresentationDataError( 'El stock mínimo debe ser un número entero mayor o igual a cero.', )`
- **Consumidores:** [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-spec-ts"></a>

### update-presentation.use-case.spec.ts

- **Ruta:** [update-presentation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/update-presentation.use-case.spec.ts) (`comercial-jhoel-api/src/modules/inventory/application/use-cases/update-presentation.use-case.spec.ts`, 174 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Prueba unitaria: declara `buildPresentationType`, `buildPresentation` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [update-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-ts), [presentation.errors.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-presentation-errors-ts), [invalid-presentation-data.error.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-invalid-presentation-data-error-ts), [product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts), [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [product-presentation.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-product-presentation-entity-ts), [presentation-type.entity.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-entities-presentation-type-entity-ts)
- **Consumidores:** —
#### Función `buildPresentationType` (L12–28)

- **Tipo:** función local del archivo
- **Firma:** `buildPresentationType(overrides?: Partial<{ isActive: boolean }>): PresentationType` — [update-presentation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/update-presentation.use-case.spec.ts#L12)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `PresentationType.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildPresentation` (L30–46)

- **Tipo:** función local del archivo
- **Firma:** `buildPresentation(overrides?: Partial<{ name: string; conversionFactor: number }>): ProductPresentation` — [update-presentation.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/update-presentation.use-case.spec.ts#L30)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `ProductPresentation.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-ts"></a>

### update-presentation.use-case.ts

- **Ruta:** [update-presentation.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/update-presentation.use-case.ts) (`comercial-jhoel-api/src/modules/inventory/application/use-cases/update-presentation.use-case.ts`, 99 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Admin-only. "Unidad" can have its prices updated (purchases already do this automatically) but never its presentation type, factor, or active state — every purchase/sale that omits a presentation depends on it always existing with factor 1.
- **Depende de (archivos del proyecto):** [product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts), [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [presentation.errors.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-presentation-errors-ts), [invalid-presentation-data.error.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-invalid-presentation-data-error-ts), [inventory-output.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-dtos-inventory-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [update-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-spec-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdatePresentationInput` (L16): sin documentación — miembros: `presentationId`, `presentationTypeId`, `conversionFactor`, `costPrice`, `publicPrice`, `barcode`, `isActive`

#### Clase `UpdatePresentationUseCase` (L27–98)

- **Decoradores:** `@Injectable()`
- **Propósito:** Admin-only. "Unidad" can have its prices updated (purchases already do this automatically) but never its presentation type, factor, or active state — every purchase/sale that omits a presentation depends on it always existing with factor 1. Presentations already used in a movement/purchase/sale are never deleted, only deactivated — same soft-delete convention as every other module in this app.
- **Dependencias inyectadas (constructor):** `@Inject(PRODUCT_PRESENTATION_REPOSITORY) presentationRepository: ProductPresentationRepository`, `@Inject(PRESENTATION_TYPE_REPOSITORY) presentationTypeRepository: PresentationTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 36–97 | `input: UpdatePresentationInput` | `Promise<ProductPresentationOutput>` |

##### `UpdatePresentationUseCase.execute`

- **Firma:** `execute(input: UpdatePresentationInput): Promise<ProductPresentationOutput>` — [update-presentation.use-case.ts](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/update-presentation.use-case.ts#L36) (L36–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.presentationRepository.findById`, `new PresentationNotFoundError`, `new UnidadPresentationImmutableError`, `this.presentationTypeRepository.findById`, `new InvalidPresentationDataError`, `Number.isInteger`, `this.presentationRepository.update`, `toProductPresentationOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.presentationRepository.update`
- **Errores que lanza:** `new PresentationNotFoundError(input.presentationId)`, `new UnidadPresentationImmutableError()`, `new InvalidPresentationDataError( 'El tipo de presentación seleccionado no existe o está inactivo.', )`, `new InvalidPresentationDataError( 'El factor de conversión debe ser un número entero mayor que cero.', )`, `new InvalidPresentationDataError( 'Los precios no pueden ser negativos.', )`
- **Consumidores:** [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-location-entity-ts"></a>

### inventory-location.entity.ts

- **Ruta:** [inventory-location.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-location.entity.ts) (`comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-location.entity.ts`, 37 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Bodega/Vitrina today — a normalized, extensible list (mirrors `RechargeType`'s own lookup-table pattern) so a future location is a seeded row, never a code change.
- **Consumidores:** [inventory-output.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-dtos-inventory-output-ts), [inventory-location.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-location-repository-ts), [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts), [typeorm-inventory-location.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-location-repository-ts)

**Interfaces, tipos y enums:**

- `interface InventoryLocationProps` (L1): sin documentación — miembros: `id`, `name`, `isActive`, `createdAt`, `updatedAt`

#### Clase `InventoryLocation` (L10–36)

- **Propósito:** Bodega/Vitrina today — a normalized, extensible list (mirrors `RechargeType`'s own lookup-table pattern) so a future location is a seeded row, never a code change.
- **Dependencias inyectadas (constructor):** `props: InventoryLocationProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 13–15 | `props: InventoryLocationProps` | `InventoryLocation` |
| `id` | getter public | 17–19 | — | `string` |
| `name` | getter public | 21–23 | — | `string` |
| `isActive` | getter public | 25–27 | — | `boolean` |
| `createdAt` | getter public | 29–31 | — | `Date` |
| `updatedAt` | getter public | 33–35 | — | `Date` |

##### `InventoryLocation.create`

- **Firma:** `create(props: InventoryLocationProps): InventoryLocation` — [inventory-location.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-location.entity.ts#L13) (L13–15)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InventoryLocation`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts)

##### `InventoryLocation.id`

- **Firma:** `id(): string` — [inventory-location.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-location.entity.ts#L17) (L17–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryLocation.name`

- **Firma:** `name(): string` — [inventory-location.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-location.entity.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryLocation.isActive`

- **Firma:** `isActive(): boolean` — [inventory-location.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-location.entity.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryLocation.createdAt`

- **Firma:** `createdAt(): Date` — [inventory-location.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-location.entity.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryLocation.updatedAt`

- **Firma:** `updatedAt(): Date` — [inventory-location.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-location.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-movement-entity-ts"></a>

### inventory-movement.entity.ts

- **Ruta:** [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts) (`comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts`, 89 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Audit trail row for a CONFIRMED inventory-affecting operation (compra, venta confirmada, traslado) — never written for in-flight cart adjustments, so it always reflects real, final business events.
- **Consumidores:** [inventory-output.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-dtos-inventory-output-ts), [inventory-movement.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-movement-repository-ts), [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts), [typeorm-inventory-movement.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-movement-repository-ts)

**Interfaces, tipos y enums:**

- `interface InventoryMovementProps` (L4): sin documentación — miembros: `id`, `productId`, `presentationId`, `presentationName`, `locationFromId`, `locationFromName`, `locationToId`, `locationToName`, `movementType`, `quantityPresentation`, `conversionFactor`, `quantityBaseUnits`, `referenceType`, `referenceId`, `userId`, `username`, `reason`, `createdAt`
- `type InventoryMovementType` (L1) = `'ENTRADA_COMPRA' \| 'SALIDA_VENTA' \| 'TRASLADO_SALIDA' \| 'TRASLADO_ENTRADA'`

#### Clase `InventoryMovement` (L26–88)

- **Propósito:** Audit trail row for a CONFIRMED inventory-affecting operation (compra, venta confirmada, traslado) — never written for in-flight cart adjustments, so it always reflects real, final business events.
- **Dependencias inyectadas (constructor):** `props: InventoryMovementProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 29–31 | `props: InventoryMovementProps` | `InventoryMovement` |
| `id` | getter public | 33–35 | — | `string` |
| `productId` | getter public | 37–39 | — | `string` |
| `presentationName` | getter public | 41–43 | — | `string` |
| `locationFromName` | getter public | 45–47 | — | `string \| null` |
| `locationToName` | getter public | 49–51 | — | `string \| null` |
| `movementType` | getter public | 53–55 | — | `InventoryMovementType` |
| `quantityPresentation` | getter public | 57–59 | — | `number` |
| `conversionFactor` | getter public | 61–63 | — | `number` |
| `quantityBaseUnits` | getter public | 65–67 | — | `number` |
| `referenceType` | getter public | 69–71 | — | `string \| null` |
| `referenceId` | getter public | 73–75 | — | `string \| null` |
| `username` | getter public | 77–79 | — | `string` |
| `reason` | getter public | 81–83 | — | `string \| null` |
| `createdAt` | getter public | 85–87 | — | `Date` |

##### `InventoryMovement.create`

- **Firma:** `create(props: InventoryMovementProps): InventoryMovement` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InventoryMovement`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts)

##### `InventoryMovement.id`

- **Firma:** `id(): string` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryMovement.productId`

- **Firma:** `productId(): string` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryMovement.presentationName`

- **Firma:** `presentationName(): string` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryMovement.locationFromName`

- **Firma:** `locationFromName(): string \| null` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryMovement.locationToName`

- **Firma:** `locationToName(): string \| null` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryMovement.movementType`

- **Firma:** `movementType(): InventoryMovementType` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryMovement.quantityPresentation`

- **Firma:** `quantityPresentation(): number` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryMovement.conversionFactor`

- **Firma:** `conversionFactor(): number` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryMovement.quantityBaseUnits`

- **Firma:** `quantityBaseUnits(): number` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L65) (L65–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryMovement.referenceType`

- **Firma:** `referenceType(): string \| null` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryMovement.referenceId`

- **Firma:** `referenceId(): string \| null` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryMovement.username`

- **Firma:** `username(): string` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryMovement.reason`

- **Firma:** `reason(): string \| null` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryMovement.createdAt`

- **Firma:** `createdAt(): Date` — [inventory-movement.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-movement.entity.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-stock-entity-ts"></a>

### inventory-stock.entity.ts

- **Ruta:** [inventory-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-stock.entity.ts) (`comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-stock.entity.ts`, 43 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** One row per (product, location), always in BASE UNITS — the granular source of truth.
- **Consumidores:** [inventory-output.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-dtos-inventory-output-ts), [set-min-stock.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-spec-ts), [inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts), [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts), [typeorm-inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-stock-repository-ts), [product-output.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-dtos-product-output-ts)

**Interfaces, tipos y enums:**

- `interface InventoryStockProps` (L1): sin documentación — miembros: `productId`, `locationId`, `locationName`, `quantity`, `minStock`, `updatedAt`

#### Clase `InventoryStock` (L12–42)

- **Propósito:** One row per (product, location), always in BASE UNITS — the granular source of truth. `products.stock` is kept in lockstep as the running total across every row for that product.
- **Dependencias inyectadas (constructor):** `props: InventoryStockProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 15–17 | `props: InventoryStockProps` | `InventoryStock` |
| `productId` | getter public | 19–21 | — | `string` |
| `locationId` | getter public | 23–25 | — | `string` |
| `locationName` | getter public | 27–29 | — | `string` |
| `quantity` | getter public | 31–33 | — | `number` |
| `minStock` | getter public | 35–37 | — | `number` |
| `updatedAt` | getter public | 39–41 | — | `Date` |

##### `InventoryStock.create`

- **Firma:** `create(props: InventoryStockProps): InventoryStock` — [inventory-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-stock.entity.ts#L15) (L15–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InventoryStock`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [set-min-stock.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-spec-ts), [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts)

##### `InventoryStock.productId`

- **Firma:** `productId(): string` — [inventory-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-stock.entity.ts#L19) (L19–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryStock.locationId`

- **Firma:** `locationId(): string` — [inventory-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-stock.entity.ts#L23) (L23–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryStock.locationName`

- **Firma:** `locationName(): string` — [inventory-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-stock.entity.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryStock.quantity`

- **Firma:** `quantity(): number` — [inventory-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-stock.entity.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryStock.minStock`

- **Firma:** `minStock(): number` — [inventory-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-stock.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryStock.updatedAt`

- **Firma:** `updatedAt(): Date` — [inventory-stock.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/inventory-stock.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-inventory-domain-entities-product-presentation-entity-ts"></a>

### product-presentation.entity.ts

- **Ruta:** [product-presentation.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts) (`comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts`, 82 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** A product's sellable/purchasable unit ("Unidad", "Caja", "Paquete", ...).
- **Consumidores:** [inventory-output.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-dtos-inventory-output-ts), [create-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts), [update-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-spec-ts), [product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts), [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts), [typeorm-product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-product-presentation-repository-ts), [product-output.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-dtos-product-output-ts), [list-products.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-list-products-use-case-ts), [import-purchase-from-excel.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts)

**Interfaces, tipos y enums:**

- `interface ProductPresentationProps` (L1): sin documentación — miembros: `id`, `productId`, `presentationTypeId`, `name`, `conversionFactor`, `costPrice`, `publicPrice`, `barcode`, `isActive`, `createdAt`, `updatedAt`

#### Clase `ProductPresentation` (L31–81)

- **Propósito:** A product's sellable/purchasable unit ("Unidad", "Caja", "Paquete", ...). `conversionFactor` is how many base units this presentation represents — configured per product, never assumed (a "Caja" of one product is not necessarily 12 units of another). Every product always has exactly one "Unidad" presentation with `conversionFactor = 1`, auto-created — the default every existing Compras/Ventas call resolves to when no presentation is specified. `presentationTypeId` points at the master catalog (`presentation_types`, module `presentation-types`) — the *name* ("Caja") is administered there, once, and reused by every product; this entity never lets a caller type a name directly, only pick a catalog id.
- **Dependencias inyectadas (constructor):** `props: ProductPresentationProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 34–36 | `props: ProductPresentationProps` | `ProductPresentation` |
| `id` | getter public | 38–40 | — | `string` |
| `productId` | getter public | 42–44 | — | `string` |
| `presentationTypeId` | getter public | 46–48 | — | `string` |
| `name` | getter public | 50–52 | — | `string` |
| `conversionFactor` | getter public | 54–56 | — | `number` |
| `costPrice` | getter public | 58–60 | — | `number` |
| `publicPrice` | getter public | 62–64 | — | `number` |
| `barcode` | getter public | 66–68 | — | `string \| null` |
| `isActive` | getter public | 70–72 | — | `boolean` |
| `createdAt` | getter public | 74–76 | — | `Date` |
| `updatedAt` | getter public | 78–80 | — | `Date` |

##### `ProductPresentation.create`

- **Firma:** `create(props: ProductPresentationProps): ProductPresentation` — [product-presentation.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new ProductPresentation`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts), [update-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-spec-ts), [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts), [typeorm-product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-product-presentation-repository-ts)

##### `ProductPresentation.id`

- **Firma:** `id(): string` — [product-presentation.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductPresentation.productId`

- **Firma:** `productId(): string` — [product-presentation.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductPresentation.presentationTypeId`

- **Firma:** `presentationTypeId(): string` — [product-presentation.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductPresentation.name`

- **Firma:** `name(): string` — [product-presentation.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductPresentation.conversionFactor`

- **Firma:** `conversionFactor(): number` — [product-presentation.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductPresentation.costPrice`

- **Firma:** `costPrice(): number` — [product-presentation.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductPresentation.publicPrice`

- **Firma:** `publicPrice(): number` — [product-presentation.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts#L62) (L62–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductPresentation.barcode`

- **Firma:** `barcode(): string \| null` — [product-presentation.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts#L66) (L66–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductPresentation.isActive`

- **Firma:** `isActive(): boolean` — [product-presentation.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts#L70) (L70–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductPresentation.createdAt`

- **Firma:** `createdAt(): Date` — [product-presentation.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductPresentation.updatedAt`

- **Firma:** `updatedAt(): Date` — [product-presentation.entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/entities/product-presentation.entity.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-inventory-domain-errors-invalid-presentation-data-error-ts"></a>

### invalid-presentation-data.error.ts

- **Ruta:** [invalid-presentation-data.error.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/errors/invalid-presentation-data.error.ts) (`comercial-jhoel-api/src/modules/inventory/domain/errors/invalid-presentation-data.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Errores de dominio: declara `InvalidPresentationDataError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts), [create-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-ts), [set-min-stock.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-spec-ts), [set-min-stock.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-ts), [update-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-spec-ts), [update-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-ts)

#### Clase `InvalidPresentationDataError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `message: string`
<a id="f-comercial-jhoel-api-src-modules-inventory-domain-errors-location-not-found-error-ts"></a>

### location-not-found.error.ts

- **Ruta:** [location-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/errors/location-not-found.error.ts) (`comercial-jhoel-api/src/modules/inventory/domain/errors/location-not-found.error.ts`, 18 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Errores de dominio: declara `LocationNotFoundError`, `LocationInactiveError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-inventory-transfer.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-transfer-repository-ts)

#### Clase `LocationNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`

#### Clase `LocationInactiveError` (L11–17)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-inventory-domain-errors-presentation-errors-ts"></a>

### presentation.errors.ts

- **Ruta:** [presentation.errors.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/errors/presentation.errors.ts) (`comercial-jhoel-api/src/modules/inventory/domain/errors/presentation.errors.ts`, 50 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Errores de dominio: declara `PresentationNotFoundError`, `PresentationInactiveError`, `UnidadPresentationImmutableError`, `PresentationNameAlreadyExistsError`, `PresentationBarcodeAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [update-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-spec-ts), [update-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-ts), [typeorm-inventory-transfer.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-transfer-repository-ts), [typeorm-product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-product-presentation-repository-ts)

#### Clase `PresentationNotFoundError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`

#### Clase `PresentationInactiveError` (L13–21)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`

#### Clase `UnidadPresentationImmutableError` (L24–32)

- **Herencia / contratos:** extends DomainError
- **Propósito:** The "Unidad" presentation (factor 1) is created automatically per product and can never be deactivated — every purchase/sale/report that omits a presentation depends on it always existing.

#### Clase `PresentationNameAlreadyExistsError` (L34–40)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PresentationBarcodeAlreadyExistsError` (L43–49)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Mirrors `ProductSkuAlreadyExistsError` — barcodes are unique across every active presentation, not just within one product.
<a id="f-comercial-jhoel-api-src-modules-inventory-domain-errors-transfer-errors-ts"></a>

### transfer.errors.ts

- **Ruta:** [transfer.errors.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/errors/transfer.errors.ts) (`comercial-jhoel-api/src/modules/inventory/domain/errors/transfer.errors.ts`, 47 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Errores de dominio: declara `InvalidTransferQuantityError`, `SameLocationTransferError`, `InsufficientLocationStockError`, `InventoryProductInactiveError`, `EmptyTransferBatchError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [register-inventory-transfer-batch.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-batch-use-case-spec-ts), [register-inventory-transfer-batch.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-batch-use-case-ts), [register-inventory-transfer.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-use-case-spec-ts), [register-inventory-transfer.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-use-case-ts), [typeorm-inventory-transfer.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-transfer-repository-ts)

#### Clase `InvalidTransferQuantityError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `SameLocationTransferError` (L11–19)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `InsufficientLocationStockError` (L22–30)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Enforced in `register_inventory_transfer()` under `FOR UPDATE` locks on both locations — never trusts the frontend's own stock check.
- **Dependencias inyectadas (constructor):** `productId: string`

#### Clase `InventoryProductInactiveError` (L32–38)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`

#### Clase `EmptyTransferBatchError` (L40–46)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-location-repository-ts"></a>

### inventory-location.repository.ts

- **Ruta:** [inventory-location.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/repositories/inventory-location.repository.ts) (`comercial-jhoel-api/src/modules/inventory/domain/repositories/inventory-location.repository.ts`, 11 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `InventoryLocationRepository`, `INVENTORY_LOCATION_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [inventory-location.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-location-entity-ts)
- **Consumidores:** [list-inventory-locations.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-inventory-locations-use-case-ts), [typeorm-inventory-location.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-location-repository-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [import-purchase-from-excel.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts)

**Interfaces, tipos y enums:**

- `interface InventoryLocationRepository` (L7): sin documentación — miembros: `findAll`, `findById`

**Constantes exportadas:**

- `INVENTORY_LOCATION_REPOSITORY` (L3) = `Symbol( 'INVENTORY_LOCATION_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-movement-repository-ts"></a>

### inventory-movement.repository.ts

- **Ruta:** [inventory-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/repositories/inventory-movement.repository.ts) (`comercial-jhoel-api/src/modules/inventory/domain/repositories/inventory-movement.repository.ts`, 14 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `InventoryMovementRepository`, `INVENTORY_MOVEMENT_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [inventory-movement.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-movement-entity-ts)
- **Consumidores:** [get-product-inventory.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-get-product-inventory-use-case-ts), [typeorm-inventory-movement.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-movement-repository-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts)

**Interfaces, tipos y enums:**

- `interface InventoryMovementRepository` (L7): sin documentación — miembros: `findByProductId`

**Constantes exportadas:**

- `INVENTORY_MOVEMENT_REPOSITORY` (L3) = `Symbol( 'INVENTORY_MOVEMENT_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts"></a>

### inventory-stock.repository.ts

- **Ruta:** [inventory-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/repositories/inventory-stock.repository.ts) (`comercial-jhoel-api/src/modules/inventory/domain/repositories/inventory-stock.repository.ts`, 37 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `InitialStockEntry`, `LowStockRow`, `InventoryStockRepository`, `INVENTORY_STOCK_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [inventory-stock.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-stock-entity-ts)
- **Consumidores:** [get-alerts.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [build-alerts.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-spec-ts), [build-alerts.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-utils-build-alerts-ts), [get-product-inventory.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-get-product-inventory-use-case-ts), [set-min-stock.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-spec-ts), [set-min-stock.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-ts), [typeorm-inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-stock-repository-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [get-product-by-id.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-product-by-id-use-case-ts), [list-products.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-list-products-use-case-ts)

**Interfaces, tipos y enums:**

- `interface InitialStockEntry` (L5): sin documentación — miembros: `locationId`, `quantity`
- `interface LowStockRow` (L10): sin documentación — miembros: `productId`, `productName`, `locationId`, `locationName`, `quantity`, `minStock`
- `interface InventoryStockRepository` (L19): sin documentación — miembros: `findByProductId`, `findByProductIds`, `createInitial`, `setMinStock`, `findLowStock`

**Constantes exportadas:**

- `INVENTORY_STOCK_REPOSITORY` (L3) = `Symbol('INVENTORY_STOCK_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-transfer-repository-ts"></a>

### inventory-transfer.repository.ts

- **Ruta:** [inventory-transfer.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/repositories/inventory-transfer.repository.ts) (`comercial-jhoel-api/src/modules/inventory/domain/repositories/inventory-transfer.repository.ts`, 28 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RegisterTransferData`, `InventoryTransferRepository`, `INVENTORY_TRANSFER_REPOSITORY` (sin comentario de documentación en el código).
- **Consumidores:** [register-inventory-transfer-batch.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-batch-use-case-spec-ts), [register-inventory-transfer-batch.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-batch-use-case-ts), [register-inventory-transfer.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-use-case-spec-ts), [register-inventory-transfer.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-use-case-ts), [typeorm-inventory-transfer.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-transfer-repository-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterTransferData` (L5): sin documentación — miembros: `productId`, `presentationId`, `fromLocationId`, `toLocationId`, `quantityPresentation`, `userId`, `reason`
- `interface InventoryTransferRepository` (L15): sin documentación — miembros: `registerTransfer`, `registerTransferBatch`

**Constantes exportadas:**

- `INVENTORY_TRANSFER_REPOSITORY` (L1) = `Symbol( 'INVENTORY_TRANSFER_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts"></a>

### product-presentation.repository.ts

- **Ruta:** [product-presentation.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/domain/repositories/product-presentation.repository.ts) (`comercial-jhoel-api/src/modules/inventory/domain/repositories/product-presentation.repository.ts`, 67 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreatePresentationData`, `UpdatePresentationData`, `ProductPresentationRepository`, `PRODUCT_PRESENTATION_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product-presentation.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-product-presentation-entity-ts)
- **Consumidores:** [create-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts), [create-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-ts), [get-product-inventory.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-get-product-inventory-use-case-ts), [list-product-presentations.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-product-presentations-use-case-ts), [update-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-spec-ts), [update-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-ts), [typeorm-product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-product-presentation-repository-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [deactivate-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-deactivate-product-use-case-ts), [list-products.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-list-products-use-case-ts), [import-purchase-from-excel.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-import-purchase-from-excel-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CreatePresentationData` (L7): sin documentación — miembros: `productId`, `presentationTypeId`, `conversionFactor`, `costPrice`, `publicPrice`, `barcode`
- `interface UpdatePresentationData` (L16): sin documentación — miembros: `presentationTypeId`, `conversionFactor`, `costPrice`, `publicPrice`, `barcode`, `isActive`
- `interface ProductPresentationRepository` (L25): sin documentación — miembros: `findByProductId`, `findById`, `findActiveByBarcode`, `create`, `update`, `findMatchingByBarcode`, `deactivateAllForProduct`

**Constantes exportadas:**

- `PRODUCT_PRESENTATION_REPOSITORY` (L3) = `Symbol( 'PRODUCT_PRESENTATION_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-location-orm-entity-ts"></a>

### inventory-location.orm-entity.ts

- **Ruta:** [inventory-location.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/inventory-location.orm-entity.ts) (`comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/inventory-location.orm-entity.ts`, 28 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `InventoryLocationOrmEntity` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** [inventory-movement.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-movement-orm-entity-ts), [inventory-stock.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-stock-orm-entity-ts), [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts), [typeorm-inventory-location.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-location-repository-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts)

#### Clase `InventoryLocationOrmEntity` (L10–27)

- **Decoradores:** `@Entity('inventory_locations')` `@Unique('UQ_inventory_locations_name', ['name'])`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-movement-orm-entity-ts"></a>

### inventory-movement.orm-entity.ts

- **Ruta:** [inventory-movement.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/inventory-movement.orm-entity.ts) (`comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/inventory-movement.orm-entity.ts`, 89 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `InventoryMovementOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product-presentation.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-product-presentation-orm-entity-ts), [inventory-location.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-location-orm-entity-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts), [typeorm-inventory-movement.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-movement-repository-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts)

#### Clase `InventoryMovementOrmEntity` (L14–88)

- **Decoradores:** `@Entity('inventory_movements')` `@Index('IDX_inventory_movements_product_id', ['productId'])`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column productId: string`, `@Column presentationId: string`, `@ManyToOne presentation: ProductPresentationOrmEntity`, `@Column locationFromId: string \| null`, `@ManyToOne locationFrom: InventoryLocationOrmEntity \| null`, `@Column locationToId: string \| null`, `@ManyToOne locationTo: InventoryLocationOrmEntity \| null`, `@Column movementType: string`, `@Column quantityPresentation: number`, `@Column conversionFactor: number`, `@Column quantityBaseUnits: number`, `@Column referenceType: string \| null`, `@Column referenceId: string \| null`, `@Column userId: string`, `@ManyToOne user: UserOrmEntity`, `@Column reason: string \| null`, `@CreateDateColumn createdAt: Date`
<a id="f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-stock-orm-entity-ts"></a>

### inventory-stock.orm-entity.ts

- **Ruta:** [inventory-stock.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/inventory-stock.orm-entity.ts) (`comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/inventory-stock.orm-entity.ts`, 42 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `InventoryStockOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [inventory-location.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-location-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts), [typeorm-inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-stock-repository-ts), [typeorm-inventory-transfer.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-transfer-repository-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts)

#### Clase `InventoryStockOrmEntity` (L12–41)

- **Decoradores:** `@Entity('inventory_stock')` `@Index('UQ_inventory_stock_product_location', ['productId', 'locationId'], { unique: true, })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column productId: string`, `@Column locationId: string`, `@ManyToOne location: InventoryLocationOrmEntity`, `@Column quantity: number`, `@Column minStock: number`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts"></a>

### inventory.mappers.ts

- **Ruta:** [inventory.mappers.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/inventory.mappers.ts) (`comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/inventory.mappers.ts`, 78 líneas)
- **Tipo:** Código TypeScript · **Capa:** Infraestructura · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Código TypeScript: declara `locationToDomain`, `presentationToDomain`, `stockToDomain`, `movementToDomain` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [inventory-location.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-location-entity-ts), [product-presentation.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-product-presentation-entity-ts), [inventory-stock.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-stock-entity-ts), [inventory-movement.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-movement-entity-ts), [inventory-location.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-location-orm-entity-ts), [product-presentation.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-product-presentation-orm-entity-ts), [inventory-stock.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-stock-orm-entity-ts), [inventory-movement.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-movement-orm-entity-ts)
- **Consumidores:** [typeorm-inventory-location.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-location-repository-ts), [typeorm-inventory-movement.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-movement-repository-ts), [typeorm-inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-stock-repository-ts), [typeorm-product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-product-presentation-repository-ts)
#### Función `locationToDomain` (L13–23)

- **Tipo:** función exportada
- **Firma:** `locationToDomain(orm: InventoryLocationOrmEntity): InventoryLocation` — [inventory.mappers.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/inventory.mappers.ts#L13)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `InventoryLocation.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-inventory-location.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-location-repository-ts)

#### Función `presentationToDomain` (L25–41)

- **Tipo:** función exportada
- **Firma:** `presentationToDomain(orm: ProductPresentationOrmEntity): ProductPresentation` — [inventory.mappers.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/inventory.mappers.ts#L25)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `ProductPresentation.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-product-presentation-repository-ts)

#### Función `stockToDomain` (L43–52)

- **Tipo:** función exportada
- **Firma:** `stockToDomain(orm: InventoryStockOrmEntity): InventoryStock` — [inventory.mappers.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/inventory.mappers.ts#L43)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `InventoryStock.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-stock-repository-ts)

#### Función `movementToDomain` (L54–77)

- **Tipo:** función exportada
- **Firma:** `movementToDomain(orm: InventoryMovementOrmEntity): InventoryMovement` — [inventory.mappers.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/inventory.mappers.ts#L54)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `InventoryMovement.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-product-presentation-orm-entity-ts"></a>

### product-presentation.orm-entity.ts

- **Ruta:** [product-presentation.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/product-presentation.orm-entity.ts) (`comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/product-presentation.orm-entity.ts`, 66 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `ProductPresentationOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [presentation-type.orm-entity.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-infrastructure-persistence-presentation-type-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [inventory-movement.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-movement-orm-entity-ts), [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts), [typeorm-product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-product-presentation-repository-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [purchase-detail.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-detail-orm-entity-ts), [sale-detail.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-detail-orm-entity-ts)

#### Clase `ProductPresentationOrmEntity` (L14–65)

- **Decoradores:** `@Entity('product_presentations')` `@Index('IDX_product_presentations_product_id', ['productId'])`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column productId: string`, `@Column presentationTypeId: string`, `@ManyToOne presentationType: PresentationTypeOrmEntity`, `@Column conversionFactor: number`, `@Column costPrice: number`, `@Column publicPrice: number`, `@Column barcode: string \| null`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-location-repository-ts"></a>

### typeorm-inventory-location.repository.ts

- **Ruta:** [typeorm-inventory-location.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-location.repository.ts) (`comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-location.repository.ts`, 31 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmInventoryLocationRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [inventory-location.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-location-entity-ts), [inventory-location.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-location-repository-ts), [inventory-location.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-location-orm-entity-ts), [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts)

#### Clase `TypeOrmInventoryLocationRepository` (L9–30)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements InventoryLocationRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(InventoryLocationOrmEntity) repository: Repository<InventoryLocationOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 16–24 | `options?: { activeOnly?: boolean; }` | `Promise<InventoryLocation[]>` |
| `findById` | método public async | 26–29 | `id: string` | `Promise<InventoryLocation \| null>` |

##### `TypeOrmInventoryLocationRepository.findAll`

- **Firma:** `findAll(options?: { activeOnly?: boolean; }): Promise<InventoryLocation[]>` — [typeorm-inventory-location.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-location.repository.ts#L16) (L16–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmInventoryLocationRepository.findById`

- **Firma:** `findById(id: string): Promise<InventoryLocation \| null>` — [typeorm-inventory-location.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-location.repository.ts#L26) (L26–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `locationToDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-movement-repository-ts"></a>

### typeorm-inventory-movement.repository.ts

- **Ruta:** [typeorm-inventory-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-movement.repository.ts) (`comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-movement.repository.ts`, 28 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmInventoryMovementRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [inventory-movement.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-movement-entity-ts), [inventory-movement.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-movement-repository-ts), [inventory-movement.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-movement-orm-entity-ts), [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts)

#### Clase `TypeOrmInventoryMovementRepository` (L9–27)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements InventoryMovementRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(InventoryMovementOrmEntity) repository: Repository<InventoryMovementOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findByProductId` | método public async | 16–26 | `productId: string`, `limit: number` | `Promise<InventoryMovement[]>` |

##### `TypeOrmInventoryMovementRepository.findByProductId`

- **Firma:** `findByProductId(productId: string, limit: number): Promise<InventoryMovement[]>` — [typeorm-inventory-movement.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-movement.repository.ts#L16) (L16–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-stock-repository-ts"></a>

### typeorm-inventory-stock.repository.ts

- **Ruta:** [typeorm-inventory-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-stock.repository.ts) (`comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-stock.repository.ts`, 119 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmInventoryStockRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [inventory-stock.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-stock-entity-ts), [inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts), [inventory-stock.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-stock-orm-entity-ts), [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts)

#### Clase `TypeOrmInventoryStockRepository` (L13–118)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements InventoryStockRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(InventoryStockOrmEntity) repository: Repository<InventoryStockOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findByProductId` | método public async | 20–26 | `productId: string` | `Promise<InventoryStock[]>` |
| `findByProductIds` | método public async | 28–46 | `productIds: string[]` | `Promise<Map<string, InventoryStock[]>>` |
| `createInitial` | método public async | 48–62 | `productId: string`, `entries: InitialStockEntry[]` | `Promise<void>` |
| `setMinStock` | método public async | 64–82 | `productId: string`, `locationId: string`, `minStock: number` | `Promise<InventoryStock>` |
| `findLowStock` | método public async | 85–117 | — | `Promise<LowStockRow[]>` |

##### `TypeOrmInventoryStockRepository.findByProductId`

- **Firma:** `findByProductId(productId: string): Promise<InventoryStock[]>` — [typeorm-inventory-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-stock.repository.ts#L20) (L20–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmInventoryStockRepository.findByProductIds`

- **Firma:** `findByProductIds(productIds: string[]): Promise<Map<string, InventoryStock[]>>` — [typeorm-inventory-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-stock.repository.ts#L28) (L28–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Map`, `this.repository.find`, `In`, `stockToDomain`, `map.get`, `existing.push`, `map.set`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmInventoryStockRepository.createInitial`

- **Firma:** `createInitial(productId: string, entries: InitialStockEntry[]): Promise<void>` — [typeorm-inventory-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-stock.repository.ts#L48) (L48–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.insert`, `entries.map`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmInventoryStockRepository.setMinStock`

- **Firma:** `setMinStock(productId: string, locationId: string, minStock: number): Promise<InventoryStock>` — [typeorm-inventory-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-stock.repository.ts#L64) (L64–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `new InternalServerErrorException`, `this.repository.findOne`, `stockToDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `new InternalServerErrorException( 'No existe una fila de inventario para el producto ${productId} en la ubicación ${loca`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmInventoryStockRepository.findLowStock`

- **Firma:** `findLowStock(): Promise<LowStockRow[]>` — [typeorm-inventory-stock.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-stock.repository.ts#L85) (L85–117)
- **Propósito / descripción:** No formal ORM relation to `ProductOrmEntity` exists on this entity (this module never joins to `products` — it only stores `productId` as a plain column, same convention every other ORM entity here follows), so the product name is joined via a raw table name rather than a relation path.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('stock').innerJoin`, `this.repository.createQueryBuilder`, `rows.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-transfer-repository-ts"></a>

### typeorm-inventory-transfer.repository.ts

- **Ruta:** [typeorm-inventory-transfer.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-transfer.repository.ts) (`comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-transfer.repository.ts`, 109 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmInventoryTransferRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [inventory-transfer.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-transfer-repository-ts), [location-not-found.error.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-location-not-found-error-ts), [presentation.errors.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-presentation-errors-ts), [transfer.errors.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-transfer-errors-ts), [product-not-found.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-not-found-error-ts), [inventory-stock.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-stock-orm-entity-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts)

#### Clase `TypeOrmInventoryTransferRepository` (L25–108)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements InventoryTransferRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(InventoryStockOrmEntity) repository: Repository<InventoryStockOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `registerTransfer` | método public async | 32–38 | `data: RegisterTransferData` | `Promise<string>` |
| `registerTransferBatch` | método public async | 40–54 | `items: RegisterTransferData[]` | `Promise<string[]>` |
| `runTransfer` | método private async | 56–73 | `manager: EntityManager`, `data: RegisterTransferData` | `Promise<string>` |
| `translateError` | método private | 75–107 | `error: unknown` | `unknown` |

##### `TypeOrmInventoryTransferRepository.registerTransfer`

- **Firma:** `registerTransfer(data: RegisterTransferData): Promise<string>` — [typeorm-inventory-transfer.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-transfer.repository.ts#L32) (L32–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.runTransfer`, `this.translateError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmInventoryTransferRepository.registerTransferBatch`

- **Firma:** `registerTransferBatch(items: RegisterTransferData[]): Promise<string[]>` — [typeorm-inventory-transfer.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-transfer.repository.ts#L40) (L40–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.transaction`, `referenceIds.push`, `this.runTransfer`, `this.translateError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmInventoryTransferRepository.runTransfer`

- **Firma:** `runTransfer(manager: EntityManager, data: RegisterTransferData): Promise<string>` — [typeorm-inventory-transfer.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-transfer.repository.ts#L56) (L56–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`
- **Efectos secundarios:** Llama funciones SQL: `register_inventory_transfer`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmInventoryTransferRepository.translateError`

- **Firma:** `translateError(error: unknown): unknown` — [typeorm-inventory-transfer.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-inventory-transfer.repository.ts#L75) (L75–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new InvalidTransferQuantityError`, `new SameLocationTransferError`, `new ProductNotFoundError`, `new InventoryProductInactiveError`, `new LocationNotFoundError`, `new LocationInactiveError`, `new PresentationNotFoundError`, `new PresentationInactiveError`, `new InsufficientLocationStockError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-product-presentation-repository-ts"></a>

### typeorm-product-presentation.repository.ts

- **Ruta:** [typeorm-product-presentation.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-product-presentation.repository.ts) (`comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-product-presentation.repository.ts`, 150 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmProductPresentationRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product-presentation.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-product-presentation-entity-ts), [product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts), [presentation.errors.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-errors-presentation-errors-ts), [product-presentation.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-product-presentation-orm-entity-ts), [inventory.mappers.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-mappers-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts)

#### Clase `TypeOrmProductPresentationRepository` (L17–149)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements ProductPresentationRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(ProductPresentationOrmEntity) repository: Repository<ProductPresentationOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findByProductId` | método public async | 24–35 | `productId: string`, `options?: { activeOnly?: boolean }` | `Promise<ProductPresentation[]>` |
| `findById` | método public async | 37–40 | `id: string` | `Promise<ProductPresentation \| null>` |
| `findActiveByBarcode` | método public async | 52–62 | `barcode: string` | `Promise<ProductPresentation \| null>` |
| `create` | método public async | 64–86 | `data: CreatePresentationData` | `Promise<ProductPresentation>` |
| `update` | método public async | 88–106 | `id: string`, `data: UpdatePresentationData` | `Promise<ProductPresentation>` |
| `findMatchingByBarcode` | método public async | 108–130 | `productIds: string[]`, `search: string` | `Promise<Map<string, ProductPresentation>>` |
| `deactivateAllForProduct` | método public async | 132–134 | `productId: string` | `Promise<void>` |
| `translateError` | método private | 136–148 | `error: unknown` | `unknown` |

##### `TypeOrmProductPresentationRepository.findByProductId`

- **Firma:** `findByProductId(productId: string, options?: { activeOnly?: boolean }): Promise<ProductPresentation[]>` — [typeorm-product-presentation.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-product-presentation.repository.ts#L24) (L24–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductPresentationRepository.findById`

- **Firma:** `findById(id: string): Promise<ProductPresentation \| null>` — [typeorm-product-presentation.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-product-presentation.repository.ts#L37) (L37–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `presentationToDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductPresentationRepository.findActiveByBarcode`

- **Firma:** `findActiveByBarcode(barcode: string): Promise<ProductPresentation \| null>` — [typeorm-product-presentation.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-product-presentation.repository.ts#L52) (L52–62)
- **Propósito / descripción:** Scoped to presentations whose PARENT PRODUCT is also active, not just the presentation row itself — deactivating a product never cascades to deactivate its own presentations (a deliberate, separate lifecycle), so without this join a barcode left behind by a deactivated product's still-"active" presentation would permanently block reuse of that barcode even though nothing scannable is actually using it anymore. No `ProductOrmEntity` relation exists on this entity, so this joins the `products` table directly by raw condition.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('presentation').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `presentationToDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductPresentationRepository.create`

- **Firma:** `create(data: CreatePresentationData): Promise<ProductPresentation>` — [typeorm-product-presentation.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-product-presentation.repository.ts#L64) (L64–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `data.barcode?.trim`, `this.repository.save`, `this.repository.findOneOrFail`, `presentationToDomain`, `this.translateError`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductPresentationRepository.update`

- **Firma:** `update(id: string, data: UpdatePresentationData): Promise<ProductPresentation>` — [typeorm-product-presentation.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-product-presentation.repository.ts#L88) (L88–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `data.barcode?.trim`, `this.translateError`, `this.repository.findOneOrFail`, `presentationToDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductPresentationRepository.findMatchingByBarcode`

- **Firma:** `findMatchingByBarcode(productIds: string[], search: string): Promise<Map<string, ProductPresentation>>` — [typeorm-product-presentation.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-product-presentation.repository.ts#L108) (L108–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Map`, `search.trim`, `this.repository.createQueryBuilder('presentation').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `map.has`, `map.set`, `presentationToDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductPresentationRepository.deactivateAllForProduct`

- **Firma:** `deactivateAllForProduct(productId: string): Promise<void>` — [typeorm-product-presentation.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-product-presentation.repository.ts#L132) (L132–134)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductPresentationRepository.translateError`

- **Firma:** `translateError(error: unknown): unknown` — [typeorm-product-presentation.repository.ts](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-product-presentation.repository.ts#L136) (L136–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new PresentationNameAlreadyExistsError`, `new PresentationBarcodeAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts"></a>

### inventory.module.ts

- **Ruta:** [inventory.module.ts](../../../../comercial-jhoel-api/src/modules/inventory/inventory.module.ts) (`comercial-jhoel-api/src/modules/inventory/inventory.module.ts`, 96 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Módulo: declara `InventoryModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [inventory-location.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-location-orm-entity-ts), [product-presentation.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-product-presentation-orm-entity-ts), [inventory-stock.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-stock-orm-entity-ts), [inventory-movement.orm-entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-inventory-movement-orm-entity-ts), [typeorm-inventory-location.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-location-repository-ts), [typeorm-product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-product-presentation-repository-ts), [typeorm-inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-stock-repository-ts), [typeorm-inventory-movement.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-movement-repository-ts), [typeorm-inventory-transfer.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-transfer-repository-ts), [inventory-location.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-location-repository-ts), [product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts), [inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts), [inventory-movement.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-movement-repository-ts), [inventory-transfer.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-transfer-repository-ts), [list-inventory-locations.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-inventory-locations-use-case-ts) y 10 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [alerts.module.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts)

#### Clase `InventoryModule` (L29–95)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([ InventoryLocationOrmEntity, ProductPresentationOrmEntity, InventoryStockOrmEntity, InventoryMovementOrmEntity, ])`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts"></a>

### inventory.controller.ts

- **Ruta:** [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts) (`comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts`, 139 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** Locations/presentations/stock/movements/transfers — everything the "producto → presentaciones → ubicaciones → stock" evolution needed that didn't already live in `modules/products/`.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [list-inventory-locations.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-inventory-locations-use-case-ts), [list-product-presentations.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-product-presentations-use-case-ts), [create-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-ts), [update-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-update-presentation-use-case-ts), [get-product-inventory.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-get-product-inventory-use-case-ts), [register-inventory-transfer.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-use-case-ts), [register-inventory-transfer-batch.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-register-inventory-transfer-batch-use-case-ts), [set-min-stock.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-set-min-stock-use-case-ts), [create-presentation.request.dto.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-dtos-create-presentation-request-dto-ts), [update-presentation.request.dto.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-dtos-update-presentation-request-dto-ts), [register-transfer.request.dto.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-dtos-register-transfer-request-dto-ts) y 2 más
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts)

#### Clase `InventoryController` (L40–138)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('inventory')`
- **Propósito:** Locations/presentations/stock/movements/transfers — everything the "producto → presentaciones → ubicaciones → stock" evolution needed that didn't already live in `modules/products/`. Reading is open to any authenticated account (needed by the Compras/Ventas product pickers and the Inventario screen itself); writing a presentation is admin-only (mirrors Products' own create/update split); registering a transfer is operational (same "any authenticated active account" policy as Compras/Ventas/Recargas — moving stock between your own two locations is a daily register task, not an admin-only one).
- **Dependencias inyectadas (constructor):** `listLocationsUseCase: ListInventoryLocationsUseCase`, `listPresentationsUseCase: ListProductPresentationsUseCase`, `createPresentationUseCase: CreatePresentationUseCase`, `updatePresentationUseCase: UpdatePresentationUseCase`, `getProductInventoryUseCase: GetProductInventoryUseCase`, `registerTransferUseCase: RegisterInventoryTransferUseCase`, `registerTransferBatchUseCase: RegisterInventoryTransferBatchUseCase`, `setMinStockUseCase: SetMinStockUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findLocations` | método public | 54–57 | — | (inferido) |
| `findPresentations` | método public | 59–62 | `productId: string` | (inferido) |
| `createPresentation` | método public | 64–72 | `productId: string`, `dto: CreatePresentationRequestDto` | (inferido) |
| `updatePresentation` | método public | 74–85 | `id: string`, `dto: UpdatePresentationRequestDto` | (inferido) |
| `getProductInventory` | método public | 87–90 | `productId: string` | (inferido) |
| `setMinStock` | método public | 93–106 | `productId: string`, `locationId: string`, `dto: SetMinStockRequestDto` | (inferido) |
| `registerTransfer` | método public | 108–122 | `dto: RegisterTransferRequestDto`, `userId: string` | (inferido) |
| `registerTransferBatch` | método public | 125–137 | `dto: RegisterTransferBatchRequestDto`, `userId: string` | (inferido) |

##### `InventoryController.findLocations`

- **Firma:** `findLocations()` — [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L54) (L54–57)
- **Decoradores:** `@Get('locations')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.listLocationsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryController.findPresentations`

- **Firma:** `findPresentations(productId: string)` — [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L59) (L59–62)
- **Decoradores:** `@Get('products/:productId/presentations')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('productId', ParseUUIDPipe) productId`
- **Dependencias (llamadas en su cuerpo):** `this.listPresentationsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryController.createPresentation`

- **Firma:** `createPresentation(productId: string, dto: CreatePresentationRequestDto)` — [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L64) (L64–72)
- **Decoradores:** `@Post('products/:productId/presentations')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('productId', ParseUUIDPipe) productId`, `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.createPresentationUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryController.updatePresentation`

- **Firma:** `updatePresentation(id: string, dto: UpdatePresentationRequestDto)` — [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L74) (L74–85)
- **Decoradores:** `@Patch('presentations/:id')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.updatePresentationUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryController.getProductInventory`

- **Firma:** `getProductInventory(productId: string)` — [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L87) (L87–90)
- **Decoradores:** `@Get('products/:productId')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('productId', ParseUUIDPipe) productId`
- **Dependencias (llamadas en su cuerpo):** `this.getProductInventoryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryController.setMinStock`

- **Firma:** `setMinStock(productId: string, locationId: string, dto: SetMinStockRequestDto)` — [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L93) (L93–106)
- **Decoradores:** `@Patch('products/:productId/locations/:locationId/min-stock')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** "Stock mínimo" — the threshold the Alerts module reads for "inventario bajo". Admin-only, mirrors this controller's own presentation-write split.
- **Origen de parámetros:** `@Param('productId', ParseUUIDPipe) productId`, `@Param('locationId', ParseUUIDPipe) locationId`, `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.setMinStockUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryController.registerTransfer`

- **Firma:** `registerTransfer(dto: RegisterTransferRequestDto, userId: string)` — [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L108) (L108–122)
- **Decoradores:** `@Post('transfers')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerTransferUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryController.registerTransferBatch`

- **Firma:** `registerTransferBatch(dto: RegisterTransferBatchRequestDto, userId: string)` — [inventory.controller.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts#L125) (L125–137)
- **Decoradores:** `@Post('transfers/batch')`
- **Propósito / descripción:** "Transferencia rápida" — varios productos, un origen/destino, una sola operación atómica.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerTransferBatchUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-inventory-presentation-dtos-create-presentation-request-dto-ts"></a>

### create-presentation.request.dto.ts

- **Ruta:** [create-presentation.request.dto.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/dtos/create-presentation.request.dto.ts) (`comercial-jhoel-api/src/modules/inventory/presentation/dtos/create-presentation.request.dto.ts`, 25 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** DTO de entrada: declara `CreatePresentationRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

#### Clase `CreatePresentationRequestDto` (L3–24)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-inventory-presentation-dtos-register-transfer-batch-request-dto-ts"></a>

### register-transfer-batch.request.dto.ts

- **Ruta:** [register-transfer-batch.request.dto.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/dtos/register-transfer-batch.request.dto.ts) (`comercial-jhoel-api/src/modules/inventory/presentation/dtos/register-transfer-batch.request.dto.ts`, 43 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** DTO de entrada: declara `RegisterTransferBatchItemDto`, `RegisterTransferBatchRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

#### Clase `RegisterTransferBatchItemDto` (L13–24)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RegisterTransferBatchRequestDto` (L26–42)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-inventory-presentation-dtos-register-transfer-request-dto-ts"></a>

### register-transfer.request.dto.ts

- **Ruta:** [register-transfer.request.dto.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/dtos/register-transfer.request.dto.ts) (`comercial-jhoel-api/src/modules/inventory/presentation/dtos/register-transfer.request.dto.ts`, 25 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** DTO de entrada: declara `RegisterTransferRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

#### Clase `RegisterTransferRequestDto` (L3–24)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-inventory-presentation-dtos-set-min-stock-request-dto-ts"></a>

### set-min-stock.request.dto.ts

- **Ruta:** [set-min-stock.request.dto.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/dtos/set-min-stock.request.dto.ts) (`comercial-jhoel-api/src/modules/inventory/presentation/dtos/set-min-stock.request.dto.ts`, 8 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** DTO de entrada: declara `SetMinStockRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

#### Clase `SetMinStockRequestDto` (L3–7)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-inventory-presentation-dtos-update-presentation-request-dto-ts"></a>

### update-presentation.request.dto.ts

- **Ruta:** [update-presentation.request.dto.ts](../../../../comercial-jhoel-api/src/modules/inventory/presentation/dtos/update-presentation.request.dto.ts) (`comercial-jhoel-api/src/modules/inventory/presentation/dtos/update-presentation.request.dto.ts`, 42 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `inventory`
- **Responsabilidad:** DTO de entrada: declara `UpdatePresentationRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [inventory.controller.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-presentation-controllers-inventory-controller-ts)

#### Clase `UpdatePresentationRequestDto` (L12–41)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
