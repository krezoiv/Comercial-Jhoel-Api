# Módulo backend `ice-creams`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/ice-cream-purchases` | [ice-cream-purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts#L46) `IceCreamPurchasesController.create` | [CreateIceCreamPurchaseUseCase](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-purchase-use-case-ts) | `IceCreamPurchaseRepository`.confirmPurchase → `confirm_ice_cream_purchase` | UseGuards(JwtAuthGuard) | `IceCreamPurchasesService.createPurchase` |
| `GET /api/ice-cream-purchases` | [ice-cream-purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts#L60) `IceCreamPurchasesController.findAll` | [ListIceCreamPurchasesUseCase](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-cream-purchases-use-case-ts) | `IceCreamPurchaseRepository`.findAll | UseGuards(JwtAuthGuard) | `IceCreamPurchasesService.getPurchases` |
| `GET /api/ice-cream-purchases/:id` | [ice-cream-purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts#L72) `IceCreamPurchasesController.findOne` | [GetIceCreamPurchaseByIdUseCase](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-purchase-by-id-use-case-ts) | `IceCreamPurchaseRepository`.findById | UseGuards(JwtAuthGuard) | `IceCreamPurchasesService.getPurchaseById` |
| `POST /api/ice-cream-sales` | [ice-cream-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-sales.controller.ts#L45) `IceCreamSalesController.create` | [CreateIceCreamSaleUseCase](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-sale-use-case-ts) | `IceCreamSaleRepository`.confirmSale → `confirm_ice_cream_sale` | UseGuards(JwtAuthGuard) | `IceCreamSalesService.createSale` |
| `GET /api/ice-cream-sales` | [ice-cream-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-sales.controller.ts#L54) `IceCreamSalesController.findAll` | [ListIceCreamSalesUseCase](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-cream-sales-use-case-ts) | `IceCreamSaleRepository`.findAll | UseGuards(JwtAuthGuard) | `IceCreamSalesService.getSales` |
| `GET /api/ice-cream-sales/:id` | [ice-cream-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-sales.controller.ts#L66) `IceCreamSalesController.findOne` | [GetIceCreamSaleByIdUseCase](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-sale-by-id-use-case-ts) | `IceCreamSaleRepository`.findById | UseGuards(JwtAuthGuard) | `IceCreamSalesService.getSaleById` |
| `POST /api/ice-creams` | [ice-creams.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts#L48) `IceCreamsController.create` | [CreateIceCreamUseCase](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-use-case-ts) | `IceCreamRepository`.findByActiveProduct/findByActiveSku/create | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `IceCreamService.createIceCream` |
| `GET /api/ice-creams` | [ice-creams.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts#L59) `IceCreamsController.findAll` | [ListIceCreamsUseCase](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-creams-use-case-ts) | `IceCreamRepository`.findAll | UseGuards(JwtAuthGuard) | `IceCreamService.getIceCreams`<br>`IceCreamService.searchIceCreams` |
| `GET /api/ice-creams/:id` | [ice-creams.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts#L66) `IceCreamsController.findOne` | [GetIceCreamByIdUseCase](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-by-id-use-case-ts) | `IceCreamRepository`.findById | UseGuards(JwtAuthGuard) | `IceCreamService.getIceCreamById` |
| `PATCH /api/ice-creams/:id` | [ice-creams.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts#L73) `IceCreamsController.update` | [UpdateIceCreamUseCase](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-update-ice-cream-use-case-ts) | `IceCreamRepository`.findById/findByActiveProduct/findByActiveSku/update | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `IceCreamService.updateIceCream` |
| `DELETE /api/ice-creams/:id` | [ice-creams.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts#L87) `IceCreamsController.deactivate` | [DeactivateIceCreamUseCase](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-deactivate-ice-cream-use-case-ts) | `IceCreamRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `IceCreamService.deleteIceCream` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [ice-cream-output.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Plain, serializable shape use cases return — never the domain entity itself. | 1 internas | 4 | Media (4 consumidores) |
| [ice-cream-purchase-output.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-purchase-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toIceCreamPurchaseOutput`, `toIceCreamPurchaseSummaryOutput`, `IceCreamPurchaseItemOutput`, `IceCreamPurchaseOutput`, `IceCreamPurchaseSummaryOutput` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [ice-cream-sale-output.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-sale-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toIceCreamSaleOutput`, `toIceCreamSaleSummaryOutput`, `IceCreamSaleItemOutput`, `IceCreamSaleOutput`, `IceCreamSaleSummaryOutput` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [create-ice-cream-purchase.use-case.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-purchase-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateIceCreamPurchaseUseCase`, `CreateIceCreamPurchaseItemInput`, `CreateIceCreamPurchaseInput`, `FUTURE_DATE_GRACE_MS` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [create-ice-cream-sale.use-case.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-sale-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateIceCreamSaleUseCase`, `CreateIceCreamSaleItemInput`, `CreateIceCreamSaleInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [create-ice-cream.use-case.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-use-case-ts) | .ts | Caso de uso | Aplicación | Structural clone of `CreateProductUseCase` (name/SKU normalization, active-only uniqueness pre-checks) — see that use case for the pattern; `UpdateIceCreamUseCase`/`ListIceCreamsUseCase`/`GetIceCreamByIdUseCase`/`DeactivateIceCreamUseCase` are the same clone relationship to their Products counterparts. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-ice-cream.use-case.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-deactivate-ice-cream-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — DELETE /ice-creams/:id never removes the row. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-ice-cream-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetIceCreamByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-ice-cream-purchase-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-purchase-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetIceCreamPurchaseByIdUseCase`, `GetIceCreamPurchaseByIdInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-ice-cream-sale-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-sale-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetIceCreamSaleByIdUseCase`, `GetIceCreamSaleByIdInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-ice-cream-purchases.use-case.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-cream-purchases-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListIceCreamPurchasesUseCase`, `ListIceCreamPurchasesInput`, `ListIceCreamPurchasesOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-ice-cream-sales.use-case.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-cream-sales-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListIceCreamSalesUseCase`, `ListIceCreamSalesInput`, `ListIceCreamSalesOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-ice-creams.use-case.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-creams-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListIceCreamsUseCase`, `ListIceCreamsInput`, `ListIceCreamsOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-ice-cream.use-case.ts](#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-update-ice-cream-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateIceCreamUseCase`, `UpdateIceCreamInput` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [ice-cream-purchase-detail.entity.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-purchase-detail-entity-ts) | .ts | Entidad de dominio | Dominio | A frozen line item — `costPrice`/`total` are the values recorded at the moment of purchase, never recomputed from the live helado. | 0 internas | 2 | Baja (2 consumidores) |
| [ice-cream-purchase.entity.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-purchase-entity-ts) | .ts | Entidad de dominio | Dominio | Entidad de dominio: declara `IceCreamPurchase`, `IceCreamPurchaseProps` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [ice-cream-sale-detail.entity.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-sale-detail-entity-ts) | .ts | Entidad de dominio | Dominio | A frozen line item — `unitPrice`/`total` are the helado's public price at the moment of sale, never recomputed from the live helado. | 0 internas | 2 | Baja (2 consumidores) |
| [ice-cream-sale.entity.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-sale-entity-ts) | .ts | Entidad de dominio | Dominio | Structural clone of `Sale`, but bulk one-shot only — no `status` (OPEN/CONFIRMED) field and no real-time draft/reservation flow like the main Sales module's `adjust_sale_item`/`cancel_open_sale`. | 1 internas | 4 | Media (4 consumidores) |
| [ice-cream.entity.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-entity-ts) | .ts | Entidad de dominio | Dominio | "Heladería" inventory — structurally a clone of `Product` (sku/name unique-only-among-active via the identical partial-unique-index pattern, same cost/public price columns, same soft delete), but backed by its own entirely separate `ice_creams` table/module, not a row in `products` scoped by a "Heladería" `businessId`. | 0 internas | 4 | Media (4 consumidores) |
| [ice-cream-inactive.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-inactive-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `IceCreamInactiveError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [ice-cream-name-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-name-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `IceCreamNameAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [ice-cream-not-found.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `IceCreamNotFoundError` (sin comentario de documentación en el código). | 1 internas | 5 | Media (5 consumidores) |
| [ice-cream-purchase-access-denied.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-purchase-access-denied-error-ts) | .ts | Errores de dominio | Dominio | A USER account trying to view an ice cream purchase that isn't theirs — ADMIN/SUPER_ADMIN can view any purchase. | 1 internas | 1 | Baja (1 consumidores) |
| [ice-cream-purchase-empty.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-purchase-empty-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `IceCreamPurchaseEmptyError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [ice-cream-purchase-not-found.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-purchase-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `IceCreamPurchaseNotFoundError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [ice-cream-sale-access-denied.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sale-access-denied-error-ts) | .ts | Errores de dominio | Dominio | A USER account trying to view an ice cream sale that isn't theirs — ADMIN/SUPER_ADMIN can view any sale. | 1 internas | 1 | Baja (1 consumidores) |
| [ice-cream-sale-empty.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sale-empty-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `IceCreamSaleEmptyError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [ice-cream-sale-not-found.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sale-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `IceCreamSaleNotFoundError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [ice-cream-sku-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sku-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `IceCreamSkuAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [insufficient-ice-cream-stock.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-insufficient-ice-cream-stock-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InsufficientIceCreamStockError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-ice-cream-price.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-price-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidIceCreamPriceError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-ice-cream-purchase-date.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-purchase-date-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidIceCreamPurchaseDateError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-ice-cream-quantity.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-quantity-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidIceCreamQuantityError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [invalid-ice-cream-supplier.error.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-supplier-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidIceCreamSupplierError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [ice-cream-purchase.repository.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-purchase-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `IceCreamPurchaseItemData`, `ConfirmIceCreamPurchaseData`, `FindIceCreamPurchasesOptions`, `PaginatedResult`, `IceCreamPurchaseRepository` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [ice-cream-sale.repository.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-sale-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `IceCreamSaleItemData`, `ConfirmIceCreamSaleData`, `FindIceCreamSalesOptions`, `PaginatedResult`, `IceCreamSaleRepository` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [ice-cream.repository.ts](#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `FindIceCreamsOptions`, `PaginatedResult`, `CreateIceCreamData`, `UpdateIceCreamData`, `IceCreamRepository` (sin comentario de documentación en el código). | 1 internas | 9 | Media (9 consumidores) |
| [ice-creams.module.ts](#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `IceCreamsModule` (sin comentario de documentación en el código). | 25 internas; ext.: @nestjs/common, @nestjs/typeorm | 2 | Baja (2 consumidores) |
| [ice-cream-purchase-detail.orm-entity.ts](#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-detail-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `IceCreamPurchaseDetailOrmEntity` (sin comentario de documentación en el código). | 3 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [ice-cream-purchase.mapper.ts](#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `IceCreamPurchaseMapper` (sin comentario de documentación en el código). | 3 internas | 1 | Baja (1 consumidores) |
| [ice-cream-purchase.orm-entity.ts](#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `IceCreamPurchaseOrmEntity` (sin comentario de documentación en el código). | 4 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [ice-cream-sale-detail.orm-entity.ts](#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-detail-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `IceCreamSaleDetailOrmEntity` (sin comentario de documentación en el código). | 3 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [ice-cream-sale.mapper.ts](#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `IceCreamSaleMapper` (sin comentario de documentación en el código). | 3 internas | 1 | Baja (1 consumidores) |
| [ice-cream-sale.orm-entity.ts](#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `IceCreamSaleOrmEntity` (sin comentario de documentación en el código). | 3 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [ice-cream.mapper.ts](#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `IceCreamMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [ice-cream.orm-entity.ts](#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `IceCreamOrmEntity` (sin comentario de documentación en el código). | 2 internas; ext.: typeorm | 5 | Media (5 consumidores) |
| [typeorm-ice-cream-purchase.repository.ts](#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmIceCreamPurchaseRepository`, `SORT_COLUMN` (sin comentario de documentación en el código). | 10 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-ice-cream-sale.repository.ts](#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-sale-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmIceCreamSaleRepository`, `SORT_COLUMN` (sin comentario de documentación en el código). | 9 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-ice-cream.repository.ts](#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmIceCreamRepository`, `SORT_COLUMN` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [ice-cream-purchases.controller.ts](#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-purchases-controller-ts) | .ts | Controlador | Presentación | No `@Roles(...)` restriction — same policy as `PurchasesController`: registering a compra (receiving stock) is an operational action for whoever runs the register, not an admin-only one. | 8 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [ice-cream-sales.controller.ts](#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-sales-controller-ts) | .ts | Controlador | Presentación | No `@Roles(...)` restriction — same policy as `PurchasesController`/ `IceCreamPurchasesController`: registering a venta is an operational action for whoever runs the register, not an admin-only one. | 8 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [ice-creams.controller.ts](#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts) | .ts | Controlador | Presentación | CRUD is admin-only (create/update/deactivate), same policy as `ProductsController` — a USER can read the catalog (needed for the purchase/sale product pickers) but never manage it. | 13 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [create-ice-cream-purchase.request.dto.ts](#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-create-ice-cream-purchase-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateIceCreamPurchaseItemRequestDto`, `CreateIceCreamPurchaseRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [create-ice-cream-sale.request.dto.ts](#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-create-ice-cream-sale-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateIceCreamSaleItemRequestDto`, `CreateIceCreamSaleRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [create-ice-cream.request.dto.ts](#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-create-ice-cream-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateIceCreamRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [ice-cream-purchase.response.dto.ts](#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-ice-cream-purchase-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `IceCreamPurchaseItemResponseDto`, `IceCreamPurchaseResponseDto`, `IceCreamPurchaseSummaryResponseDto`, `PaginatedIceCreamPurchasesResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [ice-cream-sale.response.dto.ts](#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-ice-cream-sale-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `IceCreamSaleItemResponseDto`, `IceCreamSaleResponseDto`, `IceCreamSaleSummaryResponseDto`, `PaginatedIceCreamSalesResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [ice-cream.response.dto.ts](#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-ice-cream-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `IceCreamResponseDto`, `PaginatedIceCreamsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [list-ice-cream-purchases.query.dto.ts](#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-list-ice-cream-purchases-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListIceCreamPurchasesQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [list-ice-cream-sales.query.dto.ts](#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-list-ice-cream-sales-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListIceCreamSalesQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [list-ice-creams.query.dto.ts](#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-list-ice-creams-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListIceCreamsQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [update-ice-cream.request.dto.ts](#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-update-ice-cream-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateIceCreamRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-output-ts"></a>

### ice-cream-output.ts

- **Ruta:** [ice-cream-output.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/dtos/ice-cream-output.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/dtos/ice-cream-output.ts`, 37 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Plain, serializable shape use cases return — never the domain entity itself.
- **Depende de (archivos del proyecto):** [ice-cream.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-entity-ts)
- **Consumidores:** [create-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-use-case-ts), [get-ice-cream-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-by-id-use-case-ts), [list-ice-creams.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-creams-use-case-ts), [update-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-update-ice-cream-use-case-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamOutput` (L4): Plain, serializable shape use cases return — never the domain entity itself. — miembros: `id`, `sku`, `product`, `costPrice`, `publicPrice`, `stock`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
#### Función `toIceCreamOutput` (L20–36)

- **Tipo:** función exportada
- **Firma:** `toIceCreamOutput(iceCream: IceCream): IceCreamOutput` — [ice-cream-output.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/dtos/ice-cream-output.ts#L20)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-use-case-ts), [get-ice-cream-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-by-id-use-case-ts), [update-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-update-ice-cream-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-purchase-output-ts"></a>

### ice-cream-purchase-output.ts

- **Ruta:** [ice-cream-purchase-output.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/dtos/ice-cream-purchase-output.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/dtos/ice-cream-purchase-output.ts`, 78 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** DTO de salida (aplicación): declara `toIceCreamPurchaseOutput`, `toIceCreamPurchaseSummaryOutput`, `IceCreamPurchaseItemOutput`, `IceCreamPurchaseOutput`, `IceCreamPurchaseSummaryOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-purchase.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-purchase-entity-ts)
- **Consumidores:** [create-ice-cream-purchase.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-purchase-use-case-ts), [get-ice-cream-purchase-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-purchase-by-id-use-case-ts), [list-ice-cream-purchases.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-cream-purchases-use-case-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamPurchaseItemOutput` (L3): sin documentación — miembros: `id`, `iceCreamId`, `product`, `sku`, `quantity`, `costPrice`, `total`
- `interface IceCreamPurchaseOutput` (L14): Full shape — used for `GET /ice-cream-purchases/:id` and the response of `POST /ice-cream-purchases`. — miembros: `id`, `supplierId`, `supplierName`, `userId`, `username`, `purchaseDate`, `total`, `items`, `createdAt`, `updatedAt`
- `interface IceCreamPurchaseSummaryOutput` (L28): Lighter shape for `GET /ice-cream-purchases` — no line items, so listing purchases never needs to load them. — miembros: `id`, `supplierId`, `supplierName`, `userId`, `username`, `purchaseDate`, `total`, `createdAt`
#### Función `toIceCreamPurchaseOutput` (L39–62)

- **Tipo:** función exportada
- **Firma:** `toIceCreamPurchaseOutput(purchase: IceCreamPurchase): IceCreamPurchaseOutput` — [ice-cream-purchase-output.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/dtos/ice-cream-purchase-output.ts#L39)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `purchase.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-ice-cream-purchase.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-purchase-use-case-ts), [get-ice-cream-purchase-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-purchase-by-id-use-case-ts)

#### Función `toIceCreamPurchaseSummaryOutput` (L64–77)

- **Tipo:** función exportada
- **Firma:** `toIceCreamPurchaseSummaryOutput(purchase: IceCreamPurchase): IceCreamPurchaseSummaryOutput` — [ice-cream-purchase-output.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/dtos/ice-cream-purchase-output.ts#L64)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-sale-output-ts"></a>

### ice-cream-sale-output.ts

- **Ruta:** [ice-cream-sale-output.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/dtos/ice-cream-sale-output.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/dtos/ice-cream-sale-output.ts`, 68 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** DTO de salida (aplicación): declara `toIceCreamSaleOutput`, `toIceCreamSaleSummaryOutput`, `IceCreamSaleItemOutput`, `IceCreamSaleOutput`, `IceCreamSaleSummaryOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-sale.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-sale-entity-ts)
- **Consumidores:** [create-ice-cream-sale.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-sale-use-case-ts), [get-ice-cream-sale-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-sale-by-id-use-case-ts), [list-ice-cream-sales.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-cream-sales-use-case-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamSaleItemOutput` (L3): sin documentación — miembros: `id`, `iceCreamId`, `product`, `sku`, `quantity`, `unitPrice`, `total`
- `interface IceCreamSaleOutput` (L14): Full shape — used for `GET /ice-cream-sales/:id` and the response of `POST /ice-cream-sales`. — miembros: `id`, `userId`, `username`, `saleDate`, `total`, `items`, `createdAt`, `updatedAt`
- `interface IceCreamSaleSummaryOutput` (L26): Lighter shape for `GET /ice-cream-sales` — no line items, so listing sales never needs to load them. — miembros: `id`, `userId`, `username`, `saleDate`, `total`, `createdAt`
#### Función `toIceCreamSaleOutput` (L35–54)

- **Tipo:** función exportada
- **Firma:** `toIceCreamSaleOutput(sale: IceCreamSale): IceCreamSaleOutput` — [ice-cream-sale-output.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/dtos/ice-cream-sale-output.ts#L35)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `sale.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-ice-cream-sale.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-sale-use-case-ts), [get-ice-cream-sale-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-sale-by-id-use-case-ts)

#### Función `toIceCreamSaleSummaryOutput` (L56–67)

- **Tipo:** función exportada
- **Firma:** `toIceCreamSaleSummaryOutput(sale: IceCreamSale): IceCreamSaleSummaryOutput` — [ice-cream-sale-output.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/dtos/ice-cream-sale-output.ts#L56)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-purchase-use-case-ts"></a>

### create-ice-cream-purchase.use-case.ts

- **Ruta:** [create-ice-cream-purchase.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream-purchase.use-case.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream-purchase.use-case.ts`, 94 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Caso de uso: declara `CreateIceCreamPurchaseUseCase`, `CreateIceCreamPurchaseItemInput`, `CreateIceCreamPurchaseInput`, `FUTURE_DATE_GRACE_MS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-purchase-repository-ts), [ice-cream-purchase-empty.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-purchase-empty-error-ts), [invalid-ice-cream-quantity.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-quantity-error-ts), [invalid-ice-cream-price.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-price-error-ts), [invalid-ice-cream-purchase-date.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-purchase-date-error-ts), [ice-cream-purchase-output.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-purchase-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-cream-purchases.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-purchases-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateIceCreamPurchaseItemInput` (L13): sin documentación — miembros: `iceCreamId`, `quantity`, `costPrice`
- `interface CreateIceCreamPurchaseInput` (L19): sin documentación — miembros: `supplierId`, `userId`, `purchaseDate`, `items`

#### Clase `CreateIceCreamPurchaseUseCase` (L31–93)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_PURCHASE_REPOSITORY) iceCreamPurchaseRepository: IceCreamPurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 38–92 | `input: CreateIceCreamPurchaseInput` | `Promise<IceCreamPurchaseOutput>` |

##### `CreateIceCreamPurchaseUseCase.execute`

- **Firma:** `execute(input: CreateIceCreamPurchaseInput): Promise<IceCreamPurchaseOutput>` — [create-ice-cream-purchase.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream-purchase.use-case.ts#L38) (L38–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new IceCreamPurchaseEmptyError`, `Number.isNaN`, `input.purchaseDate.getTime`, `Date.now`, `new InvalidIceCreamPurchaseDateError`, `Number.isInteger`, `new InvalidIceCreamQuantityError`, `new InvalidIceCreamPriceError`, `new Map`, `mergedByIceCream.get`, `mergedByIceCream.set`, `[...mergedByIceCream.entries()].sort(([a], [b]) => a.localeCompare(b)).map`, `[...mergedByIceCream.entries()].sort`, `mergedByIceCream.entries`, `a.localeCompare`, `this.iceCreamPurchaseRepository.confirmPurchase`, `toIceCreamPurchaseOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new IceCreamPurchaseEmptyError()`, `new InvalidIceCreamPurchaseDateError()`, `new InvalidIceCreamQuantityError(item.iceCreamId)`, `new InvalidIceCreamPriceError(item.iceCreamId)`
- **Consumidores:** [ice-cream-purchases.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-purchases-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-sale-use-case-ts"></a>

### create-ice-cream-sale.use-case.ts

- **Ruta:** [create-ice-cream-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream-sale.use-case.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream-sale.use-case.ts`, 67 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Caso de uso: declara `CreateIceCreamSaleUseCase`, `CreateIceCreamSaleItemInput`, `CreateIceCreamSaleInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-sale-repository-ts), [ice-cream-sale-empty.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sale-empty-error-ts), [invalid-ice-cream-quantity.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-quantity-error-ts), [ice-cream-sale-output.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-cream-sales.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-sales-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateIceCreamSaleItemInput` (L11): sin documentación — miembros: `iceCreamId`, `quantity`
- `interface CreateIceCreamSaleInput` (L16): sin documentación — miembros: `userId`, `items`

#### Clase `CreateIceCreamSaleUseCase` (L21–66)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_SALE_REPOSITORY) iceCreamSaleRepository: IceCreamSaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 28–65 | `input: CreateIceCreamSaleInput` | `Promise<IceCreamSaleOutput>` |

##### `CreateIceCreamSaleUseCase.execute`

- **Firma:** `execute(input: CreateIceCreamSaleInput): Promise<IceCreamSaleOutput>` — [create-ice-cream-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream-sale.use-case.ts#L28) (L28–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new IceCreamSaleEmptyError`, `Number.isInteger`, `new InvalidIceCreamQuantityError`, `new Map`, `mergedByIceCream.set`, `mergedByIceCream.get`, `[...mergedByIceCream.entries()].sort(([a], [b]) => a.localeCompare(b)).map`, `[...mergedByIceCream.entries()].sort`, `mergedByIceCream.entries`, `a.localeCompare`, `this.iceCreamSaleRepository.confirmSale`, `toIceCreamSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new IceCreamSaleEmptyError()`, `new InvalidIceCreamQuantityError(item.iceCreamId)`
- **Consumidores:** [ice-cream-sales.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-use-case-ts"></a>

### create-ice-cream.use-case.ts

- **Ruta:** [create-ice-cream.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream.use-case.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream.use-case.ts`, 54 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Structural clone of `CreateProductUseCase` (name/SKU normalization, active-only uniqueness pre-checks) — see that use case for the pattern; `UpdateIceCreamUseCase`/`ListIceCreamsUseCase`/`GetIceCreamByIdUseCase`/`DeactivateIceCreamUseCase` are the same clone relationship to their Products counterparts.
- **Depende de (archivos del proyecto):** [ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-repository-ts), [ice-cream-name-already-exists.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-name-already-exists-error-ts), [ice-cream-sku-already-exists.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sku-already-exists-error-ts), [ice-cream-output.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateIceCreamInput` (L8): sin documentación — miembros: `sku`, `product`, `costPrice`, `publicPrice`, `createdBy`

#### Clase `CreateIceCreamUseCase` (L17–53)

- **Decoradores:** `@Injectable()`
- **Propósito:** Structural clone of `CreateProductUseCase` (name/SKU normalization, active-only uniqueness pre-checks) — see that use case for the pattern; `UpdateIceCreamUseCase`/`ListIceCreamsUseCase`/`GetIceCreamByIdUseCase`/`DeactivateIceCreamUseCase` are the same clone relationship to their Products counterparts.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_REPOSITORY) iceCreamRepository: IceCreamRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 24–52 | `input: CreateIceCreamInput` | `Promise<IceCreamOutput>` |

##### `CreateIceCreamUseCase.execute`

- **Firma:** `execute(input: CreateIceCreamInput): Promise<IceCreamOutput>` — [create-ice-cream.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream.use-case.ts#L24) (L24–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.product.trim().replace`, `input.product.trim`, `input.sku.trim`, `this.iceCreamRepository.findByActiveProduct`, `new IceCreamNameAlreadyExistsError`, `this.iceCreamRepository.findByActiveSku`, `new IceCreamSkuAlreadyExistsError`, `this.iceCreamRepository.create`, `toIceCreamOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new IceCreamNameAlreadyExistsError(product)`, `new IceCreamSkuAlreadyExistsError(sku)`
- **Consumidores:** [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-deactivate-ice-cream-use-case-ts"></a>

### deactivate-ice-cream.use-case.ts

- **Ruta:** [deactivate-ice-cream.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/deactivate-ice-cream.use-case.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/deactivate-ice-cream.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Soft delete only — DELETE /ice-creams/:id never removes the row.
- **Depende de (archivos del proyecto):** [ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-repository-ts), [ice-cream-not-found.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

#### Clase `DeactivateIceCreamUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — DELETE /ice-creams/:id never removes the row.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_REPOSITORY) iceCreamRepository: IceCreamRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<void>` |

##### `DeactivateIceCreamUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-ice-cream.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/deactivate-ice-cream.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.iceCreamRepository.findById`, `new IceCreamNotFoundError`, `this.iceCreamRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new IceCreamNotFoundError(id)`
- **Consumidores:** [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-by-id-use-case-ts"></a>

### get-ice-cream-by-id.use-case.ts

- **Ruta:** [get-ice-cream-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/get-ice-cream-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/get-ice-cream-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Caso de uso: declara `GetIceCreamByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-repository-ts), [ice-cream-not-found.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-not-found-error-ts), [ice-cream-output.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

#### Clase `GetIceCreamByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_REPOSITORY) iceCreamRepository: IceCreamRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<IceCreamOutput>` |

##### `GetIceCreamByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<IceCreamOutput>` — [get-ice-cream-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/get-ice-cream-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.iceCreamRepository.findById`, `new IceCreamNotFoundError`, `toIceCreamOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new IceCreamNotFoundError(id)`
- **Consumidores:** [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-purchase-by-id-use-case-ts"></a>

### get-ice-cream-purchase-by-id.use-case.ts

- **Ruta:** [get-ice-cream-purchase-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/get-ice-cream-purchase-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/get-ice-cream-purchase-by-id.use-case.ts`, 39 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Caso de uso: declara `GetIceCreamPurchaseByIdUseCase`, `GetIceCreamPurchaseByIdInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-purchase-repository-ts), [ice-cream-purchase-not-found.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-purchase-not-found-error-ts), [ice-cream-purchase-access-denied.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-purchase-access-denied-error-ts), [ice-cream-purchase-output.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-purchase-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-cream-purchases.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-purchases-controller-ts)

**Interfaces, tipos y enums:**

- `interface GetIceCreamPurchaseByIdInput` (L11): sin documentación — miembros: `currentUserId`, `isAdmin`

#### Clase `GetIceCreamPurchaseByIdUseCase` (L16–38)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_PURCHASE_REPOSITORY) iceCreamPurchaseRepository: IceCreamPurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 23–37 | `id: string`, `input: GetIceCreamPurchaseByIdInput` | `Promise<IceCreamPurchaseOutput>` |

##### `GetIceCreamPurchaseByIdUseCase.execute`

- **Firma:** `execute(id: string, input: GetIceCreamPurchaseByIdInput): Promise<IceCreamPurchaseOutput>` — [get-ice-cream-purchase-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/get-ice-cream-purchase-by-id.use-case.ts#L23) (L23–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.iceCreamPurchaseRepository.findById`, `new IceCreamPurchaseNotFoundError`, `new IceCreamPurchaseAccessDeniedError`, `toIceCreamPurchaseOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new IceCreamPurchaseNotFoundError(id)`, `new IceCreamPurchaseAccessDeniedError()`
- **Consumidores:** [ice-cream-purchases.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-purchases-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-sale-by-id-use-case-ts"></a>

### get-ice-cream-sale-by-id.use-case.ts

- **Ruta:** [get-ice-cream-sale-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/get-ice-cream-sale-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/get-ice-cream-sale-by-id.use-case.ts`, 39 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Caso de uso: declara `GetIceCreamSaleByIdUseCase`, `GetIceCreamSaleByIdInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-sale-repository-ts), [ice-cream-sale-not-found.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sale-not-found-error-ts), [ice-cream-sale-access-denied.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sale-access-denied-error-ts), [ice-cream-sale-output.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-cream-sales.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-sales-controller-ts)

**Interfaces, tipos y enums:**

- `interface GetIceCreamSaleByIdInput` (L11): sin documentación — miembros: `currentUserId`, `isAdmin`

#### Clase `GetIceCreamSaleByIdUseCase` (L16–38)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_SALE_REPOSITORY) iceCreamSaleRepository: IceCreamSaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 23–37 | `id: string`, `input: GetIceCreamSaleByIdInput` | `Promise<IceCreamSaleOutput>` |

##### `GetIceCreamSaleByIdUseCase.execute`

- **Firma:** `execute(id: string, input: GetIceCreamSaleByIdInput): Promise<IceCreamSaleOutput>` — [get-ice-cream-sale-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/get-ice-cream-sale-by-id.use-case.ts#L23) (L23–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.iceCreamSaleRepository.findById`, `new IceCreamSaleNotFoundError`, `new IceCreamSaleAccessDeniedError`, `toIceCreamSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new IceCreamSaleNotFoundError(id)`, `new IceCreamSaleAccessDeniedError()`
- **Consumidores:** [ice-cream-sales.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-cream-purchases-use-case-ts"></a>

### list-ice-cream-purchases.use-case.ts

- **Ruta:** [list-ice-cream-purchases.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/list-ice-cream-purchases.use-case.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/list-ice-cream-purchases.use-case.ts`, 70 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Caso de uso: declara `ListIceCreamPurchasesUseCase`, `ListIceCreamPurchasesInput`, `ListIceCreamPurchasesOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-purchase-repository-ts), [ice-cream-purchase-output.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-purchase-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-cream-purchases.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-purchases-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListIceCreamPurchasesInput` (L13): sin documentación — miembros: `currentUserId`, `isAdmin`, `supplierId`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface ListIceCreamPurchasesOutput` (L24): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `ListIceCreamPurchasesUseCase` (L35–69)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_PURCHASE_REPOSITORY) iceCreamPurchaseRepository: IceCreamPurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 42–68 | `input: ListIceCreamPurchasesInput` | `Promise<ListIceCreamPurchasesOutput>` |

##### `ListIceCreamPurchasesUseCase.execute`

- **Firma:** `execute(input: ListIceCreamPurchasesInput): Promise<ListIceCreamPurchasesOutput>` — [list-ice-cream-purchases.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/list-ice-cream-purchases.use-case.ts#L42) (L42–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `this.iceCreamPurchaseRepository.findAll`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [ice-cream-purchases.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-purchases-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-cream-sales-use-case-ts"></a>

### list-ice-cream-sales.use-case.ts

- **Ruta:** [list-ice-cream-sales.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/list-ice-cream-sales.use-case.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/list-ice-cream-sales.use-case.ts`, 68 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Caso de uso: declara `ListIceCreamSalesUseCase`, `ListIceCreamSalesInput`, `ListIceCreamSalesOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-sale-repository-ts), [ice-cream-sale-output.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-cream-sales.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-sales-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListIceCreamSalesInput` (L13): sin documentación — miembros: `currentUserId`, `isAdmin`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface ListIceCreamSalesOutput` (L23): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `ListIceCreamSalesUseCase` (L34–67)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_SALE_REPOSITORY) iceCreamSaleRepository: IceCreamSaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 41–66 | `input: ListIceCreamSalesInput` | `Promise<ListIceCreamSalesOutput>` |

##### `ListIceCreamSalesUseCase.execute`

- **Firma:** `execute(input: ListIceCreamSalesInput): Promise<ListIceCreamSalesOutput>` — [list-ice-cream-sales.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/list-ice-cream-sales.use-case.ts#L41) (L41–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `this.iceCreamSaleRepository.findAll`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [ice-cream-sales.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-creams-use-case-ts"></a>

### list-ice-creams.use-case.ts

- **Ruta:** [list-ice-creams.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/list-ice-creams.use-case.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/list-ice-creams.use-case.ts`, 61 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Caso de uso: declara `ListIceCreamsUseCase`, `ListIceCreamsInput`, `ListIceCreamsOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-repository-ts), [ice-cream-output.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListIceCreamsInput` (L10): sin documentación — miembros: `search`, `sortBy`, `sortDirection`, `page`, `limit`, `includeInactive`
- `interface ListIceCreamsOutput` (L19): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `ListIceCreamsUseCase` (L30–60)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_REPOSITORY) iceCreamRepository: IceCreamRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 37–59 | `input?: ListIceCreamsInput` | `Promise<ListIceCreamsOutput>` |

##### `ListIceCreamsUseCase.execute`

- **Firma:** `execute(input?: ListIceCreamsInput): Promise<ListIceCreamsOutput>` — [list-ice-creams.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/list-ice-creams.use-case.ts#L37) (L37–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `this.iceCreamRepository.findAll`, `input.search?.trim`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-update-ice-cream-use-case-ts"></a>

### update-ice-cream.use-case.ts

- **Ruta:** [update-ice-cream.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/update-ice-cream.use-case.ts) (`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/update-ice-cream.use-case.ts`, 63 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Caso de uso: declara `UpdateIceCreamUseCase`, `UpdateIceCreamInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-repository-ts), [ice-cream-not-found.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-not-found-error-ts), [ice-cream-name-already-exists.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-name-already-exists-error-ts), [ice-cream-sku-already-exists.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sku-already-exists-error-ts), [ice-cream-output.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateIceCreamInput` (L9): sin documentación — miembros: `sku`, `product`, `costPrice`, `publicPrice`, `updatedBy`

#### Clase `UpdateIceCreamUseCase` (L17–62)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_REPOSITORY) iceCreamRepository: IceCreamRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 24–61 | `id: string`, `input: UpdateIceCreamInput` | `Promise<IceCreamOutput>` |

##### `UpdateIceCreamUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateIceCreamInput): Promise<IceCreamOutput>` — [update-ice-cream.use-case.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/update-ice-cream.use-case.ts#L24) (L24–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.iceCreamRepository.findById`, `new IceCreamNotFoundError`, `input.product?.trim().replace`, `input.product?.trim`, `this.iceCreamRepository.findByActiveProduct`, `new IceCreamNameAlreadyExistsError`, `input.sku?.trim`, `this.iceCreamRepository.findByActiveSku`, `new IceCreamSkuAlreadyExistsError`, `this.iceCreamRepository.update`, `toIceCreamOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.iceCreamRepository.update`
- **Errores que lanza:** `new IceCreamNotFoundError(id)`, `new IceCreamNameAlreadyExistsError(product)`, `new IceCreamSkuAlreadyExistsError(sku)`
- **Consumidores:** [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-purchase-detail-entity-ts"></a>

### ice-cream-purchase-detail.entity.ts

- **Ruta:** [ice-cream-purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase-detail.entity.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase-detail.entity.ts`, 47 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** A frozen line item — `costPrice`/`total` are the values recorded at the moment of purchase, never recomputed from the live helado.
- **Consumidores:** [ice-cream-purchase.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-purchase-entity-ts), [ice-cream-purchase.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-mapper-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamPurchaseDetailProps` (L1): sin documentación — miembros: `id`, `iceCreamId`, `product`, `sku`, `quantity`, `costPrice`, `total`

#### Clase `IceCreamPurchaseDetail` (L12–46)

- **Propósito:** A frozen line item — `costPrice`/`total` are the values recorded at the moment of purchase, never recomputed from the live helado.
- **Dependencias inyectadas (constructor):** `props: IceCreamPurchaseDetailProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 15–17 | `props: IceCreamPurchaseDetailProps` | `IceCreamPurchaseDetail` |
| `id` | getter public | 19–21 | — | `string` |
| `iceCreamId` | getter public | 23–25 | — | `string` |
| `product` | getter public | 27–29 | — | `string` |
| `sku` | getter public | 31–33 | — | `string` |
| `quantity` | getter public | 35–37 | — | `number` |
| `costPrice` | getter public | 39–41 | — | `number` |
| `total` | getter public | 43–45 | — | `number` |

##### `IceCreamPurchaseDetail.create`

- **Firma:** `create(props: IceCreamPurchaseDetailProps): IceCreamPurchaseDetail` — [ice-cream-purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase-detail.entity.ts#L15) (L15–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new IceCreamPurchaseDetail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [ice-cream-purchase.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-mapper-ts)

##### `IceCreamPurchaseDetail.id`

- **Firma:** `id(): string` — [ice-cream-purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase-detail.entity.ts#L19) (L19–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchaseDetail.iceCreamId`

- **Firma:** `iceCreamId(): string` — [ice-cream-purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase-detail.entity.ts#L23) (L23–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchaseDetail.product`

- **Firma:** `product(): string` — [ice-cream-purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase-detail.entity.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchaseDetail.sku`

- **Firma:** `sku(): string` — [ice-cream-purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase-detail.entity.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchaseDetail.quantity`

- **Firma:** `quantity(): number` — [ice-cream-purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase-detail.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchaseDetail.costPrice`

- **Firma:** `costPrice(): number` — [ice-cream-purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase-detail.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchaseDetail.total`

- **Firma:** `total(): number` — [ice-cream-purchase-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase-detail.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-purchase-entity-ts"></a>

### ice-cream-purchase.entity.ts

- **Ruta:** [ice-cream-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase.entity.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase.entity.ts`, 63 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Entidad de dominio: declara `IceCreamPurchase`, `IceCreamPurchaseProps` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-purchase-detail.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-purchase-detail-entity-ts)
- **Consumidores:** [ice-cream-purchase-output.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-purchase-output-ts), [ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-purchase-repository-ts), [ice-cream-purchase.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-mapper-ts), [typeorm-ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamPurchaseProps` (L3): sin documentación — miembros: `id`, `supplierId`, `supplierName`, `userId`, `username`, `purchaseDate`, `total`, `items`, `createdAt`, `updatedAt`

#### Clase `IceCreamPurchase` (L16–62)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: IceCreamPurchaseProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 19–21 | `props: IceCreamPurchaseProps` | `IceCreamPurchase` |
| `id` | getter public | 23–25 | — | `string` |
| `supplierId` | getter public | 27–29 | — | `string` |
| `supplierName` | getter public | 31–33 | — | `string` |
| `userId` | getter public | 35–37 | — | `string` |
| `username` | getter public | 39–41 | — | `string` |
| `purchaseDate` | getter public | 43–45 | — | `Date` |
| `total` | getter public | 47–49 | — | `number` |
| `items` | getter public | 51–53 | — | `IceCreamPurchaseDetail[]` |
| `createdAt` | getter public | 55–57 | — | `Date` |
| `updatedAt` | getter public | 59–61 | — | `Date` |

##### `IceCreamPurchase.create`

- **Firma:** `create(props: IceCreamPurchaseProps): IceCreamPurchase` — [ice-cream-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase.entity.ts#L19) (L19–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new IceCreamPurchase`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [ice-cream-purchase.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-mapper-ts)

##### `IceCreamPurchase.id`

- **Firma:** `id(): string` — [ice-cream-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase.entity.ts#L23) (L23–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchase.supplierId`

- **Firma:** `supplierId(): string` — [ice-cream-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase.entity.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchase.supplierName`

- **Firma:** `supplierName(): string` — [ice-cream-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase.entity.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchase.userId`

- **Firma:** `userId(): string` — [ice-cream-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchase.username`

- **Firma:** `username(): string` — [ice-cream-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchase.purchaseDate`

- **Firma:** `purchaseDate(): Date` — [ice-cream-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchase.total`

- **Firma:** `total(): number` — [ice-cream-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchase.items`

- **Firma:** `items(): IceCreamPurchaseDetail[]` — [ice-cream-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchase.createdAt`

- **Firma:** `createdAt(): Date` — [ice-cream-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchase.updatedAt`

- **Firma:** `updatedAt(): Date` — [ice-cream-purchase.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-purchase.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-sale-detail-entity-ts"></a>

### ice-cream-sale-detail.entity.ts

- **Ruta:** [ice-cream-sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale-detail.entity.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale-detail.entity.ts`, 47 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** A frozen line item — `unitPrice`/`total` are the helado's public price at the moment of sale, never recomputed from the live helado.
- **Consumidores:** [ice-cream-sale.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-sale-entity-ts), [ice-cream-sale.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-mapper-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamSaleDetailProps` (L1): sin documentación — miembros: `id`, `iceCreamId`, `product`, `sku`, `quantity`, `unitPrice`, `total`

#### Clase `IceCreamSaleDetail` (L12–46)

- **Propósito:** A frozen line item — `unitPrice`/`total` are the helado's public price at the moment of sale, never recomputed from the live helado.
- **Dependencias inyectadas (constructor):** `props: IceCreamSaleDetailProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 15–17 | `props: IceCreamSaleDetailProps` | `IceCreamSaleDetail` |
| `id` | getter public | 19–21 | — | `string` |
| `iceCreamId` | getter public | 23–25 | — | `string` |
| `product` | getter public | 27–29 | — | `string` |
| `sku` | getter public | 31–33 | — | `string` |
| `quantity` | getter public | 35–37 | — | `number` |
| `unitPrice` | getter public | 39–41 | — | `number` |
| `total` | getter public | 43–45 | — | `number` |

##### `IceCreamSaleDetail.create`

- **Firma:** `create(props: IceCreamSaleDetailProps): IceCreamSaleDetail` — [ice-cream-sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale-detail.entity.ts#L15) (L15–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new IceCreamSaleDetail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [ice-cream-sale.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-mapper-ts)

##### `IceCreamSaleDetail.id`

- **Firma:** `id(): string` — [ice-cream-sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale-detail.entity.ts#L19) (L19–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSaleDetail.iceCreamId`

- **Firma:** `iceCreamId(): string` — [ice-cream-sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale-detail.entity.ts#L23) (L23–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSaleDetail.product`

- **Firma:** `product(): string` — [ice-cream-sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale-detail.entity.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSaleDetail.sku`

- **Firma:** `sku(): string` — [ice-cream-sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale-detail.entity.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSaleDetail.quantity`

- **Firma:** `quantity(): number` — [ice-cream-sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale-detail.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSaleDetail.unitPrice`

- **Firma:** `unitPrice(): number` — [ice-cream-sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale-detail.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSaleDetail.total`

- **Firma:** `total(): number` — [ice-cream-sale-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale-detail.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-sale-entity-ts"></a>

### ice-cream-sale.entity.ts

- **Ruta:** [ice-cream-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale.entity.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale.entity.ts`, 61 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Structural clone of `Sale`, but bulk one-shot only — no `status` (OPEN/CONFIRMED) field and no real-time draft/reservation flow like the main Sales module's `adjust_sale_item`/`cancel_open_sale`.
- **Depende de (archivos del proyecto):** [ice-cream-sale-detail.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-sale-detail-entity-ts)
- **Consumidores:** [ice-cream-sale-output.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-sale-output-ts), [ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-sale-repository-ts), [ice-cream-sale.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-mapper-ts), [typeorm-ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-sale-repository-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamSaleProps` (L11): Structural clone of `Sale`, but bulk one-shot only — no `status` (OPEN/CONFIRMED) field and no real-time draft/reservation flow like the main Sales module's `adjust_sale_item`/`cancel_open_sale`. — miembros: `id`, `userId`, `username`, `saleDate`, `total`, `items`, `createdAt`, `updatedAt`

#### Clase `IceCreamSale` (L22–60)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: IceCreamSaleProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 25–27 | `props: IceCreamSaleProps` | `IceCreamSale` |
| `id` | getter public | 29–31 | — | `string` |
| `userId` | getter public | 33–35 | — | `string` |
| `username` | getter public | 37–39 | — | `string` |
| `saleDate` | getter public | 41–43 | — | `Date` |
| `total` | getter public | 45–47 | — | `number` |
| `items` | getter public | 49–51 | — | `IceCreamSaleDetail[]` |
| `createdAt` | getter public | 53–55 | — | `Date` |
| `updatedAt` | getter public | 57–59 | — | `Date` |

##### `IceCreamSale.create`

- **Firma:** `create(props: IceCreamSaleProps): IceCreamSale` — [ice-cream-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale.entity.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new IceCreamSale`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [ice-cream-sale.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-mapper-ts)

##### `IceCreamSale.id`

- **Firma:** `id(): string` — [ice-cream-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale.entity.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSale.userId`

- **Firma:** `userId(): string` — [ice-cream-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSale.username`

- **Firma:** `username(): string` — [ice-cream-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSale.saleDate`

- **Firma:** `saleDate(): Date` — [ice-cream-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSale.total`

- **Firma:** `total(): number` — [ice-cream-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSale.items`

- **Firma:** `items(): IceCreamSaleDetail[]` — [ice-cream-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSale.createdAt`

- **Firma:** `createdAt(): Date` — [ice-cream-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale.entity.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSale.updatedAt`

- **Firma:** `updatedAt(): Date` — [ice-cream-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream-sale.entity.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-entity-ts"></a>

### ice-cream.entity.ts

- **Ruta:** [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts`, 90 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** "Heladería" inventory — structurally a clone of `Product` (sku/name unique-only-among-active via the identical partial-unique-index pattern, same cost/public price columns, same soft delete), but backed by its own entirely separate `ice_creams` table/module, not a row in `products` scoped by a "Heladería" `businessId`.
- **Descripción del autor (comentario del archivo):** "Heladería" inventory — structurally a clone of `Product` (sku/name unique-only-among-active via the identical partial-unique-index pattern, same cost/public price columns, same soft delete), but backed by its own entirely separate `ice_creams` table/module, not a row in `products` scoped by a "Heladería" `businessId`. Worth knowing: the `businesses` module exists specifically to let a line of business like Heladería share the one `products` catalog (see that module's own docs, which name Heladería as an example addable business), but this module was built as a fully independent catalog/sales/
- **Consumidores:** [ice-cream-output.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-dtos-ice-cream-output-ts), [ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-repository-ts), [ice-cream.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-mapper-ts), [typeorm-ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-repository-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamProps` (L15): "Heladería" inventory — structurally a clone of `Product` (sku/name unique-only-among-active via the identical partial-unique-index pattern, same cost/public price columns, same soft delete), but backed by its own entirely separate `ice_creams` table/module, not a row in `products` scoped by a "Heladería" `businessId`. — miembros: `id`, `sku`, `product`, `costPrice`, `publicPrice`, `stock`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`

#### Clase `IceCream` (L31–89)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: IceCreamProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 34–36 | `props: IceCreamProps` | `IceCream` |
| `id` | getter public | 38–40 | — | `string` |
| `sku` | getter public | 42–44 | — | `string` |
| `product` | getter public | 46–48 | — | `string` |
| `costPrice` | getter public | 50–52 | — | `number` |
| `publicPrice` | getter public | 54–56 | — | `number` |
| `stock` | getter public | 58–60 | — | `number` |
| `isActive` | getter public | 62–64 | — | `boolean` |
| `createdAt` | getter public | 66–68 | — | `Date` |
| `updatedAt` | getter public | 70–72 | — | `Date` |
| `createdBy` | getter public | 74–76 | — | `string` |
| `createdByUsername` | getter public | 78–80 | — | `string` |
| `updatedBy` | getter public | 82–84 | — | `string \| null` |
| `updatedByUsername` | getter public | 86–88 | — | `string \| null` |

##### `IceCream.create`

- **Firma:** `create(props: IceCreamProps): IceCream` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new IceCream`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [ice-cream.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-mapper-ts), [typeorm-ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-repository-ts)

##### `IceCream.id`

- **Firma:** `id(): string` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCream.sku`

- **Firma:** `sku(): string` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCream.product`

- **Firma:** `product(): string` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCream.costPrice`

- **Firma:** `costPrice(): number` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCream.publicPrice`

- **Firma:** `publicPrice(): number` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCream.stock`

- **Firma:** `stock(): number` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCream.isActive`

- **Firma:** `isActive(): boolean` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L62) (L62–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCream.createdAt`

- **Firma:** `createdAt(): Date` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L66) (L66–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCream.updatedAt`

- **Firma:** `updatedAt(): Date` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L70) (L70–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCream.createdBy`

- **Firma:** `createdBy(): string` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCream.createdByUsername`

- **Firma:** `createdByUsername(): string` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCream.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCream.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [ice-cream.entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/entities/ice-cream.entity.ts#L86) (L86–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-inactive-error-ts"></a>

### ice-cream-inactive.error.ts

- **Ruta:** [ice-cream-inactive.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-inactive.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-inactive.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Errores de dominio: declara `IceCreamInactiveError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts), [typeorm-ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-sale-repository-ts)

#### Clase `IceCreamInactiveError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `iceCreamId: string`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-name-already-exists-error-ts"></a>

### ice-cream-name-already-exists.error.ts

- **Ruta:** [ice-cream-name-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-name-already-exists.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-name-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Errores de dominio: declara `IceCreamNameAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-use-case-ts), [update-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-update-ice-cream-use-case-ts), [typeorm-ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-repository-ts)

#### Clase `IceCreamNameAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `name: string`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-not-found-error-ts"></a>

### ice-cream-not-found.error.ts

- **Ruta:** [ice-cream-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-not-found.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Errores de dominio: declara `IceCreamNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-deactivate-ice-cream-use-case-ts), [get-ice-cream-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-by-id-use-case-ts), [update-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-update-ice-cream-use-case-ts), [typeorm-ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts), [typeorm-ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-sale-repository-ts)

#### Clase `IceCreamNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-purchase-access-denied-error-ts"></a>

### ice-cream-purchase-access-denied.error.ts

- **Ruta:** [ice-cream-purchase-access-denied.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-purchase-access-denied.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-purchase-access-denied.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** A USER account trying to view an ice cream purchase that isn't theirs — ADMIN/SUPER_ADMIN can view any purchase.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-ice-cream-purchase-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-purchase-by-id-use-case-ts)

#### Clase `IceCreamPurchaseAccessDeniedError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** A USER account trying to view an ice cream purchase that isn't theirs — ADMIN/SUPER_ADMIN can view any purchase.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-purchase-empty-error-ts"></a>

### ice-cream-purchase-empty.error.ts

- **Ruta:** [ice-cream-purchase-empty.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-purchase-empty.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-purchase-empty.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Errores de dominio: declara `IceCreamPurchaseEmptyError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-ice-cream-purchase.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-purchase-use-case-ts), [typeorm-ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts)

#### Clase `IceCreamPurchaseEmptyError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-purchase-not-found-error-ts"></a>

### ice-cream-purchase-not-found.error.ts

- **Ruta:** [ice-cream-purchase-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-purchase-not-found.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-purchase-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Errores de dominio: declara `IceCreamPurchaseNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-ice-cream-purchase-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-purchase-by-id-use-case-ts)

#### Clase `IceCreamPurchaseNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sale-access-denied-error-ts"></a>

### ice-cream-sale-access-denied.error.ts

- **Ruta:** [ice-cream-sale-access-denied.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-sale-access-denied.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-sale-access-denied.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** A USER account trying to view an ice cream sale that isn't theirs — ADMIN/SUPER_ADMIN can view any sale.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-ice-cream-sale-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-sale-by-id-use-case-ts)

#### Clase `IceCreamSaleAccessDeniedError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** A USER account trying to view an ice cream sale that isn't theirs — ADMIN/SUPER_ADMIN can view any sale.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sale-empty-error-ts"></a>

### ice-cream-sale-empty.error.ts

- **Ruta:** [ice-cream-sale-empty.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-sale-empty.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-sale-empty.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Errores de dominio: declara `IceCreamSaleEmptyError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-ice-cream-sale.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-sale-use-case-ts), [typeorm-ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-sale-repository-ts)

#### Clase `IceCreamSaleEmptyError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sale-not-found-error-ts"></a>

### ice-cream-sale-not-found.error.ts

- **Ruta:** [ice-cream-sale-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-sale-not-found.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-sale-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Errores de dominio: declara `IceCreamSaleNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-ice-cream-sale-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-sale-by-id-use-case-ts)

#### Clase `IceCreamSaleNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sku-already-exists-error-ts"></a>

### ice-cream-sku-already-exists.error.ts

- **Ruta:** [ice-cream-sku-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-sku-already-exists.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/ice-cream-sku-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Errores de dominio: declara `IceCreamSkuAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-use-case-ts), [update-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-update-ice-cream-use-case-ts), [typeorm-ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-repository-ts)

#### Clase `IceCreamSkuAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `sku: string`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-insufficient-ice-cream-stock-error-ts"></a>

### insufficient-ice-cream-stock.error.ts

- **Ruta:** [insufficient-ice-cream-stock.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/insufficient-ice-cream-stock.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/insufficient-ice-cream-stock.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Errores de dominio: declara `InsufficientIceCreamStockError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-sale-repository-ts)

#### Clase `InsufficientIceCreamStockError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `iceCreamId: string`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-price-error-ts"></a>

### invalid-ice-cream-price.error.ts

- **Ruta:** [invalid-ice-cream-price.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/invalid-ice-cream-price.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/invalid-ice-cream-price.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Errores de dominio: declara `InvalidIceCreamPriceError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-ice-cream-purchase.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-purchase-use-case-ts), [typeorm-ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts)

#### Clase `InvalidIceCreamPriceError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `iceCreamId: string`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-purchase-date-error-ts"></a>

### invalid-ice-cream-purchase-date.error.ts

- **Ruta:** [invalid-ice-cream-purchase-date.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/invalid-ice-cream-purchase-date.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/invalid-ice-cream-purchase-date.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Errores de dominio: declara `InvalidIceCreamPurchaseDateError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-ice-cream-purchase.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-purchase-use-case-ts)

#### Clase `InvalidIceCreamPurchaseDateError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-quantity-error-ts"></a>

### invalid-ice-cream-quantity.error.ts

- **Ruta:** [invalid-ice-cream-quantity.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/invalid-ice-cream-quantity.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/invalid-ice-cream-quantity.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Errores de dominio: declara `InvalidIceCreamQuantityError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-ice-cream-purchase.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-purchase-use-case-ts), [create-ice-cream-sale.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-sale-use-case-ts), [typeorm-ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts), [typeorm-ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-sale-repository-ts)

#### Clase `InvalidIceCreamQuantityError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `iceCreamId: string`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-supplier-error-ts"></a>

### invalid-ice-cream-supplier.error.ts

- **Ruta:** [invalid-ice-cream-supplier.error.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/errors/invalid-ice-cream-supplier.error.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/errors/invalid-ice-cream-supplier.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Errores de dominio: declara `InvalidIceCreamSupplierError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts)

#### Clase `InvalidIceCreamSupplierError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-purchase-repository-ts"></a>

### ice-cream-purchase.repository.ts

- **Ruta:** [ice-cream-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/repositories/ice-cream-purchase.repository.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/repositories/ice-cream-purchase.repository.ts`, 49 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `IceCreamPurchaseItemData`, `ConfirmIceCreamPurchaseData`, `FindIceCreamPurchasesOptions`, `PaginatedResult`, `IceCreamPurchaseRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-purchase.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-purchase-entity-ts)
- **Consumidores:** [create-ice-cream-purchase.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-purchase-use-case-ts), [get-ice-cream-purchase-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-purchase-by-id-use-case-ts), [list-ice-cream-purchases.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-cream-purchases-use-case-ts), [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [typeorm-ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts), [list-ice-cream-purchases.query.dto.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-list-ice-cream-purchases-query-dto-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamPurchaseItemData` (L7): sin documentación — miembros: `iceCreamId`, `quantity`, `costPrice`
- `interface ConfirmIceCreamPurchaseData` (L13): sin documentación — miembros: `supplierId`, `userId`, `purchaseDate`, `items`
- `interface FindIceCreamPurchasesOptions` (L23): sin documentación — miembros: `userId`, `supplierId`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface PaginatedResult` (L33): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface IceCreamPurchaseRepository` (L40): sin documentación — miembros: `confirmPurchase`, `findAll`, `findById`
- `type IceCreamPurchaseSortField` (L20) = `'purchaseDate' \| 'total' \| 'createdAt'`
- `type SortDirection` (L21) = `'asc' \| 'desc'`

**Constantes exportadas:**

- `ICE_CREAM_PURCHASE_REPOSITORY` (L3) = `Symbol( 'ICE_CREAM_PURCHASE_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-sale-repository-ts"></a>

### ice-cream-sale.repository.ts

- **Ruta:** [ice-cream-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/repositories/ice-cream-sale.repository.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/repositories/ice-cream-sale.repository.ts`, 42 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `IceCreamSaleItemData`, `ConfirmIceCreamSaleData`, `FindIceCreamSalesOptions`, `PaginatedResult`, `IceCreamSaleRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-sale.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-sale-entity-ts)
- **Consumidores:** [create-ice-cream-sale.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-sale-use-case-ts), [get-ice-cream-sale-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-sale-by-id-use-case-ts), [list-ice-cream-sales.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-cream-sales-use-case-ts), [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [typeorm-ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-sale-repository-ts), [list-ice-cream-sales.query.dto.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-list-ice-cream-sales-query-dto-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamSaleItemData` (L5): sin documentación — miembros: `iceCreamId`, `quantity`
- `interface ConfirmIceCreamSaleData` (L10): sin documentación — miembros: `userId`, `items`
- `interface FindIceCreamSalesOptions` (L18): sin documentación — miembros: `userId`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface PaginatedResult` (L27): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface IceCreamSaleRepository` (L34): sin documentación — miembros: `confirmSale`, `findAll`, `findById`
- `type IceCreamSaleSortField` (L15) = `'saleDate' \| 'total' \| 'createdAt'`
- `type SortDirection` (L16) = `'asc' \| 'desc'`

**Constantes exportadas:**

- `ICE_CREAM_SALE_REPOSITORY` (L3) = `Symbol('ICE_CREAM_SALE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-repository-ts"></a>

### ice-cream.repository.ts

- **Ruta:** [ice-cream.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/repositories/ice-cream.repository.ts) (`comercial-jhoel-api/src/modules/ice-creams/domain/repositories/ice-cream.repository.ts`, 53 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `FindIceCreamsOptions`, `PaginatedResult`, `CreateIceCreamData`, `UpdateIceCreamData`, `IceCreamRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-entity-ts)
- **Consumidores:** [create-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-use-case-ts), [deactivate-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-deactivate-ice-cream-use-case-ts), [get-ice-cream-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-by-id-use-case-ts), [list-ice-creams.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-creams-use-case-ts), [update-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-update-ice-cream-use-case-ts), [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [typeorm-ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-repository-ts), [list-ice-creams.query.dto.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-list-ice-creams-query-dto-ts), [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts)

**Interfaces, tipos y enums:**

- `interface FindIceCreamsOptions` (L9): sin documentación — miembros: `activeOnly`, `search`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface PaginatedResult` (L18): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface CreateIceCreamData` (L25): sin documentación — miembros: `sku`, `product`, `costPrice`, `publicPrice`, `stock`, `createdBy`
- `interface UpdateIceCreamData` (L34): sin documentación — miembros: `sku`, `product`, `costPrice`, `publicPrice`, `stock`, `updatedBy`
- `interface IceCreamRepository` (L44): Structural clone of `ProductRepository` — `findByActiveSku`/`findByActiveProduct` back the same partial-unique-active uniqueness checks `CreateProductUseCase`/`UpdateProductUseCase` run for `sku`/`name`. — miembros: `findAll`, `findById`, `findByActiveSku`, `findByActiveProduct`, `create`, `update`, `deactivate`
- `type IceCreamSortField` (L5) = `'product' \| 'sku' \| 'costPrice' \| 'publicPrice' \| 'stock' \| 'createdAt'`
- `type SortDirection` (L7) = `'asc' \| 'desc'`

**Constantes exportadas:**

- `ICE_CREAM_REPOSITORY` (L3) = `Symbol('ICE_CREAM_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts"></a>

### ice-creams.module.ts

- **Ruta:** [ice-creams.module.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/ice-creams.module.ts) (`comercial-jhoel-api/src/modules/ice-creams/ice-creams.module.ts`, 75 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Módulo: declara `IceCreamsModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-orm-entity-ts), [ice-cream-purchase.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-orm-entity-ts), [ice-cream-purchase-detail.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-detail-orm-entity-ts), [ice-cream-sale.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-orm-entity-ts), [ice-cream-sale-detail.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-detail-orm-entity-ts), [typeorm-ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-repository-ts), [typeorm-ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts), [typeorm-ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-sale-repository-ts), [ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-repository-ts), [ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-purchase-repository-ts), [ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-sale-repository-ts), [create-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-use-case-ts), [list-ice-creams.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-creams-use-case-ts), [get-ice-cream-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-by-id-use-case-ts), [update-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-update-ice-cream-use-case-ts) y 10 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `IceCreamsModule` (L29–74)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([ IceCreamOrmEntity, IceCreamPurchaseOrmEntity, IceCreamPurchaseDetailOrmEntity, IceCreamSaleOrmEntity, IceCreamSal`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-detail-orm-entity-ts"></a>

### ice-cream-purchase-detail.orm-entity.ts

- **Ruta:** [ice-cream-purchase-detail.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-purchase-detail.orm-entity.ts) (`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-purchase-detail.orm-entity.ts`, 54 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `IceCreamPurchaseDetailOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [ice-cream-purchase.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-cream-purchase.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-orm-entity-ts), [typeorm-ice-cream-purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-ice-cream-purchases-report-repository-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `IceCreamPurchaseDetailOrmEntity` (L12–53)

- **Decoradores:** `@Entity('ice_cream_purchase_details')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column purchaseId: string`, `@ManyToOne purchase: IceCreamPurchaseOrmEntity`, `@Column iceCreamId: string`, `@ManyToOne iceCream: IceCreamOrmEntity`, `@Column quantity: number`, `@Column costPrice: number`, `@Column subtotal: number`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-mapper-ts"></a>

### ice-cream-purchase.mapper.ts

- **Ruta:** [ice-cream-purchase.mapper.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-purchase.mapper.ts) (`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-purchase.mapper.ts`, 32 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Mapper: declara `IceCreamPurchaseMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-purchase.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-purchase-entity-ts), [ice-cream-purchase-detail.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-purchase-detail-entity-ts), [ice-cream-purchase.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-orm-entity-ts)
- **Consumidores:** [typeorm-ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts)

#### Clase `IceCreamPurchaseMapper` (L5–31)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 7–30 | `orm: IceCreamPurchaseOrmEntity` | `IceCreamPurchase` |

##### `IceCreamPurchaseMapper.toDomain`

- **Firma:** `toDomain(orm: IceCreamPurchaseOrmEntity): IceCreamPurchase` — [ice-cream-purchase.mapper.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-purchase.mapper.ts#L7) (L7–30)
- **Propósito / descripción:** `orm.items` is `undefined` whenever the query didn't join `ice_cream_purchase_details` (the list view never does) — mapped to `[]`.
- **Dependencias (llamadas en su cuerpo):** `IceCreamPurchase.create`, `(orm.items ?? []).map`, `IceCreamPurchaseDetail.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-orm-entity-ts"></a>

### ice-cream-purchase.orm-entity.ts

- **Ruta:** [ice-cream-purchase.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-purchase.orm-entity.ts) (`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-purchase.orm-entity.ts`, 55 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `IceCreamPurchaseOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [supplier.orm-entity.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-infrastructure-persistence-supplier-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [ice-cream-purchase-detail.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-detail-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-cream-purchase-detail.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-detail-orm-entity-ts), [ice-cream-purchase.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-mapper-ts), [typeorm-ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts)

#### Clase `IceCreamPurchaseOrmEntity` (L16–54)

- **Decoradores:** `@Entity('ice_cream_purchases')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column supplierId: string`, `@ManyToOne supplier: SupplierOrmEntity`, `@Column userId: string`, `@ManyToOne user: UserOrmEntity`, `@Column purchaseDate: Date`, `@Column total: number`, `@OneToMany items: IceCreamPurchaseDetailOrmEntity[]`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-detail-orm-entity-ts"></a>

### ice-cream-sale-detail.orm-entity.ts

- **Ruta:** [ice-cream-sale-detail.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-sale-detail.orm-entity.ts) (`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-sale-detail.orm-entity.ts`, 54 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `IceCreamSaleDetailOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [ice-cream-sale.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-cream-sale.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-orm-entity-ts), [typeorm-ice-cream-sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-ice-cream-sales-report-repository-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `IceCreamSaleDetailOrmEntity` (L12–53)

- **Decoradores:** `@Entity('ice_cream_sale_details')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column saleId: string`, `@ManyToOne sale: IceCreamSaleOrmEntity`, `@Column iceCreamId: string`, `@ManyToOne iceCream: IceCreamOrmEntity`, `@Column quantity: number`, `@Column unitPrice: number`, `@Column total: number`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-mapper-ts"></a>

### ice-cream-sale.mapper.ts

- **Ruta:** [ice-cream-sale.mapper.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-sale.mapper.ts) (`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-sale.mapper.ts`, 30 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Mapper: declara `IceCreamSaleMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-sale.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-sale-entity-ts), [ice-cream-sale-detail.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-sale-detail-entity-ts), [ice-cream-sale.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-orm-entity-ts)
- **Consumidores:** [typeorm-ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-sale-repository-ts)

#### Clase `IceCreamSaleMapper` (L5–29)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 7–28 | `orm: IceCreamSaleOrmEntity` | `IceCreamSale` |

##### `IceCreamSaleMapper.toDomain`

- **Firma:** `toDomain(orm: IceCreamSaleOrmEntity): IceCreamSale` — [ice-cream-sale.mapper.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-sale.mapper.ts#L7) (L7–28)
- **Propósito / descripción:** `orm.items` is `undefined` whenever the query didn't join `ice_cream_sale_details` (the list view never does) — mapped to `[]`.
- **Dependencias (llamadas en su cuerpo):** `IceCreamSale.create`, `(orm.items ?? []).map`, `IceCreamSaleDetail.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-sale-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-orm-entity-ts"></a>

### ice-cream-sale.orm-entity.ts

- **Ruta:** [ice-cream-sale.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-sale.orm-entity.ts) (`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream-sale.orm-entity.ts`, 47 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `IceCreamSaleOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [ice-cream-sale-detail.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-detail-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-cream-sale-detail.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-detail-orm-entity-ts), [ice-cream-sale.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-mapper-ts), [typeorm-ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-sale-repository-ts)

#### Clase `IceCreamSaleOrmEntity` (L15–46)

- **Decoradores:** `@Entity('ice_cream_sales')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column userId: string`, `@ManyToOne user: UserOrmEntity`, `@Column saleDate: Date`, `@Column total: number`, `@OneToMany items: IceCreamSaleDetailOrmEntity[]`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-mapper-ts"></a>

### ice-cream.mapper.ts

- **Ruta:** [ice-cream.mapper.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream.mapper.ts) (`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream.mapper.ts`, 23 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Mapper: declara `IceCreamMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-entity-ts), [ice-cream.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-orm-entity-ts)
- **Consumidores:** [typeorm-ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-repository-ts)

#### Clase `IceCreamMapper` (L4–22)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–21 | `orm: IceCreamOrmEntity` | `IceCream` |

##### `IceCreamMapper.toDomain`

- **Firma:** `toDomain(orm: IceCreamOrmEntity): IceCream` — [ice-cream.mapper.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream.mapper.ts#L5) (L5–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `IceCream.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-orm-entity-ts"></a>

### ice-cream.orm-entity.ts

- **Ruta:** [ice-cream.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream.orm-entity.ts) (`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/ice-cream.orm-entity.ts`, 81 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `IceCreamOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [ice-cream-purchase-detail.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-detail-orm-entity-ts), [ice-cream-sale-detail.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-detail-orm-entity-ts), [ice-cream.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-mapper-ts), [typeorm-ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-repository-ts)

#### Clase `IceCreamOrmEntity` (L17–80)

- **Decoradores:** `@Entity('ice_creams')` `@Index('UQ_ice_creams_sku_active', ['sku'], { unique: true, where: '"is_active" = true', })` `@Index('UQ_ice_creams_product_active', ['product'], { unique: true, where: '"is_active" = true', })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column sku: string`, `@Column product: string`, `@Column costPrice: number`, `@Column publicPrice: number`, `@Column stock: number`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-purchase-repository-ts"></a>

### typeorm-ice-cream-purchase.repository.ts

- **Ruta:** [typeorm-ice-cream-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-purchase.repository.ts) (`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-purchase.repository.ts`, 139 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmIceCreamPurchaseRepository`, `SORT_COLUMN` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-purchase.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-purchase-entity-ts), [ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-purchase-repository-ts), [ice-cream-purchase-empty.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-purchase-empty-error-ts), [invalid-ice-cream-supplier.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-supplier-error-ts), [ice-cream-not-found.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-not-found-error-ts), [ice-cream-inactive.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-inactive-error-ts), [invalid-ice-cream-quantity.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-quantity-error-ts), [invalid-ice-cream-price.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-price-error-ts), [ice-cream-purchase.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-orm-entity-ts), [ice-cream-purchase.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts)

#### Clase `TypeOrmIceCreamPurchaseRepository` (L27–138)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements IceCreamPurchaseRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(IceCreamPurchaseOrmEntity) repository: Repository<IceCreamPurchaseOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `confirmPurchase` | método public async | 34–67 | `data: ConfirmIceCreamPurchaseData` | `Promise<IceCreamPurchase>` |
| `findAll` | método public async | 69–99 | `options: FindIceCreamPurchasesOptions` | `Promise<PaginatedResult<IceCreamPurchase>>` |
| `findById` | método public async | 101–107 | `id: string` | `Promise<IceCreamPurchase \| null>` |
| `translatePurchaseError` | método private | 110–137 | `error: unknown` | `unknown` |

##### `TypeOrmIceCreamPurchaseRepository.confirmPurchase`

- **Firma:** `confirmPurchase(data: ConfirmIceCreamPurchaseData): Promise<IceCreamPurchase>` — [typeorm-ice-cream-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-purchase.repository.ts#L34) (L34–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `JSON.stringify`, `data.items.map`, `this.repository.manager.query`, `this.translatePurchaseError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `confirm_ice_cream_purchase`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translatePurchaseError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la compra recién creada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamPurchaseRepository.findAll`

- **Firma:** `findAll(options: FindIceCreamPurchasesOptions): Promise<PaginatedResult<IceCreamPurchase>>` — [typeorm-ice-cream-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-purchase.repository.ts#L69) (L69–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('purchase').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `orms.map`, `IceCreamPurchaseMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamPurchaseRepository.findById`

- **Firma:** `findById(id: string): Promise<IceCreamPurchase \| null>` — [typeorm-ice-cream-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-purchase.repository.ts#L101) (L101–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `IceCreamPurchaseMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmIceCreamPurchaseRepository.translatePurchaseError`

- **Firma:** `translatePurchaseError(error: unknown): unknown` — [typeorm-ice-cream-purchase.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-purchase.repository.ts#L110) (L110–137)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;iceCreamId&gt;'` → domain-error translation pattern as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new IceCreamPurchaseEmptyError`, `new InvalidIceCreamSupplierError`, `new IceCreamNotFoundError`, `new IceCreamInactiveError`, `new InvalidIceCreamQuantityError`, `new InvalidIceCreamPriceError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-sale-repository-ts"></a>

### typeorm-ice-cream-sale.repository.ts

- **Ruta:** [typeorm-ice-cream-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-sale.repository.ts) (`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-sale.repository.ts`, 124 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmIceCreamSaleRepository`, `SORT_COLUMN` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-sale.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-sale-entity-ts), [ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-sale-repository-ts), [ice-cream-sale-empty.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sale-empty-error-ts), [ice-cream-not-found.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-not-found-error-ts), [ice-cream-inactive.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-inactive-error-ts), [invalid-ice-cream-quantity.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-invalid-ice-cream-quantity-error-ts), [insufficient-ice-cream-stock.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-insufficient-ice-cream-stock-error-ts), [ice-cream-sale.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-orm-entity-ts), [ice-cream-sale.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts)

#### Clase `TypeOrmIceCreamSaleRepository` (L26–123)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements IceCreamSaleRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(IceCreamSaleOrmEntity) repository: Repository<IceCreamSaleOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `confirmSale` | método public async | 33–61 | `data: ConfirmIceCreamSaleData` | `Promise<IceCreamSale>` |
| `findAll` | método public async | 63–87 | `options: FindIceCreamSalesOptions` | `Promise<PaginatedResult<IceCreamSale>>` |
| `findById` | método public async | 89–95 | `id: string` | `Promise<IceCreamSale \| null>` |
| `translateSaleError` | método private | 98–122 | `error: unknown` | `unknown` |

##### `TypeOrmIceCreamSaleRepository.confirmSale`

- **Firma:** `confirmSale(data: ConfirmIceCreamSaleData): Promise<IceCreamSale>` — [typeorm-ice-cream-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-sale.repository.ts#L33) (L33–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `JSON.stringify`, `data.items.map`, `this.repository.manager.query`, `this.translateSaleError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `confirm_ice_cream_sale`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateSaleError(error)`, `new InternalServerErrorException( 'No se pudo recuperar la venta recién creada.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamSaleRepository.findAll`

- **Firma:** `findAll(options: FindIceCreamSalesOptions): Promise<PaginatedResult<IceCreamSale>>` — [typeorm-ice-cream-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-sale.repository.ts#L63) (L63–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('sale').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `orms.map`, `IceCreamSaleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamSaleRepository.findById`

- **Firma:** `findById(id: string): Promise<IceCreamSale \| null>` — [typeorm-ice-cream-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-sale.repository.ts#L89) (L89–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `IceCreamSaleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmIceCreamSaleRepository.translateSaleError`

- **Firma:** `translateSaleError(error: unknown): unknown` — [typeorm-ice-cream-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-sale.repository.ts#L98) (L98–122)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;iceCreamId&gt;'` → domain-error translation pattern as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new IceCreamSaleEmptyError`, `new IceCreamNotFoundError`, `new IceCreamInactiveError`, `new InvalidIceCreamQuantityError`, `new InsufficientIceCreamStockError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-typeorm-ice-cream-repository-ts"></a>

### typeorm-ice-cream.repository.ts

- **Ruta:** [typeorm-ice-cream.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts) (`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts`, 140 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmIceCreamRepository`, `SORT_COLUMN` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream.entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-entities-ice-cream-entity-ts), [ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-repository-ts), [ice-cream-name-already-exists.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-name-already-exists-error-ts), [ice-cream-sku-already-exists.error.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-errors-ice-cream-sku-already-exists-error-ts), [ice-cream.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-orm-entity-ts), [ice-cream.mapper.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts)

#### Clase `TypeOrmIceCreamRepository` (L27–139)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements IceCreamRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(IceCreamOrmEntity) repository: Repository<IceCreamOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 34–64 | `options: FindIceCreamsOptions` | `Promise<PaginatedResult<IceCream>>` |
| `findById` | método public async | 66–69 | `id: string` | `Promise<IceCream \| null>` |
| `findByActiveSku` | método public async | 71–76 | `sku: string` | `Promise<IceCream \| null>` |
| `findByActiveProduct` | método public async | 78–83 | `product: string` | `Promise<IceCream \| null>` |
| `create` | método public async | 85–103 | `data: CreateIceCreamData` | `Promise<IceCream>` |
| `update` | método public async | 105–114 | `id: string`, `data: UpdateIceCreamData` | `Promise<IceCream>` |
| `deactivate` | método public async | 116–118 | `id: string` | `Promise<void>` |
| `translateUniqueViolation` | método private | 121–138 | `error: unknown`, `product: string`, `sku?: string` | `unknown` |

##### `TypeOrmIceCreamRepository.findAll`

- **Firma:** `findAll(options: FindIceCreamsOptions): Promise<PaginatedResult<IceCream>>` — [typeorm-ice-cream.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts#L34) (L34–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `orms.map`, `IceCreamMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamRepository.findById`

- **Firma:** `findById(id: string): Promise<IceCream \| null>` — [typeorm-ice-cream.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts#L66) (L66–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `IceCreamMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamRepository.findByActiveSku`

- **Firma:** `findByActiveSku(sku: string): Promise<IceCream \| null>` — [typeorm-ice-cream.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts#L71) (L71–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `IceCreamMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamRepository.findByActiveProduct`

- **Firma:** `findByActiveProduct(product: string): Promise<IceCream \| null>` — [typeorm-ice-cream.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts#L78) (L78–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `IceCreamMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamRepository.create`

- **Firma:** `create(data: CreateIceCreamData): Promise<IceCream>` — [typeorm-ice-cream.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts#L85) (L85–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `IceCreamMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data.product, data.sku)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamRepository.update`

- **Firma:** `update(id: string, data: UpdateIceCreamData): Promise<IceCream>` — [typeorm-ice-cream.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts#L105) (L105–114)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `IceCreamMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation(error, data.product ?? '', data.sku)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-ice-cream.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts#L116) (L116–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, product: string, sku?: string): unknown` — [typeorm-ice-cream.repository.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts#L121) (L121–138)
- **Propósito / descripción:** Same DB-level-uniqueness-as-race-safety-net pattern as `TypeOrmProductRepository`'s own `translateUniqueViolation` — the use case's pre-check is the primary guard, this is the backstop.
- **Dependencias (llamadas en su cuerpo):** `new IceCreamNameAlreadyExistsError`, `new IceCreamSkuAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-purchases-controller-ts"></a>

### ice-cream-purchases.controller.ts

- **Ruta:** [ice-cream-purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts) (`comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts`, 83 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** No `@Roles(...)` restriction — same policy as `PurchasesController`: registering a compra (receiving stock) is an operational action for whoever runs the register, not an admin-only one.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-ice-cream-purchase.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-purchase-use-case-ts), [list-ice-cream-purchases.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-cream-purchases-use-case-ts), [get-ice-cream-purchase-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-purchase-by-id-use-case-ts), [create-ice-cream-purchase.request.dto.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-create-ice-cream-purchase-request-dto-ts), [list-ice-cream-purchases.query.dto.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-list-ice-cream-purchases-query-dto-ts), [ice-cream-purchase.response.dto.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-ice-cream-purchase-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts)

#### Clase `IceCreamPurchasesController` (L37–82)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('ice-cream-purchases')`
- **Propósito:** No `@Roles(...)` restriction — same policy as `PurchasesController`: registering a compra (receiving stock) is an operational action for whoever runs the register, not an admin-only one. `JwtAuthGuard` (any authenticated, active account) is the only gate. `ListIceCreamPurchasesUseCase`/`GetIceCreamPurchaseByIdUseCase` still restrict *which* purchases a non-admin can see (only their own) — enforced in the use case, not here, identical to how Purchases does it.
- **Dependencias inyectadas (constructor):** `createIceCreamPurchaseUseCase: CreateIceCreamPurchaseUseCase`, `listIceCreamPurchasesUseCase: ListIceCreamPurchasesUseCase`, `getIceCreamPurchaseByIdUseCase: GetIceCreamPurchaseByIdUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 46–58 | `dto: CreateIceCreamPurchaseRequestDto`, `userId: string` | `Promise<IceCreamPurchaseResponseDto>` |
| `findAll` | método public | 60–70 | `query: ListIceCreamPurchasesQueryDto`, `user: RequestUser` | `Promise<PaginatedIceCreamPurchasesResponseDto>` |
| `findOne` | método public | 72–81 | `id: string`, `user: RequestUser` | `Promise<IceCreamPurchaseResponseDto>` |

##### `IceCreamPurchasesController.create`

- **Firma:** `create(dto: CreateIceCreamPurchaseRequestDto, userId: string): Promise<IceCreamPurchaseResponseDto>` — [ice-cream-purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts#L46) (L46–58)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createIceCreamPurchaseUseCase.execute`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchasesController.findAll`

- **Firma:** `findAll(query: ListIceCreamPurchasesQueryDto, user: RequestUser): Promise<PaginatedIceCreamPurchasesResponseDto>` — [ice-cream-purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts#L60) (L60–70)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listIceCreamPurchasesUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchasesController.findOne`

- **Firma:** `findOne(id: string, user: RequestUser): Promise<IceCreamPurchaseResponseDto>` — [ice-cream-purchases.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts#L72) (L72–81)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getIceCreamPurchaseByIdUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-sales-controller-ts"></a>

### ice-cream-sales.controller.ts

- **Ruta:** [ice-cream-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-sales.controller.ts) (`comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-sales.controller.ts`, 77 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** No `@Roles(...)` restriction — same policy as `PurchasesController`/ `IceCreamPurchasesController`: registering a venta is an operational action for whoever runs the register, not an admin-only one.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-ice-cream-sale.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-sale-use-case-ts), [list-ice-cream-sales.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-cream-sales-use-case-ts), [get-ice-cream-sale-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-sale-by-id-use-case-ts), [create-ice-cream-sale.request.dto.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-create-ice-cream-sale-request-dto-ts), [list-ice-cream-sales.query.dto.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-list-ice-cream-sales-query-dto-ts), [ice-cream-sale.response.dto.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-ice-cream-sale-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts)

#### Clase `IceCreamSalesController` (L36–76)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('ice-cream-sales')`
- **Propósito:** No `@Roles(...)` restriction — same policy as `PurchasesController`/ `IceCreamPurchasesController`: registering a venta is an operational action for whoever runs the register, not an admin-only one. `JwtAuthGuard` (any authenticated, active account) is the only gate. `ListIceCreamSalesUseCase`/`GetIceCreamSaleByIdUseCase` still restrict *which* sales a non-admin can see (only their own).
- **Dependencias inyectadas (constructor):** `createIceCreamSaleUseCase: CreateIceCreamSaleUseCase`, `listIceCreamSalesUseCase: ListIceCreamSalesUseCase`, `getIceCreamSaleByIdUseCase: GetIceCreamSaleByIdUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 45–52 | `dto: CreateIceCreamSaleRequestDto`, `userId: string` | `Promise<IceCreamSaleResponseDto>` |
| `findAll` | método public | 54–64 | `query: ListIceCreamSalesQueryDto`, `user: RequestUser` | `Promise<PaginatedIceCreamSalesResponseDto>` |
| `findOne` | método public | 66–75 | `id: string`, `user: RequestUser` | `Promise<IceCreamSaleResponseDto>` |

##### `IceCreamSalesController.create`

- **Firma:** `create(dto: CreateIceCreamSaleRequestDto, userId: string): Promise<IceCreamSaleResponseDto>` — [ice-cream-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-sales.controller.ts#L45) (L45–52)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createIceCreamSaleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSalesController.findAll`

- **Firma:** `findAll(query: ListIceCreamSalesQueryDto, user: RequestUser): Promise<PaginatedIceCreamSalesResponseDto>` — [ice-cream-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-sales.controller.ts#L54) (L54–64)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listIceCreamSalesUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSalesController.findOne`

- **Firma:** `findOne(id: string, user: RequestUser): Promise<IceCreamSaleResponseDto>` — [ice-cream-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-sales.controller.ts#L66) (L66–75)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getIceCreamSaleByIdUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts"></a>

### ice-creams.controller.ts

- **Ruta:** [ice-creams.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts) (`comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts`, 95 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** CRUD is admin-only (create/update/deactivate), same policy as `ProductsController` — a USER can read the catalog (needed for the purchase/sale product pickers) but never manage it.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-create-ice-cream-use-case-ts), [list-ice-creams.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-list-ice-creams-use-case-ts), [get-ice-cream-by-id.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-get-ice-cream-by-id-use-case-ts), [update-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-update-ice-cream-use-case-ts), [deactivate-ice-cream.use-case.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-application-use-cases-deactivate-ice-cream-use-case-ts), [create-ice-cream.request.dto.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-create-ice-cream-request-dto-ts), [update-ice-cream.request.dto.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-update-ice-cream-request-dto-ts), [list-ice-creams.query.dto.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-list-ice-creams-query-dto-ts), [ice-cream.response.dto.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-ice-cream-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts)

#### Clase `IceCreamsController` (L37–94)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('ice-creams')`
- **Propósito:** CRUD is admin-only (create/update/deactivate), same policy as `ProductsController` — a USER can read the catalog (needed for the purchase/sale product pickers) but never manage it.
- **Dependencias inyectadas (constructor):** `createIceCreamUseCase: CreateIceCreamUseCase`, `listIceCreamsUseCase: ListIceCreamsUseCase`, `getIceCreamByIdUseCase: GetIceCreamByIdUseCase`, `updateIceCreamUseCase: UpdateIceCreamUseCase`, `deactivateIceCreamUseCase: DeactivateIceCreamUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 48–57 | `dto: CreateIceCreamRequestDto`, `userId: string` | `Promise<IceCreamResponseDto>` |
| `findAll` | método public | 59–64 | `query: ListIceCreamsQueryDto` | `Promise<PaginatedIceCreamsResponseDto>` |
| `findOne` | método public | 66–71 | `id: string` | `Promise<IceCreamResponseDto>` |
| `update` | método public | 73–85 | `id: string`, `dto: UpdateIceCreamRequestDto`, `userId: string` | `Promise<IceCreamResponseDto>` |
| `deactivate` | método public | 87–93 | `id: string` | `Promise<void>` |

##### `IceCreamsController.create`

- **Firma:** `create(dto: CreateIceCreamRequestDto, userId: string): Promise<IceCreamResponseDto>` — [ice-creams.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts#L48) (L48–57)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createIceCreamUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamsController.findAll`

- **Firma:** `findAll(query: ListIceCreamsQueryDto): Promise<PaginatedIceCreamsResponseDto>` — [ice-creams.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts#L59) (L59–64)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listIceCreamsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamsController.findOne`

- **Firma:** `findOne(id: string): Promise<IceCreamResponseDto>` — [ice-creams.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts#L66) (L66–71)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getIceCreamByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamsController.update`

- **Firma:** `update(id: string, dto: UpdateIceCreamRequestDto, userId: string): Promise<IceCreamResponseDto>` — [ice-creams.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts#L73) (L73–85)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateIceCreamUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamsController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [ice-creams.controller.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts#L87) (L87–93)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateIceCreamUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-create-ice-cream-purchase-request-dto-ts"></a>

### create-ice-cream-purchase.request.dto.ts

- **Ruta:** [create-ice-cream-purchase.request.dto.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/create-ice-cream-purchase.request.dto.ts) (`comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/create-ice-cream-purchase.request.dto.ts`, 40 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** DTO de entrada: declara `CreateIceCreamPurchaseItemRequestDto`, `CreateIceCreamPurchaseRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [ice-cream-purchases.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-purchases-controller-ts)

#### Clase `CreateIceCreamPurchaseItemRequestDto` (L13–24)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CreateIceCreamPurchaseRequestDto` (L26–39)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-create-ice-cream-sale-request-dto-ts"></a>

### create-ice-cream-sale.request.dto.ts

- **Ruta:** [create-ice-cream-sale.request.dto.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/create-ice-cream-sale.request.dto.ts) (`comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/create-ice-cream-sale.request.dto.ts`, 27 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** DTO de entrada: declara `CreateIceCreamSaleItemRequestDto`, `CreateIceCreamSaleRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [ice-cream-sales.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-sales-controller-ts)

#### Clase `CreateIceCreamSaleItemRequestDto` (L11–18)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CreateIceCreamSaleRequestDto` (L20–26)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-create-ice-cream-request-dto-ts"></a>

### create-ice-cream.request.dto.ts

- **Ruta:** [create-ice-cream.request.dto.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/create-ice-cream.request.dto.ts) (`comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/create-ice-cream.request.dto.ts`, 34 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** DTO de entrada: declara `CreateIceCreamRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

#### Clase `CreateIceCreamRequestDto` (L11–33)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-ice-cream-purchase-response-dto-ts"></a>

### ice-cream-purchase.response.dto.ts

- **Ruta:** [ice-cream-purchase.response.dto.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/ice-cream-purchase.response.dto.ts) (`comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/ice-cream-purchase.response.dto.ts`, 41 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** DTO de respuesta: declara `IceCreamPurchaseItemResponseDto`, `IceCreamPurchaseResponseDto`, `IceCreamPurchaseSummaryResponseDto`, `PaginatedIceCreamPurchasesResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [ice-cream-purchases.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-purchases-controller-ts)

#### Clase `IceCreamPurchaseItemResponseDto` (L1–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `IceCreamPurchaseResponseDto` (L11–22)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `IceCreamPurchaseSummaryResponseDto` (L24–33)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedIceCreamPurchasesResponseDto` (L35–40)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-ice-cream-sale-response-dto-ts"></a>

### ice-cream-sale.response.dto.ts

- **Ruta:** [ice-cream-sale.response.dto.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/ice-cream-sale.response.dto.ts) (`comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/ice-cream-sale.response.dto.ts`, 37 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** DTO de respuesta: declara `IceCreamSaleItemResponseDto`, `IceCreamSaleResponseDto`, `IceCreamSaleSummaryResponseDto`, `PaginatedIceCreamSalesResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [ice-cream-sales.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-sales-controller-ts)

#### Clase `IceCreamSaleItemResponseDto` (L1–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `IceCreamSaleResponseDto` (L11–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `IceCreamSaleSummaryResponseDto` (L22–29)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedIceCreamSalesResponseDto` (L31–36)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-ice-cream-response-dto-ts"></a>

### ice-cream.response.dto.ts

- **Ruta:** [ice-cream.response.dto.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/ice-cream.response.dto.ts) (`comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/ice-cream.response.dto.ts`, 23 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** DTO de respuesta: declara `IceCreamResponseDto`, `PaginatedIceCreamsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

#### Clase `IceCreamResponseDto` (L1–15)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedIceCreamsResponseDto` (L17–22)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-list-ice-cream-purchases-query-dto-ts"></a>

### list-ice-cream-purchases.query.dto.ts

- **Ruta:** [list-ice-cream-purchases.query.dto.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/list-ice-cream-purchases.query.dto.ts) (`comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/list-ice-cream-purchases.query.dto.ts`, 41 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** DTO de consulta: declara `ListIceCreamPurchasesQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-purchase.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-purchase-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [ice-cream-purchases.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-purchases-controller-ts)

#### Clase `ListIceCreamPurchasesQueryDto` (L15–40)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-list-ice-cream-sales-query-dto-ts"></a>

### list-ice-cream-sales.query.dto.ts

- **Ruta:** [list-ice-cream-sales.query.dto.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/list-ice-cream-sales.query.dto.ts) (`comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/list-ice-cream-sales.query.dto.ts`, 33 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** DTO de consulta: declara `ListIceCreamSalesQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-sale.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-sale-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [ice-cream-sales.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-cream-sales-controller-ts)

#### Clase `ListIceCreamSalesQueryDto` (L11–32)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-list-ice-creams-query-dto-ts"></a>

### list-ice-creams.query.dto.ts

- **Ruta:** [list-ice-creams.query.dto.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/list-ice-creams.query.dto.ts) (`comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/list-ice-creams.query.dto.ts`, 57 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** DTO de consulta: declara `ListIceCreamsQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

#### Clase `ListIceCreamsQueryDto` (L26–56)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-ice-creams-presentation-dtos-update-ice-cream-request-dto-ts"></a>

### update-ice-cream.request.dto.ts

- **Ruta:** [update-ice-cream.request.dto.ts](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/update-ice-cream.request.dto.ts) (`comercial-jhoel-api/src/modules/ice-creams/presentation/dtos/update-ice-cream.request.dto.ts`, 39 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `ice-creams`
- **Responsabilidad:** DTO de entrada: declara `UpdateIceCreamRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [ice-creams.controller.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-presentation-controllers-ice-creams-controller-ts)

#### Clase `UpdateIceCreamRequestDto` (L12–38)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
