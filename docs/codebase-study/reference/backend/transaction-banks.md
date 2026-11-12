# Módulo backend `transaction-banks`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/public-transaction-banks/images/:id` | [transaction-bank-images.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-bank-images.controller.ts#L18) `TransactionBankImagesController.getImage` | [GetTransactionBankImageUseCase](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-image-use-case-ts) | `TransactionBankRepository`.getImage | — | — |
| `POST /api/transaction-banks` | [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L54) `TransactionBanksController.create` | [CreateTransactionBankUseCase](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-create-transaction-bank-use-case-ts) | `TransactionBankRepository`.findByActiveName/create | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `TransactionBankService.createTransactionBank` |
| `GET /api/transaction-banks` | [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L68) `TransactionBanksController.findAll` | [ListTransactionBanksUseCase](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-list-transaction-banks-use-case-ts) | `TransactionBankRepository`.findAll | UseGuards(JwtAuthGuard) | `TransactionBankService.getTransactionBanks` |
| `GET /api/transaction-banks/:id` | [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L75) `TransactionBanksController.findOne` | [GetTransactionBankByIdUseCase](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-by-id-use-case-ts) | `TransactionBankRepository`.findById | UseGuards(JwtAuthGuard) | `TransactionBankService.getTransactionBankById` |
| `PATCH /api/transaction-banks/:id` | [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L82) `TransactionBanksController.update` | [UpdateTransactionBankUseCase](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-use-case-ts) | `TransactionBankRepository`.findById/findByActiveName/update | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `TransactionBankService.updateTransactionBank` |
| `DELETE /api/transaction-banks/:id` | [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L96) `TransactionBanksController.deactivate` | [DeactivateTransactionBankUseCase](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-deactivate-transaction-bank-use-case-ts) | `TransactionBankRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `TransactionBankService.deleteTransactionBank` |
| `POST /api/transaction-banks/:id/image` | [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L104) `TransactionBanksController.setImage` | [SetTransactionBankImageUseCase](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-set-transaction-bank-image-use-case-ts) | `TransactionBankRepository`.findById/setImage | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `TransactionBankService.setImage` |
| `DELETE /api/transaction-banks/:id/image` | [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L123) `TransactionBanksController.removeImage` | [RemoveTransactionBankImageUseCase](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-remove-transaction-bank-image-use-case-ts) | `TransactionBankRepository`.findById/removeImage | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `TransactionBankService.removeImage` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [transaction-bank-output.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-application-dtos-transaction-bank-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toTransactionBankOutput`, `TransactionBankOutput` (sin comentario de documentación en el código). | 1 internas | 6 | Media (6 consumidores) |
| [create-transaction-bank.use-case.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-create-transaction-bank-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateTransactionBankUseCase`, `CreateTransactionBankInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [deactivate-transaction-bank.use-case.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-deactivate-transaction-bank-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — DELETE /transaction-banks/:id never removes the row (historical bank-deposit operations keep referencing it). | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-transaction-bank-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetTransactionBankByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-transaction-bank-image.use-case.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-image-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetTransactionBankImageUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [list-transaction-banks.use-case.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-list-transaction-banks-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListTransactionBanksUseCase`, `ListTransactionBanksInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [remove-transaction-bank-image.use-case.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-remove-transaction-bank-image-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `RemoveTransactionBankImageUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [set-transaction-bank-image.use-case.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-set-transaction-bank-image-use-case-ts) | .ts | Caso de uso | Aplicación | Logo del banco agente — solo identificación visual (icono del modal de Transaccionar); no toca ninguna regla financiera. | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [transaction-bank-image.use-cases.spec.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-image-use-cases-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `buildTransactionBank`, `PNG` (sin comentario de documentación en el código). | 7 internas | 0 | Soporte (pruebas) |
| [transaction-bank.use-cases.spec.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-use-cases-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `buildTransactionBank` (sin comentario de documentación en el código). | 7 internas | 0 | Soporte (pruebas) |
| [update-transaction-bank-guayacan.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-guayacan-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `buildAgent` (sin comentario de documentación en el código). | 3 internas | 0 | Soporte (pruebas) |
| [update-transaction-bank.use-case.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateTransactionBankUseCase`, `UpdateTransactionBankInput`, `DEFAULT_GUAYACAN_COMMISSION` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [assert-valid-transaction-bank-image.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-application-utils-assert-valid-transaction-bank-image-ts) | .ts | Utilidad | Aplicación | Utilidad: declara `assertValidTransactionBankImage`, `UploadedTransactionBankImage`, `MAX_TRANSACTION_BANK_IMAGE_SIZE_BYTES`, `ALLOWED_MIME_TYPES` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [transaction-bank.entity.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-domain-entities-transaction-bank-entity-ts) | .ts | Entidad de dominio | Dominio | "Banco Agente" — the simple catalog Transaccionar's dropdown reads from. | 0 internas | 7 | Media (7 consumidores) |
| [invalid-transaction-bank-image.error.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-invalid-transaction-bank-image-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidTransactionBankImageError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [transaction-bank-cash-box.error.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-cash-box-error-ts) | .ts | Errores de dominio | Dominio | Solo un banco agente puede ser Cooperativa Guayacán (índice único `UQ_transaction_banks_cash_box_code`). | 1 internas | 1 | Baja (1 consumidores) |
| [transaction-bank-inactive.error.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-inactive-error-ts) | .ts | Errores de dominio | Dominio | Raised when a deposit operation (Transaccionar) is registered against a deactivated banco agente. | 1 internas | 0 | Baja (0 consumidores) |
| [transaction-bank-name-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-name-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `TransactionBankNameAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [transaction-bank-not-found.error.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `TransactionBankNotFoundError` (sin comentario de documentación en el código). | 1 internas | 8 | Media (8 consumidores) |
| [transaction-bank.repository.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateTransactionBankData`, `UpdateTransactionBankData`, `FindTransactionBanksOptions`, `TransactionBankImageBytes`, `TransactionBankRepository` (sin comentario de documentación en el código). | 1 internas | 14 | Alta (14 consumidores) |
| [transaction-bank.mapper.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-transaction-bank-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `TransactionBankMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [transaction-bank.orm-entity.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-transaction-bank-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `TransactionBankOrmEntity` (sin comentario de documentación en el código). | 2 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [typeorm-transaction-bank.repository.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-typeorm-transaction-bank-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmTransactionBankRepository` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [transaction-bank-images.controller.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-bank-images-controller-ts) | .ts | Controlador | Presentación | Sin guard — un `&lt;img&gt;` no puede enviar el Bearer token. | 1 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [transaction-banks.controller.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts) | .ts | Controlador | Presentación | CRUD is admin-only (create/update/deactivate) — same policy as AccountTypesController/CategoriesController. | 15 internas; ext.: @nestjs/common, @nestjs/platform-express | 1 | Media (controlador) |
| [create-transaction-bank.request.dto.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-dtos-create-transaction-bank-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateTransactionBankRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [list-transaction-banks.query.dto.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-dtos-list-transaction-banks-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListTransactionBanksQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [transaction-bank.response.dto.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-dtos-transaction-bank-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `TransactionBankResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [update-transaction-bank.request.dto.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-dtos-update-transaction-bank-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateTransactionBankRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [transaction-banks.module.ts](#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `TransactionBanksModule` (sin comentario de documentación en el código). | 13 internas; ext.: @nestjs/common, @nestjs/typeorm | 3 | Media (3 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-application-dtos-transaction-bank-output-ts"></a>

### transaction-bank-output.ts

- **Ruta:** [transaction-bank-output.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/dtos/transaction-bank-output.ts) (`comercial-jhoel-api/src/modules/transaction-banks/application/dtos/transaction-bank-output.ts`, 37 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** DTO de salida (aplicación): declara `toTransactionBankOutput`, `TransactionBankOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-bank.entity.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-entities-transaction-bank-entity-ts)
- **Consumidores:** [create-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-create-transaction-bank-use-case-ts), [get-transaction-bank-by-id.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-by-id-use-case-ts), [list-transaction-banks.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-list-transaction-banks-use-case-ts), [remove-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-remove-transaction-bank-image-use-case-ts), [set-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-set-transaction-bank-image-use-case-ts), [update-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-use-case-ts)

**Interfaces, tipos y enums:**

- `interface TransactionBankOutput` (L3): sin documentación — miembros: `id`, `name`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`, `hasImage`, `cashBoxCode`, `commissionPerTransaction`
#### Función `toTransactionBankOutput` (L19–36)

- **Tipo:** función exportada
- **Firma:** `toTransactionBankOutput(transactionBank: TransactionBank): TransactionBankOutput` — [transaction-bank-output.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/dtos/transaction-bank-output.ts#L19)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-create-transaction-bank-use-case-ts), [get-transaction-bank-by-id.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-by-id-use-case-ts), [remove-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-remove-transaction-bank-image-use-case-ts), [set-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-set-transaction-bank-image-use-case-ts), [update-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-create-transaction-bank-use-case-ts"></a>

### create-transaction-bank.use-case.ts

- **Ruta:** [create-transaction-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/create-transaction-bank.use-case.ts) (`comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/create-transaction-bank.use-case.ts`, 40 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Caso de uso: declara `CreateTransactionBankUseCase`, `CreateTransactionBankInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-bank-name-already-exists.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-name-already-exists-error-ts), [transaction-bank-output.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-dtos-transaction-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-bank.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-use-cases-spec-ts), [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts), [transaction-banks.module.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateTransactionBankInput` (L10): sin documentación — miembros: `name`, `createdBy`

#### Clase `CreateTransactionBankUseCase` (L15–39)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(TRANSACTION_BANK_REPOSITORY) transactionBankRepository: TransactionBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 22–38 | `input: CreateTransactionBankInput` | `Promise<TransactionBankOutput>` |

##### `CreateTransactionBankUseCase.execute`

- **Firma:** `execute(input: CreateTransactionBankInput): Promise<TransactionBankOutput>` — [create-transaction-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/create-transaction-bank.use-case.ts#L22) (L22–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.name.trim().replace`, `input.name.trim`, `this.transactionBankRepository.findByActiveName`, `new TransactionBankNameAlreadyExistsError`, `this.transactionBankRepository.create`, `toTransactionBankOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new TransactionBankNameAlreadyExistsError(name)`
- **Consumidores:** [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-deactivate-transaction-bank-use-case-ts"></a>

### deactivate-transaction-bank.use-case.ts

- **Ruta:** [deactivate-transaction-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/deactivate-transaction-bank.use-case.ts) (`comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/deactivate-transaction-bank.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Soft delete only — DELETE /transaction-banks/:id never removes the row (historical bank-deposit operations keep referencing it).
- **Depende de (archivos del proyecto):** [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-bank-not-found.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-bank.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-use-cases-spec-ts), [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts), [transaction-banks.module.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts)

#### Clase `DeactivateTransactionBankUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — DELETE /transaction-banks/:id never removes the row (historical bank-deposit operations keep referencing it).
- **Dependencias inyectadas (constructor):** `@Inject(TRANSACTION_BANK_REPOSITORY) transactionBankRepository: TransactionBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<void>` |

##### `DeactivateTransactionBankUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-transaction-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/deactivate-transaction-bank.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionBankRepository.findById`, `new TransactionBankNotFoundError`, `this.transactionBankRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new TransactionBankNotFoundError(id)`
- **Consumidores:** [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-by-id-use-case-ts"></a>

### get-transaction-bank-by-id.use-case.ts

- **Ruta:** [get-transaction-bank-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/get-transaction-bank-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/get-transaction-bank-by-id.use-case.ts`, 25 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Caso de uso: declara `GetTransactionBankByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-bank-not-found.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-not-found-error-ts), [transaction-bank-output.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-dtos-transaction-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts), [transaction-banks.module.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts)

#### Clase `GetTransactionBankByIdUseCase` (L10–24)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(TRANSACTION_BANK_REPOSITORY) transactionBankRepository: TransactionBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–23 | `id: string` | `Promise<TransactionBankOutput>` |

##### `GetTransactionBankByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<TransactionBankOutput>` — [get-transaction-bank-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/get-transaction-bank-by-id.use-case.ts#L17) (L17–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionBankRepository.findById`, `new TransactionBankNotFoundError`, `toTransactionBankOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new TransactionBankNotFoundError(id)`
- **Consumidores:** [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-image-use-case-ts"></a>

### get-transaction-bank-image.use-case.ts

- **Ruta:** [get-transaction-bank-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/get-transaction-bank-image.use-case.ts) (`comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/get-transaction-bank-image.use-case.ts`, 24 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Caso de uso: declara `GetTransactionBankImageUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-bank-not-found.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-bank-image.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-image-use-cases-spec-ts), [transaction-bank-images.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-bank-images-controller-ts), [transaction-banks.module.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts)

#### Clase `GetTransactionBankImageUseCase` (L9–23)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(TRANSACTION_BANK_REPOSITORY) transactionBankRepository: TransactionBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 16–22 | `id: string` | `Promise<TransactionBankImageBytes>` |

##### `GetTransactionBankImageUseCase.execute`

- **Firma:** `execute(id: string): Promise<TransactionBankImageBytes>` — [get-transaction-bank-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/get-transaction-bank-image.use-case.ts#L16) (L16–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionBankRepository.getImage`, `new TransactionBankNotFoundError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new TransactionBankNotFoundError(id)`
- **Consumidores:** [transaction-bank-images.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-bank-images-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-list-transaction-banks-use-case-ts"></a>

### list-transaction-banks.use-case.ts

- **Ruta:** [list-transaction-banks.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/list-transaction-banks.use-case.ts) (`comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/list-transaction-banks.use-case.ts`, 29 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Caso de uso: declara `ListTransactionBanksUseCase`, `ListTransactionBanksInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-bank-output.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-dtos-transaction-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts), [transaction-banks.module.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts)

**Interfaces, tipos y enums:**

- `interface ListTransactionBanksInput` (L9): sin documentación — miembros: `includeInactive`

#### Clase `ListTransactionBanksUseCase` (L13–28)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(TRANSACTION_BANK_REPOSITORY) transactionBankRepository: TransactionBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–27 | `input?: ListTransactionBanksInput` | `Promise<TransactionBankOutput[]>` |

##### `ListTransactionBanksUseCase.execute`

- **Firma:** `execute(input?: ListTransactionBanksInput): Promise<TransactionBankOutput[]>` — [list-transaction-banks.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/list-transaction-banks.use-case.ts#L20) (L20–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionBankRepository.findAll`, `transactionBanks.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-remove-transaction-bank-image-use-case-ts"></a>

### remove-transaction-bank-image.use-case.ts

- **Ruta:** [remove-transaction-bank-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/remove-transaction-bank-image.use-case.ts) (`comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/remove-transaction-bank-image.use-case.ts`, 27 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Caso de uso: declara `RemoveTransactionBankImageUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-bank-not-found.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-not-found-error-ts), [transaction-bank-output.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-dtos-transaction-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-bank-image.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-image-use-cases-spec-ts), [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts), [transaction-banks.module.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts)

#### Clase `RemoveTransactionBankImageUseCase` (L10–26)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(TRANSACTION_BANK_REPOSITORY) transactionBankRepository: TransactionBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–25 | `id: string`, `userId: string` | `Promise<TransactionBankOutput>` |

##### `RemoveTransactionBankImageUseCase.execute`

- **Firma:** `execute(id: string, userId: string): Promise<TransactionBankOutput>` — [remove-transaction-bank-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/remove-transaction-bank-image.use-case.ts#L17) (L17–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionBankRepository.findById`, `new TransactionBankNotFoundError`, `this.transactionBankRepository.removeImage`, `toTransactionBankOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new TransactionBankNotFoundError(id)`
- **Consumidores:** [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-set-transaction-bank-image-use-case-ts"></a>

### set-transaction-bank-image.use-case.ts

- **Ruta:** [set-transaction-bank-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/set-transaction-bank-image.use-case.ts) (`comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/set-transaction-bank-image.use-case.ts`, 53 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Logo del banco agente — solo identificación visual (icono del modal de Transaccionar); no toca ninguna regla financiera.
- **Depende de (archivos del proyecto):** [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-bank-not-found.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-not-found-error-ts), [assert-valid-transaction-bank-image.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-utils-assert-valid-transaction-bank-image-ts), [transaction-bank-output.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-dtos-transaction-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-bank-image.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-image-use-cases-spec-ts), [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts), [transaction-banks.module.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts)

**Interfaces, tipos y enums:**

- `interface SetTransactionBankImageInput` (L14): sin documentación — miembros: `transactionBankId`, `image`, `userId`

#### Clase `SetTransactionBankImageUseCase` (L21–52)

- **Decoradores:** `@Injectable()`
- **Propósito:** Logo del banco agente — solo identificación visual (icono del modal de Transaccionar); no toca ninguna regla financiera.
- **Dependencias inyectadas (constructor):** `@Inject(TRANSACTION_BANK_REPOSITORY) transactionBankRepository: TransactionBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 28–51 | `input: SetTransactionBankImageInput` | `Promise<TransactionBankOutput>` |

##### `SetTransactionBankImageUseCase.execute`

- **Firma:** `execute(input: SetTransactionBankImageInput): Promise<TransactionBankOutput>` — [set-transaction-bank-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/set-transaction-bank-image.use-case.ts#L28) (L28–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionBankRepository.findById`, `new TransactionBankNotFoundError`, `assertValidTransactionBankImage`, `this.transactionBankRepository.setImage`, `toTransactionBankOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new TransactionBankNotFoundError(input.transactionBankId)`
- **Consumidores:** [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-image-use-cases-spec-ts"></a>

### transaction-bank-image.use-cases.spec.ts

- **Ruta:** [transaction-bank-image.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/transaction-bank-image.use-cases.spec.ts) (`comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/transaction-bank-image.use-cases.spec.ts`, 104 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Prueba unitaria: declara `buildTransactionBank`, `PNG` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [set-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-set-transaction-bank-image-use-case-ts), [remove-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-remove-transaction-bank-image-use-case-ts), [get-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-image-use-case-ts), [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-bank.entity.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-entities-transaction-bank-entity-ts), [transaction-bank-not-found.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-not-found-error-ts), [invalid-transaction-bank-image.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-invalid-transaction-bank-image-error-ts)
- **Consumidores:** —
#### Función `buildTransactionBank` (L9–22)

- **Tipo:** función local del archivo
- **Firma:** `buildTransactionBank(hasImage?): TransactionBank` — [transaction-bank-image.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/transaction-bank-image.use-cases.spec.ts#L9)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `TransactionBank.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-use-cases-spec-ts"></a>

### transaction-bank.use-cases.spec.ts

- **Ruta:** [transaction-bank.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/transaction-bank.use-cases.spec.ts) (`comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/transaction-bank.use-cases.spec.ts`, 143 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Prueba unitaria: declara `buildTransactionBank` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [create-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-create-transaction-bank-use-case-ts), [update-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-use-case-ts), [deactivate-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-deactivate-transaction-bank-use-case-ts), [transaction-bank-name-already-exists.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-name-already-exists-error-ts), [transaction-bank-not-found.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-not-found-error-ts), [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-bank.entity.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-entities-transaction-bank-entity-ts)
- **Consumidores:** —
#### Función `buildTransactionBank` (L9–23)

- **Tipo:** función local del archivo
- **Firma:** `buildTransactionBank(overrides?: Partial<{ name: string }>): TransactionBank` — [transaction-bank.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/transaction-bank.use-cases.spec.ts#L9)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `TransactionBank.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-guayacan-use-case-spec-ts"></a>

### update-transaction-bank-guayacan.use-case.spec.ts

- **Ruta:** [update-transaction-bank-guayacan.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/update-transaction-bank-guayacan.use-case.spec.ts) (`comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/update-transaction-bank-guayacan.use-case.spec.ts`, 108 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Prueba unitaria: declara `buildAgent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [update-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-use-case-ts), [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-bank.entity.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-entities-transaction-bank-entity-ts)
- **Consumidores:** —
#### Función `buildAgent` (L5–24)

- **Tipo:** función local del archivo
- **Firma:** `buildAgent(overrides?: { cashBoxCode?: 'GUAYACAN' \| null; commissionPerTransaction?: number \| null; }): TransactionBank` — [update-transaction-bank-guayacan.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/update-transaction-bank-guayacan.use-case.spec.ts#L5)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `TransactionBank.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-use-case-ts"></a>

### update-transaction-bank.use-case.ts

- **Ruta:** [update-transaction-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/update-transaction-bank.use-case.ts) (`comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/update-transaction-bank.use-case.ts`, 81 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Caso de uso: declara `UpdateTransactionBankUseCase`, `UpdateTransactionBankInput`, `DEFAULT_GUAYACAN_COMMISSION` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-bank-not-found.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-not-found-error-ts), [transaction-bank-name-already-exists.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-name-already-exists-error-ts), [transaction-bank-output.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-dtos-transaction-bank-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [transaction-bank.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-use-cases-spec-ts), [update-transaction-bank-guayacan.use-case.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-guayacan-use-case-spec-ts), [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts), [transaction-banks.module.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts)

**Interfaces, tipos y enums:**

- `interface UpdateTransactionBankInput` (L11): sin documentación — miembros: `name`, `isGuayacan`, `commissionPerTransaction`, `updatedBy`

**Constantes exportadas:**

- `DEFAULT_GUAYACAN_COMMISSION` (L20): Tarifa por defecto al marcar Guayacán sin indicar una — la única copia; luego vive en `transaction_banks.commission_per_transaction`. = `3`

#### Clase `UpdateTransactionBankUseCase` (L22–80)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(TRANSACTION_BANK_REPOSITORY) transactionBankRepository: TransactionBankRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 29–79 | `id: string`, `input: UpdateTransactionBankInput` | `Promise<TransactionBankOutput>` |

##### `UpdateTransactionBankUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateTransactionBankInput): Promise<TransactionBankOutput>` — [update-transaction-bank.use-case.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/update-transaction-bank.use-case.ts#L29) (L29–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionBankRepository.findById`, `new TransactionBankNotFoundError`, `input.name?.trim().replace`, `input.name?.trim`, `this.transactionBankRepository.findByActiveName`, `new TransactionBankNameAlreadyExistsError`, `this.transactionBankRepository.update`, `toTransactionBankOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionBankRepository.update`
- **Errores que lanza:** `new TransactionBankNotFoundError(id)`, `new TransactionBankNameAlreadyExistsError(name)`
- **Consumidores:** [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-application-utils-assert-valid-transaction-bank-image-ts"></a>

### assert-valid-transaction-bank-image.ts

- **Ruta:** [assert-valid-transaction-bank-image.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/utils/assert-valid-transaction-bank-image.ts) (`comercial-jhoel-api/src/modules/transaction-banks/application/utils/assert-valid-transaction-bank-image.ts`, 31 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Utilidad: declara `assertValidTransactionBankImage`, `UploadedTransactionBankImage`, `MAX_TRANSACTION_BANK_IMAGE_SIZE_BYTES`, `ALLOWED_MIME_TYPES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [invalid-transaction-bank-image.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-invalid-transaction-bank-image-error-ts)
- **Consumidores:** [set-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-set-transaction-bank-image-use-case-ts)

**Interfaces, tipos y enums:**

- `interface UploadedTransactionBankImage` (L8): sin documentación — miembros: `buffer`, `mimetype`, `size`

**Constantes exportadas:**

- `MAX_TRANSACTION_BANK_IMAGE_SIZE_BYTES` (L4): Mismo techo y formatos que el resto de imágenes del proyecto (Catálogo de Bancos, Teléfonos, Noticias). = `5 * 1024 * 1024`
#### Función `assertValidTransactionBankImage` (L14–30)

- **Tipo:** función exportada
- **Firma:** `assertValidTransactionBankImage(file: UploadedTransactionBankImage \| undefined): asserts file is UploadedTransactionBankImage` — [assert-valid-transaction-bank-image.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/utils/assert-valid-transaction-bank-image.ts#L14)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new InvalidTransactionBankImageError`, `ALLOWED_MIME_TYPES.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidTransactionBankImageError('La imagen está vacía.')`, `new InvalidTransactionBankImageError( 'La imagen debe ser JPG, PNG o WEBP.', )`, `new InvalidTransactionBankImageError( 'La imagen no puede superar los 5 MB.', )`
- **Consumidores:** [set-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-set-transaction-bank-image-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-domain-entities-transaction-bank-entity-ts"></a>

### transaction-bank.entity.ts

- **Ruta:** [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts) (`comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts`, 75 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** "Banco Agente" — the simple catalog Transaccionar's dropdown reads from.
- **Consumidores:** [transaction-bank-output.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-dtos-transaction-bank-output-ts), [transaction-bank-image.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-image-use-cases-spec-ts), [transaction-bank.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-use-cases-spec-ts), [update-transaction-bank-guayacan.use-case.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-guayacan-use-case-spec-ts), [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-bank.mapper.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-transaction-bank-mapper-ts), [typeorm-transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-typeorm-transaction-bank-repository-ts)

**Interfaces, tipos y enums:**

- `interface TransactionBankProps` (L1): sin documentación — miembros: `id`, `name`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`, `hasImage`, `cashBoxCode`, `commissionPerTransaction`

#### Clase `TransactionBank` (L20–74)

- **Propósito:** "Banco Agente" — the simple catalog Transaccionar's dropdown reads from. Deliberately separate from `banks` (Sistema→Bancos / Agentes Bancarios→Bancos), which is a heavier entity tied to account numbers and Cuadre de Agentes balances.
- **Dependencias inyectadas (constructor):** `props: TransactionBankProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 23–25 | `props: TransactionBankProps` | `TransactionBank` |
| `id` | getter public | 27–29 | — | `string` |
| `name` | getter public | 31–33 | — | `string` |
| `isActive` | getter public | 35–37 | — | `boolean` |
| `createdAt` | getter public | 39–41 | — | `Date` |
| `updatedAt` | getter public | 43–45 | — | `Date` |
| `createdBy` | getter public | 47–49 | — | `string` |
| `createdByUsername` | getter public | 51–53 | — | `string` |
| `updatedBy` | getter public | 55–57 | — | `string \| null` |
| `updatedByUsername` | getter public | 59–61 | — | `string \| null` |
| `hasImage` | getter public | 63–65 | — | `boolean` |
| `cashBoxCode` | getter public | 67–69 | — | `'GUAYACAN' \| null` |
| `commissionPerTransaction` | getter public | 71–73 | — | `number \| null` |

##### `TransactionBank.create`

- **Firma:** `create(props: TransactionBankProps): TransactionBank` — [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts#L23) (L23–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new TransactionBank`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [transaction-bank-image.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-image-use-cases-spec-ts), [transaction-bank.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-use-cases-spec-ts), [update-transaction-bank-guayacan.use-case.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-guayacan-use-case-spec-ts), [transaction-bank.mapper.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-transaction-bank-mapper-ts), [typeorm-transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-typeorm-transaction-bank-repository-ts)

##### `TransactionBank.id`

- **Firma:** `id(): string` — [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBank.name`

- **Firma:** `name(): string` — [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBank.isActive`

- **Firma:** `isActive(): boolean` — [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBank.createdAt`

- **Firma:** `createdAt(): Date` — [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBank.updatedAt`

- **Firma:** `updatedAt(): Date` — [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBank.createdBy`

- **Firma:** `createdBy(): string` — [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBank.createdByUsername`

- **Firma:** `createdByUsername(): string` — [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBank.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBank.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBank.hasImage`

- **Firma:** `hasImage(): boolean` — [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBank.cashBoxCode`

- **Firma:** `cashBoxCode(): 'GUAYACAN' \| null` — [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBank.commissionPerTransaction`

- **Firma:** `commissionPerTransaction(): number \| null` — [transaction-bank.entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/entities/transaction-bank.entity.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-invalid-transaction-bank-image-error-ts"></a>

### invalid-transaction-bank-image.error.ts

- **Ruta:** [invalid-transaction-bank-image.error.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/errors/invalid-transaction-bank-image.error.ts) (`comercial-jhoel-api/src/modules/transaction-banks/domain/errors/invalid-transaction-bank-image.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Errores de dominio: declara `InvalidTransactionBankImageError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [transaction-bank-image.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-image-use-cases-spec-ts), [assert-valid-transaction-bank-image.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-utils-assert-valid-transaction-bank-image-ts)

#### Clase `InvalidTransactionBankImageError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `message: string`
<a id="f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-cash-box-error-ts"></a>

### transaction-bank-cash-box.error.ts

- **Ruta:** [transaction-bank-cash-box.error.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/errors/transaction-bank-cash-box.error.ts) (`comercial-jhoel-api/src/modules/transaction-banks/domain/errors/transaction-bank-cash-box.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Solo un banco agente puede ser Cooperativa Guayacán (índice único `UQ_transaction_banks_cash_box_code`).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-typeorm-transaction-bank-repository-ts)

#### Clase `TransactionBankCashBoxAlreadyAssignedError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Solo un banco agente puede ser Cooperativa Guayacán (índice único `UQ_transaction_banks_cash_box_code`).
<a id="f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-inactive-error-ts"></a>

### transaction-bank-inactive.error.ts

- **Ruta:** [transaction-bank-inactive.error.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/errors/transaction-bank-inactive.error.ts) (`comercial-jhoel-api/src/modules/transaction-banks/domain/errors/transaction-bank-inactive.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Raised when a deposit operation (Transaccionar) is registered against a deactivated banco agente.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** —

#### Clase `TransactionBankInactiveError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Raised when a deposit operation (Transaccionar) is registered against a deactivated banco agente.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-name-already-exists-error-ts"></a>

### transaction-bank-name-already-exists.error.ts

- **Ruta:** [transaction-bank-name-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/errors/transaction-bank-name-already-exists.error.ts) (`comercial-jhoel-api/src/modules/transaction-banks/domain/errors/transaction-bank-name-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Errores de dominio: declara `TransactionBankNameAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-create-transaction-bank-use-case-ts), [transaction-bank.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-use-cases-spec-ts), [update-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-use-case-ts), [typeorm-transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-typeorm-transaction-bank-repository-ts)

#### Clase `TransactionBankNameAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `name: string`
<a id="f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-not-found-error-ts"></a>

### transaction-bank-not-found.error.ts

- **Ruta:** [transaction-bank-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/errors/transaction-bank-not-found.error.ts) (`comercial-jhoel-api/src/modules/transaction-banks/domain/errors/transaction-bank-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Errores de dominio: declara `TransactionBankNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-deactivate-transaction-bank-use-case-ts), [get-transaction-bank-by-id.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-by-id-use-case-ts), [get-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-image-use-case-ts), [remove-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-remove-transaction-bank-image-use-case-ts), [set-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-set-transaction-bank-image-use-case-ts), [transaction-bank-image.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-image-use-cases-spec-ts), [transaction-bank.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-use-cases-spec-ts), [update-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-use-case-ts)

#### Clase `TransactionBankNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts"></a>

### transaction-bank.repository.ts

- **Ruta:** [transaction-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/domain/repositories/transaction-bank.repository.ts) (`comercial-jhoel-api/src/modules/transaction-banks/domain/repositories/transaction-bank.repository.ts`, 43 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateTransactionBankData`, `UpdateTransactionBankData`, `FindTransactionBanksOptions`, `TransactionBankImageBytes`, `TransactionBankRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-bank.entity.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-entities-transaction-bank-entity-ts)
- **Consumidores:** [export-bank-deposits-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-deposits-report-pdf-use-case-ts), [create-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-create-transaction-bank-use-case-ts), [deactivate-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-deactivate-transaction-bank-use-case-ts), [get-transaction-bank-by-id.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-by-id-use-case-ts), [get-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-image-use-case-ts), [list-transaction-banks.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-list-transaction-banks-use-case-ts), [remove-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-remove-transaction-bank-image-use-case-ts), [set-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-set-transaction-bank-image-use-case-ts), [transaction-bank-image.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-image-use-cases-spec-ts), [transaction-bank.use-cases.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-transaction-bank-use-cases-spec-ts), [update-transaction-bank-guayacan.use-case.spec.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-guayacan-use-case-spec-ts), [update-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-use-case-ts), [typeorm-transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-typeorm-transaction-bank-repository-ts), [transaction-banks.module.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateTransactionBankData` (L7): sin documentación — miembros: `name`, `createdBy`
- `interface UpdateTransactionBankData` (L12): sin documentación — miembros: `name`, `cashBoxCode`, `commissionPerTransaction`, `updatedBy`
- `interface FindTransactionBanksOptions` (L19): sin documentación — miembros: `activeOnly`
- `interface TransactionBankImageBytes` (L23): sin documentación — miembros: `data`, `mimeType`
- `interface TransactionBankRepository` (L28): sin documentación — miembros: `findAll`, `findById`, `findByActiveName`, `create`, `update`, `deactivate`, `setImage`, `removeImage`, `getImage`

**Constantes exportadas:**

- `TRANSACTION_BANK_REPOSITORY` (L3) = `Symbol( 'TRANSACTION_BANK_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-transaction-bank-mapper-ts"></a>

### transaction-bank.mapper.ts

- **Ruta:** [transaction-bank.mapper.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/transaction-bank.mapper.ts) (`comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/transaction-bank.mapper.ts`, 22 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Mapper: declara `TransactionBankMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-bank.entity.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-entities-transaction-bank-entity-ts), [transaction-bank.orm-entity.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-transaction-bank-orm-entity-ts)
- **Consumidores:** [typeorm-transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-typeorm-transaction-bank-repository-ts)

#### Clase `TransactionBankMapper` (L4–21)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–20 | `orm: TransactionBankOrmEntity` | `TransactionBank` |

##### `TransactionBankMapper.toDomain`

- **Firma:** `toDomain(orm: TransactionBankOrmEntity): TransactionBank` — [transaction-bank.mapper.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/transaction-bank.mapper.ts#L5) (L5–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `TransactionBank.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-typeorm-transaction-bank-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-transaction-bank-orm-entity-ts"></a>

### transaction-bank.orm-entity.ts

- **Ruta:** [transaction-bank.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/transaction-bank.orm-entity.ts) (`comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/transaction-bank.orm-entity.ts`, 85 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `TransactionBankOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [bank-deposit-operation.orm-entity.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-infrastructure-persistence-bank-deposit-operation-orm-entity-ts), [transaction-bank.mapper.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-transaction-bank-mapper-ts), [typeorm-transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-typeorm-transaction-bank-repository-ts), [transaction-banks.module.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts)

#### Clase `TransactionBankOrmEntity` (L16–84)

- **Decoradores:** `@Entity('transaction_banks')` `@Index('UQ_transaction_banks_name_active', ['name'], { unique: true, where: '"is_active" = true', })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column isActive: boolean`, `@Column imageData: Buffer \| null`, `@Column imageMimeType: string \| null`, `@Column imageSizeBytes: number \| null`, `@Column cashBoxCode: 'GUAYACAN' \| null`, `@Column commissionPerTransaction: number \| null`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-typeorm-transaction-bank-repository-ts"></a>

### typeorm-transaction-bank.repository.ts

- **Ruta:** [typeorm-transaction-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts) (`comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts`, 131 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmTransactionBankRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-bank.entity.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-entities-transaction-bank-entity-ts), [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-bank-cash-box.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-cash-box-error-ts), [transaction-bank-name-already-exists.error.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-errors-transaction-bank-name-already-exists-error-ts), [transaction-bank.orm-entity.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-transaction-bank-orm-entity-ts), [transaction-bank.mapper.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-transaction-bank-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [transaction-banks.module.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts)

#### Clase `TypeOrmTransactionBankRepository` (L17–130)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements TransactionBankRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(TransactionBankOrmEntity) repository: Repository<TransactionBankOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 24–32 | `options: FindTransactionBanksOptions` | `Promise<TransactionBank[]>` |
| `findById` | método public async | 34–37 | `id: string` | `Promise<TransactionBank \| null>` |
| `findByActiveName` | método public async | 39–44 | `name: string` | `Promise<TransactionBank \| null>` |
| `create` | método public async | 46–60 | `data: CreateTransactionBankData` | `Promise<TransactionBank>` |
| `update` | método public async | 62–74 | `id: string`, `data: UpdateTransactionBankData` | `Promise<TransactionBank>` |
| `deactivate` | método public async | 76–78 | `id: string` | `Promise<void>` |
| `setImage` | método public async | 80–94 | `id: string`, `image: { data: Buffer; mimeType: string; sizeBytes: number }`, `updatedBy: string` | `Promise<void>` |
| `removeImage` | método public async | 96–101 | `id: string`, `updatedBy: string` | `Promise<void>` |
| `getImage` | método public async | 103–113 | `id: string` | `Promise<TransactionBankImageBytes \| null>` |
| `translateUniqueViolation` | método private | 116–129 | `error: unknown`, `name: string` | `unknown` |

##### `TypeOrmTransactionBankRepository.findAll`

- **Firma:** `findAll(options: FindTransactionBanksOptions): Promise<TransactionBank[]>` — [typeorm-transaction-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts#L24) (L24–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `TransactionBankMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionBankRepository.findById`

- **Firma:** `findById(id: string): Promise<TransactionBank \| null>` — [typeorm-transaction-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts#L34) (L34–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `TransactionBankMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionBankRepository.findByActiveName`

- **Firma:** `findByActiveName(name: string): Promise<TransactionBank \| null>` — [typeorm-transaction-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts#L39) (L39–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `TransactionBankMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionBankRepository.create`

- **Firma:** `create(data: CreateTransactionBankData): Promise<TransactionBank>` — [typeorm-transaction-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts#L46) (L46–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `TransactionBankMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionBankRepository.update`

- **Firma:** `update(id: string, data: UpdateTransactionBankData): Promise<TransactionBank>` — [typeorm-transaction-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts#L62) (L62–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `TransactionBankMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name ?? '')`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionBankRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-transaction-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts#L76) (L76–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionBankRepository.setImage`

- **Firma:** `setImage(id: string, image: { data: Buffer; mimeType: string; sizeBytes: number }, updatedBy: string): Promise<void>` — [typeorm-transaction-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts#L80) (L80–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionBankRepository.removeImage`

- **Firma:** `removeImage(id: string, updatedBy: string): Promise<void>` — [typeorm-transaction-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts#L96) (L96–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionBankRepository.getImage`

- **Firma:** `getImage(id: string): Promise<TransactionBankImageBytes \| null>` — [typeorm-transaction-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts#L103) (L103–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('b').select`, `this.repository.createQueryBuilder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTransactionBankRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, name: string): unknown` — [typeorm-transaction-bank.repository.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts#L116) (L116–129)
- **Propósito / descripción:** Safety net for the create/update race the use case's own pre-check can't close — see `TypeOrmCategoryRepository.translateUniqueViolation`'s own doc comment.
- **Dependencias (llamadas en su cuerpo):** `new TransactionBankNameAlreadyExistsError`, `new TransactionBankCashBoxAlreadyAssignedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-bank-images-controller-ts"></a>

### transaction-bank-images.controller.ts

- **Ruta:** [transaction-bank-images.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-bank-images.controller.ts) (`comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-bank-images.controller.ts`, 33 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Sin guard — un `&lt;img&gt;` no puede enviar el Bearer token.
- **Depende de (archivos del proyecto):** [get-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-image-use-case-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [transaction-banks.module.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts)

#### Clase `TransactionBankImagesController` (L12–32)

- **Decoradores:** `@Controller('public-transaction-banks')`
- **Propósito:** Sin guard — un `&lt;img&gt;` no puede enviar el Bearer token. Solo sirve el logo del banco agente (nada sensible), con el mismo header `Cross-Origin-Resource-Policy: cross-origin` que las imágenes del Catálogo de Bancos. El frontend agrega `?v=&lt;updatedAt&gt;` para invalidar la caché al reemplazar la imagen.
- **Dependencias inyectadas (constructor):** `getTransactionBankImageUseCase: GetTransactionBankImageUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getImage` | método public async | 18–31 | `id: string`, `res: Response` | `Promise<void>` |

##### `TransactionBankImagesController.getImage`

- **Firma:** `getImage(id: string, res: Response): Promise<void>` — [transaction-bank-images.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-bank-images.controller.ts#L18) (L18–31)
- **Decoradores:** `@Get('images/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.getTransactionBankImageUseCase.execute`, `res.set`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts"></a>

### transaction-banks.controller.ts

- **Ruta:** [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts) (`comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts`, 133 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** CRUD is admin-only (create/update/deactivate) — same policy as AccountTypesController/CategoriesController.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-create-transaction-bank-use-case-ts), [list-transaction-banks.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-list-transaction-banks-use-case-ts), [get-transaction-bank-by-id.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-by-id-use-case-ts), [update-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-use-case-ts), [deactivate-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-deactivate-transaction-bank-use-case-ts), [set-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-set-transaction-bank-image-use-case-ts), [remove-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-remove-transaction-bank-image-use-case-ts), [create-transaction-bank.request.dto.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-dtos-create-transaction-bank-request-dto-ts), [update-transaction-bank.request.dto.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-dtos-update-transaction-bank-request-dto-ts), [list-transaction-banks.query.dto.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-dtos-list-transaction-banks-query-dto-ts), [transaction-bank.response.dto.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-dtos-transaction-bank-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/platform-express`
- **Consumidores:** [transaction-banks.module.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts)

**Interfaces, tipos y enums:**

- `interface UploadedImageFile` (L34): sin documentación — miembros: `buffer`, `mimetype`, `size`

#### Clase `TransactionBanksController` (L41–132)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('transaction-banks')`
- **Propósito:** CRUD is admin-only (create/update/deactivate) — same policy as AccountTypesController/CategoriesController. A USER can still read the list (needed for the Transaccionar form's banco agente dropdown).
- **Dependencias inyectadas (constructor):** `createTransactionBankUseCase: CreateTransactionBankUseCase`, `listTransactionBanksUseCase: ListTransactionBanksUseCase`, `getTransactionBankByIdUseCase: GetTransactionBankByIdUseCase`, `updateTransactionBankUseCase: UpdateTransactionBankUseCase`, `deactivateTransactionBankUseCase: DeactivateTransactionBankUseCase`, `setTransactionBankImageUseCase: SetTransactionBankImageUseCase`, `removeTransactionBankImageUseCase: RemoveTransactionBankImageUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 54–66 | `dto: CreateTransactionBankRequestDto`, `userId: string` | `Promise<TransactionBankResponseDto>` |
| `findAll` | método public | 68–73 | `query: ListTransactionBanksQueryDto` | `Promise<TransactionBankResponseDto[]>` |
| `findOne` | método public | 75–80 | `id: string` | `Promise<TransactionBankResponseDto>` |
| `update` | método public | 82–94 | `id: string`, `dto: UpdateTransactionBankRequestDto`, `userId: string` | `Promise<TransactionBankResponseDto>` |
| `deactivate` | método public | 96–102 | `id: string` | `Promise<void>` |
| `setImage` | método public | 104–121 | `transactionBankId: string`, `image: UploadedImageFile \| undefined`, `userId: string` | `Promise<TransactionBankResponseDto>` |
| `removeImage` | método public | 123–131 | `id: string`, `userId: string` | `Promise<TransactionBankResponseDto>` |

##### `TransactionBanksController.create`

- **Firma:** `create(dto: CreateTransactionBankRequestDto, userId: string): Promise<TransactionBankResponseDto>` — [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L54) (L54–66)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createTransactionBankUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBanksController.findAll`

- **Firma:** `findAll(query: ListTransactionBanksQueryDto): Promise<TransactionBankResponseDto[]>` — [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L68) (L68–73)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listTransactionBanksUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBanksController.findOne`

- **Firma:** `findOne(id: string): Promise<TransactionBankResponseDto>` — [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L75) (L75–80)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getTransactionBankByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBanksController.update`

- **Firma:** `update(id: string, dto: UpdateTransactionBankRequestDto, userId: string): Promise<TransactionBankResponseDto>` — [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L82) (L82–94)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateTransactionBankUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBanksController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L96) (L96–102)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateTransactionBankUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBanksController.setImage`

- **Firma:** `setImage(transactionBankId: string, image: UploadedImageFile \| undefined, userId: string): Promise<TransactionBankResponseDto>` — [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L104) (L104–121)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post(':id/image')` `@UseInterceptors(FileInterceptor('image'))` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) transactionBankId`, `@UploadedFile() image`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setTransactionBankImageUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBanksController.removeImage`

- **Firma:** `removeImage(id: string, userId: string): Promise<TransactionBankResponseDto>` — [transaction-banks.controller.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-banks.controller.ts#L123) (L123–131)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id/image')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.removeTransactionBankImageUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-transaction-banks-presentation-dtos-create-transaction-bank-request-dto-ts"></a>

### create-transaction-bank.request.dto.ts

- **Ruta:** [create-transaction-bank.request.dto.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/dtos/create-transaction-bank.request.dto.ts) (`comercial-jhoel-api/src/modules/transaction-banks/presentation/dtos/create-transaction-bank.request.dto.ts`, 10 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** DTO de entrada: declara `CreateTransactionBankRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts)

#### Clase `CreateTransactionBankRequestDto` (L3–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-transaction-banks-presentation-dtos-list-transaction-banks-query-dto-ts"></a>

### list-transaction-banks.query.dto.ts

- **Ruta:** [list-transaction-banks.query.dto.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/dtos/list-transaction-banks.query.dto.ts) (`comercial-jhoel-api/src/modules/transaction-banks/presentation/dtos/list-transaction-banks.query.dto.ts`, 10 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** DTO de consulta: declara `ListTransactionBanksQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts)

#### Clase `ListTransactionBanksQueryDto` (L4–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-transaction-banks-presentation-dtos-transaction-bank-response-dto-ts"></a>

### transaction-bank.response.dto.ts

- **Ruta:** [transaction-bank.response.dto.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/dtos/transaction-bank.response.dto.ts) (`comercial-jhoel-api/src/modules/transaction-banks/presentation/dtos/transaction-bank.response.dto.ts`, 15 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** DTO de respuesta: declara `TransactionBankResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts)

#### Clase `TransactionBankResponseDto` (L1–14)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-transaction-banks-presentation-dtos-update-transaction-bank-request-dto-ts"></a>

### update-transaction-bank.request.dto.ts

- **Ruta:** [update-transaction-bank.request.dto.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/dtos/update-transaction-bank.request.dto.ts) (`comercial-jhoel-api/src/modules/transaction-banks/presentation/dtos/update-transaction-bank.request.dto.ts`, 33 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** DTO de entrada: declara `UpdateTransactionBankRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts)

#### Clase `UpdateTransactionBankRequestDto` (L13–32)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-transaction-banks-transaction-banks-module-ts"></a>

### transaction-banks.module.ts

- **Ruta:** [transaction-banks.module.ts](../../../../comercial-jhoel-api/src/modules/transaction-banks/transaction-banks.module.ts) (`comercial-jhoel-api/src/modules/transaction-banks/transaction-banks.module.ts`, 39 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `transaction-banks`
- **Responsabilidad:** Módulo: declara `TransactionBanksModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-bank.orm-entity.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-transaction-bank-orm-entity-ts), [typeorm-transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-infrastructure-persistence-typeorm-transaction-bank-repository-ts), [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [create-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-create-transaction-bank-use-case-ts), [list-transaction-banks.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-list-transaction-banks-use-case-ts), [get-transaction-bank-by-id.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-by-id-use-case-ts), [update-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-update-transaction-bank-use-case-ts), [deactivate-transaction-bank.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-deactivate-transaction-bank-use-case-ts), [set-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-set-transaction-bank-image-use-case-ts), [remove-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-remove-transaction-bank-image-use-case-ts), [get-transaction-bank-image.use-case.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-application-use-cases-get-transaction-bank-image-use-case-ts), [transaction-banks.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-banks-controller-ts), [transaction-bank-images.controller.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-presentation-controllers-transaction-bank-images-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `TransactionBanksModule` (L17–38)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([TransactionBankOrmEntity])], controllers: [TransactionBanksController, TransactionBankImagesController], providers:`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
