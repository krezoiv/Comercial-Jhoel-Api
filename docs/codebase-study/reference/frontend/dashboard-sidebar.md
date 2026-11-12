# Frontend `dashboard-sidebar`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [dashboard-sidebar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-sidebar-dashboard-sidebar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DashboardSidebarComponent` (sin comentario de documentación en el código). | 11 internas; ext.: @angular/core, @angular/common, @angular/router, rxjs | 2 | Baja (2 consumidores) |
| [dashboard-sidebar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `dashboard-sidebar.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [dashboard-sidebar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-sidebar-dashboard-sidebar-component-ts"></a>

### dashboard-sidebar.component.ts

- **Ruta:** [dashboard-sidebar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.ts`, 231 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-sidebar`
- **Responsabilidad:** Componente Angular: declara `DashboardSidebarComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [purchase-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-purchase-draft-store-ts), [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts), [ice-cream-purchase-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-purchase-draft-store-ts), [ice-cream-sale-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-sale-draft-store-ts), [bank-balance-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-balance-draft-store-ts), [day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-day-status-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/router`, `rxjs`
- **Consumidores:** [dashboard-layout.component.ts](dashboard.md#f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts), [dashboard-layout.component.ts (plantilla)](dashboard.md#f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts) (plantilla)
- **Plantilla:** [dashboard-sidebar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="collapseToggled.emit()"`, `(click)="toggleGroup(item.path)"`, `(click)="toggleSubgroup(child.path)"`, `(click)="closeRequested.emit()"`, `(click)="onLinkClick(leaf.path)"`, `(click)="logoutRequested.emit()"`

#### Clase `DashboardSidebarComponent` (L19–230)

- **Decoradores:** `@Component({ selector: 'app-dashboard-sidebar', standalone: true, imports: [RouterLink, RouterLinkActive, IconComponent, NgTemplateOutlet], templateUrl: './dashb`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `authService = inject(AuthService)`, `router = inject(Router)`, `salesDraftStore = inject(SalesDraftStore)`, `purchaseDraftStore = inject(PurchaseDraftStore)`, `iceCreamPurchaseDraftStore = inject(IceCreamPurchaseDraftStore)`, `iceCreamSaleDraftStore = inject(IceCreamSaleDraftStore)`, `bankBalanceDraftStore = inject(BankBalanceDraftStore)`, `dayStatusService = inject(DayStatusService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input collapsed = false`, `@Output closeRequested = new EventEmitter<void>()`, `@Output logoutRequested = new EventEmitter<void>()`, `@Output collapseToggled = new EventEmitter<void>()`, `expandedGroup = signal<string \| null>(null)`, `expandedSubgroup = signal<string \| null>(null)`, `navItems = computed<DashboardNavItem[]>(() => { const role = `, `hasSalesDraft = computed(() => this.salesDraftStore.hasActiveDraft`, `hasPurchaseDraft = computed(() => this.purchaseDraftStore.hasActiveDr`, `hasIceCreamPurchaseDraft = computed(() => this.iceCreamPurchaseDraftStore.has`, `hasIceCreamSaleDraft = computed(() => this.iceCreamSaleDraftStore.hasActi`, `hasBankBalanceDraft = computed(() => this.bankBalanceDraftStore.hasActiv`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `containsActiveRoute` | método private | 88–94 | `item: DashboardNavItem`, `url: string` | `boolean` |
| `hasDraftFor` | método public | 123–140 | `path: string` | `boolean` |
| `draftLabelFor` | método public | 142–147 | `path: string` | `string` |
| `isLinkDisabled` | método public | 165–173 | `path: string` | `boolean` |
| `linkTooltipFor` | método public | 175–183 | `path: string` | `string \| null` |
| `onLinkClick` | método public | 191–201 | `path: string` | `void` |
| `isExpanded` | método public | 203–205 | `path: string` | `boolean` |
| `isSubgroupExpanded` | método public | 207–209 | `path: string` | `boolean` |
| `toggleSubgroup` | método public | 211–213 | `path: string` | `void` |
| `toggleGroup` | método public | 222–229 | `path: string` | `void` |

##### `DashboardSidebarComponent.containsActiveRoute`

- **Firma:** `containsActiveRoute(item: DashboardNavItem, url: string): boolean` — [dashboard-sidebar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.ts#L88) (L88–94)
- **Propósito / descripción:** `true` si `item` es la ruta actual o contiene la ruta actual entre sus hijos (por segmento completo).
- **Dependencias (llamadas en su cuerpo):** `item.children.some`, `this.containsActiveRoute`, `url.split`, `path.startsWith`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DashboardSidebarComponent.hasDraftFor`

- **Firma:** `hasDraftFor(path: string): boolean` — [dashboard-sidebar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.ts#L123) (L123–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.hasSalesDraft`, `this.hasPurchaseDraft`, `this.hasIceCreamPurchaseDraft`, `this.hasIceCreamSaleDraft`, `this.hasBankBalanceDraft`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `dashboard-sidebar.component.html` (plantilla)

##### `DashboardSidebarComponent.draftLabelFor`

- **Firma:** `draftLabelFor(path: string): string` — [dashboard-sidebar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.ts#L142) (L142–147)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `dashboard-sidebar.component.html` (plantilla)

##### `DashboardSidebarComponent.isLinkDisabled`

- **Firma:** `isLinkDisabled(path: string): boolean` — [dashboard-sidebar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.ts#L165) (L165–173)
- **Propósito / descripción:** "Apertura del Día" — Cuadre Agentes permanece deshabilitado en el Sidebar hasta que el día de hoy esté aperturado Y sus saldos bancarios estén guardados (`DayStatusService`, el mismo singleton que la página de Bancos actualiza al aperturar/guardar, así que este enlace se habilita de inmediato sin recargar nada). Mientras el estado todavía no se conoce (`loading`), se trata como deshabilitado — nunca se asume "sí se puede" por defecto. "Cierre del Día" — Bancos también se bloquea, una vez que HOY quedó cerrado (`isClosed`). Se vuelve a habilitar solo, sin ningún código extra, al llegar la medianoche: `DayStatusService` siempre representa "hoy", así que en cuanto la fecha real cambia (con una 
- **Dependencias (llamadas en su cuerpo):** `this.dayStatusService.loading`, `this.dayStatusService.status`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `dashboard-sidebar.component.html` (plantilla), (mismo archivo)

##### `DashboardSidebarComponent.linkTooltipFor`

- **Firma:** `linkTooltipFor(path: string): string \| null` — [dashboard-sidebar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.ts#L175) (L175–183)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isLinkDisabled`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `dashboard-sidebar.component.html` (plantilla)

##### `DashboardSidebarComponent.onLinkClick`

- **Firma:** `onLinkClick(path: string): void` — [dashboard-sidebar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.ts#L191) (L191–201)
- **Propósito / descripción:** Clicar un enlace deshabilitado nunca navega (`[routerLink]` ya es `null` en ese estado) — esto solo añade la alerta explícita que pide el ticket para Bancos ya cerrado, en vez de dejar que el único indicio sea el tooltip pasivo del atributo `title`.
- **Dependencias (llamadas en su cuerpo):** `this.isLinkDisabled`, `this.closeRequested.emit`, `this.dayStatusService.status`, `this.notificationService.info`
- **Efectos secundarios:** Emite eventos: `this.closeRequested.emit`
- **Consumidores:** `dashboard-sidebar.component.html` (plantilla)

##### `DashboardSidebarComponent.isExpanded`

- **Firma:** `isExpanded(path: string): boolean` — [dashboard-sidebar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.ts#L203) (L203–205)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.expandedGroup`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `dashboard-sidebar.component.html` (plantilla)

##### `DashboardSidebarComponent.isSubgroupExpanded`

- **Firma:** `isSubgroupExpanded(path: string): boolean` — [dashboard-sidebar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.ts#L207) (L207–209)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.expandedSubgroup`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `dashboard-sidebar.component.html` (plantilla)

##### `DashboardSidebarComponent.toggleSubgroup`

- **Firma:** `toggleSubgroup(path: string): void` — [dashboard-sidebar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.ts#L211) (L211–213)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.expandedSubgroup.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.expandedSubgroup.update`
- **Consumidores:** `dashboard-sidebar.component.html` (plantilla)

##### `DashboardSidebarComponent.toggleGroup`

- **Firma:** `toggleGroup(path: string): void` — [dashboard-sidebar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/sidebar/dashboard-sidebar.component.ts#L222) (L222–229)
- **Propósito / descripción:** Acordeón exclusivo: clicar el grupo ya abierto lo cierra; clicar cualquier otro lo abre y cierra el anterior. Con el sidebar contraído (solo íconos), un submenú no tiene dónde mostrarse — clicar un grupo ahí primero lo expande de nuevo (vía el padre) y deja ese grupo abierto, en vez de alternar su estado a ciegas.
- **Dependencias (llamadas en su cuerpo):** `this.collapseToggled.emit`, `this.expandedGroup.set`, `this.expandedGroup.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.expandedGroup.set`, `this.expandedGroup.update`; Emite eventos: `this.collapseToggled.emit`
- **Consumidores:** `dashboard-sidebar.component.html` (plantilla)

