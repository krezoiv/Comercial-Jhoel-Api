# Módulo backend `catalog-banks`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/catalog-banks` | [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L62) `CatalogBanksController.create` | [CreateCatalogBankUseCase](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-create-catalog-bank-use-case-ts) | `CatalogBankRepository`.create | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogBankService.createBank` |
| `GET /api/catalog-banks` | [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L76) `CatalogBanksController.findAll` | [ListCatalogBanksUseCase](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-catalog-banks-use-case-ts) | `CatalogBankRepository`.findAll | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogBankService.getBanks` |
| `GET /api/catalog-banks/:id` | [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L84) `CatalogBanksController.findOne` | [GetCatalogBankByIdUseCase](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-by-id-use-case-ts) | `CatalogBankRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogBankService.getBankById` |
| `PATCH /api/catalog-banks/:id` | [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L89) `CatalogBanksController.update` | [UpdateCatalogBankUseCase](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-update-catalog-bank-use-case-ts) | `CatalogBankRepository`.findById/update | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogBankService.updateBank` |
| `POST /api/catalog-banks/:id/activate` | [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L103) `CatalogBanksController.activate` | [SetCatalogBankActiveUseCase](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-active-use-case-ts) | `CatalogBankRepository`.findById/setActive | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogBankService.activateBank` |
| `DELETE /api/catalog-banks/:id` | [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L112) `CatalogBanksController.deactivate` | [SetCatalogBankActiveUseCase](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-active-use-case-ts) | `CatalogBankRepository`.findById/setActive | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogBankService.deactivateBank` |
| `POST /api/catalog-banks/reorder` | [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L121) `CatalogBanksController.reorder` | [ReorderCatalogBanksUseCase](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-reorder-catalog-banks-use-case-ts) | `CatalogBankRepository`.findById/reorder | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogBankService.reorderBanks` |
| `POST /api/catalog-banks/:id/image` | [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L127) `CatalogBanksController.setImage` | [SetCatalogBankImageUseCase](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-image-use-case-ts) | `CatalogBankRepository`.findById/setImage | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogBankService.setImage` |
| `DELETE /api/catalog-banks/:id/image` | [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L142) `CatalogBanksController.removeImage` | [RemoveCatalogBankImageUseCase](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-remove-catalog-bank-image-use-case-ts) | `CatalogBankRepository`.findById/removeImage | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CatalogBankService.removeImage` |
| `GET /api/public-catalog-banks` | [public-catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/public-catalog-banks.controller.ts#L23) `PublicCatalogBanksController.findAll` | [ListPublishedCatalogBanksUseCase](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-published-catalog-banks-use-case-ts) | `CatalogBankRepository`.findPublished | — | `PublicCatalogBankService.getPublishedBanks` |
| `GET /api/public-catalog-banks/images/:id` | [public-catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/public-catalog-banks.controller.ts#L28) `PublicCatalogBanksController.getImage` | [GetCatalogBankImageUseCase](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-image-use-case-ts) | `CatalogBankRepository`.getImage | — | — |
| `GET /api/public-catalog-banks/:id` | [public-catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/public-catalog-banks.controller.ts#L40) `PublicCatalogBanksController.findOne` | [GetPublishedCatalogBankByIdUseCase](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-published-catalog-bank-by-id-use-case-ts) | `CatalogBankRepository`.findById | — | — |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [catalog-bank-output.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-application-dtos-catalog-bank-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toCatalogBankOutput`, `toPublicCatalogBankOutput`, `CatalogBankOutput`, `PublicCatalogBankOutput` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [create-catalog-bank.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-create-catalog-bank-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateCatalogBankUseCase`, `CreateCatalogBankInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-catalog-bank-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetCatalogBankByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-catalog-bank-image.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-image-use-case-ts) | .ts | Caso de uso | Aplicación | Único endpoint que sirve los bytes — reutilizado tanto por la landing pública como por la vista previa/miniaturas del admin (misma URL, sin necesidad de una ruta admin separada, igual que Teléfonos/Librería/Variedades/Noticias). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-published-catalog-bank-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-published-catalog-bank-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | 404 tanto si no existe como si existe pero está inactivo — nunca revela cuál. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-catalog-banks.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-catalog-banks-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListCatalogBanksUseCase`, `ListCatalogBanksInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-published-catalog-banks.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-published-catalog-banks-use-case-ts) | .ts | Caso de uso | Aplicación | Backs la sección "Bancos" en la landing — solo `isActive`, ordenados por `sortOrder`, nunca datos del módulo financiero "Bancos". | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [remove-catalog-bank-image.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-remove-catalog-bank-image-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `RemoveCatalogBankImageUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [reorder-catalog-banks.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-reorder-catalog-banks-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ReorderCatalogBanksUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [set-catalog-bank-active.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-active-use-case-ts) | .ts | Caso de uso | Aplicación | Soft — nunca DELETE físico. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [set-catalog-bank-image.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-image-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `SetCatalogBankImageUseCase`, `SetCatalogBankImageInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-catalog-bank.use-case.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-update-catalog-bank-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateCatalogBankUseCase`, `UpdateCatalogBankInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [assert-valid-catalog-bank-image.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-application-utils-assert-valid-catalog-bank-image-ts) | .ts | Utilidad | Aplicación | Utilidad: declara `assertValidCatalogBankImage`, `UploadedCatalogBankImage`, `MAX_CATALOG_BANK_IMAGE_SIZE_BYTES`, `ALLOWED_MIME_TYPES` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [catalog-banks.module.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts) | .ts | Módulo | Arranque / configuración | "Catálogo de Bancos" — catálogo público informativo, completamente independiente de `modules/banks/` (financiero, Cuadre de Agentes), `modules/transaction-banks/` y `modules/bank-deposits/`. | 16 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |
| [catalog-bank.entity.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-domain-entities-catalog-bank-entity-ts) | .ts | Entidad de dominio | Dominio | Catálogo público informativo de bancos — imagen, nombre, descripción, información adicional. | 0 internas | 4 | Media (4 consumidores) |
| [catalog-bank-not-found.error.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-catalog-bank-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `CatalogBankNotFoundError` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [catalog-bank-not-visible.error.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-catalog-bank-not-visible-error-ts) | .ts | Errores de dominio | Dominio | Reusado tanto para "no existe" como para "existe pero está inactivo" — un 404 público nunca revela cuál de los dos casos ocurrió. | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-catalog-bank-image.error.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-invalid-catalog-bank-image-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidCatalogBankImageError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [catalog-bank.repository.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateCatalogBankData`, `UpdateCatalogBankData`, `ListCatalogBanksOptions`, `ReorderCatalogBankItem`, `CatalogBankImageBytes` (sin comentario de documentación en el código). | 1 internas | 13 | Alta (13 consumidores) |
| [catalog-bank.mapper.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-catalog-bank-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `CatalogBankMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [catalog-bank.orm-entity.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-catalog-bank-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | `imageData` usa `select: false` — mismo patrón que Teléfonos/Librería/Variedades/Noticias: nunca viaja en un listado normal, solo `getImage()` la selecciona explícitamente. | 1 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [typeorm-catalog-bank.repository.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-typeorm-catalog-bank-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmCatalogBankRepository` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [catalog-banks.controller.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts) | .ts | Controlador | Presentación | Admin-only end to end — "Sistema → Catálogo de Bancos". | 17 internas; ext.: @nestjs/common, @nestjs/platform-express | 1 | Media (controlador) |
| [public-catalog-banks.controller.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-public-catalog-banks-controller-ts) | .ts | Controlador | Presentación | Público, sin guard — backs la sección "Bancos" de la landing. | 4 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [catalog-bank.response.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-catalog-bank-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `CatalogBankResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [create-catalog-bank.request.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-create-catalog-bank-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateCatalogBankRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-catalog-banks.query.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-list-catalog-banks-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListCatalogBanksQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [public-catalog-bank.response.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-public-catalog-bank-response-dto-ts) | .ts | DTO de respuesta | Presentación | Backs "Bancos" en la landing — sin isActive/audit/orden, solo lo que un visitante puede ver. | 0 internas | 1 | Baja (1 consumidores) |
| [reorder-catalog-banks.request.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-reorder-catalog-banks-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `ReorderCatalogBankItemDto`, `ReorderCatalogBanksRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [update-catalog-bank.request.dto.ts](#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-update-catalog-bank-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateCatalogBankRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-application-dtos-catalog-bank-output-ts"></a>

### catalog-bank-output.ts

- **Ruta:** [catalog-bank-output.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/dtos/catalog-bank-output.ts) (`comercial-jhoel-api/src/modules/catalog-banks/application/dtos/catalog-bank-output.ts`, 55 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** DTO de salida (aplicación): declara `toCatalogBankOutput`, `toPublicCatalogBankOutput`, `CatalogBankOutput`, `PublicCatalogBankOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-bank.entity.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-entities-catalog-bank-entity-ts)
- **Consumidores:** [create-catalog-bank.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-create-catalog-bank-use-case-ts), [get-catalog-bank-by-id.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-by-id-use-case-ts), [get-published-catalog-bank-by-id.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-published-catalog-bank-by-id-use-case-ts), [list-catalog-banks.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-catalog-banks-use-case-ts), [list-published-catalog-banks.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-published-catalog-banks-use-case-ts), [update-catalog-bank.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-update-catalog-bank-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CatalogBankOutput` (L3): sin documentación — miembros: `id`, `name`, `description`, `additionalInfo`, `isActive`, `sortOrder`, `hasImage`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface PublicCatalogBankOutput` (L20): Shape público — backs "Bancos" en la landing. — miembros: `id`, `name`, `description`, `additionalInfo`, `hasImage`
#### Función `toCatalogBankOutput` (L28–44)

- **Tipo:** función exportada
- **Firma:** `toCatalogBankOutput(bank: CatalogBank): CatalogBankOutput` — [catalog-bank-output.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/dtos/catalog-bank-output.ts#L28)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-catalog-bank.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-create-catalog-bank-use-case-ts), [get-catalog-bank-by-id.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-by-id-use-case-ts), [update-catalog-bank.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-update-catalog-bank-use-case-ts)

#### Función `toPublicCatalogBankOutput` (L46–54)

- **Tipo:** función exportada
- **Firma:** `toPublicCatalogBankOutput(bank: CatalogBank): PublicCatalogBankOutput` — [catalog-bank-output.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/dtos/catalog-bank-output.ts#L46)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-published-catalog-bank-by-id.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-published-catalog-bank-by-id-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-create-catalog-bank-use-case-ts"></a>

### create-catalog-bank.use-case.ts

- **Ruta:** [create-catalog-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/create-catalog-bank.use-case.ts) (`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/create-catalog-bank.use-case.ts`, 30 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Caso de uso: declara `CreateCatalogBankUseCase`, `CreateCatalogBankInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [catalog-bank-output.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-dtos-catalog-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts), [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateCatalogBankInput` (L6): sin documentación — miembros: `name`, `description`, `additionalInfo`, `userId`

#### Clase `CreateCatalogBankUseCase` (L13–29)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_BANK_REPOSITORY) catalogBankRepository: CatalogBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–28 | `input: CreateCatalogBankInput` | `Promise<CatalogBankOutput>` |

##### `CreateCatalogBankUseCase.execute`

- **Firma:** `execute(input: CreateCatalogBankInput): Promise<CatalogBankOutput>` — [create-catalog-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/create-catalog-bank.use-case.ts#L20) (L20–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogBankRepository.create`, `input.name.trim`, `input.description?.trim`, `input.additionalInfo?.trim`, `toCatalogBankOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-by-id-use-case-ts"></a>

### get-catalog-bank-by-id.use-case.ts

- **Ruta:** [get-catalog-bank-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/get-catalog-bank-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/get-catalog-bank-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Caso de uso: declara `GetCatalogBankByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [catalog-bank-not-found.error.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-catalog-bank-not-found-error-ts), [catalog-bank-output.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-dtos-catalog-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts), [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

#### Clase `GetCatalogBankByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_BANK_REPOSITORY) catalogBankRepository: CatalogBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<CatalogBankOutput>` |

##### `GetCatalogBankByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<CatalogBankOutput>` — [get-catalog-bank-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/get-catalog-bank-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogBankRepository.findById`, `new CatalogBankNotFoundError`, `toCatalogBankOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogBankNotFoundError(id)`
- **Consumidores:** [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-image-use-case-ts"></a>

### get-catalog-bank-image.use-case.ts

- **Ruta:** [get-catalog-bank-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/get-catalog-bank-image.use-case.ts) (`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/get-catalog-bank-image.use-case.ts`, 27 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Único endpoint que sirve los bytes — reutilizado tanto por la landing pública como por la vista previa/miniaturas del admin (misma URL, sin necesidad de una ruta admin separada, igual que Teléfonos/Librería/Variedades/Noticias).
- **Depende de (archivos del proyecto):** [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [catalog-bank-not-visible.error.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-catalog-bank-not-visible-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts), [public-catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-public-catalog-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface CatalogBankImageBytesOutput` (L6): sin documentación — miembros: `data`, `mimeType`

#### Clase `GetCatalogBankImageUseCase` (L12–26)

- **Decoradores:** `@Injectable()`
- **Propósito:** Único endpoint que sirve los bytes — reutilizado tanto por la landing pública como por la vista previa/miniaturas del admin (misma URL, sin necesidad de una ruta admin separada, igual que Teléfonos/Librería/Variedades/Noticias).
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_BANK_REPOSITORY) catalogBankRepository: CatalogBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–25 | `id: string` | `Promise<CatalogBankImageBytesOutput>` |

##### `GetCatalogBankImageUseCase.execute`

- **Firma:** `execute(id: string): Promise<CatalogBankImageBytesOutput>` — [get-catalog-bank-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/get-catalog-bank-image.use-case.ts#L19) (L19–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogBankRepository.getImage`, `new CatalogBankNotVisibleError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogBankNotVisibleError()`
- **Consumidores:** [public-catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-public-catalog-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-published-catalog-bank-by-id-use-case-ts"></a>

### get-published-catalog-bank-by-id.use-case.ts

- **Ruta:** [get-published-catalog-bank-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/get-published-catalog-bank-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/get-published-catalog-bank-by-id.use-case.ts`, 23 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** 404 tanto si no existe como si existe pero está inactivo — nunca revela cuál.
- **Depende de (archivos del proyecto):** [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [catalog-bank-not-visible.error.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-catalog-bank-not-visible-error-ts), [catalog-bank-output.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-dtos-catalog-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts), [public-catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-public-catalog-banks-controller-ts)

#### Clase `GetPublishedCatalogBankByIdUseCase` (L8–22)

- **Decoradores:** `@Injectable()`
- **Propósito:** 404 tanto si no existe como si existe pero está inactivo — nunca revela cuál.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_BANK_REPOSITORY) catalogBankRepository: CatalogBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 15–21 | `id: string` | `Promise<PublicCatalogBankOutput>` |

##### `GetPublishedCatalogBankByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<PublicCatalogBankOutput>` — [get-published-catalog-bank-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/get-published-catalog-bank-by-id.use-case.ts#L15) (L15–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogBankRepository.findById`, `new CatalogBankNotVisibleError`, `toPublicCatalogBankOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogBankNotVisibleError()`
- **Consumidores:** [public-catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-public-catalog-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-catalog-banks-use-case-ts"></a>

### list-catalog-banks.use-case.ts

- **Ruta:** [list-catalog-banks.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/list-catalog-banks.use-case.ts) (`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/list-catalog-banks.use-case.ts`, 23 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Caso de uso: declara `ListCatalogBanksUseCase`, `ListCatalogBanksInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [catalog-bank-output.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-dtos-catalog-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts), [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListCatalogBanksInput` (L6): sin documentación — miembros: `includeInactive`, `search`

#### Clase `ListCatalogBanksUseCase` (L11–22)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_BANK_REPOSITORY) catalogBankRepository: CatalogBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 18–21 | `input?: ListCatalogBanksInput` | `Promise<CatalogBankOutput[]>` |

##### `ListCatalogBanksUseCase.execute`

- **Firma:** `execute(input?: ListCatalogBanksInput): Promise<CatalogBankOutput[]>` — [list-catalog-banks.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/list-catalog-banks.use-case.ts#L18) (L18–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogBankRepository.findAll`, `banks.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-published-catalog-banks-use-case-ts"></a>

### list-published-catalog-banks.use-case.ts

- **Ruta:** [list-published-catalog-banks.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/list-published-catalog-banks.use-case.ts) (`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/list-published-catalog-banks.use-case.ts`, 19 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Backs la sección "Bancos" en la landing — solo `isActive`, ordenados por `sortOrder`, nunca datos del módulo financiero "Bancos".
- **Depende de (archivos del proyecto):** [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [catalog-bank-output.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-dtos-catalog-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts), [public-catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-public-catalog-banks-controller-ts)

#### Clase `ListPublishedCatalogBanksUseCase` (L7–18)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs la sección "Bancos" en la landing — solo `isActive`, ordenados por `sortOrder`, nunca datos del módulo financiero "Bancos".
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_BANK_REPOSITORY) catalogBankRepository: CatalogBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–17 | — | `Promise<PublicCatalogBankOutput[]>` |

##### `ListPublishedCatalogBanksUseCase.execute`

- **Firma:** `execute(): Promise<PublicCatalogBankOutput[]>` — [list-published-catalog-banks.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/list-published-catalog-banks.use-case.ts#L14) (L14–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogBankRepository.findPublished`, `banks.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [public-catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-public-catalog-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-remove-catalog-bank-image-use-case-ts"></a>

### remove-catalog-bank-image.use-case.ts

- **Ruta:** [remove-catalog-bank-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/remove-catalog-bank-image.use-case.ts) (`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/remove-catalog-bank-image.use-case.ts`, 21 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Caso de uso: declara `RemoveCatalogBankImageUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [catalog-bank-not-found.error.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-catalog-bank-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts), [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

#### Clase `RemoveCatalogBankImageUseCase` (L6–20)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_BANK_REPOSITORY) catalogBankRepository: CatalogBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 13–19 | `id: string`, `userId: string` | `Promise<void>` |

##### `RemoveCatalogBankImageUseCase.execute`

- **Firma:** `execute(id: string, userId: string): Promise<void>` — [remove-catalog-bank-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/remove-catalog-bank-image.use-case.ts#L13) (L13–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogBankRepository.findById`, `new CatalogBankNotFoundError`, `this.catalogBankRepository.removeImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogBankNotFoundError(id)`
- **Consumidores:** [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-reorder-catalog-banks-use-case-ts"></a>

### reorder-catalog-banks.use-case.ts

- **Ruta:** [reorder-catalog-banks.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/reorder-catalog-banks.use-case.ts) (`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/reorder-catalog-banks.use-case.ts`, 23 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Caso de uso: declara `ReorderCatalogBanksUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [catalog-bank-not-found.error.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-catalog-bank-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts), [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

#### Clase `ReorderCatalogBanksUseCase` (L6–22)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_BANK_REPOSITORY) catalogBankRepository: CatalogBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 13–21 | `items: ReorderCatalogBankItem[]` | `Promise<void>` |

##### `ReorderCatalogBanksUseCase.execute`

- **Firma:** `execute(items: ReorderCatalogBankItem[]): Promise<void>` — [reorder-catalog-banks.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/reorder-catalog-banks.use-case.ts#L13) (L13–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogBankRepository.findById`, `new CatalogBankNotFoundError`, `this.catalogBankRepository.reorder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogBankNotFoundError(item.id)`
- **Consumidores:** [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-active-use-case-ts"></a>

### set-catalog-bank-active.use-case.ts

- **Ruta:** [set-catalog-bank-active.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/set-catalog-bank-active.use-case.ts) (`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/set-catalog-bank-active.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Soft — nunca DELETE físico.
- **Depende de (archivos del proyecto):** [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [catalog-bank-not-found.error.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-catalog-bank-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts), [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

#### Clase `SetCatalogBankActiveUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft — nunca DELETE físico. Un banco desactivado desaparece del catálogo público pero conserva imagen/descripción/historial en administración.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_BANK_REPOSITORY) catalogBankRepository: CatalogBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string`, `isActive: boolean`, `userId: string` | `Promise<void>` |

##### `SetCatalogBankActiveUseCase.execute`

- **Firma:** `execute(id: string, isActive: boolean, userId: string): Promise<void>` — [set-catalog-bank-active.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/set-catalog-bank-active.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogBankRepository.findById`, `new CatalogBankNotFoundError`, `this.catalogBankRepository.setActive`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogBankNotFoundError(id)`
- **Consumidores:** [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-image-use-case-ts"></a>

### set-catalog-bank-image.use-case.ts

- **Ruta:** [set-catalog-bank-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/set-catalog-bank-image.use-case.ts) (`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/set-catalog-bank-image.use-case.ts`, 33 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Caso de uso: declara `SetCatalogBankImageUseCase`, `SetCatalogBankImageInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [catalog-bank-not-found.error.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-catalog-bank-not-found-error-ts), [assert-valid-catalog-bank-image.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-utils-assert-valid-catalog-bank-image-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts), [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface SetCatalogBankImageInput` (L7): sin documentación — miembros: `catalogBankId`, `image`, `userId`

#### Clase `SetCatalogBankImageUseCase` (L13–32)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_BANK_REPOSITORY) catalogBankRepository: CatalogBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–31 | `input: SetCatalogBankImageInput` | `Promise<void>` |

##### `SetCatalogBankImageUseCase.execute`

- **Firma:** `execute(input: SetCatalogBankImageInput): Promise<void>` — [set-catalog-bank-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/set-catalog-bank-image.use-case.ts#L20) (L20–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogBankRepository.findById`, `new CatalogBankNotFoundError`, `assertValidCatalogBankImage`, `this.catalogBankRepository.setImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CatalogBankNotFoundError(input.catalogBankId)`
- **Consumidores:** [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-update-catalog-bank-use-case-ts"></a>

### update-catalog-bank.use-case.ts

- **Ruta:** [update-catalog-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/update-catalog-bank.use-case.ts) (`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/update-catalog-bank.use-case.ts`, 36 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Caso de uso: declara `UpdateCatalogBankUseCase`, `UpdateCatalogBankInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [catalog-bank-not-found.error.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-catalog-bank-not-found-error-ts), [catalog-bank-output.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-dtos-catalog-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts), [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateCatalogBankInput` (L7): sin documentación — miembros: `name`, `description`, `additionalInfo`, `userId`

#### Clase `UpdateCatalogBankUseCase` (L14–35)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATALOG_BANK_REPOSITORY) catalogBankRepository: CatalogBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 21–34 | `id: string`, `input: UpdateCatalogBankInput` | `Promise<CatalogBankOutput>` |

##### `UpdateCatalogBankUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateCatalogBankInput): Promise<CatalogBankOutput>` — [update-catalog-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/update-catalog-bank.use-case.ts#L21) (L21–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogBankRepository.findById`, `new CatalogBankNotFoundError`, `this.catalogBankRepository.update`, `input.name?.trim`, `input.description?.trim`, `input.additionalInfo?.trim`, `toCatalogBankOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.catalogBankRepository.update`
- **Errores que lanza:** `new CatalogBankNotFoundError(id)`
- **Consumidores:** [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-application-utils-assert-valid-catalog-bank-image-ts"></a>

### assert-valid-catalog-bank-image.ts

- **Ruta:** [assert-valid-catalog-bank-image.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/utils/assert-valid-catalog-bank-image.ts) (`comercial-jhoel-api/src/modules/catalog-banks/application/utils/assert-valid-catalog-bank-image.ts`, 25 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Utilidad: declara `assertValidCatalogBankImage`, `UploadedCatalogBankImage`, `MAX_CATALOG_BANK_IMAGE_SIZE_BYTES`, `ALLOWED_MIME_TYPES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [invalid-catalog-bank-image.error.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-invalid-catalog-bank-image-error-ts)
- **Consumidores:** [set-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-image-use-case-ts)

**Interfaces, tipos y enums:**

- `interface UploadedCatalogBankImage` (L8): sin documentación — miembros: `buffer`, `mimetype`, `size`

**Constantes exportadas:**

- `MAX_CATALOG_BANK_IMAGE_SIZE_BYTES` (L4): Mismo techo que el resto de imágenes del proyecto (Teléfonos, Librería/Variedades, Noticias, DPI). = `5 * 1024 * 1024`
#### Función `assertValidCatalogBankImage` (L14–24)

- **Tipo:** función exportada
- **Firma:** `assertValidCatalogBankImage(file: UploadedCatalogBankImage): void` — [assert-valid-catalog-bank-image.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/utils/assert-valid-catalog-bank-image.ts#L14)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new InvalidCatalogBankImageError`, `ALLOWED_MIME_TYPES.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidCatalogBankImageError('La imagen está vacía.')`, `new InvalidCatalogBankImageError('La imagen debe ser JPG, PNG o WEBP.')`, `new InvalidCatalogBankImageError('La imagen no puede superar los 5 MB.')`
- **Consumidores:** [set-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-image-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts"></a>

### catalog-banks.module.ts

- **Ruta:** [catalog-banks.module.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/catalog-banks.module.ts) (`comercial-jhoel-api/src/modules/catalog-banks/catalog-banks.module.ts`, 45 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** "Catálogo de Bancos" — catálogo público informativo, completamente independiente de `modules/banks/` (financiero, Cuadre de Agentes), `modules/transaction-banks/` y `modules/bank-deposits/`.
- **Depende de (archivos del proyecto):** [catalog-bank.orm-entity.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-catalog-bank-orm-entity-ts), [typeorm-catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-typeorm-catalog-bank-repository-ts), [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [create-catalog-bank.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-create-catalog-bank-use-case-ts), [update-catalog-bank.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-update-catalog-bank-use-case-ts), [list-catalog-banks.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-catalog-banks-use-case-ts), [get-catalog-bank-by-id.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-by-id-use-case-ts), [set-catalog-bank-active.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-active-use-case-ts), [reorder-catalog-banks.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-reorder-catalog-banks-use-case-ts), [set-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-image-use-case-ts), [remove-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-remove-catalog-bank-image-use-case-ts), [list-published-catalog-banks.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-published-catalog-banks-use-case-ts), [get-published-catalog-bank-by-id.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-published-catalog-bank-by-id-use-case-ts), [get-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-image-use-case-ts), [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts) y 1 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `CatalogBanksModule` (L26–44)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([CatalogBankOrmEntity])], controllers: [CatalogBanksController, PublicCatalogBanksController], providers: [ { provid`
- **Propósito:** "Catálogo de Bancos" — catálogo público informativo, completamente independiente de `modules/banks/` (financiero, Cuadre de Agentes), `modules/transaction-banks/` y `modules/bank-deposits/`. Sin producto, sin cuentas, sin saldos, sin movimientos.
<a id="f-comercial-jhoel-api-src-modules-catalog-banks-domain-entities-catalog-bank-entity-ts"></a>

### catalog-bank.entity.ts

- **Ruta:** [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts) (`comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts`, 84 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Catálogo público informativo de bancos — imagen, nombre, descripción, información adicional.
- **Consumidores:** [catalog-bank-output.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-dtos-catalog-bank-output-ts), [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [catalog-bank.mapper.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-catalog-bank-mapper-ts), [typeorm-catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-typeorm-catalog-bank-repository-ts)

**Interfaces, tipos y enums:**

- `interface CatalogBankProps` (L1): sin documentación — miembros: `id`, `name`, `description`, `additionalInfo`, `isActive`, `sortOrder`, `hasImage`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`

#### Clase `CatalogBank` (L25–83)

- **Propósito:** Catálogo público informativo de bancos — imagen, nombre, descripción, información adicional. Completamente independiente del módulo financiero "Bancos" (`modules/banks/`, saldos de Cuadre de Agentes) — esta entidad nunca referencia esa tabla ni sus datos. Mismo criterio que `NewsArticle`: contenido editorial autónomo, sin FK a otra entidad de negocio.
- **Dependencias inyectadas (constructor):** `props: CatalogBankProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 28–30 | `props: CatalogBankProps` | `CatalogBank` |
| `id` | getter public | 32–34 | — | `string` |
| `name` | getter public | 36–38 | — | `string` |
| `description` | getter public | 40–42 | — | `string \| null` |
| `additionalInfo` | getter public | 44–46 | — | `string \| null` |
| `isActive` | getter public | 48–50 | — | `boolean` |
| `sortOrder` | getter public | 52–54 | — | `number` |
| `hasImage` | getter public | 56–58 | — | `boolean` |
| `createdAt` | getter public | 60–62 | — | `Date` |
| `updatedAt` | getter public | 64–66 | — | `Date` |
| `createdBy` | getter public | 68–70 | — | `string` |
| `createdByUsername` | getter public | 72–74 | — | `string` |
| `updatedBy` | getter public | 76–78 | — | `string \| null` |
| `updatedByUsername` | getter public | 80–82 | — | `string \| null` |

##### `CatalogBank.create`

- **Firma:** `create(props: CatalogBankProps): CatalogBank` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new CatalogBank`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-bank.mapper.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-catalog-bank-mapper-ts), [typeorm-catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-typeorm-catalog-bank-repository-ts)

##### `CatalogBank.id`

- **Firma:** `id(): string` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L32) (L32–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBank.name`

- **Firma:** `name(): string` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBank.description`

- **Firma:** `description(): string \| null` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBank.additionalInfo`

- **Firma:** `additionalInfo(): string \| null` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBank.isActive`

- **Firma:** `isActive(): boolean` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBank.sortOrder`

- **Firma:** `sortOrder(): number` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBank.hasImage`

- **Firma:** `hasImage(): boolean` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBank.createdAt`

- **Firma:** `createdAt(): Date` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBank.updatedAt`

- **Firma:** `updatedAt(): Date` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBank.createdBy`

- **Firma:** `createdBy(): string` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L68) (L68–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBank.createdByUsername`

- **Firma:** `createdByUsername(): string` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L72) (L72–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBank.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L76) (L76–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBank.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [catalog-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/entities/catalog-bank.entity.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-catalog-bank-not-found-error-ts"></a>

### catalog-bank-not-found.error.ts

- **Ruta:** [catalog-bank-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/errors/catalog-bank-not-found.error.ts) (`comercial-jhoel-api/src/modules/catalog-banks/domain/errors/catalog-bank-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Errores de dominio: declara `CatalogBankNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-catalog-bank-by-id.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-by-id-use-case-ts), [remove-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-remove-catalog-bank-image-use-case-ts), [reorder-catalog-banks.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-reorder-catalog-banks-use-case-ts), [set-catalog-bank-active.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-active-use-case-ts), [set-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-image-use-case-ts), [update-catalog-bank.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-update-catalog-bank-use-case-ts)

#### Clase `CatalogBankNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-catalog-bank-not-visible-error-ts"></a>

### catalog-bank-not-visible.error.ts

- **Ruta:** [catalog-bank-not-visible.error.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/errors/catalog-bank-not-visible.error.ts) (`comercial-jhoel-api/src/modules/catalog-banks/domain/errors/catalog-bank-not-visible.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Reusado tanto para "no existe" como para "existe pero está inactivo" — un 404 público nunca revela cuál de los dos casos ocurrió.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-image-use-case-ts), [get-published-catalog-bank-by-id.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-published-catalog-bank-by-id-use-case-ts)

#### Clase `CatalogBankNotVisibleError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Reusado tanto para "no existe" como para "existe pero está inactivo" — un 404 público nunca revela cuál de los dos casos ocurrió.
<a id="f-comercial-jhoel-api-src-modules-catalog-banks-domain-errors-invalid-catalog-bank-image-error-ts"></a>

### invalid-catalog-bank-image.error.ts

- **Ruta:** [invalid-catalog-bank-image.error.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/errors/invalid-catalog-bank-image.error.ts) (`comercial-jhoel-api/src/modules/catalog-banks/domain/errors/invalid-catalog-bank-image.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Errores de dominio: declara `InvalidCatalogBankImageError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [assert-valid-catalog-bank-image.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-utils-assert-valid-catalog-bank-image-ts)

#### Clase `InvalidCatalogBankImageError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `message: string`
<a id="f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts"></a>

### catalog-bank.repository.ts

- **Ruta:** [catalog-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/repositories/catalog-bank.repository.ts) (`comercial-jhoel-api/src/modules/catalog-banks/domain/repositories/catalog-bank.repository.ts`, 47 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateCatalogBankData`, `UpdateCatalogBankData`, `ListCatalogBanksOptions`, `ReorderCatalogBankItem`, `CatalogBankImageBytes` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-bank.entity.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-entities-catalog-bank-entity-ts)
- **Consumidores:** [create-catalog-bank.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-create-catalog-bank-use-case-ts), [get-catalog-bank-by-id.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-by-id-use-case-ts), [get-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-image-use-case-ts), [get-published-catalog-bank-by-id.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-published-catalog-bank-by-id-use-case-ts), [list-catalog-banks.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-catalog-banks-use-case-ts), [list-published-catalog-banks.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-published-catalog-banks-use-case-ts), [remove-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-remove-catalog-bank-image-use-case-ts), [reorder-catalog-banks.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-reorder-catalog-banks-use-case-ts), [set-catalog-bank-active.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-active-use-case-ts), [set-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-image-use-case-ts), [update-catalog-bank.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-update-catalog-bank-use-case-ts), [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts), [typeorm-catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-typeorm-catalog-bank-repository-ts)

**Interfaces, tipos y enums:**

- `interface CreateCatalogBankData` (L5): sin documentación — miembros: `name`, `description`, `additionalInfo`, `createdBy`
- `interface UpdateCatalogBankData` (L12): sin documentación — miembros: `name`, `description`, `additionalInfo`, `updatedBy`
- `interface ListCatalogBanksOptions` (L19): sin documentación — miembros: `includeInactive`, `search`
- `interface ReorderCatalogBankItem` (L24): sin documentación — miembros: `id`, `sortOrder`
- `interface CatalogBankImageBytes` (L29): sin documentación — miembros: `data`, `mimeType`
- `interface CatalogBankRepository` (L34): sin documentación — miembros: `findAll`, `findById`, `findPublished`, `create`, `update`, `setActive`, `reorder`, `setImage`, `removeImage`, `getImage`

**Constantes exportadas:**

- `CATALOG_BANK_REPOSITORY` (L3) = `Symbol('CATALOG_BANK_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-catalog-bank-mapper-ts"></a>

### catalog-bank.mapper.ts

- **Ruta:** [catalog-bank.mapper.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/catalog-bank.mapper.ts) (`comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/catalog-bank.mapper.ts`, 23 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Mapper: declara `CatalogBankMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-bank.entity.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-entities-catalog-bank-entity-ts), [catalog-bank.orm-entity.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-catalog-bank-orm-entity-ts)
- **Consumidores:** [typeorm-catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-typeorm-catalog-bank-repository-ts)

#### Clase `CatalogBankMapper` (L4–22)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–21 | `orm: CatalogBankOrmEntity` | `CatalogBank` |

##### `CatalogBankMapper.toDomain`

- **Firma:** `toDomain(orm: CatalogBankOrmEntity): CatalogBank` — [catalog-bank.mapper.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/catalog-bank.mapper.ts#L5) (L5–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `CatalogBank.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-typeorm-catalog-bank-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-catalog-bank-orm-entity-ts"></a>

### catalog-bank.orm-entity.ts

- **Ruta:** [catalog-bank.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/catalog-bank.orm-entity.ts) (`comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/catalog-bank.orm-entity.ts`, 62 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** `imageData` usa `select: false` — mismo patrón que Teléfonos/Librería/Variedades/Noticias: nunca viaja en un listado normal, solo `getImage()` la selecciona explícitamente.
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts), [catalog-bank.mapper.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-catalog-bank-mapper-ts), [typeorm-catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-typeorm-catalog-bank-repository-ts)

#### Clase `CatalogBankOrmEntity` (L13–61)

- **Decoradores:** `@Entity('catalog_banks')`
- **Propósito:** `imageData` usa `select: false` — mismo patrón que Teléfonos/Librería/Variedades/Noticias: nunca viaja en un listado normal, solo `getImage()` la selecciona explícitamente.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column description: string \| null`, `@Column additionalInfo: string \| null`, `@Column isActive: boolean`, `@Column sortOrder: number`, `@Column imageData: Buffer \| null`, `@Column imageMimeType: string \| null`, `@Column imageSizeBytes: number \| null`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-typeorm-catalog-bank-repository-ts"></a>

### typeorm-catalog-bank.repository.ts

- **Ruta:** [typeorm-catalog-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts) (`comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts`, 130 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmCatalogBankRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog-bank.entity.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-entities-catalog-bank-entity-ts), [catalog-bank.repository.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-domain-repositories-catalog-bank-repository-ts), [catalog-bank.orm-entity.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-catalog-bank-orm-entity-ts), [catalog-bank.mapper.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-infrastructure-persistence-catalog-bank-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts)

#### Clase `TypeOrmCatalogBankRepository` (L16–129)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements CatalogBankRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(CatalogBankOrmEntity) repository: Repository<CatalogBankOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `baseQuery` | método private | 23–28 | — | `SelectQueryBuilder<CatalogBankOrmEntity>` |
| `findAll` | método public async | 30–41 | `options?: ListCatalogBanksOptions` | `Promise<CatalogBank[]>` |
| `findById` | método public async | 43–46 | `id: string` | `Promise<CatalogBank \| null>` |
| `findPublished` | método public async | 48–51 | — | `Promise<CatalogBank[]>` |
| `create` | método public async | 53–64 | `data: CreateCatalogBankData` | `Promise<CatalogBank>` |
| `update` | método public async | 66–81 | `id: string`, `data: UpdateCatalogBankData` | `Promise<CatalogBank>` |
| `setActive` | método public async | 83–85 | `id: string`, `isActive: boolean`, `updatedBy: string` | `Promise<void>` |
| `reorder` | método public async | 87–93 | `items: ReorderCatalogBankItem[]` | `Promise<void>` |
| `setImage` | método public async | 95–109 | `id: string`, `image: { data: Buffer; mimeType: string; sizeBytes: number }`, `updatedBy: string` | `Promise<void>` |
| `removeImage` | método public async | 111–116 | `id: string`, `updatedBy: string` | `Promise<void>` |
| `getImage` | método public async | 118–128 | `id: string` | `Promise<CatalogBankImageBytes \| null>` |

##### `TypeOrmCatalogBankRepository.baseQuery`

- **Firma:** `baseQuery(): SelectQueryBuilder<CatalogBankOrmEntity>` — [typeorm-catalog-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts#L23) (L23–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('b').leftJoinAndSelect`, `this.repository.createQueryBuilder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmCatalogBankRepository.findAll`

- **Firma:** `findAll(options?: ListCatalogBanksOptions): Promise<CatalogBank[]>` — [typeorm-catalog-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts#L30) (L30–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery`, `query.andWhere`, `query.orderBy('b.sortOrder', 'ASC').addOrderBy`, `query.orderBy`, `query.getMany`, `orms.map`, `CatalogBankMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogBankRepository.findById`

- **Firma:** `findById(id: string): Promise<CatalogBank \| null>` — [typeorm-catalog-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts#L43) (L43–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('b.id = :id', { id }).getOne`, `this.baseQuery().andWhere`, `this.baseQuery`, `CatalogBankMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmCatalogBankRepository.findPublished`

- **Firma:** `findPublished(): Promise<CatalogBank[]>` — [typeorm-catalog-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts#L48) (L48–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('b.isActive = true').orderBy('b.sortOrder', 'ASC').getMany`, `this.baseQuery().andWhere('b.isActive = true').orderBy`, `this.baseQuery().andWhere`, `this.baseQuery`, `orms.map`, `CatalogBankMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogBankRepository.create`

- **Firma:** `create(data: CreateCatalogBankData): Promise<CatalogBank>` — [typeorm-catalog-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts#L53) (L53–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.findById`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogBankRepository.update`

- **Firma:** `update(id: string, data: UpdateCatalogBankData): Promise<CatalogBank>` — [typeorm-catalog-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts#L66) (L66–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.findById`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogBankRepository.setActive`

- **Firma:** `setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>` — [typeorm-catalog-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogBankRepository.reorder`

- **Firma:** `reorder(items: ReorderCatalogBankItem[]): Promise<void>` — [typeorm-catalog-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts#L87) (L87–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.transaction`, `manager.update`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogBankRepository.setImage`

- **Firma:** `setImage(id: string, image: { data: Buffer; mimeType: string; sizeBytes: number }, updatedBy: string): Promise<void>` — [typeorm-catalog-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts#L95) (L95–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogBankRepository.removeImage`

- **Firma:** `removeImage(id: string, updatedBy: string): Promise<void>` — [typeorm-catalog-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts#L111) (L111–116)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCatalogBankRepository.getImage`

- **Firma:** `getImage(id: string): Promise<CatalogBankImageBytes \| null>` — [typeorm-catalog-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts#L118) (L118–128)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('b').select`, `this.repository.createQueryBuilder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts"></a>

### catalog-banks.controller.ts

- **Ruta:** [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts) (`comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts`, 151 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Admin-only end to end — "Sistema → Catálogo de Bancos".
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-catalog-bank.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-create-catalog-bank-use-case-ts), [update-catalog-bank.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-update-catalog-bank-use-case-ts), [list-catalog-banks.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-catalog-banks-use-case-ts), [get-catalog-bank-by-id.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-by-id-use-case-ts), [set-catalog-bank-active.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-active-use-case-ts), [reorder-catalog-banks.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-reorder-catalog-banks-use-case-ts), [set-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-set-catalog-bank-image-use-case-ts), [remove-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-remove-catalog-bank-image-use-case-ts), [create-catalog-bank.request.dto.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-create-catalog-bank-request-dto-ts), [update-catalog-bank.request.dto.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-update-catalog-bank-request-dto-ts), [list-catalog-banks.query.dto.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-list-catalog-banks-query-dto-ts) y 2 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/platform-express`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts)

**Interfaces, tipos y enums:**

- `interface UploadedImageFile` (L36): sin documentación — miembros: `buffer`, `mimetype`, `size`

#### Clase `CatalogBanksController` (L47–150)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('catalog-banks')`
- **Propósito:** Admin-only end to end — "Sistema → Catálogo de Bancos". Completamente independiente del `BanksController` financiero (`/banks`, Cuadre de Agentes) — este controller nunca lee ni escribe esa tabla.
- **Dependencias inyectadas (constructor):** `createCatalogBankUseCase: CreateCatalogBankUseCase`, `updateCatalogBankUseCase: UpdateCatalogBankUseCase`, `listCatalogBanksUseCase: ListCatalogBanksUseCase`, `getCatalogBankByIdUseCase: GetCatalogBankByIdUseCase`, `setCatalogBankActiveUseCase: SetCatalogBankActiveUseCase`, `reorderCatalogBanksUseCase: ReorderCatalogBanksUseCase`, `setCatalogBankImageUseCase: SetCatalogBankImageUseCase`, `removeCatalogBankImageUseCase: RemoveCatalogBankImageUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 62–74 | `dto: CreateCatalogBankRequestDto`, `userId: string` | `Promise<CatalogBankResponseDto>` |
| `findAll` | método public | 76–82 | `query: ListCatalogBanksQueryDto` | `Promise<CatalogBankResponseDto[]>` |
| `findOne` | método public | 84–87 | `id: string` | `Promise<CatalogBankResponseDto>` |
| `update` | método public | 89–101 | `id: string`, `dto: UpdateCatalogBankRequestDto`, `userId: string` | `Promise<CatalogBankResponseDto>` |
| `activate` | método public | 103–110 | `id: string`, `userId: string` | `Promise<void>` |
| `deactivate` | método public | 112–119 | `id: string`, `userId: string` | `Promise<void>` |
| `reorder` | método public | 121–125 | `dto: ReorderCatalogBanksRequestDto` | `Promise<void>` |
| `setImage` | método public | 127–140 | `catalogBankId: string`, `image: UploadedImageFile`, `userId: string` | `Promise<void>` |
| `removeImage` | método public | 142–149 | `id: string`, `userId: string` | `Promise<void>` |

##### `CatalogBanksController.create`

- **Firma:** `create(dto: CreateCatalogBankRequestDto, userId: string): Promise<CatalogBankResponseDto>` — [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L62) (L62–74)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createCatalogBankUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBanksController.findAll`

- **Firma:** `findAll(query: ListCatalogBanksQueryDto): Promise<CatalogBankResponseDto[]>` — [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L76) (L76–82)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listCatalogBanksUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBanksController.findOne`

- **Firma:** `findOne(id: string): Promise<CatalogBankResponseDto>` — [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L84) (L84–87)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getCatalogBankByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBanksController.update`

- **Firma:** `update(id: string, dto: UpdateCatalogBankRequestDto, userId: string): Promise<CatalogBankResponseDto>` — [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L89) (L89–101)
- **Decoradores:** `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateCatalogBankUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBanksController.activate`

- **Firma:** `activate(id: string, userId: string): Promise<void>` — [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L103) (L103–110)
- **Decoradores:** `@Post(':id/activate')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setCatalogBankActiveUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBanksController.deactivate`

- **Firma:** `deactivate(id: string, userId: string): Promise<void>` — [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L112) (L112–119)
- **Decoradores:** `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setCatalogBankActiveUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBanksController.reorder`

- **Firma:** `reorder(dto: ReorderCatalogBanksRequestDto): Promise<void>` — [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L121) (L121–125)
- **Decoradores:** `@Post('reorder')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.reorderCatalogBanksUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBanksController.setImage`

- **Firma:** `setImage(catalogBankId: string, image: UploadedImageFile, userId: string): Promise<void>` — [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L127) (L127–140)
- **Decoradores:** `@Post(':id/image')` `@UseInterceptors(FileInterceptor('image'))` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) catalogBankId`, `@UploadedFile() image`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setCatalogBankImageUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogBanksController.removeImage`

- **Firma:** `removeImage(id: string, userId: string): Promise<void>` — [catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts#L142) (L142–149)
- **Decoradores:** `@Delete(':id/image')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.removeCatalogBankImageUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-public-catalog-banks-controller-ts"></a>

### public-catalog-banks.controller.ts

- **Ruta:** [public-catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/public-catalog-banks.controller.ts) (`comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/public-catalog-banks.controller.ts`, 45 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Público, sin guard — backs la sección "Bancos" de la landing.
- **Depende de (archivos del proyecto):** [list-published-catalog-banks.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-list-published-catalog-banks-use-case-ts), [get-published-catalog-bank-by-id.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-published-catalog-bank-by-id-use-case-ts), [get-catalog-bank-image.use-case.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-application-use-cases-get-catalog-bank-image-use-case-ts), [public-catalog-bank.response.dto.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-public-catalog-bank-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [catalog-banks.module.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-catalog-banks-module-ts)

#### Clase `PublicCatalogBanksController` (L15–44)

- **Decoradores:** `@Controller('public-catalog-banks')`
- **Propósito:** Público, sin guard — backs la sección "Bancos" de la landing. Mismo header `Cross-Origin-Resource-Policy: cross-origin` que Teléfonos/ Librería/Variedades/Noticias para que `&lt;img&gt;` cargue entre orígenes. Esta misma URL de imagen también la usa el admin para sus miniaturas/ vista previa — no hace falta una ruta de imagen separada.
- **Dependencias inyectadas (constructor):** `listPublishedCatalogBanksUseCase: ListPublishedCatalogBanksUseCase`, `getPublishedCatalogBankByIdUseCase: GetPublishedCatalogBankByIdUseCase`, `getCatalogBankImageUseCase: GetCatalogBankImageUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 23–26 | — | `Promise<PublicCatalogBankResponseDto[]>` |
| `getImage` | método public async | 28–38 | `id: string`, `res: Response` | `Promise<void>` |
| `findOne` | método public | 40–43 | `id: string` | `Promise<PublicCatalogBankResponseDto>` |

##### `PublicCatalogBanksController.findAll`

- **Firma:** `findAll(): Promise<PublicCatalogBankResponseDto[]>` — [public-catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/public-catalog-banks.controller.ts#L23) (L23–26)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.listPublishedCatalogBanksUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicCatalogBanksController.getImage`

- **Firma:** `getImage(id: string, res: Response): Promise<void>` — [public-catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/public-catalog-banks.controller.ts#L28) (L28–38)
- **Decoradores:** `@Get('images/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.getCatalogBankImageUseCase.execute`, `res.set`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicCatalogBanksController.findOne`

- **Firma:** `findOne(id: string): Promise<PublicCatalogBankResponseDto>` — [public-catalog-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/public-catalog-banks.controller.ts#L40) (L40–43)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getPublishedCatalogBankByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-catalog-bank-response-dto-ts"></a>

### catalog-bank.response.dto.ts

- **Ruta:** [catalog-bank.response.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/dtos/catalog-bank.response.dto.ts) (`comercial-jhoel-api/src/modules/catalog-banks/presentation/dtos/catalog-bank.response.dto.ts`, 16 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** DTO de respuesta: declara `CatalogBankResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

#### Clase `CatalogBankResponseDto` (L1–15)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-create-catalog-bank-request-dto-ts"></a>

### create-catalog-bank.request.dto.ts

- **Ruta:** [create-catalog-bank.request.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/dtos/create-catalog-bank.request.dto.ts) (`comercial-jhoel-api/src/modules/catalog-banks/presentation/dtos/create-catalog-bank.request.dto.ts`, 17 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** DTO de entrada: declara `CreateCatalogBankRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

#### Clase `CreateCatalogBankRequestDto` (L3–16)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-list-catalog-banks-query-dto-ts"></a>

### list-catalog-banks.query.dto.ts

- **Ruta:** [list-catalog-banks.query.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/dtos/list-catalog-banks.query.dto.ts) (`comercial-jhoel-api/src/modules/catalog-banks/presentation/dtos/list-catalog-banks.query.dto.ts`, 14 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** DTO de consulta: declara `ListCatalogBanksQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

#### Clase `ListCatalogBanksQueryDto` (L4–13)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-public-catalog-bank-response-dto-ts"></a>

### public-catalog-bank.response.dto.ts

- **Ruta:** [public-catalog-bank.response.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/dtos/public-catalog-bank.response.dto.ts) (`comercial-jhoel-api/src/modules/catalog-banks/presentation/dtos/public-catalog-bank.response.dto.ts`, 9 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** Backs "Bancos" en la landing — sin isActive/audit/orden, solo lo que un visitante puede ver.
- **Descripción del autor (comentario del archivo):** Backs "Bancos" en la landing — sin isActive/audit/orden, solo lo que un visitante puede ver. Nunca datos del módulo financiero "Bancos".
- **Consumidores:** [public-catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-public-catalog-banks-controller-ts)

#### Clase `PublicCatalogBankResponseDto` (L2–8)

- **Propósito:** Backs "Bancos" en la landing — sin isActive/audit/orden, solo lo que un visitante puede ver. Nunca datos del módulo financiero "Bancos".
<a id="f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-reorder-catalog-banks-request-dto-ts"></a>

### reorder-catalog-banks.request.dto.ts

- **Ruta:** [reorder-catalog-banks.request.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/dtos/reorder-catalog-banks.request.dto.ts) (`comercial-jhoel-api/src/modules/catalog-banks/presentation/dtos/reorder-catalog-banks.request.dto.ts`, 19 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** DTO de entrada: declara `ReorderCatalogBankItemDto`, `ReorderCatalogBanksRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

#### Clase `ReorderCatalogBankItemDto` (L4–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ReorderCatalogBanksRequestDto` (L12–18)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-catalog-banks-presentation-dtos-update-catalog-bank-request-dto-ts"></a>

### update-catalog-bank.request.dto.ts

- **Ruta:** [update-catalog-bank.request.dto.ts](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/dtos/update-catalog-bank.request.dto.ts) (`comercial-jhoel-api/src/modules/catalog-banks/presentation/dtos/update-catalog-bank.request.dto.ts`, 18 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `catalog-banks`
- **Responsabilidad:** DTO de entrada: declara `UpdateCatalogBankRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [catalog-banks.controller.ts](catalog-banks.md#f-comercial-jhoel-api-src-modules-catalog-banks-presentation-controllers-catalog-banks-controller-ts)

#### Clase `UpdateCatalogBankRequestDto` (L3–17)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
