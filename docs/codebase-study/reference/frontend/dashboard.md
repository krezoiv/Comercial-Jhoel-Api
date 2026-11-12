# Frontend `dashboard`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [dashboard-layout.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DashboardLayoutComponent` (sin comentario de documentación en el código). | 6 internas; ext.: @angular/core, @angular/router | 1 | Baja (1 consumidores) |
| [dashboard-layout.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `dashboard-layout.component.ts`; usa 3 componentes hijos: `app-dashboard-sidebar`, `app-dashboard-topbar`, `app-change-password-modal`. | — | — | Media |
| [dashboard-layout.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts"></a>

### dashboard-layout.component.ts

- **Ruta:** [dashboard-layout.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.ts`, 98 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard`
- **Responsabilidad:** Componente Angular: declara `DashboardLayoutComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [purchase-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-purchase-draft-store-ts), [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts), [change-password-modal.component.ts](dashboard-change-password-modal.md#f-comercial-jhoel-app-src-app-features-dashboard-change-password-modal-change-password-modal-component-ts), [dashboard-sidebar.component.ts](dashboard-sidebar.md#f-comercial-jhoel-app-src-app-features-dashboard-sidebar-dashboard-sidebar-component-ts), [dashboard-topbar.component.ts](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-dashboard-topbar-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [dashboard-layout.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.html) · **Usa componentes:** [dashboard-sidebar.component.ts](dashboard-sidebar.md#f-comercial-jhoel-app-src-app-features-dashboard-sidebar-dashboard-sidebar-component-ts), [dashboard-topbar.component.ts](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-dashboard-topbar-component-ts), [change-password-modal.component.ts](dashboard-change-password-modal.md#f-comercial-jhoel-app-src-app-features-dashboard-change-password-modal-change-password-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(closeRequested)="closeSidebar()"`, `(logoutRequested)="logout()"`, `(collapseToggled)="toggleSidebarCollapse()"`, `(click)="closeSidebar()"`, `(menuToggled)="toggleSidebar()"`, `(changePasswordRequested)="openChangePassword()"`, `(closed)="closeChangePassword()"`

#### Clase `DashboardLayoutComponent` (L11–97)

- **Decoradores:** `@Component({ selector: 'app-dashboard-layout', standalone: true, imports: [RouterOutlet, DashboardSidebarComponent, DashboardTopbarComponent, ChangePasswordModal`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `authService = inject(AuthService)`, `router = inject(Router)`, `salesDraftStore = inject(SalesDraftStore)`, `purchaseDraftStore = inject(PurchaseDraftStore)`
- **Datos / estado que administra:** `isSidebarOpen = signal(false)`, `isChangePasswordOpen = signal(false)`, `isSidebarCollapsed = signal(this.readStoredCollapsedPreference())`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `readStoredCollapsedPreference` | método private | 36–42 | — | `boolean` |
| `closeSidebar` | método public | 44–46 | — | `void` |
| `toggleSidebar` | método public | 48–50 | — | `void` |
| `toggleSidebarCollapse` | método public | 52–62 | — | `void` |
| `openChangePassword` | método public | 64–66 | — | `void` |
| `closeChangePassword` | método public | 68–70 | — | `void` |
| `logout` | método public | 72–82 | — | `void` |
| `onBeforeUnload` | método public | 90–96 | `event: BeforeUnloadEvent` | `void` |

##### `DashboardLayoutComponent.readStoredCollapsedPreference`

- **Firma:** `readStoredCollapsedPreference(): boolean` — [dashboard-layout.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.ts#L36) (L36–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `localStorage.getItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DashboardLayoutComponent.closeSidebar`

- **Firma:** `closeSidebar(): void` — [dashboard-layout.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSidebarOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSidebarOpen.set`
- **Consumidores:** `dashboard-layout.component.html` (plantilla), (mismo archivo)

##### `DashboardLayoutComponent.toggleSidebar`

- **Firma:** `toggleSidebar(): void` — [dashboard-layout.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSidebarOpen.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSidebarOpen.update`
- **Consumidores:** `dashboard-layout.component.html` (plantilla)

##### `DashboardLayoutComponent.toggleSidebarCollapse`

- **Firma:** `toggleSidebarCollapse(): void` — [dashboard-layout.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.ts#L52) (L52–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSidebarCollapsed.update`, `localStorage.setItem`, `String`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSidebarCollapsed.update`
- **Consumidores:** `dashboard-layout.component.html` (plantilla)

##### `DashboardLayoutComponent.openChangePassword`

- **Firma:** `openChangePassword(): void` — [dashboard-layout.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isChangePasswordOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isChangePasswordOpen.set`
- **Consumidores:** `dashboard-layout.component.html` (plantilla)

##### `DashboardLayoutComponent.closeChangePassword`

- **Firma:** `closeChangePassword(): void` — [dashboard-layout.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.ts#L68) (L68–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isChangePasswordOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isChangePasswordOpen.set`
- **Consumidores:** `dashboard-layout.component.html` (plantilla)

##### `DashboardLayoutComponent.logout`

- **Firma:** `logout(): void` — [dashboard-layout.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.ts#L72) (L72–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closeSidebar`, `this.salesDraftStore.resetOnLogout`, `this.purchaseDraftStore.reset`, `this.authService.logout`, `this.router.navigateByUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `dashboard-layout.component.html` (plantilla)

##### `DashboardLayoutComponent.onBeforeUnload`

- **Firma:** `onBeforeUnload(event: BeforeUnloadEvent): void` — [dashboard-layout.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.ts#L90) (L90–96)
- **Decoradores:** `@HostListener('window:beforeunload', ['$event'])`
- **Propósito / descripción:** Only the Compras draft is at real risk from an accidental tab close — it lives in `sessionStorage`, which a reload survives but a closed tab doesn't. Ventas has nothing to warn about: its draft is already a real, server-persisted `OPEN` sale, so closing the tab can't lose it.
- **Dependencias (llamadas en su cuerpo):** `this.purchaseDraftStore.hasActiveDraft`, `event.preventDefault`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

