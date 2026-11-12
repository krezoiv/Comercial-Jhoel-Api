# Módulo backend `site-visits`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/public-site-visits` | [public-site-visits.controller.ts](../../../../comercial-jhoel-api/src/modules/site-visits/presentation/controllers/public-site-visits.controller.ts#L23) `PublicSiteVisitsController.register` | [RegisterVisitUseCase](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-register-visit-use-case-ts) | `SiteVisitsRepository`.increment [site_visits] | UseGuards(ThrottlerGuard) Throttle({ default: { limit: 10, ttl: 60_000 } }) | `SiteVisitsService.registerVisit` |
| `GET /api/public-site-visits` | [public-site-visits.controller.ts](../../../../comercial-jhoel-api/src/modules/site-visits/presentation/controllers/public-site-visits.controller.ts#L31) `PublicSiteVisitsController.getTotal` | [GetVisitCountUseCase](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-get-visit-count-use-case-ts) | `SiteVisitsRepository`.getTotal [site_visits] | — | `SiteVisitsService.getVisitCount` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [get-visit-count.use-case.ts](#f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-get-visit-count-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetVisitCountUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-visit.use-case.ts](#f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-register-visit-use-case-ts) | .ts | Caso de uso | Aplicación | Incrementa el contador en +1 — nunca acepta ni confía en un valor del cliente. | 1 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [site-visits.repository.ts](#f-comercial-jhoel-api-src-modules-site-visits-domain-repositories-site-visits-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Sin entidad de dominio propia a propósito — la única fila de `site_visits` es un contador desnudo (un entero), no un concepto de negocio con invariantes que proteger; envolverlo en una clase de entidad solo habría sido ceremonia sin beneficio real. | 0 internas | 4 | Media (4 consumidores) |
| [site-visits.orm-entity.ts](#f-comercial-jhoel-api-src-modules-site-visits-infrastructure-persistence-site-visits-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `SiteVisitsOrmEntity` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [typeorm-site-visits.repository.ts](#f-comercial-jhoel-api-src-modules-site-visits-infrastructure-persistence-typeorm-site-visits-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmSiteVisitsRepository` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [public-site-visits.controller.ts](#f-comercial-jhoel-api-src-modules-site-visits-presentation-controllers-public-site-visits-controller-ts) | .ts | Controlador | Presentación | Público, sin autenticación — backs el contador anónimo y agregado del Footer de la landing. | 2 internas; ext.: @nestjs/common, @nestjs/throttler | 1 | Media (controlador) |
| [site-visits.module.ts](#f-comercial-jhoel-api-src-modules-site-visits-site-visits-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `SiteVisitsModule` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-get-visit-count-use-case-ts"></a>

### get-visit-count.use-case.ts

- **Ruta:** [get-visit-count.use-case.ts](../../../../comercial-jhoel-api/src/modules/site-visits/application/use-cases/get-visit-count.use-case.ts) (`comercial-jhoel-api/src/modules/site-visits/application/use-cases/get-visit-count.use-case.ts`, 18 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `site-visits`
- **Responsabilidad:** Caso de uso: declara `GetVisitCountUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [site-visits.repository.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-domain-repositories-site-visits-repository-ts), [register-visit.use-case.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-register-visit-use-case-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [public-site-visits.controller.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-presentation-controllers-public-site-visits-controller-ts), [site-visits.module.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-site-visits-module-ts)

#### Clase `GetVisitCountUseCase` (L6–17)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SITE_VISITS_REPOSITORY) siteVisitsRepository: SiteVisitsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 13–16 | — | `Promise<VisitCountOutput>` |

##### `GetVisitCountUseCase.execute`

- **Firma:** `execute(): Promise<VisitCountOutput>` — [get-visit-count.use-case.ts](../../../../comercial-jhoel-api/src/modules/site-visits/application/use-cases/get-visit-count.use-case.ts#L13) (L13–16)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.siteVisitsRepository.getTotal`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [public-site-visits.controller.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-presentation-controllers-public-site-visits-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-register-visit-use-case-ts"></a>

### register-visit.use-case.ts

- **Ruta:** [register-visit.use-case.ts](../../../../comercial-jhoel-api/src/modules/site-visits/application/use-cases/register-visit.use-case.ts) (`comercial-jhoel-api/src/modules/site-visits/application/use-cases/register-visit.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `site-visits`
- **Responsabilidad:** Incrementa el contador en +1 — nunca acepta ni confía en un valor del cliente.
- **Depende de (archivos del proyecto):** [site-visits.repository.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-domain-repositories-site-visits-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [get-visit-count.use-case.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-get-visit-count-use-case-ts), [public-site-visits.controller.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-presentation-controllers-public-site-visits-controller-ts), [site-visits.module.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-site-visits-module-ts)

**Interfaces, tipos y enums:**

- `interface VisitCountOutput` (L5): sin documentación — miembros: `total`

#### Clase `RegisterVisitUseCase` (L10–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Incrementa el contador en +1 — nunca acepta ni confía en un valor del cliente.
- **Dependencias inyectadas (constructor):** `@Inject(SITE_VISITS_REPOSITORY) siteVisitsRepository: SiteVisitsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 17–20 | — | `Promise<VisitCountOutput>` |

##### `RegisterVisitUseCase.execute`

- **Firma:** `execute(): Promise<VisitCountOutput>` — [register-visit.use-case.ts](../../../../comercial-jhoel-api/src/modules/site-visits/application/use-cases/register-visit.use-case.ts#L17) (L17–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.siteVisitsRepository.increment`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [public-site-visits.controller.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-presentation-controllers-public-site-visits-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-site-visits-domain-repositories-site-visits-repository-ts"></a>

### site-visits.repository.ts

- **Ruta:** [site-visits.repository.ts](../../../../comercial-jhoel-api/src/modules/site-visits/domain/repositories/site-visits.repository.ts) (`comercial-jhoel-api/src/modules/site-visits/domain/repositories/site-visits.repository.ts`, 16 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `site-visits`
- **Responsabilidad:** Sin entidad de dominio propia a propósito — la única fila de `site_visits` es un contador desnudo (un entero), no un concepto de negocio con invariantes que proteger; envolverlo en una clase de entidad solo habría sido ceremonia sin beneficio real.
- **Consumidores:** [get-visit-count.use-case.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-get-visit-count-use-case-ts), [register-visit.use-case.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-register-visit-use-case-ts), [typeorm-site-visits.repository.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-infrastructure-persistence-typeorm-site-visits-repository-ts), [site-visits.module.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-site-visits-module-ts)

**Interfaces, tipos y enums:**

- `interface SiteVisitsRepository` (L11): Sin entidad de dominio propia a propósito — la única fila de `site_visits` es un contador desnudo (un entero), no un concepto de negocio con invariantes que proteger; envolverlo en una clase de entidad solo habría sido ceremonia sin beneficio real. — miembros: `increment`, `getTotal`

**Constantes exportadas:**

- `SITE_VISITS_REPOSITORY` (L1) = `Symbol('SITE_VISITS_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-site-visits-infrastructure-persistence-site-visits-orm-entity-ts"></a>

### site-visits.orm-entity.ts

- **Ruta:** [site-visits.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/site-visits/infrastructure/persistence/site-visits.orm-entity.ts) (`comercial-jhoel-api/src/modules/site-visits/infrastructure/persistence/site-visits.orm-entity.ts`, 14 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `site-visits`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `SiteVisitsOrmEntity` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** [typeorm-site-visits.repository.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-infrastructure-persistence-typeorm-site-visits-repository-ts), [site-visits.module.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-site-visits-module-ts)

#### Clase `SiteVisitsOrmEntity` (L3–13)

- **Decoradores:** `@Entity('site_visits')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Column totalCount: number`, `@Column updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-site-visits-infrastructure-persistence-typeorm-site-visits-repository-ts"></a>

### typeorm-site-visits.repository.ts

- **Ruta:** [typeorm-site-visits.repository.ts](../../../../comercial-jhoel-api/src/modules/site-visits/infrastructure/persistence/typeorm-site-visits.repository.ts) (`comercial-jhoel-api/src/modules/site-visits/infrastructure/persistence/typeorm-site-visits.repository.ts`, 34 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `site-visits`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmSiteVisitsRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [site-visits.repository.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-domain-repositories-site-visits-repository-ts), [site-visits.orm-entity.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-infrastructure-persistence-site-visits-orm-entity-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [site-visits.module.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-site-visits-module-ts)

#### Clase `TypeOrmSiteVisitsRepository` (L7–33)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements SiteVisitsRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(SiteVisitsOrmEntity) repository: Repository<SiteVisitsOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `increment` | método public async | 14–25 | — | `Promise<number>` |
| `getTotal` | método public async | 27–32 | — | `Promise<number>` |

##### `TypeOrmSiteVisitsRepository.increment`

- **Firma:** `increment(): Promise<number>` — [typeorm-site-visits.repository.ts](../../../../comercial-jhoel-api/src/modules/site-visits/infrastructure/persistence/typeorm-site-visits.repository.ts#L14) (L14–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`
- **Efectos secundarios:** Tablas en su SQL: `site_visits`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSiteVisitsRepository.getTotal`

- **Firma:** `getTotal(): Promise<number>` — [typeorm-site-visits.repository.ts](../../../../comercial-jhoel-api/src/modules/site-visits/infrastructure/persistence/typeorm-site-visits.repository.ts#L27) (L27–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`
- **Efectos secundarios:** Tablas en su SQL: `site_visits`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-site-visits-presentation-controllers-public-site-visits-controller-ts"></a>

### public-site-visits.controller.ts

- **Ruta:** [public-site-visits.controller.ts](../../../../comercial-jhoel-api/src/modules/site-visits/presentation/controllers/public-site-visits.controller.ts) (`comercial-jhoel-api/src/modules/site-visits/presentation/controllers/public-site-visits.controller.ts`, 36 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `site-visits`
- **Responsabilidad:** Público, sin autenticación — backs el contador anónimo y agregado del Footer de la landing.
- **Depende de (archivos del proyecto):** [get-visit-count.use-case.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-get-visit-count-use-case-ts), [register-visit.use-case.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-register-visit-use-case-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/throttler`
- **Consumidores:** [site-visits.module.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-site-visits-module-ts)

#### Clase `PublicSiteVisitsController` (L16–35)

- **Decoradores:** `@Controller('public-site-visits')`
- **Propósito:** Público, sin autenticación — backs el contador anónimo y agregado del Footer de la landing. Nunca acepta un valor: `POST` solo puede sumar +1, `GET` solo puede leer. `Throttle` es la única protección contra abuso pedida explícitamente ("protección razonable", no un sistema de tracking) — suficiente para absorber una carga de página real (que llama `POST` una sola vez) sin dejar que un script simple infle el contador sin límite.
- **Dependencias inyectadas (constructor):** `registerVisitUseCase: RegisterVisitUseCase`, `getVisitCountUseCase: GetVisitCountUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `register` | método public | 23–29 | — | `Promise<VisitCountOutput>` |
| `getTotal` | método public | 31–34 | — | `Promise<VisitCountOutput>` |

##### `PublicSiteVisitsController.register`

- **Firma:** `register(): Promise<VisitCountOutput>` — [public-site-visits.controller.ts](../../../../comercial-jhoel-api/src/modules/site-visits/presentation/controllers/public-site-visits.controller.ts#L23) (L23–29)
- **Decoradores:** `@Post()` `@HttpCode(HttpStatus.OK)` `@UseGuards(ThrottlerGuard)` `@Throttle({ default: { limit: 10, ttl: 60_000 } })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.registerVisitUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicSiteVisitsController.getTotal`

- **Firma:** `getTotal(): Promise<VisitCountOutput>` — [public-site-visits.controller.ts](../../../../comercial-jhoel-api/src/modules/site-visits/presentation/controllers/public-site-visits.controller.ts#L31) (L31–34)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getVisitCountUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-site-visits-site-visits-module-ts"></a>

### site-visits.module.ts

- **Ruta:** [site-visits.module.ts](../../../../comercial-jhoel-api/src/modules/site-visits/site-visits.module.ts) (`comercial-jhoel-api/src/modules/site-visits/site-visits.module.ts`, 20 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `site-visits`
- **Responsabilidad:** Módulo: declara `SiteVisitsModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [site-visits.repository.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-domain-repositories-site-visits-repository-ts), [site-visits.orm-entity.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-infrastructure-persistence-site-visits-orm-entity-ts), [typeorm-site-visits.repository.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-infrastructure-persistence-typeorm-site-visits-repository-ts), [register-visit.use-case.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-register-visit-use-case-ts), [get-visit-count.use-case.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-application-use-cases-get-visit-count-use-case-ts), [public-site-visits.controller.ts](site-visits.md#f-comercial-jhoel-api-src-modules-site-visits-presentation-controllers-public-site-visits-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `SiteVisitsModule` (L10–19)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([SiteVisitsOrmEntity])], controllers: [PublicSiteVisitsController], providers: [ { provide: SITE_VISITS_REPOSITORY, `
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
