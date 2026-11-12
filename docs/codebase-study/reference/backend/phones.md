# Módulo backend `phones`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/phone-sales` | [phone-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phone-sales.controller.ts#L53) `PhoneSalesController.registerSale` | [RegisterPhoneSaleUseCase](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-ts) | `PhoneSaleRepository`.create → `register_phone_sale`<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) | `PhonesService.registerSale` |
| `GET /api/phone-sales` | [phone-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phone-sales.controller.ts#L78) `PhoneSalesController.findAll` | [ListPhoneSalesUseCase](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phone-sales-use-case-ts) | `PhoneSaleRepository`.findAll | UseGuards(JwtAuthGuard) | `PhonesService.getSales` |
| `GET /api/phone-sales/:id` | [phone-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phone-sales.controller.ts#L83) `PhoneSalesController.findOne` | [GetPhoneSaleByIdUseCase](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-by-id-use-case-ts) | `PhoneSaleRepository`.findById | UseGuards(JwtAuthGuard) | `PhonesService.getSaleById` |
| `GET /api/phone-sales/:id/dpi-image` | [phone-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phone-sales.controller.ts#L96) `PhoneSalesController.getDpiImage` | [GetPhoneSaleDpiImageUseCase](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-ts) | `PhoneSaleRepository`.findById/getDpiImage [phone_sales, phone_sale_dpi_images] | UseGuards(JwtAuthGuard) | `PhonesService.getSaleDpiImage` |
| `POST /api/phone-sales/:id/void` | [phone-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phone-sales.controller.ts#L110) `PhoneSalesController.voidSale` | [VoidPhoneSaleUseCase](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-ts) | `PhoneSaleRepository`.voidSale → `void_phone_sale` | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `PhonesService.voidSale` |
| `POST /api/phones` | [phones.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phones.controller.ts#L34) `PhonesController.create` | [CreatePhoneUseCase](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-ts) | `PhoneRepository`.findByImei/findBySimNumber/create | UseGuards(JwtAuthGuard) | `PhonesService.createPhone` |
| `GET /api/phones` | [phones.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phones.controller.ts#L52) `PhonesController.findAll` | [ListPhonesUseCase](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phones-use-case-ts) | `PhoneRepository`.findAll | UseGuards(JwtAuthGuard) | `PhonesService.getPhones` |
| `GET /api/phones/:id` | [phones.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phones.controller.ts#L57) `PhonesController.findOne` | [GetPhoneByIdUseCase](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-ts) | `PhoneRepository`.findById | UseGuards(JwtAuthGuard) | `PhonesService.getPhoneById` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [phone-output.ts](#f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Plain, serializable shape use cases return — never the domain entity itself. | 1 internas | 3 | Media (3 consumidores) |
| [phone-sale-output.ts](#f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-sale-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Plain, serializable shape use cases return — never the domain entity itself. | 2 internas | 4 | Media (4 consumidores) |
| [create-phone.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makePhone` (sin comentario de documentación en el código). | 5 internas | 0 | Soporte (pruebas) |
| [create-phone.use-case.ts](#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-ts) | .ts | Caso de uso | Aplicación | Compra/ingreso — creates one new phone unit, `status = 'DISPONIBLE'`, with no phone number yet (it has no active line until it's sold — see `phone.entity.ts`'s own doc comment). | 5 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-phone-by-id.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria (sin comentario de documentación en el código). | 4 internas | 0 | Soporte (pruebas) |
| [get-phone-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetPhoneByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-phone-sale-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetPhoneSaleByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-phone-sale-dpi-image.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makeSale` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 0 | Soporte (pruebas) |
| [get-phone-sale-dpi-image.use-case.ts](#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-ts) | .ts | Caso de uso | Aplicación | The ONE place a phone sale's DPI photo bytes are ever read — always behind `JwtAuthGuard` (see `PhoneSalesController`), never a public/static URL. | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [list-phone-sales.use-case.ts](#f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phone-sales-use-case-ts) | .ts | Caso de uso | Aplicación | Historial de ventas — full list (never hides a voided sale, only excludes it from client-computed aggregates, same convention as every other void-capable listing in this codebase). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-phones.use-case.ts](#f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phones-use-case-ts) | .ts | Caso de uso | Aplicación | Returns the full inventory — filtering (operadora/estado/fecha/búsqueda) is client-side, same pattern as Categorías/Negocios/Proveedores, per the plan's own scope decision (no volume yet that justifies server-side filtering). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-phone-sale.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makeSale`, `makeClient` (sin comentario de documentación en el código). | 7 internas | 0 | Soporte (pruebas) |
| [register-phone-sale.use-case.ts](#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-ts) | .ts | Caso de uso | Aplicación | Venta — registers the sale (activation) of one `DISPONIBLE` phone. | 5 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [void-phone-sale.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makeVoidedSale` (sin comentario de documentación en el código). | 4 internas | 0 | Soporte (pruebas) |
| [void-phone-sale.use-case.ts](#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-ts) | .ts | Caso de uso | Aplicación | Anular — never a physical delete/edit. | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [assert-valid-dpi-image.ts](#f-comercial-jhoel-api-src-modules-phones-application-utils-assert-valid-dpi-image-ts) | .ts | Utilidad | Aplicación | Validated before the sale is ever attempted — a doomed upload should never reach the database. | 1 internas | 1 | Baja (1 consumidores) |
| [phone-sale.entity.ts](#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-sale-entity-ts) | .ts | Entidad de dominio | Dominio | One sale of one physical phone — mirrors `RechargeSimSaleRegistration`'s shape (identity capture at the moment of sale, void-only correction). | 1 internas | 7 | Media (7 consumidores) |
| [phone.entity.ts](#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts) | .ts | Entidad de dominio | Dominio | One individually-identified physical phone unit — never a generic `products` row with a numeric stock (an explicit requirement for this module). | 0 internas | 14 | Alta (14 consumidores) |
| [client-dpi-required.error.ts](#f-comercial-jhoel-api-src-modules-phones-domain-errors-client-dpi-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `ClientDpiRequiredError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [imei-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-phones-domain-errors-imei-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `ImeiAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [invalid-dpi-image.error.ts](#f-comercial-jhoel-api-src-modules-phones-domain-errors-invalid-dpi-image-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidDpiImageError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [invalid-phone-sale-client.error.ts](#f-comercial-jhoel-api-src-modules-phones-domain-errors-invalid-phone-sale-client-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidPhoneSaleClientError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [phone-already-sold.error.ts](#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-already-sold-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PhoneAlreadySoldError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [phone-not-found.error.ts](#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PhoneNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [phone-number-already-assigned.error.ts](#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-number-already-assigned-error-ts) | .ts | Errores de dominio | Dominio | Raised by `register_phone_sale` when the número asignado is already claimed by another currently-`VENDIDO` phone (`UQ_phones_phone_number_active`). | 1 internas | 1 | Baja (1 consumidores) |
| [phone-number-required.error.ts](#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-number-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PhoneNumberRequiredError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [phone-sale-already-voided.error.ts](#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-sale-already-voided-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PhoneSaleAlreadyVoidedError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [phone-sale-not-found.error.ts](#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-sale-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PhoneSaleNotFoundError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [phone-sale-void-reason-required.error.ts](#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-sale-void-reason-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PhoneSaleVoidReasonRequiredError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [sim-number-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-phones-domain-errors-sim-number-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SimNumberAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [phone-sale.repository.ts](#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-sale-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `RegisterPhoneSaleDpiImage`, `RegisterPhoneSaleData`, `DpiImage`, `PhoneSaleRepository`, `PHONE_SALE_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 10 | Alta (10 consumidores) |
| [phone.repository.ts](#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreatePhoneData`, `PhoneRepository`, `PHONE_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 7 | Media (7 consumidores) |
| [phone-sale.mapper.ts](#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-sale-mapper-ts) | .ts | Mapper | Infraestructura | Shape of one row from the hand-written JOIN query in `TypeOrmPhoneSaleRepository` — no TypeORM entity exists for `phone_sales` (it's written exclusively through `register_phone_sale`/`void_phone_sale`), same "raw SQL, no ORM entity" precedent already established for `recharge_sim_sale_registrations`. | 2 internas | 1 | Baja (1 consumidores) |
| [phone.mapper.ts](#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `PhoneMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [phone.orm-entity.ts](#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `PhoneOrmEntity` (sin comentario de documentación en el código). | 3 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [typeorm-phone-sale.repository.ts](#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmPhoneSaleRepository`, `SELECT_COLUMNS`, `FROM_JOINS` (sin comentario de documentación en el código). | 12 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-phone.repository.ts](#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmPhoneRepository` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [phones.module.ts](#f-comercial-jhoel-api-src-modules-phones-phones-module-ts) | .ts | Módulo | Arranque / configuración | No import of `RechargesModule` — the phones module is fully independent, only borrowing the SIM sale flow's *pattern* (see the migration's own doc comment), never its code or tables. | 16 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |
| [phone-sales.controller.ts](#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts) | .ts | Controlador | Presentación | Venta de teléfonos — registering a sale is operational (no `@Roles(...)`, same policy as Ventas/Compras/Recargas/SIM); anular is admin-only, same elevated policy as every other void action in this codebase. | 12 internas; ext.: @nestjs/common, @nestjs/platform-express, express | 1 | Media (controlador) |
| [phones.controller.ts](#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phones-controller-ts) | .ts | Controlador | Presentación | Inventario/Compra de teléfonos — no `@Roles(...)`, same "any authenticated active account" operational policy as Ventas/Compras/Recargas (registering a phone purchase is a daily register task, not admin-only). | 7 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [create-phone.request.dto.ts](#f-comercial-jhoel-api-src-modules-phones-presentation-dtos-create-phone-request-dto-ts) | .ts | DTO de entrada | Presentación | No `phoneNumber` here — a bought phone has no active line yet, see `phone.entity.ts`'s own doc comment. | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [phone-sale.response.dto.ts](#f-comercial-jhoel-api-src-modules-phones-presentation-dtos-phone-sale-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `PhoneSaleResponseDto` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [phone.response.dto.ts](#f-comercial-jhoel-api-src-modules-phones-presentation-dtos-phone-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `PhoneResponseDto` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [register-phone-sale.request.dto.ts](#f-comercial-jhoel-api-src-modules-phones-presentation-dtos-register-phone-sale-request-dto-ts) | .ts | DTO de entrada | Presentación | `multipart/form-data` body — the DPI photo travels alongside as the `dpiImage` file field (read via `@UploadedFile()`, see `PhoneSalesController.registerSale`), optional (see the plan's own "foto opcional, igual que SIM" decision). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [void-phone-sale.request.dto.ts](#f-comercial-jhoel-api-src-modules-phones-presentation-dtos-void-phone-sale-request-dto-ts) | .ts | DTO de entrada | Presentación | Same mandatory-reason shape as `VoidRechargeSimSaleRegistrationRequestDto`/`VoidPurchaseRequestDto` — kept as this module's own copy rather than a cross-module import. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-output-ts"></a>

### phone-output.ts

- **Ruta:** [phone-output.ts](../../../../comercial-jhoel-api/src/modules/phones/application/dtos/phone-output.ts) (`comercial-jhoel-api/src/modules/phones/application/dtos/phone-output.ts`, 47 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Plain, serializable shape use cases return — never the domain entity itself.
- **Depende de (archivos del proyecto):** [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts)
- **Consumidores:** [create-phone.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-ts), [get-phone-by-id.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-ts), [list-phones.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phones-use-case-ts)

**Interfaces, tipos y enums:**

- `interface PhoneOutput` (L8): Plain, serializable shape use cases return — never the domain entity itself. — miembros: `id`, `operator`, `model`, `phoneNumber`, `imei`, `simNumber`, `costPrice`, `publicPrice`, `status`, `purchaseDate`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
#### Función `toPhoneOutput` (L27–46)

- **Tipo:** función exportada
- **Firma:** `toPhoneOutput(phone: Phone): PhoneOutput` — [phone-output.ts](../../../../comercial-jhoel-api/src/modules/phones/application/dtos/phone-output.ts#L27)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-phone.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-ts), [get-phone-by-id.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-sale-output-ts"></a>

### phone-sale-output.ts

- **Ruta:** [phone-sale-output.ts](../../../../comercial-jhoel-api/src/modules/phones/application/dtos/phone-sale-output.ts) (`comercial-jhoel-api/src/modules/phones/application/dtos/phone-sale-output.ts`, 58 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Plain, serializable shape use cases return — never the domain entity itself.
- **Depende de (archivos del proyecto):** [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts), [phone-sale.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-sale-entity-ts)
- **Consumidores:** [get-phone-sale-by-id.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-by-id-use-case-ts), [list-phone-sales.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phone-sales-use-case-ts), [register-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-ts), [void-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-ts)

**Interfaces, tipos y enums:**

- `interface PhoneSaleOutput` (L5): Plain, serializable shape use cases return — never the domain entity itself. — miembros: `id`, `phoneId`, `phoneOperator`, `phoneModel`, `phoneNumber`, `phoneImei`, `phoneSimNumber`, `phoneCostPrice`, `clientId`, `clientName`, `clientDpi`, `salePrice`, `profit`, `saleDate`, `hasDpiImage`, `isVoided`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `createdBy`, `createdByUsername`, `createdAt`
#### Función `toPhoneSaleOutput` (L31–57)

- **Tipo:** función exportada
- **Firma:** `toPhoneSaleOutput(sale: PhoneSale): PhoneSaleOutput` — [phone-sale-output.ts](../../../../comercial-jhoel-api/src/modules/phones/application/dtos/phone-sale-output.ts#L31)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-phone-sale-by-id.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-by-id-use-case-ts), [register-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-ts), [void-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-spec-ts"></a>

### create-phone.use-case.spec.ts

- **Ruta:** [create-phone.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/create-phone.use-case.spec.ts) (`comercial-jhoel-api/src/modules/phones/application/use-cases/create-phone.use-case.spec.ts`, 113 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Prueba unitaria: declara `makePhone` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [create-phone.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-ts), [phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-repository-ts), [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts), [imei-already-exists.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-imei-already-exists-error-ts), [sim-number-already-exists.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-sim-number-already-exists-error-ts)
- **Consumidores:** —
#### Función `makePhone` (L7–29)

- **Tipo:** función local del archivo
- **Firma:** `makePhone(overrides?: Partial<Parameters<typeof Phone.create>[0]>): Phone` — [create-phone.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/create-phone.use-case.spec.ts#L7)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Phone.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-ts"></a>

### create-phone.use-case.ts

- **Ruta:** [create-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/create-phone.use-case.ts) (`comercial-jhoel-api/src/modules/phones/application/use-cases/create-phone.use-case.ts`, 67 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Compra/ingreso — creates one new phone unit, `status = 'DISPONIBLE'`, with no phone number yet (it has no active line until it's sold — see `phone.entity.ts`'s own doc comment).
- **Depende de (archivos del proyecto):** [phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-repository-ts), [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts), [imei-already-exists.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-imei-already-exists-error-ts), [sim-number-already-exists.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-sim-number-already-exists-error-ts), [phone-output.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [create-phone.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-spec-ts), [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts), [phones.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phones-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreatePhoneInput` (L9): sin documentación — miembros: `operator`, `model`, `imei`, `simNumber`, `costPrice`, `publicPrice`, `purchaseDate`, `userId`

#### Clase `CreatePhoneUseCase` (L31–66)

- **Decoradores:** `@Injectable()`
- **Propósito:** Compra/ingreso — creates one new phone unit, `status = 'DISPONIBLE'`, with no phone number yet (it has no active line until it's sold — see `phone.entity.ts`'s own doc comment). Plain insert (no stored function needed — a single-row insert with two UNIQUE constraints has no atomicity concern beyond what Postgres already gives it for free), same shape as `CreateSupplierUseCase`. The pre-checks here give a clean, specific error; `TypeOrmPhoneRepository`'s own `translateUniqueViolation` is the race-condition safety net, same split every other create-with-uniqueness use case in this codebase already uses.
- **Dependencias inyectadas (constructor):** `@Inject(PHONE_REPOSITORY) phoneRepository: PhoneRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 38–65 | `input: CreatePhoneInput` | `Promise<PhoneOutput>` |

##### `CreatePhoneUseCase.execute`

- **Firma:** `execute(input: CreatePhoneInput): Promise<PhoneOutput>` — [create-phone.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/create-phone.use-case.ts#L38) (L38–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.imei.trim`, `input.simNumber.trim`, `input.model.trim`, `this.phoneRepository.findByImei`, `new ImeiAlreadyExistsError`, `this.phoneRepository.findBySimNumber`, `new SimNumberAlreadyExistsError`, `this.phoneRepository.create`, `toPhoneOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ImeiAlreadyExistsError(imei)`, `new SimNumberAlreadyExistsError(simNumber)`
- **Consumidores:** [phones.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-spec-ts"></a>

### get-phone-by-id.use-case.spec.ts

- **Ruta:** [get-phone-by-id.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-by-id.use-case.spec.ts) (`comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-by-id.use-case.spec.ts`, 56 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [get-phone-by-id.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-ts), [phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-repository-ts), [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts), [phone-not-found.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-not-found-error-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-ts"></a>

### get-phone-by-id.use-case.ts

- **Ruta:** [get-phone-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Caso de uso: declara `GetPhoneByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-repository-ts), [phone-not-found.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-not-found-error-ts), [phone-output.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [get-phone-by-id.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-spec-ts), [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts), [phones.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phones-controller-ts)

#### Clase `GetPhoneByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PHONE_REPOSITORY) phoneRepository: PhoneRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<PhoneOutput>` |

##### `GetPhoneByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<PhoneOutput>` — [get-phone-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.phoneRepository.findById`, `new PhoneNotFoundError`, `toPhoneOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new PhoneNotFoundError(id)`
- **Consumidores:** [phones.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-by-id-use-case-ts"></a>

### get-phone-sale-by-id.use-case.ts

- **Ruta:** [get-phone-sale-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-sale-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-sale-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Caso de uso: declara `GetPhoneSaleByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-sale-repository-ts), [phone-sale-not-found.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-sale-not-found-error-ts), [phone-sale-output.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts), [phone-sales.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts)

#### Clase `GetPhoneSaleByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PHONE_SALE_REPOSITORY) phoneSaleRepository: PhoneSaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<PhoneSaleOutput>` |

##### `GetPhoneSaleByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<PhoneSaleOutput>` — [get-phone-sale-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-sale-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.phoneSaleRepository.findById`, `new PhoneSaleNotFoundError`, `toPhoneSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new PhoneSaleNotFoundError(id)`
- **Consumidores:** [phone-sales.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-spec-ts"></a>

### get-phone-sale-dpi-image.use-case.spec.ts

- **Ruta:** [get-phone-sale-dpi-image.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-sale-dpi-image.use-case.spec.ts) (`comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-sale-dpi-image.use-case.spec.ts`, 75 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Prueba unitaria: declara `makeSale` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [get-phone-sale-dpi-image.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-ts), [phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-sale-repository-ts), [phone-sale.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-sale-entity-ts), [phone-sale-not-found.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-sale-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** —
#### Función `makeSale` (L7–32)

- **Tipo:** función local del archivo
- **Firma:** `makeSale(hasDpiImage: boolean): PhoneSale` — [get-phone-sale-dpi-image.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-sale-dpi-image.use-case.spec.ts#L7)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `PhoneSale.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-ts"></a>

### get-phone-sale-dpi-image.use-case.ts

- **Ruta:** [get-phone-sale-dpi-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-sale-dpi-image.use-case.ts) (`comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-sale-dpi-image.use-case.ts`, 39 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** The ONE place a phone sale's DPI photo bytes are ever read — always behind `JwtAuthGuard` (see `PhoneSalesController`), never a public/static URL.
- **Depende de (archivos del proyecto):** [phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-sale-repository-ts), [phone-sale-not-found.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-sale-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [get-phone-sale-dpi-image.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-spec-ts), [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts), [phone-sales.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts)

**Interfaces, tipos y enums:**

- `interface PhoneSaleDpiImage` (L6): sin documentación — miembros: `data`, `mimeType`

#### Clase `GetPhoneSaleDpiImageUseCase` (L18–38)

- **Decoradores:** `@Injectable()`
- **Propósito:** The ONE place a phone sale's DPI photo bytes are ever read — always behind `JwtAuthGuard` (see `PhoneSalesController`), never a public/static URL. `NotFoundException` (not a generic 500) when the sale has no image — expected here since the photo is optional, same as SIM's own equivalent use case.
- **Dependencias inyectadas (constructor):** `@Inject(PHONE_SALE_REPOSITORY) phoneSaleRepository: PhoneSaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–37 | `saleId: string` | `Promise<PhoneSaleDpiImage>` |

##### `GetPhoneSaleDpiImageUseCase.execute`

- **Firma:** `execute(saleId: string): Promise<PhoneSaleDpiImage>` — [get-phone-sale-dpi-image.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-sale-dpi-image.use-case.ts#L25) (L25–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.phoneSaleRepository.findById`, `new PhoneSaleNotFoundError`, `this.phoneSaleRepository.getDpiImage`, `new NotFoundException`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new PhoneSaleNotFoundError(saleId)`, `new NotFoundException( 'Esta venta no tiene una imagen de DPI adjunta.', )`
- **Consumidores:** [phone-sales.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phone-sales-use-case-ts"></a>

### list-phone-sales.use-case.ts

- **Ruta:** [list-phone-sales.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/list-phone-sales.use-case.ts) (`comercial-jhoel-api/src/modules/phones/application/use-cases/list-phone-sales.use-case.ts`, 19 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Historial de ventas — full list (never hides a voided sale, only excludes it from client-computed aggregates, same convention as every other void-capable listing in this codebase).
- **Depende de (archivos del proyecto):** [phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-sale-repository-ts), [phone-sale-output.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts), [phone-sales.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts)

#### Clase `ListPhoneSalesUseCase` (L7–18)

- **Decoradores:** `@Injectable()`
- **Propósito:** Historial de ventas — full list (never hides a voided sale, only excludes it from client-computed aggregates, same convention as every other void-capable listing in this codebase).
- **Dependencias inyectadas (constructor):** `@Inject(PHONE_SALE_REPOSITORY) phoneSaleRepository: PhoneSaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–17 | — | `Promise<PhoneSaleOutput[]>` |

##### `ListPhoneSalesUseCase.execute`

- **Firma:** `execute(): Promise<PhoneSaleOutput[]>` — [list-phone-sales.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/list-phone-sales.use-case.ts#L14) (L14–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.phoneSaleRepository.findAll`, `sales.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [phone-sales.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phones-use-case-ts"></a>

### list-phones.use-case.ts

- **Ruta:** [list-phones.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/list-phones.use-case.ts) (`comercial-jhoel-api/src/modules/phones/application/use-cases/list-phones.use-case.ts`, 19 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Returns the full inventory — filtering (operadora/estado/fecha/búsqueda) is client-side, same pattern as Categorías/Negocios/Proveedores, per the plan's own scope decision (no volume yet that justifies server-side filtering).
- **Depende de (archivos del proyecto):** [phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-repository-ts), [phone-output.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts), [phones.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phones-controller-ts)

#### Clase `ListPhonesUseCase` (L7–18)

- **Decoradores:** `@Injectable()`
- **Propósito:** Returns the full inventory — filtering (operadora/estado/fecha/búsqueda) is client-side, same pattern as Categorías/Negocios/Proveedores, per the plan's own scope decision (no volume yet that justifies server-side filtering).
- **Dependencias inyectadas (constructor):** `@Inject(PHONE_REPOSITORY) phoneRepository: PhoneRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–17 | — | `Promise<PhoneOutput[]>` |

##### `ListPhonesUseCase.execute`

- **Firma:** `execute(): Promise<PhoneOutput[]>` — [list-phones.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/list-phones.use-case.ts#L14) (L14–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.phoneRepository.findAll`, `phones.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [phones.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phones-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-spec-ts"></a>

### register-phone-sale.use-case.spec.ts

- **Ruta:** [register-phone-sale.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/register-phone-sale.use-case.spec.ts) (`comercial-jhoel-api/src/modules/phones/application/use-cases/register-phone-sale.use-case.spec.ts`, 178 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Prueba unitaria: declara `makeSale`, `makeClient` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [register-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-ts), [phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-sale-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [phone-sale.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-sale-entity-ts), [client.entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-entities-client-entity-ts), [invalid-phone-sale-client.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-invalid-phone-sale-client-error-ts), [invalid-dpi-image.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-invalid-dpi-image-error-ts)
- **Consumidores:** —
#### Función `makeSale` (L9–37)

- **Tipo:** función local del archivo
- **Firma:** `makeSale(overrides?: Partial<Parameters<typeof PhoneSale.create>[0]>): PhoneSale` — [register-phone-sale.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/register-phone-sale.use-case.spec.ts#L9)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `PhoneSale.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `makeClient` (L39–51)

- **Tipo:** función local del archivo
- **Firma:** `makeClient(isActive: boolean): Client` — [register-phone-sale.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/register-phone-sale.use-case.spec.ts#L39)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Client.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-ts"></a>

### register-phone-sale.use-case.ts

- **Ruta:** [register-phone-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/register-phone-sale.use-case.ts) (`comercial-jhoel-api/src/modules/phones/application/use-cases/register-phone-sale.use-case.ts`, 75 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Venta — registers the sale (activation) of one `DISPONIBLE` phone.
- **Depende de (archivos del proyecto):** [phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-sale-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [invalid-phone-sale-client.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-invalid-phone-sale-client-error-ts), [assert-valid-dpi-image.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-utils-assert-valid-dpi-image-ts), [phone-sale-output.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [register-phone-sale.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-spec-ts), [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts), [phone-sales.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts)

**Interfaces, tipos y enums:**

- `interface RegisterPhoneSaleInput` (L13): sin documentación — miembros: `phoneId`, `clientId`, `clientDpi`, `phoneNumber`, `saleDate`, `userId`, `dpiImage`

#### Clase `RegisterPhoneSaleUseCase` (L36–74)

- **Decoradores:** `@Injectable()`
- **Propósito:** Venta — registers the sale (activation) of one `DISPONIBLE` phone. The client is validated here via `ClientsModule`'s own exported `CLIENT_REPOSITORY` (the clean route that module's own doc comment invites), rather than SIM's raw-SQL-across-module-boundary check — `register_phone_sale` still re-validates it server-side too (defense in depth, never trusts this TypeScript check alone). The phone-availability check, the sale price (always `phones.public_price`, never client- supplied), and the actual state transition all happen atomically inside `register_phone_sale` (see the migration's own doc comment) — nothing here duplicates that.
- **Dependencias inyectadas (constructor):** `@Inject(PHONE_SALE_REPOSITORY) phoneSaleRepository: PhoneSaleRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 45–73 | `input: RegisterPhoneSaleInput` | `Promise<PhoneSaleOutput>` |

##### `RegisterPhoneSaleUseCase.execute`

- **Firma:** `execute(input: RegisterPhoneSaleInput): Promise<PhoneSaleOutput>` — [register-phone-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/register-phone-sale.use-case.ts#L45) (L45–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidDpiImage`, `this.clientRepository.findById`, `new InvalidPhoneSaleClientError`, `this.phoneSaleRepository.create`, `toPhoneSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidPhoneSaleClientError()`
- **Consumidores:** [phone-sales.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-spec-ts"></a>

### void-phone-sale.use-case.spec.ts

- **Ruta:** [void-phone-sale.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/void-phone-sale.use-case.spec.ts) (`comercial-jhoel-api/src/modules/phones/application/use-cases/void-phone-sale.use-case.spec.ts`, 76 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Prueba unitaria: declara `makeVoidedSale` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [void-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-ts), [phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-sale-repository-ts), [phone-sale.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-sale-entity-ts), [phone-sale-already-voided.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-sale-already-voided-error-ts)
- **Consumidores:** —
#### Función `makeVoidedSale` (L6–31)

- **Tipo:** función local del archivo
- **Firma:** `makeVoidedSale(): PhoneSale` — [void-phone-sale.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/void-phone-sale.use-case.spec.ts#L6)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `PhoneSale.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-ts"></a>

### void-phone-sale.use-case.ts

- **Ruta:** [void-phone-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/void-phone-sale.use-case.ts) (`comercial-jhoel-api/src/modules/phones/application/use-cases/void-phone-sale.use-case.ts`, 29 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Anular — never a physical delete/edit.
- **Depende de (archivos del proyecto):** [phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-sale-repository-ts), [phone-sale-output.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-sale-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [void-phone-sale.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-spec-ts), [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts), [phone-sales.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts)

**Interfaces, tipos y enums:**

- `interface VoidPhoneSaleInput` (L6): sin documentación — miembros: `id`, `voidedBy`, `reason`

#### Clase `VoidPhoneSaleUseCase` (L13–28)

- **Decoradores:** `@Injectable()`
- **Propósito:** Anular — never a physical delete/edit. `void_phone_sale` restores the phone to `DISPONIBLE` atomically (see the migration's own doc comment). Admin-only, enforced at the controller (`@Roles`), same policy as every other void action in this codebase.
- **Dependencias inyectadas (constructor):** `@Inject(PHONE_SALE_REPOSITORY) phoneSaleRepository: PhoneSaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–27 | `input: VoidPhoneSaleInput` | `Promise<PhoneSaleOutput>` |

##### `VoidPhoneSaleUseCase.execute`

- **Firma:** `execute(input: VoidPhoneSaleInput): Promise<PhoneSaleOutput>` — [void-phone-sale.use-case.ts](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/void-phone-sale.use-case.ts#L20) (L20–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.phoneSaleRepository.voidSale`, `toPhoneSaleOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [phone-sales.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-phones-application-utils-assert-valid-dpi-image-ts"></a>

### assert-valid-dpi-image.ts

- **Ruta:** [assert-valid-dpi-image.ts](../../../../comercial-jhoel-api/src/modules/phones/application/utils/assert-valid-dpi-image.ts) (`comercial-jhoel-api/src/modules/phones/application/utils/assert-valid-dpi-image.ts`, 30 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Validated before the sale is ever attempted — a doomed upload should never reach the database.
- **Depende de (archivos del proyecto):** [invalid-dpi-image.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-invalid-dpi-image-error-ts)
- **Consumidores:** [register-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-ts)

**Interfaces, tipos y enums:**

- `interface UploadedDpiImage` (L8): sin documentación — miembros: `buffer`, `mimetype`, `size`

**Constantes exportadas:**

- `MAX_DPI_IMAGE_SIZE_BYTES` (L4): Same ceiling as `recharges`' own `MAX_DPI_IMAGE_SIZE_BYTES` (itself mirroring `ProductsController`'s import-file limit) — no reason for a phone-sale DPI photo to need a different one. = `5 * 1024 * 1024`
#### Función `assertValidDpiImage` (L15–29)

- **Tipo:** función exportada
- **Firma:** `assertValidDpiImage(file: UploadedDpiImage): void` — [assert-valid-dpi-image.ts](../../../../comercial-jhoel-api/src/modules/phones/application/utils/assert-valid-dpi-image.ts#L15)
- **Propósito / descripción:** Validated before the sale is ever attempted — a doomed upload should never reach the database. Never trusts the frontend's own `accept="image/*"` hint alone.
- **Dependencias:** `ALLOWED_MIME_TYPES.has`, `new InvalidDpiImageError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidDpiImageError( 'La imagen del DPI debe ser JPG, PNG o WEBP.', )`, `new InvalidDpiImageError( 'La imagen del DPI no puede superar los 5 MB.', )`, `new InvalidDpiImageError('La imagen del DPI está vacía.')`
- **Consumidores:** [register-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-sale-entity-ts"></a>

### phone-sale.entity.ts

- **Ruta:** [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts) (`comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts`, 138 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** One sale of one physical phone — mirrors `RechargeSimSaleRegistration`'s shape (identity capture at the moment of sale, void-only correction).
- **Depende de (archivos del proyecto):** [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts)
- **Consumidores:** [phone-sale-output.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-sale-output-ts), [get-phone-sale-dpi-image.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-spec-ts), [register-phone-sale.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-spec-ts), [void-phone-sale.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-spec-ts), [phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-sale-repository-ts), [phone-sale.mapper.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-sale-mapper-ts), [typeorm-phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts)

**Interfaces, tipos y enums:**

- `interface PhoneSaleProps` (L3): sin documentación — miembros: `id`, `phoneId`, `phoneOperator`, `phoneModel`, `phoneNumber`, `phoneImei`, `phoneSimNumber`, `phoneCostPrice`, `clientId`, `clientName`, `clientDpi`, `salePrice`, `saleDate`, `hasDpiImage`, `isVoided`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `createdBy`, `createdByUsername`, `createdAt`

#### Clase `PhoneSale` (L43–137)

- **Propósito:** One sale of one physical phone — mirrors `RechargeSimSaleRegistration`'s shape (identity capture at the moment of sale, void-only correction). The phone's own operator/modelo/IMEI/SIM/ costo are denormalized onto this entity (via the repository's own JOIN, read from `phones` — they never change after purchase) since every consumer of a sale — the historial table, the detail view, the ganancia calculation — needs them alongside the sale itself. `phoneNumber` is the one exception: it's read from `phone_sales`' own column (frozen at the moment of sale), never from `phones` — voiding later clears the phone's own number, but this sale's history must keep showing what it assigned.
- **Dependencias inyectadas (constructor):** `props: PhoneSaleProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 46–48 | `props: PhoneSaleProps` | `PhoneSale` |
| `id` | getter public | 50–52 | — | `string` |
| `phoneId` | getter public | 54–56 | — | `string` |
| `phoneOperator` | getter public | 58–60 | — | `PhoneOperator` |
| `phoneModel` | getter public | 62–64 | — | `string` |
| `phoneNumber` | getter public | 66–68 | — | `string` |
| `phoneImei` | getter public | 70–72 | — | `string` |
| `phoneSimNumber` | getter public | 74–76 | — | `string` |
| `phoneCostPrice` | getter public | 78–80 | — | `number` |
| `clientId` | getter public | 82–84 | — | `string \| null` |
| `clientName` | getter public | 86–88 | — | `string \| null` |
| `clientDpi` | getter public | 90–92 | — | `string` |
| `salePrice` | getter public | 94–96 | — | `number` |
| `saleDate` | getter public | 98–100 | — | `string` |
| `hasDpiImage` | getter public | 102–104 | — | `boolean` |
| `isVoided` | getter public | 106–108 | — | `boolean` |
| `voidedAt` | getter public | 110–112 | — | `Date \| null` |
| `voidedBy` | getter public | 114–116 | — | `string \| null` |
| `voidedByUsername` | getter public | 118–120 | — | `string \| null` |
| `voidReason` | getter public | 122–124 | — | `string \| null` |
| `createdBy` | getter public | 126–128 | — | `string` |
| `createdByUsername` | getter public | 130–132 | — | `string` |
| `createdAt` | getter public | 134–136 | — | `Date` |

##### `PhoneSale.create`

- **Firma:** `create(props: PhoneSaleProps): PhoneSale` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new PhoneSale`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-phone-sale-dpi-image.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-spec-ts), [register-phone-sale.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-spec-ts), [void-phone-sale.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-spec-ts)

##### `PhoneSale.id`

- **Firma:** `id(): string` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.phoneId`

- **Firma:** `phoneId(): string` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.phoneOperator`

- **Firma:** `phoneOperator(): PhoneOperator` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.phoneModel`

- **Firma:** `phoneModel(): string` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L62) (L62–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.phoneNumber`

- **Firma:** `phoneNumber(): string` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L66) (L66–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.phoneImei`

- **Firma:** `phoneImei(): string` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L70) (L70–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.phoneSimNumber`

- **Firma:** `phoneSimNumber(): string` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L74) (L74–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.phoneCostPrice`

- **Firma:** `phoneCostPrice(): number` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L78) (L78–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.clientId`

- **Firma:** `clientId(): string \| null` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.clientName`

- **Firma:** `clientName(): string \| null` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L86) (L86–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.clientDpi`

- **Firma:** `clientDpi(): string` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L90) (L90–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.salePrice`

- **Firma:** `salePrice(): number` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L94) (L94–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.saleDate`

- **Firma:** `saleDate(): string` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L98) (L98–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.hasDpiImage`

- **Firma:** `hasDpiImage(): boolean` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L102) (L102–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.isVoided`

- **Firma:** `isVoided(): boolean` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L106) (L106–108)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.voidedAt`

- **Firma:** `voidedAt(): Date \| null` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L110) (L110–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.voidedBy`

- **Firma:** `voidedBy(): string \| null` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L114) (L114–116)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.voidedByUsername`

- **Firma:** `voidedByUsername(): string \| null` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L118) (L118–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.voidReason`

- **Firma:** `voidReason(): string \| null` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L122) (L122–124)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.createdBy`

- **Firma:** `createdBy(): string` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L126) (L126–128)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.createdByUsername`

- **Firma:** `createdByUsername(): string` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L130) (L130–132)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSale.createdAt`

- **Firma:** `createdAt(): Date` — [phone-sale.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone-sale.entity.ts#L134) (L134–136)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts"></a>

### phone.entity.ts

- **Ruta:** [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts) (`comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts`, 105 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** One individually-identified physical phone unit — never a generic `products` row with a numeric stock (an explicit requirement for this module).
- **Consumidores:** [phone-output.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-output-ts), [phone-sale-output.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-dtos-phone-sale-output-ts), [create-phone.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-spec-ts), [create-phone.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-ts), [get-phone-by-id.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-spec-ts), [phone-sale.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-sale-entity-ts), [phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-repository-ts), [phone-sale.mapper.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-sale-mapper-ts), [phone.mapper.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-mapper-ts), [phone.orm-entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-orm-entity-ts), [typeorm-phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-repository-ts), [create-phone.request.dto.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-dtos-create-phone-request-dto-ts), [phone-sale.response.dto.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-dtos-phone-sale-response-dto-ts), [phone.response.dto.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-dtos-phone-response-dto-ts)

**Interfaces, tipos y enums:**

- `interface PhoneProps` (L4): sin documentación — miembros: `id`, `operator`, `model`, `phoneNumber`, `imei`, `simNumber`, `costPrice`, `publicPrice`, `status`, `purchaseDate`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `type PhoneOperator` (L1) = `'CLARO' \| 'TIGO'`
- `type PhoneStatus` (L2) = `'DISPONIBLE' \| 'VENDIDO'`

#### Clase `Phone` (L34–104)

- **Propósito:** One individually-identified physical phone unit — never a generic `products` row with a numeric stock (an explicit requirement for this module). `status` starts `DISPONIBLE` and only ever changes via `register_phone_sale`/`void_phone_sale` (see the migration's own doc comment) — never set directly by application code. `phoneNumber` is `null` until sold — a bought phone has no active line yet, the number is assigned at the moment of sale (activation), not at purchase.
- **Dependencias inyectadas (constructor):** `props: PhoneProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 37–39 | `props: PhoneProps` | `Phone` |
| `id` | getter public | 41–43 | — | `string` |
| `operator` | getter public | 45–47 | — | `PhoneOperator` |
| `model` | getter public | 49–51 | — | `string` |
| `phoneNumber` | getter public | 53–55 | — | `string \| null` |
| `imei` | getter public | 57–59 | — | `string` |
| `simNumber` | getter public | 61–63 | — | `string` |
| `costPrice` | getter public | 65–67 | — | `number` |
| `publicPrice` | getter public | 69–71 | — | `number` |
| `status` | getter public | 73–75 | — | `PhoneStatus` |
| `purchaseDate` | getter public | 77–79 | — | `string` |
| `createdAt` | getter public | 81–83 | — | `Date` |
| `updatedAt` | getter public | 85–87 | — | `Date` |
| `createdBy` | getter public | 89–91 | — | `string` |
| `createdByUsername` | getter public | 93–95 | — | `string` |
| `updatedBy` | getter public | 97–99 | — | `string \| null` |
| `updatedByUsername` | getter public | 101–103 | — | `string \| null` |

##### `Phone.create`

- **Firma:** `create(props: PhoneProps): Phone` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Phone`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-phone.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-spec-ts), [create-phone.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-ts), [phone.mapper.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-mapper-ts), [typeorm-phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-repository-ts)

##### `Phone.id`

- **Firma:** `id(): string` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.operator`

- **Firma:** `operator(): PhoneOperator` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L45) (L45–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.model`

- **Firma:** `model(): string` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L49) (L49–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.phoneNumber`

- **Firma:** `phoneNumber(): string \| null` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.imei`

- **Firma:** `imei(): string` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.simNumber`

- **Firma:** `simNumber(): string` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L61) (L61–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.costPrice`

- **Firma:** `costPrice(): number` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L65) (L65–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.publicPrice`

- **Firma:** `publicPrice(): number` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.status`

- **Firma:** `status(): PhoneStatus` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.purchaseDate`

- **Firma:** `purchaseDate(): string` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.createdAt`

- **Firma:** `createdAt(): Date` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.updatedAt`

- **Firma:** `updatedAt(): Date` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.createdBy`

- **Firma:** `createdBy(): string` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L89) (L89–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.createdByUsername`

- **Firma:** `createdByUsername(): string` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L93) (L93–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L97) (L97–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Phone.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [phone.entity.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/entities/phone.entity.ts#L101) (L101–103)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-phones-domain-errors-client-dpi-required-error-ts"></a>

### client-dpi-required.error.ts

- **Ruta:** [client-dpi-required.error.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/errors/client-dpi-required.error.ts) (`comercial-jhoel-api/src/modules/phones/domain/errors/client-dpi-required.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Errores de dominio: declara `ClientDpiRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts)

#### Clase `ClientDpiRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-phones-domain-errors-imei-already-exists-error-ts"></a>

### imei-already-exists.error.ts

- **Ruta:** [imei-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/errors/imei-already-exists.error.ts) (`comercial-jhoel-api/src/modules/phones/domain/errors/imei-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Errores de dominio: declara `ImeiAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-phone.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-spec-ts), [create-phone.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-ts), [typeorm-phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-repository-ts)

#### Clase `ImeiAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `imei: string`
<a id="f-comercial-jhoel-api-src-modules-phones-domain-errors-invalid-dpi-image-error-ts"></a>

### invalid-dpi-image.error.ts

- **Ruta:** [invalid-dpi-image.error.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/errors/invalid-dpi-image.error.ts) (`comercial-jhoel-api/src/modules/phones/domain/errors/invalid-dpi-image.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Errores de dominio: declara `InvalidDpiImageError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [register-phone-sale.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-spec-ts), [assert-valid-dpi-image.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-utils-assert-valid-dpi-image-ts)

#### Clase `InvalidDpiImageError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `message: string`
<a id="f-comercial-jhoel-api-src-modules-phones-domain-errors-invalid-phone-sale-client-error-ts"></a>

### invalid-phone-sale-client.error.ts

- **Ruta:** [invalid-phone-sale-client.error.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/errors/invalid-phone-sale-client.error.ts) (`comercial-jhoel-api/src/modules/phones/domain/errors/invalid-phone-sale-client.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Errores de dominio: declara `InvalidPhoneSaleClientError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [register-phone-sale.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-spec-ts), [register-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-ts), [typeorm-phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts)

#### Clase `InvalidPhoneSaleClientError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-already-sold-error-ts"></a>

### phone-already-sold.error.ts

- **Ruta:** [phone-already-sold.error.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/errors/phone-already-sold.error.ts) (`comercial-jhoel-api/src/modules/phones/domain/errors/phone-already-sold.error.ts`, 12 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Errores de dominio: declara `PhoneAlreadySoldError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts)

#### Clase `PhoneAlreadySoldError` (L3–11)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-not-found-error-ts"></a>

### phone-not-found.error.ts

- **Ruta:** [phone-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/errors/phone-not-found.error.ts) (`comercial-jhoel-api/src/modules/phones/domain/errors/phone-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Errores de dominio: declara `PhoneNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-phone-by-id.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-spec-ts), [get-phone-by-id.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-ts), [typeorm-phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts)

#### Clase `PhoneNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-number-already-assigned-error-ts"></a>

### phone-number-already-assigned.error.ts

- **Ruta:** [phone-number-already-assigned.error.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/errors/phone-number-already-assigned.error.ts) (`comercial-jhoel-api/src/modules/phones/domain/errors/phone-number-already-assigned.error.ts`, 13 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Raised by `register_phone_sale` when the número asignado is already claimed by another currently-`VENDIDO` phone (`UQ_phones_phone_number_active`).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts)

#### Clase `PhoneNumberAlreadyAssignedError` (L4–12)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Raised by `register_phone_sale` when the número asignado is already claimed by another currently-`VENDIDO` phone (`UQ_phones_phone_number_active`).
- **Dependencias inyectadas (constructor):** `phoneId: string`
<a id="f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-number-required-error-ts"></a>

### phone-number-required.error.ts

- **Ruta:** [phone-number-required.error.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/errors/phone-number-required.error.ts) (`comercial-jhoel-api/src/modules/phones/domain/errors/phone-number-required.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Errores de dominio: declara `PhoneNumberRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts)

#### Clase `PhoneNumberRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-sale-already-voided-error-ts"></a>

### phone-sale-already-voided.error.ts

- **Ruta:** [phone-sale-already-voided.error.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/errors/phone-sale-already-voided.error.ts) (`comercial-jhoel-api/src/modules/phones/domain/errors/phone-sale-already-voided.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Errores de dominio: declara `PhoneSaleAlreadyVoidedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-phone-sale.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-spec-ts), [typeorm-phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts)

#### Clase `PhoneSaleAlreadyVoidedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-sale-not-found-error-ts"></a>

### phone-sale-not-found.error.ts

- **Ruta:** [phone-sale-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/errors/phone-sale-not-found.error.ts) (`comercial-jhoel-api/src/modules/phones/domain/errors/phone-sale-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Errores de dominio: declara `PhoneSaleNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-phone-sale-by-id.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-by-id-use-case-ts), [get-phone-sale-dpi-image.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-spec-ts), [get-phone-sale-dpi-image.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-ts), [typeorm-phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts)

#### Clase `PhoneSaleNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-sale-void-reason-required-error-ts"></a>

### phone-sale-void-reason-required.error.ts

- **Ruta:** [phone-sale-void-reason-required.error.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/errors/phone-sale-void-reason-required.error.ts) (`comercial-jhoel-api/src/modules/phones/domain/errors/phone-sale-void-reason-required.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Errores de dominio: declara `PhoneSaleVoidReasonRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts)

#### Clase `PhoneSaleVoidReasonRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-phones-domain-errors-sim-number-already-exists-error-ts"></a>

### sim-number-already-exists.error.ts

- **Ruta:** [sim-number-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/errors/sim-number-already-exists.error.ts) (`comercial-jhoel-api/src/modules/phones/domain/errors/sim-number-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Errores de dominio: declara `SimNumberAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-phone.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-spec-ts), [create-phone.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-ts), [typeorm-phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-repository-ts)

#### Clase `SimNumberAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `simNumber: string`
<a id="f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-sale-repository-ts"></a>

### phone-sale.repository.ts

- **Ruta:** [phone-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/repositories/phone-sale.repository.ts) (`comercial-jhoel-api/src/modules/phones/domain/repositories/phone-sale.repository.ts`, 37 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `RegisterPhoneSaleDpiImage`, `RegisterPhoneSaleData`, `DpiImage`, `PhoneSaleRepository`, `PHONE_SALE_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [phone-sale.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-sale-entity-ts)
- **Consumidores:** [get-phone-sale-by-id.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-by-id-use-case-ts), [get-phone-sale-dpi-image.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-spec-ts), [get-phone-sale-dpi-image.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-ts), [list-phone-sales.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phone-sales-use-case-ts), [register-phone-sale.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-spec-ts), [register-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-ts), [void-phone-sale.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-spec-ts), [void-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-ts), [typeorm-phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts), [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts)

**Interfaces, tipos y enums:**

- `interface RegisterPhoneSaleDpiImage` (L5): sin documentación — miembros: `data`, `mimeType`, `sizeBytes`
- `interface RegisterPhoneSaleData` (L11): sin documentación — miembros: `phoneId`, `clientId`, `clientDpi`, `phoneNumber`, `saleDate`, `dpiImage`, `createdBy`
- `interface DpiImage` (L22): sin documentación — miembros: `data`, `mimeType`
- `interface PhoneSaleRepository` (L27): sin documentación — miembros: `create`, `findById`, `findAll`, `voidSale`, `getDpiImage`

**Constantes exportadas:**

- `PHONE_SALE_REPOSITORY` (L3) = `Symbol('PHONE_SALE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-repository-ts"></a>

### phone.repository.ts

- **Ruta:** [phone.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/domain/repositories/phone.repository.ts) (`comercial-jhoel-api/src/modules/phones/domain/repositories/phone.repository.ts`, 25 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreatePhoneData`, `PhoneRepository`, `PHONE_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts)
- **Consumidores:** [create-phone.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-spec-ts), [create-phone.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-ts), [get-phone-by-id.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-spec-ts), [get-phone-by-id.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-ts), [list-phones.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phones-use-case-ts), [typeorm-phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-repository-ts), [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts)

**Interfaces, tipos y enums:**

- `interface CreatePhoneData` (L5): sin documentación — miembros: `operator`, `model`, `imei`, `simNumber`, `costPrice`, `publicPrice`, `purchaseDate`, `createdBy`
- `interface PhoneRepository` (L16): sin documentación — miembros: `findAll`, `findById`, `findByImei`, `findBySimNumber`, `create`

**Constantes exportadas:**

- `PHONE_REPOSITORY` (L3) = `Symbol('PHONE_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-sale-mapper-ts"></a>

### phone-sale.mapper.ts

- **Ruta:** [phone-sale.mapper.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/phone-sale.mapper.ts) (`comercial-jhoel-api/src/modules/phones/infrastructure/persistence/phone-sale.mapper.ts`, 58 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Shape of one row from the hand-written JOIN query in `TypeOrmPhoneSaleRepository` — no TypeORM entity exists for `phone_sales` (it's written exclusively through `register_phone_sale`/`void_phone_sale`), same "raw SQL, no ORM entity" precedent already established for `recharge_sim_sale_registrations`.
- **Depende de (archivos del proyecto):** [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts), [phone-sale.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-sale-entity-ts)
- **Consumidores:** [typeorm-phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts)

**Interfaces, tipos y enums:**

- `interface PhoneSaleRow` (L5): Shape of one row from the hand-written JOIN query in `TypeOrmPhoneSaleRepository` — no TypeORM entity exists for `phone_sales` (it's written exclusively through `register_phone_sale`/`void_phone_sale`), same "raw SQL, no ORM entity" precedent already established for `recharge_sim_sale_registrations`. — miembros: `id`, `phone_id`, `phone_operator`, `phone_model`, `phone_number`, `phone_imei`, `phone_sim_number`, `phone_cost_price`, `client_id`, `client_name`, `client_dpi`, `sale_price`, `sale_date`, `has_dpi_image`, `is_voided`, `voided_at`, `voided_by`, `voided_by_username`, `void_reason`, `created_by`, `created_by_username`, `created_at`

**Constantes exportadas:**

- `PhoneSaleMapper` (L30) = `{ toDomain(row: PhoneSaleRow): PhoneSale { return PhoneSale.create({ id: row.id, phoneId: row.phone_id, phoneO`
<a id="f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-mapper-ts"></a>

### phone.mapper.ts

- **Ruta:** [phone.mapper.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/phone.mapper.ts) (`comercial-jhoel-api/src/modules/phones/infrastructure/persistence/phone.mapper.ts`, 26 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Mapper: declara `PhoneMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts), [phone.orm-entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-orm-entity-ts)
- **Consumidores:** [typeorm-phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-repository-ts)

#### Clase `PhoneMapper` (L4–25)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–24 | `orm: PhoneOrmEntity` | `Phone` |

##### `PhoneMapper.toDomain`

- **Firma:** `toDomain(orm: PhoneOrmEntity): Phone` — [phone.mapper.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/phone.mapper.ts#L5) (L5–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Phone.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-orm-entity-ts"></a>

### phone.orm-entity.ts

- **Ruta:** [phone.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/phone.orm-entity.ts) (`comercial-jhoel-api/src/modules/phones/infrastructure/persistence/phone.orm-entity.ts`, 92 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `PhoneOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [phone.mapper.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-mapper-ts), [typeorm-phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-repository-ts), [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts)

#### Clase `PhoneOrmEntity` (L23–91)

- **Decoradores:** `@Entity('phones')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column operator: PhoneOperator`, `@Column model: string`, `@Column phoneNumber: string \| null`, `@Column imei: string`, `@Column simNumber: string`, `@Column costPrice: number`, `@Column publicPrice: number`, `@Column status: PhoneStatus`, `@Column purchaseDate: string`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts"></a>

### typeorm-phone-sale.repository.ts

- **Ruta:** [typeorm-phone-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone-sale.repository.ts) (`comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone-sale.repository.ts`, 161 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmPhoneSaleRepository`, `SELECT_COLUMNS`, `FROM_JOINS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [phone-sale.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-sale-entity-ts), [phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-sale-repository-ts), [phone-not-found.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-not-found-error-ts), [phone-already-sold.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-already-sold-error-ts), [client-dpi-required.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-client-dpi-required-error-ts), [phone-number-required.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-number-required-error-ts), [phone-number-already-assigned.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-number-already-assigned-error-ts), [invalid-phone-sale-client.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-invalid-phone-sale-client-error-ts), [phone-sale-not-found.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-sale-not-found-error-ts), [phone-sale-already-voided.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-sale-already-voided-error-ts), [phone-sale-void-reason-required.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-phone-sale-void-reason-required-error-ts), [phone-sale.mapper.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-sale-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts)

#### Clase `TypeOrmPhoneSaleRepository` (L39–160)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements PhoneSaleRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectDataSource() dataSource: DataSource`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public async | 43–64 | `data: RegisterPhoneSaleData` | `Promise<PhoneSale>` |
| `findById` | método public async | 66–72 | `id: string` | `Promise<PhoneSale \| null>` |
| `findAll` | método public async | 74–79 | — | `Promise<PhoneSale[]>` |
| `voidSale` | método public async | 81–95 | `id: string`, `voidedBy: string`, `reason: string` | `Promise<PhoneSale>` |
| `getDpiImage` | método public async | 97–111 | `saleId: string` | `Promise<DpiImage \| null>` |
| `fetchOrThrow` | método private async | 113–124 | `id: string` | `Promise<PhoneSale>` |
| `translateError` | método private | 127–159 | `error: unknown` | `unknown` |

##### `TypeOrmPhoneSaleRepository.create`

- **Firma:** `create(data: RegisterPhoneSaleData): Promise<PhoneSale>` — [typeorm-phone-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone-sale.repository.ts#L43) (L43–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.manager.query`, `this.translateError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `register_phone_sale`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPhoneSaleRepository.findById`

- **Firma:** `findById(id: string): Promise<PhoneSale \| null>` — [typeorm-phone-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone-sale.repository.ts#L66) (L66–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.manager.query`, `PhoneSaleMapper.toDomain`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPhoneSaleRepository.findAll`

- **Firma:** `findAll(): Promise<PhoneSale[]>` — [typeorm-phone-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone-sale.repository.ts#L74) (L74–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.manager.query`, `rows.map`, `PhoneSaleMapper.toDomain`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPhoneSaleRepository.voidSale`

- **Firma:** `voidSale(id: string, voidedBy: string, reason: string): Promise<PhoneSale>` — [typeorm-phone-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone-sale.repository.ts#L81) (L81–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.manager.query`, `this.translateError`, `this.fetchOrThrow`
- **Efectos secundarios:** Llama funciones SQL: `void_phone_sale`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateError(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPhoneSaleRepository.getDpiImage`

- **Firma:** `getDpiImage(saleId: string): Promise<DpiImage \| null>` — [typeorm-phone-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone-sale.repository.ts#L97) (L97–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.manager.query`
- **Efectos secundarios:** Tablas en su SQL: `phone_sales`, `phone_sale_dpi_images`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPhoneSaleRepository.fetchOrThrow`

- **Firma:** `fetchOrThrow(id: string): Promise<PhoneSale>` — [typeorm-phone-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone-sale.repository.ts#L113) (L113–124)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.manager.query`, `new InternalServerErrorException`, `PhoneSaleMapper.toDomain`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `new InternalServerErrorException( 'No se pudo recuperar la venta de teléfono recién creada.', )`
- **Consumidores:** (mismo archivo)

##### `TypeOrmPhoneSaleRepository.translateError`

- **Firma:** `translateError(error: unknown): unknown` — [typeorm-phone-sale.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone-sale.repository.ts#L127) (L127–159)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;extra&gt;'` → domain-error translation pattern used throughout `recharges`/`purchases`.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new PhoneNotFoundError`, `new PhoneAlreadySoldError`, `new ClientDpiRequiredError`, `new PhoneNumberRequiredError`, `new PhoneNumberAlreadyAssignedError`, `new InvalidPhoneSaleClientError`, `new PhoneSaleVoidReasonRequiredError`, `new PhoneSaleNotFoundError`, `new PhoneSaleAlreadyVoidedError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-repository-ts"></a>

### typeorm-phone.repository.ts

- **Ruta:** [typeorm-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone.repository.ts) (`comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone.repository.ts`, 75 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmPhoneRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts), [phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-repository-ts), [imei-already-exists.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-imei-already-exists-error-ts), [sim-number-already-exists.error.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-errors-sim-number-already-exists-error-ts), [phone.orm-entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-orm-entity-ts), [phone.mapper.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts)

#### Clase `TypeOrmPhoneRepository` (L14–74)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements PhoneRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(PhoneOrmEntity) repository: Repository<PhoneOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 21–26 | — | `Promise<Phone[]>` |
| `findById` | método public async | 28–31 | `id: string` | `Promise<Phone \| null>` |
| `findByImei` | método public async | 33–36 | `imei: string` | `Promise<Phone \| null>` |
| `findBySimNumber` | método public async | 38–41 | `simNumber: string` | `Promise<Phone \| null>` |
| `create` | método public async | 43–54 | `data: CreatePhoneData` | `Promise<Phone>` |
| `translateUniqueViolation` | método private | 57–73 | `error: unknown`, `data: CreatePhoneData` | `unknown` |

##### `TypeOrmPhoneRepository.findAll`

- **Firma:** `findAll(): Promise<Phone[]>` — [typeorm-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone.repository.ts#L21) (L21–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `PhoneMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPhoneRepository.findById`

- **Firma:** `findById(id: string): Promise<Phone \| null>` — [typeorm-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone.repository.ts#L28) (L28–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `PhoneMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPhoneRepository.findByImei`

- **Firma:** `findByImei(imei: string): Promise<Phone \| null>` — [typeorm-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone.repository.ts#L33) (L33–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `PhoneMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPhoneRepository.findBySimNumber`

- **Firma:** `findBySimNumber(simNumber: string): Promise<Phone \| null>` — [typeorm-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone.repository.ts#L38) (L38–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `PhoneMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPhoneRepository.create`

- **Firma:** `create(data: CreatePhoneData): Promise<Phone>` — [typeorm-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone.repository.ts#L43) (L43–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `PhoneMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPhoneRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, data: CreatePhoneData): unknown` — [typeorm-phone.repository.ts](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone.repository.ts#L57) (L57–73)
- **Propósito / descripción:** Safety net for the create-time race the use case's own pre-check can't close — same pattern as `TypeOrmSupplierRepository.translateUniqueViolation`.
- **Dependencias (llamadas en su cuerpo):** `new ImeiAlreadyExistsError`, `new SimNumberAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-phones-phones-module-ts"></a>

### phones.module.ts

- **Ruta:** [phones.module.ts](../../../../comercial-jhoel-api/src/modules/phones/phones.module.ts) (`comercial-jhoel-api/src/modules/phones/phones.module.ts`, 38 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** No import of `RechargesModule` — the phones module is fully independent, only borrowing the SIM sale flow's *pattern* (see the migration's own doc comment), never its code or tables.
- **Depende de (archivos del proyecto):** [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts), [phone.orm-entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-phone-orm-entity-ts), [typeorm-phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-repository-ts), [typeorm-phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-infrastructure-persistence-typeorm-phone-sale-repository-ts), [phone.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-repository-ts), [phone-sale.repository.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-repositories-phone-sale-repository-ts), [create-phone.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-ts), [list-phones.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phones-use-case-ts), [get-phone-by-id.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-ts), [register-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-ts), [list-phone-sales.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phone-sales-use-case-ts), [get-phone-sale-by-id.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-by-id-use-case-ts), [get-phone-sale-dpi-image.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-ts), [void-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-ts), [phones.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phones-controller-ts) y 1 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `PhonesModule` (L21–37)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([PhoneOrmEntity]), ClientsModule], controllers: [PhonesController, PhoneSalesController], providers: [ { provide: PH`
- **Propósito:** No import of `RechargesModule` — the phones module is fully independent, only borrowing the SIM sale flow's *pattern* (see the migration's own doc comment), never its code or tables.
<a id="f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts"></a>

### phone-sales.controller.ts

- **Ruta:** [phone-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phone-sales.controller.ts) (`comercial-jhoel-api/src/modules/phones/presentation/controllers/phone-sales.controller.ts`, 126 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Venta de teléfonos — registering a sale is operational (no `@Roles(...)`, same policy as Ventas/Compras/Recargas/SIM); anular is admin-only, same elevated policy as every other void action in this codebase.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [register-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-ts), [list-phone-sales.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phone-sales-use-case-ts), [get-phone-sale-by-id.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-by-id-use-case-ts), [get-phone-sale-dpi-image.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-sale-dpi-image-use-case-ts), [void-phone-sale.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-void-phone-sale-use-case-ts), [register-phone-sale.request.dto.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-dtos-register-phone-sale-request-dto-ts), [void-phone-sale.request.dto.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-dtos-void-phone-sale-request-dto-ts), [phone-sale.response.dto.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-dtos-phone-sale-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/platform-express`, `express`
- **Consumidores:** [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts)

**Interfaces, tipos y enums:**

- `interface UploadedImageFile` (L31): Same minimal shape `RechargeSimsController` reads off an uploaded file — avoids a `@types/multer` dependency for one field. — miembros: `buffer`, `mimetype`, `size`

#### Clase `PhoneSalesController` (L42–125)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('phone-sales')`
- **Propósito:** Venta de teléfonos — registering a sale is operational (no `@Roles(...)`, same policy as Ventas/Compras/Recargas/SIM); anular is admin-only, same elevated policy as every other void action in this codebase.
- **Dependencias inyectadas (constructor):** `registerPhoneSaleUseCase: RegisterPhoneSaleUseCase`, `listPhoneSalesUseCase: ListPhoneSalesUseCase`, `getPhoneSaleByIdUseCase: GetPhoneSaleByIdUseCase`, `getPhoneSaleDpiImageUseCase: GetPhoneSaleDpiImageUseCase`, `voidPhoneSaleUseCase: VoidPhoneSaleUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `registerSale` | método public | 53–76 | `dto: RegisterPhoneSaleRequestDto`, `dpiImage: UploadedImageFile \| undefined`, `userId: string` | `Promise<PhoneSaleResponseDto>` |
| `findAll` | método public | 78–81 | — | `Promise<PhoneSaleResponseDto[]>` |
| `findOne` | método public | 83–88 | `id: string` | `Promise<PhoneSaleResponseDto>` |
| `getDpiImage` | método public async | 96–108 | `id: string`, `res: Response` | `Promise<void>` |
| `voidSale` | método public | 110–124 | `id: string`, `dto: VoidPhoneSaleRequestDto`, `userId: string` | `Promise<PhoneSaleResponseDto>` |

##### `PhoneSalesController.registerSale`

- **Firma:** `registerSale(dto: RegisterPhoneSaleRequestDto, dpiImage: UploadedImageFile \| undefined, userId: string): Promise<PhoneSaleResponseDto>` — [phone-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phone-sales.controller.ts#L53) (L53–76)
- **Decoradores:** `@Post()` `@UseInterceptors(FileInterceptor('dpiImage'))` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@UploadedFile() dpiImage`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.registerPhoneSaleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSalesController.findAll`

- **Firma:** `findAll(): Promise<PhoneSaleResponseDto[]>` — [phone-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phone-sales.controller.ts#L78) (L78–81)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.listPhoneSalesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSalesController.findOne`

- **Firma:** `findOne(id: string): Promise<PhoneSaleResponseDto>` — [phone-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phone-sales.controller.ts#L83) (L83–88)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getPhoneSaleByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSalesController.getDpiImage`

- **Firma:** `getDpiImage(id: string, res: Response): Promise<void>` — [phone-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phone-sales.controller.ts#L96) (L96–108)
- **Decoradores:** `@Get(':id/dpi-image')`
- **Propósito / descripción:** The ONE place a phone sale's DPI photo bytes are ever served — still behind the controller's own `JwtAuthGuard`, never a public/static path. `@Res()` direct response, same `ResponseInterceptor`-bypass pattern every PDF export/DPI-image endpoint in this codebase already uses.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.getPhoneSaleDpiImageUseCase.execute`, `res.set`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneSalesController.voidSale`

- **Firma:** `voidSale(id: string, dto: VoidPhoneSaleRequestDto, userId: string): Promise<PhoneSaleResponseDto>` — [phone-sales.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phone-sales.controller.ts#L110) (L110–124)
- **Decoradores:** `@Post(':id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidPhoneSaleUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phones-controller-ts"></a>

### phones.controller.ts

- **Ruta:** [phones.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phones.controller.ts) (`comercial-jhoel-api/src/modules/phones/presentation/controllers/phones.controller.ts`, 62 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Inventario/Compra de teléfonos — no `@Roles(...)`, same "any authenticated active account" operational policy as Ventas/Compras/Recargas (registering a phone purchase is a daily register task, not admin-only).
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-phone.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-create-phone-use-case-ts), [list-phones.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-list-phones-use-case-ts), [get-phone-by-id.use-case.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-get-phone-by-id-use-case-ts), [create-phone.request.dto.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-dtos-create-phone-request-dto-ts), [phone.response.dto.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-dtos-phone-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts)

#### Clase `PhonesController` (L25–61)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('phones')`
- **Propósito:** Inventario/Compra de teléfonos — no `@Roles(...)`, same "any authenticated active account" operational policy as Ventas/Compras/Recargas (registering a phone purchase is a daily register task, not admin-only).
- **Dependencias inyectadas (constructor):** `createPhoneUseCase: CreatePhoneUseCase`, `listPhonesUseCase: ListPhonesUseCase`, `getPhoneByIdUseCase: GetPhoneByIdUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 34–50 | `dto: CreatePhoneRequestDto`, `userId: string` | `Promise<PhoneResponseDto>` |
| `findAll` | método public | 52–55 | — | `Promise<PhoneResponseDto[]>` |
| `findOne` | método public | 57–60 | `id: string` | `Promise<PhoneResponseDto>` |

##### `PhonesController.create`

- **Firma:** `create(dto: CreatePhoneRequestDto, userId: string): Promise<PhoneResponseDto>` — [phones.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phones.controller.ts#L34) (L34–50)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createPhoneUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhonesController.findAll`

- **Firma:** `findAll(): Promise<PhoneResponseDto[]>` — [phones.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phones.controller.ts#L52) (L52–55)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.listPhonesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhonesController.findOne`

- **Firma:** `findOne(id: string): Promise<PhoneResponseDto>` — [phones.controller.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phones.controller.ts#L57) (L57–60)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getPhoneByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-phones-presentation-dtos-create-phone-request-dto-ts"></a>

### create-phone.request.dto.ts

- **Ruta:** [create-phone.request.dto.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/dtos/create-phone.request.dto.ts) (`comercial-jhoel-api/src/modules/phones/presentation/dtos/create-phone.request.dto.ts`, 42 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** No `phoneNumber` here — a bought phone has no active line yet, see `phone.entity.ts`'s own doc comment.
- **Depende de (archivos del proyecto):** [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [phones.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phones-controller-ts)

#### Clase `CreatePhoneRequestDto` (L13–41)

- **Propósito:** No `phoneNumber` here — a bought phone has no active line yet, see `phone.entity.ts`'s own doc comment. It's assigned later, at the moment of sale (`RegisterPhoneSaleRequestDto`).
<a id="f-comercial-jhoel-api-src-modules-phones-presentation-dtos-phone-sale-response-dto-ts"></a>

### phone-sale.response.dto.ts

- **Ruta:** [phone-sale.response.dto.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/dtos/phone-sale.response.dto.ts) (`comercial-jhoel-api/src/modules/phones/presentation/dtos/phone-sale.response.dto.ts`, 28 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** DTO de respuesta: declara `PhoneSaleResponseDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts)
- **Consumidores:** [phone-sales.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts)

#### Clase `PhoneSaleResponseDto` (L3–27)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-phones-presentation-dtos-phone-response-dto-ts"></a>

### phone.response.dto.ts

- **Ruta:** [phone.response.dto.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/dtos/phone.response.dto.ts) (`comercial-jhoel-api/src/modules/phones/presentation/dtos/phone.response.dto.ts`, 21 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** DTO de respuesta: declara `PhoneResponseDto` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [phone.entity.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-domain-entities-phone-entity-ts)
- **Consumidores:** [phones.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phones-controller-ts)

#### Clase `PhoneResponseDto` (L3–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-phones-presentation-dtos-register-phone-sale-request-dto-ts"></a>

### register-phone-sale.request.dto.ts

- **Ruta:** [register-phone-sale.request.dto.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/dtos/register-phone-sale.request.dto.ts) (`comercial-jhoel-api/src/modules/phones/presentation/dtos/register-phone-sale.request.dto.ts`, 41 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** `multipart/form-data` body — the DPI photo travels alongside as the `dpiImage` file field (read via `@UploadedFile()`, see `PhoneSalesController.registerSale`), optional (see the plan's own "foto opcional, igual que SIM" decision).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [phone-sales.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts)

#### Clase `RegisterPhoneSaleRequestDto` (L18–40)

- **Propósito:** `multipart/form-data` body — the DPI photo travels alongside as the `dpiImage` file field (read via `@UploadedFile()`, see `PhoneSalesController.registerSale`), optional (see the plan's own "foto opcional, igual que SIM" decision). No `salePrice` field — the server always computes it from the phone's own `publicPrice` (`register_phone_sale`), never from a caller-supplied value.
<a id="f-comercial-jhoel-api-src-modules-phones-presentation-dtos-void-phone-sale-request-dto-ts"></a>

### void-phone-sale.request.dto.ts

- **Ruta:** [void-phone-sale.request.dto.ts](../../../../comercial-jhoel-api/src/modules/phones/presentation/dtos/void-phone-sale.request.dto.ts) (`comercial-jhoel-api/src/modules/phones/presentation/dtos/void-phone-sale.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `phones`
- **Responsabilidad:** Same mandatory-reason shape as `VoidRechargeSimSaleRegistrationRequestDto`/`VoidPurchaseRequestDto` — kept as this module's own copy rather than a cross-module import.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [phone-sales.controller.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-presentation-controllers-phone-sales-controller-ts)

#### Clase `VoidPhoneSaleRequestDto` (L4–10)

- **Propósito:** Same mandatory-reason shape as `VoidRechargeSimSaleRegistrationRequestDto`/`VoidPurchaseRequestDto` — kept as this module's own copy rather than a cross-module import.
