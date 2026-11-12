# Raíz del backend (main, AppModule)

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [app.module.ts](#f-comercial-jhoel-api-src-app-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `AppModule` (sin comentario de documentación en el código). | 49 internas; ext.: @nestjs/common, @nestjs/config, @nestjs/typeorm, @nestjs/core | 9 | Alta (arranque) |
| [main.ts](#f-comercial-jhoel-api-src-main-ts) | .ts | Punto de entrada | Arranque / configuración | Turns each `CORS_ORIGINS` entry into an exact-match string or, if it contains a `*`, a compiled `RegExp` — lets one entry like `https://*.app.github.dev` cover every GitHub Codespaces/VS Code Ports forwarded URL (a new random subdomain per codespace) without editing `.env` and restarting the API every time a codespace is recreated. | 1 internas; ext.: @nestjs/core, @nestjs/common, @nestjs/config, helmet | 0 | Alta (arranque) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-app-module-ts"></a>

### app.module.ts

- **Ruta:** [app.module.ts](../../../../comercial-jhoel-api/src/app.module.ts) (`comercial-jhoel-api/src/app.module.ts`, 135 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Raíz del backend (main, AppModule)
- **Responsabilidad:** Módulo: declara `AppModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [configuration.ts](config.md#f-comercial-jhoel-api-src-config-configuration-ts), [global-exception.filter.ts](shared.md#f-comercial-jhoel-api-src-shared-filters-global-exception-filter-ts), [response.interceptor.ts](shared.md#f-comercial-jhoel-api-src-shared-interceptors-response-interceptor-ts), [health.module.ts](health.md#f-comercial-jhoel-api-src-health-health-module-ts), [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts), [auth.module.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-auth-module-ts), [roles.module.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-roles-module-ts), [categories.module.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-categories-module-ts), [businesses.module.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts), [inventory.module.ts](inventory.md#f-comercial-jhoel-api-src-modules-inventory-inventory-module-ts), [presentation-types.module.ts](presentation-types.md#f-comercial-jhoel-api-src-modules-presentation-types-presentation-types-module-ts), [units-of-measure.module.ts](units-of-measure.md#f-comercial-jhoel-api-src-modules-units-of-measure-units-of-measure-module-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts), [suppliers.module.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-suppliers-module-ts) y 34 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/config`, `@nestjs/typeorm`, `@nestjs/core`, `@nestjs/throttler`
- **Consumidores:** [main.ts](root.md#f-comercial-jhoel-api-src-main-ts), [app.e2e-spec.ts](e2e.md#f-comercial-jhoel-api-test-app-e2e-spec-ts), [ar-settlements.e2e-spec.ts](e2e.md#f-comercial-jhoel-api-test-ar-settlements-e2e-spec-ts), [bank-deposit-description.e2e-spec.ts](e2e.md#f-comercial-jhoel-api-test-bank-deposit-description-e2e-spec-ts), [cash-control.e2e-spec.ts](e2e.md#f-comercial-jhoel-api-test-cash-control-e2e-spec-ts), [cash-custody.e2e-spec.ts](e2e.md#f-comercial-jhoel-api-test-cash-custody-e2e-spec-ts), [cash-daily-indicators.e2e-spec.ts](e2e.md#f-comercial-jhoel-api-test-cash-daily-indicators-e2e-spec-ts), [cuadre-cash-breakdown.e2e-spec.ts](e2e.md#f-comercial-jhoel-api-test-cuadre-cash-breakdown-e2e-spec-ts), [financial-day-review.e2e-spec.ts](e2e.md#f-comercial-jhoel-api-test-financial-day-review-e2e-spec-ts)

#### Clase `AppModule` (L56–134)

- **Decoradores:** `@Module({ imports: [ ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }]), TypeOrmModule.forRoo`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-main-ts"></a>

### main.ts

- **Ruta:** [main.ts](../../../../comercial-jhoel-api/src/main.ts) (`comercial-jhoel-api/src/main.ts`, 99 líneas)
- **Tipo:** Punto de entrada · **Capa:** Arranque / configuración · **Módulo:** Raíz del backend (main, AppModule)
- **Responsabilidad:** Turns each `CORS_ORIGINS` entry into an exact-match string or, if it contains a `*`, a compiled `RegExp` — lets one entry like `https://*.app.github.dev` cover every GitHub Codespaces/VS Code Ports forwarded URL (a new random subdomain per codespace) without editing `.env` and restarting the API every time a codespace is recreated.
- **Depende de (archivos del proyecto):** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)
- **Paquetes externos:** `@nestjs/core`, `@nestjs/common`, `@nestjs/config`, `helmet`
- **Consumidores:** —
#### Función `compileCorsOrigins` (L16–22)

- **Tipo:** función local del archivo
- **Firma:** `compileCorsOrigins(origins: string[]): (string \| RegExp)[]` — [main.ts](../../../../comercial-jhoel-api/src/main.ts#L16)
- **Propósito / descripción:** Turns each `CORS_ORIGINS` entry into an exact-match string or, if it contains a `*`, a compiled `RegExp` — lets one entry like `https://*.app.github.dev` cover every GitHub Codespaces/VS Code Ports forwarded URL (a new random subdomain per codespace) without editing `.env` and restarting the API every time a codespace is recreated. Exact strings (e.g. `http://localhost:4200`) still match literally, unchanged from before — this is additive, not a loosening of the existing rule.
- **Dependencias:** `origins.map`, `entry.includes`, `new RegExp`, `entry.replace(/[.+?^${}()\|[\]\\]/g, '\\$&').replace`, `entry.replace`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `bootstrap` (L30–97)

- **Tipo:** función local del archivo, async
- **Firma:** `bootstrap()` — [main.ts](../../../../comercial-jhoel-api/src/main.ts#L30)
- **Propósito / descripción:** Application entry point — creates the Nest application context from `AppModule` and wires the process-wide (not per-module) HTTP concerns that only make sense configured once, in one place, before the server starts accepting connections.
- **Dependencias:** `NestFactory.create`, `app.get`, `app.use`, `helmet`, `app.setGlobalPrefix`, `compileCorsOrigins`, `configService.get`, `app.enableCors`, `callback`, `corsOrigins.some`, `entry.test`, `app.useGlobalPipes`, `new ValidationPipe`, `app.listen`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `(top-level) void bootstrap()` (L98–98)

- **Tipo:** función local del archivo
- **Firma:** `(top-level) void bootstrap()()` — [main.ts](../../../../comercial-jhoel-api/src/main.ts#L98)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

