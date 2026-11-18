# Módulo backend `school-lists`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/school-lists/permissions` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L102) `SchoolListsController.myPermissions` | [GetSchoolListPermissionsUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.loadPermissions` |
| `GET /api/school-lists/templates` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L108) `SchoolListsController.templates` | [ListSchoolTemplatesUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.getTemplates` |
| `GET /api/school-lists/templates/:id` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L119) `SchoolListsController.template` | [GetSchoolTemplateUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.getTemplate` |
| `POST /api/school-lists/templates` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L127) `SchoolListsController.createTemplate` | [SaveSchoolTemplateUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.saveTemplate` |
| `PUT /api/school-lists/templates/:id` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L137) `SchoolListsController.replaceTemplate` | [SaveSchoolTemplateUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.saveTemplate` |
| `PATCH /api/school-lists/templates/:id/status` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L147) `SchoolListsController.templateStatus` | [SetSchoolTemplateActiveUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.setTemplateActive` |
| `POST /api/school-lists/templates/:id/duplicate` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L156) `SchoolListsController.duplicate` | [DuplicateSchoolTemplateUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.duplicateTemplate` |
| `GET /api/school-lists/quotations` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L172) `SchoolListsController.quotations` | [ListSchoolQuotationsUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.getQuotations` |
| `GET /api/school-lists/quotations/dashboard` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L185) `SchoolListsController.dashboard` | [GetSchoolListDashboardUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.getDashboard` |
| `POST /api/school-lists/quotations` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L197) `SchoolListsController.create` | [CreateSchoolQuotationUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.createQuotation` |
| `GET /api/school-lists/quotations/:id/pdf` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L207) `SchoolListsController.pdf` | [GetSchoolQuotationPdfUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.quotationPdf` |
| `GET /api/school-lists/quotations/:id` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L216) `SchoolListsController.quotation` | [GetSchoolQuotationUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.getQuotation` |
| `PUT /api/school-lists/quotations/:id` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L224) `SchoolListsController.update` | [UpdateSchoolQuotationUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.updateQuotation` |
| `PATCH /api/school-lists/quotations/:id/observations` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L234) `SchoolListsController.observations` | [UpdateSchoolQuotationObservationsUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.updateObservations` |
| `POST /api/school-lists/quotations/:id/status` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L248) `SchoolListsController.status` | [ChangeSchoolQuotationStatusUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.changeStatus` |
| `POST /api/school-lists/quotations/:id/cancel` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L263) `SchoolListsController.cancel` | [CancelSchoolQuotationUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.cancelQuotation` |
| `POST /api/school-lists/quotations/:id/payments` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L280) `SchoolListsController.pay` | [RegisterSchoolPaymentUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.registerPayment` |
| `POST /api/school-lists/payments/:paymentId/void` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L296) `SchoolListsController.void` | [VoidSchoolPaymentUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.voidPayment` |
| `GET /api/school-lists/payments/:paymentId/receipt` | [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L311) `SchoolListsController.receipt` | [GetSchoolReceiptPdfUseCase](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | — | UseGuards(JwtAuthGuard) | `SchoolListService.receiptPdf` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [school-list.use-cases.spec.ts](#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `repository`, `admin`, `cashier`, `supervisor`, `REQUEST_ID` (sin comentario de documentación en el código). | 4 internas | 0 | Soporte (pruebas) |
| [school-list.use-cases.ts](#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts) | .ts | Caso de uso | Aplicación | `yyyy-MM-dd` of "today" in Guatemala. | 6 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [school-list.errors.spec.ts](#f-comercial-jhoel-api-src-modules-school-lists-domain-errors-school-list-errors-spec-ts) | .ts | Prueba unitaria | Dominio | Prueba unitaria (sin comentario de documentación en el código). | 1 internas | 0 | Soporte (pruebas) |
| [school-list.errors.ts](#f-comercial-jhoel-api-src-modules-school-lists-domain-errors-school-list-errors-ts) | .ts | Errores de dominio | Dominio | Business-rule violation of Listas Escolares. | 1 internas | 5 | Media (5 consumidores) |
| [school-list.policy.ts](#f-comercial-jhoel-api-src-modules-school-lists-domain-policies-school-list-policy-ts) | .ts | Política de dominio | Dominio | Política de dominio: declara `hasSchoolListPermission`, `assertSchoolListPermission`, `schoolListPermissionsFor`, `SchoolListPermission`, `ALL_OPERATORS` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [school-list.repository.ts](#f-comercial-jhoel-api-src-modules-school-lists-domain-repositories-school-list-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `Paginated`, `TemplateItemInput`, `TemplateInput`, `TemplateItemRow`, `TemplateSummaryRow` (sin comentario de documentación en el código). | 0 internas | 6 | Media (6 consumidores) |
| [school-list.labels.ts](#f-comercial-jhoel-api-src-modules-school-lists-domain-school-list-labels-ts) | .ts | Código TypeScript | Dominio | Código TypeScript: declara `SCHOOL_STATUS_LABEL`, `SCHOOL_PAYMENT_METHOD_LABEL`, `SCHOOL_PAYMENT_KIND_LABEL` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [school-list-pdf.builder.ts](#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-pdf-school-list-pdf-builder-ts) | .ts | Builder | Infraestructura | `yyyy-MM-dd` → `dd/mm/yyyy` without a `Date` round-trip. | 1 internas; ext.: pdfkit | 1 | Baja (1 consumidores) |
| [typeorm-school-list.repository.ts](#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmSchoolListRepository`, `text`, `textOrNull`, `num`, `numOrNull` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [school-lists.controller.ts](#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts) | .ts | Controlador | Presentación | Listas Escolares: templates per grade, customer quotations and their account statement. | 4 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [school-list.request.dto.ts](#f-comercial-jhoel-api-src-modules-school-lists-presentation-dtos-school-list-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `TemplateItemRequestDto`, `SaveTemplateRequestDto`, `TemplateStatusRequestDto`, `DuplicateTemplateRequestDto`, `TemplatesQueryDto` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [school-lists.module.ts](#f-comercial-jhoel-api-src-modules-school-lists-school-lists-module-ts) | .ts | Módulo | Arranque / configuración | Listas Escolares (migration 1760007900000). | 5 internas; ext.: @nestjs/common | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-spec-ts"></a>

### school-list.use-cases.spec.ts

- **Ruta:** [school-list.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.spec.ts) (`comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.spec.ts`, 358 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `school-lists`
- **Responsabilidad:** Prueba unitaria: declara `repository`, `admin`, `cashier`, `supervisor`, `REQUEST_ID` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [school-list.repository.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-repositories-school-list-repository-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts), [school-list.errors.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-errors-school-list-errors-ts)
- **Consumidores:** —
#### Función `repository` (L106–125)

- **Tipo:** función local del archivo
- **Firma:** `repository(): jest.Mocked<SchoolListRepository>` — [school-list.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.spec.ts#L106)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `jest.fn().mockResolvedValue`, `jest.fn`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts"></a>

### school-list.use-cases.ts

- **Ruta:** [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts) (`comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts`, 477 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `school-lists`
- **Responsabilidad:** `yyyy-MM-dd` of "today" in Guatemala.
- **Depende de (archivos del proyecto):** [school-list.repository.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-repositories-school-list-repository-ts), [school-list.policy.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-policies-school-list-policy-ts), [school-list.errors.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-errors-school-list-errors-ts), [school-list.labels.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-school-list-labels-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [school-list-pdf.builder.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-pdf-school-list-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [school-list.use-cases.spec.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-spec-ts), [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts), [school-lists.module.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-school-lists-module-ts)

**Interfaces, tipos y enums:**

- `interface Actor` (L39): Who is calling (from the JWT). — miembros: `userId`, `role`

#### Clase `SchoolListUseCase` (L77–102)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SCHOOL_LIST_REPOSITORY) repository: SchoolListRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `can` | método protected | 83–85 | `actor: Actor`, `permission: SchoolListPermission` | `void` |
| `detail` | método protected async | 87–93 | `id: string` | `Promise<QuotationDetailRow>` |
| `template` | método protected async | 95–101 | `id: string` | `Promise<TemplateRow>` |

##### `SchoolListUseCase.can`

- **Firma:** `can(actor: Actor, permission: SchoolListPermission): void` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertSchoolListPermission`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `SchoolListUseCase.detail`

- **Firma:** `detail(id: string): Promise<QuotationDetailRow>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L87) (L87–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.getQuotation`, `schoolListError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `schoolListError('SCHOOL_QUOTE_NOT_FOUND')`
- **Consumidores:** (mismo archivo)

##### `SchoolListUseCase.template`

- **Firma:** `template(id: string): Promise<TemplateRow>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L95) (L95–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.getTemplate`, `schoolListError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `schoolListError('SCHOOL_TEMPLATE_NOT_FOUND')`
- **Consumidores:** (mismo archivo)


#### Clase `GetSchoolListPermissionsUseCase` (L105–110)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 107–109 | `actor: Actor` | `{ permissions: SchoolListPermission[] }` |

##### `GetSchoolListPermissionsUseCase.execute`

- **Firma:** `execute(actor: Actor): { permissions: SchoolListPermission[] }` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L107) (L107–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `schoolListPermissionsFor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `ListSchoolTemplatesUseCase` (L113–126)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 115–125 | `actor: Actor`, `includeInactive: boolean` | `Promise<TemplateSummaryRow[]>` |

##### `ListSchoolTemplatesUseCase.execute`

- **Firma:** `execute(actor: Actor, includeInactive: boolean): Promise<TemplateSummaryRow[]>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L115) (L115–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.repository.listTemplates`, `hasSchoolListPermission`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `GetSchoolTemplateUseCase` (L128–134)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 130–133 | `actor: Actor`, `id: string` | `Promise<TemplateRow>` |

##### `GetSchoolTemplateUseCase.execute`

- **Firma:** `execute(actor: Actor, id: string): Promise<TemplateRow>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L130) (L130–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.template`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `SaveSchoolTemplateUseCase` (L136–154)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 139–153 | `actor: Actor`, `id: string \| null`, `input: TemplateInput`, `version: number \| null` | `Promise<TemplateRow>` |

##### `SaveSchoolTemplateUseCase.execute`

- **Firma:** `execute(actor: Actor, id: string \| null, input: TemplateInput, version: number \| null): Promise<TemplateRow>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L139) (L139–153)
- **Propósito / descripción:** Creates (`id` null) or replaces a template; `version` guards concurrent edits.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.repository.saveTemplate`, `this.template`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `SetSchoolTemplateActiveUseCase` (L156–167)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 158–166 | `actor: Actor`, `id: string`, `active: boolean` | `Promise<TemplateRow>` |

##### `SetSchoolTemplateActiveUseCase.execute`

- **Firma:** `execute(actor: Actor, id: string, active: boolean): Promise<TemplateRow>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L158) (L158–166)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.repository.setTemplateActive`, `this.template`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `DuplicateSchoolTemplateUseCase` (L169–186)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 171–185 | `actor: Actor`, `id: string`, `name: string`, `grade: string \| null` | `Promise<TemplateRow>` |

##### `DuplicateSchoolTemplateUseCase.execute`

- **Firma:** `execute(actor: Actor, id: string, name: string, grade: string \| null): Promise<TemplateRow>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L171) (L171–185)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.repository.duplicateTemplate`, `this.template`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `ListSchoolQuotationsUseCase` (L189–198)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 191–197 | `actor: Actor`, `options: FindQuotationsOptions` | `Promise<Paginated<QuotationSummaryRow>>` |

##### `ListSchoolQuotationsUseCase.execute`

- **Firma:** `execute(actor: Actor, options: FindQuotationsOptions): Promise<Paginated<QuotationSummaryRow>>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L191) (L191–197)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.repository.findQuotations`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `GetSchoolQuotationUseCase` (L200–208)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public | 203–207 | `actor: Actor`, `id: string` | `Promise<QuotationDetailRow>` |

##### `GetSchoolQuotationUseCase.execute`

- **Firma:** `execute(actor: Actor, id: string): Promise<QuotationDetailRow>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L203) (L203–207)
- **Propósito / descripción:** Quotation, lines, history and its account statement.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.detail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `CreateSchoolQuotationUseCase` (L210–229)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 212–228 | `actor: Actor`, `input: QuotationInput`, `clientRequestId: string` | `Promise<QuotationDetailRow>` |

##### `CreateSchoolQuotationUseCase.execute`

- **Firma:** `execute(actor: Actor, input: QuotationInput, clientRequestId: string): Promise<QuotationDetailRow>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L212) (L212–228)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `assertPositiveMoney`, `this.repository.createQuotation`, `guatemalaToday`, `requireKey`, `this.detail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `UpdateSchoolQuotationUseCase` (L231–249)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 233–248 | `actor: Actor`, `id: string`, `input: QuotationInput`, `version: number` | `Promise<QuotationDetailRow>` |

##### `UpdateSchoolQuotationUseCase.execute`

- **Firma:** `execute(actor: Actor, id: string, input: QuotationInput, version: number): Promise<QuotationDetailRow>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L233) (L233–248)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.repository.updateQuotation`, `this.detail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `UpdateSchoolQuotationObservationsUseCase` (L251–268)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 253–267 | `actor: Actor`, `id: string`, `observations: string \| null`, `version: number` | `Promise<QuotationDetailRow>` |

##### `UpdateSchoolQuotationObservationsUseCase.execute`

- **Firma:** `execute(actor: Actor, id: string, observations: string \| null, version: number): Promise<QuotationDetailRow>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L253) (L253–267)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.repository.setObservations`, `this.detail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `ChangeSchoolQuotationStatusUseCase` (L270–282)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 272–281 | `actor: Actor`, `id: string`, `action: SchoolStatusAction`, `version: number \| null` | `Promise<QuotationDetailRow>` |

##### `ChangeSchoolQuotationStatusUseCase.execute`

- **Firma:** `execute(actor: Actor, id: string, action: SchoolStatusAction, version: number \| null): Promise<QuotationDetailRow>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L272) (L272–281)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.repository.changeStatus`, `this.detail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `CancelSchoolQuotationUseCase` (L284–301)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 286–300 | `actor: Actor`, `id: string`, `input: CancelInput`, `clientRequestId: string` | `Promise<QuotationDetailRow>` |

##### `CancelSchoolQuotationUseCase.execute`

- **Firma:** `execute(actor: Actor, id: string, input: CancelInput, clientRequestId: string): Promise<QuotationDetailRow>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L286) (L286–300)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.repository.cancelQuotation`, `requireKey`, `this.detail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `RegisterSchoolPaymentUseCase` (L304–322)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 306–321 | `actor: Actor`, `quotationId: string`, `input: PaymentInput`, `clientRequestId: string` | `Promise<{ paymentId: string; quotation: QuotationDetailRow }>` |

##### `RegisterSchoolPaymentUseCase.execute`

- **Firma:** `execute(actor: Actor, quotationId: string, input: PaymentInput, clientRequestId: string): Promise<{ paymentId: string; quotation: QuotationDetailRow }>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L306) (L306–321)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `assertPositiveMoney`, `this.repository.registerPayment`, `requireKey`, `this.detail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `VoidSchoolPaymentUseCase` (L324–345)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 326–344 | `actor: Actor`, `paymentId: string`, `reason: string`, `clientRequestId: string` | `Promise<{ reversalId: string; quotation: QuotationDetailRow }>` |

##### `VoidSchoolPaymentUseCase.execute`

- **Firma:** `execute(actor: Actor, paymentId: string, reason: string, clientRequestId: string): Promise<{ reversalId: string; quotation: QuotationDetailRow }>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L326) (L326–344)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.repository.findPayment`, `schoolListError`, `this.repository.voidPayment`, `requireKey`, `this.detail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `schoolListError('SCHOOL_PAYMENT_NOT_FOUND')`
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `GetSchoolListDashboardUseCase` (L348–366)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 351–365 | `actor: Actor`, `dateFrom?: string`, `dateTo?: string` | `Promise<DashboardRow & { dateFrom: string; dateTo: string }>` |

##### `GetSchoolListDashboardUseCase.execute`

- **Firma:** `execute(actor: Actor, dateFrom?: string, dateTo?: string): Promise<DashboardRow & { dateFrom: string; dateTo: string }>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L351) (L351–365)
- **Propósito / descripción:** Defaults to the current calendar year (the school season).
- **Dependencias (llamadas en su cuerpo):** `this.can`, `guatemalaToday`, `today.slice`, `schoolListError`, `this.repository.dashboard`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `schoolListError('SCHOOL_INVALID_DATE_RANGE')`
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `SchoolDocumentUseCase` (L369–392)

- **Herencia / contratos:** extends SchoolListUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SCHOOL_LIST_REPOSITORY) repository: SchoolListRepository`, `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettings: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `company` | método protected async | 378–391 | — | `Promise<SchoolListPdfCompany>` |

##### `SchoolDocumentUseCase.company`

- **Firma:** `company(): Promise<SchoolListPdfCompany>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L378) (L378–391)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.companySettings.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)


#### Clase `GetSchoolQuotationPdfUseCase` (L394–423)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolDocumentUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 396–422 | `actor: Actor`, `id: string` | `Promise<{ filename: string; pdf: Buffer }>` |

##### `GetSchoolQuotationPdfUseCase.execute`

- **Firma:** `execute(actor: Actor, id: string): Promise<{ filename: string; pdf: Buffer }>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L396) (L396–422)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.detail`, `buildSchoolQuotationPdf`, `this.company`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)


#### Clase `GetSchoolReceiptPdfUseCase` (L425–476)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** extends SchoolDocumentUseCase
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 427–475 | `actor: Actor`, `paymentId: string` | `Promise<{ filename: string; pdf: Buffer }>` |

##### `GetSchoolReceiptPdfUseCase.execute`

- **Firma:** `execute(actor: Actor, paymentId: string): Promise<{ filename: string; pdf: Buffer }>` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L427) (L427–475)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.can`, `this.repository.findPayment`, `schoolListError`, `this.detail`, `buildSchoolReceiptPdf`, `this.company`, `new Date`, `'Anulación del comprobante ${payment.reference ?? ''}'.trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `schoolListError('SCHOOL_PAYMENT_NOT_FOUND')`
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)

#### Función `guatemalaToday` (L47–54)

- **Tipo:** función exportada
- **Firma:** `guatemalaToday(now?): string` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L47)
- **Propósito / descripción:** `yyyy-MM-dd` of "today" in Guatemala.
- **Dependencias:** `new Intl.DateTimeFormat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `assertPositiveMoney` (L57–65)

- **Tipo:** función exportada
- **Firma:** `assertPositiveMoney(amount: number): void` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L57)
- **Propósito / descripción:** Early, friendly check of a money amount (the SQL functions validate again).
- **Dependencias:** `Number.isFinite`, `Math.round`, `Number`, `(amount * 100).toFixed`, `schoolListError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `schoolListError('SCHOOL_INVALID_AMOUNT')`
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `requireKey` (L67–75)

- **Tipo:** función local del archivo
- **Firma:** `requireKey(clientRequestId: string \| undefined, prefix: string): string` — [school-list.use-cases.ts](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-list.use-cases.ts#L67)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `schoolListError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `schoolListError('SCHOOL_IDEMPOTENCY_KEY_REQUIRED')`
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-school-lists-domain-errors-school-list-errors-spec-ts"></a>

### school-list.errors.spec.ts

- **Ruta:** [school-list.errors.spec.ts](../../../../comercial-jhoel-api/src/modules/school-lists/domain/errors/school-list.errors.spec.ts) (`comercial-jhoel-api/src/modules/school-lists/domain/errors/school-list.errors.spec.ts`, 59 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Dominio · **Módulo:** Módulo backend `school-lists`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [school-list.errors.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-errors-school-list-errors-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-school-lists-domain-errors-school-list-errors-ts"></a>

### school-list.errors.ts

- **Ruta:** [school-list.errors.ts](../../../../comercial-jhoel-api/src/modules/school-lists/domain/errors/school-list.errors.ts) (`comercial-jhoel-api/src/modules/school-lists/domain/errors/school-list.errors.ts`, 251 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `school-lists`
- **Responsabilidad:** Business-rule violation of Listas Escolares.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [school-list.use-cases.spec.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-spec-ts), [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts), [school-list.errors.spec.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-errors-school-list-errors-spec-ts), [school-list.policy.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-policies-school-list-policy-ts), [typeorm-school-list.repository.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts)

#### Clase `SchoolListRuleError` (L8–16)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Business-rule violation of Listas Escolares. One class with a stable `code` (the same code the SQL functions `RAISE`), carrying its user-facing message and HTTP status through `GlobalExceptionFilter`.
- **Dependencias inyectadas (constructor):** `code: string`, `message: string`, `status: number`
#### Función `money` (L180–181)

- **Tipo:** función local del archivo
- **Firma:** `money(value: string \| undefined)` — [school-list.errors.ts](../../../../comercial-jhoel-api/src/modules/school-lists/domain/errors/school-list.errors.ts#L180)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number(value ?? 0).toLocaleString`, `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `withName` (L184–190)

- **Tipo:** función local del archivo
- **Firma:** `withName(parts: string[], format: (name: string) => string): string \| null` — [school-list.errors.ts](../../../../comercial-jhoel-api/src/modules/school-lists/domain/errors/school-list.errors.ts#L184)
- **Propósito / descripción:** A product name may itself contain ":"; the whole tail is the name.
- **Dependencias:** `parts.join(':').trim`, `parts.join`, `format`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `schoolListError` (L231–236)

- **Tipo:** función exportada
- **Firma:** `schoolListError(code: string): SchoolListRuleError` — [school-list.errors.ts](../../../../comercial-jhoel-api/src/modules/school-lists/domain/errors/school-list.errors.ts#L231)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new SchoolListRuleError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts), [school-list.policy.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-policies-school-list-policy-ts), [typeorm-school-list.repository.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts)

#### Función `schoolListErrorFromMessage` (L239–250)

- **Tipo:** función exportada
- **Firma:** `schoolListErrorFromMessage(message: string): SchoolListRuleError \| null` — [school-list.errors.ts](../../../../comercial-jhoel-api/src/modules/school-lists/domain/errors/school-list.errors.ts#L239)
- **Propósito / descripción:** Maps the message of a SQL `RAISE EXCEPTION 'CODE[:detail…]'`; null when it isn't ours.
- **Dependencias:** `message.split`, `DETAILED[code]`, `new SchoolListRuleError`, `schoolListError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-school-list.repository.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-school-lists-domain-policies-school-list-policy-ts"></a>

### school-list.policy.ts

- **Ruta:** [school-list.policy.ts](../../../../comercial-jhoel-api/src/modules/school-lists/domain/policies/school-list.policy.ts) (`comercial-jhoel-api/src/modules/school-lists/domain/policies/school-list.policy.ts`, 69 líneas)
- **Tipo:** Política de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `school-lists`
- **Responsabilidad:** Política de dominio: declara `hasSchoolListPermission`, `assertSchoolListPermission`, `schoolListPermissionsFor`, `SchoolListPermission`, `ALL_OPERATORS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [school-list.errors.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-errors-school-list-errors-ts)
- **Consumidores:** [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts)

**Interfaces, tipos y enums:**

- `type SchoolListPermission` (L40) = `keyof typeof SCHOOL_LIST_PERMISSION_ROLES`

**Constantes exportadas:**

- `SCHOOL_LIST_PERMISSION_ROLES` (L17): Permissions of "Listas Escolares" (role-based RBAC, same model as the rest of the system). = `{ /** Consultar plantillas, cotizaciones y el tablero. */ 'school_lists.view': ALL_OPERATORS, /** Crear, edita`
#### Función `hasSchoolListPermission` (L42–49)

- **Tipo:** función exportada
- **Firma:** `hasSchoolListPermission(role: string \| undefined, permission: SchoolListPermission): boolean` — [school-list.policy.ts](../../../../comercial-jhoel-api/src/modules/school-lists/domain/policies/school-list.policy.ts#L42)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `( SCHOOL_LIST_PERMISSION_ROLES[permission] as readonly string[] ).includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts)

#### Función `assertSchoolListPermission` (L52–59)

- **Tipo:** función exportada
- **Firma:** `assertSchoolListPermission(role: string \| undefined, permission: SchoolListPermission): void` — [school-list.policy.ts](../../../../comercial-jhoel-api/src/modules/school-lists/domain/policies/school-list.policy.ts#L52)
- **Propósito / descripción:** Throws `SCHOOL_LIST_FORBIDDEN` (403) unless the role holds the permission.
- **Dependencias:** `hasSchoolListPermission`, `schoolListError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `schoolListError('SCHOOL_LIST_FORBIDDEN')`
- **Consumidores:** [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts)

#### Función `schoolListPermissionsFor` (L62–68)

- **Tipo:** función exportada
- **Firma:** `schoolListPermissionsFor(role: string \| undefined): SchoolListPermission[]` — [school-list.policy.ts](../../../../comercial-jhoel-api/src/modules/school-lists/domain/policies/school-list.policy.ts#L62)
- **Propósito / descripción:** Every permission the role holds — the frontend shows only these actions.
- **Dependencias:** `( Object.keys(SCHOOL_LIST_PERMISSION_ROLES) as SchoolListPermission[] ).filter`, `Object.keys`, `hasSchoolListPermission`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts)

<a id="f-comercial-jhoel-api-src-modules-school-lists-domain-repositories-school-list-repository-ts"></a>

### school-list.repository.ts

- **Ruta:** [school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/domain/repositories/school-list.repository.ts) (`comercial-jhoel-api/src/modules/school-lists/domain/repositories/school-list.repository.ts`, 334 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `school-lists`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `Paginated`, `TemplateItemInput`, `TemplateInput`, `TemplateItemRow`, `TemplateSummaryRow` (sin comentario de documentación en el código).
- **Consumidores:** [school-list.use-cases.spec.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-spec-ts), [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts), [school-list.labels.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-school-list-labels-ts), [typeorm-school-list.repository.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts), [school-list.request.dto.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-dtos-school-list-request-dto-ts), [school-lists.module.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-school-lists-module-ts)

**Interfaces, tipos y enums:**

- `interface Paginated` (L39): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface TemplateItemInput` (L47): sin documentación — miembros: `productId`, `productName`, `description`, `quantity`, `unitPrice`, `observations`
- `interface TemplateInput` (L56): sin documentación — miembros: `name`, `grade`, `description`, `isActive`, `items`
- `interface TemplateItemRow` (L64): sin documentación — miembros: `id`, `lineNo`, `productId`, `productName`, `description`, `quantity`, `unitPrice`, `subtotal`, `observations`, `inventoryPrice`
- `interface TemplateSummaryRow` (L78): sin documentación — miembros: `id`, `name`, `grade`, `description`, `isActive`, `sortOrder`, `version`, `itemCount`, `total`, `updatedAt`, `updatedByUsername`
- `interface TemplateRow` (L92) extends TemplateSummaryRow: sin documentación — miembros: `items`
- `interface QuotationItemInput` (L97): sin documentación — miembros: `itemId`, `templateItemId`, `productId`, `productName`, `description`, `quantity`, `unitPrice`, `discount`, `observations`
- `interface PaymentInput` (L110): sin documentación — miembros: `amount`, `paymentMethod`, `bankId`, `reference`, `observations`
- `interface QuotationInput` (L118): sin documentación — miembros: `templateId`, `grade`, `customerName`, `customerPhone`, `studentName`, `quotationDate`, `deliveryDate`, `observations`, `asDraft`, `advance`, `items`
- `interface QuotationSummaryRow` (L132): sin documentación — miembros: `id`, `quotationNumber`, `quotationDate`, `deliveryDate`, `customerName`, `customerPhone`, `studentName`, `grade`, `templateId`, `templateName`, `total`, `paid`, `balance`, `status`, `accountStatus`, `version`, `createdAt`, `createdByUsername`
- `interface QuotationItemRow` (L153): sin documentación — miembros: `id`, `lineNo`, `source`, `templateItemId`, `productId`, `productName`, `description`, `quantity`, `unitPrice`, `discount`, `subtotal`, `observations`
- `interface PaymentRow` (L168): sin documentación — miembros: `id`, `quotationId`, `receiptNumber`, `kind`, `amount`, `effect`, `runningBalance`, `paymentMethod`, `bankId`, `bankName`, `reference`, `observations`, `status`, `reversalOfId`, `receivedAt`, `receivedByUsername`, `voidedAt`, `voidedByUsername`, `voidReason`
- `interface HistoryRow` (L192): sin documentación — miembros: `id`, `action`, `fromStatus`, `toStatus`, `details`, `createdAt`, `createdByUsername`
- `interface AccountSummary` (L202): sin documentación — miembros: `total`, `advances`, `installments`, `refunds`, `paid`, `balance`
- `interface QuotationDetailRow` (L211) extends QuotationSummaryRow: sin documentación — miembros: `subtotal`, `discount`, `observations`, `updatedAt`, `deliveredAt`, `deliveredByUsername`, `cancelledAt`, `cancelledByUsername`, `cancelReason`, `items`, `payments`, `history`, `account`
- `interface FindQuotationsOptions` (L227): sin documentación — miembros: `search`, `phone`, `number`, `grade`, `status`, `dateFrom`, `dateTo`, `page`, `limit`
- `interface DashboardRow` (L239): sin documentación — miembros: `totalQuotations`, `pendingQuotations`, `paidQuotations`, `totalQuoted`, `totalReceived`, `pendingBalance`, `byGrade`, `incomeByDay`, `byStatus`
- `interface CancelInput` (L251): sin documentación — miembros: `reason`, `refundMethod`, `bankId`, `reference`
- `interface SchoolListRepository` (L263): Port of Listas Escolares. — miembros: `listTemplates`, `getTemplate`, `saveTemplate`, `setTemplateActive`, `duplicateTemplate`, `findQuotations`, `getQuotation`, `createQuotation`, `updateQuotation`, `setObservations`, `changeStatus`, `cancelQuotation`, `registerPayment`, `voidPayment`, `findPayment`, `dashboard`
- `type SchoolQuotationStatus` (L13) = `(typeof SCHOOL_QUOTATION_STATUSES)[number]`
- `type SchoolPaymentMethod` (L22) = `(typeof SCHOOL_PAYMENT_METHODS)[number]`
- `type SchoolStatusAction` (L29) = `(typeof SCHOOL_STATUS_ACTIONS)[number]`
- `type SchoolPaymentKind` (L31) = `'ANTICIPO' \| 'ABONO' \| 'DEVOLUCION' \| 'ANULACION'`
- `type SchoolLineSource` (L33) = `'PLANTILLA' \| 'INVENTARIO' \| 'MANUAL'`
- `type SchoolAccountStatus` (L36) = `'PENDIENTE' \| 'PARCIAL' \| 'PAGADA' \| 'CERRADA'` — Red / yellow / green account status shown next to every quotation.

**Constantes exportadas:**

- `SCHOOL_LIST_REPOSITORY` (L1) = `Symbol('SCHOOL_LIST_REPOSITORY')`
- `SCHOOL_QUOTATION_STATUSES` (L3) = `[ 'BORRADOR', 'COTIZADA', 'ANTICIPO_RECIBIDO', 'PAGO_PARCIAL', 'PAGADA', 'EN_PREPARACION', 'ENTREGADA', 'CANCE`
- `SCHOOL_PAYMENT_METHODS` (L15) = `[ 'EFECTIVO', 'TRANSFERENCIA', 'DEPOSITO', 'TARJETA', 'OTRO', ] as const`
- `SCHOOL_STATUS_ACTIONS` (L24) = `[ 'CONFIRMAR', 'PREPARAR', 'ENTREGAR', ] as const`
<a id="f-comercial-jhoel-api-src-modules-school-lists-domain-school-list-labels-ts"></a>

### school-list.labels.ts

- **Ruta:** [school-list.labels.ts](../../../../comercial-jhoel-api/src/modules/school-lists/domain/school-list.labels.ts) (`comercial-jhoel-api/src/modules/school-lists/domain/school-list.labels.ts`, 34 líneas)
- **Tipo:** Código TypeScript · **Capa:** Dominio · **Módulo:** Módulo backend `school-lists`
- **Responsabilidad:** Código TypeScript: declara `SCHOOL_STATUS_LABEL`, `SCHOOL_PAYMENT_METHOD_LABEL`, `SCHOOL_PAYMENT_KIND_LABEL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [school-list.repository.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-repositories-school-list-repository-ts)
- **Consumidores:** [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts)

**Constantes exportadas:**

- `SCHOOL_STATUS_LABEL` (L8): Spanish labels printed on documents (the app keeps its own copy for the UI). = `{ BORRADOR: 'Borrador', COTIZADA: 'Cotizada', ANTICIPO_RECIBIDO: 'Anticipo recibido', PAGO_PARCIAL: 'Pago parc`
- `SCHOOL_PAYMENT_METHOD_LABEL` (L19) = `{ EFECTIVO: 'Efectivo', TRANSFERENCIA: 'Transferencia', DEPOSITO: 'Depósito bancario', TARJETA: 'Tarjeta', OTR`
- `SCHOOL_PAYMENT_KIND_LABEL` (L28) = `{ ANTICIPO: 'Anticipo', ABONO: 'Abono', DEVOLUCION: 'Devolución', ANULACION: 'Anulación', }`
<a id="f-comercial-jhoel-api-src-modules-school-lists-infrastructure-pdf-school-list-pdf-builder-ts"></a>

### school-list-pdf.builder.ts

- **Ruta:** [school-list-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/pdf/school-list-pdf.builder.ts) (`comercial-jhoel-api/src/modules/school-lists/infrastructure/pdf/school-list-pdf.builder.ts`, 461 líneas)
- **Tipo:** Builder · **Capa:** Infraestructura · **Módulo:** Módulo backend `school-lists`
- **Responsabilidad:** `yyyy-MM-dd` → `dd/mm/yyyy` without a `Date` round-trip.
- **Depende de (archivos del proyecto):** [pdf-helpers.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-ts)
- **Paquetes externos:** `pdfkit`
- **Consumidores:** [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts)

**Interfaces, tipos y enums:**

- `interface SchoolListPdfCompany` (L11) extends PdfCompanyLetterhead: Letterhead plus the commercial contact lines printed in the footer. — miembros: `whatsapp`, `website`, `businessHours`
- `interface SchoolQuotationPdfOptions` (L17): sin documentación — miembros: `company`, `quotationNumber`, `quotationDate`, `deliveryDate`, `statusLabel`, `customerName`, `customerPhone`, `studentName`, `grade`, `items`, `subtotal`, `discount`, `total`, `advance`, `paid`, `balance`, `observations`
- `interface SchoolReceiptPdfOptions` (L45): sin documentación — miembros: `company`, `title`, `receiptNumber`, `receivedAt`, `quotationNumber`, `customerName`, `customerPhone`, `studentName`, `grade`, `kindLabel`, `methodLabel`, `bankName`, `reference`, `amount`, `quotationTotal`, `balanceAfter`, `receivedBy`, `observations`, `voided`
#### Función `formatIsoDate` (L81–84)

- **Tipo:** función local del archivo
- **Firma:** `formatIsoDate(isoDate: string): string` — [school-list-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/pdf/school-list-pdf.builder.ts#L81)
- **Propósito / descripción:** `yyyy-MM-dd` → `dd/mm/yyyy` without a `Date` round-trip.
- **Dependencias:** `isoDate.split`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `render` (L86–103)

- **Tipo:** función local del archivo
- **Firma:** `render(options: { size: 'A4' \| 'A5'; margin: number }, draw: (doc: PDFKit.PDFDocument) => void): Promise<Buffer>` — [school-list-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/pdf/school-list-pdf.builder.ts#L86)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new PDFDocument`, `doc.on`, `chunks.push`, `new Promise`, `resolve`, `Buffer.concat`, `draw`, `doc.end`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `usableWidth` (L105–107)

- **Tipo:** función local del archivo
- **Firma:** `usableWidth(doc: PDFKit.PDFDocument): number` — [school-list-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/pdf/school-list-pdf.builder.ts#L105)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawFacts` (L110–139)

- **Tipo:** función local del archivo
- **Firma:** `drawFacts(doc: PDFKit.PDFDocument, facts: [string, string][], columns?): void` — [school-list-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/pdf/school-list-pdf.builder.ts#L110)
- **Propósito / descripción:** Two-column "label: value" block.
- **Dependencias:** `usableWidth`, `facts.forEach`, `doc.fontSize(7.5).fillColor(MUTED).text`, `doc.fontSize(7.5).fillColor`, `doc.fontSize`, `label.toUpperCase`, `doc.fontSize(9.5).fillColor(INK).text`, `doc.fontSize(9.5).fillColor`, `doc.moveDown`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawCommercialFooter` (L141–162)

- **Tipo:** función local del archivo
- **Firma:** `drawCommercialFooter(doc: PDFKit.PDFDocument, company: SchoolListPdfCompany): void` — [school-list-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/pdf/school-list-pdf.builder.ts#L141)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `drawDivider`, `doc.fontSize(8).fillColor(MUTED).text`, `doc.fontSize(8).fillColor`, `doc.fontSize`, `lines.join`, `usableWidth`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `numberPages` (L164–182)

- **Tipo:** función local del archivo
- **Firma:** `numberPages(doc: PDFKit.PDFDocument): void` — [school-list-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/pdf/school-list-pdf.builder.ts#L164)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.bufferedPageRange`, `doc.switchToPage`, `doc.fontSize(7.5).fillColor('#94a3b8').text`, `doc.fontSize(7.5).fillColor`, `doc.fontSize`, `usableWidth`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildSchoolQuotationPdf` (L189–352)

- **Tipo:** función exportada
- **Firma:** `buildSchoolQuotationPdf(options: SchoolQuotationPdfOptions): Promise<Buffer>` — [school-list-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/pdf/school-list-pdf.builder.ts#L189)
- **Propósito / descripción:** Quotation of a school list, rebuilt only from the quotation's own saved copy (lines, prices, payments) — never from the template or the current product price. A4, ready to print or to share by WhatsApp.
- **Dependencias:** `render`, `usableWidth`, `drawCompanyLetterhead`, `doc.moveDown`, `drawDivider`, `doc.fontSize(16).fillColor(INK).text`, `doc.fontSize(16).fillColor`, `doc.fontSize`, `doc.fontSize(9).fillColor(BODY).text`, `doc.fontSize(9).fillColor`, `drawFacts`, `formatIsoDate`, `COLUMNS.reduce`, `doc.rect(startX, y, tableWidth, ROW_HEIGHT + 2).fill`, `doc.rect`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts)

#### Función `buildSchoolReceiptPdf` (L355–460)

- **Tipo:** función exportada
- **Firma:** `buildSchoolReceiptPdf(options: SchoolReceiptPdfOptions): Promise<Buffer>` — [school-list-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/pdf/school-list-pdf.builder.ts#L355)
- **Propósito / descripción:** Receipt of a single anticipo/abono/devolución (A5), marked when voided.
- **Dependencias:** `render`, `usableWidth`, `drawCompanyLetterhead`, `doc.moveDown`, `drawDivider`, `doc.fontSize(13).fillColor(INK).text`, `doc.fontSize(13).fillColor`, `doc.fontSize`, `doc.fontSize(8.5).fillColor(BODY).text`, `doc.fontSize(8.5).fillColor`, `formatDateTime`, `doc.roundedRect(startX, y, width, 46, 6).fill`, `doc.roundedRect`, `doc.fontSize(8).fillColor(MUTED).text`, `doc.fontSize(8).fillColor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts)

<a id="f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts"></a>

### typeorm-school-list.repository.ts

- **Ruta:** [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts) (`comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts`, 604 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `school-lists`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmSchoolListRepository`, `text`, `textOrNull`, `num`, `numOrNull` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [school-list.repository.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-repositories-school-list-repository-ts), [school-list.errors.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-errors-school-list-errors-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [school-lists.module.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-school-lists-module-ts)

**Interfaces, tipos y enums:**

- `type SqlRow` (L30) = `Record<string, unknown>`

#### Clase `TypeOrmSchoolListRepository` (L183–603)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements SchoolListRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectDataSource() dataSource: DataSource`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `listTemplates` | método public async | 188–194 | `includeInactive: boolean` | `Promise<TemplateSummaryRow[]>` |
| `getTemplate` | método public async | 196–226 | `id: string` | `Promise<TemplateRow \| null>` |
| `saveTemplate` | método public async | 228–238 | `id: string \| null`, `input: TemplateInput`, `userId: string`, `expectedVersion: number \| null` | `Promise<string>` |
| `setTemplateActive` | método public async | 240–249 | `id: string`, `active: boolean`, `userId: string` | `Promise<string>` |
| `duplicateTemplate` | método public async | 251–261 | `id: string`, `name: string`, `grade: string \| null`, `userId: string` | `Promise<string>` |
| `findQuotations` | método public async | 264–317 | `options: FindQuotationsOptions` | `Promise<Paginated<QuotationSummaryRow>>` |
| `getQuotation` | método public async | 319–407 | `id: string` | `Promise<QuotationDetailRow \| null>` |
| `createQuotation` | método public async | 409–418 | `input: QuotationInput`, `userId: string`, `idempotencyKey: string` | `Promise<string>` |
| `updateQuotation` | método public async | 420–430 | `id: string`, `input: QuotationInput`, `userId: string`, `expectedVersion: number` | `Promise<string>` |
| `setObservations` | método public async | 432–442 | `id: string`, `observations: string \| null`, `userId: string`, `expectedVersion: number` | `Promise<string>` |
| `changeStatus` | método public async | 444–454 | `id: string`, `action: SchoolStatusAction`, `userId: string`, `expectedVersion: number \| null` | `Promise<string>` |
| `cancelQuotation` | método public async | 456–474 | `id: string`, `input: CancelInput`, `userId: string`, `idempotencyKey: string` | `Promise<string>` |
| `registerPayment` | método public async | 476–495 | `quotationId: string`, `input: PaymentInput`, `userId: string`, `idempotencyKey: string` | `Promise<string>` |
| `voidPayment` | método public async | 497–507 | `paymentId: string`, `reason: string`, `userId: string`, `idempotencyKey: string` | `Promise<string>` |
| `findPayment` | método public async | 509–515 | `paymentId: string` | `Promise<PaymentRow \| null>` |
| `dashboard` | método public async | 518–581 | `dateFrom: string`, `dateTo: string` | `Promise<DashboardRow>` |
| `scalar` | método private async | 584–602 | `sql: string`, `params: unknown[]` | `Promise<string>` |

##### `TypeOrmSchoolListRepository.listTemplates`

- **Firma:** `listTemplates(includeInactive: boolean): Promise<TemplateSummaryRow[]>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L188) (L188–194)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `rows.map`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.getTemplate`

- **Firma:** `getTemplate(id: string): Promise<TemplateRow \| null>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L196) (L196–226)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `toTemplateSummary`, `items.map`, `text`, `num`, `textOrNull`, `numOrNull`
- **Efectos secundarios:** Tablas en su SQL: `school_list_template_items`, `products`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.saveTemplate`

- **Firma:** `saveTemplate(id: string \| null, input: TemplateInput, userId: string, expectedVersion: number \| null): Promise<string>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L228) (L228–238)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scalar`, `JSON.stringify`
- **Efectos secundarios:** Llama funciones SQL: `save_school_list_template`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.setTemplateActive`

- **Firma:** `setTemplateActive(id: string, active: boolean, userId: string): Promise<string>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L240) (L240–249)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scalar`
- **Efectos secundarios:** Llama funciones SQL: `set_school_list_template_active`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.duplicateTemplate`

- **Firma:** `duplicateTemplate(id: string, name: string, grade: string \| null, userId: string): Promise<string>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L251) (L251–261)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scalar`
- **Efectos secundarios:** Llama funciones SQL: `duplicate_school_list_template`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.findQuotations`

- **Firma:** `findQuotations(options: FindQuotationsOptions): Promise<Paginated<QuotationSummaryRow>>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L264) (L264–317)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `params.push`, `where.push`, `clause.replace`, `add`, `options.phone.replace`, `where.join`, `this.dataSource.query`, `rows.map`, `num`
- **Efectos secundarios:** Tablas en su SQL: `school_quotations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.getQuotation`

- **Firma:** `getQuotation(id: string): Promise<QuotationDetailRow \| null>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L319) (L319–407)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `Promise.all`, `toSummary`, `payments.map`, `Math.round`, `num`, `toPayment`, `textOrNull`, `text`, `items.map`, `history.map`
- **Efectos secundarios:** Tablas en su SQL: `school_quotation_items`, `school_list_history`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.createQuotation`

- **Firma:** `createQuotation(input: QuotationInput, userId: string, idempotencyKey: string): Promise<string>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L409) (L409–418)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scalar`, `JSON.stringify`
- **Efectos secundarios:** Llama funciones SQL: `create_school_quotation`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.updateQuotation`

- **Firma:** `updateQuotation(id: string, input: QuotationInput, userId: string, expectedVersion: number): Promise<string>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L420) (L420–430)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scalar`, `JSON.stringify`
- **Efectos secundarios:** Llama funciones SQL: `update_school_quotation`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.setObservations`

- **Firma:** `setObservations(id: string, observations: string \| null, userId: string, expectedVersion: number): Promise<string>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L432) (L432–442)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scalar`
- **Efectos secundarios:** Llama funciones SQL: `set_school_quotation_observations`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.changeStatus`

- **Firma:** `changeStatus(id: string, action: SchoolStatusAction, userId: string, expectedVersion: number \| null): Promise<string>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L444) (L444–454)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scalar`
- **Efectos secundarios:** Llama funciones SQL: `change_school_quotation_status`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.cancelQuotation`

- **Firma:** `cancelQuotation(id: string, input: CancelInput, userId: string, idempotencyKey: string): Promise<string>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L456) (L456–474)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scalar`
- **Efectos secundarios:** Llama funciones SQL: `cancel_school_quotation`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.registerPayment`

- **Firma:** `registerPayment(quotationId: string, input: PaymentInput, userId: string, idempotencyKey: string): Promise<string>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L476) (L476–495)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scalar`
- **Efectos secundarios:** Llama funciones SQL: `register_school_quotation_payment`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.voidPayment`

- **Firma:** `voidPayment(paymentId: string, reason: string, userId: string, idempotencyKey: string): Promise<string>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L497) (L497–507)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scalar`
- **Efectos secundarios:** Llama funciones SQL: `void_school_quotation_payment`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.findPayment`

- **Firma:** `findPayment(paymentId: string): Promise<PaymentRow \| null>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L509) (L509–515)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `toPayment`, `num`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.dashboard`

- **Firma:** `dashboard(dateFrom: string, dateTo: string): Promise<DashboardRow>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L518) (L518–581)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `Promise.all`, `num`, `byGrade.map`, `text`, `byStatus.map`, `income.map`
- **Efectos secundarios:** Tablas en su SQL: `school_quotations`, `school_quotation_payments`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSchoolListRepository.scalar`

- **Firma:** `scalar(sql: string, params: unknown[]): Promise<string>` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L584) (L584–602)
- **Propósito / descripción:** Runs a writer function and returns its single `id` column, mapping its RAISE codes.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `text`, `schoolListErrorFromMessage`, `schoolListError`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `mapped`, `schoolListError('SCHOOL_INVALID_ITEMS')`, `error`
- **Consumidores:** (mismo archivo)

#### Función `text` (L32–47)

- **Tipo:** función local del archivo
- **Firma:** `text(value: unknown): string` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L32)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `value.toISOString`, `value.toString`, `JSON.stringify`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `textOrNull` (L49–51)

- **Tipo:** función local del archivo
- **Firma:** `textOrNull(value: unknown): string \| null` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L49)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `text`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `num` (L53–55)

- **Tipo:** función local del archivo
- **Firma:** `num(value: unknown): number` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L53)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `numOrNull` (L57–59)

- **Tipo:** función local del archivo
- **Firma:** `numOrNull(value: unknown): number \| null` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L57)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `dateOrNull` (L62–64)

- **Tipo:** función local del archivo
- **Firma:** `dateOrNull(value: unknown): string \| null` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L62)
- **Propósito / descripción:** `DATE` columns are read as `yyyy-MM-dd` text (`::text` in every query).
- **Dependencias:** `text`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `accountStatus` (L66–78)

- **Tipo:** función local del archivo
- **Firma:** `accountStatus(status: string, paid: number, balance: number): SchoolAccountStatus` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L66)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toSummary` (L108–134)

- **Tipo:** función local del archivo
- **Firma:** `toSummary(row: SqlRow): QuotationSummaryRow` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L108)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `num`, `text`, `Math.round`, `dateOrNull`, `textOrNull`, `accountStatus`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toPayment` (L136–158)

- **Tipo:** función local del archivo
- **Firma:** `toPayment(row: SqlRow, runningBalance: number): PaymentRow` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L136)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `text`, `num`, `textOrNull`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toTemplateSummary` (L160–174)

- **Tipo:** función local del archivo
- **Firma:** `toTemplateSummary(row: SqlRow): TemplateSummaryRow` — [typeorm-school-list.repository.ts](../../../../comercial-jhoel-api/src/modules/school-lists/infrastructure/persistence/typeorm-school-list.repository.ts#L160)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `text`, `textOrNull`, `num`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts"></a>

### school-lists.controller.ts

- **Ruta:** [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts) (`comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts`, 320 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `school-lists`
- **Responsabilidad:** Listas Escolares: templates per grade, customer quotations and their account statement.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts), [school-list.request.dto.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-dtos-school-list-request-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [school-lists.module.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-school-lists-module-ts)

#### Clase `SchoolListsController` (L77–319)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('school-lists')`
- **Propósito:** Listas Escolares: templates per grade, customer quotations and their account statement. Every use case checks its permission (`SCHOOL_LIST_PERMISSION_ROLES`) and the SQL functions check it again. Static routes are declared before `:id` ones.
- **Dependencias inyectadas (constructor):** `permissions: GetSchoolListPermissionsUseCase`, `listTemplates: ListSchoolTemplatesUseCase`, `getTemplate: GetSchoolTemplateUseCase`, `saveTemplate: SaveSchoolTemplateUseCase`, `setTemplateActive: SetSchoolTemplateActiveUseCase`, `duplicateTemplate: DuplicateSchoolTemplateUseCase`, `listQuotations: ListSchoolQuotationsUseCase`, `getQuotation: GetSchoolQuotationUseCase`, `createQuotation: CreateSchoolQuotationUseCase`, `updateQuotation: UpdateSchoolQuotationUseCase`, `updateObservations: UpdateSchoolQuotationObservationsUseCase`, `changeStatus: ChangeSchoolQuotationStatusUseCase`, `cancelQuotation: CancelSchoolQuotationUseCase`, `registerPayment: RegisterSchoolPaymentUseCase`, `voidPayment: VoidSchoolPaymentUseCase`, `dashboardUseCase: GetSchoolListDashboardUseCase`, `quotationPdf: GetSchoolQuotationPdfUseCase`, `receiptPdf: GetSchoolReceiptPdfUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `myPermissions` | método public | 102–105 | `user: RequestUser` | (inferido) |
| `templates` | método public | 108–117 | `query: TemplatesQueryDto`, `user: RequestUser` | (inferido) |
| `template` | método public | 119–125 | `id: string`, `user: RequestUser` | (inferido) |
| `createTemplate` | método public | 127–135 | `dto: SaveTemplateRequestDto`, `user: RequestUser` | (inferido) |
| `replaceTemplate` | método public | 137–145 | `id: string`, `dto: SaveTemplateRequestDto`, `user: RequestUser` | (inferido) |
| `templateStatus` | método public | 147–154 | `id: string`, `dto: TemplateStatusRequestDto`, `user: RequestUser` | (inferido) |
| `duplicate` | método public | 156–169 | `id: string`, `dto: DuplicateTemplateRequestDto`, `user: RequestUser` | (inferido) |
| `quotations` | método public | 172–183 | `query: QuotationsQueryDto`, `user: RequestUser` | (inferido) |
| `dashboard` | método public | 185–195 | `query: DashboardQueryDto`, `user: RequestUser` | (inferido) |
| `create` | método public | 197–205 | `dto: CreateQuotationRequestDto`, `user: RequestUser` | (inferido) |
| `pdf` | método public async | 207–214 | `id: string`, `user: RequestUser`, `res: Response` | `Promise<void>` |
| `quotation` | método public | 216–222 | `id: string`, `user: RequestUser` | (inferido) |
| `update` | método public | 224–232 | `id: string`, `dto: UpdateQuotationRequestDto`, `user: RequestUser` | (inferido) |
| `observations` | método public | 234–246 | `id: string`, `dto: ObservationsRequestDto`, `user: RequestUser` | (inferido) |
| `status` | método public | 248–261 | `id: string`, `dto: StatusActionRequestDto`, `user: RequestUser` | (inferido) |
| `cancel` | método public | 263–277 | `id: string`, `dto: CancelQuotationRequestDto`, `user: RequestUser` | (inferido) |
| `pay` | método public | 280–294 | `id: string`, `dto: RegisterPaymentRequestDto`, `user: RequestUser` | (inferido) |
| `void` | método public | 296–309 | `paymentId: string`, `dto: VoidPaymentRequestDto`, `user: RequestUser` | (inferido) |
| `receipt` | método public async | 311–318 | `paymentId: string`, `user: RequestUser`, `res: Response` | `Promise<void>` |

##### `SchoolListsController.myPermissions`

- **Firma:** `myPermissions(user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L102) (L102–105)
- **Decoradores:** `@Get('permissions')`
- **Propósito / descripción:** Permissions of the caller's role — the frontend shows only these actions.
- **Origen de parámetros:** `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.permissions.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.templates`

- **Firma:** `templates(query: TemplatesQueryDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L108) (L108–117)
- **Decoradores:** `@Get('templates')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listTemplates.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.template`

- **Firma:** `template(id: string, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L119) (L119–125)
- **Decoradores:** `@Get('templates/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getTemplate.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.createTemplate`

- **Firma:** `createTemplate(dto: SaveTemplateRequestDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L127) (L127–135)
- **Decoradores:** `@Post('templates')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.saveTemplate.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.replaceTemplate`

- **Firma:** `replaceTemplate(id: string, dto: SaveTemplateRequestDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L137) (L137–145)
- **Decoradores:** `@Put('templates/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.saveTemplate.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.templateStatus`

- **Firma:** `templateStatus(id: string, dto: TemplateStatusRequestDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L147) (L147–154)
- **Decoradores:** `@Patch('templates/:id/status')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.setTemplateActive.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.duplicate`

- **Firma:** `duplicate(id: string, dto: DuplicateTemplateRequestDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L156) (L156–169)
- **Decoradores:** `@Post('templates/:id/duplicate')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.duplicateTemplate.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.quotations`

- **Firma:** `quotations(query: QuotationsQueryDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L172) (L172–183)
- **Decoradores:** `@Get('quotations')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listQuotations.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.dashboard`

- **Firma:** `dashboard(query: DashboardQueryDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L185) (L185–195)
- **Decoradores:** `@Get('quotations/dashboard')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.dashboardUseCase.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.create`

- **Firma:** `create(dto: CreateQuotationRequestDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L197) (L197–205)
- **Decoradores:** `@Post('quotations')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.createQuotation.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.pdf`

- **Firma:** `pdf(id: string, user: RequestUser, res: Response): Promise<void>` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L207) (L207–214)
- **Decoradores:** `@Get('quotations/:id/pdf')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `sendPdf`, `this.quotationPdf.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.quotation`

- **Firma:** `quotation(id: string, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L216) (L216–222)
- **Decoradores:** `@Get('quotations/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getQuotation.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.update`

- **Firma:** `update(id: string, dto: UpdateQuotationRequestDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L224) (L224–232)
- **Decoradores:** `@Put('quotations/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.updateQuotation.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.observations`

- **Firma:** `observations(id: string, dto: ObservationsRequestDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L234) (L234–246)
- **Decoradores:** `@Patch('quotations/:id/observations')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.updateObservations.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.status`

- **Firma:** `status(id: string, dto: StatusActionRequestDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L248) (L248–261)
- **Decoradores:** `@Post('quotations/:id/status')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.changeStatus.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.cancel`

- **Firma:** `cancel(id: string, dto: CancelQuotationRequestDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L263) (L263–277)
- **Decoradores:** `@Post('quotations/:id/cancel')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.cancelQuotation.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.pay`

- **Firma:** `pay(id: string, dto: RegisterPaymentRequestDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L280) (L280–294)
- **Decoradores:** `@Post('quotations/:id/payments')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.registerPayment.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.void`

- **Firma:** `void(paymentId: string, dto: VoidPaymentRequestDto, user: RequestUser)` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L296) (L296–309)
- **Decoradores:** `@Post('payments/:paymentId/void')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('paymentId', ParseUUIDPipe) paymentId`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.voidPayment.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SchoolListsController.receipt`

- **Firma:** `receipt(paymentId: string, user: RequestUser, res: Response): Promise<void>` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L311) (L311–318)
- **Decoradores:** `@Get('payments/:paymentId/receipt')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('paymentId', ParseUUIDPipe) paymentId`, `@CurrentUser() user`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `sendPdf`, `this.receiptPdf.execute`, `actor`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

#### Función `actor` (L57–60)

- **Tipo:** función local del archivo
- **Firma:** `actor(user: RequestUser): Actor` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L57)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `sendPdf` (L62–69)

- **Tipo:** función local del archivo
- **Firma:** `sendPdf(res: Response, file: { filename: string; pdf: Buffer }): void` — [school-lists.controller.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts#L62)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `res.set`, `res.end`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-school-lists-presentation-dtos-school-list-request-dto-ts"></a>

### school-list.request.dto.ts

- **Ruta:** [school-list.request.dto.ts](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/dtos/school-list.request.dto.ts) (`comercial-jhoel-api/src/modules/school-lists/presentation/dtos/school-list.request.dto.ts`, 187 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `school-lists`
- **Responsabilidad:** DTO de entrada: declara `TemplateItemRequestDto`, `SaveTemplateRequestDto`, `TemplateStatusRequestDto`, `DuplicateTemplateRequestDto`, `TemplatesQueryDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [school-list.repository.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-repositories-school-list-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)

#### Clase `TemplateItemRequestDto` (L37–44)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `SaveTemplateRequestDto` (L46–60)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `TemplateStatusRequestDto` (L62–64)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `DuplicateTemplateRequestDto` (L66–69)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `TemplatesQueryDto` (L71–76)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `QuotationItemRequestDto` (L79–93)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaymentRequestDto` (L95–101)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `QuotationBodyDto` (L103–119)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CreateQuotationRequestDto` (L121–136)

- **Herencia / contratos:** extends QuotationBodyDto
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `UpdateQuotationRequestDto` (L138–140)

- **Herencia / contratos:** extends QuotationBodyDto
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `ObservationsRequestDto` (L142–145)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `StatusActionRequestDto` (L147–150)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RegisterPaymentRequestDto` (L152–154)

- **Herencia / contratos:** extends PaymentRequestDto
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `VoidPaymentRequestDto` (L156–159)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CancelQuotationRequestDto` (L161–169)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `QuotationsQueryDto` (L171–181)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `DashboardQueryDto` (L183–186)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-school-lists-school-lists-module-ts"></a>

### school-lists.module.ts

- **Ruta:** [school-lists.module.ts](../../../../comercial-jhoel-api/src/modules/school-lists/school-lists.module.ts) (`comercial-jhoel-api/src/modules/school-lists/school-lists.module.ts`, 57 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `school-lists`
- **Responsabilidad:** Listas Escolares (migration 1760007900000).
- **Depende de (archivos del proyecto):** [company-settings.module.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts), [school-list.repository.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-domain-repositories-school-list-repository-ts), [typeorm-school-list.repository.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-infrastructure-persistence-typeorm-school-list-repository-ts), [school-list.use-cases.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-application-use-cases-school-list-use-cases-ts), [school-lists.controller.ts](school-lists.md#f-comercial-jhoel-api-src-modules-school-lists-presentation-controllers-school-lists-controller-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `SchoolListsModule` (L31–56)

- **Decoradores:** `@Module({ imports: [CompanySettingsModule], controllers: [SchoolListsController], providers: [ { provide: SCHOOL_LIST_REPOSITORY, useClass: TypeOrmSchoolListRepo`
- **Propósito:** Listas Escolares (migration 1760007900000). Independent of Cotizaciones, Ventas and inventory: it never writes products, stock, sales or cash boxes.
