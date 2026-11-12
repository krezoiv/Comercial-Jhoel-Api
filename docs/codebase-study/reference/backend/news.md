# Módulo backend `news`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/news` | [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L58) `NewsController.create` | [CreateNewsArticleUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts) | `NewsArticleRepository`.findBySlug/create<br>`NewsTypeRepository`.findById<br>`SendPushForArticleUseCase`.execute | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsService.createArticle` |
| `GET /api/news` | [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L73) `NewsController.findAll` | [ListNewsArticlesUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-news-articles-use-case-ts) | `NewsArticleRepository`.findAll | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsService.getArticles` |
| `GET /api/news/:id` | [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L81) `NewsController.findOne` | [GetNewsArticleByIdUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-by-id-use-case-ts) | `NewsArticleRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsService.getArticleById` |
| `PATCH /api/news/:id` | [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L86) `NewsController.update` | [UpdateNewsArticleUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-update-news-article-use-case-ts) | `NewsArticleRepository`.findById/update<br>`NewsTypeRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsService.updateArticle` |
| `POST /api/news/:id/activate` | [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L101) `NewsController.activate` | [SetNewsArticleActiveUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-active-use-case-ts) | `NewsArticleRepository`.findById/setActive | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsService.activateArticle` |
| `DELETE /api/news/:id` | [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L110) `NewsController.deactivate` | [SetNewsArticleActiveUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-active-use-case-ts) | `NewsArticleRepository`.findById/setActive | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsService.deactivateArticle` |
| `POST /api/news/reorder` | [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L119) `NewsController.reorder` | [ReorderNewsArticlesUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-reorder-news-articles-use-case-ts) | `NewsArticleRepository`.findById/reorder | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsService.reorderArticles` |
| `POST /api/news/:id/image` | [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L125) `NewsController.setImage` | [SetNewsArticleImageUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-image-use-case-ts) | `NewsArticleRepository`.findById/setImage | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsService.setImage` |
| `DELETE /api/news/:id/image` | [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L140) `NewsController.removeImage` | [RemoveNewsArticleImageUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-remove-news-article-image-use-case-ts) | `NewsArticleRepository`.findById/removeImage | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsService.removeImage` |
| `GET /api/public-news` | [public-news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts#L37) `PublicNewsController.findAll` | [ListPublishedNewsArticlesUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-published-news-articles-use-case-ts) | `NewsArticleRepository`.findPublished<br>`CatalogLikeRepository`.getCountsBatch/getLikedEntityIds [catalog_likes] | — | `PublicNewsService.getPublishedArticles` |
| `GET /api/public-news/by-slug/:slug` | [public-news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts#L44) `PublicNewsController.findOneBySlug` | [GetPublishedNewsArticleBySlugUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-slug-use-case-ts) | `NewsArticleRepository`.findPublishedBySlug<br>`CatalogLikeRepository`.getCount/getLikedEntityIds [catalog_likes] | — | `PublicNewsService.getArticleBySlug` |
| `GET /api/public-news/:id` | [public-news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts#L52) `PublicNewsController.findOne` | [GetPublishedNewsArticleByIdUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-id-use-case-ts) | `NewsArticleRepository`.findById<br>`CatalogLikeRepository`.getCount/getLikedEntityIds [catalog_likes] | — | `PublicNewsService.getArticleById` |
| `GET /api/public-news/images/:id` | [public-news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts#L60) `PublicNewsController.getImage` | [GetNewsArticleImageUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-image-use-case-ts) | `NewsArticleRepository`.findById/getImage | — | — |
| `POST /api/public-news/:id/like` | [public-news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts#L75) `PublicNewsController.like` | [LikeNewsArticleUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-like-news-article-use-case-ts) | `NewsArticleRepository`.findById<br>`CatalogLikeRepository`.like/unlike/getCount | UseGuards(ThrottlerGuard) Throttle({ default: { limit: 30, ttl: 60_000 } }) | `PublicNewsService.likeArticle` |
| `POST /api/public-news/:id/unlike` | [public-news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts#L86) `PublicNewsController.unlike` | [LikeNewsArticleUseCase](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-like-news-article-use-case-ts) | `NewsArticleRepository`.findById<br>`CatalogLikeRepository`.like/unlike/getCount | UseGuards(ThrottlerGuard) Throttle({ default: { limit: 30, ttl: 60_000 } }) | `PublicNewsService.unlikeArticle` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [news-article-output.ts](#f-comercial-jhoel-api-src-modules-news-application-dtos-news-article-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toNewsArticleOutput`, `toPublicNewsArticleOutput`, `NewsArticleOutput`, `PublicNewsArticleOutput` (sin comentario de documentación en el código). | 1 internas | 7 | Media (7 consumidores) |
| [create-news-article.use-case.ts](#f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts) | .ts | Caso de uso | Aplicación | Único punto donde se dispara el aviso por Web Push (solo NUEVA NOTICIA — `UpdateNewsArticleUseCase` nunca lo llama). | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-news-article-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetNewsArticleByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-news-article-image.use-case.ts](#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-image-use-case-ts) | .ts | Caso de uso | Aplicación | Público, sin guard — pero valida que la noticia siga activa: desactivarla oculta también su imagen. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-published-news-article-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetPublishedNewsArticleByIdUseCase` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-published-news-article-by-slug.use-case.ts](#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-slug-use-case-ts) | .ts | Caso de uso | Aplicación | Backs la URL pública real `/noticias/:slug` — mismo criterio de "no revela existencia" que la versión por id: 404 tanto si no existe como si está inactiva. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [like-news-article.use-case.ts](#f-comercial-jhoel-api-src-modules-news-application-use-cases-like-news-article-use-case-ts) | .ts | Caso de uso | Aplicación | "Me gusta" público — solo sobre noticias activas. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-news-articles.use-case.ts](#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-news-articles-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListNewsArticlesUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-published-news-articles.use-case.ts](#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-published-news-articles-use-case-ts) | .ts | Caso de uso | Aplicación | Backs Noticias en la landing — solo activas, ordenadas por sortOrder y fecha de publicación reciente. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [remove-news-article-image.use-case.ts](#f-comercial-jhoel-api-src-modules-news-application-use-cases-remove-news-article-image-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `RemoveNewsArticleImageUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [reorder-news-articles.use-case.ts](#f-comercial-jhoel-api-src-modules-news-application-use-cases-reorder-news-articles-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ReorderNewsArticlesUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [set-news-article-active.use-case.ts](#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-active-use-case-ts) | .ts | Caso de uso | Aplicación | Un solo flag activo/inactivo controla visibilidad pública y gestión admin — nunca se elimina físicamente una noticia ya publicada. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [set-news-article-image.use-case.ts](#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-image-use-case-ts) | .ts | Caso de uso | Aplicación | Subir = reemplazar — una sola imagen principal por noticia. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-news-article.use-case.ts](#f-comercial-jhoel-api-src-modules-news-application-use-cases-update-news-article-use-case-ts) | .ts | Caso de uso | Aplicación | Editar — incluido cambiar la clasificación — NUNCA dispara notificaciones (punto 11/28 del pedido). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [assert-valid-news-article-image.ts](#f-comercial-jhoel-api-src-modules-news-application-utils-assert-valid-news-article-image-ts) | .ts | Utilidad | Aplicación | Utilidad: declara `assertValidNewsArticleImage`, `UploadedNewsArticleImage`, `MAX_NEWS_ARTICLE_IMAGE_SIZE_BYTES`, `ALLOWED_MIME_TYPES` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [generate-news-article-slug.ts](#f-comercial-jhoel-api-src-modules-news-application-utils-generate-news-article-slug-ts) | .ts | Utilidad | Aplicación | Copia local del slugify de `modules/news-types` — mismo criterio de "pequeña copia por módulo" ya establecido en este proyecto. | 0 internas | 1 | Baja (1 consumidores) |
| [news-article.entity.ts](#f-comercial-jhoel-api-src-modules-news-domain-entities-news-article-entity-ts) | .ts | Entidad de dominio | Dominio | Contenido editorial, no un producto — sin precio, sin categoría, sin WhatsApp, sin Krediya. | 0 internas | 4 | Media (4 consumidores) |
| [invalid-news-article-image.error.ts](#f-comercial-jhoel-api-src-modules-news-domain-errors-invalid-news-article-image-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidNewsArticleImageError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [news-article-not-found.error.ts](#f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `NewsArticleNotFoundError` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [news-article-not-visible.error.ts](#f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-visible-error-ts) | .ts | Errores de dominio | Dominio | 404 tanto si no existe como si existe pero está inactiva — nunca revela cuál, mismo criterio de Teléfonos/Librería/Variedades. | 1 internas | 4 | Media (4 consumidores) |
| [news-article.repository.ts](#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateNewsArticleData`, `UpdateNewsArticleData`, `ListNewsArticlesOptions`, `ReorderNewsArticleItem`, `NewsArticleImageBytes` (sin comentario de documentación en el código). | 1 internas | 15 | Alta (15 consumidores) |
| [news-article.mapper.ts](#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-news-article-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `NewsArticleMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [news-article.orm-entity.ts](#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-news-article-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | `imageData` usa `select: false` — mismo patrón ya usado en Teléfonos/Librería/Variedades: nunca viaja en un listado normal, solo `getImage()` la selecciona explícitamente. | 2 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [typeorm-news-article.repository.ts](#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-typeorm-news-article-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmNewsArticleRepository` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [news.module.ts](#f-comercial-jhoel-api-src-modules-news-news-module-ts) | .ts | Módulo | Arranque / configuración | "Noticias" — contenido editorial, completamente independiente de Inventario/Teléfonos/Librería/Variedades. | 21 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |
| [news.controller.ts](#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts) | .ts | Controlador | Presentación | Admin-only end to end — "Sistema → Noticias". | 17 internas; ext.: @nestjs/common, @nestjs/platform-express | 1 | Media (controlador) |
| [public-news.controller.ts](#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts) | .ts | Controlador | Presentación | Público, sin guard — backs "Noticias" en la landing. | 7 internas; ext.: @nestjs/common, @nestjs/throttler, express | 1 | Media (controlador) |
| [create-news-article.request.dto.ts](#f-comercial-jhoel-api-src-modules-news-presentation-dtos-create-news-article-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateNewsArticleRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-news-articles.query.dto.ts](#f-comercial-jhoel-api-src-modules-news-presentation-dtos-list-news-articles-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListNewsArticlesQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [news-article.response.dto.ts](#f-comercial-jhoel-api-src-modules-news-presentation-dtos-news-article-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `NewsArticleResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [public-news-article.response.dto.ts](#f-comercial-jhoel-api-src-modules-news-presentation-dtos-public-news-article-response-dto-ts) | .ts | DTO de respuesta | Presentación | Backs Noticias en la landing — sin isActive/audit, solo lo que un visitante puede ver. | 0 internas | 1 | Baja (1 consumidores) |
| [reorder-news-articles.request.dto.ts](#f-comercial-jhoel-api-src-modules-news-presentation-dtos-reorder-news-articles-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `ReorderNewsArticleItemDto`, `ReorderNewsArticlesRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [update-news-article.request.dto.ts](#f-comercial-jhoel-api-src-modules-news-presentation-dtos-update-news-article-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateNewsArticleRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-news-application-dtos-news-article-output-ts"></a>

### news-article-output.ts

- **Ruta:** [news-article-output.ts](../../../../comercial-jhoel-api/src/modules/news/application/dtos/news-article-output.ts) (`comercial-jhoel-api/src/modules/news/application/dtos/news-article-output.ts`, 76 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** DTO de salida (aplicación): declara `toNewsArticleOutput`, `toPublicNewsArticleOutput`, `NewsArticleOutput`, `PublicNewsArticleOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-article.entity.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-entities-news-article-entity-ts)
- **Consumidores:** [create-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts), [get-news-article-by-id.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-by-id-use-case-ts), [get-published-news-article-by-id.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-id-use-case-ts), [get-published-news-article-by-slug.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-slug-use-case-ts), [list-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-news-articles-use-case-ts), [list-published-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-published-news-articles-use-case-ts), [update-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-update-news-article-use-case-ts)

**Interfaces, tipos y enums:**

- `interface NewsArticleOutput` (L3): sin documentación — miembros: `id`, `title`, `slug`, `description`, `publishedAt`, `newsTypeId`, `newsTypeName`, `isActive`, `sortOrder`, `likesCount`, `hasImage`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface PublicNewsArticleOutput` (L24): Backs Noticias en la landing — sin isActive/audit, solo lo que un visitante puede ver. — miembros: `id`, `title`, `slug`, `description`, `publishedAt`, `newsTypeName`, `hasImage`, `likesCount`, `liked`
#### Función `toNewsArticleOutput` (L37–57)

- **Tipo:** función exportada
- **Firma:** `toNewsArticleOutput(article: NewsArticle): NewsArticleOutput` — [news-article-output.ts](../../../../comercial-jhoel-api/src/modules/news/application/dtos/news-article-output.ts#L37)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts), [get-news-article-by-id.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-by-id-use-case-ts), [update-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-update-news-article-use-case-ts)

#### Función `toPublicNewsArticleOutput` (L59–75)

- **Tipo:** función exportada
- **Firma:** `toPublicNewsArticleOutput(article: NewsArticle, likesCount: number, liked: boolean): PublicNewsArticleOutput` — [news-article-output.ts](../../../../comercial-jhoel-api/src/modules/news/application/dtos/news-article-output.ts#L59)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-published-news-article-by-id.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-id-use-case-ts), [get-published-news-article-by-slug.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-slug-use-case-ts), [list-published-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-published-news-articles-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts"></a>

### create-news-article.use-case.ts

- **Ruta:** [create-news-article.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/create-news-article.use-case.ts) (`comercial-jhoel-api/src/modules/news/application/use-cases/create-news-article.use-case.ts`, 79 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Único punto donde se dispara el aviso por Web Push (solo NUEVA NOTICIA — `UpdateNewsArticleUseCase` nunca lo llama).
- **Depende de (archivos del proyecto):** [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [invalid-news-type.error.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-errors-invalid-news-type-error-ts), [send-push-for-article.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-send-push-for-article-use-case-ts), [generate-news-article-slug.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-utils-generate-news-article-slug-ts), [news-article-output.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-dtos-news-article-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateNewsArticleInput` (L13): sin documentación — miembros: `title`, `description`, `publishedAt`, `newsTypeId`, `userId`

#### Clase `CreateNewsArticleUseCase` (L28–78)

- **Decoradores:** `@Injectable()`
- **Propósito:** Único punto donde se dispara el aviso por Web Push (solo NUEVA NOTICIA — `UpdateNewsArticleUseCase` nunca lo llama). El envío es un proceso secundario: cualquier fallo queda contenido aquí sin poder tumbar ni retrasar la publicación de la noticia (ver el doc comment de `SendPushForArticleUseCase`).
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_ARTICLE_REPOSITORY) newsArticleRepository: NewsArticleRepository`, `@Inject(NEWS_TYPE_REPOSITORY) newsTypeRepository: NewsTypeRepository`, `sendPushForArticleUseCase: SendPushForArticleUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 40–77 | `input: CreateNewsArticleInput` | `Promise<NewsArticleOutput>` |

##### `CreateNewsArticleUseCase.execute`

- **Firma:** `execute(input: CreateNewsArticleInput): Promise<NewsArticleOutput>` — [create-news-article.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/create-news-article.use-case.ts#L40) (L40–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsTypeRepository.findById`, `new InvalidNewsTypeError`, `input.title.trim`, `input.description.trim`, `generateNewsArticleSlug`, `this.newsArticleRepository.findBySlug`, `this.newsArticleRepository.create`, `description.slice`, `this.sendPushForArticleUseCase.execute`, `this.logger.error`, `toNewsArticleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidNewsTypeError()`
- **Consumidores:** [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-by-id-use-case-ts"></a>

### get-news-article-by-id.use-case.ts

- **Ruta:** [get-news-article-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/get-news-article-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/news/application/use-cases/get-news-article-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Caso de uso: declara `GetNewsArticleByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-article-not-found.error.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-found-error-ts), [news-article-output.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-dtos-news-article-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

#### Clase `GetNewsArticleByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_ARTICLE_REPOSITORY) newsArticleRepository: NewsArticleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<NewsArticleOutput>` |

##### `GetNewsArticleByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<NewsArticleOutput>` — [get-news-article-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/get-news-article-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsArticleRepository.findById`, `new NewsArticleNotFoundError`, `toNewsArticleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsArticleNotFoundError(id)`
- **Consumidores:** [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-image-use-case-ts"></a>

### get-news-article-image.use-case.ts

- **Ruta:** [get-news-article-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/get-news-article-image.use-case.ts) (`comercial-jhoel-api/src/modules/news/application/use-cases/get-news-article-image.use-case.ts`, 33 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Público, sin guard — pero valida que la noticia siga activa: desactivarla oculta también su imagen.
- **Depende de (archivos del proyecto):** [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-article-not-visible.error.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-visible-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts)

**Interfaces, tipos y enums:**

- `interface NewsArticleImageBytesOutput` (L6): sin documentación — miembros: `data`, `mimeType`

#### Clase `GetNewsArticleImageUseCase` (L12–32)

- **Decoradores:** `@Injectable()`
- **Propósito:** Público, sin guard — pero valida que la noticia siga activa: desactivarla oculta también su imagen.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_ARTICLE_REPOSITORY) newsArticleRepository: NewsArticleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–31 | `id: string` | `Promise<NewsArticleImageBytesOutput>` |

##### `GetNewsArticleImageUseCase.execute`

- **Firma:** `execute(id: string): Promise<NewsArticleImageBytesOutput>` — [get-news-article-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/get-news-article-image.use-case.ts#L19) (L19–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsArticleRepository.findById`, `new NewsArticleNotVisibleError`, `this.newsArticleRepository.getImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsArticleNotVisibleError()`
- **Consumidores:** [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-id-use-case-ts"></a>

### get-published-news-article-by-id.use-case.ts

- **Ruta:** [get-published-news-article-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/get-published-news-article-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/news/application/use-cases/get-published-news-article-by-id.use-case.ts`, 32 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Caso de uso: declara `GetPublishedNewsArticleByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-article-not-visible.error.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-visible-error-ts), [catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts), [news-article-output.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-dtos-news-article-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts)

#### Clase `GetPublishedNewsArticleByIdUseCase` (L9–31)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_ARTICLE_REPOSITORY) newsArticleRepository: NewsArticleRepository`, `@Inject(CATALOG_LIKE_REPOSITORY) catalogLikeRepository: CatalogLikeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 18–30 | `id: string`, `visitorId?: string` | `Promise<PublicNewsArticleOutput>` |

##### `GetPublishedNewsArticleByIdUseCase.execute`

- **Firma:** `execute(id: string, visitorId?: string): Promise<PublicNewsArticleOutput>` — [get-published-news-article-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/get-published-news-article-by-id.use-case.ts#L18) (L18–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsArticleRepository.findById`, `new NewsArticleNotVisibleError`, `Promise.all`, `this.catalogLikeRepository.getCount`, `this.catalogLikeRepository.getLikedEntityIds`, `Promise.resolve`, `new Set`, `toPublicNewsArticleOutput`, `likedIds.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsArticleNotVisibleError()`
- **Consumidores:** [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-slug-use-case-ts"></a>

### get-published-news-article-by-slug.use-case.ts

- **Ruta:** [get-published-news-article-by-slug.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/get-published-news-article-by-slug.use-case.ts) (`comercial-jhoel-api/src/modules/news/application/use-cases/get-published-news-article-by-slug.use-case.ts`, 33 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Backs la URL pública real `/noticias/:slug` — mismo criterio de "no revela existencia" que la versión por id: 404 tanto si no existe como si está inactiva.
- **Depende de (archivos del proyecto):** [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-article-not-visible.error.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-visible-error-ts), [catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts), [news-article-output.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-dtos-news-article-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts)

#### Clase `GetPublishedNewsArticleBySlugUseCase` (L10–32)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs la URL pública real `/noticias/:slug` — mismo criterio de "no revela existencia" que la versión por id: 404 tanto si no existe como si está inactiva.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_ARTICLE_REPOSITORY) newsArticleRepository: NewsArticleRepository`, `@Inject(CATALOG_LIKE_REPOSITORY) catalogLikeRepository: CatalogLikeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–31 | `slug: string`, `visitorId?: string` | `Promise<PublicNewsArticleOutput>` |

##### `GetPublishedNewsArticleBySlugUseCase.execute`

- **Firma:** `execute(slug: string, visitorId?: string): Promise<PublicNewsArticleOutput>` — [get-published-news-article-by-slug.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/get-published-news-article-by-slug.use-case.ts#L19) (L19–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsArticleRepository.findPublishedBySlug`, `new NewsArticleNotVisibleError`, `Promise.all`, `this.catalogLikeRepository.getCount`, `this.catalogLikeRepository.getLikedEntityIds`, `Promise.resolve`, `new Set`, `toPublicNewsArticleOutput`, `likedIds.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsArticleNotVisibleError()`
- **Consumidores:** [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-use-cases-like-news-article-use-case-ts"></a>

### like-news-article.use-case.ts

- **Ruta:** [like-news-article.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/like-news-article.use-case.ts) (`comercial-jhoel-api/src/modules/news/application/use-cases/like-news-article.use-case.ts`, 46 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** "Me gusta" público — solo sobre noticias activas.
- **Depende de (archivos del proyecto):** [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-article-not-visible.error.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-visible-error-ts), [catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts)

#### Clase `LikeNewsArticleUseCase` (L19–45)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Me gusta" público — solo sobre noticias activas. El conteo real y el anti-duplicado por visitante viven en `catalog_likes` (ver `CatalogLikeRepository`), nunca en un contador confiado del frontend. `LIKE` exige que la noticia esté activa; `UNLIKE` no — un visitante siempre puede deshacer su propio like aunque la noticia ya no esté activa, y los likes históricos nunca se borran al desactivarla.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_ARTICLE_REPOSITORY) newsArticleRepository: NewsArticleRepository`, `@Inject(CATALOG_LIKE_REPOSITORY) catalogLikeRepository: CatalogLikeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 28–44 | `id: string`, `visitorId: string`, `action: CatalogLikeAction` | `Promise<{ likesCount: number; liked: boolean }>` |

##### `LikeNewsArticleUseCase.execute`

- **Firma:** `execute(id: string, visitorId: string, action: CatalogLikeAction): Promise<{ likesCount: number; liked: boolean }>` — [like-news-article.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/like-news-article.use-case.ts#L28) (L28–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsArticleRepository.findById`, `new NewsArticleNotVisibleError`, `this.catalogLikeRepository.like`, `this.catalogLikeRepository.unlike`, `this.catalogLikeRepository.getCount`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsArticleNotVisibleError()`
- **Consumidores:** [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-use-cases-list-news-articles-use-case-ts"></a>

### list-news-articles.use-case.ts

- **Ruta:** [list-news-articles.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/list-news-articles.use-case.ts) (`comercial-jhoel-api/src/modules/news/application/use-cases/list-news-articles.use-case.ts`, 21 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Caso de uso: declara `ListNewsArticlesUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-article-output.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-dtos-news-article-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

#### Clase `ListNewsArticlesUseCase` (L9–20)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_ARTICLE_REPOSITORY) newsArticleRepository: NewsArticleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 16–19 | `options?: ListNewsArticlesOptions` | `Promise<NewsArticleOutput[]>` |

##### `ListNewsArticlesUseCase.execute`

- **Firma:** `execute(options?: ListNewsArticlesOptions): Promise<NewsArticleOutput[]>` — [list-news-articles.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/list-news-articles.use-case.ts#L16) (L16–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsArticleRepository.findAll`, `articles.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-use-cases-list-published-news-articles-use-case-ts"></a>

### list-published-news-articles.use-case.ts

- **Ruta:** [list-published-news-articles.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/list-published-news-articles.use-case.ts) (`comercial-jhoel-api/src/modules/news/application/use-cases/list-published-news-articles.use-case.ts`, 32 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Backs Noticias en la landing — solo activas, ordenadas por sortOrder y fecha de publicación reciente.
- **Depende de (archivos del proyecto):** [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts), [news-article-output.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-dtos-news-article-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts)

#### Clase `ListPublishedNewsArticlesUseCase` (L9–31)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs Noticias en la landing — solo activas, ordenadas por sortOrder y fecha de publicación reciente.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_ARTICLE_REPOSITORY) newsArticleRepository: NewsArticleRepository`, `@Inject(CATALOG_LIKE_REPOSITORY) catalogLikeRepository: CatalogLikeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 18–30 | `visitorId?: string` | `Promise<PublicNewsArticleOutput[]>` |

##### `ListPublishedNewsArticlesUseCase.execute`

- **Firma:** `execute(visitorId?: string): Promise<PublicNewsArticleOutput[]>` — [list-published-news-articles.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/list-published-news-articles.use-case.ts#L18) (L18–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsArticleRepository.findPublished`, `articles.map`, `Promise.all`, `this.catalogLikeRepository.getCountsBatch`, `this.catalogLikeRepository.getLikedEntityIds`, `Promise.resolve`, `new Set`, `toPublicNewsArticleOutput`, `counts.get`, `likedIds.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-use-cases-remove-news-article-image-use-case-ts"></a>

### remove-news-article-image.use-case.ts

- **Ruta:** [remove-news-article-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/remove-news-article-image.use-case.ts) (`comercial-jhoel-api/src/modules/news/application/use-cases/remove-news-article-image.use-case.ts`, 21 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Caso de uso: declara `RemoveNewsArticleImageUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-article-not-found.error.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

#### Clase `RemoveNewsArticleImageUseCase` (L6–20)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_ARTICLE_REPOSITORY) newsArticleRepository: NewsArticleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 13–19 | `id: string`, `userId: string` | `Promise<void>` |

##### `RemoveNewsArticleImageUseCase.execute`

- **Firma:** `execute(id: string, userId: string): Promise<void>` — [remove-news-article-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/remove-news-article-image.use-case.ts#L13) (L13–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsArticleRepository.findById`, `new NewsArticleNotFoundError`, `this.newsArticleRepository.removeImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsArticleNotFoundError(id)`
- **Consumidores:** [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-use-cases-reorder-news-articles-use-case-ts"></a>

### reorder-news-articles.use-case.ts

- **Ruta:** [reorder-news-articles.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/reorder-news-articles.use-case.ts) (`comercial-jhoel-api/src/modules/news/application/use-cases/reorder-news-articles.use-case.ts`, 26 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Caso de uso: declara `ReorderNewsArticlesUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-article-not-found.error.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

#### Clase `ReorderNewsArticlesUseCase` (L9–25)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_ARTICLE_REPOSITORY) newsArticleRepository: NewsArticleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 16–24 | `items: ReorderNewsArticleItem[]` | `Promise<void>` |

##### `ReorderNewsArticlesUseCase.execute`

- **Firma:** `execute(items: ReorderNewsArticleItem[]): Promise<void>` — [reorder-news-articles.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/reorder-news-articles.use-case.ts#L16) (L16–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsArticleRepository.findById`, `new NewsArticleNotFoundError`, `this.newsArticleRepository.reorder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsArticleNotFoundError(item.id)`
- **Consumidores:** [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-active-use-case-ts"></a>

### set-news-article-active.use-case.ts

- **Ruta:** [set-news-article-active.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/set-news-article-active.use-case.ts) (`comercial-jhoel-api/src/modules/news/application/use-cases/set-news-article-active.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Un solo flag activo/inactivo controla visibilidad pública y gestión admin — nunca se elimina físicamente una noticia ya publicada.
- **Depende de (archivos del proyecto):** [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-article-not-found.error.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

#### Clase `SetNewsArticleActiveUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Un solo flag activo/inactivo controla visibilidad pública y gestión admin — nunca se elimina físicamente una noticia ya publicada.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_ARTICLE_REPOSITORY) newsArticleRepository: NewsArticleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string`, `isActive: boolean`, `userId: string` | `Promise<void>` |

##### `SetNewsArticleActiveUseCase.execute`

- **Firma:** `execute(id: string, isActive: boolean, userId: string): Promise<void>` — [set-news-article-active.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/set-news-article-active.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsArticleRepository.findById`, `new NewsArticleNotFoundError`, `this.newsArticleRepository.setActive`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsArticleNotFoundError(id)`
- **Consumidores:** [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-image-use-case-ts"></a>

### set-news-article-image.use-case.ts

- **Ruta:** [set-news-article-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/set-news-article-image.use-case.ts) (`comercial-jhoel-api/src/modules/news/application/use-cases/set-news-article-image.use-case.ts`, 43 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Subir = reemplazar — una sola imagen principal por noticia.
- **Depende de (archivos del proyecto):** [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-article-not-found.error.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-found-error-ts), [assert-valid-news-article-image.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-utils-assert-valid-news-article-image-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

**Interfaces, tipos y enums:**

- `interface SetNewsArticleImageInput` (L10): sin documentación — miembros: `newsArticleId`, `image`, `userId`

#### Clase `SetNewsArticleImageUseCase` (L17–42)

- **Decoradores:** `@Injectable()`
- **Propósito:** Subir = reemplazar — una sola imagen principal por noticia.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_ARTICLE_REPOSITORY) newsArticleRepository: NewsArticleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 24–41 | `input: SetNewsArticleImageInput` | `Promise<void>` |

##### `SetNewsArticleImageUseCase.execute`

- **Firma:** `execute(input: SetNewsArticleImageInput): Promise<void>` — [set-news-article-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/set-news-article-image.use-case.ts#L24) (L24–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidNewsArticleImage`, `this.newsArticleRepository.findById`, `new NewsArticleNotFoundError`, `this.newsArticleRepository.setImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsArticleNotFoundError(input.newsArticleId)`
- **Consumidores:** [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-use-cases-update-news-article-use-case-ts"></a>

### update-news-article.use-case.ts

- **Ruta:** [update-news-article.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/update-news-article.use-case.ts) (`comercial-jhoel-api/src/modules/news/application/use-cases/update-news-article.use-case.ts`, 55 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Editar — incluido cambiar la clasificación — NUNCA dispara notificaciones (punto 11/28 del pedido).
- **Depende de (archivos del proyecto):** [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [invalid-news-type.error.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-errors-invalid-news-type-error-ts), [news-article-not-found.error.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-found-error-ts), [news-article-output.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-dtos-news-article-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateNewsArticleInput` (L10): sin documentación — miembros: `title`, `description`, `publishedAt`, `newsTypeId`, `userId`

#### Clase `UpdateNewsArticleUseCase` (L23–54)

- **Decoradores:** `@Injectable()`
- **Propósito:** Editar — incluido cambiar la clasificación — NUNCA dispara notificaciones (punto 11/28 del pedido). El slug tampoco se toca aquí: es estable desde que se creó la noticia.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_ARTICLE_REPOSITORY) newsArticleRepository: NewsArticleRepository`, `@Inject(NEWS_TYPE_REPOSITORY) newsTypeRepository: NewsTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 32–53 | `id: string`, `input: UpdateNewsArticleInput` | `Promise<NewsArticleOutput>` |

##### `UpdateNewsArticleUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateNewsArticleInput): Promise<NewsArticleOutput>` — [update-news-article.use-case.ts](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/update-news-article.use-case.ts#L32) (L32–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsArticleRepository.findById`, `new NewsArticleNotFoundError`, `this.newsTypeRepository.findById`, `new InvalidNewsTypeError`, `this.newsArticleRepository.update`, `input.title?.trim`, `input.description?.trim`, `toNewsArticleOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.newsArticleRepository.update`
- **Errores que lanza:** `new NewsArticleNotFoundError(id)`, `new InvalidNewsTypeError()`
- **Consumidores:** [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-utils-assert-valid-news-article-image-ts"></a>

### assert-valid-news-article-image.ts

- **Ruta:** [assert-valid-news-article-image.ts](../../../../comercial-jhoel-api/src/modules/news/application/utils/assert-valid-news-article-image.ts) (`comercial-jhoel-api/src/modules/news/application/utils/assert-valid-news-article-image.ts`, 25 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Utilidad: declara `assertValidNewsArticleImage`, `UploadedNewsArticleImage`, `MAX_NEWS_ARTICLE_IMAGE_SIZE_BYTES`, `ALLOWED_MIME_TYPES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [invalid-news-article-image.error.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-errors-invalid-news-article-image-error-ts)
- **Consumidores:** [set-news-article-image.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-image-use-case-ts)

**Interfaces, tipos y enums:**

- `interface UploadedNewsArticleImage` (L8): sin documentación — miembros: `buffer`, `mimetype`, `size`

**Constantes exportadas:**

- `MAX_NEWS_ARTICLE_IMAGE_SIZE_BYTES` (L4): Mismo techo que el resto de imágenes del proyecto (Teléfonos, Librería/Variedades, DPI). = `5 * 1024 * 1024`
#### Función `assertValidNewsArticleImage` (L14–24)

- **Tipo:** función exportada
- **Firma:** `assertValidNewsArticleImage(file: UploadedNewsArticleImage): void` — [assert-valid-news-article-image.ts](../../../../comercial-jhoel-api/src/modules/news/application/utils/assert-valid-news-article-image.ts#L14)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new InvalidNewsArticleImageError`, `ALLOWED_MIME_TYPES.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidNewsArticleImageError('La imagen está vacía.')`, `new InvalidNewsArticleImageError('La imagen debe ser JPG, PNG o WEBP.')`, `new InvalidNewsArticleImageError('La imagen no puede superar los 5 MB.')`
- **Consumidores:** [set-news-article-image.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-image-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-news-application-utils-generate-news-article-slug-ts"></a>

### generate-news-article-slug.ts

- **Ruta:** [generate-news-article-slug.ts](../../../../comercial-jhoel-api/src/modules/news/application/utils/generate-news-article-slug.ts) (`comercial-jhoel-api/src/modules/news/application/utils/generate-news-article-slug.ts`, 33 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Copia local del slugify de `modules/news-types` — mismo criterio de "pequeña copia por módulo" ya establecido en este proyecto.
- **Consumidores:** [create-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts)
#### Función `slugify` (L4–12)

- **Tipo:** función local del archivo
- **Firma:** `slugify(text: string): string` — [generate-news-article-slug.ts](../../../../comercial-jhoel-api/src/modules/news/application/utils/generate-news-article-slug.ts#L4)
- **Propósito / descripción:** Copia local del slugify de `modules/news-types` — mismo criterio de "pequeña copia por módulo" ya establecido en este proyecto.
- **Dependencias:** `text.normalize('NFD').replace(COMBINING_DIACRITICAL_MARKS, '').toLowerCase().trim`, `text.normalize('NFD').replace(COMBINING_DIACRITICAL_MARKS, '').toLowerCase`, `text.normalize('NFD').replace`, `text.normalize`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `generateNewsArticleSlug` (L20–32)

- **Tipo:** función exportada, async
- **Firma:** `generateNewsArticleSlug(title: string, slugExists: (candidate: string) => Promise<boolean>): Promise<string>` — [generate-news-article-slug.ts](../../../../comercial-jhoel-api/src/modules/news/application/utils/generate-news-article-slug.ts#L20)
- **Propósito / descripción:** Genera un slug único a partir del título — solo se llama una vez, al crear la noticia (nunca al editar: el slug es estable de por vida una vez publicado, punto 18 del pedido). `slugExists` consulta la BD para evitar colisiones, agregando `-2`/`-3`... según haga falta.
- **Dependencias:** `slugify`, `slugExists`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-news-domain-entities-news-article-entity-ts"></a>

### news-article.entity.ts

- **Ruta:** [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts) (`comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts`, 103 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Contenido editorial, no un producto — sin precio, sin categoría, sin WhatsApp, sin Krediya.
- **Consumidores:** [news-article-output.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-dtos-news-article-output-ts), [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-article.mapper.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-news-article-mapper-ts), [typeorm-news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-typeorm-news-article-repository-ts)

**Interfaces, tipos y enums:**

- `interface NewsArticleProps` (L1): sin documentación — miembros: `id`, `title`, `slug`, `description`, `publishedAt`, `newsTypeId`, `newsTypeName`, `isActive`, `sortOrder`, `likesCount`, `hasImage`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`

#### Clase `NewsArticle` (L28–102)

- **Propósito:** Contenido editorial, no un producto — sin precio, sin categoría, sin WhatsApp, sin Krediya. `description` es siempre texto plano (nunca HTML enriquecido): Angular interpola texto de forma segura por defecto, así que esta entidad es inmune a XSS por diseño, no por sanitización.
- **Dependencias inyectadas (constructor):** `props: NewsArticleProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 31–33 | `props: NewsArticleProps` | `NewsArticle` |
| `id` | getter public | 35–37 | — | `string` |
| `title` | getter public | 39–41 | — | `string` |
| `slug` | getter public | 43–45 | — | `string` |
| `description` | getter public | 47–49 | — | `string` |
| `publishedAt` | getter public | 51–53 | — | `string` |
| `newsTypeId` | getter public | 55–57 | — | `string` |
| `newsTypeName` | getter public | 59–61 | — | `string` |
| `isActive` | getter public | 63–65 | — | `boolean` |
| `sortOrder` | getter public | 67–69 | — | `number` |
| `likesCount` | getter public | 71–73 | — | `number` |
| `hasImage` | getter public | 75–77 | — | `boolean` |
| `createdAt` | getter public | 79–81 | — | `Date` |
| `updatedAt` | getter public | 83–85 | — | `Date` |
| `createdBy` | getter public | 87–89 | — | `string` |
| `createdByUsername` | getter public | 91–93 | — | `string` |
| `updatedBy` | getter public | 95–97 | — | `string \| null` |
| `updatedByUsername` | getter public | 99–101 | — | `string \| null` |

##### `NewsArticle.create`

- **Firma:** `create(props: NewsArticleProps): NewsArticle` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new NewsArticle`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [news-article.mapper.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-news-article-mapper-ts), [typeorm-news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-typeorm-news-article-repository-ts)

##### `NewsArticle.id`

- **Firma:** `id(): string` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.title`

- **Firma:** `title(): string` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.slug`

- **Firma:** `slug(): string` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.description`

- **Firma:** `description(): string` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.publishedAt`

- **Firma:** `publishedAt(): string` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.newsTypeId`

- **Firma:** `newsTypeId(): string` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.newsTypeName`

- **Firma:** `newsTypeName(): string` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.isActive`

- **Firma:** `isActive(): boolean` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.sortOrder`

- **Firma:** `sortOrder(): number` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.likesCount`

- **Firma:** `likesCount(): number` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.hasImage`

- **Firma:** `hasImage(): boolean` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.createdAt`

- **Firma:** `createdAt(): Date` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.updatedAt`

- **Firma:** `updatedAt(): Date` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.createdBy`

- **Firma:** `createdBy(): string` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L87) (L87–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.createdByUsername`

- **Firma:** `createdByUsername(): string` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L91) (L91–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsArticle.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [news-article.entity.ts](../../../../comercial-jhoel-api/src/modules/news/domain/entities/news-article.entity.ts#L99) (L99–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-news-domain-errors-invalid-news-article-image-error-ts"></a>

### invalid-news-article-image.error.ts

- **Ruta:** [invalid-news-article-image.error.ts](../../../../comercial-jhoel-api/src/modules/news/domain/errors/invalid-news-article-image.error.ts) (`comercial-jhoel-api/src/modules/news/domain/errors/invalid-news-article-image.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Errores de dominio: declara `InvalidNewsArticleImageError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [assert-valid-news-article-image.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-utils-assert-valid-news-article-image-ts)

#### Clase `InvalidNewsArticleImageError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `message: string`
<a id="f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-found-error-ts"></a>

### news-article-not-found.error.ts

- **Ruta:** [news-article-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/news/domain/errors/news-article-not-found.error.ts) (`comercial-jhoel-api/src/modules/news/domain/errors/news-article-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Errores de dominio: declara `NewsArticleNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-news-article-by-id.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-by-id-use-case-ts), [remove-news-article-image.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-remove-news-article-image-use-case-ts), [reorder-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-reorder-news-articles-use-case-ts), [set-news-article-active.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-active-use-case-ts), [set-news-article-image.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-image-use-case-ts), [update-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-update-news-article-use-case-ts)

#### Clase `NewsArticleNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-news-domain-errors-news-article-not-visible-error-ts"></a>

### news-article-not-visible.error.ts

- **Ruta:** [news-article-not-visible.error.ts](../../../../comercial-jhoel-api/src/modules/news/domain/errors/news-article-not-visible.error.ts) (`comercial-jhoel-api/src/modules/news/domain/errors/news-article-not-visible.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `news`
- **Responsabilidad:** 404 tanto si no existe como si existe pero está inactiva — nunca revela cuál, mismo criterio de Teléfonos/Librería/Variedades.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-news-article-image.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-image-use-case-ts), [get-published-news-article-by-id.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-id-use-case-ts), [get-published-news-article-by-slug.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-slug-use-case-ts), [like-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-like-news-article-use-case-ts)

#### Clase `NewsArticleNotVisibleError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** 404 tanto si no existe como si existe pero está inactiva — nunca revela cuál, mismo criterio de Teléfonos/Librería/Variedades.
<a id="f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts"></a>

### news-article.repository.ts

- **Ruta:** [news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/domain/repositories/news-article.repository.ts) (`comercial-jhoel-api/src/modules/news/domain/repositories/news-article.repository.ts`, 55 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateNewsArticleData`, `UpdateNewsArticleData`, `ListNewsArticlesOptions`, `ReorderNewsArticleItem`, `NewsArticleImageBytes` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-article.entity.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-entities-news-article-entity-ts)
- **Consumidores:** [create-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts), [get-news-article-by-id.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-by-id-use-case-ts), [get-news-article-image.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-image-use-case-ts), [get-published-news-article-by-id.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-id-use-case-ts), [get-published-news-article-by-slug.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-slug-use-case-ts), [like-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-like-news-article-use-case-ts), [list-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-news-articles-use-case-ts), [list-published-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-published-news-articles-use-case-ts), [remove-news-article-image.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-remove-news-article-image-use-case-ts), [reorder-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-reorder-news-articles-use-case-ts), [set-news-article-active.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-active-use-case-ts), [set-news-article-image.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-image-use-case-ts), [update-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-update-news-article-use-case-ts), [typeorm-news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-typeorm-news-article-repository-ts), [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateNewsArticleData` (L5): sin documentación — miembros: `title`, `slug`, `description`, `publishedAt`, `newsTypeId`, `createdBy`
- `interface UpdateNewsArticleData` (L14): sin documentación — miembros: `title`, `description`, `publishedAt`, `newsTypeId`, `updatedBy`
- `interface ListNewsArticlesOptions` (L22): sin documentación — miembros: `includeInactive`, `search`
- `interface ReorderNewsArticleItem` (L27): sin documentación — miembros: `id`, `sortOrder`
- `interface NewsArticleImageBytes` (L32): sin documentación — miembros: `data`, `mimeType`
- `interface NewsArticleRepository` (L37): sin documentación — miembros: `findAll`, `findById`, `findBySlug`, `findPublished`, `findPublishedBySlug`, `create`, `update`, `setActive`, `reorder`, `adjustLikes`, `setImage`, `removeImage`, `getImage`

**Constantes exportadas:**

- `NEWS_ARTICLE_REPOSITORY` (L3) = `Symbol('NEWS_ARTICLE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-news-article-mapper-ts"></a>

### news-article.mapper.ts

- **Ruta:** [news-article.mapper.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/news-article.mapper.ts) (`comercial-jhoel-api/src/modules/news/infrastructure/persistence/news-article.mapper.ts`, 27 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Mapper: declara `NewsArticleMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-article.entity.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-entities-news-article-entity-ts), [news-article.orm-entity.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-news-article-orm-entity-ts)
- **Consumidores:** [typeorm-news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-typeorm-news-article-repository-ts)

#### Clase `NewsArticleMapper` (L4–26)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–25 | `orm: NewsArticleOrmEntity` | `NewsArticle` |

##### `NewsArticleMapper.toDomain`

- **Firma:** `toDomain(orm: NewsArticleOrmEntity): NewsArticle` — [news-article.mapper.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/news-article.mapper.ts#L5) (L5–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `NewsArticle.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-typeorm-news-article-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-news-article-orm-entity-ts"></a>

### news-article.orm-entity.ts

- **Ruta:** [news-article.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/news-article.orm-entity.ts) (`comercial-jhoel-api/src/modules/news/infrastructure/persistence/news-article.orm-entity.ts`, 76 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `news`
- **Responsabilidad:** `imageData` usa `select: false` — mismo patrón ya usado en Teléfonos/Librería/Variedades: nunca viaja en un listado normal, solo `getImage()` la selecciona explícitamente.
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [news-type.orm-entity.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-news-type-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [news-article.mapper.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-news-article-mapper-ts), [typeorm-news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-typeorm-news-article-repository-ts), [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts)

#### Clase `NewsArticleOrmEntity` (L14–75)

- **Decoradores:** `@Entity('news_articles')`
- **Propósito:** `imageData` usa `select: false` — mismo patrón ya usado en Teléfonos/Librería/Variedades: nunca viaja en un listado normal, solo `getImage()` la selecciona explícitamente.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column title: string`, `@Column slug: string`, `@Column description: string`, `@Column publishedAt: string`, `@Column newsTypeId: string`, `@ManyToOne newsType: NewsTypeOrmEntity`, `@Column isActive: boolean`, `@Column sortOrder: number`, `@Column likesCount: number`, `@Column imageData: Buffer \| null`, `@Column imageMimeType: string \| null`, `@Column imageSizeBytes: number \| null`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-typeorm-news-article-repository-ts"></a>

### typeorm-news-article.repository.ts

- **Ruta:** [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts) (`comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts`, 170 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmNewsArticleRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-article.entity.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-entities-news-article-entity-ts), [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [news-article.orm-entity.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-news-article-orm-entity-ts), [news-article.mapper.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-news-article-mapper-ts), [apply-search-terms.util.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-apply-search-terms-util-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts)

#### Clase `TypeOrmNewsArticleRepository` (L17–169)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements NewsArticleRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(NewsArticleOrmEntity) repository: Repository<NewsArticleOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `baseQuery` | método private | 24–30 | — | `SelectQueryBuilder<NewsArticleOrmEntity>` |
| `findAll` | método public async | 32–47 | `options?: ListNewsArticlesOptions` | `Promise<NewsArticle[]>` |
| `findById` | método public async | 49–52 | `id: string` | `Promise<NewsArticle \| null>` |
| `findBySlug` | método public async | 54–57 | `slug: string` | `Promise<NewsArticle \| null>` |
| `findPublished` | método public async | 59–66 | — | `Promise<NewsArticle[]>` |
| `findPublishedBySlug` | método public async | 68–74 | `slug: string` | `Promise<NewsArticle \| null>` |
| `create` | método public async | 76–89 | `data: CreateNewsArticleData` | `Promise<NewsArticle>` |
| `update` | método public async | 91–109 | `id: string`, `data: UpdateNewsArticleData` | `Promise<NewsArticle>` |
| `setActive` | método public async | 111–113 | `id: string`, `isActive: boolean`, `updatedBy: string` | `Promise<void>` |
| `reorder` | método public async | 115–123 | `items: ReorderNewsArticleItem[]` | `Promise<void>` |
| `adjustLikes` | método public async | 125–133 | `id: string`, `delta: number` | `Promise<number>` |
| `setImage` | método public async | 135–149 | `id: string`, `image: { data: Buffer; mimeType: string; sizeBytes: number }`, `updatedBy: string` | `Promise<void>` |
| `removeImage` | método public async | 151–156 | `id: string`, `updatedBy: string` | `Promise<void>` |
| `getImage` | método public async | 158–168 | `id: string` | `Promise<NewsArticleImageBytes \| null>` |

##### `TypeOrmNewsArticleRepository.baseQuery`

- **Firma:** `baseQuery(): SelectQueryBuilder<NewsArticleOrmEntity>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L24) (L24–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('n').leftJoinAndSelect`, `this.repository.createQueryBuilder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmNewsArticleRepository.findAll`

- **Firma:** `findAll(options?: ListNewsArticlesOptions): Promise<NewsArticle[]>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L32) (L32–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery`, `query.andWhere`, `applySearchTerms`, `query.orderBy('n.sortOrder', 'ASC').addOrderBy`, `query.orderBy`, `query.getMany`, `orms.map`, `NewsArticleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsArticleRepository.findById`

- **Firma:** `findById(id: string): Promise<NewsArticle \| null>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L49) (L49–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('n.id = :id', { id }).getOne`, `this.baseQuery().andWhere`, `this.baseQuery`, `NewsArticleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmNewsArticleRepository.findBySlug`

- **Firma:** `findBySlug(slug: string): Promise<NewsArticle \| null>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L54) (L54–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('n.slug = :slug', { slug }).getOne`, `this.baseQuery().andWhere`, `this.baseQuery`, `NewsArticleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsArticleRepository.findPublished`

- **Firma:** `findPublished(): Promise<NewsArticle[]>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L59) (L59–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('n.isActive = true').orderBy('n.sortOrder', 'ASC').addOrderBy`, `this.baseQuery().andWhere('n.isActive = true').orderBy`, `this.baseQuery().andWhere`, `this.baseQuery`, `orms.map`, `NewsArticleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsArticleRepository.findPublishedBySlug`

- **Firma:** `findPublishedBySlug(slug: string): Promise<NewsArticle \| null>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L68) (L68–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('n.slug = :slug', { slug }).andWhere`, `this.baseQuery().andWhere`, `this.baseQuery`, `NewsArticleMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsArticleRepository.create`

- **Firma:** `create(data: CreateNewsArticleData): Promise<NewsArticle>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L76) (L76–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.findById`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsArticleRepository.update`

- **Firma:** `update(id: string, data: UpdateNewsArticleData): Promise<NewsArticle>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L91) (L91–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.findById`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsArticleRepository.setActive`

- **Firma:** `setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L111) (L111–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsArticleRepository.reorder`

- **Firma:** `reorder(items: ReorderNewsArticleItem[]): Promise<void>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L115) (L115–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.transaction`, `manager.update`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsArticleRepository.adjustLikes`

- **Firma:** `adjustLikes(id: string, delta: number): Promise<number>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L125) (L125–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`
- **Efectos secundarios:** Tablas en su SQL: `news_articles`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsArticleRepository.setImage`

- **Firma:** `setImage(id: string, image: { data: Buffer; mimeType: string; sizeBytes: number }, updatedBy: string): Promise<void>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L135) (L135–149)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsArticleRepository.removeImage`

- **Firma:** `removeImage(id: string, updatedBy: string): Promise<void>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L151) (L151–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsArticleRepository.getImage`

- **Firma:** `getImage(id: string): Promise<NewsArticleImageBytes \| null>` — [typeorm-news-article.repository.ts](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts#L158) (L158–168)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('n').select`, `this.repository.createQueryBuilder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-news-news-module-ts"></a>

### news.module.ts

- **Ruta:** [news.module.ts](../../../../comercial-jhoel-api/src/modules/news/news.module.ts) (`comercial-jhoel-api/src/modules/news/news.module.ts`, 51 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `news`
- **Responsabilidad:** "Noticias" — contenido editorial, completamente independiente de Inventario/Teléfonos/Librería/Variedades.
- **Depende de (archivos del proyecto):** [likes.module.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-likes-module-ts), [news-types.module.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts), [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts), [news-article.orm-entity.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-news-article-orm-entity-ts), [typeorm-news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-typeorm-news-article-repository-ts), [news-article.repository.ts](news.md#f-comercial-jhoel-api-src-modules-news-domain-repositories-news-article-repository-ts), [create-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts), [update-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-update-news-article-use-case-ts), [list-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-news-articles-use-case-ts), [get-news-article-by-id.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-by-id-use-case-ts), [set-news-article-active.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-active-use-case-ts), [reorder-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-reorder-news-articles-use-case-ts), [set-news-article-image.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-image-use-case-ts), [remove-news-article-image.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-remove-news-article-image-use-case-ts), [list-published-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-published-news-articles-use-case-ts) y 6 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `NewsModule` (L30–50)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([NewsArticleOrmEntity]), LikesModule, NewsTypesModule, NewsSubscriptionsModule], controllers: [NewsController, Publi`
- **Propósito:** "Noticias" — contenido editorial, completamente independiente de Inventario/Teléfonos/Librería/Variedades. Sin producto, sin precio, sin WhatsApp, sin Krediya. `description` es siempre texto plano.
<a id="f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts"></a>

### news.controller.ts

- **Ruta:** [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts) (`comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts`, 149 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Admin-only end to end — "Sistema → Noticias".
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts), [update-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-update-news-article-use-case-ts), [list-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-news-articles-use-case-ts), [get-news-article-by-id.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-by-id-use-case-ts), [set-news-article-active.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-active-use-case-ts), [reorder-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-reorder-news-articles-use-case-ts), [set-news-article-image.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-set-news-article-image-use-case-ts), [remove-news-article-image.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-remove-news-article-image-use-case-ts), [create-news-article.request.dto.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-dtos-create-news-article-request-dto-ts), [update-news-article.request.dto.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-dtos-update-news-article-request-dto-ts), [list-news-articles.query.dto.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-dtos-list-news-articles-query-dto-ts) y 2 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/platform-express`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts)

**Interfaces, tipos y enums:**

- `interface UploadedImageFile` (L36): sin documentación — miembros: `buffer`, `mimetype`, `size`

#### Clase `NewsController` (L43–148)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('news')`
- **Propósito:** Admin-only end to end — "Sistema → Noticias".
- **Dependencias inyectadas (constructor):** `createNewsArticleUseCase: CreateNewsArticleUseCase`, `updateNewsArticleUseCase: UpdateNewsArticleUseCase`, `listNewsArticlesUseCase: ListNewsArticlesUseCase`, `getNewsArticleByIdUseCase: GetNewsArticleByIdUseCase`, `setNewsArticleActiveUseCase: SetNewsArticleActiveUseCase`, `reorderNewsArticlesUseCase: ReorderNewsArticlesUseCase`, `setNewsArticleImageUseCase: SetNewsArticleImageUseCase`, `removeNewsArticleImageUseCase: RemoveNewsArticleImageUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 58–71 | `dto: CreateNewsArticleRequestDto`, `userId: string` | `Promise<NewsArticleResponseDto>` |
| `findAll` | método public | 73–79 | `query: ListNewsArticlesQueryDto` | `Promise<NewsArticleResponseDto[]>` |
| `findOne` | método public | 81–84 | `id: string` | `Promise<NewsArticleResponseDto>` |
| `update` | método public | 86–99 | `id: string`, `dto: UpdateNewsArticleRequestDto`, `userId: string` | `Promise<NewsArticleResponseDto>` |
| `activate` | método public | 101–108 | `id: string`, `userId: string` | `Promise<void>` |
| `deactivate` | método public | 110–117 | `id: string`, `userId: string` | `Promise<void>` |
| `reorder` | método public | 119–123 | `dto: ReorderNewsArticlesRequestDto` | `Promise<void>` |
| `setImage` | método public | 125–138 | `newsArticleId: string`, `image: UploadedImageFile`, `userId: string` | `Promise<void>` |
| `removeImage` | método public | 140–147 | `id: string`, `userId: string` | `Promise<void>` |

##### `NewsController.create`

- **Firma:** `create(dto: CreateNewsArticleRequestDto, userId: string): Promise<NewsArticleResponseDto>` — [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L58) (L58–71)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createNewsArticleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsController.findAll`

- **Firma:** `findAll(query: ListNewsArticlesQueryDto): Promise<NewsArticleResponseDto[]>` — [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L73) (L73–79)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listNewsArticlesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsController.findOne`

- **Firma:** `findOne(id: string): Promise<NewsArticleResponseDto>` — [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L81) (L81–84)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getNewsArticleByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsController.update`

- **Firma:** `update(id: string, dto: UpdateNewsArticleRequestDto, userId: string): Promise<NewsArticleResponseDto>` — [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L86) (L86–99)
- **Decoradores:** `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateNewsArticleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsController.activate`

- **Firma:** `activate(id: string, userId: string): Promise<void>` — [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L101) (L101–108)
- **Decoradores:** `@Post(':id/activate')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setNewsArticleActiveUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsController.deactivate`

- **Firma:** `deactivate(id: string, userId: string): Promise<void>` — [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L110) (L110–117)
- **Decoradores:** `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setNewsArticleActiveUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsController.reorder`

- **Firma:** `reorder(dto: ReorderNewsArticlesRequestDto): Promise<void>` — [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L119) (L119–123)
- **Decoradores:** `@Post('reorder')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.reorderNewsArticlesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsController.setImage`

- **Firma:** `setImage(newsArticleId: string, image: UploadedImageFile, userId: string): Promise<void>` — [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L125) (L125–138)
- **Decoradores:** `@Post(':id/image')` `@UseInterceptors(FileInterceptor('image'))` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) newsArticleId`, `@UploadedFile() image`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setNewsArticleImageUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsController.removeImage`

- **Firma:** `removeImage(id: string, userId: string): Promise<void>` — [news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts#L140) (L140–147)
- **Decoradores:** `@Delete(':id/image')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.removeNewsArticleImageUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts"></a>

### public-news.controller.ts

- **Ruta:** [public-news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts) (`comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts`, 97 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Público, sin guard — backs "Noticias" en la landing.
- **Depende de (archivos del proyecto):** [list-published-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-published-news-articles-use-case-ts), [get-published-news-article-by-id.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-id-use-case-ts), [get-published-news-article-by-slug.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-slug-use-case-ts), [get-news-article-image.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-news-article-image-use-case-ts), [like-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-like-news-article-use-case-ts), [public-news-article.response.dto.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-dtos-public-news-article-response-dto-ts), [parse-visitor-id.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-application-utils-parse-visitor-id-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/throttler`, `express`
- **Consumidores:** [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts)

#### Clase `PublicNewsController` (L27–96)

- **Decoradores:** `@Controller('public-news')`
- **Propósito:** Público, sin guard — backs "Noticias" en la landing. Mismo header `Cross-Origin-Resource-Policy` que Teléfonos/Librería/Variedades para que `&lt;img&gt;` cargue entre orígenes.
- **Dependencias inyectadas (constructor):** `listPublishedNewsArticlesUseCase: ListPublishedNewsArticlesUseCase`, `getPublishedNewsArticleByIdUseCase: GetPublishedNewsArticleByIdUseCase`, `getPublishedNewsArticleBySlugUseCase: GetPublishedNewsArticleBySlugUseCase`, `getNewsArticleImageUseCase: GetNewsArticleImageUseCase`, `likeNewsArticleUseCase: LikeNewsArticleUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 37–42 | `visitorIdHeader?: string` | `Promise<PublicNewsArticleResponseDto[]>` |
| `findOneBySlug` | método public | 44–50 | `slug: string`, `visitorIdHeader?: string` | `Promise<PublicNewsArticleResponseDto>` |
| `findOne` | método public | 52–58 | `id: string`, `visitorIdHeader?: string` | `Promise<PublicNewsArticleResponseDto>` |
| `getImage` | método public async | 60–73 | `id: string`, `res: Response` | `Promise<void>` |
| `like` | método public | 75–84 | `id: string`, `visitorIdHeader?: string` | `Promise<{ likesCount: number; liked: boolean }>` |
| `unlike` | método public | 86–95 | `id: string`, `visitorIdHeader?: string` | `Promise<{ likesCount: number; liked: boolean }>` |

##### `PublicNewsController.findAll`

- **Firma:** `findAll(visitorIdHeader?: string): Promise<PublicNewsArticleResponseDto[]>` — [public-news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts#L37) (L37–42)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Headers('x-visitor-id') visitorIdHeader`
- **Dependencias (llamadas en su cuerpo):** `this.listPublishedNewsArticlesUseCase.execute`, `parseOptionalVisitorId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsController.findOneBySlug`

- **Firma:** `findOneBySlug(slug: string, visitorIdHeader?: string): Promise<PublicNewsArticleResponseDto>` — [public-news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts#L44) (L44–50)
- **Decoradores:** `@Get('by-slug/:slug')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('slug') slug`, `@Headers('x-visitor-id') visitorIdHeader`
- **Dependencias (llamadas en su cuerpo):** `this.getPublishedNewsArticleBySlugUseCase.execute`, `parseOptionalVisitorId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsController.findOne`

- **Firma:** `findOne(id: string, visitorIdHeader?: string): Promise<PublicNewsArticleResponseDto>` — [public-news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts#L52) (L52–58)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Headers('x-visitor-id') visitorIdHeader`
- **Dependencias (llamadas en su cuerpo):** `this.getPublishedNewsArticleByIdUseCase.execute`, `parseOptionalVisitorId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsController.getImage`

- **Firma:** `getImage(id: string, res: Response): Promise<void>` — [public-news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts#L60) (L60–73)
- **Decoradores:** `@Get('images/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.getNewsArticleImageUseCase.execute`, `res.set`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsController.like`

- **Firma:** `like(id: string, visitorIdHeader?: string): Promise<{ likesCount: number; liked: boolean }>` — [public-news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts#L75) (L75–84)
- **Decoradores:** `@Post(':id/like')` `@HttpCode(HttpStatus.OK)` `@UseGuards(ThrottlerGuard)` `@Throttle({ default: { limit: 30, ttl: 60_000 } })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Headers('x-visitor-id') visitorIdHeader`
- **Dependencias (llamadas en su cuerpo):** `this.likeNewsArticleUseCase.execute`, `parseRequiredVisitorId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsController.unlike`

- **Firma:** `unlike(id: string, visitorIdHeader?: string): Promise<{ likesCount: number; liked: boolean }>` — [public-news.controller.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/public-news.controller.ts#L86) (L86–95)
- **Decoradores:** `@Post(':id/unlike')` `@HttpCode(HttpStatus.OK)` `@UseGuards(ThrottlerGuard)` `@Throttle({ default: { limit: 30, ttl: 60_000 } })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Headers('x-visitor-id') visitorIdHeader`
- **Dependencias (llamadas en su cuerpo):** `this.likeNewsArticleUseCase.execute`, `parseRequiredVisitorId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-news-presentation-dtos-create-news-article-request-dto-ts"></a>

### create-news-article.request.dto.ts

- **Ruta:** [create-news-article.request.dto.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/dtos/create-news-article.request.dto.ts) (`comercial-jhoel-api/src/modules/news/presentation/dtos/create-news-article.request.dto.ts`, 19 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** DTO de entrada: declara `CreateNewsArticleRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

#### Clase `CreateNewsArticleRequestDto` (L3–18)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-news-presentation-dtos-list-news-articles-query-dto-ts"></a>

### list-news-articles.query.dto.ts

- **Ruta:** [list-news-articles.query.dto.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/dtos/list-news-articles.query.dto.ts) (`comercial-jhoel-api/src/modules/news/presentation/dtos/list-news-articles.query.dto.ts`, 15 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** DTO de consulta: declara `ListNewsArticlesQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

#### Clase `ListNewsArticlesQueryDto` (L4–14)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-news-presentation-dtos-news-article-response-dto-ts"></a>

### news-article.response.dto.ts

- **Ruta:** [news-article.response.dto.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/dtos/news-article.response.dto.ts) (`comercial-jhoel-api/src/modules/news/presentation/dtos/news-article.response.dto.ts`, 20 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** DTO de respuesta: declara `NewsArticleResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

#### Clase `NewsArticleResponseDto` (L1–19)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-news-presentation-dtos-public-news-article-response-dto-ts"></a>

### public-news-article.response.dto.ts

- **Ruta:** [public-news-article.response.dto.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/dtos/public-news-article.response.dto.ts) (`comercial-jhoel-api/src/modules/news/presentation/dtos/public-news-article.response.dto.ts`, 13 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** Backs Noticias en la landing — sin isActive/audit, solo lo que un visitante puede ver.
- **Consumidores:** [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts)

#### Clase `PublicNewsArticleResponseDto` (L2–12)

- **Propósito:** Backs Noticias en la landing — sin isActive/audit, solo lo que un visitante puede ver.
<a id="f-comercial-jhoel-api-src-modules-news-presentation-dtos-reorder-news-articles-request-dto-ts"></a>

### reorder-news-articles.request.dto.ts

- **Ruta:** [reorder-news-articles.request.dto.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/dtos/reorder-news-articles.request.dto.ts) (`comercial-jhoel-api/src/modules/news/presentation/dtos/reorder-news-articles.request.dto.ts`, 19 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** DTO de entrada: declara `ReorderNewsArticleItemDto`, `ReorderNewsArticlesRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

#### Clase `ReorderNewsArticleItemDto` (L4–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ReorderNewsArticlesRequestDto` (L12–18)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-news-presentation-dtos-update-news-article-request-dto-ts"></a>

### update-news-article.request.dto.ts

- **Ruta:** [update-news-article.request.dto.ts](../../../../comercial-jhoel-api/src/modules/news/presentation/dtos/update-news-article.request.dto.ts) (`comercial-jhoel-api/src/modules/news/presentation/dtos/update-news-article.request.dto.ts`, 23 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `news`
- **Responsabilidad:** DTO de entrada: declara `UpdateNewsArticleRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-news-controller-ts)

#### Clase `UpdateNewsArticleRequestDto` (L3–22)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
