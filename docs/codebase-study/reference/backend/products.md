# Módulo backend `products`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/products` | [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L79) `ProductsController.create` | [CreateProductUseCase](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts) | `ProductRepository`.findByActiveName/findByActiveSku/create<br>`CategoryRepository`.findById<br>`BusinessRepository`.findById<br>`ProductPresentationRepository`.findActiveByBarcode/create<br>`InventoryStockRepository`.createInitial<br>`InventoryLocationRepository`.findAll<br>`UnitOfMeasureRepository`.findById<br>`PresentationTypeRepository`.findByActiveName | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `InventoryService.createProduct` |
| `GET /api/products` | [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L87) `ProductsController.findAll` | [ListProductsUseCase](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-list-products-use-case-ts) | `ProductRepository`.findAll [product_presentations]<br>`InventoryStockRepository`.findByProductIds<br>`ProductPresentationRepository`.findMatchingByBarcode | UseGuards(JwtAuthGuard) | `InventoryService.getProducts`<br>`InventoryService.searchProducts` |
| `GET /api/products/stats` | [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L104) `ProductsController.getStats` | [GetInventoryStatsUseCase](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-inventory-stats-use-case-ts) | `ProductRepository`.getInventoryStats [products] | UseGuards(JwtAuthGuard) | `InventoryService.getInventoryStats` |
| `GET /api/products/export/pdf` | [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L118) `ProductsController.exportPdf` | [ExportProductsPdfUseCase](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-pdf-use-case-ts) | `ProductRepository`.findAll [product_presentations]<br>`CategoryRepository`.findById<br>`BusinessRepository`.findById | UseGuards(JwtAuthGuard) | `InventoryService.exportProductsPdf` |
| `GET /api/products/export/excel` | [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L136) `ProductsController.exportExcel` | [ExportProductsExcelUseCase](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-excel-use-case-ts) | `ProductRepository`.findAll [product_presentations] | UseGuards(JwtAuthGuard) | `InventoryService.exportProductsExcel` |
| `GET /api/products/import/template` | [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L157) `ProductsController.importTemplate` | — | — | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `InventoryService.downloadImportTemplate` |
| `POST /api/products/import` | [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L171) `ProductsController.importExcel` | [ImportProductsFromExcelUseCase](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts) | `CreateProductUseCase`.execute<br>`CreatePresentationUseCase`.execute<br>`CategoryRepository`.findByActiveName<br>`BusinessRepository`.findByActiveName<br>`UnitOfMeasureRepository`.findByActiveName<br>`PresentationTypeRepository`.findByActiveName | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `InventoryService.importProductsExcel` |
| `GET /api/products/:id` | [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L186) `ProductsController.findOne` | [GetProductByIdUseCase](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-product-by-id-use-case-ts) | `ProductRepository`.findById<br>`InventoryStockRepository`.findByProductId | UseGuards(JwtAuthGuard) | `InventoryService.getProductById` |
| `PATCH /api/products/:id` | [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L191) `ProductsController.update` | [UpdateProductUseCase](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts) | `ProductRepository`.findById/findByActiveName/findByActiveSku/update<br>`CategoryRepository`.findById<br>`BusinessRepository`.findById<br>`UnitOfMeasureRepository`.findById | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `InventoryService.updateProduct` |
| `DELETE /api/products/:id` | [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L201) `ProductsController.deactivate` | [DeactivateProductUseCase](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-deactivate-product-use-case-ts) | `ProductRepository`.findById/deactivate<br>`ProductPresentationRepository`.deactivateAllForProduct | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `InventoryService.deleteProduct` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [inventory-stats-output.ts](#f-comercial-jhoel-api-src-modules-products-application-dtos-inventory-stats-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `InventoryStatsOutput` (sin comentario de documentación en el código). | 0 internas | 2 | Baja (2 consumidores) |
| [product-output.ts](#f-comercial-jhoel-api-src-modules-products-application-dtos-product-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toProductOutput`, `withMatchedPresentation`, `withStockByLocation`, `StockByLocationOutput`, `ProductOutput` (sin comentario de documentación en el código). | 3 internas | 4 | Media (4 consumidores) |
| [create-product.use-case.ts](#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateProductUseCase`, `CreateProductInput`, `UNIDAD_PRESENTATION_TYPE_NAME` (sin comentario de documentación en el código). | 14 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [deactivate-product.use-case.ts](#f-comercial-jhoel-api-src-modules-products-application-use-cases-deactivate-product-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — DELETE /products/:id never removes the row. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [export-products-excel.use-case.ts](#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-excel-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ExportProductsExcelUseCase`, `ExportProductsExcelInput`, `EXCEL_EXPORT_ROW_LIMIT` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [export-products-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | Reuses the same generic `buildReportPdf()` every Reportería export already uses (Ventas/Compras/Recargas/...) — Inventario's export is a filtered table-plus-summary document exactly like those, not a "documento" in the Venta/Compra/Ticket/Cotización sense, so it belongs to that family, not a second bespoke builder. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-inventory-stats.use-case.ts](#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-inventory-stats-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the "Total de productos"/"Stock total"/"Stock bajo"/valor de inventario tiles — a real SQL aggregate over the whole active catalog, independent of whatever page size the product list itself is fetching. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-product-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-product-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetProductByIdUseCase` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [import-products-from-excel.use-case.ts](#f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts) | .ts | Caso de uso | Aplicación | Reads an `.xlsx` built to `PRODUCTS_IMPORT_HEADERS`'s exact 14-column shape and creates one product per valid row — always by delegating to `CreateProductUseCase.execute()`, the *same* use case the manual "Agregar producto" form already calls, never a parallel copy of its validation/creation logic. | 8 internas; ext.: @nestjs/common, exceljs | 2 | Media (caso de uso) |
| [list-products.use-case.ts](#f-comercial-jhoel-api-src-modules-products-application-use-cases-list-products-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListProductsUseCase`, `ListProductsInput`, `ListProductsOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-product.use-case.ts](#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateProductUseCase`, `UpdateProductInput` (sin comentario de documentación en el código). | 11 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [product.entity.ts](#f-comercial-jhoel-api-src-modules-products-domain-entities-product-entity-ts) | .ts | Entidad de dominio | Dominio | Entidad de dominio: declara `Product`, `ProductProps` (sin comentario de documentación en el código). | 0 internas | 5 | Media (5 consumidores) |
| [invalid-business.error.ts](#f-comercial-jhoel-api-src-modules-products-domain-errors-invalid-business-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidBusinessError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-category.error.ts](#f-comercial-jhoel-api-src-modules-products-domain-errors-invalid-category-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidCategoryError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-unit-of-measure.error.ts](#f-comercial-jhoel-api-src-modules-products-domain-errors-invalid-unit-of-measure-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidUnitOfMeasureError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [product-name-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-products-domain-errors-product-name-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `ProductNameAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [product-not-found.error.ts](#f-comercial-jhoel-api-src-modules-products-domain-errors-product-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `ProductNotFoundError` (sin comentario de documentación en el código). | 1 internas | 8 | Media (8 consumidores) |
| [product-sku-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-products-domain-errors-product-sku-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `ProductSkuAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [product.repository.ts](#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `FindProductsOptions`, `PaginatedResult`, `CreateProductData`, `InventoryStats`, `ProductRepository` (sin comentario de documentación en el código). | 1 internas | 20 | Alta (20 consumidores) |
| [products-excel.builder.ts](#f-comercial-jhoel-api-src-modules-products-infrastructure-excel-products-excel-builder-ts) | .ts | Builder | Infraestructura | `exceljs` is this app's Excel equivalent of `pdfkit` — pure JS, no native build step. | 0 internas; ext.: exceljs | 3 | Media (3 consumidores) |
| [product.mapper.ts](#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `ProductMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [product.orm-entity.ts](#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `ProductOrmEntity` (sin comentario de documentación en el código). | 4 internas; ext.: typeorm | 6 | Media (6 consumidores) |
| [typeorm-product.repository.ts](#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-typeorm-product-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmProductRepository`, `SORT_COLUMN` (sin comentario de documentación en el código). | 7 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [products.controller.ts](#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts) | .ts | Controlador | Presentación | Follows the same CRUD/guard shape as `CategoriesController` (`GET` open to any authenticated role, mutations admin-only, soft delete), but with genuinely more validation: a product must reference an active `categoryId` and `businessId` (see `CreateProductUseCase`/ `UpdateProductUseCase`), `name` is | 21 internas; ext.: @nestjs/common, @nestjs/platform-express, express | 1 | Media (controlador) |
| [create-product.request.dto.ts](#f-comercial-jhoel-api-src-modules-products-presentation-dtos-create-product-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateProductRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [export-products.query.dto.ts](#f-comercial-jhoel-api-src-modules-products-presentation-dtos-export-products-query-dto-ts) | .ts | DTO de consulta | Presentación | Same filter shape as `ListProductsQueryDto`, minus `page`/`limit` — an export always fetches everything matching the filter (up to its own row cap, see the export use cases), never one paginated slice. | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [import-products-result.response.dto.ts](#f-comercial-jhoel-api-src-modules-products-presentation-dtos-import-products-result-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `ImportProductsSkippedRowDto`, `ImportProductsResultResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [list-products.query.dto.ts](#f-comercial-jhoel-api-src-modules-products-presentation-dtos-list-products-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListProductsQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [product.response.dto.ts](#f-comercial-jhoel-api-src-modules-products-presentation-dtos-product-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `StockByLocationResponseDto`, `ProductResponseDto`, `PaginatedProductsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [update-product.request.dto.ts](#f-comercial-jhoel-api-src-modules-products-presentation-dtos-update-product-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateProductRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [products.module.ts](#f-comercial-jhoel-api-src-modules-products-products-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `ProductsModule` (sin comentario de documentación en el código). | 18 internas; ext.: @nestjs/common, @nestjs/typeorm | 5 | Media (5 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-products-application-dtos-inventory-stats-output-ts"></a>

### inventory-stats-output.ts

- **Ruta:** [inventory-stats-output.ts](../../../../comercial-jhoel-api/src/modules/products/application/dtos/inventory-stats-output.ts) (`comercial-jhoel-api/src/modules/products/application/dtos/inventory-stats-output.ts`, 9 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** DTO de salida (aplicación): declara `InventoryStatsOutput` (sin comentario de documentación en el código).
- **Consumidores:** [get-inventory-stats.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-inventory-stats-use-case-ts), [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

**Interfaces, tipos y enums:**

- `interface InventoryStatsOutput` (L1): sin documentación — miembros: `totalProducts`, `totalStock`, `lowStockCount`, `outOfStockCount`, `totalPublicValue`, `totalCostValue`
<a id="f-comercial-jhoel-api-src-modules-products-application-dtos-product-output-ts"></a>

### product-output.ts

- **Ruta:** [product-output.ts](../../../../comercial-jhoel-api/src/modules/products/application/dtos/product-output.ts) (`comercial-jhoel-api/src/modules/products/application/dtos/product-output.ts`, 93 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** DTO de salida (aplicación): declara `toProductOutput`, `withMatchedPresentation`, `withStockByLocation`, `StockByLocationOutput`, `ProductOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product.entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-entities-product-entity-ts), [inventory-stock.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-inventory-stock-entity-ts), [product-presentation.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-product-presentation-entity-ts)
- **Consumidores:** [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [get-product-by-id.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-product-by-id-use-case-ts), [list-products.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-list-products-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts)

**Interfaces, tipos y enums:**

- `interface StockByLocationOutput` (L5): sin documentación — miembros: `locationId`, `locationName`, `quantity`
- `interface ProductOutput` (L12): Plain, serializable shape use cases return — never the domain entity itself. — miembros: `id`, `name`, `sku`, `categoryId`, `categoryName`, `businessId`, `businessName`, `unitOfMeasureId`, `unitOfMeasureName`, `unitOfMeasureAbbreviation`, `costPrice`, `publicPrice`, `wholesalePrice`, `stock`, `stockByLocation`, `matchedPresentation`, `isActive`, `createdAt`, `updatedAt`
#### Función `toProductOutput` (L42–62)

- **Tipo:** función exportada
- **Firma:** `toProductOutput(product: Product): ProductOutput` — [product-output.ts](../../../../comercial-jhoel-api/src/modules/products/application/dtos/product-output.ts#L42)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [get-product-by-id.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-product-by-id-use-case-ts), [list-products.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-list-products-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts)

#### Función `withMatchedPresentation` (L64–78)

- **Tipo:** función exportada
- **Firma:** `withMatchedPresentation(output: ProductOutput, presentation: ProductPresentation): ProductOutput` — [product-output.ts](../../../../comercial-jhoel-api/src/modules/products/application/dtos/product-output.ts#L64)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [list-products.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-list-products-use-case-ts)

#### Función `withStockByLocation` (L80–92)

- **Tipo:** función exportada
- **Firma:** `withStockByLocation(output: ProductOutput, stock: InventoryStock[]): ProductOutput` — [product-output.ts](../../../../comercial-jhoel-api/src/modules/products/application/dtos/product-output.ts#L80)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `stock.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-product-by-id.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-product-by-id-use-case-ts), [list-products.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-list-products-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts"></a>

### create-product.use-case.ts

- **Ruta:** [create-product.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/create-product.use-case.ts) (`comercial-jhoel-api/src/modules/products/application/use-cases/create-product.use-case.ts`, 179 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Caso de uso: declara `CreateProductUseCase`, `CreateProductInput`, `UNIDAD_PRESENTATION_TYPE_NAME` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts), [inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts), [inventory-location.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-location-repository-ts), [unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts), [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [product-name-already-exists.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-name-already-exists-error-ts), [product-sku-already-exists.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-sku-already-exists-error-ts), [invalid-category.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-invalid-category-error-ts), [invalid-business.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-invalid-business-error-ts), [invalid-unit-of-measure.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-invalid-unit-of-measure-error-ts), [product-output.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-dtos-product-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [import-products-from-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts), [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateProductInput` (L29): sin documentación — miembros: `name`, `sku`, `categoryId`, `businessId`, `unitOfMeasureId`, `costPrice`, `publicPrice`, `wholesalePrice`, `stock`

#### Clase `CreateProductUseCase` (L44–178)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`, `@Inject(CATEGORY_REPOSITORY) categoryRepository: CategoryRepository`, `@Inject(BUSINESS_REPOSITORY) businessRepository: BusinessRepository`, `@Inject(PRODUCT_PRESENTATION_REPOSITORY) presentationRepository: ProductPresentationRepository`, `@Inject(INVENTORY_STOCK_REPOSITORY) stockRepository: InventoryStockRepository`, `@Inject(INVENTORY_LOCATION_REPOSITORY) locationRepository: InventoryLocationRepository`, `@Inject(UNIT_OF_MEASURE_REPOSITORY) unitOfMeasureRepository: UnitOfMeasureRepository`, `@Inject(PRESENTATION_TYPE_REPOSITORY) presentationTypeRepository: PresentationTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 65–177 | `input: CreateProductInput` | `Promise<ProductOutput>` |

##### `CreateProductUseCase.execute`

- **Firma:** `execute(input: CreateProductInput): Promise<ProductOutput>` — [create-product.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/create-product.use-case.ts#L65) (L65–177)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.name.trim().replace`, `input.name.trim`, `this.categoryRepository.findById`, `new InvalidCategoryError`, `this.businessRepository.findById`, `new InvalidBusinessError`, `this.unitOfMeasureRepository.findById`, `new InvalidUnitOfMeasureError`, `this.productRepository.findByActiveName`, `new ProductNameAlreadyExistsError`, `input.sku?.trim`, `this.productRepository.findByActiveSku`, `new ProductSkuAlreadyExistsError`, `this.presentationRepository.findActiveByBarcode`, `this.productRepository.create`, `this.presentationTypeRepository.findByActiveName`, `new InternalServerErrorException`, `this.presentationRepository.create`…
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidCategoryError()`, `new InvalidBusinessError()`, `new InvalidUnitOfMeasureError()`, `new ProductNameAlreadyExistsError(name)`, `new ProductSkuAlreadyExistsError(sku)`, `new InternalServerErrorException( 'No se encontró el tipo de presentación base "Unidad" — la migración del catálogo debi`
- **Consumidores:** [import-products-from-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts), [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-products-application-use-cases-deactivate-product-use-case-ts"></a>

### deactivate-product.use-case.ts

- **Ruta:** [deactivate-product.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/deactivate-product.use-case.ts) (`comercial-jhoel-api/src/modules/products/application/use-cases/deactivate-product.use-case.ts`, 35 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Soft delete only — DELETE /products/:id never removes the row.
- **Depende de (archivos del proyecto):** [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts), [product-not-found.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts)

#### Clase `DeactivateProductUseCase` (L17–34)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — DELETE /products/:id never removes the row. Also deactivates every presentation this product owns (including "Unidad") — see `ProductPresentationRepository.deactivateAllForProduct`'s own doc comment for why: a product here has no reactivation path anywhere in this codebase, so this is safe and is what keeps a presentation's barcode actually freed up for reuse once its product is gone, the same way `products.sku` already frees up on this same action.
- **Dependencias inyectadas (constructor):** `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`, `@Inject(PRODUCT_PRESENTATION_REPOSITORY) presentationRepository: ProductPresentationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 26–33 | `id: string` | `Promise<void>` |

##### `DeactivateProductUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-product.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/deactivate-product.use-case.ts#L26) (L26–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productRepository.findById`, `new ProductNotFoundError`, `this.productRepository.deactivate`, `this.presentationRepository.deactivateAllForProduct`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ProductNotFoundError(id)`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-excel-use-case-ts"></a>

### export-products-excel.use-case.ts

- **Ruta:** [export-products-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/export-products-excel.use-case.ts) (`comercial-jhoel-api/src/modules/products/application/use-cases/export-products-excel.use-case.ts`, 57 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Caso de uso: declara `ExportProductsExcelUseCase`, `ExportProductsExcelInput`, `EXCEL_EXPORT_ROW_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [products-excel.builder.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-excel-products-excel-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts)

**Interfaces, tipos y enums:**

- `interface ExportProductsExcelInput` (L6): sin documentación — miembros: `search`, `categoryId`, `businessId`, `sortBy`, `sortDirection`, `includeInactive`

#### Clase `ExportProductsExcelUseCase` (L22–56)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 29–55 | `input: ExportProductsExcelInput` | `Promise<Buffer>` |

##### `ExportProductsExcelUseCase.execute`

- **Firma:** `execute(input: ExportProductsExcelInput): Promise<Buffer>` — [export-products-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/export-products-excel.use-case.ts#L29) (L29–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productRepository.findAll`, `input.search?.trim`, `buildProductsExcel`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-pdf-use-case-ts"></a>

### export-products-pdf.use-case.ts

- **Ruta:** [export-products-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/export-products-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/products/application/use-cases/export-products-pdf.use-case.ts`, 136 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Reuses the same generic `buildReportPdf()` every Reportería export already uses (Ventas/Compras/Recargas/...) — Inventario's export is a filtered table-plus-summary document exactly like those, not a "documento" in the Venta/Compra/Ticket/Cotización sense, so it belongs to that family, not a second bespoke builder.
- **Depende de (archivos del proyecto):** [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [pdf-helpers.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-ts), [report-pdf.builder.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts)

**Interfaces, tipos y enums:**

- `interface ExportProductsPdfInput` (L14): sin documentación — miembros: `search`, `categoryId`, `businessId`, `sortBy`, `sortDirection`, `includeInactive`, `generatedByUsername`

#### Clase `ExportProductsPdfUseCase` (L39–135)

- **Decoradores:** `@Injectable()`
- **Propósito:** Reuses the same generic `buildReportPdf()` every Reportería export already uses (Ventas/Compras/Recargas/...) — Inventario's export is a filtered table-plus-summary document exactly like those, not a "documento" in the Venta/Compra/Ticket/Cotización sense, so it belongs to that family, not a second bespoke builder.
- **Dependencias inyectadas (constructor):** `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`, `@Inject(CATEGORY_REPOSITORY) categoryRepository: CategoryRepository`, `@Inject(BUSINESS_REPOSITORY) businessRepository: BusinessRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 50–110 | `input: ExportProductsPdfInput` | `Promise<Buffer>` |
| `resolveFilterLines` | método private async | 112–134 | `input: ExportProductsPdfInput` | `Promise<ReportPdfFilterLine[]>` |

##### `ExportProductsPdfUseCase.execute`

- **Firma:** `execute(input: ExportProductsPdfInput): Promise<Buffer>` — [export-products-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/export-products-pdf.use-case.ts#L50) (L50–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.productRepository.findAll`, `input.search?.trim`, `this.resolveFilterLines`, `result.items.filter`, `result.items.reduce`, `result.items.map`, `formatCurrency`, `buildReportPdf`, `String`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

##### `ExportProductsPdfUseCase.resolveFilterLines`

- **Firma:** `resolveFilterLines(input: ExportProductsPdfInput): Promise<ReportPdfFilterLine[]>` — [export-products-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/export-products-pdf.use-case.ts#L112) (L112–134)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `lines.push`, `this.categoryRepository.findById`, `this.businessRepository.findById`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-products-application-use-cases-get-inventory-stats-use-case-ts"></a>

### get-inventory-stats.use-case.ts

- **Ruta:** [get-inventory-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/get-inventory-stats.use-case.ts) (`comercial-jhoel-api/src/modules/products/application/use-cases/get-inventory-stats.use-case.ts`, 18 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Backs the "Total de productos"/"Stock total"/"Stock bajo"/valor de inventario tiles — a real SQL aggregate over the whole active catalog, independent of whatever page size the product list itself is fetching.
- **Depende de (archivos del proyecto):** [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [inventory-stats-output.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-dtos-inventory-stats-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts)

#### Clase `GetInventoryStatsUseCase` (L7–17)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the "Total de productos"/"Stock total"/"Stock bajo"/valor de inventario tiles — a real SQL aggregate over the whole active catalog, independent of whatever page size the product list itself is fetching.
- **Dependencias inyectadas (constructor):** `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–16 | — | `Promise<InventoryStatsOutput>` |

##### `GetInventoryStatsUseCase.execute`

- **Firma:** `execute(): Promise<InventoryStatsOutput>` — [get-inventory-stats.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/get-inventory-stats.use-case.ts#L14) (L14–16)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productRepository.getInventoryStats`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-products-application-use-cases-get-product-by-id-use-case-ts"></a>

### get-product-by-id.use-case.ts

- **Ruta:** [get-product-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/get-product-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/products/application/use-cases/get-product-by-id.use-case.ts`, 31 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Caso de uso: declara `GetProductByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts), [product-not-found.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-not-found-error-ts), [product-output.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-dtos-product-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts)

#### Clase `GetProductByIdUseCase` (L13–30)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`, `@Inject(INVENTORY_STOCK_REPOSITORY) stockRepository: InventoryStockRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 22–29 | `id: string` | `Promise<ProductOutput>` |

##### `GetProductByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<ProductOutput>` — [get-product-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/get-product-by-id.use-case.ts#L22) (L22–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productRepository.findById`, `new ProductNotFoundError`, `this.stockRepository.findByProductId`, `withStockByLocation`, `toProductOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ProductNotFoundError(id)`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts"></a>

### import-products-from-excel.use-case.ts

- **Ruta:** [import-products-from-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/import-products-from-excel.use-case.ts) (`comercial-jhoel-api/src/modules/products/application/use-cases/import-products-from-excel.use-case.ts`, 371 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Reads an `.xlsx` built to `PRODUCTS_IMPORT_HEADERS`'s exact 14-column shape and creates one product per valid row — always by delegating to `CreateProductUseCase.execute()`, the *same* use case the manual "Agregar producto" form already calls, never a parallel copy of its validation/creation logic.
- **Depende de (archivos del proyecto):** [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [create-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-ts), [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts), [presentation-type.repository.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-domain-repositories-presentation-type-repository-ts), [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts), [products-excel.builder.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-excel-products-excel-builder-ts)
- **Paquetes externos:** `@nestjs/common`, `exceljs`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts)

**Interfaces, tipos y enums:**

- `interface ImportProductsRowResult` (L16): sin documentación — miembros: `row`, `name`, `reason`
- `interface ImportProductsFromExcelOutput` (L22): sin documentación — miembros: `totalRows`, `created`, `createdNames`, `skipped`, `presentationWarnings`
- `type PresentationRequestResult` (L41) = `\| { kind: 'none' } \| { kind: 'error'; reason: string } \| { kind: 'valid'; presentationTypeId: string; conversionFactor: number; costPrice: number; publicPrice: number; barcode?: string; }` — See `resolvePresentationRequest()`'s own doc comment for what each `kind` means.

#### Clase `ImportProductsFromExcelUseCase` (L83–370)

- **Decoradores:** `@Injectable()`
- **Propósito:** Reads an `.xlsx` built to `PRODUCTS_IMPORT_HEADERS`'s exact 14-column shape and creates one product per valid row — always by delegating to `CreateProductUseCase.execute()`, the *same* use case the manual "Agregar producto" form already calls, never a parallel copy of its validation/creation logic. This is what guarantees an imported product ends up byte-identical to a manually-created one: same base "Unidad" presentation, same initial stock placement into "Bodega" (see that use case's own doc comment — this import does not change or special-case any of that). Columns 10-13 optionally describe **one** extra presentation (Caja, Paquete, ...) per row, created via `CreatePresentationUseCase` — the same use case "Agregar presentación" already calls — right after the base product. See `resolvePresentationRequest()`'s own doc comment for exactly how that group is validated. Rows are processed 
- **Dependencias inyectadas (constructor):** `createProductUseCase: CreateProductUseCase`, `createPresentationUseCase: CreatePresentationUseCase`, `@Inject(CATEGORY_REPOSITORY) categoryRepository: CategoryRepository`, `@Inject(BUSINESS_REPOSITORY) businessRepository: BusinessRepository`, `@Inject(UNIT_OF_MEASURE_REPOSITORY) unitOfMeasureRepository: UnitOfMeasureRepository`, `@Inject(PRESENTATION_TYPE_REPOSITORY) presentationTypeRepository: PresentationTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 98–272 | `fileBuffer: Buffer` | `Promise<ImportProductsFromExcelOutput>` |
| `resolvePresentationRequest` | método private async | 287–346 | `cellValues: unknown[]` | `Promise<PresentationRequestResult>` |
| `cellText` | método private | 348–357 | `value: unknown` | `string` |
| `cellNumber` | método private | 359–369 | `value: unknown` | `number \| null` |

##### `ImportProductsFromExcelUseCase.execute`

- **Firma:** `execute(fileBuffer: Buffer): Promise<ImportProductsFromExcelOutput>` — [import-products-from-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/import-products-from-excel.use-case.ts#L98) (L98–272)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new ExcelJS.Workbook`, `workbook.xlsx.load`, `new BadRequestException`, `sheet.getRow`, `PRODUCTS_IMPORT_HEADERS.every`, `String(headerRow.getCell(index + 1).value ?? '').trim`, `String`, `headerRow.getCell`, `actual.toLowerCase`, `expected.toLowerCase`, `PRODUCTS_IMPORT_HEADERS.join`, `new Set`, `Array.from`, `row.getCell`, `cellValues.every`, `this.cellText`, `skipped.push`, `name.toLowerCase`…
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BadRequestException( 'El archivo no es un Excel (.xlsx) válido. Si tienes un archivo .xls, ábrelo y usa "Guardar com`, `new BadRequestException('El archivo no contiene ninguna hoja con datos.')`, `new BadRequestException( 'Los encabezados del archivo no coinciden con la plantilla esperada. Descarga la plantilla e in`, `new BadRequestException( 'El archivo tiene ${rawDataRowCount} filas de datos — el máximo permitido por importación es ${`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

##### `ImportProductsFromExcelUseCase.resolvePresentationRequest`

- **Firma:** `resolvePresentationRequest(cellValues: unknown[]): Promise<PresentationRequestResult>` — [import-products-from-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/import-products-from-excel.use-case.ts#L287) (L287–346)
- **Propósito / descripción:** Columns 10-14 are a single optional group. `kind: 'none'` is the common case — every one of them is blank, so the row only needs the base "Unidad" presentation, auto-created regardless by `CreateProductUseCase` itself (its own barcode is simply the SKU column, set automatically — no column here is needed for that). `kind: 'error'` means at least one is filled but the group as a whole doesn't resolve to something `CreatePresentationUseCase` could accept — the caller turns that into a warning, never a reason to skip the base product. `kind: 'valid'` carries the resolved, ready-to-use fields — `barcode` (column 14) within this group is itself optional: a Caja can be requested without its own ba
- **Dependencias (llamadas en su cuerpo):** `this.cellText`, `isBlank`, `this.cellNumber`, `Number.isInteger`, `this.presentationTypeRepository.findByActiveName`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `ImportProductsFromExcelUseCase.cellText`

- **Firma:** `cellText(value: unknown): string` — [import-products-from-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/import-products-from-excel.use-case.ts#L348) (L348–357)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `String((value as { text: unknown }).text ?? '').trim`, `String`, `String(value).trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `ImportProductsFromExcelUseCase.cellNumber`

- **Firma:** `cellNumber(value: unknown): number \| null` — [import-products-from-excel.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/import-products-from-excel.use-case.ts#L359) (L359–369)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `String(value).replace`, `String`, `Number`, `Number.isFinite`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-products-application-use-cases-list-products-use-case-ts"></a>

### list-products.use-case.ts

- **Ruta:** [list-products.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/list-products.use-case.ts) (`comercial-jhoel-api/src/modules/products/application/use-cases/list-products.use-case.ts`, 106 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Caso de uso: declara `ListProductsUseCase`, `ListProductsInput`, `ListProductsOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [inventory-stock.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-inventory-stock-repository-ts), [product-presentation.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-repositories-product-presentation-repository-ts), [product-presentation.entity.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-domain-entities-product-presentation-entity-ts), [product-output.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-dtos-product-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts)

**Interfaces, tipos y enums:**

- `interface ListProductsInput` (L20): sin documentación — miembros: `search`, `categoryId`, `businessId`, `sortBy`, `sortDirection`, `page`, `limit`, `includeInactive`
- `interface ListProductsOutput` (L31): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `ListProductsUseCase` (L48–105)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`, `@Inject(INVENTORY_STOCK_REPOSITORY) stockRepository: InventoryStockRepository`, `@Inject(PRODUCT_PRESENTATION_REPOSITORY) presentationRepository: ProductPresentationRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 59–104 | `input?: ListProductsInput` | `Promise<ListProductsOutput>` |

##### `ListProductsUseCase.execute`

- **Firma:** `execute(input?: ListProductsInput): Promise<ListProductsOutput>` — [list-products.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/list-products.use-case.ts#L59) (L59–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `input.search?.trim`, `this.productRepository.findAll`, `result.items.map`, `Promise.all`, `this.stockRepository.findByProductIds`, `this.presentationRepository.findMatchingByBarcode`, `Promise.resolve`, `new Map`, `withStockByLocation`, `toProductOutput`, `stockByProduct.get`, `matchedPresentationByProduct.get`, `withMatchedPresentation`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts"></a>

### update-product.use-case.ts

- **Ruta:** [update-product.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/update-product.use-case.ts) (`comercial-jhoel-api/src/modules/products/application/use-cases/update-product.use-case.ts`, 112 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Caso de uso: declara `UpdateProductUseCase`, `UpdateProductInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [product-not-found.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-not-found-error-ts), [product-name-already-exists.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-name-already-exists-error-ts), [product-sku-already-exists.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-sku-already-exists-error-ts), [invalid-category.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-invalid-category-error-ts), [invalid-business.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-invalid-business-error-ts), [invalid-unit-of-measure.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-invalid-unit-of-measure-error-ts), [unit-of-measure.repository.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-domain-repositories-unit-of-measure-repository-ts), [product-output.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-dtos-product-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts)

**Interfaces, tipos y enums:**

- `interface UpdateProductInput` (L18): sin documentación — miembros: `name`, `sku`, `categoryId`, `businessId`, `unitOfMeasureId`, `costPrice`, `publicPrice`, `wholesalePrice`

#### Clase `UpdateProductUseCase` (L29–111)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`, `@Inject(CATEGORY_REPOSITORY) categoryRepository: CategoryRepository`, `@Inject(BUSINESS_REPOSITORY) businessRepository: BusinessRepository`, `@Inject(UNIT_OF_MEASURE_REPOSITORY) unitOfMeasureRepository: UnitOfMeasureRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 42–110 | `id: string`, `input: UpdateProductInput` | `Promise<ProductOutput>` |

##### `UpdateProductUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateProductInput): Promise<ProductOutput>` — [update-product.use-case.ts](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/update-product.use-case.ts#L42) (L42–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productRepository.findById`, `new ProductNotFoundError`, `this.categoryRepository.findById`, `new InvalidCategoryError`, `this.businessRepository.findById`, `new InvalidBusinessError`, `this.unitOfMeasureRepository.findById`, `new InvalidUnitOfMeasureError`, `input.name?.trim().replace`, `input.name?.trim`, `this.productRepository.findByActiveName`, `new ProductNameAlreadyExistsError`, `input.sku?.trim`, `this.productRepository.findByActiveSku`, `new ProductSkuAlreadyExistsError`, `this.productRepository.update`, `toProductOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.productRepository.update`
- **Errores que lanza:** `new ProductNotFoundError(id)`, `new InvalidCategoryError()`, `new InvalidBusinessError()`, `new InvalidUnitOfMeasureError()`, `new ProductNameAlreadyExistsError(name)`, `new ProductSkuAlreadyExistsError(sku)`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-products-domain-entities-product-entity-ts"></a>

### product.entity.ts

- **Ruta:** [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts) (`comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts`, 96 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Entidad de dominio: declara `Product`, `ProductProps` (sin comentario de documentación en el código).
- **Consumidores:** [create-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts), [product-output.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-dtos-product-output-ts), [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [product.mapper.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-mapper-ts), [typeorm-product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-typeorm-product-repository-ts)

**Interfaces, tipos y enums:**

- `interface ProductProps` (L1): sin documentación — miembros: `id`, `name`, `sku`, `categoryId`, `categoryName`, `businessId`, `businessName`, `unitOfMeasureId`, `unitOfMeasureName`, `unitOfMeasureAbbreviation`, `costPrice`, `publicPrice`, `wholesalePrice`, `stock`, `isActive`, `createdAt`, `updatedAt`

#### Clase `Product` (L21–95)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: ProductProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 24–26 | `props: ProductProps` | `Product` |
| `id` | getter public | 28–30 | — | `string` |
| `name` | getter public | 32–34 | — | `string` |
| `sku` | getter public | 36–38 | — | `string \| null` |
| `categoryId` | getter public | 40–42 | — | `string` |
| `categoryName` | getter public | 44–46 | — | `string` |
| `businessId` | getter public | 48–50 | — | `string` |
| `businessName` | getter public | 52–54 | — | `string` |
| `unitOfMeasureId` | getter public | 56–58 | — | `string` |
| `unitOfMeasureName` | getter public | 60–62 | — | `string` |
| `unitOfMeasureAbbreviation` | getter public | 64–66 | — | `string` |
| `costPrice` | getter public | 68–70 | — | `number` |
| `publicPrice` | getter public | 72–74 | — | `number` |
| `wholesalePrice` | getter public | 76–78 | — | `number` |
| `stock` | getter public | 80–82 | — | `number` |
| `isActive` | getter public | 84–86 | — | `boolean` |
| `createdAt` | getter public | 88–90 | — | `Date` |
| `updatedAt` | getter public | 92–94 | — | `Date` |

##### `Product.create`

- **Firma:** `create(props: ProductProps): Product` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L24) (L24–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Product`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts), [product.mapper.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-mapper-ts), [typeorm-product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-typeorm-product-repository-ts)

##### `Product.id`

- **Firma:** `id(): string` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.name`

- **Firma:** `name(): string` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L32) (L32–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.sku`

- **Firma:** `sku(): string \| null` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.categoryId`

- **Firma:** `categoryId(): string` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.categoryName`

- **Firma:** `categoryName(): string` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.businessId`

- **Firma:** `businessId(): string` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.businessName`

- **Firma:** `businessName(): string` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.unitOfMeasureId`

- **Firma:** `unitOfMeasureId(): string` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.unitOfMeasureName`

- **Firma:** `unitOfMeasureName(): string` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.unitOfMeasureAbbreviation`

- **Firma:** `unitOfMeasureAbbreviation(): string` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.costPrice`

- **Firma:** `costPrice(): number` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L68) (L68–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.publicPrice`

- **Firma:** `publicPrice(): number` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L72) (L72–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.wholesalePrice`

- **Firma:** `wholesalePrice(): number` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L76) (L76–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.stock`

- **Firma:** `stock(): number` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.isActive`

- **Firma:** `isActive(): boolean` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L84) (L84–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.createdAt`

- **Firma:** `createdAt(): Date` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L88) (L88–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Product.updatedAt`

- **Firma:** `updatedAt(): Date` — [product.entity.ts](../../../../comercial-jhoel-api/src/modules/products/domain/entities/product.entity.ts#L92) (L92–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-products-domain-errors-invalid-business-error-ts"></a>

### invalid-business.error.ts

- **Ruta:** [invalid-business.error.ts](../../../../comercial-jhoel-api/src/modules/products/domain/errors/invalid-business.error.ts) (`comercial-jhoel-api/src/modules/products/domain/errors/invalid-business.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Errores de dominio: declara `InvalidBusinessError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts)

#### Clase `InvalidBusinessError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-products-domain-errors-invalid-category-error-ts"></a>

### invalid-category.error.ts

- **Ruta:** [invalid-category.error.ts](../../../../comercial-jhoel-api/src/modules/products/domain/errors/invalid-category.error.ts) (`comercial-jhoel-api/src/modules/products/domain/errors/invalid-category.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Errores de dominio: declara `InvalidCategoryError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts)

#### Clase `InvalidCategoryError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-products-domain-errors-invalid-unit-of-measure-error-ts"></a>

### invalid-unit-of-measure.error.ts

- **Ruta:** [invalid-unit-of-measure.error.ts](../../../../comercial-jhoel-api/src/modules/products/domain/errors/invalid-unit-of-measure.error.ts) (`comercial-jhoel-api/src/modules/products/domain/errors/invalid-unit-of-measure.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Errores de dominio: declara `InvalidUnitOfMeasureError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts)

#### Clase `InvalidUnitOfMeasureError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-products-domain-errors-product-name-already-exists-error-ts"></a>

### product-name-already-exists.error.ts

- **Ruta:** [product-name-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/products/domain/errors/product-name-already-exists.error.ts) (`comercial-jhoel-api/src/modules/products/domain/errors/product-name-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Errores de dominio: declara `ProductNameAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts), [typeorm-product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-typeorm-product-repository-ts)

#### Clase `ProductNameAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `name: string`
<a id="f-comercial-jhoel-api-src-modules-products-domain-errors-product-not-found-error-ts"></a>

### product-not-found.error.ts

- **Ruta:** [product-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/products/domain/errors/product-not-found.error.ts) (`comercial-jhoel-api/src/modules/products/domain/errors/product-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Errores de dominio: declara `ProductNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts), [create-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-ts), [get-product-inventory.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-get-product-inventory-use-case-ts), [list-product-presentations.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-product-presentations-use-case-ts), [typeorm-inventory-transfer.repository.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-infrastructure-persistence-typeorm-inventory-transfer-repository-ts), [deactivate-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-deactivate-product-use-case-ts), [get-product-by-id.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-product-by-id-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts)

#### Clase `ProductNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-products-domain-errors-product-sku-already-exists-error-ts"></a>

### product-sku-already-exists.error.ts

- **Ruta:** [product-sku-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/products/domain/errors/product-sku-already-exists.error.ts) (`comercial-jhoel-api/src/modules/products/domain/errors/product-sku-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Errores de dominio: declara `ProductSkuAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts), [typeorm-product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-typeorm-product-repository-ts)

#### Clase `ProductSkuAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `sku: string`
<a id="f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts"></a>

### product.repository.ts

- **Ruta:** [product.repository.ts](../../../../comercial-jhoel-api/src/modules/products/domain/repositories/product.repository.ts) (`comercial-jhoel-api/src/modules/products/domain/repositories/product.repository.ts`, 76 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `FindProductsOptions`, `PaginatedResult`, `CreateProductData`, `InventoryStats`, `ProductRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product.entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-entities-product-entity-ts)
- **Consumidores:** [create-presentation.use-case.spec.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-spec-ts), [create-presentation.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-create-presentation-use-case-ts), [get-product-inventory.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-get-product-inventory-use-case-ts), [list-product-presentations.use-case.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-application-use-cases-list-product-presentations-use-case-ts), [create-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-use-case-ts), [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [deactivate-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-deactivate-product-use-case-ts), [export-products-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-excel-use-case-ts), [export-products-pdf.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-pdf-use-case-ts), [get-inventory-stats.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-inventory-stats-use-case-ts), [get-product-by-id.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-product-by-id-use-case-ts), [list-products.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-list-products-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts), [typeorm-product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-typeorm-product-repository-ts), [export-products.query.dto.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-dtos-export-products-query-dto-ts) y 5 más

**Interfaces, tipos y enums:**

- `interface FindProductsOptions` (L14): sin documentación — miembros: `activeOnly`, `search`, `categoryId`, `businessId`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface PaginatedResult` (L25): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface CreateProductData` (L32): sin documentación — miembros: `name`, `sku`, `categoryId`, `businessId`, `unitOfMeasureId`, `costPrice`, `publicPrice`, `wholesalePrice`, `stock`
- `interface InventoryStats` (L46): sin documentación — miembros: `totalProducts`, `totalStock`, `lowStockCount`, `outOfStockCount`, `totalPublicValue`, `totalCostValue`
- `interface ProductRepository` (L55): sin documentación — miembros: `findAll`, `findById`, `findByActiveName`, `findByActiveSku`, `create`, `update`, `deactivate`, `getInventoryStats`
- `type ProductSortField` (L5) = `\| 'name' \| 'costPrice' \| 'publicPrice' \| 'wholesalePrice' \| 'stock' \| 'createdAt'`
- `type SortDirection` (L12) = `'asc' \| 'desc'`
- `type UpdateProductData` (L44) = `Partial<CreateProductData>`

**Constantes exportadas:**

- `PRODUCT_REPOSITORY` (L3) = `Symbol('PRODUCT_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-products-infrastructure-excel-products-excel-builder-ts"></a>

### products-excel.builder.ts

- **Ruta:** [products-excel.builder.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/excel/products-excel.builder.ts) (`comercial-jhoel-api/src/modules/products/infrastructure/excel/products-excel.builder.ts`, 211 líneas)
- **Tipo:** Builder · **Capa:** Infraestructura · **Módulo:** Módulo backend `products`
- **Responsabilidad:** `exceljs` is this app's Excel equivalent of `pdfkit` — pure JS, no native build step.
- **Paquetes externos:** `exceljs`
- **Consumidores:** [export-products-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-excel-use-case-ts), [import-products-from-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts), [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

**Interfaces, tipos y enums:**

- `interface ProductsExcelRow` (L3): sin documentación — miembros: `name`, `sku`, `categoryName`, `businessName`, `unitOfMeasureAbbreviation`, `costPrice`, `publicPrice`, `wholesalePrice`, `stock`, `isActive`

**Constantes exportadas:**

- `PRODUCTS_IMPORT_HEADERS` (L47): The exact, ordered header row `ImportProductsFromExcelUseCase` expects — defined once here (the "products excel" schema's home) and imported by that use case, so the parser and the template it hands out can never silently drift apart. = `[ 'Producto', 'SKU', 'Categoría', 'Negocio', 'Unidad de Medida', 'Precio Costo', 'Precio Público', 'Precio May`
#### Función `buildProductsExcel` (L70–133)

- **Tipo:** función exportada, async
- **Firma:** `buildProductsExcel(rows: ProductsExcelRow[]): Promise<Buffer>` — [products-excel.builder.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/excel/products-excel.builder.ts#L70)
- **Propósito / descripción:** `exceljs` is this app's Excel equivalent of `pdfkit` — pure JS, no native build step. Unlike the PDF export (capped at `EXPORT_ROW_LIMIT`, a printed table has a practical page-count limit), a spreadsheet has no such constraint, so the caller can hand this every matching row.
- **Dependencias:** `new ExcelJS.Workbook`, `new Date`, `workbook.addWorksheet`, `sheet.getRow`, `sheet.addRow`, `['costPrice', 'publicPrice', 'wholesalePrice'].forEach`, `sheet.getColumn`, `workbook.xlsx.writeBuffer`, `Buffer.from`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-products-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-excel-use-case-ts)

#### Función `buildProductsImportTemplate` (L144–210)

- **Tipo:** función exportada, async
- **Firma:** `buildProductsImportTemplate(): Promise<Buffer>` — [products-excel.builder.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/excel/products-excel.builder.ts#L144)
- **Propósito / descripción:** Blank import template — `PRODUCTS_IMPORT_HEADERS` as the header row, plus one filled-in example row so the expected format (numbers as plain numbers, not text; empty SKU/Stock/presentation columns allowed) is obvious without a separate instructions sheet. `ImportProductsFromExcelUseCase` reads columns purely by position (1-14, matching this exact order), never by header text matching beyond the one initial "does this look like our template" check.
- **Dependencias:** `new ExcelJS.Workbook`, `new Date`, `workbook.addWorksheet`, `sheet.getRow`, `sheet.addRow`, `sheet.getColumn`, `workbook.xlsx.writeBuffer`, `Buffer.from`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-mapper-ts"></a>

### product.mapper.ts

- **Ruta:** [product.mapper.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/product.mapper.ts) (`comercial-jhoel-api/src/modules/products/infrastructure/persistence/product.mapper.ts`, 27 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Mapper: declara `ProductMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product.entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-entities-product-entity-ts), [product.orm-entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-orm-entity-ts)
- **Consumidores:** [typeorm-product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-typeorm-product-repository-ts)

#### Clase `ProductMapper` (L4–26)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–25 | `orm: ProductOrmEntity` | `Product` |

##### `ProductMapper.toDomain`

- **Firma:** `toDomain(orm: ProductOrmEntity): Product` — [product.mapper.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/product.mapper.ts#L5) (L5–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Product.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-typeorm-product-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-orm-entity-ts"></a>

### product.orm-entity.ts

- **Ruta:** [product.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/product.orm-entity.ts) (`comercial-jhoel-api/src/modules/products/infrastructure/persistence/product.orm-entity.ts`, 99 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `ProductOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [category.orm-entity.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-category-orm-entity-ts), [business.orm-entity.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-infrastructure-persistence-business-orm-entity-ts), [unit-of-measure.orm-entity.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-infrastructure-persistence-unit-of-measure-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [catalog-product.orm-entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-orm-entity-ts), [product.mapper.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-mapper-ts), [typeorm-product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-typeorm-product-repository-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts), [purchase-detail.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-detail-orm-entity-ts), [sale-detail.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-detail-orm-entity-ts)

#### Clase `ProductOrmEntity` (L18–98)

- **Decoradores:** `@Entity('products')` `@Index('UQ_products_name_active', ['name'], { unique: true, where: '"is_active" = true', })` `@Index('UQ_products_sku_active', ['sku'], { unique: true, where: '"is_active" = true', })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column sku: string \| null`, `@Column categoryId: string`, `@ManyToOne category: CategoryOrmEntity`, `@Column businessId: string`, `@ManyToOne business: BusinessOrmEntity`, `@Column unitOfMeasureId: string`, `@ManyToOne unitOfMeasure: UnitOfMeasureOrmEntity`, `@Column costPrice: number`, `@Column publicPrice: number`, `@Column wholesalePrice: number`, `@Column stock: number`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-typeorm-product-repository-ts"></a>

### typeorm-product.repository.ts

- **Ruta:** [typeorm-product.repository.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts) (`comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts`, 205 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmProductRepository`, `SORT_COLUMN` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product.entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-entities-product-entity-ts), [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [product-name-already-exists.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-name-already-exists-error-ts), [product-sku-already-exists.error.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-errors-product-sku-already-exists-error-ts), [product.orm-entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-orm-entity-ts), [product.mapper.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-mapper-ts), [apply-search-terms.util.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-apply-search-terms-util-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts)

#### Clase `TypeOrmProductRepository` (L29–204)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements ProductRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(ProductOrmEntity) repository: Repository<ProductOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 36–104 | `options: FindProductsOptions` | `Promise<PaginatedResult<Product>>` |
| `findById` | método public async | 106–109 | `id: string` | `Promise<Product \| null>` |
| `findByActiveName` | método public async | 111–116 | `name: string` | `Promise<Product \| null>` |
| `findByActiveSku` | método public async | 118–123 | `sku: string` | `Promise<Product \| null>` |
| `create` | método public async | 125–136 | `data: CreateProductData` | `Promise<Product>` |
| `update` | método public async | 138–146 | `id: string`, `data: UpdateProductData` | `Promise<Product>` |
| `deactivate` | método public async | 148–150 | `id: string` | `Promise<void>` |
| `getInventoryStats` | método public async | 153–183 | — | `Promise<InventoryStats>` |
| `translateUniqueViolation` | método private | 186–203 | `error: unknown`, `name: string`, `sku?: string \| null` | `unknown` |

##### `TypeOrmProductRepository.findAll`

- **Firma:** `findAll(options: FindProductsOptions): Promise<PaginatedResult<Product>>` — [typeorm-product.repository.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts#L36) (L36–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('product').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `applySearchTerms`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `orms.map`, `ProductMapper.toDomain`
- **Efectos secundarios:** Tablas en su SQL: `product_presentations`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductRepository.findById`

- **Firma:** `findById(id: string): Promise<Product \| null>` — [typeorm-product.repository.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts#L106) (L106–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `ProductMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductRepository.findByActiveName`

- **Firma:** `findByActiveName(name: string): Promise<Product \| null>` — [typeorm-product.repository.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts#L111) (L111–116)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `ProductMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductRepository.findByActiveSku`

- **Firma:** `findByActiveSku(sku: string): Promise<Product \| null>` — [typeorm-product.repository.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts#L118) (L118–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `ProductMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductRepository.create`

- **Firma:** `create(data: CreateProductData): Promise<Product>` — [typeorm-product.repository.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts#L125) (L125–136)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `ProductMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name, data.sku)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductRepository.update`

- **Firma:** `update(id: string, data: UpdateProductData): Promise<Product>` — [typeorm-product.repository.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts#L138) (L138–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `ProductMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name ?? '', data.sku)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-product.repository.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts#L148) (L148–150)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductRepository.getInventoryStats`

- **Firma:** `getInventoryStats(): Promise<InventoryStats>` — [typeorm-product.repository.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts#L153) (L153–183)
- **Propósito / descripción:** One raw aggregate query, scoped to active products — never a full fetch-then-sum in TypeScript, which is exactly what silently broke at scale before this method existed. `10` mirrors the frontend's own `LOW_STOCK_THRESHOLD` (`core/models/product.model.ts`).
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `parseInt`, `parseFloat`
- **Efectos secundarios:** Tablas en su SQL: `products`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmProductRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, name: string, sku?: string \| null): unknown` — [typeorm-product.repository.ts](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts#L186) (L186–203)
- **Propósito / descripción:** Two independent partial unique indexes to check against, unlike the single-constraint version this pattern has elsewhere (e.g. `TypeOrmCategoryRepository`) — `name` and `sku` are validated by the use case beforehand, this is only the race-safety net for both.
- **Dependencias (llamadas en su cuerpo):** `new ProductNameAlreadyExistsError`, `new ProductSkuAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts"></a>

### products.controller.ts

- **Ruta:** [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts) (`comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts`, 209 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Follows the same CRUD/guard shape as `CategoriesController` (`GET` open to any authenticated role, mutations admin-only, soft delete), but with genuinely more validation: a product must reference an active `categoryId` and `businessId` (see `CreateProductUseCase`/ `UpdateProductUseCase`), `name` is
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [list-products.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-list-products-use-case-ts), [get-product-by-id.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-product-by-id-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts), [deactivate-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-deactivate-product-use-case-ts), [export-products-pdf.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-pdf-use-case-ts), [export-products-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-excel-use-case-ts), [import-products-from-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts), [get-inventory-stats.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-inventory-stats-use-case-ts), [inventory-stats-output.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-dtos-inventory-stats-output-ts), [products-excel.builder.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-excel-products-excel-builder-ts) y 6 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/platform-express`, `express`
- **Consumidores:** [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts)

**Interfaces, tipos y enums:**

- `interface UploadedExcelFile` (L47): The minimal shape actually read off an uploaded file — avoids a dependency on `@types/multer` (not installed; `multer` itself ships transitively via `@nestjs/platform-express`, see that module's own doc comment) for a single-field usage. — miembros: `buffer`, `originalname`, `size`

#### Clase `ProductsController` (L64–208)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('products')`
- **Propósito:** Follows the same CRUD/guard shape as `CategoriesController` (`GET` open to any authenticated role, mutations admin-only, soft delete), but with genuinely more validation: a product must reference an active `categoryId` and `businessId` (see `CreateProductUseCase`/ `UpdateProductUseCase`), `name` is unique only among active products, and the optional `sku` follows the identical "unique only among active rows, many `NULL`s allowed" pattern.
- **Dependencias inyectadas (constructor):** `createProductUseCase: CreateProductUseCase`, `listProductsUseCase: ListProductsUseCase`, `getProductByIdUseCase: GetProductByIdUseCase`, `updateProductUseCase: UpdateProductUseCase`, `deactivateProductUseCase: DeactivateProductUseCase`, `exportProductsPdfUseCase: ExportProductsPdfUseCase`, `exportProductsExcelUseCase: ExportProductsExcelUseCase`, `importProductsFromExcelUseCase: ImportProductsFromExcelUseCase`, `getInventoryStatsUseCase: GetInventoryStatsUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 79–85 | `dto: CreateProductRequestDto` | `Promise<ProductResponseDto>` |
| `findAll` | método public | 87–92 | `query: ListProductsQueryDto` | `Promise<PaginatedProductsResponseDto>` |
| `getStats` | método public | 104–107 | — | `Promise<InventoryStatsOutput>` |
| `exportPdf` | método public async | 118–134 | `query: ExportProductsQueryDto`, `username: string`, `res: Response` | `Promise<void>` |
| `exportExcel` | método public async | 136–149 | `query: ExportProductsQueryDto`, `res: Response` | `Promise<void>` |
| `importTemplate` | método public async | 157–169 | `res: Response` | `Promise<void>` |
| `importExcel` | método public | 171–184 | `file: UploadedExcelFile` | `Promise<ImportProductsResultResponseDto>` |
| `findOne` | método public | 186–189 | `id: string` | `Promise<ProductResponseDto>` |
| `update` | método public | 191–199 | `id: string`, `dto: UpdateProductRequestDto` | `Promise<ProductResponseDto>` |
| `deactivate` | método public | 201–207 | `id: string` | `Promise<void>` |

##### `ProductsController.create`

- **Firma:** `create(dto: CreateProductRequestDto): Promise<ProductResponseDto>` — [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L79) (L79–85)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.createProductUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductsController.findAll`

- **Firma:** `findAll(query: ListProductsQueryDto): Promise<PaginatedProductsResponseDto>` — [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L87) (L87–92)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listProductsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductsController.getStats`

- **Firma:** `getStats(): Promise<InventoryStatsOutput>` — [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L104) (L104–107)
- **Decoradores:** `@Get('stats')`
- **Propósito / descripción:** Declared before `:id` — same route-ordering discipline as every other export/summary route in this codebase (Sales/Purchases/Reportería): otherwise Nest would match `GET /products/stats` as `GET /products/:id` with `id="stats"` and fail `ParseUUIDPipe` before ever reaching this handler. Real SQL aggregates over the whole active catalog — see `GetInventoryStatsUseCase`'s own doc comment for the bug this replaces (the Inventario summary tiles silently capping at whatever page size `GET /products` itself was fetching).
- **Dependencias (llamadas en su cuerpo):** `this.getInventoryStatsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductsController.exportPdf`

- **Firma:** `exportPdf(query: ExportProductsQueryDto, username: string, res: Response): Promise<void>` — [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L118) (L118–134)
- **Decoradores:** `@Get('export/pdf')`
- **Propósito / descripción:** Declared before `:id` — same route-ordering discipline as every other export/summary route in this codebase (Sales/Purchases/Reportería): otherwise Nest would match `GET /products/export/pdf` as `GET /products/:id` with `id="export"` and fail `ParseUUIDPipe` before ever reaching this handler. Same open-to-any-authenticated-role guard as `GET /products` itself — exporting what you can already see isn't a new permission.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser('username') username`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.exportProductsPdfUseCase.execute`, `res.set`, `Date.now`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductsController.exportExcel`

- **Firma:** `exportExcel(query: ExportProductsQueryDto, res: Response): Promise<void>` — [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L136) (L136–149)
- **Decoradores:** `@Get('export/excel')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.exportProductsExcelUseCase.execute`, `res.set`, `Date.now`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductsController.importTemplate`

- **Firma:** `importTemplate(res: Response): Promise<void>` — [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L157) (L157–169)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Get('import/template')`
- **Propósito / descripción:** Declared before `:id` for the same route-ordering reason as `export/pdf`/`export/excel` above. Admin-only, same gate as `POST /products` itself — bulk-creating products is a heavier version of the same action, never a lighter one.
- **Origen de parámetros:** `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `buildProductsImportTemplate`, `res.set`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductsController.importExcel`

- **Firma:** `importExcel(file: UploadedExcelFile): Promise<ImportProductsResultResponseDto>` — [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L171) (L171–184)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post('import')` `@UseInterceptors( FileInterceptor('file', { limits: { fileSize: MAX_IMPORT_FILE_SIZE_BYTES } }), )`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@UploadedFile() file`
- **Dependencias (llamadas en su cuerpo):** `new BadRequestException`, `this.importProductsFromExcelUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new BadRequestException('Debes adjuntar un archivo Excel (.xlsx).')`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductsController.findOne`

- **Firma:** `findOne(id: string): Promise<ProductResponseDto>` — [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L186) (L186–189)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getProductByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductsController.update`

- **Firma:** `update(id: string, dto: UpdateProductRequestDto): Promise<ProductResponseDto>` — [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L191) (L191–199)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.updateProductUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductsController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [products.controller.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts#L201) (L201–207)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateProductUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-products-presentation-dtos-create-product-request-dto-ts"></a>

### create-product.request.dto.ts

- **Ruta:** [create-product.request.dto.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/dtos/create-product.request.dto.ts) (`comercial-jhoel-api/src/modules/products/presentation/dtos/create-product.request.dto.ts`, 55 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** DTO de entrada: declara `CreateProductRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

#### Clase `CreateProductRequestDto` (L14–54)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-products-presentation-dtos-export-products-query-dto-ts"></a>

### export-products.query.dto.ts

- **Ruta:** [export-products.query.dto.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/dtos/export-products.query.dto.ts) (`comercial-jhoel-api/src/modules/products/presentation/dtos/export-products.query.dto.ts`, 49 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Same filter shape as `ListProductsQueryDto`, minus `page`/`limit` — an export always fetches everything matching the filter (up to its own row cap, see the export use cases), never one paginated slice.
- **Depende de (archivos del proyecto):** [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

#### Clase `ExportProductsQueryDto` (L23–48)

- **Propósito:** Same filter shape as `ListProductsQueryDto`, minus `page`/`limit` — an export always fetches everything matching the filter (up to its own row cap, see the export use cases), never one paginated slice.
<a id="f-comercial-jhoel-api-src-modules-products-presentation-dtos-import-products-result-response-dto-ts"></a>

### import-products-result.response.dto.ts

- **Ruta:** [import-products-result.response.dto.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/dtos/import-products-result.response.dto.ts) (`comercial-jhoel-api/src/modules/products/presentation/dtos/import-products-result.response.dto.ts`, 15 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** DTO de respuesta: declara `ImportProductsSkippedRowDto`, `ImportProductsResultResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

#### Clase `ImportProductsSkippedRowDto` (L1–5)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ImportProductsResultResponseDto` (L7–14)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-products-presentation-dtos-list-products-query-dto-ts"></a>

### list-products.query.dto.ts

- **Ruta:** [list-products.query.dto.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/dtos/list-products.query.dto.ts) (`comercial-jhoel-api/src/modules/products/presentation/dtos/list-products.query.dto.ts`, 66 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** DTO de consulta: declara `ListProductsQueryDto`, `SORT_FIELDS`, `SORT_DIRECTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

#### Clase `ListProductsQueryDto` (L27–65)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-products-presentation-dtos-product-response-dto-ts"></a>

### product.response.dto.ts

- **Ruta:** [product.response.dto.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/dtos/product.response.dto.ts) (`comercial-jhoel-api/src/modules/products/presentation/dtos/product.response.dto.ts`, 34 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** DTO de respuesta: declara `StockByLocationResponseDto`, `ProductResponseDto`, `PaginatedProductsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

#### Clase `StockByLocationResponseDto` (L1–5)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ProductResponseDto` (L7–26)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedProductsResponseDto` (L28–33)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-products-presentation-dtos-update-product-request-dto-ts"></a>

### update-product.request.dto.ts

- **Ruta:** [update-product.request.dto.ts](../../../../comercial-jhoel-api/src/modules/products/presentation/dtos/update-product.request.dto.ts) (`comercial-jhoel-api/src/modules/products/presentation/dtos/update-product.request.dto.ts`, 57 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `products`
- **Responsabilidad:** DTO de entrada: declara `UpdateProductRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts)

#### Clase `UpdateProductRequestDto` (L13–56)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-products-products-module-ts"></a>

### products.module.ts

- **Ruta:** [products.module.ts](../../../../comercial-jhoel-api/src/modules/products/products.module.ts) (`comercial-jhoel-api/src/modules/products/products.module.ts`, 49 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `products`
- **Responsabilidad:** Módulo: declara `ProductsModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [product.orm-entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-orm-entity-ts), [typeorm-product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-typeorm-product-repository-ts), [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [list-products.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-list-products-use-case-ts), [get-product-by-id.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-product-by-id-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts), [deactivate-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-deactivate-product-use-case-ts), [export-products-pdf.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-pdf-use-case-ts), [export-products-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-excel-use-case-ts), [import-products-from-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts), [get-inventory-stats.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-get-inventory-stats-use-case-ts), [products.controller.ts](products.md#f-comercial-jhoel-api-src-modules-products-presentation-controllers-products-controller-ts), [categories.module.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-categories-module-ts), [businesses.module.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts) y 3 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `ProductsModule` (L22–48)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([ProductOrmEntity]), CategoriesModule, BusinessesModule, forwardRef(() => InventoryModule), UnitsOfMeasureModule, P`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
