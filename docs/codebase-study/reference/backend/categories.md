# Módulo backend `categories`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/categories` | [categories.controller.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts#L54) `CategoriesController.create` | [CreateCategoryUseCase](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-create-category-use-case-ts) | `CategoryRepository`.findByName/create | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CategoryService.createCategory` |
| `GET /api/categories` | [categories.controller.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts#L62) `CategoriesController.findAll` | [ListCategoriesUseCase](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-list-categories-use-case-ts) | `CategoryRepository`.findAll | UseGuards(JwtAuthGuard) | `CategoryService.getCategories` |
| `GET /api/categories/:id` | [categories.controller.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts#L71) `CategoriesController.findOne` | [GetCategoryByIdUseCase](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-get-category-by-id-use-case-ts) | `CategoryRepository`.findById | UseGuards(JwtAuthGuard) | `CategoryService.getCategoryById` |
| `PATCH /api/categories/:id` | [categories.controller.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts#L78) `CategoriesController.update` | [UpdateCategoryUseCase](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-update-category-use-case-ts) | `CategoryRepository`.findById/findByName/update | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CategoryService.updateCategory` |
| `DELETE /api/categories/:id` | [categories.controller.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts#L88) `CategoriesController.deactivate` | [DeactivateCategoryUseCase](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-deactivate-category-use-case-ts) | `CategoryRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CategoryService.deleteCategory` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [category-output.ts](#f-comercial-jhoel-api-src-modules-categories-application-dtos-category-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Plain, serializable shape use cases return — never the domain entity itself. | 1 internas | 4 | Media (4 consumidores) |
| [create-category.use-case.ts](#f-comercial-jhoel-api-src-modules-categories-application-use-cases-create-category-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateCategoryUseCase`, `CreateCategoryInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-category.use-case.ts](#f-comercial-jhoel-api-src-modules-categories-application-use-cases-deactivate-category-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — a category is never physically removed. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-category-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-categories-application-use-cases-get-category-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetCategoryByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-categories.use-case.ts](#f-comercial-jhoel-api-src-modules-categories-application-use-cases-list-categories-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListCategoriesUseCase`, `ListCategoriesInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-category.use-case.ts](#f-comercial-jhoel-api-src-modules-categories-application-use-cases-update-category-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateCategoryUseCase`, `UpdateCategoryInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [categories.module.ts](#f-comercial-jhoel-api-src-modules-categories-categories-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `CategoriesModule` (sin comentario de documentación en el código). | 9 internas; ext.: @nestjs/common, @nestjs/typeorm | 3 | Media (3 consumidores) |
| [category.entity.ts](#f-comercial-jhoel-api-src-modules-categories-domain-entities-category-entity-ts) | .ts | Entidad de dominio | Dominio | Entidad de dominio: declara `Category`, `CategoryProps` (sin comentario de documentación en el código). | 0 internas | 4 | Media (4 consumidores) |
| [category-name-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-categories-domain-errors-category-name-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `CategoryNameAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [category-not-found.error.ts](#f-comercial-jhoel-api-src-modules-categories-domain-errors-category-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `CategoryNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [category.repository.ts](#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateCategoryData`, `UpdateCategoryData`, `CategoryRepository`, `CATEGORY_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 13 | Alta (13 consumidores) |
| [category.mapper.ts](#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-category-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `CategoryMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [category.orm-entity.ts](#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-category-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `CategoryOrmEntity` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [typeorm-category.repository.ts](#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-typeorm-category-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmCategoryRepository` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [categories.controller.ts](#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts) | .ts | Controlador | Presentación | The canonical shape every simple reference-table module in this app follows (`businesses`, `suppliers`, `clients`, `account-types` are all near-identical clones of this exact controller) — flat CRUD over one table, `name` globally unique, soft delete only (`isActive = false`, no row is ever physically removed so nothing that already references it dangles). | 12 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [category.response.dto.ts](#f-comercial-jhoel-api-src-modules-categories-presentation-dtos-category-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `CategoryResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [create-category.request.dto.ts](#f-comercial-jhoel-api-src-modules-categories-presentation-dtos-create-category-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateCategoryRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-categories.query.dto.ts](#f-comercial-jhoel-api-src-modules-categories-presentation-dtos-list-categories-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListCategoriesQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [update-category.request.dto.ts](#f-comercial-jhoel-api-src-modules-categories-presentation-dtos-update-category-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateCategoryRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-categories-application-dtos-category-output-ts"></a>

### category-output.ts

- **Ruta:** [category-output.ts](../../../../comercial-jhoel-api/src/modules/categories/application/dtos/category-output.ts) (`comercial-jhoel-api/src/modules/categories/application/dtos/category-output.ts`, 23 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Plain, serializable shape use cases return — never the domain entity itself.
- **Depende de (archivos del proyecto):** [category.entity.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-entities-category-entity-ts)
- **Consumidores:** [create-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-create-category-use-case-ts), [get-category-by-id.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-get-category-by-id-use-case-ts), [list-categories.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-list-categories-use-case-ts), [update-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-update-category-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CategoryOutput` (L4): Plain, serializable shape use cases return — never the domain entity itself. — miembros: `id`, `name`, `description`, `isActive`, `createdAt`, `updatedAt`
#### Función `toCategoryOutput` (L13–22)

- **Tipo:** función exportada
- **Firma:** `toCategoryOutput(category: Category): CategoryOutput` — [category-output.ts](../../../../comercial-jhoel-api/src/modules/categories/application/dtos/category-output.ts#L13)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-create-category-use-case-ts), [get-category-by-id.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-get-category-by-id-use-case-ts), [update-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-update-category-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-categories-application-use-cases-create-category-use-case-ts"></a>

### create-category.use-case.ts

- **Ruta:** [create-category.use-case.ts](../../../../comercial-jhoel-api/src/modules/categories/application/use-cases/create-category.use-case.ts) (`comercial-jhoel-api/src/modules/categories/application/use-cases/create-category.use-case.ts`, 38 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Caso de uso: declara `CreateCategoryUseCase`, `CreateCategoryInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [category-name-already-exists.error.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-errors-category-name-already-exists-error-ts), [category-output.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-dtos-category-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [categories.module.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-categories-module-ts), [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateCategoryInput` (L7): sin documentación — miembros: `name`, `description`

#### Clase `CreateCategoryUseCase` (L12–37)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATEGORY_REPOSITORY) categoryRepository: CategoryRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–36 | `input: CreateCategoryInput` | `Promise<CategoryOutput>` |

##### `CreateCategoryUseCase.execute`

- **Firma:** `execute(input: CreateCategoryInput): Promise<CategoryOutput>` — [create-category.use-case.ts](../../../../comercial-jhoel-api/src/modules/categories/application/use-cases/create-category.use-case.ts#L19) (L19–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.name.trim().replace`, `input.name.trim`, `this.categoryRepository.findByName`, `new CategoryNameAlreadyExistsError`, `this.categoryRepository.create`, `input.description?.trim`, `toCategoryOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CategoryNameAlreadyExistsError(name)`
- **Consumidores:** [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-categories-application-use-cases-deactivate-category-use-case-ts"></a>

### deactivate-category.use-case.ts

- **Ruta:** [deactivate-category.use-case.ts](../../../../comercial-jhoel-api/src/modules/categories/application/use-cases/deactivate-category.use-case.ts) (`comercial-jhoel-api/src/modules/categories/application/use-cases/deactivate-category.use-case.ts`, 27 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Soft delete only — a category is never physically removed.
- **Depende de (archivos del proyecto):** [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [category-not-found.error.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-errors-category-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [categories.module.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-categories-module-ts), [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

#### Clase `DeactivateCategoryUseCase` (L12–26)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — a category is never physically removed. Deactivating it doesn't touch products that reference it (referential integrity is never at risk); it just drops out of `findAll({ activeOnly: true })`, the same pattern products use.
- **Dependencias inyectadas (constructor):** `@Inject(CATEGORY_REPOSITORY) categoryRepository: CategoryRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–25 | `id: string` | `Promise<void>` |

##### `DeactivateCategoryUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-category.use-case.ts](../../../../comercial-jhoel-api/src/modules/categories/application/use-cases/deactivate-category.use-case.ts#L19) (L19–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.categoryRepository.findById`, `new CategoryNotFoundError`, `this.categoryRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CategoryNotFoundError(id)`
- **Consumidores:** [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-categories-application-use-cases-get-category-by-id-use-case-ts"></a>

### get-category-by-id.use-case.ts

- **Ruta:** [get-category-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/categories/application/use-cases/get-category-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/categories/application/use-cases/get-category-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Caso de uso: declara `GetCategoryByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [category-not-found.error.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-errors-category-not-found-error-ts), [category-output.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-dtos-category-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [categories.module.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-categories-module-ts), [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

#### Clase `GetCategoryByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATEGORY_REPOSITORY) categoryRepository: CategoryRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<CategoryOutput>` |

##### `GetCategoryByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<CategoryOutput>` — [get-category-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/categories/application/use-cases/get-category-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.categoryRepository.findById`, `new CategoryNotFoundError`, `toCategoryOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new CategoryNotFoundError(id)`
- **Consumidores:** [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-categories-application-use-cases-list-categories-use-case-ts"></a>

### list-categories.use-case.ts

- **Ruta:** [list-categories.use-case.ts](../../../../comercial-jhoel-api/src/modules/categories/application/use-cases/list-categories.use-case.ts) (`comercial-jhoel-api/src/modules/categories/application/use-cases/list-categories.use-case.ts`, 24 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Caso de uso: declara `ListCategoriesUseCase`, `ListCategoriesInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [category-output.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-dtos-category-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [categories.module.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-categories-module-ts), [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListCategoriesInput` (L6): sin documentación — miembros: `activeOnly`

#### Clase `ListCategoriesUseCase` (L10–23)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATEGORY_REPOSITORY) categoryRepository: CategoryRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–22 | `input?: ListCategoriesInput` | `Promise<CategoryOutput[]>` |

##### `ListCategoriesUseCase.execute`

- **Firma:** `execute(input?: ListCategoriesInput): Promise<CategoryOutput[]>` — [list-categories.use-case.ts](../../../../comercial-jhoel-api/src/modules/categories/application/use-cases/list-categories.use-case.ts#L17) (L17–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.categoryRepository.findAll`, `categories.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-categories-application-use-cases-update-category-use-case-ts"></a>

### update-category.use-case.ts

- **Ruta:** [update-category.use-case.ts](../../../../comercial-jhoel-api/src/modules/categories/application/use-cases/update-category.use-case.ts) (`comercial-jhoel-api/src/modules/categories/application/use-cases/update-category.use-case.ts`, 49 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Caso de uso: declara `UpdateCategoryUseCase`, `UpdateCategoryInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [category-not-found.error.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-errors-category-not-found-error-ts), [category-name-already-exists.error.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-errors-category-name-already-exists-error-ts), [category-output.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-dtos-category-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [categories.module.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-categories-module-ts), [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateCategoryInput` (L8): sin documentación — miembros: `name`, `description`

#### Clase `UpdateCategoryUseCase` (L13–48)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CATEGORY_REPOSITORY) categoryRepository: CategoryRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–47 | `id: string`, `input: UpdateCategoryInput` | `Promise<CategoryOutput>` |

##### `UpdateCategoryUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateCategoryInput): Promise<CategoryOutput>` — [update-category.use-case.ts](../../../../comercial-jhoel-api/src/modules/categories/application/use-cases/update-category.use-case.ts#L20) (L20–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.categoryRepository.findById`, `new CategoryNotFoundError`, `input.name?.trim().replace`, `input.name?.trim`, `this.categoryRepository.findByName`, `new CategoryNameAlreadyExistsError`, `this.categoryRepository.update`, `input.description?.trim`, `toCategoryOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.categoryRepository.update`
- **Errores que lanza:** `new CategoryNotFoundError(id)`, `new CategoryNameAlreadyExistsError(name)`
- **Consumidores:** [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-categories-categories-module-ts"></a>

### categories.module.ts

- **Ruta:** [categories.module.ts](../../../../comercial-jhoel-api/src/modules/categories/categories.module.ts) (`comercial-jhoel-api/src/modules/categories/categories.module.ts`, 27 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Módulo: declara `CategoriesModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [category.orm-entity.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-category-orm-entity-ts), [typeorm-category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-typeorm-category-repository-ts), [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [create-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-create-category-use-case-ts), [list-categories.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-list-categories-use-case-ts), [get-category-by-id.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-get-category-by-id-use-case-ts), [update-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-update-category-use-case-ts), [deactivate-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-deactivate-category-use-case-ts), [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `CategoriesModule` (L13–26)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([CategoryOrmEntity])], controllers: [CategoriesController], providers: [ { provide: CATEGORY_REPOSITORY, useClass: T`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-categories-domain-entities-category-entity-ts"></a>

### category.entity.ts

- **Ruta:** [category.entity.ts](../../../../comercial-jhoel-api/src/modules/categories/domain/entities/category.entity.ts) (`comercial-jhoel-api/src/modules/categories/domain/entities/category.entity.ts`, 41 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Entidad de dominio: declara `Category`, `CategoryProps` (sin comentario de documentación en el código).
- **Consumidores:** [category-output.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-dtos-category-output-ts), [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [category.mapper.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-category-mapper-ts), [typeorm-category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-typeorm-category-repository-ts)

**Interfaces, tipos y enums:**

- `interface CategoryProps` (L1): sin documentación — miembros: `id`, `name`, `description`, `isActive`, `createdAt`, `updatedAt`

#### Clase `Category` (L10–40)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: CategoryProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 13–15 | `props: CategoryProps` | `Category` |
| `id` | getter public | 17–19 | — | `string` |
| `name` | getter public | 21–23 | — | `string` |
| `description` | getter public | 25–27 | — | `string \| null` |
| `isActive` | getter public | 29–31 | — | `boolean` |
| `createdAt` | getter public | 33–35 | — | `Date` |
| `updatedAt` | getter public | 37–39 | — | `Date` |

##### `Category.create`

- **Firma:** `create(props: CategoryProps): Category` — [category.entity.ts](../../../../comercial-jhoel-api/src/modules/categories/domain/entities/category.entity.ts#L13) (L13–15)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Category`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [category.mapper.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-category-mapper-ts), [typeorm-category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-typeorm-category-repository-ts)

##### `Category.id`

- **Firma:** `id(): string` — [category.entity.ts](../../../../comercial-jhoel-api/src/modules/categories/domain/entities/category.entity.ts#L17) (L17–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Category.name`

- **Firma:** `name(): string` — [category.entity.ts](../../../../comercial-jhoel-api/src/modules/categories/domain/entities/category.entity.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Category.description`

- **Firma:** `description(): string \| null` — [category.entity.ts](../../../../comercial-jhoel-api/src/modules/categories/domain/entities/category.entity.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Category.isActive`

- **Firma:** `isActive(): boolean` — [category.entity.ts](../../../../comercial-jhoel-api/src/modules/categories/domain/entities/category.entity.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Category.createdAt`

- **Firma:** `createdAt(): Date` — [category.entity.ts](../../../../comercial-jhoel-api/src/modules/categories/domain/entities/category.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Category.updatedAt`

- **Firma:** `updatedAt(): Date` — [category.entity.ts](../../../../comercial-jhoel-api/src/modules/categories/domain/entities/category.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-categories-domain-errors-category-name-already-exists-error-ts"></a>

### category-name-already-exists.error.ts

- **Ruta:** [category-name-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/categories/domain/errors/category-name-already-exists.error.ts) (`comercial-jhoel-api/src/modules/categories/domain/errors/category-name-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Errores de dominio: declara `CategoryNameAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-create-category-use-case-ts), [update-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-update-category-use-case-ts), [typeorm-category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-typeorm-category-repository-ts)

#### Clase `CategoryNameAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `name: string`
<a id="f-comercial-jhoel-api-src-modules-categories-domain-errors-category-not-found-error-ts"></a>

### category-not-found.error.ts

- **Ruta:** [category-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/categories/domain/errors/category-not-found.error.ts) (`comercial-jhoel-api/src/modules/categories/domain/errors/category-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Errores de dominio: declara `CategoryNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-deactivate-category-use-case-ts), [get-category-by-id.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-get-category-by-id-use-case-ts), [update-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-update-category-use-case-ts)

#### Clase `CategoryNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts"></a>

### category.repository.ts

- **Ruta:** [category.repository.ts](../../../../comercial-jhoel-api/src/modules/categories/domain/repositories/category.repository.ts) (`comercial-jhoel-api/src/modules/categories/domain/repositories/category.repository.ts`, 25 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateCategoryData`, `UpdateCategoryData`, `CategoryRepository`, `CATEGORY_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [category.entity.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-entities-category-entity-ts)
- **Consumidores:** [create-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-create-category-use-case-ts), [deactivate-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-deactivate-category-use-case-ts), [get-category-by-id.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-get-category-by-id-use-case-ts), [list-categories.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-list-categories-use-case-ts), [update-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-update-category-use-case-ts), [categories.module.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-categories-module-ts), [typeorm-category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-typeorm-category-repository-ts), [create-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-create-product-use-case-ts), [export-products-pdf.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-pdf-use-case-ts), [import-products-from-excel.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-import-products-from-excel-use-case-ts), [update-product.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-update-product-use-case-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CreateCategoryData` (L5): sin documentación — miembros: `name`, `description`
- `interface UpdateCategoryData` (L10): sin documentación — miembros: `name`, `description`
- `interface CategoryRepository` (L15): sin documentación — miembros: `findAll`, `findById`, `findByName`, `findByActiveName`, `create`, `update`, `deactivate`

**Constantes exportadas:**

- `CATEGORY_REPOSITORY` (L3) = `Symbol('CATEGORY_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-category-mapper-ts"></a>

### category.mapper.ts

- **Ruta:** [category.mapper.ts](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/category.mapper.ts) (`comercial-jhoel-api/src/modules/categories/infrastructure/persistence/category.mapper.ts`, 16 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Mapper: declara `CategoryMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [category.entity.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-entities-category-entity-ts), [category.orm-entity.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-category-orm-entity-ts)
- **Consumidores:** [typeorm-category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-typeorm-category-repository-ts)

#### Clase `CategoryMapper` (L4–15)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–14 | `orm: CategoryOrmEntity` | `Category` |

##### `CategoryMapper.toDomain`

- **Firma:** `toDomain(orm: CategoryOrmEntity): Category` — [category.mapper.ts](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/category.mapper.ts#L5) (L5–14)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Category.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-typeorm-category-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-category-orm-entity-ts"></a>

### category.orm-entity.ts

- **Ruta:** [category.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/category.orm-entity.ts) (`comercial-jhoel-api/src/modules/categories/infrastructure/persistence/category.orm-entity.ts`, 31 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `CategoryOrmEntity` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** [categories.module.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-categories-module-ts), [category.mapper.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-category-mapper-ts), [typeorm-category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-typeorm-category-repository-ts), [product.orm-entity.ts](products.md#f-comercial-jhoel-api-src-modules-products-infrastructure-persistence-product-orm-entity-ts)

#### Clase `CategoryOrmEntity` (L10–30)

- **Decoradores:** `@Entity('categories')` `@Unique('UQ_categories_name', ['name'])`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column description: string \| null`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-typeorm-category-repository-ts"></a>

### typeorm-category.repository.ts

- **Ruta:** [typeorm-category.repository.ts](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts) (`comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts`, 94 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmCategoryRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [category.entity.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-entities-category-entity-ts), [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [category-name-already-exists.error.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-errors-category-name-already-exists-error-ts), [category.orm-entity.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-category-orm-entity-ts), [category.mapper.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-infrastructure-persistence-category-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [categories.module.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-categories-module-ts)

#### Clase `TypeOrmCategoryRepository` (L14–93)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements CategoryRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(CategoryOrmEntity) repository: Repository<CategoryOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 21–27 | `options?: { activeOnly?: boolean }` | `Promise<Category[]>` |
| `findById` | método public async | 29–32 | `id: string` | `Promise<Category \| null>` |
| `findByName` | método public async | 34–37 | `name: string` | `Promise<Category \| null>` |
| `findByActiveName` | método public async | 39–46 | `name: string` | `Promise<Category \| null>` |
| `create` | método public async | 48–59 | `data: CreateCategoryData` | `Promise<Category>` |
| `update` | método public async | 61–69 | `id: string`, `data: UpdateCategoryData` | `Promise<Category>` |
| `deactivate` | método public async | 71–73 | `id: string` | `Promise<void>` |
| `translateUniqueViolation` | método private | 82–92 | `error: unknown`, `name: string` | `unknown` |

##### `TypeOrmCategoryRepository.findAll`

- **Firma:** `findAll(options?: { activeOnly?: boolean }): Promise<Category[]>` — [typeorm-category.repository.ts](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts#L21) (L21–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `CategoryMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCategoryRepository.findById`

- **Firma:** `findById(id: string): Promise<Category \| null>` — [typeorm-category.repository.ts](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts#L29) (L29–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `CategoryMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCategoryRepository.findByName`

- **Firma:** `findByName(name: string): Promise<Category \| null>` — [typeorm-category.repository.ts](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts#L34) (L34–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `CategoryMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCategoryRepository.findByActiveName`

- **Firma:** `findByActiveName(name: string): Promise<Category \| null>` — [typeorm-category.repository.ts](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts#L39) (L39–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('category').where`, `this.repository.createQueryBuilder`, `CategoryMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCategoryRepository.create`

- **Firma:** `create(data: CreateCategoryData): Promise<Category>` — [typeorm-category.repository.ts](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts#L48) (L48–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `CategoryMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCategoryRepository.update`

- **Firma:** `update(id: string, data: UpdateCategoryData): Promise<Category>` — [typeorm-category.repository.ts](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts#L61) (L61–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `CategoryMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name ?? '')`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCategoryRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-category.repository.ts](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmCategoryRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, name: string): unknown` — [typeorm-category.repository.ts](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts#L82) (L82–92)
- **Propósito / descripción:** The use case already checks `findByName` before calling `create`/ `update` — this is the safety net for the race that pre-check can't close (two requests creating the same name at nearly the same time), backed by the DB's own `UQ_categories_name` constraint rather than an application-level lock.
- **Dependencias (llamadas en su cuerpo):** `new CategoryNameAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts"></a>

### categories.controller.ts

- **Ruta:** [categories.controller.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts) (`comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts`, 96 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** The canonical shape every simple reference-table module in this app follows (`businesses`, `suppliers`, `clients`, `account-types` are all near-identical clones of this exact controller) — flat CRUD over one table, `name` globally unique, soft delete only (`isActive = false`, no row is ever physically removed so nothing that already references it dangles).
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [create-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-create-category-use-case-ts), [list-categories.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-list-categories-use-case-ts), [get-category-by-id.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-get-category-by-id-use-case-ts), [update-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-update-category-use-case-ts), [deactivate-category.use-case.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-application-use-cases-deactivate-category-use-case-ts), [create-category.request.dto.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-dtos-create-category-request-dto-ts), [update-category.request.dto.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-dtos-update-category-request-dto-ts), [list-categories.query.dto.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-dtos-list-categories-query-dto-ts), [category.response.dto.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-dtos-category-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [categories.module.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-categories-module-ts)

#### Clase `CategoriesController` (L43–95)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('categories')`
- **Propósito:** The canonical shape every simple reference-table module in this app follows (`businesses`, `suppliers`, `clients`, `account-types` are all near-identical clones of this exact controller) — flat CRUD over one table, `name` globally unique, soft delete only (`isActive = false`, no row is ever physically removed so nothing that already references it dangles). Two-tier guarding: `JwtAuthGuard` at the class level means every route requires a logged-in session, while `GET` (list/detail) stays open to any authenticated role — viewing the catalog is not a privileged action. `RolesGuard` + `@Roles('ADMIN','SUPER_ADMIN')` is added per-method only on the three mutating routes (create/update/deactivate), since managing the catalog itself is.
- **Dependencias inyectadas (constructor):** `createCategoryUseCase: CreateCategoryUseCase`, `listCategoriesUseCase: ListCategoriesUseCase`, `getCategoryByIdUseCase: GetCategoryByIdUseCase`, `updateCategoryUseCase: UpdateCategoryUseCase`, `deactivateCategoryUseCase: DeactivateCategoryUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 54–60 | `dto: CreateCategoryRequestDto` | `Promise<CategoryResponseDto>` |
| `findAll` | método public | 62–69 | `query: ListCategoriesQueryDto` | `Promise<CategoryResponseDto[]>` |
| `findOne` | método public | 71–76 | `id: string` | `Promise<CategoryResponseDto>` |
| `update` | método public | 78–86 | `id: string`, `dto: UpdateCategoryRequestDto` | `Promise<CategoryResponseDto>` |
| `deactivate` | método public | 88–94 | `id: string` | `Promise<void>` |

##### `CategoriesController.create`

- **Firma:** `create(dto: CreateCategoryRequestDto): Promise<CategoryResponseDto>` — [categories.controller.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts#L54) (L54–60)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.createCategoryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CategoriesController.findAll`

- **Firma:** `findAll(query: ListCategoriesQueryDto): Promise<CategoryResponseDto[]>` — [categories.controller.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts#L62) (L62–69)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listCategoriesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CategoriesController.findOne`

- **Firma:** `findOne(id: string): Promise<CategoryResponseDto>` — [categories.controller.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts#L71) (L71–76)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getCategoryByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CategoriesController.update`

- **Firma:** `update(id: string, dto: UpdateCategoryRequestDto): Promise<CategoryResponseDto>` — [categories.controller.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts#L78) (L78–86)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.updateCategoryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CategoriesController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [categories.controller.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts#L88) (L88–94)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateCategoryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-categories-presentation-dtos-category-response-dto-ts"></a>

### category.response.dto.ts

- **Ruta:** [category.response.dto.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/dtos/category.response.dto.ts) (`comercial-jhoel-api/src/modules/categories/presentation/dtos/category.response.dto.ts`, 9 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** DTO de respuesta: declara `CategoryResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

#### Clase `CategoryResponseDto` (L1–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-categories-presentation-dtos-create-category-request-dto-ts"></a>

### create-category.request.dto.ts

- **Ruta:** [create-category.request.dto.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/dtos/create-category.request.dto.ts) (`comercial-jhoel-api/src/modules/categories/presentation/dtos/create-category.request.dto.ts`, 21 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** DTO de entrada: declara `CreateCategoryRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

#### Clase `CreateCategoryRequestDto` (L9–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-categories-presentation-dtos-list-categories-query-dto-ts"></a>

### list-categories.query.dto.ts

- **Ruta:** [list-categories.query.dto.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/dtos/list-categories.query.dto.ts) (`comercial-jhoel-api/src/modules/categories/presentation/dtos/list-categories.query.dto.ts`, 10 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** DTO de consulta: declara `ListCategoriesQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

#### Clase `ListCategoriesQueryDto` (L4–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-categories-presentation-dtos-update-category-request-dto-ts"></a>

### update-category.request.dto.ts

- **Ruta:** [update-category.request.dto.ts](../../../../comercial-jhoel-api/src/modules/categories/presentation/dtos/update-category.request.dto.ts) (`comercial-jhoel-api/src/modules/categories/presentation/dtos/update-category.request.dto.ts`, 22 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `categories`
- **Responsabilidad:** DTO de entrada: declara `UpdateCategoryRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [categories.controller.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-presentation-controllers-categories-controller-ts)

#### Clase `UpdateCategoryRequestDto` (L9–21)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
