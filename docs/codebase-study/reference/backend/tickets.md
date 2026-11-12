# Módulo backend `tickets`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/tickets` | [tickets.controller.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/controllers/tickets.controller.ts#L55) `TicketsController.create` | [CreateTicketUseCase](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-ts) | `TicketRepository`.createTicket → `create_ticket`<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard) | `TicketsService.createTicket` |
| `GET /api/tickets` | [tickets.controller.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/controllers/tickets.controller.ts#L69) `TicketsController.findAll` | [ListTicketsUseCase](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-list-tickets-use-case-ts) | `TicketRepository`.findAll | UseGuards(JwtAuthGuard) | `TicketsService.getTickets` |
| `GET /api/tickets/:id/pdf` | [tickets.controller.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/controllers/tickets.controller.ts#L87) `TicketsController.getPdf` | [GetTicketPdfUseCase](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-pdf-use-case-ts) | `TicketRepository`.findById<br>`CompanySettingsRepository`.get | UseGuards(JwtAuthGuard) | `TicketsService.exportTicketPdf` |
| `POST /api/tickets/:id/void` | [tickets.controller.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/controllers/tickets.controller.ts#L106) `TicketsController.voidTicket` | [VoidTicketUseCase](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-ts) | `TicketRepository`.findById/voidTicket | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `TicketsService.voidTicket` |
| `GET /api/tickets/:id` | [tickets.controller.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/controllers/tickets.controller.ts#L121) `TicketsController.findOne` | [GetTicketByIdUseCase](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-by-id-use-case-ts) | `TicketRepository`.findById | UseGuards(JwtAuthGuard) | `TicketsService.getTicketById` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [ticket-output.ts](#f-comercial-jhoel-api-src-modules-tickets-application-dtos-ticket-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toTicketOutput`, `toTicketSummaryOutput`, `TicketItemOutput`, `TicketOutput`, `TicketSummaryOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [create-ticket.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makeTicket`, `makeClient` (sin comentario de documentación en el código). | 9 internas | 0 | Soporte (pruebas) |
| [create-ticket.use-case.ts](#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-ts) | .ts | Caso de uso | Aplicación | A Ticket is explicitly NOT a real sale — `create_ticket()` never touches `products.stock`/`inventory_stock`/`inventory_movements`. | 7 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-ticket-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetTicketByIdUseCase`, `GetTicketByIdInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-ticket-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | Reconstructs the ticket's receipt PDF purely from already-persisted data — never re-runs `create_ticket`. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-tickets.use-case.ts](#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-list-tickets-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListTicketsUseCase`, `ListTicketsInput`, `ListTicketsOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [void-ticket.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makeTicket` (sin comentario de documentación en el código). | 5 internas | 0 | Soporte (pruebas) |
| [void-ticket.use-case.ts](#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-ts) | .ts | Caso de uso | Aplicación | The correction path for a mistaken Ticket — never an edit, never a physical delete. | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [ticket-detail.entity.ts](#f-comercial-jhoel-api-src-modules-tickets-domain-entities-ticket-detail-entity-ts) | .ts | Entidad de dominio | Dominio | A frozen line item — `productName`/`unitPrice`/`total` are snapshotted at the moment the ticket was created, never recomputed from the live product. | 0 internas | 2 | Baja (2 consumidores) |
| [ticket.entity.ts](#f-comercial-jhoel-api-src-modules-tickets-domain-entities-ticket-entity-ts) | .ts | Entidad de dominio | Dominio | A Ticket is explicitly NOT a real sale — created in one shot (like a Purchase), never touches `products.stock`/`inventory_stock`/ `inventory_movements` (see `create_ticket()`), never appears in Sales reports/dashboard. | 1 internas | 6 | Media (6 consumidores) |
| [invalid-client.error.ts](#f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-client-error-ts) | .ts | Errores de dominio | Dominio | The referenced client doesn't exist or is deactivated — this module's own copy, mirroring `sales`' `InvalidClientError` (each module owns its error classes, even for a shared concept). | 1 internas | 3 | Media (3 consumidores) |
| [invalid-ticket-price.error.ts](#f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-ticket-price-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidTicketPriceError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [invalid-ticket-quantity.error.ts](#f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-ticket-quantity-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidTicketQuantityError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [ticket-access-denied.error.ts](#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-access-denied-error-ts) | .ts | Errores de dominio | Dominio | A USER account trying to view a ticket that isn't theirs — ADMIN/SUPER_ADMIN can view any ticket. | 1 internas | 2 | Baja (2 consumidores) |
| [ticket-already-voided.error.ts](#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-already-voided-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `TicketAlreadyVoidedError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [ticket-empty.error.ts](#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-empty-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `TicketEmptyError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [ticket-not-found.error.ts](#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `TicketNotFoundError` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [ticket-product-inactive.error.ts](#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-product-inactive-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `TicketProductInactiveError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [ticket-product-not-found.error.ts](#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-product-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `TicketProductNotFoundError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [ticket.repository.ts](#f-comercial-jhoel-api-src-modules-tickets-domain-repositories-ticket-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateTicketItemData`, `CreateTicketData`, `FindTicketsOptions`, `PaginatedResult`, `TicketRepository` (sin comentario de documentación en el código). | 1 internas | 10 | Alta (10 consumidores) |
| [ticket-pdf.builder.ts](#f-comercial-jhoel-api-src-modules-tickets-infrastructure-pdf-ticket-pdf-builder-ts) | .ts | Builder | Infraestructura | Reconstructs a Ticket receipt purely from already-persisted data (`TicketOutput` + company settings) — never re-runs `create_ticket` or touches inventory. | 1 internas; ext.: pdfkit | 1 | Baja (1 consumidores) |
| [ticket-detail.orm-entity.ts](#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-detail-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `TicketDetailOrmEntity` (sin comentario de documentación en el código). | 2 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [ticket.mapper.ts](#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `TicketMapper` (sin comentario de documentación en el código). | 3 internas | 1 | Baja (1 consumidores) |
| [ticket.orm-entity.ts](#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `TicketOrmEntity` (sin comentario de documentación en el código). | 4 internas; ext.: typeorm | 4 | Media (4 consumidores) |
| [typeorm-ticket.repository.ts](#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmTicketRepository` (sin comentario de documentación en el código). | 10 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [tickets.controller.ts](#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts) | .ts | Controlador | Presentación | No class-level `@Roles(...)` — same policy as Sales/Purchases: creating a Ticket is an operational action for whoever runs the register, not an admin-only one. | 13 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [create-ticket.request.dto.ts](#f-comercial-jhoel-api-src-modules-tickets-presentation-dtos-create-ticket-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateTicketItemRequestDto`, `CreateTicketRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [list-tickets.query.dto.ts](#f-comercial-jhoel-api-src-modules-tickets-presentation-dtos-list-tickets-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListTicketsQueryDto`, `STATUS_FILTERS` (sin comentario de documentación en el código). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [ticket.response.dto.ts](#f-comercial-jhoel-api-src-modules-tickets-presentation-dtos-ticket-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `TicketItemResponseDto`, `TicketResponseDto`, `TicketSummaryResponseDto`, `PaginatedTicketsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [void-ticket.request.dto.ts](#f-comercial-jhoel-api-src-modules-tickets-presentation-dtos-void-ticket-request-dto-ts) | .ts | DTO de entrada | Presentación | Mirrors `VoidBankDepositOperationRequestDto`'s own mandatory-reason shape — this module's own copy rather than a cross-module import. | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [tickets.module.ts](#f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `TicketsModule` (sin comentario de documentación en el código). | 12 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-tickets-application-dtos-ticket-output-ts"></a>

### ticket-output.ts

- **Ruta:** [ticket-output.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/dtos/ticket-output.ts) (`comercial-jhoel-api/src/modules/tickets/application/dtos/ticket-output.ts`, 92 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** DTO de salida (aplicación): declara `toTicketOutput`, `toTicketSummaryOutput`, `TicketItemOutput`, `TicketOutput`, `TicketSummaryOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ticket.entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-entities-ticket-entity-ts)
- **Consumidores:** [create-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-ts), [get-ticket-by-id.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-by-id-use-case-ts), [list-tickets.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-list-tickets-use-case-ts), [void-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-ts)

**Interfaces, tipos y enums:**

- `interface TicketItemOutput` (L3): sin documentación — miembros: `id`, `productId`, `productName`, `presentationName`, `quantity`, `unitPrice`, `total`, `observation`
- `interface TicketOutput` (L15): Full shape — used for `GET /tickets/:id`, the response of `POST /tickets`, and `POST /tickets/:id/void`. — miembros: `id`, `ticketNumber`, `clientId`, `clientName`, `userId`, `username`, `subtotal`, `discount`, `total`, `isVoided`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `items`, `createdAt`, `updatedAt`
- `interface TicketSummaryOutput` (L36): Lighter shape for `GET /tickets` — no line items, so listing tickets never needs to load them. — miembros: `id`, `ticketNumber`, `clientId`, `clientName`, `userId`, `username`, `total`, `isVoided`, `createdAt`
#### Función `toTicketOutput` (L48–77)

- **Tipo:** función exportada
- **Firma:** `toTicketOutput(ticket: Ticket): TicketOutput` — [ticket-output.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/dtos/ticket-output.ts#L48)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `ticket.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-ts), [get-ticket-by-id.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-by-id-use-case-ts), [void-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-ts)

#### Función `toTicketSummaryOutput` (L79–91)

- **Tipo:** función exportada
- **Firma:** `toTicketSummaryOutput(ticket: Ticket): TicketSummaryOutput` — [ticket-output.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/dtos/ticket-output.ts#L79)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-spec-ts"></a>

### create-ticket.use-case.spec.ts

- **Ruta:** [create-ticket.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/create-ticket.use-case.spec.ts) (`comercial-jhoel-api/src/modules/tickets/application/use-cases/create-ticket.use-case.spec.ts`, 211 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Prueba unitaria: declara `makeTicket`, `makeClient` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [create-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-ts), [ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-repositories-ticket-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [ticket-empty.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-empty-error-ts), [invalid-ticket-quantity.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-ticket-quantity-error-ts), [invalid-ticket-price.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-ticket-price-error-ts), [invalid-client.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-client-error-ts), [ticket.entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-entities-ticket-entity-ts), [client.entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-entities-client-entity-ts)
- **Consumidores:** —
#### Función `makeTicket` (L11–31)

- **Tipo:** función local del archivo
- **Firma:** `makeTicket(): Ticket` — [create-ticket.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/create-ticket.use-case.spec.ts#L11)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Ticket.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `makeClient` (L33–45)

- **Tipo:** función local del archivo
- **Firma:** `makeClient(isActive: boolean): Client` — [create-ticket.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/create-ticket.use-case.spec.ts#L33)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Client.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-ts"></a>

### create-ticket.use-case.ts

- **Ruta:** [create-ticket.use-case.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/create-ticket.use-case.ts) (`comercial-jhoel-api/src/modules/tickets/application/use-cases/create-ticket.use-case.ts`, 113 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** A Ticket is explicitly NOT a real sale — `create_ticket()` never touches `products.stock`/`inventory_stock`/`inventory_movements`.
- **Depende de (archivos del proyecto):** [ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-repositories-ticket-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [ticket-empty.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-empty-error-ts), [invalid-ticket-quantity.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-ticket-quantity-error-ts), [invalid-ticket-price.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-ticket-price-error-ts), [invalid-client.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-client-error-ts), [ticket-output.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-dtos-ticket-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [create-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-spec-ts), [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts), [tickets.module.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateTicketItemInput` (L12): sin documentación — miembros: `productId`, `quantity`, `observation`, `unitPrice`
- `interface CreateTicketInput` (L20): sin documentación — miembros: `userId`, `clientId`, `clientName`, `items`

#### Clase `CreateTicketUseCase` (L34–112)

- **Decoradores:** `@Injectable()`
- **Propósito:** A Ticket is explicitly NOT a real sale — `create_ticket()` never touches `products.stock`/`inventory_stock`/`inventory_movements`. Structurally mirrors `CreateSaleUseCase`/`CreatePurchaseUseCase`'s own validation and defensive-dedup shape.
- **Dependencias inyectadas (constructor):** `@Inject(TICKET_REPOSITORY) ticketRepository: TicketRepository`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 43–111 | `input: CreateTicketInput` | `Promise<TicketOutput>` |

##### `CreateTicketUseCase.execute`

- **Firma:** `execute(input: CreateTicketInput): Promise<TicketOutput>` — [create-ticket.use-case.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/create-ticket.use-case.ts#L43) (L43–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new TicketEmptyError`, `this.clientRepository.findById`, `new InvalidClientError`, `Number.isInteger`, `new InvalidTicketQuantityError`, `new InvalidTicketPriceError`, `new Map`, `mergedByProduct.get`, `item.observation?.trim`, `mergedByProduct.set`, `[...mergedByProduct.entries()].map`, `mergedByProduct.entries`, `a.productId.localeCompare`, `input.clientName?.trim`, `this.ticketRepository.createTicket`, `toTicketOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new TicketEmptyError()`, `new InvalidClientError()`, `new InvalidTicketQuantityError(item.productId)`, `new InvalidTicketPriceError(item.productId)`
- **Consumidores:** [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-by-id-use-case-ts"></a>

### get-ticket-by-id.use-case.ts

- **Ruta:** [get-ticket-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/get-ticket-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/tickets/application/use-cases/get-ticket-by-id.use-case.ts`, 33 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Caso de uso: declara `GetTicketByIdUseCase`, `GetTicketByIdInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-repositories-ticket-repository-ts), [ticket-not-found.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-not-found-error-ts), [ticket-access-denied.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-access-denied-error-ts), [ticket-output.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-dtos-ticket-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts), [tickets.module.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts)

**Interfaces, tipos y enums:**

- `interface GetTicketByIdInput` (L8): sin documentación — miembros: `currentUserId`, `isAdmin`

#### Clase `GetTicketByIdUseCase` (L13–32)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(TICKET_REPOSITORY) ticketRepository: TicketRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–31 | `id: string`, `input: GetTicketByIdInput` | `Promise<TicketOutput>` |

##### `GetTicketByIdUseCase.execute`

- **Firma:** `execute(id: string, input: GetTicketByIdInput): Promise<TicketOutput>` — [get-ticket-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/get-ticket-by-id.use-case.ts#L20) (L20–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.ticketRepository.findById`, `new TicketNotFoundError`, `new TicketAccessDeniedError`, `toTicketOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new TicketNotFoundError(id)`, `new TicketAccessDeniedError()`
- **Consumidores:** [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-pdf-use-case-ts"></a>

### get-ticket-pdf.use-case.ts

- **Ruta:** [get-ticket-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/get-ticket-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/tickets/application/use-cases/get-ticket-pdf.use-case.ts`, 66 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Reconstructs the ticket's receipt PDF purely from already-persisted data — never re-runs `create_ticket`.
- **Depende de (archivos del proyecto):** [ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-repositories-ticket-repository-ts), [ticket-not-found.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-not-found-error-ts), [ticket-access-denied.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-access-denied-error-ts), [company-settings.repository.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-domain-repositories-company-settings-repository-ts), [ticket-pdf.builder.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-pdf-ticket-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts), [tickets.module.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts)

**Interfaces, tipos y enums:**

- `interface GetTicketPdfInput` (L10): sin documentación — miembros: `currentUserId`, `isAdmin`

#### Clase `GetTicketPdfUseCase` (L21–65)

- **Decoradores:** `@Injectable()`
- **Propósito:** Reconstructs the ticket's receipt PDF purely from already-persisted data — never re-runs `create_ticket`. Same ownership rule as `GetTicketByIdUseCase`. A ticket has no draft concept (created in one shot, like a purchase), so there's no draft-rejection branch.
- **Dependencias inyectadas (constructor):** `@Inject(TICKET_REPOSITORY) ticketRepository: TicketRepository`, `@Inject(COMPANY_SETTINGS_REPOSITORY) companySettingsRepository: CompanySettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–64 | `id: string`, `input: GetTicketPdfInput` | `Promise<Buffer>` |

##### `GetTicketPdfUseCase.execute`

- **Firma:** `execute(id: string, input: GetTicketPdfInput): Promise<Buffer>` — [get-ticket-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/get-ticket-pdf.use-case.ts#L30) (L30–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.ticketRepository.findById`, `new TicketNotFoundError`, `new TicketAccessDeniedError`, `this.companySettingsRepository.get`, `buildTicketPdf`, `ticket.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new TicketNotFoundError(id)`, `new TicketAccessDeniedError()`
- **Consumidores:** [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-tickets-application-use-cases-list-tickets-use-case-ts"></a>

### list-tickets.use-case.ts

- **Ruta:** [list-tickets.use-case.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/list-tickets.use-case.ts) (`comercial-jhoel-api/src/modules/tickets/application/use-cases/list-tickets.use-case.ts`, 69 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Caso de uso: declara `ListTicketsUseCase`, `ListTicketsInput`, `ListTicketsOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-repositories-ticket-repository-ts), [ticket-output.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-dtos-ticket-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts), [tickets.module.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts)

**Interfaces, tipos y enums:**

- `interface ListTicketsInput` (L12): sin documentación — miembros: `currentUserId`, `isAdmin`, `startDate`, `endDate`, `search`, `status`, `page`, `limit`
- `interface ListTicketsOutput` (L24): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `ListTicketsUseCase` (L35–68)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(TICKET_REPOSITORY) ticketRepository: TicketRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 42–67 | `input: ListTicketsInput` | `Promise<ListTicketsOutput>` |

##### `ListTicketsUseCase.execute`

- **Firma:** `execute(input: ListTicketsInput): Promise<ListTicketsOutput>` — [list-tickets.use-case.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/list-tickets.use-case.ts#L42) (L42–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.min`, `this.ticketRepository.findAll`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-spec-ts"></a>

### void-ticket.use-case.spec.ts

- **Ruta:** [void-ticket.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/void-ticket.use-case.spec.ts) (`comercial-jhoel-api/src/modules/tickets/application/use-cases/void-ticket.use-case.spec.ts`, 83 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Prueba unitaria: declara `makeTicket` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [void-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-ts), [ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-repositories-ticket-repository-ts), [ticket-not-found.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-not-found-error-ts), [ticket-already-voided.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-already-voided-error-ts), [ticket.entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-entities-ticket-entity-ts)
- **Consumidores:** —
#### Función `makeTicket` (L7–27)

- **Tipo:** función local del archivo
- **Firma:** `makeTicket(isVoided: boolean): Ticket` — [void-ticket.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/void-ticket.use-case.spec.ts#L7)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Ticket.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-ts"></a>

### void-ticket.use-case.ts

- **Ruta:** [void-ticket.use-case.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/void-ticket.use-case.ts) (`comercial-jhoel-api/src/modules/tickets/application/use-cases/void-ticket.use-case.ts`, 43 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** The correction path for a mistaken Ticket — never an edit, never a physical delete.
- **Depende de (archivos del proyecto):** [ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-repositories-ticket-repository-ts), [ticket-not-found.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-not-found-error-ts), [ticket-already-voided.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-already-voided-error-ts), [ticket-output.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-dtos-ticket-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [void-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-spec-ts), [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts), [tickets.module.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts)

**Interfaces, tipos y enums:**

- `interface VoidTicketInput` (L8): sin documentación — miembros: `id`, `voidedBy`, `reason`

#### Clase `VoidTicketUseCase` (L19–42)

- **Decoradores:** `@Injectable()`
- **Propósito:** The correction path for a mistaken Ticket — never an edit, never a physical delete. Same shape as `VoidBankDepositOperationUseCase`. Admin-only (enforced at the controller via `@Roles`).
- **Dependencias inyectadas (constructor):** `@Inject(TICKET_REPOSITORY) ticketRepository: TicketRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 26–41 | `input: VoidTicketInput` | `Promise<TicketOutput>` |

##### `VoidTicketUseCase.execute`

- **Firma:** `execute(input: VoidTicketInput): Promise<TicketOutput>` — [void-ticket.use-case.ts](../../../../comercial-jhoel-api/src/modules/tickets/application/use-cases/void-ticket.use-case.ts#L26) (L26–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.ticketRepository.findById`, `new TicketNotFoundError`, `new TicketAlreadyVoidedError`, `this.ticketRepository.voidTicket`, `toTicketOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new TicketNotFoundError(input.id)`, `new TicketAlreadyVoidedError(input.id)`
- **Consumidores:** [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-tickets-domain-entities-ticket-detail-entity-ts"></a>

### ticket-detail.entity.ts

- **Ruta:** [ticket-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket-detail.entity.ts) (`comercial-jhoel-api/src/modules/tickets/domain/entities/ticket-detail.entity.ts`, 52 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** A frozen line item — `productName`/`unitPrice`/`total` are snapshotted at the moment the ticket was created, never recomputed from the live product.
- **Consumidores:** [ticket.entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-entities-ticket-entity-ts), [ticket.mapper.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-mapper-ts)

**Interfaces, tipos y enums:**

- `interface TicketDetailProps` (L1): sin documentación — miembros: `id`, `productId`, `productName`, `presentationName`, `quantity`, `unitPrice`, `total`, `observation`

#### Clase `TicketDetail` (L13–51)

- **Propósito:** A frozen line item — `productName`/`unitPrice`/`total` are snapshotted at the moment the ticket was created, never recomputed from the live product.
- **Dependencias inyectadas (constructor):** `props: TicketDetailProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 16–18 | `props: TicketDetailProps` | `TicketDetail` |
| `id` | getter public | 20–22 | — | `string` |
| `productId` | getter public | 24–26 | — | `string` |
| `productName` | getter public | 28–30 | — | `string` |
| `presentationName` | getter public | 32–34 | — | `string \| null` |
| `quantity` | getter public | 36–38 | — | `number` |
| `unitPrice` | getter public | 40–42 | — | `number` |
| `total` | getter public | 44–46 | — | `number` |
| `observation` | getter public | 48–50 | — | `string \| null` |

##### `TicketDetail.create`

- **Firma:** `create(props: TicketDetailProps): TicketDetail` — [ticket-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket-detail.entity.ts#L16) (L16–18)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new TicketDetail`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [ticket.mapper.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-mapper-ts)

##### `TicketDetail.id`

- **Firma:** `id(): string` — [ticket-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket-detail.entity.ts#L20) (L20–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TicketDetail.productId`

- **Firma:** `productId(): string` — [ticket-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket-detail.entity.ts#L24) (L24–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TicketDetail.productName`

- **Firma:** `productName(): string` — [ticket-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket-detail.entity.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TicketDetail.presentationName`

- **Firma:** `presentationName(): string \| null` — [ticket-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket-detail.entity.ts#L32) (L32–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TicketDetail.quantity`

- **Firma:** `quantity(): number` — [ticket-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket-detail.entity.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TicketDetail.unitPrice`

- **Firma:** `unitPrice(): number` — [ticket-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket-detail.entity.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TicketDetail.total`

- **Firma:** `total(): number` — [ticket-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket-detail.entity.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TicketDetail.observation`

- **Firma:** `observation(): string \| null` — [ticket-detail.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket-detail.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-tickets-domain-entities-ticket-entity-ts"></a>

### ticket.entity.ts

- **Ruta:** [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts) (`comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts`, 104 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** A Ticket is explicitly NOT a real sale — created in one shot (like a Purchase), never touches `products.stock`/`inventory_stock`/ `inventory_movements` (see `create_ticket()`), never appears in Sales reports/dashboard.
- **Depende de (archivos del proyecto):** [ticket-detail.entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-entities-ticket-detail-entity-ts)
- **Consumidores:** [ticket-output.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-dtos-ticket-output-ts), [create-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-spec-ts), [void-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-spec-ts), [ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-repositories-ticket-repository-ts), [ticket.mapper.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-mapper-ts), [typeorm-ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts)

**Interfaces, tipos y enums:**

- `interface TicketProps` (L3): sin documentación — miembros: `id`, `ticketNumber`, `clientId`, `clientName`, `userId`, `username`, `subtotal`, `discount`, `total`, `isVoided`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `items`, `createdAt`, `updatedAt`

#### Clase `Ticket` (L29–103)

- **Propósito:** A Ticket is explicitly NOT a real sale — created in one shot (like a Purchase), never touches `products.stock`/`inventory_stock`/ `inventory_movements` (see `create_ticket()`), never appears in Sales reports/dashboard. Correction is anular-and-recreate, never a silent edit.
- **Dependencias inyectadas (constructor):** `props: TicketProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 32–34 | `props: TicketProps` | `Ticket` |
| `id` | getter public | 36–38 | — | `string` |
| `ticketNumber` | getter public | 40–42 | — | `string` |
| `clientId` | getter public | 44–46 | — | `string \| null` |
| `clientName` | getter public | 48–50 | — | `string \| null` |
| `userId` | getter public | 52–54 | — | `string` |
| `username` | getter public | 56–58 | — | `string` |
| `subtotal` | getter public | 60–62 | — | `number` |
| `discount` | getter public | 64–66 | — | `number` |
| `total` | getter public | 68–70 | — | `number` |
| `isVoided` | getter public | 72–74 | — | `boolean` |
| `voidedAt` | getter public | 76–78 | — | `Date \| null` |
| `voidedBy` | getter public | 80–82 | — | `string \| null` |
| `voidedByUsername` | getter public | 84–86 | — | `string \| null` |
| `voidReason` | getter public | 88–90 | — | `string \| null` |
| `items` | getter public | 92–94 | — | `TicketDetail[]` |
| `createdAt` | getter public | 96–98 | — | `Date` |
| `updatedAt` | getter public | 100–102 | — | `Date` |

##### `Ticket.create`

- **Firma:** `create(props: TicketProps): Ticket` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L32) (L32–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Ticket`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-spec-ts), [void-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-spec-ts), [ticket.mapper.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-mapper-ts)

##### `Ticket.id`

- **Firma:** `id(): string` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.ticketNumber`

- **Firma:** `ticketNumber(): string` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.clientId`

- **Firma:** `clientId(): string \| null` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.clientName`

- **Firma:** `clientName(): string \| null` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.userId`

- **Firma:** `userId(): string` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.username`

- **Firma:** `username(): string` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.subtotal`

- **Firma:** `subtotal(): number` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.discount`

- **Firma:** `discount(): number` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.total`

- **Firma:** `total(): number` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L68) (L68–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.isVoided`

- **Firma:** `isVoided(): boolean` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L72) (L72–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.voidedAt`

- **Firma:** `voidedAt(): Date \| null` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L76) (L76–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.voidedBy`

- **Firma:** `voidedBy(): string \| null` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.voidedByUsername`

- **Firma:** `voidedByUsername(): string \| null` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L84) (L84–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.voidReason`

- **Firma:** `voidReason(): string \| null` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L88) (L88–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.items`

- **Firma:** `items(): TicketDetail[]` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L92) (L92–94)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.createdAt`

- **Firma:** `createdAt(): Date` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L96) (L96–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Ticket.updatedAt`

- **Firma:** `updatedAt(): Date` — [ticket.entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/entities/ticket.entity.ts#L100) (L100–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-client-error-ts"></a>

### invalid-client.error.ts

- **Ruta:** [invalid-client.error.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/errors/invalid-client.error.ts) (`comercial-jhoel-api/src/modules/tickets/domain/errors/invalid-client.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** The referenced client doesn't exist or is deactivated — this module's own copy, mirroring `sales`' `InvalidClientError` (each module owns its error classes, even for a shared concept).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-spec-ts), [create-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-ts), [typeorm-ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts)

#### Clase `InvalidClientError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** The referenced client doesn't exist or is deactivated — this module's own copy, mirroring `sales`' `InvalidClientError` (each module owns its error classes, even for a shared concept).
<a id="f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-ticket-price-error-ts"></a>

### invalid-ticket-price.error.ts

- **Ruta:** [invalid-ticket-price.error.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/errors/invalid-ticket-price.error.ts) (`comercial-jhoel-api/src/modules/tickets/domain/errors/invalid-ticket-price.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Errores de dominio: declara `InvalidTicketPriceError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-spec-ts), [create-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-ts), [typeorm-ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts)

#### Clase `InvalidTicketPriceError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-ticket-quantity-error-ts"></a>

### invalid-ticket-quantity.error.ts

- **Ruta:** [invalid-ticket-quantity.error.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/errors/invalid-ticket-quantity.error.ts) (`comercial-jhoel-api/src/modules/tickets/domain/errors/invalid-ticket-quantity.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Errores de dominio: declara `InvalidTicketQuantityError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-spec-ts), [create-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-ts), [typeorm-ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts)

#### Clase `InvalidTicketQuantityError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-access-denied-error-ts"></a>

### ticket-access-denied.error.ts

- **Ruta:** [ticket-access-denied.error.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/errors/ticket-access-denied.error.ts) (`comercial-jhoel-api/src/modules/tickets/domain/errors/ticket-access-denied.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** A USER account trying to view a ticket that isn't theirs — ADMIN/SUPER_ADMIN can view any ticket.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-ticket-by-id.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-by-id-use-case-ts), [get-ticket-pdf.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-pdf-use-case-ts)

#### Clase `TicketAccessDeniedError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** A USER account trying to view a ticket that isn't theirs — ADMIN/SUPER_ADMIN can view any ticket.
<a id="f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-already-voided-error-ts"></a>

### ticket-already-voided.error.ts

- **Ruta:** [ticket-already-voided.error.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/errors/ticket-already-voided.error.ts) (`comercial-jhoel-api/src/modules/tickets/domain/errors/ticket-already-voided.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Errores de dominio: declara `TicketAlreadyVoidedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [void-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-spec-ts), [void-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-ts)

#### Clase `TicketAlreadyVoidedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-empty-error-ts"></a>

### ticket-empty.error.ts

- **Ruta:** [ticket-empty.error.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/errors/ticket-empty.error.ts) (`comercial-jhoel-api/src/modules/tickets/domain/errors/ticket-empty.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Errores de dominio: declara `TicketEmptyError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-spec-ts), [create-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-ts), [typeorm-ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts)

#### Clase `TicketEmptyError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-not-found-error-ts"></a>

### ticket-not-found.error.ts

- **Ruta:** [ticket-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/errors/ticket-not-found.error.ts) (`comercial-jhoel-api/src/modules/tickets/domain/errors/ticket-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Errores de dominio: declara `TicketNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-ticket-by-id.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-by-id-use-case-ts), [get-ticket-pdf.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-pdf-use-case-ts), [void-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-spec-ts), [void-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-ts)

#### Clase `TicketNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-product-inactive-error-ts"></a>

### ticket-product-inactive.error.ts

- **Ruta:** [ticket-product-inactive.error.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/errors/ticket-product-inactive.error.ts) (`comercial-jhoel-api/src/modules/tickets/domain/errors/ticket-product-inactive.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Errores de dominio: declara `TicketProductInactiveError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts)

#### Clase `TicketProductInactiveError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-product-not-found-error-ts"></a>

### ticket-product-not-found.error.ts

- **Ruta:** [ticket-product-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/errors/ticket-product-not-found.error.ts) (`comercial-jhoel-api/src/modules/tickets/domain/errors/ticket-product-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Errores de dominio: declara `TicketProductNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [typeorm-ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts)

#### Clase `TicketProductNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `productId: string`
<a id="f-comercial-jhoel-api-src-modules-tickets-domain-repositories-ticket-repository-ts"></a>

### ticket.repository.ts

- **Ruta:** [ticket.repository.ts](../../../../comercial-jhoel-api/src/modules/tickets/domain/repositories/ticket.repository.ts) (`comercial-jhoel-api/src/modules/tickets/domain/repositories/ticket.repository.ts`, 52 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateTicketItemData`, `CreateTicketData`, `FindTicketsOptions`, `PaginatedResult`, `TicketRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ticket.entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-entities-ticket-entity-ts)
- **Consumidores:** [create-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-spec-ts), [create-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-ts), [get-ticket-by-id.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-by-id-use-case-ts), [get-ticket-pdf.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-pdf-use-case-ts), [list-tickets.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-list-tickets-use-case-ts), [void-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-spec-ts), [void-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-ts), [typeorm-ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts), [list-tickets.query.dto.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-dtos-list-tickets-query-dto-ts), [tickets.module.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts)

**Interfaces, tipos y enums:**

- `interface CreateTicketItemData` (L5): sin documentación — miembros: `productId`, `quantity`, `observation`, `unitPrice`
- `interface CreateTicketData` (L13): sin documentación — miembros: `userId`, `clientId`, `clientName`, `items`
- `interface FindTicketsOptions` (L23): sin documentación — miembros: `userId`, `startDate`, `endDate`, `search`, `status`, `page`, `limit`
- `interface PaginatedResult` (L36): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface TicketRepository` (L43): sin documentación — miembros: `createTicket`, `findAll`, `findById`, `voidTicket`
- `type TicketStatusFilter` (L21) = `'ACTIVE' \| 'VOIDED'`

**Constantes exportadas:**

- `TICKET_REPOSITORY` (L3) = `Symbol('TICKET_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-tickets-infrastructure-pdf-ticket-pdf-builder-ts"></a>

### ticket-pdf.builder.ts

- **Ruta:** [ticket-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/tickets/infrastructure/pdf/ticket-pdf.builder.ts) (`comercial-jhoel-api/src/modules/tickets/infrastructure/pdf/ticket-pdf.builder.ts`, 155 líneas)
- **Tipo:** Builder · **Capa:** Infraestructura · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Reconstructs a Ticket receipt purely from already-persisted data (`TicketOutput` + company settings) — never re-runs `create_ticket` or touches inventory.
- **Depende de (archivos del proyecto):** [pdf-helpers.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-ts)
- **Paquetes externos:** `pdfkit`
- **Consumidores:** [get-ticket-pdf.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-pdf-use-case-ts)

**Interfaces, tipos y enums:**

- `interface TicketPdfItem` (L10): sin documentación — miembros: `productName`, `quantity`, `unitPrice`, `total`, `observation`
- `interface TicketPdfOptions` (L18): sin documentación — miembros: `company`, `ticketNumber`, `createdAt`, `username`, `clientName`, `items`, `total`
#### Función `buildTicketPdf` (L52–154)

- **Tipo:** función exportada
- **Firma:** `buildTicketPdf(options: TicketPdfOptions): Promise<Buffer>` — [ticket-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/tickets/infrastructure/pdf/ticket-pdf.builder.ts#L52)
- **Propósito / descripción:** Reconstructs a Ticket receipt purely from already-persisted data (`TicketOutput` + company settings) — never re-runs `create_ticket` or touches inventory. Compact, stacked single-column layout for an 80mm thermal printer — genuinely different from Sale/Purchase's A4 table layout and Cotización's professional layout, per the approved plan.
- **Dependencias:** `options.items.filter`, `new PDFDocument`, `doc.on`, `chunks.push`, `new Promise`, `resolve`, `Buffer.concat`, `drawCompanyLetterhead`, `doc.moveDown`, `drawDivider`, `doc.fontSize(12).fillColor('#0f172a').text`, `doc.fontSize(12).fillColor`, `doc.fontSize`, `doc.fontSize(8).fillColor`, `doc.text`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-ticket-pdf.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-pdf-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-detail-orm-entity-ts"></a>

### ticket-detail.orm-entity.ts

- **Ruta:** [ticket-detail.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/ticket-detail.orm-entity.ts) (`comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/ticket-detail.orm-entity.ts`, 54 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `TicketDetailOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [ticket.orm-entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [ticket.orm-entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-orm-entity-ts), [tickets.module.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts)

#### Clase `TicketDetailOrmEntity` (L5–53)

- **Decoradores:** `@Entity('ticket_details')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column ticketId: string`, `@ManyToOne ticket: TicketOrmEntity`, `@Column productId: string`, `@Column productName: string`, `@Column presentationName: string \| null`, `@Column quantity: number`, `@Column unitPrice: number`, `@Column total: number`, `@Column observation: string \| null`
<a id="f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-mapper-ts"></a>

### ticket.mapper.ts

- **Ruta:** [ticket.mapper.ts](../../../../comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/ticket.mapper.ts) (`comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/ticket.mapper.ts`, 43 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Mapper: declara `TicketMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ticket.entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-entities-ticket-entity-ts), [ticket-detail.entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-entities-ticket-detail-entity-ts), [ticket.orm-entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-orm-entity-ts)
- **Consumidores:** [typeorm-ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts)

#### Clase `TicketMapper` (L5–42)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 7–41 | `orm: TicketOrmEntity` | `Ticket` |

##### `TicketMapper.toDomain`

- **Firma:** `toDomain(orm: TicketOrmEntity): Ticket` — [ticket.mapper.ts](../../../../comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/ticket.mapper.ts#L7) (L7–41)
- **Propósito / descripción:** `orm.items` is `undefined` whenever the query didn't join `ticket_details` (the list view never does) — mapped to `[]`.
- **Dependencias (llamadas en su cuerpo):** `Ticket.create`, `(orm.items ?? []).map`, `TicketDetail.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-orm-entity-ts"></a>

### ticket.orm-entity.ts

- **Ruta:** [ticket.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/ticket.orm-entity.ts) (`comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/ticket.orm-entity.ts`, 105 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `TicketOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [client.orm-entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-orm-entity-ts), [decimal.transformer.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-decimal-transformer-ts), [ticket-detail.orm-entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-detail-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [ticket-detail.orm-entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-detail-orm-entity-ts), [ticket.mapper.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-mapper-ts), [typeorm-ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts), [tickets.module.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts)

#### Clase `TicketOrmEntity` (L16–104)

- **Decoradores:** `@Entity('tickets')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column ticketNumber: string`, `@Column clientId: string \| null`, `@ManyToOne client: ClientOrmEntity \| null`, `@Column clientName: string \| null`, `@Column userId: string`, `@ManyToOne user: UserOrmEntity`, `@Column subtotal: number`, `@Column discount: number`, `@Column total: number`, `@Column isVoided: boolean`, `@Column voidedAt: Date \| null`, `@Column voidedBy: string \| null`, `@ManyToOne voidedByUser: UserOrmEntity \| null`, `@Column voidReason: string \| null`, `@OneToMany items: TicketDetailOrmEntity[]`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts"></a>

### typeorm-ticket.repository.ts

- **Ruta:** [typeorm-ticket.repository.ts](../../../../comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/typeorm-ticket.repository.ts) (`comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/typeorm-ticket.repository.ts`, 170 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmTicketRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ticket.entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-entities-ticket-entity-ts), [ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-repositories-ticket-repository-ts), [ticket-empty.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-empty-error-ts), [invalid-client.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-client-error-ts), [ticket-product-not-found.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-product-not-found-error-ts), [ticket-product-inactive.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-ticket-product-inactive-error-ts), [invalid-ticket-quantity.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-ticket-quantity-error-ts), [invalid-ticket-price.error.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-errors-invalid-ticket-price-error-ts), [ticket.orm-entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-orm-entity-ts), [ticket.mapper.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [tickets.module.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts)

#### Clase `TypeOrmTicketRepository` (L20–169)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements TicketRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(TicketOrmEntity) repository: Repository<TicketOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `createTicket` | método public async | 27–60 | `data: CreateTicketData` | `Promise<Ticket>` |
| `findAll` | método public async | 62–107 | `options: FindTicketsOptions` | `Promise<PaginatedResult<Ticket>>` |
| `findById` | método public async | 109–115 | `id: string` | `Promise<Ticket \| null>` |
| `voidTicket` | método public async | 117–138 | `id: string`, `voidedBy: string`, `reason: string` | `Promise<Ticket>` |
| `translateTicketError` | método private | 141–168 | `error: unknown` | `unknown` |

##### `TypeOrmTicketRepository.createTicket`

- **Firma:** `createTicket(data: CreateTicketData): Promise<Ticket>` — [typeorm-ticket.repository.ts](../../../../comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/typeorm-ticket.repository.ts#L27) (L27–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `JSON.stringify`, `data.items.map`, `this.repository.manager.query`, `this.translateTicketError`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Llama funciones SQL: `create_ticket`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `this.translateTicketError(error)`, `new InternalServerErrorException( 'No se pudo recuperar el ticket recién creado.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTicketRepository.findAll`

- **Firma:** `findAll(options: FindTicketsOptions): Promise<PaginatedResult<Ticket>>` — [typeorm-ticket.repository.ts](../../../../comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/typeorm-ticket.repository.ts#L62) (L62–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('ticket').leftJoinAndSelect`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.orderBy`, `qb.skip((options.page - 1) * options.limit).take`, `qb.skip`, `qb.getManyAndCount`, `orms.map`, `TicketMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTicketRepository.findById`

- **Firma:** `findById(id: string): Promise<Ticket \| null>` — [typeorm-ticket.repository.ts](../../../../comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/typeorm-ticket.repository.ts#L109) (L109–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `TicketMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmTicketRepository.voidTicket`

- **Firma:** `voidTicket(id: string, voidedBy: string, reason: string): Promise<Ticket>` — [typeorm-ticket.repository.ts](../../../../comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/typeorm-ticket.repository.ts#L117) (L117–138)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `new Date`, `this.findById`, `new InternalServerErrorException`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `new InternalServerErrorException( 'No se pudo recuperar el ticket recién anulado.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmTicketRepository.translateTicketError`

- **Firma:** `translateTicketError(error: unknown): unknown` — [typeorm-ticket.repository.ts](../../../../comercial-jhoel-api/src/modules/tickets/infrastructure/persistence/typeorm-ticket.repository.ts#L141) (L141–168)
- **Propósito / descripción:** Same `RAISE EXCEPTION '&lt;CODE&gt;:&lt;id&gt;'` → domain-error translation as `TypeOrmPurchaseRepository.translatePurchaseError` — see that method's own doc comment for why this parsing exists.
- **Dependencias (llamadas en su cuerpo):** `message.split`, `new TicketEmptyError`, `new InvalidClientError`, `new TicketProductNotFoundError`, `new TicketProductInactiveError`, `new InvalidTicketQuantityError`, `new InvalidTicketPriceError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts"></a>

### tickets.controller.ts

- **Ruta:** [tickets.controller.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/controllers/tickets.controller.ts) (`comercial-jhoel-api/src/modules/tickets/presentation/controllers/tickets.controller.ts`, 132 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** No class-level `@Roles(...)` — same policy as Sales/Purchases: creating a Ticket is an operational action for whoever runs the register, not an admin-only one.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-ts), [list-tickets.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-list-tickets-use-case-ts), [get-ticket-by-id.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-by-id-use-case-ts), [void-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-ts), [get-ticket-pdf.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-pdf-use-case-ts), [create-ticket.request.dto.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-dtos-create-ticket-request-dto-ts), [list-tickets.query.dto.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-dtos-list-tickets-query-dto-ts), [void-ticket.request.dto.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-dtos-void-ticket-request-dto-ts), [ticket.response.dto.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-dtos-ticket-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [tickets.module.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts)

#### Clase `TicketsController` (L44–131)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('tickets')`
- **Propósito:** No class-level `@Roles(...)` — same policy as Sales/Purchases: creating a Ticket is an operational action for whoever runs the register, not an admin-only one. `ListTicketsUseCase`/`GetTicketByIdUseCase` still restrict *which* tickets a non-admin can see (only their own), enforced in the use case. `void` is the one admin-gated route — correcting an already-created ticket is a management action, same policy as `BankDepositsController`'s own void route.
- **Dependencias inyectadas (constructor):** `createTicketUseCase: CreateTicketUseCase`, `listTicketsUseCase: ListTicketsUseCase`, `getTicketByIdUseCase: GetTicketByIdUseCase`, `voidTicketUseCase: VoidTicketUseCase`, `getTicketPdfUseCase: GetTicketPdfUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 55–67 | `dto: CreateTicketRequestDto`, `userId: string` | `Promise<TicketResponseDto>` |
| `findAll` | método public | 69–79 | `query: ListTicketsQueryDto`, `user: RequestUser` | `Promise<PaginatedTicketsResponseDto>` |
| `getPdf` | método public async | 87–103 | `id: string`, `user: RequestUser`, `res: Response` | `Promise<void>` |
| `voidTicket` | método public | 106–119 | `id: string`, `dto: VoidTicketRequestDto`, `userId: string` | `Promise<TicketResponseDto>` |
| `findOne` | método public | 121–130 | `id: string`, `user: RequestUser` | `Promise<TicketResponseDto>` |

##### `TicketsController.create`

- **Firma:** `create(dto: CreateTicketRequestDto, userId: string): Promise<TicketResponseDto>` — [tickets.controller.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/controllers/tickets.controller.ts#L55) (L55–67)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createTicketUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TicketsController.findAll`

- **Firma:** `findAll(query: ListTicketsQueryDto, user: RequestUser): Promise<PaginatedTicketsResponseDto>` — [tickets.controller.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/controllers/tickets.controller.ts#L69) (L69–79)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listTicketsUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TicketsController.getPdf`

- **Firma:** `getPdf(id: string, user: RequestUser, res: Response): Promise<void>` — [tickets.controller.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/controllers/tickets.controller.ts#L87) (L87–103)
- **Decoradores:** `@Get(':id/pdf')`
- **Propósito / descripción:** Reconstructs the ticket's receipt PDF purely from already-persisted data — never re-runs `create_ticket`. Declared before `:id` so it isn't swallowed by that route's `ParseUUIDPipe` matching on `id`, matching Sales'/Purchases' own route-ordering discipline.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.getTicketPdfUseCase.execute`, `ADMIN_ROLES.includes`, `res.set`, `id.slice`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TicketsController.voidTicket`

- **Firma:** `voidTicket(id: string, dto: VoidTicketRequestDto, userId: string): Promise<TicketResponseDto>` — [tickets.controller.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/controllers/tickets.controller.ts#L106) (L106–119)
- **Decoradores:** `@Post(':id/void')` `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')`
- **Propósito / descripción:** Anular — never a physical delete/edit, see `VoidTicketUseCase`.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.voidTicketUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TicketsController.findOne`

- **Firma:** `findOne(id: string, user: RequestUser): Promise<TicketResponseDto>` — [tickets.controller.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/controllers/tickets.controller.ts#L121) (L121–130)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getTicketByIdUseCase.execute`, `ADMIN_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-tickets-presentation-dtos-create-ticket-request-dto-ts"></a>

### create-ticket.request.dto.ts

- **Ruta:** [create-ticket.request.dto.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/dtos/create-ticket.request.dto.ts) (`comercial-jhoel-api/src/modules/tickets/presentation/dtos/create-ticket.request.dto.ts`, 69 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** DTO de entrada: declara `CreateTicketItemRequestDto`, `CreateTicketRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts)

#### Clase `CreateTicketItemRequestDto` (L15–40)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `CreateTicketRequestDto` (L42–68)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-tickets-presentation-dtos-list-tickets-query-dto-ts"></a>

### list-tickets.query.dto.ts

- **Ruta:** [list-tickets.query.dto.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/dtos/list-tickets.query.dto.ts) (`comercial-jhoel-api/src/modules/tickets/presentation/dtos/list-tickets.query.dto.ts`, 48 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** DTO de consulta: declara `ListTicketsQueryDto`, `STATUS_FILTERS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-repositories-ticket-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts)

#### Clase `ListTicketsQueryDto` (L16–47)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-tickets-presentation-dtos-ticket-response-dto-ts"></a>

### ticket.response.dto.ts

- **Ruta:** [ticket.response.dto.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/dtos/ticket.response.dto.ts) (`comercial-jhoel-api/src/modules/tickets/presentation/dtos/ticket.response.dto.ts`, 50 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** DTO de respuesta: declara `TicketItemResponseDto`, `TicketResponseDto`, `TicketSummaryResponseDto`, `PaginatedTicketsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts)

#### Clase `TicketItemResponseDto` (L1–10)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `TicketResponseDto` (L12–30)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `TicketSummaryResponseDto` (L32–42)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PaginatedTicketsResponseDto` (L44–49)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-tickets-presentation-dtos-void-ticket-request-dto-ts"></a>

### void-ticket.request.dto.ts

- **Ruta:** [void-ticket.request.dto.ts](../../../../comercial-jhoel-api/src/modules/tickets/presentation/dtos/void-ticket.request.dto.ts) (`comercial-jhoel-api/src/modules/tickets/presentation/dtos/void-ticket.request.dto.ts`, 11 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Mirrors `VoidBankDepositOperationRequestDto`'s own mandatory-reason shape — this module's own copy rather than a cross-module import.
- **Paquetes externos:** `class-validator`
- **Consumidores:** [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts)

#### Clase `VoidTicketRequestDto` (L4–10)

- **Propósito:** Mirrors `VoidBankDepositOperationRequestDto`'s own mandatory-reason shape — this module's own copy rather than a cross-module import.
<a id="f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts"></a>

### tickets.module.ts

- **Ruta:** [tickets.module.ts](../../../../comercial-jhoel-api/src/modules/tickets/tickets.module.ts) (`comercial-jhoel-api/src/modules/tickets/tickets.module.ts`, 33 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `tickets`
- **Responsabilidad:** Módulo: declara `TicketsModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ticket.orm-entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-orm-entity-ts), [ticket-detail.orm-entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-detail-orm-entity-ts), [typeorm-ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-typeorm-ticket-repository-ts), [ticket.repository.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-domain-repositories-ticket-repository-ts), [create-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-ts), [list-tickets.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-list-tickets-use-case-ts), [get-ticket-by-id.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-by-id-use-case-ts), [void-ticket.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-void-ticket-use-case-ts), [get-ticket-pdf.use-case.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-get-ticket-pdf-use-case-ts), [tickets.controller.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-presentation-controllers-tickets-controller-ts), [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts), [company-settings.module.ts](company-settings.md#f-comercial-jhoel-api-src-modules-company-settings-company-settings-module-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `TicketsModule` (L16–32)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([TicketOrmEntity, TicketDetailOrmEntity]), ClientsModule, CompanySettingsModule, ], controllers: [TicketsController`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
