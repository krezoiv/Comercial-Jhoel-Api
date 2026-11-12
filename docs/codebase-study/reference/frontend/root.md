# Raíz del frontend (bootstrap, rutas, configuración)

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [app.component.ts](#f-comercial-jhoel-app-src-app-app-component-ts) | .ts | Componente Angular | Arranque / configuración | Componente Angular: declara `AppComponent`, `CHROME_LESS_PREFIXES` (sin comentario de documentación en el código). | 6 internas; ext.: @angular/core, @angular/router, rxjs | 1 | Baja (1 consumidores) |
| [app.config.ts](#f-comercial-jhoel-app-src-app-app-config-ts) | .ts | Configuración | Arranque / configuración | Configuración: declara `appConfig` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/common, @angular/core, @angular/router, @angular/service-worker | 1 | Baja (1 consumidores) |
| [app.routes.ts](#f-comercial-jhoel-app-src-app-app-routes-ts) | .ts | Rutas | Arranque / configuración | Rutas: declara `routes` (sin comentario de documentación en el código). | 78 internas; ext.: @angular/router | 1 | Baja (1 consumidores) |
| [main.ts](#f-comercial-jhoel-app-src-main-ts) | .ts | Punto de entrada | Arranque / configuración | Resuelve la URL pública del backend ANTES de que `bootstrapApplication` cargue el primer componente/servicio — la mayoría de los servicios de `core/services/*.service.ts` capturan `environment.apiUrl` en un `const BASE_URL = \`${environment.apiUrl}/...\`` a nivel de módulo (no dentro de una clase), así que la mutación de abajo debe completarse antes de que esos módulos se evalúen por primera vez. | 3 internas; ext.: @angular/platform-browser | 0 | Alta (arranque) |
| [app.component.html](../../../../comercial-jhoel-app/src/app/app.component.html) | .html | Plantilla HTML | Arranque / configuración | Plantilla de `app.component.ts`; usa 6 componentes hijos: `app-navbar`, `app-footer`, `app-toast-container`, `app-confirm-dialog`, `app-pdf-prompt-modal`, `app-update-available-banner`. | — | — | Media |
| [app.component.scss](../../../../comercial-jhoel-app/src/app/app.component.scss) | .scss | Estilos SCSS | Arranque / configuración | Estilos del componente del mismo nombre. | — | — | Baja |
| [index.html](../../../../comercial-jhoel-app/src/index.html) | .html | Plantilla HTML | Arranque / configuración | Plantilla de un componente; usa 1 componentes hijos: `app-root`. | — | — | Media |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-app-component-ts"></a>

### app.component.ts

- **Ruta:** [app.component.ts](../../../../comercial-jhoel-app/src/app/app.component.ts) (`comercial-jhoel-app/src/app/app.component.ts`, 71 líneas)
- **Tipo:** Componente Angular · **Capa:** Arranque / configuración · **Módulo:** Raíz del frontend (bootstrap, rutas, configuración)
- **Responsabilidad:** Componente Angular: declara `AppComponent`, `CHROME_LESS_PREFIXES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [app-update.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-app-update-service-ts), [fragment-scroll.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-fragment-scroll-service-ts), [keyboard-shortcuts.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-keyboard-shortcuts-service-ts), [navbar.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-navbar-component-ts), [footer.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-footer-footer-component-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [main.ts](root.md#f-comercial-jhoel-app-src-main-ts)
- **Plantilla:** [app.component.html](../../../../comercial-jhoel-app/src/app/app.component.html) · **Usa componentes:** [navbar.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-navbar-component-ts), [footer.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-footer-footer-component-ts), [toast-container.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-toast-toast-container-component-ts), [confirm-dialog.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-confirm-dialog-confirm-dialog-component-ts), [pdf-prompt-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-pdf-prompt-modal-pdf-prompt-modal-component-ts), [update-available-banner.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-update-available-banner-update-available-banner-component-ts)

#### Clase `AppComponent` (L26–70)

- **Decoradores:** `@Component({ selector: 'app-root', standalone: true, imports: [ RouterOutlet, NavbarComponent, FooterComponent, ToastContainerComponent, ConfirmDialogComponent, `
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `router = inject(Router)`
- **Datos / estado que administra:** `currentUrl = signal(this.router.url)`, `showChrome = computed( () => !CHROME_LESS_PREFIXES.some((prefix`
<a id="f-comercial-jhoel-app-src-app-app-config-ts"></a>

### app.config.ts

- **Ruta:** [app.config.ts](../../../../comercial-jhoel-app/src/app/app.config.ts) (`comercial-jhoel-app/src/app/app.config.ts`, 53 líneas)
- **Tipo:** Configuración · **Capa:** Arranque / configuración · **Módulo:** Raíz del frontend (bootstrap, rutas, configuración)
- **Responsabilidad:** Configuración: declara `appConfig` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts), [auth.interceptor.ts](core-interceptors.md#f-comercial-jhoel-app-src-app-core-interceptors-auth-interceptor-ts), [cash-mutation.interceptor.ts](core-interceptors.md#f-comercial-jhoel-app-src-app-core-interceptors-cash-mutation-interceptor-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `@angular/service-worker`
- **Consumidores:** [main.ts](root.md#f-comercial-jhoel-app-src-main-ts)

**Constantes exportadas:**

- `appConfig` (L14) = `{ providers: [ provideZoneChangeDetection({ eventCoalescing: true }), { provide: LOCALE_ID, useValue: 'es' }, `
<a id="f-comercial-jhoel-app-src-app-app-routes-ts"></a>

### app.routes.ts

- **Ruta:** [app.routes.ts](../../../../comercial-jhoel-app/src/app/app.routes.ts) (`comercial-jhoel-app/src/app/app.routes.ts`, 670 líneas)
- **Tipo:** Rutas · **Capa:** Arranque / configuración · **Módulo:** Raíz del frontend (bootstrap, rutas, configuración)
- **Responsabilidad:** Rutas: declara `routes` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [auth.guard.ts](core-guards.md#f-comercial-jhoel-app-src-app-core-guards-auth-guard-ts), [admin.guard.ts](core-guards.md#f-comercial-jhoel-app-src-app-core-guards-admin-guard-ts), [guest.guard.ts](core-guards.md#f-comercial-jhoel-app-src-app-core-guards-guest-guard-ts), [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [catalog-page.component.ts](catalog.md#f-comercial-jhoel-app-src-app-features-catalog-catalog-page-component-ts), [news-preferences-page.component.ts](news-preferences.md#f-comercial-jhoel-app-src-app-features-news-preferences-news-preferences-page-component-ts), [news-detail-page.component.ts](news-detail.md#f-comercial-jhoel-app-src-app-features-news-detail-news-detail-page-component-ts), [login-page.component.ts](auth.md#f-comercial-jhoel-app-src-app-features-auth-login-login-page-component-ts), [dashboard-layout.component.ts](dashboard.md#f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts), [dashboard-home.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts), [dashboard-placeholder-page.component.ts](dashboard-placeholder-page.md#f-comercial-jhoel-app-src-app-features-dashboard-placeholder-page-dashboard-placeholder-page-component-ts), [categories-page.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts), [businesses-page.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts), [suppliers-page.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts), [purchases-admin-page.component.ts](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-purchases-admin-page-component-ts) y 63 más
- **Paquetes externos:** `@angular/router`
- **Consumidores:** [app.config.ts](root.md#f-comercial-jhoel-app-src-app-app-config-ts)

**Constantes exportadas:**

- `routes` (L7) = `[ { path: '', canActivate: [guestGuard], loadComponent: () => import('./features/landing/landing-page.componen`
<a id="f-comercial-jhoel-app-src-main-ts"></a>

### main.ts

- **Ruta:** [main.ts](../../../../comercial-jhoel-app/src/main.ts) (`comercial-jhoel-app/src/main.ts`, 49 líneas)
- **Tipo:** Punto de entrada · **Capa:** Arranque / configuración · **Módulo:** Raíz del frontend (bootstrap, rutas, configuración)
- **Responsabilidad:** Resuelve la URL pública del backend ANTES de que `bootstrapApplication` cargue el primer componente/servicio — la mayoría de los servicios de `core/services/*.service.ts` capturan `environment.apiUrl` en un `const BASE_URL = \`${environment.apiUrl}/...\`` a nivel de módulo (no dentro de una clase), así que la mutación de abajo debe completarse antes de que esos módulos se evalúen por primera vez.
- **Depende de (archivos del proyecto):** [app.config.ts](root.md#f-comercial-jhoel-app-src-app-app-config-ts), [app.component.ts](root.md#f-comercial-jhoel-app-src-app-app-component-ts), [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts)
- **Paquetes externos:** `@angular/platform-browser`
- **Consumidores:** —
#### Función `resolveApiUrl` (L29–43)

- **Tipo:** función local del archivo
- **Firma:** `resolveApiUrl(): string` — [main.ts](../../../../comercial-jhoel-app/src/main.ts#L29)
- **Propósito / descripción:** Resuelve la URL pública del backend ANTES de que `bootstrapApplication` cargue el primer componente/servicio — la mayoría de los servicios de `core/services/*.service.ts` capturan `environment.apiUrl` en un `const BASE_URL = \`${environment.apiUrl}/...\`` a nivel de módulo (no dentro de una clase), así que la mutación de abajo debe completarse antes de que esos módulos se evalúen por primera vez. Como son componentes de features con `loadComponent` (carga perezosa por ruta), eso ya ocurre siempre después de este archivo — nunca antes. Precedencia (mayor a menor prioridad): 1. `window.__API_URL__` — override manual sin rebuild, ver `src/assets/runtime-config.js`. Pensado para cualquier URL pú
- **Dependencias:** `window.location.hostname.match`, `new URL`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `(top-level) bootstrapApplication(AppComponent, appConfig) .catch((err) =` (L47–48)

- **Tipo:** función local del archivo
- **Firma:** `(top-level) bootstrapApplication(AppComponent, appConfig) .catch((err) =()` — [main.ts](../../../../comercial-jhoel-app/src/main.ts#L47)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

