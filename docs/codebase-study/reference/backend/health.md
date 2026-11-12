# Health check

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/health` | [health.controller.ts](../../../../comercial-jhoel-api/src/health/health.controller.ts#L12) `HealthController.check` | — | — | — | — |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [health.controller.ts](#f-comercial-jhoel-api-src-health-health-controller-ts) | .ts | Controlador | Arranque / configuración | Liveness check — unauthenticated, no dependencies queried (not even the database), so a `200` only confirms the Nest process itself is up and routing requests. | 0 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [health.module.ts](#f-comercial-jhoel-api-src-health-health-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `HealthModule` (sin comentario de documentación en el código). | 1 internas; ext.: @nestjs/common | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-health-health-controller-ts"></a>

### health.controller.ts

- **Ruta:** [health.controller.ts](../../../../comercial-jhoel-api/src/health/health.controller.ts) (`comercial-jhoel-api/src/health/health.controller.ts`, 17 líneas)
- **Tipo:** Controlador · **Capa:** Arranque / configuración · **Módulo:** Health check
- **Responsabilidad:** Liveness check — unauthenticated, no dependencies queried (not even the database), so a `200` only confirms the Nest process itself is up and routing requests.
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [health.module.ts](health.md#f-comercial-jhoel-api-src-health-health-module-ts)

#### Clase `HealthController` (L10–16)

- **Decoradores:** `@Controller('health')`
- **Propósito:** Liveness check — unauthenticated, no dependencies queried (not even the database), so a `200` only confirms the Nest process itself is up and routing requests. Intended for infrastructure-level monitoring (load balancer/orchestrator health probes), not as a database connectivity check.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `check` | método public | 12–15 | — | `{ status: 'ok'; timestamp: string }` |

##### `HealthController.check`

- **Firma:** `check(): { status: 'ok'; timestamp: string }` — [health.controller.ts](../../../../comercial-jhoel-api/src/health/health.controller.ts#L12) (L12–15)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Date().toISOString`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-health-health-module-ts"></a>

### health.module.ts

- **Ruta:** [health.module.ts](../../../../comercial-jhoel-api/src/health/health.module.ts) (`comercial-jhoel-api/src/health/health.module.ts`, 8 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Health check
- **Responsabilidad:** Módulo: declara `HealthModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [health.controller.ts](health.md#f-comercial-jhoel-api-src-health-health-controller-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `HealthModule` (L4–7)

- **Decoradores:** `@Module({ controllers: [HealthController], })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
