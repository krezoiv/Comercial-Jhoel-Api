# Módulo backend `likes`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [parse-visitor-id.ts](#f-comercial-jhoel-api-src-modules-likes-application-utils-parse-visitor-id-ts) | .ts | Utilidad | Aplicación | Like/unlike: el header es obligatorio y debe ser un UUID válido — 400 si falta o está mal formado. | 1 internas; ext.: class-validator | 3 | Media (3 consumidores) |
| [invalid-visitor-id.error.ts](#f-comercial-jhoel-api-src-modules-likes-domain-errors-invalid-visitor-id-error-ts) | .ts | Errores de dominio | Dominio | Falta el header `X-Visitor-Id` o no es un UUID — requerido en like/unlike, nunca confiado sin validar. | 1 internas | 1 | Baja (1 consumidores) |
| [catalog-like.repository.ts](#f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Almacenamiento genérico y compartido de "me gusta" — reemplaza el contador ciego (`likes_count` + delta confiado del frontend) por una tabla real de quién le dio like a qué, con anti-duplicado a nivel de BD (PK compuesta `(entity_type, entity_id, visitor_id)`). | 0 internas | 12 | Alta (12 consumidores) |
| [catalog-like.orm-entity.ts](#f-comercial-jhoel-api-src-modules-likes-infrastructure-persistence-catalog-like-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `CatalogLikeOrmEntity` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [typeorm-catalog-like.repository.ts](#f-comercial-jhoel-api-src-modules-likes-infrastructure-persistence-typeorm-catalog-like-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmCatalogLikeRepository` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [likes.module.ts](#f-comercial-jhoel-api-src-modules-likes-likes-module-ts) | .ts | Módulo | Arranque / configuración | Almacenamiento genérico de "me gusta", compartido por `catalog` (teléfonos), `product-catalog` (Librería/Variedades) y `news` — ver el doc comment de `CatalogLikeRepository`. | 3 internas; ext.: @nestjs/common, @nestjs/typeorm | 3 | Media (3 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-likes-application-utils-parse-visitor-id-ts"></a>

### parse-visitor-id.ts

- **Ruta:** [parse-visitor-id.ts](../../../../comercial-jhoel-api/src/modules/likes/application/utils/parse-visitor-id.ts) (`comercial-jhoel-api/src/modules/likes/application/utils/parse-visitor-id.ts`, 16 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `likes`
- **Responsabilidad:** Like/unlike: el header es obligatorio y debe ser un UUID válido — 400 si falta o está mal formado.
- **Depende de (archivos del proyecto):** [invalid-visitor-id.error.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-domain-errors-invalid-visitor-id-error-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts), [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts), [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts)
#### Función `parseRequiredVisitorId` (L5–10)

- **Tipo:** función exportada
- **Firma:** `parseRequiredVisitorId(header: string \| undefined): string` — [parse-visitor-id.ts](../../../../comercial-jhoel-api/src/modules/likes/application/utils/parse-visitor-id.ts#L5)
- **Propósito / descripción:** Like/unlike: el header es obligatorio y debe ser un UUID válido — 400 si falta o está mal formado.
- **Dependencias:** `isUUID`, `new InvalidVisitorIdError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidVisitorIdError()`
- **Consumidores:** [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts), [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts), [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts)

#### Función `parseOptionalVisitorId` (L13–15)

- **Tipo:** función exportada
- **Firma:** `parseOptionalVisitorId(header: string \| undefined): string \| undefined` — [parse-visitor-id.ts](../../../../comercial-jhoel-api/src/modules/likes/application/utils/parse-visitor-id.ts#L13)
- **Propósito / descripción:** Listados/detalle: el header es opcional — un header ausente o mal formado se trata como "primera visita" (nunca rompe la lectura), nunca lanza.
- **Dependencias:** `isUUID`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [public-catalog.controller.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-presentation-controllers-public-catalog-controller-ts), [public-news.controller.ts](news.md#f-comercial-jhoel-api-src-modules-news-presentation-controllers-public-news-controller-ts), [public-product-catalog.controller.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-presentation-controllers-public-product-catalog-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-likes-domain-errors-invalid-visitor-id-error-ts"></a>

### invalid-visitor-id.error.ts

- **Ruta:** [invalid-visitor-id.error.ts](../../../../comercial-jhoel-api/src/modules/likes/domain/errors/invalid-visitor-id.error.ts) (`comercial-jhoel-api/src/modules/likes/domain/errors/invalid-visitor-id.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `likes`
- **Responsabilidad:** Falta el header `X-Visitor-Id` o no es un UUID — requerido en like/unlike, nunca confiado sin validar.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [parse-visitor-id.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-application-utils-parse-visitor-id-ts)

#### Clase `InvalidVisitorIdError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Falta el header `X-Visitor-Id` o no es un UUID — requerido en like/unlike, nunca confiado sin validar.
<a id="f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts"></a>

### catalog-like.repository.ts

- **Ruta:** [catalog-like.repository.ts](../../../../comercial-jhoel-api/src/modules/likes/domain/repositories/catalog-like.repository.ts) (`comercial-jhoel-api/src/modules/likes/domain/repositories/catalog-like.repository.ts`, 34 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `likes`
- **Responsabilidad:** Almacenamiento genérico y compartido de "me gusta" — reemplaza el contador ciego (`likes_count` + delta confiado del frontend) por una tabla real de quién le dio like a qué, con anti-duplicado a nivel de BD (PK compuesta `(entity_type, entity_id, visitor_id)`).
- **Consumidores:** [get-published-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-published-catalog-phone-by-id-use-case-ts), [like-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-like-catalog-phone-use-case-ts), [list-published-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-published-catalog-phones-use-case-ts), [typeorm-catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-infrastructure-persistence-typeorm-catalog-like-repository-ts), [likes.module.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-likes-module-ts), [get-published-news-article-by-id.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-id-use-case-ts), [get-published-news-article-by-slug.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-get-published-news-article-by-slug-use-case-ts), [like-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-like-news-article-use-case-ts), [list-published-news-articles.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-list-published-news-articles-use-case-ts), [get-published-catalog-product-by-id.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-get-published-catalog-product-by-id-use-case-ts), [like-catalog-product.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-like-catalog-product-use-case-ts), [list-published-catalog-products.use-case.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-application-use-cases-list-published-catalog-products-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CatalogLikeRepository` (L19): Almacenamiento genérico y compartido de "me gusta" — reemplaza el contador ciego (`likes_count` + delta confiado del frontend) por una tabla real de quién le dio like a qué, con anti-duplicado a nivel de BD (PK compuesta `(entity_type, entity_id, visitor_id)`). — miembros: `like`, `unlike`, `getCount`, `getCountsBatch`, `getLikedEntityIds`
- `type CatalogLikeEntityType` (L4) = `'PHONE' \| 'PRODUCT' \| 'NEWS'` — Un valor por cada tabla pública con Like — mismo valor que `catalog_likes.entity_type`.
- `type CatalogLikeAction` (L7) = `'LIKE' \| 'UNLIKE'` — El toggle que decide cada use case de like/unlike por módulo.

**Constantes exportadas:**

- `CATALOG_LIKE_REPOSITORY` (L1) = `Symbol('CATALOG_LIKE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-likes-infrastructure-persistence-catalog-like-orm-entity-ts"></a>

### catalog-like.orm-entity.ts

- **Ruta:** [catalog-like.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/likes/infrastructure/persistence/catalog-like.orm-entity.ts) (`comercial-jhoel-api/src/modules/likes/infrastructure/persistence/catalog-like.orm-entity.ts`, 17 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `likes`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `CatalogLikeOrmEntity` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** [typeorm-catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-infrastructure-persistence-typeorm-catalog-like-repository-ts), [likes.module.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-likes-module-ts)

#### Clase `CatalogLikeOrmEntity` (L3–16)

- **Decoradores:** `@Entity('catalog_likes')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@CreateDateColumn createdAt: Date`
<a id="f-comercial-jhoel-api-src-modules-likes-infrastructure-persistence-typeorm-catalog-like-repository-ts"></a>

### typeorm-catalog-like.repository.ts

- **Ruta:** [typeorm-catalog-like.repository.ts](../../../../comercial-jhoel-api/src/modules/likes/infrastructure/persistence/typeorm-catalog-like.repository.ts) (`comercial-jhoel-api/src/modules/likes/infrastructure/persistence/typeorm-catalog-like.repository.ts`, 75 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `likes`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmCatalogLikeRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts), [catalog-like.orm-entity.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-infrastructure-persistence-catalog-like-orm-entity-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [likes.module.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-likes-module-ts)

#### Clase `TypeOrmCatalogLikeRepository` (L10–74)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements CatalogLikeRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(CatalogLikeOrmEntity) repository: Repository<CatalogLikeOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `like` | método public async | 17–28 | `entityType: CatalogLikeEntityType`, `entityId: string`, `visitorId: string` | `Promise<void>` |
| `unlike` | método public async | 30–36 | `entityType: CatalogLikeEntityType`, `entityId: string`, `visitorId: string` | `Promise<void>` |
| `getCount` | método public async | 38–40 | `entityType: CatalogLikeEntityType`, `entityId: string` | `Promise<number>` |
| `getCountsBatch` | método public async | 42–58 | `entityType: CatalogLikeEntityType`, `entityIds: string[]` | `Promise<Map<string, number>>` |
| `getLikedEntityIds` | método public async | 60–73 | `entityType: CatalogLikeEntityType`, `visitorId: string`, `entityIds: string[]` | `Promise<Set<string>>` |

##### `TypeOrmCatalogLikeRepository.like`

- **Firma:** `like(entityType: CatalogLikeEntityType, entityId: string, visitorId: string): Promise<void>` — [typeorm-catalog-like.repository.ts](../../../../comercial-jhoel-api/src/modules/likes/infrastructure/persistence/typeorm-catalog-like.repository.ts#L17) (L17–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder().insert().values`, `this.repository.createQueryBuilder().insert`, `this.repository.createQueryBuilder`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogLikeRepository.unlike`

- **Firma:** `unlike(entityType: CatalogLikeEntityType, entityId: string, visitorId: string): Promise<void>` — [typeorm-catalog-like.repository.ts](../../../../comercial-jhoel-api/src/modules/likes/infrastructure/persistence/typeorm-catalog-like.repository.ts#L30) (L30–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.delete`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogLikeRepository.getCount`

- **Firma:** `getCount(entityType: CatalogLikeEntityType, entityId: string): Promise<number>` — [typeorm-catalog-like.repository.ts](../../../../comercial-jhoel-api/src/modules/likes/infrastructure/persistence/typeorm-catalog-like.repository.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.count`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogLikeRepository.getCountsBatch`

- **Firma:** `getCountsBatch(entityType: CatalogLikeEntityType, entityIds: string[]): Promise<Map<string, number>>` — [typeorm-catalog-like.repository.ts](../../../../comercial-jhoel-api/src/modules/likes/infrastructure/persistence/typeorm-catalog-like.repository.ts#L42) (L42–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Map`, `this.repository.manager.query`, `counts.set`, `Number`
- **Efectos secundarios:** Tablas en su SQL: `catalog_likes`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogLikeRepository.getLikedEntityIds`

- **Firma:** `getLikedEntityIds(entityType: CatalogLikeEntityType, visitorId: string, entityIds: string[]): Promise<Set<string>>` — [typeorm-catalog-like.repository.ts](../../../../comercial-jhoel-api/src/modules/likes/infrastructure/persistence/typeorm-catalog-like.repository.ts#L60) (L60–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Set`, `this.repository.manager.query`, `rows.map`
- **Efectos secundarios:** Tablas en su SQL: `catalog_likes`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-likes-likes-module-ts"></a>

### likes.module.ts

- **Ruta:** [likes.module.ts](../../../../comercial-jhoel-api/src/modules/likes/likes.module.ts) (`comercial-jhoel-api/src/modules/likes/likes.module.ts`, 25 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `likes`
- **Responsabilidad:** Almacenamiento genérico de "me gusta", compartido por `catalog` (teléfonos), `product-catalog` (Librería/Variedades) y `news` — ver el doc comment de `CatalogLikeRepository`.
- **Depende de (archivos del proyecto):** [catalog-like.orm-entity.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-infrastructure-persistence-catalog-like-orm-entity-ts), [typeorm-catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-infrastructure-persistence-typeorm-catalog-like-repository-ts), [catalog-like.repository.ts](likes.md#f-comercial-jhoel-api-src-modules-likes-domain-repositories-catalog-like-repository-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [product-catalog.module.ts](product-catalog.md#f-comercial-jhoel-api-src-modules-product-catalog-product-catalog-module-ts)

#### Clase `LikesModule` (L14–24)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([CatalogLikeOrmEntity])], providers: [ { provide: CATALOG_LIKE_REPOSITORY, useClass: TypeOrmCatalogLikeRepository, }`
- **Propósito:** Almacenamiento genérico de "me gusta", compartido por `catalog` (teléfonos), `product-catalog` (Librería/Variedades) y `news` — ver el doc comment de `CatalogLikeRepository`. Sin controller propio: cada módulo dueño del ítem expone sus propias rutas `/like`/`/unlike` públicas, validando existencia/visibilidad antes de delegar aquí.
