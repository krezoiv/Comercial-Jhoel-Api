# Módulo backend `catalog`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/catalog/phones` | [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L76) `CatalogPhonesController.create` | [CreateCatalogPhoneUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-phone-use-case-ts) | `CatalogPhoneRepository`.create<br>`CompanySettingsRepository`.get | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogPhoneService.createPhone` |
| `GET /api/catalog/phones` | [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L99) `CatalogPhonesController.findAll` | [ListCatalogPhonesUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-phones-use-case-ts) | `CatalogPhoneRepository`.findAll<br>`CompanySettingsRepository`.get | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogPhoneService.getPhones` |
| `GET /api/catalog/phones/:id` | [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L109) `CatalogPhonesController.findOne` | [GetCatalogPhoneByIdUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-by-id-use-case-ts) | `CatalogPhoneRepository`.findById<br>`CompanySettingsRepository`.get | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogPhoneService.getPhoneById` |
| `PATCH /api/catalog/phones/:id` | [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L116) `CatalogPhonesController.update` | [UpdateCatalogPhoneUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-phone-use-case-ts) | `CatalogPhoneRepository`.findById/update<br>`CompanySettingsRepository`.get | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogPhoneService.updatePhone` |
| `POST /api/catalog/phones/:id/activate` | [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L139) `CatalogPhonesController.activate` | [ActivateCatalogPhoneUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-activate-catalog-phone-use-case-ts) | `CatalogPhoneRepository`.findById/setActive | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogPhoneService.activatePhone` |
| `DELETE /api/catalog/phones/:id` | [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L148) `CatalogPhonesController.deactivate` | [DeactivateCatalogPhoneUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-deactivate-catalog-phone-use-case-ts) | `CatalogPhoneRepository`.findById/setPublished/setActive | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogPhoneService.deactivatePhone` |
| `POST /api/catalog/phones/:id/publish` | [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L157) `CatalogPhonesController.publish` | [PublishCatalogPhoneUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-publish-catalog-phone-use-case-ts) | `CatalogPhoneRepository`.findById/setPublished | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogPhoneService.publishPhone` |
| `POST /api/catalog/phones/:id/unpublish` | [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L166) `CatalogPhonesController.unpublish` | [UnpublishCatalogPhoneUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-unpublish-catalog-phone-use-case-ts) | `CatalogPhoneRepository`.findById/setPublished | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogPhoneService.unpublishPhone` |
| `POST /api/catalog/phones/reorder` | [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L175) `CatalogPhonesController.reorder` | [ReorderCatalogPhonesUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-reorder-catalog-phones-use-case-ts) | `CatalogPhoneRepository`.findById/reorder | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogPhoneService.reorderPhones` |
| `POST /api/catalog/phones/:id/images` | [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L181) `CatalogPhonesController.addImage` | [AddCatalogPhoneImageUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-add-catalog-phone-image-use-case-ts) | `CatalogPhoneRepository`.findById/addImage | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogPhoneService.addImage` |
| `DELETE /api/catalog/phones/:id/images/:imageId` | [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L200) `CatalogPhonesController.removeImage` | [RemoveCatalogPhoneImageUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-remove-catalog-phone-image-use-case-ts) | `CatalogPhoneRepository`.findById/removeImage/listImages/setPrimaryImage | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogPhoneService.removeImage` |
| `POST /api/catalog/phones/:id/images/:imageId/primary` | [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L209) `CatalogPhonesController.setPrimaryImage` | [SetPrimaryCatalogPhoneImageUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-set-primary-catalog-phone-image-use-case-ts) | `CatalogPhoneRepository`.findById/setPrimaryImage | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogPhoneService.setPrimaryImage` |
| `GET /api/catalog/requests` | [catalog-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-requests.controller.ts#L33) `CatalogRequestsController.findAll` | [ListCatalogRequestsUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-requests-use-case-ts) | `CatalogRequestRepository`.findAll | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogRequestService.getRequests` |
| `GET /api/catalog/requests/:id` | [catalog-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-requests.controller.ts#L45) `CatalogRequestsController.findOne` | [GetCatalogRequestByIdUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-request-by-id-use-case-ts) | `CatalogRequestRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogRequestService.getRequestById` |
| `PATCH /api/catalog/requests/:id/status` | [catalog-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-requests.controller.ts#L52) `CatalogRequestsController.updateStatus` | [UpdateCatalogRequestStatusUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-request-status-use-case-ts) | `CatalogRequestRepository`.findById/updateStatus | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogRequestService.updateStatus` |
| `GET /api/public-catalog/phones` | [public-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts#L57) `PublicCatalogController.findAllPublished` | [ListPublishedCatalogPhonesUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-published-catalog-phones-use-case-ts) | `CatalogPhoneRepository`.findPublished<br>`CompanySettingsRepository`.get<br>`CatalogLikeRepository`.getCountsBatch/getLikedEntityIds [catalog_likes] | — | `PublicCatalogService.getPublishedPhones` |
| `GET /api/public-catalog/phones/:id` | [public-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts#L64) `PublicCatalogController.findOnePublished` | [GetPublishedCatalogPhoneByIdUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-published-catalog-phone-by-id-use-case-ts) | `CatalogPhoneRepository`.findById<br>`CompanySettingsRepository`.get<br>`CatalogLikeRepository`.getCount/getLikedEntityIds [catalog_likes] | — | `PublicCatalogService.getPhoneById` |
| `GET /api/public-catalog/phones/images/:imageId` | [public-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts#L91) `PublicCatalogController.getImage` | [GetCatalogPhoneImageUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-image-use-case-ts) | `CatalogPhoneRepository`.getImage/findById | — | — |
| `POST /api/public-catalog/requests` | [public-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts#L106) `PublicCatalogController.createRequest` | [CreateCatalogRequestUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts) | `CatalogPhoneRepository`.findById<br>`CatalogRequestRepository`.create<br>`CompanySettingsRepository`.get | — | `PublicCatalogService.createRequest` |
| `POST /api/public-catalog/phones/:id/like` | [public-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts#L119) `PublicCatalogController.like` | [LikeCatalogPhoneUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-like-catalog-phone-use-case-ts) | `CatalogPhoneRepository`.findById<br>`CatalogLikeRepository`.like/unlike/getCount | UseGuards(ThrottlerGuard) Throttle({ default: { limit: 30, ttl: 60_000 } }) | `PublicCatalogService.likePhone` |
| `POST /api/public-catalog/phones/:id/unlike` | [public-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts#L130) `PublicCatalogController.unlike` | [LikeCatalogPhoneUseCase](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-like-catalog-phone-use-case-ts) | `CatalogPhoneRepository`.findById<br>`CatalogLikeRepository`.like/unlike/getCount | UseGuards(ThrottlerGuard) Throttle({ default: { limit: 30, ttl: 60_000 } }) | `PublicCatalogService.unlikePhone` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [catalog-phone-output.ts](#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-phone-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toImageOutputs`, `toCatalogPhoneOutput`, `toPublicCatalogPhoneOutput`, `CatalogPhoneImageOutput`, `CatalogPhoneOutput` (sin comentario de documentación en el código). | 2 internas | 6 | Media (6 consumidores) |
| [catalog-request-output.ts](#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-request-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toCatalogRequestOutput`, `CatalogRequestOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [activate-catalog-phone.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-activate-catalog-phone-use-case-ts) | .ts | Caso de uso | Aplicación | Reactivates a soft-deleted phone — never auto-publishes it (publishing stays its own explicit action, requiring at least one image). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [add-catalog-phone-image.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-add-catalog-phone-image-use-case-ts) | .ts | Caso de uso | Aplicación | The first image ever added to a phone is automatically marked primary — every phone that has at least one image always has exactly one primary, never zero (enforced by this plus `RemoveCatalogPhoneImageUseCase`'s own promotion logic). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [create-catalog-phone.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-phone-use-case-ts) | .ts | Caso de uso | Aplicación | Creates a new catalog listing, always `isPublished: false` — publishing is a separate, explicit admin action (`PublishCatalogPhoneUseCase`) that requires at least one photo first, so a phone is never accidentally created already visible on the public landing. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [create-catalog-request.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts) | .ts | Caso de uso | Aplicación | The most sensitive use case in this module — the public, unauthenticated entry point for "Lo quiero" / "Comprar a crédito con Krediya". | 8 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-catalog-phone.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-deactivate-catalog-phone-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only, same convention as every reference table in this codebase. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-catalog-phone-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetCatalogPhoneByIdUseCase` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-catalog-phone-image.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-image-use-case-ts) | .ts | Caso de uso | Aplicación | The one public place a catalog photo's bytes are served (`GET /catalog/phones/images/:imageId`, no guard, long `Cache-Control` — see the controller). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-catalog-request-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-request-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetCatalogRequestByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-published-catalog-phone-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-published-catalog-phone-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | 404 both when the id doesn't exist and when it exists but isn't published/active — never reveals which, same "don't leak existence" reasoning as the rest of this module's public surface. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [like-catalog-phone.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-like-catalog-phone-use-case-ts) | .ts | Caso de uso | Aplicación | "Me gusta" público — el conteo real y el anti-duplicado por visitante viven en `catalog_likes` (ver `CatalogLikeRepository`), nunca en un contador confiado del frontend. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-catalog-phones.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-phones-use-case-ts) | .ts | Caso de uso | Aplicación | Admin listing — includes unpublished/inactive phones (this is the management screen, not the public catalog). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-catalog-requests.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-requests-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListCatalogRequestsUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-published-catalog-phones.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-published-catalog-phones-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the landing page's "Teléfonos" carousel — only `isPublished && isActive`, ordered by `sortOrder`, never exposes cost/inventory/admin fields. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [publish-catalog-phone.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-publish-catalog-phone-use-case-ts) | .ts | Caso de uso | Aplicación | A phone can only go live on the public landing once it's active and has at least one photo — "no se publica una vitrina sin foto" is enforced here, not just as a frontend nicety (see the plan's own decision). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [remove-catalog-phone-image.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-remove-catalog-phone-image-use-case-ts) | .ts | Caso de uso | Aplicación | The one hard-delete in this module — a product photo is editorial content, not a financial/historical record (see the migration's own doc comment). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [reorder-catalog-phones.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-reorder-catalog-phones-use-case-ts) | .ts | Caso de uso | Aplicación | Admin-only, sequential, no expected concurrency — a plain transactional bulk update is correct here, no stored function needed (same "no construir un procedure donde un statement plano ya basta" convention every simple CRUD module in this codebase already follows). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [set-primary-catalog-phone-image.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-set-primary-catalog-phone-image-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `SetPrimaryCatalogPhoneImageUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [unpublish-catalog-phone.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-unpublish-catalog-phone-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UnpublishCatalogPhoneUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-catalog-phone.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-phone-use-case-ts) | .ts | Caso de uso | Aplicación | Edits any subset of specs/price/description — never touches `isActive`/`isPublished`/`sortOrder` (those have their own dedicated use cases so each has a single, clear entry point). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-catalog-request-status.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-request-status-use-case-ts) | .ts | Caso de uso | Aplicación | Marca atendida / contactada / en proceso / cancelada, con observación libre — la campana de alertas deja de contar esta fila en cuanto deja de estar en `NUEVA`. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [assert-valid-catalog-image.ts](#f-comercial-jhoel-api-src-modules-catalog-application-utils-assert-valid-catalog-image-ts) | .ts | Utilidad | Aplicación | Validated before ever touching the database — never trusts the frontend's own `accept="image/*"` hint alone. | 1 internas | 1 | Baja (1 consumidores) |
| [is-krediya-credit-available.spec.ts](#f-comercial-jhoel-api-src-modules-catalog-application-utils-is-krediya-credit-available-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria (sin comentario de documentación en el código). | 1 internas | 0 | Soporte (pruebas) |
| [is-krediya-credit-available.ts](#f-comercial-jhoel-api-src-modules-catalog-application-utils-is-krediya-credit-available-ts) | .ts | Utilidad | Aplicación | THE single source of truth for the "precio &gt;= Q1,000 → crédito Krediya disponible" rule across the entire system (landing, API, panel, solicitudes — per the ticket's own explicit requirement). | 0 internas | 3 | Media (3 consumidores) |
| [catalog.module.ts](#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts) | .ts | Módulo | Arranque / configuración | "Catálogo de Teléfonos" — fully independent from `PhonesModule` (see this module's own doc comments), imports only `CompanySettingsModule` (for `krediyaMinAmount`, the single source of truth for the Krediya credit threshold). | 32 internas; ext.: @nestjs/common, @nestjs/typeorm | 2 | Baja (2 consumidores) |
| [catalog-phone-image.entity.ts](#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-image-entity-ts) | .ts | Entidad de dominio | Dominio | Metadata only — the raw bytes (`imageData`) are never loaded onto this entity, only read directly off the ORM row inside `GetCatalogPhoneImageUseCase`/`TypeOrmCatalogPhoneRepository.getImage()`. | 0 internas | 4 | Media (4 consumidores) |
| [catalog-phone.entity.ts](#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-entity-ts) | .ts | Entidad de dominio | Dominio | A publishable commercial listing for the public catalog — one row per MODEL (marca/modelo/specs/precio/fotos), never per physical unit with an IMEI (that's `modules/phones/`'s `Phone`, a completely separate domain this module never touches). | 1 internas | 9 | Media (9 consumidores) |
| [catalog-request.entity.ts](#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-request-entity-ts) | .ts | Entidad de dominio | Dominio | A lead captured from the public catalog — "Lo quiero" (INTERES_COMPRA) or "Comprar a crédito con Krediya" (INTERES_CREDITO). | 0 internas | 11 | Alta (11 consumidores) |
| [catalog-image-not-found.error.ts](#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-image-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `CatalogImageNotFoundError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [catalog-phone-inactive.error.ts](#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-inactive-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `CatalogPhoneInactiveError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [catalog-phone-no-images.error.ts](#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-no-images-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `CatalogPhoneNoImagesError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [catalog-phone-not-found.error.ts](#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `CatalogPhoneNotFoundError` (sin comentario de documentación en el código). | 1 internas | 10 | Alta (10 consumidores) |
| [catalog-phone-not-published.error.ts](#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-published-error-ts) | .ts | Errores de dominio | Dominio | Reused for both "doesn't exist" and "exists but isn't published" on every PUBLIC read (detail, image, create-request) — a 404 here never reveals whether an unpublished/inactive phone actually exists in the admin catalog, same "don't leak existence" reasoning already used elsewhere in this codebase for internal-only rows. | 1 internas | 4 | Media (4 consumidores) |
| [catalog-request-credit-not-available.error.ts](#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-request-credit-not-available-error-ts) | .ts | Errores de dominio | Dominio | Thrown by `CreateCatalogRequestUseCase` when `requestType === 'INTERES_CREDITO'` but the server-side recalculation of `isKrediyaCreditAvailable(price, minAmount)` comes back `false` — the enforcement point for "el backend debe recalcular la disponibilidad según el precio real" even if a manipulated frontend request claims otherwise. | 1 internas | 1 | Baja (1 consumidores) |
| [catalog-request-not-found.error.ts](#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-request-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `CatalogRequestNotFoundError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-catalog-image.error.ts](#f-comercial-jhoel-api-src-modules-catalog-domain-errors-invalid-catalog-image-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidCatalogImageError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [catalog-phone.repository.ts](#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateCatalogPhoneData`, `UpdateCatalogPhoneData`, `ListCatalogPhonesOptions`, `ReorderCatalogPhoneItem`, `AddCatalogPhoneImageData` (sin comentario de documentación en el código). | 2 internas | 19 | Alta (19 consumidores) |
| [catalog-request.repository.ts](#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-request-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateCatalogRequestData`, `ListCatalogRequestsOptions`, `UpdateCatalogRequestStatusData`, `CatalogRequestRepository`, `CATALOG_REQUEST_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 8 | Media (8 consumidores) |
| [catalog-phone-image.mapper.ts](#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `CatalogPhoneImageMapper` (sin comentario de documentación en el código). | 2 internas | 2 | Baja (2 consumidores) |
| [catalog-phone-image.orm-entity.ts](#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `CatalogPhoneImageOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [catalog-phone.mapper.ts](#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `CatalogPhoneMapper` (sin comentario de documentación en el código). | 3 internas | 1 | Baja (1 consumidores) |
| [catalog-phone.orm-entity.ts](#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `CatalogPhoneOrmEntity` (sin comentario de documentación en el código). | 4 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [catalog-request.mapper.ts](#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `CatalogRequestMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [catalog-request.orm-entity.ts](#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `CatalogRequestOrmEntity` (sin comentario de documentación en el código). | 3 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [typeorm-catalog-phone.repository.ts](#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-phone-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmCatalogPhoneRepository`, `IMAGE_LIST_COLUMNS` (sin comentario de documentación en el código). | 7 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-catalog-request.repository.ts](#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-request-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmCatalogRequestRepository` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [catalog-phones.controller.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts) | .ts | Controlador | Presentación | "Catálogo → Teléfonos" management — admin-only end-to-end, including `GET` (unlike `PhonesController`'s "any authenticated account" policy): this screen exposes unpublished/inactive phones and lets someone change what the public sees on the landing page, which is a business/marketing decision, not an operational daily-register task. | 21 internas; ext.: @nestjs/common, @nestjs/platform-express | 1 | Media (controlador) |
| [catalog-requests.controller.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-requests-controller-ts) | .ts | Controlador | Presentación | "Catálogo → Solicitudes" — admin-only, same guard shape as `CatalogPhonesController`. | 10 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [public-catalog.controller.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts) | .ts | Controlador | Presentación | Public, unauthenticated — backs the landing page's "Teléfonos" section. | 9 internas; ext.: @nestjs/common, @nestjs/throttler, express | 1 | Media (controlador) |
| [catalog-phone-extra-spec.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-catalog-phone-extra-spec-dto-ts) | .ts | DTO | Presentación | One `extraSpecs` row — "otras especificaciones configuradas desde el panel". | 0 internas; ext.: class-validator | 2 | Baja (2 consumidores) |
| [catalog-phone.response.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-catalog-phone-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `CatalogPhoneImageResponseDto`, `CatalogPhoneResponseDto` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [catalog-request.response.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-catalog-request-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `CatalogRequestResponseDto` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [create-catalog-phone.request.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-create-catalog-phone-request-dto-ts) | .ts | DTO de entrada | Presentación | No `isActive`/`isPublished`/`sortOrder` here — a phone is always created inactive-for-publishing-purposes (`isPublished: false`) and gets those via their own dedicated endpoints (`publish`/`unpublish`/`reorder`), never via create/update. | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [create-catalog-request.request.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-create-catalog-request-request-dto-ts) | .ts | DTO de entrada | Presentación | Public, unauthenticated body — deliberately minimal. | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-catalog-phones.query.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-list-catalog-phones-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListCatalogPhonesQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [list-catalog-requests.query.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-list-catalog-requests-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListCatalogRequestsQueryDto`, `CATALOG_REQUEST_STATUSES`, `CATALOG_REQUEST_TYPES` (sin comentario de documentación en el código). | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [public-catalog-phone.response.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-public-catalog-phone-response-dto-ts) | .ts | DTO de respuesta | Presentación | Public shape — backs the landing page's "Teléfonos" catalog. | 2 internas | 1 | Baja (1 consumidores) |
| [reorder-catalog-phones.request.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-reorder-catalog-phones-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `ReorderCatalogPhoneItemDto`, `ReorderCatalogPhonesRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [update-catalog-phone.request.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-update-catalog-phone-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateCatalogPhoneRequestDto` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [update-catalog-request-status.request.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-update-catalog-request-status-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateCatalogRequestStatusRequestDto`, `CATALOG_REQUEST_STATUSES` (sin comentario de documentación en el código). | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-phone-output-ts"></a>

### catalog-phone-output.ts

- **Ruta:** [catalog-phone-output.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/dtos/catalog-phone-output.ts) (`comercial-jhoel-api/src/modules/catalog/application/dtos/catalog-phone-output.ts`, 140 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** DTO de salida (aplicación): declara `toImageOutputs`, `toCatalogPhoneOutput`, `toPublicCatalogPhoneOutput`, `CatalogPhoneImageOutput`, `CatalogPhoneOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-phone.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-entity-ts), [is-krediya-credit-available.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-utils-is-krediya-credit-available-ts)
- **Consumidores:** [create-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-phone-use-case-ts), [get-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-by-id-use-case-ts), [get-published-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-published-catalog-phone-by-id-use-case-ts), [list-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-phones-use-case-ts), [list-published-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-published-catalog-phones-use-case-ts), [update-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-phone-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CatalogPhoneImageOutput` (L7): sin documentación — miembros: `id`, `isPrimary`, `sortOrder`
- `interface CatalogPhoneOutput` (L14): Admin shape — every field, including internal flags (`isActive`/`isPublished`/`sortOrder`/audit columns) a `PhoneCatalogo` management screen needs. — miembros: `id`, `brand`, `model`, `description`, `price`, `screen`, `ram`, `storage`, `camera`, `battery`, `processor`, `operatingSystem`, `extraSpecs`, `isActive`, `isPublished`, `sortOrder`, `likesCount`, `creditAvailable`, `images`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface PublicCatalogPhoneOutput` (L50): Public shape — deliberately narrow, backs the landing page's catalog. — miembros: `id`, `brand`, `model`, `description`, `price`, `screen`, `ram`, `storage`, `camera`, `battery`, `processor`, `operatingSystem`, `extraSpecs`, `creditAvailable`, `likesCount`, `liked`, `images`
#### Función `toImageOutputs` (L71–79)

- **Tipo:** función local del archivo
- **Firma:** `toImageOutputs(phone: CatalogPhone): CatalogPhoneImageOutput[]` — [catalog-phone-output.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/dtos/catalog-phone-output.ts#L71)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `[...phone.images].sort((a, b) => a.sortOrder - b.sortOrder).map`, `[...phone.images].sort`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toCatalogPhoneOutput` (L81–112)

- **Tipo:** función exportada
- **Firma:** `toCatalogPhoneOutput(phone: CatalogPhone, krediyaMinAmount: number \| null): CatalogPhoneOutput` — [catalog-phone-output.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/dtos/catalog-phone-output.ts#L81)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `isKrediyaCreditAvailable`, `toImageOutputs`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-phone-use-case-ts), [get-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-by-id-use-case-ts), [list-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-phones-use-case-ts), [update-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-phone-use-case-ts)

#### Función `toPublicCatalogPhoneOutput` (L114–139)

- **Tipo:** función exportada
- **Firma:** `toPublicCatalogPhoneOutput(phone: CatalogPhone, krediyaMinAmount: number \| null, likesCount: number, liked: boolean): PublicCatalogPhoneOutput` — [catalog-phone-output.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/dtos/catalog-phone-output.ts#L114)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `isKrediyaCreditAvailable`, `toImageOutputs`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-published-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-published-catalog-phone-by-id-use-case-ts), [list-published-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-published-catalog-phones-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-request-output-ts"></a>

### catalog-request-output.ts

- **Ruta:** [catalog-request-output.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/dtos/catalog-request-output.ts) (`comercial-jhoel-api/src/modules/catalog/application/dtos/catalog-request-output.ts`, 42 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** DTO de salida (aplicación): declara `toCatalogRequestOutput`, `CatalogRequestOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-request.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-request-entity-ts)
- **Consumidores:** [create-catalog-request.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts), [get-catalog-request-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-request-by-id-use-case-ts), [list-catalog-requests.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-requests-use-case-ts), [update-catalog-request-status.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-request-status-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CatalogRequestOutput` (L3): sin documentación — miembros: `id`, `catalogPhoneId`, `brand`, `model`, `price`, `creditAvailable`, `requestType`, `customerName`, `customerPhone`, `status`, `observation`, `createdAt`, `updatedAt`, `updatedBy`, `updatedByUsername`
#### Función `toCatalogRequestOutput` (L21–41)

- **Tipo:** función exportada
- **Firma:** `toCatalogRequestOutput(request: CatalogRequest): CatalogRequestOutput` — [catalog-request-output.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/dtos/catalog-request-output.ts#L21)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-catalog-request.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts), [get-catalog-request-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-request-by-id-use-case-ts), [update-catalog-request-status.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-request-status-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-activate-catalog-phone-use-case-ts"></a>

### activate-catalog-phone.use-case.ts

- **Ruta:** [activate-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/activate-catalog-phone.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/activate-catalog-phone.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Reactivates a soft-deleted phone — never auto-publishes it (publishing stays its own explicit action, requiring at least one image).
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-phone-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

#### Clase `ActivateCatalogPhoneUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Reactivates a soft-deleted phone — never auto-publishes it (publishing stays its own explicit action, requiring at least one image).
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string`, `userId: string` | `Promise<void>` |

##### `ActivateCatalogPhoneUseCase.execute`

- **Firma:** `execute(id: string, userId: string): Promise<void>` — [activate-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/activate-catalog-phone.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogPhoneRepository.findById`, `new CatalogPhoneNotFoundError`, `this.catalogPhoneRepository.setActive`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogPhoneNotFoundError(id)`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-add-catalog-phone-image-use-case-ts"></a>

### add-catalog-phone-image.use-case.ts

- **Ruta:** [add-catalog-phone-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/add-catalog-phone-image.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/add-catalog-phone-image.use-case.ts`, 65 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** The first image ever added to a phone is automatically marked primary — every phone that has at least one image always has exactly one primary, never zero (enforced by this plus `RemoveCatalogPhoneImageUseCase`'s own promotion logic).
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-phone-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-found-error-ts), [assert-valid-catalog-image.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-utils-assert-valid-catalog-image-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

**Interfaces, tipos y enums:**

- `interface AddCatalogPhoneImageInput` (L10): sin documentación — miembros: `catalogPhoneId`, `image`, `userId`
- `interface AddCatalogPhoneImageOutput` (L16): sin documentación — miembros: `id`, `isPrimary`, `sortOrder`

#### Clase `AddCatalogPhoneImageUseCase` (L23–64)

- **Decoradores:** `@Injectable()`
- **Propósito:** The first image ever added to a phone is automatically marked primary — every phone that has at least one image always has exactly one primary, never zero (enforced by this plus `RemoveCatalogPhoneImageUseCase`'s own promotion logic).
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–63 | `input: AddCatalogPhoneImageInput` | `Promise<AddCatalogPhoneImageOutput>` |

##### `AddCatalogPhoneImageUseCase.execute`

- **Firma:** `execute(input: AddCatalogPhoneImageInput): Promise<AddCatalogPhoneImageOutput>` — [add-catalog-phone-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/add-catalog-phone-image.use-case.ts#L30) (L30–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidCatalogImage`, `this.catalogPhoneRepository.findById`, `new CatalogPhoneNotFoundError`, `Math.max`, `phone.images.map`, `this.catalogPhoneRepository.addImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogPhoneNotFoundError(input.catalogPhoneId)`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-phone-use-case-ts"></a>

### create-catalog-phone.use-case.ts

- **Ruta:** [create-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/create-catalog-phone.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/create-catalog-phone.use-case.ts`, 63 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Creates a new catalog listing, always `isPublished: false` — publishing is a separate, explicit admin action (`PublishCatalogPhoneUseCase`) that requires at least one photo first, so a phone is never accidentally created already visible on the public landing.
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [catalog-phone.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-entity-ts), [catalog-phone-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-phone-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateCatalogPhoneInput` (L12): sin documentación — miembros: `brand`, `model`, `description`, `price`, `screen`, `ram`, `storage`, `camera`, `battery`, `processor`, `operatingSystem`, `extraSpecs`, `userId`

#### Clase `CreateCatalogPhoneUseCase` (L34–62)

- **Decoradores:** `@Injectable()`
- **Propósito:** Creates a new catalog listing, always `isPublished: false` — publishing is a separate, explicit admin action (`PublishCatalogPhoneUseCase`) that requires at least one photo first, so a phone is never accidentally created already visible on the public landing.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`, `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 43–61 | `input: CreateCatalogPhoneInput` | `Promise<CatalogPhoneOutput>` |

##### `CreateCatalogPhoneUseCase.execute`

- **Firma:** `execute(input: CreateCatalogPhoneInput): Promise<CatalogPhoneOutput>` — [create-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/create-catalog-phone.use-case.ts#L43) (L43–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.companySettingsRepository.get`, `this.catalogPhoneRepository.create`, `input.brand.trim`, `input.model.trim`, `input.description?.trim`, `input.screen?.trim`, `input.ram?.trim`, `input.storage?.trim`, `input.camera?.trim`, `input.battery?.trim`, `input.processor?.trim`, `input.operatingSystem?.trim`, `toCatalogPhoneOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts"></a>

### create-catalog-request.use-case.ts

- **Ruta:** [create-catalog-request.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/create-catalog-request.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/create-catalog-request.use-case.ts`, 82 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** The most sensitive use case in this module — the public, unauthenticated entry point for "Lo quiero" / "Comprar a crédito con Krediya".
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-request-repository-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [catalog-phone-not-published.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-published-error-ts), [catalog-request-credit-not-available.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-request-credit-not-available-error-ts), [catalog-request.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-request-entity-ts), [is-krediya-credit-available.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-utils-is-krediya-credit-available-ts), [catalog-request-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-request-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateCatalogRequestInput` (L17): sin documentación — miembros: `catalogPhoneId`, `requestType`, `customerName`, `customerPhone`

#### Clase `CreateCatalogRequestUseCase` (L36–81)

- **Decoradores:** `@Injectable()`
- **Propósito:** The most sensitive use case in this module — the public, unauthenticated entry point for "Lo quiero" / "Comprar a crédito con Krediya". Never trusts anything about the phone (price, brand, model, credit eligibility) from the request body — the DTO doesn't even have those fields (see `CreateCatalogRequestRequestDto`, `forbidNonWhitelisted` rejects any attempt to smuggle them in). Everything commercial is re-read from the real `CatalogPhone` row and `company_settings` at the moment of creation, exactly per "el backend debe recalcular la disponibilidad según el precio real" — a manipulated `creditAvailable` claim from the client has literally nowhere to go.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`, `@Inject(CATALOG_REQUEST_REPOSITORY) catalogRequestRepository: CatalogRequestRepository`, `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 47–80 | `input: CreateCatalogRequestInput` | `Promise<CatalogRequestOutput>` |

##### `CreateCatalogRequestUseCase.execute`

- **Firma:** `execute(input: CreateCatalogRequestInput): Promise<CatalogRequestOutput>` — [create-catalog-request.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/create-catalog-request.use-case.ts#L47) (L47–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.catalogPhoneRepository.findById`, `this.companySettingsRepository.get`, `new CatalogPhoneNotPublishedError`, `isKrediyaCreditAvailable`, `new CatalogRequestCreditNotAvailableError`, `this.catalogRequestRepository.create`, `input.customerName.trim`, `input.customerPhone.trim`, `toCatalogRequestOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogPhoneNotPublishedError()`, `new CatalogRequestCreditNotAvailableError()`
- **Consumidores:** [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-deactivate-catalog-phone-use-case-ts"></a>

### deactivate-catalog-phone.use-case.ts

- **Ruta:** [deactivate-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/deactivate-catalog-phone.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/deactivate-catalog-phone.use-case.ts`, 30 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Soft delete only, same convention as every reference table in this codebase.
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-phone-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

#### Clase `DeactivateCatalogPhoneUseCase` (L12–29)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only, same convention as every reference table in this codebase. Force-unpublishes as part of the same action — a deactivated phone must never remain visible on the public landing just because nobody remembered to unpublish it first.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–28 | `id: string`, `userId: string` | `Promise<void>` |

##### `DeactivateCatalogPhoneUseCase.execute`

- **Firma:** `execute(id: string, userId: string): Promise<void>` — [deactivate-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/deactivate-catalog-phone.use-case.ts#L19) (L19–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogPhoneRepository.findById`, `new CatalogPhoneNotFoundError`, `this.catalogPhoneRepository.setPublished`, `this.catalogPhoneRepository.setActive`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogPhoneNotFoundError(id)`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-by-id-use-case-ts"></a>

### get-catalog-phone-by-id.use-case.ts

- **Ruta:** [get-catalog-phone-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/get-catalog-phone-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/get-catalog-phone-by-id.use-case.ts`, 32 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Caso de uso: declara `GetCatalogPhoneByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [catalog-phone-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-found-error-ts), [catalog-phone-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-phone-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

#### Clase `GetCatalogPhoneByIdUseCase` (L12–31)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`, `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 21–30 | `id: string` | `Promise<CatalogPhoneOutput>` |

##### `GetCatalogPhoneByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<CatalogPhoneOutput>` — [get-catalog-phone-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/get-catalog-phone-by-id.use-case.ts#L21) (L21–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.catalogPhoneRepository.findById`, `this.companySettingsRepository.get`, `new CatalogPhoneNotFoundError`, `toCatalogPhoneOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogPhoneNotFoundError(id)`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-image-use-case-ts"></a>

### get-catalog-phone-image.use-case.ts

- **Ruta:** [get-catalog-phone-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/get-catalog-phone-image.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/get-catalog-phone-image.use-case.ts`, 39 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** The one public place a catalog photo's bytes are served (`GET /catalog/phones/images/:imageId`, no guard, long `Cache-Control` — see the controller).
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-phone-not-published.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-published-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts)

**Interfaces, tipos y enums:**

- `interface CatalogPhoneImageBytesOutput` (L6): sin documentación — miembros: `data`, `mimeType`

#### Clase `GetCatalogPhoneImageUseCase` (L18–38)

- **Decoradores:** `@Injectable()`
- **Propósito:** The one public place a catalog photo's bytes are served (`GET /catalog/phones/images/:imageId`, no guard, long `Cache-Control` — see the controller). Also validates the parent phone is still published: despublicar a phone hides its photos too, not just its listing entry, even though the raw image row itself still exists.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–37 | `imageId: string` | `Promise<CatalogPhoneImageBytesOutput>` |

##### `GetCatalogPhoneImageUseCase.execute`

- **Firma:** `execute(imageId: string): Promise<CatalogPhoneImageBytesOutput>` — [get-catalog-phone-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/get-catalog-phone-image.use-case.ts#L25) (L25–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogPhoneRepository.getImage`, `new CatalogPhoneNotPublishedError`, `this.catalogPhoneRepository.findById`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogPhoneNotPublishedError()`
- **Consumidores:** [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-request-by-id-use-case-ts"></a>

### get-catalog-request-by-id.use-case.ts

- **Ruta:** [get-catalog-request-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/get-catalog-request-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/get-catalog-request-by-id.use-case.ts`, 25 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Caso de uso: declara `GetCatalogRequestByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-request-repository-ts), [catalog-request-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-request-not-found-error-ts), [catalog-request-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-request-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-requests.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-requests-controller-ts)

#### Clase `GetCatalogRequestByIdUseCase` (L10–24)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_REQUEST_REPOSITORY) catalogRequestRepository: CatalogRequestRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–23 | `id: string` | `Promise<CatalogRequestOutput>` |

##### `GetCatalogRequestByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<CatalogRequestOutput>` — [get-catalog-request-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/get-catalog-request-by-id.use-case.ts#L17) (L17–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogRequestRepository.findById`, `new CatalogRequestNotFoundError`, `toCatalogRequestOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogRequestNotFoundError(id)`
- **Consumidores:** [catalog-requests.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-requests-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-published-catalog-phone-by-id-use-case-ts"></a>

### get-published-catalog-phone-by-id.use-case.ts

- **Ruta:** [get-published-catalog-phone-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/get-published-catalog-phone-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/get-published-catalog-phone-by-id.use-case.ts`, 43 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** 404 both when the id doesn't exist and when it exists but isn't published/active — never reveals which, same "don't leak existence" reasoning as the rest of this module's public surface.
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts), [catalog-phone-not-published.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-published-error-ts), [catalog-phone-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-phone-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts)

#### Clase `GetPublishedCatalogPhoneByIdUseCase` (L15–42)

- **Decoradores:** `@Injectable()`
- **Propósito:** 404 both when the id doesn't exist and when it exists but isn't published/active — never reveals which, same "don't leak existence" reasoning as the rest of this module's public surface.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`, `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`, `@Inject(CATALOG_LIKE_REPOSITORY) catalogLikeRepository: CatalogLikeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 26–41 | `id: string`, `visitorId?: string` | `Promise<PublicCatalogPhoneOutput>` |

##### `GetPublishedCatalogPhoneByIdUseCase.execute`

- **Firma:** `execute(id: string, visitorId?: string): Promise<PublicCatalogPhoneOutput>` — [get-published-catalog-phone-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/get-published-catalog-phone-by-id.use-case.ts#L26) (L26–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.catalogPhoneRepository.findById`, `this.companySettingsRepository.get`, `new CatalogPhoneNotPublishedError`, `this.catalogLikeRepository.getCount`, `this.catalogLikeRepository.getLikedEntityIds`, `Promise.resolve`, `new Set`, `toPublicCatalogPhoneOutput`, `likedIds.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogPhoneNotPublishedError()`
- **Consumidores:** [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-like-catalog-phone-use-case-ts"></a>

### like-catalog-phone.use-case.ts

- **Ruta:** [like-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/like-catalog-phone.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/like-catalog-phone.use-case.ts`, 48 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** "Me gusta" público — el conteo real y el anti-duplicado por visitante viven en `catalog_likes` (ver `CatalogLikeRepository`), nunca en un contador confiado del frontend.
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-phone-not-published.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-published-error-ts), [catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts)

#### Clase `LikeCatalogPhoneUseCase` (L21–47)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Me gusta" público — el conteo real y el anti-duplicado por visitante viven en `catalog_likes` (ver `CatalogLikeRepository`), nunca en un contador confiado del frontend. `LIKE` solo procede sobre teléfonos publicados y activos (mismo criterio que `GetPublishedCatalogPhoneByIdUseCase`); `UNLIKE` no exige esa visibilidad — un visitante siempre puede deshacer su propio like aunque el teléfono ya no esté publicado, y los likes históricos nunca se borran al despublicar/desactivar.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`, `@Inject(CATALOG_LIKE_REPOSITORY) catalogLikeRepository: CatalogLikeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–46 | `id: string`, `visitorId: string`, `action: CatalogLikeAction` | `Promise<{ likesCount: number; liked: boolean }>` |

##### `LikeCatalogPhoneUseCase.execute`

- **Firma:** `execute(id: string, visitorId: string, action: CatalogLikeAction): Promise<{ likesCount: number; liked: boolean }>` — [like-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/like-catalog-phone.use-case.ts#L30) (L30–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogPhoneRepository.findById`, `new CatalogPhoneNotPublishedError`, `this.catalogLikeRepository.like`, `this.catalogLikeRepository.unlike`, `this.catalogLikeRepository.getCount`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogPhoneNotPublishedError()`
- **Consumidores:** [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-phones-use-case-ts"></a>

### list-catalog-phones.use-case.ts

- **Ruta:** [list-catalog-phones.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/list-catalog-phones.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/list-catalog-phones.use-case.ts`, 36 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Admin listing — includes unpublished/inactive phones (this is the management screen, not the public catalog).
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [catalog-phone-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-phone-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

#### Clase `ListCatalogPhonesUseCase` (L15–35)

- **Decoradores:** `@Injectable()`
- **Propósito:** Admin listing — includes unpublished/inactive phones (this is the management screen, not the public catalog).
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`, `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 24–34 | `options?: ListCatalogPhonesOptions` | `Promise<CatalogPhoneOutput[]>` |

##### `ListCatalogPhonesUseCase.execute`

- **Firma:** `execute(options?: ListCatalogPhonesOptions): Promise<CatalogPhoneOutput[]>` — [list-catalog-phones.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/list-catalog-phones.use-case.ts#L24) (L24–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.catalogPhoneRepository.findAll`, `this.companySettingsRepository.get`, `phones.map`, `toCatalogPhoneOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-requests-use-case-ts"></a>

### list-catalog-requests.use-case.ts

- **Ruta:** [list-catalog-requests.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/list-catalog-requests.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/list-catalog-requests.use-case.ts`, 26 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Caso de uso: declara `ListCatalogRequestsUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-request-repository-ts), [catalog-request-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-request-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-requests.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-requests-controller-ts)

#### Clase `ListCatalogRequestsUseCase` (L12–25)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_REQUEST_REPOSITORY) catalogRequestRepository: CatalogRequestRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–24 | `options?: ListCatalogRequestsOptions` | `Promise<CatalogRequestOutput[]>` |

##### `ListCatalogRequestsUseCase.execute`

- **Firma:** `execute(options?: ListCatalogRequestsOptions): Promise<CatalogRequestOutput[]>` — [list-catalog-requests.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/list-catalog-requests.use-case.ts#L19) (L19–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogRequestRepository.findAll`, `requests.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-requests.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-requests-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-published-catalog-phones-use-case-ts"></a>

### list-published-catalog-phones.use-case.ts

- **Ruta:** [list-published-catalog-phones.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/list-published-catalog-phones.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/list-published-catalog-phones.use-case.ts`, 47 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Backs the landing page's "Teléfonos" carousel — only `isPublished && isActive`, ordered by `sortOrder`, never exposes cost/inventory/admin fields.
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts), [catalog-phone-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-phone-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts)

#### Clase `ListPublishedCatalogPhonesUseCase` (L14–46)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the landing page's "Teléfonos" carousel — only `isPublished && isActive`, ordered by `sortOrder`, never exposes cost/inventory/admin fields.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`, `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`, `@Inject(CATALOG_LIKE_REPOSITORY) catalogLikeRepository: CatalogLikeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–45 | `visitorId?: string` | `Promise<PublicCatalogPhoneOutput[]>` |

##### `ListPublishedCatalogPhonesUseCase.execute`

- **Firma:** `execute(visitorId?: string): Promise<PublicCatalogPhoneOutput[]>` — [list-published-catalog-phones.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/list-published-catalog-phones.use-case.ts#L25) (L25–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.catalogPhoneRepository.findPublished`, `this.companySettingsRepository.get`, `phones.map`, `this.catalogLikeRepository.getCountsBatch`, `this.catalogLikeRepository.getLikedEntityIds`, `Promise.resolve`, `new Set`, `toPublicCatalogPhoneOutput`, `counts.get`, `likedIds.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-publish-catalog-phone-use-case-ts"></a>

### publish-catalog-phone.use-case.ts

- **Ruta:** [publish-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/publish-catalog-phone.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/publish-catalog-phone.use-case.ts`, 34 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** A phone can only go live on the public landing once it's active and has at least one photo — "no se publica una vitrina sin foto" is enforced here, not just as a frontend nicety (see the plan's own decision).
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-phone-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-found-error-ts), [catalog-phone-inactive.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-inactive-error-ts), [catalog-phone-no-images.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-no-images-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

#### Clase `PublishCatalogPhoneUseCase` (L13–33)

- **Decoradores:** `@Injectable()`
- **Propósito:** A phone can only go live on the public landing once it's active and has at least one photo — "no se publica una vitrina sin foto" is enforced here, not just as a frontend nicety (see the plan's own decision).
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–32 | `id: string`, `userId: string` | `Promise<void>` |

##### `PublishCatalogPhoneUseCase.execute`

- **Firma:** `execute(id: string, userId: string): Promise<void>` — [publish-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/publish-catalog-phone.use-case.ts#L20) (L20–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogPhoneRepository.findById`, `new CatalogPhoneNotFoundError`, `new CatalogPhoneInactiveError`, `new CatalogPhoneNoImagesError`, `this.catalogPhoneRepository.setPublished`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogPhoneNotFoundError(id)`, `new CatalogPhoneInactiveError()`, `new CatalogPhoneNoImagesError()`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-remove-catalog-phone-image-use-case-ts"></a>

### remove-catalog-phone-image.use-case.ts

- **Ruta:** [remove-catalog-phone-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/remove-catalog-phone-image.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/remove-catalog-phone-image.use-case.ts`, 48 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** The one hard-delete in this module — a product photo is editorial content, not a financial/historical record (see the migration's own doc comment).
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-phone-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-found-error-ts), [catalog-image-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-image-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

#### Clase `RemoveCatalogPhoneImageUseCase` (L14–47)

- **Decoradores:** `@Injectable()`
- **Propósito:** The one hard-delete in this module — a product photo is editorial content, not a financial/historical record (see the migration's own doc comment). If the removed image was the primary one and others remain, promotes the lowest-`sortOrder` remaining image to primary — a phone with at least one image always has exactly one primary.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 21–46 | `catalogPhoneId: string`, `imageId: string` | `Promise<void>` |

##### `RemoveCatalogPhoneImageUseCase.execute`

- **Firma:** `execute(catalogPhoneId: string, imageId: string): Promise<void>` — [remove-catalog-phone-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/remove-catalog-phone-image.use-case.ts#L21) (L21–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogPhoneRepository.findById`, `new CatalogPhoneNotFoundError`, `phone.images.find`, `new CatalogImageNotFoundError`, `this.catalogPhoneRepository.removeImage`, `this.catalogPhoneRepository.listImages`, `[...remaining].sort`, `this.catalogPhoneRepository.setPrimaryImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogPhoneNotFoundError(catalogPhoneId)`, `new CatalogImageNotFoundError(imageId)`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-reorder-catalog-phones-use-case-ts"></a>

### reorder-catalog-phones.use-case.ts

- **Ruta:** [reorder-catalog-phones.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/reorder-catalog-phones.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/reorder-catalog-phones.use-case.ts`, 32 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Admin-only, sequential, no expected concurrency — a plain transactional bulk update is correct here, no stored function needed (same "no construir un procedure donde un statement plano ya basta" convention every simple CRUD module in this codebase already follows).
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-phone-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

#### Clase `ReorderCatalogPhonesUseCase` (L15–31)

- **Decoradores:** `@Injectable()`
- **Propósito:** Admin-only, sequential, no expected concurrency — a plain transactional bulk update is correct here, no stored function needed (same "no construir un procedure donde un statement plano ya basta" convention every simple CRUD module in this codebase already follows).
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 22–30 | `items: ReorderCatalogPhoneItem[]` | `Promise<void>` |

##### `ReorderCatalogPhonesUseCase.execute`

- **Firma:** `execute(items: ReorderCatalogPhoneItem[]): Promise<void>` — [reorder-catalog-phones.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/reorder-catalog-phones.use-case.ts#L22) (L22–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogPhoneRepository.findById`, `new CatalogPhoneNotFoundError`, `this.catalogPhoneRepository.reorder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogPhoneNotFoundError(item.id)`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-set-primary-catalog-phone-image-use-case-ts"></a>

### set-primary-catalog-phone-image.use-case.ts

- **Ruta:** [set-primary-catalog-phone-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/set-primary-catalog-phone-image.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/set-primary-catalog-phone-image.use-case.ts`, 26 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Caso de uso: declara `SetPrimaryCatalogPhoneImageUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-phone-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-found-error-ts), [catalog-image-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-image-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

#### Clase `SetPrimaryCatalogPhoneImageUseCase` (L7–25)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–24 | `catalogPhoneId: string`, `imageId: string` | `Promise<void>` |

##### `SetPrimaryCatalogPhoneImageUseCase.execute`

- **Firma:** `execute(catalogPhoneId: string, imageId: string): Promise<void>` — [set-primary-catalog-phone-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/set-primary-catalog-phone-image.use-case.ts#L14) (L14–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogPhoneRepository.findById`, `new CatalogPhoneNotFoundError`, `phone.images.find`, `new CatalogImageNotFoundError`, `this.catalogPhoneRepository.setPrimaryImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogPhoneNotFoundError(catalogPhoneId)`, `new CatalogImageNotFoundError(imageId)`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-unpublish-catalog-phone-use-case-ts"></a>

### unpublish-catalog-phone.use-case.ts

- **Ruta:** [unpublish-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/unpublish-catalog-phone.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/unpublish-catalog-phone.use-case.ts`, 21 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Caso de uso: declara `UnpublishCatalogPhoneUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-phone-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

#### Clase `UnpublishCatalogPhoneUseCase` (L6–20)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 13–19 | `id: string`, `userId: string` | `Promise<void>` |

##### `UnpublishCatalogPhoneUseCase.execute`

- **Firma:** `execute(id: string, userId: string): Promise<void>` — [unpublish-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/unpublish-catalog-phone.use-case.ts#L13) (L13–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogPhoneRepository.findById`, `new CatalogPhoneNotFoundError`, `this.catalogPhoneRepository.setPublished`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogPhoneNotFoundError(id)`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-phone-use-case-ts"></a>

### update-catalog-phone.use-case.ts

- **Ruta:** [update-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/update-catalog-phone.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/update-catalog-phone.use-case.ts`, 87 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Edits any subset of specs/price/description — never touches `isActive`/`isPublished`/`sortOrder` (those have their own dedicated use cases so each has a single, clear entry point).
- **Depende de (archivos del proyecto):** [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [catalog-phone-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-found-error-ts), [catalog-phone.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-entity-ts), [catalog-phone-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-phone-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateCatalogPhoneInput` (L13): sin documentación — miembros: `brand`, `model`, `description`, `price`, `screen`, `ram`, `storage`, `camera`, `battery`, `processor`, `operatingSystem`, `extraSpecs`, `userId`

#### Clase `UpdateCatalogPhoneUseCase` (L37–86)

- **Decoradores:** `@Injectable()`
- **Propósito:** Edits any subset of specs/price/description — never touches `isActive`/`isPublished`/`sortOrder` (those have their own dedicated use cases so each has a single, clear entry point). A published phone stays published through an edit — a price/spec change reflects live on the public catalog the next time it's fetched, no re-publish step needed (see the plan's own "sin denormalización de vitrina" decision).
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_PHONE_REPOSITORY) catalogPhoneRepository: CatalogPhoneRepository`, `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 46–85 | `id: string`, `input: UpdateCatalogPhoneInput` | `Promise<CatalogPhoneOutput>` |

##### `UpdateCatalogPhoneUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateCatalogPhoneInput): Promise<CatalogPhoneOutput>` — [update-catalog-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/update-catalog-phone.use-case.ts#L46) (L46–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogPhoneRepository.findById`, `new CatalogPhoneNotFoundError`, `this.companySettingsRepository.get`, `this.catalogPhoneRepository.update`, `input.brand?.trim`, `input.model?.trim`, `input.description?.trim`, `input.screen?.trim`, `input.ram?.trim`, `input.storage?.trim`, `input.camera?.trim`, `input.battery?.trim`, `input.processor?.trim`, `input.operatingSystem?.trim`, `toCatalogPhoneOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.catalogPhoneRepository.update`
- **Errores que lanza:** `new CatalogPhoneNotFoundError(id)`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-request-status-use-case-ts"></a>

### update-catalog-request-status.use-case.ts

- **Ruta:** [update-catalog-request-status.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/update-catalog-request-status.use-case.ts) (`comercial-jhoel-api/src/modules/catalog/application/use-cases/update-catalog-request-status.use-case.ts`, 41 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Marca atendida / contactada / en proceso / cancelada, con observación libre — la campana de alertas deja de contar esta fila en cuanto deja de estar en `NUEVA`.
- **Depende de (archivos del proyecto):** [catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-request-repository-ts), [catalog-request-not-found.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-request-not-found-error-ts), [catalog-request.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-request-entity-ts), [catalog-request-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-request-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-requests.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-requests-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateCatalogRequestStatusInput` (L11): sin documentación — miembros: `status`, `observation`, `userId`

#### Clase `UpdateCatalogRequestStatusUseCase` (L18–40)

- **Decoradores:** `@Injectable()`
- **Propósito:** Marca atendida / contactada / en proceso / cancelada, con observación libre — la campana de alertas deja de contar esta fila en cuanto deja de estar en `NUEVA`.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_REQUEST_REPOSITORY) catalogRequestRepository: CatalogRequestRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–39 | `id: string`, `input: UpdateCatalogRequestStatusInput` | `Promise<CatalogRequestOutput>` |

##### `UpdateCatalogRequestStatusUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateCatalogRequestStatusInput): Promise<CatalogRequestOutput>` — [update-catalog-request-status.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/update-catalog-request-status.use-case.ts#L25) (L25–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogRequestRepository.findById`, `new CatalogRequestNotFoundError`, `this.catalogRequestRepository.updateStatus`, `toCatalogRequestOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogRequestNotFoundError(id)`
- **Consumidores:** [catalog-requests.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-requests-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-utils-assert-valid-catalog-image-ts"></a>

### assert-valid-catalog-image.ts

- **Ruta:** [assert-valid-catalog-image.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/utils/assert-valid-catalog-image.ts) (`comercial-jhoel-api/src/modules/catalog/application/utils/assert-valid-catalog-image.ts`, 26 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Validated before ever touching the database — never trusts the frontend's own `accept="image/*"` hint alone.
- **Depende de (archivos del proyecto):** [invalid-catalog-image.error.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-errors-invalid-catalog-image-error-ts)
- **Consumidores:** [add-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-add-catalog-phone-image-use-case-ts)

**Interfaces, tipos y enums:**

- `interface UploadedCatalogImage` (L8): sin documentación — miembros: `buffer`, `mimetype`, `size`

**Constantes exportadas:**

- `MAX_CATALOG_IMAGE_SIZE_BYTES` (L4): Same ceiling as `phones`' own `MAX_DPI_IMAGE_SIZE_BYTES` — no reason for a catalog photo to need a different one. = `5 * 1024 * 1024`
#### Función `assertValidCatalogImage` (L15–25)

- **Tipo:** función exportada
- **Firma:** `assertValidCatalogImage(file: UploadedCatalogImage): void` — [assert-valid-catalog-image.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/utils/assert-valid-catalog-image.ts#L15)
- **Propósito / descripción:** Validated before ever touching the database — never trusts the frontend's own `accept="image/*"` hint alone.
- **Dependencias:** `ALLOWED_MIME_TYPES.has`, `new InvalidCatalogImageError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidCatalogImageError('La imagen debe ser JPG, PNG o WEBP.')`, `new InvalidCatalogImageError('La imagen no puede superar los 5 MB.')`, `new InvalidCatalogImageError('La imagen está vacía.')`
- **Consumidores:** [add-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-add-catalog-phone-image-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-application-utils-is-krediya-credit-available-spec-ts"></a>

### is-krediya-credit-available.spec.ts

- **Ruta:** [is-krediya-credit-available.spec.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/utils/is-krediya-credit-available.spec.ts) (`comercial-jhoel-api/src/modules/catalog/application/utils/is-krediya-credit-available.spec.ts`, 26 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [is-krediya-credit-available.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-utils-is-krediya-credit-available-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-catalog-application-utils-is-krediya-credit-available-ts"></a>

### is-krediya-credit-available.ts

- **Ruta:** [is-krediya-credit-available.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/utils/is-krediya-credit-available.ts) (`comercial-jhoel-api/src/modules/catalog/application/utils/is-krediya-credit-available.ts`, 25 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** THE single source of truth for the "precio &gt;= Q1,000 → crédito Krediya disponible" rule across the entire system (landing, API, panel, solicitudes — per the ticket's own explicit requirement).
- **Descripción del autor (comentario del archivo):** THE single source of truth for the "precio &gt;= Q1,000 → crédito Krediya disponible" rule across the entire system (landing, API, panel, solicitudes — per the ticket's own explicit requirement). Every place that needs to know whether a phone qualifies for Krediya credit — the public catalog mapper, the admin catalog mapper, and `CreateCatalogRequestUseCase`'s server-side recalculation — calls this function and only this function. Never reimplemented, never inlined as a raw `&gt;= 1000` comparison anywhere else. `minAmount` is `company_settings.krediyaMinAmount` (nullable): `null` or `&lt;= 0` means th
- **Consumidores:** [catalog-phone-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-phone-output-ts), [create-catalog-request.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts), [is-krediya-credit-available.spec.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-utils-is-krediya-credit-available-spec-ts)
#### Función `isKrediyaCreditAvailable` (L16–24)

- **Tipo:** función exportada
- **Firma:** `isKrediyaCreditAvailable(price: number, minAmount: number \| null): boolean` — [is-krediya-credit-available.ts](../../../../comercial-jhoel-api/src/modules/catalog/application/utils/is-krediya-credit-available.ts#L16)
- **Propósito / descripción:** THE single source of truth for the "precio &gt;= Q1,000 → crédito Krediya disponible" rule across the entire system (landing, API, panel, solicitudes — per the ticket's own explicit requirement). Every place that needs to know whether a phone qualifies for Krediya credit — the public catalog mapper, the admin catalog mapper, and `CreateCatalogRequestUseCase`'s server-side recalculation — calls this function and only this function. Never reimplemented, never inlined as a raw `&gt;= 1000` comparison anywhere else. `minAmount` is `company_settings.krediyaMinAmount` (nullable): `null` or `&lt;= 0` means the business has not configured (or has deliberately turned off) the Krediya credit offer — no phone e
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-phone-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-phone-output-ts), [create-catalog-request.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts"></a>

### catalog.module.ts

- **Ruta:** [catalog.module.ts](../../../../comercial-jhoel-api/src/modules/catalog/catalog.module.ts) (`comercial-jhoel-api/src/modules/catalog/catalog.module.ts`, 86 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** "Catálogo de Teléfonos" — fully independent from `PhonesModule` (see this module's own doc comments), imports only `CompanySettingsModule` (for `krediyaMinAmount`, the single source of truth for the Krediya credit threshold).
- **Depende de (archivos del proyecto):** [company-settings.module.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts), [likes.module.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-likes-module-ts), [catalog-phone.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-orm-entity-ts), [catalog-phone-image.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-orm-entity-ts), [catalog-request.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-orm-entity-ts), [typeorm-catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-phone-repository-ts), [typeorm-catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-request-repository-ts), [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-request-repository-ts), [create-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-phone-use-case-ts), [update-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-phone-use-case-ts), [list-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-phones-use-case-ts), [get-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-by-id-use-case-ts), [activate-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-activate-catalog-phone-use-case-ts), [deactivate-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-deactivate-catalog-phone-use-case-ts) y 17 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [alerts.module.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts)

#### Clase `CatalogModule` (L37–85)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([ CatalogPhoneOrmEntity, CatalogPhoneImageOrmEntity, CatalogRequestOrmEntity, ]), CompanySettingsModule, LikesModul`
- **Propósito:** "Catálogo de Teléfonos" — fully independent from `PhonesModule` (see this module's own doc comments), imports only `CompanySettingsModule` (for `krediyaMinAmount`, the single source of truth for the Krediya credit threshold).
<a id="f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-image-entity-ts"></a>

### catalog-phone-image.entity.ts

- **Ruta:** [catalog-phone-image.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone-image.entity.ts) (`comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone-image.entity.ts`, 53 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Metadata only — the raw bytes (`imageData`) are never loaded onto this entity, only read directly off the ORM row inside `GetCatalogPhoneImageUseCase`/`TypeOrmCatalogPhoneRepository.getImage()`.
- **Consumidores:** [catalog-phone.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-entity-ts), [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-phone-image.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-mapper-ts), [typeorm-catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-phone-repository-ts)

**Interfaces, tipos y enums:**

- `interface CatalogPhoneImageProps` (L1): sin documentación — miembros: `id`, `catalogPhoneId`, `mimeType`, `sizeBytes`, `isPrimary`, `sortOrder`, `createdAt`

#### Clase `CatalogPhoneImage` (L18–52)

- **Propósito:** Metadata only — the raw bytes (`imageData`) are never loaded onto this entity, only read directly off the ORM row inside `GetCatalogPhoneImageUseCase`/`TypeOrmCatalogPhoneRepository.getImage()`. Keeps every listing query (admin table, public catalog) cheap regardless of how many/how large the underlying photos are.
- **Dependencias inyectadas (constructor):** `props: CatalogPhoneImageProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 21–23 | `props: CatalogPhoneImageProps` | `CatalogPhoneImage` |
| `id` | getter public | 25–27 | — | `string` |
| `catalogPhoneId` | getter public | 29–31 | — | `string` |
| `mimeType` | getter public | 33–35 | — | `string` |
| `sizeBytes` | getter public | 37–39 | — | `number` |
| `isPrimary` | getter public | 41–43 | — | `boolean` |
| `sortOrder` | getter public | 45–47 | — | `number` |
| `createdAt` | getter public | 49–51 | — | `Date` |

##### `CatalogPhoneImage.create`

- **Firma:** `create(props: CatalogPhoneImageProps): CatalogPhoneImage` — [catalog-phone-image.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone-image.entity.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new CatalogPhoneImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-phone-image.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-mapper-ts), [typeorm-catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-phone-repository-ts)

##### `CatalogPhoneImage.id`

- **Firma:** `id(): string` — [catalog-phone-image.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone-image.entity.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhoneImage.catalogPhoneId`

- **Firma:** `catalogPhoneId(): string` — [catalog-phone-image.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone-image.entity.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhoneImage.mimeType`

- **Firma:** `mimeType(): string` — [catalog-phone-image.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone-image.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhoneImage.sizeBytes`

- **Firma:** `sizeBytes(): number` — [catalog-phone-image.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone-image.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhoneImage.isPrimary`

- **Firma:** `isPrimary(): boolean` — [catalog-phone-image.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone-image.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhoneImage.sortOrder`

- **Firma:** `sortOrder(): number` — [catalog-phone-image.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone-image.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhoneImage.createdAt`

- **Firma:** `createdAt(): Date` — [catalog-phone-image.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone-image.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-entity-ts"></a>

### catalog-phone.entity.ts

- **Ruta:** [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts) (`comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts`, 148 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** A publishable commercial listing for the public catalog — one row per MODEL (marca/modelo/specs/precio/fotos), never per physical unit with an IMEI (that's `modules/phones/`'s `Phone`, a completely separate domain this module never touches).
- **Depende de (archivos del proyecto):** [catalog-phone-image.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-image-entity-ts)
- **Consumidores:** [catalog-phone-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-phone-output-ts), [create-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-phone-use-case-ts), [update-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-phone-use-case-ts), [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-phone.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-mapper-ts), [catalog-phone.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-orm-entity-ts), [typeorm-catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-phone-repository-ts), [catalog-phone.response.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-catalog-phone-response-dto-ts), [public-catalog-phone.response.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-public-catalog-phone-response-dto-ts)

**Interfaces, tipos y enums:**

- `interface CatalogPhoneExtraSpec` (L4): One admin-configurable "otra especificación" row — the panel's own free-form spec fields beyond the fixed set below. — miembros: `label`, `value`
- `interface CatalogPhoneProps` (L9): sin documentación — miembros: `id`, `brand`, `model`, `description`, `price`, `screen`, `ram`, `storage`, `camera`, `battery`, `processor`, `operatingSystem`, `extraSpecs`, `isActive`, `isPublished`, `sortOrder`, `likesCount`, `images`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`

#### Clase `CatalogPhone` (L45–147)

- **Propósito:** A publishable commercial listing for the public catalog — one row per MODEL (marca/modelo/specs/precio/fotos), never per physical unit with an IMEI (that's `modules/phones/`'s `Phone`, a completely separate domain this module never touches). `isPublished` gates public visibility; `isActive` is the usual soft-delete flag. A phone starts unpublished on creation and can only be published once it has at least one image (see `PublishCatalogPhoneUseCase`) — a vitrina without a photo is never shown.
- **Dependencias inyectadas (constructor):** `props: CatalogPhoneProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 48–50 | `props: CatalogPhoneProps` | `CatalogPhone` |
| `id` | getter public | 52–54 | — | `string` |
| `brand` | getter public | 56–58 | — | `string` |
| `model` | getter public | 60–62 | — | `string` |
| `description` | getter public | 64–66 | — | `string \| null` |
| `price` | getter public | 68–70 | — | `number` |
| `screen` | getter public | 72–74 | — | `string \| null` |
| `ram` | getter public | 76–78 | — | `string \| null` |
| `storage` | getter public | 80–82 | — | `string \| null` |
| `camera` | getter public | 84–86 | — | `string \| null` |
| `battery` | getter public | 88–90 | — | `string \| null` |
| `processor` | getter public | 92–94 | — | `string \| null` |
| `operatingSystem` | getter public | 96–98 | — | `string \| null` |
| `extraSpecs` | getter public | 100–102 | — | `CatalogPhoneExtraSpec[]` |
| `isActive` | getter public | 104–106 | — | `boolean` |
| `isPublished` | getter public | 108–110 | — | `boolean` |
| `sortOrder` | getter public | 112–114 | — | `number` |
| `likesCount` | getter public | 116–118 | — | `number` |
| `images` | getter public | 120–122 | — | `CatalogPhoneImage[]` |
| `createdAt` | getter public | 124–126 | — | `Date` |
| `updatedAt` | getter public | 128–130 | — | `Date` |
| `createdBy` | getter public | 132–134 | — | `string` |
| `createdByUsername` | getter public | 136–138 | — | `string` |
| `updatedBy` | getter public | 140–142 | — | `string \| null` |
| `updatedByUsername` | getter public | 144–146 | — | `string \| null` |

##### `CatalogPhone.create`

- **Firma:** `create(props: CatalogPhoneProps): CatalogPhone` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new CatalogPhone`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-phone-use-case-ts), [catalog-phone.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-mapper-ts), [typeorm-catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-phone-repository-ts)

##### `CatalogPhone.id`

- **Firma:** `id(): string` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.brand`

- **Firma:** `brand(): string` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.model`

- **Firma:** `model(): string` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.description`

- **Firma:** `description(): string \| null` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.price`

- **Firma:** `price(): number` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L68) (L68–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.screen`

- **Firma:** `screen(): string \| null` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L72) (L72–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.ram`

- **Firma:** `ram(): string \| null` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L76) (L76–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.storage`

- **Firma:** `storage(): string \| null` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.camera`

- **Firma:** `camera(): string \| null` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L84) (L84–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.battery`

- **Firma:** `battery(): string \| null` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L88) (L88–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.processor`

- **Firma:** `processor(): string \| null` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L92) (L92–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.operatingSystem`

- **Firma:** `operatingSystem(): string \| null` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L96) (L96–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.extraSpecs`

- **Firma:** `extraSpecs(): CatalogPhoneExtraSpec[]` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L100) (L100–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.isActive`

- **Firma:** `isActive(): boolean` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L104) (L104–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.isPublished`

- **Firma:** `isPublished(): boolean` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L108) (L108–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.sortOrder`

- **Firma:** `sortOrder(): number` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L112) (L112–114)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.likesCount`

- **Firma:** `likesCount(): number` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L116) (L116–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.images`

- **Firma:** `images(): CatalogPhoneImage[]` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L120) (L120–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.createdAt`

- **Firma:** `createdAt(): Date` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L124) (L124–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.updatedAt`

- **Firma:** `updatedAt(): Date` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L128) (L128–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.createdBy`

- **Firma:** `createdBy(): string` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L132) (L132–134)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.createdByUsername`

- **Firma:** `createdByUsername(): string` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L136) (L136–138)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L140) (L140–142)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhone.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [catalog-phone.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-phone.entity.ts#L144) (L144–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-request-entity-ts"></a>

### catalog-request.entity.ts

- **Ruta:** [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts) (`comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts`, 103 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** A lead captured from the public catalog — "Lo quiero" (INTERES_COMPRA) or "Comprar a crédito con Krediya" (INTERES_CREDITO).
- **Consumidores:** [catalog-request-output.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-dtos-catalog-request-output-ts), [create-catalog-request.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts), [update-catalog-request-status.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-request-status-use-case-ts), [catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-request-repository-ts), [catalog-request.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-mapper-ts), [catalog-request.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-orm-entity-ts), [typeorm-catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-request-repository-ts), [catalog-request.response.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-catalog-request-response-dto-ts), [create-catalog-request.request.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-create-catalog-request-request-dto-ts), [list-catalog-requests.query.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-list-catalog-requests-query-dto-ts), [update-catalog-request-status.request.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-update-catalog-request-status-request-dto-ts)

**Interfaces, tipos y enums:**

- `interface CatalogRequestProps` (L6): sin documentación — miembros: `id`, `catalogPhoneId`, `brand`, `model`, `price`, `creditAvailable`, `requestType`, `customerName`, `customerPhone`, `status`, `observation`, `createdAt`, `updatedAt`, `updatedBy`, `updatedByUsername`
- `type CatalogRequestType` (L1) = `'INTERES_COMPRA' \| 'INTERES_CREDITO'`
- `type CatalogRequestStatus` (L3) = `'NUEVA' \| 'CONTACTADA' \| 'EN_PROCESO' \| 'ATENDIDA' \| 'CANCELADA'`

#### Clase `CatalogRequest` (L36–102)

- **Propósito:** A lead captured from the public catalog — "Lo quiero" (INTERES_COMPRA) or "Comprar a crédito con Krediya" (INTERES_CREDITO). Never a sale record: creating one never touches inventory/sales anywhere in this codebase, it only registers interest for an admin to follow up on manually (see `catalog-requests` admin screen). No Krediya API integration exists in this project — an `INTERES_CREDITO` row is exactly as "prepared for future integration" as this gets: no rate/cuota/plazo/approval field anywhere on this entity, on purpose.
- **Dependencias inyectadas (constructor):** `props: CatalogRequestProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 39–41 | `props: CatalogRequestProps` | `CatalogRequest` |
| `id` | getter public | 43–45 | — | `string` |
| `catalogPhoneId` | getter public | 47–49 | — | `string \| null` |
| `brand` | getter public | 51–53 | — | `string` |
| `model` | getter public | 55–57 | — | `string` |
| `price` | getter public | 59–61 | — | `number` |
| `creditAvailable` | getter public | 63–65 | — | `boolean` |
| `requestType` | getter public | 67–69 | — | `CatalogRequestType` |
| `customerName` | getter public | 71–73 | — | `string` |
| `customerPhone` | getter public | 75–77 | — | `string` |
| `status` | getter public | 79–81 | — | `CatalogRequestStatus` |
| `observation` | getter public | 83–85 | — | `string \| null` |
| `createdAt` | getter public | 87–89 | — | `Date` |
| `updatedAt` | getter public | 91–93 | — | `Date` |
| `updatedBy` | getter public | 95–97 | — | `string \| null` |
| `updatedByUsername` | getter public | 99–101 | — | `string \| null` |

##### `CatalogRequest.create`

- **Firma:** `create(props: CatalogRequestProps): CatalogRequest` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new CatalogRequest`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-catalog-request.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts), [catalog-request.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-mapper-ts), [typeorm-catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-request-repository-ts)

##### `CatalogRequest.id`

- **Firma:** `id(): string` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.catalogPhoneId`

- **Firma:** `catalogPhoneId(): string \| null` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.brand`

- **Firma:** `brand(): string` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.model`

- **Firma:** `model(): string` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.price`

- **Firma:** `price(): number` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.creditAvailable`

- **Firma:** `creditAvailable(): boolean` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.requestType`

- **Firma:** `requestType(): CatalogRequestType` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.customerName`

- **Firma:** `customerName(): string` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.customerPhone`

- **Firma:** `customerPhone(): string` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.status`

- **Firma:** `status(): CatalogRequestStatus` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.observation`

- **Firma:** `observation(): string \| null` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.createdAt`

- **Firma:** `createdAt(): Date` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L87) (L87–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.updatedAt`

- **Firma:** `updatedAt(): Date` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L91) (L91–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequest.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [catalog-request.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/entities/catalog-request.entity.ts#L99) (L99–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-image-not-found-error-ts"></a>

### catalog-image-not-found.error.ts

- **Ruta:** [catalog-image-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-image-not-found.error.ts) (`comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-image-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Errores de dominio: declara `CatalogImageNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [remove-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-remove-catalog-phone-image-use-case-ts), [set-primary-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-set-primary-catalog-phone-image-use-case-ts)

#### Clase `CatalogImageNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-inactive-error-ts"></a>

### catalog-phone-inactive.error.ts

- **Ruta:** [catalog-phone-inactive.error.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-phone-inactive.error.ts) (`comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-phone-inactive.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Errores de dominio: declara `CatalogPhoneInactiveError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [publish-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-publish-catalog-phone-use-case-ts)

#### Clase `CatalogPhoneInactiveError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-no-images-error-ts"></a>

### catalog-phone-no-images.error.ts

- **Ruta:** [catalog-phone-no-images.error.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-phone-no-images.error.ts) (`comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-phone-no-images.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Errores de dominio: declara `CatalogPhoneNoImagesError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [publish-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-publish-catalog-phone-use-case-ts)

#### Clase `CatalogPhoneNoImagesError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-found-error-ts"></a>

### catalog-phone-not-found.error.ts

- **Ruta:** [catalog-phone-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-phone-not-found.error.ts) (`comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-phone-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Errores de dominio: declara `CatalogPhoneNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [activate-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-activate-catalog-phone-use-case-ts), [add-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-add-catalog-phone-image-use-case-ts), [deactivate-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-deactivate-catalog-phone-use-case-ts), [get-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-by-id-use-case-ts), [publish-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-publish-catalog-phone-use-case-ts), [remove-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-remove-catalog-phone-image-use-case-ts), [reorder-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-reorder-catalog-phones-use-case-ts), [set-primary-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-set-primary-catalog-phone-image-use-case-ts), [unpublish-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-unpublish-catalog-phone-use-case-ts), [update-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-phone-use-case-ts)

#### Clase `CatalogPhoneNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-phone-not-published-error-ts"></a>

### catalog-phone-not-published.error.ts

- **Ruta:** [catalog-phone-not-published.error.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-phone-not-published.error.ts) (`comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-phone-not-published.error.ts`, 17 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Reused for both "doesn't exist" and "exists but isn't published" on every PUBLIC read (detail, image, create-request) — a 404 here never reveals whether an unpublished/inactive phone actually exists in the admin catalog, same "don't leak existence" reasoning already used elsewhere in this codebase for internal-only rows.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-catalog-request.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts), [get-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-image-use-case-ts), [get-published-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-published-catalog-phone-by-id-use-case-ts), [like-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-like-catalog-phone-use-case-ts)

#### Clase `CatalogPhoneNotPublishedError` (L10–16)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Reused for both "doesn't exist" and "exists but isn't published" on every PUBLIC read (detail, image, create-request) — a 404 here never reveals whether an unpublished/inactive phone actually exists in the admin catalog, same "don't leak existence" reasoning already used elsewhere in this codebase for internal-only rows.
<a id="f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-request-credit-not-available-error-ts"></a>

### catalog-request-credit-not-available.error.ts

- **Ruta:** [catalog-request-credit-not-available.error.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-request-credit-not-available.error.ts) (`comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-request-credit-not-available.error.ts`, 17 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Thrown by `CreateCatalogRequestUseCase` when `requestType === 'INTERES_CREDITO'` but the server-side recalculation of `isKrediyaCreditAvailable(price, minAmount)` comes back `false` — the enforcement point for "el backend debe recalcular la disponibilidad según el precio real" even if a manipulated frontend request claims otherwise.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-catalog-request.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts)

#### Clase `CatalogRequestCreditNotAvailableError` (L10–16)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Thrown by `CreateCatalogRequestUseCase` when `requestType === 'INTERES_CREDITO'` but the server-side recalculation of `isKrediyaCreditAvailable(price, minAmount)` comes back `false` — the enforcement point for "el backend debe recalcular la disponibilidad según el precio real" even if a manipulated frontend request claims otherwise.
<a id="f-comercial-jhoel-api-src-modules-catalog-domain-errors-catalog-request-not-found-error-ts"></a>

### catalog-request-not-found.error.ts

- **Ruta:** [catalog-request-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-request-not-found.error.ts) (`comercial-jhoel-api/src/modules/catalog/domain/errors/catalog-request-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Errores de dominio: declara `CatalogRequestNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-catalog-request-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-request-by-id-use-case-ts), [update-catalog-request-status.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-request-status-use-case-ts)

#### Clase `CatalogRequestNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-catalog-domain-errors-invalid-catalog-image-error-ts"></a>

### invalid-catalog-image.error.ts

- **Ruta:** [invalid-catalog-image.error.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/errors/invalid-catalog-image.error.ts) (`comercial-jhoel-api/src/modules/catalog/domain/errors/invalid-catalog-image.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Errores de dominio: declara `InvalidCatalogImageError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [assert-valid-catalog-image.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-utils-assert-valid-catalog-image-ts)

#### Clase `InvalidCatalogImageError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `message: string`
<a id="f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts"></a>

### catalog-phone.repository.ts

- **Ruta:** [catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/repositories/catalog-phone.repository.ts) (`comercial-jhoel-api/src/modules/catalog/domain/repositories/catalog-phone.repository.ts`, 93 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateCatalogPhoneData`, `UpdateCatalogPhoneData`, `ListCatalogPhonesOptions`, `ReorderCatalogPhoneItem`, `AddCatalogPhoneImageData` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-phone.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-entity-ts), [catalog-phone-image.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-image-entity-ts)
- **Consumidores:** [activate-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-activate-catalog-phone-use-case-ts), [add-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-add-catalog-phone-image-use-case-ts), [create-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-phone-use-case-ts), [create-catalog-request.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts), [deactivate-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-deactivate-catalog-phone-use-case-ts), [get-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-by-id-use-case-ts), [get-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-image-use-case-ts), [get-published-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-published-catalog-phone-by-id-use-case-ts), [like-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-like-catalog-phone-use-case-ts), [list-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-phones-use-case-ts), [list-published-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-published-catalog-phones-use-case-ts), [publish-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-publish-catalog-phone-use-case-ts), [remove-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-remove-catalog-phone-image-use-case-ts), [reorder-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-reorder-catalog-phones-use-case-ts), [set-primary-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-set-primary-catalog-phone-image-use-case-ts) y 4 más

**Interfaces, tipos y enums:**

- `interface CreateCatalogPhoneData` (L9): sin documentación — miembros: `brand`, `model`, `description`, `price`, `screen`, `ram`, `storage`, `camera`, `battery`, `processor`, `operatingSystem`, `extraSpecs`, `createdBy`
- `interface UpdateCatalogPhoneData` (L25): sin documentación — miembros: `brand`, `model`, `description`, `price`, `screen`, `ram`, `storage`, `camera`, `battery`, `processor`, `operatingSystem`, `extraSpecs`, `updatedBy`
- `interface ListCatalogPhonesOptions` (L41): sin documentación — miembros: `includeInactive`, `search`
- `interface ReorderCatalogPhoneItem` (L46): sin documentación — miembros: `id`, `sortOrder`
- `interface AddCatalogPhoneImageData` (L51): sin documentación — miembros: `catalogPhoneId`, `imageData`, `mimeType`, `sizeBytes`, `isPrimary`, `sortOrder`, `createdBy`
- `interface CatalogPhoneImageBytes` (L61): sin documentación — miembros: `data`, `mimeType`, `catalogPhoneId`
- `interface CatalogPhoneRepository` (L67): sin documentación — miembros: `findAll`, `findById`, `findPublished`, `create`, `update`, `setActive`, `setPublished`, `reorder`, `adjustLikes`, `listImages`, `addImage`, `removeImage`, `setPrimaryImage`, `getImage`

**Constantes exportadas:**

- `CATALOG_PHONE_REPOSITORY` (L7) = `Symbol('CATALOG_PHONE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-request-repository-ts"></a>

### catalog-request.repository.ts

- **Ruta:** [catalog-request.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/domain/repositories/catalog-request.repository.ts) (`comercial-jhoel-api/src/modules/catalog/domain/repositories/catalog-request.repository.ts`, 44 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateCatalogRequestData`, `ListCatalogRequestsOptions`, `UpdateCatalogRequestStatusData`, `CatalogRequestRepository`, `CATALOG_REQUEST_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-request.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-request-entity-ts)
- **Consumidores:** [get-alerts.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts), [create-catalog-request.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts), [get-catalog-request-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-request-by-id-use-case-ts), [list-catalog-requests.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-requests-use-case-ts), [update-catalog-request-status.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-request-status-use-case-ts), [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [typeorm-catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-request-repository-ts)

**Interfaces, tipos y enums:**

- `interface CreateCatalogRequestData` (L9): sin documentación — miembros: `catalogPhoneId`, `brand`, `model`, `price`, `creditAvailable`, `requestType`, `customerName`, `customerPhone`
- `interface ListCatalogRequestsOptions` (L20): sin documentación — miembros: `status`, `requestType`, `startDate`, `endDate`
- `interface UpdateCatalogRequestStatusData` (L27): sin documentación — miembros: `status`, `observation`, `updatedBy`
- `interface CatalogRequestRepository` (L33): sin documentación — miembros: `findAll`, `findById`, `create`, `updateStatus`, `countByStatus`

**Constantes exportadas:**

- `CATALOG_REQUEST_REPOSITORY` (L7) = `Symbol('CATALOG_REQUEST_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-mapper-ts"></a>

### catalog-phone-image.mapper.ts

- **Ruta:** [catalog-phone-image.mapper.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-phone-image.mapper.ts) (`comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-phone-image.mapper.ts`, 17 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Mapper: declara `CatalogPhoneImageMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-phone-image.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-image-entity-ts), [catalog-phone-image.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-orm-entity-ts)
- **Consumidores:** [catalog-phone.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-mapper-ts), [typeorm-catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-phone-repository-ts)

#### Clase `CatalogPhoneImageMapper` (L4–16)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–15 | `orm: CatalogPhoneImageOrmEntity` | `CatalogPhoneImage` |

##### `CatalogPhoneImageMapper.toDomain`

- **Firma:** `toDomain(orm: CatalogPhoneImageOrmEntity): CatalogPhoneImage` — [catalog-phone-image.mapper.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-phone-image.mapper.ts#L5) (L5–15)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `CatalogPhoneImage.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-phone.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-mapper-ts), [typeorm-catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-phone-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-orm-entity-ts"></a>

### catalog-phone-image.orm-entity.ts

- **Ruta:** [catalog-phone-image.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-phone-image.orm-entity.ts) (`comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-phone-image.orm-entity.ts`, 46 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `CatalogPhoneImageOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-phone.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phone-image.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-mapper-ts), [catalog-phone.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-orm-entity-ts), [typeorm-catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-phone-repository-ts)

#### Clase `CatalogPhoneImageOrmEntity` (L11–45)

- **Decoradores:** `@Entity('catalog_phone_images')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column catalogPhoneId: string`, `@ManyToOne catalogPhone: CatalogPhoneOrmEntity`, `@Column imageData: Buffer`, `@Column mimeType: string`, `@Column sizeBytes: number`, `@Column isPrimary: boolean`, `@Column sortOrder: number`, `@Column createdBy: string`, `@CreateDateColumn createdAt: Date`
<a id="f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-mapper-ts"></a>

### catalog-phone.mapper.ts

- **Ruta:** [catalog-phone.mapper.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-phone.mapper.ts) (`comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-phone.mapper.ts`, 38 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Mapper: declara `CatalogPhoneMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-phone.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-entity-ts), [catalog-phone.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-orm-entity-ts), [catalog-phone-image.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-mapper-ts)
- **Consumidores:** [typeorm-catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-phone-repository-ts)

#### Clase `CatalogPhoneMapper` (L5–37)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 7–36 | `orm: CatalogPhoneOrmEntity` | `CatalogPhone` |

##### `CatalogPhoneMapper.toDomain`

- **Firma:** `toDomain(orm: CatalogPhoneOrmEntity): CatalogPhone` — [catalog-phone.mapper.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-phone.mapper.ts#L7) (L7–36)
- **Propósito / descripción:** `orm.images` may be `undefined` when the query didn't request the relation (e.g. a future lightweight read) — always normalized to `[]`, never left `undefined` on the domain entity.
- **Dependencias (llamadas en su cuerpo):** `CatalogPhone.create`, `(orm.images ?? []).map`, `CatalogPhoneImageMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-phone-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-orm-entity-ts"></a>

### catalog-phone.orm-entity.ts

- **Ruta:** [catalog-phone.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-phone.orm-entity.ts) (`comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-phone.orm-entity.ts`, 106 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `CatalogPhoneOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [catalog-phone.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-entity-ts), [catalog-phone-image.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-phone-image.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-orm-entity-ts), [catalog-phone.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-mapper-ts), [typeorm-catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-phone-repository-ts)

#### Clase `CatalogPhoneOrmEntity` (L16–105)

- **Decoradores:** `@Entity('catalog_phones')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column brand: string`, `@Column model: string`, `@Column description: string \| null`, `@Column price: number`, `@Column screen: string \| null`, `@Column ram: string \| null`, `@Column storage: string \| null`, `@Column camera: string \| null`, `@Column battery: string \| null`, `@Column processor: string \| null`, `@Column operatingSystem: string \| null`, `@Column extraSpecs: CatalogPhoneExtraSpec[]`, `@Column isActive: boolean`, `@Column isPublished: boolean`, `@Column sortOrder: number`, `@Column likesCount: number`, `@OneToMany images: CatalogPhoneImageOrmEntity[]`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-mapper-ts"></a>

### catalog-request.mapper.ts

- **Ruta:** [catalog-request.mapper.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-request.mapper.ts) (`comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-request.mapper.ts`, 25 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Mapper: declara `CatalogRequestMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-request.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-request-entity-ts), [catalog-request.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-orm-entity-ts)
- **Consumidores:** [typeorm-catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-request-repository-ts)

#### Clase `CatalogRequestMapper` (L4–24)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–23 | `orm: CatalogRequestOrmEntity` | `CatalogRequest` |

##### `CatalogRequestMapper.toDomain`

- **Firma:** `toDomain(orm: CatalogRequestOrmEntity): CatalogRequest` — [catalog-request.mapper.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-request.mapper.ts#L5) (L5–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `CatalogRequest.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-request-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-orm-entity-ts"></a>

### catalog-request.orm-entity.ts

- **Ruta:** [catalog-request.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-request.orm-entity.ts) (`comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/catalog-request.orm-entity.ts`, 74 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `CatalogRequestOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [catalog-request.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-request-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [catalog-request.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-mapper-ts), [typeorm-catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-request-repository-ts)

#### Clase `CatalogRequestOrmEntity` (L17–73)

- **Decoradores:** `@Entity('catalog_requests')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column catalogPhoneId: string \| null`, `@Column brand: string`, `@Column model: string`, `@Column price: number`, `@Column creditAvailable: boolean`, `@Column requestType: CatalogRequestType`, `@Column customerName: string`, `@Column customerPhone: string`, `@Column status: CatalogRequestStatus`, `@Column observation: string \| null`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-phone-repository-ts"></a>

### typeorm-catalog-phone.repository.ts

- **Ruta:** [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts) (`comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts`, 240 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmCatalogPhoneRepository`, `IMAGE_LIST_COLUMNS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-phone.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-entity-ts), [catalog-phone-image.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-image-entity-ts), [catalog-phone.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-phone-repository-ts), [catalog-phone.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-orm-entity-ts), [catalog-phone-image.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-orm-entity-ts), [catalog-phone.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-mapper-ts), [catalog-phone-image.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-phone-image-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts)

#### Clase `TypeOrmCatalogPhoneRepository` (L32–239)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements CatalogPhoneRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(CatalogPhoneOrmEntity) repository: Repository<CatalogPhoneOrmEntity>`, `@InjectRepository(CatalogPhoneImageOrmEntity) imageRepository: Repository<CatalogPhoneImageOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `baseQuery` | método private | 41–49 | — | `SelectQueryBuilder<CatalogPhoneOrmEntity>` |
| `findAll` | método public async | 51–69 | `options?: ListCatalogPhonesOptions` | `Promise<CatalogPhone[]>` |
| `findById` | método public async | 71–76 | `id: string` | `Promise<CatalogPhone \| null>` |
| `findPublished` | método public async | 78–85 | — | `Promise<CatalogPhone[]>` |
| `create` | método public async | 87–107 | `data: CreateCatalogPhoneData` | `Promise<CatalogPhone>` |
| `update` | método public async | 109–132 | `id: string`, `data: UpdateCatalogPhoneData` | `Promise<CatalogPhone>` |
| `setActive` | método public async | 134–140 | `id: string`, `isActive: boolean`, `updatedBy: string` | `Promise<void>` |
| `setPublished` | método public async | 142–148 | `id: string`, `isPublished: boolean`, `updatedBy: string` | `Promise<void>` |
| `reorder` | método public async | 150–162 | `items: ReorderCatalogPhoneItem[]` | `Promise<void>` |
| `adjustLikes` | método public async | 164–172 | `id: string`, `delta: number` | `Promise<number>` |
| `listImages` | método public async | 174–190 | `catalogPhoneId: string` | `Promise<CatalogPhoneImage[]>` |
| `addImage` | método public async | 192–204 | `data: AddCatalogPhoneImageData` | `Promise<CatalogPhoneImage>` |
| `removeImage` | método public async | 206–208 | `catalogPhoneId: string`, `imageId: string` | `Promise<void>` |
| `setPrimaryImage` | método public async | 210–226 | `catalogPhoneId: string`, `imageId: string` | `Promise<void>` |
| `getImage` | método public async | 228–238 | `imageId: string` | `Promise<CatalogPhoneImageBytes \| null>` |

##### `TypeOrmCatalogPhoneRepository.baseQuery`

- **Firma:** `baseQuery(): SelectQueryBuilder<CatalogPhoneOrmEntity>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L41) (L41–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('phone').leftJoinAndSelect`, `this.repository.createQueryBuilder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmCatalogPhoneRepository.findAll`

- **Firma:** `findAll(options?: ListCatalogPhonesOptions): Promise<CatalogPhone[]>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L51) (L51–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery`, `query.andWhere`, `query.addOrderBy('phone.sortOrder', 'ASC').addOrderBy`, `query.addOrderBy`, `query.getMany`, `orms.map`, `CatalogPhoneMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogPhoneRepository.findById`

- **Firma:** `findById(id: string): Promise<CatalogPhone \| null>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L71) (L71–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('phone.id = :id', { id }).getOne`, `this.baseQuery().andWhere`, `this.baseQuery`, `CatalogPhoneMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmCatalogPhoneRepository.findPublished`

- **Firma:** `findPublished(): Promise<CatalogPhone[]>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L78) (L78–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('phone.isPublished = true').andWhere`, `this.baseQuery().andWhere`, `this.baseQuery`, `orms.map`, `CatalogPhoneMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogPhoneRepository.create`

- **Firma:** `create(data: CreateCatalogPhoneData): Promise<CatalogPhone>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L87) (L87–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.findById`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogPhoneRepository.update`

- **Firma:** `update(id: string, data: UpdateCatalogPhoneData): Promise<CatalogPhone>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L109) (L109–132)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.findById`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogPhoneRepository.setActive`

- **Firma:** `setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L134) (L134–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogPhoneRepository.setPublished`

- **Firma:** `setPublished(id: string, isPublished: boolean, updatedBy: string): Promise<void>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L142) (L142–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogPhoneRepository.reorder`

- **Firma:** `reorder(items: ReorderCatalogPhoneItem[]): Promise<void>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L150) (L150–162)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.transaction`, `manager.update`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogPhoneRepository.adjustLikes`

- **Firma:** `adjustLikes(id: string, delta: number): Promise<number>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L164) (L164–172)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`
- **Efectos secundarios:** Tablas en su SQL: `catalog_phones`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogPhoneRepository.listImages`

- **Firma:** `listImages(catalogPhoneId: string): Promise<CatalogPhoneImage[]>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L174) (L174–190)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageRepository.find`, `orms.map`, `CatalogPhoneImageMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogPhoneRepository.addImage`

- **Firma:** `addImage(data: AddCatalogPhoneImageData): Promise<CatalogPhoneImage>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L192) (L192–204)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageRepository.create`, `this.imageRepository.save`, `CatalogPhoneImageMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogPhoneRepository.removeImage`

- **Firma:** `removeImage(catalogPhoneId: string, imageId: string): Promise<void>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L206) (L206–208)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageRepository.delete`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogPhoneRepository.setPrimaryImage`

- **Firma:** `setPrimaryImage(catalogPhoneId: string, imageId: string): Promise<void>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L210) (L210–226)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageRepository.manager.transaction`, `manager.update`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogPhoneRepository.getImage`

- **Firma:** `getImage(imageId: string): Promise<CatalogPhoneImageBytes \| null>` — [typeorm-catalog-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts#L228) (L228–238)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageRepository.findOne`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-typeorm-catalog-request-repository-ts"></a>

### typeorm-catalog-request.repository.ts

- **Ruta:** [typeorm-catalog-request.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-request.repository.ts) (`comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-request.repository.ts`, 97 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmCatalogRequestRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-request.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-request-entity-ts), [catalog-request.repository.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-repositories-catalog-request-repository-ts), [catalog-request.orm-entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-orm-entity-ts), [catalog-request.mapper.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-infrastructure-persistence-catalog-request-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts)

#### Clase `TypeOrmCatalogRequestRepository` (L15–96)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements CatalogRequestRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(CatalogRequestOrmEntity) repository: Repository<CatalogRequestOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 22–51 | `options?: ListCatalogRequestsOptions` | `Promise<CatalogRequest[]>` |
| `findById` | método public async | 53–56 | `id: string` | `Promise<CatalogRequest \| null>` |
| `create` | método public async | 58–74 | `data: CreateCatalogRequestData` | `Promise<CatalogRequest>` |
| `updateStatus` | método public async | 76–91 | `id: string`, `data: UpdateCatalogRequestStatusData` | `Promise<CatalogRequest>` |
| `countByStatus` | método public async | 93–95 | `status: CatalogRequestStatus` | `Promise<number>` |

##### `TypeOrmCatalogRequestRepository.findAll`

- **Firma:** `findAll(options?: ListCatalogRequestsOptions): Promise<CatalogRequest[]>` — [typeorm-catalog-request.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-request.repository.ts#L22) (L22–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('request').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `query.andWhere`, `query.getMany`, `orms.map`, `CatalogRequestMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogRequestRepository.findById`

- **Firma:** `findById(id: string): Promise<CatalogRequest \| null>` — [typeorm-catalog-request.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-request.repository.ts#L53) (L53–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `CatalogRequestMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmCatalogRequestRepository.create`

- **Firma:** `create(data: CreateCatalogRequestData): Promise<CatalogRequest>` — [typeorm-catalog-request.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-request.repository.ts#L58) (L58–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.findById`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogRequestRepository.updateStatus`

- **Firma:** `updateStatus(id: string, data: UpdateCatalogRequestStatusData): Promise<CatalogRequest>` — [typeorm-catalog-request.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-request.repository.ts#L76) (L76–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.findById`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogRequestRepository.countByStatus`

- **Firma:** `countByStatus(status: CatalogRequestStatus): Promise<number>` — [typeorm-catalog-request.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-request.repository.ts#L93) (L93–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.count`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts"></a>

### catalog-phones.controller.ts

- **Ruta:** [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts`, 221 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** "Catálogo → Teléfonos" management — admin-only end-to-end, including `GET` (unlike `PhonesController`'s "any authenticated account" policy): this screen exposes unpublished/inactive phones and lets someone change what the public sees on the landing page, which is a business/marketing decision, not an operational daily-register task.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-phone-use-case-ts), [update-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-phone-use-case-ts), [list-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-phones-use-case-ts), [get-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-by-id-use-case-ts), [activate-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-activate-catalog-phone-use-case-ts), [deactivate-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-deactivate-catalog-phone-use-case-ts), [publish-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-publish-catalog-phone-use-case-ts), [unpublish-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-unpublish-catalog-phone-use-case-ts), [reorder-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-reorder-catalog-phones-use-case-ts), [add-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-add-catalog-phone-image-use-case-ts), [remove-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-remove-catalog-phone-image-use-case-ts) y 6 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/platform-express`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts)

**Interfaces, tipos y enums:**

- `interface UploadedImageFile` (L44): Same minimal shape `PhoneSalesController`/`RechargeSimsController` read off an uploaded file — avoids a `@types/multer` dependency for one field. — miembros: `buffer`, `mimetype`, `size`

#### Clase `CatalogPhonesController` (L57–220)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('catalog/phones')`
- **Propósito:** "Catálogo → Teléfonos" management — admin-only end-to-end, including `GET` (unlike `PhonesController`'s "any authenticated account" policy): this screen exposes unpublished/inactive phones and lets someone change what the public sees on the landing page, which is a business/marketing decision, not an operational daily-register task.
- **Dependencias inyectadas (constructor):** `createCatalogPhoneUseCase: CreateCatalogPhoneUseCase`, `updateCatalogPhoneUseCase: UpdateCatalogPhoneUseCase`, `listCatalogPhonesUseCase: ListCatalogPhonesUseCase`, `getCatalogPhoneByIdUseCase: GetCatalogPhoneByIdUseCase`, `activateCatalogPhoneUseCase: ActivateCatalogPhoneUseCase`, `deactivateCatalogPhoneUseCase: DeactivateCatalogPhoneUseCase`, `publishCatalogPhoneUseCase: PublishCatalogPhoneUseCase`, `unpublishCatalogPhoneUseCase: UnpublishCatalogPhoneUseCase`, `reorderCatalogPhonesUseCase: ReorderCatalogPhonesUseCase`, `addCatalogPhoneImageUseCase: AddCatalogPhoneImageUseCase`, `removeCatalogPhoneImageUseCase: RemoveCatalogPhoneImageUseCase`, `setPrimaryCatalogPhoneImageUseCase: SetPrimaryCatalogPhoneImageUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 76–97 | `dto: CreateCatalogPhoneRequestDto`, `userId: string` | `Promise<CatalogPhoneResponseDto>` |
| `findAll` | método public | 99–107 | `query: ListCatalogPhonesQueryDto` | `Promise<CatalogPhoneResponseDto[]>` |
| `findOne` | método public | 109–114 | `id: string` | `Promise<CatalogPhoneResponseDto>` |
| `update` | método public | 116–137 | `id: string`, `dto: UpdateCatalogPhoneRequestDto`, `userId: string` | `Promise<CatalogPhoneResponseDto>` |
| `activate` | método public | 139–146 | `id: string`, `userId: string` | `Promise<void>` |
| `deactivate` | método public | 148–155 | `id: string`, `userId: string` | `Promise<void>` |
| `publish` | método public | 157–164 | `id: string`, `userId: string` | `Promise<void>` |
| `unpublish` | método public | 166–173 | `id: string`, `userId: string` | `Promise<void>` |
| `reorder` | método public | 175–179 | `dto: ReorderCatalogPhonesRequestDto` | `Promise<void>` |
| `addImage` | método public | 181–198 | `catalogPhoneId: string`, `image: UploadedImageFile`, `userId: string` | `Promise<CatalogPhoneImageResponseDto>` |
| `removeImage` | método public | 200–207 | `catalogPhoneId: string`, `imageId: string` | `Promise<void>` |
| `setPrimaryImage` | método public | 209–219 | `catalogPhoneId: string`, `imageId: string` | `Promise<void>` |

##### `CatalogPhonesController.create`

- **Firma:** `create(dto: CreateCatalogPhoneRequestDto, userId: string): Promise<CatalogPhoneResponseDto>` — [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L76) (L76–97)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createCatalogPhoneUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhonesController.findAll`

- **Firma:** `findAll(query: ListCatalogPhonesQueryDto): Promise<CatalogPhoneResponseDto[]>` — [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L99) (L99–107)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listCatalogPhonesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhonesController.findOne`

- **Firma:** `findOne(id: string): Promise<CatalogPhoneResponseDto>` — [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L109) (L109–114)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getCatalogPhoneByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhonesController.update`

- **Firma:** `update(id: string, dto: UpdateCatalogPhoneRequestDto, userId: string): Promise<CatalogPhoneResponseDto>` — [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L116) (L116–137)
- **Decoradores:** `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateCatalogPhoneUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhonesController.activate`

- **Firma:** `activate(id: string, userId: string): Promise<void>` — [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L139) (L139–146)
- **Decoradores:** `@Post(':id/activate')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.activateCatalogPhoneUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhonesController.deactivate`

- **Firma:** `deactivate(id: string, userId: string): Promise<void>` — [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L148) (L148–155)
- **Decoradores:** `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateCatalogPhoneUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhonesController.publish`

- **Firma:** `publish(id: string, userId: string): Promise<void>` — [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L157) (L157–164)
- **Decoradores:** `@Post(':id/publish')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.publishCatalogPhoneUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhonesController.unpublish`

- **Firma:** `unpublish(id: string, userId: string): Promise<void>` — [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L166) (L166–173)
- **Decoradores:** `@Post(':id/unpublish')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.unpublishCatalogPhoneUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhonesController.reorder`

- **Firma:** `reorder(dto: ReorderCatalogPhonesRequestDto): Promise<void>` — [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L175) (L175–179)
- **Decoradores:** `@Post('reorder')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.reorderCatalogPhonesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhonesController.addImage`

- **Firma:** `addImage(catalogPhoneId: string, image: UploadedImageFile, userId: string): Promise<CatalogPhoneImageResponseDto>` — [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L181) (L181–198)
- **Decoradores:** `@Post(':id/images')` `@UseInterceptors(FileInterceptor('image'))` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) catalogPhoneId`, `@UploadedFile() image`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.addCatalogPhoneImageUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhonesController.removeImage`

- **Firma:** `removeImage(catalogPhoneId: string, imageId: string): Promise<void>` — [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L200) (L200–207)
- **Decoradores:** `@Delete(':id/images/:imageId')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) catalogPhoneId`, `@Param('imageId', ParseUUIDPipe) imageId`
- **Dependencias (llamadas en su cuerpo):** `this.removeCatalogPhoneImageUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogPhonesController.setPrimaryImage`

- **Firma:** `setPrimaryImage(catalogPhoneId: string, imageId: string): Promise<void>` — [catalog-phones.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts#L209) (L209–219)
- **Decoradores:** `@Post(':id/images/:imageId/primary')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) catalogPhoneId`, `@Param('imageId', ParseUUIDPipe) imageId`
- **Dependencias (llamadas en su cuerpo):** `this.setPrimaryCatalogPhoneImageUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-requests-controller-ts"></a>

### catalog-requests.controller.ts

- **Ruta:** [catalog-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-requests.controller.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-requests.controller.ts`, 65 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** "Catálogo → Solicitudes" — admin-only, same guard shape as `CatalogPhonesController`.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [list-catalog-requests.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-requests-use-case-ts), [get-catalog-request-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-request-by-id-use-case-ts), [update-catalog-request-status.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-request-status-use-case-ts), [list-catalog-requests.query.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-list-catalog-requests-query-dto-ts), [update-catalog-request-status.request.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-update-catalog-request-status-request-dto-ts), [catalog-request.response.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-catalog-request-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts)

#### Clase `CatalogRequestsController` (L23–64)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('catalog/requests')`
- **Propósito:** "Catálogo → Solicitudes" — admin-only, same guard shape as `CatalogPhonesController`.
- **Dependencias inyectadas (constructor):** `listCatalogRequestsUseCase: ListCatalogRequestsUseCase`, `getCatalogRequestByIdUseCase: GetCatalogRequestByIdUseCase`, `updateCatalogRequestStatusUseCase: UpdateCatalogRequestStatusUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 33–43 | `query: ListCatalogRequestsQueryDto` | `Promise<CatalogRequestResponseDto[]>` |
| `findOne` | método public | 45–50 | `id: string` | `Promise<CatalogRequestResponseDto>` |
| `updateStatus` | método public | 52–63 | `id: string`, `dto: UpdateCatalogRequestStatusRequestDto`, `userId: string` | `Promise<CatalogRequestResponseDto>` |

##### `CatalogRequestsController.findAll`

- **Firma:** `findAll(query: ListCatalogRequestsQueryDto): Promise<CatalogRequestResponseDto[]>` — [catalog-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-requests.controller.ts#L33) (L33–43)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listCatalogRequestsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequestsController.findOne`

- **Firma:** `findOne(id: string): Promise<CatalogRequestResponseDto>` — [catalog-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-requests.controller.ts#L45) (L45–50)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getCatalogRequestByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequestsController.updateStatus`

- **Firma:** `updateStatus(id: string, dto: UpdateCatalogRequestStatusRequestDto, userId: string): Promise<CatalogRequestResponseDto>` — [catalog-requests.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-requests.controller.ts#L52) (L52–63)
- **Decoradores:** `@Patch(':id/status')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateCatalogRequestStatusUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts"></a>

### public-catalog.controller.ts

- **Ruta:** [public-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts`, 141 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Public, unauthenticated — backs the landing page's "Teléfonos" section.
- **Depende de (archivos del proyecto):** [list-published-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-published-catalog-phones-use-case-ts), [get-published-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-published-catalog-phone-by-id-use-case-ts), [get-catalog-phone-image.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-image-use-case-ts), [create-catalog-request.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts), [like-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-like-catalog-phone-use-case-ts), [create-catalog-request.request.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-create-catalog-request-request-dto-ts), [catalog-request.response.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-catalog-request-response-dto-ts), [public-catalog-phone.response.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-public-catalog-phone-response-dto-ts), [parse-visitor-id.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-application-utils-parse-visitor-id-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/throttler`, `express`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts)

#### Clase `PublicCatalogController` (L47–140)

- **Decoradores:** `@Controller('public-catalog')`
- **Propósito:** Public, unauthenticated — backs the landing page's "Teléfonos" section. No class-level guard, same pattern `PublicCompanyController` already uses: never strip the guard off `CatalogPhonesController`/ `CatalogRequestsController` themselves, add a separate, deliberately narrow route instead. Every response here is filtered/recalculated server-side — nothing here ever trusts client-supplied price or eligibility data (see `CreateCatalogRequestUseCase`). Deliberately a DIFFERENT path prefix (`public-catalog`, not `catalog`) — same reasoning `PublicCompanyController` already applies (`company-info` vs. `company-settings`): `CatalogPhonesController` already owns `GET /catalog/phones` (admin-gated). Nest matches routes in controller registration order with no guard-awareness, so a same-path public route registered after it would simply never be reached, and one registered before it would shadow 
- **Dependencias inyectadas (constructor):** `listPublishedCatalogPhonesUseCase: ListPublishedCatalogPhonesUseCase`, `getPublishedCatalogPhoneByIdUseCase: GetPublishedCatalogPhoneByIdUseCase`, `getCatalogPhoneImageUseCase: GetCatalogPhoneImageUseCase`, `createCatalogRequestUseCase: CreateCatalogRequestUseCase`, `likeCatalogPhoneUseCase: LikeCatalogPhoneUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAllPublished` | método public | 57–62 | `visitorIdHeader?: string` | `Promise<PublicCatalogPhoneResponseDto[]>` |
| `findOnePublished` | método public | 64–70 | `id: string`, `visitorIdHeader?: string` | `Promise<PublicCatalogPhoneResponseDto>` |
| `getImage` | método public async | 91–104 | `imageId: string`, `res: Response` | `Promise<void>` |
| `createRequest` | método public | 106–117 | `dto: CreateCatalogRequestRequestDto` | `Promise<CatalogRequestResponseDto>` |
| `like` | método public | 119–128 | `id: string`, `visitorIdHeader?: string` | `Promise<{ likesCount: number; liked: boolean }>` |
| `unlike` | método public | 130–139 | `id: string`, `visitorIdHeader?: string` | `Promise<{ likesCount: number; liked: boolean }>` |

##### `PublicCatalogController.findAllPublished`

- **Firma:** `findAllPublished(visitorIdHeader?: string): Promise<PublicCatalogPhoneResponseDto[]>` — [public-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts#L57) (L57–62)
- **Decoradores:** `@Get('phones')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Headers('x-visitor-id') visitorIdHeader`
- **Dependencias (llamadas en su cuerpo):** `this.listPublishedCatalogPhonesUseCase.execute`, `parseOptionalVisitorId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicCatalogController.findOnePublished`

- **Firma:** `findOnePublished(id: string, visitorIdHeader?: string): Promise<PublicCatalogPhoneResponseDto>` — [public-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts#L64) (L64–70)
- **Decoradores:** `@Get('phones/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Headers('x-visitor-id') visitorIdHeader`
- **Dependencias (llamadas en su cuerpo):** `this.getPublishedCatalogPhoneByIdUseCase.execute`, `parseOptionalVisitorId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicCatalogController.getImage`

- **Firma:** `getImage(imageId: string, res: Response): Promise<void>` — [public-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts#L91) (L91–104)
- **Decoradores:** `@Get('phones/images/:imageId')`
- **Propósito / descripción:** The one public place a catalog photo's bytes are served. Long, cacheable `Cache-Control` (unlike the private/short-lived one on `PhoneSalesController.getDpiImage`) — this is marketing content meant to be cached by the browser, not a sensitive identity document. `Cross-Origin-Resource-Policy: cross-origin` overrides `helmet()`'s global default (`same-origin`, set in `main.ts`) — that default is correct everywhere else in this API (nothing else is meant to be loaded as a raw `&lt;img src&gt;`/asset from a different origin), but this one route's entire purpose is exactly that: the landing app (`comercial-jhoel-app`, a different origin in dev and in some deploy topologies) renders these bytes directly
- **Origen de parámetros:** `@Param('imageId', ParseUUIDPipe) imageId`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.getCatalogPhoneImageUseCase.execute`, `res.set`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicCatalogController.createRequest`

- **Firma:** `createRequest(dto: CreateCatalogRequestRequestDto): Promise<CatalogRequestResponseDto>` — [public-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts#L106) (L106–117)
- **Decoradores:** `@Post('requests')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.createCatalogRequestUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicCatalogController.like`

- **Firma:** `like(id: string, visitorIdHeader?: string): Promise<{ likesCount: number; liked: boolean }>` — [public-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts#L119) (L119–128)
- **Decoradores:** `@Post('phones/:id/like')` `@HttpCode(HttpStatus.OK)` `@UseGuards(ThrottlerGuard)` `@Throttle({ default: { limit: 30, ttl: 60_000 } })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Headers('x-visitor-id') visitorIdHeader`
- **Dependencias (llamadas en su cuerpo):** `this.likeCatalogPhoneUseCase.execute`, `parseRequiredVisitorId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicCatalogController.unlike`

- **Firma:** `unlike(id: string, visitorIdHeader?: string): Promise<{ likesCount: number; liked: boolean }>` — [public-catalog.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/public-catalog.controller.ts#L130) (L130–139)
- **Decoradores:** `@Post('phones/:id/unlike')` `@HttpCode(HttpStatus.OK)` `@UseGuards(ThrottlerGuard)` `@Throttle({ default: { limit: 30, ttl: 60_000 } })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Headers('x-visitor-id') visitorIdHeader`
- **Dependencias (llamadas en su cuerpo):** `this.likeCatalogPhoneUseCase.execute`, `parseRequiredVisitorId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-catalog-phone-extra-spec-dto-ts"></a>

### catalog-phone-extra-spec.dto.ts

- **Ruta:** [catalog-phone-extra-spec.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/dtos/catalog-phone-extra-spec.dto.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/dtos/catalog-phone-extra-spec.dto.ts`, 15 líneas)
- **Tipo:** DTO · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** One `extraSpecs` row — "otras especificaciones configuradas desde el panel".
- **Paquetes externos:** `class-validator`
- **Consumidores:** [create-catalog-phone.request.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-create-catalog-phone-request-dto-ts), [update-catalog-phone.request.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-update-catalog-phone-request-dto-ts)

#### Clase `CatalogPhoneExtraSpecDto` (L4–14)

- **Propósito:** One `extraSpecs` row — "otras especificaciones configuradas desde el panel". Validated as a nested object (not a loose `Record`) so `forbidNonWhitelisted` still rejects stray keys inside each entry.
<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-catalog-phone-response-dto-ts"></a>

### catalog-phone.response.dto.ts

- **Ruta:** [catalog-phone.response.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/dtos/catalog-phone.response.dto.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/dtos/catalog-phone.response.dto.ts`, 37 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** DTO de respuesta: declara `CatalogPhoneImageResponseDto`, `CatalogPhoneResponseDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-phone.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-entity-ts)
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts), [public-catalog-phone.response.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-public-catalog-phone-response-dto-ts)

#### Clase `CatalogPhoneImageResponseDto` (L3–7)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CatalogPhoneResponseDto` (L10–36)

- **Propósito:** Admin shape — full internal fields, never returned by a public/unauthenticated route.
<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-catalog-request-response-dto-ts"></a>

### catalog-request.response.dto.ts

- **Ruta:** [catalog-request.response.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/dtos/catalog-request.response.dto.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/dtos/catalog-request.response.dto.ts`, 23 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** DTO de respuesta: declara `CatalogRequestResponseDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-request.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-request-entity-ts)
- **Consumidores:** [catalog-requests.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-requests-controller-ts), [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts)

#### Clase `CatalogRequestResponseDto` (L6–22)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-create-catalog-phone-request-dto-ts"></a>

### create-catalog-phone.request.dto.ts

- **Ruta:** [create-catalog-phone.request.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/dtos/create-catalog-phone.request.dto.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/dtos/create-catalog-phone.request.dto.ts`, 78 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** No `isActive`/`isPublished`/`sortOrder` here — a phone is always created inactive-for-publishing-purposes (`isPublished: false`) and gets those via their own dedicated endpoints (`publish`/`unpublish`/`reorder`), never via create/update.
- **Depende de (archivos del proyecto):** [catalog-phone-extra-spec.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-catalog-phone-extra-spec-dto-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

#### Clase `CreateCatalogPhoneRequestDto` (L16–77)

- **Propósito:** No `isActive`/`isPublished`/`sortOrder` here — a phone is always created inactive-for-publishing-purposes (`isPublished: false`) and gets those via their own dedicated endpoints (`publish`/`unpublish`/`reorder`), never via create/update.
<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-create-catalog-request-request-dto-ts"></a>

### create-catalog-request.request.dto.ts

- **Ruta:** [create-catalog-request.request.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/dtos/create-catalog-request.request.dto.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/dtos/create-catalog-request.request.dto.ts`, 39 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Public, unauthenticated body — deliberately minimal.
- **Depende de (archivos del proyecto):** [catalog-request.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-request-entity-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts)

#### Clase `CreateCatalogRequestRequestDto` (L19–38)

- **Propósito:** Public, unauthenticated body — deliberately minimal. No `price`, `creditAvailable`, `brand`, or `model` field exists here at all: the global `ValidationPipe({ forbidNonWhitelisted: true })` rejects the request outright (400) if a caller tries to smuggle any of those in, which is what makes "el backend debe recalcular la disponibilidad según el precio real" actually enforceable rather than just a convention.
<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-list-catalog-phones-query-dto-ts"></a>

### list-catalog-phones.query.dto.ts

- **Ruta:** [list-catalog-phones.query.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/dtos/list-catalog-phones.query.dto.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/dtos/list-catalog-phones.query.dto.ts`, 15 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** DTO de consulta: declara `ListCatalogPhonesQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

#### Clase `ListCatalogPhonesQueryDto` (L4–14)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-list-catalog-requests-query-dto-ts"></a>

### list-catalog-requests.query.dto.ts

- **Ruta:** [list-catalog-requests.query.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/dtos/list-catalog-requests.query.dto.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/dtos/list-catalog-requests.query.dto.ts`, 36 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** DTO de consulta: declara `ListCatalogRequestsQueryDto`, `CATALOG_REQUEST_STATUSES`, `CATALOG_REQUEST_TYPES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-request.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-request-entity-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [catalog-requests.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-requests-controller-ts)

#### Clase `ListCatalogRequestsQueryDto` (L19–35)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-public-catalog-phone-response-dto-ts"></a>

### public-catalog-phone.response.dto.ts

- **Ruta:** [public-catalog-phone.response.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/dtos/public-catalog-phone.response.dto.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/dtos/public-catalog-phone.response.dto.ts`, 32 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** Public shape — backs the landing page's "Teléfonos" catalog.
- **Depende de (archivos del proyecto):** [catalog-phone.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-phone-entity-ts), [catalog-phone.response.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-catalog-phone-response-dto-ts)
- **Consumidores:** [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts)

#### Clase `PublicCatalogPhoneResponseDto` (L13–31)

- **Propósito:** Public shape — backs the landing page's "Teléfonos" catalog. No `isActive`/`isPublished`/`sortOrder`/`createdBy*`/`updatedBy*` — a phone never reaches this DTO unless it's already published+active (see `ListPublishedCatalogPhonesUseCase`/`GetPublishedCatalogPhoneByIdUseCase`), so those flags would add nothing. No `costPrice`/inventory/IMEI field exists on this aggregate at all — there is nothing internal to accidentally leak here.
<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-reorder-catalog-phones-request-dto-ts"></a>

### reorder-catalog-phones.request.dto.ts

- **Ruta:** [reorder-catalog-phones.request.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/dtos/reorder-catalog-phones.request.dto.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/dtos/reorder-catalog-phones.request.dto.ts`, 29 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** DTO de entrada: declara `ReorderCatalogPhoneItemDto`, `ReorderCatalogPhonesRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

#### Clase `ReorderCatalogPhoneItemDto` (L12–19)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ReorderCatalogPhonesRequestDto` (L21–28)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-update-catalog-phone-request-dto-ts"></a>

### update-catalog-phone.request.dto.ts

- **Ruta:** [update-catalog-phone.request.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/dtos/update-catalog-phone.request.dto.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/dtos/update-catalog-phone.request.dto.ts`, 80 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** DTO de entrada: declara `UpdateCatalogPhoneRequestDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-phone-extra-spec.dto.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-catalog-phone-extra-spec-dto-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [catalog-phones.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-phones-controller-ts)

#### Clase `UpdateCatalogPhoneRequestDto` (L15–79)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-catalog-presentation-dtos-update-catalog-request-status-request-dto-ts"></a>

### update-catalog-request-status.request.dto.ts

- **Ruta:** [update-catalog-request-status.request.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog/presentation/dtos/update-catalog-request-status.request.dto.ts) (`comercial-jhoel-api/src/modules/catalog/presentation/dtos/update-catalog-request-status.request.dto.ts`, 21 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `catalog`
- **Responsabilidad:** DTO de entrada: declara `UpdateCatalogRequestStatusRequestDto`, `CATALOG_REQUEST_STATUSES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-request.entity.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-domain-entities-catalog-request-entity-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [catalog-requests.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-catalog-requests-controller-ts)

#### Clase `UpdateCatalogRequestStatusRequestDto` (L12–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
