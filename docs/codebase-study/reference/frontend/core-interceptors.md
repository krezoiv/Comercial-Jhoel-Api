# Frontend `core-interceptors`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [auth.interceptor.ts](#f-comercial-jhoel-app-src-app-core-interceptors-auth-interceptor-ts) | .ts | Interceptor | Core (servicios, modelos, guards) | Interceptor: declara `isApiRequest`, `authInterceptor` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, @angular/router, rxjs | 1 | Baja (1 consumidores) |
| [cash-mutation.interceptor.spec.ts](#f-comercial-jhoel-app-src-app-core-interceptors-cash-mutation-interceptor-spec-ts) | .ts | Prueba unitaria | Core (servicios, modelos, guards) | Prueba unitaria (sin comentario de documentación en el código). | 3 internas; ext.: @angular/common, @angular/core | 0 | Soporte (pruebas) |
| [cash-mutation.interceptor.ts](#f-comercial-jhoel-app-src-app-core-interceptors-cash-mutation-interceptor-ts) | .ts | Interceptor | Core (servicios, modelos, guards) | True for a successful-write candidate on a cash-moving resource of our own API. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-core-interceptors-auth-interceptor-ts"></a>

### auth.interceptor.ts

- **Ruta:** [auth.interceptor.ts](../../../../comercial-jhoel-app/src/app/core/interceptors/auth.interceptor.ts) (`comercial-jhoel-app/src/app/core/interceptors/auth.interceptor.ts`, 48 líneas)
- **Tipo:** Interceptor · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-interceptors`
- **Responsabilidad:** Interceptor: declara `isApiRequest`, `authInterceptor` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [app.config.ts](root.md#f-comercial-jhoel-app-src-app-app-config-ts)
#### Función `isApiRequest` (L11–13)

- **Tipo:** función local del archivo
- **Firma:** `isApiRequest(url: string): boolean` — [auth.interceptor.ts](../../../../comercial-jhoel-app/src/app/core/interceptors/auth.interceptor.ts#L11)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `url.startsWith`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `authInterceptor` (L22–47)

- **Tipo:** función exportada
- **Firma:** `authInterceptor(req, next)` — [auth.interceptor.ts](../../../../comercial-jhoel-app/src/app/core/interceptors/auth.interceptor.ts#L22)
- **Propósito / descripción:** Registered once in `app.config.ts` via `provideHttpClient(withInterceptors([authInterceptor]))` — every outgoing request to our own API gets the bearer token attached here, and a 401 from our own API is what triggers the network-wide "session expired" handling (logout + redirect), rather than each component/service having to check for it individually.
- **Dependencias:** `inject`, `authService.getToken`, `isApiRequest`, `req.clone`, `next(authorizedReq).pipe`, `next`, `catchError`, `authService.logout`, `router.navigateByUrl`, `throwError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-interceptors-cash-mutation-interceptor-spec-ts"></a>

### cash-mutation.interceptor.spec.ts

- **Ruta:** [cash-mutation.interceptor.spec.ts](../../../../comercial-jhoel-app/src/app/core/interceptors/cash-mutation.interceptor.spec.ts) (`comercial-jhoel-app/src/app/core/interceptors/cash-mutation.interceptor.spec.ts`, 48 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-interceptors`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [cash-control-sync.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-sync-service-ts), [cash-mutation.interceptor.ts](core-interceptors.md#f-comercial-jhoel-app-src-app-core-interceptors-cash-mutation-interceptor-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-core-interceptors-cash-mutation-interceptor-ts"></a>

### cash-mutation.interceptor.ts

- **Ruta:** [cash-mutation.interceptor.ts](../../../../comercial-jhoel-app/src/app/core/interceptors/cash-mutation.interceptor.ts) (`comercial-jhoel-app/src/app/core/interceptors/cash-mutation.interceptor.ts`, 50 líneas)
- **Tipo:** Interceptor · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-interceptors`
- **Responsabilidad:** True for a successful-write candidate on a cash-moving resource of our own API.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [cash-control-sync.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-sync-service-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [app.config.ts](root.md#f-comercial-jhoel-app-src-app-app-config-ts), [cash-mutation.interceptor.spec.ts](core-interceptors.md#f-comercial-jhoel-app-src-app-core-interceptors-cash-mutation-interceptor-spec-ts)
#### Función `isCashMutation` (L21–29)

- **Tipo:** función exportada
- **Firma:** `isCashMutation(method: string, url: string): boolean` — [cash-mutation.interceptor.ts](../../../../comercial-jhoel-app/src/app/core/interceptors/cash-mutation.interceptor.ts#L21)
- **Propósito / descripción:** True for a successful-write candidate on a cash-moving resource of our own API.
- **Dependencias:** `url.startsWith`, `CASH_RESOURCES.test`, `READ_ONLY_POSTS.test`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `cashMutationInterceptor` (L37–49)

- **Tipo:** función exportada
- **Firma:** `cashMutationInterceptor(req, next)` — [cash-mutation.interceptor.ts](../../../../comercial-jhoel-app/src/app/core/interceptors/cash-mutation.interceptor.ts#L37)
- **Propósito / descripción:** Real-time update of every screen that shows cash (Control de Efectivo, Transaccionar's "Últimas transacciones"): after a successful write to a cash-moving resource, tells `CashControlSyncService` so they re-read the backend. Centralized here so no feature has to remember to notify.
- **Dependencias:** `isCashMutation`, `next`, `inject`, `next(req).pipe`, `tap`, `sync.notifyChanged`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

