# Módulo backend `company-settings`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/company-settings` | [company-settings.controller.ts](../../../../comercial-jhoel-api/src/modules/company-settings/presentation/controllers/company-settings.controller.ts#L26) `CompanySettingsController.get` | [GetCompanySettingsUseCase](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-ts) | `CompanySettingsRepository`.get | UseGuards(JwtAuthGuard) | `CompanySettingsService.getCompanySettings` |
| `PATCH /api/company-settings` | [company-settings.controller.ts](../../../../comercial-jhoel-api/src/modules/company-settings/presentation/controllers/company-settings.controller.ts#L31) `CompanySettingsController.update` | [UpdateCompanySettingsUseCase](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-ts) | `CompanySettingsRepository`.update | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `CompanySettingsService.updateCompanySettings` |
| `GET /api/company-info` | [public-company.controller.ts](../../../../comercial-jhoel-api/src/modules/company-settings/presentation/controllers/public-company.controller.ts#L19) `PublicCompanyController.get` | [GetPublicCompanyInfoUseCase](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-public-company-info-use-case-ts) | `CompanySettingsRepository`.get | — | `CompanySettingsService.getPublicInfo` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [company-settings-output.ts](#f-comercial-jhoel-api-src-modules-company-settings-application-dtos-company-settings-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toCompanySettingsOutput`, `CompanySettingsOutput` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [public-company-info-output.ts](#f-comercial-jhoel-api-src-modules-company-settings-application-dtos-public-company-info-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Deliberately narrow — backs the PUBLIC landing page's "Contacto" section. | 1 internas | 1 | Baja (1 consumidores) |
| [get-company-settings.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria (sin comentario de documentación en el código). | 3 internas | 0 | Soporte (pruebas) |
| [get-company-settings.use-case.ts](#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetCompanySettingsUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-public-company-info.use-case.ts](#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-public-company-info-use-case-ts) | .ts | Caso de uso | Aplicación | Backs the public landing page's "Contacto" section — reuses the same `CompanySettingsRepository.get()` every PDF letterhead already reads, never a second source of truth for company data. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-company-settings.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria (sin comentario de documentación en el código). | 3 internas | 0 | Soporte (pruebas) |
| [update-company-settings.use-case.ts](#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateCompanySettingsUseCase`, `UpdateCompanySettingsInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [company-settings.module.ts](#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `CompanySettingsModule` (sin comentario de documentación en el código). | 8 internas; ext.: @nestjs/common, @nestjs/typeorm | 6 | Media (6 consumidores) |
| [company-settings.entity.ts](#f-comercial-jhoel-api-src-modules-company-settings-domain-entities-company-settings-entity-ts) | .ts | Entidad de dominio | Dominio | A genuine singleton — exactly one row always exists (seeded empty by migration `1760001000000-CreateDocumentsModule`). | 0 internas | 7 | Media (7 consumidores) |
| [company-settings.repository.ts](#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `UpdateCompanySettingsData`, `CompanySettingsRepository`, `COMPANY_SETTINGS_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 18 | Alta (18 consumidores) |
| [company-settings.mapper.ts](#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-company-settings-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `CompanySettingsMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [company-settings.orm-entity.ts](#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-company-settings-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `CompanySettingsOrmEntity` (sin comentario de documentación en el código). | 2 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [typeorm-company-settings.repository.ts](#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-typeorm-company-settings-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmCompanySettingsRepository` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [company-settings.controller.ts](#f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-company-settings-controller-ts) | .ts | Controlador | Presentación | "Configuración de Empresa" — the one centralized source of branding/ contact data (logo, name, address, phone, email, NIT) every document PDF (Venta, Compra, Ticket, Cotización) reads its letterhead from. | 8 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [public-company.controller.ts](#f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-public-company-controller-ts) | .ts | Controlador | Presentación | Public, unauthenticated — backs the landing page's "Contacto" section. | 2 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [company-settings.response.dto.ts](#f-comercial-jhoel-api-src-modules-company-settings-presentation-dtos-company-settings-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `CompanySettingsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [public-company-info.response.dto.ts](#f-comercial-jhoel-api-src-modules-company-settings-presentation-dtos-public-company-info-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `PublicCompanyInfoResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [update-company-settings.request.dto.ts](#f-comercial-jhoel-api-src-modules-company-settings-presentation-dtos-update-company-settings-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateCompanySettingsRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-company-settings-application-dtos-company-settings-output-ts"></a>

### company-settings-output.ts

- **Ruta:** [company-settings-output.ts](../../../../comercial-jhoel-api/src/modules/company-settings/application/dtos/company-settings-output.ts) (`comercial-jhoel-api/src/modules/company-settings/application/dtos/company-settings-output.ts`, 44 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** DTO de salida (aplicación): declara `toCompanySettingsOutput`, `CompanySettingsOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [company-settings.entity.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-entities-company-settings-entity-ts)
- **Consumidores:** [get-company-settings.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-ts), [update-company-settings.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-ts)

**Interfaces, tipos y enums:**

- `interface CompanySettingsOutput` (L3): sin documentación — miembros: `businessName`, `address`, `phone`, `email`, `taxId`, `logoBase64`, `socialMedia`, `whatsapp`, `website`, `businessHours`, `facebookUrl`, `instagramUrl`, `tiktokUrl`, `krediyaMinAmount`, `updatedAt`, `updatedByUsername`
#### Función `toCompanySettingsOutput` (L22–43)

- **Tipo:** función exportada
- **Firma:** `toCompanySettingsOutput(settings: CompanySettings): CompanySettingsOutput` — [company-settings-output.ts](../../../../comercial-jhoel-api/src/modules/company-settings/application/dtos/company-settings-output.ts#L22)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-company-settings.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-ts), [update-company-settings.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-company-settings-application-dtos-public-company-info-output-ts"></a>

### public-company-info-output.ts

- **Ruta:** [public-company-info-output.ts](../../../../comercial-jhoel-api/src/modules/company-settings/application/dtos/public-company-info-output.ts) (`comercial-jhoel-api/src/modules/company-settings/application/dtos/public-company-info-output.ts`, 40 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** Deliberately narrow — backs the PUBLIC landing page's "Contacto" section.
- **Depende de (archivos del proyecto):** [company-settings.entity.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-entities-company-settings-entity-ts)
- **Consumidores:** [get-public-company-info.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-public-company-info-use-case-ts)

**Interfaces, tipos y enums:**

- `interface PublicCompanyInfoOutput` (L11): Deliberately narrow — backs the PUBLIC landing page's "Contacto" section. — miembros: `businessName`, `address`, `phone`, `whatsapp`, `email`, `website`, `businessHours`, `facebookUrl`, `instagramUrl`, `tiktokUrl`
#### Función `toPublicCompanyInfoOutput` (L24–39)

- **Tipo:** función exportada
- **Firma:** `toPublicCompanyInfoOutput(settings: CompanySettings): PublicCompanyInfoOutput` — [public-company-info-output.ts](../../../../comercial-jhoel-api/src/modules/company-settings/application/dtos/public-company-info-output.ts#L24)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-public-company-info.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-public-company-info-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-spec-ts"></a>

### get-company-settings.use-case.spec.ts

- **Ruta:** [get-company-settings.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/company-settings/application/use-cases/get-company-settings.use-case.spec.ts) (`comercial-jhoel-api/src/modules/company-settings/application/use-cases/get-company-settings.use-case.spec.ts`, 40 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [get-company-settings.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [company-settings.entity.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-entities-company-settings-entity-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-ts"></a>

### get-company-settings.use-case.ts

- **Ruta:** [get-company-settings.use-case.ts](../../../../comercial-jhoel-api/src/modules/company-settings/application/use-cases/get-company-settings.use-case.ts) (`comercial-jhoel-api/src/modules/company-settings/application/use-cases/get-company-settings.use-case.ts`, 21 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** Caso de uso: declara `GetCompanySettingsUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [company-settings-output.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-dtos-company-settings-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [get-company-settings.use-case.spec.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-spec-ts), [company-settings.module.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts), [company-settings.controller.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-company-settings-controller-ts)

#### Clase `GetCompanySettingsUseCase` (L9–20)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 16–19 | — | `Promise<CompanySettingsOutput>` |

##### `GetCompanySettingsUseCase.execute`

- **Firma:** `execute(): Promise<CompanySettingsOutput>` — [get-company-settings.use-case.ts](../../../../comercial-jhoel-api/src/modules/company-settings/application/use-cases/get-company-settings.use-case.ts#L16) (L16–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.companySettingsRepository.get`, `toCompanySettingsOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [company-settings.controller.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-company-settings-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-public-company-info-use-case-ts"></a>

### get-public-company-info.use-case.ts

- **Ruta:** [get-public-company-info.use-case.ts](../../../../comercial-jhoel-api/src/modules/company-settings/application/use-cases/get-public-company-info.use-case.ts) (`comercial-jhoel-api/src/modules/company-settings/application/use-cases/get-public-company-info.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** Backs the public landing page's "Contacto" section — reuses the same `CompanySettingsRepository.get()` every PDF letterhead already reads, never a second source of truth for company data.
- **Depende de (archivos del proyecto):** [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [public-company-info-output.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-dtos-public-company-info-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [company-settings.module.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts), [public-company.controller.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-public-company-controller-ts)

#### Clase `GetPublicCompanyInfoUseCase` (L10–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Backs the public landing page's "Contacto" section — reuses the same `CompanySettingsRepository.get()` every PDF letterhead already reads, never a second source of truth for company data.
- **Dependencias inyectadas (constructor):** `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–20 | — | `Promise<PublicCompanyInfoOutput>` |

##### `GetPublicCompanyInfoUseCase.execute`

- **Firma:** `execute(): Promise<PublicCompanyInfoOutput>` — [get-public-company-info.use-case.ts](../../../../comercial-jhoel-api/src/modules/company-settings/application/use-cases/get-public-company-info.use-case.ts#L17) (L17–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.companySettingsRepository.get`, `toPublicCompanyInfoOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [public-company.controller.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-public-company-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-spec-ts"></a>

### update-company-settings.use-case.spec.ts

- **Ruta:** [update-company-settings.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/company-settings/application/use-cases/update-company-settings.use-case.spec.ts) (`comercial-jhoel-api/src/modules/company-settings/application/use-cases/update-company-settings.use-case.spec.ts`, 48 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [update-company-settings.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [company-settings.entity.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-entities-company-settings-entity-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-ts"></a>

### update-company-settings.use-case.ts

- **Ruta:** [update-company-settings.use-case.ts](../../../../comercial-jhoel-api/src/modules/company-settings/application/use-cases/update-company-settings.use-case.ts) (`comercial-jhoel-api/src/modules/company-settings/application/use-cases/update-company-settings.use-case.ts`, 41 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** Caso de uso: declara `UpdateCompanySettingsUseCase`, `UpdateCompanySettingsInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [company-settings-output.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-dtos-company-settings-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [update-company-settings.use-case.spec.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-spec-ts), [company-settings.module.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts), [company-settings.controller.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-company-settings-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateCompanySettingsInput` (L9): sin documentación — miembros: `businessName`, `address`, `phone`, `email`, `taxId`, `logoBase64`, `socialMedia`, `whatsapp`, `website`, `businessHours`, `facebookUrl`, `instagramUrl`, `tiktokUrl`, `krediyaMinAmount`, `updatedBy`

#### Clase `UpdateCompanySettingsUseCase` (L27–40)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 34–39 | `input: UpdateCompanySettingsInput` | `Promise<CompanySettingsOutput>` |

##### `UpdateCompanySettingsUseCase.execute`

- **Firma:** `execute(input: UpdateCompanySettingsInput): Promise<CompanySettingsOutput>` — [update-company-settings.use-case.ts](../../../../comercial-jhoel-api/src/modules/company-settings/application/use-cases/update-company-settings.use-case.ts#L34) (L34–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.companySettingsRepository.update`, `toCompanySettingsOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.companySettingsRepository.update`
- **Consumidores:** [company-settings.controller.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-company-settings-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts"></a>

### company-settings.module.ts

- **Ruta:** [company-settings.module.ts](../../../../comercial-jhoel-api/src/modules/company-settings/company-settings.module.ts) (`comercial-jhoel-api/src/modules/company-settings/company-settings.module.ts`, 28 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** Módulo: declara `CompanySettingsModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [company-settings.orm-entity.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-company-settings-orm-entity-ts), [typeorm-company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-typeorm-company-settings-repository-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [get-company-settings.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-ts), [update-company-settings.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-ts), [get-public-company-info.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-public-company-info-use-case-ts), [company-settings.controller.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-company-settings-controller-ts), [public-company.controller.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-public-company-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [catalog.module.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-catalog-module-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts), [tickets.module.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts)

#### Clase `CompanySettingsModule` (L12–27)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([CompanySettingsOrmEntity])], controllers: [CompanySettingsController, PublicCompanyController], providers: [ { prov`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-company-settings-domain-entities-company-settings-entity-ts"></a>

### company-settings.entity.ts

- **Ruta:** [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts) (`comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts`, 105 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** A genuine singleton — exactly one row always exists (seeded empty by migration `1760001000000-CreateDocumentsModule`).
- **Consumidores:** [company-settings-output.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-dtos-company-settings-output-ts), [public-company-info-output.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-dtos-public-company-info-output-ts), [get-company-settings.use-case.spec.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-spec-ts), [update-company-settings.use-case.spec.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-spec-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [company-settings.mapper.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-company-settings-mapper-ts), [typeorm-company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-typeorm-company-settings-repository-ts)

**Interfaces, tipos y enums:**

- `interface CompanySettingsProps` (L1): sin documentación — miembros: `id`, `businessName`, `address`, `phone`, `email`, `taxId`, `logoBase64`, `socialMedia`, `whatsapp`, `website`, `businessHours`, `facebookUrl`, `instagramUrl`, `tiktokUrl`, `krediyaMinAmount`, `updatedAt`, `updatedBy`, `updatedByUsername`

#### Clase `CompanySettings` (L26–104)

- **Propósito:** A genuine singleton — exactly one row always exists (seeded empty by migration `1760001000000-CreateDocumentsModule`). Holds the branding/contact data (business name, address, phone, email, NIT, logo, social media) every document PDF's letterhead needs (Venta, Compra, Ticket, Cotización) — never hardcoded per document type.
- **Dependencias inyectadas (constructor):** `props: CompanySettingsProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 29–31 | `props: CompanySettingsProps` | `CompanySettings` |
| `id` | getter public | 33–35 | — | `string` |
| `businessName` | getter public | 37–39 | — | `string` |
| `address` | getter public | 41–43 | — | `string \| null` |
| `phone` | getter public | 45–47 | — | `string \| null` |
| `email` | getter public | 49–51 | — | `string \| null` |
| `taxId` | getter public | 53–55 | — | `string \| null` |
| `logoBase64` | getter public | 57–59 | — | `string \| null` |
| `socialMedia` | getter public | 61–63 | — | `string \| null` |
| `whatsapp` | getter public | 65–67 | — | `string \| null` |
| `website` | getter public | 69–71 | — | `string \| null` |
| `businessHours` | getter public | 73–75 | — | `string \| null` |
| `facebookUrl` | getter public | 77–79 | — | `string \| null` |
| `instagramUrl` | getter public | 81–83 | — | `string \| null` |
| `tiktokUrl` | getter public | 85–87 | — | `string \| null` |
| `krediyaMinAmount` | getter public | 89–91 | — | `number \| null` |
| `updatedAt` | getter public | 93–95 | — | `Date` |
| `updatedBy` | getter public | 97–99 | — | `string \| null` |
| `updatedByUsername` | getter public | 101–103 | — | `string \| null` |

##### `CompanySettings.create`

- **Firma:** `create(props: CompanySettingsProps): CompanySettings` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new CompanySettings`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [company-settings.mapper.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-company-settings-mapper-ts)

##### `CompanySettings.id`

- **Firma:** `id(): string` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.businessName`

- **Firma:** `businessName(): string` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.address`

- **Firma:** `address(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.phone`

- **Firma:** `phone(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.email`

- **Firma:** `email(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.taxId`

- **Firma:** `taxId(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.logoBase64`

- **Firma:** `logoBase64(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.socialMedia`

- **Firma:** `socialMedia(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.whatsapp`

- **Firma:** `whatsapp(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L65) (L65–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.website`

- **Firma:** `website(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.businessHours`

- **Firma:** `businessHours(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.facebookUrl`

- **Firma:** `facebookUrl(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.instagramUrl`

- **Firma:** `instagramUrl(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.tiktokUrl`

- **Firma:** `tiktokUrl(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.krediyaMinAmount`

- **Firma:** `krediyaMinAmount(): number \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L89) (L89–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.updatedAt`

- **Firma:** `updatedAt(): Date` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L93) (L93–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L97) (L97–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettings.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [company-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/entities/company-settings.entity.ts#L101) (L101–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts"></a>

### company-settings.repository.ts

- **Ruta:** [company-settings.repository.ts](../../../../comercial-jhoel-api/src/modules/company-settings/domain/repositories/company-settings.repository.ts) (`comercial-jhoel-api/src/modules/company-settings/domain/repositories/company-settings.repository.ts`, 31 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `UpdateCompanySettingsData`, `CompanySettingsRepository`, `COMPANY_SETTINGS_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [company-settings.entity.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-entities-company-settings-entity-ts)
- **Consumidores:** [create-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-phone-use-case-ts), [create-catalog-request.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-create-catalog-request-use-case-ts), [get-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-catalog-phone-by-id-use-case-ts), [get-published-catalog-phone-by-id.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-get-published-catalog-phone-by-id-use-case-ts), [list-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-catalog-phones-use-case-ts), [list-published-catalog-phones.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-list-published-catalog-phones-use-case-ts), [update-catalog-phone.use-case.ts](catalog.md#f-comercial-jhoel-api-src-modules-catalog-application-use-cases-update-catalog-phone-use-case-ts), [get-company-settings.use-case.spec.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-spec-ts), [get-company-settings.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-ts), [get-public-company-info.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-public-company-info-use-case-ts), [update-company-settings.use-case.spec.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-spec-ts), [update-company-settings.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-ts), [company-settings.module.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts), [typeorm-company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-typeorm-company-settings-repository-ts), [get-purchase-pdf.use-case.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-application-use-cases-get-purchase-pdf-use-case-ts) y 3 más

**Interfaces, tipos y enums:**

- `interface UpdateCompanySettingsData` (L7): sin documentación — miembros: `businessName`, `address`, `phone`, `email`, `taxId`, `logoBase64`, `socialMedia`, `whatsapp`, `website`, `businessHours`, `facebookUrl`, `instagramUrl`, `tiktokUrl`, `krediyaMinAmount`, `updatedBy`
- `interface CompanySettingsRepository` (L25): sin documentación — miembros: `get`, `update`

**Constantes exportadas:**

- `COMPANY_SETTINGS_REPOSITORY` (L3) = `Symbol( 'COMPANY_SETTINGS_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-company-settings-mapper-ts"></a>

### company-settings.mapper.ts

- **Ruta:** [company-settings.mapper.ts](../../../../comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/company-settings.mapper.ts) (`comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/company-settings.mapper.ts`, 28 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** Mapper: declara `CompanySettingsMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [company-settings.entity.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-entities-company-settings-entity-ts), [company-settings.orm-entity.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-company-settings-orm-entity-ts)
- **Consumidores:** [typeorm-company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-typeorm-company-settings-repository-ts)

#### Clase `CompanySettingsMapper` (L4–27)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–26 | `orm: CompanySettingsOrmEntity` | `CompanySettings` |

##### `CompanySettingsMapper.toDomain`

- **Firma:** `toDomain(orm: CompanySettingsOrmEntity): CompanySettings` — [company-settings.mapper.ts](../../../../comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/company-settings.mapper.ts#L5) (L5–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `CompanySettings.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-typeorm-company-settings-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-company-settings-orm-entity-ts"></a>

### company-settings.orm-entity.ts

- **Ruta:** [company-settings.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/company-settings.orm-entity.ts) (`comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/company-settings.orm-entity.ts`, 95 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `CompanySettingsOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [company-settings.module.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts), [company-settings.mapper.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-company-settings-mapper-ts), [typeorm-company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-typeorm-company-settings-repository-ts)

#### Clase `CompanySettingsOrmEntity` (L12–94)

- **Decoradores:** `@Entity('company_settings')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column businessName: string`, `@Column address: string \| null`, `@Column phone: string \| null`, `@Column email: string \| null`, `@Column taxId: string \| null`, `@Column logoBase64: string \| null`, `@Column socialMedia: string \| null`, `@Column whatsapp: string \| null`, `@Column website: string \| null`, `@Column businessHours: string \| null`, `@Column facebookUrl: string \| null`, `@Column instagramUrl: string \| null`, `@Column tiktokUrl: string \| null`, `@Column krediyaMinAmount: number \| null`, `@UpdateDateColumn updatedAt: Date`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-typeorm-company-settings-repository-ts"></a>

### typeorm-company-settings.repository.ts

- **Ruta:** [typeorm-company-settings.repository.ts](../../../../comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/typeorm-company-settings.repository.ts) (`comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/typeorm-company-settings.repository.ts`, 56 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmCompanySettingsRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [company-settings.entity.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-entities-company-settings-entity-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [company-settings.orm-entity.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-company-settings-orm-entity-ts), [company-settings.mapper.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-infrastructure-persistence-company-settings-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [company-settings.module.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts)

#### Clase `TypeOrmCompanySettingsRepository` (L12–55)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements CompanySettingsRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(CompanySettingsOrmEntity) repository: Repository<CompanySettingsOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `get` | método public async | 19–28 | — | `Promise<CompanySettings>` |
| `update` | método public async | 30–54 | `data: UpdateCompanySettingsData` | `Promise<CompanySettings>` |

##### `TypeOrmCompanySettingsRepository.get`

- **Firma:** `get(): Promise<CompanySettings>` — [typeorm-company-settings.repository.ts](../../../../comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/typeorm-company-settings.repository.ts#L19) (L19–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `new InternalServerErrorException`, `CompanySettingsMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InternalServerErrorException( 'No se encontró la configuración de la empresa.', )`
- **Consumidores:** (mismo archivo)

##### `TypeOrmCompanySettingsRepository.update`

- **Firma:** `update(data: UpdateCompanySettingsData): Promise<CompanySettings>` — [typeorm-company-settings.repository.ts](../../../../comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/typeorm-company-settings.repository.ts#L30) (L30–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.get`, `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-company-settings-controller-ts"></a>

### company-settings.controller.ts

- **Ruta:** [company-settings.controller.ts](../../../../comercial-jhoel-api/src/modules/company-settings/presentation/controllers/company-settings.controller.ts) (`comercial-jhoel-api/src/modules/company-settings/presentation/controllers/company-settings.controller.ts`, 57 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** "Configuración de Empresa" — the one centralized source of branding/ contact data (logo, name, address, phone, email, NIT) every document PDF (Venta, Compra, Ticket, Cotización) reads its letterhead from.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-company-settings.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-company-settings-use-case-ts), [update-company-settings.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-update-company-settings-use-case-ts), [update-company-settings.request.dto.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-dtos-update-company-settings-request-dto-ts), [company-settings.response.dto.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-dtos-company-settings-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [company-settings.module.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts)

#### Clase `CompanySettingsController` (L18–56)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('company-settings')`
- **Propósito:** "Configuración de Empresa" — the one centralized source of branding/ contact data (logo, name, address, phone, email, NIT) every document PDF (Venta, Compra, Ticket, Cotización) reads its letterhead from. Reading is open to any authenticated account (every document-generation code path needs it, not just admins); only changing it is a management action.
- **Dependencias inyectadas (constructor):** `getCompanySettingsUseCase: GetCompanySettingsUseCase`, `updateCompanySettingsUseCase: UpdateCompanySettingsUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `get` | método public | 26–29 | — | `Promise<CompanySettingsResponseDto>` |
| `update` | método public | 31–55 | `dto: UpdateCompanySettingsRequestDto`, `userId: string` | `Promise<CompanySettingsResponseDto>` |

##### `CompanySettingsController.get`

- **Firma:** `get(): Promise<CompanySettingsResponseDto>` — [company-settings.controller.ts](../../../../comercial-jhoel-api/src/modules/company-settings/presentation/controllers/company-settings.controller.ts#L26) (L26–29)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getCompanySettingsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettingsController.update`

- **Firma:** `update(dto: UpdateCompanySettingsRequestDto, userId: string): Promise<CompanySettingsResponseDto>` — [company-settings.controller.ts](../../../../comercial-jhoel-api/src/modules/company-settings/presentation/controllers/company-settings.controller.ts#L31) (L31–55)
- **Decoradores:** `@Patch()` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateCompanySettingsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-public-company-controller-ts"></a>

### public-company.controller.ts

- **Ruta:** [public-company.controller.ts](../../../../comercial-jhoel-api/src/modules/company-settings/presentation/controllers/public-company.controller.ts) (`comercial-jhoel-api/src/modules/company-settings/presentation/controllers/public-company.controller.ts`, 24 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** Public, unauthenticated — backs the landing page's "Contacto" section.
- **Depende de (archivos del proyecto):** [get-public-company-info.use-case.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-application-use-cases-get-public-company-info-use-case-ts), [public-company-info.response.dto.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-dtos-public-company-info-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [company-settings.module.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts)

#### Clase `PublicCompanyController` (L13–23)

- **Decoradores:** `@Controller('company-info')`
- **Propósito:** Public, unauthenticated — backs the landing page's "Contacto" section. No class-level guard, same pattern `AuthController` (`login`) and `UsersController` (`register`) already use for their one public route each: never strip the guard off `CompanySettingsController` itself (that route is load-bearing for the authenticated document-generation flows), add a separate, deliberately narrow route instead.
- **Dependencias inyectadas (constructor):** `getPublicCompanyInfoUseCase: GetPublicCompanyInfoUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `get` | método public | 19–22 | — | `Promise<PublicCompanyInfoResponseDto>` |

##### `PublicCompanyController.get`

- **Firma:** `get(): Promise<PublicCompanyInfoResponseDto>` — [public-company.controller.ts](../../../../comercial-jhoel-api/src/modules/company-settings/presentation/controllers/public-company.controller.ts#L19) (L19–22)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getPublicCompanyInfoUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-company-settings-presentation-dtos-company-settings-response-dto-ts"></a>

### company-settings.response.dto.ts

- **Ruta:** [company-settings.response.dto.ts](../../../../comercial-jhoel-api/src/modules/company-settings/presentation/dtos/company-settings.response.dto.ts) (`comercial-jhoel-api/src/modules/company-settings/presentation/dtos/company-settings.response.dto.ts`, 19 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** DTO de respuesta: declara `CompanySettingsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [company-settings.controller.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-company-settings-controller-ts)

#### Clase `CompanySettingsResponseDto` (L1–18)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-company-settings-presentation-dtos-public-company-info-response-dto-ts"></a>

### public-company-info.response.dto.ts

- **Ruta:** [public-company-info.response.dto.ts](../../../../comercial-jhoel-api/src/modules/company-settings/presentation/dtos/public-company-info.response.dto.ts) (`comercial-jhoel-api/src/modules/company-settings/presentation/dtos/public-company-info.response.dto.ts`, 13 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** DTO de respuesta: declara `PublicCompanyInfoResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [public-company.controller.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-public-company-controller-ts)

#### Clase `PublicCompanyInfoResponseDto` (L1–12)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-company-settings-presentation-dtos-update-company-settings-request-dto-ts"></a>

### update-company-settings.request.dto.ts

- **Ruta:** [update-company-settings.request.dto.ts](../../../../comercial-jhoel-api/src/modules/company-settings/presentation/dtos/update-company-settings.request.dto.ts) (`comercial-jhoel-api/src/modules/company-settings/presentation/dtos/update-company-settings.request.dto.ts`, 81 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `company-settings`
- **Responsabilidad:** DTO de entrada: declara `UpdateCompanySettingsRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [company-settings.controller.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-presentation-controllers-company-settings-controller-ts)

#### Clase `UpdateCompanySettingsRequestDto` (L10–80)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
