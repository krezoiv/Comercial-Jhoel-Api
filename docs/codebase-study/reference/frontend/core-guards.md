# Frontend `core-guards`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [admin.guard.ts](#f-comercial-jhoel-app-src-app-core-guards-admin-guard-ts) | .ts | Guard | Core (servicios, modelos, guards) | Blocks direct-URL access to admin-only pages (Usuarios, Roles) for a USER account — redirects to the dashboard overview instead of a 404/blank page. | 1 internas; ext.: @angular/core, @angular/router | 1 | Baja (1 consumidores) |
| [auth.guard.ts](#f-comercial-jhoel-app-src-app-core-guards-auth-guard-ts) | .ts | Guard | Core (servicios, modelos, guards) | Gates the entire `/dashboard/*` route tree. | 1 internas; ext.: @angular/core, @angular/router | 1 | Baja (1 consumidores) |
| [guest.guard.ts](#f-comercial-jhoel-app-src-app-core-guards-guest-guard-ts) | .ts | Guard | Core (servicios, modelos, guards) | Gates routes meant only for a visitor who is NOT yet authenticated — the public landing (`''`) and `/login`. | 1 internas; ext.: @angular/core, @angular/router | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-core-guards-admin-guard-ts"></a>

### admin.guard.ts

- **Ruta:** [admin.guard.ts](../../../../comercial-jhoel-app/src/app/core/guards/admin.guard.ts) (`comercial-jhoel-app/src/app/core/guards/admin.guard.ts`, 19 líneas)
- **Tipo:** Guard · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-guards`
- **Responsabilidad:** Blocks direct-URL access to admin-only pages (Usuarios, Roles) for a USER account — redirects to the dashboard overview instead of a 404/blank page.
- **Depende de (archivos del proyecto):** [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
#### Función `adminGuard` (L12–18)

- **Tipo:** función exportada
- **Firma:** `adminGuard()` — [admin.guard.ts](../../../../comercial-jhoel-app/src/app/core/guards/admin.guard.ts#L12)
- **Propósito / descripción:** Blocks direct-URL access to admin-only pages (Usuarios, Roles) for a USER account — redirects to the dashboard overview instead of a 404/blank page. UI-only, same as the sidebar's own role filtering: the backend's RolesGuard is what actually rejects a USER-role token calling the API directly.
- **Dependencias:** `inject`, `authService.isAdmin`, `inject(Router).parseUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-guards-auth-guard-ts"></a>

### auth.guard.ts

- **Ruta:** [auth.guard.ts](../../../../comercial-jhoel-app/src/app/core/guards/auth.guard.ts) (`comercial-jhoel-app/src/app/core/guards/auth.guard.ts`, 21 líneas)
- **Tipo:** Guard · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-guards`
- **Responsabilidad:** Gates the entire `/dashboard/*` route tree.
- **Depende de (archivos del proyecto):** [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
#### Función `authGuard` (L14–20)

- **Tipo:** función exportada
- **Firma:** `authGuard()` — [auth.guard.ts](../../../../comercial-jhoel-app/src/app/core/guards/auth.guard.ts#L14)
- **Propósito / descripción:** Gates the entire `/dashboard/*` route tree. `isAuthenticated()` only checks the in-memory signal seeded from `AuthService.restoreSession()` at construction — it never re-validates the token against the backend here. An expired/invalid token is instead caught lazily, the next time a request actually 401s (see `authInterceptor`), which is what redirects to `/login` at that point.
- **Dependencias:** `inject`, `authService.isAuthenticated`, `inject(Router).parseUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-guards-guest-guard-ts"></a>

### guest.guard.ts

- **Ruta:** [guest.guard.ts](../../../../comercial-jhoel-app/src/app/core/guards/guest.guard.ts) (`comercial-jhoel-app/src/app/core/guards/guest.guard.ts`, 22 líneas)
- **Tipo:** Guard · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-guards`
- **Responsabilidad:** Gates routes meant only for a visitor who is NOT yet authenticated — the public landing (`''`) and `/login`.
- **Depende de (archivos del proyecto):** [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
#### Función `guestGuard` (L15–21)

- **Tipo:** función exportada
- **Firma:** `guestGuard()` — [guest.guard.ts](../../../../comercial-jhoel-app/src/app/core/guards/guest.guard.ts#L15)
- **Propósito / descripción:** Gates routes meant only for a visitor who is NOT yet authenticated — the public landing (`''`) and `/login`. An already-authenticated session is sent straight to `/dashboard` instead, resolved here before the route's own component ever mounts (no flash of landing/login first). Reuses the exact same `isAuthenticated()` signal `authGuard` already relies on — same "presence in localStorage, corrected lazily by `authInterceptor` on a real 401" philosophy, not a stricter/duplicated check.
- **Dependencias:** `inject`, `authService.isAuthenticated`, `inject(Router).parseUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

