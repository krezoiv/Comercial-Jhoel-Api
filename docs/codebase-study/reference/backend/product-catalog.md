# Módulo backend `product-catalog`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/catalog/product-requests` | [catalog-product-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-product-requests.controller.ts#L33) `CatalogProductRequestsController.findAll` | [ListCatalogProductRequestsUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-catalog-product-requests-use-case-ts) | `CatalogProductRequestRepository`.findAll | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogProductRequestService.getRequests` |
| `GET /api/catalog/product-requests/:id` | [catalog-product-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-product-requests.controller.ts#L44) `CatalogProductRequestsController.findOne` | [GetCatalogProductRequestByIdUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-request-by-id-use-case-ts) | `CatalogProductRequestRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogProductRequestService.getRequestById` |
| `PATCH /api/catalog/product-requests/:id/status` | [catalog-product-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-product-requests.controller.ts#L49) `CatalogProductRequestsController.updateStatus` | [UpdateCatalogProductRequestStatusUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-request-status-use-case-ts) | `CatalogProductRequestRepository`.findById/updateStatus | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogProductRequestService.updateStatus` |
| `POST /api/catalog/products` | [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L63) `CatalogProductsController.create` | [CreateCatalogProductUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-use-case-ts) | `CatalogProductRepository`.create<br>`ProductRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogProductService.createProduct` |
| `GET /api/catalog/products` | [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L77) `CatalogProductsController.findAll` | [ListCatalogProductsUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-catalog-products-use-case-ts) | `CatalogProductRepository`.findAll | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogProductService.getProducts` |
| `GET /api/catalog/products/:id` | [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L86) `CatalogProductsController.findOne` | [GetCatalogProductByIdUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-by-id-use-case-ts) | `CatalogProductRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogProductService.getProductById` |
| `PATCH /api/catalog/products/:id` | [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L91) `CatalogProductsController.update` | [UpdateCatalogProductUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-use-case-ts) | `CatalogProductRepository`.findById/update | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogProductService.updateProduct` |
| `POST /api/catalog/products/:id/activate` | [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L103) `CatalogProductsController.activate` | [SetCatalogProductActiveUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-active-use-case-ts) | `CatalogProductRepository`.findById/setActive | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogProductService.activateProduct` |
| `DELETE /api/catalog/products/:id` | [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L112) `CatalogProductsController.deactivate` | [SetCatalogProductActiveUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-active-use-case-ts) | `CatalogProductRepository`.findById/setActive | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogProductService.deactivateProduct` |
| `POST /api/catalog/products/reorder` | [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L121) `CatalogProductsController.reorder` | [ReorderCatalogProductsUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-reorder-catalog-products-use-case-ts) | `CatalogProductRepository`.findById/reorder | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogProductService.reorderProducts` |
| `POST /api/catalog/products/:id/image` | [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L127) `CatalogProductsController.setImage` | [SetCatalogProductImageUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-image-use-case-ts) | `CatalogProductRepository`.findById/setImage | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogProductService.setImage` |
| `DELETE /api/catalog/products/:id/image` | [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L142) `CatalogProductsController.removeImage` | [RemoveCatalogProductImageUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-remove-catalog-product-image-use-case-ts) | `CatalogProductRepository`.findById/removeImage | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogProductService.removeImage` |
| `GET /api/public-catalog/products` | [public-product-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts#L49) `PublicProductCatalogController.findAll` | [ListPublishedCatalogProductsUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-published-catalog-products-use-case-ts) | `CatalogProductRepository`.findPublished<br>`CatalogLikeRepository`.getCountsBatch/getLikedEntityIds [catalog_likes] | — | `PublicProductCatalogService.getPublishedProducts` |
| `GET /api/public-catalog/products/:id` | [public-product-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts#L63) `PublicProductCatalogController.findOne` | [GetPublishedCatalogProductByIdUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-published-catalog-product-by-id-use-case-ts) | `CatalogProductRepository`.findById<br>`CatalogLikeRepository`.getCount/getLikedEntityIds [catalog_likes] | — | `PublicProductCatalogService.getProductById` |
| `GET /api/public-catalog/products/images/:id` | [public-product-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts#L75) `PublicProductCatalogController.getImage` | [GetCatalogProductImageUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-image-use-case-ts) | `CatalogProductRepository`.findById/getImage | — | — |
| `POST /api/public-catalog/product-requests` | [public-product-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts#L90) `PublicProductCatalogController.createRequest` | [CreateCatalogProductRequestUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-request-use-case-ts) | `CatalogProductRepository`.findById<br>`CatalogProductRequestRepository`.create | — | `PublicProductCatalogService.createRequest` |
| `POST /api/public-catalog/products/:id/like` | [public-product-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts#L102) `PublicProductCatalogController.like` | [LikeCatalogProductUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-like-catalog-product-use-case-ts) | `CatalogProductRepository`.findById<br>`CatalogLikeRepository`.like/unlike/getCount | UseGuards(ThrottlerGuard) Throttle({ default: { limit: 30, ttl: 60_000 } }) | `PublicProductCatalogService.likeProduct` |
| `POST /api/public-catalog/products/:id/unlike` | [public-product-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts#L113) `PublicProductCatalogController.unlike` | [LikeCatalogProductUseCase](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-like-catalog-product-use-case-ts) | `CatalogProductRepository`.findById<br>`CatalogLikeRepository`.like/unlike/getCount | UseGuards(ThrottlerGuard) Throttle({ default: { limit: 30, ttl: 60_000 } }) | `PublicProductCatalogService.unlikeProduct` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [catalog-product-output.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Shape admin — incluye estado y datos de auditoría, nunca expuesto sin autenticación. | 1 internas | 6 | Media (6 consumidores) |
| [catalog-product-request-output.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-request-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toCatalogProductRequestOutput`, `CatalogProductRequestOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [create-catalog-product-request.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-request-use-case-ts) | .ts | Caso de uso | Aplicación | "Lo quiero" para Variedades y Accesorios — el punto más sensible de este módulo. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [create-catalog-product.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-use-case-ts) | .ts | Caso de uso | Aplicación | Publica un producto de Inventario en el catálogo — nunca copia sus datos, solo referencia `productId`. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-catalog-product-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetCatalogProductByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-catalog-product-image.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-image-use-case-ts) | .ts | Caso de uso | Aplicación | Público, sin guard — pero valida que la publicación siga visible: desactivarla oculta también su imagen, no solo su ficha. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-catalog-product-request-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-request-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetCatalogProductRequestByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-published-catalog-product-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-published-catalog-product-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetPublishedCatalogProductByIdUseCase` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [like-catalog-product.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-like-catalog-product-use-case-ts) | .ts | Caso de uso | Aplicación | "Me gusta" público — Librería y Variedades por igual (comparten tabla). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-catalog-product-requests.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-catalog-product-requests-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListCatalogProductRequestsUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-catalog-products.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-catalog-products-use-case-ts) | .ts | Caso de uso | Aplicación | Listado admin — una sección a la vez (Librería o Variedades), incluye inactivos opcionalmente. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-published-catalog-products.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-published-catalog-products-use-case-ts) | .ts | Caso de uso | Aplicación | Backs Librería/Variedades en la landing — solo publicaciones activas cuyo producto en Inventario también sigue activo. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [remove-catalog-product-image.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-remove-catalog-product-image-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `RemoveCatalogProductImageUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [reorder-catalog-products.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-reorder-catalog-products-use-case-ts) | .ts | Caso de uso | Aplicación | Admin-only, secuencial, sin concurrencia esperada — un `UPDATE` plano por fila dentro de una transacción, sin necesidad de stored function (misma convención ya usada en Teléfonos). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [set-catalog-product-active.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-active-use-case-ts) | .ts | Caso de uso | Aplicación | Un solo flag activo/inactivo controla visibilidad pública y gestión admin — a diferencia de Teléfonos, este catálogo no pidió un paso de "publicar" separado. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [set-catalog-product-image.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-image-use-case-ts) | .ts | Caso de uso | Aplicación | Subir = reemplazar — una sola imagen por publicación, sin galería. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-catalog-product-request-status.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-request-status-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateCatalogProductRequestStatusUseCase`, `UpdateCatalogProductRequestStatusInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-catalog-product.use-case.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-use-case-ts) | .ts | Caso de uso | Aplicación | Solo edita la descripción de catálogo — nombre/precio/categoría siempre se leen en vivo de Inventario, nunca se editan aquí. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [assert-valid-catalog-product-image.ts](#f-comercial-jhoel-api-src-modules-product-catalog-application-utils-assert-valid-catalog-product-image-ts) | .ts | Utilidad | Aplicación | Utilidad: declara `assertValidCatalogProductImage`, `UploadedCatalogProductImage`, `MAX_CATALOG_PRODUCT_IMAGE_SIZE_BYTES`, `ALLOWED_MIME_TYPES` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [catalog-product-request.entity.ts](#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-request-entity-ts) | .ts | Entidad de dominio | Dominio | Lead de "Lo quiero" para Variedades y Accesorios — deliberadamente SIN nada de Krediya (sin `creditAvailable`, sin distinción compra/crédito): Krediya es exclusiva de Teléfonos, nunca se copia esa lógica aquí. | 0 internas | 9 | Media (9 consumidores) |
| [catalog-product.entity.ts](#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts) | .ts | Entidad de dominio | Dominio | Una "publicación de catálogo" — nunca un producto en sí. | 0 internas | 12 | Alta (12 consumidores) |
| [catalog-product-not-found.error.ts](#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `CatalogProductNotFoundError` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [catalog-product-not-visible.error.ts](#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-visible-error-ts) | .ts | Errores de dominio | Dominio | 404 tanto si no existe como si existe pero no está visible públicamente — nunca revela cuál, mismo criterio ya usado por el catálogo de Teléfonos. | 1 internas | 4 | Media (4 consumidores) |
| [catalog-product-request-not-allowed.error.ts](#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-request-not-allowed-error-ts) | .ts | Errores de dominio | Dominio | Librería es puramente informativa — nunca genera solicitudes de interés. | 1 internas | 1 | Baja (1 consumidores) |
| [catalog-product-request-not-found.error.ts](#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-request-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `CatalogProductRequestNotFoundError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-catalog-product-image.error.ts](#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-invalid-catalog-product-image-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidCatalogProductImageError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [invalid-product-for-catalog.error.ts](#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-invalid-product-for-catalog-error-ts) | .ts | Errores de dominio | Dominio | El producto de Inventario referenciado no existe o está inactivo — nunca se publica un producto que Inventario ya no reconoce. | 1 internas | 1 | Baja (1 consumidores) |
| [catalog-product-request.repository.ts](#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-request-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateCatalogProductRequestData`, `ListCatalogProductRequestsOptions`, `UpdateCatalogProductRequestStatusData`, `CatalogProductRequestRepository`, `CATALOG_PRODUCT_REQUEST_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [catalog-product.repository.ts](#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateCatalogProductData`, `UpdateCatalogProductData`, `ListCatalogProductsOptions`, `ReorderCatalogProductItem`, `CatalogProductImageBytes` (sin comentario de documentación en el código). | 1 internas | 15 | Alta (15 consumidores) |
| [catalog-product-request.mapper.ts](#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-request-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `CatalogProductRequestMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [catalog-product-request.orm-entity.ts](#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-request-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `CatalogProductRequestOrmEntity` (sin comentario de documentación en el código). | 3 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [catalog-product.mapper.ts](#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `CatalogProductMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [catalog-product.orm-entity.ts](#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | `product` es una relación `ManyToOne` eager a `ProductOrmEntity` — un import de tipo directo, no un import del `ProductsModule` (mismo patrón ya documentado en este código para `SaleOrmEntity`/`SaleDetailOrmEntity` → `ProductOrmEntity`: metadata de relación a nivel de TypeScript, nunca un acoplamiento de módulos NestJS). | 3 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [typeorm-catalog-product-request.repository.ts](#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-request-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmCatalogProductRequestRepository` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-catalog-product.repository.ts](#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmCatalogProductRepository` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [catalog-product-requests.controller.ts](#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-product-requests-controller-ts) | .ts | Controlador | Presentación | Solicitudes de interés de "Variedades y Accesorios" — Librería nunca genera filas aquí. | 10 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [catalog-products.controller.ts](#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts) | .ts | Controlador | Presentación | "Catálogo → Librería" y "Catálogo → Variedades y Accesorios" comparten este mismo controller (la sección se filtra por query param/body) — igual que en Teléfonos, admin-only end-to-end (incluido el listado, porque expone publicaciones inactivas). | 17 internas; ext.: @nestjs/common, @nestjs/platform-express | 1 | Media (controlador) |
| [public-product-catalog.controller.ts](#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts) | .ts | Controlador | Presentación | Público, sin guard — mismo prefijo `public-catalog` que Teléfonos, pero un controller distinto con sub-rutas propias (`products*`), así que no choca con `PublicCatalogController` (`phones*`). | 10 internas; ext.: @nestjs/common, @nestjs/throttler, express | 1 | Media (controlador) |
| [catalog-product-request.response.dto.ts](#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-catalog-product-request-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `CatalogProductRequestResponseDto` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [catalog-product.response.dto.ts](#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-catalog-product-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `CatalogProductResponseDto` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [create-catalog-product-request.request.dto.ts](#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-create-catalog-product-request-request-dto-ts) | .ts | DTO de entrada | Presentación | Público, sin autenticación. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [create-catalog-product.request.dto.ts](#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-create-catalog-product-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateCatalogProductRequestDto`, `CATALOG_PRODUCT_SECTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-catalog-product-requests.query.dto.ts](#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-list-catalog-product-requests-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListCatalogProductRequestsQueryDto`, `STATUSES` (sin comentario de documentación en el código). | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-catalog-products.query.dto.ts](#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-list-catalog-products-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListCatalogProductsQueryDto`, `CATALOG_PRODUCT_SECTIONS` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [public-catalog-product.response.dto.ts](#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-public-catalog-product-response-dto-ts) | .ts | DTO de respuesta | Presentación | Backs Librería/Variedades en la landing — sin costo/stock/proveedor/estado administrativo. | 1 internas | 1 | Baja (1 consumidores) |
| [reorder-catalog-products.request.dto.ts](#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-reorder-catalog-products-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `ReorderCatalogProductItemDto`, `ReorderCatalogProductsRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [update-catalog-product-request-status.request.dto.ts](#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-update-catalog-product-request-status-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateCatalogProductRequestStatusRequestDto`, `STATUSES` (sin comentario de documentación en el código). | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [update-catalog-product.request.dto.ts](#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-update-catalog-product-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateCatalogProductRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [product-catalog.module.ts](#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts) | .ts | Módulo | Arranque / configuración | "Catálogo de Librería" y "Variedades y Accesorios" — una sola sección discriminada por `section`, referenciando `products.id` (nunca copia datos de Inventario). | 27 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-output-ts"></a>

### catalog-product-output.ts

- **Ruta:** [catalog-product-output.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/dtos/catalog-product-output.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/dtos/catalog-product-output.ts`, 91 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Shape admin — incluye estado y datos de auditoría, nunca expuesto sin autenticación.
- **Depende de (archivos del proyecto):** [catalog-product.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts)
- **Consumidores:** [create-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-use-case-ts), [get-catalog-product-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-by-id-use-case-ts), [get-published-catalog-product-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-published-catalog-product-by-id-use-case-ts), [list-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-catalog-products-use-case-ts), [list-published-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-published-catalog-products-use-case-ts), [update-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CatalogProductOutput` (L4): Shape admin — incluye estado y datos de auditoría, nunca expuesto sin autenticación. — miembros: `id`, `productId`, `section`, `catalogDescription`, `hasImage`, `isActive`, `sortOrder`, `likesCount`, `productName`, `productPrice`, `productIsActive`, `categoryName`, `businessName`, `unitOfMeasureAbbreviation`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface PublicCatalogProductOutput` (L34): Shape público — backs Librería/Variedades en la landing. — miembros: `id`, `section`, `name`, `price`, `categoryName`, `description`, `hasImage`, `likesCount`, `liked`, `unitOfMeasureAbbreviation`
#### Función `toCatalogProductOutput` (L48–71)

- **Tipo:** función exportada
- **Firma:** `toCatalogProductOutput(product: CatalogProduct): CatalogProductOutput` — [catalog-product-output.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/dtos/catalog-product-output.ts#L48)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-use-case-ts), [get-catalog-product-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-by-id-use-case-ts), [update-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-use-case-ts)

#### Función `toPublicCatalogProductOutput` (L73–90)

- **Tipo:** función exportada
- **Firma:** `toPublicCatalogProductOutput(product: CatalogProduct, likesCount: number, liked: boolean): PublicCatalogProductOutput` — [catalog-product-output.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/dtos/catalog-product-output.ts#L73)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-published-catalog-product-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-published-catalog-product-by-id-use-case-ts), [list-published-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-published-catalog-products-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-request-output-ts"></a>

### catalog-product-request-output.ts

- **Ruta:** [catalog-product-request-output.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/dtos/catalog-product-request-output.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/dtos/catalog-product-request-output.ts`, 36 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** DTO de salida (aplicación): declara `toCatalogProductRequestOutput`, `CatalogProductRequestOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product-request.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-request-entity-ts)
- **Consumidores:** [create-catalog-product-request.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-request-use-case-ts), [get-catalog-product-request-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-request-by-id-use-case-ts), [list-catalog-product-requests.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-catalog-product-requests-use-case-ts), [update-catalog-product-request-status.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-request-status-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CatalogProductRequestOutput` (L3): sin documentación — miembros: `id`, `catalogProductId`, `productName`, `price`, `customerName`, `customerPhone`, `status`, `observation`, `createdAt`, `updatedAt`, `updatedBy`, `updatedByUsername`
#### Función `toCatalogProductRequestOutput` (L18–35)

- **Tipo:** función exportada
- **Firma:** `toCatalogProductRequestOutput(request: CatalogProductRequest): CatalogProductRequestOutput` — [catalog-product-request-output.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/dtos/catalog-product-request-output.ts#L18)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-catalog-product-request.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-request-use-case-ts), [get-catalog-product-request-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-request-by-id-use-case-ts), [update-catalog-product-request-status.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-request-status-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-request-use-case-ts"></a>

### create-catalog-product-request.use-case.ts

- **Ruta:** [create-catalog-product-request.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/create-catalog-product-request.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/create-catalog-product-request.use-case.ts`, 60 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** "Lo quiero" para Variedades y Accesorios — el punto más sensible de este módulo.
- **Depende de (archivos del proyecto):** [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-request-repository-ts), [catalog-product-not-visible.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-visible-error-ts), [catalog-product-request-not-allowed.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-request-not-allowed-error-ts), [catalog-product-request-output.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-request-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateCatalogProductRequestInput` (L13): sin documentación — miembros: `catalogProductId`, `customerName`, `customerPhone`

#### Clase `CreateCatalogProductRequestUseCase` (L29–59)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Lo quiero" para Variedades y Accesorios — el punto más sensible de este módulo. Nunca confía en nada del cliente salvo nombre/teléfono (el DTO ni siquiera tiene un campo de precio/nombre de producto — ver `CreateCatalogProductRequestRequestDto`); el nombre/precio se releen de la publicación real y se congelan como snapshot. Rechaza explícitamente cualquier intento contra una publicación de sección `LIBRERIA` — esa sección es puramente informativa, nunca genera solicitudes. Deliberada- mente SIN nada de Krediya (Krediya es exclusiva de Teléfonos).
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REPOSITORY) catalogProductRepository: CatalogProductRepository`, `@Inject(CATALOG_PRODUCT_REQUEST_REPOSITORY) catalogProductRequestRepository: CatalogProductRequestRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 38–58 | `input: CreateCatalogProductRequestInput` | `Promise<CatalogProductRequestOutput>` |

##### `CreateCatalogProductRequestUseCase.execute`

- **Firma:** `execute(input: CreateCatalogProductRequestInput): Promise<CatalogProductRequestOutput>` — [create-catalog-product-request.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/create-catalog-product-request.use-case.ts#L38) (L38–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRepository.findById`, `new CatalogProductNotVisibleError`, `new CatalogProductRequestNotAllowedError`, `this.catalogProductRequestRepository.create`, `input.customerName.trim`, `input.customerPhone.trim`, `toCatalogProductRequestOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogProductNotVisibleError()`, `new CatalogProductRequestNotAllowedError()`
- **Consumidores:** [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-use-case-ts"></a>

### create-catalog-product.use-case.ts

- **Ruta:** [create-catalog-product.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/create-catalog-product.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/create-catalog-product.use-case.ts`, 48 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Publica un producto de Inventario en el catálogo — nunca copia sus datos, solo referencia `productId`.
- **Depende de (archivos del proyecto):** [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [catalog-product.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts), [invalid-product-for-catalog.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-invalid-product-for-catalog-error-ts), [catalog-product-output.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateCatalogProductInput` (L10): sin documentación — miembros: `productId`, `section`, `catalogDescription`, `userId`

#### Clase `CreateCatalogProductUseCase` (L23–47)

- **Decoradores:** `@Injectable()`
- **Propósito:** Publica un producto de Inventario en el catálogo — nunca copia sus datos, solo referencia `productId`. Valida contra `PRODUCT_REPOSITORY` (inyectado vía `ProductsModule`, ya exportado — no requirió ningún cambio ahí) que el producto exista y esté activo antes de publicarlo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REPOSITORY) catalogProductRepository: CatalogProductRepository`, `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 32–46 | `input: CreateCatalogProductInput` | `Promise<CatalogProductOutput>` |

##### `CreateCatalogProductUseCase.execute`

- **Firma:** `execute(input: CreateCatalogProductInput): Promise<CatalogProductOutput>` — [create-catalog-product.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/create-catalog-product.use-case.ts#L32) (L32–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.productRepository.findById`, `new InvalidProductForCatalogError`, `this.catalogProductRepository.create`, `input.catalogDescription?.trim`, `toCatalogProductOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidProductForCatalogError()`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-by-id-use-case-ts"></a>

### get-catalog-product-by-id.use-case.ts

- **Ruta:** [get-catalog-product-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-catalog-product-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-catalog-product-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Caso de uso: declara `GetCatalogProductByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product-not-found.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-found-error-ts), [catalog-product-output.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `GetCatalogProductByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REPOSITORY) catalogProductRepository: CatalogProductRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<CatalogProductOutput>` |

##### `GetCatalogProductByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<CatalogProductOutput>` — [get-catalog-product-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-catalog-product-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRepository.findById`, `new CatalogProductNotFoundError`, `toCatalogProductOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogProductNotFoundError(id)`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-image-use-case-ts"></a>

### get-catalog-product-image.use-case.ts

- **Ruta:** [get-catalog-product-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-catalog-product-image.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-catalog-product-image.use-case.ts`, 33 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Público, sin guard — pero valida que la publicación siga visible: desactivarla oculta también su imagen, no solo su ficha.
- **Depende de (archivos del proyecto):** [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product-not-visible.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-visible-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

**Interfaces, tipos y enums:**

- `interface CatalogProductImageBytesOutput` (L6): sin documentación — miembros: `data`, `mimeType`

#### Clase `GetCatalogProductImageUseCase` (L12–32)

- **Decoradores:** `@Injectable()`
- **Propósito:** Público, sin guard — pero valida que la publicación siga visible: desactivarla oculta también su imagen, no solo su ficha.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REPOSITORY) catalogProductRepository: CatalogProductRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–31 | `catalogProductId: string` | `Promise<CatalogProductImageBytesOutput>` |

##### `GetCatalogProductImageUseCase.execute`

- **Firma:** `execute(catalogProductId: string): Promise<CatalogProductImageBytesOutput>` — [get-catalog-product-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-catalog-product-image.use-case.ts#L19) (L19–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRepository.findById`, `new CatalogProductNotVisibleError`, `this.catalogProductRepository.getImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogProductNotVisibleError()`
- **Consumidores:** [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-request-by-id-use-case-ts"></a>

### get-catalog-product-request-by-id.use-case.ts

- **Ruta:** [get-catalog-product-request-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-catalog-product-request-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-catalog-product-request-by-id.use-case.ts`, 25 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Caso de uso: declara `GetCatalogProductRequestByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-request-repository-ts), [catalog-product-request-not-found.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-request-not-found-error-ts), [catalog-product-request-output.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-request-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-product-requests.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-product-requests-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `GetCatalogProductRequestByIdUseCase` (L10–24)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REQUEST_REPOSITORY) catalogProductRequestRepository: CatalogProductRequestRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–23 | `id: string` | `Promise<CatalogProductRequestOutput>` |

##### `GetCatalogProductRequestByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<CatalogProductRequestOutput>` — [get-catalog-product-request-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-catalog-product-request-by-id.use-case.ts#L17) (L17–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRequestRepository.findById`, `new CatalogProductRequestNotFoundError`, `toCatalogProductRequestOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogProductRequestNotFoundError(id)`
- **Consumidores:** [catalog-product-requests.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-product-requests-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-published-catalog-product-by-id-use-case-ts"></a>

### get-published-catalog-product-by-id.use-case.ts

- **Ruta:** [get-published-catalog-product-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-published-catalog-product-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-published-catalog-product-by-id.use-case.ts`, 35 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Caso de uso: declara `GetPublishedCatalogProductByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product-not-visible.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-visible-error-ts), [catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts), [catalog-product-output.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `GetPublishedCatalogProductByIdUseCase` (L12–34)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REPOSITORY) catalogProductRepository: CatalogProductRepository`, `@Inject(CATALOG_LIKE_REPOSITORY) catalogLikeRepository: CatalogLikeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 21–33 | `id: string`, `visitorId?: string` | `Promise<PublicCatalogProductOutput>` |

##### `GetPublishedCatalogProductByIdUseCase.execute`

- **Firma:** `execute(id: string, visitorId?: string): Promise<PublicCatalogProductOutput>` — [get-published-catalog-product-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-published-catalog-product-by-id.use-case.ts#L21) (L21–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRepository.findById`, `new CatalogProductNotVisibleError`, `Promise.all`, `this.catalogLikeRepository.getCount`, `this.catalogLikeRepository.getLikedEntityIds`, `Promise.resolve`, `new Set`, `toPublicCatalogProductOutput`, `likedIds.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogProductNotVisibleError()`
- **Consumidores:** [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-like-catalog-product-use-case-ts"></a>

### like-catalog-product.use-case.ts

- **Ruta:** [like-catalog-product.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/like-catalog-product.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/like-catalog-product.use-case.ts`, 46 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** "Me gusta" público — Librería y Variedades por igual (comparten tabla).
- **Depende de (archivos del proyecto):** [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product-not-visible.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-visible-error-ts), [catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `LikeCatalogProductUseCase` (L19–45)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Me gusta" público — Librería y Variedades por igual (comparten tabla). El conteo real y el anti-duplicado por visitante viven en `catalog_likes` (ver `CatalogLikeRepository`), nunca en un contador confiado del frontend. `LIKE` exige visibilidad pública; `UNLIKE` no — un visitante siempre puede deshacer su propio like aunque el producto ya no esté visible, y los likes históricos nunca se borran al desactivar.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REPOSITORY) catalogProductRepository: CatalogProductRepository`, `@Inject(CATALOG_LIKE_REPOSITORY) catalogLikeRepository: CatalogLikeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 28–44 | `id: string`, `visitorId: string`, `action: CatalogLikeAction` | `Promise<{ likesCount: number; liked: boolean }>` |

##### `LikeCatalogProductUseCase.execute`

- **Firma:** `execute(id: string, visitorId: string, action: CatalogLikeAction): Promise<{ likesCount: number; liked: boolean }>` — [like-catalog-product.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/like-catalog-product.use-case.ts#L28) (L28–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRepository.findById`, `new CatalogProductNotVisibleError`, `this.catalogLikeRepository.like`, `this.catalogLikeRepository.unlike`, `this.catalogLikeRepository.getCount`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogProductNotVisibleError()`
- **Consumidores:** [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-catalog-product-requests-use-case-ts"></a>

### list-catalog-product-requests.use-case.ts

- **Ruta:** [list-catalog-product-requests.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/list-catalog-product-requests.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/list-catalog-product-requests.use-case.ts`, 26 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Caso de uso: declara `ListCatalogProductRequestsUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-request-repository-ts), [catalog-product-request-output.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-request-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-product-requests.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-product-requests-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `ListCatalogProductRequestsUseCase` (L12–25)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REQUEST_REPOSITORY) catalogProductRequestRepository: CatalogProductRequestRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–24 | `options?: ListCatalogProductRequestsOptions` | `Promise<CatalogProductRequestOutput[]>` |

##### `ListCatalogProductRequestsUseCase.execute`

- **Firma:** `execute(options?: ListCatalogProductRequestsOptions): Promise<CatalogProductRequestOutput[]>` — [list-catalog-product-requests.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/list-catalog-product-requests.use-case.ts#L19) (L19–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRequestRepository.findAll`, `requests.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-product-requests.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-product-requests-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-catalog-products-use-case-ts"></a>

### list-catalog-products.use-case.ts

- **Ruta:** [list-catalog-products.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/list-catalog-products.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/list-catalog-products.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Listado admin — una sección a la vez (Librería o Variedades), incluye inactivos opcionalmente.
- **Depende de (archivos del proyecto):** [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product-output.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `ListCatalogProductsUseCase` (L10–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Listado admin — una sección a la vez (Librería o Variedades), incluye inactivos opcionalmente.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REPOSITORY) catalogProductRepository: CatalogProductRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–20 | `options: ListCatalogProductsOptions` | `Promise<CatalogProductOutput[]>` |

##### `ListCatalogProductsUseCase.execute`

- **Firma:** `execute(options: ListCatalogProductsOptions): Promise<CatalogProductOutput[]>` — [list-catalog-products.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/list-catalog-products.use-case.ts#L17) (L17–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRepository.findAll`, `products.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-published-catalog-products-use-case-ts"></a>

### list-published-catalog-products.use-case.ts

- **Ruta:** [list-published-catalog-products.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/list-published-catalog-products.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/list-published-catalog-products.use-case.ts`, 39 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Backs Librería/Variedades en la landing — solo publicaciones activas cuyo producto en Inventario también sigue activo.
- **Depende de (archivos del proyecto):** [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts), [catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts), [catalog-product-output.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `ListPublishedCatalogProductsUseCase` (L13–38)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs Librería/Variedades en la landing — solo publicaciones activas cuyo producto en Inventario también sigue activo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REPOSITORY) catalogProductRepository: CatalogProductRepository`, `@Inject(CATALOG_LIKE_REPOSITORY) catalogLikeRepository: CatalogLikeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 22–37 | `section: CatalogProductSection`, `visitorId?: string` | `Promise<PublicCatalogProductOutput[]>` |

##### `ListPublishedCatalogProductsUseCase.execute`

- **Firma:** `execute(section: CatalogProductSection, visitorId?: string): Promise<PublicCatalogProductOutput[]>` — [list-published-catalog-products.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/list-published-catalog-products.use-case.ts#L22) (L22–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRepository.findPublished`, `products.map`, `Promise.all`, `this.catalogLikeRepository.getCountsBatch`, `this.catalogLikeRepository.getLikedEntityIds`, `Promise.resolve`, `new Set`, `toPublicCatalogProductOutput`, `counts.get`, `likedIds.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-remove-catalog-product-image-use-case-ts"></a>

### remove-catalog-product-image.use-case.ts

- **Ruta:** [remove-catalog-product-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/remove-catalog-product-image.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/remove-catalog-product-image.use-case.ts`, 21 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Caso de uso: declara `RemoveCatalogProductImageUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product-not-found.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `RemoveCatalogProductImageUseCase` (L6–20)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REPOSITORY) catalogProductRepository: CatalogProductRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 13–19 | `id: string`, `userId: string` | `Promise<void>` |

##### `RemoveCatalogProductImageUseCase.execute`

- **Firma:** `execute(id: string, userId: string): Promise<void>` — [remove-catalog-product-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/remove-catalog-product-image.use-case.ts#L13) (L13–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRepository.findById`, `new CatalogProductNotFoundError`, `this.catalogProductRepository.removeImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogProductNotFoundError(id)`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-reorder-catalog-products-use-case-ts"></a>

### reorder-catalog-products.use-case.ts

- **Ruta:** [reorder-catalog-products.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/reorder-catalog-products.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/reorder-catalog-products.use-case.ts`, 27 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Admin-only, secuencial, sin concurrencia esperada — un `UPDATE` plano por fila dentro de una transacción, sin necesidad de stored function (misma convención ya usada en Teléfonos).
- **Depende de (archivos del proyecto):** [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product-not-found.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `ReorderCatalogProductsUseCase` (L10–26)

- **Decoradores:** `@Injectable()`
- **Propósito:** Admin-only, secuencial, sin concurrencia esperada — un `UPDATE` plano por fila dentro de una transacción, sin necesidad de stored function (misma convención ya usada en Teléfonos).
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REPOSITORY) catalogProductRepository: CatalogProductRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–25 | `items: ReorderCatalogProductItem[]` | `Promise<void>` |

##### `ReorderCatalogProductsUseCase.execute`

- **Firma:** `execute(items: ReorderCatalogProductItem[]): Promise<void>` — [reorder-catalog-products.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/reorder-catalog-products.use-case.ts#L17) (L17–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRepository.findById`, `new CatalogProductNotFoundError`, `this.catalogProductRepository.reorder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogProductNotFoundError(item.id)`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-active-use-case-ts"></a>

### set-catalog-product-active.use-case.ts

- **Ruta:** [set-catalog-product-active.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/set-catalog-product-active.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/set-catalog-product-active.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Un solo flag activo/inactivo controla visibilidad pública y gestión admin — a diferencia de Teléfonos, este catálogo no pidió un paso de "publicar" separado.
- **Depende de (archivos del proyecto):** [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product-not-found.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `SetCatalogProductActiveUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Un solo flag activo/inactivo controla visibilidad pública y gestión admin — a diferencia de Teléfonos, este catálogo no pidió un paso de "publicar" separado.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REPOSITORY) catalogProductRepository: CatalogProductRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string`, `isActive: boolean`, `userId: string` | `Promise<void>` |

##### `SetCatalogProductActiveUseCase.execute`

- **Firma:** `execute(id: string, isActive: boolean, userId: string): Promise<void>` — [set-catalog-product-active.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/set-catalog-product-active.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRepository.findById`, `new CatalogProductNotFoundError`, `this.catalogProductRepository.setActive`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogProductNotFoundError(id)`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-image-use-case-ts"></a>

### set-catalog-product-image.use-case.ts

- **Ruta:** [set-catalog-product-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/set-catalog-product-image.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/set-catalog-product-image.use-case.ts`, 43 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Subir = reemplazar — una sola imagen por publicación, sin galería.
- **Depende de (archivos del proyecto):** [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product-not-found.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-found-error-ts), [assert-valid-catalog-product-image.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-utils-assert-valid-catalog-product-image-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

**Interfaces, tipos y enums:**

- `interface SetCatalogProductImageInput` (L10): sin documentación — miembros: `catalogProductId`, `image`, `userId`

#### Clase `SetCatalogProductImageUseCase` (L17–42)

- **Decoradores:** `@Injectable()`
- **Propósito:** Subir = reemplazar — una sola imagen por publicación, sin galería.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REPOSITORY) catalogProductRepository: CatalogProductRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 24–41 | `input: SetCatalogProductImageInput` | `Promise<void>` |

##### `SetCatalogProductImageUseCase.execute`

- **Firma:** `execute(input: SetCatalogProductImageInput): Promise<void>` — [set-catalog-product-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/set-catalog-product-image.use-case.ts#L24) (L24–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidCatalogProductImage`, `this.catalogProductRepository.findById`, `new CatalogProductNotFoundError`, `this.catalogProductRepository.setImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogProductNotFoundError(input.catalogProductId)`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-request-status-use-case-ts"></a>

### update-catalog-product-request-status.use-case.ts

- **Ruta:** [update-catalog-product-request-status.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/update-catalog-product-request-status.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/update-catalog-product-request-status.use-case.ts`, 40 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Caso de uso: declara `UpdateCatalogProductRequestStatusUseCase`, `UpdateCatalogProductRequestStatusInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-request-repository-ts), [catalog-product-request-not-found.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-request-not-found-error-ts), [catalog-product-request.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-request-entity-ts), [catalog-product-request-output.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-request-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-product-requests.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-product-requests-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

**Interfaces, tipos y enums:**

- `interface UpdateCatalogProductRequestStatusInput` (L11): sin documentación — miembros: `status`, `observation`, `userId`

#### Clase `UpdateCatalogProductRequestStatusUseCase` (L17–39)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REQUEST_REPOSITORY) catalogProductRequestRepository: CatalogProductRequestRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 24–38 | `id: string`, `input: UpdateCatalogProductRequestStatusInput` | `Promise<CatalogProductRequestOutput>` |

##### `UpdateCatalogProductRequestStatusUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateCatalogProductRequestStatusInput): Promise<CatalogProductRequestOutput>` — [update-catalog-product-request-status.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/update-catalog-product-request-status.use-case.ts#L24) (L24–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRequestRepository.findById`, `new CatalogProductRequestNotFoundError`, `this.catalogProductRequestRepository.updateStatus`, `toCatalogProductRequestOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogProductRequestNotFoundError(id)`
- **Consumidores:** [catalog-product-requests.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-product-requests-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-use-case-ts"></a>

### update-catalog-product.use-case.ts

- **Ruta:** [update-catalog-product.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/update-catalog-product.use-case.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/update-catalog-product.use-case.ts`, 37 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Solo edita la descripción de catálogo — nombre/precio/categoría siempre se leen en vivo de Inventario, nunca se editan aquí.
- **Depende de (archivos del proyecto):** [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product-not-found.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-found-error-ts), [catalog-product-output.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

**Interfaces, tipos y enums:**

- `interface UpdateCatalogProductInput` (L7): sin documentación — miembros: `catalogDescription`, `userId`

#### Clase `UpdateCatalogProductUseCase` (L13–36)

- **Decoradores:** `@Injectable()`
- **Propósito:** Solo edita la descripción de catálogo — nombre/precio/categoría siempre se leen en vivo de Inventario, nunca se editan aquí.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PRODUCT_REPOSITORY) catalogProductRepository: CatalogProductRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–35 | `id: string`, `input: UpdateCatalogProductInput` | `Promise<CatalogProductOutput>` |

##### `UpdateCatalogProductUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateCatalogProductInput): Promise<CatalogProductOutput>` — [update-catalog-product.use-case.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/update-catalog-product.use-case.ts#L20) (L20–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogProductRepository.findById`, `new CatalogProductNotFoundError`, `this.catalogProductRepository.update`, `input.catalogDescription?.trim`, `toCatalogProductOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.catalogProductRepository.update`
- **Errores que lanza:** `new CatalogProductNotFoundError(id)`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-application-utils-assert-valid-catalog-product-image-ts"></a>

### assert-valid-catalog-product-image.ts

- **Ruta:** [assert-valid-catalog-product-image.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/utils/assert-valid-catalog-product-image.ts) (`comercial-jhoel-api/src/modules/product-catalog/application/utils/assert-valid-catalog-product-image.ts`, 27 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Utilidad: declara `assertValidCatalogProductImage`, `UploadedCatalogProductImage`, `MAX_CATALOG_PRODUCT_IMAGE_SIZE_BYTES`, `ALLOWED_MIME_TYPES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [invalid-catalog-product-image.error.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-invalid-catalog-product-image-error-ts)
- **Consumidores:** [set-catalog-product-image.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-image-use-case-ts)

**Interfaces, tipos y enums:**

- `interface UploadedCatalogProductImage` (L8): sin documentación — miembros: `buffer`, `mimetype`, `size`

**Constantes exportadas:**

- `MAX_CATALOG_PRODUCT_IMAGE_SIZE_BYTES` (L4): Mismo techo que el resto de imágenes del proyecto (Teléfonos, DPI). = `5 * 1024 * 1024`
#### Función `assertValidCatalogProductImage` (L14–26)

- **Tipo:** función exportada
- **Firma:** `assertValidCatalogProductImage(file: UploadedCatalogProductImage): void` — [assert-valid-catalog-product-image.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/application/utils/assert-valid-catalog-product-image.ts#L14)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `ALLOWED_MIME_TYPES.has`, `new InvalidCatalogProductImageError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidCatalogProductImageError('La imagen debe ser JPG, PNG o WEBP.')`, `new InvalidCatalogProductImageError('La imagen no puede superar los 5 MB.')`, `new InvalidCatalogProductImageError('La imagen está vacía.')`
- **Consumidores:** [set-catalog-product-image.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-image-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-request-entity-ts"></a>

### catalog-product-request.entity.ts

- **Ruta:** [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts) (`comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts`, 87 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Lead de "Lo quiero" para Variedades y Accesorios — deliberadamente SIN nada de Krediya (sin `creditAvailable`, sin distinción compra/crédito): Krediya es exclusiva de Teléfonos, nunca se copia esa lógica aquí.
- **Consumidores:** [catalog-product-request-output.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-request-output-ts), [update-catalog-product-request-status.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-request-status-use-case-ts), [catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-request-repository-ts), [catalog-product-request.mapper.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-request-mapper-ts), [catalog-product-request.orm-entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-request-orm-entity-ts), [typeorm-catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-request-repository-ts), [catalog-product-request.response.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-catalog-product-request-response-dto-ts), [list-catalog-product-requests.query.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-list-catalog-product-requests-query-dto-ts), [update-catalog-product-request-status.request.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-update-catalog-product-request-status-request-dto-ts)

**Interfaces, tipos y enums:**

- `interface CatalogProductRequestProps` (L8): sin documentación — miembros: `id`, `catalogProductId`, `productName`, `price`, `customerName`, `customerPhone`, `status`, `observation`, `createdAt`, `updatedAt`, `updatedBy`, `updatedByUsername`
- `type CatalogProductRequestStatus` (L1) = `\| 'NUEVA' \| 'CONTACTADA' \| 'EN_PROCESO' \| 'ATENDIDA' \| 'CANCELADA'`

#### Clase `CatalogProductRequest` (L32–86)

- **Propósito:** Lead de "Lo quiero" para Variedades y Accesorios — deliberadamente SIN nada de Krediya (sin `creditAvailable`, sin distinción compra/crédito): Krediya es exclusiva de Teléfonos, nunca se copia esa lógica aquí. Nunca se crea para una publicación de sección `LIBRERIA` (validado en `CreateCatalogProductRequestUseCase`) — Librería es puramente informativa.
- **Dependencias inyectadas (constructor):** `props: CatalogProductRequestProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 35–37 | `props: CatalogProductRequestProps` | `CatalogProductRequest` |
| `id` | getter public | 39–41 | — | `string` |
| `catalogProductId` | getter public | 43–45 | — | `string` |
| `productName` | getter public | 47–49 | — | `string` |
| `price` | getter public | 51–53 | — | `number` |
| `customerName` | getter public | 55–57 | — | `string` |
| `customerPhone` | getter public | 59–61 | — | `string` |
| `status` | getter public | 63–65 | — | `CatalogProductRequestStatus` |
| `observation` | getter public | 67–69 | — | `string \| null` |
| `createdAt` | getter public | 71–73 | — | `Date` |
| `updatedAt` | getter public | 75–77 | — | `Date` |
| `updatedBy` | getter public | 79–81 | — | `string \| null` |
| `updatedByUsername` | getter public | 83–85 | — | `string \| null` |

##### `CatalogProductRequest.create`

- **Firma:** `create(props: CatalogProductRequestProps): CatalogProductRequest` — [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new CatalogProductRequest`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-product-request.mapper.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-request-mapper-ts), [typeorm-catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-request-repository-ts)

##### `CatalogProductRequest.id`

- **Firma:** `id(): string` — [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequest.catalogProductId`

- **Firma:** `catalogProductId(): string` — [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequest.productName`

- **Firma:** `productName(): string` — [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequest.price`

- **Firma:** `price(): number` — [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequest.customerName`

- **Firma:** `customerName(): string` — [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequest.customerPhone`

- **Firma:** `customerPhone(): string` — [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequest.status`

- **Firma:** `status(): CatalogProductRequestStatus` — [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequest.observation`

- **Firma:** `observation(): string \| null` — [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequest.createdAt`

- **Firma:** `createdAt(): Date` — [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequest.updatedAt`

- **Firma:** `updatedAt(): Date` — [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequest.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequest.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [catalog-product-request.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product-request.entity.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts"></a>

### catalog-product.entity.ts

- **Ruta:** [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts) (`comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts`, 134 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Una "publicación de catálogo" — nunca un producto en sí.
- **Consumidores:** [catalog-product-output.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-dtos-catalog-product-output-ts), [create-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-use-case-ts), [list-published-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-published-catalog-products-use-case-ts), [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product.mapper.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-mapper-ts), [catalog-product.orm-entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-orm-entity-ts), [typeorm-catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-repository-ts), [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts), [catalog-product.response.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-catalog-product-response-dto-ts), [create-catalog-product.request.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-create-catalog-product-request-dto-ts), [list-catalog-products.query.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-list-catalog-products-query-dto-ts), [public-catalog-product.response.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-public-catalog-product-response-dto-ts)

**Interfaces, tipos y enums:**

- `interface CatalogProductProps` (L3): sin documentación — miembros: `id`, `productId`, `section`, `catalogDescription`, `hasImage`, `isActive`, `sortOrder`, `likesCount`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`, `productName`, `productPrice`, `productIsActive`, `categoryName`, `businessName`, `unitOfMeasureAbbreviation`
- `type CatalogProductSection` (L1) = `'LIBRERIA' \| 'VARIEDADES_ACCESORIOS'`

#### Clase `CatalogProduct` (L42–133)

- **Propósito:** Una "publicación de catálogo" — nunca un producto en sí. Referencia `products.id` (ver `CatalogProductRepository`); Librería y Variedades y Accesorios comparten esta misma entidad, distinguidas por `section` — comparten ~95% de la forma (imagen, descripción, orden, activo), y lo que no comparten (WhatsApp/solicitudes solo en Variedades) se aplica como regla de negocio en la capa de aplicación, nunca aquí.
- **Dependencias inyectadas (constructor):** `props: CatalogProductProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 45–47 | `props: CatalogProductProps` | `CatalogProduct` |
| `id` | getter public | 49–51 | — | `string` |
| `productId` | getter public | 53–55 | — | `string` |
| `section` | getter public | 57–59 | — | `CatalogProductSection` |
| `catalogDescription` | getter public | 61–63 | — | `string \| null` |
| `hasImage` | getter public | 65–67 | — | `boolean` |
| `isActive` | getter public | 69–71 | — | `boolean` |
| `sortOrder` | getter public | 73–75 | — | `number` |
| `likesCount` | getter public | 77–79 | — | `number` |
| `createdAt` | getter public | 81–83 | — | `Date` |
| `updatedAt` | getter public | 85–87 | — | `Date` |
| `createdBy` | getter public | 89–91 | — | `string` |
| `createdByUsername` | getter public | 93–95 | — | `string` |
| `updatedBy` | getter public | 97–99 | — | `string \| null` |
| `updatedByUsername` | getter public | 101–103 | — | `string \| null` |
| `productName` | getter public | 105–107 | — | `string` |
| `productPrice` | getter public | 109–111 | — | `number` |
| `productIsActive` | getter public | 113–115 | — | `boolean` |
| `categoryName` | getter public | 117–119 | — | `string` |
| `businessName` | getter public | 121–123 | — | `string` |
| `unitOfMeasureAbbreviation` | getter public | 125–127 | — | `string \| null` |
| `isPubliclyVisible` | getter public | 130–132 | — | `boolean` |

##### `CatalogProduct.create`

- **Firma:** `create(props: CatalogProductProps): CatalogProduct` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new CatalogProduct`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-use-case-ts), [catalog-product.mapper.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-mapper-ts), [typeorm-catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-repository-ts)

##### `CatalogProduct.id`

- **Firma:** `id(): string` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.productId`

- **Firma:** `productId(): string` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.section`

- **Firma:** `section(): CatalogProductSection` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.catalogDescription`

- **Firma:** `catalogDescription(): string \| null` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.hasImage`

- **Firma:** `hasImage(): boolean` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L65) (L65–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.isActive`

- **Firma:** `isActive(): boolean` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.sortOrder`

- **Firma:** `sortOrder(): number` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.likesCount`

- **Firma:** `likesCount(): number` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.createdAt`

- **Firma:** `createdAt(): Date` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.updatedAt`

- **Firma:** `updatedAt(): Date` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.createdBy`

- **Firma:** `createdBy(): string` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L89) (L89–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.createdByUsername`

- **Firma:** `createdByUsername(): string` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L93) (L93–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L97) (L97–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L101) (L101–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.productName`

- **Firma:** `productName(): string` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L105) (L105–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.productPrice`

- **Firma:** `productPrice(): number` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L109) (L109–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.productIsActive`

- **Firma:** `productIsActive(): boolean` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L113) (L113–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.categoryName`

- **Firma:** `categoryName(): string` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L117) (L117–119)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.businessName`

- **Firma:** `businessName(): string` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L121) (L121–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.unitOfMeasureAbbreviation`

- **Firma:** `unitOfMeasureAbbreviation(): string \| null` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L125) (L125–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProduct.isPubliclyVisible`

- **Firma:** `isPubliclyVisible(): boolean` — [catalog-product.entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/entities/catalog-product.entity.ts#L130) (L130–132)
- **Propósito / descripción:** Visible públicamente solo si la publicación Y el producto subyacente siguen activos.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-found-error-ts"></a>

### catalog-product-not-found.error.ts

- **Ruta:** [catalog-product-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/errors/catalog-product-not-found.error.ts) (`comercial-jhoel-api/src/modules/product-catalog/domain/errors/catalog-product-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Errores de dominio: declara `CatalogProductNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-catalog-product-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-by-id-use-case-ts), [remove-catalog-product-image.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-remove-catalog-product-image-use-case-ts), [reorder-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-reorder-catalog-products-use-case-ts), [set-catalog-product-active.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-active-use-case-ts), [set-catalog-product-image.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-image-use-case-ts), [update-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-use-case-ts)

#### Clase `CatalogProductNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-not-visible-error-ts"></a>

### catalog-product-not-visible.error.ts

- **Ruta:** [catalog-product-not-visible.error.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/errors/catalog-product-not-visible.error.ts) (`comercial-jhoel-api/src/modules/product-catalog/domain/errors/catalog-product-not-visible.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** 404 tanto si no existe como si existe pero no está visible públicamente — nunca revela cuál, mismo criterio ya usado por el catálogo de Teléfonos.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-catalog-product-request.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-request-use-case-ts), [get-catalog-product-image.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-image-use-case-ts), [get-published-catalog-product-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-published-catalog-product-by-id-use-case-ts), [like-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-like-catalog-product-use-case-ts)

#### Clase `CatalogProductNotVisibleError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** 404 tanto si no existe como si existe pero no está visible públicamente — nunca revela cuál, mismo criterio ya usado por el catálogo de Teléfonos.
<a id="f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-request-not-allowed-error-ts"></a>

### catalog-product-request-not-allowed.error.ts

- **Ruta:** [catalog-product-request-not-allowed.error.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/errors/catalog-product-request-not-allowed.error.ts) (`comercial-jhoel-api/src/modules/product-catalog/domain/errors/catalog-product-request-not-allowed.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Librería es puramente informativa — nunca genera solicitudes de interés.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-catalog-product-request.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-request-use-case-ts)

#### Clase `CatalogProductRequestNotAllowedError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Librería es puramente informativa — nunca genera solicitudes de interés.
<a id="f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-catalog-product-request-not-found-error-ts"></a>

### catalog-product-request-not-found.error.ts

- **Ruta:** [catalog-product-request-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/errors/catalog-product-request-not-found.error.ts) (`comercial-jhoel-api/src/modules/product-catalog/domain/errors/catalog-product-request-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Errores de dominio: declara `CatalogProductRequestNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-catalog-product-request-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-request-by-id-use-case-ts), [update-catalog-product-request-status.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-request-status-use-case-ts)

#### Clase `CatalogProductRequestNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-invalid-catalog-product-image-error-ts"></a>

### invalid-catalog-product-image.error.ts

- **Ruta:** [invalid-catalog-product-image.error.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/errors/invalid-catalog-product-image.error.ts) (`comercial-jhoel-api/src/modules/product-catalog/domain/errors/invalid-catalog-product-image.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Errores de dominio: declara `InvalidCatalogProductImageError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [assert-valid-catalog-product-image.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-utils-assert-valid-catalog-product-image-ts)

#### Clase `InvalidCatalogProductImageError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `message: string`
<a id="f-comercial-jhoel-api-src-modules-product-catalog-domain-errors-invalid-product-for-catalog-error-ts"></a>

### invalid-product-for-catalog.error.ts

- **Ruta:** [invalid-product-for-catalog.error.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/errors/invalid-product-for-catalog.error.ts) (`comercial-jhoel-api/src/modules/product-catalog/domain/errors/invalid-product-for-catalog.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** El producto de Inventario referenciado no existe o está inactivo — nunca se publica un producto que Inventario ya no reconoce.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-use-case-ts)

#### Clase `InvalidProductForCatalogError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** El producto de Inventario referenciado no existe o está inactivo — nunca se publica un producto que Inventario ya no reconoce.
<a id="f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-request-repository-ts"></a>

### catalog-product-request.repository.ts

- **Ruta:** [catalog-product-request.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/repositories/catalog-product-request.repository.ts) (`comercial-jhoel-api/src/modules/product-catalog/domain/repositories/catalog-product-request.repository.ts`, 41 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateCatalogProductRequestData`, `ListCatalogProductRequestsOptions`, `UpdateCatalogProductRequestStatusData`, `CatalogProductRequestRepository`, `CATALOG_PRODUCT_REQUEST_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product-request.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-request-entity-ts)
- **Consumidores:** [create-catalog-product-request.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-request-use-case-ts), [get-catalog-product-request-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-request-by-id-use-case-ts), [list-catalog-product-requests.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-catalog-product-requests-use-case-ts), [update-catalog-product-request-status.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-request-status-use-case-ts), [typeorm-catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-request-repository-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateCatalogProductRequestData` (L10): sin documentación — miembros: `catalogProductId`, `productName`, `price`, `customerName`, `customerPhone`
- `interface ListCatalogProductRequestsOptions` (L18): sin documentación — miembros: `status`, `startDate`, `endDate`
- `interface UpdateCatalogProductRequestStatusData` (L24): sin documentación — miembros: `status`, `observation`, `updatedBy`
- `interface CatalogProductRequestRepository` (L30): sin documentación — miembros: `findAll`, `findById`, `create`, `updateStatus`

**Constantes exportadas:**

- `CATALOG_PRODUCT_REQUEST_REPOSITORY` (L6) = `Symbol( 'CATALOG_PRODUCT_REQUEST_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts"></a>

### catalog-product.repository.ts

- **Ruta:** [catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/repositories/catalog-product.repository.ts) (`comercial-jhoel-api/src/modules/product-catalog/domain/repositories/catalog-product.repository.ts`, 58 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateCatalogProductData`, `UpdateCatalogProductData`, `ListCatalogProductsOptions`, `ReorderCatalogProductItem`, `CatalogProductImageBytes` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts)
- **Consumidores:** [create-catalog-product-request.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-request-use-case-ts), [create-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-use-case-ts), [get-catalog-product-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-by-id-use-case-ts), [get-catalog-product-image.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-image-use-case-ts), [get-published-catalog-product-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-published-catalog-product-by-id-use-case-ts), [like-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-like-catalog-product-use-case-ts), [list-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-catalog-products-use-case-ts), [list-published-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-published-catalog-products-use-case-ts), [remove-catalog-product-image.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-remove-catalog-product-image-use-case-ts), [reorder-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-reorder-catalog-products-use-case-ts), [set-catalog-product-active.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-active-use-case-ts), [set-catalog-product-image.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-image-use-case-ts), [update-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-use-case-ts), [typeorm-catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-repository-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateCatalogProductData` (L5): sin documentación — miembros: `productId`, `section`, `catalogDescription`, `createdBy`
- `interface UpdateCatalogProductData` (L12): sin documentación — miembros: `catalogDescription`, `updatedBy`
- `interface ListCatalogProductsOptions` (L17): sin documentación — miembros: `section`, `includeInactive`, `search`
- `interface ReorderCatalogProductItem` (L23): sin documentación — miembros: `id`, `sortOrder`
- `interface CatalogProductImageBytes` (L28): sin documentación — miembros: `data`, `mimeType`, `catalogProductId`
- `interface CatalogProductRepository` (L34): sin documentación — miembros: `findAll`, `findById`, `findPublished`, `findByProductAndSection`, `create`, `update`, `setActive`, `reorder`, `adjustLikes`, `setImage`, `removeImage`, `getImage`

**Constantes exportadas:**

- `CATALOG_PRODUCT_REPOSITORY` (L3) = `Symbol('CATALOG_PRODUCT_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-request-mapper-ts"></a>

### catalog-product-request.mapper.ts

- **Ruta:** [catalog-product-request.mapper.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/catalog-product-request.mapper.ts) (`comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/catalog-product-request.mapper.ts`, 22 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Mapper: declara `CatalogProductRequestMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product-request.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-request-entity-ts), [catalog-product-request.orm-entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-request-orm-entity-ts)
- **Consumidores:** [typeorm-catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-request-repository-ts)

#### Clase `CatalogProductRequestMapper` (L4–21)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–20 | `orm: CatalogProductRequestOrmEntity` | `CatalogProductRequest` |

##### `CatalogProductRequestMapper.toDomain`

- **Firma:** `toDomain(orm: CatalogProductRequestOrmEntity): CatalogProductRequest` — [catalog-product-request.mapper.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/catalog-product-request.mapper.ts#L5) (L5–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `CatalogProductRequest.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-request-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-request-orm-entity-ts"></a>

### catalog-product-request.orm-entity.ts

- **Ruta:** [catalog-product-request.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/catalog-product-request.orm-entity.ts) (`comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/catalog-product-request.orm-entity.ts`, 58 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `CatalogProductRequestOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [catalog-product-request.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-request-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [catalog-product-request.mapper.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-request-mapper-ts), [typeorm-catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-request-repository-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `CatalogProductRequestOrmEntity` (L14–57)

- **Decoradores:** `@Entity('catalog_product_requests')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column catalogProductId: string`, `@Column productName: string`, `@Column price: number`, `@Column customerName: string`, `@Column customerPhone: string`, `@Column status: CatalogProductRequestStatus`, `@Column observation: string \| null`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-mapper-ts"></a>

### catalog-product.mapper.ts

- **Ruta:** [catalog-product.mapper.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/catalog-product.mapper.ts) (`comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/catalog-product.mapper.ts`, 30 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Mapper: declara `CatalogProductMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts), [catalog-product.orm-entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-orm-entity-ts)
- **Consumidores:** [typeorm-catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-repository-ts)

#### Clase `CatalogProductMapper` (L4–29)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–28 | `orm: CatalogProductOrmEntity` | `CatalogProduct` |

##### `CatalogProductMapper.toDomain`

- **Firma:** `toDomain(orm: CatalogProductOrmEntity): CatalogProduct` — [catalog-product.mapper.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/catalog-product.mapper.ts#L5) (L5–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `CatalogProduct.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-orm-entity-ts"></a>

### catalog-product.orm-entity.ts

- **Ruta:** [catalog-product.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/catalog-product.orm-entity.ts) (`comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/catalog-product.orm-entity.ts`, 84 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** `product` es una relación `ManyToOne` eager a `ProductOrmEntity` — un import de tipo directo, no un import del `ProductsModule` (mismo patrón ya documentado en este código para `SaleOrmEntity`/`SaleDetailOrmEntity` → `ProductOrmEntity`: metadata de relación a nivel de TypeScript, nunca un acoplamiento de módulos NestJS).
- **Depende de (archivos del proyecto):** [product.orm-entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-orm-entity-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [catalog-product.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [catalog-product.mapper.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-mapper-ts), [typeorm-catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-repository-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `CatalogProductOrmEntity` (L28–83)

- **Decoradores:** `@Entity('catalog_products')`
- **Propósito:** `product` es una relación `ManyToOne` eager a `ProductOrmEntity` — un import de tipo directo, no un import del `ProductsModule` (mismo patrón ya documentado en este código para `SaleOrmEntity`/`SaleDetailOrmEntity` → `ProductOrmEntity`: metadata de relación a nivel de TypeScript, nunca un acoplamiento de módulos NestJS). Como `ProductOrmEntity.category`/ `.business`/`.unitOfMeasure` ya son eager, una sola consulta trae todo lo necesario para mostrar nombre/precio/categoría/negocio — sin duplicar ese dato en esta tabla. `imageData` usa `select: false` — nunca viaja en un `find()`/`findOne()` normal (listados de catálogo nunca cargan los bytes de imagen de cada fila); solo `getImage()` en el repositorio la selecciona explícitamente.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column productId: string`, `@ManyToOne product: ProductOrmEntity`, `@Column section: CatalogProductSection`, `@Column catalogDescription: string \| null`, `@Column imageData: Buffer \| null`, `@Column imageMimeType: string \| null`, `@Column imageSizeBytes: number \| null`, `@Column isActive: boolean`, `@Column sortOrder: number`, `@Column likesCount: number`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-request-repository-ts"></a>

### typeorm-catalog-product-request.repository.ts

- **Ruta:** [typeorm-catalog-product-request.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product-request.repository.ts) (`comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product-request.repository.ts`, 82 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmCatalogProductRequestRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product-request.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-request-entity-ts), [catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-request-repository-ts), [catalog-product-request.orm-entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-request-orm-entity-ts), [catalog-product-request.mapper.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-request-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `TypeOrmCatalogProductRequestRepository` (L14–81)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements CatalogProductRequestRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(CatalogProductRequestOrmEntity) repository: Repository<CatalogProductRequestOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 23–43 | `options?: ListCatalogProductRequestsOptions` | `Promise<CatalogProductRequest[]>` |
| `findById` | método public async | 45–48 | `id: string` | `Promise<CatalogProductRequest \| null>` |
| `create` | método public async | 50–63 | `data: CreateCatalogProductRequestData` | `Promise<CatalogProductRequest>` |
| `updateStatus` | método public async | 65–80 | `id: string`, `data: UpdateCatalogProductRequestStatusData` | `Promise<CatalogProductRequest>` |

##### `TypeOrmCatalogProductRequestRepository.findAll`

- **Firma:** `findAll(options?: ListCatalogProductRequestsOptions): Promise<CatalogProductRequest[]>` — [typeorm-catalog-product-request.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product-request.repository.ts#L23) (L23–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('request').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `query.andWhere`, `query.getMany`, `orms.map`, `CatalogProductRequestMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogProductRequestRepository.findById`

- **Firma:** `findById(id: string): Promise<CatalogProductRequest \| null>` — [typeorm-catalog-product-request.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product-request.repository.ts#L45) (L45–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `CatalogProductRequestMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmCatalogProductRequestRepository.create`

- **Firma:** `create(data: CreateCatalogProductRequestData): Promise<CatalogProductRequest>` — [typeorm-catalog-product-request.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product-request.repository.ts#L50) (L50–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.findById`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogProductRequestRepository.updateStatus`

- **Firma:** `updateStatus(id: string, data: UpdateCatalogProductRequestStatusData): Promise<CatalogProductRequest>` — [typeorm-catalog-product-request.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product-request.repository.ts#L65) (L65–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.findById`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-repository-ts"></a>

### typeorm-catalog-product.repository.ts

- **Ruta:** [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts) (`comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts`, 162 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmCatalogProductRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts), [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product.orm-entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-orm-entity-ts), [catalog-product.mapper.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `TypeOrmCatalogProductRepository` (L16–161)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements CatalogProductRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(CatalogProductOrmEntity) repository: Repository<CatalogProductOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `baseQuery` | método private | 23–32 | — | `SelectQueryBuilder<CatalogProductOrmEntity>` |
| `findAll` | método public async | 34–49 | `options: ListCatalogProductsOptions` | `Promise<CatalogProduct[]>` |
| `findById` | método public async | 51–54 | `id: string` | `Promise<CatalogProduct \| null>` |
| `findPublished` | método public async | 56–64 | `section: CatalogProductSection` | `Promise<CatalogProduct[]>` |
| `findByProductAndSection` | método public async | 66–75 | `productId: string`, `section: CatalogProductSection` | `Promise<CatalogProduct \| null>` |
| `create` | método public async | 77–88 | `data: CreateCatalogProductData` | `Promise<CatalogProduct>` |
| `update` | método public async | 90–99 | `id: string`, `data: UpdateCatalogProductData` | `Promise<CatalogProduct>` |
| `setActive` | método public async | 101–103 | `id: string`, `isActive: boolean`, `updatedBy: string` | `Promise<void>` |
| `reorder` | método public async | 105–113 | `items: ReorderCatalogProductItem[]` | `Promise<void>` |
| `adjustLikes` | método public async | 115–125 | `id: string`, `delta: number` | `Promise<number>` |
| `setImage` | método public async | 127–141 | `id: string`, `image: { data: Buffer; mimeType: string; sizeBytes: number }`, `updatedBy: string` | `Promise<void>` |
| `removeImage` | método public async | 143–148 | `id: string`, `updatedBy: string` | `Promise<void>` |
| `getImage` | método public async | 150–160 | `id: string` | `Promise<CatalogProductImageBytes \| null>` |

##### `TypeOrmCatalogProductRepository.baseQuery`

- **Firma:** `baseQuery(): SelectQueryBuilder<CatalogProductOrmEntity>` — [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts#L23) (L23–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('cp').leftJoinAndSelect`, `this.repository.createQueryBuilder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmCatalogProductRepository.findAll`

- **Firma:** `findAll(options: ListCatalogProductsOptions): Promise<CatalogProduct[]>` — [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts#L34) (L34–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere`, `this.baseQuery`, `query.andWhere`, `query.orderBy('cp.sortOrder', 'ASC').addOrderBy`, `query.orderBy`, `query.getMany`, `orms.map`, `CatalogProductMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogProductRepository.findById`

- **Firma:** `findById(id: string): Promise<CatalogProduct \| null>` — [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts#L51) (L51–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('cp.id = :id', { id }).getOne`, `this.baseQuery().andWhere`, `this.baseQuery`, `CatalogProductMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmCatalogProductRepository.findPublished`

- **Firma:** `findPublished(section: CatalogProductSection): Promise<CatalogProduct[]>` — [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts#L56) (L56–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('cp.section = :section', { section }).andWhere`, `this.baseQuery().andWhere`, `this.baseQuery`, `orms.map`, `CatalogProductMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogProductRepository.findByProductAndSection`

- **Firma:** `findByProductAndSection(productId: string, section: CatalogProductSection): Promise<CatalogProduct \| null>` — [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts#L66) (L66–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('cp.productId = :productId', { productId }).andWhere`, `this.baseQuery().andWhere`, `this.baseQuery`, `CatalogProductMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogProductRepository.create`

- **Firma:** `create(data: CreateCatalogProductData): Promise<CatalogProduct>` — [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts#L77) (L77–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.findById`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogProductRepository.update`

- **Firma:** `update(id: string, data: UpdateCatalogProductData): Promise<CatalogProduct>` — [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts#L90) (L90–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.findById`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogProductRepository.setActive`

- **Firma:** `setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>` — [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts#L101) (L101–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogProductRepository.reorder`

- **Firma:** `reorder(items: ReorderCatalogProductItem[]): Promise<void>` — [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts#L105) (L105–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.transaction`, `manager.update`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogProductRepository.adjustLikes`

- **Firma:** `adjustLikes(id: string, delta: number): Promise<number>` — [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts#L115) (L115–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`
- **Efectos secundarios:** Tablas en su SQL: `catalog_products`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogProductRepository.setImage`

- **Firma:** `setImage(id: string, image: { data: Buffer; mimeType: string; sizeBytes: number }, updatedBy: string): Promise<void>` — [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts#L127) (L127–141)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogProductRepository.removeImage`

- **Firma:** `removeImage(id: string, updatedBy: string): Promise<void>` — [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts#L143) (L143–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogProductRepository.getImage`

- **Firma:** `getImage(id: string): Promise<CatalogProductImageBytes \| null>` — [typeorm-catalog-product.repository.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts#L150) (L150–160)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('cp').select`, `this.repository.createQueryBuilder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-product-requests-controller-ts"></a>

### catalog-product-requests.controller.ts

- **Ruta:** [catalog-product-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-product-requests.controller.ts) (`comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-product-requests.controller.ts`, 62 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Solicitudes de interés de "Variedades y Accesorios" — Librería nunca genera filas aquí.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [list-catalog-product-requests.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-catalog-product-requests-use-case-ts), [get-catalog-product-request-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-request-by-id-use-case-ts), [update-catalog-product-request-status.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-request-status-use-case-ts), [list-catalog-product-requests.query.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-list-catalog-product-requests-query-dto-ts), [update-catalog-product-request-status.request.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-update-catalog-product-request-status-request-dto-ts), [catalog-product-request.response.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-catalog-product-request-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `CatalogProductRequestsController` (L23–61)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('catalog/product-requests')`
- **Propósito:** Solicitudes de interés de "Variedades y Accesorios" — Librería nunca genera filas aquí.
- **Dependencias inyectadas (constructor):** `listCatalogProductRequestsUseCase: ListCatalogProductRequestsUseCase`, `getCatalogProductRequestByIdUseCase: GetCatalogProductRequestByIdUseCase`, `updateCatalogProductRequestStatusUseCase: UpdateCatalogProductRequestStatusUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 33–42 | `query: ListCatalogProductRequestsQueryDto` | `Promise<CatalogProductRequestResponseDto[]>` |
| `findOne` | método public | 44–47 | `id: string` | `Promise<CatalogProductRequestResponseDto>` |
| `updateStatus` | método public | 49–60 | `id: string`, `dto: UpdateCatalogProductRequestStatusRequestDto`, `userId: string` | `Promise<CatalogProductRequestResponseDto>` |

##### `CatalogProductRequestsController.findAll`

- **Firma:** `findAll(query: ListCatalogProductRequestsQueryDto): Promise<CatalogProductRequestResponseDto[]>` — [catalog-product-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-product-requests.controller.ts#L33) (L33–42)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listCatalogProductRequestsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequestsController.findOne`

- **Firma:** `findOne(id: string): Promise<CatalogProductRequestResponseDto>` — [catalog-product-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-product-requests.controller.ts#L44) (L44–47)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getCatalogProductRequestByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequestsController.updateStatus`

- **Firma:** `updateStatus(id: string, dto: UpdateCatalogProductRequestStatusRequestDto, userId: string): Promise<CatalogProductRequestResponseDto>` — [catalog-product-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-product-requests.controller.ts#L49) (L49–60)
- **Decoradores:** `@Patch(':id/status')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateCatalogProductRequestStatusUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts"></a>

### catalog-products.controller.ts

- **Ruta:** [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts) (`comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts`, 151 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** "Catálogo → Librería" y "Catálogo → Variedades y Accesorios" comparten este mismo controller (la sección se filtra por query param/body) — igual que en Teléfonos, admin-only end-to-end (incluido el listado, porque expone publicaciones inactivas).
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-use-case-ts), [update-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-use-case-ts), [list-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-catalog-products-use-case-ts), [get-catalog-product-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-by-id-use-case-ts), [set-catalog-product-active.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-active-use-case-ts), [reorder-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-reorder-catalog-products-use-case-ts), [set-catalog-product-image.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-image-use-case-ts), [remove-catalog-product-image.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-remove-catalog-product-image-use-case-ts), [create-catalog-product.request.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-create-catalog-product-request-dto-ts), [update-catalog-product.request.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-update-catalog-product-request-dto-ts), [list-catalog-products.query.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-list-catalog-products-query-dto-ts) y 2 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/platform-express`
- **Consumidores:** [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

**Interfaces, tipos y enums:**

- `interface UploadedImageFile` (L36): sin documentación — miembros: `buffer`, `mimetype`, `size`

#### Clase `CatalogProductsController` (L48–150)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('catalog/products')`
- **Propósito:** "Catálogo → Librería" y "Catálogo → Variedades y Accesorios" comparten este mismo controller (la sección se filtra por query param/body) — igual que en Teléfonos, admin-only end-to-end (incluido el listado, porque expone publicaciones inactivas).
- **Dependencias inyectadas (constructor):** `createCatalogProductUseCase: CreateCatalogProductUseCase`, `updateCatalogProductUseCase: UpdateCatalogProductUseCase`, `listCatalogProductsUseCase: ListCatalogProductsUseCase`, `getCatalogProductByIdUseCase: GetCatalogProductByIdUseCase`, `setCatalogProductActiveUseCase: SetCatalogProductActiveUseCase`, `reorderCatalogProductsUseCase: ReorderCatalogProductsUseCase`, `setCatalogProductImageUseCase: SetCatalogProductImageUseCase`, `removeCatalogProductImageUseCase: RemoveCatalogProductImageUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 63–75 | `dto: CreateCatalogProductRequestDto`, `userId: string` | `Promise<CatalogProductResponseDto>` |
| `findAll` | método public | 77–84 | `query: ListCatalogProductsQueryDto` | `Promise<CatalogProductResponseDto[]>` |
| `findOne` | método public | 86–89 | `id: string` | `Promise<CatalogProductResponseDto>` |
| `update` | método public | 91–101 | `id: string`, `dto: UpdateCatalogProductRequestDto`, `userId: string` | `Promise<CatalogProductResponseDto>` |
| `activate` | método public | 103–110 | `id: string`, `userId: string` | `Promise<void>` |
| `deactivate` | método public | 112–119 | `id: string`, `userId: string` | `Promise<void>` |
| `reorder` | método public | 121–125 | `dto: ReorderCatalogProductsRequestDto` | `Promise<void>` |
| `setImage` | método public | 127–140 | `catalogProductId: string`, `image: UploadedImageFile`, `userId: string` | `Promise<void>` |
| `removeImage` | método public | 142–149 | `id: string`, `userId: string` | `Promise<void>` |

##### `CatalogProductsController.create`

- **Firma:** `create(dto: CreateCatalogProductRequestDto, userId: string): Promise<CatalogProductResponseDto>` — [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L63) (L63–75)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createCatalogProductUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductsController.findAll`

- **Firma:** `findAll(query: ListCatalogProductsQueryDto): Promise<CatalogProductResponseDto[]>` — [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L77) (L77–84)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listCatalogProductsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductsController.findOne`

- **Firma:** `findOne(id: string): Promise<CatalogProductResponseDto>` — [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L86) (L86–89)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getCatalogProductByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductsController.update`

- **Firma:** `update(id: string, dto: UpdateCatalogProductRequestDto, userId: string): Promise<CatalogProductResponseDto>` — [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L91) (L91–101)
- **Decoradores:** `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateCatalogProductUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductsController.activate`

- **Firma:** `activate(id: string, userId: string): Promise<void>` — [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L103) (L103–110)
- **Decoradores:** `@Post(':id/activate')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setCatalogProductActiveUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductsController.deactivate`

- **Firma:** `deactivate(id: string, userId: string): Promise<void>` — [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L112) (L112–119)
- **Decoradores:** `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setCatalogProductActiveUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductsController.reorder`

- **Firma:** `reorder(dto: ReorderCatalogProductsRequestDto): Promise<void>` — [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L121) (L121–125)
- **Decoradores:** `@Post('reorder')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.reorderCatalogProductsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductsController.setImage`

- **Firma:** `setImage(catalogProductId: string, image: UploadedImageFile, userId: string): Promise<void>` — [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L127) (L127–140)
- **Decoradores:** `@Post(':id/image')` `@UseInterceptors(FileInterceptor('image'))` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) catalogProductId`, `@UploadedFile() image`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setCatalogProductImageUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductsController.removeImage`

- **Firma:** `removeImage(id: string, userId: string): Promise<void>` — [catalog-products.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts#L142) (L142–149)
- **Decoradores:** `@Delete(':id/image')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.removeCatalogProductImageUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts"></a>

### public-product-catalog.controller.ts

- **Ruta:** [public-product-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts) (`comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts`, 124 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Público, sin guard — mismo prefijo `public-catalog` que Teléfonos, pero un controller distinto con sub-rutas propias (`products*`), así que no choca con `PublicCatalogController` (`phones*`).
- **Depende de (archivos del proyecto):** [list-published-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-published-catalog-products-use-case-ts), [get-published-catalog-product-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-published-catalog-product-by-id-use-case-ts), [get-catalog-product-image.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-image-use-case-ts), [create-catalog-product-request.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-request-use-case-ts), [like-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-like-catalog-product-use-case-ts), [create-catalog-product-request.request.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-create-catalog-product-request-request-dto-ts), [public-catalog-product.response.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-public-catalog-product-response-dto-ts), [catalog-product-request.response.dto.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-catalog-product-request-response-dto-ts), [catalog-product.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts), [parse-visitor-id.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-application-utils-parse-visitor-id-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/throttler`, `express`
- **Consumidores:** [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `PublicProductCatalogController` (L39–123)

- **Decoradores:** `@Controller('public-catalog')`
- **Propósito:** Público, sin guard — mismo prefijo `public-catalog` que Teléfonos, pero un controller distinto con sub-rutas propias (`products*`), así que no choca con `PublicCatalogController` (`phones*`). Nunca expone costo, stock, proveedor ni ningún dato administrativo.
- **Dependencias inyectadas (constructor):** `listPublishedCatalogProductsUseCase: ListPublishedCatalogProductsUseCase`, `getPublishedCatalogProductByIdUseCase: GetPublishedCatalogProductByIdUseCase`, `getCatalogProductImageUseCase: GetCatalogProductImageUseCase`, `createCatalogProductRequestUseCase: CreateCatalogProductRequestUseCase`, `likeCatalogProductUseCase: LikeCatalogProductUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 49–61 | `section: string`, `visitorIdHeader?: string` | `Promise<PublicCatalogProductResponseDto[]>` |
| `findOne` | método public | 63–72 | `id: string`, `visitorIdHeader?: string` | `Promise<PublicCatalogProductResponseDto>` |
| `getImage` | método public async | 75–88 | `id: string`, `res: Response` | `Promise<void>` |
| `createRequest` | método public | 90–100 | `dto: CreateCatalogProductRequestRequestDto` | `Promise<CatalogProductRequestResponseDto>` |
| `like` | método public | 102–111 | `id: string`, `visitorIdHeader?: string` | `Promise<{ likesCount: number; liked: boolean }>` |
| `unlike` | método public | 113–122 | `id: string`, `visitorIdHeader?: string` | `Promise<{ likesCount: number; liked: boolean }>` |

##### `PublicProductCatalogController.findAll`

- **Firma:** `findAll(section: string, visitorIdHeader?: string): Promise<PublicCatalogProductResponseDto[]>` — [public-product-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts#L49) (L49–61)
- **Decoradores:** `@Get('products')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query('section') section`, `@Headers('x-visitor-id') visitorIdHeader`
- **Dependencias (llamadas en su cuerpo):** `CATALOG_PRODUCT_SECTIONS.includes`, `this.listPublishedCatalogProductsUseCase.execute`, `parseOptionalVisitorId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicProductCatalogController.findOne`

- **Firma:** `findOne(id: string, visitorIdHeader?: string): Promise<PublicCatalogProductResponseDto>` — [public-product-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts#L63) (L63–72)
- **Decoradores:** `@Get('products/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Headers('x-visitor-id') visitorIdHeader`
- **Dependencias (llamadas en su cuerpo):** `this.getPublishedCatalogProductByIdUseCase.execute`, `parseOptionalVisitorId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicProductCatalogController.getImage`

- **Firma:** `getImage(id: string, res: Response): Promise<void>` — [public-product-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts#L75) (L75–88)
- **Decoradores:** `@Get('products/images/:id')`
- **Propósito / descripción:** Mismo header `Cross-Origin-Resource-Policy: cross-origin` que Teléfonos — sin él, Helmet bloquea el `&lt;img&gt;` entre orígenes.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.getCatalogProductImageUseCase.execute`, `res.set`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicProductCatalogController.createRequest`

- **Firma:** `createRequest(dto: CreateCatalogProductRequestRequestDto): Promise<CatalogProductRequestResponseDto>` — [public-product-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts#L90) (L90–100)
- **Decoradores:** `@Post('product-requests')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.createCatalogProductRequestUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicProductCatalogController.like`

- **Firma:** `like(id: string, visitorIdHeader?: string): Promise<{ likesCount: number; liked: boolean }>` — [public-product-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts#L102) (L102–111)
- **Decoradores:** `@Post('products/:id/like')` `@HttpCode(HttpStatus.OK)` `@UseGuards(ThrottlerGuard)` `@Throttle({ default: { limit: 30, ttl: 60_000 } })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Headers('x-visitor-id') visitorIdHeader`
- **Dependencias (llamadas en su cuerpo):** `this.likeCatalogProductUseCase.execute`, `parseRequiredVisitorId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicProductCatalogController.unlike`

- **Firma:** `unlike(id: string, visitorIdHeader?: string): Promise<{ likesCount: number; liked: boolean }>` — [public-product-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts#L113) (L113–122)
- **Decoradores:** `@Post('products/:id/unlike')` `@HttpCode(HttpStatus.OK)` `@UseGuards(ThrottlerGuard)` `@Throttle({ default: { limit: 30, ttl: 60_000 } })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Headers('x-visitor-id') visitorIdHeader`
- **Dependencias (llamadas en su cuerpo):** `this.likeCatalogProductUseCase.execute`, `parseRequiredVisitorId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-catalog-product-request-response-dto-ts"></a>

### catalog-product-request.response.dto.ts

- **Ruta:** [catalog-product-request.response.dto.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/catalog-product-request.response.dto.ts) (`comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/catalog-product-request.response.dto.ts`, 17 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** DTO de respuesta: declara `CatalogProductRequestResponseDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product-request.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-request-entity-ts)
- **Consumidores:** [catalog-product-requests.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-product-requests-controller-ts), [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts)

#### Clase `CatalogProductRequestResponseDto` (L3–16)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-catalog-product-response-dto-ts"></a>

### catalog-product.response.dto.ts

- **Ruta:** [catalog-product.response.dto.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/catalog-product.response.dto.ts) (`comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/catalog-product.response.dto.ts`, 25 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** DTO de respuesta: declara `CatalogProductResponseDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts)
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts)

#### Clase `CatalogProductResponseDto` (L3–24)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-create-catalog-product-request-request-dto-ts"></a>

### create-catalog-product-request.request.dto.ts

- **Ruta:** [create-catalog-product-request.request.dto.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/create-catalog-product-request.request.dto.ts) (`comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/create-catalog-product-request.request.dto.ts`, 24 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Público, sin autenticación.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts)

#### Clase `CreateCatalogProductRequestRequestDto` (L9–23)

- **Propósito:** Público, sin autenticación. Deliberadamente sin `price`/`productName` — `forbidNonWhitelisted` global rechaza cualquier intento de mandarlos; el precio/nombre siempre se releen de la publicación real en `CreateCatalogProductRequestUseCase`.
<a id="f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-create-catalog-product-request-dto-ts"></a>

### create-catalog-product.request.dto.ts

- **Ruta:** [create-catalog-product.request.dto.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/create-catalog-product.request.dto.ts) (`comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/create-catalog-product.request.dto.ts`, 18 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** DTO de entrada: declara `CreateCatalogProductRequestDto`, `CATALOG_PRODUCT_SECTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts)

#### Clase `CreateCatalogProductRequestDto` (L6–17)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-list-catalog-product-requests-query-dto-ts"></a>

### list-catalog-product-requests.query.dto.ts

- **Ruta:** [list-catalog-product-requests.query.dto.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/list-catalog-product-requests.query.dto.ts) (`comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/list-catalog-product-requests.query.dto.ts`, 25 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** DTO de consulta: declara `ListCatalogProductRequestsQueryDto`, `STATUSES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product-request.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-request-entity-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [catalog-product-requests.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-product-requests-controller-ts)

#### Clase `ListCatalogProductRequestsQueryDto` (L12–24)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-list-catalog-products-query-dto-ts"></a>

### list-catalog-products.query.dto.ts

- **Ruta:** [list-catalog-products.query.dto.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/list-catalog-products.query.dto.ts) (`comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/list-catalog-products.query.dto.ts`, 21 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** DTO de consulta: declara `ListCatalogProductsQueryDto`, `CATALOG_PRODUCT_SECTIONS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts)

#### Clase `ListCatalogProductsQueryDto` (L7–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-public-catalog-product-response-dto-ts"></a>

### public-catalog-product.response.dto.ts

- **Ruta:** [public-catalog-product.response.dto.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/public-catalog-product.response.dto.ts) (`comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/public-catalog-product.response.dto.ts`, 16 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** Backs Librería/Variedades en la landing — sin costo/stock/proveedor/estado administrativo.
- **Depende de (archivos del proyecto):** [catalog-product.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-entity-ts)
- **Consumidores:** [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts)

#### Clase `PublicCatalogProductResponseDto` (L4–15)

- **Propósito:** Backs Librería/Variedades en la landing — sin costo/stock/proveedor/estado administrativo.
<a id="f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-reorder-catalog-products-request-dto-ts"></a>

### reorder-catalog-products.request.dto.ts

- **Ruta:** [reorder-catalog-products.request.dto.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/reorder-catalog-products.request.dto.ts) (`comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/reorder-catalog-products.request.dto.ts`, 29 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** DTO de entrada: declara `ReorderCatalogProductItemDto`, `ReorderCatalogProductsRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts)

#### Clase `ReorderCatalogProductItemDto` (L12–19)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ReorderCatalogProductsRequestDto` (L21–28)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-update-catalog-product-request-status-request-dto-ts"></a>

### update-catalog-product-request-status.request.dto.ts

- **Ruta:** [update-catalog-product-request-status.request.dto.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/update-catalog-product-request-status.request.dto.ts) (`comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/update-catalog-product-request-status.request.dto.ts`, 21 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** DTO de entrada: declara `UpdateCatalogProductRequestStatusRequestDto`, `STATUSES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-product-request.entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-entities-catalog-product-request-entity-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [catalog-product-requests.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-product-requests-controller-ts)

#### Clase `UpdateCatalogProductRequestStatusRequestDto` (L12–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-product-catalog-presentation-dtos-update-catalog-product-request-dto-ts"></a>

### update-catalog-product.request.dto.ts

- **Ruta:** [update-catalog-product.request.dto.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/update-catalog-product.request.dto.ts) (`comercial-jhoel-api/src/modules/product-catalog/presentation/dtos/update-catalog-product.request.dto.ts`, 9 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** DTO de entrada: declara `UpdateCatalogProductRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [catalog-products.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-catalog-products-controller-ts)

#### Clase `UpdateCatalogProductRequestDto` (L3–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts"></a>

### product-catalog.module.ts

- **Ruta:** [product-catalog.module.ts](../../../../comercial-jhoel-api/src/modules/product-catalog/product-catalog.module.ts) (`comercial-jhoel-api/src/modules/product-catalog/product-catalog.module.ts`, 72 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `product-catalog`
- **Responsabilidad:** "Catálogo de Librería" y "Variedades y Accesorios" — una sola sección discriminada por `section`, referenciando `products.id` (nunca copia datos de Inventario).
- **Depende de (archivos del proyecto):** [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts), [likes.module.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-likes-module-ts), [catalog-product.orm-entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-orm-entity-ts), [catalog-product-request.orm-entity.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-catalog-product-request-orm-entity-ts), [typeorm-catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-repository-ts), [typeorm-catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-infrastructure-persistence-typeorm-catalog-product-request-repository-ts), [catalog-product.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-repository-ts), [catalog-product-request.repository.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-domain-repositories-catalog-product-request-repository-ts), [create-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-create-catalog-product-use-case-ts), [update-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-update-catalog-product-use-case-ts), [list-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-catalog-products-use-case-ts), [get-catalog-product-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-catalog-product-by-id-use-case-ts), [set-catalog-product-active.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-active-use-case-ts), [reorder-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-reorder-catalog-products-use-case-ts), [set-catalog-product-image.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-set-catalog-product-image-use-case-ts) y 12 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `ProductCatalogModule` (L39–71)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([CatalogProductOrmEntity, CatalogProductRequestOrmEntity]), ProductsModule, LikesModule, ], controllers: [ CatalogP`
- **Propósito:** "Catálogo de Librería" y "Variedades y Accesorios" — una sola sección discriminada por `section`, referenciando `products.id` (nunca copia datos de Inventario). Importa `ProductsModule` solo para leer/validar el producto (`PRODUCT_REPOSITORY`, ya exportado — cero cambios ahí). Deliberadamente sin nada de Krediya/CompanySettings — esa regla es exclusiva de Teléfonos (`modules/catalog/`), nunca reutilizada aquí.
