# Módulo backend `landing-backgrounds`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/landing-backgrounds` | [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L60) `LandingBackgroundsController.create` | [CreateLandingBackgroundUseCase](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-create-landing-background-use-case-ts) | `LandingBackgroundRepository`.findActiveBySectionKey/create | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `LandingBackgroundService.createBackground` |
| `GET /api/landing-backgrounds` | [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L80) `LandingBackgroundsController.findAll` | [ListLandingBackgroundsUseCase](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-landing-backgrounds-use-case-ts) | `LandingBackgroundRepository`.findAll | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `LandingBackgroundService.getBackgrounds` |
| `GET /api/landing-backgrounds/:id` | [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L85) `LandingBackgroundsController.findOne` | [GetLandingBackgroundByIdUseCase](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-by-id-use-case-ts) | `LandingBackgroundRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `LandingBackgroundService.getBackgroundById` |
| `PATCH /api/landing-backgrounds/:id` | [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L90) `LandingBackgroundsController.update` | [UpdateLandingBackgroundUseCase](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-update-landing-background-use-case-ts) | `LandingBackgroundRepository`.findById/findActiveBySectionKey/update | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `LandingBackgroundService.updateBackground` |
| `POST /api/landing-backgrounds/:id/activate` | [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L110) `LandingBackgroundsController.activate` | [SetLandingBackgroundActiveUseCase](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-active-use-case-ts) | `LandingBackgroundRepository`.findById/findActiveBySectionKey/setActive | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `LandingBackgroundService.activateBackground` |
| `DELETE /api/landing-backgrounds/:id` | [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L116) `LandingBackgroundsController.deactivate` | [SetLandingBackgroundActiveUseCase](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-active-use-case-ts) | `LandingBackgroundRepository`.findById/findActiveBySectionKey/setActive | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `LandingBackgroundService.deactivateBackground` |
| `POST /api/landing-backgrounds/:id/image` | [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L122) `LandingBackgroundsController.setImage` | [SetLandingBackgroundImageUseCase](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-image-use-case-ts) | `LandingBackgroundRepository`.findById/setImage | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `LandingBackgroundService.setImage` |
| `DELETE /api/landing-backgrounds/:id/image` | [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L137) `LandingBackgroundsController.removeImage` | [RemoveLandingBackgroundImageUseCase](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-remove-landing-background-image-use-case-ts) | `LandingBackgroundRepository`.findById/removeImage | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `LandingBackgroundService.removeImage` |
| `GET /api/public-landing-backgrounds` | [public-landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/public-landing-backgrounds.controller.ts#L21) `PublicLandingBackgroundsController.findAll` | [ListPublishedLandingBackgroundsUseCase](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-published-landing-backgrounds-use-case-ts) | `LandingBackgroundRepository`.findPublished | — | `PublicLandingBackgroundService.getPublishedBackgrounds` |
| `GET /api/public-landing-backgrounds/images/:id` | [public-landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/public-landing-backgrounds.controller.ts#L26) `PublicLandingBackgroundsController.getImage` | [GetLandingBackgroundImageUseCase](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-image-use-case-ts) | `LandingBackgroundRepository`.getImage | — | — |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [landing-background-output.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-dtos-landing-background-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toLandingBackgroundOutput`, `LandingBackgroundOutput`, `PublicLandingBackgroundOutput` (sin comentario de documentación en el código). | 1 internas | 5 | Media (5 consumidores) |
| [create-landing-background.use-case.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-create-landing-background-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateLandingBackgroundUseCase`, `CreateLandingBackgroundInput` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-landing-background-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetLandingBackgroundByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-landing-background-image.use-case.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-image-use-case-ts) | .ts | Caso de uso | Aplicación | Único endpoint que sirve los bytes — reutilizado tanto por la landing pública (la capa visual) como por la vista previa/miniaturas del admin, igual que el resto de módulos con imagen de este proyecto. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-landing-backgrounds.use-case.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-landing-backgrounds-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListLandingBackgroundsUseCase`, `ListLandingBackgroundsInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-published-landing-backgrounds.use-case.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-published-landing-backgrounds-use-case-ts) | .ts | Caso de uso | Aplicación | Backs la capa visual de fondos en la landing — solo activos. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [remove-landing-background-image.use-case.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-remove-landing-background-image-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `RemoveLandingBackgroundImageUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [set-landing-background-active.use-case.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-active-use-case-ts) | .ts | Caso de uso | Aplicación | Soft — nunca DELETE físico. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [set-landing-background-image.use-case.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-image-use-case-ts) | .ts | Caso de uso | Aplicación | También el path que usa "Reemplazar imagen" — subir una imagen nueva sobre un fondo existente no crea una fila nueva, simplemente sobreescribe los bytes de la misma (nunca rompe el `id`/la sección/la configuración visual ya guardada). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-landing-background.use-case.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-update-landing-background-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateLandingBackgroundUseCase`, `UpdateLandingBackgroundInput` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [assert-valid-landing-background-image.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-utils-assert-valid-landing-background-image-ts) | .ts | Utilidad | Aplicación | Utilidad: declara `assertValidLandingBackgroundImage`, `UploadedLandingBackgroundImage`, `MAX_LANDING_BACKGROUND_IMAGE_SIZE_BYTES`, `ALLOWED_MIME_TYPES` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [landing-section-key.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-landing-section-key-ts) | .ts | Código TypeScript | Dominio | The real, existing section ids the public Angular landing renders (`sectionId` on `&lt;app-section&gt;` in each `features/landing/sections/*` component, plus `inicio` for the Hero, which sets its own `id` directly since it isn't built on `&lt;app-section&gt;`). | 0 internas | 8 | Media (8 consumidores) |
| [visual-config.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-visual-config-ts) | .ts | Código TypeScript | Dominio | The visual-configuration vocabulary an admin can choose for a landing background — every one of these maps directly onto a small set of fixed CSS values the frontend's existing 3D/parallax/tilt system already knows how to render (`ParallaxLayerDirective`'s `speed`, `TiltOnMouseDirective`'s `tiltMax`, an overlay opacity, etc.) — the admin never types CSS, only picks from these. | 0 internas | 7 | Media (7 consumidores) |
| [landing-background.entity.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-entities-landing-background-entity-ts) | .ts | Entidad de dominio | Dominio | A watermark-style depth layer assigned to one landing section — never a catalog item, never a product/phone/news/bank image (see this module's own doc comment for why it deliberately never touches those tables). | 2 internas | 4 | Media (4 consumidores) |
| [invalid-landing-background-image.error.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-invalid-landing-background-image-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidLandingBackgroundImageError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [landing-background-not-found.error.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-landing-background-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `LandingBackgroundNotFoundError` (sin comentario de documentación en el código). | 1 internas | 5 | Media (5 consumidores) |
| [landing-background-not-visible.error.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-landing-background-not-visible-error-ts) | .ts | Errores de dominio | Dominio | Reusado tanto para "no existe" como para "existe pero está inactivo/sin imagen" — un 404 público nunca revela cuál de los casos ocurrió. | 1 internas | 1 | Baja (1 consumidores) |
| [section-already-has-active-background.error.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-section-already-has-active-background-error-ts) | .ts | Errores de dominio | Dominio | Thrown by `CreateLandingBackgroundUseCase` when the target section already has an active background — the real guarantee is the partial unique index `UQ_landing_backgrounds_section_active` (this is the friendly pre-check, not the enforcement). | 1 internas | 3 | Media (3 consumidores) |
| [landing-background.repository.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `LandingBackgroundVisualConfig`, `CreateLandingBackgroundData`, `UpdateLandingBackgroundData`, `ListLandingBackgroundsOptions`, `LandingBackgroundImageBytes` (sin comentario de documentación en el código). | 3 internas | 11 | Alta (11 consumidores) |
| [landing-background.mapper.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-landing-background-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `LandingBackgroundMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [landing-background.orm-entity.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-landing-background-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | `imageData` usa `select: false` — mismo patrón que Teléfonos/Librería/Variedades/Noticias/Catálogo de Bancos: nunca viaja en un listado normal, solo `getImage()` la selecciona explícitamente. | 3 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [typeorm-landing-background.repository.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-typeorm-landing-background-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmLandingBackgroundRepository` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [landing-backgrounds.module.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts) | .ts | Módulo | Arranque / configuración | "Fondos de Landing" — capas visuales de profundidad (marca de agua + parallax + iluminación + 3D) asignadas a una sección real de la landing pública. | 14 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |
| [landing-backgrounds.controller.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts) | .ts | Controlador | Presentación | Admin-only end to end — "Sistema → Fondos de Landing". | 15 internas; ext.: @nestjs/common, @nestjs/platform-express | 1 | Media (controlador) |
| [public-landing-backgrounds.controller.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-public-landing-backgrounds-controller-ts) | .ts | Controlador | Presentación | Público, sin guard — backs la capa de fondos 3D de la landing. | 3 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [create-landing-background.request.dto.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-create-landing-background-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateLandingBackgroundRequestDto` (sin comentario de documentación en el código). | 2 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [landing-background.response.dto.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-landing-background-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `LandingBackgroundResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [list-landing-backgrounds.query.dto.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-list-landing-backgrounds-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListLandingBackgroundsQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [public-landing-background.response.dto.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-public-landing-background-response-dto-ts) | .ts | DTO de respuesta | Presentación | Backs la capa de fondos en la landing pública — sin isActive/audit, solo lo que un visitante puede ver. | 0 internas | 1 | Baja (1 consumidores) |
| [update-landing-background.request.dto.ts](#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-update-landing-background-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateLandingBackgroundRequestDto` (sin comentario de documentación en el código). | 2 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-application-dtos-landing-background-output-ts"></a>

### landing-background-output.ts

- **Ruta:** [landing-background-output.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/dtos/landing-background-output.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/application/dtos/landing-background-output.ts`, 66 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** DTO de salida (aplicación): declara `toLandingBackgroundOutput`, `LandingBackgroundOutput`, `PublicLandingBackgroundOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [landing-background.entity.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-entities-landing-background-entity-ts)
- **Consumidores:** [create-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-create-landing-background-use-case-ts), [get-landing-background-by-id.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-by-id-use-case-ts), [list-landing-backgrounds.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-landing-backgrounds-use-case-ts), [list-published-landing-backgrounds.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-published-landing-backgrounds-use-case-ts), [update-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-update-landing-background-use-case-ts)

**Interfaces, tipos y enums:**

- `interface LandingBackgroundOutput` (L3): sin documentación — miembros: `id`, `name`, `sectionKey`, `opacity`, `overlay`, `position`, `size`, `depthEffect`, `parallax`, `movement`, `isActive`, `hasImage`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface PublicLandingBackgroundOutput` (L31): Shape público — backs la capa de fondos de la landing. — miembros: `id`, `sectionKey`, `hasImage`, `opacity`, `overlay`, `position`, `size`, `depthEffect`, `parallax`, `movement`
#### Función `toLandingBackgroundOutput` (L44–65)

- **Tipo:** función exportada
- **Firma:** `toLandingBackgroundOutput(background: LandingBackground): LandingBackgroundOutput` — [landing-background-output.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/dtos/landing-background-output.ts#L44)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-create-landing-background-use-case-ts), [get-landing-background-by-id.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-by-id-use-case-ts), [update-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-update-landing-background-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-create-landing-background-use-case-ts"></a>

### create-landing-background.use-case.ts

- **Ruta:** [create-landing-background.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/create-landing-background.use-case.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/create-landing-background.use-case.ts`, 57 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Caso de uso: declara `CreateLandingBackgroundUseCase`, `CreateLandingBackgroundInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [landing-section-key.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-landing-section-key-ts), [visual-config.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-visual-config-ts), [section-already-has-active-background.error.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-section-already-has-active-background-error-ts), [landing-background-output.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-dtos-landing-background-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts), [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateLandingBackgroundInput` (L16): sin documentación — miembros: `name`, `sectionKey`, `opacity`, `overlay`, `position`, `size`, `depthEffect`, `parallax`, `movement`, `userId`

#### Clase `CreateLandingBackgroundUseCase` (L29–56)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(LANDING_BACKGROUND_REPOSITORY) landingBackgroundRepository: LandingBackgroundRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 36–55 | `input: CreateLandingBackgroundInput` | `Promise<LandingBackgroundOutput>` |

##### `CreateLandingBackgroundUseCase.execute`

- **Firma:** `execute(input: CreateLandingBackgroundInput): Promise<LandingBackgroundOutput>` — [create-landing-background.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/create-landing-background.use-case.ts#L36) (L36–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.landingBackgroundRepository.findActiveBySectionKey`, `new SectionAlreadyHasActiveBackgroundError`, `this.landingBackgroundRepository.create`, `input.name.trim`, `toLandingBackgroundOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SectionAlreadyHasActiveBackgroundError(input.sectionKey)`
- **Consumidores:** [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-by-id-use-case-ts"></a>

### get-landing-background-by-id.use-case.ts

- **Ruta:** [get-landing-background-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/get-landing-background-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/get-landing-background-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Caso de uso: declara `GetLandingBackgroundByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [landing-background-not-found.error.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-landing-background-not-found-error-ts), [landing-background-output.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-dtos-landing-background-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts), [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

#### Clase `GetLandingBackgroundByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(LANDING_BACKGROUND_REPOSITORY) landingBackgroundRepository: LandingBackgroundRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<LandingBackgroundOutput>` |

##### `GetLandingBackgroundByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<LandingBackgroundOutput>` — [get-landing-background-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/get-landing-background-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.landingBackgroundRepository.findById`, `new LandingBackgroundNotFoundError`, `toLandingBackgroundOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new LandingBackgroundNotFoundError(id)`
- **Consumidores:** [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-image-use-case-ts"></a>

### get-landing-background-image.use-case.ts

- **Ruta:** [get-landing-background-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/get-landing-background-image.use-case.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/get-landing-background-image.use-case.ts`, 27 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Único endpoint que sirve los bytes — reutilizado tanto por la landing pública (la capa visual) como por la vista previa/miniaturas del admin, igual que el resto de módulos con imagen de este proyecto.
- **Depende de (archivos del proyecto):** [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [landing-background-not-visible.error.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-landing-background-not-visible-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts), [public-landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-public-landing-backgrounds-controller-ts)

**Interfaces, tipos y enums:**

- `interface LandingBackgroundImageBytesOutput` (L6): sin documentación — miembros: `data`, `mimeType`

#### Clase `GetLandingBackgroundImageUseCase` (L12–26)

- **Decoradores:** `@Injectable()`
- **Propósito:** Único endpoint que sirve los bytes — reutilizado tanto por la landing pública (la capa visual) como por la vista previa/miniaturas del admin, igual que el resto de módulos con imagen de este proyecto.
- **Dependencias inyectadas (constructor):** `@Inject(LANDING_BACKGROUND_REPOSITORY) landingBackgroundRepository: LandingBackgroundRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–25 | `id: string` | `Promise<LandingBackgroundImageBytesOutput>` |

##### `GetLandingBackgroundImageUseCase.execute`

- **Firma:** `execute(id: string): Promise<LandingBackgroundImageBytesOutput>` — [get-landing-background-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/get-landing-background-image.use-case.ts#L19) (L19–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.landingBackgroundRepository.getImage`, `new LandingBackgroundNotVisibleError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new LandingBackgroundNotVisibleError()`
- **Consumidores:** [public-landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-public-landing-backgrounds-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-landing-backgrounds-use-case-ts"></a>

### list-landing-backgrounds.use-case.ts

- **Ruta:** [list-landing-backgrounds.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/list-landing-backgrounds.use-case.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/list-landing-backgrounds.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Caso de uso: declara `ListLandingBackgroundsUseCase`, `ListLandingBackgroundsInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [landing-background-output.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-dtos-landing-background-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts), [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListLandingBackgroundsInput` (L6): sin documentación — miembros: `includeInactive`

#### Clase `ListLandingBackgroundsUseCase` (L10–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(LANDING_BACKGROUND_REPOSITORY) landingBackgroundRepository: LandingBackgroundRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–20 | `input?: ListLandingBackgroundsInput` | `Promise<LandingBackgroundOutput[]>` |

##### `ListLandingBackgroundsUseCase.execute`

- **Firma:** `execute(input?: ListLandingBackgroundsInput): Promise<LandingBackgroundOutput[]>` — [list-landing-backgrounds.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/list-landing-backgrounds.use-case.ts#L17) (L17–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.landingBackgroundRepository.findAll`, `backgrounds.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-published-landing-backgrounds-use-case-ts"></a>

### list-published-landing-backgrounds.use-case.ts

- **Ruta:** [list-published-landing-backgrounds.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/list-published-landing-backgrounds.use-case.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/list-published-landing-backgrounds.use-case.ts`, 36 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Backs la capa visual de fondos en la landing — solo activos.
- **Depende de (archivos del proyecto):** [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [landing-background-output.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-dtos-landing-background-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts), [public-landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-public-landing-backgrounds-controller-ts)

#### Clase `ListPublishedLandingBackgroundsUseCase` (L13–35)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs la capa visual de fondos en la landing — solo activos. Un fondo activo sin imagen todavía subida se incluye igual (`hasImage: false`) en vez de excluirse, para que la landing pueda decidir por sí misma qué hacer (en la práctica: simplemente no renderizar la capa de imagen para esa sección) — la fuente de verdad de qué existe es siempre el backend.
- **Dependencias inyectadas (constructor):** `@Inject(LANDING_BACKGROUND_REPOSITORY) landingBackgroundRepository: LandingBackgroundRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–34 | — | `Promise<PublicLandingBackgroundOutput[]>` |

##### `ListPublishedLandingBackgroundsUseCase.execute`

- **Firma:** `execute(): Promise<PublicLandingBackgroundOutput[]>` — [list-published-landing-backgrounds.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/list-published-landing-backgrounds.use-case.ts#L20) (L20–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.landingBackgroundRepository.findPublished`, `backgrounds.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [public-landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-public-landing-backgrounds-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-remove-landing-background-image-use-case-ts"></a>

### remove-landing-background-image.use-case.ts

- **Ruta:** [remove-landing-background-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/remove-landing-background-image.use-case.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/remove-landing-background-image.use-case.ts`, 21 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Caso de uso: declara `RemoveLandingBackgroundImageUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [landing-background-not-found.error.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-landing-background-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts), [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

#### Clase `RemoveLandingBackgroundImageUseCase` (L6–20)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(LANDING_BACKGROUND_REPOSITORY) landingBackgroundRepository: LandingBackgroundRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 13–19 | `id: string`, `userId: string` | `Promise<void>` |

##### `RemoveLandingBackgroundImageUseCase.execute`

- **Firma:** `execute(id: string, userId: string): Promise<void>` — [remove-landing-background-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/remove-landing-background-image.use-case.ts#L13) (L13–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.landingBackgroundRepository.findById`, `new LandingBackgroundNotFoundError`, `this.landingBackgroundRepository.removeImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new LandingBackgroundNotFoundError(id)`
- **Consumidores:** [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-active-use-case-ts"></a>

### set-landing-background-active.use-case.ts

- **Ruta:** [set-landing-background-active.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/set-landing-background-active.use-case.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/set-landing-background-active.use-case.ts`, 31 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Soft — nunca DELETE físico.
- **Depende de (archivos del proyecto):** [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [landing-background-not-found.error.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-landing-background-not-found-error-ts), [section-already-has-active-background.error.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-section-already-has-active-background-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts), [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

#### Clase `SetLandingBackgroundActiveUseCase` (L8–30)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft — nunca DELETE físico. Un fondo desactivado desaparece de la landing pero conserva imagen/configuración en administración.
- **Dependencias inyectadas (constructor):** `@Inject(LANDING_BACKGROUND_REPOSITORY) landingBackgroundRepository: LandingBackgroundRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 15–29 | `id: string`, `isActive: boolean`, `userId: string` | `Promise<void>` |

##### `SetLandingBackgroundActiveUseCase.execute`

- **Firma:** `execute(id: string, isActive: boolean, userId: string): Promise<void>` — [set-landing-background-active.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/set-landing-background-active.use-case.ts#L15) (L15–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.landingBackgroundRepository.findById`, `new LandingBackgroundNotFoundError`, `this.landingBackgroundRepository.findActiveBySectionKey`, `new SectionAlreadyHasActiveBackgroundError`, `this.landingBackgroundRepository.setActive`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new LandingBackgroundNotFoundError(id)`, `new SectionAlreadyHasActiveBackgroundError(background.sectionKey)`
- **Consumidores:** [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-image-use-case-ts"></a>

### set-landing-background-image.use-case.ts

- **Ruta:** [set-landing-background-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/set-landing-background-image.use-case.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/set-landing-background-image.use-case.ts`, 37 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** También el path que usa "Reemplazar imagen" — subir una imagen nueva sobre un fondo existente no crea una fila nueva, simplemente sobreescribe los bytes de la misma (nunca rompe el `id`/la sección/la configuración visual ya guardada).
- **Depende de (archivos del proyecto):** [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [landing-background-not-found.error.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-landing-background-not-found-error-ts), [assert-valid-landing-background-image.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-utils-assert-valid-landing-background-image-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts), [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

**Interfaces, tipos y enums:**

- `interface SetLandingBackgroundImageInput` (L10): sin documentación — miembros: `landingBackgroundId`, `image`, `userId`

#### Clase `SetLandingBackgroundImageUseCase` (L17–36)

- **Decoradores:** `@Injectable()`
- **Propósito:** También el path que usa "Reemplazar imagen" — subir una imagen nueva sobre un fondo existente no crea una fila nueva, simplemente sobreescribe los bytes de la misma (nunca rompe el `id`/la sección/la configuración visual ya guardada).
- **Dependencias inyectadas (constructor):** `@Inject(LANDING_BACKGROUND_REPOSITORY) landingBackgroundRepository: LandingBackgroundRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 24–35 | `input: SetLandingBackgroundImageInput` | `Promise<void>` |

##### `SetLandingBackgroundImageUseCase.execute`

- **Firma:** `execute(input: SetLandingBackgroundImageInput): Promise<void>` — [set-landing-background-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/set-landing-background-image.use-case.ts#L24) (L24–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.landingBackgroundRepository.findById`, `new LandingBackgroundNotFoundError`, `assertValidLandingBackgroundImage`, `this.landingBackgroundRepository.setImage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new LandingBackgroundNotFoundError(input.landingBackgroundId)`
- **Consumidores:** [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-update-landing-background-use-case-ts"></a>

### update-landing-background.use-case.ts

- **Ruta:** [update-landing-background.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/update-landing-background.use-case.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/update-landing-background.use-case.ts`, 72 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Caso de uso: declara `UpdateLandingBackgroundUseCase`, `UpdateLandingBackgroundInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [landing-section-key.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-landing-section-key-ts), [visual-config.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-visual-config-ts), [landing-background-not-found.error.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-landing-background-not-found-error-ts), [section-already-has-active-background.error.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-section-already-has-active-background-error-ts), [landing-background-output.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-dtos-landing-background-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts), [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateLandingBackgroundInput` (L17): sin documentación — miembros: `name`, `sectionKey`, `opacity`, `overlay`, `position`, `size`, `depthEffect`, `parallax`, `movement`, `userId`

#### Clase `UpdateLandingBackgroundUseCase` (L30–71)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(LANDING_BACKGROUND_REPOSITORY) landingBackgroundRepository: LandingBackgroundRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 37–70 | `id: string`, `input: UpdateLandingBackgroundInput` | `Promise<LandingBackgroundOutput>` |

##### `UpdateLandingBackgroundUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateLandingBackgroundInput): Promise<LandingBackgroundOutput>` — [update-landing-background.use-case.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/update-landing-background.use-case.ts#L37) (L37–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.landingBackgroundRepository.findById`, `new LandingBackgroundNotFoundError`, `this.landingBackgroundRepository.findActiveBySectionKey`, `new SectionAlreadyHasActiveBackgroundError`, `this.landingBackgroundRepository.update`, `input.name?.trim`, `toLandingBackgroundOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.landingBackgroundRepository.update`
- **Errores que lanza:** `new LandingBackgroundNotFoundError(id)`, `new SectionAlreadyHasActiveBackgroundError(input.sectionKey)`
- **Consumidores:** [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-application-utils-assert-valid-landing-background-image-ts"></a>

### assert-valid-landing-background-image.ts

- **Ruta:** [assert-valid-landing-background-image.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/utils/assert-valid-landing-background-image.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/application/utils/assert-valid-landing-background-image.ts`, 25 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Utilidad: declara `assertValidLandingBackgroundImage`, `UploadedLandingBackgroundImage`, `MAX_LANDING_BACKGROUND_IMAGE_SIZE_BYTES`, `ALLOWED_MIME_TYPES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [invalid-landing-background-image.error.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-invalid-landing-background-image-error-ts)
- **Consumidores:** [set-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-image-use-case-ts)

**Interfaces, tipos y enums:**

- `interface UploadedLandingBackgroundImage` (L8): sin documentación — miembros: `buffer`, `mimetype`, `size`

**Constantes exportadas:**

- `MAX_LANDING_BACKGROUND_IMAGE_SIZE_BYTES` (L4): Mismo techo que el resto de imágenes del proyecto (Teléfonos, Librería/Variedades, Noticias, Catálogo de Bancos). = `5 * 1024 * 1024`
#### Función `assertValidLandingBackgroundImage` (L14–24)

- **Tipo:** función exportada
- **Firma:** `assertValidLandingBackgroundImage(file: UploadedLandingBackgroundImage): void` — [assert-valid-landing-background-image.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/utils/assert-valid-landing-background-image.ts#L14)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new InvalidLandingBackgroundImageError`, `ALLOWED_MIME_TYPES.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidLandingBackgroundImageError('La imagen está vacía.')`, `new InvalidLandingBackgroundImageError('La imagen debe ser JPG, PNG o WEBP.')`, `new InvalidLandingBackgroundImageError('La imagen no puede superar los 5 MB.')`
- **Consumidores:** [set-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-image-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-landing-section-key-ts"></a>

### landing-section-key.ts

- **Ruta:** [landing-section-key.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/constants/landing-section-key.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/domain/constants/landing-section-key.ts`, 29 líneas)
- **Tipo:** Código TypeScript · **Capa:** Dominio · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** The real, existing section ids the public Angular landing renders (`sectionId` on `&lt;app-section&gt;` in each `features/landing/sections/*` component, plus `inicio` for the Hero, which sets its own `id` directly since it isn't built on `&lt;app-section&gt;`).
- **Descripción del autor (comentario del archivo):** The real, existing section ids the public Angular landing renders (`sectionId` on `&lt;app-section&gt;` in each `features/landing/sections/*` component, plus `inicio` for the Hero, which sets its own `id` directly since it isn't built on `&lt;app-section&gt;`). This is the ONE place this list is defined on the backend — `CreateLandingBackgroundRequestDto`/ `UpdateLandingBackgroundRequestDto` validate against it via `@IsIn(...)`, so a section key that doesn't correspond to a real place in the landing is rejected before ever reaching the database. Adding a new landing section later means adding one entry he
- **Consumidores:** [create-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-create-landing-background-use-case-ts), [update-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-update-landing-background-use-case-ts), [landing-background.entity.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-entities-landing-background-entity-ts), [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [landing-background.orm-entity.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-landing-background-orm-entity-ts), [typeorm-landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-typeorm-landing-background-repository-ts), [create-landing-background.request.dto.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-create-landing-background-request-dto-ts), [update-landing-background.request.dto.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-update-landing-background-request-dto-ts)

**Interfaces, tipos y enums:**

- `type LandingSectionKey` (L28) = `(typeof LANDING_SECTION_KEYS)[number]`

**Constantes exportadas:**

- `LANDING_SECTION_KEYS` (L16): The real, existing section ids the public Angular landing renders (`sectionId` on `&lt;app-section&gt;` in each `features/landing/sections/*` component, plus `inicio` for the Hero, which sets its own `id` directly since it isn't built on `&lt;app-section&gt;`). = `[ 'inicio', 'servicios', 'telefonos', 'libreria', 'variedades', 'agentes-bancarios', 'noticias', 'quienes-somo`
<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-visual-config-ts"></a>

### visual-config.ts

- **Ruta:** [visual-config.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/constants/visual-config.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/domain/constants/visual-config.ts`, 31 líneas)
- **Tipo:** Código TypeScript · **Capa:** Dominio · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** The visual-configuration vocabulary an admin can choose for a landing background — every one of these maps directly onto a small set of fixed CSS values the frontend's existing 3D/parallax/tilt system already knows how to render (`ParallaxLayerDirective`'s `speed`, `TiltOnMouseDirective`'s `tiltMax`, an overlay opacity, etc.) — the admin never types CSS, only picks from these.
- **Descripción del autor (comentario del archivo):** The visual-configuration vocabulary an admin can choose for a landing background — every one of these maps directly onto a small set of fixed CSS values the frontend's existing 3D/parallax/tilt system already knows how to render (`ParallaxLayerDirective`'s `speed`, `TiltOnMouseDirective`'s `tiltMax`, an overlay opacity, etc.) — the admin never types CSS, only picks from these.
- **Consumidores:** [create-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-create-landing-background-use-case-ts), [update-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-update-landing-background-use-case-ts), [landing-background.entity.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-entities-landing-background-entity-ts), [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [landing-background.orm-entity.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-landing-background-orm-entity-ts), [create-landing-background.request.dto.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-create-landing-background-request-dto-ts), [update-landing-background.request.dto.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-update-landing-background-request-dto-ts)

**Interfaces, tipos y enums:**

- `type OverlayLevel` (L10) = `(typeof OVERLAY_LEVELS)[number]`
- `type BackgroundPosition` (L13) = `(typeof BACKGROUND_POSITIONS)[number]`
- `type BackgroundSize` (L16) = `(typeof BACKGROUND_SIZES)[number]`
- `type DepthEffect` (L19) = `(typeof DEPTH_EFFECTS)[number]`
- `type ParallaxIntensity` (L22) = `(typeof PARALLAX_INTENSITIES)[number]`
- `type MovementMode` (L30) = `(typeof MOVEMENT_MODES)[number]`

**Constantes exportadas:**

- `OVERLAY_LEVELS` (L9): The visual-configuration vocabulary an admin can choose for a landing background — every one of these maps directly onto a small set of fixed CSS values the frontend's existing 3D/parallax/tilt system already knows how to render (`ParallaxLayerDirective`'s `speed`, `TiltOnMouseDirective`'s `tiltMax`, an overlay opacity, etc.) — the admin never types CSS, only picks from these. = `['none', 'subtle', 'medium', 'strong'] as const`
- `BACKGROUND_POSITIONS` (L12) = `['center', 'center-left', 'center-right', 'top', 'bottom'] as const`
- `BACKGROUND_SIZES` (L15) = `['small', 'medium', 'large', 'cover'] as const`
- `DEPTH_EFFECTS` (L18) = `['none', 'subtle', 'medium', 'deep'] as const`
- `PARALLAX_INTENSITIES` (L21) = `['off', 'subtle', 'medium'] as const`
- `MOVEMENT_MODES` (L29): `scroll`/`mouse` read from `parallax`/`depthEffect` respectively for their actual intensity — this field only decides WHICH input sources drive the layer's movement, never a second, competing intensity scale. = `['static', 'floating', 'scroll', 'mouse', 'scroll_mouse'] as const`
<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-entities-landing-background-entity-ts"></a>

### landing-background.entity.ts

- **Ruta:** [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts`, 119 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** A watermark-style depth layer assigned to one landing section — never a catalog item, never a product/phone/news/bank image (see this module's own doc comment for why it deliberately never touches those tables).
- **Depende de (archivos del proyecto):** [landing-section-key.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-landing-section-key-ts), [visual-config.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-visual-config-ts)
- **Consumidores:** [landing-background-output.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-dtos-landing-background-output-ts), [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [landing-background.mapper.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-landing-background-mapper-ts), [typeorm-landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-typeorm-landing-background-repository-ts)

**Interfaces, tipos y enums:**

- `interface LandingBackgroundProps` (L11): sin documentación — miembros: `id`, `name`, `sectionKey`, `opacity`, `overlay`, `position`, `size`, `depthEffect`, `parallax`, `movement`, `isActive`, `hasImage`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`

#### Clase `LandingBackground` (L40–118)

- **Propósito:** A watermark-style depth layer assigned to one landing section — never a catalog item, never a product/phone/news/bank image (see this module's own doc comment for why it deliberately never touches those tables). Same "editorial content, no FK to another business entity" shape as `CatalogBank`/`NewsArticle` — this just carries visual-configuration fields on top instead of description/additionalInfo.
- **Dependencias inyectadas (constructor):** `props: LandingBackgroundProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 43–45 | `props: LandingBackgroundProps` | `LandingBackground` |
| `id` | getter public | 47–49 | — | `string` |
| `name` | getter public | 51–53 | — | `string` |
| `sectionKey` | getter public | 55–57 | — | `LandingSectionKey` |
| `opacity` | getter public | 59–61 | — | `number` |
| `overlay` | getter public | 63–65 | — | `OverlayLevel` |
| `position` | getter public | 67–69 | — | `BackgroundPosition` |
| `size` | getter public | 71–73 | — | `BackgroundSize` |
| `depthEffect` | getter public | 75–77 | — | `DepthEffect` |
| `parallax` | getter public | 79–81 | — | `ParallaxIntensity` |
| `movement` | getter public | 83–85 | — | `MovementMode` |
| `isActive` | getter public | 87–89 | — | `boolean` |
| `hasImage` | getter public | 91–93 | — | `boolean` |
| `createdAt` | getter public | 95–97 | — | `Date` |
| `updatedAt` | getter public | 99–101 | — | `Date` |
| `createdBy` | getter public | 103–105 | — | `string` |
| `createdByUsername` | getter public | 107–109 | — | `string` |
| `updatedBy` | getter public | 111–113 | — | `string \| null` |
| `updatedByUsername` | getter public | 115–117 | — | `string \| null` |

##### `LandingBackground.create`

- **Firma:** `create(props: LandingBackgroundProps): LandingBackground` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new LandingBackground`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [landing-background.mapper.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-landing-background-mapper-ts), [typeorm-landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-typeorm-landing-background-repository-ts)

##### `LandingBackground.id`

- **Firma:** `id(): string` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.name`

- **Firma:** `name(): string` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.sectionKey`

- **Firma:** `sectionKey(): LandingSectionKey` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.opacity`

- **Firma:** `opacity(): number` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.overlay`

- **Firma:** `overlay(): OverlayLevel` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.position`

- **Firma:** `position(): BackgroundPosition` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.size`

- **Firma:** `size(): BackgroundSize` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.depthEffect`

- **Firma:** `depthEffect(): DepthEffect` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.parallax`

- **Firma:** `parallax(): ParallaxIntensity` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.movement`

- **Firma:** `movement(): MovementMode` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.isActive`

- **Firma:** `isActive(): boolean` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L87) (L87–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.hasImage`

- **Firma:** `hasImage(): boolean` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L91) (L91–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.createdAt`

- **Firma:** `createdAt(): Date` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.updatedAt`

- **Firma:** `updatedAt(): Date` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L99) (L99–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.createdBy`

- **Firma:** `createdBy(): string` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L103) (L103–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.createdByUsername`

- **Firma:** `createdByUsername(): string` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L107) (L107–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L111) (L111–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackground.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [landing-background.entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/entities/landing-background.entity.ts#L115) (L115–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-invalid-landing-background-image-error-ts"></a>

### invalid-landing-background-image.error.ts

- **Ruta:** [invalid-landing-background-image.error.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/errors/invalid-landing-background-image.error.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/domain/errors/invalid-landing-background-image.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Errores de dominio: declara `InvalidLandingBackgroundImageError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [assert-valid-landing-background-image.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-utils-assert-valid-landing-background-image-ts)

#### Clase `InvalidLandingBackgroundImageError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `message: string`
<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-landing-background-not-found-error-ts"></a>

### landing-background-not-found.error.ts

- **Ruta:** [landing-background-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/errors/landing-background-not-found.error.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/domain/errors/landing-background-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Errores de dominio: declara `LandingBackgroundNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-landing-background-by-id.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-by-id-use-case-ts), [remove-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-remove-landing-background-image-use-case-ts), [set-landing-background-active.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-active-use-case-ts), [set-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-image-use-case-ts), [update-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-update-landing-background-use-case-ts)

#### Clase `LandingBackgroundNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-landing-background-not-visible-error-ts"></a>

### landing-background-not-visible.error.ts

- **Ruta:** [landing-background-not-visible.error.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/errors/landing-background-not-visible.error.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/domain/errors/landing-background-not-visible.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Reusado tanto para "no existe" como para "existe pero está inactivo/sin imagen" — un 404 público nunca revela cuál de los casos ocurrió.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-image-use-case-ts)

#### Clase `LandingBackgroundNotVisibleError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Reusado tanto para "no existe" como para "existe pero está inactivo/sin imagen" — un 404 público nunca revela cuál de los casos ocurrió.
<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-errors-section-already-has-active-background-error-ts"></a>

### section-already-has-active-background.error.ts

- **Ruta:** [section-already-has-active-background.error.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/errors/section-already-has-active-background.error.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/domain/errors/section-already-has-active-background.error.ts`, 21 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Thrown by `CreateLandingBackgroundUseCase` when the target section already has an active background — the real guarantee is the partial unique index `UQ_landing_backgrounds_section_active` (this is the friendly pre-check, not the enforcement).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-create-landing-background-use-case-ts), [set-landing-background-active.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-active-use-case-ts), [update-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-update-landing-background-use-case-ts)

#### Clase `SectionAlreadyHasActiveBackgroundError` (L14–20)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Thrown by `CreateLandingBackgroundUseCase` when the target section already has an active background — the real guarantee is the partial unique index `UQ_landing_backgrounds_section_active` (this is the friendly pre-check, not the enforcement). The frontend is expected to already know this before ever calling create (its own already-loaded list tells it which sections are taken), same "ya existe, ¿desea activarla?" pattern already established for presentation-types/units- of-measure — this error is the safety net for a stale list or a direct API call, not the primary UX path.
- **Dependencias inyectadas (constructor):** `sectionKey: string`
<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts"></a>

### landing-background.repository.ts

- **Ruta:** [landing-background.repository.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/domain/repositories/landing-background.repository.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/domain/repositories/landing-background.repository.ts`, 52 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `LandingBackgroundVisualConfig`, `CreateLandingBackgroundData`, `UpdateLandingBackgroundData`, `ListLandingBackgroundsOptions`, `LandingBackgroundImageBytes` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [landing-section-key.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-landing-section-key-ts), [visual-config.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-visual-config-ts), [landing-background.entity.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-entities-landing-background-entity-ts)
- **Consumidores:** [create-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-create-landing-background-use-case-ts), [get-landing-background-by-id.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-by-id-use-case-ts), [get-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-image-use-case-ts), [list-landing-backgrounds.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-landing-backgrounds-use-case-ts), [list-published-landing-backgrounds.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-published-landing-backgrounds-use-case-ts), [remove-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-remove-landing-background-image-use-case-ts), [set-landing-background-active.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-active-use-case-ts), [set-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-image-use-case-ts), [update-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-update-landing-background-use-case-ts), [typeorm-landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-typeorm-landing-background-repository-ts), [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts)

**Interfaces, tipos y enums:**

- `interface LandingBackgroundVisualConfig` (L7): sin documentación — miembros: `opacity`, `overlay`, `position`, `size`, `depthEffect`, `parallax`, `movement`
- `interface CreateLandingBackgroundData` (L17) extends LandingBackgroundVisualConfig: sin documentación — miembros: `name`, `sectionKey`, `createdBy`
- `interface UpdateLandingBackgroundData` (L23) extends LandingBackgroundVisualConfig: sin documentación — miembros: `name`, `sectionKey`, `updatedBy`
- `interface ListLandingBackgroundsOptions` (L29): sin documentación — miembros: `includeInactive`
- `interface LandingBackgroundImageBytes` (L33): sin documentación — miembros: `data`, `mimeType`
- `interface LandingBackgroundRepository` (L38): sin documentación — miembros: `findAll`, `findById`, `findActiveBySectionKey`, `findPublished`, `create`, `update`, `setActive`, `setImage`, `removeImage`, `getImage`

**Constantes exportadas:**

- `LANDING_BACKGROUND_REPOSITORY` (L5) = `Symbol('LANDING_BACKGROUND_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-landing-background-mapper-ts"></a>

### landing-background.mapper.ts

- **Ruta:** [landing-background.mapper.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/landing-background.mapper.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/landing-background.mapper.ts`, 28 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Mapper: declara `LandingBackgroundMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [landing-background.entity.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-entities-landing-background-entity-ts), [landing-background.orm-entity.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-landing-background-orm-entity-ts)
- **Consumidores:** [typeorm-landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-typeorm-landing-background-repository-ts)

#### Clase `LandingBackgroundMapper` (L4–27)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–26 | `orm: LandingBackgroundOrmEntity` | `LandingBackground` |

##### `LandingBackgroundMapper.toDomain`

- **Firma:** `toDomain(orm: LandingBackgroundOrmEntity): LandingBackground` — [landing-background.mapper.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/landing-background.mapper.ts#L5) (L5–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `LandingBackground.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-typeorm-landing-background-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-landing-background-orm-entity-ts"></a>

### landing-background.orm-entity.ts

- **Ruta:** [landing-background.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/landing-background.orm-entity.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/landing-background.orm-entity.ts`, 86 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** `imageData` usa `select: false` — mismo patrón que Teléfonos/Librería/Variedades/Noticias/Catálogo de Bancos: nunca viaja en un listado normal, solo `getImage()` la selecciona explícitamente.
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [landing-section-key.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-landing-section-key-ts), [visual-config.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-visual-config-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [landing-background.mapper.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-landing-background-mapper-ts), [typeorm-landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-typeorm-landing-background-repository-ts), [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts)

#### Clase `LandingBackgroundOrmEntity` (L22–85)

- **Decoradores:** `@Entity('landing_backgrounds')`
- **Propósito:** `imageData` usa `select: false` — mismo patrón que Teléfonos/Librería/Variedades/Noticias/Catálogo de Bancos: nunca viaja en un listado normal, solo `getImage()` la selecciona explícitamente.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column sectionKey: LandingSectionKey`, `@Column imageData: Buffer \| null`, `@Column imageMimeType: string \| null`, `@Column imageSizeBytes: number \| null`, `@Column opacity: number`, `@Column overlay: OverlayLevel`, `@Column position: BackgroundPosition`, `@Column size: BackgroundSize`, `@Column depthEffect: DepthEffect`, `@Column parallax: ParallaxIntensity`, `@Column movement: MovementMode`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-typeorm-landing-background-repository-ts"></a>

### typeorm-landing-background.repository.ts

- **Ruta:** [typeorm-landing-background.repository.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts`, 151 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmLandingBackgroundRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [landing-background.entity.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-entities-landing-background-entity-ts), [landing-section-key.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-landing-section-key-ts), [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [landing-background.orm-entity.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-landing-background-orm-entity-ts), [landing-background.mapper.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-landing-background-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts)

#### Clase `TypeOrmLandingBackgroundRepository` (L16–150)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements LandingBackgroundRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(LandingBackgroundOrmEntity) repository: Repository<LandingBackgroundOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `baseQuery` | método private | 23–28 | — | `SelectQueryBuilder<LandingBackgroundOrmEntity>` |
| `findAll` | método public async | 30–38 | `options?: ListLandingBackgroundsOptions` | `Promise<LandingBackground[]>` |
| `findById` | método public async | 40–43 | `id: string` | `Promise<LandingBackground \| null>` |
| `findActiveBySectionKey` | método public async | 45–51 | `sectionKey: LandingSectionKey` | `Promise<LandingBackground \| null>` |
| `findPublished` | método public async | 53–56 | — | `Promise<LandingBackground[]>` |
| `create` | método public async | 58–75 | `data: CreateLandingBackgroundData` | `Promise<LandingBackground>` |
| `update` | método public async | 77–110 | `id: string`, `data: UpdateLandingBackgroundData` | `Promise<LandingBackground>` |
| `setActive` | método public async | 112–114 | `id: string`, `isActive: boolean`, `updatedBy: string` | `Promise<void>` |
| `setImage` | método public async | 116–130 | `id: string`, `image: { data: Buffer; mimeType: string; sizeBytes: number }`, `updatedBy: string` | `Promise<void>` |
| `removeImage` | método public async | 132–137 | `id: string`, `updatedBy: string` | `Promise<void>` |
| `getImage` | método public async | 139–149 | `id: string` | `Promise<LandingBackgroundImageBytes \| null>` |

##### `TypeOrmLandingBackgroundRepository.baseQuery`

- **Firma:** `baseQuery(): SelectQueryBuilder<LandingBackgroundOrmEntity>` — [typeorm-landing-background.repository.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts#L23) (L23–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('b').leftJoinAndSelect`, `this.repository.createQueryBuilder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmLandingBackgroundRepository.findAll`

- **Firma:** `findAll(options?: ListLandingBackgroundsOptions): Promise<LandingBackground[]>` — [typeorm-landing-background.repository.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts#L30) (L30–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery`, `query.andWhere`, `query.orderBy`, `query.getMany`, `orms.map`, `LandingBackgroundMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmLandingBackgroundRepository.findById`

- **Firma:** `findById(id: string): Promise<LandingBackground \| null>` — [typeorm-landing-background.repository.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts#L40) (L40–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('b.id = :id', { id }).getOne`, `this.baseQuery().andWhere`, `this.baseQuery`, `LandingBackgroundMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmLandingBackgroundRepository.findActiveBySectionKey`

- **Firma:** `findActiveBySectionKey(sectionKey: LandingSectionKey): Promise<LandingBackground \| null>` — [typeorm-landing-background.repository.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts#L45) (L45–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('b.sectionKey = :sectionKey', { sectionKey }).andWhere`, `this.baseQuery().andWhere`, `this.baseQuery`, `LandingBackgroundMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmLandingBackgroundRepository.findPublished`

- **Firma:** `findPublished(): Promise<LandingBackground[]>` — [typeorm-landing-background.repository.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts#L53) (L53–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery().andWhere('b.isActive = true').getMany`, `this.baseQuery().andWhere`, `this.baseQuery`, `orms.map`, `LandingBackgroundMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmLandingBackgroundRepository.create`

- **Firma:** `create(data: CreateLandingBackgroundData): Promise<LandingBackground>` — [typeorm-landing-background.repository.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts#L58) (L58–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.findById`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmLandingBackgroundRepository.update`

- **Firma:** `update(id: string, data: UpdateLandingBackgroundData): Promise<LandingBackground>` — [typeorm-landing-background.repository.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts#L77) (L77–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.findById`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmLandingBackgroundRepository.setActive`

- **Firma:** `setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>` — [typeorm-landing-background.repository.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts#L112) (L112–114)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmLandingBackgroundRepository.setImage`

- **Firma:** `setImage(id: string, image: { data: Buffer; mimeType: string; sizeBytes: number }, updatedBy: string): Promise<void>` — [typeorm-landing-background.repository.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts#L116) (L116–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmLandingBackgroundRepository.removeImage`

- **Firma:** `removeImage(id: string, updatedBy: string): Promise<void>` — [typeorm-landing-background.repository.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts#L132) (L132–137)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmLandingBackgroundRepository.getImage`

- **Firma:** `getImage(id: string): Promise<LandingBackgroundImageBytes \| null>` — [typeorm-landing-background.repository.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts#L139) (L139–149)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('b').select`, `this.repository.createQueryBuilder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts"></a>

### landing-backgrounds.module.ts

- **Ruta:** [landing-backgrounds.module.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/landing-backgrounds.module.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/landing-backgrounds.module.ts`, 43 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** "Fondos de Landing" — capas visuales de profundidad (marca de agua + parallax + iluminación + 3D) asignadas a una sección real de la landing pública.
- **Depende de (archivos del proyecto):** [landing-background.orm-entity.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-landing-background-orm-entity-ts), [typeorm-landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-infrastructure-persistence-typeorm-landing-background-repository-ts), [landing-background.repository.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-repositories-landing-background-repository-ts), [create-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-create-landing-background-use-case-ts), [update-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-update-landing-background-use-case-ts), [list-landing-backgrounds.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-landing-backgrounds-use-case-ts), [get-landing-background-by-id.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-by-id-use-case-ts), [set-landing-background-active.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-active-use-case-ts), [set-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-image-use-case-ts), [remove-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-remove-landing-background-image-use-case-ts), [list-published-landing-backgrounds.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-published-landing-backgrounds-use-case-ts), [get-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-image-use-case-ts), [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts), [public-landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-public-landing-backgrounds-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `LandingBackgroundsModule` (L26–42)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([LandingBackgroundOrmEntity])], controllers: [LandingBackgroundsController, PublicLandingBackgroundsController], pro`
- **Propósito:** "Fondos de Landing" — capas visuales de profundidad (marca de agua + parallax + iluminación + 3D) asignadas a una sección real de la landing pública. Completamente independiente de los catálogos de contenido (Teléfonos/Librería/Variedades/Bancos/Noticias) — nunca comparte tabla ni lógica con ellos, aunque reutiliza el mismo patrón BYTEA de imagen que todos ya usan.
<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts"></a>

### landing-backgrounds.controller.ts

- **Ruta:** [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts`, 143 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Admin-only end to end — "Sistema → Fondos de Landing".
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-create-landing-background-use-case-ts), [update-landing-background.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-update-landing-background-use-case-ts), [list-landing-backgrounds.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-landing-backgrounds-use-case-ts), [get-landing-background-by-id.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-by-id-use-case-ts), [set-landing-background-active.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-active-use-case-ts), [set-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-set-landing-background-image-use-case-ts), [remove-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-remove-landing-background-image-use-case-ts), [create-landing-background.request.dto.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-create-landing-background-request-dto-ts), [update-landing-background.request.dto.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-update-landing-background-request-dto-ts), [list-landing-backgrounds.query.dto.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-list-landing-backgrounds-query-dto-ts), [landing-background.response.dto.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-landing-background-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/platform-express`
- **Consumidores:** [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts)

**Interfaces, tipos y enums:**

- `interface UploadedImageFile` (L34): sin documentación — miembros: `buffer`, `mimetype`, `size`

#### Clase `LandingBackgroundsController` (L46–142)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('landing-backgrounds')`
- **Propósito:** Admin-only end to end — "Sistema → Fondos de Landing". Nunca reemplaza ni se mezcla con los catálogos de contenido (Teléfonos/Librería/ Variedades/Bancos/Noticias) — esto es exclusivamente la capa visual de fondo de una sección, no un ítem de catálogo.
- **Dependencias inyectadas (constructor):** `createLandingBackgroundUseCase: CreateLandingBackgroundUseCase`, `updateLandingBackgroundUseCase: UpdateLandingBackgroundUseCase`, `listLandingBackgroundsUseCase: ListLandingBackgroundsUseCase`, `getLandingBackgroundByIdUseCase: GetLandingBackgroundByIdUseCase`, `setLandingBackgroundActiveUseCase: SetLandingBackgroundActiveUseCase`, `setLandingBackgroundImageUseCase: SetLandingBackgroundImageUseCase`, `removeLandingBackgroundImageUseCase: RemoveLandingBackgroundImageUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 60–78 | `dto: CreateLandingBackgroundRequestDto`, `userId: string` | `Promise<LandingBackgroundResponseDto>` |
| `findAll` | método public | 80–83 | `query: ListLandingBackgroundsQueryDto` | `Promise<LandingBackgroundResponseDto[]>` |
| `findOne` | método public | 85–88 | `id: string` | `Promise<LandingBackgroundResponseDto>` |
| `update` | método public | 90–108 | `id: string`, `dto: UpdateLandingBackgroundRequestDto`, `userId: string` | `Promise<LandingBackgroundResponseDto>` |
| `activate` | método public | 110–114 | `id: string`, `userId: string` | `Promise<void>` |
| `deactivate` | método public | 116–120 | `id: string`, `userId: string` | `Promise<void>` |
| `setImage` | método public | 122–135 | `landingBackgroundId: string`, `image: UploadedImageFile`, `userId: string` | `Promise<void>` |
| `removeImage` | método public | 137–141 | `id: string`, `userId: string` | `Promise<void>` |

##### `LandingBackgroundsController.create`

- **Firma:** `create(dto: CreateLandingBackgroundRequestDto, userId: string): Promise<LandingBackgroundResponseDto>` — [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L60) (L60–78)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createLandingBackgroundUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackgroundsController.findAll`

- **Firma:** `findAll(query: ListLandingBackgroundsQueryDto): Promise<LandingBackgroundResponseDto[]>` — [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L80) (L80–83)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listLandingBackgroundsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackgroundsController.findOne`

- **Firma:** `findOne(id: string): Promise<LandingBackgroundResponseDto>` — [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L85) (L85–88)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getLandingBackgroundByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackgroundsController.update`

- **Firma:** `update(id: string, dto: UpdateLandingBackgroundRequestDto, userId: string): Promise<LandingBackgroundResponseDto>` — [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L90) (L90–108)
- **Decoradores:** `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateLandingBackgroundUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackgroundsController.activate`

- **Firma:** `activate(id: string, userId: string): Promise<void>` — [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L110) (L110–114)
- **Decoradores:** `@Post(':id/activate')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setLandingBackgroundActiveUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackgroundsController.deactivate`

- **Firma:** `deactivate(id: string, userId: string): Promise<void>` — [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L116) (L116–120)
- **Decoradores:** `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setLandingBackgroundActiveUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackgroundsController.setImage`

- **Firma:** `setImage(landingBackgroundId: string, image: UploadedImageFile, userId: string): Promise<void>` — [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L122) (L122–135)
- **Decoradores:** `@Post(':id/image')` `@UseInterceptors(FileInterceptor('image'))` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) landingBackgroundId`, `@UploadedFile() image`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setLandingBackgroundImageUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingBackgroundsController.removeImage`

- **Firma:** `removeImage(id: string, userId: string): Promise<void>` — [landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts#L137) (L137–141)
- **Decoradores:** `@Delete(':id/image')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.removeLandingBackgroundImageUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-public-landing-backgrounds-controller-ts"></a>

### public-landing-backgrounds.controller.ts

- **Ruta:** [public-landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/public-landing-backgrounds.controller.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/public-landing-backgrounds.controller.ts`, 38 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Público, sin guard — backs la capa de fondos 3D de la landing.
- **Depende de (archivos del proyecto):** [list-published-landing-backgrounds.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-list-published-landing-backgrounds-use-case-ts), [get-landing-background-image.use-case.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-application-use-cases-get-landing-background-image-use-case-ts), [public-landing-background.response.dto.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-public-landing-background-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [landing-backgrounds.module.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-landing-backgrounds-module-ts)

#### Clase `PublicLandingBackgroundsController` (L14–37)

- **Decoradores:** `@Controller('public-landing-backgrounds')`
- **Propósito:** Público, sin guard — backs la capa de fondos 3D de la landing. Mismo header `Cross-Origin-Resource-Policy: cross-origin` que Teléfonos/ Librería/Variedades/Noticias/Catálogo de Bancos para que `&lt;img&gt;`/ `background-image` carguen entre orígenes. No expone `isActive`/audit/ usuarios — solo lo que la capa visual necesita para renderizarse.
- **Dependencias inyectadas (constructor):** `listPublishedLandingBackgroundsUseCase: ListPublishedLandingBackgroundsUseCase`, `getLandingBackgroundImageUseCase: GetLandingBackgroundImageUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 21–24 | — | `Promise<PublicLandingBackgroundResponseDto[]>` |
| `getImage` | método public async | 26–36 | `id: string`, `res: Response` | `Promise<void>` |

##### `PublicLandingBackgroundsController.findAll`

- **Firma:** `findAll(): Promise<PublicLandingBackgroundResponseDto[]>` — [public-landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/public-landing-backgrounds.controller.ts#L21) (L21–24)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.listPublishedLandingBackgroundsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicLandingBackgroundsController.getImage`

- **Firma:** `getImage(id: string, res: Response): Promise<void>` — [public-landing-backgrounds.controller.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/public-landing-backgrounds.controller.ts#L26) (L26–36)
- **Decoradores:** `@Get('images/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.getLandingBackgroundImageUseCase.execute`, `res.set`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-create-landing-background-request-dto-ts"></a>

### create-landing-background.request.dto.ts

- **Ruta:** [create-landing-background.request.dto.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/dtos/create-landing-background.request.dto.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/presentation/dtos/create-landing-background.request.dto.ts`, 60 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** DTO de entrada: declara `CreateLandingBackgroundRequestDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [landing-section-key.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-landing-section-key-ts), [visual-config.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-visual-config-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

#### Clase `CreateLandingBackgroundRequestDto` (L21–59)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-landing-background-response-dto-ts"></a>

### landing-background.response.dto.ts

- **Ruta:** [landing-background.response.dto.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/dtos/landing-background.response.dto.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/presentation/dtos/landing-background.response.dto.ts`, 21 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** DTO de respuesta: declara `LandingBackgroundResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

#### Clase `LandingBackgroundResponseDto` (L1–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-list-landing-backgrounds-query-dto-ts"></a>

### list-landing-backgrounds.query.dto.ts

- **Ruta:** [list-landing-backgrounds.query.dto.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/dtos/list-landing-backgrounds.query.dto.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/presentation/dtos/list-landing-backgrounds.query.dto.ts`, 10 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** DTO de consulta: declara `ListLandingBackgroundsQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

#### Clase `ListLandingBackgroundsQueryDto` (L4–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-public-landing-background-response-dto-ts"></a>

### public-landing-background.response.dto.ts

- **Ruta:** [public-landing-background.response.dto.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/dtos/public-landing-background.response.dto.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/presentation/dtos/public-landing-background.response.dto.ts`, 14 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** Backs la capa de fondos en la landing pública — sin isActive/audit, solo lo que un visitante puede ver.
- **Consumidores:** [public-landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-public-landing-backgrounds-controller-ts)

#### Clase `PublicLandingBackgroundResponseDto` (L2–13)

- **Propósito:** Backs la capa de fondos en la landing pública — sin isActive/audit, solo lo que un visitante puede ver.
<a id="f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-dtos-update-landing-background-request-dto-ts"></a>

### update-landing-background.request.dto.ts

- **Ruta:** [update-landing-background.request.dto.ts](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/dtos/update-landing-background.request.dto.ts) (`comercial-jhoel-api/src/modules/landing-backgrounds/presentation/dtos/update-landing-background.request.dto.ts`, 62 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `landing-backgrounds`
- **Responsabilidad:** DTO de entrada: declara `UpdateLandingBackgroundRequestDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [landing-section-key.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-landing-section-key-ts), [visual-config.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-domain-constants-visual-config-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [landing-backgrounds.controller.ts](landing-backgrounds.md#f-comercial-jhoel-api-src-modules-landing-backgrounds-presentation-controllers-landing-backgrounds-controller-ts)

#### Clase `UpdateLandingBackgroundRequestDto` (L21–61)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
