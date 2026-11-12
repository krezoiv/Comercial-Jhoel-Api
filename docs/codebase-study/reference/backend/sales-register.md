# Módulo backend `sales-register`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/sales-register/summary` | [sales-register.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-register/presentation/controllers/sales-register.controller.ts#L22) `SalesRegisterController.getSummary` | [GetSalesRegisterSummaryUseCase](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-application-use-cases-get-sales-register-summary-use-case-ts) | `SalesRegisterRepository`.getDailyData | UseGuards(JwtAuthGuard) | `SalesRegisterService.getSummary` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [sales-register-summary-output.ts](#f-comercial-jhoel-api-src-modules-sales-register-application-dtos-sales-register-summary-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `SalesRegisterProductOutput`, `SalesRegisterBusinessOutput`, `SalesRegisterSummaryOutput` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [get-sales-register-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-sales-register-application-use-cases-get-sales-register-summary-use-case-ts) | .ts | Caso de uso | Aplicación | "Gestión de Caja de Ventas" — a live, read-only view over the EXISTING `sales`/`sale_details` tables, grouped by `business_id` (the product's "línea de negocio" this app already has — see `businesses`/ `CreateBusinessesTable`), for one business day. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [invalid-sales-register-date.error.ts](#f-comercial-jhoel-api-src-modules-sales-register-domain-errors-invalid-sales-register-date-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidSalesRegisterDateError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [sales-register.repository.ts](#f-comercial-jhoel-api-src-modules-sales-register-domain-repositories-sales-register-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `DateRange`, `BusinessTotalsRow`, `BusinessProductRow`, `OverallTotals`, `SalesRegisterRawData` (sin comentario de documentación en el código). | 0 internas | 3 | Media (3 consumidores) |
| [typeorm-sales-register.repository.ts](#f-comercial-jhoel-api-src-modules-sales-register-infrastructure-persistence-typeorm-sales-register-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmSalesRegisterRepository` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [sales-register.controller.ts](#f-comercial-jhoel-api-src-modules-sales-register-presentation-controllers-sales-register-controller-ts) | .ts | Controlador | Presentación | "Gestión de Caja de Ventas" — read-only, live view over `sales`/ `sale_details` grouped by negocio. | 3 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [sales-register-summary.query.dto.ts](#f-comercial-jhoel-api-src-modules-sales-register-presentation-dtos-sales-register-summary-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `SalesRegisterSummaryQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [sales-register.module.ts](#f-comercial-jhoel-api-src-modules-sales-register-sales-register-module-ts) | .ts | Módulo | Arranque / configuración | "Gestión de Caja de Ventas" — pure read-side, cross-cutting module, same architectural precedent as `ReportsModule`/`DashboardModule` (see either module's own doc comment): never writes anything, registers `SaleOrmEntity`/`SaleDetailOrmEntity` a second time via its own `TypeOrmModule.forFeature(...) | 6 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-sales-register-application-dtos-sales-register-summary-output-ts"></a>

### sales-register-summary-output.ts

- **Ruta:** [sales-register-summary-output.ts](../../../../comercial-jhoel-api/src/modules/sales-register/application/dtos/sales-register-summary-output.ts) (`comercial-jhoel-api/src/modules/sales-register/application/dtos/sales-register-summary-output.ts`, 35 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `sales-register`
- **Responsabilidad:** DTO de salida (aplicación): declara `SalesRegisterProductOutput`, `SalesRegisterBusinessOutput`, `SalesRegisterSummaryOutput` (sin comentario de documentación en el código).
- **Consumidores:** [get-sales-register-summary.use-case.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-application-use-cases-get-sales-register-summary-use-case-ts)

**Interfaces, tipos y enums:**

- `interface SalesRegisterProductOutput` (L1): sin documentación — miembros: `productId`, `productName`, `sku`, `quantitySold`, `totalRevenue`
- `interface SalesRegisterBusinessOutput` (L9): sin documentación — miembros: `businessId`, `businessName`, `totalAmount`, `salesCount`, `productsCount`, `topProduct`, `products`
- `interface SalesRegisterSummaryOutput` (L21): sin documentación — miembros: `date`, `totalAmount`, `salesCount`, `productsCount`, `businessesActive`, `businesses`
<a id="f-comercial-jhoel-api-src-modules-sales-register-application-use-cases-get-sales-register-summary-use-case-ts"></a>

### get-sales-register-summary.use-case.ts

- **Ruta:** [get-sales-register-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-register/application/use-cases/get-sales-register-summary.use-case.ts) (`comercial-jhoel-api/src/modules/sales-register/application/use-cases/get-sales-register-summary.use-case.ts`, 104 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `sales-register`
- **Responsabilidad:** "Gestión de Caja de Ventas" — a live, read-only view over the EXISTING `sales`/`sale_details` tables, grouped by `business_id` (the product's "línea de negocio" this app already has — see `businesses`/ `CreateBusinessesTable`), for one business day.
- **Depende de (archivos del proyecto):** [sales-register.repository.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-domain-repositories-sales-register-repository-ts), [invalid-sales-register-date.error.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-domain-errors-invalid-sales-register-date-error-ts), [sales-register-summary-output.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-application-dtos-sales-register-summary-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales-register.controller.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-presentation-controllers-sales-register-controller-ts), [sales-register.module.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-sales-register-module-ts)

**Interfaces, tipos y enums:**

- `interface GetSalesRegisterSummaryInput` (L7): sin documentación — miembros: `date`

#### Clase `GetSalesRegisterSummaryUseCase` (L49–103)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Gestión de Caja de Ventas" — a live, read-only view over the EXISTING `sales`/`sale_details` tables, grouped by `business_id` (the product's "línea de negocio" this app already has — see `businesses`/ `CreateBusinessesTable`), for one business day. Never a second sales system: this use case writes nothing, and reuses exactly the same `status = 'CONFIRMED' AND is_voided = false` filter every other reader of `sales` (Reports, Dashboard, `getDailySalesTotals`) already applies — a voided sale or an in-progress `OPEN` draft never contributes here either.
- **Dependencias inyectadas (constructor):** `@Inject(SALES_REGISTER_REPOSITORY) repository: SalesRegisterRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 56–102 | `input?: GetSalesRegisterSummaryInput` | `Promise<SalesRegisterSummaryOutput>` |

##### `GetSalesRegisterSummaryUseCase.execute`

- **Firma:** `execute(input?: GetSalesRegisterSummaryInput): Promise<SalesRegisterSummaryOutput>` — [get-sales-register-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-register/application/use-cases/get-sales-register-summary.use-case.ts#L56) (L56–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `todayIsoDate`, `maxAllowedDate`, `new InvalidSalesRegisterDateError`, `date.split('-').map`, `date.split`, `new Date`, `this.repository.getDailyData`, `raw.businessTotals.map`, `raw.productRows.filter((row) => row.businessId === business.businessId).map`, `raw.productRows.filter`, `businesses.reduce`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidSalesRegisterDateError()`
- **Consumidores:** [sales-register.controller.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-presentation-controllers-sales-register-controller-ts)

#### Función `toIsoDate` (L21–26)

- **Tipo:** función local del archivo
- **Firma:** `toIsoDate(date: Date): string` — [get-sales-register-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-register/application/use-cases/get-sales-register-summary.use-case.ts#L21)
- **Propósito / descripción:** `yyyy-MM-dd` in local server time — this module's own copy, matching the per-module convention every date-driven feature in this codebase already follows (Recargas/Bank-deposits/Banks/Alerts each own a tiny copy rather than sharing one utility). The API process runs with `TZ=America/Guatemala` (see `docker-compose.yml`/migration `1759100000000-SetDatabaseTimezone`), so `Date`'s own local getters already reflect the correct Guatemala calendar day.
- **Dependencias:** `date.getFullYear`, `String(date.getMonth() + 1).padStart`, `String`, `date.getMonth`, `String(date.getDate()).padStart`, `date.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `todayIsoDate` (L28–30)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [get-sales-register-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-register/application/use-cases/get-sales-register-summary.use-case.ts#L28)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `toIsoDate`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `maxAllowedDate` (L33–37)

- **Tipo:** función local del archivo
- **Firma:** `maxAllowedDate(): string` — [get-sales-register-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/sales-register/application/use-cases/get-sales-register-summary.use-case.ts#L33)
- **Propósito / descripción:** One calendar day past today — same grace window Recargas' own `maxAllowedOperationDate()` uses to absorb client/server clock skew around "today" without permitting genuine future-dating.
- **Dependencias:** `new Date`, `date.setDate`, `date.getDate`, `toIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-sales-register-domain-errors-invalid-sales-register-date-error-ts"></a>

### invalid-sales-register-date.error.ts

- **Ruta:** [invalid-sales-register-date.error.ts](../../../../comercial-jhoel-api/src/modules/sales-register/domain/errors/invalid-sales-register-date.error.ts) (`comercial-jhoel-api/src/modules/sales-register/domain/errors/invalid-sales-register-date.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `sales-register`
- **Responsabilidad:** Errores de dominio: declara `InvalidSalesRegisterDateError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-sales-register-summary.use-case.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-application-use-cases-get-sales-register-summary-use-case-ts)

#### Clase `InvalidSalesRegisterDateError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-register-domain-repositories-sales-register-repository-ts"></a>

### sales-register.repository.ts

- **Ruta:** [sales-register.repository.ts](../../../../comercial-jhoel-api/src/modules/sales-register/domain/repositories/sales-register.repository.ts) (`comercial-jhoel-api/src/modules/sales-register/domain/repositories/sales-register.repository.ts`, 48 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `sales-register`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `DateRange`, `BusinessTotalsRow`, `BusinessProductRow`, `OverallTotals`, `SalesRegisterRawData` (sin comentario de documentación en el código).
- **Consumidores:** [get-sales-register-summary.use-case.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-application-use-cases-get-sales-register-summary-use-case-ts), [typeorm-sales-register.repository.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-infrastructure-persistence-typeorm-sales-register-repository-ts), [sales-register.module.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-sales-register-module-ts)

**Interfaces, tipos y enums:**

- `interface DateRange` (L3): sin documentación — miembros: `start`, `end`
- `interface BusinessTotalsRow` (L8): sin documentación — miembros: `businessId`, `businessName`, `salesCount`, `productsCount`, `totalAmount`
- `interface BusinessProductRow` (L16): sin documentación — miembros: `businessId`, `productId`, `productName`, `sku`, `quantitySold`, `totalRevenue`
- `interface OverallTotals` (L25): sin documentación — miembros: `totalAmount`, `salesCount`
- `interface SalesRegisterRawData` (L30): sin documentación — miembros: `overall`, `businessTotals`, `productRows`
- `interface SalesRegisterRepository` (L36): sin documentación — miembros: `getDailyData`

**Constantes exportadas:**

- `SALES_REGISTER_REPOSITORY` (L1) = `Symbol('SALES_REGISTER_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-sales-register-infrastructure-persistence-typeorm-sales-register-repository-ts"></a>

### typeorm-sales-register.repository.ts

- **Ruta:** [typeorm-sales-register.repository.ts](../../../../comercial-jhoel-api/src/modules/sales-register/infrastructure/persistence/typeorm-sales-register.repository.ts) (`comercial-jhoel-api/src/modules/sales-register/infrastructure/persistence/typeorm-sales-register.repository.ts`, 117 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `sales-register`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmSalesRegisterRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sale.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts), [sale-detail.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-detail-orm-entity-ts), [sales-register.repository.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-domain-repositories-sales-register-repository-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [sales-register.module.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-sales-register-module-ts)

#### Clase `TypeOrmSalesRegisterRepository` (L15–116)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements SalesRegisterRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(SaleOrmEntity) saleRepository: Repository<SaleOrmEntity>`, `@InjectRepository(SaleDetailOrmEntity) saleDetailRepository: Repository<SaleDetailOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getDailyData` | método public async | 26–115 | `range: DateRange` | `Promise<SalesRegisterRawData>` |

##### `TypeOrmSalesRegisterRepository.getDailyData`

- **Firma:** `getDailyData(range: DateRange): Promise<SalesRegisterRawData>` — [typeorm-sales-register.repository.ts](../../../../comercial-jhoel-api/src/modules/sales-register/infrastructure/persistence/typeorm-sales-register.repository.ts#L26) (L26–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.saleRepository.createQueryBuilder('sale').where`, `this.saleRepository.createQueryBuilder`, `this.saleDetailRepository.createQueryBuilder('detail').innerJoin`, `this.saleDetailRepository.createQueryBuilder`, `parseFloat`, `parseInt`, `businessRaw.map`, `productRaw.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-sales-register-presentation-controllers-sales-register-controller-ts"></a>

### sales-register.controller.ts

- **Ruta:** [sales-register.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-register/presentation/controllers/sales-register.controller.ts) (`comercial-jhoel-api/src/modules/sales-register/presentation/controllers/sales-register.controller.ts`, 27 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `sales-register`
- **Responsabilidad:** "Gestión de Caja de Ventas" — read-only, live view over `sales`/ `sale_details` grouped by negocio.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [get-sales-register-summary.use-case.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-application-use-cases-get-sales-register-summary-use-case-ts), [sales-register-summary.query.dto.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-presentation-dtos-sales-register-summary-query-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales-register.module.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-sales-register-module-ts)

#### Clase `SalesRegisterController` (L15–26)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('sales-register')`
- **Propósito:** "Gestión de Caja de Ventas" — read-only, live view over `sales`/ `sale_details` grouped by negocio. Operational, any authenticated active account (no `@Roles(...)`) — same policy as `recharge-cash-box`'s own balance read: any cajero should be able to see today's numbers, not just an admin. It has no write route at all (see the module's own doc comment), unlike `recharge-cash-box`, which needed `@Roles(...)` on its contribute/withdraw/void mutations — there is nothing to mutate here.
- **Dependencias inyectadas (constructor):** `getSummaryUseCase: GetSalesRegisterSummaryUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getSummary` | método public | 22–25 | `query: SalesRegisterSummaryQueryDto` | (inferido) |

##### `SalesRegisterController.getSummary`

- **Firma:** `getSummary(query: SalesRegisterSummaryQueryDto)` — [sales-register.controller.ts](../../../../comercial-jhoel-api/src/modules/sales-register/presentation/controllers/sales-register.controller.ts#L22) (L22–25)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-sales-register-presentation-dtos-sales-register-summary-query-dto-ts"></a>

### sales-register-summary.query.dto.ts

- **Ruta:** [sales-register-summary.query.dto.ts](../../../../comercial-jhoel-api/src/modules/sales-register/presentation/dtos/sales-register-summary.query.dto.ts) (`comercial-jhoel-api/src/modules/sales-register/presentation/dtos/sales-register-summary.query.dto.ts`, 8 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `sales-register`
- **Responsabilidad:** DTO de consulta: declara `SalesRegisterSummaryQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [sales-register.controller.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-presentation-controllers-sales-register-controller-ts)

#### Clase `SalesRegisterSummaryQueryDto` (L3–7)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-sales-register-sales-register-module-ts"></a>

### sales-register.module.ts

- **Ruta:** [sales-register.module.ts](../../../../comercial-jhoel-api/src/modules/sales-register/sales-register.module.ts) (`comercial-jhoel-api/src/modules/sales-register/sales-register.module.ts`, 33 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `sales-register`
- **Responsabilidad:** "Gestión de Caja de Ventas" — pure read-side, cross-cutting module, same architectural precedent as `ReportsModule`/`DashboardModule` (see either module's own doc comment): never writes anything, registers `SaleOrmEntity`/`SaleDetailOrmEntity` a second time via its own `TypeOrmModule.forFeature(...)
- **Depende de (archivos del proyecto):** [sale.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts), [sale-detail.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-detail-orm-entity-ts), [sales-register.repository.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-domain-repositories-sales-register-repository-ts), [typeorm-sales-register.repository.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-infrastructure-persistence-typeorm-sales-register-repository-ts), [get-sales-register-summary.use-case.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-application-use-cases-get-sales-register-summary-use-case-ts), [sales-register.controller.ts](sales-register.md#f-comercial-jhoel-api-src-modules-sales-register-presentation-controllers-sales-register-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `SalesRegisterModule` (L21–32)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([SaleOrmEntity, SaleDetailOrmEntity])], controllers: [SalesRegisterController], providers: [ { provide: SALES_REGIST`
- **Propósito:** "Gestión de Caja de Ventas" — pure read-side, cross-cutting module, same architectural precedent as `ReportsModule`/`DashboardModule` (see either module's own doc comment): never writes anything, registers `SaleOrmEntity`/`SaleDetailOrmEntity` a second time via its own `TypeOrmModule.forFeature(...)` rather than importing `SalesModule` wholesale — this is the "a new read view spans tables several other modules already own" case those two modules already established the pattern for, not a reason to add dashboard-style aggregation code directly inside the transactional `SalesModule`.
