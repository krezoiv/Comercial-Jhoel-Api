# Módulo backend `clients`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/clients` | [clients.controller.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts#L47) `ClientsController.create` | [CreateClientUseCase](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-create-client-use-case-ts) | `ClientRepository`.findByActiveName/create | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ClientService.createClient` |
| `GET /api/clients` | [clients.controller.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts#L58) `ClientsController.findAll` | [ListClientsUseCase](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-list-clients-use-case-ts) | `ClientRepository`.findAll | UseGuards(JwtAuthGuard) | `ClientService.getClients` |
| `GET /api/clients/:id` | [clients.controller.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts#L63) `ClientsController.findOne` | [GetClientByIdUseCase](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-get-client-by-id-use-case-ts) | `ClientRepository`.findById | UseGuards(JwtAuthGuard) | `ClientService.getClientById` |
| `PATCH /api/clients/:id` | [clients.controller.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts#L68) `ClientsController.update` | [UpdateClientUseCase](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-update-client-use-case-ts) | `ClientRepository`.findById/findByActiveName/update | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ClientService.updateClient` |
| `DELETE /api/clients/:id` | [clients.controller.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts#L79) `ClientsController.deactivate` | [DeactivateClientUseCase](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-deactivate-client-use-case-ts) | `ClientRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ClientService.deleteClient` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [client-output.ts](#f-comercial-jhoel-api-src-modules-clients-application-dtos-client-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toClientOutput`, `ClientOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [create-client.use-case.ts](#f-comercial-jhoel-api-src-modules-clients-application-use-cases-create-client-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateClientUseCase`, `CreateClientInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-client.use-case.ts](#f-comercial-jhoel-api-src-modules-clients-application-use-cases-deactivate-client-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — DELETE /clients/:id never removes the row, preserving future Ventas/historial integrity. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-client-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-clients-application-use-cases-get-client-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetClientByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-clients.use-case.ts](#f-comercial-jhoel-api-src-modules-clients-application-use-cases-list-clients-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListClientsUseCase`, `ListClientsInput` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-client.use-case.ts](#f-comercial-jhoel-api-src-modules-clients-application-use-cases-update-client-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateClientUseCase`, `UpdateClientInput` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [clients.module.ts](#f-comercial-jhoel-api-src-modules-clients-clients-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `ClientsModule` (sin comentario de documentación en el código). | 9 internas; ext.: @nestjs/common, @nestjs/typeorm | 9 | Media (9 consumidores) |
| [client.entity.ts](#f-comercial-jhoel-api-src-modules-clients-domain-entities-client-entity-ts) | .ts | Entidad de dominio | Dominio | Entidad de dominio: declara `Client`, `ClientProps` (sin comentario de documentación en el código). | 0 internas | 9 | Media (9 consumidores) |
| [client-name-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-clients-domain-errors-client-name-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `ClientNameAlreadyExistsError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [client-not-found.error.ts](#f-comercial-jhoel-api-src-modules-clients-domain-errors-client-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `ClientNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [client.repository.ts](#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `CreateClientData`, `UpdateClientData`, `FindClientsOptions`, `ClientRepository`, `CLIENT_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 31 | Alta (31 consumidores) |
| [client.mapper.ts](#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `ClientMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [client.orm-entity.ts](#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `ClientOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 8 | Media (8 consumidores) |
| [typeorm-client.repository.ts](#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-typeorm-client-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmClientRepository` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [clients.controller.ts](#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts) | .ts | Controlador | Presentación | Create/update/deactivate are admin-only — same policy as CategoriesController/ AccountTypesController. | 13 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [client.response.dto.ts](#f-comercial-jhoel-api-src-modules-clients-presentation-dtos-client-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `ClientResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [create-client.request.dto.ts](#f-comercial-jhoel-api-src-modules-clients-presentation-dtos-create-client-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateClientRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator, class-transformer | 1 | Baja (1 consumidores) |
| [list-clients.query.dto.ts](#f-comercial-jhoel-api-src-modules-clients-presentation-dtos-list-clients-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListClientsQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [update-client.request.dto.ts](#f-comercial-jhoel-api-src-modules-clients-presentation-dtos-update-client-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateClientRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator, class-transformer | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-clients-application-dtos-client-output-ts"></a>

### client-output.ts

- **Ruta:** [client-output.ts](../../../../comercial-jhoel-api/src/modules/clients/application/dtos/client-output.ts) (`comercial-jhoel-api/src/modules/clients/application/dtos/client-output.ts`, 28 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** DTO de salida (aplicación): declara `toClientOutput`, `ClientOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [client.entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-entities-client-entity-ts)
- **Consumidores:** [create-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-create-client-use-case-ts), [get-client-by-id.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-get-client-by-id-use-case-ts), [list-clients.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-list-clients-use-case-ts), [update-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-update-client-use-case-ts)

**Interfaces, tipos y enums:**

- `interface ClientOutput` (L3): sin documentación — miembros: `id`, `name`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
#### Función `toClientOutput` (L15–27)

- **Tipo:** función exportada
- **Firma:** `toClientOutput(client: Client): ClientOutput` — [client-output.ts](../../../../comercial-jhoel-api/src/modules/clients/application/dtos/client-output.ts#L15)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-create-client-use-case-ts), [get-client-by-id.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-get-client-by-id-use-case-ts), [update-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-update-client-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-clients-application-use-cases-create-client-use-case-ts"></a>

### create-client.use-case.ts

- **Ruta:** [create-client.use-case.ts](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/create-client.use-case.ts) (`comercial-jhoel-api/src/modules/clients/application/use-cases/create-client.use-case.ts`, 34 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Caso de uso: declara `CreateClientUseCase`, `CreateClientInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [client-name-already-exists.error.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-errors-client-name-already-exists-error-ts), [client-output.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-dtos-client-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts), [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateClientInput` (L7): sin documentación — miembros: `name`, `createdBy`

#### Clase `CreateClientUseCase` (L12–33)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–32 | `input: CreateClientInput` | `Promise<ClientOutput>` |

##### `CreateClientUseCase.execute`

- **Firma:** `execute(input: CreateClientInput): Promise<ClientOutput>` — [create-client.use-case.ts](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/create-client.use-case.ts#L19) (L19–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `input.name.trim().replace`, `input.name.trim`, `this.clientRepository.findByActiveName`, `new ClientNameAlreadyExistsError`, `this.clientRepository.create`, `toClientOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ClientNameAlreadyExistsError(name)`
- **Consumidores:** [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-clients-application-use-cases-deactivate-client-use-case-ts"></a>

### deactivate-client.use-case.ts

- **Ruta:** [deactivate-client.use-case.ts](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/deactivate-client.use-case.ts) (`comercial-jhoel-api/src/modules/clients/application/use-cases/deactivate-client.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Soft delete only — DELETE /clients/:id never removes the row, preserving future Ventas/historial integrity.
- **Depende de (archivos del proyecto):** [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [client-not-found.error.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-errors-client-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts), [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

#### Clase `DeactivateClientUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — DELETE /clients/:id never removes the row, preserving future Ventas/historial integrity.
- **Dependencias inyectadas (constructor):** `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<void>` |

##### `DeactivateClientUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-client.use-case.ts](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/deactivate-client.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new ClientNotFoundError`, `this.clientRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ClientNotFoundError(id)`
- **Consumidores:** [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-clients-application-use-cases-get-client-by-id-use-case-ts"></a>

### get-client-by-id.use-case.ts

- **Ruta:** [get-client-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/get-client-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/clients/application/use-cases/get-client-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Caso de uso: declara `GetClientByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [client-not-found.error.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-errors-client-not-found-error-ts), [client-output.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-dtos-client-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts), [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

#### Clase `GetClientByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<ClientOutput>` |

##### `GetClientByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<ClientOutput>` — [get-client-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/get-client-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new ClientNotFoundError`, `toClientOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ClientNotFoundError(id)`
- **Consumidores:** [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-clients-application-use-cases-list-clients-use-case-ts"></a>

### list-clients.use-case.ts

- **Ruta:** [list-clients.use-case.ts](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/list-clients.use-case.ts) (`comercial-jhoel-api/src/modules/clients/application/use-cases/list-clients.use-case.ts`, 26 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Caso de uso: declara `ListClientsUseCase`, `ListClientsInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [client-output.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-dtos-client-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts), [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListClientsInput` (L6): sin documentación — miembros: `includeInactive`, `search`

#### Clase `ListClientsUseCase` (L11–25)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 18–24 | `input?: ListClientsInput` | `Promise<ClientOutput[]>` |

##### `ListClientsUseCase.execute`

- **Firma:** `execute(input?: ListClientsInput): Promise<ClientOutput[]>` — [list-clients.use-case.ts](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/list-clients.use-case.ts#L18) (L18–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findAll`, `input.search?.trim`, `clients.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-clients-application-use-cases-update-client-use-case-ts"></a>

### update-client.use-case.ts

- **Ruta:** [update-client.use-case.ts](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/update-client.use-case.ts) (`comercial-jhoel-api/src/modules/clients/application/use-cases/update-client.use-case.ts`, 42 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Caso de uso: declara `UpdateClientUseCase`, `UpdateClientInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [client-not-found.error.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-errors-client-not-found-error-ts), [client-name-already-exists.error.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-errors-client-name-already-exists-error-ts), [client-output.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-dtos-client-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts), [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateClientInput` (L8): sin documentación — miembros: `name`, `updatedBy`

#### Clase `UpdateClientUseCase` (L13–41)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 20–40 | `id: string`, `input: UpdateClientInput` | `Promise<ClientOutput>` |

##### `UpdateClientUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateClientInput): Promise<ClientOutput>` — [update-client.use-case.ts](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/update-client.use-case.ts#L20) (L20–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientRepository.findById`, `new ClientNotFoundError`, `input.name?.trim().replace`, `input.name?.trim`, `name.toLowerCase`, `client.name.toLowerCase`, `this.clientRepository.findByActiveName`, `new ClientNameAlreadyExistsError`, `this.clientRepository.update`, `toClientOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.clientRepository.update`
- **Errores que lanza:** `new ClientNotFoundError(id)`, `new ClientNameAlreadyExistsError(name)`
- **Consumidores:** [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-clients-clients-module-ts"></a>

### clients.module.ts

- **Ruta:** [clients.module.ts](../../../../comercial-jhoel-api/src/modules/clients/clients.module.ts) (`comercial-jhoel-api/src/modules/clients/clients.module.ts`, 32 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Módulo: declara `ClientsModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [client.orm-entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-orm-entity-ts), [typeorm-client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-typeorm-client-repository-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [create-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-create-client-use-case-ts), [list-clients.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-list-clients-use-case-ts), [get-client-by-id.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-get-client-by-id-use-case-ts), [update-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-update-client-use-case-ts), [deactivate-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-deactivate-client-use-case-ts), [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts), [assets.module.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-assets-module-ts), [bank-deposits.module.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-bank-deposits-module-ts), [phones.module.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-phones-module-ts), [quotations.module.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-quotations-module-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts), [tickets.module.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-tickets-module-ts)

#### Clase `ClientsModule` (L13–31)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([ClientOrmEntity])], controllers: [ClientsController], providers: [ { provide: CLIENT_REPOSITORY, useClass: TypeOrmC`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-clients-domain-entities-client-entity-ts"></a>

### client.entity.ts

- **Ruta:** [client.entity.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/entities/client.entity.ts) (`comercial-jhoel-api/src/modules/clients/domain/entities/client.entity.ts`, 56 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Entidad de dominio: declara `Client`, `ClientProps` (sin comentario de documentación en el código).
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [client-output.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-dtos-client-output-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [client.mapper.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-mapper-ts), [typeorm-client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-typeorm-client-repository-ts), [register-phone-sale.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-spec-ts), [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [configure-sale-pricing.use-case.spec.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-spec-ts), [create-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-spec-ts)

**Interfaces, tipos y enums:**

- `interface ClientProps` (L1): sin documentación — miembros: `id`, `name`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`

#### Clase `Client` (L13–55)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `props: ClientProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 16–18 | `props: ClientProps` | `Client` |
| `id` | getter public | 20–22 | — | `string` |
| `name` | getter public | 24–26 | — | `string` |
| `isActive` | getter public | 28–30 | — | `boolean` |
| `createdAt` | getter public | 32–34 | — | `Date` |
| `updatedAt` | getter public | 36–38 | — | `Date` |
| `createdBy` | getter public | 40–42 | — | `string` |
| `createdByUsername` | getter public | 44–46 | — | `string` |
| `updatedBy` | getter public | 48–50 | — | `string \| null` |
| `updatedByUsername` | getter public | 52–54 | — | `string \| null` |

##### `Client.create`

- **Firma:** `create(props: ClientProps): Client` — [client.entity.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/entities/client.entity.ts#L16) (L16–18)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Client`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [client.mapper.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-mapper-ts), [typeorm-client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-typeorm-client-repository-ts), [register-phone-sale.use-case.spec.ts](phones.md#f-comercial-jhoel-api-src-modules-phones-application-use-cases-register-phone-sale-use-case-spec-ts), [create-quotation.use-case.spec.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-application-use-cases-create-quotation-use-case-spec-ts), [configure-sale-pricing.use-case.spec.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-application-use-cases-configure-sale-pricing-use-case-spec-ts), [create-ticket.use-case.spec.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-application-use-cases-create-ticket-use-case-spec-ts)

##### `Client.id`

- **Firma:** `id(): string` — [client.entity.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/entities/client.entity.ts#L20) (L20–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Client.name`

- **Firma:** `name(): string` — [client.entity.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/entities/client.entity.ts#L24) (L24–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Client.isActive`

- **Firma:** `isActive(): boolean` — [client.entity.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/entities/client.entity.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Client.createdAt`

- **Firma:** `createdAt(): Date` — [client.entity.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/entities/client.entity.ts#L32) (L32–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Client.updatedAt`

- **Firma:** `updatedAt(): Date` — [client.entity.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/entities/client.entity.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Client.createdBy`

- **Firma:** `createdBy(): string` — [client.entity.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/entities/client.entity.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Client.createdByUsername`

- **Firma:** `createdByUsername(): string` — [client.entity.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/entities/client.entity.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Client.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [client.entity.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/entities/client.entity.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `Client.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [client.entity.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/entities/client.entity.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-clients-domain-errors-client-name-already-exists-error-ts"></a>

### client-name-already-exists.error.ts

- **Ruta:** [client-name-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/errors/client-name-already-exists.error.ts) (`comercial-jhoel-api/src/modules/clients/domain/errors/client-name-already-exists.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Errores de dominio: declara `ClientNameAlreadyExistsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-create-client-use-case-ts), [update-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-update-client-use-case-ts), [typeorm-client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-typeorm-client-repository-ts)

#### Clase `ClientNameAlreadyExistsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `name: string`
<a id="f-comercial-jhoel-api-src-modules-clients-domain-errors-client-not-found-error-ts"></a>

### client-not-found.error.ts

- **Ruta:** [client-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/errors/client-not-found.error.ts) (`comercial-jhoel-api/src/modules/clients/domain/errors/client-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Errores de dominio: declara `ClientNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-deactivate-client-use-case-ts), [get-client-by-id.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-get-client-by-id-use-case-ts), [update-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-update-client-use-case-ts)

#### Clase `ClientNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts"></a>

### client.repository.ts

- **Ruta:** [client.repository.ts](../../../../comercial-jhoel-api/src/modules/clients/domain/repositories/client.repository.ts) (`comercial-jhoel-api/src/modules/clients/domain/repositories/client.repository.ts`, 30 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `CreateClientData`, `UpdateClientData`, `FindClientsOptions`, `ClientRepository`, `CLIENT_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [client.entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-entities-client-entity-ts)
- **Consumidores:** [create-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-create-account-receivable-use-case-ts), [get-account-receivable-current-balance.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-current-balance-use-case-ts), [get-account-receivable-statement.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-get-account-receivable-statement-use-case-ts), [register-account-receivable-charge.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-charge-use-case-ts), [register-account-receivable-payment.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-register-account-receivable-payment-use-case-ts), [update-account-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-update-account-receivable-use-case-ts), [create-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-create-asset-use-case-ts), [get-asset-current-balance.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-current-balance-use-case-ts), [get-asset-statement.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-get-asset-statement-use-case-ts), [register-asset-charge.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-charge-use-case-ts), [register-asset-payment.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-register-asset-payment-use-case-ts), [update-asset.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-update-asset-use-case-ts), [register-bank-deposit-operation.use-case.spec.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-spec-ts), [register-bank-deposit-operation.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-register-bank-deposit-operation-use-case-ts), [create-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-create-client-use-case-ts) y 16 más

**Interfaces, tipos y enums:**

- `interface CreateClientData` (L5): sin documentación — miembros: `name`, `createdBy`
- `interface UpdateClientData` (L10): sin documentación — miembros: `name`, `updatedBy`
- `interface FindClientsOptions` (L15): sin documentación — miembros: `activeOnly`, `search`
- `interface ClientRepository` (L21): sin documentación — miembros: `findAll`, `findById`, `findByActiveName`, `create`, `update`, `deactivate`

**Constantes exportadas:**

- `CLIENT_REPOSITORY` (L3) = `Symbol('CLIENT_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-mapper-ts"></a>

### client.mapper.ts

- **Ruta:** [client.mapper.ts](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/client.mapper.ts) (`comercial-jhoel-api/src/modules/clients/infrastructure/persistence/client.mapper.ts`, 19 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Mapper: declara `ClientMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [client.entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-entities-client-entity-ts), [client.orm-entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-orm-entity-ts)
- **Consumidores:** [typeorm-client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-typeorm-client-repository-ts)

#### Clase `ClientMapper` (L4–18)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–17 | `orm: ClientOrmEntity` | `Client` |

##### `ClientMapper.toDomain`

- **Firma:** `toDomain(orm: ClientOrmEntity): Client` — [client.mapper.ts](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/client.mapper.ts#L5) (L5–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Client.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-typeorm-client-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-orm-entity-ts"></a>

### client.orm-entity.ts

- **Ruta:** [client.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/client.orm-entity.ts) (`comercial-jhoel-api/src/modules/clients/infrastructure/persistence/client.orm-entity.ts`, 47 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `ClientOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [account-receivable.orm-entity.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-infrastructure-persistence-account-receivable-orm-entity-ts), [asset.orm-entity.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-infrastructure-persistence-asset-orm-entity-ts), [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts), [client.mapper.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-mapper-ts), [typeorm-client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-typeorm-client-repository-ts), [quotation.orm-entity.ts](quotations.md#f-comercial-jhoel-api-src-modules-quotations-infrastructure-persistence-quotation-orm-entity-ts), [sale.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts), [ticket.orm-entity.ts](tickets.md#f-comercial-jhoel-api-src-modules-tickets-infrastructure-persistence-ticket-orm-entity-ts)

#### Clase `ClientOrmEntity` (L16–46)

- **Decoradores:** `@Entity('clients')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column name: string`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-typeorm-client-repository-ts"></a>

### typeorm-client.repository.ts

- **Ruta:** [typeorm-client.repository.ts](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts) (`comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts`, 98 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmClientRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [client.entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-entities-client-entity-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [client-name-already-exists.error.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-errors-client-name-already-exists-error-ts), [client.orm-entity.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-orm-entity-ts), [client.mapper.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-infrastructure-persistence-client-mapper-ts), [apply-search-terms.util.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-persistence-apply-search-terms-util-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts)

#### Clase `TypeOrmClientRepository` (L16–97)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements ClientRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(ClientOrmEntity) repository: Repository<ClientOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 23–38 | `options: FindClientsOptions` | `Promise<Client[]>` |
| `findById` | método public async | 40–43 | `id: string` | `Promise<Client \| null>` |
| `findByActiveName` | método public async | 45–52 | `name: string` | `Promise<Client \| null>` |
| `create` | método public async | 54–68 | `data: CreateClientData` | `Promise<Client>` |
| `update` | método public async | 70–79 | `id: string`, `data: UpdateClientData` | `Promise<Client>` |
| `deactivate` | método public async | 81–83 | `id: string` | `Promise<void>` |
| `translateUniqueViolation` | método private | 86–96 | `error: unknown`, `name: string` | `unknown` |

##### `TypeOrmClientRepository.findAll`

- **Firma:** `findAll(options: FindClientsOptions): Promise<Client[]>` — [typeorm-client.repository.ts](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts#L23) (L23–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder`, `qb.andWhere`, `applySearchTerms`, `qb.orderBy`, `qb.getMany`, `orms.map`, `ClientMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmClientRepository.findById`

- **Firma:** `findById(id: string): Promise<Client \| null>` — [typeorm-client.repository.ts](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts#L40) (L40–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `ClientMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmClientRepository.findByActiveName`

- **Firma:** `findByActiveName(name: string): Promise<Client \| null>` — [typeorm-client.repository.ts](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts#L45) (L45–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('client').where`, `this.repository.createQueryBuilder`, `ClientMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmClientRepository.create`

- **Firma:** `create(data: CreateClientData): Promise<Client>` — [typeorm-client.repository.ts](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts#L54) (L54–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `ClientMapper.toDomain`, `this.translateUniqueViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmClientRepository.update`

- **Firma:** `update(id: string, data: UpdateClientData): Promise<Client>` — [typeorm-client.repository.ts](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts#L70) (L70–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateUniqueViolation`, `this.repository.findOneOrFail`, `ClientMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateUniqueViolation(error, data.name ?? '')`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmClientRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-client.repository.ts](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmClientRepository.translateUniqueViolation`

- **Firma:** `translateUniqueViolation(error: unknown, name: string): unknown` — [typeorm-client.repository.ts](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts#L86) (L86–96)
- **Propósito / descripción:** Safety net for the create/update race the use case's own pre-check can't close — see `TypeOrmCategoryRepository.translateUniqueViolation`'s own doc comment.
- **Dependencias (llamadas en su cuerpo):** `new ClientNameAlreadyExistsError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts"></a>

### clients.controller.ts

- **Ruta:** [clients.controller.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts) (`comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts`, 87 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** Create/update/deactivate are admin-only — same policy as CategoriesController/ AccountTypesController.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-create-client-use-case-ts), [list-clients.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-list-clients-use-case-ts), [get-client-by-id.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-get-client-by-id-use-case-ts), [update-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-update-client-use-case-ts), [deactivate-client.use-case.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-application-use-cases-deactivate-client-use-case-ts), [create-client.request.dto.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-dtos-create-client-request-dto-ts), [update-client.request.dto.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-dtos-update-client-request-dto-ts), [list-clients.query.dto.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-dtos-list-clients-query-dto-ts), [client.response.dto.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-dtos-client-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts)

#### Clase `ClientsController` (L36–86)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('clients')`
- **Propósito:** Create/update/deactivate are admin-only — same policy as CategoriesController/ AccountTypesController. Any authenticated role (SUPER_ADMIN/ADMIN/USER) can still list/consult, since Clientes is a catalog other operational screens (future Ventas) will need to read from. Enforcement is here, not in the frontend — see the frontend's `canManage` gating, which only hides the buttons.
- **Dependencias inyectadas (constructor):** `createClientUseCase: CreateClientUseCase`, `listClientsUseCase: ListClientsUseCase`, `getClientByIdUseCase: GetClientByIdUseCase`, `updateClientUseCase: UpdateClientUseCase`, `deactivateClientUseCase: DeactivateClientUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 47–56 | `dto: CreateClientRequestDto`, `userId: string` | `Promise<ClientResponseDto>` |
| `findAll` | método public | 58–61 | `query: ListClientsQueryDto` | `Promise<ClientResponseDto[]>` |
| `findOne` | método public | 63–66 | `id: string` | `Promise<ClientResponseDto>` |
| `update` | método public | 68–77 | `id: string`, `dto: UpdateClientRequestDto`, `userId: string` | `Promise<ClientResponseDto>` |
| `deactivate` | método public | 79–85 | `id: string` | `Promise<void>` |

##### `ClientsController.create`

- **Firma:** `create(dto: CreateClientRequestDto, userId: string): Promise<ClientResponseDto>` — [clients.controller.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts#L47) (L47–56)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createClientUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ClientsController.findAll`

- **Firma:** `findAll(query: ListClientsQueryDto): Promise<ClientResponseDto[]>` — [clients.controller.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts#L58) (L58–61)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listClientsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ClientsController.findOne`

- **Firma:** `findOne(id: string): Promise<ClientResponseDto>` — [clients.controller.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts#L63) (L63–66)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getClientByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ClientsController.update`

- **Firma:** `update(id: string, dto: UpdateClientRequestDto, userId: string): Promise<ClientResponseDto>` — [clients.controller.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts#L68) (L68–77)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateClientUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ClientsController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [clients.controller.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts#L79) (L79–85)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateClientUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-clients-presentation-dtos-client-response-dto-ts"></a>

### client.response.dto.ts

- **Ruta:** [client.response.dto.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/dtos/client.response.dto.ts) (`comercial-jhoel-api/src/modules/clients/presentation/dtos/client.response.dto.ts`, 12 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** DTO de respuesta: declara `ClientResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

#### Clase `ClientResponseDto` (L1–11)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-clients-presentation-dtos-create-client-request-dto-ts"></a>

### create-client.request.dto.ts

- **Ruta:** [create-client.request.dto.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/dtos/create-client.request.dto.ts) (`comercial-jhoel-api/src/modules/clients/presentation/dtos/create-client.request.dto.ts`, 18 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** DTO de entrada: declara `CreateClientRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`, `class-transformer`
- **Consumidores:** [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

#### Clase `CreateClientRequestDto` (L4–17)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-clients-presentation-dtos-list-clients-query-dto-ts"></a>

### list-clients.query.dto.ts

- **Ruta:** [list-clients.query.dto.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/dtos/list-clients.query.dto.ts) (`comercial-jhoel-api/src/modules/clients/presentation/dtos/list-clients.query.dto.ts`, 15 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** DTO de consulta: declara `ListClientsQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

#### Clase `ListClientsQueryDto` (L4–14)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-clients-presentation-dtos-update-client-request-dto-ts"></a>

### update-client.request.dto.ts

- **Ruta:** [update-client.request.dto.ts](../../../../comercial-jhoel-api/src/modules/clients/presentation/dtos/update-client.request.dto.ts) (`comercial-jhoel-api/src/modules/clients/presentation/dtos/update-client.request.dto.ts`, 25 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `clients`
- **Responsabilidad:** DTO de entrada: declara `UpdateClientRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`, `class-transformer`
- **Consumidores:** [clients.controller.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-presentation-controllers-clients-controller-ts)

#### Clase `UpdateClientRequestDto` (L10–24)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
