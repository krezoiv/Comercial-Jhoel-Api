# Módulo backend `news-types`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/news-types` | [news-types.controller.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts#L44) `NewsTypesController.create` | [CreateNewsTypeUseCase](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-create-news-type-use-case-ts) | `NewsTypeRepository`.findByName/create/findBySlug | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsTypeService.createType` |
| `GET /api/news-types` | [news-types.controller.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts#L55) `NewsTypesController.findAll` | [ListNewsTypesUseCase](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-news-types-use-case-ts) | `NewsTypeRepository`.findAll | UseGuards(JwtAuthGuard) | `NewsTypeService.getTypes` |
| `GET /api/news-types/:id` | [news-types.controller.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts#L60) `NewsTypesController.findOne` | [GetNewsTypeByIdUseCase](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-get-news-type-by-id-use-case-ts) | `NewsTypeRepository`.findById | UseGuards(JwtAuthGuard) | `NewsTypeService.getTypeById` |
| `PATCH /api/news-types/:id` | [news-types.controller.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts#L65) `NewsTypesController.update` | [UpdateNewsTypeUseCase](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-update-news-type-use-case-ts) | `NewsTypeRepository`.findById/findByName/update | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsTypeService.updateType` |
| `DELETE /api/news-types/:id` | [news-types.controller.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts#L76) `NewsTypesController.deactivate` | [DeactivateNewsTypeUseCase](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-deactivate-news-type-use-case-ts) | `NewsTypeRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsTypeService.deactivateType` |
| `POST /api/news-types/reorder` | [news-types.controller.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts#L84) `NewsTypesController.reorder` | [ReorderNewsTypesUseCase](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-reorder-news-types-use-case-ts) | `NewsTypeRepository`.findById/reorder | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsTypeService.reorderTypes` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [news-type-output.ts](#f-comercial-jhoel-api-src-modules-news-types-application-dtos-news-type-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toNewsTypeOutput`, `toNewsTypeListOutput`, `toPublicNewsTypeOutput`, `NewsTypeOutput`, `NewsTypeListOutput` (sin comentario de documentación en el código). | 2 internas | 5 | Media (5 consumidores) |
| [create-news-type.use-case.ts](#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-create-news-type-use-case-ts) | .ts | Caso de uso | Aplicación | El frontend consulta `GET /news-types?includeInactive=true` antes de llamar aquí y ofrece "Activar" en vez de "Crear" cuando ya existe una fila inactiva con ese nombre (mismo criterio ya establecido por `CreatePresentationTypeUseCase`) — esta capa igual rechaza un duplicado inactivo en vez de reacti | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-news-type.use-case.ts](#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-deactivate-news-type-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete — nunca físico. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-news-type-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-get-news-type-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetNewsTypeByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-active-news-types.use-case.ts](#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-active-news-types-use-case-ts) | .ts | Caso de uso | Aplicación | Backs el formulario público de suscripción — solo activas, shape mínimo (sin auditoría). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-news-types.use-case.ts](#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-news-types-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListNewsTypesUseCase`, `ListNewsTypesInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [reorder-news-types.use-case.ts](#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-reorder-news-types-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ReorderNewsTypesUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-news-type.use-case.ts](#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-update-news-type-use-case-ts) | .ts | Caso de uso | Aplicación | `isActive` se puede alternar en ambos sentidos aquí (reactivación incluida) — mismo criterio que `UpdatePresentationTypeUseCase`. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [slugify.ts](#f-comercial-jhoel-api-src-modules-news-types-application-utils-slugify-ts) | .ts | Utilidad | Aplicación | Convierte un texto libre en un slug URL-safe: minúsculas, sin acentos, espacios/símbolos colapsados a un solo `-`, sin `-` al inicio/final. | 0 internas | 1 | Baja (1 consumidores) |
| [news-type.entity.ts](#f-comercial-jhoel-api-src-modules-news-types-domain-entities-news-type-entity-ts) | .ts | Entidad de dominio | Dominio | Catálogo maestro y configurable de clasificaciones de noticias (Comercial, Educativa, Promociones, ...) — extensible desde el admin sin tocar código. | 0 internas | 4 | Media (4 consumidores) |
| [invalid-news-type.error.ts](#f-comercial-jhoel-api-src-modules-news-types-domain-errors-invalid-news-type-error-ts) | .ts | Errores de dominio | Dominio | El `newsTypeId` referenciado (al crear una noticia o al suscribirse) no existe o está inactivo. | 1 internas | 5 | Media (5 consumidores) |
| [news-type-name-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-news-types-domain-errors-news-type-name-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `NewsTypeNameAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [news-type-not-found.error.ts](#f-comercial-jhoel-api-src-modules-news-types-domain-errors-news-type-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `NewsTypeNotFoundError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [news-type.repository.ts](#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `FindNewsTypesOptions`, `CreateNewsTypeData`, `UpdateNewsTypeData`, `ReorderNewsTypeItem`, `NewsTypeListItem` (sin comentario de documentación en el código). | 1 internas | 15 | Alta (15 consumidores) |
| [news-type.mapper.ts](#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-news-type-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `NewsTypeMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [news-type.orm-entity.ts](#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-news-type-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Único case-insensitive entre filas activas para `name`/`slug` — mismo escape hatch `LOWER(...) WHERE is_active` de `presentation_types`/`clients` (TypeORM no puede expresar un índice funcional vía decorador). | 1 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [typeorm-news-type.repository.ts](#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-typeorm-news-type-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmNewsTypeRepository` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [news-types.module.ts](#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts) | .ts | Módulo | Arranque / configuración | "Tipos de Noticias" — catálogo maestro configurable y extensible (nunca un enum rígido en código). | 11 internas; ext.: @nestjs/common, @nestjs/typeorm | 3 | Media (3 consumidores) |
| [news-types.controller.ts](#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts) | .ts | Controlador | Presentación | "Sistema → Tipos de Noticias" — CRUD es admin-only; cualquier rol autenticado puede leer (lo necesita el selector "Tipo de noticia" del form de Noticias). | 15 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [create-news-type.request.dto.ts](#f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-create-news-type-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateNewsTypeRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-news-types.query.dto.ts](#f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-list-news-types-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListNewsTypesQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [news-type.response.dto.ts](#f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-news-type-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `NewsTypeResponseDto`, `NewsTypeListResponseDto`, `PublicNewsTypeResponseDto` (sin comentario de documentación en el código). | 0 internas | 2 | Baja (2 consumidores) |
| [reorder-news-types.request.dto.ts](#f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-reorder-news-types-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `ReorderNewsTypeItemDto`, `ReorderNewsTypesRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [update-news-type.request.dto.ts](#f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-update-news-type-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateNewsTypeRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-news-types-application-dtos-news-type-output-ts"></a>

### news-type-output.ts

- **Ruta:** [news-type-output.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/dtos/news-type-output.ts) (`comercial-jhoel-api/src/modules/news-types/application/dtos/news-type-output.ts`, 57 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** DTO de salida (aplicación): declara `toNewsTypeOutput`, `toNewsTypeListOutput`, `toPublicNewsTypeOutput`, `NewsTypeOutput`, `NewsTypeListOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-type.entity.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-entities-news-type-entity-ts), [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts)
- **Consumidores:** [create-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-create-news-type-use-case-ts), [get-news-type-by-id.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-get-news-type-by-id-use-case-ts), [list-active-news-types.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-active-news-types-use-case-ts), [list-news-types.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-news-types-use-case-ts), [update-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-update-news-type-use-case-ts)

**Interfaces, tipos y enums:**

- `interface NewsTypeOutput` (L4): sin documentación — miembros: `id`, `name`, `slug`, `description`, `isWildcard`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface NewsTypeListOutput` (L20) extends NewsTypeOutput: sin documentación — miembros: `usageCount`
- `interface PublicNewsTypeOutput` (L25): Shape público mínimo — backs el formulario de suscripción y el selector "Tipo de noticia" del form admin sin exponer auditoría. — miembros: `id`, `name`, `slug`, `isWildcard`
#### Función `toNewsTypeOutput` (L32–48)

- **Tipo:** función exportada
- **Firma:** `toNewsTypeOutput(newsType: NewsType): NewsTypeOutput` — [news-type-output.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/dtos/news-type-output.ts#L32)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-create-news-type-use-case-ts), [get-news-type-by-id.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-get-news-type-by-id-use-case-ts), [update-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-update-news-type-use-case-ts)

#### Función `toNewsTypeListOutput` (L50–52)

- **Tipo:** función exportada
- **Firma:** `toNewsTypeListOutput(item: NewsTypeListItem): NewsTypeListOutput` — [news-type-output.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/dtos/news-type-output.ts#L50)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `toPublicNewsTypeOutput` (L54–56)

- **Tipo:** función exportada
- **Firma:** `toPublicNewsTypeOutput(newsType: NewsTypeListItem): PublicNewsTypeOutput` — [news-type-output.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/dtos/news-type-output.ts#L54)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-news-types-application-use-cases-create-news-type-use-case-ts"></a>

### create-news-type.use-case.ts

- **Ruta:** [create-news-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/create-news-type.use-case.ts) (`comercial-jhoel-api/src/modules/news-types/application/use-cases/create-news-type.use-case.ts`, 64 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** El frontend consulta `GET /news-types?includeInactive=true` antes de llamar aquí y ofrece "Activar" en vez de "Crear" cuando ya existe una fila inactiva con ese nombre (mismo criterio ya establecido por `CreatePresentationTypeUseCase`) — esta capa igual rechaza un duplicado inactivo en vez de reacti
- **Depende de (archivos del proyecto):** [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [news-type-name-already-exists.error.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-errors-news-type-name-already-exists-error-ts), [slugify.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-utils-slugify-ts), [news-type-output.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-dtos-news-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-types.module.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts), [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateNewsTypeInput` (L8): sin documentación — miembros: `name`, `description`, `createdBy`

#### Clase `CreateNewsTypeUseCase` (L25–63)

- **Decoradores:** `@Injectable()`
- **Propósito:** El frontend consulta `GET /news-types?includeInactive=true` antes de llamar aquí y ofrece "Activar" en vez de "Crear" cuando ya existe una fila inactiva con ese nombre (mismo criterio ya establecido por `CreatePresentationTypeUseCase`) — esta capa igual rechaza un duplicado inactivo en vez de reactivarlo silenciosamente, para que una llamada directa a la API sin pasar por esa UX reciba un error claro y seguro. `is_wildcard` nunca se acepta aquí — solo la fila semilla "Comercial" lo tiene, puesto por la migración.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_TYPE_REPOSITORY) newsTypeRepository: NewsTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 32–51 | `input: CreateNewsTypeInput` | `Promise<NewsTypeOutput>` |
| `generateUniqueSlug` | método private async | 53–62 | `name: string` | `Promise<string>` |

##### `CreateNewsTypeUseCase.execute`

- **Firma:** `execute(input: CreateNewsTypeInput): Promise<NewsTypeOutput>` — [create-news-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/create-news-type.use-case.ts#L32) (L32–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.name.trim().replace`, `input.name.trim`, `input.description?.trim().replace`, `input.description?.trim`, `this.newsTypeRepository.findByName`, `new NewsTypeNameAlreadyExistsError`, `this.generateUniqueSlug`, `this.newsTypeRepository.create`, `toNewsTypeOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsTypeNameAlreadyExistsError(name, !existingByName.isActive)`
- **Consumidores:** [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

##### `CreateNewsTypeUseCase.generateUniqueSlug`

- **Firma:** `generateUniqueSlug(name: string): Promise<string>` — [create-news-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/create-news-type.use-case.ts#L53) (L53–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `slugify`, `this.newsTypeRepository.findBySlug`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-news-types-application-use-cases-deactivate-news-type-use-case-ts"></a>

### deactivate-news-type.use-case.ts

- **Ruta:** [deactivate-news-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/deactivate-news-type.use-case.ts) (`comercial-jhoel-api/src/modules/news-types/application/use-cases/deactivate-news-type.use-case.ts`, 28 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** Soft delete — nunca físico.
- **Depende de (archivos del proyecto):** [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [news-type-not-found.error.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-errors-news-type-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-types.module.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts), [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

#### Clase `DeactivateNewsTypeUseCase` (L13–27)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete — nunca físico. No bloquea sobre `usageCount &gt; 0`: las noticias/suscripciones ya existentes conservan su relación histórica; un tipo inactivo solo deja de ofrecerse para NUEVAS noticias/suscripciones (filtrado en las consultas correspondientes), igual que `DeactivatePresentationTypeUseCase`.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_TYPE_REPOSITORY) newsTypeRepository: NewsTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–26 | `id: string` | `Promise<void>` |

##### `DeactivateNewsTypeUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-news-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/deactivate-news-type.use-case.ts#L20) (L20–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsTypeRepository.findById`, `new NewsTypeNotFoundError`, `this.newsTypeRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsTypeNotFoundError(id)`
- **Consumidores:** [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-types-application-use-cases-get-news-type-by-id-use-case-ts"></a>

### get-news-type-by-id.use-case.ts

- **Ruta:** [get-news-type-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/get-news-type-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/news-types/application/use-cases/get-news-type-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** Caso de uso: declara `GetNewsTypeByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [news-type-not-found.error.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-errors-news-type-not-found-error-ts), [news-type-output.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-dtos-news-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-types.module.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts), [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

#### Clase `GetNewsTypeByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_TYPE_REPOSITORY) newsTypeRepository: NewsTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<NewsTypeOutput>` |

##### `GetNewsTypeByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<NewsTypeOutput>` — [get-news-type-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/get-news-type-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsTypeRepository.findById`, `new NewsTypeNotFoundError`, `toNewsTypeOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsTypeNotFoundError(id)`
- **Consumidores:** [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-active-news-types-use-case-ts"></a>

### list-active-news-types.use-case.ts

- **Ruta:** [list-active-news-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/list-active-news-types.use-case.ts) (`comercial-jhoel-api/src/modules/news-types/application/use-cases/list-active-news-types.use-case.ts`, 19 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** Backs el formulario público de suscripción — solo activas, shape mínimo (sin auditoría).
- **Depende de (archivos del proyecto):** [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [news-type-output.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-dtos-news-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts), [news-types.module.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts)

#### Clase `ListActiveNewsTypesUseCase` (L7–18)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs el formulario público de suscripción — solo activas, shape mínimo (sin auditoría).
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_TYPE_REPOSITORY) newsTypeRepository: NewsTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–17 | — | `Promise<PublicNewsTypeOutput[]>` |

##### `ListActiveNewsTypesUseCase.execute`

- **Firma:** `execute(): Promise<PublicNewsTypeOutput[]>` — [list-active-news-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/list-active-news-types.use-case.ts#L14) (L14–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsTypeRepository.findAll`, `items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-news-types-use-case-ts"></a>

### list-news-types.use-case.ts

- **Ruta:** [list-news-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/list-news-types.use-case.ts) (`comercial-jhoel-api/src/modules/news-types/application/use-cases/list-news-types.use-case.ts`, 26 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** Caso de uso: declara `ListNewsTypesUseCase`, `ListNewsTypesInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [news-type-output.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-dtos-news-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-types.module.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts), [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListNewsTypesInput` (L6): sin documentación — miembros: `includeInactive`, `search`

#### Clase `ListNewsTypesUseCase` (L11–25)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_TYPE_REPOSITORY) newsTypeRepository: NewsTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 18–24 | `input?: ListNewsTypesInput` | `Promise<NewsTypeListOutput[]>` |

##### `ListNewsTypesUseCase.execute`

- **Firma:** `execute(input?: ListNewsTypesInput): Promise<NewsTypeListOutput[]>` — [list-news-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/list-news-types.use-case.ts#L18) (L18–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsTypeRepository.findAll`, `input.search?.trim`, `items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-types-application-use-cases-reorder-news-types-use-case-ts"></a>

### reorder-news-types.use-case.ts

- **Ruta:** [reorder-news-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/reorder-news-types.use-case.ts) (`comercial-jhoel-api/src/modules/news-types/application/use-cases/reorder-news-types.use-case.ts`, 23 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** Caso de uso: declara `ReorderNewsTypesUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [news-type-not-found.error.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-errors-news-type-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-types.module.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts), [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

#### Clase `ReorderNewsTypesUseCase` (L6–22)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_TYPE_REPOSITORY) newsTypeRepository: NewsTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 13–21 | `items: ReorderNewsTypeItem[]` | `Promise<void>` |

##### `ReorderNewsTypesUseCase.execute`

- **Firma:** `execute(items: ReorderNewsTypeItem[]): Promise<void>` — [reorder-news-types.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/reorder-news-types.use-case.ts#L13) (L13–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsTypeRepository.findById`, `new NewsTypeNotFoundError`, `this.newsTypeRepository.reorder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsTypeNotFoundError(item.id)`
- **Consumidores:** [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-types-application-use-cases-update-news-type-use-case-ts"></a>

### update-news-type.use-case.ts

- **Ruta:** [update-news-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/update-news-type.use-case.ts) (`comercial-jhoel-api/src/modules/news-types/application/use-cases/update-news-type.use-case.ts`, 50 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** `isActive` se puede alternar en ambos sentidos aquí (reactivación incluida) — mismo criterio que `UpdatePresentationTypeUseCase`.
- **Depende de (archivos del proyecto):** [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [news-type-not-found.error.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-errors-news-type-not-found-error-ts), [news-type-name-already-exists.error.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-errors-news-type-name-already-exists-error-ts), [news-type-output.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-dtos-news-type-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-types.module.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts), [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateNewsTypeInput` (L8): sin documentación — miembros: `name`, `description`, `isActive`, `updatedBy`

#### Clase `UpdateNewsTypeUseCase` (L16–49)

- **Decoradores:** `@Injectable()`
- **Propósito:** `isActive` se puede alternar en ambos sentidos aquí (reactivación incluida) — mismo criterio que `UpdatePresentationTypeUseCase`. El `slug` nunca se regenera al editar (una vez asignado, es estable).
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_TYPE_REPOSITORY) newsTypeRepository: NewsTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 23–48 | `id: string`, `input: UpdateNewsTypeInput` | `Promise<NewsTypeOutput>` |

##### `UpdateNewsTypeUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateNewsTypeInput): Promise<NewsTypeOutput>` — [update-news-type.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/update-news-type.use-case.ts#L23) (L23–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsTypeRepository.findById`, `new NewsTypeNotFoundError`, `input.name?.trim().replace`, `input.name?.trim`, `name.toLowerCase`, `newsType.name.toLowerCase`, `this.newsTypeRepository.findByName`, `new NewsTypeNameAlreadyExistsError`, `input.description?.trim().replace`, `input.description?.trim`, `this.newsTypeRepository.update`, `toNewsTypeOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.newsTypeRepository.update`
- **Errores que lanza:** `new NewsTypeNotFoundError(id)`, `new NewsTypeNameAlreadyExistsError(name, !existing.isActive)`
- **Consumidores:** [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-types-application-utils-slugify-ts"></a>

### slugify.ts

- **Ruta:** [slugify.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/utils/slugify.ts) (`comercial-jhoel-api/src/modules/news-types/application/utils/slugify.ts`, 19 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** Convierte un texto libre en un slug URL-safe: minúsculas, sin acentos, espacios/símbolos colapsados a un solo `-`, sin `-` al inicio/final.
- **Consumidores:** [create-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-create-news-type-use-case-ts)
#### Función `slugify` (L10–18)

- **Tipo:** función exportada
- **Firma:** `slugify(text: string): string` — [slugify.ts](../../../../comercial-jhoel-api/src/modules/news-types/application/utils/slugify.ts#L10)
- **Propósito / descripción:** Convierte un texto libre en un slug URL-safe: minúsculas, sin acentos, espacios/símbolos colapsados a un solo `-`, sin `-` al inicio/final. `normalize('NFD')` + strip del rango Unicode de marcas combinantes (U+0300–U+036F) es un truco estándar de solo JS, sin dependencia nueva, para quitar tildes en español.
- **Dependencias:** `text.normalize('NFD').replace(COMBINING_DIACRITICAL_MARKS, '').toLowerCase().trim`, `text.normalize('NFD').replace(COMBINING_DIACRITICAL_MARKS, '').toLowerCase`, `text.normalize('NFD').replace`, `text.normalize`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-create-news-type-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-news-types-domain-entities-news-type-entity-ts"></a>

### news-type.entity.ts

- **Ruta:** [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts) (`comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts`, 86 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** Catálogo maestro y configurable de clasificaciones de noticias (Comercial, Educativa, Promociones, ...) — extensible desde el admin sin tocar código.
- **Consumidores:** [news-type-output.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-dtos-news-type-output-ts), [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [news-type.mapper.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-news-type-mapper-ts), [typeorm-news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-typeorm-news-type-repository-ts)

**Interfaces, tipos y enums:**

- `interface NewsTypeProps` (L1): sin documentación — miembros: `id`, `name`, `slug`, `description`, `isWildcard`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`

#### Clase `NewsType` (L27–85)

- **Propósito:** Catálogo maestro y configurable de clasificaciones de noticias (Comercial, Educativa, Promociones, ...) — extensible desde el admin sin tocar código. `isWildcard` es el mecanismo central de "Comercial = recibe todas las noticias" — el frontend público lo usa para preseleccionar "Todas las noticias" en el formulario de suscripción. Puesto en `true` únicamente por la migración semilla de "Comercial" — nunca expuesto para editar desde ningún endpoint, es una decisión arquitectónica fija sobre esa categoría inicial, no una feature general.
- **Dependencias inyectadas (constructor):** `props: NewsTypeProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 30–32 | `props: NewsTypeProps` | `NewsType` |
| `id` | getter public | 34–36 | — | `string` |
| `name` | getter public | 38–40 | — | `string` |
| `slug` | getter public | 42–44 | — | `string` |
| `description` | getter public | 46–48 | — | `string \| null` |
| `isWildcard` | getter public | 50–52 | — | `boolean` |
| `isActive` | getter public | 54–56 | — | `boolean` |
| `sortOrder` | getter public | 58–60 | — | `number` |
| `createdAt` | getter public | 62–64 | — | `Date` |
| `updatedAt` | getter public | 66–68 | — | `Date` |
| `createdBy` | getter public | 70–72 | — | `string` |
| `createdByUsername` | getter public | 74–76 | — | `string` |
| `updatedBy` | getter public | 78–80 | — | `string \| null` |
| `updatedByUsername` | getter public | 82–84 | — | `string \| null` |

##### `NewsType.create`

- **Firma:** `create(props: NewsTypeProps): NewsType` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L30) (L30–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new NewsType`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [news-type.mapper.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-news-type-mapper-ts), [typeorm-news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-typeorm-news-type-repository-ts)

##### `NewsType.id`

- **Firma:** `id(): string` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsType.name`

- **Firma:** `name(): string` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsType.slug`

- **Firma:** `slug(): string` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsType.description`

- **Firma:** `description(): string \| null` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsType.isWildcard`

- **Firma:** `isWildcard(): boolean` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsType.isActive`

- **Firma:** `isActive(): boolean` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsType.sortOrder`

- **Firma:** `sortOrder(): number` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsType.createdAt`

- **Firma:** `createdAt(): Date` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L62) (L62–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsType.updatedAt`

- **Firma:** `updatedAt(): Date` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L66) (L66–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsType.createdBy`

- **Firma:** `createdBy(): string` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L70) (L70–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsType.createdByUsername`

- **Firma:** `createdByUsername(): string` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsType.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsType.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [news-type.entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/entities/news-type.entity.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-news-types-domain-errors-invalid-news-type-error-ts"></a>

### invalid-news-type.error.ts

- **Ruta:** [invalid-news-type.error.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/errors/invalid-news-type.error.ts) (`comercial-jhoel-api/src/modules/news-types/domain/errors/invalid-news-type.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** El `newsTypeId` referenciado (al crear una noticia o al suscribirse) no existe o está inactivo.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts), [update-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-update-news-article-use-case-ts), [register-push-subscription.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-register-push-subscription-use-case-ts), [subscribe-to-news.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts), [update-subscription-preferences.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-update-subscription-preferences-use-case-ts)

#### Clase `InvalidNewsTypeError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** El `newsTypeId` referenciado (al crear una noticia o al suscribirse) no existe o está inactivo.
<a id="f-comercial-jhoel-api-src-modules-news-types-domain-errors-news-type-name-already-exists-error-ts"></a>

### news-type-name-already-exists.error.ts

- **Ruta:** [news-type-name-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/errors/news-type-name-already-exists.error.ts) (`comercial-jhoel-api/src/modules/news-types/domain/errors/news-type-name-already-exists.error.ts`, 14 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** Errores de dominio: declara `NewsTypeNameAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-create-news-type-use-case-ts), [update-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-update-news-type-use-case-ts), [typeorm-news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-typeorm-news-type-repository-ts)

#### Clase `NewsTypeNameAlreadyExistsError` (L3–13)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `name: string`, `isInactive: `
<a id="f-comercial-jhoel-api-src-modules-news-types-domain-errors-news-type-not-found-error-ts"></a>

### news-type-not-found.error.ts

- **Ruta:** [news-type-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/errors/news-type-not-found.error.ts) (`comercial-jhoel-api/src/modules/news-types/domain/errors/news-type-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** Errores de dominio: declara `NewsTypeNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-deactivate-news-type-use-case-ts), [get-news-type-by-id.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-get-news-type-by-id-use-case-ts), [reorder-news-types.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-reorder-news-types-use-case-ts), [update-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-update-news-type-use-case-ts)

#### Clase `NewsTypeNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts"></a>

### news-type.repository.ts

- **Ruta:** [news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/domain/repositories/news-type.repository.ts) (`comercial-jhoel-api/src/modules/news-types/domain/repositories/news-type.repository.ts`, 52 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `FindNewsTypesOptions`, `CreateNewsTypeData`, `UpdateNewsTypeData`, `ReorderNewsTypeItem`, `NewsTypeListItem` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-type.entity.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-entities-news-type-entity-ts)
- **Consumidores:** [create-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts), [update-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-update-news-article-use-case-ts), [register-push-subscription.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-register-push-subscription-use-case-ts), [subscribe-to-news.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts), [update-subscription-preferences.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-update-subscription-preferences-use-case-ts), [news-type-output.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-dtos-news-type-output-ts), [create-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-create-news-type-use-case-ts), [deactivate-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-deactivate-news-type-use-case-ts), [get-news-type-by-id.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-get-news-type-by-id-use-case-ts), [list-active-news-types.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-active-news-types-use-case-ts), [list-news-types.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-news-types-use-case-ts), [reorder-news-types.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-reorder-news-types-use-case-ts), [update-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-update-news-type-use-case-ts), [typeorm-news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-typeorm-news-type-repository-ts), [news-types.module.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts)

**Interfaces, tipos y enums:**

- `interface FindNewsTypesOptions` (L5): sin documentación — miembros: `activeOnly`, `search`
- `interface CreateNewsTypeData` (L10): sin documentación — miembros: `name`, `slug`, `description`, `createdBy`
- `interface UpdateNewsTypeData` (L17): sin documentación — miembros: `name`, `slug`, `description`, `isActive`, `updatedBy`
- `interface ReorderNewsTypeItem` (L25): sin documentación — miembros: `id`, `sortOrder`
- `interface NewsTypeListItem` (L31) extends NewsTypeProps: Una fila de listado más su uso real — nunca persistido, siempre calculado en vivo contra `news_articles`, igual que `PresentationTypeListItem`. — miembros: `usageCount`
- `interface NewsTypeRepository` (L35): sin documentación — miembros: `findAll`, `findById`, `findByActiveName`, `findByName`, `findBySlug`, `findWildcard`, `create`, `update`, `deactivate`, `reorder`, `countUsage`

**Constantes exportadas:**

- `NEWS_TYPE_REPOSITORY` (L3) = `Symbol('NEWS_TYPE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-news-type-mapper-ts"></a>

### news-type.mapper.ts

- **Ruta:** [news-type.mapper.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/news-type.mapper.ts) (`comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/news-type.mapper.ts`, 23 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** Mapper: declara `NewsTypeMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-type.entity.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-entities-news-type-entity-ts), [news-type.orm-entity.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-news-type-orm-entity-ts)
- **Consumidores:** [typeorm-news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-typeorm-news-type-repository-ts)

#### Clase `NewsTypeMapper` (L4–22)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–21 | `orm: NewsTypeOrmEntity` | `NewsType` |

##### `NewsTypeMapper.toDomain`

- **Firma:** `toDomain(orm: NewsTypeOrmEntity): NewsType` — [news-type.mapper.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/news-type.mapper.ts#L5) (L5–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `NewsType.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-typeorm-news-type-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-news-type-orm-entity-ts"></a>

### news-type.orm-entity.ts

- **Ruta:** [news-type.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/news-type.orm-entity.ts) (`comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/news-type.orm-entity.ts`, 60 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** Único case-insensitive entre filas activas para `name`/`slug` — mismo escape hatch `LOWER(...) WHERE is_active` de `presentation_types`/`clients` (TypeORM no puede expresar un índice funcional vía decorador).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [news-article.orm-entity.ts](news.md#f-comercial-jhoel-api-src-modules-news-infrastructure-persistence-news-article-orm-entity-ts), [news-type.mapper.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-news-type-mapper-ts), [typeorm-news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-typeorm-news-type-repository-ts), [news-types.module.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts)

#### Clase `NewsTypeOrmEntity` (L17–59)

- **Decoradores:** `@Entity('news_types')`
- **Propósito:** Único case-insensitive entre filas activas para `name`/`slug` — mismo escape hatch `LOWER(...) WHERE is_active` de `presentation_types`/`clients` (TypeORM no puede expresar un índice funcional vía decorador).
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column slug: string`, `@Column description: string \| null`, `@Column isWildcard: boolean`, `@Column isActive: boolean`, `@Column sortOrder: number`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-typeorm-news-type-repository-ts"></a>

### typeorm-news-type.repository.ts

- **Ruta:** [typeorm-news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts) (`comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts`, 189 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmNewsTypeRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-type.entity.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-entities-news-type-entity-ts), [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [news-type-name-already-exists.error.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-errors-news-type-name-already-exists-error-ts), [news-type.orm-entity.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-news-type-orm-entity-ts), [news-type.mapper.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-news-type-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [news-types.module.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts)

#### Clase `TypeOrmNewsTypeRepository` (L17–188)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements NewsTypeRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(NewsTypeOrmEntity) repository: Repository<NewsTypeOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 25–95 | `options: FindNewsTypesOptions` | `Promise<NewsTypeListItem[]>` |
| `findById` | método public async | 97–100 | `id: string` | `Promise<NewsType \| null>` |
| `findByActiveName` | método public async | 102–109 | `name: string` | `Promise<NewsType \| null>` |
| `findByName` | método public async | 111–117 | `name: string` | `Promise<NewsType \| null>` |
| `findBySlug` | método public async | 119–125 | `slug: string` | `Promise<NewsType \| null>` |
| `findWildcard` | método public async | 127–130 | — | `Promise<NewsType \| null>` |
| `create` | método public async | 132–146 | `data: CreateNewsTypeData` | `Promise<NewsType>` |
| `update` | método public async | 148–157 | `id: string`, `data: UpdateNewsTypeData` | `Promise<NewsType>` |
| `deactivate` | método public async | 159–161 | `id: string` | `Promise<void>` |
| `reorder` | método public async | 163–169 | `items: ReorderNewsTypeItem[]` | `Promise<void>` |
| `countUsage` | método public async | 171–177 | `id: string` | `Promise<number>` |
| `translateUniqueViolation` | método private | 179–187 | `error: unknown`, `name: string` | `unknown` |

##### `TypeOrmNewsTypeRepository.findAll`

- **Firma:** `findAll(options: FindNewsTypesOptions): Promise<NewsTypeListItem[]>` — [typeorm-news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts#L25) (L25–95)
- **Propósito / descripción:** Correlated scalar subquery para `usageCount` — nunca un join (fanearía filas), mismo patrón que `TypeOrmPresentationTypeRepository.findAll`.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('newsType').leftJoin`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.select('newsType.id', 'id').addSelect('newsType.name', 'name').addSelect`, `qb.select('newsType.id', 'id').addSelect`, `qb.select`, `subQb.select('COUNT(*)', 'count').from('news_articles', 'na').where`, `subQb.select('COUNT(*)', 'count').from`, `subQb.select`, `qb.getRawMany`, `rows.map`, `parseInt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsTypeRepository.findById`

- **Firma:** `findById(id: string): Promise<NewsType \| null>` — [typeorm-news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts#L97) (L97–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `NewsTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsTypeRepository.findByActiveName`

- **Firma:** `findByActiveName(name: string): Promise<NewsType \| null>` — [typeorm-news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts#L102) (L102–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('newsType').where`, `this.repository.createQueryBuilder`, `NewsTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsTypeRepository.findByName`

- **Firma:** `findByName(name: string): Promise<NewsType \| null>` — [typeorm-news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts#L111) (L111–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('newsType').where`, `this.repository.createQueryBuilder`, `NewsTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsTypeRepository.findBySlug`

- **Firma:** `findBySlug(slug: string): Promise<NewsType \| null>` — [typeorm-news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts#L119) (L119–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('newsType').where`, `this.repository.createQueryBuilder`, `NewsTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsTypeRepository.findWildcard`

- **Firma:** `findWildcard(): Promise<NewsType \| null>` — [typeorm-news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts#L127) (L127–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `NewsTypeMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsTypeRepository.create`

- **Firma:** `create(data: CreateNewsTypeData): Promise<NewsType>` — [typeorm-news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts#L132) (L132–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `NewsTypeMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsTypeRepository.update`

- **Firma:** `update(id: string, data: UpdateNewsTypeData): Promise<NewsType>` — [typeorm-news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts#L148) (L148–157)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `NewsTypeMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name ?? '')`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsTypeRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts#L159) (L159–161)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsTypeRepository.reorder`

- **Firma:** `reorder(items: ReorderNewsTypeItem[]): Promise<void>` — [typeorm-news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts#L163) (L163–169)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.transaction`, `manager.update`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsTypeRepository.countUsage`

- **Firma:** `countUsage(id: string): Promise<number>` — [typeorm-news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts#L171) (L171–177)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `parseInt`
- **Efectos secundarios:** Tablas en su SQL: `news_articles`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsTypeRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, name: string): unknown` — [typeorm-news-type.repository.ts](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts#L179) (L179–187)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new NewsTypeNameAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts"></a>

### news-types.module.ts

- **Ruta:** [news-types.module.ts](../../../../comercial-jhoel-api/src/modules/news-types/news-types.module.ts) (`comercial-jhoel-api/src/modules/news-types/news-types.module.ts`, 38 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** "Tipos de Noticias" — catálogo maestro configurable y extensible (nunca un enum rígido en código).
- **Depende de (archivos del proyecto):** [news-type.orm-entity.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-news-type-orm-entity-ts), [typeorm-news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-infrastructure-persistence-typeorm-news-type-repository-ts), [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [create-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-create-news-type-use-case-ts), [list-news-types.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-news-types-use-case-ts), [list-active-news-types.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-active-news-types-use-case-ts), [get-news-type-by-id.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-get-news-type-by-id-use-case-ts), [update-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-update-news-type-use-case-ts), [deactivate-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-deactivate-news-type-use-case-ts), [reorder-news-types.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-reorder-news-types-use-case-ts), [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts), [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

#### Clase `NewsTypesModule` (L22–37)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([NewsTypeOrmEntity])], controllers: [NewsTypesController], providers: [ { provide: NEWS_TYPE_REPOSITORY, useClass: T`
- **Propósito:** "Tipos de Noticias" — catálogo maestro configurable y extensible (nunca un enum rígido en código). `NewsModule` lo importa para validar `newsTypeId` al crear/editar una noticia; `NewsSubscriptionsModule` lo importa para el formulario público de suscripción y para resolver el wildcard "Comercial" al determinar destinatarios.
<a id="f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts"></a>

### news-types.controller.ts

- **Ruta:** [news-types.controller.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts) (`comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts`, 92 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** "Sistema → Tipos de Noticias" — CRUD es admin-only; cualquier rol autenticado puede leer (lo necesita el selector "Tipo de noticia" del form de Noticias).
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-create-news-type-use-case-ts), [list-news-types.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-news-types-use-case-ts), [get-news-type-by-id.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-get-news-type-by-id-use-case-ts), [update-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-update-news-type-use-case-ts), [deactivate-news-type.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-deactivate-news-type-use-case-ts), [reorder-news-types.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-reorder-news-types-use-case-ts), [create-news-type.request.dto.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-create-news-type-request-dto-ts), [update-news-type.request.dto.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-update-news-type-request-dto-ts), [list-news-types.query.dto.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-list-news-types-query-dto-ts), [reorder-news-types.request.dto.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-reorder-news-types-request-dto-ts), [news-type.response.dto.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-news-type-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-types.module.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts)

#### Clase `NewsTypesController` (L32–91)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('news-types')`
- **Propósito:** "Sistema → Tipos de Noticias" — CRUD es admin-only; cualquier rol autenticado puede leer (lo necesita el selector "Tipo de noticia" del form de Noticias).
- **Dependencias inyectadas (constructor):** `createNewsTypeUseCase: CreateNewsTypeUseCase`, `listNewsTypesUseCase: ListNewsTypesUseCase`, `getNewsTypeByIdUseCase: GetNewsTypeByIdUseCase`, `updateNewsTypeUseCase: UpdateNewsTypeUseCase`, `deactivateNewsTypeUseCase: DeactivateNewsTypeUseCase`, `reorderNewsTypesUseCase: ReorderNewsTypesUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 44–53 | `dto: CreateNewsTypeRequestDto`, `userId: string` | `Promise<NewsTypeResponseDto>` |
| `findAll` | método public | 55–58 | `query: ListNewsTypesQueryDto` | `Promise<NewsTypeListResponseDto[]>` |
| `findOne` | método public | 60–63 | `id: string` | `Promise<NewsTypeResponseDto>` |
| `update` | método public | 65–74 | `id: string`, `dto: UpdateNewsTypeRequestDto`, `userId: string` | `Promise<NewsTypeResponseDto>` |
| `deactivate` | método public | 76–82 | `id: string` | `Promise<void>` |
| `reorder` | método public | 84–90 | `dto: ReorderNewsTypesRequestDto` | `Promise<void>` |

##### `NewsTypesController.create`

- **Firma:** `create(dto: CreateNewsTypeRequestDto, userId: string): Promise<NewsTypeResponseDto>` — [news-types.controller.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts#L44) (L44–53)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createNewsTypeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsTypesController.findAll`

- **Firma:** `findAll(query: ListNewsTypesQueryDto): Promise<NewsTypeListResponseDto[]>` — [news-types.controller.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts#L55) (L55–58)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listNewsTypesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsTypesController.findOne`

- **Firma:** `findOne(id: string): Promise<NewsTypeResponseDto>` — [news-types.controller.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts#L60) (L60–63)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getNewsTypeByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsTypesController.update`

- **Firma:** `update(id: string, dto: UpdateNewsTypeRequestDto, userId: string): Promise<NewsTypeResponseDto>` — [news-types.controller.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts#L65) (L65–74)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateNewsTypeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsTypesController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [news-types.controller.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts#L76) (L76–82)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateNewsTypeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsTypesController.reorder`

- **Firma:** `reorder(dto: ReorderNewsTypesRequestDto): Promise<void>` — [news-types.controller.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts#L84) (L84–90)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post('reorder')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.reorderNewsTypesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-create-news-type-request-dto-ts"></a>

### create-news-type.request.dto.ts

- **Ruta:** [create-news-type.request.dto.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/dtos/create-news-type.request.dto.ts) (`comercial-jhoel-api/src/modules/news-types/presentation/dtos/create-news-type.request.dto.ts`, 15 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** DTO de entrada: declara `CreateNewsTypeRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

#### Clase `CreateNewsTypeRequestDto` (L3–14)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-list-news-types-query-dto-ts"></a>

### list-news-types.query.dto.ts

- **Ruta:** [list-news-types.query.dto.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/dtos/list-news-types.query.dto.ts) (`comercial-jhoel-api/src/modules/news-types/presentation/dtos/list-news-types.query.dto.ts`, 14 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** DTO de consulta: declara `ListNewsTypesQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

#### Clase `ListNewsTypesQueryDto` (L4–13)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-news-type-response-dto-ts"></a>

### news-type.response.dto.ts

- **Ruta:** [news-type.response.dto.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/dtos/news-type.response.dto.ts) (`comercial-jhoel-api/src/modules/news-types/presentation/dtos/news-type.response.dto.ts`, 28 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** DTO de respuesta: declara `NewsTypeResponseDto`, `NewsTypeListResponseDto`, `PublicNewsTypeResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts), [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

#### Clase `NewsTypeResponseDto` (L1–15)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `NewsTypeListResponseDto` (L17–19)

- **Herencia / contratos:** extends NewsTypeResponseDto
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PublicNewsTypeResponseDto` (L22–27)

- **Propósito:** Shape público — backs el formulario de suscripción, sin auditoría.
<a id="f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-reorder-news-types-request-dto-ts"></a>

### reorder-news-types.request.dto.ts

- **Ruta:** [reorder-news-types.request.dto.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/dtos/reorder-news-types.request.dto.ts) (`comercial-jhoel-api/src/modules/news-types/presentation/dtos/reorder-news-types.request.dto.ts`, 19 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** DTO de entrada: declara `ReorderNewsTypeItemDto`, `ReorderNewsTypesRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

#### Clase `ReorderNewsTypeItemDto` (L4–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ReorderNewsTypesRequestDto` (L12–18)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-update-news-type-request-dto-ts"></a>

### update-news-type.request.dto.ts

- **Ruta:** [update-news-type.request.dto.ts](../../../../comercial-jhoel-api/src/modules/news-types/presentation/dtos/update-news-type.request.dto.ts) (`comercial-jhoel-api/src/modules/news-types/presentation/dtos/update-news-type.request.dto.ts`, 20 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `news-types`
- **Responsabilidad:** DTO de entrada: declara `UpdateNewsTypeRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [news-types.controller.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-controllers-news-types-controller-ts)

#### Clase `UpdateNewsTypeRequestDto` (L3–19)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
